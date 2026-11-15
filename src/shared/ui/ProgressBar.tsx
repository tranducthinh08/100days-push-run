import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: 'emerald' | 'orange' | 'cyan' | 'gradient';
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
    orange: 'bg-[#FF5500] shadow-neon-orange',
    cyan: 'bg-[#00E5FF] shadow-neon-cyan',
    emerald: 'bg-[#00E676] shadow-neon-green',
    gradient: 'bg-gradient-to-r from-[#FF5500] via-[#FF8A00] to-[#00E676]',
  };

  return (
    <div
      className={twMerge(
        'w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/[0.06]',
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
