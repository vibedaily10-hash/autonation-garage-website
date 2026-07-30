/**
 * AutoNation Main Script V2
 * Handles themes, interactivity, animations, and testimonials.
 */



// Load production analytics once from the shared script instead of duplicating
// the same loader across every HTML page.
function initAnalytics() {
    const productionHosts = new Set(['autonationgarage.com', 'www.autonationgarage.com']);
    if (!productionHosts.has(window.location.hostname)) return;
    if (document.querySelector('script[data-domain="autonationgarage.com"]')) return;

    const analyticsScript = document.createElement('script');
    analyticsScript.defer = true;
    analyticsScript.dataset.domain = 'autonationgarage.com';
    analyticsScript.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(analyticsScript);
}

initAnalytics();

// 1. THEME MANAGER
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('auto-nation-theme');

    if (savedTheme) {
        if (savedTheme === 'light') htmlElement.setAttribute('data-theme', 'light');
    } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (prefersLight) {
            htmlElement.setAttribute('data-theme', 'light');
        }
    }

    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        themeToggleBtn.addEventListener('click', () => {
            themeToggleBtn.classList.add('rotated');
            setTimeout(() => themeToggleBtn.classList.remove('rotated'), 350);
            const currentTheme = htmlElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                htmlElement.removeAttribute('data-theme');
                localStorage.setItem('auto-nation-theme', 'dark');
                themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
                if (icon) { icon.className = 'fas fa-moon'; }
            } else {
                htmlElement.setAttribute('data-theme', 'light');
                localStorage.setItem('auto-nation-theme', 'light');
                themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
                if (icon) { icon.className = 'fas fa-sun'; }
            }
        });
        if (savedTheme === 'light' && icon) {
            icon.className = 'fas fa-sun';
        } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches && icon) {
            icon.className = 'fas fa-sun';
        } else if (icon) {
            icon.className = 'fas fa-moon';
        }
        themeToggleBtn.setAttribute(
            'aria-label',
            htmlElement.getAttribute('data-theme') === 'light'
                ? 'Switch to dark theme'
                : 'Switch to light theme'
        );
    }
}

initTheme();

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 3. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    function closeMobileMenu(restoreFocus = true) {
        if (!mobileBtn || !navLinks) return;
        navLinks.classList.remove('is-open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.setAttribute('aria-label', 'Open menu');
        if (restoreFocus) mobileBtn.focus();
    }

    if (mobileBtn && navLinks) {
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.setAttribute('aria-controls', 'nav-links');

        mobileBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('is-open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        function openMobileMenu() {
            navLinks.classList.add('is-open');
            mobileBtn.setAttribute('aria-expanded', 'true');
            mobileBtn.setAttribute('aria-label', 'Close menu');

            const firstLink = navLinks.querySelector('a');
            if (firstLink) firstLink.focus();
        }

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeMobileMenu(false));
        });
    }

    // Close mobile menu and FAQ on Escape (registered globally, independent of mobile menu)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (mobileBtn && navLinks && navLinks.classList.contains('is-open')) {
                closeMobileMenu();
            }
            const openFaq = document.querySelector('.faq-item.open');
            if (openFaq?.querySelector('.faq-question')) {
                openFaq.querySelector('.faq-question').focus();
            }
        }
    });

    // 4. Scroll Reveal Animations (skip if reduced motion)
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('.section-reveal, .slide-in-left, .slide-in-right, .line-wipe');

        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const section = entry.target;
                section.classList.add('visible');

                const staggerItems = section.querySelectorAll('.stagger-item');
                if (staggerItems.length > 0) {
                    setTimeout(() => {
                        staggerItems.forEach((item, i) => {
                            item.style.setProperty('--stagger-index', i);
                            item.classList.add('visible');
                        });
                    }, 150);
                }

                observer.unobserve(section);
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        document.querySelectorAll('.section-reveal, .slide-in-left, .slide-in-right, .line-wipe').forEach(el => {
            el.classList.add('visible');
        });
        document.querySelectorAll('.stagger-item').forEach(el => {
            el.classList.add('visible');
        });
    }

    // 7. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        if (button) {
            button.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                faqItems.forEach(i => {
                    i.classList.remove('open');
                    const btn = i.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.classList.add('open');
                    button.setAttribute('aria-expanded', 'true');
                }
            });

            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        }
    });

    // 8. Hero Carousel Slider
    function initHeroSlider() {
        const section = document.querySelector('.full-banner-section');
        if (!section) return;

        const wrapper = section.querySelector('.slides-wrapper');
        const slides = section.querySelectorAll('.slide');
        const dots = section.querySelectorAll('.dot');
        const prevBtn = section.querySelector('.slider-arrow--left');
        const nextBtn = section.querySelector('.slider-arrow--right');
        const totalSlides = slides.length;

        if (totalSlides === 0) return;

        // Set aria-hidden on non-active slides and aria-label on dots
        slides.forEach((s, i) => s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true'));
        dots.forEach((d, i) => d.setAttribute('aria-label', 'Go to slide ' + (i + 1)));

        let currentSlide = 0;
        let autoPlayTimer;
        const AUTO_PLAY_DELAY = 6000;

        function loadSlideImage(index) {
            const img = slides[index] ? slides[index].querySelector('img[data-src]') : null;
            if (!img) return;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }

        function setSlideAria(slides, active) {
            slides.forEach((s, i) => {
                s.setAttribute('aria-hidden', i === active ? 'false' : 'true');
            });
        }

        function goToSlide(index) {
            if (index === currentSlide) return;
            loadSlideImage(index);
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            setSlideAria(slides, index);
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            wrapper.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % totalSlides);
        }

        function prevSlide() {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        }

        function startAutoPlay() {
            if (prefersReducedMotion || document.hidden) return;
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_DELAY);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        if (nextBtn) nextBtn.addEventListener('click', function() { nextSlide(); startAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', function() { prevSlide(); startAutoPlay(); });

        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                var index = parseInt(this.getAttribute('data-index'));
                if (!isNaN(index)) { goToSlide(index); startAutoPlay(); }
            });
        });

        section.addEventListener('mouseenter', stopAutoPlay);
        section.addEventListener('mouseleave', startAutoPlay);

        var touchStartX = 0;
        var touchEndX = 0;
        section.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });
        section.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) { nextSlide(); } else { prevSlide(); }
            }
            startAutoPlay();
        }, { passive: true });

        section.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') { prevSlide(); startAutoPlay(); }
            if (e.key === 'ArrowRight') { nextSlide(); startAutoPlay(); }
        });

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) stopAutoPlay();
            else startAutoPlay();
        });

        if (!prefersReducedMotion) setTimeout(startAutoPlay, 10000);
    }

    initHeroSlider();

    initProcessMarquee();

});

