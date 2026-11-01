/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  School,
  Lock,
  User as UserIcon,
  Globe,
} from 'lucide-react';
import { BoardType, ClassLevel, MediumType, LanguageCode } from '../../types';

export const LoginView: React.FC = () => {
  const { portal, selectPortal, login, registerStudent, error: authError } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Demo accounts fetched from backend
  const [demoAccounts, setDemoAccounts] = useState<{
    students: Array<any>;
    teachers: Array<any>;
  }>({ students: [], teachers: [] });

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regLoginId, setRegLoginId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBoard, setRegBoard] = useState<BoardType>('CBSE');
  const [regClass, setRegClass] = useState<ClassLevel>('8');
  const [regSection, setRegSection] = useState('A');
  const [regMedium, setRegMedium] = useState<MediumType>('English');
  const [regSchool, setRegSchool] = useState('Delhi Public School / Model High School');
  const [regIfLang, setRegIfLang] = useState<LanguageCode>('en');
  const [regLrnLang, setRegLrnLang] = useState<LanguageCode>('en');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotLoginId, setForgotLoginId] = useState('');
  const [forgotKey, setForgotKey] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Demo switcher filter states
  const [demoBoardFilter, setDemoBoardFilter] = useState<'all' | 'CBSE' | 'TELANGANA_SSC' | 'CISCE'>('all');
  const [demoSearch, setDemoSearch] = useState('');

  useEffect(() => {
    fetch('/api/demo-accounts')
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (data && (data.students || data.teachers)) {
          setDemoAccounts(data);
        }
      })
      .catch((err) => console.error('Failed to load demo credentials:', err));
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password || !portal) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const success = await login(loginId, password, portal);
    setIsSubmitting(false);

    if (!success && authError) {
      setErrorMessage(authError);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const success = await registerStudent({
      name: regName,
      loginId: regLoginId,
      password: regPassword,
      board: regBoard,
      classLevel: regClass,
      section: regSection,
      medium: regMedium,
      school: regSchool,
      interfaceLanguage: regIfLang,
      learningLanguage: regLrnLang,
    });

    setIsSubmitting(false);
    if (!success && authError) {
      setErrorMessage(authError);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: forgotLoginId, securityKey: forgotKey }),
      });
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : {};
      if (res.ok) {
        setForgotSuccess(data.message || 'Password reset link generated.');
      } else {
        setForgotError(data.error || 'Failed to reset password.');
      }
    } catch (e: any) {
      setForgotError(e.message || 'Network error.');
    }
  };

  const fillCredentials = (id: string, pw: string) => {
    setLoginId(id);
    setPassword(pw);
  };

  // FIRST SCREEN: Show only TWO portals (Student vs Teacher)
  if (!portal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Empowering Indian School Students (Classes 6–10)
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            ClassPulse <span className="text-indigo-400">Detective</span>
          </h1>
          <p className="mt-3 text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Diagnose the gap. Adapt the learning. Empower the teacher.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Aligned with CBSE / NCERT, Telangana SCERT, and CISCE / ICSE syllabuses
          </p>
        </div>

        {/* The Two Portals */}
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Portal 1: Student Portal */}
          <div
            onClick={() => selectPortal('student')}
            className="group relative bg-slate-800/80 hover:bg-slate-800/95 border-2 border-indigo-500/30 hover:border-indigo-500 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="inline-block px-3 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                Student Access
              </div>
              <h2 className="text-2xl font-bold text-white">Student Portal</h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Adaptive board-specific curriculum, interactive concept visualizers, investigative Concept Detective, personalized Smart Recovery, and fresh Retests.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Classes 6 to 10: CBSE, Telangana SSC & CISCE
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  English, Hindi (हिंदी) & Telugu (తెలుగు)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Dedicated Smart Recovery & AI Doubt Solver
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700/60 flex items-center justify-between text-indigo-400 font-semibold text-sm">
              <span>Enter Student Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Portal 2: Teacher Portal */}
          <div
            onClick={() => selectPortal('teacher')}
            className="group relative bg-slate-800/80 hover:bg-slate-800/95 border-2 border-amber-500/30 hover:border-amber-500 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="inline-block px-3 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                Teacher Access
              </div>
              <h2 className="text-2xl font-bold text-white">Teacher Portal</h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Live mastery heatmap, evidence-backed student diagnoses, automatic instructional groups (Support, Practice, Challenge), and the Next 10 Minutes Planner.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Live synchronization with student retest outcomes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Data-driven Learning Radar & CSV reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Clinical teacher overrides & intervention logging
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700/60 flex items-center justify-between text-amber-400 font-semibold text-sm">
              <span>Enter Teacher Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-slate-500">
          Strict role-based isolation. No Parent or Admin portal. Verified secure sessions only.
        </div>
      </div>
    );
  }

  // SECOND SCREEN: Portal-specific Login & Demo Switcher
  const isTeacher = portal === 'teacher';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              isTeacher
                ? 'bg-gradient-to-tr from-amber-600 to-orange-600 shadow-amber-500/20'
                : 'bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-indigo-500/20'
            }`}
          >
            {isTeacher ? <GraduationCap className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isTeacher ? 'Teacher Portal Sign In' : isRegistering ? 'Student Registration' : 'Student Portal Sign In'}
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500">
          {isTeacher
            ? 'Authorized Educator Authentication for Delhi Public School & Telangana Model School'
            : isRegistering
            ? 'Enroll with verified Board, Class (6-10), and language preferences'
            : 'Enter your student credentials to access your personalized adaptive dashboard'}
        </p>

        <div className="mt-2 text-center">
          <button
            onClick={() => selectPortal(null)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
          >
            ← Switch to {isTeacher ? 'Student Portal' : 'Teacher Portal'}
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200">
          {(errorMessage || authError) && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage || authError}</div>
            </div>
          )}

          {!isRegistering ? (
            // LOGIN FORM
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Login ID
                </label>
                <div className="mt-1 relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder={isTeacher ? 'teacher_priya' : 'e.g. rahul.sharma'}
                    className="block w-full pl-9 pr-3 py-2.5 sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mt-1 relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-9 pr-3 py-2.5 sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                    isTeacher
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                  } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    'Verifying Credentials...'
                  ) : (
                    <>
                      <span>Sign In to {isTeacher ? 'Teacher' : 'Student'} Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {!isTeacher && (
                <div className="pt-3 text-center border-t border-slate-100">
                  <span className="text-xs text-slate-500">Don't have an account yet? </span>
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Register as New Student
                  </button>
                </div>
              )}
            </form>
          ) : (
            // REGISTRATION FORM
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Sai Teja"
                  className="mt-1 block w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Login ID</label>
                  <input
                    type="text"
                    required
                    value={regLoginId}
                    onChange={(e) => setRegLoginId(e.target.value)}
                    placeholder="e.g. sai.teja"
                    className="mt-1 block w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="mt-1 block w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Board</label>
                  <select
                    value={regBoard}
                    onChange={(e) => setRegBoard(e.target.value as BoardType)}
                    className="mt-1 block w-full px-2 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="TELANGANA_SSC">Telangana SSC</option>
                    <option value="CISCE">CISCE / ICSE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Class</label>
                  <select
                    value={regClass}
                    onChange={(e) => setRegClass(e.target.value as ClassLevel)}
                    className="mt-1 block w-full px-2 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Section</label>
                  <input
                    type="text"
                    value={regSection}
                    onChange={(e) => setRegSection(e.target.value)}
                    className="mt-1 block w-full px-2 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">UI Language</label>
                  <select
                    value={regIfLang}
                    onChange={(e) => setRegIfLang(e.target.value as LanguageCode)}
                    className="mt-1 block w-full px-2 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Learning Language</label>
                  <select
                    value={regLrnLang}
                    onChange={(e) => setRegLrnLang(e.target.value as LanguageCode)}
                    className="mt-1 block w-full px-2 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">School Name</label>
                <input
                  type="text"
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}

          {/* COMPACT DEMO CREDENTIAL SWITCHER */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Quick Demo Switcher
              </span>
              <span className="text-[11px] text-slate-400">Click to fill</span>
            </div>

            {isTeacher ? (
              <div className="space-y-2">
                {demoAccounts.teachers.map((t) => (
                  <button
                    key={t.userId}
                    type="button"
                    onClick={() => fillCredentials(t.loginId, t.samplePassword)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{t.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Login: <span className="text-amber-700 font-semibold">{t.loginId}</span> | PW: {t.samplePassword}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Assigned: {t.assignedBoards.join(', ')} • Classes 6-10
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded">
                      Use
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* Board filter tabs */}
                <div className="flex gap-1 p-0.5 bg-slate-100 rounded-lg text-[11px] font-semibold">
                  {(['all', 'CBSE', 'TELANGANA_SSC', 'CISCE'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setDemoBoardFilter(b)}
                      className={`flex-1 py-1 rounded-md text-center transition-all ${
                        demoBoardFilter === b
                          ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {b === 'all' ? 'All (18)' : b === 'TELANGANA_SSC' ? 'Telangana (6)' : `${b} (6)`}
                    </button>
                  ))}
                </div>

                {/* Filtered list of all demo students */}
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {demoAccounts.students
                    .filter((s) => demoBoardFilter === 'all' || s.board === demoBoardFilter)
                    .map((s) => (
                      <button
                        key={s.userId}
                        type="button"
                        onClick={() => fillCredentials(s.loginId, s.samplePassword)}
                        className="w-full text-left p-2 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800 truncate">{s.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded font-semibold text-slate-600">
                              {s.board === 'TELANGANA_SSC' ? 'TS' : s.board} Cl.{s.classLevel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate font-mono">
                            {s.loginId} • <span className="text-indigo-600 capitalize">{s.initialProfileType.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded shrink-0">
                          Fill
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Account Recovery</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your student login ID and the authorized school recovery key (default: <span className="font-mono font-bold text-indigo-600">RESET2026</span>) to reset your password.
            </p>

            {forgotSuccess && (
              <div className="mb-3 p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium">
                {forgotSuccess}
              </div>
            )}
            {forgotError && (
              <div className="mb-3 p-2.5 bg-red-50 text-red-800 rounded-lg text-xs font-medium">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700">Login ID</label>
                <input
                  type="text"
                  required
                  value={forgotLoginId}
                  onChange={(e) => setForgotLoginId(e.target.value)}
                  placeholder="e.g. rahul.sharma"
                  className="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700">School Recovery Key</label>
                <input
                  type="text"
                  required
                  value={forgotKey}
                  onChange={(e) => setForgotKey(e.target.value)}
                  placeholder="RESET2026"
                  className="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
