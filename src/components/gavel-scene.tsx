"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  type MutableRefObject,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import {
  Box3,
  Group,
  MathUtils,
  Vector3,
} from "three";
import gavelModel from "@/glb/judges_gavel.glb";

const GAVEL_ROTATION_SPEED = MathUtils.degToRad(12);
const GAVEL_SIZE_SCALE = 0.765;

export type GavelMotion = {
  takeover: number;
  handoff: number;
  active: boolean;
};

type GavelSceneProps = {
  motionRef?: MutableRefObject<GavelMotion>;
};

type GavelScreenState = {
  x: number;
  y: number;
  width: number;
  opacity: number;
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function GavelScene({ motionRef }: GavelSceneProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const screenStateRef = useRef<GavelScreenState>({ x: 0, y: 0, width: 320, opacity: 0 });
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    let frame = 0;

    const updateLayer = () => {
      const layer = layerRef.current;
      if (!layer) {
        frame = requestAnimationFrame(updateLayer);
        return;
      }

      const vp = { width: window.innerWidth, height: window.innerHeight };
      const slotA = typeof document !== "undefined" ? document.querySelector<HTMLElement>("[data-gavel-source-slot]") : null;
      const slotB = typeof document !== "undefined" ? document.querySelector<HTMLElement>("[data-gavel-target]") : null;
      const slotC = typeof document !== "undefined" ? document.querySelector<HTMLElement>("[data-gavel-confidence-target]") : null;
      const approachZone = slotC?.closest<HTMLElement>(".ac-zone");
      const confidenceZone = slotC?.closest<HTMLElement>(".ac-zone");
      const confidenceStage = slotC?.closest<HTMLElement>(".ac-stage");
      const confidencePhase = confidenceStage?.dataset.phase;

      const rectB = slotB?.getBoundingClientRect();
      const rectC = slotC?.getBoundingClientRect();
      const approachZoneRect = approachZone?.getBoundingClientRect();
      const confidenceZoneRect = confidenceZone?.getBoundingClientRect();

      const sourceX = vp.width * 0.5;
      const sourceY = vp.height * 0.79;
      const sourceWidth = MathUtils.clamp(vp.width * 0.19, 270, 390);
      let x = sourceX;
      let y = sourceY;
      let width = sourceWidth;
      let opacity = slotA
        ? clamp(((motionRef?.current.takeover ?? 1) - 0.05) / 0.3)
        : 0;

      if (rectB) {
        const handoff = smoothstep(clamp((vp.height * 1.08 - rectB.top) / (vp.height * 0.82)));
        const targetWidth = MathUtils.clamp(rectB.width * 0.7, 280, 430);
        const safeHalfWidth = targetWidth * 0.53;
        const targetX = MathUtils.clamp(rectB.left + rectB.width / 2, safeHalfWidth, vp.width - safeHalfWidth);
        // Once the handoff completes, follow the target's document position.
        // The gavel is then visually part of the capabilities hero: it scrolls
        // upward with that section and naturally exits the viewport with it.
        const targetY = rectB.top + rectB.height / 2;

        x = lerp(sourceX, targetX, handoff);
        y = lerp(sourceY, targetY, handoff);
        width = lerp(sourceWidth, targetWidth, handoff);
      }

      // Section 03 owns the viewport once it approaches the sticky threshold.
      // Fade the gavel before that point and keep it absent throughout Approach.
      if (approachZoneRect) {
        const approachVisibility = clamp(
          (approachZoneRect.top - vp.height * 0.08) / (vp.height * 0.42),
        );
        opacity *= approachVisibility;
      }

      // Section 04 uses its own deterministic anchor and is never interpolated
      // from a stale rectangle left behind by the earlier sections.
      if (confidencePhase === "confidence" && rectC) {
        const confidenceWidth = MathUtils.clamp(rectC.width * 0.72, 280, 430) * 0.5;
        const safeHalfWidth = confidenceWidth * 0.53;
        x = MathUtils.clamp(rectC.left + rectC.width / 2, safeHalfWidth, vp.width - safeHalfWidth);
        // Stay attached to Section 04. When its sticky stage releases, the
        // gavel follows the section upward and exits instead of remaining pinned.
        y = rectC.top + rectC.height / 2;
        width = confidenceWidth;
        opacity = confidenceZoneRect
          ? clamp(confidenceZoneRect.bottom / (vp.height * 0.22))
          : 1;
      }

      screenStateRef.current = { x, y, width: width * GAVEL_SIZE_SCALE, opacity };
      layer.style.opacity = opacity.toFixed(3);
      layer.style.visibility = opacity < 0.01 ? "hidden" : "visible";

      frame = requestAnimationFrame(updateLayer);
    };

    frame = requestAnimationFrame(updateLayer);
    return () => cancelAnimationFrame(frame);
  }, [motionRef]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={layerRef}
      className="gavel-floating-layer"
      aria-label="Three-dimensional judge's gavel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99,
        pointerEvents: "none",
        overflow: "hidden",
        contain: "strict",
        width: "100vw",
        height: "100dvh",
        willChange: "opacity",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 31 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          pointerEvents: "none",
        }}
      >
        <hemisphereLight args={["#ffe8c6", "#180b03", 1.05]} />
        <ambientLight intensity={0.45} color="#ffeed8" />
        <directionalLight position={[-4, 6, 7]} intensity={2.25} color="#fff1da" />
        <directionalLight position={[5, 1, 4]} intensity={1.1} color="#d99449" />
        <Suspense fallback={null}>
          <GavelModel screenStateRef={screenStateRef} />
        </Suspense>
      </Canvas>
    </div>,
    document.body,
  );
}

function GavelModel({
  screenStateRef,
}: {
  screenStateRef: MutableRefObject<GavelScreenState>;
}) {
  const positionGroup = useRef<Group>(null);
  const spinGroup = useRef<Group>(null);
  const { size, viewport } = useThree();
  const source = useGLTF(gavelModel).scene;
  const { model, center, modelWidth } = useMemo(() => {
    const model = source.clone(true);
    model.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(model);
    const center = bounds.getCenter(new Vector3());
    const modelWidth = Math.max(bounds.getSize(new Vector3()).x, 0.001);

    return { model, center, modelWidth };
  }, [source]);

  useFrame((_, delta) => {
    if (!positionGroup.current || !spinGroup.current) return;

    const target = screenStateRef.current;
    const worldX = (target.x / Math.max(size.width, 1) - 0.5) * viewport.width;
    const worldY = (0.5 - target.y / Math.max(size.height, 1)) * viewport.height;
    const worldWidth = (target.width / Math.max(size.width, 1)) * viewport.width;
    const scale = worldWidth / modelWidth;

    // Position and scale are direct functions of scroll. Reversing scroll can
    // no longer leave the model chasing an old target.
    positionGroup.current.position.set(worldX, worldY, 0);
    positionGroup.current.scale.setScalar(scale);
    spinGroup.current.rotation.y += GAVEL_ROTATION_SPEED * delta;
  });

  return (
    <group ref={positionGroup}>
      <group ref={spinGroup}>
        <group position={center.clone().multiplyScalar(-1)}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(gavelModel);
