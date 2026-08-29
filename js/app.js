// js/app.js - Loads components and initializes common functionalities

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Load components if placeholders exist
    await loadComponent("app-header", "../components/header.html");
    await loadComponent("app-footer", "../components/footer.html");
    await loadComponent("app-modal", "../components/modal.html");

    // 2. Initialize hamburger menu after header is loaded
    if (typeof initHamburger === 'function') {
      initHamburger();
    }
    
    // 3. Initialize modals after modal.html is loaded
    initModals();
    if (typeof initGalleryModal === 'function') {
      initGalleryModal();
    }

  } catch (error) {
    console.error("Error loading page components:", error);
  }
});

async function loadComponent(elementId, componentPath) {
  const element = document.getElementById(elementId);
  if (!element) return; // If page doesn't have this container, ignore

  const response = await fetch(componentPath);
  if (!response.ok) {
    throw new Error(`Could not load component ${componentPath}`);
  }
  const html = await response.text();
  element.innerHTML = html;
}

// -----------------------------------------------------------------
// Common Modal Functions
// -----------------------------------------------------------------
function initModals() {
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      // Close when clicking outside content
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(type, src, download = null) {
  const modal = document.getElementById('modal');
  if (!modal) return;
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  const items = document.querySelectorAll('.modal-item');
  items.forEach(item => item.style.display = 'none');

  const element = document.getElementById(type);
  if (element) {
    element.src = src;
    element.style.display = 'block';
  }

  if (type === 'pdf-download' && download) {
    const downloadLink = document.getElementById('download-link');
    if (downloadLink) {
        downloadLink.href = download;
    }
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  
  const items = document.querySelectorAll('.modal-item');
  items.forEach(item => {
    if (item.tagName === 'VIDEO') {
        item.pause();
        item.currentTime = 0;
    }
    item.style.display = 'none';
  });

  // Hide arrows in case they were opened by the gallery
  const prevBtn = document.getElementById('modalPrev');
  const nextBtn = document.getElementById('modalNext');
  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
}

// Expose functions globally for dynamic carousels
window.openModal = openModal;
window.closeModal = closeModal;