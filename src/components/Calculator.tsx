'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorButton from './CalculatorButton';
import { CalcButton } from '@/types';

interface CalculatorProps {
  onCalculate: (expression: string, result: string) => void;
}

const BUTTONS: CalcButton[] = [
  { label: 'AC', value: 'AC', type: 'action' },
  { label: '+/-', value: 'NEGATE', type: 'action' },
  { label: '%', value: '%', type: 'special' },
  { label: '÷', value: '/', type: 'operator' },

  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '*', type: 'operator' },

  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '−', value: '-', type: 'operator' },

  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator' },

  { label: '0', value: '0', type: 'number', span: 2 },
  { label: '.', value: '.', type: 'number' },
  { label: '=', value: '=', type: 'equals' },
];

function safeEval(expression: string): string {
  try {
    // Replace display operators with JS operators
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Basic safety check
    if (!/^[0-9+\-*/.%() ]+$/.test(sanitized)) {
      return 'Error';
    }

    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + sanitized + ')')();

    if (typeof result !== 'number' || !isFinite(result)) {
      return result === Infinity || result === -Infinity ? 'Error' : 'Error';
    }

    // Format result: avoid floating point weirdness
    const formatted = parseFloat(result.toPrecision(10)).toString();
    return formatted;
  } catch {
    return 'Error';
  }
}

export default function Calculator({ onCalculate }: CalculatorProps) {
  const [currentValue, setCurrentValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [justEvaled, setJustEvaled] = useState(false);

  const handleButton = useCallback(
    (value: string) => {
      if (hasError && value !== 'AC') return;

      switch (value) {
        case 'AC': {
          setCurrentValue('0');
          setExpression('');
          setWaitingForOperand(false);
          setHasError(false);
          setJustEvaled(false);
          break;
        }

        case 'NEGATE': {
          if (currentValue !== '0') {
            const negated = (parseFloat(currentValue) * -1).toString();
            setCurrentValue(negated);
            if (expression) {
              setExpression((prev) => {
                // Replace the last number in expression with negated
                const parts = prev.split(/([+\-*/])/);
                parts[parts.length - 1] = negated;
                return parts.join('');
              });
            }
          }
          break;
        }

        case '%': {
          const pct = (parseFloat(currentValue) / 100).toString();
          setCurrentValue(pct);
          if (expression && !waitingForOperand) {
            setExpression((prev) => {
              const parts = prev.split(/([+\-*/])/);
              parts[parts.length - 1] = pct;
              return parts.join('');
            });
          }
          break;
        }

        case '+':
        case '-':
        case '*':
        case '/': {
          if (waitingForOperand) {
            // Just change the operator
            setExpression((prev) => prev.slice(0, -1) + value);
          } else {
            const newExpr = (justEvaled ? currentValue : expression || currentValue) + value;
            setExpression(newExpr);
            setWaitingForOperand(true);
            setJustEvaled(false);
          }
          break;
        }

        case '=': {
          if (!expression && !waitingForOperand) break;

          const fullExpr = waitingForOperand
            ? expression.slice(0, -1)
            : expression + (justEvaled ? '' : '');

          const exprToEval = waitingForOperand
            ? expression.slice(0, -1)
            : expression || currentValue;

          const result = safeEval(exprToEval);

          if (result === 'Error') {
            setCurrentValue('Error');
            setHasError(true);
          } else {
            setCurrentValue(result);
            setHasError(false);
            onCalculate(exprToEval, result);
          }

          setExpression('');
          setWaitingForOperand(false);
          setJustEvaled(true);
          break;
        }

        case '.': {
          if (waitingForOperand) {
            setCurrentValue('0.');
            setExpression((prev) => prev + '0.');
            setWaitingForOperand(false);
          } else if (!currentValue.includes('.')) {
            const newVal = currentValue + '.';
            setCurrentValue(newVal);
            if (expression) {
              setExpression((prev) => prev + '.');
            } else {
              setExpression(newVal);
            }
          }
          break;
        }

        default: {
          // Number pressed
          if (waitingForOperand) {
            setCurrentValue(value);
            setExpression((prev) => prev + value);
            setWaitingForOperand(false);
          } else if (justEvaled) {
            setCurrentValue(value);
            setExpression(value);
            setJustEvaled(false);
          } else {
            const newVal =
              currentValue === '0' ? value : currentValue + value;
            setCurrentValue(newVal);
            if (expression) {
              setExpression((prev) => prev + value);
            } else {
              setExpression(newVal);
            }
          }
          break;
        }
      }
    },
    [currentValue, expression, waitingForOperand, hasError, justEvaled, onCalculate]
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key >= '0' && key <= '9') handleButton(key);
      else if (key === '+') handleButton('+');
      else if (key === '-') handleButton('-');
      else if (key === '*') handleButton('*');
      else if (key === '/') { e.preventDefault(); handleButton('/'); }
      else if (key === 'Enter' || key === '=') handleButton('=');
      else if (key === 'Escape') handleButton('AC');
      else if (key === '.') handleButton('.');
      else if (key === '%') handleButton('%');
      else if (key === 'Backspace') {
        if (hasError) { handleButton('AC'); return; }
        if (currentValue.length > 1) {
          const newVal = currentValue.slice(0, -1);
          setCurrentValue(newVal);
          setExpression((prev) => prev.slice(0, -1) || newVal);
        } else {
          setCurrentValue('0');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButton, hasError, currentValue]);

  return (
    <div
      className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/20"
      style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}
    >
      {/* Calculator header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/60 text-xs font-medium uppercase tracking-widest">Calculator</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
      </div>

      <CalculatorDisplay
        expression={expression}
        currentValue={currentValue}
        hasError={hasError}
      />

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-3">
        {BUTTONS.map((btn, idx) => (
          <CalculatorButton
            key={`${btn.value}-${idx}`}
            label={btn.label}
            value={btn.value}
            type={btn.type}
            span={btn.span}
            onClick={handleButton}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-white/30 text-xs mt-4">
        Keyboard input supported
      </p>
    </div>
  );
}
