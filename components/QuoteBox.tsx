'use client';

import { useEffect, useState } from 'react';

export default function QuoteBox() {
  const [quote, setQuote] = useState<string>('Loading...');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function getQuote() {
      try {
        const res = await fetch('https://api.quotable.io/random');
        if (!res.ok) throw new Error('API response not OK');
        const data = await res.json();
        setQuote(data.content);
      } catch (err) {
        console.error('Failed to fetch quote:', err);
        setError(true);
      }
    }

    getQuote();
  }, []);

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
      {error ? (
        <p>Couldn’t load quote. Please check your internet connection.</p>
      ) : (
        <p>{quote}</p>
      )}
    </div>
  );
}
