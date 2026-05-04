const config = require("../config");
const { query } = require("../db");
const { nowIso, queueWrite, readData } = require("../storage/file-store");
const { HttpError } = require("../utils/errors");

const PAGE_KEY_REGEX = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const FIELD_KEY_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,255}$/;
let ensureStoragePromise = null;

function normalizeText(value) {
  return String(value || "").trim();
}

function validatePageKey(value) {
  const pageKey = normalizeText(value).toLowerCase();
  if (!PAGE_KEY_REGEX.test(pageKey)) {
    throw new HttpError(400, "pageKey invalido.");
  }
  return pageKey;
}

function validateContentObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "content deve ser um objeto.");
  }

  const content = {};

  for (const [rawKey, rawValue] of Object.entries(value)) {
    const key = normalizeText(rawKey);
    if (!FIELD_KEY_REGEX.test(key)) {
      throw new HttpError(400, "Campo de conteudo invalido: " + rawKey);
    }

    const text = String(rawValue == null ? "" : rawValue);
    if (text.length > 5000) {
      throw new HttpError(400, "O campo " + key + " excede o limite de 5000 caracteres.");
    }

    content[key] = text;
  }

  return content;
}

function mapContentEntry(row) {
  if (!row) return null;
  let content = row.content || {};
  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch {
      content = {};
    }
  }
  return {
    pageKey: row.page_key,
    content,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function ensureContentStorage() {
  if (config.storageMode === "file") {
    return;
  }

  if (!ensureStoragePromise) {
    ensureStoragePromise = (async () => {
      if (config.databaseClient === "mysql") {
        await query(`
          CREATE TABLE IF NOT EXISTS site_content_entries (
            page_key VARCHAR(64) PRIMARY KEY,
            content JSON NOT NULL,
            updated_by VARCHAR(36) NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_site_content_entries_updated_by
              FOREIGN KEY (updated_by) REFERENCES admin_users(id)
              ON DELETE SET NULL
          )
        `);

        await query(`
          CREATE INDEX site_content_entries_updated_at_idx
          ON site_content_entries (updated_at)
        `).catch(() => {});
      } else {
        await query(`
          CREATE TABLE IF NOT EXISTS site_content_entries (
            page_key TEXT PRIMARY KEY,
            content JSONB NOT NULL DEFAULT '{}'::jsonb,
            updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )
        `);

        await query(`
          CREATE INDEX IF NOT EXISTS site_content_entries_updated_at_idx
          ON site_content_entries (updated_at DESC)
        `);
      }
    })().catch((error) => {
      ensureStoragePromise = null;
      throw error;
    });
  }

  return ensureStoragePromise;
}

async function listSiteContentEntries() {
  if (config.storageMode === "file") {
    return readData()
      .siteContentEntries
      .slice()
      .sort((left, right) => String(left.page_key || "").localeCompare(String(right.page_key || "")))
      .map(mapContentEntry);
  }

  await ensureContentStorage();
  const result = await query(`
    SELECT page_key, content, updated_by, created_at, updated_at
    FROM site_content_entries
    ORDER BY page_key ASC
  `);

  return result.rows.map(mapContentEntry);
}

async function getSiteContentEntry(pageKeyInput) {
  if (config.storageMode === "file") {
    const pageKey = validatePageKey(pageKeyInput);
    const entry = readData().siteContentEntries.find((item) => item.page_key === pageKey);
    return mapContentEntry(entry || null);
  }

  await ensureContentStorage();
  const pageKey = validatePageKey(pageKeyInput);
  const result = await query(
    `
      SELECT page_key, content, updated_by, created_at, updated_at
      FROM site_content_entries
      WHERE page_key = $1
      LIMIT 1
    `,
    [pageKey]
  );

  return mapContentEntry(result.rows[0] || null);
}

async function upsertSiteContentEntry(pageKeyInput, contentInput, updatedBy) {
  if (config.storageMode === "file") {
    const pageKey = validatePageKey(pageKeyInput);
    const content = validateContentObject(contentInput);
    const actorId = updatedBy || null;
    let updated = null;

    await queueWrite((data) => {
      const existing = data.siteContentEntries.find((item) => item.page_key === pageKey);

      if (existing) {
        existing.content = content;
        existing.updated_by = actorId;
        existing.updated_at = nowIso();
        updated = { ...existing };
        return data;
      }

      updated = {
        page_key: pageKey,
        content,
        updated_by: actorId,
        created_at: nowIso(),
        updated_at: nowIso()
      };
      data.siteContentEntries.push(updated);
      return data;
    });

    return mapContentEntry(updated);
  }

  await ensureContentStorage();
  const pageKey = validatePageKey(pageKeyInput);
  const content = validateContentObject(contentInput);
  const actorId = updatedBy || null;

  if (config.databaseClient === "mysql") {
    await query(
      `
        INSERT INTO site_content_entries (page_key, content, updated_by)
        VALUES ($1, $2, $3)
        ON DUPLICATE KEY UPDATE
          content = VALUES(content),
          updated_by = VALUES(updated_by),
          updated_at = CURRENT_TIMESTAMP
      `,
      [pageKey, JSON.stringify(content), actorId]
    );
  } else {
    await query(
      `
        INSERT INTO site_content_entries (page_key, content, updated_by)
        VALUES ($1, $2::jsonb, $3)
        ON CONFLICT (page_key)
        DO UPDATE SET
          content = EXCLUDED.content,
          updated_by = EXCLUDED.updated_by,
          updated_at = now()
      `,
      [pageKey, JSON.stringify(content), actorId]
    );
  }

  return getSiteContentEntry(pageKey);
}

module.exports = {
  ensureContentStorage,
  getSiteContentEntry,
  listSiteContentEntries,
  upsertSiteContentEntry
};
