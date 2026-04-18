import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/sign-in';
  const isLanding = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || !isLanding
          ? 'backdrop-blur-xl shadow-lg shadow-black/30'
          : ''
      }`}
      style={{
        fontFamily: 'var(--font-body)',
        backgroundColor: (scrolled || !isLanding) ? 'rgba(5,11,24,0.95)' : 'transparent',
        borderBottom: '1px solid rgba(232,184,75,0.15)',
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e8b84b 0%, #c9961f 100%)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5L10 6H14.5L11 9L12.5 14L8 11.5L3.5 14L5 9L1.5 6H6L8 1.5Z"
                fill="#050b18" />
            </svg>
          </div>
          <div className="hidden sm:flex items-baseline gap-1.5">
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                background: 'linear-gradient(135deg, #f5d06e 0%, #e8b84b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Urban Tourism
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(245,208,110,0.45)',
              }}
            >
              Optimizer
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          {!isAuthRoute && (
            <Link
              to="/create-trip"
              className="btn-gold px-5 py-2 rounded-lg text-sm"
            >
              Plan Trip
            </Link>
          )}
          {!isAuthRoute && (
            <Link
              to="/login"
              className="btn-ghost-gold px-4 py-2 rounded-lg text-sm"
            >
              Log in
            </Link>
          )}
          {isAuthRoute && (
            <Link
              to="/"
              className="btn-ghost-gold px-4 py-2 rounded-lg text-sm"
            >
              ← Home
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;