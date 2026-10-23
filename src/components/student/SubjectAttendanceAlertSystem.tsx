import React, { useState, useMemo } from 'react';
import { Student } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';

export interface SubjectAttendanceItem {
  id: string;
  subject: string;
  facultyName: string;
  facultyRegNo: string;
  roomNo: string;
  attendedLectures: number;
  totalLectures: number;
  remedialCreditsAvailable: number;
  remedialTopic: string;
  remedialSchedule: string;
  odOrMedicalCreditsAvailable: number;
  odReason: string;
}

export interface AttendanceNotificationAlert {
  id: string;
  subject: string;
  type: 'near-98' | 'below-98' | 'recovered-98';
  title: string;
  message: string;
  bridgeSuggestion: string;
  timestamp: string;
  unread: boolean;
}

interface SubjectAttendanceAlertSystemProps {
  currentStudent: Student;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  handleSelectNavTab: (tabId: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

const INITIAL_SUBJECT_ATTENDANCE: SubjectAttendanceItem[] = [
  {
    id: 'SUB-ATT-1',
    subject: 'Computer Science & AI',
    facultyName: 'Ms. Sunita Rao',
    facultyRegNo: '900102',
    roomNo: 'AI Lab 102',
    attendedLectures: 40,
    totalLectures: 41, // 97.6% — Dipped right below 98% target!
    remedialCreditsAvailable: 1,
    remedialTopic: 'After-School Python & SQL Practical Make-Up Lab',
    remedialSchedule: 'Today, 03:30 PM – 04:30 PM',
    odOrMedicalCreditsAvailable: 1,
    odReason: 'Robotics Hackathon On-Duty (OD) Credit'
  },
  {
    id: 'SUB-ATT-2',
    subject: 'English Literature',
    facultyName: 'Mrs. Clara Dsouza',
    facultyRegNo: '900104',
    roomNo: 'Room 204',
    attendedLectures: 49,
    totalLectures: 50, // 98.0% — Right on the 98% razor edge!
    remedialCreditsAvailable: 1,
    remedialTopic: 'First Flight Poetry & Analytical Writing Tutorial',
    remedialSchedule: 'Tomorrow, 08:00 AM Zero Period',
    odOrMedicalCreditsAvailable: 0,
    odReason: 'Editorial Club Duty Slip'
  },
  {
    id: 'SUB-ATT-3',
    subject: 'Social Studies & History',
    facultyName: 'Mr. Rajesh Khanna',
    facultyRegNo: '900103',
    roomNo: 'Room 108',
    attendedLectures: 43,
    totalLectures: 45, // 95.6% — 2 lectures missed
    remedialCreditsAvailable: 1,
    remedialTopic: '1915–1947 Nationalism Map-Work & Civics Clinic',
    remedialSchedule: 'Thursday, 03:30 PM',
    odOrMedicalCreditsAvailable: 1,
    odReason: 'Inter-House Debate On-Duty (OD) Credit'
  },
  {
    id: 'SUB-ATT-4',
    subject: 'Mathematics (NCERT)',
    facultyName: 'Dr. Vikram Sethi',
    facultyRegNo: '900101',
    roomNo: 'Room 202',
    attendedLectures: 47,
    totalLectures: 50, // 94.0% — 3 lectures missed
    remedialCreditsAvailable: 2,
    remedialTopic: 'Saturday Quadratic & Trigonometry Problem-Solving Clinic',
    remedialSchedule: 'Saturday, 09:30 AM – 11:30 AM',
    odOrMedicalCreditsAvailable: 1,
    odReason: 'Approved Medical Fever Certificate Credit'
  },
  {
    id: 'SUB-ATT-5',
    subject: 'Science (Physics & Chem)',
    facultyName: 'Dr. Vikram Sethi',
    facultyRegNo: '900101',
    roomNo: 'Chem Lab 201',
    attendedLectures: 44,
    totalLectures: 48, // 91.7% — 4 lectures missed
    remedialCreditsAvailable: 2,
    remedialTopic: 'Ray Optics & Acid-Base Titration Lab Make-Up Batch',
    remedialSchedule: 'Friday & Saturday, 03:30 PM',
    odOrMedicalCreditsAvailable: 2,
    odReason: 'Approved Viral Flu Medical Condonation (2 Lectures)'
  }
];

export const SubjectAttendanceAlertSystem: React.FC<SubjectAttendanceAlertSystemProps> = ({
  currentStudent,
  handleAwardBonusXP,
  handleSelectNavTab,
  playUISound,
  showToast
}) => {
  const [subjectRecords, setSubjectRecords] = useState<SubjectAttendanceItem[]>(INITIAL_SUBJECT_ATTENDANCE);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'at-risk' | 'near-98'>('all');
  const [alertsFeed, setAlertsFeed] = useState<AttendanceNotificationAlert[]>([
    {
      id: 'ALT-101',
      subject: 'Computer Science & AI',
      type: 'near-98',
      title: 'Alert: Computer Science & AI Dipped to 97.6% (Target: 98%)',
      message: 'You have attended 40 of 41 lectures (1 absence). You are just 0.4% below your 98% target.',
      bridgeSuggestion: 'Complete 1 After-School Python Make-Up Lab OR claim your Robotics On-Duty (OD) credit to reach 100% (41/41) today.',
      timestamp: 'Just now • Live Alert',
      unread: true
    },
    {
      id: 'ALT-102',
      subject: 'English Literature',
      type: 'near-98',
      title: 'Borderline Warning: English Literature is at Exactly 98.0% (49/50)',
      message: 'You have zero buffer! Missing even 1 upcoming lecture will drop your English attendance to 96.1%.',
      bridgeSuggestion: 'Attend the next 2 regular classes consecutively or join tomorrow’s Zero-Period Tutorial for +1 safety buffer credit.',
      timestamp: '8 mins ago',
      unread: true
    },
    {
      id: 'ALT-103',
      subject: 'Mathematics (NCERT)',
      type: 'below-98',
      title: 'Gap Recovery Plan: Mathematics is at 94.0% (47/50 Lectures)',
      message: '3 absences recorded. Without make-up credits, reaching 98% would require 100 consecutive classes.',
      bridgeSuggestion: 'Bridge the gap immediately: Use 2 Saturday Trigonometry Clinic make-up credits + 1 Medical Certificate credit to hit 100% (50/50).',
      timestamp: '25 mins ago',
      unread: false
    }
  ]);

  // Enrich each subject with exact 98% math & bridge calculations
  const enrichedSubjects = useMemo(() => {
    const target = 0.98;
    return subjectRecords.map(item => {
      const pct = Number(((item.attendedLectures / Math.max(1, item.totalLectures)) * 100).toFixed(1));
      const missed = Math.max(0, item.totalLectures - item.attendedLectures);
      const nextMissPct = Number(((item.attendedLectures / (item.totalLectures + 1)) * 100).toFixed(1));

      // How many consecutive regular lectures needed to reach 98% without make-up credits:
      // (attended + x) / (total + x) >= 0.98  =>  x >= (0.98 * total - attended) / 0.02
      const consecutiveRegularNeeded =
        pct >= 98
          ? 0
          : Math.max(0, Math.ceil((target * item.totalLectures - item.attendedLectures) / (1 - target)));

      // How many make-up / condonation credits needed (where credit adds to attendedLectures without increasing totalLectures)
      // (attended + c) / total >= 0.98  =>  c >= ceil(0.98 * total - attended)
      const bridgeCreditsNeeded =
        pct >= 98 ? 0 : Math.max(1, Math.ceil(target * item.totalLectures - item.attendedLectures));

      const totalAvailableBridgeCredits = item.remedialCreditsAvailable + item.odOrMedicalCreditsAvailable;

      let statusLevel: 'safe' | 'near-98' | 'below-98' = 'safe';
      if (pct < 96.5) statusLevel = 'below-98';
      else if (pct < 98.5) statusLevel = 'near-98';

      return {
        ...item,
        pct,
        missed,
        nextMissPct,
        consecutiveRegularNeeded,
        bridgeCreditsNeeded,
        totalAvailableBridgeCredits,
        statusLevel
      };
    });
  }, [subjectRecords]);

  const filteredSubjects = useMemo(() => {
    if (selectedFilter === 'near-98') {
      return enrichedSubjects.filter(s => s.pct >= 96.0 && s.pct <= 98.5);
    }
    if (selectedFilter === 'at-risk') {
      return enrichedSubjects.filter(s => s.pct < 98.0);
    }
    return enrichedSubjects;
  }, [enrichedSubjects, selectedFilter]);

  const unreadCount = useMemo(() => alertsFeed.filter(a => a.unread).length, [alertsFeed]);

  // Simulate a real-time attendance dip in a subject to demonstrate the live notification alert
  const handleSimulateLectureDip = (subjectId: string) => {
    const targetSub = subjectRecords.find(s => s.id === subjectId);
    if (!targetSub) return;

    const newAttended = targetSub.attendedLectures;
    const newTotal = targetSub.totalLectures + 1;
    const newPct = Number(((newAttended / newTotal) * 100).toFixed(1));
    const creditsNeeded = Math.max(1, Math.ceil(0.98 * newTotal - newAttended));

    setSubjectRecords(prev =>
      prev.map(s => (s.id === subjectId ? { ...s, totalLectures: newTotal } : s))
    );

    const newAlert: AttendanceNotificationAlert = {
      id: `ALT-${Date.now()}`,
      subject: targetSub.subject,
      type: newPct >= 96.5 ? 'near-98' : 'below-98',
      title: `LIVE ALERT: ${targetSub.subject} Attendance Dipped to ${newPct}%!`,
      message: `Marked absent for 1 lecture (${newAttended}/${newTotal} attended). Your attendance is now ${
        newPct < 98 ? `${(98 - newPct).toFixed(1)}% below` : 'right near'
      } your 98% target.`,
      bridgeSuggestion: `Bridge the gap now: Complete ${creditsNeeded} make-up remedial session (${targetSub.remedialTopic}) or apply an OD/Medical credit to restore 98%+.`,
      timestamp: 'Just now • Real-Time Dip Alert',
      unread: true
    };

    setAlertsFeed(prev => [newAlert, ...prev]);
    playUISound('error');
    showToast(
      `98% Target Alert: ${targetSub.subject} (${newPct}%)`,
      `Attendance dipped to ${newPct}%. Check the suggested Bridge-the-Gap actions!`,
      'danger'
    );
  };

  // Bridge Action 1: Complete Extra Remedial / Make-Up Lab Session (+1 Attended Credit)
  const handleClaimRemedialBridge = (subjectId: string) => {
    const targetSub = subjectRecords.find(s => s.id === subjectId);
    if (!targetSub || targetSub.remedialCreditsAvailable <= 0) return;

    const nextAttended = Math.min(targetSub.totalLectures, targetSub.attendedLectures + 1);
    const nextPct = Number(((nextAttended / targetSub.totalLectures) * 100).toFixed(1));

    setSubjectRecords(prev =>
      prev.map(s =>
        s.id === subjectId
          ? {
              ...s,
              attendedLectures: nextAttended,
              remedialCreditsAvailable: s.remedialCreditsAvailable - 1
            }
          : s
      )
    );

    const recoveryAlert: AttendanceNotificationAlert = {
      id: `ALT-${Date.now()}`,
      subject: targetSub.subject,
      type: nextPct >= 98 ? 'recovered-98' : 'near-98',
      title:
        nextPct >= 98
          ? `98% Target Reached in ${targetSub.subject} (${nextPct}%)!`
          : `Gap Bridged: ${targetSub.subject} Rose to ${nextPct}%`,
      message: `Credited +1 Make-Up Lecture for "${targetSub.remedialTopic}" (${nextAttended}/${targetSub.totalLectures} lectures).`,
      bridgeSuggestion:
        nextPct >= 98
          ? 'You are now at or above your 98% target! Keep attending regular lectures to maintain your buffer.'
          : 'Claim your remaining On-Duty / Medical credit or attend the next class to cross 98%.',
      timestamp: 'Just now • Remedial Credit Applied',
      unread: true
    };

    setAlertsFeed(prev => [recoveryAlert, ...prev]);
    handleAwardBonusXP(
      currentStudent.id,
      40,
      `Attended ${targetSub.subject} Make-Up Remedial Lab (${nextPct}% Attendance)`
    );
  };

  // Bridge Action 2: Apply On-Duty (OD) / Medical Leave Condonation Credit (+1 Attended Credit)
  const handleClaimODOrMedicalBridge = (subjectId: string) => {
    const targetSub = subjectRecords.find(s => s.id === subjectId);
    if (!targetSub || targetSub.odOrMedicalCreditsAvailable <= 0) return;

    const nextAttended = Math.min(targetSub.totalLectures, targetSub.attendedLectures + 1);
    const nextPct = Number(((nextAttended / targetSub.totalLectures) * 100).toFixed(1));

    setSubjectRecords(prev =>
      prev.map(s =>
        s.id === subjectId
          ? {
              ...s,
              attendedLectures: nextAttended,
              odOrMedicalCreditsAvailable: s.odOrMedicalCreditsAvailable - 1
            }
          : s
      )
    );

    const recoveryAlert: AttendanceNotificationAlert = {
      id: `ALT-${Date.now()}`,
      subject: targetSub.subject,
      type: nextPct >= 98 ? 'recovered-98' : 'near-98',
      title:
        nextPct >= 98
          ? `98% Target Restored in ${targetSub.subject} (${nextPct}%)!`
          : `Condonation Credited: ${targetSub.subject} Now at ${nextPct}%`,
      message: `Applied "${targetSub.odReason}" (+1 excused lecture credit → ${nextAttended}/${targetSub.totalLectures}).`,
      bridgeSuggestion:
        nextPct >= 98
          ? 'Target achieved! Your subject attendance is now safely at or above 98%.'
          : 'Complete 1 more remedial tutorial to reach 98%.',
      timestamp: 'Just now • OD/Medical Credit Verified',
      unread: true
    };

    setAlertsFeed(prev => [recoveryAlert, ...prev]);
    playUISound('success');
    showToast(
      `Bridge Credit Applied: ${targetSub.subject} (${nextPct}%)`,
      `${targetSub.odReason} credited to your subject ledger.`,
      'success'
    );
  };

  // Bridge Action 3: Attend Next Regular Class (+1 Attended / +1 Total)
  const handleAttendRegularLecture = (subjectId: string) => {
    const targetSub = subjectRecords.find(s => s.id === subjectId);
    if (!targetSub) return;

    const nextAttended = targetSub.attendedLectures + 1;
    const nextTotal = targetSub.totalLectures + 1;
    const nextPct = Number(((nextAttended / nextTotal) * 100).toFixed(1));

    setSubjectRecords(prev =>
      prev.map(s =>
        s.id === subjectId
          ? { ...s, attendedLectures: nextAttended, totalLectures: nextTotal }
          : s
      )
    );

    playUISound('success');
    showToast(
      `Attended ${targetSub.subject} Lecture`,
      `Updated to ${nextAttended}/${nextTotal} lectures (${nextPct}%).`,
      'success'
    );
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EAE2D3] pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
              Real-Time Subject Attendance Guard • 98% Target Monitor
            </span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#9E2A2B] text-white text-[10px] font-mono font-semibold animate-pulse">
                ● {unreadCount} Active 98% Target Alert{unreadCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold text-[#1C2A27]">
            Subject-Wise 98% Attendance Alerts & "Bridge the Gap" Recovery Planner
          </h2>
          <p className="text-xs text-[#686052]">
            Automatically alerts you when any subject dips near or below your <strong>98% attendance goal</strong> and provides instant make-up lab, remedial tutorial, and On-Duty (OD) ways to bridge the gap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {(['all', 'near-98', 'at-risk'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                playUISound('click');
                setSelectedFilter(mode);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedFilter === mode
                  ? 'bg-[#0A4D44] text-[#F5F0E6]'
                  : 'bg-[#F5F0E6] text-[#4A443B] hover:bg-[#EAE2D3]'
              }`}
            >
              {mode === 'all'
                ? 'All 5 Subjects'
                : mode === 'near-98'
                ? 'Near 98% Edge (96–98.5%)'
                : 'Below 98% Target'}
            </button>
          ))}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setAlertsFeed(prev => prev.map(a => ({ ...a, unread: false })));
              }}
              className="px-3 py-1.5 rounded-lg bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#1C2A27] text-xs font-semibold transition"
            >
              Mark Alerts Read ✓
            </button>
          )}
        </div>
      </div>

      {/* LIVE REAL-TIME NOTIFICATION STREAM */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#686052]">
            Live Subject Attendance Alert Feed ({alertsFeed.length})
          </span>
          <span className="text-[11px] text-[#0E6B5E] font-medium">
            Tip: Click "Simulate 1 Missed Class" on any subject below to test real-time alerts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {alertsFeed.slice(0, 3).map(alert => {
            const cardStyle =
              alert.type === 'recovered-98'
                ? 'bg-[#EFF5F3] border-[#9CC5BE]'
                : alert.type === 'near-98'
                ? 'bg-[#FDF4E7] border-[#E6C89C]'
                : 'bg-[#FAF2F2] border-[#E2B4B4]';

            const badgeColor =
              alert.type === 'recovered-98'
                ? 'bg-[#0A4D44] text-white'
                : alert.type === 'near-98'
                ? 'bg-[#D97706] text-white'
                : 'bg-[#9E2A2B] text-white';

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border space-y-2 flex flex-col justify-between transition ${cardStyle}`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${badgeColor}`}>
                      {alert.type === 'recovered-98'
                        ? '✓ 98% Target Reached'
                        : alert.type === 'near-98'
                        ? '⚠ Dip Near 98%'
                        : '🚨 Below 98% Target'}
                    </span>
                    <span className="text-[10px] font-mono text-[#686052]">{alert.timestamp}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-[#1C2A27]">{alert.title}</h3>
                  <p className="text-[11px] text-[#4A443B] leading-snug">{alert.message}</p>
                </div>

                <div className="p-2 rounded-lg bg-[#FFFDF9]/90 border border-[#DDD4C2] text-[11px] text-[#1C2A27]">
                  <strong className="text-[#0A4D44]">How to Bridge the Gap:</strong> {alert.bridgeSuggestion}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUBJECT-BY-SUBJECT 98% MONITOR & INTERACTIVE GAP-BRIDGING CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSubjects.map(sub => {
          const isTargetMet = sub.pct >= 98.0;
          const isNearEdge = sub.pct >= 96.5 && sub.pct < 98.5;

          const statusBadge = isTargetMet
            ? sub.nextMissPct < 98
              ? 'bg-[#FDF4E7] text-[#9A6B26] border-[#E6C89C]'
              : 'bg-[#EFF5F3] text-[#0A4D44] border-[#9CC5BE]'
            : isNearEdge
            ? 'bg-[#FDF4E7] text-[#9A6B26] border-[#E6C89C]'
            : 'bg-[#FAF2F2] text-[#9E2A2B] border-[#E2B4B4]';

          const statusText = isTargetMet
            ? sub.nextMissPct < 98
              ? `On 98% Edge (1 Miss → ${sub.nextMissPct}%)`
              : '98%+ Target Safe ✓'
            : isNearEdge
            ? `Dipped Near 98% (-${(98 - sub.pct).toFixed(1)}%)`
            : `At Risk (-${(98 - sub.pct).toFixed(1)}% to 98%)`;

          return (
            <div
              key={sub.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3.5 transition ${
                isTargetMet
                  ? 'bg-[#F7F3EB] border-[#DDD4C2]'
                  : isNearEdge
                  ? 'bg-[#FFFDF9] border-[#D97706]'
                  : 'bg-[#FFFDF9] border-[#E2B4B4]'
              }`}
            >
              <div className="space-y-2.5">
                {/* Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1C2A27]">{sub.subject}</h3>
                    <p className="text-[11px] text-[#686052]">
                      Faculty: <strong>{sub.facultyName}</strong> (#{sub.facultyRegNo}) • {sub.roomNo}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border ${statusBadge}`}>
                    {statusText}
                  </span>
                </div>

                {/* Attendance Progress Bar with 98% Marker */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs font-mono">
                    <span className="text-[#4A443B]">
                      Attended: <strong>{sub.attendedLectures}</strong> / {sub.totalLectures} Lectures ({sub.missed} Missed)
                    </span>
                    <strong
                      className={`text-base ${
                        sub.pct >= 98
                          ? 'text-[#0A4D44]'
                          : sub.pct >= 96.5
                          ? 'text-[#D97706]'
                          : 'text-[#9E2A2B]'
                      }`}
                    >
                      {sub.pct}%
                    </strong>
                  </div>

                  <div className="relative w-full h-2.5 rounded-full bg-[#E2D9C8] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        sub.pct >= 98
                          ? 'bg-[#0A4D44]'
                          : sub.pct >= 96.5
                          ? 'bg-[#D97706]'
                          : 'bg-[#9E2A2B]'
                      }`}
                      style={{ width: `${Math.min(100, sub.pct)}%` }}
                    />
                  </div>
                </div>

                {/* Diagnostic Comparison: Regular Consecutive Classes vs Smart Bridge Credits */}
                <div className="p-3 rounded-lg bg-[#FFFDF9] border border-[#EAE2D3] space-y-2 text-xs">
                  {sub.pct >= 98 ? (
                    <div className="flex items-center justify-between text-[#0A4D44]">
                      <span>
                        <strong>98% Target Active:</strong> If you miss the next class, attendance drops to{' '}
                        <strong className="font-mono text-[#9E2A2B]">{sub.nextMissPct}%</strong>.
                      </span>
                      <span className="font-mono text-[11px] font-semibold">Keep Streak Going</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#686052]">Without Make-Up Credits (Regular Classes):</span>
                        <strong className="font-mono text-[#9E2A2B]">
                          Need {sub.consecutiveRegularNeeded} consecutive classes
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#EAE2D3]">
                        <span className="text-[#0A4D44] font-semibold">
                          Fast-Track Bridge to 98% (Make-Up / OD Credits):
                        </span>
                        <strong className="font-mono text-[#0A4D44]">
                          Only {sub.bridgeCreditsNeeded} Make-Up Credit{sub.bridgeCreditsNeeded === 1 ? '' : 's'} Needed!
                        </strong>
                      </div>
                    </>
                  )}

                  {/* Concrete Bridge Suggestions */}
                  <div className="text-[11px] text-[#4A443B] bg-[#F7F3EB] p-2 rounded border border-[#E2D9C8]">
                    <div>
                      • <strong>Remedial Option:</strong> {sub.remedialTopic} (<em>{sub.remedialSchedule}</em>) —{' '}
                      <span className="font-mono font-semibold text-[#0E6B5E]">
                        {sub.remedialCreditsAvailable} credit(s) open
                      </span>
                    </div>
                    {sub.odOrMedicalCreditsAvailable > 0 && (
                      <div className="mt-0.5">
                        • <strong>Excused Credit:</strong> {sub.odReason} —{' '}
                        <span className="font-mono font-semibold text-[#0A4D44]">
                          +{sub.odOrMedicalCreditsAvailable} lecture credit available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons to Bridge the Gap or Simulate Dip */}
              <div className="pt-2 border-t border-[#EAE2D3] flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {sub.remedialCreditsAvailable > 0 && (
                    <button
                      type="button"
                      onClick={() => handleClaimRemedialBridge(sub.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-[11px] font-semibold transition"
                    >
                      +1 Remedial Lab Credit ({sub.remedialCreditsAvailable} left)
                    </button>
                  )}

                  {sub.odOrMedicalCreditsAvailable > 0 && (
                    <button
                      type="button"
                      onClick={() => handleClaimODOrMedicalBridge(sub.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#EFF5F3] hover:bg-[#DCECE7] text-[#0A4D44] border border-[#0A4D44] text-[11px] font-semibold transition"
                    >
                      +1 Apply OD/Medical ({sub.odOrMedicalCreditsAvailable})
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleAttendRegularLecture(sub.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#1C2A27] text-[11px] font-semibold transition"
                  >
                    +1 Attend Regular Class
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSimulateLectureDip(sub.id)}
                    title="Simulate missing 1 class to trigger a real-time 98% dip alert"
                    className="px-2 py-1.5 rounded-lg bg-[#FAF2F2] hover:bg-[#F3E2E2] text-[#9E2A2B] border border-[#E2B4B4] text-[10px] font-semibold transition"
                  >
                    Simulate 1 Absence
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectNavTab('stu-tutoring')}
                    className="px-2 py-1.5 rounded-lg bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#0E6B5E] border border-[#D5CBB8] text-[10px] font-semibold transition"
                  >
                    Peer Tutor →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
