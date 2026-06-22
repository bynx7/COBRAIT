const { getSiteContentEntry, listSiteContentEntries, upsertSiteContentEntry } = require("./content.service");
const { HttpError } = require("../utils/errors");

const BUILDER_FIELD = "__builderPage";
const BUILDER_PREFIX = "builder.";
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,50}$/;
const VALID_BLOCK_TYPES = new Set(["hero", "text", "cards", "faq", "cta"]);
const RESERVED_SLUGS = new Set([
  "admin",
  "agendar-chamada",
  "api",
  "assets",
  "book-a-call",
  "cookies",
  "favicon-16x16",
  "favicon-32x32",
  "index",
  "privacidade",
  "process",
  "servicos",
  "sobre-nos",
  "tech",
  "tecnologia",
  "termos"
]);

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeSlug(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pageKeyForSlug(slug) {
  return BUILDER_PREFIX + slug;
}

function parseBuilderPage(content) {
  if (!content || !content[BUILDER_FIELD]) return null;

  try {
    return JSON.parse(content[BUILDER_FIELD]);
  } catch {
    return null;
  }
}

function cleanList(items, limit) {
  if (!Array.isArray(items)) return [];
  return items
    .slice(0, limit)
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function cleanPairs(items, limit) {
  if (!Array.isArray(items)) return [];
  return items
    .slice(0, limit)
    .map((item) => ({
      title: normalizeText(item && item.title),
      text: normalizeText(item && item.text)
    }))
    .filter((item) => item.title || item.text);
}

function normalizeBlock(block, index) {
  const type = VALID_BLOCK_TYPES.has(block && block.type) ? block.type : "text";
  const normalized = {
    id: normalizeText(block && block.id) || "block-" + (index + 1),
    type,
    kicker: normalizeText(block && block.kicker),
    title: normalizeText(block && block.title),
    text: normalizeText(block && block.text),
    buttonLabel: normalizeText(block && block.buttonLabel),
    buttonHref: normalizeText(block && block.buttonHref)
  };

  if (type === "cards") {
    normalized.items = cleanPairs(block && block.items, 8);
  } else if (type === "faq") {
    normalized.items = cleanPairs(block && block.items, 10);
  } else {
    normalized.items = cleanList(block && block.items, 8);
  }

  return normalized;
}

function normalizeBuilderPage(input, fallbackSlug) {
  const slug = normalizeSlug((input && input.slug) || fallbackSlug);
  if (!SLUG_REGEX.test(slug)) {
    throw new HttpError(400, "Slug invalido. Usa letras, numeros e hifens.");
  }
  if (RESERVED_SLUGS.has(slug)) {
    throw new HttpError(400, "Este slug ja esta reservado por uma pagina existente.");
  }

  const title = normalizeText(input && input.title);
  if (!title) {
    throw new HttpError(400, "Titulo da pagina e obrigatorio.");
  }

  const status = input && input.status === "draft" ? "draft" : "published";
  const blocks = Array.isArray(input && input.blocks)
    ? input.blocks.slice(0, 24).map(normalizeBlock).filter((block) => block.title || block.text || block.items.length)
    : [];

  if (!blocks.length) {
    throw new HttpError(400, "Adiciona pelo menos um bloco com conteudo.");
  }

  return {
    slug,
    title,
    description: normalizeText(input && input.description).slice(0, 220),
    status,
    blocks,
    updatedAt: new Date().toISOString()
  };
}

function mapBuilderEntry(entry) {
  if (!entry || !String(entry.pageKey || "").startsWith(BUILDER_PREFIX)) return null;
  const page = parseBuilderPage(entry.content);
  if (!page) return null;
  return {
    ...page,
    slug: page.slug || String(entry.pageKey).slice(BUILDER_PREFIX.length),
    pageKey: entry.pageKey,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt || page.updatedAt
  };
}

async function listBuilderPages() {
  const entries = await listSiteContentEntries();
  return entries
    .map(mapBuilderEntry)
    .filter(Boolean)
    .sort((left, right) => String(left.slug).localeCompare(String(right.slug)));
}

async function getBuilderPage(slugInput) {
  const slug = normalizeSlug(slugInput);
  if (!SLUG_REGEX.test(slug)) return null;

  const entry = await getSiteContentEntry(pageKeyForSlug(slug));
  return mapBuilderEntry(entry);
}

async function upsertBuilderPage(slugInput, pageInput, updatedBy) {
  const page = normalizeBuilderPage(pageInput || {}, slugInput);
  const contentEntry = await upsertSiteContentEntry(pageKeyForSlug(page.slug), {
    [BUILDER_FIELD]: JSON.stringify(page)
  }, updatedBy);
  return mapBuilderEntry(contentEntry);
}

module.exports = {
  getBuilderPage,
  listBuilderPages,
  normalizeSlug,
  upsertBuilderPage
};
