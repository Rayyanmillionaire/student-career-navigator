import Store from '../js/store.js';

const ProductivityPage = {
    timerInterval: null,
    timeLeft: 25 * 60,
    isRunning: false,
    mode: 'pomodoro', // pomodoro, short, long
    
    render() {
        return `
            <div class="page animate-fade-in">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">Productivity Suite</h1>
                        <p class="page__subtitle">Stay focused and build habits.</p>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="card flex-col items-center justify-center animate-slide-up stagger-1">
                        <div class="tabs mb-lg border-none justify-center">
                            <button class="tab tab--active" id="modePomodoro">Pomodoro (25m)</button>
                            <button class="tab" id="modeShort">Short Break (5m)</button>
                            <button class="tab" id="modeLong">Long Break (15m)</button>
                        </div>
                        
                        <div class="pomodoro">
                            <div class="pomodoro__timer">
                                <div class="pomodoro__time" id="timerDisplay">25:00</div>
                            </div>
                            <div class="pomodoro__controls">
                                <button class="btn btn--primary btn--lg" id="timerToggle"><i data-lucide="play"></i> Start</button>
                                <button class="btn btn--secondary btn--lg" id="timerReset"><i data-lucide="rotate-ccw"></i> Reset</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-lg animate-slide-up stagger-2">
                        <div class="card">
                            <div class="card__header">
                                <h3 class="card__title">Habit Tracker</h3>
                                <button class="btn btn--ghost btn--sm"><i data-lucide="plus"></i> Add</button>
                            </div>
                            
                            <div class="habit-grid mb-md">
                                <div class="habit-cell habit-cell--header">Habit</div>
                                <div class="habit-cell habit-cell--header">M</div>
                                <div class="habit-cell habit-cell--header">T</div>
                                <div class="habit-cell habit-cell--header">W</div>
                                <div class="habit-cell habit-cell--header">T</div>
                                <div class="habit-cell habit-cell--header">F</div>
                                <div class="habit-cell habit-cell--header">S</div>
                                <div class="habit-cell habit-cell--header">S</div>
                                
                                <div class="habit-cell font-sm font-medium border-t border-color" style="justify-content: flex-start">Read 30 mins</div>
                                <div class="habit-cell habit-cell--checkbox habit-cell--checked border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox habit-cell--checked border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                
                                <div class="habit-cell font-sm font-medium border-t border-color" style="justify-content: flex-start">LeetCode</div>
                                <div class="habit-cell habit-cell--checkbox habit-cell--checked border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                                <div class="habit-cell habit-cell--checkbox border-t border-color"><div class="habit-dot"></div></div>
                            </div>
                        </div>
                        
                        <div class="card flex-1">
                            <div class="card__header">
                                <h3 class="card__title">Daily Planner</h3>
                                <div class="text-sm text-secondary">Today</div>
                            </div>
                            <div class="planner-grid">
                                <div class="planner-row">
                                    <div class="planner-time">09:00 AM</div>
                                    <div class="planner-content">
                                        <div class="planner-event">Team Sync</div>
                                    </div>
                                </div>
                                <div class="planner-row">
                                    <div class="planner-time">10:00 AM</div>
                                    <div class="planner-content">
                                        <div class="planner-event bg-purple-bg text-purple">Deep Work: React Project</div>
                                    </div>
                                </div>
                                <div class="planner-row">
                                    <div class="planner-time">11:00 AM</div>
                                    <div class="planner-content"></div>
                                </div>
                                <div class="planner-row">
                                    <div class="planner-time">12:00 PM</div>
                                    <div class="planner-content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    updateDisplay() {
        const display = document.getElementById('timerDisplay');
        if (!display) return;
        const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
        const s = (this.timeLeft % 60).toString().padStart(2, '0');
        display.textContent = `${m}:${s}`;
        document.title = `${m}:${s} - Pomodoro`;
    },
    
    toggleTimer() {
        const btn = document.getElementById('timerToggle');
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            btn.innerHTML = '<i data-lucide="play"></i> Start';
            btn.classList.replace('btn--warning', 'btn--primary');
        } else {
            this.isRunning = true;
            btn.innerHTML = '<i data-lucide="pause"></i> Pause';
            btn.classList.replace('btn--primary', 'btn--warning');
            
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval);
                    this.isRunning = false;
                    btn.innerHTML = '<i data-lucide="play"></i> Start';
                    btn.classList.replace('btn--warning', 'btn--primary');
                    // Play sound or notification here
                    if(window.Notification && Notification.permission === "granted") {
                        new Notification("Time's up!");
                    }
                    this.resetTimer();
                }
            }, 1000);
        }
        if(window.lucide) lucide.createIcons({root: btn});
    },
    
    resetTimer() {
        if(this.timerInterval) clearInterval(this.timerInterval);
        this.isRunning = false;
        
        if (this.mode === 'pomodoro') this.timeLeft = 25 * 60;
        else if (this.mode === 'short') this.timeLeft = 5 * 60;
        else if (this.mode === 'long') this.timeLeft = 15 * 60;
        
        this.updateDisplay();
        const btn = document.getElementById('timerToggle');
        if(btn) {
            btn.innerHTML = '<i data-lucide="play"></i> Start';
            btn.classList.remove('btn--warning');
            btn.classList.add('btn--primary');
            if(window.lucide) lucide.createIcons({root: btn});
        }
    },
    
    setMode(mode, targetId) {
        this.mode = mode;
        ['modePomodoro', 'modeShort', 'modeLong'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.remove('tab--active');
        });
        const active = document.getElementById(targetId);
        if(active) active.classList.add('tab--active');
        
        this.resetTimer();
    },

    init() {
        if (window.lucide) lucide.createIcons();
        
        // Timer events
        const toggleBtn = document.getElementById('timerToggle');
        const resetBtn = document.getElementById('timerReset');
        
        if(toggleBtn) toggleBtn.addEventListener('click', () => this.toggleTimer());
        if(resetBtn) resetBtn.addEventListener('click', () => this.resetTimer());
        
        const mP = document.getElementById('modePomodoro');
        const mS = document.getElementById('modeShort');
        const mL = document.getElementById('modeLong');
        
        if(mP) mP.addEventListener('click', () => this.setMode('pomodoro', 'modePomodoro'));
        if(mS) mS.addEventListener('click', () => this.setMode('short', 'modeShort'));
        if(mL) mL.addEventListener('click', () => this.setMode('long', 'modeLong'));
        
        // Habit checkbox interactive toggle
        document.querySelectorAll('.habit-cell--checkbox').forEach(cb => {
            cb.addEventListener('click', () => {
                cb.classList.toggle('habit-cell--checked');
            });
        });
    },
    
    cleanup() {
        if(this.timerInterval) clearInterval(this.timerInterval);
        document.title = 'CareerNav — Student Career Navigator';
    }
};

export default ProductivityPage;
