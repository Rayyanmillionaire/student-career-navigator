import Store from '../js/store.js';
import Components from '../js/components.js';
import Utils from '../js/utils.js';

const CertificationsPage = {
    render() {
        return `
            <div class="page animate-fade-in">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">Certifications</h1>
                        <p class="page__subtitle">Track your earned credentials and planned certifications.</p>
                    </div>
                    <div class="page__actions">
                        <button class="btn btn--primary" id="addCertBtn"><i data-lucide="plus"></i> Add Certificate</button>
                    </div>
                </div>

                <div class="card mb-xl animate-slide-up">
                    <div id="certsGrid" class="grid grid-3">
                        <!-- Rendered via JS -->
                    </div>
                </div>
            </div>
        `;
    },
    
    renderGrid() {
        const certs = Store.get('certifications') || [];
        const container = document.getElementById('certsGrid');
        if (!container) return;
        
        if (certs.length === 0) {
            container.innerHTML = `<div class="col-span-3">` + Components.emptyState({
                icon: 'award',
                title: 'No certifications yet',
                message: 'Add your earned certificates to showcase your qualifications.',
                actionText: 'Add Certificate',
                onAction: () => this.openModal()
            }) + `</div>`;
            return;
        }

        container.innerHTML = certs.map((cert, index) => {
            const isEarned = cert.status === 'earned';
            return `
                <div class="card card--hover stagger-${(index % 6) + 1} ${!isEarned ? 'opacity-80' : ''}">
                    <div class="flex justify-between items-start mb-md">
                        <div class="avatar avatar--lg ${isEarned ? 'bg-warning-bg text-warning' : 'bg-tertiary text-secondary'}">
                            <i data-lucide="award"></i>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn--icon btn--ghost" data-cert-menu="${cert.id}"><i data-lucide="more-vertical"></i></button>
                            <div class="dropdown__menu" id="cmenu-${cert.id}">
                                <button class="dropdown__item edit-cert" data-id="${cert.id}"><i data-lucide="edit-2"></i> Edit</button>
                                <button class="dropdown__item text-danger delete-cert" data-id="${cert.id}"><i data-lucide="trash-2"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="font-bold text-primary mb-xs">${cert.name}</h3>
                    <div class="text-sm text-secondary mb-md"><i data-lucide="shield" class="w-3 h-3 inline"></i> ${cert.issuer}</div>
                    
                    <div class="flex justify-between items-center mt-auto border-t border-color pt-sm">
                        ${isEarned ? `
                            <span class="text-xs text-success font-medium"><i data-lucide="check-circle" class="w-3 h-3 inline"></i> Earned ${cert.date ? Utils.formatDateShort(cert.date) : ''}</span>
                        ` : `
                            <span class="text-xs text-warning font-medium"><i data-lucide="clock" class="w-3 h-3 inline"></i> Planned</span>
                        `}
                        
                        ${cert.url ? `<a href="${cert.url}" target="_blank" class="btn btn--ghost btn--sm"><i data-lucide="external-link"></i></a>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        if (window.lucide) lucide.createIcons({ root: container });
        this.attachEvents();
    },

    openModal(cert = null) {
        const formHtml = `
            <form id="certForm">
                <input type="hidden" id="certId" value="${cert ? cert.id : ''}">
                <div class="form-group">
                    <label class="form-label">Certification Name</label>
                    <input type="text" id="certName" class="form-input" required value="${cert ? cert.name : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Issuing Organization</label>
                    <input type="text" id="certIssuer" class="form-input" required value="${cert ? cert.issuer : ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="certStatus" class="form-select">
                            <option value="earned" ${cert && cert.status === 'earned' ? 'selected' : ''}>Earned</option>
                            <option value="planned" ${cert && cert.status === 'planned' ? 'selected' : ''}>Planned</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date</label>
                        <input type="date" id="certDate" class="form-input" value="${cert && cert.date ? cert.date : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Credential URL / ID</label>
                    <input type="text" id="certUrl" class="form-input" value="${cert ? cert.url || '' : ''}">
                </div>
            </form>
        `;

        Components.modal({
            title: cert ? 'Edit Certification' : 'Add Certification',
            content: formHtml,
            onConfirm: (close) => {
                const name = document.getElementById('certName').value;
                const issuer = document.getElementById('certIssuer').value;
                if (!name || !issuer) return;
                
                const status = document.getElementById('certStatus').value;
                const date = document.getElementById('certDate').value;
                const url = document.getElementById('certUrl').value;
                const id = document.getElementById('certId').value || Utils.generateId();
                
                let certs = Store.get('certifications') || [];
                const newCert = { id, name, issuer, status, date, url };
                
                if (cert) {
                    const idx = certs.findIndex(c => c.id === id);
                    if (idx !== -1) certs[idx] = newCert;
                } else {
                    certs.push(newCert);
                }
                
                Store.set('certifications', certs);
                this.renderGrid();
                close();
            }
        });
    },
    
    attachEvents() {
        document.querySelectorAll('[data-cert-menu]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-cert-menu');
                const menu = document.getElementById(`cmenu-${id}`);
                document.querySelectorAll('.dropdown__menu--active').forEach(m => {
                    if (m !== menu) m.classList.remove('dropdown__menu--active');
                });
                menu.classList.toggle('dropdown__menu--active');
            });
        });

        document.querySelectorAll('.edit-cert').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const certs = Store.get('certifications') || [];
                const cert = certs.find(c => c.id === id);
                if (cert) this.openModal(cert);
            });
        });
        
        document.querySelectorAll('.delete-cert').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const confirmed = await Components.confirm('Delete Certification', 'Are you sure?');
                if (confirmed) {
                    let certs = Store.get('certifications') || [];
                    certs = certs.filter(c => c.id !== id);
                    Store.set('certifications', certs);
                    this.renderGrid();
                }
            });
        });
    },

    init() {
        this.renderGrid();
        const addBtn = document.getElementById('addCertBtn');
        if (addBtn) addBtn.addEventListener('click', () => this.openModal());
        
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown__menu--active').forEach(m => {
                if(m.id && m.id.startsWith('cmenu-')) m.classList.remove('dropdown__menu--active');
            });
        });
    },
    
    cleanup() {}
};

export default CertificationsPage;
