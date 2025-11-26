
(function () {
    'use strict';

    const IS_MOBILE = () => window.innerWidth <= 768;

    // Register GSAP plugin if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* already registered */ }
    }

    /* ----------------- Animations ----------------- */
    function initMainAnimations() {
        if (typeof gsap === 'undefined') return;

        const isMobile = IS_MOBILE();
        const baseDur = isMobile ? 0.6 : 0.9;
        const staggerDelay = isMobile ? 0.08 : 0.12;

        // Hero (set or animate depending on viewport)
        if (isMobile) {
            gsap.set('.hero-content h1, .hero-content p, .hero-buttons', { opacity: 1, y: 0 });
        } else {
            gsap.to('.hero-content h1', { opacity: 1, y: 0, duration: baseDur, delay: 0.25 });
            gsap.to('.hero-content p', { opacity: 1, y: 0, duration: baseDur, delay: 0.45 });
            gsap.to('.hero-buttons', { opacity: 1, y: 0, duration: baseDur, delay: 0.7 });
        }

        // Generic helper to animate lists with ScrollTrigger
        const animateList = (selector, opts = {}) => {
            const nodes = gsap.utils.toArray(selector);
            nodes.forEach((node, i) => {
                gsap.to(node, Object.assign({
                    opacity: 1,
                    y: 0,
                    duration: baseDur,
                    delay: (opts.delayFactor || staggerDelay) * i
                }, opts.props || {}, {
                    scrollTrigger: Object.assign({ trigger: node, toggleActions: 'play none none reverse' }, opts.scroll || {})
                }));
            });
        };

        animateList('.section-title', { props: { y: 0 }, scroll: { start: 'top 90%', end: 'bottom 10%' } });
        animateList('.skill-category', { delayFactor: staggerDelay / 2, scroll: { start: 'top 85%', end: 'bottom 15%' } });
        animateList('.project-card', { delayFactor: staggerDelay / 2, scroll: { start: 'top 90%', end: 'bottom 10%' } });
        animateList('.cert-card', { delayFactor: staggerDelay / 2, scroll: { start: 'top 90%', end: 'bottom 10%' } });

        // Specific single element animations
        gsap.to('.about-text', { opacity: 1, x: 0, duration: baseDur, scrollTrigger: { trigger: '.about-content', start: 'top 80%', end: 'bottom 20%' } });
        gsap.to('.about-image', { opacity: 1, x: 0, duration: baseDur, scrollTrigger: { trigger: '.about-content', start: 'top 80%', end: 'bottom 20%' } });

        gsap.to('.contact-form', { opacity: 1, x: 0, duration: baseDur, scrollTrigger: { trigger: '.contact-container', start: 'top 80%', end: 'bottom 20%' } });

        // Floating/background shapes (only animate on non-mobile for performance)
        if (!isMobile) {
            gsap.to('.shape-1', { y: -30, rotation: 360, duration: 14, repeat: -1, ease: 'none' });
            gsap.to('.shape-2', { y: 20, rotation: -360, duration: 18, repeat: -1, ease: 'none' });
            gsap.to('.shape-3', { y: -20, rotation: 180, duration: 16, repeat: -1, ease: 'none' });

            gsap.to('.bg-shape-1', { y: -50, rotation: 360, duration: 24, repeat: -1, ease: 'none' });
            gsap.to('.bg-shape-2', { y: 30, rotation: -360, duration: 28, repeat: -1, ease: 'none' });
            gsap.to('.bg-shape-3', { y: -30, rotation: 180, duration: 26, repeat: -1, ease: 'none' });
        }
    }

    /* ----------------- Mobile Menu ----------------- */
    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        if (!menuToggle || !navLinks) return;

        const icon = () => menuToggle.querySelector('i');

        const closeMenu = () => {
            navLinks.classList.remove('active');
            if (icon()) { icon().classList.remove('fa-times'); icon().classList.add('fa-bars'); }
            document.body.style.overflow = '';
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            if (icon()) { icon().classList.toggle('fa-bars'); icon().classList.toggle('fa-times'); }
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
        });

        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    }

    /* ----------------- Launch Screen ----------------- */
    function initLaunchScreen() {
        const launchScreen = document.getElementById('launchScreen');
        const particlesContainer = document.getElementById('particlesContainer');
        if (!launchScreen || !particlesContainer) return;

        // Create gentle floating particles
        for (let i = 0; i < 24; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.animationDelay = `${Math.random() * 8}s`;
            p.style.animationDuration = `${6 + Math.random() * 6}s`;
            particlesContainer.appendChild(p);
        }

        // small entrance animations
        if (typeof gsap !== 'undefined') {
            gsap.to('.floral-item', { opacity: 0.3, duration: 2, stagger: 0.18, ease: 'power2.out' });
            gsap.to('.main-logo', { scale: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.2 });
            gsap.to('.name-title', { y: 0, opacity: 1, duration: 1, delay: 0.45 });
            gsap.to('.subtitle', { y: 0, opacity: 1, duration: 1, delay: 0.65 });
        }

        // Hide launch screen then boot main animations
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(launchScreen, { opacity: 0, duration: 0.6, onComplete: () => { launchScreen.classList.add('hidden'); initMainAnimations(); } });
            } else {
                launchScreen.classList.add('hidden');
                initMainAnimations();
            }
        }, 1600);
    }

    /* ----------------- Portfolio Optimizer ----------------- */
    class PortfolioOptimizer {
        constructor() { this.init(); }
        init() { this.setupLazyLoading(); this.setupPerformanceMonitoring(); this.setupResourcePreloading(); }

        setupLazyLoading() {
            const imgs = document.querySelectorAll('img[data-src]');
            if (!imgs.length) return;

            if ('IntersectionObserver' in window) {
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) return;
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        io.unobserve(img);
                    });
                }, { rootMargin: '50px 0px', threshold: 0.1 });

                imgs.forEach(img => io.observe(img));
            } else {
                imgs.forEach(img => { img.src = img.dataset.src; img.classList.add('lazy-loaded'); });
            }
        }

        setupPerformanceMonitoring() {
            if ('PerformanceObserver' in window) {
                try {
                    const perfObserver = new PerformanceObserver(list => {
                        list.getEntries().forEach(entry => console.log(`Performance Metric - ${entry.name}: ${entry.value}`));
                    });
                    perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
                } catch (e) { console.log('Performance monitoring setup failed', e); }
            }

            window.addEventListener('load', () => {
                if (performance && performance.timing && performance.timing.loadEventEnd) {
                    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                    console.log(`Page load time: ${loadTime}ms`);
                }
            });
        }

        setupResourcePreloading() {
            const critical = ['profile picture - bautista.jpg', 'MOS Associate - Bautista.png'];
            critical.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload'; link.as = 'image'; link.href = src; document.head.appendChild(link);
            });
        }
    }

    /* ----------------- Modals & Forms ----------------- */
    function initModalsAndForms() {
        // Logo modal
        const modal = document.getElementById('logoModal');
        const modalLogo = document.getElementById('modalLogo');
        const modalClose = document.getElementById('modalClose');
        const certBadges = document.querySelectorAll('.cert-badge');

        if (certBadges.length && modal && modalLogo) {
            certBadges.forEach(b => b.addEventListener('click', function () {
                const path = this.getAttribute('data-logo'); if (!path) return;
                modalLogo.src = path; modal.classList.add('active'); document.body.style.overflow = 'hidden';
            }));

            const close = () => { modal.classList.remove('active'); document.body.style.overflow = ''; };
            if (modalClose) modalClose.addEventListener('click', close);
            modal.addEventListener('click', e => { if (e.target === modal) close(); });
        }

        // Contact modal and form
        const contactModal = document.getElementById('contactModal');
        const contactModalClose = document.getElementById('contactModalClose');
        const contactModalOk = document.getElementById('contactModalOk');
        const contactForm = document.getElementById('contactForm');

        const closeContact = () => { if (contactModal) { contactModal.classList.remove('active'); document.body.style.overflow = ''; } };
        if (contactModalClose) contactModalClose.addEventListener('click', closeContact);
        if (contactModalOk) contactModalOk.addEventListener('click', closeContact);
        if (contactModal) contactModal.addEventListener('click', e => { if (e.target === contactModal) closeContact(); });

        // Simple validation helpers
        const showError = (fieldId, message) => {
            const field = document.getElementById(fieldId); if (!field) return;
            field.classList.add('error');
            const err = document.createElement('div'); err.className = 'error-message'; err.textContent = message;
            err.style.color = 'var(--error)'; err.style.fontSize = '0.8rem'; err.style.marginTop = '5px';
            field.parentNode.appendChild(err);
        };

        const validateForm = (form) => {
            if (!form) return false;
            const name = (form.querySelector('#name') || {}).value || '';
            const email = (form.querySelector('#email') || {}).value || '';
            const subject = (form.querySelector('#subject') || {}).value || '';
            const message = (form.querySelector('#message') || {}).value || '';

            let isValid = true;
            form.querySelectorAll('.error-message').forEach(el => el.remove());
            form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));

            if (name.trim().length < 2) { showError('name', 'Please enter your full name'); isValid = false; }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) { showError('email', 'Please enter a valid email address'); isValid = false; }
            if (subject.trim().length < 5) { showError('subject', 'Please enter a descriptive subject'); isValid = false; }
            if (message.trim().length < 10) { showError('message', 'Please enter a message with at least 10 characters'); isValid = false; }

            return isValid;
        };

        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                if (!validateForm(this)) return;
                const data = Object.fromEntries(new FormData(this));
                const submitBtn = this.querySelector('button[type="submit"]');
                const original = submitBtn ? submitBtn.innerHTML : null;
                if (submitBtn) { submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; submitBtn.disabled = true; }

                // Simulate submit (replace with real network call)
                setTimeout(() => {
                    if (contactModal) contactModal.classList.add('active');
                    this.reset(); if (submitBtn) { submitBtn.innerHTML = original; submitBtn.disabled = false; }
                    console.log('Form submitted:', data);
                }, 1200);
            });
        }
    }

    /* ----------------- Interactions ----------------- */
    function initInteractions() {
        // Cursor: hide on mobile
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursor && cursorFollower) {
            if (!IS_MOBILE()) {
                document.addEventListener('mousemove', e => {
                    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
                    gsap.to(cursorFollower, { duration: 0.45, left: e.clientX - 20, top: e.clientY - 20 });
                });

                const hoverEls = document.querySelectorAll('a, button, .skill-category, .cert-card, .timeline-content, .contact-item, .project-card');
                hoverEls.forEach(el => {
                    el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(1.5)'; cursorFollower.style.transform = 'scale(1.3)'; });
                    el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; cursorFollower.style.transform = 'scale(1)'; });
                });
            } else {
                cursor.style.display = 'none'; cursorFollower.style.display = 'none';
            }
        }

        // Header hide/show on scroll
        const header = document.getElementById('header'); let lastY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (!header) return;
            const y = window.scrollY;
            if (y > lastY && y > 100) header.classList.add('hidden'); else header.classList.remove('hidden');
            lastY = y;

            const scrollTop = document.getElementById('scrollTop'); if (scrollTop) {
                scrollTop.classList.toggle('active', window.scrollY > 500);
            }
        });

        const scrollTopBtn = document.getElementById('scrollTop'); if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Project & certification interactions
        document.querySelectorAll('.project-card').forEach(card => card.addEventListener('click', function (e) { if (!e.target.closest('.project-link')) console.log('Project clicked:', (this.querySelector('h3') || {}).textContent); }));
        document.querySelectorAll('.cert-card').forEach(card => { card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-10px) scale(1.02)'; }); card.addEventListener('mouseleave', () => { card.style.transform = ''; }); });

        // Smooth anchor scrolling
        document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function (e) { e.preventDefault(); const t = document.querySelector(this.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));

        // Simple keyboard escape to close modals
        document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active')); document.body.style.overflow = ''; } });

        // Social links open in new tab with tracking hook
        document.querySelectorAll('.social-link').forEach(link => link.addEventListener('click', function (e) { e.preventDefault(); const url = this.href; console.log('Social link clicked'); window.open(url, '_blank'); }));
    }

    /* ----------------- Project Filters ----------------- */
    function initProjectFilters() {
        const buttons = document.querySelectorAll('.filter-btn'); if (!buttons.length) return;
        buttons.forEach(btn => btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.project-card').forEach(card => {
                const show = filter === 'all' || card.getAttribute('data-category') === filter;
                if (show) { card.style.display = ''; gsap.to(card, { opacity: 1, y: 0, duration: 0.45 }); }
                else { gsap.to(card, { opacity: 0, y: 18, duration: 0.28, onComplete: () => card.style.display = 'none' }); }
            });
        }));
    }

    /* ----------------- Service Worker & non-critical resources ----------------- */
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').then(() => console.log('ServiceWorker registered')).catch(e => console.log('SW reg failed', e)); });
    }

    function loadNonCriticalResources() {
        const scripts = [];
        scripts.forEach(src => { const s = document.createElement('script'); s.src = src; s.async = true; document.body.appendChild(s); });
    }

    /* ----------------- Boot ----------------- */
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize features in a safe order
        initMobileMenu();
        initLaunchScreen();
        initModalsAndForms();
        initInteractions();
        initProjectFilters();
        new PortfolioOptimizer();
        registerServiceWorker();

        // Defer non-critical
        setTimeout(loadNonCriticalResources, 3000);
    });

})();
// Enhanced Launch Screen Animation
document.addEventListener('DOMContentLoaded', function() {
    const launchScreen = document.getElementById('launchScreen');
    const particlesContainer = document.getElementById('particlesContainer');
    // Enhanced Mobile Menu Functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');

    // Enhanced Mobile Menu Functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');

    // Toggle menu
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on nav items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
            document.body.style.overflow = '';
        }
    });
}

