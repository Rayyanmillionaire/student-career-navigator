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
        
        const mainContent = document.getElementById('mainContent');
        const sidebar = document.getElementById('sidebar');
        const topbar = document.getElementById('topbar');
        
        // Shell visibility
        const isAuthOrLanding = ['/', '/login', '/signup', '/forgot-password', '/verify'].includes(route.path);
        
        if (isAuthOrLanding) {
            if(sidebar) sidebar.classList.add('hidden');
            if(topbar) topbar.classList.add('hidden');
            if(mainContent) {
                mainContent.style.marginLeft = '0';
                mainContent.style.paddingTop = '0';
            }
        } else {
            if(sidebar) sidebar.classList.remove('hidden');
            if(topbar) topbar.classList.remove('hidden');
            if(mainContent) {
                mainContent.style.marginLeft = '';
                mainContent.style.paddingTop = '';
            }
        }
        
        // Update sidebar active state
        document.querySelectorAll('.sidebar__item').forEach(item => {
            item.classList.remove('sidebar__item--active');
            const itemRoute = item.getAttribute('data-route');
            // Basic matching for sidebar highlighting
            if (itemRoute && path.startsWith(itemRoute) && (itemRoute !== '/' || path === '/')) {
                 // Prevent / highlighting everything, only highlight if path is exactly / or starts with itemRoute
                 if (itemRoute !== '/' || path === '/') {
                     item.classList.add('sidebar__item--active');
                 }
            }
        });
        
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
