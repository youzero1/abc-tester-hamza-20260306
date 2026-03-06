'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Calculator from '@/components/Calculator';
import CalculationHistory from '@/components/CalculationHistory';
import SocialShareBar from '@/components/SocialShareBar';
import { CalculationRecord } from '@/types';

export default function Home() {
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [lastCalculation, setLastCalculation] = useState<{
    expression: string;
    result: string;
  } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCalculation = useCallback(
    async (expression: string, result: string) => {
      setLastCalculation({ expression, result });
      try {
        await fetch('/api/calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expression, result }),
        });
        await fetchHistory();
      } catch (error) {
        console.error('Failed to save calculation:', error);
      }
    },
    [fetchHistory]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleHistory={() => setHistoryOpen(!historyOpen)} historyOpen={historyOpen} />

      <main className="flex-1 flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Calculator + Share */}
          <div className="flex flex-col gap-4 w-full lg:w-auto flex-shrink-0">
            <Calculator onCalculate={handleCalculation} />
            {lastCalculation && (
              <SocialShareBar
                expression={lastCalculation.expression}
                result={lastCalculation.result}
              />
            )}
          </div>

          {/* History Panel - Desktop always visible, mobile toggled */}
          <div
            className={`
              w-full lg:w-80 flex-shrink-0
              transition-all duration-300 ease-in-out
              ${historyOpen ? 'block' : 'hidden lg:block'}
            `}
          >
            <CalculationHistory
              history={history}
              loading={loading}
              onSelectResult={(result) => {
                // This will be handled by the calculator
              }}
            />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-white/60 text-sm">
        <p>© 2024 ABC Tester — Share your calculations with the world ✨</p>
      </footer>
    </div>
  );
}
