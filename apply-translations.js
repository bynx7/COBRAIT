// Cobrait Translation Loader - Carrega as traduções e permite mudanças de idioma

window.cobraitTranslations = null;

(async function() {
  try {
    // 1. Tentar carregar o ficheiro de traduções (root ou parent para servicos/)
    let response;
    try {
      response = await fetch('./translations.json');
    } catch {
      response = await fetch('../translations.json');
    }
    
    if (!response.ok) throw new Error('Failed to load translations.json');
    window.cobraitTranslations = await response.json();
    
    // 2. Função para aplicar traduções ao HTML
    window.applyCobraitTranslations = function() {
      if (!window.cobraitTranslations) return;
      
      const elements = document.querySelectorAll('[data-en]');
      elements.forEach(el => {
        const enText = el.getAttribute('data-en');
        const trans = window.cobraitTranslations[enText];
        
        if (trans) {
          if (trans.fr) el.setAttribute('data-fr', trans.fr);
          if (trans.de) el.setAttribute('data-de', trans.de);
          if (trans.ru) el.setAttribute('data-ru', trans.ru);
          if (trans.nl) el.setAttribute('data-nl', trans.nl);
          if (trans.ja) el.setAttribute('data-ja', trans.ja);
          if (trans.zh) el.setAttribute('data-zh', trans.zh);
        }
      });
      
      console.log('✅ Traduções Cobrait carregadas!');
    };
    
    // 3. Aplicar as traduções assim que o DOM estiver pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', window.applyCobraitTranslations);
    } else {
      window.applyCobraitTranslations();
    }
    
    // 4. Monitorizar TODAS as mudanças de idioma
    setTimeout(() => {
      const langButtons = document.querySelectorAll('.language-option');
      if (langButtons.length > 0) {
        langButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            setTimeout(window.applyCobraitTranslations, 200);
          });
        });
        console.log('✅ Listeners de idioma anexados aos botões');
      }
    }, 500);
    
  } catch (error) {
    console.error('❌ Erro ao carregar traduções:', error);
  }
})();
