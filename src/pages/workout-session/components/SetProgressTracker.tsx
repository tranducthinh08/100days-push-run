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
                ? 'bg-[#FF5500] border-2 border-white text-white font-bold shadow-neon-orange scale-105'
                : isDone
                ? 'bg-[#00E676]/15 border border-[#00E676]/30 text-[#00E676] font-bold'
                : 'bg-white/[0.04] border border-white/[0.08] text-slate-400'
            }`}
          >
            {isDone ? (
              <Check className="w-3.5 h-3.5 text-[#00E676] stroke-[3]" />
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
