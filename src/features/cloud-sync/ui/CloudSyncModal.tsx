import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { ShieldCheck, Copy, Check, RefreshCw, Key, ChevronDown, ChevronUp, Database, ArrowRight, AlertTriangle, Info } from 'lucide-react';
import { SyncStatus } from '../model/syncTypes';
import { normalizeSupabaseUrl, clearCustomSupabaseConfig, isSecretKey } from '@/shared/lib/supabaseClient';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncPin: string;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  isConfigured: boolean;
  configUrl: string;
  configKey: string;
  errorMessage?: string | null;
  onSyncNow: () => Promise<{ success: boolean; message: string }>;
  onLinkPin: (pin: string) => Promise<{ success: boolean; message: string }>;
  onSaveConfig: (url: string, key: string) => void;
  onResetPin: () => void;
}

export function CloudSyncModal({
  isOpen, onClose, syncPin, syncStatus, lastSyncedAt, isConfigured,
  configUrl, configKey, errorMessage, onSyncNow, onLinkPin, onSaveConfig, onResetPin,
}: CloudSyncModalProps) {
  const [copied, setCopied] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [linkMsg, setLinkMsg] = useState('');
  const [showConfig, setShowConfig] = useState(!isConfigured);
  const [urlInput, setUrlInput] = useState(configUrl);
  const [keyInput, setKeyInput] = useState(configKey);
  const [uiError, setUiError] = useState<string | null>(null);
  const [uiSuccess, setUiSuccess] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(syncPin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetDefaults = () => {
    clearCustomSupabaseConfig();
    setUrlInput((import.meta.env.VITE_SUPABASE_URL as string) || '');
    setKeyInput((import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '');
    setUiError(null);
    setUiSuccess('✅ Đã xóa Secret Key và khôi phục Publishable Key gốc!');
    setTimeout(() => onSyncNow(), 300);
  };

  const handleTriggerSync = async () => {
    setUiError(null); setUiSuccess(null);
    if (!isConfigured) {
      setShowConfig(true);
      setUiError('Bạn chưa cấu hình Supabase! Vui lòng kiểm tra Project URL & Key bên dưới.');
      return;
    }
    const res = await onSyncNow();
    if (res.success) setUiSuccess('✅ Đã đồng bộ tiến độ thành công lên Supabase Cloud!');
    else setUiError(res.message);
  };

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = inputPin.trim();
    if (!pin) return;
    setUiError(null); setUiSuccess(null); setLinkMsg('');
    const res = await onLinkPin(pin);
    if (res.success) {
      setLinkMsg(res.message); setUiSuccess(res.message); setInputPin('');
    } else {
      setUiError(res.message);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setUiError(null);
    const trimmedUrl = normalizeSupabaseUrl(urlInput);
    const trimmedKey = keyInput.trim();
    if (!trimmedUrl || !trimmedKey) return setUiError('Vui lòng nhập đầy đủ cả URL và Key!');
    if (isSecretKey(trimmedKey)) return setUiError('❌ Đây là Secret Key (server-only). Hãy dùng Publishable Key (sb_publishable_...) hoặc Anon Key!');
    if (!trimmedUrl.startsWith('http')) return setUiError('Project URL không hợp lệ (VD: https://xyz.supabase.co)!');

    setUrlInput(trimmedUrl);
    onSaveConfig(trimmedUrl, trimmedKey);
    setUiSuccess('✅ Đã lưu cấu hình Supabase thành công! Đang đồng bộ...');
    setTimeout(() => onSyncNow(), 400);
  };

  const activeError = uiError || errorMessage;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="BẢO VỆ DỮ LIỆU ĐÁM MÂY (SUPABASE)" maxHeight="max-h-[92vh]">
      <div className="space-y-3 text-xs">
        {/* Sync PIN Hero Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#122234] to-[#0A121E] border border-[#00E5FF]/40 shadow-neon-cyan/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Mã PIN Thiết Bị Này
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {isConfigured ? '🟢 Đã kết nối Supabase' : '🟡 Chưa cấu hình URL'}
            </span>
          </div>
          <div className="flex items-center justify-between bg-black/50 p-2.5 rounded-xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-white">{syncPin}</span>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={handleCopy} className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-1">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Đã chép' : 'Sao chép'}
              </button>
              <button type="button" onClick={onResetPin} className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white font-mono text-[10px]">Đổi mã</button>
            </div>
          </div>
          <p className="text-[10.5px] text-slate-300 mt-1.5 leading-relaxed">Mã định danh duy nhất của thiết bị này. Nhập mã này vào thiết bị kia để liên kết.</p>
        </div>

        {/* Status Notification Alerts */}
        {activeError && (
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[10.5px] leading-relaxed">{activeError}</span>
            </div>
            {activeError.toLowerCase().includes('secret') && (
              <button type="button" onClick={handleResetDefaults} className="mt-2 text-[10.5px] font-bold text-[#00E5FF] hover:underline block">
                👉 Bấm vào đây để tự động đổi về Publishable Key chuẩn
              </button>
            )}
          </div>
        )}
        {uiSuccess && <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-[10.5px] font-mono">{uiSuccess}</div>}

        {/* Sync Action & Last Synced */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Trạng thái:</span>
            <span className="font-mono font-bold text-white text-[11px]">
              {syncStatus === 'syncing' ? 'Đang đồng bộ...' : !isConfigured ? '⚠️ Chưa cấu hình Supabase' : lastSyncedAt ? `Đã lưu: ${new Date(lastSyncedAt).toLocaleTimeString('vi-VN')}` : 'Sẵn sàng sao lưu'}
            </span>
          </div>
          <Button variant="blue" size="sm" onClick={handleTriggerSync} disabled={syncStatus === 'syncing'} leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />} className="font-mono font-bold">
            Đồng bộ ngay
          </Button>
        </div>

        {/* Link Other Device by PIN */}
        <form onSubmit={handleLink} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
          <label className="text-[11px] font-bold text-white flex items-center gap-1.5 uppercase font-mono">
            <Key className="w-3.5 h-3.5 text-[#00E5FF]" /> Nhập mã PIN của thiết bị kia để liên kết:
          </label>
          <p className="text-[10px] text-slate-400">Mở thiết bị kia, copy mã PIN ở trên đầu rồi dán vào đây để kéo dữ liệu về.</p>
          <div className="flex gap-2 pt-1">
            <input type="text" maxLength={8} value={inputPin} onChange={(e) => setInputPin(e.target.value)} placeholder="VD: 883921" className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm tracking-widest focus:outline-none focus:border-[#00E5FF]" />
            <Button variant="outline" size="sm" type="submit" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>Kết nối</Button>
          </div>
          {linkMsg && <p className="text-emerald-400 font-mono text-[11px] font-bold mt-1">{linkMsg}</p>}
        </form>

        {/* Supabase Configuration Section */}
        <div className="pt-0.5">
          <button type="button" onClick={() => setShowConfig(!showConfig)} className="w-full flex items-center justify-between text-slate-400 hover:text-white font-mono text-[10.5px] py-1 border-t border-white/[0.08] transition-colors">
            <span className="flex items-center gap-1.5 font-bold">
              <Database className="w-3.5 h-3.5 text-[#00E5FF]" /> Cài đặt Supabase URL & Key {isConfigured ? '(Đã kết nối)' : '(Cần cấu hình)'}
            </span>
            {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showConfig && (
            <form onSubmit={handleSaveConfig} className="p-2.5 mt-1.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-200 text-[10px] leading-relaxed flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 text-[#00E5FF] mt-0.5" />
                <span>Dùng <strong>Publishable key</strong> (`sb_publishable_...`) hoặc <strong>anon key</strong>. Tuyệt đối không dùng Secret key!</span>
              </div>
              <div>
                <label className="text-[10px] text-slate-300 font-mono uppercase block mb-0.5">Project URL:</label>
                <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://your-project.supabase.co" className="w-full bg-[#0B0E14] border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-[#00E5FF]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-300 font-mono uppercase block mb-0.5">Publishable / Anon Key:</label>
                <input type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="sb_publishable_... hoặc eyJ..." className="w-full bg-[#0B0E14] border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-[#00E5FF]" />
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" type="submit" className="flex-1 font-display uppercase tracking-wider font-bold">Lưu cấu hình</Button>
                <button type="button" onClick={handleResetDefaults} className="px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-slate-300 text-[10px] font-mono">Đặt lại gốc</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
