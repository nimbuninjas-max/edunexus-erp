import React, { useState, useMemo } from 'react';
import { Student } from '../../types/erp';
import {
  FULL_118_PERIODIC_TABLE,
  PeriodicElement118
} from '../../data/ncertFormulasData';
import { StreamlineIcon } from '../common/StreamlineIcon';

interface InteractivePeriodicTableLabProps {
  currentStudent: Student;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

const CATEGORY_COLORS: Record<
  PeriodicElement118['category'],
  { bg: string; border: string; text: string; hex: string; solidHex: string }
> = {
  'Alkali Metal': {
    bg: 'bg-rose-100',
    border: 'border-rose-400',
    text: 'text-rose-950',
    hex: '#F43F5E',
    solidHex: '#E2E8F0'
  },
  'Alkaline Earth': {
    bg: 'bg-orange-100',
    border: 'border-orange-400',
    text: 'text-orange-950',
    hex: '#F97316',
    solidHex: '#CBD5E1'
  },
  'Transition Metal': {
    bg: 'bg-sky-100',
    border: 'border-sky-400',
    text: 'text-sky-950',
    hex: '#0EA5E9',
    solidHex: '#94A3B8'
  },
  'Post-Transition': {
    bg: 'bg-emerald-100',
    border: 'border-emerald-400',
    text: 'text-emerald-950',
    hex: '#10B981',
    solidHex: '#A7F3D0'
  },
  Metalloid: {
    bg: 'bg-teal-100',
    border: 'border-teal-500',
    text: 'text-teal-950',
    hex: '#14B8A6',
    solidHex: '#5EEAD4'
  },
  Nonmetal: {
    bg: 'bg-lime-100',
    border: 'border-lime-500',
    text: 'text-lime-950',
    hex: '#84CC16',
    solidHex: '#BEF264'
  },
  Halogen: {
    bg: 'bg-amber-100',
    border: 'border-amber-500',
    text: 'text-amber-950',
    hex: '#F59E0B',
    solidHex: '#FDE047'
  },
  'Noble Gas': {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-950',
    hex: '#A855F7',
    solidHex: '#E9D5FF'
  },
  Lanthanide: {
    bg: 'bg-pink-100',
    border: 'border-pink-400',
    text: 'text-pink-950',
    hex: '#EC4899',
    solidHex: '#FBCFE8'
  },
  Actinide: {
    bg: 'bg-indigo-100',
    border: 'border-indigo-400',
    text: 'text-indigo-950',
    hex: '#6366F1',
    solidHex: '#818CF8'
  }
};

/**
 * Computes exact Valence Electrons, Common Valency / Oxidation States,
 * and Bohr Electron Shell distribution for any of the 118 IUPAC elements.
 */
export function getElementValenceDetails(el: PeriodicElement118): {
  valenceElectrons: number;
  valencyText: string;
  oxidationStates: string;
  shells: number[];
  reactivitySummary: string;
} {
  const shellCapacities = [2, 8, 18, 32, 32, 18, 8];
  let rem = el.z;
  const shells: number[] = [];
  for (let i = 0; i < shellCapacities.length && rem > 0; i++) {
    const take = Math.min(rem, shellCapacities[i]);
    shells.push(take);
    rem -= take;
  }

  let valenceElectrons = 2;
  let valencyText = '2 (Divalent)';
  let oxidationStates = '+2';
  let reactivitySummary = 'Forms metallic cations in acid/aqueous reactions.';

  if (el.z === 1) {
    valenceElectrons = 1;
    valencyText = '1 (Monovalent)';
    oxidationStates = '+1, −1';
    reactivitySummary = 'Combustible diatomic gas; burns with a sharp POP sound.';
  } else if (el.z === 2) {
    valenceElectrons = 2;
    valencyText = '0 (Complete Duplet)';
    oxidationStates = '0 (Inert)';
    reactivitySummary = 'Inert noble gas with full 1s² valence shell.';
  } else if (el.group === 1) {
    valenceElectrons = 1;
    valencyText = '1 (Loses 1 s-electron readily)';
    oxidationStates = '+1';
    reactivitySummary = 'Highly reactive Alkali Metal; donates its 1 valence electron in water/acid.';
  } else if (el.group === 2) {
    valenceElectrons = 2;
    valencyText = '2 (Loses 2 s-electrons)';
    oxidationStates = '+2';
    reactivitySummary = 'Alkaline Earth Metal; reacts with acids/water to release H₂ gas and form M(OH)₂.';
  } else if (el.group >= 13 && el.group <= 18) {
    valenceElectrons = el.group - 10;
    const classicalValency = valenceElectrons <= 4 ? valenceElectrons : 8 - valenceElectrons;
    valencyText =
      el.group === 18
        ? '0 (Complete Octet — 8 Valence e⁻)'
        : `${classicalValency} (${valenceElectrons} outer-shell e⁻)`;
    if (el.group === 13) {
      oxidationStates = '+3, +1';
      reactivitySummary = 'Amphoteric/post-transition behavior; reacts with acids & alkalis releasing H₂.';
    } else if (el.group === 14) {
      oxidationStates = '+4, +2, −4';
      reactivitySummary = 'Tetravalent element capable of catenation and covalent network bonding.';
    } else if (el.group === 15) {
      oxidationStates = '−3, +3, +5';
      reactivitySummary = 'Pnictogen with 5 valence electrons; forms acidic oxides and covalent hydrides.';
    } else if (el.group === 16) {
      oxidationStates = '−2, +4, +6';
      reactivitySummary = 'Chalcogen with 6 valence electrons; forms oxides and sulfides.';
    } else if (el.group === 17) {
      oxidationStates = '−1, +1, +3, +5, +7';
      reactivitySummary = 'Highly electronegative Halogen (7 valence e⁻); needs 1 e⁻ to complete octet.';
    } else {
      oxidationStates = '0';
      reactivitySummary = 'Inert Noble Gas with a stable 8-electron valence octet.';
    }
  } else if (el.category === 'Lanthanide') {
    valenceElectrons = 3;
    valencyText = '3 (4f + 6s² valence)';
    oxidationStates = '+3, +2, +4';
    reactivitySummary = 'Rare-earth f-block lanthanide; tarnishes in air and reacts with acid to evolve H₂.';
  } else if (el.category === 'Actinide') {
    valenceElectrons = 3;
    valencyText = '3 to 6 (5f + 6d + 7s)';
    oxidationStates = '+3, +4, +5, +6';
    reactivitySummary = 'Radioactive 5f-block actinide; exhibits variable oxidation states in solution.';
  } else {
    valenceElectrons = 2;
    valencyText = 'Variable (d-orbital participation)';
    oxidationStates = '+2, +3 (Variable d-block)';
    reactivitySummary = 'Transition metal forming vividly colored coordination complexes via d–d transitions.';
  }

  return {
    valenceElectrons,
    valencyText,
    oxidationStates,
    shells,
    reactivitySummary
  };
}

export const InteractivePeriodicTableLab: React.FC<InteractivePeriodicTableLabProps> = ({
  playUISound,
  showToast
}) => {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement118>(
    FULL_118_PERIODIC_TABLE[10] // Default: Sodium (Na, Z=11)
  );
  const [ptBlockFilter, setPtBlockFilter] = useState<'ALL' | 's' | 'p' | 'd' | 'f'>('ALL');
  const [ptCategoryFilter, setPtCategoryFilter] = useState<string>('ALL');
  const [ptSearch, setPtSearch] = useState<string>('');

  const selectedValenceInfo = useMemo(
    () => getElementValenceDetails(selectedElement),
    [selectedElement]
  );

  // Download SVG Poster of the 118-Element Periodic Table
  const handleDownloadPosterSVG = () => {
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
      const fillHex = CATEGORY_COLORS[el.category]?.solidHex || '#E2E8F0';
      const v = getElementValenceDetails(el);

      cellsSvg += `
        <g transform="translate(${x}, ${y})">
          <rect width="${cellW}" height="${cellH}" rx="6" fill="${fillHex}" stroke="#0A4D44" stroke-width="1.2" />
          <text x="5" y="14" font-family="monospace" font-size="10" font-weight="bold" fill="#072E29">Z=${el.z}</text>
          <text x="${cellW - 5}" y="14" font-family="monospace" font-size="9" text-anchor="end" fill="#0E6B5E">${v.valenceElectrons}e⁻</text>
          <text x="${cellW / 2}" y="39" font-family="sans-serif" font-size="19" font-weight="bold" text-anchor="middle" fill="#072E29">${el.symbol}</text>
          <text x="${cellW / 2}" y="53" font-family="sans-serif" font-size="9" text-anchor="middle" fill="#1E293B">${el.name}</text>
          <text x="${cellW / 2}" y="67" font-family="monospace" font-size="8.5" text-anchor="middle" fill="#475569">${el.mass} u</text>
        </g>
      `;
    });

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <rect width="100%" height="100%" fill="#FAF6EE" />
  <text x="${svgWidth / 2}" y="42" font-family="sans-serif" font-size="25" font-weight="bold" text-anchor="middle" fill="#072E29">
    MODERN PERIODIC TABLE OF THE ELEMENTS (IUPAC 1–118) — ATOMIC MASS &amp; VALENCE ELECTRONS
  </text>
  <text x="${svgWidth / 2}" y="68" font-family="monospace" font-size="13" text-anchor="middle" fill="#0E6B5E">
    Atomic Number (Z) · Valence Electrons (e⁻) · Symbol · Element Name · Standard Atomic Mass (u)
  </text>
  ${cellsSvg}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NCERT_Periodic_Table_118_Valence_And_Mass.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(
      'Periodic Table SVG Downloaded!',
      'Includes Atomic Mass and Valence Electrons for all 118 elements.',
      'success'
    );
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-2xl overflow-visible shadow-sm">
      {/* TOP BAR: BLOCK FILTERS, SEARCH & POSTER DOWNLOAD */}
      <div className="p-3 bg-[#072E29] text-[#F5F0E6] border-b border-[#165248] rounded-t-2xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-bold">
            IUPAC 118-ELEMENT PERIODIC TABLE
          </span>
          <div className="flex items-center gap-1 bg-[#041E1A] p-0.5 rounded-lg border border-[#175249]">
            {(['ALL', 's', 'p', 'd', 'f'] as const).map(blk => (
              <button
                key={blk}
                type="button"
                onClick={() => setPtBlockFilter(blk)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                  ptBlockFilter === blk
                    ? 'bg-emerald-500 text-[#041E1A]'
                    : 'text-[#9CC5BE] hover:text-white'
                }`}
              >
                {blk === 'ALL' ? 'All 118' : `${blk}-block`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={ptSearch}
            onChange={e => setPtSearch(e.target.value)}
            placeholder="Search Na, Au, Fe, 11..."
            className="px-2.5 py-1 text-xs bg-[#041E1A] text-white border border-[#236B60] rounded-lg w-40 sm:w-48 focus:outline-none focus:border-amber-400"
          />

          <button
            type="button"
            onClick={handleDownloadPosterSVG}
            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#072E29] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <StreamlineIcon name="print" className="w-3.5 h-3.5" /> Download Poster (.SVG)
          </button>
        </div>
      </div>

      {/* FULL-WIDTH 18-COLUMN PERIODIC TABLE WITH EMBEDDED CENTER INSPECTOR + STICKY BOTTOM BAR */}
      <div className="p-3.5 space-y-2.5 bg-[#FAF7F0] rounded-b-2xl relative">
        {/* CATEGORY FILTER PILLS */}
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setPtCategoryFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                ptCategoryFilter === 'ALL'
                  ? 'bg-[#0A4D44] text-white'
                  : 'bg-[#EAE2D3] text-[#4A443B]'
              }`}
            >
              All Categories
            </button>
            {(Object.keys(CATEGORY_COLORS) as PeriodicElement118['category'][]).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setPtCategoryFilter(prev => (prev === cat ? 'ALL' : cat))}
                className={`px-2 py-0.5 rounded text-[10px] font-medium border transition cursor-pointer ${
                  CATEGORY_COLORS[cat].bg
                } ${CATEGORY_COLORS[cat].border} ${CATEGORY_COLORS[cat].text} ${
                  ptCategoryFilter === cat ? 'ring-2 ring-[#0A4D44] font-bold' : 'opacity-85'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-mono text-[#0E6B5E] font-bold">
            Click any element tile to view Atomic Mass, Valence e⁻ &amp; Shell Structure in place
          </span>
        </div>

        {/* 18-COLUMN PERIODIC TABLE GRID WITH EMBEDDED CENTER INSPECTOR (PERIODS 1-3, GROUPS 3-12) */}
        <div className="overflow-x-auto pb-1">
          <div className="min-w-[860px] space-y-1">
            <div className="grid grid-cols-18 gap-1">
              {Array.from({ length: 7 }, (_, pIdx) => pIdx + 1).map(period =>
                Array.from({ length: 18 }, (_, gIdx) => gIdx + 1).map(group => {
                  // Embed the Live Selected Element Inspector directly inside the empty valley (Periods 1–3, Groups 3–12)
                  if (period === 1 && group === 3) {
                    return (
                      <div
                        key="embedded-center-inspector"
                        style={{ gridColumn: '3 / span 10', gridRow: '1 / span 3' }}
                        className="bg-[#072E29] text-[#F5F0E6] border-2 border-[#165248] rounded-xl p-3 flex items-center justify-between gap-3 shadow-md z-10"
                      >
                        {/* Left: Selected Element Tile + Name & Category */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-between p-1.5 shrink-0 shadow ${
                              CATEGORY_COLORS[selectedElement.category].bg
                            } ${CATEGORY_COLORS[selectedElement.category].border} ${
                              CATEGORY_COLORS[selectedElement.category].text
                            }`}
                          >
                            <div className="w-full flex items-center justify-between text-[9px] font-mono font-bold leading-none">
                              <span>Z={selectedElement.z}</span>
                              <span>{selectedValenceInfo.valenceElectrons}e⁻</span>
                            </div>
                            <span className="text-2xl font-extrabold leading-none">
                              {selectedElement.symbol}
                            </span>
                            <span className="text-[9px] font-mono font-bold leading-none">
                              {selectedElement.mass} u
                            </span>
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9.5px] font-bold">
                                {selectedElement.category}
                              </span>
                              <span className="text-[10px] font-mono text-amber-300 font-bold">
                                Group {selectedElement.group} · Period {selectedElement.period} ({selectedElement.block}-block)
                              </span>
                            </div>
                            <h3 className="text-base font-extrabold text-white truncate">
                              {selectedElement.name} ({selectedElement.symbol})
                            </h3>
                            <p className="text-[10.5px] text-[#B6DBD4] line-clamp-1">
                              {selectedValenceInfo.reactivitySummary}
                            </p>
                          </div>
                        </div>

                        {/* Center: 4 Key Metrics (Atomic Mass, Valence e⁻, Config, Shells) */}
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] shrink-0">
                          <div className="px-2.5 py-1.5 rounded-lg bg-[#041E1A] border border-[#1B574D]">
                            <span className="text-[8.5px] text-[#8AB8AF] block">ATOMIC MASS</span>
                            <strong className="text-xs text-amber-300">{selectedElement.mass} u</strong>
                          </div>
                          <div className="px-2.5 py-1.5 rounded-lg bg-[#041E1A] border border-emerald-500/40">
                            <span className="text-[8.5px] text-emerald-300 font-bold block">
                              VALENCE ELECTRONS
                            </span>
                            <strong className="text-xs text-white">
                              {selectedValenceInfo.valenceElectrons} e⁻ (Val: {selectedValenceInfo.valencyText.split(' ')[0]})
                            </strong>
                          </div>
                          <div className="px-2.5 py-1.5 rounded-lg bg-[#041E1A] border border-[#1B574D]">
                            <span className="text-[8.5px] text-[#8AB8AF] block">ELECTRON CONFIG</span>
                            <strong className="text-[10.5px] text-[#7DD3FC]">{selectedElement.config}</strong>
                          </div>
                          <div className="px-2.5 py-1.5 rounded-lg bg-[#041E1A] border border-[#1B574D]">
                            <span className="text-[8.5px] text-[#8AB8AF] block">BOHR SHELLS</span>
                            <strong className="text-[10.5px] text-[#FDE68A]">
                              [{selectedValenceInfo.shells.join(', ')}]
                            </strong>
                          </div>
                        </div>

