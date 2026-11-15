import React from 'react';
import { Award, Flame, Zap, Trophy, Footprints } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';

export function StatSummaryCard() {
  const { totalCompletedCount, totalPushupsDone, totalRunKm, maxPushupsRecord, streak } = useUserProgress();
  const percent = Math.min(100, Math.round((totalCompletedCount / 100) * 100));

  const hasDay1 = totalCompletedCount >= 1;
  const hasStreak7 = streak >= 7;
  const hasPushups50 = maxPushupsRecord >= 50;
  const hasRun50 = totalRunKm >= 50;

  return (
    <div className="rounded-3xl p-5 bg-[#111622]/90 backdrop-blur-xl border border-white/[0.08] shadow-glass-hud space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <h3 className="text-xs font-black text-white uppercase tracking-wider font-display flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          BẢNG THÀNH TÍCH CÁ NHÂN
        </h3>
        <span className="text-[10px] font-mono text-slate-400 font-bold">PRO HUD</span>
      </div>

      {/* 4 Essential Stat Micro-Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Stat 1: Push-ups */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06]">
          <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">
            TỔNG PUSH-UPS
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-white font-mono">
              {totalPushupsDone.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">cái</span>
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#FF5500] h-full shadow-neon-orange transition-all duration-500"
              style={{ width: `${Math.min(100, (totalPushupsDone / 2000) * 100)}%` }}
            />
          </div>
        </div>

        {/* Stat 2: Run Km */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06]">
          <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">
            TỔNG KM CHẠY
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-[#00E5FF] font-mono">
              {totalRunKm}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">km</span>
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#00E5FF] h-full shadow-neon-cyan transition-all duration-500"
              style={{ width: `${Math.min(100, (totalRunKm / 100) * 100)}%` }}
            />
          </div>
        </div>

        {/* Stat 3: Max Reps */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06]">
          <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">
            KỶ LỤC MAX REPS
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-400 font-mono">
              {maxPushupsRecord}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">reps/hiệp</span>
          </div>
          <p className="text-[9px] text-amber-400/80 mt-1 font-mono">Mục tiêu: 30 reps</p>
        </div>

        {/* Stat 4: Roadmap Progress */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06]">
          <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">
            CHẶNG ĐƯỜNG
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-[#00E676] font-mono">
              {totalCompletedCount}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">/ 100</span>
          </div>
          <p className="text-[9px] text-[#00E676] mt-1 font-mono">{percent}% hoàn thành</p>
        </div>
      </div>

      {/* Badges & Milestone Showcase */}
      <div className="pt-2">
        <div className="text-[11px] font-mono font-bold text-slate-400 uppercase mb-2">
          Huy hiệu chinh phục:
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              hasDay1
                ? 'bg-[#FF5500]/15 border-[#FF5500]/40 text-[#FF5500] shadow-neon-orange/40'
                : 'bg-white/[0.04] border-white/10 text-slate-600'
            }`}
            title="Chiến Binh Ngày 1: Hoàn thành buổi đầu tiên"
          >
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              hasStreak7
                ? 'bg-[#00E676]/15 border-[#00E676]/40 text-[#00E676] shadow-neon-green/40'
                : 'bg-white/[0.04] border-white/10 text-slate-600'
            }`}
            title="Chuỗi 7 Ngày: Kỷ luật thép liên tục 1 tuần"
          >
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              hasPushups50
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-lg'
                : 'bg-white/[0.04] border-white/10 text-slate-600'
            }`}
            title="Mốc 50 Reps: Đạt 50 cái trong 1 hiệp"
          >
            <Trophy className="w-5 h-5 fill-current" />
          </div>
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              hasRun50
                ? 'bg-[#00E5FF]/15 border-[#00E5FF]/40 text-[#00E5FF] shadow-neon-cyan/40'
                : 'bg-white/[0.04] border-white/10 text-slate-600'
            }`}
            title="Chinh Phục 50KM: Tích lũy 50km chạy đường dài"
          >
            <Footprints className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default StatSummaryCard;
