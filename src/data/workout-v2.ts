// 居家无器械训练系统 v2（12 周，2026-10-26 起）—— /workout/ 页面用的计划数据
// 来源：Notion「💪 居家无器械训练系统 v2」。计划改版时同步修改本文件。
// 每周会变的东西（当前等级、组数、血压是否确认正常、B1/B2 替换）不在这里，见 ./workout-state.ts。
// 注意：本页面是公开站点的一部分，不要把身体基线数据（体重、体脂、血压读数）写进来。

export type ExerciseId =
  | 'squat'
  | 'pushup'
  | 'glute'
  | 'w'
  | 'deadbug'
  | 'sidePlank'
  | 'crunch'
  | 'birddog'
  | 'splitSquat'
  | 'pike';

export interface Level {
  variant: string;
  /** 每组的固定次数 / 秒数 */
  dose: string;
}

export interface Exercise {
  id: ExerciseId;
  name: string;
  muscles: string;
  /** 每组后休息（秒） */
  rest: number;
  /** 单侧动作换边休息（秒） */
  switchRest?: number;
  /** ①②③ 主项：强度随周次变化 */
  main?: boolean;
  /** 非主项的固定强度 */
  intensity?: string;
  cues: string;
  mistakes: string;
  regress: string;
  note?: string;
  levels: Level[];
}

export interface TimedStep {
  label: string;
  seconds: number;
  note?: string;
}

export const PLAN = {
  title: '居家无器械训练系统 v2',
  baselineStart: '2026-10-21',
  start: '2026-10-26',
  end: '2027-01-17',
  totalWeeks: 12,
  notion: {
    plan: 'https://app.notion.com/p/3fdb46e68aa38141b81dfc54e89581a7',
    log: 'https://app.notion.com/p/9fb2e243f0ac43fb9bd7a492813e8723',
    levels: 'https://app.notion.com/p/7ac02c27ab40477c8c2992da5110760d',
    review: 'https://app.notion.com/p/bbd90a839e78406f88686cbb0f6a0b91',
  },
  motto: '一 A、二走、三 B、四走、五恢复、六 A、日长走＋回顾',
} as const;

/** 主项（①②③）的强度随周次变化 */
export function mainIntensity(week: number): string {
  if (week <= 2) return 'RIR≥4（RPE 5–6）';
  if (week <= 4) return 'RIR≈4（RPE 6）';
  return 'RIR≈3（RPE≈7）';
}

/** 第 1–4 / 5–8 / 9–12 周对应的阶段下标 0 / 1 / 2（第 13 周以后沿用最后阶段） */
export function phaseIndex(week: number): 0 | 1 | 2 {
  if (week <= 4) return 0;
  if (week <= 8) return 1;
  return 2;
}

export const PHASES = [
  { name: '建立习惯、学动作', range: '第 1–4 周' },
  { name: '提高能力', range: '第 5–8 周' },
  { name: '形体与能力进阶', range: '第 9–12 周' },
] as const;

/** 快走 / 长走分钟（按阶段） */
export const WALK_MIN = [20, 30, 40] as const;
export const LONG_WALK_MIN = [30, 45, 60] as const;

