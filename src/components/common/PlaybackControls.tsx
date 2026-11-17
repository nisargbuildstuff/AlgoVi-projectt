import React, { useEffect } from 'react';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Gauge
} from 'lucide-react';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSeek: (step: number) => void;
  speedMs: number;
  onSpeedChange: (speedMs: number) => void;
  accentColor?: string;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  onSeek,
  speedMs,
  onSpeedChange,
}) => {
  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        onPlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        onReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause, onNext, onPrev, onReset]);

  const maxStep = Math.max(0, totalSteps - 1);
  const progressPercent = totalSteps > 1 ? (currentStep / maxStep) * 100 : 0;

  return (
    <div className="algovi-card bg-[var(--surface-card)] border border-slate-800/80 p-4 space-y-4 shadow-xl">
      {/* Top row: controls, step counter, speed */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            title="Reset to Step 1 (Key R)"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 active:scale-95 transition shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={onPrev}
            disabled={currentStep <= 0}
            title="Previous Step (Left Arrow)"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 disabled:opacity-30 disabled:hover:border-slate-800 disabled:cursor-not-allowed active:scale-95 transition shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play/Pause Button with vivid high-contrast accents */}
          <button
            type="button"
            onClick={onPlayPause}
            title={isPlaying ? 'Pause (Space)' : 'Play Animation (Space)'}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-[var(--text-on-highlight)] shadow-amber-400/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-[var(--text-on-accent)] shadow-cyan-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={onNext}
            disabled={currentStep >= maxStep}
            title="Next Step (Right Arrow)"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 disabled:opacity-30 disabled:hover:border-slate-800 disabled:cursor-not-allowed active:scale-95 transition shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 font-sans">Step:</span>
          <span className="font-bold text-cyan-400 text-sm">{currentStep + 1}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium">{totalSteps}</span>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200 whitespace-nowrap">
            {(speedMs / 1000).toFixed(1)}s
          </span>
          <input
            type="range"
            min="200"
            max="1600"
            step="100"
            value={speedMs}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            title="Animation delay per step"
          />
        </div>
      </div>

      {/* Scrubber & Progress Bar */}
      <div className="space-y-1.5">
        <div className="relative w-full h-3 flex items-center">
          <input
            type="range"
            min="0"
            max={maxStep}
            value={currentStep}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 z-10 opacity-90 hover:opacity-100"
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
          <span>Start (Step 1)</span>
          <span className="text-cyan-400 font-bold">{Math.round(progressPercent)}% Complete</span>
          <span>Finish (Step {totalSteps})</span>
        </div>
      </div>
    </div>
  );
};
