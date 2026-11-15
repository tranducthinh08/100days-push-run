import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: 'emerald' | 'orange' | 'gradient';
  height?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  color = 'orange',
  height = 'md',
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const fillColors = {
    orange: 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm shadow-orange-500/30',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/30',
    gradient: 'bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500',
  };

  return (
    <div
      className={twMerge(
        'w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80',
        heightStyles[height],
        className
      )}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-500 ease-out',
          fillColors[color]
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
export default ProgressBar;
