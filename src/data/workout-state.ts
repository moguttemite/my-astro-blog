// /workout/ 页面的「当前状态」—— 每周日回顾后更新，commit 到 main 即自动部署。
// 只改这里的数字和开关即可，计划本身见 ./workout-v2.ts。
//
// level：动作等级，1 = L1（各动作的等级阶梯见 workout-v2.ts，也对应 Notion〈动作等级〉的「当前内容」）
// sets ：当前组数。第 1–2 周 1；第 3 周起满足加组条件才 2；第 9–12 周可选只给深蹲或俯卧撑之一设 3
//
// 规则提醒：血压未确认正常前，保持 L1、每项 ×1（页面会在不一致时提示）。

import type { ExerciseId } from './workout-v2';

export interface WorkoutState {
  /** 最近一次更新状态的日期（YYYY-MM-DD） */
  updatedAt: string;
  /** 血压已确认正常（家庭记录连续 5–7 天收缩压＜135 且舒张压＜85，或医生评估） */
  bpConfirmedNormal: boolean;
  /** 第 5 周起满足条件后，B 日 ①深蹲→扶墙分腿蹲、②俯卧撑→高位派克推 */
  bSwap: boolean;
  exercises: Record<ExerciseId, { level: number; sets: number }>;
}

export const WORKOUT_STATE: WorkoutState = {
  updatedAt: '2026-10-21',
  bpConfirmedNormal: false,
  bSwap: false,
  exercises: {
    squat: { level: 1, sets: 1 },
    pushup: { level: 1, sets: 1 },
    glute: { level: 1, sets: 1 },
    w: { level: 1, sets: 1 },
    deadbug: { level: 1, sets: 1 },
    sidePlank: { level: 1, sets: 1 },
    crunch: { level: 1, sets: 1 },
    birddog: { level: 1, sets: 1 },
    splitSquat: { level: 1, sets: 1 },
    pike: { level: 1, sets: 1 },
  },
};
