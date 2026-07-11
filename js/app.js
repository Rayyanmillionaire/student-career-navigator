import Router from './router.js';
import Store from './store.js';
import Auth from './auth.js';
import Theme from './theme.js';
import PWA from './pwa.js';
import Utils from './utils.js';
import Components from './components.js';

// Import Pages
import LandingPage from '../pages/landing.js';
import AuthPage from '../pages/auth.js';
import DashboardPage from '../pages/dashboard.js';
import ProfilePage from '../pages/profile.js';
import RoadmapsPage from '../pages/roadmaps.js';
import SkillsPage from '../pages/skills.js';
import ResumePage from '../pages/resume.js';
import InternshipsPage from '../pages/internships.js';
import CertificationsPage from '../pages/certifications.js';
import GoalsPage from '../pages/goals.js';
import ProductivityPage from '../pages/productivity.js';
import AnalyticsPage from '../pages/analytics.js';
import NotificationsPage from '../pages/notifications.js';
import SearchPage from '../pages/search.js';
import AdminPage from '../pages/admin.js';
import SettingsPage from '../pages/settings.js';

const App = {
    init() {
        // Init core modules
        Store.init();
        Theme.init();
        PWA.init();
        
        // Register Routes
        Router.register('/', LandingPage, { auth: false });
        Router.register('/login', AuthPage, { auth: false });
        Router.register('/signup', AuthPage, { auth: false });
        Router.register('/forgot-password', AuthPage, { auth: false });
        Router.register('/verify', AuthPage, { auth: false });
        
        Router.register('/dashboard', DashboardPage, { auth: true });
        Router.register('/profile', ProfilePage, { auth: true });
        Router.register('/roadmaps', RoadmapsPage, { auth: true });
        Router.register('/roadmaps/:id', RoadmapsPage, { auth: true });
        Router.register('/skills', SkillsPage, { auth: true });
        Router.register('/resume', ResumePage, { auth: true });
        Router.register('/internships', InternshipsPage, { auth: true });
        Router.register('/certifications', CertificationsPage, { auth: true });
        Router.register('/goals', GoalsPage, { auth: true });
        Router.register('/productivity', ProductivityPage, { auth: true });
        Router.register('/analytics', AnalyticsPage, { auth: true });
        Router.register('/notifications', NotificationsPage, { auth: true });
        Router.register('/search', SearchPage, { auth: true });
        Router.register('/settings', SettingsPage, { auth: true });
        
        Router.register('/admin', AdminPage, { auth: true, adminOnly: true });

        // Setup Shell Interactions
        this.setupShell();
        
        // Init Router
        Router.init();
        
        // Update user specific shell info
        this.updateShellUser();
    },
    
    setupShell() {
        // Sidebar Toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.toggle('sidebar--collapsed');
            });
        }
        
        // Mobile Hamburger
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.add('sidebar--open');
                
                // Add overlay to close
                const overlay = document.createElement('div');
                overlay.className = 'modal-overlay modal--active';
                overlay.style.zIndex = '250';
                overlay.id = 'mobileSidebarOverlay';
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('sidebar--open');
                    overlay.remove();
                });
            });
        }
        
        // Close mobile sidebar on link click
        document.querySelectorAll('.sidebar__item').forEach(item => {
            item.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                if (window.innerWidth <= 768 && sidebar.classList.contains('sidebar--open')) {
                    sidebar.classList.remove('sidebar--open');
                    const overlay = document.getElementById('mobileSidebarOverlay');
                    if (overlay) overlay.remove();
                }
            });
        });
        
        // Theme Toggle
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            const updateThemeIcon = () => {
                themeBtn.innerHTML = Theme.get() === 'dark' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
                if (window.lucide) lucide.createIcons({ root: themeBtn });
            };
            updateThemeIcon(); // Initial
            
            themeBtn.addEventListener('click', () => {
                Theme.toggle();
                updateThemeIcon();
            });
            window.addEventListener('themechange', updateThemeIcon);
        }
        
        // Global Search (Ctrl+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                Router.navigate('/search');
            }
        });
        
        // Search Input Focus
        const searchInput = document.getElementById('topbarSearch');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                Router.navigate('/search');
                // The search page will auto-focus its own larger input
                searchInput.blur();
            });
        }
        
        // Notification Bell
        const notifBtn = document.getElementById('notifBtn');
        if (notifBtn) {
            notifBtn.addEventListener('click', () => {
                Router.navigate('/notifications');
            });
            this.updateNotificationBadge();
            // Subscribe to notifications updates
            Store.subscribe('notifications', () => this.updateNotificationBadge());
        }
        
        // User Dropdown
        const userAvatarBtn = document.getElementById('userAvatarBtn');
        const userDropdown = document.getElementById('userDropdown');
        if (userAvatarBtn && userDropdown) {
            userAvatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('dropdown__menu--active');
            });
            
            document.addEventListener('click', () => {
                userDropdown.classList.remove('dropdown__menu--active');
            });
            
            // Dropdown actions
            document.getElementById('ddProfile')?.addEventListener('click', () => Router.navigate('/profile'));
            document.getElementById('ddSettings')?.addEventListener('click', () => Router.navigate('/settings'));
            document.getElementById('ddLogout')?.addEventListener('click', () => {
                Auth.logout();
            });
        }
        
        // Create initial icons
        if (window.lucide) lucide.createIcons();
    },
    
    updateShellUser() {
        const user = Auth.getUser();
        if (user) {
            // Show admin nav item if admin
            const adminNavs = document.querySelectorAll('[data-admin-only]');
            adminNavs.forEach(nav => {
                nav.style.display = user.role === 'admin' ? 'flex' : 'none';
            });
            
            // Update avatar initials
            const initialsEls = document.querySelectorAll('.avatar__initials');
            initialsEls.forEach(el => el.textContent = Utils.getInitials(user.name));
            
            // If user has profile picture, we could set it here
            if (user.profilePicture) {
                 const imgEls = document.querySelectorAll('.avatar__img');
                 imgEls.forEach(el => {
                     el.src = user.profilePicture;
                     el.style.display = 'block';
                 });
                 initialsEls.forEach(el => el.style.display = 'none');
            }
        }
    },
    
    updateNotificationBadge() {
        const notifs = Store.get('notifications') || [];
        const unreadCount = notifs.filter(n => !n.read).length;
        const badge = document.getElementById('notifBadge');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for debugging if needed
window.App = App;
