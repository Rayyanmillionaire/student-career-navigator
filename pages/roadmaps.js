import Store from '../js/store.js';
import Router from '../js/router.js';
import Components from '../js/components.js';

const RoadmapsPage = {
    async fetchRoadmaps() {
        try {
            const response = await fetch('./data/roadmaps.json');
            return await response.json();
        } catch (e) {
            console.error("Failed to load roadmaps", e);
            return [];
        }
    },

    renderList(roadmaps, progressData) {
        let html = `
            <div class="page animate-fade-in">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">Career Roadmaps</h1>
                        <p class="page__subtitle">Curated learning paths to guide you from beginner to job-ready.</p>
                    </div>
                </div>
                
                <div class="grid grid-3">
        `;
        
        roadmaps.forEach((rm, i) => {
            const prog = progressData[rm.id] || { completed: [] };
            // Calculate total steps
            const totalSteps = rm.levels.reduce((sum, level) => sum + level.steps.length, 0);
            const completedCount = prog.completed.length;
            const percentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
            
            html += `
                <div class="card card--hover stagger-${(i % 6) + 1} cursor-pointer" onclick="window.location.hash='#/roadmaps/${rm.id}'">
                    <div class="flex justify-between items-start mb-md">
                        <div class="avatar avatar--lg bg-${rm.color}-bg text-${rm.color}">
                            <i data-lucide="${rm.icon}"></i>
                        </div>
                        ${Components.badge(rm.difficulty, 'outline')}
                    </div>
                    <h3 class="card__title mb-xs">${rm.title}</h3>
                    <p class="text-sm text-secondary mb-lg line-clamp-2">${rm.description}</p>
                    
                    <div class="mt-auto">
                        <div class="flex justify-between text-xs font-medium mb-xs">
                            <span class="text-secondary">Progress</span>
                            <span class="${percentage > 0 ? 'text-accent' : 'text-secondary'}">${percentage}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress__bar" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div></div>`;
        return html;
    },
    
    renderDetail(roadmap, progressData) {
        const prog = progressData[roadmap.id] || { completed: [] };
        const totalSteps = roadmap.levels.reduce((sum, level) => sum + level.steps.length, 0);
        const percentage = totalSteps > 0 ? Math.round((prog.completed.length / totalSteps) * 100) : 0;
        
        let html = `
            <div class="page animate-fade-in">
                <button class="btn btn--ghost btn--sm mb-md" onclick="window.history.back()">
                    <i data-lucide="arrow-left"></i> Back to Roadmaps
                </button>
                
                <div class="card card--gradient mb-xl animate-slide-down">
                    <div class="flex items-center gap-lg">
                        <div class="avatar avatar--xl bg-glass">
                            <i data-lucide="${roadmap.icon}"></i>
                        </div>
                        <div class="flex-1">
                            <h1 class="font-3xl font-bold text-inverse mb-xs">${roadmap.title}</h1>
                            <p class="text-inverse opacity-80 mb-md max-w-2xl">${roadmap.description}</p>
                            <div class="flex gap-md">
                                ${Components.badge(`<i data-lucide="clock" class="w-3 h-3 mr-xs inline-block"></i> ${roadmap.duration}`, 'outline')}
                                ${Components.badge(`<i data-lucide="bar-chart" class="w-3 h-3 mr-xs inline-block"></i> ${roadmap.difficulty}`, 'outline')}
                            </div>
                        </div>
                        <div class="hidden lg:block text-right">
                            <div class="font-4xl font-bold mb-xs">${percentage}%</div>
                            <div class="text-sm opacity-80">Completed</div>
                        </div>
                    </div>
                </div>
                
                <div class="grid" style="grid-template-columns: 2fr 1fr;">
                    <div class="animate-slide-up stagger-1">
                        <div class="card">
                            <div class="card__header">
                                <h3 class="card__title">Learning Path</h3>
                            </div>
                            <div class="roadmap-timeline" id="roadmapTimeline">
        `;
        
        roadmap.levels.forEach((level, levelIdx) => {
            html += `<h4 class="font-lg font-bold mt-md mb-md">${level.name}</h4>`;
            
            level.steps.forEach((step, stepIdx) => {
                const isCompleted = prog.completed.includes(step.id);
                // Simple logic for current step: first uncompleted step
                let isCurrent = false;
                let isLocked = false;
                
                if (!isCompleted) {
                    const prevStepId = stepIdx > 0 ? level.steps[stepIdx-1].id : (levelIdx > 0 ? roadmap.levels[levelIdx-1].steps[roadmap.levels[levelIdx-1].steps.length-1].id : null);
                    if (!prevStepId || prog.completed.includes(prevStepId)) {
                        isCurrent = true;
                    } else {
                        isLocked = true;
                    }
                }
                
                let stateClass = '';
                let icon = 'circle';
                if (isCompleted) { stateClass = 'roadmap-step--completed'; icon = 'check'; }
                else if (isCurrent) { stateClass = 'roadmap-step--current'; icon = 'play'; }
                else if (isLocked) { stateClass = 'roadmap-step--locked opacity-50'; icon = 'lock'; }

                html += `
                    <div class="roadmap-step ${stateClass}">
                        <div class="roadmap-step__marker">
                            <i data-lucide="${icon}" style="width: 14px; height: 14px;"></i>
                        </div>
                        <div class="card card--bordered p-md ${isCurrent ? 'border-accent shadow-md' : ''}">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h5 class="font-bold mb-xs text-primary">${step.title}</h5>
                                    <p class="text-sm text-secondary">${step.description}</p>
                                </div>
                                ${!isLocked ? `
                                    <button class="btn ${isCompleted ? 'btn--success' : 'btn--outline'} btn--sm mark-step-btn" data-step-id="${step.id}" data-roadmap-id="${roadmap.id}">
                                        ${isCompleted ? 'Completed' : 'Mark Complete'}
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
        });
        
        html += `
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-lg animate-slide-up stagger-2">
                        <div class="card">
                            <h3 class="card__title mb-md">Key Skills</h3>
                            <div class="flex flex-wrap gap-xs">
                                ${roadmap.skills.map(s => Components.badge(s, 'secondary')).join('')}
                            </div>
                        </div>
                        
                        ${roadmap.projects && roadmap.projects.length > 0 ? `
                        <div class="card">
                            <h3 class="card__title mb-md">Recommended Projects</h3>
                            <div class="list">
                                ${roadmap.projects.map(p => `
                                    <div class="list__item px-0 py-sm">
                                        <div class="list__icon bg-bg-tertiary w-8 h-8 rounded"><i data-lucide="code" class="w-4 h-4"></i></div>
                                        <div class="list__content">
                                            <div class="list__title font-sm">${p.title}</div>
                                            <div class="list__subtitle text-xs">${p.description}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        return html;
    },

    render() {
        // Return a loading state initially
        return `<div class="page" id="roadmapsContainer">${Components.skeleton('card', 3)}</div>`;
    },
    
    async init() {
        const container = document.getElementById('roadmapsContainer');
        if (!container) return;
        
        const params = Router.getParams();
        const roadmaps = await this.fetchRoadmaps();
        const progressData = Store.get('roadmapProgress') || {};
        
        if (params.id) {
            const roadmap = roadmaps.find(r => r.id === params.id);
            if (roadmap) {
                container.outerHTML = this.renderDetail(roadmap, progressData);
                this.attachDetailEvents();
            } else {
                container.innerHTML = Components.emptyState({ title: 'Roadmap Not Found' });
            }
        } else {
            container.outerHTML = this.renderList(roadmaps, progressData);
        }
        
        if (window.lucide) lucide.createIcons();
    },
    
    attachDetailEvents() {
        document.querySelectorAll('.mark-step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stepId = e.currentTarget.getAttribute('data-step-id');
                const roadmapId = e.currentTarget.getAttribute('data-roadmap-id');
                
                let progressData = Store.get('roadmapProgress') || {};
                if (!progressData[roadmapId]) progressData[roadmapId] = { completed: [] };
                
                const idx = progressData[roadmapId].completed.indexOf(stepId);
                if (idx === -1) {
                    progressData[roadmapId].completed.push(stepId);
                    Components.toast('Marked as complete!', 'success');
                } else {
                    progressData[roadmapId].completed.splice(idx, 1);
                    Components.toast('Marked as incomplete', 'info');
                }
                
                Store.set('roadmapProgress', progressData);
                
                // Simple re-render of the page
                this.init(); 
            });
        });
    },
    
    cleanup() {}
};

export default RoadmapsPage;
