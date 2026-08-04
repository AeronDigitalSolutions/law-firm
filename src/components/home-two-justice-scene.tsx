"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Group, Vector3 } from "three";
import ladyJusticeModel from "@/glb/Lady Justice.glb";

export function HomeTwoJusticeScene({ variant = "statement" }: { variant?: "statement" | "hero" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || (variant === "statement" && window.matchMedia("(max-width: 720px)").matches)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [variant]);

  return (
    <div ref={containerRef} className={`home-two-justice home-two-justice--${variant}`} aria-label="Rotating three-dimensional Lady Justice">
      {active ? (
        <Canvas
          camera={{ position: [0, 0.1, 6.2], fov: 31 }}
          dpr={[1, 1.35]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent", pointerEvents: "none" }}
        >
          <ambientLight intensity={0.72} color="#fff7ec" />
          <hemisphereLight args={["#fff8ee", "#3b1a18", 1.25]} />
          <directionalLight position={[-4, 6, 5]} intensity={2.15} color="#fff2dc" />
          <directionalLight position={[5, 1, 4]} intensity={1.05} color="#b89a63" />
          <Suspense fallback={null}>
            <RotatingJustice variant={variant} />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}

function RotatingJustice({ variant }: { variant: "statement" | "hero" }) {
  const groupRef = useRef<Group>(null);
  const source = useGLTF(ladyJusticeModel).scene;
  const model = useMemo(() => {
    const clone = source.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = (variant === "hero" ? 3.05 : 2.7375) / Math.max(size.y, 0.001);

    clone.position.copy(center).multiplyScalar(-1);
    clone.scale.setScalar(scale);
    clone.traverse((object) => { object.frustumCulled = true; });
    return clone;
  }, [source, variant]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * (variant === "hero" ? 0.16 : 0.22);
  });

  return (
    <group ref={groupRef} position={[0, variant === "hero" ? -0.2 : -0.12, 0]} rotation={[0, -0.42, 0]}>
      <primitive object={model} />
    </group>
  );
}
