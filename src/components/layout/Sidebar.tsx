import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavItem, RoleType, SoundProfile, Student, ThemeMode } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';

export const WORLD_THEMES: {
  id: ThemeMode;
  flag: string;
  name: string;
  country: string;
  swatchBg: string;
  swatchAccent: string;
}[] = [
  { id: 'botanical', flag: '🇮🇳', name: 'Royal Nalanda', country: 'India Heritage', swatchBg: '#F5F0E6', swatchAccent: '#0A4D44' },
  { id: 'kyoto', flag: '🇯🇵', name: 'Kyoto Sakura', country: 'Japan Zen', swatchBg: '#FCF5F7', swatchAccent: '#BE185D' },
  { id: 'swiss', flag: '🇨🇭', name: 'Alpine Zurich', country: 'Switzerland', swatchBg: '#EEF4F8', swatchAccent: '#0284C7' },
  { id: 'nordic', flag: '🇸🇪', name: 'Nordic Aurora', country: 'Sweden Fjord', swatchBg: '#EDF6F5', swatchAccent: '#0D9488' },
  { id: 'santorini', flag: '🇬🇷', name: 'Aegean Cyclades', country: 'Greece', swatchBg: '#EFF6FF', swatchAccent: '#1D4ED8' },
  { id: 'marrakech', flag: '🇲🇦', name: 'Marrakech Riyad', country: 'Morocco Spice', swatchBg: '#FDF5EA', swatchAccent: '#C2410C' },
  { id: 'oxford', flag: '🇬🇧', name: 'Oxford Bodleian', country: 'UK Classic', swatchBg: '#F4F2EA', swatchAccent: '#3730A3' },
  { id: 'slate', flag: '🇺🇸', name: 'Silicon Slate', country: 'USA Daylight', swatchBg: '#F1F5F9', swatchAccent: '#1E40AF' },
  { id: 'dark', flag: '🌙', name: 'Obsidian Carbon', country: 'Dark Mode', swatchBg: '#0B1114', swatchAccent: '#10B981' },
  { id: 'midnight', flag: '🌌', name: 'Cyber Midnight', country: 'Tokyo OLED', swatchBg: '#090D16', swatchAccent: '#3B82F6' }
];

export const AUDIO_SOUND_PACKS: {
  id: SoundProfile;
  label: string;
  subtitle: string;
}[] = [
  { id: 'indian', label: '🇮🇳 Sitar & Tabla Pluck', subtitle: 'Indian Classical Harmonics' },
  { id: 'japanese', label: '🇯🇵 Koto & Bamboo Zen', subtitle: 'Kyoto Pentatonic Chime' },
  { id: 'swiss', label: '🇨🇭 Swiss Mechanical Tick', subtitle: 'Precision Horology Click' },
  { id: 'marimba', label: '🇸🇪 Nordic Glass Marimba', subtitle: 'Warm Acoustic Bell' },
  { id: 'arcade', label: '🕹️ Retro 8-Bit Synth', subtitle: 'Classic Chiptune Arpeggio' },
  { id: 'minimal', label: '💧 Zen Water Droplet', subtitle: 'Soft Acoustic Bubble' }
];

interface SidebarProps {
  activeRole: RoleType;
  dockExpanded: boolean;
  setDockExpanded: (val: boolean) => void;
  currentNavList: NavItem[];
  currentActiveTab: string;
  handleSelectNavTab: (tabId: string) => void;
  availableClasses: string[];
  selectedTeacherClass: string;
  setSelectedTeacherClass: (cls: string) => void;
  students: Student[];
  setDiscStudentId: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  soundVolume: number;
  setSoundVolume: (val: number) => void;
  soundProfile?: SoundProfile;
  setSoundProfile?: (profile: SoundProfile) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  playUISound: (type?: string) => void;
  onOpenTour?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRole,
  dockExpanded,
  setDockExpanded,
  currentNavList,
  currentActiveTab,
  handleSelectNavTab,
  availableClasses,
  selectedTeacherClass,
  setSelectedTeacherClass,
  students,
  setDiscStudentId,
  soundEnabled,
  setSoundEnabled,
  soundVolume,
  setSoundVolume,
  soundProfile = 'marimba',
  setSoundProfile,
  theme,
  setTheme,
  playUISound,
  onOpenTour
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navScrollRef = useRef<HTMLDivElement | null>(null);

