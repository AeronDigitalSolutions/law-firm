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

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smooth ease-in-out for the travel curve. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Viewport-centred rect where the gavel begins. */
function getSourceRect(vp: { width: number; height: number }): ViewRect {
  const slotEl = typeof document !== "undefined" ? document.querySelector<HTMLElement>("[data-gavel-source-slot]") : null;
  if (slotEl) {
    const sb = slotEl.getBoundingClientRect();
    if (sb.width > 0 && sb.height > 0) {
      return {
        left: sb.left,
        top: sb.top,
        width: sb.width,
        height: sb.height,
      };
    }
  }
  const w = Math.min(Math.max(vp.width * 0.28, 320), 460);
  const h = Math.min(Math.max(vp.height * 0.24, 200), 280);
  return {
    left: (vp.width - w) / 2,
    top: vp.height * 0.62,
    width: w,
    height: h,
  };
}

/** Fallback when [data-gavel-target] does not exist in the DOM. */
function getFallbackTarget(vp: { width: number; height: number }): ViewRect {
  return {
    left: vp.width * 0.57,
    top: vp.height * 0.26,
    width: vp.width * 0.31,
    height: vp.height * 0.45,
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
      if (!layer) {
        frame = requestAnimationFrame(updateLayer);
        return;
      }

      const vp = { width: window.innerWidth, height: window.innerHeight };
      const source = getSourceRect(vp);
      const takeover = clamp(motionRef.current.takeover);

      /* ---- Measure target every frame for scroll-locked accuracy ---- */
      const el = document.querySelector<HTMLElement>("[data-gavel-target]");
      const tb = el?.getBoundingClientRect();
      const target: ViewRect = tb
        ? { left: tb.left, top: tb.top, width: tb.width, height: tb.height }
        : getFallbackTarget(vp);

      /* ---- Scroll-locked handoff ----
       * Driven entirely by how far the target element's vertical centre
       * has risen from the viewport bottom toward the source centre.
       *
       *   target centre at / below viewport bottom  →  handoff = 0  (gavel centred)
       *   target centre at source centre             →  handoff = 1  (gavel at target)
       *
       * This means the gavel stays centred on the brown screen until
       * the practice section actually scrolls into view, then glides
       * smoothly to the target in lockstep with the scroll.
       */
      const srcCY = source.top + source.height / 2;
      const tgtCY = target.top + target.height / 2;
      const maxTravel = vp.height - srcCY;
      const currentTravel = vp.height - tgtCY;
      const rawHandoff = clamp(currentTravel / Math.max(maxTravel, 1));
      const handoff = smoothstep(rawHandoff);

      /* ---- Interpolate rect directly (no transform / scale hacks) ---- */
      const l = lerp(source.left, target.left, handoff);
      const t = lerp(source.top, target.top, handoff);
      const w = lerp(source.width, target.width, handoff);
      const h = lerp(source.height, target.height, handoff);

      layer.style.left = `${l}px`;
      layer.style.top = `${t}px`;
      layer.style.width = `${w}px`;
      layer.style.height = `${h}px`;
      layer.style.transform = "none";
      layer.style.clipPath = "none";

      /* Fade in once the brown takeover circle is large enough to
         fully cover the canvas area — avoids a rectangular flash. */
      layer.style.opacity = clamp((takeover - 0.45) / 0.35).toFixed(3);

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
      style={{ opacity: 0 }}
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
