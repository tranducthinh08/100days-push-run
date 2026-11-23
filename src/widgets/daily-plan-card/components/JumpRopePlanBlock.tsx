import React from 'react';
import { Activity, Flame, Clock, Gauge, Heart, Sparkles } from 'lucide-react';
import { JumpRopeWorkoutPlan } from '@/entities/program/jumpRopePlan';

interface JumpRopePlanBlockProps {
  plan: JumpRopeWorkoutPlan;
  onOpenQuickLog?: () => void;
}

export function JumpRopePlanBlock({ plan, onOpenQuickLog }: JumpRopePlanBlockProps) {
  const estCalories = Math.round(plan.totalDurationMinutes * 11.5);

  return (
    <div className="flex flex-col gap-3.5">
      {/* Top Metric Header */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-black text-[#00E5FF] font-mono text-xl sm:text-2xl">
            ~{plan.totalTargetJumps.toLocaleString('vi-VN')} cái
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-white bg-white/[0.06] px-2 py-0.5 rounded-lg border border-white/[0.08]">
            {plan.totalDurationMinutes} phút
          </span>
          <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            {plan.sets.length} hiệp
          </span>
        </div>

        {onOpenQuickLog && (
          <button
            type="button"
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] font-mono text-[11px] font-bold transition-all cursor-pointer shadow-neon-cyan/20 active:scale-95 ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vào buổi tập</span>
          </button>
        )}
      </div>

      {/* Target Badges */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <span className="bg-white/[0.04] text-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-white/[0.08]">
          <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>{plan.intensityLabel}</span>
        </span>
        <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-[#00E5FF]/25 font-bold">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>{plan.heartRateZone}</span>
        </span>
        <span className="bg-white/[0.04] text-slate-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-white/[0.08]">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span>{plan.cadenceGuidance}</span>
        </span>
        <span className="bg-white/[0.04] text-amber-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-white/[0.08]">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>~{estCalories} kcal</span>
        </span>
      </div>

      {/* Sets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-1">
        {plan.sets.map((set) => (
          <div
            key={set.setNumber}
            className="bg-[#141D2D]/90 hover:bg-[#182338] p-3 rounded-2xl border border-white/[0.08] hover:border-[#00E5FF]/40 flex flex-col justify-between gap-2 text-xs transition-all shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono font-black text-[#00E5FF] text-[10px] bg-[#00E5FF]/15 px-2 py-0.5 rounded-md border border-[#00E5FF]/30 shrink-0">
                {set.label}
              </span>
              <span className="text-white font-extrabold text-sm font-mono text-right">
                {set.targetReps} cái
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-cyan-200 font-bold text-xs">{set.technique}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{set.cues}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/[0.06] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                ~{Math.round(set.targetReps / 2)}s
              </span>
              <span className="text-[#00E5FF] font-semibold text-[10px]">
                {set.restSeconds > 0 ? `Nghỉ ${set.restSeconds}s` : 'Về đích!'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default JumpRopePlanBlock;
