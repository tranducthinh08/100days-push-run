import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DAYS_VI = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

function getPhase(day) {
  if (day <= 30) return 1;
  if (day <= 70) return 2;
  return 3;
}

function calculatePushupSets(day, phase, dayOfWeekIndex) {
  if (day === 100) return [100];
  if (day >= 96 && day <= 99) return [];
  if (day === 26) return [30, 15, 12, 10];
  if (day === 68) return [65, 25, 20, 15];

  if (phase === 1) {
    const weekProgress = Math.floor((day - 1) / 7);
    const baseRep = 8 + weekProgress * 3;
    if (dayOfWeekIndex === 0) return [baseRep + 1, baseRep, baseRep, baseRep - 1, baseRep - 2];
    if (dayOfWeekIndex === 2) return [baseRep, baseRep, baseRep, baseRep, baseRep];
    if (dayOfWeekIndex === 4) return [baseRep + 3, baseRep + 1, baseRep, baseRep - 1, baseRep - 2];
  } else if (phase === 2) {
    const weekProgress = Math.floor((day - 31) / 7);
    const baseRep = 20 + weekProgress * 2;
    if (dayOfWeekIndex === 0) return [baseRep + 2, baseRep + 1, baseRep, baseRep, baseRep - 2];
    if (dayOfWeekIndex === 2) return [baseRep + 1, baseRep + 1, baseRep, baseRep, baseRep];
    if (dayOfWeekIndex === 4) return [baseRep + 4, baseRep + 2, baseRep + 1, baseRep, baseRep - 1];
  } else {
    const weekProgress = Math.min(2, Math.floor((day - 71) / 7));
    const peakFirst = 70 + weekProgress * 5;
    if (dayOfWeekIndex === 0) return [peakFirst, 30, 25, 20, 15];
    if (dayOfWeekIndex === 2) return [peakFirst - 5, 30, 25, 25, 20];
    if (dayOfWeekIndex === 4) return [peakFirst + 5, 25, 20, 20, 15];
  }
  return [10, 10, 10];
}

function getDayTitle(day, type, isTest) {
  if (day === 100) return 'CHINH PHỤC 100 HÍT ĐẤT LIÊN TỤC!';
  if (isTest) return `Ngày ${day}: Kiểm tra Max Push-ups`;
  if (type === 'push') return `Ngày ${day}: Rèn luyện Sức mạnh Hít đất`;
  if (type === 'run') return `Ngày ${day}: Chạy bộ Sức bền`;
  return `Ngày ${day}: Active Recovery & Giãn cơ`;
}

