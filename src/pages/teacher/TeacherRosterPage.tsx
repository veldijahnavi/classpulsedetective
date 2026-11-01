/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Users, Search, X, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { MasteryStatus } from '../../types';

export const TeacherRosterPage: React.FC = () => {
  const [roster, setRoster] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/roster', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setRoster(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = roster.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.board.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Verified Student Roster ({roster.length} Enrolled)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search students across CBSE, Telangana SSC, and CISCE Classes 6–10. Click any student for comprehensive drill-down.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Student Name & ID</th>
              <th className="py-3 px-4">Board & Class</th>
              <th className="py-3 px-4">Medium & Language</th>
              <th className="py-3 px-4">Evidence Status</th>
              <th className="py-3 px-4">Retest Performance</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.userId} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-900 block">{s.name}</span>
                  <span className="text-[11px] font-mono text-slate-400">{s.studentId}</span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-700">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] mr-1.5">
                    {s.board}
                  </span>
                  Class {s.classLevel}-{s.section}
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  {s.medium} (UI: {s.interfaceLanguage.toUpperCase()} / Content: {s.learningLanguage.toUpperCase()})
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize bg-slate-100 text-slate-800">
                    {s.initialProfileType.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                  {s.latestRetest ? (
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                      {s.latestRetest.retestScore}/{s.latestRetest.retestTotal} (+{s.latestRetest.improvementDelta})
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal">Pending Retest</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    View Drilldown
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Individual Student Drilldown Drawer (Modal) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block font-mono">
                  Student Comprehensive Learning Trail
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {selectedStudent.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedStudent.studentId} • {selectedStudent.board} Class {selectedStudent.classLevel}-{selectedStudent.section}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Learning Profile:
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {selectedStudent.profileDescription}
                </p>
              </div>

              {selectedStudent.latestDiagnostic && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5 text-amber-950">
                  <span className="font-bold text-amber-900 uppercase tracking-wider block">
                    Concept Detective Diagnostic Finding:
                  </span>
                  <p className="font-semibold">{selectedStudent.latestDiagnostic.primaryObservedDifficulty}</p>
                  <p className="text-[11px] text-amber-800">{selectedStudent.latestDiagnostic.diagnosticExplanation}</p>
                </div>
              )}

              {selectedStudent.latestRetest && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 text-emerald-950">
                  <span className="font-bold text-emerald-900 uppercase tracking-wider block">
                    Verified Retest Outcome:
                  </span>
                  <p className="font-bold">{selectedStudent.latestRetest.beforeAfterSummary}</p>
                  <div className="text-[11px] text-emerald-800 flex items-center justify-between mt-2 pt-2 border-t border-emerald-200">
                    <span>Original: {selectedStudent.latestRetest.originalScore}/{selectedStudent.latestRetest.originalTotal}</span>
                    <span className="font-bold">Retest: {selectedStudent.latestRetest.retestScore}/{selectedStudent.latestRetest.retestTotal}</span>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold">
                      +{selectedStudent.latestRetest.improvementDelta} Gain
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
