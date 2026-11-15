import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Compass } from 'lucide-react';

interface TechniqueRule {
  id: string;
  tag: string;
  title: string;
  description: string;
}

const MAX_TEST_GUIDE = {
  title: 'Bước 0: Kiểm tra Reps tối đa (Max Reps Test)',
  description: 'Trước khi bắt đầu, hãy thực hiện 1 hiệp hít đất hết sức chuẩn form (ngực sát sàn) để xác định mốc nền tảng ban đầu.',
};

const TECHNIQUE_RULES: TechniqueRule[] = [
  {
    id: 'elbow',
    tag: 'Bảo vệ vai',
    title: 'Khép khuỷu tay 45°',
    description: 'Tránh mở khuỷu tay 90 độ gây đau khớp vai. Khép cánh tay góc 45 độ hình mũi tên để tối ưu lực đẩy ngực và tay sau.',
  },
  {
    id: 'core',
    tag: 'Khóa lực lõi',
    title: 'Siết bụng Hollow Body',
    description: 'Gồng chặt bụng và mông như tấm ván phẳng, tuyệt đối không võng thắt lưng hoặc nhổm mông khi hạ/đẩy người.',
  },
  {
    id: 'zone2',
    tag: 'Sức bền hiếu khí',
    title: 'Chạy chậm Zone 2',
    description: 'Duy trì tốc độ có thể nói chuyện thành câu trọn vẹn, hít thở đều 3 bước hít - 3 bước thở để bảo vệ khớp gối.',
  },
];

interface TechniqueTipsCardProps {
  dayNumber: number;
}

export function TechniqueTipsCard({ dayNumber }: TechniqueTipsCardProps) {
  const [isExpanded, setIsExpanded] = useState(dayNumber === 1);

  return (
    <div className="rounded-2xl bg-[#0F1420]/90 border border-white/[0.08] p-4 text-xs space-y-3 mb-6 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF8A00] to-transparent pointer-events-none" />

      {/* Day 1 Max Test Pre-workout Banner */}
      {dayNumber === 1 && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#FF5500]/20 to-amber-500/10 border border-[#FF5500]/40 flex items-start gap-2.5 shadow-neon-orange/20">
          <div className="w-8 h-8 rounded-lg bg-[#FF5500] text-white flex items-center justify-center shrink-0 shadow-md">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white uppercase tracking-wide font-display text-[11px]">
                {MAX_TEST_GUIDE.title}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#FF5500] text-white uppercase">
                Bước 0
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              {MAX_TEST_GUIDE.description}
            </p>
          </div>
        </div>
      )}

      {/* 3 Golden Technique Rules Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF8A00]/15 text-[#FF8A00] border border-[#FF8A00]/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase font-display tracking-wide group-hover:text-[#FF8A00] transition-colors">
              3 Lưu ý kỹ thuật giúp tăng số cái nhanh gấp đôi
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Bảo vệ vai góc 45° &bull; Khóa bụng tấm ván &bull; Chạy chậm Zone 2
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-white font-mono text-[11px]">
          <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Rules Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-white/[0.06]">
          {TECHNIQUE_RULES.map((rule, idx) => (
            <div
              key={rule.id}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-[10px] text-[#FF8A00] bg-[#FF5500]/15 px-1.5 py-0.5 rounded border border-[#FF5500]/30">
                    Quy tắc #{idx + 1}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">{rule.tag}</span>
                </div>
                <h5 className="font-bold text-white text-[11px] mb-1 leading-snug">
                  {rule.title}
                </h5>
                <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default TechniqueTipsCard;