                        {/* Right: Live Bohr Valence Shell SVG Diagram */}
                        <div className="hidden md:flex flex-col items-center justify-center bg-[#041E1A] border border-[#1B574D] rounded-xl p-1.5 shrink-0">
                          <svg viewBox="0 0 90 90" className="w-16 h-16">
                            <circle
                              cx="45"
                              cy="45"
                              r="18"
                              fill="none"
                              stroke="#1E5B50"
                              strokeDasharray="2 2"
                              strokeWidth="1.2"
                            />
                            <circle
                              cx="45"
                              cy="45"
                              r="31"
                              fill="none"
                              stroke="#34D399"
                              strokeWidth="1.6"
                            />
                            <circle
                              cx="45"
                              cy="45"
                              r="11"
                              fill="#0F4A42"
                              stroke="#FBBF24"
                              strokeWidth="1.2"
                            />
                            <text
                              x="45"
                              y="48"
                              textAnchor="middle"
                              fill="#FDE68A"
                              fontSize="9.5"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              {selectedElement.symbol}
                            </text>
                            {Array.from({ length: selectedValenceInfo.valenceElectrons }).map(
                              (_, idx) => {
                                const angle =
                                  (idx * 2 * Math.PI) / selectedValenceInfo.valenceElectrons -
                                  Math.PI / 2;
                                const ex = 45 + 31 * Math.cos(angle);
                                const ey = 45 + 31 * Math.sin(angle);
                                return (
                                  <circle
                                    key={idx}
                                    cx={ex}
                                    cy={ey}
                                    r="3.3"
                                    fill="#FBBF24"
                                    stroke="#041E1A"
                                    strokeWidth="0.8"
                                  />
                                );
                              }
                            )}
                          </svg>
                          <span className="text-[8.5px] font-mono text-amber-300">
                            Ox: {selectedValenceInfo.oxidationStates}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Skip grid cells covered by the 10x3 embedded center inspector (Periods 1–3, Groups 3–12)
                  if (period <= 3 && group >= 3 && group <= 12) {
                    return null;
                  }

