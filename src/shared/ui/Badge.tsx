import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'orange' | 'slate' | 'blue' | 'purple' | 'amber';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'orange',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-bold rounded-lg shrink-0 select-none tracking-wide';

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    orange: 'bg-[#FF5500]/15 text-[#FF8A00] border border-[#FF5500]/30',
    emerald: 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30',
    slate: 'bg-white/10 text-slate-300 border border-white/10',
    blue: 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {children}
    </span>
  );
}
export default Badge;
