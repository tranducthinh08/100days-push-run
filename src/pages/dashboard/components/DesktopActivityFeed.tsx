import React from 'react';
import { Dumbbell, Footprints, Calendar, ArrowRight, CheckCircle2, Sparkles, Activity } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { Badge } from '@/shared/ui/Badge';

interface DesktopActivityFeedProps {
  onOpenFullHistory: () => void;
}

export function DesktopActivityFeed({ onOpenFullHistory }: DesktopActivityFeedProps) {
  const { completedDays } = useUserProgress();
  const logs = Object.values(completedDays)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 4);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-condensed text-lg font-black text-slate-900 tracking-wider uppercase">
              Nhật ký Hoạt động Gần đây
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Lịch sử các buổi tập đã hoàn thành trong lộ trình
            </p>
          </div>
        </div>

        <button
          onClick={onOpenFullHistory}
          className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl hover:bg-orange-100"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {logs.length === 0 ? (
          <div className="text-center py-9 px-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              Chưa có dữ liệu buổi tập
            </span>
            <p className="text-[11px] text-slate-500 max-w-sm">
              Hoàn thành buổi tập hôm nay để lưu thông số hít đất, cự ly chạy và xây dựng chuỗi ngày kỷ luật (Streak)!
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.dayNumber}
              className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between hover:border-orange-300 hover:bg-orange-50/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    log.type === 'push'
                      ? 'bg-orange-100 text-orange-600'
                      : log.type === 'run'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {log.type === 'push' ? (
                    <Dumbbell className="w-4 h-4" />
                  ) : log.type === 'run' ? (
                    <Footprints className="w-4 h-4" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">Ngày {log.dayNumber}</span>
                    <Badge
                      variant={
                        log.type === 'push'
                          ? 'orange'
                          : log.type === 'run'
                          ? 'amber'
                          : 'blue'
                      }
                      size="sm"
                    >
                      {log.type === 'push' ? 'Hít đất' : log.type === 'run' ? 'Chạy bộ' : 'Phục hồi'}
                    </Badge>
                  </div>

                  <span className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {log.type === 'push' && log.totalPushupsDone !== undefined
                      ? `${log.totalPushupsDone} cái tích lũy (Max hiệp ${log.maxPushupsSet})`
                      : log.type === 'run' && log.runDistanceKm !== undefined
                      ? `${log.runDistanceKm} km ${log.runPace ? `(${log.runPace})` : ''}`
                      : 'Active recovery'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {new Date(log.completedAt).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default DesktopActivityFeed;
