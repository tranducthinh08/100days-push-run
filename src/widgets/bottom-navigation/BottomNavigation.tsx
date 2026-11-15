import React from 'react';
import { LayoutDashboard, Dumbbell, Footprints, BookOpen } from 'lucide-react';

export type NavTab = 'dashboard' | 'workout' | 'run' | 'library';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Lộ trình', icon: LayoutDashboard },
    { id: 'workout' as NavTab, label: 'Hít đất', icon: Dumbbell },
    { id: 'run' as NavTab, label: 'Chạy bộ', icon: Footprints },
    { id: 'library' as NavTab, label: 'Bài tập', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0E14]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-2xl pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all select-none active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-[#FF8A00] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#FF5500]/20 text-[#FF5500] shadow-neon-orange/40 scale-105' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
export default BottomNavigation;
