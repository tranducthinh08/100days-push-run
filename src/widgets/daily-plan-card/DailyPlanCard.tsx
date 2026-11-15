import React, { useState } from 'react';
import { RotateCcw, Footprints, Dumbbell, HeartPulse, Gauge, Target, CheckCircle2 } from 'lucide-react';
import { DayProgram } from '@/entities/program/types';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { resolveExercise } from '@/entities/exercise/model';
import { Exercise } from '@/entities/exercise/types';
import { DailyPlanBlocks } from './components/DailyPlanBlocks';
import { DailyTargetArcCard } from './components/DailyTargetArcCard';
import { WarmupGuideModal } from './components/WarmupGuideModal';
import { ExerciseDetailModal } from '@/pages/exercise-library/components/ExerciseDetailModal';

interface DailyPlanCardProps {
  programDay: DayProgram;
  onStartSession: (type: 'push' | 'run' | 'recovery') => void;
}

export function DailyPlanCard({ programDay, onStartSession }: DailyPlanCardProps) {
  const { equipmentMode, completedDays, markDayCompleted } = useUserProgress();
  const [isWarmupModalOpen, setIsWarmupModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const isCompleted = !!completedDays[programDay.dayNumber];
  const isPush = programDay.type === 'push';
  const isRun = programDay.type === 'run';

  const warmupResolved = programDay.warmupBlock.map((i) => resolveExercise(i, equipmentMode));
  const mainResolved = programDay.mainBlock.map((i) => resolveExercise(i, equipmentMode));
  const accessoryResolved = programDay.accessoryBlock.map((i) => resolveExercise(i, equipmentMode));

  const totalTargetReps = programDay.pushupTargetRepsPerSet
    ? programDay.pushupTargetRepsPerSet.reduce((a, b) => a + b, 0)
    : 38;

  const handleQuickToggleComplete = () => {
    markDayCompleted({
      dayNumber: programDay.dayNumber,
      completedAt: new Date().toISOString(),
      type: programDay.type,
      equipmentMode,
    });
  };

  return (
    <article className="rounded-3xl p-6 lg:p-7 bg-[#111622]/90 backdrop-blur-2xl border border-white/[0.1] shadow-glass-hud relative overflow-hidden animate-fade-in-up">
      {/* Laser Top Border Line */}
      <div
        className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent ${
          isPush ? 'via-[#FF5500]' : isRun ? 'via-[#00E5FF]' : 'via-[#00E676]'
        } to-transparent`}
      />
      <div
        className={`absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isPush ? 'bg-[#FF5500]/15' : isRun ? 'bg-[#00E5FF]/15' : 'bg-[#00E676]/15'
        }`}
      />

      {/* Top Banner Day Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-[#FF5500] text-white text-xs font-black tracking-widest uppercase shadow-neon-orange flex items-center gap-1.5 font-display">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            NGÀY {programDay.dayNumber} / 100
          </span>
          <span className="px-3 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-mono font-bold">
            {programDay.dayOfWeekVi} &bull; {isPush ? 'PUSH DAY' : isRun ? 'RUN DAY' : 'RECOVERY DAY'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-3 py-1 rounded-xl flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5" />
            CƯỜNG ĐỘ: NỀN TẢNG
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#00E676] bg-[#00E676]/15 border border-[#00E676]/30 px-3 py-1 rounded-xl font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" /> ĐÃ XONG
            </span>
          )}
        </div>
      </div>

      {/* Hero Headline */}
      <div className="relative z-10 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-display uppercase leading-tight">
          {programDay.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
          <span>{programDay.focus}</span>
        </p>
      </div>

      {/* Daily Target HUD Arc & Metric Showcase */}
      <DailyTargetArcCard
        programDay={programDay}
        isCompleted={isCompleted}
        isPush={isPush}
        isRun={isRun}
        totalTargetReps={totalTargetReps}
      />

      {/* 3 Step Visual Workout Sequence */}
      <DailyPlanBlocks
        programDay={programDay}
        warmupResolved={warmupResolved}
        mainResolved={mainResolved}
        accessoryResolved={accessoryResolved}
        onOpenWarmupModal={() => setIsWarmupModalOpen(true)}
        onSelectExercise={(ex) => setSelectedExercise(ex)}
      />

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-5 mt-5 border-t border-white/[0.08] relative z-10">
        <button
          onClick={() => onStartSession(programDay.type)}
          className={`flex-1 w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer font-display ${
            isPush
              ? 'bg-[#FF5500] hover:bg-[#E54D00] text-white shadow-neon-orange hover:shadow-orange-500/80 hover:scale-[1.01]'
              : isRun
              ? 'bg-[#00E5FF] hover:bg-[#00D0E8] text-black shadow-neon-cyan hover:scale-[1.01]'
              : 'bg-[#00E676] hover:bg-[#00D06B] text-black shadow-neon-green hover:scale-[1.01]'
          }`}
          type="button"
        >
          {isPush ? (
            <>
              <Dumbbell className="w-5 h-5" />
              <span>BẮT ĐẦU BUỔI TẬP (TOUCH-TO-COUNT) [CHẾ ĐỘ SÀN]</span>
            </>
          ) : isRun ? (
            <>
              <Footprints className="w-5 h-5" />
              <span>BẮT ĐẦU BUỔI CHẠY (GPS / INTERVAL)</span>
            </>
          ) : (
            <>
              <HeartPulse className="w-5 h-5" />
              <span>BẮT ĐẦU GIÃN CƠ & THẢ LỎNG KHỚP</span>
            </>
          )}
        </button>

        <button
          onClick={handleQuickToggleComplete}
          className="shrink-0 px-5 py-4 rounded-2xl bg-white/[0.07] hover:bg-[#00E676]/20 border border-white/10 hover:border-[#00E676]/40 text-slate-200 hover:text-[#00E676] font-bold text-xs transition-all flex items-center gap-2 cursor-pointer font-mono"
          type="button"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isCompleted ? 'Hủy hoàn thành' : 'Đánh dấu đã xong'}</span>
        </button>
      </div>

      {/* Warmup Modal */}
      <WarmupGuideModal
        isOpen={isWarmupModalOpen}
        onClose={() => setIsWarmupModalOpen(false)}
        warmupExercises={warmupResolved}
        onSelectExercise={(ex) => setSelectedExercise(ex)}
        onStartMainSession={() => onStartSession(programDay.type)}
      />

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </article>
  );
}
export default DailyPlanCard;
