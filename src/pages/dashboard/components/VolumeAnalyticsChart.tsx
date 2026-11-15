import React from 'react';
import { BarChart3 } from 'lucide-react';
import { DayProgram } from '@/entities/program/types';
import { PROGRAM_DAYS } from '@/entities/program/model';

interface VolumeAnalyticsChartProps {
  programDay: DayProgram;
}

export function VolumeAnalyticsChart({ programDay }: VolumeAnalyticsChartProps) {
  const isPush = programDay.type === 'push';

  const currentWeekDays = PROGRAM_DAYS.filter((d) => d.weekNumber === programDay.weekNumber);
  const weekdayShort = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const weekList = currentWeekDays.length === 7 ? currentWeekDays : PROGRAM_DAYS.slice(0, 7);

  const weeklySchedule = weekList.map((d, idx) => {
    let label = 'Zen';
    let height = 'h-[30%]';
    if (d.type === 'push') {
      const reps = d.pushupTargetRepsPerSet?.reduce((a, b) => a + b, 0) || 45;
      label = `${reps}`;
      height = reps >= 80 ? 'h-[90%]' : reps >= 60 ? 'h-[75%]' : reps >= 40 ? 'h-[55%]' : 'h-[40%]';
    } else if (d.type === 'run') {
      const km = d.runDetails?.distanceKmTarget || 2.5;
      label = `${km}km`;
      height = km >= 5 ? 'h-[85%]' : km >= 3 ? 'h-[65%]' : 'h-[50%]';
    }
    return {
      day: weekdayShort[idx] || d.dayOfWeekVi,
      dayNumber: d.dayNumber,
      type: d.type,
      label,
      height,
    };
  });

  return (
    <div className="rounded-3xl p-6 bg-[#111622]/90 backdrop-blur-xl border border-white/[0.08] shadow-glass-hud">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center justify-center text-xs">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase font-display">
              PHÂN TÍCH VOLUME & KÍCH HOẠT CƠ BẮP
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Biểu đồ dự phóng tải lượng 7 ngày tới</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#00E676] font-bold px-2 py-0.5 bg-[#00E676]/10 rounded border border-[#00E676]/30">
          OPTIMAL LOAD
        </span>
      </div>

      {/* Volume Bar Trend Chart */}
      <div className="grid grid-cols-7 gap-2.5 items-end h-28 pt-4 pb-2 px-2 bg-black/40 rounded-2xl border border-white/[0.04] mb-4">
        {weeklySchedule.map((item, idx) => {
          const isToday = item.dayNumber === programDay.dayNumber;

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
              <div
                className={`text-[9px] font-mono font-bold ${
                  item.type === 'push'
                    ? 'text-[#FF8A00]'
                    : item.type === 'run'
                    ? 'text-[#00E5FF]'
                    : 'text-[#00E676]'
                }`}
              >
                {item.label}
              </div>
              <div
                className={`w-full rounded-t-lg transition-all ${item.height} ${
                  item.type === 'push'
                    ? isToday
                      ? 'bg-[#FF5500] shadow-neon-orange ring-1 ring-white/30'
                      : 'bg-white/20 hover:bg-[#FF5500]'
                    : item.type === 'run'
                    ? isToday
                      ? 'bg-[#00E5FF] shadow-neon-cyan ring-1 ring-white/30'
                      : 'bg-white/20 hover:bg-[#00E5FF]'
                    : isToday
                    ? 'bg-[#00E676] shadow-neon-green ring-1 ring-white/30'
                    : 'bg-[#00E676]/30 hover:bg-[#00E676]'
                }`}
              />
              <span
                className={`text-[10px] font-mono font-bold ${
                  isToday
                    ? 'text-white underline underline-offset-2'
                    : 'text-slate-400'
                }`}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Muscle Activation Tags */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase font-mono mr-1">
          Cơ bắp chính:
        </span>
        {isPush ? (
          <>
            <span className="px-2.5 py-1 rounded-lg bg-[#FF5500]/15 text-[#FF8A00] border border-[#FF5500]/30 font-bold text-[11px]">
              Cơ Ngực (Pectoralis) 85%
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-300 border border-white/10 font-medium text-[11px]">
              Tay sau (Triceps) 75%
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 font-medium text-[11px]">
              Cơ bụng Lõi (Core) 60%
            </span>
          </>
        ) : (
          <>
            <span className="px-2.5 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-bold text-[11px]">
              Hệ Tim Mạch (Cardio) 90%
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-300 border border-white/10 font-medium text-[11px]">
              Cơ Bắp Chân (Calves) 80%
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20 font-medium text-[11px]">
              Đùi Trước (Quads) 70%
            </span>
          </>
        )}
      </div>
    </div>
  );
}
export default VolumeAnalyticsChart;
