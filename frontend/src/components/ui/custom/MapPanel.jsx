import { useEffect, useRef, useState } from 'react';

const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Prevent duplicate script loading
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

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        // API key safety
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
    // Strong guard
    if (
      !isLoaded ||
      !mapRef.current ||
      !Array.isArray(places) ||
      places.length === 0
    ) return;

    // Safe center (avoid 0,0 issue)
    const center = {
      lat: typeof places[0]?.lat === "number" ? places[0].lat : 20,
      lng: typeof places[0]?.lng === "number" ? places[0].lng : 78
    };

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        styles: [
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#747474" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#a5b076" }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: true,
      });
    }

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const bounds = new window.google.maps.LatLngBounds();
    const pathCoords = [];

    places.forEach((place, idx) => {
      // Strict lat/lng validation
      if (
        typeof place.lat !== "number" ||
        typeof place.lng !== "number"
      ) return;

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
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 12
        }
      });

      markersRef.current.push(marker);
    });

    // Draw route line
    if (pathCoords.length > 1) {
      polylineRef.current = new window.google.maps.Polyline({
        path: pathCoords,
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstance.current
      });
    }

    // Fit bounds safely
    if (pathCoords.length > 1) {
      mapInstance.current.fitBounds(bounds);

      const listener = window.google.maps.event.addListener(
        mapInstance.current,
        "idle",
        function () {
          if (mapInstance.current.getZoom() > 15) {
            mapInstance.current.setZoom(15);
          }
          window.google.maps.event.removeListener(listener);
        }
      );
    } else if (pathCoords.length === 1) {
      mapInstance.current.setCenter(pathCoords[0]);
      mapInstance.current.setZoom(14);
    }

    // Cleanup on re-render
    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      if (polylineRef.current) polylineRef.current.setMap(null);
    };

  }, [isLoaded, places]);

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
