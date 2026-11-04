const languageButton = document.getElementById('language');
function setLanguage(language) {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-en]').forEach(element => {
    element.textContent = element.dataset[language].replace(/\\n/g, '\n');
  });
  languageButton.textContent = language === 'en' ? 'FR' : 'EN';
  languageButton.setAttribute('aria-label', language === 'en' ? 'Afficher en français' : 'View in English');
  window.dispatchEvent(new Event('portfolio:language'));
  document.title = document.body.dataset[language === 'en' ? 'pageTitleEn' : 'pageTitleFr'] || 'Zhong Wen';
  try { sessionStorage.setItem('portfolio-language', language); } catch (_) {}
}
languageButton.addEventListener('click', () => setLanguage(document.documentElement.lang === 'en' ? 'fr' : 'en'));
let initialLanguage = 'en';
try { if (sessionStorage.getItem('portfolio-language') === 'fr') initialLanguage = 'fr'; } catch (_) {}
setLanguage(initialLanguage);

/* Keep the measuring-scale marker aligned with the section being read. */
(() => {
  const nav = document.querySelector('.ruler-nav');
  if (!nav) return;
  const marker = nav.querySelector('.nav-marker');
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let activeIndex = 0;
  let frame = 0;
  function positionMarker() {
    const link = links[activeIndex];
    if (!link || !marker) return;
    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    marker.style.top = (linkBox.top - navBox.top + linkBox.height / 2) + 'px';
  }
  function update() {
    frame = 0;
    let next = 0;
    const readingLine = Math.min(180, window.innerHeight * .25);
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= readingLine) next = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) next = links.length - 1;
    activeIndex = next;
    links.forEach((link, index) => {
      const active = index === activeIndex;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    positionMarker();
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('portfolio:language', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(nav);
  if (document.fonts) document.fonts.ready.then(schedule);
  update();
})();
