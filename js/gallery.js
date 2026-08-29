document.addEventListener('DOMContentLoaded', () => {

    const gallery        = document.getElementById('gallery');
    const albumsContainer= document.getElementById('albums');
    const filterText     = document.getElementById('nameFilter');
    const filterDate     = document.getElementById('dateFilter');
    const clearFiltersBtn= document.getElementById('clearFilters');

    // ---- Total days calculation for Gallery --------------------------
    const START_DATE = new Date('2023-08-30T00:00:00');
    const now = new Date();
    const totalDays = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));
    
    const galleryCounter = document.getElementById('gallery-counter');
    if (galleryCounter) {
        galleryCounter.textContent = totalDays.toLocaleString('pt-BR');
    }

    // List of currently visible photos for lightbox navigation
    let visiblePhotos = [];
    let currentIndex   = -1;
    let photos        = [];   // populated after fetch

    // ---- Format date: receives "YYYY-MM-DD" and returns "DD/MM/YYYY" --------
    // Uses split directly to avoid UTC->Local conversion issues
    function formatDate(iso) {
        if (!iso || typeof iso !== 'string') return '';
        const parts = iso.split('-');
        if (parts.length !== 3) return '';
        const [year, month, day] = parts;
        if (!year || !month || !day) return '';
        return `${day}/${month}/${year}`;
    }

    // ---- Create photo element -------------------------------------------
    function createPhotoElement(photo) {
        if (!photo || !photo.src) return null;
        const img = document.createElement('img');
        img.src           = photo.src;
        img.loading       = 'lazy';
        img.alt           = photo.caption || photo.album || 'Nossa memória';
        img.dataset.date  = photo.date  || '';
        img.dataset.album = (photo.album || '').toString().trim();
        img.addEventListener('load',  () => img.classList.add('carregada'), { once: true });
        img.addEventListener('error', () => { 
            img.style.display = 'none'; 
            img.dataset.error = 'true'; // Mark as error so filters don't unhide it
        });
        img.addEventListener('click', () => openModalGallery(photo));
        return img;
    }

    // ---- Main gallery -> only photos without album -------------------------
    function renderGallery(sortedPhotos) {
        gallery.innerHTML = '';
        const generalPhotos = sortedPhotos.filter(p => !p.album || p.album.toString().trim() === '');
        generalPhotos.forEach(p => {
            const el = createPhotoElement(p);
            if (el) gallery.appendChild(el);
        });
    }

    // ---- Albums -> create section for each unique name -----------------------
    function renderAlbums(sortedPhotos) {
        albumsContainer.innerHTML = '';

        const albumNames = [...new Set(
            sortedPhotos
                .map(p => (p.album || '').toString().trim())
                .filter(name => name !== '')
        )];

        albumNames.forEach(albumName => {
            const albumDiv = document.createElement('div');
            albumDiv.className    = 'album';
            albumDiv.dataset.album = albumName;

            const title = document.createElement('h2');
            title.textContent = albumName;
            title.className   = 'album-title';

            const photosDiv = document.createElement('div');
            photosDiv.className = 'album-photos';

            sortedPhotos
                .filter(p => (p.album || '').toString().trim() === albumName)
                .forEach(p => {
                    const el = createPhotoElement(p);
                    if (el) photosDiv.appendChild(el);
                });

            albumDiv.appendChild(title);
            albumDiv.appendChild(photosDiv);
            albumsContainer.appendChild(albumDiv);
        });
    }

    // ---- Modal / lightbox with navigation ---------------------------------
    function openByIndex(index) {
        if (!visiblePhotos.length) return;
        currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
        const photo = visiblePhotos[currentIndex];
        
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modalImg');
        const modalInfo = document.getElementById('modalInfo');
        
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Hide other items if open
            document.querySelectorAll('.modal-item').forEach(el => el.style.display = 'none');
            
            if (modalImg) {
                modalImg.src = photo.src;
                modalImg.style.display = 'block';
            }
            if (modalInfo) {
                modalInfo.textContent = `${formatDate(photo.date)}${photo.caption ? ' — ' + photo.caption : ''}`;
                modalInfo.style.display = 'block';
            }
            
            // Show arrows in gallery mode
            const prevBtn = document.getElementById('modalPrev');
            const nextBtn = document.getElementById('modalNext');
            if (prevBtn) prevBtn.style.display = 'block';
            if (nextBtn) nextBtn.style.display = 'block';
        }
    }

    function openModalGallery(photo) {
        if (!photo) return;
        const imgsOnScreen = document.querySelectorAll(
            '.gallery img:not([style*="display: none"]), .album-photos img:not([style*="display: none"])'
        );
        visiblePhotos = Array.from(imgsOnScreen)
            .map(img => photos.find(p => p.src === img.getAttribute('src')))
            .filter(Boolean);
        const index = visiblePhotos.findIndex(p => p.src === photo.src);
        openByIndex(index === -1 ? 0 : index);
    }

    // Expose init function for app.js
    window.initGalleryModal = function() {
        const modalPrevBtn = document.getElementById('modalPrev');
        const modalNextBtn = document.getElementById('modalNext');
        
        if (modalPrevBtn) modalPrevBtn.addEventListener('click', () => openByIndex(currentIndex - 1));
        if (modalNextBtn) modalNextBtn.addEventListener('click', () => openByIndex(currentIndex + 1));
    };

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('modal');
        if (!modal || modal.classList.contains('hidden')) return;
        
        if (e.key === 'ArrowRight')  openByIndex(currentIndex + 1);
        if (e.key === 'ArrowLeft')   openByIndex(currentIndex - 1);
    });

    // ---- Filters --------------------------------------------------------
    function applyFilters() {
        const text = (filterText && filterText.value) ? filterText.value.toLowerCase().trim() : '';
        const date = filterDate ? filterDate.value : '';

        if (clearFiltersBtn) {
            clearFiltersBtn.style.display = (text || date) ? 'inline-block' : 'none';
        }

        document.querySelectorAll('.gallery img, .album-photos img').forEach(img => {
            if (img.dataset.error === 'true') return; // Skip broken images

            const alt     = (img.alt || '').toLowerCase();
            const album   = (img.dataset.album || '').toLowerCase();
            const matchText = !text || alt.includes(text) || album.includes(text);
            const matchDate = !date || img.dataset.date === date;
            img.style.display = (matchText && matchDate) ? '' : 'none';
        });

        // Hide albums that have no visible photos
        document.querySelectorAll('.album').forEach(albumDiv => {
            const hasVisible = Array.from(albumDiv.querySelectorAll('img'))
                .some(img => img.style.display !== 'none');
            albumDiv.style.display = hasVisible ? '' : 'none';
        });
    }

    if (filterText) filterText.addEventListener('input', applyFilters);
    if (filterDate) filterDate.addEventListener('input', applyFilters);
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            if (filterText) filterText.value = '';
            if (filterDate) filterDate.value = '';
            applyFilters();
        });
    }

    // ---- Load JSON and initialize --------------------------------------
    fetch('../data/photos.json')
        .then(r => r.json())
        .then(data => {
            photos = data;

            // Sort by date
            const sortedPhotos = [...photos].sort((a, b) => {
                const pa = a.date && a.date.match(/^\d{4}-\d{2}-\d{2}$/) ? a.date : '9999-99-99';
                const pb = b.date && b.date.match(/^\d{4}-\d{2}-\d{2}$/) ? b.date : '9999-99-99';
                return pa.localeCompare(pb);
            });

            renderGallery(sortedPhotos);
            renderAlbums(sortedPhotos);
        })
        .catch(err => {
            console.error('Error loading photos.json:', err);
            gallery.innerHTML = '<p style="color:red">Error loading photos.</p>';
        });
});