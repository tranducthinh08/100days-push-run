import React, { useState } from 'react';
import { ExternalLink, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

interface StravaConnectModalProps {
  isOpen: boolean;
  isConnected: boolean;
  onClose: () => void;
  onConnect: (token: string, clientId?: string) => void;
  onDisconnect: () => void;
  error: string | null;
}

export function StravaConnectModal({
  isOpen,
  isConnected,
  onClose,
  onConnect,
  onDisconnect,
  error,
}: StravaConnectModalProps) {
  const [token, setToken] = useState('');
  const [clientId, setClientId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    onConnect(token, clientId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kết nối Strava API">
      <div className="flex flex-col gap-4 text-xs">
        {isConnected ? (
          <div className="flex flex-col gap-4 items-center text-center py-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Đã kết nối với Strava</h3>
              <p className="text-slate-500 mt-1">
                Các bài chạy mới nhất của bạn sẽ tự động được đồng bộ về ứng dụng.
              </p>
            </div>
            <Button variant="danger" size="md" onClick={onDisconnect}>
              Hủy kết nối Strava
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-slate-600 leading-relaxed">
              Nhập <strong>Personal Access Token</strong> từ trang nhà phát triển Strava của bạn để đồng bộ các buổi chạy tự động:
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700">Strava Access Token *</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="e.g. 7f8a9b2c3d4e..."
                  required
                  className="w-full bg-white border border-slate-200/90 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700">Client ID (Tùy chọn)</label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono shadow-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-2xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button variant="primary" size="lg" type="submit" fullWidth>
              Lưu & Kiểm tra kết nối
            </Button>

            {/* Helper link */}
            <a
              href="https://www.strava.com/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-orange-600 hover:text-orange-700 font-medium text-[11px] pt-1"
            >
              <span>Lấy Access Token tại Strava Settings API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </form>
        )}
      </div>
    </Modal>
  );
}
export default StravaConnectModal;
