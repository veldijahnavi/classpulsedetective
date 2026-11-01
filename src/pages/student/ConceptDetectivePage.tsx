/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { DiagnosticEvidence, MasteryStatus } from '../../types';

interface ConceptDetectivePageProps {
  conceptId?: string;
  chapterId?: string;
  onLaunchRecovery: (activityId: string) => void;
}

export const ConceptDetectivePage: React.FC<ConceptDetectivePageProps> = ({
  conceptId = 'con_cbse8_m1_c3',
  chapterId = 'ch_cbse8_math_fractions',
  onLaunchRecovery,
}) => {
  const { studentProfile } = useAuth();
  const { t } = useLanguage();

  const [evidence, setEvidence] = useState<DiagnosticEvidence | null>(null);
  const [followUpProbes, setFollowUpProbes] = useState<any[]>([]);
  const [probeAnswers, setProbeAnswers] = useState<Record<string, string>>({});
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load investigation details
  useEffect(() => {
    if (!studentProfile) return;
    setLoading(true);
    const targetUrl = conceptId
      ? `/api/detective/investigation/${studentProfile.userId}/${encodeURIComponent(conceptId)}`
      : `/api/detective/investigation/${studentProfile.userId}`;

    fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (data) {
          setEvidence(data.evidence);
          setFollowUpProbes(data.followUpProbes || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [conceptId, studentProfile]);

  const handleProbeOptionSelect = (probeId: string, option: string) => {
    setProbeAnswers({
      ...probeAnswers,
      [probeId]: option,
    });
  };

  const handleSynthesizeDiagnosis = async () => {
    if (!evidence) return;
    setIsInvestigating(true);

    try {
      const res = await fetch('/api/detective/submit-followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify({
          diagnosticId: evidence.id,
          conceptId: evidence.conceptId,
          probeAnswers,
        }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : null;
      if (data && data.diagnosis) {
        setEvidence(data.diagnosis);
      }
    } catch (e) {
      console.error('Failed to submit investigative probe:', e);
    } finally {
      setIsInvestigating(false);
    }
  };

  const getStatusBadge = (status: MasteryStatus) => {
    switch (status) {
      case 'PREREQUISITE_GAP':
        return {
          bg: 'bg-red-100 text-red-800 border-red-200',
          label: 'Likely Prerequisite Gap',
        };
      case 'POSSIBLE_MISCONCEPTION':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Possible Misconception',
        };
      case 'PRACTICING':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Procedural Slip / Routine Practice',
        };
      case 'STRONG_UNDERSTANDING':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Strong Understanding',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          label: 'Investigation In Progress',
        };
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-sm text-slate-500">
        Concept Detective is assembling clues for Class {studentProfile?.classLevel} {studentProfile?.board}...
      </div>
    );
  }

  const badge = getStatusBadge(evidence?.concludedStatus || 'INSUFFICIENT_EVIDENCE');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold w-fit mb-3">
          <Search className="w-3.5 h-3.5" />
          <span>The Concept Detective Investigation Unit</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Investigating the Root Cause of Difficulty
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
          A wrong answer is never treated as a final failure. It is an investigative clue. Concept Detective asks targeted follow-up questions to distinguish missing prerequisites from conceptual misconceptions.
        </p>
      </div>

      {/* Concept Being Tested & Clue Summary Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Concept Being Tested:
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">
              {evidence?.topicTitle || evidence?.conceptId} ({evidence?.subject || 'Science'})
            </h2>
            {evidence?.learningOutcome && (
              <p className="text-xs text-indigo-700 font-medium mt-0.5">
                Target Competency: {evidence.learningOutcome}
              </p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${badge.bg}`}>
            {badge.label}
          </span>
        </div>

        {/* Single Mistake vs Repeated Mistakes Notice */}
        {evidence?.isSingleMistake ? (
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-950">
            <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-blue-900">
                Single Mistake Observed — No Learning Gap Declared Yet
              </strong>
              <p className="mt-0.5 leading-relaxed">
                Concept Detective operates with strict pedagogical rigor: <strong>we never declare a learning gap based on just one wrong answer</strong>. It could be a simple reading slip or calculation transposition. Answer the diagnostic follow-up probes below to test your true conceptual foundations!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-amber-900">
                Repeated Difficulty Pattern Detected ({evidence?.repeatedMistakesCount || 2} Occurrences)
              </strong>
              <p className="mt-0.5 leading-relaxed">
                Multiple mistakes were logged on this concept. Concept Detective has deployed diagnostic follow-up probes below to determine if a foundational prerequisite from earlier grades is missing.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Observed Error Evidence & Distractor Analysis:
          </span>
          <h3 className="text-sm font-semibold text-slate-900">
            {evidence?.primaryObservedDifficulty || 'Careless Calculation or Reading Error'}
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600 pl-4 list-disc">
            {evidence?.errorEvidence.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>

        {/* Detailed Mistake Explanation Breakdown */}
        {evidence?.mistakeExplanation && (
          <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl space-y-1.5">
            <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Mistake Analysis & Distractor Pitfall:</span>
            </span>
            <p className="text-xs text-red-950 leading-relaxed font-medium">
              {evidence.mistakeExplanation}
            </p>
          </div>
        )}

        {/* Learning Gap Analysis */}
        {evidence?.learningGapAnalysis && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Underlying Learning Gap Analysis:</span>
            </span>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {evidence.learningGapAnalysis}
            </p>
          </div>
        )}

        {/* Missing Prerequisites Cards */}
        {evidence?.missingPrerequisites && evidence.missingPrerequisites.length > 0 && (
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2.5">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Missing Prerequisite Foundations:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {evidence.missingPrerequisites.map((prereq, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                    <span>{prereq.title}</span>
                    {prereq.classLevel && (
                      <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[10px]">
                        {prereq.classLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {prereq.whyNeeded}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Concept You Need to Improve Callout */}
        {evidence?.identifiedConceptToImprove && evidence.identifiedConceptToImprove !== 'None yet' && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block">
              Concept You Need to Improve:
            </span>
            <div className="text-sm font-extrabold text-indigo-950">
              {evidence.identifiedConceptToImprove}
            </div>
          </div>
        )}
      </div>

      {/* Targeted Diagnostic Probes */}
      {followUpProbes.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Diagnostic Follow-Up Questions (Investigative Probes)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Answer these targeted questions to isolate whether this was an isolated slip, a core misconception, or a missing prerequisite.
            </p>
          </div>

          <div className="space-y-5">
            {followUpProbes.map((probe, idx) => (
              <div key={probe.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-wrap gap-2">
                  <span>Probe {idx + 1} ({probe.probeType === 'PREREQUISITE' ? 'Prerequisite Sub-Skill' : 'Conceptual Understanding'})</span>
                  <span className="text-indigo-600 font-medium font-mono">{probe.testedSubSkill}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{probe.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {probe.options.map((opt: string) => {
                    const isSelected = probeAnswers[probe.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleProbeOptionSelect(probe.id, opt)}
                        className={`p-3 text-xs rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSynthesizeDiagnosis}
              disabled={isInvestigating || Object.keys(probeAnswers).length < followUpProbes.length}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              {isInvestigating ? (
                'Synthesizing Diagnosis...'
              ) : (
                <>
                  <span>Evaluate Clues & Conclude Diagnosis</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Synthesized Diagnosis & Recommendation Card */}
      {evidence && evidence.concludedStatus !== 'INSUFFICIENT_EVIDENCE' && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-black tracking-tight">
              Detective Conclusion: {evidence.primaryObservedDifficulty}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
            {evidence.diagnosticExplanation}
          </p>

          {evidence.recommendedActions && evidence.recommendedActions.length > 0 && (
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Recommended Action Plan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {evidence.recommendedActions.map((action, aIdx) => (
                  <div key={aIdx} className="p-3 bg-white/90 rounded-xl border border-emerald-200 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-mono shrink-0">
                        {aIdx + 1}
                      </span>
                      <span>{action.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-5.5 leading-snug">
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Recommended Action:
              </span>
              <span className="text-sm font-black text-slate-900">
                {evidence.recommendedRecoveryType} Module
              </span>
            </div>

            <button
              onClick={() => onLaunchRecovery(evidence.recommendedActivityId || 'rec_frac_lcm_bridge')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Launch Smart Recovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
