// load-header.js - VERSÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 Iniciando carregamento do header...');
  
  // 1. Primeiro carrega os estilos
  loadHeaderStyles();
  
  // 2. Depois carrega o HTML do header
  fetch('header.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      console.log('✅ HTML do header carregado!');
      
      // Insere no início do body
      document.body.insertAdjacentHTML('afterbegin', html);
      
      // 3. Configura funcionalidades
      setTimeout(() => {
        markActiveLink();
        setupMobileMenu();
        setupLanguageSystem();
        console.log('🎉 Header configurado com sucesso!');
      }, 100); // Pequeno delay para garantir que o DOM foi atualizado
    })
    .catch(error => {
      console.error('❌ Erro ao carregar header:', error);
      // Fallback: mostrar header básico se falhar
      showFallbackHeader();
    });
});

function loadHeaderStyles() {
  // Verifica se os estilos já foram carregados
  if (document.querySelector('link[href="header-styles.css"]')) {
    console.log('📁 Estilos do header já carregados');
    return;
  }
  
  // Cria link para os estilos
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'header-styles.css';
  document.head.appendChild(link);
  console.log('🎨 Estilos do header carregados');
}

function markActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  console.log('📄 Página atual:', currentPage);
  
  const links = document.querySelectorAll('.site-nav a');
  console.log('🔗 Links encontrados:', links.length);
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (href.includes(currentPage.replace('.html', ''))))) {
      link.classList.add('active');
      console.log('📍 Link ativo marcado:', href);
    }
  });
}

function setupMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menuBtn = document.querySelector('.nav-toggle-btn');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      if (toggle) {
        toggle.checked = !toggle.checked;
        console.log('📱 Menu mobile:', toggle.checked ? 'aberto' : 'fechado');
      }
    });
  }
}

function setupLanguageSystem() {
  const languageOptions = document.querySelectorAll('.language-option');
  console.log('🌐 Opções de idioma:', languageOptions.length);
  
  languageOptions.forEach(option => {
    option.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang') || 'pt';
      localStorage.setItem('preferredLanguage', lang);
      updateLanguage(lang);
      console.log('🌍 Idioma alterado para:', lang);
    });
  });
  
  // Carrega língua salva
  const savedLang = localStorage.getItem('preferredLanguage') || 'pt';
  updateLanguage(savedLang);
}

function updateLanguage(lang) {
  // Atualiza bandeira e código
  const currentFlag = document.getElementById('currentFlag');
  const currentLang = document.getElementById('currentLang');
  
  const flags = { 'pt': '🇵🇹', 'en': '🇬🇧', 'es': '🇪🇸' };
  const codes = { 'pt': 'PT', 'en': 'EN', 'es': 'ES' };
  
  if (currentFlag) currentFlag.textContent = flags[lang] || '🇵🇹';
  if (currentLang) currentLang.textContent = codes[lang] || 'PT';
  
  // Atualizar as opções ativas
  const languageOptions = document.querySelectorAll('.language-option');
  languageOptions.forEach(option => {
    option.classList.remove('active');
    if (option.getAttribute('data-lang') === lang) {
      option.classList.add('active');
    }
  });
}

function showFallbackHeader() {
  // Header de fallback se o fetch falhar
  const fallbackHTML = `
    <header class="site-header" style="background: white; padding: 16px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
        <a href="index.html" style="text-decoration: none;">
          <div style="font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.8rem; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">COBRA IT</div>
          <div style="font-size: 0.7rem; color: #6b7280; text-transform: uppercase;">Software Factory</div>
        </a>
        <div style="color: #666; font-size: 14px;">Header carregado (modo fallback)</div>
      </div>
    </header>
  `;
  document.body.insertAdjacentHTML('afterbegin', fallbackHTML);
  console.log('🔄 Header de fallback carregado');
}