import React, { useState, useMemo } from 'react';
import {
  DisciplineCase,
  PeerTutoringPost,
  RankedStudent,
  Student,
  StudentAcademicSummary
} from '../../types/erp';

export interface AchievementBadge {
  id: 'perfect-attendance' | 'high-flyer' | 'active-peer-tutor' | 'honor-roll' | 'exemplary-conduct' | 'quiz-virtuoso';
  title: string;
  tier: 'Platinum' | 'Gold' | 'Emerald' | 'Amber';
  milestoneRule: string;
  unlocked: boolean;
  progressPct: number;
  currentValueLabel: string;
  targetValueLabel: string;
  evidenceSummary: string;
  xpReward: number;
  actionButtonLabel?: string;
}

interface StudentAchievementSystemProps {
  currentStudent: Student;
  currentStudentRankObj: RankedStudent;
  currentStudentAcademics: StudentAcademicSummary;
  tutoringPosts: PeerTutoringPost[];
  setTutoringPosts: React.Dispatch<React.SetStateAction<PeerTutoringPost[]>>;
  disciplineCases: DisciplineCase[];
  condonedApplied: boolean;
  onApplyMedicalCondonation: () => void;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  handleSelectNavTab: (tabId: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
  defaultExpanded?: boolean;
  standaloneSection?: boolean;
}

export const BadgeEmblemSVG: React.FC<{
  badgeId: AchievementBadge['id'];
  unlocked: boolean;
  className?: string;
}> = ({ badgeId, unlocked, className = 'w-5 h-5' }) => {
  const strokeColor = unlocked ? 'currentColor' : '#8C8375';

  switch (badgeId) {
    case 'perfect-attendance':
      // Crest Shield with Checkmark & Sunburst Rays (No circular background)
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 2.2 4.5 5.4v6.2c0 5.1 3.2 8.8 7.5 10.2 4.3-1.4 7.5-5.1 7.5-10.2V5.4L12 2.2Z" />
          <path d="m8.8 12.1 2.2 2.2 4.5-4.6" />
        </svg>
      );

    case 'high-flyer':
      // Soaring Winged Star Emblem (>95% Exam Score)
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polygon points="12 2.5 14.4 7.6 20 8.3 15.9 12.2 17 17.8 12 15.1 7 17.8 8.1 12.2 4 8.3 9.6 7.6 12 2.5" />
          <path d="M3 20.5h18" />
          <path d="M6.5 22.5h11" />
        </svg>
      );

    case 'active-peer-tutor':
      // Open Mentorship Book & Guiding Beacon Flame
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M2.5 6.5h6.8a3.2 3.2 0 0 1 2.7 1.5 3.2 3.2 0 0 1 2.7-1.5h6.8v12.2h-6.8a3.2 3.2 0 0 0-2.7 1.3 3.2 3.2 0 0 0-2.7-1.3H2.5V6.5Z" />
          <path d="M12 8v12" />
          <path d="m12 2 1.6 2.5L12 6l-1.6-1.5L12 2Z" />
        </svg>
      );

    case 'honor-roll':
      // Academic Laurel Crown & Diamond
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 3 9 8.5 3.5 9.5 7.5 14l-1 5.5L12 17l5.5 2.5-1-5.5 4-4.5-5.5-1L12 3Z" />
        </svg>
      );

    case 'exemplary-conduct':
      // Balance Pillars of Integrity
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 3v18" />
          <path d="M5 7h14" />
          <path d="m5 7-2.5 5h5L5 7Z" />
          <path d="m19 7-2.5 5h5L19 7Z" />
          <path d="M8 21h8" />
        </svg>
      );

    case 'quiz-virtuoso':
    default:
      // Lightning Prism / Lab & Quiz Mastery
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2" />
        </svg>
      );
  }
};

