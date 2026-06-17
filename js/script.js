/**
 * Friends Tuition Centre - Main JavaScript
 * Handles all interactive functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initSmoothScroll();
    initActiveNavLink();
    initCounterAnimation();
    initBackToTop();
    initContactForm();
    initScrollAnimations();
    initMobileMenu();
});

/**
 * Navbar Scroll Effect
 * Adds background and shadow when scrolling
 */
function initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    const scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Initial check
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Smooth Scrolling for Navigation Links
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbar = document.getElementById('mainNavbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
}

/**
 * Active Navigation Link Highlighting
 * Highlights the current section in navigation
 */
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Initial check
    updateActiveLink();

    // Add scroll listener with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Animated Counter for Achievements Section
 * Animates numbers when they come into view
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Animation duration in ms
    let animated = new Set();

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function animateCounter(counter) {
        if (animated.has(counter)) return;

        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            const current = Math.floor(easeOutQuart * target);
            counter.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        animated.add(counter);
        requestAnimationFrame(updateCounter);
    }

    function checkCounters() {
        counters.forEach(counter => {
            if (isInViewport(counter)) {
                animateCounter(counter);
            }
        });
    }

    // Add scroll listener
    window.addEventListener('scroll', checkCounters);
    window.addEventListener('resize', checkCounters);

    // Initial check
    checkCounters();
}

/**
 * Back to Top Button
 * Shows/hides and handles click
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    const scrollThreshold = 300;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // Initial check
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Click handler
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Contact Form Handling
 * Validates and sends enquiry via WhatsApp
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccessMessage');

    if (!form) return;

    // Prevent non-numeric input for mobile number
    const mobileInput = document.getElementById('mobileNumber');
    if (mobileInput) {
        mobileInput.addEventListener('input', function(e) {
            // Remove any non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');

            // Limit to 10 digits
            if (this.value.length > 10) {
                this.value = this.value.substring(0, 10);
            }
        });

        // Prevent paste of non-numeric characters
        mobileInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numericText = pastedText.replace(/[^0-9]/g, '').substring(0, 10);
            this.value = numericText;
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Get form fields
        const studentName = document.getElementById('studentName');
        const parentName = document.getElementById('parentName');
        const mobileNumber = document.getElementById('mobileNumber');
        const studentClass = document.getElementById('studentClass');
        const message = document.getElementById('message');

        // Reset validation
        form.classList.remove('was-validated');

        // Validate all fields
        let isValid = true;

        // Validate student name
        if (!studentName.value.trim()) {
            studentName.classList.add('is-invalid');
            isValid = false;
        } else {
            studentName.classList.remove('is-invalid');
            studentName.classList.add('is-valid');
        }

        // Validate parent name
        if (!parentName.value.trim()) {
            parentName.classList.add('is-invalid');
            isValid = false;
        } else {
            parentName.classList.remove('is-invalid');
            parentName.classList.add('is-valid');
        }

        // Validate mobile number (exactly 10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobileNumber.value)) {
            mobileNumber.classList.add('is-invalid');
            isValid = false;
        } else {
            mobileNumber.classList.remove('is-invalid');
            mobileNumber.classList.add('is-valid');
        }

        // Validate class selection
        if (!studentClass.value) {
            studentClass.classList.add('is-invalid');
            isValid = false;
        } else {
            studentClass.classList.remove('is-invalid');
            studentClass.classList.add('is-valid');
        }

        // Validate message
        if (!message.value.trim()) {
            message.classList.add('is-invalid');
            isValid = false;
        } else {
            message.classList.remove('is-invalid');
            message.classList.add('is-valid');
        }

        if (!isValid) {
            // Focus on first invalid field
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        // All validations passed - send to WhatsApp
        sendToWhatsApp(
            studentName.value.trim(),
            parentName.value.trim(),
            mobileNumber.value.trim(),
            studentClass.value,
            message.value.trim()
        );
    });

    // Remove validation state on input
    const formInputs = form.querySelectorAll('.form-control, .form-select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid', 'is-valid');
        });
    });
}

/**
 * Send enquiry to WhatsApp
 * Opens WhatsApp with pre-filled message
 */
function sendToWhatsApp(studentName, parentName, mobileNumber, studentClass, message) {
    const successMessage = document.getElementById('formSuccessMessage');
    const form = document.getElementById('contactForm');

    // Build the WhatsApp message
    const whatsappMessage = `Hello Friends Tuition Centre,

New Admission Enquiry

Student Name: ${studentName}
Parent Name: ${parentName}
Mobile Number: ${mobileNumber}
Class: ${studentClass}
Message: ${message}

I would like to know more about admission.`;

    // URL encode the message
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // WhatsApp number (without + sign)
    const whatsappNumber = '918056541102';

    // Build the WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Show success message
    if (successMessage) {
        form.style.display = 'none';
        successMessage.style.display = 'block';

        // Redirect to WhatsApp after 2 seconds
        setTimeout(function() {
            window.open(whatsappUrl, '_blank');

            // Reset form after a delay
            setTimeout(function() {
                form.reset();
                form.style.display = 'block';
                successMessage.style.display = 'none';

                // Remove validation classes
                const formInputs = form.querySelectorAll('.form-control, .form-select');
                formInputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
            }, 2000);
        }, 1500);
    } else {
        // Direct redirect if no success message element
        window.open(whatsappUrl, '_blank');
    }
}

/**
 * Scroll Animations
 * Adds entrance animations to elements when they scroll into view
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.course-card, .why-card, .testimonial-card, .gallery-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * Mobile Menu Handling
 * Ensures proper close on link click and handles touch events
 */
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');

    if (!navbarToggler || !navbarCollapse) return;

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const isNavbar = e.target.closest('.navbar');
        const isNavbarOpen = navbarCollapse.classList.contains('show');

        if (!isNavbar && isNavbarOpen) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });
}

/**
 * Lazy Loading Images
 * Implements native lazy loading fallback
 */
function initLazyLoading() {
    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.loading = 'lazy';
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Preloader (if implemented)
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');

    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.style.opacity = '0';
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 300);
            }, 500);
        });
    }
}

/**
 * Utility: Debounce function
 */
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

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize lazy loading
initLazyLoading();
