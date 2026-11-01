/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../../types';

export const StudentProfilePage: React.FC = () => {
  const { user, studentProfile, updateLanguagePreferences } = useAuth();
  const { interfaceLanguage, learningLanguage, setInterfaceLanguage, setLearningLanguage } = useLanguage();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = async () => {
    await updateLanguagePreferences(interfaceLanguage, learningLanguage);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Student Profile & Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your verified school enrollment data and language preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Language preferences saved successfully and synchronized with server.</span>
        </div>
      )}

      {/* Account Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Enrolled Student Credentials
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Full Name</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">{user?.name}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Student ID</span>
            <span className="font-mono font-bold text-indigo-600 text-sm mt-0.5 block">{studentProfile?.studentId}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Affiliated School</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">{user?.school}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Board & Class</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {studentProfile?.board} • Class {studentProfile?.classLevel}-{studentProfile?.section}
            </span>
          </div>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Multilingual Learning Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Interface Language (UI Buttons & Navigation)
            </label>
            <select
              value={interfaceLanguage}
              onChange={(e) => setInterfaceLanguage(e.target.value as LanguageCode)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Learning Content Language (Lessons & Explanations)
            </label>
            <select
              value={learningLanguage}
              onChange={(e) => setLearningLanguage(e.target.value as LanguageCode)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          Save Language Preferences
        </button>
      </div>
    </div>
  );
};
