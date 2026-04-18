import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./pages/Landing.jsx";
import Itinerary from "./pages/Itinerary.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import Header from "./components/layout/Header.jsx";
import SignIn from './auth/SignIn.jsx';
import Login from './auth/Login.jsx';

const pageTransition = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" }
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div key="landing" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}><Header /><Landing /></motion.div>} />
        <Route path="/create-trip" element={<motion.div key="create-trip" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}><MainLayout><Itinerary /></MainLayout></motion.div>} />
        <Route path="/sign-in" element={<motion.div key="sign-in" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}><MainLayout><SignIn /></MainLayout></motion.div>} />
        <Route path="/login" element={<motion.div key="login" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}><MainLayout><Login /></MainLayout></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;