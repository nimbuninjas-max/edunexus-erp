import React from 'react';
import { CampusStaffMember } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';

interface SalaryVoucherModalProps {
  staffMember: CampusStaffMember | null;
  onClose: () => void;
  playUISound?: (type?: string) => void;
  showToast?: (title: string, description: string, type?: string) => void;
  onDisburse?: (id: string) => void;
}

export const SalaryVoucherModal: React.FC<SalaryVoucherModalProps> = ({
  staffMember,
  onClose,
  playUISound,
  showToast,
  onDisburse
}) => {
  if (!staffMember) return null;

  const basic = staffMember.basicSalary;
  const da = Math.round(staffMember.allowances * 0.45);
  const hra = Math.round(staffMember.allowances * 0.40);
  const specialAllow = staffMember.allowances - da - hra;

  const pf = Math.round(staffMember.deductions * 0.65);
  const pt = Math.round(staffMember.deductions * 0.15);
  const healthFund = staffMember.deductions - pf - pt;

  const grossEarnings = basic + staffMember.allowances;
  const totalDeductions = staffMember.deductions;
  const netPay = staffMember.netSalary;

  const handlePrint = () => {
    if (playUISound) playUISound('click');
    window.print();
    if (showToast) {
      showToast('Printing Salary Voucher', `Generated official pay slip for ${staffMember.name}.`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#13221F]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFDF9] border border-[#D5CBB8] rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
        {/* Header Strip */}
        <div className="flex items-start justify-between border-b border-[#DDD4C2] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0A3630] text-[#F5F0E6]">
                Official Payroll Record
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                staffMember.payrollStatus === 'Disbursed'
                  ? 'bg-[#EFF5F3] text-[#0A4D44] border-[#9CC5BE]'
                  : 'bg-[#FAF2F2] text-[#8B2626] border-[#E2B4B4]'
              }`}>
                {staffMember.payrollStatus}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#1C2A27] mt-1.5 tracking-tight">
              EDUNEXUS VIDYA MANDIR
            </h2>
            <p className="text-xs text-[#5A5346] font-medium">
              Directorate of Institutional Finance, Human Resources & Staff Treasury • Session 2026–27
            </p>
            <p className="text-[11px] font-mono text-[#8A5A19] mt-0.5">
              Pay Slip for Month: <strong className="text-[#1C2A27]">October 2026</strong> · Voucher Ref: <span className="underline">EN-PR-2026-10-{staffMember.id}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <StreamlineIcon name="print" className="w-3.5 h-3.5" /> Print Voucher
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#D5CBB8] bg-[#F5F0E6] hover:bg-[#EAE2D3] text-[#1C2A27]"
            >
              <StreamlineIcon name="close" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Employee Particulars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F3EB] p-4 rounded-xl border border-[#DDD4C2] text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#686052]">Employee Name</span>
            <p className="font-bold text-[#1C2A27] text-sm mt-0.5">{staffMember.name}</p>
            <p className="font-mono text-[#0E6B5E] text-[11px]">Numeric Reg #{staffMember.id}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#686052]">Designation & Wing</span>
            <p className="font-semibold text-[#1C2A27] mt-0.5">{staffMember.designation}</p>
            <p className="text-[11px] text-[#686052]">{staffMember.roleCategory}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#686052]">Duty Zone & Shift</span>
            <p className="font-medium text-[#1C2A27] mt-0.5">{staffMember.departmentOrZone}</p>
            <p className="text-[11px] font-mono text-[#8A5A19]">{staffMember.shift}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#686052]">Bank Remittance</span>
            <p className="font-mono font-semibold text-[#1C2A27] mt-0.5">{staffMember.bankAccount}</p>
            <p className="text-[11px] text-[#0A4D44] font-medium">NEFT / RTGS Salary Wire</p>
          </div>
        </div>

        {/* Duty & Task Station */}
        <div className="p-3 bg-[#FFFDF9] rounded-lg border border-[#E2D9C8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-semibold text-[#686052] uppercase text-[10px]">Current Station / Task:</span>
            <p className="font-medium text-[#1C2A27] mt-0.5">{staffMember.assignedTask}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-[#686052]">Biometric Status:</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EFF5F3] text-[#0A4D44] border border-[#9CC5BE]">
              {staffMember.dutyStatus}
            </span>
          </div>
        </div>

        {/* Two-Column Earnings & Deductions Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="border border-[#DDD4C2] rounded-xl overflow-hidden bg-white">
            <div className="bg-[#0A3630] text-[#F5F0E6] px-4 py-2.5 flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
              <span>Earnings Component</span>
              <span>Amount (₹)</span>
            </div>
            <div className="divide-y divide-[#EAE2D3] text-xs">
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-[#3A3226]">Basic Pay Scale</span>
                <span className="font-mono font-semibold text-[#1C2A27]">₹{basic.toLocaleString()}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-[#3A3226]">Dearness Allowance (DA 45%)</span>
                <span className="font-mono text-[#1C2A27]">₹{da.toLocaleString()}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-[#3A3226]">House Rent Allowance (HRA 40%)</span>
                <span className="font-mono text-[#1C2A27]">₹{hra.toLocaleString()}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-[#3A3226]">Conveyance & Special Institutional Allowances</span>
                <span className="font-mono text-[#1C2A27]">₹{specialAllow.toLocaleString()}</span>
              </div>
              <div className="px-4 py-3 bg-[#F7F3EB] flex justify-between font-bold text-xs border-t border-[#DDD4C2]">
                <span className="text-[#0A3630]">Gross Monthly Earnings</span>
                <span className="font-mono text-[#0A4D44] text-sm">₹{grossEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-[#DDD4C2] rounded-xl overflow-hidden bg-white">
            <div className="bg-[#5A2323] text-[#F5F0E6] px-4 py-2.5 flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
              <span>Statutory Deductions</span>
              <span>Amount (₹)</span>
            </div>
            <div className="divide-y divide-[#EAE2D3] text-xs">
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-[#3A3226]">Provident Fund (EPF Contribution)</span>
                <span className="font-mono text-[#8B2626]">₹{pf.toLocaleString()}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-[#3A3226]">Professional Tax (PT)</span>
                <span className="font-mono text-[#8B2626]">₹{pt.toLocaleString()}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-[#3A3226]">ESI / Staff Welfare Health Group</span>
                <span className="font-mono text-[#8B2626]">₹{healthFund.toLocaleString()}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between text-[#857B6E] italic text-[11px]">
                <span>Loss of Pay / Unapproved Absences</span>
                <span className="font-mono">₹0 (Zero LOP)</span>
              </div>
              <div className="px-4 py-3 bg-[#FAF2F2] flex justify-between font-bold text-xs border-t border-[#E2B4B4]">
                <span className="text-[#8B2626]">Total Deductions</span>
                <span className="font-mono text-[#8B2626] text-sm">₹{totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary Highlight Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#EFF5F3] to-[#E3EFE9] border border-[#9CC5BE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E6B5E]">
              Net Disbursable Take-Home Compensation
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0A3630] font-mono">
                ₹{netPay.toLocaleString()}
              </span>
              <span className="text-xs text-[#5A5346] font-medium">
                (Gross ₹{grossEarnings.toLocaleString()} – Deductions ₹{totalDeductions.toLocaleString()})
              </span>
            </div>
            <p className="text-[11px] text-[#0A4D44] font-medium mt-1">
              UTR Reference: <strong className="font-mono text-[#1C2A27]">{staffMember.lastPaidDate}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {staffMember.payrollStatus === 'Pending' && onDisburse && (
              <button
                type="button"
                onClick={() => {
                  onDisburse(staffMember.id);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-white text-xs font-bold transition shadow-md"
              >
                Disburse Now (₹{netPay.toLocaleString()})
              </button>
            )}
          </div>
        </div>

        {/* Signature & Verification Seal */}
        <div className="border-t border-[#DDD4C2] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#686052]">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-[#1C2A27]">Vikramaditya Malhotra</p>
            <p className="text-[11px]">Chief Finance & Staff Payroll Bursar (#100002)</p>
          </div>
          <div className="px-4 py-1.5 rounded-lg border border-[#D5CBB8] bg-[#F7F3EB] font-mono text-[10px] text-center">
            🔒 Digitally Audited & Encrypted Salary Slip • EduNexus ERP Certified
          </div>
          <div className="text-center sm:text-right">
            <p className="font-semibold text-[#1C2A27]">Dr. S. Radhakrishnan</p>
            <p className="text-[11px]">Principal & School Directorate (#100001)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
