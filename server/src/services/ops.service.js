const config = require("../config");
const { query } = require("../db");
const { createId, nowIso, queueWrite, readData, sortByCreatedAtDesc } = require("../storage/file-store");
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
  if (config.storageMode === "file") {
    const createdAt = nowIso();
    const nextContact = {
      id: createId(),
      full_name: validateName(payload.fullName),
      email: validateEmail(normalizeEmail(payload.email)),
      phone: normalizeNullableText(payload.phone),
      company: normalizeNullableText(payload.company),
      subject: normalizeNullableText(payload.subject),
      message: validateMessage(payload.message, "A mensagem"),
      source_page: normalizeNullableText(payload.sourcePage),
      source_campaign: normalizeNullableText(payload.sourceCampaign),
      status: "new",
      assigned_to: null,
      internal_notes: null,
      created_at: createdAt,
      updated_at: createdAt
    };

    await queueWrite((data) => {
      data.contactRequests.push(nextContact);
      return data;
    });

    return mapContact(nextContact);
  }

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
  if (config.storageMode === "file") {
    return sortByCreatedAtDesc(readData().contactRequests).map(mapContact);
  }

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
  if (config.storageMode === "file") {
    let updated = null;

    await queueWrite((data) => {
      const entry = data.contactRequests.find((item) => item.id === id);
      if (!entry) {
        throw new HttpError(404, "Pedido de contacto nao encontrado.");
      }

      let hasChanges = false;

      if (payload.fullName !== undefined) {
        entry.full_name = validateName(payload.fullName);
        hasChanges = true;
      }
      if (payload.email !== undefined) {
        entry.email = validateEmail(normalizeEmail(payload.email));
        hasChanges = true;
      }
      if (payload.phone !== undefined) {
        entry.phone = normalizeNullableText(payload.phone);
        hasChanges = true;
      }
      if (payload.company !== undefined) {
        entry.company = normalizeNullableText(payload.company);
        hasChanges = true;
      }
      if (payload.subject !== undefined) {
        entry.subject = normalizeNullableText(payload.subject);
        hasChanges = true;
      }
      if (payload.message !== undefined) {
        entry.message = validateMessage(payload.message, "A mensagem");
        hasChanges = true;
      }
      if (payload.status !== undefined) {
        entry.status = validateContactStatus(payload.status);
        hasChanges = true;
      }
      if (payload.assignedTo !== undefined) {
        entry.assigned_to = validateUuidOrNull(payload.assignedTo, "assignedTo");
        hasChanges = true;
      }
      if (payload.internalNotes !== undefined) {
        entry.internal_notes = normalizeNullableText(payload.internalNotes);
        hasChanges = true;
      }

      if (!hasChanges) {
        throw new HttpError(400, "Sem alteracoes para guardar.");
      }

      entry.updated_at = nowIso();
      updated = { ...entry };
      return data;
    });

    return mapContact(updated);
  }

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
  if (config.storageMode === "file") {
    const createdAt = nowIso();
    const nextBooking = {
      id: createId(),
      full_name: validateName(payload.fullName),
      email: validateEmail(normalizeEmail(payload.email)),
      phone: normalizeNullableText(payload.phone),
      company: normalizeNullableText(payload.company),
      project_summary: validateMessage(payload.projectSummary || payload.message, "O resumo do projeto"),
      preferred_date: validateDate(payload.preferredDate),
      preferred_time: normalizeNullableText(payload.preferredTime),
      timezone: normalizeNullableText(payload.timezone),
      budget_range: normalizeNullableText(payload.budgetRange),
      service_interest: normalizeNullableText(payload.serviceInterest),
      source_page: normalizeNullableText(payload.sourcePage),
      source_campaign: normalizeNullableText(payload.sourceCampaign),
      status: "new",
      assigned_to: null,
      meeting_url: null,
      meeting_at: null,
      internal_notes: null,
      created_at: createdAt,
      updated_at: createdAt
    };

    await queueWrite((data) => {
      data.callBookings.push(nextBooking);
      return data;
    });

    return mapBooking(nextBooking);
  }

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
  if (config.storageMode === "file") {
    return sortByCreatedAtDesc(readData().callBookings).map(mapBooking);
  }

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
  if (config.storageMode === "file") {
    let updated = null;

    await queueWrite((data) => {
      const entry = data.callBookings.find((item) => item.id === id);
      if (!entry) {
        throw new HttpError(404, "Pedido de agendamento nao encontrado.");
      }

      let hasChanges = false;

      if (payload.fullName !== undefined) {
        entry.full_name = validateName(payload.fullName);
        hasChanges = true;
      }
      if (payload.email !== undefined) {
        entry.email = validateEmail(normalizeEmail(payload.email));
        hasChanges = true;
      }
      if (payload.phone !== undefined) {
        entry.phone = normalizeNullableText(payload.phone);
        hasChanges = true;
      }
      if (payload.company !== undefined) {
        entry.company = normalizeNullableText(payload.company);
        hasChanges = true;
      }
      if (payload.projectSummary !== undefined) {
        entry.project_summary = validateMessage(payload.projectSummary, "O resumo do projeto");
        hasChanges = true;
      }
      if (payload.preferredDate !== undefined) {
        entry.preferred_date = validateDate(payload.preferredDate);
        hasChanges = true;
      }
      if (payload.preferredTime !== undefined) {
        entry.preferred_time = normalizeNullableText(payload.preferredTime);
        hasChanges = true;
      }
      if (payload.timezone !== undefined) {
        entry.timezone = normalizeNullableText(payload.timezone);
        hasChanges = true;
      }
      if (payload.budgetRange !== undefined) {
        entry.budget_range = normalizeNullableText(payload.budgetRange);
        hasChanges = true;
      }
      if (payload.serviceInterest !== undefined) {
        entry.service_interest = normalizeNullableText(payload.serviceInterest);
        hasChanges = true;
      }
      if (payload.sourcePage !== undefined) {
        entry.source_page = normalizeNullableText(payload.sourcePage);
        hasChanges = true;
      }
      if (payload.sourceCampaign !== undefined) {
        entry.source_campaign = normalizeNullableText(payload.sourceCampaign);
        hasChanges = true;
      }
      if (payload.status !== undefined) {
        entry.status = validateBookingStatus(payload.status);
        hasChanges = true;
      }
      if (payload.assignedTo !== undefined) {
        entry.assigned_to = validateUuidOrNull(payload.assignedTo, "assignedTo");
        hasChanges = true;
      }
      if (payload.meetingUrl !== undefined) {
        entry.meeting_url = normalizeNullableText(payload.meetingUrl);
        hasChanges = true;
      }
      if (payload.meetingAt !== undefined) {
        entry.meeting_at = validateDateTime(payload.meetingAt);
        hasChanges = true;
      }
      if (payload.internalNotes !== undefined) {
        entry.internal_notes = normalizeNullableText(payload.internalNotes);
        hasChanges = true;
      }

      if (!hasChanges) {
        throw new HttpError(400, "Sem alteracoes para guardar.");
      }

      entry.updated_at = nowIso();
      updated = { ...entry };
      return data;
    });

    return mapBooking(updated);
  }

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
