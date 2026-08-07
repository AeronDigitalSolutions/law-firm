import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InteriorFooter } from "@/components/interior-footer";
import { InteriorHeader } from "@/components/interior-header";
import { InteriorPageMotion } from "@/components/interior-page-motion";

export const metadata: Metadata = {
  title: "Our Approach | SCM Associates",
  description: "Learn how SCM Associates brings clarity, preparation, commercial judgment, and discreet execution to each legal matter.",
};

const process = [
  ["Listen", "Understand the full context", "We begin with the facts, the objective, and the realities surrounding the matter. The legal question is considered alongside its commercial and personal implications."],
  ["Assess", "Define the position", "We identify the central issues, available options, and material risks so the client has a clear view of the path ahead."],
  ["Prepare", "Build the strategy", "Advice, negotiation, drafting, and advocacy are prepared with discipline. Every step supports the agreed objective."],
  ["Act", "Execute with judgment", "We move decisively while keeping the client informed. As circumstances change, the strategy remains responsive and practical."],
];

export default function OurApproachPage() {
  return (
    <main className="interior-page">
      <InteriorPageMotion />
      <InteriorHeader current="/our-approach" />

      <section className="interior-hero" aria-labelledby="approach-title">
        <div className="interior-hero-copy">
          <p className="interior-eyebrow">Our approach</p>
          <h1 id="approach-title">Clear thinking. Decisive action.</h1>
          <p>Each matter receives a strategy grounded in law, context, and the client’s objective.</p>
          <Link className="interior-hero-link" href="/home-2#contact-two">Start a confidential conversation</Link>
        </div>
        <div className="interior-hero-media">
          <Image src="/images/law-firm-confidence-consultation.jpg" alt="Detailed preparation for a legal matter" fill priority sizes="(max-width: 960px) 100vw, 52vw" />
        </div>
      </section>

      <section className="interior-statement" data-interior-reveal>
        <span>Working principle</span>
        <div><h2>Strategy begins with understanding.</h2><p>There is no useful standard answer to a consequential legal problem. We examine the complete situation, communicate directly, and build a course of action that fits the client’s priorities.</p></div>
      </section>

      <section className="interior-panel" aria-labelledby="process-title">
        <div className="interior-panel-heading" data-interior-reveal><h2 id="process-title">A disciplined way forward.</h2><p>Our method keeps complex matters structured without losing sight of the people and decisions behind them.</p></div>
        <div className="interior-process">
          {process.map(([verb, title, copy]) => <article key={verb} data-interior-reveal><span>{verb}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="interior-editorial" data-interior-reveal>
        <div className="interior-editorial-media"><Image src="/images/firm-consultation-portrait.jpg" alt="Counsel discussing strategy with a client" fill sizes="(max-width: 960px) 100vw, 40vw" /></div>
        <div className="interior-editorial-copy"><h2>Communication is part of the work.</h2><p>Clients should understand where a matter stands and why a particular step is being taken. We communicate clearly, promptly, and with appropriate discretion.</p></div>
      </section>

      <section className="interior-panel" aria-labelledby="commitment-title">
        <div className="interior-panel-heading" data-interior-reveal><h2 id="commitment-title">What clients can expect.</h2></div>
        <div className="interior-asymmetric-grid">
          {[
            ["01", "Prepared advocacy", "Arguments and positions built through careful study of law, record, and procedure."],
            ["02", "Commercial awareness", "Advice that considers value, continuity, relationships, and long-term consequence."],
            ["03", "Direct counsel", "Plain communication about options, risks, timing, and the reasoning behind our advice."],
            ["04", "Discreet execution", "A professional approach that respects confidentiality at every stage."],
          ].map(([number, title, copy], index) => <article className={`interior-grid-item${index === 2 ? " is-maroon" : ""}`} key={title} data-interior-reveal><strong>{number}</strong><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <InteriorFooter />
    </main>
  );
}
