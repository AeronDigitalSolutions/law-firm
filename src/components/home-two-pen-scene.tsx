"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { FiberProvider } from "its-fine";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Group, Quaternion, Vector3 } from "three";
import penModel from "@/glb/PEN1.glb";

function findNamedBounds(root: Group, suffix: string): Box3 | null {
  const result = new Box3();
  let found = false;

  root.traverse((object) => {
    if (!found && object.name.endsWith(suffix)) {
      result.setFromObject(object);
      found = true;
    }
  });

  return found ? result : null;
}

function boundsCorners(bounds: Box3) {
  const { min, max } = bounds;
  return [
    new Vector3(min.x, min.y, min.z),
    new Vector3(min.x, min.y, max.z),
    new Vector3(min.x, max.y, min.z),
    new Vector3(min.x, max.y, max.z),
    new Vector3(max.x, min.y, min.z),
    new Vector3(max.x, min.y, max.z),
    new Vector3(max.x, max.y, min.z),
    new Vector3(max.x, max.y, max.z),
  ];
}

export function HomeTwoPenScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
        observer.disconnect();
      }
    }, { rootMargin: "160px 0px" });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="home-two-pen" aria-label="Three-dimensional fountain pen balanced on its nib">
      {active ? (
        <FiberProvider>
          <Canvas
            camera={{ position: [0, 0, 10.4], fov: 30 }}
            dpr={[1, 1.35]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ background: "transparent", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.62} color="#fff4e5" />
            <hemisphereLight args={["#fff7ec", "#2b1215", 1.1]} />
            <directionalLight position={[-4, 6, 5]} intensity={2.15} color="#fff0d8" />
            <directionalLight position={[5, 1, 4]} intensity={1.05} color="#b89a63" />
            <Suspense fallback={null}>
              <RotatingPen />
            </Suspense>
          </Canvas>
        </FiberProvider>
      ) : null}
    </div>
  );
}

function RotatingPen() {
  const groupRef = useRef<Group>(null);
  const source = useGLTF(penModel).scene;
  const model = useMemo(() => {
    const clone = source.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const size = bounds.getSize(new Vector3());
    const scale = 3.15 / Math.max(size.x, size.y, size.z, 0.001);
    const nibBounds = findNamedBounds(clone, "_5");
    const capBounds = findNamedBounds(clone, "_6");
    const capCenter = capBounds?.getCenter(new Vector3()) ?? bounds.max.clone();
    const nibCenter = nibBounds?.getCenter(new Vector3()) ?? bounds.min.clone();
    const preliminaryAxis = capCenter.clone().sub(nibCenter).normalize();
    const nibTip = nibBounds
      ? boundsCorners(nibBounds).reduce((tip, point) => (
        point.clone().sub(capCenter).dot(preliminaryAxis) < tip.clone().sub(capCenter).dot(preliminaryAxis)
          ? point
          : tip
      ))
      : nibCenter;
    const penAxis = capCenter.clone().sub(nibTip).normalize();
    const upright = new Quaternion().setFromUnitVectors(penAxis, new Vector3(0, 1, 0));

    // Put the actual nib at the group's origin so every sway pivots around it.
    clone.position.copy(nibTip).multiplyScalar(-scale).applyQuaternion(upright);
    clone.scale.setScalar(scale);
    clone.quaternion.copy(upright);
    return clone;
  }, [source]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();
    groupRef.current.rotation.x = Math.sin(time * 0.72) * 0.16;
    groupRef.current.rotation.z = Math.cos(time * 0.58) * 0.18;
    groupRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={groupRef} position={[0, -2.67, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(penModel);
