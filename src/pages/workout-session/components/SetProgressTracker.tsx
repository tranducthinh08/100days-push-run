import React from 'react';
import { Check } from 'lucide-react';

interface SetProgressTrackerProps {
  sets: number[];
  completedSets: number[];
  currentSetIndex: number;
}

export function SetProgressTracker({
  sets,
  completedSets,
  currentSetIndex,
}: SetProgressTrackerProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
      {sets.map((target, idx) => {
        const isDone = idx < currentSetIndex;
        const isCurrent = idx === currentSetIndex;
        const actualReps = completedSets[idx];

        return (
          <div
            key={idx}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all shrink-0 ${
              isCurrent
                ? 'bg-orange-50 border-2 border-orange-500 text-orange-600 font-bold ring-2 ring-orange-200 scale-105 shadow-sm'
                : isDone
                ? 'bg-slate-100 border-slate-200 text-slate-700 font-medium'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            {isDone ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            ) : (
              <span className="text-[10px] text-slate-400 font-sans">H{idx + 1}:</span>
            )}
            <span>
              {isDone ? actualReps : target}
            </span>
          </div>
        );
      })}
    </div>
  );
}
export default SetProgressTracker;
