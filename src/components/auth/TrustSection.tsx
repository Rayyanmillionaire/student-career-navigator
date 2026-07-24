import React from 'react';
import { ShieldCheck, Lock, Users } from 'lucide-react';

export function TrustSection() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-full opacity-80">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-green-500/80" />
        <span>Secure Authentication</span>
      </div>
      <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
      <div className="flex items-center gap-1.5">
        <Lock className="w-4 h-4 text-blue-500/80" />
        <span>Privacy Protected</span>
      </div>
      <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
      <div className="flex items-center gap-1.5">
        <Users className="w-4 h-4 text-purple-500/80" />
        <span>Trusted by Students</span>
      </div>
    </div>
  );
}
