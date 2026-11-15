import React from 'react';
import { Wind } from 'lucide-react';

export function BreathingCueBanner() {
  return (
    <div className="flex items-center gap-2.5 bg-orange-50/80 border border-orange-200/80 px-4 py-3 rounded-2xl text-xs text-slate-700 shadow-xs">
      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
        <Wind className="w-4 h-4" />
      </div>
      <p className="leading-tight text-[11px] font-medium">
        <strong className="text-orange-700 font-bold">Nhịp thở chuẩn:</strong> Hít sâu bằng mũi khi hạ người xuống &bull; Thở mạnh bằng miệng khi đẩy thẳng người lên.
      </p>
    </div>
  );
}
export default BreathingCueBanner;
