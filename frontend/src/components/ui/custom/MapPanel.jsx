import { useEffect, useRef, useState, useMemo } from 'react';

const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const MapPanel = ({ places }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ ONLY safe improvement
  const safePlaces = useMemo(() => {
    return Array.isArray(places)
      ? places.filter(p => p && p.lat != null && p.lng != null)
      : [];
  }, [places]);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMapsScript(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
        setIsLoaded(true);
      } catch (e) {
        console.error("Failed to load Google Maps JS API", e);
      }
    };
    initMap();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || safePlaces.length === 0) return;

    const center = { lat: safePlaces[0].lat || 0, lng: safePlaces[0].lng || 0 };

    // ✅ DO NOT TOUCH THIS LOGIC
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
      });
    }

    // clear markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (polylineRef.current) polylineRef.current.setMap(null);

    const bounds = new window.google.maps.LatLngBounds();
    const pathCoords = [];

    safePlaces.forEach((place, idx) => {
      if (!place.lat || !place.lng) return;

      const pos = { lat: place.lat, lng: place.lng };
      pathCoords.push(pos);
      bounds.extend(pos);

      const marker = new window.google.maps.Marker({
        position: pos,
        map: mapInstance.current,
        title: place.name,
        label: {
          text: String(idx + 1),
          color: 'white',
          fontWeight: 'bold'
        }
      });

      markersRef.current.push(marker);
    });

    if (pathCoords.length > 1) {
      polylineRef.current = new window.google.maps.Polyline({
        path: pathCoords,
        strokeColor: '#3b82f6',
        strokeWeight: 4,
        map: mapInstance.current
      });
    }

    if (safePlaces.length > 1) {
      mapInstance.current.fitBounds(bounds);
    } else {
      mapInstance.current.setCenter(center);
      mapInstance.current.setZoom(14);
    }

  }, [isLoaded, safePlaces]);

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          Loading Map Data...
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapPanel; 