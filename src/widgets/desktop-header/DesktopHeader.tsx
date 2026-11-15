import React, { useState } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  Footprints,
  BookOpen,
  History,
  Download,
  Upload,
  Flame,
  Calendar,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NavTab } from '../bottom-navigation/BottomNavigation';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { exportAllData, importAllData } from '@/shared/lib/storage';
import { playWhistleSound } from '@/shared/lib/audio';

interface DesktopHeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenHistory: () => void;
  onOpenDaySelector: () => void;
}

export function DesktopHeader({
  activeTab,
  onTabChange,
  onOpenHistory,
  onOpenDaySelector,
}: DesktopHeaderProps) {
  const { currentDay, streak } = useUserProgress();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const navLinks = [
    { id: 'dashboard' as NavTab, label: 'Lộ trình 100 Ngày', icon: LayoutDashboard },
    { id: 'workout' as NavTab, label: 'Luyện tập Hít đất', icon: Dumbbell },
    { id: 'run' as NavTab, label: 'Chạy bộ & Strava', icon: Footprints },
    { id: 'library' as NavTab, label: 'Thư viện bài tập', icon: BookOpen },
  ];

  const handleSoundToggle = () => {
    if (!soundEnabled) {
      playWhistleSound();
    }
    setSoundEnabled(!soundEnabled);
  };

  const handleExport = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `100days-push-run-backup-day${currentDay}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importAllData(content)) {
        window.location.reload();
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      <div className="max-w-[1880px] mx-auto px-4 lg:px-6 h-18 flex items-center justify-between gap-4 py-3">
        {/* Brand Athlete Logo */}
        <div
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3.5 cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6D00] to-[#E53900] flex items-center justify-center text-white shadow-neon-orange ring-1 ring-white/25 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-display">100DAYS</span>
              <span className="px-2 py-0.5 text-[10px] font-black tracking-widest uppercase bg-[#FF5500] text-white rounded shadow-xs">
                ATHLETE PRO
              </span>
              <span className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-white/10 text-cyan-300 rounded border border-cyan-500/30">
                V3.2 HUD
              </span>
            </div>
            <p className="text-[11px] font-mono font-medium text-slate-400 tracking-wider">
              PUSH & RUN HIGH PERFORMANCE HUB
            </p>
          </div>
        </div>

        {/* Live Fast Status Indicator (Desktop) */}
        <div className="hidden 2xl:flex items-center gap-5 px-4 py-1.5 rounded-full bg-[#111622]/90 border border-white/[0.08]">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
            <span className="text-slate-400">TRẠNG THÁI:</span>
            <span className="font-bold text-[#00E676]">SẴN SÀNG TẬP LUYỆN</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
            <span>STRAVA ENGINE: <strong className="text-white">STANDBY</strong></span>
          </div>
        </div>

        {/* Centered Segmented Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-[#111622] p-1.5 rounded-2xl border border-white/[0.08] shadow-inner">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5500] text-white shadow-neon-orange font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Athlete Control Telemetry */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Day Selector Pill */}
          <button
            onClick={onOpenDaySelector}
            className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1.5 rounded-xl border border-white/[0.08] text-xs text-white transition-all cursor-pointer font-mono"
            title="Đổi ngày tập luyện"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span className="font-bold">Ngày {currentDay}</span>
            <span className="text-slate-400">/ 100</span>
          </button>

          {/* Streak Flame Pill */}
          <div
            title="Chuỗi ngày tập liên tục"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-[#FF8A00] bg-[#FF5500]/15 rounded-xl border border-[#FF5500]/30"
          >
            <Flame className="w-3.5 h-3.5 fill-[#FF5500] text-[#FF5500]" />
            <span>{streak} NGÀY</span>
          </div>

          {/* Sound Coach Toggle */}
          <button
            onClick={handleSoundToggle}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#111622] hover:bg-[#FF5500]/20 border-white/[0.08] text-slate-300 hover:text-white'
                : 'bg-white/[0.03] border-white/[0.06] text-slate-600'
            }`}
            title={soundEnabled ? 'Âm thanh HLV: Bật' : 'Âm thanh HLV: Tắt'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FF8A00]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Action icon buttons */}
          <button
            onClick={onOpenHistory}
            title="Lịch sử buổi tập"
            className="w-9 h-9 rounded-xl bg-[#111622] hover:bg-white/10 border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            title="Sao lưu tiến độ (Export JSON)"
            className="w-9 h-9 rounded-xl bg-[#111622] hover:bg-white/10 border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <label
            title="Khôi phục tiến độ (Import JSON)"
            className="w-9 h-9 rounded-xl bg-[#111622] hover:bg-white/10 border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>
    </header>
  );
}
export default DesktopHeader;