                  const el = FULL_118_PERIODIC_TABLE.find(
                    item => item.period === period && item.group === group
                  );
                  if (!el) {
                    if (period === 6 && group === 3) {
                      return (
                        <div
                          key={`${period}-${group}`}
                          className="h-10 rounded bg-pink-50 border border-pink-300 flex flex-col items-center justify-center text-[8px] font-mono text-pink-900 font-bold"
                        >
                          <span>57–71</span>
                          <span>La–Lu</span>
                        </div>
                      );
                    }
                    if (period === 7 && group === 3) {
                      return (
                        <div
                          key={`${period}-${group}`}
                          className="h-10 rounded bg-indigo-50 border border-indigo-300 flex flex-col items-center justify-center text-[8px] font-mono text-indigo-900 font-bold"
                        >
                          <span>89–103</span>
                          <span>Ac–Lr</span>
                        </div>
                      );
                    }
                    return <div key={`${period}-${group}`} className="h-10" />;
                  }

                  const matchesCat =
                    ptCategoryFilter === 'ALL' || el.category === ptCategoryFilter;
                  const matchesBlk = ptBlockFilter === 'ALL' || el.block === ptBlockFilter;
                  const matchesSearch =
                    !ptSearch.trim() ||
                    el.name.toLowerCase().includes(ptSearch.toLowerCase()) ||
                    el.symbol.toLowerCase().includes(ptSearch.toLowerCase()) ||
                    String(el.z) === ptSearch.trim();
                  const active = matchesCat && matchesBlk && matchesSearch;
                  const cStyle = CATEGORY_COLORS[el.category];
                  const vElectrons = getElementValenceDetails(el).valenceElectrons;

