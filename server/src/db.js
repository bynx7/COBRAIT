const config = require("./config");
const { Pool } = require("pg");
const mysql = require("mysql2/promise");

function convertPgPlaceholdersToMysql(text, params) {
  if (!params || params.length === 0) {
    return { sql: text, values: [] };
  }

  const values = [];
  const sql = String(text).replace(/\$(\d+)/g, (_, rawIndex) => {
    const index = Number.parseInt(rawIndex, 10) - 1;
    values.push(params[index]);
    return "?";
  });

  return { sql, values };
}

function buildMysqlPoolConfig(databaseUrl) {
  const parsed = new URL(databaseUrl);
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: decodeURIComponent(parsed.pathname.replace(/^\//, "")),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

if (config.storageMode === "file") {
  module.exports = {
    pool: {
      end: async () => {}
    },
    query: async () => {
      throw new Error("SQL query attempted while STORAGE_MODE=file.");
    }
  };
} else {
  let pool;

  if (config.databaseClient === "mysql") {
    pool = mysql.createPool({
      ...buildMysqlPoolConfig(config.databaseUrl),
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined
    });
  } else {
    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : false
    });

    pool.on("error", (error) => {
      console.error("Unexpected PostgreSQL client error.", error);
    });
  }

  async function query(text, params = []) {
    if (config.databaseClient === "mysql") {
      const { sql, values } = convertPgPlaceholdersToMysql(text, params);
      const [rows] = await pool.query(sql, values);
      return {
        rows: Array.isArray(rows) ? rows : [],
        rowCount: Array.isArray(rows) ? rows.length : Number(rows && rows.affectedRows) || 0,
        insertId: rows && rows.insertId ? rows.insertId : null
      };
    }

    return pool.query(text, params);
  }

  module.exports = {
    pool,
    query
  };
}

