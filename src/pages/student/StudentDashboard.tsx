/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { MasteryStatus } from '../../types';

interface StudentDashboardProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user, studentProfile } = useAuth();
  const { t, learningLanguage } = useLanguage();

  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [activeDiagnosis, setActiveDiagnosis] = useState<any | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentProfile) return;

    // Fetch chapters for this student's board and class
    fetch(`/api/curriculum/chapters?board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`)
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setChapters(data);
      })
      .catch(console.error);

    // Fetch active diagnosis dynamically for the student's current board & class
    fetch(`/api/detective/latest/${studentProfile.userId}`)
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (data && data.evidence) {
          setActiveDiagnosis(data.evidence);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentProfile]);

  const boardTitle =
    studentProfile?.board === 'TELANGANA_SSC'
      ? 'Telangana State SCERT'
      : studentProfile?.board === 'CISCE'
      ? 'CISCE / ICSE'
      : 'CBSE / NCERT';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Syllabus: {boardTitle} • Class {studentProfile?.classLevel}-{studentProfile?.section}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="mt-2 text-sm text-indigo-100 leading-relaxed">
            {studentProfile?.learningProfileDescription || 'Your intelligent learning detective is tracking your concept understanding across all enrolled subjects.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('learn')}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 text-xs font-bold shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Resume Learning</span>
            </button>
            <button
              onClick={() => onNavigate('solve')}
              className="px-5 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white text-xs font-bold border border-indigo-500/50 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-indigo-300" />
              <span>Solve & Practice Questions</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE INNOVATION CALLOUT: Concept Detective & Smart Recovery Alert */}
      {activeDiagnosis && (
        <div className="p-6 bg-amber-50/90 border-2 border-amber-300/80 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                  Concept Detective Alert
                </span>
                <span className="text-xs text-amber-800 font-semibold">
                  Evidence-Backed Learning Need
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {activeDiagnosis.primaryObservedDifficulty}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                {activeDiagnosis.diagnosticExplanation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('detective', { conceptId: activeDiagnosis.conceptId })}
              className="px-4 py-2 bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
            >
              Inspect Clues
            </button>
            <button
              onClick={() => onNavigate('recovery', { activityId: activeDiagnosis.recommendedActivityId })}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Smart Recovery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Enrolled Subjects</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {studentProfile?.registeredSubjects.length || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Board-approved curriculum
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Diagnosed Clues</span>
            <Search className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            {activeDiagnosis ? '1 Active' : '0 Pending'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Investigated by Concept Detective
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Smart Recovery</span>
            <RotateCcw className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">
            1 Available
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Guided scaffolded remediation
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Teacher Sync</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            Live
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Real-time evidence push
          </p>
        </div>
      </div>

      {/* Available Chapters for this Class & Board */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              My Class {studentProfile?.classLevel} Chapters ({boardTitle})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every chapter contains complete verified lessons, step-by-step visualizers, and adaptive practice.
            </p>
          </div>
          <button
            onClick={() => onNavigate('subjects')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Subjects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((ch) => (
            <div
              key={ch.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/50"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-mono">
                    {ch.subject} • Ch {ch.chapterNumber}
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                    Verified
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {ch.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {ch.introduction}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {ch.concepts.length} Concept Modules
                </span>
                <button
                  onClick={() => onNavigate('learn', { chapterId: ch.id })}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Open Lesson</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
