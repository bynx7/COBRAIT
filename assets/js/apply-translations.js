/**
 * COBRAIT_SCRIPT_DOC
 * Objetivo: Gerir interações da interface e aplicação dinâmica de traduções.
 * Responsabilidades principais:
 * - Ler idioma preferido e sincronizar UI de idioma.
 * - Atualizar conteúdo via atributos data-*.
 * - Configurar handlers de componentes interativos da página.
 * Manutenção:
 * - Preservar nomes de atributos e seletores usados no DOM.
 * - Garantir fallback para idioma EN quando tradução específica não existir.
 */
// sync: github-desktop-update
// Cobrait Translation Loader - garante idiomas do dropdown em todas as páginas

if (!window.__cobraitTranslationBooted) {
  window.__cobraitTranslationBooted = true;
  window.cobraitTranslations = window.cobraitTranslations || null;

  (async function () {
    const EXTRA_LANGS = [];
    const ALLOWED_DROPDOWN_LANGS = ["pt", "en", "es"];
    const MOBILE_HEADER_MAX_WIDTH = 960;
    const scriptBaseUrl = (() => {
      if (document.currentScript && document.currentScript.src) {
        return new URL(".", document.currentScript.src);
      }

      const fallbackBase = window.location.pathname.includes("/servicos/")
        ? "../assets/js/"
        : "assets/js/";

      return new URL(fallbackBase, window.location.href);
    })();
    const translationsUrl = new URL("../data/translations.json", scriptBaseUrl);
    const LANGUAGE_META = {
      pt: { code: "PT", name: "Português", flag: "PT" },
      en: { code: "EN", name: "English", flag: "EN" },
      es: { code: "ES", name: "Español", flag: "ES" },
    };
    const MOJIBAKE_RE = /(\u00c3.|\u00c2.|\u00e2[\u0080-\u00bf]|\u00ef\u00bf\u00bd|\uFFFD)/;

    function looksBroken(text) {
      return MOJIBAKE_RE.test(String(text || ""));
    }

    function repairMojibake(text) {
      const value = String(text || "");
      if (!looksBroken(value) || typeof TextDecoder === "undefined") return value;

      try {
        const bytes = Uint8Array.from(
          Array.from(value, (char) => char.charCodeAt(0) & 0xff),
        );
        const decoded = new TextDecoder("utf-8").decode(bytes);
        return looksBroken(decoded) ? value : decoded;
      } catch (_error) {
        return value;
      }
    }

    function normalizeDropdownArrows(root) {
      const scope = root || document;
      scope.querySelectorAll(".dropdown-arrow").forEach((arrow) => {
        if (String(arrow.textContent || "").trim() === "?") {
          arrow.innerHTML = "&#9662;";
        }
      });
    }

    function repairBrokenText(root) {
      const scope = root || document;
      const attributeNames = [
        "data-pt",
        "data-en",
        "data-es",
        "aria-label",
        "title",
        "placeholder",
      ];

      scope
        .querySelectorAll("[data-pt], [data-en], [data-es], [aria-label], [title], [placeholder]")
        .forEach((el) => {
          attributeNames.forEach((attr) => {
            if (!el.hasAttribute(attr)) return;
            const current = el.getAttribute(attr);
            const repaired = repairMojibake(current);
            if (repaired !== current) {
              el.setAttribute(attr, repaired);
            }
          });
        });

      const walker = document.createTreeWalker(
        scope === document ? document.body : scope,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
              return NodeFilter.FILTER_REJECT;
            }
            return looksBroken(node.nodeValue || "")
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        },
      );

      let currentNode = walker.nextNode();
      while (currentNode) {
        currentNode.nodeValue = repairMojibake(currentNode.nodeValue || "");
        currentNode = walker.nextNode();
      }

      normalizeDropdownArrows(scope);
    }

    function normalizeSharedCopy(root) {
      const scope = root || document;
      const footerTagline = scope.querySelector(".footer-tagline");
      if (footerTagline) {
        footerTagline.setAttribute(
          "data-pt",
          "Criamos produtos digitais com foco em velocidade, qualidade e crescimento - do âmbito ao lançamento.",
        );
        footerTagline.setAttribute(
          "data-en",
          "We build digital products focused on speed, quality and growth - from scope to launch.",
        );
        if (footerTagline.hasAttribute("data-es")) {
          footerTagline.setAttribute(
            "data-es",
            "Creamos productos digitales centrados en velocidad, calidad y crecimiento - del alcance al lanzamiento.",
          );
        }
      }
    }

    function ensureLanguageDropdownStyle() {
      if (document.getElementById("cobrait-lang-fix-style")) return;
      const style = document.createElement("style");
      style.id = "cobrait-lang-fix-style";
      style.textContent = `
        .language-option .lang-flag,
        .language-dropdown-btn .lang-flag {
          min-width: 24px;
          width: 24px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3px;
          line-height: 1;
          text-transform: uppercase;
          font-family: Inter, Arial, sans-serif;
        }
        .language-option.active .lang-flag {
          background: rgba(255, 255, 255, 0.22);
          color: #ffffff;
        }
        .language-option .lang-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `;
      document.head.appendChild(style);
    }

    function syncLanguageDropdownUI(activeLang) {
      ensureLanguageDropdownStyle();
      const normalized = normalizeLang(
        activeLang || localStorage.getItem("preferredLanguage") || "pt",
      );

      function ensureOptionShape(option, lang) {
        const meta = LANGUAGE_META[lang] || LANGUAGE_META.en;
        option.setAttribute("data-lang", lang);
        option.type = "button";

        let flagEl = option.querySelector(".lang-flag");
        if (!flagEl) {
          flagEl = document.createElement("span");
          flagEl.className = "lang-flag";
          option.prepend(flagEl);
        }

        let nameEl = option.querySelector(".lang-name");
        if (!nameEl) {
          nameEl = document.createElement("span");
          nameEl.className = "lang-name";
          option.appendChild(nameEl);
        }

        flagEl.textContent = meta.flag;
        nameEl.textContent = meta.name;
        option.classList.toggle("active", lang === normalized);
      }

      const dropdowns = document.querySelectorAll(".language-dropdown-content");
      dropdowns.forEach((dropdown) => {
        const currentByLang = new Map();
        dropdown.querySelectorAll(".language-option").forEach((option) => {
          const lang = normalizeLang(option.getAttribute("data-lang"));
          if (!ALLOWED_DROPDOWN_LANGS.includes(lang)) {
            option.remove();
            return;
          }
          if (!currentByLang.has(lang)) {
            currentByLang.set(lang, option);
          } else {
            option.remove();
          }
        });

        ALLOWED_DROPDOWN_LANGS.forEach((lang) => {
          let option = currentByLang.get(lang);
          if (!option) {
            option = document.createElement("button");
            option.className = "language-option";
          }
          ensureOptionShape(option, lang);
          dropdown.appendChild(option);
        });
      });

      const currentFlag = document.getElementById("currentFlag");
      const currentLang = document.getElementById("currentLang");
      const activeMeta = LANGUAGE_META[normalized] || LANGUAGE_META.en;
      if (currentFlag) currentFlag.textContent = activeMeta.flag;
      if (currentLang) currentLang.textContent = activeMeta.code;
      normalizeDropdownArrows(document);
    }

    function normalizeLang(lang) {
      const l = String(lang || "").toLowerCase();
      if (l === "pt-pt" || l === "pt_pt" || l.startsWith("pt")) return "pt";
      if (l.startsWith("en")) return "en";
      if (l.startsWith("es")) return "es";
      return "en";
    }

    function applyLanguageToDom(lang) {
      const normalized = normalizeLang(lang);
      document.documentElement.lang =
        normalized === "pt" ? "pt-PT" : normalized;

      const elements = document.querySelectorAll(
        "[data-pt], [data-en], [data-es]",
      );

      elements.forEach((el) => {
        let text = el.getAttribute("data-" + normalized);
        if (text === null && normalized !== "en")
          text = el.getAttribute("data-en");
        if (text === null) return;

        if (
          el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "OPTION"
        ) {
          if (el.tagName === "OPTION") {
            el.textContent = text;
          } else if (el.hasAttribute("placeholder")) {
            el.placeholder = text;
          } else {
            el.value = text;
          }
        } else if (
          el.hasAttribute("data-html") ||
          /<\/?[a-z][^>]*>/i.test(text)
        ) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      });

      const ariaEls = document.querySelectorAll(
        "[aria-label][data-pt], [aria-label][data-en], [aria-label][data-es]",
      );
      ariaEls.forEach((el) => {
        let val = el.getAttribute("data-" + normalized);
        if (val === null && normalized !== "en")
          val = el.getAttribute("data-en");
        if (val) el.setAttribute("aria-label", val);
      });
    }

    function loadTranslationsIntoAttributes() {
      const elements = document.querySelectorAll("[data-en]");
      elements.forEach((el) => {
        const enText = el.getAttribute("data-en");
        if (!enText) return;

        const trans = window.cobraitTranslations
          ? window.cobraitTranslations[enText]
          : null;
        EXTRA_LANGS.forEach((lang) => {
          const existing = el.getAttribute("data-" + lang);
          const translated = trans && trans[lang] ? trans[lang] : null;
          if (translated) {
            el.setAttribute("data-" + lang, translated);
          } else if (!existing) {
            // Fallback seguro: nunca deixa o idioma vazio no dropdown
            el.setAttribute("data-" + lang, enText);
          }
        });
      });
    }

    window.applyCobraitTranslations = function () {
      loadTranslationsIntoAttributes();
    };

    try {
      const response = await fetch(translationsUrl.href);
      if (!response.ok)
        throw new Error("translations.json not found at assets/data");
      window.cobraitTranslations = await response.json();
    } catch (error) {
      console.warn(
        "Cobrait translations: fallback only (using EN for missing extra languages).",
        error,
      );
    }

    function boot() {
      repairBrokenText(document);
      normalizeSharedCopy(document);
      loadTranslationsIntoAttributes();
      const preferred = normalizeLang(
        localStorage.getItem("preferredLanguage") ||
          document.documentElement.lang ||
          "pt",
      );
      try {
        localStorage.setItem("preferredLanguage", preferred);
      } catch (_e) {}
      applyLanguageToDom(preferred);
      syncLanguageDropdownUI(preferred);
      repairBrokenText(document);
      normalizeSharedCopy(document);
      // Segundo passe para ganhar a scripts locais que correm no mesmo DOMContentLoaded.
      setTimeout(() => {
        normalizeSharedCopy(document);
        applyLanguageToDom(preferred);
        syncLanguageDropdownUI(preferred);
        repairBrokenText(document);
      }, 0);
    }

    function ensureMobileHeaderBehavior() {
      const header = document.querySelector(".site-header");
      const navToggle = document.querySelector(".nav-toggle");
      const siteNav = document.querySelector(".site-nav");
      const headerCtaLink = document.querySelector(".header-cta a, .header-cta .btn");
      const languageDropdown = document.querySelector(".language-dropdown");
      const languageButton = languageDropdown ? languageDropdown.querySelector(".language-dropdown-btn") : null;

      function isMobileViewport() {
        return window.innerWidth <= MOBILE_HEADER_MAX_WIDTH;
      }

      function syncHeaderMeasurements() {
        if (!header) return;
        const headerHeight = Math.ceil(header.getBoundingClientRect().height || 72);
        document.documentElement.style.setProperty("--cobrait-mobile-header-h", headerHeight + "px");
      }

      function ensureMobileNavCta() {
        if (!siteNav || !headerCtaLink) return;
        const list = siteNav.querySelector(":scope > ul");
        if (!list) return;
        let mobileCta = list.querySelector(".mobile-nav-cta");
        if (!mobileCta) {
          mobileCta = document.createElement("li");
          mobileCta.className = "mobile-nav-cta";
          const clone = headerCtaLink.cloneNode(true);
          clone.classList.add("mobile-nav-cta-link");
          mobileCta.appendChild(clone);
          list.appendChild(mobileCta);
        }
      }

      ensureMobileNavCta();
      const navLinks = document.querySelectorAll(".site-nav a");
      const dropdownToggles = document.querySelectorAll(".site-nav .dropdown > a");

      function setDropdownOpen(dropdown, shouldOpen) {
        if (!dropdown) return;
        dropdown.classList.toggle("is-open", shouldOpen);
        const toggle = dropdown.querySelector(":scope > a");
        if (toggle) {
          toggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        }
      }

      function closeNavDropdowns(exceptDropdown) {
        document.querySelectorAll(".site-nav .dropdown.is-open").forEach((dropdown) => {
          if (exceptDropdown && dropdown === exceptDropdown) return;
          setDropdownOpen(dropdown, false);
        });
      }

      function syncNavState() {
        const navOpen = !!(navToggle && navToggle.checked && isMobileViewport());
        document.body.classList.toggle("cobrait-nav-open", navOpen);
        if (!navOpen && siteNav) {
          siteNav.scrollTop = 0;
          closeNavDropdowns();
        }
      }

      function closeNav() {
        if (!navToggle) return;
        navToggle.checked = false;
        syncNavState();
      }

      function closeLanguageDropdown() {
        if (languageDropdown) {
          languageDropdown.classList.remove("is-open");
        }
        if (languageButton) {
          languageButton.setAttribute("aria-expanded", "false");
        }
      }

      function toggleLanguageDropdown(forceOpen) {
        if (!languageDropdown || !languageButton || !isMobileViewport()) return;
        const nextState = typeof forceOpen === "boolean" ? forceOpen : !languageDropdown.classList.contains("is-open");
        languageDropdown.classList.toggle("is-open", nextState);
        languageButton.setAttribute("aria-expanded", nextState ? "true" : "false");
      }

      if (navToggle && !navToggle.dataset.cobraitBound) {
        navToggle.dataset.cobraitBound = "true";
        navToggle.addEventListener("change", () => {
          if (navToggle.checked) closeLanguageDropdown();
          syncNavState();
        });
      }

      navLinks.forEach((link) => {
        if (link.dataset.cobraitBound) return;
        link.dataset.cobraitBound = "true";
        link.addEventListener("click", () => {
          const isDropdownToggle = !!(link.parentElement && link.parentElement.classList.contains("dropdown"));
          if (isDropdownToggle) return;
          if (navToggle && isMobileViewport()) {
            closeNav();
          }
        });
      });

      dropdownToggles.forEach((toggle) => {
        if (toggle.dataset.cobraitDropdownBound) return;
        toggle.dataset.cobraitDropdownBound = "true";
        toggle.setAttribute("aria-haspopup", "true");
        toggle.setAttribute("aria-expanded", "false");
        toggle.addEventListener("click", (event) => {
          if (!isMobileViewport()) return;
          event.preventDefault();
          event.stopPropagation();
          const dropdown = toggle.closest(".dropdown");
          const shouldOpen = !(dropdown && dropdown.classList.contains("is-open"));
          closeLanguageDropdown();
          closeNavDropdowns(dropdown);
          setDropdownOpen(dropdown, shouldOpen);
        });
      });

      if (languageButton && !languageButton.dataset.cobraitBound) {
        languageButton.dataset.cobraitBound = "true";
        languageButton.setAttribute("aria-expanded", "false");
        languageButton.addEventListener("click", (event) => {
          if (!isMobileViewport()) return;
          event.preventDefault();
          event.stopPropagation();
          if (navToggle) navToggle.checked = false;
          syncNavState();
          toggleLanguageDropdown();
        });
      }

      if (!document.body.dataset.cobraitHeaderBound) {
        document.body.dataset.cobraitHeaderBound = "true";
        document.addEventListener("click", (event) => {
          if (languageDropdown && !languageDropdown.contains(event.target)) {
            closeLanguageDropdown();
          }
          if (navToggle && navToggle.checked && isMobileViewport() && header && !header.contains(event.target)) {
            closeNav();
          }
          if (siteNav && !siteNav.contains(event.target)) {
            closeNavDropdowns();
          }
        });

        document.addEventListener("keydown", (event) => {
          if (event.key !== "Escape") return;
          closeLanguageDropdown();
          closeNavDropdowns();
          closeNav();
        });

        window.addEventListener("resize", () => {
          syncHeaderMeasurements();
          if (!isMobileViewport()) {
            if (navToggle) navToggle.checked = false;
            closeLanguageDropdown();
            closeNavDropdowns();
          }
          syncNavState();
        });
      }

      syncHeaderMeasurements();
      syncNavState();
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }

    // Captura cliques no dropdown para garantir que os data-xx estão prontos antes dos scripts locais.
    document.addEventListener(
      "click",
      (event) => {
        const option = event.target.closest(".language-option");
        if (!option) return;
        const lang = normalizeLang(option.getAttribute("data-lang"));
        try {
          localStorage.setItem("preferredLanguage", lang);
        } catch (_e) {}
        loadTranslationsIntoAttributes();
        // Reaplica no fim do ciclo para cobrir páginas sem handler robusto.
        setTimeout(() => {
          normalizeSharedCopy(document);
          applyLanguageToDom(lang);
          syncLanguageDropdownUI(lang);
          repairBrokenText(document);
          window.dispatchEvent(
            new CustomEvent("cobrait-set-language", { detail: lang }),
          );
        }, 0);
      },
      true,
    );

    // Expor helper global caso alguma página queira forçar idioma manualmente.
    window.cobraitApplyLanguage = function (lang) {
      const normalized = normalizeLang(lang);
      try {
        localStorage.setItem("preferredLanguage", normalized);
      } catch (_e) {}
      loadTranslationsIntoAttributes();
      normalizeSharedCopy(document);
      applyLanguageToDom(normalized);
      syncLanguageDropdownUI(normalized);
      repairBrokenText(document);
      window.dispatchEvent(
        new CustomEvent("cobrait-set-language", { detail: normalized }),
      );
    };

    // Garante sync também quando scripts locais disparam este evento.
    window.addEventListener("cobrait-set-language", (ev) => {
      const normalized = normalizeLang(ev && ev.detail ? ev.detail : null);
      syncLanguageDropdownUI(normalized);
      repairBrokenText(document);
      normalizeSharedCopy(document);
      setTimeout(() => {
        normalizeSharedCopy(document);
        applyLanguageToDom(normalized);
        syncLanguageDropdownUI(normalized);
        repairBrokenText(document);
      }, 0);
    });

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", ensureMobileHeaderBehavior);
    } else {
      ensureMobileHeaderBehavior();
    }
  })();
}

