import React from 'react';
import { Flame, Shield, Sparkles, Layers, Dumbbell, User, ExternalLink, Lock } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { ProgramPhase, DayProgram } from '@/entities/program/types';
import { DisciplineCommitmentCard } from './DisciplineCommitmentCard';

interface LeftAthleteHubProps {
  programDay: DayProgram;
  onOpenStravaModal: () => void;
  activePhase: ProgramPhase;
  onSelectPhase: (phase: ProgramPhase) => void;
}

const PHASES = [
  { id: 1 as ProgramPhase, title: 'GIAI ĐOẠN 1 (NGÀY 1 - 30)', sub: 'Nền tảng & Chuẩn hóa form • Đích: 25-30 cái, chạy 2.5-3km' },
  { id: 2 as ProgramPhase, title: 'GIAI ĐOẠN 2 (NGÀY 31 - 70)', sub: 'Tăng Volume & Nghỉ 45s • Đích: 60-65 cái, chạm mốc 5km' },
  { id: 3 as ProgramPhase, title: 'GIAI ĐOẠN 3 (NGÀY 71 - 100)', sub: 'AMRAP & Bứt phá • Bùng nổ 100 cái hít đất + 5km' },
];

function getCoachAdvice(day: DayProgram): string {
  if (day.dayNumber === 1) {
    return 'Dành 5 phút khởi động kỹ. Khép khuỷu tay 45 độ, siết bụng hollow body khóa người như tấm ván.';
  }
  if (day.type === 'push') {
    return 'Tập trung khép khuỷu tay 45 độ, siết mông bụng không để võng hông. Nghỉ đúng thời gian đếm ngược giữa hiệp.';
  }
  if (day.type === 'run') {
    if (day.runDetails?.runType === 'interval') {
      return `Chạy biến tốc Interval: Bứt tốc trong hiệp chạy và đi bộ phục hồi giữa các hiệp để nâng cao VO2 Max.`;
    }
    if (day.runDetails?.runType === 'long-run') {
      return `Chạy dài tích lũy: Giữ guồng chân 170 spm, chia đều sức qua các chặng và tiếp nước mỗi 20 phút.`;
    }
    return `Chạy nhẹ Zone 2: Thực hiện ${day.runDetails?.splitsSummary || 'các hiệp Run-Walk'}, thở đều nhịp 3-3 bảo vệ khớp gối.`;
  }
  return 'Phục hồi chủ động: Thả lỏng toàn bộ cơ bắp, uống đủ nước và ngủ đủ giấc để cơ thể phục hồi tối đa.';
}

export function LeftAthleteHub({
  programDay,
  onOpenStravaModal,
  activePhase,
  onSelectPhase,
}: LeftAthleteHubProps) {
  const { streak, equipmentMode, setEquipmentMode } = useUserProgress();
  const isDumbbell = equipmentMode === 'dumbbell';

  return (
    <aside className="space-y-5" data-purpose="left-athlete-hub">
      {/* Athlete Profile & Mission Card */}
      <div className="rounded-3xl p-5 bg-[#111622]/85 backdrop-blur-xl border border-white/[0.08] shadow-glass-hud relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#FF5500]/20 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 mb-4 relative z-10">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1B2233] to-[#2B354E] border border-white/20 p-0.5 flex items-center justify-center text-white font-black text-xl font-display shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] to-[#FF8A00]">VN</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00E676] ring-2 ring-[#0B0E14] flex items-center justify-center text-[8px] text-black font-bold">✓</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-white font-display">Chiến Binh #100</h3>
              <Shield className="w-3.5 h-3.5 text-[#00E5FF]" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Hạng mục: <span className="text-slate-200 font-bold">Iron Discipline</span>
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF5500]/15 text-[#FF8A00] border border-[#FF5500]/30">
              LEVEL 1: KHỞI TỰ THÂN
            </span>
          </div>
        </div>

        {/* Commitment Date Selector Card */}
        <DisciplineCommitmentCard />

        {/* Discipline Flame Streak Counter (Hero Widget) */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1C161D] to-[#12141F] border border-[#FF5500]/30 shadow-neon-orange/40 relative overflow-hidden mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF8A00] font-mono">
                LỬA KỶ LUẬT (STREAK)
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-4xl font-black text-white font-mono tracking-tight">{streak}</span>
                <span className="text-xs font-bold text-slate-400 uppercase">NGÀY LIÊN TIẾP</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#FF5500]/15 border border-[#FF5500]/40 flex items-center justify-center animate-pulse-glow text-3xl text-[#FF5500]">
              <Flame className="w-8 h-8 fill-[#FF5500] text-[#FF5500]" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A00]" />
            {streak > 0 ? 'Duy trì ngọn lửa kỷ luật mỗi ngày!' : 'Hoàn thành bài tập hôm nay để thắp sáng ngọn lửa!'}
          </p>
        </div>

        {/* Workout Style Segmented Switcher */}
        <div className="space-y-1.5 mb-4">
          <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase font-mono">
            Chế độ trang bị:
          </label>
          <div className="grid grid-cols-2 p-1 rounded-xl bg-black/50 border border-white/[0.08] text-xs font-bold">
            <button
              onClick={() => setEquipmentMode('bodyweight')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !isDumbbell ? 'bg-[#FF5500] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              type="button"
            >
              <User className="w-3.5 h-3.5" /> Bodyweight
            </button>
            <button
              onClick={() => setEquipmentMode('dumbbell')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isDumbbell ? 'bg-[#FF5500] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              type="button"
            >
              <Dumbbell className="w-3.5 h-3.5" /> Tạ Đơn
            </button>
          </div>
        </div>

        {/* Strava Live Sync Micro Chip */}
        <div
          onClick={onOpenStravaModal}
          className="p-3.5 rounded-2xl bg-[#0B0E14] border border-[#FC5200]/30 hover:border-[#FC5200] transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FC5200] text-white flex items-center justify-center font-black text-xs shadow-md shadow-[#FC5200]/30">STR</div>
              <div>
                <p className="text-xs font-extrabold text-white flex items-center gap-1">
                  STRAVA SYNC <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </p>
                <p className="text-[10px] text-slate-400 font-mono">Tự động nhận km chạy bộ</p>
              </div>
            </div>
            <button className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#FC5200] hover:bg-[#E04800] rounded-lg transition-all flex items-center gap-1" type="button">
              Kết nối <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stage Selector Navigation */}
      <div className="rounded-3xl p-5 bg-[#111622]/85 backdrop-blur-xl border border-white/[0.08] shadow-glass-hud">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.08]">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#FF5500]" /> Lựa chọn giai đoạn
          </span>
          <span className="text-[10px] font-mono text-[#00E5FF] font-bold">14 TUẦN TẬP</span>
        </div>

        <div className="space-y-2.5">
          {PHASES.map((ph) => {
            const isActive = activePhase === ph.id;
            return (
              <div
                key={ph.id}
                onClick={() => onSelectPhase(ph.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5500]/15 to-transparent border-l-4 border-l-[#FF5500] border-y border-r border-white/[0.08]'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#FF5500] text-white">Đang chọn</span>
                      )}
                      <span className={`text-xs font-extrabold ${isActive ? 'text-white' : 'text-slate-300'}`}>{ph.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{ph.sub}</p>
                  </div>
                  {!isActive && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Coach Notes */}
      <div className="p-4 rounded-3xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-slate-300 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#00E5FF]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LỜI KHUYÊN HÔM NAY (NGÀY {programDay.dayNumber})</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {getCoachAdvice(programDay)}
        </p>
      </div>
    </aside>
  );
}
export default LeftAthleteHub;
