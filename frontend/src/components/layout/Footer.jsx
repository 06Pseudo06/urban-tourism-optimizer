import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const isDark = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/sign-in";

  return (
    <footer className={`py-6 px-4 md:px-8 border-t transition-colors duration-300 z-10 ${isDark ? 'bg-slate-950/80 backdrop-blur-md border-white/10 text-slate-400' : 'bg-white/80 backdrop-blur-md border-slate-200 text-slate-500'}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="logo.svg" alt="logo" className="h-5 w-auto opacity-70 grayscale" />
          <span className="font-semibold text-xs tracking-wide uppercase">Urban Tourism Optimizer © {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Home</Link>
          <Link to="/create-trip" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Plan Trip</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Github</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
