/**
 * Main JavaScript File - 아파트샵 황소밴드
 * Vanilla JS with modular architecture
 */

// ========================================
// 1. Component Loader Module
// ========================================
const ComponentLoader = {
    cache: {},
    
    // Determine base path based on current location
    getBasePath() {
        const path = window.location.pathname;
        // If we're in a subdirectory (menu/), return '../'
        if (path.includes('/menu/')) {
            return '../';
        }
        // If we're in root, return './'
        return './';
    },
    
    async loadComponent(elementId, componentPath) {
        try {
            // Check cache first
            if (this.cache[componentPath]) {
                document.getElementById(elementId).innerHTML = this.cache[componentPath];
                this.fixComponentLinks(elementId);
                return;
            }
            
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentPath}: ${response.status}`);
            }
            
            const html = await response.text();
            this.cache[componentPath] = html;
            document.getElementById(elementId).innerHTML = html;
            this.fixComponentLinks(elementId);
        } catch (error) {
            console.error('Component loading error:', error);
            document.getElementById(elementId).innerHTML = '<p>컴포넌트를 불러올 수 없습니다.</p>';
        }
    },
    
    // Fix links in loaded components based on current page location
    fixComponentLinks(elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        const basePath = this.getBasePath();
        const links = container.querySelectorAll('a[href]');
        
        links.forEach(link => {
            let href = link.getAttribute('href');
            
            // Skip external links, anchors, mailto, and tel
            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Handle anchor-only links
            if (href.startsWith('#')) {
                return;
            }
            
            // Root-relative links are stable from every page and best for crawlers.
            if (href.startsWith('/') && !href.startsWith('//')) {
                return;
            }

            // Fix legacy menu/ links based on current location
            if (href.includes('menu/')) {
                if (basePath === '../') {
                    // We're in menu/, so remove 'menu/' prefix
                    href = href.replace(/menu\//g, '');
                    link.setAttribute('href', href);
                }
                // If basePath is './', keep as is
            }
            // Home link: keep the clean root URL ("/") canonical.
            // Avoid /index.html, which Google treats as a duplicate of "/".
            else if (href === '/' || href === '/index.html' || href === 'index.html') {
                // From a sub-directory ("../") the site lives one level up, so
                // resolve to the parent root; from the homepage ("./") keep "/".
                link.setAttribute('href', basePath === '../' ? '../' : '/');
            }
        });
    },
    
    async load(elementId, componentPath) {
        try {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Element with id "${elementId}" not found`);
                return false;
            }
            
            await this.loadComponent(elementId, componentPath);
            return true;
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
            return false;
        }
    },
    
    async loadAll() {
        const basePath = this.getBasePath();
        const components = [
            { id: 'header-container', path: basePath + 'components/header.html' },
            { id: 'footer-container', path: basePath + 'components/footer.html' }
        ];
        
        const results = await Promise.all(
            components.map(comp => this.load(comp.id, comp.path))
        );
        
        return results.every(result => result === true);
    }
};

