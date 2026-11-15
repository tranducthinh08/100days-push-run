import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
}

export function Card({
  children,
  variant = 'default',
  className,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-3xl border transition-all duration-200';

  const variantStyles = {
    default: 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-900 shadow-sm p-5 md:p-6',
    elevated: 'bg-white border-slate-200/90 shadow-xl shadow-slate-900/5 text-slate-900 p-5 md:p-6',
    glass: 'bg-white/80 backdrop-blur-xl border-white/60 text-slate-900 shadow-md p-5 md:p-6',
    interactive:
      'bg-white/95 border-slate-200/90 text-slate-900 p-5 md:p-6 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer',
  };

  return (
    <div
      className={twMerge(clsx(baseStyles, variantStyles[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
}
export default Card;
