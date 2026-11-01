/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bot, Send, Sparkles, User as UserIcon, Lightbulb, Compass, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'grounded_engine';
}

export const AiTutorPage: React.FC = () => {
  const { studentProfile, user } = useAuth();
  const { learningLanguage } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'tutor',
      text: `Hello ${user?.name || 'student'}! I am your ClassPulse AI Learning Coach for Class ${studentProfile?.classLevel || '8'} (${studentProfile?.board || 'CBSE'}). Ask me any doubt about fractions, linear equations, science concepts, or exam preparation!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);

  const samplePrompts = [
    'Explain why 1/2 + 1/3 is NOT 2/5 with cake slices',
    'Why does -9 become +9 when crossing the equals sign?',
    'What is the difference between plant and animal cells?',
    'Give me a step-by-step example of solving 3x - 7 = 14',
  ];

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'student',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsSending(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'student' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
        },
        body: JSON.stringify({
          userQuery: q,
          history,
          chapterId: 'ch_cbse8_math_fractions',
          conceptId: 'con_cbse8_m1_c3',
          subject: 'Mathematics',
        }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : {};
      const tutorMsg: ChatMessage = {
        id: `msg_t_${Date.now()}`,
        sender: 'tutor',
        text: data.text || 'Keep practicing step-by-step!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (e) {
      console.error('Failed to get AI Tutor response:', e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Contextual AI Learning Coach</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Gemini 3.8 Flash Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Grounded in {studentProfile?.board} Class {studentProfile?.classLevel} Curriculum • Responds in {learningLanguage.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 h-[480px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isTutor = m.sender === 'tutor';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-lg rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isTutor
                    ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                    : 'bg-indigo-600 text-white shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isTutor ? 'text-slate-400' : 'text-indigo-200'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.source && (
                    <span className="font-mono text-[9px] uppercase tracking-wider">
                      {m.source === 'gemini' ? 'Gemini 3.8' : 'Pedagogical Engine'}
                    </span>
                  )}
                </div>
              </div>

              {!isTutor && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 animate-pulse">
              Thinking step-by-step in your syllabus context...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 transition-all text-left"
          >
            💡 {p}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask anything about Class ${studentProfile?.classLevel} concepts...`}
          className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isSending}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
        >
          <span>Ask</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
