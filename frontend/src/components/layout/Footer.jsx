import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  return (
    <footer className="py-6 z-10 transition-colors bg-gradient-to-r from-fuchsia-950/20 via-slate-950/60 to-blue-950/20 backdrop-blur-xl border-t border-white/10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="h-5 w-auto opacity-70 grayscale" />
          <span className="font-semibold text-xs tracking-wide uppercase">Urban Tourism Optimizer © {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-white">Home</Link>
          <Link to="/create-trip" className="transition-colors hover:text-white">Plan Trip</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">Github</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
