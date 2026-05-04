const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

function loadEnv() {
  const candidates = [
    path.resolve(__dirname, "../.env"),
    path.resolve(__dirname, "../../.env")
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate, override: false });
    }
  }
}

function required(name, value) {
  if (!value || !String(value).trim()) {
    throw new Error("Missing required environment variable: " + name);
  }
  return String(value).trim();
}

function getMysqlConfig() {
  loadEnv();

  const directUrl = String(process.env.MYSQL_URL || "").trim();
  if (directUrl) {
    const parsed = new URL(directUrl);
    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: decodeURIComponent(parsed.pathname.replace(/^\//, ""))
    };
  }

  return {
    host: String(process.env.MYSQL_HOST || "localhost").trim(),
    port: Number.parseInt(String(process.env.MYSQL_PORT || "3306"), 10) || 3306,
    user: required("MYSQL_USER", process.env.MYSQL_USER),
    password: String(process.env.MYSQL_PASSWORD || ""),
    database: required("MYSQL_DATABASE", process.env.MYSQL_DATABASE || process.env.MYSQL_DB)
  };
}

async function createPool(withoutDatabase = false) {
  const config = getMysqlConfig();
  return mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: withoutDatabase ? undefined : config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
  });
}

function splitSqlStatements(sql) {
  return String(sql)
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

module.exports = {
  createPool,
  getMysqlConfig,
  loadEnv,
  splitSqlStatements
};
