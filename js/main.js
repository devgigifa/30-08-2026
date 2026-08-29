// js/main.js - Specific logic for the main page (main.html)

document.addEventListener("DOMContentLoaded", () => {
    // ---- Start Date -------------
    const START_DATE = new Date('2023-08-30T00:00:00');
  
    function calculateTimeTogether() {
      const now = new Date();
      let years = now.getFullYear() - START_DATE.getFullYear();
      let months = now.getMonth() - START_DATE.getMonth();
      let days = now.getDate() - START_DATE.getDate();
      
      if (days < 0) {
        months -= 1;
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      const totalDays = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));
      return { years, months, days, totalDays };
    }
  
    function mountCounter() {
      const { years, months, days } = calculateTimeTogether();
      const counter = document.getElementById('counter');
      if (counter) {
        counter.innerHTML = `
          <div class="counter-item"><span class="counter-number">${years}</span><span class="counter-label">anos</span></div>
          <div class="counter-item"><span class="counter-number">${months}</span><span class="counter-label">meses</span></div>
          <div class="counter-item"><span class="counter-number">${days}</span><span class="counter-label">dias</span></div>
        `;
      }
    }
    mountCounter();
  
    // ---- Reveal sections on scroll -------------------------------
    const sections = document.querySelectorAll('main > section');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      sections.forEach(s => observer.observe(s));
    } else {
      sections.forEach(s => s.classList.add('reveal'));
    }
  
    // ---- Load and Render Carousels ---------------------------------
    fetch('../data/carousels.json')
      .then(response => response.json())
      .then(data => {
          renderCarousel('carousel-photos', data.photos);
          renderCarousel('carousel-start', data.start);
          renderMusicCarousel('carousel-songs', data.songs);
          renderSentCarousel('carousel-sent', data.sent);
          renderSentCarousel('carousel-received', data.received); // Same structure
          
          setupCarouselNavigation();
          setupVinylPlayer();
      })
      .catch(err => console.error("Error loading carousel data:", err));
  
    // Rendering Functions
    function renderCarousel(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = ''; // Clear content

        items.forEach(item => {
            if (item.cta) {
                container.innerHTML += `
                    <div class="carousel-card cta-card clickable" data-link="${item.link || ''}">
                        <strong>${item.text}</strong>
                    </div>`;
            } else {
                container.innerHTML += `
                    <div class="carousel-card clickable" data-action="${item.action}">
                        <img src="${item.src}" alt="${item.alt}">
                        <p>${item.title}</p>
                        <p>${item.date}</p>
                    </div>`;
            }
        });
    }

    function renderMusicCarousel(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        items.forEach(item => {
            if (item.cta) {
                container.innerHTML += `
                    <div class="carousel-card cta-card clickable" data-link="${item.link || ''}">
                        <strong>${item.text}</strong>
                    </div>`;
            } else {
                container.innerHTML += `
                    <div class="carousel-card music-card" data-src="${item.audioSrc}">
                        <div class="vinyl"><img src="${item.src}" alt="${item.alt}"></div>
                        <h3>${item.title}</h3>
                        <p>${item.artist}</p>
                        <button class="vinyl-play-btn" aria-label="Play ${item.title}">▶</button>
                        <audio class="vinyl-audio" src="${item.audioSrc}" preload="none"></audio>
                    </div>`;
            }
        });
    }

    function renderSentCarousel(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        items.forEach(item => {
            if (item.link) {
                container.innerHTML += `
                    <div class="carousel-card tall clickable" data-link="${item.link}">
                        <img src="${item.src}" alt="${item.alt}">
                        <p>${item.title}</p>
                    </div>`;
            } else {
                container.innerHTML += `
                    <div class="carousel-card tall clickable" data-action="${item.action}">
                        <img src="${item.src}" alt="${item.alt}">
                        <p>${item.title}</p>
                    </div>`;
            }
        });
    }

    // Setup click listeners on prev/next buttons of all carousels
    function setupCarouselNavigation() {
        const wrappers = document.querySelectorAll('.carousel-wrapper');
        wrappers.forEach(wrapper => {
            const btnLeft = wrapper.querySelector('.carousel-nav.left');
            const btnRight = wrapper.querySelector('.carousel-nav.right');
            const carousel = wrapper.querySelector('.carousel');

            if (btnLeft && carousel) {
                btnLeft.addEventListener('click', () => scrollCarousel(carousel, -1));
            }
            if (btnRight && carousel) {
                btnRight.addEventListener('click', () => scrollCarousel(carousel, 1));
            }
        });

        // Event delegation for dynamically generated clickable cards
        document.body.addEventListener('click', (e) => {
            const clickableCard = e.target.closest('.clickable');
            if (clickableCard) {
                if (clickableCard.dataset.link) {
                    window.location.href = clickableCard.dataset.link;
                } else if (clickableCard.dataset.action) {
                    // Evaluate string "openModal(...)" stored in JSON
                    const action = clickableCard.dataset.action;
                    if(action.startsWith('openModal')) {
                        try {
                            new Function(action)();
                        } catch(err) {
                            console.error("Error executing action:", action, err);
                        }
                    }
                }
            }
        });
    }

    function scrollCarousel(container, direction) {
        const scrollAmount = container.offsetWidth * 0.8;
        container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }

    // ---- Vinyl Player ------------------------------------
    function setupVinylPlayer() {
        let activeCard = null;

        const musicContainer = document.getElementById('carousel-songs');
        if(!musicContainer) return;

        musicContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.vinyl-play-btn');
            if (!btn) return;

            const card  = btn.closest('.music-card');
            const audio = card.querySelector('.vinyl-audio');

            // If clicked on currently playing card -> pause
            if (card === activeCard) {
                audio.pause();
                card.classList.remove('playing');
                btn.textContent = '▶';
                activeCard = null;
                return;
            }

            // Stop previous card if any
            if (activeCard) {
                const prevAudio = activeCard.querySelector('.vinyl-audio');
                const prevBtn   = activeCard.querySelector('.vinyl-play-btn');
                prevAudio.pause();
                prevAudio.currentTime = 0;
                activeCard.classList.remove('playing');
                prevBtn.textContent = '▶';
            }

            // Play the new one
            audio.play().catch(() => {
                // file not found - ignore silently
            });
            card.classList.add('playing');
            btn.textContent = '⏸';
            activeCard = card;

            // Reset state when audio ends
            audio.addEventListener('ended', () => {
                card.classList.remove('playing');
                btn.textContent = '▶';
                activeCard = null;
            }, { once: true });
        });
    }
});