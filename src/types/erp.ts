export type RoleType = 'student' | 'teacher' | 'management';

export type ThemeMode =
  | 'botanical'
  | 'kyoto'
  | 'swiss'
  | 'nordic'
  | 'santorini'
  | 'marrakech'
  | 'oxford'
  | 'slate'
  | 'dark'
  | 'midnight';

export type SoundProfile =
  | 'indian'
  | 'japanese'
  | 'swiss'
  | 'marimba'
  | 'arcade'
  | 'minimal';

export interface FeeTransaction {
  receiptNo: string;
  date: string;
  amount: number;
  mode: 'UPI / QR' | 'NEFT / RTGS' | 'Debit Card' | 'Campus Desk';
  InstallmentName: string;
  status: 'Verified';
}

export interface Student {
  id: string; // Pure numeric registration number e.g. '20261001'
  rollNo: number;
  name: string;
  grade: string;
  house: string;
  presentDays: number;
  totalDays: number;
  points: number;
  xpLevel: number;
  avatar: string;
  feeStatus: string;
  totalFee: number;
  paidFee: number;
  dueFee: number;
  lastPaymentDate: string;
  profileViews: number;
  parentPhone: string;
  todayStatus: string;
  dailyTestsTaken: number;
  dailyTestAvgScore: number; // Out of 100
  dailyTestTotalQuestionsAnswered: number;
  onlineStatus: 'Online' | 'Last seen 4m ago' | 'Last seen 18m ago' | 'Last seen 1h ago' | 'In Class';
  paymentHistory: FeeTransaction[];
}

export interface RankedStudent extends Student {
  rank: number;
  attendancePct: number;
}

export interface Teacher {
  id: string; // Pure numeric registration number e.g. '900101'
  name: string;
  designation: string;
  subject: string;
  classes: string[];
  classTeacherOf?: string;
  status: string;
  rating: number;
  email: string;
  onlineStatus: 'Online' | 'Teaching Live' | 'Last seen 10m ago';
}

export interface TimetablePeriod {
  id: string;
  period: string;
  time: string;
  classGrade: string;
  roomNo: string;
  subject: string;
  teacher: string;
  teacherRegNo: string;
  status: 'Completed' | 'Ongoing' | 'Upcoming';
  teacherPresent: boolean;
  liveTopic: string;
  studentsPresentCount?: number;
}

export interface Announcement {
  id: string;
  title: string;
  targetClass: string;
  postedBy: string; // e.g. 'Dr. A. K. Verma (Principal)'
  facultyRegNo: string;
  designation: string;
  date: string;
  priority: string;
  message: string;
}

export interface TeacherNotice {
  id: string;
  title: string;
  targetClass: string;
  subject: string;
  teacherName: string;
  teacherRegNo: string;
  roleLabel: string; // e.g. 'Class Teacher (10-B)' or 'Subject Faculty'
  time: string;
  message: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  displayDate: string;
  month: string;
  category: 'Gazetted Holiday' | 'Examination' | 'Sports & Cultural' | 'Academic Workshop' | 'PTM';
  description: string;
  isHoliday: boolean;
  rsvpBy: string[]; // student/teacher IDs who registered or set reminder
  personalReminderNote?: Record<string, string>;
}

export interface SubjectMark {
  name: string;
  u1: number;
  u2: number;
  u3: number;
  mid: number;
  final: number;
}

export interface EnrichedSubjectMark extends SubjectMark {
  unitTotalObtained: number;
  unitMaxMarks: number;
  unitPct: number;
  rawSubjectTotalObtained: number; // out of 500 (300 unit + 100 mid + 100 final)
  rawSubjectMaxMarks: number; // 500
  rawSubjectPct: number; // out of 100%
  subjectOverall100: number; // weighted 100%
}

