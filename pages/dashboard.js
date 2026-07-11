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
        const certifications = Store.get('certifications') || [];
        const studySessions = Store.get('studySessions') || [];
        
        const activeGoals = goals.filter(g => g.status !== 'completed').length;

        // Calculate dynamic streak based on unique days with completed goals or study sessions
        const activeDates = new Set();
        studySessions.forEach(s => {
            if (s.date) activeDates.add(new Date(s.date).toDateString());
        });
        goals.filter(g => g.status === 'completed').forEach(g => {
            if (g.completedAt) activeDates.add(new Date(g.completedAt).toDateString());
            else if (g.dueDate) activeDates.add(new Date(g.dueDate).toDateString());
        });

        let streak = 0;
        const todayStr = new Date().toDateString();
        let checkDate = new Date(todayStr);

        if (activeDates.has(todayStr)) {
            streak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
            while (activeDates.has(checkDate.toDateString())) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        } else {
            // Check if yesterday was active to keep streak alive
            checkDate.setDate(checkDate.getDate() - 1);
            if (activeDates.has(checkDate.toDateString())) {
                streak = 1;
                checkDate.setDate(checkDate.getDate() - 1);
                while (activeDates.has(checkDate.toDateString())) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                }
            }
        }

        // Build dynamic activity feed
        const activities = [];
        
        internships.forEach(i => {
            if (i.appliedDate) {
                activities.push({
                    icon: 'briefcase',
                    color: 'info',
                    title: `Applied to ${i.company}`,
                    subtitle: `Role: ${i.role}`,
                    timestamp: new Date(i.appliedDate)
                });
            }
        });
        
        skills.forEach(s => {
            if (s.createdAt) {
                activities.push({
                    icon: 'zap',
                    color: 'success',
                    title: `Added skill: ${s.name}`,
                    subtitle: `Proficiency: ${s.proficiency}%`,
                    timestamp: new Date(s.createdAt)
                });
            }
        });
        
        certifications.forEach(c => {
            if (c.dateObtained) {
                activities.push({
                    icon: 'award',
                    color: 'warning',
                    title: `Earned Certificate: ${c.name}`,
                    subtitle: `Issued by ${c.issuer}`,
                    timestamp: new Date(c.dateObtained)
                });
            }
        });
        
        goals.forEach(g => {
            if (g.status === 'completed' && g.completedAt) {
                activities.push({
                    icon: 'check-circle',
                    color: 'success',
                    title: `Completed Goal: ${g.title}`,
                    subtitle: g.category || 'General',
                    timestamp: new Date(g.completedAt)
                });
            }
        });
        
        activities.sort((a, b) => b.timestamp - a.timestamp);
        const recentActivities = activities.slice(0, 4);

        const activityFeedHTML = recentActivities.length > 0
            ? recentActivities.map(act => `
                <div class="list__item animate-fade-in">
                    <div class="list__icon bg-${act.color}-bg text-${act.color}"><i data-lucide="${act.icon}"></i></div>
                    <div class="list__content">
                        <div class="list__title">${act.title}</div>
                        <div class="list__subtitle">${act.subtitle}</div>
                    </div>
                    <div class="list__meta">${Utils.timeAgo(act.timestamp)}</div>
                </div>
            `).join('')
            : `
                <div class="p-xl text-center text-secondary">
                    <i data-lucide="activity" style="width: 48px; height: 48px; margin: 0 auto var(--space-md); opacity: 0.3;"></i>
                    <p class="text-sm">No recent activity yet. Add skills, goals, or apply to internships to see updates!</p>
                </div>
            `;

        // Calculate dynamic profile completion %
        let profileScore = 0;
        let totalFields = 8;
        if (user.name) profileScore++;
        if (user.email) profileScore++;
        if (user.college) profileScore++;
        if (user.major) profileScore++;
        if (user.phone) profileScore++;
        if (user.bio) profileScore++;
        if (user.github || user.linkedin || user.website) profileScore++;
        if (user.profilePicture) profileScore++;
        
        const profileCompletion = Math.round((profileScore / totalFields) * 100);

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
                            <p class="welcome-card__subtitle mb-md">
                                ${streak > 0 
                                    ? `You're on a ${streak}-day learning streak. Complete today's goal to keep it going.` 
                                    : 'Start your first study session or complete a goal to begin your learning streak!'}
                            </p>
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
                            value: `${streak} Days`,
                            color: 'danger',
                            trend: streak > 0 ? 'Active streak!' : 'No streak yet',
                            trendDirection: streak > 0 ? 'up' : 'down'
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
                                ${activityFeedHTML}
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
                                <span>${profileCompletion}%</span>
                            </div>
                            <div class="progress progress--sm mb-md bg-glass">
                                <div class="progress__bar bg-white" style="width: ${profileCompletion}%"></div>
                            </div>
                            <p class="text-sm mb-md text-glass">
                                ${profileCompletion < 100 
                                    ? 'Add your education history and bio details to complete your profile score!' 
                                    : 'Your profile is fully complete! Keep it updated to stay current.'}
                            </p>
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
