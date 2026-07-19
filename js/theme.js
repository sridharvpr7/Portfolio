/* ==========================================================================
   THEME.JS
   Dark / light mode switcher. Applies theme immediately (before paint) to
   avoid a flash of the wrong theme, then wires up the toggle button.

   NOTE: Browser storage (localStorage/sessionStorage) is intentionally NOT
   used here so this template works safely in any embedded preview context.
   If you deploy this as a real static site, you can restore persistence by
   reading/writing `localStorage.getItem('theme')` — see the commented lines
   below for exactly where to plug that back in.
   ========================================================================== */

(function initTheme() {
  // Default: respect the user's OS preference on first load.
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // let saved = localStorage.getItem('theme');           // <- restore for persistence
  let saved = null;
  const initialTheme = saved || (prefersDark ? 'dark' : 'dark'); // defaulting to dark to match premium dark hero design

  document.documentElement.setAttribute('data-theme', initialTheme);

  window.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');

    function reflectIcon(theme) {
      if (!icon) return;
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    reflectIcon(document.documentElement.getAttribute('data-theme'));

    toggleBtn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      reflectIcon(next);
      // localStorage.setItem('theme', next);            // <- restore for persistence
    });
  });
})();
