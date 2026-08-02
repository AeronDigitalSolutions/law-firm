"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Box3, Group, MathUtils, PerspectiveCamera, Vector3 } from "three";

import ladyJusticeModel from "@/glb/Lady Justice.glb";
import gavelModel from "@/glb/judges_gavel.glb";

type Commitment = {
  value: string;
  label: string;
};

type Phase = "approach" | "transition" | "confidence";

type ApproachConfidenceExperienceProps = {
  commitments: Commitment[];
  principles: string[];
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function frameCamera(
  camera: PerspectiveCamera,
  width: number,
  height: number,
  radius: number,
  target: Vector3,
  zoomMultiplier: number = 1.15,
) {
  const fov = MathUtils.degToRad(camera.fov);
  const aspect = Math.max(width / height, 0.6);
  const distance = Math.max(
    (radius / Math.tan(fov / 2)) * zoomMultiplier,
    (radius / (Math.tan(fov / 2) * aspect)) * (zoomMultiplier * 0.94),
    6.0,
  );

  camera.position.set(target.x, target.y + 0.05, target.z + distance);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
}

function JusticeModel({ active }: { active: boolean }) {
  const source = useGLTF(ladyJusticeModel).scene;
  const group = useRef<Group>(null);
  const { camera, size } = useThree();

  const { model, radius } = useMemo(() => {
    const model = source.clone(true);
    model.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(model);
    const rawSize = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = Math.min(4.35 / rawSize.y, 5.1 / rawSize.x, 5.1 / rawSize.z);

    model.position.copy(center).multiplyScalar(-scale);
    model.scale.setScalar(scale);
    model.updateMatrixWorld(true);

    const framedBounds = new Box3().setFromObject(model);

    return {
      model,
      radius: framedBounds.getSize(new Vector3()).length() / 2,
    };
  }, [source]);

  useLayoutEffect(() => {
    frameCamera(camera as PerspectiveCamera, size.width, size.height, radius, new Vector3(), 1.15);
  }, [camera, radius, size.height, size.width]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (active ? 0.14 : 0.06);
    }
  });

  return (
    <group ref={group} position={[0, -0.15, 0]} rotation={[0, -0.35, 0]}>
      <primitive object={model} />
    </group>
  );
}

function GavelModel({ active }: { active: boolean }) {
  const source = useGLTF(gavelModel).scene;
  const spinGroup = useRef<Group>(null);
  const { camera, size } = useThree();

  const { model, center, radius } = useMemo(() => {
    const model = source.clone(true);
    model.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(model);
    const center = bounds.getCenter(new Vector3());
    const radius = bounds.getSize(new Vector3()).length() / 2;

    return { model, center, radius };
  }, [source]);

  useLayoutEffect(() => {
    frameCamera(camera as PerspectiveCamera, size.width, size.height, radius, center, 1.4);
  }, [camera, center, radius, size.height, size.width]);

  useFrame((_, delta) => {
    if (spinGroup.current) {
      spinGroup.current.rotation.y += delta * (active ? 0.42 : 0.08);
    }
  });

  return (
    <group ref={spinGroup} position={center}>
      <group position={center.clone().multiplyScalar(-1)}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function JusticeCanvas({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={1}
      camera={{ position: [0, 0, 8], fov: 31 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <hemisphereLight args={["#fff7eb", "#2d1b0d", 0.64]} />
      <ambientLight color="#f8f0e4" intensity={0.31} />
      <directionalLight color="#fff1dc" intensity={1.4} position={[-4, 5, 6]} />
      <directionalLight color="#c4d2e1" intensity={0.42} position={[4, 2, -5]} />
      <directionalLight color="#fffaf2" intensity={0.34} position={[0, 6, 1]} />
      <Suspense fallback={null}>
        <JusticeModel active={active} />
      </Suspense>
    </Canvas>
  );
}

function GavelCanvas({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={1}
      camera={{ position: [0, 0, 8], fov: 31 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <hemisphereLight args={["#fff6e6", "#1f0e05", 0.62]} />
      <ambientLight color="#f8e8ce" intensity={0.3} />
      <directionalLight color="#ffe2a5" intensity={1.25} position={[-4, 5, 6]} />
      <directionalLight color="#c88a3f" intensity={0.55} position={[5, 2, -4]} />
      <Suspense fallback={null}>
        <GavelModel active={active} />
      </Suspense>
    </Canvas>
  );
}

export function ApproachConfidenceExperience({
  commitments,
  principles,
}: ApproachConfidenceExperienceProps) {
  const zoneRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [phase, setPhase] = useState<Phase>("approach");

  useEffect(() => {
    const node = zoneRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = zoneRef.current;
    if (!node) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const travel = Math.max(node.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);
      const nextPhase: Phase =
        progress < 0.43 ? "approach" : progress < 0.54 ? "transition" : "confidence";

      setPhase((current) => (current === nextPhase ? current : nextPhase));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="approach" className="ac-zone" ref={zoneRef} aria-label="Our approach and client confidence">
      <div className="ac-stage" data-entered={entered ? "true" : "false"} data-phase={phase}>
        <div className="ac-model-stage" aria-hidden="true">
          <div className="ac-model ac-lady-model">
            <JusticeCanvas active={phase === "approach"} />
          </div>
          <div className="ac-model ac-gavel-model">
            <GavelCanvas active={phase === "confidence"} />
          </div>
        </div>

        <div className="ac-layer">
          <article className="ac-approach-copy">
            <p className="section-index">03 / Our approach</p>
            <h2 id="approach-title">
              “Practical, result-oriented legal solutions aligned with each client&apos;s commercial reality.”
            </h2>
            <span className="ac-tail" aria-hidden="true" />
          </article>

          <div className="ac-commitments" aria-label="Our approach principles">
            {commitments.map((commitment, index) => (
              <article className="ac-commitment" key={commitment.value}>
                <span>0{index + 1}</span>
                <div>
                  <strong>{commitment.value}</strong>
                  <p>{commitment.label}</p>
                </div>
              </article>
            ))}
          </div>

          <article className="ac-confidence-copy">
            <p className="section-index">04 / Client confidence</p>
            <h2 id="reputation-title">
              Long-term relationships built on trust, professionalism, and results.
            </h2>
            <a className="ac-text-link" href="#contact">
              Our commitment to you <span aria-hidden="true">→</span>
            </a>
          </article>

          <aside className="ac-confidence-note">
            <p>
              SCM Associates continues to advise corporate houses, business groups,
              entrepreneurs, financial institutions, and individual stakeholders who value
              measured legal judgment.
            </p>
            <span>Continuity matters.</span>
          </aside>
        </div>

        <div className="ac-principle-bar" aria-label="Client confidence principles">
          {principles.map((principle, index) => (
            <span key={principle}>
              <b>0{index + 1}</b>
              {principle}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

useGLTF.preload(ladyJusticeModel);
useGLTF.preload(gavelModel);
