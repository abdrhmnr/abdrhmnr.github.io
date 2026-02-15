/* ╔══════════════════════════════════════════════╗
   ║     ABDRHMNR — UNIFIED PORTFOLIO JS         ║
   ║     3 Modes: Nerd + Classic + Night         ║
   ║     FIXED VERSION v2.1                      ║
   ╚══════════════════════════════════════════════╝ */

// ══════════════════════════════════════════
// HELPER FUNCTION - Check if Mobile
// ══════════════════════════════════════════
function isMobile() {
    return window.innerWidth <= 640;
}

// ══════════════════════════════════════════
// BINARY RAIN CANVAS
// ══════════════════════════════════════════
const canvas = document.getElementById('binaryCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

const binaryChars = '01';
const fontSize = 14;
let columns = canvas ? Math.floor(canvas.width / fontSize) : 0;
let drops = Array(columns).fill(1);

function getAccentColor() {
    return getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#00ff41';
}

function drawBinaryRain() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const color = getAccentColor();
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px JetBrains Mono, monospace`;

    for (let i = 0; i < drops.length; i++) {
        const char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

let binaryInterval = null;

function startBinaryRain() {
    if (binaryInterval) clearInterval(binaryInterval);
    const mode = document.body.getAttribute('data-mode');
    if (mode === 'nerd' && canvas) {
        canvas.style.display = 'block';
        binaryInterval = setInterval(drawBinaryRain, 50);
    } else if (canvas) {
        canvas.style.display = 'none';
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

startBinaryRain();

window.addEventListener('resize', () => {
    resizeCanvas();
    columns = canvas ? Math.floor(canvas.width / fontSize) : 0;
    drops = Array(columns).fill(1);
});

// Reduce animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (binaryInterval) clearInterval(binaryInterval);
    } else {
        startBinaryRain();
    }
});

// ══════════════════════════════════════════
// BOOT LOADER (Fixed)
// ══════════════════════════════════════════
function hideBootLoader() {
    const loader = document.getElementById('bootLoader');
    if (!loader) return;
    
    loader.classList.add('hidden');
    setTimeout(() => {
        if (loader.parentNode) {
            loader.remove();
        }
    }, 600);
}

// Hide loader when page loads
window.addEventListener('load', () => {
    const loader = document.getElementById('bootLoader');
    const mode = document.body.getAttribute('data-mode');

    if (loader) {
        if (mode !== 'nerd') {
            // Instantly hide for classic & night
            hideBootLoader();
        } else {
            // Show boot sequence for nerd mode, then hide
            setTimeout(hideBootLoader, 2200);
        }
    }
});

// Fallback: Hide loader after 4 seconds no matter what
setTimeout(() => {
    const loader = document.getElementById('bootLoader');
    if (loader && !loader.classList.contains('hidden')) {
        console.warn('Boot loader fallback triggered');
        hideBootLoader();
    }
}, 4000);

// Also hide on DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
    const mode = document.body.getAttribute('data-mode');
    if (mode !== 'nerd') {
        hideBootLoader();
    }
});

// ══════════════════════════════════════════
// THEME SYSTEM (6 Color Themes)
// ══════════════════════════════════════════
const themePicker = document.getElementById('themePicker');
const themeDropdown = document.getElementById('themeDropdown');
const themeOptions = document.querySelectorAll('.theme-option');
const mobileThemeBtns = document.querySelectorAll('.mobile-theme-btn');

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'matrix';
document.body.setAttribute('data-theme', savedTheme);
setActiveTheme(savedTheme);

function setActiveTheme(themeName) {
    themeOptions.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === themeName);
    });
    mobileThemeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
}

function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('portfolio-theme', themeName);
    setActiveTheme(themeName);

    // Clear and restart binary rain with new color
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drops = Array(columns).fill(1);
    }

    // Update meta theme-color
    updateMetaThemeColor();
}

function updateMetaThemeColor() {
    const mode = document.body.getAttribute('data-mode');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        if (mode === 'classic') {
            metaTheme.content = '#f5f5f7';
        } else if (mode === 'night') {
            metaTheme.content = '#0f0f17';
        } else {
            metaTheme.content = '#0a0a0f';
        }
    }
}

// Desktop theme picker
if (themePicker && themeDropdown) {
    themePicker.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('active');
    });
}

themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        applyTheme(opt.dataset.theme);
        themeDropdown.classList.remove('active');
    });
});

mobileThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        applyTheme(btn.dataset.theme);
    });
});

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    if (themeDropdown && !themeDropdown.contains(e.target) && e.target !== themePicker) {
        themeDropdown.classList.remove('active');
    }
});

// ══════════════════════════════════════════
// MODE SYSTEM (3 Modes: Nerd / Classic / Night)
// ══════════════════════════════════════════
const desktopModeBtns = document.querySelectorAll('.mode-switcher .mode-btn');
const mobileModeBtns = document.querySelectorAll('.mobile-mode-btn');

// Load saved mode
const savedMode = localStorage.getItem('portfolio-mode') || 'nerd';
document.body.setAttribute('data-mode', savedMode);
updateModeUI(savedMode);

function updateModeUI(mode) {
    // Update desktop buttons
    desktopModeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Update mobile buttons
    mobileModeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Handle binary canvas
    startBinaryRain();

    // Handle boot loader
    const bootLoader = document.getElementById('bootLoader');
    if (bootLoader && mode !== 'nerd') {
        bootLoader.classList.add('hidden');
        setTimeout(() => {
            if (bootLoader.parentNode) bootLoader.remove();
        }, 100);
    }

    // Update meta theme-color
    updateMetaThemeColor();
}

function switchMode(newMode) {
    const currentMode = document.body.getAttribute('data-mode');
    if (currentMode === newMode) return;

    // Smooth transition
    document.body.style.transition = 'background 0.5s ease, color 0.3s ease';

    document.body.setAttribute('data-mode', newMode);
    localStorage.setItem('portfolio-mode', newMode);
    updateModeUI(newMode);

    // Restart binary rain if switching to nerd
    if (newMode === 'nerd' && ctx && canvas) {
        canvas.style.display = 'block';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drops = Array(columns).fill(1);
        startBinaryRain();
    }

    // Remove transition after switch
    setTimeout(() => {
        document.body.style.transition = '';
    }, 600);

    console.log(`%c🔄 Mode switched to: ${newMode}`, 'color: var(--accent); font-weight: bold;');
}

// Desktop mode buttons
desktopModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchMode(btn.dataset.mode);
    });
});

// Mobile mode buttons
mobileModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchMode(btn.dataset.mode);
    });
});

// ══════════════════════════════════════════
// MOBILE MENU
// ══════════════════════════════════════════
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileBackdrop = document.getElementById('mobileBackdrop');

function openMobileMenu() {
    if (!burger || !mobileMenu) return;
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    if (mobileBackdrop) mobileBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    if (!burger || !mobileMenu) return;
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    document.body.style.overflow = '';
}

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', closeMobileMenu);
    }

    mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// ══════════════════════════════════════════
// SMOOTH SCROLLING
// ══════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#!') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 56;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
});

// ══════════════════════════════════════════
// ACTIVE NAV TAB
// ══════════════════════════════════════════
const navTabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('section[id]');

function updateActiveTab() {
    const scrollPos = window.pageYOffset + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.section === sectionId);
            });

            // Update mobile links too
            if (mobileMenu) {
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
                });
            }
        }
    });
}

// ══════════════════════════════════════════
// NAVBAR SCROLL EFFECTS
// ══════════════════════════════════════════
const navbar = document.getElementById('navbar');
const scrollToTopBtn = document.getElementById('scrollToTop');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset;

            // Navbar background
            if (navbar) {
                navbar.classList.toggle('scrolled', scrollTop > 50);
            }

            // Scroll to top button
            if (scrollToTopBtn) {
                scrollToTopBtn.classList.toggle('visible', scrollTop > 300);
                scrollToTopBtn.setAttribute('aria-hidden', scrollTop <= 300);
            }

            // Update active tab
            updateActiveTab();

            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Scroll to top
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ══════════════════════════════════════════
// TYPING ANIMATION
// ══════════════════════════════════════════
const heroTyping = document.getElementById('heroTyping');
if (heroTyping) {
    const phrases = [
        'Hello, World!',
        'Welcome to my portfolio.',
        'I turn data into insights.',
        'ML Engineer by passion.',
        '4+ years building AI solutions.',
        'Let\'s build something amazing.',
        'print("Hire me! 🚀")'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            heroTyping.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            heroTyping.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 300;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Delay start based on mode
    const initMode = document.body.getAttribute('data-mode');
    const startDelay = initMode === 'nerd' ? 2500 : 500;
    setTimeout(typeEffect, startDelay);
}

// ══════════════════════════════════════════
// SCROLL REVEAL ANIMATIONS (Mobile Fixed)
// ══════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Observe elements for reveal
document.querySelectorAll('.glass-card, .skill-block, .section-file-header, .editor-comment, .hero-stats-terminal, .client-stats-bar, .review-stats-bar').forEach(el => {
    if (isMobile()) {
        // On mobile, show everything immediately - no animations
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
    } else {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    }
});

// Force hero visible immediately
document.querySelectorAll('.hero-section, .hero-section .hero-avatar, .hero-section .hero-info, .hero-section .hero-code-block').forEach(el => {
    if (el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.visibility = 'visible';
    }
});

// ══════════════════════════════════════════
// SKILL BAR ANIMATION
// ══════════════════════════════════════════
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-block').forEach(block => {
    skillObserver.observe(block);
});

// ══════════════════════════════════════════
// COUNTER ANIMATION
// ══════════════════════════════════════════
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    const suffix = element.dataset.suffix || '';

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current)) + suffix;
        }
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.dataset.target);
            if (!isNaN(target)) {
                animateCounter(entry.target, target);
            }
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value, .cstat-value, .rstat-value').forEach(el => {
    if (el.dataset.target) {
        counterObserver.observe(el);
    }
});

// ══════════════════════════════════════════
// FORM HANDLING
// ══════════════════════════════════════════
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function showFormStatus(message, type) {
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#00ff41', '#bf00ff', '#00d4ff', '#ff6b00', '#ff2d95', '#00ffc8', '#fbbf24', '#10b981'];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            left: ${Math.random() * 100}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-delay: ${Math.random() * 200}ms;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            width: ${6 + Math.random() * 6}px;
            height: ${6 + Math.random() * 6}px;
        `;
        fragment.appendChild(confetti);
    }

    document.body.appendChild(fragment);
    setTimeout(() => {
        document.querySelectorAll('.confetti-piece').forEach(c => c.remove());
    }, 3500);
}

