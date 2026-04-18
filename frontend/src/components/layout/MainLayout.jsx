import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

export default function MainLayout({ children }) {
  const location = useLocation();
  const isDarkRoute = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/sign-in";

  return (
    <div className={`min-h-screen w-full font-sans flex flex-col ${isDarkRoute ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Header />
      <main className="flex-1 w-full relative flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
