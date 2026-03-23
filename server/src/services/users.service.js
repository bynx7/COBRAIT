const config = require("../config");
const { query } = require("../db");
const { HttpError } = require("../utils/errors");

const PUBLIC_COLUMNS = `
  id,
  email,
  full_name,
  role,
  is_active,
  last_login_at,
  created_at,
  updated_at
`;

const VALID_ROLES = new Set(["admin", "editor", "viewer"]);

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeName(value) {
  return String(value || "").trim();
}

function normalizeRole(value) {
  return String(value || "").trim().toLowerCase();
}

function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Email invalido.");
  }
  return email;
}

function validateName(fullName) {
  if (fullName.length < 2) {
    throw new HttpError(400, "O nome deve ter pelo menos 2 caracteres.");
  }
  return fullName;
}

function validateRole(role) {
  if (!VALID_ROLES.has(role)) {
    throw new HttpError(400, "Role invalida. Usa admin, editor ou viewer.");
  }
  return role;
}

function validatePassword(password) {
  const value = String(password || "");
  if (value.length < 8) {
    throw new HttpError(400, "A password deve ter pelo menos 8 caracteres.");
  }
  return value;
}

function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function createAuditLog(actorUserId, action, targetType, targetId, details) {
  await query(
    `
      INSERT INTO admin_audit_logs (actor_user_id, action, target_type, target_id, details)
      VALUES ($1, $2, $3, $4, $5::jsonb)
    `,
    [actorUserId || null, action, targetType, targetId || null, JSON.stringify(details || {})]
  );
}

async function listUsers() {
  const result = await query(
    `
      SELECT ${PUBLIC_COLUMNS}
      FROM admin_users
      ORDER BY
        CASE role
          WHEN 'admin' THEN 0
          WHEN 'editor' THEN 1
          ELSE 2
        END,
        created_at DESC
    `
  );

  return result.rows.map(toPublicUser);
}

async function getUserById(id) {
  const result = await query(
    `
      SELECT ${PUBLIC_COLUMNS}
      FROM admin_users
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return toPublicUser(result.rows[0] || null);
}

async function getUserWithPasswordCheck(email, password) {
  const normalizedEmail = validateEmail(normalizeEmail(email));
  const normalizedPassword = validatePassword(password);

  const result = await query(
    `
      SELECT
        ${PUBLIC_COLUMNS},
        password_hash = crypt($2, password_hash) AS password_matches
      FROM admin_users
      WHERE lower(email) = lower($1)
      LIMIT 1
    `,
    [normalizedEmail, normalizedPassword]
  );

  if (!result.rows[0]) {
    return null;
  }

  return {
    user: toPublicUser(result.rows[0]),
    passwordMatches: result.rows[0].password_matches
  };
}

async function updateLastLogin(userId) {
  await query(
    `
      UPDATE admin_users
      SET last_login_at = now()
      WHERE id = $1
    `,
    [userId]
  );
}

async function createUser(payload) {
  const email = validateEmail(normalizeEmail(payload.email));
  const fullName = validateName(normalizeName(payload.fullName));
  const role = validateRole(normalizeRole(payload.role || "viewer"));
  const password = validatePassword(payload.password);
  const isActive = typeof payload.isActive === "boolean" ? payload.isActive : true;

  try {
    const result = await query(
      `
        INSERT INTO admin_users (email, full_name, role, password_hash, is_active)
        VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5)
        RETURNING ${PUBLIC_COLUMNS}
      `,
      [email, fullName, role, password, isActive]
    );

    return toPublicUser(result.rows[0]);
  } catch (error) {
    if (error && error.code === "23505") {
      throw new HttpError(409, "Ja existe um utilizador com esse email.");
    }
    throw error;
  }
}

async function countOtherActiveAdmins(excludedUserId) {
  const result = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM admin_users
      WHERE role = 'admin'
        AND is_active = true
        AND id <> $1
    `,
    [excludedUserId]
  );

  return result.rows[0] ? result.rows[0].total : 0;
}

