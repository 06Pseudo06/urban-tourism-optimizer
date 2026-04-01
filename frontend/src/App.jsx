import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Button } from "@/components/ui/button"
import Hero from "./components/ui/custom/Hero.jsx"

function App() {
  return (
    <>
     {/* hero-section */}
     <Hero/>
    </>
  )
}

export default App