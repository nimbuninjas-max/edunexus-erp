import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChatAttachment, ChatMessage, ChatReplyQuote, RoleType, Student, StudyGroup, Teacher } from '../../types/erp';
import { BANNED_SLANG_WORDS } from '../../data/initialData';
import { StreamlineIcon } from '../common/StreamlineIcon';
import { UserAvatar } from '../common/UserAvatar';

interface ChatModuleProps {
  groups: StudyGroup[];
  setGroups: React.Dispatch<React.SetStateAction<StudyGroup[]>>;
  activeRole: RoleType;
  currentStudent: Student;
  activeTeacher: Teacher;
  students: Student[];
  teachers: Teacher[];
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

const SNAP_REACTIONS = ['🔥', '💯', '❤️', '👍', '🎯'];

export const ChatModule: React.FC<ChatModuleProps> = ({
  groups,
  setGroups,
  activeRole,
  currentStudent,
  activeTeacher,
  teachers,
  playUISound,
  showToast
}) => {
  // Channel Mode: 'faculty' (Direct 1-on-1 Faculty Chat) or 'groups' (Study Groups)
  const [channelMode, setChannelMode] = useState<'faculty' | 'groups'>('faculty');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(teachers[0]?.id || '900101');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'grp-10b-math');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile/Tablet Single-Screen Drill-Down State:
  // true = Full-Screen Active Chat View (with Back button + Clear Context Header)
  // false = Full-Screen Directory List View
  const [mobileViewChat, setMobileViewChat] = useState<boolean>(true);

  // Build initial Faculty Direct threads dynamically using each teacher's exact name, ID & subject!
  const [facultyThreads, setFacultyThreads] = useState<Record<string, ChatMessage[]>>(() => {
    const map: Record<string, ChatMessage[]> = {};
    teachers.forEach((t, idx) => {
      if (idx === 0) {
        map[t.id] = [
          {
            id: `dm-${t.id}-1`,
            sender: t.name,
            senderRegNo: t.id,
            isFaculty: true,
            role: `${t.subject} Faculty`,
            text: `Good morning ${currentStudent.name}! Please bring your ${t.subject} Class ${currentStudent.grade} practical record book for sign-off tomorrow.`,
            time: '09:15 AM',
            reactions: { '👍': [currentStudent.id] }
          },
          {
            id: `dm-${t.id}-2`,
            sender: currentStudent.name,
            senderRegNo: currentStudent.id,
            isFaculty: false,
            role: 'Student',
            text: 'Good morning! I have completed all 5 practical readings and plotted the observation graph sheet.',
            time: '09:18 AM',
            reactions: { '🔥': [t.id] }
          },
          {
            id: `dm-${t.id}-3`,
            sender: t.name,
            senderRegNo: t.id,
            isFaculty: true,
            role: `${t.subject} Faculty`,
            text: 'Excellent work. Tap this message to save the formula & sign convention reminder in chat for your upcoming unit test.',
            time: '09:21 AM',
            reactions: { '💯': [currentStudent.id] }
          }
        ];
      } else if (idx === 1) {
        map[t.id] = [
          {
            id: `dm-${t.id}-1`,
            sender: t.name,
            senderRegNo: t.id,
            isFaculty: true,
            role: `${t.subject} Faculty`,
            text: `Hello ${currentStudent.name}! I have uploaded the ${t.subject} NCERT exemplar worksheet to the Study Vault.`,
            time: '10:05 AM',
            reactions: { '❤️': [currentStudent.id] }
          },
          {
            id: `dm-${t.id}-2`,
            sender: currentStudent.name,
            senderRegNo: currentStudent.id,
            isFaculty: false,
            role: 'Student',
            text: 'Thank you! Should we include step-by-step derivations for all numerical questions?',
            time: '10:08 AM'
          },
          {
            id: `dm-${t.id}-3`,
            sender: t.name,
            senderRegNo: t.id,
            isFaculty: true,
            role: `${t.subject} Faculty`,
            text: 'Yes — write the formula and given parameters clearly first for full CBSE step marking.',
            time: '10:11 AM'
          }
        ];
      } else {
        map[t.id] = [
          {
            id: `dm-${t.id}-init`,
            sender: t.name,
            senderRegNo: t.id,
            isFaculty: true,
            role: `${t.subject} Faculty`,
            text: `Hello ${currentStudent.name}! Feel free to message me here regarding ${t.subject} doubts or lab submissions.`,
            time: '08:45 AM'
          }
        ];
      }
    });
    return map;
  });

