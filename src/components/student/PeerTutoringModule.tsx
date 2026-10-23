import React, { useState, useMemo } from 'react';
import {
  PeerTutoringPost,
  RankedStudent,
  Student,
  StudentAcademicSummary
} from '../../types/erp';
import { SUBJECT_NAMES } from '../../data/initialData';
import { UserAvatar } from '../common/UserAvatar';

interface PeerTutoringModuleProps {
  currentStudent: Student;
  rankedStudents: RankedStudent[];
  getStudentAcademicSummary: (studentId: string) => StudentAcademicSummary;
  tutoringPosts: PeerTutoringPost[];
  setTutoringPosts: React.Dispatch<React.SetStateAction<PeerTutoringPost[]>>;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

export const PeerTutoringModule: React.FC<PeerTutoringModuleProps> = ({
  currentStudent,
  rankedStudents,
  getStudentAcademicSummary,
  tutoringPosts,
  setTutoringPosts,
  handleAwardBonusXP,
  playUISound,
  showToast
}) => {
  const [activeFilterType, setActiveFilterType] = useState<'all' | 'offer' | 'request'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All Subjects');

  // Form State to Offer or Request Peer Tutoring
  const [postMode, setPostMode] = useState<'offer' | 'request'>('request');
  const [subject, setSubject] = useState(SUBJECT_NAMES[0]);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState('Today, 04:00 PM – 04:45 PM');
  const [sessionVenue, setSessionVenue] = useState<PeerTutoringPost['mode']>('Online Live Doubt Room');

  // Look up current student's live performance in the selected subject
  const currentStudentAcad = useMemo(
    () => getStudentAcademicSummary(currentStudent.id),
    [getStudentAcademicSummary, currentStudent.id]
  );

  const selectedSubjectStats = useMemo(() => {
    const found = currentStudentAcad.subjectsList.find(s => s.name === subject) || currentStudentAcad.subjectsList[0];
    return {
      unitAvg: found?.unitPct || currentStudentAcad.unitAvg,
      finalScore: found?.final || currentStudentAcad.finalExam,
      overall100: found?.subjectOverall100 || currentStudentAcad.combinedOverallPct
    };
  }, [currentStudentAcad, subject]);

  // Top Verified Peer Mentors Leaderboard Strip (Students with XP Level >= 14)
  const topPeerMentors = useMemo(() => {
    return rankedStudents
      .filter(s => s.xpLevel >= 14)
      .slice(0, 4)
      .map(s => {
        const acad = getStudentAcademicSummary(s.id);
        const bestSub = [...acad.subjectsList].sort((a, b) => b.subjectOverall100 - a.subjectOverall100)[0];
        return {
          ...s,
          combinedPct: acad.combinedOverallPct,
          bestSubjectName: bestSub?.name || 'Computer Science & AI',
          bestSubjectScore: bestSub?.subjectOverall100 || 96
        };
      });
  }, [rankedStudents, getStudentAcademicSummary]);

  const filteredPosts = useMemo(() => {
    return tutoringPosts.filter(post => {
      if (activeFilterType !== 'all' && post.type !== activeFilterType) return false;
      if (selectedSubjectFilter !== 'All Subjects' && post.subject !== selectedSubjectFilter) return false;
      return true;
    });
  }, [tutoringPosts, activeFilterType, selectedSubjectFilter]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !description.trim()) return;

    const created: PeerTutoringPost = {
      id: `TUT-${Math.floor(106 + Math.random() * 800)}`,
      type: postMode,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentGrade: currentStudent.grade,
      studentHouse: currentStudent.house,
      xpLevel: currentStudent.xpLevel,
      points: currentStudent.points,
      subject,
      topic: topic.trim(),
      description: description.trim(),
      recentUnitAvg: selectedSubjectStats.unitAvg,
      recentFinalScore: selectedSubjectStats.finalScore,
      availability,
      mode: sessionVenue,
      xpBonus: postMode === 'offer' ? 125 : 100,
      status: 'Open',
      createdAt: 'Just now'
    };

    setTutoringPosts(prev => [created, ...prev]);
    setTopic('');
    setDescription('');
    handleAwardBonusXP(
      currentStudent.id,
      40,
      postMode === 'offer'
        ? `Published Peer Tutoring Offer in ${subject}`
        : `Posted Peer Study Request in ${subject}`
    );
  };

