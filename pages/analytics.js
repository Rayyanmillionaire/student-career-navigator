import Store from '../js/store.js';

const AnalyticsPage = {
    render() {
        return `
            <div class="page animate-fade-in">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">Analytics & Insights</h1>
                        <p class="page__subtitle">Visualize your career growth and learning progress.</p>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="card chart-card animate-slide-up stagger-1">
                        <div class="chart-card__header">
                            <h3 class="card__title">Skills Breakdown</h3>
                        </div>
                        <div class="chart-card__body">
                            <canvas id="skillsChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="card chart-card animate-slide-up stagger-2">
                        <div class="chart-card__header">
                            <h3 class="card__title">Learning Activity</h3>
                        </div>
                        <div class="chart-card__body">
                            <canvas id="activityChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="card chart-card animate-slide-up stagger-3" style="grid-column: span 2">
                        <div class="chart-card__header">
                            <h3 class="card__title">Internship Applications Pipeline</h3>
                        </div>
                        <div class="chart-card__body">
                            <canvas id="pipelineChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        if (window.lucide) lucide.createIcons();
        
        if (!window.Charts) return;
        
        const colors = window.Charts.getColors();
        const skills = Store.get('skills') || [];
        
        // Skills Radar Chart
        let labels = ['Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills'];
        let data = [0, 0, 0, 0, 0];
        
        if (skills.length > 0) {
             const catAverages = {};
             const catCounts = {};
             skills.forEach(s => {
                 if(!catAverages[s.category]) { catAverages[s.category] = 0; catCounts[s.category] = 0; }
                 catAverages[s.category] += s.level;
                 catCounts[s.category]++;
             });
             
             data = [
                 (catAverages['frontend'] || 0) / (catCounts['frontend'] || 1),
                 (catAverages['backend'] || 0) / (catCounts['backend'] || 1),
                 (catAverages['database'] || 0) / (catCounts['database'] || 1),
                 (catAverages['tools'] || 0) / (catCounts['tools'] || 1),
                 (catAverages['soft'] || 0) / (catCounts['soft'] || 1)
             ];
        } else {
             // Mock data if empty
             data = [80, 60, 40, 70, 90];
        }
        
        window.Charts.create('skillsChart', {
            type: 'radar',
            data: {
                labels,
                datasets: [{
                    label: 'Skill Level',
                    data,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: colors.blue,
                    pointBackgroundColor: colors.blue,
                    borderWidth: 2
                }]
            }
        });
        
        // Activity Line Chart
        window.Charts.create('activityChart', {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Hours Studied',
                    data: [2, 3.5, 1, 4, 2.5, 5, 0],
                    borderColor: colors.purple,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(139, 92, 246, 0.1)'
                }]
            }
        });
        
        // Pipeline Bar Chart
        const apps = Store.get('internships') || [];
        let pData = [0, 0, 0, 0, 0];
        if (apps.length > 0) {
            apps.forEach(a => {
                if(a.status === 'wishlist') pData[0]++;
                else if(a.status === 'applied') pData[1]++;
                else if(a.status === 'interview') pData[2]++;
                else if(a.status === 'offer') pData[3]++;
                else if(a.status === 'rejected') pData[4]++;
            });
        } else {
            pData = [15, 8, 3, 1, 5];
        }
        
        window.Charts.create('pipelineChart', {
            type: 'bar',
            data: {
                labels: ['Wishlist', 'Applied', 'Interviewing', 'Offers', 'Rejected'],
                datasets: [{
                    label: 'Applications',
                    data: pData,
                    backgroundColor: [colors.gray, colors.blue, colors.orange, colors.green, colors.red],
                    borderRadius: 6
                }]
            }
        });
    },
    
    cleanup() {
        if(window.Charts) window.Charts.destroyAll();
    }
};

export default AnalyticsPage;
