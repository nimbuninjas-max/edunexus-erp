import React, { useState, useMemo } from 'react';
import {
  Announcement,
  CalendarEvent,
  DisciplineCase,
  FeeTransaction,
  HomeworkTask,
  LeaveApplication,
  PeerTutoringPost,
  RankedStudent,
  RoleType,
  Student,
  StudentAcademicSummary,
  StudyGroup,
  StudyMaterial,
  Teacher,
  TeacherNotice,
  TimetablePeriod,
  WhisperReport
} from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';
import { UserAvatar } from '../common/UserAvatar';
import { StudentArcade } from './StudentArcade';
import { PeerTutoringModule } from './PeerTutoringModule';
import { LeaderboardModule } from '../shared/LeaderboardModule';
import { ChatModule } from '../shared/ChatModule';
import { SchoolCalendarModule } from '../shared/SchoolCalendarModule';
import { ExamReadinessDashboard } from './ExamReadinessDashboard';
import { StudentAchievementSystem } from './StudentAchievementSystem';
import { StudentDashboardDossierHub } from './StudentDashboardDossierHub';
import { PrintableTimetableModal } from '../modals/PrintableTimetableModal';

interface StudentPortalProps {
  studentTab: string;
  handleSelectNavTab: (tabId: string) => void;
  currentStudent: Student;
  currentStudentRankObj: RankedStudent;
  currentStudentAcademics: StudentAcademicSummary;
  rankedStudents: RankedStudent[];
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  timetable: TimetablePeriod[];
  disciplineCases: DisciplineCase[];
  announcements: Announcement[];
  teacherNotices: TeacherNotice[];
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  tasks: HomeworkTask[];
  setTasks: React.Dispatch<React.SetStateAction<HomeworkTask[]>>;
  studyMaterials: StudyMaterial[];
  setReadingMaterial: (mat: StudyMaterial | null) => void;
  setPrintingStudentId: (id: string) => void;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  handlePayFeeInstallment: (studentId: string, amount: number | string) => void;
  whispers: WhisperReport[];
  setWhispers: React.Dispatch<React.SetStateAction<WhisperReport[]>>;
  leaveApplications: LeaveApplication[];
  setLeaveApplications: React.Dispatch<React.SetStateAction<LeaveApplication[]>>;
  groups: StudyGroup[];
  setGroups: React.Dispatch<React.SetStateAction<StudyGroup[]>>;
  activeRole: RoleType;
  activeTeacher: Teacher;
  availableClasses: string[];
  getStudentAcademicSummary: (studentId: string) => StudentAcademicSummary;
  tutoringPosts: PeerTutoringPost[];
  setTutoringPosts: React.Dispatch<React.SetStateAction<PeerTutoringPost[]>>;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
  isScrolledDown?: boolean;
  onUpdateHeaderContext?: (ctx: string) => void;
}

const LEAVE_REASON_PRESETS = [
  'Seasonal viral fever & doctor advised complete bed rest',
  'Attending outstation family wedding ceremony',
  'Representing school in Zonal Sports / Science Olympiad',
  'Routine dental / medical checkup appointment at hospital'
];

