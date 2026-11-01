/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  BarChart2,
  Clock,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, RetestRecord } from '../../types';

interface RetestPageProps {
  conceptId?: string;
  chapterId?: string;
  onReturnDashboard: () => void;
  onNavigateRecovery?: (activityId?: string) => void;
}

export const RetestPage: React.FC<RetestPageProps> = ({
  conceptId = 'con_cbse8_m1_c3',
  chapterId = 'ch_cbse8_math_fractions',
  onReturnDashboard,
  onNavigateRecovery,
}) => {
  const { studentProfile, user } = useAuth();
  const { learningLanguage, t } = useLanguage();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [retestResult, setRetestResult] = useState<RetestRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [retestTimer, setRetestTimer] = useState(0);
  const [masteryBlocked, setMasteryBlocked] = useState<{
    message: string;
    activityId?: string;
    conceptTitle?: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Retest stopwatch
  useEffect(() => {
    if (isSubmitted || loading || questions.length === 0 || masteryBlocked) return;
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setRetestTimer((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, loading, questions.length, masteryBlocked]);

  // Load fresh retest questions
  useEffect(() => {
    if (!studentProfile) return;
    if (!conceptId) {
      setQuestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setSubmitError(null);
    fetch(`/api/retest/questions/${encodeURIComponent(conceptId)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then(async (res) => {
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await res.json() : null;
        if (res.status === 403 || data?.masteryCheckRequired) {
          setMasteryBlocked({
            message: data?.error || 'Mastery check required before attempting fresh retest.',
            activityId: data?.activityId,
            conceptTitle: data?.conceptTitle,
          });
          setQuestions([]);
          return [];
        }
        setMasteryBlocked(null);
        return Array.isArray(data) ? data : [];
      })
      .then((data) => {
        setQuestions(data);
        setRetestTimer(0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [conceptId, studentProfile]);

  const handleSelect = (qId: string, choiceId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: choiceId,
    });
  };

  const handleSubmitRetest = async () => {
    if (!studentProfile || questions.length === 0) return;
    setSubmitError(null);

    try {
      const res = await fetch('/api/retest/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify({
          conceptId,
          chapterId,
          retestAnswers: selectedAnswers,
          retestTimeSeconds: retestTimer > 0 ? retestTimer : 45,
        }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : null;

      if (res.status === 403 || data?.masteryCheckRequired) {
        setSubmitError(
          data?.error ||
            'Stage 4 Mastery Check must be successfully passed in Smart Recovery before submitting a fresh retest.'
        );
        setMasteryBlocked({
          message: data?.error || 'Mastery check required before fresh retest',
          activityId: data?.activityId,
          conceptTitle: data?.conceptTitle,
        });
        return;
      }

      if (data && data.retestRecord) {
        setRetestResult(data.retestRecord);
        setIsSubmitted(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error('Failed to submit fresh retest:', e);
      setSubmitError('Failed to submit retest. Please check your network and try again.');
    }
  };

  const getLocalized = (obj: any) => {
    if (!obj) return '';
    return obj[learningLanguage] || obj.en || '';
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-sm text-slate-500">
        Generating fresh retest questions for Class {studentProfile?.classLevel} {studentProfile?.board}...
      </div>
    );
  }

  if (masteryBlocked) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Mastery Gate Active • Prerequisite Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mastery Check Required Before Fresh Retest
          </h1>
          <p className="mt-2 text-sm text-amber-100 max-w-xl leading-relaxed">
            {user?.name ? `${user.name}, to` : 'To'} ensure authentic understanding and avoid guessing, students must review prerequisite foundations in Smart Recovery and successfully pass the Stage 4 Mastery Check before taking a fresh retest.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-800 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-amber-950">
                {masteryBlocked.conceptTitle || 'Concept Recovery in Progress'}
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                {masteryBlocked.message}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              How to unlock your fresh retest:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">1</span>
                  <span>Investigate Clues</span>
                </div>
                <p className="text-slate-500 text-[11px]">Inspect Concept Detective report and identify misconception tags.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black">2</span>
                  <span>Smart Recovery</span>
                </div>
                <p className="text-slate-500 text-[11px]">Walk through prerequisite bridges and multi-stage guided steps.</p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-black">3</span>
                  <span>Stage 4 Check</span>
                </div>
                <p className="text-amber-800 text-[11px]">Pass the mastery check question to earn verified retest eligibility.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={onReturnDashboard}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
            >
              Back to Dashboard
            </button>

            {onNavigateRecovery && (
              <button
                onClick={() => onNavigateRecovery(masteryBlocked.activityId)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Go to Smart Recovery & Mastery Check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {submitError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span>Class {studentProfile?.classLevel} {studentProfile?.board} • Fresh Retest Assessment</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Verify Concept Recovery</h1>
          <p className="mt-2 text-sm text-emerald-100 max-w-xl leading-relaxed">
            These questions test the exact recovered concept using fresh scenarios with zero repetition.
          </p>
        </div>

        {!isSubmitted && (
          <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">Retest Timer</span>
            <span className="text-2xl font-black font-mono">{retestTimer}s</span>
          </div>
        )}
      </div>

      {/* Before & After Performance Comparison Card (When Submitted) */}
      {isSubmitted && retestResult && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                {retestResult.outcome}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Before & After Performance & Pacing Evidence
              </h2>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Synchronized with Teacher Dashboard</span>
            </div>
          </div>

          {/* Score & Time Comparison Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Original Assessment
              </span>
              <div className="text-2xl font-black text-red-600 mt-1">
                {retestResult.originalScore} / {retestResult.originalTotal}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Time taken: <span className="font-semibold">{retestResult.originalTimeSeconds || 60}s</span>
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Smart Recovery Activity
              </span>
              <div className="text-sm font-black text-blue-900 mt-2">Completed 100%</div>
              <p className="text-[11px] text-blue-700 mt-1">Targeted remediation & hints</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Fresh Retest Score & Pace
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {retestResult.retestScore} / {retestResult.retestTotal}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                Time: {retestResult.retestTimeSeconds || retestTimer}s • +{retestResult.improvementDelta} marks
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <strong className="block text-slate-900 font-bold uppercase tracking-wider">
              Diagnostic Trail Summary:
            </strong>
            <p>{retestResult.beforeAfterSummary}</p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onReturnDashboard}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Retest Questions List */}
      {!isSubmitted && (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider flex-wrap gap-2">
                <span>Retest Question {idx + 1}</span>
                <span className="text-emerald-700 font-mono">
                  {q.board} Class {q.classLevel} • {q.subject}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">{getLocalized(q.prompt)}</h3>

              {q.choices && q.choices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.choices.map((c) => {
                    const isSelected = selectedAnswers[q.id] === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelect(q.id, c.id)}
                        className={`p-4 rounded-xl border-2 text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                            : 'border-slate-200 bg-white hover:border-emerald-400 text-slate-800'
                        }`}
                      >
                        <span>{getLocalized(c.text)}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type={q.questionType === 'numerical' ? 'number' : 'text'}
                    value={selectedAnswers[q.id] || ''}
                    onChange={(e) => handleSelect(q.id, e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full p-3.5 border-2 rounded-xl text-sm border-slate-300 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmitRetest}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Submit Retest & Synchronize Teacher Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