// Enhanced Launch Screen Animation
document.addEventListener('DOMContentLoaded', function() {
    const launchScreen = document.getElementById('launchScreen');
    const particlesContainer = document.getElementById('particlesContainer');
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Create floating particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${8 + Math.random() * 7}s`;
        particlesContainer.appendChild(particle);
    }
    
    // Animate floral elements
    gsap.to('.floral-item', {
        opacity: 0.3,
        duration: 2,
        stagger: 0.2,
        ease: "power2.out"
    });
    
    // Animate main content
    gsap.to('.main-logo', {
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2
    });
    
    gsap.to('.name-title', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: 0.4
    });
    
    gsap.to('.subtitle', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: 0.6
    });
    
    gsap.to('.dot', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        delay: 0.8
    });
    
    // Hide launch screen after 2 seconds
    setTimeout(() => {
        gsap.to(launchScreen, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                launchScreen.classList.add('hidden');
                // Start main content animations
                initMainAnimations();
            }
        });
    }, 2000);
});

// Performance optimization: Lazy loading and code splitting
class PortfolioOptimizer {
    constructor() {
        this.imagesToLazyLoad = [];
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupPerformanceMonitoring();
        this.setupResourcePreloading();
    }

    setupLazyLoading() {
        // Use Intersection Observer for lazy loading images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before element is visible
                threshold: 0.1
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('lazy-loaded');
        });
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                const perfObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        console.log(`Performance Metric - ${entry.name}: ${entry.value}`);
                    });
                });

                perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
            } catch (e) {
                console.log('Performance monitoring not supported');
            }
        }

        // Monitor load times
        window.addEventListener('load', () => {
            if (performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            }
        });
    }

    setupResourcePreloading() {
        // Preload critical above-the-fold images
        const criticalImages = [
            'profile picture - bautista.jpg',
            'MOS Associate - Bautista.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Initialize performance optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new PortfolioOptimizer();
});

// Rest of your existing JavaScript functions remain the same...
// (Keep all your existing modal functionality, animations, form handling, etc.)

// Logo Modal Functionality
const modal = document.getElementById('logoModal');
const modalLogo = document.getElementById('modalLogo');
const modalClose = document.getElementById('modalClose');
const certBadges = document.querySelectorAll('.cert-badge');

certBadges.forEach(badge => {
    badge.addEventListener('click', function() {
        const logoPath = this.getAttribute('data-logo');
        modalLogo.src = logoPath;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modalClose.addEventListener('click', function() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Contact Modal Functionality
const contactModal = document.getElementById('contactModal');
const contactModalClose = document.getElementById('contactModalClose');
const contactModalOk = document.getElementById('contactModalOk');

contactModalClose.addEventListener('click', function() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
});

contactModalOk.addEventListener('click', function() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
});

contactModal.addEventListener('click', function(e) {
    if (e.target === contactModal) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ... rest of your existing JavaScript code
    // Toggle menu
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on nav items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
            document.body.style.overflow = '';
        }
    });
}

// Enhanced Launch Screen Animation
document.addEventListener('DOMContentLoaded', function() {
    const launchScreen = document.getElementById('launchScreen');
    const particlesContainer = document.getElementById('particlesContainer');
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Create floating particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${8 + Math.random() * 7}s`;
        particlesContainer.appendChild(particle);
    }
    
    // Animate floral elements
    gsap.to('.floral-item', {
        opacity: 0.3,
        duration: 2,
        stagger: 0.2,
        ease: "power2.out"
    });
    
    // Animate main content
    gsap.to('.main-logo', {
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2
    });
    
    gsap.to('.name-title', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: 0.4
    });
    
    gsap.to('.subtitle', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: 0.6
    });
    
    gsap.to('.dot', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        delay: 0.8
    });
    
    // Hide launch screen after 2 seconds
    setTimeout(() => {
        gsap.to(launchScreen, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                launchScreen.classList.add('hidden');
                // Start main content animations
                initMainAnimations();
            }
        });
    }, 2000);
});

