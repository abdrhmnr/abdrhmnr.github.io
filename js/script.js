// ===== GLOBAL VARIABLES =====
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 500);
    }
});

// ===== DARK MODE TOGGLE =====
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileDarkToggle = document.getElementById('mobileDarkToggle');
const body = document.body;

// Check for saved dark mode preference or system preference
const savedTheme = localStorage.getItem('darkMode');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'enabled' || (!savedTheme && prefersDark)) {
    body.classList.add('dark-mode');
    updateDarkModeUI(true);
}

// Update UI based on dark mode state
function updateDarkModeUI(isDark) {
    if (darkModeToggle) {
        darkModeToggle.setAttribute('aria-pressed', isDark);
    }
    if (mobileDarkToggle) {
        mobileDarkToggle.setAttribute('aria-pressed', isDark);
    }
}

// Desktop dark mode toggle
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        toggleDarkMode();
        
        // Add animation
        darkModeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            darkModeToggle.style.transform = '';
        }, 300);
    });
}

// Mobile dark mode toggle
if (mobileDarkToggle) {
    mobileDarkToggle.addEventListener('click', () => {
        toggleDarkMode();
    });
}

// Toggle dark mode function
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    
    // Save preference
    if (isDark) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.removeItem('darkMode');
    }
    
    updateDarkModeUI(isDark);
}

// ===== COLOR THEME PICKER =====
const colorPickerBtn = document.getElementById('colorPickerBtn');
const colorPickerMenu = document.getElementById('colorPickerMenu');
const colorOptions = document.querySelectorAll('.color-option');
const mobileColorOptions = document.querySelectorAll('.mobile-color-option');

// Check for saved color theme
const savedColor = localStorage.getItem('colorTheme') || 'blue';
body.classList.add(`theme-${savedColor}`);

// Update active color option (Desktop & Mobile)
updateActiveColorOption(savedColor);

function updateActiveColorOption(color) {
    document.querySelectorAll('.color-option, .mobile-color-option').forEach(option => {
        const isActive = option.dataset.color === color;
        option.classList.toggle('active', isActive);
        option.setAttribute('aria-checked', isActive);
    });
}

// Toggle color picker menu (Desktop)
if (colorPickerBtn && colorPickerMenu) {
    colorPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = colorPickerMenu.classList.toggle('active');
        colorPickerBtn.setAttribute('aria-expanded', isOpen);
    });
}

// Close color picker when clicking outside
document.addEventListener('click', (e) => {
    if (colorPickerMenu && 
        !colorPickerMenu.contains(e.target) && 
        e.target !== colorPickerBtn) {
        colorPickerMenu.classList.remove('active');
        if (colorPickerBtn) {
            colorPickerBtn.setAttribute('aria-expanded', 'false');
        }
    }
});

// Color theme selection function
function selectColorTheme(selectedColor, clickedOption) {
    // Remove all theme classes
    body.classList.remove('theme-blue', 'theme-green', 'theme-orange', 'theme-purple', 'theme-red', 'theme-teal');
    
    // Add selected theme
    body.classList.add(`theme-${selectedColor}`);
    
    // Update active state for all options (desktop and mobile)
    updateActiveColorOption(selectedColor);
    
    // Save preference
    localStorage.setItem('colorTheme', selectedColor);
    
    // Add animation to clicked option
    if (clickedOption) {
        clickedOption.style.transform = 'scale(1.2)';
        setTimeout(() => {
            clickedOption.style.transform = '';
        }, 200);
    }
    
    // Close desktop menu if open
    if (colorPickerMenu) {
        colorPickerMenu.classList.remove('active');
        if (colorPickerBtn) {
            colorPickerBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

// Desktop color theme selection
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectColorTheme(option.dataset.color, option);
    });
});

// Mobile color theme selection
mobileColorOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectColorTheme(option.dataset.color, option);
    });
});

// ===== MOBILE NAVIGATION TOGGLE =====
if (burger && nav) {
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        const anchor = link.querySelector('a');
        if (anchor) {
            anchor.addEventListener('click', () => {
                closeMobileMenu();
            });
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !burger.contains(e.target) && 
            !nav.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const isActive = nav.classList.toggle('active');
    burger.classList.toggle('toggle');
    burger.setAttribute('aria-expanded', isActive);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
}

function closeMobileMenu() {
    nav.classList.remove('active');
    burger.classList.remove('toggle');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#' || targetId === '#!') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (nav && nav.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
});

