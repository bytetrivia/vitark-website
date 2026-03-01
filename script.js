/* ========================================
   VITARK.AI — Animations & Interactions
   ======================================== */

// --- Scroll Reveal (Intersection Observer) ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
});

// --- Mobile Menu ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-item, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// --- Smooth scroll for nav links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// --- Counter Animation ---
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();

                function updateCounter(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }
                requestAnimationFrame(updateCounter);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) counterObserver.observe(statsSection);

// --- Waitlist Form ---
const waitlistForm = document.getElementById('waitlist-form');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = waitlistForm.querySelector('.cta-input');
        const btn = waitlistForm.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<span>Joined!</span>';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        setTimeout(() => {
            input.value = '';
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 2500);
    });
}

// --- Particle Canvas ---
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    const count = Math.min(Math.floor(window.innerWidth / 18), 80);
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.15 + 0.03
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                const opacity = (1 - dist / 120) * 0.06;
                ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });

    animationId = requestAnimationFrame(drawParticles);
}

// Init particles
resizeCanvas();
createParticles();
drawParticles();

// Resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createParticles();
    }, 250);
});

// Pause particles when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        drawParticles();
    }
});
