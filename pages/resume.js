import Store from '../js/store.js';
import Components from '../js/components.js';

const ResumePage = {
    render() {
        const resumeData = Store.get('resumeData') || DEFAULTS.resumeData;
        
        return `
            <div class="page p-0 max-w-full h-full flex flex-col">
                <div class="page__header px-xl py-md mb-0 border-b border-color bg-glass sticky top-0" style="z-index: 10;">
                    <div>
                        <h1 class="page__title font-2xl mb-0">Resume Builder</h1>
                    </div>
                    <div class="page__actions">
                        <select id="templateSelect" class="form-select w-auto py-sm">
                            <option value="modern" ${resumeData.template === 'modern' ? 'selected' : ''}>Modern</option>
                            <option value="classic" ${resumeData.template === 'classic' ? 'selected' : ''}>Classic</option>
                            <option value="minimal" ${resumeData.template === 'minimal' ? 'selected' : ''}>Minimal</option>
                        </select>
                        <button class="btn btn--primary" id="downloadPdfBtn"><i data-lucide="download"></i> Download PDF</button>
                    </div>
                </div>

                <div class="resume-builder flex-1 p-xl">
                    <!-- Form Panel -->
                    <div class="resume-form card h-full overflow-hidden flex-col p-0">
                        <div class="tabs px-md pt-sm border-b border-color">
                            <button class="tab tab--active" data-tab="personal">Personal</button>
                            <button class="tab" data-tab="experience">Experience</button>
                            <button class="tab" data-tab="education">Education</button>
                            <button class="tab" data-tab="skills">Skills</button>
                        </div>
                        
                        <div class="flex-1 overflow-y-auto p-md" id="resumeFormContent">
                            <!-- Rendered dynamically based on active tab -->
                        </div>
                    </div>
                    
                    <!-- Preview Panel -->
                    <div class="resume-preview flex items-start justify-center h-full">
                        <div class="resume-paper" id="resumePaper">
                            <!-- Rendered template -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderFormTab(tab) {
        const data = Store.get('resumeData');
        let html = '';
        
        if (tab === 'personal') {
            const p = data.personal || {};
            html = `
                <div class="form-group"><label class="form-label">Full Name</label><input type="text" class="form-input resume-input" data-field="personal.name" value="${p.name || ''}"></div>
                <div class="form-group"><label class="form-label">Professional Title</label><input type="text" class="form-input resume-input" data-field="personal.title" value="${p.title || ''}" placeholder="e.g. Software Engineering Student"></div>
                <div class="form-row">
                    <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input resume-input" data-field="personal.email" value="${p.email || ''}"></div>
                    <div class="form-group"><label class="form-label">Phone</label><input type="tel" class="form-input resume-input" data-field="personal.phone" value="${p.phone || ''}"></div>
                </div>
                <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input resume-input" data-field="personal.location" value="${p.location || ''}"></div>
                <div class="form-row">
                    <div class="form-group"><label class="form-label">LinkedIn (URL)</label><input type="url" class="form-input resume-input" data-field="personal.linkedin" value="${p.linkedin || ''}"></div>
                    <div class="form-group"><label class="form-label">GitHub (URL)</label><input type="url" class="form-input resume-input" data-field="personal.github" value="${p.github || ''}"></div>
                </div>
                <div class="form-group"><label class="form-label">Professional Summary</label><textarea class="form-textarea resume-input" data-field="personal.summary">${p.summary || ''}</textarea></div>
            `;
        } else if (tab === 'experience') {
            html = `<div class="mb-md flex justify-between items-center"><h3 class="font-bold">Work Experience & Projects</h3><button class="btn btn--outline btn--sm" id="addExpBtn"><i data-lucide="plus"></i> Add Item</button></div>`;
            const exp = data.experience || [];
            if(exp.length === 0) html += `<p class="text-secondary text-sm">No experience added yet.</p>`;
            
            exp.forEach((item, i) => {
                html += `
                    <div class="card card--bordered p-sm mb-sm relative group">
                        <button class="btn btn--icon btn--ghost text-danger absolute top-2 right-2 delete-exp-btn" data-index="${i}"><i data-lucide="trash-2"></i></button>
                        <div class="form-group"><label class="form-label">Role / Job Title</label><input type="text" class="form-input resume-array-input" data-array="experience" data-index="${i}" data-key="role" value="${item.role || ''}"></div>
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Company / Project Name</label><input type="text" class="form-input resume-array-input" data-array="experience" data-index="${i}" data-key="company" value="${item.company || ''}"></div>
                            <div class="form-group"><label class="form-label">Date Range</label><input type="text" class="form-input resume-array-input" data-array="experience" data-index="${i}" data-key="date" value="${item.date || ''}" placeholder="May 2023 - Aug 2023"></div>
                        </div>
                        <div class="form-group mb-0"><label class="form-label">Description (Bullet points)</label><textarea class="form-textarea resume-array-input" data-array="experience" data-index="${i}" data-key="desc" rows="3" placeholder="- Developed feature X...">${item.desc || ''}</textarea></div>
                    </div>
                `;
            });
        } else if (tab === 'education') {
            html = `<div class="mb-md flex justify-between items-center"><h3 class="font-bold">Education</h3><button class="btn btn--outline btn--sm" id="addEduBtn"><i data-lucide="plus"></i> Add Item</button></div>`;
            const edu = data.education || [];
            
            edu.forEach((item, i) => {
                html += `
                    <div class="card card--bordered p-sm mb-sm relative group">
                        <button class="btn btn--icon btn--ghost text-danger absolute top-2 right-2 delete-edu-btn" data-index="${i}"><i data-lucide="trash-2"></i></button>
                        <div class="form-group"><label class="form-label">Degree / Major</label><input type="text" class="form-input resume-array-input" data-array="education" data-index="${i}" data-key="degree" value="${item.degree || ''}"></div>
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">School / University</label><input type="text" class="form-input resume-array-input" data-array="education" data-index="${i}" data-key="school" value="${item.school || ''}"></div>
                            <div class="form-group"><label class="form-label">Graduation Date / Expected</label><input type="text" class="form-input resume-array-input" data-array="education" data-index="${i}" data-key="date" value="${item.date || ''}" placeholder="May 2025"></div>
                        </div>
                        <div class="form-group mb-0"><label class="form-label">Additional Info (GPA, Honors)</label><input type="text" class="form-input resume-array-input" data-array="education" data-index="${i}" data-key="info" value="${item.info || ''}"></div>
                    </div>
                `;
            });
        } else if (tab === 'skills') {
            html = `
                <div class="form-group">
                    <label class="form-label">Technical Skills (Comma separated)</label>
                    <textarea class="form-textarea resume-input" data-field="skillsText" rows="4" placeholder="JavaScript, React, Node.js, Python, SQL...">${data.skillsText || ''}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Soft Skills & Tools (Comma separated)</label>
                    <textarea class="form-textarea resume-input" data-field="toolsText" rows="3" placeholder="Git, Docker, Agile, Communication...">${data.toolsText || ''}</textarea>
                </div>
            `;
        }

        const container = document.getElementById('resumeFormContent');
        if (container) {
            container.innerHTML = html;
            if (window.lucide) lucide.createIcons({ root: container });
            this.attachFormEvents(tab);
        }
    },

    attachFormEvents(tab) {
        // Simple input binding
        document.querySelectorAll('.resume-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const field = e.target.getAttribute('data-field');
                let data = Store.get('resumeData');
                if (field.includes('.')) {
                    const [obj, key] = field.split('.');
                    if (!data[obj]) data[obj] = {};
                    data[obj][key] = e.target.value;
                } else {
                    data[field] = e.target.value;
                }
                Store.set('resumeData', data);
                this.renderPreview();
            });
        });

        // Array input binding
        document.querySelectorAll('.resume-array-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const arrayName = e.target.getAttribute('data-array');
                const index = parseInt(e.target.getAttribute('data-index'));
                const key = e.target.getAttribute('data-key');
                
                let data = Store.get('resumeData');
                if(!data[arrayName]) data[arrayName] = [];
                if(!data[arrayName][index]) data[arrayName][index] = {};
                
                data[arrayName][index][key] = e.target.value;
                Store.set('resumeData', data);
                this.renderPreview();
            });
        });
        
        // Add buttons
        const addExpBtn = document.getElementById('addExpBtn');
        if (addExpBtn) addExpBtn.addEventListener('click', () => {
            let data = Store.get('resumeData');
            if(!data.experience) data.experience = [];
            data.experience.push({ role: '', company: '', date: '', desc: '' });
            Store.set('resumeData', data);
            this.renderFormTab('experience');
            this.renderPreview();
        });
        
        const addEduBtn = document.getElementById('addEduBtn');
        if (addEduBtn) addEduBtn.addEventListener('click', () => {
            let data = Store.get('resumeData');
            if(!data.education) data.education = [];
            data.education.push({ degree: '', school: '', date: '', info: '' });
            Store.set('resumeData', data);
            this.renderFormTab('education');
            this.renderPreview();
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-exp-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                let data = Store.get('resumeData');
                data.experience.splice(index, 1);
                Store.set('resumeData', data);
                this.renderFormTab('experience');
                this.renderPreview();
            });
        });
        document.querySelectorAll('.delete-edu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                let data = Store.get('resumeData');
                data.education.splice(index, 1);
                Store.set('resumeData', data);
                this.renderFormTab('education');
                this.renderPreview();
            });
        });
    },

    renderPreview() {
        const data = Store.get('resumeData');
        const paper = document.getElementById('resumePaper');
        if (!paper) return;
        
        const p = data.personal || {};
        const edu = data.education || [];
        const exp = data.experience || [];
        
        // Very basic inline CSS for the template to ensure it works well with html2pdf
        let html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.4;">
                <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 15px;">
                    <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">${p.name || 'Your Name'}</h1>
                    <div style="font-size: 14px; color: #555; margin-top: 5px;">${p.title || 'Professional Title'}</div>
                    <div style="font-size: 12px; margin-top: 8px;">
                        ${p.email ? `<span style="margin: 0 5px;">${p.email}</span>` : ''}
                        ${p.phone ? `| <span style="margin: 0 5px;">${p.phone}</span>` : ''}
                        ${p.location ? `| <span style="margin: 0 5px;">${p.location}</span>` : ''}
                    </div>
                    <div style="font-size: 12px; margin-top: 4px;">
                        ${p.linkedin ? `<span style="margin: 0 5px;">${p.linkedin}</span>` : ''}
                        ${p.github ? `| <span style="margin: 0 5px;">${p.github}</span>` : ''}
                    </div>
                </div>
                
                ${p.summary ? `
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 12px;">${p.summary}</div>
                    </div>
                ` : ''}
                
                ${edu.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px;">Education</h2>
                        ${edu.map(e => `
                            <div style="margin-bottom: 8px;">
                                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px;">
                                    <span>${e.school || 'School Name'}</span>
                                    <span>${e.date || 'Date'}</span>
                                </div>
                                <div style="font-size: 12px; font-style: italic;">${e.degree || 'Degree'}</div>
                                ${e.info ? `<div style="font-size: 11px; margin-top: 2px;">${e.info}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${exp.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px;">Experience</h2>
                        ${exp.map(e => `
                            <div style="margin-bottom: 12px;">
                                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px;">
                                    <span>${e.role || 'Role'}</span>
                                    <span>${e.date || 'Date'}</span>
                                </div>
                                <div style="font-size: 12px; font-style: italic; margin-bottom: 4px;">${e.company || 'Company'}</div>
                                <div style="font-size: 11px;">
                                    ${(e.desc || '').split('\n').map(line => line.trim() ? `<div style="margin-bottom: 2px;">${line}</div>` : '').join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${data.skillsText || data.toolsText ? `
                    <div style="margin-bottom: 15px;">
                        <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px;">Skills</h2>
                        <div style="font-size: 12px;">
                            ${data.skillsText ? `<div><strong>Technical:</strong> ${data.skillsText}</div>` : ''}
                            ${data.toolsText ? `<div style="margin-top: 4px;"><strong>Tools/Other:</strong> ${data.toolsText}</div>` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        paper.innerHTML = html;
    },

    init() {
        if (window.lucide) lucide.createIcons();
        
        // Tabs logic
        const tabs = document.querySelectorAll('.resume-builder .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('tab--active'));
                e.target.classList.add('tab--active');
                this.renderFormTab(e.target.getAttribute('data-tab'));
            });
        });
        
        // Initial render
        this.renderFormTab('personal');
        this.renderPreview();
        
        // Download PDF
        const downloadBtn = document.getElementById('downloadPdfBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                if (window.html2pdf) {
                    const element = document.getElementById('resumePaper');
                    const opt = {
                        margin:       0,
                        filename:     'resume.pdf',
                        image:        { type: 'jpeg', quality: 0.98 },
                        html2canvas:  { scale: 2, useCORS: true },
                        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                    };
                    
                    // Add a temporary white background just in case dark mode interferes
                    const originalBg = element.style.backgroundColor;
                    element.style.backgroundColor = '#ffffff';
                    
                    html2pdf().set(opt).from(element).save().then(() => {
                        element.style.backgroundColor = originalBg;
                        Components.toast('Resume downloaded successfully', 'success');
                    });
                } else {
                    Components.toast('PDF generation library not loaded', 'error');
                }
            });
        }
    },
    
    cleanup() {}
};

export default ResumePage;