// Performance optimization: Lazy loading and code splitting
class PortfolioOptimizer {
    constructor() {
        this.imagesToLazyLoad = [];
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupPerformanceMonitoring();
        this.setupResourcePreloading();
    }

    setupLazyLoading() {
        // Use Intersection Observer for lazy loading images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before element is visible
                threshold: 0.1
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('lazy-loaded');
        });
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                const perfObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        console.log(`Performance Metric - ${entry.name}: ${entry.value}`);
                    });
                });

                perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
            } catch (e) {
                console.log('Performance monitoring not supported');
            }
        }

        // Monitor load times
        window.addEventListener('load', () => {
            if (performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            }
        });
    }

    setupResourcePreloading() {
        // Preload critical above-the-fold images
        const criticalImages = [
            'profile picture - bautista.jpg',
            'MOS Associate - Bautista.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Initialize performance optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new PortfolioOptimizer();
});

// Rest of your existing JavaScript functions remain the same...
// (Keep all your existing modal functionality, animations, form handling, etc.)

// Logo Modal Functionality
const modal = document.getElementById('logoModal');
const modalLogo = document.getElementById('modalLogo');
const modalClose = document.getElementById('modalClose');
const certBadges = document.querySelectorAll('.cert-badge');

certBadges.forEach(badge => {
    badge.addEventListener('click', function() {
        const logoPath = this.getAttribute('data-logo');
        modalLogo.src = logoPath;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modalClose.addEventListener('click', function() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Contact Modal Functionality
const contactModal = document.getElementById('contactModal');
const contactModalClose = document.getElementById('contactModalClose');
const contactModalOk = document.getElementById('contactModalOk');

contactModalClose.addEventListener('click', function() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
});

contactModalOk.addEventListener('click', function() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
});

contactModal.addEventListener('click', function(e) {
    if (e.target === contactModal) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});
    // Create floating particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${8 + Math.random() * 7}s`;
        particlesContainer.appendChild(particle);
    }
    
    // Animate floral elements
    gsap.to('.floral-item', {
        opacity: 0.3,
        duration: 2,
        stagger: 0.2,
        ease: "power2.out"
    });
    
    // Animate main content
    gsap.to('.main-logo', {
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2
    });
    
    gsap.to('.name-title', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: 0.4
    });
    
    gsap.to('.subtitle', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: 0.6
    });
    
    gsap.to('.dot', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        delay: 0.8
    });
    
    // Hide launch screen after 2 seconds
    setTimeout(() => {
        gsap.to(launchScreen, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                launchScreen.classList.add('hidden');
                // Start main content animations
                initMainAnimations();
            }
        });
    }, 2000);
});

