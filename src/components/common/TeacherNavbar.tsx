/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, GraduationCap, RefreshCw, BarChart3, Users, Grid, Compass, Clock, BookOpen, FileSpreadsheet, Timer, Download } from 'lucide-react';

interface TeacherNavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isSyncing?: boolean;
}

export const TeacherNavbar: React.FC<TeacherNavbarProps> = ({ currentTab, onTabChange, isSyncing }) => {
  const { user, teacherProfile, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'roster', label: 'Student Roster', icon: Users },
    { id: 'heatmap', label: 'Mastery Heatmap', icon: Grid, badge: 'Live Evidence' },
    { id: 'analytics', label: 'Question Analytics', icon: Timer, badge: 'Pacing & Times' },
    { id: 'radar', label: 'Learning Radar', icon: Compass },
    { id: 'groups', label: 'Instructional Groups', icon: Users },
    { id: 'planner', label: 'Next 10-Min Planner', icon: Clock, highlight: true },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum & Sources', icon: BookOpen },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            CP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight">
                ClassPulse <span className="text-amber-400">Teacher Portal</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                Live Sync Enabled
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Real-time diagnosis, evidence-backed mastery, and 10-minute intervention orchestration
            </p>
          </div>
        </div>

        {/* Teacher Info & Controls */}
        <div className="flex items-center gap-3">
          {/* Teacher Badges */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 text-xs text-slate-300">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white">{user?.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-mono">CBSE / TS / CISCE (6-10)</span>
          </div>

          {/* Download Full Project ZIP */}
          <a
            href="/assets/aistudio/ClassPulse-Detective-Fixed-Final.zip"
            download="ClassPulse-Detective-Fixed-Final.zip"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
            title="Download the updated verified full project source code"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Code ZIP</span>
          </a>

          {/* Sign Out */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-red-900/40 hover:border-red-700/60 border border-slate-700 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : item.highlight
                  ? 'text-amber-400 hover:bg-slate-800 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && !isActive && (
                <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.2 rounded font-medium border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
