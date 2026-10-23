import {
  Student,
  Teacher,
  TimetablePeriod,
  Announcement,
  TeacherNotice,
  SubjectMark,
  DisciplineCase,
  Facility,
  StudyMaterial,
  DailyTest,
  HomeworkTask,
  StudyGroup,
  WhisperReport,
  NavItem,
  CalendarEvent,
  PeerTutoringPost,
  LeaveApplication,
  CampusStaffMember,
  ParentNotificationLog
} from '../types/erp';

// 6 Sections across the school
export const AVAILABLE_CLASSES = ['9-A', '10-A', '10-B', '11-A', '11-B', '12-A'];

// Pure numeric Registration IDs (no letters or special characters)
export const INITIAL_STUDENTS: Student[] = [
  {
    id: '20261001',
    rollNo: 1,
    name: 'Aarav Sharma',
    grade: '10-A',
    house: 'Agni House',
    presentDays: 142,
    totalDays: 150,
    points: 2450,
    xpLevel: 15,
    avatar: 'AS',
    feeStatus: 'Paid',
    totalFee: 65000,
    paidFee: 65000,
    dueFee: 0,
    lastPaymentDate: '12 Aug 2026',
    profileViews: 128,
    parentPhone: '+91 98765-43210',
    todayStatus: 'Present',
    dailyTestsTaken: 28,
    dailyTestAvgScore: 91,
    dailyTestTotalQuestionsAnswered: 140,
    onlineStatus: 'Online',
    paymentHistory: [
      { receiptNo: '880192', date: '10 Apr 2026', amount: 35000, mode: 'NEFT / RTGS', InstallmentName: 'Term 1 Admission & Tuition Fee', status: 'Verified' },
      { receiptNo: '884510', date: '12 Aug 2026', amount: 30000, mode: 'UPI / QR', InstallmentName: 'Term 2 Composite Lab & Tuition Fee', status: 'Verified' }
    ]
  },
  {
    id: '20261002',
    rollNo: 2,
    name: 'Priya Patel',
    grade: '10-A',
    house: 'Jal House',
    presentDays: 148,
    totalDays: 150,
    points: 2680,
    xpLevel: 16,
    avatar: 'PP',
    feeStatus: 'Paid',
    totalFee: 65000,
    paidFee: 65000,
    dueFee: 0,
    lastPaymentDate: '05 Sep 2026',
    profileViews: 194,
    parentPhone: '+91 98765-43211',
    todayStatus: 'Present',
    dailyTestsTaken: 32,
    dailyTestAvgScore: 96,
    dailyTestTotalQuestionsAnswered: 160,
    onlineStatus: 'Online',
    paymentHistory: [
      { receiptNo: '880214', date: '12 Apr 2026', amount: 40000, mode: 'NEFT / RTGS', InstallmentName: 'Term 1 Tuition & Library Fee', status: 'Verified' },
      { receiptNo: '889120', date: '05 Sep 2026', amount: 25000, mode: 'UPI / QR', InstallmentName: 'Term 2 Final Installment', status: 'Verified' }
    ]
  },
  {
    id: '20261003',
    rollNo: 3,
    name: 'Rohan Verma',
    grade: '10-B',
    house: 'Vayu House',
    presentDays: 118,
    totalDays: 150,
    points: 1690,
    xpLevel: 10,
    avatar: 'RV',
    feeStatus: 'Partial Due',
    totalFee: 65000,
    paidFee: 40000,
    dueFee: 25000,
    lastPaymentDate: '10 Jul 2026',
    profileViews: 312,
    parentPhone: '+91 98765-43212',
    todayStatus: 'Absent',
    dailyTestsTaken: 19,
    dailyTestAvgScore: 68,
    dailyTestTotalQuestionsAnswered: 95,
    onlineStatus: 'Online',
    paymentHistory: [
      { receiptNo: '880105', date: '05 Apr 2026', amount: 25000, mode: 'Campus Desk', InstallmentName: 'Quarter 1 Tuition Installment', status: 'Verified' },
      { receiptNo: '883409', date: '10 Jul 2026', amount: 15000, mode: 'UPI / QR', InstallmentName: 'Quarter 2 Tuition & Computer Lab Fee', status: 'Verified' }
    ]
  },
  {
    id: '20261004',
    rollNo: 4,
    name: 'Ananya Gupta',
    grade: '10-A',
    house: 'Prithvi House',
    presentDays: 145,
    totalDays: 150,
    points: 2520,
    xpLevel: 15,
    avatar: 'AG',
    feeStatus: 'Paid',
    totalFee: 65000,
    paidFee: 65000,
    dueFee: 0,
    lastPaymentDate: '18 Aug 2026',
    profileViews: 115,
    parentPhone: '+91 98765-43213',
    todayStatus: 'Present',
    dailyTestsTaken: 30,
    dailyTestAvgScore: 92,
    dailyTestTotalQuestionsAnswered: 150,
    onlineStatus: 'Last seen 4m ago',
    paymentHistory: [
      { receiptNo: '880310', date: '15 Apr 2026', amount: 65000, mode: 'NEFT / RTGS', InstallmentName: 'Full Annual Tuition Settlement', status: 'Verified' }
    ]
  },
  {
    id: '20261005',
    rollNo: 5,
    name: 'Kabir Nair',
    grade: '10-B',
    house: 'Agni House',
    presentDays: 135,
    totalDays: 150,
    points: 2150,
    xpLevel: 13,
    avatar: 'KN',
    feeStatus: 'Partial Due',
    totalFee: 65000,
    paidFee: 50000,
    dueFee: 15000,
    lastPaymentDate: '01 Sep 2026',
    profileViews: 98,
    parentPhone: '+91 98765-43214',
    todayStatus: 'Present',
    dailyTestsTaken: 24,
    dailyTestAvgScore: 81,
    dailyTestTotalQuestionsAnswered: 120,
    onlineStatus: 'In Class',
    paymentHistory: [
      { receiptNo: '880901', date: '18 Apr 2026', amount: 30000, mode: 'Debit Card', InstallmentName: 'Term 1 Tuition Fee', status: 'Verified' },
      { receiptNo: '887812', date: '01 Sep 2026', amount: 20000, mode: 'UPI / QR', InstallmentName: 'Term 2 Part Payment', status: 'Verified' }
    ]
  },
  {
    id: '20261006',
    rollNo: 6,
    name: 'Zoya Khan',
    grade: '10-A',
    house: 'Jal House',
    presentDays: 149,
    totalDays: 150,
    points: 2790,
    xpLevel: 17,
    avatar: 'ZK',
    feeStatus: 'Paid',
    totalFee: 65000,
    paidFee: 65000,
    dueFee: 0,
    lastPaymentDate: '14 Aug 2026',
    profileViews: 240,
    parentPhone: '+91 98765-43215',
    todayStatus: 'Present',
    dailyTestsTaken: 34,
    dailyTestAvgScore: 98,
    dailyTestTotalQuestionsAnswered: 170,
    onlineStatus: 'Online',
    paymentHistory: [
      { receiptNo: '880411', date: '14 Aug 2026', amount: 65000, mode: 'NEFT / RTGS', InstallmentName: 'Annual Composite Tuition Fee', status: 'Verified' }
    ]
  },
  {
    id: '20261007',
    rollNo: 7,
    name: 'Devansh Joshi',
    grade: '10-B',
    house: 'Vayu House',
    presentDays: 110,
    totalDays: 150,
    points: 1420,
    xpLevel: 8,
    avatar: 'DJ',
    feeStatus: 'Overdue',
    totalFee: 65000,
    paidFee: 20000,
    dueFee: 45000,
    lastPaymentDate: '15 Apr 2026',
    profileViews: 410,
    parentPhone: '+91 98765-43216',
    todayStatus: 'Absent',
    dailyTestsTaken: 14,
    dailyTestAvgScore: 59,
    dailyTestTotalQuestionsAnswered: 70,
    onlineStatus: 'Last seen 1h ago',
    paymentHistory: [
      { receiptNo: '880199', date: '15 Apr 2026', amount: 20000, mode: 'Campus Desk', InstallmentName: 'Initial Admission Deposit', status: 'Verified' }
    ]
  },
  {
    id: '20261008',
    rollNo: 8,
    name: 'Meera Iyer',
    grade: '11-A',
    house: 'Prithvi House',
    presentDays: 140,
    totalDays: 150,
    points: 2310,
    xpLevel: 14,
    avatar: 'MI',
    feeStatus: 'Paid',
    totalFee: 72000,
    paidFee: 72000,
    dueFee: 0,
    lastPaymentDate: '20 Aug 2026',
    profileViews: 132,
    parentPhone: '+91 98765-43217',
    todayStatus: 'Present',
    dailyTestsTaken: 27,
    dailyTestAvgScore: 88,
    dailyTestTotalQuestionsAnswered: 135,
    onlineStatus: 'Online',
    paymentHistory: [
      { receiptNo: '885122', date: '20 Aug 2026', amount: 72000, mode: 'NEFT / RTGS', InstallmentName: 'Senior Wing Science Stream Annual Fee', status: 'Verified' }
    ]
  },
  {
    id: '20261009',
    rollNo: 9,
    name: 'Arjun Mehta',
    grade: '11-B',
    house: 'Agni House',
    presentDays: 138,
    totalDays: 150,
    points: 2200,
    xpLevel: 13,
    avatar: 'AM',
    feeStatus: 'Partial Due',
    totalFee: 72000,
    paidFee: 52000,
    dueFee: 20000,
    lastPaymentDate: '11 Aug 2026',
    profileViews: 109,
    parentPhone: '+91 98765-43218',
    todayStatus: 'Present',
    dailyTestsTaken: 25,
    dailyTestAvgScore: 84,
    dailyTestTotalQuestionsAnswered: 125,
    onlineStatus: 'Last seen 18m ago',
    paymentHistory: [
      { receiptNo: '884009', date: '11 Aug 2026', amount: 52000, mode: 'UPI / QR', InstallmentName: 'Term 1 & 2 Senior Tuition Fee', status: 'Verified' }
    ]
  },
  {
    id: '20261010',
    rollNo: 10,
    name: 'Ishaan Choudhary',
    grade: '12-A',
    house: 'Jal House',
    presentDays: 144,
    totalDays: 150,
    points: 2490,
    xpLevel: 15,
    avatar: 'IC',
    feeStatus: 'Paid',
    totalFee: 75000,
    paidFee: 75000,
    dueFee: 0,
    lastPaymentDate: '02 Sep 2026',
    profileViews: 164,
    parentPhone: '+91 98765-43219',
    todayStatus: 'Present',
    dailyTestsTaken: 31,
    dailyTestAvgScore: 93,
    dailyTestTotalQuestionsAnswered: 155,
    onlineStatus: 'Online',
    paymentHistory: [
      { receiptNo: '888201', date: '02 Sep 2026', amount: 75000, mode: 'NEFT / RTGS', InstallmentName: 'Class 12 Board & Lab Annual Fee', status: 'Verified' }
    ]
  },
  {
    id: '20261011',
    rollNo: 11,
    name: 'Sanya Malhotra',
    grade: '9-A',
    house: 'Prithvi House',
    presentDays: 146,
    totalDays: 150,
    points: 2390,
    xpLevel: 14,
    avatar: 'SM',
    feeStatus: 'Paid',
    totalFee: 60000,
    paidFee: 60000,
    dueFee: 0,
    lastPaymentDate: '09 Sep 2026',
    profileViews: 118,
    parentPhone: '+91 98765-43220',
    todayStatus: 'Present',
    dailyTestsTaken: 29,
    dailyTestAvgScore: 89,
    dailyTestTotalQuestionsAnswered: 145,
    onlineStatus: 'Online',
    paymentHistory: [
      { receiptNo: '889500', date: '09 Sep 2026', amount: 60000, mode: 'UPI / QR', InstallmentName: 'Class 9 Annual Tuition Fee', status: 'Verified' }
    ]
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  { id: '900101', name: 'Dr. Vikram Sethi', designation: 'HOD Physics & Class Teacher (10-A)', subject: 'Physics & Mathematics', classes: ['10-A', '10-B', '11-A'], classTeacherOf: '10-A', status: 'Teaching Live', rating: 4.9, email: 'v.sethi@edunexus.edu.in', onlineStatus: 'Teaching Live' },
  { id: '900102', name: 'Ms. Sunita Rao', designation: 'Senior AI Faculty & Class Teacher (10-B)', subject: 'Computer Science & AI', classes: ['9-A', '10-A', '10-B', '11-B'], classTeacherOf: '10-B', status: 'Teaching Live', rating: 4.8, email: 's.rao@edunexus.edu.in', onlineStatus: 'Online' },
  { id: '900103', name: 'Mr. Rajesh Khanna', designation: 'Senior Humanities Faculty & Class Teacher (9-A)', subject: 'Social Studies & History', classes: ['9-A', '10-A', '10-B'], classTeacherOf: '9-A', status: 'Staff Room', rating: 4.7, email: 'r.khanna@edunexus.edu.in', onlineStatus: 'Last seen 10m ago' },
  { id: '900104', name: 'Mrs. Clara Dsouza', designation: 'HOD English & Class Teacher (12-A)', subject: 'English Literature', classes: ['10-A', '11-A', '11-B', '12-A'], classTeacherOf: '12-A', status: 'Teaching Live', rating: 4.9, email: 'c.dsouza@edunexus.edu.in', onlineStatus: 'Online' },
  { id: '900105', name: 'Dr. Anirudh Kulkarni', designation: 'Senior Chemistry Faculty & Class Teacher (11-A)', subject: 'Organic & Physical Chemistry', classes: ['11-A', '11-B', '12-A'], classTeacherOf: '11-A', status: 'Teaching Live', rating: 4.8, email: 'a.kulkarni@edunexus.edu.in', onlineStatus: 'Teaching Live' }
];

// 6 Classes with Live Ongoing Statuses across the school
export const INITIAL_TIMETABLE: TimetablePeriod[] = [
  { id: 'PER-1', period: 'Period 1', time: '08:30 - 09:20 AM', classGrade: '10-A', roomNo: 'Room 201', subject: 'Mathematics', teacher: 'Dr. Vikram Sethi', teacherRegNo: '900101', status: 'Completed', teacherPresent: true, liveTopic: 'Quadratic Equations: Completing the Square Method', studentsPresentCount: 32 },
  { id: 'PER-2', period: 'Period 2 (LIVE)', time: '09:20 - 10:10 AM', classGrade: '10-A', roomNo: 'AI Lab 1', subject: 'Computer Science & AI', teacher: 'Ms. Sunita Rao', teacherRegNo: '900102', status: 'Ongoing', teacherPresent: true, liveTopic: 'Python Lists, Slicing & Bubble Sort Live Coding', studentsPresentCount: 33 },
  { id: 'PER-3', period: 'Period 3', time: '10:10 - 11:00 AM', classGrade: '10-A', roomNo: 'Room 201', subject: 'Social Studies & Civics', teacher: 'Mr. Rajesh Khanna', teacherRegNo: '900103', status: 'Upcoming', teacherPresent: false, liveTopic: 'Federalism & Centre-State Relations' },
  { id: 'PER-4', period: 'Period 4', time: '11:20 - 12:10 PM', classGrade: '10-A', roomNo: 'Room 201', subject: 'English Literature', teacher: 'Mrs. Clara Dsouza', teacherRegNo: '900104', status: 'Upcoming', teacherPresent: false, liveTopic: 'First Flight: Nelson Mandela Long Walk to Freedom' },

  { id: 'PER-5', period: 'Period 1', time: '08:30 - 09:20 AM', classGrade: '10-B', roomNo: 'Room 204', subject: 'Science (Physics)', teacher: 'Dr. Vikram Sethi', teacherRegNo: '900101', status: 'Completed', teacherPresent: true, liveTopic: 'Light: Reflection & Spherical Mirrors Ray Diagrams', studentsPresentCount: 29 },
  { id: 'PER-6', period: 'Period 2 (LIVE)', time: '09:20 - 10:10 AM', classGrade: '10-B', roomNo: 'Room 204', subject: 'Mathematics (NCERT)', teacher: 'Dr. Vikram Sethi', teacherRegNo: '900101', status: 'Ongoing', teacherPresent: true, liveTopic: 'Arithmetic Progressions: Nth Term & Sum Numericals', studentsPresentCount: 30 },
  { id: 'PER-7', period: 'Period 3', time: '10:10 - 11:00 AM', classGrade: '10-B', roomNo: 'AI Lab 2', subject: 'Computer Science & AI', teacher: 'Ms. Sunita Rao', teacherRegNo: '900102', status: 'Upcoming', teacherPresent: true, liveTopic: 'Database Management & SQL Queries Intro' },
  { id: 'PER-8', period: 'Period 4', time: '11:20 - 12:10 PM', classGrade: '10-B', roomNo: 'Room 204', subject: 'Social Studies & History', teacher: 'Mr. Rajesh Khanna', teacherRegNo: '900103', status: 'Upcoming', teacherPresent: false, liveTopic: 'Nationalism in Europe & French Revolution' },

  { id: 'PER-9', period: 'Period 2 (LIVE)', time: '09:20 - 10:10 AM', classGrade: '9-A', roomNo: 'Room 102', subject: 'Social Studies & History', teacher: 'Mr. Rajesh Khanna', teacherRegNo: '900103', status: 'Ongoing', teacherPresent: false, liveTopic: '', studentsPresentCount: 34 },
  { id: 'PER-10', period: 'Period 2 (LIVE)', time: '09:20 - 10:10 AM', classGrade: '11-A', roomNo: 'Chem Lab', subject: 'Organic Chemistry', teacher: 'Dr. Anirudh Kulkarni', teacherRegNo: '900105', status: 'Ongoing', teacherPresent: true, liveTopic: 'Hybridization, VSEPR Theory & Molecular Orbital Diagrams', studentsPresentCount: 28 },
  { id: 'PER-11', period: 'Period 2 (LIVE)', time: '09:20 - 10:10 AM', classGrade: '11-B', roomNo: 'Room 303', subject: 'English Core', teacher: 'Mrs. Clara Dsouza', teacherRegNo: '900104', status: 'Ongoing', teacherPresent: true, liveTopic: 'Hornbill Prose & Formal Letter to the Editor Drafting', studentsPresentCount: 31 },
  { id: 'PER-12', period: 'Period 2 (LIVE)', time: '09:20 - 10:10 AM', classGrade: '12-A', roomNo: 'Physics Lab', subject: 'Electrostatics & Optics', teacher: 'Dr. Vikram Sethi', teacherRegNo: '900101', status: 'Ongoing', teacherPresent: true, liveTopic: 'Gauss’s Law Applications & Capacitor Dielectrics', studentsPresentCount: 30 }
];

// School-wide Official Announcements by School Administrator / Principal Directorate
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-1',
    title: 'Half-Yearly Midterm Exam Date Sheet & Hall Ticket Directive',
    targetClass: 'All Classes',
    postedBy: 'Dr. S. Radhakrishnan',
    facultyRegNo: '100001',
    designation: 'Principal & School Administrator',
    date: 'Today, 08:00 AM',
    priority: 'Urgent',
    message: 'Midterm examinations for Classes 9 to 12 will commence from November 2nd. All students must clear pending tuition dues to download their official barcoded Hall Tickets.'
  },
  {
    id: 'ANN-2',
    title: 'Diwali & Autumn Break Official Campus Closure Notice',
    targetClass: 'All Classes',
    postedBy: 'Prof. Meenakshi Sundaram',
    facultyRegNo: '100002',
    designation: 'Vice Principal & Controller of Administration',
    date: 'Yesterday, 04:30 PM',
    priority: 'Important',
    message: 'The school campus will remain closed from October 29th to November 1st on account of Diwali celebrations. Extra board revision classes for Class 10 & 12 will run online.'
  },
  {
    id: 'ANN-3',
    title: 'Annual Inter-House Sports Meet & Olympiads Registration',
    targetClass: 'All Classes',
    postedBy: 'Dr. S. Radhakrishnan',
    facultyRegNo: '100001',
    designation: 'Principal & School Administrator',
    date: '14 Oct 2026',
    priority: 'Important',
    message: 'Students from Agni, Jal, Vayu, and Prithvi Houses can register for track events, chess, and robotics in the Yearly Calendar portal.'
  }
];

