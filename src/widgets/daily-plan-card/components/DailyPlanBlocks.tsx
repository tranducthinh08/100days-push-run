import React from 'react';
import { Activity, Dumbbell, Footprints, HeartPulse, Info, Zap } from 'lucide-react';
import { DayProgram } from '@/entities/program/types';
import { ResolvedExerciseItem, Exercise } from '@/entities/exercise/types';
import { getJumpRopePlan } from '@/entities/program/jumpRopePlan';
import { RunSplitsPlanBlock } from './RunSplitsPlanBlock';
import { JumpRopePlanBlock } from './JumpRopePlanBlock';
import { AuxiliaryWorkoutBlocks } from './AuxiliaryWorkoutBlocks';

interface DailyPlanBlocksProps {
  programDay: DayProgram;
  warmupResolved: ResolvedExerciseItem[];
  mainResolved: ResolvedExerciseItem[];
  accessoryResolved: ResolvedExerciseItem[];
  cardioMode?: 'run' | 'jumprope';
  onToggleCardioMode?: (mode: 'run' | 'jumprope') => void;
  onOpenWarmupModal: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onOpenRunSplitsModal?: () => void;
}

export function DailyPlanBlocks({
  programDay,
  warmupResolved,
  mainResolved,
  accessoryResolved,
  cardioMode = 'run',
  onToggleCardioMode,
  onOpenWarmupModal,
  onSelectExercise,
  onOpenRunSplitsModal,
}: DailyPlanBlocksProps) {
  const isPush = programDay.type === 'push';
  const isRun = programDay.type === 'run';

  const jumpRopePlan = isRun
    ? getJumpRopePlan(
        programDay.dayNumber,
        programDay.runDetails?.distanceKmTarget || 3.5,
        programDay.runDetails?.durationMinutesTarget || 25
      )
    : null;

  return (
    <div className="flex flex-col gap-4 relative z-10 text-xs" data-purpose="workout-sequence-blocks">
      {/* Block 2: BÀI TẬP CHÍNH */}
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
          className={`flex flex-wrap items-center justify-between gap-2 text-xs font-bold border-b pb-3 ${
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
              cardioMode === 'jumprope' ? (
                <Zap className="w-4 h-4 text-[#00E5FF]" />
              ) : (
                <Footprints className="w-4 h-4 text-[#00E5FF]" />
              )
            ) : (
              <HeartPulse className="w-4 h-4 text-[#00E676]" />
            )}
            2. Bài tập chính ({isRun ? (cardioMode === 'jumprope' ? 'Giáo án Nhảy Dây' : 'Lộ trình chạy bộ') : isPush ? 'Khối lượng hít đất' : 'Phục hồi'})
          </span>

          {/* Toggle between Run and Jump Rope on Run Days */}
          {isRun && onToggleCardioMode && jumpRopePlan && (
            <div className="flex items-center gap-1 p-1 bg-black/50 rounded-xl border border-white/10 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => onToggleCardioMode('run')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  cardioMode === 'run'
                    ? 'bg-[#00E5FF] text-black shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chạy bộ
              </button>
              <button
                type="button"
                onClick={() => onToggleCardioMode('jumprope')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  cardioMode === 'jumprope'
                    ? 'bg-[#00E5FF] text-black shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Nhảy dây ({jumpRopePlan.totalTargetJumps.toLocaleString('vi-VN')} cái)
              </button>
            </div>
          )}

          {!isRun && (
            <span className="font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
              {isPush ? '25 phút' : '30 phút'}
            </span>
          )}
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
        ) : isRun ? (
          cardioMode === 'jumprope' && jumpRopePlan ? (
            <JumpRopePlanBlock plan={jumpRopePlan} onOpenQuickLog={onOpenRunSplitsModal} />
          ) : programDay.runDetails ? (
            <RunSplitsPlanBlock runDetails={programDay.runDetails} onOpenExpandModal={onOpenRunSplitsModal} />
          ) : null
        ) : (
          <span className="text-slate-300 font-medium">Thực hiện giãn cơ và giải tỏa căng cứng khớp toàn thân.</span>
        )}
      </div>

      {/* Auxiliary blocks: Warmup (1) & Accessory (3) */}
      <AuxiliaryWorkoutBlocks
        warmupResolved={warmupResolved}
        accessoryResolved={accessoryResolved}
        onOpenWarmupModal={onOpenWarmupModal}
        onSelectExercise={onSelectExercise}
      />
    </div>
  );
}
export default DailyPlanBlocks;
