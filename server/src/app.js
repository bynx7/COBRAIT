const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const config = require("./config");
const { errorHandler, notFound } = require("./middleware/error-handler");
const authRoutes = require("./routes/auth.routes");
const contentRoutes = require("./routes/content.routes");
const opsRoutes = require("./routes/ops.routes");
const publicRoutes = require("./routes/public.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();
const allowedOrigins = new Set(config.corsOrigins);
const siteRoot = path.resolve(__dirname, "../..");
const staticPageFiles = new Set([
  "about-us.html",
  "admin.html",
  "book-a-call.html",
  "cookies.html",
  "index.html",
  "privacidade.html",
  "servicos.html",
  "tech.html",
  "termos.html"
]);
const STATIC_SITE_PORTS = new Set(["3000", "5500", "8080", "8092"]);
const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.size === 0 ||
      allowedOrigins.has(origin) ||
      isTrustedLocalOrigin(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true
};

function isLoopbackHostname(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isPrivateIpv4(hostname) {
  const value = String(hostname || "");
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(value)) return true;

  const match = value.match(/^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
  if (!match) return false;

  const secondOctet = Number.parseInt(match[1], 10);
  return Number.isFinite(secondOctet) && secondOctet >= 16 && secondOctet <= 31;
}

function isTrustedLocalOrigin(origin) {
  if (!origin) return false;

  try {
    const parsed = new URL(origin);
    const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");

    return (
      STATIC_SITE_PORTS.has(String(port)) &&
      (isLoopbackHostname(parsed.hostname) || isPrivateIpv4(parsed.hostname))
    );
  } catch (_error) {
    return false;
  }
}

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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

app.use("/assets", express.static(path.join(siteRoot, "assets"), { index: false }));
app.use("/servicos", express.static(path.join(siteRoot, "servicos"), { index: false }));

app.get("/", (request, response) => {
  response.sendFile(path.join(siteRoot, "index.html"));
});

app.get("/:page", (request, response, next) => {
  const page = request.params.page;
  if (!staticPageFiles.has(page)) {
    next();
    return;
  }

  response.sendFile(path.join(siteRoot, page));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
