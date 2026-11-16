import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Link2, CheckCircle, ShieldAlert } from 'lucide-react';
import { useStravaSync } from '@/features/strava-sync/useStravaSync';
import { StravaConnectModal } from '@/features/strava-sync/StravaConnectModal';
import { StravaRunActivity, formatRunDuration } from '@/shared/lib/stravaApi';
import { Button } from '@/shared/ui/Button';

interface StravaSyncViewProps {
  onAssignActivity: (activity: StravaRunActivity) => void;
}

export function StravaSyncView({ onAssignActivity }: StravaSyncViewProps) {
  const {
    isConnected,
    activities,
    isLoading,
    error,
    connectWithToken,
    disconnect,
    refresh,
  } = useStravaSync();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openStravaApp = () => {
    // Attempt deep link then fallback
    window.location.href = 'strava://';
    setTimeout(() => {
      window.open('https://www.strava.com', '_blank');
    }, 500);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Strava Status and Actions */}
      <div className="bg-[#111622]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-5 shadow-glass-hud flex items-center justify-between text-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FC4C02]/20 text-[#FC4C02] flex items-center justify-center font-black text-xs tracking-wider border border-[#FC4C02]/40 font-mono">
            STRAVA
          </div>
          <div>
            <span className="text-xs font-bold text-white block font-display">
              {isConnected ? 'Đã kết nối tài khoản Strava' : 'Chưa kết nối Strava'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {isConnected ? `${activities.length} bài chạy gần nhất` : 'Nhập Token để tự động kéo kết quả'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isConnected && (
            <button
              onClick={refresh}
              disabled={isLoading}
              className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 flex items-center justify-center disabled:opacity-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold px-3 py-1.5 bg-[#FC4C02]/20 text-[#FC4C02] border border-[#FC4C02]/40 rounded-xl hover:bg-[#FC4C02]/30 transition-colors font-mono cursor-pointer"
          >
            {isConnected ? 'Cài đặt' : 'Kết nối ngay'}
          </button>
        </div>
      </div>

      {/* Button Open Strava App */}
      <Button
        variant="outline"
        size="md"
        fullWidth
        onClick={openStravaApp}
        leftIcon={<ExternalLink className="w-4 h-4 text-[#FC4C02]" />}
        className="font-display font-bold"
      >
        Mở ứng dụng Strava để ghi buổi chạy
      </Button>

      {/* Activities list */}
      <div className="flex flex-col gap-2 mt-1">
        <span className="text-xs font-bold text-slate-300 font-mono">
          Các bài chạy bộ Strava gần đây:
        </span>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-[#111622]/90 border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between hover:border-[#FC4C02]/40 hover:shadow-neon-orange/20 transition-all shadow-glass-hud"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-white line-clamp-1 font-display">{act.name}</span>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="font-semibold text-[#FC4C02]">{act.distanceKm} km</span>
                <span>&bull;</span>
                <span>{act.averagePaceMinKm}</span>
                <span>&bull;</span>
                <span>{formatRunDuration(act.movingTimeSec)}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(act.startDate).toLocaleDateString('vi-VN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignActivity(act)}
              leftIcon={<Link2 className="w-3.5 h-3.5 text-[#FC4C02]" />}
              className="shrink-0 font-mono text-xs"
            >
              Gán vào ngày
            </Button>
          </div>
        ))}

        {!isLoading && isConnected && activities.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs bg-[#111622]/90 rounded-2xl border border-white/[0.08] font-mono">
            Chưa có bài chạy bộ (Run) nào gần đây trên Strava.
          </div>
        )}
      </div>

      <StravaConnectModal
        isOpen={isModalOpen}
        isConnected={isConnected}
        onClose={() => setIsModalOpen(false)}
        onConnect={(token, clientId) => {
          connectWithToken(token, clientId);
          setIsModalOpen(false);
        }}
        onDisconnect={() => {
          disconnect();
          setIsModalOpen(false);
        }}
        error={error}
      />
    </div>
  );
}
export default StravaSyncView;
