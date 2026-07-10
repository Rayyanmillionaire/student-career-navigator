import Router from '../js/router.js';

const SearchPage = {
    render() {
        return `
            <div class="page animate-fade-in max-w-3xl mx-auto pt-xl">
                <div class="card p-xl border-accent shadow-lg mb-xl animate-slide-down relative">
                    <i data-lucide="search" class="absolute left-8 top-1/2 transform -translate-y-1/2 text-accent" style="width: 24px; height: 24px;"></i>
                    <input type="text" id="globalSearchInput" class="w-full bg-transparent border-none text-2xl font-bold text-primary focus:outline-none pl-xl" placeholder="Search anything..." autocomplete="off">
                </div>
                
                <div id="searchResults" class="animate-slide-up stagger-1 hidden">
                    <h3 class="font-bold text-secondary text-sm uppercase mb-md">Quick Links</h3>
                    <div class="list card p-0" id="resultsList">
                        <!-- Injected -->
                    </div>
                </div>
                
                <div id="searchSuggestions" class="animate-slide-up stagger-1">
                    <h3 class="font-bold text-secondary text-sm uppercase mb-md">Suggested</h3>
                    <div class="flex flex-wrap gap-sm">
                        <a href="#/roadmaps" class="tag"><i data-lucide="map"></i> Explore Roadmaps</a>
                        <a href="#/resume" class="tag"><i data-lucide="file-text"></i> Build Resume</a>
                        <a href="#/internships" class="tag"><i data-lucide="briefcase"></i> Track Applications</a>
                        <a href="#/skills" class="tag"><i data-lucide="zap"></i> Add a Skill</a>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        if (window.lucide) lucide.createIcons();
        
        const input = document.getElementById('globalSearchInput');
        const results = document.getElementById('searchResults');
        const suggestions = document.getElementById('searchSuggestions');
        const list = document.getElementById('resultsList');
        
        if (input) {
            input.focus();
            
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                if (query.length > 1) {
                    suggestions.classList.add('hidden');
                    results.classList.remove('hidden');
                    this.performSearch(query, list);
                } else {
                    suggestions.classList.remove('hidden');
                    results.classList.add('hidden');
                }
            });
        }
    },
    
    performSearch(query, listEl) {
        // Simulated global search across different entities
        const searchableItems = [
            { title: 'Full Stack Roadmap', desc: 'Career path for full stack developers', icon: 'map', route: '/roadmaps/full-stack' },
            { title: 'Frontend Developer', desc: 'Career roadmap', icon: 'map', route: '/roadmaps/frontend' },
            { title: 'Resume Builder', desc: 'Create your CV', icon: 'file-text', route: '/resume' },
            { title: 'React.js', desc: 'Skill tracking', icon: 'zap', route: '/skills' },
            { title: 'Google Internship', desc: 'Application tracker', icon: 'briefcase', route: '/internships' },
            { title: 'Goal: Learn Python', desc: 'Goal planner', icon: 'target', route: '/goals' },
            { title: 'AWS Cloud Practitioner', desc: 'Certification', icon: 'award', route: '/certifications' },
            { title: 'Profile Settings', desc: 'Manage your account', icon: 'user', route: '/profile' }
        ];
        
        const filtered = searchableItems.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.desc.toLowerCase().includes(query)
        );
        
        if (filtered.length === 0) {
            listEl.innerHTML = `<div class="p-md text-center text-secondary">No results found for "${query}"</div>`;
            return;
        }
        
        listEl.innerHTML = filtered.map(item => `
            <a href="#${item.route}" class="list__item list__item--clickable hover:bg-bg-tertiary no-underline">
                <div class="list__icon bg-bg-tertiary"><i data-lucide="${item.icon}"></i></div>
                <div class="list__content">
                    <div class="list__title text-primary">${item.title}</div>
                    <div class="list__subtitle">${item.desc}</div>
                </div>
                <div class="list__action">
                    <i data-lucide="chevron-right" class="text-tertiary"></i>
                </div>
            </a>
        `).join('');
        
        if (window.lucide) lucide.createIcons({ root: listEl });
    },
    
    cleanup() {}
};

export default SearchPage;
