import React, { useState, useEffect, useRef } from 'react';
import { bubble_sort_steps } from '../../algorithms/sorting/bubbleSort';
import { mapBubbleSortStepToFlowchart } from '../../explanations/bubbleSort';
import { PlaybackControls } from '../common/PlaybackControls';
import { FlowchartVisualizer } from './FlowchartVisualizer';
import { ArrayBarChart } from './ArrayBarChart';
import { ArrayCardView } from './ArrayCardView';
import { StepInsightCard } from './StepInsightCard';
import { BarChart3, CreditCard, Sparkles, RefreshCw, Clock, HardDrive, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESETS: { [key: string]: number[] } = {
  unsorted: [5, 2, 8, 1, 9, 3, 7],
  reverse: [9, 8, 7, 6, 5, 4, 3, 2, 1],
  sorted: [1, 2, 3, 4, 5, 6, 7, 8],
  random: [14, 3, 27, 8, 19, 5, 33, 12]
};

export const BubbleSortWorkspace: React.FC = () => {
  const [inputArrayText, setInputArrayText] = useState('5, 2, 8, 1, 9, 3, 7');
  const [currentArray, setCurrentArray] = useState<number[]>([5, 2, 8, 1, 9, 3, 7]);
  const [steps, setSteps] = useState(bubble_sort_steps([5, 2, 8, 1, 9, 3, 7]));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(600);
  const [viewMode, setViewMode] = useState<'bars' | 'cards'>('bars');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Re-generate steps on array change
  const handleGenerate = (arr: number[]) => {
    setCurrentArray(arr);
    const newSteps = bubble_sort_steps(arr);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handlePresetSelect = (presetKey: string) => {
    const arr = PRESETS[presetKey];
    setInputArrayText(arr.join(', '));
    handleGenerate(arr);
  };

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inputArrayText
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length > 0) {
      handleGenerate(parsed);
    }
  };

  // Animation player loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        }
      }, speedMs);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speedMs]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const stageInfo = mapBubbleSortStepToFlowchart(currentStep, steps.length, currentArray.length);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input & Presets Controls */}
        <div className="lg:col-span-2 algovi-card bg-slate-900 border border-slate-800 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Array Configuration
            </span>
            {/* Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 mr-1">Presets:</span>
              <button
                onClick={() => handlePresetSelect('unsorted')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Unsorted
              </button>
              <button
                onClick={() => handlePresetSelect('reverse')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Reverse Sorted
              </button>
              <button
                onClick={() => handlePresetSelect('sorted')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Already Sorted
              </button>
            </div>
          </div>

          <form onSubmit={handleCustomInputSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputArrayText}
              onChange={(e) => setInputArrayText(e.target.value)}
              placeholder="e.g. 5, 2, 8, 1, 9, 3"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-600/20 active:scale-95 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate</span>
            </button>
          </form>
        </div>

        {/* Complexity Card (Section 6.1) */}
        <div className="algovi-card bg-slate-900 border border-slate-800 p-4 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Complexity & Properties
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Time</p>
                <p className="font-mono font-bold text-amber-300">O(n²)</p>
              </div>
            </div>
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Space</p>
                <p className="font-mono font-bold text-emerald-300">O(1)</p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Stable sorting algorithm with <strong>O(n)</strong> best-case early break when no inversions exist.
          </p>
        </div>
      </div>

      {/* Playback Controller */}
      <PlaybackControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
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
        {/* Left Column (~40%): Synchronized Execution Flowchart */}
        <div className="lg:col-span-5 h-full">
          <FlowchartVisualizer stageInfo={stageInfo} />
        </div>

        {/* Right Column (~60%): Array Workspace + Pedagogical Step Insight */}
        <div className="lg:col-span-7 space-y-6">
          {/* Array Canvas Card */}
          <div className="algovi-card bg-slate-900 border border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-200">Array Workspace</h3>
                <p className="text-xs text-slate-400">
                  Step {currentStepIndex + 1}: {currentStep.description}
                </p>
              </div>

              {/* View Switcher: Bars vs Value Cards */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setViewMode('bars')}
                  className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition ${
                    viewMode === 'bars'
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Plotly Bar Chart View"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Bars</span>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition ${
                    viewMode === 'cards'
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Value Card Pills View"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
              </div>
            </div>

            {/* Canvas */}
            {viewMode === 'bars' ? (
              <ArrayBarChart step={currentStep} initialArray={currentArray} />
            ) : (
              <ArrayCardView step={currentStep} />
            )}
          </div>

          {/* Pedagogical Step Insight Card */}
          <StepInsightCard stageInfo={stageInfo} step={currentStep} />
        </div>
      </div>
    </div>
  );
};
