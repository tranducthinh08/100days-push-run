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
        { scale: 0.85, opacity: 0.3 },
        {
          scale: 1.35,
          opacity: 0.85,
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      {/* Timer Card */}
      <div className="relative z-10 w-full max-w-sm bg-[#111622] border border-white/15 rounded-3xl p-6 flex flex-col items-center gap-5 shadow-glass-hud animate-in zoom-in-95 duration-150 overflow-hidden">
        {/* Laser Top Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF5500] to-transparent pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-bold text-[#FF8A00] bg-[#FF5500]/15 border border-[#FF5500]/30 px-3.5 py-1.5 rounded-full z-10 font-mono">
          <Timer className="w-4 h-4 animate-spin text-[#FF5500]" />
          <span>THỜI GIAN NGHỈ NGƠI</span>
        </div>

        {/* Large Time Display with GSAP Coherence Breathing Circle */}
        <div className="relative flex flex-col items-center justify-center py-2 z-10 w-full">
          <div
            ref={breathCircleRef}
            className="absolute w-36 h-36 rounded-full bg-[#FF5500]/15 border border-[#FF5500]/35 pointer-events-none -z-0"
          />

          <span className="font-mono text-7xl font-black text-[#FF5500] tracking-tight drop-shadow-[0_0_25px_rgba(255,85,0,0.5)] z-10">
            {timeStr}
          </span>
          <span className="text-xs font-bold text-slate-300 mt-1 flex items-center gap-1 z-10 font-display">
            <Wind className="w-3.5 h-3.5 text-[#FF8A00]" />
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
            className="flex items-center gap-1 bg-white/[0.06] hover:bg-white/10 text-slate-300 text-xs font-mono font-bold px-3.5 py-2 rounded-xl border border-white/10 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" /> 15s
          </button>
          <button
            onClick={() => onAdjust(15)}
            className="flex items-center gap-1 bg-white/[0.06] hover:bg-white/10 text-slate-300 text-xs font-mono font-bold px-3.5 py-2 rounded-xl border border-white/10 transition-colors cursor-pointer"
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
          className="h-13 z-10 font-display font-bold uppercase tracking-wide"
        >
          Sẵn sàng! Vào hiệp tiếp theo
        </Button>
      </div>
    </div>,
    document.body
  );
}
export default RestTimerModal;
