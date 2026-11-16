import React, { useState, useEffect } from 'react';
import { ArrowLeft, Flame, MapPin, RefreshCw, Gauge, CheckCircle2 } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { getProgramDay } from '@/entities/program/model';
import { IntervalCoachView } from './components/IntervalCoachView';
import { GpsRunTrackerView } from './components/GpsRunTrackerView';
import { StravaSyncView } from './components/StravaSyncView';
import { TreadmillManualView } from './components/TreadmillManualView';
import { StravaRunActivity } from '@/shared/lib/stravaApi';
import { requestWakeLock, releaseWakeLock } from '@/shared/lib/wakeLock';
import { Button } from '@/shared/ui/Button';

interface RunSessionPageProps {
  onBackToDashboard: () => void;
}

type RunTab = 'coach' | 'gps' | 'strava' | 'treadmill';

export function RunSessionPage({ onBackToDashboard }: RunSessionPageProps) {
  const { currentDay, equipmentMode, markDayCompleted } = useUserProgress();
  const programDay = getProgramDay(currentDay);

  const [activeTab, setActiveTab] = useState<RunTab>('coach');
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);

  useEffect(() => {
    requestWakeLock();
    return () => {
      releaseWakeLock();
    };
  }, []);

  const handleFinishRun = (stats: { durationSec: number; distanceKm: number; pace: string }) => {
    markDayCompleted({
      dayNumber: currentDay,
      completedAt: new Date().toISOString(),
      type: 'run',
      runDistanceKm: stats.distanceKm,
      runDurationSec: stats.durationSec,
      runPace: stats.pace,
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
      equipmentMode,
      notes: `Strava: ${act.name}`,
    });
    setCompletedMessage(`Đã đồng bộ bài chạy "${act.name}" (${act.distanceKm} km)!`);
  };

  const handleSaveTreadmill = (stats: { distanceKm: number; durationMinutes: number; pace: string }) => {
    markDayCompleted({
      dayNumber: currentDay,
      completedAt: new Date().toISOString(),
      type: 'run',
      runDistanceKm: stats.distanceKm,
      runDurationSec: stats.durationMinutes * 60,
      runPace: stats.pace,
      equipmentMode,
    });
    setCompletedMessage(`Đã lưu buổi chạy máy ${stats.distanceKm} km (${stats.durationMinutes} phút)!`);
  };

  return (
    <div className="flex flex-col gap-5 pb-16 pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium cursor-pointer font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </button>
        <span className="text-xs font-bold text-[#00E5FF] font-mono tracking-wide">
          Ngày {currentDay} &bull; Chạy bộ Sức bền Zone 2
        </span>
      </div>

      {completedMessage && (
        <div className="bg-[#00E676]/15 border border-[#00E676]/30 rounded-2xl p-4 flex items-center justify-between text-xs text-[#00E676] shadow-neon-green/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00E676] shrink-0" />
            <span className="font-bold font-mono">{completedMessage}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
            Về Lộ trình
          </Button>
        </div>
      )}

      {/* Responsive Workstation Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Guidance & Mode Selector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {programDay.runDetails && (
            <div className="bg-[#111622]/90 border border-white/[0.08] rounded-3xl p-6 flex flex-col gap-2 shadow-glass-hud relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent pointer-events-none" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00E5FF] font-mono">
                Mục tiêu Ngày {currentDay}
              </span>
              <h2 className="text-lg font-black text-white font-display tracking-wide">
                {programDay.runDetails.durationMinutesTarget} phút &bull; {programDay.runDetails.paceGuidance}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {programDay.runDetails.description}
              </p>
            </div>
          )}

          {/* Mode Selector Tabs */}
          <div className="bg-[#111622]/90 border border-white/[0.08] rounded-3xl p-2 sm:p-2.5 grid grid-cols-2 lg:grid-cols-1 gap-1.5 text-xs shadow-glass-hud">
            <button
              onClick={() => setActiveTab('coach')}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 transition-all text-left cursor-pointer font-display ${
                activeTab === 'coach'
                  ? 'bg-[#00E5FF] text-black shadow-neon-cyan font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Flame className="w-4 h-4 shrink-0 text-current" />
              <span className="truncate">Interval Coach</span>
            </button>
            <button
              onClick={() => setActiveTab('gps')}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 transition-all text-left cursor-pointer font-display ${
                activeTab === 'gps'
                  ? 'bg-[#00E5FF] text-black shadow-neon-cyan font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0 text-current" />
              <span className="truncate">GPS Ngoài trời</span>
            </button>
            <button
              onClick={() => setActiveTab('strava')}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 transition-all text-left cursor-pointer font-display ${
                activeTab === 'strava'
                  ? 'bg-[#00E5FF] text-black shadow-neon-cyan font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <RefreshCw className="w-4 h-4 shrink-0 text-current" />
              <span className="truncate">Strava API</span>
            </button>
            <button
              onClick={() => setActiveTab('treadmill')}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 transition-all text-left cursor-pointer font-display ${
                activeTab === 'treadmill'
                  ? 'bg-[#00E5FF] text-black shadow-neon-cyan font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Gauge className="w-4 h-4 shrink-0 text-current" />
              <span className="truncate">Chạy máy</span>
            </button>
          </div>
        </div>

        {/* Right Column: Active Run View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          {activeTab === 'coach' && (
            <IntervalCoachView
              runDetails={programDay.runDetails}
              onFinishRun={(s) => handleFinishRun({ durationSec: s.durationSec, distanceKm: s.distanceKm || 0, pace: s.pace || 'Interval' })}
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
