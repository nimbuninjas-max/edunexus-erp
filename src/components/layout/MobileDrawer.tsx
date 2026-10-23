import React, { useState } from 'react';
import { NavItem, RoleType, SoundProfile, ThemeMode } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';
import { AUDIO_SOUND_PACKS, WORLD_THEMES } from './Sidebar';

interface MobileDrawerProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  activeRole: RoleType;
  currentNavList: NavItem[];
  currentActiveTab: string;
  handleSelectNavTab: (tabId: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  soundVolume: number;
  setSoundVolume: (val: number) => void;
  soundProfile?: SoundProfile;
  setSoundProfile?: (profile: SoundProfile) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  playUISound?: (type?: string) => void;
  onOpenTour?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  activeRole,
  currentNavList,
  currentActiveTab,
  handleSelectNavTab,
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

  if (!mobileMenuOpen) return null;

  const activeThemeObj = WORLD_THEMES.find(t => t.id === theme) || WORLD_THEMES[0];
  const roleLabel = activeRole === 'student' ? 'Student' : activeRole === 'teacher' ? 'Teacher' : 'Admin';

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      <div
        className="fixed inset-0 bg-[#13221F]/60 backdrop-blur-xs"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className="relative w-76 max-w-[86vw] bg-[#072E29] text-[#F5F0E6] h-full flex flex-col justify-between p-4 z-10 shadow-2xl">
        <div className="space-y-3 overflow-y-auto sidebar-modern-scroll flex-1 min-h-0">
          <div className="flex items-center justify-between border-b border-[#164841] pb-3">
            <div>
              <span className="font-semibold text-sm text-[#F5F0E6] tracking-tight">
                EduNexus ERP
              </span>
              <p className="text-[10px] text-[#8AB0A9] uppercase tracking-widest mt-0.5">
                {roleLabel} Workspace
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-[#8AB0A9] hover:text-white bg-[#0D3D36]"
            >
              <StreamlineIcon name="close" className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {currentNavList.map(item => {
              const isActive = currentActiveTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectNavTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#F5F0E6] text-[#072E29] font-semibold'
                      : 'text-[#B5CFCB] hover:bg-[#0D3D36] hover:text-[#F5F0E6]'
                  }`}
                >
                  <StreamlineIcon name={item.icon} className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Settings Button & 10-Theme + 6-Audio Panel */}
        <div className="pt-3 border-t border-[#164841] space-y-2.5 shrink-0">
          {settingsOpen && (
            <div className="p-3 rounded-xl bg-[#041E1A] border border-[#1E5B50] space-y-3 text-xs max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300">Audio Effects</span>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold ${
                    soundEnabled ? 'bg-emerald-500 text-[#041E1A]' : 'bg-[#0D3D36] text-[#8AB0A9]'
                  }`}
                >
                  {soundEnabled ? 'ON' : 'MUTED'}
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#9CC5BE]">Volume</span>
                  <span className="text-amber-300 font-bold">
                    {soundEnabled ? `${soundVolume}%` : '0%'}
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
                    setSoundEnabled(val > 0);
                  }}
                  className="w-full accent-emerald-400"
                />
              </div>

              {setSoundProfile && (
                <div className="pt-2 border-t border-[#164841] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
                    Audio Sound Version (6)
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {AUDIO_SOUND_PACKS.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSoundProfile(p.id);
                          if (!soundEnabled) setSoundEnabled(true);
                          playUISound?.('role');
                        }}
                        className={`p-1.5 rounded-lg border text-left text-[10.5px] font-semibold truncate ${
                          soundProfile === p.id
                            ? 'bg-emerald-500/20 border-emerald-400 text-white'
                            : 'bg-[#072E29] border-[#164841] text-[#B5CFCB]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-[#164841] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold block">
                  10 World &amp; Cultural Themes
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {WORLD_THEMES.map(tObj => (
                    <button
                      key={tObj.id}
                      type="button"
                      onClick={() => {
                        playUISound?.('tab');
                        setTheme(tObj.id);
                      }}
                      className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 ${
                        theme === tObj.id
                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                          : 'bg-[#072E29] text-[#E2ECE9] border-[#184D44]'
                      }`}
                    >
                      <span>{tObj.flag}</span>
                      <span className="text-[10.5px] truncate">{tObj.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {onOpenTour && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                playUISound?.('click');
                onOpenTour();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#0A4D44] hover:bg-[#0D5B50] text-white text-xs font-bold border border-[#175C51] shadow-2xs mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span>Take Guided Tour</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                Guide
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#0D3D36] text-[#F5F0E6] text-xs font-medium cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <StreamlineIcon name="settings" className="w-4 h-4" />
              <span>Themes &amp; Audio Settings</span>
            </div>
            <span className="text-[10px] font-mono text-[#9CC5BE]">
              {activeThemeObj.flag} · {soundEnabled ? `${soundVolume}%` : 'Muted'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
