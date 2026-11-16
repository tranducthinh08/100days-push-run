import React from 'react';
import { DayProgram } from '@/entities/program/types';

interface DailyTargetArcCardProps {
  programDay: DayProgram;
  isCompleted: boolean;
  isPush: boolean;
  isRun: boolean;
  totalTargetReps: number;
}

export function DailyTargetArcCard({
  programDay,
  isCompleted,
  isPush,
  isRun,
  totalTargetReps,
}: DailyTargetArcCardProps) {
  const strokeColor = isPush ? 'text-[#FF5500]' : isRun ? 'text-[#00E5FF]' : 'text-[#00E676]';
  const targetLabel = isPush
    ? 'MỤC TIÊU SỐ REPS HÔM NAY'
    : isRun
    ? `MỤC TIÊU CHẠY BỘ (${programDay.runDetails?.runType === 'interval' ? 'INTERVAL' : programDay.runDetails?.runType === 'long-run' ? 'LONG RUN' : 'ZONE 2'})`
    : 'MỤC TIÊU PHỤC HỒI';

  const mainNumber = isPush
    ? totalTargetReps
    : isRun
    ? `${programDay.runDetails?.distanceKmTarget || 3.5}km`
    : '30';

  const subMetric = isPush
    ? `REPS / ${programDay.pushupTargetRepsPerSet?.length || 5} HIỆP`
    : isRun
    ? (programDay.runDetails?.splitsSummary || `${programDay.runDetails?.durationMinutesTarget || 25} PHÚT CHẠY`).toUpperCase()
    : 'PHÚT GIÃN CƠ';

  const tempoAdvice = isPush
    ? 'Phân bổ nhịp độ: 2 giây xuống - 1 giây đẩy bốc'
    : isRun
    ? `${programDay.runDetails?.paceGuidance || 'Pace trò chuyện thoải mái'} • Thở đều nhịp 3-3`
    : 'Giảm tải căng cơ ngực và gân kheo';

  const durationMain = isRun
    ? `${programDay.runDetails?.durationMinutesTarget || 25} Phút`
    : isPush
    ? '35 - 40 Phút'
    : '30 Phút';

  const durationSub = isRun
    ? `(Tổng buổi ~${(programDay.runDetails?.durationMinutesTarget || 25) + 15}p)`
    : '';

  const restLabel = isPush
    ? 'Nghỉ giữa hiệp:'
    : isRun
    ? (programDay.runDetails?.runType === 'long-run' ? 'Nghỉ tiếp nước:' : 'Đi bộ thả lỏng:')
    : 'Nhịp thở giãn cơ:';

  const restValue = isPush
    ? `${programDay.restBetweenSetsSec || 60}s - 90s`
    : isRun
    ? (programDay.runDetails?.runType === 'long-run' ? '90s / chặng' : '60s / hiệp')
    : 'Hít 4s - Thở 6s';

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#161C2C] to-[#0D111A] border border-white/[0.08] relative mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Circular Target Arc Progress */}
        <div className="flex items-center gap-4 sm:col-span-2">
          <div className="relative w-[72px] h-[72px] shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className={strokeColor}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={isCompleted ? '100, 100' : '15, 100'}
                strokeLinecap="round"
                strokeWidth="3.8"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-black font-mono text-white">
                {isCompleted ? '100%' : '0%'}
              </span>
              <span className="text-[8px] text-slate-400 uppercase font-mono">ĐẠT</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400 font-mono">
              {targetLabel}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl lg:text-4xl font-black text-white font-mono">
                {mainNumber}
              </span>
              <span className="text-sm font-bold text-[#FF8A00] font-mono">
                {subMetric}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{tempoAdvice}</p>
          </div>
        </div>

        {/* Time and Rest stats */}
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 pt-3 sm:pt-0 sm:border-l sm:border-white/10 sm:pl-4">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Thời lượng:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white font-mono">{durationMain}</span>
              {durationSub && (
                <span className="text-[10px] text-slate-400 font-mono">{durationSub}</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-[#00E5FF] font-mono uppercase block">{restLabel}</span>
            <span className="text-base font-bold text-[#00E5FF] font-mono">
              {restValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DailyTargetArcCard;
