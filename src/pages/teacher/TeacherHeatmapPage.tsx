/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Grid, Search, X, CheckCircle2, AlertTriangle, RotateCcw, Clock, ShieldCheck, Filter } from 'lucide-react';
import { MasteryStatus } from '../../types';

export const TeacherHeatmapPage: React.FC = () => {
  const [selectedBoard, setSelectedBoard] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('8');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  const [heatmapData, setHeatmapData] = useState<{
    conceptColumns: Array<{ id: string; title: string; chapterTitle: string }>;
    rows: Array<any>;
  }>({ conceptColumns: [], rows: [] });

  const [selectedCell, setSelectedCell] = useState<{
    studentName: string;
    studentId: string;
    conceptTitle: string;
    status: MasteryStatus;
    evidenceNote: string;
    latestScore?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const loadHeatmap = () => {
    setLoading(true);
    let url = `/api/teacher/heatmap?classLevel=${selectedClass}&subject=${selectedSubject}`;
    if (selectedBoard !== 'All') url += `&board=${selectedBoard}`;
    if (selectedSection !== 'All') url += `&section=${selectedSection}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (data) setHeatmapData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHeatmap();
  }, [selectedBoard, selectedClass, selectedSection, selectedSubject]);

  const getCellColor = (status: MasteryStatus) => {
    switch (status) {
      case 'STRONG_UNDERSTANDING':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'PRACTICING':
        return 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold';
      case 'PREREQUISITE_GAP':
        return 'bg-red-500 hover:bg-red-600 text-white font-bold';
      case 'POSSIBLE_MISCONCEPTION':
        return 'bg-orange-500 hover:bg-orange-600 text-white font-bold';
      case 'UNTESTED':
      default:
        return 'bg-slate-200 hover:bg-slate-300 text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Grid className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Live Concept Mastery Heatmap (Students × Concepts)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Click on any cell to open the drill-down Evidence Drawer with raw student answers and diagnostic trails.
          </p>
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
          >
            <option value="All">All Boards</option>
            <option value="CBSE">CBSE</option>
            <option value="TELANGANA_SSC">Telangana SSC</option>
            <option value="CISCE">CISCE / ICSE</option>
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
          >
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science / Physical Science</option>
            <option value="Biological Science">Biological Science</option>
            <option value="Computer Applications">Computer Applications / Studies</option>
          </select>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center gap-4 px-2 text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500" /> Strong Understanding
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-400" /> Practicing / Routine
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-red-500" /> Evidence-Based Learning Gap
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-200" /> Untested Baseline (Not 0%)
        </span>
      </div>

      {/* Heatmap Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 w-64">
                Student Name (Roster)
              </th>
              {heatmapData.conceptColumns.map((col) => (
                <th
                  key={col.id}
                  className="py-3 px-3 text-xs font-bold text-slate-700 max-w-[180px] leading-tight"
                >
                  <div className="line-clamp-2">{col.title}</div>
                  <span className="text-[10px] text-slate-400 font-normal font-mono block mt-0.5">
                    {col.chapterTitle}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {heatmapData.rows.map((row) => (
              <tr key={row.userId} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block font-bold">{row.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {row.board} Cl.{row.classLevel}-{row.section}
                    </span>
                  </div>
                </td>

                {heatmapData.conceptColumns.map((col) => {
                  const cell = row.cells[col.id] || {
                    status: 'UNTESTED',
                    evidenceNote: 'No diagnostic attempts recorded yet.',
                  };
                  const colorClass = getCellColor(cell.status);

                  return (
                    <td key={col.id} className="py-2.5 px-3">
                      <button
                        onClick={() =>
                          setSelectedCell({
                            studentName: row.name,
                            studentId: row.studentId,
                            conceptTitle: col.title,
                            status: cell.status,
                            evidenceNote: cell.evidenceNote,
                            latestScore: cell.latestScore,
                          })
                        }
                        className={`w-full py-2 px-2 rounded-lg text-[11px] font-bold transition-all shadow-xs flex items-center justify-center cursor-pointer ${colorClass}`}
                      >
                        {cell.latestScore || (cell.status === 'STRONG_UNDERSTANDING' ? '✓ Strong' : cell.status === 'PREREQUISITE_GAP' ? '! Gap' : cell.status === 'PRACTICING' ? '~ Practice' : 'Untested')}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supporting Evidence Drawer (Modal) */}
      {selectedCell && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block font-mono">
                  Concept Detective Evidence Inspector
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedCell.studentName} ({selectedCell.studentId})
                </h3>
                <p className="text-xs text-slate-500">{selectedCell.conceptTitle}</p>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Evaluated Mastery Status:
                </span>
                <span className="text-sm font-black text-slate-900 block">
                  {selectedCell.status.replace('_', ' ')}
                </span>
              </div>

              <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-2xl text-indigo-950 space-y-1.5 leading-relaxed">
                <span className="font-bold text-indigo-900 uppercase tracking-wider block">
                  Observed Diagnostic & Retest Evidence:
                </span>
                <p>{selectedCell.evidenceNote}</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                <strong>Teacher Clinical Action: </strong>
                Evidence is saved permanently. If you believe the student demonstrates clinical mastery in classroom whiteboard activities, you can override their status in the Instructional Groups tab.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCell(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close Evidence Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
