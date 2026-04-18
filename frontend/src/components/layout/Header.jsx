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
    <div className='p-3 shadow-sm flex justify-between items-center px-5 bg-slate-950 text-white border-b border-white/10'>
        <Link to="/" className='flex items-center gap-2'>
          <img src="logo.svg" alt="Urban Tourism Optimizer logo" className='h-8 w-auto' />
          <span className='hidden sm:inline font-semibold tracking-wide'>Urban Tourism Optimizer</span>
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
                <Button size="sm" variant={isAuthRoute ? "outline" : "default"} className="transition-all duration-200">Login</Button>
              </Link>
              <Link to="/sign-in">
                <Button size="sm" className="transition-all duration-200">Sign in</Button>
              </Link>
            </>
          )}
        </div>
    </div>
  )
}

export default Header