async function updateUser(userId, payload) {
  const currentResult = await query(
    `
      SELECT ${PUBLIC_COLUMNS}
      FROM admin_users
      WHERE id = $1
      LIMIT 1
    `,
    [userId]
  );

  const current = currentResult.rows[0];
  if (!current) {
    throw new HttpError(404, "Utilizador nao encontrado.");
  }

  const nextRole = payload.role !== undefined ? validateRole(normalizeRole(payload.role)) : current.role;
  const nextIsActive =
    payload.isActive !== undefined
      ? (typeof payload.isActive === "boolean" ? payload.isActive : (() => { throw new HttpError(400, "isActive deve ser boolean."); })())
      : current.is_active;

  if (current.role === "admin" && current.is_active && (!nextIsActive || nextRole !== "admin")) {
    const otherAdmins = await countOtherActiveAdmins(userId);
    if (otherAdmins === 0) {
      throw new HttpError(400, "Nao podes remover ou desativar o ultimo administrador ativo.");
    }
  }

  const updates = [];
  const values = [];

  if (payload.email !== undefined) {
    values.push(validateEmail(normalizeEmail(payload.email)));
    updates.push(`email = $${values.length}`);
  }

  if (payload.fullName !== undefined) {
    values.push(validateName(normalizeName(payload.fullName)));
    updates.push(`full_name = $${values.length}`);
  }

  if (payload.role !== undefined) {
    values.push(nextRole);
    updates.push(`role = $${values.length}`);
  }

  if (payload.isActive !== undefined) {
    values.push(nextIsActive);
    updates.push(`is_active = $${values.length}`);
  }

  if (payload.password !== undefined) {
    const password = validatePassword(payload.password);
    values.push(password);
    updates.push(`password_hash = crypt($${values.length}, gen_salt('bf'))`);
  }

  if (updates.length === 0) {
    throw new HttpError(400, "Sem alteracoes para guardar.");
  }

  values.push(userId);

  try {
    const result = await query(
      `
        UPDATE admin_users
        SET ${updates.join(", ")}
        WHERE id = $${values.length}
        RETURNING ${PUBLIC_COLUMNS}
      `,
      values
    );

    return toPublicUser(result.rows[0]);
  } catch (error) {
    if (error && error.code === "23505") {
      throw new HttpError(409, "Ja existe um utilizador com esse email.");
    }
    throw error;
  }
}

async function ensureBootstrapAdmin() {
  if (!config.bootstrapAdminEmail || !config.bootstrapAdminPassword) {
    console.warn("Bootstrap admin skipped. Define ADMIN_EMAIL e ADMIN_PASSWORD em server/.env.");
    return;
  }

  const activeAdmins = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM admin_users
      WHERE role = 'admin'
        AND is_active = true
    `
  );

  if (activeAdmins.rows[0] && activeAdmins.rows[0].total > 0) {
    return;
  }

  const result = await query(
    `
      INSERT INTO admin_users (email, full_name, role, password_hash, is_active)
      VALUES ($1, $2, 'admin', crypt($3, gen_salt('bf')), true)
      ON CONFLICT DO NOTHING
      RETURNING id, email
    `,
    [config.bootstrapAdminEmail, config.bootstrapAdminName, config.bootstrapAdminPassword]
  );

  if (result.rowCount > 0) {
    console.log("Bootstrap admin criado:", result.rows[0].email);
    return;
  }

  const adminCountAfter = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM admin_users
      WHERE role = 'admin'
        AND is_active = true
    `
  );

  if (!adminCountAfter.rows[0] || adminCountAfter.rows[0].total === 0) {
    console.warn("Nenhum admin ativo encontrado. Verifica ADMIN_EMAIL e a tabela admin_users.");
  }
}

module.exports = {
  createAuditLog,
  createUser,
  ensureBootstrapAdmin,
  getUserById,
  getUserWithPasswordCheck,
  listUsers,
  updateLastLogin,
  updateUser
};

