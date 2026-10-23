import React, { useState, useEffect } from 'react';
import { RoleType, ThemeMode } from '../../types/erp';
import { WORLD_THEMES } from '../layout/Sidebar';
import {
  Sparkles,
  Compass,
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Volume2,
  Palette,
  Shield,
  FileText,
  Printer,
  Bell,
  Award,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  Check,
  Zap
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  handleSelectNavTab: (tabId: string) => void;
  playUISound: (type?: string) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

interface TourStep {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  roleTarget?: RoleType;
  tabTarget?: string;
  content: React.ReactNode;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  setActiveRole,
  handleSelectNavTab,
  playUISound,
  theme,
  setTheme
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);

  // Synchronize role/tab preview when step changes
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === 'ArrowRight' && currentStepIndex < steps.length - 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  const handleDismiss = () => {
    playUISound('click');
    if (dontShowAgain) {
      try {
        localStorage.setItem('edunexus_tour_completed', 'true');
      } catch (e) {
        // ignore
      }
    }
    onClose();
  };

  const handleNext = () => {
    playUISound('tab');
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const target = steps[nextIndex];
      if (target.roleTarget && target.roleTarget !== activeRole) {
        setActiveRole(target.roleTarget);
      }
      if (target.tabTarget) {
        handleSelectNavTab(target.tabTarget);
      }
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    playUISound('click');
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      const target = steps[prevIndex];
      if (target.roleTarget && target.roleTarget !== activeRole) {
        setActiveRole(target.roleTarget);
      }
      if (target.tabTarget) {
        handleSelectNavTab(target.tabTarget);
      }
    }
  };

  const jumpToStep = (index: number) => {
    playUISound('click');
    setCurrentStepIndex(index);
    const target = steps[index];
    if (target.roleTarget && target.roleTarget !== activeRole) {
      setActiveRole(target.roleTarget);
    }
    if (target.tabTarget) {
      handleSelectNavTab(target.tabTarget);
    }
  };

  const steps: TourStep[] = [
    {
      id: 'welcome',
      badge: 'Welcome Orientation',
      title: 'Welcome to EduNexus ERP 2026',
      subtitle: 'A unified, high-performance institution management operating system',
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#374151] leading-relaxed">
            EduNexus ERP bridges learners, educators, and institutional leadership into a single, cohesive digital campus with instantaneous real-time workflows.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#EFF5F3] border border-[#CCDCD7] flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-[#0A4D44] text-white flex items-center justify-center mb-2 shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#1C2A27]">Student Portal</span>
              <span className="text-[11px] text-[#556965] mt-0.5">Academics, tests, fees & vault</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-2 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#1C2A27]">Teacher Portal</span>
              <span className="text-[11px] text-[#556965] mt-0.5">Attendance, marks & parent alerts</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center mb-2 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#1C2A27]">Admin Console</span>
              <span className="text-[11px] text-[#556965] mt-0.5">HR payroll, fees & operations</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#F5F0E6] border border-[#DDD4C2] flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#0A4D44] shrink-0" />
            <p className="text-xs text-[#4B5563]">
              <strong>Interactive Walkthrough:</strong> Over the next few steps, you'll see every primary tool explained with live switches so you can explore confidently!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'portals',
      badge: 'Role Architecture',
      title: 'Seamless 3-Portal Switching',
      subtitle: 'Instantly toggle roles in the top navigation bar to explore different perspectives',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#374151]">
            In the header at the top of your screen, the <strong>Segmented Role Switcher</strong> allows authorized personnel or evaluators to toggle seamlessly between the 3 core personas:
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                playUISound('role');
                setActiveRole('student');
              }}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-[#EFF5F3] border-[#0A4D44] ring-1 ring-[#0A4D44]'
                  : 'bg-white border-[#E5E7EB] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0A4D44] text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1C2A27] flex items-center gap-2">
                    Student Role (Aarav Sharma · Sec 10-A)
                    {activeRole === 'student' && (
                      <span className="text-[10px] font-semibold bg-[#0A4D44] text-white px-2 py-0.5 rounded-full">
                        Active Now
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    Personal timetable, learning vault, fee installments, exams & report card.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>

            <button
              type="button"
              onClick={() => {
                playUISound('role');
                setActiveRole('teacher');
              }}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                activeRole === 'teacher'
                  ? 'bg-[#EFF5F3] border-[#0A4D44] ring-1 ring-[#0A4D44]'
                  : 'bg-white border-[#E5E7EB] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1C2A27] flex items-center gap-2">
                    Teacher Role (Ms. Sunita Rao · CS & Class Teacher)
                    {activeRole === 'teacher' && (
                      <span className="text-[10px] font-semibold bg-[#0A4D44] text-white px-2 py-0.5 rounded-full">
                        Active Now
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    Period schedule, rapid roll call, instant WhatsApp/SMS parent notifications.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>

            <button
              type="button"
              onClick={() => {
                playUISound('role');
                setActiveRole('management');
              }}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                activeRole === 'management'
                  ? 'bg-[#EFF5F3] border-[#0A4D44] ring-1 ring-[#0A4D44]'
                  : 'bg-white border-[#E5E7EB] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1C2A27] flex items-center gap-2">
                    Admin Directorate (Dr. S. Radhakrishnan)
                    {activeRole === 'management' && (
                      <span className="text-[10px] font-semibold bg-[#0A4D44] text-white px-2 py-0.5 rounded-full">
                        Active Now
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    All-staff payroll vouchers, campus facilities, circulars & fee clearance.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'student-tools',
      badge: 'Student Tools',
      title: 'Student Portal: Learning Vault & Academics',
      subtitle: 'Complete toolkit for student excellence, test practice, and tuition receipts',
      icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
      roleTarget: 'student',
      tabTarget: 'stu-overview',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#374151]">
            The Student Portal empowers learners with self-service tools and gamified milestones:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">NCERT Vault & Formulas</strong>
                <span className="text-[#6B7280]">Periodic table, chemical formulas, and curated revision notes.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">Exam Readiness & Daily Tests</strong>
                <span className="text-[#6B7280]">Timed MCQs, instant evaluation, XP points, and leaderboard rank.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">CBSE Digital Report Card</strong>
                <span className="text-[#6B7280]">Official term marksheet with grade calculation and 1-click printable PDF.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">Tuition & Verified Receipts</strong>
                <span className="text-[#6B7280]">Pay tuition installments and download official numbered receipts.</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#EFF5F3] border border-[#CCDCD7] text-xs text-[#0A4D44] flex items-center justify-between">
            <span>Try selecting <strong>Tuition & Receipts</strong> or <strong>Marks & Report Card</strong> from the sidebar.</span>
            <button
              type="button"
              onClick={() => {
                playUISound('tab');
                handleSelectNavTab('stu-fees');
              }}
              className="px-2.5 py-1 bg-[#0A4D44] text-white rounded-lg font-bold text-[11px] hover:bg-[#083E37] cursor-pointer"
            >
              Open Fees Tab →
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'teacher-tools',
      badge: 'Teacher Tools',
      title: 'Teacher Command: Attendance & Parent Dispatch',
      subtitle: 'Streamlined classroom roll call, marksheets, and automated parent communication',
      icon: <Users className="w-5 h-5 text-emerald-700" />,
      roleTarget: 'teacher',
      tabTarget: 'tch-attendance',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#374151]">
            Faculty members have dedicated tools built for daily classroom management:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">One-Click Roll Call Attendance</strong>
                <span className="text-[#6B7280]">Mark Present, Absent, or Late for Class 9-A through 12-A with live percentage metrics.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <Bell className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">Automated Parent Alerts (WhatsApp / SMS)</strong>
                <span className="text-[#6B7280]">Instantly notify parents regarding unexcused absences, fee reminders, or homework with one tap.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">Live Schedule & Lecture Joiner</strong>
                <span className="text-[#6B7280]">Interactive timetable shows current active period, room number, and class roster.</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#EFF5F3] border border-[#CCDCD7] text-xs text-[#0A4D44] flex items-center justify-between">
            <span>Explore <strong>Attendance & Parent Alerts</strong> active right now in the background!</span>
            <button
              type="button"
              onClick={() => {
                playUISound('tab');
                handleSelectNavTab('tch-marks');
              }}
              className="px-2.5 py-1 bg-[#0A4D44] text-white rounded-lg font-bold text-[11px] hover:bg-[#083E37] cursor-pointer"
            >
              Check Gradebook →
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'admin-tools',
      badge: 'Management Tools',
      title: 'Management Console: Campus HR & Operations',
      subtitle: 'Complete institutional governance, payroll disbursal, and campus facilities',
      icon: <Building2 className="w-5 h-5 text-amber-700" />,
      roleTarget: 'management',
      tabTarget: 'mgmt-payroll',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#374151]">
            School Leadership and the Directorate have access to executive administrative tools:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">HR Payroll & Salary Vouchers</strong>
                <span className="text-[#6B7280]">Track teachers and staff, manage allowances & deductions, and print official salary vouchers.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">Fee Defaulters & Mass Reminders</strong>
                <span className="text-[#6B7280]">Audit outstanding fees by class and send school-wide parent payment notices.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">Campus Facilities & Operations</strong>
                <span className="text-[#6B7280]">Live duty status for sanitation, electricity, laboratories, and technician maintenance.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-start gap-2.5">
              <Bell className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C2A27] block">School Circulars & Tribunal</strong>
                <span className="text-[#6B7280]">Broadcast urgent circulars and review student disciplinary cases.</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#EFF5F3] border border-[#CCDCD7] text-xs text-[#0A4D44] flex items-center justify-between">
            <span>View <strong>Staff Payroll & HR</strong> active right now in the background!</span>
            <button
              type="button"
              onClick={() => {
                playUISound('tab');
                handleSelectNavTab('mgmt-command');
              }}
              className="px-2.5 py-1 bg-[#0A4D44] text-white rounded-lg font-bold text-[11px] hover:bg-[#083E37] cursor-pointer"
            >
              Directorate Command →
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'themes-sound',
      badge: 'Sensory & Aesthetics',
      title: '10 World Themes & Web Audio Engine',
      subtitle: 'Harmonious regional aesthetics with authentic acoustic synthesizers',
      icon: <Palette className="w-5 h-5 text-pink-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#374151]">
            EduNexus features an immersive sensory layer tailored for focused studying and administration:
          </p>

          <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2A27] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#0A4D44]" />
                10 Cultural Themes (Pick one now):
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {WORLD_THEMES.slice(0, 5).map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    setTheme(t.id);
                  }}
                  className={`p-1.5 rounded-lg border text-left text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer truncate ${
                    theme === t.id
                      ? 'border-[#0A4D44] bg-[#EFF5F3] text-[#0A4D44] font-bold ring-1 ring-[#0A4D44]'
                      : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151]'
                  }`}
                >
                  <span>{t.flag}</span>
                  <span className="truncate">{t.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#EFF5F3] border border-[#CCDCD7] space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-[#0A4D44] font-bold">
              <Volume2 className="w-4 h-4" />
              <span>Real-Time Synthesizer Sound Engine</span>
            </div>
            <p className="text-[#4B5563]">
              Every button, tab change, role toggle, and alert trigger has synthesized harmonic frequencies (Indian Sitar & Tabla, Kyoto Bamboo, Swiss Horology Ticks, and Nordic Marimba). Sound settings are accessible at the bottom of the sidebar!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'navigation-shortcuts',
      badge: 'Navigation & Printing',
      title: 'Collapsible Sidebar, Search & Printing',
      subtitle: 'Effortless navigation and printer-ready documents anywhere, anytime',
      icon: <Compass className="w-5 h-5 text-indigo-600" />,
      content: (
        <div className="space-y-3 text-xs text-[#374151]">
          <p className="text-sm">
            Quick tips to maximize your speed and convenience across the system:
          </p>

          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#EFF5F3] text-[#0A4D44] flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <strong className="text-[#1C2A27] block">Sidebar Expand / Collapse</strong>
                <span>Click the toggle icon at the top of the left sidebar to switch between full labels and a compact icon rail.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#EFF5F3] text-[#0A4D44] flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <strong className="text-[#1C2A27] block">Header Section Dropdown</strong>
                <span>Quickly jump between any tool or module right from the dropdown menu in the top bar.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#EFF5F3] text-[#0A4D44] flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <strong className="text-[#1C2A27] block">Print & Export Reports</strong>
                <span>Look for the print icon on Report Cards, Timetables, and Salary Slips for clean, printable PDF documents.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ready',
      badge: 'Ready to Explore',
      title: 'You are Ready to Experience EduNexus!',
      subtitle: 'Choose where you want to begin your journey',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0A4D44] text-white flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#1C2A27]">
              Tour Complete! Start Exploring Now
            </h3>
            <p className="text-xs text-[#556965] mt-1 max-w-md mx-auto">
              You can reopen this tour at any time by clicking the <strong>Take Tour</strong> button in the top header or sidebar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveRole('student');
                handleSelectNavTab('stu-overview');
                handleDismiss();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#0A4D44] text-white font-bold text-xs hover:bg-[#083E37] shadow-xs cursor-pointer transition"
            >
              Start as Student →
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRole('teacher');
                handleSelectNavTab('tch-classroom');
                handleDismiss();
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 shadow-xs cursor-pointer transition"
            >
              Start as Teacher →
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRole('management');
                handleSelectNavTab('mgmt-command');
                handleDismiss();
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 shadow-xs cursor-pointer transition"
            >
              Start as Admin →
            </button>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#FFFDF9] border border-[#DDD4C2] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        role="dialog"
        aria-modal="true"
        aria-label="EduNexus Guided Tour"
      >
        {/* Top Progress Bar */}
        <div className="w-full bg-[#EAE2D3] h-1.5 shrink-0 overflow-hidden">
          <div
            className="bg-[#0A4D44] h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#DDD4C2] flex items-center justify-between gap-3 bg-[#FBF9F4]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EFF5F3] border border-[#CCDCD7] flex items-center justify-center shrink-0">
              {currentStep.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0A4D44] bg-[#EFF5F3] px-2 py-0.5 rounded-md border border-[#CCDCD7]">
                  {currentStep.badge}
                </span>
                <span className="text-[11px] font-mono text-[#686052]">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#1C2A27] truncate mt-0.5">
                {currentStep.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-xl hover:bg-[#F0EAE1] text-[#686052] hover:text-[#1C2A27] transition cursor-pointer"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle Bar */}
        <div className="px-4 sm:px-5 py-2 bg-[#F5F0E6] border-b border-[#EAE2D3] text-xs font-medium text-[#556965]">
          {currentStep.subtitle}
        </div>

        {/* Step Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-[260px] max-h-[420px]">
          {currentStep.content}
        </div>

        {/* Step Pagination Dots */}
        <div className="px-4 sm:px-5 py-2 bg-[#FAF7F0] border-t border-[#EAE2D3] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => jumpToStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-6 bg-[#0A4D44]'
                    : 'w-2 bg-[#DDD4C2] hover:bg-[#A39987]'
                }`}
                title={`Go to step ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          <label className="flex items-center gap-1.5 text-[11px] text-[#686052] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={e => setDontShowAgain(e.target.checked)}
              className="rounded text-[#0A4D44] focus:ring-[#0A4D44] cursor-pointer"
            />
            <span>Don't show automatically next time</span>
          </label>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 sm:p-4 bg-[#FFFDF9] border-t border-[#DDD4C2] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs font-bold text-[#686052] hover:text-[#1C2A27] px-3 py-2 rounded-xl hover:bg-[#F5F0E6] transition cursor-pointer"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-[#DDD4C2] bg-white hover:bg-[#F5F0E6] text-[#1C2A27] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[#0A4D44] hover:bg-[#083E37] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-98"
            >
              {isLastStep ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
