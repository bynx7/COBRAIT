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
    const CORE_TRANSLATIONS = [
      { pt: "Voltar ao início", en: "Back to home", es: "Volver al inicio" },
      { pt: "Última atualização: 26 de fevereiro de 2026", en: "Last updated: February 26, 2026", es: "Última actualización: 26 de febrero de 2026" },
      { pt: "Cobrait - Legal", en: "Cobrait - Legal", es: "Cobrait - Legal" },
      { pt: "Índice", en: "Index", es: "Índice" },
      { pt: "Termos e Condições", en: "Terms and Conditions", es: "Términos y Condiciones" },
      { pt: "Estes termos definem as condições de utilização do website e estabelecem os limites e responsabilidades aplicáveis.", en: "These terms define the conditions for using the website and set out the applicable limits and responsibilities.", es: "Estos términos definen las condiciones de uso del sitio web y establecen los límites y responsabilidades aplicables." },
      { pt: "1. Objeto", en: "1. Purpose", es: "1. Objeto" },
      { pt: "2. Utilização do website", en: "2. Website use", es: "2. Uso del sitio web" },
      { pt: "3. Propriedade intelectual", en: "3. Intellectual property", es: "3. Propiedad intelectual" },
      { pt: "4. Limites de responsabilidade", en: "4. Liability limits", es: "4. Límites de responsabilidad" },
      { pt: "5. Links de terceiros", en: "5. Third-party links", es: "5. Enlaces de terceros" },
      { pt: "6. Alterações e lei aplicável", en: "6. Changes and applicable law", es: "6. Cambios y ley aplicable" },
      { pt: "7. Contactos", en: "7. Contact", es: "7. Contacto" },
      { pt: "Estes Termos e Condições regulam o acesso e a utilização do website da Cobrait, bem como a relação inicial de contacto comercial através dos formulários disponíveis.", en: "These Terms and Conditions govern access to and use of the Cobrait website, as well as the initial commercial contact made through the available forms.", es: "Estos Términos y Condiciones regulan el acceso y uso del sitio web de Cobrait, así como la relación inicial de contacto comercial a través de los formularios disponibles." },
      { pt: "O utilizador compromete-se a usar este website de forma lícita e responsável.", en: "Users agree to use this website lawfully and responsibly.", es: "El usuario se compromete a usar este sitio web de forma lícita y responsable." },
      { pt: "É proibido introduzir conteúdo malicioso, tentar aceder a áreas restritas ou comprometer a segurança da plataforma.", en: "It is forbidden to introduce malicious content, attempt to access restricted areas, or compromise the platform's security.", es: "Está prohibido introducir contenido malicioso, intentar acceder a áreas restringidas o comprometer la seguridad de la plataforma." },
      { pt: "A Cobrait pode limitar ou suspender o acesso em caso de uso abusivo.", en: "Cobrait may limit or suspend access in cases of abusive use.", es: "Cobrait puede limitar o suspender el acceso en caso de uso abusivo." },
      { pt: "Marcas, design, código, texto e restantes conteúdos estão protegidos por direitos de propriedade intelectual e industrial.", en: "Trademarks, design, code, text, and all other content are protected by intellectual and industrial property rights.", es: "Marcas, diseño, código, texto y demás contenidos están protegidos por derechos de propiedad intelectual e industrial." },
      { pt: "A reprodução total ou parcial sem autorização prévia é proibida, exceto nos casos permitidos por lei.", en: "Full or partial reproduction without prior authorization is prohibited, except where permitted by law.", es: "La reproducción total o parcial sin autorización previa está prohibida, salvo en los casos permitidos por la ley." },
      { pt: "A Cobrait envida esforços para manter o website atualizado e disponível, mas não garante ausência total de interrupções, erros ou indisponibilidade temporária.", en: "Cobrait makes reasonable efforts to keep the website updated and available, but does not guarantee the total absence of interruptions, errors, or temporary unavailability.", es: "Cobrait realiza esfuerzos razonables para mantener el sitio actualizado y disponible, pero no garantiza la ausencia total de interrupciones, errores o indisponibilidad temporal." },
      { pt: "Nenhuma informação presente no website constitui proposta contratual vinculativa por si só.", en: "No information on this website constitutes a binding contractual offer by itself.", es: "Ninguna información presente en el sitio web constituye por sí sola una oferta contractual vinculante." },
      { pt: "Este website pode incluir ligações para páginas externas. A Cobrait não controla nem se responsabiliza pelo conteúdo, políticas ou práticas desses websites.", en: "This website may include links to external pages. Cobrait does not control and is not responsible for the content, policies, or practices of those websites.", es: "Este sitio web puede incluir enlaces a páginas externas. Cobrait no controla ni se responsabiliza del contenido, políticas o prácticas de esos sitios." },
      { pt: "Podemos atualizar estes Termos a qualquer momento. A versão publicada nesta página é a versão em vigor.", en: "We may update these Terms at any time. The version published on this page is the one currently in force.", es: "Podemos actualizar estos Términos en cualquier momento. La versión publicada en esta página es la versión vigente." },
      { pt: "A relação jurídica é regida pela legislação portuguêsa, sem prejuízo de normas imperativas aplicáveis.", en: "The legal relationship is governed by Portuguese law, without prejudice to any mandatory applicable rules.", es: "La relación jurídica se rige por la legislación portuguesa, sin perjuicio de las normas imperativas aplicables." },
      { pt: "Para questões jurídicas ou contratuais, envia email para <a class=\"legal-mail\" href=\"mailto:cobrait@geral.pt\">cobrait@geral.pt</a>.", en: "For legal or contractual questions, email <a class=\"legal-mail\" href=\"mailto:cobrait@geral.pt\">cobrait@geral.pt</a>.", es: "Para cuestiones jurídicas o contractuales, envía un email a <a class=\"legal-mail\" href=\"mailto:cobrait@geral.pt\">cobrait@geral.pt</a>." },
      { pt: "Política de Cookies", en: "Cookie Policy", es: "Política de Cookies" },
      { pt: "Aqui explicamos que cookies usamos, para que servem e como os podes gerir no teu browser.", en: "Here we explain which cookies we use, what they are for, and how you can manage them in your browser.", es: "Aquí explicamos qué cookies usamos, para qué sirven y cómo puedes gestionarlas en tu navegador." },
      { pt: "1. O que são cookies", en: "1. What cookies are", es: "1. Qué son las cookies" },
      { pt: "2. Tipos de cookies", en: "2. Types of cookies", es: "2. Tipos de cookies" },
      { pt: "3. Finalidades", en: "3. Purposes", es: "3. Finalidades" },
      { pt: "4. Como gerir cookies", en: "4. How to manage cookies", es: "4. Cómo gestionar cookies" },
      { pt: "5. Cookies de terceiros", en: "5. Third-party cookies", es: "5. Cookies de terceros" },
      { pt: "6. Atualizações", en: "6. Updates", es: "6. Actualizaciones" },
      { pt: "7. Contacto", en: "7. Contact", es: "7. Contacto" },
      { pt: "Cookies são pequenos ficheiros de texto armazenados no teu dispositivo para reconhecer preferências, melhorar desempenho e analisar utilização do website.", en: "Cookies are small text files stored on your device to recognize preferences, improve performance, and analyze website usage.", es: "Las cookies son pequeños archivos de texto almacenados en tu dispositivo para reconocer preferencias, mejorar el rendimiento y analizar el uso del sitio web." },
      { pt: "<strong>Essenciais:</strong> necessários para funcionalidades base e segurança.", en: "<strong>Essential:</strong> required for core functionality and security.", es: "<strong>Esenciales:</strong> necesarias para funcionalidades base y seguridad." },
      { pt: "<strong>Analíticos:</strong> ajudam-nos a compreender tráfego, navegação e uso de páginas.", en: "<strong>Analytics:</strong> help us understand traffic, navigation, and page usage.", es: "<strong>Analíticas:</strong> nos ayudan a comprender tráfico, navegación y uso de páginas." },
      { pt: "<strong>Funcionais:</strong> memorizam preferências para melhorar a experiência.", en: "<strong>Functional:</strong> remember preferences to improve the experience.", es: "<strong>Funcionales:</strong> recuerdan preferencias para mejorar la experiencia." },
      { pt: "Usamos cookies para garantir funcionamento técnico, medir desempenho e melhorar o conteúdo apresentado aos visitantes.", en: "We use cookies to ensure technical operation, measure performance, and improve the content shown to visitors.", es: "Usamos cookies para garantizar el funcionamiento técnico, medir el rendimiento y mejorar el contenido mostrado a los visitantes." },
      { pt: "Podes configurar o teu browser para aceitar, recusar ou remover cookies. A desativação de cookies essenciais pode afetar o funcionamento de algumas partes do website.", en: "You can configure your browser to accept, reject, or remove cookies. Disabling essential cookies may affect how some parts of the website work.", es: "Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies. Desactivar cookies esenciales puede afectar al funcionamiento de algunas partes del sitio web." },
      { pt: "Algumas ferramentas externas podem instalar cookies próprios para analytics ou medição. Recomendamos consultar também as políticas desses fornecedores.", en: "Some external tools may install their own cookies for analytics or measurement. We also recommend reviewing those providers' policies.", es: "Algunas herramientas externas pueden instalar sus propias cookies para analytics o medición. Recomendamos consultar también las políticas de esos proveedores." },
      { pt: "Esta Política de Cookies pode ser revista para refletir alterações técnicas, legais ou operacionais.", en: "This Cookie Policy may be revised to reflect technical, legal, or operational changes.", es: "Esta Política de Cookies puede revisarse para reflejar cambios técnicos, legales u operativos." },
      { pt: "Para dúvidas sobre cookies, escreve para <a class=\"legal-mail\" href=\"mailto:cobrait@geral.pt\">cobrait@geral.pt</a>.", en: "For questions about cookies, email <a class=\"legal-mail\" href=\"mailto:cobrait@geral.pt\">cobrait@geral.pt</a>.", es: "Para dudas sobre cookies, escribe a <a class=\"legal-mail\" href=\"mailto:cobrait@geral.pt\">cobrait@geral.pt</a>." },
    ];
    const SITE_TRANSLATIONS = [
      { pt: "Início", en: "Home", es: "Inicio" },
      { pt: "Serviços", en: "Services", es: "Servicios" },
      { pt: "Sobre nós", en: "About us", es: "Sobre nosotros" },
      { pt: "Tecnologia", en: "Technology", es: "Tecnología" },
      { pt: "Agendar chamada", en: "Book a call", es: "Agendar llamada" },
      { pt: "Agendar uma chamada", en: "Book a call", es: "Agendar una llamada" },
      { pt: "Saber mais", en: "Learn more", es: "Saber más" },
      { pt: "Saber mais ->", en: "Learn more ->", es: "Saber más ->" },
      { pt: "Saber mais →", en: "Learn more →", es: "Saber más →" },
      { pt: "Definição do Âmbito", en: "Scope Definition", es: "Definición del Alcance" },
      { pt: "Software à Medida", en: "Custom Software", es: "Software a Medida" },
      { pt: "Equipas Dedicadas", en: "Dedicated Teams", es: "Equipos Dedicados" },
      { pt: "Nome", en: "Name", es: "Nombre" },
      { pt: "Email", en: "Email", es: "Email" },
      { pt: "Orçamento", en: "Budget", es: "Presupuesto" },
      { pt: "Descrição", en: "Description", es: "Descripción" },
      { pt: "Conta-nos sobre o teu projeto", en: "Tell us about your project", es: "Cuéntanos sobre tu proyecto" },
      { pt: "Conta-nos sobre o teu projeto.", en: "Tell us about your project.", es: "Cuéntanos sobre tu proyecto." },
      { pt: "Preenche o formulário e respondemos em 24–48h.", en: "Fill out the form and we reply within 24–48h.", es: "Rellena el formulario y respondemos en 24–48h." },
      { pt: "Selecionar…", en: "Select…", es: "Seleccionar…" },
      { pt: "Como soubeste de nós?", en: "How did you hear about us?", es: "¿Cómo nos conociste?" },
      { pt: "Este projeto requer NDA", en: "This project requires an NDA", es: "Este proyecto requiere NDA" },
      { pt: "Enviar pedido", en: "Send request", es: "Enviar solicitud" },
      { pt: "Ao enviar, aceitas ser contactado pela Cobrait sobre este pedido.", en: "By sending, you agree to be contacted by Cobrait about this request.", es: "Al enviar, aceptas que Cobrait te contacte sobre esta solicitud." },
      { pt: "Frameworks lean aplicados à tua visão para criar soluções personalizadas e inovadoras.", en: "Lean frameworks applied to your vision to create tailored, innovative solutions.", es: "Frameworks lean aplicados a tu visión para crear soluciones personalizadas e innovadoras." },
      { pt: "Constrói o teu produto com uma equipa dedicada de programadores seniores.", en: "Build your product with a dedicated team of senior developers.", es: "Construye tu producto con un equipo dedicado de desarrolladores senior." },
    ];
    const PAGE_META_TRANSLATIONS = {
      "": { pt: ["Cobrait | Software Factory", "Desenvolvimento de software à medida, MVPs, UX/UI e equipas dedicadas para transformar ideias em produtos digitais escaláveis."], en: ["Cobrait | Software Factory", "Custom software development, MVPs, UX/UI and dedicated teams to turn ideas into scalable digital products."], es: ["Cobrait | Software Factory", "Desarrollo de software a medida, MVPs, UX/UI y equipos dedicados para transformar ideas en productos digitales escalables."] },
      "index.html": { pt: ["Cobrait | Software Factory", "Desenvolvimento de software à medida, MVPs, UX/UI e equipas dedicadas para transformar ideias em produtos digitais escaláveis."], en: ["Cobrait | Software Factory", "Custom software development, MVPs, UX/UI and dedicated teams to turn ideas into scalable digital products."], es: ["Cobrait | Software Factory", "Desarrollo de software a medida, MVPs, UX/UI y equipos dedicados para transformar ideas en productos digitales escalables."] },
      "servicos.html": { pt: ["Serviços | Cobrait", "Serviços Cobrait: desenvolvimento de software à medida, MVPs, UX/UI e equipas dedicadas."], en: ["Services | Cobrait", "Cobrait services: custom software development, MVPs, UX/UI and dedicated teams."], es: ["Servicios | Cobrait", "Servicios Cobrait: desarrollo de software a medida, MVPs, UX/UI y equipos dedicados."] },
      "about-us.html": { pt: ["Cobrait | Sobre Nós", "Conhece a Cobrait: equipa, abordagem e valores para construir produtos digitais com clareza, qualidade e escalabilidade."], en: ["Cobrait | About Us", "Meet Cobrait: team, approach and values for building digital products with clarity, quality and scalability."], es: ["Cobrait | Sobre nosotros", "Conoce Cobrait: equipo, enfoque y valores para construir productos digitales con claridad, calidad y escalabilidad."] },
      "tech.html": { pt: ["Cobrait | Tecnologia", "Tecnologia, infraestrutura e boas práticas de engenharia da Cobrait para produtos digitais robustos e escaláveis."], en: ["Cobrait | Technology", "Cobrait technology, infrastructure and engineering practices for robust and scalable digital products."], es: ["Cobrait | Tecnología", "Tecnología, infraestructura y buenas prácticas de ingeniería de Cobrait para productos digitales robustos y escalables."] },
      "book-a-call.html": { pt: ["Cobrait | Agendar uma Chamada", "Agenda uma chamada com a Cobrait para falar sobre o teu produto digital."], en: ["Cobrait | Book a Call", "Book a call with Cobrait to talk about your digital product."], es: ["Cobrait | Agendar una llamada", "Agenda una llamada con Cobrait para hablar sobre tu producto digital."] },
      "privacidade.html": { pt: ["Política de Privacidade | Cobrait", "Como a Cobrait recolhe, usa e protege os teus dados pessoais."], en: ["Privacy Policy | Cobrait", "How Cobrait collects, uses and protects your personal data."], es: ["Política de Privacidad | Cobrait", "Cómo Cobrait recoge, usa y protege tus datos personales."] },
      "termos.html": { pt: ["Termos e Condições | Cobrait", "Regras de utilização do website da Cobrait."], en: ["Terms and Conditions | Cobrait", "Rules for using the Cobrait website."], es: ["Términos y Condiciones | Cobrait", "Reglas de uso del sitio web de Cobrait."] },
      "cookies.html": { pt: ["Política de Cookies | Cobrait", "Informação sobre os cookies utilizados no website da Cobrait."], en: ["Cookie Policy | Cobrait", "Information about the cookies used on the Cobrait website."], es: ["Política de Cookies | Cobrait", "Información sobre las cookies utilizadas en el sitio web de Cobrait."] },
      "process.html": { pt: ["Processo - Cobrait", "Da ideia à entrega: discovery, design, desenvolvimento e lançamento."], en: ["Process - Cobrait", "From idea to delivery: discovery, design, development and launch."], es: ["Proceso - Cobrait", "De la idea a la entrega: discovery, diseño, desarrollo y lanzamiento."] },
      "product-scope.html": { pt: ["Product Scope | Cobrait", "Definição de âmbito de produto com a Cobrait."], en: ["Product Scope | Cobrait", "Product scope definition with Cobrait."], es: ["Product Scope | Cobrait", "Definición de alcance de producto con Cobrait."] },
      "custom-software.html": { pt: ["Software à Medida | Cobrait", "Desenvolvimento de Software à Medida - Cobra IT. UX/UI, tecnologia certa e desenvolvimento robusto."], en: ["Custom Software | Cobrait", "Custom software development - Cobra IT. UX/UI, the right technology and robust development."], es: ["Software a Medida | Cobrait", "Desarrollo de software a medida - Cobra IT. UX/UI, tecnología adecuada y desarrollo robusto."] },
      "ux-ui.html": { pt: ["UX/UI | Cobrait", "Design UX/UI para produtos digitais claros, funcionais e escaláveis."], en: ["UX/UI | Cobrait", "UX/UI design for clear, functional and scalable digital products."], es: ["UX/UI | Cobrait", "Diseño UX/UI para productos digitales claros, funcionales y escalables."] },
      "mvp-builder.html": { pt: ["MVP Builder | Cobrait", "Construção de MVPs de alta qualidade para validar mercado rapidamente."], en: ["MVP Builder | Cobrait", "High-quality MVP builds to validate the market quickly."], es: ["MVP Builder | Cobrait", "Construcción de MVPs de alta calidad para validar el mercado rápidamente."] },
      "dedicated-teams.html": { pt: ["Equipas Dedicadas | Cobrait", "Equipas dedicadas para acelerar produto, design e desenvolvimento com a Cobrait."], en: ["Dedicated Teams | Cobrait", "Dedicated teams to accelerate product, design and development with Cobrait."], es: ["Equipos Dedicados | Cobrait", "Equipos dedicados para acelerar producto, diseño y desarrollo con Cobrait."] },
    };
    const translationDictionary = new Map();
    const SHARED_TRANSLATION_ARRAYS = [
      "PHRASE_TRANSLATIONS",
      "PROJECT_TRANSLATIONS",
      "ADDITIONAL_TRANSLATIONS",
      "FINAL_TRANSLATIONS",
      "CLOSING_TRANSLATIONS",
      "VALUE_TRANSLATIONS",
      "MEGA_MENU_TRANSLATIONS",
      "BLOCK_TRANSLATIONS",
    ];

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

    function translationKey(text) {
      return repairMojibake(text)
        .replace(/\s+/g, " ")
        .replace(/&nbsp;/gi, " ")
        .trim()
        .toLowerCase();
    }

    function registerTranslationSet(set) {
      if (!set || typeof set !== "object") return;
      ["pt", "en", "es"].forEach((lang) => {
        const value = set[lang];
        if (!value) return;
        translationDictionary.set(translationKey(value), set);
      });
    }

    function extractArrayAssignment(source, name) {
      const marker = "var " + name + " =";
      const start = String(source || "").indexOf(marker);
      if (start < 0) return "";

      const arrayStart = source.indexOf("[", start + marker.length);
      if (arrayStart < 0) return "";

      let depth = 0;
      let quote = "";
      let escaped = false;
      for (let i = arrayStart; i < source.length; i += 1) {
        const char = source[i];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (quote) {
          if (char === "\\") escaped = true;
          else if (char === quote) quote = "";
          continue;
        }
        if (char === "\"" || char === "'" || char === "`") {
          quote = char;
          continue;
        }
        if (char === "[") depth += 1;
        if (char === "]") {
          depth -= 1;
          if (depth === 0) return source.slice(arrayStart, i + 1);
        }
      }

      return "";
    }

    async function loadSharedLanguageDictionary() {
      if (!window.fetch) return;
      const sharedUrl = new URL("nebula-language.js", scriptBaseUrl);

      try {
        const response = await fetch(sharedUrl.href, { cache: "no-store" });
        if (!response.ok) throw new Error("nebula-language.js unavailable");
        const source = await response.text();

        SHARED_TRANSLATION_ARRAYS.forEach((name) => {
          const arraySource = extractArrayAssignment(source, name);
          if (!arraySource) return;

          try {
            const sets = Function("\"use strict\";return (" + arraySource + ");")();
            if (Array.isArray(sets)) sets.forEach(registerTranslationSet);
          } catch (_error) {
            console.warn("Cobrait translations: failed to parse " + name);
          }
        });
      } catch (error) {
        console.warn("Cobrait translations: shared dictionary unavailable.", error);
      }
    }

    function findTranslation(value, lang) {
      const set = translationDictionary.get(translationKey(value));
      if (!set) return null;
      return set[lang] || set.en || set.pt || null;
    }

    function collectDomTranslations(root) {
      const scope = root || document;
      scope.querySelectorAll("[data-pt], [data-en], [data-es]").forEach((el) => {
        const set = {};
        ["pt", "en", "es"].forEach((lang) => {
          const value = el.getAttribute("data-" + lang);
          if (value) set[lang] = repairMojibake(value);
        });
        if (set.pt || set.en || set.es) registerTranslationSet(set);
      });
    }

    function getUrlLanguage() {
      try {
        return new URLSearchParams(window.location.search).get("lang") || "";
      } catch (_error) {
        return "";
      }
    }

    function currentPageMetaKey() {
      const path = String(window.location.pathname || "")
        .split("/")
        .filter(Boolean)
        .pop() || "";
      return path.toLowerCase();
    }

    function applyPageMeta(lang) {
      const normalized = normalizeLang(lang);
      const meta = PAGE_META_TRANSLATIONS[currentPageMetaKey()];
      if (!meta || !meta[normalized]) return;
      const [title, description] = meta[normalized];
      if (title) document.title = title;
      if (description) {
        document
          .querySelectorAll("meta[name='description'], meta[property='og:description'], meta[name='twitter:description']")
          .forEach((el) => el.setAttribute("content", description));
      }
      if (title) {
        document
          .querySelectorAll("meta[property='og:title'], meta[name='twitter:title']")
          .forEach((el) => el.setAttribute("content", title));
      }
    }

    CORE_TRANSLATIONS.forEach(registerTranslationSet);
    SITE_TRANSLATIONS.forEach(registerTranslationSet);

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

    function findElementFallback(el, lang) {
      const candidates = [
        el.getAttribute("data-" + lang),
        el.getAttribute("data-pt"),
        el.getAttribute("data-en"),
        el.getAttribute("data-es"),
        el.textContent,
      ].filter(Boolean);

      for (const candidate of candidates) {
        const translated = findTranslation(candidate, lang);
        if (translated) return translated;
      }

      return null;
    }

    function applyDictionaryToLooseText(lang) {
      const normalized = normalizeLang(lang);
      if (!document.body) return;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "TEMPLATE"].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest("[data-pt], [data-en], [data-es]")) {
            return NodeFilter.FILTER_REJECT;
          }
          const value = (node.nodeValue || "").replace(/\s+/g, " ").trim();
          if (!value || value.length < 2) return NodeFilter.FILTER_REJECT;
          return findTranslation(value, normalized)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      });

      let current = walker.nextNode();
      while (current) {
        const original = current.nodeValue || "";
        const leading = original.match(/^\s*/)?.[0] || "";
        const trailing = original.match(/\s*$/)?.[0] || "";
        const translated = findTranslation(original, normalized);
        if (translated) current.nodeValue = leading + translated + trailing;
        current = walker.nextNode();
      }
    }

    function applyDictionaryToLooseAttributes(lang) {
      const normalized = normalizeLang(lang);
      const attributes = ["placeholder", "aria-label", "title", "alt", "value"];
      const selector = [
        "[placeholder]",
        "[aria-label]",
        "[title]",
        "[alt]",
        "input[type='button']",
        "input[type='submit']",
        "input[type='reset']",
        "button[value]",
      ].join(",");

      document.querySelectorAll(selector).forEach((el) => {
        attributes.forEach((attribute) => {
          if (!el.hasAttribute(attribute)) return;
          if (
            attribute === "value" &&
            !/^(button|submit|reset)$/i.test(el.getAttribute("type") || "")
          ) {
            return;
          }

          const current = el.getAttribute(attribute);
          const translated = findTranslation(current, normalized);
          if (translated) el.setAttribute(attribute, translated);
        });
      });
    }

    function applyLanguageToDom(lang) {
      const normalized = normalizeLang(lang);
      document.documentElement.lang =
        normalized === "pt" ? "pt-PT" : normalized;
      collectDomTranslations(document);

      const elements = document.querySelectorAll(
        "[data-pt], [data-en], [data-es]",
      );

      elements.forEach((el) => {
        let text = el.getAttribute("data-" + normalized);
        if (text === null) text = findElementFallback(el, normalized);
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
        if (val === null) val = findElementFallback(el, normalized);
        if (val === null && normalized !== "en")
          val = el.getAttribute("data-en");
        if (val) el.setAttribute("aria-label", val);
      });

      applyDictionaryToLooseAttributes(normalized);
      applyDictionaryToLooseText(normalized);
      applyPageMeta(normalized);
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

    await Promise.all([
      (async () => {
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
      })(),
      loadSharedLanguageDictionary(),
    ]);

    function boot() {
      repairBrokenText(document);
      normalizeSharedCopy(document);
      loadTranslationsIntoAttributes();
      const preferred = normalizeLang(
        getUrlLanguage() ||
          localStorage.getItem("preferredLanguage") ||
          localStorage.getItem("cobrait-mobile-preview-language") ||
          document.documentElement.lang ||
          "pt",
      );
      try {
        localStorage.setItem("preferredLanguage", preferred);
        localStorage.setItem("cobrait-mobile-preview-language", preferred);
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
          localStorage.setItem("cobrait-mobile-preview-language", lang);
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
        localStorage.setItem("cobrait-mobile-preview-language", normalized);
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

