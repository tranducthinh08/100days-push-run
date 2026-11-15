import React, { useState } from 'react';
import { Check, Star, Dumbbell, Footprints, Calendar, Leaf } from 'lucide-react';
import { PROGRAM_DAYS, getPhaseInfo } from '@/entities/program/model';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { ProgramPhase } from '@/entities/program/types';

interface DesktopRoadmapGridProps {
  activePhase?: ProgramPhase;
  onPhaseChange?: (phase: ProgramPhase) => void;
}

export function DesktopRoadmapGrid({ activePhase: externalPhase, onPhaseChange }: DesktopRoadmapGridProps) {
  const { currentDay, setCurrentDay, completedDays } = useUserProgress();
  const [internalPhase, setInternalPhase] = useState<ProgramPhase>(
    currentDay <= 30 ? 1 : currentDay <= 70 ? 2 : 3
  );

  const activePhase = externalPhase || internalPhase;
  const setActivePhase = (p: ProgramPhase) => {
    if (onPhaseChange) onPhaseChange(p);
    setInternalPhase(p);
  };

  const phaseInfo = getPhaseInfo(activePhase);
  const phaseDays = PROGRAM_DAYS.filter((d) => d.phase === activePhase);
  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <article
      className="rounded-3xl p-5 bg-[#111622]/90 backdrop-blur-xl border border-white/[0.08] shadow-glass-hud"
      data-purpose="roadmap-calendar-matrix"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 flex items-center justify-center text-xs shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase font-display">
              MA TRẬN LỘ TRÌNH 100 NGÀY
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Hiển thị Giai đoạn {activePhase} ({phaseInfo.weeks})
            </p>
          </div>
        </div>

        {/* Phase selector buttons */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/[0.08] text-xs">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setActivePhase(p as ProgramPhase)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activePhase === p
                  ? 'bg-[#FF5500] text-white shadow-neon-orange/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GĐ {p}
            </button>
          ))}
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono font-bold text-slate-400 mb-2">
        {weekdays.map((wd, i) => (
          <span key={i} className={wd === 'CN' ? 'text-[#00E676]' : ''}>
            {wd}
          </span>
        ))}
      </div>

      {/* Grid with Functional High-Contrast Colors */}
      <div className="grid grid-cols-7 gap-1.5 text-xs font-mono max-h-[310px] overflow-y-auto pr-0.5">
        {phaseDays.map((day) => {
          const isDone = !!completedDays[day.dayNumber];
          const isCurrent = day.dayNumber === currentDay;

          if (isCurrent) {
            return (
              <div
                key={day.dayNumber}
                onClick={() => setCurrentDay(day.dayNumber)}
                className="aspect-square rounded-xl bg-gradient-to-br from-[#FF5500] to-[#E53900] text-white flex flex-col items-center justify-center cursor-pointer shadow-neon-orange ring-1 ring-white/40 transform scale-105 relative group transition-all"
                title={`Hôm nay: Ngày ${day.dayNumber} - ${day.title}`}
              >
                <span className="font-black text-xs">{day.dayNumber}</span>
                {day.type === 'push' ? (
                  <Dumbbell className="w-2.5 h-2.5 mt-0.5" />
                ) : day.type === 'run' ? (
                  <Footprints className="w-2.5 h-2.5 mt-0.5" />
                ) : (
                  <Leaf className="w-2.5 h-2.5 mt-0.5" />
                )}
              </div>
            );
          }

          if (day.isTestDay) {
            return (
              <div
                key={day.dayNumber}
                onClick={() => setCurrentDay(day.dayNumber)}
                className="aspect-square rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 flex flex-col items-center justify-center cursor-pointer relative hover:scale-105 transition-all"
                title="Test Max Reps Challenge"
              >
                <Star className="w-2 h-2 text-amber-400 fill-amber-400 absolute top-1 right-1" />
                <span className="font-black text-xs">{day.dayNumber}</span>
                <Dumbbell className="w-2.5 h-2.5 text-amber-400 mt-0.5" />
              </div>
            );
          }

          if (isDone) {
            return (
              <div
                key={day.dayNumber}
                onClick={() => setCurrentDay(day.dayNumber)}
                className="aspect-square rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] flex flex-col items-center justify-center cursor-pointer hover:bg-[#00E676]/20 transition-all relative"
                title={`Ngày ${day.dayNumber} - Đã hoàn thành`}
              >
                <Check className="w-2 h-2 text-[#00E676] stroke-[3] absolute top-1 right-1" />
                <span className="font-bold text-xs">{day.dayNumber}</span>
                {day.type === 'push' ? (
                  <Dumbbell className="w-2.5 h-2.5 mt-0.5 opacity-80" />
                ) : day.type === 'run' ? (
                  <Footprints className="w-2.5 h-2.5 mt-0.5 opacity-80" />
                ) : (
                  <Leaf className="w-2.5 h-2.5 mt-0.5 opacity-80" />
                )}
              </div>
            );
          }

          if (day.type === 'run') {
            return (
              <div
                key={day.dayNumber}
                onClick={() => setCurrentDay(day.dayNumber)}
                className="aspect-square rounded-xl bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] flex flex-col items-center justify-center cursor-pointer transition-all"
                title={`Ngày ${day.dayNumber} - Chạy bộ`}
              >
                <span className="font-bold text-xs">{day.dayNumber}</span>
                <Footprints className="w-2.5 h-2.5 text-[#00E5FF]/80 mt-0.5" />
              </div>
            );
          }

          if (day.type === 'recovery') {
            return (
              <div
                key={day.dayNumber}
                onClick={() => setCurrentDay(day.dayNumber)}
                className="aspect-square rounded-xl bg-[#00E676]/10 hover:bg-[#00E676]/20 border border-[#00E676]/30 text-[#00E676] flex flex-col items-center justify-center cursor-pointer transition-all"
                title={`Ngày ${day.dayNumber} - Phục hồi giãn cơ`}
              >
                <span className="font-bold text-xs">{day.dayNumber}</span>
                <Leaf className="w-2.5 h-2.5 text-[#00E676]/80 mt-0.5" />
              </div>
            );
          }

          return (
            <div
              key={day.dayNumber}
              onClick={() => setCurrentDay(day.dayNumber)}
              className="aspect-square rounded-xl bg-white/[0.04] hover:bg-[#FF5500]/10 border border-white/[0.08] text-slate-300 hover:text-[#FF8A00] hover:border-[#FF5500]/40 flex flex-col items-center justify-center cursor-pointer transition-all"
              title={`Ngày ${day.dayNumber} - Hít đất`}
            >
              <span className="font-bold text-xs">{day.dayNumber}</span>
              <Dumbbell className="w-2.5 h-2.5 text-[#FF5500]/70 mt-0.5" />
            </div>
          );
        })}
      </div>

      {/* Matrix Color Legend */}
      <div className="grid grid-cols-3 gap-1 pt-3.5 mt-4 border-t border-white/[0.08] text-[10px] font-mono font-bold text-center">
        <div className="flex items-center justify-center gap-1.5 text-[#FF8A00]">
          <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
          <span>Hít đất</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[#00E5FF]">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
          <span>Chạy bộ</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[#00E676]">
          <span className="w-2 h-2 rounded-full bg-[#00E676]" />
          <span>Phục hồi</span>
        </div>
      </div>
    </article>
  );
}
export default DesktopRoadmapGrid;
