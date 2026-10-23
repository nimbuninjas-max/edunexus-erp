/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  CampusStaffMember,
  FeeTransaction,
  LeaveApplication,
  ParentNotificationLog,
  RoleType,
  SoundProfile,
  StudentAcademicSummary,
  StudyMaterial,
  ThemeMode
} from './types/erp';
import {
  AVAILABLE_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_TIMETABLE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TEACHER_NOTICES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_TASKS,
  INITIAL_EXAM_RECORDS,
  INITIAL_DISCIPLINE_CASES,
  INITIAL_FACILITIES,
  INITIAL_STUDY_MATERIALS,
  INITIAL_GROUPS,
  INITIAL_WHISPERS,
  INITIAL_PEER_TUTORING_POSTS,
  INITIAL_LEAVE_APPLICATIONS,
  INITIAL_CAMPUS_STAFF,
  INITIAL_PARENT_NOTIFICATIONS,
  STUDENT_NAV_ITEMS,
  TEACHER_NAV_ITEMS,
  MGMT_NAV_ITEMS,
  buildSubjectMarks
} from './data/initialData';
import { ToastData, ToastNotification } from './components/common/ToastNotification';
import { ReportCardModal } from './components/modals/ReportCardModal';
import { StudyMaterialModal } from './components/modals/StudyMaterialModal';
import { GuidedTourModal } from './components/modals/GuidedTourModal';
import { Sidebar, WORLD_THEMES, AUDIO_SOUND_PACKS } from './components/layout/Sidebar';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { Header } from './components/layout/Header';
import { StudentPortal } from './components/student/StudentPortal';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { ManagementPortal } from './components/management/ManagementPortal';

