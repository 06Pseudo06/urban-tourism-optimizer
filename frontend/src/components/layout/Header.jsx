import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const newAuth = !!localStorage.getItem("authToken");
      setIsAuthenticated(prev => (prev !== newAuth ? newAuth : prev));
    };
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.dispatchEvent(new Event("authChange"));
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-950/30 via-slate-950/60 to-cyan-950/30 border-b border-white/10 text-white backdrop-blur-xl shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center w-full">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Urban Tourism Optimizer logo" className="h-8 w-auto hover:opacity-90 transition-opacity" />
          <span className="hidden sm:inline font-bold tracking-wide text-lg text-white">Urban Tourism Optimizer</span>
        </Link>
        <div className='flex items-center gap-4'>
          {location.pathname !== "/create-trip" && (
            <Link to="/create-trip" className="primary-btn text-sm">
              Plan Trip
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex gap-3">
              <Link to="/dashboard" className="secondary-btn text-sm text-white border-white/20 hover:bg-white/10">Dashboard</Link>
              <button className="secondary-btn text-sm text-white border-white/20 hover:bg-white/10" onClick={handleLogout}>Sign out</button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="secondary-btn text-sm text-white border-white/20 hover:bg-white/10">Login</Link>
              <Link to="/sign-in" className="primary-btn text-sm text-white border-transparent">Sign in</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header