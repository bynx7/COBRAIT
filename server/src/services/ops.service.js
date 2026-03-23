const { query } = require("../db");
const { HttpError } = require("../utils/errors");

const CONTACT_COLUMNS = `
  id,
  full_name,
  email,
  phone,
  company,
  subject,
  message,
  source_page,
  source_campaign,
  status,
  assigned_to,
  internal_notes,
  created_at,
  updated_at
`;

const BOOKING_COLUMNS = `
  id,
  full_name,
  email,
  phone,
  company,
  project_summary,
  preferred_date,
  preferred_time,
  timezone,
  budget_range,
  service_interest,
  source_page,
  source_campaign,
  status,
  assigned_to,
  meeting_url,
  meeting_at,
  internal_notes,
  created_at,
  updated_at
`;

const CONTACT_STATUSES = new Set(["new", "contacted", "qualified", "proposal_sent", "won", "lost", "archived"]);
const BOOKING_STATUSES = new Set(["new", "contacted", "scheduled", "confirmed", "completed", "cancelled", "no_show"]);

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeNullableText(value) {
  const text = normalizeText(value);
  return text || null;
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Email invalido.");
  }
  return email;
}

function validateName(value) {
  const text = normalizeText(value);
  if (text.length < 2) {
    throw new HttpError(400, "O nome deve ter pelo menos 2 caracteres.");
  }
  return text;
}

function validateMessage(value, fieldName) {
  const text = normalizeText(value);
  if (text.length < 5) {
    throw new HttpError(400, fieldName + " deve ter pelo menos 5 caracteres.");
  }
  return text;
}

function validateDate(value) {
  const text = normalizeNullableText(value);
  if (!text) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new HttpError(400, "preferredDate deve estar em YYYY-MM-DD.");
  }
  return text;
}

function validateDateTime(value) {
  const text = normalizeNullableText(value);
  if (!text) return null;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    throw new HttpError(400, "meetingAt deve ser uma data valida.");
  }
  return parsed.toISOString();
}

function validateUuidOrNull(value, fieldName) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const text = normalizeText(value);
  if (!/^[0-9a-fA-F-]{36}$/.test(text)) {
    throw new HttpError(400, fieldName + " deve ser um UUID valido.");
  }
  return text;
}

function validateContactStatus(value) {
  const text = normalizeText(value).toLowerCase();
  if (!CONTACT_STATUSES.has(text)) {
    throw new HttpError(400, "Status de contacto invalido.");
  }
  return text;
}

function validateBookingStatus(value) {
  const text = normalizeText(value).toLowerCase();
  if (!BOOKING_STATUSES.has(text)) {
    throw new HttpError(400, "Status de agendamento invalido.");
  }
  return text;
}

