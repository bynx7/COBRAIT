(function () {
  var DESKTOP_QUERY = "(min-width: 768px)";
  var STORAGE_KEY = "cobrait-language";
  var LEGACY_STORAGE_KEY = "preferredLanguage";
  var FLAGS = {
    pt: "\uD83C\uDDF5\uD83C\uDDF9",
    en: "\uD83C\uDDEC\uD83C\uDDE7",
    es: "\uD83C\uDDEA\uD83C\uDDF8",
  };
  var LANGS = [
    { code: "pt", label: "PT", name: "Portugu\u00eas", flag: FLAGS.pt },
    { code: "en", label: "EN", name: "English", flag: FLAGS.en },
    { code: "es", label: "ES", name: "Espa\u00f1ol", flag: FLAGS.es },
  ];

  function normalizeLang(value) {
    var lang = String(value || "").toLowerCase().slice(0, 2);
    return LANGS.some(function (item) { return item.code === lang; }) ? lang : "pt";
  }

  function getMeta(lang) {
    var normalized = normalizeLang(lang);
    return LANGS.filter(function (item) { return item.code === normalized; })[0] || LANGS[0];
  }

  function isDesktopViewport() {
    return !window.matchMedia || window.matchMedia(DESKTOP_QUERY).matches;
  }

  function getStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem(LEGACY_STORAGE_KEY, lang);
    } catch (error) {
      // Local storage can be blocked in private sessions; the UI still updates.
    }
  }

  function findFlagSpan(button) {
    var spans = Array.prototype.slice.call(button.querySelectorAll("span"));
    return spans.filter(function (span) {
      var text = span.textContent || "";
      return Object.keys(FLAGS).some(function (key) { return text.indexOf(FLAGS[key]) !== -1; });
    })[0];
  }

  function updateButton(button, lang) {
    var meta = getMeta(lang);
    var code = button.querySelector(".tracking-wide");
    var flag = findFlagSpan(button);

    if (code) code.textContent = meta.label;
    if (flag) flag.textContent = meta.flag;
  }

  function updateMenu(shell, lang) {
    var options = shell.querySelectorAll(".nebula-lang-option");
    Array.prototype.forEach.call(options, function (option) {
      var isActive = option.getAttribute("data-lang") === lang;
      option.setAttribute("aria-checked", isActive ? "true" : "false");
      option.classList.toggle("is-active", isActive);
    });
  }

  function setOpen(shell, isOpen) {
    var button = shell.querySelector('button[aria-label="Idioma"]');
    var menu = shell.querySelector(".nebula-lang-menu");

    shell.setAttribute("data-open", isOpen ? "true" : "false");
    if (button) button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (menu) menu.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  function closeAll(exceptShell) {
    var shells = document.querySelectorAll(".nebula-lang-shell");
    Array.prototype.forEach.call(shells, function (shell) {
      if (shell !== exceptShell) setOpen(shell, false);
    });
  }

  function dispatchLanguage(lang) {
    var detail = { lang: lang };

    try {
      window.dispatchEvent(new CustomEvent("cobrait-set-language", { detail: detail }));
    } catch (error) {
      var event = document.createEvent("CustomEvent");
      event.initCustomEvent("cobrait-set-language", true, true, detail);
      window.dispatchEvent(event);
    }
  }

  function setLanguage(lang, shouldDispatch) {
    var normalized = normalizeLang(lang);
    document.documentElement.setAttribute("lang", normalized);
    document.documentElement.setAttribute("data-nebula-lang", normalized);
    storeLang(normalized);

    var shells = document.querySelectorAll(".nebula-lang-shell");
    Array.prototype.forEach.call(shells, function (shell) {
      var button = shell.querySelector('button[aria-label="Idioma"]');
      if (button) updateButton(button, normalized);
      updateMenu(shell, normalized);
    });

    if (shouldDispatch !== false) dispatchLanguage(normalized);
  }

  function resetMobileButtons() {
    var buttons = document.querySelectorAll('button[aria-label="Idioma"]');
    Array.prototype.forEach.call(buttons, function (button) {
      updateButton(button, "pt");
      button.setAttribute("aria-expanded", "false");
    });

    closeAll(null);
    document.documentElement.setAttribute("lang", "pt");
    document.documentElement.removeAttribute("data-nebula-lang");
  }

  function createOption(shell, lang) {
    var option = document.createElement("button");
    var flag = document.createElement("span");
    var name = document.createElement("span");

    option.type = "button";
    option.className = "nebula-lang-option";
    option.setAttribute("role", "menuitemradio");
    option.setAttribute("data-lang", lang.code);

    flag.className = "nebula-lang-option__flag";
    flag.textContent = lang.flag;

    name.className = "nebula-lang-option__name";
    name.textContent = lang.name;

    option.appendChild(flag);
    option.appendChild(name);
    option.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setLanguage(lang.code, true);
      setOpen(shell, false);
    });

    return option;
  }

  function ensureMenu(shell, button, index) {
    var existing = shell.querySelector(".nebula-lang-menu");
    if (existing) return existing;

    var menu = document.createElement("div");
    var id = "nebula-language-menu-" + index;

    menu.id = id;
    menu.className = "nebula-lang-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-hidden", "true");

    LANGS.forEach(function (lang) {
      menu.appendChild(createOption(shell, lang));
    });

    shell.appendChild(menu);
    button.setAttribute("aria-controls", id);
    button.setAttribute("aria-haspopup", "menu");

    return menu;
  }

  function init() {
    var buttons = document.querySelectorAll('button[aria-label="Idioma"]');
    var lang = normalizeLang(getStoredLang() || "pt");

    if (!isDesktopViewport()) {
      resetMobileButtons();
      return;
    }

    Array.prototype.forEach.call(buttons, function (button, index) {
      var shell = button.parentElement;
      if (!shell || button.getAttribute("data-nebula-language-bound") === "true") return;

      shell.classList.add("nebula-lang-shell");
      shell.setAttribute("data-open", "false");
      button.setAttribute("data-nebula-language-bound", "true");
      button.setAttribute("aria-expanded", "false");

      ensureMenu(shell, button, index);
      updateButton(button, lang);
      updateMenu(shell, lang);

      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var shouldOpen = shell.getAttribute("data-open") !== "true";
        closeAll(shell);
        setOpen(shell, shouldOpen);
      });
    });

    setLanguage(lang, false);
  }

  function syncViewport() {
    if (isDesktopViewport()) {
      init();
      return;
    }

    resetMobileButtons();
  }

  document.addEventListener("click", function () {
    closeAll(null);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAll(null);
  });

  window.addEventListener("resize", syncViewport);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
