import React from 'react';
import { motion } from 'framer-motion';

export function SocialLoginButtons({ isLoading }: { isLoading?: boolean }) {
  const providers = [
    { name: 'Google', icon: 'https://www.svgrepo.com/show/475656/google-color.svg' },
    { name: 'GitHub', icon: 'https://www.svgrepo.com/show/512317/github-142.svg', darkIcon: 'https://www.svgrepo.com/show/512317/github-142.svg' },
    { name: 'Microsoft', icon: 'https://www.svgrepo.com/show/475666/microsoft-color.svg' }
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
          <span className="bg-white/80 dark:bg-card px-3 text-muted-foreground backdrop-blur-sm rounded-full">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {providers.map((provider) => (
          <motion.button
            key={provider.name}
            type="button"
            whileHover={!isLoading ? { y: -2, backgroundColor: 'var(--muted)' } : undefined}
            whileTap={!isLoading ? { scale: 0.98 } : undefined}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 h-[52px] bg-background dark:bg-zinc-900 border border-border rounded-[14px] hover:border-accent-blue/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-foreground group shadow-sm hover:shadow-md"
            aria-label={`Sign in with ${provider.name}`}
          >
            <img 
              src={provider.icon} 
              alt={`${provider.name} logo`} 
              className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${provider.name === 'GitHub' ? 'dark:invert' : ''}`} 
            />
            Continue with {provider.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
