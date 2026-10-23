import React, { useState, useMemo } from 'react';
import { RoleType, Student, Teacher, TimetablePeriod } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';

interface PrintableTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalRole: RoleType;
  currentStudent?: Student;
  activeTeacher?: Teacher;
  timetable: TimetablePeriod[];
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

interface WeeklySlotRow {
  periodLabel: string;
  timeRange: string;
  isBreak?: boolean;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
}

export const PrintableTimetableModal: React.FC<PrintableTimetableModalProps> = ({
  isOpen,
  onClose,
  portalRole,
  currentStudent,
  activeTeacher,
  timetable,
  playUISound,
  showToast
}) => {
  const [scheduleScope, setScheduleScope] = useState<'personal' | 'all-sections'>('personal');
  const [includeWeeklyGrid, setIncludeWeeklyGrid] = useState(true);
  const [includeSyllabusTopics, setIncludeSyllabusTopics] = useState(true);

  const isTeacherMode = portalRole === 'teacher';
  const studentGrade = currentStudent?.grade || '10-B';

  // Build complete personal period list for Student or Teacher
  const personalDailyPeriods = useMemo(() => {
    if (isTeacherMode && activeTeacher) {
      if (scheduleScope === 'all-sections') return timetable;
      const myPeriods = timetable.filter(
        p => p.teacherRegNo === activeTeacher.id || p.teacher === activeTeacher.name
      );
      return myPeriods.length > 0 ? myPeriods : timetable;
    }

    if (scheduleScope === 'all-sections') return timetable;
    const sectionPeriods = timetable.filter(p => p.classGrade === studentGrade);

    // Ensure a complete 6-period day for print clarity even if live radar has 4 periods stored
    const extraPeriods: TimetablePeriod[] = [
      {
        id: `PER-EXT-5-${studentGrade}`,
        period: 'Period 5',
        time: '12:10 - 01:00 PM',
        classGrade: studentGrade,
        roomNo: 'Chem Lab 201',
        subject: 'Science Practical (Acid-Base & Optics)',
        teacher: 'Dr. Vikram Sethi',
        teacherRegNo: '900101',
        status: 'Upcoming',
        teacherPresent: true,
        liveTopic: 'Titration & pH Indicator Verification'
      },
      {
        id: `PER-EXT-6-${studentGrade}`,
        period: 'Period 6',
        time: '01:00 - 01:50 PM',
        classGrade: studentGrade,
        roomNo: `Room ${studentGrade === '10-A' ? '201' : '204'}`,
        subject: 'English Literature & Grammar',
        teacher: 'Mrs. Clara Dsouza',
        teacherRegNo: '900104',
        status: 'Upcoming',
        teacherPresent: true,
        liveTopic: 'Analytical Paragraph & Poetic Devices'
      }
    ];

    return [...sectionPeriods, ...extraPeriods];
  }, [isTeacherMode, activeTeacher, scheduleScope, timetable, studentGrade]);

  // Build Monday–Saturday Weekly Matrix for print-ready PDF
  const weeklyMatrixRows: WeeklySlotRow[] = useMemo(() => {
    if (isTeacherMode && activeTeacher) {
      const subj = activeTeacher.subject;
      const clsList = activeTeacher.classes;
      const c1 = clsList[0] || '10-A';
      const c2 = clsList[1] || '10-B';
      const c3 = clsList[2] || '11-A';

      return [
        {
          periodLabel: 'Period 1',
          timeRange: '08:30 – 09:20 AM',
          mon: `Sec ${c1} • ${subj} (Rm 201)`,
          tue: `Sec ${c2} • ${subj} (Rm 204)`,
          wed: `Sec ${c1} • ${subj} (Rm 201)`,
          thu: `Sec ${c3} • ${subj} (Lab)`,
          fri: `Sec ${c2} • ${subj} (Rm 204)`,
          sat: `Sec ${c1} • Doubt Clinic`
        },
        {
          periodLabel: 'Period 2',
          timeRange: '09:20 – 10:10 AM',
          mon: `Sec ${c2} • ${subj} (Rm 204)`,
          tue: `Sec ${c1} • ${subj} (Rm 201)`,
          wed: `Sec ${c2} • ${subj} (Rm 204)`,
          thu: `Sec ${c2} • ${subj} (Rm 204)`,
          fri: `Sec ${c1} • ${subj} (Rm 201)`,
          sat: `Sec ${c2} • Weekly Quiz`
        },
        {
          periodLabel: 'Period 3',
          timeRange: '10:10 – 11:00 AM',
          mon: 'Lesson Prep / Evaluation',
          tue: `Sec ${c3} • ${subj} (Rm 108)`,
          wed: 'Departmental Review',
          thu: `Sec ${c1} • ${subj} (Rm 201)`,
          fri: `Sec ${c3} • ${subj} (Rm 108)`,
          sat: 'Parent-Teacher Desk'
        },
        {
          periodLabel: 'Recess Break',
          timeRange: '11:00 – 11:20 AM',
          isBreak: true,
          mon: 'MORNING RECESS & NUTRITION BREAK',
          tue: 'MORNING RECESS & NUTRITION BREAK',
          wed: 'MORNING RECESS & NUTRITION BREAK',
          thu: 'MORNING RECESS & NUTRITION BREAK',
          fri: 'MORNING RECESS & NUTRITION BREAK',
          sat: 'MORNING RECESS & HOUSE ASSEMBLY'
        },
        {
          periodLabel: 'Period 4',
          timeRange: '11:20 – 12:10 PM',
          mon: `Sec ${c3} • Practical Lab`,
          tue: 'Free / Notebook Check',
          wed: `Sec ${c3} • ${subj}`,
          thu: 'Faculty Mentoring',
          fri: `Sec ${c2} • Practical Lab`,
          sat: `Sec ${c3} • Olympiad Prep`
        },
        {
          periodLabel: 'Period 5',
          timeRange: '12:10 – 01:00 PM',
          mon: `Sec ${c1} • Practical Batch`,
          tue: `Sec ${c2} • Practical Batch`,
          wed: 'Remedial Make-Up Clinic',
          thu: `Sec ${c2} • Practical Batch`,
          fri: 'Remedial Make-Up Clinic',
          sat: 'House Activity Supervision'
        }
      ];
    }

    return [
      {
        periodLabel: 'Period 1',
        timeRange: '08:30 – 09:20 AM',
        mon: 'Science (Physics)\nDr. Vikram Sethi',
        tue: 'Mathematics (NCERT)\nDr. Vikram Sethi',
        wed: 'Science (Chemistry)\nDr. Vikram Sethi',
        thu: 'Mathematics (NCERT)\nDr. Vikram Sethi',
        fri: 'Science (Physics)\nDr. Vikram Sethi',
        sat: 'Mathematics Clinic\nDr. Vikram Sethi'
      },
      {
        periodLabel: 'Period 2',
        timeRange: '09:20 – 10:10 AM',
        mon: 'Mathematics (NCERT)\nDr. Vikram Sethi',
        tue: 'Computer Science & AI\nMs. Sunita Rao',
        wed: 'Mathematics (NCERT)\nDr. Vikram Sethi',
        thu: 'English Literature\nMrs. Clara Dsouza',
        fri: 'Mathematics (NCERT)\nDr. Vikram Sethi',
        sat: 'Proctored Weekly Test\nAll Subjects'
      },
      {
        periodLabel: 'Period 3',
        timeRange: '10:10 – 11:00 AM',
        mon: 'Computer Science & AI\nMs. Sunita Rao',
        tue: 'Social Studies & Hist\nMr. Rajesh Khanna',
        wed: 'Computer Science & AI\nMs. Sunita Rao',
        thu: 'Computer Science Lab\nMs. Sunita Rao',
        fri: 'Social Studies & Civics\nMr. Rajesh Khanna',
        sat: 'AI & Python Lab\nMs. Sunita Rao'
      },
      {
        periodLabel: 'Recess Break',
        timeRange: '11:00 – 11:20 AM',
        isBreak: true,
        mon: 'RECESS & REFRESHMENT BREAK (20 MINS)',
        tue: 'RECESS & REFRESHMENT BREAK (20 MINS)',
        wed: 'RECESS & REFRESHMENT BREAK (20 MINS)',
        thu: 'RECESS & REFRESHMENT BREAK (20 MINS)',
        fri: 'RECESS & REFRESHMENT BREAK (20 MINS)',
        sat: 'INTER-HOUSE ASSEMBLY & BREAK'
      },
      {
        periodLabel: 'Period 4',
        timeRange: '11:20 – 12:10 PM',
        mon: 'Social Studies & Hist\nMr. Rajesh Khanna',
        tue: 'English Literature\nMrs. Clara Dsouza',
        wed: 'Social Studies & Geo\nMr. Rajesh Khanna',
        thu: 'Social Studies & Hist\nMr. Rajesh Khanna',
        fri: 'English Literature\nMrs. Clara Dsouza',
        sat: 'Peer Tutoring & Library\nMentorship Hub'
      },
      {
        periodLabel: 'Period 5',
        timeRange: '12:10 – 01:00 PM',
        mon: 'Chemistry Lab Practical\nDr. Vikram Sethi',
        tue: 'Science (Chemistry)\nDr. Vikram Sethi',
        wed: 'English Grammar\nMrs. Clara Dsouza',
        thu: 'Physics Optics Lab\nDr. Vikram Sethi',
        fri: 'Chemistry Titration Lab\nDr. Vikram Sethi',
        sat: 'Sports & House Club\nGround / Auditorium'
      },
      {
        periodLabel: 'Period 6',
        timeRange: '01:00 – 01:50 PM',
        mon: 'English Literature\nMrs. Clara Dsouza',
        tue: 'Library & Self-Study\nReading Hall',
        wed: 'Peer Doubt Resolution\nClass Teacher',
        thu: 'Mathematics Practice\nDr. Vikram Sethi',
        fri: 'House Quiz & Debate\nActivity Hall',
        sat: 'Remedial Bridge Lab\nOptional Make-Up'
      }
    ];
  }, [isTeacherMode, activeTeacher]);

  if (!isOpen) return null;

  const handleTriggerPrint = () => {
    playUISound('success');
    window.print();
    showToast(
      'Print-Ready Timetable PDF Generated',
      isTeacherMode
        ? `Personal faculty timetable for ${activeTeacher?.name} sent to PDF/Printer.`
        : `Personal class schedule for ${currentStudent?.name} (Section ${studentGrade}) sent to PDF/Printer.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#13221F]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFDF9] border border-[#D5CBB8] rounded-xl max-w-5xl w-full p-5 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-2">
        {/* Top Action & Print Options Bar (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F5F0E6] p-3.5 rounded-xl border border-[#DDD4C2] print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#1C2A27]">PDF Layout Options:</span>
            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setScheduleScope(prev => (prev === 'personal' ? 'all-sections' : 'personal'));
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                scheduleScope === 'personal'
                  ? 'bg-[#0A4D44] text-white border-[#0A4D44]'
                  : 'bg-[#FFFDF9] text-[#4A443B] border-[#D5CBB8]'
              }`}
            >
              {scheduleScope === 'personal'
                ? isTeacherMode
                  ? 'My Personal Teaching Schedule'
                  : `My Section (${studentGrade}) Only`
                : 'All 6 Campus Sections'}
            </button>

            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setIncludeWeeklyGrid(prev => !prev);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                includeWeeklyGrid
                  ? 'bg-[#0E6B5E] text-white border-[#0E6B5E]'
                  : 'bg-[#FFFDF9] text-[#4A443B] border-[#D5CBB8]'
              }`}
            >
              {includeWeeklyGrid ? '✓ Include Mon–Sat Weekly Grid' : 'Daily Periods Only'}
            </button>

            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setIncludeSyllabusTopics(prev => !prev);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                includeSyllabusTopics
                  ? 'bg-[#0E6B5E] text-white border-[#0E6B5E]'
                  : 'bg-[#FFFDF9] text-[#4A443B] border-[#D5CBB8]'
              }`}
            >
              {includeSyllabusTopics ? '✓ Include Syllabus Topics' : 'Hide Syllabus Topics'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerPrint}
              className="px-4 py-2 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <StreamlineIcon name="print" className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg border border-[#D5CBB8] bg-[#FFFDF9] hover:bg-[#EAE2D3] text-[#1C2A27]"
              title="Close Preview"
            >
              <StreamlineIcon name="close" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* OFFICIAL INSTITUTIONAL PRINT HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-[#0A4D44] pb-4">
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#0E6B5E]">
              {isTeacherMode
                ? 'Official Faculty Teaching Schedule & Classroom Roster'
                : 'Official Student Personal Class Schedule & Weekly Timetable'}
            </p>
            <h2 className="text-xl font-bold text-[#1C2A27] mt-0.5">
              EDUNEXUS VIDYA MANDIR • ACADEMIC SESSION 2026–27
            </h2>
            <p className="text-xs text-[#686052]">
              Affiliated Senior Secondary Campus • Verified Timetable Document • Generated on 18 Oct 2026
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs bg-[#EFF5F3] px-3.5 py-2 rounded-lg border border-[#9CC5BE]">
            <span className="text-[10px] uppercase text-[#0E6B5E] font-semibold block">
              Document Reference
            </span>
            <strong className="text-[#0A4D44]">
              {isTeacherMode
                ? `TT-FAC-${activeTeacher?.id || '900101'}`
                : `TT-STU-${currentStudent?.id || '20261003'}-${studentGrade}`}
            </strong>
            <span className="text-[10px] text-[#686052] block">Term II • Oct–Mar</span>
          </div>
        </div>

        {/* CANDIDATE / FACULTY METADATA STRIP */}
        {isTeacherMode && activeTeacher ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F5F0E6] p-4 rounded-lg border border-[#DDD4C2]">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#686052]">Faculty Name & Reg No.</p>
              <p className="text-xs sm:text-sm font-semibold text-[#1C2A27] mt-0.5">{activeTeacher.name}</p>
              <p className="text-[11px] font-mono text-[#0A4D44]">Reg #{activeTeacher.id}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#686052]">Designation</p>
              <p className="text-xs sm:text-sm font-semibold text-[#0A4D44] mt-0.5">{activeTeacher.designation}</p>
              <p className="text-[11px] text-[#686052]">{activeTeacher.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#686052]">Primary Department</p>
              <p className="text-xs sm:text-sm font-semibold text-[#1C2A27] mt-0.5">{activeTeacher.subject}</p>
              <p className="text-[11px] text-[#0E6B5E]">Class Teacher: {activeTeacher.classTeacherOf || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#686052]">Assigned Sections</p>
              <p className="text-xs sm:text-sm font-mono font-semibold text-[#0A4D44] mt-0.5">
                {activeTeacher.classes.join(', ')}
              </p>
              <p className="text-[11px] text-[#686052]">24 Lectures / Week</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F5F0E6] p-4 rounded-lg border border-[#DDD4C2]">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#686052]">Student Name & Reg No.</p>
              <p className="text-xs sm:text-sm font-semibold text-[#1C2A27] mt-0.5">{currentStudent?.name}</p>
              <p className="text-[11px] font-mono text-[#0A4D44]">
                Reg #{currentStudent?.id} · Roll #{currentStudent?.rollNo}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#686052]">Class Section & Home Room</p>
              <p className="text-xs sm:text-sm font-semibold text-[#0A4D44] mt-0.5">
                Section {studentGrade} ({studentGrade === '10-A' ? 'Room 201' : 'Room 204'})
              </p>
              <p className="text-[11px] text-[#686052]">{currentStudent?.house}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#686052]">Class Teacher</p>
              <p className="text-xs sm:text-sm font-semibold text-[#1C2A27] mt-0.5">
                {studentGrade === '10-A' ? 'Dr. Vikram Sethi (#900101)' : 'Ms. Sunita Rao (#900102)'}
              </p>
              <p className="text-[11px] text-[#0E6B5E]">Daily Roll Call: 08:20 AM</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#686052]">School Bell Timings</p>
              <p className="text-xs sm:text-sm font-mono font-semibold text-[#0A4D44] mt-0.5">
                08:30 AM – 01:50 PM
              </p>
              <p className="text-[11px] text-[#686052]">Recess: 11:00 – 11:20 AM</p>
            </div>
          </div>
        )}

        {/* PART 1: DAILY PERIOD-BY-PERIOD SCHEDULE TABLE */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0A4D44]">
              1. {isTeacherMode ? 'Personal Daily Lecture & Lab Schedule' : `Section ${studentGrade} Daily Period Schedule`}
            </h3>
            <span className="text-xs font-mono text-[#686052]">
              {personalDailyPeriods.length} Scheduled Periods
            </span>
          </div>

          <div className="overflow-x-auto border border-[#DDD4C2] rounded-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Time Slot</th>
                  <th className="py-2.5 px-3">Section & Room</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Assigned Faculty (Reg No.)</th>
                  {includeSyllabusTopics && <th className="py-2.5 px-3">Current Syllabus Topic</th>}
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D3]">
                {personalDailyPeriods.map((per) => (
                  <tr
                    key={per.id}
                    className={per.status === 'Ongoing' ? 'bg-[#EFF5F3]' : 'hover:bg-[#F7F3EB]'}
                  >
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#0A4D44] whitespace-nowrap">
                      {per.period}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#1C2A27] whitespace-nowrap">
                      {per.time}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#1C2A27] whitespace-nowrap">
                      Sec {per.classGrade} • <span className="font-mono text-[#686052]">{per.roomNo}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#1C2A27]">
                      {per.subject}
                    </td>
                    <td className="py-2.5 px-3 text-[#8A5A19] font-medium whitespace-nowrap">
                      {per.teacher} <span className="font-mono text-[11px]">(#{per.teacherRegNo})</span>
                    </td>
                    {includeSyllabusTopics && (
                      <td className="py-2.5 px-3 text-[#4A443B]">
                        {per.liveTopic || 'Scheduled NCERT Curriculum Module'}
                      </td>
                    )}
                    <td className="py-2.5 px-3 text-right font-mono font-semibold whitespace-nowrap">
                      <span
                        className={
                          per.status === 'Ongoing'
                            ? 'text-[#0A4D44]'
                            : per.status === 'Completed'
                            ? 'text-[#0E6B5E]'
                            : 'text-[#686052]'
                        }
                      >
                        {per.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PART 2: MONDAY TO SATURDAY WEEKLY TIMETABLE GRID */}
        {includeWeeklyGrid && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0A4D44]">
                2. Full Weekly Master Timetable (Monday – Saturday)
              </h3>
              <span className="text-xs font-mono text-[#686052]">
                Includes Theory Lectures, Practical Labs &amp; Remedial Clinics
              </span>
            </div>

            <div className="overflow-x-auto border border-[#DDD4C2] rounded-lg">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-[#124E45] text-[#F5F0E6] uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-2.5 px-3 border-r border-[#236B60]">Period / Time</th>
                    <th className="py-2.5 px-2.5 border-r border-[#236B60]">Monday</th>
                    <th className="py-2.5 px-2.5 border-r border-[#236B60]">Tuesday</th>
                    <th className="py-2.5 px-2.5 border-r border-[#236B60]">Wednesday</th>
                    <th className="py-2.5 px-2.5 border-r border-[#236B60]">Thursday</th>
                    <th className="py-2.5 px-2.5 border-r border-[#236B60]">Friday</th>
                    <th className="py-2.5 px-2.5">Saturday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D3]">
                  {weeklyMatrixRows.map((row, idx) =>
                    row.isBreak ? (
                      <tr key={idx} className="bg-[#FAF6EE] text-[#8A5A19] font-mono font-semibold text-center">
                        <td className="py-2 px-3 text-left border-r border-[#EAE2D3]">
                          <span className="block">{row.periodLabel}</span>
                          <span className="text-[10px] text-[#686052]">{row.timeRange}</span>
                        </td>
                        <td colSpan={6} className="py-2 px-3 tracking-widest text-[10px] uppercase">
                          {row.mon}
                        </td>
                      </tr>
                    ) : (
                      <tr key={idx} className="hover:bg-[#F7F3EB] align-top">
                        <td className="py-2.5 px-3 font-mono bg-[#F5F0E6] border-r border-[#EAE2D3] whitespace-nowrap">
                          <strong className="text-[#0A4D44] block">{row.periodLabel}</strong>
                          <span className="text-[10px] text-[#686052]">{row.timeRange}</span>
                        </td>
                        {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat].map((cell, cIdx) => {
                          const lines = cell.split('\n');
                          return (
                            <td
                              key={cIdx}
                              className="py-2.5 px-2.5 border-r last:border-r-0 border-[#EAE2D3]"
                            >
                              <p className="font-semibold text-[#1C2A27] leading-snug">{lines[0]}</p>
                              {lines[1] && (
                                <p className="text-[10px] text-[#686052] mt-0.5">{lines[1]}</p>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OFFICIAL SIGNATURES & PRINT FOOTER */}
        <div className="pt-4 border-t border-[#DDD4C2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#686052]">
          <div className="space-y-0.5">
            <p className="font-semibold text-[#1C2A27]">
              Verified by Academic Timetable Committee • EduNexus Vidya Mandir
            </p>
            <p className="text-[11px]">
              Students must report to Practical Labs (Physics, Chemistry &amp; AI Lab) 5 minutes prior to the bell with lab coats and observation notebooks.
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] shrink-0">
            <div className="text-center">
              <div className="border-b border-[#8C8375] w-28 pb-1 mb-1 text-[#0A4D44] font-semibold">
                Ms. Sunita Rao
              </div>
              <span>Timetable Coordinator</span>
            </div>
            <div className="text-center">
              <div className="border-b border-[#8C8375] w-28 pb-1 mb-1 text-[#0A4D44] font-semibold">
                Dr. A. K. Verma
              </div>
              <span>Principal Directorate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
