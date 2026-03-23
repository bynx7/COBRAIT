const express = require("express");
const { requireAdmin, requireAuth } = require("../middleware/auth");
const { createAuditLog } = require("../services/users.service");
const {
  listCallBookings,
  listContactRequests,
  updateCallBooking,
  updateContactRequest
} = require("../services/ops.service");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/contact-requests", async (request, response, next) => {
  try {
    const contactRequests = await listContactRequests();
    response.json({ contactRequests });
  } catch (error) {
    next(error);
  }
});

router.patch("/contact-requests/:id([0-9a-fA-F-]{36})", async (request, response, next) => {
  try {
    const contactRequest = await updateContactRequest(request.params.id, request.body || {});

    await createAuditLog(request.user.id, "contact_requests.update", "contact_request", contactRequest.id, {
      status: contactRequest.status,
      assignedTo: contactRequest.assignedTo
    });

    response.json({ contactRequest });
  } catch (error) {
    next(error);
  }
});

router.get("/call-bookings", async (request, response, next) => {
  try {
    const callBookings = await listCallBookings();
    response.json({ callBookings });
  } catch (error) {
    next(error);
  }
});

router.patch("/call-bookings/:id([0-9a-fA-F-]{36})", async (request, response, next) => {
  try {
    const callBooking = await updateCallBooking(request.params.id, request.body || {});

    await createAuditLog(request.user.id, "call_bookings.update", "call_booking", callBooking.id, {
      status: callBooking.status,
      assignedTo: callBooking.assignedTo
    });

    response.json({ callBooking });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
