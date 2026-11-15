import React, { useState } from 'react';
import { Search, Dumbbell, UserCheck, ChevronRight } from 'lucide-react';
import { EXERCISES } from '@/entities/exercise/model';
import { Exercise, ExerciseCategory } from '@/entities/exercise/types';
import { Badge } from '@/shared/ui/Badge';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';

export function ExerciseLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'main-push', label: 'Main Push' },
    { id: 'pull-prehab', label: 'Pull & Prehab' },
    { id: 'triceps', label: 'Tay sau' },
    { id: 'leg-prehab', label: 'Chân & Gối' },
    { id: 'core-mobility', label: 'Core & Giãn cơ' },
    { id: 'warm-up', label: 'Khởi động' },
  ];

  const filtered = EXERCISES.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.targetMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 pb-24 pt-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase font-condensed tracking-wider">
          Thư viện 21 Bài tập Thể hình & Chạy bộ
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Danh mục bài tập tạ đơn (Dumbbell) kèm động tác thay thế không dụng cụ (Fallback Bodyweight) chuẩn xác
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bài tập, nhóm cơ..."
            className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-sm transition-all"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ExerciseCategory | 'all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/25'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:text-orange-600 hover:border-orange-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Responsive Multi-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => setActiveExercise(exercise)}
            className="relative overflow-hidden bg-white/95 border border-slate-200/90 rounded-3xl p-5 flex items-center justify-between hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5 active:scale-[0.99] transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex flex-col gap-1.5 pr-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={exercise.equipment === 'dumbbell' ? 'amber' : 'emerald'}
                  size="sm"
                >
                  {exercise.equipment === 'dumbbell' ? (
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-2.5 h-2.5" /> Dumbbell
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-2.5 h-2.5" /> Bodyweight
                    </span>
                  )}
                </Badge>
                {exercise.fallbackId && (
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Có Fallback
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                {exercise.name}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {exercise.targetMuscles.join(' • ')}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-orange-50 group-hover:text-orange-600 text-slate-400 flex items-center justify-center transition-all shrink-0 border border-slate-100">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400 text-xs bg-white rounded-3xl border border-slate-200/90">
            Không tìm thấy bài tập nào phù hợp với từ khóa "{search}".
          </div>
        )}
      </div>

      <ExerciseDetailModal
        exercise={activeExercise}
        isOpen={!!activeExercise}
        onClose={() => setActiveExercise(null)}
      />
    </div>
  );
}
export default ExerciseLibraryPage;
