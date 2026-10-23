import React from 'react';
import { RankedStudent, StudentAcademicSummary, DisciplineCase } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';

interface ReportCardModalProps {
  printingStudentId: string | null;
  rankedStudents: RankedStudent[];
  currentStudentRankObj: RankedStudent;
  getStudentAcademicSummary: (studentId: string) => StudentAcademicSummary;
  disciplineCases: DisciplineCase[];
  onClose: () => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  printingStudentId,
  rankedStudents,
  currentStudentRankObj,
  getStudentAcademicSummary,
  disciplineCases,
  onClose,
  playUISound,
  showToast
}) => {
  if (!printingStudentId) return null;

  const targetStu = rankedStudents.find(s => s.id === printingStudentId) || currentStudentRankObj;
  const targetAcad = getStudentAcademicSummary(targetStu.id);
  const targetCases = disciplineCases.filter(c => c.studentId === targetStu.id);

  return (
    <div className="fixed inset-0 z-50 bg-[#13221F]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFDF9] border border-[#D5CBB8] rounded-xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[#DDD4C2] pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
              Official Multi-Stage Academic Transcript & Conduct Dossier
            </p>
            <h2 className="text-lg font-semibold text-[#1C2A27] mt-0.5">EDUNEXUS VIDYA MANDIR</h2>
            <p className="text-xs text-[#686052]">
              Separate Unit Tests, Separate Mid-Term, Separate End-Term & Grand Overall Result (Session 2026–27)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-[#D5CBB8] bg-[#F5F0E6] hover:bg-[#EAE2D3] text-[#1C2A27]"
          >
            <StreamlineIcon name="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Candidate Identity Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F5F0E6] p-4 rounded-lg border border-[#DDD4C2]">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#686052]">Candidate Name</p>
            <p className="text-xs sm:text-sm font-semibold text-[#1C2A27] mt-0.5">{targetStu.name}</p>
            <p className="text-[11px] font-mono text-[#686052]">Reg #{targetStu.id} · Roll #{targetStu.rollNo}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#686052]">Section & House</p>
            <p className="text-xs sm:text-sm font-semibold text-[#0A4D44] mt-0.5">Section {targetStu.grade}</p>
            <p className="text-[11px] text-[#686052]">{targetStu.house}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#686052]">Attendance</p>
            <p className="text-xs sm:text-sm font-mono font-semibold text-[#0E6B5E] mt-0.5">
              {targetStu.attendancePct}% ({targetStu.presentDays}/{targetStu.totalDays})
            </p>
            <p className="text-[11px] text-[#8B2626] font-medium">{targetCases.length} Conduct Note(s)</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#686052]">Grand Overall %</p>
            <p className="text-xs sm:text-sm font-mono font-semibold text-[#0A4D44] mt-0.5">
              {targetAcad.rawGrandPct}% ({targetAcad.grandTotalObtained}/{targetAcad.grandTotalMaxMarks})
            </p>
            <p className="text-[11px] text-[#686052]">{targetAcad.cbseGrade}</p>
          </div>
        </div>

        {/* PART 1: SEPARATE UNIT TESTS REPORT (U1, U2, U3) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0A4D44]">
              Part 1: Unit Test Assessment (Separate — Unit 1, Unit 2 & Unit 3)
            </h3>
            <span className="text-xs font-mono font-semibold text-[#0A4D44]">
              All-Subjects Combined Unit Test: {targetAcad.totalUnitMarksObtained} / {targetAcad.totalUnitMaxMarks} ({targetAcad.unitAvg}%)
            </span>
          </div>
          <div className="overflow-x-auto border border-[#DDD4C2] rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#0A3630] text-[#F5F0E6]">
                  <th className="py-2 px-3 font-sans">Subject</th>
                  <th className="py-2 px-2 text-center">Unit 1 (100)</th>
                  <th className="py-2 px-2 text-center">Unit 2 (100)</th>
                  <th className="py-2 px-2 text-center">Unit 3 (100)</th>
                  <th className="py-2 px-3 text-center bg-[#124E45]">Subject Unit Total (/300)</th>
                  <th className="py-2 px-3 text-right bg-[#124E45]">Subject Unit %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D3]">
                {targetAcad.subjectsList.map((sub, i) => (
                  <tr key={i}>
                    <td className="py-2 px-3 font-sans font-medium text-[#1C2A27]">{sub.name}</td>
                    <td className="py-2 px-2 text-center">{sub.u1}%</td>
                    <td className="py-2 px-2 text-center">{sub.u2}%</td>
                    <td className="py-2 px-2 text-center">{sub.u3}%</td>
                    <td className="py-2 px-3 text-center font-semibold text-[#0A4D44] bg-[#EFF5F3]">{sub.unitTotalObtained} / 300</td>
                    <td className="py-2 px-3 text-right font-semibold text-[#0A4D44] bg-[#EFF5F3]">{sub.unitPct}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#EAE2D3] font-semibold text-[#1C2A27]">
                  <td className="py-2 px-3 font-sans">Combined All Subjects (Unit Tests)</td>
                  <td className="py-2 px-2 text-center">{targetAcad.unit1}%</td>
                  <td className="py-2 px-2 text-center">{targetAcad.unit2}%</td>
                  <td className="py-2 px-2 text-center">{targetAcad.unit3}%</td>
                  <td className="py-2 px-3 text-center text-[#0A4D44]">
                    {targetAcad.totalUnitMarksObtained} / {targetAcad.totalUnitMaxMarks}
                  </td>
                  <td className="py-2 px-3 text-right text-[#0A4D44]">{targetAcad.unitAvg}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* PART 2 & PART 3: SEPARATE MID-TERM AND SEPARATE END-TERM EXAMINATIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Separate Mid-Term Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0E6B5E]">
                Part 2: Mid-Term Exam (Separate)
              </h3>
              <span className="text-xs font-mono font-semibold text-[#0E6B5E]">
                {targetAcad.totalMidtermObtained}/{targetAcad.totalMidtermMaxMarks} ({targetAcad.midterm}%)
              </span>
            </div>
            <div className="border border-[#DDD4C2] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[#0A3630] text-[#F5F0E6]">
                    <th className="py-2 px-3 font-sans">Subject</th>
                    <th className="py-2 px-2 text-center">Marks (/100)</th>
                    <th className="py-2 px-3 text-right">Subject %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D3]">
                  {targetAcad.subjectsList.map((sub, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 font-sans font-medium text-[#1C2A27]">{sub.name}</td>
                      <td className="py-2 px-2 text-center">{sub.mid} / 100</td>
                      <td className="py-2 px-3 text-right font-semibold text-[#0E6B5E]">{sub.mid}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#EAE2D3] font-semibold text-[#1C2A27]">
                    <td className="py-2 px-3 font-sans">All Subjects Mid-Term</td>
                    <td className="py-2 px-2 text-center">
                      {targetAcad.totalMidtermObtained} / {targetAcad.totalMidtermMaxMarks}
                    </td>
                    <td className="py-2 px-3 text-right text-[#0E6B5E]">{targetAcad.midterm}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Separate End-Term Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9A6B26]">
                Part 3: End-Term Exam (Separate)
              </h3>
              <span className="text-xs font-mono font-semibold text-[#9A6B26]">
                {targetAcad.totalFinalObtained}/{targetAcad.totalFinalMaxMarks} ({targetAcad.finalExam}%)
              </span>
            </div>
            <div className="border border-[#DDD4C2] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[#0A3630] text-[#F5F0E6]">
                    <th className="py-2 px-3 font-sans">Subject</th>
                    <th className="py-2 px-2 text-center">Marks (/100)</th>
                    <th className="py-2 px-3 text-right">Subject %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D3]">
                  {targetAcad.subjectsList.map((sub, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 font-sans font-medium text-[#1C2A27]">{sub.name}</td>
                      <td className="py-2 px-2 text-center">{sub.final} / 100</td>
                      <td className="py-2 px-3 text-right font-semibold text-[#9A6B26]">{sub.final}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#EAE2D3] font-semibold text-[#1C2A27]">
                    <td className="py-2 px-3 font-sans">All Subjects End-Term</td>
                    <td className="py-2 px-2 text-center">
                      {targetAcad.totalFinalObtained} / {targetAcad.totalFinalMaxMarks}
                    </td>
                    <td className="py-2 px-3 text-right text-[#9A6B26]">{targetAcad.finalExam}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* PART 4: GRAND OVERALL RESULT MIXING UNIT TESTS + MID-TERM + END-TERM */}
        <div className="p-4 rounded-xl border border-[#0A4D44] bg-[#EFF5F3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0A4D44]">
              Part 4: Final Grand Overall Result (Unit Tests + Mid-Term + End-Term Combined)
            </p>
            <p className="text-lg font-mono font-bold text-[#1C2A27] mt-1">
              Total Marks Secured: {targetAcad.grandTotalObtained} / {targetAcad.grandTotalMaxMarks}
            </p>
            <p className="text-xs text-[#5A5346] mt-0.5">
              Unit Tests ({targetAcad.totalUnitMarksObtained}/1500) + Mid-Term ({targetAcad.totalMidtermObtained}/500) + End-Term ({targetAcad.totalFinalObtained}/500)
            </p>
          </div>
          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] uppercase tracking-wider text-[#0E6B5E] block">
              Overall Percentage Out of 100%
            </span>
            <strong className="text-2xl text-[#0A4D44]">{targetAcad.rawGrandPct}% / 100%</strong>
            <span className="block text-[11px] text-[#5A5346]">
              Weighted CBSE Index: {targetAcad.combinedOverallPct}% · {targetAcad.cbseGrade}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DDD4C2]">
          <span className="text-[11px] text-[#686052]">
            Authorized by <strong className="text-[#1C2A27]">Principal Directorate & Controller of Examinations</strong>
          </span>
          <button
            onClick={() => {
              playUISound('success');
              window.print();
              showToast('Transcript Ready', `Report card for ${targetStu.name} sent to PDF printer.`, 'success');
            }}
            className="px-4 py-2 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] font-medium text-xs flex items-center gap-2"
          >
            <StreamlineIcon name="print" className="w-4 h-4" /> Print / Save Official PDF
          </button>
        </div>
      </div>
    </div>
  );
};
