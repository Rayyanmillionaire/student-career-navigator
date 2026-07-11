import Store from '../js/store.js';
import Auth from '../js/auth.js';
import Utils from '../js/utils.js';
import Components from '../js/components.js';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : 'https://student-career-navigator-api.onrender.com';

const AdminPage = {
    render() {
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
                                <div class="font-3xl font-extrabold text-danger" id="totalUsersCount">-</div>
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
                            <tbody id="userTableBody">
                                <tr>
                                    <td colspan="6" class="text-center p-xl">
                                        <div class="flex justify-center items-center gap-sm">
                                            <div class="spinner"></div> Loading users...
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        if (window.lucide) lucide.createIcons();
        await this.loadUsers();
    },

    async loadUsers() {
        const token = Auth.getToken();
        const tbody = document.getElementById('userTableBody');
        const countEl = document.getElementById('totalUsersCount');

        try {
            const res = await fetch(`${API_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const users = await res.json();
                countEl.textContent = users.length;

                if (users.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" class="text-center p-xl text-secondary">No users found.</td></tr>`;
                    return;
                }

                tbody.innerHTML = users.map(u => `
                    <tr id="user-row-${u.id}">
                        <td class="font-mono text-xs">${u.id}</td>
                        <td class="font-bold">${u.name}</td>
                        <td class="font-semibold text-secondary">${u.email || '-'}</td>
                        <td><span class="badge ${u.role === 'admin' ? 'badge--danger' : 'badge--primary'}">${u.role}</span></td>
                        <td>${u.createdAt ? Utils.formatDateShort(new Date(u.createdAt)) : '-'}</td>
                        <td>
                            <button class="btn btn--icon btn--ghost btn--sm text-danger delete-user-btn" data-id="${u.id}" data-name="${u.name}">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');

                if (window.lucide) lucide.createIcons({ root: tbody });

                // Attach delete listeners
                tbody.querySelectorAll('.delete-user-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const id = btn.getAttribute('data-id');
                        const name = btn.getAttribute('data-name');
                        await this.deleteUser(id, name);
                    });
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center p-xl text-danger">Failed to load users.</td></tr>`;
            }
        } catch (e) {
            console.error(e);
            tbody.innerHTML = `<tr><td colspan="6" class="text-center p-xl text-danger">Failed to connect to backend server.</td></tr>`;
        }
    },

    async deleteUser(id, name) {
        const confirmed = await Components.confirm("Delete User", `Are you sure you want to delete ${name}? This action cannot be undone.`);
        if (!confirmed) return;

        const token = Auth.getToken();
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                Components.toast(`${name} has been deleted.`, 'success');
                const row = document.getElementById(`user-row-${id}`);
                if (row) row.remove();
                
                // Update total count
                const countEl = document.getElementById('totalUsersCount');
                if (countEl) {
                    const currentCount = parseInt(countEl.textContent);
                    if (!isNaN(currentCount)) countEl.textContent = currentCount - 1;
                }
            } else {
                Components.toast("Failed to delete user.", "error");
            }
        } catch (e) {
            console.error(e);
            Components.toast("Connection to server failed.", "error");
        }
    },
    
    cleanup() {}
};

export default AdminPage;
