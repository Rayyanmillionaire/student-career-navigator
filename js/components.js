const Components = {
    modal({ title, content, size = '', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, hideFooter = false }) {
        const id = 'modal_' + Math.random().toString(36).substr(2, 9);
        const sizeClass = size ? `modal--${size}` : '';
        
        let footerHtml = '';
        if (!hideFooter) {
            footerHtml = `
                <div class="modal__footer">
                    <button class="btn btn--ghost" id="${id}_cancel">${cancelText}</button>
                    ${onConfirm ? `<button class="btn btn--primary" id="${id}_confirm">${confirmText}</button>` : ''}
                </div>
            `;
        }

        const html = `
            <div class="modal-overlay" id="${id}">
                <div class="modal ${sizeClass}">
                    <div class="modal__header">
                        <h3 class="modal__title">${title}</h3>
                        <button class="modal__close" id="${id}_close">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal__body">
                        ${content}
                    </div>
                    ${footerHtml}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        const modalEl = document.getElementById(id);
        
        if (window.lucide) lucide.createIcons({ root: modalEl });

        const close = () => {
            modalEl.classList.remove('modal--active');
            setTimeout(() => {
                modalEl.remove();
            }, 300);
        };

        // Events
        requestAnimationFrame(() => {
            modalEl.classList.add('modal--active');
        });

        document.getElementById(`${id}_close`).addEventListener('click', () => {
            if (onCancel) onCancel();
            close();
        });

        if (!hideFooter) {
            document.getElementById(`${id}_cancel`).addEventListener('click', () => {
                if (onCancel) onCancel();
                close();
            });
            if (onConfirm) {
                document.getElementById(`${id}_confirm`).addEventListener('click', () => {
                    onConfirm(close);
                });
            }
        }

        // Close on overlay click
        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl) {
                if (onCancel) onCancel();
                close();
            }
        });

        // Close on ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                if (onCancel) onCancel();
                close();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        return { element: modalEl, close };
    },

    closeModal() {
        const modals = document.querySelectorAll('.modal-overlay.modal--active');
        modals.forEach(m => {
            m.classList.remove('modal--active');
            setTimeout(() => m.remove(), 300);
        });
    },

    toast(message, type = 'info', duration = 3500) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const id = 'toast_' + Math.random().toString(36).substr(2, 9);
        const html = `
            <div class="toast toast--${type}" id="${id}">
                <i data-lucide="${icons[type]}" class="toast__icon"></i>
                <div class="toast__message">${message}</div>
                <button class="toast__close" id="${id}_close">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', html);
        const toastEl = document.getElementById(id);
        
        if (window.lucide) lucide.createIcons({ root: toastEl });

        requestAnimationFrame(() => {
            toastEl.classList.add('toast--active');
        });

        const remove = () => {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateX(120%)';
            setTimeout(() => {
                toastEl.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        };

        document.getElementById(`${id}_close`).addEventListener('click', remove);

        if (duration > 0) {
            setTimeout(remove, duration);
        }
    },

    confirm(title, message) {
        return new Promise((resolve) => {
            this.modal({
                title,
                content: `<p class="text-secondary">${message}</p>`,
                size: 'sm',
                confirmText: 'Confirm',
                onConfirm: (close) => {
                    resolve(true);
                    close();
                },
                onCancel: () => {
                    resolve(false);
                }
            });
        });
    },

    skeleton(type = 'card', count = 1) {
        let html = '';
        for (let i = 0; i < count; i++) {
            if (type === 'card') {
                html += `
                    <div class="card">
                        <div class="flex items-center gap-md mb-md">
                            <div class="skeleton skeleton--circle" style="width: 48px; height: 48px;"></div>
                            <div class="flex-1">
                                <div class="skeleton skeleton--title mb-xs"></div>
                                <div class="skeleton skeleton--text w-full"></div>
                            </div>
                        </div>
                        <div class="skeleton skeleton--rect w-full rounded"></div>
                    </div>
                `;
            } else if (type === 'text') {
                html += `
                    <div class="mb-md">
                        <div class="skeleton skeleton--text"></div>
                        <div class="skeleton skeleton--text"></div>
                        <div class="skeleton skeleton--text" style="width: 60%"></div>
                    </div>
                `;
            } else if (type === 'table') {
                html += `<div class="skeleton skeleton--text mb-md" style="height: 40px;"></div>`;
            } else if (type === 'list') {
                html += `
                    <div class="flex items-center gap-md mb-md">
                        <div class="skeleton skeleton--circle" style="width: 40px; height: 40px;"></div>
                        <div class="flex-1">
                            <div class="skeleton skeleton--text"></div>
                        </div>
                    </div>
                `;
            }
        }
        return html;
    },

    emptyState({ icon = 'inbox', title = 'No data found', message = 'There is nothing to display here yet.', actionText, onAction }) {
        const id = 'action_' + Math.random().toString(36).substr(2, 9);
        const actionHtml = actionText ? `<button class="btn btn--primary mt-md" id="${id}">${actionText}</button>` : '';
        
        const html = `
            <div class="empty-state animate-fade-in">
                <div class="empty-state__icon">
                    <i data-lucide="${icon}"></i>
                </div>
                <h3 class="empty-state__title">${title}</h3>
                <p class="empty-state__message">${message}</p>
                ${actionHtml}
            </div>
        `;

        if (actionText && onAction) {
            // Defer attaching event listener until it's in the DOM
            setTimeout(() => {
                const btn = document.getElementById(id);
                if (btn) btn.addEventListener('click', onAction);
            }, 0);
        }

        return html;
    },

    progressRing(percentage, size = 120, color = 'var(--accent-blue)') {
        const stroke = 8;
        const radius = (size - stroke) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;

        return `
            <div class="progress-ring" style="width: ${size}px; height: ${size}px;">
                <svg width="${size}" height="${size}">
                    <circle 
                        stroke="var(--bg-tertiary)" 
                        stroke-width="${stroke}" 
                        fill="transparent" 
                        r="${radius}" 
                        cx="${size/2}" 
                        cy="${size/2}" 
                    />
                    <circle 
                        class="progress-ring__circle"
                        stroke="${color}" 
                        stroke-width="${stroke}" 
                        stroke-linecap="round"
                        stroke-dasharray="${circumference} ${circumference}" 
                        stroke-dashoffset="${offset}"
                        fill="transparent" 
                        r="${radius}" 
                        cx="${size/2}" 
                        cy="${size/2}" 
                    />
                </svg>
                <div class="progress-ring__text font-2xl">${percentage}%</div>
            </div>
        `;
    },

    badge(text, variant = 'primary') {
        return `<span class="badge badge--${variant}">${text}</span>`;
    },

    statCard({ icon, value, label, trend, trendDirection = 'up', color = 'blue' }) {
        let trendHtml = '';
        if (trend) {
            const iconName = trendDirection === 'up' ? 'trending-up' : 'trending-down';
            const colorClass = trendDirection === 'up' ? 'stat-card__trend--up' : 'stat-card__trend--down';
            trendHtml = `
                <div class="stat-card__trend ${colorClass}">
                    <i data-lucide="${iconName}" style="width:14px;height:14px;"></i>
                    <span>${trend}</span>
                </div>
            `;
        }

        return `
            <div class="card stat-card">
                <div class="stat-card__icon" style="background-color: var(--${color}-bg, rgba(59,130,246,0.1)); color: var(--${color}, #3B82F6)">
                    <i data-lucide="${icon}"></i>
                </div>
                <div class="stat-card__info">
                    <div class="stat-card__label">${label}</div>
                    <div class="stat-card__value" data-count-to="${value.replace ? value.replace(/[^0-9.]/g, '') : value}">${value}</div>
                    ${trendHtml}
                </div>
            </div>
        `;
    }
};

export default Components;