// Class-Specific Notices by Class Teachers & Subject Faculty
export const INITIAL_TEACHER_NOTICES: TeacherNotice[] = [
  {
    id: 'NTC-1',
    title: 'Bring Graph Notebooks & Geometry Box Tomorrow for Ex 4.3',
    targetClass: '10-A',
    subject: 'Mathematics',
    teacherName: 'Dr. Vikram Sethi',
    teacherRegNo: '900101',
    roleLabel: 'Class Teacher (10-A)',
    time: '10 mins ago',
    message: 'All Class 10-A students must bring 2 millimeter graph sheets and geometry boxes for plotting quadratic parabolas during Period 1.'
  },
  {
    id: 'NTC-2',
    title: 'Python Practical File & SQL Record Submission Deadline',
    targetClass: '10-B',
    subject: 'Computer Science & AI',
    teacherName: 'Ms. Sunita Rao',
    teacherRegNo: '900102',
    roleLabel: 'Class Teacher (10-B)',
    time: '45 mins ago',
    message: 'Submit your hardbound practical file with 15 Python programs and 5 SQL queries by Friday. Late submissions will forfeit 5 internal marks.'
  },
  {
    id: 'NTC-3',
    title: 'Class 10-B Parent-Teacher Attendance Review Alert',
    targetClass: '10-B',
    subject: 'Class Administration',
    teacherName: 'Ms. Sunita Rao',
    teacherRegNo: '900102',
    roleLabel: 'Class Teacher (10-B)',
    time: '2 hours ago',
    message: 'Students with attendance below 80% must submit a signed parent undertaking letter to me during zero period tomorrow.'
  },
  {
    id: 'NTC-4',
    title: 'History Map Work Test on Indian National Congress Sessions',
    targetClass: '10-A',
    subject: 'Social Studies & History',
    teacherName: 'Mr. Rajesh Khanna',
    teacherRegNo: '900103',
    roleLabel: 'Subject Faculty',
    time: '3 hours ago',
    message: 'Revise all INC session locations (Calcutta, Nagpur, Madras, Lahore) for tomorrow’s 10-minute political map test.'
  },
  {
    id: 'NTC-5',
    title: 'Salt Analysis & Titration Lab Coat Mandatory',
    targetClass: '11-A',
    subject: 'Organic & Physical Chemistry',
    teacherName: 'Dr. Anirudh Kulkarni',
    teacherRegNo: '900105',
    roleLabel: 'Class Teacher (11-A)',
    time: 'Yesterday',
    message: 'No student will be permitted inside the Chemistry Wet Lab without a cotton lab coat and safety goggles.'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'CAL-101',
    title: 'Gandhi Jayanti National Holiday',
    date: '2026-10-02',
    displayDate: '02 Oct 2026',
    month: 'October',
    category: 'Gazetted Holiday',
    description: 'Campus closed in observance of Mahatma Gandhi Jayanti. Cleanliness drive essay submission open online.',
    isHoliday: true,
    rsvpBy: ['20261001', '20261002', '20261003']
  },
  {
    id: 'CAL-102',
    title: 'ISRO Space & Robotics Inter-School Hackathon',
    date: '2026-10-22',
    displayDate: '22 Oct 2026',
    month: 'October',
    category: 'Academic Workshop',
    description: 'Live rover prototype demonstration and Python AI challenge in the Auditorium. +200 Merit XP for participants.',
    isHoliday: false,
    rsvpBy: ['20261001', '20261002', '20261006']
  },
  {
    id: 'CAL-103',
    title: 'Dussehra / Vijayadashami Festival Break',
    date: '2026-10-20',
    displayDate: '20 Oct 2026',
    month: 'October',
    category: 'Gazetted Holiday',
    description: 'School closed for Vijayadashami festival.',
    isHoliday: true,
    rsvpBy: ['20261003']
  },
  {
    id: 'CAL-104',
    title: 'Diwali & Govardhan Puja Vacation',
    date: '2026-10-29',
    displayDate: '29 Oct – 01 Nov 2026',
    month: 'October',
    category: 'Gazetted Holiday',
    description: '4-day festival vacation. Campus reopens on November 2nd for Midterm Examinations.',
    isHoliday: true,
    rsvpBy: ['20261001', '20261003', '20261005']
  },
  {
    id: 'CAL-105',
    title: 'Half-Yearly Midterm Examinations Commence',
    date: '2026-11-02',
    displayDate: '02 Nov – 14 Nov 2026',
    month: 'November',
    category: 'Examination',
    description: 'Morning shift 08:30 AM to 11:30 AM. Reporting time 08:00 AM sharp with barcoded Admit Card.',
    isHoliday: false,
    rsvpBy: ['20261001', '20261002', '20261003', '20261004', '20261006']
  },
  {
    id: 'CAL-106',
    title: 'Children’s Day Cultural Fest & Fete',
    date: '2026-11-14',
    displayDate: '14 Nov 2026',
    month: 'November',
    category: 'Sports & Cultural',
    description: 'Inter-House music, debate, and student food stalls on the main sports ground.',
    isHoliday: false,
    rsvpBy: ['20261002', '20261003']
  },
  {
    id: 'CAL-107',
    title: 'Guru Nanak Jayanti Holiday',
    date: '2026-11-24',
    displayDate: '24 Nov 2026',
    month: 'November',
    category: 'Gazetted Holiday',
    description: 'Gazetted holiday on account of Guru Nanak Gurpurab.',
    isHoliday: true,
    rsvpBy: []
  },
  {
    id: 'CAL-108',
    title: 'Midterm Result Declaration & Parent-Teacher Conclave (PTM)',
    date: '2026-12-05',
    displayDate: '05 Dec 2026',
    month: 'December',
    category: 'PTM',
    description: 'Mandatory one-on-one parent interaction with Class Teachers to review answer scripts and attendance.',
    isHoliday: false,
    rsvpBy: ['20261001', '20261003']
  },
  {
    id: 'CAL-109',
    title: 'Annual Winter Sports Meet & House Championship',
    date: '2026-12-18',
    displayDate: '18 Dec – 20 Dec 2026',
    month: 'December',
    category: 'Sports & Cultural',
    description: '400m relay, cricket finals, basketball, and march-past trophy between Agni, Jal, Vayu, and Prithvi Houses.',
    isHoliday: false,
    rsvpBy: ['20261003', '20261005']
  },
  {
    id: 'CAL-110',
    title: 'Christmas & Winter Vacation',
    date: '2026-12-25',
    displayDate: '25 Dec – 03 Jan 2027',
    month: 'December',
    category: 'Gazetted Holiday',
    description: 'Winter break for all classes. Pre-Board practicals for Class 10 & 12 begin Jan 5th.',
    isHoliday: true,
    rsvpBy: []
  },
  {
    id: 'CAL-111',
    title: 'Republic Day Parade & Flag Unfurling',
    date: '2027-01-26',
    displayDate: '26 Jan 2027',
    month: 'January',
    category: 'Sports & Cultural',
    description: '78th Republic Day celebration at 08:00 AM followed by NCC parade and merit scholarship distribution.',
    isHoliday: true,
    rsvpBy: ['20261001', '20261006']
  },
  {
    id: 'CAL-112',
    title: 'CBSE / ICSE Annual Final Board & Term Examinations',
    date: '2027-02-15',
    displayDate: '15 Feb – 10 Mar 2027',
    month: 'February',
    category: 'Examination',
    description: 'Final Term Examinations for all sections. 50% weightage towards overall promotion transcript.',
    isHoliday: false,
    rsvpBy: ['20261001', '20261002', '20261003', '20261010']
  }
];

