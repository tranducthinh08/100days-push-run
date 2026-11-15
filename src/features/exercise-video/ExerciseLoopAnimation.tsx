import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, Gauge } from 'lucide-react';
import gsap from 'gsap';

interface ExerciseLoopAnimationProps {
  animationType?: string;
  exerciseName: string;
}

export function ExerciseLoopAnimation({
  animationType = 'push',
  exerciseName,
}: ExerciseLoopAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1);
  const [phaseText, setPhaseText] = useState('Hạ người (2s)');
  const [phaseColor, setPhaseColor] = useState('text-amber-400 bg-amber-500/10 border-amber-500/30');

  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const armRef = useRef<SVGPolylineElement>(null);
  const angleLabelRef = useRef<SVGTextElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!bodyRef.current || !armRef.current) return;

      const tl = gsap.timeline({
        repeat: -1,
        onUpdate: () => {
          const t = tl.time() % 4;
          if (t < 2) {
            setPhaseText('Hạ ngực có kiểm soát (2 giây)');
            setPhaseColor('text-amber-400 bg-amber-500/10 border-amber-500/30');
          } else if (t < 3) {
            setPhaseText('Dừng đáy siết ngực & bụng (1 giây)');
            setPhaseColor('text-orange-400 bg-orange-500/20 border-orange-500/40');
          } else {
            setPhaseText('Đẩy dứt khoát lên đỉnh (1 giây)');
            setPhaseColor('text-emerald-400 bg-emerald-500/10 border-emerald-500/30');
          }
        },
      });

      // Biomechanics Push-Up kinematics:
      // Phase 1: 0 -> 2s: Down
      tl.to(bodyRef.current, { y: 26, rotation: 3, transformOrigin: '230px 65px', duration: 2, ease: 'power2.inOut' }, 0);
      tl.to(armRef.current, { attr: { points: '65,65 52,78 60,92' }, duration: 2, ease: 'power2.inOut' }, 0);
      if (angleLabelRef.current) {
        tl.to(angleLabelRef.current, { textContent: '45°', attr: { y: 78 }, duration: 2 }, 0);
      }

      // Phase 2: 2s -> 3s: Bottom Pause
      tl.to(bodyRef.current, { y: 27, duration: 1, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 2);

      // Phase 3: 3s -> 4s: Explosive Push Up
      tl.to(bodyRef.current, { y: 0, rotation: 0, duration: 1, ease: 'power3.out' }, 3);
      tl.to(armRef.current, { attr: { points: '65,40 55,65 60,92' }, duration: 1, ease: 'power3.out' }, 3);
      if (angleLabelRef.current) {
        tl.to(angleLabelRef.current, { textContent: '90°', attr: { y: 62 }, duration: 1 }, 3);
      }

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [animationType]);

  const togglePlay = () => {
    if (!timelineRef.current) return;
    if (isPlaying) {
      timelineRef.current.pause();
    } else {
      timelineRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (timelineRef.current) {
      timelineRef.current.timeScale(newSpeed);
    }
  };

  const handleRestart = () => {
    if (timelineRef.current) {
      timelineRef.current.restart();
      timelineRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-slate-950 rounded-2xl p-4 flex flex-col justify-between min-h-[235px] text-white border border-slate-800 shadow-inner select-none"
    >
      {/* Top Header / Tempo */}
      <div className="relative z-10 w-full flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Activity className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span>GSAP Biomechanics &bull; Tempo 2-1-1</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${phaseColor}`}>
          {phaseText}
        </span>
      </div>

      {/* SVG Biomechanics Simulator */}
      <div className="relative z-10 w-full flex items-center justify-center py-2">
        <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-28 overflow-visible">
          {/* Grid lines */}
          <line x1="20" y1="95" x2="260" y2="95" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <text x="235" y="112" fill="#64748b" fontSize="8" fontFamily="monospace">SÀN TẬP</text>

          {/* Arm and joint */}
          <polyline
            ref={armRef}
            points="65,40 55,65 60,92"
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="60" cy="92" r="3" fill="#cbd5e1" />
          <text ref={angleLabelRef} x="32" y="62" fill="#fb923c" fontSize="9" fontWeight="bold" fontFamily="monospace">
            45°
          </text>

          {/* Body, head, spine, feet */}
          <g ref={bodyRef}>
            {/* Head */}
            <circle cx="45" cy="35" r="9" fill="#f8fafc" stroke="#f97316" strokeWidth="2" />
            {/* Torso & spine straight line */}
            <line x1="55" y1="40" x2="170" y2="52" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
            {/* Legs */}
            <line x1="170" y1="52" x2="230" y2="85" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" />
            {/* Feet on floor */}
            <circle cx="230" cy="85" r="4" fill="#f97316" />
          </g>
        </svg>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 w-full flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
        <span className="text-slate-400 font-medium truncate max-w-[130px]">{exerciseName}</span>

        <div className="flex items-center gap-1.5">
          {/* Speed Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
            <button
              onClick={() => handleSpeedChange(0.75)}
              className={`px-1.5 py-0.5 rounded font-bold ${speed === 0.75 ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              0.75x
            </button>
            <button
              onClick={() => handleSpeedChange(1)}
              className={`px-1.5 py-0.5 rounded font-bold ${speed === 1 ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              1.0x
            </button>
          </div>

          <button
            onClick={togglePlay}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Dừng' : 'Chạy'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
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