// Logo Modal Functionality
const modal = document.getElementById('logoModal');
const modalLogo = document.getElementById('modalLogo');
const modalClose = document.getElementById('modalClose');
const certBadges = document.querySelectorAll('.cert-badge');

certBadges.forEach(badge => {
    badge.addEventListener('click', function() {
        const logoPath = this.getAttribute('data-logo');
        modalLogo.src = logoPath;
        modal.classList.add('active');
    });
});

modalClose.addEventListener('click', function() {
    modal.classList.remove('active');
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Contact Modal Functionality
const contactModal = document.getElementById('contactModal');
const contactModalClose = document.getElementById('contactModalClose');
const contactModalOk = document.getElementById('contactModalOk');

contactModalClose.addEventListener('click', function() {
    contactModal.classList.remove('active');
});

contactModalOk.addEventListener('click', function() {
    contactModal.classList.remove('active');
});

contactModal.addEventListener('click', function(e) {
    if (e.target === contactModal) {
        contactModal.classList.remove('active');
    }
});

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor - Hide on mobile
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const isMobile = window.innerWidth <= 768;

if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        gsap.to(cursorFollower, {
            duration: 0.5,
            left: e.clientX - 20,
            top: e.clientY - 20
        });
    });

    // Hover effects for cursor
    const hoverElements = document.querySelectorAll('a, button, .skill-category, .cert-card, .timeline-content, .contact-item, .project-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
} else {
    // Hide cursor on mobile
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classList.toggle('fa-times');
});

