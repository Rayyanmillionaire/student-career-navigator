const STORE_KEY = 'scn_data_';
const SUBSCRIBERS = {};

const DEFAULTS = {
    skills: [],
    goals: [],
    internships: [],
    certifications: [],
    todos: [],
    notifications: [],
    resumeData: { template: 'modern', personal: {}, education: [], experience: [], projects: [], skills: [], certifications: [], internships: [], languages: [], achievements: [], references: [] },
    roadmapProgress: {},
    habits: [],
    studySessions: [],
    assignments: [],
    exams: [],
    settings: { theme: 'light', language: 'en', notifications: true, emailNotifications: true, privacy: 'public' },
    announcements: []
};

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : 'https://student-career-navigator-api.onrender.com'; // Replace with production URL

const Store = {
    init() {
        // Initialize defaults if they don't exist
        for (const key in DEFAULTS) {
            if (this.get(key) === null) {
                this.set(key, DEFAULTS[key], false); // set locally without triggering remote sync during init
            }
        }
        
        // If authenticated, sync from backend in background
        if (this.getToken()) {
            this.syncFromBackend().catch(err => console.error("Initial backend sync failed", err));
        }
    },
    
    getToken() {
        const sessionDataStr = localStorage.getItem('scn_session') || sessionStorage.getItem('scn_session');
        if (!sessionDataStr) return null;
        try {
            return JSON.parse(sessionDataStr).token;
        } catch(e) {
            return null;
        }
    },
    
    get(key) {
        const data = localStorage.getItem(STORE_KEY + key);
        try {
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },
    
    set(key, value, sync = true) {
        const oldVal = this.get(key);
        localStorage.setItem(STORE_KEY + key, JSON.stringify(value));
        this.notify(key);
        
        if (sync && this.getToken()) {
            this.syncToBackend(key, oldVal, value).catch(err => console.error("Sync to backend failed", err));
        }
    },
    
    getAll() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k.startsWith(STORE_KEY)) {
                data[k.replace(STORE_KEY, '')] = this.get(k.replace(STORE_KEY, ''));
            }
        }
        return data;
    },
    
    remove(key) {
        localStorage.removeItem(STORE_KEY + key);
        this.notify(key);
    },
    
    clear() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith(STORE_KEY)) {
                keysToRemove.push(localStorage.key(i));
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    },
    
    getUser() {
        return this.get('user');
    },
    
    setUser(user) {
        this.set('user', user, false); // No need to sync user profile via Store.set (Auth module handles profile update API)
    },
    
    subscribe(key, callback) {
        if (!SUBSCRIBERS[key]) {
            SUBSCRIBERS[key] = [];
        }
        SUBSCRIBERS[key].push(callback);
        
        return () => {
            SUBSCRIBERS[key] = SUBSCRIBERS[key].filter(cb => cb !== callback);
        };
    },
    
    notify(key) {
        if (SUBSCRIBERS[key]) {
            const value = this.get(key);
            SUBSCRIBERS[key].forEach(cb => cb(value));
        }
    },

    // ============================================================
    // BACKEND SYNC OPERATIONS (OPTIMISTIC / CACHED-WRITE)
    // ============================================================
    
    async syncFromBackend() {
        const token = this.getToken();
        if (!token) return;

        const headers = { 'Authorization': `Bearer ${token}` };
        
        try {
            // Helper to fetch list and update local cache
            const syncList = async (apiPath, storeKey) => {
                const res = await fetch(`${API_URL}/api/${apiPath}`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    this.set(storeKey, data, false);
                }
            };

            await Promise.all([
                syncList('skills', 'skills'),
                syncList('goals', 'goals'),
                syncList('internships', 'internships'),
                syncList('certifications', 'certifications'),
                syncList('notifications', 'notifications')
            ]);
            
            // Sync Resume
            const resumeRes = await fetch(`${API_URL}/api/resume`, { headers });
            if (resumeRes.ok) {
                const resumeObj = await resumeRes.json();
                if (resumeObj.data && resumeObj.data !== "{}") {
                    this.set('resumeData', JSON.parse(resumeObj.data), false);
                }
            }
            
            // Sync Roadmap Progress
            // We fetch the progress for the active roadmaps.
            const progressRes = await fetch(`${API_URL}/api/roadmaps/full-stack/progress`, { headers }); // base check
            if (progressRes.ok) {
                const progressData = await progressRes.json();
                const currentRoadmapProgress = this.get('roadmapProgress') || {};
                currentRoadmapProgress[progressData.roadmapId] = { completed: progressData.completed };
                this.set('roadmapProgress', currentRoadmapProgress, false);
            }

        } catch (e) {
            console.error("Backend fetch error: offline mode or server down", e);
        }
    },

    async syncToBackend(key, oldVal, newVal) {
        const token = this.getToken();
        if (!token) return;

        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        };

        const syncItemCrud = async (apiPath, item, method) => {
            const url = method === 'POST' ? `${API_URL}/api/${apiPath}` : `${API_URL}/api/${apiPath}/${item.id}`;
            const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(item)
            });
            if (res.ok && method === 'POST') {
                const savedItem = await res.json();
                // Replace temp frontend ID with database numerical ID
                const currentList = this.get(key) || [];
                const idx = currentList.findIndex(i => i.id === item.id);
                if (idx !== -1) {
                    currentList[idx].id = savedItem.id;
                    this.set(key, currentList, false);
                }
            }
        };

        if (['skills', 'goals', 'internships', 'certifications'].includes(key)) {
            const oldList = oldVal || [];
            const newList = newVal || [];
            
            const apiPaths = {
                skills: 'skills',
                goals: 'goals',
                internships: 'internships',
                certifications: 'certifications'
            };
            const apiPath = apiPaths[key];

            // 1. Delete removed items
            const deleted = oldList.filter(o => !newList.some(n => n.id === o.id));
            for (const item of deleted) {
                // If it's a number (meaning it was synced with db), delete it. If it's a temp string id, no db delete needed.
                if (typeof item.id === 'number') {
                    await syncItemCrud(apiPath, item, 'DELETE');
                }
            }

            // 2. Add or Update items
            for (const item of newList) {
                const oldItem = oldList.find(o => o.id === item.id);
                if (!oldItem) {
                    // Item added
                    await syncItemCrud(apiPath, item, 'POST');
                } else if (JSON.stringify(oldItem) !== JSON.stringify(item)) {
                    // Item updated
                    // If it was already saved in db (it has a number ID)
                    if (typeof item.id === 'number') {
                        await syncItemCrud(apiPath, item, 'PUT');
                    } else {
                        // Re-try post if database ID wasn't set
                        await syncItemCrud(apiPath, item, 'POST');
                    }
                }
            }
        } else if (key === 'resumeData') {
            await fetch(`${API_URL}/api/resume`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: JSON.stringify(newVal) })
            });
        } else if (key === 'roadmapProgress') {
            // Compare completed steps to sync roadmap updates
            const oldProg = oldVal || {};
            const newProg = newVal || {};
            
            for (const rmId in newProg) {
                const oldCompleted = (oldProg[rmId] && oldProg[rmId].completed) || [];
                const newCompleted = newProg[rmId].completed || [];
                
                // Find toggled steps
                const added = newCompleted.filter(s => !oldCompleted.includes(s));
                const removed = oldCompleted.filter(s => !newCompleted.includes(s));
                
                for (const stepId of [...added, ...removed]) {
                    await fetch(`${API_URL}/api/roadmaps/${rmId}/progress`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ stepId })
                    });
                }
            }
        }
    }
};

export default Store;
