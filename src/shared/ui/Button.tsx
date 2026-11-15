import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'blue' | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none touch-manipulation cursor-pointer';

  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs gap-1.5',
    md: 'h-11 px-4.5 text-xs gap-2',
    lg: 'h-13 px-6 text-sm gap-2.5',
    xl: 'h-15 px-8 text-base gap-3',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5',
    blue:
      'bg-gradient-to-r from-blue-600 via-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-black shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5',
    emerald:
      'bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-black shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5',
    secondary:
      'bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100/80 font-bold shadow-sm',
    outline:
      'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm',
    ghost:
      'text-slate-600 hover:text-orange-600 hover:bg-orange-50/80',
    danger:
      'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
export default Button;