export const SUBJECT_NAMES = [
  'Mathematics (NCERT)',
  'Science (Physics & Chem)',
  'Computer Science & AI',
  'Social Studies & History',
  'English Literature'
];

export const buildSubjectMarks = (
  baseU1: number,
  baseU2: number,
  baseU3: number,
  baseMid: number,
  baseFinal: number
): SubjectMark[] => [
  { name: 'Mathematics (NCERT)', u1: baseU1, u2: baseU2, u3: baseU3, mid: baseMid, final: baseFinal },
  { name: 'Science (Physics & Chem)', u1: Math.max(35, baseU1 - 3), u2: baseU2, u3: Math.max(35, baseU3 - 2), mid: Math.max(35, baseMid - 2), final: Math.max(35, baseFinal - 1) },
  { name: 'Computer Science & AI', u1: Math.min(100, baseU1 + 4), u2: Math.min(100, baseU2 + 3), u3: Math.min(100, baseU3 + 2), mid: Math.min(100, baseMid + 3), final: Math.min(100, baseFinal + 3) },
  { name: 'Social Studies & History', u1: Math.max(35, baseU1 - 4), u2: Math.max(35, baseU2 - 2), u3: baseU3, mid: Math.max(35, baseMid - 3), final: Math.max(35, baseFinal - 2) },
  { name: 'English Literature', u1: Math.min(100, baseU1 + 2), u2: Math.max(35, baseU2 - 1), u3: Math.min(100, baseU3 + 1), mid: baseMid, final: Math.min(100, baseFinal + 1) }
];

export const INITIAL_EXAM_RECORDS: Record<string, { subjects: SubjectMark[] }> = {
  '20261001': { subjects: buildSubjectMarks(88, 92, 86, 89, 91) },
  '20261002': { subjects: buildSubjectMarks(95, 98, 94, 96, 97) },
  '20261003': { subjects: buildSubjectMarks(62, 68, 65, 64, 67) },
  '20261004': { subjects: buildSubjectMarks(90, 88, 92, 91, 90) },
  '20261005': { subjects: buildSubjectMarks(78, 82, 80, 81, 83) },
  '20261006': { subjects: buildSubjectMarks(96, 95, 98, 97, 98) },
  '20261007': { subjects: buildSubjectMarks(52, 58, 54, 55, 58) },
  '20261008': { subjects: buildSubjectMarks(85, 84, 89, 86, 88) },
  '20261009': { subjects: buildSubjectMarks(82, 85, 84, 83, 86) },
  '20261010': { subjects: buildSubjectMarks(91, 93, 90, 92, 94) },
  '20261011': { subjects: buildSubjectMarks(86, 88, 85, 87, 89) }
};

