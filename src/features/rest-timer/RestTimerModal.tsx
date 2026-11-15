import React from 'react';
import { createPortal } from 'react-dom';
import { Timer, FastForward, Plus, Minus } from 'lucide-react';
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
      <div className="relative z-10 w-full max-w-sm bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full">
          <Timer className="w-4 h-4 animate-spin text-orange-500" />
          <span>THỜI GIAN NGHỈ NGƠI</span>
        </div>

        {/* Large Time Display */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-7xl font-black text-orange-500 tracking-tight drop-shadow-sm">
            {timeStr}
          </span>
          <span className="text-xs text-slate-500 mt-1 font-medium">
            Hít thở sâu, thả lỏng cơ vai và tay sau
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <ProgressBar value={percent} color="orange" height="sm" />
        </div>

        {/* Adjust Buttons */}
        <div className="flex items-center gap-3">
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
          className="h-13"
        >
          Sẵn sàng! Vào hiệp tiếp theo
        </Button>
      </div>
    </div>,
    document.body
  );
}
export default RestTimerModal;
