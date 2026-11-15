import React from 'react';
import { Clock, ShieldCheck, Wind, CheckCircle, ChevronRight, Activity } from 'lucide-react';
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
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Khởi động bôi trơn khớp & kích hoạt cơ</h4>
            <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">
              Dành 5 phút khởi động kỹ cổ tay, khớp vai và bả vai giúp ngăn ngừa chấn thương, chống đau mỏi và nâng cao hiệu suất đẩy lực tối đa.
            </p>
          </div>
        </div>

        {/* Exercises List */}
        <div className="flex flex-col gap-3">
          <span className="font-bold text-slate-800 text-xs">
            Các động tác khởi động hôm nay ({warmupExercises.length} bài):
          </span>

          {warmupExercises.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-xs hover:border-orange-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{item.exercise.name}</span>
                </div>
                <Badge variant="orange" size="sm">
                  {item.targetSets} hiệp x {item.targetReps}
                </Badge>
              </div>

              {/* Technique cues preview */}
              <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col gap-1 border border-slate-100">
                <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                  <Wind className="w-3.5 h-3.5 text-orange-500" /> Kỹ thuật & Nhịp thở:
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {item.exercise.cues[0] || 'Xoay tròn nhẹ nhàng, kiểm soát biên độ không dùng quán tính.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">
                  Nhóm cơ: <strong>{item.exercise.targetMuscles.join(', ')}</strong>
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onSelectExercise(item.exercise);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700"
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
