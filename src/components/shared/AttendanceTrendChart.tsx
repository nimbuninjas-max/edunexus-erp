import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
  Cell
} from 'recharts';
import { RoleType, Student } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';

interface AttendanceTrendChartProps {
  activeRole: RoleType;
  currentStudent?: Student;
  selectedClass?: string;
  playUISound?: (type?: string) => void;
}

export interface DailyAttendanceFluctuationPoint {
  id: string;
  label: string;
  fullDate: string;
  weekId: 'W1' | 'W2' | 'W3' | 'W4';
  weekLabel: string;
  weekTrend: 'improved' | 'declined';
  weekDeltaPct: number;
  attendancePct: number;
  absencePct: number;
  dailyDelta: number; // day-over-day fluctuation
  studentPersonalPct: number;
  studentStatus: 'Present' | 'Absent (Medical)' | 'Absent (Personal)';
  presentCount: number;
  absentCount: number;
  totalStrength: number;
  causeNote: string;
  weatherOrEvent: string;
  actionTaken: string;
}

export interface TermWeekSummary {
  weekId: 'W1' | 'W2' | 'W3' | 'W4';
  title: string;
  dateRange: string;
  startLabel: string;
  endLabel: string;
  avgAttendancePct: number;
  deltaFromPrevWeek: number;
  status: 'improved' | 'declined';
  headline: string;
  detail: string;
}

export const TERM_WEEK_SUMMARIES: TermWeekSummary[] = [
  {
    weekId: 'W1',
    title: 'Week 1 • Lab Practicals',
    dateRange: '21 Sep – 26 Sep',
    startLabel: '21 Sep',
    endLabel: '26 Sep',
    avgAttendancePct: 91.6,
    deltaFromPrevWeek: 3.8,
    status: 'improved',
    headline: 'Improved +3.8% (Strong Lab Turnout)',
    detail: 'Attendance rose steadily during Chemistry & Physics practical mock assessments.'
  },
  {
    weekId: 'W2',
    title: 'Week 2 • Monsoon & Holiday Bridge',
    dateRange: '28 Sep – 03 Oct',
    startLabel: '28 Sep',
    endLabel: '03 Oct',
    avgAttendancePct: 82.7,
    deltaFromPrevWeek: -8.9,
    status: 'declined',
    headline: 'Declined -8.9% (Monsoon & Bridge Dip)',
    detail: 'Heavy Monday waterlogging on bus routes and Saturday post-holiday bridge absences.'
  },
  {
    weekId: 'W3',
    title: 'Week 3 • Seasonal Flu Wave',
    dateRange: '05 Oct – 10 Oct',
    startLabel: '05 Oct',
    endLabel: '10 Oct',
    avgAttendancePct: 83.6,
    deltaFromPrevWeek: -4.2,
    status: 'declined',
    headline: 'Declined -4.2% Late Week (Viral Flu Dip)',
    detail: 'Started strong on Monday (93.8%) before dipping to 73.3% on Friday due to seasonal viral fever.'
  },
  {
    weekId: 'W4',
    title: 'Week 4 • Recovery & Olympiad Surge',
    dateRange: '12 Oct – 18 Oct',
    startLabel: '12 Oct',
    endLabel: '18 Oct',
    avgAttendancePct: 90.4,
    deltaFromPrevWeek: 6.8,
    status: 'improved',
    headline: 'Improved +6.8% (Post-Flu Recovery)',
    detail: 'Strong rebound to 94.2% during Science Olympiad Mock & medical condonation verification.'
  }
];