// Header hide/show on scroll
let lastScrollY = window.scrollY;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;
    
    // Scroll to top button
    const scrollTop = document.getElementById('scrollTop');
    if (window.scrollY > 500) {
        scrollTop.classList.add('active');
    } else {
        scrollTop.classList.remove('active');
    }
});

// Scroll to top functionality
document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Main content animations - Faster animations
function initMainAnimations() {
    // Hero section animations
    gsap.to('.hero-content h1', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.3
    });

    gsap.to('.hero-content p', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.5
    });

    gsap.to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.7
    });

    // Section title animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // About section animations
    gsap.to('.about-text', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.to('.about-image', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse'
        }
    });

    // Skills animations
    gsap.utils.toArray('.skill-category').forEach((skill, i) => {
        gsap.to(skill, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: skill,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Projects animations
    gsap.utils.toArray('.project-card').forEach((project, i) => {
        gsap.to(project, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: project,
                start: 'top 90%',
                end: 'bottom 10%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Certifications animations
    gsap.utils.toArray('.cert-card').forEach((cert, i) => {
        gsap.to(cert, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: cert,
                start: 'top 90%',
                end: 'bottom 10%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Education timeline animations
    gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.to(item, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Contact animations
    gsap.utils.toArray('.contact-item').forEach((item, i) => {
        gsap.to(item, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: i * 0.15,
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 75%',
                end: 'bottom 25%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    gsap.to('.contact-form', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.contact-container',
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse'
        }
    });

    // Floating shapes animation
    gsap.to('.shape-1', {
        y: -30,
        rotation: 360,
        duration: 15,
        repeat: -1,
        ease: "none"
    });

    gsap.to('.shape-2', {
        y: 20,
        rotation: -360,
        duration: 20,
        repeat: -1,
        ease: "none"
    });

    gsap.to('.shape-3', {
        y: -20,
        rotation: 180,
        duration: 18,
        repeat: -1,
        ease: "none"
    });

    // Background shapes animation
    gsap.to('.bg-shape-1', {
        y: -50,
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "none"
    });

    gsap.to('.bg-shape-2', {
        y: 30,
        rotation: -360,
        duration: 30,
        repeat: -1,
        ease: "none"
    });

    gsap.to('.bg-shape-3', {
        y: -30,
        rotation: 180,
        duration: 28,
        repeat: -1,
        ease: "none"
    });
}

// Project Filter Functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            document.querySelectorAll('.project-card').forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    gsap.to(card, { opacity: 1, y: 0, duration: 0.5 });
                } else {
                    gsap.to(card, { 
                        opacity: 0, 
                        y: 20, 
                        duration: 0.3,
                        onComplete: () => card.style.display = 'none'
                    });
                }
            });
        });
    });
}

// Form Validation
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    
    // Name validation
    if (name.length < 2) {
        showError('name', 'Please enter your full name');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (subject.length < 5) {
        showError('subject', 'Please enter a descriptive subject');
        isValid = false;
    }
    
    // Message validation
    if (message.length < 10) {
        showError('message', 'Please enter a message with at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error)';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorElement);
}

// Form Submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual form submission)
    setTimeout(() => {
        // Show success modal
        contactModal.classList.add('active');
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Log form data (in real implementation, send to server)
        console.log('Form submitted:', formObject);
    }, 1500);
});

