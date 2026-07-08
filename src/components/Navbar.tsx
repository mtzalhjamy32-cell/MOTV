import React from 'react';
import { AppTab } from '../types';
import { PlaySquare, History, Settings, Plus, Smartphone, Radio } from 'lucide-react';

interface NavbarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, onOpenAddModal }) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <PlaySquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                  OmniPlayer
                </span>
                <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1 font-mono">
                  <Smartphone className="w-3 h-3" /> Android Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">مشغل الفيديو والبث الحي الشامل (TS, M3U8, MP4)</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => onTabChange('player')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'player'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              الـمشـغـل
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'history'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              السجل
            </button>
            <button
              onClick={() => onTabChange('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'settings'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              الإعدادات
            </button>
          </nav>

          {/* Action Button: Add Link / Open Stream */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إدخال رابط قناة جديد</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden bg-slate-950 border-t border-slate-800 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => onTabChange('player')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs ${
            currentTab === 'player' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span>المشغل</span>
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs ${
            currentTab === 'history' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-5 h-5" />
          <span>السجل</span>
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs ${
            currentTab === 'settings' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>الإعدادات</span>
        </button>
      </div>
    </header>
  );
};

