// sync: github-desktop-update
// Cobrait Translation Loader - garante idiomas do dropdown em todas as paginas

if (!window.__cobraitTranslationBooted) {
  window.__cobraitTranslationBooted = true;
  window.cobraitTranslations = window.cobraitTranslations || null;

  (async function () {
    const EXTRA_LANGS = ["fr", "de", "ru", "nl", "ja", "zh"];

    function normalizeLang(lang) {
      const l = String(lang || "").toLowerCase();
      if (l === "pt-pt" || l === "pt_pt" || l.startsWith("pt")) return "pt";
      if (l.startsWith("en")) return "en";
      if (l.startsWith("es")) return "es";
      if (l.startsWith("fr")) return "fr";
      if (l.startsWith("de")) return "de";
      if (l.startsWith("ru")) return "ru";
      if (l.startsWith("nl")) return "nl";
      if (l.startsWith("ja") || l.startsWith("jp")) return "ja";
      if (l.startsWith("zh") || l.startsWith("cn")) return "zh";
      return "en";
    }

    function applyLanguageToDom(lang) {
      const normalized = normalizeLang(lang);
      document.documentElement.lang = normalized === "pt" ? "pt-PT" : normalized;

      const elements = document.querySelectorAll(
        "[data-pt], [data-en], [data-es], [data-fr], [data-de], [data-ru], [data-nl], [data-ja], [data-zh]"
      );

      elements.forEach((el) => {
        let text = el.getAttribute("data-" + normalized);
        if (text === null && normalized !== "en") text = el.getAttribute("data-en");
        if (text === null) return;

        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "OPTION") {
          if (el.tagName === "OPTION") {
            el.textContent = text;
          } else if (el.hasAttribute("placeholder")) {
            el.placeholder = text;
          } else {
            el.value = text;
          }
        } else if (el.hasAttribute("data-html") || /<br\s*\/?>/i.test(text)) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      });

      const ariaEls = document.querySelectorAll(
        "[aria-label][data-pt], [aria-label][data-en], [aria-label][data-es], [aria-label][data-fr], [aria-label][data-de], [aria-label][data-ru], [aria-label][data-nl], [aria-label][data-ja], [aria-label][data-zh]"
      );
      ariaEls.forEach((el) => {
        let val = el.getAttribute("data-" + normalized);
        if (val === null && normalized !== "en") val = el.getAttribute("data-en");
        if (val) el.setAttribute("aria-label", val);
      });
    }

    function loadTranslationsIntoAttributes() {
      const elements = document.querySelectorAll("[data-en]");
      elements.forEach((el) => {
        const enText = el.getAttribute("data-en");
        if (!enText) return;

        const trans = window.cobraitTranslations ? window.cobraitTranslations[enText] : null;
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
      // Tentar carregar translations.json no root ou no parent para paginas em /servicos
      let response;
      try {
        response = await fetch("./translations.json");
        if (!response.ok) throw new Error("translations.json not found at root");
      } catch (_e) {
        response = await fetch("../translations.json");
        if (!response.ok) throw new Error("translations.json not found at parent");
      }
      window.cobraitTranslations = await response.json();
    } catch (error) {
      console.warn("Cobrait translations: fallback only (using EN for missing extra languages).", error);
    }

    function boot() {
      loadTranslationsIntoAttributes();
      const preferred = normalizeLang(localStorage.getItem("preferredLanguage") || document.documentElement.lang || "pt");
      applyLanguageToDom(preferred);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }

    // Captura cliques no dropdown para garantir que os data-xx estao prontos antes dos scripts locais.
    document.addEventListener(
      "click",
      (event) => {
        const option = event.target.closest(".language-option");
        if (!option) return;
        const lang = normalizeLang(option.getAttribute("data-lang"));
        loadTranslationsIntoAttributes();
        // Reaplica no fim do ciclo para cobrir paginas sem handler robusto.
        setTimeout(() => {
          applyLanguageToDom(lang);
          window.dispatchEvent(new CustomEvent("cobrait-set-language", { detail: lang }));
        }, 0);
      },
      true
    );

    // Expor helper global caso alguma pagina queira forcar idioma manualmente.
    window.cobraitApplyLanguage = function (lang) {
      const normalized = normalizeLang(lang);
      loadTranslationsIntoAttributes();
      applyLanguageToDom(normalized);
      window.dispatchEvent(new CustomEvent("cobrait-set-language", { detail: normalized }));
    };
  })();
}
