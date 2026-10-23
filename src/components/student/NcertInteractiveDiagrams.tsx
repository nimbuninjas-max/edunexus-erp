import React from 'react';

export interface DiagramVisualProps {
  chapterId: string;
  activeFormulaIdx?: number;
  // Optional live parameters from solver
  params?: {
    principalP?: number;
    rateR?: number;
    timeT?: number;
    quadA?: number;
    quadB?: number;
    quadC?: number;
    apFirst?: number;
    apDiff?: number;
    apN?: number;
    calcCoeffA?: number;
    calcPowerN?: number;
    calcEvalX?: number;
    mat2x2?: [number, number, number, number];
  };
}

/**
 * High-precision SVG Scientific, Geometric, Optical, Electrical & Calculus Diagrams
 * mapped to every NCERT Class 7–12 chapter and scientific principle.
 */
export const NcertInteractiveDiagram: React.FC<DiagramVisualProps> = ({
  chapterId,
  params
}) => {
  const P = params?.principalP ?? 10000;
  const R = params?.rateR ?? 10;
  const T = params?.timeT ?? 3;

  const renderDiagramContent = () => {
    switch (chapterId) {
      // ======================================================================
      // CLASS 7 DIAGRAMS
      // ======================================================================
      case 'c7-ch1': // Unitary Method, Ratio & Proportion
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>SCHEMATIC: UNITARY BAR MODEL (1 UNIT → N UNITS)</span>
              <span>a : b :: c : d</span>
            </div>
            <svg viewBox="0 0 420 200" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Grid lines */}
              <g stroke="#123832" strokeWidth="1">
                <line x1="0" y1="50" x2="420" y2="50" />
                <line x1="0" y1="100" x2="420" y2="100" />
                <line x1="0" y1="150" x2="420" y2="150" />
              </g>
              {/* Given Total Bar (e.g. 6 units = 180) */}
              <text x="20" y="28" fill="#9CC5BE" fontSize="10" fontFamily="monospace">
                STEP 1: GIVEN N₁ UNITS (DIVIDE TO ISOLATE 1 UNIT)
              </text>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <g key={i} transform={`translate(${20 + i * 60}, 36)`}>
                  <rect
                    width="56"
                    height="30"
                    rx="4"
                    fill={i === 0 ? '#10B981' : '#134E4A'}
                    stroke={i === 0 ? '#6EE7B7' : '#2DD4BF'}
                    strokeWidth="1.5"
                  />
                  <text x="28" y="19" textAnchor="middle" fill="#F5F0E6" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    {i === 0 ? '1 Unit = ₹30' : '₹30'}
                  </text>
                </g>
              ))}
              {/* Arrow down to Step 2 */}
              <path d="M 48 70 L 48 102 L 90 102" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 2" />
              <polygon points="90,98 98,102 90,106" fill="#FBBF24" />
              <text x="105" y="105" fill="#FBBF24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                1 Unit = Total ÷ N₁ = 180 ÷ 6 = ₹30
              </text>

              {/* Step 2: Multiply by Target N2 */}
              <text x="20" y="132" fill="#9CC5BE" fontSize="10" fontFamily="monospace">
                STEP 2: MULTIPLY 1 UNIT BY REQUIRED UNITS (N₂ = 4)
              </text>
              {[0, 1, 2, 3].map(i => (
                <g key={i} transform={`translate(${20 + i * 60}, 140)`}>
                  <rect width="56" height="30" rx="4" fill="#D97706" stroke="#FDE68A" strokeWidth="1.5" />
                  <text x="28" y="19" textAnchor="middle" fill="#FFFBEB" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    ₹30
                  </text>
                </g>
              ))}
              <text x="275" y="160" fill="#FDE68A" fontSize="12" fontFamily="monospace" fontWeight="bold">
                = 4 × ₹30 = ₹120
              </text>
            </svg>
          </div>
        );

      case 'c7-ch2': // Simple Interest, Profit & Loss
      case 'c8-ch1': { // Compound Interest vs Simple Interest
        const siVal = (P * R * T) / 100;
        const ciVal = P * Math.pow(1 + R / 100, T) - P;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>DIAGRAM: COMPOUND (EXPONENTIAL) vs SIMPLE (LINEAR) GROWTH</span>
              <span>CI − SI = ₹{(ciVal - siVal).toFixed(0)}</span>
            </div>
            <svg viewBox="0 0 420 210" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Axes */}
              <line x1="45" y1="175" x2="395" y2="175" stroke="#5E8C83" strokeWidth="1.5" />
              <line x1="45" y1="20" x2="45" y2="175" stroke="#5E8C83" strokeWidth="1.5" />
              <text x="215" y="196" textAnchor="middle" fill="#9CC5BE" fontSize="10" fontFamily="monospace">
                Time (Years t = 0 → {T} yrs)
              </text>
              <text x="15" y="100" textAnchor="middle" fill="#9CC5BE" fontSize="10" fontFamily="monospace" transform="rotate(-90 15 100)">
                Amount (₹)
              </text>

              {/* Principal Baseline */}
              <line x1="45" y1="140" x2="380" y2="140" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" />
              <text x="382" y="143" fill="#38BDF8" fontSize="9" fontFamily="monospace">P</text>

              {/* Shaded CI - SI Gap */}
              <path
                d="M 45 140 L 150 112 L 260 84 L 365 56 L 365 28 Q 220 75 45 140 Z"
                fill="rgba(245, 158, 11, 0.22)"
              />

              {/* Linear SI Line: A = P(1 + RT/100) */}
              <path d="M 45 140 L 365 56" fill="none" stroke="#34D399" strokeWidth="2.5" />
              <circle cx="365" cy="56" r="4" fill="#34D399" />
              <text x="275" y="78" fill="#34D399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                SI Linear: A = P + PRT/100
              </text>

              {/* Exponential CI Curve: A = P(1 + R/100)^n */}
              <path d="M 45 140 Q 220 75 365 26" fill="none" stroke="#FBBF24" strokeWidth="2.5" />
              <circle cx="365" cy="26" r="4.5" fill="#FBBF24" />
              <text x="160" y="36" fill="#FBBF24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                CI Curve: A = P(1 + R/100)ⁿ
              </text>

              {/* Bracket showing CI - SI */}
              <line x1="373" y1="26" x2="373" y2="56" stroke="#F87171" strokeWidth="2" />
              <text x="378" y="44" fill="#FCA5A5" fontSize="9" fontFamily="monospace" fontWeight="bold">
                Δ(CI−SI)
              </text>
            </svg>
          </div>
        );
      }

      case 'c7-ch3': // Exponents & Powers
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>SCHEMATIC: LAWS OF EXPONENTS BLOCK COMBINATION</span>
              <span>aᵐ × aⁿ = aᵐ⁺ⁿ</span>
            </div>
            <svg viewBox="0 0 420 190" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              <text x="25" y="30" fill="#9CC5BE" fontSize="10" fontFamily="monospace">
                PRODUCT LAW: Combining m Factors and n Factors of Base &apos;a&apos;
              </text>
              {/* Group a^m */}
              <rect x="25" y="42" width="135" height="55" rx="6" fill="#0F3D36" stroke="#34D399" strokeWidth="1.5" />
              <text x="92" y="66" textAnchor="middle" fill="#6EE7B7" fontSize="14" fontFamily="monospace" fontWeight="bold">
                a × a × … × a
              </text>
              <text x="92" y="86" textAnchor="middle" fill="#A7F3D0" fontSize="10" fontFamily="monospace">
                m times (aᵐ)
              </text>

              <text x="176" y="75" textAnchor="middle" fill="#FBBF24" fontSize="18" fontFamily="monospace" fontWeight="bold">
                ×
              </text>

              {/* Group a^n */}
              <rect x="192" y="42" width="115" height="55" rx="6" fill="#1E3A5F" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="250" y="66" textAnchor="middle" fill="#7DD3FC" fontSize="14" fontFamily="monospace" fontWeight="bold">
                a × … × a
              </text>
              <text x="250" y="86" textAnchor="middle" fill="#BAE6FD" fontSize="10" fontFamily="monospace">
                n times (aⁿ)
              </text>

              <text x="322" y="75" textAnchor="middle" fill="#FBBF24" fontSize="18" fontFamily="monospace" fontWeight="bold">
                =
              </text>

              {/* Result a^(m+n) */}
              <rect x="338" y="42" width="65" height="55" rx="6" fill="#422006" stroke="#FBBF24" strokeWidth="1.5" />
              <text x="370" y="75" textAnchor="middle" fill="#FDE68A" fontSize="16" fontFamily="monospace" fontWeight="bold">
                aᵐ⁺ⁿ
              </text>

              {/* Bottom Quotient & Zero Law */}
              <rect x="25" y="115" width="378" height="54" rx="6" fill="#0D2E28" stroke="#22574E" />
              <text x="214" y="138" textAnchor="middle" fill="#F5F0E6" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Quotient: aᵐ ÷ aⁿ = aᵐ⁻ⁿ   |   Power of Power: (aᵐ)ⁿ = aᵐⁿ
              </text>
              <text x="214" y="157" textAnchor="middle" fill="#FBBF24" fontSize="11" fontFamily="monospace">
                Zero Power: a⁰ = 1 (a ≠ 0)   |   Negative Power: a⁻ⁿ = 1 / aⁿ
              </text>
            </svg>
          </div>
        );

      case 'c7-ch4': // Pythagoras & Circle 2D Mensuration
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>GEOMETRIC DIAGRAM: PYTHAGORAS THEOREM & CIRCLE AREA</span>
              <span>c² = a² + b² | A = πr²</span>
            </div>
            <svg viewBox="0 0 420 200" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Left: Right Triangle with Squares */}
              <polygon points="55,145 155,145 55,65" fill="rgba(16, 185, 129, 0.25)" stroke="#34D399" strokeWidth="2.5" />
              {/* Right angle box */}
              <polyline points="55,133 67,133 67,145" fill="none" stroke="#34D399" strokeWidth="1.5" />
              <text x="105" y="162" textAnchor="middle" fill="#6EE7B7" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Base (b = 4)
              </text>
              <text x="38" y="108" textAnchor="middle" fill="#6EE7B7" fontSize="11" fontFamily="monospace" fontWeight="bold" transform="rotate(-90 38 108)">
                Height (a = 3)
              </text>
              <text x="122" y="96" fill="#FBBF24" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Hypotenuse c = √(a²+b²) = 5
              </text>

              {/* Divider */}
              <line x1="225" y1="20" x2="225" y2="180" stroke="#184B42" strokeDasharray="3 3" />

              {/* Right: Circle Radius, Circumference & Area */}
              <circle cx="325" cy="95" r="55" fill="rgba(56, 189, 248, 0.15)" stroke="#38BDF8" strokeWidth="2.5" />
              <circle cx="325" cy="95" r="3.5" fill="#FBBF24" />
              <line x1="325" y1="95" x2="380" y2="95" stroke="#FBBF24" strokeWidth="2" />
              <text x="352" y="88" textAnchor="middle" fill="#FDE68A" fontSize="11" fontFamily="monospace" fontWeight="bold">
                r
              </text>
              <text x="325" y="168" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="monospace" fontWeight="bold">
                C = 2πr  |  Area = πr²
              </text>
            </svg>
          </div>
        );

      case 'c8-ch2': // Direct & Inverse Proportion + Time & Work
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>DIAGRAM: DIRECT (x/y = k) vs INVERSE PROPORTION (x·y = k)</span>
              <span>Work = 1/x + 1/y</span>
            </div>
            <svg viewBox="0 0 420 195" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Left Plot: Direct Proportion */}
              <line x1="35" y1="155" x2="185" y2="155" stroke="#5E8C83" strokeWidth="1.5" />
              <line x1="35" y1="30" x2="35" y2="155" stroke="#5E8C83" strokeWidth="1.5" />
              <line x1="35" y1="155" x2="170" y2="40" stroke="#34D399" strokeWidth="2.5" />
              <circle cx="80" cy="117" r="3.5" fill="#FBBF24" />
              <circle cx="135" cy="70" r="3.5" fill="#FBBF24" />
              <text x="110" y="25" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                DIRECT: x₁/y₁ = x₂/y₂
              </text>
              <text x="110" y="176" textAnchor="middle" fill="#9CC5BE" fontSize="9.5" fontFamily="monospace">
                Linear Growth (y = kx)
              </text>

              {/* Right Plot: Inverse Proportion Hyperbola */}
              <line x1="235" y1="155" x2="395" y2="155" stroke="#5E8C83" strokeWidth="1.5" />
              <line x1="235" y1="30" x2="235" y2="155" stroke="#5E8C83" strokeWidth="1.5" />
              <path d="M 250 40 Q 265 135 380 145" fill="none" stroke="#F472B6" strokeWidth="2.5" />
              <circle cx="262" cy="75" r="3.5" fill="#38BDF8" />
              <circle cx="325" cy="133" r="3.5" fill="#38BDF8" />
              <text x="315" y="25" textAnchor="middle" fill="#F472B6" fontSize="10" fontFamily="monospace" fontWeight="bold">
                INVERSE: x₁·y₁ = x₂·y₂
              </text>
              <text x="315" y="176" textAnchor="middle" fill="#9CC5BE" fontSize="9.5" fontFamily="monospace">
                Hyperbola (y = k / x)
              </text>
            </svg>
          </div>
        );

      case 'c8-ch3': // Algebraic Identities (a+b)^2 Geometric Proof
      case 'c9-ch1':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>GEOMETRIC PROOF: (a + b)² = a² + 2ab + b²</span>
              <span>IDENTITY VISUALIZER</span>
            </div>
            <svg viewBox="0 0 420 205" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Square of side (a+b) */}
              {/* a x a square */}
              <rect x="45" y="25" width="95" height="95" fill="rgba(16, 185, 129, 0.3)" stroke="#34D399" strokeWidth="2" />
              <text x="92" y="77" textAnchor="middle" fill="#6EE7B7" fontSize="16" fontFamily="monospace" fontWeight="bold">
                a²
              </text>
              {/* a x b top-right rectangle */}
              <rect x="140" y="25" width="55" height="95" fill="rgba(251, 191, 36, 0.28)" stroke="#FBBF24" strokeWidth="2" />
              <text x="167" y="77" textAnchor="middle" fill="#FDE68A" fontSize="14" fontFamily="monospace" fontWeight="bold">
                a·b
              </text>
              {/* b x a bottom-left rectangle */}
              <rect x="45" y="120" width="95" height="55" fill="rgba(251, 191, 36, 0.28)" stroke="#FBBF24" strokeWidth="2" />
              <text x="92" y="152" textAnchor="middle" fill="#FDE68A" fontSize="14" fontFamily="monospace" fontWeight="bold">
                a·b
              </text>
              {/* b x b bottom-right square */}
              <rect x="140" y="120" width="55" height="55" fill="rgba(56, 189, 248, 0.3)" stroke="#38BDF8" strokeWidth="2" />
              <text x="167" y="152" textAnchor="middle" fill="#7DD3FC" fontSize="14" fontFamily="monospace" fontWeight="bold">
                b²
              </text>

              {/* Dimension labels */}
              <text x="92" y="18" textAnchor="middle" fill="#6EE7B7" fontSize="11" fontFamily="monospace" fontWeight="bold">a</text>
              <text x="167" y="18" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontFamily="monospace" fontWeight="bold">b</text>
              <text x="32" y="75" textAnchor="middle" fill="#6EE7B7" fontSize="11" fontFamily="monospace" fontWeight="bold">a</text>
              <text x="32" y="150" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontFamily="monospace" fontWeight="bold">b</text>

              {/* Right Explanation */}
              <g transform="translate(220, 40)" fontFamily="monospace">
                <text x="0" y="18" fill="#F5F0E6" fontSize="12" fontWeight="bold">Total Square Area:</text>
                <text x="0" y="42" fill="#34D399" fontSize="12">(a + b)² = a² + ab + ab + b²</text>
                <text x="0" y="64" fill="#FBBF24" fontSize="13" fontWeight="bold">(a + b)² = a² + 2ab + b²</text>
                <line x1="0" y1="80" x2="180" y2="80" stroke="#1E5248" />
                <text x="0" y="102" fill="#7DD3FC" fontSize="11">a² − b² = (a + b)(a − b)</text>
                <text x="0" y="124" fill="#F472B6" fontSize="11">(a + b)³ = a³ + b³ + 3ab(a+b)</text>
              </g>
            </svg>
          </div>
        );

      case 'c8-ch4': // 3D Mensuration: Cylinder, Cone, Sphere
      case 'c9-ch2':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>3D SOLID GEOMETRY: CYLINDER, CONE & SPHERE</span>
              <span>CSA, TSA & VOLUME</span>
            </div>
            <svg viewBox="0 0 420 200" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* 1. Cylinder */}
              <ellipse cx="75" cy="45" rx="40" ry="14" fill="rgba(16,185,129,0.2)" stroke="#34D399" strokeWidth="2" />
              <line x1="35" y1="45" x2="35" y2="140" stroke="#34D399" strokeWidth="2" />
              <line x1="115" y1="45" x2="115" y2="140" stroke="#34D399" strokeWidth="2" />
              <ellipse cx="75" cy="140" rx="40" ry="14" fill="rgba(16,185,129,0.25)" stroke="#34D399" strokeWidth="2" />
              <line x1="75" y1="45" x2="75" y2="140" stroke="#FBBF24" strokeDasharray="3 3" strokeWidth="1.5" />
              <line x1="75" y1="140" x2="115" y2="140" stroke="#FBBF24" strokeWidth="2" />
              <text x="84" y="96" fill="#FDE68A" fontSize="10" fontFamily="monospace">h</text>
              <text x="95" y="135" fill="#FDE68A" fontSize="10" fontFamily="monospace">r</text>
              <text x="75" y="175" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Cylinder: V = πr²h
              </text>

              {/* 2. Right Circular Cone */}
              <polygon points="215,35 170,140 260,140" fill="rgba(56,189,248,0.18)" stroke="#38BDF8" strokeWidth="2" />
              <ellipse cx="215" cy="140" rx="45" ry="14" fill="rgba(56,189,248,0.25)" stroke="#38BDF8" strokeWidth="2" />
              <line x1="215" y1="35" x2="215" y2="140" stroke="#FBBF24" strokeDasharray="3 3" strokeWidth="1.5" />
              <line x1="215" y1="140" x2="260" y2="140" stroke="#FBBF24" strokeWidth="2" />
              <text x="204" y="96" fill="#FDE68A" fontSize="10" fontFamily="monospace">h</text>
              <text x="235" y="135" fill="#FDE68A" fontSize="10" fontFamily="monospace">r</text>
              <text x="248" y="85" fill="#7DD3FC" fontSize="10" fontFamily="monospace" fontWeight="bold">l=√(r²+h²)</text>
              <text x="215" y="175" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Cone: V = ⅓πr²h
              </text>

              {/* 3. Sphere */}
              <circle cx="350" cy="92" r="48" fill="rgba(244,114,182,0.18)" stroke="#F472B6" strokeWidth="2" />
              <ellipse cx="350" cy="92" rx="48" ry="15" fill="none" stroke="#F472B6" strokeDasharray="4 3" strokeWidth="1.5" />
              <line x1="350" y1="92" x2="398" y2="92" stroke="#FBBF24" strokeWidth="2" />
              <text x="374" y="85" fill="#FDE68A" fontSize="10" fontFamily="monospace">r</text>
              <text x="350" y="175" textAnchor="middle" fill="#F472B6" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Sphere: V = (4/3)πr³
              </text>
            </svg>
          </div>
        );

      case 'c9-ch3': // Circles, Cyclic Quad & Mid-Point Theorem
      case 'c10-ch4':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>CIRCLE GEOMETRY: SECTOR, SEGMENT & SUBTENDED ANGLE</span>
              <span>Arc = (θ/360)2πr</span>
            </div>
            <svg viewBox="0 0 420 200" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Left: Sector & Segment */}
              <circle cx="105" cy="100" r="65" fill="none" stroke="#38BDF8" strokeWidth="2" />
              {/* Sector Wedge */}
              <path d="M 105 100 L 161 67 A 65 65 0 0 1 161 133 Z" fill="rgba(16,185,129,0.3)" stroke="#34D399" strokeWidth="2" />
              {/* Chord for Segment */}
              <line x1="161" y1="67" x2="161" y2="133" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 2" />
              <text x="128" y="104" fill="#FDE68A" fontSize="11" fontFamily="monospace" fontWeight="bold">θ</text>
              <text x="105" y="182" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Sector = (θ/360°)πr²
              </text>

              {/* Right: Subtended Angle Theorem ∠AOB = 2∠ACB */}
              <circle cx="310" cy="100" r="65" fill="none" stroke="#F472B6" strokeWidth="2" />
              <circle cx="310" cy="100" r="3.5" fill="#FBBF24" />
              {/* Points A(260, 142), B(360, 142), C(310, 35) */}
              <polygon points="310,35 260,142 310,100 360,142" fill="rgba(244,114,182,0.15)" stroke="#F472B6" strokeWidth="1.8" />
              <line x1="260" y1="142" x2="310" y2="100" stroke="#FBBF24" strokeWidth="2" />
              <line x1="360" y1="142" x2="310" y2="100" stroke="#FBBF24" strokeWidth="2" />
              <text x="310" y="65" textAnchor="middle" fill="#F9A8D4" fontSize="10" fontFamily="monospace" fontWeight="bold">θ</text>
              <text x="310" y="122" textAnchor="middle" fill="#FDE68A" fontSize="11" fontFamily="monospace" fontWeight="bold">2θ</text>
              <text x="310" y="182" textAnchor="middle" fill="#F9A8D4" fontSize="10" fontFamily="monospace" fontWeight="bold">
                ∠Centre (2θ) = 2 × ∠Arc (θ)
              </text>
            </svg>
          </div>
        );

      case 'c10-ch1': // Linear Equations Graph & Polynomial Zeroes
      case 'c10-ch2': { // Quadratic Parabola & Roots + AP
        const a = params?.quadA ?? 2;
        const b = params?.quadB ?? -7;
        const c = params?.quadC ?? 3;
        const D = b * b - 4 * a * c;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>PARABOLA LOCUS: y = ax² + bx + c & ROOTS (α, β)</span>
              <span>D = b² − 4ac = {D}</span>
            </div>
            <svg viewBox="0 0 420 205" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Coordinate Axes */}
              <line x1="30" y1="115" x2="390" y2="115" stroke="#5E8C83" strokeWidth="1.5" />
              <line x1="140" y1="15" x2="140" y2="190" stroke="#5E8C83" strokeWidth="1.5" />
              <text x="380" y="130" fill="#9CC5BE" fontSize="10" fontFamily="monospace">X</text>
              <text x="148" y="25" fill="#9CC5BE" fontSize="10" fontFamily="monospace">Y</text>

              {/* Quadratic Parabola Curve */}
              <path
                d="M 110 25 Q 210 225 310 25"
                fill="none"
                stroke="#34D399"
                strokeWidth="3"
              />

              {/* Roots alpha and beta on X-axis */}
              <circle cx="155" cy="115" r="5" fill="#FBBF24" stroke="#07221E" strokeWidth="1.5" />
              <circle cx="265" cy="115" r="5" fill="#FBBF24" stroke="#07221E" strokeWidth="1.5" />
              <text x="155" y="104" textAnchor="middle" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Root α
              </text>
              <text x="265" y="104" textAnchor="middle" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Root β
              </text>

              {/* Vertex (-b/2a, -D/4a) */}
              <circle cx="210" cy="175" r="4.5" fill="#38BDF8" />
              <text x="210" y="193" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Vertex (−b/2a, −D/4a)
              </text>

              {/* Formula Overlay Box */}
              <rect x="255" y="18" width="150" height="58" rx="6" fill="#0B332C" stroke="#1E5B50" />
              <text x="330" y="36" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                x = (−b ± √D) / 2a
              </text>
              <text x="330" y="52" textAnchor="middle" fill="#FDE68A" fontSize="9.5" fontFamily="monospace">
                α + β = −b/a | αβ = c/a
              </text>
              <text x="330" y="67" textAnchor="middle" fill="#9CC5BE" fontSize="9" fontFamily="monospace">
                {D > 0 ? 'D > 0: 2 Real Roots' : D === 0 ? 'D = 0: Equal Roots' : 'D < 0: Complex Roots'}
              </text>
            </svg>
          </div>
        );
      }

      case 'c10-ch3': // Trigonometry & BPT Theorem
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>TRIGONOMETRY & THALES BPT DIAGRAM</span>
              <span>sin²θ + cos²θ = 1</span>
            </div>
            <svg viewBox="0 0 420 200" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Left: Right Triangle Trig Ratios */}
              <polygon points="35,155 175,155 175,45" fill="rgba(16,185,129,0.22)" stroke="#34D399" strokeWidth="2.5" />
              <polyline points="161,155 161,141 175,141" fill="none" stroke="#34D399" strokeWidth="1.5" />
              <path d="M 65 155 A 30 30 0 0 0 58 136" fill="none" stroke="#FBBF24" strokeWidth="2" />
              <text x="74" y="148" fill="#FDE68A" fontSize="12" fontFamily="monospace" fontWeight="bold">θ</text>
              <text x="105" y="172" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Adjacent / Base (B)
              </text>
              <text x="192" y="105" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold" transform="rotate(90 192 105)">
                Opposite (P)
              </text>
              <text x="90" y="90" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Hypotenuse (H)
              </text>

              {/* Right: Thales BPT Triangle (DE || BC) */}
              <polygon points="315,35 250,155 380,155" fill="rgba(56,189,248,0.18)" stroke="#38BDF8" strokeWidth="2" />
              <line x1="276" y1="105" x2="354" y2="105" stroke="#FBBF24" strokeWidth="2.5" />
              <text x="315" y="27" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
              <text x="264" y="106" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">D</text>
              <text x="360" y="106" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">E</text>
              <text x="238" y="160" fill="#7DD3FC" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
              <text x="386" y="160" fill="#7DD3FC" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
              <text x="315" y="178" textAnchor="middle" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                DE ∥ BC ⇒ AD/DB = AE/EC
              </text>
            </svg>
          </div>
        );

      case 'c10-ch5': // Class 10 Science Numericals: Ohm's Law Circuit & Convex Lens Ray Diagram
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>PHYSICS SCHEMATIC: OHM&apos;S LAW CIRCUIT & CONVEX LENS RAY TRACE</span>
              <span>V = I·R | 1/v − 1/u = 1/f</span>
            </div>
            <svg viewBox="0 0 420 205" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Left: Ohm's Law Circuit Diagram */}
              <rect x="25" y="40" width="155" height="110" fill="none" stroke="#34D399" strokeWidth="2" />
              {/* Resistor Zigzag on Top */}
              <rect x="70" y="32" width="65" height="16" fill="#07221E" />
              <polyline
                points="70,40 78,32 88,48 98,32 108,48 118,32 128,48 135,40"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2.2"
              />
              <text x="102" y="25" textAnchor="middle" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                R (Ω)
              </text>
              {/* Ammeter on Right */}
              <circle cx="180" cy="95" r="13" fill="#0A3630" stroke="#38BDF8" strokeWidth="2" />
              <text x="180" y="99" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
              {/* Battery on Bottom */}
              <rect x="88" y="142" width="28" height="16" fill="#07221E" />
              <line x1="95" y1="138" x2="95" y2="162" stroke="#F472B6" strokeWidth="2.5" />
              <line x1="107" y1="143" x2="107" y2="157" stroke="#F472B6" strokeWidth="1.8" />
              <text x="102" y="176" textAnchor="middle" fill="#F9A8D4" fontSize="10" fontFamily="monospace" fontWeight="bold">
                V = I × R
              </text>

              {/* Divider */}
              <line x1="210" y1="18" x2="210" y2="188" stroke="#184B42" strokeDasharray="3 3" />

              {/* Right: Convex Lens Ray Diagram */}
              {/* Principal Axis */}
              <line x1="220" y1="100" x2="410" y2="100" stroke="#5E8C83" strokeWidth="1.5" />
              {/* Convex Lens */}
              <path d="M 315 40 Q 332 100 315 160 Q 298 100 315 40 Z" fill="rgba(56,189,248,0.25)" stroke="#38BDF8" strokeWidth="2" />
              {/* Object Arrow */}
              <line x1="245" y1="100" x2="245" y2="62" stroke="#34D399" strokeWidth="2.5" />
              <polygon points="241,65 245,56 249,65" fill="#34D399" />
              <text x="245" y="114" textAnchor="middle" fill="#6EE7B7" fontSize="9" fontFamily="monospace">u</text>

              {/* Ray 1: Parallel then through Focus F */}
              <polyline points="245,62 315,62 390,132" fill="none" stroke="#FBBF24" strokeWidth="1.8" />
              {/* Ray 2: Through Optical Centre O */}
              <line x1="245" y1="62" x2="390" y2="132" stroke="#F472B6" strokeWidth="1.8" />
              {/* Inverted Real Image */}
              <line x1="390" y1="100" x2="390" y2="132" stroke="#F87171" strokeWidth="2.5" />
              <text x="355" y="95" fill="#FDE68A" fontSize="9" fontFamily="monospace">F</text>
              <text x="315" y="180" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="monospace" fontWeight="bold">
                1/v − 1/u = 1/f | P = 1/f
              </text>
            </svg>
          </div>
        );

      case 'c11-ch1': // Unit Circle & Venn Diagram
      case 'c11-ch2': // Complex Argand Plane
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>UNIT CIRCLE TRIGONOMETRY & COMPLEX ARGAND PLANE</span>
              <span>z = r(cos θ + i sin θ) = r·eⁱᶿ</span>
            </div>
            <svg viewBox="0 0 420 200" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Unit Circle */}
              <line x1="30" y1="100" x2="210" y2="100" stroke="#5E8C83" strokeWidth="1.5" />
              <line x1="120" y1="15" x2="120" y2="185" stroke="#5E8C83" strokeWidth="1.5" />
              <circle cx="120" cy="100" r="65" fill="rgba(16,185,129,0.12)" stroke="#34D399" strokeWidth="2" />
              {/* Radius vector to P(cos θ, sin θ) */}
              <line x1="120" y1="100" x2="172" y2="61" stroke="#FBBF24" strokeWidth="2.5" />
              <line x1="172" y1="61" x2="172" y2="100" stroke="#38BDF8" strokeDasharray="3 2" strokeWidth="2" />
              <circle cx="172" cy="61" r="4" fill="#FBBF24" />
              <text x="180" y="56" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                P(cos θ, sin θ)
              </text>
              <text x="145" y="114" fill="#6EE7B7" fontSize="9.5" fontFamily="monospace">x=r cosθ</text>

              {/* Right: Venn Diagram n(A U B) */}
              <circle cx="295" cy="95" r="46" fill="rgba(56,189,248,0.22)" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="345" cy="95" r="46" fill="rgba(244,114,182,0.22)" stroke="#F472B6" strokeWidth="2" />
              <text x="272" y="98" fill="#7DD3FC" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
              <text x="368" y="98" fill="#F9A8D4" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
              <text x="320" y="98" textAnchor="middle" fill="#FDE68A" fontSize="9.5" fontFamily="monospace" fontWeight="bold">A∩B</text>
              <text x="320" y="168" textAnchor="middle" fill="#9CC5BE" fontSize="10" fontFamily="monospace" fontWeight="bold">
                n(A∪B) = n(A)+n(B)−n(A∩B)
              </text>
            </svg>
          </div>
        );

      case 'c11-ch3': // Conic Sections: Ellipse, Parabola, Hyperbola
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>CONIC SECTIONS LOCUS: ELLIPSE & PARABOLA FOCUS-DIRECTRIX</span>
              <span>x²/a² + y²/b² = 1 | y² = 4ax</span>
            </div>
            <svg viewBox="0 0 420 200" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              <line x1="25" y1="100" x2="395" y2="100" stroke="#5E8C83" strokeWidth="1.5" />
              <line x1="210" y1="15" x2="210" y2="185" stroke="#5E8C83" strokeWidth="1.5" />
              {/* Ellipse */}
              <ellipse cx="210" cy="100" rx="125" ry="62" fill="rgba(16,185,129,0.14)" stroke="#34D399" strokeWidth="2.5" />
              {/* Foci F1(-ae, 0) and F2(+ae, 0) */}
              <circle cx="125" cy="100" r="4.5" fill="#FBBF24" />
              <circle cx="295" cy="100" r="4.5" fill="#FBBF24" />
              <text x="125" y="118" textAnchor="middle" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                F₁(−ae,0)
              </text>
              <text x="295" y="118" textAnchor="middle" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                F₂(+ae,0)
              </text>
              {/* Latus Rectum */}
              <line x1="295" y1="52" x2="295" y2="148" stroke="#38BDF8" strokeDasharray="3 2" strokeWidth="2" />
              <text x="342" y="64" fill="#7DD3FC" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                LR = 2b²/a
              </text>
              <text x="210" y="30" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                (0, +b)
              </text>
            </svg>
          </div>
        );

      case 'c12-ch1': { // Matrices & Determinants 2x2 Transformation
        const [mA, mB, mC, mD] = params?.mat2x2 ?? [4, 7, 2, 6];
        const detVal = mA * mD - mB * mC;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>MATRIX DETERMINANT & INVERSE TRANSFORMATION</span>
              <span>|A| = ad − bc = {detVal}</span>
            </div>
            <svg viewBox="0 0 420 200" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Left: Matrix Bracket Diagram with Cross Arrows */}
              <path d="M 45 40 L 32 40 L 32 155 L 45 155" fill="none" stroke="#F5F0E6" strokeWidth="3" />
              <path d="M 165 40 L 178 40 L 178 155 L 165 155" fill="none" stroke="#F5F0E6" strokeWidth="3" />

              {/* Principal Diagonal a -> d */}
              <line x1="65" y1="68" x2="145" y2="132" stroke="#34D399" strokeWidth="3" />
              {/* Secondary Diagonal b -> c */}
              <line x1="145" y1="68" x2="65" y2="132" stroke="#F87171" strokeWidth="3" strokeDasharray="4 2" />

              <circle cx="65" cy="68" r="18" fill="#0B3B33" stroke="#34D399" strokeWidth="2" />
              <text x="65" y="73" textAnchor="middle" fill="#6EE7B7" fontSize="13" fontFamily="monospace" fontWeight="bold">{mA}</text>

              <circle cx="145" cy="68" r="18" fill="#3B1219" stroke="#F87171" strokeWidth="2" />
              <text x="145" y="73" textAnchor="middle" fill="#FCA5A5" fontSize="13" fontFamily="monospace" fontWeight="bold">{mB}</text>

              <circle cx="65" cy="132" r="18" fill="#3B1219" stroke="#F87171" strokeWidth="2" />
              <text x="65" y="137" textAnchor="middle" fill="#FCA5A5" fontSize="13" fontFamily="monospace" fontWeight="bold">{mC}</text>

              <circle cx="145" cy="132" r="18" fill="#0B3B33" stroke="#34D399" strokeWidth="2" />
              <text x="145" y="137" textAnchor="middle" fill="#6EE7B7" fontSize="13" fontFamily="monospace" fontWeight="bold">{mD}</text>

              {/* Right: Adjoint & Inverse Rule */}
              <g transform="translate(205, 42)" fontFamily="monospace">
                <text x="0" y="15" fill="#6EE7B7" fontSize="11" fontWeight="bold">
                  1. Determinant |A|:
                </text>
                <text x="0" y="34" fill="#F5F0E6" fontSize="11">
                  |A| = ({mA}×{mD}) − ({mB}×{mC}) = {detVal}
                </text>
                <text x="0" y="62" fill="#FDE68A" fontSize="11" fontWeight="bold">
                  2. Adjoint adj(A) (Swap a↔d, negate b,c):
                </text>
                <text x="0" y="81" fill="#F5F0E6" fontSize="11">
                  adj(A) = [[{mD}, {-mB}], [{-mC}, {mA}]]
                </text>
                <text x="0" y="109" fill="#7DD3FC" fontSize="11" fontWeight="bold">
                  3. Inverse A⁻¹ = (1/|A|) · adj(A)
                </text>
                <text x="0" y="128" fill="#9CC5BE" fontSize="10">
                  {detVal !== 0 ? `Invertible (|A| = ${detVal} ≠ 0)` : 'Singular Matrix (|A| = 0)'}
                </text>
              </g>
            </svg>
          </div>
        );
      }

      case 'c11-ch4':
      case 'c12-ch2': // Differential Calculus: Tangent Slope, Maxima & Minima
      case 'c12-ch3': // Integral Calculus: Area Under Curve
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>CALCULUS VISUALIZER: DERIVATIVE TANGENT dy/dx & INTEGRAL AREA ∫f(x)dx</span>
              <span>f&apos;(x) &amp; ∫f(x)dx</span>
            </div>
            <svg viewBox="0 0 420 205" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Coordinate Axes */}
              <line x1="35" y1="165" x2="395" y2="165" stroke="#5E8C83" strokeWidth="1.5" />
              <line x1="45" y1="20" x2="45" y2="180" stroke="#5E8C83" strokeWidth="1.5" />

              {/* Shaded Definite Integral Area under curve between x=a and x=b */}
              <path
                d="M 195 165 L 195 95 Q 265 135 335 55 L 335 165 Z"
                fill="rgba(56, 189, 248, 0.24)"
              />
              <line x1="195" y1="95" x2="195" y2="165" stroke="#38BDF8" strokeDasharray="3 2" strokeWidth="1.5" />
              <line x1="335" y1="55" x2="335" y2="165" stroke="#38BDF8" strokeDasharray="3 2" strokeWidth="1.5" />

              {/* Smooth Function Curve y = f(x) */}
              <path
                d="M 55 150 Q 125 20 195 95 T 355 40"
                fill="none"
                stroke="#34D399"
                strokeWidth="3"
              />

              {/* Local Maximum Tangent (f'(c) = 0) */}
              <line x1="85" y1="56" x2="165" y2="56" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="125" cy="56" r="4.5" fill="#FBBF24" />
              <text x="125" y="44" textAnchor="middle" fill="#FDE68A" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                Maxima: dy/dx = 0, d²y/dx² &lt; 0
              </text>

              {/* Integral Label */}
              <text x="268" y="138" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Area = ∫ₐᵇ f(x) dx
              </text>
              <text x="195" y="180" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="monospace">x = a</text>
              <text x="335" y="180" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="monospace">x = b</text>
            </svg>
          </div>
        );

      case 'c12-ch4': // 3D Vectors Cross Product & Bayes' Theorem
      default:
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
              <span>3D VECTOR ALGEBRA (a⃗ × b⃗) & BAYES&apos; CONDITIONAL PROBABILITY</span>
              <span>a⃗·b⃗ = |a||b|cosθ</span>
            </div>
            <svg viewBox="0 0 420 200" className="w-full h-auto rounded-lg bg-[#07221E] border border-[#174940]">
              {/* Left: 3D Orthogonal Vector Cross Product */}
              {/* Normal vector a x b */}
              <line x1="95" y1="145" x2="95" y2="32" stroke="#F472B6" strokeWidth="2.5" />
              <polygon points="91,36 95,25 99,36" fill="#F472B6" />
              <text x="102" y="38" fill="#F9A8D4" fontSize="10" fontFamily="monospace" fontWeight="bold">
                n̂ (a⃗ × b⃗)
              </text>
              {/* Vector a */}
              <line x1="95" y1="145" x2="185" y2="145" stroke="#34D399" strokeWidth="2.5" />
              <polygon points="182,141 192,145 182,149" fill="#34D399" />
              <text x="165" y="162" fill="#6EE7B7" fontSize="11" fontFamily="monospace" fontWeight="bold">a⃗</text>
              {/* Vector b */}
              <line x1="95" y1="145" x2="155" y2="95" stroke="#FBBF24" strokeWidth="2.5" />
              <polygon points="150,93 160,90 155,100" fill="#FBBF24" />
              <text x="165" y="96" fill="#FDE68A" fontSize="11" fontFamily="monospace" fontWeight="bold">b⃗</text>
              <text x="122" y="135" fill="#F5F0E6" fontSize="10" fontFamily="monospace">θ</text>

              {/* Right: Bayes Theorem Probability Tree */}
              <circle cx="245" cy="100" r="14" fill="#0F3D36" stroke="#34D399" strokeWidth="2" />
              <text x="245" y="104" textAnchor="middle" fill="#F5F0E6" fontSize="10" fontFamily="monospace">S</text>
              <line x1="259" y1="93" x2="320" y2="55" stroke="#38BDF8" strokeWidth="2" />
              <line x1="259" y1="107" x2="320" y2="145" stroke="#FBBF24" strokeWidth="2" />
              <rect x="320" y="40" width="78" height="28" rx="5" fill="#0B332C" stroke="#38BDF8" />
              <text x="359" y="58" textAnchor="middle" fill="#7DD3FC" fontSize="9.5" fontFamily="monospace">P(E₁)·P(A|E₁)</text>
              <rect x="320" y="130" width="78" height="28" rx="5" fill="#0B332C" stroke="#FBBF24" />
              <text x="359" y="148" textAnchor="middle" fill="#FDE68A" fontSize="9.5" fontFamily="monospace">P(E₂)·P(A|E₂)</text>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#061C18] border border-[#16423B] rounded-xl p-3.5 text-[#F5F0E6]">
      {renderDiagramContent()}
    </div>
  );
};
