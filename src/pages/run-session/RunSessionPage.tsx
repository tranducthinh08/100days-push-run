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
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </button>
        <span className="text-xs font-bold text-orange-600 font-condensed tracking-wide">
          Ngày {currentDay} &bull; Chạy bộ Sức bền
        </span>
      </div>

      {completedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{completedMessage}</span>
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
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col gap-2 shadow-xl shadow-slate-200/40">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 font-condensed">
                Mục tiêu Ngày {currentDay}
              </span>
              <h2 className="text-lg font-black text-slate-900 font-condensed tracking-wide">
                {programDay.runDetails.durationMinutesTarget} phút &bull; {programDay.runDetails.paceGuidance}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {programDay.runDetails.description}
              </p>
            </div>
          )}

          {/* Mode Selector Tabs */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-2.5 flex flex-col gap-1 text-xs shadow-md">
            <button
              onClick={() => setActiveTab('coach')}
              className={`w-full py-2.5 px-3.5 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                activeTab === 'coach' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Flame className="w-4 h-4 shrink-0" /> Interval / Tempo Coach
            </button>
            <button
              onClick={() => setActiveTab('gps')}
              className={`w-full py-2.5 px-3.5 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                activeTab === 'gps' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" /> Định vị GPS Ngoài trời
            </button>
            <button
              onClick={() => setActiveTab('strava')}
              className={`w-full py-2.5 px-3.5 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                activeTab === 'strava' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className="w-4 h-4 shrink-0" /> Đồng bộ từ Strava API
            </button>
            <button
              onClick={() => setActiveTab('treadmill')}
              className={`w-full py-2.5 px-3.5 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                activeTab === 'treadmill' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Gauge className="w-4 h-4 shrink-0" /> Chạy máy (Treadmill)
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