export const INITIAL_DISCIPLINE_CASES: DisciplineCase[] = [
  {
    id: 'DSC-501',
    studentId: '20261003',
    studentName: 'Rohan Verma',
    grade: '10-B',
    reportedBy: 'Dr. Vikram Sethi',
    reportedByRegNo: '900101',
    severity: 'Minor',
    category: 'Watching Movies / Non-Academic Screen',
    description: 'Student was caught watching an action movie on his tablet hidden behind the NCERT textbook during Physics ray-diagram lecture.',
    xpPenalty: -100,
    date: '15 Oct, 11:20 AM',
    actionTaken: 'Tablet confiscated for 24 hrs; warning issued on Student Portal.',
    status: 'Active on Record'
  },
  {
    id: 'DSC-502',
    studentId: '20261003',
    studentName: 'Rohan Verma',
    grade: '10-B',
    reportedBy: 'Ms. Sunita Rao',
    reportedByRegNo: '900102',
    severity: 'Minor',
    category: 'Late Arrival After Recess & Uniform Violation',
    description: 'Entered Computer Lab 18 minutes late after lunch break without school blazer and ID lanyard.',
    xpPenalty: -75,
    date: '10 Oct, 01:25 PM',
    actionTaken: 'Detention in library after dispersal; diary note signed by Class Teacher.',
    status: 'Active on Record'
  },
  {
    id: 'DSC-503',
    studentId: '20261007',
    studentName: 'Devansh Joshi',
    grade: '10-B',
    reportedBy: 'Ms. Sunita Rao',
    reportedByRegNo: '900102',
    severity: 'Major',
    category: 'Using Mobile Phone & Classroom Disruption',
    description: 'Using smartphone with loud audio in the back bench and disturbing the entire section during Python practicals.',
    xpPenalty: -250,
    date: '16 Oct, 01:05 PM',
    actionTaken: 'Parents summoned by Principal; phone deposited at Management Desk.',
    status: 'Escalated to Management'
  },
  {
    id: 'DSC-504',
    studentId: '20261007',
    studentName: 'Devansh Joshi',
    grade: '10-B',
    reportedBy: 'Dr. Anirudh Kulkarni',
    reportedByRegNo: '900105',
    severity: 'Major',
    category: 'Lab Equipment Mishandling & Safety Breach',
    description: 'Mixed concentrated reagents without permission in the Chemistry lab, causing fumes and glass beaker breakage.',
    xpPenalty: -300,
    date: '14 Oct, 09:50 AM',
    actionTaken: 'Lab fine ₹800 imposed; suspended from practical lab for 1 week.',
    status: 'Escalated to Management'
  },
  {
    id: 'DSC-505',
    studentId: '20261005',
    studentName: 'Kabir Nair',
    grade: '10-B',
    reportedBy: 'Mr. Rajesh Khanna',
    reportedByRegNo: '900103',
    severity: 'Minor',
    category: 'Incomplete History Map Notebook & Bunking',
    description: 'Found loitering near the sports ground during 3rd period instead of attending History map work lecture.',
    xpPenalty: -100,
    date: '13 Oct, 10:30 AM',
    actionTaken: 'Counseling by Class Teacher; extra assignment assigned.',
    status: 'Active on Record'
  },
  {
    id: 'DSC-506',
    studentId: '20261001',
    studentName: 'Aarav Sharma',
    grade: '10-A',
    reportedBy: 'Mr. Rajesh Khanna',
    reportedByRegNo: '900103',
    severity: 'Minor',
    category: 'Disturbing Classroom / Talking Loudly',
    description: 'Talking loudly with benchmates during Civics group presentation.',
    xpPenalty: -50,
    date: '12 Oct, 10:15 AM',
    actionTaken: 'Verbal counseling completed.',
    status: 'Resolved'
  },
  {
    id: 'DSC-507',
    studentId: '20261009',
    studentName: 'Arjun Mehta',
    grade: '11-B',
    reportedBy: 'Mrs. Clara Dsouza',
    reportedByRegNo: '900104',
    severity: 'Minor',
    category: 'Unauthorized Smart-Watch During Unit Test',
    description: 'Wore a Bluetooth-enabled smartwatch inside the examination hall during English Unit Test 2.',
    xpPenalty: -150,
    date: '08 Oct, 09:10 AM',
    actionTaken: 'Watch confiscated and returned to parents.',
    status: 'Resolved'
  }
];

export const INITIAL_FACILITIES: Facility[] = [
  { id: 'FAC-01', area: 'Ground Floor Boys Washroom & Toilets', status: 'Needs Cleaning', lastCleaned: '07:30 AM', supervisor: 'Ramesh Kumar', issue: 'Soap dispenser empty & wet floor reported by Class 10 students' },
  { id: 'FAC-02', area: '1st Floor Girls Washroom & Sanitation', status: 'Sparkling Clean', lastCleaned: '10:45 AM', supervisor: 'Sunita Devi', issue: 'All cubicles sanitized & stocked' },
  { id: 'FAC-03', area: '2nd Floor Chemistry Lab Water Cooler', status: 'Repair Assigned', lastCleaned: 'Yesterday', supervisor: 'Mohan Lal (Plumber)', issue: 'Cooling compressor warm & tap leaking' },
  { id: 'FAC-04', area: 'Senior Wing (Class 11/12) Boys Toilet', status: 'Sparkling Clean', lastCleaned: '11:00 AM', supervisor: 'Ramesh Kumar', issue: 'Routine exhaust fan & hygiene check passed' }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  { id: 'MAT-1', title: 'NCERT Class 10 Quadratic Equations Mind-Map & Formulae', subject: 'Mathematics (NCERT)', grade: '10-A', uploadedBy: 'Dr. Vikram Sethi', views: 342, pages: 14, content: 'Key Formula: x = [-b ± √(b² - 4ac)] / 2a. Discriminant D = b² - 4ac. If D > 0: Two distinct real roots. If D = 0: Two equal real roots. If D < 0: No real roots.' },
  { id: 'MAT-2', title: 'Trigonometric Identities & Heights/Distances Solved Bank', subject: 'Mathematics (NCERT)', grade: '10-B', uploadedBy: 'Dr. Vikram Sethi', views: 276, pages: 19, content: 'Pythagorean Identities: sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ. Angle of elevation equals angle of depression by alternate interior angles.' },
  { id: 'MAT-3', title: 'Ray Optics, Snell’s Law & Mirror/Lens Numericals Manual', subject: 'Science (Physics & Chem)', grade: '10-B', uploadedBy: 'Dr. Vikram Sethi', views: 395, pages: 16, content: 'Snell’s Law: n₁ sin(θ₁) = n₂ sin(θ₂). Mirror Formula: 1/v + 1/u = 1/f. Lens Formula: 1/v - 1/u = 1/f. Power of Lens P = 1/f (in metres) measured in Dioptres (D).' },
  { id: 'MAT-4', title: 'Acids, Bases, Salts & pH Titration Reaction Sheet', subject: 'Science (Physics & Chem)', grade: '10-B', uploadedBy: 'Dr. Vikram Sethi', views: 312, pages: 12, content: 'Neutralization: Acid + Base → Salt + Water (ΔH < 0). pH = -log₁₀[H⁺]. Bleaching Powder: CaOCl₂; Baking Soda: NaHCO₃; Washing Soda: Na₂CO₃·10H₂O; Plaster of Paris: CaSO₄·½H₂O.' },
  { id: 'MAT-5', title: 'Python & Sorting Algorithms Visual Handbook (CBSE Code 402)', subject: 'Computer Science & AI', grade: '10-A', uploadedBy: 'Ms. Sunita Rao', views: 289, pages: 22, content: 'Bubble Sort compares adjacent elements and swaps them if they are in the wrong order. Time Complexity: O(n²) worst case, O(n) best case when already sorted.' },
  { id: 'MAT-6', title: 'SQL Joins, Aggregate Queries & AI Neural Network Notes', subject: 'Computer Science & AI', grade: '10-B', uploadedBy: 'Ms. Sunita Rao', views: 244, pages: 15, content: 'SQL Clause Order: SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY. HAVING filters grouped rows whereas WHERE filters individual rows before grouping.' },
  { id: 'MAT-7', title: 'Indian National Movement (1915–1947) Timeline & Map Work', subject: 'Social Studies & History', grade: '10-B', uploadedBy: 'Mr. Rajesh Khanna', views: 418, pages: 18, content: '1915: Mahatma Gandhi returns to India. 1917: Champaran Satyagraha (Bihar). 1920: Non-Cooperation Movement. 1930: Dandi Salt March. 1942: Quit India Movement.' },
  { id: 'MAT-8', title: 'Federalism, Parliamentary Democracy & Constitutional Rights', subject: 'Social Studies & History', grade: '10-A', uploadedBy: 'Mr. Rajesh Khanna', views: 230, pages: 14, content: 'Seventh Schedule of Indian Constitution divides legislative powers into Union List (97 subjects), State List (66 subjects), and Concurrent List (47 subjects).' },
  { id: 'MAT-9', title: 'First Flight Poetic Devices, Themes & Character Sketches', subject: 'English Literature', grade: '10-B', uploadedBy: 'Mrs. Clara Dsouza', views: 305, pages: 20, content: 'Covers Dust of Snow, Fire and Ice (Robert Frost), A Letter to God (G.L. Fuentes), and Nelson Mandela: Long Walk to Freedom with CBSE marking-scheme value points.' },
  { id: 'MAT-10', title: 'Formal Letter Writing, Analytical Paragraph & Grammar Rules', subject: 'English Literature', grade: '10-A', uploadedBy: 'Mrs. Clara Dsouza', views: 268, pages: 11, content: 'Subject-Verb Agreement, Reported Speech tense backshifting rules, and 5-paragraph structure for formal Editor & Inquiry letters.' }
];

