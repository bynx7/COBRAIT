const config = require("../config");
const { HttpError } = require("../utils/errors");

const MAX_MESSAGE_LENGTH = 1600;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_MESSAGE_LENGTH = 1000;
const REQUEST_TIMEOUT_MS = 18000;

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeSearchText(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeLang(value) {
  const lang = String(value || "").trim().toLowerCase();
  if (lang.startsWith("pt")) return "pt";
  if (lang.startsWith("es")) return "es";
  return "en";
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function sanitizeMessage(value) {
  const message = normalizeText(value);
  if (!message) {
    throw new HttpError(400, "Mensagem em falta.");
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new HttpError(400, "A mensagem excede o limite permitido.");
  }
  return message;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => item && (item.role === "user" || item.role === "assistant"))
    .map((item) => ({
      role: item.role,
      content: normalizeText(item.content).slice(0, MAX_HISTORY_MESSAGE_LENGTH)
    }))
    .filter((item) => item.content)
    .slice(-MAX_HISTORY_ITEMS);
}

function sanitizePage(page) {
  if (!page || typeof page !== "object") {
    return {
      path: "",
      title: ""
    };
  }

  return {
    path: normalizeText(page.path).slice(0, 160),
    title: normalizeText(page.title).slice(0, 160)
  };
}

function getPageHint(page) {
  const path = page.path || "";

  if (path.endsWith("/pricing.html") || path === "/pricing.html") {
    return "The visitor is on the pricing page, so pricing logic, complexity and project fit are especially relevant.";
  }
  if (path.includes("product-scope")) {
    return "The visitor is reading about Product Scope. Explain scope, discovery, clarity, roadmap and how it reduces risk.";
  }
  if (path.includes("mvp-builder")) {
    return "The visitor is reading about MVP Builder. Focus on going to market quickly with a high-quality MVP.";
  }
  if (path.includes("ux-ui")) {
    return "The visitor is reading about UX/UI. Focus on flows, usability, interfaces and product design quality.";
  }
  if (path.includes("custom-software")) {
    return "The visitor is reading about custom software. Focus on tailored solutions and business-specific delivery.";
  }
  if (path.includes("dedicated-teams")) {
    return "The visitor is reading about dedicated teams. Focus on long-term product delivery with a committed team.";
  }
  if (path.endsWith("/book-a-call.html") || path === "/book-a-call.html") {
    return "The visitor is on the book-a-call page. Help them feel ready to schedule and keep answers practical.";
  }
  return "The visitor is browsing the Cobrait website.";
}

function buildInstructions(lang, page) {
  const languageName = lang === "pt" ? "European Portuguese" : lang === "es" ? "Spanish" : "English";

  return [
    "You are Cobra, the website assistant for Cobrait, a software factory.",
    "Reply in " + languageName + ".",
    "Be warm, concise, calm, helpful and professional.",
    "You can answer simple conversational messages such as hello, thanks, how are you, who are you, short jokes and light small talk naturally.",
    "Your goal is to help visitors understand Cobrait, its services, likely next steps, and when a call makes sense.",
    "When the visitor describes a project, suggest the most relevant service and ask one or two short follow-up questions if useful.",
    "Do not invent exact prices, timelines, guarantees, client names, team sizes, or features that are not clearly stated.",
    "If asked about pricing, explain that pricing depends on project type, complexity, scope and timeline, and suggest the pricing page or booking a call.",
    "If asked to contact the team, suggest booking a call through the website.",
    "Keep answers practical and avoid sounding robotic or overly salesy.",
    "If the visitor asks a simple non-business question or small-talk message, answer it briefly and naturally before guiding back to how you can help with their project.",
    "Cobrait services include: Product Scope, MVP Builder, UX/UI, Custom Software Development, and Dedicated Teams.",
    "Product Scope helps clarify goals, users, flows, priorities and scope before building.",
    "MVP Builder is about launching quickly with a high-quality minimum viable product.",
    "UX/UI focuses on product design, usability, flows and interfaces.",
    "Custom Software Development is for tailored software built around business needs.",
    "Dedicated Teams means an embedded product engineering team working alongside the client's roadmap.",
    "Main site sections include work, services, pricing, about, careers, tech and booking a call.",
    getPageHint(page),
    page.title ? "Current page title: " + page.title : "",
    "If you are not sure, say so briefly and guide the visitor toward a useful next step."
  ]
    .filter(Boolean)
    .join("\n");
}

function buildFallbackCatalog(lang) {
  if (lang === "pt") {
    return {
      greeting: "Olá! Sou o assistente da Cobrait. Posso ajudar-te com serviços, pricing, próximos passos ou perceber qual a melhor abordagem para o teu projeto.",
      wellbeing: "Tudo bem por aqui, obrigado. Estou pronto para te ajudar com o teu projeto ou com qualquer dúvida rápida sobre a Cobrait.",
      thanks: "De nada. Se quiseres, diz-me em uma ou duas linhas o que queres construir e eu digo-te qual pode ser o melhor ponto de partida.",
      who: "Sou o assistente da Cobrait. Estou aqui para responder de forma rápida e clara sobre serviços, pricing, processo e próximos passos.",
      capabilities: "Posso ajudar com dúvidas sobre serviços, pricing, scope, MVP, UX/UI, software à medida, equipas dedicadas e também orientar-te para o próximo passo mais certo.",
      goodbye: "Perfeito. Se precisares de ajuda mais tarde, estarei por aqui. Se quiseres avançar, também podes agendar uma chamada com a equipa.",
      joke: "Claro: fazer software sem scope é como construir uma casa começando pelo telhado. Às vezes até arranca, mas raramente acaba bem.",
      pricing: "Na Cobrait, o valor depende sobretudo do tipo de projeto, complexidade, scope e prazo. Se me disseres o que queres construir, eu posso ajudar-te a perceber o nível de complexidade e o serviço mais adequado.",
      services: "A Cobrait trabalha sobretudo com Product Scope, MVP Builder, UX/UI, Software à Medida e Dedicated Teams. Se quiseres, descreve o teu projeto e eu ajudo-te a perceber qual faz mais sentido.",
      timeline: "O prazo depende muito do scope e da complexidade. Normalmente, a melhor forma de estimar bem é perceber objetivos, funcionalidades críticas e urgência do lançamento.",
      call: "Se fizer sentido falar com a equipa, o melhor próximo passo é agendar uma chamada na página de contacto. Também te posso ajudar primeiro a estruturar o pedido.",
      generic: "Posso ajudar com dúvidas sobre serviços, pricing, scope, MVP, UX/UI, software à medida e próximos passos. Se me disseres o objetivo do teu projeto, eu oriento-te."
    };
  }

  if (lang === "es") {
    return {
      greeting: "Hola. Soy el asistente de Cobrait. Puedo ayudarte con servicios, precios, siguientes pasos o con entender cuál es la mejor opción para tu proyecto.",
      wellbeing: "Todo bien por aquí, gracias. Estoy listo para ayudarte con tu proyecto o con cualquier duda rápida sobre Cobrait.",
      thanks: "Con gusto. Si quieres, cuéntame en una o dos líneas qué quieres construir y te digo cuál puede ser el mejor punto de partida.",
      who: "Soy el asistente de Cobrait. Estoy aquí para responder de forma clara y rápida sobre servicios, precios, proceso y siguientes pasos.",
      capabilities: "Puedo ayudarte con dudas sobre servicios, precios, scope, MVP, UX/UI, software a medida, equipos dedicados y también orientarte hacia el siguiente paso correcto.",
      goodbye: "Perfecto. Si necesitas ayuda más tarde, estaré por aquí. Si quieres avanzar, también puedes reservar una llamada con el equipo.",
      joke: "Claro: hacer software sin scope es como construir una casa empezando por el tejado. A veces arranca, pero rara vez termina bien.",
      pricing: "En Cobrait, el precio depende sobre todo del tipo de proyecto, la complejidad, el alcance y el plazo. Si me explicas lo que quieres construir, puedo ayudarte a entender el nivel de complejidad y el servicio más adecuado.",
      services: "Cobrait trabaja sobre todo con Product Scope, MVP Builder, UX/UI, Software a Medida y Dedicated Teams. Si quieres, describe tu proyecto y te ayudo a ver qué encaja mejor.",
      timeline: "El plazo depende bastante del alcance y la complejidad. Normalmente, la mejor forma de estimarlo bien es entender objetivos, funcionalidades clave y urgencia de lanzamiento.",
      call: "Si te encaja hablar con el equipo, el mejor siguiente paso es reservar una llamada en la web. Si prefieres, antes puedo ayudarte a estructurar la necesidad.",
      generic: "Puedo ayudarte con dudas sobre servicios, precios, scope, MVP, UX/UI, software a medida y siguientes pasos. Si me dices el objetivo de tu proyecto, te oriento."
    };
  }

  return {
    greeting: "Hello. I'm Cobrait's assistant. I can help with services, pricing, next steps, or figuring out the best direction for your project.",
    wellbeing: "I'm doing well, thanks. I'm here to help with your project or with any quick question about Cobrait.",
    thanks: "You're welcome. If you want, tell me in one or two lines what you're trying to build and I'll suggest a good starting point.",
    who: "I'm Cobrait's assistant. I help visitors with quick answers about services, pricing, process and the best next step.",
    capabilities: "I can help with services, pricing, scope, MVP, UX/UI, custom software, dedicated teams and practical next steps for your project.",
    goodbye: "Sounds good. If you need help later, I'll be here. If you want to move forward, you can also book a call with the team.",
    joke: "Sure: building software without clear scope is like coding with your eyes closed. Technically possible, rarely efficient.",
    pricing: "Cobrait pricing depends mainly on project type, complexity, scope and timeline. If you tell me what you want to build, I can help you understand the likely complexity and the most relevant service.",
    services: "Cobrait mainly works across Product Scope, MVP Builder, UX/UI, Custom Software Development and Dedicated Teams. If you describe your project, I can help you choose the best fit.",
    timeline: "Timeline depends a lot on scope and complexity. The best way to estimate it properly is to understand goals, critical features and launch urgency.",
    call: "If you'd like to speak with the team, the best next step is to book a call on the website. I can also help you frame the request first.",
    generic: "I can help with questions about services, pricing, scope, MVP, UX/UI, custom software and next steps. If you tell me your project goal, I'll guide you."
  };
}

function buildFallbackReply(message, lang) {
  const text = normalizeSearchText(message);
  const catalog = buildFallbackCatalog(lang);

  if (/^(ola|oi|hello|hi|hey|hola|buenas|bom dia|boa tarde|boa noite)\b/.test(text)) {
    return catalog.greeting;
  }

  if (includesAny(text, [
    /\b(tudo bem|como estas|como esta|como vai|estas bem|how are you|hows it going|how are things|que tal|todo bien|como estas)\b/,
    /^(tudo bem|how are you|todo bien)\??$/
  ])) {
    return catalog.wellbeing;
  }

  if (/\b(obrigad|thanks|thank you|gracias)\b/.test(text)) {
    return catalog.thanks;
  }

  if (includesAny(text, [
    /\b(quem es|quem es tu|quem e|who are you|what are you|quien eres)\b/,
    /\b(eres humano|es humano|are you human)\b/
  ])) {
    return catalog.who;
  }

  if (includesAny(text, [
    /\b(o que fazes|o que podes fazer|como podes ajudar|what can you do|how can you help|que puedes hacer|como puedes ayudar)\b/
  ])) {
    return catalog.capabilities;
  }

  if (includesAny(text, [
    /\b(adeus|xau|tchau|bye|goodbye|see you|ate logo|ate ja|hasta luego|adios)\b/
  ])) {
    return catalog.goodbye;
  }

  if (includesAny(text, [
    /\b(piada|joke|funny|grace|gracioso|chiste)\b/
  ])) {
    return catalog.joke;
  }

  if (/\b(preco|precos|pricing|price|prices|cost|custo|budget|presupuesto|precio|precios)\b/.test(text)) {
    return catalog.pricing;
  }

  if (/\b(servicos|services|service|o que fazem|que fazem|que servicio|servicios)\b/.test(text)) {
    return catalog.services;
  }

  if (/\b(tempo|prazo|timeline|deadline|cuanto tiempo|how long)\b/.test(text)) {
    return catalog.timeline;
  }

  if (/\b(call|agendar|book|marcar|equipa|equipo|team|contactar|hablar)\b/.test(text)) {
    return catalog.call;
  }

  return catalog.generic;
}

function shouldUseInstantReply(message) {
  const text = normalizeSearchText(message);
  return /^(ola|oi|hello|hi|hey|hola|buenas|bom dia|boa tarde|boa noite)\b/.test(text) ||
    /\b(obrigad|thanks|thank you|gracias)\b/.test(text) ||
    /\b(tudo bem|como estas|como esta|how are you|todo bien|quem es|who are you|quien eres|o que podes fazer|what can you do|bye|goodbye|adeus|joke|piada|chiste)\b/.test(text);
}

function buildOpenAIInput(history, message) {
  return history
    .concat([{ role: "user", content: message }])
    .map((item) => ({
      role: item.role,
      content: item.content
    }));
}

function extractResponseText(payload) {
  if (payload && typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const parts = [];
  const output = payload && Array.isArray(payload.output) ? payload.output : [];

  output.forEach((item) => {
    if (!item || !Array.isArray(item.content)) return;
    item.content.forEach((contentItem) => {
      if (!contentItem) return;
      if (contentItem.type === "output_text") {
        const text = typeof contentItem.text === "string"
          ? contentItem.text
          : contentItem.text && typeof contentItem.text.value === "string"
            ? contentItem.text.value
            : "";
        if (text) parts.push(text);
      }
      if (contentItem.type === "text" && typeof contentItem.text === "string") {
        parts.push(contentItem.text);
      }
    });
  });

  return parts.join("\n\n").trim();
}

async function requestOpenAIReply(message, history, lang, page) {
  if (!config.openaiApiKey) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.openaiApiKey
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.openaiChatModel,
        store: false,
        reasoning: {
          effort: "low"
        },
        max_output_tokens: 420,
        instructions: buildInstructions(lang, page),
        input: buildOpenAIInput(history, message)
      })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = payload && payload.error && payload.error.message
        ? payload.error.message
        : "OpenAI request failed.";
      throw new Error(errorMessage);
    }

    const reply = extractResponseText(payload);
    if (!reply) {
      throw new Error("OpenAI response did not include text output.");
    }

    return {
      reply,
      mode: "openai",
      model: payload.model || config.openaiChatModel
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function createChatReply(payload) {
  const message = sanitizeMessage(payload && payload.message);
  const history = sanitizeHistory(payload && payload.history);
  const lang = normalizeLang(payload && payload.lang);
  const page = sanitizePage(payload && payload.page);

  if (shouldUseInstantReply(message)) {
    return {
      reply: buildFallbackReply(message, lang),
      mode: "instant",
      model: null
    };
  }

  try {
    const openaiReply = await requestOpenAIReply(message, history, lang, page);
    if (openaiReply) {
      return openaiReply;
    }
  } catch (error) {
    console.error("Cobrait chat upstream error:", error.message);
  }

  return {
    reply: buildFallbackReply(message, lang),
    mode: "fallback",
    model: null
  };
}

module.exports = {
  createChatReply
};
