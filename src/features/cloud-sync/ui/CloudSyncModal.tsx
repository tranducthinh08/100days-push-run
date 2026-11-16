import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { ShieldCheck, Copy, Check, RefreshCw, Key, ChevronDown, ChevronUp, Database, ArrowRight } from 'lucide-react';
import { SyncStatus } from '../model/syncTypes';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncPin: string;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  isConfigured: boolean;
  configUrl: string;
  configKey: string;
  onSyncNow: () => void;
  onLinkPin: (pin: string) => Promise<void>;
  onSaveConfig: (url: string, key: string) => void;
  onResetPin: () => void;
}

export function CloudSyncModal({
  isOpen,
  onClose,
  syncPin,
  syncStatus,
  lastSyncedAt,
  isConfigured,
  configUrl,
  configKey,
  onSyncNow,
  onLinkPin,
  onSaveConfig,
  onResetPin,
}: CloudSyncModalProps) {
  const [copied, setCopied] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [linkMsg, setLinkMsg] = useState('');
  const [showConfig, setShowConfig] = useState(!isConfigured);
  const [urlInput, setUrlInput] = useState(configUrl);
  const [keyInput, setKeyInput] = useState(configKey);

  const handleCopy = () => {
    navigator.clipboard.writeText(syncPin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPin.trim()) return;
    await onLinkPin(inputPin.trim());
    setLinkMsg(`Đã kết nối thành công với mã PIN: ${inputPin.trim()}!`);
    setInputPin('');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(urlInput, keyInput);
    setShowConfig(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="BẢO VỆ DỮ LIỆU ĐÁM MÂY (SUPABASE)" maxHeight="max-h-[92vh]">
      <div className="space-y-4 text-xs">
        {/* Sync PIN Hero Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#122234] to-[#0A121E] border border-[#00E5FF]/40 shadow-neon-cyan/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Mã PIN Đồng Bộ Của Bạn
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {isConfigured ? 'Cloud Active' : 'Chưa cấu hình URL'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-black/50 p-3 rounded-xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-white">{syncPin}</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-1 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã chép' : 'Sao chép'}
              </button>
              <button
                type="button"
                onClick={onResetPin}
                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white font-mono text-[10px] transition-all"
                title="Tạo mã PIN mới"
              >
                Đổi mã
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
            Nhập mã 6 số này vào điện thoại hoặc máy khác để đồng bộ tiến độ 2 chiều tự động. Không bao giờ mất dữ liệu.
          </p>
        </div>

        {/* Sync Action & Last Synced */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Trạng thái:</span>
            <span className="font-mono font-bold text-white text-[11px]">
              {syncStatus === 'syncing' ? 'Đang đồng bộ...' : lastSyncedAt ? `Đã lưu: ${new Date(lastSyncedAt).toLocaleTimeString('vi-VN')}` : 'Sẵn sàng sao lưu'}
            </span>
          </div>
          <Button
            variant="blue"
            size="sm"
            onClick={onSyncNow}
            disabled={syncStatus === 'syncing'}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />}
            className="font-mono font-bold"
          >
            Đồng bộ ngay
          </Button>
        </div>

        {/* Link Other Device by PIN */}
        <form onSubmit={handleLink} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <label className="text-[11px] font-bold text-white flex items-center gap-1.5 uppercase font-mono">
            <Key className="w-3.5 h-3.5 text-[#00E5FF]" /> Nhập mã PIN từ thiết bị khác để liên kết:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={8}
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              placeholder="VD: 883921"
              className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm tracking-widest focus:outline-none focus:border-[#00E5FF]"
            />
            <Button variant="outline" size="sm" type="submit" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Kết nối
            </Button>
          </div>
          {linkMsg && <p className="text-emerald-400 font-mono text-[11px] font-bold">{linkMsg}</p>}
        </form>

        {/* Advanced Supabase Configuration Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="w-full flex items-center justify-between text-slate-400 hover:text-white font-mono text-[11px] py-1 border-t border-white/[0.08] transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-[#00E5FF]" /> Cài đặt Supabase URL & Key (Nâng cao)
            </span>
            {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showConfig && (
            <form onSubmit={handleSaveConfig} className="p-3 mt-2 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
              <div>
                <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Project URL:</label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full bg-[#0B0E14] border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Public Anon Key:</label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full bg-[#0B0E14] border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
              <Button variant="primary" size="sm" fullWidth type="submit">
                Lưu cấu hình Supabase
              </Button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
export default CloudSyncModal;
