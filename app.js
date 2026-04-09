/* =========================================================
   app.js — Yayasan Smart Tuning Nusantara
   Animasi: Partikel, Counter, Scroll Reveal, Tilt, Timeline
   ========================================================= */

// ─── 0. BACKGROUND ICON SCATTER ──────────────────────────
(function initBgIcons() {
    const container = document.getElementById('bg-icons');
    if (!container) return;

    const icons = [
        'diagnostic.webp','chipset.webp','car-engine.webp','electric-vehicle.webp',
        'speedometer.webp','wireless.webp','turbo.webp','steering-wheel.webp',
        'electric-motor.webp','battery.webp','disc-brake.webp','brake-system-warning.webp',
        'piston.webp','radiator.webp','car-service.webp','drivetrain.webp',
        'manual-gear-shift.webp','airbag.webp','shock-absorber.webp','fuel.webp',
        'oil.webp','spark-plug.webp','fuse.webp','components.webp','muffler.webp',
        'engine-coolant.webp','high-beam.webp','low-beam.webp','parking-lights.webp',
        'turn-signals.webp','hazard.webp','malfunction-indicador.webp','pedal.webp',
        'lift.webp','tow-truck.webp','warning.webp'
    ];

    // Performance: reduce count drastically on mobile to prevent DOM lag
    const isMobile = window.innerWidth <= 768;
    const COUNT = isMobile ? 12 : 25; // originally 55, which is too heavy
    const rnd   = (min, max) => Math.random() * (max - min) + min;
    const pick  = arr => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < COUNT; i++) {
        const el   = document.createElement('img');
        const size = rnd(28, 72);           // icon size px
        const op   = rnd(0.03, 0.08);      // very subtle opacity
        const rot  = rnd(-35, 35);          // rotation deg
        const dur  = rnd(9, 22);            // float animation duration s
        const delay= rnd(-15, 0);           // stagger start
        const top  = rnd(0, 100);           // % vertical position
        const left = rnd(0, 100);           // % horizontal position

        el.src = 'icon bengkel/' + pick(icons);
        el.alt = '';
        el.className = 'bg-icon';
        el.width  = size;
        el.height = size;

        el.style.top  = top  + '%';
        el.style.left = left + '%';
        el.style.setProperty('--icon-op',    op);
        el.style.setProperty('--icon-rot',   rot + 'deg');
        el.style.setProperty('--icon-dur',   dur + 's');
        el.style.setProperty('--icon-delay', delay + 's');

        container.appendChild(el);
    }
}());

// ─── 1. PARTICLE CANVAS ─────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Performance: reduce canvas particle count on mobile screens
    const isMobile = window.innerWidth <= 768;
    const PARTICLE_COUNT = isMobile ? 25 : 60;
    const particles = [];

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * canvas.width;
            this.y = init ? Math.random() * canvas.height : canvas.height + 10;
            this.r = Math.random() * 1.5 + 0.3;
            this.speed = Math.random() * 0.4 + 0.15;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.drift = (Math.random() - 0.5) * 0.3;
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            if (this.y < -10) this.reset(false);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(45,124,246,${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
}());

// ─── 2. NAVBAR SCROLL ───────────────────────────────────
(function initNavbar() {
    const nav = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    toggle && toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
    });

    // Close menu on link click
    menu && menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => menu.classList.remove('open'));
    });
}());

// ─── 3. SMOOTH SCROLL ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── 4. SCROLL REVEAL ───────────────────────────────────
(function initReveal() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                el.style.setProperty('--delay', delay + 'ms');
                el.classList.add('in');
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
}());

// ─── 5. COUNTER ANIMATION ────────────────────────────────
(function initCounters() {
    const counters = document.querySelectorAll('.stat-num[data-count]');
    if (!counters.length) return;

    const easeOut = t => 1 - Math.pow(1 - t, 4);

    function animateCounter(el) {
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.round(easeOut(progress) * target);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}());

// ─── 6. TILT EFFECT ON CURRICULUM CARDS ─────────────────
(function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -6;
            const rotY = ((x - cx) / cx) * 6;
            card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
        });
    });
}());

// ─── 7. TIMELINE PROGRESS ────────────────────────────────
(function initTimeline() {
    const progress = document.getElementById('timelineProgress');
    if (!progress) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => { progress.style.height = '100%'; }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(progress.parentElement);
}());

// ─── 8. ACTIVE NAV LINK HIGHLIGHT ON SCROLL ──────────────
(function initActiveLink() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}());

// ─── 9. PHOTO SLIDER — Infinite Marquee ──────────────────
(function initSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.slide'));
    if (!slides.length) return;

    // Duplicate slides to create seamless loop
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });

    // Speed: adjust duration based on slide count (longer = slower)
    // Each slide is ~480px + 1.2rem gap (~19px) ≈ 499px
    const slideWidth = 499;
    const totalWidth = slides.length * slideWidth;
    const speed = 80; // px per second — increase = slower
    const duration = Math.round(totalWidth / speed);

    track.style.setProperty('--marquee-duration', duration + 's');
}());


