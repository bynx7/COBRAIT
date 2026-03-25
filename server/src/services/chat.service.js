const config = require("../config");
const { HttpError } = require("../utils/errors");

const MAX_MESSAGE_LENGTH = 1600;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_MESSAGE_LENGTH = 1000;
const REQUEST_TIMEOUT_MS = 18000;

const SERVICE_ORDER = ["productScope", "mvpBuilder", "uxUi", "customSoftware", "dedicatedTeams"];

const SERVICE_MATCHERS = {
  productScope: [
    /\bproduct scope\b/,
    /\bscope\b/,
    /\bdiscovery\b/,
    /\broadmap\b/,
    /\brequisitos?\b/,
    /\brequirements?\b/,
    /\bclarif/,
    /\bdefin/
  ],
  mvpBuilder: [
    /\bmvp\b/,
    /\bminimum viable product\b/,
    /\bvalida/,
    /\blanc/,
    /\blaunch\b/,
    /\bstartup\b/,
    /\bprototype\b/,
    /\bprototipo\b/,
    /\bv1\b/
  ],
  uxUi: [
    /\bux\b/,
    /\bui\b/,
    /\bdesign\b/,
    /\bredesign\b/,
    /\binterface/,
    /\busabil/,
    /\bwireframe\b/,
    /\bfigma\b/
  ],
  customSoftware: [
    /\bsoftware\b/,
    /\bapp\b/,
    /\baplicac/,
    /\bplataform/,
    /\bplatform\b/,
    /\bportal\b/,
    /\bdashboard\b/,
    /\bwebsite\b/,
    /\bsite\b/,
    /\bsaas\b/,
    /\bsistema\b/,
    /\bsystem\b/,
    /\berp\b/,
    /\bcrm\b/,
    /\bautomac/,
    /\bintegrac/,
    /\bbackend\b/,
    /\bfrontend\b/,
    /\bmobile\b/
  ],
  dedicatedTeams: [
    /\bdedicated team/,
    /\bdedicated teams/,
    /\bequipa dedicada/,
    /\bequipo dedicado/,
    /\bstaff augmentation\b/,
    /\bteam augmentation\b/,
    /\boutsourc/,
    /\bnearshore\b/,
    /\bsquad\b/
  ]
};

const PROJECT_SIGNAL_PATTERNS = {
  idea: [
    /\b(idea|ideia|concept|conceito|from scratch|do zero|desde cero)\b/,
    /\b(starting|a comecar|empezando)\b/
  ],
  existing: [
    /\b(existing|existente|current|atual|actual|already have|ja tenho|ja temos|ya tengo|ya tenemos)\b/,
    /\b(redesign|redesenho|rediseño|improve|melhorar|mejorar)\b/
  ],
  live: [
    /\b(live|production|producao|produccion|real users|users|utilizadores|usuarios|trafego)\b/,
    /\b(clientes reais|uso real|real usage)\b/
  ],
  website: [/\b(website|site|landing page|landing|pagina web|pagina)\b/]
};

const SERVICE_LABELS = {
  pt: {
    productScope: "Product Scope",
    mvpBuilder: "MVP Builder",
    uxUi: "UX/UI",
    customSoftware: "Software à Medida",
    dedicatedTeams: "Dedicated Teams"
  },
  en: {
    productScope: "Product Scope",
    mvpBuilder: "MVP Builder",
    uxUi: "UX/UI",
    customSoftware: "Custom Software Development",
    dedicatedTeams: "Dedicated Teams"
  },
  es: {
    productScope: "Product Scope",
    mvpBuilder: "MVP Builder",
    uxUi: "UX/UI",
    customSoftware: "Software a Medida",
    dedicatedTeams: "Dedicated Teams"
  }
};