export const DAILY_FLUCTUATION_DATA: DailyAttendanceFluctuationPoint[] = [
  // WEEK 1: IMPROVED (+3.8%)
  {
    id: 'd1',
    label: '21 Sep',
    fullDate: 'Monday, 21 Sep 2026',
    weekId: 'W1',
    weekLabel: 'Week 1 (Improved +3.8%)',
    weekTrend: 'improved',
    weekDeltaPct: 3.8,
    attendancePct: 89.2,
    absencePct: 10.8,
    dailyDelta: 1.4,
    studentPersonalPct: 83.2,
    studentStatus: 'Present',
    presentCount: 214,
    absentCount: 26,
    totalStrength: 240,
    causeNote: 'Week 1 opening: Chemistry titration batch orientation.',
    weatherOrEvent: 'Week 1 • Practical Orientation',
    actionTaken: 'Lab safety & roll call verified'
  },
  {
    id: 'd2',
    label: '23 Sep',
    fullDate: 'Wednesday, 23 Sep 2026',
    weekId: 'W1',
    weekLabel: 'Week 1 (Improved +3.8%)',
    weekTrend: 'improved',
    weekDeltaPct: 3.8,
    attendancePct: 92.5,
    absencePct: 7.5,
    dailyDelta: 3.3,
    studentPersonalPct: 83.8,
    studentStatus: 'Present',
    presentCount: 222,
    absentCount: 18,
    totalStrength: 240,
    causeNote: 'Attendance climbed +3.3% for Physics Ray Optics lab evaluation.',
    weatherOrEvent: 'Week 1 • Ray Optics Evaluation',
    actionTaken: 'Merit XP awarded to full-attendance houses'
  },
  {
    id: 'd3',
    label: '25 Sep',
    fullDate: 'Friday, 25 Sep 2026',
    weekId: 'W1',
    weekLabel: 'Week 1 (Improved +3.8%)',
    weekTrend: 'improved',
    weekDeltaPct: 3.8,
    attendancePct: 91.5,
    absencePct: 8.5,
    dailyDelta: -1.0,
    studentPersonalPct: 84.0,
    studentStatus: 'Present',
    presentCount: 219,
    absentCount: 21,
    totalStrength: 240,
    causeNote: 'Sustained >91% attendance across all 6 sections.',
    weatherOrEvent: 'Week 1 • Regular Schedule',
    actionTaken: 'Weekly improvement (+3.8%) recorded'
  },
  {
    id: 'd4',
    label: '26 Sep',
    fullDate: 'Saturday, 26 Sep 2026',
    weekId: 'W1',
    weekLabel: 'Week 1 (Improved +3.8%)',
    weekTrend: 'improved',
    weekDeltaPct: 3.8,
    attendancePct: 93.3,
    absencePct: 6.7,
    dailyDelta: 1.8,
    studentPersonalPct: 84.2,
    studentStatus: 'Present',
    presentCount: 224,
    absentCount: 16,
    totalStrength: 240,
    causeNote: 'Week 1 peak: Inter-House Quiz & Science Exhibition prep.',
    weatherOrEvent: 'Week 1 Peak (+1.8% Daily Gain)',
    actionTaken: '93.3% weekly high achieved'
  },

  // WEEK 2: DECLINED (-8.9%)
  {
    id: 'd5',
    label: '28 Sep',
    fullDate: 'Monday, 28 Sep 2026',
    weekId: 'W2',
    weekLabel: 'Week 2 (Declined -8.9%)',
    weekTrend: 'declined',
    weekDeltaPct: -8.9,
    attendancePct: 75.8,
    absencePct: 24.2,
    dailyDelta: -17.5,
    studentPersonalPct: 81.2,
    studentStatus: 'Absent (Medical)',
    presentCount: 182,
    absentCount: 58,
    totalStrength: 240,
    causeNote: 'SHARP DECLINE (-17.5%): Severe morning waterlogging on Bus Routes #4 & #7.',
    weatherOrEvent: 'Week 2 • Monsoon Downpour Alert',
    actionTaken: 'Late-arrival grace granted; recorded lecture shared'
  },
  {
    id: 'd6',
    label: '29 Sep',
    fullDate: 'Tuesday, 29 Sep 2026',
    weekId: 'W2',
    weekLabel: 'Week 2 (Declined -8.9%)',
    weekTrend: 'declined',
    weekDeltaPct: -8.9,
    attendancePct: 84.6,
    absencePct: 15.4,
    dailyDelta: 8.8,
    studentPersonalPct: 80.6,
    studentStatus: 'Absent (Medical)',
    presentCount: 203,
    absentCount: 37,
    totalStrength: 240,
    causeNote: 'Partial transit recovery; 37 students still absent after heavy rain.',
    weatherOrEvent: 'Week 2 • Post-Rain Recovery',
    actionTaken: 'Parent SMS verification sent'
  },
  {
    id: 'd7',
    label: '01 Oct',
    fullDate: 'Thursday, 01 Oct 2026',
    weekId: 'W2',
    weekLabel: 'Week 2 (Declined -8.9%)',
    weekTrend: 'declined',
    weekDeltaPct: -8.9,
    attendancePct: 90.4,
    absencePct: 9.6,
    dailyDelta: 5.8,
    studentPersonalPct: 81.3,
    studentStatus: 'Present',
    presentCount: 217,
    absentCount: 23,
    totalStrength: 240,
    causeNote: 'Mid-week rebound for Gandhi Jayanti Eve Assembly.',
    weatherOrEvent: 'Week 2 • Civic Assembly',
    actionTaken: 'House merit XP awarded'
  },
  {
    id: 'd8',
    label: '03 Oct',
    fullDate: 'Saturday, 03 Oct 2026',
    weekId: 'W2',
    weekLabel: 'Week 2 (Declined -8.9%)',
    weekTrend: 'declined',
    weekDeltaPct: -8.9,
    attendancePct: 78.3,
    absencePct: 21.7,
    dailyDelta: -12.1,
    studentPersonalPct: 79.8,
    studentStatus: 'Absent (Personal)',
    presentCount: 188,
    absentCount: 52,
    totalStrength: 240,
    causeNote: 'WEEKEND BRIDGE DECLINE (-12.1%): Outstation travel after Friday National Holiday.',
    weatherOrEvent: 'Week 2 • Post-Holiday Bridge Dip',
    actionTaken: 'Class teachers issued revision worksheets'
  },

  // WEEK 3: DECLINED (-4.2% LATE-WEEK FLU DIP)
  {
    id: 'd9',
    label: '05 Oct',
    fullDate: 'Monday, 05 Oct 2026',
    weekId: 'W3',
    weekLabel: 'Week 3 (Declined -4.2%)',
    weekTrend: 'declined',
    weekDeltaPct: -4.2,
    attendancePct: 93.8,
    absencePct: 6.2,
    dailyDelta: 15.5,
    studentPersonalPct: 80.1,
    studentStatus: 'Present',
    presentCount: 225,
    absentCount: 15,
    totalStrength: 240,
    causeNote: 'Strong Monday opening (+15.5%) for Unit Test-3 Revision kickoff.',
    weatherOrEvent: 'Week 3 • UT-3 Revision Kickoff',
    actionTaken: 'Full attendance bonus XP distributed'
  },
  {
    id: 'd10',
    label: '07 Oct',
    fullDate: 'Wednesday, 07 Oct 2026',
    weekId: 'W3',
    weekLabel: 'Week 3 (Declined -4.2%)',
    weekTrend: 'declined',
    weekDeltaPct: -4.2,
    attendancePct: 86.7,
    absencePct: 13.3,
    dailyDelta: -7.1,
    studentPersonalPct: 79.6,
    studentStatus: 'Present',
    presentCount: 208,
    absentCount: 32,
    totalStrength: 240,
    causeNote: 'Mid-week dip (-7.1%) as seasonal throat infection & fever cases began.',
    weatherOrEvent: 'Week 3 • Health Advisory Issued',
    actionTaken: 'School infirmary temperature checks started'
  },
  {
    id: 'd11',
    label: '08 Oct',
    fullDate: 'Thursday, 08 Oct 2026',
    weekId: 'W3',
    weekLabel: 'Week 3 (Declined -4.2%)',
    weekTrend: 'declined',
    weekDeltaPct: -4.2,
    attendancePct: 80.4,
    absencePct: 19.6,
    dailyDelta: -6.3,
    studentPersonalPct: 79.2,
    studentStatus: 'Absent (Medical)',
    presentCount: 193,
    absentCount: 47,
    totalStrength: 240,
    causeNote: 'CONTINUED DECLINE (-6.3%): 47 students absent with seasonal viral fever.',
    weatherOrEvent: 'Week 3 • Viral Flu Cluster',
    actionTaken: 'Medical condonation desk opened'
  },
  {
    id: 'd12',
    label: '09 Oct',
    fullDate: 'Friday, 09 Oct 2026',
    weekId: 'W3',
    weekLabel: 'Week 3 (Declined -4.2%)',
    weekTrend: 'declined',
    weekDeltaPct: -4.2,
    attendancePct: 73.3,
    absencePct: 26.7,
    dailyDelta: -7.1,
    studentPersonalPct: 78.1,
    studentStatus: 'Absent (Medical)',
    presentCount: 176,
    absentCount: 64,
    totalStrength: 240,
    causeNote: 'TERM LOWEST POINT (73.3%): 64 students absent during Friday viral flu peak.',
    weatherOrEvent: 'Week 3 • Campus Sanitization Drive',
    actionTaken: 'Classrooms sanitized; digital notes uploaded to Study Vault'
  },

  // WEEK 4: IMPROVED (+6.8% RECOVERY SURGE)
  {
    id: 'd13',
    label: '12 Oct',
    fullDate: 'Monday, 12 Oct 2026',
    weekId: 'W4',
    weekLabel: 'Week 4 (Improved +6.8%)',
    weekTrend: 'improved',
    weekDeltaPct: 6.8,
    attendancePct: 88.3,
    absencePct: 11.7,
    dailyDelta: 15.0,
    studentPersonalPct: 78.4,
    studentStatus: 'Present',
    presentCount: 212,
    absentCount: 28,
    totalStrength: 240,
    causeNote: 'MAJOR IMPROVEMENT (+15.0%): Students returned healthy after weekend recovery.',
    weatherOrEvent: 'Week 4 • Post-Flu Rebound Monday',
    actionTaken: '26 medical leave applications verified'
  },
  {
    id: 'd14',
    label: '14 Oct',
    fullDate: 'Wednesday, 14 Oct 2026',
    weekId: 'W4',
    weekLabel: 'Week 4 (Improved +6.8%)',
    weekTrend: 'improved',
    weekDeltaPct: 6.8,
    attendancePct: 94.2,
    absencePct: 5.8,
    dailyDelta: 5.9,
    studentPersonalPct: 78.7,
    studentStatus: 'Present',
    presentCount: 226,
    absentCount: 14,
    totalStrength: 240,
    causeNote: 'TERM PEAK ATTENDANCE (94.2%): Near-full turnout for Science Olympiad Mock.',
    weatherOrEvent: 'Week 4 • National Olympiad Mock',
    actionTaken: 'Top performers highlighted on Leaderboard'
  },
  {
    id: 'd15',
    label: '16 Oct',
    fullDate: 'Friday, 16 Oct 2026',
    weekId: 'W4',
    weekLabel: 'Week 4 (Improved +6.8%)',
    weekTrend: 'improved',
    weekDeltaPct: 6.8,
    attendancePct: 87.5,
    absencePct: 12.5,
    dailyDelta: -6.7,
    studentPersonalPct: 78.5,
    studentStatus: 'Present',
    presentCount: 210,
    absentCount: 30,
    totalStrength: 240,
    causeNote: 'Minor Friday dip (-6.7%) due to regional sports team departure.',
    weatherOrEvent: 'Week 4 • Zonal Sports Departure',
    actionTaken: 'On-Duty (OD) slips credited'
  },
  {
    id: 'd16',
    label: '18 Oct',
    fullDate: 'Sunday (Special Working), 18 Oct 2026',
    weekId: 'W4',
    weekLabel: 'Week 4 (Improved +6.8%)',
    weekTrend: 'improved',
    weekDeltaPct: 6.8,
    attendancePct: 91.7,
    absencePct: 8.3,
    dailyDelta: 4.2,
    studentPersonalPct: 78.7,
    studentStatus: 'Present',
    presentCount: 220,
    absentCount: 20,
    totalStrength: 240,
    causeNote: 'Current Live Session (+4.2%): Week 4 closes with a strong +6.8% weekly gain.',
    weatherOrEvent: 'Today • Live Classroom Radar Active',
    actionTaken: 'Live attendance synced across 6 sections'
  }
];

