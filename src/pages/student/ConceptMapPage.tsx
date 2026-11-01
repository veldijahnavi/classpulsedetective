/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GitBranch, Layers, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MasteryStatus } from '../../types';

export const ConceptMapPage: React.FC<{ onNavigateToLearn: (conId: string) => void }> = ({ onNavigateToLearn }) => {
  const { studentProfile } = useAuth();
  const [mapData, setMapData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentProfile) return;
    fetch(`/api/curriculum/concept-map?board=${studentProfile.board}&classLevel=${studentProfile.classLevel}&studentId=${studentProfile.userId}`)
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (!data || !data.nodes) return;
        setMapData(data);
        if (data.nodes.length > 0) setSelectedNode(data.nodes[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentProfile]);

  const getStatusBadge = (status: MasteryStatus) => {
    switch (status) {
      case 'STRONG_UNDERSTANDING':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', label: 'Strong Understanding' };
      case 'PREREQUISITE_GAP':
        return { bg: 'bg-red-100 text-red-800 border-red-300', dot: 'bg-red-500', label: 'Prerequisite Gap Detected' };
      case 'POSSIBLE_MISCONCEPTION':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500', label: 'Misconception Under Review' };
      case 'PRACTICING':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500', label: 'Active Practice' };
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-400', label: 'Untested Baseline' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <GitBranch className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Prerequisite Concept Dependency Map
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing concept prerequisites for Class {studentProfile?.classLevel} ({studentProfile?.board}).
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Strong
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Practicing
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-800 rounded-lg border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Gap
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Untested
          </span>
        </div>
      </div>

      {/* Dependency Map Grid & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Network Visualizer */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Curriculum Concept Nodes
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {mapData.nodes.map((node) => {
              const badge = getStatusBadge(node.status);
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-slate-400">
                        {node.chapterTitle}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {node.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{node.hasPrerequisites ? 'Has Prerequisites' : 'Foundational Base'}</span>
                    <span className="text-indigo-600 font-bold">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Concept Inspector Drawer */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-fit space-y-4">
          {selectedNode ? (
            <>
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                  Concept Inspector
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedNode.title}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Board Learning Outcome:
                  </span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                    {selectedNode.learningOutcome}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Required Prerequisites:
                  </span>
                  {mapData.links.filter((l) => l.target === selectedNode.id).length > 0 ? (
                    <div className="space-y-1.5">
                      {mapData.links
                        .filter((l) => l.target === selectedNode.id)
                        .map((l, i) => (
                          <div key={i} className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-medium">
                            <span className="font-bold">{l.importance}: </span> {l.label}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No previous class prerequisites required.</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onNavigateToLearn(selectedNode.id)}
                className="w-full mt-4 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Study Concept in Learn Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-400">Click any concept node to inspect its dependencies.</p>
          )}
        </div>
      </div>
    </div>
  );
};
