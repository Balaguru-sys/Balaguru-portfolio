/* ============================================
   BALAGURU PORTFOLIO - MAIN JAVASCRIPT
   GSAP Animations | Lenis Smooth Scroll | Custom Cursor
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // LOADING SCREEN
    // ============================================
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingLetters = document.querySelectorAll('.loading-letter');

    let progress = 0;
    const totalAssets = 25;
    let loadedAssets = 0;

    function updateLoading() {
        loadedAssets++;
        progress = Math.min((loadedAssets / totalAssets) * 100, 100);
        loadingBar.style.width = progress + '%';
        loadingPercentage.textContent = Math.round(progress) + '%';

        if (progress >= 100) {
            setTimeout(finishLoading, 300);
        }
    }

    function finishLoading() {
        const tl = gsap.timeline();

        tl.to(loadingLetters, {
            y: -30,
            opacity: 0,
            stagger: 0.03,
            duration: 0.4,
            ease: 'power2.in'
        })
        .to('.loading-bar-container', {
            scaleX: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        }, '-=0.2')
        .to('.loading-percentage', {
            opacity: 0,
            duration: 0.2
        }, '-=0.2')
        .to(loadingScreen, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                loadingScreen.style.display = 'none';
                initApp();
            }
        });
    }

    // Simulate loading with images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            updateLoading();
        } else {
            img.addEventListener('load', updateLoading);
            img.addEventListener('error', updateLoading);
        }
    });

    // Fallback: force complete after 3 seconds
    setTimeout(() => {
        if (loadingScreen.style.display !== 'none') {
            finishLoading();
        }
    }, 3000);

    // Animate loading letters in
    gsap.to(loadingLetters, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2
    });

    // ============================================
    // MAIN APP INITIALIZATION
    // ============================================
    function initApp() {
        initLenis();
        initCursor();
        initNavigation();
        initScrollAnimations();
        initProjectFilters();
        initProjectModal();
        initContactForm();
        initCounters();
        initMobileMenu();
    }

    // ============================================
    // LENIS SMOOTH SCROLL
    // ============================================
    let lenis;

    function initLenis() {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    lenis.scrollTo(target, { offset: -80 });
                }
                // Close mobile menu if open
                closeMobileMenu();
            });
        });
    }

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    function initCursor() {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        const cursorWrapper = document.getElementById('cursorWrapper');
        const cursorDot = document.getElementById('cursorDot');
        const cursorCircle = document.getElementById('cursorCircle');
        const cursorText = document.getElementById('cursorText');

        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let circleX = 0, circleY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            circleX += (mouseX - circleX) * 0.15;
            circleY += (mouseY - circleY) * 0.15;

            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            cursorCircle.style.left = circleX + 'px';
            cursorCircle.style.top = circleY + 'px';
            cursorText.style.left = circleX + 'px';
            cursorText.style.top = circleY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Cursor hover states
        document.querySelectorAll('[data-cursor]').forEach(el => {
            const type = el.dataset.cursor;

            el.addEventListener('mouseenter', () => {
                cursorWrapper.classList.add('hover');

                if (type === 'link') {
                    cursorWrapper.classList.add('hover-link');
                } else if (type === 'button') {
                    cursorWrapper.classList.add('hover-button');
                }

                if (type === 'view') {
                    cursorText.textContent = 'View';
                    cursorText.style.opacity = '1';
                }
            });

            el.addEventListener('mouseleave', () => {
                cursorWrapper.classList.remove('hover', 'hover-link', 'hover-button');
                cursorText.style.opacity = '0';
            });
        });

        // Project card hover
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                cursorWrapper.classList.add('hover');
                cursorText.textContent = 'View';
                cursorText.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                cursorWrapper.classList.remove('hover');
                cursorText.style.opacity = '0';
            });
        });
    }

    // ============================================
    // NAVIGATION
    // ============================================
    function initNavigation() {
        const nav = document.getElementById('mainNav');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        // Scroll behavior
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });

        // Active section highlighting
        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    function closeMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // ============================================
    // GSAP SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Fade up animations
        document.querySelectorAll('[data-animate="fade-up"]').forEach((el, i) => {
            gsap.fromTo(el, 
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    delay: i * 0.1
                }
            );
        });

        // Fade left animations (timeline)
        document.querySelectorAll('[data-animate="fade-left"]').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, x: -40 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    delay: i * 0.15
                }
            );
        });

        // Scale in (home image)
        const homeImage = document.querySelector('.home-image-wrapper');
        if (homeImage) {
            gsap.fromTo(homeImage,
                { opacity: 0, scale: 0.9, y: 30 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: 0.3
                }
            );
        }

        // Scale up (project cards)
        document.querySelectorAll('[data-animate="scale-up"]').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, scale: 0.95, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    delay: (i % 3) * 0.1
                }
            );
        });

        // Home title animation
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, i) => {
            gsap.fromTo(line,
                { opacity: 0, y: 60, rotateX: -40 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 1,
                    ease: 'power3.out',
                    delay: 0.2 + i * 0.15
                }
            );
        });

        // Home eyebrow
        gsap.fromTo('.home-eyebrow',
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 }
        );

        // Home description
        gsap.fromTo('.home-desc',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
        );

        // Home CTA
        gsap.fromTo('.home-cta',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
        );

        // Home stats
        gsap.fromTo('.home-stats',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.7 }
        );

        // Scroll indicator
        gsap.fromTo('.scroll-indicator',
            { opacity: 0 },
            { opacity: 0.6, duration: 1, delay: 1.5 }
        );

        // Parallax on home image
        gsap.to('.home-image', {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.section-home',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Section headers
        document.querySelectorAll('.section-header').forEach(header => {
            gsap.fromTo(header,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // About image reveal
        gsap.fromTo('.about-image-inner',
            { opacity: 0, scale: 1.1 },
            {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.about-image-wrapper',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // Skill items stagger
        gsap.fromTo('.skill-item',
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // Tool tags stagger
        gsap.fromTo('.tool-tag',
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'power3.out',
                stagger: 0.05,
                scrollTrigger: {
                    trigger: '.tools-list',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // Showreel
        gsap.fromTo('.showreel-container',
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.showreel-section',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // Contact form
        gsap.fromTo('.contact-form',
            { opacity: 0, x: 40 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.contact-form',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }

    // ============================================
    // PROJECT FILTERS
    // ============================================
    function initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects with animation
                projectCards.forEach(card => {
                    const categories = card.dataset.category.split(' ');
                    const shouldShow = filter === 'all' || categories.includes(filter);

                    if (shouldShow) {
                        gsap.to(card, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.5,
                            ease: 'power3.out',
                            display: 'block'
                        });
                        card.style.pointerEvents = 'all';
                    } else {
                        gsap.to(card, {
                            opacity: 0,
                            scale: 0.9,
                            duration: 0.4,
                            ease: 'power3.in',
                            onComplete: () => {
                                card.style.display = 'none';
                            }
                        });
                        card.style.pointerEvents = 'none';
                    }
                });
            });
        });
    }

    // ============================================
    // PROJECT MODAL
    // ============================================
    function initProjectModal() {
        const modal = document.getElementById('projectModal');
        const modalBackdrop = document.getElementById('modalBackdrop');
        const modalClose = document.getElementById('modalClose');
        const modalBody = document.getElementById('modalBody');

        const projectData = {
            'Éclat Noir': {
                image: 'assets/images/projects/eclat-noir-hero.jpg',
                category: 'Luxury Branding',
                desc: 'A premium perfume brand identity that embodies dark elegance and timeless sophistication. The complete branding package includes logo design, packaging, social media assets, billboard mockups, and brand guidelines with a refined color palette of deep blacks and gold accents.',
                tags: ['Branding', 'Packaging', 'Luxury', 'Print']
            },
            'Ember Oak': {
                image: 'assets/images/projects/ember-oak.jpg',
                category: 'Restaurant Branding',
                desc: 'A warm and sophisticated brand identity for Ember Oak Kitchen & Bar. The design captures the essence of fire, flavor, and craft with an earthy color palette, elegant typography, and comprehensive brand collateral including menus, business cards, and signage.',
                tags: ['Branding', 'Restaurant', 'Identity', 'Print']
            },
            'Roast Republic': {
                image: 'assets/images/projects/roast-republic.jpg',
                category: 'Coffee Branding',
                desc: 'Bold coffee branding for Roast Republic Coffee Co. featuring honest origin storytelling. The brand identity includes packaging design, menu systems, social media templates, and merchandise with a rustic yet modern aesthetic.',
                tags: ['Branding', 'Packaging', 'Coffee', 'Social Media']
            },
            'Aurelia Naturals': {
                image: 'assets/images/projects/aurelia-naturals.jpg',
                category: 'Skincare Branding',
                desc: 'Pure botanical skincare branding that celebrates nature\'s healing power. The identity features soft green tones, organic shapes, and elegant typography across packaging, product photography, and digital assets.',
                tags: ['Branding', 'Packaging', 'Skincare', 'Digital']
            },
            'Brew & Beyond': {
                image: 'assets/images/projects/brew-beyond.jpg',
                category: 'Coffee Roasters',
                desc: 'Artisan coffee roasters brand identity that goes beyond the cup. The design system includes packaging, menu design, signage, and social media assets with a warm, inviting aesthetic.',
                tags: ['Branding', 'Coffee', 'Packaging', 'Print']
            },
            'Éclat Noir Watch': {
                image: 'assets/images/projects/eclat-noir-watch.jpg',
                category: 'Luxury Watch',
                desc: 'Timeless elegance meets modern precision in this luxury watch brand identity. The design features refined typography, premium black and gold palette, and sophisticated collateral including packaging and advertising.',
                tags: ['Branding', 'Luxury', 'Watch', 'Print']
            },
            'Bamboo Kings': {
                image: 'assets/images/projects/bamboo-kings.jpg',
                category: 'Restaurant Branding',
                desc: 'Royal briyani brand identity inspired by heritage and tradition. The comprehensive branding includes logo design, menu systems, packaging, interior signage, and social media templates with regal green and gold accents.',
                tags: ['Branding', 'Restaurant', 'Social Media', 'Print']
            },
            'Velore Apparel': {
                image: 'assets/images/projects/velore-apparel.jpg',
                category: 'Fashion Branding',
                desc: 'Modern fashion brand identity for Velore Apparel that defines confidence and style. The design system includes logo, hang tags, packaging, billboard mockups, and brand presentation materials.',
                tags: ['Branding', 'Fashion', 'Packaging', 'Advertising']
            },
            'Shutter Stories': {
                image: 'assets/images/projects/shutter-stories.jpg',
                category: 'Photography Brand',
                desc: 'Photography brand identity that captures real moments and emotions. The design features a camera-inspired logo, elegant typography, and comprehensive collateral including business cards, packaging, and social media assets.',
                tags: ['Branding', 'Photography', 'Identity', 'Print']
            },
            'Peak Performance': {
                image: 'assets/images/projects/peak-performance.jpg',
                category: 'Fitness Branding',
                desc: 'Dynamic fitness brand identity that empowers individuals to push their limits. The bold design features energetic green accents, strong typography, and comprehensive gym branding including signage, merchandise, and social media.',
                tags: ['Branding', 'Fitness', 'Social Media', 'Merchandise']
            },
            'Naturelle Organics': {
                image: 'assets/images/projects/naturelle-organics.jpg',
                category: 'Organic Skincare',
                desc: 'Clean beauty brand identity committed to pure, natural ingredients. The organic design features botanical elements, earth-tone colors, and sustainable packaging concepts across all touchpoints.',
                tags: ['Branding', 'Organic', 'Packaging', 'Web Design']
            },
            'Wanderlust Travel': {
                image: 'assets/images/projects/wanderlust-travel.jpg',
                category: 'Travel Branding',
                desc: 'Adventure travel brand identity for explorers and dreamers. The design captures the spirit of discovery with mountain-inspired logos, warm earth tones, and comprehensive travel collateral.',
                tags: ['Branding', 'Travel', 'Identity', 'Print']
            },
            'Horizon Properties': {
                image: 'assets/images/projects/horizon-properties.jpg',
                category: 'Real Estate',
                desc: 'Premium real estate brand identity that builds trust and delivers quality. The sophisticated design features architectural-inspired logos, elegant gold accents, and professional collateral including brochures and digital assets.',
                tags: ['Branding', 'Real Estate', 'Print', 'Digital']
            },
            'Kriyaura': {
                image: 'assets/images/projects/kriyaura-branding.jpg',
                category: 'Wellness Brand',
                desc: 'Holistic wellness brand identity with an organic, natural touch. The comprehensive branding includes logo design, tote bags, packaging boxes, yoga mats, and paper bags with a fresh green leaf motif.',
                tags: ['Branding', 'Wellness', 'Packaging', 'Merchandise']
            },
            'Pure Bite': {
                image: 'assets/images/projects/pure-bite.jpg',
                category: 'Product Poster',
                desc: 'Eye-catching product poster design for Pure Bite vegan granola bars. The design features bold typography, vibrant food photography, and clear nutritional messaging with a clean, modern layout.',
                tags: ['Poster', 'Product', 'Print', 'Advertising']
            },
            'Delicious Food In Town': {
                image: 'assets/images/projects/food-poster.jpg',
                category: 'Food Ad Poster',
                desc: 'A bold, appetite-driving food promotion poster built around a hero shot of the dish. Strong color contrast, condensed display type, and a clean call-to-action layout make it ready for both social feeds and print.',
                tags: ['Poster', 'Social Media', 'Print', 'Food']
            },
            'Exclusive Shoes': {
                image: 'assets/images/projects/sneaker-poster.jpg',
                category: 'Product Ad Poster',
                desc: 'A high-impact sneaker campaign poster pairing oversized reversed-out type with a dramatic product shot. Designed to grab attention in a crowded social feed while keeping the product the clear focal point.',
                tags: ['Poster', 'Social Media', 'Print', 'Product']
            },
            'Citrus Can': {
                image: 'assets/images/projects/citrus-can.jpg',
                category: 'Beverage Packaging',
                desc: 'A torn-paper concept for beverage can packaging, revealing fresh citrus fruit underneath the label artwork. The layered visual metaphor communicates freshness and natural ingredients at a glance.',
                tags: ['Packaging', 'Branding', 'Concept', 'Beverage']
            },
            'FlashPop Iced Coltache': {
                image: 'assets/images/projects/flashpop-gelato.jpg',
                category: 'Beverage Ad Poster',
                desc: 'A vibrant promotional poster for an iced pistachio drink, combining oversized display type with floating pistachio elements for a playful, scroll-stopping social ad.',
                tags: ['Poster', 'Social Media', 'Print', 'Beverage']
            }
        };

        function openModal(projectName) {
            const data = projectData[projectName];
            if (!data) return;

            modalBody.innerHTML = `
                <img src="${data.image}" alt="${projectName}" class="modal-image">
                <div class="modal-details">
                    <span class="modal-category">${data.category}</span>
                    <h3 class="modal-title">${projectName}</h3>
                    <p class="modal-desc">${data.desc}</p>
                    <div class="modal-tags">
                        ${data.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }

        // Open modal on project card click
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const name = card.querySelector('.project-name')?.textContent || 
                            card.querySelector('.project-overlay-content h3')?.textContent;
                if (name) openModal(name);
            });
        });

        modalBackdrop.addEventListener('click', closeModal);
        modalClose.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ============================================
    // CONTACT FORM
    // ============================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        function showToast(message) {
            toastMessage.textContent = message;
            toast.classList.add('active');
            setTimeout(() => {
                toast.classList.remove('active');
            }, 3000);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const name = formData.get('name');

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.querySelector('.btn-text').textContent;
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            submitBtn.disabled = true;

            fetch('https://formspree.io/f/xykrwwyb', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
                .then((response) => {
                    if (response.ok) {
                        showToast(`Thanks ${name}! Your message has been sent.`);
                        form.reset();
                    } else {
                        return response.json().then((data) => {
                            const errorMsg = (data && data.errors)
                                ? data.errors.map((err) => err.message).join(', ')
                                : 'Something went wrong. Please email me directly instead.';
                            showToast(errorMsg);
                        });
                    }
                })
                .catch(() => {
                    showToast('Network error — please email me directly instead.');
                })
                .finally(() => {
                    submitBtn.querySelector('.btn-text').textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 90%',
                onEnter: () => {
                    gsap.to(counter, {
                        innerText: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            counter.innerText = Math.round(this.targets()[0].innerText);
                        }
                    });
                },
                once: true
            });
        });
    }
});
