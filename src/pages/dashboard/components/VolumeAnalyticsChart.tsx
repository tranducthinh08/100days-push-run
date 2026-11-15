import React from 'react';
import { BarChart3, Flame } from 'lucide-react';
import { DayProgram } from '@/entities/program/types';

interface VolumeAnalyticsChartProps {
  programDay: DayProgram;
}

export function VolumeAnalyticsChart({ programDay }: VolumeAnalyticsChartProps) {
  const isPush = programDay.type === 'push';

  const weeklySchedule = [
    { day: 'T2', type: 'push', value: '38', height: 'h-[45%]', label: '38' },
    { day: 'T3', type: 'run', value: '4km', height: 'h-[60%]', label: '4km' },
    { day: 'T4', type: 'push', value: '42', height: 'h-[50%]', label: '42' },
    { day: 'T5', type: 'run', value: '5km', height: 'h-[65%]', label: '5km' },
    { day: 'T6', type: 'push', value: '45', height: 'h-[55%]', label: '45' },
    { day: 'T7', type: 'run', value: '5km', height: 'h-[65%]', label: '5km' },
    { day: 'CN', type: 'rest', value: 'Zen', height: 'h-[25%]', label: 'Zen' },
  ];

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
          const isToday = (idx === 0 && programDay.dayOfWeekVi === 'Thứ 2') ||
                          (idx === 1 && programDay.dayOfWeekVi === 'Thứ 3') ||
                          (idx === 2 && programDay.dayOfWeekVi === 'Thứ 4') ||
                          (idx === 3 && programDay.dayOfWeekVi === 'Thứ 5') ||
                          (idx === 4 && programDay.dayOfWeekVi === 'Thứ 6') ||
                          (idx === 5 && programDay.dayOfWeekVi === 'Thứ 7') ||
                          (idx === 6 && programDay.dayOfWeekVi === 'Chủ nhật');

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
