document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // ANNOUNCEMENT BAR & STICKY HEADER (ELIMINATE GAP ON SCROLL)
    // ============================================================
    const bar = document.querySelector('.announcement-bar');
    const header = document.getElementById('main-header');

    const updateHeaderScroll = () => {
        const scrollY = window.scrollY;
        const isScrolled = scrollY > 20;

        if (header) {
            header.classList.toggle('scrolled', isScrolled);
            document.body.classList.toggle('scrolled', isScrolled);

            if (bar) {
                const barH = bar.offsetHeight;
                document.documentElement.style.setProperty('--bar-height', barH + 'px');
                if (scrollY <= 0) {
                    header.style.top = barH + 'px';
                } else if (scrollY < barH) {
                    header.style.top = Math.max(0, barH - scrollY) + 'px';
                } else {
                    header.style.top = '0px';
                }
            } else {
                header.style.top = '0px';
            }
        }
    };

    if (bar) {
        document.body.classList.add('has-bar');
    }

    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    window.addEventListener('resize', updateHeaderScroll);
    updateHeaderScroll();

    // ============================================================
    // MOBILE NAVIGATION
    // ============================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-times', isOpen);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }

    // ============================================================
    // SMOOTH SCROLLING
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ============================================================
    // SCROLL REVEAL (IntersectionObserver)
    // ============================================================
    const revealAll = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window && revealAll.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                // Stagger children in same parent
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
                    const idx = siblings.indexOf(entry.target);
                    if (!entry.target.style.transitionDelay) {
                        entry.target.style.transitionDelay = Math.min(idx * 70, 420) + 'ms';
                    }
                }

                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealAll.forEach(el => observer.observe(el));
    } else {
        revealAll.forEach(el => el.classList.add('visible'));
    }

    // ============================================================
    // ANIMATED COUNTERS
    // ============================================================
    const counters = document.querySelectorAll('.stat-count');

    const animateCount = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '+';
        const duration = 2000;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
            const value = Math.floor(eased * target);
            el.textContent = value.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    counterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(el => counterObs.observe(el));
    }

    // ============================================================
    // BACK TO TOP
    // ============================================================
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.classList.toggle('show', window.scrollY > 500);
        }, { passive: true });

        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ============================================================
    // HERO CARD PARALLAX (subtle)
    // ============================================================
    const heroCards = document.querySelectorAll('.hero-card');
    if (heroCards.length > 0 && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;

            heroCards.forEach((card, i) => {
                const factor = (i + 1) * 3;
                card.style.transform = `translate(${dx * factor}px, ${dy * factor * 0.5}px)`;
            });
        });
    }

    // ============================================================
    // SERVICES SLIDER (horizontal scroll on index)
    // ============================================================
    const servicesSlider = document.querySelector('.services-slider');
    const prevSrv = document.querySelector('.prev-srv');
    const nextSrv = document.querySelector('.next-srv');

    if (servicesSlider && prevSrv && nextSrv) {
        prevSrv.addEventListener('click', () => servicesSlider.scrollBy({ left: -340, behavior: 'smooth' }));
        nextSrv.addEventListener('click', () => servicesSlider.scrollBy({ left: 340, behavior: 'smooth' }));
    }

    // ============================================================
    // HERO SLIDER (if present)
    // ============================================================
    const slides = document.querySelectorAll('.slide');
    const dots   = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slides.length > 0) {
        let cur = 0;
        let iv;

        const go = (n) => {
            slides[cur].classList.remove('active');
            if (dots[cur]) dots[cur].classList.remove('active');
            cur = (n + slides.length) % slides.length;
            slides[cur].classList.add('active');
            if (dots[cur]) dots[cur].classList.add('active');
        };

        const start = () => { iv = setInterval(() => go(cur + 1), 5500); };
        const stop  = () => clearInterval(iv);

        if (nextBtn) nextBtn.addEventListener('click', () => { go(cur + 1); stop(); start(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { go(cur - 1); stop(); start(); });

        dots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); stop(); start(); }));

        start();
    }

    // ============================================================
    // ACTIVE NAV LINK (based on current page)
    // ============================================================
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });

    // ============================================================
    // CONTACT FORM SUCCESS
    // ============================================================
    const contactForm = document.querySelector('.contact-form-wrap form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const wrap = contactForm.closest('.contact-form-wrap');
            wrap.innerHTML = `
                <div style="text-align:center; padding: 4rem 2rem;">
                    <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#FF6B00,#FFA940);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:2rem;color:#000;">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <h3 style="color:#fff;font-size:1.5rem;margin-bottom:0.75rem;">Message Sent!</h3>
                    <p style="color:#8888A4;">Thank you! We'll get back to you within 24 hours.</p>
                    <a href="index.html" class="btn btn-primary" style="margin-top:1.5rem;">Back to Home</a>
                </div>
            `;
        });
    }

});
