import Store from './store.js';

const SESSION_KEY = 'scn_session';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : 'https://student-career-navigator-api.onrender.com'; // Replace with production URL

const Auth = {
    init() {
        // No local seeding needed since database handles user records
    },

    async login(email, password, remember = false) {
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                const sessionData = { userId: data.user.id, token: data.token };
                if (remember) {
                    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                }
                Store.setUser(data.user);
                
                // Fetch all user data from backend to sync local cache
                await Store.syncFromBackend();
                
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error || 'Invalid credentials' };
            }
        } catch (e) {
            console.error(e);
            return { success: false, error: 'Connection to server failed' };
        }
    },
    
    async signup(data) {
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: data.name, email: data.email, password: data.password })
            });
            const resData = await res.json();
            if (res.ok && resData.token) {
                return { success: true, user: resData.user };
            } else {
                return { success: false, error: resData.error || 'Signup failed' };
            }
        } catch (e) {
            return { success: false, error: 'Connection to server failed' };
        }
    },
    
    logout() {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        Store.clear();
        window.location.hash = '#/';
    },
    
    isAuthenticated() {
        return !!(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY));
    },
    
    getToken() {
        const sessionDataStr = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        if (!sessionDataStr) return null;
        try {
            return JSON.parse(sessionDataStr).token;
        } catch(e) {
            return null;
        }
    },
    
    async getUser() {
        if (!this.isAuthenticated()) return null;
        const user = Store.getUser();
        if (user) return user;
        
        // If user object not cached, fetch it
        try {
            const token = this.getToken();
            const res = await fetch(`${API_URL}/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const userData = await res.json();
                Store.setUser(userData);
                return userData;
            }
        } catch(e) {
            console.error("Failed to fetch user profile", e);
        }
        return null;
    },
    
    async updateProfile(profileData) {
        try {
            const token = this.getToken();
            const res = await fetch(`${API_URL}/api/user/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            if (res.ok) {
                const data = await res.json();
                Store.setUser(data.user);
                return true;
            }
        } catch (e) {
            console.error(e);
        }
        return false;
    },
    
    async changePassword(oldPassword, newPassword) {
        try {
            const token = this.getToken();
            const res = await fetch(`${API_URL}/api/user/change-password`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Password update failed' };
            }
        } catch (e) {
            return { success: false, error: 'Connection to server failed' };
        }
    }
};

export default Auth;
