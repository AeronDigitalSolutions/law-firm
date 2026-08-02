"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  Box3,
  Color,
  Euler,
  Group,
  Material,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  Quaternion,
  Vector3,
} from "three";
import penModel from "@/glb/PEN1.glb";

const PEN_SPIN_SPEED = 0.32;
const PEN_BODY_TINT = new Color("#9b7d5e");

// Keep the nib lower than the pen body in the opening diagonal pose.
const INITIAL_PEN_ORIENTATION = new Euler(0, Math.PI / 4, (3 * Math.PI) / 4);
const VERTICAL_PEN_ORIENTATION = new Euler(0, 0, Math.PI / 2);
const DEPTH_PEN_ORIENTATION = new Euler(0, Math.PI / 2, 0);

export type PenMotion = {
  vertical: number;
  depth: number;
  active: boolean;
};

type TunableMaterial = Material & {
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
};

function tunePenMaterial(material: Material) {
  const tuned = material.clone() as TunableMaterial;

  // Preserve bright metal trims, while lifting only the nearly-black barrel.
  const luminance = tuned.color
    ? tuned.color.r * 0.2126 + tuned.color.g * 0.7152 + tuned.color.b * 0.0722
    : 1;
  if (tuned.color && luminance < 0.18) {
    tuned.color.lerp(PEN_BODY_TINT, 0.48);
  }
  if (tuned.emissive) {
    tuned.emissive.set("#1d130c");
    tuned.emissiveIntensity = 0.16;
  }
  if (typeof tuned.metalness === "number") tuned.metalness = Math.min(tuned.metalness, 0.64);
  if (typeof tuned.roughness === "number") tuned.roughness = Math.max(tuned.roughness, 0.34);

  return tuned;
}

function getObjectBounds(root: Group, suffix: string): Box3 | null {
  let result: Box3 | null = null;

  root.traverse((object) => {
    if (!result && object.name.endsWith(suffix)) {
      result = new Box3().setFromObject(object);
    }
  });

  return result;
}

