/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Calendar, CheckCircle2, UserCheck } from 'lucide-react';
import { Assignment } from '../../types';

export const TeacherAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [classLevel, setClassLevel] = useState('8');
  const [section, setSection] = useState('A');
  const [subject, setSubject] = useState('Mathematics');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-10');

  const loadAssignments = () => {
    fetch('/api/teacher/assignments', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setAssignments(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/teacher/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify({
          title,
          board,
          classLevel,
          section,
          subject,
          chapterId: 'ch_cbse8_math_fractions',
          conceptId: 'con_cbse8_m1_c3',
          instructions,
          dueDate,
        }),
      });

      setShowCreateModal(false);
      setTitle('');
      setInstructions('');
      loadAssignments();
    } catch (e) {
      console.error('Failed to create assignment:', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Class Homework & Practice Assignments
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Target assignments to entire sections or specific instructional cohorts (Support / Practice / Challenge).
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold font-mono">
                  {asg.board} Cl.{asg.classLevel}-{asg.section} • {asg.subject}
                </span>
                <span className="text-slate-400 font-medium">Due: {asg.dueDate}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{asg.instructions}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">
                Submissions: {asg.submissionsCount} Recorded
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Published
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Target Assignment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Questions will adapt to the student's board and difficulty tier.
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mastery Task: Linear Equations Transposition"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Board</label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="TELANGANA_SSC">Telangana SSC</option>
                    <option value="CISCE">CISCE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions for Students</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Solve step-by-step and write down intermediate balancing operations."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-xs"
                >
                  Create & Distribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
