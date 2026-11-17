/**
 * DesRoundFlowDiagram — The central Feistel network SVG diagram.
 * Large, interactive, updates in real time per selected round.
 * Shows: L(i-1), R(i-1), f() box (clickable), Ki, XOR circle, L(i), R(i)
 * with clearly labelled arrows.
 */
import React from 'react';

interface DesRoundFlowDiagramProps {
  round: number;
  prevLHex: string;
  prevRHex: string;
  subkeyHex: string;
  fOutputHex: string;
  nextLHex: string;
  nextRHex: string;
  activeOp?: 'expansion' | 'xor' | 'sbox' | 'pbox' | null;
  onClickRoundFunction: () => void;
}

const W = 700;
const H = 500;

// Coordinates
const LEFT_X = 90;
const RIGHT_X = 490;
const IN_Y = 40;
const OUT_Y = 420;
const FBOX_X = 320;
const FBOX_Y = 150;
const FBOX_W = 190;
const FBOX_H = 110;
const XOR_X = LEFT_X + 50;
const XOR_Y = 290;
const XOR_R = 20;
const KEY_X = 540;
const KEY_Y = 170;

export const DesRoundFlowDiagram: React.FC<DesRoundFlowDiagramProps> = ({
  round,
  prevLHex,
  prevRHex,
  subkeyHex,
  fOutputHex,
  nextLHex,
  nextRHex,
  activeOp,
  onClickRoundFunction,
}) => {
  const isRound16 = round === 16;

  // Which part of f() is highlighted
  const fHighlight = activeOp
    ? { expansion: '#38bdf8', xor: '#fbbf24', sbox: '#c084fc', pbox: '#34d399' }[activeOp]
    : '#a855f7';

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[700px] mx-auto h-auto select-none"
        style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
      >
        <defs>
          {/* Arrow markers */}
          {[
            { id: 'arr-slate', color: '#64748b' },
            { id: 'arr-sky', color: '#38bdf8' },
            { id: 'arr-purple', color: '#c084fc' },
            { id: 'arr-emerald', color: '#34d399' },
            { id: 'arr-rose', color: '#fb7185' },
            { id: 'arr-amber', color: '#fbbf24' },
          ].map(({ id, color }) => (
            <marker
              key={id}
              id={id}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={color} />
            </marker>
          ))}

          {/* Glow filters */}
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── LEFT INPUT REGISTER ── */}
        <rect x={LEFT_X - 10} y={IN_Y} width={160} height={56} rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
        <text x={LEFT_X + 70} y={IN_Y + 18} textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
          Left Register L{round - 1}
        </text>
        <text x={LEFT_X + 70} y={IN_Y + 36} textAnchor="middle" fill="#f1f5f9" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          {prevLHex || '—'}
        </text>
        <text x={LEFT_X + 70} y={IN_Y + 51} textAnchor="middle" fill="#475569" fontSize="8">
          32 bits
        </text>

        {/* ── RIGHT INPUT REGISTER ── */}
        <rect x={RIGHT_X - 10} y={IN_Y} width={160} height={56} rx="10" fill="#0f172a" stroke="#34d399" strokeWidth="1.8" />
        <text x={RIGHT_X + 70} y={IN_Y + 18} textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
          Right Register R{round - 1}
        </text>
        <text x={RIGHT_X + 70} y={IN_Y + 36} textAnchor="middle" fill="#f1f5f9" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          {prevRHex || '—'}
        </text>
        <text x={RIGHT_X + 70} y={IN_Y + 51} textAnchor="middle" fill="#475569" fontSize="8">
          32 bits
        </text>

        {/* ── LEFT: Straight down to XOR ── */}
        <line x1={LEFT_X + 70} y1={IN_Y + 56} x2={LEFT_X + 70} y2={XOR_Y - XOR_R}
          stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#arr-sky)" strokeDasharray="4 2" />
        <text x={LEFT_X + 75} y={(IN_Y + 56 + XOR_Y) / 2} fill="#475569" fontSize="8" dominantBaseline="middle">
          passes through
        </text>

        {/* ── RIGHT: Down into f() box ── */}
        <line x1={RIGHT_X + 70} y1={IN_Y + 56} x2={RIGHT_X + 70} y2={FBOX_Y + 15}
          stroke="#34d399" strokeWidth="1.5" markerEnd="url(#arr-emerald)" />

        {/* ── SUBKEY ── */}
        <rect x={KEY_X} y={KEY_Y} width={130} height={44} rx="8" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
        <text x={KEY_X + 65} y={KEY_Y + 15} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
          Subkey K{round}  (48 bits)
        </text>
        <text x={KEY_X + 65} y={KEY_Y + 32} textAnchor="middle" fill="#fef3c7" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          {subkeyHex || '—'}
        </text>
        {/* Key arrow into f() */}
        <line x1={KEY_X} y1={KEY_Y + 22} x2={FBOX_X + FBOX_W} y2={FBOX_Y + FBOX_H / 2}
          stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arr-amber)" />

        {/* ── ROUND FUNCTION f() — CLICKABLE ── */}
        <g onClick={onClickRoundFunction} className="cursor-pointer" style={{ filter: 'none' }}>
          {/* Outer glow on hover handled via CSS — here just the box */}
          <rect
            x={FBOX_X} y={FBOX_Y} width={FBOX_W} height={FBOX_H}
            rx="12"
            fill="#1e1b4b"
            stroke={fHighlight}
            strokeWidth="2.5"
          />
          <text x={FBOX_X + FBOX_W / 2} y={FBOX_Y + 24} textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">
            Round Function
          </text>
          <text x={FBOX_X + FBOX_W / 2} y={FBOX_Y + 40} textAnchor="middle" fill="#c084fc" fontSize="9">
            f ( R{round - 1} , K{round} )
          </text>

          {/* 4-operation mini-pipeline inside f() */}
          {[
            { label: 'E', desc: '32→48b', x: FBOX_X + 18, active: activeOp === 'expansion', color: '#38bdf8' },
            { label: '⊕', desc: 'XOR Key', x: FBOX_X + 62, active: activeOp === 'xor', color: '#fbbf24' },
            { label: 'S', desc: '8 S-Boxes', x: FBOX_X + 106, active: activeOp === 'sbox', color: '#c084fc' },
            { label: 'P', desc: 'P-Box', x: FBOX_X + 150, active: activeOp === 'pbox', color: '#34d399' },
          ].map((op, i) => (
            <g key={op.label}>
              <rect
                x={op.x} y={FBOX_Y + 55}
                width={34} height={36}
                rx="6"
                fill={op.active ? `${op.color}22` : '#0f172a'}
                stroke={op.active ? op.color : '#334155'}
                strokeWidth={op.active ? 2 : 1}
              />
              <text x={op.x + 17} y={FBOX_Y + 72} textAnchor="middle" fill={op.active ? op.color : '#94a3b8'} fontSize="11" fontWeight="bold">
                {op.label}
              </text>
              <text x={op.x + 17} y={FBOX_Y + 85} textAnchor="middle" fill="#475569" fontSize="7">
                {op.desc}
              </text>
              {/* Arrow between ops */}
              {i < 3 && (
                <line x1={op.x + 34} y1={FBOX_Y + 73} x2={op.x + 40} y2={FBOX_Y + 73}
                  stroke="#334155" strokeWidth="1" markerEnd="url(#arr-slate)" />
              )}
            </g>
          ))}

          {/* f-output hex display */}
          <rect x={FBOX_X + 20} y={FBOX_Y + 100} width={FBOX_W - 40} height={20} rx="4" fill="#0a0a1a" stroke="#6d28d9" strokeWidth="1" />
          <text x={FBOX_X + FBOX_W / 2} y={FBOX_Y + 114} textAnchor="middle" fill="#f3e8ff" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
            {fOutputHex || '…'}
          </text>

          {/* Click hint */}
          <text x={FBOX_X + FBOX_W / 2} y={FBOX_Y + FBOX_H - 4} textAnchor="middle" fill="#7c3aed" fontSize="8">
            ↗ Click to inspect operations
          </text>
        </g>

        {/* ── f() OUTPUT ARROW → XOR ── */}
        <path
          d={`M ${FBOX_X} ${FBOX_Y + FBOX_H / 2} L ${XOR_X + XOR_R + 10} ${FBOX_Y + FBOX_H / 2} L ${XOR_X + XOR_R + 10} ${XOR_Y}`}
          fill="none" stroke="#c084fc" strokeWidth="2" markerEnd="url(#arr-purple)" />
        <text x={(FBOX_X + XOR_X) / 2 - 10} y={FBOX_Y + FBOX_H / 2 - 7} fill="#7c3aed" fontSize="8">
          f output (32b)
        </text>

        {/* ── XOR CIRCLE ── */}
        <circle cx={XOR_X} cy={XOR_Y} r={XOR_R} fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        <text x={XOR_X} y={XOR_Y + 7} textAnchor="middle" fill="#38bdf8" fontSize="20" fontWeight="bold">
          ⊕
        </text>
        <text x={XOR_X} y={XOR_Y + XOR_R + 12} textAnchor="middle" fill="#475569" fontSize="8">
          XOR
        </text>

        {/* ── ARROWS TO OUTPUT ── */}
        {!isRound16 ? (
          <>
            {/* R(i-1) crosses to become L(i) */}
            <path
              d={`M ${RIGHT_X + 70} ${IN_Y + 56} L ${RIGHT_X + 70} ${IN_Y + 80} L ${LEFT_X + 70 + 20} ${OUT_Y - 20} L ${LEFT_X + 70} ${OUT_Y}`}
              fill="none" stroke="#34d399" strokeWidth="2" markerEnd="url(#arr-emerald)" />
            <text x={350} y={280} fill="#34d399" fontSize="8" fontWeight="bold" transform="rotate(-38, 350, 280)">
              L{round} = R{round - 1}
            </text>

            {/* XOR output → becomes R(i) */}
            <path
              d={`M ${XOR_X} ${XOR_Y + XOR_R} L ${XOR_X} ${XOR_Y + 60} L ${RIGHT_X + 70} ${OUT_Y}`}
              fill="none" stroke="#fb7185" strokeWidth="2" markerEnd="url(#arr-rose)" />
            <text x={280} y={380} fill="#fb7185" fontSize="8" fontWeight="bold">
              R{round} = L{round - 1} ⊕ f
            </text>
          </>
        ) : (
          <>
            {/* Round 16: no swap, just pass through */}
            <line x1={XOR_X} y1={XOR_Y + XOR_R} x2={LEFT_X + 70} y2={OUT_Y}
              stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arr-sky)" />
            <line x1={RIGHT_X + 70} y1={IN_Y + 56} x2={RIGHT_X + 70} y2={OUT_Y}
              stroke="#34d399" strokeWidth="2" markerEnd="url(#arr-emerald)" />
            <rect x={230} y={310} width={200} height={28} rx="6" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
            <text x={330} y={328} textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold">
              ★ Round 16: Swap skipped!
            </text>
          </>
        )}

        {/* ── LEFT OUTPUT REGISTER ── */}
        <rect x={LEFT_X - 10} y={OUT_Y} width={160} height={56} rx="10" fill="#0f172a" stroke="#34d399" strokeWidth="1.8" />
        <text x={LEFT_X + 70} y={OUT_Y + 18} textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
          Left Out L{round}
        </text>
        <text x={LEFT_X + 70} y={OUT_Y + 36} textAnchor="middle" fill="#f1f5f9" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          {nextLHex || '—'}
        </text>
        <text x={LEFT_X + 70} y={OUT_Y + 51} textAnchor="middle" fill="#475569" fontSize="8">
          32 bits
        </text>

        {/* ── RIGHT OUTPUT REGISTER ── */}
        <rect x={RIGHT_X - 10} y={OUT_Y} width={160} height={56} rx="10" fill="#0f172a" stroke="#fb7185" strokeWidth="1.8" />
        <text x={RIGHT_X + 70} y={OUT_Y + 18} textAnchor="middle" fill="#fb7185" fontSize="10" fontWeight="bold">
          Right Out R{round}
        </text>
        <text x={RIGHT_X + 70} y={OUT_Y + 36} textAnchor="middle" fill="#f1f5f9" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          {nextRHex || '—'}
        </text>
        <text x={RIGHT_X + 70} y={OUT_Y + 51} textAnchor="middle" fill="#475569" fontSize="8">
          32 bits
        </text>
      </svg>
    </div>
  );
};
