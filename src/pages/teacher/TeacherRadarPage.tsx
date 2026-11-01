/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export const TeacherRadarPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('8');
  const [selectedBoard, setSelectedBoard] = useState('All');
  const [radarData, setRadarData] = useState<any[]>([]);
  const [attemptsSampled, setAttemptsSampled] = useState(0);

  useEffect(() => {
    let url = `/api/teacher/learning-radar?classLevel=${selectedClass}`;
    if (selectedBoard !== 'All') url += `&board=${selectedBoard}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('classpulse_token')}`,
      },
    })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setRadarData(data.radarData || []);
        setAttemptsSampled(data.attemptsSampled || 0);
      })
      .catch(console.error);
  }, [selectedClass, selectedBoard]);

  // Generate SVG Radar Polygon points
  const centerX = 200;
  const centerY = 200;
  const radius = 130;
  const numAxes = radarData.length || 5;

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  const actualPoints = radarData.map((d, i) => {
    const { x, y } = getCoordinates(d.score, i);
    return `${x},${y}`;
  }).join(' ');

  const targetPoints = radarData.map((d, i) => {
    const { x, y } = getCoordinates(d.target, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Cognitive Domain Learning Radar
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data-driven cognitive skill profiling derived from {attemptsSampled} verified student assessments and retest attempts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
          >
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* SVG Radar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
          <svg width="400" height="400" viewBox="0 0 400 400" className="overflow-visible">
            {/* Concentric grid circles */}
            {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
              <circle
                key={idx}
                cx={centerX}
                cy={centerY}
                r={radius * level}
                fill="none"
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
            ))}

            {/* Radial Axis Lines */}
            {radarData.map((d, i) => {
              const { x, y } = getCoordinates(100, i);
              const labelCoord = getCoordinates(120, i);
              return (
                <g key={i}>
                  <line x1={centerX} y1={centerY} x2={x} y2={y} stroke="#cbd5e1" strokeWidth="1" />
                  <text
                    x={labelCoord.x}
                    y={labelCoord.y}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-slate-700"
                  >
                    {d.skill.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Target Area */}
            {targetPoints && (
              <polygon
                points={targetPoints}
                fill="rgba(148, 163, 184, 0.15)"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            )}

            {/* Actual Evidence Polygon */}
            {actualPoints && (
              <polygon
                points={actualPoints}
                fill="rgba(79, 70, 229, 0.25)"
                stroke="#4f46e5"
                strokeWidth="2.5"
              />
            )}
          </svg>

          <div className="flex items-center gap-6 mt-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-3 h-3 rounded bg-indigo-600" /> Class Actual Performance
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 rounded bg-slate-300" /> Target Proficiency (80%+)
            </span>
          </div>
        </div>

        {/* Skill Details Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Cognitive Dimension Breakdown
          </h3>

          <div className="space-y-3.5">
            {radarData.map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{d.skill}</span>
                  <span className="font-mono text-indigo-600">{d.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      d.score >= 75 ? 'bg-emerald-500' : d.score >= 60 ? 'bg-indigo-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
            <strong>Evidence-Based Observation: </strong>
            Students demonstrate solid foundational recall, but show procedural variance on multi-step fraction alignment and transposition. Targeted 10-minute interventions in the Planner address these exact sub-skills.
          </div>
        </div>
      </div>
    </div>
  );
};
