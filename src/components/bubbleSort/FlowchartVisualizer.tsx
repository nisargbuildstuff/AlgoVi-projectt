import React from 'react';
import { FlowchartStageInfo } from '../../types/steps';
import { FLOWCHART_NODES } from '../../explanations/bubbleSort';

interface FlowchartVisualizerProps {
  stageInfo: FlowchartStageInfo;
}

export const FlowchartVisualizer: React.FC<FlowchartVisualizerProps> = ({ stageInfo }) => {
  const { active_nodes, decision_branch, stage_id } = stageInfo;

  const isNodeActive = (id: string) => active_nodes.includes(id);

  // SVG Flowchart Node definitions with layout coordinates
  const nodes = [
    { id: 'start', label: 'Start', shape: 'oval', x: 140, y: 35, w: 90, h: 32 },
    { id: 'init_outer', label: 'i = 0 (Init Outer)', shape: 'rect', x: 140, y: 85, w: 140, h: 34 },
    { id: 'check_outer', label: 'i < n - 1 ?', shape: 'diamond', x: 140, y: 155, w: 120, h: 48 },
    { id: 'init_inner', label: 'j = 0 (Init Inner)', shape: 'rect', x: 140, y: 235, w: 140, h: 34 },
    { id: 'check_inner', label: 'j < n - i - 1 ?', shape: 'diamond', x: 140, y: 305, w: 130, h: 48 },
    { id: 'compare_elements', label: 'Compare arr[j], arr[j+1]', shape: 'rect', x: 140, y: 385, w: 165, h: 36 },
    { id: 'decision_swap', label: 'arr[j] > arr[j+1] ?', shape: 'diamond', x: 140, y: 465, w: 145, h: 52 },
    { id: 'do_swap', label: 'Swap Elements', shape: 'rect', x: 50, y: 555, w: 110, h: 34 },
    { id: 'advance_inner', label: 'j = j + 1', shape: 'rect', x: 140, y: 625, w: 100, h: 34 },
    { id: 'pass_done', label: 'Pass Complete (Lock Item)', shape: 'rect', x: 260, y: 305, w: 110, h: 42 },
    { id: 'all_sorted', label: 'Sorted Array!', shape: 'rect', x: 260, y: 155, w: 105, h: 36 },
    { id: 'end', label: 'End', shape: 'oval', x: 260, y: 75, w: 80, h: 32 }
  ];

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div>
          <h3 className="font-bold text-sm text-slate-200">Execution Flowchart</h3>
          <p className="text-xs text-slate-400">12 Synchronized DOT Stage Automaton</p>
        </div>
        <div className="flex items-center gap-2">
          {decision_branch && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                decision_branch === 'yes'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              Branch: {decision_branch.toUpperCase()}
            </span>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Node: {stage_id}
          </span>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto flex items-center justify-center min-h-[520px]">
        <svg
          viewBox="0 0 340 680"
          className="w-full max-w-[340px] h-auto select-none font-sans"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--text-muted)" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--highlight)" />
            </marker>
            <marker
              id="arrow-yes"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--success)" />
            </marker>
            <marker
              id="arrow-no"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--danger)" />
            </marker>
          </defs>

          {/* Connection Arrows */}
          {/* Start -> init_outer */}
          <line x1="140" y1="51" x2="140" y2="68" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />
          {/* init_outer -> check_outer */}
          <line x1="140" y1="102" x2="140" y2="131" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />
          {/* check_outer -> init_inner (Yes: outer continues) */}
          <line x1="140" y1="179" x2="140" y2="218" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />
          {/* check_outer -> all_sorted (No: done) */}
          <line x1="200" y1="155" x2="207" y2="155" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />
          {/* all_sorted -> end */}
          <line x1="260" y1="137" x2="260" y2="91" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* init_inner -> check_inner */}
          <line x1="140" y1="252" x2="140" y2="281" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />
          {/* check_inner -> compare_elements (Yes) */}
          <line x1="140" y1="329" x2="140" y2="367" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />
          {/* check_inner -> pass_done (No: pass complete) */}
          <line x1="205" y1="305" x2="205" y2="305" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="205" y1="305" x2="205" y2="305" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* pass_done -> check_outer loop back */}
          <path d="M 260 284 L 260 215 L 180 165" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow)" />

          {/* compare_elements -> decision_swap */}
          <line x1="140" y1="403" x2="140" y2="439" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* decision_swap -> do_swap (Yes branch) */}
          <path
            d="M 68 465 L 50 465 L 50 538"
            fill="none"
            stroke={decision_branch === 'yes' ? 'var(--success)' : 'var(--text-muted)'}
            strokeWidth={decision_branch === 'yes' ? '2.5' : '1.5'}
            markerEnd={decision_branch === 'yes' ? 'url(#arrow-yes)' : 'url(#arrow)'}
          />
          <text x="32" y="495" fill={decision_branch === 'yes' ? 'var(--success)' : 'var(--text-muted)'} fontSize="9" fontWeight="bold">
            YES
          </text>

          {/* decision_swap -> advance_inner (No branch) */}
          <path
            d="M 212 465 L 225 465 L 225 615 L 190 635"
            fill="none"
            stroke={decision_branch === 'no' ? 'var(--danger)' : 'var(--text-muted)'}
            strokeWidth={decision_branch === 'no' ? '2.5' : '1.5'}
            markerEnd={decision_branch === 'no' ? 'url(#arrow-no)' : 'url(#arrow)'}
          />
          <text x="215" y="495" fill={decision_branch === 'no' ? 'var(--danger)' : 'var(--text-muted)'} fontSize="9" fontWeight="bold">
            NO
          </text>

          {/* do_swap -> advance_inner */}
          <path d="M 50 572 L 50 635 L 90 635" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* advance_inner -> check_inner loop back */}
          <path d="M 140 642 L 140 665 L 15 665 L 15 305 L 75 305" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow)" />

          {/* Flowchart Nodes Rendering */}
          {nodes.map((node) => {
            const active = isNodeActive(node.id);
            const isTarget = node.id === stage_id;

            // Colors specified in Section 5.1:
            // Active nodes: gold fill (var(--highlight)), bold amber borders (var(--highlight-strong)), dark text
            const fill = active ? 'var(--highlight)' : 'var(--surface-inset)';
            const stroke = active ? 'var(--highlight-strong)' : 'var(--text-muted)';
            const strokeWidth = active ? (isTarget ? 3 : 2) : 1.5;
            const textColor = active ? 'var(--surface-inset)' : 'var(--text-primary)';

            return (
              <g
                key={node.id}
                className="transition-all duration-300"
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                {node.shape === 'oval' && (
                  <ellipse
                    cx={node.x}
                    cy={node.y}
                    rx={node.w / 2}
                    ry={node.h / 2}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className={active ? 'filter drop-shadow-[0_0_8px_var(--glow-highlight)]' : ''}
                  />
                )}

                {node.shape === 'rect' && (
                  <rect
                    x={node.x - node.w / 2}
                    y={node.y - node.h / 2}
                    width={node.w}
                    height={node.h}
                    rx="6"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className={active ? 'filter drop-shadow-[0_0_8px_var(--glow-highlight)]' : ''}
                  />
                )}

                {node.shape === 'diamond' && (
                  <polygon
                    points={`
                      ${node.x},${node.y - node.h / 2}
                      ${node.x + node.w / 2},${node.y}
                      ${node.x},${node.y + node.h / 2}
                      ${node.x - node.w / 2},${node.y}
                    `}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className={active ? 'filter drop-shadow-[0_0_8px_var(--glow-highlight)]' : ''}
                  />
                )}

                {/* Text lines */}
                {node.label.split('\n').map((line, i, arr) => {
                  const yOffset = (i - (arr.length - 1) / 2) * 12;
                  return (
                    <text
                      key={i}
                      x={node.x}
                      y={node.y + yOffset + 3}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={node.shape === 'diamond' ? '9.5' : '10.5'}
                      fontWeight={active ? '700' : '500'}
                    >
                      {line}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
