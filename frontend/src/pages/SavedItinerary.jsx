import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ItineraryDisplay from '../features/itinerary/components/ItineraryDisplay';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function SavedItinerary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedItinerary = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/itinerary/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to fetch itinerary');

        setItinerary(data.data.itineraryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItinerary();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading your trip...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-6 text-center max-w-md w-full">
          <h3 className="text-red-400 font-bold mb-2 text-lg">Error</h3>
          <p className="text-red-200 mb-6">{error}</p>
          <Link to="/dashboard" className="secondary-btn border-white/20 text-white hover:bg-white/10 inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </Link>
      
      {itinerary ? (
        <ItineraryDisplay itineraryData={itinerary} />
      ) : (
        <div className="text-center text-slate-500 py-12">No itinerary data could be loaded.</div>
      )}
    </div>
  );
}

export default SavedItinerary;
