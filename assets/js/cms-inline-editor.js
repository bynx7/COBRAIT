(function () {
  var cms = window.CobraitCms || null;
  if (!cms || !document.body) return;

  var GENERIC_EDITABLE_SELECTOR = [
    "[data-cms-key]",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "li",
    "a",
    "button",
    "label",
    "span",
    "strong",
    "em",
    "small",
    "dt",
    "dd",
    "blockquote",
    "figcaption"
  ].join(",");

  var state = {
    apiBase: cms.apiBase,
    pageKey: cms.getPageKey(),
    content: {},
    user: null,
    enabled: false,
    activeFieldKey: "",
    activeElement: null,
    editableNodes: [],
    booted: false
  };

  var ui = {};

  function escapeAttributeValue(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return String(value).replace(/[^a-zA-Z0-9_-]/g, function (char) {
      return "\\" + char;
    });
  }

  function readElementValue(element) {
    if (!element) return "";

    if (hasCoreTranslations(element)) {
      var langAttr = "data-" + cms.currentLang();
      if (element.hasAttribute(langAttr)) return element.getAttribute(langAttr) || "";
      if (element.hasAttribute("data-pt")) return element.getAttribute("data-pt") || "";
    }

    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      return element.hasAttribute("placeholder") ? element.getAttribute("placeholder") || "" : element.value || "";
    }

    if (element.hasAttribute("data-html")) {
      return element.innerHTML.trim();
    }

    return element.textContent.trim();
  }

  function hasOnlySimpleChildren(element) {
    if (!element || !element.children.length) return true;

    for (var index = 0; index < element.children.length; index += 1) {
      if (element.children[index].tagName !== "BR") {
        return false;
      }
    }

    return true;
  }

  function hasCoreTranslations(element) {
    if (!element || !element.hasAttribute) return false;
    var count = 0;
    ["data-pt", "data-en", "data-es"].forEach(function (attr) {
      if (element.hasAttribute(attr)) count += 1;
    });
    return count >= 2;
  }

  function isEditableTarget(element) {
    if (!element || element.nodeType !== 1) return false;
    if (element.closest(".cms-inline-panel, .cms-inline-launcher, .language-dropdown, script, style, noscript, svg")) return false;
    if (!element.matches(GENERIC_EDITABLE_SELECTOR)) return false;
    if (!readElementValue(element)) return false;
    if (element.hasAttribute("data-cms-key")) return true;
    return hasOnlySimpleChildren(element);
  }

  function clearEditableNodes() {
    state.editableNodes.forEach(function (node) {
      node.removeAttribute("data-cms-editable");
    });
    state.editableNodes = [];
  }

  function refreshEditableNodes() {
    clearEditableNodes();
    state.editableNodes = Array.prototype.filter.call(
      document.querySelectorAll(GENERIC_EDITABLE_SELECTOR),
      isEditableTarget
    );

    state.editableNodes.forEach(function (node) {
      node.setAttribute("data-cms-editable", "true");
    });
  }

  function selectorPart(element) {
    if (element.id) {
      return "#" + cssEscape(element.id);
    }

    var index = 1;
    var sibling = element;
    while ((sibling = sibling.previousElementSibling)) {
      if (sibling.tagName === element.tagName) {
        index += 1;
      }
    }

    return element.tagName.toLowerCase() + ":nth-of-type(" + index + ")";
  }

  function buildSelectorForElement(element) {
    var parts = [];
    var current = element;

    while (current && current.nodeType === 1 && current !== document.body) {
      parts.unshift(selectorPart(current));
      if (current.id) {
        return parts.join(" > ");
      }
      current = current.parentElement;
    }

    return "body > " + parts.join(" > ");
  }

  function baseFieldKeyForElement(element) {
    var mappedKey = element.getAttribute("data-cms-key");
    if (mappedKey) return mappedKey;
    return cms.encodeDomSelectorKey(buildSelectorForElement(element));
  }

  function fieldKeyForElement(element) {
    var baseKey = baseFieldKeyForElement(element);
    if (hasCoreTranslations(element)) {
      return "i18n." + cms.currentLang() + "." + baseKey;
    }
    return baseKey;
  }

  function fieldLabelForElement(element) {
    var mappedKey = element.getAttribute("data-cms-key");
    if (mappedKey) return mappedKey;

    var tagName = element.tagName.toLowerCase();
    var preview = readElementValue(element).replace(/\s+/g, " ").trim();
    if (preview.length > 60) preview = preview.slice(0, 57) + "...";
    return tagName + (preview ? " - " + preview : "");
  }

  function injectStyles() {
    if (document.getElementById("cms-inline-style")) return;

    var style = document.createElement("style");
    style.id = "cms-inline-style";
    style.textContent = [
      ".cms-inline-launcher{position:fixed;right:24px;bottom:24px;z-index:999999;display:inline-flex;align-items:center;gap:8px;padding:14px 18px;border:none;border-radius:999px;background:#0f172a;color:#fff;font:600 14px Inter,system-ui,sans-serif;box-shadow:0 20px 40px rgba(15,23,42,.24);cursor:pointer}",
      ".cms-inline-launcher:hover{transform:translateY(-1px)}",
      ".cms-inline-panel{position:fixed;top:24px;right:24px;z-index:1000000;width:min(420px,calc(100vw - 32px));padding:20px;border:1px solid #d8e2ef;border-radius:24px;background:#fff;box-shadow:0 30px 70px rgba(15,23,42,.18);display:none}",
      ".cms-inline-panel.is-open{display:block}",
      ".cms-inline-panel h3{margin:0 0 6px;font:800 24px Poppins,Inter,sans-serif;color:#0f172a}",
      ".cms-inline-panel p{margin:0;color:#64748b;font:400 14px/1.6 Inter,system-ui,sans-serif}",
      ".cms-inline-panel label{display:block;margin:16px 0 8px;font:700 12px/1.2 Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#2563eb}",
      ".cms-inline-panel textarea{width:100%;min-height:160px;padding:14px 15px;border:1px solid #c9d6e6;border-radius:16px;background:#f8fbff;color:#0f172a;font:400 15px/1.7 Inter,system-ui,sans-serif;resize:vertical;outline:none}",
      ".cms-inline-panel textarea:focus{border-color:#60a5fa;box-shadow:0 0 0 4px rgba(96,165,250,.18)}",
      ".cms-inline-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}",
      ".cms-inline-btn{display:inline-flex;align-items:center;justify-content:center;padding:11px 16px;border-radius:12px;border:1px solid transparent;background:#0f172a;color:#fff;font:600 14px Inter,system-ui,sans-serif;cursor:pointer}",
      ".cms-inline-btn--soft{background:#fff;border-color:#d8e2ef;color:#0f172a}",
      ".cms-inline-status{min-height:18px;margin-top:10px;color:#2563eb;font:600 13px Inter,system-ui,sans-serif}",
      "body.cms-inline-enabled [data-cms-editable=\"true\"]{outline:2px dashed rgba(37,99,235,.26);outline-offset:6px;cursor:pointer;transition:outline-color .2s ease, background-color .2s ease}",
      "body.cms-inline-enabled [data-cms-editable=\"true\"]:hover{outline-color:rgba(37,99,235,.64);background:rgba(37,99,235,.05)}",
      "@media (max-width:768px){.cms-inline-launcher{right:16px;bottom:16px}.cms-inline-panel{top:auto;right:16px;bottom:76px;width:calc(100vw - 32px)}}"
    ].join("");
    document.head.appendChild(style);
  }

  function buildUi() {
    injectStyles();

    ui.launcher = document.createElement("button");
    ui.launcher.type = "button";
    ui.launcher.className = "cms-inline-launcher";
    ui.launcher.textContent = "Editar página";

    ui.panel = document.createElement("aside");
    ui.panel.className = "cms-inline-panel";
    ui.panel.innerHTML = [
      "<h3>Modo edição</h3>",
      '<p id="cmsInlineHelp">Ativa a edição e clica num texto da página para o alterar.</p>',
      '<label id="cmsInlineFieldLabel" for="cmsInlineTextarea">Campo</label>',
      '<textarea id="cmsInlineTextarea"></textarea>',
      '<div class="cms-inline-actions">',
      '<button type="button" id="cmsInlineSave" class="cms-inline-btn">Guardar</button>',
      '<button type="button" id="cmsInlineClose" class="cms-inline-btn cms-inline-btn--soft">Fechar</button>',
      "</div>",
      '<div id="cmsInlineStatus" class="cms-inline-status"></div>'
    ].join("");

    document.body.appendChild(ui.launcher);
    document.body.appendChild(ui.panel);

    ui.help = document.getElementById("cmsInlineHelp");
    ui.fieldLabel = document.getElementById("cmsInlineFieldLabel");
    ui.textarea = document.getElementById("cmsInlineTextarea");
    ui.save = document.getElementById("cmsInlineSave");
    ui.close = document.getElementById("cmsInlineClose");
    ui.status = document.getElementById("cmsInlineStatus");

    ui.launcher.addEventListener("click", function () {
      state.enabled = !state.enabled;
      document.body.classList.toggle("cms-inline-enabled", state.enabled);
      ui.launcher.textContent = state.enabled ? "Sair da edição" : "Editar página";

      if (state.enabled) {
        refreshEditableNodes();
        ui.help.textContent = "Clica num texto assinalado na página para o editar.";
      } else {
        clearEditableNodes();
        closePanel();
      }
    });

    ui.close.addEventListener("click", function () {
      closePanel();
    });

    ui.save.addEventListener("click", saveActiveField);

    document.addEventListener("click", function (event) {
      if (!state.enabled) return;
      if (ui.panel.contains(event.target) || ui.launcher.contains(event.target)) return;

      var target = event.target && event.target.nodeType === 1
        ? event.target.closest("[data-cms-editable='true']")
        : null;
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();
      openField(target);
    }, true);
  }

  function closePanel() {
    ui.panel.classList.remove("is-open");
    ui.status.textContent = "";
    state.activeFieldKey = "";
    state.activeElement = null;
  }

  function fieldValue(element, key) {
    if (Object.prototype.hasOwnProperty.call(state.content, key)) {
      return String(state.content[key] == null ? "" : state.content[key]);
    }

    return readElementValue(element);
  }

  function openField(element) {
    var key = fieldKeyForElement(element);

    state.activeFieldKey = key;
    state.activeElement = element;
    ui.fieldLabel.textContent = fieldLabelForElement(element);
    ui.textarea.value = fieldValue(element, key);
    ui.help.textContent = "Estás a editar o texto selecionado na página.";
    ui.status.textContent = "";
    ui.panel.classList.add("is-open");
    ui.textarea.focus();
  }

  async function apiRequest(path, options) {
    var requestOptions = options || {};
    var init = {
      method: requestOptions.method || "GET",
      credentials: "include",
      headers: {}
    };

    if (requestOptions.body !== undefined) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(requestOptions.body);
    }

    var response = await fetch(state.apiBase + path, init);
    var text = await response.text();
    var payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch (_error) {
        payload = { message: text };
      }
    }

    if (!response.ok) {
      var error = new Error((payload && payload.message) || ("Pedido falhou: " + response.status));
      error.status = response.status;
      throw error;
    }

    return payload;
  }

  async function bootstrapContent() {
    try {
      var data = await apiRequest("/site-content/" + encodeURIComponent(state.pageKey));
      state.content = data && data.contentEntry && data.contentEntry.content ? data.contentEntry.content : {};
    } catch (_error) {
      state.content = {};
    }
  }

  function updateFieldOnPage(key, value) {
    if (key.indexOf("i18n.") === 0) {
      var parts = key.split(".");
      var innerKey = parts.slice(2).join(".");
      updateFieldOnPage(innerKey, value);
      return;
    }

    if (key.indexOf("dom.") === 0) {
      var selector = cms.decodeDomSelectorKey(key);
      var node = null;
      if (selector) {
        try {
          node = document.querySelector(selector);
        } catch (_error) {
          node = null;
        }
      }
      if (node) cms.setElementValue(node, value);
      return;
    }

    document.querySelectorAll('[data-cms-key="' + escapeAttributeValue(key) + '"]').forEach(function (element) {
      cms.setElementValue(element, value);
    });
  }

  async function saveActiveField() {
    if (!state.activeFieldKey) return;

    ui.save.disabled = true;
    ui.save.textContent = "A guardar...";
    ui.status.textContent = "";

    try {
      if (ui.textarea.value.trim()) {
        state.content[state.activeFieldKey] = ui.textarea.value;
      } else {
        delete state.content[state.activeFieldKey];
      }
      var data = await apiRequest("/site-content/" + encodeURIComponent(state.pageKey), {
        method: "PUT",
        body: { content: state.content }
      });

      state.content = data && data.contentEntry && data.contentEntry.content ? data.contentEntry.content : state.content;
      if (ui.textarea.value.trim()) {
        updateFieldOnPage(state.activeFieldKey, ui.textarea.value);
      }
      cms.applyContent(state.content);
      refreshEditableNodes();
      ui.status.textContent = "Alteração guardada.";
    } catch (error) {
      if (error && error.status === 401) {
        ui.status.textContent = "Sessão expirada. Volta ao admin e inicia sessão de novo.";
      } else if (error && error.status === 403) {
        ui.status.textContent = "A tua conta não tem permissão para editar.";
      } else {
        ui.status.textContent = error.message || "Não foi possível guardar.";
      }
    } finally {
      ui.save.disabled = false;
      ui.save.textContent = "Guardar";
    }
  }

  async function init() {
    if (state.booted) return;

    try {
      var session = await apiRequest("/auth/me");
      var user = session && session.user ? session.user : null;
      if (!user || user.role !== "admin") return;
      state.user = user;
    } catch (_error) {
      return;
    }

    await bootstrapContent();
    buildUi();
    state.booted = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
