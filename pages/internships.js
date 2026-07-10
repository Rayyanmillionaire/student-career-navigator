import Store from '../js/store.js';
import Components from '../js/components.js';
import Utils from '../js/utils.js';

const InternshipsPage = {
    render() {
        return `
            <div class="page animate-fade-in flex flex-col h-full max-w-full">
                <div class="page__header flex-shrink-0">
                    <div>
                        <h1 class="page__title">Internship Tracker</h1>
                        <p class="page__subtitle">Manage your applications and interview pipeline.</p>
                    </div>
                    <div class="page__actions">
                        <button class="btn btn--primary" id="addAppBtn"><i data-lucide="plus"></i> Add Application</button>
                    </div>
                </div>

                <div class="kanban animate-slide-up flex-1">
                    ${this.renderColumn('Wishlist', 'wishlist')}
                    ${this.renderColumn('Applied', 'applied')}
                    ${this.renderColumn('Interview', 'interview')}
                    ${this.renderColumn('Offer', 'offer')}
                    ${this.renderColumn('Rejected', 'rejected')}
                </div>
            </div>
        `;
    },
    
    renderColumn(title, status) {
        return `
            <div class="kanban__column" data-status="${status}">
                <div class="kanban__header">
                    ${title} <span class="kanban__count" id="count-${status}">0</span>
                </div>
                <div class="kanban__cards" id="col-${status}">
                    <!-- Cards injected via JS -->
                </div>
            </div>
        `;
    },
    
    renderCards() {
        const apps = Store.get('internships') || [];
        const columns = {
            'wishlist': document.getElementById('col-wishlist'),
            'applied': document.getElementById('col-applied'),
            'interview': document.getElementById('col-interview'),
            'offer': document.getElementById('col-offer'),
            'rejected': document.getElementById('col-rejected')
        };
        
        // Clear all columns
        Object.values(columns).forEach(col => { if(col) col.innerHTML = ''; });
        
        // Reset counts
        const counts = { wishlist: 0, applied: 0, interview: 0, offer: 0, rejected: 0 };
        
        apps.forEach(app => {
            const status = app.status ? app.status.toLowerCase() : 'wishlist';
            if (columns[status]) {
                counts[status]++;
                const cardHtml = `
                    <div class="kanban__card" draggable="true" data-id="${app.id}">
                        <div class="flex justify-between items-start mb-sm">
                            <h4 class="font-bold text-primary">${app.role}</h4>
                            <div class="dropdown">
                                <button class="btn btn--icon btn--ghost p-0 w-6 h-6" data-app-menu="${app.id}"><i data-lucide="more-horizontal" class="w-4 h-4"></i></button>
                                <div class="dropdown__menu" id="amenu-${app.id}">
                                    <button class="dropdown__item edit-app" data-id="${app.id}"><i data-lucide="edit-2"></i> Edit</button>
                                    <button class="dropdown__item text-danger delete-app" data-id="${app.id}"><i data-lucide="trash-2"></i> Delete</button>
                                </div>
                            </div>
                        </div>
                        <div class="text-sm font-medium text-secondary mb-md"><i data-lucide="building" class="w-3 h-3 inline"></i> ${app.company}</div>
                        
                        ${app.deadline ? `
                            <div class="text-xs ${new Date(app.deadline) < new Date() ? 'text-danger' : 'text-tertiary'} mb-sm">
                                <i data-lucide="calendar" class="w-3 h-3 inline"></i> ${Utils.formatDateShort(app.deadline)}
                            </div>
                        ` : ''}
                        
                        ${app.link ? `
                            <a href="${app.link}" target="_blank" class="text-xs text-accent hover:underline"><i data-lucide="external-link" class="w-3 h-3 inline"></i> Job Post</a>
                        ` : ''}
                    </div>
                `;
                columns[status].insertAdjacentHTML('beforeend', cardHtml);
            }
        });
        
        // Update counts
        Object.keys(counts).forEach(k => {
            const el = document.getElementById(`count-${k}`);
            if (el) el.textContent = counts[k];
        });
        
        if (window.lucide) lucide.createIcons();
        this.attachCardEvents();
    },
    
    openModal(app = null) {
        const formHtml = `
            <form id="appForm">
                <input type="hidden" id="appId" value="${app ? app.id : ''}">
                <div class="form-group">
                    <label class="form-label">Company Name</label>
                    <input type="text" id="appCompany" class="form-input" required value="${app ? app.company : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Role</label>
                    <input type="text" id="appRole" class="form-input" required value="${app ? app.role : ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="appStatus" class="form-select">
                            <option value="wishlist" ${app && app.status.toLowerCase() === 'wishlist' ? 'selected' : ''}>Wishlist</option>
                            <option value="applied" ${app && app.status.toLowerCase() === 'applied' ? 'selected' : ''}>Applied</option>
                            <option value="interview" ${app && app.status.toLowerCase() === 'interview' ? 'selected' : ''}>Interviewing</option>
                            <option value="offer" ${app && app.status.toLowerCase() === 'offer' ? 'selected' : ''}>Offer</option>
                            <option value="rejected" ${app && app.status.toLowerCase() === 'rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Deadline / Date</label>
                        <input type="date" id="appDate" class="form-input" value="${app && app.deadline ? app.deadline : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Link</label>
                    <input type="url" id="appLink" class="form-input" value="${app ? app.link || '' : ''}" placeholder="https://...">
                </div>
            </form>
        `;

        Components.modal({
            title: app ? 'Edit Application' : 'Add Application',
            content: formHtml,
            onConfirm: (close) => {
                const company = document.getElementById('appCompany').value;
                const role = document.getElementById('appRole').value;
                if (!company || !role) return;
                
                const status = document.getElementById('appStatus').value;
                const deadline = document.getElementById('appDate').value;
                const link = document.getElementById('appLink').value;
                const id = document.getElementById('appId').value || Utils.generateId();
                
                let apps = Store.get('internships') || [];
                const newApp = { id, company, role, status, deadline, link };
                
                if (app) {
                    const idx = apps.findIndex(a => a.id === id);
                    if (idx !== -1) apps[idx] = newApp;
                } else {
                    apps.push(newApp);
                }
                
                Store.set('internships', apps);
                this.renderCards();
                close();
            }
        });
    },
    
    attachCardEvents() {
        // Dropdown menus
        document.querySelectorAll('[data-app-menu]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-app-menu');
                const menu = document.getElementById(`amenu-${id}`);
                
                document.querySelectorAll('.dropdown__menu--active').forEach(m => {
                    if (m !== menu) m.classList.remove('dropdown__menu--active');
                });
                menu.classList.toggle('dropdown__menu--active');
            });
        });

        // Edit
        document.querySelectorAll('.edit-app').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const apps = Store.get('internships') || [];
                const app = apps.find(a => a.id === id);
                if (app) this.openModal(app);
            });
        });
        
        // Delete
        document.querySelectorAll('.delete-app').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const confirmed = await Components.confirm('Delete Application', 'Are you sure?');
                if (confirmed) {
                    let apps = Store.get('internships') || [];
                    apps = apps.filter(a => a.id !== id);
                    Store.set('internships', apps);
                    this.renderCards();
                }
            });
        });
        
        // Drag and Drop
        const cards = document.querySelectorAll('.kanban__card');
        const cols = document.querySelectorAll('.kanban__cards');
        
        cards.forEach(card => {
            card.addEventListener('dragstart', () => {
                card.classList.add('dragging');
                card.style.opacity = '0.5';
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                card.style.opacity = '1';
                
                // Update status in store based on parent column
                const parentCol = card.closest('.kanban__column');
                if(parentCol) {
                    const status = parentCol.getAttribute('data-status');
                    const id = card.getAttribute('data-id');
                    let apps = Store.get('internships') || [];
                    const idx = apps.findIndex(a => a.id === id);
                    if (idx !== -1 && apps[idx].status.toLowerCase() !== status) {
                        apps[idx].status = status;
                        Store.set('internships', apps);
                        this.renderCards(); // Re-render to update counts and styling
                    }
                }
            });
        });
        
        cols.forEach(col => {
            col.addEventListener('dragover', e => {
                e.preventDefault();
                const dragging = document.querySelector('.dragging');
                if(dragging) {
                    col.appendChild(dragging);
                }
            });
        });
    },

    init() {
        this.renderCards();
        const addBtn = document.getElementById('addAppBtn');
        if (addBtn) addBtn.addEventListener('click', () => this.openModal());
        
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown__menu--active').forEach(m => {
                if(m.id && m.id.startsWith('amenu-')) m.classList.remove('dropdown__menu--active');
            });
        });
    },
    
    cleanup() {}
};

export default InternshipsPage;
