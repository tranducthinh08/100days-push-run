import React from 'react';
import { Trophy, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface SessionCompletionBannerProps {
  dayNumber: number;
  totalPushups: number;
  maxRepsSet: number;
  onFinish: () => void;
}

export function SessionCompletionBanner({
  dayNumber,
  totalPushups,
  maxRepsSet,
  onFinish,
}: SessionCompletionBannerProps) {
  const isFinalChallenge = dayNumber === 100;

  return (
    <div className="flex flex-col items-center text-center gap-5 p-6 bg-white border border-slate-200/90 rounded-3xl shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 max-w-sm w-full">
      <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center">
        {isFinalChallenge ? (
          <Trophy className="w-9 h-9 text-amber-500 animate-bounce" />
        ) : (
          <CheckCircle2 className="w-9 h-9 text-orange-600" />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-black uppercase tracking-wider text-orange-600 font-condensed">
          HOÀN THÀNH BUỔI TẬP!
        </span>
        <h2 className="text-2xl font-black text-slate-900 font-condensed tracking-wide">
          {isFinalChallenge ? 'BẠN ĐÃ CHINH PHỤC 100 HÍT ĐẤT!' : `Chúc mừng Ngày ${dayNumber}`}
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
          {isFinalChallenge
            ? 'Tuyệt vời! Bạn đã hoàn thành trọn vẹn thử thách 100 ngày kiên trì và kỷ luật!'
            : 'Đã lưu kết quả vào tiến độ cá nhân và tăng chuỗi ngày tập liên tục (Streak).'}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col">
          <span className="text-[11px] text-slate-500 font-medium">Tổng số hít đất</span>
          <span className="text-xl font-bold font-mono text-orange-600">{totalPushups}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col">
          <span className="text-[11px] text-slate-500 font-medium">Hiệp cao nhất</span>
          <span className="text-xl font-bold font-mono text-amber-600">{maxRepsSet} cái</span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onFinish}
        rightIcon={<ArrowRight className="w-5 h-5" />}
      >
        Về Trang Chủ Lộ Trình
      </Button>
    </div>
  );
}
export default SessionCompletionBanner;