                  return (
                    <button
                      key={el.z}
                      type="button"
                      onClick={() => {
                        playUISound('click');
                        setSelectedElement(el);
                      }}
                      title={`${el.name} (${el.symbol}) • Mass: ${el.mass} u • Valence e⁻: ${vElectrons}`}
                      className={`h-10 p-1 rounded border text-left transition flex flex-col justify-between select-none cursor-pointer ${
                        cStyle.bg
                      } ${cStyle.border} ${cStyle.text} ${
                        selectedElement.z === el.z
                          ? 'ring-2 ring-[#072E29] scale-110 z-20 shadow-md'
                          : 'hover:scale-105'
                      } ${active ? 'opacity-100' : 'opacity-20'}`}
                    >
                      <div className="flex items-center justify-between text-[7.5px] font-mono leading-none w-full">
                        <span className="font-bold">{el.z}</span>
                        <span className="opacity-75">{vElectrons}e⁻</span>
                      </div>
                      <div className="text-xs font-extrabold text-center leading-none w-full">
                        {el.symbol}
                      </div>
                      <div className="text-[7px] font-mono text-center truncate leading-none opacity-85 w-full">
                        {el.mass}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Lanthanides & Actinides Rows */}
            <div className="pt-1.5 space-y-1">
              {[
                { period: 8, label: 'Lanthanides (57–71)' },
                { period: 9, label: 'Actinides (89–103)' }
              ].map(rowInfo => (
                <div key={rowInfo.period} className="grid grid-cols-18 gap-1 items-center">
                  <div className="col-span-3 text-[9.5px] font-mono font-bold text-[#0A4D44] pr-1.5 text-right">
                    {rowInfo.label}
                  </div>
                  {FULL_118_PERIODIC_TABLE.filter(e => e.period === rowInfo.period).map(el => {
                    const cStyle = CATEGORY_COLORS[el.category];
                    const vElectrons = getElementValenceDetails(el).valenceElectrons;
                    return (
                      <button
                        key={el.z}
                        type="button"
                        onClick={() => {
                          playUISound('click');
                          setSelectedElement(el);
                        }}
                        title={`${el.name} (${el.symbol}) • Mass: ${el.mass} u • Valence e⁻: ${vElectrons}`}
                        className={`h-10 p-1 rounded border text-left transition flex flex-col justify-between select-none cursor-pointer ${
                          cStyle.bg
                        } ${cStyle.border} ${cStyle.text} ${
                          selectedElement.z === el.z
                            ? 'ring-2 ring-[#072E29] scale-110 z-20 shadow-md'
                            : 'hover:scale-105'
                        }`}
                      >
                        <div className="flex justify-between text-[7px] font-mono leading-none w-full">
                          <span className="font-bold">{el.z}</span>
                          <span>{vElectrons}e⁻</span>
                        </div>
                        <div className="text-xs font-extrabold text-center leading-none w-full">
                          {el.symbol}
                        </div>
                        <div className="text-[6.5px] font-mono text-center truncate leading-none w-full">
                          {el.mass}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM SELECTED ELEMENT LIVE DOCK (SO CLICKING ANY ELEMENT IN LOWER ROWS DISPLAYS ALL DATA IMMEDIATELY IN VIEW WITHOUT SCROLLING UP) */}
        <div className="sticky bottom-2 z-30 bg-[#072E29]/95 backdrop-blur-md text-[#F5F0E6] border-2 border-amber-400/70 rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`w-10 h-10 rounded-lg border flex flex-col items-center justify-center font-mono font-extrabold text-sm shrink-0 ${
                CATEGORY_COLORS[selectedElement.category].bg
              } ${CATEGORY_COLORS[selectedElement.category].border} ${
                CATEGORY_COLORS[selectedElement.category].text
              }`}
            >
              {selectedElement.symbol}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <strong className="text-white font-bold text-sm">
                  #{selectedElement.z} {selectedElement.name} ({selectedElement.symbol})
                </strong>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  {selectedElement.category}
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  Oxidation: {selectedValenceInfo.oxidationStates}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[#B6DBD4] mt-0.5">
                <span>
                  Atomic Mass: <strong className="text-amber-300">{selectedElement.mass} u</strong>
                </span>
                <span>·</span>
                <span>
                  Valence e⁻:{' '}
                  <strong className="text-emerald-300">
                    {selectedValenceInfo.valenceElectrons} e⁻
                  </strong>
                </span>
                <span>·</span>
                <span>
                  Valency: <strong className="text-white">{selectedValenceInfo.valencyText}</strong>
                </span>
                <span>·</span>
                <span>
                  Config: <strong className="text-sky-300">{selectedElement.config}</strong>
                </span>
                <span>·</span>
                <span>
                  Shells:{' '}
                  <strong className="text-amber-200">
                    [{selectedValenceInfo.shells.join(', ')}]
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
