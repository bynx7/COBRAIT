const express = require("express");
const { createAuditLog } = require("../services/users.service");
const { createCallBooking, createContactRequest } = require("../services/ops.service");

const router = express.Router();

router.post("/contact-requests", async (request, response, next) => {
  try {
    const contactRequest = await createContactRequest(request.body || {});

    await createAuditLog(null, "contact_requests.create", "contact_request", contactRequest.id, {
      email: contactRequest.email,
      sourcePage: contactRequest.sourcePage
    });

    response.status(201).json({ contactRequest });
  } catch (error) {
    next(error);
  }
});

router.post("/call-bookings", async (request, response, next) => {
  try {
    const callBooking = await createCallBooking(request.body || {});

    await createAuditLog(null, "call_bookings.create", "call_booking", callBooking.id, {
      email: callBooking.email,
      serviceInterest: callBooking.serviceInterest
    });

    response.status(201).json({ callBooking });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

