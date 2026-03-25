(function () {
  if (window.__cobraitSiteChatBooted) return;
  window.__cobraitSiteChatBooted = true;

  var STORAGE_KEY = "cobrait_site_chat_state_v1";
  var MAX_STORED_MESSAGES = 18;
  var CHAT_ENDPOINT = "/chat";
  var MIN_TYPING_DELAY_MS = 1400;
  var MAX_TYPING_DELAY_MS = 2600;
  var state = {
    open: false,
    sending: false,
    lang: "pt",
    messages: []
  };

  var ui = {};

  var COPY = {
    pt: {
      launcher: "Falar com a Cobrait AI",
      title: "Cobrait AI",
      subtitle: "Resposta r\u00e1pida sobre servi\u00e7os, pricing e pr\u00f3ximos passos.",
      intro: "Ol\u00e1. Sou o assistente da Cobrait. Posso ajudar-te a perceber o melhor servi\u00e7o para o teu projeto, enquadrar pre\u00e7o e prazo, ou estruturar os pr\u00f3ximos passos.",
      placeholder: "Escreve a tua mensagem...",
      send: "Enviar",
      bookCall: "Agendar chamada",
      newChat: "Nova conversa",
      close: "Fechar chat",
      quickLabel: "Perguntas r\u00e1pidas",
      privacy: "Evita partilhar dados sens\u00edveis no chat.",
      error: "N\u00e3o consegui responder agora. Se quiseres, tenta novamente ou agenda uma chamada com a equipa.",
      quickActions: [
        "Tenho uma ideia e preciso de dire\u00e7\u00e3o",
        "Quero lan\u00e7ar um MVP",
        "Preciso de perceber pre\u00e7o e prazo",
        "Quero falar com a equipa"
      ]
    },
    en: {
      launcher: "Chat with Cobrait AI",
      title: "Cobrait AI",
      subtitle: "Fast help with services, pricing and next steps.",
      intro: "Hello. I'm Cobrait's assistant. I can help you choose the right service for your project, frame pricing and timeline, or suggest the next step.",
      placeholder: "Write your message...",
      send: "Send",
      bookCall: "Book a call",
      newChat: "New chat",
      close: "Close chat",
      quickLabel: "Quick questions",
      privacy: "Avoid sharing sensitive data in the chat.",
      error: "I couldn't reply right now. Please try again or book a call with the team.",
      quickActions: [
        "I have an idea and need direction",
        "I want to launch an MVP",
        "I need help with pricing and timeline",
        "I want to talk to the team"
      ]
    },
    es: {
      launcher: "Hablar con Cobrait AI",
      title: "Cobrait AI",
      subtitle: "Ayuda r\u00e1pida sobre servicios, precios y siguientes pasos.",
      intro: "Hola. Soy el asistente de Cobrait. Puedo ayudarte a entender qu\u00e9 servicio encaja mejor con tu proyecto, orientar precio y plazo, o sugerir el siguiente paso.",
      placeholder: "Escribe tu mensaje...",
      send: "Enviar",
      bookCall: "Reservar llamada",
      newChat: "Nueva conversaci\u00f3n",
      close: "Cerrar chat",
      quickLabel: "Preguntas r\u00e1pidas",
      privacy: "Evita compartir datos sensibles en el chat.",
      error: "No pude responder ahora mismo. Si quieres, vuelve a intentarlo o reserva una llamada con el equipo.",
      quickActions: [
        "Tengo una idea y necesito direcci\u00f3n",
        "Quiero lanzar un MVP",
        "Necesito entender precio y plazo",
        "Quiero hablar con el equipo"
      ]
    }
  };

  var PAGE_CONTEXT_COPY = {
    pt: {
      pricing: {
        intro: "Posso ajudar-te a perceber o que influencia pre\u00e7o e prazo, e qual o melhor ponto de partida para o teu projeto.",
        quickActions: [
          "O que influencia o pre\u00e7o?",
          "Preciso de perceber or\u00e7amento e prazo",
          "Que servi\u00e7o faz mais sentido?",
          "Quero falar com a equipa"
        ]
      },
      bookCall: {
        intro: "Se quiseres, posso ajudar-te a estruturar o pedido antes da chamada para ficares mais preparado.",
        quickActions: [
          "Ajuda-me a preparar o pedido",
          "Que servi\u00e7o faz mais sentido?",
          "O que devo dizer na chamada?",
          "Quero avan\u00e7ar"
        ]
      },
      service: {
        intro: "Se quiseres, posso dizer-te se este servi\u00e7o faz sentido para o teu caso e qual seria o pr\u00f3ximo passo.",
        quickActions: [
          "Este servi\u00e7o faz sentido para mim?",
          "Em que fase costuma entrar?",
          "Quanto tempo pode demorar?",
          "Quero falar com a equipa"
        ]
      }
    },
    en: {
      pricing: {
        intro: "I can help you understand what affects pricing and timeline, and which starting point makes the most sense for your project.",
        quickActions: [
          "What affects pricing?",
          "I need budget and timeline help",
          "Which service fits best?",
          "I want to talk to the team"
        ]
      },
      bookCall: {
        intro: "If you want, I can help you frame the request before the call so you feel more prepared.",
        quickActions: [
          "Help me prepare the request",
          "Which service fits best?",
          "What should I bring to the call?",
          "I want to move forward"
        ]
      },
      service: {
        intro: "If you want, I can tell you whether this service fits your case and what the next step would look like.",
        quickActions: [
          "Does this service fit my case?",
          "When does it usually make sense?",
          "How long can it take?",
          "I want to talk to the team"
        ]
      }
    },
    es: {
      pricing: {
        intro: "Puedo ayudarte a entender qu\u00e9 influye en el precio y en el plazo, y cu\u00e1l es el mejor punto de partida para tu proyecto.",
        quickActions: [
          "Qu\u00e9 influye en el precio?",
          "Necesito entender presupuesto y plazo",
          "Qu\u00e9 servicio encaja mejor?",
          "Quiero hablar con el equipo"
        ]
      },
      bookCall: {
        intro: "Si quieres, puedo ayudarte a preparar la solicitud antes de la llamada para que llegues con m\u00e1s claridad.",
        quickActions: [
          "Ay\u00fadame a preparar la solicitud",
          "Qu\u00e9 servicio encaja mejor?",
          "Qu\u00e9 debo llevar a la llamada?",
          "Quiero avanzar"
        ]
      },
      service: {
        intro: "Si quieres, puedo decirte si este servicio encaja con tu caso y cu\u00e1l ser\u00eda el siguiente paso.",
        quickActions: [
          "Este servicio encaja con mi caso?",
          "En qu\u00e9 fase suele entrar?",
          "Cu\u00e1nto tiempo puede tardar?",
          "Quiero hablar con el equipo"
        ]
      }
    }
  };

  function normalizeLang(value) {
    var lang = String(value || "").toLowerCase();
    if (lang.indexOf("pt") === 0) return "pt";
    if (lang.indexOf("es") === 0) return "es";
    return "en";
  }

  function getCopy() {
    return COPY[state.lang] || COPY.pt;
  }

  function getPageContextKey() {
    var path = String(window.location.pathname || "").toLowerCase();
    if (path.indexOf("pricing.html") !== -1) return "pricing";
    if (path.indexOf("book-a-call.html") !== -1) return "bookCall";
    if (
      path.indexOf("product-scope") !== -1 ||
      path.indexOf("mvp-builder") !== -1 ||
      path.indexOf("ux-ui") !== -1 ||
      path.indexOf("custom-software") !== -1 ||
      path.indexOf("dedicated-teams") !== -1
    ) {
      return "service";
    }
    return "default";
  }

  function getContextCopy() {
    var langCopy = PAGE_CONTEXT_COPY[state.lang] || PAGE_CONTEXT_COPY.pt || {};
    return langCopy[getPageContextKey()] || null;
  }

  function getIntroMessage(copy) {
    var contextCopy = getContextCopy();
    return contextCopy && contextCopy.intro ? contextCopy.intro : copy.intro;
  }

  function getQuickActions(copy) {
    var contextCopy = getContextCopy();
    return contextCopy && Array.isArray(contextCopy.quickActions) && contextCopy.quickActions.length
      ? contextCopy.quickActions
      : copy.quickActions;
  }

  function getStoredLanguage() {
    try {
      return normalizeLang(localStorage.getItem("preferredLanguage") || document.documentElement.lang || "pt");
    } catch (_error) {
      return normalizeLang(document.documentElement.lang || "pt");
    }
  }

  function resolveApiBase() {
    try {
      var saved = localStorage.getItem("cobrait_admin_api_base");
      if (saved) {
        return String(saved).trim().replace(/\/+$/, "");
      }
    } catch (_error) {}

    var localStatic =
      ["localhost", "127.0.0.1"].indexOf(window.location.hostname) !== -1 &&
      ["5500", "8080", "3000"].indexOf(window.location.port) !== -1;

    if (window.location.protocol === "file:" || localStatic) {
      return "http://localhost:4000/api";
    }

    return String(window.location.origin + "/api").replace(/\/+$/, "");
  }

  function buildBookCallUrl() {
    if (window.location.protocol === "file:") {
      return window.location.pathname.toLowerCase().indexOf("/servicos/") !== -1
        ? "../book-a-call.html"
        : "./book-a-call.html";
    }
    return window.location.origin + "/book-a-call.html";
  }

  function createMessage(role, content, mode) {
    return {
      role: role === "user" ? "user" : "assistant",
      content: String(content || "").trim(),
      mode: mode || null,
      ts: Date.now()
    };
  }

  function sanitizeMessages(messages) {
    if (!Array.isArray(messages)) return [];
    return messages
      .filter(function (item) {
        return item && (item.role === "user" || item.role === "assistant");
      })
      .map(function (item) {
        return createMessage(item.role, String(item.content || "").slice(0, 2000), item.mode || null);
      })
      .filter(function (item) {
        return item.content;
      })
      .slice(-MAX_STORED_MESSAGES);
  }

  function loadState() {
    state.lang = getStoredLanguage();

    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      state.messages = sanitizeMessages(parsed.messages || []);
    } catch (_error) {
      state.messages = [];
    }
  }

  function saveState() {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: state.messages.slice(-MAX_STORED_MESSAGES)
        })
      );
    } catch (_error) {}
  }

  function ensureIntroMessage() {
    if (state.messages.length > 0) return;
    state.messages.push(createMessage("assistant", getIntroMessage(getCopy()), "intro"));
    saveState();
  }

  function escapeAttribute(value) {
    return String(value || "").replace(/"/g, "&quot;");
  }

  function buildMarkup() {
    var copy = getCopy();
    return (
      '<button class="cobrait-chat-launcher" type="button" aria-expanded="false" aria-controls="cobrait-chat-panel">' +
        '<span class="cobrait-chat-launcher__icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M8 10h8M8 14h5M6.5 19.5 4 21v-3.5A7.5 7.5 0 1 1 19.5 15" />' +
          "</svg>" +
        "</span>" +
        '<span class="cobrait-chat-launcher__text">' + copy.launcher + "</span>" +
      "</button>" +
      '<div class="cobrait-chat-overlay" hidden></div>' +
      '<section id="cobrait-chat-panel" class="cobrait-chat-panel" aria-hidden="true">' +
        '<div class="cobrait-chat-panel__shell">' +
          '<header class="cobrait-chat-panel__header">' +
            '<div class="cobrait-chat-panel__brand">' +
              '<span class="cobrait-chat-panel__logo">C</span>' +
              "<div>" +
                '<strong class="cobrait-chat-panel__title">' + copy.title + "</strong>" +
                '<p class="cobrait-chat-panel__subtitle">' + copy.subtitle + "</p>" +
              "</div>" +
            "</div>" +
            '<div class="cobrait-chat-panel__actions">' +
              '<button class="cobrait-chat-action cobrait-chat-reset" type="button" aria-label="' + escapeAttribute(copy.newChat) + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                  '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />' +
                "</svg>" +
              "</button>" +
              '<button class="cobrait-chat-action cobrait-chat-close" type="button" aria-label="' + escapeAttribute(copy.close) + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                  '<path d="m6 6 12 12M18 6 6 18" />' +
                "</svg>" +
              "</button>" +
            "</div>" +
          "</header>" +
          '<div class="cobrait-chat-panel__body">' +
            '<div class="cobrait-chat-messages" role="log" aria-live="polite"></div>' +
            '<div class="cobrait-chat-quick">' +
              '<p class="cobrait-chat-quick__label">' + copy.quickLabel + "</p>" +
              '<div class="cobrait-chat-quick__chips"></div>' +
              '<p class="cobrait-chat-quick__privacy">' + copy.privacy + "</p>" +
            "</div>" +
          "</div>" +
          '<footer class="cobrait-chat-panel__footer">' +
            '<div class="cobrait-chat-composer">' +
              '<textarea class="cobrait-chat-input" rows="1" placeholder="' + escapeAttribute(copy.placeholder) + '"></textarea>' +
              '<button class="cobrait-chat-send" type="button">' + copy.send + "</button>" +
            "</div>" +
            '<a class="cobrait-chat-book" href="' + escapeAttribute(buildBookCallUrl()) + '">' + copy.bookCall + "</a>" +
          "</footer>" +
        "</div>" +
      "</section>"
    );
  }

  function cacheUi() {
    ui.root = document.createElement("div");
    ui.root.className = "cobrait-chat-root";
    ui.root.innerHTML = buildMarkup();
    document.body.appendChild(ui.root);

    ui.launcher = ui.root.querySelector(".cobrait-chat-launcher");
    ui.overlay = ui.root.querySelector(".cobrait-chat-overlay");
    ui.panel = ui.root.querySelector(".cobrait-chat-panel");
    ui.messages = ui.root.querySelector(".cobrait-chat-messages");
    ui.quick = ui.root.querySelector(".cobrait-chat-quick");
    ui.quickLabel = ui.root.querySelector(".cobrait-chat-quick__label");
    ui.quickChips = ui.root.querySelector(".cobrait-chat-quick__chips");
    ui.quickPrivacy = ui.root.querySelector(".cobrait-chat-quick__privacy");
    ui.input = ui.root.querySelector(".cobrait-chat-input");
    ui.send = ui.root.querySelector(".cobrait-chat-send");
    ui.book = ui.root.querySelector(".cobrait-chat-book");
    ui.title = ui.root.querySelector(".cobrait-chat-panel__title");
    ui.subtitle = ui.root.querySelector(".cobrait-chat-panel__subtitle");
    ui.reset = ui.root.querySelector(".cobrait-chat-reset");
    ui.close = ui.root.querySelector(".cobrait-chat-close");
  }

  function autoResizeTextarea() {
    if (!ui.input) return;
    ui.input.style.height = "auto";
    ui.input.style.height = Math.min(ui.input.scrollHeight, 140) + "px";
  }

  function renderMessages() {
    ui.messages.innerHTML = "";

    state.messages.forEach(function (message) {
      var item = document.createElement("div");
      item.className = "cobrait-chat-message cobrait-chat-message--" + message.role;

      var bubble = document.createElement("div");
      bubble.className = "cobrait-chat-bubble";
      bubble.textContent = message.content;

      item.appendChild(bubble);
      ui.messages.appendChild(item);
    });

    if (state.sending) {
      var typing = document.createElement("div");
      typing.className = "cobrait-chat-message cobrait-chat-message--assistant";
      typing.innerHTML =
        '<div class="cobrait-chat-bubble cobrait-chat-bubble--typing">' +
          '<span></span><span></span><span></span>' +
        "</div>";
      ui.messages.appendChild(typing);
    }

    ui.messages.scrollTop = ui.messages.scrollHeight;
  }

  function renderQuickActions() {
    var copy = getCopy();
    var quickActions = getQuickActions(copy);
    ui.quickLabel.textContent = copy.quickLabel;
    ui.quickPrivacy.textContent = copy.privacy;
    ui.quickChips.innerHTML = "";

    var hasUserMessages = state.messages.some(function (message) {
      return message.role === "user";
    });

    ui.quick.hidden = hasUserMessages;
    if (hasUserMessages) return;

    quickActions.forEach(function (label) {
      var button = document.createElement("button");
      button.className = "cobrait-chat-chip";
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", function () {
        submitPrompt(label);
      });
      ui.quickChips.appendChild(button);
    });
  }

  function renderFrame() {
    var copy = getCopy();

    ui.launcher.querySelector(".cobrait-chat-launcher__text").textContent = copy.launcher;
    ui.title.textContent = copy.title;
    ui.subtitle.textContent = copy.subtitle;
    ui.send.textContent = copy.send;
    ui.book.textContent = copy.bookCall;
    ui.book.href = buildBookCallUrl();
    ui.input.placeholder = copy.placeholder;
    ui.reset.setAttribute("aria-label", copy.newChat);
    ui.close.setAttribute("aria-label", copy.close);
    ui.launcher.setAttribute("aria-label", copy.launcher);

    renderMessages();
    renderQuickActions();
    autoResizeTextarea();
  }

  function syncOpenState() {
    document.body.classList.toggle("cobrait-chat-open", state.open);
    ui.panel.classList.toggle("is-open", state.open);
    ui.overlay.hidden = !state.open;
    ui.panel.setAttribute("aria-hidden", state.open ? "false" : "true");
    ui.launcher.setAttribute("aria-expanded", state.open ? "true" : "false");

    if (state.open) {
      setTimeout(function () {
        ui.input.focus();
        ui.messages.scrollTop = ui.messages.scrollHeight;
      }, 40);
    }
  }

  function openPanel() {
    state.open = true;
    syncOpenState();
  }

  function closePanel() {
    state.open = false;
    syncOpenState();
  }

  function resetConversation() {
    state.messages = [];
    ensureIntroMessage();
    saveState();
    renderFrame();
  }

  function appendMessage(role, content, mode) {
    state.messages.push(createMessage(role, content, mode));
    state.messages = state.messages.slice(-MAX_STORED_MESSAGES);
    saveState();
  }

  function buildRequestHistory() {
    return state.messages
      .filter(function (message) {
        return message.role === "user" || message.role === "assistant";
      })
      .slice(-10)
      .map(function (message) {
        return {
          role: message.role,
          content: message.content
        };
      });
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function getTypingDelay(replyText) {
    var textLength = String(replyText || "").trim().length;
    var suggested = 950 + textLength * 8;
    return Math.max(MIN_TYPING_DELAY_MS, Math.min(MAX_TYPING_DELAY_MS, suggested));
  }

  async function submitPrompt(rawValue) {
    var message = String(rawValue || "").trim();
    if (!message || state.sending) return;

    var history = buildRequestHistory();
    appendMessage("user", message, "user");

    state.sending = true;
    ui.input.value = "";
    renderFrame();
    var startedAt = Date.now();

    try {
      var response = await fetch(resolveApiBase() + CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          history: history,
          lang: state.lang,
          page: {
            path: window.location.pathname,
            title: document.title,
            url: window.location.href
          }
        })
      });

      var payload = await response.json().catch(function () {
        return {};
      });

      if (!response.ok || !payload.reply) {
        throw new Error("Chat request failed.");
      }

      var remainingDelay = getTypingDelay(payload.reply) - (Date.now() - startedAt);
      if (remainingDelay > 0) {
        await wait(remainingDelay);
      }

      appendMessage("assistant", String(payload.reply).trim(), payload.mode || "assistant");
    } catch (_error) {
      var errorDelay = MIN_TYPING_DELAY_MS - (Date.now() - startedAt);
      if (errorDelay > 0) {
        await wait(errorDelay);
      }
      appendMessage("assistant", getCopy().error, "error");
    } finally {
      state.sending = false;
      renderFrame();
      ui.messages.scrollTop = ui.messages.scrollHeight;
    }
  }

  function bindEvents() {
    ui.launcher.addEventListener("click", function () {
      if (state.open) {
        closePanel();
      } else {
        openPanel();
      }
    });

    ui.overlay.addEventListener("click", closePanel);
    ui.close.addEventListener("click", closePanel);
    ui.reset.addEventListener("click", resetConversation);
    ui.send.addEventListener("click", function () {
      submitPrompt(ui.input.value);
    });

    ui.input.addEventListener("input", autoResizeTextarea);
    ui.input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitPrompt(ui.input.value);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && state.open) {
        closePanel();
      }
    });

    window.addEventListener("cobrait-set-language", function (event) {
      var nextLang = normalizeLang(event && event.detail ? event.detail : getStoredLanguage());
      var hadOnlyIntro =
        state.messages.length === 1 &&
        state.messages[0] &&
        state.messages[0].role === "assistant" &&
        state.messages[0].mode === "intro";

      state.lang = nextLang;
      if (hadOnlyIntro) {
        state.messages = [createMessage("assistant", getIntroMessage(getCopy()), "intro")];
        saveState();
      }
      renderFrame();
    });
  }

  function boot() {
    if (!document.body || document.body.dataset.noSiteChat === "true") return;

    loadState();
    ensureIntroMessage();
    cacheUi();
    bindEvents();
    renderFrame();
    syncOpenState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
