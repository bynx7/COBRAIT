const config = require("../config");
const { getUserById } = require("../services/users.service");
const { HttpError } = require("../utils/errors");
const { verifySessionToken } = require("../utils/session");

function extractToken(request) {
  const fromCookie = request.cookies ? request.cookies[config.sessionCookieName] : "";
  if (fromCookie) return fromCookie;

  const header = request.get("authorization") || "";
  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  return "";
}

async function requireAuth(request, response, next) {
  try {
    const token = extractToken(request);
    if (!token) {
      throw new HttpError(401, "Sessao em falta.");
    }

    const payload = verifySessionToken(token);
    const user = await getUserById(payload.sub);

    if (!user || !user.isActive) {
      throw new HttpError(401, "Sessao invalida ou expirada.");
    }

    request.user = user;
    next();
  } catch (error) {
    if (error && (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")) {
      next(new HttpError(401, "Sessao invalida ou expirada."));
      return;
    }
    next(error);
  }
}

function requireAdmin(request, response, next) {
  if (!request.user || request.user.role !== "admin") {
    next(new HttpError(403, "Acesso reservado a administradores."));
    return;
  }

  next();
}

module.exports = {
  requireAdmin,
  requireAuth
};

