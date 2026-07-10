import Store from './store.js';

const Theme = {
    init() {
        const settings = Store.get('settings') || {};
        let theme = settings.theme;
        
        if (!theme) {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'dark';
            } else {
                theme = 'light';
            }
            settings.theme = theme;
            Store.set('settings', settings);
        }
        
        this.set(theme);
        
        // Listen for system changes if tracking system
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const currentSettings = Store.get('settings') || {};
            // Only auto-switch if they haven't explicitly set it, or we just want to track it
            // For now, let's keep user preference dominant
        });
    },
    
    get() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    },
    
    set(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        const settings = Store.get('settings') || {};
        settings.theme = theme;
        Store.set('settings', settings);
        
        // Dispatch custom event for charts to update
        window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
    },
    
    toggle() {
        const current = this.get();
        this.set(current === 'light' ? 'dark' : 'light');
    }
};

export default Theme;
