import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InteriorFooter } from "@/components/interior-footer";
import { InteriorHeader } from "@/components/interior-header";
import { InteriorPageMotion } from "@/components/interior-page-motion";

export const metadata: Metadata = {
  title: "Who We Are | SCM Associates",
  description: "Meet SCM Associates, a legal practice combining courtroom experience, commercial judgment, and discreet client service.",
};

export default function WhoWeArePage() {
  return (
    <main className="interior-page">
      <InteriorPageMotion />
      <InteriorHeader current="/who-we-are" />

      <section className="interior-hero" aria-labelledby="who-title">
        <div className="interior-hero-copy">
          <p className="interior-eyebrow">The firm</p>
          <h1 id="who-title">Experience with perspective.</h1>
          <p>Two generations of counsel, united by clear thinking and committed representation.</p>
          <Link className="interior-hero-link" href="/our-approach">How we work</Link>
        </div>
        <div className="interior-hero-media">
          <Image src="/images/firm-consultation-portrait.jpg" alt="A focused legal consultation at SCM Associates." fill priority sizes="(max-width: 960px) 100vw, 52vw" />
        </div>
      </section>

      <section className="interior-statement" data-interior-reveal>
        <span>Our purpose</span>
        <div>
          <h2>Legal advice should clarify what comes next.</h2>
          <p>SCM Associates brings litigation experience and commercial understanding to each engagement. We listen closely, assess the full context, and give clients a practical view of their options.</p>
        </div>
      </section>

      <section className="interior-panel" aria-labelledby="values-title">
        <div className="interior-panel-heading" data-interior-reveal>
          <h2 id="values-title">The standards behind our work.</h2>
          <p>Our relationships are built through sound preparation, direct communication, and respect for the trust placed in us.</p>
        </div>
        <div className="interior-asymmetric-grid">
          {[
            ["01", "Integrity in advice", "We give considered advice that addresses both legal position and practical consequence."],
            ["02", "Clarity in strategy", "Clients understand the available paths, the relevant risks, and the reasoning behind our recommendation."],
            ["03", "Commitment in action", "Every matter receives careful preparation, timely attention, and accountable execution."],
            ["04", "Discretion by design", "Confidentiality and professional judgment guide how we communicate and act."],
          ].map(([number, title, copy], index) => (
            <article className={`interior-grid-item${index === 1 ? " is-maroon" : ""}`} key={title} data-interior-reveal>
              <strong>{number}</strong><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="interior-panel" aria-labelledby="leadership-title">
        <div className="interior-panel-heading" data-interior-reveal>
          <h2 id="leadership-title">Leadership across generations.</h2>
        </div>
        <div className="interior-profile-grid">
          <article className="interior-profile" data-interior-reveal>
            <div className="interior-profile-image"><Image src="/images/sanjeev-mishra-portrait.png" alt="Adv. Sanjeev C. Mishra" fill sizes="(max-width: 700px) 100vw, 34vw" /></div>
            <span>Founder and Senior Partner</span><h3>Adv. Sanjeev C. Mishra</h3>
            <p>More than three decades of representation, practical legal thinking, and trusted client counsel.</p>
          </article>
          <blockquote className="interior-profile-quote" data-interior-reveal>“Strong strategy begins with a clear understanding of the client’s reality.”</blockquote>
          <article className="interior-profile" data-interior-reveal>
            <div className="interior-profile-image"><Image src="/images/rahul-mishra-portrait.png" alt="Adv. Rahul S. Mishra" fill sizes="(max-width: 700px) 100vw, 34vw" /></div>
            <span>Managing Partner</span><h3>Adv. Rahul S. Mishra</h3>
            <p>A contemporary, business-aware approach grounded in institutional legal wisdom.</p>
          </article>
        </div>
      </section>

      <InteriorFooter />
    </main>
  );
}
