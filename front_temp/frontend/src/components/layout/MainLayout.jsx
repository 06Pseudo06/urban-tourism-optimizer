import React from 'react';
import Header from './Header';

export default function MainLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--navy-950)', fontFamily: 'var(--font-body)' }}
    >
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
