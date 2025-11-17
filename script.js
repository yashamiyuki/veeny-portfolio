// Enhanced Launch Screen Animation
document.addEventListener('DOMContentLoaded', function() {
    const launchScreen = document.getElementById('launchScreen');
    const particlesContainer = document.getElementById('particlesContainer');
    
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