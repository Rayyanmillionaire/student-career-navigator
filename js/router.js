import Auth from './auth.js';

const Router = {
    routes: [],
    
    register(path, module, options = {}) {
        this.routes.push({
            path,
            module,
            options
        });
    },
    
    navigate(path) {
        window.location.hash = path;
    },
    
    getCurrentRoute() {
        return window.location.hash.slice(1) || '/';
    },
    
    getParams() {
        const hash = window.location.hash.slice(1) || '/';
        const segments = hash.split('/').filter(Boolean);
        
        // Very basic param extraction for /roadmaps/:id
        // Currently only handles 1 level of params properly based on current routes
        if (segments.length === 2 && segments[0] === 'roadmaps') {
            return { id: segments[1] };
        }
        return {};
    },
    
    back() {
        window.history.back();
    },
    
    matchRoute(path) {
        // Handle exact matches
        let route = this.routes.find(r => r.path === path);
        if (route) return route;
        
        // Handle dynamic routes like /roadmaps/:id
        const segments = path.split('/').filter(Boolean);
        if (segments.length > 0) {
            const dynamicRoute = this.routes.find(r => {
                const routeSegments = r.path.split('/').filter(Boolean);
                if (routeSegments.length !== segments.length) return false;
                
                return routeSegments.every((seg, i) => {
                    return seg === segments[i] || seg.startsWith(':');
                });
            });
            if (dynamicRoute) return dynamicRoute;
        }
        
        // Default to landing
        return this.routes.find(r => r.path === '/') || this.routes[0];
    },
    
    async handleRouteChange() {
        const path = this.getCurrentRoute();
        const route = this.matchRoute(path);
        
        // Guards
        if (route.options.auth && !Auth.isAuthenticated()) {
            this.navigate('/login');
            return;
        }
        if (route.options.adminOnly && Auth.getRole() !== 'admin') {
            this.navigate('/dashboard');
            return;
        }
        // Redirect authenticated users away from login/signup pages
        if (!route.options.auth && Auth.isAuthenticated() && ['/login', '/signup'].includes(route.path)) {
            this.navigate('/dashboard');
            return;
        }
        
        const mainContent = document.getElementById('mainContent');
        const sidebar = document.getElementById('sidebar');
        const topbar = document.getElementById('topbar');
        
        const mobileNav = document.getElementById('mobileNav');
        
        // Shell visibility
        const isAuthOrLanding = ['/', '/login', '/signup', '/forgot-password', '/verify'].includes(route.path);
        
        if (isAuthOrLanding) {
            if(sidebar) sidebar.classList.add('hidden');
            if(topbar) topbar.classList.add('hidden');
            if(mobileNav) mobileNav.classList.add('hidden');
            if(mainContent) {
                mainContent.style.marginLeft = '0';
                mainContent.style.paddingTop = '0';
                mainContent.style.paddingBottom = '0';
            }
        } else {
            if(sidebar) sidebar.classList.remove('hidden');
            if(topbar) topbar.classList.remove('hidden');
            if(mobileNav) mobileNav.classList.remove('hidden');
            if(mainContent) {
                mainContent.style.marginLeft = '';
                mainContent.style.paddingTop = '';
                mainContent.style.paddingBottom = '';
            }
        }
        
        // Update sidebar and mobile nav active state
        const updateActiveState = (selector, activeClass) => {
            document.querySelectorAll(selector).forEach(item => {
                item.classList.remove(activeClass);
                const href = item.getAttribute('href') || item.getAttribute('data-route');
                const itemRoute = href ? (href.startsWith('#') ? href.slice(1) : href) : null;
                if (itemRoute && path.startsWith(itemRoute) && (itemRoute !== '/' || path === '/')) {
                    item.classList.add(activeClass);
                }
            });
        };
        updateActiveState('.sidebar__item', 'sidebar__item--active');
        updateActiveState('.mobile-nav__item', 'mobile-nav__item--active');
        
        // Cleanup old
        if (this.currentModule && this.currentModule.cleanup) {
            this.currentModule.cleanup();
        }
        
        // Render new
        this.currentModule = route.module;
        if (mainContent) {
            mainContent.innerHTML = this.currentModule.render();
            // Trigger reflow for animation
            void mainContent.offsetWidth;
            
            if (this.currentModule.init) {
                setTimeout(() => this.currentModule.init(), 0);
            }
        }
    },
    
    init() {
        window.addEventListener('hashchange', () => this.handleRouteChange());
        // Handle initial route
        if (!window.location.hash) {
            window.location.hash = '#/';
        } else {
            this.handleRouteChange();
        }
    }
};

export default Router;
