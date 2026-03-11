require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error("Missing required environment variable: " + name);
  }
  return String(value).trim();
}

function parseBoolean(value, fallback) {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const sessionMaxAgeHours = parsePositiveInt(process.env.SESSION_MAX_AGE_HOURS, 12);

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: parsePositiveInt(process.env.PORT, 4000),
  databaseUrl: required("DATABASE_URL"),
  databaseSsl: parseBoolean(process.env.DATABASE_SSL, false),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || sessionMaxAgeHours + "h",
  sessionCookieName: process.env.SESSION_COOKIE_NAME || "cobrait_admin_session",
  sessionCookieSecure: parseBoolean(process.env.SESSION_COOKIE_SECURE, false),
  sessionMaxAgeHours,
  corsOrigins: parseList(process.env.CORS_ORIGINS || "http://localhost:5500,http://127.0.0.1:5500"),
  bootstrapAdminEmail: String(process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
  bootstrapAdminPassword: String(process.env.ADMIN_PASSWORD || ""),
  bootstrapAdminName: String(process.env.ADMIN_NAME || "COBRAIT Admin").trim()
};
