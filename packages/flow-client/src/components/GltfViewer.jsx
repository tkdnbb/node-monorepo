// @flow
import * as React from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

type Props = {
  gltfUrl: string
};

function Model({ gltfUrl }: Props) {
  const gltf = useLoader(GLTFLoader, gltfUrl);
  return <primitive object={gltf.scene} />;
}

export function GltfViewer({ gltfUrl }: Props): React.Node {
  return (
    <Canvas style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 1, 0]} intensity={0.5} />
      <Model gltfUrl={gltfUrl} />
    </Canvas>
  );
} 