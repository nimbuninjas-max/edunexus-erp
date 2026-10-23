import React, { useState, useMemo } from 'react';
import { Student } from '../../types/erp';
import { NcertInteractiveDiagram } from './NcertInteractiveDiagrams';

export interface LinkerPairItem {
  pairId: string;
  code: string;
  principleTitle: string;
  principleCategory: string;
  formulaExpression: string;
  formulaSubtext: string;
  diagramChapterId: string;
  wireColor: string;
  badgeBg: string;
  badgeText: string;
  derivationNote: string;
  realWorldExample: string;
}

const LINKER_DECKS: {
  id: string;
  deckTitle: string;
  subtitle: string;
  xpReward: number;
  items: LinkerPairItem[];
}[] = [
  {
    id: 'deck-physics-core',
    deckTitle: 'Deck 1: Physics, Optics & Electromagnetism Laws',
    subtitle: 'Ohm’s Law, Quadratic Discriminant, Lens Refraction, Joule Heating & Vectors',
    xpReward: 180,
    items: [
      {
        pairId: 'p1',
        code: 'P-01',
        principleTitle: 'Ohm’s Electrical Conduction Law',
        principleCategory: 'Class 10 Electricity',
        formulaExpression: 'V = I × R  (and R = ρ·L / A)',
        formulaSubtext: 'Potential Difference = Current × Resistance',
        diagramChapterId: 'c10-ch5',
        wireColor: '#10B981',
        badgeBg: 'bg-emerald-500/20 border-emerald-400',
        badgeText: 'text-emerald-300',
        derivationNote: 'At constant temperature, current I flowing through a metallic conductor is directly proportional to voltage V across its ends.',
        realWorldExample: 'If a 4 Ω resistor carries 2.5 A current, Voltage drop V = 2.5 × 4 = 10 V.'
      },
      {
        pairId: 'p2',
        code: 'P-02',
        principleTitle: 'Quadratic Discriminant & Nature of Roots',
        principleCategory: 'Class 10 Algebra',
        formulaExpression: 'D = b² − 4ac  ⇒  x = (−b ± √D) / 2a',
        formulaSubtext: 'Sridharacharya Root Formula & Parabola Zeroes',
        diagramChapterId: 'c10-ch2',
        wireColor: '#F59E0B',
        badgeBg: 'bg-amber-500/20 border-amber-400',
        badgeText: 'text-amber-300',
        derivationNote: 'Discriminant D determines where the parabola y = ax² + bx + c intersects the X-axis (D > 0: 2 distinct real roots; D = 0: tangent vertex).',
        realWorldExample: 'For 2x² − 7x + 3 = 0, D = (−7)² − 4(2)(3) = 25 > 0 ⇒ roots x = 3 and x = 0.5.'
      },
      {
        pairId: 'p3',
        code: 'P-03',
        principleTitle: 'Compound Interest Exponential Growth',
        principleCategory: 'Class 8 Comparing Quantities',
        formulaExpression: 'A = P(1 + R/100)ⁿ  |  CI = A − P',
        formulaSubtext: 'Interest-on-Interest Compounding Formula',
        diagramChapterId: 'c8-ch1',
        wireColor: '#38BDF8',
        badgeBg: 'bg-sky-500/20 border-sky-400',
        badgeText: 'text-sky-300',
        derivationNote: 'Unlike linear Simple Interest (SI = PRT/100), Compound Interest reinvests each period’s interest into the principal exponentially.',
        realWorldExample: '₹10,000 at 10% p.a. for 2 years yields CI = ₹2,100 vs SI = ₹2,000 (Extra gain = ₹100).'
      },
      {
        pairId: 'p4',
        code: 'P-04',
        principleTitle: 'Pythagoras Right-Triangle Theorem',
        principleCategory: 'Class 7–10 Geometry',
        formulaExpression: 'c² = a² + b²  |  sin²θ + cos²θ = 1',
        formulaSubtext: 'Hypotenuse Square = Base² + Perpendicular²',
        diagramChapterId: 'c7-ch4',
        wireColor: '#F43F5E',
        badgeBg: 'bg-rose-500/20 border-rose-400',
        badgeText: 'text-rose-300',
        derivationNote: 'In any right-angled triangle, the area of the square on the hypotenuse equals the sum of areas of squares on the other two legs.',
        realWorldExample: 'For base = 4 cm and perpendicular = 3 cm, hypotenuse c = √(16 + 9) = 5 cm.'
      },
      {
        pairId: 'p5',
        code: 'P-05',
        principleTitle: '3D Cone & Sphere Mensuration Law',
        principleCategory: 'Class 9–10 Surface Areas & Volumes',
        formulaExpression: 'V(Cone) = ⅓πr²h  |  l = √(r² + h²)',
        formulaSubtext: 'One-Third Cylinder Volume & Slant Height',
        diagramChapterId: 'c9-ch2',
        wireColor: '#A855F7',
        badgeBg: 'bg-purple-500/20 border-purple-400',
        badgeText: 'text-purple-300',
        derivationNote: 'A right circular cone of radius r and height h occupies exactly one-third the volume of a cylinder with identical base and height.',
        realWorldExample: 'For r = 7 cm, h = 24 cm: slant height l = 25 cm and curved surface area πrl = 550 cm².'
      }
    ]
  },
  {
    id: 'deck-calculus-matrices',
    deckTitle: 'Deck 2: Class 11–12 Calculus, Matrices, Conics & Vectors',
    subtitle: 'Differentiation, Definite Integrals, Matrix Inverse, Conic Ellipse & 3D Vectors',
    xpReward: 220,
    items: [
      {
        pairId: 'c1',
        code: 'C-01',
        principleTitle: 'Matrix Inverse & Adjoint Theorem',
        principleCategory: 'Class 12 Matrices & Determinants',
        formulaExpression: 'A⁻¹ = (1 / |A|) · adj(A)   (|A| = ad − bc ≠ 0)',
        formulaSubtext: 'Reciprocal Determinant × Transpose of Cofactors',
        diagramChapterId: 'c12-ch1',
        wireColor: '#10B981',
        badgeBg: 'bg-emerald-500/20 border-emerald-400',
        badgeText: 'text-emerald-300',
        derivationNote: 'Since A · adj(A) = |A|·Iₙ, dividing both sides by non-zero determinant |A| yields the unique inverse matrix A⁻¹.',
        realWorldExample: 'Used to solve simultaneous linear systems AX = B via X = A⁻¹B.'
      },
      {
        pairId: 'c2',
        code: 'C-02',
        principleTitle: 'Second Derivative Maxima & Minima Test',
        principleCategory: 'Class 12 Differential Calculus',
        formulaExpression: 'f′(c) = 0  and  f″(c) < 0 ⇒ Local Maximum',
        formulaSubtext: 'Zero Tangent Slope + Concave-Down Curvature',
        diagramChapterId: 'c12-ch2',
        wireColor: '#F59E0B',
        badgeBg: 'bg-amber-500/20 border-amber-400',
        badgeText: 'text-amber-300',
        derivationNote: 'At a stationary peak c, the tangent is horizontal (dy/dx = 0) and the rate of change of slope is negative (d²y/dx² < 0).',
        realWorldExample: 'Maximizing volume of a cylinder or box for a fixed surface area in NCERT Ex 6.5.'
      },
      {
        pairId: 'c3',
        code: 'C-03',
        principleTitle: 'Fundamental Theorem of Definite Calculus',
        principleCategory: 'Class 12 Integral Calculus',
        formulaExpression: '∫ₐᵇ f(x) dx = F(b) − F(a)  (where F′(x) = f(x))',
        formulaSubtext: 'Net Signed Area Under Curve from x = a to x = b',
        diagramChapterId: 'c12-ch3',
        wireColor: '#38BDF8',
        badgeBg: 'bg-sky-500/20 border-sky-400',
        badgeText: 'text-sky-300',
        derivationNote: 'Links differentiation and integration: the exact area under f(x) is evaluated using its antiderivative F(x) at the upper and lower limits.',
        realWorldExample: '∫₀² 3x² dx = [x³]₀² = 2³ − 0³ = 8 sq. units.'
      },
      {
        pairId: 'c4',
        code: 'C-04',
        principleTitle: 'Conic Section Ellipse Eccentricity & Locus',
        principleCategory: 'Class 11 Conic Sections',
        formulaExpression: 'x²/a² + y²/b² = 1  |  b² = a²(1 − e²), LR = 2b²/a',
        formulaSubtext: 'Sum of Focal Distances P·F₁ + P·F₂ = 2a',
        diagramChapterId: 'c11-ch3',
        wireColor: '#F43F5E',
        badgeBg: 'bg-rose-500/20 border-rose-400',
        badgeText: 'text-rose-300',
        derivationNote: 'An ellipse is the locus of a point whose distances from two fixed foci F₁(−ae, 0) and F₂(+ae, 0) sum to constant major axis 2a.',
        realWorldExample: 'Planetary orbits around the Sun follow elliptical loci with the Sun at one focus.'
      },
      {
        pairId: 'c5',
        code: 'C-05',
        principleTitle: '3D Vector Cross Product & Bayes’ Law',
        principleCategory: 'Class 12 Vectors & Probability',
        formulaExpression: 'a⃗ × b⃗ = |a||b|sinθ n̂  |  P(E₁|A) = P(E₁)P(A|E₁)/P(A)',
        formulaSubtext: 'Orthogonal Normal Vector & Reverse Probability',
        diagramChapterId: 'c12-ch4',
        wireColor: '#A855F7',
        badgeBg: 'bg-purple-500/20 border-purple-400',
        badgeText: 'text-purple-300',
        derivationNote: 'Cross product yields a vector perpendicular to both a⃗ and b⃗ whose magnitude equals the area of the parallelogram spanned by them.',
        realWorldExample: 'Torque τ⃗ = r⃗ × F⃗ in rotational mechanics and medical diagnostic testing via Bayes’ rule.'
      }
    ]
  },
  {
    id: 'deck-foundation-math',
    deckTitle: 'Deck 3: Class 7–10 Unitary Method, Proportions & Trigonometry',
    subtitle: 'Unitary Rule of Three, Inverse Proportion, Algebraic Identities & Unit Circle',
    xpReward: 160,
    items: [
      {
        pairId: 'f1',
        code: 'M-01',
        principleTitle: 'Unitary Method (Rule of Three)',
        principleCategory: 'Class 7 Comparing Quantities',
        formulaExpression: 'Value of n Units = (Total Value ÷ Given Units) × n',
        formulaSubtext: 'Isolate Single Unit Value First, Then Multiply by n',
        diagramChapterId: 'c7-ch1',
        wireColor: '#10B981',
        badgeBg: 'bg-emerald-500/20 border-emerald-400',
        badgeText: 'text-emerald-300',
        derivationNote: 'Dividing total cost by given quantity isolates the unit rate; multiplying by target quantity n scales proportionally.',
        realWorldExample: '12 books cost ₹360 ⇒ 1 book = ₹30 ⇒ 7 books = 7 × ₹30 = ₹210.'
      },
      {
        pairId: 'f2',
        code: 'M-02',
        principleTitle: 'Inverse Proportion & Combined Work Rate',
        principleCategory: 'Class 8 Direct & Inverse Proportions',
        formulaExpression: 'x₁·y₁ = x₂·y₂ = k  |  Together Time = (x·y)/(x + y)',
        formulaSubtext: 'Constant Product Hyperbola & Reciprocal 1-Day Work',
        diagramChapterId: 'c8-ch2',
        wireColor: '#F59E0B',
        badgeBg: 'bg-amber-500/20 border-amber-400',
        badgeText: 'text-amber-300',
        derivationNote: 'When workforce increases, completion time decreases inversely so that worker-hours x·y remain constant.',
        realWorldExample: 'A finishes in 10 days, B in 15 days ⇒ together 1/(1/10 + 1/15) = 6 days.'
      },
      {
        pairId: 'f3',
        code: 'M-03',
        principleTitle: 'Binomial Square Geometric Identity',
        principleCategory: 'Class 8–9 Algebraic Identities',
        formulaExpression: '(a + b)² = a² + 2ab + b²  |  a² − b² = (a+b)(a−b)',
        formulaSubtext: 'Square Partitioned into 2 Squares & 2 Rectangles',
        diagramChapterId: 'c8-ch3',
        wireColor: '#38BDF8',
        badgeBg: 'bg-sky-500/20 border-sky-400',
        badgeText: 'text-sky-300',
        derivationNote: 'A square of side (a+b) decomposes visually into an a×a square, a b×b square, and two a×b rectangles.',
        realWorldExample: '103² = (100 + 3)² = 10000 + 600 + 9 = 10,609.'
      },
      {
        pairId: 'f4',
        code: 'M-04',
        principleTitle: 'Basic Proportionality Theorem (Thales Law)',
        principleCategory: 'Class 10 Similar Triangles',
        formulaExpression: 'DE ∥ BC in ΔABC  ⇒  AD / DB = AE / EC',
        formulaSubtext: 'Parallel Line Divides Triangle Sides Proportionally',
        diagramChapterId: 'c10-ch3',
        wireColor: '#F43F5E',
        badgeBg: 'bg-rose-500/20 border-rose-400',
        badgeText: 'text-rose-300',
        derivationNote: 'A line drawn parallel to one side of a triangle intersects the other two sides in equal ratio.',
        realWorldExample: 'Used in geometric surveying and height-and-distance similarity proofs.'
      },
      {
        pairId: 'f5',
        code: 'M-05',
        principleTitle: 'Circle Sector Area & Subtended Arc Theorem',
        principleCategory: 'Class 9–10 Circles & Sectors',
        formulaExpression: 'Sector Area = (θ/360°)πr²  |  ∠Centre = 2 × ∠Arc',
        formulaSubtext: 'Proportional Angular Wedge & Double Central Angle',
        diagramChapterId: 'c10-ch4',
        wireColor: '#A855F7',
        badgeBg: 'bg-purple-500/20 border-purple-400',
        badgeText: 'text-purple-300',
        derivationNote: 'A sector of central angle θ occupies fraction θ/360° of the full circle area πr².',
        realWorldExample: 'For r = 21 cm and θ = 60°, Sector Area = (60/360) × (22/7) × 441 = 231 cm².'
      }
    ]
  }
];

