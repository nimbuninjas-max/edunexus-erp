import React, { useState, useMemo } from 'react';
import {
  CalendarEvent,
  CampusStaffMember,
  DisciplineCase,
  HomeworkTask,
  LeaveApplication,
  ParentNotificationLog,
  RankedStudent,
  RoleType,
  Student,
  StudentAcademicSummary,
  StudyGroup,
  Teacher,
  TeacherNotice,
  TimetablePeriod,
  WhisperReport
} from '../../types/erp';
import { LeaderboardModule } from '../shared/LeaderboardModule';
import { ChatModule } from '../shared/ChatModule';
import { SchoolCalendarModule } from '../shared/SchoolCalendarModule';
import { AttendanceTrendChart } from '../shared/AttendanceTrendChart';
import { StreamlineIcon } from '../common/StreamlineIcon';
import { PrintableTimetableModal } from '../modals/PrintableTimetableModal';
import { SalaryVoucherModal } from '../modals/SalaryVoucherModal';

interface TeacherPortalProps {
  teacherTab: string;
  handleSelectNavTab?: (tabId: string) => void;
  activeTeacher: Teacher;
  selectedTeacherClass: string;
  setSelectedTeacherClass: (cls: string) => void;
  availableClasses: string[];
  timetable: TimetablePeriod[];
  handleTeacherJoinPeriod: (periodId: string, isJoining: boolean, customTopic?: string) => void;
  rankedStudents: RankedStudent[];
  students: Student[];
  teachers: Teacher[];
  campusStaff?: CampusStaffMember[];
  parentNotifications?: ParentNotificationLog[];
  onSendParentNotification?: (studentId: string, senderLabel: string, customMessage?: string) => void;
  handleMarkAttendance: (studentId: string, statusType: string) => void;
  handleMarkAllClassPresent: () => void;
  getStudentAcademicSummary: (studentId: string) => StudentAcademicSummary;
  handleUpdateStudentSubjectMark: (studentId: string, subjectIdx: number, field: string, value: string | number) => void;
  discStudentId: string;
  setDiscStudentId: (id: string) => void;
  disciplineCases: DisciplineCase[];
  setDisciplineCases: React.Dispatch<React.SetStateAction<DisciplineCase[]>>;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  setTeacherNotices: React.Dispatch<React.SetStateAction<TeacherNotice[]>>;
  setTasks: React.Dispatch<React.SetStateAction<HomeworkTask[]>>;
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  whispers: WhisperReport[];
  setWhispers: React.Dispatch<React.SetStateAction<WhisperReport[]>>;
  leaveApplications: LeaveApplication[];
  setLeaveApplications: React.Dispatch<React.SetStateAction<LeaveApplication[]>>;
  groups: StudyGroup[];
  setGroups: React.Dispatch<React.SetStateAction<StudyGroup[]>>;
  activeRole: RoleType;
  currentStudent: Student;
  setPrintingStudentId: (id: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

const TEACHER_LEAVE_REASONS = [
  'Attending CBSE Regional Board Evaluation & Practical Examiner Duty',
  'Medical consultation and prescribed rest',
  'Urgent personal & family commitment',
  'Participating in Faculty Development Workshop (NEP 2026)'
];

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  teacherTab,
  handleSelectNavTab,
  activeTeacher,
  selectedTeacherClass,
  setSelectedTeacherClass,
  availableClasses,
  timetable,
  handleTeacherJoinPeriod,
  rankedStudents,
  students,
  teachers,
  campusStaff,
  parentNotifications,
  onSendParentNotification,
  handleMarkAttendance,
  handleMarkAllClassPresent,
  getStudentAcademicSummary,
  handleUpdateStudentSubjectMark,
  discStudentId,
  setDiscStudentId,
  disciplineCases,
  setDisciplineCases,
  handleAwardBonusXP,
  setTeacherNotices,
  setTasks,
  calendarEvents,
  setCalendarEvents,
  whispers,
  setWhispers,
  leaveApplications,
  setLeaveApplications,
  groups,
  setGroups,
  activeRole,
  currentStudent,
  setPrintingStudentId,
  playUISound,
  showToast
}) => {
  const [liveTopicInputs, setLiveTopicInputs] = useState<Record<string, string>>({});
  const [teacherInspectedStudentId, setTeacherInspectedStudentId] = useState('20261003');
  const [discSeverity, setDiscSeverity] = useState('Minor');
  const [discCategory, setDiscCategory] = useState('Using Mobile Phone in Class');
  const [discDescription, setDiscDescription] = useState('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue] = useState('Tomorrow, 5:00 PM');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Teacher Leave Application & Confidential Desk States
  const [facultyDeskTab, setFacultyDeskTab] = useState<'leave' | 'whisper' | 'salary'>('leave');
  const [isPrintingSalaryVoucher, setIsPrintingSalaryVoucher] = useState(false);
  const [tchLeaveType, setTchLeaveType] = useState('Casual Leave (CL)');
  const [tchFromDate, setTchFromDate] = useState('2026-10-20');
  const [tchToDate, setTchToDate] = useState('2026-10-21');
  const [tchSubstitute, setTchSubstitute] = useState('Dr. Rajeshwari Iyer (#900101)');
  const [tchLeaveReason, setTchLeaveReason] = useState('');
  const [tchProofDoc, setTchProofDoc] = useState('Faculty_Duty_Application.pdf');
  const [whisperMessage, setWhisperMessage] = useState('');
  const [whisperCategory, setWhisperCategory] = useState('Classroom Infrastructure & Smartboard');
  const [isPrintingTimetable, setIsPrintingTimetable] = useState(false);

  const currentFacultyStaffRecord = useMemo(() => {
    return (
      campusStaff?.find(s => s.id === activeTeacher.id) ||
      campusStaff?.find(s => s.name.toLowerCase().includes(activeTeacher.name.toLowerCase())) ||
      campusStaff?.find(s => s.roleCategory === 'Teacher') ||
      null
    );
  }, [campusStaff, activeTeacher]);

  const calculatedTchLeaveDays = useMemo(() => {
    const start = new Date(tchFromDate);
    const end = new Date(tchToDate);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  }, [tchFromDate, tchToDate]);

  const handleFileDisciplineCase = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStu = students.find(s => s.id === discStudentId);
    if (!targetStu) return;

    const penalty = discSeverity === 'Major' ? -250 : -100;
    const newCase: DisciplineCase = {
      id: `DSC-${Math.floor(508 + Math.random() * 400)}`,
      studentId: targetStu.id,
      studentName: targetStu.name,
      grade: targetStu.grade,
      reportedBy: activeTeacher.name,
      reportedByRegNo: activeTeacher.id,
      severity: discSeverity,
      category: discCategory,
      description: discDescription.trim() || `Student caught involved in: ${discCategory} during ${activeTeacher.subject} lecture.`,
      xpPenalty: penalty,
      date: 'Just now',
      actionTaken: discSeverity === 'Major' ? 'Escalated to Principal & Management Desk; Parents notified' : 'Logged on Student Conduct Portal; XP deducted',
      status: discSeverity === 'Major' ? 'Escalated to Management' : 'Active on Record'
    };

    setDisciplineCases(prev => [newCase, ...prev]);
    handleAwardBonusXP(targetStu.id, penalty, `${discSeverity} Indiscipline: ${discCategory}`);
    setDiscDescription('');
  };

  return (
    <>
      <PrintableTimetableModal
        isOpen={isPrintingTimetable}
        onClose={() => setIsPrintingTimetable(false)}
        portalRole="teacher"
        activeTeacher={activeTeacher}
        currentStudent={currentStudent}
        timetable={timetable}
        playUISound={playUISound}
        showToast={showToast}
      />

      {teacherTab === 'tch-classroom' && (
        <div className="space-y-5">
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                Faculty Schedule • <span className="text-[#8A5A19]">{activeTeacher.name} (Reg #{activeTeacher.id})</span>
              </p>
              <h1 className="text-lg font-semibold text-[#1C2A27] mt-0.5">
                Classroom Check-In & Syllabus Topic Broadcast Across 6 Sections
              </h1>
              <p className="text-xs text-[#686052]">
                Designation: <strong>{activeTeacher.designation}</strong> • Check into any period to broadcast the live topic.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setIsPrintingTimetable(true);
              }}
              className="px-4 py-2.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-xs font-semibold flex items-center gap-2 transition self-start sm:self-auto shrink-0"
            >
              <StreamlineIcon name="print" className="w-4 h-4" /> Print Faculty Timetable PDF
            </button>
          </div>

          <AttendanceTrendChart
            activeRole="teacher"
            currentStudent={currentStudent}
            selectedClass={selectedTeacherClass}
            playUISound={playUISound}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timetable.map(per => (
              <div
                key={per.id}
                className={`bg-[#FFFDF9] rounded-xl p-5 border space-y-3 ${
                  per.status === 'Ongoing'
                    ? per.teacherPresent ? 'border-[#0A4D44]' : 'border-[#9E2A2B]'
                    : 'border-[#DDD4C2]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-2">
                  <span className="text-xs font-semibold text-[#1C2A27]">
                    Section {per.classGrade} ({per.roomNo}) • {per.period}
                  </span>
                  <span className={`text-xs font-semibold ${
                    per.status === 'Ongoing'
                      ? per.teacherPresent ? 'text-[#0A4D44]' : 'text-[#9E2A2B]'
                      : 'text-[#686052]'
                  }`}>
                    {per.status === 'Ongoing'
                      ? per.teacherPresent ? 'Checked In (Teaching Live)' : 'Faculty Not Present'
                      : per.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1C2A27]">{per.subject}</p>
                  <p className="text-xs text-[#686052]">
                    {per.time} • Assigned: <strong className="text-[#8A5A19]">{per.teacher} (#{per.teacherRegNo})</strong>
                  </p>
                </div>
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    placeholder="Enter live syllabus topic being covered..."
                    value={liveTopicInputs[per.id] !== undefined ? liveTopicInputs[per.id] : per.liveTopic}
                    onChange={(e) => setLiveTopicInputs(prev => ({ ...prev, [per.id]: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTeacherJoinPeriod(per.id, true, liveTopicInputs[per.id])}
                      className="flex-1 py-2 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-xs font-medium transition"
                    >
                      Check In & Broadcast Topic
                    </button>
                    <button
                      onClick={() => handleTeacherJoinPeriod(per.id, false)}
                      className="px-3 py-2 rounded-lg bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#5A5346] text-xs font-medium transition"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {teacherTab === 'tch-attendance' && (
        <div className="space-y-5">
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                Daily Roll Call • Section {selectedTeacherClass}
              </p>
              <h1 className="text-lg font-semibold text-[#1C2A27] mt-0.5">
                Section {selectedTeacherClass} Attendance Register
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {availableClasses.map(cls => (
                <button
                  key={cls}
                  onClick={() => { playUISound('click'); setSelectedTeacherClass(cls); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedTeacherClass === cls
                      ? 'bg-[#0A4D44] text-white shadow-xs'
                      : 'bg-[#FFFDF9] border border-[#DDD4C2] text-[#1C2A27] hover:bg-[#F5F0E6]'
                  }`}
                >
                  Section {cls}
                </button>
              ))}
              <button
                onClick={handleMarkAllClassPresent}
                className="px-3.5 py-1.5 rounded-lg bg-[#0E6B5E] hover:bg-[#0A4D44] text-[#F5F0E6] text-xs font-medium transition"
              >
                Mark Entire Section Present
              </button>
            </div>
          </div>

          <AttendanceTrendChart
            activeRole="teacher"
            currentStudent={currentStudent}
            selectedClass={selectedTeacherClass}
            playUISound={playUISound}
          />

          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Numeric Reg No.</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-3">Today</th>
                    <th className="py-3.5 px-3">Cumulative %</th>
                    <th className="py-3.5 px-4 text-right">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D3]">
                  {rankedStudents
                    .filter(s => s.grade === selectedTeacherClass)
                    .map(stu => (
                      <tr key={stu.id} className="hover:bg-[#F5F0E6]">
                        <td className="py-3 px-4 font-mono font-semibold text-[#0A4D44]">#{stu.id}</td>
                        <td className="py-3 px-4 font-semibold text-[#1C2A27]">{stu.name} (Roll #{stu.rollNo})</td>
                        <td className="py-3 px-3">
                          <span className={`font-semibold ${stu.todayStatus === 'Present' ? 'text-[#0A4D44]' : 'text-[#9E2A2B]'}`}>
                            {stu.todayStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-[#1C2A27]">
                          {stu.attendancePct}% ({stu.presentDays}/{stu.totalDays})
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleMarkAttendance(stu.id, 'Present')}
                            className="px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] font-medium text-[11px] transition"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(stu.id, 'Absent')}
                            className="px-3 py-1.5 rounded-lg bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#8B2626] font-medium text-[11px] transition"
                          >
                            Absent
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

      {teacherTab === 'tch-marks' && (() => {
        const classStudents = students.filter(s => s.grade === selectedTeacherClass);
        const activeInspectedStu = classStudents.find(s => s.id === teacherInspectedStudentId) || classStudents[0] || students[0];
        const activeInspectedAcad = getStudentAcademicSummary(activeInspectedStu.id);

        return (
          <div className="space-y-5">
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                  One-by-One Student Gradebook Inspector • Section {selectedTeacherClass}
                </p>
                <h1 className="text-lg font-semibold text-[#1C2A27] mt-0.5">
                  Check & Edit Per-Subject Unit 1, 2, 3, Mid-Term & End-Term Marks
                </h1>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableClasses.map(cls => (
                  <button
                    key={cls}
                    onClick={() => {
                      playUISound('click');
                      setSelectedTeacherClass(cls);
                      const firstInCls = students.find(s => s.grade === cls);
                      if (firstInCls) setTeacherInspectedStudentId(firstInCls.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedTeacherClass === cls
                        ? 'bg-[#0A4D44] text-white shadow-xs'
                        : 'bg-[#FFFDF9] border border-[#DDD4C2] text-[#1C2A27] hover:bg-[#F5F0E6]'
                    }`}
                  >
                    Section {cls}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#DDD4C2] rounded-xl p-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#5A5346]">Inspecting Student:</span>
              {classStudents.map((stu) => (
                <button
                  key={stu.id}
                  onClick={() => { playUISound('click'); setTeacherInspectedStudentId(stu.id); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeInspectedStu.id === stu.id
                      ? 'bg-[#0A4D44] text-white font-semibold'
                      : 'bg-[#FFFDF9] border border-[#DDD4C2] text-[#1C2A27] hover:bg-[#F5F0E6]'
                  }`}
                >
                  {stu.name} (#{stu.id})
                </button>
              ))}
            </div>

            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#EAE2D3] flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#1C2A27]">
                  Editing Gradebook for {activeInspectedStu.name} (Reg #{activeInspectedStu.id} • Roll #{activeInspectedStu.rollNo})
                </h3>
                <span className="text-xs font-mono font-semibold text-[#0A4D44]">
                  Grand Total: {activeInspectedAcad.grandTotalObtained}/{activeInspectedAcad.grandTotalMaxMarks} ({activeInspectedAcad.rawGrandPct}%)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Subject</th>
                      <th className="py-3.5 px-2 text-center">Unit 1 (100)</th>
                      <th className="py-3.5 px-2 text-center">Unit 2 (100)</th>
                      <th className="py-3.5 px-2 text-center">Unit 3 (100)</th>
                      <th className="py-3.5 px-3 text-center bg-[#124E45]">Unit Total (/300) & %</th>
                      <th className="py-3.5 px-2 text-center">Mid-Term (100)</th>
                      <th className="py-3.5 px-2 text-center">End-Term (100)</th>
                      <th className="py-3.5 px-3 text-right bg-[#124E45]">Subject Total (/500) & %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2D3]">
                    {activeInspectedAcad.subjectsList.map((sub, sIdx) => (
                      <tr key={sIdx} className="hover:bg-[#F5F0E6]">
                        <td className="py-3 px-4 font-semibold text-[#1C2A27] whitespace-nowrap">{sub.name}</td>
                        {(['u1', 'u2', 'u3'] as const).map(field => (
                          <td key={field} className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sub[field]}
                              onChange={(e) => handleUpdateStudentSubjectMark(activeInspectedStu.id, sIdx, field, e.target.value)}
                              className="w-14 px-1.5 py-1 text-center font-mono font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
                            />
                          </td>
                        ))}
                        <td className="py-3 px-3 text-center font-mono font-semibold text-[#0A4D44] bg-[#EFF5F3] whitespace-nowrap">
                          {sub.unitTotalObtained}/300 ({sub.unitPct}%)
                        </td>
                        {(['mid', 'final'] as const).map(field => (
                          <td key={field} className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sub[field]}
                              onChange={(e) => handleUpdateStudentSubjectMark(activeInspectedStu.id, sIdx, field, e.target.value)}
                              className="w-14 px-1.5 py-1 text-center font-mono font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
                            />
                          </td>
                        ))}
                        <td className="py-3 px-3 text-right font-mono font-semibold text-[#0A3630] bg-[#EFE9DC]">
                          {sub.rawSubjectTotalObtained}/500 ({sub.rawSubjectPct}%)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {teacherTab === 'tch-discipline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <form
            onSubmit={handleFileDisciplineCase}
            className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4 h-fit"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#8B2626]">
                Classroom Conduct Report • Faculty Reg #{activeTeacher.id}
              </p>
              <h2 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                Log Behavioral Observation
              </h2>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5346] mb-1">Select Student (Numeric Reg No.)</label>
              <select
                value={discStudentId}
                onChange={(e) => setDiscStudentId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (Reg #{s.id} • {s.grade})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5346] mb-1">Incident Severity</label>
              <div className="grid grid-cols-2 gap-2">
                {['Minor', 'Major'].map(sev => (
                  <button
                    type="button"
                    key={sev}
                    onClick={() => { playUISound('click'); setDiscSeverity(sev); }}
                    className={`py-2 rounded-lg text-xs font-medium border ${
                      discSeverity === sev
                        ? sev === 'Major' ? 'bg-[#8B2626] text-white border-[#8B2626]' : 'bg-[#0A4D44] text-[#F5F0E6] border-[#0A4D44]'
                        : 'bg-[#F5F0E6] text-[#5A5346] border-[#D5CBB8]'
                    }`}
                  >
                    {sev} ({sev === 'Major' ? '-250 pts' : '-100 pts'})
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5346] mb-1">Category</label>
              <select
                value={discCategory}
                onChange={(e) => setDiscCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              >
                <option>Using Mobile Phone in Class</option>
                <option>Watching Movies / Non-Academic Screen</option>
                <option>Late Arrival After Recess & Uniform Violation</option>
                <option>Lab Equipment Mishandling & Safety Breach</option>
                <option>Disturbing Classroom / Talking Loudly</option>
                <option>Bullying / Peer Conflict</option>
              </select>
            </div>
            <textarea
              rows={3}
              placeholder="Enter objective observation details..."
              value={discDescription}
              onChange={(e) => setDiscDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
            />
            <button type="submit" className="w-full py-2.5 bg-[#8B2626] hover:bg-[#6E1D1D] text-white font-medium text-xs rounded-lg transition">
              Record Conduct Incident
            </button>
          </form>

          <div className="lg:col-span-2 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-3.5">
            <h3 className="text-sm font-semibold text-[#1C2A27]">Logged Conduct Chronicle ({disciplineCases.length} Total Cases)</h3>
            <div className="space-y-3">
              {disciplineCases.map(c => (
                <div key={c.id} className="p-4 rounded-lg border border-[#EAE2D3] bg-[#F9F6F0] space-y-1.5">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="text-xs font-semibold text-[#1C2A27]">
                      {c.studentName} <span className="font-mono text-[#0E6B5E]">(Reg #{c.studentId} • {c.grade})</span>
                    </span>
                    <span className={`text-xs font-semibold ${c.severity === 'Major' ? 'text-[#8B2626]' : 'text-[#9A6B26]'}`}>
                      {c.severity} • {c.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A443B]">"{c.description}"</p>
                  <p className="text-[11px] text-[#686052]">
                    Logged by <strong className="text-[#8A5A19]">{c.reportedBy} (Reg #{c.reportedByRegNo})</strong> • Status: {c.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {teacherTab === 'tch-notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!noticeTitle.trim() || !noticeMessage.trim()) return;
              const created: TeacherNotice = {
                id: `NTC-${Date.now()}`,
                title: noticeTitle.trim(),
                targetClass: selectedTeacherClass,
                subject: activeTeacher.subject,
                teacherName: activeTeacher.name,
                teacherRegNo: activeTeacher.id,
                roleLabel: activeTeacher.classTeacherOf === selectedTeacherClass ? `Class Teacher (${selectedTeacherClass})` : 'Subject Faculty',
                time: 'Just now',
                message: noticeMessage.trim()
              };
              setTeacherNotices(prev => [created, ...prev]);
              setNoticeTitle('');
              setNoticeMessage('');
              showToast('Class Notice Published', `Shared by ${activeTeacher.name} (#${activeTeacher.id}) to Section ${selectedTeacherClass}.`, 'success');
            }}
            className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4"
          >
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0E6B5E]">
                Author: {activeTeacher.name} (Reg #{activeTeacher.id})
              </span>
              <h3 className="text-sm font-semibold text-[#1C2A27] mt-0.5">
                Post Class Teacher / Subject Notice — Section {selectedTeacherClass}
              </h3>
            </div>
            <input
              type="text"
              required
              placeholder="Notice subject line..."
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
            />
            <textarea
              rows={3}
              required
              placeholder="Write instructions for students..."
              value={noticeMessage}
              onChange={(e) => setNoticeMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
            />
            <button type="submit" className="w-full py-2.5 bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-xs font-medium rounded-lg transition">
              Publish Class Notice to Section {selectedTeacherClass}
            </button>
          </form>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTaskTitle.trim()) return;
              const created: HomeworkTask = {
                id: `TSK-${Date.now()}`,
                title: newTaskTitle.trim(),
                subject: activeTeacher.subject,
                targetClass: selectedTeacherClass,
                assignedBy: `${activeTeacher.name} (#${activeTeacher.id})`,
                dueDate: newTaskDue,
                xpReward: 150,
                completedBy: [],
                description: newTaskDesc.trim() || 'Complete the assigned exercise in your fair notebook.'
              };
              setTasks(prev => [created, ...prev]);
              setNewTaskTitle('');
              setNewTaskDesc('');
              showToast('Coursework Assigned', `Published to Section ${selectedTeacherClass}.`, 'success');
            }}
            className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4"
          >
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0E6B5E]">
                Author: {activeTeacher.name} (Reg #{activeTeacher.id})
              </span>
              <h3 className="text-sm font-semibold text-[#1C2A27] mt-0.5">
                Assign Coursework — Section {selectedTeacherClass}
              </h3>
            </div>
            <input
              type="text"
              required
              placeholder="Assignment title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
            />
            <textarea
              rows={3}
              placeholder="Exercise instructions..."
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
            />
            <button type="submit" className="w-full py-2.5 bg-[#0E6B5E] hover:bg-[#0A4D44] text-[#F5F0E6] text-xs font-medium rounded-lg transition">
              Assign Coursework (+150 pts)
            </button>
          </form>
        </div>
      )}

      {teacherTab === 'tch-calendar' && (
        <SchoolCalendarModule
          calendarEvents={calendarEvents}
          setCalendarEvents={setCalendarEvents}
          currentUserRegNo={activeTeacher.id}
          currentUserName={activeTeacher.name}
          activeRole={activeRole}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}

      {teacherTab === 'tch-leaderboard' && (
        <LeaderboardModule
          activeRole={activeRole}
          rankedStudents={rankedStudents}
          currentStudent={currentStudent}
          availableClasses={availableClasses}
          setPrintingStudentId={setPrintingStudentId}
          playUISound={playUISound}
        />
      )}

      {teacherTab === 'tch-chat' && (
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

      {/* TEACHER TAB 9: FACULTY LEAVE APPLICATION WITH REASON & SUBSTITUTE + CONFIDENTIAL DESK */}
      {teacherTab === 'tch-whisper' && (
        <div className="space-y-6">
          <div className="bg-[#0A3630] text-[#F5F0E6] border border-[#14463F] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9CC5BE]">
                Faculty Leave & Directorate Escalation Desk • {activeTeacher.name} (Reg #{activeTeacher.id})
              </p>
              <h1 className="text-xl font-semibold text-white mt-0.5">
                Faculty Leave Application & Confidential Directorate Channel
              </h1>
              <p className="text-xs text-[#B5CFCB] mt-0.5">
                Apply for Casual, Medical, or Academic Duty leave with substitute teacher arrangement, or file confidential feedback.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#072E29] p-1.5 rounded-xl border border-[#19574E] shrink-0">
              <button
                type="button"
                onClick={() => { playUISound('click'); setFacultyDeskTab('leave'); }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  facultyDeskTab === 'leave'
                    ? 'bg-[#0E6B5E] text-white shadow-xs border border-emerald-400'
                    : 'text-[#B5CFCB] hover:text-white'
                }`}
              >
                1. Faculty Leave Application
              </button>
              <button
                type="button"
                onClick={() => { playUISound('click'); setFacultyDeskTab('whisper'); }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  facultyDeskTab === 'whisper'
                    ? 'bg-[#0E6B5E] text-white shadow-xs border border-emerald-400'
                    : 'text-[#B5CFCB] hover:text-white'
                }`}
              >
                2. Confidential Staff Desk
              </button>
              <button
                type="button"
                onClick={() => { playUISound('click'); setFacultyDeskTab('salary'); }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  facultyDeskTab === 'salary'
                    ? 'bg-[#0E6B5E] text-white shadow-xs border border-emerald-400'
                    : 'text-[#B5CFCB] hover:text-white'
                }`}
              >
                3. Salary Slip & Compensation
              </button>
            </div>
          </div>

          {facultyDeskTab === 'leave' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newLeave: LeaveApplication = {
                    id: `LVE-${Math.floor(9020 + Math.random() * 800)}`,
                    applicantRole: 'teacher',
                    applicantId: activeTeacher.id,
                    applicantName: activeTeacher.name,
                    gradeOrDept: `${activeTeacher.subject} (${activeTeacher.designation})`,
                    leaveType: tchLeaveType,
                    fromDate: tchFromDate,
                    toDate: tchToDate,
                    totalDays: calculatedTchLeaveDays,
                    reason: tchLeaveReason.trim() || `${tchLeaveType} requested from ${tchFromDate} to ${tchToDate}.`,
                    proofDocument: tchProofDoc,
                    substituteTeacher: tchSubstitute,
                    status: 'Approved',
                    appliedAt: 'Just now',
                    reviewedBy: 'Dr. S. Radhakrishnan (#100001 • Principal Directorate)'
                  };
                  setLeaveApplications(prev => [newLeave, ...prev]);
                  setTchLeaveReason('');
                  playUISound('success');
                  showToast(
                    'Faculty Leave Approved',
                    `${calculatedTchLeaveDays}-day ${tchLeaveType} sanctioned with substitute ${tchSubstitute}.`,
                    'success'
                  );
                }}
                className="lg:col-span-7 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 sm:p-6 space-y-4"
              >
                <div className="border-b border-[#EAE2D3] pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                      Faculty Leave Requisition • Balance: 11 CL / 10 ML Available
                    </span>
                    <h2 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                      Apply for Faculty Leave with Reason & Substitute Arrangement
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-[#EFF5F3] border border-[#9CC5BE] text-xs font-mono font-bold text-[#0A4D44]">
                    {calculatedTchLeaveDays} Day(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Casual Leave (CL)',
                    'Medical Leave (ML)',
                    'Academic / Board Duty',
                    'Half-Day Leave'
                  ].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { playUISound('click'); setTchLeaveType(type); }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                        tchLeaveType === type
                          ? 'bg-[#0A4D44] text-white border-[#0A4D44]'
                          : 'bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#1C2A27] border-[#DDD4C2]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">From Date</label>
                    <input
                      type="date"
                      value={tchFromDate}
                      onChange={(e) => setTchFromDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">To Date</label>
                    <input
                      type="date"
                      value={tchToDate}
                      min={tchFromDate}
                      onChange={(e) => setTchToDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Substitute Faculty</label>
                    <select
                      value={tchSubstitute}
                      onChange={(e) => setTchSubstitute(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    >
                      {teachers
                        .filter(t => t.id !== activeTeacher.id)
                        .map(t => (
                          <option key={t.id} value={`${t.name} (#${t.id})`}>
                            {t.name} (#{t.id})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#1C2A27]">
                    Select Quick Reason or Enter Custom Leave Reason
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TEACHER_LEAVE_REASONS.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => { playUISound('click'); setTchLeaveReason(preset); }}
                        className="px-2.5 py-1 rounded-lg bg-[#FFFDF9] hover:bg-[#F5F0E6] border border-[#DDD4C2] text-[11px] text-[#4A443B]"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Specify reason for leave and lecture handover notes for substitute teacher..."
                    value={tchLeaveReason}
                    onChange={(e) => setTchLeaveReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setTchProofDoc(f.name);
                    }}
                    className="text-xs text-[#686052] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#EAE2D3] file:text-[#1C2A27]"
                  />
                  <span className="text-[11px] font-mono text-[#0E6B5E]">📎 {tchProofDoc}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-xs font-semibold transition"
                >
                  Submit Faculty Leave Application ({tchFromDate} → {tchToDate})
                </button>
              </form>

              <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4">
                <div className="border-b border-[#EAE2D3] pb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                    Faculty & Student Leave Ledger
                  </span>
                  <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                    Logged Leave Applications & Substitute Roster
                  </h3>
                </div>
                <div className="space-y-3">
                  {leaveApplications.map(lv => (
                    <div key={lv.id} className="p-4 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#0A4D44]">
                          {lv.id} · {lv.applicantName} ({lv.applicantRole.toUpperCase()})
                        </span>
                        <span className="font-semibold text-[#0A4D44]">{lv.status} ✓</span>
                      </div>
                      <div className="text-xs font-mono text-[#1C2A27] bg-[#FFFDF9] px-3 py-1.5 rounded-lg border border-[#DDD4C2] flex justify-between">
                        <span>{lv.fromDate} → {lv.toDate}</span>
                        <strong>{lv.totalDays} Day(s) · {lv.leaveType}</strong>
                      </div>
                      <p className="text-xs text-[#4A443B]">{lv.reason}</p>
                      {lv.substituteTeacher && (
                        <p className="text-[11px] text-[#8A5A19] font-semibold">
                          Substitute Assigned: {lv.substituteTeacher}
                        </p>
                      )}
                      {lv.proofDocument && (
                        <p className="text-[11px] font-mono text-[#0E6B5E]">Proof: 📎 {lv.proofDocument}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : facultyDeskTab === 'whisper' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-6 space-y-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                    Encrypted Faculty Directorate Channel
                  </span>
                  <h2 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                    Confidential Staff Feedback & Infrastructure Escalation
                  </h2>
                </div>
                <select
                  value={whisperCategory}
                  onChange={(e) => setWhisperCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                >
                  <option>Classroom Infrastructure & Smartboard</option>
                  <option>Laboratory Reagents & Equipment</option>
                  <option>Timetable & Workload Balancing</option>
                  <option>Student Welfare & Counselling Escalation</option>
                </select>
                <textarea
                  rows={4}
                  placeholder="Report classroom infrastructure, timetable, or administrative concerns directly to Principal..."
                  value={whisperMessage}
                  onChange={(e) => setWhisperMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                />
                <button
                  onClick={() => {
                    if (!whisperMessage.trim()) return;
                    setWhispers(prev => [{
                      id: `CMP-${Math.floor(200 + Math.random() * 700)}`,
                      category: whisperCategory,
                      filedByRole: 'Confidential Faculty Member',
                      urgency: 'High',
                      message: whisperMessage.trim(),
                      timestamp: 'Just now',
                      status: 'Pending',
                      resolutionNote: ''
                    }, ...prev]);
                    setWhisperMessage('');
                    playUISound('success');
                    showToast('Faculty Note Logged', 'Submitted directly to the Principal Directorate.', 'success');
                  }}
                  className="w-full py-2.5 bg-[#0A4D44] text-[#F5F0E6] text-xs font-semibold rounded-xl"
                >
                  Submit Confidential Faculty Note
                </button>
              </div>

              <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[#1C2A27]">Directorate Escalation Log</h3>
                {whispers.map(w => (
                  <div key={w.id} className="p-4 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-[#1C2A27]">
                      <span>{w.id} · {w.category}</span>
                      <span className="text-[#0E6B5E]">{w.status}</span>
                    </div>
                    <p className="text-[#4A443B]">"{w.message}"</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* FACULTY DESK TAB 3: SALARY SLIP & COMPENSATION */
            <div className="space-y-6">
              {currentFacultyStaffRecord ? (
                <>
                  <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0A3630] text-[#F5F0E6]">
                          October 2026 Pay Scale
                        </span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          currentFacultyStaffRecord.payrollStatus === 'Disbursed'
                            ? 'bg-[#EFF5F3] text-[#0A4D44] border-[#9CC5BE]'
                            : 'bg-[#FAF2F2] text-[#8B2626] border-[#E2B4B4]'
                        }`}>
                          {currentFacultyStaffRecord.payrollStatus}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-[#1C2A27] mt-1.5">
                        {currentFacultyStaffRecord.name} • {currentFacultyStaffRecord.designation}
                      </h2>
                      <p className="text-xs text-[#5A5346] mt-0.5">
                        Numeric Reg #{currentFacultyStaffRecord.id} · Remittance: <strong className="font-mono text-[#0A4D44]">{currentFacultyStaffRecord.bankAccount}</strong> · Shift: {currentFacultyStaffRecord.shift}
                      </p>
                      <p className="text-[11px] text-[#8A5A19] font-mono mt-0.5">
                        Disbursement Ref: {currentFacultyStaffRecord.lastPaidDate}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playUISound('click');
                        setIsPrintingSalaryVoucher(true);
                      }}
                      className="px-4 py-2.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold flex items-center gap-2 transition shadow-xs shrink-0"
                    >
                      <StreamlineIcon name="print" className="w-4 h-4" />
                      View Official Pay Slip Voucher
                    </button>
                  </div>

                  {/* 4 Financial Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-1">
                      <span className="text-xs text-[#686052]">Net Disbursed Take-Home</span>
                      <p className="text-2xl font-bold text-[#0A4D44] font-mono">
                        ₹{currentFacultyStaffRecord.netSalary.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#0A4D44] font-medium">Credited to Registered Bank</p>
                    </div>
                    <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-1">
                      <span className="text-xs text-[#686052]">Basic Pay Scale</span>
                      <p className="text-2xl font-bold text-[#1C2A27] font-mono">
                        ₹{currentFacultyStaffRecord.basicSalary.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#686052]">7th Pay Commission Scale</p>
                    </div>
                    <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-1">
                      <span className="text-xs text-[#686052]">DA, HRA & Allowances</span>
                      <p className="text-2xl font-bold text-[#0E6B5E] font-mono">
                        ₹{currentFacultyStaffRecord.allowances.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#0E6B5E]">Includes DA (45%) & HRA (40%)</p>
                    </div>
                    <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-1">
                      <span className="text-xs text-[#686052]">Total Deductions (EPF / PT)</span>
                      <p className="text-2xl font-bold text-[#8B2626] font-mono">
                        ₹{currentFacultyStaffRecord.deductions.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#8B2626]">Provident Fund & Taxes</p>
                    </div>
                  </div>

                  {/* Compensation Breakdown Card */}
                  <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-6 space-y-4">
                    <div className="border-b border-[#EAE2D3] pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                          Directorate Treasury Ledger
                        </span>
                        <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                          Earnings vs Statutory Deductions Itemized Audit
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-[#EFF5F3] text-xs font-mono font-bold text-[#0A4D44] border border-[#9CC5BE]">
                        Net: ₹{currentFacultyStaffRecord.netSalary.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-[#F7F3EB] border border-[#DDD4C2] space-y-2">
                        <p className="font-bold text-[#0A3630] uppercase text-[11px] tracking-wider">Earnings Elements</p>
                        <div className="flex justify-between py-1 border-b border-[#EAE2D3]">
                          <span>Basic Pay</span>
                          <span className="font-mono font-semibold">₹{currentFacultyStaffRecord.basicSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#EAE2D3]">
                          <span>Dearness Allowance (DA 45%)</span>
                          <span className="font-mono">₹{Math.round(currentFacultyStaffRecord.allowances * 0.45).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#EAE2D3]">
                          <span>House Rent Allowance (HRA 40%)</span>
                          <span className="font-mono">₹{Math.round(currentFacultyStaffRecord.allowances * 0.40).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 font-bold text-[#0A4D44]">
                          <span>Gross Remuneration</span>
                          <span className="font-mono">₹{(currentFacultyStaffRecord.basicSalary + currentFacultyStaffRecord.allowances).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#FAF2F2] border border-[#E2B4B4] space-y-2">
                        <p className="font-bold text-[#8B2626] uppercase text-[11px] tracking-wider">Statutory Deductions</p>
                        <div className="flex justify-between py-1 border-b border-[#E2C9C9]">
                          <span>Employee Provident Fund (EPF 65%)</span>
                          <span className="font-mono">₹{Math.round(currentFacultyStaffRecord.deductions * 0.65).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#E2C9C9]">
                          <span>Professional Tax (PT 15%)</span>
                          <span className="font-mono">₹{Math.round(currentFacultyStaffRecord.deductions * 0.15).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#E2C9C9]">
                          <span>Staff Welfare Health Fund</span>
                          <span className="font-mono">₹{Math.round(currentFacultyStaffRecord.deductions * 0.20).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 font-bold text-[#8B2626]">
                          <span>Total Deductions</span>
                          <span className="font-mono">₹{currentFacultyStaffRecord.deductions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-8 text-center text-xs text-[#686052]">
                  Salary record is being updated by the Directorate Bursar. Please consult the Accounts Office.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Official Faculty Salary Voucher Modal */}
      <SalaryVoucherModal
        staffMember={isPrintingSalaryVoucher ? currentFacultyStaffRecord : null}
        onClose={() => setIsPrintingSalaryVoucher(false)}
        playUISound={playUISound}
        showToast={showToast}
      />
    </>
  );
};
