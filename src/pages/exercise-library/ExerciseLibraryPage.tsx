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
        <h1 className="text-2xl md:text-3xl font-black text-white uppercase font-display tracking-wider">
          Thư viện 21 Bài tập Thể hình & Chạy bộ
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl font-mono">
          Danh mục bài tập tạ đơn (Dumbbell) kèm động tác thay thế không dụng cụ (Fallback Bodyweight) chuẩn xác
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bài tập, nhóm cơ..."
            className="w-full bg-[#111622] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF5500] shadow-sm font-mono transition-all"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ExerciseCategory | 'all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#FF5500] text-white shadow-neon-orange font-black'
                  : 'bg-[#111622] border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
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
            className="relative overflow-hidden bg-[#111622]/90 border border-white/[0.08] rounded-3xl p-5 flex items-center justify-between hover:border-[#FF5500]/40 hover:shadow-neon-orange/20 hover:-translate-y-0.5 active:scale-[0.99] transition-all cursor-pointer shadow-glass-hud group"
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
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                    Có Fallback
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#FF8A00] transition-colors line-clamp-1 font-display">
                {exercise.name}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                {exercise.targetMuscles.join(' • ')}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] group-hover:bg-[#FF5500]/20 group-hover:text-[#FF5500] text-slate-400 flex items-center justify-center transition-all shrink-0 border border-white/[0.06]">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400 text-xs bg-[#111622] rounded-3xl border border-white/[0.08]">
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