export const StudentPortal: React.FC<StudentPortalProps> = ({
  studentTab,
  handleSelectNavTab,
  currentStudent,
  currentStudentRankObj,
  currentStudentAcademics,
  rankedStudents,
  students,
  setStudents,
  teachers,
  timetable,
  disciplineCases,
  announcements,
  teacherNotices,
  calendarEvents,
  setCalendarEvents,
  tasks,
  setTasks,
  studyMaterials,
  setReadingMaterial,
  setPrintingStudentId,
  handleAwardBonusXP,
  handlePayFeeInstallment,
  whispers,
  setWhispers,
  leaveApplications,
  setLeaveApplications,
  groups,
  setGroups,
  activeRole,
  activeTeacher,
  availableClasses,
  getStudentAcademicSummary,
  tutoringPosts,
  setTutoringPosts,
  playUISound,
  showToast,
  isScrolledDown = false,
  onUpdateHeaderContext
}) => {
  const [condonedApplied, setCondonedApplied] = useState(false);

  // Results Section View ('unified' | 'unit' | 'mid' | 'final')
  const [resultsStageView, setResultsStageView] = useState<'unified' | 'unit' | 'mid' | 'final'>('unified');

  // Study Vault Subject Filter & Search
  const [vaultSubjectFilter, setVaultSubjectFilter] = useState<string>('All');
  const [vaultSearchQuery, setVaultSearchQuery] = useState<string>('');

  // Notices vs Announcements Filter ('both' | 'notices' | 'announcements')
  const [circularFilter, setCircularFilter] = useState<'both' | 'notices' | 'announcements'>('both');
  const [acknowledgedNoticeIds, setAcknowledgedNoticeIds] = useState<string[]>([]);

  // Fee & Receipt Modal State
  const [feePayAmount, setFeePayAmount] = useState<number | string>(5000);
  const [printingReceipt, setPrintingReceipt] = useState<FeeTransaction | null>(null);
  const [isPrintingTimetable, setIsPrintingTimetable] = useState(false);

  // Leave Application + Confidential Welfare Desk States (Dropdown-driven)
  const [deskSubTab, setDeskSubTab] = useState<'leave' | 'whisper'>('leave');
  const [leaveType, setLeaveType] = useState('Medical / Illness Leave');
  const [leaveFromDate, setLeaveFromDate] = useState('2026-10-19');
  const [leaveToDate, setLeaveToDate] = useState('2026-10-21');
  const [leaveReason, setLeaveReason] = useState(LEAVE_REASON_PRESETS[0]);
  const [leaveProofDoc, setLeaveProofDoc] = useState('Medical_Fitness_Certificate.pdf');

  // Confidential Welfare Report States
  const [whisperCategory, setWhisperCategory] = useState('Anti-Ragging & Bullying Alert');
  const [whisperUrgency, setWhisperUrgency] = useState('High');
  const [whisperLocation, setWhisperLocation] = useState('Academic Wing Corridor');
  const [whisperMessage, setWhisperMessage] = useState('');

  const calculatedLeaveDays = useMemo(() => {
    const start = new Date(leaveFromDate);
    const end = new Date(leaveToDate);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  }, [leaveFromDate, leaveToDate]);

  // Synchronize Dynamic Top Section Context with Header
  React.useEffect(() => {
    if (!onUpdateHeaderContext) return;
    if (studentTab === 'stu-results') {
      const label =
        resultsStageView === 'unified'
          ? 'All-Stage Transcript'
          : resultsStageView === 'unit'
          ? 'Stage 1: Unit Tests'
          : resultsStageView === 'mid'
          ? 'Stage 2: Mid-Term'
          : 'Stage 3: End-Term Final';
      onUpdateHeaderContext(`${label} (${currentStudentAcademics.rawGrandPct}%)`);
    } else if (studentTab === 'stu-learning') {
      onUpdateHeaderContext(`Filter: ${vaultSubjectFilter}`);
    } else if (studentTab === 'stu-notices') {
      const label =
        circularFilter === 'both'
          ? 'Class Notices + Gazette'
          : circularFilter === 'notices'
          ? `Class ${currentStudent.grade} Notices`
          : 'Directorate Gazette';
      onUpdateHeaderContext(label);
    } else if (studentTab === 'stu-whisper') {
      onUpdateHeaderContext(
        deskSubTab === 'leave' ? `Leave: ${leaveType}` : `Welfare: ${whisperCategory}`
      );
    } else {
      onUpdateHeaderContext(`Sec ${currentStudent.grade} • Rank #${currentStudentRankObj.rank}`);
    }
  }, [
    studentTab,
    resultsStageView,
    vaultSubjectFilter,
    circularFilter,
    deskSubTab,
    leaveType,
    whisperCategory,
    currentStudent.grade,
    currentStudentRankObj.rank,
    currentStudentAcademics.rawGrandPct,
    onUpdateHeaderContext
  ]);

  const handleSimulateAttendNextDay = () => {
    playUISound('success');
    setStudents(prev =>
      prev.map(s =>
        s.id === currentStudent.id
          ? { ...s, presentDays: s.presentDays + 1, totalDays: s.totalDays + 1 }
          : s
      )
    );
    showToast(
      'Attendance Updated (+1 Day)',
      `Attended ${currentStudent.presentDays + 1} / ${currentStudent.totalDays + 1} days.`,
      'success'
    );
  };

  const handleApplyMedicalCondonation = () => {
    if (condonedApplied) return;
    playUISound('success');
    setCondonedApplied(true);
    setStudents(prev =>
      prev.map(s =>
        s.id === currentStudent.id
          ? { ...s, presentDays: Math.min(s.totalDays, s.presentDays + 26) }
          : s
      )
    );
    showToast(
      'Medical Leave Condonation Applied (+26 Days)',
      'Approved medical leave days credited to your attendance ledger.',
      'success'
    );
  };

  const getCBSEGrade = (pct: number) => {
    if (pct >= 91) return { grade: 'A1', color: 'bg-[#EFF5F3] text-[#0A4D44] border-[#9CC5BE]' };
    if (pct >= 81) return { grade: 'A2', color: 'bg-[#EFF5F3] text-[#0E6B5E] border-[#9CC5BE]' };
    if (pct >= 71) return { grade: 'B1', color: 'bg-[#FDF4E7] text-[#9A6B26] border-[#E6C89C]' };
    if (pct >= 61) return { grade: 'B2', color: 'bg-[#FDF4E7] text-[#9A6B26] border-[#E6C89C]' };
    return { grade: 'C1', color: 'bg-[#FAF2F2] text-[#8B2626] border-[#E2C9C9]' };
  };

  const myDisciplineCases = useMemo(
    () => disciplineCases.filter(c => c.studentId === currentStudent.id),
    [disciplineCases, currentStudent.id]
  );

  return (
    <>
      {/* OFFICIAL FEE RECEIPT / CHALLAN DOWNLOAD MODAL */}
      {printingReceipt && (
        <div className="fixed inset-0 z-50 bg-[#13221F]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#D5CBB8] rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-[#EAE2D3] pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                  EDUNEXUS VIDYA MANDIR · OFFICIAL FEE VOUCHER
                </p>
                <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                  Receipt #{printingReceipt.receiptNo}
                </h3>
              </div>
              <button
                onClick={() => setPrintingReceipt(null)}
                className="p-1.5 rounded-lg bg-[#F5F0E6] text-[#1C2A27] cursor-pointer"
              >
                <StreamlineIcon name="close" className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[#F5F0E6] border border-[#DDD4C2] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#686052]">Student Name &amp; Reg No.:</span>
                <strong className="text-[#1C2A27] font-mono">{currentStudent.name} (#{currentStudent.id})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686052]">Class Section &amp; Roll:</span>
                <strong className="text-[#1C2A27]">{currentStudent.grade} · Roll #{currentStudent.rollNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686052]">Installment Head:</span>
                <strong className="text-[#1C2A27]">{printingReceipt.InstallmentName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686052]">Payment Mode &amp; Date:</span>
                <strong className="text-[#1C2A27]">{printingReceipt.mode} · {printingReceipt.date}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#D5CBB8] text-sm">
                <span className="font-semibold text-[#0A4D44]">Amount Credited:</span>
                <strong className="font-mono text-[#0A4D44] tabular-nums">₹{printingReceipt.amount.toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  playUISound('success');
                  window.print();
                  showToast('Fee Receipt Downloaded', `Receipt #${printingReceipt.receiptNo} exported.`, 'success');
                }}
                className="px-4 py-2 rounded-lg bg-[#0A4D44] text-[#F5F0E6] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <StreamlineIcon name="print" className="w-4 h-4" /> Print / Save Official Receipt PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-READY PERSONAL TIMETABLE & WEEKLY SCHEDULE PDF MODAL */}
      <PrintableTimetableModal
        isOpen={isPrintingTimetable}
        onClose={() => setIsPrintingTimetable(false)}
        portalRole="student"
        currentStudent={currentStudent}
        timetable={timetable}
        playUISound={playUISound}
        showToast={showToast}
      />

      {/* =====================================================================
          TAB 1: STUDENT COMMAND DASHBOARD (4-KPI DRAWERS + 2-COL DOSSIER)
         ===================================================================== */}
      {studentTab === 'stu-overview' && (
        <StudentDashboardDossierHub
          currentStudent={currentStudent}
          currentStudentRankObj={currentStudentRankObj}
          teachers={teachers}
          timetable={timetable}
          condonedApplied={condonedApplied}
          onSimulateAttendNextDay={handleSimulateAttendNextDay}
          onApplyMedicalCondonation={handleApplyMedicalCondonation}
          handlePayFeeInstallment={handlePayFeeInstallment}
          onPrintReceipt={receipt => setPrintingReceipt(receipt)}
          handleSelectNavTab={handleSelectNavTab}
          handleAwardBonusXP={handleAwardBonusXP}
          onPrintReportCard={() => {
            playUISound('click');
            setPrintingStudentId(currentStudent.id);
          }}
          onPrintTimetable={() => {
            playUISound('click');
            setIsPrintingTimetable(true);
          }}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}

      {/* =====================================================================
          TAB 2: STUDENT ACHIEVEMENT & MILESTONE SYSTEM
         ===================================================================== */}
      {studentTab === 'stu-achievements' && (
        <StudentAchievementSystem
          currentStudent={currentStudent}
          currentStudentRankObj={currentStudentRankObj}
          currentStudentAcademics={currentStudentAcademics}
          tutoringPosts={tutoringPosts}
          setTutoringPosts={setTutoringPosts}
          disciplineCases={disciplineCases}
          condonedApplied={condonedApplied}
          onApplyMedicalCondonation={handleApplyMedicalCondonation}
          handleAwardBonusXP={handleAwardBonusXP}
          handleSelectNavTab={handleSelectNavTab}
          playUISound={playUISound}
          showToast={showToast}
          defaultExpanded={true}
          standaloneSection={true}
        />
      )}

      {/* =====================================================================
          TAB 3: REAL 7-COLUMN YEARLY ACADEMIC CALENDAR
         ===================================================================== */}
      {studentTab === 'stu-calendar' && (
        <SchoolCalendarModule
          calendarEvents={calendarEvents}
          setCalendarEvents={setCalendarEvents}
          currentUserRegNo={currentStudent.id}
          currentUserName={currentStudent.name}
          activeRole={activeRole}
          onAwardXP={(amt, reason) => handleAwardBonusXP(currentStudent.id, amt, reason)}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}

      {/* =====================================================================
          TAB 4: PEER TUTORING & SUBJECT MENTORSHIP HUB
         ===================================================================== */}
      {studentTab === 'stu-tutoring' && (
        <PeerTutoringModule
          currentStudent={currentStudent}
          rankedStudents={rankedStudents}
          getStudentAcademicSummary={getStudentAcademicSummary}
          tutoringPosts={tutoringPosts}
          setTutoringPosts={setTutoringPosts}
          handleAwardBonusXP={handleAwardBonusXP}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}

      {/* =====================================================================
          TAB 5: ACADEMIC PERFORMANCE & TRANSCRIPT (CLEAN TABBED MATRIX)
         ===================================================================== */}
      {studentTab === 'stu-results' && (
        <div className="space-y-4">
          {/* Row 1: Compact 4-KPI Academic Performance Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              onClick={() => {
                playUISound('click');
                setResultsStageView('unit');
              }}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${
                resultsStageView === 'unit'
                  ? 'bg-[#EFF5F3] border-[#0A4D44]'
                  : 'bg-[#FFFDF9] hover:bg-[#F7F3EB] border-[#DDD4C2]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-[#686052]">
                <span className="font-semibold">1. Unit Tests (U1–U3)</span>
                <span className="font-mono text-[#0E6B5E] tabular-nums">
                  {currentStudentAcademics.totalUnitMarksObtained}/{currentStudentAcademics.totalUnitMaxMarks}
                </span>
              </div>
              <div className="text-xl font-mono font-bold text-[#1C2A27] mt-1 tabular-nums">
                {currentStudentAcademics.unitAvg}%
              </div>
              <div className="h-1.5 rounded-full bg-[#EAE2D3] mt-2 overflow-hidden">
                <div className="h-full bg-[#0A4D44]" style={{ width: `${currentStudentAcademics.unitAvg}%` }} />
              </div>
            </div>

            <div
              onClick={() => {
                playUISound('click');
                setResultsStageView('mid');
              }}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${
                resultsStageView === 'mid'
                  ? 'bg-[#EFF5F3] border-[#0A4D44]'
                  : 'bg-[#FFFDF9] hover:bg-[#F7F3EB] border-[#DDD4C2]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-[#686052]">
                <span className="font-semibold">2. Mid-Term Exam</span>
                <span className="font-mono text-[#0E6B5E] tabular-nums">
                  {currentStudentAcademics.totalMidtermObtained}/{currentStudentAcademics.totalMidtermMaxMarks}
                </span>
              </div>
              <div className="text-xl font-mono font-bold text-[#1C2A27] mt-1 tabular-nums">
                {currentStudentAcademics.midterm}%
              </div>
              <div className="h-1.5 rounded-full bg-[#EAE2D3] mt-2 overflow-hidden">
                <div className="h-full bg-[#0E6B5E]" style={{ width: `${currentStudentAcademics.midterm}%` }} />
              </div>
            </div>

            <div
              onClick={() => {
                playUISound('click');
                setResultsStageView('final');
              }}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${
                resultsStageView === 'final'
                  ? 'bg-[#EFF5F3] border-[#0A4D44]'
                  : 'bg-[#FFFDF9] hover:bg-[#F7F3EB] border-[#DDD4C2]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-[#686052]">
                <span className="font-semibold">3. End-Term Final</span>
                <span className="font-mono text-[#9A6B26] tabular-nums">
                  {currentStudentAcademics.totalFinalObtained}/{currentStudentAcademics.totalFinalMaxMarks}
                </span>
              </div>
              <div className="text-xl font-mono font-bold text-[#1C2A27] mt-1 tabular-nums">
                {currentStudentAcademics.finalExam}%
              </div>
              <div className="h-1.5 rounded-full bg-[#EAE2D3] mt-2 overflow-hidden">
                <div className="h-full bg-[#D97706]" style={{ width: `${currentStudentAcademics.finalExam}%` }} />
              </div>
            </div>

            <div
              onClick={() => {
                playUISound('click');
                setResultsStageView('unified');
              }}
              className="p-3.5 rounded-xl bg-[#0A3630] text-[#F5F0E6] border border-[#14463F] cursor-pointer"
            >
              <div className="flex items-center justify-between text-[11px] text-[#9CC5BE]">
                <span className="font-semibold">4. Grand Aggregate</span>
                <span className="font-mono tabular-nums">
                  {currentStudentAcademics.grandTotalObtained}/{currentStudentAcademics.grandTotalMaxMarks}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <strong className="text-xl font-mono font-bold text-white tabular-nums">
                  {currentStudentAcademics.rawGrandPct}%
                </strong>
                <span className="text-xs font-mono text-[#4ADE80]">
                  Grade {getCBSEGrade(currentStudentAcademics.rawGrandPct).grade}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#124E45] mt-2 overflow-hidden">
                <div className="h-full bg-[#4ADE80]" style={{ width: `${currentStudentAcademics.rawGrandPct}%` }} />
              </div>
            </div>
          </div>

          {/* Row 2: Pinned Sticky Stage Dropdown & Report Card PDF Toolbar */}
          <div className="sticky top-2 z-30 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0">
              <label className="text-xs font-semibold text-[#1C2A27] hidden sm:inline">Transcript View:</label>
              <select
                value={resultsStageView}
                onChange={e => {
                  playUISound('click');
                  setResultsStageView(e.target.value as 'unified' | 'unit' | 'mid' | 'final');
                }}
                className="w-full sm:w-auto px-2.5 sm:px-3 py-1.5 text-xs font-bold bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg text-[#1C2A27] focus:outline-none focus:border-[#0A4D44] truncate"
              >
                <option value="unified">Unified All-Stage Matrix (U1–U3 + Mid + Final)</option>
                <option value="unit">Stage 1: Unit Tests Breakdown (U1, U2, U3)</option>
                <option value="mid">Stage 2: Mid-Term Examination (/100)</option>
                <option value="final">Stage 3: End-Term Final Examination (/100)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setPrintingStudentId(currentStudent.id);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <StreamlineIcon name="print" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Official</span> Report Card
            </button>
          </div>

          {/* Row 3: Single Clean High-Density Performance Matrix Table */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1C2A27]">
                  {resultsStageView === 'unified' && 'Subject-Wise Cumulative Academic Matrix (All Assessments)'}
                  {resultsStageView === 'unit' && 'Stage 1: Unit Test Assessment Ledger (U1, U2, U3 out of 100 each)'}
                  {resultsStageView === 'mid' && 'Stage 2: Mid-Term Terminal Examination Ledger'}
                  {resultsStageView === 'final' && 'Stage 3: End-Term Final Examination Ledger'}
                </h2>
                <p className="text-[11px] text-[#686052]">
                  {currentStudent.name} (Reg #{currentStudent.id}) · Section {currentStudent.grade} · Roll #{currentStudent.rollNo}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#0A4D44] tabular-nums">
                Overall: {currentStudentAcademics.rawGrandPct}%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-4 font-sans">Subject Name</th>
                    {(resultsStageView === 'unified' || resultsStageView === 'unit') && (
                      <>
                        <th className="py-2.5 px-3 text-right">UT-1</th>
                        <th className="py-2.5 px-3 text-right">UT-2</th>
                        <th className="py-2.5 px-3 text-right">UT-3</th>
                        <th className="py-2.5 px-3 text-right bg-[#124E45]">Unit Avg</th>
                      </>
                    )}
                    {(resultsStageView === 'unified' || resultsStageView === 'mid') && (
                      <th className="py-2.5 px-3 text-right">Mid-Term (/100)</th>
                    )}
                    {(resultsStageView === 'unified' || resultsStageView === 'final') && (
                      <th className="py-2.5 px-3 text-right">End-Term (/100)</th>
                    )}
                    <th className="py-2.5 px-4 font-sans">Visual Standing</th>
                    <th className="py-2.5 px-3 text-right">Total Marks</th>
                    <th className="py-2.5 px-4 text-right">Grade &amp; %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D3]">
                  {currentStudentAcademics.subjectsList.map((sub, idx) => {
                    const displayPct =
                      resultsStageView === 'unit'
                        ? sub.unitPct
                        : resultsStageView === 'mid'
                        ? sub.mid
                        : resultsStageView === 'final'
                        ? sub.final
                        : sub.rawSubjectPct;
                    const displayObtained =
                      resultsStageView === 'unit'
                        ? `${sub.unitTotalObtained}/300`
                        : resultsStageView === 'mid'
                        ? `${sub.mid}/100`
                        : resultsStageView === 'final'
                        ? `${sub.final}/100`
                        : `${sub.rawSubjectTotalObtained}/${sub.rawSubjectMaxMarks}`;
                    const gradeBadge = getCBSEGrade(displayPct);

                    return (
                      <tr key={idx} className="hover:bg-[#F7F3EB]">
                        <td className="py-3 px-4 font-sans font-bold text-[#1C2A27]">{sub.name}</td>
                        {(resultsStageView === 'unified' || resultsStageView === 'unit') && (
                          <>
                            <td className="py-3 px-3 text-right text-[#4A443B] tabular-nums">{sub.u1}</td>
                            <td className="py-3 px-3 text-right text-[#4A443B] tabular-nums">{sub.u2}</td>
                            <td className="py-3 px-3 text-right text-[#4A443B] tabular-nums">{sub.u3}</td>
                            <td className="py-3 px-3 text-right font-bold text-[#0A4D44] bg-[#EFF5F3] tabular-nums">
                              {sub.unitPct}%
                            </td>
                          </>
                        )}
                        {(resultsStageView === 'unified' || resultsStageView === 'mid') && (
                          <td className="py-3 px-3 text-right font-semibold text-[#1C2A27] tabular-nums">
                            {sub.mid}%
                          </td>
                        )}
                        {(resultsStageView === 'unified' || resultsStageView === 'final') && (
                          <td className="py-3 px-3 text-right font-semibold text-[#9A6B26] tabular-nums">
                            {sub.final}%
                          </td>
                        )}
                        <td className="py-3 px-4 w-36">
                          <div className="h-2 rounded-full bg-[#EAE2D3] overflow-hidden">
                            <div
                              className="h-full bg-[#0A4D44] rounded-full"
                              style={{ width: `${displayPct}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-[#1C2A27] tabular-nums">
                          {displayObtained}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          <div className="inline-flex items-center gap-1.5">
                            <strong className="text-[#0A4D44]">{displayPct}%</strong>
                            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${gradeBadge.color}`}>
                              {gradeBadge.grade}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#FAF6EE] font-bold text-[#1C2A27] border-t-2 border-[#D5CBB8]">
                    <td className="py-3 px-4 font-sans">Aggregate Across All 5 Subjects</td>
                    {(resultsStageView === 'unified' || resultsStageView === 'unit') && (
                      <>
                        <td className="py-3 px-3 text-right tabular-nums">{currentStudentAcademics.unit1}%</td>
                        <td className="py-3 px-3 text-right tabular-nums">{currentStudentAcademics.unit2}%</td>
                        <td className="py-3 px-3 text-right tabular-nums">{currentStudentAcademics.unit3}%</td>
                        <td className="py-3 px-3 text-right text-[#0A4D44] bg-[#EFF5F3] tabular-nums">
                          {currentStudentAcademics.unitAvg}%
                        </td>
                      </>
                    )}
                    {(resultsStageView === 'unified' || resultsStageView === 'mid') && (
                      <td className="py-3 px-3 text-right tabular-nums">{currentStudentAcademics.midterm}%</td>
                    )}
                    {(resultsStageView === 'unified' || resultsStageView === 'final') && (
                      <td className="py-3 px-3 text-right text-[#9A6B26] tabular-nums">
                        {currentStudentAcademics.finalExam}%
                      </td>
                    )}
                    <td className="py-3 px-4 font-sans text-[11px] text-[#0E6B5E]">Verified Transcript</td>
                    <td className="py-3 px-3 text-right text-[#0A4D44] tabular-nums">
                      {currentStudentAcademics.grandTotalObtained}/{currentStudentAcademics.grandTotalMaxMarks}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-[#0A4D44] tabular-nums">
                      {currentStudentAcademics.rawGrandPct}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: CONDUCT CHRONICLE (HIGH-DENSITY MERIT & BEHAVIORAL LEDGER)
         ===================================================================== */}
      {studentTab === 'stu-conduct' && (
        <div className="space-y-4">
          {/* Row 1: 3-KPI Conduct Summary Strip (2-col on mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3">
              <span className="text-[11px] font-semibold text-[#686052] block">Behavioral Standing</span>
              <strong className="text-sm sm:text-base font-bold text-[#0A4D44] mt-0.5 block">
                {myDisciplineCases.length === 0 ? 'Exemplary ✓' : `${myDisciplineCases.length} Observation(s)`}
              </strong>
              <span className="text-[10px] text-[#686052] font-mono">Reg #{currentStudent.id} · Sec {currentStudent.grade}</span>
            </div>
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3">
              <span className="text-[11px] font-semibold text-[#686052] block">Cumulative Merit XP</span>
              <strong className="text-sm sm:text-base font-mono font-bold text-[#1C2A27] mt-0.5 block tabular-nums">
                {currentStudent.points.toLocaleString()} XP (Lvl {currentStudent.xpLevel})
              </strong>
              <span className="text-[10px] text-[#0E6B5E] font-mono">+100% Punctuality</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3">
              <span className="text-[11px] font-semibold text-[#686052] block">Character Certificate Status</span>
              <strong className="text-sm sm:text-base font-bold text-[#0A4D44] mt-0.5 block">
                Cleared &amp; Verified
              </strong>
              <span className="text-[10px] text-[#686052]">Endorsed by Class Teacher &amp; Principal</span>
            </div>
          </div>

          {/* Row 2: 2-Column Split (Left: Conduct & Commendation Log | Right: Rubric) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1C2A27]">
                  Classroom Conduct &amp; Faculty Commendation Ledger
                </h2>
                <span className="text-[11px] font-mono text-[#0A4D44]">Session 2026–27</span>
              </div>

              <div className="divide-y divide-[#EAE2D3]">
                {myDisciplineCases.map(c => (
                  <div key={c.id} className="p-3.5 bg-[#FAF2F2] space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <strong className="text-[#8B2626]">{c.id} · {c.category} ({c.severity})</strong>
                      <span className="text-[#8B2626] font-bold">{c.xpPenalty} XP · {c.date}</span>
                    </div>
                    <p className="text-xs text-[#2C3532]">{c.description}</p>
                    <p className="text-[11px] text-[#686052]">
                      Logged by: <strong>{c.reportedBy} (#{c.reportedByRegNo})</strong> · Action: {c.actionTaken}
                    </p>
                  </div>
                ))}

                {/* Positive Commendation Entries */}
                {[
                  {
                    id: 'MER-408',
                    date: '16 Oct 2026',
                    category: 'Academic Leadership & Lab Discipline',
                    xp: '+50 XP',
                    faculty: 'Dr. Vikramaditya Sen (#900101)',
                    note: 'Assisted peers during Physics Ray Optics bench calibration with zero apparatus error.'
                  },
                  {
                    id: 'MER-392',
                    date: '08 Oct 2026',
                    category: 'Morning Assembly & Turnout Commendation',
                    xp: '+30 XP',
                    faculty: 'Ms. Sunita Rao (#900102)',
                    note: 'Exemplary uniform turnout and 100% class diary completion during weekly inspection.'
                  }
                ].map(mer => (
                  <div key={mer.id} className="p-3.5 hover:bg-[#F7F3EB] space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <strong className="text-[#0A4D44]">{mer.id} · {mer.category}</strong>
                      <span className="text-[#0A4D44] font-bold">{mer.xp} · {mer.date}</span>
                    </div>
                    <p className="text-xs text-[#4A443B]">{mer.note}</p>
                    <p className="text-[11px] text-[#686052]">
                      Endorsed by Faculty: <strong>{mer.faculty}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3]">
                <h3 className="text-sm font-bold text-[#1C2A27]">Institutional Conduct &amp; Merit Rubric</h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E6] text-[10px] uppercase font-mono text-[#686052]">
                  <tr>
                    <th className="py-2 px-3">Conduct Parameter</th>
                    <th className="py-2 px-3 text-right">Merit Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D3]">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-[#1C2A27]">Lab Safety &amp; Practical Assistance</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#0A4D44]">+50 XP</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-[#1C2A27]">Peer Tutoring &amp; Doubt Resolution</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#0A4D44]">+45 XP</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-[#1C2A27]">100% Weekly Punctuality &amp; Diary Check</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#0A4D44]">+30 XP</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-[#1C2A27]">Unexcused Late Arrival / Uniform Default</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#8B2626]">-25 XP</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-[#1C2A27]">Classroom / Chat Decorum Violation</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#8B2626]">-50 XP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 7: NOTICES & GAZETTE ANNOUNCEMENTS
         ===================================================================== */}
      {studentTab === 'stu-notices' && (
        <div className="space-y-4">
          <div className="sticky top-2 z-30 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-[#1C2A27]">
                {circularFilter === 'both' && `Class Notices & Directorate Gazette (Section ${currentStudent.grade})`}
                {circularFilter === 'notices' && `Class Teacher Notices — Section ${currentStudent.grade}`}
                {circularFilter === 'announcements' && 'Whole-School Directorate Gazette & Circulars'}
              </h1>
              <p className="text-[11px] text-[#686052] hidden sm:block">
                Header automatically reflects your selected communication channel
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-semibold text-[#1C2A27] shrink-0">Channel:</label>
              <select
                value={circularFilter}
                onChange={e => {
                  playUISound('click');
                  setCircularFilter(e.target.value as 'both' | 'notices' | 'announcements');
                }}
                className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold bg-white border border-[#C8BFA8] rounded-lg text-[#1C2A27]"
              >
                <option value="both">Split View: Class Notices + School Gazette</option>
                <option value="notices">1. Class Teacher Notices (Section {currentStudent.grade})</option>
                <option value="announcements">2. Whole-School Directorate Gazette</option>
              </select>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${circularFilter === 'both' ? 'lg:grid-cols-2' : ''} gap-4 items-start`}>
            {(circularFilter === 'both' || circularFilter === 'notices') && (
              <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#0A3630] text-white flex items-center justify-between">
                  <h2 className="text-sm font-bold">Class Teacher Notices (Section {currentStudent.grade})</h2>
                  <span className="text-[11px] font-mono text-[#9CC5BE]">Classroom Channel</span>
                </div>
                <div className="divide-y divide-[#EAE2D3]">
                  {teacherNotices
                    .filter(n => n.targetClass === currentStudent.grade || n.targetClass === 'All Classes')
                    .map(ntc => {
                      const isAck = acknowledgedNoticeIds.includes(ntc.id);
                      return (
                        <div key={ntc.id} className="p-4 space-y-2 hover:bg-[#F7F3EB]">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#0E6B5E]">
                            <span>{ntc.roleLabel} · {ntc.subject}</span>
                            <span>{ntc.time}</span>
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-[#1C2A27]">{ntc.title}</h3>
                          <p className="text-xs text-[#4A443B] leading-relaxed">{ntc.message}</p>
                          <div className="pt-2 flex items-center justify-between text-[11px]">
                            <span className="text-[#686052]">
                              Faculty: <strong className="text-[#1C2A27]">{ntc.teacherName}</strong> (#{ntc.teacherRegNo})
                            </span>
                            <button
                              type="button"
                              disabled={isAck}
                              onClick={() => {
                                playUISound('success');
                                setAcknowledgedNoticeIds(prev => [...prev, ntc.id]);
                                showToast('Notice Acknowledged', `Noted ${ntc.teacherName}'s notice.`, 'success');
                              }}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                                isAck ? 'bg-[#EAE2D3] text-[#686052]' : 'bg-[#0A4D44] text-white'
                              }`}
                            >
                              {isAck ? 'Noted ✓' : 'Acknowledge'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {(circularFilter === 'both' || circularFilter === 'announcements') && (
              <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3] flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#1C2A27]">Whole-School Directorate Gazette</h2>
                  <span className="text-[11px] font-mono text-[#9A6B26]">All Sections</span>
                </div>
                <div className="divide-y divide-[#EAE2D3]">
                  {announcements.map((ann, idx) => (
                    <div key={ann.id} className="p-4 space-y-2 hover:bg-[#F7F3EB]">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#9A6B26]">
                        <span>REF: DIR/2026/0{idx + 1} · {ann.priority}</span>
                        <span>{ann.date}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#1C2A27]">{ann.title}</h3>
                      <p className="text-xs text-[#4A443B] leading-relaxed">{ann.message}</p>
                      <div className="pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-[#686052]">
                          Issued by: <strong className="text-[#1C2A27]">{ann.postedBy}</strong> (#{ann.facultyRegNo})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            playUISound('click');
                            window.print();
                          }}
                          className="px-2.5 py-1 rounded bg-[#F5F0E6] hover:bg-[#EAE2D3] text-[#1C2A27] font-semibold cursor-pointer"
                        >
                          Print PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 8: EXAM READINESS HUB
         ===================================================================== */}
      {studentTab === 'stu-readiness' && (
        <ExamReadinessDashboard
          currentStudent={currentStudent}
          currentStudentAcademics={currentStudentAcademics}
          studyMaterials={studyMaterials}
          setReadingMaterial={setReadingMaterial}
          onJumpToFilteredVault={subjectName => {
            playUISound('tab');
            setVaultSubjectFilter(subjectName);
            handleSelectNavTab('stu-learning');
            showToast(`Study Vault Filtered: ${subjectName}`, `Showing revision materials for ${subjectName}.`, 'success');
          }}
          handleSelectNavTab={handleSelectNavTab}
          handleAwardBonusXP={handleAwardBonusXP}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}

      {/* =====================================================================
          TAB 9: STUDY VAULT & HOMEWORK (DROPDOWN FILTER + CLEAN 2-COL SPLIT)
         ===================================================================== */}
      {studentTab === 'stu-learning' && (
        <div className="space-y-4">
          {/* Two-Tier Sticky Filter Header Bar */}
          <div className="sticky top-2 z-30 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-[#1C2A27]">
                {vaultSubjectFilter === 'All'
                  ? 'Study Vault & Homework — All Subjects'
                  : `${vaultSubjectFilter} — Study Vault & Coursework`}
              </h1>
              <p className="text-[11px] text-[#686052] hidden sm:block">
                Showing verified revision notes and homework for {vaultSubjectFilter}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              <select
                value={vaultSubjectFilter}
                onChange={e => {
                  playUISound('click');
                  setVaultSubjectFilter(e.target.value);
                }}
                className="px-2.5 py-1.5 text-xs font-bold bg-white border border-[#C8BFA8] rounded-lg text-[#1C2A27] focus:outline-none focus:border-[#0A4D44] truncate"
              >
                <option value="All">All Subjects ({studyMaterials.length} Notes)</option>
                <option value="Mathematics (NCERT)">Mathematics (NCERT)</option>
                <option value="Science (Physics & Chem)">Science (Physics &amp; Chem)</option>
                <option value="Computer Science & AI">Computer Science &amp; AI</option>
                <option value="Social Studies & History">Social Studies &amp; History</option>
                <option value="English Literature">English Literature</option>
              </select>

              <input
                type="text"
                value={vaultSearchQuery}
                onChange={e => setVaultSearchQuery(e.target.value)}
                placeholder="Search notes or homework..."
                className="px-2.5 py-1.5 text-xs bg-white border border-[#C8BFA8] rounded-lg w-full sm:w-48 focus:outline-none focus:border-[#0A4D44]"
              />

              <button
                type="button"
                onClick={() => handleSelectNavTab('stu-readiness')}
                className="col-span-2 sm:col-span-1 px-3 py-1.5 rounded-lg bg-[#0A4D44] text-white text-xs font-semibold cursor-pointer"
              >
                Exam Readiness →
              </button>
            </div>
          </div>

          {/* Clean 2-Column Split Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left 6 Cols: Assigned Coursework & Homework */}
            <div className="lg:col-span-6 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1C2A27]">Assigned Coursework &amp; Homework ({tasks.length})</h2>
                <span className="text-[11px] font-mono text-[#0E6B5E]">Submit for XP</span>
              </div>
              <div className="divide-y divide-[#EAE2D3]">
                {tasks
                  .filter(
                    t =>
                      !vaultSearchQuery.trim() ||
                      t.title.toLowerCase().includes(vaultSearchQuery.toLowerCase()) ||
                      t.subject.toLowerCase().includes(vaultSearchQuery.toLowerCase())
                  )
                  .map(tsk => {
                    const isDone = tsk.completedBy.includes(currentStudent.id);
                    return (
                      <div key={tsk.id} className="p-3.5 hover:bg-[#F7F3EB] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-semibold text-[#0E6B5E]">{tsk.subject} · {tsk.assignedBy}</span>
                          <span className="font-bold text-[#0A4D44]">+{tsk.xpReward} XP</span>
                        </div>
                        <h3 className="text-xs font-bold text-[#1C2A27]">{tsk.title}</h3>
                        <p className="text-xs text-[#4A443B]">{tsk.description}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-mono text-[#686052]">Due: {tsk.dueDate}</span>
                          <button
                            type="button"
                            disabled={isDone}
                            onClick={() => {
                              setTasks(prev =>
                                prev.map(t =>
                                  t.id === tsk.id ? { ...t, completedBy: [...t.completedBy, currentStudent.id] } : t
                                )
                              );
                              handleAwardBonusXP(currentStudent.id, tsk.xpReward, `Completed Homework: ${tsk.title}`);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              isDone ? 'bg-[#EAE2D3] text-[#686052]' : 'bg-[#0A4D44] text-white'
                            }`}
                          >
                            {isDone ? 'Submitted ✓' : 'Mark Completed'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right 6 Cols: Digital Study Material & Revision Notes */}
            <div className="lg:col-span-6 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1C2A27]">
                  Digital Revision Notes ({vaultSubjectFilter})
                </h2>
                {vaultSubjectFilter !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setVaultSubjectFilter('All')}
                    className="text-xs font-semibold text-[#0E6B5E] hover:underline cursor-pointer"
                  >
                    Show All
                  </button>
                )}
              </div>
              <div className="divide-y divide-[#EAE2D3]">
                {studyMaterials
                  .filter(
                    mat =>
                      (vaultSubjectFilter === 'All' ||
                        mat.subject.toLowerCase() === vaultSubjectFilter.toLowerCase() ||
                        vaultSubjectFilter.toLowerCase().includes(mat.subject.toLowerCase())) &&
                      (!vaultSearchQuery.trim() ||
                        mat.title.toLowerCase().includes(vaultSearchQuery.toLowerCase()) ||
                        mat.subject.toLowerCase().includes(vaultSearchQuery.toLowerCase()))
                  )
                  .map(mat => (
                    <div
                      key={mat.id}
                      className="p-3.5 hover:bg-[#F7F3EB] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase text-[#0E6B5E] font-bold block">
                          {mat.subject} · {mat.pages} Pages · {mat.views} Views
                        </span>
                        <h3 className="text-xs font-bold text-[#1C2A27] truncate mt-0.5">{mat.title}</h3>
                        <p className="text-[11px] text-[#686052]">Uploaded by {mat.uploadedBy}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playUISound('click');
                          setReadingMaterial(mat);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        Read Note
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 10: NCERT FORMULAE, PERIODIC TABLE & 3D CHEMISTRY LAB
         ===================================================================== */}
      {studentTab === 'stu-arcade' && (
        <StudentArcade
          currentStudent={currentStudent}
          handleAwardBonusXP={handleAwardBonusXP}
          playUISound={playUISound}
          showToast={showToast}
          isScrolledDown={isScrolledDown}
        />
      )}

      {/* =====================================================================
          TAB 11: TUITION FEE LEDGER & RECEIPTS (2x2 BENTO GRID ON MOBILE)
         ===================================================================== */}
      {studentTab === 'stu-fees' && (
        <div className="space-y-4">
          {/* 2x2 Square Bento Grid on Mobile + 4-Column Row on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3 sm:p-3.5">
              <span className="text-[11px] font-semibold text-[#686052] block">Annual Fee</span>
              <strong className="text-lg sm:text-xl font-mono font-bold text-[#1C2A27] mt-1 block tabular-nums">
                ₹{currentStudent.totalFee.toLocaleString()}
              </strong>
              <span className="text-[10px] font-mono text-[#686052]">#{currentStudent.id} · Sec {currentStudent.grade}</span>
            </div>

            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3 sm:p-3.5">
              <span className="text-[11px] font-semibold text-[#686052] block">Total Remitted</span>
              <strong className="text-lg sm:text-xl font-mono font-bold text-[#0A4D44] mt-1 block tabular-nums">
                ₹{currentStudent.paidFee.toLocaleString()}
              </strong>
              <span className="text-[10px] font-mono text-[#686052] truncate block">{currentStudent.lastPaymentDate}</span>
            </div>

            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-3 sm:p-3.5">
              <span className="text-[11px] font-semibold text-[#686052] block">Balance Due</span>
              <strong
                className={`text-lg sm:text-xl font-mono font-bold mt-1 block tabular-nums ${
                  currentStudent.dueFee > 0 ? 'text-[#8B2626]' : 'text-[#0A4D44]'
                }`}
              >
                ₹{currentStudent.dueFee.toLocaleString()}
              </strong>
              <span className="text-[10px] font-mono text-[#686052]">Status: {currentStudent.feeStatus}</span>
            </div>

            {/* Card 4: Inline Online Fee Payment Control */}
            <div className="bg-[#FAF6EE] border border-[#DDD4C2] rounded-xl p-3 sm:p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-[#1C2A27] block">Pay Online</span>
              {currentStudent.dueFee > 0 ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="number"
                    value={feePayAmount}
                    max={currentStudent.dueFee}
                    onChange={e => setFeePayAmount(e.target.value)}
                    className="w-20 sm:w-24 px-2 py-1.5 text-xs font-mono font-bold bg-white border border-[#C8BFA8] rounded-lg tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => handlePayFeeInstallment(currentStudent.id, feePayAmount)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold cursor-pointer"
                  >
                    Pay
                  </button>
                </div>
              ) : (
                <strong className="text-xs font-mono text-[#0A4D44] mt-1 block">Cleared ✓</strong>
              )}
              <span className="text-[10px] text-[#686052] mt-1">Instant PDF Receipt</span>
            </div>
          </div>

          {/* High-Density Payment History & Receipt Table */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3] flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-[#1C2A27]">
                  Installment Payment History &amp; Official Fee Receipts
                </h2>
                <p className="text-[11px] text-[#686052]">
                  Verified ledger for {currentStudent.name} (#{currentStudent.id})
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const latest = currentStudent.paymentHistory[currentStudent.paymentHistory.length - 1];
                  if (latest) setPrintingReceipt(latest);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0A4D44] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <StreamlineIcon name="print" className="w-3.5 h-3.5" /> Latest Receipt PDF
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] font-mono tracking-wider">
                    <th className="py-2.5 px-4">Receipt No.</th>
                    <th className="py-2.5 px-4">Installment Head</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3 text-right">Amount Paid</th>
                    <th className="py-2.5 px-4 text-right">Official Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D3]">
                  {currentStudent.paymentHistory.map(tx => (
                    <tr key={tx.receiptNo} className="hover:bg-[#F7F3EB]">
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0A4D44]">#{tx.receiptNo}</td>
                      <td className="py-2.5 px-4 font-semibold text-[#1C2A27]">{tx.InstallmentName}</td>
                      <td className="py-2.5 px-3 font-mono text-[#686052]">{tx.date}</td>
                      <td className="py-2.5 px-3 text-[#4A443B]">{tx.mode}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0A4D44] tabular-nums">
                        ₹{tx.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            playUISound('click');
                            setPrintingReceipt(tx);
                          }}
                          className="px-2.5 py-1 rounded bg-[#0A4D44] hover:bg-[#073831] text-white text-[11px] font-semibold cursor-pointer"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 12: LEADERBOARD
         ===================================================================== */}
      {studentTab === 'stu-leaderboard' && (
        <LeaderboardModule
          activeRole={activeRole}
          rankedStudents={rankedStudents}
          currentStudent={currentStudent}
          availableClasses={availableClasses}
          setPrintingStudentId={setPrintingStudentId}
          playUISound={playUISound}
        />
      )}

      {/* =====================================================================
          TAB 13: WHATSAPP / SLACK SPLIT FACULTY & STUDY GROUP CHAT
         ===================================================================== */}
      {studentTab === 'stu-chat' && (
        <ChatModule
          groups={groups}
          setGroups={setGroups}
          activeRole={activeRole}
          currentStudent={currentStudent}
          activeTeacher={activeTeacher}
          students={students}
          teachers={teachers}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}

      {/* =====================================================================
          TAB 14: LEAVE APPLICATION & WELFARE DESK (DROPDOWN SELECTORS + 2-COL SPLIT)
         ===================================================================== */}
      {studentTab === 'stu-whisper' && (
        <div className="space-y-4">
          {/* Sticky Context-Aware Sub-Portal Header Bar */}
          <div className="sticky top-2 z-30 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-[#1C2A27]">
                {deskSubTab === 'leave'
                  ? `Absent Leave Desk — ${leaveType} (${calculatedLeaveDays} Days)`
                  : `Confidential Welfare Desk — ${whisperCategory} (${whisperUrgency} Priority)`}
              </h1>
              <p className="text-[11px] text-[#686052] hidden sm:block">
                {deskSubTab === 'leave'
                  ? `Applying from ${leaveFromDate} to ${leaveToDate} with proof: ${leaveProofDoc}`
                  : `Zero-knowledge encrypted escalation for ${whisperLocation}`}
              </p>
            </div>

            <div className="grid grid-cols-2 w-full sm:w-auto sm:flex items-center gap-1 bg-[#F5F0E6] p-1 rounded-lg border border-[#DDD4C2]">
              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  setDeskSubTab('leave');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                  deskSubTab === 'leave'
                    ? 'bg-[#0A4D44] text-white'
                    : 'text-[#5A5346] hover:text-[#1C2A27]'
                }`}
              >
                1. Absent Leave
              </button>
              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  setDeskSubTab('whisper');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                  deskSubTab === 'whisper'
                    ? 'bg-[#0A4D44] text-white'
                    : 'text-[#5A5346] hover:text-[#1C2A27]'
                }`}
              >
                2. Welfare Desk
              </button>
            </div>
          </div>

          {deskSubTab === 'leave' ? (
            /* SUB-TAB 1: DROPDOWN-DRIVEN LEAVE FORM + RIGHT STATUS TABLE */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const newLeave: LeaveApplication = {
                    id: `LVE-${Math.floor(2050 + Math.random() * 900)}`,
                    applicantRole: 'student',
                    applicantId: currentStudent.id,
                    applicantName: currentStudent.name,
                    gradeOrDept: currentStudent.grade,
                    leaveType,
                    fromDate: leaveFromDate,
                    toDate: leaveToDate,
                    totalDays: calculatedLeaveDays,
                    reason: leaveReason.trim() || `${leaveType} from ${leaveFromDate} to ${leaveToDate}.`,
                    proofDocument: leaveProofDoc || undefined,
                    status: 'Approved',
                    appliedAt: 'Just now',
                    reviewedBy: 'Ms. Sunita Rao (#900102)'
                  };
                  setLeaveApplications(prev => [newLeave, ...prev]);
                  playUISound('success');
                  showToast(
                    'Leave Application Approved',
                    `${calculatedLeaveDays}-day leave (${leaveFromDate} to ${leaveToDate}) logged.`,
                    'success'
                  );
                }}
                className="lg:col-span-5 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-4 space-y-3.5"
              >
                <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-2.5">
                  <h2 className="text-sm font-bold text-[#1C2A27]">Submit Leave Request</h2>
                  <span className="px-2.5 py-0.5 rounded bg-[#EFF5F3] border border-[#9CC5BE] text-xs font-mono font-bold text-[#0A4D44] tabular-nums">
                    {calculatedLeaveDays} Day(s)
                  </span>
                </div>

                {/* Dropdown 1: Leave Category (No Button Grid Sprawl!) */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C2A27] mb-1">1. Leave Category</label>
                  <select
                    value={leaveType}
                    onChange={e => setLeaveType(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg text-[#1C2A27]"
                  >
                    <option value="Medical / Illness Leave">Medical / Illness Leave</option>
                    <option value="Family Event / Function">Family Event / Function</option>
                    <option value="Sports / Olympiad Duty">Sports / Olympiad On-Duty (OD)</option>
                    <option value="Emergency / Personal">Emergency / Personal Leave</option>
                    <option value="Half-Day Early Departure">Half-Day Early Departure</option>
                    <option value="Outstation Travel">Outstation Travel</option>
                  </select>
                </div>

                {/* Date Range Inputs */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">2. From Date</label>
                    <input
                      type="date"
                      value={leaveFromDate}
                      onChange={e => setLeaveFromDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">3. To Date</label>
                    <input
                      type="date"
                      value={leaveToDate}
                      min={leaveFromDate}
                      onChange={e => setLeaveToDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                </div>

                {/* Dropdown 2: Quick Reason Template + Custom Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1C2A27]">4. Reason Preset / Explanation</label>
                  <select
                    value={LEAVE_REASON_PRESETS.includes(leaveReason) ? leaveReason : 'custom'}
                    onChange={e => {
                      if (e.target.value !== 'custom') setLeaveReason(e.target.value);
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg text-[#1C2A27]"
                  >
                    {LEAVE_REASON_PRESETS.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="custom">Custom Reason (Type Below)</option>
                  </select>
                  <textarea
                    rows={2}
                    value={leaveReason}
                    onChange={e => setLeaveReason(e.target.value)}
                    placeholder="Enter specific leave details for your Class Teacher..."
                    className="w-full px-3 py-1.5 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
                  />
                </div>

                {/* Dropdown 3: Supporting Proof Document */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C2A27] mb-1">5. Supporting Proof Document</label>
                  <select
                    value={leaveProofDoc}
                    onChange={e => setLeaveProofDoc(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg text-[#1C2A27]"
                  >
                    <option value="Medical_Fitness_Certificate.pdf">📎 Medical_Fitness_Certificate.pdf</option>
                    <option value="Doctor_Prescription_Slip.jpg">📎 Doctor_Prescription_Slip.jpg</option>
                    <option value="Parent_Signed_Consent_Note.pdf">📎 Parent_Signed_Consent_Note.pdf</option>
                    <option value="Olympiad_Invitation_Letter.pdf">📎 Olympiad_Invitation_Letter.pdf</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold transition cursor-pointer"
                >
                  Submit Leave Application ({calculatedLeaveDays} Days)
                </button>
              </form>

              {/* Right 7 Cols: Leave History Table */}
              <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1C2A27]">My Leave Applications &amp; Approval Ledger</h3>
                  <span className="text-[11px] font-mono text-[#0E6B5E]">Section {currentStudent.grade}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] font-mono">
                      <tr>
                        <th className="py-2.5 px-3">Ref &amp; Category</th>
                        <th className="py-2.5 px-3">Dates &amp; Days</th>
                        <th className="py-2.5 px-3">Reason &amp; Proof</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE2D3]">
                      {leaveApplications
                        .filter(l => l.applicantRole === 'student' && l.applicantId === currentStudent.id)
                        .map(lv => (
                          <tr key={lv.id} className="hover:bg-[#F7F3EB]">
                            <td className="py-3 px-3">
                              <strong className="font-mono text-[#0A4D44] block">{lv.id}</strong>
                              <span className="text-[11px] font-semibold text-[#1C2A27]">{lv.leaveType}</span>
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                              <span className="block text-[#1C2A27]">{lv.fromDate} → {lv.toDate}</span>
                              <strong className="text-[#0E6B5E]">{lv.totalDays} Day(s)</strong>
                            </td>
                            <td className="py-3 px-3">
                              <p className="text-xs text-[#4A443B]">{lv.reason}</p>
                              {lv.proofDocument && (
                                <span className="text-[10px] font-mono text-[#0E6B5E] block mt-0.5">
                                  📎 {lv.proofDocument}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-[#EFF5F3] border border-[#9CC5BE] text-[11px] font-semibold text-[#0A4D44]">
                                {lv.status} ✓
                              </span>
                              <span className="block text-[10px] text-[#686052] mt-1">{lv.reviewedBy}</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* SUB-TAB 2: DROPDOWN-DRIVEN CONFIDENTIAL WELFARE DESK */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!whisperMessage.trim()) return;
                  const created: WhisperReport = {
                    id: `CMP-${Math.floor(100 + Math.random() * 899)}`,
                    category: whisperCategory,
                    filedByRole: 'Zero-Knowledge Encrypted Student Dispatch',
                    urgency: whisperUrgency,
                    location: whisperLocation,
                    message: whisperMessage.trim(),
                    timestamp: 'Just now',
                    status: 'Pending Directorate Action',
                    resolutionNote: ''
                  };
                  setWhispers(prev => [created, ...prev]);
                  setWhisperMessage('');
                  playUISound('success');
                  showToast('Encrypted Report Dispatched', 'Zero personal identifiers attached.', 'success');
                }}
                className="lg:col-span-5 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-4 space-y-3.5"
              >
                <div className="border-b border-[#EAE2D3] pb-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#0E6B5E] font-bold block">
                    Zero-Knowledge Identity Shield
                  </span>
                  <h2 className="text-sm font-bold text-[#1C2A27]">
                    File Anonymous Welfare or Safety Escalation
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2A27] mb-1">1. Report Category</label>
                  <select
                    value={whisperCategory}
                    onChange={e => setWhisperCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                  >
                    <option>Anti-Ragging &amp; Bullying Alert</option>
                    <option>Washroom &amp; Drinking Water Hygiene</option>
                    <option>Academic Stress &amp; Counselling Request</option>
                    <option>Classroom Safety or Bus Route Issue</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">2. Campus Zone</label>
                    <select
                      value={whisperLocation}
                      onChange={e => setWhisperLocation(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    >
                      <option>Academic Wing Corridor</option>
                      <option>Science &amp; Computer Lab</option>
                      <option>Washroom / Water Cooler</option>
                      <option>Sports Complex / Canteen</option>
                      <option>School Bus / Gate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">3. Urgency Level</label>
                    <select
                      value={whisperUrgency}
                      onChange={e => setWhisperUrgency(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    >
                      <option value="Standard">Standard</option>
                      <option value="High">High Priority</option>
                      <option value="Critical Immediate">Critical Immediate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2A27] mb-1">4. Incident Details</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the concern clearly..."
                    value={whisperMessage}
                    onChange={e => setWhisperMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Transmit Encrypted Report
                </button>
              </form>

              <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3]">
                  <h3 className="text-sm font-bold text-[#1C2A27]">Directorate Resolution &amp; Action Log</h3>
                </div>
                <div className="divide-y divide-[#EAE2D3]">
                  {whispers.map(w => (
                    <div key={w.id} className="p-3.5 hover:bg-[#F7F3EB] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <strong className="text-[#1C2A27]">{w.id} · {w.category}</strong>
                        <span className="text-[#0E6B5E] font-semibold">{w.status}</span>
                      </div>
                      <p className="text-[#4A443B]">&ldquo;{w.message}&rdquo;</p>
                      <div className="flex items-center justify-between text-[11px] text-[#686052]">
                        <span>Urgency: <strong>{w.urgency}</strong> · {w.location}</span>
                        <span className="font-mono">{w.timestamp}</span>
                      </div>
                      {w.resolutionNote && (
                        <div className="p-2 rounded bg-[#EFF5F3] border border-[#9CC5BE] text-[#0A4D44] font-medium">
                          Action: {w.resolutionNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
