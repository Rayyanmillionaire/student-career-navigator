import Auth from '../js/auth.js';
import Store from '../js/store.js';
import Components from '../js/components.js';
import Utils from '../js/utils.js';

const ProfilePage = {
    render() {
        const user = Auth.getUser();
        
        return `
            <div class="page animate-fade-in">
                <div class="page__header">
                    <div>
                        <h1 class="page__title">My Profile</h1>
                        <p class="page__subtitle">Manage your personal information and preferences.</p>
                    </div>
                </div>

                <div class="profile-header animate-slide-up stagger-1">
                    <div class="profile-avatar-wrapper">
                        <div class="avatar avatar--2xl">
                            <span class="avatar__initials">${Utils.getInitials(user.name)}</span>
                            <img class="avatar__img" src="${user.profilePicture || ''}" style="display: ${user.profilePicture ? 'block' : 'none'}">
                        </div>
                        <label class="profile-avatar-upload" title="Upload Picture">
                            <i data-lucide="camera" style="width: 16px; height: 16px;"></i>
                            <input type="file" hidden accept="image/*" id="avatarUpload">
                        </label>
                    </div>
                    <div class="flex-1">
                        <h2 class="font-2xl font-bold mb-xs">${user.name}</h2>
                        <p class="text-secondary flex items-center gap-xs mb-sm"><i data-lucide="hash" style="width:16px;height:16px"></i> ${user.rollNumber}</p>
                        <div class="flex gap-sm">
                            ${Components.badge(Utils.capitalize(user.role), 'primary')}
                            ${user.college ? Components.badge(user.college, 'outline') : ''}
                        </div>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="card animate-slide-up stagger-2">
                        <div class="card__header">
                            <h3 class="card__title">Personal Information</h3>
                        </div>
                        <form id="profileForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" class="form-input" id="profileName" value="${user.name}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Roll Number</label>
                                    <input type="text" class="form-input" value="${user.rollNumber}" disabled>
                                    <span class="form-hint">Roll number cannot be changed</span>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">University / College</label>
                                    <div class="input-group">
                                        <i data-lucide="book-open" class="input-group__icon"></i>
                                        <input type="text" class="form-input" id="profileCollege" value="${user.college || ''}" placeholder="e.g. Stanford University">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Major</label>
                                    <div class="input-group">
                                        <i data-lucide="award" class="input-group__icon"></i>
                                        <input type="text" class="form-input" id="profileMajor" value="${user.major || ''}" placeholder="e.g. Computer Science">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Graduation Year</label>
                                    <input type="number" class="form-input" id="profileGradYear" value="${user.gradYear || ''}" placeholder="YYYY">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Phone Number</label>
                                    <input type="tel" class="form-input" id="profilePhone" value="${user.phone || ''}" placeholder="+1 ...">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Bio</label>
                                <textarea class="form-textarea" id="profileBio" placeholder="Tell us a little about yourself...">${user.bio || ''}</textarea>
                            </div>
                            
                            <div class="flex justify-end mt-lg">
                                <button type="submit" class="btn btn--primary">Save Changes</button>
                            </div>
                        </form>
                    </div>

                    <div class="flex flex-col gap-lg animate-slide-up stagger-3">
                        <div class="card">
                            <div class="card__header">
                                <h3 class="card__title">Social Links</h3>
                            </div>
                            <div class="form-group">
                                <div class="input-group mb-sm">
                                    <i data-lucide="github" class="input-group__icon"></i>
                                    <input type="url" class="form-input" id="profileGithub" value="${user.socials?.github || ''}" placeholder="GitHub URL">
                                </div>
                                <div class="input-group mb-sm">
                                    <i data-lucide="linkedin" class="input-group__icon"></i>
                                    <input type="url" class="form-input" id="profileLinkedin" value="${user.socials?.linkedin || ''}" placeholder="LinkedIn URL">
                                </div>
                                <div class="input-group">
                                    <i data-lucide="globe" class="input-group__icon"></i>
                                    <input type="url" class="form-input" id="profileWebsite" value="${user.socials?.website || ''}" placeholder="Portfolio Website">
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card__header">
                                <h3 class="card__title">Change Password</h3>
                            </div>
                            <form id="passwordForm">
                                <div class="form-group">
                                    <label class="form-label">Current Password</label>
                                    <input type="password" class="form-input" id="currentPassword" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">New Password</label>
                                    <input type="password" class="form-input" id="newPassword" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Confirm New Password</label>
                                    <input type="password" class="form-input" id="confirmPassword" required>
                                </div>
                                <button type="submit" class="btn btn--outline w-full">Update Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        if (window.lucide) lucide.createIcons();
        
        // Handle Avatar Upload (Simulated)
        const upload = document.getElementById('avatarUpload');
        if (upload) {
            upload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        Auth.updateProfile({ profilePicture: evt.target.result });
                        // Re-render avatar visually
                        document.querySelector('.avatar__img').src = evt.target.result;
                        document.querySelector('.avatar__img').style.display = 'block';
                        document.querySelector('.avatar__initials').style.display = 'none';
                        Components.toast('Profile picture updated successfully', 'success');
                        
                        // Need to update global shell avatar too (not perfectly reactive without full re-render, but close enough)
                        const topAvatar = document.querySelector('#userAvatarBtn .avatar__img');
                        if (topAvatar) {
                            topAvatar.src = evt.target.result;
                            topAvatar.style.display = 'block';
                            document.querySelector('#userAvatarBtn .avatar__initials').style.display = 'none';
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Profile Form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = {
                    name: document.getElementById('profileName').value,
                    college: document.getElementById('profileCollege').value,
                    major: document.getElementById('profileMajor').value,
                    gradYear: document.getElementById('profileGradYear').value,
                    phone: document.getElementById('profilePhone').value,
                    bio: document.getElementById('profileBio').value,
                    socials: {
                        github: document.getElementById('profileGithub').value,
                        linkedin: document.getElementById('profileLinkedin').value,
                        website: document.getElementById('profileWebsite').value,
                    }
                };
                
                Auth.updateProfile(data);
                Components.toast('Profile updated successfully', 'success');
            });
        }
        
        // Password Form
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const cur = document.getElementById('currentPassword').value;
                const newP = document.getElementById('newPassword').value;
                const conf = document.getElementById('confirmPassword').value;
                
                if (newP !== conf) {
                    Components.toast('New passwords do not match', 'error');
                    return;
                }
                
                const res = Auth.changePassword(cur, newP);
                if (res.success) {
                    Components.toast('Password changed successfully', 'success');
                    passwordForm.reset();
                } else {
                    Components.toast(res.error, 'error');
                }
            });
        }
    },
    
    cleanup() {}
};

export default ProfilePage;
