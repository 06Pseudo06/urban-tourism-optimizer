import { Clock, Star, ArrowDown, Info, Thermometer, CloudRain, Sun, Cloud } from 'lucide-react';

const categoryColors = {
  food: { dot: '#f97316', bg: 'rgba(249,115,22,0.1)', text: '#c2410c' },
  cultural: { dot: '#a78bfa', bg: 'rgba(167,139,250,0.1)', text: '#6d28d9' },
  activity: { dot: '#e8b84b', bg: 'rgba(232,184,75,0.1)', text: '#92400e' },
  shopping: { dot: '#f472b6', bg: 'rgba(244,114,182,0.1)', text: '#9d174d' },
  leisure: { dot: '#34d399', bg: 'rgba(52,211,153,0.1)', text: '#065f46' },
  default: { dot: '#60a5fa', bg: 'rgba(96,165,250,0.1)', text: '#1d4ed8' },
};

const WeatherBadge = ({ weather }) => {
  if (!weather) return (
    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-warm-400)' }}>
      No weather data
    </span>
  );

  const icon = weather.hasRain
    ? <CloudRain size={14} style={{ color: '#60a5fa' }} />
    : weather.isExtremeHeat ? '🔥'
    : weather.main_weather === 'Clear' ? <Sun size={14} style={{ color: '#f59e0b' }} />
    : <Cloud size={14} style={{ color: '#94a3b8' }} />;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(22,45,88,0.05)', border: '1px solid rgba(22,45,88,0.1)', borderRadius: 10, padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-warm-700)' }}>
      {icon}
      <span>{weather.main_weather || 'Unknown'}</span>
      <span style={{ color: 'var(--slate-warm-400)' }}>•</span>
      <Thermometer size={13} style={{ color: '#f87171' }} />
      <span>{weather.temp_max ? Math.round(weather.temp_max) : '--'}°C</span>
    </div>
  );
};

