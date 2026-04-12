const crypto = require("crypto");

const PREFIX = "scrypt";
const KEY_LENGTH = 64;

function hashPassword(password) {
  const value = String(password || "");
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(value, salt, KEY_LENGTH).toString("hex");
  return [PREFIX, salt, hash].join("$");
}

function verifyPassword(password, storedHash) {
  const value = String(password || "");
  const serialized = String(storedHash || "");
  const [prefix, salt, hash] = serialized.split("$");

  if (prefix !== PREFIX || !salt || !hash) {
    return false;
  }

  const actual = crypto.scryptSync(value, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(actual, expected);
}

module.exports = {
  hashPassword,
  verifyPassword
};
