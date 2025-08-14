'use client';

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">StudyBuddy</h1>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
        </div>
      </nav>
    </header>
  );
}
