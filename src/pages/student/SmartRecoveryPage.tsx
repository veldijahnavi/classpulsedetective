/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Layers,
  Award,
  ChevronRight,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmartRecoveryActivity } from '../../types';

interface SmartRecoveryPageProps {
  activityId?: string;
  onNavigateToRetest: (conceptId: string, chapterId: string) => void;
}

export const SmartRecoveryPage: React.FC<SmartRecoveryPageProps> = ({
  activityId = 'rec_frac_lcm_bridge',
  onNavigateToRetest,
}) => {
  const { studentProfile } = useAuth();
  const { learningLanguage, t } = useLanguage();

  const [activity, setActivity] = useState<SmartRecoveryActivity | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPrereqReviewed, setIsPrereqReviewed] = useState(false);
  const [guidedAnswers, setGuidedAnswers] = useState<Record<string, string>>({});
  const [isEligibleForRetest, setIsEligibleForRetest] = useState(false);
  const [restoredNotification, setRestoredNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load recovery activity & restore saved student progress
  useEffect(() => {
    setLoading(true);
    const targetUrl = activityId ? `/api/recovery/activity/${encodeURIComponent(activityId)}` : '/api/recovery/activity';
    fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (data) {
          const act = data.activity || data;
          setActivity(act);

          if (data.savedAttempt) {
            const saved = data.savedAttempt;
            if (saved.questionsAnswered && Object.keys(saved.questionsAnswered).length > 0) {
              setGuidedAnswers(saved.questionsAnswered);
              const count = Object.keys(saved.questionsAnswered).length;
              setRestoredNotification(`Saved recovery progress restored: ${count} question${count > 1 ? 's' : ''} answered.`);
            }
            if (saved.isPrerequisiteReviewed !== undefined) {
              setIsPrereqReviewed(Boolean(saved.isPrerequisiteReviewed));
            }
            if (saved.eligibleForRetest || saved.isCompleted) {
              setIsEligibleForRetest(true);
            }
            if (saved.completedSteps && saved.completedSteps.length > 0 && act.learningPathway) {
              const lastStep = saved.completedSteps[saved.completedSteps.length - 1];
              const pIdx = act.learningPathway.indexOf(lastStep);
              if (pIdx >= 0) {
                setCurrentStepIndex(Math.min(act.learningPathway.length - 1, pIdx + 1));
              }
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activityId]);

  const handlePrereqReviewedToggle = async () => {
    const nextVal = !isPrereqReviewed;
    setIsPrereqReviewed(nextVal);
    syncProgress({ isPrerequisiteReviewed: nextVal });
  };

  const handleAnswerSelect = (qId: string, choiceId: string) => {
    const nextAnswers = { ...guidedAnswers, [qId]: choiceId };
    setGuidedAnswers(nextAnswers);
    syncProgress({ questionAnswers: nextAnswers });
  };

  const syncProgress = async (delta: any) => {
    if (!activity) return;

    try {
      const res = await fetch('/api/recovery/submit-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify({
          activityId: activity.id,
          completedStep: activity.learningPathway[currentStepIndex],
          ...delta,
        }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : null;
      if (data && data.isEligibleForRetest) {
        setIsEligibleForRetest(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else if (data && data.isEligibleForRetest === false) {
        setIsEligibleForRetest(false);
      }
    } catch (e) {
      console.error('Failed to sync recovery progress:', e);
    }
  };

  const getLocalized = (obj: any) => {
    if (!obj) return '';
    return obj[learningLanguage] || obj.en || '';
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-sm text-slate-500">
        Loading Smart Recovery Engine for Class {studentProfile?.classLevel} {studentProfile?.board}...
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-600">
        Smart Recovery activity could not be loaded.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Recovery Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
          <RotateCcw className="w-3.5 h-3.5 text-blue-300" />
          <span>Smart Recovery Engine • {activity.recoveryType}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {activity.title}
        </h1>
        <p className="mt-2 text-sm text-blue-100 max-w-2xl leading-relaxed">
          {getLocalized(activity.remediationExplanation)}
        </p>

        {restoredNotification && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center gap-2 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{restoredNotification}</span>
          </div>
        )}

        {/* Pathway Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {activity.learningPathway.map((step, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                idx === currentStepIndex
                  ? 'bg-blue-500 text-white font-bold'
                  : 'bg-white/10 text-blue-200'
              }`}
            >
              {idx + 1}. {step}
            </span>
          ))}
        </div>
      </div>

      {/* Concept Teaching Section: Simple Explanation, Worked Example & Hints */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Step 1: Understand the Concept (Explanation & Worked Example)
          </h2>
        </div>

        {/* Simple Explanation */}
        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-1.5 text-xs sm:text-sm text-indigo-950 leading-relaxed">
          <span className="font-bold uppercase tracking-wider text-[11px] text-indigo-900 block">
            Simple Explanation:
          </span>
          <p>{getLocalized(activity.simpleExplanation || activity.remediationExplanation)}</p>
        </div>

        {/* Worked Example */}
        {activity.workedExample && (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Step-by-Step Worked Example</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 font-mono bg-white p-3 rounded-xl border border-slate-200">
              {getLocalized(activity.workedExample.problem)}
            </div>
            <div className="space-y-2 pl-3 border-l-2 border-indigo-300">
              {activity.workedExample.stepByStep.map((st, sIdx) => (
                <div key={sIdx} className="text-xs text-slate-700 leading-relaxed">
                  {getLocalized(st)}
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Final Verified Result:</span>
              <span className="font-bold text-emerald-400">{activity.workedExample.finalAnswer}</span>
            </div>
            {activity.workedExample.keyInsight && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Key Insight: </strong>
                  {getLocalized(activity.workedExample.keyInsight)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Key Hints / Principles */}
        {activity.keyHints && activity.keyHints.length > 0 && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Key Hints to Remember:</span>
            </span>
            <ul className="text-xs text-amber-950 space-y-1 pl-4 list-disc">
              {activity.keyHints.map((kh, i) => (
                <li key={i}>{getLocalized(kh)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Retest Eligibility Checklist Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Step 2: Complete Practice & Mastery Check:
          </span>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
            {activity.completionCriteria.readPrerequisiteRequired && (
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isPrereqReviewed}
                  onChange={handlePrereqReviewedToggle}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span>Prerequisite Foundations Reviewed</span>
              </label>
            )}

            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                  Object.keys(guidedAnswers).length >= activity.completionCriteria.minQuestionsRequired
                    ? 'bg-emerald-600'
                    : 'bg-slate-300'
                }`}
              >
                ✓
              </span>
              <span>
                Graduated Practice Answered ({Object.keys(guidedAnswers).length} / {activity.completionCriteria.minQuestionsRequired})
              </span>
            </div>
          </div>
        </div>

        {isEligibleForRetest ? (
          <button
            onClick={() => onNavigateToRetest(activity.conceptId, activity.chapterId)}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 animate-bounce shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>Mastery Confirmed! Start Fresh Retest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 font-medium">
            Complete the questions below and verify mastery to unlock fresh retest.
          </div>
        )}
      </div>

      {/* Prerequisite Bridge Section */}
      {activity.prerequisiteBridge && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-900">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold">
              Missing Prerequisite Bridge: {activity.prerequisiteBridge.prerequisiteTitle}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-mono p-4 bg-slate-50 rounded-xl border border-slate-200">
            {getLocalized(activity.prerequisiteBridge.bridgeExplanation)}
          </p>
        </div>
      )}

      {/* Graduated Practice Questions (Easier first -> Guided practice -> Gradually harder) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Step 3: Graduated Recovery Practice
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Starts with foundational questions, followed by guided practice and gradually harder application.
          </p>
        </div>

        <div className="space-y-6">
          {activity.guidedPracticeQuestions.map((gq, idx) => {
            const selectedChoiceId = guidedAnswers[gq.id];
            const chosenChoice = gq.choices.find((c) => c.id === selectedChoiceId);

            return (
              <div key={gq.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {idx === 0 ? 'Stage 1: Foundational Check (Easier)' : idx === 1 ? 'Stage 2: Guided Practice' : `Stage ${idx + 1}: Application Drill`}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {gq.difficulty || (idx === 0 ? 'Easy' : 'Moderate')}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900">{getLocalized(gq.prompt)}</p>

                {/* Scaffold Clue */}
                {gq.scaffoldHint && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Scaffold Clue: </strong>
                      {getLocalized(gq.scaffoldHint)}
                    </div>
                  </div>
                )}

                {/* Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {gq.choices.map((c) => {
                    const isSelected = selectedChoiceId === c.id;
                    let choiceClass = 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800';
                    if (isSelected) {
                      if (c.isCorrect) {
                        choiceClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                      } else {
                        choiceClass = 'bg-red-50 border-red-500 text-red-950 font-bold';
                      }
                    }

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleAnswerSelect(gq.id, c.id)}
                        className={`p-3.5 text-xs rounded-xl border-2 text-left transition-all flex items-center justify-between ${choiceClass}`}
                      >
                        <span>{getLocalized(c.text)}</span>
                        {isSelected && c.isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on answer */}
                {chosenChoice && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      chosenChoice.isCorrect
                        ? 'bg-emerald-100/70 text-emerald-950 border border-emerald-300'
                        : 'bg-red-100/70 text-red-950 border border-red-300'
                    }`}
                  >
                    {chosenChoice.isCorrect
                      ? getLocalized(gq.correctExplanation)
                      : 'Not quite! Check the scaffold clue and try again.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage 4: Mastery Check Question */}
      {activity.masteryCheckQuestion && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-indigo-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Stage 4: Final Mastery Check Question
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Mastery Verification
            </span>
          </div>

          <p className="text-sm font-bold text-slate-900">
            {getLocalized(activity.masteryCheckQuestion.prompt)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activity.masteryCheckQuestion.choices.map((c) => {
              const qId = activity.masteryCheckQuestion!.id;
              const isSelected = guidedAnswers[qId] === c.id;
              let choiceClass = 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800';
              if (isSelected) {
                if (c.isCorrect) {
                  choiceClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                } else {
                  choiceClass = 'bg-red-50 border-red-500 text-red-950 font-bold';
                }
              }

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleAnswerSelect(qId, c.id)}
                  className={`p-3.5 text-xs rounded-xl border-2 text-left transition-all flex items-center justify-between ${choiceClass}`}
                >
                  <span>{getLocalized(c.text)}</span>
                  {isSelected && c.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {guidedAnswers[activity.masteryCheckQuestion.id] && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
              {getLocalized(activity.masteryCheckQuestion.correctExplanation)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

