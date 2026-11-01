/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, ArrowRight, X, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

export const TeacherGroupsPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('8');
  const [groups, setGroups] = useState<any[]>([]);
  const [overrideModal, setOverrideModal] = useState<{
    groupId: string;
    studentId: string;
    studentName: string;
    currentGroup: 'support' | 'practice' | 'challenge';
  } | null>(null);

  const [newGroupTarget, setNewGroupTarget] = useState<'support' | 'practice' | 'challenge'>('practice');
  const [overrideReason, setOverrideReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadGroups = () => {
    fetch(`/api/teacher/instructional-groups?classLevel=${selectedClass}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setGroups(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadGroups();
  }, [selectedClass]);

  const handleSaveOverride = async () => {
    if (!overrideModal || !overrideReason.trim()) return;
    setIsSaving(true);

    try {
      await fetch('/api/teacher/instructional-groups/override', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify({
          groupId: overrideModal.groupId,
          studentId: overrideModal.studentId,
          newGroup: newGroupTarget,
          reason: overrideReason,
        }),
      });

      setOverrideModal(null);
      setOverrideReason('');
      loadGroups();
    } catch (e) {
      console.error('Failed to save teacher override:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Evidence-Based Instructional Groups
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Students are automatically grouped into Support, Practice, or Challenge cohorts based on verified assessment and retest outcomes. Teachers retain clinical override authority.
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

      {/* Groups Display */}
      {groups.map((g) => (
        <div key={g.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                {g.board} Class {g.classLevel}-{g.section} • {g.subject}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Target Concept: {g.conceptId}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Last synced: {g.lastUpdated}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Support Group */}
            <div className="p-5 bg-red-50/70 border-2 border-red-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-red-200 text-red-900 rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Support Group ({g.supportStudents.length})
                </span>
                <span className="text-[10px] text-red-700 font-semibold">Needs 10-Min Bridge</span>
              </div>
              <p className="text-xs text-red-900 font-medium leading-relaxed">
                Students demonstrating missing prerequisites or core misconceptions in recent checks.
              </p>

              <div className="space-y-2 pt-2 border-t border-red-200">
                {g.supportStudents.map((st: any) => (
                  <div key={st.userId} className="p-2.5 bg-white rounded-xl border border-red-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{st.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{st.studentId}</span>
                    </div>
                    <button
                      onClick={() =>
                        setOverrideModal({
                          groupId: g.id,
                          studentId: st.userId,
                          studentName: st.name,
                          currentGroup: 'support',
                        })
                      }
                      className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-bold rounded"
                    >
                      Override
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Group */}
            <div className="p-5 bg-blue-50/70 border-2 border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-blue-200 text-blue-900 rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Practice Group ({g.practiceStudents.length})
                </span>
                <span className="text-[10px] text-blue-700 font-semibold">Routine Accuracy</span>
              </div>
              <p className="text-xs text-blue-900 font-medium leading-relaxed">
                Students with conceptual comprehension who need procedural repetitions and multi-step practice.
              </p>

              <div className="space-y-2 pt-2 border-t border-blue-200">
                {g.practiceStudents.map((st: any) => (
                  <div key={st.userId} className="p-2.5 bg-white rounded-xl border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{st.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{st.studentId}</span>
                    </div>
                    <button
                      onClick={() =>
                        setOverrideModal({
                          groupId: g.id,
                          studentId: st.userId,
                          studentName: st.name,
                          currentGroup: 'practice',
                        })
                      }
                      className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold rounded"
                    >
                      Override
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Group */}
            <div className="p-5 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-emerald-200 text-emerald-900 rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Challenge Group ({g.challengeStudents.length})
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">Higher Order Thinking</span>
              </div>
              <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                Students demonstrating mastery across original assessments and retests, ready for extension tasks.
              </p>

              <div className="space-y-2 pt-2 border-t border-emerald-200">
                {g.challengeStudents.map((st: any) => (
                  <div key={st.userId} className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{st.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{st.studentId}</span>
                    </div>
                    <button
                      onClick={() =>
                        setOverrideModal({
                          groupId: g.id,
                          studentId: st.userId,
                          studentName: st.name,
                          currentGroup: 'challenge',
                        })
                      }
                      className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded"
                    >
                      Override
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Teacher Clinical Override Modal */}
      {overrideModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block font-mono">
                  Clinical Educator Override
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Reassign {overrideModal.studentName}
                </h3>
              </div>
              <button
                onClick={() => setOverrideModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Target Group</label>
                <select
                  value={newGroupTarget}
                  onChange={(e) => setNewGroupTarget(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                >
                  <option value="support">Support Group (Remedial Bridge)</option>
                  <option value="practice">Practice Group (Regular Applications)</option>
                  <option value="challenge">Challenge Group (Higher Order Thinking)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Clinical Reason for Override (Saved to Audit Log)
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Student demonstrated complete oral mastery during whiteboard activity; reassigned to Practice."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setOverrideModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                disabled={isSaving || !overrideReason.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs"
              >
                {isSaving ? 'Saving...' : 'Apply Clinical Override'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
