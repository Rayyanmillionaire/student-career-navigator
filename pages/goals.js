import Store from '../js/store.js';
import Components from '../js/components.js';
import Utils from '../js/utils.js';

const GoalsPage = {
    render() {
        return `
            <div class="page animate-fade-in">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">Goal Planner</h1>
                        <p class="page__subtitle">Set, track, and achieve your short-term and long-term career objectives.</p>
                    </div>
                    <div class="page__actions">
                        <button class="btn btn--primary" id="addGoalBtn"><i data-lucide="plus"></i> New Goal</button>
                    </div>
                </div>

                <div class="grid" style="grid-template-columns: 2fr 1fr;">
                    <div class="card animate-slide-up stagger-1">
                        <div class="tabs px-md border-b border-color mb-md">
                            <button class="tab tab--active" id="tabActive">Active</button>
                            <button class="tab" id="tabCompleted">Completed</button>
                        </div>
                        <div class="list" id="goalsList">
                            <!-- Injected -->
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-lg animate-slide-up stagger-2">
                        <div class="card">
                            <h3 class="card__title mb-md">Goal Overview</h3>
                            <div class="relative w-full aspect-square" style="max-height: 250px; margin: 0 auto;">
                                <canvas id="goalChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderList(filter = 'active') {
        let goals = Store.get('goals') || [];
        const container = document.getElementById('goalsList');
        if (!container) return;
        
        if (filter === 'active') {
            goals = goals.filter(g => g.status !== 'completed');
        } else {
            goals = goals.filter(g => g.status === 'completed');
        }
        
        if (goals.length === 0) {
            container.innerHTML = Components.emptyState({
                icon: 'target',
                title: 'No goals found',
                message: filter === 'active' ? 'Set a new goal to start tracking.' : 'No completed goals yet.',
            });
            this.updateChart();
            return;
        }
        
        container.innerHTML = goals.map(g => {
            const isCompleted = g.status === 'completed';
            return `
                <div class="list__item hover:bg-bg-tertiary transition-colors">
                    <label class="form-checkbox mr-sm">
                        <input type="checkbox" class="goal-checkbox" data-id="${g.id}" ${isCompleted ? 'checked' : ''}>
                    </label>
                    <div class="list__content ${isCompleted ? 'opacity-50 line-through' : ''}">
                        <div class="list__title">${g.title}</div>
                        <div class="list__subtitle">${g.category || 'General'}</div>
                    </div>
                    <div class="list__action flex items-center gap-md">
                        ${g.deadline ? `<span class="text-xs text-secondary"><i data-lucide="clock" class="w-3 h-3 inline"></i> ${Utils.formatDateShort(g.deadline)}</span>` : ''}
                        <button class="btn btn--icon btn--ghost text-danger delete-goal" data-id="${g.id}"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            `;
        }).join('');
        
        if (window.lucide) lucide.createIcons({ root: container });
        this.attachListEvents();
        this.updateChart();
    },
    
    openModal() {
        const formHtml = `
            <form id="goalForm">
                <div class="form-group">
                    <label class="form-label">Goal Title</label>
                    <input type="text" id="goalTitle" class="form-input" required placeholder="e.g. Complete React Course">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select id="goalCategory" class="form-select">
                            <option value="Learning">Learning</option>
                            <option value="Project">Project</option>
                            <option value="Career">Career / Job</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Deadline</label>
                        <input type="date" id="goalDeadline" class="form-input">
                    </div>
                </div>
            </form>
        `;

        Components.modal({
            title: 'Create New Goal',
            content: formHtml,
            onConfirm: (close) => {
                const title = document.getElementById('goalTitle').value;
                if (!title) return;
                
                const category = document.getElementById('goalCategory').value;
                const deadline = document.getElementById('goalDeadline').value;
                
                let goals = Store.get('goals') || [];
                goals.push({
                    id: Utils.generateId(),
                    title,
                    category,
                    deadline,
                    status: 'active',
                    createdAt: new Date().toISOString()
                });
                
                Store.set('goals', goals);
                
                // Ensure active tab is selected
                document.getElementById('tabActive').click();
                
                close();
            }
        });
    },
    
    attachListEvents() {
        document.querySelectorAll('.goal-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const isChecked = e.target.checked;
                let goals = Store.get('goals') || [];
                const idx = goals.findIndex(g => g.id === id);
                if (idx !== -1) {
                    goals[idx].status = isChecked ? 'completed' : 'active';
                    Store.set('goals', goals);
                    const activeTab = document.querySelector('.tabs .tab--active').id;
                    this.renderList(activeTab === 'tabActive' ? 'active' : 'completed');
                }
            });
        });
        
        document.querySelectorAll('.delete-goal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                let goals = Store.get('goals') || [];
                goals = goals.filter(g => g.id !== id);
                Store.set('goals', goals);
                const activeTab = document.querySelector('.tabs .tab--active').id;
                this.renderList(activeTab === 'tabActive' ? 'active' : 'completed');
            });
        });
    },
    
    updateChart() {
        const goals = Store.get('goals') || [];
        const completed = goals.filter(g => g.status === 'completed').length;
        const active = goals.length - completed;
        
        if (window.Charts) {
            window.Charts.create('goalChart', {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Active'],
                    datasets: [{
                        data: [completed, active],
                        backgroundColor: [window.Charts.getColors().green, window.Charts.getColors().blue],
                        borderWidth: 0,
                        cutout: '75%'
                    }]
                },
                options: {
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }
    },

    init() {
        this.renderList('active');
        
        const addBtn = document.getElementById('addGoalBtn');
        if (addBtn) addBtn.addEventListener('click', () => this.openModal());
        
        const tabActive = document.getElementById('tabActive');
        const tabCompleted = document.getElementById('tabCompleted');
        
        if (tabActive && tabCompleted) {
            tabActive.addEventListener('click', () => {
                tabActive.classList.add('tab--active');
                tabCompleted.classList.remove('tab--active');
                this.renderList('active');
            });
            tabCompleted.addEventListener('click', () => {
                tabCompleted.classList.add('tab--active');
                tabActive.classList.remove('tab--active');
                this.renderList('completed');
            });
        }
    },
    
    cleanup() {
        if(window.Charts) window.Charts.destroy('goalChart');
    }
};

export default GoalsPage;
