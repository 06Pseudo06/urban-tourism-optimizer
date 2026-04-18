import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Line, Stars, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import Particles from "@/visuals/particles/Particles";
import { useGlobeAnimation } from "@/hooks/useGlobeAnimation";

const EARTH_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

function latLngToVector3(lat, lng, radius = 1.45) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function buildArc(from, to) {
  const start = latLngToVector3(from[0], from[1]);
  const end = latLngToVector3(to[0], to[1]);
  const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.1);
  const curve = new THREE.CatmullRomCurve3([start, mid, end]);
  return curve.getPoints(42);
}

function OrbitingVehicle({
  radius = 3,
  speed = 0.35,
  tilt = [0, 0, 0],
  color = "#38bdf8",
  type = "ship",
}) {
  const ref = useRef();
  const axis = useMemo(
    () => new THREE.Vector3(tilt[0] || 0, tilt[1] || 1, tilt[2] || 0).normalize(),
    [tilt]
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    const pos = new THREE.Vector3(Math.cos(t) * radius, Math.sin(t * 0.7) * 0.4, Math.sin(t) * radius);
    pos.applyAxisAngle(axis, 0.4);
    ref.current.position.copy(pos);
    ref.current.lookAt(0, 0, 0);
    ref.current.rotateY(Math.PI / 2);
  });

  return (
    <group ref={ref}>
      {type === "ship" ? (
        <>
          <mesh>
            <coneGeometry args={[0.08, 0.32, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} metalness={0.45} />
          </mesh>
          <mesh position={[-0.12, 0, 0]}>
            <boxGeometry args={[0.22, 0.03, 0.12]} />
            <meshStandardMaterial color="#c4b5fd" emissive="#818cf8" emissiveIntensity={0.45} />
          </mesh>
        </>
      ) : (
        <>
          <mesh>
            <boxGeometry args={[0.3, 0.05, 0.09]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.07, 0.06, 0.08]} />
            <meshStandardMaterial color="#bfdbfe" emissive="#60a5fa" emissiveIntensity={0.35} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 10]}>
            <boxGeometry args={[0.09, 0.01, 0.8]} />
            <meshStandardMaterial color="#93c5fd" emissive="#38bdf8" emissiveIntensity={0.25} />
          </mesh>
        </>
      )}
    </group>
  );
}

function ParticleRing({
  radius = 2.4,
  count = 220,
  color = "#67e8f9",
  speed = 0.12,
  tilt = [0, 0, 0],
}) {
  const ref = useRef();
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2;
      const jitter = THREE.MathUtils.randFloatSpread(0.12);
      positions[i * 3] = Math.cos(a) * (radius + jitter);
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(0.05);
      positions[i * 3 + 2] = Math.sin(a) * (radius + jitter);
    }
    return positions;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={points} count={points.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.022}
          transparent
          opacity={0.78}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function GlobeScene({
  particleCount = 1400,
  focusLatLng,
  routeCoordinates = [],
}) {
  const groupRef = useRef();
  const earthRef = useRef();
  const glowRef = useRef();
  const focusRotationRef = useRef({ x: 0.2, y: 0 });
  const { groupRef: animatedGroupRef, onPointerMove } = useGlobeAnimation({
    rotationSpeed: 0.07,
    parallaxStrength: 0.12,
  });

  const earthMap = useTexture(EARTH_TEXTURE_URL);
  earthMap.colorSpace = THREE.SRGBColorSpace;

  const arcs = useMemo(
    () =>
      routeCoordinates
        .filter((route) => route?.from && route?.to)
        .map((route) => buildArc(route.from, route.to)),
    [routeCoordinates]
  );

  useEffect(() => {
    if (!focusLatLng || focusLatLng.length !== 2) return;
    focusRotationRef.current = {
      x: THREE.MathUtils.degToRad(focusLatLng[0] * 0.25),
      y: THREE.MathUtils.degToRad(-focusLatLng[1]),
    };
  }, [focusLatLng]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.015;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.025;
      glowRef.current.scale.setScalar(1.05 + Math.sin(state.clock.elapsedTime * 1.5) * 0.015);
    }
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        focusRotationRef.current.x,
        0.04
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        focusRotationRef.current.y,
        0.03
      );
    }
  });

  return (
    <group onPointerMove={onPointerMove}>
      <group ref={groupRef}>
        <Stars radius={85} depth={60} count={2600} factor={5} saturation={0.2} fade speed={0.45} />
        <group ref={animatedGroupRef}>
          <mesh ref={earthRef}>
            <sphereGeometry args={[1.45, 64, 64]} />
            <meshStandardMaterial
              map={earthMap}
              roughness={0.4}
              metalness={0.6}
              emissive={"#1e3a8a"}
              emissiveIntensity={0.15}
            />
          </mesh>
          <mesh ref={glowRef}>
            <sphereGeometry args={[1.53, 64, 64]} />
            <meshBasicMaterial
              color={"#60a5fa"}
              transparent
              opacity={0.12}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[1.65, 64, 64]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.85, 2.75, 128]} />
            <meshBasicMaterial
              color={"#93c5fd"}
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>
          <ParticleRing radius={2.12} count={240} color="#22d3ee" speed={0.18} tilt={[0.2, 0, 0]} />
          <ParticleRing radius={2.45} count={300} color="#818cf8" speed={-0.13} tilt={[0.9, 0.12, 0]} />
          <ParticleRing radius={2.8} count={350} color="#f472b6" speed={0.1} tilt={[1.1, 0.5, 0.2]} />
          <OrbitingVehicle radius={3.35} speed={0.45} color="#38bdf8" type="ship" tilt={[0.1, 1, 0.2]} />
          <OrbitingVehicle radius={3.85} speed={0.28} color="#f5d0fe" type="plane" tilt={[0.35, 0.9, -0.1]} />
        </group>

        {arcs.map((points, idx) => (
          <Line
            key={`arc-${idx}`}
            points={points}
            color="#22d3ee"
            lineWidth={1.2}
            transparent
            opacity={0.85}
          />
        ))}
      </group>
      <Particles count={particleCount > 1000 ? 700 : particleCount} radius={5} opacity={0.5} size={0.035} />
    </group>
  );
}
