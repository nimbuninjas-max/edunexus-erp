import React, { useState, useMemo } from 'react';
import { Student } from '../../types/erp';
import {
  NCERT_CLASS_FORMULAS,
  NcertClassLevel,
  FULL_118_PERIODIC_TABLE,
  PeriodicElement118
} from '../../data/ncertFormulasData';
import { CHEM_NUMERICAL_CHALLENGES } from '../../data/initialData';
import { StreamlineIcon } from '../common/StreamlineIcon';
import { NcertInteractiveDiagram } from './NcertInteractiveDiagrams';
import { VisualConceptFormulaLinker } from './VisualConceptFormulaLinker';
import { InteractivePeriodicTableLab } from './InteractivePeriodicTableLab';
import { ChemLab3DSimulator } from './ChemLab3DSimulator';

interface NcertStemResourceHubProps {
  currentStudent: Student;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
  initialSubTab?: 'formulas' | 'linker' | 'periodic' | 'sims' | 'calculator';
  isScrolledDown?: boolean;
}

const CATEGORY_COLORS: Record<
  PeriodicElement118['category'],
  { bg: string; border: string; text: string; hex: string }
> = {
  'Alkali Metal': { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-950', hex: '#FECDD3' },
  'Alkaline Earth': { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-950', hex: '#FED7AA' },
  'Transition Metal': { bg: 'bg-sky-100', border: 'border-sky-400', text: 'text-sky-950', hex: '#BAE6FD' },
  'Post-Transition': { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-950', hex: '#A7F3D0' },
  Metalloid: { bg: 'bg-teal-100', border: 'border-teal-500', text: 'text-teal-950', hex: '#99F6E4' },
  Nonmetal: { bg: 'bg-lime-100', border: 'border-lime-500', text: 'text-lime-950', hex: '#D9F99D' },
  Halogen: { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-950', hex: '#FDE68A' },
  'Noble Gas': { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-950', hex: '#E9D5FF' },
  Lanthanide: { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-950', hex: '#FBCFE8' },
  Actinide: { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-950', hex: '#C7D2FE' }
};

export const NcertStemResourceHub: React.FC<NcertStemResourceHubProps> = ({
  currentStudent,
  handleAwardBonusXP,
  playUISound,
  showToast,
  initialSubTab = 'formulas',
  isScrolledDown = false
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'formulas' | 'linker' | 'periodic' | 'sims' | 'calculator'>(
    initialSubTab
  );
  const [quickCalcDrawerOpen, setQuickCalcDrawerOpen] = useState<boolean>(false);

  // --- TAB 1: ZERO-SCROLL SPLIT-SCREEN NCERT FORMULA & DIAGRAM STUDIO STATE ---
  const [selectedClass, setSelectedClass] = useState<NcertClassLevel>('Class 10');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('c10-ch2');
  const [activeFormulaIdx, setActiveFormulaIdx] = useState<number>(0);
  const [formulaSearch, setFormulaSearch] = useState<string>('');

  // Live Interactive Sandbox Parameters (synced directly with the Right-Pane Diagram & Solver)
  const [principalP, setPrincipalP] = useState<number>(10000);
  const [rateR, setRateR] = useState<number>(10);
  const [timeT, setTimeT] = useState<number>(2);
  const [compFreq, setCompFreq] = useState<number>(1);
  const [unitGivenQty, setUnitGivenQty] = useState<number>(12);
  const [unitGivenCost, setUnitGivenCost] = useState<number>(360);
  const [unitTargetQty, setUnitTargetQty] = useState<number>(7);

  const [quadA, setQuadA] = useState<number>(2);
  const [quadB, setQuadB] = useState<number>(-7);
  const [quadC, setQuadC] = useState<number>(3);
  const [apFirst, setApFirst] = useState<number>(2);
  const [apDiff, setApDiff] = useState<number>(5);
  const [apN, setApN] = useState<number>(10);
  const [chemNumericalInputs, setChemNumericalInputs] = useState<Record<string, string>>({});
  const [verifiedNumericalIds, setVerifiedNumericalIds] = useState<string[]>([]);

  const [calcCoeffA, setCalcCoeffA] = useState<number>(3);
  const [calcPowerN, setCalcPowerN] = useState<number>(4);
  const [calcEvalX, setCalcEvalX] = useState<number>(2);
  const [mat2x2, setMat2x2] = useState<[number, number, number, number]>([4, 7, 2, 6]);

  // --- TAB 3: PERIODIC TABLE STATE ---
  const [selectedElement, setSelectedElement] = useState<PeriodicElement118>(FULL_118_PERIODIC_TABLE[10]); // Sodium (Na) default
  const [ptCategoryFilter, setPtCategoryFilter] = useState<string>('ALL');
  const [ptBlockFilter, setPtBlockFilter] = useState<'ALL' | 's' | 'p' | 'd' | 'f'>('ALL');
  const [ptSearch, setPtSearch] = useState<string>('');

  // --- TAB 4 & QUICK DRAWER: SCIENTIFIC CALCULATOR STATE ---
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [calcExpression, setCalcExpression] = useState<string>('');
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');
  const [calcMemory, setCalcMemory] = useState<number>(0);
  const [calcLastAns, setCalcLastAns] = useState<number>(0);
  const [calcHistory, setCalcHistory] = useState<{ expr: string; res: string }[]>([
    { expr: 'sin(30°) + cos(60°)', res: '1' },
    { expr: '√(144) × 5²', res: '300' }
  ]);

  // Chapters for the selected Class
  const chaptersForClass = useMemo(() => {
    return NCERT_CLASS_FORMULAS.filter(ch => ch.classLevel === selectedClass);
  }, [selectedClass]);

  // Active chapter object (always resolves to a valid chapter so the split view is never empty)
  const activeChapter = useMemo(() => {
    return (
      chaptersForClass.find(ch => ch.id === selectedChapterId) ||
      chaptersForClass[0] ||
      NCERT_CLASS_FORMULAS[0]
    );
  }, [chaptersForClass, selectedChapterId]);

  // Search across all 24 chapters if user types in the search box
  const searchResults = useMemo(() => {
    if (!formulaSearch.trim()) return null;
    const q = formulaSearch.toLowerCase();
    const matches: {
      chapterId: string;
      classLevel: NcertClassLevel;
      chapterNo: number;
      chapterTitle: string;
      formulaIdx: number;
      name: string;
      expression: string;
      explanation: string;
      solvedExample?: string;
    }[] = [];

    NCERT_CLASS_FORMULAS.forEach(ch => {
      ch.formulas.forEach((f, idx) => {
        if (
          f.name.toLowerCase().includes(q) ||
          f.expression.toLowerCase().includes(q) ||
          f.explanation.toLowerCase().includes(q) ||
          ch.chapterTitle.toLowerCase().includes(q) ||
          ch.topicTags.some(t => t.toLowerCase().includes(q))
        ) {
          matches.push({
            chapterId: ch.id,
            classLevel: ch.classLevel,
            chapterNo: ch.chapterNo,
            chapterTitle: ch.chapterTitle,
            formulaIdx: idx,
            name: f.name,
            expression: f.expression,
            explanation: f.explanation,
            solvedExample: f.solvedExample
          });
        }
      });
    });
    return matches;
  }, [formulaSearch]);

  // Live Computations for SI / CI / Unitary Solver
  const siCiResults = useMemo(() => {
    const si = (principalP * rateR * timeT) / 100;
    const siAmount = principalP + si;
    const ciAmount = principalP * Math.pow(1 + rateR / (100 * compFreq), compFreq * timeT);
    const ci = ciAmount - principalP;
    const diff = ci - si;
    const oneUnitVal = unitGivenQty !== 0 ? unitGivenCost / unitGivenQty : 0;
    const targetVal = oneUnitVal * unitTargetQty;
    return { si, siAmount, ci, ciAmount, diff, oneUnitVal, targetVal };
  }, [principalP, rateR, timeT, compFreq, unitGivenQty, unitGivenCost, unitTargetQty]);

  // Live Computations for Class 10 Quadratic & AP Solver
  const class10Results = useMemo(() => {
    const D = quadB * quadB - 4 * quadA * quadC;
    let rootsText = '';
    if (quadA === 0) {
      rootsText = 'Not quadratic (a = 0)';
    } else if (D > 0) {
      const r1 = ((-quadB + Math.sqrt(D)) / (2 * quadA)).toFixed(3);
      const r2 = ((-quadB - Math.sqrt(D)) / (2 * quadA)).toFixed(3);
      rootsText = `α = ${r1}, β = ${r2}`;
    } else if (D === 0) {
      const r = (-quadB / (2 * quadA)).toFixed(3);
      rootsText = `α = β = ${r}`;
    } else {
      const realPart = (-quadB / (2 * quadA)).toFixed(2);
      const imagPart = (Math.sqrt(-D) / (2 * quadA)).toFixed(2);
      rootsText = `${realPart} ± ${imagPart}i`;
    }
    const apNth = apFirst + (apN - 1) * apDiff;
    const apSum = (apN / 2) * (2 * apFirst + (apN - 1) * apDiff);
    return { D, rootsText, apNth, apSum };
  }, [quadA, quadB, quadC, apFirst, apDiff, apN]);

  // Live Computations for Class 12 Calculus & 2x2 Matrix Solver
  const class12Results = useMemo(() => {
    const derivCoeff = calcCoeffA * calcPowerN;
    const derivPow = calcPowerN - 1;
    const derivValueAtX = derivCoeff * Math.pow(calcEvalX, derivPow);
    const intPow = calcPowerN + 1;
    const defIntFrom0ToX = intPow !== 0 ? (calcCoeffA / intPow) * Math.pow(calcEvalX, intPow) : 0;
    const [a, b, c, d] = mat2x2;
    const det = a * d - b * c;
    const trace = a + d;
    return { derivCoeff, derivPow, derivValueAtX, intPow, defIntFrom0ToX, det, trace };
  }, [calcCoeffA, calcPowerN, calcEvalX, mat2x2]);

  // ==========================================================================
  // DOWNLOADABLE PERIODIC TABLE & FORMULA SHEET GENERATORS
  // ==========================================================================
  const handleDownloadPeriodicTableSVG = () => {
    playUISound('success');
    const svgWidth = 1480;
    const svgHeight = 860;
    const cellW = 74;
    const cellH = 74;
    const startX = 60;
    const startY = 95;

    let cellsSvg = '';
    FULL_118_PERIODIC_TABLE.forEach(el => {
      let col = el.group - 1;
      let row = el.period - 1;
      if (el.period === 8) {
        col = el.z - 57 + 2;
        row = 7.4;
      } else if (el.period === 9) {
        col = el.z - 89 + 2;
        row = 8.55;
      }
      const x = startX + col * (cellW + 4);
      const y = startY + row * (cellH + 4);
      const fillHex = CATEGORY_COLORS[el.category]?.hex || '#E2E8F0';

      cellsSvg += `
        <g transform="translate(${x}, ${y})">
          <rect width="${cellW}" height="${cellH}" rx="6" fill="${fillHex}" stroke="#0A4D44" stroke-width="1.2" />
          <text x="6" y="15" font-family="monospace" font-size="11" font-weight="bold" fill="#072E29">${el.z}</text>
          <text x="${cellW - 6}" y="14" font-family="monospace" font-size="9" text-anchor="end" fill="#334155">${el.block}-block</text>
          <text x="${cellW / 2}" y="40" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#072E29">${el.symbol}</text>
          <text x="${cellW / 2}" y="55" font-family="sans-serif" font-size="9.5" text-anchor="middle" fill="#1E293B">${el.name}</text>
          <text x="${cellW / 2}" y="68" font-family="monospace" font-size="8.5" text-anchor="middle" fill="#475569">${el.mass}</text>
        </g>
      `;
    });

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <rect width="100%" height="100%" fill="#FAF6EE" />
  <text x="${svgWidth / 2}" y="42" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle" fill="#072E29">
    MODERN PERIODIC TABLE OF THE ELEMENTS (IUPAC 1–118) — NCERT CHEMISTRY REFERENCE
  </text>
  <text x="${svgWidth / 2}" y="68" font-family="monospace" font-size="13" text-anchor="middle" fill="#0E6B5E">
    Atomic Number (Z) · Chemical Symbol · Element Name · Standard Atomic Weight (u) · Orbital Block (s, p, d, f)
  </text>
  ${cellsSvg}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NCERT_Modern_Periodic_Table_118_Elements.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    handleAwardBonusXP(currentStudent.id, 30, 'Downloaded High-Resolution 118-Element Periodic Table Poster');
    showToast(
      'Periodic Table Poster Downloaded!',
      'Saved NCERT_Modern_Periodic_Table_118_Elements.svg to your device.',
      'success'
    );
  };

  const handleDownloadPeriodicTableCSV = () => {
    playUISound('success');
    const headers =
      'Atomic Number (Z),Symbol,Name,Atomic Mass (u),Group,Period,Block,Category,Electron Configuration\n';
    const rows = FULL_118_PERIODIC_TABLE.map(
      e =>
        `${e.z},${e.symbol},${e.name},"${e.mass}",${e.group},${
          e.period <= 7 ? e.period : e.period - 2
        },${e.block},"${e.category}","${e.config}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NCERT_118_Periodic_Table_Elements.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      'Periodic Table CSV Downloaded!',
      'Saved all 118 elements with electron configurations to CSV.',
      'success'
    );
  };

  const handleDownloadClassFormulasTxt = () => {
    playUISound('success');
    const lines: string[] = [
      `====================================================================`,
      `NCERT COMPLETE CHAPTER-WISE FORMULA HANDBOOK (${selectedClass})`,
      `====================================================================\n`
    ];
    chaptersForClass.forEach(ch => {
      lines.push(`[${ch.classLevel} • Chapter ${ch.chapterNo}] ${ch.chapterTitle} (${ch.subject})`);
      lines.push(`--------------------------------------------------------------------`);
      ch.formulas.forEach((f, idx) => {
        lines.push(`${idx + 1}. ${f.name}`);
        lines.push(`   Formula : ${f.expression}`);
        lines.push(`   Meaning : ${f.explanation}`);
        if (f.solvedExample) {
          lines.push(`   Example : ${f.solvedExample}`);
        }
        lines.push('');
      });
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NCERT_${selectedClass.replace(/\s+/g, '_')}_Formulas.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      'Formula Sheet Downloaded!',
      `Downloaded chapter-wise NCERT formulas for ${selectedClass}.`,
      'success'
    );
  };

  // ==========================================================================
  // SCIENTIFIC CALCULATOR ENGINE
  // ==========================================================================
  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(170, Math.floor(n)); i++) res *= i;
    return res;
  };

  const handleSciButton = (token: string) => {
    playUISound('click');

    if (token === 'AC') {
      setCalcDisplay('0');
      setCalcExpression('');
      return;
    }
    if (token === 'DEL') {
      setCalcDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (token === '±') {
      setCalcDisplay(prev => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
      return;
    }
    if (token === 'π') {
      setCalcDisplay(Math.PI.toFixed(8));
      return;
    }
    if (token === 'e') {
      setCalcDisplay(Math.E.toFixed(8));
      return;
    }
    if (token === 'ANS') {
      setCalcDisplay(String(calcLastAns));
      return;
    }

    const currentVal = parseFloat(calcDisplay);
    const toRad = (v: number) => (angleMode === 'DEG' ? (v * Math.PI) / 180 : v);
    const fromRad = (v: number) => (angleMode === 'DEG' ? (v * 180) / Math.PI : v);

    if (
      [
        'sin',
        'cos',
        'tan',
        'asin',
        'acos',
        'atan',
        'ln',
        'log',
        '√',
        '∛',
        'x²',
        'x³',
        '1/x',
        'n!',
        'eˣ',
        '10ˣ'
      ].includes(token)
    ) {
      if (isNaN(currentVal)) return;
      let out = 0;
      let label = '';
      switch (token) {
        case 'sin':
          out = Math.sin(toRad(currentVal));
          label = `sin(${currentVal}${angleMode === 'DEG' ? '°' : ''})`;
          break;
        case 'cos':
          out = Math.cos(toRad(currentVal));
          label = `cos(${currentVal}${angleMode === 'DEG' ? '°' : ''})`;
          break;
        case 'tan':
          out = Math.tan(toRad(currentVal));
          label = `tan(${currentVal}${angleMode === 'DEG' ? '°' : ''})`;
          break;
        case 'asin':
          out = fromRad(Math.asin(currentVal));
          label = `sin⁻¹(${currentVal})`;
          break;
        case 'acos':
          out = fromRad(Math.acos(currentVal));
          label = `cos⁻¹(${currentVal})`;
          break;
        case 'atan':
          out = fromRad(Math.atan(currentVal));
          label = `tan⁻¹(${currentVal})`;
          break;
        case 'ln':
          out = Math.log(currentVal);
          label = `ln(${currentVal})`;
          break;
        case 'log':
          out = Math.log10(currentVal);
          label = `log₁₀(${currentVal})`;
          break;
        case '√':
          out = Math.sqrt(currentVal);
          label = `√(${currentVal})`;
          break;
        case '∛':
          out = Math.cbrt(currentVal);
          label = `∛(${currentVal})`;
          break;
        case 'x²':
          out = currentVal * currentVal;
          label = `(${currentVal})²`;
          break;
        case 'x³':
          out = currentVal * currentVal * currentVal;
          label = `(${currentVal})³`;
          break;
        case '1/x':
          out = 1 / currentVal;
          label = `1/(${currentVal})`;
          break;
        case 'n!':
          out = factorial(currentVal);
          label = `${currentVal}!`;
          break;
        case 'eˣ':
          out = Math.exp(currentVal);
          label = `e^(${currentVal})`;
          break;
        case '10ˣ':
          out = Math.pow(10, currentVal);
          label = `10^(${currentVal})`;
          break;
      }
      const formatted = Number(out.toPrecision(10)).toString();
      setCalcDisplay(formatted);
      setCalcLastAns(Number(formatted));
      setCalcHistory(prev => [{ expr: label, res: formatted }, ...prev.slice(0, 9)]);
      return;
    }

    if (['+', '-', '×', '÷', '^', '%'].includes(token)) {
      setCalcExpression(`${calcDisplay} ${token} `);
      setCalcDisplay('0');
      return;
    }

    if (token === '=') {
      if (!calcExpression) return;
      const parts = calcExpression.trim().split(' ');
      const left = parseFloat(parts[0]);
      const op = parts[1];
      const right = parseFloat(calcDisplay);
      if (isNaN(left) || isNaN(right)) return;

      let result = 0;
      if (op === '+') result = left + right;
      else if (op === '-') result = left - right;
      else if (op === '×') result = left * right;
      else if (op === '÷') result = right !== 0 ? left / right : NaN;
      else if (op === '^') result = Math.pow(left, right);
      else if (op === '%') result = (left * right) / 100;

      const formatted = Number(result.toPrecision(10)).toString();
      const fullExpr = `${left} ${op} ${right}`;
      setCalcDisplay(formatted);
      setCalcExpression('');
      setCalcLastAns(Number(formatted));
      setCalcHistory(prev => [{ expr: fullExpr, res: formatted }, ...prev.slice(0, 9)]);
      return;
    }

    if (token === '.') {
      if (!calcDisplay.includes('.')) {
        setCalcDisplay(prev => `${prev}.`);
      }
      return;
    }

    setCalcDisplay(prev => (prev === '0' ? token : `${prev}${token}`));
  };

  const handleSelectClassLevel = (cls: NcertClassLevel) => {
    playUISound('click');
    setSelectedClass(cls);
    const firstCh = NCERT_CLASS_FORMULAS.find(c => c.classLevel === cls);
    if (firstCh) {
      setSelectedChapterId(firstCh.id);
      setActiveFormulaIdx(0);
    }
    setFormulaSearch('');
  };

  const dynamicStemHeader = useMemo(() => {
    if (activeMainTab === 'formulas') {
      return {
        badge: `${selectedClass} • Chapter 0${activeChapter.chapterNo}`,
        title: `${selectedClass}: ${activeChapter.chapterTitle}`,
        subtitle: `${activeChapter.subject} — ${activeChapter.formulas.length} Verified NCERT Formulas & Interactive Diagram`
      };
    }
    if (activeMainTab === 'periodic') {
      return {
        badge: 'IUPAC 1–118 • Interactive Lab',
        title: 'Interactive Periodic Table & Virtual Test Tube Drop Lab',
        subtitle: 'Click any element for Atomic Mass & Valence Electrons, or drag into the Test Tube'
      };
    }
    if (activeMainTab === 'linker') {
      return {
        badge: 'Visual Patchbay • SVG Cables',
        title: 'Scientific Principle ↔ Formula Linker & Live Schematic Studio',
        subtitle: 'Select a category deck and wire scientific principles on the left to their matching equations on the right'
      };
    }
    if (activeMainTab === 'sims') {
      return {
        badge: 'WebGL 3D Lab • Stoichiometry',
        title: '3D Chemistry Reaction Bench & Analytical Numericals',
        subtitle: 'Interactive 3D glassware reactions, pH indicators, gas tests, and stoichiometry verification'
      };
    }
    return {
      badge: `Engineering Computer • ${angleMode} Mode`,
      title: `NCERT Scientific, Trigonometric & Calculus Computer (${angleMode})`,
      subtitle: 'Evaluate trigonometric, logarithmic, factorial, and physical constant expressions'
    };
  }, [activeMainTab, selectedClass, activeChapter, angleMode]);

  return (
    <div className="space-y-4 relative">
      {/* =====================================================================
          TWO-TIER STEM WORKSTATION HEADER:
          1. DESCRIPTIVE TITLE BANNER (Scrolls Away Naturally on Scroll Down)
          2. STICKY SELECTION & TAB BAR (Stays Pinned at Top with Zero Overlap)
         ===================================================================== */}
      {/* Tier 1: Descriptive Title Banner */}
      <div className="bg-[#072E29] text-[#F5F0E6] border border-[#155249] rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                {dynamicStemHeader.badge}
              </span>
              <span className="text-[11px] font-mono text-[#9CC5BE] hidden sm:inline">
                NCERT STEM Workstation
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">
              {dynamicStemHeader.title}
            </h1>
            <p className="text-[11px] text-[#A9CFC7] truncate">{dynamicStemHeader.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Tier 2: Pinned Sticky Mode Selector & Quick Calc Bar (Zero Negative Margin Overlap) */}
      <div className="sticky top-2 z-30 bg-[#072E29]/95 backdrop-blur-md text-[#F5F0E6] border border-[#155249] rounded-xl px-3 py-2 shadow-md">
        <div className="flex items-center justify-between gap-2">
          {/* Horizontal Scroll-Snap Tab Rail on Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5 flex-1 min-w-0">
            {[
              { id: 'formulas' as const, label: 'Formulas & Diagrams' },
              { id: 'periodic' as const, label: 'Periodic Table (118)' },
              { id: 'linker' as const, label: 'Concept ↔ Formula' },
              { id: 'sims' as const, label: '3D Chem Lab' },
              { id: 'calculator' as const, label: 'Sci Calculator' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playUISound('tab');
                  setActiveMainTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  activeMainTab === tab.id
                    ? 'bg-[#F5F0E6] text-[#072E29] shadow-2xs'
                    : 'text-[#CBE3DE] hover:bg-[#13544B] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Instant Fixed Viewport Scientific Calculator Toggle */}
          <button
            type="button"
            onClick={() => {
              playUISound('click');
              setQuickCalcDrawerOpen(prev => !prev);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition cursor-pointer shrink-0 ${
              quickCalcDrawerOpen
                ? 'bg-amber-400 text-[#072E29] border-amber-300'
                : 'bg-[#0F4A42] hover:bg-[#165E54] text-amber-300 border-[#236B60]'
            }`}
          >
            {quickCalcDrawerOpen ? 'Close Calc ×' : '🧮 Calc'}
          </button>
        </div>
      </div>

      {/* FIXED FLOATING SCIENTIFIC CALCULATOR POPOVER (OPENS RIGHT IN VIEWPORT — ZERO SCROLLING UP NEEDED!) */}
      {quickCalcDrawerOpen && (
        <div className="fixed top-16 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] max-w-[430px] bg-[#06211D] border-2 border-amber-400 rounded-2xl p-4 text-[#F5F0E6] shadow-2xl">
          <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#184D44]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                QUICK SCIENTIFIC CALC ({angleMode})
              </span>
              <button
                type="button"
                onClick={() => setAngleMode(prev => (prev === 'DEG' ? 'RAD' : 'DEG'))}
                className="px-2 py-0.5 rounded bg-[#124E45] text-[10px] font-mono text-white cursor-pointer"
              >
                {angleMode === 'DEG' ? 'Switch RAD' : 'Switch DEG'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setQuickCalcDrawerOpen(false)}
              className="px-2.5 py-1 rounded-lg bg-rose-900/70 hover:bg-rose-800 text-rose-100 text-xs font-bold cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="mb-3 p-2.5 rounded-xl bg-[#031411] border border-[#1B574D] flex items-center justify-between font-mono">
            <span className="text-xs text-[#8AB8AF] truncate mr-2">{calcExpression || 'Ready'}</span>
            <span className="text-lg font-bold text-emerald-300 tabular-nums">{calcDisplay}</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
            {[
              'sin',
              'cos',
              'tan',
              '√',
              'x²',
              'log',
              'ln',
              'π',
              'AC',
              'DEL',
              '7',
              '8',
              '9',
              '÷',
              '×',
              '4',
              '5',
              '6',
              '-',
              '+',
              '1',
              '2',
              '3',
              '^',
              '%',
              '0',
              '.',
              '±',
              'ANS',
              '='
            ].map(btn => (
              <button
                key={btn}
                type="button"
                onClick={() => handleSciButton(btn)}
                className={`py-2 rounded-lg font-bold transition cursor-pointer ${
                  btn === '='
                    ? 'bg-emerald-500 text-[#041E1A]'
                    : btn === 'AC' || btn === 'DEL'
                    ? 'bg-rose-800/80 text-rose-100'
                    : ['+', '-', '×', '÷', '^', '%'].includes(btn)
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-[#0D3831] hover:bg-[#155248] text-white'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 1: COMPACT DROPDOWN SELECTORS + CLEAN 2-COLUMN SPLIT FORMULA VIEW
         ===================================================================== */}
      {activeMainTab === 'formulas' && (
        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden shadow-xs">
          {/* SINGLE-ROW COMPACT DROPDOWN FILTER BAR (2-COL GRID ON MOBILE, ZERO BUTTON SPRAWL) */}
          <div className="p-3 bg-[#FAF6EE] border-b border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              {/* 1. Class Dropdown Selector */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="text-[11px] font-semibold text-[#5A5346] whitespace-nowrap hidden sm:inline">Class:</label>
                <select
                  value={selectedClass}
                  onChange={e => handleSelectClassLevel(e.target.value as NcertClassLevel)}
                  className="w-full sm:w-auto px-2.5 py-1.5 text-xs font-bold bg-white border border-[#C8BFA8] rounded-lg text-[#1C2A27] focus:outline-none focus:border-[#0A4D44] truncate"
                >
                  <option value="Class 7">Class 7 (SI · Unitary)</option>
                  <option value="Class 8">Class 8 (CI · Mensuration)</option>
                  <option value="Class 9">Class 9 (Surds · 3D Geom)</option>
                  <option value="Class 10">Class 10 (Quad · AP · Optics)</option>
                  <option value="Class 11">Class 11 (Trig · Limits)</option>
                  <option value="Class 12">Class 12 (Calculus · Matrix)</option>
                </select>
              </div>

              {/* 2. Chapter Dropdown Selector */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="text-[11px] font-semibold text-[#5A5346] whitespace-nowrap hidden sm:inline">Chapter:</label>
                <select
                  value={activeChapter.id}
                  onChange={e => {
                    playUISound('click');
                    setSelectedChapterId(e.target.value);
                    setActiveFormulaIdx(0);
                    setFormulaSearch('');
                  }}
                  className="w-full sm:w-auto px-2.5 py-1.5 text-xs font-bold bg-white border border-[#C8BFA8] rounded-lg text-[#1C2A27] sm:max-w-xs focus:outline-none focus:border-[#0A4D44] truncate"
                >
                  {chaptersForClass.map(ch => (
                    <option key={ch.id} value={ch.id}>
                      Ch 0{ch.chapterNo}: {ch.chapterTitle} ({ch.formulas.length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Search + Download Sheet */}
            <div className="flex flex-wrap items-center gap-2 flex-1 sm:flex-initial justify-end">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  value={formulaSearch}
                  onChange={e => setFormulaSearch(e.target.value)}
                  placeholder="Search formula across Class 7–12..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#C8BFA8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
                />
                {formulaSearch && (
                  <button
                    type="button"
                    onClick={() => setFormulaSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#686052] hover:text-[#1C2A27] font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleDownloadClassFormulasTxt}
                className="px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <StreamlineIcon name="print" className="w-3.5 h-3.5" />
                <span>Download {selectedClass} Sheet</span>
              </button>
            </div>
          </div>

          {/* CLEAN 2-COLUMN SPLIT VIEW (LEFT 6 COLS: FORMULAS | RIGHT 6 COLS: INTERACTIVE DIAGRAM & SOLVER) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5DEC9]">
            {/* LEFT PANE (6 COLS): CHAPTER FORMULAS & SOLVED EXAMPLES */}
            <div className="lg:col-span-6 p-4 bg-[#FFFDF9] lg:max-h-[600px] lg:overflow-y-auto space-y-3">
              {searchResults ? (
                <>
                  <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-2">
                    <span className="text-xs font-bold text-[#0A4D44]">
                      Found {searchResults.length} Matching Formulas (Class 7–12)
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormulaSearch('')}
                      className="text-xs text-[#0E6B5E] font-semibold hover:underline cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                  <div className="space-y-2">
                    {searchResults.map((item, idx) => (
                      <div
                        key={`${item.chapterId}-${idx}`}
                        onClick={() => {
                          playUISound('click');
                          setSelectedClass(item.classLevel);
                          setSelectedChapterId(item.chapterId);
                          setActiveFormulaIdx(item.formulaIdx);
                          setFormulaSearch('');
                        }}
                        className="p-3 rounded-lg bg-[#F7F3EB] hover:bg-[#EFE8D8] border border-[#DDD4C2] transition cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#0E6B5E] font-bold">
                          <span>
                            {item.classLevel} · Ch {item.chapterNo}: {item.chapterTitle}
                          </span>
                          <span>Inspect Diagram →</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#1C2A27]">{item.name}</h4>
                        <div className="p-2 rounded bg-[#072E29] text-[#FDE68A] font-mono text-xs font-bold overflow-x-auto">
                          {item.expression}
                        </div>
                        <p className="text-xs text-[#4A443B]">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#0E6B5E] font-bold block">
                        {activeChapter.classLevel} · Chapter 0{activeChapter.chapterNo} · {activeChapter.subject}
                      </span>
                      <h3 className="text-sm font-bold text-[#1C2A27]">
                        {activeChapter.chapterTitle}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#686052]">
                      {activeChapter.formulas.length} Formulas
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activeChapter.formulas.map((f, idx) => {
                      const isFocused = activeFormulaIdx === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            playUISound('click');
                            setActiveFormulaIdx(idx);
                          }}
                          className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                            isFocused
                              ? 'bg-[#0A4D44] text-white border-[#0A4D44]'
                              : 'bg-[#FFFDF9] hover:bg-[#F5F0E6] border-[#DDD4C2]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                  isFocused
                                    ? 'bg-emerald-900/80 text-white border border-emerald-400/40'
                                    : 'bg-[#EAE2D3] text-[#1C2A27]'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <h4 className={`text-xs font-bold ${isFocused ? 'text-white' : 'text-[#1C2A27]'}`}>{f.name}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                navigator.clipboard?.writeText(f.expression);
                                playUISound('click');
                                showToast('Formula Copied', f.expression, 'success');
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold shrink-0 cursor-pointer transition ${
                                isFocused
                                  ? 'bg-emerald-900/60 hover:bg-emerald-800 text-white'
                                  : 'bg-[#EAE2D3] hover:bg-[#0A4D44] text-[#1C2A27] hover:text-white'
                              }`}
                            >
                              Copy
                            </button>
                          </div>

                          <div className="p-2 rounded-lg bg-[#072E29] text-[#FDE68A] font-mono text-xs font-bold overflow-x-auto">
                            {f.expression}
                          </div>

                          <p className={`text-xs leading-relaxed ${isFocused ? 'text-emerald-100' : 'text-[#4A443B]'}`}>
                            {f.explanation}
                          </p>

                          {f.solvedExample && (
                            <div
                              className={`pt-1.5 border-t text-[11px] font-mono ${
                                isFocused ? 'border-emerald-700/60 text-emerald-200' : 'border-[#DDD4C2] text-[#0A4D44]'
                              }`}
                            >
                              <strong className={isFocused ? 'text-white' : 'text-[#072E29]'}>Solved Example:</strong>{' '}
                              {f.solvedExample}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* RIGHT PANE (6 COLS): INTERACTIVE SVG SCHEMATIC DIAGRAM + LIVE NUMERICAL SOLVER */}
            <div className="lg:col-span-6 p-4 bg-[#F7F3EB] lg:max-h-[600px] lg:overflow-y-auto space-y-4">
              {/* 1. Interactive SVG Diagram for Active Chapter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#0A4D44] font-bold">
                    Interactive Visual Schematic &amp; Locus
                  </span>
                  <span className="text-[10px] font-mono text-[#0E6B5E] font-semibold">
                    {activeChapter.classLevel} · Ch {activeChapter.chapterNo}
                  </span>
                </div>

                <NcertInteractiveDiagram
                  chapterId={activeChapter.id}
                  activeFormulaIdx={activeFormulaIdx}
                  params={{
                    principalP,
                    rateR,
                    timeT,
                    quadA,
                    quadB,
                    quadC,
                    apFirst,
                    apDiff,
                    apN,
                    calcCoeffA,
                    calcPowerN,
                    calcEvalX,
                    mat2x2
                  }}
                />
              </div>

              {/* 2. Context-Aware Live Formula Sandbox (Updates Diagram & Output in Real Time!) */}
              <div className="bg-[#FFFDF9] border border-[#D5CBB8] rounded-xl p-3.5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-2">
                  <span className="text-xs font-bold text-[#0A4D44]">
                    Live Formula Sandbox ({selectedClass})
                  </span>
                  <span className="text-[10px] font-mono text-[#0E6B5E]">
                    Real-Time Solver
                  </span>
                </div>

                {/* CLASS 7, 8, 9 SANDBOX: SI, CI & UNITARY METHOD */}
                {(['Class 7', 'Class 8', 'Class 9'] as NcertClassLevel[]).includes(selectedClass) && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-[#5A5346] mb-0.5">
                          Principal P (₹)
                        </label>
                        <input
                          type="number"
                          value={principalP}
                          onChange={e => setPrincipalP(Number(e.target.value))}
                          className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#5A5346] mb-0.5">
                          Rate R (%)
                        </label>
                        <input
                          type="number"
                          value={rateR}
                          onChange={e => setRateR(Number(e.target.value))}
                          className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#5A5346] mb-0.5">
                          Time T (Yrs)
                        </label>
                        <input
                          type="number"
                          value={timeT}
                          onChange={e => setTimeT(Number(e.target.value))}
                          className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                      <div className="p-2 rounded bg-[#F7F3EB] border border-[#DDD4C2]">
                        <span className="text-[9.5px] text-[#686052] block">Simple Int (SI)</span>
                        <strong className="text-[#0A4D44]">₹{siCiResults.si.toFixed(0)}</strong>
                      </div>
                      <div className="p-2 rounded bg-[#F7F3EB] border border-[#DDD4C2]">
                        <span className="text-[9.5px] text-[#686052] block">Compound (CI)</span>
                        <strong className="text-[#0E6B5E]">₹{siCiResults.ci.toFixed(0)}</strong>
                      </div>
                      <div className="p-2 rounded bg-[#EFF5F3] border border-[#9CC5BE]">
                        <span className="text-[9.5px] text-[#0A4D44] block">CI − SI Gap</span>
                        <strong className="text-[#0A4D44]">₹{siCiResults.diff.toFixed(1)}</strong>
                      </div>
                    </div>

                    {/* Unitary Method Mini-Solver */}
                    <div className="pt-2 border-t border-[#EAE2D3] space-y-2">
                      <span className="text-[10px] font-mono uppercase text-[#0E6B5E] font-bold block">
                        Unitary Method (N₁ Units → 1 Unit → N₂ Units)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#5A5346]">Given N₁</label>
                          <input
                            type="number"
                            value={unitGivenQty}
                            onChange={e => setUnitGivenQty(Number(e.target.value))}
                            className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#5A5346]">Total Cost</label>
                          <input
                            type="number"
                            value={unitGivenCost}
                            onChange={e => setUnitGivenCost(Number(e.target.value))}
                            className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#5A5346]">Target N₂</label>
                          <input
                            type="number"
                            value={unitTargetQty}
                            onChange={e => setUnitTargetQty(Number(e.target.value))}
                            className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                          />
                        </div>
                      </div>
                      <div className="p-2 rounded bg-[#072E29] text-[#F5F0E6] font-mono text-[11px]">
                        1 Unit = ₹{siCiResults.oneUnitVal.toFixed(2)} ⇒{' '}
                        <strong className="text-amber-300">
                          {unitTargetQty} Units = ₹{siCiResults.targetVal.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* CLASS 10 SANDBOX: QUADRATIC ROOTS, AP & BOARD NUMERICALS */}
                {selectedClass === 'Class 10' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-[#5A5346]">a (x²)</label>
                        <input
                          type="number"
                          value={quadA}
                          onChange={e => setQuadA(Number(e.target.value))}
                          className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#5A5346]">b (x)</label>
                        <input
                          type="number"
                          value={quadB}
                          onChange={e => setQuadB(Number(e.target.value))}
                          className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#5A5346]">c (const)</label>
                        <input
                          type="number"
                          value={quadC}
                          onChange={e => setQuadC(Number(e.target.value))}
                          className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                        />
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#072E29] text-[#F5F0E6] font-mono text-[11px] space-y-0.5">
                      <div>
                        Discriminant D = b²−4ac ={' '}
                        <strong className="text-amber-300">{class10Results.D}</strong>
                      </div>
                      <div className="text-emerald-300 font-bold">
                        Roots: {class10Results.rootsText}
                      </div>
                    </div>

                    {/* AP Quick Solver */}
                    <div className="pt-2 border-t border-[#EAE2D3] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-[#0E6B5E] font-bold block">
                        Arithmetic Progression (a, d, n)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          value={apFirst}
                          onChange={e => setApFirst(Number(e.target.value))}
                          className="px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                          title="First Term a"
                        />
                        <input
                          type="number"
                          value={apDiff}
                          onChange={e => setApDiff(Number(e.target.value))}
                          className="px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                          title="Common Diff d"
                        />
                        <input
                          type="number"
                          value={apN}
                          onChange={e => setApN(Number(e.target.value))}
                          className="px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                          title="Terms n"
                        />
                      </div>
                      <div className="p-2 rounded bg-[#F7F3EB] border border-[#DDD4C2] font-mono text-[11px] flex justify-between">
                        <span>
                          a_{apN} = <strong>{class10Results.apNth}</strong>
                        </span>
                        <span>
                          Sum S_{apN} = <strong className="text-[#0A4D44]">{class10Results.apSum}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CLASS 11 & 12 SANDBOX: CALCULUS DIFFERENTIATION/INTEGRATION & 2x2 MATRIX */}
                {(['Class 11', 'Class 12'] as NcertClassLevel[]).includes(selectedClass) && (
                  <div className="space-y-3 text-xs">
                    <span className="text-[10px] font-mono uppercase text-[#0E6B5E] font-bold block">
                      Calculus Engine: f(x) = a · xⁿ at x = x₀
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-[#5A5346]">Coeff (a)</label>
                        <input
                          type="number"
                          value={calcCoeffA}
                          onChange={e => setCalcCoeffA(Number(e.target.value))}
                          className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#5A5346]">Power (n)</label>
                        <input
                          type="number"
                          value={calcPowerN}
                          onChange={e => setCalcPowerN(Number(e.target.value))}
                          className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#5A5346]">Eval x₀</label>
                        <input
                          type="number"
                          value={calcEvalX}
                          onChange={e => setCalcEvalX(Number(e.target.value))}
                          className="w-full px-2 py-1 font-mono font-bold bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                        />
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#072E29] text-[#F5F0E6] font-mono text-[11px] space-y-1">
                      <div>
                        dy/dx ={' '}
                        <strong className="text-amber-300">
                          {class12Results.derivCoeff}x^{class12Results.derivPow}
                        </strong>{' '}
                        (At x={calcEvalX}: <strong>{class12Results.derivValueAtX}</strong>)
                      </div>
                      <div>
                        ∫₀^{calcEvalX} f(x)dx ={' '}
                        <strong className="text-emerald-300">
                          {class12Results.defIntFrom0ToX.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* 2x2 Matrix Determinant & Inverse */}
                    <div className="pt-2 border-t border-[#EAE2D3] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-[#0E6B5E] font-bold">
                          2×2 Matrix A = [[a, b], [c, d]]
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#0A4D44]">
                          |A| = {class12Results.det}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[0, 1, 2, 3].map(i => (
                          <input
                            key={i}
                            type="number"
                            value={mat2x2[i]}
                            onChange={e => {
                              const next: [number, number, number, number] = [...mat2x2] as [
                                number,
                                number,
                                number,
                                number
                              ];
                              next[i] = Number(e.target.value);
                              setMat2x2(next);
                            }}
                            className="px-2 py-1 font-mono font-bold text-center bg-[#F7F3EB] border border-[#C8BFA8] rounded"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: VISUAL PRINCIPLE ↔ FORMULA CABLE LINKER (WITH LIVE DIAGRAMS)
         ===================================================================== */}
      {activeMainTab === 'linker' && (
        <VisualConceptFormulaLinker
          currentStudent={currentStudent}
          handleAwardBonusXP={handleAwardBonusXP}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}

      {/* =====================================================================
          TAB 3: INTERACTIVE 118-ELEMENT PERIODIC TABLE (ATOMIC MASS, VALENCE e⁻ & DRAG-TO-3D-TUBE)
         ===================================================================== */}
      {activeMainTab === 'periodic' && (
        <InteractivePeriodicTableLab
          currentStudent={currentStudent}
          handleAwardBonusXP={handleAwardBonusXP}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}

      {/* =====================================================================
          TAB 4: FULL SCIENTIFIC, CALCULUS & MATRIX CALCULATOR WORKBENCH
         ===================================================================== */}
      {activeMainTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left 7 Cols: Scientific Keypad */}
          <div className="lg:col-span-7 bg-[#072E29] text-[#F5F0E6] border border-[#14463F] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#175249] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CC5BE] block">
                  NCERT Scientific &amp; Engineering Calculator
                </span>
                <h2 className="text-base font-semibold text-white">
                  Trigonometric, Logarithmic, Exponential &amp; Factorial Computer
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                {(['DEG', 'RAD'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAngleMode(mode)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      angleMode === mode
                        ? 'bg-amber-400 text-[#072E29]'
                        : 'bg-[#124E45] text-[#9CC5BE]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#041E1A] border border-[#175249] text-right font-mono space-y-1">
              <div className="text-xs text-[#82B2A9] h-4">{calcExpression || 'Ready'}</div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight overflow-x-auto">
                {calcDisplay}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 font-mono text-xs sm:text-sm">
              {[
                'sin',
                'cos',
                'tan',
                'AC',
                'DEL',
                'asin',
                'acos',
                'atan',
                '(',
                ')',
                'ln',
                'log',
                '1/x',
                'x²',
                'x³',
                '√',
                '∛',
                '^',
                'n!',
                '%',
                '7',
                '8',
                '9',
                '÷',
                'π',
                '4',
                '5',
                '6',
                '×',
                'e',
                '1',
                '2',
                '3',
                '-',
                'ANS',
                '0',
                '.',
                '±',
                '+',
                '='
              ].map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSciButton(key)}
                  className={`py-2.5 rounded-xl font-bold transition cursor-pointer ${
                    key === '='
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-[#041E1A]'
                      : key === 'AC' || key === 'DEL'
                      ? 'bg-rose-600/80 hover:bg-rose-600 text-white'
                      : ['+', '-', '×', '÷', '^', '%'].includes(key)
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30'
                      : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(key)
                      ? 'bg-[#124E45] hover:bg-[#19665B] text-white'
                      : 'bg-[#0B3B33] hover:bg-[#124E45] text-[#9CC5BE]'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Right 5 Cols: Tape History + Constants */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-2">
                <h3 className="text-sm font-bold text-[#1C2A27]">Calculation Tape History</h3>
                <button
                  type="button"
                  onClick={() => setCalcHistory([])}
                  className="text-xs text-[#0E6B5E] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {calcHistory.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCalcDisplay(item.res)}
                    className="p-2.5 rounded-lg bg-[#F7F3EB] hover:bg-[#EAE2D3] border border-[#E2D9C8] flex items-center justify-between font-mono text-xs cursor-pointer"
                  >
                    <span className="text-[#5A5346]">{item.expr}</span>
                    <strong className="text-[#0A4D44]">= {item.res}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-2xl p-4 space-y-2.5">
              <h3 className="text-sm font-bold text-[#1C2A27]">
                NCERT Physics &amp; Chemistry Constants (Tap to Load)
              </h3>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {[
                  { label: 'Speed of Light (c)', val: '300000000', disp: '3.0 × 10⁸ m/s' },
                  { label: 'Gravity (g)', val: '9.8', disp: '9.8 m/s²' },
                  { label: 'Planck (h)', val: '6.626e-34', disp: '6.63 × 10⁻³⁴ J·s' },
                  { label: 'Gas Const (R)', val: '8.314', disp: '8.314 J/mol·K' }
                ].map(c => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      playUISound('click');
                      setCalcDisplay(c.val);
                    }}
                    className="p-2.5 rounded-xl bg-[#F7F3EB] hover:bg-[#0A4D44] text-[#1C2A27] hover:text-white border border-[#DDD4C2] text-left transition cursor-pointer"
                  >
                    <span className="text-[10px] block opacity-80">{c.label}</span>
                    <strong className="text-xs">{c.disp}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: 3D CHEMISTRY & ANALYTICAL SIMULATORS
         ===================================================================== */}
      {activeMainTab === 'sims' && (
        <ChemLab3DSimulator
          currentStudent={currentStudent}
          handleAwardBonusXP={handleAwardBonusXP}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}
    </div>
  );
};
