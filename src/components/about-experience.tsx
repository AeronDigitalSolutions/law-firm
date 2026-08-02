"use client";

import { useEffect, useRef, useState } from "react";
import { GavelScene, type GavelMotion } from "@/components/gavel-scene";
import { PenScene, type PenMotion } from "@/components/pen-scene";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const damp = (value: number, target: number, response: number, delta: number) =>
  value + (target - value) * (1 - Math.exp(-response * delta));
const easeInOutCubic = (value: number) =>
  value < 0.5
    ? 4 * value * value * value
    : 1 - ((-2 * value + 2) ** 3) / 2;

type AboutMotion = {
  grid: number;
  foundation: number;
  penVertical: number;
  penDepth: number;
  takeover: number;
  handoff: number;
};

type AboutExperienceProps = {
  principles: string[];
};

export function AboutExperience({ principles }: AboutExperienceProps) {
  const zoneRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const penMotionRef = useRef<PenMotion>({ vertical: 0, depth: 0, active: false });
  const gavelMotionRef = useRef<GavelMotion>({ takeover: 0, handoff: 0, active: false });
  const [shouldRenderPen, setShouldRenderPen] = useState(true);
  const penDismissedRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();
    const target: AboutMotion = {
      grid: 0,
      foundation: 0,
      penVertical: 0,
      penDepth: 0,
      takeover: 0,
      handoff: 0,
    };
    const current: AboutMotion = { ...target };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setTargets = () => {
      const zone = zoneRef.current;
      if (!zone) return;

      const travel = Math.max(zone.offsetHeight - window.innerHeight, 1);
      const progress = clamp((window.scrollY - zone.offsetTop) / travel);

      // The pen crosses the visual center before the leadership screen settles.
      target.grid = clamp((progress - 0.2) / 0.18);
      target.penVertical = easeInOutCubic(clamp((progress - 0.28) / 0.18));
      target.foundation = clamp((progress - 0.52) / 0.16);
      target.penDepth = easeInOutCubic(clamp((progress - 0.6) / 0.16));
      target.takeover = easeInOutCubic(clamp((progress - 0.74) / 0.12));
      target.handoff = easeInOutCubic(clamp((progress - 0.85) / 0.13));
    };

    const applyMotion = () => {
      const panel = panelRef.current;
      if (!panel) return;

      panel.style.setProperty("--about-grid", current.grid.toFixed(3));
      panel.style.setProperty("--about-foundation", current.foundation.toFixed(3));
      panel.style.setProperty("--about-intro-y", `${current.grid * -118}dvh`);
      panel.style.setProperty("--about-grid-y", `${(1 - current.grid) * 118}dvh`);
      panel.style.setProperty("--about-foundation-y", `${(1 - current.foundation) * 135}%`);
      panel.style.setProperty("--about-takeover", `${current.takeover * 155}vmax`);
      penMotionRef.current.vertical = current.penVertical;
      penMotionRef.current.depth = current.penDepth;
      penMotionRef.current.active = current.penVertical > 0.01;

      gavelMotionRef.current.takeover = current.takeover;
      gavelMotionRef.current.handoff = current.handoff;
      gavelMotionRef.current.active = current.takeover > 0.01;

      // Begin the gavel layer before the handoff is visible so it can travel
      // continuously into the capabilities section without a remount flash.
      if (current.takeover > 0.76 && !penDismissedRef.current) {
        penDismissedRef.current = true;
        setShouldRenderPen(false);
      }
    };

    const tick = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (reducedMotion.matches) {
        Object.assign(current, target);
      } else {
        current.grid = damp(current.grid, target.grid, 7, delta);
        current.foundation = damp(current.foundation, target.foundation, 8, delta);
        current.penVertical = damp(current.penVertical, target.penVertical, 6, delta);
        current.penDepth = damp(current.penDepth, target.penDepth, 6, delta);
        current.takeover = damp(current.takeover, target.takeover, 12, delta);
        current.handoff = damp(current.handoff, target.handoff, 12, delta);
      }

      applyMotion();
      const settled = Object.keys(current).every((key) =>
        Math.abs(current[key as keyof AboutMotion] - target[key as keyof AboutMotion]) < 0.001,
      );
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const update = () => {
      setTargets();
      schedule();
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={zoneRef} id="about" className="about-scroll-zone" aria-labelledby="about-title">
      <div ref={panelRef} className="about-scroll-panel">
        <div className="about-intro">
          <p className="section-index">01 / The firm</p>
          <h2 id="about-title">
            A practice built on continuity, judgment, and courtroom confidence.
          </h2>
        </div>

        <div className="about-grid about-grid-motion">
          <div className="about-statement">
            <p>
              SCM Associates advises clients who need legal clarity, courtroom
              confidence, and commercially sound judgment in the same room.
            </p>
          </div>

          <div className="monogram-stage" aria-hidden="true" />

          <div className="leadership-note">
            <article>
              <span>Established by</span>
              <h3>Adv. Sanjeev C. Mishra</h3>
              <p>
                More than three decades of representation, practical legal thinking,
                and trusted client counsel.
              </p>
            </article>
            <article>
              <span>Jointly led with</span>
              <h3>Adv. Rahul S. Mishra</h3>
              <p>
                A contemporary, business-aware approach grounded in institutional
                legal wisdom.
              </p>
            </article>
          </div>
        </div>

        <div className="foundation-bar foundation-bar-motion">
          {principles.map((principle, index) => (
            <article key={principle}>
              <span>0{index + 1}</span>
              <strong>{principle}</strong>
            </article>
          ))}
        </div>

        <div className="about-takeover" aria-hidden="true" />
        {shouldRenderPen ? <PenScene motionRef={penMotionRef} /> : null}
        <GavelScene motionRef={gavelMotionRef} />
        <div className="about-takeover-label" aria-hidden="true">
          <div>
            <span>Measured judgment</span>
            <i />
            <span>Decisive action</span>
          </div>
        </div>
      </div>
    </section>
  );
}
