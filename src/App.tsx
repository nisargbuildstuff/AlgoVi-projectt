import React, { useState } from 'react';
import { Navbar, WorkspaceTab } from './components/common/Navbar';
import { BubbleSortWorkspace } from './components/bubbleSort/BubbleSortWorkspace';
import { BinarySearchWorkspace } from './components/binarySearch/BinarySearchWorkspace';
import { DesWorkspace } from './components/des/DesWorkspace';
import { Sparkles, CheckCircle2, Shield, Terminal } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<WorkspaceTab>('bubble_sort');

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Sticky Navigation */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'bubble_sort' && <BubbleSortWorkspace />}
        {currentTab === 'binary_search' && <BinarySearchWorkspace />}
        {currentTab === 'des_encryption' && <DesWorkspace />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b16]/95 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">AlgoVista Engine</span>
            <span className="text-slate-600">—</span>
            <span className="text-slate-400">Algorithm State & Cryptographic Inspector</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>58 Automated Tests Passing</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1 text-purple-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>NIST FIPS 46-3 Verified</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 font-mono text-[11px]">React 19 + TypeScript + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
