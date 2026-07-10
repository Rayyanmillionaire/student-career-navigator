const PWA = {
    deferredPrompt: null,
    
    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            this.deferredPrompt = e;
            // Update UI notify the user they can install the PWA
            window.dispatchEvent(new CustomEvent('pwa-install-available'));
        });

        window.addEventListener('appinstalled', (e) => {
            // Clear the deferredPrompt so it can be garbage collected
            this.deferredPrompt = null;
            window.dispatchEvent(new CustomEvent('pwa-installed'));
        });
    },
    
    canInstall() {
        return !!this.deferredPrompt;
    },
    
    async promptInstall() {
        if (!this.deferredPrompt) {
            return false;
        }
        // Show the install prompt
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        // We've used the prompt, and can't use it again, throw it away
        this.deferredPrompt = null;
        
        return outcome === 'accepted';
    }
};

export default PWA;
