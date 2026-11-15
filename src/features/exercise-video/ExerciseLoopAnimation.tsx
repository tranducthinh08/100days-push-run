import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

interface ExerciseLoopAnimationProps {
  animationType?: string;
  exerciseName: string;
}

export function ExerciseLoopAnimation({
  animationType = 'push',
  exerciseName,
}: ExerciseLoopAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [phase, setPhase] = useState<'down' | 'pause' | 'up'>('down');
  const [tempoSec, setTempoSec] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTempoSec((prev) => {
        const next = (prev + 1) % 4; // 0,1: down (2s), 2: pause (1s), 3: up (1s)
        if (next === 0 || next === 1) setPhase('down');
        else if (next === 2) setPhase('pause');
        else setPhase('up');
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const phaseLabel =
    phase === 'down'
      ? 'Hạ xuống có kiểm soát (2 giây)'
      : phase === 'pause'
      ? 'Dừng ổn định tại đáy (1 giây)'
      : 'Đẩy dứt khoát lên đỉnh (1 giây)';

  const phaseColor =
    phase === 'down'
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : phase === 'pause'
      ? 'text-orange-600 bg-orange-50 border-orange-200'
      : 'text-emerald-700 bg-emerald-50 border-emerald-200';

  return (
    <div className="relative overflow-hidden bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-between min-h-[220px] text-white select-none">
      {/* Background athletic grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Header / Tempo info */}
      <div className="relative z-10 w-full flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Activity className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span>Nhịp chuẩn (Tempo: 2-1-1)</span>
        </div>
        <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${phaseColor}`}>
          {phaseLabel}
        </span>
      </div>

      {/* Center Biomechanics Visual Simulator */}
      <div className="relative z-10 py-6 flex flex-col items-center justify-center">
        {animationType === 'push' && (
          <div className="flex flex-col items-center transition-all duration-700 ease-in-out">
            {/* Animated Push-up Body Silhouette */}
            <div
              className={`w-36 h-8 rounded-full border-2 border-orange-400 bg-orange-500/20 shadow-lg shadow-orange-500/20 flex items-center justify-between px-3 transition-all duration-700 ${
                phase === 'down'
                  ? 'translate-y-4 rotate-3 scale-95 border-amber-400'
                  : phase === 'pause'
                  ? 'translate-y-5 rotate-2 scale-90 border-orange-500 bg-orange-500/30'
                  : 'translate-y-0 rotate-0 scale-100 border-emerald-400'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-[10px] font-mono font-bold text-orange-300">
                {phase === 'down' ? 'HẠ NGỰC' : phase === 'pause' ? 'SIẾT CƠ' : 'ĐẨY LÊN'}
              </span>
              <span className="w-2 h-2 rounded-full bg-slate-400" />
            </div>
            {/* Ground Line */}
            <div className="w-48 h-1 bg-slate-700 rounded-full mt-4" />
          </div>
        )}

        {animationType !== 'push' && (
          <div className="flex flex-col items-center">
            <div
              className={`w-24 h-24 rounded-2xl border-2 border-orange-400/80 bg-orange-500/10 flex items-center justify-center text-center p-2 transition-all duration-500 ${
                phase === 'down'
                  ? 'scale-90 border-amber-400'
                  : phase === 'pause'
                  ? 'scale-85 border-orange-500 shadow-md shadow-orange-500/30'
                  : 'scale-105 border-emerald-400'
              }`}
            >
              <span className="text-xs font-bold text-orange-300">
                {phase === 'down' ? 'Pha Kéo / Hạ' : phase === 'pause' ? 'Khóa Khớp' : 'Pha Đẩy / Nâng'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar Controls */}
      <div className="relative z-10 w-full flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
        <span className="text-slate-400 truncate max-w-[200px]">{exerciseName}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3" /> Tạm dừng
              </>
            ) : (
              <>
                <Play className="w-3 h-3" /> Tiếp tục
              </>
            )}
          </button>
          <button
            onClick={() => {
              setTempoSec(0);
              setPhase('down');
            }}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Khởi động lại nhịp đếm"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ExerciseLoopAnimation;
