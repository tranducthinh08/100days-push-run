import React from 'react';
import { Dumbbell, UserCheck, ShieldCheck, Wind } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { Badge } from '@/shared/ui/Badge';
import { Exercise } from '@/entities/exercise/types';
import { getExerciseById } from '@/entities/exercise/model';
import { ExerciseVideoPlayer } from '@/features/exercise-video/ExerciseVideoPlayer';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, isOpen, onClose }: ExerciseDetailModalProps) {
  if (!exercise) return null;

  const fallback = exercise.fallbackId ? getExerciseById(exercise.fallbackId) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Bài tập">
      <div className="flex flex-col gap-4 text-xs">
        {/* Title and Badges */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge
              variant={exercise.equipment === 'dumbbell' ? 'amber' : 'emerald'}
              size="sm"
            >
              {exercise.equipment === 'dumbbell' ? (
                <>
                  <Dumbbell className="w-3 h-3 mr-1" /> Có Tạ Đơn
                </>
              ) : (
                <>
                  <UserCheck className="w-3 h-3 mr-1" /> Không Dụng Cụ
                </>
              )}
            </Badge>
            <Badge variant="slate" size="sm">{exercise.category}</Badge>
          </div>
          <h2 className="text-base font-bold text-white font-display">{exercise.name}</h2>
        </div>

        {/* Video & Loop Animation Player */}
        <ExerciseVideoPlayer exercise={exercise} />

        {/* Fallback Notice */}
        {fallback && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex flex-col gap-1 text-amber-300 shadow-sm">
            <span className="font-semibold flex items-center gap-1.5 text-amber-400 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Bài tập thay thế khi không có tạ đơn:
            </span>
            <span className="text-white font-medium text-xs">
              👉 {fallback.name}
            </span>
          </div>
        )}

        {/* Target Muscles */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-slate-300 font-mono">Nhóm cơ tác động:</span>
          <div className="flex flex-wrap gap-1.5">
            {exercise.targetMuscles.map((muscle, idx) => (
              <span
                key={idx}
                className="bg-white/[0.06] border border-white/10 text-slate-300 px-2.5 py-1 rounded-xl text-[11px] font-medium"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Technique & Breathing Cues */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
          <span className="font-bold text-white flex items-center gap-1.5 font-display">
            <Wind className="w-4 h-4 text-[#FF8A00]" />
            Kỹ thuật thực hiện & Nhịp thở:
          </span>
          <div className="flex flex-col gap-2">
            {exercise.cues.map((cue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-[#FF5500]/20 text-[#FF8A00] flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold font-mono">
                  {idx + 1}
                </span>
                <p className="leading-relaxed text-[11px]">{cue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
export default ExerciseDetailModal;
