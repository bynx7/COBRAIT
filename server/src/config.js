const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

loadEnvFiles([
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env")
]);

function loadEnvFiles(paths) {
  paths.forEach((envPath) => {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: false });
    }
  });
}

function requiredValue(value, name) {
  if (!value || !String(value).trim()) {
    throw new Error("Missing required environment variable: " + name);
  }
  return String(value).trim();
}

function firstNonEmpty(names, fallback = "") {
  for (const name of names) {
    const value = process.env[name];
    if (value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }
  return fallback;
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

function buildDatabaseUrl() {
  const directUrl = firstNonEmpty(["DATABASE_URL"]);
  if (directUrl) {
    return directUrl;
  }

  const databaseName = firstNonEmpty(["POSTGRES_DB"]);
  const username = firstNonEmpty(["POSTGRES_USER"]);
  const password = firstNonEmpty(["POSTGRES_PASSWORD"]);

  if (!databaseName || !username || !password) {
    return "";
  }

  const host = firstNonEmpty(["POSTGRES_HOST"], "localhost");
  const port = firstNonEmpty(["POSTGRES_PORT"], "5432");

  return "postgres://" +
    encodeURIComponent(username) +
    ":" +
    encodeURIComponent(password) +
    "@" +
    host +
    ":" +
    port +
    "/" +
    encodeURIComponent(databaseName);
}

const sessionMaxAgeHours = parsePositiveInt(process.env.SESSION_MAX_AGE_HOURS, 12);

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: parsePositiveInt(firstNonEmpty(["PORT", "API_PORT"]), 4000),
  databaseUrl: requiredValue(buildDatabaseUrl(), "DATABASE_URL (or POSTGRES_DB/POSTGRES_USER/POSTGRES_PASSWORD)"),
  databaseSsl: parseBoolean(process.env.DATABASE_SSL, false),
  jwtSecret: requiredValue(firstNonEmpty(["JWT_SECRET"]), "JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || sessionMaxAgeHours + "h",
  sessionCookieName: process.env.SESSION_COOKIE_NAME || "cobrait_admin_session",
  sessionCookieSecure: parseBoolean(process.env.SESSION_COOKIE_SECURE, false),
  sessionMaxAgeHours,
  corsOrigins: parseList(process.env.CORS_ORIGINS || "http://localhost:5500,http://127.0.0.1:5500"),
  bootstrapAdminEmail: String(process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
  bootstrapAdminPassword: String(process.env.ADMIN_PASSWORD || ""),
  bootstrapAdminName: String(process.env.ADMIN_NAME || "COBRAIT Admin").trim(),
  openaiApiKey: String(process.env.OPENAI_API_KEY || "").trim(),
  openaiChatModel: String(process.env.OPENAI_CHAT_MODEL || "gpt-5.4-mini").trim()
};
