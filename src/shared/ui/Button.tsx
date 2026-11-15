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
      'bg-gradient-to-r from-[#FF5500] via-[#FF6D00] to-[#FF8A00] hover:from-[#E54D00] hover:to-[#FF7A00] text-white font-black shadow-neon-orange hover:-translate-y-0.5',
    blue:
      'bg-gradient-to-r from-[#00E5FF] to-[#0070F3] hover:from-[#00CBE5] hover:to-[#005EDB] text-black font-black shadow-neon-cyan hover:-translate-y-0.5',
    emerald:
      'bg-gradient-to-r from-[#00E676] to-[#00B159] hover:from-[#00C865] hover:to-[#00964A] text-black font-black shadow-neon-green hover:-translate-y-0.5',
    secondary:
      'bg-[#FF5500]/15 hover:bg-[#FF5500]/25 text-[#FF8A00] border border-[#FF5500]/30 font-bold',
    outline:
      'border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white',
    ghost:
      'text-slate-400 hover:text-white hover:bg-white/[0.06]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30',
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