export const StudentAchievementSystem: React.FC<StudentAchievementSystemProps> = ({
  currentStudent,
  currentStudentRankObj,
  currentStudentAcademics,
  tutoringPosts,
  setTutoringPosts,
  disciplineCases,
  condonedApplied,
  onApplyMedicalCondonation,
  handleAwardBonusXP,
  handleSelectNavTab,
  playUISound,
  showToast,
  defaultExpanded = true,
  standaloneSection = true
}) => {
  const [vaultExpanded, setVaultExpanded] = useState(defaultExpanded);
  const [selectedBadgeId, setSelectedBadgeId] = useState<AchievementBadge['id']>('high-flyer');
  const [claimedBadgeIds, setClaimedBadgeIds] = useState<Record<string, boolean>>({});
  // Allow students to verify a 14-day Perfect Attendance streak or High Flyer exam boost per student ID
  const [streakVerifiedByStudent, setStreakVerifiedByStudent] = useState<Record<string, boolean>>({
    '20261001': true,
    '20261003': true
  });
  const [highFlyerBoostByStudent, setHighFlyerBoostByStudent] = useState<Record<string, boolean>>({});

  // 1. Evaluate 'High Flyer' (Scoring above 95% in any exam: Unit Test 1/2/3, Mid-Term, or End-Term)
  const highFlyerExams = useMemo(() => {
    const qualifyingExams: { subject: string; examName: string; score: number }[] = [];
    currentStudentAcademics.subjectsList.forEach(sub => {
      if (sub.u1 > 95) qualifyingExams.push({ subject: sub.name, examName: 'Unit Test 1', score: sub.u1 });
      if (sub.u2 > 95) qualifyingExams.push({ subject: sub.name, examName: 'Unit Test 2', score: sub.u2 });
      if (sub.u3 > 95) qualifyingExams.push({ subject: sub.name, examName: 'Unit Test 3', score: sub.u3 });
      if (sub.mid > 95) qualifyingExams.push({ subject: sub.name, examName: 'Mid-Term', score: sub.mid });
      if (sub.final > 95) qualifyingExams.push({ subject: sub.name, examName: 'End-Term', score: sub.final });
    });

    if (highFlyerBoostByStudent[currentStudent.id] && qualifyingExams.length === 0) {
      qualifyingExams.push({
        subject: 'Computer Science & AI',
        examName: 'Special Assessment',
        score: 97
      });
    }
    return qualifyingExams.sort((a, b) => b.score - a.score);
  }, [currentStudentAcademics.subjectsList, highFlyerBoostByStudent, currentStudent.id]);

  const highestSingleExamScore = useMemo(() => {
    let maxScore = 0;
    currentStudentAcademics.subjectsList.forEach(sub => {
      maxScore = Math.max(maxScore, sub.u1, sub.u2, sub.u3, sub.mid, sub.final);
    });
    if (highFlyerBoostByStudent[currentStudent.id]) {
      maxScore = Math.max(maxScore, 97);
    }
    return maxScore;
  }, [currentStudentAcademics.subjectsList, highFlyerBoostByStudent, currentStudent.id]);

  // 2. Evaluate 'Active Peer Tutor' (Offering peer tutoring or matched in tutoring sessions)
  const studentTutoringRecords = useMemo(() => {
    return tutoringPosts.filter(
      p =>
        (p.studentId === currentStudent.id && p.type === 'offer') ||
        p.matchedWithRegNo === currentStudent.id ||
        p.studentId === currentStudent.id
    );
  }, [tutoringPosts, currentStudent.id]);

  // 3. Evaluate 'Perfect Attendance' (Attendance >= 95% OR Medical Condonation Applied OR 14-Day Streak Verified)
  const attendancePct = currentStudentRankObj.attendancePct;
  const isPerfectAttendanceUnlocked =
    attendancePct >= 95 || condonedApplied || Boolean(streakVerifiedByStudent[currentStudent.id]);

  // 4. Evaluate 'Exemplary Conduct' (0 Indiscipline cases)
  const studentDisciplineCount = useMemo(
    () => disciplineCases.filter(c => c.studentId === currentStudent.id).length,
    [disciplineCases, currentStudent.id]
  );

  // Build all 6 digital badges with live milestones
  const badges: AchievementBadge[] = useMemo(() => {
    const highFlyerUnlocked = highFlyerExams.length > 0;
    const peerTutorUnlocked = studentTutoringRecords.length > 0;
    const honorRollUnlocked = currentStudentAcademics.rawGrandPct >= 85;
    const conductUnlocked = studentDisciplineCount === 0;
    const quizUnlocked = currentStudent.dailyTestsTaken >= 10 || currentStudent.dailyTestAvgScore >= 85;

    return [
      {
        id: 'perfect-attendance',
        title: 'Perfect Attendance',
        tier: 'Emerald',
        milestoneRule: 'Achieve ≥95% term attendance OR complete a verified 14-day zero-absence streak',
        unlocked: isPerfectAttendanceUnlocked,
        progressPct: isPerfectAttendanceUnlocked ? 100 : Math.min(99, Math.round((attendancePct / 95) * 100)),
        currentValueLabel: isPerfectAttendanceUnlocked
          ? attendancePct >= 95
            ? `${attendancePct}% Term Attendance`
            : `14/14 Days Streak (${attendancePct}% Net)`
          : `${attendancePct}% (${currentStudent.presentDays}/${currentStudent.totalDays} Days)`,
        targetValueLabel: '14-Day Streak or 95%+ Term',
        evidenceSummary: isPerfectAttendanceUnlocked
          ? attendancePct >= 95
            ? `Exemplary ${attendancePct}% term attendance (${currentStudent.presentDays}/${currentStudent.totalDays} days present).`
            : `14-day consecutive zero-absence streak & medical condonation verified for ${currentStudent.name}.`
          : `Currently at ${attendancePct}% (${currentStudent.presentDays}/${currentStudent.totalDays}). Verify your 14-day streak or apply medical condonation to unlock.`,
        xpReward: 200,
        actionButtonLabel: 'Verify 14-Day Attendance Streak & Condonation'
      },
      {
        id: 'high-flyer',
        title: 'High Flyer',
        tier: 'Platinum',
        milestoneRule: 'Score above 95% (>95/100) in any Unit Test, Mid-Term, or End-Term examination',
        unlocked: highFlyerUnlocked,
        progressPct: highFlyerUnlocked ? 100 : Math.min(99, Math.round((highestSingleExamScore / 96) * 100)),
        currentValueLabel: highFlyerUnlocked
          ? `Peak Score: ${highFlyerExams[0].score}% (${highFlyerExams.length} Exam${highFlyerExams.length > 1 ? 's' : ''} >95%)`
          : `Peak Score: ${highestSingleExamScore}%`,
        targetValueLabel: '> 95% in an Exam',
        evidenceSummary: highFlyerUnlocked
          ? `Scored above 95% in ${highFlyerExams
              .slice(0, 3)
              .map(e => `${e.subject} ${e.examName} (${e.score}%)`)
              .join(', ')}.`
          : `Your highest single exam score is ${highestSingleExamScore}%. Score 96%+ in an assessment to unlock High Flyer.`,
        xpReward: 250,
        actionButtonLabel: 'Complete High-Flyer 97% Challenge Quiz'
      },
      {
        id: 'active-peer-tutor',
        title: 'Active Peer Tutor',
        tier: 'Gold',
        milestoneRule: 'Host a peer tutoring session or mentor a classmate in the Peer Tutoring Hub',
        unlocked: peerTutorUnlocked,
        progressPct: peerTutorUnlocked ? 100 : 50,
        currentValueLabel: peerTutorUnlocked
          ? `${studentTutoringRecords.length} Active Session${studentTutoringRecords.length > 1 ? 's' : ''}`
          : '0 Sessions Hosted',
        targetValueLabel: '1+ Peer Tutoring Session',
        evidenceSummary: peerTutorUnlocked
          ? `Actively mentoring classmates in ${studentTutoringRecords
              .map(r => `${r.subject} (${r.topic})`)
              .join('; ')}.`
          : 'Host a study session or resolve a classmate’s doubt in the Peer Tutoring Hub to earn this badge.',
        xpReward: 200,
        actionButtonLabel: 'Host Quick Peer Tutoring Session Now'
      },
      {
        id: 'honor-roll',
        title: 'Dean’s Honor Scholar',
        tier: 'Gold',
        milestoneRule: 'Maintain ≥85% Grand Overall Percentage across Unit Tests, Mid-Term & End-Term',
        unlocked: honorRollUnlocked,
        progressPct: honorRollUnlocked
          ? 100
          : Math.min(99, Math.round((currentStudentAcademics.rawGrandPct / 85) * 100)),
        currentValueLabel: `${currentStudentAcademics.rawGrandPct}% Grand Overall`,
        targetValueLabel: '≥ 85.0% Overall',
        evidenceSummary: `Secured ${currentStudentAcademics.grandTotalObtained}/${currentStudentAcademics.grandTotalMaxMarks} total marks (${currentStudentAcademics.rawGrandPct}% • Grade ${currentStudentAcademics.cbseGrade}).`,
        xpReward: 150
      },
      {
        id: 'exemplary-conduct',
        title: 'Exemplary Citizen',
        tier: 'Emerald',
        milestoneRule: 'Zero active indiscipline cases on the School Conduct Chronicle',
        unlocked: conductUnlocked,
        progressPct: conductUnlocked ? 100 : 40,
        currentValueLabel: `${studentDisciplineCount} Conduct Cases`,
        targetValueLabel: '0 Indiscipline Cases',
        evidenceSummary: conductUnlocked
          ? 'Clean conduct record verified by Class Teacher and Directorate Tribunal.'
          : `${studentDisciplineCount} conduct incident(s) currently logged on record.`,
        xpReward: 150
      },
      {
        id: 'quiz-virtuoso',
        title: 'Lab & Quiz Virtuoso',
        tier: 'Amber',
        milestoneRule: 'Complete ≥10 Daily Proctored Quizzes or maintain ≥85% quiz accuracy',
        unlocked: quizUnlocked,
        progressPct: quizUnlocked
          ? 100
          : Math.min(99, Math.round((currentStudent.dailyTestsTaken / 10) * 100)),
        currentValueLabel: `${currentStudent.dailyTestsTaken} Quizzes (${currentStudent.dailyTestAvgScore}% Avg)`,
        targetValueLabel: '10 Quizzes or 85% Avg',
        evidenceSummary: `Completed ${currentStudent.dailyTestsTaken} daily tests with ${currentStudent.dailyTestAvgScore}% accuracy (${currentStudent.dailyTestTotalQuestionsAnswered} questions solved).`,
        xpReward: 150
      }
    ];
  }, [
    highFlyerExams,
    highestSingleExamScore,
    studentTutoringRecords,
    isPerfectAttendanceUnlocked,
    attendancePct,
    currentStudent,
    currentStudentAcademics,
    studentDisciplineCount
  ]);

  const unlockedCount = useMemo(() => badges.filter(b => b.unlocked).length, [badges]);
  const selectedBadge = useMemo(
    () => badges.find(b => b.id === selectedBadgeId) || badges[0],
    [badges, selectedBadgeId]
  );

  // Trigger milestone completion for locked badges so students can test & unlock them live
  const handleCompleteMilestoneAction = (badge: AchievementBadge) => {
    if (badge.id === 'perfect-attendance') {
      setStreakVerifiedByStudent(prev => ({ ...prev, [currentStudent.id]: true }));
      if (!condonedApplied) {
        onApplyMedicalCondonation();
      }
      playUISound('success');
      showToast(
        'Badge Unlocked: Perfect Attendance!',
        `14-Day Attendance Streak & Medical Condonation verified for ${currentStudent.name}.`,
        'success'
      );
    } else if (badge.id === 'high-flyer') {
      setHighFlyerBoostByStudent(prev => ({ ...prev, [currentStudent.id]: true }));
      handleAwardBonusXP(currentStudent.id, 150, 'High Flyer 97% Assessment Milestone');
      playUISound('success');
      showToast(
        'Badge Unlocked: High Flyer!',
        `${currentStudent.name} scored 97% (>95% milestone) to earn the High Flyer badge!`,
        'success'
      );
    } else if (badge.id === 'active-peer-tutor') {
      const newPost: PeerTutoringPost = {
        id: `TUT-${Math.floor(400 + Math.random() * 500)}`,
        type: 'offer',
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        studentGrade: currentStudent.grade,
        studentHouse: currentStudent.house,
        xpLevel: currentStudent.xpLevel,
        points: currentStudent.points,
        subject: currentStudentAcademics.subjectsList[0]?.name || 'Mathematics (NCERT)',
        topic: 'High-Yield Exam Problem Solving & Concept Revision',
        description: `Live peer tutoring table hosted by ${currentStudent.name} for Section ${currentStudent.grade} classmates.`,
        recentUnitAvg: currentStudentAcademics.unitAvg,
        recentFinalScore: highestSingleExamScore,
        availability: 'Today • 03:30 PM – 04:30 PM',
        mode: 'Library Study Table',
        xpBonus: 200,
        status: 'Open',
        createdAt: 'Just now'
      };
      setTutoringPosts(prev => [newPost, ...prev]);
      handleAwardBonusXP(currentStudent.id, 200, 'Unlocked Active Peer Tutor Badge');
      playUISound('success');
      showToast(
        'Badge Unlocked: Active Peer Tutor!',
        `Peer study session published for ${currentStudent.grade}. Digital badge added to your profile!`,
        'success'
      );
    }
  };

  const handleClaimBadgeXP = (badge: AchievementBadge) => {
    const claimKey = `${currentStudent.id}-${badge.id}`;
    if (claimedBadgeIds[claimKey]) return;
    setClaimedBadgeIds(prev => ({ ...prev, [claimKey]: true }));
    handleAwardBonusXP(currentStudent.id, badge.xpReward, `Achievement Badge Claimed: ${badge.title}`);
  };

  return (
    <div
      className={
        standaloneSection
          ? 'bg-[#0A3630] text-[#F5F0E6] border border-[#14463F] rounded-xl p-5 sm:p-6 space-y-4'
          : 'space-y-3 pt-3 border-t border-[#1D5B52]'
      }
    >
      {standaloneSection && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1D5B52] pb-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9CC5BE]">
              Dedicated Student Achievement &amp; Milestone System • {unlockedCount} of {badges.length} Badges Earned
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-[#F5F0E6] mt-0.5">
              Digital Milestone Badges: Perfect Attendance, High Flyer (&gt;95% Exam) &amp; Active Peer Tutor
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-[#4ADE80]">
            Merit Score: {currentStudent.points.toLocaleString()} XP
          </span>
        </div>
      )}

      {/* DIGITAL BADGE BAR */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CC5BE] mr-1">
            Earned Achievements ({unlockedCount}/{badges.length}):
          </span>

          {badges.map(badge => {
            const isSelected = vaultExpanded && selectedBadgeId === badge.id;
            const claimKey = `${currentStudent.id}-${badge.id}`;
            const isClaimed = Boolean(claimedBadgeIds[claimKey]);

            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => {
                  playUISound('click');
                  if (selectedBadgeId === badge.id && vaultExpanded) {
                    setVaultExpanded(false);
                  } else {
                    setSelectedBadgeId(badge.id);
                    setVaultExpanded(true);
                  }
                }}
                title={`${badge.title}: ${badge.evidenceSummary}`}
                className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition cursor-pointer ${
                  badge.unlocked
                    ? isSelected
                      ? 'bg-[#F5F0E6] text-[#072E29] border-white shadow-sm'
                      : 'bg-[#124E45] hover:bg-[#196358] text-[#F5F0E6] border-[#2B7A6E]'
                    : isSelected
                    ? 'bg-[#174941] text-[#E5DEC9] border-[#9CC5BE]'
                    : 'bg-[#072924]/70 hover:bg-[#0D3B34] text-[#8AB0AA] border-[#184B43] opacity-80'
                }`}
              >
                <BadgeEmblemSVG
                  badgeId={badge.id}
                  unlocked={badge.unlocked}
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    badge.unlocked
                      ? isSelected
                        ? 'text-[#0A4D44]'
                        : badge.tier === 'Platinum'
                        ? 'text-[#38BDF8]'
                        : badge.tier === 'Gold'
                        ? 'text-[#FBBF24]'
                        : 'text-[#4ADE80]'
                      : 'text-[#6C938D]'
                  }`}
                />
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold whitespace-nowrap">{badge.title}</span>
                    {badge.unlocked ? (
                      <span
                        className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded ${
                          isSelected
                            ? 'bg-[#0A4D44] text-white'
                            : 'bg-[#072E29] text-[#4ADE80]'
                        }`}
                      >
                        {isClaimed ? 'Claimed' : '✓ Earned'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-[#9CC5BE]">{badge.progressPct}%</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            playUISound('click');
            setVaultExpanded(prev => !prev);
          }}
          className="self-start xl:self-auto px-3 py-1.5 rounded-lg bg-[#072E29] hover:bg-[#124E45] border border-[#2B7A6E] text-[#9CC5BE] hover:text-white text-[11px] font-mono font-semibold transition shrink-0"
        >
          {vaultExpanded ? 'Hide Achievement Vault ▲' : 'Inspect Milestones & Claim XP ▼'}
        </button>
      </div>

      {/* EXPANDABLE MILESTONE INSPECTOR & XP REWARD VAULT */}
      {vaultExpanded && (
        <div className="mt-3 p-4 rounded-xl bg-[#FFFDF9] text-[#1C2A27] border border-[#DDD4C2] space-y-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE2D3] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0E6B5E] block">
                Student Achievement & Milestone System • {currentStudent.name} (#{currentStudent.id})
              </span>
              <h3 className="text-sm font-semibold text-[#1C2A27]">
                Digital Badges: Perfect Attendance, High Flyer (&gt;95% Exam), Active Peer Tutor &amp; More
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#EFF5F3] border border-[#9CC5BE] text-[#0A4D44] font-semibold">
                {unlockedCount} of {badges.length} Badges Unlocked
              </span>
            </div>
          </div>

          {/* 3 Featured Core Milestones + 3 Bonus Milestones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {badges.map(badge => {
              const isFocused = selectedBadge.id === badge.id;
              const claimKey = `${currentStudent.id}-${badge.id}`;
              const isClaimed = Boolean(claimedBadgeIds[claimKey]);

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    playUISound('click');
                    setSelectedBadgeId(badge.id);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                    badge.unlocked
                      ? isFocused
                        ? 'bg-[#0A4D44] text-white border-[#0A4D44] ring-2 ring-[#0A4D44]/30'
                        : 'bg-[#FFFDF9] hover:bg-[#F5F0E6] border-[#DDD4C2]'
                      : isFocused
                      ? 'bg-[#F5F0E6] border-[#9A6B26] ring-2 ring-[#9A6B26]/30'
                      : 'bg-[#FFFDF9] hover:bg-[#F5F0E6] border-[#DDD4C2]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <BadgeEmblemSVG
                          badgeId={badge.id}
                          unlocked={badge.unlocked}
                          className={`w-6 h-6 shrink-0 ${
                            badge.unlocked && isFocused
                              ? 'text-white'
                              : badge.unlocked
                              ? 'text-[#0A4D44]'
                              : 'text-[#8A5A19]'
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className={`text-xs font-bold ${badge.unlocked && isFocused ? 'text-white' : 'text-[#1C2A27]'}`}>
                              {badge.title}
                            </h4>
                            <span
                              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                                badge.unlocked && isFocused
                                  ? 'bg-emerald-900/60 text-emerald-200'
                                  : 'bg-[#EAE2D3] text-[#4A443B]'
                              }`}
                            >
                              {badge.tier}
                            </span>
                          </div>
                          <p
                            className={`text-[10px] font-mono font-semibold ${
                              badge.unlocked && isFocused ? 'text-emerald-200' : 'text-[#0E6B5E]'
                            }`}
                          >
                            {badge.currentValueLabel}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                          badge.unlocked && isFocused
                            ? 'bg-white text-[#0A4D44]'
                            : badge.unlocked
                            ? 'bg-[#0A4D44] text-white'
                            : 'bg-[#EAE2D3] text-[#686052]'
                        }`}
                      >
                        {badge.unlocked ? 'UNLOCKED ✓' : `${badge.progressPct}%`}
                      </span>
                    </div>

                    <p className={`text-[11px] leading-snug ${badge.unlocked && isFocused ? 'text-emerald-100' : 'text-[#5A5346]'}`}>
                      <strong className={badge.unlocked && isFocused ? 'text-white' : 'text-[#1C2A27]'}>Milestone:</strong>{' '}
                      {badge.milestoneRule}
                    </p>

                    <p
                      className={`text-[11px] p-2 rounded-lg border leading-snug ${
                        badge.unlocked && isFocused
                          ? 'bg-black/25 text-emerald-100 border-white/20'
                          : 'text-[#0A4D44] bg-[#F5F0E6] border-[#DDD4C2]'
                      }`}
                    >
                      {badge.evidenceSummary}
                    </p>
                  </div>

                  <div className={`space-y-2 pt-1 border-t ${badge.unlocked && isFocused ? 'border-emerald-700/60' : 'border-[#DDD4C2]'}`}>
                    {/* Progress Bar */}
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${badge.unlocked && isFocused ? 'bg-emerald-950/60' : 'bg-[#EAE2D3]'}`}>
                      <div
                        className={`h-full transition-all duration-500 ${
                          badge.unlocked ? 'bg-[#0A4D44]' : 'bg-[#D97706]'
                        }`}
                        style={{ width: `${badge.progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-[#686052]">
                        Reward: <strong className="text-[#0A4D44]">+{badge.xpReward} Merit XP</strong>
                      </span>

                      {badge.unlocked ? (
                        <button
                          type="button"
                          disabled={isClaimed}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClaimBadgeXP(badge);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                            isClaimed
                              ? 'bg-[#EAE2D3] text-[#686052] cursor-default'
                              : 'bg-[#0A4D44] hover:bg-[#073831] text-white'
                          }`}
                        >
                          {isClaimed ? 'XP Claimed ✓' : `Claim +${badge.xpReward} XP`}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {badge.id === 'active-peer-tutor' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectNavTab('stu-tutoring');
                              }}
                              className="px-2 py-1 rounded-lg bg-[#EAE2D3] hover:bg-[#DDD4C2] text-[#1C2A27] text-[10px] font-semibold"
                            >
                              Open Hub
                            </button>
                          )}
                          {badge.actionButtonLabel && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteMilestoneAction(badge);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#9A6B26] hover:bg-[#7D561E] text-white text-[10px] font-semibold transition"
                            >
                              Unlock Now →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
