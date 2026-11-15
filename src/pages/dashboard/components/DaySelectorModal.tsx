import React, { useState } from 'react';
import { Check, Star, Footprints, Dumbbell, HeartPulse } from 'lucide-react';
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
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
              selectedPhase === 'all' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tất cả (100)
          </button>
          <button
            onClick={() => setSelectedPhase(1)}
            className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
              selectedPhase === 1 ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            GĐ 1 (1-30)
          </button>
          <button
            onClick={() => setSelectedPhase(2)}
            className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
              selectedPhase === 2 ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            GĐ 2 (31-70)
          </button>
          <button
            onClick={() => setSelectedPhase(3)}
            className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
              selectedPhase === 3 ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
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

            const currentBorderClass =
              item.type === 'push'
                ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-400/40 shadow-md shadow-orange-500/10'
                : item.type === 'run'
                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-400/40 shadow-md shadow-blue-500/10'
                : 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400/40 shadow-md shadow-emerald-500/10';

            return (
              <button
                key={item.dayNumber}
                onClick={() => handleSelectDay(item.dayNumber)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border text-xs font-mono transition-all active:scale-95 min-h-[58px] ${
                  isCurrent
                    ? currentBorderClass
                    : isDone
                    ? 'border-slate-200 bg-white text-slate-800 shadow-sm'
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="absolute top-1 right-1">
                  {isDone ? (
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  ) : item.isTestDay ? (
                    <Star className="w-3 h-3 text-amber-500 fill-amber-400/40" />
                  ) : null}
                </div>

                <span className="text-sm font-bold">{item.dayNumber}</span>

                <div className="flex items-center gap-0.5 text-[10px] font-sans mt-0.5">
                  {item.type === 'push' ? (
                    <Dumbbell className="w-2.5 h-2.5 text-orange-500" />
                  ) : item.type === 'run' ? (
                    <Footprints className="w-2.5 h-2.5 text-blue-600" />
                  ) : (
                    <HeartPulse className="w-2.5 h-2.5 text-emerald-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around text-[11px] pt-3 border-t border-slate-100 font-medium">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Hít đất</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Chạy bộ</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Giãn cơ</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export default DaySelectorModal;
