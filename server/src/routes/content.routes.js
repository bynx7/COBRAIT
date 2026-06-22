const express = require("express");
const { requireAuth, requireEditor } = require("../middleware/auth");
const { createAuditLog } = require("../services/users.service");
const {
  listSiteContentEntries,
  upsertSiteContentEntry
} = require("../services/content.service");
const {
  listBuilderPages,
  upsertBuilderPage
} = require("../services/page-builder.service");

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

router.get("/site-pages", async (request, response, next) => {
  try {
    const pages = await listBuilderPages();
    response.json({ pages });
  } catch (error) {
    next(error);
  }
});

router.put("/site-pages/:slug([a-z0-9-]+)", async (request, response, next) => {
  try {
    const page = await upsertBuilderPage(request.params.slug, request.body || {}, request.user.id);

    await createAuditLog(request.user.id, "site_pages.upsert", "site_page", page.slug, {
      slug: page.slug,
      status: page.status,
      blockCount: Array.isArray(page.blocks) ? page.blocks.length : 0
    });

    response.json({ page });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