export const EXERCISES: Record<ExerciseId, Exercise> = {
  squat: {
    id: 'squat',
    name: '深蹲',
    muscles: '股四头肌、臀、躯干',
    rest: 90,
    main: true,
    cues: '脚掌贴地，膝朝脚尖；下 2 秒起 1 秒；无痛幅度',
    mistakes: '脚跟抬起、膝内扣、塌腰、憋气',
    regress: '膝：扶墙、缩小幅度；仍痛停此动作',
    levels: [
      { variant: '扶墙浅蹲', dose: '8 次' },
      { variant: '徒手深蹲（无痛深度）', dose: '8 次' },
      { variant: '徒手深蹲', dose: '10 次' },
      { variant: '徒手深蹲', dose: '12 次' },
      { variant: '下放 3 秒深蹲', dose: '10 次' },
      { variant: '下放 3 秒＋底停 1 秒深蹲', dose: '10 次' },
    ],
  },
  pushup: {
    id: 'pushup',
    name: '俯卧撑',
    muscles: '胸、肱三头、前三角、躯干',
    rest: 90,
    main: true,
    cues: '头到脚一条线；肘约 45°；推起呼气',
    mistakes: '塌腰、头前探、耸肩',
    regress:
      '手腕：先改更直立墙面／更高台面，手腕中立；替代：折叠毛巾或垫子上握拳撑；仍痛停。肩：缩小幅度',
    levels: [
      { variant: '墙面', dose: '6 次' },
      { variant: '墙面', dose: '8 次' },
      { variant: '墙面', dose: '10 次' },
      { variant: '墙面·脚后移 10 cm', dose: '8 次' },
      { variant: '墙面·脚后移 20 cm', dose: '8 次' },
      { variant: '牢固台面', dose: '6 次' },
      { variant: '牢固台面', dose: '8 次' },
      { variant: '牢固台面', dose: '10 次' },
      { variant: '跪姿', dose: '6 次' },
      { variant: '跪姿', dose: '8 次' },
      { variant: '跪姿', dose: '10 次' },
      { variant: '标准俯卧撑', dose: '6 次' },
    ],
  },
  glute: {
    id: 'glute',
    name: '臀桥',
    muscles: '臀大肌、部分腘绳肌',
    rest: 90,
    main: true,
    cues: '肩髋膝一线，顶停 1 秒，慢放',
    mistakes: '腰过度后仰、膝外翻、颈用力',
    regress: '下背：降低高度；膝：脚离臀远些',
    levels: [
      { variant: '双腿', dose: '10 次' },
      { variant: '双腿', dose: '12 次' },
      { variant: '双腿', dose: '15 次' },
      { variant: '双腿·顶停 2 秒', dose: '12 次' },
      { variant: '偏侧（一脚前移）', dose: '每侧 6 次' },
      { variant: '单腿', dose: '每侧 6 次' },
      { variant: '单腿', dose: '每侧 8 次' },
    ],
  },
  w: {
    id: 'w',
    name: '俯卧 W 抬臂',
    muscles: '中下斜方、菱形、后三角（肩胛控制）',
    rest: 45,
    intensity: 'RPE 4–5',
    cues: '小幅抬离地面，胸腹贴地，眼看地面',
    mistakes: '抬头、挺腰、耸肩',
    regress: '肩：站姿靠墙 W；下背：腹下垫薄枕',
    note: '只练肩胛控制和耐力，不是拉力进阶',
    levels: [
      { variant: '停 2 秒', dose: '6 次' },
      { variant: '停 2 秒', dose: '8 次' },
      { variant: '停 2 秒', dose: '10 次' },
      { variant: '停 3 秒（封顶）', dose: '8 次' },
    ],
  },
  deadbug: {
    id: 'deadbug',
    name: '死虫',
    muscles: '抗伸展、腰盆控制',
    rest: 45,
    intensity: 'RPE 5–6，能自然呼吸',
    cues: '腰背轻贴地，伸出时慢呼气',
    mistakes: '腰拱起、太快、腿放太低',
    regress: '下背/颈：仰卧交替滑脚跟 每侧 4 次',
    levels: [
      { variant: '短杠杆', dose: '每侧 4 次' },
      { variant: '短杠杆', dose: '每侧 6 次' },
      { variant: '短杠杆', dose: '每侧 8 次' },
      { variant: '脚跟点地远伸', dose: '每侧 6 次' },
      { variant: '脚跟点地远伸', dose: '每侧 8 次' },
      { variant: '腿接近伸直', dose: '每侧 6 次' },
    ],
  },
  sidePlank: {
    id: 'sidePlank',
    name: '侧桥',
    muscles: '腹斜肌、腰方肌、臀中肌',
    rest: 45,
    switchRest: 15,
    intensity: 'RPE 5–6，能自然呼吸',
    cues: '肘在肩下，身体一线，可轻声数数',
    mistakes: '骨盆下坠、转体、憋气',
    regress: '肩：站姿侧身前臂抵墙推 10 秒',
    note: '每组都 ≤30 秒',
    levels: [
      { variant: '屈膝', dose: '每侧 10 秒' },
      { variant: '屈膝', dose: '每侧 15 秒' },
      { variant: '屈膝', dose: '每侧 20 秒' },
      { variant: '屈膝', dose: '每侧 30 秒' },
      { variant: '伸腿·双脚前后错开', dose: '每侧 15 秒' },
      { variant: '错脚', dose: '每侧 20 秒' },
      { variant: '错脚', dose: '每侧 30 秒' },
      { variant: '双脚叠放', dose: '每侧 15 秒' },
      { variant: '叠脚', dose: '每侧 20 秒' },
      { variant: '叠脚', dose: '每侧 30 秒' },
    ],
  },
  crunch: {
    id: 'crunch',
    name: '小幅卷腹',
    muscles: '腹直肌（屈曲）',
    rest: 45,
    intensity: 'RPE≈6',
    cues: '肩胛刚离地，呼气卷起，慢放',
    mistakes: '拉头、借惯性、憋气、抬太高',
    regress: '颈/下背：缩小幅度；仍不适改仰卧滑脚跟 每侧 4 次',
    note: '全周唯一屈曲动作，每周 ≤2 组',
    levels: [
      { variant: '手伸向膝', dose: '8 次' },
      { variant: '手伸向膝', dose: '10 次' },
      { variant: '手伸向膝', dose: '12 次' },
      { variant: '双臂交叉胸前', dose: '8 次' },
      { variant: '双臂交叉胸前', dose: '10 次' },
      { variant: '双臂交叉胸前', dose: '12 次' },
    ],
  },
  birddog: {
    id: 'birddog',
    name: '鸟狗',
    muscles: '抗旋转、躯干髋部稳定',
    rest: 45,
    switchRest: 15,
    intensity: 'RPE 5–6，能自然呼吸',
    cues: '手脚向远处伸，骨盆水平',
    mistakes: '抬太高、腰后仰、骨盆转',
    regress: '手腕：仰卧滑脚跟；平衡差：只伸腿',
    levels: [
      { variant: '对侧手脚，停 2 秒', dose: '每侧 4 次' },
      { variant: '停 2 秒', dose: '每侧 6 次' },
      { variant: '停 2 秒', dose: '每侧 8 次' },
      { variant: '停 3 秒', dose: '每侧 6 次' },
      { variant: '停 3 秒', dose: '每侧 8 次' },
    ],
  },
  splitSquat: {
    id: 'splitSquat',
    name: '扶墙分腿蹲',
    muscles: '腿、臀、单侧控制',
    rest: 90,
    switchRest: 15,
    main: true,
    cues: '原地上下不迈步，后膝不碰地',
    mistakes: '步幅不当、膝内扣、失衡',
    regress: '膝：缩小幅度；仍不适回深蹲当前等级',
    levels: [
      { variant: '扶墙', dose: '每侧 6 次' },
      { variant: '扶墙', dose: '每侧 8 次' },
      { variant: '扶墙', dose: '每侧 10 次' },
      { variant: '少扶墙', dose: '每侧 8 次' },
      { variant: '底停 1 秒', dose: '每侧 8 次' },
    ],
  },
  pike: {
    id: 'pike',
    name: '高位派克推',
    muscles: '肩前束、肱三头、上胸',
    rest: 90,
    main: true,
    cues: '手撑牢固台面，臀抬高成倒 V；头始终高于心脏；推起呼气',
    mistakes: '塌腰、肘外张、头低于心脏、憋气',
    regress: '肩：缩小幅度或回俯卧撑；手腕：台面越高越轻',
    note: '12 周内不做地面派克、倒立撑',
    levels: [
      { variant: '台面', dose: '6 次' },
      { variant: '台面', dose: '8 次' },
      { variant: '台面（封顶）', dose: '10 次' },
    ],
  },
};

