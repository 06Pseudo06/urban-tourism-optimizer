import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page3DBackground from "@/visuals/background/Page3DBackground";

const destinations = [
  { name: "Paris", country: "France", tag: "Romance", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop" },
  { name: "Tokyo", country: "Japan", tag: "Culture", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop" },
  { name: "Dubai", country: "UAE", tag: "Luxury", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop" },
  { name: "New York", country: "USA", tag: "Iconic", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1600&auto=format&fit=crop" },
  { name: "Rome", country: "Italy", tag: "History", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop" },
  { name: "Singapore", country: "Singapore", tag: "Modern", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop" },
];

const features = [
  {
    icon: "✦",
    title: "Smart Route Intelligence",
    description: "Optimizes sequence, travel gaps, and day pacing based on your preferences and real-time data.",
  },
  {
    icon: "◎",
    title: "Live Globe Visualization",
    description: "See travel arcs, orbital data rings, and destination context in immersive 3D spatial views.",
  },
  {
    icon: "◈",
    title: "Weather-Aware Planning",
    description: "Shifts activities around rain and heat to protect your comfort, time, and experience.",
  },
];

const stats = [
  { value: "95%", label: "Route efficiency gain" },
  { value: "2s", label: "Avg itinerary generation" },
  { value: "180+", label: "Destinations covered" },
  { value: "24/7", label: "Anytime plan access" },
];

export default function Landing() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--navy-950)", fontFamily: "var(--font-body)" }}
    >
      {/* 3D Background */}
      <Page3DBackground particleCount={700} globeClassName="absolute inset-0 opacity-50" />

      {/* Ambient glow orbs */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(30,58,112,0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
          transform: "translateY(-30%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(20,42,80,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: "translateY(20%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-16 lg:py-24 flex flex-col gap-20">

        {/* ── HERO ── */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col items-start gap-7">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2.5 rounded-full px-4 py-1.5"
              style={{
                background: "rgba(22,45,88,0.6)",
                border: "1px solid rgba(232,184,75,0.25)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span style={{ color: "var(--gold-400)", fontSize: "0.6rem" }}>✦</span>
              <span
                style={{
                  color: "var(--gold-300)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                AI-Powered Travel Intelligence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ fontFamily: "var(--font-display)", lineHeight: 1.05 }}
            >
              <span
                className="block"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #f9f4ec 0%, #ede7da 60%, #d8d5d0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Turn your travel
              </span>
              <span
                className="block"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, #f5d06e 0%, #e8b84b 50%, #c9961f 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                dreams to reality
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ color: "rgba(237,231,218,0.65)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "520px" }}
            >
              Every journey should feel intentional, intelligent, and unforgettable — from the first search to the last destination.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <Link to="/create-trip">
                <button className="btn-gold px-7 py-3.5 rounded-xl text-sm font-semibold">
                  Start Planning →
                </button>
              </Link>
              <Link to="/login">
                <button className="btn-ghost-gold px-6 py-3.5 rounded-xl text-sm">
                  View Dashboard
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(10,22,40,0.75)",
              border: "1px solid rgba(232,184,75,0.15)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="text-xs uppercase tracking-[0.18em] mb-5 pb-4"
              style={{
                color: "var(--gold-400)",
                borderBottom: "1px solid rgba(232,184,75,0.12)",
              }}
            >
              Live Platform Snapshot
            </div>
            <div className="space-y-3">
              {[
                { label: "Adaptive itinerary confidence", value: "98%" },
                { label: "Global destination coverage", value: "180+" },
                { label: "Average route savings", value: "31%" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl px-4 py-3.5"
                  style={{
                    background: "rgba(22,45,88,0.5)",
                    border: "1px solid rgba(232,184,75,0.08)",
                  }}
                >
                  <p style={{ color: "rgba(237,231,218,0.6)", fontSize: "0.8rem" }}>{item.label}</p>
                  <p
                    className="mt-1 font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2rem",
                      background: "linear-gradient(135deg, #f5d06e 0%, #e8b84b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── STATS ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-5 text-left"
              style={{
                background: "rgba(10,22,40,0.6)",
                border: "1px solid rgba(232,184,75,0.1)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.4rem",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #f5d06e 0%, #e8b84b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
              <p className="mt-2 text-xs" style={{ color: "rgba(237,231,218,0.5)", letterSpacing: "0.02em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── FEATURES ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid gap-5 md:grid-cols-3"
        >
          {features.map((card, i) => (
            <div
              key={card.title}
              className="rounded-2xl p-6 text-left glass-dark glass-dark-hover transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 text-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(232,184,75,0.15) 0%, rgba(201,150,31,0.1) 100%)",
                  border: "1px solid rgba(232,184,75,0.2)",
                  color: "var(--gold-400)",
                }}
              >
                {card.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "var(--ivory)",
                  marginBottom: "0.5rem",
                }}
              >
                {card.title}
              </h3>
              <p style={{ color: "rgba(237,231,218,0.55)", fontSize: "0.9rem", lineHeight: 1.65 }}>
                {card.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── DESTINATIONS ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="pb-4"
        >
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p
                className="text-xs uppercase tracking-[0.22em] mb-2"
                style={{ color: "var(--gold-400)" }}
              >
                Explore Destinations
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 600,
                  color: "var(--ivory)",
                  lineHeight: 1.1,
                }}
              >
                Discover iconic places<br />
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    background: "linear-gradient(135deg, #f5d06e 0%, #e8b84b 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  before you plan
                </span>
              </h2>
            </div>
            <Link to="/create-trip">
              <button className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap">
                Start Exploring
              </button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {destinations.map((place, idx) => (
              <article
                key={place.name}
                className="group relative h-60 overflow-hidden rounded-2xl cursor-pointer"
                style={{ border: "1px solid rgba(232,184,75,0.1)" }}
              >
                <img
                  src={place.image}
                  alt={`${place.name}, ${place.country}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to top, rgba(5,11,24,0.9) 0%, rgba(5,11,24,0.3) 50%, transparent 100%)",
                  }}
                />
                {/* Hover tint */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(22,45,88,0.2)" }}
                />

                {/* Tag */}
                <div
                  className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: "rgba(232,184,75,0.15)",
                    border: "1px solid rgba(232,184,75,0.3)",
                    color: "var(--gold-300)",
                    backdropFilter: "blur(8px)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {place.tag}
                </div>

                {/* Info */}
                <div className="absolute bottom-0 z-10 p-5 w-full">
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--ivory)",
                      lineHeight: 1,
                    }}
                  >
                    {place.name}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: "rgba(245,208,110,0.6)" }}>
                    {place.country}
                  </p>
                </div>

                {/* Gold border on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ border: "1px solid rgba(232,184,75,0.4)", pointerEvents: "none" }}
                />
              </article>
            ))}
          </div>
        </motion.section>

        {/* ── CTA FOOTER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center py-8 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(22,45,88,0.4) 0%, rgba(10,22,40,0.6) 100%)",
            border: "1px solid rgba(232,184,75,0.12)",
            backdropFilter: "blur(16px)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 500,
              color: "var(--ivory)",
              fontStyle: "italic",
            }}
          >
            Your next adventure is one click away
          </p>
          <p className="mt-2 mb-6" style={{ color: "rgba(237,231,218,0.45)", fontSize: "0.9rem" }}>
            Build a smart, optimized itinerary in seconds
          </p>
          <Link to="/create-trip">
            <button className="btn-gold px-8 py-3.5 rounded-xl text-sm font-semibold">
              Plan My Trip →
            </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
