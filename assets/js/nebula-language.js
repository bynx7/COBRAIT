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
  var PHRASE_TRANSLATIONS = [
    { pt: "In\u00edcio", en: "Home", es: "Inicio" },
    { pt: "Servi\u00e7os", en: "Services", es: "Servicios" },
    { pt: "Sobre n\u00f3s", en: "About us", es: "Sobre nosotros" },
    { pt: "Tecnologia", en: "Technology", es: "Tecnolog\u00eda" },
    { pt: "Agendar chamada", en: "Book a call", es: "Agendar llamada" },
    { pt: "Agendar uma chamada", en: "Book a call", es: "Agendar una llamada" },
    { pt: "Ver servi\u00e7os", en: "See services", es: "Ver servicios" },
    { pt: "Ver servi\u00e7os \u2192", en: "See services \u2192", es: "Ver servicios \u2192" },
    { pt: "Saber mais", en: "Learn more", es: "Saber m\u00e1s" },
    { pt: "Produto,", en: "Product,", es: "Producto," },
    { pt: "Design", en: "Design", es: "Dise\u00f1o" },
    { pt: "& Code.", en: "& Code.", es: "& Code." },
    { pt: "Cobrait \u2014 Software Factory", en: "Cobrait \u2014 Software Factory", es: "Cobrait \u2014 Software Factory" },
    { pt: "Da ideia ao lan\u00e7amento: constru\u00edmos software robusto, escal\u00e1vel e pronto para crescer com o teu neg\u00f3cio.", en: "From idea to launch: we build robust, scalable software ready to grow with your business.", es: "De la idea al lanzamiento: construimos software robusto, escalable y listo para crecer con tu negocio." },
    { pt: "Planeamento e defini\u00e7\u00e3o do produto", en: "Product planning and definition", es: "Planificaci\u00f3n y definici\u00f3n del producto" },
    { pt: "UX/UI com foco em convers\u00e3o e experi\u00eancia", en: "UX/UI focused on conversion and experience", es: "UX/UI enfocado en conversi\u00f3n y experiencia" },
    { pt: "Desenvolvimento web/mobile + integra\u00e7\u00f5es", en: "Web/mobile development + integrations", es: "Desarrollo web/mobile + integraciones" },
    { pt: "Integra\u00e7\u00f5es e automa\u00e7\u00e3o de processos", en: "Integrations and process automation", es: "Integraciones y automatizaci\u00f3n de procesos" },
    { pt: "Sprint de Descoberta", en: "Discovery Sprint", es: "Sprint de Descubrimiento" },
    { pt: "Em 10\u201315 dias alinhamos objetivos, requisitos, roadmap e um plano de entrega realista.", en: "In 10\u201315 days we align goals, requirements, roadmap and a realistic delivery plan.", es: "En 10\u201315 d\u00edas alineamos objetivos, requisitos, roadmap y un plan de entrega realista." },
    { pt: "Workshops", en: "Workshops", es: "Workshops" },
    { pt: "Scope", en: "Scope", es: "Scope" },
    { pt: "Roadmap", en: "Roadmap", es: "Roadmap" },
    { pt: "Estimativas", en: "Estimates", es: "Estimaciones" },
    { pt: "Falar com a Cobrait", en: "Talk to Cobrait", es: "Hablar con Cobrait" },
    { pt: "2-6 semanas", en: "2-6 weeks", es: "2-6 semanas" },
    { pt: "para MVP em produ\u00e7\u00e3o", en: "to production MVP", es: "para MVP en producci\u00f3n" },
    { pt: "Lean + Agile", en: "Lean + Agile", es: "Lean + Agile" },
    { pt: "processo iterativo e transparente", en: "iterative and transparent process", es: "proceso iterativo y transparente" },
    { pt: "Escal\u00e1vel", en: "Scalable", es: "Escalable" },
    { pt: "arquitetura preparada para crescer", en: "architecture ready to grow", es: "arquitectura preparada para crecer" },
    { pt: "O que fazemos", en: "What we do", es: "Qu\u00e9 hacemos" },
    { pt: "Parceiros de produto para empresas ambiciosas.", en: "Product partners for ambitious companies.", es: "Socios de producto para empresas ambiciosas." },
    { pt: "Ajudamos empreendedores e l\u00edderes a construir e lan\u00e7ar solu\u00e7\u00f5es de software \u00e0 medida em diversos setores \u2014 de um MVP a uma plataforma completa, trabalhamos em parceria para transformar a tua vis\u00e3o num produto de sucesso.", en: "We help founders and leaders build and launch custom software solutions across sectors, from MVP to full platform, working in partnership to turn your vision into a successful product.", es: "Ayudamos a emprendedores y l\u00edderes a construir y lanzar soluciones de software a medida en distintos sectores, de un MVP a una plataforma completa, trabajando en colaboraci\u00f3n para transformar tu visi\u00f3n en un producto de \u00e9xito." },
    { pt: "Defini\u00e7\u00e3o do \u00c2mbito", en: "Scope Definition", es: "Definici\u00f3n del Alcance" },
    { pt: "Software \u00e0 Medida", en: "Custom Software", es: "Software a Medida" },
    { pt: "Design UX/UI", en: "UX/UI Design", es: "Dise\u00f1o UX/UI" },
    { pt: "MVP Builder", en: "MVP Builder", es: "MVP Builder" },
    { pt: "Equipas Dedicadas", en: "Dedicated Teams", es: "Equipos Dedicados" },
    { pt: "Fala connosco", en: "Talk to us", es: "Hablemos" },
    { pt: "Faz o teu projeto avan\u00e7ar.", en: "Move your project forward.", es: "Haz avanzar tu proyecto." },
    { pt: "Nome", en: "Name", es: "Nombre" },
    { pt: "Email", en: "Email", es: "Email" },
    { pt: "Or\u00e7amento", en: "Budget", es: "Presupuesto" },
    { pt: "Descri\u00e7\u00e3o", en: "Description", es: "Descripci\u00f3n" },
    { pt: "Enviar", en: "Send", es: "Enviar" },
    { pt: "Navegar", en: "Navigate", es: "Navegar" },
    { pt: "Contacto", en: "Contact", es: "Contacto" },
    { pt: "Privacidade", en: "Privacy", es: "Privacidad" },
    { pt: "Termos", en: "Terms", es: "T\u00e9rminos" },
    { pt: "Cookies", en: "Cookies", es: "Cookies" },
    { pt: "Livro de Reclama\u00e7\u00f5es", en: "Complaints Book", es: "Libro de Reclamaciones" },
    { pt: "Built in Portugal", en: "Built in Portugal", es: "Hecho en Portugal" }
  ];
  var phraseMap = {};
  var activeLanguage = "pt";
  var languageObserver = null;
  var languageRefreshTimer = 0;
  var templateTranslationsPromise = null;
  var PROJECT_TRANSLATIONS = [
    { pt: "Começar rápido", en: "Start fast", es: "Empezar rápido" },
    { pt: "Parceiros de produto para empresas", en: "Product partners for companies", es: "Socios de producto para empresas" },
    { pt: "ambiciosas", en: "ambitious", es: "ambiciosas" },
    { pt: "Um processo estruturado de 15 dias para alinhar a tua visão com os objetivos do negócio.", en: "A structured 15-day process to align your vision with business goals.", es: "Un proceso estructurado de 15 días para alinear tu visión con los objetivos del negocio." },
    { pt: "Frameworks lean aplicados à tua visão para criar soluções personalizadas e inovadoras.", en: "Lean frameworks applied to your vision to create tailored, innovative solutions.", es: "Frameworks lean aplicados a tu visión para crear soluciones personalizadas e innovadoras." },
    { pt: "Produtos envolventes, fáceis de usar, atraentes e funcionais.", en: "Engaging, easy-to-use, attractive and functional products.", es: "Productos atractivos, fáciles de usar y funcionales." },
    { pt: "Construtor de MVP", en: "MVP Builder", es: "Constructor de MVP" },
    { pt: "Entra no mercado rapidamente com um Produto Mínimo Viável de alta qualidade.", en: "Enter the market quickly with a high-quality Minimum Viable Product.", es: "Entra al mercado rápidamente con un Producto Mínimo Viable de alta calidad." },
    { pt: "Constrói o teu produto com uma equipa dedicada de programadores seniores.", en: "Build your product with a dedicated team of senior developers.", es: "Construye tu producto con un equipo dedicado de desarrolladores senior." },
    { pt: "Onde nos podes", en: "Where you can", es: "Dónde puedes" },
    { pt: "encontrar", en: "find us", es: "encontrarnos" },
    { pt: "Estamos no coração do Porto. Aparece para um café ou agenda uma sessão presencial — sem stress.", en: "We are in the heart of Porto. Drop by for coffee or book an in-person session, no stress.", es: "Estamos en el corazón de Oporto. Ven a tomar un café o agenda una sesión presencial, sin estrés." },
    { pt: "Como chegar", en: "Get directions", es: "Cómo llegar" },
    { pt: "Agendar visita →", en: "Book a visit →", es: "Agendar visita →" },
    { pt: "Faz o teu projeto", en: "Move your project", es: "Haz avanzar tu proyecto" },
    { pt: "avançar", en: "forward", es: "adelante" },
    { pt: "Respondemos em até", en: "We reply within", es: "Respondemos en hasta" },
    { pt: "24 horas", en: "24 hours", es: "24 horas" },
    { pt: "Falas com", en: "You talk to", es: "Hablas con" },
    { pt: "especialistas de produto e tecnologia", en: "product and technology specialists", es: "especialistas de producto y tecnología" },
    { pt: "— sem account managers.", en: "with no account managers.", es: "sin account managers." },
    { pt: "NDA disponível desde o primeiro contacto.", en: "NDA available from the first contact.", es: "NDA disponible desde el primer contacto." },
    { pt: "Conta-nos sobre o teu projeto", en: "Tell us about your project", es: "Cuéntanos sobre tu proyecto" },
    { pt: "Preenche o formulário e respondemos em 24–48h.", en: "Fill out the form and we reply within 24–48h.", es: "Rellena el formulario y respondemos en 24–48h." },
    { pt: "Selecionar…", en: "Select…", es: "Seleccionar…" },
    { pt: "Como soubeste de nós?", en: "How did you hear about us?", es: "¿Cómo nos conociste?" },
    { pt: "Este projeto requer NDA", en: "This project requires an NDA", es: "Este proyecto requiere NDA" },
    { pt: "Enviar pedido", en: "Send request", es: "Enviar solicitud" },
    { pt: "Ao enviar, aceitas ser contactado pela Cobrait sobre este pedido.", en: "By sending, you agree to be contacted by Cobrait about this request.", es: "Al enviar, aceptas que Cobrait te contacte sobre esta solicitud." },
    { pt: "Resposta normalmente em 24–48h.", en: "We usually reply within 24–48h.", es: "Respuesta normalmente en 24–48h." },
    { pt: "Empresa", en: "Company", es: "Empresa" },
    { pt: "Construímos produtos digitais com clareza, foco e", en: "We build digital products with clarity, focus and", es: "Construimos productos digitales con claridad, foco y" },
    { pt: "execução", en: "execution", es: "ejecución" },
    { pt: "Somos uma empresa de software focada em transformar ideias em produtos digitais sólidos. Trabalhamos contigo para definir prioridades, desenhar bem e construir com qualidade.", en: "We are a software company focused on turning ideas into solid digital products. We work with you to define priorities, design well and build with quality.", es: "Somos una empresa de software enfocada en transformar ideas en productos digitales sólidos. Trabajamos contigo para definir prioridades, diseñar bien y construir con calidad." },
    { pt: "Quem somos", en: "Who we are", es: "Quiénes somos" },
    { pt: "Olá, somos a", en: "Hi, we are", es: "Hola, somos" },
    { pt: "Somos uma empresa de software focada em transformar ideias em produtos digitais sólidos. Trabalhamos em conjunto contigo para definir prioridades, desenhar bem e construir com qualidade — sem complicações.", en: "We are a software company focused on turning ideas into solid digital products. We work with you to define priorities, design well and build with quality, without complications.", es: "Somos una empresa de software enfocada en transformar ideas en productos digitales sólidos. Trabajamos contigo para definir prioridades, diseñar bien y construir con calidad, sin complicaciones." },
    { pt: "Processo leve e transparente (Lean + Agile)", en: "Lightweight and transparent process (Lean + Agile)", es: "Proceso ligero y transparente (Lean + Agile)" },
    { pt: "Foco em escalabilidade e manutenção", en: "Focus on scalability and maintenance", es: "Foco en escalabilidad y mantenimiento" },
    { pt: "Comunicação clara e entregas contínuas", en: "Clear communication and continuous delivery", es: "Comunicación clara y entregas continuas" },
    { pt: "Como trabalhamos", en: "How we work", es: "Cómo trabajamos" },
    { pt: "Discovery", en: "Discovery", es: "Discovery" },
    { pt: "· Build · Iterate.", en: "· Build · Iterate.", es: "· Build · Iterate." },
    { pt: "Discovery — clareza primeiro", en: "Discovery, clarity first", es: "Discovery, claridad primero" },
    { pt: "Alinhamos objetivos, utilizadores e prioridades. Sais com scope validado, riscos mapeados e um plano claro.", en: "We align goals, users and priorities. You leave with validated scope, mapped risks and a clear plan.", es: "Alineamos objetivos, usuarios y prioridades. Sales con scope validado, riesgos mapeados y un plan claro." },
    { pt: "Build — entrega contínua", en: "Build, continuous delivery", es: "Build, entrega continua" },
    { pt: "Sprints curtos, comunicação direta e checkpoints regulares. Vês progresso real — sem surpresas no fim.", en: "Short sprints, direct communication and regular checkpoints. You see real progress with no surprises at the end.", es: "Sprints cortos, comunicación directa y checkpoints regulares. Ves progreso real sin sorpresas al final." },
    { pt: "Iterate — melhorar com dados", en: "Iterate, improve with data", es: "Iterate, mejorar con datos" },
    { pt: "Depois do MVP evoluímos com feedback e métricas: performance, UX, novas features e estabilidade.", en: "After the MVP we evolve with feedback and metrics: performance, UX, new features and stability.", es: "Después del MVP evolucionamos con feedback y métricas: performance, UX, nuevas funcionalidades y estabilidad." },
    { pt: "Valores", en: "Values", es: "Valores" },
    { pt: "O que nos move todos os", en: "What drives us every", es: "Lo que nos mueve cada" },
    { pt: "dias", en: "day", es: "día" },
    { pt: "Pensamos como product owners — não apenas como executantes.", en: "We think like product owners, not just executors.", es: "Pensamos como product owners, no solo como ejecutores." },
    { pt: "Código manutenível, arquitetura limpa, testes onde fazem sentido.", en: "Maintainable code, clean architecture, tests where they make sense.", es: "Código mantenible, arquitectura limpia, pruebas donde tienen sentido." },
    { pt: "Velocidade real", en: "Real speed", es: "Velocidad real" },
    { pt: "Lean + Agile aplicado de forma honesta — entregas curtas, claras e mensuráveis.", en: "Lean + Agile applied honestly, with short, clear and measurable deliveries.", es: "Lean + Agile aplicado de forma honesta, con entregas cortas, claras y medibles." },
    { pt: "O que entregamos", en: "What we deliver", es: "Qué entregamos" },
    { pt: "Produto real — pronto a", en: "Real product, ready to", es: "Producto real, listo para" },
    { pt: "crescer", en: "grow", es: "crecer" },
    { pt: "Produto digital pronto para produção (deploy + ambiente)", en: "Digital product ready for production (deploy + environment)", es: "Producto digital listo para producción (deploy + entorno)" },
    { pt: "Arquitetura limpa e escalável (boas práticas + padrões)", en: "Clean and scalable architecture (best practices + patterns)", es: "Arquitectura limpia y escalable (buenas prácticas + patrones)" },
    { pt: "Código manutenível com testes onde faz sentido", en: "Maintainable code with tests where they make sense", es: "Código mantenible con pruebas donde tienen sentido" },
    { pt: "UX/UI moderno: interfaces rápidas e intuitivas", en: "Modern UX/UI: fast and intuitive interfaces", es: "UX/UI moderno: interfaces rápidas e intuitivas" },
    { pt: "Processo sério", en: "Serious process", es: "Proceso serio" },
    { pt: "Como garantimos", en: "How we ensure", es: "Cómo garantizamos" },
    { pt: "velocidade + qualidade", en: "speed + quality", es: "velocidad + calidad" },
    { pt: "Escopo bem definido antes de acelerar (menos retrabalho)", en: "Well-defined scope before accelerating (less rework)", es: "Alcance bien definido antes de acelerar (menos retrabajo)" },
    { pt: "Entrega incremental: releases frequentes com validação real", en: "Incremental delivery: frequent releases with real validation", es: "Entrega incremental: releases frecuentes con validación real" },
    { pt: "Decisões rápidas com comunicação direta (sem burocracia)", en: "Fast decisions with direct communication (no bureaucracy)", es: "Decisiones rápidas con comunicación directa (sin burocracia)" },
    { pt: "Foco em base técnica sólida para crescer sem dores", en: "Focus on a solid technical base to grow without pain", es: "Foco en una base técnica sólida para crecer sin dolores" },
    { pt: "Porquê trabalhar connosco", en: "Why work with us", es: "Por qué trabajar con nosotros" },
    { pt: "Menos ruído. Mais", en: "Less noise. More", es: "Menos ruido. Más" },
    { pt: "responsabilidade", en: "ownership", es: "responsabilidad" },
    { pt: "Não prometemos \"mil projetos\" — prometemos um processo sério. Decisões rápidas, comunicação direta e foco total no teu produto.", en: "We do not promise a thousand projects, we promise a serious process. Fast decisions, direct communication and full focus on your product.", es: "No prometemos mil proyectos, prometemos un proceso serio. Decisiones rápidas, comunicación directa y foco total en tu producto." },
    { pt: "Pronto para começar?", en: "Ready to start?", es: "¿Listo para empezar?" },
    { pt: "Conta-nos o que queres construir e respondemos em 24-48h.", en: "Tell us what you want to build and we reply within 24-48h.", es: "Cuéntanos qué quieres construir y respondemos en 24-48h." },
    { pt: "Marca uma call e começamos a", en: "Book a call and we start", es: "Agenda una llamada y empezamos a" },
    { pt: "definir", en: "defining", es: "definir" },
    { pt: "o teu projeto.", en: "your project.", es: "tu proyecto." },
    { pt: "Conta-nos a tua ideia, contexto e objetivos. Em 24-48h respondemos com um plano claro e os próximos passos.", en: "Tell us your idea, context and goals. Within 24-48h we reply with a clear plan and next steps.", es: "Cuéntanos tu idea, contexto y objetivos. En 24-48h respondemos con un plan claro y los próximos pasos." },
    { pt: "O que acontece a seguir", en: "What happens next", es: "Qué pasa después" },
    { pt: "01. Análise rápida", en: "01. Quick analysis", es: "01. Análisis rápido" },
    { pt: "Lemos o teu pedido e preparamos perguntas chave.", en: "We read your request and prepare key questions.", es: "Leemos tu solicitud y preparamos preguntas clave." },
    { pt: "02. Discovery call (30 min)", en: "02. Discovery call (30 min)", es: "02. Discovery call (30 min)" },
    { pt: "Falamos sobre o problema, contexto e objetivos.", en: "We talk about the problem, context and goals.", es: "Hablamos sobre el problema, contexto y objetivos." },
    { pt: "03. Próximos passos", en: "03. Next steps", es: "03. Próximos pasos" },
    { pt: "Recebes um plano claro, scope e estimativa.", en: "You receive a clear plan, scope and estimate.", es: "Recibes un plan claro, scope y estimación." },
    { pt: "Serviço · Build", en: "Service · Build", es: "Servicio · Build" },
    { pt: "Serviço · Scale", en: "Service · Scale", es: "Servicio · Scale" },
    { pt: "Serviço · Launch", en: "Service · Launch", es: "Servicio · Launch" },
    { pt: "Serviço · Discovery", en: "Service · Discovery", es: "Servicio · Discovery" },
    { pt: "Serviço · Design", en: "Service · Design", es: "Servicio · Design" },
    { pt: "Principais benefícios", en: "Main benefits", es: "Principales beneficios" },
    { pt: "Como funciona", en: "How it works", es: "Cómo funciona" },
    { pt: "Vamos falar sobre o teu projeto.", en: "Let's talk about your project.", es: "Hablemos sobre tu proyecto." },
    { pt: "Conta-nos o que queres construir e voltamos com um plano claro e realista.", en: "Tell us what you want to build and we come back with a clear, realistic plan.", es: "Cuéntanos qué quieres construir y volvemos con un plan claro y realista." },
    { pt: "Do scope à entrega e evolução contínua.", en: "From scope to delivery and continuous evolution.", es: "Del scope a la entrega y evolución continua." },
    { pt: "Propriedade total", en: "Full ownership", es: "Propiedad total" },
    { pt: "Ficas com 100% do software e do código — sem royalties e sem lock-in.", en: "You keep 100% of the software and code, with no royalties and no lock-in.", es: "Te quedas con el 100% del software y del código, sin royalties ni lock-in." },
    { pt: "Flexibilidade", en: "Flexibility", es: "Flexibilidad" },
    { pt: "Vantagem competitiva", en: "Competitive advantage", es: "Ventaja competitiva" },
    { pt: "Escalabilidade", en: "Scalability", es: "Escalabilidad" },
    { pt: "Experiência do utilizador", en: "User experience", es: "Experiencia de usuario" },
    { pt: "Do brief à equipa em produção.", en: "From brief to team in production.", es: "Del brief al equipo en producción." },
    { pt: "Equipa pronta. Sem o overhead.", en: "Team ready. No overhead.", es: "Equipo listo. Sin overhead." },
    { pt: "Talento Validado", en: "Validated talent", es: "Talento validado" },
    { pt: "Menor Custo e Risco", en: "Lower cost and risk", es: "Menor coste y riesgo" },
    { pt: "Formação e Evolução", en: "Training and evolution", es: "Formación y evolución" },
    { pt: "Foco no Negócio", en: "Business focus", es: "Foco en el negocio" },
    { pt: "Brief da Equipa", en: "Team brief", es: "Brief del equipo" },
    { pt: "Triagem e Shortlist", en: "Screening and shortlist", es: "Filtrado y shortlist" },
    { pt: "Gestão e Escala", en: "Management and scale", es: "Gestión y escala" },
    { pt: "O que é o MVP Builder?", en: "What is the MVP Builder?", es: "¿Qué es el MVP Builder?" },
    { pt: "Quando faz sentido?", en: "When does it make sense?", es: "¿Cuándo tiene sentido?" },
    { pt: "Por que lançar um MVP.", en: "Why launch an MVP.", es: "Por qué lanzar un MVP." },
    { pt: "Menos risco", en: "Less risk", es: "Menos riesgo" },
    { pt: "Menor custo", en: "Lower cost", es: "Menor coste" },
    { pt: "Mais rapidez", en: "More speed", es: "Más rapidez" },
    { pt: "Cinco fases, uma entrega.", en: "Five phases, one delivery.", es: "Cinco fases, una entrega." },
    { pt: "O que é um Product Scope?", en: "What is a Product Scope?", es: "¿Qué es un Product Scope?" },
    { pt: "Benefícios chave", en: "Key benefits", es: "Beneficios clave" },
    { pt: "Como o processo cria valor.", en: "How the process creates value.", es: "Cómo el proceso crea valor." },
    { pt: "Foco Imersivo", en: "Immersive focus", es: "Foco inmersivo" },
    { pt: "Risco Reduzido", en: "Reduced risk", es: "Riesgo reducido" },
    { pt: "Custo Reduzido", en: "Reduced cost", es: "Coste reducido" },
    { pt: "Testar as águas", en: "Test the waters", es: "Probar el terreno" },
    { pt: "Processo & duração", en: "Process & duration", es: "Proceso y duración" },
    { pt: "15 dias, três fases.", en: "15 days, three phases.", es: "15 días, tres fases." },
    { pt: "Entregáveis", en: "Deliverables", es: "Entregables" },
    { pt: "O que recebes no final.", en: "What you receive at the end.", es: "Qué recibes al final." },
    { pt: "Perguntas frequentes.", en: "Frequently asked questions.", es: "Preguntas frecuentes." },
    { pt: "O que é UX/UI?", en: "What is UX/UI?", es: "¿Qué es UX/UI?" },
    { pt: "Mais conversão, menos suporte.", en: "More conversion, less support.", es: "Más conversión, menos soporte." },
    { pt: "Aquisição & Retenção", en: "Acquisition & retention", es: "Adquisición y retención" },
    { pt: "Redução de custos", en: "Cost reduction", es: "Reducción de costes" },
    { pt: "Quatro passos, um sistema.", en: "Four steps, one system.", es: "Cuatro pasos, un sistema." },
    { pt: "Briefing de Design", en: "Design briefing", es: "Briefing de diseño" },
    { pt: "Wireframes e Fluxos", en: "Wireframes and flows", es: "Wireframes y flujos" },
    { pt: "UI e Sistema de Design", en: "UI and design system", es: "UI y sistema de diseño" },
    { pt: "Entrega e QA de Design", en: "Delivery and design QA", es: "Entrega y QA de diseño" },
    { pt: "Queres elevar o UX/UI do teu produto?", en: "Want to raise your product's UX/UI?", es: "¿Quieres elevar el UX/UI de tu producto?" },
    { pt: "Tecnologia · Engenharia · Qualidade", en: "Technology · Engineering · Quality", es: "Tecnología · Ingeniería · Calidad" },
    { pt: "O nosso toolkit", en: "Our toolkit", es: "Nuestro toolkit" },
    { pt: "O nosso toolkit tech", en: "Our tech toolkit", es: "Nuestro toolkit tech" },
    { pt: "num instante", en: "at a glance", es: "de un vistazo" },
    { pt: "Onde somos fortes", en: "Where we are strong", es: "Dónde somos fuertes" },
    { pt: "Áreas onde", en: "Areas where", es: "Áreas donde" },
    { pt: "entregamos mais", en: "we deliver most", es: "entregamos más" },
    { pt: "Engenharia de excelência", en: "Engineering excellence", es: "Ingeniería de excelencia" },
    { pt: "A nossa abordagem ao desenvolvimento de software", en: "Our approach to software development", es: "Nuestro enfoque al desarrollo de software" },
    { pt: "à medida", en: "custom-built", es: "a medida" },
    { pt: "Tens a stack certa para o teu produto?", en: "Do you have the right stack for your product?", es: "¿Tienes el stack adecuado para tu producto?" },
    { pt: "Conversa com a nossa equipa técnica e validamos a melhor abordagem para o teu caso.", en: "Talk to our technical team and we validate the best approach for your case.", es: "Habla con nuestro equipo técnico y validamos el mejor enfoque para tu caso." },
    { pt: "Do scope ao lançamento", en: "From scope to launch", es: "Del scope al lanzamiento" },
    { pt: "Escolhe o ponto de entrada certo e mantem uma experiencia visual consistente com a referencia.", en: "Choose the right entry point and keep a visual experience consistent with the reference.", es: "Elige el punto de entrada correcto y mantén una experiencia visual consistente con la referencia." },
    { pt: "Vamos comecar", en: "Let's start", es: "Empecemos" },
    { pt: "Conta-nos a tua ideia.", en: "Tell us your idea.", es: "Cuéntanos tu idea." },
    { pt: "Proximo passo", en: "Next step", es: "Próximo paso" },
    { pt: "Vamos falar do teu projeto.", en: "Let's talk about your project.", es: "Hablemos de tu proyecto." },
    { pt: "Processo - Lean - Entrega", en: "Process - Lean - Delivery", es: "Proceso - Lean - Entrega" },
    { pt: "Metodo", en: "Method", es: "Método" },
    { pt: "Ciclos curtos,", en: "Short cycles,", es: "Ciclos cortos," },
    { pt: "resultado real", en: "real results", es: "resultado real" },
    { pt: "Cada fase cria uma decisao concreta: o que construir, por que construir e como medir.", en: "Each phase creates a concrete decision: what to build, why to build it and how to measure it.", es: "Cada fase crea una decisión concreta: qué construir, por qué construirlo y cómo medirlo." },
    { pt: "Descobrir", en: "Discover", es: "Descubrir" },
    { pt: "Construir", en: "Build", es: "Construir" },
    { pt: "Escalar", en: "Scale", es: "Escalar" }
  ];
  var ADDITIONAL_TRANSLATIONS = [
    {
        "pt": "Seg \u2013 Sex \u00b7 09:00 \u2013 18:00",
        "en": "Mon \u2013 Fri \u00b7 09:00 \u2013 18:00",
        "es": "Lun \u2013 Vie \u00b7 09:00 \u2013 18:00"
    },
    {
        "pt": "Resposta em 24h em dias \u00fateis",
        "en": "Reply within 24h on business days",
        "es": "Respuesta en 24h en d\u00edas laborables"
    },
    {
        "pt": "Entrega r\u00e1pida",
        "en": "Fast delivery",
        "es": "Entrega r\u00e1pida"
    },
    {
        "pt": "Qualidade",
        "en": "Quality",
        "es": "Calidad"
    },
    {
        "pt": "Voltar ao in\u00edcio",
        "en": "Back to home",
        "es": "Volver al inicio"
    },
    {
        "pt": "Cobrait \u00b7 Legal",
        "en": "Cobrait \u00b7 Legal",
        "es": "Cobrait \u00b7 Legal"
    },
    {
        "pt": "\u00daltima atualiza\u00e7\u00e3o:",
        "en": "Last updated:",
        "es": "\u00daltima actualizaci\u00f3n:"
    },
    {
        "pt": "26 de fevereiro de 2026",
        "en": "February 26, 2026",
        "es": "26 de febrero de 2026"
    },
    {
        "pt": "Pol\u00edtica de Cookies",
        "en": "Cookie Policy",
        "es": "Pol\u00edtica de Cookies"
    },
    {
        "pt": "Aqui explicamos que cookies usamos, para que servem e como os podes gerir no teu browser.",
        "en": "Here we explain which cookies we use, what they are for and how you can manage them in your browser.",
        "es": "Aqu\u00ed explicamos qu\u00e9 cookies usamos, para qu\u00e9 sirven y c\u00f3mo puedes gestionarlas en tu navegador."
    },
    {
        "pt": "O que s\u00e3o cookies",
        "en": "What cookies are",
        "es": "Qu\u00e9 son las cookies"
    },
    {
        "pt": "Cookies s\u00e3o pequenos ficheiros de texto armazenados no teu dispositivo para reconhecer prefer\u00eancias, melhorar desempenho e analisar utiliza\u00e7\u00e3o do website.",
        "en": "Cookies are small text files stored on your device to remember preferences, improve performance and analyse website usage.",
        "es": "Las cookies son peque\u00f1os archivos de texto almacenados en tu dispositivo para recordar preferencias, mejorar el rendimiento y analizar el uso del sitio web."
    },
    {
        "pt": "Tipos de cookies",
        "en": "Types of cookies",
        "es": "Tipos de cookies"
    },
    {
        "pt": "Essenciais:",
        "en": "Essential:",
        "es": "Esenciales:"
    },
    {
        "pt": "necess\u00e1rios para funcionalidades base e seguran\u00e7a.",
        "en": "required for core functionality and security.",
        "es": "necesarias para funcionalidades b\u00e1sicas y seguridad."
    },
    {
        "pt": "Anal\u00edticos:",
        "en": "Analytics:",
        "es": "Anal\u00edticas:"
    },
    {
        "pt": "ajudam-nos a compreender tr\u00e1fego, navega\u00e7\u00e3o e uso de p\u00e1ginas.",
        "en": "help us understand traffic, navigation and page usage.",
        "es": "nos ayudan a entender el tr\u00e1fico, la navegaci\u00f3n y el uso de p\u00e1ginas."
    },
    {
        "pt": "Funcionais:",
        "en": "Functional:",
        "es": "Funcionales:"
    },
    {
        "pt": "memorizam prefer\u00eancias para melhorar a experi\u00eancia.",
        "en": "remember preferences to improve the experience.",
        "es": "recuerdan preferencias para mejorar la experiencia."
    },
    {
        "pt": "Finalidades",
        "en": "Purposes",
        "es": "Finalidades"
    },
    {
        "pt": "Usamos cookies para garantir funcionamento t\u00e9cnico, medir desempenho e melhorar o conte\u00fado apresentado aos visitantes.",
        "en": "We use cookies to ensure technical operation, measure performance and improve the content shown to visitors.",
        "es": "Usamos cookies para garantizar el funcionamiento t\u00e9cnico, medir el rendimiento y mejorar el contenido mostrado a los visitantes."
    },
    {
        "pt": "Como gerir cookies",
        "en": "How to manage cookies",
        "es": "C\u00f3mo gestionar cookies"
    },
    {
        "pt": "Podes configurar o teu browser para aceitar, recusar ou remover cookies. A desativa\u00e7\u00e3o de cookies essenciais pode afetar o funcionamento de algumas partes do website.",
        "en": "You can configure your browser to accept, reject or remove cookies. Disabling essential cookies may affect parts of the website.",
        "es": "Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies. Desactivar cookies esenciales puede afectar el funcionamiento de algunas partes del sitio web."
    },
    {
        "pt": "Cookies de terceiros",
        "en": "Third-party cookies",
        "es": "Cookies de terceros"
    },
    {
        "pt": "Algumas ferramentas externas podem instalar cookies pr\u00f3prios para analytics ou medi\u00e7\u00e3o. Recomendamos consultar tamb\u00e9m as pol\u00edticas desses fornecedores.",
        "en": "Some external tools may install their own cookies for analytics or measurement. We recommend also checking those providers' policies.",
        "es": "Algunas herramientas externas pueden instalar sus propias cookies para anal\u00edtica o medici\u00f3n. Recomendamos consultar tambi\u00e9n las pol\u00edticas de esos proveedores."
    },
    {
        "pt": "Atualiza\u00e7\u00f5es",
        "en": "Updates",
        "es": "Actualizaciones"
    },
    {
        "pt": "Esta Pol\u00edtica de Cookies pode ser revista para refletir altera\u00e7\u00f5es t\u00e9cnicas, legais ou operacionais.",
        "en": "This Cookie Policy may be revised to reflect technical, legal or operational changes.",
        "es": "Esta Pol\u00edtica de Cookies puede revisarse para reflejar cambios t\u00e9cnicos, legales u operativos."
    },
    {
        "pt": "Para d\u00favidas sobre cookies, escreve para",
        "en": "For cookie questions, write to",
        "es": "Para dudas sobre cookies, escribe a"
    },
    {
        "pt": "Pol\u00edtica de Privacidade",
        "en": "Privacy Policy",
        "es": "Pol\u00edtica de Privacidad"
    },
    {
        "pt": "Esta pol\u00edtica explica de forma clara como tratamos dados pessoais quando interages com o website e com os nossos canais de contacto.",
        "en": "This policy clearly explains how we process personal data when you interact with the website and our contact channels.",
        "es": "Esta pol\u00edtica explica claramente c\u00f3mo tratamos datos personales cuando interact\u00faas con el sitio web y nuestros canales de contacto."
    },
    {
        "pt": "Quem trata os teus dados",
        "en": "Who processes your data",
        "es": "Qui\u00e9n trata tus datos"
    },
    {
        "pt": "A Cobrait \u00e9 a entidade respons\u00e1vel pelo tratamento dos dados pessoais recolhidos atrav\u00e9s deste website e dos formul\u00e1rios de contacto associados.",
        "en": "Cobrait is the entity responsible for processing personal data collected through this website and associated contact forms.",
        "es": "Cobrait es la entidad responsable del tratamiento de los datos personales recogidos a trav\u00e9s de este sitio web y los formularios de contacto asociados."
    },
    {
        "pt": "Dados recolhidos",
        "en": "Data collected",
        "es": "Datos recogidos"
    },
    {
        "pt": "Dados de identifica\u00e7\u00e3o e contacto: nome, email, telefone e empresa.",
        "en": "Identification and contact data: name, email, phone and company.",
        "es": "Datos de identificaci\u00f3n y contacto: nombre, email, tel\u00e9fono y empresa."
    },
    {
        "pt": "Dados de contexto comercial: mensagem, objetivo do projeto e informa\u00e7\u00e3o enviada voluntariamente.",
        "en": "Commercial context data: message, project goal and voluntarily submitted information.",
        "es": "Datos de contexto comercial: mensaje, objetivo del proyecto e informaci\u00f3n enviada voluntariamente."
    },
    {
        "pt": "Dados t\u00e9cnicos: endere\u00e7o IP, browser, dispositivo, p\u00e1ginas visitadas e eventos de navega\u00e7\u00e3o.",
        "en": "Technical data: IP address, browser, device, pages visited and navigation events.",
        "es": "Datos t\u00e9cnicos: direcci\u00f3n IP, navegador, dispositivo, p\u00e1ginas visitadas y eventos de navegaci\u00f3n."
    },
    {
        "pt": "Finalidades e base legal",
        "en": "Purposes and legal basis",
        "es": "Finalidades y base legal"
    },
    {
        "pt": "Tratamos os dados para responder a pedidos, preparar propostas, melhorar o desempenho do site e cumprir obriga\u00e7\u00f5es legais.",
        "en": "We process data to respond to requests, prepare proposals, improve site performance and comply with legal obligations.",
        "es": "Tratamos los datos para responder a solicitudes, preparar propuestas, mejorar el rendimiento del sitio y cumplir obligaciones legales."
    },
    {
        "pt": "Bases legais aplicadas: consentimento, dilig\u00eancias pr\u00e9-contratuais, execu\u00e7\u00e3o contratual e interesse leg\u00edtimo.",
        "en": "Legal bases applied: consent, pre-contractual steps, contract performance and legitimate interest.",
        "es": "Bases legales aplicadas: consentimiento, diligencias precontractuales, ejecuci\u00f3n contractual e inter\u00e9s leg\u00edtimo."
    },
    {
        "pt": "Partilha e transfer\u00eancias",
        "en": "Sharing and transfers",
        "es": "Compartici\u00f3n y transferencias"
    },
    {
        "pt": "N\u00e3o vendemos dados pessoais a terceiros.",
        "en": "We do not sell personal data to third parties.",
        "es": "No vendemos datos personales a terceros."
    },
    {
        "pt": "Conserva\u00e7\u00e3o",
        "en": "Retention",
        "es": "Conservaci\u00f3n"
    },
    {
        "pt": "Direitos do titular",
        "en": "Data subject rights",
        "es": "Derechos del titular"
    },
    {
        "pt": "Seguran\u00e7a e contacto",
        "en": "Security and contact",
        "es": "Seguridad y contacto"
    },
    {
        "pt": "Termos e Condi\u00e7\u00f5es",
        "en": "Terms and Conditions",
        "es": "T\u00e9rminos y Condiciones"
    },
    {
        "pt": "Estes termos definem as condi\u00e7\u00f5es de utiliza\u00e7\u00e3o do website e estabelecem os limites e responsabilidades aplic\u00e1veis.",
        "en": "These terms define the conditions for using the website and set applicable limits and responsibilities.",
        "es": "Estos t\u00e9rminos definen las condiciones de uso del sitio web y establecen los l\u00edmites y responsabilidades aplicables."
    },
    {
        "pt": "Objeto",
        "en": "Scope",
        "es": "Objeto"
    },
    {
        "pt": "Utiliza\u00e7\u00e3o do website",
        "en": "Website use",
        "es": "Uso del sitio web"
    },
    {
        "pt": "O utilizador compromete-se a usar este website de forma l\u00edcita e respons\u00e1vel.",
        "en": "The user agrees to use this website lawfully and responsibly.",
        "es": "El usuario se compromete a usar este sitio web de forma l\u00edcita y responsable."
    },
    {
        "pt": "Propriedade intelectual",
        "en": "Intellectual property",
        "es": "Propiedad intelectual"
    },
    {
        "pt": "Limites de responsabilidade",
        "en": "Liability limits",
        "es": "L\u00edmites de responsabilidad"
    },
    {
        "pt": "Links de terceiros",
        "en": "Third-party links",
        "es": "Enlaces de terceros"
    },
    {
        "pt": "Altera\u00e7\u00f5es e lei aplic\u00e1vel",
        "en": "Changes and applicable law",
        "es": "Cambios y ley aplicable"
    },
    {
        "pt": "Contactos",
        "en": "Contacts",
        "es": "Contactos"
    },
    {
        "pt": "Para quest\u00f5es jur\u00eddicas ou contratuais, envia email para",
        "en": "For legal or contractual questions, send an email to",
        "es": "Para cuestiones legales o contractuales, env\u00eda un email a"
    },
    {
        "pt": "Alinhar visao, requisitos, roadmap e prioridades antes de construir.",
        "en": "Align vision, requirements, roadmap and priorities before building.",
        "es": "Alinear visi\u00f3n, requisitos, roadmap y prioridades antes de construir."
    },
    {
        "pt": "Construir um MVP robusto para validar mercado com rapidez.",
        "en": "Build a robust MVP to validate the market quickly.",
        "es": "Construir un MVP robusto para validar mercado con rapidez."
    },
    {
        "pt": "Criar interfaces claras, bonitas e faceis de usar.",
        "en": "Create clear, beautiful and easy-to-use interfaces.",
        "es": "Crear interfaces claras, bonitas y f\u00e1ciles de usar."
    },
    {
        "pt": "Desenvolver plataformas, automacoes e integracoes para o teu negocio.",
        "en": "Develop platforms, automations and integrations for your business.",
        "es": "Desarrollar plataformas, automatizaciones e integraciones para tu negocio."
    },
    {
        "pt": "Integrar talento senior no teu produto com cadencia e ownership.",
        "en": "Integrate senior talent into your product with cadence and ownership.",
        "es": "Integrar talento senior en tu producto con cadencia y ownership."
    },
    {
        "pt": "Do scope ao lancamento, ajudamos a definir, desenhar, construir e escalar produtos digitais.",
        "en": "From scope to launch, we help define, design, build and scale digital products.",
        "es": "Del scope al lanzamiento, ayudamos a definir, dise\u00f1ar, construir y escalar productos digitales."
    },
    {
        "pt": "Do scope ao",
        "en": "From scope to",
        "es": "Del scope al"
    },
    {
        "pt": "lancamento",
        "en": "launch",
        "es": "lanzamiento"
    },
    {
        "pt": "Agendar chamada ->",
        "en": "Book a call ->",
        "es": "Agendar llamada ->"
    },
    {
        "pt": "Agendar uma chamada ->",
        "en": "Book a call ->",
        "es": "Agendar una llamada ->"
    },
    {
        "pt": "Ver servicos ->",
        "en": "See services ->",
        "es": "Ver servicios ->"
    },
    {
        "pt": "Saber mais ->",
        "en": "Learn more ->",
        "es": "Saber m\u00e1s ->"
    },
    {
        "pt": "Falar com a Cobrait ->",
        "en": "Talk to Cobrait ->",
        "es": "Hablar con Cobrait ->"
    },
    {
        "pt": "Um fluxo claro para reduzir incerteza, construir com velocidade e manter qualidade.",
        "en": "A clear flow to reduce uncertainty, build fast and maintain quality.",
        "es": "Un flujo claro para reducir incertidumbre, construir con velocidad y mantener calidad."
    },
    {
        "pt": "Entendemos negocio, utilizadores, riscos e oportunidade.",
        "en": "We understand business, users, risks and opportunity.",
        "es": "Entendemos negocio, usuarios, riesgos y oportunidad."
    },
    {
        "pt": "Criamos produto, design e codigo em sprints curtos.",
        "en": "We create product, design and code in short sprints.",
        "es": "Creamos producto, dise\u00f1o y c\u00f3digo en sprints cortos."
    },
    {
        "pt": "Iteramos com dados, performance e arquitetura melhoradas.",
        "en": "We iterate with data, performance and improved architecture.",
        "es": "Iteramos con datos, rendimiento y arquitectura mejorada."
    },
    {
        "pt": "A tecnologia por tr\u00e1s das nossas solu\u00e7\u00f5es de",
        "en": "The technology behind our",
        "es": "La tecnolog\u00eda detr\u00e1s de nuestras soluciones de"
    },
    {
        "pt": "\u00faltima gera\u00e7\u00e3o",
        "en": "next-generation solutions",
        "es": "\u00faltima generaci\u00f3n"
    },
    {
        "pt": "Ver stack \u2192",
        "en": "See stack \u2192",
        "es": "Ver stack \u2192"
    },
    {
        "pt": "Analisamos a fundo as necessidades do teu projeto para escolher as melhores ferramentas e frameworks. A maioria dos projetos encaixa num stack semelhante ao abaixo.",
        "en": "We deeply analyse your project's needs to choose the best tools and frameworks. Most projects fit a stack similar to the one below.",
        "es": "Analizamos a fondo las necesidades de tu proyecto para elegir las mejores herramientas y frameworks. La mayor\u00eda de proyectos encajan en un stack similar al de abajo."
    },
    {
        "pt": "Interfaces modernas, r\u00e1pidas e consistentes em qualquer device.",
        "en": "Modern, fast and consistent interfaces on any device.",
        "es": "Interfaces modernas, r\u00e1pidas y consistentes en cualquier dispositivo."
    },
    {
        "pt": "Back-end & Bases de Dados",
        "en": "Back-end & Databases",
        "es": "Back-end y Bases de Datos"
    },
    {
        "pt": "APIs robustas, escal\u00e1veis e bem testadas, com persist\u00eancia de confian\u00e7a.",
        "en": "Robust, scalable and well-tested APIs with reliable persistence.",
        "es": "APIs robustas, escalables y bien probadas, con persistencia fiable."
    },
    {
        "pt": "Infraestrutura",
        "en": "Infrastructure",
        "es": "Infraestructura"
    },
    {
        "pt": "Cloud, orquestra\u00e7\u00e3o e mensageria \u2014 bases s\u00f3lidas para escalar.",
        "en": "Cloud, orchestration and messaging, solid foundations to scale.",
        "es": "Cloud, orquestaci\u00f3n y mensajer\u00eda, bases s\u00f3lidas para escalar."
    },
    {
        "pt": "Aplica\u00e7\u00f5es Full-Stack",
        "en": "Full-stack applications",
        "es": "Aplicaciones Full-Stack"
    },
    {
        "pt": "Integra\u00e7\u00f5es e Automa\u00e7\u00e3o",
        "en": "Integrations and Automation",
        "es": "Integraciones y Automatizaci\u00f3n"
    },
    {
        "pt": "Produtos orientados a dados",
        "en": "Data-driven products",
        "es": "Productos orientados a datos"
    },
    {
        "pt": "Experi\u00eancias mobile r\u00e1pidas e consistentes, com performance e UX/UI orientadas a reten\u00e7\u00e3o e convers\u00e3o.",
        "en": "Fast, consistent mobile experiences with performance and UX/UI focused on retention and conversion.",
        "es": "Experiencias mobile r\u00e1pidas y consistentes, con rendimiento y UX/UI orientados a retenci\u00f3n y conversi\u00f3n."
    },
    {
        "pt": "Discovery & Valida\u00e7\u00e3o",
        "en": "Discovery & Validation",
        "es": "Discovery y Validaci\u00f3n"
    },
    {
        "pt": "Design & Prototipagem",
        "en": "Design & Prototyping",
        "es": "Dise\u00f1o y Prototipado"
    },
    {
        "pt": "Desenvolvimento \u00c1gil",
        "en": "Agile Development",
        "es": "Desarrollo \u00c1gil"
    },
    {
        "pt": "QA & Testes Cont\u00ednuos",
        "en": "QA & Continuous Testing",
        "es": "QA y Pruebas Continuas"
    },
    {
        "pt": "DevOps & Entrega",
        "en": "DevOps & Delivery",
        "es": "DevOps y Entrega"
    },
    {
        "pt": "Suporte & Evolu\u00e7\u00e3o",
        "en": "Support & Evolution",
        "es": "Soporte y Evoluci\u00f3n"
    },
    {
        "pt": "Mais controlo. Mais diferencia\u00e7\u00e3o.",
        "en": "More control. More differentiation.",
        "es": "M\u00e1s control. M\u00e1s diferenciaci\u00f3n."
    },
    {
        "pt": "Custos a longo prazo",
        "en": "Long-term costs",
        "es": "Costes a largo plazo"
    },
    {
        "pt": "Tamb\u00e9m inclui",
        "en": "Also includes",
        "es": "Tambi\u00e9n incluye"
    },
    {
        "pt": "Processos-chave (BPMN)",
        "en": "Key processes (BPMN)",
        "es": "Procesos clave (BPMN)"
    },
    {
        "pt": "Implementa\u00e7\u00e3o por m\u00f3dulos com entregas progressivas, testes e updates regulares.",
        "en": "Modular implementation with progressive delivery, tests and regular updates.",
        "es": "Implementaci\u00f3n por m\u00f3dulos con entregas progresivas, pruebas y actualizaciones regulares."
    },
    {
        "pt": "M\u00f3dulos incrementais",
        "en": "Incremental modules",
        "es": "M\u00f3dulos incrementales"
    },
    {
        "pt": "Documenta\u00e7\u00e3o",
        "en": "Documentation",
        "es": "Documentaci\u00f3n"
    },
    {
        "pt": "dedicadas",
        "en": "dedicated",
        "es": "dedicados"
    },
    {
        "pt": "Passo um",
        "en": "Step one",
        "es": "Paso uno"
    },
    {
        "pt": "Passo dois",
        "en": "Step two",
        "es": "Paso dos"
    },
    {
        "pt": "Passo tr\u00eas",
        "en": "Step three",
        "es": "Paso tres"
    },
    {
        "pt": "Passo quatro",
        "en": "Step four",
        "es": "Paso cuatro"
    },
    {
        "pt": "Come\u00e7a a construir a tua Equipa Dedicada.",
        "en": "Start building your Dedicated Team.",
        "es": "Empieza a construir tu Equipo Dedicado."
    },
    {
        "pt": "Board de lan\u00e7amento \u00b7 N\u00facleo do MVP",
        "en": "Launch board \u00b7 MVP core",
        "es": "Board de lanzamiento \u00b7 N\u00facleo del MVP"
    },
    {
        "pt": "Login, onboarding e setup inicial",
        "en": "Login, onboarding and initial setup",
        "es": "Login, onboarding y setup inicial"
    },
    {
        "pt": "Dashboard, m\u00e9tricas e feedback loop",
        "en": "Dashboard, metrics and feedback loop",
        "es": "Dashboard, m\u00e9tricas y feedback loop"
    },
    {
        "pt": "QA final e prepara\u00e7\u00e3o para lan\u00e7amento",
        "en": "Final QA and launch preparation",
        "es": "QA final y preparaci\u00f3n para lanzamiento"
    },
    {
        "pt": "Testes e lan\u00e7amento",
        "en": "Testing and launch",
        "es": "Pruebas y lanzamiento"
    },
    {
        "pt": "Pronto para construir o teu MVP?",
        "en": "Ready to build your MVP?",
        "es": "\u00bfListo para construir tu MVP?"
    },
    {
        "pt": "O processo estruturado por tr\u00e1s do desenvolvimento de produtos bem-sucedidos. Em 15-20 dias, transformamos uma ideia num plano de a\u00e7\u00e3o claro e execut\u00e1vel.",
        "en": "The structured process behind successful product development. In 15-20 days, we turn an idea into a clear, executable action plan.",
        "es": "El proceso estructurado detr\u00e1s del desarrollo de productos exitosos. En 15-20 d\u00edas, transformamos una idea en un plan de acci\u00f3n claro y ejecutable."
    },
    {
        "pt": "para transformar incerteza em dire\u00e7\u00e3o clara",
        "en": "to turn uncertainty into clear direction",
        "es": "para transformar incertidumbre en direcci\u00f3n clara"
    },
    {
        "pt": "priorizado e alinhado com objetivos de neg\u00f3cio",
        "en": "prioritised and aligned with business goals",
        "es": "priorizado y alineado con objetivos de negocio"
    },
    {
        "pt": "para decidir com clareza o pr\u00f3ximo passo",
        "en": "to clearly decide the next step",
        "es": "para decidir con claridad el pr\u00f3ximo paso"
    },
    {
        "pt": "produto, neg\u00f3cio e entrega na mesma p\u00e1gina",
        "en": "product, business and delivery on the same page",
        "es": "producto, negocio y entrega en la misma p\u00e1gina"
    },
    {
        "pt": "O que \u00e9",
        "en": "What it is",
        "es": "Qu\u00e9 es"
    },
    {
        "pt": "Dias 1-2",
        "en": "Days 1-2",
        "es": "D\u00edas 1-2"
    },
    {
        "pt": "Dias 3-10",
        "en": "Days 3-10",
        "es": "D\u00edas 3-10"
    },
    {
        "pt": "Dias 11-15",
        "en": "Days 11-15",
        "es": "D\u00edas 11-15"
    },
    {
        "pt": "Backlog priorizado do MVP",
        "en": "Prioritised MVP backlog",
        "es": "Backlog priorizado del MVP"
    },
    {
        "pt": "Roadmap de entrega",
        "en": "Delivery roadmap",
        "es": "Roadmap de entrega"
    },
    {
        "pt": "Estimativa de equipa e budget",
        "en": "Team and budget estimate",
        "es": "Estimaci\u00f3n de equipo y budget"
    },
    {
        "pt": "Riscos e decis\u00f5es abertas",
        "en": "Risks and open decisions",
        "es": "Riesgos y decisiones abiertas"
    },
    {
        "pt": "Perguntas frequentes.",
        "en": "Frequently asked questions.",
        "es": "Preguntas frecuentes."
    },
    {
        "pt": "Agendar Sess\u00e3o de Descoberta",
        "en": "Book Discovery Session",
        "es": "Agendar Sesi\u00f3n de Descubrimiento"
    },
    {
        "pt": "Pesquisa",
        "en": "Research",
        "es": "Investigaci\u00f3n"
    },
    {
        "pt": "Perceber onde complica",
        "en": "Understand where it gets complicated",
        "es": "Entender d\u00f3nde se complica"
    },
    {
        "pt": "Organizar ecr\u00e3s e passos",
        "en": "Organise screens and steps",
        "es": "Organizar pantallas y pasos"
    },
    {
        "pt": "Sistema visual",
        "en": "Visual system",
        "es": "Sistema visual"
    },
    {
        "pt": "Dar coer\u00eancia ao produto",
        "en": "Give the product coherence",
        "es": "Dar coherencia al producto"
    }
];
  var FINAL_TRANSLATIONS = [
    {
        "pt": "Sobre n\u00f3s \u2014 Cobrait",
        "en": "About us \u2014 Cobrait",
        "es": "Sobre nosotros \u2014 Cobrait"
    },
    {
        "pt": "Agendar chamada \u2014 Cobrait",
        "en": "Book a call \u2014 Cobrait",
        "es": "Agendar llamada \u2014 Cobrait"
    },
    {
        "pt": "Pol\u00edtica de Cookies \u2014 Cobrait",
        "en": "Cookie Policy \u2014 Cobrait",
        "es": "Pol\u00edtica de Cookies \u2014 Cobrait"
    },
    {
        "pt": "Pol\u00edtica de Privacidade \u2014 Cobrait",
        "en": "Privacy Policy \u2014 Cobrait",
        "es": "Pol\u00edtica de Privacidad \u2014 Cobrait"
    },
    {
        "pt": "Processo | Cobrait",
        "en": "Process | Cobrait",
        "es": "Proceso | Cobrait"
    },
    {
        "pt": "Servicos | Cobrait",
        "en": "Services | Cobrait",
        "es": "Servicios | Cobrait"
    },
    {
        "pt": "Tecnologia \u2014 Cobrait",
        "en": "Technology \u2014 Cobrait",
        "es": "Tecnolog\u00eda \u2014 Cobrait"
    },
    {
        "pt": "Termos e Condi\u00e7\u00f5es \u2014 Cobrait",
        "en": "Terms and Conditions \u2014 Cobrait",
        "es": "T\u00e9rminos y Condiciones \u2014 Cobrait"
    },
    {
        "pt": "Software \u00e0 Medida \u2014 Cobrait",
        "en": "Custom Software \u2014 Cobrait",
        "es": "Software a Medida \u2014 Cobrait"
    },
    {
        "pt": "Equipas Dedicadas \u2014 Cobrait",
        "en": "Dedicated Teams \u2014 Cobrait",
        "es": "Equipos Dedicados \u2014 Cobrait"
    },
    {
        "pt": "MVP Builder \u2014 Cobrait",
        "en": "MVP Builder \u2014 Cobrait",
        "es": "MVP Builder \u2014 Cobrait"
    },
    {
        "pt": "Product Scope \u2014 Cobrait",
        "en": "Product Scope \u2014 Cobrait",
        "es": "Product Scope \u2014 Cobrait"
    },
    {
        "pt": "Design UX/UI \u2014 Cobrait",
        "en": "UX/UI Design \u2014 Cobrait",
        "es": "Dise\u00f1o UX/UI \u2014 Cobrait"
    },
    {
        "pt": "Cobrait \u2014 Produto, design e desenvolvimento \u00e0 medida",
        "en": "Cobrait \u2014 Product, design and custom development",
        "es": "Cobrait \u2014 Producto, dise\u00f1o y desarrollo a medida"
    },
    {
        "pt": "Processo de 15 dias para alinhar produto e neg\u00f3cio.",
        "en": "15-day process to align product and business.",
        "es": "Proceso de 15 d\u00edas para alinear producto y negocio."
    },
    {
        "pt": "Entra no mercado rapidamente com um MVP de qualidade.",
        "en": "Enter the market quickly with a quality MVP.",
        "es": "Entra al mercado r\u00e1pidamente con un MVP de calidad."
    },
    {
        "pt": "Design de produtos f\u00e1ceis de usar, envolventes e funcionais.",
        "en": "Design for products that are easy to use, engaging and functional.",
        "es": "Dise\u00f1o de productos f\u00e1ciles de usar, atractivos y funcionales."
    },
    {
        "pt": "Frameworks lean aplicados \u00e0 tua vis\u00e3o de produto.",
        "en": "Lean frameworks applied to your product vision.",
        "es": "Frameworks lean aplicados a tu visi\u00f3n de producto."
    },
    {
        "pt": "Constr\u00f3i o teu produto com uma equipa dedicada de devs.",
        "en": "Build your product with a dedicated team of devs.",
        "es": "Construye tu producto con un equipo dedicado de devs."
    },
    {
        "pt": "Cobra IT \u00b7 Software Company",
        "en": "Cobra IT \u00b7 Software Company",
        "es": "Cobra IT \u00b7 Software Company"
    },
    {
        "pt": "Ver tecnologia \u2192",
        "en": "See technology \u2192",
        "es": "Ver tecnolog\u00eda \u2192"
    },
    {
        "pt": "End-to-end",
        "en": "End-to-end",
        "es": "End-to-end"
    },
    {
        "pt": "Produto + engenharia, sob um \u00fanico parceiro.",
        "en": "Product + engineering under one partner.",
        "es": "Producto + ingenier\u00eda bajo un \u00fanico socio."
    },
    {
        "pt": "MVP-first",
        "en": "MVP-first",
        "es": "MVP-first"
    },
    {
        "pt": "Caminho mais curto entre ideia e tra\u00e7\u00e3o.",
        "en": "The shortest path between idea and traction.",
        "es": "El camino m\u00e1s corto entre idea y tracci\u00f3n."
    },
    {
        "pt": "Discovery para alinhar vis\u00e3o e scope",
        "en": "Discovery to align vision and scope",
        "es": "Discovery para alinear visi\u00f3n y scope"
    },
    {
        "pt": "Arquitetura limpa e qualidade de engenharia",
        "en": "Clean architecture and engineering quality",
        "es": "Arquitectura limpia y calidad de ingenier\u00eda"
    },
    {
        "pt": "Entrega incremental com feedback real",
        "en": "Incremental delivery with real feedback",
        "es": "Entrega incremental con feedback real"
    },
    {
        "pt": "Software Factory. Criamos produtos digitais com foco em velocidade, qualidade e crescimento \u2014 do scope ao lan\u00e7amento.",
        "en": "Software Factory. We create digital products focused on speed, quality and growth, from scope to launch.",
        "es": "Software Factory. Creamos productos digitales con foco en velocidad, calidad y crecimiento, del scope al lanzamiento."
    },
    {
        "pt": "Software Factory. Criamos produtos digitais com foco em velocidade, qualidade e crescimento.",
        "en": "Software Factory. We create digital products focused on speed, quality and growth.",
        "es": "Software Factory. Creamos productos digitales con foco en velocidad, calidad y crecimiento."
    },
    {
        "pt": "Sprint de",
        "en": "Sprint of",
        "es": "Sprint de"
    },
    {
        "pt": "Descoberta",
        "en": "Discovery",
        "es": "Descubrimiento"
    },
    {
        "pt": "Cobrait HQ",
        "en": "Cobrait HQ",
        "es": "Cobrait HQ"
    },
    {
        "pt": "R. Eng Ferreira Dias 161",
        "en": "R. Eng Ferreira Dias 161",
        "es": "R. Eng Ferreira Dias 161"
    },
    {
        "pt": "R. Eng Ferreira Dias 161,",
        "en": "R. Eng Ferreira Dias 161,",
        "es": "R. Eng Ferreira Dias 161,"
    },
    {
        "pt": "4100-247 Porto",
        "en": "4100-247 Porto",
        "es": "4100-247 Porto"
    },
    {
        "pt": "4100-247 Porto \u00b7 Portugal",
        "en": "4100-247 Porto \u00b7 Portugal",
        "es": "4100-247 Porto \u00b7 Portugal"
    },
    {
        "pt": "R. Eng Ferreira Dias 161 \u00b7 Porto",
        "en": "R. Eng Ferreira Dias 161 \u00b7 Porto",
        "es": "R. Eng Ferreira Dias 161 \u00b7 Porto"
    },
    {
        "pt": "geral@cobrait.pt",
        "en": "geral@cobrait.pt",
        "es": "geral@cobrait.pt"
    },
    {
        "pt": "@cobra_it",
        "en": "@cobra_it",
        "es": "@cobra_it"
    },
    {
        "pt": "Preenche o formul\u00e1rio e respondemos em 24-48h.",
        "en": "Fill out the form and we reply within 24-48h.",
        "es": "Rellena el formulario y respondemos en 24-48h."
    },
    {
        "pt": "Os dados podem ser partilhados apenas com fornecedores necess\u00e1rios para opera\u00e7\u00e3o t\u00e9cnica (hosting, analytics, ferramentas de comunica\u00e7\u00e3o), sob obriga\u00e7\u00f5es de confidencialidade e seguran\u00e7a.",
        "en": "Data may be shared only with providers needed for technical operation (hosting, analytics, communication tools), under confidentiality and security obligations.",
        "es": "Los datos pueden compartirse solo con proveedores necesarios para la operaci\u00f3n t\u00e9cnica (hosting, analytics, herramientas de comunicaci\u00f3n), bajo obligaciones de confidencialidad y seguridad."
    },
    {
        "pt": "Conservamos os dados apenas pelo per\u00edodo necess\u00e1rio para as finalidades descritas, ou pelo prazo legal aplic\u00e1vel quando exigido por lei.",
        "en": "We keep data only for the period needed for the described purposes, or for the applicable legal period when required by law.",
        "es": "Conservamos los datos solo durante el periodo necesario para las finalidades descritas, o durante el plazo legal aplicable cuando la ley lo exija."
    },
    {
        "pt": "Podes pedir acesso, retifica\u00e7\u00e3o, apagamento, limita\u00e7\u00e3o, oposi\u00e7\u00e3o e portabilidade dos teus dados.",
        "en": "You can request access, rectification, erasure, restriction, objection and portability of your data.",
        "es": "Puedes solicitar acceso, rectificaci\u00f3n, supresi\u00f3n, limitaci\u00f3n, oposici\u00f3n y portabilidad de tus datos."
    },
    {
        "pt": "Aplicamos medidas t\u00e9cnicas e organizativas adequadas para proteger os dados pessoais. Para pedidos relacionados com privacidade, contacta",
        "en": "We apply appropriate technical and organisational measures to protect personal data. For privacy-related requests, contact",
        "es": "Aplicamos medidas t\u00e9cnicas y organizativas adecuadas para proteger los datos personales. Para solicitudes relacionadas con privacidad, contacta"
    },
    {
        "pt": "Do",
        "en": "From",
        "es": "Del"
    },
    {
        "pt": "ao lancamento.",
        "en": "to launch.",
        "es": "al lanzamiento."
    },
    {
        "pt": "Sprints",
        "en": "Sprints",
        "es": "Sprints"
    },
    {
        "pt": "Seja qual for o desafio, escolhemos a tecnologia certa e criamos a experi\u00eancia ideal para os teus utilizadores \u2014 sem limita\u00e7\u00f5es de solu\u00e7\u00f5es gen\u00e9ricas.",
        "en": "Whatever the challenge, we choose the right technology and create the ideal experience for your users, without the limits of generic solutions.",
        "es": "Sea cual sea el reto, elegimos la tecnolog\u00eda adecuada y creamos la experiencia ideal para tus usuarios, sin las limitaciones de soluciones gen\u00e9ricas."
    },
    {
        "pt": "Mais flexibilidade e mais diferencia\u00e7\u00e3o \u2014 sem limita\u00e7\u00f5es de solu\u00e7\u00f5es gen\u00e9ricas.",
        "en": "More flexibility and more differentiation, without the limits of generic solutions.",
        "es": "M\u00e1s flexibilidad y m\u00e1s diferenciaci\u00f3n, sin las limitaciones de soluciones gen\u00e9ricas."
    },
    {
        "pt": "Evolui o produto rapidamente conforme o mercado e a tua equipa mudam.",
        "en": "Evolve the product quickly as the market and your team change.",
        "es": "Evoluciona el producto r\u00e1pidamente a medida que cambian el mercado y tu equipo."
    },
    {
        "pt": "Funcionalidades e UX \u00fanicas para te diferenciares da concorr\u00eancia.",
        "en": "Unique features and UX to differentiate you from the competition.",
        "es": "Funcionalidades y UX \u00fanicas para diferenciarte de la competencia."
    },
    {
        "pt": "Arquitetura preparada para crescer com performance, seguran\u00e7a e observabilidade.",
        "en": "Architecture ready to grow with performance, security and observability.",
        "es": "Arquitectura preparada para crecer con rendimiento, seguridad y observabilidad."
    },
    {
        "pt": "Menos subscri\u00e7\u00f5es e workarounds \u2014 melhor ROI com o tempo.",
        "en": "Fewer subscriptions and workarounds, better ROI over time.",
        "es": "Menos suscripciones y workarounds, mejor ROI con el tiempo."
    },
    {
        "pt": "UX/UI com foco em convers\u00e3o, reten\u00e7\u00e3o e clareza em cada fluxo.",
        "en": "UX/UI focused on conversion, retention and clarity in every flow.",
        "es": "UX/UI enfocado en conversi\u00f3n, retenci\u00f3n y claridad en cada flujo."
    },
    {
        "pt": "Sess\u00f5es intensivas para alinhar vis\u00e3o, objetivos, requisitos e prioridades do produto.",
        "en": "Intensive sessions to align product vision, goals, requirements and priorities.",
        "es": "Sesiones intensivas para alinear visi\u00f3n, objetivos, requisitos y prioridades del producto."
    },
    {
        "pt": "Entrega",
        "en": "Delivery",
        "es": "Entrega"
    },
    {
        "pt": "Equipas",
        "en": "Teams",
        "es": "Equipos"
    },
    {
        "pt": "Programadores Front-end e Full-stack selecionados a dedo, perfeitamente ajustados \u00e0s tuas necessidades \u2014 remote-first, weekly sync, fast ramp-up.",
        "en": "Hand-picked front-end and full-stack developers, perfectly matched to your needs, remote-first, weekly sync, fast ramp-up.",
        "es": "Desarrolladores front-end y full-stack seleccionados a medida, perfectamente ajustados a tus necesidades, remote-first, weekly sync, fast ramp-up."
    },
    {
        "pt": "Quality checks, release flow",
        "en": "Quality checks, release flow",
        "es": "Quality checks, release flow"
    },
    {
        "pt": "Selecionamos e avaliamos candidatos com crit\u00e9rios t\u00e9cnicos e comportamentais \u2014 para garantir consist\u00eancia, qualidade e fit com a tua equipa.",
        "en": "We select and evaluate candidates with technical and behavioural criteria to ensure consistency, quality and fit with your team.",
        "es": "Seleccionamos y evaluamos candidatos con criterios t\u00e9cnicos y de comportamiento para garantizar consistencia, calidad y encaje con tu equipo."
    },
    {
        "pt": "Evita overhead de recrutamento, onboarding e rotatividade. Ganha previsibilidade e reduz risco com um modelo claro e escal\u00e1vel.",
        "en": "Avoid recruitment, onboarding and turnover overhead. Gain predictability and reduce risk with a clear, scalable model.",
        "es": "Evita overhead de reclutamiento, onboarding y rotaci\u00f3n. Gana previsibilidad y reduce riesgo con un modelo claro y escalable."
    },
    {
        "pt": "Ajudamos a manter padr\u00f5es altos atrav\u00e9s de boas pr\u00e1ticas, mentoria e processos \u2014 para a equipa crescer com o produto.",
        "en": "We help maintain high standards through best practices, mentoring and processes so the team grows with the product.",
        "es": "Ayudamos a mantener est\u00e1ndares altos mediante buenas pr\u00e1cticas, mentor\u00eda y procesos para que el equipo crezca con el producto."
    },
    {
        "pt": "N\u00f3s tratamos do processo de sele\u00e7\u00e3o e estrutura. Tu ficas focado em produto, delivery e crescimento.",
        "en": "We handle the selection process and structure. You stay focused on product, delivery and growth.",
        "es": "Nosotros gestionamos el proceso de selecci\u00f3n y estructura. T\u00fa te centras en producto, delivery y crecimiento."
    },
    {
        "pt": "Onboarding",
        "en": "Onboarding",
        "es": "Onboarding"
    },
    {
        "pt": "Integramos a equipa ao teu processo (Agile/Lean), ferramentas e padr\u00f5es. Garantimos velocidade sem perder qualidade.",
        "en": "We integrate the team into your process (Agile/Lean), tools and standards. We ensure speed without losing quality.",
        "es": "Integramos el equipo en tu proceso (Agile/Lean), herramientas y est\u00e1ndares. Garantizamos velocidad sin perder calidad."
    },
    {
        "pt": "Acompanhamos entregas, performance e comunica\u00e7\u00e3o. \u00c0 medida que o produto cresce, escalamos a equipa com seguran\u00e7a.",
        "en": "We monitor delivery, performance and communication. As the product grows, we scale the team safely.",
        "es": "Acompa\u00f1amos entregas, rendimiento y comunicaci\u00f3n. A medida que el producto crece, escalamos el equipo con seguridad."
    },
    {
        "pt": "Agenda uma chamada com um especialista e desenhamos o modelo certo para entregar com qualidade, previsibilidade e escala.",
        "en": "Book a call with a specialist and we design the right model to deliver with quality, predictability and scale.",
        "es": "Agenda una llamada con un especialista y dise\u00f1amos el modelo adecuado para entregar con calidad, previsibilidad y escala."
    },
    {
        "pt": "Itera\u00e7\u00e3o",
        "en": "Iteration",
        "es": "Iteraci\u00f3n"
    },
    {
        "pt": "Core flow com valida\u00e7\u00e3o do produto",
        "en": "Core flow with product validation",
        "es": "Core flow con validaci\u00f3n del producto"
    },
    {
        "pt": "Benef\u00edcios",
        "en": "Benefits",
        "es": "Beneficios"
    },
    {
        "pt": "Desenvolvimento",
        "en": "Development",
        "es": "Desarrollo"
    },
    {
        "pt": "Um processo estruturado e intensivo de 15-20 dias, concebido para preparar o teu projeto para o sucesso. Come\u00e7a com uma sess\u00e3o de foco imersiva onde te sentas com especialistas em produto e ex-fundadores de startups para explorar a tua vis\u00e3o de produto do ponto de vista de neg\u00f3cio.",
        "en": "A structured, intensive 15-20 day process designed to prepare your project for success. It starts with an immersive focus session where you sit with product specialists and former startup founders to explore your product vision from a business perspective.",
        "es": "Un proceso estructurado e intensivo de 15-20 d\u00edas, dise\u00f1ado para preparar tu proyecto para el \u00e9xito. Empieza con una sesi\u00f3n de foco inmersiva donde te sientas con especialistas de producto y exfundadores de startups para explorar tu visi\u00f3n de producto desde la perspectiva de negocio."
    },
    {
        "pt": "Depois criamos a lista adequada de user stories para o teu Minimum Viable Product, garantindo as funcionalidades essenciais para entrar no mercado e testar as principais hip\u00f3teses.",
        "en": "Then we create the right list of user stories for your Minimum Viable Product, ensuring the essential features to enter the market and test the main hypotheses.",
        "es": "Despu\u00e9s creamos la lista adecuada de user stories para tu Minimum Viable Product, garantizando las funcionalidades esenciales para entrar al mercado y probar las principales hip\u00f3tesis."
    },
    {
        "pt": "Defini\u00e7\u00e3o de Scope",
        "en": "Scope Definition",
        "es": "Definici\u00f3n de Scope"
    },
    {
        "pt": "Roadmap e Estimativas",
        "en": "Roadmap and Estimates",
        "es": "Roadmap y Estimaciones"
    },
    {
        "pt": "O Product Scope substitui o desenvolvimento?",
        "en": "Does Product Scope replace development?",
        "es": "\u00bfProduct Scope sustituye el desarrollo?"
    },
    {
        "pt": "Quem deve participar neste processo?",
        "en": "Who should participate in this process?",
        "es": "\u00bfQui\u00e9n debe participar en este proceso?"
    },
    {
        "pt": "Posso avan\u00e7ar convosco depois do scope?",
        "en": "Can I move forward with you after the scope?",
        "es": "\u00bfPuedo avanzar con vosotros despu\u00e9s del scope?"
    },
    {
        "pt": "Pronto para come\u00e7ar o teu Product Scope?",
        "en": "Ready to start your Product Scope?",
        "es": "\u00bfListo para empezar tu Product Scope?"
    },
    {
        "pt": "Vamos transformar a tua ideia num plano de a\u00e7\u00e3o claro e execut\u00e1vel.",
        "en": "Let's turn your idea into a clear, executable action plan.",
        "es": "Transformemos tu idea en un plan de acci\u00f3n claro y ejecutable."
    },
    {
        "pt": "Wireframes",
        "en": "Wireframes",
        "es": "Wireframes"
    },
    {
        "pt": "Desenhamos produtos envolventes, f\u00e1ceis de usar, atraentes e funcionais \u2014 com foco em convers\u00e3o, clareza e consist\u00eancia.",
        "en": "We design engaging, easy-to-use, attractive and functional products focused on conversion, clarity and consistency.",
        "es": "Dise\u00f1amos productos atractivos, f\u00e1ciles de usar y funcionales, con foco en conversi\u00f3n, claridad y consistencia."
    },
    {
        "pt": "Identificamos os pontos em que as pessoas param ou desistem \u2014 antes de mexer no visual.",
        "en": "We identify where people stop or give up before touching the visuals.",
        "es": "Identificamos los puntos donde las personas se detienen o abandonan antes de tocar lo visual."
    },
    {
        "pt": "Primeiro acertamos o caminho, depois o detalhe visual. Menos retrabalho, mais velocidade.",
        "en": "First we get the path right, then the visual detail. Less rework, more speed.",
        "es": "Primero acertamos el camino, despu\u00e9s el detalle visual. Menos retrabajo, m\u00e1s velocidad."
    },
    {
        "pt": "Mesma linguagem visual em todo o produto \u2014 componentes, estados, tokens e escala.",
        "en": "The same visual language across the product: components, states, tokens and scale.",
        "es": "La misma linguagem visual en todo el producto: componentes, estados, tokens y escala."
    },
    {
        "pt": "Mobile (iOS & Android)",
        "en": "Mobile (iOS & Android)",
        "es": "Mobile (iOS & Android)"
    }
];
  var CLOSING_TRANSLATIONS = [
    {
        "pt": "Product mindset",
        "en": "Product mindset",
        "es": "Product mindset"
    },
    {
        "pt": "Engineering quality",
        "en": "Engineering quality",
        "es": "Calidad de ingenier\u00eda"
    },
    {
        "pt": "Cobrait - Servicos",
        "en": "Cobrait - Services",
        "es": "Cobrait - Servicios"
    },
    {
        "pt": "UX/UI",
        "en": "UX/UI",
        "es": "UX/UI"
    },
    {
        "pt": "Alinhamos vis\u00e3o, necessidades, senioridade, stack e objetivos. Definimos perfis e crit\u00e9rios para a shortlist.",
        "en": "We align vision, needs, seniority, stack and goals. We define profiles and criteria for the shortlist.",
        "es": "Alineamos visi\u00f3n, necesidades, seniority, stack y objetivos. Definimos perfiles y criterios para la shortlist."
    },
    {
        "pt": "Filtramos candidatos com base em experi\u00eancia e performance. Partilhamos perfis e ajudamos a escolher os melhores fits.",
        "en": "We filter candidates based on experience and performance. We share profiles and help choose the best fits.",
        "es": "Filtramos candidatos seg\u00fan experiencia y rendimiento. Compartimos perfiles y ayudamos a elegir los mejores fits."
    },
    {
        "pt": "Entra no mercado rapidamente com um MVP (Minimum Viable Product) de alta qualidade, desenhado para testar as principais hip\u00f3teses e acelerar tra\u00e7\u00e3o.",
        "en": "Enter the market quickly with a high-quality MVP (Minimum Viable Product), designed to test the main hypotheses and accelerate traction.",
        "es": "Entra al mercado r\u00e1pidamente con un MVP (Minimum Viable Product) de alta calidad, dise\u00f1ado para probar las principales hip\u00f3tesis y acelerar tracci\u00f3n."
    },
    {
        "pt": "Usamos um processo estruturado para construir o teu MVP de forma r\u00e1pida e controlada. Come\u00e7amos por simplificar o produto \u00e0s funcionalidades vitais, passamos pelo UX/UI com foco em clareza e convers\u00e3o, e desenvolvemos do zero com boas pr\u00e1ticas. Lan\u00e7as cedo, aprendes r\u00e1pido e melhoras com feedback real.",
        "en": "We use a structured process to build your MVP quickly and with control. We start by simplifying the product to its vital features, move through UX/UI focused on clarity and conversion, and build from scratch with best practices. You launch early, learn fast and improve with real feedback.",
        "es": "Usamos un proceso estructurado para construir tu MVP de forma r\u00e1pida y controlada. Empezamos simplificando el producto a sus funcionalidades vitales, pasamos por UX/UI con foco en claridad y conversi\u00f3n, y desarrollamos desde cero con buenas pr\u00e1cticas. Lanzas pronto, aprendes r\u00e1pido y mejoras con feedback real."
    },
    {
        "pt": "Quando tens uma ideia e precisas de validar mercado, quando queres uma primeira vers\u00e3o para capta\u00e7\u00e3o de clientes/investimento, ou quando precisas de substituir 'prot\u00f3tipos' por produto real. Um MVP bem feito d\u00e1 velocidade sem sacrificar base t\u00e9cnica.",
        "en": "When you have an idea and need to validate the market, want a first version to acquire clients/investment, or need to replace prototypes with a real product. A well-built MVP gives speed without sacrificing the technical base.",
        "es": "Cuando tienes una idea y necesitas validar mercado, quieres una primera versi\u00f3n para captar clientes/inversi\u00f3n, o necesitas sustituir prototipos por producto real. Un MVP bien hecho da velocidad sin sacrificar la base t\u00e9cnica."
    },
    {
        "pt": "Evitas construir um produto enorme antes de saber se o mercado quer. Testamos as hip\u00f3teses com o m\u00ednimo necess\u00e1rio \u2014 e s\u00f3 depois escalamos.",
        "en": "You avoid building a huge product before knowing whether the market wants it. We test hypotheses with the minimum needed, and only then scale.",
        "es": "Evitas construir un producto enorme antes de saber si el mercado lo quiere. Probamos las hip\u00f3tesis con lo m\u00ednimo necesario y solo despu\u00e9s escalamos."
    },
    {
        "pt": "Menos funcionalidades = menos desenvolvimento e menos manuten\u00e7\u00e3o. O or\u00e7amento vai para o que realmente cria valor e valida o produto.",
        "en": "Fewer features means less development and less maintenance. The budget goes to what truly creates value and validates the product.",
        "es": "Menos funcionalidades significa menos desarrollo y menos mantenimiento. El presupuesto va a lo que realmente crea valor y valida el producto."
    },
    {
        "pt": "Lan\u00e7ar cedo d\u00e1-te vantagem: feedback real, tra\u00e7\u00e3o e itera\u00e7\u00e3o. O MVP \u00e9 a forma mais r\u00e1pida de aprender com o mercado.",
        "en": "Launching early gives you an advantage: real feedback, traction and iteration. The MVP is the fastest way to learn from the market.",
        "es": "Lanzar pronto te da ventaja: feedback real, tracci\u00f3n e iteraci\u00f3n. El MVP es la forma m\u00e1s r\u00e1pida de aprender del mercado."
    },
    {
        "pt": "Uma equipa experiente acelera decis\u00f5es e execu\u00e7\u00e3o. Tu ficas focado(a) no neg\u00f3cio \u2014 n\u00f3s tratamos de produto, design e engenharia.",
        "en": "An experienced team accelerates decisions and execution. You stay focused on the business, we handle product, design and engineering.",
        "es": "Un equipo experimentado acelera decisiones y ejecuci\u00f3n. T\u00fa te centras en el negocio, nosotros nos encargamos de producto, dise\u00f1o e ingenier\u00eda."
    },
    {
        "pt": "Alinhamos a vis\u00e3o do produto, objetivos e prioridades. Definimos o 'core' do MVP e criamos um plano de entrega claro para reduzir risco e acelerar o lan\u00e7amento.",
        "en": "We align product vision, goals and priorities. We define the MVP core and create a clear delivery plan to reduce risk and accelerate launch.",
        "es": "Alineamos la visi\u00f3n del producto, objetivos y prioridades. Definimos el core del MVP y creamos un plan de entrega claro para reducir riesgo y acelerar el lanzamiento."
    },
    {
        "pt": "Criamos as principais screens para validares dire\u00e7\u00e3o visual e fluxos. Permite aprovar UX/UI antes de expandir o design para o produto completo.",
        "en": "We create the key screens so you can validate visual direction and flows. This lets you approve UX/UI before expanding the design to the full product.",
        "es": "Creamos las pantallas clave para validar direcci\u00f3n visual y flujos. Permite aprobar UX/UI antes de expandir el dise\u00f1o al producto completo."
    },
    {
        "pt": "Depois de aprovares as Key Screens, expandimos o design para todas as screens necess\u00e1rias para o MVP ficar completo e pronto para desenvolvimento.",
        "en": "After you approve the Key Screens, we expand the design to all screens needed for the MVP to be complete and ready for development.",
        "es": "Despu\u00e9s de aprobar las Key Screens, expandimos el dise\u00f1o a todas las pantallas necesarias para que el MVP est\u00e9 completo y listo para desarrollo."
    },
    {
        "pt": "Implementamos o MVP com boas pr\u00e1ticas e entregas progressivas. Vais testando m\u00f3dulos enquanto desenvolvemos \u2014 com updates regulares e transpar\u00eancia.",
        "en": "We implement the MVP with best practices and progressive delivery. You test modules while we develop, with regular updates and transparency.",
        "es": "Implementamos el MVP con buenas pr\u00e1cticas y entregas progresivas. Vas probando m\u00f3dulos mientras desarrollamos, con actualizaciones regulares y transparencia."
    },
    {
        "pt": "Fase de testes para corrigir bugs cr\u00edticos e garantir qualidade. Preparamos o lan\u00e7amento com valida\u00e7\u00e3o final e 'launch readiness'.",
        "en": "Testing phase to fix critical bugs and ensure quality. We prepare launch with final validation and launch readiness.",
        "es": "Fase de pruebas para corregir bugs cr\u00edticos y garantizar calidad. Preparamos el lanzamiento con validaci\u00f3n final y launch readiness."
    },
    {
        "pt": "Transformamos a tua ideia num produto real, com foco no essencial e velocidade \u2014 sem sacrificar qualidade nem base t\u00e9cnica.",
        "en": "We turn your idea into a real product, focused on essentials and speed, without sacrificing quality or technical foundation.",
        "es": "Transformamos tu idea en un producto real, con foco en lo esencial y velocidad, sin sacrificar calidad ni base t\u00e9cnica."
    },
    {
        "pt": "Sess\u00e3o intensiva de dois dias para alcan\u00e7ar um estado de foco absoluto e mergulhar no cerne da proposta de valor do produto.",
        "en": "An intensive two-day session to reach absolute focus and dive into the core of the product value proposition.",
        "es": "Sesi\u00f3n intensiva de dos d\u00edas para alcanzar un estado de foco absoluto y profundizar en el n\u00facleo de la propuesta de valor del producto."
    },
    {
        "pt": "N\u00e3o queremos ajudar-te a construir um produto completo s\u00f3 para descobrir que o mercado n\u00e3o o quer. Focamo-nos no vital para testar as principais hip\u00f3teses.",
        "en": "We do not want to help you build a complete product only to discover the market does not want it. We focus on what is vital to test the main hypotheses.",
        "es": "No queremos ayudarte a construir un producto completo solo para descubrir que el mercado no lo quiere. Nos enfocamos en lo vital para probar las principales hip\u00f3tesis."
    },
    {
        "pt": "Ao reduzir a lista ao n\u00facleo essencial, baixas risco e custo. Gastas menos no desenvolvimento e na itera\u00e7\u00e3o inicial.",
        "en": "By reducing the list to the essential core, you lower risk and cost. You spend less on development and initial iteration.",
        "es": "Al reducir la lista al n\u00facleo esencial, reduces riesgo y coste. Gastas menos en desarrollo e iteraci\u00f3n inicial."
    },
    {
        "pt": "Escolher a ag\u00eancia certa \u00e9 uma decis\u00e3o de neg\u00f3cio. Usa o Product Scope para testar a rela\u00e7\u00e3o antes de te comprometeres com o projeto completo.",
        "en": "Choosing the right agency is a business decision. Use Product Scope to test the relationship before committing to the full project.",
        "es": "Elegir la agencia adecuada es una decisi\u00f3n de negocio. Usa Product Scope para probar la relaci\u00f3n antes de comprometerte con el proyecto completo."
    },
    {
        "pt": "Workshops intensivos com stakeholders e an\u00e1lise de mercado para mapear vis\u00e3o, utilizadores, contexto de neg\u00f3cio e m\u00e9tricas.",
        "en": "Intensive workshops with stakeholders and market analysis to map vision, users, business context and metrics.",
        "es": "Workshops intensivos con stakeholders y an\u00e1lisis de mercado para mapear visi\u00f3n, usuarios, contexto de negocio y m\u00e9tricas."
    },
    {
        "pt": "Mapeamento de user stories, fluxos e funcionalidades priorit\u00e1rias. Definimos o que vai para o MVP, o que fica para fases seguintes e o que cortamos.",
        "en": "Mapping user stories, flows and priority features. We define what goes into the MVP, what moves to later phases and what we cut.",
        "es": "Mapeo de user stories, flujos y funcionalidades prioritarias. Definimos qu\u00e9 va al MVP, qu\u00e9 queda para fases siguientes y qu\u00e9 cortamos."
    },
    {
        "pt": "Cronograma detalhado, or\u00e7amento, plano de entrega e pr\u00f3ximos passos claros \u2014 prontos para arrancar a fase de build.",
        "en": "Detailed timeline, budget, delivery plan and clear next steps, ready to start the build phase.",
        "es": "Cronograma detallado, presupuesto, plan de entrega y pr\u00f3ximos pasos claros, listos para arrancar la fase de build."
    },
    {
        "pt": "Artefactos concretos que te ajudam a decidir, planear e arrancar o desenvolvimento com menos risco.",
        "en": "Concrete artefacts that help you decide, plan and start development with less risk.",
        "es": "Artefactos concretos que te ayudan a decidir, planificar y arrancar el desarrollo con menos riesgo."
    },
    {
        "pt": "As funcionalidades essenciais ficam claramente definidas para a primeira vers\u00e3o, sem dispers\u00e3o nem extras prematuros.",
        "en": "The essential features are clearly defined for the first version, with no dispersion or premature extras.",
        "es": "Las funcionalidades esenciales quedan claramente definidas para la primera versi\u00f3n, sin dispersi\u00f3n ni extras prematuros."
    },
    {
        "pt": "Fica claro o que vem primeiro, o que pode ficar para fases seguintes e como organizar a evolu\u00e7\u00e3o do produto.",
        "en": "It becomes clear what comes first, what can move to later phases and how to organise product evolution.",
        "es": "Queda claro qu\u00e9 viene primero, qu\u00e9 puede quedar para fases siguientes y c\u00f3mo organizar la evoluci\u00f3n del producto."
    },
    {
        "pt": "Recebes uma base realista para discutir investimento, equipa necess\u00e1ria e compromisso de prazo antes de entrar em build.",
        "en": "You receive a realistic base to discuss investment, required team and timeline commitment before entering build.",
        "es": "Recibes una base realista para discutir inversi\u00f3n, equipo necesario y compromiso de plazo antes de entrar en build."
    },
    {
        "pt": "Mapeamos depend\u00eancias, d\u00favidas e decis\u00f5es cr\u00edticas para a equipa n\u00e3o descobrir bloqueios importantes tarde demais.",
        "en": "We map dependencies, questions and critical decisions so the team does not discover important blockers too late.",
        "es": "Mapeamos dependencias, dudas y decisiones cr\u00edticas para que el equipo no descubra bloqueos importantes demasiado tarde."
    },
    {
        "pt": "N\u00e3o. O objetivo \u00e9 reduzir incerteza antes da fase de build, para que o desenvolvimento arranque com mais clareza, velocidade e alinhamento.",
        "en": "No. The goal is to reduce uncertainty before the build phase so development starts with more clarity, speed and alignment.",
        "es": "No. El objetivo es reducir incertidumbre antes de la fase de build para que el desarrollo arranque con m\u00e1s claridad, velocidad y alineamiento."
    },
    {
        "pt": "Normalmente incluem-se founder ou CEO, product owner e stakeholders que tomam decis\u00f5es sobre neg\u00f3cio, prioridade e opera\u00e7\u00e3o.",
        "en": "Usually this includes the founder or CEO, product owner and stakeholders who make decisions about business, priority and operations.",
        "es": "Normalmente incluye founder o CEO, product owner y stakeholders que toman decisiones sobre negocio, prioridad y operaci\u00f3n."
    },
    {
        "pt": "Sim. O Product Scope funciona muito bem como primeira fase de um MVP, redesign ou produto \u00e0 medida \u2014 mas tamb\u00e9m deixa documenta\u00e7\u00e3o \u00fatil se decidires seguir com outra equipa.",
        "en": "Yes. Product Scope works very well as the first phase of an MVP, redesign or custom product, but also leaves useful documentation if you decide to continue with another team.",
        "es": "S\u00ed. Product Scope funciona muy bien como primera fase de un MVP, redesign o producto a medida, pero tambi\u00e9n deja documentaci\u00f3n \u00fatil si decides seguir con otro equipo."
    },
    {
        "pt": "UX (experi\u00eancia) define fluxos, estrutura e clareza. UI (interface) transforma isso num visual consistente e premium. Juntos, criam um produto intuitivo e agrad\u00e1vel \u2014 e evitam fric\u00e7\u00e3o em pontos cr\u00edticos como onboarding, checkout e formul\u00e1rios.",
        "en": "UX defines flows, structure and clarity. UI turns that into a consistent, premium visual layer. Together, they create an intuitive and pleasant product, avoiding friction in critical points like onboarding, checkout and forms.",
        "es": "UX define flujos, estructura y claridad. UI lo transforma en una capa visual consistente y premium. Juntos crean un producto intuitivo y agradable, evitando fricci\u00f3n en puntos cr\u00edticos como onboarding, checkout y formularios."
    },
    {
        "pt": "Quando precisas de aumentar convers\u00e3o, melhorar reten\u00e7\u00e3o, reduzir suporte e criar consist\u00eancia visual. Ideal para MVPs, produtos em crescimento, refactors de interface e quando queres profissionalizar o produto antes de escalar.",
        "en": "When you need to increase conversion, improve retention, reduce support and create visual consistency. Ideal for MVPs, growing products, interface refactors and when you want to professionalise the product before scaling.",
        "es": "Cuando necesitas aumentar conversi\u00f3n, mejorar retenci\u00f3n, reducir soporte y crear consistencia visual. Ideal para MVPs, productos en crecimiento, refactors de interfaz y cuando quieres profesionalizar el producto antes de escalar."
    },
    {
        "pt": "Uma experi\u00eancia clara e uma interface premium aumentam confian\u00e7a, reduzem abandono e ajudam o utilizador a chegar mais r\u00e1pido ao 'Aha moment'.",
        "en": "A clear experience and premium interface increase trust, reduce abandonment and help users reach the Aha moment faster.",
        "es": "Una experiencia clara y una interfaz premium aumentan confianza, reducen abandono y ayudan al usuario a llegar m\u00e1s r\u00e1pido al Aha moment."
    },
    {
        "pt": "Menos confus\u00e3o = menos suporte. Um design consistente reduz retrabalho, acelera desenvolvimento e facilita onboarding da equipa.",
        "en": "Less confusion means less support. Consistent design reduces rework, accelerates development and makes team onboarding easier.",
        "es": "Menos confusi\u00f3n significa menos soporte. Un dise\u00f1o consistente reduce retrabajo, acelera desarrollo y facilita onboarding del equipo."
    },
    {
        "pt": "Come\u00e7amos por entender objetivos, utilizadores, concorr\u00eancia e m\u00e9tricas. Definimos fluxos principais, prioridades e requisitos \u2014 para garantir foco no que move o produto.",
        "en": "We start by understanding goals, users, competition and metrics. We define main flows, priorities and requirements to ensure focus on what moves the product.",
        "es": "Empezamos entendiendo objetivos, usuarios, competencia y m\u00e9tricas. Definimos flujos principales, prioridades y requisitos para garantizar foco en lo que mueve el producto."
    },
    {
        "pt": "Criamos a estrutura e os fluxos (user journeys) para validares l\u00f3gica e navega\u00e7\u00e3o. Reduz altera\u00e7\u00f5es tardias e aumenta velocidade no UI.",
        "en": "We create the structure and flows (user journeys) so you can validate logic and navigation. This reduces late changes and increases UI speed.",
        "es": "Creamos la estructura y los flujos (user journeys) para validar l\u00f3gica y navegaci\u00f3n. Reduce cambios tard\u00edos y aumenta velocidad en UI."
    },
    {
        "pt": "Criamos o visual final (UI) e um design system consistente (componentes, estados, tokens). Produto mais premium e desenvolvimento mais r\u00e1pido.",
        "en": "We create the final UI and a consistent design system (components, states, tokens). A more premium product and faster development.",
        "es": "Creamos el visual final (UI) y un design system consistente (componentes, estados, tokens). Producto m\u00e1s premium y desarrollo m\u00e1s r\u00e1pido."
    },
    {
        "pt": "Entregamos specs prontas para dev (Figma, medidas, intera\u00e7\u00f5es) e fazemos QA para garantir que o que vai para produ\u00e7\u00e3o mant\u00e9m qualidade e consist\u00eancia.",
        "en": "We deliver dev-ready specs (Figma, measurements, interactions) and run QA to ensure what goes to production keeps quality and consistency.",
        "es": "Entregamos specs listas para dev (Figma, medidas, interacciones) y hacemos QA para garantizar que lo que va a producci\u00f3n mantiene calidad y consistencia."
    },
    {
        "pt": "Desenhamos uma experi\u00eancia mais clara, bonita e eficiente \u2014 com um sistema pronto para escalar e acelerar desenvolvimento.",
        "en": "We design a clearer, more beautiful and efficient experience, with a system ready to scale and accelerate development.",
        "es": "Dise\u00f1amos una experiencia m\u00e1s clara, bonita y eficiente, con un sistema listo para escalar y acelerar desarrollo."
    },
    {
        "pt": "Onde frameworks Lean e inova\u00e7\u00e3o de produto se juntam com excel\u00eancia t\u00e9cnica para construir software r\u00e1pido, robusto e escal\u00e1vel.",
        "en": "Where Lean frameworks and product innovation meet technical excellence to build fast, robust and scalable software.",
        "es": "Donde frameworks Lean e innovaci\u00f3n de producto se unen con excelencia t\u00e9cnica para construir software r\u00e1pido, robusto y escalable."
    },
    {
        "pt": "Desde setup de infraestrutura a features avan\u00e7adas \u2014 micro-servi\u00e7os, seguran\u00e7a e observabilidade. Uma base s\u00f3lida para crescer.",
        "en": "From infrastructure setup to advanced features, microservices, security and observability. A solid base to grow.",
        "es": "Desde setup de infraestructura hasta features avanzadas, microservicios, seguridad y observabilidad. Una base s\u00f3lida para crecer."
    },
    {
        "pt": "Ligamos sistemas, automatizamos fluxos e reduzimos trabalho manual com integra\u00e7\u00f5es robustas e f\u00e1ceis de manter.",
        "en": "We connect systems, automate flows and reduce manual work with robust, easy-to-maintain integrations.",
        "es": "Conectamos sistemas, automatizamos flujos y reducimos trabajo manual con integraciones robustas y f\u00e1ciles de mantener."
    },
    {
        "pt": "Bases de dados, pipelines e integra\u00e7\u00f5es para garantir performance, consist\u00eancia e escalabilidade em cen\u00e1rios exigentes.",
        "en": "Databases, pipelines and integrations to ensure performance, consistency and scalability in demanding scenarios.",
        "es": "Bases de datos, pipelines e integraciones para garantizar rendimiento, consistencia y escalabilidad en escenarios exigentes."
    },
    {
        "pt": "Adotamos uma abordagem hol\u00edstica e centrada no utilizador: alinhamos objetivos de neg\u00f3cio, prioridades e UX antes de acelerar na execu\u00e7\u00e3o. Depois, as nossas equipas de UX/UI e desenvolvimento constroem o produto com qualidade, documenta\u00e7\u00e3o e previsibilidade \u2014 usando frameworks Lean e metodologias \u00e1geis para maximizar valor e minimizar desperd\u00edcio.",
        "en": "We adopt a holistic, user-centred approach: we align business goals, priorities and UX before accelerating execution. Then our UX/UI and development teams build the product with quality, documentation and predictability, using Lean frameworks and agile methods to maximise value and minimise waste.",
        "es": "Adoptamos un enfoque hol\u00edstico y centrado en el usuario: alineamos objetivos de negocio, prioridades y UX antes de acelerar la ejecuci\u00f3n. Despu\u00e9s, nuestros equipos de UX/UI y desarrollo construyen el producto con calidad, documentaci\u00f3n y previsibilidad, usando frameworks Lean y metodolog\u00edas \u00e1giles para maximizar valor y minimizar desperdicio."
    },
    {
        "pt": "Estes Termos e Condi\u00e7\u00f5es regulam o acesso e a utiliza\u00e7\u00e3o do website da Cobrait, bem como a rela\u00e7\u00e3o inicial de contacto comercial atrav\u00e9s dos formul\u00e1rios dispon\u00edveis.",
        "en": "These Terms and Conditions govern access to and use of the Cobrait website, as well as the initial commercial contact relationship through the available forms.",
        "es": "Estos T\u00e9rminos y Condiciones regulan el acceso y uso del sitio web de Cobrait, as\u00ed como la relaci\u00f3n inicial de contacto comercial mediante los formularios disponibles."
    },
    {
        "pt": "\u00c9 proibido introduzir conte\u00fado malicioso, tentar aceder a \u00e1reas restritas ou comprometer a seguran\u00e7a da plataforma.",
        "en": "It is forbidden to introduce malicious content, try to access restricted areas or compromise platform security.",
        "es": "Est\u00e1 prohibido introducir contenido malicioso, intentar acceder a \u00e1reas restringidas o comprometer la seguridad de la plataforma."
    },
    {
        "pt": "A Cobrait pode limitar ou suspender o acesso em caso de uso abusivo.",
        "en": "Cobrait may limit or suspend access in cases of abusive use.",
        "es": "Cobrait puede limitar o suspender el acceso en caso de uso abusivo."
    },
    {
        "pt": "Marcas, design, c\u00f3digo, texto e restantes conte\u00fados est\u00e3o protegidos por direitos de propriedade intelectual e industrial.",
        "en": "Brands, design, code, text and other content are protected by intellectual and industrial property rights.",
        "es": "Marcas, dise\u00f1o, c\u00f3digo, texto y dem\u00e1s contenidos est\u00e1n protegidos por derechos de propiedad intelectual e industrial."
    },
    {
        "pt": "A reprodu\u00e7\u00e3o total ou parcial sem autoriza\u00e7\u00e3o pr\u00e9via \u00e9 proibida, exceto nos casos permitidos por lei.",
        "en": "Total or partial reproduction without prior authorisation is prohibited, except in cases allowed by law.",
        "es": "La reproducci\u00f3n total o parcial sin autorizaci\u00f3n previa est\u00e1 prohibida, salvo en los casos permitidos por ley."
    },
    {
        "pt": "A Cobrait envida esfor\u00e7os para manter o website atualizado e dispon\u00edvel, mas n\u00e3o garante aus\u00eancia total de interrup\u00e7\u00f5es, erros ou indisponibilidade tempor\u00e1ria.",
        "en": "Cobrait makes efforts to keep the website updated and available, but does not guarantee total absence of interruptions, errors or temporary unavailability.",
        "es": "Cobrait realiza esfuerzos para mantener el sitio actualizado y disponible, pero no garantiza ausencia total de interrupciones, errores o indisponibilidad temporal."
    },
    {
        "pt": "Nenhuma informa\u00e7\u00e3o presente no website constitui proposta contratual vinculativa por si s\u00f3.",
        "en": "No information on the website constitutes a binding contractual proposal by itself.",
        "es": "Ninguna informaci\u00f3n presente en el sitio web constituye por s\u00ed sola una propuesta contractual vinculante."
    },
    {
        "pt": "Este website pode incluir liga\u00e7\u00f5es para p\u00e1ginas externas. A Cobrait n\u00e3o controla nem se responsabiliza pelo conte\u00fado, pol\u00edticas ou pr\u00e1ticas desses websites.",
        "en": "This website may include links to external pages. Cobrait does not control or take responsibility for the content, policies or practices of those websites.",
        "es": "Este sitio web puede incluir enlaces a p\u00e1ginas externas. Cobrait no controla ni se responsabiliza del contenido, pol\u00edticas o pr\u00e1cticas de esos sitios."
    },
    {
        "pt": "Podemos atualizar estes Termos a qualquer momento. A vers\u00e3o publicada nesta p\u00e1gina \u00e9 a vers\u00e3o em vigor.",
        "en": "We may update these Terms at any time. The version published on this page is the current version.",
        "es": "Podemos actualizar estos T\u00e9rminos en cualquier momento. La versi\u00f3n publicada en esta p\u00e1gina es la versi\u00f3n vigente."
    },
    {
        "pt": "A rela\u00e7\u00e3o jur\u00eddica \u00e9 regida pela legisla\u00e7\u00e3o portuguesa, sem preju\u00edzo de normas imperativas aplic\u00e1veis.",
        "en": "The legal relationship is governed by Portuguese law, without prejudice to applicable mandatory rules.",
        "es": "La relaci\u00f3n jur\u00eddica se rige por la legislaci\u00f3n portuguesa, sin perjuicio de normas imperativas aplicables."
    }
];
  var VALUE_TRANSLATIONS = [
    {
        "pt": "15-20 dias",
        "en": "15-20 days",
        "es": "15-20 d\u00edas"
    },
    {
        "pt": "EUR 1k\u20135k",
        "en": "EUR 1k\u20135k",
        "es": "EUR 1k\u20135k"
    },
    {
        "pt": "EUR 5k\u201315k",
        "en": "EUR 5k\u201315k",
        "es": "EUR 5k\u201315k"
    },
    {
        "pt": "EUR 15k\u201350k",
        "en": "EUR 15k\u201350k",
        "es": "EUR 15k\u201350k"
    },
    {
        "pt": "EUR 50k+",
        "en": "EUR 50k+",
        "es": "EUR 50k+"
    }
];
  var MEGA_MENU_TRANSLATIONS = [
    {
      pt: "Processo de 15 dias para alinhar produto e neg\u00f3cio.",
      en: "15-day process to align product and business.",
      es: "Proceso de 15 d\u00edas para alinear producto y negocio."
    },
    {
      pt: "Entra no mercado rapidamente com um MVP de qualidade.",
      en: "Enter the market quickly with a quality MVP.",
      es: "Entra al mercado r\u00e1pidamente con un MVP de calidad."
    },
    {
      pt: "Design de produtos f\u00e1ceis de usar, envolventes e funcionais.",
      en: "Design for products that are easy to use, engaging and functional.",
      es: "Dise\u00f1o de productos f\u00e1ciles de usar, atractivos y funcionales."
    },
    {
      pt: "Frameworks lean aplicados \u00e0 tua vis\u00e3o de produto.",
      en: "Lean frameworks applied to your product vision.",
      es: "Frameworks lean aplicados a tu visi\u00f3n de producto."
    },
    {
      pt: "Constr\u00f3i o teu produto com uma equipa dedicada de devs.",
      en: "Build your product with a dedicated dev team.",
      es: "Construye tu producto con un equipo dedicado de devs."
    },
    {
      pt: "Come\u00e7ar r\u00e1pido",
      en: "Start fast",
      es: "Empezar r\u00e1pido"
    },
    {
      pt: "Em 10-15 dias alinhamos objetivos, definimos o roadmap e validamos a tua ideia tecnicamente.",
      en: "In 10-15 days we align goals, define the roadmap and technically validate your idea.",
      es: "En 10-15 d\u00edas alineamos objetivos, definimos el roadmap y validamos tu idea t\u00e9cnicamente."
    }
  ];
  var BLOCK_TRANSLATIONS = [
    {
      pt: "Cobrait \u00b7 Sobre n\u00f3s",
      en: "Cobrait \u00b7 About us",
      es: "Cobrait \u00b7 Sobre nosotros"
    },
    {
      pt: "Constru\u00edmos produtos com clareza, foco e execu\u00e7\u00e3o.",
      en: "We build products with clarity, focus and execution.",
      es: "Construimos productos con claridad, foco y ejecuci\u00f3n.",
      html: {
        pt: "Constru\u00edmos produtos<br class=\"hidden md:block\"> com clareza, foco<br class=\"hidden md:block\"> e <em class=\"italic gradient-text font-normal\">execu\u00e7\u00e3o</em>.",
        en: "We build products<br class=\"hidden md:block\"> with clarity, focus<br class=\"hidden md:block\"> and <em class=\"italic gradient-text font-normal\">execution</em>.",
        es: "Construimos productos<br class=\"hidden md:block\"> con claridad, foco<br class=\"hidden md:block\"> y <em class=\"italic gradient-text font-normal\">ejecuci\u00f3n</em>."
      }
    },
    {
      pt: "Software factory portuguesa. Trabalhamos contigo para definir prioridades, desenhar bem e construir com qualidade \u2014 sem complica\u00e7\u00f5es.",
      en: "Portuguese software factory. We work with you to define priorities, design well and build with quality, without complications.",
      es: "Software factory portuguesa. Trabajamos contigo para definir prioridades, dise\u00f1ar bien y construir con calidad, sin complicaciones."
    },
    { pt: "Abordagem", en: "Approach", es: "Enfoque" },
    { pt: "Foco", en: "Focus", es: "Foco" },
    { pt: "Engenharia", en: "Engineering", es: "Ingenier\u00eda" },
    { pt: "Clean & escal\u00e1vel", en: "Clean & scalable", es: "Limpio y escalable" },
    { pt: "Manifesto", en: "Manifesto", es: "Manifiesto" },
    {
      pt: "Ol\u00e1, somos a Cobra IT.",
      en: "Hi, we are Cobra IT.",
      es: "Hola, somos Cobra IT.",
      html: {
        pt: "Ol\u00e1, somos a<br><em class=\"italic text-primary/90\">Cobra IT</em>.",
        en: "Hi, we are<br><em class=\"italic text-primary/90\">Cobra IT</em>.",
        es: "Hola, somos<br><em class=\"italic text-primary/90\">Cobra IT</em>."
      }
    },
    {
      pt: "Pensamos como product owners \u2014 n\u00e3o apenas como executantes. Cada decis\u00e3o \u00e9 tomada com o teu neg\u00f3cio em mente, e cada linha de c\u00f3digo pesa contra o que mais importa: o produto chegar a quem precisa dele.",
      en: "We think like product owners, not just executors. Every decision is made with your business in mind, and every line of code is weighed against what matters most: getting the product to the people who need it.",
      es: "Pensamos como product owners, no solo como ejecutores. Cada decisi\u00f3n se toma pensando en tu negocio, y cada l\u00ednea de c\u00f3digo se mide contra lo que m\u00e1s importa: que el producto llegue a quien lo necesita."
    },
    { pt: "Produto + engenharia, sob um \u00fanico parceiro.", en: "Product + engineering under one partner.", es: "Producto + ingenier\u00eda en un \u00fanico socio." },
    { pt: "Caminho mais curto entre ideia e tra\u00e7\u00e3o.", en: "The shortest path between idea and traction.", es: "El camino m\u00e1s corto entre idea y tracci\u00f3n." },
    { pt: "Discovery \u00b7 Build \u00b7 Iterate.", en: "Discovery \u00b7 Build \u00b7 Iterate.", es: "Discovery \u00b7 Build \u00b7 Iterate." },
    { pt: "Discovery \u2014 clareza primeiro", en: "Discovery, clarity first", es: "Discovery, claridad primero" },
    { pt: "Build \u2014 entrega cont\u00ednua", en: "Build, continuous delivery", es: "Build, entrega continua" },
    { pt: "Iterate \u2014 melhorar com dados", en: "Iterate, improve with data", es: "Iterate, mejorar con datos" },
    { pt: "O que nos move todos os dias.", en: "What drives us every day.", es: "Lo que nos mueve cada d\u00eda." },
    { pt: "Produto real \u2014 pronto a crescer.", en: "Real product, ready to grow.", es: "Producto real, listo para crecer." },
    { pt: "Velocidade + qualidade.", en: "Speed + quality.", es: "Velocidad + calidad." },
    { pt: "Pronto para come\u00e7ar?", en: "Ready to start?", es: "\u00bfListo para empezar?" },
    { pt: "Conta-nos o que queres construir e respondemos em 24-48h com um plano claro.", en: "Tell us what you want to build and we reply within 24-48h with a clear plan.", es: "Cu\u00e9ntanos qu\u00e9 quieres construir y respondemos en 24-48h con un plan claro." },
    { pt: "Ver tecnologia \u2192", en: "See technology \u2192", es: "Ver tecnolog\u00eda \u2192" },
    {
      pt: "Cobrait \u00b7 Tecnologia",
      en: "Cobrait \u00b7 Technology",
      es: "Cobrait \u00b7 Tecnolog\u00eda"
    },
    {
      pt: "A tecnologia por tr\u00e1s das nossas solu\u00e7\u00f5es de \u00faltima gera\u00e7\u00e3o.",
      en: "The technology behind our next-generation solutions.",
      es: "La tecnolog\u00eda detr\u00e1s de nuestras soluciones de \u00faltima generaci\u00f3n.",
      html: {
        pt: "A tecnologia por tr\u00e1s das nossas solu\u00e7\u00f5es de <em class=\"italic gradient-text font-normal\">\u00faltima gera\u00e7\u00e3o</em>.",
        en: "The technology behind our <em class=\"italic gradient-text font-normal\">next-generation</em> solutions.",
        es: "La tecnolog\u00eda detr\u00e1s de nuestras soluciones de <em class=\"italic gradient-text font-normal\">\u00faltima generaci\u00f3n</em>."
      }
    },
    {
      pt: "Onde frameworks Lean e inova\u00e7\u00e3o de produto se juntam com excel\u00eancia t\u00e9cnica para construir software r\u00e1pido, robusto e escal\u00e1vel.",
      en: "Where Lean frameworks and product innovation meet technical excellence to build fast, robust and scalable software.",
      es: "Donde los frameworks Lean y la innovaci\u00f3n de producto se unen con excelencia t\u00e9cnica para construir software r\u00e1pido, robusto y escalable."
    },
    { pt: "Moderna", en: "Modern", es: "Moderna" },
    { pt: "Otimizada", en: "Optimized", es: "Optimizada" },
    { pt: "Arquitetura", en: "Architecture", es: "Arquitectura" },
    { pt: "Seguran\u00e7a", en: "Security", es: "Seguridad" },
    { pt: "By design", en: "By design", es: "By design" },
    { pt: "O nosso toolkit", en: "Our toolkit", es: "Nuestro toolkit" },
    { pt: "Toolkit tech num instante.", en: "Tech toolkit at a glance.", es: "Toolkit tech de un vistazo." },
    {
      pt: "Analisamos a fundo as necessidades do teu projeto para escolher as melhores ferramentas e frameworks. A maioria encaixa num stack semelhante ao abaixo.",
      en: "We deeply analyze your project's needs to choose the best tools and frameworks. Most projects fit into a stack similar to the one below.",
      es: "Analizamos a fondo las necesidades de tu proyecto para elegir las mejores herramientas y frameworks. La mayor\u00eda encaja en un stack similar al de abajo."
    },
    { pt: "Back-end & Bases de Dados", en: "Back-end & Databases", es: "Back-end y Bases de Datos" },
    { pt: "Infraestrutura", en: "Infrastructure", es: "Infraestructura" },
    { pt: "Interfaces modernas, r\u00e1pidas e consistentes em qualquer device.", en: "Modern, fast and consistent interfaces on any device.", es: "Interfaces modernas, r\u00e1pidas y consistentes en cualquier dispositivo." },
    { pt: "APIs robustas, escal\u00e1veis e bem testadas, com persist\u00eancia de confian\u00e7a.", en: "Robust, scalable and well-tested APIs with reliable persistence.", es: "APIs robustas, escalables y bien probadas, con persistencia confiable." },
    { pt: "Cloud, orquestra\u00e7\u00e3o e mensageria \u2014 bases s\u00f3lidas para escalar.", en: "Cloud, orchestration and messaging, solid foundations for scaling.", es: "Cloud, orquestaci\u00f3n y mensajer\u00eda, bases s\u00f3lidas para escalar." },
    { pt: "Onde somos fortes", en: "Where we are strong", es: "Donde somos fuertes" },
    { pt: "\u00c1reas onde entregamos mais.", en: "Areas where we deliver most.", es: "\u00c1reas donde entregamos m\u00e1s." },
    { pt: "Aplica\u00e7\u00f5es Full-Stack", en: "Full-stack applications", es: "Aplicaciones full-stack" },
    { pt: "Integra\u00e7\u00f5es e Automa\u00e7\u00e3o", en: "Integrations and automation", es: "Integraciones y automatizaci\u00f3n" },
    { pt: "Produtos orientados a dados", en: "Data-driven products", es: "Productos orientados a datos" },
    { pt: "Experi\u00eancias mobile r\u00e1pidas e consistentes, com performance e UX/UI orientadas a reten\u00e7\u00e3o e convers\u00e3o.", en: "Fast and consistent mobile experiences, with performance and UX/UI focused on retention and conversion.", es: "Experiencias mobile r\u00e1pidas y consistentes, con performance y UX/UI orientadas a retenci\u00f3n y conversi\u00f3n." },
    { pt: "Desenvolvimento \u00e0 medida.", en: "Custom development.", es: "Desarrollo a medida." },
    {
      pt: "Abordagem hol\u00edstica e centrada no utilizador: alinhamos objetivos, prioridades e UX antes de acelerar. Depois, as equipas de UX/UI e desenvolvimento constroem com qualidade, documenta\u00e7\u00e3o e previsibilidade \u2014 Lean e \u00e1gil para maximizar valor.",
      en: "A holistic, user-centered approach: we align goals, priorities and UX before accelerating. Then UX/UI and development teams build with quality, documentation and predictability, Lean and agile to maximize value.",
      es: "Un enfoque hol\u00edstico y centrado en el usuario: alineamos objetivos, prioridades y UX antes de acelerar. Despu\u00e9s, los equipos de UX/UI y desarrollo construyen con calidad, documentaci\u00f3n y previsibilidad, Lean y \u00e1gil para maximizar valor."
    },
    { pt: "Discovery & Valida\u00e7\u00e3o", en: "Discovery & validation", es: "Discovery y validaci\u00f3n" },
    { pt: "Design & Prototipagem", en: "Design & prototyping", es: "Dise\u00f1o y prototipado" },
    { pt: "Desenvolvimento \u00c1gil", en: "Agile development", es: "Desarrollo \u00e1gil" },
    { pt: "QA & Testes Cont\u00ednuos", en: "QA & continuous testing", es: "QA y pruebas continuas" },
    { pt: "DevOps & Entrega", en: "DevOps & delivery", es: "DevOps y entrega" },
    { pt: "Suporte & Evolu\u00e7\u00e3o", en: "Support & evolution", es: "Soporte y evoluci\u00f3n" },
    { pt: "Tens a stack certa para o teu produto?", en: "Do you have the right stack for your product?", es: "\u00bfTienes el stack adecuado para tu producto?" },
    { pt: "Conversa com a nossa equipa t\u00e9cnica e validamos a melhor abordagem para o teu caso.", en: "Talk to our technical team and we will validate the best approach for your case.", es: "Habla con nuestro equipo t\u00e9cnico y validamos el mejor enfoque para tu caso." },
    { pt: "Saber mais sobre n\u00f3s \u2192", en: "Learn more about us \u2192", es: "Saber m\u00e1s sobre nosotros \u2192" }
  ];

  function normalizeLang(value) {
    var lang = String(value || "").toLowerCase().slice(0, 2);
    return LANGS.some(function (item) { return item.code === lang; }) ? lang : "pt";
  }

  function normalizePhrase(value) {
    var normalized = String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\s+([.,;:!?])/g, "$1")
      .trim()
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-");
    if (normalized.normalize) {
      normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return normalized;
  }

  function registerPhrase(set) {
    ["pt", "en", "es"].forEach(function (lang) {
      if (set[lang]) phraseMap[normalizePhrase(set[lang])] = set;
    });
  }

  PHRASE_TRANSLATIONS.forEach(registerPhrase);
  PROJECT_TRANSLATIONS.forEach(registerPhrase);
  ADDITIONAL_TRANSLATIONS.forEach(registerPhrase);
  FINAL_TRANSLATIONS.forEach(registerPhrase);
  CLOSING_TRANSLATIONS.forEach(registerPhrase);
  VALUE_TRANSLATIONS.forEach(registerPhrase);
  MEGA_MENU_TRANSLATIONS.forEach(registerPhrase);
  BLOCK_TRANSLATIONS.forEach(registerPhrase);

  [
    "Cobrait", "Cobra IT", "Product Scope", "MVP Builder", "UX / UI", "UX/UI", "Software", "Porto HQ",
    "PT", "EN", "ES", "IP", "FLEX", "EDGE", "SCALE", "ROI", "UX", "QA", "UAT", "QA + UAT", "FAQ",
    "Core", "Build", "Review", "Ready", "Delivery", "Development", "Onboarding", "Wireframes",
    "React, Next.js, design system", "Node.js, APIs, integrations", "QA & Support",
    "Quality checks, release flow", "Remote-first", "Weekly sync", "Fast ramp-up",
    "User Stories", "Sitemap", "Stakeholder Analysis", "Tech Spike", "Key BPMN", "UX Personas",
    "Key Screens", "UI Concept", "User Flow", "Design System", "Component Library",
    "All Screens", "Full Product UX/UI", "Responsive states", "Design QA checklist",
    "Handover specs", "Progressive module delivery", "Ongoing testing & feedback",
    "Codebase documentation", "Regular progress updates", "Bug reports & fixes",
    "Final QA", "User acceptance testing (UAT)", "Launch readiness sign-off",
    "Launch readiness", "Go-to-market", "Design + Dev", "Front-end", "Full-stack",
    "1 backlog MVP", "Roadmap + budget", "Stakeholder alignment", "MVP", "Builder", "Product",
    "FS", "OPS", "DB", "AWS", "React", "Vue", "Angular", "Next.js", "single-spa", "Alpine.js",
    "Node.js", "Express", "NestJS", "Python", "FastAPI", "MongoDB", "PostgreSQL", "Redis",
    "Google Cloud", "Microsoft Azure", "Digital Ocean", "Kubernetes", "Red Hat", "RabbitMQ",
    "Cloudflare", "Mobile (iOS & Android)", "EUR 1k–5k", "EUR 5k–15k",
    "EUR 15k–50k", "EUR 50k+", "R. Eng Ferreira Dias 161", "R. Eng Ferreira Dias 161,",
    "4100-247 Porto", "4100-247 Porto · Portugal", "R. Eng Ferreira Dias 161 · Porto",
    "geral@cobrait.pt", "@cobra_it"
  ].forEach(function (value) {
    if (!phraseMap[normalizePhrase(value)]) {
      registerPhrase({ pt: value, en: value, es: value });
    }
  });

  function extractVisibleText(html) {
    if (!html || typeof DOMParser === "undefined") return [];

    var doc = new DOMParser().parseFromString(String(html), "text/html");
    var walker = doc.createTreeWalker(doc.body || doc, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "TEMPLATE"].indexOf(parent.tagName) >= 0) {
          return NodeFilter.FILTER_REJECT;
        }
        var value = String(node.nodeValue || "").replace(/\s+/g, " ").trim();
        return value && value.length > 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var result = [];
    var node = walker.nextNode();
    while (node) {
      result.push(String(node.nodeValue || "").replace(/\s+/g, " ").trim());
      node = walker.nextNode();
    }
    return result;
  }

  function loadTemplateTranslations() {
    if (templateTranslationsPromise) return templateTranslationsPromise;
    if (!window.fetch || typeof Function === "undefined") {
      templateTranslationsPromise = Promise.resolve();
      return templateTranslationsPromise;
    }

    templateTranslationsPromise = fetch("/assets/js/mobile-preview.js", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("mobile-preview.js unavailable");
        return response.text();
      })
      .then(function (source) {
        var start = source.indexOf("const TEMPLATES =");
        var end = source.indexOf("const ROUTES =", start);
        if (start < 0 || end < 0) return;

        var objectText = source
          .slice(start, end)
          .replace(/^const TEMPLATES\s*=\s*/, "")
          .replace(/;\s*$/, "");
        var templates = Function("\"use strict\";return (" + objectText + ");")();
        if (!templates || !templates.pt) return;

        Object.keys(templates.pt).forEach(function (routeKey) {
          var texts = {
            pt: extractVisibleText(templates.pt && templates.pt[routeKey]),
            en: extractVisibleText(templates.en && templates.en[routeKey]),
            es: extractVisibleText(templates.es && templates.es[routeKey])
          };
          var length = Math.max(texts.pt.length, texts.en.length, texts.es.length);
          for (var index = 0; index < length; index += 1) {
            registerPhrase({
              pt: texts.pt[index],
              en: texts.en[index],
              es: texts.es[index]
            });
          }
        });

        var titleStart = source.indexOf("const TITLES =");
        var titleEnd = source.indexOf("const LANGUAGE_LABELS =", titleStart);
        if (titleStart >= 0 && titleEnd > titleStart) {
          var titleText = source
            .slice(titleStart, titleEnd)
            .replace(/^const TITLES\s*=\s*/, "")
            .replace(/;\s*$/, "");
          var titles = Function("\"use strict\";return (" + titleText + ");")();
          if (titles && titles.pt) {
            Object.keys(titles.pt).forEach(function (routeKey) {
              registerPhrase({
                pt: titles.pt[routeKey],
                en: titles.en && titles.en[routeKey],
                es: titles.es && titles.es[routeKey]
              });
            });
          }
        }
      })
      .catch(function () {
        // The static phrase list still keeps the selector usable if the preview bundle is unavailable.
      });

    return templateTranslationsPromise;
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

  function getUrlLang() {
    try {
      return new URLSearchParams(window.location.search).get("lang");
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
    var badge = button.querySelector("[data-nebula-lang-badge]");
    var flag = findFlagSpan(button);

    if (code) code.textContent = meta.label;
    if (badge) badge.textContent = meta.label;
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
      window.dispatchEvent(new CustomEvent("cobrait-set-language", { detail: lang }));
    } catch (error) {
      var event = document.createEvent("CustomEvent");
      event.initCustomEvent("cobrait-set-language", true, true, lang);
      window.dispatchEvent(event);
    }
  }

  function getPhraseSet(value) {
    return phraseMap[normalizePhrase(value)];
  }

  function translateBlockElement(element, lang) {
    if (!element || !element.textContent) return;
    var set = getPhraseSet(element.textContent);
    if (!set || !set[lang]) return;

    var originalKey = "nebulaOriginalBlock";
    if (element.dataset && !element.dataset[originalKey]) {
      element.dataset[originalKey] = element.innerHTML;
    }

    if (set.html && set.html[lang]) {
      element.innerHTML = set.html[lang];
      return;
    }

    element.textContent = set[lang];
  }

  function applyBlockTranslations(lang, root) {
    var scanRoot = root || document.body;
    if (!scanRoot || !scanRoot.querySelectorAll) return;
    var nodes = scanRoot.querySelectorAll("h1, h2, h3, p, span, strong, em, li, button, a");

    Array.prototype.forEach.call(nodes, function (element) {
      if (element.closest && element.closest("script, style, noscript, svg, template")) return;
      if (element.querySelector && element.querySelector("svg, img, input, select, textarea")) return;
      translateBlockElement(element, lang);
    });
  }

  function applyFallbackPhrases(lang, root) {
    var normalized = normalizeLang(lang);
    var scanRoot = root || document.body;
    if (!scanRoot) return;

    applyBlockTranslations(normalized, scanRoot);

    var walker = document.createTreeWalker(scanRoot, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "TEMPLATE"].indexOf(parent.tagName) >= 0) {
          return NodeFilter.FILTER_REJECT;
        }
        var set = getPhraseSet(node.nodeValue);
        return set && set[normalized] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var node = walker.nextNode();
    while (node) {
      var original = node.nodeValue || "";
      var leading = (original.match(/^\s*/) || [""])[0];
      var trailing = (original.match(/\s*$/) || [""])[0];
      var set = getPhraseSet(original);
      if (set && set[normalized]) node.nodeValue = leading + set[normalized] + trailing;
      node = walker.nextNode();
    }

    applyFallbackAttributes(normalized, scanRoot);
    applyDocumentMeta(normalized);
  }

  function translateString(value, lang) {
    var set = getPhraseSet(value);
    return set && set[lang] ? set[lang] : null;
  }

  function queryWithin(root, selector) {
    if (!root || !root.querySelectorAll) return [];
    return root.querySelectorAll(selector);
  }

  function applyFallbackAttributes(lang, root) {
    var attributes = ["aria-label", "title", "placeholder", "value", "alt"];
    var nodes = queryWithin(root || document, "input, textarea, button, a, img, [aria-label], [title], [placeholder], [alt]");

    Array.prototype.forEach.call(nodes, function (element) {
      attributes.forEach(function (attribute) {
        if (!element.hasAttribute(attribute)) return;
        if (attribute === "value" && !/^(button|submit|reset)$/i.test(element.getAttribute("type") || "")) return;

        var originalKey = "nebulaOriginal" + attribute.replace(/[^a-z0-9]/gi, "");
        var original = element.dataset && element.dataset[originalKey]
          ? element.dataset[originalKey]
          : element.getAttribute(attribute);
        if (!original) return;
        if (element.dataset && !element.dataset[originalKey]) element.dataset[originalKey] = original;

        var translated = translateString(original, lang);
        if (translated) element.setAttribute(attribute, translated);
      });
    });
  }

  function applyDocumentMeta(lang) {
    var title = document.querySelector("title");
    if (title) {
      if (!title.getAttribute("data-nebula-original")) {
        title.setAttribute("data-nebula-original", title.textContent || "");
      }
      var titleSource = title.getAttribute("data-nebula-original") || title.textContent || "";
      var translatedTitle = translateString(titleSource, lang) || translateString(title.textContent || "", lang);
      if (translatedTitle) {
        title.textContent = translatedTitle;
        document.title = translatedTitle;
      }
    }

    var metas = document.querySelectorAll("meta[content][name], meta[content][property]");
    Array.prototype.forEach.call(metas, function (meta) {
      var key = (meta.getAttribute("name") || meta.getAttribute("property") || "").toLowerCase();
      if (["description", "og:title", "og:description", "twitter:title", "twitter:description"].indexOf(key) < 0) return;
      if (!meta.getAttribute("data-nebula-original")) {
        meta.setAttribute("data-nebula-original", meta.getAttribute("content") || "");
      }
      var source = meta.getAttribute("data-nebula-original") || meta.getAttribute("content") || "";
      var translated = translateString(source, lang) || translateString(meta.getAttribute("content") || "", lang);
      if (translated) meta.setAttribute("content", translated);
    });
  }

  function stopLanguageObserver() {
    if (languageObserver) languageObserver.disconnect();
  }

  function startLanguageObserver() {
    if (!window.MutationObserver || !document.body || !isDesktopViewport()) return;
    if (!languageObserver) {
      languageObserver = new MutationObserver(function () {
        clearTimeout(languageRefreshTimer);
        languageRefreshTimer = window.setTimeout(function () {
          applyLanguageToDocument(activeLanguage);
        }, 40);
      });
    }
    stopLanguageObserver();
    languageObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "title", "placeholder", "value", "alt"]
    });
  }

  function applyLanguageToDocument(lang, root) {
    var normalized = normalizeLang(lang);
    stopLanguageObserver();
    applyFallbackPhrases(normalized, root || document.body);
    startLanguageObserver();
  }

  function ensureServicesMegaStyles() {
    if (document.querySelector("style[data-cobrait-services-mega]")) return;

    var style = document.createElement("style");
    style.setAttribute("data-cobrait-services-mega", "true");
    style.textContent = [
      "@media (min-width: 768px){",
      ".cobrait-services-mega-shell{position:relative}",
      ".cobrait-services-mega-shell>button{cursor:pointer}",
      ".cobrait-services-mega-shell.cobrait-services-mega-open>button{background:rgba(255,255,255,.08);color:#fff}",
      ".cobrait-services-mega-shell>.cobrait-services-mega-native{pointer-events:none}",
      ".cobrait-services-mega-shell:hover>.cobrait-services-mega-native,.cobrait-services-mega-shell:focus-within>.cobrait-services-mega-native,.cobrait-services-mega-shell.cobrait-services-mega-open>.cobrait-services-mega-native{visibility:visible!important;opacity:1!important;pointer-events:auto!important}",
      ".cobrait-services-mega{position:absolute;left:50%;top:calc(100% + 14px);z-index:80;width:min(920px,calc(100vw - 48px));transform:translateX(-50%) translateY(-8px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .18s ease,transform .18s ease,visibility .18s ease}",
      ".cobrait-services-mega-shell:hover .cobrait-services-mega,.cobrait-services-mega-shell:focus-within .cobrait-services-mega,.cobrait-services-mega-shell.cobrait-services-mega-open .cobrait-services-mega{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}",
      ".cobrait-services-mega__panel{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 360px;overflow:hidden;border:1px solid rgba(255,255,255,.08);border-radius:28px;background:linear-gradient(135deg,rgba(9,9,24,.96),rgba(11,10,28,.94));box-shadow:0 28px 80px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.05);backdrop-filter:blur(26px)}",
      ".cobrait-services-mega__panel:before{content:\"\";position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.08) 1px,transparent 1px);background-size:22px 22px;opacity:.22;pointer-events:none}",
      ".cobrait-services-mega__services{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 36px;padding:34px 38px}",
      ".cobrait-services-mega__item{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;text-decoration:none;color:rgba(255,255,255,.88);outline:none}",
      ".cobrait-services-mega__dot{width:7px;height:7px;margin-top:8px;border-radius:999px;background:#9b6cff;box-shadow:0 0 14px rgba(155,108,255,.75)}",
      ".cobrait-services-mega__title{display:block;font-size:14px;line-height:1.2;font-weight:800;text-transform:uppercase;letter-spacing:.02em;color:#fff}",
      ".cobrait-services-mega__desc{display:block;margin-top:8px;font-size:14px;line-height:1.55;font-weight:600;color:rgba(222,226,255,.68)}",
      ".cobrait-services-mega__item:hover .cobrait-services-mega__title,.cobrait-services-mega__item:focus-visible .cobrait-services-mega__title{color:#b58cff}",
      ".cobrait-services-mega__feature{position:relative;display:block;border-left:1px solid rgba(255,255,255,.08);padding:34px 34px 32px;background:linear-gradient(145deg,rgba(17,17,42,.58),rgba(39,25,82,.3));text-decoration:none}",
      ".cobrait-services-mega__eyebrow{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;color:#a276ff}",
      ".cobrait-services-mega__spark{display:grid;width:30px;height:30px;place-items:center;border-radius:999px;background:rgba(120,86,255,.14);color:#a276ff}",
      ".cobrait-services-mega__heading{display:block;margin-top:22px;font-size:26px;line-height:1.12;font-weight:800;letter-spacing:-.03em;color:#fff}",
      ".cobrait-services-mega__heading em{font-style:italic;color:#a276ff}",
      ".cobrait-services-mega__copy{display:block;margin-top:18px;font-size:14px;line-height:1.6;font-weight:600;color:rgba(222,226,255,.7)}",
      ".cobrait-services-mega__chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:30px}",
      ".cobrait-services-mega__chips span{border:1px solid rgba(255,255,255,.09);border-radius:999px;background:rgba(255,255,255,.035);padding:7px 12px;font-size:12px;line-height:1;color:rgba(222,226,255,.72)}",
      "}",
      "@media (max-width: 767px){.cobrait-services-mega{display:none!important}}"
    ].join("");
    document.head.appendChild(style);
  }

  function createServicesMegaMarkup() {
    return [
      '<div class="cobrait-services-mega__panel">',
      '<div class="cobrait-services-mega__services">',
      '<a class="cobrait-services-mega__item" href="/servicos/product-scope.html"><span class="cobrait-services-mega__dot"></span><span><span class="cobrait-services-mega__title">Product Scope</span><span class="cobrait-services-mega__desc">Processo de 15 dias para alinhar produto e neg\u00f3cio.</span></span></a>',
      '<a class="cobrait-services-mega__item" href="/servicos/mvp-builder.html"><span class="cobrait-services-mega__dot"></span><span><span class="cobrait-services-mega__title">MVP Builder</span><span class="cobrait-services-mega__desc">Entra no mercado rapidamente com um MVP de qualidade.</span></span></a>',
      '<a class="cobrait-services-mega__item" href="/servicos/ux-ui.html"><span class="cobrait-services-mega__dot"></span><span><span class="cobrait-services-mega__title">UX / UI</span><span class="cobrait-services-mega__desc">Design de produtos f\u00e1ceis de usar, envolventes e funcionais.</span></span></a>',
      '<a class="cobrait-services-mega__item" href="/servicos/custom-software.html"><span class="cobrait-services-mega__dot"></span><span><span class="cobrait-services-mega__title">Software \u00e0 Medida</span><span class="cobrait-services-mega__desc">Frameworks lean aplicados \u00e0 tua vis\u00e3o de produto.</span></span></a>',
      '<a class="cobrait-services-mega__item" href="/servicos/dedicated-teams.html"><span class="cobrait-services-mega__dot"></span><span><span class="cobrait-services-mega__title">Equipas Dedicadas</span><span class="cobrait-services-mega__desc">Constr\u00f3i o teu produto com uma equipa dedicada de devs.</span></span></a>',
      '</div>',
      '<a class="cobrait-services-mega__feature" href="/servicos/product-scope.html">',
      '<span class="cobrait-services-mega__eyebrow"><span class="cobrait-services-mega__spark" aria-hidden="true">✣</span><span>Come\u00e7ar r\u00e1pido</span></span>',
      '<span class="cobrait-services-mega__heading">Sprint de <em>Descoberta</em></span>',
      '<span class="cobrait-services-mega__copy">Em 10-15 dias alinhamos objetivos, definimos o roadmap e validamos a tua ideia tecnicamente.</span>',
      '<span class="cobrait-services-mega__chips"><span>Workshops</span><span>Scope</span><span>Roadmap</span></span>',
      '</a>',
      '</div>'
    ].join("");
  }

  function closeServicesMegas(exceptShell) {
    var shells = document.querySelectorAll(".cobrait-services-mega-shell.cobrait-services-mega-open");
    Array.prototype.forEach.call(shells, function (shell) {
      if (exceptShell && shell === exceptShell) return;
      shell.classList.remove("cobrait-services-mega-open");
      var button = shell.querySelector("button");
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }

  function enhanceServicesMega(lang) {
    if (!isDesktopViewport() || !document.body) return;
    ensureServicesMegaStyles();

    var buttons = Array.prototype.slice.call(document.querySelectorAll("nav button"));
    buttons.forEach(function (button, index) {
      var label = normalizePhrase(button.textContent || "");
      if (["servicos", "services", "servicios"].indexOf(label.replace(/\s+/g, " ")) < 0) return;

      var shell = button.parentElement;
      if (!shell) return;
      var existingMenu = shell.querySelector(".cobrait-services-mega") || Array.prototype.filter.call(shell.children, function (child) {
        return child !== button && child.tagName === "DIV";
      })[0];
      if (!existingMenu) return;

      shell.classList.add("cobrait-services-mega-shell");
      button.type = "button";
      button.setAttribute("aria-haspopup", "true");
      button.setAttribute("aria-expanded", shell.classList.contains("cobrait-services-mega-open") ? "true" : "false");
      button.setAttribute("aria-controls", "cobrait-services-mega-" + index);

      existingMenu.id = "cobrait-services-mega-" + index;
      if ((existingMenu.innerHTML || "").indexOf("Sprint de") >= 0 && (existingMenu.className || "").indexOf("w-[860px]") >= 0) {
        existingMenu.classList.add("cobrait-services-mega-native");
      } else {
        existingMenu.className = "cobrait-services-mega";
        existingMenu.innerHTML = createServicesMegaMarkup();
      }

      if (button.dataset.cobraitServicesMegaBound !== "true") {
        button.dataset.cobraitServicesMegaBound = "true";
        button.addEventListener("click", function (event) {
          if (!isDesktopViewport()) return;
          event.preventDefault();
          event.stopPropagation();
          var shouldOpen = !shell.classList.contains("cobrait-services-mega-open");
          closeServicesMegas(shell);
          shell.classList.toggle("cobrait-services-mega-open", shouldOpen);
          button.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        });
      }
    });

    applyLanguageToDocument(normalizeLang(lang || getStoredLang() || "pt"));
  }

  function setLanguage(lang, shouldDispatch) {
    var normalized = normalizeLang(lang);
    activeLanguage = normalized;
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
    applyLanguageToDocument(normalized);
    enhanceServicesMega(normalized);
  }

  function resetMobileButtons() {
    var buttons = document.querySelectorAll('button[aria-label="Idioma"]');
    Array.prototype.forEach.call(buttons, function (button) {
      updateButton(button, "pt");
      button.setAttribute("aria-expanded", "false");
    });

    closeAll(null);
    closeServicesMegas(null);
    stopLanguageObserver();
    activeLanguage = "pt";
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
    var lang = normalizeLang(getUrlLang() || getStoredLang() || document.documentElement.lang || "pt");

    if (!isDesktopViewport()) {
      resetMobileButtons();
      return;
    }

    var buttons = document.querySelectorAll('button[aria-label="Idioma"]');
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
    loadTemplateTranslations().then(function () {
      setLanguage(normalizeLang(getUrlLang() || getStoredLang() || lang), false);
    });
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
    closeServicesMegas(null);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAll(null);
      closeServicesMegas(null);
    }
  });

  window.addEventListener("resize", syncViewport);
  window.addEventListener("cobrait-set-language", function (event) {
    var lang = normalizeLang(event && event.detail);
    loadTemplateTranslations().then(function () {
      applyLanguageToDocument(lang);
    });
  });

  window.CobraitLanguage = {
    get: function () {
      return activeLanguage;
    },
    set: function (lang) {
      setLanguage(lang, true);
      return activeLanguage;
    },
    refresh: function () {
      applyLanguageToDocument(activeLanguage);
      enhanceServicesMega(activeLanguage);
      return activeLanguage;
    },
    options: LANGS.map(function (lang) {
      return { code: lang.code, label: lang.label, name: lang.name };
    })
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