// Enhanced project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.project-link')) {
            // Add your project detail view logic here
            console.log('Project clicked:', this.querySelector('h3').textContent);
        }
    });
});

// Enhanced certification interactions
document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced form validation
const formInputs = document.querySelectorAll('.form-control');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = 'var(--error)';
        } else {
            this.style.borderColor = 'var(--primary)';
        }
    });

    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.style.borderColor = 'var(--primary)';
        }
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        contactModal.classList.remove('active');
        modal.classList.remove('active');
    }
});

// Enhanced social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.querySelector('i').className.split(' ')[1];
        const url = this.href;
        
        // Add analytics tracking here
        console.log(`Social link clicked: ${platform}`);
        
        // Open in new tab
        window.open(url, '_blank');
    });
});

class PortfolioOptimizer {
    constructor() {
        this.imagesToLazyLoad = [];
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupPerformanceMonitoring();
        this.setupResourcePreloading();
    }

    setupLazyLoading() {
        // Use Intersection Observer for lazy loading images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.log(`${entry.name}: ${entry.value}`);
                    // You can send these metrics to your analytics service
                    this.sendMetricsToAnalytics(entry);
                });
            });

            perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        }

        // Monitor load times
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });
    }

    setupResourcePreloading() {
        // Preload critical above-the-fold images
        const criticalImages = [
            'profile picture - bautista.jpg',
            'MOS Associate - Bautista.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    sendMetricsToAnalytics(metric) {
        // Example: Send to Google Analytics or your preferred analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metric', {
                'event_category': 'Performance',
                'event_label': metric.name,
                'value': Math.round(metric.value),
                'non_interaction': true
            });
        }
    }
}

// Initialize performance optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new PortfolioOptimizer();
    
    // Rest of your existing DOMContentLoaded code...
    const launchScreen = document.getElementById('launchScreen');
    const particlesContainer = document.getElementById('particlesContainer');
    
    // ... (keep your existing launch screen code)
});

// Code splitting: Load non-critical functionality after main content
function loadNonCriticalResources() {
    // Load social media widgets or analytics after main content
    const scriptsToLoad = [
        // Add any non-critical third-party scripts here
    ];

    scriptsToLoad.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
    });
}

// Load non-critical resources after a delay
setTimeout(loadNonCriticalResources, 3000);

// Enhanced error handling for better user experience
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
    // You can send errors to your error tracking service here
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}



// Initialize project filters
initProjectFilters();

