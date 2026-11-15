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
    <div className="min-h-screen bg-transparent text-slate-900 flex flex-col antialiased selection:bg-orange-500 selection:text-white">
      {/* Desktop Navigation Top Bar (>= 768px) */}
      <DesktopHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDaySelector={() => setIsDaySelectorOpen(true)}
      />

      {/* Main Content Area: Responsive container (max-w-7xl on desktop, max-w-md on mobile) */}
      <main className="flex-1 w-full max-w-md md:max-w-7xl mx-auto px-4 md:px-8">
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
