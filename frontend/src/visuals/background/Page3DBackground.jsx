import { Suspense, lazy } from "react";

const GlobeCanvas = lazy(() => import("@/visuals/globe/GlobeCanvas"));


export default function Page3DBackground({
  particleCount = 900,
  className = "",
  globeClassName = "absolute inset-0 opacity-82",
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <Suspense fallback={null}>
        <GlobeCanvas className={globeClassName} particleCount={particleCount} />
      </Suspense>
      <div className="absolute inset-0 bg-grid-noise opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.06),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(147,51,234,0.04),transparent_40%)]" />
    </div>
  );
}
