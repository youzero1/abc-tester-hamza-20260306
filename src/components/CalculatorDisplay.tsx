'use client';

import React from 'react';

interface CalculatorDisplayProps {
  expression: string;
  currentValue: string;
  hasError: boolean;
}

export default function CalculatorDisplay({
  expression,
  currentValue,
  hasError,
}: CalculatorDisplayProps) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-4 mb-4 min-h-[100px] flex flex-col justify-between shadow-inner">
      {/* Expression line */}
      <div className="text-right min-h-[24px]">
        <p className="text-white/50 text-sm font-mono truncate">
          {expression || '\u00A0'}
        </p>
      </div>

      {/* Main value */}
      <div className="text-right">
        <p
          className={`font-mono font-light transition-all duration-200 ${
            hasError
              ? 'text-red-400 text-2xl'
              : currentValue.length > 12
              ? 'text-white text-2xl'
              : currentValue.length > 8
              ? 'text-white text-3xl'
              : 'text-white text-4xl'
          }`}
        >
          {currentValue || '0'}
        </p>
      </div>
    </div>
  );
}
