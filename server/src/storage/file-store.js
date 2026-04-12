const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const config = require("../config");

const EMPTY_DATA = {
  users: [],
  auditLogs: [],
  contactRequests: [],
  callBookings: [],
  siteContentEntries: []
};

let writeQueue = Promise.resolve();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureStorageFile() {
  const filePath = config.storageFilePath;
  const directory = path.dirname(filePath);

  fs.mkdirSync(directory, { recursive: true });

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(EMPTY_DATA, null, 2) + "\n", "utf8");
  }
}

function normalizeDataShape(data) {
  return {
    users: Array.isArray(data && data.users) ? data.users : [],
    auditLogs: Array.isArray(data && data.auditLogs) ? data.auditLogs : [],
    contactRequests: Array.isArray(data && data.contactRequests) ? data.contactRequests : [],
    callBookings: Array.isArray(data && data.callBookings) ? data.callBookings : [],
    siteContentEntries: Array.isArray(data && data.siteContentEntries) ? data.siteContentEntries : []
  };
}

function readData() {
  ensureStorageFile();
  const raw = fs.readFileSync(config.storageFilePath, "utf8");
  return normalizeDataShape(JSON.parse(raw));
}

function queueWrite(mutator) {
  const operation = writeQueue.then(async () => {
    const current = readData();
    const next = normalizeDataShape((await mutator(clone(current))) || current);
    fs.writeFileSync(config.storageFilePath, JSON.stringify(next, null, 2) + "\n", "utf8");
    return next;
  });

  writeQueue = operation.catch(() => {});
  return operation;
}

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  return crypto.randomUUID();
}

function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) =>
    String(b.created_at || b.createdAt || "").localeCompare(String(a.created_at || a.createdAt || ""))
  );
}

module.exports = {
  createId,
  ensureStorageFile,
  nowIso,
  queueWrite,
  readData,
  sortByCreatedAtDesc
};
