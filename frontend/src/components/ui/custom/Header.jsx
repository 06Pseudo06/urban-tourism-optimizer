import React from 'react'
import { Button } from '../button'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/sign-in";

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5 bg-slate-950 text-white border-b border-white/10'>
        <Link to="/" className='flex items-center gap-2'>
          <img src="logo.svg" alt="Urban Tourism Optimizer logo" className='h-8 w-auto' />
          <span className='hidden sm:inline font-semibold tracking-wide'>Urban Tourism Optimizer</span>
        </Link>
        <div className='flex items-center gap-2'>
          {!isAuthRoute && (
            <Link to="/create-trip">
              <Button size="sm" className="hero-gradient-btn text-white">Plan Trip</Button>
            </Link>
          )}
          <Link to="/login">
            <Button size="sm" variant={isAuthRoute ? "outline" : "default"}>Login</Button>
          </Link>
          <Link to="/sign-in">
            <Button size="sm">Sign in</Button>
          </Link>
        </div>
    </div>
  )
}

export default Header