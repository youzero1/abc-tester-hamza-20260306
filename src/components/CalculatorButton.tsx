'use client';

import React, { useState } from 'react';
import { ButtonType } from '@/types';

interface CalculatorButtonProps {
  label: string;
  value: string;
  type: ButtonType;
  span?: number;
  onClick: (value: string) => void;
}

const typeStyles: Record<ButtonType, string> = {
  number:
    'bg-white/10 hover:bg-white/20 text-white border border-white/10',
  operator:
    'bg-indigo-500/80 hover:bg-indigo-400/90 text-white border border-indigo-400/30',
  action:
    'bg-white/20 hover:bg-white/30 text-white border border-white/20',
  equals:
    'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 text-white border-0 shadow-lg',
  special:
    'bg-purple-500/70 hover:bg-purple-400/80 text-white border border-purple-400/30',
};

export default function CalculatorButton({
  label,
  value,
  type,
  span = 1,
  onClick,
}: CalculatorButtonProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    onClick(value);
    setTimeout(() => setPressed(false), 150);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        calc-btn-press
        rounded-xl
        font-semibold
        text-lg
        py-4
        flex items-center justify-center
        cursor-pointer
        select-none
        backdrop-blur-sm
        transition-all duration-150
        ${typeStyles[type]}
        ${span === 2 ? 'col-span-2' : ''}
        ${pressed ? 'scale-95 brightness-110' : 'scale-100'}
      `}
      style={{
        boxShadow: pressed
          ? '0 2px 8px rgba(0,0,0,0.2)'
          : '0 4px 15px rgba(0,0,0,0.1)',
      }}
    >
      {label}
    </button>
  );
}
