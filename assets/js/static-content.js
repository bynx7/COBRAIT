(function () {
  var ROOT_SCRIPT_REGEX = /\/assets\/js\/static-content\.js(?:\?.*)?$/i;
  var NESTED_SCRIPT_REGEX = /\/assets\/js\/static-content\.js(?:\?.*)?$/i;

  var BINDINGS = {
    global: [
      { key: "site.brandName", selectors: [".footer-brand-title"], mode: "text" },
      { key: "site.brandSubtitle", selectors: [".footer-brand-subtitle"], mode: "text" },
      { key: "site.footerTagline", selectors: [".footer-tagline"], mode: "i18n-text" },
      { key: "site.email", selectors: [".footer-meta a[href^='mailto:']", "a.hq-link", "section.cta-section a[href^='mailto:']"], mode: "email-link" },
      { key: "site.instagramUrl", selectors: [".social-link"], mode: "attr", attr: "href" },
      { key: "site.instagramHandle", selectors: [".social-link span"], mode: "text" },
      { key: "site.formRecipientEmail", selectors: ["form[action*='formsubmit.co']"], mode: "formsubmit-action" }
    ],
    pages: {
      index: [
        { key: "pages.index.hero.titleLine1", selectors: [".hero-title-line1"], mode: "i18n-text" },
        { key: "pages.index.hero.titleLine2", selectors: [".hero-title-line2"], mode: "i18n-text" },
        { key: "pages.index.hero.subtitle", selectors: [".hero-sub"], mode: "i18n-text" },
        { key: "pages.index.hero.bullet1", selectors: [".hero-bullets li:nth-of-type(1)"], mode: "i18n-text" },
        { key: "pages.index.hero.bullet2", selectors: [".hero-bullets li:nth-of-type(2)"], mode: "i18n-text" },
        { key: "pages.index.hero.bullet3", selectors: [".hero-bullets li:nth-of-type(3)"], mode: "i18n-text" },
        { key: "pages.index.hero.bullet4", selectors: [".hero-bullets li:nth-of-type(4)"], mode: "i18n-text" },
        { key: "pages.index.discovery.title", selectors: [".hero-card__title"], mode: "i18n-text" },
        { key: "pages.index.discovery.description", selectors: [".hero-card__desc"], mode: "i18n-text" },
        { key: "pages.index.social.title", selectors: [".social-title"], mode: "i18n-text" },
        { key: "pages.index.social.description", selectors: [".social-desc"], mode: "i18n-text" },
        { key: "pages.index.cta.title", selectors: [".cta-section h2"], mode: "i18n-text" }
      ],
      "about-us": [
        { key: "pages.about.hero.title", selectors: [".about-title"], mode: "i18n-text" },
        { key: "pages.about.hero.subtitle", selectors: [".about-sub"], mode: "i18n-text" },
        { key: "pages.about.cta.title", selectors: [".cta-band strong"], mode: "i18n-text" },
        { key: "pages.about.cta.description", selectors: [".cta-band span"], mode: "i18n-text" }
      ],
      tech: [
        { key: "pages.tech.hero.title", selectors: [".tech-hero h1"], mode: "i18n-text" },
        { key: "pages.tech.hero.subtitle", selectors: [".tech-hero-inner p:not(.tech-kicker)"], mode: "i18n-text" },
        { key: "pages.tech.toolkit.title", selectors: [".tech-title"], mode: "i18n-text" },
        { key: "pages.tech.toolkit.description", selectors: [".tech-lead"], mode: "i18n-text" }
      ],
      "book-a-call": [
        { key: "pages.bookCall.hero.title", selectors: [".hero-title"], mode: "i18n-html" },
        { key: "pages.bookCall.contact.title", selectors: [".contact-title"], mode: "i18n-html" },
        { key: "pages.bookCall.form.title", selectors: [".form-title"], mode: "i18n-text" },
        { key: "pages.bookCall.form.subtitle", selectors: [".form-sub"], mode: "i18n-text" }
      ]
    }
  };

  function normalizeLang(value) {
    return String(value || "").trim().toLowerCase().slice(0, 2) || "pt";
  }

  function currentLang() {
    try {
      return normalizeLang(localStorage.getItem("preferredLanguage") || document.documentElement.lang || "pt");
    } catch (_error) {
      return normalizeLang(document.documentElement.lang || "pt");
    }
  }

  function currentPageKey() {
    var path = String(window.location.pathname || "").replace(/^\/+|\/+$/g, "");
    if (!path || /^index\.html?$/i.test(path)) return "index";
    return path
      .replace(/\.html?$/i, "")
      .split("/")
      .pop()
      .toLowerCase();
  }

  function getCurrentScript() {
    if (document.currentScript) return document.currentScript;
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i -= 1) {
      var src = scripts[i].src || "";
      if (ROOT_SCRIPT_REGEX.test(src) || NESTED_SCRIPT_REGEX.test(src)) return scripts[i];
    }
    return null;
  }

  function contentUrl() {
    var script = getCurrentScript();
    if (!script || !script.src) return "assets/data/site-content.json";
    return new URL("../data/site-content.json", script.src).href;
  }

  function getValue(source, path) {
    return String(path || "")
      .split(".")
      .reduce(function (acc, segment) {
        if (!acc || typeof acc !== "object") return undefined;
        return acc[segment];
      }, source);
  }

  function updateVisibleValue(element, value, allowHtml) {
    if (allowHtml || element.hasAttribute("data-html")) {
      element.innerHTML = String(value == null ? "" : value);
      return;
    }

    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      if (element.hasAttribute("placeholder")) {
        element.setAttribute("placeholder", String(value == null ? "" : value));
      } else {
        element.value = String(value == null ? "" : value);
      }
      return;
    }

    element.textContent = String(value == null ? "" : value);
  }

  function applyI18nValue(element, translations, allowHtml) {
    if (!translations || typeof translations !== "object") return;

    Object.keys(translations).forEach(function (lang) {
      element.setAttribute("data-" + normalizeLang(lang), String(translations[lang] == null ? "" : translations[lang]));
    });

    var lang = currentLang();
    var value = translations[lang];
    if (value == null) value = translations.pt;
    if (value == null) value = translations.en;
    if (value == null) {
      var keys = Object.keys(translations);
      value = keys.length ? translations[keys[0]] : "";
    }

    updateVisibleValue(element, value, allowHtml);
  }

  function applyToSelector(selector, handler) {
    document.querySelectorAll(selector).forEach(handler);
  }

  function applyBinding(binding, source) {
    var value = getValue(source, binding.key);
    if (value == null) return;

    binding.selectors.forEach(function (selector) {
      applyToSelector(selector, function (element) {
        if (binding.mode === "text") {
          updateVisibleValue(element, value, false);
          return;
        }

        if (binding.mode === "i18n-text") {
          applyI18nValue(element, value, false);
          return;
        }

        if (binding.mode === "i18n-html") {
          applyI18nValue(element, value, true);
          return;
        }

        if (binding.mode === "attr") {
          element.setAttribute(binding.attr, String(value));
          return;
        }

        if (binding.mode === "email-link") {
          var email = String(value || "").trim();
          if (!email) return;
          element.setAttribute("href", "mailto:" + email);
          element.textContent = email;
          return;
        }

        if (binding.mode === "formsubmit-action") {
          var recipient = String(value || "").trim();
          if (!recipient) return;
          element.setAttribute("action", "https://formsubmit.co/ajax/" + recipient);
        }
      });
    });
  }

  function applyContent(content) {
    BINDINGS.global.forEach(function (binding) {
      applyBinding(binding, content);
    });

    var pageBindings = BINDINGS.pages[currentPageKey()] || [];
    pageBindings.forEach(function (binding) {
      applyBinding(binding, content);
    });
  }

  async function loadAndApply() {
    try {
      var response = await fetch(contentUrl(), { cache: "no-store" });
      if (!response.ok) return;
      var content = await response.json();
      applyContent(content || {});
    } catch (_error) {
      // Static overrides are optional, so failing silently keeps the page usable.
    }
  }

  window.addEventListener("cobrait-set-language", function () {
    setTimeout(loadAndApply, 0);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAndApply);
  } else {
    loadAndApply();
  }
})();