export const INITIAL_DAILY_TESTS: DailyTest[] = [
  {
    id: 'TST-101',
    title: 'Daily AI & Data Structures Proctored Quiz',
    subject: 'Computer Science',
    targetClass: '10-A',
    durationMin: 10,
    proctored: true,
    xpReward: 120,
    completedBy: ['20261002'],
    questions: [
      { q: 'Which data structure follows the LIFO (Last In First Out) principle?', options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'], correct: 1 },
      { q: 'What is the worst-case time complexity of Binary Search on a sorted array?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correct: 2 },
      { q: 'In Python, which keyword is used to define a function?', options: ['func', 'define', 'def', 'lambda'], correct: 2 }
    ]
  },
  {
    id: 'TST-102',
    title: 'Trigonometry & Quadratic Roots Sprint',
    subject: 'Mathematics',
    targetClass: '10-B',
    durationMin: 15,
    proctored: true,
    xpReward: 150,
    completedBy: ['20261006'],
    questions: [
      { q: 'What is the exact value of sin²(30°) + cos²(30°)?', options: ['0', '0.5', '1', '2'], correct: 2 },
      { q: 'If the discriminant (b² - 4ac) of a quadratic equation is zero, the roots are:', options: ['Real and distinct', 'Real and equal', 'Imaginary', 'None of these'], correct: 1 },
      { q: 'What is the value of tan(45°)?', options: ['0', '1', '√3', '1/√3'], correct: 1 }
    ]
  }
];

export const INITIAL_TASKS: HomeworkTask[] = [
  {
    id: 'TSK-1',
    title: 'NCERT Ex 4.2 Quadratic Equations Graph Plotting',
    subject: 'Mathematics',
    targetClass: '10-A',
    assignedBy: 'Dr. Vikram Sethi',
    dueDate: 'Tomorrow, 5:00 PM',
    xpReward: 150,
    completedBy: ['20261002', '20261006'],
    description: 'Solve all 6 questions in your fair notebook and verify roots graphically.'
  },
  {
    id: 'TSK-2',
    title: 'Write Python Program for Palindrome & Armstrong Numbers',
    subject: 'Computer Science',
    targetClass: '10-B',
    assignedBy: 'Ms. Sunita Rao',
    dueDate: 'Oct 20, 11:59 PM',
    xpReward: 200,
    completedBy: ['20261001', '20261002', '20261004', '20261006'],
    description: 'Submit clean code with proper comments and sample outputs.'
  }
];

export const BANNED_SLANG_WORDS = [
  'stupid', 'idiot', 'dumb', 'noob', 'loser', 'trash', 'shut up', 'shutup',
  'hate', 'ugly', 'fool', 'moron', 'suck', 'sucks', 'wtf', 'lmao', 'stfu',
  'pathetic', 'garbage', 'useless', 'crap', 'hell', 'damn', 'jerk', 'pagal', 'bewakoof', 'gadha'
];

export const INITIAL_GROUPS: StudyGroup[] = [
  {
    id: 'GRP-1',
    name: 'Class 10 Board Exam Doubt Forum',
    category: 'Academic',
    members: 34,
    messages: [
      {
        id: 'm1',
        sender: 'Ms. Sunita Rao',
        senderRegNo: '900102',
        isFaculty: true,
        role: 'Class Teacher (10-B) • AI Faculty',
        text: 'Namaste students! I have pinned the new Python Revision Handbook and Bubble Sort code snippet below. Tag me or @Dr. Vikram Sethi if you have any doubts.',
        time: '09:15 AM',
        isPinned: true,
        reactions: { '👍': ['20261001', '20261002', '20261003'], '🔥': ['20261006'] },
        attachment: {
          type: 'code',
          title: 'bubble_sort_revision.py',
          meta: 'Python 3.11 • 12 Lines',
          previewContent: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr`
        }
      },
      {
        id: 'm2',
        sender: 'Aarav Sharma',
        senderRegNo: '20261001',
        isFaculty: false,
        role: 'Student (10-A)',
        text: 'Thank you @Ms. Sunita Rao Ma’am! Revising the sorting complexity right now with @Priya Patel.',
        time: '09:18 AM',
        isPinned: false,
        reactions: { '❤️': ['900102', '20261002'] },
        taggedUsers: ['Ms. Sunita Rao', 'Priya Patel']
      },
      {
        id: 'm3',
        sender: 'Dr. Vikram Sethi',
        senderRegNo: '900101',
        isFaculty: true,
        role: 'HOD Physics & Class Teacher (10-A)',
        text: 'I have also attached the Quadratic Discriminant Formula Sheet PDF. Make sure everyone solves Ex 4.3 before tomorrow’s class.',
        time: '09:24 AM',
        isPinned: true,
        reactions: { '🎯': ['20261001', '20261004'], '👏': ['20261003'] },
        attachment: {
          type: 'document',
          title: 'NCERT_Quadratic_Equations_Formula_Sheet.pdf',
          meta: 'PDF Document • 1.4 MB • Verified by HOD'
        }
      }
    ]
  },
  {
    id: 'GRP-2',
    name: 'ISRO Space & Robotics Club',
    category: 'Club',
    members: 26,
    messages: [
      {
        id: 'm4',
        sender: 'Priya Patel',
        senderRegNo: '20261002',
        isFaculty: false,
        role: 'Student (10-A)',
        text: 'Our Chandrayaan rover ultrasonic sensor calibration video is ready for the October 22nd exhibition!',
        time: '10:05 AM',
        isPinned: true,
        reactions: { '🚀': ['20261001', '20261006', '900101'] },
        attachment: {
          type: 'video',
          title: 'Rover_Obstacle_Avoidance_Test_Run.mp4',
          meta: 'MP4 Video • 01:45 • 1080p HD'
        }
      }
    ]
  }
];

export const INITIAL_WHISPERS: WhisperReport[] = [
  {
    id: 'CMP-901',
    category: 'Anti-Ragging & Bullying Alert',
    filedByRole: 'Anonymous Student',
    urgency: 'Critical',
    message: 'Two senior students near the cycle stand were ragging juniors during recess. Please deploy PT teacher near Gate 2.',
    timestamp: '1 hour ago',
    status: 'Escalated',
    resolutionNote: 'PT Teacher deployed at Gate 2; CCTV footage checked by Principal.'
  },
  {
    id: 'CMP-902',
    category: 'Parent / Teacher / Study Issue',
    filedByRole: 'Parent of Class 10-B Student',
    urgency: 'High',
    message: 'Physics numericals syllabus is moving very fast. Requesting 2 extra doubt-clearing classes before Midterms.',
    timestamp: '3 hours ago',
    status: 'Pending',
    resolutionNote: ''
  },
  {
    id: 'CMP-903',
    category: 'Toilet, Bathroom & Hygiene',
    filedByRole: 'Anonymous Student',
    urgency: 'High',
    message: 'Ground floor boys toilet tap is broken and water is logging near the washbasin.',
    timestamp: '5 hours ago',
    status: 'Pending',
    resolutionNote: ''
  }
];

export const WORD_PUZZLES = [
  {
    id: 'WP-1',
    category: 'Physics • Optics',
    answer: 'REFRACTION',
    tiles: ['R', 'E', 'F', 'R', 'A', 'C', 'T', 'I', 'O', 'N'],
    clue: 'Bending of a light wave when it enters a medium where its speed is different (Snell’s Law).',
    xp: 120
  },
  {
    id: 'WP-2',
    category: 'Computer Science • Python',
    answer: 'ALGORITHM',
    tiles: ['A', 'L', 'G', 'O', 'R', 'I', 'T', 'H', 'M'],
    clue: 'A finite step-by-step logical procedure used for solving a computational problem.',
    xp: 120
  },
  {
    id: 'WP-3',
    category: 'Mathematics • Geometry',
    answer: 'HYPOTENUSE',
    tiles: ['H', 'Y', 'P', 'O', 'T', 'E', 'N', 'U', 'S', 'E'],
    clue: 'The longest side of a right-angled triangle, opposite the right angle (a² + b² = c²).',
    xp: 140
  },
  {
    id: 'WP-4',
    category: 'Social Studies • Civics',
    answer: 'PARLIAMENT',
    tiles: ['P', 'A', 'R', 'L', 'I', 'A', 'M', 'E', 'N', 'T'],
    clue: 'Supreme legislative body of the Republic of India comprising Lok Sabha and Rajya Sabha.',
    xp: 110
  }
];

export const MATCHING_CHALLENGES = [
  { pairId: 'm1', leftLabel: 'Ohm’s Electrical Law', rightLabel: 'V = I × R (Voltage = Current × Resistance)' },
  { pairId: 'm2', leftLabel: 'Quadratic Discriminant', rightLabel: 'D = b² - 4ac (Nature of Roots)' },
  { pairId: 'm3', leftLabel: 'Newton’s Second Law', rightLabel: 'F = m × a (Force = Mass × Acceleration)' },
  { pairId: 'm4', leftLabel: 'Binary Search Complexity', rightLabel: 'O(log n) Logarithmic Time' },
  { pairId: 'm5', leftLabel: 'Photosynthesis Catalyst', rightLabel: 'Chlorophyll + Sunlight (6CO₂ + 6H₂O)' }
];

export const FILL_BLANKS_CHALLENGES = [
  {
    id: 'FB-1',
    subject: 'Computer Science (Python)',
    title: 'Binary Search Midpoint & Loop Condition',
    sentenceParts: [
      'In Python Binary Search, we repeat while low <= ',
      ', calculate mid = (low + high) ',
      ' 2, and if arr[mid] < target we update low = ',
      '.'
    ],
    answers: ['high', '//', 'mid + 1'],
    wordBank: ['high', '//', 'mid + 1', '%', 'low - 1', 'break'],
    xp: 150
  },
  {
    id: 'FB-2',
    subject: 'Physics & Chemistry',
    title: 'Refraction & Chemical Conservation Law',
    sentenceParts: [
      'According to Snell’s Law, the ratio of sin(i) to ',
      ' is constant, and Total Internal Reflection occurs when light travels from a ',
      ' medium to a rarer medium above the ',
      ' angle.'
    ],
    answers: ['sin(r)', 'denser', 'critical'],
    wordBank: ['sin(r)', 'denser', 'critical', 'tan(i)', 'vacuum', 'focal'],
    xp: 150
  }
];

export const INITIAL_PEER_TUTORING_POSTS: PeerTutoringPost[] = [
  {
    id: 'TUT-101',
    type: 'offer',
    studentId: '20261006',
    studentName: 'Zoya Khan',
    studentGrade: '10-A',
    studentHouse: 'Jal House',
    xpLevel: 17,
    points: 2790,
    subject: 'Computer Science & AI',
    topic: 'Python Lists, Slicing, Bubble Sort & SQL Joins',
    description: 'I scored 100/100 in Unit Tests and Final Practicals. Happy to mentor any Class 10 student struggling with dry-running sorting loops or SQL group-by queries.',
    recentUnitAvg: 98.7,
    recentFinalScore: 100,
    availability: 'Today, 02:15 PM – 03:00 PM',
    mode: 'Lab Practical Desk',
    xpBonus: 120,
    status: 'Open',
    createdAt: '20 mins ago'
  },
  {
    id: 'TUT-102',
    type: 'offer',
    studentId: '20261002',
    studentName: 'Priya Patel',
    studentGrade: '10-A',
    studentHouse: 'Jal House',
    xpLevel: 16,
    points: 2680,
    subject: 'Mathematics (NCERT)',
    topic: 'Quadratic Equations (Completing the Square) & Trigonometry Proofs',
    description: 'Offering 1-on-1 step-by-step NCERT Ex 4.3 & 8.4 problem-solving session before the Midterm exams.',
    recentUnitAvg: 95.7,
    recentFinalScore: 97,
    availability: 'Tomorrow, Free Period 4',
    mode: 'Library Study Table',
    xpBonus: 110,
    status: 'Open',
    createdAt: '1 hour ago'
  },
  {
    id: 'TUT-103',
    type: 'offer',
    studentId: '20261010',
    studentName: 'Ishaan Choudhary',
    studentGrade: '12-A',
    studentHouse: 'Jal House',
    xpLevel: 15,
    points: 2490,
    subject: 'Science (Physics & Chem)',
    topic: 'Ray Optics Numericals, Sign Convention & Chemical Balancing',
    description: 'Senior Wing Physics mentor available to help Class 9, 10 & 11 students master mirror/lens formulas and numerical sign conventions.',
    recentUnitAvg: 91.3,
    recentFinalScore: 94,
    availability: 'Daily, 04:30 PM – 05:15 PM',
    mode: 'Online Live Doubt Room',
    xpBonus: 130,
    status: 'Open',
    createdAt: '2 hours ago'
  },
  {
    id: 'TUT-104',
    type: 'request',
    studentId: '20261005',
    studentName: 'Kabir Nair',
    studentGrade: '10-B',
    studentHouse: 'Agni House',
    xpLevel: 13,
    points: 2150,
    subject: 'Mathematics (NCERT)',
    topic: 'Need Help with Arithmetic Progressions Word Problems (Ex 5.3)',
    description: 'Looking for a peer tutor who scored 90%+ in Maths to help me understand Sn formula word problems for tomorrow’s test.',
    recentUnitAvg: 80.0,
    recentFinalScore: 83,
    availability: 'Today, 05:00 PM',
    mode: 'Online Live Doubt Room',
    xpBonus: 100,
    status: 'Open',
    createdAt: '35 mins ago'
  },
  {
    id: 'TUT-105',
    type: 'request',
    studentId: '20261007',
    studentName: 'Devansh Joshi',
    studentGrade: '10-B',
    studentHouse: 'Vayu House',
    xpLevel: 8,
    points: 1420,
    subject: 'Science (Physics & Chem)',
    topic: 'Need Urgent Help with Concave Mirror Ray Diagrams & Snell’s Law',
    description: 'Missed 2 lab lectures and need a classmate or senior mentor to walk me through the 6 ray diagram cases.',
    recentUnitAvg: 54.7,
    recentFinalScore: 58,
    availability: 'Tomorrow, Library Recess',
    mode: 'Library Study Table',
    xpBonus: 140,
    status: 'Open',
    createdAt: '3 hours ago'
  }
];

export const SQUARE_WORD_RIDDLES = [
  {
    id: 'SQR-1',
    title: 'Acids, Bases & Salts Matrix',
    category: 'Class 10 Chemistry • Square Grid Riddle',
    xp: 180,
    grid: [
      ['A', 'C', 'I', 'D', 'P', 'H', 'S', 'O'],
      ['L', 'I', 'T', 'M', 'U', 'S', 'A', 'X'],
      ['K', 'B', 'A', 'S', 'E', 'R', 'L', 'I'],
      ['A', 'N', 'I', 'O', 'N', 'T', 'T', 'D'],
      ['L', 'P', 'R', 'O', 'T', 'O', 'N', 'E'],
      ['I', 'C', 'A', 'T', 'I', 'O', 'N', 'S'],
      ['M', 'O', 'L', 'A', 'R', 'K', 'P', 'H'],
      ['B', 'U', 'F', 'F', 'E', 'R', 'Z', 'N']
    ],
    targetWords: [
      { word: 'LITMUS', clue: 'Natural dye extracted from lichen used as an acid-base indicator', cells: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]] },
      { word: 'ALKALI', clue: 'A water-soluble base that yields hydroxide (OH⁻) ions', cells: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]] },
      { word: 'PROTON', clue: 'H⁺ ion donated by an acid according to Brønsted-Lowry theory', cells: [[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]] },
      { word: 'CATION', clue: 'Positively charged ion migrating to the cathode during electrolysis', cells: [[5,1],[5,2],[5,3],[5,4],[5,5],[5,6]] },
      { word: 'BUFFER', clue: 'Solution that resists changes in pH when small quantities of acid or alkali are added', cells: [[7,0],[7,1],[7,2],[7,3],[7,4],[7,5]] },
      { word: 'SALT', clue: 'Ionic compound formed by the neutralization reaction of an acid and a base', cells: [[0,6],[1,6],[2,6],[3,6]] }
    ]
  },
  {
    id: 'SQR-2',
    title: 'Optics & Electromagnetism Square Box',
    category: 'Class 10 Physics • Square Grid Riddle',
    xp: 200,
    grid: [
      ['P', 'R', 'I', 'S', 'M', 'L', 'E', 'N'],
      ['H', 'E', 'F', 'O', 'C', 'U', 'S', 'S'],
      ['O', 'T', 'A', 'M', 'P', 'E', 'R', 'E'],
      ['T', 'I', 'M', 'I', 'R', 'R', 'O', 'R'],
      ['O', 'N', 'P', 'D', 'I', 'O', 'D', 'E'],
      ['N', 'A', 'E', 'J', 'O', 'U', 'L', 'E'],
      ['O', 'H', 'M', 'W', 'A', 'T', 'T', 'S'],
      ['F', 'L', 'U', 'X', 'V', 'O', 'L', 'T']
    ],
    targetWords: [
      { word: 'PRISM', clue: 'Transparent optical element with flat polished surfaces that disperses white light', cells: [[0,0],[0,1],[0,2],[0,3],[0,4]] },
      { word: 'RETINA', clue: 'Light-sensitive inner layer of the eye where real and inverted image is formed', cells: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]] },
      { word: 'MIRROR', clue: 'Polished surface reflecting light rays according to angle i = angle r', cells: [[3,2],[3,3],[3,4],[3,5],[3,6],[3,7]] },
      { word: 'AMPERE', clue: 'SI unit of electric current equal to one coulomb per second', cells: [[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]] },
      { word: 'JOULE', clue: 'SI unit of work and heat energy (H = I²Rt)', cells: [[5,3],[5,4],[5,5],[5,6],[5,7]] },
      { word: 'PHOTON', clue: 'Elementary quantum packet of electromagnetic radiation', cells: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]] }
    ]
  }
];

export const CHEM_NUMERICAL_CHALLENGES = [
  {
    id: 'CN-1',
    topic: 'pH Calculation from [H⁺] Concentration',
    problem: 'Find the pH of a 0.001 M Hydrochloric Acid (HCl) aqueous solution (where [H⁺] = 10⁻³ mol/L).',
    formula: 'pH = -log₁₀[H⁺]',
    givenData: '[H⁺] = 1.0 × 10⁻³ M (Complete dissociation)',
    unit: 'pH',
    correctAnswer: 3,
    xp: 80
  },
  {
    id: 'CN-2',
    topic: 'pOH & pH of Strong Alkali (NaOH)',
    problem: 'Calculate the pH of a 0.01 M Sodium Hydroxide (NaOH) solution at 298 K (given pH + pOH = 14).',
    formula: 'pOH = -log₁₀[OH⁻], pH = 14 - pOH',
    givenData: '[OH⁻] = 1.0 × 10⁻² M → pOH = 2',
    unit: 'pH',
    correctAnswer: 12,
    xp: 90
  },
  {
    id: 'CN-3',
    topic: 'Neutralization Titration (M₁V₁ = M₂V₂)',
    problem: 'What volume (in mL) of 0.5 M NaOH is required to completely neutralize 25 mL of 1.0 M HCl?',
    formula: 'M₁ × V₁ (Acid) = M₂ × V₂ (Base)',
    givenData: 'M₁ = 1.0 M, V₁ = 25 mL, M₂ = 0.5 M',
    unit: 'mL',
    correctAnswer: 50,
    xp: 100
  },
  {
    id: 'CN-4',
    topic: 'Molarity of Sodium Carbonate Salt Solution',
    problem: 'Calculate the Molarity (M) when 2 moles of Na₂CO₃ salt are dissolved to make 4 Litres of solution.',
    formula: 'Molarity (M) = Moles of Solute (n) / Volume in Litres (V)',
    givenData: 'n = 2.0 mol, V = 4.0 L',
    unit: 'mol/L',
    correctAnswer: 0.5,
    xp: 80
  },
  {
    id: 'CN-5',
    topic: 'Water of Crystallization in Washing Soda',
    problem: 'How many molecules of water of crystallization are present in one formula unit of Washing Soda (Na₂CO₃·xH₂O)?',
    formula: 'Na₂CO₃ + 10H₂O → Na₂CO₃·10H₂O',
    givenData: 'Recrystallization of Sodium Carbonate',
    unit: 'H₂O units',
    correctAnswer: 10,
    xp: 80
  },
  {
    id: 'CN-6',
    topic: 'Molecular Mass of Baking Soda (NaHCO₃)',
    problem: 'Calculate the formula unit mass (in u) of Sodium Hydrogen Carbonate (NaHCO₃).',
    formula: 'Mass = Na (23) + H (1) + C (12) + 3 × O (16)',
    givenData: 'Atomic masses: Na=23, H=1, C=12, O=16',
    unit: 'g/mol',
    correctAnswer: 84,
    xp: 100
  }
];

export const INITIAL_LEAVE_APPLICATIONS: LeaveApplication[] = [
  {
    id: 'LVE-2041',
    applicantRole: 'student',
    applicantId: '20261003',
    applicantName: 'Rohan Sharma',
    gradeOrDept: '10-B',
    leaveType: 'Medical / Illness Leave',
    fromDate: '2026-10-12',
    toDate: '2026-10-14',
    totalDays: 3,
    reason: 'Diagnosed with seasonal viral fever; physician advised 3 days complete bed rest.',
    proofDocument: 'Apollo_Clinic_Medical_Certificate_Oct12.pdf',
    status: 'Approved',
    appliedAt: '11 Oct 2026, 08:15 AM',
    reviewedBy: 'Ms. Sunita Rao (#900102 • Class Teacher 10-B)'
  },
  {
    id: 'LVE-2049',
    applicantRole: 'student',
    applicantId: '20261003',
    applicantName: 'Rohan Sharma',
    gradeOrDept: '10-B',
    leaveType: 'Sports / Olympiad Duty Leave',
    fromDate: '2026-10-22',
    toDate: '2026-10-23',
    totalDays: 2,
    reason: 'Representing EduNexus Vidya Mandir at the Regional Zonal Robotics & Coding Championship.',
    proofDocument: 'Zonal_Olympiad_Nomination_Slip.pdf',
    status: 'Approved',
    appliedAt: '16 Oct 2026, 04:30 PM',
    reviewedBy: 'Dr. S. Radhakrishnan (#100001 • Principal)'
  },
  {
    id: 'LVE-9012',
    applicantRole: 'teacher',
    applicantId: '900102',
    applicantName: 'Ms. Sunita Rao',
    gradeOrDept: 'Computer Science & AI (Class Teacher 10-B)',
    leaveType: 'Academic Duty / CBSE Board Workshop',
    fromDate: '2026-10-26',
    toDate: '2026-10-27',
    totalDays: 2,
    reason: 'Attending CBSE Regional AI Curriculum & Practical Examiner Orientation Seminar in New Delhi.',
    proofDocument: 'CBSE_Examiner_Deputation_Order.pdf',
    substituteTeacher: 'Dr. Rajeshwari Iyer (#900101)',
    status: 'Approved',
    appliedAt: '15 Oct 2026, 11:20 AM',
    reviewedBy: 'Dr. S. Radhakrishnan (#100001 • Principal Directorate)'
  }
];

export const STUDENT_NAV_ITEMS: NavItem[] = [
  { id: 'stu-overview', label: 'Student Dashboard', shortLabel: 'Dashboard', icon: 'dashboard' },
  { id: 'stu-achievements', label: 'Achievements & Milestones', shortLabel: 'Badges', icon: 'trophy' },
  { id: 'stu-arcade', label: 'NCERT Formulas & Periodic Table', shortLabel: 'Formulas', icon: 'flask' },
  { id: 'stu-readiness', label: 'Exam Readiness Hub', shortLabel: 'Readiness', icon: 'transcript' },
  { id: 'stu-calendar', label: 'Yearly Calendar & Planner', shortLabel: 'Calendar', icon: 'clock' },
  { id: 'stu-results', label: 'Marks & Report Card', shortLabel: 'Marks', icon: 'gradebook' },
  { id: 'stu-tutoring', label: 'Peer Tutoring Hub', shortLabel: 'Tutoring', icon: 'tutoring' },
  { id: 'stu-conduct', label: 'Conduct Chronicle', shortLabel: 'Conduct', icon: 'gavel' },
  { id: 'stu-notices', label: 'Notices & Announcements', shortLabel: 'Notices', icon: 'megaphone' },
  { id: 'stu-learning', label: 'Study Vault & Tests', shortLabel: 'Vault', icon: 'vault' },
  { id: 'stu-fees', label: 'Tuition & Receipts', shortLabel: 'Fees', icon: 'wallet' },
  { id: 'stu-leaderboard', label: 'Leaderboard', shortLabel: 'Leaderboard', icon: 'trophy' },
  { id: 'stu-chat', label: 'Study Channels', shortLabel: 'Channels', icon: 'chat' },
  { id: 'stu-whisper', label: 'Leave & Confidential Desk', shortLabel: 'Leave/Desk', icon: 'shield' }
];

export const TEACHER_NAV_ITEMS: NavItem[] = [
  { id: 'tch-classroom', label: 'Teacher Command & Schedule', shortLabel: 'Command', icon: 'clock' },
  { id: 'tch-attendance', label: 'Attendance & Parent Alerts', shortLabel: 'Roll Call', icon: 'attendance' },
  { id: 'tch-marks', label: 'Gradebook & Marks Entry', shortLabel: 'Marks', icon: 'gradebook' },
  { id: 'tch-discipline', label: 'Conduct & Discipline Log', shortLabel: 'Conduct', icon: 'gavel' },
  { id: 'tch-notices', label: 'Teacher Notices & Homework', shortLabel: 'Publish', icon: 'megaphone' },
  { id: 'tch-calendar', label: 'Academic Calendar', shortLabel: 'Calendar', icon: 'dashboard' },
  { id: 'tch-leaderboard', label: 'Student Leaderboard', shortLabel: 'Leaderboard', icon: 'trophy' },
  { id: 'tch-chat', label: 'Teacher & Class Chat', shortLabel: 'Chat', icon: 'chat' },
  { id: 'tch-whisper', label: 'Teacher Leave & Salary Slip', shortLabel: 'Leave/Pay', icon: 'shield' }
];

export const MGMT_NAV_ITEMS: NavItem[] = [
  { id: 'mgmt-command', label: 'Admin Command & Overview', shortLabel: 'Command', icon: 'dashboard' },
  { id: 'mgmt-payroll', label: 'Payroll & All Staff HR', shortLabel: 'Payroll', icon: 'wallet' },
  { id: 'mgmt-fees', label: 'Student Dues & Parent Alerts', shortLabel: 'Fee Dues', icon: 'wallet' },
  { id: 'mgmt-sanitation', label: 'Cleaners, Electricity & Techs', shortLabel: 'Operations', icon: 'sanitation' },
  { id: 'mgmt-staff', label: 'Teachers & Admissions', shortLabel: 'Roster', icon: 'roster' },
  { id: 'mgmt-results', label: 'Master Transcripts', shortLabel: 'Results', icon: 'transcript' },
  { id: 'mgmt-tribunal', label: 'Conduct Tribunal', shortLabel: 'Tribunal', icon: 'gavel' },
  { id: 'mgmt-announcements', label: 'School Circulars', shortLabel: 'Broadcast', icon: 'megaphone' },
  { id: 'mgmt-calendar', label: 'Master Calendar', shortLabel: 'Calendar', icon: 'clock' },
  { id: 'mgmt-leaderboard', label: 'Leaderboard', shortLabel: 'Leaderboard', icon: 'trophy' }
];

export const INITIAL_CAMPUS_STAFF: CampusStaffMember[] = [
  // 1. TEACHERS
  {
    id: '900101',
    name: 'Dr. Vikram Sethi',
    roleCategory: 'Teacher',
    designation: 'Senior Physics & Math Teacher (HOD)',
    departmentOrZone: 'Science & Mathematics Wing (10-A, 10-B)',
    phone: '+91 98119-64210',
    shift: '07:30 AM – 02:30 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Period 2 Live Lecture (10-B Ray Optics & Numericals)',
    basicSalary: 58000,
    allowances: 14500,
    deductions: 4000,
    netSalary: 68500,
    payrollStatus: 'Disbursed',
    lastPaidDate: '01 Oct 2026 (UTR #884120)',
    bankAccount: 'SBI •••• 4821'
  },
  {
    id: '900102',
    name: 'Ms. Sunita Rao',
    roleCategory: 'Teacher',
    designation: 'Class Teacher (10-B) & CS/AI Teacher',
    departmentOrZone: 'AI & Computer Lab Block (10-A, 10-B)',
    phone: '+91 98114-52090',
    shift: '07:30 AM – 02:30 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Class 10-B Roll Call & Python SQL Practical Evaluation',
    basicSalary: 52000,
    allowances: 12000,
    deductions: 3500,
    netSalary: 60500,
    payrollStatus: 'Disbursed',
    lastPaidDate: '01 Oct 2026 (UTR #884121)',
    bankAccount: 'HDFC •••• 9104'
  },
  {
    id: '900103',
    name: 'Mr. Rajesh Khanna',
    roleCategory: 'Teacher',
    designation: 'Senior Social Studies & History Teacher',
    departmentOrZone: 'Humanities Block (9-A, 10-B)',
    phone: '+91 98118-77340',
    shift: '07:30 AM – 02:30 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Class 10 Board Map Work & Civics Assessment',
    basicSalary: 49000,
    allowances: 11000,
    deductions: 3200,
    netSalary: 56800,
    payrollStatus: 'Pending',
    lastPaidDate: '01 Sep 2026',
    bankAccount: 'ICICI •••• 3319'
  },
  {
    id: '900104',
    name: 'Mrs. Clara Dsouza',
    roleCategory: 'Teacher',
    designation: 'English Literature & Debate Teacher',
    departmentOrZone: 'Languages & Auditorium Wing (10-A, 11-B)',
    phone: '+91 98112-88410',
    shift: '07:30 AM – 02:30 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'First Flight Poetry Evaluation & Morning Assembly Script',
    basicSalary: 48000,
    allowances: 10500,
    deductions: 3000,
    netSalary: 55500,
    payrollStatus: 'Disbursed',
    lastPaidDate: '01 Oct 2026 (UTR #884124)',
    bankAccount: 'Axis •••• 7742'
  },
  {
    id: '900105',
    name: 'Dr. Anirudh Kulkarni',
    roleCategory: 'Teacher',
    designation: 'Senior Chemistry & Lab Teacher',
    departmentOrZone: '2nd Floor Chemistry Wet Lab (10-B, 12-A)',
    phone: '+91 98116-39021',
    shift: '07:30 AM – 02:30 PM',
    dutyStatus: 'Task Assigned',
    assignedTask: 'Titration Burette Calibration & Reagent Stock Audit',
    basicSalary: 56000,
    allowances: 13500,
    deductions: 3800,
    netSalary: 65700,
    payrollStatus: 'Pending',
    lastPaidDate: '01 Sep 2026',
    bankAccount: 'SBI •••• 6190'
  },

  // 2. CLEANERS & SANITATION STAFF
  {
    id: '700101',
    name: 'Ramesh Kumar',
    roleCategory: 'Cleaner & Sanitation',
    designation: 'Head Sanitation & Hygiene Supervisor',
    departmentOrZone: 'Ground & Senior Wing Boys Washrooms',
    phone: '+91 99104-22180',
    shift: '06:30 AM – 02:30 PM',
    dutyStatus: 'Task Assigned',
    assignedTask: 'Sanitize Ground Floor Boys Washroom & Refill Liquid Soap Dispensers',
    basicSalary: 18500,
    allowances: 3500,
    deductions: 1200,
    netSalary: 20800,
    payrollStatus: 'Disbursed',
    lastPaidDate: '01 Oct 2026 (UTR #884201)',
    bankAccount: 'PNB •••• 1128'
  },
  {
    id: '700102',
    name: 'Sunita Devi',
    roleCategory: 'Cleaner & Sanitation',
    designation: 'Senior Sanitation Attendant (Girls Wing)',
    departmentOrZone: '1st & 2nd Floor Girls Washrooms & Infirmary',
    phone: '+91 99108-55412',
    shift: '06:30 AM – 02:30 PM',
    dutyStatus: 'On Duty',
    assignedTask: '1st Floor Girls Washroom Disinfection & Corridor Mopping Completed',
    basicSalary: 17500,
    allowances: 3200,
    deductions: 1100,
    netSalary: 19600,
    payrollStatus: 'Pending',
    lastPaidDate: '01 Sep 2026',
    bankAccount: 'SBI •••• 8430'
  },
  {
    id: '700103',
    name: 'Kamlesh Paswan',
    roleCategory: 'Cleaner & Sanitation',
    designation: 'Campus Grounds & Classroom Sweeper',
    departmentOrZone: 'Assembly Courtyard, Canteen & Academic Block A',
    phone: '+91 99102-67390',
    shift: '06:00 AM – 02:00 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Post-Recess Canteen & Sports Turf Waste Clearance',
    basicSalary: 16500,
    allowances: 2800,
    deductions: 1000,
    netSalary: 18300,
    payrollStatus: 'Pending',
    lastPaidDate: '01 Sep 2026',
    bankAccount: 'BOB •••• 5521'
  },

  // 3. ELECTRICITY & POWER GRID TECHNICIANS
  {
    id: '700201',
    name: 'Rajeshwar Mistri',
    roleCategory: 'Electrician & Power',
    designation: 'Chief Campus Electrician (HT/LT Grid)',
    departmentOrZone: 'Substation, Science Labs & Smartboard Power',
    phone: '+91 98182-44901',
    shift: '07:00 AM – 03:30 PM',
    dutyStatus: 'Task Assigned',
    assignedTask: 'Inspect 3-Phase MCB Panel in Chemistry Lab & Fix Room 204 Smartboard Stabilizer',
    basicSalary: 28000,
    allowances: 5500,
    deductions: 1800,
    netSalary: 31700,
    payrollStatus: 'Disbursed',
    lastPaidDate: '01 Oct 2026 (UTR #884305)',
    bankAccount: 'HDFC •••• 6702'
  },
  {
    id: '700202',
    name: 'Deepak Kushwaha',
    roleCategory: 'Electrician & Power',
    designation: 'Solar Rooftop & DG Backup Technician',
    departmentOrZone: '120kW Solar Array, UPS Room & Auditorium',
    phone: '+91 98189-31044',
    shift: '08:00 AM – 04:30 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Solar Inverter Load Balancing & Auditorium HVAC Relay Check',
    basicSalary: 25500,
    allowances: 4800,
    deductions: 1600,
    netSalary: 28700,
    payrollStatus: 'Pending',
    lastPaidDate: '01 Sep 2026',
    bankAccount: 'SBI •••• 3918'
  },

  // 4. MAINTENANCE, PLUMBING & AC TECHNICIANS
  {
    id: '700301',
    name: 'Mohan Lal',
    roleCategory: 'Maintenance & Technician',
    designation: 'Senior Plumber & RO Water Plant Technician',
    departmentOrZone: '2nd Floor Water Coolers, RO Plant & Pipelines',
    phone: '+91 98711-62098',
    shift: '07:30 AM – 03:30 PM',
    dutyStatus: 'Task Assigned',
    assignedTask: 'Replace Leaking Brass Valve on 2nd Floor Chemistry Lab Water Cooler',
    basicSalary: 24000,
    allowances: 4500,
    deductions: 1500,
    netSalary: 27000,
    payrollStatus: 'Pending',
    lastPaidDate: '01 Sep 2026',
    bankAccount: 'PNB •••• 7710'
  },
  {
    id: '700302',
    name: 'Harishankar Sharma',
    roleCategory: 'Maintenance & Technician',
    designation: 'HVAC, Carpentry & Smartboard Hardware Tech',
    departmentOrZone: 'All Classrooms, Furniture & Projector Mounts',
    phone: '+91 98715-89420',
    shift: '08:00 AM – 04:00 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Repair Bench Hinges in Section 10-A & Clean Computer Lab AC Filters',
    basicSalary: 26000,
    allowances: 5000,
    deductions: 1700,
    netSalary: 29300,
    payrollStatus: 'Disbursed',
    lastPaidDate: '01 Oct 2026 (UTR #884319)',
    bankAccount: 'ICICI •••• 9045'
  },

  // 5. MANAGEMENT & ADMIN PERSONNEL
  {
    id: '100001',
    name: 'Dr. S. Radhakrishnan',
    roleCategory: 'Management & Admin',
    designation: 'Principal & Directorate Head',
    departmentOrZone: 'Admin Block Wing A • Executive Directorate',
    phone: '+91 98110-10001',
    shift: '07:30 AM – 04:00 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Board Exam Academic Audit & Staff Payroll Sanction',
    basicSalary: 95000,
    allowances: 25000,
    deductions: 8500,
    netSalary: 111500,
    payrollStatus: 'Disbursed',
    lastPaidDate: '01 Oct 2026 (UTR #884001)',
    bankAccount: 'SBI •••• 0001'
  },
  {
    id: '100002',
    name: 'Vikramaditya Malhotra',
    roleCategory: 'Management & Admin',
    designation: 'Chief Finance & Payroll Bursar',
    departmentOrZone: 'Accounts, Fee Treasury & Staff Payroll Office',
    phone: '+91 98110-20045',
    shift: '08:00 AM – 04:30 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Student Tuition Arrears Audit & October Payroll Processing',
    basicSalary: 62000,
    allowances: 15000,
    deductions: 4500,
    netSalary: 72500,
    payrollStatus: 'Disbursed',
    lastPaidDate: '01 Oct 2026 (UTR #884002)',
    bankAccount: 'HDFC •••• 2045'
  },
  {
    id: '100003',
    name: 'Neha Kapoor',
    roleCategory: 'Management & Admin',
    designation: 'HR, Admissions & Operations Registrar',
    departmentOrZone: 'Front Desk, Admissions & Staff Attendance',
    phone: '+91 98110-30088',
    shift: '08:00 AM – 04:00 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'New Student Admissions Verification & Parent SMS Dispatch',
    basicSalary: 48000,
    allowances: 11000,
    deductions: 3200,
    netSalary: 55800,
    payrollStatus: 'Pending',
    lastPaidDate: '01 Sep 2026',
    bankAccount: 'Axis •••• 3088'
  },

  // 6. SECURITY & TRANSPORT FLEET
  {
    id: '700401',
    name: 'Subedar Rampratap Singh',
    roleCategory: 'Security & Transport',
    designation: 'Chief Campus Security Officer',
    departmentOrZone: 'Main Gate #1, CCTV Control & Visitor Desk',
    phone: '+91 99581-44012',
    shift: '06:00 AM – 02:30 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Main Gate Student Entry Biometric Log & CCTV Perimeter Watch',
    basicSalary: 23000,
    allowances: 4200,
    deductions: 1400,
    netSalary: 25800,
    payrollStatus: 'Disbursed',
    lastPaidDate: '01 Oct 2026 (UTR #884401)',
    bankAccount: 'SBI •••• 4412'
  },
  {
    id: '700402',
    name: 'Balwinder Singh',
    roleCategory: 'Security & Transport',
    designation: 'Senior School Bus Driver (Route #04)',
    departmentOrZone: 'Transport Fleet • Vidya Vihar – Sector 14 Route',
    phone: '+91 99584-77219',
    shift: '06:15 AM – 03:15 PM',
    dutyStatus: 'On Duty',
    assignedTask: 'Route #04 GPS Speed Governor Check & Dispersal Lineup',
    basicSalary: 22500,
    allowances: 4000,
    deductions: 1300,
    netSalary: 25200,
    payrollStatus: 'Pending',
    lastPaidDate: '01 Sep 2026',
    bankAccount: 'PNB •••• 7219'
  }
];

export const INITIAL_PARENT_NOTIFICATIONS: ParentNotificationLog[] = [
  {
    id: 'NTF-901',
    studentId: '20261003',
    studentName: 'Rohan Sharma',
    grade: '10-B',
    parentPhone: '+91 98111-22334',
    dueAmount: 25000,
    channel: 'SMS + WhatsApp + App Push',
    sentBy: 'Vikramaditya Malhotra (#100002 • Finance Bursar)',
    timestamp: 'Yesterday, 04:15 PM',
    message: 'Official Reminder: Tuition fee installment of ₹25,000 for Rohan Sharma (Reg #20261003, Class 10-B) is pending. Kindly pay online via Student Portal.'
  },
  {
    id: 'NTF-902',
    studentId: '20261007',
    studentName: 'Devansh Joshi',
    grade: '10-B',
    parentPhone: '+91 98990-11223',
    dueAmount: 45000,
    channel: 'SMS + WhatsApp + App Push',
    sentBy: 'Dr. S. Radhakrishnan (#100001 • Principal)',
    timestamp: '16 Oct 2026, 11:30 AM',
    message: 'Urgent Fee Arrears Alert: Outstanding balance of ₹45,000 for Devansh Joshi (Reg #20261007, Class 10-B) is overdue. Please clear dues to avoid late fee.'
  }
];