const WeatherContextBanner = ({ weather }) => {
  if (!weather || (!weather.hasRain && !weather.isExtremeHeat)) return null;
  const message = weather.hasRain
    ? 'Indoor activities prioritized due to expected rain.'
    : 'Outdoor activities minimized during peak heat hours.';
  return (
    <div style={{ maxWidth: 896, margin: '0 auto 20px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <Info size={16} style={{ color: '#d97706', flexShrink: 0 }} />
      <p style={{ fontSize: '0.83rem', fontWeight: 600, color: '#92400e', margin: 0 }}>{message}</p>
    </div>
  );
};

const PlaceCard = ({ place, index, isLast }) => {
  if (!place) return null;
  const imageUrl = place.image_url || 'https://images.unsplash.com/photo-1517840901100-81f18544d6db?q=80&w=600&auto=format&fit=crop';
  const travelMins = place.travel_time_from_previous || 0;
  const cat = place.category || 'default';
  const colors = categoryColors[cat] || categoryColors.default;
  const isIndoor = ['cultural', 'food', 'shopping'].includes(cat);

  return (
    <div style={{ position: 'relative', paddingLeft: 56, paddingBottom: 24, paddingTop: 8 }}>
      {/* Timeline line */}
      {!isLast && (
        <div style={{ position: 'absolute', left: 18, top: 48, bottom: 0, width: 2, background: 'rgba(22,45,88,0.08)' }} />
      )}

      {/* Travel time */}
      {index > 0 && travelMins > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, marginLeft: -10 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ivory-dark)', border: '1px solid rgba(22,45,88,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <ArrowDown size={13} style={{ color: 'var(--slate-warm-600)' }} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-warm-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {travelMins} min travel
          </span>
        </div>
      )}

      {/* Timeline dot */}
      <div style={{
        position: 'absolute', left: 12,
        top: (index === 0 || travelMins === 0) ? 14 : 58,
        width: 16, height: 16, borderRadius: '50%',
        background: colors.dot,
        border: '3px solid #fff',
        boxShadow: `0 0 0 2px ${colors.dot}30, 0 2px 6px rgba(0,0,0,0.1)`,
        zIndex: 2,
      }} />

      {/* Card */}
      <div
        className="group"
        style={{
          background: '#fff',
          border: '1px solid rgba(22,45,88,0.08)',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          maxWidth: 896,
          transition: 'box-shadow 250ms, border-color 250ms',
          boxShadow: '0 2px 8px rgba(22,45,88,0.05)',
        }}
        onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(22,45,88,0.12)'; e.currentTarget.style.borderColor = 'rgba(22,45,88,0.14)'; }}
        onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(22,45,88,0.05)'; e.currentTarget.style.borderColor = 'rgba(22,45,88,0.08)'; }}
      >
        {/* Image */}
        <div style={{ width: 200, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img src={imageUrl} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 600ms' }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
            loading="lazy" />
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={12} style={{ color: 'var(--navy-800)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy-800)', fontFamily: 'var(--font-body)' }}>
              {place.arrival_time || '--'} – {place.departure_time || '--'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 18px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--navy-900)', margin: 0, lineHeight: 1.2 }}>
              {place.name || 'Unknown Place'}
            </h4>
            {typeof place.rating === 'number' && place.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '4px 10px', flexShrink: 0 }}>
                <Star size={12} style={{ color: '#d97706', fill: '#d97706' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e' }}>{place.rating}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: colors.bg, color: colors.text, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {place.category || 'POI'}
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: isIndoor ? 'rgba(167,139,250,0.1)' : 'rgba(52,211,153,0.1)', color: isIndoor ? '#6d28d9' : '#065f46', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {isIndoor ? 'Indoor' : 'Outdoor'}
            </span>
          </div>

          {place.reason && (
            <div style={{ background: 'rgba(22,45,88,0.03)', border: '1px solid rgba(22,45,88,0.08)', borderRadius: 10, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Info size={13} style={{ color: 'var(--navy-600)', flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-warm-600)', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>{place.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ItineraryDisplay = ({ itineraryData }) => {
  if (!itineraryData) return null;
  const itinerary = Array.isArray(itineraryData?.itinerary) ? itineraryData.itinerary : [];
  const destination = itineraryData?.destination ?? 'Unknown';
  const duration = itineraryData?.duration ?? itinerary.length;
  const travelType = itineraryData?.travel_type ?? 'travel';
  const budget = itineraryData?.budget ?? 'mid';

  if (itinerary.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--slate-warm-600)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--navy-800)' }}>No itinerary data available.</p>
        <p style={{ fontSize: '0.9rem', marginTop: 8 }}>Try adjusting your destination or dates.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%', padding: '20px 16px 40px', fontFamily: 'var(--font-body)' }}>

      {/* Trip header */}
      <div style={{ textAlign: 'center', marginBottom: 36, padding: '0 16px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(22,45,88,0.05)', border: '1px solid rgba(22,45,88,0.1)', borderRadius: 999, padding: '4px 14px', marginBottom: 12 }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--navy-600)' }}>
            Your Personalized Itinerary
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 600, color: 'var(--navy-900)', margin: '0 0 6px', lineHeight: 1.1 }}>
          {duration}-Day Journey to{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--navy-600) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {destination}
          </span>
        </h2>
        <p style={{ color: 'var(--slate-warm-500)', fontSize: '0.9rem' }}>
          Optimized for <strong style={{ color: 'var(--slate-warm-700)' }}>{travelType}</strong> travel on a <strong style={{ color: 'var(--slate-warm-700)' }}>{budget}</strong> budget
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {itinerary.map((dayPlan, dIdx) => {
          const places = Array.isArray(dayPlan?.places) ? dayPlan.places : [];
          return (
            <div key={dayPlan?.day || dIdx}>
              {/* Day header */}
              <div
                style={{
                  position: 'sticky', top: 65, zIndex: 20, maxWidth: 896, margin: '0 auto 20px',
                  background: 'rgba(253,248,240,0.97)', backdropFilter: 'blur(12px)',
                  borderRadius: 14, padding: '12px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  border: '1px solid rgba(22,45,88,0.08)',
                  boxShadow: '0 4px 16px rgba(22,45,88,0.07)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--navy-900), var(--navy-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)', fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                    {dayPlan?.day || dIdx + 1}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--navy-900)', margin: 0, lineHeight: 1 }}>
                      Day {dayPlan?.day || dIdx + 1}
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--slate-warm-400)', margin: 0, fontWeight: 500, letterSpacing: '0.04em' }}>
                      {places.length} {places.length === 1 ? 'stop' : 'stops'} planned
                    </p>
                  </div>
                </div>
                <WeatherBadge weather={dayPlan?.weather} />
              </div>

              <WeatherContextBanner weather={dayPlan?.weather} />

              <div style={{ maxWidth: 896, margin: '0 auto' }}>
                {places.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 24px', border: '2px dashed rgba(22,45,88,0.1)', borderRadius: 16, color: 'var(--slate-warm-400)', fontSize: '0.9rem' }}>
                    No places found for this day
                  </div>
                ) : (
                  places.map((place, idx) => (
                    <PlaceCard
                      key={place?.googlePlaceId || place?.geoapifyPlaceId || idx}
                      place={place}
                      index={idx}
                      isLast={idx === places.length - 1}
                    />
                  ))
                )}
              </div>

              {dIdx !== itinerary.length - 1 && (
                <div style={{ maxWidth: 896, margin: '32px auto 0', height: 1, background: 'linear-gradient(90deg, transparent, rgba(22,45,88,0.1) 30%, rgba(22,45,88,0.1) 70%, transparent)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
