"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  type MutableRefObject,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import {
  Box3,
  Group,
  MathUtils,
  PerspectiveCamera,
  Vector3,
} from "three";
import gavelModel from "@/glb/judges_gavel.glb";

const GAVEL_ROTATION_SPEED = MathUtils.degToRad(7);

export type GavelMotion = {
  takeover: number;
  handoff: number;
  active: boolean;
};

type GavelSceneProps = {
  motionRef: MutableRefObject<GavelMotion>;
};

type ViewRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function getSourceRect(viewport: { width: number; height: number }): ViewRect {
  const width = Math.min(Math.max(viewport.width * 0.32, 360), 560);
  const height = Math.min(Math.max(viewport.height * 0.48, 360), 540);

  return {
    left: (viewport.width - width) / 2,
    top: (viewport.height - height) / 2,
    width,
    height,
  };
}

function getFallbackTarget(viewport: { width: number; height: number }): ViewRect {
  return {
    left: viewport.width * 0.57,
    top: viewport.height * 0.26,
    width: viewport.width * 0.31,
    height: viewport.height * 0.45,
  };
}

export function GavelScene({ motionRef }: GavelSceneProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    let frame = 0;

    const updateLayer = () => {
      const layer = layerRef.current;
      if (!layer) return;

      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const source = getSourceRect(viewport);
      const targetElement = document.querySelector<HTMLElement>("[data-gavel-target]");
      const targetBounds = targetElement?.getBoundingClientRect();
      const target = targetBounds
        ? {
              left: targetBounds.left,
              top: targetBounds.top,
              width: targetBounds.width,
              height: targetBounds.height,
            }
        : getFallbackTarget(viewport);
      const handoff = clamp(motionRef.current.handoff);
      const sourceCenterX = source.left + source.width / 2;
      const sourceCenterY = source.top + source.height / 2;
      const targetCenterX = target.left + target.width / 2;
      const targetCenterY = target.top + target.height / 2;
      const targetScale = Math.min(
        1.08,
        Math.max(0.82, Math.min(target.width / source.width, target.height / source.height)),
      );
      const scale = 1 + (targetScale - 1) * handoff;
      const offsetX = (targetCenterX - sourceCenterX) * handoff;
      const offsetY = (targetCenterY - sourceCenterY) * handoff;

      layer.style.left = `${source.left}px`;
      layer.style.top = `${source.top}px`;
      layer.style.width = `${source.width}px`;
      layer.style.height = `${source.height}px`;
      layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
      layer.style.clipPath = `circle(${motionRef.current.takeover * 155}vmax at 50% 50%)`;
      layer.style.opacity = "1";

      frame = requestAnimationFrame(updateLayer);
    };

    frame = requestAnimationFrame(updateLayer);
    return () => cancelAnimationFrame(frame);
  }, [motionRef]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={layerRef}
      className="about-gavel gavel-floating-layer"
      aria-label="Three-dimensional judge's gavel"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 31 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <hemisphereLight args={["#ffe8c6", "#180b03", 1.05]} />
        <ambientLight intensity={0.45} color="#ffeed8" />
        <directionalLight position={[-4, 6, 7]} intensity={2.25} color="#fff1da" />
        <directionalLight position={[5, 1, 4]} intensity={1.1} color="#d99449" />
        <Suspense fallback={null}>
          <GavelModel />
        </Suspense>
      </Canvas>
    </div>,
    document.body,
  );
}

function GavelModel() {
  const spinGroup = useRef<Group>(null);
  const { camera, size } = useThree();
  const source = useGLTF(gavelModel).scene;
  const { model, center, radius } = useMemo(() => {
    const model = source.clone(true);
    model.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(model);
    const center = bounds.getCenter(new Vector3());
    const radius = bounds.getSize(new Vector3()).length() / 2;

    return { model, center, radius };
  }, [source]);

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;

    const verticalFov = MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(
      Math.tan(verticalFov / 2) * (size.width / size.height),
    );
    const distance = Math.max(
      radius / Math.sin(verticalFov / 2),
      radius / Math.sin(horizontalFov / 2),
    ) * 1.18;

    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
  }, [camera, center, radius, size.height, size.width]);

  useFrame((_, delta) => {
    if (!spinGroup.current) return;

    spinGroup.current.rotation.y += GAVEL_ROTATION_SPEED * delta;
  });

  return (
    <group ref={spinGroup} position={center}>
      <group position={center.clone().multiplyScalar(-1)}>
        <primitive object={model} />
      </group>
    </group>
  );
}
