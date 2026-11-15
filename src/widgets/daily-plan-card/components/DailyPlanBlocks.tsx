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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 text-xs">
      {/* Block 1: Warmup - Fully interactive */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 flex flex-col gap-2.5 transition-all hover:border-orange-300 shadow-2xs">
        <button
          type="button"
          onClick={onOpenWarmupModal}
          className="w-full flex items-center justify-between text-[11px] font-bold border-b border-slate-200/80 pb-2 hover:text-orange-600 transition-colors text-left group"
        >
          <span className="flex items-center gap-1.5 text-slate-800 group-hover:text-orange-600">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>1. Khởi động</span>
            <span className="text-[10px] font-semibold text-orange-600 bg-orange-100/80 px-1.5 py-0.2 rounded-md ml-1">
              Bấm xem
            </span>
          </span>
          <span className="font-mono text-slate-400 group-hover:text-orange-600 flex items-center gap-0.5">
            5 phút <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>

        <div className="flex flex-col gap-1">
          {warmupResolved.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectExercise(item.exercise)}
              className="w-full flex justify-between items-center text-slate-700 font-medium py-1 px-1.5 rounded-xl hover:bg-orange-50/90 hover:text-orange-700 transition-all text-left cursor-pointer group"
              title="Bấm để xem chi tiết bài tập & kỹ thuật"
            >
              <span className="truncate pr-2 flex items-center gap-1 group-hover:underline">
                <Info className="w-3 h-3 text-slate-400 group-hover:text-orange-500 shrink-0" />
                {item.exercise.name.split('(')[0]}
              </span>
              <span className="text-slate-500 group-hover:text-orange-600 font-mono text-[11px] shrink-0 font-bold">
                {item.targetSets}x{item.targetReps}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Block 2: Main workout - Dynamic color based on Push (Orange), Run (Blue), Recovery (Emerald) */}
      <div
        className={`rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm border-2 ${
          isPush
            ? 'bg-orange-50/70 border-orange-200/90'
            : isRun
            ? 'bg-blue-50/70 border-blue-200/90'
            : 'bg-emerald-50/70 border-emerald-200/90'
        }`}
      >
        <div
          className={`flex items-center justify-between text-[11px] font-bold border-b pb-2 ${
            isPush
              ? 'border-orange-200/70 text-orange-700'
              : isRun
              ? 'border-blue-200/70 text-blue-700'
              : 'border-emerald-200/70 text-emerald-700'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {isPush ? (
              <Activity className="w-3.5 h-3.5 text-orange-600" />
            ) : isRun ? (
              <Footprints className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
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
              className="flex flex-col gap-1 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="flex justify-between items-center">
                <span className="text-slate-900 font-bold flex items-center gap-1">
                  <Info className="w-3 h-3 text-orange-500" />
                  {item.exercise.name.split('(')[0]}
                </span>
                <span className="font-mono font-black text-orange-600 text-sm">
                  {item.targetSets} hiệp
                </span>
              </div>
              <span className="text-[11px] font-mono text-orange-700 font-bold bg-white px-2 py-0.5 rounded-md border border-orange-200 self-start shadow-2xs">
                Mục tiêu: {item.targetReps}
              </span>
            </div>
          ))
        ) : programDay.runDetails ? (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center font-black text-blue-600 font-mono text-sm">
              <span>{programDay.runDetails.durationMinutesTarget} phút</span>
              {programDay.runDetails.distanceKmTarget && (
                <span>~{programDay.runDetails.distanceKmTarget} km</span>
              )}
            </div>
            <span className="text-[11px] text-slate-700 font-medium leading-relaxed">
              {programDay.runDetails.paceGuidance}
            </span>
          </div>
        ) : (
          <span className="text-slate-700 font-medium">Thực hiện giãn cơ và giải tỏa căng cứng khớp.</span>
        )}
      </div>

      {/* Block 3: Accessory */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 flex flex-col gap-2.5 transition-all hover:border-slate-300 shadow-2xs">
        <div className="flex items-center justify-between text-slate-600 text-[11px] font-bold border-b border-slate-200/80 pb-2">
          <span className="flex items-center gap-1.5 text-slate-800">
            <Dumbbell className="w-3.5 h-3.5 text-orange-500" /> 3. Bổ trợ & Giãn cơ
          </span>
          <span className="font-mono text-slate-400">10 phút</span>
        </div>
        <div className="flex flex-col gap-1">
          {accessoryResolved.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectExercise(item.exercise)}
              className="w-full flex justify-between items-center text-slate-700 font-medium py-1 px-1.5 rounded-xl hover:bg-orange-50/90 hover:text-orange-700 transition-all text-left cursor-pointer group"
              title="Bấm để xem chi tiết bài tập & kỹ thuật"
            >
              <span className="truncate pr-1 flex items-center gap-1 group-hover:underline">
                <Info className="w-3 h-3 text-slate-400 group-hover:text-orange-500 shrink-0" />
                {item.exercise.name.split('(')[0]}
                {item.isFallback && (
                  <span className="text-[9px] text-orange-600 bg-orange-100 px-1 py-0.2 rounded font-bold">
                    BW
                  </span>
                )}
              </span>
              <span className="text-slate-500 group-hover:text-orange-600 font-mono text-[11px] shrink-0 font-bold">
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
