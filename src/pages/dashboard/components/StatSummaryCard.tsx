import React from 'react';
import { Dumbbell, Footprints, CalendarCheck, Trophy } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';

export function StatSummaryCard() {
  const { totalCompletedCount, totalPushupsDone, totalRunKm, maxPushupsRecord } = useUserProgress();
  const percent = Math.round((totalCompletedCount / 100) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Push-ups */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Hít đất tích lũy
          </span>
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="font-mono text-3xl font-black text-slate-900 tracking-tight">
            {totalPushupsDone.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 font-bold">cái</span>
        </div>
        <span className="text-[10px] text-orange-600 font-bold">
          Mục tiêu: 100 cái liên tục
        </span>
      </div>

      {/* 2. Run distance */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Chạy bộ tích lũy
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Footprints className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="font-mono text-3xl font-black text-slate-900 tracking-tight">
            {totalRunKm}
          </span>
          <span className="text-xs text-slate-500 font-bold">km</span>
        </div>
        <span className="text-[10px] text-blue-600 font-bold">
          Duy trì 3 buổi/tuần
        </span>
      </div>

      {/* 3. Completed Days */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Tiến độ lộ trình
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="font-mono text-3xl font-black text-slate-900 tracking-tight">
            {totalCompletedCount}
          </span>
          <span className="text-xs text-slate-500 font-bold">/ 100 ngày</span>
        </div>
        <span className="text-[10px] text-emerald-600 font-bold">
          Đạt {percent}% chặng đường
        </span>
      </div>

      {/* 4. Max Pushup Record */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Kỷ lục Max Reps
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="font-mono text-3xl font-black text-amber-600 tracking-tight">
            {maxPushupsRecord}
          </span>
          <span className="text-xs text-slate-500 font-bold">cái / hiệp</span>
        </div>
        <span className="text-[10px] text-amber-700 font-bold">
          Hiệp 1 nhiều nhất
        </span>
      </div>
    </div>
  );
}
export default StatSummaryCard;
