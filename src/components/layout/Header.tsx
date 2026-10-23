import React, { useState } from 'react';
import { NavItem, RoleType, Student, Teacher, ThemeMode } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';
import { UserAvatar } from '../common/UserAvatar';
import { WORLD_THEMES } from './Sidebar';

interface HeaderProps {
  activeRole: RoleType;
  handleSwitchRole: (role: RoleType) => void;
  setMobileMenuOpen: (val: boolean) => void;
  currentStudent: Student;
  activeTeacher: Teacher;
  activeTeacherId: string;
  setActiveTeacherId: (id: string) => void;
  teachers: Teacher[];
  selectedTeacherClass: string;
  setSelectedTeacherClass: (cls: string) => void;
  availableClasses: string[];
  students: Student[];
  setDiscStudentId: (id: string) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  playUISound: (type?: string) => void;
  handleSelectNavTab?: (tabId: string) => void;
  currentNavList?: NavItem[];
  currentActiveTab?: string;
  isHeaderHidden?: boolean;
  dynamicSubContext?: string;
  onOpenTour?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  handleSwitchRole,
  setMobileMenuOpen,
  currentStudent,
  activeTeacher,
  activeTeacherId,
  setActiveTeacherId,
  teachers,
  selectedTeacherClass,
  setSelectedTeacherClass,
  availableClasses,
  students,
  setDiscStudentId,
  theme,
  setTheme,
  playUISound,
  handleSelectNavTab,
  currentNavList = [],
  currentActiveTab = '',
  dynamicSubContext = '',
  onOpenTour
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const roles: { id: RoleType; label: string }[] = [
    { id: 'student', label: 'Student' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'management', label: 'Admin' }
  ];

  const activeNavObj = currentNavList.find(n => n.id === currentActiveTab) || currentNavList[0];
  const currentThemeObj = WORLD_THEMES.find(t => t.id === theme) || WORLD_THEMES[0];

