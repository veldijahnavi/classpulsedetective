/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  FileText,
  Download,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  Printer,
  X,
  Eye,
  Filter,
  Layers,
} from 'lucide-react';
import { ResourceItem } from '../../types';

export const ResourceLibraryPage: React.FC = () => {
  const { studentProfile } = useAuth();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [activeReadingItem, setActiveReadingItem] = useState<ResourceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentProfile) return;
    fetch(`/api/resources?board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`)
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setResources(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentProfile]);

  const uniqueSubjects = Array.from(new Set(resources.map((r) => r.subject)));

  const filtered = resources.filter((r) => {
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesSub = filterSubject === 'all' || r.subject.toLowerCase() === filterSubject.toLowerCase();
    return matchesType && matchesSub;
  });

  const handleDownloadFile = (item: ResourceItem) => {
    const content = item.contentBody || `# ${item.title}\n\n${item.description}\n\nBoard: ${item.board} | Class: ${item.classLevel} | Subject: ${item.subject}`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Verified Curriculum Resource Library</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official study notes, downloadable practice worksheets, and revision mindmaps for {studentProfile?.board} Class {studentProfile?.classLevel}.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
          >
            <option value="all">All Subjects ({resources.length})</option>
            {uniqueSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-1">
            {['all', 'notes', 'worksheet', 'formula_sheet', 'diagram', 'revision_sheet'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-mono">
                  {res.subject}
                </span>
                <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {res.language.toUpperCase()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{res.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
              <span className="text-slate-400 font-medium text-[11px]">
                {res.durationOrPages || 'Study Material'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveReadingItem(res)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(res)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-800">No resources match the selected filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching the filter to 'All' or a different subject.</p>
        </div>
      )}

      {/* In-App Reading & Printing Modal */}
      {activeReadingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
                    {activeReadingItem.subject} • Class {activeReadingItem.classLevel}
                  </span>
                  <span className="text-xs text-slate-400">{activeReadingItem.durationOrPages}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{activeReadingItem.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadFile(activeReadingItem)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveReadingItem(null)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 font-sans leading-relaxed">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="block text-slate-900 font-bold mb-1">Official Description:</strong>
                {activeReadingItem.description}
              </div>

              <div className="prose prose-slate max-w-none text-xs">
                <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 border-0 text-slate-800 text-xs leading-relaxed">
                  {activeReadingItem.contentBody || 'Full curriculum text notes and worked examples are provided in this module.'}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">ClassPulse Detective Official Educational Asset</span>
              <button
                onClick={() => setActiveReadingItem(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