  const handleBookOrAcceptSession = (post: PeerTutoringPost) => {
    if (post.studentId === currentStudent.id) {
      showToast('Your Own Listing', 'You created this tutoring listing.', 'warning');
      return;
    }

    setTutoringPosts(prev =>
      prev.map(item =>
        item.id === post.id
          ? {
              ...item,
              status: 'Session Booked',
              matchedWithName: currentStudent.name,
              matchedWithRegNo: currentStudent.id
            }
          : item
      )
    );

    handleAwardBonusXP(
      currentStudent.id,
      post.xpBonus,
      post.type === 'offer'
        ? `Booked 1-on-1 Peer Tutoring with ${post.studentName} (#${post.studentId}) in ${post.subject}`
        : `Accepted Peer Mentoring Request to help ${post.studentName} (#${post.studentId}) in ${post.subject}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0A3630] text-[#F5F0E6] rounded-xl p-5 sm:p-6 border border-[#14463F] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9CC5BE]">
            Collaborative Academic Mentorship • Reg #{currentStudent.id}
          </p>
          <h1 className="text-lg sm:text-xl font-semibold text-[#F5F0E6]">
            Peer Tutoring & Subject Mentorship Exchange
          </h1>
          <p className="text-xs text-[#C5D6D1]">
            Request 1-on-1 help from top-scoring peers or offer mentorship in your strongest subjects. Every card displays verified XP Level, Unit Test average, and Final Term subject performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-[#124E45] border border-[#2B7A6E] text-xs">
            <span className="text-[#9CC5BE] block text-[10px] uppercase">My Mentor Profile</span>
            <strong className="text-white font-mono">
              XP Lvl {currentStudent.xpLevel} ({currentStudent.points.toLocaleString()} pts)
            </strong>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#124E45] border border-[#2B7A6E] text-xs">
            <span className="text-[#9CC5BE] block text-[10px] uppercase">Open Sessions</span>
            <strong className="text-[#E5DEC9] font-mono">
              {tutoringPosts.filter(p => p.status === 'Open').length} Active Listings
            </strong>
          </div>
        </div>
      </div>

      {/* Verified Top Peer Mentors Showcase (Displaying XP Level & Recent Subject Performance) */}
      <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
              Verified High-XP Subject Mentors
            </p>
            <h2 className="text-sm font-semibold text-[#1C2A27] mt-0.5">
              Top Peer Tutors Ranked by XP Level & Recent Subject Performance
            </h2>
          </div>
          <span className="text-[11px] text-[#686052]">
            Verified against official CBSE / ICSE Gradebook
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {topPeerMentors.map(mentor => (
            <div
              key={mentor.id}
              className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] flex flex-col justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <UserAvatar id={mentor.id} name={mentor.name} size="w-10 h-10" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-[#1C2A27] truncate">{mentor.name}</p>
                    <span className="px-1.5 py-0.5 rounded bg-[#0A4D44] text-[#F5F0E6] font-mono text-[10px] font-bold">
                      Lvl {mentor.xpLevel}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-[#686052]">
                    Reg #{mentor.id} • Section {mentor.grade}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FFFDF9] border border-[#DDD4C2] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#686052]">Top Subject:</span>
                  <strong className="text-[#0A4D44] truncate max-w-[120px]">{mentor.bestSubjectName.split(' ')[0]}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#686052]">Subject Score:</span>
                  <strong className="font-mono text-[#0A4D44]">{mentor.bestSubjectScore}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#686052]">Overall Aggregate:</span>
                  <strong className="font-mono text-[#1C2A27]">{mentor.combinedPct}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Left = Offer/Request Form, Right = Live Peer Tutoring Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create Offer or Request Form */}
        <form
          onSubmit={handleCreatePost}
          className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4 h-fit"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
              Publish Listing • Reg #{currentStudent.id}
            </p>
            <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
              Offer Mentorship or Request Subject Help
            </h3>
          </div>

          {/* Toggle Offer vs Request */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F5F0E6] rounded-xl border border-[#D5CBB8]">
            <button
              type="button"
              onClick={() => { playUISound('click'); setPostMode('request'); }}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                postMode === 'request'
                  ? 'bg-[#9A6B26] text-white shadow-2xs'
                  : 'text-[#5A5346] hover:text-[#1C2A27]'
              }`}
            >
              🙋‍♂️ Request Help
            </button>
            <button
              type="button"
              onClick={() => { playUISound('click'); setPostMode('offer'); }}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                postMode === 'offer'
                  ? 'bg-[#0A4D44] text-[#F5F0E6] shadow-2xs'
                  : 'text-[#5A5346] hover:text-[#1C2A27]'
              }`}
            >
              🎓 Offer Tutoring
            </button>
          </div>

          {/* Subject Selector + Live Subject Performance Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#5A5346]">Select Subject</label>
            <select
              value={subject}
              onChange={(e) => { playUISound('click'); setSubject(e.target.value); }}
              className="w-full px-3 py-2 text-xs font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
            >
              {SUBJECT_NAMES.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Auto-attached XP Level & Recent Subject Performance Badge */}
            <div className="p-3 rounded-lg bg-[#EFF5F3] border border-[#9CC5BE] text-[11px] space-y-1">
              <div className="flex items-center justify-between font-semibold text-[#0A4D44]">
                <span>Auto-Attached Subject Credentials</span>
                <span className="font-mono">XP Level {currentStudent.xpLevel}</span>
              </div>
              <p className="text-[#2C3532]">
                Your recent <strong>{subject.split(' ')[0]}</strong> performance: Unit Avg <strong>{selectedSubjectStats.unitAvg}%</strong> • Final Score <strong>{selectedSubjectStats.finalScore}%</strong> (Overall {selectedSubjectStats.overall100}%)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5A5346] mb-1">
              Specific Chapter / Topic
            </label>
            <input
              type="text"
              required
              placeholder={
                postMode === 'offer'
                  ? 'e.g. Python Functions & Binary Search Dry Run'
                  : 'e.g. Need help solving Quadratic Equations Ex 4.3'
              }
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-[#5A5346] mb-1">Preferred Slot</label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#5A5346] mb-1">Study Mode</label>
              <select
                value={sessionVenue}
                onChange={(e) => setSessionVenue(e.target.value as PeerTutoringPost['mode'])}
                className="w-full px-2.5 py-1.5 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              >
                <option value="Online Live Doubt Room">Online Live Doubt Room</option>
                <option value="Library Study Table">Library Study Table</option>
                <option value="Lab Practical Desk">Lab Practical Desk</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5A5346] mb-1">
              Session Details & Notes
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe what concepts or numerical exercises will be covered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-lg text-xs font-semibold text-white transition ${
              postMode === 'offer'
                ? 'bg-[#0A4D44] hover:bg-[#073831]'
                : 'bg-[#9A6B26] hover:bg-[#7D551D]'
            }`}
          >
            {postMode === 'offer'
              ? 'Publish Tutoring Offer (+40 XP)'
              : 'Post Help Request (+40 XP)'}
          </button>
        </form>

        {/* Right Column: Live Peer Tutoring & Help Requests Board */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Controls */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: `All Listings (${tutoringPosts.length})` },
                { id: 'offer', label: `🎓 Tutors Offering Help (${tutoringPosts.filter(p => p.type === 'offer').length})` },
                { id: 'request', label: `🙋‍♂️ Students Requesting Help (${tutoringPosts.filter(p => p.type === 'request').length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { playUISound('click'); setActiveFilterType(tab.id as 'all' | 'offer' | 'request'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeFilterType === tab.id
                      ? 'bg-[#0A4D44] text-[#F5F0E6]'
                      : 'bg-[#F5F0E6] text-[#4A443B] hover:bg-[#EAE2D3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <select
              value={selectedSubjectFilter}
              onChange={(e) => { playUISound('click'); setSelectedSubjectFilter(e.target.value); }}
              className="px-3 py-1.5 text-xs font-medium bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
            >
              <option value="All Subjects">All Subjects</option>
              {SUBJECT_NAMES.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Cards Stream */}
          <div className="space-y-3.5">
            {filteredPosts.map(post => {
              const isOffer = post.type === 'offer';
              const isBooked = post.status !== 'Open';

              return (
                <div
                  key={post.id}
                  className={`bg-[#FFFDF9] rounded-xl p-5 border transition space-y-3.5 ${
                    isOffer ? 'border-[#C5D6D1]' : 'border-[#E6C89C]'
                  }`}
                >
                  {/* Top Row: Student Info, XP Level Badge, and Recent Subject Performance */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2D3] pb-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar id={post.studentId} name={post.studentName} size="w-11 h-11" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isOffer
                                ? 'bg-[#EFF5F3] text-[#0A4D44] border border-[#9CC5BE]'
                                : 'bg-[#FDF4E7] text-[#9A6B26] border border-[#E6C89C]'
                            }`}
                          >
                            {isOffer ? '🎓 Peer Tutor Offer' : '🙋‍♂️ Help Request'}
                          </span>
                          <span className="text-xs font-semibold text-[#1C2A27]">
                            {post.studentName}
                          </span>
                          <span className="text-[11px] font-mono text-[#0E6B5E] font-semibold">
                            Reg #{post.studentId} • Section {post.studentGrade}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#686052] mt-0.5">
                          {post.studentHouse} • Posted {post.createdAt} • {post.mode}
                        </p>
                      </div>
                    </div>

                    {/* Tutor XP Level & Recent Subject Performance Pill Box */}
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <div className="px-3 py-1.5 rounded-lg bg-[#0A3630] text-[#F5F0E6] text-right">
                        <span className="text-[9px] uppercase tracking-wider text-[#9CC5BE] block">
                          XP Level {post.xpLevel}
                        </span>
                        <span className="text-xs font-mono font-bold">
                          {post.points.toLocaleString()} XP
                        </span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-[#EFF5F3] border border-[#9CC5BE] text-right">
                        <span className="text-[9px] uppercase tracking-wider text-[#0E6B5E] font-semibold block">
                          Recent {post.subject.split(' ')[0]} Score
                        </span>
                        <span className="text-xs font-mono font-bold text-[#0A4D44]">
                          Unit: {post.recentUnitAvg}% • Final: {post.recentFinalScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Topic & Description */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0E6B5E]">
                        {post.subject}
                      </span>
                      <span className="text-[11px] font-medium text-[#686052]">
                        Slot: <strong className="text-[#1C2A27]">{post.availability}</strong>
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#1C2A27]">{post.topic}</h4>
                    <p className="text-xs text-[#4A443B] leading-relaxed">{post.description}</p>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-2 border-t border-[#EAE2D3] flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-mono font-semibold text-[#0A4D44]">
                      Mentorship Reward: +{post.xpBonus} Merit XP
                    </span>

                    {isBooked ? (
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#EFF5F3] border border-[#9CC5BE] text-[#0A4D44] text-xs font-semibold">
                        ✓ Matched with {post.matchedWithName} (#{post.matchedWithRegNo})
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBookOrAcceptSession(post)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition ${
                          isOffer
                            ? 'bg-[#0A4D44] hover:bg-[#073831]'
                            : 'bg-[#9A6B26] hover:bg-[#7D551D]'
                        }`}
                      >
                        {isOffer
                          ? `Book Peer Session with ${post.studentName.split(' ')[0]} (+${post.xpBonus} XP)`
                          : `Offer to Mentor ${post.studentName.split(' ')[0]} (+${post.xpBonus} XP)`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
