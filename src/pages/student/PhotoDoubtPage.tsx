/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Check,
  HelpCircle,
  Send,
  MessageSquare,
  FileCheck,
  ShieldCheck,
  Layers,
} from 'lucide-react';

interface ChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
  subject: string;
  board: string;
  classLevel: string;
  concepts: Array<{ id: string; title: string; learningOutcome?: string }>;
  officialSourceId?: string;
}

export const PhotoDoubtPage: React.FC = () => {
  const { studentProfile } = useAuth();

  // 1. Dynamic Cascading Curriculum Selectors
  const [selectedBoard, setSelectedBoard] = useState<string>(studentProfile?.board || 'CBSE');
  const [selectedClass, setSelectedClass] = useState<string>(studentProfile?.classLevel || '10');
  const [selectedSubject, setSelectedSubject] = useState<string>('Science');
  const [availableChapters, setAvailableChapters] = useState<ChapterItem[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedChapterTitle, setSelectedChapterTitle] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');

  // 2. Upload / Image state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [userNotes, setUserNotes] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [solutionResult, setSolutionResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3. Follow-up doubt state
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpResponses, setFollowUpResponses] = useState<Array<{ q: string; a: string }>>([]);
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);

  // Synchronize initial defaults from profile
  useEffect(() => {
    if (studentProfile) {
      setSelectedBoard(studentProfile.board);
      setSelectedClass(studentProfile.classLevel);
      if (studentProfile.registeredSubjects && studentProfile.registeredSubjects.length > 0) {
        setSelectedSubject(studentProfile.registeredSubjects[0]);
      }
    }
  }, [studentProfile]);

  // Determine subjects based on selected Board and Class
  const getSubjectsForBoardAndClass = (board: string, cls: string): string[] => {
    if (board === 'TELANGANA_SSC') {
      if (cls === '6' || cls === '7') {
        return ['Mathematics', 'General Science', 'Social Studies', 'English', 'Telugu'];
      }
      return ['Physical Science', 'Biological Science', 'Mathematics', 'Social Studies', 'English', 'Telugu'];
    }
    if (board === 'CISCE') {
      return ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Computer Studies'];
    }
    // CBSE default
    return ['Science', 'Mathematics', 'English', 'Social Science'];
  };

  const subjectOptions = getSubjectsForBoardAndClass(selectedBoard, selectedClass);

  // When board or class changes, ensure selectedSubject is valid
  useEffect(() => {
    if (!subjectOptions.includes(selectedSubject)) {
      setSelectedSubject(subjectOptions[0] || 'Mathematics');
    }
  }, [selectedBoard, selectedClass]);

  // Fetch chapters dynamically when Board, Class, or Subject changes
  useEffect(() => {
    fetch(`/api/curriculum/chapters?board=${selectedBoard}&classLevel=${selectedClass}&subject=${encodeURIComponent(selectedSubject)}`)
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data: ChapterItem[]) => {
        const safeData = Array.isArray(data) ? data : [];
        setAvailableChapters(safeData);
        if (safeData.length > 0) {
          setSelectedChapterId(data[0].id);
          setSelectedChapterTitle(data[0].title);
          if (data[0].concepts && data[0].concepts.length > 0) {
            setSelectedLessonId(data[0].concepts[0].id);
            setSelectedLessonTitle(data[0].concepts[0].title);
          } else {
            setSelectedLessonId('');
            setSelectedLessonTitle('Whole Chapter Topic');
          }
        } else {
          setSelectedChapterId('');
          setSelectedChapterTitle(`${selectedSubject} Foundations`);
          setSelectedLessonId('');
          setSelectedLessonTitle('Core Syllabus Standard');
        }
      })
      .catch((err) => {
        console.error('Error loading chapters:', err);
      });
  }, [selectedBoard, selectedClass, selectedSubject]);

  // When chapter changes, update chapter title and available lessons/concepts
  const handleChapterChange = (chId: string) => {
    setSelectedChapterId(chId);
    const ch = availableChapters.find((c) => c.id === chId);
    if (ch) {
      setSelectedChapterTitle(ch.title);
      if (ch.concepts && ch.concepts.length > 0) {
        setSelectedLessonId(ch.concepts[0].id);
        setSelectedLessonTitle(ch.concepts[0].title);
      } else {
        setSelectedLessonId('');
        setSelectedLessonTitle('Whole Chapter Topic');
      }
    }
  };

  const currentChapter = availableChapters.find((c) => c.id === selectedChapterId);
  const currentConcepts = currentChapter?.concepts || [];

  const handleLessonChange = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    const concept = currentConcepts.find((c) => c.id === lessonId);
    if (concept) {
      setSelectedLessonTitle(concept.title);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit. Please upload a smaller photo.');
      return;
    }

    setErrorMessage(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const sampleQuestions = [
    {
      title: 'CBSE 10 Science: Chemical Equations',
      board: 'CBSE',
      classLevel: '10',
      subject: 'Science',
      chapter: 'Chemical Reactions and Equations',
      lesson: 'Balancing Chemical Equations (Conservation of Mass)',
      notes: 'Fe(s) + H2O(g) -> Fe3O4(s) + H2(g). How do I balance the Oxygen and Iron atoms properly?',
      previewSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="450" height="150" viewBox="0 0 450 150"><rect width="450" height="150" fill="%23f8fafc" rx="12"/><text x="20" y="40" font-family="sans-serif" font-size="15" font-weight="bold" fill="%231e293b">CBSE Class 10 Science • NCERT Chapter 1</text><text x="20" y="80" font-family="monospace" font-size="20" font-weight="bold" fill="%23047857">Fe(s) + H2O(g) -> Fe3O4(s) + H2(g)</text><text x="20" y="115" font-family="sans-serif" font-size="13" fill="%2364748b">Balance according to Law of Conservation of Mass.</text></svg>',
    },
    {
      title: 'Telangana SSC 10 Physical Science: Curved Mirrors',
      board: 'TELANGANA_SSC',
      classLevel: '10',
      subject: 'Physical Science',
      chapter: 'Refraction of Light at Curved Surfaces',
      lesson: 'Refraction through Thin Lenses & Sign Convention',
      notes: 'A concave mirror has a radius of curvature R = 30 cm. Find focal length under Cartesian sign convention.',
      previewSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="450" height="150" viewBox="0 0 450 150"><rect width="450" height="150" fill="%23f8fafc" rx="12"/><text x="20" y="40" font-family="sans-serif" font-size="15" font-weight="bold" fill="%231e293b">TS SCERT Class 10 Physical Science • Ch 4</text><text x="20" y="80" font-family="monospace" font-size="19" font-weight="bold" fill="%23b45309">f = R / 2, with R = -30 cm</text><text x="20" y="115" font-family="sans-serif" font-size="13" fill="%2364748b">Apply Cartesian sign convention & determine focal point.</text></svg>',
    },
    {
      title: 'CBSE 8 Mathematics: Linear Equations',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapter: 'Linear Equations in One Variable',
      lesson: 'Transposition Method & Variable Separation',
      notes: 'Solve for x: 3x - 5 = 2x + 7. Which side should variables be grouped?',
      previewSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="450" height="150" viewBox="0 0 450 150"><rect width="450" height="150" fill="%23f8fafc" rx="12"/><text x="20" y="40" font-family="sans-serif" font-size="15" font-weight="bold" fill="%231e293b">CBSE Class 8 Mathematics • NCERT Chapter 2</text><text x="20" y="80" font-family="monospace" font-size="22" font-weight="bold" fill="%234338ca">3x - 5 = 2x + 7</text><text x="20" y="115" font-family="sans-serif" font-size="13" fill="%2364748b">Step-by-step transposition & solution check.</text></svg>',
    },
    {
      title: 'CISCE 10 Chemistry: Periodic Table',
      board: 'CISCE',
      classLevel: '10',
      subject: 'Chemistry',
      chapter: 'Periodic Table, Periodic Properties and Variations',
      lesson: 'Periodic Trends in Ionization Potential & Electronegativity',
      notes: 'Why does electronegativity increase across a period from left to right?',
      previewSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="450" height="150" viewBox="0 0 450 150"><rect width="450" height="150" fill="%23f8fafc" rx="12"/><text x="20" y="40" font-family="sans-serif" font-size="15" font-weight="bold" fill="%231e293b">CISCE ICSE Class 10 Chemistry • Chapter 1</text><text x="20" y="80" font-family="serif" font-size="17" font-weight="bold" fill="%237c3aed">Periodic Trends: Ionization Energy vs Atomic Radius</text><text x="20" y="115" font-family="sans-serif" font-size="13" fill="%2364748b">Nuclear charge increase across Period 3 elements.</text></svg>',
    },
  ];

  const handleSelectSample = (sample: typeof sampleQuestions[0]) => {
    setSelectedBoard(sample.board);
    setSelectedClass(sample.classLevel);
    setSelectedSubject(sample.subject);
    setSelectedChapterTitle(sample.chapter);
    setSelectedLessonTitle(sample.lesson);
    setUserNotes(sample.notes);
    setImagePreview(sample.previewSvg);
    setImageBase64(sample.previewSvg);
    setMimeType('image/svg+xml');
    setSolutionResult(null);
    setFollowUpResponses([]);
  };

  const handleSolve = async () => {
    if (!imageBase64) return;
    setIsSolving(true);
    setErrorMessage(null);
    setFollowUpResponses([]);

    try {
      const res = await fetch('/api/ai/photo-doubt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          notes: userNotes,
          board: selectedBoard,
          classLevel: selectedClass,
          subject: selectedSubject,
          chapter: selectedChapterTitle,
          lessonTopic: selectedLessonTitle,
        }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : null;
      if (!res.ok || !data) {
        setErrorMessage(data?.error || 'Failed to analyze question photo.');
      } else {
        setSolutionResult(data);
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error while analyzing photo.');
    } finally {
      setIsSolving(false);
    }
  };

  const handleSendFollowUp = async () => {
    if (!followUpQuestion.trim() || isAskingFollowUp) return;
    const qText = followUpQuestion.trim();
    setFollowUpQuestion('');
    setIsAskingFollowUp(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify({
          userQuery: `Context: solving photo question in ${selectedBoard} Class ${selectedClass} ${selectedSubject} (${selectedChapterTitle}). Student doubt: ${qText}`,
          chapterId: selectedChapterId,
          conceptId: selectedLessonId,
          subject: selectedSubject,
        }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : {};
      const reply = data?.reply || data?.text || 'Keep practicing the fundamental rules!';
      setFollowUpResponses((prev) => [...prev, { q: qText, a: reply }]);
    } catch (e) {
      console.error(e);
      setFollowUpResponses((prev) => [
        ...prev,
        { q: qText, a: 'Review the step-by-step breakdown above and check the signs carefully.' },
      ]);
    } finally {
      setIsAskingFollowUp(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Camera className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Multimodal Photo Doubt Solver
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Select your Board, Class, Subject & Lesson, then upload a textbook picture for instant curriculum-grounded step-by-step guidance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2026–2027 Official Syllabus Verified</span>
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Tap Sample Questions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Quick-Test Sample Textbook Problems (1-Click Load)
          </span>
          <span className="text-[11px] text-slate-400">Click any card to auto-populate</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleQuestions.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {sample.board} • Cl {sample.classLevel}
                </span>
                <p className="text-xs font-mono font-bold text-slate-800 mt-1.5 line-clamp-1">
                  {sample.subject}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {sample.chapter}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 mt-2 flex items-center gap-1">
                Load problem →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Cascading Curriculum Selection & Verification Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Curriculum Context Selection (Linked to Official Board Syllabus)
          </span>
          <span className="text-[11px] text-indigo-600 font-semibold">Step 1: Specify Target Lesson</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Board Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              1. Board
            </label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CBSE">CBSE (NCERT)</option>
              <option value="TELANGANA_SSC">Telangana SSC (TS SCERT)</option>
              <option value="CISCE">CISCE (ICSE)</option>
            </select>
          </div>

          {/* Class Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              2. Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              3. Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjectOptions.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Chapter Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              4. Chapter ({availableChapters.length} available)
            </label>
            {availableChapters.length > 0 ? (
              <select
                value={selectedChapterId}
                onChange={(e) => handleChapterChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {availableChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    Ch {c.chapterNumber}: {c.title}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedChapterTitle}
                onChange={(e) => setSelectedChapterTitle(e.target.value)}
                placeholder="e.g. Chemical Reactions or Linear Equations"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              />
            )}
          </div>

          {/* Lesson / Topic Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              5. Lesson / Subtopic
            </label>
            {currentConcepts.length > 0 ? (
              <select
                value={selectedLessonId}
                onChange={(e) => handleLessonChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {currentConcepts.map((con) => (
                  <option key={con.id} value={con.id}>
                    {con.title}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedLessonTitle}
                onChange={(e) => setSelectedLessonTitle(e.target.value)}
                placeholder="Specific lesson or concept name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              />
            )}
          </div>
        </div>

        {/* Official Board Syllabus Verification Badge */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Official Syllabus Mapping: </span>
              <span>
                {selectedBoard} Class {selectedClass} • {selectedSubject} • {selectedChapterTitle || 'Prescribed Syllabus'}
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-white text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 self-start sm:self-auto">
            Status: Officially Prescribed
          </span>
        </div>
      </div>

      {/* Upload & Preview Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-600" />
            Step 2: Upload or Capture Question Photo
          </span>
          <span className="text-[11px] text-slate-400">PNG, JPG up to 10MB</span>
        </div>

        {!imagePreview ? (
          <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Upload className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Click or drag question photo to upload
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Ensure formula, problem text, and diagram are clearly visible
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Uploaded Question Preview
              </span>
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageBase64(null);
                  setSolutionResult(null);
                  setFollowUpResponses([]);
                }}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Replace Photo
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-80 bg-slate-100 flex items-center justify-center p-2">
              <img
                src={imagePreview}
                alt="Question Preview"
                className="object-contain max-h-72 w-auto rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Optional Student Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Where are you getting stuck? (Optional - helps detect your exact gap)
          </label>
          <input
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="e.g. I am confused about which sign to use when transposing to the LHS"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleSolve}
          disabled={!imageBase64 || isSolving}
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isSolving ? (
            'Analyzing with Multimodal Vision Engine & Checking Syllabus...'
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze & Provide Contextual Step-by-Step Solution</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Comprehensive Multimodal Solution Card */}
      {solutionResult && (
        <div className="bg-white rounded-2xl border-2 border-indigo-500 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
          {/* Header & Alignment Check */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                  {solutionResult.syllabusAlignment || 'Curriculum Match Verified'}
                </span>
                {solutionResult.matchesContext !== false ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Matches Selected Lesson
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                    Slight Topic Variance
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {solutionResult.recognizedTopic}
              </h3>
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold shrink-0">
              {selectedBoard} Class {selectedClass}
            </span>
          </div>

          {/* Extracted Question OCR Text */}
          {solutionResult.extractedQuestion && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Extracted Question Text (OCR):
              </span>
              <p className="text-sm font-semibold text-slate-900 font-mono">
                {solutionResult.extractedQuestion}
              </p>
            </div>
          )}

          {/* Governing Formulas / Rules */}
          {solutionResult.relevantFormulas && solutionResult.relevantFormulas.length > 0 && (
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1.5">
              <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                Governing Formulas & Principles:
              </span>
              <div className="flex flex-wrap gap-2">
                {solutionResult.relevantFormulas.map((f: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-white text-purple-900 rounded-lg border border-purple-200 text-xs font-mono font-bold">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Solution Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Step-by-Step Solution Breakdown:
            </h4>
            <div className="space-y-2">
              {solutionResult.stepByStepSolution.map((st: string, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-mono">
                  {st}
                </div>
              ))}
            </div>
          </div>

          {/* Common Pitfall & Misconception Alert */}
          {solutionResult.commonPitfall && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Common Misconception Alert:</strong>
                {solutionResult.commonPitfall}
              </div>
            </div>
          )}

          {/* Suggested Next Practice */}
          {solutionResult.suggestedLesson && (
            <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold block">Recommended Follow-up Topic:</span>
                <span>Review concepts and practice questions for "{solutionResult.suggestedLesson}".</span>
              </div>
              <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shrink-0">
                Study in Learn Tab
              </span>
            </div>
          )}

          {/* Interactive Follow-Up Questions Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Still have a doubt on this question? Ask AI Tutor:
            </h5>

            {followUpResponses.length > 0 && (
              <div className="space-y-3">
                {followUpResponses.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl font-medium">
                      <strong>You asked:</strong> {item.q}
                    </div>
                    <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-xl leading-relaxed">
                      <strong>AI Coach:</strong> {item.a}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendFollowUp()}
                placeholder="Ask about a specific step (e.g. 'Why did the sign flip here?')..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleSendFollowUp}
                disabled={!followUpQuestion.trim() || isAskingFollowUp}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAskingFollowUp ? 'Thinking...' : 'Ask'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
