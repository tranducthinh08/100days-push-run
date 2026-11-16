import React, { useState } from 'react';
import { Gauge, Clock, Save } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface TreadmillManualViewProps {
  onSaveManualRun: (stats: { distanceKm: number; durationMinutes: number; pace: string }) => void;
}

export function TreadmillManualView({ onSaveManualRun }: TreadmillManualViewProps) {
  const [distance, setDistance] = useState('5.0');
  const [duration, setDuration] = useState('30');

  const distNum = parseFloat(distance) || 0;
  const durNum = parseInt(duration, 10) || 0;

  const calculatedPace =
    distNum > 0 && durNum > 0
      ? `${(durNum / distNum).toFixed(1)} min/km`
      : '--:--';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (distNum <= 0 || durNum <= 0) return;
    onSaveManualRun({
      distanceKm: distNum,
      durationMinutes: durNum,
      pace: calculatedPace,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#111622]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-5 md:p-6 flex flex-col gap-4 shadow-glass-hud text-slate-100">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-bold text-white font-display">Nhập thông số chạy máy (Treadmill)</h3>
        <p className="text-xs text-slate-400 font-mono">
          Dành cho các buổi chạy trong nhà hoặc không mang điện thoại.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Distance input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
            <Gauge className="w-3.5 h-3.5 text-[#00E5FF]" />
            Quãng đường (km)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="100"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
            className="w-full bg-[#181D2D] border border-white/10 rounded-2xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 shadow-sm transition-all"
          />
        </div>

        {/* Duration input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
            Thời gian (phút)
          </label>
          <input
            type="number"
            step="1"
            min="1"
            max="300"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="w-full bg-[#181D2D] border border-white/10 rounded-2xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Computed Pace preview */}
      <div className="bg-[#181D2D]/90 border border-white/[0.08] rounded-2xl p-3.5 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium font-mono">Tốc độ ước tính (Pace):</span>
        <span className="font-mono font-bold text-[#00E5FF] text-sm">{calculatedPace}</span>
      </div>

      <Button
        variant="blue"
        size="lg"
        type="submit"
        fullWidth
        leftIcon={<Save className="w-5 h-5" />}
        className="h-13 font-display uppercase tracking-wider"
      >
        Lưu kết quả buổi chạy máy
      </Button>
    </form>
  );
}
export default TreadmillManualView;
