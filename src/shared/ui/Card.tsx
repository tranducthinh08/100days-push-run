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
    default: 'bg-[#111622]/90 backdrop-blur-xl border-white/[0.08] text-slate-100 shadow-glass-hud p-5 md:p-6',
    elevated: 'bg-[#151922] border-white/10 shadow-2xl text-slate-100 p-5 md:p-6',
    glass: 'bg-[#151C2C]/70 backdrop-blur-2xl border-white/[0.08] text-slate-100 shadow-glass-hud p-5 md:p-6',
    interactive:
      'bg-[#111622]/90 backdrop-blur-xl border-white/[0.08] text-slate-100 p-5 md:p-6 hover:border-[#FF5500]/40 hover:shadow-neon-orange/20 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer',
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
