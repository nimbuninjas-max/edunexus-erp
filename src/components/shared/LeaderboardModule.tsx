import React, { useState, useMemo } from 'react';
import { RankedStudent, RoleType, Student } from '../../types/erp';
import { UserAvatar } from '../common/UserAvatar';

interface LeaderboardModuleProps {
  activeRole: RoleType;
  rankedStudents: RankedStudent[];
  currentStudent: Student;
  availableClasses: string[];
  setPrintingStudentId: (id: string) => void;
  playUISound: (type?: string) => void;
}

type SortCriterion = 'xp' | 'testScore' | 'questions' | 'attendance';

export const LeaderboardModule: React.FC<LeaderboardModuleProps> = ({
  rankedStudents,
  currentStudent,
  availableClasses,
  setPrintingStudentId,
  playUISound
}) => {
  const [leaderboardClassFilter, setLeaderboardClassFilter] = useState('All');
  const [houseFilter, setHouseFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortCriterion>('xp');
  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  const [comparedStudentId, setComparedStudentId] = useState<string>('20261006');

  const myRankedObj = useMemo(
    () => rankedStudents.find(s => s.id === currentStudent.id) || rankedStudents[0],
    [rankedStudents, currentStudent.id]
  );

  const filteredList = useMemo(() => {
    const base = rankedStudents
      .filter(s => leaderboardClassFilter === 'All' || s.grade === leaderboardClassFilter)
      .filter(s => houseFilter === 'All' || s.house === houseFilter)
      .filter(
        s =>
          s.name.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
          s.id.includes(leaderboardSearch.trim())
      );

    return [...base].sort((a, b) => {
      if (sortBy === 'testScore') return b.dailyTestAvgScore - a.dailyTestAvgScore;
      if (sortBy === 'questions') return b.dailyTestTotalQuestionsAnswered - a.dailyTestTotalQuestionsAnswered;
      if (sortBy === 'attendance') return b.attendancePct - a.attendancePct;
      return b.points - a.points;
    });
  }, [rankedStudents, leaderboardClassFilter, houseFilter, leaderboardSearch, sortBy]);

  const topThree = useMemo(() => filteredList.slice(0, 3), [filteredList]);

  const comparedStudent = useMemo(
    () => rankedStudents.find(s => s.id === comparedStudentId) || rankedStudents[0],
    [rankedStudents, comparedStudentId]
  );

  const houseStandings = useMemo(() => {
    const houses = ['Jal House', 'Agni House', 'Vayu House', 'Prithvi House'];
    return houses
      .map(hName => {
        const members = rankedStudents.filter(s => s.house === hName);
        const totalXP = members.reduce((acc, m) => acc + m.points, 0);
        const avgTest = members.length
          ? Math.round(members.reduce((acc, m) => acc + m.dailyTestAvgScore, 0) / members.length)
          : 0;
        return { house: hName, totalXP, avgTest, count: members.length };
      })
      .sort((a, b) => b.totalXP - a.totalXP);
  }, [rankedStudents]);

  return (
    <div className="space-y-4">
      {/* =====================================================================
          ROW 1: COMPACT PERSONAL STANDING + TOP 3 PODIUM STRIP (2x2 BENTO ON MOBILE)
         ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Card 0: Your Personal Standing */}
        <div className="bg-[#0A3630] text-[#F5F0E6] border border-[#14463F] rounded-xl p-3 sm:p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#9CC5BE]">
            <span>YOUR RANK</span>
            <span>Sec {myRankedObj.grade}</span>
          </div>
          <div className="flex items-center gap-2.5 my-1.5">
            <UserAvatar id={myRankedObj.id} name={myRankedObj.name} size="w-9 h-9" />
            <div className="min-w-0">
              <strong className="text-sm sm:text-base font-mono font-bold text-white tabular-nums block truncate">
                #{myRankedObj.rank} · {myRankedObj.points.toLocaleString()} XP
              </strong>
              <span className="text-[10px] sm:text-[11px] text-[#B5CFCB] font-mono block truncate">
                Avg {myRankedObj.dailyTestAvgScore}% · {myRankedObj.dailyTestTotalQuestionsAnswered} Qs
              </span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-[#19574E] flex items-center justify-between text-[10px] sm:text-[11px] text-[#9CC5BE]">
            <span className="truncate">{myRankedObj.house}</span>
            <span className="shrink-0">Att: {myRankedObj.attendancePct}%</span>
          </div>
        </div>

        {/* Cards 1–3: Top 3 Scholars */}
        {topThree.map((stu, idx) => {
          const rankLabel = idx === 0 ? '1st · Gold' : idx === 1 ? '2nd · Silver' : '3rd · Bronze';
          const rankColor = idx === 0 ? 'text-[#9A6B26]' : idx === 1 ? 'text-[#0A4D44]' : 'text-[#686052]';
          return (
            <div
              key={stu.id}
              onClick={() => {
                playUISound('click');
                setComparedStudentId(stu.id);
              }}
              className="bg-[#FFFDF9] hover:bg-[#F7F3EB] border border-[#DDD4C2] rounded-xl p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer transition"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase ${rankColor}`}>{rankLabel}</span>
                <span className="text-xs font-mono font-bold text-[#0A4D44]">#{stu.rank}</span>
              </div>
              <div className="flex items-center gap-2 my-1.5">
                <UserAvatar id={stu.id} name={stu.name} size="w-8 h-8" />
                <div className="min-w-0">
                  <strong className="text-xs font-bold text-[#1C2A27] truncate block">
                    {stu.name} {stu.id === currentStudent.id ? '(You)' : ''}
                  </strong>
                  <span className="text-[10px] font-mono text-[#686052] block truncate">
                    #{stu.id} · Sec {stu.grade}
                  </span>
                </div>
              </div>
              <div className="pt-1.5 border-t border-[#EAE2D3] flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                <strong className="text-[#0A4D44] tabular-nums">{stu.points.toLocaleString()} XP</strong>
                <span className="text-[#686052] tabular-nums">Avg {stu.dailyTestAvgScore}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          ROW 2: STICKY SINGLE-LINE DROPDOWN FILTER & SEARCH BAR
         ===================================================================== */}
      <div className="sticky top-2 z-30 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#5A5346] hidden sm:inline">Rank By:</label>
            <select
              value={sortBy}
              onChange={e => {
                playUISound('click');
                setSortBy(e.target.value as SortCriterion);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg text-[#1C2A27]"
            >
              <option value="xp">Merit XP Points</option>
              <option value="testScore">Daily Test Accuracy (%)</option>
              <option value="questions">Total Questions Solved</option>
              <option value="attendance">Attendance Consistency (%)</option>
            </select>
          </div>

          <select
            value={leaderboardClassFilter}
            onChange={e => {
              playUISound('click');
              setLeaderboardClassFilter(e.target.value);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-[#C8BFA8] rounded-lg text-[#1C2A27]"
          >
            <option value="All">All 6 Sections</option>
            {availableClasses.map(c => (
              <option key={c} value={c}>
                Section {c}
              </option>
            ))}
          </select>

          <select
            value={houseFilter}
            onChange={e => {
              playUISound('click');
              setHouseFilter(e.target.value);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-[#C8BFA8] rounded-lg text-[#1C2A27]"
          >
            <option value="All">All 4 Houses</option>
            <option value="Jal House">Jal House</option>
            <option value="Agni House">Agni House</option>
            <option value="Vayu House">Vayu House</option>
            <option value="Prithvi House">Prithvi House</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search student name or Reg #..."
          value={leaderboardSearch}
          onChange={e => setLeaderboardSearch(e.target.value)}
          className="w-full sm:w-56 px-3 py-1.5 text-xs bg-white border border-[#C8BFA8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
        />
      </div>

      {/* =====================================================================
          ROW 3: CLEAN 2-COLUMN SPLIT (LEFT 8 COLS: TABLE | RIGHT 4 COLS: COMPARE & HOUSES)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT 8 COLUMNS: HIGH-DENSITY LEADERBOARD DATA GRID */}
        <div className="lg:col-span-8 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#FAF6EE] border-b border-[#EAE2D3] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1C2A27]">
              All-School Merit Standings ({filteredList.length} Scholars)
            </h2>
            <span className="text-[11px] font-mono text-[#686052]">Click any row to compare</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] font-mono tracking-wider">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Scholar &amp; ID</th>
                  <th className="py-2.5 px-3">Section · House</th>
                  <th className="py-2.5 px-3 text-right">Merit XP</th>
                  <th className="py-2.5 px-3 text-right">Test Avg</th>
                  <th className="py-2.5 px-3 text-right">Solved Qs</th>
                  <th className="py-2.5 px-3 text-right">Att %</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D3]">
                {filteredList.map((stu, i) => {
                  const isMe = stu.id === currentStudent.id;
                  const isCompared = stu.id === comparedStudent.id;
                  return (
                    <tr
                      key={stu.id}
                      onClick={() => {
                        playUISound('click');
                        setComparedStudentId(stu.id);
                      }}
                      className={`cursor-pointer transition ${
                        isMe
                          ? 'bg-[#EFF5F3] font-semibold'
                          : isCompared
                          ? 'bg-[#FAF6EE]'
                          : 'hover:bg-[#F7F3EB]'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0A4D44] tabular-nums">
                        #{i + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <UserAvatar id={stu.id} name={stu.name} size="w-7 h-7" />
                          <div>
                            <span className="text-[#1C2A27] font-semibold block">
                              {stu.name} {isMe ? '(You)' : ''}
                            </span>
                            <span className="text-[10px] font-mono text-[#686052]">#{stu.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[#4A443B]">
                        {stu.grade} · <span className="text-[11px] text-[#686052]">{stu.house.split(' ')[0]}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0A4D44] tabular-nums">
                        {stu.points.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#1C2A27] tabular-nums">
                        {stu.dailyTestAvgScore}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#9A6B26] tabular-nums">
                        {stu.dailyTestTotalQuestionsAnswered}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#4A443B] tabular-nums">
                        {stu.attendancePct}%
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            playUISound('click');
                            setPrintingStudentId(stu.id);
                          }}
                          className="px-2 py-1 rounded bg-[#F5F0E6] hover:bg-[#0A4D44] text-[#1C2A27] hover:text-white text-[10px] font-semibold transition cursor-pointer"
                        >
                          Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 4 COLUMNS: HEAD-TO-HEAD COMPARATOR & HOUSE CUP STANDINGS */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Head-to-Head Comparator */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-2">
              <h3 className="text-xs font-bold text-[#1C2A27] uppercase tracking-wider font-mono">
                Head-to-Head Benchmark
              </h3>
              <select
                value={comparedStudent.id}
                onChange={e => {
                  playUISound('click');
                  setComparedStudentId(e.target.value);
                }}
                className="px-2 py-1 text-xs font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg"
              >
                {rankedStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    vs {s.name} (#{s.rank})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#EFF5F3] border border-[#9CC5BE]">
                <span className="text-[10px] font-mono text-[#0E6B5E] block">YOU (#{myRankedObj.rank})</span>
                <strong className="text-[#1C2A27] truncate block">{myRankedObj.name}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F7F3EB] border border-[#E2D9C8]">
                <span className="text-[10px] font-mono text-[#9A6B26] block">PEER (#{comparedStudent.rank})</span>
                <strong className="text-[#1C2A27] truncate block">{comparedStudent.name}</strong>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { label: 'Merit XP', myVal: myRankedObj.points, peerVal: comparedStudent.points, suffix: ' XP' },
                { label: 'Daily Test %', myVal: myRankedObj.dailyTestAvgScore, peerVal: comparedStudent.dailyTestAvgScore, suffix: '%' },
                { label: 'Solved Qs', myVal: myRankedObj.dailyTestTotalQuestionsAnswered, peerVal: comparedStudent.dailyTestTotalQuestionsAnswered, suffix: '' },
                { label: 'Attendance', myVal: myRankedObj.attendancePct, peerVal: comparedStudent.attendancePct, suffix: '%' }
              ].map(row => {
                const diff = row.myVal - row.peerVal;
                return (
                  <div key={row.label} className="p-2 rounded-lg bg-[#FAF6EE] border border-[#EAE2D3] flex items-center justify-between">
                    <span className="font-sans text-[#5A5346]">{row.label}</span>
                    <div className="flex items-center gap-2 tabular-nums">
                      <strong className="text-[#0A4D44]">{row.myVal}{row.suffix}</strong>
                      <span className="text-[#B8AFA0]">vs</span>
                      <strong className="text-[#1C2A27]">{row.peerVal}{row.suffix}</strong>
                      <span className={`text-[10px] ${diff >= 0 ? 'text-[#0A4D44]' : 'text-[#8B2626]'}`}>
                        ({diff >= 0 ? `+${diff}` : diff})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: 4-House Championship Cup Standings */}
          <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold text-[#1C2A27] uppercase tracking-wider font-mono border-b border-[#EAE2D3] pb-2">
              Inter-House Cup Standings
            </h3>
            <div className="space-y-2">
              {houseStandings.map((h, idx) => (
                <div key={h.house} className="p-2.5 rounded-lg bg-[#F7F3EB] border border-[#E2D9C8] flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#1C2A27] block">
                      #{idx + 1} {h.house}
                    </strong>
                    <span className="text-[11px] font-mono text-[#686052]">
                      {h.count} Scholars · Avg Test {h.avgTest}%
                    </span>
                  </div>
                  <strong className="font-mono text-sm text-[#0A4D44] tabular-nums">
                    {h.totalXP.toLocaleString()} XP
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
