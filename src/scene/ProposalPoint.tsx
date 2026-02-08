import { useMemo } from 'react';
import { Line } from '@react-three/drei';

interface ProposalPointProps {
  proposalPosition: [number, number, number];
  currentPosition: [number, number, number];
}

export function ProposalPoint({
  proposalPosition,
  currentPosition,
}: ProposalPointProps) {
  const points = useMemo(
    () => [currentPosition, proposalPosition],
    [currentPosition, proposalPosition],
  );

  return (
    <>
      <mesh position={proposalPosition}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#e2e8f0"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Line
        points={points}
        color="#94a3b8"
        lineWidth={1.5}
        transparent
        opacity={0.6}
      />
    </>
  );
}
