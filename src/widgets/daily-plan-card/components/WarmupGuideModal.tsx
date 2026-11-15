import React from 'react';
import { Clock, Wind, ChevronRight, Activity } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ResolvedExerciseItem } from '@/entities/exercise/types';

interface WarmupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  warmupExercises: ResolvedExerciseItem[];
  onSelectExercise: (exercise: ResolvedExerciseItem['exercise']) => void;
  onStartMainSession: () => void;
}

export function WarmupGuideModal({
  isOpen,
  onClose,
  warmupExercises,
  onSelectExercise,
  onStartMainSession,
}: WarmupGuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hướng dẫn Khởi Động (5 Phút)" maxHeight="max-h-[85vh]">
      <div className="flex flex-col gap-4 text-xs">
        {/* Intro Banner */}
        <div className="bg-[#FF5500]/10 border border-[#FF5500]/30 rounded-2xl p-4 flex items-start gap-3 shadow-neon-orange/20">
          <div className="w-9 h-9 rounded-xl bg-[#FF5500]/20 text-[#FF5500] flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm font-display">Bôi trơn khớp & Kích hoạt cơ bắp</h4>
            <p className="text-slate-300 mt-0.5 text-[11px] leading-relaxed">
              Dành 5 phút khởi động kỹ cổ tay, khớp vai và bả vai giúp phòng ngừa chấn thương, chống đau mỏi và giải phóng lực đẩy tối đa.
            </p>
          </div>
        </div>

        {/* Exercises List */}
        <div className="flex flex-col gap-3">
          <span className="font-bold text-white text-xs font-mono">
            Các động tác khởi động hôm nay ({warmupExercises.length} bài):
          </span>

          {warmupExercises.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3.5 flex flex-col gap-2.5 hover:border-[#FF5500]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF5500]/20 text-[#FF8A00] font-bold text-[10px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white text-sm">{item.exercise.name}</span>
                </div>
                <Badge variant="orange" size="sm">
                  {item.targetSets} hiệp x {item.targetReps}
                </Badge>
              </div>

              {/* Technique cues preview */}
              <div className="bg-black/40 rounded-xl p-2.5 flex flex-col gap-1 border border-white/[0.04]">
                <span className="font-semibold text-slate-300 flex items-center gap-1 text-[11px]">
                  <Wind className="w-3.5 h-3.5 text-[#FF8A00]" /> Kỹ thuật & Nhịp thở:
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {item.exercise.cues[0] || 'Xoay tròn nhẹ nhàng, kiểm soát biên độ không dùng quán tính.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">
                  Nhóm cơ: <strong className="text-slate-200">{item.exercise.targetMuscles.join(', ')}</strong>
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onSelectExercise(item.exercise);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#FF8A00] hover:text-[#FF6D00] cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-2 flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              onClose();
              onStartMainSession();
            }}
            leftIcon={<Activity className="w-4 h-4" />}
          >
            Đã khởi động xong! Vào bài tập chính
          </Button>
          <Button variant="outline" size="md" fullWidth onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export default WarmupGuideModal;
