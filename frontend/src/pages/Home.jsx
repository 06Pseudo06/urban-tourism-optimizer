import { motion } from "framer-motion";
import Card from "../components/Card";
import Heatmap from "../components/Heatmap";

export default function Home() {
  return (
    // <div className="p-6 text-white bg-gradient-to-br from-black to-gray-800 min-h-screen">
    //   {/* {<h1 className="text-3xl font-bold mb-4">Smart City Dashboard</h1>} */}
    //   <motion.div
    //     initial={{ opacity: 0, y: -50 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     className="mb-10 text-center"
    //   >
    //     <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
    //       Travel Smart. Avoid Crowds.
    //     </h1>

    //     <p className="text-gray-400 mt-4">
    //       Optimize your travel with real-time smart suggestions
    //     </p>

    //     <button className="mt-6 px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700">
    //       Plan Your Trip
    //     </button>
    //   </motion.div>

    //   <div className="grid grid-cols-3 gap-4">
    //     <Card title="Tourists" value="12,340" />
    //     <Card title="Congested Areas" value="5" />
    //     <Card title="Alternatives" value="8" />
    //   </div>

    //   <Heatmap />
    // </div>
  
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">

      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text">
          Travel Smart. Avoid Crowds.
        </h1>

        <p className="text-gray-400 mt-5 text-lg">
          AI-powered tourism optimization for better travel experience and less congestion.
        </p>

        <button className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition transform">
          Plan Your Trip
        </button>
      </motion.div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <Card title="Active Tourists" value="12,340" />
        <Card title="Congested Areas" value="5" />
        <Card title="Smart Alternatives" value="8" />
      </div>

      {/* HEATMAP SECTION */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Live Crowd Heatmap</h2>
        <Heatmap />
      </div>

    </div>
  );
}
