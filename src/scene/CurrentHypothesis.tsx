import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface CurrentHypothesisProps {
  position: [number, number, number];
}

export function CurrentHypothesis({ position }: CurrentHypothesisProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + 0.15 * Math.sin(clock.getElapsedTime() * 3);
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#06b6d4"
        emissiveIntensity={0.6}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
