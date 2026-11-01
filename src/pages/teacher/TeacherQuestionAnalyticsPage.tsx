/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Users,
  ChevronDown,
  ChevronUp,
  BarChart2,
  TrendingDown,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { BoardType, ClassLevel } from '../../types';

interface OutlierStudent {
  studentId: string;
  name: string;
  activeSeconds: number;
  expectedSeconds: number;
  isCorrect: boolean;
  paceCategory: string;
  timestamp: string;
}

interface QuestionStat {
  questionId: string;
  prompt: string;
  board: BoardType;
  classLevel: ClassLevel;
  subject: string;
  chapterId: string;
  conceptId: string;
  difficulty: string;
  cognitiveSkill: string;
  expectedSolvingTimeSeconds: number;
  totalAttempts: number;
  correctCount: number;
  accuracy: number;
  averageSolvingTimeSeconds: number;
  medianSolvingTimeSeconds: number;
  timeRatio: number;
  misconceptionsCount: Record<string, number>;
  outliers: OutlierStudent[];
}

export const TeacherQuestionAnalyticsPage: React.FC = () => {
  const [board, setBoard] = useState<string>('CBSE');
  const [classLevel, setClassLevel] = useState<string>('8');
  const [subject, setSubject] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [stats, setStats] = useState<QuestionStat[]>([]);
  const [paceDist, setPaceDist] = useState<any>({
    fastAndAccurate: 0,
    methodical: 0,
    needsGuidance: 0,
    rushing: 0,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let url = `/api/teacher/question-analytics?board=${board}&classLevel=${classLevel}`;
    if (subject !== 'all') url += `&subject=${subject}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setStats(data.questionStats || []);
        setPaceDist(
          data.paceDistribution || {
            fastAndAccurate: 0,
            methodical: 0,
            needsGuidance: 0,
            rushing: 0,
          }
        );
        setTotalRecords(data.totalRecordsCount || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [board, classLevel, subject]);

  const filtered = stats.filter((q) =>
    search ? q.prompt.toLowerCase().includes(search.toLowerCase()) || q.questionId.toLowerCase().includes(search.toLowerCase()) : true
  );

  const getPaceBadge = (ratio: number, accuracy: number) => {
    if (ratio < 0.5 && accuracy < 60) {
      return { label: 'Rushing / Careless', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    }
    if (ratio <= 0.85 && accuracy >= 80) {
      return { label: 'Fast & Accurate', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
    if (ratio > 1.6 || accuracy < 50) {
      return { label: 'Needs Guidance / Slower', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    return { label: 'Methodical & Thorough', color: 'bg-blue-100 text-blue-800 border-blue-200' };
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Question-Level Timing & Pacing Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyze active student solving times vs expected targets, spot conceptual stumbling blocks, and identify rushing habits.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
          >
            <option value="CBSE">CBSE / NCERT</option>
            <option value="TELANGANA_SSC">Telangana SSC</option>
            <option value="CISCE">CISCE / ICSE</option>
          </select>

          <select
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
          >
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Physical Science">Physical Science</option>
            <option value="Biological Science">Biological Science</option>
            <option value="Chemistry">Chemistry</option>
          </select>
        </div>
      </div>

      {/* Pace Distribution Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Fast & Accurate
          </span>
          <div className="text-2xl font-black text-emerald-950 mt-1">
            {paceDist.fastAndAccurate}
          </div>
          <p className="text-[10px] text-emerald-700 mt-0.5">Quick & mastered (&lt; 0.85x target)</p>
        </div>

        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
            Methodical & Thorough
          </span>
          <div className="text-2xl font-black text-blue-950 mt-1">{paceDist.methodical}</div>
          <p className="text-[10px] text-blue-700 mt-0.5">Deliberate pace (0.85x – 1.6x target)</p>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Needs Guidance
          </span>
          <div className="text-2xl font-black text-amber-950 mt-1">{paceDist.needsGuidance}</div>
          <p className="text-[10px] text-amber-700 mt-0.5">Slow or multiple hints (&gt; 1.6x)</p>
        </div>

        <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
            Rushing / Careless
          </span>
          <div className="text-2xl font-black text-rose-950 mt-1">{paceDist.rushing}</div>
          <p className="text-[10px] text-rose-700 mt-0.5">Too fast with mistakes (&lt; 0.4x)</p>
        </div>
      </div>

      {/* Question Table & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Question Performance Breakdown ({filtered.length} Questions)
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by prompt or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold font-mono">
              <tr>
                <th className="py-3 px-4">Question Prompt & Topic</th>
                <th className="py-3 px-3">Difficulty</th>
                <th className="py-3 px-3 text-center">Expected</th>
                <th className="py-3 px-3 text-center">Avg Observed</th>
                <th className="py-3 px-3 text-center">Ratio</th>
                <th className="py-3 px-3 text-center">Accuracy</th>
                <th className="py-3 px-3 text-center">Pace Status</th>
                <th className="py-3 px-4 text-right">Outliers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((q) => {
                const pace = getPaceBadge(q.timeRatio, q.accuracy);
                const isExpanded = expandedQId === q.questionId;

                return (
                  <React.Fragment key={q.questionId}>
                    <tr
                      onClick={() => setExpandedQId(isExpanded ? null : q.questionId)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-slate-900 line-clamp-1">{q.prompt}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{q.subject}</span>
                          <span>•</span>
                          <span>{q.questionId}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                          {q.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-semibold">
                        {q.expectedSolvingTimeSeconds}s
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                        {q.averageSolvingTimeSeconds}s
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-bold">
                        <span
                          className={
                            q.timeRatio > 1.5
                              ? 'text-amber-600'
                              : q.timeRatio < 0.6
                              ? 'text-rose-600'
                              : 'text-emerald-600'
                          }
                        >
                          {q.timeRatio}x
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <div className="font-bold font-mono text-slate-900">{q.accuracy}%</div>
                        <div className="w-12 bg-slate-100 h-1 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className={`h-full ${
                              q.accuracy >= 75
                                ? 'bg-emerald-500'
                                : q.accuracy >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${q.accuracy}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${pace.color}`}
                        >
                          {pace.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {q.outliers.length > 0 ? (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md font-bold text-[10px]">
                              {q.outliers.length} Flagged
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Normal</span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Drawer for Outliers and Misconceptions */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-y border-slate-200">
                        <td colSpan={8} className="p-5 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Flagged Outlier Students */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                              <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                <span>Flagged Student Solving Patterns</span>
                              </h4>

                              {q.outliers.length === 0 ? (
                                <p className="text-xs text-slate-400">
                                  No pacing outliers detected for this question. All students solved within expected bounds.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {q.outliers.map((o, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                                    >
                                      <div>
                                        <span className="font-bold text-slate-900">{o.name}</span>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                          Spent: {o.activeSeconds}s • Expected: {o.expectedSeconds}s
                                        </div>
                                      </div>
                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                          o.paceCategory.includes('Rushing')
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-amber-100 text-amber-800'
                                        }`}
                                      >
                                        {o.paceCategory}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Misconceptions Breakdown */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                              <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                                <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Diagnostic Misconceptions Observed</span>
                              </h4>

                              {Object.keys(q.misconceptionsCount).length === 0 ? (
                                <p className="text-xs text-slate-400">
                                  No recurring error tags recorded for this question yet.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {Object.entries(q.misconceptionsCount).map(([tag, count]) => (
                                    <div
                                      key={tag}
                                      className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-center justify-between text-xs"
                                    >
                                      <span className="font-mono text-indigo-900 font-medium">
                                        {tag.replace(/_/g, ' ')}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-800 font-bold text-[10px]">
                                        {count} students
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
