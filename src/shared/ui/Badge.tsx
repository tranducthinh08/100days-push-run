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
    orange: 'bg-orange-50 text-orange-700 border border-orange-200',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
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
