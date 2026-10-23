export type NcertClassLevel = 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

export interface FormulaEntry {
  name: string;
  expression: string;
  explanation: string;
  solvedExample?: string;
}

export interface NcertChapterFormulas {
  id: string;
  classLevel: NcertClassLevel;
  chapterNo: number;
  chapterTitle: string;
  subject: 'Mathematics (NCERT)' | 'Physics & Chemistry Numericals (NCERT)';
  topicTags: string[];
  formulas: FormulaEntry[];
}

export const NCERT_CLASS_FORMULAS: NcertChapterFormulas[] = [
  // ==========================================================================
  // CLASS 7 (NCERT MATHEMATICS)
  // ==========================================================================
  {
    id: 'c7-ch1',
    classLevel: 'Class 7',
    chapterNo: 1,
    chapterTitle: 'Unitary Method, Ratio & Proportion',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Unitary Method', 'Direct Proportion', 'Ratio'],
    formulas: [
      {
        name: 'Unitary Method — Step 1 (Value of 1 Unit)',
        expression: 'Value of 1 Unit = (Total Cost or Quantity) ÷ (Number of Units)',
        explanation: 'First find the value of a single unit by dividing the total given value by the number of items.',
        solvedExample: 'If 12 notebooks cost ₹360, then cost of 1 notebook = 360 ÷ 12 = ₹30.'
      },
      {
        name: 'Unitary Method — Step 2 (Value of Required Units)',
        expression: 'Value of n Units = (Value of 1 Unit) × n',
        explanation: 'Multiply the single-unit value by the required number of units n.',
        solvedExample: 'Cost of 7 notebooks = ₹30 × 7 = ₹210.'
      },
      {
        name: 'Rule of Three (Combined Unitary Formula)',
        expression: 'Required Value = (Given Total ÷ Given Units) × Required Units',
        explanation: 'Direct single-step formula for solving any unitary method word problem.',
        solvedExample: 'If a car travels 180 km in 15 L of petrol, distance in 8 L = (180 ÷ 15) × 8 = 12 × 8 = 96 km.'
      },
      {
        name: 'Proportion Equality Rule (a : b :: c : d)',
        expression: 'Product of Extremes (a × d) = Product of Means (b × c)',
        explanation: 'Four quantities a, b, c, d are in proportion if a/b = c/d, so ad = bc.',
        solvedExample: 'If 4 : 9 :: 12 : x, then 4x = 9 × 12 ⇒ x = 108 ÷ 4 = 27.'
      }
    ]
  },
  {
    id: 'c7-ch2',
    classLevel: 'Class 7',
    chapterNo: 2,
    chapterTitle: 'Comparing Quantities — Simple Interest, Profit, Loss & Percentage',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Simple Interest', 'Profit & Loss', 'Percentage'],
    formulas: [
      {
        name: 'Simple Interest (SI)',
        expression: 'SI = (P × R × T) / 100',
        explanation: 'P = Principal sum borrowed/invested, R = Rate of interest % per annum, T = Time in years.',
        solvedExample: 'Find SI on ₹5,000 at 8% p.a. for 3 years: SI = (5000 × 8 × 3)/100 = ₹1,200.'
      },
      {
        name: 'Total Amount (A) under Simple Interest',
        expression: 'A = P + SI = P × [1 + (R × T) / 100]',
        explanation: 'Total amount repaid at the end of time T equals Principal plus Simple Interest.',
        solvedExample: 'Amount = ₹5,000 + ₹1,200 = ₹6,200.'
      },
      {
        name: 'Principal, Rate & Time Rearrangement Formulas',
        expression: 'P = (100 × SI)/(R × T)  |  R = (100 × SI)/(P × T)  |  T = (100 × SI)/(P × R)',
        explanation: 'Used when Simple Interest is already known and you need to find P, R, or T.',
        solvedExample: 'If SI = ₹450 on ₹3,000 in 3 yrs, R = (100 × 450)/(3000 × 3) = 5% p.a.'
      },
      {
        name: 'Profit & Profit Percentage',
        expression: 'Profit = SP − CP   |   Profit % = (Profit / CP) × 100',
        explanation: 'Occurs when Selling Price (SP) > Cost Price (CP). Always calculated on CP.',
        solvedExample: 'CP = ₹400, SP = ₹460 ⇒ Profit = ₹60, Profit % = (60/400) × 100 = 15%.'
      },
      {
        name: 'Loss & Loss Percentage',
        expression: 'Loss = CP − SP   |   Loss % = (Loss / CP) × 100',
        explanation: 'Occurs when Cost Price (CP) > Selling Price (SP). Always calculated on CP.',
        solvedExample: 'CP = ₹500, SP = ₹450 ⇒ Loss = ₹50, Loss % = (50/500) × 100 = 10%.'
      },
      {
        name: 'Percentage Increase / Decrease',
        expression: '% Change = [(New Value − Original Value) / Original Value] × 100',
        explanation: 'Measures relative growth or reduction with respect to the initial value.'
      }
    ]
  },
  {
    id: 'c7-ch3',
    classLevel: 'Class 7',
    chapterNo: 3,
    chapterTitle: 'Exponents, Powers & Algebraic Expressions',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Exponents', 'Laws of Powers', 'Algebra'],
    formulas: [
      {
        name: 'Product & Quotient Laws of Exponents',
        expression: 'aᵐ × aⁿ = aᵐ⁺ⁿ   |   aᵐ ÷ aⁿ = aᵐ⁻ⁿ (a ≠ 0)',
        explanation: 'When multiplying same bases, add exponents; when dividing same bases, subtract exponents.',
        solvedExample: '2³ × 2⁴ = 2⁷ = 128;  5⁶ ÷ 5⁴ = 5² = 25.'
      },
      {
        name: 'Power of a Power & Product',
        expression: '(aᵐ)ⁿ = aᵐⁿ   |   (a × b)ᵐ = aᵐ × bᵐ   |   (a / b)ᵐ = aᵐ / bᵐ',
        explanation: 'Distributes the outer exponent across factors or numerator/denominator.'
      },
      {
        name: 'Zero & Negative Exponent Rule',
        expression: 'a⁰ = 1 (a ≠ 0)   |   a⁻ⁿ = 1 / aⁿ',
        explanation: 'Any non-zero number raised to power 0 equals 1.'
      }
    ]
  },
  {
    id: 'c7-ch4',
    classLevel: 'Class 7',
    chapterNo: 4,
    chapterTitle: 'Perimeter, Area & Triangle Properties (2D Mensuration)',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Perimeter & Area', 'Pythagoras', 'Triangles'],
    formulas: [
      {
        name: 'Area of Parallelogram & Triangle',
        expression: 'Area(Parallelogram) = base (b) × height (h)   |   Area(Triangle) = ½ × b × h',
        explanation: 'Height h is the perpendicular distance from the base to the opposite vertex/side.'
      },
      {
        name: 'Circumference & Area of a Circle',
        expression: 'Circumference C = 2πr = πd   |   Area A = πr²   (π ≈ 22/7 or 3.14)',
        explanation: 'r is the radius and d = 2r is the diameter of the circle.',
        solvedExample: 'For r = 7 cm: C = 2 × (22/7) × 7 = 44 cm; Area = (22/7) × 49 = 154 cm².'
      },
      {
        name: 'Pythagoras Theorem & Exterior Angle Property',
        expression: 'Hypotenuse² = Base² + Perpendicular² (c² = a² + b²)   |   ∠Exterior = ∠Int₁ + ∠Int₂',
        explanation: 'Applies to any right-angled triangle; exterior angle of a triangle equals sum of opposite interior angles.'
      }
    ]
  },

  // ==========================================================================
  // CLASS 8 (NCERT MATHEMATICS)
  // ==========================================================================
  {
    id: 'c8-ch1',
    classLevel: 'Class 8',
    chapterNo: 1,
    chapterTitle: 'Comparing Quantities — Compound Interest (CI), Discount & GST',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Compound Interest', 'CI vs SI', 'Discount & Tax'],
    formulas: [
      {
        name: 'Compound Interest (Compounded Annually)',
        expression: 'A = P × (1 + R / 100)ⁿ   |   CI = A − P = P × [(1 + R / 100)ⁿ − 1]',
        explanation: 'P = Principal, R = Annual interest rate %, n = Number of years.',
        solvedExample: 'P = ₹10,000, R = 10%, n = 2 yrs ⇒ A = 10000 × (1.1)² = ₹12,100; CI = ₹2,100.'
      },
      {
        name: 'Compound Interest (Compounded Half-Yearly / Semi-Annually)',
        expression: 'A = P × [1 + (R / 2) / 100]²ⁿ = P × (1 + R / 200)²ⁿ',
        explanation: 'Rate becomes R/2% per half-year and number of conversion periods becomes 2n.'
      },
      {
        name: 'Compound Interest (Compounded Quarterly)',
        expression: 'A = P × [1 + (R / 4) / 100]⁴ⁿ = P × (1 + R / 400)⁴ⁿ',
        explanation: 'Rate becomes R/4% per quarter and number of conversion periods becomes 4n.'
      },
      {
        name: 'Shortcut: Difference Between CI and SI for 2 Years & 3 Years',
        expression: '(CI − SI)₂ yrs = P × (R / 100)²   |   (CI − SI)₃ yrs = P × (R / 100)² × (3 + R / 100)',
        explanation: 'Direct NCERT/Competitive shortcut for finding CI − SI without computing full powers.',
        solvedExample: 'For P = ₹8,000, R = 5%, 2 yrs: CI − SI = 8000 × (5/100)² = 8000 × (1/400) = ₹20.'
      },
      {
        name: 'Marked Price (MP), Discount & GST / Sales Tax',
        expression: 'Discount = MP − SP  |  SP = MP × (1 − Discount%/100)  |  Bill = SP × (1 + GST%/100)',
        explanation: 'Discount is always calculated on Marked Price (MP); GST is added on the discounted Selling Price.'
      }
    ]
  },
  {
    id: 'c8-ch2',
    classLevel: 'Class 8',
    chapterNo: 2,
    chapterTitle: 'Direct & Inverse Proportions + Time & Work (Unitary Rate)',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Direct Proportion', 'Inverse Proportion', 'Time & Work'],
    formulas: [
      {
        name: 'Direct Proportion Formula',
        expression: 'x₁ / y₁ = x₂ / y₂ = k (constant)   ⇒   x₁ × y₂ = x₂ × y₁',
        explanation: 'When x increases, y increases at the same ratio (e.g., distance and petrol consumed).'
      },
      {
        name: 'Inverse Proportion Formula',
        expression: 'x₁ × y₁ = x₂ × y₂ = k (constant)   ⇒   x₁ / x₂ = y₂ / y₁',
        explanation: 'When x increases, y decreases proportionally (e.g., number of workers and days taken).',
        solvedExample: 'If 15 workers build a wall in 48 hours, workers needed for 30 hours = (15 × 48)/30 = 24 workers.'
      },
      {
        name: 'Time & Work (Unitary 1-Day Work Method)',
        expression: 'If A takes x days & B takes y days: (A + B) 1-day work = 1/x + 1/y  ⇒  Total Time = (x × y)/(x + y)',
        explanation: 'Combined time taken when two people work together.',
        solvedExample: 'A = 10 days, B = 15 days ⇒ Together = (10 × 15)/(10 + 15) = 150/25 = 6 days.'
      }
    ]
  },
  {
    id: 'c8-ch3',
    classLevel: 'Class 8',
    chapterNo: 3,
    chapterTitle: 'Algebraic Expressions, Standard Identities & Polygons',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Algebraic Identities', 'Factorisation', 'Polygons'],
    formulas: [
      {
        name: 'Four Standard Algebraic Identities',
        expression: '(a + b)² = a² + 2ab + b²  |  (a − b)² = a² − 2ab + b²  |  a² − b² = (a + b)(a − b)  |  (x + a)(x + b) = x² + (a + b)x + ab',
        explanation: 'Core identities for expanding and factoring quadratic algebraic expressions.'
      },
      {
        name: 'Interior & Exterior Angles of an n-Sided Polygon',
        expression: 'Sum of Interior Angles = (n − 2) × 180°  |  Each Exterior Angle (Regular) = 360° / n  |  Diagonals = n(n − 3) / 2',
        explanation: 'Sum of exterior angles of any convex polygon is always 360°.',
        solvedExample: 'For a regular Hexagon (n = 6): Interior sum = 4 × 180° = 720°; Diagonals = 6(3)/2 = 9.'
      }
    ]
  },
  {
    id: 'c8-ch4',
    classLevel: 'Class 8',
    chapterNo: 4,
    chapterTitle: 'Mensuration — Trapezium, Rhombus, Cube, Cuboid & Cylinder',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Mensuration', 'Surface Area', 'Volume'],
    formulas: [
      {
        name: 'Area of Trapezium, Rhombus & General Quadrilateral',
        expression: 'Trapezium = ½(a + b) × h   |   Rhombus = ½ × d₁ × d₂   |   Quadrilateral = ½ × d × (h₁ + h₂)',
        explanation: 'a, b are parallel sides; d₁, d₂ are diagonals of the rhombus.'
      },
      {
        name: 'Cuboid & Cube (LSA, TSA & Volume)',
        expression: 'Cuboid: LSA = 2h(l + b), TSA = 2(lb + bh + hl), Vol = l×b×h   |   Cube: LSA = 4a², TSA = 6a², Vol = a³',
        explanation: 'l = length, b = breadth, h = height, a = edge of cube.'
      },
      {
        name: 'Right Circular Cylinder & Euler’s Polyhedron Formula',
        expression: 'Cylinder: CSA = 2πrh, TSA = 2πr(r + h), Vol = πr²h   |   Euler Formula: F + V − E = 2',
        explanation: 'F = Faces, V = Vertices, E = Edges for any convex polyhedron.'
      }
    ]
  },

  // ==========================================================================
  // CLASS 9 (NCERT MATHEMATICS)
  // ==========================================================================
  {
    id: 'c9-ch1',
    classLevel: 'Class 9',
    chapterNo: 1,
    chapterTitle: 'Number Systems, Surds & Polynomial Cubic Identities',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Surds & Radicals', 'Cubic Identities', 'Polynomials'],
    formulas: [
      {
        name: 'Laws of Radicals & Rationalizing the Denominator',
        expression: '√(ab) = √a · √b  |  (√a + √b)(√a − √b) = a − b  |  1 / (√a + √b) = (√a − √b) / (a − b)',
        explanation: 'Multiply numerator and denominator by the conjugate surd to eliminate roots in the denominator.'
      },
      {
        name: 'Square of Trinomial & Cube of Binomials',
        expression: '(x + y + z)² = x² + y² + z² + 2(xy + yz + zx)   |   (x ± y)³ = x³ ± y³ ± 3xy(x ± y)',
        explanation: 'Fundamental Class 9 NCERT Chapter 2 Polynomial expansion identities.'
      },
      {
        name: 'Sum & Difference of Cubes',
        expression: 'x³ + y³ = (x + y)(x² − xy + y²)   |   x³ − y³ = (x − y)(x² + xy + y²)',
        explanation: 'Used for factoring cubic binomials.'
      },
      {
        name: 'Conditional Cubic Identity (x + y + z = 0)',
        expression: 'x³ + y³ + z³ − 3xyz = (x + y + z)(x² + y² + z² − xy − yz − zx)  ⇒  If x + y + z = 0, then x³ + y³ + z³ = 3xyz',
        explanation: 'Allows instant calculation of sum of three cubes without cubing individual numbers!',
        solvedExample: 'Evaluate (−12)³ + 7³ + 5³: Since −12 + 7 + 5 = 0, sum = 3(−12)(7)(5) = −1,260.'
      }
    ]
  },
  {
    id: 'c9-ch2',
    classLevel: 'Class 9',
    chapterNo: 2,
    chapterTitle: 'Heron’s Formula, Surface Areas & Volumes (Cone, Sphere, Hemisphere)',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Heron Formula', 'Cone & Sphere', '3D Volumes'],
    formulas: [
      {
        name: 'Heron’s Formula for Area of Any Triangle',
        expression: 's = (a + b + c) / 2   |   Area = √[s(s − a)(s − b)(s − c)]   |   Equilateral Δ Area = (√3 / 4) a²',
        explanation: 'a, b, c are the three side lengths and s is the semi-perimeter.',
        solvedExample: 'Sides 13, 14, 15 cm ⇒ s = 21 cm ⇒ Area = √(21 × 8 × 7 × 6) = √7056 = 84 cm².'
      },
      {
        name: 'Right Circular Cone (Slant Height, CSA, TSA & Volume)',
        expression: 'l = √(r² + h²)   |   CSA = πrl   |   TSA = πr(l + r)   |   Volume = (1/3)πr²h',
        explanation: 'r = base radius, h = vertical height, l = slant height.'
      },
      {
        name: 'Sphere & Hemisphere Formulas',
        expression: 'Sphere: SA = 4πr², Vol = (4/3)πr³   |   Hemisphere: CSA = 2πr², TSA = 3πr², Vol = (2/3)πr³',
        explanation: 'Complete surface area and volume formulas for spherical solids.'
      }
    ]
  },
  {
    id: 'c9-ch3',
    classLevel: 'Class 9',
    chapterNo: 3,
    chapterTitle: 'Circles, Triangles, Mid-Point Theorem & Empirical Probability',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Circles', 'Mid-Point Theorem', 'Probability'],
    formulas: [
      {
        name: 'Mid-Point Theorem & Cyclic Quadrilaterals',
        expression: 'DE ∥ BC and DE = ½ BC   |   Cyclic Quad: ∠A + ∠C = 180° and ∠B + ∠D = 180°',
        explanation: 'Angle subtended by an arc at the centre is double the angle subtended at any point on the remaining circle.'
      },
      {
        name: 'Mean, Median & Empirical Probability',
        expression: 'Mean x̄ = (∑fᵢxᵢ) / (∑fᵢ)   |   P(E) = (Number of Favourable Outcomes) / (Total Number of Trials),  0 ≤ P(E) ≤ 1',
        explanation: 'Sum of probabilities of all elementary events equals 1: P(E) + P(not E) = 1.'
      }
    ]
  },

  // ==========================================================================
  // CLASS 10 (NCERT MATHEMATICS + CLASS 10 NUMERICALS)
  // ==========================================================================
  {
    id: 'c10-ch1',
    classLevel: 'Class 10',
    chapterNo: 1,
    chapterTitle: 'Real Numbers, Polynomials & Pair of Linear Equations',
    subject: 'Mathematics (NCERT)',
    topicTags: ['HCF & LCM', 'Quadratic Zeroes', 'Linear Equations'],
    formulas: [
      {
        name: 'Fundamental Theorem of Arithmetic (HCF × LCM)',
        expression: 'HCF(a, b) × LCM(a, b) = a × b',
        explanation: 'Product of two positive integers equals the product of their HCF and LCM.',
        solvedExample: 'If HCF(306, 657) = 9, then LCM = (306 × 657) ÷ 9 = 22,338.'
      },
      {
        name: 'Relationship Between Zeroes & Coefficients of Polynomials',
        expression: 'Quadratic ax²+bx+c: α + β = −b/a,  αβ = c/a   |   Cubic: α+β+γ = −b/a,  αβ+βγ+γα = c/a,  αβγ = −d/a',
        explanation: 'To form a quadratic polynomial given zeroes α, β: p(x) = k[x² − (α + β)x + αβ].'
      },
      {
        name: 'Consistency Conditions for Pair of Linear Equations (a₁x + b₁y + c₁ = 0)',
        expression: 'Intersecting (Unique): a₁/a₂ ≠ b₁/b₂  |  Coincident (Infinite): a₁/a₂ = b₁/b₂ = c₁/c₂  |  Parallel (No Sol): a₁/a₂ = b₁/b₂ ≠ c₁/c₂',
        explanation: 'Determines graphical and algebraic solvability of simultaneous linear equations.'
      }
    ]
  },
  {
    id: 'c10-ch2',
    classLevel: 'Class 10',
    chapterNo: 2,
    chapterTitle: 'Quadratic Equations & Arithmetic Progressions (AP)',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Quadratic Formula', 'Discriminant', 'Arithmetic Progression'],
    formulas: [
      {
        name: 'Quadratic Formula (Sridharacharya Formula) & Discriminant',
        expression: 'x = [−b ± √(b² − 4ac)] / (2a)   |   Discriminant D = b² − 4ac',
        explanation: 'D > 0: Two distinct real roots; D = 0: Two equal real roots (−b/2a); D < 0: No real roots.',
        solvedExample: '2x² − 7x + 3 = 0 ⇒ D = 49 − 24 = 25 ⇒ x = (7 ± 5)/4 ⇒ x = 3 or ½.'
      },
      {
        name: 'Arithmetic Progression (AP) — nᵗʰ Term Formula',
        expression: 'aₙ = a + (n − 1)d   |   nᵗʰ term from end = l − (n − 1)d',
        explanation: 'a = first term, d = common difference (a₂ − a₁), l = last term.'
      },
      {
        name: 'Sum of First n Terms of an AP (Sₙ)',
        expression: 'Sₙ = (n / 2) × [2a + (n − 1)d] = (n / 2) × (a + aₙ)   |   aₙ = Sₙ − Sₙ₋₁',
        explanation: 'Sum of first n positive integers: 1 + 2 + … + n = n(n + 1)/2.',
        solvedExample: 'AP: 2, 7, 12… find S₁₀: S₁₀ = (10/2)[2(2) + 9(5)] = 5 × 49 = 245.'
      }
    ]
  },
  {
    id: 'c10-ch3',
    classLevel: 'Class 10',
    chapterNo: 3,
    chapterTitle: 'Coordinate Geometry, Triangles (BPT) & Trigonometry',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Coordinate Geometry', 'Trigonometry', 'Heights & Distances'],
    formulas: [
      {
        name: 'Distance, Section & Mid-Point Formulas',
        expression: 'd = √[(x₂−x₁)² + (y₂−y₁)²]   |   P(x,y) = [(m₁x₂+m₂x₁)/(m₁+m₂), (m₁y₂+m₂y₁)/(m₁+m₂)]   |   Midpoint = [(x₁+x₂)/2, (y₁+y₂)/2]',
        explanation: 'Centroid of a triangle with vertices (x₁,y₁), (x₂,y₂), (x₃,y₃) is [(x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3].'
      },
      {
        name: 'Basic Proportionality Theorem (Thales Theorem)',
        expression: 'If DE ∥ BC in ΔABC, then AD / DB = AE / EC   and   AD / AB = AE / AC',
        explanation: 'Line drawn parallel to one side of a triangle divides the other two sides in the same ratio.'
      },
      {
        name: 'Pythagorean Trigonometric Identities',
        expression: 'sin²θ + cos²θ = 1   |   1 + tan²θ = sec²θ   |   1 + cot²θ = cosec²θ',
        explanation: 'tan θ = sin θ / cos θ;  cot θ = cos θ / sin θ;  sin 30° = ½, sin 45° = 1/√2, sin 60° = √3/2, tan 45° = 1, tan 60° = √3.'
      }
    ]
  },
  {
    id: 'c10-ch4',
    classLevel: 'Class 10',
    chapterNo: 4,
    chapterTitle: 'Circles, Sectors, Surface Areas, Grouped Statistics & Probability',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Sectors & Segments', 'Grouped Statistics', 'Mode & Median'],
    formulas: [
      {
        name: 'Arc Length, Area of Sector & Area of Segment of a Circle',
        expression: 'Arc Length = (θ / 360°) × 2πr   |   Sector Area = (θ / 360°) × πr²   |   Segment Area = (θ / 360°)πr² − ½r² sin θ',
        explanation: 'θ is the sector angle in degrees at the centre of the circle of radius r.'
      },
      {
        name: 'Mean of Grouped Data (Direct, Assumed Mean & Step-Deviation)',
        expression: 'Direct: x̄ = ∑fᵢxᵢ / ∑fᵢ   |   Assumed Mean: x̄ = a + (∑fᵢdᵢ / ∑fᵢ)   |   Step-Deviation: x̄ = a + h × (∑fᵢuᵢ / ∑fᵢ)',
        explanation: 'where dᵢ = xᵢ − a and uᵢ = (xᵢ − a)/h.'
      },
      {
        name: 'Mode & Median of Grouped Data + Empirical Formula',
        expression: 'Mode = l + [(f₁ − f₀) / (2f₁ − f₀ − f₂)] × h   |   Median = l + [(N/2 − cf) / f] × h   |   3 Median = Mode + 2 Mean',
        explanation: 'l = lower limit of modal/median class, f₁ = frequency of modal class, cf = cumulative frequency of preceding class.'
      }
    ]
  },
  {
    id: 'c10-ch5',
    classLevel: 'Class 10',
    chapterNo: 5,
    chapterTitle: 'Class 10 Science Board Numericals (Electricity, Optics & Chemistry)',
    subject: 'Physics & Chemistry Numericals (NCERT)',
    topicTags: ['Class 10 Numericals', 'Electricity & Ohm Law', 'Mirror & Lens', 'pH & Moles'],
    formulas: [
      {
        name: 'Electricity — Charge, Current, Potential & Ohm’s Law',
        expression: 'Q = n·e = I × t   |   V = W / Q   |   Ohm’s Law: V = I × R   |   Resistance: R = ρ × (L / A)',
        explanation: 'I = Current (Amperes), V = Voltage (Volts), R = Resistance (Ω), ρ = Resistivity (Ω·m).',
        solvedExample: 'A 4 Ω resistor carries 2.5 A current ⇒ Potential difference V = 2.5 × 4 = 10 V.'
      },
      {
        name: 'Series & Parallel Resistors + Joule’s Law of Heating & Electric Power',
        expression: 'Series: Rₛ = R₁ + R₂ + R₃  |  Parallel: 1/Rₚ = 1/R₁ + 1/R₂  |  Heat H = I²Rt = VIt  |  Power P = VI = I²R = V²/R',
        explanation: '1 Commercial Unit of Energy (1 kWh) = 3.6 × 10⁶ Joules (J).',
        solvedExample: 'Two resistors 6 Ω and 3 Ω in parallel: Rₚ = (6 × 3)/(6 + 3) = 18/9 = 2 Ω.'
      },
      {
        name: 'Light Reflection & Refraction — Mirror Formula, Lens Formula & Power',
        expression: 'Mirror: 1/v + 1/u = 1/f,  m = −v/u  |  Lens: 1/v − 1/u = 1/f,  m = v/u  |  Lens Power P = 1 / f(m) = 100 / f(cm) Dioptre (D)',
        explanation: 'Snell’s Law: Refractive Index n = sin i / sin r = c / v (where c = 3 × 10⁸ m/s).',
        solvedExample: 'Convex lens f = +25 cm ⇒ Power P = 100 / 25 = +4.0 D.'
      },
      {
        name: 'Chemistry Numericals — pH Scale, Molarity & Mole Concept',
        expression: 'pH = −log₁₀[H⁺]   |   pH + pOH = 14 (at 298 K)   |   Moles n = Given Mass (m) / Molar Mass (M)',
        explanation: 'Neutralization Equivalence: M₁V₁ / n₁ = M₂V₂ / n₂.',
        solvedExample: 'If [H⁺] = 10⁻³ M in HCl solution, then pH = −log₁₀(10⁻³) = 3.0.'
      }
    ]
  },

  // ==========================================================================
  // CLASS 11 (NCERT MATHEMATICS)
  // ==========================================================================
  {
    id: 'c11-ch1',
    classLevel: 'Class 11',
    chapterNo: 1,
    chapterTitle: 'Sets, Relations, Functions & Trigonometric Identities',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Sets', 'Trigonometry', 'Compound & Multiple Angles'],
    formulas: [
      {
        name: 'Inclusion-Exclusion Principle & De Morgan’s Laws',
        expression: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B)   |   (A ∪ B)′ = A′ ∩ B′   |   (A ∩ B)′ = A′ ∪ B′',
        explanation: 'For 3 sets: n(A∪B∪C) = n(A)+n(B)+n(C) − n(A∩B) − n(B∩C) − n(C∩A) + n(A∩B∩C).'
      },
      {
        name: 'Compound Angle Trigonometric Formulas',
        expression: 'sin(A ± B) = sin A cos B ± cos A sin B   |   cos(A ± B) = cos A cos B ∓ sin A sin B   |   tan(A ± B) = (tan A ± tan B) / (1 ∓ tan A tan B)',
        explanation: 'Radian-Degree conversion: π radians = 180°, Arc length l = rθ (θ in radians).'
      },
      {
        name: 'Double & Triple Angle Trigonometric Identities',
        expression: 'sin 2A = 2 sin A cos A = 2tan A/(1+tan²A)  |  cos 2A = cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A  |  sin 3A = 3sin A − 4sin³A  |  cos 3A = 4cos³A − 3cos A',
        explanation: 'Essential for simplifying trigonometric and calculus expressions.'
      },
      {
        name: 'Sum-to-Product (C & D) Formulas',
        expression: 'sin C + sin D = 2 sin[(C+D)/2] cos[(C−D)/2]   |   cos C + cos D = 2 cos[(C+D)/2] cos[(C−D)/2]   |   cos C − cos D = −2 sin[(C+D)/2] sin[(C−D)/2]',
        explanation: 'Converts sums/differences of sines and cosines into products.'
      }
    ]
  },
  {
    id: 'c11-ch2',
    classLevel: 'Class 11',
    chapterNo: 2,
    chapterTitle: 'Complex Numbers, Permutations, Combinations & Binomial Theorem',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Complex Numbers', 'P&C', 'Binomial Theorem'],
    formulas: [
      {
        name: 'Complex Numbers — Modulus, Conjugate, Inverse & Polar Form',
        expression: 'z = x + iy  |  |z| = √(x² + y²)  |  z̄ = x − iy  |  z⁻¹ = z̄ / |z|²  |  Polar: z = r(cos θ + i sin θ) = r·eⁱᶿ',
        explanation: 'Euler identity: e^(iθ) = cos θ + i sin θ;  i² = −1, i³ = −i, i⁴ = 1.'
      },
      {
        name: 'Permutations & Combinations',
        expression: 'ⁿPᵣ = n! / (n − r)!   |   ⁿCᵣ = n! / [r!(n − r)!]   |   ⁿCᵣ = ⁿCₙ₋ᵣ   |   ⁿCᵣ + ⁿCᵣ₋₁ = ⁿ⁺¹Cᵣ',
        explanation: 'Circular permutations of n distinct objects = (n − 1)!.'
      },
      {
        name: 'Binomial Theorem & General Term',
        expression: '(a + b)ⁿ = ∑ (r=0 to n) ⁿCᵣ aⁿ⁻ʳ bʳ   |   General Term Tᵣ₊₁ = ⁿCᵣ aⁿ⁻ʳ bʳ   |   ∑ ⁿCᵣ = 2ⁿ',
        explanation: 'Gives the (r+1)ᵗʰ term in the expansion of (a + b)ⁿ.'
      }
    ]
  },
  {
    id: 'c11-ch3',
    classLevel: 'Class 11',
    chapterNo: 3,
    chapterTitle: 'Sequences & Series (GP), Straight Lines & Conic Sections',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Geometric Progression', 'Straight Lines', 'Conic Sections'],
    formulas: [
      {
        name: 'Geometric Progression (GP) & Special Series Sums',
        expression: 'aₙ = a·rⁿ⁻¹  |  Sₙ = a(rⁿ − 1)/(r − 1)  |  S∞ = a/(1 − r) (|r|<1)  |  ∑k² = n(n+1)(2n+1)/6  |  ∑k³ = [n(n+1)/2]²',
        explanation: 'AM = (a+b)/2, GM = √(ab), and AM ≥ GM for positive real numbers.'
      },
      {
        name: 'Straight Lines — Slope, Forms & Perpendicular Distance',
        expression: 'y − y₁ = m(x − x₁)  |  tan θ = |(m₁ − m₂)/(1 + m₁m₂)|  |  Distance of (x₁,y₁) from Ax+By+C=0: d = |Ax₁ + By₁ + C| / √(A² + B²)',
        explanation: 'Parallel lines: m₁ = m₂;  Perpendicular lines: m₁ × m₂ = −1.'
      },
      {
        name: 'Conic Sections — Circle, Parabola, Ellipse & Hyperbola',
        expression: 'Circle: (x−h)²+(y−k)²=r²  |  Parabola: y²=4ax (LR=4a)  |  Ellipse: x²/a² + y²/b² = 1, b²=a²(1−e²), LR=2b²/a  |  Hyperbola: x²/a² − y²/b² = 1, b²=a²(e²−1)',
        explanation: 'Standard equations, eccentricity e, and latus rectum (LR) lengths.'
      }
    ]
  },
  {
    id: 'c11-ch4',
    classLevel: 'Class 11',
    chapterNo: 4,
    chapterTitle: 'Limits, First-Principle Derivatives & Statistics (Variance / SD)',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Limits', 'Differentiation', 'Variance & SD'],
    formulas: [
      {
        name: 'Standard Calculus Limits',
        expression: 'lim(x→0) (sin x)/x = 1  |  lim(x→0) (tan x)/x = 1  |  lim(x→a) (xⁿ − aⁿ)/(x − a) = n·aⁿ⁻¹  |  lim(x→0) (eˣ − 1)/x = 1',
        explanation: 'Foundational limits for differential calculus.'
      },
      {
        name: 'First Principle of Differentiation, Product & Quotient Rules',
        expression: 'f′(x) = lim(h→0) [f(x+h) − f(x)]/h   |   (u·v)′ = u′v + uv′   |   (u/v)′ = (u′v − uv′) / v²',
        explanation: 'Derivative represents the instantaneous rate of change or slope of tangent.'
      },
      {
        name: 'Variance (σ²) & Standard Deviation (σ)',
        expression: 'σ² = (1/N) ∑fᵢ(xᵢ − x̄)² = (∑fᵢxᵢ² / N) − (x̄)²   |   Standard Deviation σ = √(Variance)',
        explanation: 'Measures dispersion of data around the mean.'
      }
    ]
  },

  // ==========================================================================
  // CLASS 12 (NCERT MATHEMATICS — MATRICES, CALCULUS, DIFFERENTIAL EQ, VECTORS)
  // ==========================================================================
  {
    id: 'c12-ch1',
    classLevel: 'Class 12',
    chapterNo: 1,
    chapterTitle: 'Matrices, Determinants, Adjoint & Matrix Inverse',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Matrices', 'Determinants', 'Matrix Inverse'],
    formulas: [
      {
        name: 'Transpose, Symmetric & Skew-Symmetric Decomposition',
        expression: '(AB)ᵀ = BᵀAᵀ   |   Symmetric: Aᵀ = A   |   Skew-Symmetric: Aᵀ = −A   |   A = ½(A + Aᵀ) + ½(A − Aᵀ)',
        explanation: 'Every square matrix can be uniquely expressed as the sum of a symmetric and a skew-symmetric matrix.'
      },
      {
        name: 'Determinant Properties & Area of Triangle',
        expression: '|AB| = |A|·|B|   |   |kA| = kⁿ|A| (for n×n matrix)   |   Area(Δ) = ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|',
        explanation: 'Three points are collinear if and only if the determinant Area(Δ) = 0.'
      },
      {
        name: 'Adjoint, Matrix Inverse & Cramer / Matrix System Solution',
        expression: 'A · (adj A) = (adj A) · A = |A|·Iₙ   |   A⁻¹ = (1 / |A|) · adj(A) (|A| ≠ 0)   |   |adj A| = |A|ⁿ⁻¹   |   AX = B ⇒ X = A⁻¹B',
        explanation: 'For a 2×2 matrix [[a, b], [c, d]], adj(A) = [[d, −b], [−c, a]] and |A| = ad − bc.',
        solvedExample: 'If |A| = 5 for a 3×3 matrix, then |adj A| = 5³⁻¹ = 25 and |A⁻¹| = 1/5.'
      }
    ]
  },
  {
    id: 'c12-ch2',
    classLevel: 'Class 12',
    chapterNo: 2,
    chapterTitle: 'Calculus I — Continuity, Differentiation & Applications of Derivatives',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Calculus', 'Differentiation', 'Maxima & Minima'],
    formulas: [
      {
        name: 'Standard Derivatives (Algebraic, Exponential, Logarithmic & Trig)',
        expression: 'd/dx(xⁿ) = nxⁿ⁻¹  |  d/dx(eˣ) = eˣ  |  d/dx(aˣ) = aˣ ln a  |  d/dx(ln x) = 1/x  |  d/dx(tan x) = sec²x  |  d/dx(sec x) = sec x tan x',
        explanation: 'd/dx(sin x) = cos x, d/dx(cos x) = −sin x, d/dx(cot x) = −cosec²x, d/dx(cosec x) = −cosec x cot x.'
      },
      {
        name: 'Derivatives of Inverse Trigonometric Functions',
        expression: 'd/dx(sin⁻¹x) = 1/√(1−x²)   |   d/dx(cos⁻¹x) = −1/√(1−x²)   |   d/dx(tan⁻¹x) = 1/(1+x²)   |   d/dx(sec⁻¹x) = 1/(|x|√(x²−1))',
        explanation: 'Crucial for Class 12 Board Ch 5 Continuity and Differentiability.'
      },
      {
        name: 'Chain Rule, Parametric & Logarithmic Differentiation',
        expression: 'Chain: dy/dx = (dy/du)·(du/dx)   |   Parametric: dy/dx = (dy/dt)/(dx/dt)   |   For y = u(x)^v(x): ln y = v ln u ⇒ (1/y)dy/dx = v′ ln u + (v/u)u′',
        explanation: 'Used when both base and exponent are functions of x (e.g., y = xˣ ⇒ dy/dx = xˣ(1 + ln x)).'
      },
      {
        name: 'Tangents, Increasing/Decreasing & Second Derivative Test (Maxima/Minima)',
        expression: 'Strictly Increasing: f′(x) > 0   |   Critical Point: f′(c) = 0   |   f″(c) < 0 ⇒ Local Maximum;  f″(c) > 0 ⇒ Local Minimum',
        explanation: 'Rate of change of y w.r.t. x is dy/dx.'
      }
    ]
  },
  {
    id: 'c12-ch3',
    classLevel: 'Class 12',
    chapterNo: 3,
    chapterTitle: 'Calculus II — Indefinite & Definite Integration & Differential Equations',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Calculus', 'Integration', 'Differential Equations'],
    formulas: [
      {
        name: 'Fundamental Indefinite Integrals',
        expression: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n≠−1)  |  ∫(1/x)dx = ln|x| + C  |  ∫eˣ dx = eˣ + C  |  ∫aˣ dx = aˣ/ln a + C  |  ∫sec²x dx = tan x + C',
        explanation: '∫sin x dx = −cos x + C, ∫cos x dx = sin x + C, ∫tan x dx = ln|sec x| + C, ∫sec x dx = ln|sec x + tan x| + C.'
      },
      {
        name: 'Nine Standard Special Integrals (Quadratic & Root Denominators)',
        expression: '∫dx/(x²+a²) = (1/a)tan⁻¹(x/a)+C   |   ∫dx/√(a²−x²) = sin⁻¹(x/a)+C   |   ∫dx/(x²−a²) = (1/2a)ln|(x−a)/(x+a)|+C   |   ∫dx/√(x²±a²) = ln|x + √(x²±a²)|+C',
        explanation: 'Also: ∫√(a² − x²) dx = (x/2)√(a² − x²) + (a²/2)sin⁻¹(x/a) + C.'
      },
      {
        name: 'Integration by Parts (ILATE Rule) & Cancellation Integral',
        expression: '∫u·v dx = u∫v dx − ∫[ (du/dx) · ∫v dx ] dx   |   ∫eˣ [f(x) + f′(x)] dx = eˣ·f(x) + C',
        explanation: 'Choose first function u using ILATE order: Inverse, Logarithmic, Algebraic, Trigonometric, Exponential.'
      },
      {
        name: 'Definite Integral Properties (King’s Property) & Area Under Curves',
        expression: '∫(a to b) f(x)dx = F(b) − F(a)   |   King’s Rule: ∫(a to b) f(x)dx = ∫(a to b) f(a + b − x)dx   |   Area = ∫(a to b) |y| dx',
        explanation: 'For even/odd functions on [−a, a]: ∫(−a to a) f(x)dx = 2∫(0 to a) f(x)dx if even, and 0 if odd.'
      },
      {
        name: 'First-Order Linear Differential Equation & Integrating Factor (I.F.)',
        expression: 'dy/dx + P(x)y = Q(x)   ⇒   I.F. = e^(∫P dx)   ⇒   General Solution: y · (I.F.) = ∫ Q · (I.F.) dx + C',
        explanation: 'Order is highest derivative order; Degree is power of highest-order derivative when polynomial in derivatives.'
      }
    ]
  },
  {
    id: 'c12-ch4',
    classLevel: 'Class 12',
    chapterNo: 4,
    chapterTitle: 'Vector Algebra, 3D Geometry & Probability (Bayes’ Theorem)',
    subject: 'Mathematics (NCERT)',
    topicTags: ['Vectors', '3D Geometry', 'Bayes Theorem'],
    formulas: [
      {
        name: 'Scalar (Dot) Product, Vector (Cross) Product & Projection',
        expression: 'a⃗·b⃗ = |a⃗||b⃗|cos θ = a₁b₁+a₂b₂+a₃b₃   |   Proj of a⃗ on b⃗ = (a⃗·b⃗)/|b⃗|   |   |a⃗ × b⃗| = |a⃗||b⃗|sin θ   |   Area(Δ) = ½|a⃗ × b⃗|',
        explanation: 'a⃗ ⊥ b⃗ ⇔ a⃗·b⃗ = 0;   a⃗ ∥ b⃗ ⇔ a⃗ × b⃗ = 0⃗.'
      },
      {
        name: '3D Geometry — Direction Cosines, Line Equation & Skew Lines Distance',
        expression: 'l² + m² + n² = 1   |   Line: (x−x₁)/a = (y−y₁)/b = (z−z₁)/c   |   Skew Distance d = |(a⃗₂ − a⃗₁) · (b⃗₁ × b⃗₂)| / |b⃗₁ × b⃗₂|',
        explanation: 'Angle between two 3D lines: cos θ = |a₁a₂ + b₁b₂ + c₁c₂| / [√(∑a₁²) √(∑a₂²)].'
      },
      {
        name: 'Conditional Probability, Total Probability & Bayes’ Theorem',
        expression: 'P(A|B) = P(A ∩ B) / P(B)   |   Independent: P(A ∩ B) = P(A)P(B)   |   Bayes: P(Eᵢ|A) = [P(Eᵢ)P(A|Eᵢ)] / [∑ P(Eⱼ)P(A|Eⱼ)]',
        explanation: 'Finds reverse conditional probability of cause Eᵢ given that event A has occurred.'
      }
    ]
  }
];

