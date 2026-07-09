import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Group } from "three";

// Load asset URL via import.meta to avoid Vite import-analysis parsing error
const cityModel = new URL("../assets/low_poly_city_diorama_scene.glb", import.meta.url).href;

function Model({ url, scale = 1 }: { url: string; scale?: number }) {
  const gltf: any = useGLTF(url);
  const ref = useRef<Group | null>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2; // turntable speed
  });

  return <primitive ref={ref} object={gltf.scene} dispose={null} scale={scale} />;
}

export default function LoginTurntable3D() {
  return (
    <Canvas className="w-full h-full" gl={{ alpha: true }} camera={{ position: [0, 4, 9], fov: 50 }} style={{ background: "transparent", pointerEvents: "none" }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 10, 7]} intensity={1} />

      <Suspense fallback={null}>
        <Model url={cityModel} scale={0.5} />
      </Suspense>

      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </Canvas>
  );
}

useGLTF.preload(cityModel);
