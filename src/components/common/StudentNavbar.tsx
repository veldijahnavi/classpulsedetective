/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LogOut, Globe, CheckCircle2, ShieldCheck, User as UserIcon, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { LanguageCode } from '../../types';
import { useOnlineStatus } from '../../utils/offlineSync';

interface StudentNavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const StudentNavbar: React.FC<StudentNavbarProps> = ({ currentTab, onTabChange }) => {
  const { user, studentProfile, logout } = useAuth();
  const { interfaceLanguage, learningLanguage, setInterfaceLanguage, setLearningLanguage, t } = useLanguage();
  const { isOnline, queuedCount, isSyncing, syncQueue } = useOnlineStatus();

  const boardLabel = studentProfile?.board === 'TELANGANA_SSC' ? 'Telangana SCERT' : studentProfile?.board || 'CBSE';

  const navItems = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'subjects', label: t('my_subjects') },
    { id: 'learn', label: t('learn') },
    { id: 'solve', label: t('solve') },
    { id: 'detective', label: t('concept_detective'), highlight: true },
    { id: 'recovery', label: t('smart_recovery'), highlight: true },
    { id: 'retest', label: t('retest'), highlight: true },
    { id: 'concept-map', label: t('concept_map') },
    { id: 'ai-tutor', label: t('ai_tutor') },
    { id: 'photo-doubt', label: t('photo_doubt') },
    { id: 'resources', label: t('resources') },
    { id: 'assignments', label: t('assignments') },
    { id: 'progress', label: t('progress') },
    { id: 'profile', label: t('profile_settings') },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <span className="font-extrabold text-lg tracking-tight">CP</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                ClassPulse <span className="text-indigo-600">Detective</span>
              </span>
              {isOnline ? (
                <button
                  type="button"
                  onClick={() => syncQueue()}
                  title={queuedCount > 0 ? `Click to sync ${queuedCount} queued items` : 'Connected to server'}
                  className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                    queuedCount > 0
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {isSyncing ? (
                    <RefreshCw className="w-3 h-3 mr-1 text-indigo-600 animate-spin" />
                  ) : (
                    <Wifi className="w-3 h-3 mr-1 text-emerald-600" />
                  )}
                  {queuedCount > 0 ? `Syncing (${queuedCount})` : t('sync_active')}
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                  <WifiOff className="w-3 h-3 mr-1 text-amber-600" />
                  Offline ({queuedCount} Queued)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              {t('app_tagline')}
            </p>
          </div>
        </div>

        {/* Student Context Badges & Controls */}
        <div className="flex items-center gap-3">
          {/* Board & Class Pill */}
          {studentProfile && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-100/90 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{boardLabel}</span>
              <span className="text-slate-300">•</span>
              <span className="text-indigo-600">Class {studentProfile.classLevel}-{studentProfile.section}</span>
            </div>
          )}

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <select
              value={interfaceLanguage}
              onChange={(e) => setInterfaceLanguage(e.target.value as LanguageCode)}
              aria-label="Interface Language"
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en">UI: English</option>
              <option value="hi">UI: हिंदी</option>
              <option value="te">UI: తెలుగు</option>
            </select>
            <span className="text-slate-300">|</span>
            <select
              value={learningLanguage}
              onChange={(e) => setLearningLanguage(e.target.value as LanguageCode)}
              aria-label="Learning Language"
              className="bg-transparent font-medium text-indigo-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en">Content: English</option>
              <option value="hi">Content: हिंदी</option>
              <option value="te">Content: తెలుగు</option>
            </select>
          </div>

          {/* Student Profile & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-slate-500 font-mono">{studentProfile?.studentId}</p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : item.highlight
                  ? 'text-indigo-700 hover:bg-indigo-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.highlight && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
