export const runtime = 'edge'; // helps avoid local TLS/proxy quirks

import { NextResponse } from 'next/server';

const FALLBACKS = [
  { content: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { content: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { content: 'You miss 100% of the shots you don’t take.', author: 'Wayne Gretzky' },
];

export async function GET() {
  try {
    const r = await fetch('https://api.quotable.io/random', { cache: 'no-store' });
    if (!r.ok) throw new Error(`Upstream status ${r.status}`);
    const data = await r.json();
    return NextResponse.json({ content: data.content, author: data.author });
  } catch (err: unknown) {
    console.error('Quote fetch failed:', err?.message || err);
    const q = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    // Return a fallback so your UI still works
    return NextResponse.json(q, { status: 200 });
  }
}
