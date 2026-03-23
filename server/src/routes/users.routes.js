const express = require("express");
const { requireAdmin, requireAuth } = require("../middleware/auth");
const { createAuditLog, createUser, listUsers, updateUser } = require("../services/users.service");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", async (request, response, next) => {
  try {
    const users = await listUsers();
    response.json({ users });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const user = await createUser(request.body || {});

    await createAuditLog(request.user.id, "users.create", "admin_user", user.id, {
      email: user.email,
      role: user.role
    });

    response.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id([0-9a-fA-F-]{36})", async (request, response, next) => {
  try {
    const user = await updateUser(request.params.id, request.body || {});

    await createAuditLog(request.user.id, "users.update", "admin_user", user.id, {
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });

    response.json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

