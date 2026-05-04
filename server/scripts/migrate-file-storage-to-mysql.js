const fs = require("fs");
const path = require("path");
const { createPool, loadEnv } = require("./mysql-common");

function resolveStoragePath() {
  loadEnv();
  const relative = String(process.env.STORAGE_FILE || "server/data/local-storage.json").trim();
  const candidates = [
    path.resolve(__dirname, "../../", relative),
    path.resolve(__dirname, "../../server", relative.replace(/^server[\\/]/, "")),
    path.resolve(__dirname, "../server/data/local-storage.json"),
    path.resolve(__dirname, "../data/local-storage.json")
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Storage file not found: " + filePath);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function main() {
  const storagePath = resolveStoragePath();
  const data = readJson(storagePath);
  const pool = await createPool(false);

  try {
    await pool.query("START TRANSACTION");

    for (const user of data.users || []) {
      await pool.query(
        `
          INSERT INTO admin_users (
            id, email, full_name, role, password_hash, is_active, last_login_at, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            email = VALUES(email),
            full_name = VALUES(full_name),
            role = VALUES(role),
            password_hash = VALUES(password_hash),
            is_active = VALUES(is_active),
            last_login_at = VALUES(last_login_at),
            updated_at = VALUES(updated_at)
        `,
        [
          user.id,
          user.email,
          user.full_name,
          user.role,
          user.password_hash,
          user.is_active ? 1 : 0,
          user.last_login_at,
          toMysqlDate(user.created_at),
          toMysqlDate(user.updated_at)
        ]
      );
    }

    for (const log of data.auditLogs || []) {
      await pool.query(
        `
          INSERT INTO admin_audit_logs (
            id, actor_user_id, action, target_type, target_id, details, created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            actor_user_id = VALUES(actor_user_id),
            action = VALUES(action),
            target_type = VALUES(target_type),
            target_id = VALUES(target_id),
            details = VALUES(details),
            created_at = VALUES(created_at)
        `,
        [
          log.id,
          log.actorUserId || null,
          log.action,
          log.targetType,
          log.targetId || null,
          JSON.stringify(log.details || {}),
          toMysqlDate(log.createdAt)
        ]
      );
    }

    for (const contact of data.contactRequests || []) {
      await pool.query(
        `
          INSERT INTO contact_requests (
            id, full_name, email, phone, company, subject, message, source_page, source_campaign,
            status, assigned_to, internal_notes, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            full_name = VALUES(full_name),
            email = VALUES(email),
            phone = VALUES(phone),
            company = VALUES(company),
            subject = VALUES(subject),
            message = VALUES(message),
            source_page = VALUES(source_page),
            source_campaign = VALUES(source_campaign),
            status = VALUES(status),
            assigned_to = VALUES(assigned_to),
            internal_notes = VALUES(internal_notes),
            updated_at = VALUES(updated_at)
        `,
        [
          contact.id,
          contact.full_name,
          contact.email,
          contact.phone || null,
          contact.company || null,
          contact.subject || null,
          contact.message,
          contact.source_page || null,
          contact.source_campaign || null,
          contact.status,
          contact.assigned_to || null,
          contact.internal_notes || null,
          toMysqlDate(contact.created_at),
          toMysqlDate(contact.updated_at)
        ]
      );
    }

    for (const booking of data.callBookings || []) {
      await pool.query(
        `
          INSERT INTO call_bookings (
            id, full_name, email, phone, company, project_summary, preferred_date, preferred_time,
            timezone, budget_range, service_interest, source_page, source_campaign, status,
            assigned_to, meeting_url, meeting_at, internal_notes, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            full_name = VALUES(full_name),
            email = VALUES(email),
            phone = VALUES(phone),
            company = VALUES(company),
            project_summary = VALUES(project_summary),
            preferred_date = VALUES(preferred_date),
            preferred_time = VALUES(preferred_time),
            timezone = VALUES(timezone),
            budget_range = VALUES(budget_range),
            service_interest = VALUES(service_interest),
            source_page = VALUES(source_page),
            source_campaign = VALUES(source_campaign),
            status = VALUES(status),
            assigned_to = VALUES(assigned_to),
            meeting_url = VALUES(meeting_url),
            meeting_at = VALUES(meeting_at),
            internal_notes = VALUES(internal_notes),
            updated_at = VALUES(updated_at)
        `,
        [
          booking.id,
          booking.full_name,
          booking.email,
          booking.phone || null,
          booking.company || null,
          booking.project_summary || null,
          booking.preferred_date || null,
          booking.preferred_time || null,
          booking.timezone || null,
          booking.budget_range || null,
          booking.service_interest || null,
          booking.source_page || null,
          booking.source_campaign || null,
          booking.status,
          booking.assigned_to || null,
          booking.meeting_url || null,
          toMysqlDate(booking.meeting_at),
          booking.internal_notes || null,
          toMysqlDate(booking.created_at),
          toMysqlDate(booking.updated_at)
        ]
      );
    }

    for (const entry of data.siteContentEntries || []) {
      await pool.query(
        `
          INSERT INTO site_content_entries (
            page_key, content, updated_by, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            content = VALUES(content),
            updated_by = VALUES(updated_by),
            updated_at = VALUES(updated_at)
        `,
        [
          entry.page_key,
          JSON.stringify(entry.content || {}),
          entry.updated_by || null,
          toMysqlDate(entry.created_at),
          toMysqlDate(entry.updated_at)
        ]
      );
    }

    await pool.query("COMMIT");
    console.log("File storage migrated to MySQL successfully.");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  } finally {
    await pool.end();
  }
}

function toMysqlDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 19).replace("T", " ");
}

main().catch((error) => {
  console.error("Failed to migrate file storage to MySQL.", error);
  process.exit(1);
});
