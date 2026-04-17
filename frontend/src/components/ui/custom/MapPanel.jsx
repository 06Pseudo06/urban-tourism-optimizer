import { useEffect, useRef, useState, useMemo } from 'react';

const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
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

  // ✅ Normalize + validate places ONCE
  const safePlaces = useMemo(() => {
    return Array.isArray(places)
      ? places.filter(
          (p) =>
            typeof p?.lat === "number" &&
            typeof p?.lng === "number"
        )
      : [];
  }, [places]);

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          console.error("Google Maps API key missing");
          return;
        }

        await loadGoogleMapsScript(apiKey);
        setIsLoaded(true);
      } catch (e) {
        console.error("Failed to load Google Maps JS API", e);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    // ✅ Strong guard using safePlaces
    if (!isLoaded || !mapRef.current || safePlaces.length === 0) return;

    const center = {
      lat: safePlaces[0].lat,
      lng: safePlaces[0].lng
    };

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
      });
    }

    // Cleanup previous
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const bounds = new window.google.maps.LatLngBounds();
    const pathCoords = [];

    safePlaces.forEach((place, idx) => {
      const pos = { lat: place.lat, lng: place.lng };
      pathCoords.push(pos);
      bounds.extend(pos);

      const marker = new window.google.maps.Marker({
        position: pos,
        map: mapInstance.current,
        title: place.name || `Stop ${idx + 1}`,
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
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstance.current
      });

      mapInstance.current.fitBounds(bounds);
    } else {
      mapInstance.current.setCenter(pathCoords[0]);
      mapInstance.current.setZoom(14);
    }

    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      if (polylineRef.current) polylineRef.current.setMap(null);
    };

  }, [isLoaded, safePlaces]);

  // ✅ UX FIX: show message instead of blank/broken map
  if (isLoaded && safePlaces.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        No location data available for map.
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Loading Map Data...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapPanel; 