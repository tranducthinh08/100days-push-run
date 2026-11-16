import React, { useState } from 'react';
import { DailyPlanCard } from '@/widgets/daily-plan-card/DailyPlanCard';
import { StatSummaryCard } from './StatSummaryCard';
import { DesktopRoadmapGrid } from './DesktopRoadmapGrid';
import { LeftAthleteHub } from './LeftAthleteHub';
import { VolumeAnalyticsChart } from './VolumeAnalyticsChart';
import { StravaConnectModal } from '@/features/strava-sync/StravaConnectModal';
import { useStravaSync } from '@/features/strava-sync/useStravaSync';
import { DayProgram, ProgramPhase } from '@/entities/program/types';
import { SyncStatus } from '@/features/cloud-sync/model/syncTypes';

interface DesktopDashboardViewProps {
  programDay: DayProgram;
  onStartSession: (type: 'push' | 'run' | 'recovery') => void;
  onOpenHistory: () => void;
  onOpenCloudSync?: () => void;
  syncPin?: string;
  syncStatus?: SyncStatus;
}

export function DesktopDashboardView({
  programDay,
  onStartSession,
  onOpenCloudSync,
  syncPin,
  syncStatus,
}: DesktopDashboardViewProps) {
  const [isStravaModalOpen, setIsStravaModalOpen] = useState(false);
  const [activePhase, setActivePhase] = useState<ProgramPhase>(
    programDay.phase || 1
  );
  const { isConnected, connectWithToken, disconnect, error } = useStravaSync();

  return (
    <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-16">
      {/* COLUMN 1: LEFT SIDEBAR / ATHLETE DAILY HUB (3 Cols) */}
      <div className="lg:col-span-3">
        <LeftAthleteHub
          programDay={programDay}
          onOpenStravaModal={() => setIsStravaModalOpen(true)}
          activePhase={activePhase}
          onSelectPhase={setActivePhase}
          onOpenCloudSync={onOpenCloudSync}
          syncPin={syncPin}
          syncStatus={syncStatus}
        />
      </div>

      {/* COLUMN 2: CENTER STAGE - WORKOUT HUD HERO (6 Cols) */}
      <div className="lg:col-span-6 space-y-6">
        <DailyPlanCard programDay={programDay} onStartSession={onStartSession} />
        <VolumeAnalyticsChart programDay={programDay} />
      </div>

      {/* COLUMN 3: RIGHT RAIL - 100-DAY MATRIX & TROPHY (3 Cols) */}
      <div className="lg:col-span-3 space-y-6">
        <DesktopRoadmapGrid activePhase={activePhase} onPhaseChange={setActivePhase} />
        <StatSummaryCard />
      </div>

      {/* Strava Connect Modal */}
      <StravaConnectModal
        isOpen={isStravaModalOpen}
        isConnected={isConnected}
        onClose={() => setIsStravaModalOpen(false)}
        onConnect={connectWithToken}
        onDisconnect={disconnect}
        error={error}
      />
    </div>
  );
}
export default DesktopDashboardView;
