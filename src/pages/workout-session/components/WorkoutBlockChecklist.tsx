import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckSquare, Square, ShieldCheck } from 'lucide-react';
import { ResolvedExerciseItem } from '@/entities/exercise/types';

interface WorkoutBlockChecklistProps {
  title: string;
  items: ResolvedExerciseItem[];
  color: 'emerald' | 'sky';
}

export function WorkoutBlockChecklist({ title, items }: WorkoutBlockChecklistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = items.filter((i) => checkedIds[i.exerciseId]).length;

  return (
    <div className="bg-[#111622]/90 border border-white/[0.08] rounded-2xl overflow-hidden transition-all text-xs shadow-glass-hud">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-white/[0.04] transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
          <span className="font-bold text-white font-display">{title}</span>
          <span className="text-[11px] text-slate-400 font-mono font-bold">
            ({completedCount}/{items.length})
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px]">{isOpen ? 'Thu gọn' : 'Xem bài'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 pt-0 flex flex-col gap-2 border-t border-white/[0.06] mt-1">
          {items.map((item) => {
            const isChecked = !!checkedIds[item.exerciseId];
            return (
              <div
                key={item.exerciseId}
                onClick={() => toggleCheck(item.exerciseId)}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-black/40 border-white/[0.04] text-slate-500'
                    : 'bg-white/[0.04] border-white/[0.08] text-slate-200 hover:border-[#FF5500]/40'
                }`}
              >
                <div className="pt-0.5 shrink-0 text-[#FF5500]">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-[#00E676]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-semibold ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                      {item.exercise.name.split('(')[0]}
                    </span>
                    <span className="font-mono text-[11px] text-[#FF8A00] font-bold">
                      {item.targetSets} hiệp x {item.targetReps}
                    </span>
                  </div>

                  {item.isFallback && (
                    <span className="text-[10px] text-[#FF8A00] font-bold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3" /> Thay thế Bodyweight
                    </span>
                  )}

                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-medium">
                    {item.exercise.cues[0]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default WorkoutBlockChecklist;
