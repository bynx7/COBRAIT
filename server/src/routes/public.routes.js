const express = require("express");
const { createAuditLog } = require("../services/users.service");
const { getSiteContentEntry } = require("../services/content.service");
const { createCallBooking, createContactRequest } = require("../services/ops.service");
const { notifyCallBookingCreated, notifyContactRequestCreated } = require("../services/notifications.service");
const { HttpError } = require("../utils/errors");

const router = express.Router();

router.get("/site-content/:pageKey([a-z0-9._-]+)", async (request, response, next) => {
  try {
    const contentEntry = await getSiteContentEntry(request.params.pageKey);
    response.json({
      contentEntry: contentEntry || {
        pageKey: request.params.pageKey,
        content: {},
        updatedBy: null,
        createdAt: null,
        updatedAt: null
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/contact-requests", async (request, response, next) => {
  try {
    const contactRequest = await createContactRequest(request.body || {});

    await createAuditLog(null, "contact_requests.create", "contact_request", contactRequest.id, {
      email: contactRequest.email,
      sourcePage: contactRequest.sourcePage
    });

    try {
      await notifyContactRequestCreated(contactRequest);
    } catch (error) {
      console.error("Failed to send contact request notification.", error);
      throw new HttpError(502, "Pedido registado, mas nao foi possivel enviar a notificacao por email.");
    }

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

    try {
      await notifyCallBookingCreated(callBooking);
    } catch (error) {
      console.error("Failed to send call booking notification.", error);
      throw new HttpError(502, "Pedido registado, mas nao foi possivel enviar a notificacao por email.");
    }

    response.status(201).json({ callBooking });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
