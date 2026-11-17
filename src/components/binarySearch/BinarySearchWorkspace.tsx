import React, { useState, useEffect, useRef } from 'react';
import { binary_search } from '../../algorithms/searching/binarySearch';
import { PlaybackControls } from '../common/PlaybackControls';
import { SearchArrayVisualizer } from './SearchArrayVisualizer';
import { PointerCards } from './PointerCards';
import { FormulaInsightCard } from './FormulaInsightCard';
import { BinarySearchFlowchart } from './BinarySearchFlowchart';
import { Search, RefreshCw, Clock, HardDrive, CheckCircle, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESETS: { [key: string]: { arr: number[]; target: number } } = {
  middle: { arr: [10, 20, 30, 40, 50, 60, 70], target: 40 },
  left: { arr: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 5 },
  right: { arr: [3, 9, 14, 18, 25, 31, 42, 59, 68, 88], target: 68 },
  missing: { arr: [10, 20, 30, 40, 50, 60], target: 35 }
};

export const BinarySearchWorkspace: React.FC = () => {
  const [arrayInput, setArrayInput] = useState('10, 20, 30, 40, 50, 60, 70');
  const [targetInput, setTargetInput] = useState('40');
  const [currentArray, setCurrentArray] = useState<number[]>([10, 20, 30, 40, 50, 60, 70]);
  const [currentTarget, setCurrentTarget] = useState<number>(40);

  const [searchResult, setSearchResult] = useState(binary_search([10, 20, 30, 40, 50, 60, 70], 40));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(700);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleRunSearch = (arr: number[], target: number) => {
    // Ensure array is sorted for binary search
    const sorted = [...arr].sort((a, b) => a - b);
    setCurrentArray(sorted);
    setCurrentTarget(target);
    const result = binary_search(sorted, target);
    setSearchResult(result);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handlePreset = (key: string) => {
    const p = PRESETS[key];
    setArrayInput(p.arr.join(', '));
    setTargetInput(p.target.toString());
    handleRunSearch(p.arr, p.target);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedArr = arrayInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    const parsedTarget = parseInt(targetInput.trim(), 10);

    if (parsedArr.length > 0 && !isNaN(parsedTarget)) {
      handleRunSearch(parsedArr, parsedTarget);
    }
  };

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < searchResult.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          if (searchResult.found_index !== -1) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
        }
      }, speedMs);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, searchResult, speedMs]);

  const currentStep = searchResult.steps[currentStepIndex] || searchResult.steps[0];

  return (
    <div className="space-y-6">
      {/* Top Controls & Complexity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 algovi-card bg-slate-900 border border-slate-800 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Binary Search Setup
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 mr-1">Presets:</span>
              <button
                onClick={() => handlePreset('middle')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Target at Middle
              </button>
              <button
                onClick={() => handlePreset('left')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Target at Left
              </button>
              <button
                onClick={() => handlePreset('right')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Target at Right
              </button>
              <button
                onClick={() => handlePreset('missing')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Target Missing
              </button>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-8">
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="Sorted array: 10, 20, 30, 40"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="Target"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full h-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[var(--text-on-accent)] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Complexity Card (Section 6.2) */}
        <div className="algovi-card bg-slate-900 border border-slate-800 p-4 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Complexity & Prerequisites
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Time</p>
                <p className="font-mono font-bold text-emerald-300">O(log n)</p>
              </div>
            </div>
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Space</p>
                <p className="font-mono font-bold text-sky-300">O(1)</p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
            <span>Strict Prerequisite: Input array must be sorted.</span>
          </p>
        </div>
      </div>

      {/* Playback Controls */}
      <PlaybackControls
        currentStep={currentStepIndex}
        totalSteps={searchResult.steps.length}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => setCurrentStepIndex((prev) => Math.min(searchResult.steps.length - 1, prev + 1))}
        onPrev={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStepIndex(0);
        }}
        onSeek={(step) => {
          setIsPlaying(false);
          setCurrentStepIndex(step);
        }}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
      />

      {/* Two-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (~42%): Synchronized Execution Flowchart */}
        <div className="lg:col-span-5 h-full">
          <BinarySearchFlowchart step={currentStep} totalSteps={searchResult.steps.length} />
        </div>

        {/* Right Column (~58%): Pointer Cards + Search Space Visualizer + Pedagogical Formula Card */}
        <div className="lg:col-span-7 space-y-6">
          <PointerCards step={currentStep} />

          {/* Array Search Visualizer Card */}
          <div className="algovi-card bg-[var(--surface-card)] border border-slate-800/80 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-100">Search Space Visualization</h3>
                <p className="text-xs text-slate-400">
                  Step {currentStepIndex + 1}: {currentStep.description}
                </p>
              </div>
              {searchResult.found_index !== -1 && currentStep.action === 'match' && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span>Target Matched at Index {searchResult.found_index}!</span>
                </div>
              )}
            </div>

            <SearchArrayVisualizer step={currentStep} />
          </div>

          {/* Pedagogical Step Formula Card */}
          <FormulaInsightCard step={currentStep} totalSteps={searchResult.steps.length} />
        </div>
      </div>
    </div>
  );
};
