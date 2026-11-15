import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useStravaSync } from '@/features/strava-sync/useStravaSync';
import { StravaConnectModal } from '@/features/strava-sync/StravaConnectModal';

export function DesktopStravaQuickCard() {
  const { isConnected, activities, isLoading, error, connectWithToken, disconnect, refresh } =
    useStravaSync();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const latestRun = activities[0];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-orange-500/25">
            STR
          </div>
          <div>
            <h3 className="font-condensed text-lg font-black text-slate-900 tracking-wider uppercase">
              Đồng bộ Strava
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {isConnected ? 'Đang kết nối API cá nhân' : 'Chưa liên kết tài khoản'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors"
        >
          {isConnected ? 'Quản lý' : 'Kết nối'}
        </button>
      </div>

      {isConnected ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">Bài chạy mới nhất:</span>
            <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
              {latestRun ? latestRun.name : 'Chưa có bài chạy'}
            </span>
            {latestRun && (
              <span className="text-[11px] text-orange-600 font-mono font-bold">
                {latestRun.distanceKm} km &bull; {latestRun.averagePaceMinKm}
              </span>
            )}
          </div>
          <button
            onClick={refresh}
            disabled={isLoading}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      ) : (
        <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between font-medium">
          <span>Liên kết Strava để tự động ghi nhận số km chạy bộ 3 buổi/tuần.</span>
        </div>
      )}

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
export default DesktopStravaQuickCard;
