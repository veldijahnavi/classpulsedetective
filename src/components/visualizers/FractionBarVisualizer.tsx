/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FractionBarVisualizerProps {
  fractionA?: { num: number; den: number };
  fractionB?: { num: number; den: number };
  lcm?: number;
}

export const FractionBarVisualizer: React.FC<FractionBarVisualizerProps> = ({
  fractionA = { num: 1, den: 4 },
  fractionB = { num: 2, den: 3 },
  lcm = 12,
}) => {
  const [showLcmSlices, setShowLcmSlices] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'comparison'>('visual');

  const scaledA = (fractionA.num * (lcm / fractionA.den));
  const scaledB = (fractionB.num * (lcm / fractionB.den));
  const sumNumerator = scaledA + scaledB;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Interactive Fraction Slice Visualizer
            </h3>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Why you cannot add denominators: See how Least Common Denominator (LCM {lcm}) equalizes slice sizes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLcmSlices(!showLcmSlices)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              showLcmSlices
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {showLcmSlices ? 'Showing Common 12-Slice Scale' : 'Align into LCM (12) Slices'}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Fraction A */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">
              Fraction 1: <span className="text-indigo-600 font-mono text-base">{fractionA.num}/{fractionA.den}</span>
              {showLcmSlices && (
                <span className="ml-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                  = {scaledA}/{lcm} slices
                </span>
              )}
            </span>
            <span className="text-xs text-slate-400">
              {showLcmSlices ? `${fractionA.den} large slices divided into ${lcm} smaller slices` : `${fractionA.den} large slices`}
            </span>
          </div>

          <div className="h-10 w-full bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200">
            {showLcmSlices ? (
              Array.from({ length: lcm }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 border-r border-white/50 transition-colors flex items-center justify-center text-[10px] font-mono ${
                    i < scaledA ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {i < scaledA ? '1/12' : ''}
                </div>
              ))
            ) : (
              Array.from({ length: fractionA.den }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 border-r border-white/60 transition-colors flex items-center justify-center text-xs font-mono font-semibold ${
                    i < fractionA.num ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  1/{fractionA.den}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fraction B */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">
              Fraction 2: <span className="text-amber-600 font-mono text-base">{fractionB.num}/{fractionB.den}</span>
              {showLcmSlices && (
                <span className="ml-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                  = {scaledB}/{lcm} slices
                </span>
              )}
            </span>
            <span className="text-xs text-slate-400">
              {showLcmSlices ? `${fractionB.den} large slices divided into ${lcm} smaller slices` : `${fractionB.den} large slices`}
            </span>
          </div>

          <div className="h-10 w-full bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200">
            {showLcmSlices ? (
              Array.from({ length: lcm }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 border-r border-white/50 transition-colors flex items-center justify-center text-[10px] font-mono ${
                    i < scaledB ? 'bg-amber-500 text-white font-bold' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {i < scaledB ? '1/12' : ''}
                </div>
              ))
            ) : (
              Array.from({ length: fractionB.den }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 border-r border-white/60 transition-colors flex items-center justify-center text-xs font-mono font-semibold ${
                    i < fractionB.num ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  1/{fractionB.den}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Result Combined */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Combined Sum: {fractionA.num}/{fractionA.den} + {fractionB.num}/{fractionB.den}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono">
              Correct Sum: {sumNumerator}/{lcm}
            </span>
          </div>

          <div className="h-10 w-full bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200">
            {Array.from({ length: lcm }).map((_, i) => {
              const isA = i < scaledA;
              const isB = i >= scaledA && i < sumNumerator;
              return (
                <div
                  key={i}
                  className={`h-full flex-1 border-r border-white/60 flex items-center justify-center text-[10px] font-mono font-bold ${
                    isA
                      ? 'bg-indigo-500 text-white'
                      : isB
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isA || isB ? '1/12' : ''}
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Common Misconception: 3/7</strong>
                Adding (1+2)/(4+3) = 3/7 assumes both cakes had 7 equal slices. But 3/7 is only ~42% of a cake, while the actual sum is 11/12 (~91%)!
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">The Mathematical Truth: 11/12</strong>
                By subdividing into 12 equal slices (the LCM), 1/4 gives 3 slices and 2/3 gives 8 slices. 3 + 8 = 11 slices of size 1/12.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
