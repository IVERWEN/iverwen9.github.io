const languageButton = document.getElementById('language');
function setLanguage(language) {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-en]').forEach(element => {
    element.textContent = element.dataset[language].replace(/\\n/g, '\n');
  });
  languageButton.textContent = language === 'en' ? 'FR' : 'EN';
  languageButton.setAttribute('aria-label', language === 'en' ? 'Afficher en français' : 'View in English');
  document.title = language === 'en' ? 'Zhong Wen | Electronics & Metrology' : 'Zhong Wen | Électronique et métrologie';
}
languageButton.addEventListener('click', () => setLanguage(document.documentElement.lang === 'en' ? 'fr' : 'en'));
setLanguage('en');
