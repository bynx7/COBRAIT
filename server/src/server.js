const app = require("./app");
const config = require("./config");
const { query, pool } = require("./db");
const { ensureContentStorage } = require("./services/content.service");
const { ensureBootstrapAdmin } = require("./services/users.service");

async function start() {
  await query("SELECT 1");
  await ensureContentStorage();
  await ensureBootstrapAdmin();

  app.listen(config.port, config.host, () => {
    console.log(
      "COBRAIT admin API running on " +
      config.host +
      ":" +
      config.port +
      " (health: http://localhost:" +
      config.port +
      "/api/health)"
    );
  });
}

start().catch((error) => {
  console.error("Failed to start COBRAIT admin API.", error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});
