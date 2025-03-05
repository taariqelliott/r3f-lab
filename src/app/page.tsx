"use client";

import {
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";
import { SRGBColorSpace, BackSide } from "three";

const BackgroundUpdater = () => {
  const { scene } = useThree();
  scene.background = new THREE.Color("black");
  return null;
};

const MainShapeMesh = () => {
  const randomColor = "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
  const meshRef = useRef<THREE.Mesh>(null);
  const {
    meshColor,
    radius,
    tube,
    tubularSegments,
    radialSegments,
    p,
    q,
    mainWireframe,
  } = useControls({
    meshColor: randomColor,
    radius: { value: 45, min: 0, max: 500, step: 1 },
    tube: { value: 7, min: 1, max: 100, step: 1 },
    tubularSegments: { value: 284, min: 1, max: 500, step: 1 },
    radialSegments: { value: 86, min: 1, max: 200, step: 1 },
    p: { value: 2, min: 1, max: 30, step: 1 },
    q: { value: 3, min: 1, max: 30, step: 1 },
    mainWireframe: false,
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.00075;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
      <torusKnotGeometry
        args={[radius, tube, tubularSegments, radialSegments, p, q]}
      />
      <meshToonMaterial color={meshColor} wireframe={mainWireframe} />
    </mesh>
  );
};

const StarfieldMesh = () => {
  const texture = useTexture("/star2.png");
  texture.colorSpace = SRGBColorSpace;
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y -= 0.0005;
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[500, 1000, 1000]} />
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  );
};

const Susan = () => {
  const modelRef = useRef<THREE.Mesh>(null);
  const { size, susanWireframe } = useControls({
    size: { value: 10, min: 0.0, max: 200, step: 0.01 },
    susanWireframe: false,
  });

  const model = useGLTF("/susan.glb");
  model.scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.material = new THREE.MeshToonMaterial({
        wireframe: susanWireframe,
      });
    }
  });

  return (
    <primitive
      ref={modelRef}
      scale={[size, size, size]}
      object={model.scene}
      position={[0, -1, 0]}
    />
  );
};

const LightController = () => {
  const lightRef = useRef<THREE.Light>(null);
  const { lightColor, intensity } = useControls({
    lightColor: "#ffffff",
    intensity: { value: 700000, min: 0.0, max: 1000000, step: 0.01 },
  });

  return (
    <spotLight
      ref={lightRef}
      intensity={intensity}
      color={lightColor}
      position={[0, 400, 0]}
    />
  );
};

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Canvas>
        <LightController />
        <PerspectiveCamera makeDefault fov={90} position={[0, 0, 50]} />
        <OrbitControls maxDistance={750} />
        <MainShapeMesh />
        <Susan />
        <StarfieldMesh />
        <BackgroundUpdater />
      </Canvas>
    </div>
  );
}
