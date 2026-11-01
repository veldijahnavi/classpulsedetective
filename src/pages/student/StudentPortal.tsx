/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentNavbar } from '../../components/common/StudentNavbar';
import { StudentDashboard } from './StudentDashboard';
import { MySubjectsPage } from './MySubjectsPage';
import { LearnPage } from './LearnPage';
import { SolvePage } from './SolvePage';
import { ConceptDetectivePage } from './ConceptDetectivePage';
import { SmartRecoveryPage } from './SmartRecoveryPage';
import { RetestPage } from './RetestPage';
import { ConceptMapPage } from './ConceptMapPage';
import { AiTutorPage } from './AiTutorPage';
import { PhotoDoubtPage } from './PhotoDoubtPage';
import { ResourceLibraryPage } from './ResourceLibraryPage';
import { StudentAssignmentsPage } from './StudentAssignmentsPage';
import { StudentProgressPage } from './StudentProgressPage';
import { StudentProfilePage } from './StudentProfilePage';
import { BookOpen, Layers, ChevronRight, Sparkles, ArrowRight, X, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'classpulse_student_subject_context';

export const StudentPortal: React.FC = () => {
  const { studentProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [chapters, setChapters] = useState<any[]>([]);

  // Persistent Active Subject Context
  const [activeSubject, setActiveSubject] = useState<string>('');
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [activeConceptId, setActiveConceptId] = useState<string>('');
  const [activeActivityId, setActiveActivityId] = useState<string>('');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Load official curriculum chapters for the student's exact board & class
  useEffect(() => {
    if (!studentProfile) return;

    fetch(`/api/curriculum/chapters?board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`)
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        setChapters(data);

        // Try restoring from localStorage if matching this board/class
        let restored = false;
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            const foundCh = data.find((c) => c.id === parsed.chapterId);
            if (foundCh) {
              setActiveSubject(foundCh.subject);
              setActiveChapterId(foundCh.id);
              const foundCon = foundCh.concepts.find((con: any) => con.id === parsed.conceptId);
              setActiveConceptId(foundCon ? foundCon.id : foundCh.concepts[0]?.id || '');
              if (parsed.activityId) setActiveActivityId(parsed.activityId);
              restored = true;
            }
          }
        } catch {
          // ignore parsing error
        }

        // If not restored, pick the first enrolled chapter for this student's class
        if (!restored && data.length > 0) {
          const first = data[0];
          setActiveSubject(first.subject);
          setActiveChapterId(first.id);
          setActiveConceptId(first.concepts[0]?.id || '');
          saveContext(first.subject, first.id, first.concepts[0]?.id || '', '');
        }
      })
      .catch(console.error);
  }, [studentProfile]);

  const saveContext = (subject: string, chapterId: string, conceptId: string, activityId: string) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ subject, chapterId, conceptId, activityId, studentId: studentProfile?.userId })
      );
    } catch {
      // ignore storage error
    }
  };

  const handleNavigate = (tab: string, meta?: any) => {
    setActiveTab(tab);
    let nextSub = activeSubject;
    let nextCh = activeChapterId;
    let nextCon = activeConceptId;
    let nextAct = activeActivityId;

    if (meta?.chapterId) {
      nextCh = meta.chapterId;
      const ch = chapters.find((c) => c.id === meta.chapterId);
      if (ch) {
        nextSub = ch.subject;
        if (!meta.conceptId && ch.concepts.length > 0) {
          nextCon = ch.concepts[0].id;
        }
      }
    }
    if (meta?.conceptId) nextCon = meta.conceptId;
    if (meta?.activityId) nextAct = meta.activityId;
    if (meta?.subject) nextSub = meta.subject;

    setActiveSubject(nextSub);
    setActiveChapterId(nextCh);
    setActiveConceptId(nextCon);
    setActiveActivityId(nextAct);
    saveContext(nextSub, nextCh, nextCon, nextAct);
  };

  const handleSelectChapterFromModal = (ch: any) => {
    const conId = ch.concepts[0]?.id || '';
    setActiveSubject(ch.subject);
    setActiveChapterId(ch.id);
    setActiveConceptId(conId);
    saveContext(ch.subject, ch.id, conId, activeActivityId);
    setIsSubjectModalOpen(false);
  };

  const currentChapter = chapters.find((c) => c.id === activeChapterId);
  const currentConcept = currentChapter?.concepts?.find((c: any) => c.id === activeConceptId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <StudentNavbar currentTab={activeTab} onTabChange={(tab) => handleNavigate(tab)} />

      {/* Persistent Active Subject & Learning Journey Context Bar */}
      {studentProfile && chapters.length > 0 && (
        <div className="bg-white border-b border-slate-200/90 shadow-2xs py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 flex-wrap text-slate-600">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Active Study Focus:
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold font-mono border border-indigo-100">
                {activeSubject || currentChapter?.subject || 'All Subjects'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="font-semibold text-slate-800 line-clamp-1">
                {currentChapter ? `Ch ${currentChapter.chapterNumber}: ${currentChapter.title}` : 'Select Chapter'}
              </span>
              {currentConcept && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="text-slate-500 line-clamp-1 italic">
                    {currentConcept.title}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsSubjectModalOpen(true)}
                className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Switch Subject / Chapter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <StudentDashboard onNavigate={handleNavigate} />}
        {activeTab === 'subjects' && (
          <MySubjectsPage
            onSelectChapter={(chId) => handleNavigate('learn', { chapterId: chId })}
          />
        )}
        {activeTab === 'learn' && (
          <LearnPage
            initialChapterId={activeChapterId}
            initialConceptId={activeConceptId}
            onNavigateToSolve={(chId, conId) =>
              handleNavigate('solve', { chapterId: chId, conceptId: conId })
            }
          />
        )}
        {activeTab === 'solve' && (
          <SolvePage
            initialChapterId={activeChapterId}
            initialConceptId={activeConceptId}
            onLaunchDetective={(conId, chId) =>
              handleNavigate('detective', { conceptId: conId, chapterId: chId })
            }
          />
        )}
        {activeTab === 'detective' && (
          <ConceptDetectivePage
            conceptId={activeConceptId}
            chapterId={activeChapterId}
            onLaunchRecovery={(actId) => handleNavigate('recovery', { activityId: actId })}
          />
        )}
        {activeTab === 'recovery' && (
          <SmartRecoveryPage
            activityId={activeActivityId}
            onNavigateToRetest={(conId, chId) =>
              handleNavigate('retest', { conceptId: conId, chapterId: chId })
            }
          />
        )}
        {activeTab === 'retest' && (
          <RetestPage
            conceptId={activeConceptId}
            chapterId={activeChapterId}
            onReturnDashboard={() => handleNavigate('dashboard')}
            onNavigateRecovery={(actId) => handleNavigate('recovery', { activityId: actId })}
          />
        )}
        {activeTab === 'concept-map' && (
          <ConceptMapPage
            onNavigateToLearn={(conId) => handleNavigate('learn', { conceptId: conId })}
          />
        )}
        {activeTab === 'ai-tutor' && <AiTutorPage />}
        {activeTab === 'photo-doubt' && <PhotoDoubtPage />}
        {activeTab === 'resources' && <ResourceLibraryPage />}
        {activeTab === 'assignments' && (
          <StudentAssignmentsPage
            onStartPractice={(conId) => handleNavigate('solve', { conceptId: conId })}
          />
        )}
        {activeTab === 'progress' && <StudentProgressPage />}
        {activeTab === 'profile' && <StudentProfilePage />}
      </main>

      {/* Switch Subject Modal */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Select Active Subject & Chapter
                </h3>
                <p className="text-xs text-slate-500">
                  Switch your learning focus for Class {studentProfile?.classLevel} ({studentProfile?.board})
                </p>
              </div>
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chapters.map((ch) => {
                const isCurrent = ch.id === activeChapterId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChapterFromModal(ch)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      isCurrent
                        ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold">
                          {ch.subject}
                        </span>
                        <span className="text-slate-400 text-xs">• Ch {ch.chapterNumber}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{ch.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ch.introduction}</p>
                    </div>

                    <div className="shrink-0 mt-1">
                      {isCurrent ? (
                        <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                          Active
                        </span>
                      ) : (
                        <span className="text-slate-400 hover:text-indigo-600 text-xs font-semibold">
                          Select →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