function getBoundsCorners(bounds: Box3) {
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

export function PenScene({ motionRef }: { motionRef: React.MutableRefObject<PenMotion> }) {
  return (
    <div className="about-pen" aria-label="Three-dimensional fountain pen">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 30 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <hemisphereLight args={["#fff8ef", "#50331e", 0.72]} />
        <ambientLight intensity={0.42} color="#fff4e4" />
        <directionalLight position={[-4, 5, 6]} intensity={2.1} color="#fff0d8" />
        <directionalLight position={[5, 2, 4]} intensity={0.78} color="#c5d4e1" />
        <directionalLight position={[0, -2, 5]} intensity={0.54} color="#f4d8ae" />
        <PenModel motionRef={motionRef} />
      </Canvas>
    </div>
  );
}

function PenModel({ motionRef }: { motionRef: React.MutableRefObject<PenMotion> }) {
  const positionGroup = useRef<Group>(null);
  const orientationGroup = useRef<Group>(null);
  const spinGroup = useRef<Group>(null);
  const { camera, size, viewport } = useThree();
  const source = useGLTF(penModel).scene;
  const { model, radius, baseAlignment } = useMemo(() => {
    const normalizedModel = source.clone(true);
    const bounds = new Box3().setFromObject(normalizedModel);
    const modelSize = bounds.getSize(new Vector3());
    const scale = 4.6 / Math.max(modelSize.x, modelSize.y, modelSize.z);
    const nibBounds = getObjectBounds(normalizedModel, "_5");
    const capBounds = getObjectBounds(normalizedModel, "_6");
    const fallbackNub = bounds.min.clone();
    const capCenter = capBounds?.getCenter(new Vector3()) ?? bounds.max.clone();
    const nibCenter = nibBounds?.getCenter(new Vector3()) ?? fallbackNub;
    const preliminaryAxis = capCenter.clone().sub(nibCenter).normalize();

    // Anchor the actual metal nib, not the imported model's bounding-box center.
    // This lets the final depth-facing pose and the CSS circle share one true origin.
    const nibPoint = nibBounds
      ? getBoundsCorners(nibBounds).reduce((closest, point) => (
        point.clone().sub(capCenter).dot(preliminaryAxis) < closest.clone().sub(capCenter).dot(preliminaryAxis)
          ? point
          : closest
      ))
      : fallbackNub;
    const penAxis = capCenter.clone().sub(nibPoint).normalize();
    const baseAlignment = new Quaternion().setFromUnitVectors(penAxis, new Vector3(1, 0, 0));

    normalizedModel.position.copy(nibPoint).multiplyScalar(-scale);
    normalizedModel.scale.setScalar(scale);
    normalizedModel.traverse((object) => {
      object.frustumCulled = true;
      if ((object as Mesh).isMesh) {
        const mesh = object as Mesh;
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map(tunePenMaterial)
          : tunePenMaterial(mesh.material);
      }
    });
    normalizedModel.updateMatrixWorld(true);

    const framedSize = new Box3().setFromObject(normalizedModel).getSize(new Vector3());
    return { model: normalizedModel, radius: framedSize.length(), baseAlignment };
  }, [source]);

  const initialOrientation = useMemo(
    () => new Quaternion().setFromEuler(INITIAL_PEN_ORIENTATION),
    [],
  );
  const verticalOrientation = useMemo(
    () => new Quaternion().setFromEuler(VERTICAL_PEN_ORIENTATION),
    [],
  );
  const depthOrientation = useMemo(
    () => new Quaternion().setFromEuler(DEPTH_PEN_ORIENTATION),
    [],
  );
  const targetOrientation = useRef(new Quaternion());

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;

    const verticalFov = MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(
      Math.tan(verticalFov / 2) * (size.width / size.height),
    );
    const distance = Math.max(
      radius / Math.sin(verticalFov / 2),
      radius / Math.sin(horizontalFov / 2),
    ) * 1.16;

    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, radius, size.height, size.width]);

  useLayoutEffect(() => {
    if (!positionGroup.current || !orientationGroup.current) return;

    positionGroup.current.position.set(viewport.width * 0.36, -viewport.height * 0.23, 0);
    positionGroup.current.scale.setScalar(0.72);
    orientationGroup.current.quaternion.copy(initialOrientation);
  }, [initialOrientation, viewport.height, viewport.width]);

  useFrame((_, delta) => {
    if (!positionGroup.current || !orientationGroup.current || !spinGroup.current) return;

    const { vertical, depth, active } = motionRef.current;
    const initialX = viewport.width * 0.36;
    const initialY = -viewport.height * 0.23;

    // The imported pen is diagonal on its own axes. Align it once, then animate
    // predictable screen-space poses: diagonal, vertical, and finally depth-facing.
    targetOrientation.current
      .copy(initialOrientation)
      .slerp(verticalOrientation, vertical)
      .slerp(depthOrientation, depth);
    orientationGroup.current.quaternion.slerp(
      targetOrientation.current,
      1 - Math.exp(-6 * delta),
    );
    positionGroup.current.position.x = MathUtils.damp(
      positionGroup.current.position.x,
      MathUtils.lerp(initialX, 0, vertical),
      6,
      delta,
    );
    positionGroup.current.position.y = MathUtils.damp(
      positionGroup.current.position.y,
      MathUtils.lerp(initialY, 0, vertical),
      6,
      delta,
    );
    positionGroup.current.scale.setScalar(MathUtils.damp(
      positionGroup.current.scale.x,
      MathUtils.lerp(0.64, 0.78, vertical),
      6,
      delta,
    ));

    const spinTarget = active ? 0 : PEN_SPIN_SPEED;
    spinGroup.current.rotation.y += MathUtils.damp(0, spinTarget, 7, delta) * delta;
    if (active) {
      spinGroup.current.rotation.y = MathUtils.damp(spinGroup.current.rotation.y, 0, 7, delta);
    }
  });

  return (
    <group ref={positionGroup}>
      <group ref={orientationGroup}>
        <group ref={spinGroup}>
          <group quaternion={baseAlignment}>
            <primitive object={model} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(penModel);
