import React, { useState, useMemo } from 'react';
import { CalendarEvent, RoleType } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';

interface SchoolCalendarModuleProps {
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  currentUserRegNo: string;
  currentUserName: string;
  activeRole: RoleType;
  onAwardXP?: (amount: number, reason: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

interface CalendarMonthMeta {
  key: string;
  label: string;
  year: number;
  monthIndex0: number; // 0 = Jan, 9 = Oct
  daysInMonth: number;
}

const ACADEMIC_MONTHS: CalendarMonthMeta[] = [
  { key: 'October', label: 'October 2026', year: 2026, monthIndex0: 9, daysInMonth: 31 },
  { key: 'November', label: 'November 2026', year: 2026, monthIndex0: 10, daysInMonth: 30 },
  { key: 'December', label: 'December 2026', year: 2026, monthIndex0: 11, daysInMonth: 31 },
  { key: 'January', label: 'January 2027', year: 2027, monthIndex0: 0, daysInMonth: 31 },
  { key: 'February', label: 'February 2027', year: 2027, monthIndex0: 1, daysInMonth: 28 }
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getNextDayDateString = (dateStr: string): string => {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3) return dateStr;
  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + 1));
  return dt.toISOString().slice(0, 10);
};

export const SchoolCalendarModule: React.FC<SchoolCalendarModuleProps> = ({
  calendarEvents,
  setCalendarEvents,
  currentUserRegNo,
  currentUserName,
  activeRole,
  onAwardXP,
  playUISound,
  showToast
}) => {
  const [activeMonthIdx, setActiveMonthIdx] = useState<number>(0); // Default October 2026
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  const [rightPaneTab, setRightPaneTab] = useState<'events' | 'od' | 'add'>('events');

  // OD Leave Application States
  const [leaveEventId, setLeaveEventId] = useState(calendarEvents[0]?.id || 'CAL-102');
  const [leaveReason, setLeaveReason] = useState('Selected to represent House in Inter-School Olympiad / Robotics Sprint');
  const [submittedLeaves, setSubmittedLeaves] = useState<
    { id: string; eventTitle: string; applicant: string; regNo: string; reason: string; status: string }[]
  >([
    {
      id: 'OD-801',
      eventTitle: 'ISRO Space & Robotics Inter-School Hackathon (22 Oct 2026)',
      applicant: currentUserName,
      regNo: currentUserRegNo,
      reason: 'Lead Python Coder for Agni House Rover Team; requesting On-Duty attendance credit.',
      status: 'Approved ✓'
    }
  ]);

  // Add Personal Reminder / Event States
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-10-27');
  const [newCategory, setNewCategory] = useState<CalendarEvent['category']>('Examination');
  const [newDesc, setNewDesc] = useState('');

  const activeMonthMeta = ACADEMIC_MONTHS[activeMonthIdx] || ACADEMIC_MONTHS[0];

  // Events for the active month (and optional category filter)
  const monthEvents = useMemo(() => {
    return calendarEvents.filter(ev => {
      if (ev.month !== activeMonthMeta.key) return false;
      if (selectedCategory !== 'All' && ev.category !== selectedCategory) return false;
      return true;
    });
  }, [calendarEvents, activeMonthMeta.key, selectedCategory]);

  // Map date ISO ('YYYY-MM-DD') -> CalendarEvent[]
  const eventsByDateMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    calendarEvents.forEach(ev => {
      if (selectedCategory !== 'All' && ev.category !== selectedCategory) return;
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [calendarEvents, selectedCategory]);

  // Build 7-column calendar cells for activeMonthMeta
  const calendarGridCells = useMemo(() => {
    const firstDayOfWeek = new Date(activeMonthMeta.year, activeMonthMeta.monthIndex0, 1).getDay();
    const cells: { dayNumber: number | null; dateISO: string | null; events: CalendarEvent[]; isSunday: boolean }[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ dayNumber: null, dateISO: null, events: [], isSunday: i % 7 === 0 });
    }

    for (let day = 1; day <= activeMonthMeta.daysInMonth; day++) {
      const mm = String(activeMonthMeta.monthIndex0 + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const dateISO = `${activeMonthMeta.year}-${mm}-${dd}`;
      const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
      cells.push({
        dayNumber: day,
        dateISO,
        events: eventsByDateMap[dateISO] || [],
        isSunday: dayOfWeek === 0
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ dayNumber: null, dateISO: null, events: [], isSunday: cells.length % 7 === 0 });
    }

    return cells;
  }, [activeMonthMeta, eventsByDateMap]);

  // Events shown in the right-hand inspector (either for the clicked date or the whole active month)
  const inspectedEvents = useMemo(() => {
    if (selectedDateISO) {
      return eventsByDateMap[selectedDateISO] || [];
    }
    return monthEvents;
  }, [selectedDateISO, eventsByDateMap, monthEvents]);

  const handleToggleRSVP = (eventId: string) => {
    playUISound('click');
    setCalendarEvents(prev =>
      prev.map(ev => {
        if (ev.id !== eventId) return ev;
        const exists = ev.rsvpBy.includes(currentUserRegNo);
        const nextRsvp = exists
          ? ev.rsvpBy.filter(id => id !== currentUserRegNo)
          : [...ev.rsvpBy, currentUserRegNo];
        if (!exists && onAwardXP && !ev.isHoliday) {
          onAwardXP(25, `Set Calendar Reminder: ${ev.title}`);
        } else {
          showToast(
            exists ? 'Reminder Removed' : 'Reminder Active',
            `${ev.title} (${ev.displayDate}) updated.`,
            'success'
          );
        }
        return { ...ev, rsvpBy: nextRsvp };
      })
    );
  };

  const handleDownloadICS = (eventsToExport: CalendarEvent[]) => {
    playUISound('success');
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EduNexus Vidya Mandir//Academic Calendar 2026-27//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    eventsToExport.forEach(ev => {
      const startClean = ev.date.replace(/-/g, '');
      const endClean = getNextDayDateString(ev.date).replace(/-/g, '');
      lines.push(
        'BEGIN:VEVENT',
        `UID:${ev.id}-${currentUserRegNo}@edunexus.edu.in`,
        `DTSTART;VALUE=DATE:${startClean}`,
        `DTEND;VALUE=DATE:${endClean}`,
        `SUMMARY:[EduNexus] ${ev.title} (${ev.category})`,
        `DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}`,
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduNexus_Calendar_${activeMonthMeta.key}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Calendar (.ics) Downloaded', `Exported ${eventsToExport.length} events for Apple/Google/Outlook Calendar.`, 'success');
  };

  const getCategoryStyle = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case 'Gazetted Holiday':
        return { dot: 'bg-[#DC2626]', badge: 'bg-[#FAF2F2] text-[#8B2626] border-[#E2C9C9]', short: 'Holiday' };
      case 'Examination':
        return { dot: 'bg-[#D97706]', badge: 'bg-[#FDF4E7] text-[#9A6B26] border-[#E6C89C]', short: 'Exam' };
      case 'PTM':
        return { dot: 'bg-[#0284C7]', badge: 'bg-sky-50 text-sky-900 border-sky-200', short: 'PTM' };
      default:
        return { dot: 'bg-[#0A4D44]', badge: 'bg-[#EFF5F3] text-[#0A4D44] border-[#9CC5BE]', short: 'Event' };
    }
  };

  return (
    <div className="space-y-4">
      {/* =====================================================================
          ROW 1: STICKY COMPACT CALENDAR CONTROL BAR (MONTH SWITCHER + DROPDOWN FILTER)
         ===================================================================== */}
      <div className="sticky top-2 z-30 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-2.5 sm:p-3.5 flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
        {/* Month Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg p-0.5">
            <button
              type="button"
              disabled={activeMonthIdx === 0}
              onClick={() => {
                playUISound('click');
                setActiveMonthIdx(prev => Math.max(0, prev - 1));
                setSelectedDateISO(null);
              }}
              className="px-2.5 py-1 text-xs font-bold text-[#1C2A27] disabled:opacity-40 cursor-pointer"
            >
              ← Prev
            </button>
            <select
              value={activeMonthIdx}
              onChange={e => {
                playUISound('click');
                setActiveMonthIdx(Number(e.target.value));
                setSelectedDateISO(null);
              }}
              className="px-3 py-1 text-xs font-bold bg-white border-x border-[#D5CBB8] text-[#0A4D44] focus:outline-none"
            >
              {ACADEMIC_MONTHS.map((m, idx) => (
                <option key={m.key} value={idx}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={activeMonthIdx === ACADEMIC_MONTHS.length - 1}
              onClick={() => {
                playUISound('click');
                setActiveMonthIdx(prev => Math.min(ACADEMIC_MONTHS.length - 1, prev + 1));
                setSelectedDateISO(null);
              }}
              className="px-2.5 py-1 text-xs font-bold text-[#1C2A27] disabled:opacity-40 cursor-pointer"
            >
              Next →
            </button>
          </div>

          {/* Category Dropdown Selector */}
          <select
            value={selectedCategory}
            onChange={e => {
              playUISound('click');
              setSelectedCategory(e.target.value);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg text-[#1C2A27] focus:outline-none"
          >
            <option value="All">All Event Categories</option>
            <option value="Examination">Examinations</option>
            <option value="Gazetted Holiday">Gazetted Holidays</option>
            <option value="Sports & Cultural">Sports &amp; Cultural</option>
            <option value="Academic Workshop">Academic Workshops</option>
            <option value="PTM">Parent-Teacher Meetings (PTM)</option>
          </select>
        </div>

        {/* Legend & Export Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden xl:flex items-center gap-3 text-[11px] text-[#5A5346]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Holiday
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" /> Exam
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0A4D44]" /> Activity
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> PTM
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleDownloadICS(monthEvents)}
            className="px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <StreamlineIcon name="print" className="w-3.5 h-3.5" /> Export {activeMonthMeta.key} (.ics)
          </button>
        </div>
      </div>

      {/* =====================================================================
          ROW 2: REAL 7-COLUMN MONTHLY CALENDAR GRID + RIGHT EVENT INSPECTOR
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT 7 COLUMNS: TRUE 7-COLUMN VISUAL MONTHLY CALENDAR GRID */}
        <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#0A3630] text-[#F5F0E6] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CC5BE] block">
                Academic Session 2026–27 Monthly Grid
              </span>
              <h2 className="text-base font-bold text-white">{activeMonthMeta.label}</h2>
            </div>
            <div className="flex items-center gap-2">
              {selectedDateISO && (
                <button
                  type="button"
                  onClick={() => setSelectedDateISO(null)}
                  className="px-2.5 py-1 rounded bg-[#124E45] text-[#9CC5BE] hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Show All {activeMonthMeta.key} ({monthEvents.length})
                </button>
              )}
              <span className="text-xs font-mono text-[#9CC5BE] tabular-nums">
                {monthEvents.length} Scheduled Events
              </span>
            </div>
          </div>

          {/* 7 Weekday Column Headers */}
          <div className="grid grid-cols-7 bg-[#FAF6EE] border-b border-[#EAE2D3] text-center">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className={`py-2 text-[11px] font-mono font-bold uppercase ${
                  idx === 0 ? 'text-[#8B2626]' : 'text-[#5A5346]'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 7-Column Calendar Date Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#EAE2D3] bg-[#FFFDF9]">
            {calendarGridCells.map((cell, idx) => {
              if (!cell.dayNumber || !cell.dateISO) {
                return <div key={`empty-${idx}`} className="h-20 sm:h-24 bg-[#FAF8F3]/60" />;
              }

              const isSelected = selectedDateISO === cell.dateISO;
              const hasEvents = cell.events.length > 0;
              const primaryEvent = cell.events[0];
              const style = primaryEvent ? getCategoryStyle(primaryEvent.category) : null;

              return (
                <button
                  key={cell.dateISO}
                  type="button"
                  onClick={() => {
                    playUISound('click');
                    setSelectedDateISO(isSelected ? null : cell.dateISO);
                    setRightPaneTab('events');
                  }}
                  className={`h-20 sm:h-24 p-1.5 text-left flex flex-col justify-between transition cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#EFF5F3] ring-2 ring-inset ring-[#0A4D44]'
                      : hasEvents
                      ? 'bg-[#FAF6EE] hover:bg-[#F2ECE0]'
                      : 'hover:bg-[#F7F3EB]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-bold tabular-nums w-6 h-6 rounded-md flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#0A4D44] text-white'
                          : cell.isSunday
                          ? 'text-[#8B2626]'
                          : 'text-[#1C2A27]'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {hasEvents && (
                      <span className={`w-2 h-2 rounded-full ${style?.dot}`} />
                    )}
                  </div>

                  {hasEvents ? (
                    <div className="space-y-0.5 w-full overflow-hidden">
                      {cell.events.slice(0, 2).map(ev => {
                        const st = getCategoryStyle(ev.category);
                        return (
                          <div
                            key={ev.id}
                            className={`px-1.5 py-0.5 rounded border text-[9.5px] font-medium truncate ${st.badge}`}
                          >
                            {ev.title}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-[9px] font-mono text-[#B8AFA0]">
                      {cell.isSunday ? 'Sun' : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: CONTEXTUAL EVENT INSPECTOR, OD APPLICATION & ADD EVENT */}
        <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-4 space-y-3.5">
          {/* Right Pane Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-[#F5F0E6] p-1 rounded-lg border border-[#DDD4C2]">
            {[
              { id: 'events' as const, label: `Events (${inspectedEvents.length})` },
              { id: 'od' as const, label: 'Event OD Leave' },
              { id: 'add' as const, label: '+ Add Target' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  playUISound('click');
                  setRightPaneTab(t.id);
                }}
                className={`py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  rightPaneTab === t.id
                    ? 'bg-[#0A4D44] text-white'
                    : 'text-[#5A5346] hover:text-[#1C2A27]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {rightPaneTab === 'events' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-2">
                <h3 className="text-sm font-bold text-[#1C2A27]">
                  {selectedDateISO ? `Events on ${selectedDateISO}` : `${activeMonthMeta.label} Schedule`}
                </h3>
                {selectedDateISO && (
                  <button
                    type="button"
                    onClick={() => setSelectedDateISO(null)}
                    className="text-xs font-semibold text-[#0E6B5E] hover:underline cursor-pointer"
                  >
                    View All Month
                  </button>
                )}
              </div>

              {inspectedEvents.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] text-center space-y-2">
                  <p className="text-xs font-semibold text-[#1C2A27]">
                    No scheduled school events on {selectedDateISO || activeMonthMeta.label}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedDateISO) setNewDate(selectedDateISO);
                      setRightPaneTab('add');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0A4D44] text-white text-xs font-semibold cursor-pointer"
                  >
                    + Add Personal Study Target for This Date
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {inspectedEvents.map(ev => {
                    const isSubscribed = ev.rsvpBy.includes(currentUserRegNo);
                    const st = getCategoryStyle(ev.category);
                    return (
                      <div
                        key={ev.id}
                        className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-semibold ${st.badge}`}>
                            {ev.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#0A4D44] tabular-nums">
                            {ev.displayDate}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-[#1C2A27]">{ev.title}</h4>
                        <p className="text-xs text-[#4A443B] leading-relaxed">{ev.description}</p>

                        <div className="pt-2 border-t border-[#EAE2D3] flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono text-[#686052]">
                            {ev.isHoliday ? 'Campus Closed' : `${ev.rsvpBy.length} Subscribed`}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleRSVP(ev.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                                isSubscribed
                                  ? 'bg-[#EFF5F3] text-[#0A4D44] border border-[#9CC5BE]'
                                  : 'bg-[#0A4D44] text-white'
                              }`}
                            >
                              {isSubscribed ? 'Reminder Active ✓' : '+ Set Reminder'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {rightPaneTab === 'od' && (
            <div className="space-y-3">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const evObj = calendarEvents.find(c => c.id === leaveEventId) || calendarEvents[0];
                  const created = {
                    id: `OD-${Math.floor(810 + Math.random() * 180)}`,
                    eventTitle: `${evObj.title} (${evObj.displayDate})`,
                    applicant: currentUserName,
                    regNo: currentUserRegNo,
                    reason: leaveReason,
                    status: 'Approved ✓'
                  };
                  setSubmittedLeaves(prev => [created, ...prev]);
                  playUISound('success');
                  showToast('On-Duty (OD) Credit Logged', `Approved for ${evObj.title}.`, 'success');
                }}
                className="space-y-2.5"
              >
                <label className="block text-xs font-semibold text-[#1C2A27]">Select School Event for OD Credit</label>
                <select
                  value={leaveEventId}
                  onChange={e => setLeaveEventId(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                >
                  {calendarEvents
                    .filter(e => !e.isHoliday)
                    .map(ev => (
                      <option key={ev.id} value={ev.id}>
                        {ev.displayDate} — {ev.title}
                      </option>
                    ))}
                </select>
                <label className="block text-xs font-semibold text-[#1C2A27]">Role / Participation Details</label>
                <textarea
                  rows={2}
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-[#0A4D44] text-white text-xs font-semibold cursor-pointer"
                >
                  Submit Event On-Duty (OD) Request
                </button>
              </form>

              <div className="pt-2 border-t border-[#EAE2D3] space-y-2">
                <span className="text-xs font-semibold text-[#686052] block">Approved OD Applications</span>
                {submittedLeaves.map(od => (
                  <div key={od.id} className="p-2.5 rounded-lg bg-[#F7F3EB] border border-[#E2D9C8] text-xs space-y-1">
                    <div className="flex justify-between font-mono text-[11px]">
                      <strong className="text-[#0A4D44]">{od.id}</strong>
                      <span className="text-[#0A4D44] font-semibold">{od.status}</span>
                    </div>
                    <strong className="text-[#1C2A27] block">{od.eventTitle}</strong>
                    <p className="text-[11px] text-[#686052]">{od.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rightPaneTab === 'add' && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newTitle.trim()) return;
                const monthIdx = new Date(newDate).getMonth();
                const matchedMonth =
                  ACADEMIC_MONTHS.find(m => m.monthIndex0 === monthIdx)?.key || activeMonthMeta.key;
                const created: CalendarEvent = {
                  id: `CAL-${Math.floor(200 + Math.random() * 700)}`,
                  title: newTitle.trim(),
                  date: newDate,
                  displayDate: new Date(newDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }),
                  month: matchedMonth as CalendarEvent['month'],
                  category: newCategory,
                  description: newDesc.trim() || 'Personal academic revision & assessment target.',
                  isHoliday: newCategory === 'Gazetted Holiday',
                  rsvpBy: [currentUserRegNo]
                };
                setCalendarEvents(prev => [...prev, created]);
                setNewTitle('');
                setNewDesc('');
                setSelectedDateISO(newDate);
                setRightPaneTab('events');
                playUISound('success');
                showToast('Calendar Target Added', `${created.title} added to ${created.displayDate}.`, 'success');
              }}
              className="space-y-2.5"
            >
              <label className="block text-xs font-semibold text-[#1C2A27]">Target / Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Physics Optics Revision Mock"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C2A27] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as CalendarEvent['category'])}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
                  >
                    <option value="Examination">Examination</option>
                    <option value="Academic Workshop">Academic Workshop</option>
                    <option value="Sports & Cultural">Sports &amp; Cultural</option>
                    <option value="PTM">PTM</option>
                  </select>
                </div>
              </div>
              <label className="block text-xs font-semibold text-[#1C2A27]">Prep Notes</label>
              <textarea
                rows={2}
                placeholder="Chapters or goals to cover..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-[#0A4D44] text-white text-xs font-semibold cursor-pointer"
              >
                Add to Monthly Calendar Grid
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
