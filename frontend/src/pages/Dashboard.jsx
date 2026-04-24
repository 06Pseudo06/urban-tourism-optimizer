import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, Clock, Wallet, Calendar, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { API_BASE_URL } from '@/config/api';

const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="glass-1 rounded-2xl p-6 h-64 animate-pulse">
        <div className="w-3/4 h-6 bg-white/10 rounded mb-4"></div>
        <div className="w-1/2 h-4 bg-white/5 rounded mb-8"></div>
        <div className="space-y-3">
          <div className="w-full h-4 bg-white/10 rounded"></div>
          <div className="w-5/6 h-4 bg-white/10 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

function Dashboard() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchHistory = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setIsFetchingMore(true);

      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/api/itinerary/history?page=${pageNum}&limit=9`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch history');

      if (append) {
        setItineraries(prev => [...prev, ...data.data]);
      } else {
        setItineraries(data.data);
      }
      setTotalPages(data.pagination.pages);
      setPage(data.pagination.page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchHistory(page + 1, true);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">Your Trips</h1>
          <p className="text-lg text-slate-400">View and manage your saved itineraries.</p>
        </div>
        {!loading && itineraries.length > 0 && (
          <button onClick={() => fetchHistory(1)} className="secondary-btn text-sm flex items-center gap-2 text-white border-white/20 hover:bg-white/10 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-200 rounded-xl p-4 mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <DashboardSkeleton />
      ) : itineraries.length === 0 && !error ? (
        <div className="glass-2 rounded-2xl py-20 px-6 text-center border-dashed border-2 border-slate-700">
          <div className="w-20 h-20 bg-indigo-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <Map className="text-indigo-400 w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">No trips saved yet</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            Create your first intelligent, localized itinerary and it will automatically be saved here for you to access later.
          </p>
          <Link to="/create-trip" className="primary-btn inline-flex items-center gap-2 text-base px-8 py-3">
            Plan a New Trip
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((trip, i) => (
              <motion.div 
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/itinerary/${trip._id}`} className="block h-full group">
                  <div className="glass-1 rounded-2xl p-6 h-full border border-white/5 hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden">
                    
                    {/* Subtle hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight line-clamp-2 pr-4">{trip.title || `${trip.duration} Days in ${trip.destination}`}</h2>
                      <div className="w-8 h-8 rounded-full glass-2 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                        <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-300 transform group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-slate-300 text-sm">
                        <Calendar size={16} className="text-slate-500" />
                        <span>Created on {new Date(trip.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                          <Clock size={12} className="text-indigo-400" />
                          {trip.duration} Days
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                          <Wallet size={12} className="text-green-400" />
                          <span className="capitalize">{trip.budget}</span>
                        </span>
                        {trip.travelType && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 capitalize">
                            {trip.travelType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {page < totalPages && (
            <div className="mt-12 text-center">
              <button 
                onClick={handleLoadMore} 
                disabled={isFetchingMore}
                className="secondary-btn text-white border-white/20 hover:bg-white/10 px-8 disabled:opacity-50"
              >
                {isFetchingMore ? (
                  <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Loading...</span>
                ) : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