// Process Section Marquee Navigation
function initProcessMarquee() {
    const wrappers = document.querySelectorAll('.process-track-wrapper');
    if (!wrappers.length) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    wrappers.forEach((wrapper) => {
        const track = wrapper.querySelector('.process-track__inner');
        if (!track) return;

        const trackParent = track.closest('.process-track');
        if (!trackParent) return;

        const cards = track.querySelectorAll('.process-card');
        const prevBtn = wrapper.querySelector('.process-btn--prev');
        const nextBtn = wrapper.querySelector('.process-btn--next');
        const dotsContainer = wrapper.querySelector('.process-dots');

        if (!cards.length || !prevBtn || !nextBtn || !dotsContainer) return;

        dotsContainer.innerHTML = '';

        const total = cards.length;
        let current = 0;
        let autoPlayTimer;

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'process-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Step ${i + 1}`);
            dot.dataset.index = i;
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.process-dot');

        function goTo(index) {
            current = Math.max(0, Math.min(index, total - 1));
            const card = cards[current];
            if (!card) return;

            trackParent.scrollTo({
                left: card.offsetLeft - trackParent.offsetLeft,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });

            prevBtn.hidden = current === 0;
            nextBtn.hidden = current === total - 1;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
            resetAutoPlay();
        }

        function resetAutoPlay() {
            clearTimeout(autoPlayTimer);
            if (prefersReducedMotion || document.hidden) return;
            autoPlayTimer = setTimeout(() => {
                const nextIndex = (current + 1) % total;
                goTo(nextIndex);
            }, 5000);
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));

        dotsContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
        });

        let scrollTimer;
        trackParent.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const center = trackParent.scrollLeft + trackParent.clientWidth / 2;
                let closest = 0;
                let minDist = Infinity;
                cards.forEach((card, i) => {
                    const dist = Math.abs(card.offsetLeft - trackParent.offsetLeft + card.offsetWidth / 2 - center);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = i;
                    }
                });
                if (closest !== current) {
                    current = closest;
                    dots.forEach((d, i) => d.classList.toggle('active', i === current));
                    prevBtn.hidden = current === 0;
                    nextBtn.hidden = current === total - 1;
                }
            }, 100);
        }, { passive: true });

        trackParent.addEventListener('mouseenter', () => clearTimeout(autoPlayTimer));
        trackParent.addEventListener('mouseleave', () => resetAutoPlay());
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) clearTimeout(autoPlayTimer);
            else resetAutoPlay();
        });

        prevBtn.hidden = true;
        nextBtn.hidden = total <= 1;
        if (total > 1) resetAutoPlay();
    });
}

