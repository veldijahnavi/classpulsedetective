/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Clock,
  Filter,
  Activity,
  Zap,
  Radio,
  BookOpen,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { BoardType, ClassLevel, LiveStudentActivityEvent } from '../../types';

interface TeacherDashboardProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [selectedBoard, setSelectedBoard] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [summaryData, setSummaryData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Activity Feed State
  const [liveActivities, setLiveActivities] = useState<LiveStudentActivityEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'polling' | 'connecting'>('connecting');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [activityFilter, setActivityFilter] = useState<'All' | 'Struggles' | 'Retests' | 'Recovery'>('All');

  const eventSourceRef = useRef<EventSource | null>(null);

  // Format timestamp
  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return iso;
    }
  };

  const fetchSummary = () => {
    setIsRefreshing(true);
    let url = `/api/teacher/dashboard-summary?`;
    if (selectedClass !== 'All') url += `classLevel=${selectedClass}&`;
    if (selectedBoard !== 'All') url += `board=${selectedBoard}&`;
    if (selectedSection !== 'All') url += `section=${selectedSection}&`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setSummaryData(data);
        if (data.lastSynchronizedAt) {
          setLastSyncTime(formatTime(data.lastSynchronizedAt));
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  const fetchLiveActivities = () => {
    let url = `/api/teacher/live-activities?`;
    if (selectedClass !== 'All') url += `classLevel=${selectedClass}&`;
    if (selectedBoard !== 'All') url += `board=${selectedBoard}&`;
    if (selectedSection !== 'All') url += `section=${selectedSection}&`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.activities) {
          setLiveActivities(data.activities);
        }
        if (data.lastSynchronizedAt) {
          setLastSyncTime(formatTime(data.lastSynchronizedAt));
        }
      })
      .catch(console.error);
  };

  // Connect SSE with automatic polling fallback
  useEffect(() => {
    const token = localStorage.getItem('classpulse_token');
    if (!token) return;

    let sseUrl = `/api/teacher/live-stream?token=${encodeURIComponent(token)}`;
    if (selectedBoard !== 'All') sseUrl += `&board=${selectedBoard}`;
    if (selectedClass !== 'All') sseUrl += `&classLevel=${selectedClass}`;

    // Close any previous stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    let es: EventSource | null = null;
    try {
      es = new EventSource(sseUrl);
      eventSourceRef.current = es;

      es.onopen = () => {
        setConnectionStatus('connected');
        setLastSyncTime(formatTime(new Date().toISOString()));
      };

      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'STREAM_CONNECTED') {
            setConnectionStatus('connected');
          } else if (parsed.activityType) {
            // New student activity event received live!
            setLiveActivities((prev) => [parsed, ...prev.slice(0, 49)]);
            setLastSyncTime(formatTime(new Date().toISOString()));
            // Also refresh summary metrics to keep all counts in sync
            fetchSummary();
          }
        } catch (e) {
          console.error('Error parsing SSE event:', e);
        }
      };

      es.onerror = () => {
        // SSE disconnected or unsupported, fallback to automatic polling
        setConnectionStatus('polling');
      };
    } catch {
      setConnectionStatus('polling');
    }

    // Initial load
    fetchSummary();
    fetchLiveActivities();

    // 5-second automatic polling fallback (guaranteed synchronization even if SSE is blocked)
    const pollInterval = setInterval(() => {
      fetchLiveActivities();
      fetchSummary();
    }, 5000);

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      clearInterval(pollInterval);
    };
  }, [selectedBoard, selectedClass, selectedSection]);

  // Filtered activities
  const filteredActivities = liveActivities.filter((act) => {
    if (activityFilter === 'Struggles') {
      return act.isCorrect === false || act.learningStatus === 'POSSIBLE_MISCONCEPTION' || act.learningStatus === 'PREREQUISITE_GAP';
    }
    if (activityFilter === 'Retests') {
      return act.activityType === 'retest_completed' || act.activityType === 'retest_attempted';
    }
    if (activityFilter === 'Recovery') {
      return act.activityType === 'recovery_completed' || act.activityType === 'recovery_started';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Teacher Welcome & Real-Time Connection Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold mb-3 border border-slate-700">
            {connectionStatus === 'connected' ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-bold">Live Stream Active (SSE)</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300 font-bold">Auto-Polling Active (5s)</span>
              </>
            )}
            <span className="text-slate-400 text-[11px] border-l border-slate-700 pl-2">
              Synced: {lastSyncTime || 'Just now'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Educator Orchestration Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl">
            Welcome, {user?.name}. Real-time student tracking across CBSE, Telangana SSC, and CISCE. Every question attempt, concept gap, and retest updates this dashboard instantly without requiring manual refresh.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Board
            </label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value="All">All Boards</option>
              <option value="CBSE">CBSE</option>
              <option value="TELANGANA_SSC">Telangana SSC</option>
              <option value="CISCE">CISCE / ICSE</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value="All">All Classes</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                fetchSummary();
                fetchLiveActivities();
              }}
              title="Refresh Live Data"
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {summaryData?.totalStudents || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active class roster</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Diagnosed Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            {summaryData?.diagnosticGapsIdentified || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Investigated by Concept Detective</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Recoveries Done</span>
            <RotateCcw className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">
            {summaryData?.recoveriesCompleted || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Completed Smart Recovery modules</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending 10-Min Plans</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {summaryData?.pendingInterventionsCount || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Targeted instructional micro-plans</p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. LIVE STUDENT ACTIVITY FEED (Real-Time Synchronization)  */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Live Student Activity Feed
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {liveActivities.length} events
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Updates instantaneously whenever any student solves questions, encounters misconceptions, or completes recovery.
            </p>
          </div>

          {/* Activity Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
            {(['All', 'Struggles', 'Retests', 'Recovery'] as const).map((filterName) => (
              <button
                key={filterName}
                onClick={() => setActivityFilter(filterName)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activityFilter === filterName
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filterName}
              </button>
            ))}
          </div>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredActivities.map((act) => {
              const isRetest = act.activityType === 'retest_completed';
              const isRecovery = act.activityType === 'recovery_completed' || act.activityType === 'recovery_started';
              const isIncorrect = act.isCorrect === false;

              return (
                <div
                  key={act.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isRetest
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : isIncorrect
                      ? 'bg-rose-50/60 border-rose-200'
                      : isRecovery
                      ? 'bg-blue-50/60 border-blue-200'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">{act.studentName}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {act.studentId}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {act.board} Cl.{act.classLevel}-{act.section}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {act.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTime(act.timestamp)}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-800">
                      {act.chapterTitle && (
                        <span className="text-slate-500 font-normal">{act.chapterTitle} • </span>
                      )}
                      <span>{act.conceptTitle || act.questionPrompt || 'Concept Exploration'}</span>
                    </div>

                    {/* Misconception or diagnostic alert */}
                    {act.misconceptionTag && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold mt-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Misconception Tagged: {act.misconceptionTag}</span>
                      </div>
                    )}
                  </div>

                  {/* Outcome and Timing Badges */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    {/* Time & Pace */}
                    {act.timeSpentSeconds !== undefined && act.timeSpentSeconds > 0 && (
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-500 block">
                          Time Taken
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {act.timeSpentSeconds}s {act.paceCategory ? `(${act.paceCategory.slice(0, 10)})` : ''}
                        </span>
                      </div>
                    )}

                    {/* Result pill */}
                    {isRetest ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-xs flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Retest +{act.improvementDelta || 1}</span>
                      </span>
                    ) : act.isCorrect === true ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Correct</span>
                      </span>
                    ) : act.isCorrect === false ? (
                      <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Gap Detected</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500">
            No student activities logged for current filters. As students practice questions, review lessons, or retest, activity will stream live here.
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. RECENT RETEST SUBMISSIONS STREAM (Clinical Proof Trail)*/}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-base font-bold text-slate-900">
                Verified Retest Improvement Stream
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Before-and-after retest evidence generated after students complete Smart Recovery pathways.
            </p>
          </div>

          <button
            onClick={() => onNavigate('heatmap')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View Mastery Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {summaryData?.recentRetests && summaryData.recentRetests.length > 0 ? (
          <div className="space-y-3">
            {summaryData.recentRetests.map((r: any) => (
              <div
                key={r.id}
                className="p-4 bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold text-slate-900">{r.studentName}</span>
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded text-[10px] font-bold">
                      {r.board} Cl.{r.classLevel}-{r.section}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{r.completedAt}</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium">
                    {r.beforeAfterSummary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Retest Gain
                    </span>
                    <span className="text-sm font-black text-emerald-700 font-mono">
                      {r.originalScore}/{r.originalTotal} → {r.retestScore}/{r.retestTotal}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs">
                    +{r.improvementDelta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
            No recent retest submissions recorded yet. Students completing Smart Recovery retests will appear here in real time.
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. QUICK ACCESS TO KEY TEACHER DECISION TOOLS             */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('heatmap')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
              Live Evidence Grid
            </span>
            <h4 className="text-base font-bold text-slate-900">Mastery Heatmap</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Drill into student rows × concept columns. Click any cell to view raw answers and diagnostic evidence.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 mt-4 flex items-center gap-1">
            Open Heatmap →
          </span>
        </div>

        <div
          onClick={() => onNavigate('planner')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Targeted Interventions
            </span>
            <h4 className="text-base font-bold text-slate-900">Next 10-Min Planner</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Actionable micro-lesson plans derived from actual diagnostic gaps for small-group classroom remediation.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 mt-4 flex items-center gap-1">
            Review Plans →
          </span>
        </div>

        <div
          onClick={() => onNavigate('groups')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Evidence Grouping
            </span>
            <h4 className="text-base font-bold text-slate-900">Instructional Groups</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Support, Practice, and Challenge groups automatically clustered with clinical teacher override support.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-4 flex items-center gap-1">
            Manage Groups →
          </span>
        </div>
      </div>
    </div>
  );
};
