/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  Target,
  FileText,
} from 'lucide-react';

interface MySubjectsPageProps {
  onSelectChapter: (chapterId: string) => void;
}

export const MySubjectsPage: React.FC<MySubjectsPageProps> = ({ onSelectChapter }) => {
  const { studentProfile } = useAuth();
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [detailModalChapter, setDetailModalChapter] = useState<any | null>(null);

  useEffect(() => {
    if (!studentProfile) return;
    fetch(`/api/curriculum/chapters?board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`)
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setChapters(data);
      })
      .catch(console.error);
  }, [studentProfile]);

  const registeredSubjects = studentProfile?.registeredSubjects || ['Mathematics', 'Science', 'English'];
  const subjectList = ['All', ...registeredSubjects];

  const filteredChapters = selectedSubject === 'All'
    ? chapters
    : chapters.filter((c) => c.subject.toLowerCase() === selectedSubject.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              My Enrolled Subjects ({studentProfile?.board} • Class {studentProfile?.classLevel})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Displaying only the syllabus, chapters, and competencies officially assigned to your school enrollment.
          </p>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {subjectList.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters Grid or Clear Unavailable Notice */}
      {filteredChapters.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xs text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Content for this subject is not available yet.
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            Digitized question banks and interactive lessons for <strong>{selectedSubject}</strong> under{' '}
            {studentProfile?.board} Class {studentProfile?.classLevel} are being verified against official NCERT / State SCERT rationalized frameworks.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setSelectedSubject('All')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
            >
              <span>View Available Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChapters.map((ch) => (
            <div
              key={ch.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2.5">
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-mono">
                    {ch.subject}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Official Mapped
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Chapter {ch.chapterNumber}: {ch.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {ch.introduction}
                </p>

                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Key Concepts:
                  </span>
                  {ch.concepts.slice(0, 3).map((con: any) => (
                    <div key={con.id} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span className="line-clamp-1">{con.title}</span>
                    </div>
                  ))}
                  {ch.concepts.length > 3 && (
                    <span className="text-[11px] text-slate-400 font-medium pl-3">
                      +{ch.concepts.length - 3} more concepts
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setDetailModalChapter(ch)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-indigo-600 font-bold transition-colors"
                >
                  Syllabus Overview
                </button>
                <button
                  onClick={() => onSelectChapter(ch.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Study Chapter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chapter & Concept Details Modal */}
      {detailModalChapter && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                  {detailModalChapter.subject}
                </span>
                <span className="text-xs font-medium text-slate-400">• Class {studentProfile?.classLevel}</span>
              </div>
              <button
                onClick={() => setDetailModalChapter(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Chapter {detailModalChapter.chapterNumber}: {detailModalChapter.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {detailModalChapter.introduction}
                </p>
              </div>

              {detailModalChapter.learningObjectives && detailModalChapter.learningObjectives.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>Prescribed Learning Outcomes</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    {detailModalChapter.learningObjectives.map((obj: string, i: number) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mapped Sub-Concepts & Competencies:
                </h4>
                <div className="space-y-2.5">
                  {detailModalChapter.concepts.map((con: any, index: number) => (
                    <div
                      key={con.id}
                      className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                        <span>{index + 1}. {con.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Competency Module</span>
                      </div>
                      <p className="text-xs text-slate-600">{con.description}</p>
                      {con.learningOutcome && (
                        <p className="text-[11px] text-emerald-700 font-medium">
                          Outcome: {con.learningOutcome}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setDetailModalChapter(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const chId = detailModalChapter.id;
                  setDetailModalChapter(null);
                  onSelectChapter(chId);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Study this Chapter Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
