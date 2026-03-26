(function () {
  var TRANSLATABLE_ATTRS = [
    "data-pt",
    "data-en",
    "data-es",
    "data-fr",
    "data-de",
    "data-ru",
    "data-nl",
    "data-ja",
    "data-zh"
  ];

  var state = {
    apiBase: "",
    pageKey: "",
    content: {}
  };

  function normalizeLang(value) {
    return String(value || "").trim().toLowerCase().slice(0, 2) || "pt";
  }

  function sanitizeApiBase(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function stripAccents(value) {
    var text = String(value || "");
    if (typeof text.normalize === "function") {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return text;
  }

  function slugifySegment(value) {
    return stripAccents(value)
      .toLowerCase()
      .replace(/\.html?$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeAttributeValue(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  function defaultApiBase() {
    var saved = "";
    try {
      saved = localStorage.getItem("cobrait_admin_api_base") || "";
    } catch (_error) {}
    if (saved) return sanitizeApiBase(saved);

    if (window.location.protocol === "file:") return "http://localhost:4000/api";

    var hostname = String(window.location.hostname || "").toLowerCase();
    var isLocalHost = hostname === "127.0.0.1" || hostname === "localhost";
    if (isLocalHost && window.location.port !== "4000") {
      return window.location.protocol + "//" + hostname + ":4000/api";
    }

    return sanitizeApiBase(window.location.origin + "/api");
  }

  function currentLang() {
    try {
      return normalizeLang(localStorage.getItem("preferredLanguage") || document.documentElement.lang || "pt");
    } catch (_error) {
      return normalizeLang(document.documentElement.lang || "pt");
    }
  }

  function derivePageKey() {
    var explicit = document.body ? document.body.getAttribute("data-cms-page") : "";
    if (explicit) {
      var explicitParts = String(explicit)
        .split(".")
        .map(slugifySegment)
        .filter(Boolean);
      return explicitParts.length ? explicitParts.join(".") : "home";
    }

    var rawPath = window.location.pathname || "";
    var trimmed = rawPath.replace(/^\/+|\/+$/g, "");
    if (!trimmed || /^index\.html?$/i.test(trimmed)) return "home";

    var parts = trimmed
      .split("/")
      .map(function (segment) {
        try {
          return decodeURIComponent(segment);
        } catch (_error) {
          return segment;
        }
      })
      .map(slugifySegment)
      .filter(function (segment) {
        return segment && segment !== "index";
      });

    return parts.length ? parts.join(".") : "home";
  }

  function encodeDomSelectorKey(selector) {
    var utf8Selector = encodeURIComponent(String(selector || "")).replace(/%([0-9A-F]{2})/g, function (_match, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });

    return "dom." + btoa(utf8Selector)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  function decodeDomSelectorKey(key) {
    if (String(key || "").indexOf("dom.") !== 0) return "";

    var encoded = String(key).slice(4).replace(/-/g, "+").replace(/_/g, "/");
    while (encoded.length % 4) encoded += "=";

    try {
      var binary = atob(encoded);
      var percentEncoded = binary.split("").map(function (char) {
        return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
      }).join("");
      return decodeURIComponent(percentEncoded);
    } catch (_error) {
      return "";
    }
  }

  function safeQuerySelector(selector) {
    try {
      return document.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function syncTranslationAttributes(element, value) {
    TRANSLATABLE_ATTRS.forEach(function (attr) {
      if (element.hasAttribute(attr)) {
        element.setAttribute(attr, value);
      }
    });
  }

  function setElementValue(element, value) {
    var text = String(value == null ? "" : value);
    syncTranslationAttributes(element, text);

    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      if (element.hasAttribute("placeholder")) {
        element.setAttribute("placeholder", text);
      } else {
        element.value = text;
      }
      return;
    }

    if (element.tagName === "OPTION") {
      element.textContent = text;
      return;
    }

    if (element.hasAttribute("data-html")) {
      element.innerHTML = text;
      return;
    }

    element.textContent = text;
  }

  function applyContent(content) {
    state.content = content || {};

    Object.keys(state.content).forEach(function (key) {
      var value = String(state.content[key] == null ? "" : state.content[key]);

      if (key.indexOf("dom.") === 0) {
        var selector = decodeDomSelectorKey(key);
        var node = selector ? safeQuerySelector(selector) : null;
        if (node) setElementValue(node, value);
        return;
      }

      var selector = '[data-cms-key="' + escapeAttributeValue(key) + '"]';
      document.querySelectorAll(selector).forEach(function (node) {
        setElementValue(node, value);
      });
    });
  }

  function reapplyStoredContent() {
    if (!state.content || !Object.keys(state.content).length) return;
    applyContent(state.content);
  }

  async function loadPageContent() {
    state.apiBase = defaultApiBase();
    state.pageKey = derivePageKey();

    try {
      var response = await fetch(state.apiBase + "/site-content/" + encodeURIComponent(state.pageKey), {
        cache: "no-store"
      });
      if (!response.ok) return;

      var data = await response.json();
      if (!data || !data.contentEntry || !data.contentEntry.content) return;
      applyContent(data.contentEntry.content);
    } catch (_error) {
      // Ignore CMS failures on public pages.
    }
  }

  window.CobraitCms = {
    apiBase: defaultApiBase(),
    currentLang: currentLang,
    derivePageKey: derivePageKey,
    encodeDomSelectorKey: encodeDomSelectorKey,
    decodeDomSelectorKey: decodeDomSelectorKey,
    setElementValue: setElementValue,
    applyContent: applyContent,
    reapplyStoredContent: reapplyStoredContent,
    getPageKey: function () {
      return state.pageKey || derivePageKey();
    }
  };

  window.addEventListener("cobrait-set-language", function () {
    setTimeout(reapplyStoredContent, 0);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPageContent);
  } else {
    loadPageContent();
  }
})();
