import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import ChatbotWidget from '../ui/custom/ChatbotWidget';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-full font-sans flex flex-col relative overflow-hidden bg-slate-950 text-slate-100">
      
      {/* Universal Galaxy Ambient Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-indigo-500/30 blur-[90px] rounded-full animate-orb-slow" />
         <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-cyan-400/25 blur-[80px] rounded-full animate-orb-medium" />
         <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vw] max-w-[700px] max-h-[500px] bg-fuchsia-500/25 blur-[90px] rounded-full animate-orb-slow" />
         <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-blue-500/30 blur-[80px] rounded-full animate-orb-fast" />
      </div>

      <Header />
      <main className="flex-1 w-full relative flex flex-col z-10">
        {children}
      </main>
      <ChatbotWidget />
      <Footer />
    </div>
  );
}