  return (
    <header className="bg-[#FFFDF9] border-b border-[#DDD4C2] px-3 sm:px-6 py-2.5 flex flex-col justify-center shrink-0 z-20 shadow-xs transition-colors">
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* Left: Mobile Drawer Toggle + Logo + Segmented Role Switcher + Section Selector */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl bg-[#0A4D44] text-white shrink-0 shadow-xs cursor-pointer active:scale-95 transition"
            title="Open Navigation Drawer"
          >
            <StreamlineIcon name="menu" className="w-4 h-4" />
          </button>

          {/* Brand Mark */}
          <div className="hidden sm:flex items-center gap-2 pr-2.5 border-r border-[#DDD4C2] shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#0A4D44] flex items-center justify-center text-white shadow-xs font-bold text-xs">
              EN
            </div>
            <div className="leading-none hidden lg:block">
              <span className="font-extrabold text-xs tracking-tight text-[#1C2A27] block">EduNexus</span>
              <span className="text-[9px] font-mono font-bold text-[#0A4D44] uppercase tracking-widest block">ERP 2026</span>
            </div>
          </div>

          {/* Modern Segmented Role Switcher (Solid Colors) */}
          <div className="flex items-center bg-[#F5F0E6] p-1 rounded-xl border border-[#DDD4C2] shrink-0">
            {roles.map(roleObj => (
              <button
                key={roleObj.id}
                type="button"
                onClick={() => handleSwitchRole(roleObj.id)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeRole === roleObj.id
                    ? 'bg-[#0A4D44] text-white shadow-xs'
                    : 'text-[#686052] hover:text-[#1C2A27] hover:bg-[#F5F0E6]'
                }`}
              >
                {roleObj.label}
              </button>
            ))}
          </div>

          {/* Section Selector */}
          {currentNavList.length > 0 && handleSelectNavTab && (
            <div className="flex items-center gap-1.5 sm:pl-2.5 sm:border-l border-[#DDD4C2] min-w-0 flex-1 sm:flex-initial">
              <div className="hidden sm:flex w-7 h-7 rounded-lg bg-[#EFF5F3] text-[#0A4D44] border border-[#DDD4C2] items-center justify-center shrink-0">
                <StreamlineIcon name={activeNavObj?.icon || 'sparkles'} className="w-3.5 h-3.5" />
              </div>
              <select
                value={currentActiveTab}
                onChange={e => handleSelectNavTab(e.target.value)}
                aria-label="Active Section Selector"
                className="w-full sm:w-auto max-w-[165px] sm:max-w-[220px] text-[11px] sm:text-xs font-bold text-[#1C2A27] bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0A4D44] cursor-pointer truncate"
              >
                {currentNavList.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>

              {dynamicSubContext && (
                <span className="hidden xl:inline-block px-2.5 py-1 rounded-lg bg-[#EFF5F3] border border-[#DDD4C2] text-[11px] font-mono font-semibold text-[#0A4D44] truncate max-w-xs">
                  {dynamicSubContext}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Tour Guide + Theme Switcher + Compact Active User Identity Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Tour Launcher */}
          {onOpenTour && (
            <button
              type="button"
              onClick={() => {
                playUISound('click');
                onOpenTour();
              }}
              title="Launch Guided Tour of All Tools"
              className="px-2.5 py-1.5 rounded-xl border border-[#0A4D44]/30 bg-[#EFF5F3] hover:bg-[#E1EDE8] text-[#0A4D44] text-xs font-extrabold flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-xs">✨</span>
              <span className="hidden sm:inline">Tour</span>
            </button>
          )}

          {/* Quick Theme Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                playUISound('click');
                setIsThemeMenuOpen(prev => !prev);
              }}
              title="Change Theme & Visuals"
              className="px-2.5 py-1.5 rounded-xl border border-[#DDD4C2] bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#1C2A27] text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <span className="text-sm">{currentThemeObj.flag}</span>
              <span className="hidden md:inline text-[11px] font-bold text-[#1C2A27]">{currentThemeObj.name}</span>
              <span className="text-[10px] text-[#686052]">▾</span>
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl shadow-xl p-1.5 z-50">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#686052] border-b border-[#EAE2D3] mb-1">
                  Select Visual Theme
                </div>
                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {WORLD_THEMES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        playUISound('click');
                        setTheme(t.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between text-left transition cursor-pointer ${
                        theme === t.id
                          ? 'bg-[#0A4D44] text-white font-bold'
                          : 'text-[#1C2A27] hover:bg-[#F5F0E6]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{t.flag}</span>
                        <span className="truncate">{t.name}</span>
                      </div>
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: t.swatchAccent }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {activeRole === 'student' && (
            <div className="flex items-center gap-2 bg-[#FFFDF9] border border-[#DDD4C2] px-2.5 sm:px-3 py-1 rounded-xl shadow-2xs">
              <div className="relative">
                <UserAvatar id={currentStudent.id} name={currentStudent.name} size="w-7 h-7" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#0A4D44] ring-2 ring-[#FFFDF9]" />
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-xs">
                <span className="font-extrabold text-[#1C2A27] truncate max-w-[120px]">{currentStudent.name}</span>
                <span className="text-[#686052]">·</span>
                <span className="font-mono text-[#0A4D44] font-bold">Sec {currentStudent.grade}</span>
                <span className="hidden lg:inline text-[#686052]">·</span>
                <span className="hidden lg:inline font-mono text-[#686052]">#{currentStudent.id}</span>
              </div>
            </div>
          )}

          {activeRole === 'teacher' && (
            <div className="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#DDD4C2] px-2 py-1 rounded-xl shadow-2xs">
              <div className="relative">
                <UserAvatar id={activeTeacher.id} name={activeTeacher.name} size="w-7 h-7" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#0A4D44] ring-2 ring-[#FFFDF9]" />
              </div>
              <select
                value={activeTeacherId}
                onChange={e => {
                  playUISound('click');
                  setActiveTeacherId(e.target.value);
                }}
                className="max-w-[130px] sm:max-w-[180px] text-[11px] sm:text-xs font-bold text-[#1C2A27] bg-[#FFFDF9] border border-[#DDD4C2] rounded-lg px-2 py-1 focus:outline-none cursor-pointer truncate"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} (#{t.id})
                  </option>
                ))}
              </select>
              <select
                value={selectedTeacherClass}
                onChange={e => {
                  playUISound('click');
                  setSelectedTeacherClass(e.target.value);
                  const firstStu = students.find(s => s.grade === e.target.value);
                  if (firstStu) setDiscStudentId(firstStu.id);
                }}
                className="text-[11px] sm:text-xs font-bold text-white bg-[#0A4D44] rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                {availableClasses.map(c => (
                  <option key={c} value={c}>
                    Sec {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeRole === 'management' && (
            <div className="flex items-center gap-2 bg-[#FFFDF9] border border-[#DDD4C2] px-2.5 py-1 rounded-xl shadow-2xs">
              <div className="relative">
                <UserAvatar id="100001" name="Principal Directorate" size="w-7 h-7" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#0A4D44] ring-2 ring-[#FFFDF9]" />
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-xs">
                <span className="font-extrabold text-[#1C2A27]">Dr. S. Radhakrishnan</span>
                <span className="text-[#686052]">·</span>
                <span className="font-mono text-[#0A4D44] font-bold">Directorate</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
