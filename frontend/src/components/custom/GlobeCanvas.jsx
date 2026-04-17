import { memo, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import GlobeScene from "./GlobeScene";
import GlobeControls from "./GlobeControls";

const GlobeCanvas = memo(function GlobeCanvas({
  className = "",
  particleCount,
  focusLatLng,
  routeCoordinates = [],
  interactive = true,
}) {
  const responsiveParticleCount = useMemo(() => {
    const base = particleCount ?? 1400;
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return Math.max(350, Math.floor(base * 0.45));
    }
    return base;
  }, [particleCount]);

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 5.8], fov: 45, near: 0.1, far: 200 }}
        frameloop="always"
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[2.5, 1.6, 2.4]} intensity={1.2} color="#93c5fd" />
        <pointLight position={[-2.8, -1.5, -2.2]} intensity={0.7} color="#818cf8" />
        <Suspense fallback={null}>
          <GlobeScene
            particleCount={responsiveParticleCount}
            focusLatLng={focusLatLng}
            routeCoordinates={routeCoordinates}
          />
        </Suspense>
        {interactive && <GlobeControls />}
      </Canvas>
    </div>
  );
});

export default GlobeCanvas;
