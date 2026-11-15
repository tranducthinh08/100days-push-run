import React, { useState } from 'react';
import { Download, Upload, History } from 'lucide-react';
import { PhaseProgressBar } from '@/widgets/phase-progress-bar/PhaseProgressBar';
import { EquipmentToggle } from '@/widgets/equipment-toggle/EquipmentToggle';
import { DailyPlanCard } from '@/widgets/daily-plan-card/DailyPlanCard';
import { StatSummaryCard } from './components/StatSummaryCard';
import { DaySelectorModal } from './components/DaySelectorModal';
import { WorkoutHistoryModal } from './components/WorkoutHistoryModal';
import { DesktopDashboardView } from './components/DesktopDashboardView';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { getProgramDay } from '@/entities/program/model';
import { exportAllData, importAllData } from '@/shared/lib/storage';

interface DashboardPageProps {
  onStartSession: (type: 'push' | 'run' | 'recovery') => void;
}

export function DashboardPage({ onStartSession }: DashboardPageProps) {
  const { currentDay } = useUserProgress();
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const programDay = getProgramDay(currentDay);

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
        setImportStatus('Khôi phục dữ liệu thành công!');
        setTimeout(() => window.location.reload(), 800);
      } else {
        setImportStatus('Tệp sao lưu không hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      {/* DESKTOP LAYOUT (>= 768px): Bento Grid Multi-Column */}
      <DesktopDashboardView
        programDay={programDay}
        onStartSession={onStartSession}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      {/* MOBILE LAYOUT (< 768px): Mobile-First Stack */}
      <div className="md:hidden flex flex-col gap-4 pb-24">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF8A00]">
              THỬ THÁCH 100 NGÀY
            </span>
            <h1 className="text-xl font-black text-white tracking-tight font-display">
              100DAYS ATHLETE PRO
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              title="Lịch sử buổi tập"
              className="w-9 h-9 rounded-xl bg-[#111622] border border-white/10 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors shadow-xs"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              title="Sao lưu tiến độ (Export JSON)"
              className="w-9 h-9 rounded-xl bg-[#111622] border border-white/10 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              title="Khôi phục tiến độ (Import JSON)"
              className="w-9 h-9 rounded-xl bg-[#111622] border border-white/10 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="bg-[#FF5500]/15 text-[#FF8A00] text-xs px-3 py-2 rounded-xl text-center border border-[#FF5500]/30 font-semibold font-mono">
            {importStatus}
          </div>
        )}

        {/* Progress Bar & Phase Info */}
        <PhaseProgressBar onOpenDaySelector={() => setIsDayModalOpen(true)} />

        {/* Global Equipment Switcher */}
        <EquipmentToggle />

        {/* Today's Workout Card with 3 Blocks */}
        <DailyPlanCard programDay={programDay} onStartSession={onStartSession} />

        {/* Quick Stats Summary */}
        <StatSummaryCard />
      </div>

      {/* Shared Modals */}
      <DaySelectorModal isOpen={isDayModalOpen} onClose={() => setIsDayModalOpen(false)} />
      <WorkoutHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} />
    </div>
  );
}
export default DashboardPage;
