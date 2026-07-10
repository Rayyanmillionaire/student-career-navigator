import Store from '../js/store.js';
import Auth from '../js/auth.js';
import Utils from '../js/utils.js';

const AdminPage = {
    render() {
        const users = this.getUsers();
        
        return `
            <div class="page animate-fade-in">
                <div class="page__header">
                    <div>
                        <h1 class="page__title text-danger">Admin Dashboard</h1>
                        <p class="page__subtitle">System administration and user management.</p>
                    </div>
                </div>

                <div class="grid grid-3 mb-xl animate-slide-up stagger-1">
                    <div class="card bg-danger-bg border-danger">
                        <div class="flex items-center gap-md">
                            <i data-lucide="users" class="text-danger w-8 h-8"></i>
                            <div>
                                <div class="text-sm text-danger font-bold">Total Users</div>
                                <div class="font-3xl font-extrabold text-danger">${users.length}</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="text-sm text-secondary font-bold">Active Sessions</div>
                        <div class="font-3xl font-extrabold">1</div>
                    </div>
                    <div class="card">
                        <div class="text-sm text-secondary font-bold">System Status</div>
                        <div class="font-xl font-bold text-success flex items-center gap-xs mt-sm"><i data-lucide="check-circle"></i> All Systems Operational</div>
                    </div>
                </div>

                <div class="card p-0 animate-slide-up stagger-2 overflow-hidden">
                    <div class="card__header p-lg border-b border-color mb-0">
                        <h3 class="card__title">User Management</h3>
                    </div>
                    <div class="table-container">
                        <table class="table table--hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(u => `
                                    <tr>
                                        <td class="font-mono text-xs">${u.id}</td>
                                        <td class="font-bold">${u.name}</td>
                                        <td>${u.email}</td>
                                        <td><span class="badge ${u.role === 'admin' ? 'badge--danger' : 'badge--primary'}">${u.role}</span></td>
                                        <td>${u.createdAt ? Utils.formatDateShort(u.createdAt) : '-'}</td>
                                        <td>
                                            <button class="btn btn--icon btn--ghost btn--sm"><i data-lucide="edit-2"></i></button>
                                            <button class="btn btn--icon btn--ghost btn--sm text-danger"><i data-lucide="trash-2"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },
    
    getUsers() {
        const data = localStorage.getItem('scn_users');
        try { return data ? JSON.parse(data) : []; } catch(e) { return []; }
    },

    init() {
        if (window.lucide) lucide.createIcons();
    },
    
    cleanup() {}
};

export default AdminPage;
