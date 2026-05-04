const fs = require("fs");
const path = require("path");
const { createPool, getMysqlConfig, splitSqlStatements } = require("./mysql-common");

async function main() {
  const config = getMysqlConfig();
  const adminPool = await createPool(true);

  try {
    await adminPool.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database.replace(/`/g, "``")}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await adminPool.end();
  }

  const pool = await createPool(false);
  try {
    const sqlPath = path.resolve(__dirname, "../sql/mysql/001_init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    const statements = splitSqlStatements(sql);

    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log(`MySQL schema ready in database "${config.database}".`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to set up MySQL schema.", error);
  process.exit(1);
});
