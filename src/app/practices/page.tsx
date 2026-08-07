import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InteriorFooter } from "@/components/interior-footer";
import { InteriorHeader } from "@/components/interior-header";
import { InteriorPageMotion } from "@/components/interior-page-motion";

export const metadata: Metadata = {
  title: "Practices | SCM Associates",
  description: "Explore SCM Associates' work across disputes, corporate advisory, financial institutions, regulatory forums, contracts, and private matters.",
};

const practices = [
  { title: "Disputes", copy: "Prepared advocacy for civil and commercial disputes, approached with command of the record and a practical view of resolution.", items: ["Civil litigation", "Commercial disputes", "Arbitration", "Enforcement"] },
  { title: "Corporate advisory", copy: "Strategic legal support for promoters, management teams, and businesses navigating consequential decisions and change.", items: ["Governance", "Transactions", "Business structuring", "Strategic advice"] },
  { title: "Financial institutions", copy: "Focused representation and advisory support on recovery, security enforcement, compliance, and commercial risk.", items: ["Recovery matters", "Security enforcement", "Compliance", "Risk advice"] },
  { title: "Regulatory forums", copy: "Measured representation before tribunals, regulatory authorities, and appellate forums.", items: ["Tribunal matters", "Regulatory proceedings", "Appellate forums", "Procedural strategy"] },
  { title: "Contracts and risk", copy: "Clear drafting and negotiation that protects position while remaining grounded in commercial reality.", items: ["Drafting", "Contract review", "Negotiation", "Risk allocation"] },
  { title: "Private matters", copy: "Confidential legal advice for individuals and families where privacy, sensitivity, and judgment matter most.", items: ["Private advisory", "Family concerns", "Personal disputes", "Confidential counsel"] },
];

export default function PracticesPage() {
  return (
    <main className="interior-page">
      <InteriorPageMotion />
      <InteriorHeader current="/practices" />

      <section className="interior-hero" aria-labelledby="practices-title">
        <div className="interior-hero-copy">
          <p className="interior-eyebrow">Practices</p>
          <h1 id="practices-title">Counsel for consequential matters.</h1>
          <p>Legal rigor, commercial judgment, and a strategy shaped around the matter.</p>
          <Link className="interior-hero-link" href="/home-2#contact-two">Discuss a matter</Link>
        </div>
        <div className="interior-hero-media">
          <Image src="/images/lady-justice-bronze.png" alt="Bronze Lady Justice holding balanced scales" fill priority sizes="(max-width: 960px) 100vw, 52vw" style={{ objectFit: "contain", objectPosition: "center bottom" }} />
        </div>
      </section>

      <section className="interior-statement" data-interior-reveal>
        <span>Integrated counsel</span>
        <div><h2>From the courtroom to the boardroom.</h2><p>Our practice connects disputes, transactions, regulatory strategy, and private advice. That wider view helps us identify the issues that matter and act with purpose.</p></div>
      </section>

      <section className="interior-practices" aria-label="Practice areas">
        {practices.map((practice, index) => (
          <article className="interior-practice" key={practice.title} data-interior-reveal>
            <span className="interior-practice-number">0{index + 1}</span>
            <div><h2>{practice.title}</h2><p>{practice.copy}</p><ul>{practice.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </article>
        ))}
      </section>

      <section className="interior-editorial" data-interior-reveal>
        <div className="interior-editorial-media"><Image src="/images/law-firm-confidence-consultation.jpg" alt="Legal documents being reviewed during a consultation" fill sizes="(max-width: 960px) 100vw, 40vw" /></div>
        <div className="interior-editorial-copy"><h2>Advice built for context.</h2><p>The same legal issue can carry different commercial, reputational, and personal consequences. We account for those realities before recommending a course of action.</p></div>
      </section>

      <InteriorFooter />
    </main>
  );
}
