/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const StudentAssignmentsPage: React.FC<{ onStartPractice: (conId: string) => void }> = ({ onStartPractice }) => {
  const { studentProfile } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/assignments', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setAssignments(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Assigned Homework & Practice Sets</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review assignments created by your subject teachers for Class {studentProfile?.classLevel}-{studentProfile?.section}.
        </p>
      </div>

      <div className="space-y-4">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md font-mono">
                  {asg.subject}
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Due: {asg.dueDate}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">{asg.instructions}</p>
            </div>

            <button
              onClick={() => onStartPractice(asg.conceptId)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0"
            >
              <span>Solve Assignment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