const QUALIFICATION_PROMPTS = {
  pt: {
    productScope: {
      default: "Estás ainda a clarificar a ideia ou já tens requisitos mais fechados?",
      idea: "Qual é a principal dúvida que queres resolver antes de avançar: objetivos, funcionalidades, utilizadores ou roadmap?"
    },
    mvpBuilder: {
      default: "O objetivo é validar com utilizadores reais, lançar mais rápido, ou mostrar progresso a investidores?",
      existing: "Isto seria a primeira versão utilizável ou uma iteração sobre algo que já existe?"
    },
    uxUi: {
      default: "Estás a melhorar um produto que já existe ou a desenhar a experiência de raiz?"
    },
    customSoftware: {
      default: "Isto é para uso interno, para clientes, ou para ambos?",
      website: "Estás a pensar num site institucional, num portal com lógica de negócio, ou numa plataforma mais completa?"
    },
    dedicatedTeams: {
      default: "Queres reforçar uma equipa existente ou precisas de uma equipa mais completa a trabalhar contigo?"
    }
  },
  en: {
    productScope: {
      default: "Are you still clarifying the idea, or do you already have more defined requirements?",
      idea: "What is the main uncertainty you want to solve before moving forward: goals, features, users or roadmap?"
    },
    mvpBuilder: {
      default: "Is the goal to validate with real users, launch faster, or show progress to investors?",
      existing: "Would this be the first usable version, or an iteration on something that already exists?"
    },
    uxUi: {
      default: "Are you improving an existing product, or designing the experience from scratch?"
    },
    customSoftware: {
      default: "Is this for internal use, for customers, or both?",
      website: "Are you thinking about a marketing website, a portal with business logic, or a more complete platform?"
    },
    dedicatedTeams: {
      default: "Are you looking to extend an existing team, or do you need a more complete team working with you?"
    }
  },
  es: {
    productScope: {
      default: "¿Todavía estás aclarando la idea o ya tienes requisitos más definidos?",
      idea: "¿Cuál es la principal duda que quieres resolver antes de avanzar: objetivos, funcionalidades, usuarios o roadmap?"
    },
    mvpBuilder: {
      default: "¿El objetivo es validar con usuarios reales, lanzar más rápido o mostrar progreso a inversores?",
      existing: "¿Sería la primera versión utilizable o una iteración sobre algo que ya existe?"
    },
    uxUi: {
      default: "¿Estás mejorando un producto existente o diseñando la experiencia desde cero?"
    },
    customSoftware: {
      default: "¿Esto es para uso interno, para clientes o para ambos?",
      website: "¿Estás pensando en una web corporativa, en un portal con lógica de negocio o en una plataforma más completa?"
    },
    dedicatedTeams: {
      default: "¿Quieres reforzar un equipo existente o necesitas un equipo más completo trabajando contigo?"
    }
  }
};

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

function isPricingPage(page) {
  const path = page.path || "";
  return path.endsWith("/pricing.html") || path === "/pricing.html";
}

function isBookCallPage(page) {
  const path = page.path || "";
  return path.endsWith("/book-a-call.html") || path === "/book-a-call.html";
}

function getPageServiceKey(page) {
  const path = page.path || "";
  if (path.includes("product-scope")) return "productScope";
  if (path.includes("mvp-builder")) return "mvpBuilder";
  if (path.includes("ux-ui")) return "uxUi";
  if (path.includes("custom-software")) return "customSoftware";
  if (path.includes("dedicated-teams")) return "dedicatedTeams";
  return null;
}

function getPageHint(page) {
  if (isPricingPage(page)) {
    return "The visitor is on the pricing page, so pricing logic and project fit are especially relevant.";
  }

  const serviceKey = getPageServiceKey(page);
  if (serviceKey === "productScope") {
    return "The visitor is reading about Product Scope. Explain scope, discovery, clarity and roadmap.";
  }
  if (serviceKey === "mvpBuilder") {
    return "The visitor is reading about MVP Builder. Focus on validation and launching quickly.";
  }
  if (serviceKey === "uxUi") {
    return "The visitor is reading about UX/UI. Focus on flows, usability and interface quality.";
  }
  if (serviceKey === "customSoftware") {
    return "The visitor is reading about custom software. Focus on tailored systems, platforms and integrations.";
  }
  if (serviceKey === "dedicatedTeams") {
    return "The visitor is reading about dedicated teams. Focus on long-term delivery capacity.";
  }
  if (isBookCallPage(page)) {
    return "The visitor is on the book-a-call page. Help them feel ready to schedule and keep answers practical.";
  }
  return "The visitor is browsing the Cobrait website.";
}

