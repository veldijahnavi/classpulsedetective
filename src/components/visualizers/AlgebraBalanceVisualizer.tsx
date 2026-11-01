/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Scale, ArrowRight, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface AlgebraBalanceProps {
  initialLhs?: string;
  initialRhs?: string;
}

export const AlgebraBalanceVisualizer: React.FC<AlgebraBalanceProps> = () => {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const reset = () => setStep(0);
  const nextStep = () => {
    if (step < 2) setStep((s) => (s + 1) as 0 | 1 | 2);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Scale className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Interactive Equality Pan Balance Scale
            </h3>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Solving <span className="font-mono font-bold text-slate-700">3x - 7 = 14</span> using balanced physical operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Equation
          </button>
          {step < 2 && (
            <button
              onClick={nextStep}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              {step === 0 ? 'Apply +7 to Both Sides' : 'Divide Both Sides by 3'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Balance Scale Graphic */}
      <div className="mt-8 relative py-8 px-4 bg-gradient-to-b from-slate-50/50 to-slate-100/80 rounded-2xl border border-slate-200/80">
        {/* Scale Fulcrum & Beam */}
        <div className="w-full flex flex-col items-center">
          {/* Horizontal Beam */}
          <div className="w-3/4 h-3 bg-slate-700 rounded-full relative flex items-center justify-between px-8 shadow-sm">
            {/* Center Pivot */}
            <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-7 h-7 bg-amber-400 border-2 border-slate-800 rounded-full shadow flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-900">=</span>
            </div>
          </div>

          {/* Fulcrum Stand */}
          <div className="w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[48px] border-b-slate-700 -mt-0.5" />
          <div className="w-28 h-3 bg-slate-800 rounded-full -mt-0.5" />
        </div>

        {/* Pans */}
        <div className="grid grid-cols-2 gap-8 mt-4">
          {/* Left Pan (LHS) */}
          <div className="flex flex-col items-center">
            <div className="w-1 h-12 bg-slate-400 mb-0.5" />
            <div className="w-full max-w-[220px] bg-white border-2 border-blue-400 rounded-xl p-4 shadow-md text-center">
              <div className="text-xs uppercase tracking-wider font-bold text-blue-600 mb-2">
                Left Pan (LHS)
              </div>
              <div className="font-mono text-xl font-bold text-slate-800">
                {step === 0 && '3x - 7'}
                {step === 1 && '3x'}
                {step === 2 && 'x'}
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                {step === 0 && (
                  <>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono font-semibold">
                      3x (Unknowns)
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-semibold">
                      -7 (Debt)
                    </span>
                  </>
                )}
                {step === 1 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono font-semibold">
                    3x (Isolated)
                  </span>
                )}
                {step === 2 && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1x Solved!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Pan (RHS) */}
          <div className="flex flex-col items-center">
            <div className="w-1 h-12 bg-slate-400 mb-0.5" />
            <div className="w-full max-w-[220px] bg-white border-2 border-emerald-400 rounded-xl p-4 shadow-md text-center">
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 mb-2">
                Right Pan (RHS)
              </div>
              <div className="font-mono text-xl font-bold text-slate-800">
                {step === 0 && '14'}
                {step === 1 && '14 + 7 = 21'}
                {step === 2 && '21 ÷ 3 = 7'}
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                {step === 0 && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-mono font-semibold">
                    14 Units
                  </span>
                )}
                {step === 1 && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-mono font-semibold">
                    14 + 7 = 21 Units
                  </span>
                )}
                {step === 2 && (
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-mono font-bold">
                    7 Units per x
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation of Transposition Rule */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <Sparkles className="w-4 h-4 text-blue-600" />
          The Transposition Secret Unlocked:
        </h4>
        <p className="text-xs text-blue-950 leading-relaxed">
          When teachers say <span className="font-semibold">"move -7 across the equals sign to make it +7"</span>, this is what is actually happening physically: to cancel out the -7 on the left, we add +7 to <span className="underline">both</span> sides. The left pan -7 disappears, and the right pan gets +7 added! That is why the sign flips.
        </p>
      </div>
    </div>
  );
};
