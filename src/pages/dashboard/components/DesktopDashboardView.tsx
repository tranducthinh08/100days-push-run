import React from 'react';
import { DailyPlanCard } from '@/widgets/daily-plan-card/DailyPlanCard';
import { StatSummaryCard } from './StatSummaryCard';
import { DesktopRoadmapGrid } from './DesktopRoadmapGrid';
import { DesktopActivityFeed } from './DesktopActivityFeed';
import { DesktopStravaQuickCard } from './DesktopStravaQuickCard';
import { DayProgram } from '@/entities/program/types';

interface DesktopDashboardViewProps {
  programDay: DayProgram;
  onStartSession: (type: 'push' | 'run' | 'recovery') => void;
  onOpenHistory: () => void;
}

export function DesktopDashboardView({
  programDay,
  onStartSession,
  onOpenHistory,
}: DesktopDashboardViewProps) {
  return (
    <div className="hidden md:grid grid-cols-12 gap-6 items-start pb-16">
      {/* Left Column: Today's Mission & Active Training (7 Cols) */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
        <DailyPlanCard programDay={programDay} onStartSession={onStartSession} />
        <StatSummaryCard />
        <DesktopActivityFeed onOpenFullHistory={onOpenHistory} />
      </div>

      {/* Right Column: Roadmap & Intelligence (5 Cols) */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        <DesktopRoadmapGrid />
        <DesktopStravaQuickCard />
      </div>
    </div>
  );
}
export default DesktopDashboardView;
