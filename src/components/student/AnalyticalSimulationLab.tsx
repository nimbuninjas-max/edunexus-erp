import React, { useState, useEffect, useMemo } from 'react';
import { Student } from '../../types/erp';

interface AnalyticalSimulationLabProps {
  currentStudent: Student;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

type AnalyticalTopicId = 'blood-relation' | 'train-motion' | 'work-together' | 'dice-sim' | 'interest-sim';

interface BloodRelationNode {
  id: string;
  name: string;
  roleLabel: string;
  gender: 'M' | 'F';
  gen: number; // -2 Grandparents, -1 Parents, 0 Self/Siblings, +1 Children
  x: number;
  y: number;
  revealedAtStep: number;
}

interface BloodRelationEdge {
  from: string;
  to: string;
  type: 'parent' | 'spouse' | 'sibling';
  label: string;
  revealedAtStep: number;
}

interface BloodScenario {
  id: string;
  title: string;
  statement: string;
  question: string;
  options: string[];
  correctAnswer: string;
  xp: number;
  steps: string[];
  nodes: BloodRelationNode[];
  edges: BloodRelationEdge[];
}

const BLOOD_RELATION_SCENARIOS: BloodScenario[] = [
  {
    id: 'br-1',
    title: 'Scenario 1: Pointing to a Portrait (3-Generation Deduction)',
    statement:
      'Pointing to a girl in a photograph, Aarav said: "She is the daughter of the only son of my paternal grandfather."',
    question: 'How is the girl in the photograph related to Aarav?',
    options: ['Sister', 'Cousin', 'Niece', 'Paternal Aunt'],
    correctAnswer: 'Sister',
    xp: 90,
    steps: [
      'Step 1: Start at speaker Aarav (Generation 0, Male □) and locate his Paternal Grandfather (Generation -2).',
      'Step 2: Trace "the only son of my paternal grandfather" → This is Aarav’s Father (Rajesh, Generation -1).',
      'Step 3: Trace "the daughter of Aarav’s Father" → Ananya (Generation 0, Female ○), who shares the same father as Aarav.',
      'Step 4: Conclusion — Ananya and Aarav are children of the same father, so the girl is Aarav’s Sister!'
    ],
    nodes: [
      { id: 'gf', name: 'Dada Ji', roleLabel: 'Paternal Grandfather', gender: 'M', gen: -2, x: 280, y: 42, revealedAtStep: 1 },
      { id: 'dad', name: 'Rajesh (Only Son)', roleLabel: 'Aarav’s Father', gender: 'M', gen: -1, x: 280, y: 122, revealedAtStep: 2 },
      { id: 'aarav', name: 'Aarav (Speaker)', roleLabel: 'Self (Boy)', gender: 'M', gen: 0, x: 175, y: 205, revealedAtStep: 1 },
      { id: 'girl', name: 'Girl in Photo', roleLabel: 'Father’s Daughter', gender: 'F', gen: 0, x: 385, y: 205, revealedAtStep: 3 }
    ],
    edges: [
      { from: 'gf', to: 'dad', type: 'parent', label: 'Only Son ↓', revealedAtStep: 2 },
      { from: 'dad', to: 'aarav', type: 'parent', label: 'Son ↓', revealedAtStep: 1 },
      { from: 'dad', to: 'girl', type: 'parent', label: 'Daughter ↓', revealedAtStep: 3 },
      { from: 'aarav', to: 'girl', type: 'sibling', label: 'Brother ─ Sister', revealedAtStep: 4 }
    ]
  },
  {
    id: 'br-2',
    title: 'Scenario 2: Coded Family Chain (P + Q × R − S)',
    statement:
      'In a family: Vikrant is the brother of Neha. Neha is the wife of Karan. Karan is the father of Riya.',
    question: 'How is Vikrant related to Riya?',
    options: ['Maternal Uncle (Mama)', 'Paternal Uncle (Chacha)', 'Brother-in-Law', 'Grandfather'],
    correctAnswer: 'Maternal Uncle (Mama)',
    xp: 100,
    steps: [
      'Step 1: Place Vikrant (Male □) and Neha (Female ○) in Generation -1 connected by a horizontal Sibling bond (─).',
      'Step 2: Connect Neha (○) and Karan (Male □) with a double Marriage bond (═) in Generation -1.',
      'Step 3: Trace Karan and Neha’s daughter Riya (Female ○) down to Generation 0.',
      'Step 4: Since Neha is Riya’s mother and Vikrant is Neha’s brother, Vikrant is Riya’s Maternal Uncle (Mama)!'
    ],
    nodes: [
      { id: 'vik', name: 'Vikrant', roleLabel: 'Neha’s Brother', gender: 'M', gen: -1, x: 130, y: 95, revealedAtStep: 1 },
      { id: 'neha', name: 'Neha', roleLabel: 'Riya’s Mother', gender: 'F', gen: -1, x: 290, y: 95, revealedAtStep: 1 },
      { id: 'karan', name: 'Karan', roleLabel: 'Neha’s Husband', gender: 'M', gen: -1, x: 450, y: 95, revealedAtStep: 2 },
      { id: 'riya', name: 'Riya', roleLabel: 'Daughter', gender: 'F', gen: 0, x: 370, y: 195, revealedAtStep: 3 }
    ],
    edges: [
      { from: 'vik', to: 'neha', type: 'sibling', label: 'Brother ─', revealedAtStep: 1 },
      { from: 'neha', to: 'karan', type: 'spouse', label: 'Married ═', revealedAtStep: 2 },
      { from: 'karan', to: 'riya', type: 'parent', label: 'Father ↓', revealedAtStep: 3 },
      { from: 'vik', to: 'riya', type: 'parent', label: 'Maternal Uncle ↘', revealedAtStep: 4 }
    ]
  },
  {
    id: 'br-3',
    title: 'Scenario 3: Maternal & Paternal In-Law Puzzle',
    statement:
      'Meera introduces Dev as: "He is the son of the only brother of my mother."',
    question: 'How is Dev related to Meera?',
    options: ['Cousin (Maternal Uncle’s Son)', 'Nephew', 'Real Brother', 'Uncle'],
    correctAnswer: 'Cousin (Maternal Uncle’s Son)',
    xp: 90,
    steps: [
      'Step 1: Place Meera (Female ○, Generation 0) and her Mother Sunita (Female ○, Generation -1).',
      'Step 2: Locate "the only brother of Meera’s mother" → Maternal Uncle (Mama, Generation -1).',
      'Step 3: Trace the son of that Maternal Uncle down to Generation 0 → Dev (Male □).',
      'Step 4: Since Dev is the son of Meera’s maternal uncle, Dev is Meera’s Cousin!'
    ],
    nodes: [
      { id: 'mom', name: 'Sunita', roleLabel: 'Meera’s Mother', gender: 'F', gen: -1, x: 190, y: 85, revealedAtStep: 1 },
      { id: 'uncle', name: 'Mama Ji', roleLabel: 'Mother’s Brother', gender: 'M', gen: -1, x: 390, y: 85, revealedAtStep: 2 },
      { id: 'meera', name: 'Meera', roleLabel: 'Speaker', gender: 'F', gen: 0, x: 190, y: 195, revealedAtStep: 1 },
      { id: 'dev', name: 'Dev', roleLabel: 'Uncle’s Son', gender: 'M', gen: 0, x: 390, y: 195, revealedAtStep: 3 }
    ],
    edges: [
      { from: 'mom', to: 'meera', type: 'parent', label: 'Mother ↓', revealedAtStep: 1 },
      { from: 'mom', to: 'uncle', type: 'sibling', label: 'Sister ─ Brother', revealedAtStep: 2 },
      { from: 'uncle', to: 'dev', type: 'parent', label: 'Son ↓', revealedAtStep: 3 },
      { from: 'meera', to: 'dev', type: 'sibling', label: 'Cousins ┄', revealedAtStep: 4 }
    ]
  }
];

export const AnalyticalSimulationLab: React.FC<AnalyticalSimulationLabProps> = ({
  currentStudent,
  handleAwardBonusXP,
  playUISound,
  showToast
}) => {
  const [activeTopic, setActiveTopic] = useState<AnalyticalTopicId>('train-motion');

  // ============================================================================
  // TOPIC 1: BLOOD RELATION ANIMATED FAMILY TREE STATE
  // ============================================================================
  const [bloodScenIdx, setBloodScenIdx] = useState(0);
  const [bloodStep, setBloodStep] = useState(4);
  const [bloodPlaying, setBloodPlaying] = useState(false);
  const [bloodSelectedAns, setBloodSelectedAns] = useState<string | null>(null);
  const currentBloodScen = BLOOD_RELATION_SCENARIOS[bloodScenIdx % BLOOD_RELATION_SCENARIOS.length];

  useEffect(() => {
    if (!bloodPlaying) return;
    const timer = setInterval(() => {
      setBloodStep(prev => {
        if (prev >= 4) {
          setBloodPlaying(false);
          return 4;
        }
        return prev + 1;
      });
    }, 1100);
    return () => clearInterval(timer);
  }, [bloodPlaying]);

  // ============================================================================
  // TOPIC 2: TRAIN TIME, SPEED & DISTANCE ANIMATED TRACK STATE
  // ============================================================================
  const [trainMode, setTrainMode] = useState<'opposite' | 'same' | 'platform'>('opposite');
  const [train1Len, setTrain1Len] = useState(180); // meters
  const [train1SpeedKmh, setTrain1SpeedKmh] = useState(72); // km/h
  const [train2Len, setTrain2Len] = useState(120); // meters (or platform length)
  const [train2SpeedKmh, setTrain2SpeedKmh] = useState(36); // km/h
  const [trainProgress, setTrainProgress] = useState(0.45); // 0 to 1
  const [trainPlaying, setTrainPlaying] = useState(false);
  const [trainQuizInput, setTrainQuizInput] = useState('');

  const trainMath = useMemo(() => {
    const v1Ms = Number(((train1SpeedKmh * 5) / 18).toFixed(2));
    const effectiveV2Kmh = trainMode === 'platform' ? 0 : train2SpeedKmh;
    const v2Ms = Number(((effectiveV2Kmh * 5) / 18).toFixed(2));

    const relSpeedKmh =
      trainMode === 'opposite'
        ? train1SpeedKmh + effectiveV2Kmh
        : trainMode === 'same'
        ? Math.max(4, Math.abs(train1SpeedKmh - effectiveV2Kmh))
        : train1SpeedKmh;

    const relSpeedMs = Number(((relSpeedKmh * 5) / 18).toFixed(2));
    const totalDistMeters = train1Len + train2Len;
    const crossingTimeSec = Number((totalDistMeters / Math.max(0.5, relSpeedMs)).toFixed(2));

    return {
      v1Ms,
      v2Ms,
      effectiveV2Kmh,
      relSpeedKmh,
      relSpeedMs,
      totalDistMeters,
      crossingTimeSec
    };
  }, [trainMode, train1Len, train1SpeedKmh, train2Len, train2SpeedKmh]);

  useEffect(() => {
    if (!trainPlaying) return;
    const interval = setInterval(() => {
      setTrainProgress(prev => {
        if (prev >= 1) {
          setTrainPlaying(false);
          return 1;
        }
        return Number(Math.min(1, prev + 0.02).toFixed(3));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [trainPlaying]);

  // ============================================================================
  // TOPIC 3: WORK & TIME (2 PEOPLE WORK TOGETHER & ONE LEAVES) STATE
  // ============================================================================
  const [workerADays, setWorkerADays] = useState(12);
  const [workerBDays, setWorkerBDays] = useState(15);
  const [whoLeaves, setWhoLeaves] = useState<'A' | 'B' | 'none'>('A');
  const [leaveAfterDays, setLeaveAfterDays] = useState(4);
  const [workAnimDay, setWorkAnimDay] = useState(10);
  const [workPlaying, setWorkPlaying] = useState(false);

  const workMath = useMemo(() => {
    // LCM total units method
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const lcmUnits = (workerADays * workerBDays) / gcd(workerADays, workerBDays);
    const rateA = lcmUnits / workerADays; // units/day
    const rateB = lcmUnits / workerBDays; // units/day
    const combinedRate = rateA + rateB;

    const maxTogetherDays = Math.min(leaveAfterDays, Math.floor(lcmUnits / combinedRate));
    const actualTogetherDays = whoLeaves === 'none' ? lcmUnits / combinedRate : maxTogetherDays;
    const workDoneTogetherUnits = Math.min(lcmUnits, actualTogetherDays * combinedRate);
    const workDoneTogetherPct = Number(((workDoneTogetherUnits / lcmUnits) * 100).toFixed(1));

    const remainingUnits = Math.max(0, lcmUnits - workDoneTogetherUnits);
    const soloWorker = whoLeaves === 'A' ? 'B' : 'A';
    const soloRate = whoLeaves === 'A' ? rateB : rateA;
    const remainingSoloDays =
      whoLeaves === 'none' ? 0 : Number((remainingUnits / soloRate).toFixed(2));
    const totalProjectDays = Number((actualTogetherDays + remainingSoloDays).toFixed(2));

    // Build day-by-day slices for animation
    const totalCeilDays = Math.ceil(totalProjectDays);
    const dailySlices: {
      day: number;
      aUnits: number;
      bUnits: number;
      cumPct: number;
      note: string;
    }[] = [];
    let cumUnits = 0;

    for (let d = 1; d <= totalCeilDays; d++) {
      const remainingBefore = Math.max(0, lcmUnits - cumUnits);
      if (remainingBefore <= 0.001) break;

      let aU = 0;
      let bU = 0;
      let note = '';

      if (whoLeaves === 'none' || d <= actualTogetherDays) {
        const neededFrac = Math.min(1, remainingBefore / combinedRate);
        aU = Number((rateA * neededFrac).toFixed(2));
        bU = Number((rateB * neededFrac).toFixed(2));
        note =
          d === actualTogetherDays && whoLeaves !== 'none'
            ? `Both work (Worker ${whoLeaves} leaves after Day ${d})`
            : 'Both Worker A & Worker B working together';
      } else {
        const neededFrac = Math.min(1, remainingBefore / soloRate);
        if (soloWorker === 'A') aU = Number((rateA * neededFrac).toFixed(2));
        else bU = Number((rateB * neededFrac).toFixed(2));
        note = `Only Worker ${soloWorker} works alone to finish balance`;
      }

      cumUnits = Math.min(lcmUnits, cumUnits + aU + bU);
      dailySlices.push({
        day: d,
        aUnits: aU,
        bUnits: bU,
        cumPct: Number(((cumUnits / lcmUnits) * 100).toFixed(1)),
        note
      });
    }

    return {
      lcmUnits,
      rateA,
      rateB,
      combinedRate,
      actualTogetherDays: Number(actualTogetherDays.toFixed(2)),
      workDoneTogetherUnits: Number(workDoneTogetherUnits.toFixed(1)),
      workDoneTogetherPct,
      remainingUnits: Number(remainingUnits.toFixed(1)),
      soloWorker,
      remainingSoloDays,
      totalProjectDays,
      dailySlices
    };
  }, [workerADays, workerBDays, whoLeaves, leaveAfterDays]);

  useEffect(() => {
    if (!workPlaying) return;
    const timer = setInterval(() => {
      setWorkAnimDay(prev => {
        if (prev >= workMath.dailySlices.length) {
          setWorkPlaying(false);
          return workMath.dailySlices.length;
        }
        return prev + 1;
      });
    }, 650);
    return () => clearInterval(timer);
  }, [workPlaying, workMath.dailySlices.length]);

  // ============================================================================
  // TOPIC 4: 3D DICE PROBABILITY & CUBE FACE SIMULATOR STATE
  // ============================================================================
  const [die1Val, setDie1Val] = useState(4);
  const [die2Val, setDie2Val] = useState(3);
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [diceCondition, setDiceCondition] = useState<
    'sum-7' | 'sum-ge-9' | 'doublets' | 'prime-sum' | 'at-least-one-6'
  >('sum-7');
  const [rollHistoryCount, setRollHistoryCount] = useState(12);
  const [rollHitsCount, setRollHitsCount] = useState(3);
  const [oppositeFaceQuery, setOppositeFaceQuery] = useState<number>(2);

  const checkDicePairMatches = (d1: number, d2: number, cond = diceCondition) => {
    const s = d1 + d2;
    if (cond === 'sum-7') return s === 7;
    if (cond === 'sum-ge-9') return s >= 9;
    if (cond === 'doublets') return d1 === d2;
    if (cond === 'prime-sum') return [2, 3, 5, 7, 11].includes(s);
    if (cond === 'at-least-one-6') return d1 === 6 || d2 === 6;
    return false;
  };

  const favorableOutcomesCount = useMemo(() => {
    let count = 0;
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        if (checkDicePairMatches(i, j, diceCondition)) count++;
      }
    }
    return count;
  }, [diceCondition]);

  const handleRollDice = (batchCount = 1) => {
    playUISound('click');
    setIsRollingDice(true);
    setTimeout(() => {
      let newHits = 0;
      let lastD1 = 1;
      let lastD2 = 1;
      for (let k = 0; k < batchCount; k++) {
        lastD1 = Math.floor(Math.random() * 6) + 1;
        lastD2 = Math.floor(Math.random() * 6) + 1;
        if (checkDicePairMatches(lastD1, lastD2, diceCondition)) newHits++;
      }
      setDie1Val(lastD1);
      setDie2Val(lastD2);
      setRollHistoryCount(prev => prev + batchCount);
      setRollHitsCount(prev => prev + newHits);
      setIsRollingDice(false);
      if (batchCount >= 10) {
        handleAwardBonusXP(currentStudent.id, 30, `Ran ${batchCount}-Roll Dice Probability Simulation`);
      }
    }, 320);
  };

  // ============================================================================
  // TOPIC 5: SIMPLE INTEREST (SI) VS COMPOUND INTEREST (CI) SIMULATOR STATE
  // ============================================================================
  const [principal, setPrincipal] = useState(20000);
  const [ratePct, setRatePct] = useState(10);
  const [timeYears, setTimeYears] = useState(4);
  const [compFreq, setCompFreq] = useState<1 | 2 | 4>(1); // 1=Annual, 2=Half-Yearly, 4=Quarterly
  const [animYearLimit, setAnimYearLimit] = useState(4);
  const [interestPlaying, setInterestPlaying] = useState(false);

  const interestMath = useMemo(() => {
    const yearlyRows: {
      year: number;
      siInterestTotal: number;
      siAmount: number;
      ciInterestTotal: number;
      ciAmount: number;
      diffCiSi: number;
    }[] = [];

    for (let y = 1; y <= timeYears; y++) {
      const siInt = Math.round((principal * ratePct * y) / 100);
      const siAmt = principal + siInt;
      const ciAmt = Math.round(
        principal * Math.pow(1 + ratePct / (100 * compFreq), compFreq * y)
      );
      const ciInt = ciAmt - principal;
      yearlyRows.push({
        year: y,
        siInterestTotal: siInt,
        siAmount: siAmt,
        ciInterestTotal: ciInt,
        ciAmount: ciAmt,
        diffCiSi: ciInt - siInt
      });
    }

    const finalRow = yearlyRows[yearlyRows.length - 1] || {
      year: 1,
      siInterestTotal: 0,
      siAmount: principal,
      ciInterestTotal: 0,
      ciAmount: principal,
      diffCiSi: 0
    };

    const twoYrDiffShortcut = Number(
      (principal * Math.pow(ratePct / 100, 2)).toFixed(2)
    );
    const threeYrDiffShortcut = Number(
      (principal * Math.pow(ratePct / 100, 2) * ((300 + ratePct) / 100)).toFixed(2)
    );

    return {
      yearlyRows,
      finalRow,
      twoYrDiffShortcut,
      threeYrDiffShortcut
    };
  }, [principal, ratePct, timeYears, compFreq]);

  useEffect(() => {
    setAnimYearLimit(timeYears);
  }, [timeYears]);

  useEffect(() => {
    if (!interestPlaying) return;
    const timer = setInterval(() => {
      setAnimYearLimit(prev => {
        if (prev >= timeYears) {
          setInterestPlaying(false);
          return timeYears;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(timer);
  }, [interestPlaying, timeYears]);

  return (
    <div className="space-y-5">
      {/* ANALYTICAL TOPIC NAVIGATION PILLS (FUNCTIONAL SEGMENTED BUTTONS) */}
      <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
              Animated Scenario-Based Analytical & Quantitative Simulator
            </span>
            <h2 className="text-base font-semibold text-[#1C2A27] mt-0.5">
              Select an Analytical Topic to Animate Step-by-Step Scenarios
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-[#0A4D44]">
            5 Live Interactive Engines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {[
            { id: 'train-motion' as const, label: '1. Train Time & Distance', sub: 'Animated Dual Track' },
            { id: 'work-together' as const, label: '2. Work & Person Left', sub: 'Day-by-Day LCM Tower' },
            { id: 'blood-relation' as const, label: '3. Blood Relations', sub: 'Animated Family Tree' },
            { id: 'dice-sim' as const, label: '4. 3D Dice & Cube Sim', sub: '36-Grid & Opposite Face' },
            { id: 'interest-sim' as const, label: '5. SI vs CI Compounding', sub: 'Wealth & Diff Animator' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playUISound('tab');
                setActiveTopic(tab.id);
              }}
              className={`p-3 rounded-xl border text-left transition ${
                activeTopic === tab.id
                  ? 'bg-[#0A4D44] text-[#F5F0E6] border-[#0A4D44] shadow-xs'
                  : 'bg-[#F7F3EB] hover:bg-[#EAE2D3] text-[#1C2A27] border-[#DDD4C2]'
              }`}
            >
              <p className="text-xs font-semibold">{tab.label}</p>
              <p
                className={`text-[10px] font-mono mt-0.5 ${
                  activeTopic === tab.id ? 'text-[#9CC5BE]' : 'text-[#686052]'
                }`}
              >
                {tab.sub}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          MODULE 1: TRAIN TIME, SPEED & DISTANCE ANIMATED SIMULATOR
         ===================================================================== */}
      {activeTopic === 'train-motion' && (
        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2D3] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                Time, Speed & Distance • Relative Motion Railway Simulator
              </span>
              <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                Animated Train Crossing Scenario (Opposite Direction, Overtaking & Platform/Bridge)
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                {
                  label: 'Opposite Trains',
                  mode: 'opposite' as const,
                  l1: 180,
                  v1: 72,
                  l2: 120,
                  v2: 36
                },
                {
                  label: 'Same Direction Overtake',
                  mode: 'same' as const,
                  l1: 160,
                  v1: 90,
                  l2: 140,
                  v2: 54
                },
                {
                  label: 'Train + 220m Platform',
                  mode: 'platform' as const,
                  l1: 180,
                  v1: 72,
                  l2: 220,
                  v2: 0
                }
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    setTrainMode(preset.mode);
                    setTrain1Len(preset.l1);
                    setTrain1SpeedKmh(preset.v1);
                    setTrain2Len(preset.l2);
                    setTrain2SpeedKmh(preset.v2);
                    setTrainProgress(0);
                    setTrainPlaying(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    trainMode === preset.mode
                      ? 'bg-[#0A4D44] text-[#F5F0E6]'
                      : 'bg-[#EAE2D3] text-[#1C2A27] hover:bg-[#DDD4C2]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* ANIMATED RAILWAY TRACK CANVAS */}
          <div className="bg-[#072E29] text-[#F5F0E6] rounded-xl p-4 sm:p-5 border border-[#14463F] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <span>
                  Total Crossing Distance (L₁ + L₂):{' '}
                  <strong className="text-[#4ADE80] font-mono">{trainMath.totalDistMeters} m</strong>
                </span>
                <span>
                  Relative Speed:{' '}
                  <strong className="text-[#FACC15] font-mono">
                    {trainMath.relSpeedKmh} km/h = {trainMath.relSpeedMs} m/s
                  </strong>
                </span>
                <span>
                  Exact Time to Cross:{' '}
                  <strong className="text-white font-mono text-sm">
                    {trainMath.crossingTimeSec} sec
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    if (trainProgress >= 1) setTrainProgress(0);
                    setTrainPlaying(!trainPlaying);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#4ADE80] text-[#072E29] font-semibold text-xs transition"
                >
                  {trainPlaying ? '⏸ Pause Train' : '▶ Animate Crossing'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    setTrainPlaying(false);
                    setTrainProgress(0);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#124E45] text-[#F5F0E6] text-xs font-semibold"
                >
                  Reset 0.0s
                </button>
              </div>
            </div>

            {/* SVG DUAL RAILWAY TRACK WITH ANIMATED TRAINS */}
            <svg
              viewBox="0 0 680 185"
              className="w-full h-44 sm:h-48 bg-[#0A3630] rounded-xl border border-[#19574E]"
            >
              {/* Railway Sleepers & Tracks */}
              {Array.from({ length: 28 }, (_, i) => (
                <g key={i}>
                  <line
                    x1={20 + i * 24}
                    y1="52"
                    x2={20 + i * 24}
                    y2="84"
                    stroke="#19574E"
                    strokeWidth="3"
                  />
                  <line
                    x1={20 + i * 24}
                    y1="115"
                    x2={20 + i * 24}
                    y2="147"
                    stroke="#19574E"
                    strokeWidth="3"
                  />
                </g>
              ))}
              <line x1="10" y1="58" x2="670" y2="58" stroke="#8AB0A9" strokeWidth="2" />
              <line x1="10" y1="78" x2="670" y2="78" stroke="#8AB0A9" strokeWidth="2" />
              <line x1="10" y1="121" x2="670" y2="121" stroke="#8AB0A9" strokeWidth="2" />
              <line x1="10" y1="141" x2="670" y2="141" stroke="#8AB0A9" strokeWidth="2" />

              {/* Train A (Top Track — Moving Right ->) */}
              {(() => {
                const w1 = Math.max(85, Math.min(180, train1Len * 0.65));
                const x1 = 90 + trainProgress * 340;
                return (
                  <g>
                    <rect
                      x={x1}
                      y="44"
                      width={w1}
                      height="32"
                      rx="6"
                      fill="#10B981"
                      stroke="#ECFDF5"
                      strokeWidth="1.5"
                    />
                    <polygon
                      points={`${x1 + w1},44 ${x1 + w1 + 14},60 ${x1 + w1},76`}
                      fill="#059669"
                    />
                    <text
                      x={x1 + 10}
                      y="64"
                      fill="#06231F"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      Train A ({train1Len}m • {train1SpeedKmh}km/h →)
                    </text>
                  </g>
                );
              })()}

              {/* Train B or Platform (Bottom Track) */}
              {(() => {
                const w2 = Math.max(85, Math.min(190, train2Len * 0.65));
                const x2 =
                  trainMode === 'platform'
                    ? 275
                    : trainMode === 'opposite'
                    ? 450 - trainProgress * 280
                    : 210 + trainProgress * 150;
                return (
                  <g>
                    <rect
                      x={x2}
                      y="108"
                      width={w2}
                      height="32"
                      rx="6"
                      fill={trainMode === 'platform' ? '#D4A359' : '#3B82F6'}
                      stroke="#F8FAFC"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x2 + 10}
                      y="128"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {trainMode === 'platform'
                        ? `Station Platform (${train2Len}m)`
                        : trainMode === 'opposite'
                        ? `← Train B (${train2Len}m • ${train2SpeedKmh}km/h)`
                        : `Train B (${train2Len}m • ${train2SpeedKmh}km/h →)`}
                    </text>
                  </g>
                );
              })()}

              {/* Live Stopwatch Overlay */}
              <text x="20" y="25" fill="#9CC5BE" fontSize="11" fontFamily="monospace">
                Elapsed Stopwatch: {(trainProgress * trainMath.crossingTimeSec).toFixed(2)}s /{' '}
                {trainMath.crossingTimeSec}s | Distance Covered:{' '}
                {Math.round(trainProgress * trainMath.totalDistMeters)}m / {trainMath.totalDistMeters}m
              </text>
            </svg>

            {/* Timeline Scrubber */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span>Scrub Timeline:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={trainProgress}
                onChange={e => {
                  setTrainPlaying(false);
                  setTrainProgress(Number(e.target.value));
                }}
                className="flex-1 accent-[#4ADE80] cursor-pointer"
              />
              <span>{Math.round(trainProgress * 100)}% Crossed</span>
            </div>
          </div>

          {/* Interactive Parameter Controls + Step-by-Step Formula Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Train A Length (L₁)</span>
                  <span className="font-mono text-[#0A4D44]">{train1Len} m</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="400"
                  step="10"
                  value={train1Len}
                  onChange={e => setTrain1Len(Number(e.target.value))}
                  className="w-full accent-[#0A4D44]"
                />
                <div className="flex justify-between text-xs font-semibold pt-1">
                  <span>Train A Speed (v₁)</span>
                  <span className="font-mono text-[#0A4D44]">
                    {train1SpeedKmh} km/h ({trainMath.v1Ms} m/s)
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="144"
                  step="9"
                  value={train1SpeedKmh}
                  onChange={e => setTrain1SpeedKmh(Number(e.target.value))}
                  className="w-full accent-[#0A4D44]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{trainMode === 'platform' ? 'Platform Length (L₂)' : 'Train B Length (L₂)'}</span>
                  <span className="font-mono text-[#0E6B5E]">{train2Len} m</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="400"
                  step="10"
                  value={train2Len}
                  onChange={e => setTrain2Len(Number(e.target.value))}
                  className="w-full accent-[#0E6B5E]"
                />
                {trainMode !== 'platform' && (
                  <>
                    <div className="flex justify-between text-xs font-semibold pt-1">
                      <span>Train B Speed (v₂)</span>
                      <span className="font-mono text-[#0E6B5E]">
                        {train2SpeedKmh} km/h ({trainMath.v2Ms} m/s)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="108"
                      step="9"
                      value={train2SpeedKmh}
                      onChange={e => setTrain2SpeedKmh(Number(e.target.value))}
                      className="w-full accent-[#0E6B5E]"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Step-by-Step Formula & Quick Quiz */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-[#EFF5F3] border border-[#C5D6D1] flex flex-col justify-between space-y-3 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0A4D44] font-bold">
                  Live Step-by-Step Mathematical Proof
                </span>
                <p className="font-mono text-[#1C2A27]">
                  1. Total Distance D = L₁ + L₂ = {train1Len} + {train2Len} ={' '}
                  <strong>{trainMath.totalDistMeters} m</strong>
                </p>
                <p className="font-mono text-[#1C2A27]">
                  2. Relative Speed ={' '}
                  {trainMode === 'opposite'
                    ? `${train1SpeedKmh} + ${trainMath.effectiveV2Kmh}`
                    : trainMode === 'same'
                    ? `|${train1SpeedKmh} - ${trainMath.effectiveV2Kmh}|`
                    : `${train1SpeedKmh}`}{' '}
                  = {trainMath.relSpeedKmh} km/h × (5/18) = <strong>{trainMath.relSpeedMs} m/s</strong>
                </p>
                <p className="font-mono text-[#0A4D44] font-bold">
                  3. Crossing Time T = {trainMath.totalDistMeters} / {trainMath.relSpeedMs} ={' '}
                  {trainMath.crossingTimeSec} seconds
                </p>
              </div>

              <div className="pt-2 border-t border-[#C5D6D1] flex items-center justify-between gap-2">
                <input
                  type="number"
                  step="any"
                  value={trainQuizInput}
                  onChange={e => setTrainQuizInput(e.target.value)}
                  placeholder={`Enter ${trainMath.crossingTimeSec}s to claim XP`}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#9CC5BE] font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (Math.abs(parseFloat(trainQuizInput) - trainMath.crossingTimeSec) < 0.2) {
                      handleAwardBonusXP(
                        currentStudent.id,
                        75,
                        `Solved Train Crossing Simulation (${trainMath.crossingTimeSec}s)`
                      );
                      setTrainQuizInput('');
                    } else {
                      playUISound('error');
                      showToast(
                        'Check Crossing Time',
                        `Divide Total Distance (${trainMath.totalDistMeters}m) by Relative Speed (${trainMath.relSpeedMs}m/s) = ${trainMath.crossingTimeSec}s.`,
                        'warning'
                      );
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0A4D44] text-[#F5F0E6] font-semibold"
                >
                  Verify (+75 XP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 2: WORK & TIME (2 PEOPLE WORK TOGETHER & ONE LEAVES)
         ===================================================================== */}
      {activeTopic === 'work-together' && (
        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2D3] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                Time & Work • Collaborative Efficiency & Departure Simulator
              </span>
              <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                If 2 People Work Together and One Leaves After X Days — Animated LCM Unit Tower
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'A (12d) & B (15d), A Leaves Day 4', a: 12, b: 15, who: 'A' as const, d: 4 },
                { label: 'A (10d) & B (20d), B Leaves Day 5', a: 10, b: 20, who: 'B' as const, d: 5 },
                { label: 'Both Work Till Completion', a: 12, b: 15, who: 'none' as const, d: 4 }
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    setWorkerADays(p.a);
                    setWorkerBDays(p.b);
                    setWhoLeaves(p.who);
                    setLeaveAfterDays(p.d);
                    setWorkAnimDay(1);
                    setWorkPlaying(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#EAE2D3] hover:bg-[#0A4D44] text-[#1C2A27] hover:text-[#F5F0E6] text-xs font-semibold transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Cols: Parameter Sliders & LCM Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Person A Alone Capacity</span>
                    <span className="font-mono text-[#0A4D44]">
                      {workerADays} Days ({workMath.rateA} units/day)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="30"
                    step="2"
                    value={workerADays}
                    onChange={e => setWorkerADays(Number(e.target.value))}
                    className="w-full accent-[#0A4D44]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Person B Alone Capacity</span>
                    <span className="font-mono text-[#9A6B26]">
                      {workerBDays} Days ({workMath.rateB} units/day)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="30"
                    step="3"
                    value={workerBDays}
                    onChange={e => setWorkerBDays(Number(e.target.value))}
                    className="w-full accent-[#9A6B26]"
                  />
                </div>

                <div className="space-y-1.5 pt-1 border-t border-[#E2D9C8]">
                  <span className="font-semibold block">Who Leaves the Project Early?</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'A', label: 'Person A Leaves' },
                        { id: 'B', label: 'Person B Leaves' },
                        { id: 'none', label: 'Nobody Leaves' }
                      ] as const
                    ).map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          playUISound('click');
                          setWhoLeaves(opt.id);
                        }}
                        className={`py-1.5 rounded-lg font-semibold transition ${
                          whoLeaves === opt.id
                            ? 'bg-[#0A4D44] text-[#F5F0E6]'
                            : 'bg-[#FFFDF9] border border-[#D5CBB8] text-[#1C2A27]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {whoLeaves !== 'none' && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between font-semibold">
                      <span>Person {whoLeaves} Leaves After Working Together For:</span>
                      <span className="font-mono text-[#9E2A2B]">{leaveAfterDays} Days</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={leaveAfterDays}
                      onChange={e => setLeaveAfterDays(Number(e.target.value))}
                      className="w-full accent-[#9E2A2B]"
                    />
                  </div>
                )}
              </div>

              {/* LCM & Fraction Formula Summary Card */}
              <div className="p-4 rounded-xl bg-[#0A3630] text-[#F5F0E6] border border-[#14463F] space-y-2 text-xs font-mono">
                <div className="text-[10px] uppercase tracking-widest text-[#9CC5BE]">
                  LCM Total Work Method (LCM of {workerADays} & {workerBDays} = {workMath.lcmUnits} Units)
                </div>
                <p>
                  • A’s Efficiency = {workMath.rateA} u/day | B’s Efficiency = {workMath.rateB} u/day
                </p>
                <p>
                  • Together in {workMath.actualTogetherDays} days = {workMath.workDoneTogetherUnits} /{' '}
                  {workMath.lcmUnits} units ({workMath.workDoneTogetherPct}%)
                </p>
                {whoLeaves !== 'none' && (
                  <p className="text-[#FACC15]">
                    • Balance {workMath.remainingUnits} units finished by Worker {workMath.soloWorker} alone in{' '}
                    <strong>{workMath.remainingSoloDays} days</strong>
                  </p>
                )}
                <p className="text-[#4ADE80] text-sm font-bold pt-1 border-t border-[#19574E]">
                  Total Time to Complete = {workMath.totalProjectDays} Days
                </p>
              </div>
            </div>

            {/* Right 7 Cols: Animated Day-by-Day Progress Bar & Work Timeline */}
            <div className="lg:col-span-7 bg-[#072E29] text-[#F5F0E6] rounded-xl p-5 border border-[#14463F] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#19574E] pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#9CC5BE] block">
                    Animated Day-by-Day Work Completion Tower
                  </span>
                  <h4 className="text-sm font-semibold">
                    Showing Day 1 to Day {Math.min(workAnimDay, workMath.dailySlices.length)} of{' '}
                    {workMath.dailySlices.length}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playUISound('click');
                      setWorkAnimDay(1);
                      setWorkPlaying(true);
                      handleAwardBonusXP(currentStudent.id, 60, 'Simulated Collaborative Work & Departure Problem');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#4ADE80] text-[#072E29] text-xs font-semibold"
                  >
                    ▶ Animate Day-by-Day (+60 XP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkAnimDay(workMath.dailySlices.length)}
                    className="px-3 py-1.5 rounded-lg bg-[#124E45] text-[#F5F0E6] text-xs font-semibold"
                  >
                    Show All
                  </button>
                </div>
              </div>

              {/* Day-by-Day Horizontal Stacked Bars */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {workMath.dailySlices.slice(0, workAnimDay).map(slice => (
                  <div
                    key={slice.day}
                    className="p-2.5 rounded-lg bg-[#0A3630] border border-[#19574E] space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-white">
                        Day {slice.day}: {slice.note}
                      </span>
                      <span className="font-mono text-[#4ADE80]">Cumulative: {slice.cumPct}%</span>
                    </div>
                    <div className="w-full h-4 bg-[#06231F] rounded-full overflow-hidden flex">
                      {slice.aUnits > 0 && (
                        <div
                          className="h-full bg-[#10B981] flex items-center justify-center text-[9px] font-mono font-bold text-[#06231F]"
                          style={{ width: `${(slice.aUnits / workMath.combinedRate) * 100}%` }}
                        >
                          A: +{slice.aUnits}u
                        </div>
                      )}
                      {slice.bUnits > 0 && (
                        <div
                          className="h-full bg-[#F59E0B] flex items-center justify-center text-[9px] font-mono font-bold text-[#06231F]"
                          style={{ width: `${(slice.bUnits / workMath.combinedRate) * 100}%` }}
                        >
                          B: +{slice.bUnits}u
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 3: BLOOD RELATION ANIMATED FAMILY TREE
         ===================================================================== */}
      {activeTopic === 'blood-relation' && (
        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2D3] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                Logical Reasoning • Blood Relation Tree Animator
              </span>
              <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                {currentBloodScen.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  setBloodStep(1);
                  setBloodPlaying(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#0A4D44] text-[#F5F0E6] text-xs font-semibold"
              >
                ▶ Animate Tree Clues
              </button>
              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  setBloodScenIdx(prev => (prev + 1) % BLOOD_RELATION_SCENARIOS.length);
                  setBloodStep(4);
                  setBloodSelectedAns(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#1C2A27] text-xs font-semibold"
              >
                Next Scenario →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Animated SVG Family Tree Node Graph */}
            <div className="lg:col-span-7 bg-[#072E29] text-[#F5F0E6] rounded-xl p-4 border border-[#14463F] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#9CC5BE]">
                <span>Notation: □ Male | ○ Female | ═ Married | ─ Sibling | ↓ Parent</span>
                <span className="font-mono text-[#4ADE80]">Step {bloodStep} of 4</span>
              </div>

              <svg
                viewBox="0 0 560 255"
                className="w-full h-60 bg-[#0A3630] rounded-xl border border-[#19574E]"
              >
                {/* Generation Guide Lines */}
                <line x1="15" y1="45" x2="545" y2="45" stroke="#14463F" strokeDasharray="4 4" />
                <text x="18" y="36" fill="#8AB0A9" fontSize="9" fontFamily="monospace">
                  GEN -2 (Grandparents)
                </text>
                <line x1="15" y1="115" x2="545" y2="115" stroke="#14463F" strokeDasharray="4 4" />
                <text x="18" y="106" fill="#8AB0A9" fontSize="9" fontFamily="monospace">
                  GEN -1 (Parents / Maternal & Paternal Uncles)
                </text>
                <line x1="15" y1="200" x2="545" y2="200" stroke="#14463F" strokeDasharray="4 4" />
                <text x="18" y="191" fill="#8AB0A9" fontSize="9" fontFamily="monospace">
                  GEN 0 (Self / Siblings / Cousins)
                </text>

                {/* Edges */}
                {currentBloodScen.edges
                  .filter(e => e.revealedAtStep <= bloodStep)
                  .map((edge, idx) => {
                    const n1 = currentBloodScen.nodes.find(n => n.id === edge.from);
                    const n2 = currentBloodScen.nodes.find(n => n.id === edge.to);
                    if (!n1 || !n2) return null;
                    const midX = (n1.x + n2.x) / 2;
                    const midY = (n1.y + n2.y) / 2;
                    return (
                      <g key={idx}>
                        <line
                          x1={n1.x}
                          y1={n1.y}
                          x2={n2.x}
                          y2={n2.y}
                          stroke={edge.revealedAtStep === bloodStep ? '#4ADE80' : '#9CC5BE'}
                          strokeWidth={edge.type === 'spouse' ? '3.5' : '2'}
                          strokeDasharray={edge.type === 'sibling' ? '5 3' : undefined}
                        />
                        <rect
                          x={midX - 42}
                          y={midY - 9}
                          width="84"
                          height="16"
                          rx="4"
                          fill="#06231F"
                          stroke="#2B7A6E"
                        />
                        <text
                          x={midX}
                          y={midY + 2}
                          textAnchor="middle"
                          fill="#FACC15"
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          {edge.label}
                        </text>
                      </g>
                    );
                  })}

                {/* Nodes */}
                {currentBloodScen.nodes
                  .filter(n => n.revealedAtStep <= bloodStep)
                  .map(node => (
                    <g key={node.id}>
                      {node.gender === 'M' ? (
                        <rect
                          x={node.x - 52}
                          y={node.y - 20}
                          width="104"
                          height="40"
                          rx="6"
                          fill="#0E6B5E"
                          stroke="#4ADE80"
                          strokeWidth="2"
                        />
                      ) : (
                        <rect
                          x={node.x - 52}
                          y={node.y - 20}
                          width="104"
                          height="40"
                          rx="20"
                          fill="#9A6B26"
                          stroke="#FDE047"
                          strokeWidth="2"
                        />
                      )}
                      <text
                        x={node.x}
                        y={node.y - 3}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {node.gender === 'M' ? '□ ' : '○ '}
                        {node.name}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 11}
                        textAnchor="middle"
                        fill="#E5DEC9"
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        {node.roleLabel}
                      </text>
                    </g>
                  ))}
              </svg>

              {/* Step Selector Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      playUISound('click');
                      setBloodPlaying(false);
                      setBloodStep(st);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                      bloodStep === st
                        ? 'bg-[#4ADE80] text-[#072E29]'
                        : 'bg-[#0A3630] text-[#B5CFCB] border border-[#19574E]'
                    }`}
                  >
                    Clue Step {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Puzzle Statement, Step Traces & Answer Verification */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0E6B5E] font-bold">
                  Scenario Statement
                </span>
                <p className="text-xs sm:text-sm font-medium text-[#1C2A27] leading-relaxed">
                  {currentBloodScen.statement}
                </p>
              </div>

              <div className="space-y-1.5">
                {currentBloodScen.steps.slice(0, bloodStep).map((stText, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#EFF5F3] border border-[#C5D6D1] text-xs text-[#1C2A27]"
                  >
                    {stText}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#DDD4C2] space-y-2.5">
                <p className="text-xs font-semibold text-[#1C2A27]">{currentBloodScen.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {currentBloodScen.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setBloodSelectedAns(opt);
                        if (opt === currentBloodScen.correctAnswer) {
                          handleAwardBonusXP(
                            currentStudent.id,
                            currentBloodScen.xp,
                            `Solved Blood Relation Tree: ${currentBloodScen.title}`
                          );
                        } else {
                          playUISound('error');
                        }
                      }}
                      className={`p-2.5 rounded-lg border text-xs font-semibold transition ${
                        bloodSelectedAns === opt
                          ? opt === currentBloodScen.correctAnswer
                            ? 'bg-[#0A4D44] text-[#F5F0E6] border-[#0A4D44]'
                            : 'bg-[#FAF2F2] text-[#9E2A2B] border-[#E2B4B4]'
                          : 'bg-[#F7F3EB] hover:bg-[#EAE2D3] text-[#1C2A27] border-[#DDD4C2]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 4: 3D DICE PROBABILITY & CUBE FACE SIMULATOR
         ===================================================================== */}
      {activeTopic === 'dice-sim' && (
        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2D3] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                Probability & Spatial Cube Reasoning • 36-Outcome Matrix & Standard Die
              </span>
              <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                Interactive 2-Dice Roll Simulator & Standard Cube Opposite-Face Inspector
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRollDice(1)}
                className="px-3.5 py-2 rounded-lg bg-[#0A4D44] text-[#F5F0E6] text-xs font-semibold"
              >
                🎲 Roll 2 Dice Now
              </button>
              <button
                type="button"
                onClick={() => handleRollDice(25)}
                className="px-3.5 py-2 rounded-lg bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#1C2A27] text-xs font-semibold"
              >
                Simulate 25 Rolls (+30 XP)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Cols: Visual 3D Dice Pair, Condition Filter & Standard Opposite Face */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#072E29] text-[#F5F0E6] rounded-xl p-5 border border-[#14463F] space-y-4">
                <div className="flex items-center justify-between text-xs text-[#9CC5BE]">
                  <span>Current 2-Dice Roll Outcome</span>
                  <span className="font-mono text-[#4ADE80]">
                    Sum = {die1Val + die2Val} | Product = {die1Val * die2Val}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-6 py-3">
                  {[die1Val, die2Val].map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-20 h-20 rounded-2xl bg-[#FFFDF9] text-[#072E29] border-4 border-[#9CC5BE] shadow-lg flex flex-col items-center justify-center transition-transform duration-300 ${
                        isRollingDice ? 'rotate-45 scale-90' : 'rotate-0 scale-100'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-[#686052]">DIE #{idx + 1}</span>
                      <strong className="text-3xl font-mono font-bold text-[#0A4D44]">{val}</strong>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-[#0A3630] border border-[#19574E] text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#9CC5BE]">Theoretical Probability P(E):</span>
                    <strong className="text-[#4ADE80]">
                      {favorableOutcomesCount} / 36 ({((favorableOutcomesCount / 36) * 100).toFixed(1)}%)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CC5BE]">Experimental Roll Hits:</span>
                    <strong className="text-[#FACC15]">
                      {rollHitsCount} / {rollHistoryCount} Rolls
                    </strong>
                  </div>
                </div>
              </div>

              {/* Opposite Face on a Standard Die (Sum of Opposite Faces = 7) */}
              <div className="p-4 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-3 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0E6B5E] font-bold block">
                  Standard Cube Opposite-Face Rule (Opposite Sum = 7)
                </span>
                <p className="text-[#4A443B]">
                  In any Standard Die, opposite faces always add up to <strong>7</strong> (1↔6, 2↔5, 3↔4). Tap a top face below:
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map(face => (
                    <button
                      key={face}
                      type="button"
                      onClick={() => {
                        playUISound('click');
                        setOppositeFaceQuery(face);
                      }}
                      className={`py-2 rounded-lg font-mono font-bold transition ${
                        oppositeFaceQuery === face
                          ? 'bg-[#0A4D44] text-[#F5F0E6]'
                          : 'bg-[#FFFDF9] border border-[#D5CBB8] text-[#1C2A27]'
                      }`}
                    >
                      {face}
                    </button>
                  ))}
                </div>
                <div className="p-2.5 rounded-lg bg-[#EFF5F3] border border-[#C5D6D1] font-mono text-[#0A4D44] font-semibold">
                  Top Face = {oppositeFaceQuery} → Bottom (Opposite) Face = {7 - oppositeFaceQuery} (since {oppositeFaceQuery} + {7 - oppositeFaceQuery} = 7)
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Interactive 6x6 = 36 Sample Space Grid */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#1C2A27]">
                  Select Event Condition to Highlight Favorable Outcomes in 6×6 Sample Space:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'sum-7' as const, label: 'Sum = 7 (6/36)' },
                    { id: 'sum-ge-9' as const, label: 'Sum ≥ 9 (10/36)' },
                    { id: 'doublets' as const, label: 'Doublets (6/36)' },
                    { id: 'prime-sum' as const, label: 'Prime Sum (15/36)' },
                    { id: 'at-least-one-6' as const, label: 'At Least One 6 (11/36)' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        playUISound('click');
                        setDiceCondition(c.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                        diceCondition === c.id
                          ? 'bg-[#0A4D44] text-[#F5F0E6]'
                          : 'bg-[#EAE2D3] text-[#1C2A27]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-6 gap-1.5 p-3 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8]">
                {[1, 2, 3, 4, 5, 6].map(r =>
                  [1, 2, 3, 4, 5, 6].map(c => {
                    const isFavorable = checkDicePairMatches(r, c, diceCondition);
                    const isCurrentRoll = r === die1Val && c === die2Val;
                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        onClick={() => {
                          playUISound('click');
                          setDie1Val(r);
                          setDie2Val(c);
                        }}
                        className={`p-2 rounded-lg font-mono text-xs flex flex-col items-center justify-center border transition ${
                          isCurrentRoll
                            ? 'bg-[#D4A359] text-[#072E29] border-[#072E29] font-bold ring-2 ring-[#0A4D44]'
                            : isFavorable
                            ? 'bg-[#0A4D44] text-[#F5F0E6] border-[#073831] font-semibold'
                            : 'bg-[#FFFDF9] text-[#686052] border-[#DDD4C2]'
                        }`}
                      >
                        <span>({r},{c})</span>
                        <span className="text-[9px] opacity-80">Σ={r + c}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODULE 5: SIMPLE INTEREST (SI) VS COMPOUND INTEREST (CI) SIMULATOR
         ===================================================================== */}
      {activeTopic === 'interest-sim' && (
        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2D3] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                Financial Mathematics • Simple vs. Compound Interest Scenario Simulator
              </span>
              <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                Animated Year-by-Year Linear SI vs. Exponential CI & (CI − SI) Difference
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                playUISound('success');
                setAnimYearLimit(1);
                setInterestPlaying(true);
                handleAwardBonusXP(currentStudent.id, 65, 'Simulated SI vs CI Compounding Growth');
              }}
              className="px-4 py-2 rounded-lg bg-[#0A4D44] text-[#F5F0E6] text-xs font-semibold"
            >
              ▶ Animate Year-by-Year Compounding (+65 XP)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Cols: Sliders & Shortcut Formulas */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Principal Sum (P)</span>
                    <span className="font-mono text-[#0A4D44]">₹{principal.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={principal}
                    onChange={e => setPrincipal(Number(e.target.value))}
                    className="w-full accent-[#0A4D44]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Annual Rate of Interest (R%)</span>
                    <span className="font-mono text-[#0E6B5E]">{ratePct}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="25"
                    step="1"
                    value={ratePct}
                    onChange={e => setRatePct(Number(e.target.value))}
                    className="w-full accent-[#0E6B5E]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Time Period (T Years)</span>
                    <span className="font-mono text-[#9A6B26]">{timeYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={timeYears}
                    onChange={e => setTimeYears(Number(e.target.value))}
                    className="w-full accent-[#9A6B26]"
                  />
                </div>

                <div className="space-y-1.5 pt-1 border-t border-[#E2D9C8]">
                  <span className="font-semibold block">Compounding Frequency (n):</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { freq: 1 as const, label: 'Annual (n=1)' },
                      { freq: 2 as const, label: 'Half-Yearly (n=2)' },
                      { freq: 4 as const, label: 'Quarterly (n=4)' }
                    ].map(f => (
                      <button
                        key={f.freq}
                        type="button"
                        onClick={() => {
                          playUISound('click');
                          setCompFreq(f.freq);
                        }}
                        className={`py-1.5 rounded-lg font-semibold transition ${
                          compFreq === f.freq
                            ? 'bg-[#0A4D44] text-[#F5F0E6]'
                            : 'bg-[#FFFDF9] border border-[#D5CBB8] text-[#1C2A27]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exam Shortcut Formulas for (CI - SI) Difference */}
              <div className="p-4 rounded-xl bg-[#0A3630] text-[#F5F0E6] border border-[#14463F] space-y-2 text-xs font-mono">
                <div className="text-[10px] uppercase tracking-widest text-[#9CC5BE]">
                  Direct Exam Formulas (Annual Compounding)
                </div>
                <p>
                  • Total SI ({timeYears} yrs) = ₹{interestMath.finalRow.siInterestTotal.toLocaleString()}
                </p>
                <p>
                  • Total CI ({timeYears} yrs) = ₹{interestMath.finalRow.ciInterestTotal.toLocaleString()}
                </p>
                <p className="text-[#4ADE80] font-bold">
                  • Extra CI − SI Gain = ₹{interestMath.finalRow.diffCiSi.toLocaleString()}
                </p>
                <div className="pt-2 border-t border-[#19574E] text-[11px] text-[#E5DEC9] space-y-1">
                  <p>2-Yr (CI − SI) = P(R/100)² = ₹{interestMath.twoYrDiffShortcut.toLocaleString()}</p>
                  <p>
                    3-Yr (CI − SI) = P(R/100)²((300+R)/100) = ₹
                    {interestMath.threeYrDiffShortcut.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Animated Year-by-Year Comparison Table & Visual Bars */}
            <div className="lg:col-span-7 bg-[#072E29] text-[#F5F0E6] rounded-xl p-5 border border-[#14463F] space-y-4">
              <div className="flex items-center justify-between border-b border-[#19574E] pb-3 text-xs">
                <span className="font-semibold">
                  Year-by-Year Principal + SI vs. CI Compounding Schedule
                </span>
                <span className="font-mono text-[#4ADE80]">
                  Final Maturity: ₹{interestMath.finalRow.ciAmount.toLocaleString()}
                </span>
              </div>

              <div className="space-y-3">
                {interestMath.yearlyRows.slice(0, animYearLimit).map(row => {
                  const maxAmt = interestMath.finalRow.ciAmount;
                  const siWidth = Math.round((row.siAmount / maxAmt) * 100);
                  const ciWidth = Math.round((row.ciAmount / maxAmt) * 100);
                  return (
                    <div
                      key={row.year}
                      className="p-3 rounded-xl bg-[#0A3630] border border-[#19574E] space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                        <strong className="text-white">Year {row.year}</strong>
                        <span className="text-[#9CC5BE]">
                          SI Total: ₹{row.siAmount.toLocaleString()} (+₹{row.siInterestTotal.toLocaleString()})
                        </span>
                        <span className="text-[#4ADE80]">
                          CI Total: ₹{row.ciAmount.toLocaleString()} (+₹{row.ciInterestTotal.toLocaleString()})
                        </span>
                        <span className="text-[#FACC15]">
                          CI − SI Diff: +₹{row.diffCiSi.toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="w-full h-2.5 bg-[#06231F] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#38BDF8] transition-all duration-500"
                            style={{ width: `${siWidth}%` }}
                          />
                        </div>
                        <div className="w-full h-2.5 bg-[#06231F] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#4ADE80] transition-all duration-500"
                            style={{ width: `${ciWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
