import Auth from '../js/auth.js';
import Store from '../js/store.js';
import Utils from '../js/utils.js';
import Components from '../js/components.js';

const DashboardPage = {
    render() {
        const user = Auth.getUser();
        const greeting = Utils.getGreeting();
        
        // Stats
        const internships = Store.get('internships') || [];
        const skills = Store.get('skills') || [];
        const goals = Store.get('goals') || [];
        
        const activeGoals = goals.filter(g => g.status !== 'completed').length;
        
        return `
            <div class="page animate-fade-in">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">${greeting}, ${user.name.split(' ')[0]}! 👋</h1>
                        <p class="page__subtitle">Here's what's happening with your career journey today.</p>
                    </div>
                    <div class="page__actions">
                        <button class="btn btn--primary" onclick="window.location.hash='#/roadmaps'"><i data-lucide="map"></i> Explore Roadmaps</button>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <!-- Welcome / Hero Card -->
                    <div class="welcome-card stagger-1">
                        <div class="welcome-card__content">
                            <h2 class="welcome-card__title">Keep up the momentum!</h2>
                            <p class="welcome-card__subtitle mb-md">You're on a 3-day learning streak. Complete today's goal to keep it going.</p>
                            <button class="btn btn--secondary" onclick="window.location.hash='#/goals'">View Goals</button>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="stagger-2 col-span-4" style="grid-column: span 3">
                        ${Components.statCard({
                            icon: 'briefcase',
                            label: 'Active Applications',
                            value: internships.filter(i => i.status !== 'Rejected' && i.status !== 'Accepted').length.toString(),
                            color: 'purple'
                        })}
                    </div>
                    <div class="stagger-3 col-span-4" style="grid-column: span 3">
                        ${Components.statCard({
                            icon: 'zap',
                            label: 'Skills Mastered',
                            value: skills.filter(s => s.level >= 80).length.toString(),
                            color: 'success'
                        })}
                    </div>
                    <div class="stagger-4 col-span-4" style="grid-column: span 3">
                        ${Components.statCard({
                            icon: 'target',
                            label: 'Goals in Progress',
                            value: activeGoals.toString(),
                            color: 'warning'
                        })}
                    </div>
                    <div class="stagger-5 col-span-4" style="grid-column: span 3">
                        ${Components.statCard({
                            icon: 'flame',
                            label: 'Current Streak',
                            value: '3 Days',
                            color: 'danger',
                            trend: 'Personal best!',
                            trendDirection: 'up'
                        })}
                    </div>

                    <!-- Main Columns -->
                    <div class="col-span-8 stagger-5">
                        <div class="card h-full">
                            <div class="card__header">
                                <h3 class="card__title">Recent Activity</h3>
                                <button class="btn btn--ghost btn--sm"><i data-lucide="filter"></i> Filter</button>
                            </div>
                            <div class="activity-feed list">
                                <div class="list__item">
                                    <div class="list__icon bg-success-bg text-success"><i data-lucide="check-circle"></i></div>
                                    <div class="list__content">
                                        <div class="list__title">Completed React Basics</div>
                                        <div class="list__subtitle">Full Stack Roadmap</div>
                                    </div>
                                    <div class="list__meta">2h ago</div>
                                </div>
                                <div class="list__item">
                                    <div class="list__icon bg-info-bg text-info"><i data-lucide="briefcase"></i></div>
                                    <div class="list__content">
                                        <div class="list__title">Applied to Google SWE Intern</div>
                                        <div class="list__subtitle">Status: Applied</div>
                                    </div>
                                    <div class="list__meta">Yesterday</div>
                                </div>
                                <div class="list__item">
                                    <div class="list__icon bg-warning-bg text-warning"><i data-lucide="award"></i></div>
                                    <div class="list__content">
                                        <div class="list__title">Added AWS Practitioner</div>
                                        <div class="list__subtitle">Certifications</div>
                                    </div>
                                    <div class="list__meta">3 days ago</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Side Column -->
                    <div class="col-span-4 stagger-6">
                        <div class="card mb-lg">
                            <div class="card__header">
                                <h3 class="card__title">Upcoming Deadlines</h3>
                            </div>
                            <div class="list">
                                ${internships.filter(i => i.deadline).slice(0, 3).map(i => `
                                    <div class="list__item px-0 py-sm">
                                        <div class="list__content">
                                            <div class="list__title font-sm">${i.company} - ${i.role}</div>
                                            <div class="list__subtitle text-danger"><i data-lucide="clock" class="inline-block w-3 h-3"></i> Due: ${Utils.formatDateShort(i.deadline)}</div>
                                        </div>
                                    </div>
                                `).join('') || '<div class="text-sm text-secondary py-sm">No upcoming deadlines.</div>'}
                            </div>
                        </div>
                        
                        <div class="card card--gradient">
                            <div class="card__header">
                                <h3 class="card__title">Complete Profile</h3>
                                <span>75%</span>
                            </div>
                            <div class="progress progress--sm mb-md bg-glass">
                                <div class="progress__bar bg-white" style="width: 75%"></div>
                            </div>
                            <p class="text-sm mb-md text-glass">Add your education history to unlock personalized roadmap recommendations.</p>
                            <button class="btn btn--secondary btn--sm w-full" onclick="window.location.hash='#/profile'">Update Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        if (window.lucide) lucide.createIcons();
        if (window.Utils) window.Utils.animateCounters();
    },
    
    cleanup() {}
};

export default DashboardPage;