// ========================================
// 2. Navigation Module
// ========================================
const Navigation = {
    init() {
        this.desktopMedia = window.matchMedia('(min-width: 1024px)');
        this.initDesktopMenu();
        this.initMobileMenu();
        this.initMobileDropdowns();
        this.closeMenuOnOutsideClick();
        this.closeMenuOnLinkClick();
        document.addEventListener('keydown', (event) => {
            const menu = document.getElementById('mobile-menu');
            if (event.key === 'Escape' && menu && !menu.classList.contains('hidden')) {
                event.preventDefault();
                this.setMobileMenuOpen(false, true);
            }
        });
        this.desktopMedia.addEventListener('change', () => {
            this.setMobileMenuOpen(false);
            document.querySelectorAll('[data-desktop-dropdown]').forEach(group => {
                this.setDesktopDropdownOpen(group, false);
            });
        });
    },

    setDesktopDropdownOpen(group, isOpen) {
        const button = group.querySelector('.nav-link');
        const content = button?.nextElementSibling;
        if (!button || !content) return;

        if (isOpen) {
            document.querySelectorAll('[data-desktop-dropdown]').forEach(other => {
                if (other !== group) this.setDesktopDropdownOpen(other, false);
            });
        }
        button.setAttribute('aria-expanded', String(isOpen));
        content.setAttribute('aria-hidden', String(!isOpen));
        content.classList.toggle('opacity-0', !isOpen);
        content.classList.toggle('invisible', !isOpen);
        content.classList.toggle('opacity-100', isOpen);
        content.classList.toggle('visible', isOpen);
        content.inert = !isOpen;
    },

    initDesktopMenu() {
        document.querySelectorAll('[data-desktop-dropdown]').forEach(group => {
            const button = group.querySelector('.nav-link');
            const content = button?.nextElementSibling;
            if (!button || !content) return;

            this.setDesktopDropdownOpen(group, false);
            group.addEventListener('mouseenter', () => this.setDesktopDropdownOpen(group, true));
            group.addEventListener('mouseleave', () => {
                if (!group.contains(document.activeElement)) this.setDesktopDropdownOpen(group, false);
            });
            group.addEventListener('focusout', (event) => {
                if (!group.contains(event.relatedTarget)) this.setDesktopDropdownOpen(group, false);
            });
            button.addEventListener('click', (event) => {
                // Pointer hover already opens the menu; keyboard activation toggles it.
                const isOpen = event.detail > 0 || button.getAttribute('aria-expanded') !== 'true';
                this.setDesktopDropdownOpen(group, isOpen);
            });
            button.addEventListener('keydown', (event) => {
                if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
                event.preventDefault();
                this.setDesktopDropdownOpen(group, true);
                const links = content.querySelectorAll('a[href]');
                const index = event.key === 'ArrowUp' ? links.length - 1 : 0;
                links[index]?.focus();
            });
            group.addEventListener('keydown', (event) => {
                if (event.key !== 'Escape') return;
                event.preventDefault();
                event.stopPropagation();
                button.focus();
                this.setDesktopDropdownOpen(group, false);
            });
        });
    },

    setMobileMenuOpen(isOpen, returnFocus = false) {
        const button = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if (!button || !menu) return;

        isOpen = Boolean(isOpen && !this.desktopMedia.matches);
        const wasOpen = !menu.classList.contains('hidden');
        if (isOpen && !wasOpen) this.mobilePreviousOverflow = document.body.style.overflow;
        menu.classList.toggle('hidden', !isOpen);
        menu.setAttribute('aria-hidden', String(!isOpen));
        button.setAttribute('aria-expanded', String(isOpen));
        button.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
        document.getElementById('menu-icon')?.classList.toggle('hidden', isOpen);
        document.getElementById('close-icon')?.classList.toggle('hidden', !isOpen);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (!wasOpen) this.restoreMenuStates();
        } else if (wasOpen) {
            document.body.style.overflow = this.mobilePreviousOverflow || '';
        }
        if (returnFocus && wasOpen) button.focus();
    },

    initMobileMenu() {
        const button = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if (!button || !menu) return;

        this.setMobileMenuOpen(false);
        button.addEventListener('click', () => {
            this.setMobileMenuOpen(menu.classList.contains('hidden'));
        });
    },

    setMobileDropdownOpen(button, isOpen) {
        const content = button.nextElementSibling;
        if (!content) return;
        content.classList.toggle('hidden', !isOpen);
        content.setAttribute('aria-hidden', String(!isOpen));
        button.setAttribute('aria-expanded', String(isOpen));
        button.querySelector('svg')?.classList.toggle('rotate-180', isOpen);
    },

    initMobileDropdowns() {
        document.querySelectorAll('.mobile-dropdown-btn').forEach(button => {
            const content = button.nextElementSibling;
            if (!content) return;
            this.setMobileDropdownOpen(button, !content.classList.contains('hidden'));
            button.addEventListener('click', () => {
                const isOpen = content.classList.contains('hidden');
                this.setMobileDropdownOpen(button, isOpen);
                this.saveMenuState(button.dataset.menuKey, isOpen);
            });
        });
    },
    
    saveMenuState(menuKey, isOpen) {
        if (!menuKey) return;
        try {
            if (isOpen) {
                localStorage.setItem('lastOpenedMenu', menuKey);
            } else {
                if (localStorage.getItem('lastOpenedMenu') === menuKey) {
                    localStorage.removeItem('lastOpenedMenu');
                }
            }
        } catch (e) {
            // Silent fail
        }
    },
    
    restoreMenuStates() {
        try {
            const lastOpenedMenu = localStorage.getItem('lastOpenedMenu');
            if (!lastOpenedMenu) return;
            
            document.querySelectorAll('.mobile-dropdown-btn').forEach(button => {
                if (button.dataset.menuKey === lastOpenedMenu) {
                    this.setMobileDropdownOpen(button, true);
                }
            });
        } catch (e) {
            // Silent fail
        }
    },
    
    closeMenuOnOutsideClick() {
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('mobile-menu');
            const button = document.getElementById('mobile-menu-button');
            
            if (menu && !menu.classList.contains('hidden') &&
                !menu.contains(e.target) && !button?.contains(e.target)) {
                this.setMobileMenuOpen(false);
            }
            document.querySelectorAll('[data-desktop-dropdown]').forEach(group => {
                if (!group.contains(e.target)) this.setDesktopDropdownOpen(group, false);
            });
        });
    },
    
    closeMenuOnLinkClick() {
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('mobile-menu');
            const link = e.target.closest('a');
            if (!link || !menu || !menu.contains(link) || menu.classList.contains('hidden')) return;

            const dropdownButton = link.closest('.mobile-dropdown-content')?.previousElementSibling;
            if (dropdownButton?.classList.contains('mobile-dropdown-btn')) {
                this.saveMenuState(dropdownButton.dataset.menuKey, true);
            }
            this.setMobileMenuOpen(false);
        });
    }
};

