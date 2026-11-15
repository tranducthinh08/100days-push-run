import React, { useState } from 'react';
import { Play, CheckCircle2, RotateCcw, Footprints, Dumbbell, Sparkles, HeartPulse } from 'lucide-react';
import { DayProgram } from '@/entities/program/types';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { resolveExercise } from '@/entities/exercise/model';
import { Exercise } from '@/entities/exercise/types';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { DailyPlanBlocks } from './components/DailyPlanBlocks';
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

  const handleQuickToggleComplete = () => {
    markDayCompleted({
      dayNumber: programDay.dayNumber,
      completedAt: new Date().toISOString(),
      type: programDay.type,
      equipmentMode,
    });
  };

  return (
    <div className="relative overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 flex flex-col gap-5 animate-fade-in-up">
      {/* Dynamic ambient color splash based on workout type */}
      <div
        className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isPush ? 'bg-orange-400/10' : isRun ? 'bg-blue-400/10' : 'bg-emerald-400/10'
        }`}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 relative z-10 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-black uppercase tracking-widest font-condensed px-2.5 py-1 rounded-lg border ${
              isPush
                ? 'text-orange-600 bg-orange-100/70 border-orange-200'
                : isRun
                ? 'text-blue-600 bg-blue-100/70 border-blue-200'
                : 'text-emerald-600 bg-emerald-100/70 border-emerald-200'
            }`}
          >
            {programDay.dayOfWeekVi} &bull; NGÀY {programDay.dayNumber}
          </span>
          <Badge
            variant={isPush ? 'orange' : isRun ? 'blue' : 'emerald'}
            size="sm"
          >
            {isPush ? 'Hít đất Sức mạnh' : isRun ? 'Chạy bộ Sức bền' : 'Active Recovery'}
          </Badge>
          {programDay.isTestDay && (
            <Badge variant="amber" size="sm">
              <Sparkles className="w-3 h-3 mr-0.5" /> TEST MAX
            </Badge>
          )}
        </div>

        {isCompleted && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã xong
          </span>
        )}
      </div>

      {/* Title & Focus */}
      <div className="relative z-10">
        <h2 className="font-condensed text-2xl md:text-3xl font-black text-slate-900 tracking-wide uppercase leading-tight">
          {programDay.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed font-medium">
          {programDay.focus}
        </p>
      </div>

      {/* 3 Training Blocks Grid */}
      <DailyPlanBlocks
        programDay={programDay}
        warmupResolved={warmupResolved}
        mainResolved={mainResolved}
        accessoryResolved={accessoryResolved}
        onOpenWarmupModal={() => setIsWarmupModalOpen(true)}
        onSelectExercise={(ex) => setSelectedExercise(ex)}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 relative z-10">
        <Button
          variant={isPush ? 'primary' : isRun ? 'blue' : 'emerald'}
          size="lg"
          fullWidth
          onClick={() => onStartSession(programDay.type)}
          leftIcon={
            isPush ? (
              <Dumbbell className="w-5 h-5" />
            ) : isRun ? (
              <Footprints className="w-5 h-5" />
            ) : (
              <HeartPulse className="w-5 h-5 fill-white" />
            )
          }
          className="h-13 font-black text-sm uppercase tracking-wider"
        >
          {isPush
            ? 'Bắt đầu Hít đất (Touch-to-Count)'
            : isRun
            ? 'Bắt đầu Chạy bộ & Strava'
            : 'Bắt đầu buổi Giãn cơ phục hồi'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleQuickToggleComplete}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="shrink-0 text-xs px-5 h-13"
        >
          {isCompleted ? 'Hủy hoàn thành' : 'Đánh dấu đã xong'}
        </Button>
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
    </div>
  );
}
export default DailyPlanCard;