/** 模板 A（周一、周六） */
export const TEMPLATE_A: ExerciseId[] = ['squat', 'pushup', 'glute', 'w', 'deadbug', 'sidePlank'];
/** 模板 B（周三）；第 5 周起满足条件时 ①→分腿蹲、②→派克推（由 workout-state.ts 的 bSwap 控制） */
export const TEMPLATE_B: ExerciseId[] = ['squat', 'pushup', 'glute', 'w', 'crunch', 'birddog'];
export const TEMPLATE_B_SWAPPED: ExerciseId[] = ['splitSquat', 'pike', 'glute', 'w', 'crunch', 'birddog'];

export const WARMUP: TimedStep[] = [
  { label: '低幅原地踏步或慢走', seconds: 60 },
  { label: '肩部绕环＋轻墙推', seconds: 60 },
  { label: '站姿髋铰链', seconds: 60 },
  { label: '小幅浅蹲', seconds: 60 },
  { label: '站姿骨盆前后活动', seconds: 60, note: '手腕舒服时可换四点支撑猫牛式' },
];

/** 1 组版用的短热身（3 分） */
export const WARMUP_SHORT: TimedStep[] = [
  { label: '原地踏步', seconds: 60 },
  { label: '肩部绕环', seconds: 60 },
  { label: '站姿髋铰链', seconds: 60 },
];

export const COOLDOWN: TimedStep[] = [
  { label: '慢走', seconds: 60 },
  { label: '小腿拉伸 左右各 30 秒', seconds: 60 },
  { label: '胸前拉伸 左右各 30 秒', seconds: 60, note: '只到轻微牵拉感' },
];

/** 1 组版用的短放松（2 分） */
export const COOLDOWN_SHORT: TimedStep[] = [
  { label: '慢走', seconds: 60 },
  { label: '小腿拉伸 左右各 30 秒', seconds: 60 },
];