  const updateScrollIndicators = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = Math.max(0, scrollHeight - clientHeight);
    setCanScrollUp(scrollTop > 6);
    setCanScrollDown(maxScroll - scrollTop > 6);
    setScrollProgress(maxScroll > 0 ? Math.min(100, Math.round((scrollTop / maxScroll) * 100)) : 0);
  }, []);

  useEffect(() => {
    updateScrollIndicators();
    window.addEventListener('resize', updateScrollIndicators);
    return () => window.removeEventListener('resize', updateScrollIndicators);
  }, [currentNavList, dockExpanded, updateScrollIndicators]);

  const scrollByAmount = (delta: number) => {
    if (!navScrollRef.current) return;
    playUISound('click');
    navScrollRef.current.scrollBy({ top: delta, behavior: 'smooth' });
  };

  const activeThemeObj = WORLD_THEMES.find(t => t.id === theme) || WORLD_THEMES[0];
  const roleLabel = activeRole === 'student' ? 'Student' : activeRole === 'teacher' ? 'Teacher' : 'Admin';

  return (
    <aside
      className={`hidden md:flex flex-col justify-between bg-[#072E29] text-[#F5F0E6] border-r border-[#14463F] shrink-0 transition-all duration-300 ease-out select-none relative z-40 ${
        dockExpanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* SINGLE Sleek Custom Scroll Progress Rail on Right Edge (Native scrollbar hidden via .sidebar-modern-scroll) */}
      {(canScrollUp || canScrollDown) && (
        <div className="absolute right-0.5 top-16 bottom-16 w-[3px] bg-[#0D3D36]/70 rounded-full pointer-events-none z-20 overflow-hidden">
          <div
            className="w-full bg-emerald-400 rounded-full transition-transform duration-150"
            style={{
              height: '28%',
              transform: `translateY(${(scrollProgress / 100) * 255}%)`
            }}
          />
        </div>
      )}

      {/* Top Brand Header (Fixed) */}
      <div className="p-2.5 pb-2 border-b border-[#12423B]/80 shrink-0">
        <div
          className={`flex items-center ${
            dockExpanded ? 'justify-between px-1.5' : 'justify-center'
          }`}
        >
          {dockExpanded && (
            <div className="min-w-0 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-[#0E6B5E] text-[#041E1A] font-mono font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                EN
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm tracking-tight text-[#F5F0E6] leading-none truncate">
                  EduNexus
                </p>
                <p className="text-[9.5px] font-mono uppercase tracking-widest text-emerald-300/90 mt-0.5 truncate">
                  {roleLabel} Dock
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              playUISound('click');
              setDockExpanded(!dockExpanded);
            }}
            title={dockExpanded ? 'Collapse Slider Docker' : 'Expand Slider Docker'}
            className="p-2 rounded-xl bg-[#0D3D36] hover:bg-[#16574D] border border-[#1B574E] text-[#C5D6D1] hover:text-white transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <StreamlineIcon
              name={dockExpanded ? 'sidebar-collapse' : 'sidebar-expand'}
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>

      {/* Single-Rail Scrollable Navigation Dock Container */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        {canScrollUp && (
          <div className="absolute top-0 left-0 right-1 h-6 bg-gradient-to-b from-[#072E29] via-[#072E29]/85 to-transparent z-10 flex items-start justify-center pt-0.5 pointer-events-none">
            <button
              type="button"
              onClick={() => scrollByAmount(-140)}
              className="pointer-events-auto px-2 py-0.5 rounded-full bg-[#0F4840]/95 hover:bg-emerald-500 text-[9px] font-mono text-emerald-200 hover:text-[#041E1A] border border-emerald-400/30 shadow-md transition cursor-pointer"
              title="Scroll Up"
            >
              ▲
            </button>
          </div>
        )}

        <div
          ref={navScrollRef}
          onScroll={updateScrollIndicators}
          className="sidebar-modern-scroll flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-2 space-y-1"
        >
          {currentNavList.map((item, idx) => {
            const isActive = currentActiveTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectNavTab(item.id)}
                title={!dockExpanded ? item.label : undefined}
                className={`group relative w-full flex items-center ${
                  dockExpanded
                    ? 'px-3 py-2.5 gap-3 justify-between'
                    : 'justify-center py-2.5 px-0'
                } rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#F5F0E6] text-[#072E29] font-semibold shadow-sm translate-x-0.5'
                    : 'text-[#B5CFCB] hover:bg-[#0E4038]/90 hover:text-[#F5F0E6]'
                }`}
              >
                {isActive && (
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full ${
                      dockExpanded ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                )}

                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isActive
                        ? 'bg-[#072E29] text-[#F5F0E6]'
                        : 'bg-[#0B3831] text-[#9CC5BE] group-hover:bg-[#134D44] group-hover:text-white'
                    }`}
                  >
                    <StreamlineIcon name={item.icon} className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  {dockExpanded && (
                    <span className="truncate tracking-tight">{item.label}</span>
                  )}
                </div>

                {dockExpanded && (
                  <span
                    className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded-md shrink-0 transition-opacity ${
                      isActive
                        ? 'bg-[#072E29]/10 text-[#072E29] font-bold opacity-100'
                        : 'text-[#6E9E95] opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {canScrollDown && (
          <div className="absolute bottom-0 left-0 right-1 h-6 bg-gradient-to-t from-[#072E29] via-[#072E29]/85 to-transparent z-10 flex items-end justify-center pb-0.5 pointer-events-none">
            <button
              type="button"
              onClick={() => scrollByAmount(140)}
              className="pointer-events-auto px-2 py-0.5 rounded-full bg-[#0F4840]/95 hover:bg-emerald-500 text-[9px] font-mono text-emerald-200 hover:text-[#041E1A] border border-emerald-400/30 shadow-md transition cursor-pointer"
              title="Scroll Down"
            >
              ▼
            </button>
          </div>
        )}
      </div>

      {/* Bottom Dock: Settings Button with 10 World Themes & 6 Audio Versions */}
      <div className="p-2.5 border-t border-[#14463F] relative shrink-0 bg-[#062824]">
        {settingsOpen && (
          <div className="absolute bottom-14 left-2.5 z-50 w-80 max-h-[82vh] overflow-y-auto rounded-2xl bg-[#041E1A] border border-[#1E5B50] p-4 text-[#F5F0E6] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#164841] pb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono block">
                  Theme &amp; Audio Studio
                </span>
                <span className="text-[10px] text-[#9CC5BE]">
                  10 World Themes · 6 Sound Engines
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="text-xs text-[#8AB0A9] hover:text-white font-bold px-2 py-1 rounded-lg bg-[#0D3D36] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 1. Audio Sound Effects Toggle & Master Volume */}
            <div className="p-2.5 rounded-xl bg-[#072E29] border border-[#164841] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <StreamlineIcon
                    name={soundEnabled && soundVolume > 0 ? 'sound-on' : 'sound-off'}
                    className="w-4 h-4 text-emerald-300"
                  />
                  <span className="font-semibold">Audio Sound Engine</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) playUISound('success');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-500 text-[#041E1A]'
                      : 'bg-[#0D3D36] text-[#8AB0A9]'
                  }`}
                >
                  {soundEnabled ? 'ON' : 'MUTED'}
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#9CC5BE]">Master Volume</span>
                  <span className="text-amber-300 font-bold">
                    {soundEnabled ? `${soundVolume}%` : '0% (Muted)'}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={soundEnabled ? soundVolume : 0}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setSoundVolume(val);
                    if (val > 0 && !soundEnabled) setSoundEnabled(true);
                    if (val === 0) setSoundEnabled(false);
                  }}
                  onMouseUp={() => playUISound('click')}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 rounded-lg bg-[#0D3D36]"
                />
              </div>

              {/* 2. 6 Synthesized Audio Sound Packs */}
              {setSoundProfile && (
                <div className="pt-2 border-t border-[#164841] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                    Audio Version / Instrument Pack (6)
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {AUDIO_SOUND_PACKS.map(pack => {
                      const activePack = soundProfile === pack.id;
                      return (
                        <button
                          key={pack.id}
                          type="button"
                          onClick={() => {
                            setSoundProfile(pack.id);
                            if (!soundEnabled) setSoundEnabled(true);
                            setTimeout(() => playUISound('role'), 25);
                          }}
                          className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                            activePack
                              ? 'bg-emerald-500/20 border-emerald-400 text-white'
                              : 'bg-[#041E1A] hover:bg-[#0D3D36] border-[#164841] text-[#B5CFCB]'
                          }`}
                        >
                          <div className="text-[11px] font-bold truncate">{pack.label}</div>
                          <div className="text-[9.5px] text-[#8AB0A9] truncate">{pack.subtitle}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. 10 Curated World Country & Dark Themes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                  10 World &amp; Cultural Themes
                </span>
                <span className="text-[10px] font-mono text-amber-300">
                  {activeThemeObj.flag} {activeThemeObj.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {WORLD_THEMES.map(tObj => {
                  const isSelected = theme === tObj.id;
                  return (
                    <button
                      key={tObj.id}
                      type="button"
                      onClick={() => {
                        playUISound('tab');
                        setTheme(tObj.id);
                      }}
                      className={`p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-sm'
                          : 'bg-[#072E29] hover:bg-[#0D3D36] text-[#E2ECE9] border-[#184D44]'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-md border border-black/20 shrink-0 flex items-center justify-center text-xs shadow-2xs"
                        style={{
                          background: `linear-gradient(135deg, ${tObj.swatchBg} 50%, ${tObj.swatchAccent} 50%)`
                        }}
                      >
                        {tObj.flag}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold truncate leading-tight">
                          {tObj.name}
                        </div>
                        <div
                          className={`text-[9.5px] truncate ${
                            isSelected ? 'text-emerald-100' : 'text-[#8AB0A9]'
                          }`}
                        >
                          {tObj.country}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Teacher Classroom Switcher (only if Teacher role) */}
            {activeRole === 'teacher' && (
              <div className="pt-2 border-t border-[#164841] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8AB0A9] block">
                  Active Classroom Section
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {availableClasses.map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        playUISound('click');
                        setSelectedTeacherClass(cls);
                        const firstStu = students.find(s => s.grade === cls);
                        if (firstStu) setDiscStudentId(firstStu.id);
                      }}
                      className={`py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                        selectedTeacherClass === cls
                          ? 'bg-[#F5F0E6] text-[#072E29]'
                          : 'bg-[#0D3D36] text-[#B5CFCB] hover:text-white'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guided Tour Launcher */}
        {onOpenTour && (
          <button
            type="button"
            onClick={() => {
              playUISound('click');
              onOpenTour();
            }}
            title="Take Guided Tour of All Tools"
            className={`w-full flex items-center ${
              dockExpanded ? 'px-3 py-2 justify-between' : 'justify-center py-2'
            } rounded-xl text-xs font-bold transition cursor-pointer bg-[#0A4D44] hover:bg-[#0D5B50] text-[#E2ECE9] border border-[#175C51] shadow-2xs mb-1.5`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-sm">✨</span>
              {dockExpanded && <span className="truncate">Explore Tour Guide</span>}
            </div>
            {dockExpanded && (
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                Tour
              </span>
            )}
          </button>
        )}

        {/* Single Settings Button at the Bottom */}
        <button
          type="button"
          onClick={() => {
            playUISound('click');
            setSettingsOpen(prev => !prev);
          }}
          title="Settings (10 Themes, Audio Versions & Volume)"
          className={`w-full flex items-center ${
            dockExpanded ? 'px-3 py-2.5 justify-between' : 'justify-center py-2.5'
          } rounded-xl text-xs font-semibold transition cursor-pointer ${
            settingsOpen
              ? 'bg-[#F5F0E6] text-[#072E29]'
              : 'bg-[#0D3D36] hover:bg-[#145047] text-[#E2ECE9]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <StreamlineIcon name="settings" className="w-4 h-4 shrink-0" />
            {dockExpanded && <span className="truncate">Themes &amp; Settings</span>}
          </div>
          {dockExpanded && (
            <span className="text-[10px] font-mono opacity-85 shrink-0">
              {activeThemeObj.flag} · {soundEnabled ? `${soundVolume}%` : 'Muted'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
