/* menuhamb.js — controls the hamburger menu on all pages */

function initHamburger() {
  const hamburger    = document.querySelector('.hamburger');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (!hamburger || !dropdownMenu) return;

  function openMenu() {
    dropdownMenu.style.display    = 'flex';
    dropdownMenu.style.flexDirection = 'column';
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    dropdownMenu.style.display = 'none';
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    dropdownMenu.style.display === 'flex' ? closeMenu() : openMenu();
  }

  // Expose globally for compatibility with legacy inline onclicks
  window.toggleMenu = toggleMenu;

  hamburger.addEventListener('click', toggleMenu);

  // Close when clicking outside
  document.addEventListener('click', (event) => {
    if (!dropdownMenu.contains(event.target) && !hamburger.contains(event.target)) {
      closeMenu();
    }
  });

  // Close with Esc
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Highlight active link for current page
  const links = dropdownMenu.querySelectorAll('a');
  links.forEach(link => {
    const linkPath = new URL(link.href, location.href).pathname;
    if (location.pathname.endsWith(linkPath.split('/').pop())) {
      link.classList.add('active');
    }
  });
}

// Expose the function to be called by app.js after loading the header
window.initHamburger = initHamburger;

// Fallback init in case dynamic loading isn't used
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if app.js is not present
    if (!document.querySelector('script[src*="app.js"]')) {
        initHamburger();
    }
});