function getDayFocus(dow, isTest, day) {
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

function getWarmupBlock(type) {
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

function getMainBlock(day, type, sets, rest = 60) {
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

function getAccessoryBlock(dow, type) {
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

function getRunDetails(dow, phase, week) {
  if (dow === 1) {
    const duration = phase === 1 ? 25 : phase === 2 ? 40 : 45;
    const distance = +(duration * 0.14).toFixed(1);
    const numSets = phase === 1 ? 5 : phase === 2 ? 5 : 4;
    const workMins = phase === 1 ? 4 : phase === 2 ? 7 : 10;
    const setDistance = (distance / numSets).toFixed(1);
    const pace = phase === 1 ? 'Pace 7:00' : phase === 2 ? 'Pace 6:30' : 'Pace 6:15';
    
    const splits = Array.from({ length: numSets }, (_, i) => ({
      setNumber: i + 1,
      label: `Hiệp ${i + 1}`,
      work: `${workMins} phút chạy nhẹ (~${setDistance}km)`,
      pace: `${pace} (Zone 2)`,
      rest: '60s đi bộ thở đều',
    }));

    return {
      durationMinutesTarget: duration,
      distanceKmTarget: distance,
      runType: 'zone2',
      paceGuidance: 'Pace trò chuyện thoải mái (Zone 2 - Tim 65-75%)',
      description: `Chạy chia làm ${numSets} hiệp x [${workMins} phút chạy nhẹ Zone 2 + 1 phút đi bộ phục hồi], nhịp thở đều 3-3.`,
      cadenceGuidance: '165 - 175 spm',
      heartRateZone: 'Zone 2 (65 - 75% Max HR)',
      splitsSummary: `${numSets} hiệp x [${workMins}p chạy + 1p đi bộ]`,
      splits,
      intervalConfig: { workDurationSec: workMins * 60, recoveryDurationSec: 60, repetitions: numSets },
    };
  }

  if (dow === 3) {
    const reps = phase === 1 ? 4 : phase === 2 ? 6 : 8;
    const pace = phase === 1 ? 'Pace 5:30' : phase === 2 ? 'Pace 5:15' : 'Pace 5:00';
    const splits = Array.from({ length: reps }, (_, i) => ({
      setNumber: i + 1,
      label: `Rep ${i + 1}`,
      work: '2 phút chạy bốc (~350-400m)',
      pace: `${pace} (Zone 4-5)`,
      rest: '60s đi bộ phục hồi',
    }));

    return {
      durationMinutesTarget: 15 + reps * 3,
      distanceKmTarget: +(3.0 + reps * 0.4).toFixed(1),
      runType: 'interval',
      paceGuidance: 'Pace nhanh 85-92% MHR xen kẽ Đi bộ phục hồi',
      description: `Khởi động 5p -> Lặp lại ${reps} reps [2 phút chạy nhanh / 1 phút đi bộ] -> Thả lỏng 5p.`,
      cadenceGuidance: '180 - 190 spm',
      heartRateZone: 'Zone 4 - 5 (85 - 92% Max HR)',
      splitsSummary: `${reps} reps x [2p nhanh + 1p đi bộ]`,
      splits,
      intervalConfig: { workDurationSec: 120, recoveryDurationSec: 60, repetitions: reps },
    };
  }

  const longRunDuration = phase === 1 ? 30 + week * 2 : phase === 2 ? 45 + (week - 4) * 3 : 70;
  const longDistance = +(longRunDuration * 0.15).toFixed(1);
  const numChangs = phase === 1 ? 3 : phase === 2 ? 4 : 5;
  const changKm = (longDistance / numChangs).toFixed(1);
  const splits = Array.from({ length: numChangs }, (_, i) => ({
    setNumber: i + 1,
    label: `Chặng ${i + 1}`,
    work: `${Math.round(longRunDuration / numChangs)} phút (~${changKm}km)`,
    pace: 'Pace 6:45 - 7:00 (Zone 2)',
    rest: '90s đi bộ tiếp nước',
  }));

  return {
    durationMinutesTarget: longRunDuration,
    distanceKmTarget: longDistance,
    runType: 'long-run',
    paceGuidance: 'Pace bền bỉ ổn định',
    description: `Chạy dài tích lũy thể lực chia ${numChangs} chặng. Nghỉ đi bộ nạp nước 90s giữa mỗi chặng.`,
    cadenceGuidance: '165 - 172 spm',
    heartRateZone: 'Zone 2 (68 - 75% Max HR)',
    splitsSummary: `${numChangs} chặng x ~${changKm} km`,
    splits,
    intervalConfig: { workDurationSec: Math.round((longRunDuration * 60) / numChangs), recoveryDurationSec: 90, repetitions: numChangs },
  };
}

const days = [];
for (let day = 1; day <= 100; day++) {
  const dayOfWeekIndex = (day - 1) % 7;
  const weekNumber = Math.floor((day - 1) / 7) + 1;
  const phase = getPhase(day);
  const dayOfWeekVi = DAYS_VI[dayOfWeekIndex];

  let type = 'push';
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
    warmupBlock: getWarmupBlock(type),
    mainBlock: getMainBlock(day, type, pushupSets, restTime),
    accessoryBlock: getAccessoryBlock(dayOfWeekIndex, type),
    runDetails: type === 'run' ? getRunDetails(dayOfWeekIndex, phase, weekNumber) : undefined,
  });
}

const targetPath = path.resolve(__dirname, '../src/shared/data/program.json');
fs.writeFileSync(targetPath, JSON.stringify(days, null, 2), 'utf-8');
console.log(`Successfully generated ${days.length} days into ${targetPath}`);
