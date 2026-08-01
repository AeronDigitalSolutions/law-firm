"use client";

import { useEffect, useRef, type RefObject } from "react";
import { HeroScene } from "@/components/hero-scene";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const damp = (value: number, target: number, response: number, delta: number) =>
  value + (target - value) * (1 - Math.exp(-response * delta));
const easeInOutCubic = (value: number) =>
  value < 0.5
    ? 4 * value * value * value
    : 1 - ((-2 * value + 2) ** 3) / 2;

type MotionState = {
  progress: number;
  copy: number;
  model: number;
  rail: number;
  takeover: number;
  chapter: number;
  settle: number;
};

export function HeroExperience() {
  const zoneRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const chapterProgressRef = useRef(0);
  const settleProgressRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();
    let alignmentTargets: Array<{ element: HTMLElement; offset: number }> = [];
    const target: MotionState = {
      progress: 0,
      copy: 0,
      model: 0,
      rail: 0,
      takeover: 0,
      chapter: 0,
      settle: 0,
    };
    const current: MotionState = { ...target };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measureAlignment = () => {
      const copy = copyRef.current;
      if (!copy) return;

      alignmentTargets = Array.from(
        copy.querySelectorAll<HTMLElement>("[data-hero-align]"),
      ).map((element) => ({
        element,
        offset: Math.max(0, (copy.clientWidth - element.offsetWidth) / 2),
      }));
    };

    const setTargets = () => {
      const zone = zoneRef.current;
      if (!zone) return;

      const travel = Math.max(zone.offsetHeight - window.innerHeight, 1);
      const progress = clamp((window.scrollY - zone.offsetTop) / travel);
      target.progress = progress;
      target.copy = clamp((progress - 0.1) / 0.3);
      // The text and statue complete their transition together.
      target.model = target.copy;
      target.rail = clamp((progress - 0.48) / 0.22);
      // The next chapter begins only after the hero reaches its settled state.
      target.takeover = easeInOutCubic(clamp((progress - 0.7) / 0.1));
      target.chapter = clamp((progress - 0.8) / 0.12);
      // The settled composition holds while the statue completes one full final turn.
      target.settle = clamp((progress - 0.92) / 0.06);
    };

    const applyMotion = () => {
      const stage = stageRef.current;
      if (!stage) return;

      progressRef.current = current.model;
      chapterProgressRef.current = current.chapter;
      settleProgressRef.current = current.settle;
      stage.style.setProperty("--hero-progress", current.progress.toFixed(3));
      stage.style.setProperty("--hero-copy-progress", current.copy.toFixed(3));
      stage.style.setProperty("--hero-model-progress", current.model.toFixed(3));
      stage.style.setProperty("--hero-rail-progress", current.rail.toFixed(3));
      stage.style.setProperty("--hero-takeover-radius", `${current.takeover * 154}vmax`);
      // Keep chapter copy fully outside the viewport until the brown cover is complete.
      const headingProgress = clamp((current.chapter - 0.08) / 0.82);
      const bodyProgress = clamp((current.chapter - 0.18) / 0.76);
      stage.style.setProperty("--hero-chapter-left", `${(1 - headingProgress) * -120}vw`);
      stage.style.setProperty("--hero-chapter-right", `${(1 - bodyProgress) * 120}vw`);
      stage.style.setProperty("--hero-chapter-body", bodyProgress.toFixed(3));
      stage.style.setProperty("--hero-copy-left", `${50 - current.copy * 45}%`);
      stage.style.setProperty("--hero-copy-x", `${-50 + current.copy * 50}%`);
      stage.style.setProperty("--hero-title-tracking", `${-0.07 - current.copy * 0.006}em`);
      stage.style.setProperty("--hero-title-leading", `${0.87 - current.copy * 0.015}`);
      alignmentTargets.forEach(({ element, offset }) => {
        element.style.setProperty("--hero-align-x", `${-offset * current.copy}px`);
      });
      stage.style.setProperty("--hero-model-y", `${(1 - current.model) * 82}%`);
      stage.style.setProperty("--hero-rail-x", `${(1 - current.rail) * 9}rem`);
      // The practice bar enters as one solid panel, without a fade.
      stage.style.setProperty("--hero-footer-y", `${(1 - current.rail) * 108}%`);
    };

    const tick = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (reducedMotion.matches) {
        Object.assign(current, target);
      } else {
        // Each layer has a different response weight, producing real inertia.
        current.progress = damp(current.progress, target.progress, 10, delta);
        current.copy = damp(current.copy, target.copy, 13, delta);
        current.model = damp(current.model, target.model, 8, delta);
        current.rail = damp(current.rail, target.rail, 10, delta);
        current.takeover = damp(current.takeover, target.takeover, 5, delta);
        current.chapter = damp(current.chapter, target.chapter, 6, delta);
        current.settle = damp(current.settle, target.settle, 3.8, delta);
      }

      applyMotion();

      const isSettled = Object.keys(current).every((key) =>
        Math.abs(current[key as keyof MotionState] - target[key as keyof MotionState]) < 0.001,
      );
      frame = isSettled ? 0 : requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    measureAlignment();
    setTargets();
    applyMotion();
    const observer = new ResizeObserver(measureAlignment);
    if (copyRef.current) observer.observe(copyRef.current);
    const handleResize = () => {
      measureAlignment();
      setTargets();
      schedule();
    };
    const handleScroll = () => {
      setTargets();
      schedule();
    };
    const handleMotionPreference = () => {
      setTargets();
      schedule();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <section ref={zoneRef} id="top" className="hero-scroll" aria-labelledby="hero-title">
      <div ref={stageRef} className="hero-panel">
        <HeroCopy copyRef={copyRef} />

        <div className="hero-visual">
          <HeroScene
            progressRef={progressRef}
            chapterProgressRef={chapterProgressRef}
            settleProgressRef={settleProgressRef}
          />
        </div>

        <aside className="hero-rail" aria-label="Firm principles">
          <span>Global perspective</span>
          <i aria-hidden="true" />
          <span>Local knowledge</span>
          <i aria-hidden="true" />
          <span>Discreet by design</span>
          <i aria-hidden="true" />
          <span>Focused on outcomes</span>
        </aside>

        <div className="hero-footer" aria-label="Practice focus">
          <span>Litigation</span>
          <span>Corporate</span>
          <span>Regulatory</span>
          <span>Financial institutions</span>
          <span>Private client</span>
        </div>

        <div className="hero-takeover" aria-hidden="true" />

        <section className="hero-takeover-content" aria-labelledby="legacy-title">
          <div className="hero-takeover-heading">
            <p className="hero-takeover-index">01 / The legacy</p>
            <h2 id="legacy-title">Three decades of practice.</h2>
          </div>

          <div className="hero-takeover-points">
            <article>
              <span>01</span>
              <h3>Litigation and advisory depth</h3>
              <p>Built for challenging disputes as well as consequential business decisions.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Discretion that sustains long relationships</h3>
              <p>Professional standards that remain steady from the first brief to final resolution.</p>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}

function HeroCopy({ copyRef }: { copyRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={copyRef} className="hero-copy">
      <p className="hero-kicker" data-hero-align>
        Advocates <span>/</span> Legal consultants <span>/</span> Corporate advisors
      </p>
      <h1 id="hero-title">
        <span className="hero-title-line" data-hero-align>Legal clarity</span>
        <span className="hero-title-line" data-hero-align>when the</span>
        <span className="hero-title-line" data-hero-align>stakes</span>
        <span className="hero-title-line" data-hero-align>are high.</span>
      </h1>
      <p className="hero-text">
        <span className="hero-text-line" data-hero-align>Trusted representation and strategic advice</span>
        <span className="hero-text-line" data-hero-align>for disputes, transactions, and decisive</span>
        <span className="hero-text-line" data-hero-align>corporate moments.</span>
      </p>
      <a href="#contact" className="button-primary" data-hero-align>
        <span>Request consultation</span>
        <b aria-hidden="true">↗</b>
      </a>
    </div>
  );
}