// ========================================
// 3. Scroll Module
// ========================================
const ScrollManager = {
    init() {
        this.initSmoothScroll();
        this.initScrollToTop();
    },
    
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.getElementById(decodeURIComponent(href.slice(1)));
                
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
                    });
                }
            });
        });
    },
    
    initScrollToTop() {
        const btn = document.getElementById('scroll-to-top');
        if (!btn) return;
        
        let isVisible = false;
        
        const toggleButton = () => {
            const shouldShow = window.pageYOffset > 300;
            
            if (shouldShow !== isVisible) {
                isVisible = shouldShow;
                btn.classList.toggle('hidden', !shouldShow);
            }
        };
        
        // Throttle scroll event
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    toggleButton();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
        });
    }
};

// ========================================
// 4. Animation Module
// ========================================
const AnimationManager = {
    init() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.classList.add('fade-in');
            });
            return;
        }
        
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
};

// ========================================
// 5. Performance Module
// ========================================
const Performance = {
    init() {
        this.lazyLoadImages();
        this.prefetchLinks();
    },
    
    lazyLoadImages() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading support
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        } else {
            // Fallback for older browsers
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },
    
    prefetchLinks() {
        const connection = navigator.connection;
        if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;

        const prefetched = new Set();
        let hoverTimer;
        const prefetch = (link) => {
            if (!link || link.hasAttribute('download') || prefetched.size >= 5) return;
            const url = new URL(link.href, location.href);
            if (url.origin !== location.origin || !url.pathname.endsWith('.html') ||
                url.pathname === location.pathname) return;
            url.hash = '';
            if (prefetched.has(url.href)) return;

            prefetched.add(url.href);
            const hint = document.createElement('link');
            hint.rel = 'prefetch';
            hint.href = url.href;
            document.head.appendChild(hint);
        };

        // Warm only links the visitor intends to open, including dynamically loaded navigation.
        document.addEventListener('pointerover', (event) => {
            if (event.pointerType !== 'mouse') return;
            const link = event.target.closest('a[href]');
            clearTimeout(hoverTimer);
            if (link) hoverTimer = setTimeout(() => {
                if (link.matches(':hover')) prefetch(link);
            }, 150);
        }, { passive: true });
        document.addEventListener('focusin', (event) => prefetch(event.target.closest('a[href]')));
    }
};

