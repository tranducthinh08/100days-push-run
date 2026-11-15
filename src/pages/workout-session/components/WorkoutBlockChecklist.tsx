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
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all text-xs shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="font-bold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500 font-mono font-bold">
            ({completedCount}/{items.length})
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-[11px]">{isOpen ? 'Thu gọn' : 'Xem bài'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 pt-0 flex flex-col gap-2 border-t border-slate-100 mt-1">
          {items.map((item) => {
            const isChecked = !!checkedIds[item.exerciseId];
            return (
              <div
                key={item.exerciseId}
                onClick={() => toggleCheck(item.exerciseId)}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-orange-300'
                }`}
              >
                <div className="pt-0.5 shrink-0 text-orange-600">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-semibold ${isChecked ? 'line-through text-slate-400' : ''}`}>
                      {item.exercise.name.split('(')[0]}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 font-bold">
                      {item.targetSets} hiệp x {item.targetReps}
                    </span>
                  </div>

                  {item.isFallback && (
                    <span className="text-[10px] text-orange-600 font-bold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3" /> Thay thế Bodyweight
                    </span>
                  )}

                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 font-medium">
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