export const RECOVERY: TimedStep[] = [
  { label: '慢走', seconds: 240 },
  { label: '温和猫牛式', seconds: 60 },
  { label: '四点支撑向后坐髋', seconds: 60 },
  { label: '仰卧屈膝、小幅左右摆膝', seconds: 60 },
  { label: '小腿拉伸 左右各 30 秒', seconds: 60 },
  { label: '胸前拉伸 左右各 30 秒', seconds: 60 },
  { label: '舒适姿势自然呼吸', seconds: 60 },
];

export const STRENGTH_RULES = [
  '做完一个动作的全部组数再做下一个',
  '起身、推起、卷起时呼气；必须憋气就结束该组或降一级',
  '不做到力竭；支撑面只用墙面或确认不晃、不滑的台面',
  '等长支撑每组 ≤30 秒',
];

export const STRENGTH_DONE =
  '完成标准：6 个动作按当前等级、组数做完，无憋气、无关节痛。出汗、酸痛、力竭都不是有效标准。';

export const WALK_PACE = 'RPE≈5：能说完整句子、唱歌困难';

/** 周日回顾要看的内容（Notion〈周回顾〉）；腰围、血压在待办里单独列出 */
export const WEEKLY_REVIEW = [
  '力量完成次数与三色灯',
  '计划内快走总分钟',
  '体重周均',
  '下周升哪 ≤2 个动作',
  '恢复情况',
];

export const MISSED_RULES = [
  '漏了就跳过，下一个固定日照常做当天内容。不补练、不加倍、不顺延。',
  '连续两天「漏练」（「休息」不算）→ 第三天至少做保底版。',
  '疲劳、严重缺觉，热身后仍很差 → 改做恢复流程或轻松散步，记 1组版并写原因。',
  '停训 ≥7 天 → 回来第一周全部 1 组版，主项留 ≥4 次余力。',
  '连续几周只能做最低版 → 周日回顾重新评估时间与目标。',
];

export const TRAFFIC_LIGHT = [
  { color: 'green', text: '3/3：可按规则升级，最多 2 个动作' },
  { color: 'yellow', text: '2/3：本周不升级，下周照旧' },
  { color: 'red', text: '≤1/3：下周不升级；写一句漏练原因；下周第一次力量日做 1 组版' },
] as const;

export const PROGRESS_RULES = [
  '加第 2 组（第 3 周起）：最近两次做完规定次数、呼吸稳定，主项最后一组 RIR≥4；无关节痛或加重的不适；血压已确认正常。',
  '升级资格（第 5 周起）：同一动作连续两次标准版做完，动作标准、无痛，最后一组 RIR≥3；核心类看 RPE ≤5、腰盆稳定。',
  '只在周日回顾决定，下周最多升 2 个动作，每个只升 1 级。1 组版、保底版不作依据。',
  '升级后做不到、明显变形或要憋气 → 结束该组，下次退回上一级。',
  '血压未确认正常前：保持 L1、每项 ×1，不加组、不升级。',
];

export const SAFETY = {
  stop: '必须憋气才能做完 → 停这一组或降一级。',
  lines: [
    '家庭早或晚平均 收缩压≥135 或 舒张压≥85 → 带记录看医生；确认正常前保持 L1、每项 ×1。',
    '训练前安静复测 收缩压≥160 或 舒张压≥100 → 当天不做力量、也不快走，联系医生。',
    '训练前安静复测 收缩压≥180 或 舒张压≥110 → 当天不训练，尽快就医。',
  ],
  normal: '“正常”＝收缩压＜135 且 舒张压＜85，看最近连续 5–7 天家庭记录或医生评估。',
  emergency:
    '胸痛、严重头晕、晕厥、视物模糊、突然剧烈头痛、单侧无力或说话困难 → 立即停止，拨打 119。',
  pain: '心悸、胸闷、轻度头晕或关节锐痛 → 立刻停这一组，休息观察；持续或反复就医。',
  banned: '不做力竭测试、最长支撑测试、跳跃、波比跳、倒立撑。',
};

export const MEASURE = {
  bp: '上臂式、袖带与心脏同高；坐姿有靠背、手臂有支撑；静坐约 5 分钟不说话。早上起床 1 小时内、排尿后、服药和早餐前；晚上睡前。每次连测 2 遍、间隔约 1 分钟取平均。避开刚运动、洗澡、饮酒、喝咖啡后。',
  waist: '早上排尿后、早餐前；站直、腹部放松不收腹；软尺水平绕过肚脐，自然呼气末读数；测 2 次取平均，精确到 0.5 cm。',
  weight: '起床排尿后、早餐前，同样衣服；以周平均看趋势。',
  photo: '同地点、光线、距离、衣着、时间，自然站姿，拍正面、侧面、背面。',
  check: '放在当周第一次力量日的正常组里：用当前等级的深蹲、俯卧撑、死虫、侧桥各 1 组，记 RPE、动作质量、有无晃动或憋气。不做极限测试。',
};
