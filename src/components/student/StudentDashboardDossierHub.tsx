import React, { useState, useMemo } from 'react';
import { FeeTransaction, RankedStudent, Student, Teacher, TimetablePeriod } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';
import { UserAvatar } from '../common/UserAvatar';

interface StudentDashboardDossierHubProps {
  currentStudent: Student;
  currentStudentRankObj: RankedStudent;
  teachers: Teacher[];
  timetable: TimetablePeriod[];
  condonedApplied: boolean;
  onSimulateAttendNextDay: () => void;
  onApplyMedicalCondonation: () => void;
  handlePayFeeInstallment: (studentId: string, amount: number | string) => void;
  onPrintReceipt: (receipt: FeeTransaction) => void;
  handleSelectNavTab: (tabId: string) => void;
  handleAwardBonusXP?: (studentId: string, amount: number, reason: string) => void;
  onPrintReportCard: () => void;
  onPrintTimetable: () => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

interface SiblingRecord {
  id: string;
  name: string;
  relation: 'Brother' | 'Sister';
  gradeSection: string;
  rollNo: number;
  house: string;
  feeConcession: string;
  busRoute: string;
}

interface BookedAppointment {
  id: string;
  targetRole: 'Principal' | 'Class Teacher' | 'Personal Mentor';
  facultyName: string;
  slotTime: string;
  topic: string;
  status: 'Confirmed' | 'Scheduled';
}

const MONTHLY_ATTENDANCE_BREAKDOWN = [
  { month: 'May 2026', present: 21, total: 22, pct: 95.5, status: 'Exemplary' },
  { month: 'Jul 2026', present: 23, total: 25, pct: 92.0, status: 'Nominal' },
  { month: 'Aug 2026', present: 20, total: 24, pct: 83.3, status: 'Nominal' },
  { month: 'Sep 2026', present: 22, total: 25, pct: 88.0, status: 'Nominal' },
  { month: 'Oct 2026', present: 14, total: 15, pct: 93.3, status: 'Exemplary' }
];

const UPCOMING_EXAM_SCHEDULE = [
  { code: 'EXM-201', date: '24 Oct 2026', time: '09:00 AM', subject: 'Science (Physics & Chem)', type: 'Unit Assessment IV', room: 'Hall 204', syllabus: 'Ray Optics, Snell Law, Acid-Base Titration' },
  { code: 'EXM-202', date: '29 Oct 2026', time: '09:00 AM', subject: 'Mathematics (NCERT)', type: 'Unit Assessment IV', room: 'Main Hall A', syllabus: 'Quadratic Equations, AP, Trig Identities' },
  { code: 'EXM-203', date: '04 Nov 2026', time: '10:30 AM', subject: 'Computer Science & AI', type: 'Practical Eval', room: 'AI Lab 102', syllabus: 'Python Sorting, Binary Search, SQL Joins' },
  { code: 'EXM-204', date: '16 Nov 2026', time: '09:00 AM', subject: 'Social Studies & History', type: 'Mid-Term Exam', room: 'Main Hall B', syllabus: 'Nationalism in India, Federalism, Cropping' },
  { code: 'EXM-205', date: '19 Nov 2026', time: '09:00 AM', subject: 'English Literature', type: 'Mid-Term Exam', room: 'Room 108', syllabus: 'First Flight Prose/Poetry, Analytical Writing' }
];

export const StudentDashboardDossierHub: React.FC<StudentDashboardDossierHubProps> = ({
  currentStudent,
  currentStudentRankObj,
  teachers,
  timetable,
  condonedApplied,
  onSimulateAttendNextDay,
  onApplyMedicalCondonation,
  handlePayFeeInstallment,
  onPrintReceipt,
  handleSelectNavTab,
  handleAwardBonusXP,
  onPrintReportCard,
  onPrintTimetable,
  playUISound,
  showToast
}) => {
  // Top 4-KPI Instant Slide-Over Drawer State
  const [activeKpiDrawer, setActiveKpiDrawer] = useState<'fee' | 'attendance' | 'exams' | 'timetable' | null>(null);

  // Right Column Faculty Desk Tab ('teacher' | 'mentor' | 'principal')
  const [facultyDeskTab, setFacultyDeskTab] = useState<'teacher' | 'mentor' | 'principal'>('teacher');

  const [quickPayAmount, setQuickPayAmount] = useState<number | string>(
    currentStudent.dueFee > 0 ? Math.min(5000, currentStudent.dueFee) : 5000
  );
  const [targetAttendanceGoal, setTargetAttendanceGoal] = useState<number>(85);

  // Siblings State
  const lastName = currentStudent.name.split(' ').slice(-1)[0] || 'Verma';
  const [siblings, setSiblings] = useState<SiblingRecord[]>([
    {
      id: '102488',
      name: `Ananya ${lastName}`,
      relation: 'Sister',
      gradeSection: '7-A',
      rollNo: 8,
      house: currentStudent.house,
      feeConcession: '10% Sibling Rebate',
      busRoute: 'Route #04 (Same Bus)'
    },
    {
      id: '103105',
      name: `Rohan ${lastName}`,
      relation: 'Brother',
      gradeSection: '4-B',
      rollNo: 19,
      house: currentStudent.house,
      feeConcession: '5% Sibling Care',
      busRoute: 'Route #04 (Same Bus)'
    }
  ]);
  const [showAddSibling, setShowAddSibling] = useState(false);
  const [newSiblingName, setNewSiblingName] = useState('');
  const [newSiblingRelation, setNewSiblingRelation] = useState<'Brother' | 'Sister'>('Brother');
  const [newSiblingGrade, setNewSiblingGrade] = useState('6-A');
  const [newSiblingRegId, setNewSiblingRegId] = useState('104219');

  // Faculty Booking States (Dropdown-based)
  const [teacherSlot, setTeacherSlot] = useState('Tomorrow • 01:40 PM (Recess Cabin)');
  const [teacherAgenda, setTeacherAgenda] = useState('Academic Progress & Unit Test Review');

  const [mentorFocus, setMentorFocus] = useState('Olympiad & Board Exam Strategy');
  const [mentorSlot, setMentorSlot] = useState('Friday • 02:15 PM (1-on-1 Cabin)');

  const [principalSlot, setPrincipalSlot] = useState('Tomorrow • 10:30 AM – 10:45 AM');
  const [principalPurpose, setPrincipalPurpose] = useState('Scholarship & Sibling Fee Concession');

  const [appointments, setAppointments] = useState<BookedAppointment[]>([
    {
      id: 'APT-904',
      targetRole: 'Personal Mentor',
      facultyName: 'Dr. Vikramaditya Sen (#900101)',
      slotTime: 'Fri, 23 Oct • 02:15 PM',
      topic: 'NCERT Numerical Speed & Board Prep',
      status: 'Scheduled'
    }
  ]);

  // Class Teacher, Class Incharge & Personal Mentor Lookup
  const classTeacher = useMemo(() => {
    return (
      teachers.find(t => t.classTeacherOf === currentStudent.grade) ||
      teachers.find(t => Array.isArray(t.classes) && t.classes.includes(currentStudent.grade)) ||
      teachers[0]
    );
  }, [teachers, currentStudent.grade]);

  const classIncharge = useMemo(() => {
    return (
      teachers.find(
        t =>
          t.id !== classTeacher?.id &&
          Array.isArray(t.classes) &&
          t.classes.includes(currentStudent.grade)
      ) ||
      teachers[1] ||
      teachers[0]
    );
  }, [teachers, classTeacher, currentStudent.grade]);

  const personalMentor = useMemo(() => {
    return (
      teachers.find(t => t.id !== classTeacher?.id && t.id !== classIncharge?.id) ||
      teachers[2] ||
      teachers[0]
    );
  }, [teachers, classTeacher, classIncharge]);

  // Student's Class Periods
  const studentPeriods = useMemo(() => {
    const matching = timetable.filter(p => p.classGrade === currentStudent.grade);
    return matching.length > 0 ? matching : timetable.slice(0, 6);
  }, [timetable, currentStudent.grade]);

  const liveOrNextPeriod = useMemo(() => {
    return studentPeriods.find(p => p.status === 'Ongoing') || studentPeriods[0];
  }, [studentPeriods]);

  // Attendance Math
  const attendancePct = useMemo(() => {
    return Math.round((currentStudent.presentDays / Math.max(1, currentStudent.totalDays)) * 100);
  }, [currentStudent.presentDays, currentStudent.totalDays]);

  const absentDays = Math.max(0, currentStudent.totalDays - currentStudent.presentDays);
  const daysNeededForTarget = useMemo(() => {
    const goal = targetAttendanceGoal / 100;
    const p = currentStudent.presentDays;
    const t = currentStudent.totalDays;
    if (p / t >= goal) return 0;
    return Math.max(0, Math.ceil((goal * t - p) / (1 - goal)));
  }, [currentStudent.presentDays, currentStudent.totalDays, targetAttendanceGoal]);

  const feePaidPct = Math.min(
    100,
    Math.round((currentStudent.paidFee / Math.max(1, currentStudent.totalFee)) * 100)
  );

  // Enriched Profile Metadata
  const studentDetails = useMemo(() => {
    const rollSeed = currentStudent.rollNo || 14;
    return {
      bloodGroup: ['O+', 'A+', 'B+', 'AB+'][rollSeed % 4],
      dob: `14 Aug ${2010 - (currentStudent.grade.startsWith('12') ? 2 : 0)}`,
      house: currentStudent.house || 'Agni House',
      fatherName: `Mr. Rajeshwar ${lastName}`,
      motherName: `Mrs. Kavita ${lastName}`,
      guardianPhone: currentStudent.parentPhone || '+91 98201-44812',
      residentialAddress: `Plot No. ${42 + rollSeed}, Sector 14, Vasant Kunj Enclave, New Delhi – 110070`,
      transportRoute: `Bus Route #04 • Vasant Kunj Gate (07:20 AM)`
    };
  }, [currentStudent, lastName]);

  const handleAddSibling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiblingName.trim()) return;
    playUISound('success');
    const created: SiblingRecord = {
      id: newSiblingRegId.trim() || `104${Math.floor(100 + Math.random() * 899)}`,
      name: newSiblingName.trim(),
      relation: newSiblingRelation,
      gradeSection: newSiblingGrade,
      rollNo: Math.floor(4 + Math.random() * 25),
      house: currentStudent.house,
      feeConcession: '10% Sibling Rebate',
      busRoute: 'Route #04 (Same Bus)'
    };
    setSiblings(prev => [...prev, created]);
    setNewSiblingName('');
    setShowAddSibling(false);
    showToast('Sibling Linked', `${created.name} (${created.gradeSection}) linked to family dossier.`, 'success');
  };

  const handleBookSlot = (role: 'Principal' | 'Class Teacher' | 'Personal Mentor') => {
    playUISound('success');
    let facName = 'Dr. S. Radhakrishnan (#100001)';
    let slot = principalSlot;
    let topic = principalPurpose;

    if (role === 'Class Teacher') {
      facName = `${classTeacher?.name} (#${classTeacher?.id})`;
      slot = teacherSlot;
      topic = teacherAgenda;
    } else if (role === 'Personal Mentor') {
      facName = `${personalMentor?.name} (#${personalMentor?.id})`;
      slot = mentorSlot;
      topic = mentorFocus;
    }

    const created: BookedAppointment = {
      id: `APT-${Math.floor(100 + Math.random() * 899)}`,
      targetRole: role,
      facultyName: facName,
      slotTime: slot,
      topic,
      status: 'Confirmed'
    };
    setAppointments(prev => [created, ...prev]);
    if (handleAwardBonusXP) {
      handleAwardBonusXP(currentStudent.id, 15, `Booked ${role} Consultation`);
    } else {
      showToast(`${role} Slot Confirmed`, `${slot} booked with ${facName}.`, 'success');
    }
  };

  return (
    <div className="space-y-4">
      {/* =====================================================================
          INSTANT SLIDE-OVER KPI DRAWER (FEE | ATTENDANCE | EXAMS | TIMETABLE)
         ===================================================================== */}
      {activeKpiDrawer && (
        <div className="fixed inset-0 z-50 bg-[#0F1E1B]/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-[#FFFDF9] border-l border-[#D5CBB8] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header & Quick Switcher */}
            <div className="p-4 bg-[#0A3630] text-[#F5F0E6] border-b border-[#19574E] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CC5BE] block">
                    Student Quick-Access Drawer • {currentStudent.name} (#{currentStudent.id})
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    {activeKpiDrawer === 'fee' && 'School Tuition Fee & Receipt Ledger'}
                    {activeKpiDrawer === 'attendance' && 'Attendance Calculator & Monthly Breakdown'}
                    {activeKpiDrawer === 'exams' && 'Upcoming Examination Schedule & Syllabus'}
                    {activeKpiDrawer === 'timetable' && `Section ${currentStudent.grade} Daily Class Timetable`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveKpiDrawer(null)}
                  className="p-1.5 rounded-lg bg-[#124E45] hover:bg-[#196358] text-white cursor-pointer"
                >
                  <StreamlineIcon name="close" className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Mode Tabs */}
              <div className="grid grid-cols-4 gap-1 bg-[#072622] p-1 rounded-lg border border-[#19574E]">
                {[
                  { id: 'fee' as const, label: 'Tuition Fee' },
                  { id: 'attendance' as const, label: 'Attendance' },
                  { id: 'exams' as const, label: 'Exam Dates' },
                  { id: 'timetable' as const, label: 'Timetable' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      playUISound('click');
                      setActiveKpiDrawer(t.id);
                    }}
                    className={`py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                      activeKpiDrawer === t.id
                        ? 'bg-[#F5F0E6] text-[#072622]'
                        : 'text-[#9CC5BE] hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {activeKpiDrawer === 'fee' && (
                <>
                  <div className="grid grid-cols-3 gap-2.5 font-mono">
                    <div className="p-3 rounded-lg bg-[#F7F3EB] border border-[#DDD4C2]">
                      <span className="text-[10px] text-[#686052] block">Annual Fee</span>
                      <strong className="text-sm text-[#1C2A27] tabular-nums">₹{currentStudent.totalFee.toLocaleString()}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-[#EFF5F3] border border-[#9CC5BE]">
                      <span className="text-[10px] text-[#0E6B5E] block">Paid ({feePaidPct}%)</span>
                      <strong className="text-sm text-[#0A4D44] tabular-nums">₹{currentStudent.paidFee.toLocaleString()}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF2F2] border border-[#E2C9C9]">
                      <span className="text-[10px] text-[#8B2626] block">Balance Due</span>
                      <strong className="text-sm text-[#8B2626] tabular-nums">₹{currentStudent.dueFee.toLocaleString()}</strong>
                    </div>
                  </div>

                  {currentStudent.dueFee > 0 && (
                    <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-[#1C2A27] block">Pay Online Installment</span>
                        <span className="text-[11px] text-[#686052]">Generates instant official PDF receipt</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={quickPayAmount}
                          max={currentStudent.dueFee}
                          onChange={e => setQuickPayAmount(e.target.value)}
                          className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-[#C8BFA8] rounded-lg tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() => handlePayFeeInstallment(currentStudent.id, quickPayAmount)}
                          className="px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold cursor-pointer"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="border border-[#DDD4C2] rounded-xl overflow-hidden">
                    <div className="px-3.5 py-2.5 bg-[#FAF6EE] border-b border-[#EAE2D3] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1C2A27]">Verified Receipt Ledger</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveKpiDrawer(null);
                          handleSelectNavTab('stu-fees');
                        }}
                        className="text-xs font-semibold text-[#0E6B5E] hover:underline cursor-pointer"
                      >
                        Full Fee Page →
                      </button>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F5F0E6] text-[10px] uppercase text-[#686052] font-mono">
                        <tr>
                          <th className="py-2 px-3">Receipt</th>
                          <th className="py-2 px-3">Installment</th>
                          <th className="py-2 px-3 text-right">Amount</th>
                          <th className="py-2 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE2D3]">
                        {currentStudent.paymentHistory.map(tx => (
                          <tr key={tx.receiptNo} className="hover:bg-[#F7F3EB]">
                            <td className="py-2.5 px-3 font-mono font-semibold text-[#0A4D44]">#{tx.receiptNo}</td>
                            <td className="py-2.5 px-3 text-[#1C2A27]">
                              {tx.InstallmentName}
                              <span className="block text-[10px] text-[#686052] font-mono">{tx.date} · {tx.mode}</span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#1C2A27] tabular-nums">
                              ₹{tx.amount.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  playUISound('click');
                                  onPrintReceipt(tx);
                                }}
                                className="px-2.5 py-1 rounded bg-[#0A4D44] text-white text-[11px] font-medium cursor-pointer"
                              >
                                PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeKpiDrawer === 'attendance' && (
                <>
                  <div className="grid grid-cols-3 gap-2.5 font-mono">
                    <div className="p-3 rounded-lg bg-[#EFF5F3] border border-[#9CC5BE]">
                      <span className="text-[10px] text-[#0E6B5E] block">Present Days</span>
                      <strong className="text-sm text-[#0A4D44] tabular-nums">
                        {currentStudent.presentDays} / {currentStudent.totalDays}
                      </strong>
                    </div>
                    <div className="p-3 rounded-lg bg-[#F7F3EB] border border-[#DDD4C2]">
                      <span className="text-[10px] text-[#686052] block">Absent Days</span>
                      <strong className="text-sm text-[#8B2626] tabular-nums">{absentDays} Days</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0A3630] text-white">
                      <span className="text-[10px] text-[#9CC5BE] block">Aggregate %</span>
                      <strong className="text-sm tabular-nums">{attendancePct}%</strong>
                    </div>
                  </div>

                  {/* Target Attendance Dropdown & Interactive Simulator */}
                  <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-[#1C2A27]">Target Attendance Goal:</label>
                      <select
                        value={targetAttendanceGoal}
                        onChange={e => setTargetAttendanceGoal(Number(e.target.value))}
                        className="px-2.5 py-1 text-xs font-mono font-semibold bg-white border border-[#C8BFA8] rounded-lg"
                      >
                        <option value={75}>75% (Board Minimum)</option>
                        <option value={80}>80% (Good Standing)</option>
                        <option value={85}>85% (Merit Target)</option>
                        <option value={90}>90% (Scholar Tier)</option>
                        <option value={95}>95% (Honor Roll)</option>
                      </select>
                    </div>
                    <p className="text-xs text-[#4A443B]">
                      {daysNeededForTarget === 0
                        ? `You are already at or above your ${targetAttendanceGoal}% goal (${attendancePct}%).`
                        : `Attend ${daysNeededForTarget} consecutive school days to reach ${targetAttendanceGoal}%.`}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={onSimulateAttendNextDay}
                        className="py-2 px-3 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold cursor-pointer"
                      >
                        +1 Day Present
                      </button>
                      <button
                        type="button"
                        disabled={condonedApplied}
                        onClick={onApplyMedicalCondonation}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer ${
                          condonedApplied
                            ? 'bg-[#EAE2D3] text-[#686052]'
                            : 'bg-[#9A6B26] hover:bg-[#7D561D] text-white'
                        }`}
                      >
                        {condonedApplied ? 'Medical Credit Applied ✓' : 'Apply Medical Credit (+26d)'}
                      </button>
                    </div>
                  </div>

                  {/* Clean Monthly Attendance Table (Replaces Messy Graph) */}
                  <div className="border border-[#DDD4C2] rounded-xl overflow-hidden">
                    <div className="px-3.5 py-2.5 bg-[#FAF6EE] border-b border-[#EAE2D3]">
                      <span className="text-xs font-semibold text-[#1C2A27]">Monthly Attendance Ledger (2026–27)</span>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F5F0E6] text-[10px] uppercase text-[#686052] font-mono">
                        <tr>
                          <th className="py-2 px-3">Month</th>
                          <th className="py-2 px-3">Days</th>
                          <th className="py-2 px-3">Progress</th>
                          <th className="py-2 px-3 text-right">Pct</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE2D3] font-mono">
                        {MONTHLY_ATTENDANCE_BREAKDOWN.map(m => (
                          <tr key={m.month}>
                            <td className="py-2.5 px-3 font-sans font-semibold text-[#1C2A27]">{m.month}</td>
                            <td className="py-2.5 px-3 text-[#4A443B] tabular-nums">{m.present}/{m.total}</td>
                            <td className="py-2.5 px-3 w-32">
                              <div className="h-2 rounded-full bg-[#EAE2D3] overflow-hidden">
                                <div
                                  className="h-full bg-[#0A4D44] rounded-full"
                                  style={{ width: `${m.pct}%` }}
                                />
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-[#0A4D44] tabular-nums">{m.pct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeKpiDrawer === 'exams' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C2A27]">Official Exam Date Sheet (Section {currentStudent.grade})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveKpiDrawer(null);
                        handleSelectNavTab('stu-readiness');
                      }}
                      className="text-xs font-semibold text-[#0E6B5E] hover:underline cursor-pointer"
                    >
                      Open Exam Readiness Hub →
                    </button>
                  </div>
                  <div className="border border-[#DDD4C2] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F5F0E6] text-[10px] uppercase text-[#686052] font-mono">
                        <tr>
                          <th className="py-2.5 px-3">Date & Time</th>
                          <th className="py-2.5 px-3">Subject & Syllabus</th>
                          <th className="py-2.5 px-3 text-right">Room</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE2D3]">
                        {UPCOMING_EXAM_SCHEDULE.map(ex => (
                          <tr key={ex.code} className="hover:bg-[#F7F3EB]">
                            <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                              <strong className="text-[#0A4D44] block">{ex.date}</strong>
                              <span className="text-[10px] text-[#686052]">{ex.time}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <strong className="text-[#1C2A27] block">{ex.subject}</strong>
                              <span className="text-[11px] text-[#686052]">{ex.syllabus}</span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-[11px] text-[#4A443B] whitespace-nowrap">
                              {ex.room}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeKpiDrawer === 'timetable' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C2A27]">Daily Period Schedule (Section {currentStudent.grade})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveKpiDrawer(null);
                        onPrintTimetable();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0A4D44] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <StreamlineIcon name="print" className="w-3.5 h-3.5" /> Print Timetable PDF
                    </button>
                  </div>
                  <div className="border border-[#DDD4C2] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F5F0E6] text-[10px] uppercase text-[#686052] font-mono">
                        <tr>
                          <th className="py-2.5 px-3">Period</th>
                          <th className="py-2.5 px-3">Subject & Faculty</th>
                          <th className="py-2.5 px-3">Room</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE2D3]">
                        {studentPeriods.map(per => (
                          <tr key={per.id} className={per.status === 'Ongoing' ? 'bg-[#EFF5F3]' : 'hover:bg-[#F7F3EB]'}>
                            <td className="py-2.5 px-3 font-mono">
                              <strong className="text-[#1C2A27] block">{per.period}</strong>
                              <span className="text-[10px] text-[#686052]">{per.time}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <strong className="text-[#1C2A27] block">{per.subject}</strong>
                              <span className="text-[11px] text-[#686052]">{per.teacher}</span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-[#4A443B]">{per.roomNo}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-[11px] font-semibold">
                              <span className={per.status === 'Ongoing' ? 'text-[#0A4D44]' : 'text-[#686052]'}>
                                {per.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ROW 1 (FIRST ON LOGIN): OFFICIAL STUDENT PROFILE & ACADEMIC IDENTITY DOSSIER
         ===================================================================== */}
      <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
        {/* Top Executive Identity Banner - Solid Colors */}
        <div className="bg-[#072E29] text-white px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4 min-w-0 relative z-10">
            <div className="relative shrink-0">
              <div className="p-0.5 rounded-2xl bg-[#0A4D44] shadow-md">
                <UserAvatar id={currentStudent.id} name={currentStudent.name} size="w-13 h-13 sm:w-15 sm:h-15" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#072E29] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-black/25 border border-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  Official Student Dossier
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-black/25 text-white font-mono text-[10px] font-bold border border-white/20">
                  Reg #{currentStudent.id}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-[#9A6B26] text-white font-mono text-[10px] font-bold">
                  Rank #{currentStudentRankObj?.rank || 1}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white truncate mt-1 tracking-tight">
                {currentStudent.name}
              </h1>
              <p className="text-xs text-white/80 font-mono truncate mt-0.5">
                Class {currentStudent.grade} · Roll #{currentStudent.rollNo} · {studentDetails.house} · Blood {studentDetails.bloodGroup}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
            <div className="px-3.5 py-2 rounded-xl bg-black/25 border border-white/20 text-right shadow-xs">
              <span className="text-[10px] font-mono uppercase text-white/80 block leading-none">
                Academic Score
              </span>
              <strong className="text-sm sm:text-base font-mono font-extrabold text-white tabular-nums">
                {currentStudent.dailyTestAvgScore || 94.2}% · {currentStudent.points.toLocaleString()} XP
              </strong>
            </div>
            <button
              type="button"
              onClick={onPrintReportCard}
              className="px-3.5 py-2 rounded-xl bg-[#F5F0E6] hover:bg-white text-[#072E29] text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <StreamlineIcon name="print" className="w-3.5 h-3.5" /> Report Card
            </button>
          </div>
        </div>

        {/* 4-Column Personal, Guardian, Address & Transport Information Grid */}
        <div className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-[#F5F0E6]">
          <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#DDD4C2] shadow-2xs hover:border-[#0A4D44] transition-all group">
            <span className="text-[10px] text-[#686052] uppercase font-mono font-semibold block tracking-wider">Father &amp; Mother Name</span>
            <strong className="text-[#1C2A27] block mt-1 truncate font-bold text-xs">{studentDetails.fatherName}</strong>
            <span className="text-[11px] text-[#686052] block truncate">{studentDetails.motherName}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#DDD4C2] shadow-2xs hover:border-[#0A4D44] transition-all group">
            <span className="text-[10px] text-[#686052] uppercase font-mono font-semibold block tracking-wider">Guardian Contact &amp; DOB</span>
            <strong className="text-[#0A4D44] font-mono font-bold block mt-1 text-xs">{studentDetails.guardianPhone}</strong>
            <span className="text-[11px] font-mono text-[#686052] block truncate">DOB: {studentDetails.dob}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#DDD4C2] shadow-2xs hover:border-[#0A4D44] transition-all group">
            <span className="text-[10px] text-[#686052] uppercase font-mono font-semibold block tracking-wider">Residential Address</span>
            <strong className="text-[#1C2A27] leading-snug block mt-1 line-clamp-2 text-xs font-medium">
              {studentDetails.residentialAddress}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#DDD4C2] shadow-2xs hover:border-[#0A4D44] transition-all group">
            <span className="text-[10px] text-[#686052] uppercase font-mono font-semibold block tracking-wider">Transport &amp; Class Teacher</span>
            <strong className="text-[#1C2A27] block mt-1 truncate font-medium text-xs">{studentDetails.transportRoute}</strong>
            <span className="text-[11px] text-[#0A4D44] font-bold block truncate mt-0.5">
              CT: {classTeacher?.name || 'Ms. Sunita Rao'}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          ROW 2: 2x2 SQUARE BENTO QUICK-ACTION GRID ON MOBILE & 4-COL ON DESKTOP
          (1. Attendance | 2. Daily Timetable | 3. Exam Schedule | 4. Tuition Fee)
         ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {/* BENTO SQUARE 1: TOTAL ATTENDANCE */}
        <button
          type="button"
          onClick={() => {
            playUISound('click');
            setActiveKpiDrawer('attendance');
          }}
          className="group text-left bg-[#FFFDF9] hover:bg-[#F7F3EB] active:scale-[0.99] border border-[#DDD4C2] hover:border-[#0A4D44] rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between aspect-[1.18/1] sm:aspect-auto min-h-[135px] sm:min-h-[145px] shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-1 w-full">
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2A27] truncate">
              Attendance
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#EFF5F3] border border-[#DDD4C2] text-[10px] font-mono font-bold text-[#0A4D44] shrink-0">
              {currentStudent.presentDays}/{currentStudent.totalDays}d
            </span>
          </div>

          <div className="my-1.5 w-full">
            <div className="flex items-baseline gap-1.5 font-mono">
              <strong className="text-2xl sm:text-3xl font-black text-[#0A4D44] tabular-nums leading-none">
                {attendancePct}%
              </strong>
              <span className="text-[11px] text-[#686052] tabular-nums">
                ({absentDays} Abs)
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#686052] block mt-1 truncate">
              85% Target Calculator
            </span>
            <div className="h-1.5 w-full rounded-full bg-[#EAE2D3] mt-2 overflow-hidden">
              <div
                className="h-full bg-[#0A4D44] rounded-full transition-all duration-500"
                style={{ width: `${attendancePct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EAE2D3] text-[11px] font-bold text-[#0A4D44] w-full">
            <span className="truncate">Open Attendance</span>
            <span className="group-hover:translate-x-1 transition-transform shrink-0">→</span>
          </div>
        </button>

        {/* BENTO SQUARE 2: DAILY CLASS TIMETABLE */}
        <button
          type="button"
          onClick={() => {
            playUISound('click');
            setActiveKpiDrawer('timetable');
          }}
          className="group text-left bg-[#FFFDF9] hover:bg-[#F7F3EB] active:scale-[0.99] border border-[#DDD4C2] hover:border-[#0A4D44] rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between aspect-[1.18/1] sm:aspect-auto min-h-[135px] sm:min-h-[145px] shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-1 w-full">
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2A27] truncate">
              Timetable
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#EFF5F3] border border-[#DDD4C2] text-[10px] font-mono font-bold text-[#0A4D44] shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A4D44]" /> LIVE
            </span>
          </div>

          <div className="my-1.5 min-w-0 w-full">
            <strong className="text-xs sm:text-sm font-extrabold text-[#1C2A27] truncate block">
              {liveOrNextPeriod?.subject || 'Mathematics'}
            </strong>
            <span className="text-[10px] font-mono text-[#686052] truncate block mt-0.5">
              {liveOrNextPeriod?.period || 'Period 2'} · {liveOrNextPeriod?.roomNo || 'Room 204'}
            </span>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#F5F0E6] text-[10px] font-mono font-semibold text-[#1C2A27] truncate max-w-full">
              {liveOrNextPeriod?.teacher || 'Dr. Vikramaditya Sen'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EAE2D3] text-[11px] font-bold text-[#0A4D44] w-full">
            <span className="truncate">6 Periods Today</span>
            <span className="group-hover:translate-x-1 transition-transform shrink-0">→</span>
          </div>
        </button>

        {/* BENTO SQUARE 3: UPCOMING EXAM SCHEDULE */}
        <button
          type="button"
          onClick={() => {
            playUISound('click');
            setActiveKpiDrawer('exams');
          }}
          className="group text-left bg-[#FFFDF9] hover:bg-[#F7F3EB] active:scale-[0.99] border border-[#DDD4C2] hover:border-[#9A6B26] rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between aspect-[1.18/1] sm:aspect-auto min-h-[135px] sm:min-h-[145px] shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-1 w-full">
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2A27] truncate">
              Exam Schedule
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#FFF9ED] border border-[#DDD4C2] text-[10px] font-mono font-bold text-[#9A6B26] shrink-0">
              24 Oct
            </span>
          </div>

          <div className="my-1.5 min-w-0 w-full">
            <strong className="text-xs sm:text-sm font-extrabold text-[#1C2A27] truncate block">
              Science (Phy &amp; Chem)
            </strong>
            <span className="text-[10px] font-mono text-[#686052] truncate block mt-0.5">
              09:00 AM · Hall 204
            </span>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#FFF9ED] text-[10px] font-mono font-semibold text-[#9A6B26]">
              Unit Assessment IV
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EAE2D3] text-[11px] font-bold text-[#9A6B26] w-full">
            <span className="truncate">View Date Sheet</span>
            <span className="group-hover:translate-x-1 transition-transform shrink-0">→</span>
          </div>
        </button>

        {/* BENTO SQUARE 4: SCHOOL TUITION FEE */}
        <button
          type="button"
          onClick={() => {
            playUISound('click');
            setActiveKpiDrawer('fee');
          }}
          className="group text-left bg-[#FFFDF9] hover:bg-[#F7F3EB] active:scale-[0.99] border border-[#DDD4C2] hover:border-[#0A4D44] rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between aspect-[1.18/1] sm:aspect-auto min-h-[135px] sm:min-h-[145px] shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-1 w-full">
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2A27] truncate">
              Tuition Fee
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                currentStudent.dueFee > 0
                  ? 'bg-[#FAF2F2] text-[#8B2626] border border-[#DDD4C2]'
                  : 'bg-[#EFF5F3] text-[#0A4D44] border border-[#DDD4C2]'
              }`}
            >
              {currentStudent.dueFee > 0
                ? `Due ₹${(currentStudent.dueFee / 1000).toFixed(0)}k`
                : 'Paid ✓'}
            </span>
          </div>

          <div className="my-1.5 w-full">
            <div className="flex items-baseline gap-1.5 font-mono">
              <strong className="text-2xl sm:text-3xl font-black text-[#1C2A27] tabular-nums leading-none">
                ₹{currentStudent.paidFee.toLocaleString()}
              </strong>
            </div>
            <span className="text-[10px] font-mono text-[#686052] block mt-1 tabular-nums truncate">
              of ₹{currentStudent.totalFee.toLocaleString()} ({feePaidPct}% Paid)
            </span>
            <div className="h-1.5 w-full rounded-full bg-[#EAE2D3] mt-2 overflow-hidden">
              <div
                className="h-full bg-[#0A4D44] rounded-full transition-all duration-500"
                style={{ width: `${feePaidPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EAE2D3] text-[11px] font-bold text-[#0A4D44] w-full">
            <span className="truncate">Pay / Receipts</span>
            <span className="group-hover:translate-x-1 transition-transform shrink-0">→</span>
          </div>
        </button>
      </div>

      {/* =====================================================================
          ROW 3: HIGH-DENSITY 2-COLUMN SPLIT WORKSPACE (SCHEDULE, SIBLINGS & FACULTY DESK)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* LEFT 7 COLUMNS: TODAY'S SCHEDULE, ATTENDANCE PROGRESSION & SIBLINGS */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Siblings Studying in School */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0A4D44]"></span>
                  <span className="text-xs font-bold text-[#1C2A27] tracking-tight">
                    Brother / Sister Studying in School ({siblings.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddSibling(prev => !prev)}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#EFF5F3] text-[#0A4D44] hover:bg-[#F7F3EB] border border-[#DDD4C2] transition-colors cursor-pointer"
                >
                  {showAddSibling ? 'Cancel ×' : '+ Link Sibling'}
                </button>
              </div>

              {showAddSibling && (
                <form
                  onSubmit={handleAddSibling}
                  className="p-3 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] grid grid-cols-2 sm:grid-cols-5 gap-2"
                >
                  <input
                    type="text"
                    required
                    placeholder="Sibling Full Name"
                    value={newSiblingName}
                    onChange={e => setNewSiblingName(e.target.value)}
                    className="col-span-2 px-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg text-[#1C2A27] placeholder:text-[#686052] focus:outline-none focus:ring-1 focus:ring-[#0A4D44]"
                  />
                  <select
                    value={newSiblingRelation}
                    onChange={e => setNewSiblingRelation(e.target.value as 'Brother' | 'Sister')}
                    className="px-2.5 py-1.5 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg text-[#1C2A27] focus:outline-none focus:ring-1 focus:ring-[#0A4D44]"
                  >
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                  </select>
                  <select
                    value={newSiblingGrade}
                    onChange={e => setNewSiblingGrade(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg text-[#1C2A27] focus:outline-none focus:ring-1 focus:ring-[#0A4D44]"
                  >
                    {['4-B', '5-A', '6-A', '7-A', '8-B', '9-A', '10-B', '11-A', '12-A'].map(g => (
                      <option key={g} value={g}>Class {g}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="col-span-2 sm:col-span-1 px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              )}

              {/* Mobile Compact Bento Sibling Cards (< sm) */}
              <div className="grid grid-cols-1 gap-2 sm:hidden">
                {siblings.map(sib => (
                  <div
                    key={sib.id}
                    className="p-3 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-bold text-[#1C2A27] truncate">{sib.name}</strong>
                        <span className="font-mono text-[10px] text-[#686052]">#{sib.id}</span>
                      </div>
                      <span className="text-[11px] text-[#686052] block mt-0.5">
                        {sib.relation} · Class {sib.gradeSection} (Roll #{sib.rollNo})
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EFF5F3] text-[#0A4D44] border border-[#DDD4C2] font-mono text-[10px] font-bold block">
                        {sib.feeConcession}
                      </span>
                      <span className="text-[10px] font-mono text-[#686052] block mt-0.5">
                        {sib.busRoute}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet & Desktop Table (>= sm) */}
              <div className="hidden sm:block border border-[#DDD4C2] rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F0E6] text-[10px] uppercase text-[#686052] font-mono tracking-wider border-b border-[#DDD4C2]">
                    <tr>
                      <th className="py-2.5 px-3.5">Sibling Name &amp; ID</th>
                      <th className="py-2.5 px-3.5">Relation &amp; Class</th>
                      <th className="py-2.5 px-3.5">Bus Route</th>
                      <th className="py-2.5 px-3.5 text-right">Fee Rebate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2D3] bg-[#FFFDF9]">
                    {siblings.map(sib => (
                      <tr key={sib.id} className="hover:bg-[#F5F0E6] transition-colors">
                        <td className="py-2.5 px-3.5 font-bold text-[#1C2A27]">
                          {sib.name} <span className="font-mono text-[11px] font-normal text-[#686052]">(#{sib.id})</span>
                        </td>
                        <td className="py-2.5 px-3.5 text-[#686052] font-medium">
                          {sib.relation} · Class {sib.gradeSection} <span className="text-[#686052] font-mono text-[11px]">(Roll #{sib.rollNo})</span>
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#686052]">{sib.busRoute}</td>
                        <td className="py-2.5 px-3.5 text-right font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded-full bg-[#EFF5F3] text-[#0A4D44] border border-[#DDD4C2] font-bold inline-block">
                            {sib.feeConcession}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Card 2: Compact Today's Schedule & Monthly Attendance Bar Summary */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1C2A27] tracking-tight">
                  Today&apos;s Important Classes &amp; Attendance Progression
                </h3>
                <p className="text-[11px] text-[#686052]">
                  Section {currentStudent.grade} live schedule &amp; month-by-month consistency
                </p>
              </div>
              <button
                type="button"
                onClick={onPrintTimetable}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F0E6] hover:bg-[#F7F3EB] border border-[#DDD4C2] text-[#1C2A27] text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <span>🖨️</span> Print PDF
              </button>
            </div>

            {/* Compact 6-Period Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {studentPeriods.slice(0, 6).map(per => {
                const isLive = per.status === 'Ongoing';
                return (
                  <div
                    key={per.id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isLive
                        ? 'bg-[#EFF5F3] border-[#0A4D44] shadow-xs'
                        : 'bg-[#F7F3EB] hover:bg-[#F5F0E6] border-[#DDD4C2]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#686052] mb-1">
                      <span className="font-semibold">{per.period} · {per.time.split(' - ')[0]}</span>
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#0A4D44] text-white font-bold text-[9px] uppercase tracking-wider">
                          LIVE
                        </span>
                      ) : (
                        <span className="text-[#686052]">{per.roomNo}</span>
                      )}
                    </div>
                    <strong className="text-[#1C2A27] block truncate font-bold">{per.subject}</strong>
                    <span className="text-[11px] text-[#686052] truncate block mt-0.5">{per.teacher}</span>
                  </div>
                );
              })}
            </div>

            {/* Clean 5-Month Horizontal Attendance Strip */}
            <div className="pt-2 border-t border-[#EAE2D3]">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="font-bold text-[#1C2A27]">Session Attendance Progression (May – Oct)</span>
                <button
                  type="button"
                  onClick={() => setActiveKpiDrawer('attendance')}
                  className="text-[#0A4D44] hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
                >
                  Open Calculator <span>→</span>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {MONTHLY_ATTENDANCE_BREAKDOWN.map(item => (
                  <div key={item.month} className="p-2 sm:p-2.5 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] text-center">
                    <span className="text-[10px] font-bold text-[#686052] block uppercase tracking-wider">{item.month.split(' ')[0]}</span>
                    <strong className="text-xs font-mono font-black text-[#1C2A27] tabular-nums block my-0.5">{item.pct}%</strong>
                    <div className="h-1.5 rounded-full bg-[#EAE2D3] mt-1 overflow-hidden">
                      <div className="h-full bg-[#0A4D44] rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: UNIFIED TEACHER, MENTOR & PRINCIPAL APPOINTMENT DESK */}
        <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#DDD4C2] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="border-b border-[#EAE2D3] pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#0A4D44] font-bold block mb-0.5">
              Direct Teacher &amp; Leadership Access
            </span>
            <h3 className="text-sm font-bold text-[#1C2A27] tracking-tight">
              Class Teacher, Personal Mentor &amp; Principal Desk
            </h3>
          </div>

          {/* 3-Tab Segmented Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-[#F5F0E6] p-1 rounded-xl border border-[#DDD4C2]">
            {[
              { id: 'teacher' as const, label: 'Class Teacher' },
              { id: 'mentor' as const, label: 'Personal Mentor' },
              { id: 'principal' as const, label: 'Principal Slot' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playUISound('click');
                  setFacultyDeskTab(tab.id);
                }}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  facultyDeskTab === tab.id
                    ? 'bg-[#0A4D44] text-white shadow-xs'
                    : 'text-[#686052] hover:text-[#1C2A27]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: CLASS TEACHER & CLASS INCHARGE */}
          {facultyDeskTab === 'teacher' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar id={classTeacher?.id || '900102'} name={classTeacher?.name || 'Ms. Sunita Rao'} size="w-9 h-9" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#0A4D44] font-bold block">
                        Class Teacher ({currentStudent.grade})
                      </span>
                      <strong className="text-xs text-[#1C2A27] font-bold">{classTeacher?.name}</strong>
                      <span className="text-[11px] font-mono text-[#686052] block">
                        ID #{classTeacher?.id} · {classTeacher?.subject}
                      </span>
                    </div>
                  </div>
                  <a
                    href="tel:+919811452090"
                    className="text-xs font-mono font-bold text-[#0A4D44] bg-[#EFF5F3] hover:bg-[#F7F3EB] px-2.5 py-1 rounded-lg border border-[#DDD4C2] transition"
                  >
                    +91 98114-52090
                  </a>
                </div>
                <div className="pt-2 border-t border-[#EAE2D3] flex items-center justify-between text-[11px] text-[#686052]">
                  <span>Class Incharge: <strong className="text-[#1C2A27]">{classIncharge?.name}</strong> (#{classIncharge?.id})</span>
                  <span className="font-mono text-[#686052]">+91 98118-77340</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1C2A27]">Book Class Teacher Appointment</label>
                <select
                  value={teacherSlot}
                  onChange={e => setTeacherSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl text-[#1C2A27] transition"
                >
                  <option>Tomorrow • 01:40 PM (Recess Cabin)</option>
                  <option>Thursday • 02:30 PM (Post-School PTM)</option>
                  <option>Saturday • 10:00 AM (Parent-Teacher Slot)</option>
                </select>
                <select
                  value={teacherAgenda}
                  onChange={e => setTeacherAgenda(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl text-[#1C2A27] transition"
                >
                  <option>Academic Progress &amp; Unit Test Review</option>
                  <option>Attendance &amp; Medical Leave Verification</option>
                  <option>Subject Doubt &amp; Seating Request</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleBookSlot('Class Teacher')}
                  className="w-full py-2.5 rounded-xl bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-bold shadow-xs active:scale-[0.99] transition cursor-pointer"
                >
                  Confirm Class Teacher Appointment
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL MENTOR */}
          {facultyDeskTab === 'mentor' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserAvatar id={personalMentor?.id || '900101'} name={personalMentor?.name || 'Dr. Vikramaditya Sen'} size="w-9 h-9" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#9A6B26] font-bold block">
                      Assigned Personal Mentor
                    </span>
                    <strong className="text-xs text-[#1C2A27] font-bold">{personalMentor?.name}</strong>
                    <span className="text-[11px] font-mono text-[#686052] block">
                      ID #{personalMentor?.id} · {personalMentor?.subject}
                    </span>
                  </div>
                </div>
                <a
                  href="tel:+919811964210"
                  className="text-xs font-mono font-bold text-[#0A4D44] bg-[#EFF5F3] hover:bg-[#F7F3EB] px-2.5 py-1 rounded-lg border border-[#DDD4C2] transition"
                >
                  +91 98119-64210
                </a>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1C2A27]">Schedule 1-on-1 Mentorship Session</label>
                <select
                  value={mentorFocus}
                  onChange={e => setMentorFocus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl text-[#1C2A27] transition"
                >
                  <option>Olympiad &amp; Board Exam Strategy</option>
                  <option>NCERT Formula &amp; Numerical Speed Coaching</option>
                  <option>Stream Selection &amp; Career Guidance</option>
                </select>
                <select
                  value={mentorSlot}
                  onChange={e => setMentorSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl text-[#1C2A27] transition"
                >
                  <option>Friday • 02:15 PM (1-on-1 Cabin)</option>
                  <option>Monday • 01:40 PM (STEM Lab Desk)</option>
                  <option>Wednesday • 02:30 PM (Library Mentorship Pod)</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleBookSlot('Personal Mentor')}
                  className="w-full py-2.5 rounded-xl bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-bold shadow-xs active:scale-[0.99] transition cursor-pointer"
                >
                  Book Personal Mentor Session
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PRINCIPAL OFFICE SLOT */}
          {facultyDeskTab === 'principal' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserAvatar id="100001" name="Dr. S. Radhakrishnan" size="w-9 h-9" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#0A4D44] font-bold block">
                      Principal &amp; Directorate Office
                    </span>
                    <strong className="text-xs text-[#1C2A27] font-bold">Dr. S. Radhakrishnan</strong>
                    <span className="text-[11px] font-mono text-[#686052] block">
                      ID #100001 · Admin Block Wing A
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#9A6B26] bg-[#FFF9ED] px-2.5 py-1 rounded-lg border border-[#DDD4C2]">
                  10:30–11:30 AM
                </span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1C2A27]">Reserve Principal Office Slot</label>
                <select
                  value={principalSlot}
                  onChange={e => setPrincipalSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl text-[#1C2A27] transition"
                >
                  <option>Tomorrow • 10:30 AM – 10:45 AM</option>
                  <option>Tomorrow • 11:00 AM – 11:15 AM</option>
                  <option>Friday • 02:30 PM – 02:45 PM</option>
                </select>
                <select
                  value={principalPurpose}
                  onChange={e => setPrincipalPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl text-[#1C2A27] transition"
                >
                  <option>Scholarship &amp; Sibling Fee Concession</option>
                  <option>Inter-School Olympiad / Sports Representation</option>
                  <option>Academic Guidance &amp; Lor Request</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleBookSlot('Principal')}
                  className="w-full py-2.5 rounded-xl bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-bold shadow-xs active:scale-[0.99] transition cursor-pointer"
                >
                  Reserve Principal Office Pass
                </button>
              </div>
            </div>
          )}

          {/* Confirmed Appointments List */}
          <div className="pt-2 border-t border-[#EAE2D3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#686052] uppercase tracking-wider block">
                Booked Consultations ({appointments.length})
              </span>
              <span className="text-[10px] font-mono text-[#0A4D44] bg-[#EFF5F3] px-2 py-0.5 rounded-full font-bold border border-[#DDD4C2]">
                Active
              </span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {appointments.map(apt => (
                <div
                  key={apt.id}
                  className="p-2.5 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-[#0A4D44] block truncate">
                      {apt.targetRole}: {apt.topic}
                    </span>
                    <span className="text-[11px] font-mono text-[#686052] block truncate">
                      {apt.slotTime} · {apt.facultyName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#0A4D44] bg-[#EFF5F3] px-2 py-0.5 rounded-md shrink-0 border border-[#DDD4C2]">
                    {apt.status} ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
