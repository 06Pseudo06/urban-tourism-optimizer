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
import Dashboard from './pages/Dashboard.jsx';
import SavedItinerary from './pages/SavedItinerary.jsx';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
          <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <button className="px-4 py-2 mt-2 bg-slate-700 hover:bg-slate-600 rounded" onClick={() => window.location.reload()}>Refresh Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div key="landing" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}><MainLayout><Landing /></MainLayout></motion.div>} />
        <Route path="/create-trip" element={<ProtectedRoute><motion.div key="create-trip" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}><MainLayout><Itinerary /></MainLayout></motion.div></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><motion.div key="dashboard" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}><MainLayout><Dashboard /></MainLayout></motion.div></ProtectedRoute>} />
        <Route path="/itinerary/:id" element={<ProtectedRoute><motion.div key="saved-itinerary" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}><MainLayout><SavedItinerary /></MainLayout></motion.div></ProtectedRoute>} />
        <Route path="/sign-in" element={<motion.div key="sign-in" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}><MainLayout><SignIn /></MainLayout></motion.div>} />
        <Route path="/login" element={<motion.div key="login" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}><MainLayout><Login /></MainLayout></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;