import React from 'react';
import { Clock, Dumbbell, ChevronRight, Info } from 'lucide-react';
import { ResolvedExerciseItem, Exercise } from '@/entities/exercise/types';

interface AuxiliaryWorkoutBlocksProps {
  warmupResolved: ResolvedExerciseItem[];
  accessoryResolved: ResolvedExerciseItem[];
  onOpenWarmupModal: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export function AuxiliaryWorkoutBlocks({
  warmupResolved,
  accessoryResolved,
  onOpenWarmupModal,
  onSelectExercise,
}: AuxiliaryWorkoutBlocksProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {/* Block 1: Warmup */}
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
                <span className="truncate">{item.exercise.name.split('(')[0]}</span>
              </span>
              <span className="text-slate-400 group-hover:text-[#FF8A00] font-mono text-[11px] shrink-0 font-bold ml-1">
                {item.targetSets}x{item.targetReps}
              </span>
            </button>
          ))}
        </div>
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
              <span className="min-w-0 flex-1 truncate pr-2 flex items-center gap-1 group-hover:underline">
                <Info className="w-3 h-3 text-slate-400 group-hover:text-[#FF8A00] shrink-0" />
                <span className="truncate">{item.exercise.name.split('(')[0]}</span>
                {item.isFallback && (
                  <span className="text-[9px] text-[#FF8A00] bg-[#FF5500]/15 px-1 py-0.2 rounded font-bold border border-[#FF5500]/30 shrink-0 ml-1">
                    BW
                  </span>
                )}
              </span>
              <span className="text-slate-400 group-hover:text-[#FF8A00] font-mono text-[11px] shrink-0 font-bold ml-1">
                {item.targetSets}x{item.targetReps}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