function detectProjectSignals(text) {
  return Object.keys(PROJECT_SIGNAL_PATTERNS).reduce((signals, key) => {
    signals[key] = includesAny(text, PROJECT_SIGNAL_PATTERNS[key]);
    return signals;
  }, {});
}

function getServiceLabel(lang, serviceKey) {
  if (!serviceKey) return "";
  const labels = SERVICE_LABELS[lang] || SERVICE_LABELS.en;
  return labels[serviceKey] || SERVICE_LABELS.en[serviceKey] || "";
}

function looksLikeProjectBrief(text) {
  const hasProjectWords = includesAny(text, [
    /\b(app|aplicac|plataform|platform|portal|dashboard|website|site|saas|software|sistema|system|mvp|produto|producto|product|experiencia|experience|ferramenta|tool|integrac|automac|ux|ui|design)\b/
  ]);
  const hasIntentWords = includesAny(text, [
    /\b(quero|preciso|tenho|estou a|need|want|building|trying to|quiero|necesito|estoy)\b/
  ]);

  return (hasProjectWords && (text.length >= 40 || hasIntentWords)) || (text.length >= 120 && hasIntentWords);
}

function detectServiceMatch(text, page) {
  const signals = detectProjectSignals(text);
  const scores = {
    productScope: 0,
    mvpBuilder: 0,
    uxUi: 0,
    customSoftware: 0,
    dedicatedTeams: 0
  };

  SERVICE_ORDER.forEach((key) => {
    SERVICE_MATCHERS[key].forEach((pattern) => {
      if (pattern.test(text)) {
        scores[key] += 1;
      }
    });
  });

  if (includesAny(text, [/\b(nao sei|not sure|no estoy seguro)\b/, /\b(definir|clarificar|clarify|define)\b/])) {
    scores.productScope += 2;
  }
  if (includesAny(text, [/\brequisitos?\b/, /\brequirements?\b/, /\broadmap\b/])) {
    scores.productScope += 2;
  }
  if (signals.idea) {
    scores.productScope += 1;
  }
  if (includesAny(text, [/\b(valida|launch|lanc|startup|mvp|v1)\b/])) {
    scores.mvpBuilder += 2;
  }
  if (includesAny(text, [/\b(ux|ui|redesign|interface|usabil|figma)\b/])) {
    scores.uxUi += 2;
  }
  if (signals.existing && includesAny(text, [/\b(produto|producto|product|experiencia|experience)\b/])) {
    scores.uxUi += 1;
  }
  if (includesAny(text, [/\b(erp|crm|portal|dashboard|saas|sistema|system|integrac|automac|backend|frontend|mobile)\b/])) {
    scores.customSoftware += 2;
  }
  if (includesAny(text, [/\b(equipa dedicada|dedicated team|dedicated teams|team augmentation|staff augmentation|outsourc|nearshore|squad)\b/])) {
    scores.dedicatedTeams += 2;
  }

  const pageServiceKey = getPageServiceKey(page);
  if (pageServiceKey && (scores[pageServiceKey] > 0 || looksLikeProjectBrief(text))) {
    scores[pageServiceKey] += 1;
  }

  let bestKey = null;
  let bestScore = 0;
  SERVICE_ORDER.forEach((key) => {
    if (scores[key] > bestScore) {
      bestScore = scores[key];
      bestKey = key;
    }
  });

  return bestScore >= 2 ? bestKey : null;
}

