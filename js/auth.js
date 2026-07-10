import Store from './store.js';
import Utils from './utils.js';

const USERS_KEY = 'scn_users';
const SESSION_KEY = 'scn_session';

const Auth = {
    init() {
        // Seed demo accounts if no users exist
        let users = this._getUsers();
        if (users.length === 0) {
            users.push({
                id: 'admin_1',
                name: 'Admin User',
                email: 'admin@scn.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            users.push({
                id: 'student_1',
                name: 'Student Demo',
                email: 'student@scn.com',
                password: 'student123',
                role: 'student',
                college: 'Demo University',
                semester: '4',
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    },

    _getUsers() {
        const data = localStorage.getItem(USERS_KEY);
        try {
            return data ? JSON.parse(data) : [];
        } catch(e) { return []; }
    },
    
    _setUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    login(email, password, remember = false) {
        const users = this._getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const sessionData = { userId: user.id, token: Utils.generateId() };
            if (remember) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            }
            Store.setUser(user);
            return { success: true, user };
        }
        return { success: false, error: 'Invalid email or password' };
    },
    
    signup(data) {
        const users = this._getUsers();
        if (users.find(u => u.email === data.email)) {
            return { success: false, error: 'Email already exists' };
        }
        
        const newUser = {
            id: Utils.generateId(),
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role || 'student',
            createdAt: new Date().toISOString(),
            ...data
        };
        
        users.push(newUser);
        this._setUsers(users);
        return { success: true, user: newUser };
    },
    
    logout() {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        Store.remove('user');
        window.location.hash = '#/';
    },
    
    isAuthenticated() {
        return !!(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY));
    },
    
    getUser() {
        if (!this.isAuthenticated()) return null;
        // Attempt to return latest from users list
        const sessionDataStr = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        if(!sessionDataStr) return null;
        
        try {
            const sessionData = JSON.parse(sessionDataStr);
            const users = this._getUsers();
            const user = users.find(u => u.id === sessionData.userId);
            if(user) {
                // Ensure Store has latest
                Store.setUser(user);
                return user;
            }
        } catch(e) {}
        
        return Store.getUser();
    },
    
    getRole() {
        const user = this.getUser();
        return user ? user.role : null;
    },
    
    updateProfile(data) {
        const user = this.getUser();
        if (!user) return false;
        
        const updatedUser = { ...user, ...data };
        
        // Update in users list
        const users = this._getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = updatedUser;
            this._setUsers(users);
        }
        
        // Update in store
        Store.setUser(updatedUser);
        return true;
    },
    
    changePassword(oldPass, newPass) {
        const user = this.getUser();
        if (!user) return { success: false, error: 'Not logged in' };
        
        if (user.password !== oldPass) {
            return { success: false, error: 'Incorrect old password' };
        }
        
        this.updateProfile({ password: newPass });
        return { success: true };
    }
};

Auth.init();
export default Auth;
