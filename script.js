// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTabs();
    initializeAnimations();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Update active nav link based on current page
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length === 0 || tabPanes.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Animate tab content
                targetPane.style.opacity = '0';
                targetPane.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    targetPane.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    targetPane.style.opacity = '1';
                    targetPane.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    });
}

// Animation and scroll effects
function initializeAnimations() {
    // Smooth scroll for internal links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements on page load
    animateOnLoad();
}

function animateOnLoad() {
    // Elements to animate on page load
    const heroElements = document.querySelectorAll('.hero-content, .hero-image');
    
    heroElements.forEach((element, index) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 300);
        }
    });

    // Trigger initial animations for other elements
    setTimeout(() => {
        const otherElements = document.querySelectorAll('.overview-card, .skill-category, .achievement-card, .project-card');
        otherElements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.classList.add('animate-in');
                }, index * 150);
            }
        });
    }, 600);
}

function initializeScrollEffects() {
    // Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const opacity = Math.min(scrolled / 100, 1);
            navbar.style.background = `rgba(255, 255, 255, ${0.95 + (opacity * 0.05)})`;
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations (with existence check)
    const observeElements = document.querySelectorAll('.overview-card, .skill-category, .achievement-card, .project-card');
    observeElements.forEach(el => {
        if (el) {
            observer.observe(el);
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Progress bar animation for project cards
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Card hover effects
function initializeCardEffects() {
    const cards = document.querySelectorAll('.overview-card, .achievement-card, .project-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize card effects and progress bars when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCardEffects();
    
    // Animate progress bars after a delay
    setTimeout(animateProgressBars, 1000);
});

// Handle form submissions (if any forms are added later)
function handleFormSubmission(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            submitButton.textContent = 'Sent!';
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                form.reset();
            }, 2000);
        }, 1000);
    });
}

// Keyboard navigation for tabs
document.addEventListener('keydown', function(e) {
    const activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab) return;
    
    const allTabs = Array.from(document.querySelectorAll('.tab-btn'));
    const currentIndex = allTabs.indexOf(activeTab);
    
    let nextIndex;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            nextIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
            break;
        default:
            return;
    }
    
    allTabs[nextIndex].click();
    allTabs[nextIndex].focus();
});

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace broken images with placeholder
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = '<span>📷</span>';
            this.parentNode.insertBefore(placeholder, this);
        });
    });
});

// Performance optimization: Lazy loading for images
function initializeLazyLoading() {
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

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Social link analytics (placeholder)
function trackSocialClick(platform) {
    console.log(`Social link clicked: ${platform}`);
    // Add your analytics tracking code here
}

// Add click tracking to social links
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.textContent.trim();
            trackSocialClick(platform);
        });
    });
});

// Parallax effect for hero section (optional enhancement)
function initializeParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero && window.innerWidth > 768) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }, 16));
    }
}

// Theme toggle functionality (for future enhancement)
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    initializeParallax();
    initializeThemeToggle();
});

// Console message for developers
console.log('🚀 Portfolio website loaded successfully!');
console.log('Built with vanilla HTML, CSS, and JavaScript');
console.log('Featuring JetBrains Mono typography and modern design principles');
