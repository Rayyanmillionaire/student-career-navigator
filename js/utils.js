const Utils = {
    formatDate(dateStr, format = 'medium') {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if(isNaN(d.getTime())) return dateStr;

        if (format === 'short') {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        if (format === 'long') {
            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        if (format === 'time') {
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    
    formatDateShort(dateStr) {
        return this.formatDate(dateStr, 'short');
    },
    
    timeAgo(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if(isNaN(date.getTime())) return dateStr;

        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) {
            if(Math.floor(interval) === 1) return "yesterday";
            return Math.floor(interval) + " days ago";
        }
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    },
    
    animateCounter(element, target, duration = 1500) {
        let start = null;
        const initialValue = parseInt(element.innerText.replace(/[^0-9.-]+/g,"")) || 0;
        const isPercentage = element.innerText.includes('%');
        const hasPlus = element.innerText.includes('+');
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            
            let current = Math.floor(easeProgress * (target - initialValue) + initialValue);
            
            let display = current;
            if(isPercentage) display = current + '%';
            if(hasPlus) display = current + '+';
            
            element.innerText = display;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                let finalDisplay = target;
                if(isPercentage) finalDisplay = target + '%';
                if(hasPlus) finalDisplay = target + '+';
                element.innerText = finalDisplay;
            }
        };
        
        window.requestAnimationFrame(step);
    },
    
    animateCounters() {
        const counters = document.querySelectorAll('[data-count-to]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count-to'));
            if (!isNaN(target)) {
                this.animateCounter(counter, target);
                counter.removeAttribute('data-count-to'); // run once
            }
        });
    },
    
    debounce(fn, delay = 300) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    },
    
    throttle(fn, limit = 100) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },
    
    validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phone));
    },
    
    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    },
    
    capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    },
    
    truncate(text, len = 100) {
        if (!text) return '';
        if (text.length > len) {
            return text.substring(0, len) + '...';
        }
        return text;
    },
    
    formatNumber(n) {
        return Number(n).toLocaleString();
    },
    
    getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    },
    
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    },
    
    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    },
    
    copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return Promise.resolve();
            } catch (err) {
                document.body.removeChild(textArea);
                return Promise.reject(err);
            }
        }
    },
    
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

export default Utils;
