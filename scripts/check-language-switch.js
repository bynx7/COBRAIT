const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const publicHtmlDirs = [root, path.join(root, "servicos")];
const skippedPages = new Set(["admin.html"]);
const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function publicHtmlFiles() {
  return publicHtmlDirs.flatMap((dir) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((name) => name.endsWith(".html"))
      .filter((name) => !skippedPages.has(name))
      .map((name) => path.join(dir, name));
  });
}

const languageScriptPath = path.join(root, "assets", "js", "nebula-language.js");
const mobileScriptPath = path.join(root, "assets", "js", "mobile-preview.js");

if (!fs.existsSync(languageScriptPath)) {
  fail("Missing assets/js/nebula-language.js");
}

if (!fs.existsSync(mobileScriptPath)) {
  fail("Missing assets/js/mobile-preview.js");
}

if (fs.existsSync(languageScriptPath)) {
  const languageScript = readText(languageScriptPath);
  ["pt", "en", "es"].forEach((lang) => {
    if (!languageScript.includes('code: "' + lang + '"')) {
      fail("Desktop language script is missing option: " + lang);
    }
  });

  [
    "window.CobraitLanguage",
    "setLanguage(lang, true)",
    "applyLanguageToDocument",
    "MutationObserver"
  ].forEach((marker) => {
    if (!languageScript.includes(marker)) {
      fail("Desktop language script is missing marker: " + marker);
    }
  });
}

if (fs.existsSync(mobileScriptPath)) {
  const mobileScript = readText(mobileScriptPath);
  ["pt", "en", "es"].forEach((lang) => {
    if (!mobileScript.includes('"' + lang + '"')) {
      fail("Mobile preview language script is missing language: " + lang);
    }
  });
}

const htmlFiles = publicHtmlFiles();
if (!htmlFiles.length) {
  fail("No public HTML files found.");
}

htmlFiles.forEach((file) => {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const html = readText(file);

  if (!html.includes('/assets/js/nebula-language.js')) {
    fail(relative + " does not load nebula-language.js");
  }

  if (!html.includes('/assets/js/mobile-preview.js') && !html.includes('mobile-preview-guard')) {
    fail(relative + " does not load or route to the mobile preview");
  }

  if (!/aria-label=["']Idioma["']/.test(html)) {
    fail(relative + " does not include the desktop language button");
  }
});

if (failures.length) {
  console.error("Language switch check failed:");
  failures.forEach((message) => console.error("- " + message));
  process.exit(1);
}

console.log("Language switch check OK: " + htmlFiles.length + " public pages wired for PT/EN/ES.");
