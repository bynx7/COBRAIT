const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const config = require("./config");
const { errorHandler, notFound } = require("./middleware/error-handler");
const authRoutes = require("./routes/auth.routes");
const contentRoutes = require("./routes/content.routes");
const opsRoutes = require("./routes/ops.routes");
const publicRoutes = require("./routes/public.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();
const allowedOrigins = new Set(config.corsOrigins);

function isLoopbackOrigin(origin) {
  if (!origin) return false;

  try {
    const parsed = new URL(origin);
    return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  } catch (_error) {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.size === 0 ||
        allowedOrigins.has(origin) ||
        isLoopbackOrigin(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", async (request, response) => {
  response.json({
    ok: true,
    service: "cobrait-admin-api"
  });
});

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api", contentRoutes);
app.use("/api", opsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
