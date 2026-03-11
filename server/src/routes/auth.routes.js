const express = require("express");
const {
  createAuditLog,
  getUserById,
  getUserWithPasswordCheck,
  updateLastLogin
} = require("../services/users.service");
const { HttpError } = require("../utils/errors");
const { clearSessionCookie, setSessionCookie, signSessionToken } = require("../utils/session");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/login", async (request, response, next) => {
  try {
    const email = String(request.body && request.body.email ? request.body.email : "");
    const password = String(request.body && request.body.password ? request.body.password : "");

    if (!email || !password) {
      throw new HttpError(400, "Email e password sao obrigatorios.");
    }

    const result = await getUserWithPasswordCheck(email, password);
    if (!result || !result.passwordMatches) {
      throw new HttpError(401, "Credenciais invalidas.");
    }

    if (!result.user.isActive) {
      throw new HttpError(403, "Utilizador inativo.");
    }

    await updateLastLogin(result.user.id);
    const freshUser = await getUserById(result.user.id);
    const token = signSessionToken(freshUser);

    setSessionCookie(response, token);
    await createAuditLog(freshUser.id, "auth.login", "admin_user", freshUser.id, {
      email: freshUser.email
    });

    response.json({
      user: freshUser
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (request, response) => {
  clearSessionCookie(response);
  response.json({ ok: true });
});

router.get("/me", requireAuth, async (request, response) => {
  response.json({
    user: request.user
  });
});

module.exports = router;