function mapContact(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    subject: row.subject,
    message: row.message,
    sourcePage: row.source_page,
    sourceCampaign: row.source_campaign,
    status: row.status,
    assignedTo: row.assigned_to,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapBooking(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    projectSummary: row.project_summary,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    timezone: row.timezone,
    budgetRange: row.budget_range,
    serviceInterest: row.service_interest,
    sourcePage: row.source_page,
    sourceCampaign: row.source_campaign,
    status: row.status,
    assignedTo: row.assigned_to,
    meetingUrl: row.meeting_url,
    meetingAt: row.meeting_at,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function createContactRequest(payload) {
  const result = await query(
    `
      INSERT INTO contact_requests (
        full_name,
        email,
        phone,
        company,
        subject,
        message,
        source_page,
        source_campaign
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING ${CONTACT_COLUMNS}
    `,
    [
      validateName(payload.fullName),
      validateEmail(normalizeEmail(payload.email)),
      normalizeNullableText(payload.phone),
      normalizeNullableText(payload.company),
      normalizeNullableText(payload.subject),
      validateMessage(payload.message, "A mensagem"),
      normalizeNullableText(payload.sourcePage),
      normalizeNullableText(payload.sourceCampaign)
    ]
  );

  return mapContact(result.rows[0]);
}

async function listContactRequests() {
  const result = await query(
    `
      SELECT ${CONTACT_COLUMNS}
      FROM contact_requests
      ORDER BY created_at DESC
    `
  );

  return result.rows.map(mapContact);
}

async function updateContactRequest(id, payload) {
  const updates = [];
  const values = [];

  if (payload.fullName !== undefined) {
    values.push(validateName(payload.fullName));
    updates.push(`full_name = $${values.length}`);
  }

  if (payload.email !== undefined) {
    values.push(validateEmail(normalizeEmail(payload.email)));
    updates.push(`email = $${values.length}`);
  }

  if (payload.phone !== undefined) {
    values.push(normalizeNullableText(payload.phone));
    updates.push(`phone = $${values.length}`);
  }

  if (payload.company !== undefined) {
    values.push(normalizeNullableText(payload.company));
    updates.push(`company = $${values.length}`);
  }

  if (payload.subject !== undefined) {
    values.push(normalizeNullableText(payload.subject));
    updates.push(`subject = $${values.length}`);
  }

  if (payload.message !== undefined) {
    values.push(validateMessage(payload.message, "A mensagem"));
    updates.push(`message = $${values.length}`);
  }

  if (payload.status !== undefined) {
    values.push(validateContactStatus(payload.status));
    updates.push(`status = $${values.length}`);
  }

  if (payload.assignedTo !== undefined) {
    values.push(validateUuidOrNull(payload.assignedTo, "assignedTo"));
    updates.push(`assigned_to = $${values.length}`);
  }

  if (payload.internalNotes !== undefined) {
    values.push(normalizeNullableText(payload.internalNotes));
    updates.push(`internal_notes = $${values.length}`);
  }

  if (updates.length === 0) {
    throw new HttpError(400, "Sem alteracoes para guardar.");
  }

  values.push(id);

  const result = await query(
    `
      UPDATE contact_requests
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING ${CONTACT_COLUMNS}
    `,
    values
  );

  if (!result.rows[0]) {
    throw new HttpError(404, "Pedido de contacto nao encontrado.");
  }

  return mapContact(result.rows[0]);
}

async function createCallBooking(payload) {
  const result = await query(
    `
      INSERT INTO call_bookings (
        full_name,
        email,
        phone,
        company,
        project_summary,
        preferred_date,
        preferred_time,
        timezone,
        budget_range,
        service_interest,
        source_page,
        source_campaign
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING ${BOOKING_COLUMNS}
    `,
    [
      validateName(payload.fullName),
      validateEmail(normalizeEmail(payload.email)),
      normalizeNullableText(payload.phone),
      normalizeNullableText(payload.company),
      validateMessage(payload.projectSummary || payload.message, "O resumo do projeto"),
      validateDate(payload.preferredDate),
      normalizeNullableText(payload.preferredTime),
      normalizeNullableText(payload.timezone),
      normalizeNullableText(payload.budgetRange),
      normalizeNullableText(payload.serviceInterest),
      normalizeNullableText(payload.sourcePage),
      normalizeNullableText(payload.sourceCampaign)
    ]
  );

  return mapBooking(result.rows[0]);
}

async function listCallBookings() {
  const result = await query(
    `
      SELECT ${BOOKING_COLUMNS}
      FROM call_bookings
      ORDER BY created_at DESC
    `
  );

  return result.rows.map(mapBooking);
}

async function updateCallBooking(id, payload) {
  const updates = [];
  const values = [];

  if (payload.fullName !== undefined) {
    values.push(validateName(payload.fullName));
    updates.push(`full_name = $${values.length}`);
  }

  if (payload.email !== undefined) {
    values.push(validateEmail(normalizeEmail(payload.email)));
    updates.push(`email = $${values.length}`);
  }

  if (payload.phone !== undefined) {
    values.push(normalizeNullableText(payload.phone));
    updates.push(`phone = $${values.length}`);
  }

  if (payload.company !== undefined) {
    values.push(normalizeNullableText(payload.company));
    updates.push(`company = $${values.length}`);
  }

  if (payload.projectSummary !== undefined) {
    values.push(validateMessage(payload.projectSummary, "O resumo do projeto"));
    updates.push(`project_summary = $${values.length}`);
  }

  if (payload.preferredDate !== undefined) {
    values.push(validateDate(payload.preferredDate));
    updates.push(`preferred_date = $${values.length}`);
  }

  if (payload.preferredTime !== undefined) {
    values.push(normalizeNullableText(payload.preferredTime));
    updates.push(`preferred_time = $${values.length}`);
  }

  if (payload.timezone !== undefined) {
    values.push(normalizeNullableText(payload.timezone));
    updates.push(`timezone = $${values.length}`);
  }

  if (payload.budgetRange !== undefined) {
    values.push(normalizeNullableText(payload.budgetRange));
    updates.push(`budget_range = $${values.length}`);
  }

  if (payload.serviceInterest !== undefined) {
    values.push(normalizeNullableText(payload.serviceInterest));
    updates.push(`service_interest = $${values.length}`);
  }

  if (payload.sourcePage !== undefined) {
    values.push(normalizeNullableText(payload.sourcePage));
    updates.push(`source_page = $${values.length}`);
  }

  if (payload.sourceCampaign !== undefined) {
    values.push(normalizeNullableText(payload.sourceCampaign));
    updates.push(`source_campaign = $${values.length}`);
  }

  if (payload.status !== undefined) {
    values.push(validateBookingStatus(payload.status));
    updates.push(`status = $${values.length}`);
  }

  if (payload.assignedTo !== undefined) {
    values.push(validateUuidOrNull(payload.assignedTo, "assignedTo"));
    updates.push(`assigned_to = $${values.length}`);
  }

  if (payload.meetingUrl !== undefined) {
    values.push(normalizeNullableText(payload.meetingUrl));
    updates.push(`meeting_url = $${values.length}`);
  }

  if (payload.meetingAt !== undefined) {
    values.push(validateDateTime(payload.meetingAt));
    updates.push(`meeting_at = $${values.length}`);
  }

  if (payload.internalNotes !== undefined) {
    values.push(normalizeNullableText(payload.internalNotes));
    updates.push(`internal_notes = $${values.length}`);
  }

  if (updates.length === 0) {
    throw new HttpError(400, "Sem alteracoes para guardar.");
  }

  values.push(id);

  const result = await query(
    `
      UPDATE call_bookings
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING ${BOOKING_COLUMNS}
    `,
    values
  );

  if (!result.rows[0]) {
    throw new HttpError(404, "Pedido de agendamento nao encontrado.");
  }

  return mapBooking(result.rows[0]);
}

module.exports = {
  createCallBooking,
  createContactRequest,
  listCallBookings,
  listContactRequests,
  updateCallBooking,
  updateContactRequest
};