  // Snapchat "Saved in Chat" Message IDs
  const [savedMessageIds, setSavedMessageIds] = useState<string[]>(() => {
    const firstId = teachers[0]?.id || '900101';
    const secondId = teachers[1]?.id || '900102';
    return [`dm-${firstId}-3`, `dm-${secondId}-3`];
  });
  const [recentlySavedId, setRecentlySavedId] = useState<string | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Composer State
  const [chatText, setChatText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatReplyQuote | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isSendingAnim, setIsSendingAnim] = useState(false);
  const [isTypingReply, setIsTypingReply] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const mySenderId =
    activeRole === 'student'
      ? currentStudent.id
      : activeRole === 'teacher'
      ? activeTeacher.id
      : '100001';

  const mySenderName =
    activeRole === 'student'
      ? currentStudent.name
      : activeRole === 'teacher'
      ? activeTeacher.name
      : 'Principal Directorate';

  const selectedFaculty = useMemo(
    () => teachers.find(t => t.id === selectedFacultyId) || teachers[0],
    [teachers, selectedFacultyId]
  );

  const selectedGroup = useMemo(
    () => groups.find(g => g.id === selectedGroupId) || groups[0],
    [groups, selectedGroupId]
  );

  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return teachers;
    const q = searchQuery.toLowerCase();
    return teachers.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
    );
  }, [teachers, searchQuery]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const q = searchQuery.toLowerCase();
    return groups.filter(
      g => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
    );
  }, [groups, searchQuery]);

  const activeMessages = useMemo(() => {
    const raw =
      channelMode === 'faculty'
        ? facultyThreads[selectedFaculty.id] || []
        : selectedGroup?.messages || [];
    if (showSavedOnly) {
      return raw.filter(m => savedMessageIds.includes(m.id));
    }
    return raw;
  }, [channelMode, facultyThreads, selectedFaculty, selectedGroup, showSavedOnly, savedMessageIds]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, selectedFacultyId, selectedGroupId, channelMode]);

  // Toggle Snapchat "Save in Chat" on tap/click
  const handleToggleSaveMessage = (msgId: string) => {
    playUISound('click');
    setRecentlySavedId(msgId);
    setTimeout(() => setRecentlySavedId(null), 320);

    setSavedMessageIds(prev => {
      const exists = prev.includes(msgId);
      if (exists) {
        return prev.filter(id => id !== msgId);
      } else {
        return [...prev, msgId];
      }
    });
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    playUISound('click');
    const updateMsgList = (list: ChatMessage[]) =>
      list.map(m => {
        if (m.id !== msgId) return m;
        const existing = m.reactions || {};
        const users = existing[emoji] || [];
        const hasReacted = users.includes(mySenderId);
        const nextUsers = hasReacted ? users.filter(u => u !== mySenderId) : [...users, mySenderId];
        return {
          ...m,
          reactions: {
            ...existing,
            [emoji]: nextUsers
          }
        };
      });

    if (channelMode === 'faculty') {
      setFacultyThreads(prev => ({
        ...prev,
        [selectedFaculty.id]: updateMsgList(prev[selectedFaculty.id] || [])
      }));
    } else if (selectedGroup) {
      setGroups(prev =>
        prev.map(g => (g.id === selectedGroup.id ? { ...g, messages: updateMsgList(g.messages) } : g))
      );
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatText.trim();
    if (!trimmed && !pendingAttachment) return;

    // Academic Decorum Filter
    const lower = trimmed.toLowerCase();
    const matchedBanned = BANNED_SLANG_WORDS.find(w => lower.includes(w));
    if (matchedBanned) {
      playUISound('error');
      showToast(
        'Decorum Filter Triggered',
        'Please maintain respectful academic language in faculty and study channels.',
        'danger'
      );
      return;
    }

    playUISound('send');
    setIsSendingAnim(true);
    setTimeout(() => setIsSendingAnim(false), 380);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: mySenderName,
      senderRegNo: mySenderId,
      isFaculty: activeRole !== 'student',
      role: activeRole === 'student' ? 'Student' : 'Faculty',
      text: trimmed || (pendingAttachment ? `Shared attachment: ${pendingAttachment.title}` : ''),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyingTo || undefined,
      attachment: pendingAttachment || undefined
    };

    if (channelMode === 'faculty') {
      const targetFac = selectedFaculty;
      setFacultyThreads(prev => ({
        ...prev,
        [targetFac.id]: [...(prev[targetFac.id] || []), newMsg]
      }));

      // Simulated Snapchat live "Typing..." Bitmoji indicator & smart faculty response
      if (activeRole === 'student') {
        setIsTypingReply(true);
        setTimeout(() => {
          setIsTypingReply(false);
          const autoReply: ChatMessage = {
            id: `msg-reply-${Date.now()}`,
            sender: targetFac.name,
            senderRegNo: targetFac.id,
            isFaculty: true,
            role: `${targetFac.subject} Faculty`,
            text: `Received your note regarding ${targetFac.subject}. I have reviewed it — tap to save this confirmation in chat.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setFacultyThreads(prev => ({
            ...prev,
            [targetFac.id]: [...(prev[targetFac.id] || []), autoReply]
          }));
          playUISound('click');
        }, 1250);
      }
    } else if (selectedGroup) {
      setGroups(prev =>
        prev.map(g =>
          g.id === selectedGroup.id ? { ...g, messages: [...g.messages, newMsg] } : g
        )
      );
    }

    setChatText('');
    setReplyingTo(null);
    setPendingAttachment(null);
    setShowAttachMenu(false);
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-2xl overflow-hidden shadow-xs flex flex-col lg:flex-row h-[calc(100vh-120px)] min-h-[540px] max-h-[700px]">
      {/* =====================================================================
          LEFT SIDEBAR (330px on Desktop, Full-Screen on Mobile when mobileViewChat === false):
          SNAPCHAT-STYLE DIRECTORY FOR INDIVIDUAL FACULTY vs. STUDY GROUPS
         ===================================================================== */}
      <div
        className={`${
          mobileViewChat ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-[330px] border-r border-[#DDD4C2] bg-[#F5F0E6] flex-col shrink-0 h-full`}
      >
        {/* Directory Top Mode Switcher & Search */}
        <div className="p-3 border-b border-[#DDD4C2] space-y-2.5 bg-[#F5F0E6] sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#0A4D44]">
              Select Conversation Channel
            </span>
            <span className="text-[10px] font-mono text-[#686052]">
              {channelMode === 'faculty' ? '1-on-1 Faculty' : 'Peer Groups'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 bg-[#EAE2D3] p-1 rounded-full border border-[#DDD4C2]">
            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setChannelMode('faculty');
              }}
              className={`py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                channelMode === 'faculty'
                  ? 'bg-[#0095F6] text-white shadow-2xs'
                  : 'text-[#5A5346] hover:text-[#1C2A27]'
              }`}
            >
              Teacher Direct ({teachers.length})
            </button>
            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setChannelMode('groups');
              }}
              className={`py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                channelMode === 'groups'
                  ? 'bg-[#8B5CF6] text-white shadow-2xs'
                  : 'text-[#5A5346] hover:text-[#1C2A27]'
              }`}
            >
              Study Groups ({groups.length})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                channelMode === 'faculty'
                  ? 'Search Teacher Name, ID (#900101)...'
                  : 'Search Study Group...'
              }
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-[#FFFDF9] border border-[#DDD4C2] rounded-full text-[#1C2A27] focus:outline-none focus:border-[#0095F6]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#686052] hover:text-[#1C2A27] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Contact / Group Roster */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EAE2D3]">
          {channelMode === 'faculty' ? (
            filteredTeachers.map(fac => {
              const isSelected = fac.id === selectedFaculty.id;
              const thread = facultyThreads[fac.id] || [];
              const lastMsg = thread[thread.length - 1];
              const isLastFromMe = lastMsg?.senderRegNo === mySenderId;

              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    setSelectedFacultyId(fac.id);
                    setReplyingTo(null);
                    setMobileViewChat(true);
                  }}
                  className={`w-full text-left px-3.5 py-3 transition flex items-center gap-3 cursor-pointer ${
                    isSelected ? 'bg-[#0A4D44] text-white border-l-4 border-emerald-400' : 'hover:bg-[#F5F0E6]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <UserAvatar id={fac.id} name={fac.name} size="w-10 h-10" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Faculty Name + ID clearly in roster */}
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#1C2A27]'}`}>{fac.name}</span>
                      <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ${isSelected ? 'bg-emerald-900/60 text-emerald-200' : 'bg-[#E0F2FE] text-[#0284C7]'}`}>
                        #{fac.id}
                      </span>
                    </div>
                    <p className={`text-[11px] font-semibold truncate mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-[#0095F6]'}`}>
                      {fac.subject}
                    </p>
                    {/* Status indicator in sidebar */}
                    <div className={`flex items-center gap-1.5 mt-0.5 text-[10.5px] font-medium ${isSelected ? 'text-emerald-100' : 'text-[#686052]'}`}>
                      {isLastFromMe ? (
                        <span className={`inline-flex items-center gap-1 font-bold ${isSelected ? 'text-emerald-200' : 'text-[#FF234F]'}`}>
                          <span>▶</span> Delivered
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 font-bold ${isSelected ? 'text-emerald-200' : 'text-[#0095F6]'}`}>
                          <span className={`w-2 h-2 rounded-xs inline-block ${isSelected ? 'bg-emerald-300' : 'bg-[#0095F6]'}`} /> New Chat
                        </span>
                      )}
                      <span>·</span>
                      <span className="truncate">{lastMsg ? lastMsg.time : 'Tap to chat'}</span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            filteredGroups.map(grp => {
              const isSelected = grp.id === selectedGroup?.id;
              const lastMsg = grp.messages[grp.messages.length - 1];
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    setSelectedGroupId(grp.id);
                    setReplyingTo(null);
                    setMobileViewChat(true);
                  }}
                  className={`w-full text-left px-3.5 py-3 transition flex items-center gap-3 cursor-pointer ${
                    isSelected ? 'bg-[#0A4D44] text-white border-l-4 border-emerald-400' : 'hover:bg-[#F5F0E6]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                    {grp.category.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#1C2A27]'}`}>{grp.name}</span>
                      <span className={`text-[10px] font-mono font-bold shrink-0 ${isSelected ? 'text-emerald-200' : 'text-[#7C3AED]'}`}>
                        {grp.members} Peers
                      </span>
                    </div>
                    <p className={`text-[11px] font-semibold truncate mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-[#7C3AED]'}`}>
                      {grp.category} Group
                    </p>
                    {lastMsg && (
                      <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-[#686052]'}`}>
                        <strong className={isSelected ? 'text-white' : 'text-[#1C2A27]'}>{lastMsg.sender.split(' ')[0]}:</strong>{' '}
                        {lastMsg.text}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* =====================================================================
          RIGHT CHAT WINDOW (Full-Screen on Mobile when mobileViewChat === true):
          EXPLICIT GROUP VS. INDIVIDUAL HEADER + SNAPCHAT VERTICAL BAR BUBBLES
         ===================================================================== */}
      <div
        className={`${
          mobileViewChat ? 'flex' : 'hidden lg:flex'
        } flex-1 flex-col min-w-0 bg-[#FFFDF9] h-full`}
      >
        {/* PINNED STICKY CONVERSATION CONTEXT HEADER (Always shows Group Name or Faculty Name & ID!) */}
        <div className="px-3 sm:px-4 py-2.5 bg-[#FFFDF9] border-b border-[#DDD4C2] sticky top-0 z-20 shrink-0 space-y-2 shadow-2xs">
          {/* Top Row: Back Button (Mobile) + Active Identity (Faculty Name & ID OR Study Group Name) + Saved Filter */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Mobile/Tablet Back Button to Directory */}
              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  setMobileViewChat(false);
                }}
                className="lg:hidden px-2.5 py-1.5 rounded-xl bg-[#F5F0E6] hover:bg-[#EAE2D3] border border-[#DDD4C2] text-[#1C2A27] text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                title="Back to Faculty & Group List"
              >
                <span>←</span>
                <span>Chats</span>
              </button>

              {channelMode === 'faculty' ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <UserAvatar
                      id={selectedFaculty.id}
                      name={selectedFaculty.name}
                      size="w-9 h-9"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#0095F6] border-2 border-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-[#0095F6] text-white font-mono text-[9.5px] font-extrabold uppercase tracking-wider shrink-0">
                        1-ON-1 TEACHER
                      </span>
                      <h2 className="text-xs sm:text-sm font-extrabold text-[#1C2A27] truncate">
                        {selectedFaculty.name}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[10.5px] font-mono font-bold text-[#0284C7] shrink-0">
                        #{selectedFaculty.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#686052] truncate mt-0.5">
                      <strong className="text-[#0095F6]">{selectedFaculty.subject}</strong> ·{' '}
                      {selectedFaculty.onlineStatus}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {selectedGroup?.category.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-[#8B5CF6] text-white font-mono text-[9.5px] font-extrabold uppercase tracking-wider shrink-0">
                        STUDY GROUP
                      </span>
                      <h2 className="text-xs sm:text-sm font-extrabold text-[#1C2A27] truncate">
                        {selectedGroup?.name}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-[#F3E8FF] border border-[#DDD6FE] text-[10.5px] font-mono font-bold text-[#7C3AED] shrink-0">
                        {selectedGroup?.members} Peers
                      </span>
                    </div>
                    <p className="text-[11px] text-[#686052] truncate mt-0.5">
                      <strong className="text-[#7C3AED]">{selectedGroup?.category}</strong> · Section{' '}
                      {currentStudent.grade} Peer Channel
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Controls: Saved Filter Toggle */}
            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setShowSavedOnly(prev => !prev);
              }}
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-mono font-bold border transition shrink-0 cursor-pointer ${
                showSavedOnly
                  ? 'bg-[#0A4D44] text-white border-[#0A4D44]'
                  : 'bg-[#F5F0E6] text-[#4A443B] border-[#DDD4C2] hover:bg-[#EAE2D3]'
              }`}
              title="Filter messages Saved in Chat"
            >
              {showSavedOnly ? '★ Saved (On)' : `★ Saved (${savedMessageIds.length})`}
            </button>
          </div>

          {/* Quick Switcher Bar */}
          <div className="flex items-center gap-2 pt-1.5 border-t border-[#DDD4C2]">
            <div className="inline-flex rounded-lg bg-[#F5F0E6] border border-[#DDD4C2] p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  setChannelMode('faculty');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  channelMode === 'faculty'
                    ? 'bg-[#0095F6] text-white'
                    : 'text-[#5A5346] hover:text-[#1C2A27]'
                }`}
              >
                Individual Teacher
              </button>
              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  setChannelMode('groups');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  channelMode === 'groups'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'text-[#5A5346] hover:text-[#1C2A27]'
                }`}
              >
                Study Group
              </button>
            </div>

            {channelMode === 'faculty' ? (
              <select
                value={selectedFaculty.id}
                onChange={e => {
                  playUISound('click');
                  setSelectedFacultyId(e.target.value);
                  setReplyingTo(null);
                }}
                aria-label="Select Faculty Thread"
                className="flex-1 min-w-0 px-2.5 py-1 text-xs font-bold bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg text-[#1C2A27] focus:outline-none focus:border-[#0095F6] cursor-pointer truncate"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} (#{t.id}) — {t.subject}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedGroup?.id || ''}
                onChange={e => {
                  playUISound('click');
                  setSelectedGroupId(e.target.value);
                  setReplyingTo(null);
                }}
                aria-label="Select Study Group Thread"
                className="flex-1 min-w-0 px-2.5 py-1 text-xs font-bold bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg text-[#1C2A27] focus:outline-none focus:border-[#8B5CF6] cursor-pointer truncate"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.category} • {g.members} Peers)
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* ===================================================================
            MESSAGE STREAM
           =================================================================== */}
        <div className="flex-1 overflow-y-auto px-3.5 sm:px-5 py-3.5 space-y-2.5 bg-[#F5F0E6]">
          {/* Context & Save Instruction Pill */}
          <div className="flex justify-center pb-1">
            <span className="px-3 py-0.5 rounded-full bg-[#FFFDF9] border border-[#DDD4C2] text-[10px] font-mono uppercase tracking-wider text-[#686052] font-bold text-center">
              {channelMode === 'faculty'
                ? `DIRECT CHAT WITH ${selectedFaculty.name.toUpperCase()} (#${selectedFaculty.id}) • TAP BUBBLE TO SAVE`
                : `GROUP CHAT: ${selectedGroup?.name.toUpperCase()} • TAP BUBBLE TO SAVE`}
            </span>
          </div>

          {activeMessages.length === 0 && (
            <div className="py-12 text-center text-xs text-[#686052]">
              No saved messages in this conversation yet. Tap any chat bubble to save it!
            </div>
          )}

          {activeMessages.map((msg, idx) => {
            const isMine = msg.senderRegNo === mySenderId;
            const isSaved = savedMessageIds.includes(msg.id);
            const isJustSaved = recentlySavedId === msg.id;

            const snapAccentHex = isMine
              ? '#FF234F'
              : channelMode === 'faculty' || msg.isFaculty
              ? '#0095F6'
              : '#8B5CF6';

            const senderHeaderLabel = isMine
              ? 'ME'
              : `${msg.sender.toUpperCase()} • #${msg.senderRegNo}`;

            const reactionsEntries = (
              Object.entries(msg.reactions || {}) as [string, string[]][]
            ).filter(([, list]) => list.length > 0);

            const isLatestOutgoing = isMine && idx === activeMessages.length - 1;

            return (
              <div
                key={msg.id}
                className={`group animate-snap-msg select-none ${
                  isJustSaved ? 'animate-snap-saved' : ''
                }`}
              >
                {/* SENDER LABEL HEADER */}
                <div className="flex items-center justify-between gap-2 mb-0.5 px-0.5">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <span
                      className="text-[10.5px] font-extrabold tracking-wider uppercase font-sans truncate"
                      style={{ color: snapAccentHex }}
                    >
                      {senderHeaderLabel}
                    </span>
                    {isSaved && (
                      <span className="px-1.5 py-0.5 rounded bg-[#EAE2D3] text-[#4A443B] text-[9px] font-mono font-bold uppercase tracking-wider shrink-0">
                        SAVED IN CHAT
                      </span>
                    )}
                  </div>

                  {/* Timestamp + Quick Hover Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-[#FFFDF9] border border-[#DDD4C2] rounded-full px-1.5 py-0.5 shadow-2xs">
                      {SNAP_REACTIONS.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleToggleReaction(msg.id, emoji);
                          }}
                          className="text-[11px] hover:scale-125 transition px-0.5 cursor-pointer"
                          title={`React ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          playUISound('click');
                          setReplyingTo({
                            id: msg.id,
                            sender: isMine ? 'Me' : msg.sender,
                            senderRegNo: msg.senderRegNo,
                            text: msg.text
                          });
                        }}
                        className="text-[10px] font-mono font-bold text-[#0095F6] px-1 hover:underline cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                    <span className="text-[10px] font-mono text-[#8C8270] whitespace-nowrap">
                      {msg.time}
                    </span>
                  </div>
                </div>

                {/* ACCENT BAR MESSAGE BODY (Tap to Save in Chat) */}
                <div
                  onClick={() => handleToggleSaveMessage(msg.id)}
                  style={{
                    borderLeftColor: snapAccentHex,
                    borderLeftWidth: isSaved ? '5.5px' : '3.5px'
                  }}
                  className={`relative pl-3 pr-3.5 py-2 rounded-r-xl transition-all duration-150 cursor-pointer ${
                    isSaved
                      ? 'bg-[#EAE2D3] shadow-2xs'
                      : 'bg-[#FFFDF9] hover:bg-[#F5F0E6]'
                  }`}
                  title="Tap to toggle Save in Chat"
                >
                  {/* Quoted Reply Block */}
                  {msg.replyTo && (
                    <div className="mb-1.5 pl-2.5 py-1 rounded-r-lg bg-[#EAE2D3] border-l-2 border-[#686052] text-[11px]">
                      <span className="font-extrabold uppercase text-[10px] block text-[#4A443B]">
                        {msg.replyTo.sender}
                      </span>
                      <span className="text-[#5A5346] line-clamp-1">{msg.replyTo.text}</span>
                    </div>
                  )}

                  {/* Attachment Card */}
                  {msg.attachment && (
                    <div className="mb-1.5 p-2 rounded-xl bg-[#FFFDF9] border border-[#DDD4C2] flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 rounded bg-[#0095F6] text-white text-[10px] uppercase font-bold">
                          {msg.attachment.type}
                        </span>
                        <span className="truncate font-semibold text-[#1C2A27]">
                          {msg.attachment.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#686052] shrink-0">
                        {msg.attachment.meta}
                      </span>
                    </div>
                  )}

                  {/* Clean Message Copy */}
                  <p className="text-[13px] sm:text-[13.5px] font-medium text-[#1C2A27] leading-snug break-words">
                    {msg.text}
                  </p>

                  {/* Reactions Pill Row */}
                  {reactionsEntries.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {reactionsEntries.map(([emoji, users]) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleToggleReaction(msg.id, emoji);
                          }}
                          className="px-2 py-0.5 rounded-full text-[11px] bg-[#FFFDF9] border border-[#DDD4C2] text-[#1C2A27] shadow-2xs flex items-center gap-1 cursor-pointer hover:scale-105 transition"
                        >
                          <span>{emoji}</span>
                          <span className="font-mono text-[10px] font-bold">{users.length}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Bar below latest outgoing message */}
                {isLatestOutgoing && (
                  <div className="flex items-center gap-1.5 mt-1 pl-1 text-[10.5px] font-mono text-[#686052]">
                    <span className="text-[#FF234F] font-bold">▶</span>
                    <span className="font-semibold text-[#4A443B]">
                      {isSaved ? 'Saved in Chat' : 'Delivered • Opened just now'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Presence Bubble */}
          {isTypingReply && channelMode === 'faculty' && (
            <div className="animate-snap-msg pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0095F6] block mb-0.5">
                {selectedFaculty.name.toUpperCase()} IS TYPING...
              </span>
              <div className="inline-flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-r-xl bg-[#FFFDF9] border-l-[3.5px] border-[#0095F6] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#0095F6] animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-[#0095F6] animate-bounce"
                  style={{ animationDelay: '120ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-[#0095F6] animate-bounce"
                  style={{ animationDelay: '240ms' }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ===================================================================
            PILL COMPOSER BAR
           =================================================================== */}
        <div className="p-2.5 bg-[#FFFDF9] border-t border-[#DDD4C2] space-y-2 shrink-0">
          {/* Active Reply or Attachment Preview Strip */}
          {(replyingTo || pendingAttachment) && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#F5F0E6] border border-[#DDD4C2] text-xs">
              {replyingTo && (
                <div className="truncate border-l-2 border-[#0095F6] pl-2">
                  <span className="font-bold text-[#0095F6]">
                    Replying to {replyingTo.sender}:
                  </span>{' '}
                  <span className="text-[#4A443B]">{replyingTo.text}</span>
                </div>
              )}
              {pendingAttachment && (
                <div className="font-mono text-[#0095F6] font-semibold">
                  📎 {pendingAttachment.title} ({pendingAttachment.meta})
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setPendingAttachment(null);
                }}
                className="text-xs font-bold text-[#8B2626] cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick Attachment Picker Drawer */}
          {showAttachMenu && (
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-[#F5F0E6] border border-[#DDD4C2]">
              {[
                { title: 'NCERT_Homework_Solution.pdf', type: 'document' as const, meta: '1.2 MB' },
                { title: 'Lab_Observation_Graph.png', type: 'gallery' as const, meta: '840 KB' },
                { title: 'Practical_Formula_Sheet.pdf', type: 'document' as const, meta: '620 KB' }
              ].map(att => (
                <button
                  key={att.title}
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    setPendingAttachment(att);
                    setShowAttachMenu(false);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#FFFDF9] hover:bg-[#F5F0E6] border border-[#DDD4C2] text-xs font-mono text-[#1C2A27] cursor-pointer transition"
                >
                  📎 {att.title}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* Circular Attachment Button */}
            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setShowAttachMenu(prev => !prev);
              }}
              className="w-9 h-9 rounded-full bg-[#F5F0E6] hover:bg-[#EAE2D3] border border-[#DDD4C2] text-[#1C2A27] flex items-center justify-center shrink-0 transition cursor-pointer"
              title="Attach Document or Snapshot"
            >
              <StreamlineIcon name="plus" className="w-4 h-4" />
            </button>

            {/* Pill Input Field */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={chatText}
                onChange={e => setChatText(e.target.value)}
                placeholder={
                  channelMode === 'faculty'
                    ? `Chat with ${selectedFaculty.name}...`
                    : `Message ${selectedGroup?.name}...`
                }
                className="w-full pl-4 pr-20 py-2 text-xs sm:text-sm font-medium bg-[#F5F0E6] border border-[#DDD4C2] focus:border-[#0095F6] focus:bg-[#FFFDF9] rounded-full text-[#1C2A27] placeholder:text-[#78716C] focus:outline-none transition"
              />

              {/* Quick Reaction Emojis inside Right Edge of Pill Input */}
              <div className="absolute right-2.5 flex items-center gap-1">
                {['🔥', '💯', '👍'].map(emo => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => setChatText(prev => `${prev}${emo}`)}
                    className="text-xs hover:scale-125 transition cursor-pointer opacity-75 hover:opacity-100"
                    title={`Insert ${emo}`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

            {/* Send Pill Button */}
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#0095F6] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs transition"
            >
              <StreamlineIcon
                name="send"
                className={`w-3.5 h-3.5 ${isSendingAnim ? 'animate-plane-send' : ''}`}
              />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