function buildInstructions(lang, page) {
  const languageName = lang === "pt" ? "European Portuguese" : lang === "es" ? "Spanish" : "English";

  return [
    "You are Cobra, the website assistant for Cobrait, a software factory.",
    "Reply in " + languageName + ".",
    "Be warm, concise, calm, helpful and professional.",
    "You can answer simple conversational messages naturally.",
    "Your goal is to help visitors understand Cobrait, its services, likely next steps, and when a call makes sense.",
    "When the visitor describes a project, suggest the most relevant service, explain why it fits in one sentence, and ask one sharp follow-up question if useful.",
    "Do not invent exact prices, timelines, guarantees, client names, team sizes, or features that are not clearly stated.",
    "If asked about pricing, explain that pricing depends on project type, complexity, scope and timeline, and suggest the pricing page or booking a call.",
    "If asked to contact the team, suggest booking a call through the website.",
    "Keep answers practical, plain-spoken and avoid sounding robotic or overly salesy.",
    "If the visitor sounds ready to move, guide them toward the clearest next step.",
    "Do not dump long checklists. Prefer short paragraphs and direct questions.",
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
      greeting: "Olá! Sou o assistente da Cobrait. Posso ajudar-te a perceber o serviço certo, enquadrar preço e prazo, ou preparar o próximo passo para o teu projeto.",
      wellbeing: "Tudo bem por aqui, obrigado. Estou pronto para te ajudar com o teu projeto ou com qualquer dúvida rápida sobre a Cobrait.",
      thanks: "De nada. Se quiseres, diz-me em uma ou duas linhas o que queres construir e eu digo-te qual pode ser o melhor ponto de partida.",
      who: "Sou o assistente da Cobrait. Estou aqui para responder de forma rápida e clara sobre serviços, pricing, processo e próximos passos.",
      capabilities: "Posso ajudar com Product Scope, MVP Builder, UX/UI, software à medida, equipas dedicadas, preços e próximos passos.",
      goodbye: "Perfeito. Se precisares de ajuda mais tarde, estarei por aqui. Se quiseres avançar, também podes agendar uma chamada com a equipa.",
      joke: "Claro: fazer software sem scope é como construir uma casa começando pelo telhado. Às vezes até arranca, mas raramente acaba bem.",
      pricing: "O preço depende sobretudo do tipo de produto, complexidade, scope e prazo. Se me disseres o que queres construir e em que fase estás, eu consigo orientar-te melhor.",
      services: "A Cobrait trabalha sobretudo com Product Scope, MVP Builder, UX/UI, Software à Medida e Dedicated Teams. Se quiseres, descreve o teu projeto e eu ajudo-te a perceber qual faz mais sentido.",
      timeline: "O prazo depende do scope, da complexidade e do nível de definição do produto. Se me disseres o que queres lançar e se já tens requisitos fechados, eu consigo enquadrar melhor.",
      call: "Se fizer sentido falar com a equipa, o melhor próximo passo é agendar uma chamada no site. Se quiseres, eu também posso ajudar-te primeiro a estruturar o pedido em duas ou três linhas.",
      generic: "Posso ajudar com dúvidas sobre serviços, pricing, scope, MVP, UX/UI, software à medida e próximos passos. Se me disseres o objetivo do teu projeto, eu oriento-te.",
      projectGeneric: "Consigo ajudar-te a enquadrar isso. Diz-me só estas três coisas: o que queres construir, em que fase estás, e se tens alguma data alvo.",
      serviceReplies: {
        productScope: "Pelo que descreves, Product Scope parece o melhor ponto de partida. Faz sentido quando ainda é preciso clarificar objetivos, utilizadores, prioridades e roadmap antes de desenvolver.",
        mvpBuilder: "Pelo que descreves, MVP Builder parece o melhor fit. Faz sentido quando queres validar ou lançar rápido com uma primeira versão bem pensada.",
        uxUi: "Pelo que descreves, UX/UI parece o serviço mais indicado. Faz sentido quando queres melhorar fluxos, interfaces, usabilidade ou redesenhar um produto existente.",
        customSoftware: "Pelo que descreves, Software à Medida parece o melhor encaixe. Faz sentido para plataformas, portais, sistemas internos, automações ou integrações adaptadas ao negócio.",
        dedicatedTeams: "Pelo que descreves, Dedicated Teams pode ser o melhor caminho. Faz sentido quando precisas de capacidade contínua de produto e engenharia com uma equipa a trabalhar ao teu lado no roadmap."
      }
    };
  }

  if (lang === "es") {
    return {
      greeting: "Hola. Soy el asistente de Cobrait. Puedo ayudarte a entender qué servicio encaja mejor, orientar precio y plazo, o preparar el siguiente paso para tu proyecto.",
      wellbeing: "Todo bien por aquí, gracias. Estoy listo para ayudarte con tu proyecto o con cualquier duda rápida sobre Cobrait.",
      thanks: "Con gusto. Si quieres, cuéntame en una o dos líneas qué quieres construir y te digo cuál puede ser el mejor punto de partida.",
      who: "Soy el asistente de Cobrait. Estoy aquí para responder de forma clara y rápida sobre servicios, precios, proceso y siguientes pasos.",
      capabilities: "Puedo ayudarte con Product Scope, MVP Builder, UX/UI, software a medida, equipos dedicados, precios y siguientes pasos.",
      goodbye: "Perfecto. Si necesitas ayuda más tarde, estaré por aquí. Si quieres avanzar, también puedes reservar una llamada con el equipo.",
      joke: "Claro: hacer software sin scope es como construir una casa empezando por el tejado. A veces arranca, pero rara vez termina bien.",
      pricing: "El precio depende sobre todo del tipo de producto, la complejidad, el alcance y el plazo. Si me explicas lo que quieres construir y en qué fase estás, puedo orientarte mejor.",
      services: "Cobrait trabaja sobre todo con Product Scope, MVP Builder, UX/UI, Software a Medida y Dedicated Teams. Si quieres, describe tu proyecto y te ayudo a ver qué encaja mejor.",
      timeline: "El plazo depende del alcance, de la complejidad y del nivel de definición del producto. Si me cuentas qué quieres lanzar y si ya tienes requisitos definidos, puedo orientarte mejor.",
      call: "Si te encaja hablar con el equipo, el mejor siguiente paso es reservar una llamada en la web. Si quieres, antes también puedo ayudarte a estructurar la necesidad en dos o tres líneas.",
      generic: "Puedo ayudarte con dudas sobre servicios, precios, scope, MVP, UX/UI, software a medida y siguientes pasos. Si me dices el objetivo de tu proyecto, te oriento.",
      projectGeneric: "Puedo ayudarte a encajar eso mejor. Dime solo estas tres cosas: qué quieres construir, en qué fase estás y si tienes alguna fecha objetivo.",
      serviceReplies: {
        productScope: "Por lo que describes, Product Scope parece el mejor punto de partida. Tiene sentido cuando todavía hay que aclarar objetivos, usuarios, prioridades y roadmap antes de desarrollar.",
        mvpBuilder: "Por lo que describes, MVP Builder parece el mejor fit. Tiene sentido cuando quieres validar o lanzar rápido con una primera versión bien pensada.",
        uxUi: "Por lo que describes, UX/UI parece el servicio más indicado. Tiene sentido cuando quieres mejorar flujos, interfaces, usabilidad o rediseñar un producto existente.",
        customSoftware: "Por lo que describes, Software a Medida parece el mejor encaje. Tiene sentido para plataformas, portales, sistemas internos, automatizaciones o integraciones adaptadas al negocio.",
        dedicatedTeams: "Por lo que describes, Dedicated Teams puede ser el mejor camino. Tiene sentido cuando necesitas capacidad continua de producto e ingeniería con un equipo trabajando contigo en el roadmap."
      }
    };
  }

  return {
    greeting: "Hello. I'm Cobrait's assistant. I can help you choose the right service, frame pricing and timeline, or prepare the next step for your project.",
    wellbeing: "I'm doing well, thanks. I'm here to help with your project or with any quick question about Cobrait.",
    thanks: "You're welcome. If you want, tell me in one or two lines what you're trying to build and I'll suggest a good starting point.",
    who: "I'm Cobrait's assistant. I help visitors with quick answers about services, pricing, process and the best next step.",
    capabilities: "I can help with Product Scope, MVPs, UX/UI, custom software, dedicated teams, pricing and practical next steps.",
    goodbye: "Sounds good. If you need help later, I'll be here. If you want to move forward, you can also book a call with the team.",
    joke: "Sure: building software without clear scope is like coding with your eyes closed. Technically possible, rarely efficient.",
    pricing: "Pricing depends mainly on product type, complexity, scope and timeline. If you tell me what you want to build and what stage you're at, I can help frame it better.",
    services: "Cobrait mainly works across Product Scope, MVP Builder, UX/UI, Custom Software Development and Dedicated Teams. If you describe your project, I can help you choose the best fit.",
    timeline: "Timeline depends on scope, complexity and how defined the product already is. If you tell me what you want to launch and whether requirements are already clear, I can help frame it better.",
    call: "If you'd like to speak with the team, the best next step is to book a call on the website. I can also help you frame the request in two or three lines first.",
    generic: "I can help with questions about services, pricing, scope, MVP, UX/UI, custom software and next steps. If you tell me your project goal, I'll guide you.",
    projectGeneric: "I can help frame that. Tell me just three things: what you want to build, what stage you're at, and whether you have a target date.",
    serviceReplies: {
      productScope: "From what you described, Product Scope sounds like the best starting point. It fits when goals, users, priorities and roadmap still need to be clarified before development starts.",
      mvpBuilder: "From what you described, MVP Builder looks like the best fit. It makes sense when you want to validate or launch quickly with a strong first version.",
      uxUi: "From what you described, UX/UI seems like the right service. It fits when you want to improve flows, interfaces, usability or redesign an existing product.",
      customSoftware: "From what you described, Custom Software looks like the best match. It fits platforms, portals, internal systems, automations or integrations tailored to the business.",
      dedicatedTeams: "From what you described, Dedicated Teams could be the best path. It fits when you need ongoing product and engineering capacity with a team working alongside your roadmap."
    }
  };
}