// ========================================
// 6. Image Modal Module
// ========================================
const ImageModal = {
    init() {
        this.modal = document.getElementById('image-modal');
        this.modalImage = document.getElementById('modal-image');
        this.modalCaption = document.getElementById('modal-caption');
        this.closeBtn = document.getElementById('close-modal');
        
        if (!this.modal || !this.modalImage || !this.modalCaption) return;
        
        this.bindEvents();
    },
    
    bindEvents() {
        // Bind certificate image clicks
        document.querySelectorAll('.cert-image').forEach(card => {
            card.addEventListener('click', (e) => {
                const src = card.dataset.src;
                const alt = card.dataset.alt;
                this.open(src, alt);
            });
        });
        
        // Close button
        this.closeBtn?.addEventListener('click', () => this.close());
        
        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.close();
            }
        });
    },
    
    open(src, caption) {
        this.previousFocus = document.activeElement;
        this.previousOverflow = document.body.style.overflow;
        this.modalImage.src = src;
        this.modalImage.alt = caption;
        this.modalCaption.textContent = caption;
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.closeBtn?.focus();
    },
    
    close() {
        if (this.modal.classList.contains('hidden')) return;
        this.modal.classList.add('hidden');
        this.modalImage.removeAttribute('src');
        document.body.style.overflow = this.previousOverflow || '';
        this.previousFocus?.focus({ preventScroll: true });
    }
};

// ========================================
// 7. Product Slider Module
// ========================================
const ProductSlider = {
    currentSlide: 0,
    totalSlides: 6,
    slider: null,
    dots: null,
    isTransitioning: false,
    
    init() {
        this.slider = document.getElementById('productSlider');
        this.dots = document.querySelectorAll('.slider-dot');
        
        if (!this.slider) return;
        
        // Remove transition class initially
        this.slider.style.transition = 'transform 0.5s ease-in-out';
        
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        
        // Dot navigation
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            });
        });
        
        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    },
    
    handleSwipe(startX, endX) {
        if (endX < startX - 50) this.next();
        if (endX > startX + 50) this.prev();
    },
    
    goToSlide(index, noTransition = false) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentSlide = index;
        
        if (noTransition) {
            this.slider.style.transition = 'none';
        } else {
            this.slider.style.transition = 'transform 0.5s ease-in-out';
        }
        
        const offset = -100 * index;
        this.slider.style.transform = `translateX(${offset}%)`;
        this.updateDots();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, noTransition ? 0 : 500);
    },
    
    next() {
        if (this.isTransitioning) return;
        
        const nextSlide = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextSlide);
    },
    
    prev() {
        if (this.isTransitioning) return;
        
        const prevSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevSlide);
    },
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.classList.remove('bg-gray-300', 'text-gray-700');
                dot.classList.add('bg-blue-600', 'text-white');
            } else {
                dot.classList.remove('bg-blue-600', 'text-white');
                dot.classList.add('bg-gray-300', 'text-gray-700');
            }
        });
    }
};

// ========================================
// 8. Inline YouTube Player Module
// ========================================
const InlineVideoPlayer = {
    init() {
        document.querySelectorAll('[data-youtube-play]').forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                this.play(trigger);
            });
        });
    },

    play(trigger) {
        const videoId = trigger.dataset.youtubeId;
        if (!videoId) return;

        const title = trigger.dataset.youtubeTitle || 'YouTube video player';
        const iframe = document.createElement('iframe');

        iframe.className = 'block w-full h-full border-0';
        iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&playsinline=1&rel=0`;
        iframe.title = title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';

        trigger.replaceWith(iframe);
    }
};

// ========================================
// 9. Application Initialization
// ========================================
const App = {
    async init() {
        try {
            const componentsLoaded = ComponentLoader.loadAll();
            
            // Initialize other modules
            ScrollManager.init();
            AnimationManager.init();
            Performance.init();
            ImageModal.init();
            ProductSlider.init();
            InlineVideoPlayer.init();

            // Page interactions need not wait for the shared header and footer.
            await componentsLoaded;
            Navigation.init();
            
            // Mark app as ready
            document.body.classList.add('app-ready');
            
        } catch (error) {
            console.error('Application initialization error:', error);
        }
    }
};

// ========================================
// 10. Start Application
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
