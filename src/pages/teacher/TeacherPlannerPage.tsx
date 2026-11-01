/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Sparkles, X, ArrowRight, Play, Edit3, ShieldCheck } from 'lucide-react';
import { InterventionPlan } from '../../types';

export const TeacherPlannerPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('8');
  const [plans, setPlans] = useState<InterventionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlans = () => {
    fetch(`/api/teacher/planner?classLevel=${selectedClass}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPlans(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlans();
  }, [selectedClass]);

  const handleUpdateStatus = async (planId: string, status: string) => {
    try {
      await fetch(`/api/teacher/planner/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify({ status }),
      });
      loadPlans();
    } catch (e) {
      console.error('Failed to update intervention plan:', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Next 10 Minutes Planner (Evidence-Based Actions)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immediate micro-teaching interventions derived from real-time Concept Detective diagnoses. Ready for your next class session.
          </p>
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
        >
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
        </select>
      </div>

      {/* Plan Cards */}
      <div className="space-y-6">
        {plans.map((p) => {
          const isCompleted = p.status === 'completed';
          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl border-2 p-6 sm:p-8 shadow-xs space-y-5 transition-all ${
                isCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'border-indigo-100 hover:border-indigo-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-mono text-[11px] font-bold">
                      {p.board} Class {p.classLevel}-{p.section} • {p.subject}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {p.suggestedActivity} ({p.durationMinutes} Minutes)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Target Concept: {p.targetConceptTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isCompleted ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(p.id, 'in_progress')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Plan</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(p.id, 'completed')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    </>
                  ) : (
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Intervention Completed</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Target Students & Observed Gap */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Students Requiring This 10-Minute Activity:
                </span>
                <div className="space-y-1.5">
                  {p.targetStudents.map((st: { id: string; name: string; observedGap: string }) => (
                    <div key={st.id} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="font-bold text-slate-900">{st.name}:</span>
                      <span className="text-slate-600">{st.observedGap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions and Materials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-1.5 text-indigo-950">
                  <span className="font-bold text-indigo-900 uppercase tracking-wider block text-[11px]">
                    Step-by-Step Instructions:
                  </span>
                  <p className="whitespace-pre-line leading-relaxed">{p.instructions}</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-slate-700">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                      Required Materials:
                    </span>
                    <p className="font-medium mt-0.5">{p.materialsNeeded}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                      Follow-up Verification Check:
                    </span>
                    <p className="font-medium mt-0.5">{p.followUpCheck}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