function pickQualificationPrompt(lang, serviceKey, text) {
  const prompts = QUALIFICATION_PROMPTS[lang] || QUALIFICATION_PROMPTS.en;
  const signals = detectProjectSignals(text);

  if (!serviceKey || !prompts[serviceKey]) return "";

  if (serviceKey === "productScope") {
    return signals.idea ? prompts.productScope.idea : prompts.productScope.default;
  }
  if (serviceKey === "mvpBuilder") {
    return signals.existing || signals.live ? prompts.mvpBuilder.existing : prompts.mvpBuilder.default;
  }
  if (serviceKey === "uxUi") {
    return prompts.uxUi.default;
  }
  if (serviceKey === "customSoftware") {
    return signals.website ? prompts.customSoftware.website : prompts.customSoftware.default;
  }
  if (serviceKey === "dedicatedTeams") {
    return prompts.dedicatedTeams.default;
  }

  return "";
}

function buildServiceRecommendationReply(serviceKey, lang, text) {
  const catalog = buildFallbackCatalog(lang);
  if (!serviceKey || !catalog.serviceReplies || !catalog.serviceReplies[serviceKey]) {
    return catalog.projectGeneric || catalog.generic;
  }

  const followUp = pickQualificationPrompt(lang, serviceKey, text);
  return [catalog.serviceReplies[serviceKey], followUp].filter(Boolean).join(" ");
}

