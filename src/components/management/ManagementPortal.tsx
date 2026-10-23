import React, { useState, useMemo } from 'react';
import {
  Announcement,
  CalendarEvent,
  CampusStaffMember,
  DisciplineCase,
  Facility,
  ParentNotificationLog,
  RankedStudent,
  RoleType,
  StaffRoleCategory,
  Student,
  StudentAcademicSummary,
  Teacher,
  TimetablePeriod,
  WhisperReport
} from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';
import { UserAvatar } from '../common/UserAvatar';
import { LeaderboardModule } from '../shared/LeaderboardModule';
import { SchoolCalendarModule } from '../shared/SchoolCalendarModule';
import { AttendanceTrendChart } from '../shared/AttendanceTrendChart';
import { SalaryVoucherModal } from '../modals/SalaryVoucherModal';

interface ManagementPortalProps {
  mgmtTab: string;
  handleSelectNavTab?: (tabId: string) => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  rankedStudents: RankedStudent[];
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  campusStaff: CampusStaffMember[];
  setCampusStaff: React.Dispatch<React.SetStateAction<CampusStaffMember[]>>;
  parentNotifications?: ParentNotificationLog[];
  onSendParentNotification?: (studentId: string, senderLabel: string, customMessage?: string) => void;
  timetable: TimetablePeriod[];
  disciplineCases: DisciplineCase[];
  setDisciplineCases: React.Dispatch<React.SetStateAction<DisciplineCase[]>>;
  whispers: WhisperReport[];
  setWhispers: React.Dispatch<React.SetStateAction<WhisperReport[]>>;
  facilities: Facility[];
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  getStudentAcademicSummary: (studentId: string) => StudentAcademicSummary;
  handlePayFeeInstallment: (studentId: string, amount: number | string) => void;
  setPrintingStudentId: (id: string) => void;
  availableClasses: string[];
  activeRole: RoleType;
  currentStudent: Student;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

export const ManagementPortal: React.FC<ManagementPortalProps> = ({
  mgmtTab,
  handleSelectNavTab,
  students,
  setStudents,
  rankedStudents,
  teachers,
  setTeachers,
  campusStaff,
  setCampusStaff,
  parentNotifications,
  onSendParentNotification,
  timetable,
  disciplineCases,
  setDisciplineCases,
  whispers,
  setWhispers,
  facilities,
  setFacilities,
  announcements,
  setAnnouncements,
  calendarEvents,
  setCalendarEvents,
  getStudentAcademicSummary,
  handlePayFeeInstallment,
  setPrintingStudentId,
  availableClasses,
  activeRole,
  currentStudent,
  playUISound,
  showToast
}) => {
  const [mgmtInspectedStudentId, setMgmtInspectedStudentId] = useState('20261003');
  const mgmtInspectedStudent = useMemo(
    () => students.find(s => s.id === mgmtInspectedStudentId) || students[0],
    [students, mgmtInspectedStudentId]
  );

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('10-A');

  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({});

  const [annTitle, setAnnTitle] = useState('');
  const [annTargetClass, setAnnTargetClass] = useState('All Classes');
  const [annPriority, setAnnPriority] = useState('Urgent');
  const [annMessage, setAnnMessage] = useState('');

  // Payroll & All Staff HR States
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState<'All' | StaffRoleCategory>('All');
  const [staffPayrollFilter, setStaffPayrollFilter] = useState<'All' | 'Disbursed' | 'Pending'>('All');
  const [selectedVoucherStaff, setSelectedVoucherStaff] = useState<CampusStaffMember | null>(null);
  const [isOnboardingStaff, setIsOnboardingStaff] = useState(false);

  // New staff onboarding inputs
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRoleCategory>('Teacher');
  const [newStaffDesignation, setNewStaffDesignation] = useState('');
  const [newStaffDepartment, setNewStaffDepartment] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('+91 98110-00000');
  const [newStaffShift, setNewStaffShift] = useState('07:30 AM – 02:30 PM');
  const [newStaffBasic, setNewStaffBasic] = useState(48000);
  const [newStaffAllowances, setNewStaffAllowances] = useState(11000);
  const [newStaffDeductions, setNewStaffDeductions] = useState(3200);
  const [newStaffBank, setNewStaffBank] = useState('SBI •••• 1234');
  const [newStaffTask, setNewStaffTask] = useState('Campus Faculty & Department Operations');

  const handleDisburseSalary = (staffId: string) => {
    const utrNo = Math.floor(884500 + Math.random() * 9999);
    setCampusStaff(prev =>
      prev.map(s =>
        s.id === staffId
          ? {
              ...s,
              payrollStatus: 'Disbursed',
              lastPaidDate: `01 Oct 2026 (UTR #${utrNo})`
            }
          : s
      )
    );
    playUISound('success');
    const target = campusStaff.find(s => s.id === staffId);
    showToast(
      'Salary Disbursed Successfully',
      `₹${target?.netSalary.toLocaleString()} transferred to ${target?.name} (${target?.bankAccount}) via UTR #${utrNo}.`,
      'success'
    );
  };

  const handleBatchDisburseAll = () => {
    const pendingList = campusStaff.filter(s => s.payrollStatus === 'Pending');
    if (pendingList.length === 0) {
      showToast('All Paid', 'All staff payroll for October has already been disbursed.', 'info');
      return;
    }
    const totalDisbursed = pendingList.reduce((acc, s) => acc + s.netSalary, 0);
    const batchUtr = Math.floor(990100 + Math.random() * 8999);
    setCampusStaff(prev =>
      prev.map(s =>
        s.payrollStatus === 'Pending'
          ? {
              ...s,
              payrollStatus: 'Disbursed',
              lastPaidDate: `01 Oct 2026 (Batch UTR #${batchUtr})`
            }
          : s
      )
    );
    playUISound('success');
    showToast(
      'Bulk Payroll Disbursed',
      `Disbursed ₹${totalDisbursed.toLocaleString()} across ${pendingList.length} staff accounts (Batch Ref #${batchUtr}).`,
      'success'
    );
  };

  const handleToggleDutyStatus = (staffId: string) => {
    setCampusStaff(prev =>
      prev.map(s => {
        if (s.id !== staffId) return s;
        const nextStatus =
          s.dutyStatus === 'On Duty'
            ? 'Task Assigned'
            : s.dutyStatus === 'Task Assigned'
            ? 'On Leave'
            : 'On Duty';
        return { ...s, dutyStatus: nextStatus };
      })
    );
    playUISound('click');
  };

  const totalMonthlyPayroll = useMemo(
    () => campusStaff.reduce((acc, s) => acc + s.netSalary, 0),
    [campusStaff]
  );
  const totalDisbursedPayroll = useMemo(
    () => campusStaff.filter(s => s.payrollStatus === 'Disbursed').reduce((acc, s) => acc + s.netSalary, 0),
    [campusStaff]
  );
  const totalPendingPayroll = useMemo(
    () => campusStaff.filter(s => s.payrollStatus === 'Pending').reduce((acc, s) => acc + s.netSalary, 0),
    [campusStaff]
  );
  const staffOnDutyCount = useMemo(
    () => campusStaff.filter(s => s.dutyStatus === 'On Duty' || s.dutyStatus === 'Task Assigned').length,
    [campusStaff]
  );

  const filteredStaff = useMemo(() => {
    return campusStaff.filter(s => {
      const q = staffSearchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q) ||
        s.departmentOrZone.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.bankAccount.toLowerCase().includes(q);

      const matchesRole = staffRoleFilter === 'All' || s.roleCategory === staffRoleFilter;
      const matchesPayroll = staffPayrollFilter === 'All' || s.payrollStatus === staffPayrollFilter;

      return matchesSearch && matchesRole && matchesPayroll;
    });
  }, [campusStaff, staffSearchQuery, staffRoleFilter, staffPayrollFilter]);

