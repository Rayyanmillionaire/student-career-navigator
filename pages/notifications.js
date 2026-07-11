import Store from '../js/store.js';
import Utils from '../js/utils.js';

const NotificationsPage = {
    render() {
        return `
            <div class="page animate-fade-in max-w-4xl mx-auto">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">Notifications</h1>
                        <p class="page__subtitle">Stay updated on your career progress.</p>
                    </div>
                    <div class="page__actions">
                        <button class="btn btn--ghost" id="markAllReadBtn"><i data-lucide="check-square"></i> Mark all as read</button>
                    </div>
                </div>

                <div class="card p-0 animate-slide-up">
                    <div class="list" id="notifList">
                        <!-- Rendered via JS -->
                    </div>
                </div>
            </div>
        `;
    },
    
    renderList() {
        const notifs = Store.get('notifications') || [];
        const container = document.getElementById('notifList');
        if (!container) return;
        
        if (notifs.length === 0) {
            container.innerHTML = `
                <div class="p-xl text-center text-secondary">
                    <i data-lucide="bell-off" class="w-12 h-12 mx-auto mb-md opacity-50"></i>
                    <p>No notifications yet.</p>
                </div>
            `;
            if (window.lucide) lucide.createIcons({ root: container });
            return;
        }
        
        // Sort newest first
        notifs.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = notifs.map(n => {
            const iconMap = {
                'info': 'info',
                'success': 'check-circle',
                'warning': 'alert-triangle',
                'alert': 'bell'
            };
            const colorMap = {
                'info': 'blue',
                'success': 'green',
                'warning': 'orange',
                'alert': 'red'
            };
            const icon = iconMap[n.type] || 'bell';
            const color = colorMap[n.type] || 'blue';
            
            return `
                <div class="list__item ${n.read ? 'opacity-70' : 'bg-bg-tertiary'}">
                    <div class="list__icon bg-${color}-bg text-${color}">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="list__content">
                        <div class="list__title font-bold ${!n.read ? 'text-primary' : 'text-secondary'}">${n.title}</div>
                        <div class="list__subtitle text-sm mt-1" style="white-space: normal;">${n.message}</div>
                    </div>
                    <div class="list__action flex-col items-end justify-between">
                        <div class="text-xs text-tertiary">${Utils.timeAgo(n.date)}</div>
                        ${!n.read ? `<div class="w-2 h-2 rounded-full bg-accent-blue mt-sm"></div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        if (window.lucide) lucide.createIcons({ root: container });
    },

    init() {
        // Seed welcome notification if empty
        let notifs = Store.get('notifications');
        if (!notifs || notifs.length === 0) {
            notifs = [
                { id: 'welcome', title: 'Welcome to CareerNav!', message: 'Start by tracking your skills, planning goals, and exploring roadmaps.', type: 'info', read: false, date: new Date().toISOString() }
            ];
            Store.set('notifications', notifs);
        }
        
        this.renderList();
        
        const markAllBtn = document.getElementById('markAllReadBtn');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', () => {
                let current = Store.get('notifications') || [];
                current = current.map(n => ({ ...n, read: true }));
                Store.set('notifications', current);
                this.renderList();
            });
        }
    },
    
    cleanup() {}
};

export default NotificationsPage;
