/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  Compass,
  FileText,
  Target,
  Key,
  Globe,
  Table,
  Check,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';
import { FractionBarVisualizer } from '../../components/visualizers/FractionBarVisualizer';
import { AlgebraBalanceVisualizer } from '../../components/visualizers/AlgebraBalanceVisualizer';
import { cacheLessonLocally, getCachedLessonLocally } from '../../utils/offlineSync';

interface LearnPageProps {
  initialChapterId?: string;
  initialConceptId?: string;
  onNavigateToSolve: (chapterId: string, conceptId: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ initialChapterId, initialConceptId, onNavigateToSolve }) => {
  const { studentProfile } = useAuth();
  const { learningLanguage, t } = useLanguage();

  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(initialChapterId || 'ch_cbse8_math_fractions');
  const [selectedConceptId, setSelectedConceptId] = useState<string>(initialConceptId || 'con_cbse8_m1_c3');
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync when parent provides new initialChapterId or initialConceptId
  useEffect(() => {
    if (initialChapterId) setSelectedChapterId(initialChapterId);
    if (initialConceptId) setSelectedConceptId(initialConceptId);
  }, [initialChapterId, initialConceptId]);

  // Interactive self-check toggle state
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  // Load chapters for student's board & class
  useEffect(() => {
    if (!studentProfile) return;
    fetch(`/api/curriculum/chapters?board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`)
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (!Array.isArray(data)) return;
        setChapters(data);
        if (data.length > 0 && !data.some((c: any) => c.id === selectedChapterId)) {
          setSelectedChapterId(data[0].id);
          if (data[0].concepts.length > 0) {
            setSelectedConceptId(data[0].concepts[0].id);
          }
        }
      })
      .catch(console.error);
  }, [studentProfile]);

  // Load lesson details
  useEffect(() => {
    if (!selectedChapterId || !selectedConceptId) return;
    setLoading(true);
    setRevealedAnswers({});
    setRevealedHints({});

    fetch(`/api/learn/lesson/${encodeURIComponent(selectedChapterId)}/${encodeURIComponent(selectedConceptId)}`)
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setLessonData(data);
        if (data?.lesson) {
          cacheLessonLocally(selectedChapterId, selectedConceptId, data);
        }

        // Log real-time activity: lesson started
        const token = localStorage.getItem('classpulse_token');
        if (token && data?.lesson) {
          fetch('/api/activity/log', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              activityType: 'lesson_started',
              chapterId: selectedChapterId,
              conceptId: selectedConceptId,
              subject: data.chapter?.subject,
            }),
          }).catch(() => {});
        }
      })
      .catch((err) => {
        console.warn('Network issue fetching lesson, checking local offline cache:', err);
        const cached = getCachedLessonLocally(selectedChapterId, selectedConceptId);
        if (cached) {
          setLessonData(cached);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedChapterId, selectedConceptId]);

  const currentChapter = chapters.find((c) => c.id === selectedChapterId);
  const currentLesson = lessonData?.lesson;

  // Language helper
  const getLocalized = (obj: any) => {
    if (!obj) return '';
    return obj[learningLanguage] || obj.en || '';
  };

  const handleStartPractice = () => {
    // Log lesson completed
    const token = localStorage.getItem('classpulse_token');
    if (token && currentLesson) {
      fetch('/api/activity/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activityType: 'lesson_completed',
          chapterId: selectedChapterId,
          conceptId: selectedConceptId,
          subject: currentChapter?.subject,
        }),
      }).catch(() => {});
    }
    onNavigateToSolve(selectedChapterId, selectedConceptId);
  };

  return (
    <div className="space-y-6">
      {/* Chapter & Concept Selector Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              {currentChapter?.subject} • Class {studentProfile?.classLevel} ({studentProfile?.board})
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {currentChapter?.title || 'Interactive Learning Module'}
            </h2>
          </div>
        </div>

        {/* Chapter dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedChapterId}
            onChange={(e) => {
              const chId = e.target.value;
              setSelectedChapterId(chId);
              const ch = chapters.find((c) => c.id === chId);
              if (ch && ch.concepts.length > 0) {
                setSelectedConceptId(ch.concepts[0].id);
              }
            }}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none"
          >
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.subject}: Ch {c.chapterNumber} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Layout: Sidebar of Concepts + Interactive Lesson */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Concept Outline Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs h-fit space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-2 mb-2">
            Concepts in this Chapter
          </span>
          {currentChapter?.concepts.map((con: any, index: number) => {
            const isSelected = con.id === selectedConceptId;
            return (
              <button
                key={con.id}
                onClick={() => setSelectedConceptId(con.id)}
                className={`w-full text-left p-3 rounded-xl transition-all text-xs flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="leading-snug">{con.title}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Lesson Body */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-sm text-slate-500">
              Loading verified chapter lesson content...
            </div>
          ) : currentLesson ? (
            <>
              {/* SECTION 1: TOPIC INTRODUCTION & WHY LEARN THIS */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Comprehensive 16-Point Learning Guide</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {currentLesson.title}
                </h1>

                {/* Topic Introduction */}
                {currentLesson.topicIntroduction && (
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                    {getLocalized(currentLesson.topicIntroduction)}
                  </p>
                )}

                {/* Why Learn This Callout */}
                {currentLesson.whyLearn && (
                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
                    <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                        Why Learn This? Real-World Value:
                      </span>
                      <p className="text-xs text-amber-950 mt-0.5 leading-relaxed">
                        {getLocalized(currentLesson.whyLearn)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: LEARNING OBJECTIVES & PREREQUISITES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Learning Objectives */}
                {(currentLesson.learningObjectives || currentChapter?.learningObjectives) && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Learning Objectives
                      </h3>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {(currentLesson.learningObjectives || currentChapter?.learningObjectives).map(
                        (obj: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Prerequisite Knowledge */}
                {currentLesson.prerequisiteKnowledge && currentLesson.prerequisiteKnowledge.length > 0 && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Prerequisites to Review First
                      </h3>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {currentLesson.prerequisiteKnowledge.map((pre: any, i: number) => (
                        <li key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 leading-relaxed">
                          {getLocalized(pre)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* SECTION 3: DETAILED EXPLANATION & DEFINITIONS */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Detailed Concept Explanation
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {getLocalized(currentLesson.explanation)}
                </p>

                {/* Definitions */}
                {currentLesson.definitions && currentLesson.definitions.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Essential Definitions & Terminology:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentLesson.definitions.map((def: any, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                          <span className="font-bold text-indigo-900 text-xs block mb-1">
                            {def.term}
                          </span>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {getLocalized(def.definition)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: PRINCIPLES, RULES & STRUCTURES */}
              {currentLesson.principlesAndRules && currentLesson.principlesAndRules.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Governing Principles & Rules
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {currentLesson.principlesAndRules.map((rule: any, i: number) => (
                      <div key={i} className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-2">
                        <span className="font-bold text-xs text-indigo-900 block">
                          {rule.heading}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                          {getLocalized(rule.rule)}
                        </p>
                        {rule.formulaOrStructure && (
                          <div className="p-2.5 bg-slate-900 text-indigo-300 font-mono text-xs rounded-lg mt-2">
                            {rule.formulaOrStructure}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5: INTERACTIVE VISUALIZER (When Applicable) */}
              {currentLesson.visualizerType === 'fraction_bar' && (
                <FractionBarVisualizer
                  fractionA={currentLesson.visualizerConfig?.fractionA}
                  fractionB={currentLesson.visualizerConfig?.fractionB}
                  lcm={currentLesson.visualizerConfig?.lcm}
                />
              )}

              {currentLesson.visualizerType === 'algebra_balance' && (
                <AlgebraBalanceVisualizer />
              )}

              {/* SECTION 6: WORKED EXAMPLES (STEP-BY-STEP) */}
              {currentLesson.workedExamples && currentLesson.workedExamples.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Step-by-Step Worked Example
                    </h3>
                  </div>

                  {currentLesson.workedExamples.map((ex: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                      <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                          Problem Statement:
                        </span>
                        <div className="text-sm font-bold text-slate-900 font-mono">
                          {getLocalized(ex.problem)}
                        </div>
                      </div>

                      <div className="space-y-2.5 pl-2 border-l-2 border-indigo-200">
                        {ex.stepByStep.map((step: any, stepIdx: number) => (
                          <div key={stepIdx} className="text-xs sm:text-sm text-slate-700 pl-3">
                            {getLocalized(step)}
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Final Result:</span>
                        <span className="font-bold text-emerald-400 text-sm">{ex.finalAnswer}</span>
                      </div>

                      {ex.keyInsight && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-bold">Key Insight: </strong>
                            {getLocalized(ex.keyInsight)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* SECTION 7: DIAGRAMS & TABULAR OVERVIEWS */}
              {currentLesson.diagramsAndTables && currentLesson.diagramsAndTables.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Table className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Diagrams & Tabular Reference
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {currentLesson.diagramsAndTables.map((d: any, i: number) => (
                      <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                        <span className="font-bold text-xs text-slate-800 block">{d.title}</span>
                        {d.asciiRepresentation && (
                          <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre">
                            {d.asciiRepresentation}
                          </pre>
                        )}
                        <p className="text-xs text-slate-600 italic">{d.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 8: REAL-WORLD APPLICATIONS */}
              {currentLesson.realWorldApplications && currentLesson.realWorldApplications.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Real-World Applications
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentLesson.realWorldApplications.map((app: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <span className="font-bold text-xs text-indigo-900 block">{app.title}</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{getLocalized(app.scenario)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 9: COMMON PITFALLS & MISCONCEPTIONS */}
              {currentLesson.commonMistakes && currentLesson.commonMistakes.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                      <AlertTriangle className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Common Student Pitfalls & Misconceptions
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {currentLesson.commonMistakes.map((m: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                        <div className="flex items-start gap-2 text-red-700">
                          <span className="font-bold uppercase tracking-wider shrink-0">Common Mistake:</span>
                          <span className="font-mono">{getLocalized(m.mistake)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-emerald-700 font-medium">
                          <span className="font-bold uppercase tracking-wider shrink-0">Correction:</span>
                          <span>{getLocalized(m.correction)}</span>
                        </div>
                        <div className="text-slate-500 pl-4 border-l border-slate-300">
                          <span className="font-bold">Why it happens: </span>
                          {getLocalized(m.whyItHappens)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 10: IMPORTANT POINTS & REVISION NOTES */}
              {(currentLesson.importantPoints || currentLesson.revisionNotes) && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Important Points & Revision Notes
                  </h3>

                  {currentLesson.importantPoints && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Takeaways:</span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {currentLesson.importantPoints.map((pt: any, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                            <span>{getLocalized(pt)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentLesson.revisionNotes && (
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 font-mono text-xs">
                      <span className="text-emerald-400 font-bold block">Quick Revision Sheet:</span>
                      {currentLesson.revisionNotes.map((note: any, i: number) => (
                        <p key={i}>{getLocalized(note)}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 11: KNOWLEDGE CHECK (INTERACTIVE SELF-TEST) */}
              {currentLesson.knowledgeCheckQuestions && currentLesson.knowledgeCheckQuestions.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Self-Test Knowledge Check
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {currentLesson.knowledgeCheckQuestions.map((q: any, i: number) => {
                      const isAnswerRevealed = revealedAnswers[i];
                      return (
                        <div key={i} className="p-4 bg-indigo-50/40 border border-indigo-200/80 rounded-xl space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs font-bold text-slate-900">
                              Q{i + 1}. {getLocalized(q.question)}
                            </p>
                            <button
                              onClick={() =>
                                setRevealedAnswers((prev) => ({ ...prev, [i]: !prev[i] }))
                              }
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-indigo-200"
                            >
                              {isAnswerRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{isAnswerRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
                            </button>
                          </div>

                          {isAnswerRevealed && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                              <span className="font-bold text-emerald-900 block">Verified Answer:</span>
                              <p className="text-emerald-950">{getLocalized(q.answer)}</p>
                              {q.quickTip && (
                                <p className="text-[11px] text-emerald-700 italic mt-1">
                                  Tip: {getLocalized(q.quickTip)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 12: PRACTICE EXERCISES WITH SOLUTION HINTS */}
              {currentLesson.practiceExercises && currentLesson.practiceExercises.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Practice Exercises & Application Drills
                  </h3>

                  <div className="space-y-3">
                    {currentLesson.practiceExercises.map((ex: any, i: number) => {
                      const isHintRevealed = revealedHints[i];
                      return (
                        <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            {getLocalized(ex.instruction)}
                          </span>
                          <p className="text-xs font-semibold text-slate-900 font-mono">
                            {getLocalized(ex.exerciseProblem)}
                          </p>

                          <div className="pt-1">
                            <button
                              onClick={() => setRevealedHints((prev) => ({ ...prev, [i]: !prev[i] }))}
                              className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                            >
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                              <span>{isHintRevealed ? 'Hide Solution Hint' : 'View Solution Hint'}</span>
                            </button>
                          </div>

                          {isHintRevealed && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-950 mt-2">
                              {getLocalized(ex.solutionHint)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Banner to Practice */}
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-extrabold">Ready to test your understanding?</h4>
                  <p className="text-xs text-indigo-100 mt-1">
                    Attempt adaptive questions. Concept Detective will immediately investigate if you make a mistake!
                  </p>
                </div>
                <button
                  onClick={handleStartPractice}
                  className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-extrabold text-xs shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Start Practice Questions</span>
                  <ArrowRight className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Content for this subject is not available yet.
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Official NCERT / SCERT rationalized lesson modules for this concept are currently being updated. Please choose another chapter or subject from your enrolled curriculum.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