if (form) {
    // Real-time email validation
    const emailInput = form.querySelector('input[name="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                emailInput.style.borderColor = 'var(--error-color)';
                emailInput.setCustomValidity('Please enter a valid email address');
            } else {
                emailInput.style.borderColor = '';
                emailInput.setCustomValidity('');
            }
        });

        emailInput.addEventListener('input', () => {
            emailInput.style.borderColor = '';
            emailInput.setCustomValidity('');
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        const name = sanitizeInput(form.querySelector('input[name="name"]').value.trim());
        const email = sanitizeInput(form.querySelector('input[name="email"]').value.trim());
        const subject = sanitizeInput(form.querySelector('input[name="subject"]').value.trim());
        const message = sanitizeInput(form.querySelector('textarea[name="message"]').value.trim());

        // Validation
        if (!name || !email || !subject || !message) {
            showFormStatus('⚠️ Please fill in all required fields!', 'error');
            return;
        }

        if (name.length < 2 || name.length > 100) {
            showFormStatus('⚠️ Name must be between 2-100 characters!', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus('⚠️ Please enter a valid email address!', 'error');
            return;
        }

        if (subject.length < 3 || subject.length > 200) {
            showFormStatus('⚠️ Subject must be between 3-200 characters!', 'error');
            return;
        }

        if (message.length < 10 || message.length > 1000) {
            showFormStatus('⚠️ Message must be between 10-1000 characters!', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showFormStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                createConfetti();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showFormStatus('❌ Failed to send message. Please try again or contact me directly via email.', 'error');
            console.error('Form error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// ══════════════════════════════════════════
// LAZY LOAD IMAGES
// ══════════════════════════════════════════
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ══════════════════════════════════════════
// IMAGE ERROR HANDLER
// ══════════════════════════════════════════
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        const img = e.target;
        if (img.dataset.fallback && img.src !== img.dataset.fallback) {
            img.src = img.dataset.fallback;
        } else if (!img.src.includes('via.placeholder.com')) {
            const alt = img.alt || 'Image';
            const mode = document.body.getAttribute('data-mode');
            const bg = mode === 'classic' ? '667eea' : '0a0a0f';
            const fg = mode === 'classic' ? 'ffffff' : '00ff41';
            img.src = `https://via.placeholder.com/400x300/${bg}/${fg}?text=${encodeURIComponent(alt)}`;
        }
    }
}, true);

// ══════════════════════════════════════════
// COPY EMAIL (Ctrl+Click)
// ══════════════════════════════════════════
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', async (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const email = link.href.replace('mailto:', '');

            try {
                await navigator.clipboard.writeText(email);

                const tooltip = document.createElement('div');
                tooltip.textContent = '✓ Copied!';
                tooltip.style.cssText = `
                    position: fixed;
                    background: var(--accent);
                    color: var(--bg-primary);
                    padding: 6px 14px;
                    border-radius: 8px;
                    font-family: var(--font-sans);
                    font-size: 0.8rem;
                    font-weight: 600;
                    z-index: 9999;
                    pointer-events: none;
                    left: ${e.clientX}px;
                    top: ${e.clientY - 40}px;
                    animation: fadeIn 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                `;
                document.body.appendChild(tooltip);

                setTimeout(() => {
                    tooltip.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => tooltip.remove(), 300);
                }, 2000);
            } catch (err) {
                alert('Failed to copy email: ' + email);
            }
        }
    });
});