  return (
    <>
      {mgmtTab === 'mgmt-command' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5">
              <span className="text-xs text-[#686052]">Enrolled Students (6 Sections)</span>
              <p className="text-2xl font-semibold text-[#1C2A27] mt-1">{students.length}</p>
              <p className="text-[11px] text-[#0A4D44] mt-1">
                Present Today: {students.filter(s => s.todayStatus === 'Present').length}/{students.length}
              </p>
            </div>
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5">
              <span className="text-xs text-[#686052]">Fee Revenue Collected</span>
              <p className="text-2xl font-semibold text-[#0A4D44] mt-1">
                ₹{students.reduce((acc, s) => acc + s.paidFee, 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-[#8B2626] mt-1">
                Pending Dues: ₹{students.reduce((acc, s) => acc + s.dueFee, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5">
              <span className="text-xs text-[#686052]">Unattended Ongoing Periods</span>
              <p className="text-2xl font-semibold text-[#8B2626] mt-1">
                {timetable.filter(p => p.status === 'Ongoing' && !p.teacherPresent).length}
              </p>
              <p className="text-[11px] text-[#686052] mt-1">Live 6-section radar</p>
            </div>
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5">
              <span className="text-xs text-[#686052]">Open Conduct & Welfare Cases</span>
              <p className="text-2xl font-semibold text-[#1C2A27] mt-1">
                {disciplineCases.filter(d => d.status !== 'Resolved').length + whispers.filter(w => w.status !== 'Resolved').length}
              </p>
              <p className="text-[11px] text-[#0E6B5E] mt-1">In Directorate Tribunal</p>
            </div>
          </div>

          <AttendanceTrendChart
            activeRole="management"
            currentStudent={mgmtInspectedStudent}
            selectedClass="All 6 Sections"
            playUISound={playUISound}
          />

          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                Real-Time Academic Supervision Across All 6 Sections
              </p>
              <h2 className="text-base font-semibold text-[#1C2A27] mt-0.5">
                Live Period & Faculty Presence Audit (Classes 9-A, 10-A, 10-B, 11-A, 11-B, 12-A)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {timetable.map(per => (
                <div
                  key={per.id}
                  className={`p-4 rounded-lg border space-y-1.5 ${
                    per.status === 'Ongoing'
                      ? per.teacherPresent ? 'bg-[#EFF5F3] border-[#9CC5BE]' : 'bg-[#FAF2F2] border-[#E2B4B4]'
                      : 'bg-[#F7F3EB] border-[#E2D9C8]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#1C2A27]">Section {per.classGrade} ({per.roomNo})</span>
                    <span className={`text-[11px] font-semibold ${
                      per.status === 'Ongoing'
                        ? per.teacherPresent ? 'text-[#0A4D44]' : 'text-[#9E2A2B]'
                        : 'text-[#686052]'
                    }`}>
                      {per.status === 'Ongoing'
                        ? per.teacherPresent ? '● Faculty Live' : '○ Faculty Absent'
                        : per.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#1C2A27]">{per.subject}</p>
                  <p className="text-[11px] text-[#5A5346]">
                    Faculty: <strong className="text-[#8A5A19]">{per.teacher} (#{per.teacherRegNo})</strong>
                  </p>
                  {per.teacherPresent && per.liveTopic && (
                    <p className="text-[11px] text-[#0A4D44] font-medium pt-1">
                      Active Topic: "{per.liveTopic}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mgmtTab === 'mgmt-payroll' && (
        <div className="space-y-6">
          {/* Top Directorate Banner */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-xs">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0A3630] text-[#F5F0E6]">
                  Directorate Treasury & Staff HR
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EFF5F3] text-[#0A4D44] border border-[#9CC5BE]">
                  October 2026 Remittance Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C2A27] mt-1.5 tracking-tight">
                Campus-Wide Staff HR Master Register & Payroll Treasury
              </h1>
              <p className="text-xs text-[#5A5346] max-w-3xl mt-1 leading-relaxed">
                Supervise monthly compensation, biometric duty logs, station duties, and direct bank disbursement across all 6 campus operational wings (Faculty, Hygiene & Sanitation, HT/LT Grid, Plumbing/RO, Administration & Security Fleet).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {totalPendingPayroll > 0 && (
                <button
                  type="button"
                  onClick={handleBatchDisburseAll}
                  className="px-4 py-2.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold flex items-center gap-2 transition shadow-xs"
                >
                  <StreamlineIcon name="wallet" className="w-4 h-4" />
                  Bulk Disburse Pending (₹{totalPendingPayroll.toLocaleString()})
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  setIsOnboardingStaff(prev => !prev);
                }}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
                  isOnboardingStaff
                    ? 'bg-[#1C2A27] text-white border-[#1C2A27]'
                    : 'bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#1C2A27] border-[#DDD4C2]'
                }`}
              >
                <StreamlineIcon name="user" className="w-4 h-4" />
                {isOnboardingStaff ? 'Close Onboard Form' : '+ Onboard New Staff'}
              </button>
            </div>
          </div>

          {/* 4 Financial & HR Overview KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Payroll Pool */}
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-2">
              <span className="text-xs font-medium text-[#686052]">Total Monthly Payroll</span>
              <p className="text-2xl font-bold text-[#1C2A27] font-mono">
                ₹{totalMonthlyPayroll.toLocaleString()}
              </p>
              <div className="space-y-1">
                <div className="w-full bg-[#EAE2D3] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0A4D44] h-full transition-all duration-500"
                    style={{
                      width: `${totalMonthlyPayroll > 0 ? (totalDisbursedPayroll / totalMonthlyPayroll) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#686052] font-mono">
                  <span>{Math.round(totalMonthlyPayroll > 0 ? (totalDisbursedPayroll / totalMonthlyPayroll) * 100 : 0)}% Disbursed</span>
                  <span>{campusStaff.length} Total Staff</span>
                </div>
              </div>
            </div>

            {/* Card 2: Disbursed Remittances */}
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-2">
              <span className="text-xs font-medium text-[#686052]">Disbursed This Month</span>
              <p className="text-2xl font-bold text-[#0A4D44] font-mono">
                ₹{totalDisbursedPayroll.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#0A4D44] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A4D44]" />
                {campusStaff.filter(s => s.payrollStatus === 'Disbursed').length} Accounts Remitted (NEFT)
              </p>
            </div>

            {/* Card 3: Pending Authorization */}
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-2">
              <span className="text-xs font-medium text-[#686052]">Pending Disbursement</span>
              <p className="text-2xl font-bold text-[#8B2626] font-mono">
                ₹{totalPendingPayroll.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#8B2626] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B2626]" />
                {campusStaff.filter(s => s.payrollStatus === 'Pending').length} Pending Director Approval
              </p>
            </div>

            {/* Card 4: Biometric Duty Presence */}
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-2">
              <span className="text-xs font-medium text-[#686052]">Biometric Duty Presence</span>
              <p className="text-2xl font-bold text-[#0E6B5E]">
                {staffOnDutyCount} / {campusStaff.length}
              </p>
              <p className="text-[11px] text-[#5A5346]">
                {campusStaff.filter(s => s.dutyStatus === 'On Duty').length} On Duty · {campusStaff.filter(s => s.dutyStatus === 'Task Assigned').length} Task Assigned
              </p>
            </div>
          </div>

          {/* Onboarding Drawer / Card */}
          {isOnboardingStaff && (
            <div className="bg-[#FFFDF9] border-2 border-[#0A4D44] rounded-xl p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E6B5E]">
                    Institutional HR Form
                  </span>
                  <h3 className="text-base font-bold text-[#1C2A27]">
                    Onboard New Faculty or Campus Operations Staff Member
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOnboardingStaff(false)}
                  className="p-1.5 text-xs text-[#686052] hover:text-[#1C2A27]"
                >
                  ✕ Close
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newStaffName.trim() || !newStaffDesignation.trim()) return;

                  const nextId = `${700501 + campusStaff.length}`;
                  const created: CampusStaffMember = {
                    id: nextId,
                    name: newStaffName.trim(),
                    roleCategory: newStaffRole,
                    designation: newStaffDesignation.trim(),
                    departmentOrZone: newStaffDepartment.trim() || 'General Operations Block',
                    phone: newStaffPhone.trim(),
                    shift: newStaffShift,
                    dutyStatus: 'On Duty',
                    assignedTask: newStaffTask.trim() || 'Initial Orientation & Station Briefing',
                    basicSalary: Number(newStaffBasic) || 0,
                    allowances: Number(newStaffAllowances) || 0,
                    deductions: Number(newStaffDeductions) || 0,
                    netSalary: (Number(newStaffBasic) || 0) + (Number(newStaffAllowances) || 0) - (Number(newStaffDeductions) || 0),
                    payrollStatus: 'Pending',
                    lastPaidDate: 'Pending First Cycle',
                    bankAccount: newStaffBank.trim() || 'SBI •••• 0000'
                  };

                  setCampusStaff(prev => [...prev, created]);
                  setIsOnboardingStaff(false);
                  setNewStaffName('');
                  setNewStaffDesignation('');
                  setNewStaffDepartment('');
                  playUISound('success');
                  showToast(
                    'Staff Member Onboarded',
                    `${created.name} (${created.designation}) onboarded with Numeric Reg #${created.id}.`,
                    'success'
                  );
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Role Category</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value as StaffRoleCategory)}
                      className="w-full px-3 py-2 text-xs font-medium bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    >
                      <option value="Teacher">Teaching Faculty</option>
                      <option value="Cleaner & Sanitation">Cleaner & Sanitation</option>
                      <option value="Electrician & Power">Electrician & Power Grid</option>
                      <option value="Maintenance & Technician">Maintenance, Plumbing & Tech</option>
                      <option value="Management & Admin">Management & Administration</option>
                      <option value="Security & Transport">Security & Transport Fleet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Designation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Physics Lab Assistant"
                      value={newStaffDesignation}
                      onChange={(e) => setNewStaffDesignation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Department / Assigned Zone</label>
                    <input
                      type="text"
                      placeholder="e.g. Physics Lab, Ground Floor Annex"
                      value={newStaffDepartment}
                      onChange={(e) => setNewStaffDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Shift Timings</label>
                    <input
                      type="text"
                      value={newStaffShift}
                      onChange={(e) => setNewStaffShift(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F3EB] p-3.5 rounded-lg border border-[#DDD4C2]">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1C2A27] mb-1">Basic Salary (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={newStaffBasic}
                      onChange={(e) => setNewStaffBasic(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1C2A27] mb-1">Allowances (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={newStaffAllowances}
                      onChange={(e) => setNewStaffAllowances(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1C2A27] mb-1">Deductions / PF (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={newStaffDeductions}
                      onChange={(e) => setNewStaffDeductions(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0A4D44] mb-1">Net Compensation (₹)</label>
                    <div className="px-2.5 py-1.5 text-xs font-mono font-bold bg-[#EFF5F3] text-[#0A4D44] border border-[#9CC5BE] rounded-lg">
                      ₹{Math.max(0, (Number(newStaffBasic) || 0) + (Number(newStaffAllowances) || 0) - (Number(newStaffDeductions) || 0)).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Bank Account & IFSC Mask</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC •••• 4012"
                      value={newStaffBank}
                      onChange={(e) => setNewStaffBank(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Initial Assigned Operational Task</label>
                    <input
                      type="text"
                      placeholder="e.g. Lab Safety Equipment Setup & Equipment Audit"
                      value={newStaffTask}
                      onChange={(e) => setNewStaffTask(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOnboardingStaff(false)}
                    className="px-4 py-2 text-xs font-medium text-[#686052] hover:text-[#1C2A27]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold shadow-xs"
                  >
                    Confirm & Onboard Staff Member
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Department / Wing Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'All', label: 'All Campus Wings', count: campusStaff.length },
              { id: 'Teacher', label: 'Teaching Faculty', count: campusStaff.filter(s => s.roleCategory === 'Teacher').length },
              { id: 'Cleaner & Sanitation', label: 'Hygiene & Cleaners', count: campusStaff.filter(s => s.roleCategory === 'Cleaner & Sanitation').length },
              { id: 'Electrician & Power', label: 'Power & Electricians', count: campusStaff.filter(s => s.roleCategory === 'Electrician & Power').length },
              { id: 'Maintenance & Technician', label: 'Plumbers & Techs', count: campusStaff.filter(s => s.roleCategory === 'Maintenance & Technician').length },
              { id: 'Management & Admin', label: 'Administration & HR', count: campusStaff.filter(s => s.roleCategory === 'Management & Admin').length },
              { id: 'Security & Transport', label: 'Security & Drivers', count: campusStaff.filter(s => s.roleCategory === 'Security & Transport').length },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playUISound('click');
                  setStaffRoleFilter(tab.id as 'All' | StaffRoleCategory);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  staffRoleFilter === tab.id
                    ? 'bg-[#0A4D44] text-white shadow-xs'
                    : 'bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#5A5346] border border-[#DDD4C2]'
                }`}
              >
                {tab.label} <span className="opacity-75 font-mono text-[11px]">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search & Quick Filters Bar */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                placeholder="Search by name, Numeric Reg #, designation, duty zone, bank account..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F3EB] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
              />
              <span className="absolute left-3 top-2.5 text-[#686052] text-xs">🔍</span>
              {staffSearchQuery && (
                <button
                  type="button"
                  onClick={() => setStaffSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-[#686052] hover:text-[#1C2A27]"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={staffPayrollFilter}
                onChange={(e) => {
                  playUISound('click');
                  setStaffPayrollFilter(e.target.value as 'All' | 'Disbursed' | 'Pending');
                }}
                className="px-3 py-2 rounded-lg bg-[#F7F3EB] border border-[#D5CBB8] text-xs font-semibold"
              >
                <option value="All">All Payroll Statuses</option>
                <option value="Disbursed">Disbursed (Settled)</option>
                <option value="Pending">Pending Disbursement</option>
              </select>

              <span className="text-xs text-[#686052] font-mono whitespace-nowrap">
                {filteredStaff.length} / {campusStaff.length} Staff
              </span>
            </div>
          </div>

          {/* Master Staff HR & Payroll Table */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Staff Member & Reg #</th>
                    <th className="py-3.5 px-3">Designation & Department</th>
                    <th className="py-3.5 px-3">Shift & Biometric Duty</th>
                    <th className="py-3.5 px-3">Operational Station / Task</th>
                    <th className="py-3.5 px-3 text-right">Basic + Allow - Ded</th>
                    <th className="py-3.5 px-3 text-right bg-[#072E29]">Net Salary (₹)</th>
                    <th className="py-3.5 px-3">Remittance & UTR</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D3]">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-[#686052]">
                        No staff members found matching your search or filters.
                        <button
                          type="button"
                          onClick={() => {
                            setStaffSearchQuery('');
                            setStaffRoleFilter('All');
                            setStaffPayrollFilter('All');
                          }}
                          className="ml-2 text-[#0A4D44] font-semibold underline"
                        >
                          Clear Filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map(staff => (
                      <tr key={staff.id} className="hover:bg-[#F5F0E6] transition-colors">
                        {/* 1. Name & Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#EAE2D3] text-[#0A3630] flex items-center justify-center font-bold text-xs shrink-0 border border-[#D5CBB8]">
                              {staff.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-[#1C2A27]">{staff.name}</p>
                              <div className="flex items-center gap-1.5 text-[11px]">
                                <span className="font-mono text-[#0E6B5E]">Reg #{staff.id}</span>
                                <span className="text-[#857B6E]">·</span>
                                <span className="text-[#686052]">{staff.phone}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Designation & Wing */}
                        <td className="py-3.5 px-3">
                          <p className="font-medium text-[#1C2A27]">{staff.designation}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F5F0E6] text-[#5A5346] border border-[#DDD4C2]">
                            {staff.roleCategory}
                          </span>
                        </td>

                        {/* 3. Shift & Duty Toggle */}
                        <td className="py-3.5 px-3">
                          <p className="text-[11px] font-mono text-[#5A5346]">{staff.shift}</p>
                          <button
                            type="button"
                            onClick={() => handleToggleDutyStatus(staff.id)}
                            title="Click to toggle duty status"
                            className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                              staff.dutyStatus === 'On Duty'
                                ? 'bg-[#EFF5F3] text-[#0A4D44] border-[#9CC5BE]'
                                : staff.dutyStatus === 'Task Assigned'
                                ? 'bg-[#FFF9ED] text-[#9A6B26] border-[#E6C89C]'
                                : 'bg-[#FAF2F2] text-[#8B2626] border-[#E2B4B4]'
                            }`}
                          >
                            ● {staff.dutyStatus} ⇄
                          </button>
                        </td>

                        {/* 4. Assigned Station / Task */}
                        <td className="py-3.5 px-3 max-w-xs">
                          <p className="text-xs text-[#3A3226] line-clamp-2" title={staff.assignedTask}>
                            {staff.assignedTask}
                          </p>
                          <p className="text-[10px] text-[#857B6E] mt-0.5">
                            Zone: {staff.departmentOrZone}
                          </p>
                        </td>

                        {/* 5. Salary Breakdown */}
                        <td className="py-3.5 px-3 text-right font-mono text-[11px] text-[#5A5346] whitespace-nowrap">
                          <span>₹{staff.basicSalary.toLocaleString()}</span>
                          <span className="text-[#0A4D44]"> +₹{staff.allowances.toLocaleString()}</span>
                          <span className="text-[#8B2626]"> -₹{staff.deductions.toLocaleString()}</span>
                        </td>

                        {/* 6. Net Take-Home */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap bg-[#EFF5F3]">
                          <span className="font-bold text-sm text-[#0A3630] font-mono">
                            ₹{staff.netSalary.toLocaleString()}
                          </span>
                        </td>

                        {/* 7. Remittance & UTR */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <p className="font-mono text-[11px] text-[#1C2A27]">{staff.bankAccount}</p>
                          <span className={`inline-block mt-0.5 text-[10px] font-bold ${
                            staff.payrollStatus === 'Disbursed' ? 'text-[#0A4D44]' : 'text-[#8B2626]'
                          }`}>
                            {staff.payrollStatus === 'Disbursed'
                              ? `✓ ${staff.lastPaidDate}`
                              : '⏳ Pending Sanction'}
                          </span>
                        </td>

                        {/* 8. Interactive Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          {staff.payrollStatus === 'Pending' ? (
                            <button
                              type="button"
                              onClick={() => handleDisburseSalary(staff.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white font-medium text-[11px] transition shadow-xs"
                            >
                              Disburse
                            </button>
                          ) : (
                            <span className="px-2 py-1 rounded bg-[#EFF5F3] text-[#0A4D44] font-medium text-[11px] border border-[#9CC5BE]">
                              Paid
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              playUISound('click');
                              setSelectedVoucherStaff(staff);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#1C2A27] font-medium text-[11px] transition"
                          >
                            Pay Slip
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {mgmtTab === 'mgmt-results' && (() => {
        const inspectedRankStu = rankedStudents.find(s => s.id === mgmtInspectedStudent.id) || rankedStudents[0];
        const inspectedAcad = getStudentAcademicSummary(inspectedRankStu.id);
        const inspectedCases = disciplineCases.filter(c => c.studentId === inspectedRankStu.id);

        return (
          <div className="space-y-5">
            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
                  Directorate 360° Student Dossier & Master Result Register
                </p>
                <h1 className="text-lg font-semibold text-[#1C2A27] mt-0.5">
                  Complete Student Details: Marks, Indiscipline Cases, Fee Dues & Report Card
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={mgmtInspectedStudentId}
                  onChange={(e) => { playUISound('click'); setMgmtInspectedStudentId(e.target.value); }}
                  className="px-3 py-2 rounded-lg bg-[#F5F0E6] border border-[#D5CBB8] text-xs font-semibold"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Reg #{s.id} • {s.grade})</option>
                  ))}
                </select>
                <button
                  onClick={() => { playUISound('click'); setPrintingStudentId(inspectedRankStu.id); }}
                  className="px-4 py-2 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <StreamlineIcon name="print" className="w-4 h-4" /> Export {inspectedRankStu.name.split(' ')[0]}’s Report Card PDF
                </button>
              </div>
            </div>

            <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE2D3] pb-4">
                <div className="flex items-center gap-3.5">
                  <UserAvatar id={inspectedRankStu.id} name={inspectedRankStu.name} size="w-14 h-14" />
                  <div>
                    <h2 className="text-base font-semibold text-[#1C2A27]">
                      {inspectedRankStu.name} — Section {inspectedRankStu.grade} (Roll #{inspectedRankStu.rollNo})
                    </h2>
                    <p className="text-xs text-[#686052]">
                      Numeric Reg No: <strong className="font-mono text-[#0A4D44]">#{inspectedRankStu.id}</strong> • {inspectedRankStu.house} • Guardian: <strong className="text-[#1C2A27]">{inspectedRankStu.parentPhone}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    inspectedCases.length > 0 ? 'bg-[#FAF2F2] text-[#8B2626] border-[#E2C9C9]' : 'bg-[#EFF5F3] text-[#0A4D44] border-[#C5D6D1]'
                  }`}>
                    Indiscipline Cases: {inspectedCases.length}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0A3630] text-[#F5F0E6]">
                    Combined Result: {inspectedAcad.combinedOverallPct}% / 100%
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#DDD4C2] rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Student & Numeric Reg No.</th>
                      <th className="py-3.5 px-2.5 text-center">Attendance</th>
                      <th className="py-3.5 px-2.5 text-center">Daily Tests</th>
                      <th className="py-3.5 px-2.5 text-center">Indiscipline</th>
                      <th className="py-3.5 px-2.5 text-center">Fee Due</th>
                      <th className="py-3.5 px-3 text-center bg-[#124E45]">Combined (100%)</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2D3]">
                    {rankedStudents.map(stu => {
                      const acad = getStudentAcademicSummary(stu.id);
                      const stuCasesCount = disciplineCases.filter(c => c.studentId === stu.id).length;
                      return (
                        <tr
                          key={stu.id}
                          className={stu.id === inspectedRankStu.id ? 'bg-[#0A4D44] text-white' : 'hover:bg-[#F5F0E6]'}
                        >
                          <td className={`py-3 px-4 font-semibold whitespace-nowrap ${stu.id === inspectedRankStu.id ? 'text-white' : 'text-[#1C2A27]'}`}>
                            {stu.name} <span className={`font-mono ${stu.id === inspectedRankStu.id ? 'text-emerald-200' : 'text-[#0E6B5E]'}`}>(#{stu.id} • {stu.grade})</span>
                          </td>
                          <td className="py-3 px-2.5 text-center font-medium text-[#0A4D44]">{stu.attendancePct}%</td>
                          <td className="py-3 px-2.5 text-center font-mono">{stu.dailyTestsTaken} ({stu.dailyTestAvgScore}%)</td>
                          <td className="py-3 px-2.5 text-center">
                            <span className={`font-semibold ${stuCasesCount > 0 ? 'text-[#8B2626]' : 'text-[#0A4D44]'}`}>
                              {stuCasesCount} {stuCasesCount === 1 ? 'Case' : 'Cases'}
                            </span>
                          </td>
                          <td className="py-3 px-2.5 text-center whitespace-nowrap">
                            <span className={`font-semibold ${stu.dueFee > 0 ? 'text-[#8B2626]' : 'text-[#0A4D44]'}`}>
                              ₹{stu.dueFee.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-semibold text-[#0A3630] bg-[#EFF5F3]">
                            {acad.combinedOverallPct}%
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => { playUISound('click'); setMgmtInspectedStudentId(stu.id); }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#1C2A27] font-medium text-[11px] transition"
                            >
                              Inspect
                            </button>
                            <button
                              onClick={() => { playUISound('click'); setPrintingStudentId(stu.id); }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] font-medium text-[11px] transition"
                            >
                              PDF Card
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {mgmtTab === 'mgmt-staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#1C2A27]">Faculty Roster & Pure Numeric Reg IDs</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTeacherName.trim() || !newTeacherSubject.trim()) return;
                const created: Teacher = {
                  id: `${900101 + teachers.length}`,
                  name: newTeacherName.trim(),
                  designation: 'Subject Faculty',
                  subject: newTeacherSubject.trim(),
                  classes: ['10-A', '10-B'],
                  status: 'Available',
                  rating: 4.8,
                  email: 'faculty@edunexus.edu.in',
                  onlineStatus: 'Online'
                };
                setTeachers(prev => [...prev, created]);
                setNewTeacherName('');
                setNewTeacherSubject('');
                showToast('Faculty Onboarded', `${created.name} assigned Reg #${created.id}.`, 'success');
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                required
                placeholder="Faculty Name..."
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              />
              <input
                type="text"
                required
                placeholder="Subject..."
                value={newTeacherSubject}
                onChange={(e) => setNewTeacherSubject(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              />
              <button type="submit" className="px-4 py-2 bg-[#0A4D44] text-[#F5F0E6] text-xs font-medium rounded-lg shrink-0">
                Add Faculty
              </button>
            </form>
            <div className="space-y-2">
              {teachers.map(t => (
                <div key={t.id} className="p-3.5 rounded-lg border border-[#E6C89C] bg-[#FFF9ED] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#8A5A19]">{t.name} <span className="font-mono">(#{t.id})</span></p>
                    <p className="text-[11px] text-[#686052]">{t.designation} • {t.subject}</p>
                  </div>
                  <span className="text-xs font-medium text-[#0A4D44]">{t.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#1C2A27]">Student Admissions (Pure Numeric Reg No.)</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newStudentName.trim()) return;
                const nextRegNo = `${20261001 + students.length}`;
                const created: Student = {
                  id: nextRegNo,
                  rollNo: students.length + 1,
                  name: newStudentName.trim(),
                  grade: newStudentGrade,
                  house: 'Agni House',
                  presentDays: 1,
                  totalDays: 1,
                  points: 1000,
                  xpLevel: 6,
                  avatar: newStudentName.trim().slice(0, 2).toUpperCase(),
                  feeStatus: 'Partial Due',
                  totalFee: 65000,
                  paidFee: 30000,
                  dueFee: 35000,
                  lastPaymentDate: 'Today',
                  profileViews: 1,
                  parentPhone: '+91 98765-00000',
                  todayStatus: 'Present',
                  dailyTestsTaken: 1,
                  dailyTestAvgScore: 80,
                  dailyTestTotalQuestionsAnswered: 5,
                  onlineStatus: 'Online',
                  paymentHistory: [
                    { receiptNo: `${890100 + students.length}`, date: 'Today', amount: 30000, mode: 'UPI / QR', InstallmentName: 'Admission Deposit', status: 'Verified' }
                  ]
                };
                setStudents(prev => [...prev, created]);
                setNewStudentName('');
                showToast('Candidate Enrolled', `${created.name} assigned Reg #${created.id}.`, 'success');
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                required
                placeholder="Student Full Name..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              />
              <div className="flex gap-2">
                <select
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(e.target.value)}
                  className="px-3 py-2 text-xs font-medium bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                >
                  {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="submit" className="px-4 py-2 bg-[#0A4D44] text-[#F5F0E6] text-xs font-medium rounded-lg">
                  Enroll
                </button>
              </div>
            </form>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {students.map(s => (
                <div key={s.id} className="p-3 rounded-lg border border-[#EAE2D3] bg-[#F9F6F0] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#1C2A27]">{s.name} ({s.grade})</p>
                    <p className="text-[11px] font-mono text-[#686052]">Reg #{s.id} • Guardian: {s.parentPhone}</p>
                  </div>
                  <button
                    onClick={() => { playUISound('click'); setPrintingStudentId(s.id); }}
                    className="px-2.5 py-1 rounded bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#1C2A27] text-[11px] font-medium"
                  >
                    Transcript
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mgmtTab === 'mgmt-fees' && (
        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#EAE2D3]">
            <h2 className="text-base font-semibold text-[#1C2A27]">Institutional Fee Collection & Arrears Ledger</h2>
            <p className="text-xs text-[#686052]">Record installment payments and review outstanding balances across all 6 sections.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Student & Numeric Reg No.</th>
                  <th className="py-3.5 px-3">Annual Assessment</th>
                  <th className="py-3.5 px-3">Remitted</th>
                  <th className="py-3.5 px-3">Balance Due</th>
                  <th className="py-3.5 px-4 text-right">Ledger Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D3]">
                {students.map(stu => (
                  <tr key={stu.id} className="hover:bg-[#F5F0E6]">
                    <td className="py-3 px-4 font-semibold text-[#1C2A27]">
                      {stu.name} <span className="font-mono text-[#0E6B5E]">(#{stu.id} • {stu.grade})</span>
                    </td>
                    <td className="py-3 px-3">₹{stu.totalFee.toLocaleString()}</td>
                    <td className="py-3 px-3 font-semibold text-[#0A4D44]">₹{stu.paidFee.toLocaleString()}</td>
                    <td className="py-3 px-3 font-semibold text-[#8B2626]">₹{stu.dueFee.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {stu.dueFee > 0 ? (
                        <button
                          onClick={() => handlePayFeeInstallment(stu.id, Math.min(10000, stu.dueFee))}
                          className="px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] font-medium text-[11px]"
                        >
                          Record ₹{Math.min(10000, stu.dueFee).toLocaleString()}
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-[#0A4D44]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mgmtTab === 'mgmt-tribunal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#1C2A27]">
              Faculty-Logged Conduct Cases ({disciplineCases.length})
            </h2>
            {disciplineCases.map(item => (
              <div key={item.id} className="p-4 rounded-lg border border-[#EAE2D3] bg-[#F9F6F0] space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-xs font-semibold text-[#1C2A27]">
                    {item.studentName} (#{item.studentId} • {item.grade})
                  </span>
                  <span className={`text-xs font-semibold ${item.severity === 'Major' ? 'text-[#8B2626]' : 'text-[#9A6B26]'}`}>
                    {item.severity}: {item.category}
                  </span>
                </div>
                <p className="text-xs text-[#4A443B]">"{item.description}"</p>
                <p className="text-[11px] text-[#8A5A19]">
                  Reported by: <strong>{item.reportedBy} (Reg #{item.reportedByRegNo})</strong>
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE2D3]">
                  <span className="text-[11px] text-[#686052]">{item.status}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setDisciplineCases(prev => prev.map(c => c.id === item.id ? { ...c, status: 'Parents Summoned', actionTaken: 'Guardians summoned by Principal Directorate.' } : c));
                        showToast('Guardians Notified', `Summon dispatched for ${item.studentName}.`, 'warning');
                      }}
                      className="px-2.5 py-1 rounded bg-[#EAE2D3] text-[#1C2A27] text-[11px] font-medium"
                    >
                      Summon Guardians
                    </button>
                    <button
                      onClick={() => {
                        setDisciplineCases(prev => prev.map(c => c.id === item.id ? { ...c, status: 'Resolved', actionTaken: 'Closed by Principal Directorate.' } : c));
                        showToast('Case Closed', `${item.id} marked resolved.`, 'success');
                      }}
                      className="px-2.5 py-1 rounded bg-[#0A4D44] text-[#F5F0E6] text-[11px] font-medium"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#1C2A27]">
              Confidential Anti-Ragging & Grievance Submissions
            </h2>
            {whispers.map(w => (
              <div key={w.id} className="p-4 rounded-lg border border-[#EAE2D3] bg-[#F9F6F0] space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#1C2A27]">{w.id} • {w.category}</span>
                  <span className="font-medium text-[#8B2626]">{w.status}</span>
                </div>
                <p className="text-xs text-[#2C3532] bg-[#FFFDF9] p-3 rounded border border-[#EAE2D3]">"{w.message}"</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter official resolution directive..."
                    value={resolutionDrafts[w.id] || ''}
                    onChange={(e) => setResolutionDrafts(prev => ({ ...prev, [w.id]: e.target.value }))}
                    className="flex-1 min-w-0 px-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#D5CBB8] rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const note = resolutionDrafts[w.id] || 'Resolved by Principal Directorate.';
                      setWhispers(prev => prev.map(item => item.id === w.id ? { ...item, status: 'Resolved', resolutionNote: note } : item));
                      showToast(`Report ${w.id} Closed`, note, 'success');
                    }}
                    className="px-3.5 py-1.5 bg-[#0A4D44] text-[#F5F0E6] text-xs font-medium rounded-lg shrink-0"
                  >
                    Close Case
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mgmtTab === 'mgmt-sanitation' && (
        <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
              Infrastructure & Hygiene Log
            </p>
            <h2 className="text-base font-semibold text-[#1C2A27] mt-0.5">
              Washroom, Drinking Water & Facility Maintenance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map(fac => (
              <div key={fac.id} className="p-4 rounded-lg border border-[#EAE2D3] bg-[#F9F6F0] flex items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-semibold text-[#1C2A27]">{fac.area}</h3>
                    <span className={`text-[11px] font-semibold ${
                      fac.status === 'Sparkling Clean' ? 'text-[#0A4D44]' : 'text-[#9A6B26]'
                    }`}>
                      — {fac.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A443B] mt-1">{fac.issue}</p>
                  <p className="text-[10px] text-[#686052] mt-1">Supervisor: {fac.supervisor} • Last Checked: {fac.lastCleaned}</p>
                </div>
                <button
                  onClick={() => {
                    setFacilities(prev => prev.map(f => f.id === fac.id ? { ...f, status: 'Sparkling Clean', lastCleaned: 'Just Now', issue: 'Inspected and verified by Directorate.' } : f));
                    showToast('Inspection Logged', `${fac.area} marked verified.`, 'success');
                  }}
                  className="px-3 py-2 rounded-lg bg-[#0A4D44] text-[#F5F0E6] text-xs font-medium shrink-0"
                >
                  Verify Sanitized
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {mgmtTab === 'mgmt-announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!annTitle.trim() || !annMessage.trim()) return;
              const created: Announcement = {
                id: `ANN-${Date.now()}`,
                title: annTitle.trim(),
                targetClass: annTargetClass,
                postedBy: 'Dr. S. Radhakrishnan',
                facultyRegNo: '100001',
                designation: 'Principal & School Administrator',
                date: 'Just Now',
                priority: annPriority,
                message: annMessage.trim()
              };
              setAnnouncements(prev => [created, ...prev]);
              setAnnTitle('');
              setAnnMessage('');
              showToast('School Announcement Dispatched', `Broadcasted by Dr. S. Radhakrishnan (#100001) to ${annTargetClass}.`, 'success');
            }}
            className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4 h-fit"
          >
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A6B26]">
                School Administrator: Dr. S. Radhakrishnan (Reg #100001)
              </span>
              <h2 className="text-base font-semibold text-[#1C2A27] mt-0.5">Issue Whole-School Administrator Announcement</h2>
            </div>
            <input
              type="text"
              required
              placeholder="Circular subject..."
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={annTargetClass}
                onChange={(e) => setAnnTargetClass(e.target.value)}
                className="px-3 py-2 text-xs font-medium bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              >
                <option value="All Classes">Whole School (All 6 Sections)</option>
                {availableClasses.map(c => <option key={c} value={c}>Section {c} Only</option>)}
              </select>
              <select
                value={annPriority}
                onChange={(e) => setAnnPriority(e.target.value)}
                className="px-3 py-2 text-xs font-medium bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              >
                <option value="Urgent">Urgent</option>
                <option value="Important">Standard</option>
              </select>
            </div>
            <textarea
              rows={3}
              required
              placeholder="Circular body text..."
              value={annMessage}
              onChange={(e) => setAnnMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
            />
            <button type="submit" className="w-full py-2.5 bg-[#0A4D44] text-[#F5F0E6] text-xs font-medium rounded-lg">
              Publish Whole-School Announcement
            </button>
          </form>

          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#1C2A27]">Published Administrator Announcements</h3>
            {announcements.map(a => (
              <div key={a.id} className="p-4 rounded-lg bg-[#F7F3EB] border border-[#E2D9C8] space-y-1.5">
                <div className="flex justify-between text-[11px] text-[#686052]">
                  <span className="font-semibold text-[#0A4D44]">{a.targetClass} • {a.priority}</span>
                  <span>{a.date}</span>
                </div>
                <p className="text-xs font-semibold text-[#1C2A27]">{a.title}</p>
                <p className="text-xs text-[#4A443B]">{a.message}</p>
                <p className="text-[11px] text-[#8A5A19] pt-1 border-t border-[#E2D9C8]">
                  Shared by: <strong>{a.postedBy} (#{a.facultyRegNo})</strong> — {a.designation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {mgmtTab === 'mgmt-calendar' && (
        <SchoolCalendarModule
          calendarEvents={calendarEvents}
          setCalendarEvents={setCalendarEvents}
          currentUserRegNo="100001"
          currentUserName="Dr. S. Radhakrishnan"
          activeRole={activeRole}
          playUISound={playUISound}
          showToast={showToast}
        />
      )}

      {mgmtTab === 'mgmt-leaderboard' && (
        <LeaderboardModule
          activeRole={activeRole}
          rankedStudents={rankedStudents}
          currentStudent={currentStudent}
          availableClasses={availableClasses}
          setPrintingStudentId={setPrintingStudentId}
          playUISound={playUISound}
        />
      )}

      {/* Official Printable Salary Voucher Modal */}
      <SalaryVoucherModal
        staffMember={selectedVoucherStaff}
        onClose={() => setSelectedVoucherStaff(null)}
        playUISound={playUISound}
        showToast={showToast}
        onDisburse={handleDisburseSalary}
      />
    </>
  );
};