function buildPricingReply(message, lang, page) {
  const catalog = buildFallbackCatalog(lang);
  const text = normalizeSearchText(message);
  const serviceKey = detectServiceMatch(text, page) || getPageServiceKey(page);
  const serviceLabel = getServiceLabel(lang, serviceKey);

  if (!serviceLabel) return catalog.pricing;

  if (lang === "pt") {
    return "Para " + serviceLabel + ", o preço depende sobretudo do scope, complexidade e prazo. Se quiseres, diz-me o que queres construir e em que fase estás, e eu ajudo-te a enquadrar melhor.";
  }
  if (lang === "es") {
    return "Para " + serviceLabel + ", el precio depende sobre todo del alcance, la complejidad y el plazo. Si quieres, dime qué quieres construir y en qué fase estás, y te ayudo a encajarlo mejor.";
  }
  return "For " + serviceLabel + ", pricing depends mainly on scope, complexity and timeline. If you want, tell me what you want to build and what stage you're at, and I'll help frame it better.";
}

function buildTimelineReply(message, lang, page) {
  const catalog = buildFallbackCatalog(lang);
  const text = normalizeSearchText(message);
  const serviceKey = detectServiceMatch(text, page) || getPageServiceKey(page);
  const serviceLabel = getServiceLabel(lang, serviceKey);

  if (!serviceLabel) return catalog.timeline;

  if (lang === "pt") {
    return "Em " + serviceLabel + ", o prazo depende muito do nível de definição, das funcionalidades críticas e da urgência. Se quiseres, diz-me o que queres lançar e se já tens requisitos mais fechados.";
  }
  if (lang === "es") {
    return "En " + serviceLabel + ", el plazo depende mucho del nivel de definición, de las funcionalidades clave y de la urgencia. Si quieres, dime qué quieres lanzar y si ya tienes requisitos más claros.";
  }
  return "For " + serviceLabel + ", timeline depends heavily on how defined the product already is, the critical features and launch urgency. If you want, tell me what you want to launch and whether requirements are already clear.";
}