// ============================================================================
// COMPLETE 118-ELEMENT IUPAC PERIODIC TABLE DATASET
// ============================================================================

export interface PeriodicElement118 {
  z: number;
  symbol: string;
  name: string;
  mass: string;
  group: number; // 1..18 (0 for Lanthanides/Actinides row)
  period: number; // 1..7 (8 = Lanthanide row, 9 = Actinide row)
  block: 's' | 'p' | 'd' | 'f';
  category:
    | 'Alkali Metal'
    | 'Alkaline Earth'
    | 'Transition Metal'
    | 'Post-Transition'
    | 'Metalloid'
    | 'Nonmetal'
    | 'Halogen'
    | 'Noble Gas'
    | 'Lanthanide'
    | 'Actinide';
  config: string;
}

const RAW_118_ELEMENTS: [number, string, string, string, number, number, 's' | 'p' | 'd' | 'f', PeriodicElement118['category'], string][] = [
  [1, 'H', 'Hydrogen', '1.008', 1, 1, 's', 'Nonmetal', '1s¹'],
  [2, 'He', 'Helium', '4.0026', 18, 1, 's', 'Noble Gas', '1s²'],
  [3, 'Li', 'Lithium', '6.94', 1, 2, 's', 'Alkali Metal', '[He] 2s¹'],
  [4, 'Be', 'Beryllium', '9.0122', 2, 2, 's', 'Alkaline Earth', '[He] 2s²'],
  [5, 'B', 'Boron', '10.81', 13, 2, 'p', 'Metalloid', '[He] 2s² 2p¹'],
  [6, 'C', 'Carbon', '12.011', 14, 2, 'p', 'Nonmetal', '[He] 2s² 2p²'],
  [7, 'N', 'Nitrogen', '14.007', 15, 2, 'p', 'Nonmetal', '[He] 2s² 2p³'],
  [8, 'O', 'Oxygen', '15.999', 16, 2, 'p', 'Nonmetal', '[He] 2s² 2p⁴'],
  [9, 'F', 'Fluorine', '18.998', 17, 2, 'p', 'Halogen', '[He] 2s² 2p⁵'],
  [10, 'Ne', 'Neon', '20.180', 18, 2, 'p', 'Noble Gas', '[He] 2s² 2p⁶'],
  [11, 'Na', 'Sodium', '22.990', 1, 3, 's', 'Alkali Metal', '[Ne] 3s¹'],
  [12, 'Mg', 'Magnesium', '24.305', 2, 3, 's', 'Alkaline Earth', '[Ne] 3s²'],
  [13, 'Al', 'Aluminium', '26.982', 13, 3, 'p', 'Post-Transition', '[Ne] 3s² 3p¹'],
  [14, 'Si', 'Silicon', '28.085', 14, 3, 'p', 'Metalloid', '[Ne] 3s² 3p²'],
  [15, 'P', 'Phosphorus', '30.974', 15, 3, 'p', 'Nonmetal', '[Ne] 3s² 3p³'],
  [16, 'S', 'Sulfur', '32.06', 16, 3, 'p', 'Nonmetal', '[Ne] 3s² 3p⁴'],
  [17, 'Cl', 'Chlorine', '35.45', 17, 3, 'p', 'Halogen', '[Ne] 3s² 3p⁵'],
  [18, 'Ar', 'Argon', '39.948', 18, 3, 'p', 'Noble Gas', '[Ne] 3s² 3p⁶'],
  [19, 'K', 'Potassium', '39.098', 1, 4, 's', 'Alkali Metal', '[Ar] 4s¹'],
  [20, 'Ca', 'Calcium', '40.078', 2, 4, 's', 'Alkaline Earth', '[Ar] 4s²'],
  [21, 'Sc', 'Scandium', '44.956', 3, 4, 'd', 'Transition Metal', '[Ar] 3d¹ 4s²'],
  [22, 'Ti', 'Titanium', '47.867', 4, 4, 'd', 'Transition Metal', '[Ar] 3d² 4s²'],
  [23, 'V', 'Vanadium', '50.942', 5, 4, 'd', 'Transition Metal', '[Ar] 3d³ 4s²'],
  [24, 'Cr', 'Chromium', '51.996', 6, 4, 'd', 'Transition Metal', '[Ar] 3d⁵ 4s¹'],
  [25, 'Mn', 'Manganese', '54.938', 7, 4, 'd', 'Transition Metal', '[Ar] 3d⁵ 4s²'],
  [26, 'Fe', 'Iron', '55.845', 8, 4, 'd', 'Transition Metal', '[Ar] 3d⁶ 4s²'],
  [27, 'Co', 'Cobalt', '58.933', 9, 4, 'd', 'Transition Metal', '[Ar] 3d⁷ 4s²'],
  [28, 'Ni', 'Nickel', '58.693', 10, 4, 'd', 'Transition Metal', '[Ar] 3d⁸ 4s²'],
  [29, 'Cu', 'Copper', '63.546', 11, 4, 'd', 'Transition Metal', '[Ar] 3d¹⁰ 4s¹'],
  [30, 'Zn', 'Zinc', '65.38', 12, 4, 'd', 'Transition Metal', '[Ar] 3d¹⁰ 4s²'],
  [31, 'Ga', 'Gallium', '69.723', 13, 4, 'p', 'Post-Transition', '[Ar] 3d¹⁰ 4s² 4p¹'],
  [32, 'Ge', 'Germanium', '72.630', 14, 4, 'p', 'Metalloid', '[Ar] 3d¹⁰ 4s² 4p²'],
  [33, 'As', 'Arsenic', '74.922', 15, 4, 'p', 'Metalloid', '[Ar] 3d¹⁰ 4s² 4p³'],
  [34, 'Se', 'Selenium', '78.971', 16, 4, 'p', 'Nonmetal', '[Ar] 3d¹⁰ 4s² 4p⁴'],
  [35, 'Br', 'Bromine', '79.904', 17, 4, 'p', 'Halogen', '[Ar] 3d¹⁰ 4s² 4p⁵'],
  [36, 'Kr', 'Krypton', '83.798', 18, 4, 'p', 'Noble Gas', '[Ar] 3d¹⁰ 4s² 4p⁶'],
  [37, 'Rb', 'Rubidium', '85.468', 1, 5, 's', 'Alkali Metal', '[Kr] 5s¹'],
  [38, 'Sr', 'Strontium', '87.62', 2, 5, 's', 'Alkaline Earth', '[Kr] 5s²'],
  [39, 'Y', 'Yttrium', '88.906', 3, 5, 'd', 'Transition Metal', '[Kr] 4d¹ 5s²'],
  [40, 'Zr', 'Zirconium', '91.224', 4, 5, 'd', 'Transition Metal', '[Kr] 4d² 5s²'],
  [41, 'Nb', 'Niobium', '92.906', 5, 5, 'd', 'Transition Metal', '[Kr] 4d⁴ 5s¹'],
  [42, 'Mo', 'Molybdenum', '95.95', 6, 5, 'd', 'Transition Metal', '[Kr] 4d⁵ 5s¹'],
  [43, 'Tc', 'Technetium', '(98)', 7, 5, 'd', 'Transition Metal', '[Kr] 4d⁵ 5s²'],
  [44, 'Ru', 'Ruthenium', '101.07', 8, 5, 'd', 'Transition Metal', '[Kr] 4d⁷ 5s¹'],
  [45, 'Rh', 'Rhodium', '102.91', 9, 5, 'd', 'Transition Metal', '[Kr] 4d⁸ 5s¹'],
  [46, 'Pd', 'Palladium', '106.42', 10, 5, 'd', 'Transition Metal', '[Kr] 4d¹⁰'],
  [47, 'Ag', 'Silver', '107.87', 11, 5, 'd', 'Transition Metal', '[Kr] 4d¹⁰ 5s¹'],
  [48, 'Cd', 'Cadmium', '112.41', 12, 5, 'd', 'Transition Metal', '[Kr] 4d¹⁰ 5s²'],
  [49, 'In', 'Indium', '114.82', 13, 5, 'p', 'Post-Transition', '[Kr] 4d¹⁰ 5s² 5p¹'],
  [50, 'Sn', 'Tin', '118.71', 14, 5, 'p', 'Post-Transition', '[Kr] 4d¹⁰ 5s² 5p²'],
  [51, 'Sb', 'Antimony', '121.76', 15, 5, 'p', 'Metalloid', '[Kr] 4d¹⁰ 5s² 5p³'],
  [52, 'Te', 'Tellurium', '127.60', 16, 5, 'p', 'Metalloid', '[Kr] 4d¹⁰ 5s² 5p⁴'],
  [53, 'I', 'Iodine', '126.90', 17, 5, 'p', 'Halogen', '[Kr] 4d¹⁰ 5s² 5p⁵'],
  [54, 'Xe', 'Xenon', '131.29', 18, 5, 'p', 'Noble Gas', '[Kr] 4d¹⁰ 5s² 5p⁶'],
  [55, 'Cs', 'Cesium', '132.91', 1, 6, 's', 'Alkali Metal', '[Xe] 6s¹'],
  [56, 'Ba', 'Barium', '137.33', 2, 6, 's', 'Alkaline Earth', '[Xe] 6s²'],
  // Lanthanides 57-71
  [57, 'La', 'Lanthanum', '138.91', 3, 8, 'f', 'Lanthanide', '[Xe] 5d¹ 6s²'],
  [58, 'Ce', 'Cerium', '140.12', 4, 8, 'f', 'Lanthanide', '[Xe] 4f¹ 5d¹ 6s²'],
  [59, 'Pr', 'Praseodymium', '140.91', 5, 8, 'f', 'Lanthanide', '[Xe] 4f³ 6s²'],
  [60, 'Nd', 'Neodymium', '144.24', 6, 8, 'f', 'Lanthanide', '[Xe] 4f⁴ 6s²'],
  [61, 'Pm', 'Promethium', '(145)', 7, 8, 'f', 'Lanthanide', '[Xe] 4f⁵ 6s²'],
  [62, 'Sm', 'Samarium', '150.36', 8, 8, 'f', 'Lanthanide', '[Xe] 4f⁶ 6s²'],
  [63, 'Eu', 'Europium', '151.96', 9, 8, 'f', 'Lanthanide', '[Xe] 4f⁷ 6s²'],
  [64, 'Gd', 'Gadolinium', '157.25', 10, 8, 'f', 'Lanthanide', '[Xe] 4f⁷ 5d¹ 6s²'],
  [65, 'Tb', 'Terbium', '158.93', 11, 8, 'f', 'Lanthanide', '[Xe] 4f⁹ 6s²'],
  [66, 'Dy', 'Dysprosium', '162.50', 12, 8, 'f', 'Lanthanide', '[Xe] 4f¹⁰ 6s²'],
  [67, 'Ho', 'Holmium', '164.93', 13, 8, 'f', 'Lanthanide', '[Xe] 4f¹¹ 6s²'],
  [68, 'Er', 'Erbium', '167.26', 14, 8, 'f', 'Lanthanide', '[Xe] 4f¹² 6s²'],
  [69, 'Tm', 'Thulium', '168.93', 15, 8, 'f', 'Lanthanide', '[Xe] 4f¹³ 6s²'],
  [70, 'Yb', 'Ytterbium', '173.05', 16, 8, 'f', 'Lanthanide', '[Xe] 4f¹⁴ 6s²'],
  [71, 'Lu', 'Lutetium', '174.97', 17, 8, 'f', 'Lanthanide', '[Xe] 4f¹⁴ 5d¹ 6s²'],
  // Resume Period 6 (72-86)
  [72, 'Hf', 'Hafnium', '178.49', 4, 6, 'd', 'Transition Metal', '[Xe] 4f¹⁴ 5d² 6s²'],
  [73, 'Ta', 'Tantalum', '180.95', 5, 6, 'd', 'Transition Metal', '[Xe] 4f¹⁴ 5d³ 6s²'],
  [74, 'W', 'Tungsten', '183.84', 6, 6, 'd', 'Transition Metal', '[Xe] 4f¹⁴ 5d⁴ 6s²'],
  [75, 'Re', 'Rhenium', '186.21', 7, 6, 'd', 'Transition Metal', '[Xe] 4f¹⁴ 5d⁵ 6s²'],
  [76, 'Os', 'Osmium', '190.23', 8, 6, 'd', 'Transition Metal', '[Xe] 4f¹⁴ 5d⁶ 6s²'],
  [77, 'Ir', 'Iridium', '192.22', 9, 6, 'd', 'Transition Metal', '[Xe] 4f¹⁴ 5d⁷ 6s²'],
  [78, 'Pt', 'Platinum', '195.08', 10, 6, 'd', 'Transition Metal', '[Xe] 4f¹⁴ 5d⁹ 6s¹'],
  [79, 'Au', 'Gold', '196.97', 11, 6, 'd', 'Transition Metal', '[Xe] 4f¹⁴ 5d¹⁰ 6s¹'],
  [80, 'Hg', 'Mercury', '200.59', 12, 6, 'd', 'Transition Metal', '[Xe] 4f¹⁴ 5d¹⁰ 6s²'],
  [81, 'Tl', 'Thallium', '204.38', 13, 6, 'p', 'Post-Transition', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹'],
  [82, 'Pb', 'Lead', '207.2', 14, 6, 'p', 'Post-Transition', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²'],
  [83, 'Bi', 'Bismuth', '208.98', 15, 6, 'p', 'Post-Transition', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³'],
  [84, 'Po', 'Polonium', '(209)', 16, 6, 'p', 'Post-Transition', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴'],
  [85, 'At', 'Astatine', '(210)', 17, 6, 'p', 'Halogen', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵'],
  [86, 'Rn', 'Radon', '(222)', 18, 6, 'p', 'Noble Gas', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶'],
  // Period 7 (87-88)
  [87, 'Fr', 'Francium', '(223)', 1, 7, 's', 'Alkali Metal', '[Rn] 7s¹'],
  [88, 'Ra', 'Radium', '(226)', 2, 7, 's', 'Alkaline Earth', '[Rn] 7s²'],
  // Actinides 89-103
  [89, 'Ac', 'Actinium', '(227)', 3, 9, 'f', 'Actinide', '[Rn] 6d¹ 7s²'],
  [90, 'Th', 'Thorium', '232.04', 4, 9, 'f', 'Actinide', '[Rn] 6d² 7s²'],
  [91, 'Pa', 'Protactinium', '231.04', 5, 9, 'f', 'Actinide', '[Rn] 5f² 6d¹ 7s²'],
  [92, 'U', 'Uranium', '238.03', 6, 9, 'f', 'Actinide', '[Rn] 5f³ 6d¹ 7s²'],
  [93, 'Np', 'Neptunium', '(237)', 7, 9, 'f', 'Actinide', '[Rn] 5f⁴ 6d¹ 7s²'],
  [94, 'Pu', 'Plutonium', '(244)', 8, 9, 'f', 'Actinide', '[Rn] 5f⁶ 7s²'],
  [95, 'Am', 'Americium', '(243)', 9, 9, 'f', 'Actinide', '[Rn] 5f⁷ 7s²'],
  [96, 'Cm', 'Curium', '(247)', 10, 9, 'f', 'Actinide', '[Rn] 5f⁷ 6d¹ 7s²'],
  [97, 'Bk', 'Berkelium', '(247)', 11, 9, 'f', 'Actinide', '[Rn] 5f⁹ 7s²'],
  [98, 'Cf', 'Californium', '(251)', 12, 9, 'f', 'Actinide', '[Rn] 5f¹⁰ 7s²'],
  [99, 'Es', 'Einsteinium', '(252)', 13, 9, 'f', 'Actinide', '[Rn] 5f¹¹ 7s²'],
  [100, 'Fm', 'Fermium', '(257)', 14, 9, 'f', 'Actinide', '[Rn] 5f¹² 7s²'],
  [101, 'Md', 'Mendelevium', '(258)', 15, 9, 'f', 'Actinide', '[Rn] 5f¹³ 7s²'],
  [102, 'No', 'Nobelium', '(259)', 16, 9, 'f', 'Actinide', '[Rn] 5f¹⁴ 7s²'],
  [103, 'Lr', 'Lawrencium', '(266)', 17, 9, 'f', 'Actinide', '[Rn] 5f¹⁴ 7s² 7p¹'],
  // Resume Period 7 (104-118)
  [104, 'Rf', 'Rutherfordium', '(267)', 4, 7, 'd', 'Transition Metal', '[Rn] 5f¹⁴ 6d² 7s²'],
  [105, 'Db', 'Dubnium', '(268)', 5, 7, 'd', 'Transition Metal', '[Rn] 5f¹⁴ 6d³ 7s²'],
  [106, 'Sg', 'Seaborgium', '(269)', 6, 7, 'd', 'Transition Metal', '[Rn] 5f¹⁴ 6d⁴ 7s²'],
  [107, 'Bh', 'Bohrium', '(270)', 7, 7, 'd', 'Transition Metal', '[Rn] 5f¹⁴ 6d⁵ 7s²'],
  [108, 'Hs', 'Hassium', '(277)', 8, 7, 'd', 'Transition Metal', '[Rn] 5f¹⁴ 6d⁶ 7s²'],
  [109, 'Mt', 'Meitnerium', '(278)', 9, 7, 'd', 'Transition Metal', '[Rn] 5f¹⁴ 6d⁷ 7s²'],
  [110, 'Ds', 'Darmstadtium', '(281)', 10, 7, 'd', 'Transition Metal', '[Rn] 5f¹⁴ 6d⁸ 7s²'],
  [111, 'Rg', 'Roentgenium', '(282)', 11, 7, 'd', 'Transition Metal', '[Rn] 5f¹⁴ 6d⁹ 7s²'],
  [112, 'Cn', 'Copernicium', '(285)', 12, 7, 'd', 'Transition Metal', '[Rn] 5f¹⁴ 6d¹⁰ 7s²'],
  [113, 'Nh', 'Nihonium', '(286)', 13, 7, 'p', 'Post-Transition', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹'],
  [114, 'Fl', 'Flerovium', '(289)', 14, 7, 'p', 'Post-Transition', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²'],
  [115, 'Mc', 'Moscovium', '(290)', 15, 7, 'p', 'Post-Transition', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³'],
  [116, 'Lv', 'Livermorium', '(293)', 16, 7, 'p', 'Post-Transition', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴'],
  [117, 'Ts', 'Tennessine', '(294)', 17, 7, 'p', 'Halogen', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵'],
  [118, 'Og', 'Oganesson', '(294)', 18, 7, 'p', 'Noble Gas', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶']
];

export const FULL_118_PERIODIC_TABLE: PeriodicElement118[] = RAW_118_ELEMENTS.map(
  ([z, symbol, name, mass, group, period, block, category, config]) => ({
    z,
    symbol,
    name,
    mass,
    group,
    period,
    block,
    category,
    config
  })
);
