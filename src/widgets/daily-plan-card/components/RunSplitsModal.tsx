import React from 'react';
import { Modal } from '@/shared/ui/Modal';
import { RunDetails } from '@/entities/program/types';
import { Footprints, Clock, Activity, Gauge, Heart, Flame, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface RunSplitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  runDetails?: RunDetails;
  dayNumber: number;
  onStartRun?: () => void;
}

export function RunSplitsModal({
  isOpen,
  onClose,
  runDetails,
  dayNumber,
  onStartRun,
}: RunSplitsModalProps) {
  if (!runDetails) return null;
  const splits = runDetails.splits || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`GIÁO ÁN CHẠY BỘ - NGÀY ${dayNumber}`}
      maxHeight="max-h-[90vh]"
    >
      <div className="space-y-5 text-xs">
        {/* Hero Telemetry Stat Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#122234] to-[#0A121E] border border-[#00E5FF]/40 shadow-neon-cyan/20">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase tracking-wider block">
                MỤC TIÊU TỔNG THỂ
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-white font-mono">
                  {runDetails.durationMinutesTarget} phút
                </span>
                {runDetails.distanceKmTarget && (
                  <span className="text-base font-bold text-[#00E5FF] font-mono">
                    ~{runDetails.distanceKmTarget} km
                  </span>
                )}
              </div>
            </div>
            {runDetails.splitsSummary && (
              <span className="px-3 py-1.5 rounded-xl font-mono font-black text-xs text-black bg-[#00E5FF] shadow-neon-cyan">
                {runDetails.splitsSummary}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-white/[0.08] text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
              <span>{runDetails.paceGuidance}</span>
            </div>
            {runDetails.heartRateZone && (
              <div className="flex items-center gap-1.5 text-slate-300">
                <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{runDetails.heartRateZone}</span>
              </div>
            )}
            {runDetails.cadenceGuidance && (
              <div className="flex items-center gap-1.5 text-slate-300">
                <Gauge className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{runDetails.cadenceGuidance}</span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline of all Sets / Reps */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-[#00E5FF]" /> Lộ trình phân bổ từng hiệp ({splits.length} hiệp)
          </h4>

          <div className="space-y-2">
            {splits.map((split, idx) => (
              <div
                key={split.setNumber}
                className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex flex-col items-center justify-center font-mono">
                    <span className="text-[9px] text-[#00E5FF] font-bold">HIỆP</span>
                    <span className="text-sm font-black text-white">{idx + 1}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{split.work}</h5>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Tốc độ: <span className="text-[#00E5FF] font-bold">{split.pace}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right pl-3 border-l border-white/[0.08]">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Hồi phục:</span>
                  <span className="text-xs font-bold text-[#00E5FF] font-mono">{split.rest}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        {onStartRun && (
          <div className="pt-2">
            <Button
              variant="blue"
              size="lg"
              fullWidth
              onClick={() => {
                onClose();
                onStartRun();
              }}
              leftIcon={<Flame className="w-5 h-5" />}
              className="font-display font-black uppercase tracking-wider"
            >
              Bắt đầu bài chạy ngay (Mở Huấn Luyện Viên)
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
export default RunSplitsModal;