export interface StudentAcademicSummary {
  unit1: number;
  unit2: number;
  unit3: number;
  totalUnitMarksObtained: number;
  totalUnitMaxMarks: number;
  unitAvg: number;
  totalMidtermObtained: number;
  totalMidtermMaxMarks: number;
  midterm: number;
  totalFinalObtained: number;
  totalFinalMaxMarks: number;
  finalExam: number;
  grandTotalObtained: number;
  grandTotalMaxMarks: number;
  rawGrandPct: number;
  combinedOverallPct: number;
  attendance: number;
  predictedFinal: number;
  cbseGrade: string;
  totalIndisciplineCount: number;
  activeIndisciplineCount: number;
  subjectsList: EnrichedSubjectMark[];
}

export interface DisciplineCase {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  reportedBy: string;
  reportedByRegNo: string;
  severity: string;
  category: string;
  description: string;
  xpPenalty: number;
  date: string;
  actionTaken: string;
  status: string;
}

export interface Facility {
  id: string;
  area: string;
  status: string;
  lastCleaned: string;
  supervisor: string;
  issue: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  grade: string;
  uploadedBy: string;
  views: number;
  pages: number;
  content: string;
}

export interface DailyTest {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  durationMin: number;
  proctored: boolean;
  xpReward: number;
  completedBy: string[];
  questions: {
    q: string;
    options: string[];
    correct: number;
  }[];
}

export interface HomeworkTask {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  assignedBy: string;
  dueDate: string;
  xpReward: number;
  completedBy: string[];
  description: string;
}

export interface ChatAttachment {
  type: 'document' | 'audio' | 'video' | 'code' | 'gallery';
  title: string;
  meta: string;
  previewContent?: string;
}

export interface ChatReplyQuote {
  id: string;
  sender: string;
  senderRegNo: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderRegNo: string;
  isFaculty: boolean;
  role: string;
  text: string;
  time: string;
  isPinned?: boolean;
  reactions?: Record<string, string[]>; // emoji -> array of RegNos
  attachment?: ChatAttachment;
  replyTo?: ChatReplyQuote;
  taggedUsers?: string[];
}

export interface StudyGroup {
  id: string;
  name: string;
  category: string;
  members: number;
  messages: ChatMessage[];
}

export interface WhisperReport {
  id: string;
  category: string;
  filedByRole: string;
  urgency: string;
  location?: string;
  message: string;
  timestamp: string;
  status: string;
  resolutionNote: string;
}

export interface LeaveApplication {
  id: string;
  applicantRole: 'student' | 'teacher';
  applicantId: string;
  applicantName: string;
  gradeOrDept: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  proofDocument?: string;
  substituteTeacher?: string;
  status: 'Approved' | 'Pending Review' | 'Conditionally Approved';
  appliedAt: string;
  reviewedBy: string;
}

export interface PeerTutoringPost {
  id: string;
  type: 'offer' | 'request';
  studentId: string;
  studentName: string;
  studentGrade: string;
  studentHouse: string;
  xpLevel: number;
  points: number;
  subject: string;
  topic: string;
  description: string;
  recentUnitAvg: number; // e.g. 95.3%
  recentFinalScore: number; // e.g. 97%
  availability: string;
  mode: 'Library Study Table' | 'Lab Practical Desk' | 'Online Live Doubt Room';
  xpBonus: number;
  status: 'Open' | 'Session Booked' | 'Completed';
  matchedWithName?: string;
  matchedWithRegNo?: string;
  createdAt: string;
}

export interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
}

export type StaffRoleCategory =
  | 'Teacher'
  | 'Cleaner & Sanitation'
  | 'Electrician & Power'
  | 'Maintenance & Technician'
  | 'Management & Admin'
  | 'Security & Transport';

export interface CampusStaffMember {
  id: string;
  name: string;
  roleCategory: StaffRoleCategory;
  designation: string;
  departmentOrZone: string;
  phone: string;
  shift: string;
  dutyStatus: 'On Duty' | 'Task Assigned' | 'On Leave';
  assignedTask: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payrollStatus: 'Disbursed' | 'Pending';
  lastPaidDate: string;
  bankAccount: string;
}

export interface ParentNotificationLog {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  parentPhone: string;
  dueAmount: number;
  channel: 'SMS + WhatsApp + App Push';
  sentBy: string;
  timestamp: string;
  message: string;
}

