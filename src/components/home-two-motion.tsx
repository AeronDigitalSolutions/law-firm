"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HomeTwoMotion() {
  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.querySelector<HTMLElement>("[data-home-two]");
    if (!root || reduceMotion) {
      root?.classList.add("motion-ready");
      return;
    }

    root.classList.add("motion-ready");
    const mm = gsap.matchMedia();
    const enterEase = "power3.out";
    const interactionCleanups: Array<() => void> = [];

    gsap.timeline({ defaults: { ease: enterEase } })
      .from("[data-motion='header-logo']", { y: -16, autoAlpha: 0, duration: 0.55 })
      .from("[data-motion='header-nav'] > *", { y: -12, autoAlpha: 0, duration: 0.4, stagger: 0.05 }, "-=0.38")
      .from("[data-motion='header-cta']", { y: -12, autoAlpha: 0, duration: 0.4 }, "-=0.3")
      .from("[data-motion='showcase-copy'] h1 span", { yPercent: 105, autoAlpha: 0, duration: 0.65, stagger: 0.06 }, "-=0.28")
      .from("[data-motion='showcase-copy'] p, [data-motion='showcase-copy'] a", { y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.04 }, "-=0.32")
      .from("[data-motion='showcase-model']", { scale: 0.94, xPercent: 3, autoAlpha: 0, duration: 0.75 }, "-=0.56")
      .from("[data-motion='showcase-proof'], [data-motion='showcase-detail']", { y: 16, autoAlpha: 0, duration: 0.45, stagger: 0.05 }, "-=0.5");

    gsap.timeline({
      defaults: { ease: enterEase },
      scrollTrigger: { trigger: "[data-motion='hero']", start: "top 82%" },
    })
      .from("[data-motion='hero-eyebrow']", { y: 18, autoAlpha: 0, duration: 0.55 })
      .from("[data-motion='hero-line']", { yPercent: 115, autoAlpha: 0, duration: 0.85, stagger: 0.1 }, "-=0.25")
      .from("[data-motion='hero-support']", { y: 24, autoAlpha: 0, duration: 0.55, stagger: 0.08 }, "-=0.45")
      .from("[data-motion='hero-media']", { scale: 1.075, autoAlpha: 0, duration: 1 }, "-=0.85");

    const header = root.querySelector<HTMLElement>("[data-motion='header']");
    if (header) {
      let lastY = window.scrollY;
      ScrollTrigger.create({
        start: 80,
        end: "max",
        onUpdate: (self) => {
          const goingDown = self.scroll() > lastY;
          header.dataset.compact = self.scroll() > 40 ? "true" : "false";
          gsap.to(header, { yPercent: goingDown && self.scroll() > 240 ? -105 : 0, duration: 0.38, ease: "power2.out", overwrite: true });
          lastY = self.scroll();
        },
      });
    }

    mm.add("(min-width: 721px)", () => {
      gsap.to("[data-motion='showcase-model']", {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: "[data-motion='showcase-hero']", start: "top top", end: "bottom top", scrub: 0.8 },
      });
      gsap.to("[data-motion='hero-copy']", {
        yPercent: -12,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: { trigger: "[data-motion='hero']", start: "top top", end: "bottom 25%", scrub: 0.8 },
      });
      gsap.fromTo("[data-motion='hero-image']", { scale: 1.06 }, {
        scale: 1,
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: "[data-motion='hero']", start: "top top", end: "bottom top", scrub: 0.8 },
      });

      root.querySelectorAll<HTMLElement>("[data-tilt]").forEach((element) => {
        const onMove = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -3;
          const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 3;
          gsap.to(element, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.45, ease: "power2.out" });
        };
        const onLeave = () => gsap.to(element, { rotateX: 0, rotateY: 0, duration: 0.65, ease: "power3.out" });
        element.addEventListener("pointermove", onMove);
        element.addEventListener("pointerleave", onLeave);
        interactionCleanups.push(() => {
          element.removeEventListener("pointermove", onMove);
          element.removeEventListener("pointerleave", onLeave);
        });
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-motion~='section-heading']").forEach((heading) => {
      gsap.from(heading, {
        y: 70,
        autoAlpha: 0,
        duration: 1.1,
        ease: enterEase,
        scrollTrigger: { trigger: heading, start: "top 86%", toggleActions: "play none none reverse" },
      });
    });

    gsap.from("[data-motion='client']", {
      y: 30,
      autoAlpha: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: enterEase,
      scrollTrigger: { trigger: "[data-motion='clients']", start: "top 84%" },
    });

    gsap.from("[data-motion='statement-copy']", {
      y: 36,
      autoAlpha: 0.18,
      duration: 1,
      stagger: 0.14,
      ease: enterEase,
      scrollTrigger: { trigger: "[data-motion='statement']", start: "top 74%" },
    });

    gsap.from("[data-motion~='service-item']", {
      clipPath: "inset(100% 0 0 0)",
      y: 34,
      autoAlpha: 0,
      duration: 0.95,
      stagger: 0.09,
      ease: enterEase,
      scrollTrigger: { trigger: "[data-motion='service-grid']", start: "top 78%" },
    });
    root.querySelectorAll<HTMLElement>("[data-motion~='service-photo']").forEach((photo) => {
      gsap.fromTo(photo.querySelector("img"), { scale: 1.12, yPercent: -4 }, {
        scale: 1.02,
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: 0.9 },
      });
    });

    root.querySelectorAll<HTMLElement>("[data-count]").forEach((counter) => {
      const target = Number(counter.dataset.count ?? 0);
      const suffix = counter.dataset.suffix ?? "";
      const value = { current: 0 };
      gsap.to(value, {
        current: target,
        duration: 1.7,
        ease: "power2.out",
        onUpdate: () => { counter.textContent = `${Math.round(value.current)}${suffix}`; },
        scrollTrigger: { trigger: counter, start: "top 85%", once: true },
      });
    });

    gsap.from("[data-motion='outcome-card']", {
      y: 90,
      scale: 0.94,
      autoAlpha: 0,
      duration: 1.05,
      stagger: 0.14,
      ease: enterEase,
      scrollTrigger: { trigger: "[data-motion='outcomes-grid']", start: "top 82%" },
    });

    gsap.from("[data-motion='leadership']", {
      clipPath: "inset(18% 0 0 0)",
      duration: 1.2,
      ease: "power3.inOut",
      scrollTrigger: { trigger: "[data-motion='leadership']", start: "top 88%" },
    });
    gsap.from("[data-motion='leader-card']", {
      y: 85,
      autoAlpha: 0,
      duration: 1.1,
      stagger: 0.16,
      ease: enterEase,
      scrollTrigger: { trigger: "[data-motion='leader-grid']", start: "top 80%" },
    });
    gsap.to("[data-motion='leader-quote']", {
      y: -12,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.from("[data-motion='contact']", {
      y: 90,
      autoAlpha: 0,
      duration: 1.1,
      ease: enterEase,
      scrollTrigger: { trigger: "[data-motion='contact']", start: "top 86%" },
    });
    gsap.from("[data-motion='footer'] > *", {
      y: 30,
      autoAlpha: 0,
      duration: 0.75,
      stagger: 0.09,
      ease: enterEase,
      scrollTrigger: { trigger: "[data-motion='footer']", start: "top 92%" },
    });

    return () => {
      interactionCleanups.forEach((cleanup) => cleanup());
      mm.revert();
    };
  });

  return null;
}
