import React, { useState } from 'react';
import { Layers, Moon, Search, ShieldCheck, Sparkles, Sun, Terminal } from 'lucide-react';

export type WorkspaceTab = 'bubble_sort' | 'binary_search' | 'des_encryption';

interface NavbarProps {
  currentTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('algovi-theme', nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface-card)]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 text-[var(--text-on-accent)] font-bold border border-cyan-300/40">
            <Sparkles className="w-5 h-5 text-[var(--text-on-accent)] fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)] flex items-center gap-1">
                Algo<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">Vi</span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                PRO ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Algorithmic State & Cryptographic Inspector</p>
          </div>
        </div>

        {/* High-Contrast Interactive Navigation Tabs */}
        <nav className="flex items-center p-1 bg-[var(--surface-raised)] rounded-xl border border-slate-800 shadow-inner">
          {/* Bubble Sort Tab */}
          <button
            type="button"
            onClick={() => onTabChange('bubble_sort')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentTab === 'bubble_sort'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-[var(--text-on-accent)] shadow-lg shadow-sky-500/30 ring-1 ring-sky-300/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bubble Sort</span>
          </button>

          {/* Binary Search Tab */}
          <button
            type="button"
            onClick={() => onTabChange('binary_search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentTab === 'binary_search'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-[var(--text-on-accent)] shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-300/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Binary Search</span>
          </button>

          {/* DES Encryption Tab */}
          <button
            type="button"
            onClick={() => onTabChange('des_encryption')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentTab === 'des_encryption'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-[var(--text-on-accent)] shadow-lg shadow-purple-500/30 ring-1 ring-purple-300/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DES Encryption</span>
          </button>
        </nav>

        {/* Engine Status Badge */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-raised)] border border-slate-800 text-xs text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] text-slate-300">Interactive Visualizer</span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
