import React from 'react';
import { Dumbbell, UserCheck } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';

export function EquipmentToggle() {
  const { equipmentMode, toggleEquipmentMode } = useUserProgress();
  const isDumbbell = equipmentMode === 'dumbbell';

  return (
    <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm">
      <div className="flex items-center gap-2.5 pl-1.5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            isDumbbell
              ? 'bg-amber-100 text-amber-700'
              : 'bg-orange-100 text-orange-600'
          }`}
        >
          {isDumbbell ? <Dumbbell className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900">
            {isDumbbell ? 'Chế độ: Có Tạ Đơn' : 'Chế độ: Chỉ Không Dụng Cụ'}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {isDumbbell ? 'Dùng tạ tay cho bài bổ trợ' : 'Tự động đổi sang bài Bodyweight'}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleEquipmentMode}
        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          isDumbbell ? 'bg-amber-500' : 'bg-orange-500'
        }`}
        aria-label="Toggle Equipment Mode"
      >
        <span
          className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
            isDumbbell ? 'translate-x-0 text-amber-600' : 'translate-x-6 text-orange-600'
          }`}
        >
          {isDumbbell ? <Dumbbell className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
        </span>
      </button>
    </div>
  );
}
export default EquipmentToggle;