// ===== ACTIVE NAVIGATION LINKS =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== NAVBAR BACKGROUND ON SCROLL =====
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Update active navigation
            updateActiveNavLink();
            
            // Change navbar background
            if (navbar) {
                if (scrollTop > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            // Show/hide scroll to top button
            const scrollToTopBtn = document.getElementById('scrollToTop');
            if (scrollToTopBtn) {
                if (scrollTop > 300) {
                    scrollToTopBtn.classList.add('visible');
                    scrollToTopBtn.setAttribute('aria-hidden', 'false');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                    scrollToTopBtn.setAttribute('aria-hidden', 'true');
                }
            }
            
            lastScrollTop = scrollTop;
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ===== SCROLL TO TOP BUTTON =====
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
            
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards (EXCEPT hero and profile-image)
document.querySelectorAll('section:not(.hero), .service-card, .project-card, .feature-compact, .recommendation-card, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Force hero to be visible immediately
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.style.opacity = '1';
    heroSection.style.transform = 'translateY(0)';
    heroSection.style.visibility = 'visible';
}

// Force profile image to be visible
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    profileImage.style.opacity = '1';
    profileImage.style.transform = 'translateY(0)';
    profileImage.style.visibility = 'visible';
    profileImage.style.display = 'block';
}

const profileImg = document.querySelector('.profile-image img');
if (profileImg) {
    profileImg.style.opacity = '1';
    profileImg.style.display = 'block';
}
// ===== FORM VALIDATION & SUBMISSION =====
const form = document.querySelector('#contactForm');
const formStatus = document.querySelector('.form-status');

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
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
                emailInput.style.borderColor = 'var(--border-color)';
                emailInput.setCustomValidity('');
            }
        });
        
        emailInput.addEventListener('input', () => {
            emailInput.setCustomValidity('');
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Get and sanitize form values
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const subjectInput = form.querySelector('input[name="subject"]');
        const messageInput = form.querySelector('textarea[name="message"]');
        
        const name = sanitizeInput(nameInput.value.trim());
        const email = sanitizeInput(emailInput.value.trim());
        const subject = sanitizeInput(subjectInput.value.trim());
        const message = sanitizeInput(messageInput.value.trim());
        
        // Validate form
        if (!name || !email || !subject || !message) {
            showFormStatus('⚠️ Please fill in all required fields!', 'error');
            return;
        }
        
        // Name length validation
        if (name.length < 2 || name.length > 100) {
            showFormStatus('⚠️ Name must be between 2-100 characters!', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus('⚠️ Please enter a valid email address!', 'error');
            return;
        }
        
        // Subject length validation
        if (subject.length < 3 || subject.length > 200) {
            showFormStatus('⚠️ Subject must be between 3-200 characters!', 'error');
            return;
        }
        
        // Message length validation
        if (message.length < 10 || message.length > 1000) {
            showFormStatus('⚠️ Message must be between 10-1000 characters!', 'error');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                
                // Add confetti effect
                createConfetti();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            showFormStatus('❌ Failed to send message. Please try again or contact me directly via email.', 'error');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

function showFormStatus(message, type) {
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
        
        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Optimized confetti effect using DocumentFragment
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#fbbf24', '#10b981'];
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            left: ${Math.random() * 100}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-delay: ${Math.random() * 200}ms;
        `;
        fragment.appendChild(confetti);
    }
    
    document.body.appendChild(fragment);
    
    // Cleanup after animation
    setTimeout(() => {
        document.querySelectorAll('.confetti-piece').forEach(c => c.remove());
    }, 3000);
}

// ===== CLIENTS SLIDER =====
document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.querySelector('.clients-slider-wrapper');
    const slider = document.querySelector('.clients-slider');
    const slides = document.querySelectorAll('.client-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    // Exit if slider not found
    if (!slider || slides.length === 0) {
        return;
    }
    
    let currentIndex = 0;
    let autoplayInterval;
    let isAnimating = false;
    
    // Calculate how many slides to show based on screen width
    function getSlidesToShow() {
        const width = window.innerWidth;
        if (width >= 1024) return 3;
        if (width >= 768) return 2;
        return 1;
    }
    
    // Calculate total pages
    function getTotalPages() {
        const slidesToShow = getSlidesToShow();
        return Math.ceil(slides.length / slidesToShow);
    }
    
    // Create dots based on pages
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        const totalPages = getTotalPages();
        
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', i === 0);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Get slider container width
    function getContainerWidth() {
        return sliderWrapper.offsetWidth;
    }
    
    // Calculate slide width with gap
    function getSlideWidth() {
        const containerWidth = getContainerWidth();
        const slidesToShow = getSlidesToShow();
        const gap = window.innerWidth < 768 ? 20 : 32;
        const totalGaps = (slidesToShow - 1) * gap;
        return (containerWidth - totalGaps) / slidesToShow;
    }
    
    // Set slide widths dynamically
    function setSlideWidths() {
        const slideWidth = getSlideWidth();
        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
            slide.style.minWidth = `${slideWidth}px`;
            slide.style.maxWidth = `${slideWidth}px`;
        });
    }
    
    // Update slider position
    function updateSlider(animate = true) {
        if (slides.length === 0) return;
        
        const slideWidth = getSlideWidth();
        const gap = window.innerWidth < 768 ? 20 : 32;
        const moveDistance = (slideWidth + gap) * currentIndex;
        
        if (animate) {
            slider.style.transition = 'transform 0.5s ease-in-out';
        } else {
            slider.style.transition = 'none';
        }
        
        slider.style.transform = `translateX(-${moveDistance}px)`;
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        const currentPage = Math.floor(currentIndex / getSlidesToShow());
        
        dots.forEach((dot, index) => {
            const isActive = index === currentPage;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive);
        });
        
        // Update button states
        const totalPages = getTotalPages();
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.setAttribute('aria-disabled', currentIndex === 0);
        }
        if (nextBtn) {
            nextBtn.disabled = currentIndex >= (totalPages - 1) * getSlidesToShow();
            nextBtn.setAttribute('aria-disabled', currentIndex >= (totalPages - 1) * getSlidesToShow());
        }
    }
    
    // Go to specific slide
    function goToSlide(pageIndex) {
        if (isAnimating) return;
        
        isAnimating = true;
        const slidesToShow = getSlidesToShow();
        currentIndex = pageIndex * slidesToShow;
        
        const maxIndex = slides.length - slidesToShow;
        currentIndex = Math.min(currentIndex, maxIndex);
        currentIndex = Math.max(0, currentIndex);
        
        updateSlider();
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Next slide
    function nextSlide() {
        if (isAnimating) return;
        
        const slidesToShow = getSlidesToShow();
        const maxIndex = slides.length - slidesToShow;
        
        if (currentIndex < maxIndex) {
            currentIndex += slidesToShow;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
        } else {
            currentIndex = 0;
        }
        
        updateSlider();
        
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Previous slide
    function prevSlide() {
        if (isAnimating) return;
        
        const slidesToShow = getSlidesToShow();
        
        if (currentIndex > 0) {
            currentIndex -= slidesToShow;
            if (currentIndex < 0) currentIndex = 0;
        } else {
            const maxIndex = slides.length - slidesToShow;
            currentIndex = maxIndex;
        }
        
        updateSlider();
        
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            resetAutoplay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            resetAutoplay();
        });
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    startAutoplay();
    
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', stopAutoplay);
        sliderWrapper.addEventListener('mouseleave', startAutoplay);
    }
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = Date.now();
        stopAutoplay();
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const touchDuration = Date.now() - touchStartTime;
        const swipeDistance = touchStartX - touchEndX;
        
        if (touchDuration < 500 && Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startAutoplay();
    }, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });
    
    // Resize handler with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentIndex = 0;
            setSlideWidths();
            createDots();
            updateSlider(false);
        }, 250);
    });
    
    // Initialize
    setSlideWidths();
    createDots();
    updateSlider(false);
});

// ===== PERFORMANCE OPTIMIZATION - LAZY LOAD IMAGES =====
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
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== GLOBAL IMAGE ERROR HANDLER =====
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        const img = e.target;
        
        // Use data-fallback if available
        if (img.dataset.fallback && img.src !== img.dataset.fallback) {
            img.src = img.dataset.fallback;
        } 
        // Otherwise create a placeholder
        else if (!img.src.includes('via.placeholder.com')) {
            const alt = img.alt || 'Image';
            img.src = `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(alt)}`;
        }
        
        console.warn(`Failed to load image: ${e.target.src}`);
    }
}, true);

// ===== PARALLAX EFFECT ON HERO (Throttled) =====
const hero = document.querySelector('.hero');
if (hero && window.innerWidth >= 768) {
    // Throttle function
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall < delay) return;
            lastCall = now;
            return func(...args);
        };
    }
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.3;
        
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }, 16), { passive: true }); // ~60fps
}

// ===== STATS COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    // Function to format number with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target) + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current)) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const targetAttr = entry.target.getAttribute('data-target');
            if (targetAttr) {
                const target = parseInt(targetAttr);
                if (!isNaN(target)) {
                    animateCounter(entry.target, target);
                }
            }
            // Unobserve after counting
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat h3, .client-stat h3, .rec-stat h3').forEach(stat => {
    const text = stat.textContent.trim();
    
    // Handle special cases like "5★", "100%", "8,500+"
    // Remove commas first, then extract number and suffix
    const cleanText = text.replace(/,/g, ''); // Remove all commas
    const match = cleanText.match(/(\d+)([+%★]*)/);
    
    if (match) {
        const number = parseInt(match[1]);
        const suffix = match[2] || '';
        
        stat.setAttribute('data-target', number);
        stat.dataset.suffix = suffix;
        stat.dataset.original = text; // Keep original with comma
        stat.textContent = '0' + suffix;
        statsObserver.observe(stat);
    }
});

// ===== COPY EMAIL TO CLIPBOARD =====
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const email = link.href.replace('mailto:', '');
            
            try {
                await navigator.clipboard.writeText(email);
                
                // Show tooltip
                const tooltip = document.createElement('div');
                tooltip.textContent = '✓ Copied!';
                tooltip.style.cssText = `
                    position: fixed;
                    background: var(--success-color);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    font-size: 0.9rem;
                    z-index: 9999;
                    pointer-events: none;
                    animation: fadeIn 0.3s ease;
                    box-shadow: var(--shadow-md);
                `;
                tooltip.style.left = e.clientX + 'px';
                tooltip.style.top = (e.clientY - 40) + 'px';
                document.body.appendChild(tooltip);
                
                setTimeout(() => {
                    tooltip.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => tooltip.remove(), 300);
                }, 2000);
            } catch (err) {
                console.error('Failed to copy email:', err);
                alert('Failed to copy email. Please copy manually: ' + email);
            }
        }
    });
});

// ===== SERVICE WORKER REGISTRATION (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registered:', reg))
            .catch(err => console.log('❌ SW registration failed:', err));
    });
}

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
    if (performance && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Page loaded in ${(loadTime / 1000).toFixed(2)} seconds`);
        
        // Log Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('🎨 LCP:', lastEntry.renderTime || lastEntry.loadTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('⚡ FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            let clsScore = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                }
                console.log('📐 CLS:', clsScore);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
});

// ===== CONSOLE MESSAGES =====
console.log('%c👋 Welcome to my portfolio!', 'color: #667eea; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
console.log('%c🚀 Built with passion and modern web technologies', 'color: #764ba2; font-size: 16px; font-weight: bold;');
console.log('%c💼 Abdelrahman Habeeb | Data Scientist & AI Engineer', 'color: #10b981; font-size: 14px;');
console.log('%c📧 Contact: abdrhmnr1@gmail.com', 'color: #3b82f6; font-size: 12px;');
console.log('%c🔗 GitHub: https://github.com/abdrhmnr', 'color: #6366f1; font-size: 12px;');
console.log('%c💡 Tip: Press Ctrl+Click on email links to copy them!', 'color: #f59e0b; font-size: 11px; font-style: italic;');
console.log('%c🎨 Try changing themes with the palette icon!', 'color: #ec4899; font-size: 11px; font-style: italic;');
console.log('%c🌙 Toggle dark mode for comfortable viewing!', 'color: #8b5cf6; font-size: 11px; font-style: italic;');

// ===== INITIALIZATION COMPLETE =====
console.log('%c✨ Portfolio fully loaded and interactive!', 'color: #10b981; font-size: 14px; font-weight: bold;');
console.log('%c⏱️ Total initialization time: ' + (performance.now() / 1000).toFixed(2) + 's', 'color: #667eea; font-size: 12px;');