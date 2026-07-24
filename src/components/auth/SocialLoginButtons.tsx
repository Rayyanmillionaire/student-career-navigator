import React from 'react';
import { motion } from 'framer-motion';

export function SocialLoginButtons({ isLoading }: { isLoading?: boolean }) {
  const providers = [
    { name: 'Google', icon: 'https://www.svgrepo.com/show/475656/google-color.svg' },
    { name: 'GitHub', icon: 'https://www.svgrepo.com/show/512317/github-142.svg' },
    { name: 'Microsoft', icon: 'https://www.svgrepo.com/show/475666/microsoft-color.svg' }
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {providers.map((provider) => (
          <motion.button
            key={provider.name}
            type="button"
            whileHover={!isLoading ? { y: -1, backgroundColor: 'hsl(var(--muted))' } : undefined}
            whileTap={!isLoading ? { scale: 0.95 } : undefined}
            disabled={isLoading}
            className="flex items-center justify-center h-10 bg-background border border-border rounded-md hover:border-accent-blue/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Sign in with ${provider.name}`}
          >
            <img src={provider.icon} alt={`${provider.name} logo`} className="w-5 h-5" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
