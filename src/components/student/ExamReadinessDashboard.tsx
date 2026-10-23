import React, { useState, useMemo, useEffect } from 'react';
import {
  Student,
  StudentAcademicSummary,
  StudyMaterial
} from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';

interface ExamReadinessDashboardProps {
  currentStudent: Student;
  currentStudentAcademics: StudentAcademicSummary;
  studyMaterials: StudyMaterial[];
  setReadingMaterial: (mat: StudyMaterial) => void;
  onJumpToFilteredVault: (subjectFilter: string) => void;
  handleSelectNavTab: (tabId: string) => void;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

interface UpcomingAssessment {
  id: string;
  subject: string;
  examTitle: string;
  examType: 'Unit Assessment IV' | 'Pre-Midterm Practical' | 'Half-Yearly / Mid-Term' | 'Board Mock';
  examDateISO: string;
  displayDate: string;
  duration: string;
  maxMarks: number;
  hallRoom: string;
  syllabusTopics: string[];
  highYieldFocus: string;
}

const UPCOMING_ASSESSMENTS: UpcomingAssessment[] = [
  {
    id: 'EXM-201',
    subject: 'Science (Physics & Chem)',
    examTitle: 'Physics Ray Optics & Acid-Base Titration Assessment',
    examType: 'Unit Assessment IV',
    examDateISO: '2026-10-24T09:00:00',
    displayDate: 'Sat, 24 Oct 2026 · 09:00 AM',
    duration: '90 Mins',
    maxMarks: 100,
    hallRoom: 'Science Block Hall 204',
    syllabusTopics: [
      'Snell’s Law & Refractive Index Numericals',
      'Concave/Convex Mirror & Lens Sign Conventions',
      'pH Scale, Neutralization & Salt Recrystallization'
    ],
    highYieldFocus: 'Practice sign conventions for 1/v - 1/u = 1/f and pH = -log[H⁺] numericals.'
  },
  {
    id: 'EXM-202',
    subject: 'Mathematics (NCERT)',
    examTitle: 'Quadratic Equations, AP & Trigonometry Sprint Exam',
    examType: 'Unit Assessment IV',
    examDateISO: '2026-10-29T09:00:00',
    displayDate: 'Thu, 29 Oct 2026 · 09:00 AM',
    duration: '120 Mins',
    maxMarks: 100,
    hallRoom: 'Main Examination Hall A',
    syllabusTopics: [
      'Discriminant & Nature of Roots (b² - 4ac)',
      'Trigonometric Identities (Ex 8.4 Proofs)',
      'Heights & Distances Angle of Elevation Word Problems'
    ],
    highYieldFocus: 'Focus on NCERT Ex 8.4 identity proofs and completing-the-square word problems.'
  },
  {
    id: 'EXM-203',
    subject: 'Computer Science & AI',
    examTitle: 'CBSE Code 402 Python Algorithms & SQL Joins Evaluation',
    examType: 'Pre-Midterm Practical',
    examDateISO: '2026-11-04T10:30:00',
    displayDate: 'Wed, 04 Nov 2026 · 10:30 AM',
    duration: '120 Mins',
    maxMarks: 100,
    hallRoom: 'AI & Robotics Lab 102',
    syllabusTopics: [
      'Bubble Sort & Binary Search Dry-Run Trace Tables',
      'SQL GROUP BY, HAVING & INNER JOIN Queries',
      'Python List Comprehension & String Slicing'
    ],
    highYieldFocus: 'Revise SQL HAVING vs WHERE clauses and Binary Search midpoint loop conditions.'
  },
  {
    id: 'EXM-204',
    subject: 'Social Studies & History',
    examTitle: 'Nationalism in India & Federal Constitutional Civics',
    examType: 'Half-Yearly / Mid-Term',
    examDateISO: '2026-11-16T09:00:00',
    displayDate: 'Mon, 16 Nov 2026 · 09:00 AM',
    duration: '180 Mins',
    maxMarks: 100,
    hallRoom: 'Main Examination Hall B',
    syllabusTopics: [
      '1915–1947 Gandhian Satyagraha & Dandi March Map Work',
      'Union, State & Concurrent Legislative Lists (7th Schedule)',
      'Resource Planning & Indian Agricultural Cropping Patterns'
    ],
    highYieldFocus: 'Memorize 1920 Nagpur & Lahore Congress session map locations and 7th Schedule lists.'
  },
  {
    id: 'EXM-205',
    subject: 'English Literature',
    examTitle: 'First Flight Prose/Poetry & Analytical Writing Paper',
    examType: 'Half-Yearly / Mid-Term',
    examDateISO: '2026-11-19T09:00:00',
    displayDate: 'Thu, 19 Nov 2026 · 09:00 AM',
    duration: '180 Mins',
    maxMarks: 100,
    hallRoom: 'Humanities Wing Room 108',
    syllabusTopics: [
      'First Flight: A Letter to God, Nelson Mandela & Robert Frost Poems',
      'Analytical Paragraph Writing from Data Charts',
      'Reported Speech, Modals & Subject-Verb Concord'
    ],
    highYieldFocus: 'Review poetic devices (metaphor, enjambment, alliteration) and formal Editor letter format.'
  }
];

export const ExamReadinessDashboard: React.FC<ExamReadinessDashboardProps> = ({
  currentStudent,
  currentStudentAcademics,
  studyMaterials,
  setReadingMaterial,
  onJumpToFilteredVault,
  handleSelectNavTab,
  handleAwardBonusXP,
  playUISound,
  showToast
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>('EXM-201');
  const [subjectDropdownFilter, setSubjectDropdownFilter] = useState<string>('All Subjects');
  const [reviewedMaterialIds, setReviewedMaterialIds] = useState<string[]>(['MAT-5']);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({
    'EXM-201-0': true,
    'EXM-203-0': true
  });

  // Live countdown clock
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const referenceNowMs = useMemo(() => {
    return new Date('2026-10-18T09:05:00').getTime() + elapsedSeconds * 1000;
  }, [elapsedSeconds]);

  const enrichedAssessments = useMemo(() => {
    return UPCOMING_ASSESSMENTS.map(assessment => {
      const subMark =
        currentStudentAcademics.subjectsList.find(
          s => s.name.toLowerCase() === assessment.subject.toLowerCase()
        ) || currentStudentAcademics.subjectsList[0];

      const u1 = Number(subMark?.u1 || 70);
      const u2 = Number(subMark?.u2 || 72);
      const u3 = Number(subMark?.u3 || 74);
      const unitTotal = u1 + u2 + u3;
      const unitAvgPct = Number(((unitTotal / 300) * 100).toFixed(1));

      const trajectoryDelta = u3 - u1;
      const momentumScore = Number((trajectoryDelta * 0.35).toFixed(1));
      const spread = Math.max(u1, u2, u3) - Math.min(u1, u2, u3);
      const consistencyBonus = Math.max(0, Number((4 - spread * 0.25).toFixed(1)));

      const subjectMaterials = studyMaterials.filter(
        m =>
          m.subject.toLowerCase() === assessment.subject.toLowerCase() ||
          assessment.subject.toLowerCase().includes(m.subject.toLowerCase())
      );

      const reviewedCount = subjectMaterials.filter(m => reviewedMaterialIds.includes(m.id)).length;
      const checkedSyllabusCount = assessment.syllabusTopics.filter(
        (_, idx) => completedTopics[`${assessment.id}-${idx}`]
      ).length;

      const prepBoost = reviewedCount * 3.5 + checkedSyllabusCount * 2.0;
      const rawReadiness = unitAvgPct + momentumScore + consistencyBonus + prepBoost;
      const readinessScore = Math.max(35, Math.min(99, Number(rawReadiness.toFixed(1))));

      const targetMs = new Date(assessment.examDateISO).getTime();
      const diffMs = Math.max(0, targetMs - referenceNowMs);
      const daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minsLeft = Math.floor((diffMs / (1000 * 60)) % 60);
      const secsLeft = Math.floor((diffMs / 1000) % 60);

      let readinessTier: 'Exam Ready' | 'Moderate Readiness' | 'Priority Revision' = 'Exam Ready';
      if (readinessScore < 72) readinessTier = 'Priority Revision';
      else if (readinessScore < 85) readinessTier = 'Moderate Readiness';

      return {
        ...assessment,
        u1,
        u2,
        u3,
        unitTotal,
        unitAvgPct,
        trajectoryDelta,
        prepBoost: Number(prepBoost.toFixed(1)),
        readinessScore,
        readinessTier,
        daysLeft,
        hoursLeft,
        minsLeft,
        secsLeft,
        subjectMaterials,
        reviewedCount,
        checkedSyllabusCount
      };
    });
  }, [
    currentStudentAcademics.subjectsList,
    studyMaterials,
    reviewedMaterialIds,
    completedTopics,
    referenceNowMs
  ]);

  const filteredAssessments = useMemo(() => {
    if (subjectDropdownFilter === 'All Subjects') return enrichedAssessments;
    return enrichedAssessments.filter(a => a.subject === subjectDropdownFilter);
  }, [enrichedAssessments, subjectDropdownFilter]);

  const activeExam = useMemo(() => {
    return (
      enrichedAssessments.find(a => a.id === selectedExamId) ||
      filteredAssessments[0] ||
      enrichedAssessments[0]
    );
  }, [enrichedAssessments, filteredAssessments, selectedExamId]);

  const overallReadinessIndex = useMemo(() => {
    const sum = enrichedAssessments.reduce((acc, a) => acc + a.readinessScore, 0);
    return Number((sum / enrichedAssessments.length).toFixed(1));
  }, [enrichedAssessments]);

  const totalSyllabusChecked = useMemo(() => {
    return Object.values(completedTopics).filter(Boolean).length;
  }, [completedTopics]);

  const handleToggleTopic = (examId: string, idx: number, topicTitle: string) => {
    const key = `${examId}-${idx}`;
    const nextState = !completedTopics[key];
    playUISound(nextState ? 'success' : 'click');
    setCompletedTopics(prev => ({ ...prev, [key]: nextState }));
    if (nextState) {
      handleAwardBonusXP(currentStudent.id, 15, `Revised Exam Syllabus Topic: ${topicTitle}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* =====================================================================
          ROW 1: COMPACT 4-KPI READINESS SUMMARY STRIP
         ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[11px] text-[#686052]">
            <span className="font-semibold">Overall Exam Readiness</span>
            <span className="font-mono font-semibold text-[#0A4D44]">
              {overallReadinessIndex >= 82 ? 'Exam Ready' : 'In Progress'}
            </span>
          </div>
          <div className="text-xl font-mono font-bold text-[#0A4D44] mt-1 tabular-nums">
            {overallReadinessIndex}%
          </div>
          <div className="h-1.5 rounded-full bg-[#EAE2D3] mt-2 overflow-hidden">
            <div className="h-full bg-[#0A4D44]" style={{ width: `${overallReadinessIndex}%` }} />
          </div>
        </div>

        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[11px] text-[#686052]">
            <span className="font-semibold">Next Paper Countdown</span>
            <span className="font-mono text-[#9A6B26] font-semibold">24 Oct</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#1C2A27] mt-1 tabular-nums">
            {enrichedAssessments[0].daysLeft}d : {String(enrichedAssessments[0].hoursLeft).padStart(2, '0')}h :{' '}
            {String(enrichedAssessments[0].minsLeft).padStart(2, '0')}m :{' '}
            {String(enrichedAssessments[0].secsLeft).padStart(2, '0')}s
          </div>
          <p className="text-[11px] text-[#686052] truncate mt-1">
            {enrichedAssessments[0].subject} · {enrichedAssessments[0].hallRoom}
          </p>
        </div>

        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[11px] text-[#686052]">
            <span className="font-semibold">Syllabus Topics Revised</span>
            <span className="font-mono text-[#0E6B5E] font-semibold">+2% / Topic</span>
          </div>
          <div className="text-xl font-mono font-bold text-[#1C2A27] mt-1 tabular-nums">
            {totalSyllabusChecked} / {UPCOMING_ASSESSMENTS.length * 3}
          </div>
          <p className="text-[11px] text-[#686052] mt-1">Check off topics on the right to boost score</p>
        </div>

        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[11px] text-[#686052]">
            <span className="font-semibold">Study Notes Reviewed</span>
            <span className="font-mono text-[#0A4D44] font-semibold">+3.5% / Note</span>
          </div>
          <div className="text-xl font-mono font-bold text-[#1C2A27] mt-1 tabular-nums">
            {reviewedMaterialIds.length} / {studyMaterials.length}
          </div>
          <p className="text-[11px] text-[#686052] mt-1">Linked directly to Study Vault PDFs</p>
        </div>
      </div>

      {/* =====================================================================
          ROW 2: STICKY SINGLE-LINE FILTER & SHORTCUT BAR (DROPDOWN SELECTOR)
         ===================================================================== */}
      <div className="sticky top-2 z-30 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-[#1C2A27]">Filter Subject:</label>
          <select
            value={subjectDropdownFilter}
            onChange={e => {
              playUISound('click');
              const val = e.target.value;
              setSubjectDropdownFilter(val);
              if (val !== 'All Subjects') {
                const match = enrichedAssessments.find(a => a.subject === val);
                if (match) setSelectedExamId(match.id);
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg text-[#1C2A27] focus:outline-none focus:border-[#0A4D44]"
          >
            <option value="All Subjects">All 5 Assessment Subjects</option>
            {UPCOMING_ASSESSMENTS.map(a => (
              <option key={a.id} value={a.subject}>
                {a.subject} ({a.displayDate.split(' · ')[0]})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelectNavTab('stu-arcade')}
            className="px-3 py-1.5 rounded-lg bg-[#FFFDF9] hover:bg-[#F5F0E6] border border-[#DDD4C2] text-[#1C2A27] text-xs font-semibold transition cursor-pointer"
          >
            NCERT Formula Sheet →
          </button>
          <button
            type="button"
            onClick={() => onJumpToFilteredVault(activeExam.subject)}
            className="px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold transition cursor-pointer"
          >
            Open {activeExam.subject.split(' ')[0]} Study Vault →
          </button>
        </div>
      </div>

      {/* =====================================================================
          ROW 3: CLEAN 2-COLUMN SPLIT WORKSPACE (LEFT: SCHEDULE | RIGHT: PREP)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT 5 COLS: COMPACT SELECTABLE EXAM SCHEDULE LIST */}
        <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#F5F0E6] border-b border-[#DDD4C2] flex items-center justify-between">
            <span className="text-xs font-bold text-[#1C2A27]">Upcoming Assessments ({filteredAssessments.length})</span>
            <span className="text-[11px] font-mono text-[#686052]">Click to Inspect</span>
          </div>

          <div className="divide-y divide-[#EAE2D3]">
            {filteredAssessments.map(exam => {
              const isSelected = activeExam.id === exam.id;
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    setSelectedExamId(exam.id);
                  }}
                  className={`w-full text-left p-3.5 transition cursor-pointer space-y-2 ${
                    isSelected ? 'bg-[#0A4D44] text-white' : 'hover:bg-[#F5F0E6]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#1C2A27]'}`}>{exam.subject}</span>
                    <span className={`text-xs font-mono font-bold tabular-nums ${isSelected ? 'text-emerald-200' : 'text-[#0A4D44]'}`}>
                      {exam.readinessScore}% Ready
                    </span>
                  </div>

                  <p className={`text-xs truncate ${isSelected ? 'text-emerald-100' : 'text-[#4A443B]'}`}>{exam.examTitle}</p>

                  <div className={`flex items-center justify-between text-[11px] font-mono ${isSelected ? 'text-emerald-200' : 'text-[#686052]'}`}>
                    <span>{exam.displayDate}</span>
                    <span>{exam.daysLeft}d {exam.hoursLeft}h left</span>
                  </div>

                  <div className={`h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-emerald-900/60' : 'bg-[#EAE2D3]'}`}>
                    <div
                      className={`h-full rounded-full ${
                        isSelected
                          ? 'bg-emerald-300'
                          : exam.readinessScore >= 85
                          ? 'bg-[#0A4D44]'
                          : exam.readinessScore >= 72
                          ? 'bg-[#D97706]'
                          : 'bg-[#DC2626]'
                      }`}
                      style={{ width: `${exam.readinessScore}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT 7 COLS: SELECTED EXAM SYLLABUS CHECKLIST, UNIT TEST TRAJECTORY & NOTES */}
        <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-4 space-y-4">
          {/* Selected Exam Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#EAE2D3]">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#0E6B5E] font-semibold">
                <span>{activeExam.id}</span>
                <span>·</span>
                <span>{activeExam.examType}</span>
                <span>·</span>
                <span>{activeExam.hallRoom}</span>
              </div>
              <h2 className="text-base font-bold text-[#1C2A27] mt-0.5">{activeExam.subject}</h2>
              <p className="text-xs text-[#686052]">{activeExam.examTitle}</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-[#686052] uppercase block">Readiness Index</span>
              <strong className="text-xl font-bold text-[#0A4D44] tabular-nums">{activeExam.readinessScore}%</strong>
              <span className="block text-[10px] text-[#0E6B5E]">{activeExam.readinessTier}</span>
            </div>
          </div>

          {/* Compact Unit Test Baseline Strip */}
          <div className="grid grid-cols-4 gap-2 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-[#F7F3EB] border border-[#E2D9C8]">
              <span className="text-[10px] text-[#686052] block">Unit Test 1</span>
              <strong className="text-[#1C2A27] tabular-nums">{activeExam.u1}/100</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7F3EB] border border-[#E2D9C8]">
              <span className="text-[10px] text-[#686052] block">Unit Test 2</span>
              <strong className="text-[#1C2A27] tabular-nums">{activeExam.u2}/100</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7F3EB] border border-[#E2D9C8]">
              <span className="text-[10px] text-[#686052] block">Unit Test 3</span>
              <strong className="text-[#1C2A27] tabular-nums">{activeExam.u3}/100</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#EFF5F3] border border-[#9CC5BE]">
              <span className="text-[10px] text-[#0E6B5E] block">Unit Avg &amp; Boost</span>
              <strong className="text-[#0A4D44] tabular-nums">
                {activeExam.unitAvgPct}% (+{activeExam.prepBoost}%)
              </strong>
            </div>
          </div>

          {/* Interactive Syllabus Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2A27]">
                Interactive Syllabus Revision Checklist ({activeExam.checkedSyllabusCount}/{activeExam.syllabusTopics.length})
              </span>
              <span className="text-[11px] font-mono text-[#0E6B5E]">+2% Readiness &amp; +15 XP per topic</span>
            </div>
            <div className="space-y-1.5">
              {activeExam.syllabusTopics.map((topic, idx) => {
                const isDone = Boolean(completedTopics[`${activeExam.id}-${idx}`]);
                return (
                  <label
                    key={idx}
                    onClick={() => handleToggleTopic(activeExam.id, idx, topic)}
                    className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 cursor-pointer text-xs transition ${
                      isDone
                        ? 'bg-[#EFF5F3] border-[#0A4D44] text-[#0A4D44] font-semibold'
                        : 'bg-[#F7F3EB] hover:bg-[#EFE8D8] border-[#E2D9C8] text-[#1C2A27]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => {}}
                        className="rounded border-[#0A4D44] text-[#0A4D44]"
                      />
                      <span>{topic}</span>
                    </div>
                    <span className="text-[10px] font-mono shrink-0">
                      {isDone ? 'Revised ✓' : 'Mark Revised'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Examiner Focus Note */}
          <div className="p-3 rounded-lg bg-[#FAF6EE] border border-[#E2D9C8] text-xs">
            <strong className="text-[#9A6B26] block mb-0.5">Examiner High-Yield Tip:</strong>
            <span className="text-[#4A443B]">{activeExam.highYieldFocus}</span>
          </div>

          {/* Linked Revision Notes for This Subject */}
          <div className="space-y-2 pt-1 border-t border-[#EAE2D3]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2A27]">
                Linked Study Vault Notes ({activeExam.subjectMaterials.length})
              </span>
              <button
                type="button"
                onClick={() => onJumpToFilteredVault(activeExam.subject)}
                className="text-xs font-semibold text-[#0E6B5E] hover:underline cursor-pointer"
              >
                View All in Vault →
              </button>
            </div>

            <div className="space-y-2">
              {activeExam.subjectMaterials.map(mat => {
                const isReviewed = reviewedMaterialIds.includes(mat.id);
                return (
                  <div
                    key={mat.id}
                    className="p-2.5 rounded-lg bg-[#F7F3EB] border border-[#E2D9C8] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <strong className="text-[#1C2A27] block truncate">{mat.title}</strong>
                      <span className="text-[11px] text-[#686052] font-mono">
                        {mat.pages} Pages · By {mat.uploadedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          playUISound('click');
                          setReadingMaterial(mat);
                          if (!isReviewed) {
                            setReviewedMaterialIds(prev => [...prev, mat.id]);
                            handleAwardBonusXP(currentStudent.id, 20, `Studied Revision Note: ${mat.title}`);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-[#0A4D44] text-white text-[11px] font-semibold cursor-pointer"
                      >
                        {isReviewed ? 'Read Again ✓' : 'Read Note (+3.5%)'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
