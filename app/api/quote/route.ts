export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

const FALLBACKS = [
  { content: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { content: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { content: 'You miss 100% of the shots you don’t take.', author: 'Wayne Gretzky' },
];

export async function GET(_req: NextRequest, _context: { params: Record<string, string> }) {
  try {
    const res = await fetch('https://api.quotable.io/random', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Upstream status ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ content: data.content, author: data.author });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Quote fetch failed:', err.message);
    } else {
      console.error('Quote fetch failed:', String(err));
    }
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    return NextResponse.json(fallback, { status: 200 });
  }
}
