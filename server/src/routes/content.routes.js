const express = require("express");
const { requireAuth, requireEditor } = require("../middleware/auth");
const { createAuditLog } = require("../services/users.service");
const {
  listSiteContentEntries,
  upsertSiteContentEntry
} = require("../services/content.service");

const router = express.Router();

router.use(requireAuth, requireEditor);

router.get("/site-content", async (request, response, next) => {
  try {
    const contentEntries = await listSiteContentEntries();
    response.json({ contentEntries });
  } catch (error) {
    next(error);
  }
});

router.put("/site-content/:pageKey([a-z0-9._-]+)", async (request, response, next) => {
  try {
    const contentEntry = await upsertSiteContentEntry(
      request.params.pageKey,
      (request.body && request.body.content) || {},
      request.user.id
    );

    await createAuditLog(request.user.id, "site_content.upsert", "site_content", contentEntry.pageKey, {
      pageKey: contentEntry.pageKey,
      fieldCount: Object.keys(contentEntry.content || {}).length
    });

    response.json({ contentEntry });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
