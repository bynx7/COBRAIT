const { Pool } = require("pg");
const config = require("./config");

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
  const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseSsl ? { rejectUnauthorized: false } : false
  });

  pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL client error.", error);
  });

  async function query(text, params) {
    return pool.query(text, params);
  }

  module.exports = {
    pool,
    query
  };
}

