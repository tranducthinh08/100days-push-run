import { DayProgram, WorkoutDayType, ProgramPhase } from './types';

const DAYS_VI = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

function getPhase(day: number): ProgramPhase {
  if (day <= 28) return 1;
  if (day <= 63) return 2;
  return 3;
}

function calculatePushupSets(day: number, phase: ProgramPhase, dow: number): number[] {
  if (day === 26 || day === 68 || day === 100) {
    const baseRep = phase === 1 ? 25 : phase === 2 ? 45 : 75;
    return [baseRep, 15, 12, 10, 8];
  }
  const weekIndex = Math.floor((day - 1) / 7);
  const baseVolume = 30 + weekIndex * 5;
  if (dow === 0) {
    const rep = Math.round(baseVolume / 5);
    return [rep + 2, rep + 1, rep, rep - 1, rep - 2];
  }
  if (dow === 2) {
    const rep = Math.round(baseVolume / 6);
    return [rep + 1, rep + 1, rep, rep, rep - 1, rep - 1];
  }
  const rep = Math.round(baseVolume / 4);
  return [rep + 3, rep + 1, rep, rep - 2];
}

export function generateAll100Days(): DayProgram[] {
  const days: DayProgram[] = [];

  for (let day = 1; day <= 100; day++) {
    const dayOfWeekIndex = (day - 1) % 7;
    const weekNumber = Math.floor((day - 1) / 7) + 1;
    const phase = getPhase(day);
    const dayOfWeekVi = DAYS_VI[dayOfWeekIndex];

    let type: WorkoutDayType = 'push';
    if (dayOfWeekIndex === 1 || dayOfWeekIndex === 3 || dayOfWeekIndex === 5) {
      type = 'run';
    } else if (dayOfWeekIndex === 6) {
      type = 'recovery';
    }

    const isTestDay = day === 26 || day === 68 || day === 100;
    const restTime = phase === 1 ? 60 : phase === 2 ? 45 : 60;
    const pushupSets = type === 'push' ? calculatePushupSets(day, phase, dayOfWeekIndex) : undefined;

    days.push({
      dayNumber: day,
      weekNumber,
      dayOfWeekIndex,
      dayOfWeekVi,
      phase,
      type,
      title: getDayTitle(day, type, isTestDay),
      focus: getDayFocus(dayOfWeekIndex, isTestDay, day),
      isTestDay,
      pushupTargetRepsPerSet: pushupSets,
      restBetweenSetsSec: restTime,
      warmupBlock: getWarmupBlock(type, dayOfWeekIndex),
      mainBlock: getMainBlock(day, type, pushupSets, restTime),
      accessoryBlock: getAccessoryBlock(dayOfWeekIndex, type),
      runDetails: type === 'run' ? getRunDetails(dayOfWeekIndex, phase, weekNumber) : undefined,
    });
  }

  return days;
}

function getDayTitle(day: number, type: WorkoutDayType, isTest: boolean): string {
  if (day === 100) return 'NGÀY 100: ĐỈNH CAO THỬ THÁCH (100 PUSH-UPS UNBROKEN)';
  if (isTest) return `NGÀY ${day}: ĐÁNH GIÁ THỂ LỰC (MAX TEST REPS)`;
  if (type === 'push') return `NGÀY ${day}: RÈN LUYỆN SỨC MẠNH HÍT ĐẤT`;
  if (type === 'run') return `NGÀY ${day}: CHẠY BỘ / CARDIO SỨC BỀN`;
  return `NGÀY ${day}: PHỤC HỒI CHỦ ĐỘNG & KÉO GIÃN`;
}

function getDayFocus(dow: number, isTest: boolean, day: number): string {
  if (day === 100) return 'Mục tiêu tối thượng: 1 hiệp hoàn thành 100 cái';
  if (isTest) return 'Kiểm tra năng lực tối đa hiệp 1 (AMRAP)';
  switch (dow) {
    case 0: return 'Volume Hít đất + Khóa khớp tay sau + Gồng bụng chống võng lưng';
    case 1: return 'Chạy nhẹ Zone 2 dưỡng sức + Phục hồi cơ chân (hoặc Nhảy dây)';
    case 2: return 'Density Push-ups (Giảm nghỉ) + Lưng xô chống gù vai';
    case 3: return 'Chạy Interval biến tốc / Nhảy dây nhịp độ cao + Tăng sức mạnh bắp chân';
    case 4: return 'Thử thách Reps cao + Chùng chân cân bằng cơ đùi';
    case 5: return 'Chạy dài tích lũy nền tảng hiếu khí (Long Run / Long Jump Rope)';
    default: return 'Đi bộ thả lỏng + Kéo giãn toàn thân';
  }
}

function getWarmupBlock(type: WorkoutDayType, dow = 0) {
  if (type === 'push') {
    const cardioWarmup = (dow === 0 || dow === 4)
      ? { exerciseId: 'jump-rope-warmup', targetSets: 2, targetReps: '100 cái (hoặc 60s)', restSeconds: 30 }
      : { exerciseId: 'scapular-push-up', targetSets: 2, targetReps: '12 reps', restSeconds: 30 };
    return [
      { exerciseId: 'wrist-circles', targetSets: 2, targetReps: '15 vòng', restSeconds: 20 },
      cardioWarmup,
    ];
  }
  return [
    { exerciseId: 'worlds-greatest-stretch', targetSets: 2, targetReps: '5 reps/bên', restSeconds: 30 },
    { exerciseId: 'single-leg-glute-bridge', targetSets: 2, targetReps: '10 reps/bên', restSeconds: 30 },
  ];
}

