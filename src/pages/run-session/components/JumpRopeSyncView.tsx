import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Activity, Flame, Clock, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { getJumpRopePlan } from '@/entities/program/jumpRopePlan';

interface JumpRopeSyncViewProps {
  dayNumber: number;
  targetDistanceKm?: number;
  suggestedJumps?: number;
  suggestedMinutes?: number;
  onComplete: (jumps: number, durationMinutes: number, notes?: string) => void;
}

export function JumpRopeSyncView({
  dayNumber,
  targetDistanceKm = 3.5,
  suggestedJumps = 1100,
  suggestedMinutes = 20,
  onComplete,
}: JumpRopeSyncViewProps) {
  const plan = getJumpRopePlan(dayNumber, targetDistanceKm, suggestedMinutes);
  const [jumps, setJumps] = useState<number>(suggestedJumps || plan.totalTargetJumps);
  const [minutes, setMinutes] = useState<number>(suggestedMinutes || plan.totalDurationMinutes);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const adjustJumps = (delta: number) => {
    setJumps((prev) => Math.max(50, prev + delta));
  };

  const adjustMinutes = (delta: number) => {
    setMinutes((prev) => Math.max(1, prev + delta));
  };

  const estRpm = minutes > 0 ? Math.round(jumps / minutes) : 0;
  const estCalories = Math.round(minutes * 11.5); // ~11.5 kcal/min moderate jump rope

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jumps <= 0) return;
    setIsSubmitted(true);
    setTimeout(() => {
      onComplete(jumps, minutes, notes);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-5 text-slate-100 max-w-xl mx-auto">
      {/* Target Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1E2E] via-[#0A131F] to-[#080C14] border border-[#00E5FF]/30 p-5 sm:p-6 shadow-neon-cyan/15">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00E5FF] block">
                Cardio Ngày {dayNumber} • {plan.intensityLabel}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white font-display">
                Mục tiêu Nhảy dây: ~{plan.totalTargetJumps.toLocaleString('vi-VN')} cái
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
            ~{targetDistanceKm} km chạy
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {plan.summary}. Tự đếm theo đồng hồ ngoài, sau đó xác nhận kết quả bên dưới để ghi nhận vào lộ trình 100 ngày.
        </p>

        {/* Planned Sets Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-white/10 font-mono text-[11px]">
          {plan.sets.map((s) => (
            <div key={s.setNumber} className="bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="text-[#00E5FF] font-bold">{s.label}:</span>
              <span className="text-white font-bold">{s.targetReps} cái</span>
            </div>
          ))}
        </div>

        {/* Quick Stats Preview */}
        <div className="grid grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-white/10 font-mono text-center">
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Nhịp độ</span>
            <span className="text-xs sm:text-sm font-bold text-[#00E5FF]">{estRpm} cái/p</span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Tiêu hao</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> ~{estCalories} kcal
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Vùng tim</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400">{plan.heartRateZone.split('(')[0]}</span>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-3xl bg-black/40 border border-white/10 flex flex-col gap-4">
        {/* Jump Count Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" /> Tổng số cái đã nhảy:
            </label>
            <span className="text-xs font-mono font-bold text-[#00E5FF]">{jumps.toLocaleString('vi-VN')} cái</span>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => adjustJumps(-100)} className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white font-mono text-xs font-bold border border-white/10">-100</button>
            <button type="button" onClick={() => adjustJumps(-50)} className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white font-mono text-xs font-bold border border-white/10">-50</button>
            <input
              type="number"
              min={1}
              step={10}
              value={jumps}
              onChange={(e) => setJumps(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 bg-black/60 border border-white/20 rounded-2xl px-3 py-2 text-center text-xl font-mono font-black text-white focus:outline-none focus:border-[#00E5FF]"
            />
            <button type="button" onClick={() => adjustJumps(+50)} className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white font-mono text-xs font-bold border border-white/10">+50</button>
            <button type="button" onClick={() => adjustJumps(+100)} className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white font-mono text-xs font-bold border border-white/10">+100</button>
          </div>
        </div>

        {/* Minutes Input */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Thời gian tập luyện (Phút):
            </label>
            <span className="text-xs font-mono font-bold text-amber-400">{minutes} phút</span>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => adjustMinutes(-5)} className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white font-mono text-xs font-bold border border-white/10">-5p</button>
            <input
              type="number"
              min={1}
              max={180}
              value={minutes}
              onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 bg-black/60 border border-white/20 rounded-2xl px-3 py-2 text-center text-lg font-mono font-black text-white focus:outline-none focus:border-amber-400"
            />
            <button type="button" onClick={() => adjustMinutes(+5)} className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white font-mono text-xs font-bold border border-white/10">+5p</button>
            <button type="button" onClick={() => { setJumps(suggestedJumps); setMinutes(suggestedMinutes); }} className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" title="Đặt lại gợi ý">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Optional Notes */}
        <div className="pt-2 border-t border-white/10">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú buổi nhảy dây (VD: 5 hiệp x 220 cái, cảm giác bắp chuối căng nhẹ...)"
            className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        {/* Submit Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
          disabled={isSubmitted || jumps <= 0}
          leftIcon={<CheckCircle2 className="w-5 h-5 text-emerald-300" />}
          className="mt-1 font-display uppercase tracking-wider font-bold shadow-neon-orange"
        >
          {isSubmitted ? 'Đang ghi nhận...' : 'Đánh dấu hoàn thành buổi Nhảy Dây'}
        </Button>
      </form>
    </div>
  );
}
