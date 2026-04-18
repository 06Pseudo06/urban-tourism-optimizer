import React from 'react';
import Header from './Header';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
