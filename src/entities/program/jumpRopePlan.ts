export interface JumpRopeSet {
  setNumber: number;
  label: string;
  targetReps: number;
  technique: string;
  cues: string;
  restSeconds: number;
}

export interface JumpRopeWorkoutPlan {
  totalTargetJumps: number;
  totalDurationMinutes: number;
  heartRateZone: string;
  intensityLabel: string;
  cadenceGuidance: string;
  summary: string;
  sets: JumpRopeSet[];
}

export function getJumpRopePlan(
  dayNumber: number,
  distanceKmTarget: number = 3.5,
  durationMinutesTarget: number = 25
): JumpRopeWorkoutPlan {
  const dayOfWeekIndex = (dayNumber - 1) % 7;
  const rawJumps = Math.round(distanceKmTarget * 320);
  const totalTargetJumps = Math.round(rawJumps / 50) * 50; // Round to nearest 50

  // 1. Interval Cardio (Thursday: dow === 3)
  if (dayOfWeekIndex === 3) {
    const numSets = 6;
    const baseReps = Math.round(totalTargetJumps / numSets / 10) * 10;
    const sets: JumpRopeSet[] = [
      {
        setNumber: 1,
        label: 'Hiệp 1',
        targetReps: baseReps,
        technique: 'Nhảy 2 chân cơ bản (Bắt nhịp)',
        cues: 'Tiếp đất êm bằng nửa bàn chân trước, khuỷu tay khép sát sườn.',
        restSeconds: 45,
      },
      {
        setNumber: 2,
        label: 'Hiệp 2',
        targetReps: baseReps + 30,
        technique: 'Nhảy biến tốc (High Cadence ~140 RPM)',
        cues: 'Tăng tốc độ xoay cổ tay, siết nhẹ cơ bụng để giữ thăng bằng.',
        restSeconds: 60,
      },
      {
        setNumber: 3,
        label: 'Hiệp 3',
        targetReps: baseReps,
        technique: 'Nhảy bước chạy võ sĩ (Boxer Step)',
        cues: 'Chuyển trọng tâm nhịp nhàng giữa 2 chân, giảm tải cho bắp chuối.',
        restSeconds: 45,
      },
      {
        setNumber: 4,
        label: 'Hiệp 4',
        targetReps: baseReps + 30,
        technique: 'Nhảy nâng gối nhẹ (Low High-Knees)',
        cues: 'Nâng đùi nhẹ góc 30-45 độ, thở sâu 2 nhịp nhảy 1 nhịp thở.',
        restSeconds: 60,
      },
      {
        setNumber: 5,
        label: 'Hiệp 5',
        targetReps: baseReps + 20,
        technique: 'Nhảy biến tốc bùng nổ (Speed Blast)',
        cues: 'Duy trì guồng quay liên tục, chỉ nảy vừa đủ để dây luồn qua.',
        restSeconds: 60,
      },
      {
        setNumber: 6,
        label: 'Hiệp 6',
        targetReps: Math.max(100, totalTargetJumps - (baseReps * 4 + 80)),
        technique: 'Nhảy cơ bản hạ nhiệt (Cool-down Bounce)',
        cues: 'Hạ nhịp tim về vùng phục hồi, thả lỏng vai và cổ chân.',
        restSeconds: 0,
      },
    ];

    return {
      totalTargetJumps,
      totalDurationMinutes: durationMinutesTarget,
      heartRateZone: 'Zone 3 - 4 (Hiếu khí & Đốt mỡ nhanh)',
      intensityLabel: 'HIIT BIẾN TỐC',
      cadenceGuidance: '130 - 150 vòng/phút',
      summary: `${numSets} hiệp x ~${baseReps} cái (Biến tốc & Boxer step)`,
      sets,
    };
  }

  // 2. Zone 2 Endurance / Long Jump Rope (Tuesday: dow === 1, Saturday: dow === 5)
  const numSets = 5;
  const baseReps = Math.round(totalTargetJumps / numSets / 10) * 10;
  const sets: JumpRopeSet[] = [
    {
      setNumber: 1,
      label: 'Hiệp 1',
      targetReps: baseReps,
      technique: 'Nhảy 2 chân cơ bản (Basic Bounce)',
      cues: 'Khởi động guồng quay, gối hơi chùng để hấp thụ phản lực sàn.',
      restSeconds: 45,
    },
    {
      setNumber: 2,
      label: 'Hiệp 2',
      targetReps: baseReps + 20,
      technique: 'Nhảy bước chạy võ sĩ (Boxer Step)',
      cues: 'Nhún nhịp nhàng luân phiên 2 chân, thả lỏng toàn bộ vai gáy.',
      restSeconds: 45,
    },
    {
      setNumber: 3,
      label: 'Hiệp 3',
      targetReps: baseReps + 20,
      technique: 'Nhảy nhịp điệu Zone 2 (Rhythm Pace)',
      cues: 'Giữ nhịp thở đều 3-3 (3 cái hít vào, 3 cái thở ra), tim êm ái.',
      restSeconds: 45,
    },
    {
      setNumber: 4,
      label: 'Hiệp 4',
      targetReps: baseReps,
      technique: 'Nhảy bước chạy võ sĩ (Boxer Step)',
      cues: 'Giữ khuỷu tay sát sườn, chỉ cử động nhẹ cổ tay để tiết kiệm năng lượng.',
      restSeconds: 45,
    },
    {
      setNumber: 5,
      label: 'Hiệp 5',
      targetReps: Math.max(100, totalTargetJumps - (baseReps * 3 + 40)),
      technique: 'Nhảy cơ bản kiên định (Finisher Set)',
      cues: 'Tập trung cao độ, hoàn thành trọn vẹn số cái mục tiêu của ngày.',
      restSeconds: 0,
    },
  ];

  return {
    totalTargetJumps,
    totalDurationMinutes: durationMinutesTarget,
    heartRateZone: 'Zone 2 (Bền bỉ tim mạch & Khỏe cổ chân)',
    intensityLabel: 'CARDIO BỀN BỈ',
    cadenceGuidance: '115 - 130 vòng/phút',
    summary: `${numSets} hiệp x ~${baseReps} cái (Nghỉ 45s giữa hiệp)`,
    sets,
  };
}
