import Auth from '../js/auth.js';
import Router from '../js/router.js';

const AuthPage = {
    render() {
        const path = Router.getCurrentRoute();
        const isLogin = path === '/login';
        const isSignup = path === '/signup';
        
        // This handles login, signup, forgot password, verify logic visually
        return `
            <div class="auth-page animate-fade-in">
                <div class="auth-container">
                    <div class="auth-card">
                        <div class="auth-header">
                            <i data-lucide="compass"></i>
                            <h2 class="auth-title">${isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                            <p class="auth-subtitle">${isLogin ? 'Enter your details to access your account' : 'Join thousands of students building their careers'}</p>
                        </div>
                        
                        <div class="tabs mb-xl justify-center border-none">
                            <button class="tab ${isLogin ? 'tab--active' : ''}" onclick="window.location.hash='#/login'">Sign In</button>
                            <button class="tab ${isSignup ? 'tab--active' : ''}" onclick="window.location.hash='#/signup'">Sign Up</button>
                        </div>
                        
                        <form id="authForm" class="animate-slide-up">
                            ${isSignup ? `
                                <div class="form-group">
                                    <label class="form-label">Full Name</label>
                                    <div class="input-group">
                                        <i data-lucide="user" class="input-group__icon"></i>
                                        <input type="text" id="name" class="form-input" placeholder="John Doe" required>
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div class="form-group">
                                <label class="form-label">Email Address</label>
                                <div class="input-group">
                                    <i data-lucide="mail" class="input-group__icon"></i>
                                    <input type="email" id="email" class="form-input" placeholder="student@example.com" required value="${isLogin ? 'student@scn.com' : ''}">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <div class="input-group">
                                    <i data-lucide="lock" class="input-group__icon"></i>
                                    <input type="password" id="password" class="form-input" placeholder="••••••••" required value="${isLogin ? 'student123' : ''}">
                                    <button type="button" class="password-toggle" id="togglePassword">
                                        <i data-lucide="eye"></i>
                                    </button>
                                </div>
                                ${isSignup ? `
                                    <div class="password-strength">
                                        <div class="password-strength__bar bg-danger" style="width: 30%"></div>
                                    </div>
                                    <div class="password-strength__text">Weak</div>
                                ` : ''}
                            </div>
                            
                            ${isLogin ? `
                                <div class="flex justify-between items-center mb-lg">
                                    <label class="form-checkbox">
                                        <input type="checkbox" id="remember">
                                        <span class="text-sm">Remember me</span>
                                    </label>
                                    <a href="#/forgot-password" class="text-sm font-medium text-accent">Forgot Password?</a>
                                </div>
                            ` : ''}
                            
                            <div id="authError" class="form-error hidden mb-md text-center"></div>
                            
                            <button type="submit" class="btn btn--gradient btn--block btn--lg">
                                ${isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        if (window.lucide) lucide.createIcons();
        
        const path = Router.getCurrentRoute();
        const isLogin = path === '/login';
        const form = document.getElementById('authForm');
        const errorEl = document.getElementById('authError');
        
        // Password toggle
        const toggleBtn = document.getElementById('togglePassword');
        const passInput = document.getElementById('password');
        if (toggleBtn && passInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passInput.setAttribute('type', type);
                toggleBtn.innerHTML = `<i data-lucide="${type === 'password' ? 'eye' : 'eye-off'}"></i>`;
                if (window.lucide) lucide.createIcons({ root: toggleBtn });
            });
        }
        
        // Form submit
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                errorEl.classList.add('hidden');
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (isLogin) {
                    const remember = document.getElementById('remember')?.checked || false;
                    const res = await Auth.login(email, password, remember);
                    if (res.success) {
                        Router.navigate('/dashboard');
                    } else {
                        errorEl.textContent = res.error;
                        errorEl.classList.remove('hidden');
                        // Shake animation on card
                        document.querySelector('.auth-card').classList.add('animate-shake');
                        setTimeout(() => document.querySelector('.auth-card').classList.remove('animate-shake'), 800);
                    }
                } else {
                    const name = document.getElementById('name').value;
                    const res = await Auth.signup({ name, email, password });
                    if (res.success) {
                        // Auto login after signup
                        await Auth.login(email, password);
                        Router.navigate('/dashboard');
                    } else {
                        errorEl.textContent = res.error;
                        errorEl.classList.remove('hidden');
                    }
                }
            });
        }
    },
    
    cleanup() {}
};

export default AuthPage;
