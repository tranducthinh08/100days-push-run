import React from 'react';
import { Play, Pause, Square, MapPin, AlertCircle, Compass, Radio } from 'lucide-react';
import { useRunTracker } from '@/features/gps-run-tracker/useRunTracker';
import { Button } from '@/shared/ui/Button';

interface GpsRunTrackerViewProps {
  onFinishRun: (stats: { durationSec: number; distanceKm: number; pace: string }) => void;
}

export function GpsRunTrackerView({ onFinishRun }: GpsRunTrackerViewProps) {
  const {
    isTracking,
    isPaused,
    distanceKm,
    elapsedSeconds,
    currentPace,
    currentSpeedKmh,
    splits,
    isSimulation,
    gpsError,
    setIsSimulation,
    startRun,
    pauseRun,
    resumeRun,
    resetRun,
  } = useRunTracker();

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handleFinish = () => {
    onFinishRun({
      durationSec: elapsedSeconds,
      distanceKm,
      pace: currentPace,
    });
    resetRun();
  };

  return (
    <div className="flex flex-col gap-4 bg-[#111622]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-5 md:p-6 shadow-glass-hud text-slate-100">
      {/* Mode toggle: GPS real vs Simulated test */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5 text-slate-300 font-mono">
          <MapPin className="w-4 h-4 text-[#00E5FF]" />
          <span className="font-semibold">
            {isSimulation ? 'Chế độ Giả lập (Test máy tính)' : 'Định vị GPS thực tế'}
          </span>
        </div>

        {!isTracking && (
          <button
            onClick={() => setIsSimulation(!isSimulation)}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#00E5FF] hover:text-white px-2.5 py-1 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 transition-colors font-mono cursor-pointer"
          >
            <Radio className="w-3 h-3" />
            {isSimulation ? 'Chuyển sang GPS thật' : 'Bật Giả lập'}
          </button>
        )}
      </div>

      {gpsError && !isSimulation && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{gpsError} (Bạn có thể bấm "Bật Giả lập" để chạy thử)</span>
        </div>
      )}

      {/* Giant Distance Display */}
      <div className="flex flex-col items-center py-2">
        <span className="font-mono text-7xl sm:text-8xl font-black text-white tracking-tight leading-none drop-shadow-[0_0_35px_rgba(0,229,255,0.4)]">
          {distanceKm}
        </span>
        <span className="text-xs uppercase tracking-widest text-[#00E5FF] font-black mt-2 font-display">
          QUÃNG ĐƯỜNG (KM)
        </span>
      </div>

      {/* Stats Grid: Time, Pace, Speed */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <div className="bg-[#181D2D]/90 border border-white/[0.08] p-3 rounded-2xl flex flex-col items-center shadow-inner">
          <span className="text-[10px] text-slate-400 font-medium font-mono">Thời gian</span>
          <span className="font-mono text-lg font-bold text-white">{timeFormatted}</span>
        </div>

        <div className="bg-[#FF5500]/10 border border-[#FF5500]/25 p-3 rounded-2xl flex flex-col items-center shadow-inner">
          <span className="text-[10px] text-[#FF8A00] font-medium font-mono">Pace TB</span>
          <span className="font-mono text-lg font-bold text-[#FF8A00]">{currentPace}</span>
        </div>

        <div className="bg-[#181D2D]/90 border border-white/[0.08] p-3 rounded-2xl flex flex-col items-center shadow-inner">
          <span className="text-[10px] text-slate-400 font-medium font-mono">Tốc độ</span>
          <span className="font-mono text-lg font-bold text-white">{currentSpeedKmh} <span className="text-[10px] font-normal text-slate-400">km/h</span></span>
        </div>
      </div>

      {/* KM Splits */}
      {splits.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.08]">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1 font-mono">
            <Compass className="w-3.5 h-3.5 text-[#00E5FF]" />
            Splits theo từng Kilomet:
          </span>
          <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto">
            {splits.map((s) => (
              <div key={s.km} className="bg-[#181D2D]/90 border border-white/[0.08] px-2.5 py-1.5 rounded-xl flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">KM {s.km}:</span>
                <span className="text-[#00E5FF] font-bold">{s.pace}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center gap-2 pt-2">
        {!isTracking ? (
          <Button
            variant="blue"
            size="lg"
            fullWidth
            onClick={startRun}
            leftIcon={<Play className="w-5 h-5 fill-black" />}
            className="h-13 font-display uppercase tracking-wider"
          >
            Bắt đầu chạy GPS
          </Button>
        ) : isPaused ? (
          <>
            <Button
              variant="blue"
              size="lg"
              fullWidth
              onClick={resumeRun}
              leftIcon={<Play className="w-5 h-5 fill-black" />}
              className="h-13 font-display uppercase tracking-wider"
            >
              Tiếp tục
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleFinish}
              leftIcon={<Square className="w-5 h-5 text-rose-400" />}
              className="h-13"
            >
              Kết thúc
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={pauseRun}
              leftIcon={<Pause className="w-5 h-5" />}
              className="h-13 font-display uppercase tracking-wider"
            >
              Tạm dừng
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={handleFinish}
              leftIcon={<Square className="w-5 h-5" />}
              className="h-13"
            >
              Kết thúc
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
export default GpsRunTrackerView;
