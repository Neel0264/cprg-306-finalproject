'use client';
import { useEffect, useState, useCallback } from 'react';

type Quote = {
  content: string;
  author: string;
};

export default function QuoteBox() {
  const [quote, setQuote] = useState<Quote>({ content: '', author: '' });
  const [error, setError] = useState(false);
  const [showQuotes, setShowQuotes] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const defaultQuotes: Quote[] = [
    { content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
    { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { content: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
    { content: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
    { content: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
    { content: 'Believe you can and you&rsquo;re halfway there.', author: 'Theodore Roosevelt' },
    { content: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
    { content: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
    { content: 'Success is walking from failure to failure with no loss of enthusiasm.', author: 'Winston Churchill' },
    { content: 'Don&rsquo;t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  ];

  const getRandomDefaultQuote = () => {
    const i = Math.floor(Math.random() * defaultQuotes.length);
    return defaultQuotes[i];
  };

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    setError(false);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch('/api/quote', {
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();

      setQuote({ content: data.content, author: data.author });
    } catch (err) {
      console.warn('Falling back to default quote:', err);
      const fallback = getRandomDefaultQuote();
      setQuote(fallback);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const quotesEnabled = localStorage.getItem('showQuotes') !== 'false';
    setShowQuotes(quotesEnabled);

    if (quotesEnabled) {
      fetchQuote();
    }

    const handleSettingsChange = () => {
      const enabled = localStorage.getItem('showQuotes') !== 'false';
      setShowQuotes(enabled);
      if (enabled && !quote.content) {
        fetchQuote();
      }
    };

    window.addEventListener('quotes-setting-changed', handleSettingsChange);
    return () => window.removeEventListener('quotes-setting-changed', handleSettingsChange);
  }, [fetchQuote, quote.content]);

  useEffect(() => {
    if (showQuotes && !quote.content && !isLoading) {
      const fallback = getRandomDefaultQuote();
      setQuote(fallback);
    }
  }, [showQuotes, quote.content, isLoading]);

  if (!showQuotes) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 p-6 mb-6 rounded-lg shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Daily Motivation</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-blue-700 dark:text-blue-300">Loading inspiration...</span>
            </div>
          ) : (
            <div>
              <p className="text-blue-700 dark:text-blue-300 italic text-lg">
                &ldquo;{quote.content}&rdquo;
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-2">— {quote.author}</p>
              {error && (
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                  📱 Offline mode – Refresh to try again
                </p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={fetchQuote}
          disabled={isLoading}
          className="ml-4 p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 disabled:opacity-50 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
          title="Get new quote"
        >
          <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
