"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Box3, Group, MathUtils, PerspectiveCamera, Vector3 } from "three";
import ladyJusticeModel from "@/glb/Lady Justice.glb";

const FINAL_Y_ROTATION = -0.55;
const FULL_TURN = Math.PI * 2;
const CAMERA_FILL = 0.72;

type HeroSceneProps = {
  progressRef: React.MutableRefObject<number>;
  chapterProgressRef: React.MutableRefObject<number>;
  settleProgressRef: React.MutableRefObject<number>;
};

export function HeroScene({ progressRef, chapterProgressRef, settleProgressRef }: HeroSceneProps) {
  return (
    <div className="hero-scene" aria-label="Lady Justice, a three-dimensional legal symbol">
      <Canvas
        camera={{ position: [0, 0.4, 8.2], fov: 32 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <hemisphereLight args={["#fff7eb", "#2d1b0d", 0.62]} />
        <ambientLight intensity={0.28} color="#f8f0e4" />
        <directionalLight position={[-4, 5, 6]} intensity={1.45} color="#fff1dc" />
        <directionalLight position={[4, 2, -5]} intensity={0.46} color="#c4d2e1" />
        <directionalLight position={[0, 6, 1]} intensity={0.32} color="#fffaf2" />
        <JusticeModel
          progressRef={progressRef}
          chapterProgressRef={chapterProgressRef}
          settleProgressRef={settleProgressRef}
        />
      </Canvas>
    </div>
  );
}

function JusticeModel({ progressRef, chapterProgressRef, settleProgressRef }: HeroSceneProps) {
  const group = useRef<Group>(null);
  const didInitialize = useRef(false);
  const { camera, size, viewport } = useThree();
  const source = useGLTF(ladyJusticeModel).scene;
  const { model, radius } = useMemo(() => {
    const normalizedModel = source.clone(true);
    const bounds = new Box3().setFromObject(normalizedModel);
    const rawSize = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    // Scale Lady Justice to fill the height equivalent to the left vertical text block
    const scale = Math.min(
      7.5 / rawSize.y,
      8.8 / rawSize.x,
      8.8 / rawSize.z,
    );
    normalizedModel.position.copy(center).multiplyScalar(-scale);
    normalizedModel.scale.setScalar(scale);
    normalizedModel.traverse((object) => {
      object.frustumCulled = true;
    });
    normalizedModel.updateMatrixWorld(true);

    const framedBounds = new Box3().setFromObject(normalizedModel);
    const framedSize = framedBounds.getSize(new Vector3());

    return {
      model: normalizedModel,
      radius: framedSize.length() / 2,
    };
  }, [source]);

  useLayoutEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      const verticalFov = MathUtils.degToRad(camera.fov);
      const horizontalFov = 2 * Math.atan(
        Math.tan(verticalFov / 2) * (size.width / size.height),
      );
      const distance = Math.max(
        radius / Math.sin(verticalFov / 2),
        radius / Math.sin(horizontalFov / 2),
      ) * CAMERA_FILL;

      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [camera, radius, size.height, size.width]);

  useLayoutEffect(() => {
    if (!group.current || didInitialize.current) return;

    // Lower initial Y position so the statue is fully below the canvas frame at rest
    group.current.position.set(viewport.width * 0.16, -viewport.height * 2.2, 0);
    group.current.scale.setScalar(1);
    didInitialize.current = true;
  }, [viewport.height, viewport.width]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const progress = progressRef.current;
    const chapterProgress = chapterProgressRef.current;
    const settleProgress = settleProgressRef.current;

    // Only render statue once user begins scrolling into hero motion
    group.current.visible = progress > 0.005 || chapterProgress > 0;

    // Keep the complete figure inside the canvas in both chapters. The model
    // moves between composed positions rather than the canvas being translated.
    const heroX = viewport.width * 0.16;
    const chapterX = -viewport.width * 0.17;
    const enteringY = -viewport.height * 2.2;
    const chapterY = -viewport.height * 0.04;
    const chapterScale = MathUtils.lerp(1, 1.06, chapterProgress);
    const breath = Math.sin(state.clock.elapsedTime * 0.42) * 0.012 * (1 - chapterProgress * 0.35);

    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      // The chapter transition adds a half-turn, followed by a slower full settling turn.
      FINAL_Y_ROTATION - FULL_TURN + progress * FULL_TURN + chapterProgress * Math.PI + settleProgress * FULL_TURN,
      6,
      delta,
    );
    group.current.scale.setScalar(MathUtils.damp(group.current.scale.x, chapterScale, 6, delta));
    group.current.position.x = MathUtils.damp(
      group.current.position.x,
      MathUtils.lerp(heroX, chapterX, chapterProgress),
      6,
      delta,
    );
    group.current.position.y = MathUtils.damp(
      group.current.position.y,
      MathUtils.lerp(
        MathUtils.lerp(enteringY, 0, progress),
        chapterY,
        chapterProgress,
      ) + breath,
      6,
      delta,
    );
  });

  return (
    <group ref={group} rotation={[0, FINAL_Y_ROTATION - FULL_TURN, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(ladyJusticeModel);
