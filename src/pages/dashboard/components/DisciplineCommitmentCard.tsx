import React, { useState } from 'react';
import { Calendar, AlertTriangle, RotateCcw, Check, Shield } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { formatDateVi, getTodayDateStr } from '@/entities/user-progress/disciplineHelper';

export function DisciplineCommitmentCard() {
  const {
    startDate,
    setStartDate,
    isStreakBroken,
    missedDay,
    expectedDayToday,
    resetStreakAndRestart,
  } = useUserProgress();

  const [inputDate, setInputDate] = useState(startDate || getTodayDateStr());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCommitDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDate) return;
    setStartDate(inputDate);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleRestartToday = () => {
    const today = getTodayDateStr();
    setInputDate(today);
    resetStreakAndRestart(today);
  };

  return (
    <div className="p-4 rounded-2xl bg-[#0F1420] border border-white/[0.08] relative overflow-hidden mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF8A00] font-mono flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#FF5500]" />
          CAM KẾT KỶ LUẬT THÉP
        </span>
        <span className="text-[10px] font-mono font-bold text-slate-400">
          Hôm nay: Ngày {expectedDayToday}
        </span>
      </div>

      {/* Start Date Input Form */}
      <form onSubmit={handleCommitDate} className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF5500] transition-colors"
              title="Chọn ngày bắt đầu cam kết"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#FF5500] hover:bg-[#E54D00] text-white text-xs font-bold rounded-xl transition-all cursor-pointer font-mono shrink-0 flex items-center gap-1"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" /> Đã lưu
              </>
            ) : (
              'Cam kết'
            )}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 font-mono">
          Bắt đầu từ: <strong className="text-white">{formatDateVi(startDate)}</strong> &bull; Bỏ lỡ 1 ngày = Mất chuỗi & về Ngày 1!
        </p>
      </form>

      {/* Streak Broken Alert */}
      {isStreakBroken && (
        <div className="mt-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-1.5 animate-pulse">
          <div className="flex items-center gap-1.5 font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>KỶ LUẬT BỊ ĐỨT CHUỖI!</span>
          </div>
          <p className="text-[10px] leading-relaxed text-rose-200">
            Bạn đã bỏ lỡ bài tập Ngày {missedDay}. Toàn bộ chuỗi ngày liên tiếp đã mất và thử thách được reset về Ngày 1.
          </p>
          <button
            type="button"
            onClick={handleRestartToday}
            className="w-full mt-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer font-mono"
          >
            <RotateCcw className="w-3 h-3" /> Bắt đầu lại thử thách từ hôm nay
          </button>
        </div>
      )}
    </div>
  );
}
export default DisciplineCommitmentCard;
