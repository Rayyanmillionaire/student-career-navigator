import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export function PasswordStrength({ password }: { password: string }) {
  const reqs = [
    { label: 'Minimum 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const metCount = reqs.filter(r => r.met).length;
  
  let label = 'Empty';
  let color = 'bg-border';
  let width = '0%';
  
  if (password.length > 0) {
    if (metCount <= 2) {
      label = 'Weak';
      color = 'bg-red-500';
      width = '25%';
    } else if (metCount === 3 || metCount === 4) {
      label = 'Medium';
      color = 'bg-yellow-500';
      width = '50%';
    } else if (metCount === 5) {
      if (password.length >= 12) {
        label = 'Excellent';
        color = 'bg-green-400';
        width = '100%';
      } else {
        label = 'Strong';
        color = 'bg-green-500';
        width = '75%';
      }
    }
  }

  return (
    <div className="space-y-3 mt-2 bg-muted/30 p-3 rounded-lg border border-border/50">
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-muted-foreground font-medium">Password strength:</span>
          <span className={`font-bold uppercase tracking-wide ${
            label === 'Weak' ? 'text-red-500' : 
            label === 'Medium' ? 'text-yellow-500' : 
            label === 'Strong' || label === 'Excellent' ? 'text-green-500' : 
            'text-muted-foreground'
          }`}>
            {label}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-0.5">
          <motion.div 
            className={`h-full rounded-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
        {reqs.map((req, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            )}
            <span className={`text-[10px] ${req.met ? 'text-foreground' : 'text-muted-foreground'} transition-colors duration-200`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
