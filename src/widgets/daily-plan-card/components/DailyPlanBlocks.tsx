import React from 'react';
import { Clock, Activity, Dumbbell, Footprints, HeartPulse, Info, ChevronRight } from 'lucide-react';
import { DayProgram } from '@/entities/program/types';
import { ResolvedExerciseItem, Exercise } from '@/entities/exercise/types';
import { RunSplitsPlanBlock } from './RunSplitsPlanBlock';

interface DailyPlanBlocksProps {
  programDay: DayProgram;
  warmupResolved: ResolvedExerciseItem[];
  mainResolved: ResolvedExerciseItem[];
  accessoryResolved: ResolvedExerciseItem[];
  onOpenWarmupModal: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onOpenRunSplitsModal?: () => void;
}

export function DailyPlanBlocks({
  programDay,
  warmupResolved,
  mainResolved,
  accessoryResolved,
  onOpenWarmupModal,
  onSelectExercise,
  onOpenRunSplitsModal,
}: DailyPlanBlocksProps) {
  const isPush = programDay.type === 'push';
  const isRun = programDay.type === 'run';

  return (
    <div className="flex flex-col gap-4 relative z-10 text-xs" data-purpose="workout-sequence-blocks">
      {/* Block 2: BÀI TẬP CHÍNH (HERO WORKOUT STATION - CHIẾM TRỌN CHIỀU NGANG RỘNG RÃI) */}
      <div
        className={`rounded-3xl p-5 sm:p-6 flex flex-col gap-3.5 shadow-sm border transition-all ${
          isPush
            ? 'bg-[#181D2D]/95 border-[#FF5500]/40 shadow-neon-orange/20'
            : isRun
            ? 'bg-[#102030]/95 border-[#00E5FF]/40 shadow-neon-cyan/20'
            : 'bg-[#102520]/95 border-[#00E676]/40 shadow-neon-green/20'
        }`}
      >
        <div
          className={`flex items-center justify-between text-xs font-bold border-b pb-3 ${
            isPush
              ? 'border-[#FF5500]/25 text-[#FF8A00]'
              : isRun
              ? 'border-[#00E5FF]/25 text-[#00E5FF]'
              : 'border-[#00E676]/25 text-[#00E676]'
          }`}
        >
          <span className="flex items-center gap-2 font-display font-black tracking-wider uppercase text-sm sm:text-base">
            {isPush ? (
              <Activity className="w-4 h-4 text-[#FF5500]" />
            ) : isRun ? (
              <Footprints className="w-4 h-4 text-[#00E5FF]" />
            ) : (
              <HeartPulse className="w-4 h-4 text-[#00E676]" />
            )}
            2. Bài tập chính ({isRun ? 'Lộ trình chạy bộ' : isPush ? 'Khối lượng hít đất' : 'Phục hồi'})
          </span>
          <span className="font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
            {isPush ? '25 phút' : isRun ? `${programDay.runDetails?.durationMinutesTarget || 30} phút` : '30 phút'}
          </span>
        </div>

        {isPush ? (
          mainResolved.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectExercise(item.exercise)}
              className="flex flex-col gap-3 cursor-pointer hover:opacity-95 transition-opacity"
            >
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/30 text-[#FF5500] flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-white font-extrabold text-sm sm:text-base flex items-center gap-1.5 font-display">
                      {item.exercise.name.split('(')[0]}
                      <Info className="w-3.5 h-3.5 text-[#FF8A00]" />
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">Bấm để xem video & kỹ thuật chuẩn</span>
                  </div>
                </div>
                <span className="font-mono font-black text-[#FF8A00] text-xs sm:text-sm bg-[#FF5500]/15 px-3 py-1 rounded-xl border border-[#FF5500]/30">
                  {item.targetSets} hiệp • Mục tiêu: {item.targetReps}
                </span>
              </div>

              {/* Push-up sets visual badges */}
              {programDay.pushupTargetRepsPerSet && programDay.pushupTargetRepsPerSet.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-1">
                  {programDay.pushupTargetRepsPerSet.map((reps, sIdx) => (
                    <div key={sIdx} className="bg-white/[0.04] p-2 rounded-xl border border-white/[0.06] text-center">
                      <span className="text-[10px] text-slate-400 font-mono block">Hiệp {sIdx + 1}</span>
                      <span className="text-sm font-black text-white font-mono">{reps} cái</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : programDay.runDetails ? (
          <RunSplitsPlanBlock
            runDetails={programDay.runDetails}
            onOpenExpandModal={onOpenRunSplitsModal}
          />
        ) : (
          <span className="text-slate-300 font-medium">Thực hiện giãn cơ và giải tỏa căng cứng khớp toàn thân.</span>
        )}
      </div>

      {/* Hàng phụ: Block 1 Khởi động (5p) & Block 3 Bổ trợ/Giãn cơ (10p) xếp song song */}
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
    </div>
  );
}
export default DailyPlanBlocks;
