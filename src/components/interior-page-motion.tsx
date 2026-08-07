"use client";

import { useEffect } from "react";

export function InteriorPageMotion() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-interior-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
