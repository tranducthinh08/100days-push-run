import React from 'react';
import { RunDetails } from '@/entities/program/types';
import { Activity, Gauge, Heart } from 'lucide-react';

interface RunSplitsPlanBlockProps {
  runDetails: RunDetails;
}

export function RunSplitsPlanBlock({ runDetails }: RunSplitsPlanBlockProps) {
  const splits = runDetails.splits || [];

  return (
    <div className="flex flex-col gap-2">
      {/* Target headline and distance */}
      <div className="flex justify-between items-center">
        <div className="flex items-baseline gap-1.5">
          <span className="font-black text-[#00E5FF] font-mono text-base">
            {runDetails.durationMinutesTarget} phút
          </span>
          {runDetails.distanceKmTarget && (
            <span className="text-xs font-mono font-bold text-white">
              ~{runDetails.distanceKmTarget} km
            </span>
          )}
        </div>
        {runDetails.splitsSummary && (
          <span className="text-[10px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/15 px-2 py-0.5 rounded border border-[#00E5FF]/30">
            {runDetails.splitsSummary}
          </span>
        )}
      </div>

      {/* Pace and Biometric Target Badges */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
        <span className="bg-white/[0.05] text-slate-300 px-2 py-0.5 rounded flex items-center gap-1 border border-white/[0.06]">
          <Activity className="w-3 h-3 text-[#00E5FF]" />
          {runDetails.paceGuidance.split('(')[0]}
        </span>
        {runDetails.heartRateZone && (
          <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-0.5 rounded flex items-center gap-1 border border-[#00E5FF]/20">
            <Heart className="w-3 h-3" />
            {runDetails.heartRateZone}
          </span>
        )}
        {runDetails.cadenceGuidance && (
          <span className="bg-white/[0.05] text-slate-400 px-2 py-0.5 rounded flex items-center gap-1 border border-white/[0.06]">
            <Gauge className="w-3 h-3 text-cyan-400" />
            {runDetails.cadenceGuidance}
          </span>
        )}
      </div>

      {/* Structured Reps / Splits List */}
      {splits.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-1 max-h-[175px] overflow-y-auto pr-1">
          {splits.map((split) => (
            <div
              key={split.setNumber}
              className="flex justify-between items-center bg-white/[0.03] hover:bg-white/[0.06] p-2 rounded-xl border border-white/[0.06] text-xs transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono font-black text-[#00E5FF] text-[10px] bg-[#00E5FF]/15 px-1.5 py-0.5 rounded shrink-0 border border-[#00E5FF]/30">
                  {split.label}
                </span>
                <span className="text-white font-medium truncate text-[11px]">
                  {split.work}
                </span>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-slate-300 font-mono text-[10px] block font-semibold">
                  {split.pace}
                </span>
                <span className="text-cyan-400/90 font-mono text-[9px]">
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
