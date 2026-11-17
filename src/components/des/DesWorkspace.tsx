/**
 * DesWorkspace — Master coordinator for the DES visualization.
 * Faithfully follows the 5 steps and key generation features from the specification images,
 * structured with the synchronized Execution Flowchart and visual workspace matching Bubble Sort.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  des_encrypt,
  extract_des_rounds,
  extract_round_summary_table,
} from '../../algorithms/cryptography/des';
import { mapDesStepToFlowchart } from '../../explanations/des';
import { PlaybackControls } from '../common/PlaybackControls';
import { DesInputSection, NIST_PLAINTEXT, NIST_KEY } from './DesInputSection';
import { DesFlowchartVisualizer } from './DesFlowchartVisualizer';
import { DesVisualWorkspace } from './DesVisualWorkspace';
import { DesStepInsightCard } from './DesStepInsightCard';
import { DesKeyGenerationAndFeatures } from './DesKeyGenerationAndFeatures';
import { RoundSummaryTable } from './RoundSummaryTable';
import { Table, ChevronDown, ChevronUp } from 'lucide-react';

export const DesWorkspace: React.FC = () => {
  const [plaintext, setPlaintext] = useState(NIST_PLAINTEXT);
  const [cipherKey, setCipherKey] = useState(NIST_KEY);

  const [result, setResult] = useState(() => des_encrypt(NIST_PLAINTEXT, NIST_KEY));

  // Round & View navigation
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [showSummaryTable, setShowSummaryTable] = useState<boolean>(false);

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(650);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const rounds = extract_des_rounds(result.steps);
  const roundSummaries = extract_round_summary_table(result.steps);

  const currentStep = result.steps[currentStepIndex] || result.steps[0];
  const isAtEnd = currentStepIndex >= result.steps.length - 1;

  // Pedagogical Flowchart Info for current step
  const flowchartStageInfo = mapDesStepToFlowchart(
    currentStep,
    result.steps.length,
    isAtEnd
  );

  // Re-run encryption
  const handleEncrypt = (pt: string, k: string) => {
    try {
      const newResult = des_encrypt(pt, k);
      setPlaintext(pt);
      setCipherKey(k);
      setResult(newResult);
      setCurrentStepIndex(0);
      setSelectedRound(1);
      setIsPlaying(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadNistVector = () => handleEncrypt(NIST_PLAINTEXT, NIST_KEY);

  // Sync playback step with selected round
  useEffect(() => {
    if (currentStep?.round_number) {
      setSelectedRound(currentStep.round_number);
    }
  }, [currentStepIndex, currentStep]);

  // Jump to specific round
  const handleSelectRound = (roundNum: number) => {
    setSelectedRound(roundNum);
    const stepIdx = result.steps.findIndex(
      (s) => s.round_number === roundNum && s.stage === 'round_start'
    );
    if (stepIdx !== -1) {
      setIsPlaying(false);
      setCurrentStepIndex(stepIdx);
    }
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < result.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speedMs);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, result.steps.length, speedMs]);

  return (
    <div className="space-y-6">
      {/* 1. Top Banner & Configuration Bar (modeled after Bubble Sort) */}
      <DesInputSection
        plaintext={plaintext}
        cipherKey={cipherKey}
        ciphertext={result.ciphertext_hex}
        onEncrypt={handleEncrypt}
        onLoadNistVector={handleLoadNistVector}
      />

      {/* 2. Playback Controller (Shared reusable common component) */}
      <PlaybackControls
        currentStep={currentStepIndex}
        totalSteps={result.steps.length}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => setCurrentStepIndex((p) => Math.min(result.steps.length - 1, p + 1))}
        onPrev={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStepIndex(0);
          setSelectedRound(1);
        }}
        onSeek={(step) => {
          setIsPlaying(false);
          setCurrentStepIndex(step);
        }}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
      />

      {/* 3. Two-Column Main Workspace (modeled after Bubble Sort) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (~42%): Synchronized 5-Step Execution Flowchart */}
        <div className="lg:col-span-5 h-full">
          <DesFlowchartVisualizer
            stageInfo={flowchartStageInfo}
            plaintextHex={plaintext}
            keyHex={cipherKey}
            ciphertextHex={result.ciphertext_hex}
            currentRound={selectedRound}
            isAtEnd={isAtEnd}
          />
        </div>

        {/* Right Column (~58%): Visual Stage Workspace + Step Insight Card */}
        <div className="lg:col-span-7 space-y-6">
          <DesVisualWorkspace
            currentStep={currentStep}
            stageInfo={flowchartStageInfo}
            rounds={rounds}
            summaries={roundSummaries}
            selectedRound={selectedRound}
            onSelectRound={handleSelectRound}
            plaintextHex={plaintext}
            ciphertextHex={result.ciphertext_hex}
            isAtEnd={isAtEnd}
          />

          <DesStepInsightCard stageInfo={flowchartStageInfo} />
        </div>
      </div>

      {/* 4. Key Generation & Knowledge Cards (from Images 1 & 2) */}
      <DesKeyGenerationAndFeatures
        cipherKeyHex={cipherKey}
        selectedRound={selectedRound}
        onSelectRound={handleSelectRound}
      />

      {/* 5. 16-Round Reference Summary Table (Collapsible) */}
      <div className="algovi-card bg-slate-900 border border-slate-800 p-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowSummaryTable(!showSummaryTable)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition"
        >
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-purple-400" />
            <span>16-Round Summary Matrix (L, R, Round Key K, and f() for all 16 rounds)</span>
          </div>
          {showSummaryTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSummaryTable && (
          <div className="pt-2 border-t border-slate-800/80">
            <RoundSummaryTable
              summaries={roundSummaries}
              activeRound={selectedRound}
              onSelectRound={(r) => handleSelectRound(r)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
