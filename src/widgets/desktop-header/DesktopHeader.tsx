import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  Footprints,
  BookOpen,
  History,
  Download,
  Upload,
  Flame,
  Trophy,
  Calendar,
} from 'lucide-react';
import { NavTab } from '../bottom-navigation/BottomNavigation';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { exportAllData, importAllData } from '@/shared/lib/storage';

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
  const {
    currentDay,
    streak,
    maxPushupsRecord,
    equipmentMode,
    setEquipmentMode,
  } = useUserProgress();

  const isDumbbell = equipmentMode === 'dumbbell';

  const navLinks = [
    { id: 'dashboard' as NavTab, label: 'Lộ trình 100 Ngày', icon: LayoutDashboard },
    { id: 'workout' as NavTab, label: 'Luyện tập Hít đất', icon: Dumbbell },
    { id: 'run' as NavTab, label: 'Chạy bộ & Strava', icon: Footprints },
    { id: 'library' as NavTab, label: 'Thư viện bài tập', icon: BookOpen },
  ];

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
    <header className="hidden md:block sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-xs mb-8 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-400 p-[1px] shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-all">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-orange-500 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-condensed text-xl font-black text-slate-900 tracking-wider">
                100DAYS
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-orange-100 text-orange-600 border border-orange-200">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wide -mt-0.5">
              PUSH & RUN CHALLENGE
            </span>
          </div>
        </div>

        {/* Centered Segmented Navigation Pills */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-bold scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Athlete Control Telemetry */}
        <div className="flex items-center gap-3">
          {/* Day progress indicator */}
          <button
            onClick={onOpenDaySelector}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 transition-colors shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-bold">Ngày {currentDay}</span>
            <span className="text-slate-400 font-mono">/ 100</span>
          </button>

          {/* Telemetry badges */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-xl shadow-xs">
            <div
              title="Chuỗi ngày tập liên tục"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-orange-700 bg-orange-100 rounded-lg border border-orange-200"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{streak} ngày</span>
            </div>

            <div
              title="Kỷ lục hiệp hít đất nhiều nhất"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-100 rounded-lg border border-amber-200"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>{maxPushupsRecord} max</span>
            </div>
          </div>

          {/* Segmented Equipment Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shadow-xs">
            <button
              onClick={() => setEquipmentMode('dumbbell')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                isDumbbell
                  ? 'bg-white text-orange-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tạ Đơn
            </button>
            <button
              onClick={() => setEquipmentMode('bodyweight')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                !isDumbbell
                  ? 'bg-white text-orange-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bodyweight
            </button>
          </div>

          {/* Action icon buttons */}
          <div className="flex items-center gap-1 pl-1">
            <button
              onClick={onOpenHistory}
              title="Lịch sử buổi tập"
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              title="Sao lưu tiến độ"
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              title="Khôi phục tiến độ"
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}
export default DesktopHeader;
