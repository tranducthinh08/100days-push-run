import { DayProgram, WorkoutDayType, ProgramPhase } from './types';

const DAYS_VI = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

function getPhase(day: number): ProgramPhase {
  if (day <= 30) return 1;
  if (day <= 70) return 2;
  return 3;
}

function calculatePushupSets(day: number, phase: ProgramPhase, dayOfWeekIndex: number): number[] {
  // Day 100: The Final Challenge
  if (day === 100) return [100];
  // Tapering days before Day 100 (Days 97, 98, 99): complete upper body rest
  if (day >= 96 && day <= 99) return [];

  // Test days
  if (day === 26) return [30, 15, 12, 10]; // Week 4 Test Max
  if (day === 68) return [65, 25, 20, 15]; // Week 10 Test Max

  if (phase === 1) {
    // Week 1-4: 5 sets x 8-18 reps
    const weekProgress = Math.floor((day - 1) / 7);
    const baseRep = 8 + weekProgress * 3; // 8, 11, 14, 17
    if (dayOfWeekIndex === 0) return [baseRep + 1, baseRep, baseRep, baseRep - 1, baseRep - 2];
    if (dayOfWeekIndex === 2) return [baseRep, baseRep, baseRep, baseRep, baseRep];
    if (dayOfWeekIndex === 4) return [baseRep + 3, baseRep + 1, baseRep, baseRep - 1, baseRep - 2];
  } else if (phase === 2) {
    // Week 5-10: 5-6 sets x 20-32 reps
    const weekProgress = Math.floor((day - 31) / 7);
    const baseRep = 20 + weekProgress * 2; // 20 to 30
    if (dayOfWeekIndex === 0) return [baseRep + 2, baseRep + 1, baseRep, baseRep, baseRep - 2];
    if (dayOfWeekIndex === 2) return [baseRep + 1, baseRep + 1, baseRep, baseRep, baseRep];
    if (dayOfWeekIndex === 4) return [baseRep + 4, baseRep + 2, baseRep + 1, baseRep, baseRep - 1];
  } else {
    // Phase 3 (Day 71-95) Peak volume
    const weekProgress = Math.min(2, Math.floor((day - 71) / 7));
    const peakFirst = 70 + weekProgress * 5; // 70, 75, 80
    if (dayOfWeekIndex === 0) return [peakFirst, 30, 25, 20, 15];
    if (dayOfWeekIndex === 2) return [peakFirst - 5, 30, 25, 25, 20];
    if (dayOfWeekIndex === 4) return [peakFirst + 5, 25, 20, 20, 15];
  }
  return [10, 10, 10];
}

export function generate100DaysProgram(): DayProgram[] {
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

    const programDay: DayProgram = {
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
      warmupBlock: getWarmupBlock(type),
      mainBlock: getMainBlock(day, type, pushupSets, restTime),
      accessoryBlock: getAccessoryBlock(dayOfWeekIndex, type),
      runDetails: type === 'run' ? getRunDetails(dayOfWeekIndex, phase, weekNumber) : undefined,
    };

    days.push(programDay);
  }

  return days;
}

function getDayTitle(day: number, type: WorkoutDayType, isTest: boolean): string {
  if (day === 100) return 'CHINH PHỤC 100 HÍT ĐẤT LIÊN TỤC!';
  if (isTest) return `Ngày ${day}: Kiểm tra Max Push-ups`;
  if (type === 'push') return `Ngày ${day}: Rèn luyện Sức mạnh Hít đất`;
  if (type === 'run') return `Ngày ${day}: Chạy bộ Sức bền`;
  return `Ngày ${day}: Active Recovery & Giãn cơ`;
}

function getDayFocus(dow: number, isTest: boolean, day: number): string {
  if (day === 100) return 'Mục tiêu tối thượng: 1 hiệp hoàn thành 100 cái';
  if (isTest) return 'Kiểm tra năng lực tối đa hiệp 1 (AMRAP)';
  switch (dow) {
    case 0: return 'Volume Hít đất + Khóa khớp tay sau + Gồng bụng chống võng lưng';
    case 1: return 'Chạy nhẹ Zone 2 dưỡng sức + Phục hồi cơ chân';
    case 2: return 'Density Push-ups (Giảm nghỉ) + Lưng xô chống gù vai';
    case 3: return 'Chạy Interval/Tempo biến tốc + Tăng sức mạnh bắp chân';
    case 4: return 'Thử thách Reps cao + Chùng chân cân bằng cơ đùi';
    case 5: return 'Chạy dài tích lũy nền tảng hiếu khí (Long Run)';
    default: return 'Đi bộ thả lỏng + Kéo giãn toàn thân';
  }
}

function getWarmupBlock(type: WorkoutDayType) {
  if (type === 'push') {
    return [
      { exerciseId: 'wrist-circles', targetSets: 2, targetReps: '15 vòng', restSeconds: 20 },
      { exerciseId: 'scapular-push-up', targetSets: 2, targetReps: '12 reps', restSeconds: 30 },
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
    return [
      {
        exerciseId: 'standard-push-up',
        targetSets: sets ? sets.length : 5,
        targetReps: targetStr,
        restSeconds: rest,
      },
    ];
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
    return {
      durationMinutesTarget: duration,
      distanceKmTarget: +(duration * 0.14).toFixed(1),
      runType: 'zone2' as const,
      paceGuidance: 'Pace trò chuyện thoải mái (Zone 2 - Tim 65-75%)',
      description: `Chạy đều liên tục ${duration} phút với nhịp thở đều 3 bước hít - 3 bước thở.`,
    };
  }
  if (dow === 3) {
    const reps = phase === 1 ? 4 : phase === 2 ? 6 : 8;
    return {
      durationMinutesTarget: 30 + reps * 3,
      runType: 'interval' as const,
      paceGuidance: 'Pace nhanh 85-90% MHR xen kẽ Đi bộ phục hồi',
      description: `Khởi động 5p -> Lặp lại ${reps} lần [2 phút chạy nhanh / 1 phút đi bộ] -> Thả lỏng 5p.`,
      intervalConfig: { workDurationSec: 120, recoveryDurationSec: 60, repetitions: reps },
    };
  }
  const longRunDuration = phase === 1 ? 30 + week * 2 : phase === 2 ? 45 + (week - 4) * 3 : 70;
  return {
    durationMinutesTarget: longRunDuration,
    distanceKmTarget: +(longRunDuration * 0.15).toFixed(1),
    runType: 'long-run' as const,
    paceGuidance: 'Pace bền bỉ ổn định',
    description: `Chạy dài tích lũy thể lực ${longRunDuration} phút. Uống từng ngụm nước nhỏ mỗi 20 phút.`,
  };
}
