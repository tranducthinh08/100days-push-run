import React, { useState } from 'react';
import { UserProgressProvider } from '@/entities/user-progress/useUserProgress';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { WorkoutSessionPage } from '@/pages/workout-session/WorkoutSessionPage';
import { RunSessionPage } from '@/pages/run-session/RunSessionPage';
import { ExerciseLibraryPage } from '@/pages/exercise-library/ExerciseLibraryPage';
import { BottomNavigation, NavTab } from '@/widgets/bottom-navigation/BottomNavigation';
import { DesktopHeader } from '@/widgets/desktop-header/DesktopHeader';
import { DaySelectorModal } from '@/pages/dashboard/components/DaySelectorModal';
import { WorkoutHistoryModal } from '@/pages/dashboard/components/WorkoutHistoryModal';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleStartSession = (type: 'push' | 'run' | 'recovery') => {
    if (type === 'push') {
      setActiveTab('workout');
    } else if (type === 'run') {
      setActiveTab('run');
    } else {
      setActiveTab('library');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col antialiased selection:bg-[#FF5500] selection:text-white relative overflow-x-hidden">
      {/* Ambient Background Spotlights */}
      <div className="fixed top-0 left-1/4 w-[750px] h-[550px] flame-radial rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[600px] h-[500px] cyan-radial rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-emerald-500/10 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Desktop Navigation Top Bar (>= 768px) */}
      <DesktopHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDaySelector={() => setIsDaySelectorOpen(true)}
      />

      {/* Main Content Area: High-Performance 1880px Responsive Container */}
      <main className="flex-1 w-full max-w-[1880px] mx-auto px-4 lg:px-6 py-4 pb-28 md:pb-8 hud-pattern">
        {activeTab === 'dashboard' && (
          <DashboardPage onStartSession={handleStartSession} />
        )}
        {activeTab === 'workout' && (
          <WorkoutSessionPage onBackToDashboard={() => setActiveTab('dashboard')} />
        )}
        {activeTab === 'run' && (
          <RunSessionPage onBackToDashboard={() => setActiveTab('dashboard')} />
        )}
        {activeTab === 'library' && (
          <ExerciseLibraryPage />
        )}
      </main>

      {/* Mobile-Only Bottom Navigation (< 768px) */}
      <div className="md:hidden">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Global Modals triggered from Desktop Header */}
      <DaySelectorModal
        isOpen={isDaySelectorOpen}
        onClose={() => setIsDaySelectorOpen(false)}
      />
      <WorkoutHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <UserProgressProvider>
      <AppContent />
    </UserProgressProvider>
  );
}

export default App;