export const AttendanceTrendChart: React.FC<AttendanceTrendChartProps> = ({
  activeRole,
  currentStudent,
  selectedClass = '10-B',
  playUISound
}) => {
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<'ALL' | 'W1' | 'W2' | 'W3' | 'W4'>('ALL');
  const [chartView, setChartView] = useState<'fluctuation' | 'delta' | 'personal'>('fluctuation');
  const [selectedPointId, setSelectedPointId] = useState<string>('d12');

  // Sync currentStudent's live attendance into the latest point
  const fullDataset = useMemo(() => {
    if (!currentStudent) return DAILY_FLUCTUATION_DATA;
    const liveStuPct = Number(
      ((currentStudent.presentDays / Math.max(1, currentStudent.totalDays)) * 100).toFixed(1)
    );
    return DAILY_FLUCTUATION_DATA.map((pt, idx) =>
      idx === DAILY_FLUCTUATION_DATA.length - 1
        ? {
            ...pt,
            studentPersonalPct: liveStuPct,
            causeNote: `Live Ledger: ${currentStudent.name} has ${currentStudent.presentDays} Attended / ${
              currentStudent.totalDays - currentStudent.presentDays
            } Absent out of ${currentStudent.totalDays} days (${liveStuPct}%).`
          }
        : pt
    );
  }, [currentStudent]);

  const displayedData = useMemo(() => {
    if (selectedWeekFilter === 'ALL') return fullDataset;
    return fullDataset.filter(d => d.weekId === selectedWeekFilter);
  }, [fullDataset, selectedWeekFilter]);

  const selectedPoint = useMemo(
    () =>
      displayedData.find(d => d.id === selectedPointId) ||
      displayedData[displayedData.length - 1] ||
      fullDataset[0],
    [displayedData, fullDataset, selectedPointId]
  );

  const CustomTooltip = ({
    active,
    payload
  }: {
    active?: boolean;
    payload?: Array<{ payload: DailyAttendanceFluctuationPoint }>;
  }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    const isImprovedWeek = data.weekTrend === 'improved';

    return (
      <div className="bg-[#FFFDF9] border border-[#D5CBB8] rounded-xl p-3.5 shadow-xl max-w-xs space-y-2 text-xs">
        <div className="flex items-center justify-between gap-2 border-b border-[#EAE2D3] pb-1.5">
          <span className="font-semibold text-[#1C2A27]">{data.fullDate}</span>
          <span
            className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
              isImprovedWeek
                ? 'bg-[#EFF5F3] text-[#0A4D44] border border-[#9CC5BE]'
                : 'bg-[#FAF2F2] text-[#9E2A2B] border border-[#E2B4B4]'
            }`}
          >
            {data.weekLabel}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
          <div className="p-1.5 rounded bg-[#F7F3EB]">
            <span className="text-[9px] font-sans text-[#686052] block">Daily Present</span>
            <strong className="text-[#0A4D44]">{data.attendancePct}%</strong>
            <span className="text-[9px] text-[#686052] block">
              {data.presentCount}/{data.totalStrength}
            </span>
          </div>
          <div className="p-1.5 rounded bg-[#F7F3EB]">
            <span className="text-[9px] font-sans text-[#686052] block">Daily Shift</span>
            <strong className={data.dailyDelta >= 0 ? 'text-[#0A4D44]' : 'text-[#9E2A2B]'}>
              {data.dailyDelta >= 0 ? `+${data.dailyDelta}%` : `${data.dailyDelta}%`}
            </strong>
            <span className="text-[9px] text-[#686052] block">vs prev day</span>
          </div>
          <div className="p-1.5 rounded bg-[#EFF5F3]">
            <span className="text-[9px] font-sans text-[#686052] block">My Overall</span>
            <strong className="text-[#1C2A27]">{data.studentPersonalPct}%</strong>
            <span className="text-[9px] text-[#686052] block">{data.studentStatus.split(' ')[0]}</span>
          </div>
        </div>

        <p className="text-[11px] text-[#4A443B] leading-snug">{data.causeNote}</p>
      </div>
    );
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-5 space-y-4">
      {/* Header & View Controls */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EAE2D3] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
              Dynamic Term Attendance & Weekly Shift Visualizer
            </span>
            <span className="px-2 py-0.5 rounded bg-[#EFF5F3] border border-[#9CC5BE] text-[#0A4D44] text-[10px] font-mono font-semibold">
              2 Weeks Improved (W1, W4)
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FAF2F2] border border-[#E2B4B4] text-[#9E2A2B] text-[10px] font-mono font-semibold">
              2 Weeks Declined (W2, W3)
            </span>
          </div>
          <h3 className="text-base font-semibold text-[#1C2A27] mt-1">
            {activeRole === 'student'
              ? `Daily Attendance Fluctuations & Weekly Improvement/Decline Highlights (${currentStudent?.grade || '10-B'})`
              : activeRole === 'teacher'
              ? `Class ${selectedClass} Daily Attendance Fluctuations & Weekly Shifts`
              : 'School-Wide Daily Attendance Fluctuations & Weekly Improvement/Decline Breakdown'}
          </h3>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#F5F0E6] p-1 rounded-lg border border-[#DDD4C2] text-xs">
            <button
              type="button"
              onClick={() => {
                playUISound?.('click');
                setChartView('fluctuation');
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                chartView === 'fluctuation'
                  ? 'bg-[#0A4D44] text-[#F5F0E6]'
                  : 'text-[#686052] hover:text-[#1C2A27]'
              }`}
            >
              Daily Fluctuation + Weekly Zones
            </button>
            <button
              type="button"
              onClick={() => {
                playUISound?.('click');
                setChartView('delta');
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                chartView === 'delta'
                  ? 'bg-[#1C2A27] text-[#F5F0E6]'
                  : 'text-[#686052] hover:text-[#1C2A27]'
              }`}
            >
              Day-to-Day Gain/Drop
            </button>
            <button
              type="button"
              onClick={() => {
                playUISound?.('click');
                setChartView('personal');
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                chartView === 'personal'
                  ? 'bg-[#0E6B5E] text-white'
                  : 'text-[#686052] hover:text-[#1C2A27]'
              }`}
            >
              My Attendance vs Class
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE WEEKLY IMPROVEMENT vs DECLINE SELECTOR CARDS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#686052]">
            Click Any Week to Highlight or Filter Its Daily Fluctuations:
          </span>
          {selectedWeekFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => {
                playUISound?.('click');
                setSelectedWeekFilter('ALL');
              }}
              className="text-xs font-semibold text-[#0A4D44] hover:underline"
            >
              Show All 4 Weeks Together →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TERM_WEEK_SUMMARIES.map(wk => {
            const isSelected = selectedWeekFilter === wk.weekId;
            const isImproved = wk.status === 'improved';
            return (
              <button
                key={wk.weekId}
                type="button"
                onClick={() => {
                  playUISound?.('click');
                  setSelectedWeekFilter(prev => (prev === wk.weekId ? 'ALL' : wk.weekId));
                  const firstDayOfWk = fullDataset.find(d => d.weekId === wk.weekId);
                  if (firstDayOfWk) setSelectedPointId(firstDayOfWk.id);
                }}
                className={`text-left p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? isImproved
                      ? 'bg-[#EFF5F3] border-[#0A4D44] ring-2 ring-[#0A4D44]/20'
                      : 'bg-[#FAF2F2] border-[#9E2A2B] ring-2 ring-[#9E2A2B]/20'
                    : isImproved
                    ? 'bg-[#F7FBF9] hover:bg-[#EFF5F3] border-[#B8D8D0]'
                    : 'bg-[#FDF8F8] hover:bg-[#FAF2F2] border-[#E6C5C5]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono uppercase font-semibold text-[#686052]">
                      {wk.dateRange}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isImproved
                          ? 'bg-[#0A4D44] text-white'
                          : 'bg-[#9E2A2B] text-white'
                      }`}
                    >
                      {wk.deltaFromPrevWeek >= 0 ? `▲ +${wk.deltaFromPrevWeek}%` : `▼ ${wk.deltaFromPrevWeek}%`}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#1C2A27]">{wk.title}</p>
                  <p className="text-[11px] text-[#4A443B] leading-snug line-clamp-2">{wk.detail}</p>
                </div>

                <div className="pt-1.5 border-t border-current/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#686052]">Weekly Mean:</span>
                  <strong className={isImproved ? 'text-[#0A4D44]' : 'text-[#9E2A2B]'}>
                    {wk.avgAttendancePct}% ({isImproved ? 'Improved' : 'Declined'})
                  </strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN RECHARTS DAILY FLUCTUATION & WEEKLY SHADED BANDS CHART */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={displayedData}
            margin={{ top: 16, right: 16, left: -12, bottom: 4 }}
            onClick={(state) => {
              if (state && state.activeLabel) {
                const clicked = displayedData.find(d => d.label === String(state.activeLabel));
                if (clicked) {
                  playUISound?.('click');
                  setSelectedPointId(clicked.id);
                }
              }
            }}
          >
            <defs>
              <linearGradient id="dailyAttendanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A4D44" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0A4D44" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E2D9C8" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#686052', fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={{ stroke: '#D5CBB8' }}
              tickLine={false}
            />
            <YAxis
              domain={chartView === 'delta' ? [-25, 25] : [60, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#686052', fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* SHADED WEEKLY IMPROVEMENT (GREEN) & DECLINE (RED) BACKGROUND ZONES WHEN VIEWING FULL TERM */}
            {selectedWeekFilter === 'ALL' && chartView !== 'delta' && (
              <>
                <ReferenceArea
                  x1="21 Sep"
                  x2="26 Sep"
                  fill="#0A4D44"
                  fillOpacity={0.07}
                  label={{
                    value: 'W1: Improved (+3.8%)',
                    position: 'insideTop',
                    fill: '#0A4D44',
                    fontSize: 10
                  }}
                />
                <ReferenceArea
                  x1="28 Sep"
                  x2="03 Oct"
                  fill="#9E2A2B"
                  fillOpacity={0.09}
                  label={{
                    value: 'W2: Declined (-8.9%)',
                    position: 'insideTop',
                    fill: '#9E2A2B',
                    fontSize: 10
                  }}
                />
                <ReferenceArea
                  x1="05 Oct"
                  x2="09 Oct"
                  fill="#9E2A2B"
                  fillOpacity={0.09}
                  label={{
                    value: 'W3: Flu Dip (-4.2%)',
                    position: 'insideTop',
                    fill: '#9E2A2B',
                    fontSize: 10
                  }}
                />
                <ReferenceArea
                  x1="12 Oct"
                  x2="18 Oct"
                  fill="#0A4D44"
                  fillOpacity={0.08}
                  label={{
                    value: 'W4: Rebound (+6.8%)',
                    position: 'insideTop',
                    fill: '#0A4D44',
                    fontSize: 10
                  }}
                />
              </>
            )}

            {chartView !== 'delta' ? (
              <>
                <ReferenceLine
                  y={90}
                  stroke="#0A4D44"
                  strokeDasharray="4 4"
                  label={{
                    value: '90% Excellence Line',
                    position: 'insideTopRight',
                    fill: '#0A4D44',
                    fontSize: 10
                  }}
                />
                <ReferenceLine
                  y={75}
                  stroke="#9E2A2B"
                  strokeDasharray="3 3"
                  label={{
                    value: '75% Mandatory Min',
                    position: 'insideBottomRight',
                    fill: '#9E2A2B',
                    fontSize: 10
                  }}
                />

                {/* Daily Attendance Fluctuation Curve */}
                <Area
                  type="monotone"
                  dataKey="attendancePct"
                  name="Daily Attendance %"
                  stroke="#0A4D44"
                  strokeWidth={2.5}
                  fill="url(#dailyAttendanceGrad)"
                  activeDot={{ r: 6, fill: '#0A4D44', stroke: '#FFFDF9', strokeWidth: 2 }}
                />

                {/* Bar columns colored by whether the day gained or declined vs previous day */}
                {chartView === 'fluctuation' && (
                  <Bar
                    dataKey="attendancePct"
                    name="Daily Turnout %"
                    barSize={14}
                    radius={[4, 4, 0, 0]}
                  >
                    {displayedData.map(entry => {
                      const isDropDay = entry.dailyDelta < -3 || entry.attendancePct < 82;
                      return (
                        <Cell
                          key={entry.id}
                          cursor="pointer"
                          fill={isDropDay ? '#9E2A2B' : '#0A4D44'}
                          fillOpacity={isDropDay ? 0.85 : 0.45}
                        />
                      );
                    })}
                  </Bar>
                )}

                {/* Student Personal Cumulative Attendance Curve */}
                {(chartView === 'fluctuation' || chartView === 'personal') && (
                  <Line
                    type="monotone"
                    dataKey="studentPersonalPct"
                    name="My Cumulative %"
                    stroke="#D97706"
                    strokeWidth={2.2}
                    strokeDasharray="5 3"
                    dot={{ r: 3.5, fill: '#D97706' }}
                  />
                )}

                {/* Highlight Significant Decline / Improvement Turning Points */}
                {displayedData
                  .filter(d => Math.abs(d.dailyDelta) >= 7)
                  .map(d => (
                    <ReferenceDot
                      key={`turn-${d.id}`}
                      x={d.label}
                      y={d.attendancePct}
                      r={5.5}
                      fill={d.dailyDelta > 0 ? '#0A4D44' : '#9E2A2B'}
                      stroke="#FFFDF9"
                      strokeWidth={2}
                    />
                  ))}
              </>
            ) : (
              /* Day-to-Day Fluctuation Delta View (+% Gain vs -% Drop) */
              <>
                <ReferenceLine y={0} stroke="#1C2A27" strokeWidth={1.5} />
                <Bar
                  dataKey="dailyDelta"
                  name="Day-over-Day Change %"
                  barSize={24}
                  radius={[4, 4, 4, 4]}
                >
                  {displayedData.map(entry => (
                    <Cell
                      key={entry.id}
                      cursor="pointer"
                      fill={entry.dailyDelta >= 0 ? '#0A4D44' : '#9E2A2B'}
                    />
                  ))}
                </Bar>
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Day & Weekly Context Footer */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          selectedPoint.weekTrend === 'improved'
            ? 'bg-[#EFF5F3] border-[#9CC5BE]'
            : 'bg-[#FAF2F2] border-[#E2B4B4]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <StreamlineIcon
              name={selectedPoint.weekTrend === 'improved' ? 'check' : 'alert'}
              className={`w-4 h-4 ${
                selectedPoint.weekTrend === 'improved' ? 'text-[#0A4D44]' : 'text-[#9E2A2B]'
              }`}
            />
            <span className="text-xs font-semibold text-[#1C2A27]">
              {selectedPoint.fullDate} • {selectedPoint.weekLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-[#FFFDF9] border border-[#D5CBB8] text-[#0A4D44] font-semibold">
              Turnout: {selectedPoint.attendancePct}% ({selectedPoint.presentCount}/{selectedPoint.totalStrength})
            </span>
            <span
              className={`px-2 py-0.5 rounded bg-[#FFFDF9] border font-semibold ${
                selectedPoint.dailyDelta >= 0
                  ? 'border-[#9CC5BE] text-[#0A4D44]'
                  : 'border-[#E2B4B4] text-[#9E2A2B]'
              }`}
            >
              Daily Shift: {selectedPoint.dailyDelta >= 0 ? `+${selectedPoint.dailyDelta}%` : `${selectedPoint.dailyDelta}%`}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FFFDF9] border border-[#D5CBB8] text-[#1C2A27]">
              My Status: {selectedPoint.studentStatus}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#686052] block">
              What Caused This Fluctuation
            </span>
            <p className="text-[#1C2A27] mt-0.5">{selectedPoint.causeNote}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0E6B5E] block">
              School Follow-Up Action
            </span>
            <p className="text-[#1C2A27] mt-0.5">{selectedPoint.actionTaken}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
