"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { FiberProvider } from "its-fine";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Group, Vector3 } from "three";
import gavelModel from "@/glb/judges_gavel.glb";

export function HomeTwoGavelScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="home-two-gavel" aria-label="Rotating three-dimensional judge's gavel">
      {active ? (
        <FiberProvider>
          <Canvas
            camera={{ position: [0, 0, 6.6], fov: 30 }}
            dpr={[1, 1.35]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ background: "transparent", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.62} color="#fff4e5" />
            <hemisphereLight args={["#fff7ec", "#24100b", 1.15]} />
            <directionalLight position={[-4, 6, 5]} intensity={2.2} color="#fff0d8" />
            <directionalLight position={[5, 1, 4]} intensity={1.05} color="#b89a63" />
            <Suspense fallback={null}>
              <RotatingGavel />
            </Suspense>
          </Canvas>
        </FiberProvider>
      ) : null}
    </div>
  );
}

function RotatingGavel() {
  const groupRef = useRef<Group>(null);
  const source = useGLTF(gavelModel).scene;
  const model = useMemo(() => {
    const clone = source.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = 3.84 / Math.max(size.x, size.y, size.z, 0.001);

    clone.position.copy(center).multiplyScalar(-1);
    clone.scale.setScalar(scale);
    return clone;
  }, [source]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.42;
  });

  return (
    <group ref={groupRef} rotation={[-0.12, -0.45, -0.08]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(gavelModel);
