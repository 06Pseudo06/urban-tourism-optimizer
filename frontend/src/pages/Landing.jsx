import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Page3DBackground from "@/visuals/background/Page3DBackground";

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
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans">
      <Page3DBackground particleCount={800} globeClassName="absolute inset-0 opacity-[0.6]" />
      
      <motion.div
        className="relative w-full border-y border-white/10 bg-transparent px-5 py-12 sm:px-8 lg:px-12"
        initial={{ opacity: 0, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col items-start gap-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200"
              >
                AI + 3D TRAVEL EXPERIENCE
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-extrabold"
              >
                <span className="block bg-gradient-to-r from-orange-300 via-rose-300 to-pink-400 bg-clip-text text-4xl text-transparent sm:text-6xl">
                  Turn Your Travel Dreams Into Reality
                </span>
                <span className="mt-3 block bg-gradient-to-r from-cyan-200 via-blue-200 to-violet-300 bg-clip-text text-3xl text-transparent sm:text-5xl">
                  Plan Your Perfect Trip in Seconds
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="max-w-3xl text-base text-slate-100 sm:text-xl"
              >
                Because every journey should feel intentional, intelligent, and unforgettable from planning to arrival.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link to="/create-trip">
                  <Button className="hero-gradient-btn px-7 py-5 text-base font-bold text-white hover:scale-[1.02]">
                    Start Planning
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="glass-card px-7 py-5 text-base font-semibold text-white hover:bg-white/15 hover:-translate-y-0.5">
                    View Live Dashboard
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="glass-card rounded-3xl p-6"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Live Platform Snapshot</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Adaptive itinerary confidence", value: "98%" },
                  { label: "Global destination coverage", value: "180+" },
                  { label: "Average route savings", value: "31%" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/10 px-4 py-3">
                    <p className="text-sm text-slate-100">{item.label}</p>
                    <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            className="grid w-full grid-cols-2 gap-3 text-left sm:grid-cols-4"
          >
            {[
              { value: "95%", label: "Route efficiency gain" },
              { value: "2s", label: "Avg itinerary generation" },
              { value: "3D", label: "Live spatial context" },
              { value: "24/7", label: "Anytime plan access" },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-slate-200">{item.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid w-full gap-4 md:grid-cols-3"
          >
            {[
              { title: "Smart Route Intelligence", description: "Optimizes sequence, travel gaps, and day pacing based on your preferences." },
              { title: "Live Globe Visualization", description: "See travel arcs, orbital data rings, and destination context in immersive 3D." },
              { title: "Weather-Aware Planning", description: "Shifts activities around rain and heat to protect comfort and time." },
            ].map((card) => (
              <div key={card.title} className="glass-card rounded-2xl p-5 text-left shadow-lg shadow-black/20">
                <h3 className="text-lg font-bold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{card.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="pb-2"
          >
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Explore Destinations</p>
                <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  Discover iconic places before you plan
                </h2>
              </div>
              <Link to="/create-trip">
                <Button className="hero-gradient-btn text-white hover:scale-[1.02]">Start Exploring</Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {destinations.map((place) => (
                <article key={place.name} className="group relative h-56 overflow-hidden rounded-2xl border border-white/20 bg-slate-900/25">
                  <img src={place.image} alt={`${place.name}, ${place.country}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent" />
                  <div className="absolute bottom-0 z-10 p-4">
                    <h3 className="text-xl font-bold text-white">{place.name}</h3>
                    <p className="text-sm text-slate-200">{place.country}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
