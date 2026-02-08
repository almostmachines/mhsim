import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface TrueModeProps {
  position: [number, number, number];
}

export function TrueMode({ position }: TrueModeProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + 0.1 * Math.sin(clock.getElapsedTime() * 2);
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#f59e0b"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