function getMainBlock(day: number, type: WorkoutDayType, sets?: number[], rest = 60) {
  if (type === 'push') {
    if (day >= 96 && day <= 99) {
      return [{ exerciseId: 'wrist-circles', targetSets: 1, targetReps: 'Nghỉ dưỡng cơ', restSeconds: 0 }];
    }
    const targetStr = sets && sets.length > 0 ? sets.join(' - ') + ' reps' : '5 hiệp';
    return [{ exerciseId: 'standard-push-up', targetSets: sets ? sets.length : 5, targetReps: targetStr, restSeconds: rest }];
  }
  return [];
}

function getAccessoryBlock(dow: number, type: WorkoutDayType) {
  if (type === 'push') {
    if (dow === 0) {
      return [
        { exerciseId: 'dumbbell-floor-press', targetSets: 3, targetReps: '12 reps', restSeconds: 45 },
        { exerciseId: 'dead-bug', targetSets: 3, targetReps: '10 reps/bên', restSeconds: 30 },
      ];
    }
    if (dow === 2) {
      return [
        { exerciseId: 'bent-over-dumbbell-row', targetSets: 3, targetReps: '12 reps', restSeconds: 45 },
        { exerciseId: 'doorway-chest-stretch', targetSets: 2, targetReps: '30s/bên', restSeconds: 30 },
      ];
    }
    return [
      { exerciseId: 'dumbbell-reverse-lunge', targetSets: 3, targetReps: '10 reps/bên', restSeconds: 45 },
      { exerciseId: 'plank', targetSets: 3, targetReps: '45s', restSeconds: 30 },
    ];
  }
  if (type === 'run') {
    if (dow === 3) {
      return [{ exerciseId: 'single-leg-calf-raise', targetSets: 3, targetReps: '15 reps/bên', restSeconds: 30 }];
    }
    return [{ exerciseId: 'couch-stretch', targetSets: 2, targetReps: '45s/bên', restSeconds: 30 }];
  }
  return [
    { exerciseId: 'worlds-greatest-stretch', targetSets: 2, targetReps: '6 reps/bên', restSeconds: 30 },
    { exerciseId: 'doorway-chest-stretch', targetSets: 2, targetReps: '45s', restSeconds: 30 },
  ];
}

function getRunDetails(dow: number, phase: ProgramPhase, week: number) {
  if (dow === 1) {
    const duration = phase === 1 ? 25 : phase === 2 ? 40 : 45;
    const distance = +(duration * 0.14).toFixed(1);
    const sets = phase === 1 ? 5 : phase === 2 ? 5 : 4;
    const workMins = phase === 1 ? 4 : phase === 2 ? 7 : 10;
    return {
      durationMinutesTarget: duration,
      distanceKmTarget: distance,
      jumpRopeTargetReps: Math.round(distance * 320),
      runType: 'zone2' as const,
      paceGuidance: 'Pace trò chuyện thoải mái (Zone 2 - Tim 65-75%)',
      description: `Chạy chia làm ${sets} hiệp x [${workMins}p chạy Zone 2 + 1p đi bộ], thở đều 3-3.`,
      cadenceGuidance: '165 - 175 spm',
      heartRateZone: 'Zone 2 (65 - 75% Max HR)',
      splitsSummary: `${sets} hiệp x [${workMins}p chạy + 1p đi bộ]`,
      intervalConfig: { workDurationSec: workMins * 60, recoveryDurationSec: 60, repetitions: sets },
    };
  }
  if (dow === 3) {
    const reps = phase === 1 ? 4 : phase === 2 ? 6 : 8;
    const distance = +(3.0 + reps * 0.4).toFixed(1);
    return {
      durationMinutesTarget: 15 + reps * 3,
      distanceKmTarget: distance,
      jumpRopeTargetReps: Math.round(distance * 320),
      runType: 'interval' as const,
      paceGuidance: 'Pace nhanh 85-92% MHR xen kẽ Đi bộ phục hồi',
      description: `Lặp lại ${reps} reps [2 phút chạy nhanh / 1 phút đi bộ].`,
      cadenceGuidance: '180 - 190 spm',
      heartRateZone: 'Zone 4 - 5 (85 - 92% Max HR)',
      splitsSummary: `${reps} reps x [2p nhanh + 1p đi bộ]`,
      intervalConfig: { workDurationSec: 120, recoveryDurationSec: 60, repetitions: reps },
    };
  }
  const longDuration = phase === 1 ? 30 + week * 2 : phase === 2 ? 45 + (week - 4) * 3 : 70;
  const numChangs = phase === 1 ? 3 : phase === 2 ? 4 : 5;
  const distance = +(longDuration * 0.15).toFixed(1);
  return {
    durationMinutesTarget: longDuration,
    distanceKmTarget: distance,
    jumpRopeTargetReps: Math.round(distance * 320),
    runType: 'long-run' as const,
    paceGuidance: 'Pace bền bỉ ổn định',
    description: `Chạy dài tích lũy thể lực chia ${numChangs} chặng. Nghỉ đi bộ nạp nước 90s.`,
    cadenceGuidance: '165 - 172 spm',
    heartRateZone: 'Zone 2 (68 - 75% Max HR)',
    splitsSummary: `${numChangs} chặng x ~${+(distance / numChangs).toFixed(1)} km`,
    intervalConfig: { workDurationSec: Math.round((longDuration * 60) / numChangs), recoveryDurationSec: 90, repetitions: numChangs },
  };
}
