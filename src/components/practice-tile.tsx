"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";

type PracticeTileProps = {
  title: string;
  description: string;
  index: number;
};

export function PracticeTile({ title, description, index }: PracticeTileProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <Reveal
      className={`practice-item practice-item-${index + 1}${isActive ? " is-interacting" : ""}`}
      delay={index * 60}
      onPointerEnter={() => setIsActive(true)}
      onPointerLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      tabIndex={0}
    >
      <span>0{index + 1}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <i aria-hidden="true" />
    </Reveal>
  );
}
