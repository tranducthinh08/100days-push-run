import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Timer, FastForward, Plus, Minus, Wind } from 'lucide-react';
import gsap from 'gsap';
import { Button } from '@/shared/ui/Button';
import { ProgressBar } from '@/shared/ui/ProgressBar';

interface RestTimerModalProps {
  isOpen: boolean;
  secondsRemaining: number;
  initialSeconds: number;
  onSkip: () => void;
  onAdjust: (delta: number) => void;
}

export function RestTimerModal({
  isOpen,
  secondsRemaining,
  initialSeconds,
  onSkip,
  onAdjust,
}: RestTimerModalProps) {
  const breathCircleRef = useRef<HTMLDivElement>(null);
  const [breathAction, setBreathAction] = useState<'inhale' | 'exhale'>('inhale');

  useEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      if (!breathCircleRef.current) return;

      gsap.fromTo(
        breathCircleRef.current,
        { scale: 0.85, opacity: 0.4 },
        {
          scale: 1.35,
          opacity: 0.9,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          onRepeat: () => {
            setBreathAction((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'));
          },
        }
      );
    });

    return () => ctx.revert();
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const percent = initialSeconds > 0 ? ((initialSeconds - secondsRemaining) / initialSeconds) * 100 : 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />

      {/* Timer Card */}
      <div className="relative z-10 w-full max-w-sm bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col items-center gap-5 shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full z-10">
          <Timer className="w-4 h-4 animate-spin text-orange-500" />
          <span>THỜI GIAN NGHỈ NGƠI</span>
        </div>

        {/* Large Time Display with GSAP Coherence Breathing Circle */}
        <div className="relative flex flex-col items-center justify-center py-2 z-10 w-full">
          <div
            ref={breathCircleRef}
            className="absolute w-36 h-36 rounded-full bg-orange-400/15 border border-orange-400/30 pointer-events-none -z-0"
          />

          <span className="font-mono text-7xl font-black text-orange-500 tracking-tight drop-shadow-sm z-10">
            {timeStr}
          </span>
          <span className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1 z-10">
            <Wind className="w-3.5 h-3.5 text-orange-500" />
            {breathAction === 'inhale' ? 'Hít vào chậm 4 giây' : 'Thở ra đều 4 giây'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full z-10">
          <ProgressBar value={percent} color="orange" height="sm" />
        </div>

        {/* Adjust Buttons */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => onAdjust(-15)}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" /> 15s
          </button>
          <button
            onClick={() => onAdjust(15)}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> 15s
          </button>
        </div>

        {/* Skip Rest CTA Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onSkip}
          rightIcon={<FastForward className="w-5 h-5" />}
          className="h-13 z-10"
        >
          Sẵn sàng! Vào hiệp tiếp theo
        </Button>
      </div>
    </div>,
    document.body
  );
}
export default RestTimerModal;
