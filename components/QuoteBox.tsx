'use client';

import { useEffect, useState } from 'react';

type QuoteResponse = { content?: string; author?: string; error?: string };

export default function QuoteBox() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchQuote() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/quote', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: QuoteResponse = await res.json();
      if (!data.content) throw new Error('No content');
      setQuote(data.content);
      setAuthor(data.author ?? '');
    } catch {
      setError('Couldn’t load quote.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded flex items-center justify-between gap-4">
      <div className="flex-1">
        {error ? (
          <p>{error}</p>
        ) : (
          <p>“{quote}”{author ? ` — ${author}` : ''}</p>
        )}
      </div>

      <button
        onClick={fetchQuote}
        disabled={loading}
        className="shrink-0 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        aria-label="Get a new quote"
      >
        {loading ? 'Loading…' : 'New Quote'}
      </button>
    </div>
  );
}
