import React, { useState } from 'react';
import { Check, Star, Dumbbell, Footprints, Calendar, HeartPulse } from 'lucide-react';
import { PROGRAM_DAYS, getPhaseInfo } from '@/entities/program/model';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { ProgramPhase } from '@/entities/program/types';
import { ProgressBar } from '@/shared/ui/ProgressBar';

export function DesktopRoadmapGrid() {
  const { currentDay, setCurrentDay, completedDays } = useUserProgress();
  const [activePhase, setActivePhase] = useState<ProgramPhase>(
    currentDay <= 30 ? 1 : currentDay <= 70 ? 2 : 3
  );

  const phaseInfo = getPhaseInfo(activePhase);
  const phaseDays = PROGRAM_DAYS.filter((d) => d.phase === activePhase);
  const completedInPhase = phaseDays.filter((d) => completedDays[d.dayNumber]).length;
  const phasePercent = Math.round((completedInPhase / phaseDays.length) * 100);

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-condensed text-lg font-black text-slate-900 tracking-wider uppercase">
              Lộ trình 100 Ngày
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">14 tuần chinh phục 100 push-ups & chạy 3b/tuần</p>
          </div>
        </div>

        {/* Phase switcher tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setActivePhase(p as ProgramPhase)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activePhase === p
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              GĐ {p}
            </button>
          ))}
        </div>
      </div>

      {/* Phase Goal Banner */}
      <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="font-bold text-slate-900 text-xs block">{phaseInfo.title}</span>
            <span className="text-[11px] text-orange-700 font-mono font-bold">{phaseInfo.weeks}</span>
          </div>
          <span className="text-sm font-black font-mono text-orange-600">{phasePercent}%</span>
        </div>
        <ProgressBar value={phasePercent} color="orange" height="sm" />
        <p className="text-[11px] text-slate-600 leading-tight font-medium">
          {phaseInfo.goal} &bull; <strong className="text-orange-700">{phaseInfo.testGoal}</strong>
        </p>
      </div>

      {/* Weekdays row */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {daysOfWeek.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Days grid of the active phase */}
      <div className="grid grid-cols-7 gap-1.5 max-h-[290px] overflow-y-auto pr-1">
        {phaseDays.map((day) => {
          const isDone = !!completedDays[day.dayNumber];
          const isCurrent = day.dayNumber === currentDay;

          const currentBorderClass =
            day.type === 'push'
              ? 'bg-orange-50 border-2 border-orange-500 ring-2 ring-orange-300 text-orange-700 font-black shadow-md shadow-orange-500/20'
              : day.type === 'run'
              ? 'bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-300 text-blue-700 font-black shadow-md shadow-blue-500/20'
              : 'bg-emerald-50 border-2 border-emerald-500 ring-2 ring-emerald-300 text-emerald-700 font-black shadow-md shadow-emerald-500/20';

          return (
            <button
              key={day.dayNumber}
              onClick={() => setCurrentDay(day.dayNumber)}
              title={`Ngày ${day.dayNumber}: ${day.title}`}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-mono transition-all duration-150 cursor-pointer min-h-[50px] ${
                isCurrent
                  ? currentBorderClass
                  : isDone
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-white border-slate-200/80 text-slate-500 hover:border-slate-400'
              }`}
            >
              <div className="absolute top-1 right-1">
                {isDone ? (
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                ) : day.isTestDay ? (
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500/30" />
                ) : null}
              </div>

              <span className="text-xs font-bold leading-none">{day.dayNumber}</span>

              <div className="mt-1">
                {day.type === 'push' ? (
                  <Dumbbell className="w-2.5 h-2.5 text-orange-500" />
                ) : day.type === 'run' ? (
                  <Footprints className="w-2.5 h-2.5 text-blue-600" />
                ) : (
                  <HeartPulse className="w-2.5 h-2.5 text-emerald-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Activity Type Legend */}
      <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 px-1 font-medium">
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-2xs" />
          <span>Hít đất (T2, 4, 6)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-2xs" />
          <span>Chạy bộ (T3, 5, 7)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-2xs" />
          <span>Giãn cơ (Chủ nhật)</span>
        </div>
      </div>
    </div>
  );
}
export default DesktopRoadmapGrid;
