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
        });
    },
    
    initMobileDropdowns() {
        const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        
        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('svg');
                
                if (content && icon) {
                    content.classList.toggle('hidden');
                    icon.classList.toggle('rotate-180');
                }
            });
        });
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
// 6. Application Initialization
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
            
            // Mark app as ready
            document.body.classList.add('app-ready');
            
        } catch (error) {
            console.error('Application initialization error:', error);
        }
    }
};

// ========================================
// 7. Start Application
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
