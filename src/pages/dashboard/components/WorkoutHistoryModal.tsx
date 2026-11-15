import React from 'react';
import { Dumbbell, Footprints, Calendar, CheckCircle } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { Badge } from '@/shared/ui/Badge';

interface WorkoutHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkoutHistoryModal({ isOpen, onClose }: WorkoutHistoryModalProps) {
  const { completedDays } = useUserProgress();
  const logs = Object.values(completedDays).sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lịch sử Buổi tập Toàn diện" maxHeight="max-h-[85vh]">
      <div className="flex flex-col gap-3 text-xs">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Bạn chưa hoàn thành buổi tập nào. Hãy bắt đầu buổi tập hôm nay để ghi danh vào bảng vàng kỷ luật!
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.dayNumber}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between hover:border-[#FF5500]/40 transition-all shadow-sm"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm font-mono">
                    Ngày {log.dayNumber}
                  </span>
                  <Badge
                    variant={
                      log.type === 'push'
                        ? 'orange'
                        : log.type === 'run'
                        ? 'blue'
                        : 'emerald'
                    }
                    size="sm"
                  >
                    {log.type === 'push' ? 'Hít đất' : log.type === 'run' ? 'Chạy bộ' : 'Phục hồi'}
                  </Badge>
                  <span className="text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 font-mono">
                    {log.equipmentMode === 'dumbbell' ? 'Có Tạ' : 'Bodyweight'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                  {log.type === 'push' && log.totalPushupsDone !== undefined && (
                    <span className="flex items-center gap-1 font-mono text-[#FF8A00] font-bold">
                      <Dumbbell className="w-3.5 h-3.5" /> {log.totalPushupsDone} cái (Max hiệp: {log.maxPushupsSet})
                    </span>
                  )}
                  {log.type === 'run' && log.runDistanceKm !== undefined && (
                    <span className="flex items-center gap-1 font-mono text-[#00E5FF] font-bold">
                      <Footprints className="w-3.5 h-3.5" /> {log.runDistanceKm} km {log.runPace ? `(${log.runPace})` : ''}
                    </span>
                  )}
                </div>

                {log.notes && (
                  <span className="text-[10px] text-slate-400 italic">{log.notes}</span>
                )}
              </div>

              <div className="flex flex-col items-end text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(log.completedAt).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-[#00E676] bg-[#00E676]/15 px-2 py-0.5 rounded-md border border-[#00E676]/30 flex items-center gap-1 mt-1 text-[10px] font-bold font-mono">
                  <CheckCircle className="w-3 h-3 text-[#00E676]" /> ĐÃ HOÀN THÀNH
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
export default WorkoutHistoryModal;
