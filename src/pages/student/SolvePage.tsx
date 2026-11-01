/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Search,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  Activity,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { Question } from '../../types';
import { queueSubmission } from '../../utils/offlineSync';

interface SolvePageProps {
  initialChapterId?: string;
  initialConceptId?: string;
  onLaunchDetective: (conceptId: string, chapterId: string) => void;
}

export const SolvePage: React.FC<SolvePageProps> = ({
  initialChapterId = 'ch_cbse8_math_fractions',
  initialConceptId = 'con_cbse8_m1_c3',
  onLaunchDetective,
}) => {
  const { studentProfile } = useAuth();
  const { learningLanguage, t } = useLanguage();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showHintMap, setShowHintMap] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Per-question timing and pacing state
  const [questionTimings, setQuestionTimings] = useState<
    Record<string, { activeSeconds: number; hintsUsed: number; wasChanged: boolean }>
  >({});
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const initialSelectionTracker = useRef<Record<string, string>>({});

  // Real-time Interactive Adaptive State & Misconception Gap Identification
  const [checkedQuestions, setCheckedQuestions] = useState<
    Record<
      string,
      {
        isCorrect: boolean;
        misconceptionTag?: string;
        errorType?: string;
        gapExplanation?: string;
        difficultyShift: 'stepped_up' | 'stepped_down';
        chosenText?: string;
        correctText?: string;
      }
    >
  >({});
  const [consecutiveWrongCount, setConsecutiveWrongCount] = useState(0);

  // Active question timer (pauses when tab is hidden)
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && !isSubmitted && questions.length > 0) {
        setActiveSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [isSubmitted, questions.length]);

  // Sync active seconds to questionTimings state on tick
  useEffect(() => {
    if (!questions[currentIndex]) return;
    const currentQId = questions[currentIndex].id;
    setQuestionTimings((prev) => ({
      ...prev,
      [currentQId]: {
        activeSeconds,
        hintsUsed: prev[currentQId]?.hintsUsed || 0,
        wasChanged: prev[currentQId]?.wasChanged || false,
      },
    }));
  }, [activeSeconds, currentIndex, questions]);

  // Reset timer on question switch, loading previous time if any
  const handleSwitchQuestion = (newIdx: number) => {
    if (newIdx < 0 || newIdx >= questions.length) return;
    const nextQId = questions[newIdx]?.id;
    const savedTime = questionTimings[nextQId]?.activeSeconds || 0;
    setActiveSeconds(savedTime);
    setCurrentIndex(newIdx);
  };

  // Fetch adaptive questions with limit=15 to ensure rich question pool
  useEffect(() => {
    if (!studentProfile) return;
    setLoading(true);
    fetch(
      `/api/assessment/questions?conceptId=${initialConceptId}&chapterId=${initialChapterId || ''}&studentId=${studentProfile.userId}&board=${studentProfile.board}&classLevel=${studentProfile.classLevel}&limit=15`
    )
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (!Array.isArray(data)) return;
        setQuestions(data);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setCheckedQuestions({});
        setConsecutiveWrongCount(0);
        setQuestionTimings({});
        setActiveSeconds(0);
        setIsSubmitted(false);
        setSubmissionResult(null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [initialConceptId, initialChapterId, studentProfile]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (choiceId: string) => {
    if (isSubmitted || !currentQ) return;

    const previousChoice = selectedAnswers[currentQ.id];
    const wasAlreadySelected = previousChoice !== undefined && previousChoice !== choiceId;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: choiceId,
    }));

    setQuestionTimings((prev) => ({
      ...prev,
      [currentQ.id]: {
        activeSeconds: prev[currentQ.id]?.activeSeconds || activeSeconds,
        hintsUsed: prev[currentQ.id]?.hintsUsed || 0,
        wasChanged: wasAlreadySelected || prev[currentQ.id]?.wasChanged || false,
      },
    }));
  };

  // Immediate Single-Question Check & Dynamic Adaptive Adjustment
  const handleCheckSingleQuestion = () => {
    if (!currentQ || isSubmitted) return;
    const chosenChoiceId = selectedAnswers[currentQ.id];
    if (!chosenChoiceId) return;

    const correctChoice = currentQ.choices?.find((c) => c.isCorrect);
    const chosenChoice = currentQ.choices?.find((c) => c.id === chosenChoiceId);

    let isCorrect = correctChoice ? correctChoice.id === chosenChoiceId : false;
    if (!correctChoice && currentQ.correctAnswerText) {
      const studentText = String(chosenChoiceId || '').trim().toLowerCase();
      const targetText = currentQ.correctAnswerText.trim().toLowerCase();
      if (currentQ.questionType === 'numerical' && !isNaN(Number(studentText)) && !isNaN(Number(targetText))) {
        const tol = currentQ.acceptableTolerance || 0.05;
        isCorrect = Math.abs(Number(studentText) - Number(targetText)) <= tol;
      } else {
        isCorrect = studentText === targetText;
      }
    }

    const misconceptionTag = chosenChoice?.misconceptionTag;
    let errorType = 'Misunderstanding';
    let gapExplanation = '';

    if (!isCorrect) {
      if (
        misconceptionTag?.includes('PREREQUISITE') ||
        misconceptionTag?.includes('LCM') ||
        misconceptionTag?.includes('DENOMINATOR') ||
        misconceptionTag?.includes('SIGN')
      ) {
        errorType = 'Likely Prerequisite Concept Gap';
        gapExplanation =
          'You may be missing a foundational prerequisite rule. Before solving this multi-step problem, review core rules and definitions.';
      } else if (misconceptionTag) {
        errorType = 'Possible Misconception';
        gapExplanation = `Selected answer was influenced by a common distractor trap (${misconceptionTag.replace(/_/g, ' ').toLowerCase()}). Remember to check the governing law or formula carefully.`;
      } else {
        errorType = 'Calculation or Procedural Error';
        gapExplanation = 'Double-check intermediate arithmetic or sign transformations during transposition.';
      }
      setConsecutiveWrongCount((prev) => prev + 1);
    } else {
      setConsecutiveWrongCount(0);
    }

    const feedback = {
      isCorrect,
      misconceptionTag,
      errorType,
      gapExplanation,
      difficultyShift: isCorrect ? ('stepped_up' as const) : ('stepped_down' as const),
      chosenText: chosenChoice?.text ? getLocalized(chosenChoice.text) : chosenChoiceId,
      correctText: correctChoice?.text ? getLocalized(correctChoice.text) : currentQ.correctAnswerText || 'See explanation',
    };

    setCheckedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: feedback,
    }));

    // Dynamic Adaptive Adjustment:
    // If CORRECT: gradually give a slightly harder question (Foundational -> Easy -> Moderate -> Challenging -> Application)
    // If INCORRECT: give an easier question testing the same concept (Application -> Challenging -> Moderate -> Easy -> Foundational)
    if (currentIndex < questions.length - 1) {
      setQuestions((prevList) => {
        const remaining = prevList.slice(currentIndex + 1);
        const difficultyRanks: Record<string, number> = {
          Foundational: 1,
          Easy: 2,
          Moderate: 3,
          Challenging: 4,
          Application: 5,
        };
        const curRank = difficultyRanks[currentQ.difficulty] || 3;
        // Target rank: +1 if correct, -1 if incorrect
        const targetRank = isCorrect
          ? Math.min(5, curRank + 1)
          : Math.max(1, curRank - 1);

        remaining.sort((a, b) => {
          const rankA = difficultyRanks[a.difficulty] || 3;
          const rankB = difficultyRanks[b.difficulty] || 3;
          const distA = Math.abs(rankA - targetRank);
          const distB = Math.abs(rankB - targetRank);
          if (distA !== distB) return distA - distB;
          return isCorrect ? rankB - rankA : rankA - rankB;
        });

        return [...prevList.slice(0, currentIndex + 1), ...remaining];
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      if (!checkedQuestions[currentQ.id] && selectedAnswers[currentQ.id]) {
        handleCheckSingleQuestion();
      }
      handleSwitchQuestion(currentIndex + 1);
    }
  };

  const toggleHint = (qId: string) => {
    const isShowing = !showHintMap[qId];
    setShowHintMap((prev) => ({
      ...prev,
      [qId]: isShowing,
    }));

    if (isShowing) {
      setQuestionTimings((prev) => ({
        ...prev,
        [qId]: {
          activeSeconds: prev[qId]?.activeSeconds || activeSeconds,
          hintsUsed: (prev[qId]?.hintsUsed || 0) + 1,
          wasChanged: prev[qId]?.wasChanged || false,
        },
      }));
    }
  };

  const handleSubmitAssessment = async () => {
    if (!studentProfile || !currentQ) return;

    // Calculate total active seconds across all questions
    const totalActiveSec = Object.values(questionTimings).reduce(
      (sum, q) => sum + (q.activeSeconds || 0),
      0
    );

    const payload = {
      chapterId: initialChapterId,
      conceptId: initialConceptId,
      studentAnswers: selectedAnswers,
      timeSpentSeconds: totalActiveSec > 0 ? totalActiveSec : 60,
      hintsUsedCount: Object.values(showHintMap).filter(Boolean).length,
      questionTimings,
    };

    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify(payload),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : null;
      if (!res.ok || !data) {
        throw new Error('Server returned invalid or non-JSON response');
      }
      setIsSubmitted(true);
      setSubmissionResult(data);
    } catch (e) {
      console.warn('Network unavailable during submission, queueing offline:', e);
      queueSubmission({
        type: 'assessment',
        endpoint: '/api/assessment/submit',
        payload,
        subject: currentQ?.subject,
        conceptTitle: currentQ?.conceptId,
      });

      // Compute local evaluation so student receives immediate offline pedagogical feedback
      let localCorrectCount = 0;
      const isCorrectMap: Record<string, boolean> = {};
      questions.forEach((q) => {
        const selected = selectedAnswers[q.id];
        const correctChoice = q.choices?.find((c) => c.isCorrect);
        let ok = correctChoice ? correctChoice.id === selected : false;
        if (!correctChoice && q.correctAnswerText) {
          ok = String(selected || '').trim().toLowerCase() === q.correctAnswerText.trim().toLowerCase();
        }
        isCorrectMap[q.id] = ok;
        if (ok) localCorrectCount++;
      });

      setIsSubmitted(true);
      setSubmissionResult({
        score: localCorrectCount,
        totalQuestions: questions.length,
        isCorrectMap,
        needsDiagnosticFollowup: localCorrectCount < questions.length,
        isOfflineQueued: true,
      });
    }
  };

  const getLocalized = (obj: any) => {
    if (!obj) return '';
    return obj[learningLanguage] || obj.en || '';
  };

  const formatAdaptiveBadge = (state?: string) => {
    switch (state) {
      case 'MASTERY_CHALLENGE':
        return { label: 'Mastery Challenge', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'ADVANCED_APPLICATION':
        return { label: 'Advanced Application', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'INDEPENDENT_PRACTICE':
        return { label: 'Independent Practice', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'DEVELOPING_UNDERSTANDING':
        return { label: 'Developing', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'FOUNDATIONAL_SUPPORT':
        return { label: 'Foundational Support', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: 'Adaptive Practice', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-sm text-slate-500">
        Loading adaptive board questions for Class {studentProfile?.classLevel} {studentProfile?.board}...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xs text-center max-w-lg mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Content for this subject is not available yet.
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          No verified practice questions currently match this selected concept for Class {studentProfile?.classLevel} ({studentProfile?.board}). Please select another enrolled subject from your curriculum.
        </p>
      </div>
    );
  }

  const badgeInfo = formatAdaptiveBadge(studentProfile?.adaptiveState);
  const expectedSec = currentQ?.expectedSolvingTimeSeconds || 60;
  const timingRatio = expectedSec > 0 ? activeSeconds / expectedSec : 1;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / Math.max(1, questions.length)) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Shortage Disclosure Note if concept has fewer than 10 verified questions */}
      {questions.length < 10 && (
        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>
              <strong>Verified Question Pool:</strong> {questions.length} authentic questions available for this concept (standard session target is 10). Questions are strictly curriculum-aligned and never synthetically repeated.
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white text-indigo-700 rounded border border-indigo-200">
            {questions.length}/10 Qs
          </span>
        </div>
      )}

      {/* Assessment Header with Adaptive Level & Live Solving Pace */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-full border text-xs font-bold uppercase tracking-wider ${badgeInfo.color}`}
              >
                {badgeInfo.label}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {studentProfile?.board} • Class {studentProfile?.classLevel} • {currentQ?.subject}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="text-xs font-normal text-slate-400 font-mono">
                ({answeredCount}/{questions.length} answered)
              </span>
            </h2>
          </div>

          {/* Live Active Solving Timer & Quick Finish */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <Clock className="w-4 h-4 text-indigo-600" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 font-mono">{activeSeconds}s</span>
                <span className="text-slate-400 text-[10px] ml-1">/ {expectedSec}s target</span>
              </div>
            </div>

            {!isSubmitted && answeredCount > 0 && (
              <button
                onClick={handleSubmitAssessment}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-all flex items-center gap-1"
                title="Finish and evaluate your answers now"
              >
                <span>Finish & Check</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Progress Bar & Question Step Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Session Progress: {progressPercent}%</span>
            <span>{questions.length - answeredCount} remaining</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => handleSwitchQuestion(idx)}
                  className={`min-w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONCEPT DETECTIVE TRIGGER BANNER (Appears if wrong answers are submitted) */}
      {isSubmitted && submissionResult?.needsDiagnosticFollowup && (
        <div className="p-6 bg-amber-500 text-slate-950 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-amber-400 animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                Concept Detective Alert
              </span>
              <h3 className="text-base font-black mt-1">A wrong answer is a clue, not a failure!</h3>
              <p className="text-xs text-slate-900 font-medium mt-0.5 max-w-xl">
                Concept Detective detected an error pattern. Let's investigate whether this is a calculation slip, a
                misconception, or a missing prerequisite.
              </p>
            </div>
          </div>

          <button
            onClick={() => onLaunchDetective(initialConceptId, initialChapterId)}
            className="px-6 py-3 rounded-xl bg-slate-950 text-white font-extrabold text-xs shadow-md hover:bg-slate-900 transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Investigate with Concept Detective</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Offline Queued Notice */}
      {isSubmitted && submissionResult?.isOfflineQueued && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900 shadow-xs">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block">Offline Mode: Answers Stored & Evaluated Locally</span>
            Your practice answers are safely cached on this device and queued for automatic synchronization with your teacher when you reconnect.
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Difficulty: {currentQ.difficulty} • Skill: {currentQ.cognitiveSkill}
              </span>
              {questionTimings[currentQ.id]?.wasChanged && (
                <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md font-semibold">
                  Answer Revised
                </span>
              )}
            </div>

            <button
              onClick={() => toggleHint(currentQ.id)}
              className="px-3 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHintMap[currentQ.id] ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
          </div>

          {/* Hint Drawer */}
          {showHintMap[currentQ.id] && (
            <div className="mb-4 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Scaffolded Clue:</strong>
                {getLocalized(currentQ.hint)}
              </div>
            </div>
          )}

          {/* Question Prompt */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {getLocalized(currentQ.prompt)}
          </h3>
        </div>

        {/* Options List or Non-MCQ Input */}
        {currentQ.choices && currentQ.choices.length > 0 ? (
          <div className="space-y-3">
            {currentQ.choices.map((c) => {
              const isSelected = selectedAnswers[currentQ.id] === c.id;
              const isChecked = checkedQuestions[currentQ.id] !== undefined;
              let optionStyles = 'border-slate-200 hover:border-indigo-400 bg-white text-slate-800';

              if (isSubmitted || isChecked) {
                if (c.isCorrect) {
                  optionStyles = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold';
                } else if (isSelected && !c.isCorrect) {
                  optionStyles = 'border-red-500 bg-red-50/70 text-red-950 font-semibold';
                } else {
                  optionStyles = 'border-slate-200 opacity-60 text-slate-500';
                }
              } else if (isSelected) {
                optionStyles = 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-xs';
              }

              return (
                <div
                  key={c.id}
                  onClick={() => !isChecked && handleSelectOption(c.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${optionStyles}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 text-slate-500'
                      }`}
                    >
                      {c.id.slice(-1).toUpperCase()}
                    </span>
                    <span className="text-sm">{getLocalized(c.text)}</span>
                  </div>

                  {(isSubmitted || isChecked) && c.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {(isSubmitted || isChecked) && isSelected && !c.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              {currentQ.questionType === 'numerical' ? 'Enter Numerical Answer:' : 'Type Your Answer:'}
            </label>
            <input
              type={currentQ.questionType === 'numerical' ? 'number' : 'text'}
              step="any"
              disabled={isSubmitted || checkedQuestions[currentQ.id] !== undefined}
              value={selectedAnswers[currentQ.id] || ''}
              onChange={(e) => handleSelectOption(e.target.value)}
              placeholder={currentQ.questionType === 'numerical' ? 'e.g. 12' : 'Type exact value...'}
              className="w-full p-3.5 border-2 rounded-xl text-sm border-slate-300 focus:border-indigo-600 focus:outline-none"
            />
            {isSubmitted && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <span>
                  <strong>Correct Answer:</strong> {currentQ.correctAnswerText || 'See explanation below'}
                </span>
                {submissionResult?.isCorrectMap?.[currentQ.id] ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Needs Review
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Live Instant Misconception Feedback & Adaptive Difficulty Adjustment */}
        {checkedQuestions[currentQ.id] && (
          <div className="pt-2 animate-in fade-in">
            {checkedQuestions[currentQ.id].isCorrect ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct! Concept Mastered</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    Bloom's Step-Up ⬆️
                  </span>
                </div>
                <p className="text-xs text-emerald-950">
                  Great precision! Adaptive Engine has stepped up the difficulty for your upcoming questions so you can test higher-order application skills.
                </p>
              </div>
            ) : (
              <div className="p-5 bg-amber-50/90 border-2 border-amber-300 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-black uppercase tracking-wider">
                        Concept Detective Gap Identified
                      </span>
                      <h4 className="text-xs font-bold text-amber-950 mt-0.5">
                        {checkedQuestions[currentQ.id].errorType}: {checkedQuestions[currentQ.id].misconceptionTag || 'Procedural Trap'}
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold shrink-0 flex items-center gap-1">
                    Adaptive Adjustment: Scaffolded Question Next ⬇️
                  </span>
                </div>

                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {checkedQuestions[currentQ.id].gapExplanation}
                </p>

                <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-slate-800">
                  <strong className="block text-slate-900 mb-0.5">Core Rule Reminder:</strong>
                  {getLocalized(currentQ.explanation)}
                </div>

                {consecutiveWrongCount >= 2 && (
                  <button
                    type="button"
                    onClick={() => onLaunchDetective(initialConceptId, initialChapterId)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Investigate with Concept Detective (2-4 Diagnostic Probes)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Post-Submission Explanation */}
        {isSubmitted && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">
              Official Explanation:
            </span>
            <p>{getLocalized(currentQ.explanation)}</p>
          </div>
        )}

        {/* Footer Navigation & Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => handleSwitchQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {!isSubmitted && !checkedQuestions[currentQ.id] && selectedAnswers[currentQ.id] && (
              <button
                onClick={handleCheckSingleQuestion}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                title="Identify gap immediately and adapt next question"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Check & Adapt</span>
              </button>
            )}

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => handleNextQuestion()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : !isSubmitted ? (
              <button
                onClick={handleSubmitAssessment}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
              >
                <span>Submit & Check All</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedAnswers({});
                  setCheckedQuestions({});
                  setCurrentIndex(0);
                  setActiveSeconds(0);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Questions</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive Post-Session Performance & Diagnostic Summary Card */}
      {isSubmitted && submissionResult && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Practice Session Assessment Results
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Score: {submissionResult.score} / {questions.length} (
                {Math.round((submissionResult.score / Math.max(1, questions.length)) * 100)}%)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  submissionResult.score === questions.length
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : submissionResult.score >= questions.length * 0.7
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {submissionResult.score === questions.length
                  ? 'Mastery Achieved'
                  : submissionResult.score >= questions.length * 0.7
                  ? 'Proficient'
                  : 'Diagnostic Review Recommended'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mastered Competencies */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Demonstrated Strengths
              </span>
              <ul className="text-xs text-slate-700 space-y-1.5 pl-4 list-disc">
                {questions
                  .filter((q) => submissionResult.isCorrectMap?.[q.id])
                  .map((q) => (
                    <li key={q.id}>
                      <span className="font-semibold text-slate-900">{q.cognitiveSkill} Level ({q.difficulty}):</span>{' '}
                      {q.learningOutcome || getLocalized(q.prompt).slice(0, 70) + '...'}
                    </li>
                  ))}
                {submissionResult.score === 0 && (
                  <li className="text-slate-400 italic">None in this session. Take time to study core rules in the Learn tab!</li>
                )}
              </ul>
            </div>

            {/* Identified Traps / Weak Areas */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Identified Learning Traps
              </span>
              <ul className="text-xs text-slate-700 space-y-1.5 pl-4 list-disc">
                {questions
                  .filter((q) => !submissionResult.isCorrectMap?.[q.id])
                  .map((q) => (
                    <li key={q.id}>
                      <span className="font-semibold text-slate-900">Difficulty Slip ({q.difficulty}):</span>{' '}
                      {q.misconceptionTags?.join(', ') || 'Procedural calculation or distinction gap'}
                    </li>
                  ))}
                {submissionResult.score === questions.length && (
                  <li className="text-emerald-700 font-semibold">Zero misconceptions detected. Excellent precision!</li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recommended Next Path:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {submissionResult.needsDiagnosticFollowup && (
                <button
                  onClick={() => onLaunchDetective(initialConceptId, initialChapterId)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Investigate with Concept Detective</span>
                </button>
              )}
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedAnswers({});
                  setCurrentIndex(0);
                  setActiveSeconds(0);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Another Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
