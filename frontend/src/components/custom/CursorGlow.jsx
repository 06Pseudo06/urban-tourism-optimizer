import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handler = (event) => setPos({ x: event.clientX, y: event.clientY });
    window.addEventListener("pointermove", handler, { passive: true });
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-40 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.24),rgba(14,116,144,0.02)_65%,transparent_78%)] blur-xl"
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      aria-hidden
    />
  );
}
