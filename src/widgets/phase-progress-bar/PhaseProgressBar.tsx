import React from 'react';
import { Flame, Trophy, Calendar, ChevronRight } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { Badge } from '@/shared/ui/Badge';
import { getPhaseInfo } from '@/entities/program/model';
import { ProgramPhase } from '@/entities/program/types';

interface PhaseProgressBarProps {
  onOpenDaySelector: () => void;
}

export function PhaseProgressBar({ onOpenDaySelector }: PhaseProgressBarProps) {
  const { currentDay, streak, maxPushupsRecord, totalCompletedCount } = useUserProgress();

  const phase: ProgramPhase = currentDay <= 30 ? 1 : currentDay <= 70 ? 2 : 3;
  const phaseInfo = getPhaseInfo(phase);
  const progressPercent = Math.round((totalCompletedCount / 100) * 100);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      {/* Top row: Day badge & quick stats */}
      <div className="flex items-center justify-between">
        <button
          onClick={onOpenDaySelector}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 active:scale-95 px-3 py-1.5 rounded-xl border border-slate-200 transition-all text-left"
        >
          <Calendar className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-slate-900">Ngày {currentDay} / 100</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{streak} ngày</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>{maxPushupsRecord} max</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="orange" size="sm">
              Giai đoạn {phase}
            </Badge>
            <span className="text-slate-500 text-[11px] truncate max-w-[170px] sm:max-w-none font-medium">
              {phaseInfo.title.split(':')[1] || phaseInfo.title}
            </span>
          </div>
          <span className="font-mono font-bold text-orange-600">{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} color="orange" height="md" />
      </div>
    </div>
  );
}
export default PhaseProgressBar;
