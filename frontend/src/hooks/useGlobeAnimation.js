import { useMemo, useRef } from "react";
import { MathUtils } from "three";
import { useFrame } from "@react-three/fiber";

export function useGlobeAnimation({
  rotationSpeed = 0.08,
  parallaxStrength = 0.18,
  enableParallax = true,
} = {}) {
  const groupRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  const onPointerMove = useMemo(
    () => (event) => {
      if (!enableParallax) return;
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current.x = nx;
      mouseRef.current.y = ny;
      targetRotation.current.x = ny * parallaxStrength;
      targetRotation.current.y = nx * parallaxStrength;
    },
    [enableParallax, parallaxStrength]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * rotationSpeed;
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.05
    );
    groupRef.current.rotation.z = MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotation.current.y * 0.08,
      0.04
    );
  });

  return {
    groupRef,
    onPointerMove,
  };
}
