import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { playIntervalPhaseSound } from '@/shared/lib/audio';
import { triggerVibration } from '@/shared/lib/vibrate';
import { RunDetails } from '@/entities/program/types';

interface IntervalCoachViewProps {
  runDetails?: RunDetails;
  onFinishRun: (stats: { durationSec: number; distanceKm?: number; pace?: string }) => void;
}

type IntervalPhase = 'warmup' | 'work' | 'recovery' | 'cooldown' | 'done';

export function IntervalCoachView({ runDetails, onFinishRun }: IntervalCoachViewProps) {
  const config = runDetails?.intervalConfig || { workDurationSec: 120, recoveryDurationSec: 60, repetitions: 5 };
  const totalReps = config.repetitions;

  const [currentRep, setCurrentRep] = useState(1);
  const [phase, setPhase] = useState<IntervalPhase>('warmup');
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [initialPhaseSeconds, setInitialPhaseSeconds] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  useEffect(() => {
    if (!isActive || phase === 'done') return;

    const timer = setInterval(() => {
      setTotalElapsedTime((prev) => prev + 1);
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handlePhaseTransition();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, currentRep, totalReps, config]);

  const handlePhaseTransition = () => {
    if (phase === 'warmup') {
      setPhase('work');
      setSecondsLeft(config.workDurationSec);
      setInitialPhaseSeconds(config.workDurationSec);
      playIntervalPhaseSound('work');
      triggerVibration([200, 100, 200]);
    } else if (phase === 'work') {
      if (currentRep < totalReps) {
        setPhase('recovery');
        setSecondsLeft(config.recoveryDurationSec);
        setInitialPhaseSeconds(config.recoveryDurationSec);
        playIntervalPhaseSound('recovery');
        triggerVibration(150);
      } else {
        setPhase('cooldown');
        setSecondsLeft(180);
        setInitialPhaseSeconds(180);
        playIntervalPhaseSound('recovery');
      }
    } else if (phase === 'recovery') {
      setCurrentRep((r) => r + 1);
      setPhase('work');
      setSecondsLeft(config.workDurationSec);
      setInitialPhaseSeconds(config.workDurationSec);
      playIntervalPhaseSound('work');
      triggerVibration([200, 100, 200]);
    } else if (phase === 'cooldown') {
      setPhase('done');
      setIsActive(false);
      triggerVibration([300, 100, 300]);
    }
  };

  const skipCurrentPhase = () => {
    handlePhaseTransition();
  };

  const handleCompleteEarly = () => {
    const mins = Math.max(1, Math.round(totalElapsedTime / 60));
    const estimatedKm = +(mins * 0.15).toFixed(2);
    onFinishRun({
      durationSec: totalElapsedTime,
      distanceKm: estimatedKm,
      pace: 'Interval',
    });
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const progressPercent = initialPhaseSeconds > 0 ? ((initialPhaseSeconds - secondsLeft) / initialPhaseSeconds) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 bg-[#111622]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-glass-hud text-slate-100">
      {/* Phase status indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono ${
              phase === 'work'
                ? 'bg-[#FF5500]/20 text-[#FF8A00] border border-[#FF5500]/40'
                : phase === 'recovery'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            {phase === 'warmup'
              ? 'Khởi động đi bộ'
              : phase === 'work'
              ? '🔥 CHẠY NHANH'
              : phase === 'recovery'
              ? 'Đi bộ phục hồi'
              : phase === 'cooldown'
              ? 'Thả lỏng cơ thể'
              : 'Hoàn thành'}
          </span>
        </div>

        {phase === 'work' || phase === 'recovery' ? (
          <span className="text-xs font-bold text-[#FF8A00] font-mono">
            Lần {currentRep} / {totalReps}
          </span>
        ) : null}
      </div>

      {/* Large countdown */}
      <div className="flex flex-col items-center py-4">
        <span className="font-mono text-7xl sm:text-8xl font-black text-[#FF5500] tracking-tight drop-shadow-[0_0_25px_rgba(255,85,0,0.5)]">
          {timeDisplay}
        </span>
        <span className="text-xs text-slate-400 mt-1 font-medium font-mono">
          {phase === 'work' ? 'Duy trì nhịp chạy nhanh 85-90% sức' : 'Hạ nhịp tim, thở đều bằng mũi'}
        </span>
      </div>

      <ProgressBar
        value={progressPercent}
        color={phase === 'work' ? 'orange' : 'emerald'}
        height="md"
      />

      {/* Control Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant={isActive ? 'outline' : 'primary'}
          size="lg"
          fullWidth
          onClick={() => setIsActive(!isActive)}
          leftIcon={isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          className="h-13 font-display uppercase tracking-wider"
        >
          {isActive ? 'Tạm dừng' : totalElapsedTime > 0 ? 'Tiếp tục' : 'Bắt đầu bấm giờ'}
        </Button>

        {isActive && (
          <Button
            variant="outline"
            size="lg"
            onClick={skipCurrentPhase}
            leftIcon={<FastForward className="w-4 h-4 text-[#FF8A00]" />}
            className="w-16 shrink-0 h-13"
          >
            <span className="sr-only">Bỏ qua</span>
          </Button>
        )}
      </div>

      {totalElapsedTime > 30 && (
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={handleCompleteEarly}
          leftIcon={<CheckCircle className="w-4 h-4 text-[#00E676]" />}
          className="text-slate-300 hover:text-white"
        >
          Kết thúc & Lưu buổi chạy ({Math.round(totalElapsedTime / 60)} phút)
        </Button>
      )}
    </div>
  );
}
export default IntervalCoachView;
