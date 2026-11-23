import React, { useState, useEffect } from 'react';
import { ArrowLeft, Flame, MapPin, RefreshCw, Gauge, CheckCircle2, Activity } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { getProgramDay } from '@/entities/program/model';
import { IntervalCoachView } from './components/IntervalCoachView';
import { GpsRunTrackerView } from './components/GpsRunTrackerView';
import { StravaSyncView } from './components/StravaSyncView';
import { TreadmillManualView } from './components/TreadmillManualView';
import { JumpRopeSyncView } from './components/JumpRopeSyncView';
import { StravaRunActivity } from '@/shared/lib/stravaApi';
import { requestWakeLock, releaseWakeLock } from '@/shared/lib/wakeLock';
import { Button } from '@/shared/ui/Button';

interface RunSessionPageProps {
  onBackToDashboard: () => void;
}

type RunTab = 'coach' | 'gps' | 'strava' | 'treadmill' | 'jumprope';

export function RunSessionPage({ onBackToDashboard }: RunSessionPageProps) {
  const { currentDay, equipmentMode, markDayCompleted } = useUserProgress();
  const programDay = getProgramDay(currentDay);

  const [activeTab, setActiveTab] = useState<RunTab>('coach');
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);

  useEffect(() => {
    requestWakeLock();
    return () => { releaseWakeLock(); };
  }, []);

  const handleFinishRun = (stats: { durationSec: number; distanceKm: number; pace: string }) => {
    markDayCompleted({
      dayNumber: currentDay,
      completedAt: new Date().toISOString(),
      type: 'run',
      runDistanceKm: stats.distanceKm,
      runDurationSec: stats.durationSec,
      runPace: stats.pace,
      cardioType: 'run',
      equipmentMode,
    });
    setCompletedMessage(`Đã hoàn thành buổi chạy ${stats.distanceKm} km (${stats.pace})!`);
  };

  const handleAssignStravaActivity = (act: StravaRunActivity) => {
    markDayCompleted({
      dayNumber: currentDay,
      completedAt: act.startDate,
      type: 'run',
      runDistanceKm: act.distanceKm,
      runDurationSec: act.movingTimeSec,
      runPace: act.averagePaceMinKm,
      cardioType: 'run',
      equipmentMode,
      notes: `Strava: ${act.name}`,
    });
    setCompletedMessage(`Đã ghi nhận bài chạy Strava: ${act.distanceKm} km!`);
  };

  const handleSaveTreadmill = (stats: { distanceKm: number; durationMinutes: number; pace: string }) => {
    markDayCompleted({
      dayNumber: currentDay,
      completedAt: new Date().toISOString(),
      type: 'run',
      runDistanceKm: stats.distanceKm,
      runDurationSec: stats.durationMinutes * 60,
      runPace: stats.pace,
      cardioType: 'run',
      equipmentMode,
      notes: `Chạy máy (Treadmill): ${stats.distanceKm} km`,
    });
    setCompletedMessage(`Đã lưu bài chạy máy ${stats.distanceKm} km!`);
  };

  const handleCompleteJumpRope = (jumps: number, durationMinutes: number, notes?: string) => {
    markDayCompleted({
      dayNumber: currentDay,
      completedAt: new Date().toISOString(),
      type: 'run',
      cardioType: 'jump-rope',
      jumpRopeCount: jumps,
      jumpRopeDurationSec: durationMinutes * 60,
      equipmentMode,
      notes: notes || `Nhảy dây ${jumps.toLocaleString('vi-VN')} cái (${durationMinutes}p)`,
    });
    setCompletedMessage(`Đã hoàn thành buổi nhảy dây ${jumps.toLocaleString('vi-VN')} cái (${durationMinutes}p)!`);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24 md:pb-12">
      {/* Top Header / Back Button */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBackToDashboard} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer">
          <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 border border-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <span className="font-mono text-xs uppercase tracking-wider font-bold">Quay lại Dashboard</span>
        </button>
        <span className="text-xs font-mono font-bold text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          Ngày {programDay.dayNumber} / 100 • Cardio
        </span>
      </div>

      {completedMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 flex items-center justify-between shadow-neon-emerald">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold text-sm">{completedMessage}</span>
          </div>
          <Button variant="primary" size="sm" onClick={onBackToDashboard}>Xem lộ trình</Button>
        </div>
      )}

      {/* Main Grid: Selector (Sidebar) + Display View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Sub-tab Mode Switcher */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-[#111622]/90 border border-white/[0.08] rounded-3xl p-2 sm:p-2.5 grid grid-cols-2 lg:grid-cols-1 gap-1.5 text-xs shadow-glass-hud">
            {[
              { id: 'coach', label: 'Interval Coach', icon: Flame },
              { id: 'jumprope', label: 'Nhảy dây Cardio', icon: Activity },
              { id: 'gps', label: 'GPS Ngoài trời', icon: MapPin },
              { id: 'treadmill', label: 'Chạy máy', icon: Gauge },
              { id: 'strava', label: 'Strava API', icon: RefreshCw },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as RunTab)}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 transition-all text-left cursor-pointer font-display ${
                  activeTab === id ? 'bg-[#00E5FF] text-black shadow-neon-cyan font-black' : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-current" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Run View */}
        <div className="lg:col-span-8 flex flex-col">
          {activeTab === 'coach' && (
            <IntervalCoachView
              runDetails={programDay.runDetails}
              onFinishRun={(s) => handleFinishRun({ durationSec: s.durationSec, distanceKm: s.distanceKm || 0, pace: s.pace || 'Interval' })}
            />
          )}

          {activeTab === 'jumprope' && (
            <JumpRopeSyncView
              dayNumber={currentDay}
              targetDistanceKm={programDay.runDetails?.distanceKmTarget || 3.5}
              suggestedJumps={programDay.runDetails?.jumpRopeTargetReps || 1100}
              suggestedMinutes={programDay.runDetails?.durationMinutesTarget || 20}
              onComplete={handleCompleteJumpRope}
            />
          )}

          {activeTab === 'gps' && (
            <GpsRunTrackerView onFinishRun={handleFinishRun} />
          )}

          {activeTab === 'strava' && (
            <StravaSyncView onAssignActivity={handleAssignStravaActivity} />
          )}

          {activeTab === 'treadmill' && (
            <TreadmillManualView onSaveManualRun={handleSaveTreadmill} />
          )}
        </div>
      </div>
    </div>
  );
}
export default RunSessionPage;
