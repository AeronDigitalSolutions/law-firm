"use client";

import { useEffect, useRef, useState } from "react";
import { GavelScene, type GavelMotion } from "@/components/gavel-scene";
import { PenScene, type PenMotion } from "@/components/pen-scene";
import { clientLogos } from "@/components/clients-section";

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

      // Responsive, smooth scroll thresholds
      target.grid = clamp((progress - 0.08) / 0.32);
      target.penVertical = easeInOutCubic(clamp((progress - 0.12) / 0.32));
      target.foundation = clamp((progress - 0.4) / 0.3);
      target.penDepth = easeInOutCubic(clamp((progress - 0.45) / 0.3));
      target.takeover = easeInOutCubic(clamp((progress - 0.72) / 0.18));
      target.handoff = easeInOutCubic(clamp((progress - 0.84) / 0.16));
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
      panel.style.setProperty("--about-handoff", current.handoff.toFixed(3));
      penMotionRef.current.vertical = current.penVertical;
      penMotionRef.current.depth = current.penDepth;
      penMotionRef.current.active = current.penVertical > 0.01;

      gavelMotionRef.current.takeover = current.takeover;
      gavelMotionRef.current.handoff = current.handoff;
      gavelMotionRef.current.active = current.takeover > 0.01;

      // Begin the gavel layer before the handoff is visible so it can travel
      // continuously into the capabilities section without a remount flash.
      if (current.takeover > 0.76) {
        if (!penDismissedRef.current) {
          penDismissedRef.current = true;
          setShouldRenderPen(false);
        }
      } else {
        if (penDismissedRef.current) {
          penDismissedRef.current = false;
          setShouldRenderPen(true);
        }
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
          <div className="about-intro-left">
            <p className="section-index">01 / The firm</p>
            <h2 id="about-title">
              A practice built on continuity, judgment, and courtroom confidence.
            </h2>
          </div>

          <div className="about-intro-right">
            <div className="about-firm-photo-frame">
              <div className="about-firm-photo-inner">
                <img
                  src="/images/firm-consultation-portrait.jpg"
                  alt="SCM Associates partner consultation room"
                  className="about-firm-photo"
                />
              </div>
              <div className="about-quote-card">
                <span className="about-quote-symbol" aria-hidden="true">”</span>
                <blockquote className="about-quote-body">
                  <p>&ldquo;Justice delayed is justice denied.&rdquo;</p>
                  <cite>William E. Gladstone</cite>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        <div className="about-grid about-grid-motion leadership-dark-container">
          <div className="leadership-header-row">
            <div className="leadership-header-left">
              <p className="section-index">02 / Leadership</p>
              <h2>Founded on institutional wisdom.</h2>
            </div>
            <div className="leadership-header-right">
              <span>KALYAN &bull; MUMBAI &bull; MAHARASHTRA</span>
            </div>
          </div>

          <div className="leadership-cards-grid">
            <article className="leadership-card leadership-card-founder">
              <div className="leadership-photo-frame">
                <img
                  src="/images/sanjeev-mishra-portrait.png"
                  alt="Adv. Sanjeev C. Mishra"
                  className="leadership-photo"
                />
              </div>
              <div className="leadership-card-info">
                <span className="leadership-role-tag">FOUNDER & SENIOR PARTNER</span>
                <h3>Adv. Sanjeev C. Mishra</h3>
                <p>
                  More than three decades of representation, practical legal thinking,
                  and trusted client counsel. A veteran of the courts with a focus on civil
                  litigation and corporate strategy.
                </p>
              </div>
            </article>

            <article className="leadership-card leadership-card-managing">
              <div className="leadership-photo-frame">
                <img
                  src="/images/rahul-mishra-portrait.png"
                  alt="Adv. Rahul S. Mishra"
                  className="leadership-photo"
                />
              </div>
              <div className="leadership-card-info">
                <span className="leadership-role-tag">MANAGING PARTNER</span>
                <h3>Adv. Rahul S. Mishra</h3>
                <p>
                  A contemporary, business-aware approach grounded in institutional
                  legal wisdom. Specialized in financial recovery, regulatory compliance,
                  and private client advisory.
                </p>
              </div>
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
          <div className="about-gavel-statement-card">
            <div className="clients-badge">
              <span>OUR CLIENTS</span>
            </div>
            <h2 className="clients-title">
              Trusted by Industry Leaders
            </h2>
            <p className="clients-subtitle">
              SCM Associates has been privileged to represent and advise numerous corporate houses,
              financial institutions, business groups, entrepreneurs, and individual clients across multiple sectors.
            </p>
            <p className="clients-desc">
              Our continued association with leading corporate clients reflects the confidence they place in our
              legal expertise, professionalism, and commitment to delivering exceptional legal services.
            </p>

            <div className="clients-marquee-wrapper">
              <div className="clients-marquee-track">
                {[...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                  <div key={`${client.name}-${index}`} className="client-logo-card">
                    {client.svg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
