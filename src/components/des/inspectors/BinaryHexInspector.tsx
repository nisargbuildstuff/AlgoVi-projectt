import React, { useState } from 'react';
import { format_bits_spaced, binary_to_hex } from '../../../algorithms/cryptography/desUtils';
import { Binary, Eye, Sparkles, Hash } from 'lucide-react';

interface BinaryHexInspectorProps {
  label: string;
  bits: string;
  hex?: string;
  defaultGroupSize?: 4 | 6 | 8;
  highlightedIndices?: number[];
  description?: string;
}

export const BinaryHexInspector: React.FC<BinaryHexInspectorProps> = ({
  label,
  bits,
  hex,
  defaultGroupSize = 4,
  highlightedIndices = [],
  description
}) => {
  const [groupSize, setGroupSize] = useState<number>(defaultGroupSize);
  const [hoveredChunkIndex, setHoveredChunkIndex] = useState<number | null>(null);

  const computedHex = hex || (bits.length % 4 === 0 ? binary_to_hex(bits) : '');

  // Split bits into chunks based on groupSize
  const chunks: { chunk: string; startIdx: number; endIdx: number }[] = [];
  for (let i = 0; i < bits.length; i += groupSize) {
    chunks.push({
      chunk: bits.slice(i, i + groupSize),
      startIdx: i,
      endIdx: Math.min(bits.length, i + groupSize)
    });
  }

  return (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-slate-200 font-sans text-xs">{label}</span>
          <span className="text-[10px] text-slate-400 font-mono">({bits.length} bits)</span>
        </div>

        {/* Grouping toggles */}
        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-slate-400 mr-1 font-sans">Group by:</span>
          <button
            type="button"
            onClick={() => setGroupSize(4)}
            className={`px-2 py-0.5 rounded transition ${
              groupSize === 4
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            4-Bit Nibbles
          </button>
          <button
            type="button"
            onClick={() => setGroupSize(6)}
            className={`px-2 py-0.5 rounded transition ${
              groupSize === 6
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            6-Bit S-Boxes
          </button>
          <button
            type="button"
            onClick={() => setGroupSize(8)}
            className={`px-2 py-0.5 rounded transition ${
              groupSize === 8
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            8-Bit Bytes
          </button>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-slate-400 font-sans leading-normal">
          {description}
        </p>
      )}

      {/* Hex display */}
      {computedHex && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-sans text-[11px]">Hexadecimal:</span>
          <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 tracking-wider">
            {computedHex}
          </span>
        </div>
      )}

      {/* Interactive bit chunks */}
      <div className="space-y-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
          Binary Stream (Hover any group to inspect values):
        </span>
        <div className="flex flex-wrap gap-1.5 select-none">
          {chunks.map((ch, idx) => {
            const isHovered = hoveredChunkIndex === idx;
            const chunkVal = parseInt(ch.chunk, 2);
            const chunkHex = ch.chunk.length === 4 ? chunkVal.toString(16).toUpperCase() : '';

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredChunkIndex(idx)}
                onMouseLeave={() => setHoveredChunkIndex(null)}
                className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 scale-105 shadow-md shadow-sky-500/30 ring-1 ring-sky-400'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[9px] text-slate-400">
                  [{ch.startIdx + 1}–{ch.endIdx}]
                </div>
                <div className="font-bold tracking-wider text-xs">{ch.chunk}</div>
                <div className="text-[9px] mt-0.5 text-amber-400 font-sans">
                  {chunkHex ? `Hex: ${chunkHex}` : `Val: ${chunkVal}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
