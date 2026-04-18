import { OrbitControls } from "@react-three/drei";

export default function GlobeControls() {
  return (
    <OrbitControls
      enablePan={false}
      enableZoom={false}
      autoRotate
      autoRotateSpeed={0.25}
      minPolarAngle={Math.PI / 2.8}
      maxPolarAngle={Math.PI / 1.8}
    />
  );
}
