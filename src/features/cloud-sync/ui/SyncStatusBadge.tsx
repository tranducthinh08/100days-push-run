import React from 'react';
import { Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { SyncStatus } from '../model/syncTypes';

interface SyncStatusBadgeProps {
  status: SyncStatus;
  onClick: () => void;
  className?: string;
}

export function SyncStatusBadge({ status, onClick, className = '' }: SyncStatusBadgeProps) {
  const getBadgeContent = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: <RefreshCw className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" />,
          text: 'Đang sao lưu...',
          color: 'text-[#00E5FF] bg-[#00E5FF]/15 border-[#00E5FF]/30',
          dot: 'bg-[#00E5FF] animate-ping',
        };
      case 'synced':
        return {
          icon: <Cloud className="w-3.5 h-3.5 text-[#00E676]" />,
          text: 'Cloud Synced',
          color: 'text-[#00E676] bg-[#00E676]/15 border-[#00E676]/30',
          dot: 'bg-[#00E676]',
        };
      case 'offline':
        return {
          icon: <CloudOff className="w-3.5 h-3.5 text-slate-400" />,
          text: 'Offline',
          color: 'text-slate-400 bg-white/[0.04] border-white/10',
          dot: 'bg-slate-500',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
          text: 'Thử lại đồng bộ',
          color: 'text-amber-400 bg-amber-400/15 border-amber-400/30',
          dot: 'bg-amber-400',
        };
      case 'unconfigured':
      default:
        return {
          icon: <Cloud className="w-3.5 h-3.5 text-slate-400" />,
          text: 'Sao lưu Cloud',
          color: 'text-slate-300 bg-white/[0.05] border-white/10 hover:border-[#00E5FF]/40 hover:text-white',
          dot: 'bg-amber-500',
        };
    }
  };

  const badge = getBadgeContent();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs select-none active:scale-95 ${badge.color} ${className}`}
      title="Bấm để mở Trung tâm Sao lưu & Đồng bộ Đám mây"
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dot}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${badge.dot.replace(' animate-ping', '')}`} />
      </span>
      {badge.icon}
      <span className="text-[11px] tracking-tight">{badge.text}</span>
    </button>
  );
}
export default SyncStatusBadge;
