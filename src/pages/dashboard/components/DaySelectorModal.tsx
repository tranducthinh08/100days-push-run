import React, { useState } from 'react';
import { Check, Star, Footprints, Dumbbell, Leaf } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { PROGRAM_DAYS } from '@/entities/program/model';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { ProgramPhase } from '@/entities/program/types';

interface DaySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DaySelectorModal({ isOpen, onClose }: DaySelectorModalProps) {
  const { currentDay, setCurrentDay, completedDays } = useUserProgress();
  const [selectedPhase, setSelectedPhase] = useState<ProgramPhase | 'all'>('all');

  const filteredDays = PROGRAM_DAYS.filter((d) =>
    selectedPhase === 'all' ? true : d.phase === selectedPhase
  );

  const handleSelectDay = (dayNum: number) => {
    setCurrentDay(dayNum);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lộ trình 100 Ngày" maxHeight="max-h-[88vh]">
      <div className="flex flex-col gap-4">
        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedPhase === 'all' ? 'bg-[#FF5500] text-white shadow-neon-orange/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất cả (100)
          </button>
          <button
            onClick={() => setSelectedPhase(1)}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedPhase === 1 ? 'bg-[#FF5500] text-white shadow-neon-orange/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            GĐ 1 (1-30)
          </button>
          <button
            onClick={() => setSelectedPhase(2)}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedPhase === 2 ? 'bg-[#FF5500] text-white shadow-neon-orange/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            GĐ 2 (31-70)
          </button>
          <button
            onClick={() => setSelectedPhase(3)}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedPhase === 3 ? 'bg-[#FF5500] text-white shadow-neon-orange/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            GĐ 3 (71-100)
          </button>
        </div>

        {/* 100 Days Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
          {filteredDays.map((item) => {
            const isDone = !!completedDays[item.dayNumber];
            const isCurrent = item.dayNumber === currentDay;

            return (
              <button
                key={item.dayNumber}
                onClick={() => handleSelectDay(item.dayNumber)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border text-xs font-mono transition-all active:scale-95 min-h-[58px] cursor-pointer ${
                  isCurrent
                    ? 'border-[#FF5500] bg-gradient-to-br from-[#FF5500] to-[#E53900] text-white ring-2 ring-white/40 shadow-neon-orange font-black scale-105'
                    : isDone
                    ? 'border-[#00E676]/30 bg-[#00E676]/10 text-[#00E676]'
                    : item.type === 'run'
                    ? 'border-[#00E5FF]/20 bg-[#00E5FF]/5 text-[#00E5FF] hover:border-[#00E5FF]/40'
                    : item.type === 'recovery'
                    ? 'border-[#00E676]/20 bg-[#00E676]/5 text-[#00E676] hover:border-[#00E676]/40'
                    : 'border-white/[0.08] bg-white/[0.04] text-slate-300 hover:border-[#FF5500]/40'
                }`}
              >
                <div className="absolute top-1 right-1">
                  {isDone ? (
                    <Check className="w-3 h-3 text-[#00E676] stroke-[3]" />
                  ) : item.isTestDay ? (
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ) : null}
                </div>

                <span className="text-sm font-bold">{item.dayNumber}</span>

                <div className="flex items-center gap-0.5 text-[10px] mt-0.5">
                  {item.type === 'push' ? (
                    <Dumbbell className="w-2.5 h-2.5 text-[#FF8A00]" />
                  ) : item.type === 'run' ? (
                    <Footprints className="w-2.5 h-2.5 text-[#00E5FF]" />
                  ) : (
                    <Leaf className="w-2.5 h-2.5 text-[#00E676]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around text-[11px] pt-3 border-t border-white/[0.08] font-mono font-medium">
          <div className="flex items-center gap-1.5 text-[#FF8A00]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />
            <span>Hít đất</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00E5FF]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
            <span>Chạy bộ</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00E676]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E676]" />
            <span>Giãn cơ</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export default DaySelectorModal;
