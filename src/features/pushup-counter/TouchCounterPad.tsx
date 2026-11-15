import React, { useEffect, useRef } from 'react';
import { Minus, Plus, Target, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { Button } from '@/shared/ui/Button';

interface TouchCounterPadProps {
  count: number;
  targetReps: number;
  currentSetIndex: number;
  totalSets: number;
  isPressed: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onCompleteSet: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}

export function TouchCounterPad({
  count,
  targetReps,
  currentSetIndex,
  totalSets,
  isPressed,
  onIncrement,
  onDecrement,
  onCompleteSet,
  onTouchStart,
  onTouchEnd,
}: TouchCounterPadProps) {
  const isGoalReached = targetReps > 0 && count >= targetReps;
  const numberRef = useRef<HTMLSpanElement>(null);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (numberRef.current && count > prevCountRef.current) {
      gsap.fromTo(
        numberRef.current,
        { scale: 1.25, color: '#c2410c' },
        { scale: 1, color: '#f97316', duration: 0.28, ease: 'back.out(2.5)' }
      );
    }
    prevCountRef.current = count;
  }, [count]);

  return (
    <div className="flex flex-col flex-1 w-full gap-3.5 select-none">
      {/* Set status and sub-header */}
      <div className="flex items-center justify-between px-2 text-xs font-semibold">
        <span className="text-slate-600">
          Hiệp <span className="text-orange-600 font-bold">{currentSetIndex + 1}</span> / {totalSets}
        </span>
        <div className="flex items-center gap-1.5 text-slate-700">
          <Target className="w-3.5 h-3.5 text-orange-500" />
          <span>Mục tiêu: <strong className="text-orange-600 font-mono text-sm">{targetReps}</strong> cái</span>
        </div>
      </div>

      {/* Giant Touch Pad Area (>60% of viewport available) */}
      <div
        role="button"
        tabIndex={0}
        onTouchStart={(e) => {
          e.preventDefault();
          onTouchStart();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onTouchEnd();
        }}
        onClick={() => {
          if (!('ontouchstart' in window)) {
            onIncrement();
          }
        }}
        className={`relative flex-1 min-h-[320px] sm:min-h-[400px] rounded-3xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-100 overflow-hidden shadow-xl ${
          isPressed
            ? 'bg-orange-100/80 border-orange-500 scale-[0.98]'
            : isGoalReached
            ? 'bg-gradient-to-b from-orange-50 to-white border-orange-500/80 shadow-orange-500/15'
            : 'bg-gradient-to-b from-white via-orange-50/20 to-orange-50/30 border-slate-200/90 hover:border-orange-300'
        }`}
      >
        {/* Visual Pulse ring */}
        <div
          className={`absolute inset-0 bg-orange-500/10 pointer-events-none transition-opacity duration-150 ${
            isPressed ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Reps Counter */}
        <div className="flex flex-col items-center z-10">
          <span
            ref={numberRef}
            className="font-mono text-8xl sm:text-9xl font-black text-orange-500 tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(249,115,22,0.25)] origin-center inline-block"
          >
            {count}
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-3 font-condensed">
            HÍT ĐẤT &bull; PUSH-UPS
          </span>
        </div>

        {/* Touch instruction cue */}
        <div className="absolute bottom-5 inset-x-0 text-center pointer-events-none z-10">
          <span className="text-[11px] text-slate-700 bg-white/95 px-4 py-1.5 rounded-full border border-slate-200 shadow-md backdrop-blur-md font-medium">
            👇 Chạm ngực/mũi vào màn hình hoặc bấm phím Space
          </span>
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-2.5 pt-1">
        <Button
          variant="outline"
          size="lg"
          onClick={onDecrement}
          disabled={count === 0}
          leftIcon={<Minus className="w-5 h-5" />}
          className="w-16 shrink-0"
        >
          <span className="sr-only">Giảm</span>
        </Button>

        <Button
          variant={isGoalReached ? 'primary' : 'outline'}
          size="lg"
          fullWidth
          onClick={onCompleteSet}
          leftIcon={<CheckCircle className="w-5 h-5" />}
          className="h-13 font-bold"
        >
          {isGoalReached ? `Đã xong ${count} cái! Vào nghỉ ngơi` : `Hoàn thành hiệp (${count} cái)`}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onIncrement}
          leftIcon={<Plus className="w-5 h-5" />}
          className="w-16 shrink-0"
        >
          <span className="sr-only">Tăng</span>
        </Button>
      </div>
    </div>
  );
}
export default TouchCounterPad;
