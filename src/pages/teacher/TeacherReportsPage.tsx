/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Filter, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TeacherReportsPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('8');
  const [roster, setRoster] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/teacher/roster?classLevel=${selectedClass}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setRoster(data);
      })
      .catch(console.error);
  }, [selectedClass]);

  const handleDownloadCsv = () => {
    const token = localStorage.getItem('classpulse_token');
    window.location.href = `/api/teacher/export-csv?token=${token}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Diagnostic & Retest Evidence Reports
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Export unmanipulated student performance records, concept mastery classifications, and before-and-after retest gains.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Official CSV Report</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Student ID & Name</th>
              <th className="py-3.5 px-4">Board & Class</th>
              <th className="py-3.5 px-4">Baseline Diagnosis</th>
              <th className="py-3.5 px-4">Recovery Status</th>
              <th className="py-3.5 px-4">Verified Retest Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roster.map((r) => (
              <tr key={r.userId} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-bold text-slate-900 block">{r.name}</span>
                  <span className="text-[11px] font-mono text-slate-400">{r.studentId}</span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-700">
                  {r.board} Cl.{r.classLevel}-{r.section}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-slate-100 text-slate-700">
                    {r.initialProfileType.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {r.hasCompletedRecovery ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                    </span>
                  ) : (
                    <span className="text-slate-400">In Progress</span>
                  )}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                  {r.latestRetest ? (
                    <span>
                      {r.latestRetest.retestScore}/{r.latestRetest.retestTotal} (+{r.latestRetest.improvementDelta})
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal">Pending Retest</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