export default function App() {
  // STRICT 3-PORTAL ROLE STATE ('student' | 'teacher' | 'management')
  const [activeRole, setActiveRole] = useState<RoleType>('student');

  // THEME & DARK MODE STATE PERSISTED IN LOCALSTORAGE
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edunexus_theme');
        if (saved && WORLD_THEMES.some(t => t.id === saved)) {
          return saved as ThemeMode;
        }
      } catch (e) {
        // ignore
      }
    }
    return 'botanical';
  });

  // SEPARATE ACTIVE TABS FOR EACH PORTAL SO THEY NEVER MIX
  const [studentTab, setStudentTab] = useState('stu-overview');
  const [teacherTab, setTeacherTab] = useState('tch-classroom');
  const [mgmtTab, setMgmtTab] = useState('mgmt-command');

  // DOCKER / SIDEBAR COLLAPSE & MOBILE DRAWER STATE (Auto-compact icon rail on Tablet < 1024px)
  const [dockExpanded, setDockExpanded] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // INTERACTIVE GUIDED ONBOARDING TOUR (Auto-opens for new arrivals)
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    try {
      const tourCompleted = localStorage.getItem('edunexus_tour_completed');
      if (!tourCompleted) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 700);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setDockExpanded(false);
      } else if (window.innerWidth >= 1280) {
        setDockExpanded(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // MULTI-INSTRUMENT WORLD AUDIO SYNTHESIZER (6 Distinct Sound Packs) PERSISTED IN LOCALSTORAGE
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edunexus_sound_enabled');
        if (saved !== null) return saved === 'true';
      } catch (e) {
        // ignore
      }
    }
    return true;
  });

  const [soundVolume, setSoundVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edunexus_sound_volume');
        if (saved !== null) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return 75;
  });

  const [soundProfile, setSoundProfile] = useState<SoundProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edunexus_sound_profile');
        if (saved && AUDIO_SOUND_PACKS.some(p => p.id === saved)) {
          return saved as SoundProfile;
        }
      } catch (e) {
        // ignore
      }
    }
    return 'indian';
  });

  // Persist Theme Changes to Cache / LocalStorage & documentElement
  useEffect(() => {
    try {
      localStorage.setItem('edunexus_theme', themeMode);
      if (themeMode === 'dark' || themeMode === 'midnight') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // ignore
    }
  }, [themeMode]);

  // Persist Audio Preferences to Cache / LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('edunexus_sound_enabled', String(soundEnabled));
    } catch (e) {
      // ignore
    }
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('edunexus_sound_volume', String(soundVolume));
    } catch (e) {
      // ignore
    }
  }, [soundVolume]);

  useEffect(() => {
    try {
      localStorage.setItem('edunexus_sound_profile', soundProfile);
    } catch (e) {
      // ignore
    }
  }, [soundProfile]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playUISound = useCallback((type = 'click') => {
    if (!soundEnabled || soundVolume <= 0) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const volMultiplier = Math.max(0, Math.min(2, soundVolume / 50));

      const playVoiceNote = (
        freq: number,
        duration: number,
        peakGain = 0.035,
        delay = 0
      ) => {
        const startTime = now + delay;
        const stopTime = startTime + duration;
        const scaledGain = Math.max(0.0002, peakGain * volMultiplier);

        const osc = ctx.createOscillator();
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();

        if (soundProfile === 'indian') {
          // Sitar & Tanpura: Rich triangle wave + 1.5x fifth overtone + gentle meend pitch glide
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq * 0.98, startTime);
          osc.frequency.exponentialRampToValueAtTime(freq, startTime + Math.min(0.06, duration * 0.4));
          overtone.type = 'sine';
          overtone.frequency.setValueAtTime(freq * 1.5, startTime);
          overtoneGain.gain.setValueAtTime(0.22, startTime);
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1600, startTime);
          filter.Q.setValueAtTime(1.2, startTime);
        } else if (soundProfile === 'japanese') {
          // Kyoto Koto & Bamboo: Pentatonic plucked string with crisp attack
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq * 1.12, startTime);
          overtone.type = 'sine';
          overtone.frequency.setValueAtTime(freq * 2.24, startTime);
          overtoneGain.gain.setValueAtTime(0.18, startTime);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2600, startTime);
        } else if (soundProfile === 'swiss') {
          // Swiss Mechanical Watch: Ultra-crisp precision tick
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * 1.8, startTime);
          overtone.type = 'triangle';
          overtone.frequency.setValueAtTime(freq * 3.6, startTime);
          overtoneGain.gain.setValueAtTime(0.15, startTime);
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(900, startTime);
        } else if (soundProfile === 'arcade') {
          // Retro 8-Bit Chiptune Synth
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, startTime);
          overtone.type = 'triangle';
          overtone.frequency.setValueAtTime(freq * 2, startTime);
          overtoneGain.gain.setValueAtTime(0.1, startTime);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1800, startTime);
        } else if (soundProfile === 'minimal') {
          // Zen Water Droplet: Pure sine with upward bubble pitch bend
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * 0.85, startTime);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.25, stopTime);
          overtone.type = 'sine';
          overtone.frequency.setValueAtTime(freq * 1.7, startTime);
          overtoneGain.gain.setValueAtTime(0.05, startTime);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1500, startTime);
        } else {
          // Nordic Glass Marimba
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          overtone.type = 'sine';
          overtone.frequency.setValueAtTime(freq * 2, startTime);
          overtoneGain.gain.setValueAtTime(0.12, startTime);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2200, startTime);
        }

        const effectiveStop = soundProfile === 'swiss' ? startTime + Math.min(0.06, duration) : stopTime;
        env.gain.setValueAtTime(0.0001, startTime);
        env.gain.linearRampToValueAtTime(scaledGain, startTime + 0.01);
        env.gain.exponentialRampToValueAtTime(0.0001, effectiveStop);

        osc.connect(filter);
        overtone.connect(overtoneGain);
        overtoneGain.connect(filter);
        filter.connect(env);
        env.connect(ctx.destination);

        osc.start(startTime);
        overtone.start(startTime);
        osc.stop(effectiveStop);
        overtone.stop(effectiveStop);
      };

      if (type === 'click') {
        playVoiceNote(783.99, 0.14, 0.025, 0);
      } else if (type === 'tab') {
        playVoiceNote(523.25, 0.18, 0.024, 0);
        playVoiceNote(783.99, 0.24, 0.028, 0.045);
      } else if (type === 'role') {
        playVoiceNote(523.25, 0.24, 0.024, 0);
        playVoiceNote(659.25, 0.26, 0.026, 0.055);
        playVoiceNote(783.99, 0.3, 0.028, 0.11);
        playVoiceNote(1046.5, 0.38, 0.03, 0.165);
      } else if (type === 'send') {
        playVoiceNote(587.33, 0.18, 0.024, 0);
        playVoiceNote(880.0, 0.22, 0.028, 0.045);
        playVoiceNote(1174.66, 0.32, 0.03, 0.09);
      } else if (type === 'success') {
        playVoiceNote(698.46, 0.25, 0.028, 0);
        playVoiceNote(880.0, 0.28, 0.03, 0.06);
        playVoiceNote(1046.5, 0.34, 0.032, 0.12);
        playVoiceNote(1318.51, 0.45, 0.032, 0.18);
      } else if (type === 'error') {
        playVoiceNote(329.63, 0.22, 0.028, 0);
        playVoiceNote(261.63, 0.28, 0.026, 0.09);
      }
    } catch {
      // Ignore audio errors on restricted devices
    }
  }, [soundEnabled, soundVolume, soundProfile]);

  // Core Data States
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [campusStaff, setCampusStaff] = useState<CampusStaffMember[]>(INITIAL_CAMPUS_STAFF);
  const [parentNotifications, setParentNotifications] = useState<ParentNotificationLog[]>(INITIAL_PARENT_NOTIFICATIONS);
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [teacherNotices, setTeacherNotices] = useState(INITIAL_TEACHER_NOTICES);
  const [calendarEvents, setCalendarEvents] = useState(INITIAL_CALENDAR_EVENTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [examRecords, setExamRecords] = useState(INITIAL_EXAM_RECORDS);
  const [disciplineCases, setDisciplineCases] = useState(INITIAL_DISCIPLINE_CASES);
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [studyMaterials] = useState(INITIAL_STUDY_MATERIALS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [whispers, setWhispers] = useState(INITIAL_WHISPERS);
  const [tutoringPosts, setTutoringPosts] = useState(INITIAL_PEER_TUTORING_POSTS);
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(INITIAL_LEAVE_APPLICATIONS);

  // Authenticated Student Session (Locked so students cannot switch into someone else's data)
  const [currentStudentId] = useState('20261003');
  const currentStudent = useMemo(
    () => students.find(s => s.id === currentStudentId) || students[0],
    [students, currentStudentId]
  );

  // Active Teacher Identity & Multi-Class Switcher (when inside Teacher Portal)
  const [activeTeacherId, setActiveTeacherId] = useState('900102');
  const activeTeacher = useMemo(
    () => teachers.find(t => t.id === activeTeacherId) || teachers[0],
    [teachers, activeTeacherId]
  );
  const [selectedTeacherClass, setSelectedTeacherClass] = useState('10-B');
  const [discStudentId, setDiscStudentId] = useState('20261003');

  // Official Printable PDF Modal & Study Material Reader Modal States
  const [printingStudentId, setPrintingStudentId] = useState<string | null>(null);
  const [readingMaterial, setReadingMaterial] = useState<StudyMaterial | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<ToastData | null>(null);
  const showToast = useCallback((title: string, description: string, type = 'default') => {
    setToast({ title, description, type });
    if (type === 'danger') playUISound('error');
    else if (type === 'success') playUISound('success');
    else playUISound('click');
  }, [playUISound]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  // Ranked Students (1st to Last across the school)
  const rankedStudents = useMemo(() => {
    const sorted = [...students].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const pctA = (a.presentDays / a.totalDays) * 100;
      const pctB = (b.presentDays / b.totalDays) * 100;
      return pctB - pctA;
    });
    return sorted.map((stu, idx) => ({
      ...stu,
      rank: idx + 1,
      attendancePct: Number(((stu.presentDays / stu.totalDays) * 100).toFixed(1))
    }));
  }, [students]);

  const currentStudentRankObj = useMemo(
    () => rankedStudents.find(s => s.id === currentStudent.id) || rankedStudents[0],
    [rankedStudents, currentStudent.id]
  );

  // Comprehensive Academic Calculator (Separate Unit Tests, Separate Mid-Term, Separate End-Term, and Combined Grand Overall)
  const getStudentAcademicSummary = useCallback((studentId: string): StudentAcademicSummary => {
    const stuObj = rankedStudents.find(s => s.id === studentId) || rankedStudents[0];
    const record = examRecords[studentId];
    const rawSubjects = record?.subjects || buildSubjectMarks(78, 80, 82, 80, 84);

    const subjectsList = rawSubjects.map(sub => {
      const unitTotalObtained = Number(sub.u1) + Number(sub.u2) + Number(sub.u3);
      const unitMaxMarks = 300;
      const unitPct = Number(((unitTotalObtained / unitMaxMarks) * 100).toFixed(1));

      const rawSubjectTotalObtained = unitTotalObtained + Number(sub.mid) + Number(sub.final);
      const rawSubjectMaxMarks = 500; // 300 (UT1+UT2+UT3) + 100 (Mid-Term) + 100 (End-Term)
      const rawSubjectPct = Number(((rawSubjectTotalObtained / rawSubjectMaxMarks) * 100).toFixed(1));
      const subjectOverall100 = Number(((unitPct * 0.20) + (Number(sub.mid) * 0.30) + (Number(sub.final) * 0.50)).toFixed(1));

      return {
        ...sub,
        unitTotalObtained,
        unitMaxMarks,
        unitPct,
        rawSubjectTotalObtained,
        rawSubjectMaxMarks,
        rawSubjectPct,
        subjectOverall100
      };
    });

    const subjectCount = subjectsList.length;

    const unit1TotalObtained = subjectsList.reduce((acc, s) => acc + Number(s.u1), 0);
    const unit1MaxMarks = subjectCount * 100;
    const unit1Avg = Number(((unit1TotalObtained / unit1MaxMarks) * 100).toFixed(1));

    const unit2TotalObtained = subjectsList.reduce((acc, s) => acc + Number(s.u2), 0);
    const unit2MaxMarks = subjectCount * 100;
    const unit2Avg = Number(((unit2TotalObtained / unit2MaxMarks) * 100).toFixed(1));

    const unit3TotalObtained = subjectsList.reduce((acc, s) => acc + Number(s.u3), 0);
    const unit3MaxMarks = subjectCount * 100;
    const unit3Avg = Number(((unit3TotalObtained / unit3MaxMarks) * 100).toFixed(1));

    const totalUnitMarksObtained = subjectsList.reduce((acc, s) => acc + s.unitTotalObtained, 0);
    const totalUnitMaxMarks = subjectCount * 300;
    const unitAvg = Number(((totalUnitMarksObtained / totalUnitMaxMarks) * 100).toFixed(1));

    const totalMidtermObtained = subjectsList.reduce((acc, s) => acc + Number(s.mid), 0);
    const totalMidtermMaxMarks = subjectCount * 100;
    const midterm = Number(((totalMidtermObtained / totalMidtermMaxMarks) * 100).toFixed(1));

    const totalFinalObtained = subjectsList.reduce((acc, s) => acc + Number(s.final), 0);
    const totalFinalMaxMarks = subjectCount * 100;
    const finalExam = Number(((totalFinalObtained / totalFinalMaxMarks) * 100).toFixed(1));

    const grandTotalObtained = totalUnitMarksObtained + totalMidtermObtained + totalFinalObtained;
    const grandTotalMaxMarks = totalUnitMaxMarks + totalMidtermMaxMarks + totalFinalMaxMarks;
    const rawGrandPct = Number(((grandTotalObtained / grandTotalMaxMarks) * 100).toFixed(1));

    const combinedOverallPct = Number(((unitAvg * 0.20) + (midterm * 0.30) + (finalExam * 0.50)).toFixed(1));

    const attPct = stuObj ? stuObj.attendancePct : 85;
    const allStuCases = disciplineCases.filter(d => d.studentId === studentId);
    const activeStuCases = allStuCases.filter(d => d.status !== 'Resolved');
    const disciplinePenalty = activeStuCases.reduce((acc, c) => acc + (c.severity === 'Major' ? 3 : 1), 0);

    const rawPredicted = (combinedOverallPct * 0.85) + (attPct * 0.15) - disciplinePenalty;
    const predictedFinal = Math.max(35, Math.min(99, Number(rawPredicted.toFixed(1))));

    let cbseGrade = 'A1 (Outstanding)';
    if (combinedOverallPct < 50) cbseGrade = 'D (Needs Intervention)';
    else if (combinedOverallPct < 65) cbseGrade = 'C1 (Fair)';
    else if (combinedOverallPct < 75) cbseGrade = 'B2 (Good)';
    else if (combinedOverallPct < 85) cbseGrade = 'B1 (Very Good)';
    else if (combinedOverallPct < 92) cbseGrade = 'A2 (Excellent)';

    return {
      unit1: unit1Avg,
      unit2: unit2Avg,
      unit3: unit3Avg,
      totalUnitMarksObtained,
      totalUnitMaxMarks,
      unitAvg,
      totalMidtermObtained,
      totalMidtermMaxMarks,
      midterm,
      totalFinalObtained,
      totalFinalMaxMarks,
      finalExam,
      grandTotalObtained,
      grandTotalMaxMarks,
      rawGrandPct,
      combinedOverallPct,
      attendance: attPct,
      predictedFinal,
      cbseGrade,
      totalIndisciplineCount: allStuCases.length,
      activeIndisciplineCount: activeStuCases.length,
      subjectsList
    };
  }, [rankedStudents, examRecords, disciplineCases]);

  const currentStudentAcademics = useMemo(
    () => getStudentAcademicSummary(currentStudent.id),
    [getStudentAcademicSummary, currentStudent.id]
  );

  // Actions
  const handleAwardBonusXP = (studentId: string, amount: number, reason: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== studentId) return s;
        const nextPts = Math.max(0, s.points + amount);
        return {
          ...s,
          points: nextPts,
          xpLevel: Math.max(1, Math.floor(nextPts / 160)),
          profileViews: s.profileViews + 1
        };
      })
    );
    const target = students.find(s => s.id === studentId);
    showToast(
      `${amount >= 0 ? `+${amount}` : amount} Merit XP (${target?.name})`,
      reason || 'Academic update recorded.',
      amount >= 0 ? 'success' : 'danger'
    );
  };

  const handleMarkAttendance = (studentId: string, statusType: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== studentId) return s;
        const isPres = statusType === 'Present';
        return {
          ...s,
          todayStatus: statusType,
          presentDays: isPres ? s.presentDays + 1 : s.presentDays,
          totalDays: s.totalDays + 1,
          profileViews: s.profileViews + 1
        };
      })
    );
    const target = students.find(s => s.id === studentId);
    showToast(
      `Attendance Marked (${selectedTeacherClass})`,
      `${target?.name} (#${target?.id}) marked ${statusType.toUpperCase()} by ${activeTeacher.name}.`,
      statusType === 'Present' ? 'success' : 'warning'
    );
  };

  const handleMarkAllClassPresent = () => {
    setStudents(prev =>
      prev.map(s => {
        if (s.grade !== selectedTeacherClass) return s;
        return {
          ...s,
          todayStatus: 'Present',
          presentDays: s.presentDays + 1,
          totalDays: s.totalDays + 1
        };
      })
    );
    showToast(
      `Class ${selectedTeacherClass} Attendance Saved`,
      `All students in Class ${selectedTeacherClass} marked Present for today's lecture.`,
      'success'
    );
  };

  const handleUpdateStudentSubjectMark = (
    studentId: string,
    subjectIdx: number,
    field: string,
    value: string | number
  ) => {
    const cleanVal = Math.max(0, Math.min(100, Number(value) || 0));
    playUISound('click');
    setExamRecords(prev => {
      const existingSubjects = prev[studentId]?.subjects || buildSubjectMarks(75, 75, 75, 75, 75);
      const updatedSubjects = existingSubjects.map((sub, idx) =>
        idx === subjectIdx ? { ...sub, [field]: cleanVal } : sub
      );
      return {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          subjects: updatedSubjects
        }
      };
    });
  };

  const handleTeacherJoinPeriod = (periodId: string, isJoining: boolean, customTopic?: string) => {
    setTimetable(prev =>
      prev.map(p => {
        if (p.id !== periodId) return p;
        return {
          ...p,
          status: 'Ongoing',
          teacherPresent: isJoining,
          liveTopic: isJoining ? (customTopic?.trim() || p.liveTopic || 'Live Concept Lecture & Numericals') : ''
        };
      })
    );
    showToast(
      isJoining ? 'Checked In to Classroom Live!' : 'Marked Teacher Not Present',
      isJoining
        ? 'Students and Management can now see you are present and teaching this topic.'
        : 'Classroom status updated to Teacher Not Present.',
      isJoining ? 'success' : 'warning'
    );
  };

  const handlePayFeeInstallment = (studentId: string, amount: number | string) => {
    const cleanAmt = Number(amount);
    if (!cleanAmt || cleanAmt <= 0) return;
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== studentId) return s;
        const actualPaid = Math.min(s.dueFee, cleanAmt);
        const nextPaid = s.paidFee + actualPaid;
        const nextDue = Math.max(0, s.totalFee - nextPaid);
        const newReceipt: FeeTransaction = {
          receiptNo: `${Math.floor(891000 + Math.random() * 8000)}`,
          date: '18 Oct 2026',
          amount: actualPaid,
          mode: 'UPI / QR',
          InstallmentName: 'Online Portal Tuition Installment',
          status: 'Verified'
        };
        return {
          ...s,
          paidFee: nextPaid,
          dueFee: nextDue,
          feeStatus: nextDue === 0 ? 'Paid' : 'Partial Due',
          lastPaymentDate: `18 Oct 2026 (#${newReceipt.receiptNo})`,
          paymentHistory: [...s.paymentHistory, newReceipt]
        };
      })
    );
    showToast('Fee Receipt Generated', `₹${cleanAmt.toLocaleString()} credited to fee ledger & payment history.`, 'success');
  };

  // Dynamic Section Context State & Native Smooth Scroll Container
  const [dynamicSubContext, setDynamicSubContext] = useState('');
  const mainScrollRef = useRef<HTMLDivElement | null>(null);

  const currentNavList =
    activeRole === 'student'
      ? STUDENT_NAV_ITEMS
      : activeRole === 'teacher'
      ? TEACHER_NAV_ITEMS
      : MGMT_NAV_ITEMS;

  const currentActiveTab =
    activeRole === 'student'
      ? studentTab
      : activeRole === 'teacher'
      ? teacherTab
      : mgmtTab;

  const handleSelectNavTab = (tabId: string) => {
    playUISound('tab');
    if (activeRole === 'student') setStudentTab(tabId);
    else if (activeRole === 'teacher') setTeacherTab(tabId);
    else setMgmtTab(tabId);
    setMobileMenuOpen(false);
    setDynamicSubContext('');
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSwitchRole = (newRole: RoleType) => {
    playUISound('role');
    setActiveRole(newRole);
    setMobileMenuOpen(false);
    setDynamicSubContext('');
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0 });
    }
  };

  // One-click Parent Notification Dispatcher (Used by Admin & Teachers for Fee Dues or Attendance)
  const handleSendParentNotification = useCallback(
    (studentId: string, senderLabel: string, customMessage?: string) => {
      const targetStu = students.find(s => s.id === studentId);
      if (!targetStu) return;
      const msg =
        customMessage ||
        `Official School Alert: Pending tuition fee balance of ₹${targetStu.dueFee.toLocaleString()} for ${targetStu.name} (Reg #${targetStu.id}, Class ${targetStu.grade}) is due. Kindly clear dues via the Student Portal.`;
      const newLog: ParentNotificationLog = {
        id: `NTF-${Math.floor(100 + Math.random() * 899)}`,
        studentId: targetStu.id,
        studentName: targetStu.name,
        grade: targetStu.grade,
        parentPhone: targetStu.parentPhone,
        dueAmount: targetStu.dueFee,
        channel: 'SMS + WhatsApp + App Push',
        sentBy: senderLabel,
        timestamp: 'Just now',
        message: msg
      };
      setParentNotifications(prev => [newLog, ...prev]);
      playUISound('send');
      showToast(
        `Parent Notified (${targetStu.parentPhone})`,
        `SMS & WhatsApp alert sent to parents of ${targetStu.name} (#${targetStu.id}).`,
        'success'
      );
    },
    [students, playUISound, showToast]
  );

  const themeClass = `theme-${themeMode}`;

  return (
    <div className={`${themeClass} h-screen w-full overflow-hidden bg-[#F5F0E6] text-[#1C2A27] flex font-sans selection:bg-[#0A4D44] selection:text-[#F5F0E6] transition-colors duration-300`}>
      <ReportCardModal
        printingStudentId={printingStudentId}
        rankedStudents={rankedStudents}
        currentStudentRankObj={currentStudentRankObj}
        getStudentAcademicSummary={getStudentAcademicSummary}
        disciplineCases={disciplineCases}
        onClose={() => setPrintingStudentId(null)}
        playUISound={playUISound}
        showToast={showToast}
      />

      <StudyMaterialModal
        readingMaterial={readingMaterial}
        onClose={() => setReadingMaterial(null)}
        onCompleteReview={(mat) => {
          handleAwardBonusXP(currentStudent.id, 30, `Completed Study Note: ${mat.title}`);
          setReadingMaterial(null);
        }}
      />

      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        handleSelectNavTab={handleSelectNavTab}
        playUISound={playUISound}
        theme={themeMode}
        setTheme={setThemeMode}
      />

      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      <MobileDrawer
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeRole={activeRole}
        currentNavList={currentNavList}
        currentActiveTab={currentActiveTab}
        handleSelectNavTab={handleSelectNavTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        soundVolume={soundVolume}
        setSoundVolume={setSoundVolume}
        soundProfile={soundProfile}
        setSoundProfile={setSoundProfile}
        theme={themeMode}
        setTheme={setThemeMode}
        playUISound={playUISound}
        onOpenTour={() => setIsTourOpen(true)}
      />

      <Sidebar
        activeRole={activeRole}
        dockExpanded={dockExpanded}
        setDockExpanded={setDockExpanded}
        currentNavList={currentNavList}
        currentActiveTab={currentActiveTab}
        handleSelectNavTab={handleSelectNavTab}
        availableClasses={AVAILABLE_CLASSES}
        selectedTeacherClass={selectedTeacherClass}
        setSelectedTeacherClass={setSelectedTeacherClass}
        students={students}
        setDiscStudentId={setDiscStudentId}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        soundVolume={soundVolume}
        setSoundVolume={setSoundVolume}
        soundProfile={soundProfile}
        setSoundProfile={setSoundProfile}
        theme={themeMode}
        setTheme={setThemeMode}
        playUISound={playUISound}
        onOpenTour={() => setIsTourOpen(true)}
      />

      <div
        ref={mainScrollRef}
        className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative"
      >
        <Header
          activeRole={activeRole}
          handleSwitchRole={handleSwitchRole}
          setMobileMenuOpen={setMobileMenuOpen}
          currentStudent={currentStudent}
          activeTeacher={activeTeacher}
          activeTeacherId={activeTeacherId}
          setActiveTeacherId={setActiveTeacherId}
          teachers={teachers}
          selectedTeacherClass={selectedTeacherClass}
          setSelectedTeacherClass={setSelectedTeacherClass}
          availableClasses={AVAILABLE_CLASSES}
          students={students}
          setDiscStudentId={setDiscStudentId}
          theme={themeMode}
          setTheme={setThemeMode}
          playUISound={playUISound}
          handleSelectNavTab={handleSelectNavTab}
          currentNavList={currentNavList}
          currentActiveTab={currentActiveTab}
          dynamicSubContext={dynamicSubContext}
          onOpenTour={() => setIsTourOpen(true)}
        />

        <main className="flex-1 px-3.5 sm:px-5 pt-3.5 sm:pt-4 pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto space-y-5">
            {activeRole === 'student' && (
              <StudentPortal
                studentTab={studentTab}
                handleSelectNavTab={handleSelectNavTab}
                currentStudent={currentStudent}
                currentStudentRankObj={currentStudentRankObj}
                currentStudentAcademics={currentStudentAcademics}
                rankedStudents={rankedStudents}
                students={students}
                setStudents={setStudents}
                teachers={teachers}
                timetable={timetable}
                disciplineCases={disciplineCases}
                announcements={announcements}
                teacherNotices={teacherNotices}
                calendarEvents={calendarEvents}
                setCalendarEvents={setCalendarEvents}
                tasks={tasks}
                setTasks={setTasks}
                studyMaterials={studyMaterials}
                setReadingMaterial={setReadingMaterial}
                setPrintingStudentId={setPrintingStudentId}
                handleAwardBonusXP={handleAwardBonusXP}
                handlePayFeeInstallment={handlePayFeeInstallment}
                whispers={whispers}
                setWhispers={setWhispers}
                leaveApplications={leaveApplications}
                setLeaveApplications={setLeaveApplications}
                groups={groups}
                setGroups={setGroups}
                activeRole={activeRole}
                activeTeacher={activeTeacher}
                availableClasses={AVAILABLE_CLASSES}
                getStudentAcademicSummary={getStudentAcademicSummary}
                tutoringPosts={tutoringPosts}
                setTutoringPosts={setTutoringPosts}
                playUISound={playUISound}
                showToast={showToast}
                onUpdateHeaderContext={setDynamicSubContext}
              />
            )}

            {activeRole === 'teacher' && (
              <TeacherPortal
                teacherTab={teacherTab}
                handleSelectNavTab={handleSelectNavTab}
                activeTeacher={activeTeacher}
                selectedTeacherClass={selectedTeacherClass}
                setSelectedTeacherClass={setSelectedTeacherClass}
                availableClasses={AVAILABLE_CLASSES}
                timetable={timetable}
                handleTeacherJoinPeriod={handleTeacherJoinPeriod}
                rankedStudents={rankedStudents}
                students={students}
                teachers={teachers}
                campusStaff={campusStaff}
                parentNotifications={parentNotifications}
                onSendParentNotification={handleSendParentNotification}
                handleMarkAttendance={handleMarkAttendance}
                handleMarkAllClassPresent={handleMarkAllClassPresent}
                getStudentAcademicSummary={getStudentAcademicSummary}
                handleUpdateStudentSubjectMark={handleUpdateStudentSubjectMark}
                discStudentId={discStudentId}
                setDiscStudentId={setDiscStudentId}
                disciplineCases={disciplineCases}
                setDisciplineCases={setDisciplineCases}
                handleAwardBonusXP={handleAwardBonusXP}
                setTeacherNotices={setTeacherNotices}
                setTasks={setTasks}
                calendarEvents={calendarEvents}
                setCalendarEvents={setCalendarEvents}
                whispers={whispers}
                setWhispers={setWhispers}
                leaveApplications={leaveApplications}
                setLeaveApplications={setLeaveApplications}
                groups={groups}
                setGroups={setGroups}
                activeRole={activeRole}
                currentStudent={currentStudent}
                setPrintingStudentId={setPrintingStudentId}
                playUISound={playUISound}
                showToast={showToast}
              />
            )}

            {activeRole === 'management' && (
              <ManagementPortal
                mgmtTab={mgmtTab}
                handleSelectNavTab={handleSelectNavTab}
                students={students}
                setStudents={setStudents}
                rankedStudents={rankedStudents}
                teachers={teachers}
                setTeachers={setTeachers}
                campusStaff={campusStaff}
                setCampusStaff={setCampusStaff}
                parentNotifications={parentNotifications}
                onSendParentNotification={handleSendParentNotification}
                timetable={timetable}
                disciplineCases={disciplineCases}
                setDisciplineCases={setDisciplineCases}
                whispers={whispers}
                setWhispers={setWhispers}
                facilities={facilities}
                setFacilities={setFacilities}
                announcements={announcements}
                setAnnouncements={setAnnouncements}
                calendarEvents={calendarEvents}
                setCalendarEvents={setCalendarEvents}
                getStudentAcademicSummary={getStudentAcademicSummary}
                handlePayFeeInstallment={handlePayFeeInstallment}
                setPrintingStudentId={setPrintingStudentId}
                availableClasses={AVAILABLE_CLASSES}
                activeRole={activeRole}
                currentStudent={currentStudent}
                playUISound={playUISound}
                showToast={showToast}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
