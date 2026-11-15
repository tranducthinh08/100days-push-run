import React from 'react';
import { Wind } from 'lucide-react';

export function BreathingCueBanner() {
  return (
    <div className="flex items-center gap-2.5 bg-[#FF5500]/10 border border-[#FF5500]/30 px-4 py-3 rounded-2xl text-xs text-slate-300 shadow-neon-orange/20">
      <div className="w-7 h-7 rounded-lg bg-[#FF5500]/20 text-[#FF5500] flex items-center justify-center shrink-0">
        <Wind className="w-4 h-4" />
      </div>
      <p className="leading-tight text-[11px] font-medium">
        <strong className="text-[#FF8A00] font-bold">Kỹ thuật chuẩn:</strong> Khép khuỷu 45° (hình mũi tên ^) &bull; Khóa mông bụng như tấm ván &bull; Hít vào khi hạ, thở mạnh khi đẩy lên.
      </p>
    </div>
  );
}
export default BreathingCueBanner;
