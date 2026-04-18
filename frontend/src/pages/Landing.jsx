import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const destinations = [
  { name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop" },
  { name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop" },
  { name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop" },
  { name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1600&auto=format&fit=crop" },
  { name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop" },
  { name: "Singapore", country: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop" },
];

export default function Landing() {
  return (
    <div className="w-full flex-1 text-slate-100 font-sans pt-16 pb-24">
      <motion.div
        className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12"
        initial={{ opacity: 0, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {/* HERO SECTION */}
        <div className="glass-2 p-8 sm:p-12 md:p-16 flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200"
          >
            INTELLIGENT TRAVEL EXPERIENCES
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight max-w-4xl"
          >
            Turn Your Travel Dreams <br /> Into Reality In Seconds
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl text-base text-slate-400 sm:text-xl font-medium"
          >
            Because every journey should feel purposeful, seamless, and unforgettable from planning to arrival.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-4"
          >
            <Link to="/create-trip" className="primary-btn px-8 py-3 text-lg h-auto shadow-lg shadow-blue-900/40">
              Start Planning
            </Link>
            <Link to="/login" className="secondary-btn px-8 py-3 text-lg h-auto">
              View Live Dashboard
            </Link>
          </motion.div>
        </div>

        {/* FEATURES GRID */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid w-full gap-8 md:grid-cols-3"
        >
          {[
            { title: "Smart Route Intelligence", description: "Optimizes sequence, travel gaps, and day pacing based on your specific preferences." },
            { title: "Uncompromised Logistics", description: "Advanced temporal bounds ensure you only visit experiences that contextually fit your schedule." },
            { title: "Weather-Aware Planning", description: "Shifts activities robustly around rain and heat thresholds to protect comfort and time natively." },
          ].map((card) => (
            <div key={card.title} className="glass-feature p-8 text-center sm:text-left">
              <h3 className="text-xl font-medium tracking-tight text-white">{card.title}</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </motion.div>

        {/* DESTINATIONS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="pb-10 w-full"
        >
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pinnacle Locations</p>
              <h2 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                Explore majestic places before you plan
              </h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((place) => (
              <article key={place.name} className="glass-1 p-0 group relative h-64 overflow-hidden glass-hover hover:-translate-y-1">
                <img src={place.image} alt={`${place.name}, ${place.country}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
                <div className="absolute bottom-0 z-10 p-6">
                  <h3 className="text-2xl font-semibold text-white">{place.name}</h3>
                  <p className="text-sm text-slate-300 font-medium">{place.country}</p>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}
