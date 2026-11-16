import React from 'react';
import { RunDetails } from '@/entities/program/types';
import { Activity, Gauge, Heart, Maximize2 } from 'lucide-react';

interface RunSplitsPlanBlockProps {
  runDetails: RunDetails;
  onOpenExpandModal?: () => void;
}

export function RunSplitsPlanBlock({ runDetails, onOpenExpandModal }: RunSplitsPlanBlockProps) {
  const splits = runDetails.splits || [];

  return (
    <div className="flex flex-col gap-3">
      {/* Target headline and distance */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-black text-[#00E5FF] font-mono text-xl sm:text-2xl">
            {runDetails.durationMinutesTarget} phút
          </span>
          {runDetails.distanceKmTarget && (
            <span className="text-sm font-mono font-bold text-white bg-white/[0.06] px-2 py-0.5 rounded-lg border border-white/[0.08]">
              ~{runDetails.distanceKmTarget} km
            </span>
          )}
          {runDetails.splitsSummary && (
            <span className="text-[11px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/15 px-2.5 py-1 rounded-lg border border-[#00E5FF]/30">
              {runDetails.splitsSummary}
            </span>
          )}
        </div>

        {onOpenExpandModal && (
          <button
            type="button"
            onClick={onOpenExpandModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] font-mono text-[11px] font-bold transition-all cursor-pointer shadow-neon-cyan/20 active:scale-95 ml-auto"
            title="Mở rộng xem toàn bộ giáo án chi tiết"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Phóng to chi tiết</span>
          </button>
        )}
      </div>

      {/* Pace and Biometric Target Badges */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <span className="bg-white/[0.04] text-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-white/[0.08]">
          <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>{runDetails.paceGuidance}</span>
        </span>
        {runDetails.heartRateZone && (
          <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-[#00E5FF]/25 font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>{runDetails.heartRateZone}</span>
          </span>
        )}
        {runDetails.cadenceGuidance && (
          <span className="bg-white/[0.04] text-slate-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-white/[0.08]">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>{runDetails.cadenceGuidance}</span>
          </span>
        )}
      </div>

      {/* Spacious Structured Reps / Splits Grid (No Truncation) */}
      {splits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-1">
          {splits.map((split) => (
            <div
              key={split.setNumber}
              className="bg-[#141D2D]/90 hover:bg-[#182338] p-3 rounded-2xl border border-white/[0.08] hover:border-[#00E5FF]/40 flex flex-col justify-between gap-2 text-xs transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono font-black text-[#00E5FF] text-[10px] bg-[#00E5FF]/15 px-2 py-0.5 rounded-md border border-[#00E5FF]/30 shrink-0">
                  {split.label}
                </span>
                <span className="text-white font-bold text-xs text-right leading-tight">
                  {split.work}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/[0.06] font-mono">
                <span className="text-slate-400 font-medium">
                  {split.pace}
                </span>
                <span className="text-[#00E5FF] font-semibold text-[10px]">
                  {split.rest}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default RunSplitsPlanBlock;