// ══════════════════════════════════════════
// PARALLAX HERO (Desktop only, Nerd mode)
// ══════════════════════════════════════════
const heroSection = document.querySelector('.hero-section');

function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
    };
}

if (heroSection && window.innerWidth >= 768) {
    window.addEventListener('scroll', throttle(() => {
        const mode = document.body.getAttribute('data-mode');
        const scrolled = window.pageYOffset;

        if (scrolled < window.innerHeight) {
            if (mode === 'nerd') {
                heroSection.style.transform = `translateY(${scrolled * 0.2}px)`;
            } else {
                heroSection.style.transform = '';
            }
        }
    }, 16), { passive: true });
}

// ══════════════════════════════════════════
// CODE TYPING ANIMATION (Hero)
// ══════════════════════════════════════════
const codeLines = document.querySelectorAll('#codeTyping .code-line');
if (codeLines.length > 0) {
    const mode = document.body.getAttribute('data-mode');
    const baseDelay = mode === 'nerd' ? 2500 : 300;

    codeLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-10px)';
        line.style.transition = 'all 0.4s ease';

        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, baseDelay + (index * 150));
    });
}

// ══════════════════════════════════════════
// PERFORMANCE MONITORING
// ══════════════════════════════════════════
window.addEventListener('load', () => {
    if (performance && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Page loaded in ${(loadTime / 1000).toFixed(2)}s`);
    }

    // Core Web Vitals
    if ('PerformanceObserver' in window) {
        try {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('🎨 LCP:', (lastEntry.renderTime || lastEntry.loadTime).toFixed(0) + 'ms');
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    console.log('⚡ FID:', (entry.processingStart - entry.startTime).toFixed(0) + 'ms');
                });
            }).observe({ entryTypes: ['first-input'] });

            let clsScore = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) clsScore += entry.value;
                }
                console.log('📐 CLS:', clsScore.toFixed(3));
            }).observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            // Silent fail for unsupported browsers
        }
    }
});

// ══════════════════════════════════════════
// CONSOLE BRANDING
// ══════════════════════════════════════════
(function showConsoleBranding() {
    const mode = document.body.getAttribute('data-mode');
    if (mode === 'nerd') {
        console.log('%c╔══════════════════════════════════════╗', 'color: #00ff41; font-family: monospace;');
        console.log('%c║  👋 Welcome to abdrhmnr\'s terminal   ║', 'color: #00ff41; font-family: monospace; font-size: 14px;');
        console.log('%c╠══════════════════════════════════════╣', 'color: #00ff41; font-family: monospace;');
        console.log('%c║  🧠 Data Scientist & AI Engineer     ║', 'color: #00d4ff; font-family: monospace;');
        console.log('%c║  📧 abdrhmnr1@gmail.com              ║', 'color: #ffcb6b; font-family: monospace;');
        console.log('%c║  🔗 github.com/abdrhmnr              ║', 'color: #bf00ff; font-family: monospace;');
        console.log('%c║  💡 Ctrl+Click emails to copy!       ║', 'color: #ff6b00; font-family: monospace;');
        console.log('%c╚══════════════════════════════════════╝', 'color: #00ff41; font-family: monospace;');
    } else {
        console.log('%c👋 Welcome to my portfolio!', 'color: #667eea; font-size: 20px; font-weight: bold;');
        console.log('%c🚀 Abdelrahman Habeeb | Data Scientist & AI Engineer', 'color: #764ba2; font-size: 14px;');
        console.log('%c📧 abdrhmnr1@gmail.com', 'color: #10b981; font-size: 12px;');
        console.log('%c💡 Tip: Ctrl+Click on email links to copy!', 'color: #f59e0b; font-size: 11px;');
    }
})();

// ══════════════════════════════════════════
// SERVICE WORKER
// ══════════════════════════════════════════
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ SW registered'))
            .catch(err => console.log('SW:', err.message));
    });
}

// ══════════════════════════════════════════
// YEAR UPDATE
// ══════════════════════════════════════════
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const yearEl2 = document.getElementById('currentYear2');
if (yearEl2) yearEl2.textContent = new Date().getFullYear();

// ══════════════════════════════════════════
// INIT COMPLETE
// ══════════════════════════════════════════
console.log(`%c✨ Portfolio initialized [${document.body.getAttribute('data-mode')} mode] in ${(performance.now() / 1000).toFixed(2)}s`, 'color: #10b981; font-weight: bold;');