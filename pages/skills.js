import Store from '../js/store.js';
import Components from '../js/components.js';

const SkillsPage = {
    render() {
        return `
            <div class="page animate-fade-in">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">Skill Tracker</h1>
                        <p class="page__subtitle">Track your proficiency across different technologies and soft skills.</p>
                    </div>
                    <div class="page__actions">
                        <button class="btn btn--primary" id="addSkillBtn"><i data-lucide="plus"></i> Add Skill</button>
                    </div>
                </div>

                <div class="card mb-xl animate-slide-up stagger-1">
                    <div class="flex gap-md mb-lg">
                        <div class="input-group flex-1">
                            <i data-lucide="search" class="input-group__icon"></i>
                            <input type="text" id="skillSearch" class="form-input" placeholder="Search skills...">
                        </div>
                        <select id="skillCategoryFilter" class="form-select w-auto">
                            <option value="all">All Categories</option>
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="database">Database</option>
                            <option value="tools">Tools & DevOps</option>
                            <option value="soft">Soft Skills</option>
                        </select>
                    </div>
                    
                    <div id="skillsGrid" class="grid grid-3">
                        <!-- Rendered via JS -->
                    </div>
                </div>
            </div>
        `;
    },
    
    renderSkillsGrid(skills = null) {
        if (!skills) skills = Store.get('skills') || [];
        const container = document.getElementById('skillsGrid');
        if (!container) return;
        
        if (skills.length === 0) {
            container.innerHTML = `<div class="col-span-3">` + Components.emptyState({
                icon: 'zap',
                title: 'No skills added yet',
                message: 'Start tracking your technical and soft skills to visualize your growth.',
                actionText: 'Add Your First Skill',
                onAction: () => this.openAddModal()
            }) + `</div>`;
            return;
        }
        
        const categoryColors = {
            'frontend': 'blue',
            'backend': 'purple',
            'database': 'green',
            'tools': 'orange',
            'soft': 'pink',
            'other': 'gray'
        };

        container.innerHTML = skills.map((skill, index) => {
            const color = categoryColors[skill.category] || 'blue';
            let levelText = 'Beginner';
            if(skill.level > 33) levelText = 'Intermediate';
            if(skill.level > 66) levelText = 'Advanced';
            if(skill.level > 90) levelText = 'Expert';

            return `
                <div class="card card--hover stagger-${(index % 6) + 1}">
                    <div class="flex justify-between items-start mb-md">
                        <div class="flex items-center gap-sm">
                            <div class="avatar avatar--sm bg-${color}-bg text-${color}">
                                <i data-lucide="${this.getIconForCategory(skill.category)}"></i>
                            </div>
                            <h3 class="font-bold text-primary">${skill.name}</h3>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn--icon btn--ghost" data-skill-menu="${skill.id}"><i data-lucide="more-vertical"></i></button>
                            <div class="dropdown__menu" id="menu-${skill.id}">
                                <button class="dropdown__item edit-skill" data-id="${skill.id}"><i data-lucide="edit-2"></i> Edit</button>
                                <button class="dropdown__item text-danger delete-skill" data-id="${skill.id}"><i data-lucide="trash-2"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between text-sm mb-xs">
                        <span class="text-secondary">${levelText}</span>
                        <span class="font-bold text-${color}">${skill.level}%</span>
                    </div>
                    <div class="progress mb-md">
                        <div class="progress__bar bg-${color}" style="width: ${skill.level}%"></div>
                    </div>
                    
                    ${skill.tags && skill.tags.length > 0 ? `
                        <div class="flex flex-wrap gap-xs">
                            ${skill.tags.map(tag => `<span class="badge badge--outline" style="font-size: 10px">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        if (window.lucide) lucide.createIcons({ root: container });
        this.attachCardEvents();
    },
    
    getIconForCategory(cat) {
        const map = {
            'frontend': 'layout',
            'backend': 'server',
            'database': 'database',
            'tools': 'tool',
            'soft': 'users',
            'other': 'zap'
        };
        return map[cat] || 'zap';
    },

    openAddModal(skillToEdit = null) {
        const formHtml = `
            <form id="skillForm">
                <input type="hidden" id="skillId" value="${skillToEdit ? skillToEdit.id : ''}">
                <div class="form-group">
                    <label class="form-label">Skill Name</label>
                    <input type="text" id="skillName" class="form-input" required value="${skillToEdit ? skillToEdit.name : ''}" placeholder="e.g. React.js">
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select id="skillCategory" class="form-select" required>
                        <option value="frontend" ${skillToEdit && skillToEdit.category === 'frontend' ? 'selected' : ''}>Frontend</option>
                        <option value="backend" ${skillToEdit && skillToEdit.category === 'backend' ? 'selected' : ''}>Backend</option>
                        <option value="database" ${skillToEdit && skillToEdit.category === 'database' ? 'selected' : ''}>Database</option>
                        <option value="tools" ${skillToEdit && skillToEdit.category === 'tools' ? 'selected' : ''}>Tools & DevOps</option>
                        <option value="soft" ${skillToEdit && skillToEdit.category === 'soft' ? 'selected' : ''}>Soft Skills</option>
                        <option value="other" ${skillToEdit && skillToEdit.category === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label flex justify-between">
                        Proficiency Level <span id="levelValue">${skillToEdit ? skillToEdit.level : '50'}%</span>
                    </label>
                    <input type="range" id="skillLevel" min="0" max="100" value="${skillToEdit ? skillToEdit.level : '50'}" class="w-full" style="accent-color: var(--accent-blue)">
                </div>
                <div class="form-group">
                    <label class="form-label">Tags (comma separated)</label>
                    <input type="text" id="skillTags" class="form-input" value="${skillToEdit && skillToEdit.tags ? skillToEdit.tags.join(', ') : ''}" placeholder="e.g. Hooks, Context API">
                </div>
            </form>
        `;

        Components.modal({
            title: skillToEdit ? 'Edit Skill' : 'Add New Skill',
            content: formHtml,
            confirmText: 'Save Skill',
            onConfirm: (close) => {
                const name = document.getElementById('skillName').value;
                if (!name) return;
                
                const category = document.getElementById('skillCategory').value;
                const level = parseInt(document.getElementById('skillLevel').value);
                const tagsStr = document.getElementById('skillTags').value;
                const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
                const id = document.getElementById('skillId').value || 'skill_' + Date.now();
                
                let skills = Store.get('skills') || [];
                
                if (skillToEdit) {
                    const idx = skills.findIndex(s => s.id === id);
                    if (idx !== -1) {
                        skills[idx] = { id, name, category, level, tags };
                    }
                } else {
                    skills.push({ id, name, category, level, tags });
                }
                
                Store.set('skills', skills);
                Components.toast('Skill saved successfully', 'success');
                this.renderSkillsGrid();
                close();
            }
        });
        
        // Range slider listener
        setTimeout(() => {
            const range = document.getElementById('skillLevel');
            const val = document.getElementById('levelValue');
            if(range && val) {
                range.addEventListener('input', (e) => {
                    val.textContent = e.target.value + '%';
                });
            }
        }, 100);
    },
    
    attachCardEvents() {
        // Dropdown menus
        document.querySelectorAll('[data-skill-menu]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-skill-menu');
                const menu = document.getElementById(`menu-${id}`);
                
                // close others
                document.querySelectorAll('.dropdown__menu--active').forEach(m => {
                    if (m !== menu) m.classList.remove('dropdown__menu--active');
                });
                
                menu.classList.toggle('dropdown__menu--active');
            });
        });
        
        // Close menus on outside click
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown__menu--active').forEach(m => {
                if(m.id.startsWith('menu-skill')) m.classList.remove('dropdown__menu--active');
            });
        });

        // Edit
        document.querySelectorAll('.edit-skill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const skills = Store.get('skills') || [];
                const skill = skills.find(s => s.id === id);
                if (skill) this.openAddModal(skill);
            });
        });
        
        // Delete
        document.querySelectorAll('.delete-skill').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const confirmed = await Components.confirm('Delete Skill', 'Are you sure you want to remove this skill?');
                if (confirmed) {
                    let skills = Store.get('skills') || [];
                    skills = skills.filter(s => s.id !== id);
                    Store.set('skills', skills);
                    this.renderSkillsGrid();
                    Components.toast('Skill deleted', 'success');
                }
            });
        });
    },

    init() {
        this.renderSkillsGrid();
        
        const addBtn = document.getElementById('addSkillBtn');
        if (addBtn) addBtn.addEventListener('click', () => this.openAddModal());
        
        // Search and Filter
        const searchInput = document.getElementById('skillSearch');
        const filterSelect = document.getElementById('skillCategoryFilter');
        
        const applyFilters = () => {
            const query = searchInput.value.toLowerCase();
            const category = filterSelect.value;
            let skills = Store.get('skills') || [];
            
            let filtered = skills.filter(s => {
                const matchesSearch = s.name.toLowerCase().includes(query) || (s.tags && s.tags.some(t => t.toLowerCase().includes(query)));
                const matchesCat = category === 'all' || s.category === category;
                return matchesSearch && matchesCat;
            });
            
            this.renderSkillsGrid(filtered);
        };
        
        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (filterSelect) filterSelect.addEventListener('change', applyFilters);
    },
    
    cleanup() {}
};

export default SkillsPage;
