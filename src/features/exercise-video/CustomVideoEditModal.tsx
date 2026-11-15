import React, { useState } from 'react';
import { Video, Check, RotateCcw, AlertCircle } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

interface CustomVideoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  currentVideoId?: string;
  defaultVideoId?: string;
  onSave: (newVideoId: string) => void;
  onReset: () => void;
}

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If already pure 11 char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches watch?v=, youtu.be/, shorts/, embed/
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

export function CustomVideoEditModal({
  isOpen,
  onClose,
  exerciseName,
  currentVideoId,
  defaultVideoId,
  onSave,
  onReset,
}: CustomVideoEditModalProps) {
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const extracted = extractYouTubeId(inputUrl);
    if (!extracted) {
      setError('Đường dẫn không hợp lệ. Vui lòng dán link YouTube chuẩn (VD: https://youtu.be/... hoặc https://youtube.com/watch?v=...)');
      return;
    }
    setError(null);
    onSave(extracted);
    setInputUrl('');
    onClose();
  };

  const handleResetToDefault = () => {
    onReset();
    setInputUrl('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tùy chỉnh Video YouTube">
      <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">Đang cài đặt video cho bài tập:</span>
          <h4 className="font-bold text-slate-900 text-sm">{exerciseName}</h4>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-700">Dán Link YouTube hoặc YouTube Shorts:</label>
          <div className="relative">
            <Video className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="VD: https://www.youtube.com/watch?v=IODxDxX7oi4"
              className="w-full bg-white border border-slate-200/90 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          {currentVideoId && (
            <span className="text-[11px] text-slate-400">
              Video hiện tại (ID): <code className="text-orange-600 font-bold">{currentVideoId}</code>
            </span>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button variant="primary" size="lg" type="submit" fullWidth leftIcon={<Check className="w-4 h-4" />}>
            Lưu link video
          </Button>

          {defaultVideoId && currentVideoId !== defaultVideoId && (
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={handleResetToDefault}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="shrink-0 text-xs"
            >
              Về mặc định
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
export default CustomVideoEditModal;
