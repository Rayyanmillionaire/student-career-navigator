import Store from '../js/store.js';
import Theme from '../js/theme.js';
import Components from '../js/components.js';
import PWA from '../js/pwa.js';

const SettingsPage = {
    render() {
        const settings = Store.get('settings') || { theme: 'light', notifications: true, emailNotifications: true, privacy: 'public' };
        const canInstall = PWA.canInstall();
        
        return `
            <div class="page animate-fade-in max-w-4xl mx-auto">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">Settings</h1>
                        <p class="page__subtitle">Customize your application experience.</p>
                    </div>
                </div>

                <div class="flex flex-col gap-lg">
                    <!-- Appearance -->
                    <div class="card animate-slide-up stagger-1">
                        <div class="card__header">
                            <h3 class="card__title flex items-center gap-sm"><i data-lucide="monitor"></i> Appearance</h3>
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label">Theme Preference</label>
                            <div class="flex gap-md mt-sm">
                                <label class="card card--bordered cursor-pointer flex-1 text-center hover:border-accent ${settings.theme === 'light' ? 'border-accent shadow-md bg-info-bg' : ''}">
                                    <input type="radio" name="theme" value="light" class="hidden" ${settings.theme === 'light' ? 'checked' : ''}>
                                    <i data-lucide="sun" class="w-8 h-8 mx-auto mb-sm ${settings.theme === 'light' ? 'text-accent' : ''}"></i>
                                    <div class="font-medium">Light Mode</div>
                                </label>
                                <label class="card card--bordered cursor-pointer flex-1 text-center hover:border-accent ${settings.theme === 'dark' ? 'border-accent shadow-md bg-info-bg' : ''}">
                                    <input type="radio" name="theme" value="dark" class="hidden" ${settings.theme === 'dark' ? 'checked' : ''}>
                                    <i data-lucide="moon" class="w-8 h-8 mx-auto mb-sm ${settings.theme === 'dark' ? 'text-accent' : ''}"></i>
                                    <div class="font-medium">Dark Mode</div>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- App Install -->
                    <div class="card card--gradient animate-slide-up stagger-2" id="installCard" style="display: ${canInstall ? 'block' : 'none'}">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-bold font-xl mb-xs">Install App</h3>
                                <p class="opacity-80 text-sm">Add CareerNav to your home screen for a better full-screen experience and offline access.</p>
                            </div>
                            <button class="btn btn--secondary" id="installAppBtn"><i data-lucide="download"></i> Install Now</button>
                        </div>
                    </div>

                    <!-- Notifications -->
                    <div class="card animate-slide-up stagger-3">
                        <div class="card__header">
                            <h3 class="card__title flex items-center gap-sm"><i data-lucide="bell"></i> Notifications</h3>
                        </div>
                        <div class="flex flex-col gap-md">
                            <div class="flex justify-between items-center pb-md border-b border-color">
                                <div>
                                    <div class="font-bold mb-1">Push Notifications</div>
                                    <div class="text-sm text-secondary">Receive in-app alerts for deadlines and milestones.</div>
                                </div>
                                <label class="form-switch">
                                    <input type="checkbox" id="setNotifs" ${settings.notifications ? 'checked' : ''}>
                                </label>
                            </div>
                            <div class="flex justify-between items-center pb-md border-b border-color">
                                <div>
                                    <div class="font-bold mb-1">Email Notifications</div>
                                    <div class="text-sm text-secondary">Weekly progress reports and important alerts.</div>
                                </div>
                                <label class="form-switch">
                                    <input type="checkbox" id="setEmailNotifs" ${settings.emailNotifications ? 'checked' : ''}>
                                </label>
                            </div>
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="font-bold mb-1">Browser Notifications</div>
                                    <div class="text-sm text-secondary">Show native OS notifications for Pomodoro timer.</div>
                                </div>
                                <button class="btn btn--outline btn--sm" id="reqPermBtn">Request Permission</button>
                            </div>
                        </div>
                    </div>

                    <!-- Data Management -->
                    <div class="card animate-slide-up stagger-4 border-danger">
                        <div class="card__header">
                            <h3 class="card__title text-danger flex items-center gap-sm"><i data-lucide="alert-triangle"></i> Danger Zone</h3>
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-bold mb-1">Clear Local Data</div>
                                <div class="text-sm text-secondary">This will permanently delete all your tracking data stored in this browser.</div>
                            </div>
                            <button class="btn btn--danger" id="clearDataBtn">Clear All Data</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        if (window.lucide) lucide.createIcons();
        
        // Theme selection
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                Theme.set(e.target.value);
                // Update UI visually immediately without full re-render
                document.querySelectorAll('input[name="theme"]').forEach(r => {
                    const label = r.closest('.card');
                    const icon = label.querySelector('i');
                    if (r.checked) {
                        label.classList.add('border-accent', 'shadow-md', 'bg-info-bg');
                        icon.classList.add('text-accent');
                    } else {
                        label.classList.remove('border-accent', 'shadow-md', 'bg-info-bg');
                        icon.classList.remove('text-accent');
                    }
                });
            });
        });
        
        // Toggles
        const saveSettings = () => {
            const settings = Store.get('settings') || {};
            settings.notifications = document.getElementById('setNotifs')?.checked;
            settings.emailNotifications = document.getElementById('setEmailNotifs')?.checked;
            Store.set('settings', settings);
        };
        
        document.getElementById('setNotifs')?.addEventListener('change', saveSettings);
        document.getElementById('setEmailNotifs')?.addEventListener('change', saveSettings);
        
        // Permissions
        const reqBtn = document.getElementById('reqPermBtn');
        if (reqBtn && window.Notification) {
            if (Notification.permission === 'granted') {
                reqBtn.textContent = 'Granted';
                reqBtn.disabled = true;
            } else {
                reqBtn.addEventListener('click', () => {
                    Notification.requestPermission().then(perm => {
                        if (perm === 'granted') {
                            reqBtn.textContent = 'Granted';
                            reqBtn.disabled = true;
                            Components.toast('Notifications enabled', 'success');
                        }
                    });
                });
            }
        }
        
        // Clear Data
        const clearBtn = document.getElementById('clearDataBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', async () => {
                const conf = await Components.confirm('Clear All Data', 'Are you absolutely sure? This cannot be undone.');
                if (conf) {
                    Store.clear();
                    Components.toast('All local data cleared. Reloading...', 'warning');
                    setTimeout(() => window.location.reload(), 1500);
                }
            });
        }
        
        // PWA Install
        const installBtn = document.getElementById('installAppBtn');
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                const accepted = await PWA.promptInstall();
                if (accepted) {
                    document.getElementById('installCard').style.display = 'none';
                }
            });
        }
        
        window.addEventListener('pwa-install-available', () => {
            const card = document.getElementById('installCard');
            if (card) card.style.display = 'block';
        });
        
        window.addEventListener('pwa-installed', () => {
            const card = document.getElementById('installCard');
            if (card) card.style.display = 'none';
        });
    },
    
    cleanup() {}
};

export default SettingsPage;
