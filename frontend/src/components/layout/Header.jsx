import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/sign-in";

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
    <header className="sticky top-0 z-50 p-3 flex justify-between items-center px-4 sm:px-8 bg-slate-950/80 backdrop-blur-md text-white border-b border-white/10 shadow-sm transition-all">
        <Link to="/" className="flex items-center gap-3">
          <img src="logo.svg" alt="Urban Tourism Optimizer logo" className="h-8 w-auto hover:opacity-90 transition-opacity" />
          <span className="hidden sm:inline font-bold tracking-wide text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Urban Tourism Optimizer</span>
        </Link>
        <div className='flex items-center gap-2'>
          {!isAuthRoute && (
            <Link to="/create-trip">
              <Button size="sm" className="hero-gradient-btn text-white hover:scale-[1.02] transition-transform duration-200">Plan Trip</Button>
            </Link>
          )}
          {isAuthenticated ? (
            <Button size="sm" variant="outline" className="transition-all duration-200 hover:bg-slate-800" onClick={handleLogout}>Sign out</Button>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant={isAuthRoute ? "outline" : "default"} className={`transition-all duration-200 ${isAuthRoute ? "border-white/30 text-white bg-transparent hover:bg-white/10" : ""}`}>Login</Button>
              </Link>
              <Link to="/sign-in">
                <Button size="sm" className="transition-all duration-200">Sign in</Button>
              </Link>
            </>
          )}
        </div>
    </header>
  )
}

export default Header