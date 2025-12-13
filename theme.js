// Theme toggle + custom color + font persistence
(function(){
  const root = document.documentElement;
  const stored = localStorage.getItem('vou_theme'); // 'dark'|'light' or null
  const storedColor = localStorage.getItem('vou_accent'); // custom accent hex
  const storedFont = localStorage.getItem('vou_font'); // e.g. 'Georgia|Inter'

  function applyTheme(theme){
    if(theme === 'dark') root.classList.add('theme-dark');
    else root.classList.remove('theme-dark');
    localStorage.setItem('vou_theme', theme);
  }

  // initial apply: respect stored, otherwise system preference
  if(stored) applyTheme(stored);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');

  // example UI hooks (you should have buttons in HTML)
  window.setTheme = applyTheme; // so buttons can call setTheme('dark')

  // accent color customizer
  if(storedColor) root.style.setProperty('--accent', storedColor);
  window.setAccent = function(hex){
    root.style.setProperty('--accent', hex);
    localStorage.setItem('vou_accent', hex);
  };

  // font selector
  if(storedFont){
    const [h,b] = storedFont.split('|');
    root.style.setProperty('--font-heading', h);
    root.style.setProperty('--font-body', b);
  }
  window.setFonts = function(heading, body){
    root.style.setProperty('--font-heading', heading);
    root.style.setProperty('--font-body', body);
    localStorage.setItem('vou_font', heading + '|' + body);
  };
})();
