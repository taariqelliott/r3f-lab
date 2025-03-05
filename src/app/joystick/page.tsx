"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CustomCamera = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={50}
      position={[20, 10, 0]}
    />
  );
};

const SetBackgroundColor = () => {
  const { scene } = useThree();
  scene.background = new THREE.Color("black");
  return null;
};

const MovableBox = ({
  moveX,
  moveY,
  moveZ,
  boxColor,
}: {
  moveX: number;
  moveY: number;
  moveZ: number;
  boxColor: string;
}) => {
  const posX = useRef(0);
  const posY = useRef(0);
  const posZ = useRef(0);
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (boxRef.current) {
      posX.current += moveX * 0.1;
      posY.current += moveY * -0.1;
      posZ.current += moveZ * -0.1;
      boxRef.current.position.set(posX.current, posY.current, posZ.current);
    }
  });

  return (
    <mesh ref={boxRef}>
      <boxGeometry />
      <meshStandardMaterial color={boxColor} />
    </mesh>
  );
};

const ControlsOverlay = ({ isXPressed }: { isXPressed: boolean }) => {
  return (
    <div className="absolute top-3 right-2 bg-zinc-700 rounded z-10 border border-white p-4 flex flex-col">
      <p className="text-lg font-bold text-white mb-2">Controls</p>
      <p className="text-amber-300 mb-2">Use a gamepad to move the box</p>
      <ul className="text-amber-300">
        <li>Left Stick Horizontal: Left/Right</li>
        <li>Left Stick Vertical: Back/Forth</li>
        <li>Right Stick Horizontal: Up/Down</li>
        <li>Press X: {isXPressed && <span>🙈</span>}</li>
      </ul>
    </div>
  );
};

export default function JoystickController() {
  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);
  const [moveZ, setMoveZ] = useState(0);
  const [isXPressed, setIsXPressed] = useState(false);
  const [boxColor, setBoxColor] = useState("#ff0000");
  const [wasXPressed, setWasXPressed] = useState(false);
  const deadzone = 0.1;

  useEffect(() => {
    const interval = setInterval(() => {
      const controller = navigator.getGamepads()[0];
      console.log(controller);

      if (controller) {
        const x = controller.axes[1];
        const y = controller.axes[3];
        const z = controller.axes[0];

        setMoveX(Math.abs(x) > deadzone ? x : 0);
        setMoveY(Math.abs(y) > deadzone ? y : 0);
        setMoveZ(Math.abs(z) > deadzone ? z : 0);

        const xButtonPressed = controller.buttons[0].pressed;
        setIsXPressed(xButtonPressed);

        if (xButtonPressed && !wasXPressed) {
          const hexColor = new THREE.Color(
            Math.random() * 0xffffff
          ).getHexString();
          setBoxColor(`#${hexColor}`);
        }

        setWasXPressed(xButtonPressed);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [wasXPressed]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ControlsOverlay isXPressed={isXPressed} />
      <Canvas>
        <OrbitControls />
        <CustomCamera />
        <ambientLight intensity={5} />
        <MovableBox
          moveX={moveX}
          moveY={moveY}
          moveZ={moveZ}
          boxColor={boxColor}
        />
        <gridHelper args={[20, 20]} />
        <SetBackgroundColor />
      </Canvas>
    </div>
  );
}
