import Theme from './theme.js';

const instances = {};

const Charts = {
    getColors() {
        return {
            blue: '#3B82F6',
            purple: '#8B5CF6',
            green: '#10B981',
            orange: '#F59E0B',
            red: '#EF4444',
            cyan: '#06B6D4',
            pink: '#EC4899',
            gray: '#64748B'
        };
    },

    getThemeDefaults() {
        const isDark = Theme.get() === 'dark';
        return {
            textColor: isDark ? '#94A3B8' : '#64748B',
            gridColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            fontFamily: "'Inter', sans-serif"
        };
    },

    create(canvasId, config) {
        if (!window.Chart) {
            console.error('Chart.js not loaded');
            return null;
        }

        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        // Destroy existing instance if it exists
        this.destroy(canvasId);

        const defaults = this.getThemeDefaults();

        // Deep merge theme defaults into options
        const options = config.options || {};
        
        // Common defaults
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: defaults.textColor,
                        font: { family: defaults.fontFamily }
                    }
                },
                tooltip: {
                    backgroundColor: Theme.get() === 'dark' ? '#1E293B' : '#FFFFFF',
                    titleColor: Theme.get() === 'dark' ? '#F1F5F9' : '#1E293B',
                    bodyColor: Theme.get() === 'dark' ? '#94A3B8' : '#64748B',
                    borderColor: Theme.get() === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    boxPadding: 4
                }
            }
        };

        // Add scales config if it's a type that uses axes
        if (['line', 'bar', 'scatter', 'bubble'].includes(config.type)) {
            baseOptions.scales = {
                x: {
                    grid: { color: defaults.gridColor, drawBorder: false },
                    ticks: { color: defaults.textColor, font: { family: defaults.fontFamily } }
                },
                y: {
                    grid: { color: defaults.gridColor, drawBorder: false },
                    ticks: { color: defaults.textColor, font: { family: defaults.fontFamily } }
                }
            };
        } else if (config.type === 'radar' || config.type === 'polarArea') {
            baseOptions.scales = {
                r: {
                    grid: { color: defaults.gridColor },
                    angleLines: { color: defaults.gridColor },
                    pointLabels: { color: defaults.textColor, font: { family: defaults.fontFamily } },
                    ticks: { backdropColor: 'transparent', color: defaults.textColor }
                }
            };
        }

        // Merge options (rudimentary deep merge for this specific use case)
        const finalOptions = { ...baseOptions, ...options };
        if(options.plugins) {
            finalOptions.plugins = { ...baseOptions.plugins, ...options.plugins };
        }
        if(options.scales) {
             finalOptions.scales = { ...baseOptions.scales, ...options.scales };
        }

        const chartInstance = new window.Chart(canvas, {
            type: config.type,
            data: config.data || { labels: config.labels, datasets: config.datasets },
            options: finalOptions
        });

        instances[canvasId] = {
            chart: chartInstance,
            config: config
        };

        return chartInstance;
    },

    destroy(canvasId) {
        if (instances[canvasId]) {
            instances[canvasId].chart.destroy();
            delete instances[canvasId];
        }
    },

    destroyAll() {
        Object.keys(instances).forEach(id => this.destroy(id));
    },

    updateTheme() {
        // Re-create all charts with new theme colors
        const defaults = this.getThemeDefaults();
        
        Object.keys(instances).forEach(id => {
            const { chart, config } = instances[id];
            
            // Update simple options
            if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = defaults.textColor;
            }
            if (chart.options.plugins && chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.backgroundColor = Theme.get() === 'dark' ? '#1E293B' : '#FFFFFF';
                chart.options.plugins.tooltip.titleColor = Theme.get() === 'dark' ? '#F1F5F9' : '#1E293B';
                chart.options.plugins.tooltip.bodyColor = Theme.get() === 'dark' ? '#94A3B8' : '#64748B';
                chart.options.plugins.tooltip.borderColor = Theme.get() === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            }
            
            // Update scales
            if (chart.options.scales) {
                if (chart.options.scales.x) {
                    if (chart.options.scales.x.grid) chart.options.scales.x.grid.color = defaults.gridColor;
                    if (chart.options.scales.x.ticks) chart.options.scales.x.ticks.color = defaults.textColor;
                }
                if (chart.options.scales.y) {
                    if (chart.options.scales.y.grid) chart.options.scales.y.grid.color = defaults.gridColor;
                    if (chart.options.scales.y.ticks) chart.options.scales.y.ticks.color = defaults.textColor;
                }
                if (chart.options.scales.r) {
                    if (chart.options.scales.r.grid) chart.options.scales.r.grid.color = defaults.gridColor;
                    if (chart.options.scales.r.angleLines) chart.options.scales.r.angleLines.color = defaults.gridColor;
                    if (chart.options.scales.r.pointLabels) chart.options.scales.r.pointLabels.color = defaults.textColor;
                    if (chart.options.scales.r.ticks) chart.options.scales.r.ticks.color = defaults.textColor;
                }
            }
            
            chart.update();
        });
    }
};

window.addEventListener('themechange', () => {
    Charts.updateTheme();
});

export default Charts;