function buildFallbackReply(message, lang, page) {
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
    return buildPricingReply(message, lang, page);
  }

  if (/\b(servicos|services|service|o que fazem|que fazem|que servicio|servicios)\b/.test(text)) {
    return catalog.services;
  }

  if (/\b(tempo|prazo|timeline|deadline|cuanto tiempo|how long)\b/.test(text)) {
    return buildTimelineReply(message, lang, page);
  }

  if (/\b(call|agendar|book|marcar|equipa|equipo|team|contactar|hablar)\b/.test(text)) {
    return catalog.call;
  }

  const serviceMatch = detectServiceMatch(text, page);
  if (serviceMatch) {
    return buildServiceRecommendationReply(serviceMatch, lang, text);
  }

  if (looksLikeProjectBrief(text)) {
    const pageServiceKey = getPageServiceKey(page);
    if (pageServiceKey) {
      return buildServiceRecommendationReply(pageServiceKey, lang, text);
    }
    return catalog.projectGeneric || catalog.generic;
  }

  return catalog.generic;
}

function shouldUseInstantReply(message) {
  const text = normalizeSearchText(message);
  if (looksLikeProjectBrief(text)) return false;

  return /^(ola|oi|hello|hi|hey|hola|buenas|bom dia|boa tarde|boa noite)\b/.test(text) ||
    /\b(obrigad|thanks|thank you|gracias)\b/.test(text) ||
    /\b(tudo bem|como estas|como esta|how are you|todo bien|quem es|who are you|quien eres|o que podes fazer|what can you do|bye|goodbye|adeus|joke|piada|chiste)\b/.test(text) ||
    /\b(preco|precos|pricing|price|prices|cost|custo|budget|presupuesto|precio|precios)\b/.test(text) ||
    /\b(servicos|services|service|o que fazem|que fazem|que servicio|servicios)\b/.test(text) ||
    /\b(tempo|prazo|timeline|deadline|cuanto tiempo|how long)\b/.test(text) ||
    /\b(call|agendar|book|marcar|equipa|equipo|team|contactar|hablar)\b/.test(text);
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
      reply: buildFallbackReply(message, lang, page),
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
    reply: buildFallbackReply(message, lang, page),
    mode: "fallback",
    model: null
  };
}

module.exports = {
  createChatReply
};
