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
            
            // Fix menu/ links based on current location
            if (href.includes('menu/')) {
                if (basePath === '../') {
                    // We're in menu/, so remove 'menu/' prefix
                    href = href.replace(/menu\//g, '');
                    link.setAttribute('href', href);
                }
                // If basePath is './', keep as is
            }
            // Fix /index.html or index.html links
            else if (href === '/index.html' || href === 'index.html') {
                link.setAttribute('href', basePath + 'index.html');
            }
            // Fix root-relative paths (starting with /)
            else if (href.startsWith('/') && !href.startsWith('//')) {
                // Remove leading slash and add basePath
                href = href.substring(1);
                if (basePath === '../' && href.includes('menu/')) {
                    href = href.replace(/menu\//g, '');
                }
                link.setAttribute('href', (basePath === '../' ? '' : basePath) + href);
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
        this.initMobileMenu();
        this.initMobileDropdowns();
        this.closeMenuOnOutsideClick();
        this.closeMenuOnLinkClick();
    },
    
    initMobileMenu() {
        const button = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');
        
        if (!button || !menu) return;
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = menu.classList.contains('hidden');
            
            menu.classList.toggle('hidden');
            menuIcon?.classList.toggle('hidden');
            closeIcon?.classList.toggle('hidden');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isHidden ? 'hidden' : '';
            
            // Restore submenu states when opening menu
            if (isHidden) {
                // 메뉴가 완전히 표시된 후 상태 복원
                setTimeout(() => {
                    this.restoreDropdownStates();
                }, 50);
            }
        });
    },
    
    initMobileDropdowns() {
        const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        
        dropdownBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('svg');
                const menuKeys = this.getMenuKeys(btn);
                
                if (content && icon) {
                    const isHidden = content.classList.contains('hidden');
                    content.classList.toggle('hidden');
                    icon.classList.toggle('rotate-180');
                    
                    this.saveDropdownState(menuKeys, !isHidden);
                }
            });
        });

        // Ensure stored states are applied on load
        this.restoreDropdownStates();
    },
    
    saveDropdownState(keys, isOpen) {
        try {
            const states = JSON.parse(localStorage.getItem('mobileMenuStates') || '{}');
            const keyList = Array.isArray(keys) ? keys : [keys];
            keyList.forEach((key) => {
                if (key) {
                    states[key] = isOpen;
                }
            });
            localStorage.setItem('mobileMenuStates', JSON.stringify(states));
        } catch (e) {
            console.warn('Failed to save menu state:', e);
        }
    },
    
    restoreDropdownStates() {
        try {
            const states = JSON.parse(localStorage.getItem('mobileMenuStates') || '{}');
            const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
            
            dropdownBtns.forEach((btn) => {
                const menuKeys = this.getMenuKeys(btn);
                const shouldOpen = menuKeys.some((key) => states[key]);
                
                if (shouldOpen) {
                    const content = btn.nextElementSibling;
                    const icon = btn.querySelector('svg');
                    
                    if (content && icon) {
                        content.classList.remove('hidden');
                        icon.classList.add('rotate-180');
                    }
                }
            });
        } catch (e) {
            console.warn('Failed to restore menu states:', e);
        }
    },

    getMenuKeys(btn) {
        const keys = [];
        const dataKey = btn.dataset.menuKey?.trim();
        if (dataKey) keys.push(dataKey);
        const textKey = btn.textContent.replace(/\s+/g, ' ').trim();
        if (textKey && (!dataKey || dataKey !== textKey)) {
            keys.push(textKey);
        }
        return keys;
    },
    
    closeMenuOnOutsideClick() {
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('mobile-menu');
            const button = document.getElementById('mobile-menu-button');
            
            if (menu && !menu.classList.contains('hidden') && 
                !menu.contains(e.target) && !button?.contains(e.target)) {
                menu.classList.add('hidden');
                document.getElementById('menu-icon')?.classList.remove('hidden');
                document.getElementById('close-icon')?.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    },
    
    closeMenuOnLinkClick() {
        // 모바일 메뉴 내부의 모든 링크에 클릭 이벤트 추가
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('mobile-menu');
            const link = e.target.closest('a');
            
            // 링크를 클릭했고, 모바일 메뉴가 열려있으면 메뉴 닫기
            if (link && menu && menu.contains(link) && !menu.classList.contains('hidden')) {
                // 드롭다운 버튼이 아닌 실제 링크인 경우에만
                if (!link.classList.contains('mobile-dropdown-btn')) {
                    menu.classList.add('hidden');
                    document.getElementById('menu-icon')?.classList.remove('hidden');
                    document.getElementById('close-icon')?.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            }
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
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
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
        });
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
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
        const links = document.querySelectorAll('a[href$=".html"]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = link.href;
                    document.head.appendChild(prefetchLink);
                    observer.unobserve(link);
                }
            });
        });
        
        links.forEach(link => observer.observe(link));
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
        this.modalImage.src = src;
        this.modalImage.alt = caption;
        this.modalCaption.textContent = caption;
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },
    
    close() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
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
// 8. Application Initialization
// ========================================
const App = {
    async init() {
        try {
            // Load components first
            const componentsLoaded = await ComponentLoader.loadAll();
            
            if (componentsLoaded) {
                // Wait a bit for components to render
                setTimeout(() => {
                    Navigation.init();
                }, 100);
            }
            
            // Initialize other modules
            ScrollManager.init();
            AnimationManager.init();
            Performance.init();
            ImageModal.init();
            ProductSlider.init();
            
            // Mark app as ready
            document.body.classList.add('app-ready');
            
        } catch (error) {
            console.error('Application initialization error:', error);
        }
    }
};

// ========================================
// 8. Start Application
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
