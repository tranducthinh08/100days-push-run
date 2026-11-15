import React, { useState, useEffect } from 'react';
import { PlayCircle, Eye, Edit3, WifiOff, Sparkles } from 'lucide-react';
import { Exercise } from '@/entities/exercise/types';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { ExerciseLoopAnimation } from './ExerciseLoopAnimation';
import { CustomVideoEditModal } from './CustomVideoEditModal';

interface ExerciseVideoPlayerProps {
  exercise: Exercise;
}

export function ExerciseVideoPlayer({ exercise }: ExerciseVideoPlayerProps) {
  const { customExerciseVideos, setCustomExerciseVideo } = useUserProgress();
  const [activeTab, setActiveTab] = useState<'loop' | 'youtube'>('loop');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const customVideo = customExerciseVideos[exercise.id];
  const effectiveVideoId = customVideo || exercise.youtubeId || 'IODxDxX7oi4';
  const isCustomized = !!customVideo && customVideo !== exercise.youtubeId;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Player Header Tabs & Custom Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('loop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
              activeTab === 'loop'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Ảnh Động Kỹ Thuật (Loop)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
              activeTab === 'youtube'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" /> Video YouTube
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-colors ${
            isCustomized
              ? 'bg-amber-50 text-amber-700 border-amber-300'
              : 'bg-white text-slate-500 border-slate-200 hover:text-orange-600 hover:border-orange-300'
          }`}
          title="Tùy chỉnh link video bài tập này"
        >
          <Edit3 className="w-3 h-3" />
          <span>{isCustomized ? 'Link riêng' : 'Đổi link'}</span>
        </button>
      </div>

      {/* Main View Area */}
      {activeTab === 'loop' ? (
        <ExerciseLoopAnimation
          animationType={exercise.animationType || 'push'}
          exerciseName={exercise.name}
        />
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-md border border-slate-200">
          {!isOnline ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-slate-400 gap-2">
              <WifiOff className="w-8 h-8 text-slate-500" />
              <p className="text-xs">Đang ngoại tuyến. Video YouTube cần kết nối Internet.</p>
              <button
                type="button"
                onClick={() => setActiveTab('loop')}
                className="text-xs font-bold text-orange-400 underline"
              >
                Xem Ảnh Động Kỹ Thuật (Hoạt động offline)
              </button>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${effectiveVideoId}?rel=0&modestbranding=1`}
              title={exercise.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </div>
      )}

      {/* Quick Coach Tip */}
      {exercise.videoTip && (
        <div className="flex items-start gap-2 bg-orange-50/70 border border-orange-200/80 rounded-xl p-2.5 text-[11px] text-orange-900">
          <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Mẹo kỹ thuật:</strong> {exercise.videoTip}
          </p>
        </div>
      )}

      {/* Edit Link Modal */}
      <CustomVideoEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        exerciseName={exercise.name}
        currentVideoId={effectiveVideoId}
        defaultVideoId={exercise.youtubeId}
        onSave={(newId) => setCustomExerciseVideo(exercise.id, newId)}
        onReset={() => setCustomExerciseVideo(exercise.id, exercise.youtubeId || '')}
      />
    </div>
  );
}
export default ExerciseVideoPlayer;
