"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Color,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
} from "three";

const Boxes = () => {
  const OBJECT_COUNT = 20000;
  const GRID_SIZE = 3000;
  const dummyObject = new Object3D();
  const sphereGeometry = new SphereGeometry();
  const standardMaterial = new MeshStandardMaterial();
  const instancedMesh = new InstancedMesh(
    sphereGeometry,
    standardMaterial,
    OBJECT_COUNT
  );
  const { scene } = useThree();
  scene.add(instancedMesh);

  for (let i = 0; i < OBJECT_COUNT; i++) {
    const scale = Math.random() * 2;
    dummyObject.position.x = Math.random() * GRID_SIZE - GRID_SIZE / 2;
    dummyObject.position.y = Math.random() * GRID_SIZE - GRID_SIZE / 2;
    dummyObject.position.z = Math.random() * GRID_SIZE - GRID_SIZE / 2;
    dummyObject.scale.set(scale, scale, scale);

    dummyObject.updateMatrix();
    instancedMesh.setMatrixAt(i, dummyObject.matrix);
    instancedMesh.setColorAt(i, new Color(Math.random() * 0xffffff));
  }
  return null;
};

const UpdateBackground = () => {
  const { scene } = useThree();
  const backgroundColor = new Color("#090909");
  scene.background = backgroundColor;
  return null;
};

export default function Stars() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Canvas>
        <OrbitControls autoRotate autoRotateSpeed={0.25} />
        <PerspectiveCamera makeDefault fov={90} position={[0, 0, 1200]} />
        <ambientLight intensity={10} />
        <Boxes />
        <UpdateBackground />
      </Canvas>
    </div>
  );
}
