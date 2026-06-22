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
const { getBuilderPage } = require("./services/page-builder.service");
const { renderBuilderPage } = require("./services/page-builder.renderer");

const app = express();
const allowedOrigins = new Set(config.corsOrigins);
const siteRoot = path.resolve(__dirname, "../..");
const staticPageFiles = new Set([
  "about-us.html",
  "admin.html",
  "book-a-call.html",
  "cookies.html",
  "index.html",
  "process.html",
  "privacidade.html",
  "servicos.html",
  "tech.html",
  "termos.html"
]);
const pageMap = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/admin.html", "admin.html"],
  ["/admin", "admin.html"],
  ["/about-us.html", "about-us.html"],
  ["/sobre-nos", "about-us.html"],
  ["/tech.html", "tech.html"],
  ["/tecnologia", "tech.html"],
  ["/book-a-call.html", "book-a-call.html"],
  ["/agendar-chamada", "book-a-call.html"],
  ["/privacidade.html", "privacidade.html"],
  ["/privacidade", "privacidade.html"],
  ["/termos.html", "termos.html"],
  ["/termos", "termos.html"],
  ["/cookies.html", "cookies.html"],
  ["/cookies", "cookies.html"],
  ["/process.html", "process.html"],
  ["/process", "process.html"],
  ["/servicos.html", "servicos.html"],
  ["/servicos", "servicos.html"],
  ["/servicos/product-scope.html", "servicos/product-scope.html"],
  ["/servicos/product-scope", "servicos/product-scope.html"],
  ["/servicos/mvp-builder.html", "servicos/mvp-builder.html"],
  ["/servicos/mvp-builder", "servicos/mvp-builder.html"],
  ["/servicos/ux-ui.html", "servicos/ux-ui.html"],
  ["/servicos/ux-ui", "servicos/ux-ui.html"],
  ["/servicos/custom-software.html", "servicos/custom-software.html"],
  ["/servicos/custom-software", "servicos/custom-software.html"],
  ["/servicos/dedicated-teams.html", "servicos/dedicated-teams.html"],
  ["/servicos/dedicated-teams", "servicos/dedicated-teams.html"]
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

function isMobileRequest(request) {
  const userAgent = String(request.get("user-agent") || "");
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

function buildMobilePreviewShell() {
  return `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#07091a">
    <title>Cobrait</title>
    <style>
      html,
      body {
        min-height: 100%;
        margin: 0;
        background: #07091a;
      }
    </style>
    <script>
      (function () {
        function leaveMobilePreview() {
          if (window.innerWidth <= 768) return;
          var url = new URL(window.location.href);
          if (!url.searchParams.has("__mobile")) return;
          url.searchParams.delete("__mobile");
          window.location.replace(url.href);
        }

        leaveMobilePreview();
        window.addEventListener("resize", leaveMobilePreview);
        window.addEventListener("orientationchange", leaveMobilePreview);
      })();
    </script>
  </head>
  <body>
    <script src="/assets/js/mobile-preview.js"></script>
  </body>
</html>`;
}

function sendPage(request, response, next) {
  const pathName = request.path || "/";
  const selectedFile = pageMap.get(pathName);

  if (!selectedFile) {
    next();
    return;
  }

  if (request.query.__mobile === "1" || isMobileRequest(request)) {
    response.type("html").send(buildMobilePreviewShell());
    return;
  }

  response.sendFile(path.join(siteRoot, selectedFile));
}

async function sendBuilderPage(request, response, next) {
  try {
    const slug = String(request.params.slug || "").toLowerCase();
    const page = await getBuilderPage(slug);

    if (!page || page.status !== "published") {
      next();
      return;
    }

    response.type("html").send(renderBuilderPage(page));
  } catch (error) {
    next(error);
  }
}

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use((request, response, next) => {
  const pathName = request.path || "";
  if (
    pathName === "/" ||
    pathName.endsWith(".html") ||
    pathName.includes("/assets/js/")
  ) {
    response.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.set("Pragma", "no-cache");
    response.set("Expires", "0");
  }
  next();
});

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
app.get(["/favicon-16x16.png", "/favicon-32x32.png", "/apple-touch-icon.png"], (request, response) => {
  const fileName = request.path.slice(1);
  response.sendFile(path.join(siteRoot, "assets", "images", "favicon", fileName));
});

app.get("/", sendPage);
app.get([
  "/sobre-nos",
  "/admin",
  "/admin.html",
  "/tecnologia",
  "/agendar-chamada",
  "/privacidade",
  "/termos",
  "/cookies",
  "/process",
  "/process.html",
  "/servicos",
  "/servicos.html",
  "/servicos/product-scope",
  "/servicos/product-scope.html",
  "/servicos/mvp-builder",
  "/servicos/mvp-builder.html",
  "/servicos/ux-ui",
  "/servicos/ux-ui.html",
  "/servicos/custom-software",
  "/servicos/custom-software.html",
  "/servicos/dedicated-teams",
  "/servicos/dedicated-teams.html"
], sendPage);

app.use("/servicos", express.static(path.join(siteRoot, "servicos"), { index: false }));

app.get("/:page", (request, response, next) => {
  const page = request.params.page;
  if (!staticPageFiles.has(page)) {
    next();
    return;
  }

  sendPage(request, response, next);
});

app.get("/:slug([a-z0-9-]+)", sendBuilderPage);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
