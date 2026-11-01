/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, CheckCircle2, RotateCcw, Award, ShieldCheck } from 'lucide-react';

export const StudentProgressPage: React.FC = () => {
  const { studentProfile } = useAuth();
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/student/progress', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (data) {
          setProgressData(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentProfile]);

  const retests = progressData?.retests || [];
  const diagnostics = progressData?.diagnostics || [];
  const recoveries = progressData?.recoveries || [];
  const attempts = progressData?.attempts || [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Class {studentProfile?.classLevel} {studentProfile?.board} • Enrolled Curriculum</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Personal Mastery & Evidence Trail</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Strictly isolated to your private school records. Synchronized live with your authorized teachers.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-400 block uppercase font-mono">Student ID</span>
          <span className="text-sm font-extrabold text-slate-800 font-mono">{studentProfile?.studentId}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Adaptive Level
          </span>
          <div className="text-base sm:text-lg font-black text-indigo-600 mt-1">
            {progressData?.adaptiveState?.replace(/_/g, ' ') || 'Independent Practice'}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Multi-point difficulty engine</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Practice Attempts
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            {attempts.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Unique questions attempted</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Smart Recoveries
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
            {recoveries.filter((r: any) => r.isCompleted).length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Scaffolded pathways mastered</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Fresh Retests
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {retests.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Verified improvement trials</p>
        </div>
      </div>

      {/* Fresh Retest History */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Fresh Retest History (Before vs After Evidence)</span>
          </h3>
          <span className="text-xs font-bold text-slate-400 font-mono">{retests.length} records</span>
        </div>

        {retests.length > 0 ? (
          <div className="space-y-3">
            {retests.map((r: any, i: number) => (
              <div key={i} className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-700 text-white font-mono">
                      {r.outcome}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {r.subject} • {r.conceptTitle || r.conceptId}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-700">{r.beforeAfterSummary}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Timestamp: {new Date(r.completedAt).toLocaleString()}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold block sm:inline-block">
                    Retest: {r.retestScore}/{r.retestTotal} (+{r.improvementDelta})
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-100">
            No fresh retests recorded yet. When you complete an assessment and work through a Smart Recovery activity, you will unlock a fresh retest to demonstrate your upgraded mastery!
          </p>
        )}
      </div>

      {/* Diagnostic Gaps Identified by Concept Detective */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <span>Concept Detective Findings & Learning Gaps</span>
          </h3>
          <span className="text-xs font-bold text-slate-400 font-mono">{diagnostics.length} investigations</span>
        </div>

        {diagnostics.length > 0 ? (
          <div className="space-y-3">
            {diagnostics.map((d: any, i: number) => (
              <div key={i} className="p-4 bg-amber-50/40 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-800 text-white font-mono">
                      {d.concludedStatus.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {d.subject} • {d.conceptId}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{d.diagnosticExplanation}</p>
                <div className="text-[11px] font-semibold text-indigo-700">
                  Recommended Action: {d.recommendedRecoveryType} ({d.recommendedActivityId})
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-100">
            No active misconception or prerequisite gap logged. Keep practicing to maintain strong understanding!
          </p>
        )}
      </div>
    </div>
  );
};
