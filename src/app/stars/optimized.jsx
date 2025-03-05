"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Color, InstancedMesh, Object3D } from "three";
import { useEffect, useRef } from "react";

const Boxes = () => {
  const amountX = 25;
  const amountY = 25;
  const amountZ = 25;
  const boxOffset = 1;
  const boxSize = 0.01;
  const boxSegments = 30;
  const colorHexOptions = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];

  const meshRef = useRef<InstancedMesh>(null);
  const tempObject = new Object3D();

  useEffect(() => {
    if (meshRef.current) {
      let index = 0;
      for (let i = 0; i < amountX; i++) {
        for (let k = 0; k < amountY; k++) {
          for (let n = 0; n < amountZ; n++) {
            let colorChoice = "#";
            for (let j = 0; j < 6; j++) {
              colorChoice +=
                colorHexOptions[
                  Math.floor(Math.random() * colorHexOptions.length)
                ].toString();
            }
            tempObject.position.set(
              i * boxOffset -
                (amountX * boxOffset) / 2 -
                (Math.random() - 0.5) * 2,
              k * boxOffset -
                (amountY * boxOffset) / 2 -
                (Math.random() - 0.5) * 2,
              n * boxOffset -
                (amountZ * boxOffset) / 2 -
                (Math.random() - 0.5) * 2
            );
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(index, tempObject.matrix);
            meshRef.current.setColorAt(index, new Color(colorChoice));
            index++;
          }
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [amountX, amountY, amountZ, boxOffset, colorHexOptions]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, amountX * amountY * amountZ]}
    >
      <sphereGeometry args={[boxSize, boxSegments, boxSegments]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
};

const UpdateBackground = () => {
  const { scene } = useThree();
  const bgColor = new Color("black");
  scene.background = bgColor;
  return null;
};

export default function System() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Canvas>
        <OrbitControls autoRotate autoRotateSpeed={1} />
        <PerspectiveCamera makeDefault fov={40} position={[0, 0, 10]} />
        <ambientLight intensity={10} />
        <Boxes />
        <UpdateBackground />
      </Canvas>
    </div>
  );
}
