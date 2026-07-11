const LandingPage = {
    render() {
        return `
            <div class="landing animate-fade-in">
                <!-- Hero Section -->
                <section class="hero">
                    <div class="hero__container">
                        <div class="hero__content">
                            <h1 class="hero__title animate-slide-up stagger-1">
                                Navigate Your Career With Confidence
                            </h1>
                            <p class="hero__subtitle animate-slide-up stagger-2">
                                The all-in-one platform for students to build skills, track goals, and land dream internships. Start your journey today.
                            </p>
                            <div class="hero__cta animate-slide-up stagger-3">
                                <a href="#/signup" class="btn btn--gradient btn--lg">Get Started Free</a>
                                <a href="#/login" class="btn btn--outline btn--lg">Sign In</a>
                            </div>
                        </div>
                        <div class="hero__illustration animate-scale-in stagger-4">
                            <div class="hero__illustration-placeholder animate-float"></div>
                        </div>
                    </div>
                </section>

                <!-- Stats Section -->
                <section class="stats-section">
                    <div class="stat-item">
                        <div class="stat-item__value" data-count-to="50000">0</div>
                        <div class="stat-item__label">Active Students</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item__value" data-count-to="1200">0</div>
                        <div class="stat-item__label">Internships Landed</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item__value" data-count-to="350">0</div>
                        <div class="stat-item__label">Career Roadmaps</div>
                    </div>
                </section>

                <!-- Features Section -->
                <section class="features-section">
                    <h2 class="section-title">Everything you need to succeed</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-card__icon"><i data-lucide="map"></i></div>
                            <h3 class="feature-card__title">Curated Roadmaps</h3>
                            <p class="feature-card__desc">Follow step-by-step guides for any tech career path. Know exactly what to learn next.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-card__icon"><i data-lucide="file-text"></i></div>
                            <h3 class="feature-card__title">Resume Builder</h3>
                            <p class="feature-card__desc">Create ATS-friendly resumes in minutes with our drag-and-drop builder.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-card__icon"><i data-lucide="briefcase"></i></div>
                            <h3 class="feature-card__title">Internship Tracker</h3>
                            <p class="feature-card__desc">Manage applications, interviews, and offers in one organized kanban board.</p>
                        </div>
                    </div>
                </section>

                <!-- Footer -->
                <footer class="landing-footer">
                    <div class="flex flex-col items-center gap-md">
                        <div class="sidebar__logo justify-center">
                            <i data-lucide="compass" style="width: 24px; height: 24px;"></i>
                            <span class="sidebar__logo-text">CareerNav</span>
                        </div>
                        <p>&copy; ${new Date().getFullYear()} CareerNav. All rights reserved.</p>
                        <div class="flex gap-md">
                            <a href="#" class="text-secondary hover:text-primary">Privacy</a>
                            <a href="#" class="text-secondary hover:text-primary">Terms</a>
                            <a href="#" class="text-secondary hover:text-primary">Contact</a>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    },
    
    init() {
        if (window.lucide) lucide.createIcons();
        
        // Use imported Utils here if available globally, but we can't easily due to simple script tags in this setup, 
        // assuming Utils is attached to window in app.js or we can just implement a simple counter here.
        // For simplicity, wait a moment then animate
        setTimeout(() => {
            if (window.Utils) {
                window.Utils.animateCounters();
            } else {
                // Fallback basic counter
                document.querySelectorAll('[data-count-to]').forEach(el => {
                    let target = parseInt(el.getAttribute('data-count-to'));
                    el.innerText = target + '+'; // simplified for this component if Utils missing
                });
            }
        }, 500);
    },
    
    cleanup() {
        // Remove event listeners if any
    }
};

export default LandingPage;