// Deterministic permutation per deck so the right column is genuinely shuffled
const RIGHT_ORDER_INDICES: Record<string, number[]> = {
  'deck-physics-core': [2, 4, 0, 3, 1],
  'deck-calculus-matrices': [3, 0, 4, 1, 2],
  'deck-foundation-math': [1, 4, 2, 0, 3]
};

interface VisualConceptFormulaLinkerProps {
  currentStudent: Student;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

export const VisualConceptFormulaLinker: React.FC<VisualConceptFormulaLinkerProps> = ({
  currentStudent,
  handleAwardBonusXP,
  playUISound,
  showToast
}) => {
  const [activeDeckId, setActiveDeckId] = useState<string>('deck-physics-core');
  const activeDeck = useMemo(
    () => LINKER_DECKS.find(d => d.id === activeDeckId) || LINKER_DECKS[0],
    [activeDeckId]
  );

  // Map of leftPairId -> connected rightPairId (allows visual wiring and clear indication of WHICH is linked with WHICH!)
  const [connections, setConnections] = useState<Record<string, string>>({
    p1: 'p1' // Pre-connect item #1 on first load so the student immediately sees a live wire + diagram!
  });
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>('p2');
  const [inspectedPairId, setInspectedPairId] = useState<string>('p1');
  const [rightOrder, setRightOrder] = useState<number[]>(RIGHT_ORDER_INDICES['deck-physics-core']);
  const [wrongAttemptFlash, setWrongAttemptFlash] = useState<{ leftId: string; rightId: string } | null>(null);

  const rightColumnItems = useMemo(() => {
    return rightOrder.map(idx => activeDeck.items[idx]);
  }, [activeDeck, rightOrder]);

  const inspectedItem = useMemo(() => {
    return activeDeck.items.find(i => i.pairId === inspectedPairId) || activeDeck.items[0];
  }, [activeDeck, inspectedPairId]);

  const handleSelectDeck = (deckId: string) => {
    playUISound('click');
    setActiveDeckId(deckId);
    const nextDeck = LINKER_DECKS.find(d => d.id === deckId) || LINKER_DECKS[0];
    setRightOrder(RIGHT_ORDER_INDICES[deckId] || [2, 0, 4, 1, 3]);
    const firstId = nextDeck.items[0].pairId;
    setConnections({});
    setSelectedLeftId(firstId);
    setInspectedPairId(firstId);
  };

  const handleReshuffleDeck = () => {
    playUISound('click');
    const indices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
    setRightOrder(indices);
    setConnections({});
    setSelectedLeftId(activeDeck.items[0].pairId);
    setInspectedPairId(activeDeck.items[0].pairId);
  };

  const handleAutoConnectAll = () => {
    playUISound('success');
    const allMap: Record<string, string> = {};
    activeDeck.items.forEach(item => {
      allMap[item.pairId] = item.pairId;
    });
    setConnections(allMap);
    setSelectedLeftId(null);
    showToast(
      'All Principles Wired to Formulas!',
      'Click any principle or wire to study its interactive diagram on the right.',
      'success'
    );
  };

  const handleLeftClick = (item: LinkerPairItem) => {
    playUISound('click');
    setInspectedPairId(item.pairId);
    // If already connected, clicking selects it or allows re-inspecting
    setSelectedLeftId(item.pairId);
  };

  const handleRightClick = (rightItem: LinkerPairItem) => {
    setInspectedPairId(rightItem.pairId);
    if (!selectedLeftId) {
      playUISound('click');
      showToast(
        'Select a Principle on the Left First',
        'Click any Scientific Principle card on the left column to start a wire.',
        'warning'
      );
      return;
    }

    if (selectedLeftId === rightItem.pairId) {
      // Correct match! Connect wire!
      playUISound('success');
      const nextConn = { ...connections, [selectedLeftId]: rightItem.pairId };
      setConnections(nextConn);
      setWrongAttemptFlash(null);

      // Automatically advance selection to the next unconnected left principle!
      const nextUnconnected = activeDeck.items.find(i => !nextConn[i.pairId]);
      setSelectedLeftId(nextUnconnected ? nextUnconnected.pairId : null);

      const totalMatched = Object.keys(nextConn).length;
      if (totalMatched === activeDeck.items.length) {
        handleAwardBonusXP(currentStudent.id, activeDeck.xpReward, `Completed Visual Node Linker: ${activeDeck.deckTitle}`);
        showToast(
          `All ${totalMatched} Cables Linked! +${activeDeck.xpReward} XP`,
          'Every scientific principle is now visually wired to its formula and diagram.',
          'success'
        );
      }
    } else {
      // Mistake flash — show red temporary wire so student sees why it's wrong
      playUISound('error');
      setWrongAttemptFlash({ leftId: selectedLeftId, rightId: rightItem.pairId });
      setTimeout(() => setWrongAttemptFlash(null), 900);
      showToast(
        'Formula Mismatch!',
        'Look at the schematic diagram on the right to see which equation belongs to this principle.',
        'warning'
      );
    }
  };

  const matchedCount = Object.keys(connections).length;
  const ROW_HEIGHT = 82; // Fixed row height in px for exact SVG Bezier port alignment

  return (
    <div className="bg-[#061C18] border border-[#16423B] rounded-2xl overflow-hidden text-[#F5F0E6] shadow-lg">
      {/* DYNAMIC CONTEXT-AWARE TOP COMMAND HEADER */}
      <div className="px-4 py-3 bg-[#092B25] border-b border-[#16423B] flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              {activeDeck.deckTitle.split(':')[0]} • {matchedCount}/{activeDeck.items.length} WIRED
            </span>
            <span className="text-[11px] font-mono text-amber-300 truncate">
              Active Principle: {inspectedItem.principleTitle} ({inspectedItem.code})
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">
            {activeDeck.deckTitle.split(':')[1]?.trim() || activeDeck.deckTitle} — Concept ↔ Formula Linker
          </h2>
          <p className="text-[11px] text-[#9CC5BE] truncate">{activeDeck.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-mono text-[#9CC5BE] whitespace-nowrap">Category:</label>
            <select
              value={activeDeckId}
              onChange={e => handleSelectDeck(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#041814] border border-[#24665B] text-[#F5F0E6] focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              {LINKER_DECKS.map(deck => (
                <option key={deck.id} value={deck.id}>
                  {deck.deckTitle}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleAutoConnectAll}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer"
          >
            Show All Wires
          </button>
          <button
            type="button"
            onClick={handleReshuffleDeck}
            className="px-3 py-1.5 rounded-lg bg-[#12423A] hover:bg-[#19564C] text-[#D5EBE6] border border-[#24665B] text-xs font-semibold transition cursor-pointer"
          >
            Reset &amp; Shuffle
          </button>
        </div>
      </div>

      {/* ZERO-SCROLL 12-COLUMN SPLIT WORKSTATION:
          LEFT 7 COLS = INTERACTIVE SVG BEZIER WIRE LINKER
          RIGHT 5 COLS = LIVE INTERACTIVE SCHEMATIC DIAGRAM & DERIVATION */}
      <div className="grid grid-cols-1 xl:grid-cols-12">
        {/* LEFT 7 COLUMNS: VISUAL NODE LINKER WITH SVG BEZIER CABLES */}
        <div className="xl:col-span-7 p-4 sm:p-5 border-b xl:border-b-0 xl:border-r border-[#16423B]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8AB8AF] mb-2.5 px-1">
            <span>1. SCIENTIFIC PRINCIPLE (CLICK TO START WIRE)</span>
            <span className="hidden sm:inline text-emerald-300">── SVG PATCH CABLES ──</span>
            <span>2. MATCHING FORMULA (CLICK TO CONNECT)</span>
          </div>

          {/* 3-COLUMN WIRING BOARD (LEFT CARDS | CENTER SVG CABLES | RIGHT CARDS) */}
          <div
            className="grid grid-cols-12 items-stretch relative select-none"
            style={{ minHeight: `${activeDeck.items.length * ROW_HEIGHT}px` }}
          >
            {/* COLUMN 1: LEFT PRINCIPLES (5 cols) */}
            <div className="col-span-5 flex flex-col justify-between space-y-2">
              {activeDeck.items.map((leftItem, leftIdx) => {
                const isConnected = Boolean(connections[leftItem.pairId]);
                const isSelected = selectedLeftId === leftItem.pairId;
                const isInspected = inspectedPairId === leftItem.pairId;

                return (
                  <button
                    key={leftItem.pairId}
                    type="button"
                    onClick={() => handleLeftClick(leftItem)}
                    style={{
                      height: `${ROW_HEIGHT - 8}px`,
                      borderColor: isConnected
                        ? leftItem.wireColor
                        : isSelected
                        ? '#FBBF24'
                        : isInspected
                        ? '#38BDF8'
                        : '#1C5248'
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl border-2 transition relative flex items-center justify-between gap-2 cursor-pointer ${
                      isConnected
                        ? 'bg-[#0C352E] shadow-md'
                        : isSelected
                        ? 'bg-[#17493F] ring-2 ring-amber-400/50'
                        : 'bg-[#092923] hover:bg-[#0E3830]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-[#061C18]"
                          style={{ backgroundColor: leftItem.wireColor }}
                        >
                          #{leftIdx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-[#8AB8AF] truncate">
                          {leftItem.principleCategory}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mt-1">
                        {leftItem.principleTitle}
                      </p>
                      {isConnected ? (
                        <span
                          className="inline-block text-[10px] font-mono font-bold mt-0.5 truncate"
                          style={{ color: leftItem.wireColor }}
                        >
                          ● Wired to #{leftIdx + 1} ({leftItem.formulaExpression.split(' ')[0]})
                        </span>
                      ) : isSelected ? (
                        <span className="inline-block text-[10px] font-mono text-amber-300 mt-0.5">
                          ⚡ Active Wire — Click formula on right →
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-mono text-[#6E9E95] mt-0.5">
                          Click to wire &amp; view diagram
                        </span>
                      )}
                    </div>

                    {/* Right Output Port Terminal Dot */}
                    <span
                      className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                      style={{
                        borderColor: leftItem.wireColor,
                        backgroundColor: isConnected || isSelected ? leftItem.wireColor : '#061C18'
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#061C18]" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* COLUMN 2: CENTER SVG BEZIER PATCH CABLE CANVAS (2 cols) */}
            <div className="col-span-2 relative">
              <svg
                viewBox={`0 0 120 ${activeDeck.items.length * ROW_HEIGHT}`}
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                {/* Subtle horizontal guide tracks */}
                {activeDeck.items.map((_, idx) => {
                  const y = idx * ROW_HEIGHT + (ROW_HEIGHT - 8) / 2;
                  return (
                    <line
                      key={idx}
                      x1="0"
                      y1={y}
                      x2="120"
                      y2={y}
                      stroke="#113831"
                      strokeDasharray="2 4"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Render Active Connected Bezier Wires */}
                {activeDeck.items.map((leftItem, leftIdx) => {
                  const targetRightPairId = connections[leftItem.pairId];
                  if (!targetRightPairId) return null;
                  const rightIdx = rightColumnItems.findIndex(r => r.pairId === targetRightPairId);
                  if (rightIdx === -1) return null;

                  const y1 = leftIdx * ROW_HEIGHT + (ROW_HEIGHT - 8) / 2;
                  const y2 = rightIdx * ROW_HEIGHT + (ROW_HEIGHT - 8) / 2;
                  const pathData = `M 0 ${y1} C 55 ${y1}, 65 ${y2}, 120 ${y2}`;
                  const midY = (y1 + y2) / 2;

                  return (
                    <g key={leftItem.pairId}>
                      {/* Outer Glow */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={leftItem.wireColor}
                        strokeWidth="6"
                        strokeOpacity="0.22"
                      />
                      {/* Core Wire */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={leftItem.wireColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* End Terminals */}
                      <circle cx="3" cy={y1} r="4.5" fill={leftItem.wireColor} />
                      <circle cx="117" cy={y2} r="4.5" fill={leftItem.wireColor} />
                      {/* Mid-wire Link Number Pill */}
                      <rect
                        x="44"
                        y={midY - 9}
                        width="32"
                        height="18"
                        rx="9"
                        fill="#061C18"
                        stroke={leftItem.wireColor}
                        strokeWidth="1.5"
                      />
                      <text
                        x="60"
                        y={midY + 3.5}
                        textAnchor="middle"
                        fill={leftItem.wireColor}
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        #{leftIdx + 1}
                      </text>
                    </g>
                  );
                })}

                {/* Render Wrong Attempt Flash Wire if user clicked wrong formula */}
                {wrongAttemptFlash && (() => {
                  const leftIdx = activeDeck.items.findIndex(i => i.pairId === wrongAttemptFlash.leftId);
                  const rightIdx = rightColumnItems.findIndex(r => r.pairId === wrongAttemptFlash.rightId);
                  if (leftIdx === -1 || rightIdx === -1) return null;
                  const y1 = leftIdx * ROW_HEIGHT + (ROW_HEIGHT - 8) / 2;
                  const y2 = rightIdx * ROW_HEIGHT + (ROW_HEIGHT - 8) / 2;
                  return (
                    <path
                      d={`M 0 ${y1} C 55 ${y1}, 65 ${y2}, 120 ${y2}`}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="3.5"
                      strokeDasharray="5 4"
                    />
                  );
                })()}
              </svg>
            </div>

            {/* COLUMN 3: RIGHT FORMULAS (5 cols) */}
            <div className="col-span-5 flex flex-col justify-between space-y-2">
              {rightColumnItems.map(rightItem => {
                // Find which left index this rightItem corresponds to
                const originalLeftIndex = activeDeck.items.findIndex(i => i.pairId === rightItem.pairId);
                const isConnected = Boolean(connections[rightItem.pairId]);
                const isInspected = inspectedPairId === rightItem.pairId;

                return (
                  <button
                    key={rightItem.pairId}
                    type="button"
                    onClick={() => handleRightClick(rightItem)}
                    style={{
                      height: `${ROW_HEIGHT - 8}px`,
                      borderColor: isConnected
                        ? rightItem.wireColor
                        : isInspected
                        ? '#38BDF8'
                        : '#1C5248'
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl border-2 transition relative flex items-center justify-between gap-2 cursor-pointer ${
                      isConnected
                        ? 'bg-[#0C352E] shadow-md'
                        : 'bg-[#092923] hover:bg-[#103D34]'
                    }`}
                  >
                    {/* Left Input Port Terminal Dot */}
                    <span
                      className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                      style={{
                        borderColor: isConnected ? rightItem.wireColor : '#4E877D',
                        backgroundColor: isConnected ? rightItem.wireColor : '#061C18'
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#061C18]" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <code className="text-xs font-mono font-bold text-[#FDE68A] truncate block">
                          {rightItem.formulaExpression}
                        </code>
                        {isConnected && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-[#061C18] shrink-0"
                            style={{ backgroundColor: rightItem.wireColor }}
                          >
                            LINK #{originalLeftIndex + 1} ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#A7CFC7] truncate mt-0.5">
                        {rightItem.formulaSubtext}
                      </p>
                      {isConnected ? (
                        <span
                          className="inline-block text-[10px] font-mono font-bold mt-0.5 truncate"
                          style={{ color: rightItem.wireColor }}
                        >
                          ← Connected to #{originalLeftIndex + 1}: {rightItem.principleTitle}
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-mono text-[#6E9E95] mt-0.5">
                          Click to connect active wire
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: LIVE INTERACTIVE DIAGRAM & FORMULA EXPLANATION INSPECTOR */}
        <div className="xl:col-span-5 p-4 sm:p-5 bg-[#08241F] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[#16423B] pb-2.5">
              <div>
                <span
                  className="text-[10px] font-mono uppercase tracking-widest font-bold block"
                  style={{ color: inspectedItem.wireColor }}
                >
                  LIVE DIAGRAM INSPECTOR • {inspectedItem.principleCategory}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {inspectedItem.principleTitle}
                </h3>
              </div>
              <span
                className="px-2.5 py-1 rounded-md text-xs font-mono font-bold text-[#061C18]"
                style={{ backgroundColor: inspectedItem.wireColor }}
              >
                {inspectedItem.code}
              </span>
            </div>

            {/* Interactive SVG Schematic Diagram for the Selected Principle */}
            <NcertInteractiveDiagram chapterId={inspectedItem.diagramChapterId} />

            {/* Connected Formula Box */}
            <div className="p-3.5 rounded-xl bg-[#051714] border border-[#194B42] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8AB8AF]">
                <span>MATCHED MATHEMATICAL / SCIENTIFIC FORMULA</span>
                <span style={{ color: inspectedItem.wireColor }}>VERIFIED NCERT LAW</span>
              </div>
              <div className="text-sm font-mono font-bold text-[#FDE68A]">
                {inspectedItem.formulaExpression}
              </div>
              <p className="text-xs text-[#CBE3DE] leading-relaxed">
                {inspectedItem.derivationNote}
              </p>
            </div>
          </div>

          {/* Solved Numerical Application */}
          <div className="p-3.5 rounded-xl bg-[#0B332C] border border-[#1E5B50] text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block mb-1">
              Solved NCERT Application Example:
            </span>
            <p className="text-[#F5F0E6]">{inspectedItem.realWorldExample}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
