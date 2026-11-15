import React from 'react';
import { Clock, Activity, Dumbbell, Footprints, HeartPulse, Info, ChevronRight } from 'lucide-react';
import { DayProgram } from '@/entities/program/types';
import { ResolvedExerciseItem, Exercise } from '@/entities/exercise/types';

interface DailyPlanBlocksProps {
  programDay: DayProgram;
  warmupResolved: ResolvedExerciseItem[];
  mainResolved: ResolvedExerciseItem[];
  accessoryResolved: ResolvedExerciseItem[];
  onOpenWarmupModal: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export function DailyPlanBlocks({
  programDay,
  warmupResolved,
  mainResolved,
  accessoryResolved,
  onOpenWarmupModal,
  onSelectExercise,
}: DailyPlanBlocksProps) {
  const isPush = programDay.type === 'push';
  const isRun = programDay.type === 'run';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 text-xs" data-purpose="workout-sequence-blocks">
      {/* Block 1: Warmup - Fully interactive */}
      <div className="p-4 rounded-2xl bg-[#141A28]/80 border border-white/[0.06] hover:border-white/15 transition-all flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onOpenWarmupModal}
          className="w-full flex items-center justify-between text-[11px] font-bold border-b border-white/[0.08] pb-2 hover:text-[#FF8A00] transition-colors text-left group cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-slate-200 group-hover:text-[#FF8A00]">
            <Clock className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span>1. Khởi động</span>
            <span className="text-[10px] font-semibold text-[#FF8A00] bg-[#FF5500]/15 border border-[#FF5500]/30 px-1.5 py-0.2 rounded ml-1">
              Bấm xem
            </span>
          </span>
          <span className="font-mono text-slate-400 group-hover:text-[#FF8A00] flex items-center gap-0.5">
            5 phút <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>

        <div className="flex flex-col gap-1">
          {warmupResolved.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectExercise(item.exercise)}
              className="w-full flex justify-between items-center text-slate-300 font-medium py-1 px-1.5 rounded-xl hover:bg-white/[0.06] hover:text-white transition-all text-left cursor-pointer group"
              title="Bấm để xem chi tiết bài tập & kỹ thuật"
            >
              <span className="truncate pr-2 flex items-center gap-1 group-hover:underline">
                <Info className="w-3 h-3 text-slate-400 group-hover:text-[#FF8A00] shrink-0" />
                {item.exercise.name.split('(')[0]}
              </span>
              <span className="text-slate-400 group-hover:text-[#FF8A00] font-mono text-[11px] shrink-0 font-bold">
                {item.targetSets}x{item.targetReps}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Block 2: Main workout - Dynamic color based on Push (Orange), Run (Cyan), Recovery (Emerald) */}
      <div
        className={`rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm border ${
          isPush
            ? 'bg-[#181D2D]/90 border-[#FF5500]/40 shadow-neon-orange/20'
            : isRun
            ? 'bg-[#102030]/90 border-[#00E5FF]/40 shadow-neon-cyan/20'
            : 'bg-[#102520]/90 border-[#00E676]/40 shadow-neon-green/20'
        }`}
      >
        <div
          className={`flex items-center justify-between text-[11px] font-bold border-b pb-2 ${
            isPush
              ? 'border-[#FF5500]/25 text-[#FF8A00]'
              : isRun
              ? 'border-[#00E5FF]/25 text-[#00E5FF]'
              : 'border-[#00E676]/25 text-[#00E676]'
          }`}
        >
          <span className="flex items-center gap-1.5 font-display font-bold tracking-wide uppercase">
            {isPush ? (
              <Activity className="w-3.5 h-3.5 text-[#FF5500]" />
            ) : isRun ? (
              <Footprints className="w-3.5 h-3.5 text-[#00E5FF]" />
            ) : (
              <HeartPulse className="w-3.5 h-3.5 text-[#00E676]" />
            )}
            2. Bài tập chính
          </span>
          <span className="font-mono">
            {isPush ? '25 phút' : isRun ? `${programDay.runDetails?.durationMinutesTarget || 30} phút` : '30 phút'}
          </span>
        </div>

        {isPush ? (
          mainResolved.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectExercise(item.exercise)}
              className="flex flex-col gap-1 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="flex justify-between items-center">
                <span className="text-white font-bold flex items-center gap-1">
                  <Info className="w-3 h-3 text-[#FF8A00]" />
                  {item.exercise.name.split('(')[0]}
                </span>
                <span className="font-mono font-black text-[#FF8A00] text-sm">
                  {item.targetSets} hiệp
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#FF8A00] font-bold bg-[#FF5500]/15 px-2 py-0.5 rounded border border-[#FF5500]/30 self-start">
                Mục tiêu: {item.targetReps}
              </span>
            </div>
          ))
        ) : programDay.runDetails ? (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center font-black text-[#00E5FF] font-mono text-sm">
              <span>{programDay.runDetails.durationMinutesTarget} phút</span>
              {programDay.runDetails.distanceKmTarget && (
                <span>~{programDay.runDetails.distanceKmTarget} km</span>
              )}
            </div>
            <span className="text-[11px] text-slate-300 font-medium leading-relaxed">
              {programDay.runDetails.paceGuidance}
            </span>
          </div>
        ) : (
          <span className="text-slate-300 font-medium">Thực hiện giãn cơ và giải tỏa căng cứng khớp toàn thân.</span>
        )}
      </div>

      {/* Block 3: Accessory */}
      <div className="p-4 rounded-2xl bg-[#141A28]/80 border border-white/[0.06] hover:border-white/15 transition-all flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-slate-300 text-[11px] font-bold border-b border-white/[0.08] pb-2">
          <span className="flex items-center gap-1.5 text-slate-200">
            <Dumbbell className="w-3.5 h-3.5 text-[#FF8A00]" /> 3. Bổ trợ & Giãn cơ
          </span>
          <span className="font-mono text-slate-400">10 phút</span>
        </div>
        <div className="flex flex-col gap-1">
          {accessoryResolved.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectExercise(item.exercise)}
              className="w-full flex justify-between items-center text-slate-300 font-medium py-1 px-1.5 rounded-xl hover:bg-white/[0.06] hover:text-white transition-all text-left cursor-pointer group"
              title="Bấm để xem chi tiết bài tập & kỹ thuật"
            >
              <span className="truncate pr-1 flex items-center gap-1 group-hover:underline">
                <Info className="w-3 h-3 text-slate-400 group-hover:text-[#FF8A00] shrink-0" />
                {item.exercise.name.split('(')[0]}
                {item.isFallback && (
                  <span className="text-[9px] text-[#FF8A00] bg-[#FF5500]/15 px-1 py-0.2 rounded font-bold border border-[#FF5500]/30">
                    BW
                  </span>
                )}
              </span>
              <span className="text-slate-400 group-hover:text-[#FF8A00] font-mono text-[11px] shrink-0 font-bold">
                {item.targetSets}x{item.targetReps}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default DailyPlanBlocks;
