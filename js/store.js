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

const Store = {
    init() {
        // Initialize defaults if they don't exist
        for (const key in DEFAULTS) {
            if (this.get(key) === null) {
                this.set(key, DEFAULTS[key]);
            }
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
    
    set(key, value) {
        localStorage.setItem(STORE_KEY + key, JSON.stringify(value));
        this.notify(key);
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
        this.set('user', user);
    },
    
    subscribe(key, callback) {
        if (!SUBSCRIBERS[key]) {
            SUBSCRIBERS[key] = [];
        }
        SUBSCRIBERS[key].push(callback);
        
        // Return unsubscribe function
        return () => {
            SUBSCRIBERS[key] = SUBSCRIBERS[key].filter(cb => cb !== callback);
        };
    },
    
    notify(key) {
        if (SUBSCRIBERS[key]) {
            const value = this.get(key);
            SUBSCRIBERS[key].forEach(cb => cb(value));
        }
    }
};

export default Store;
