import React from 'react';
import './App.css';
import Hero from "./components/ui/custom/Hero.jsx";
import { motion } from "framer-motion";
import Page3DBackground from "@/components/custom/Page3DBackground";

function App() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans">
      <Page3DBackground particleCount={620} globeClassName="absolute inset-0 opacity-[0.52]" />
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <Hero />
      </motion.div>
    </div>
  );
}

export default App;