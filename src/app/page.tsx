import { AboutExperience } from "@/components/about-experience";
import { ApproachConfidenceExperience } from "@/components/approach-confidence-experience";
import { ClientsSection } from "@/components/clients-section";
import { ContactSection } from "@/components/contact-section";
import { HeroExperience } from "@/components/hero-experience";
import { Preloader } from "@/components/preloader";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

const practiceAreas = [
  {
    title: "Disputes",
    description:
      "Civil and commercial litigation shaped by careful preparation, persuasive advocacy, and calm client communication.",
  },
  {
    title: "Corporate advisory",
    description:
      "Strategic counsel for promoters, management teams, and businesses making consequential decisions.",
  },
  {
    title: "Financial institutions",
    description:
      "Representation and advisory support for recovery, compliance, security enforcement, and commercial matters.",
  },
  {
    title: "Regulatory forums",
    description:
      "Measured representation before tribunals, regulatory authorities, and appellate forums.",
  },
  {
    title: "Contracts and risk",
    description:
      "Drafting, review, negotiation, and risk positioning that remains commercially practical.",
  },
  {
    title: "Private matters",
    description:
      "Discreet legal advice for individuals and families when privacy and judgment matter most.",
  },
];

const commitments = [
  {
    value: "Court to boardroom",
    label:
      "One integrated practice for litigation, negotiation, regulatory strategy, and business advice.",
  },
  {
    value: "Built for context",
    label:
      "Each matter is approached with legal rigor and a clear view of its commercial reality.",
  },
  {
    value: "Discreet by design",
    label:
      "Professionalism, confidentiality, and timely execution guide every client relationship.",
  },
];

const principles = [
  "Integrity in advice",
  "Clarity in strategy",
  "Commitment in action",
  "Results that endure",
];

export default function Home() {
  return (
    <main className="site-shell">
      <Preloader />
      <div className="page-noise" aria-hidden="true" />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="topbar">
        <a href="#top" className="brand-mark" aria-label="SCM Associates home">
          <span className="brand-monogram">SCM</span>
          <span className="brand-copy">Associates</span>
        </a>

        <nav className="topnav" aria-label="Primary navigation">
          <a href="#about">Who we are</a>
          <a href="#practice">Practices</a>
          <a href="#approach">Our approach</a>
          <a href="#contact" className="nav-cta">
            Request consultation <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <HeroExperience />

      <div id="main-content" />

      <AboutExperience principles={principles} />

      <section id="practice" className="section practice-section" aria-labelledby="practice-title">
        <Reveal className="practice-hero">
          <div>
            <p className="section-index">02 / Capabilities</p>
            <h2 id="practice-title">
              Counsel calibrated for the matter in front of you.
            </h2>
            <p>
              SCM Associates advises clients who need legal clarity, courtroom
              confidence, and commercially sound judgment in the same room.
            </p>
          </div>
          <div className="practice-gavel-target" data-gavel-target aria-hidden="true" />
        </Reveal>

        <div className="practice-grid">
          {practiceAreas.map((area, index) => (
            <Reveal
              className={`practice-item practice-item-${index + 1}`}
              delay={index * 60}
              key={area.title}
            >
              <span>0{index + 1}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <i aria-hidden="true" />
            </Reveal>
          ))}
        </div>
      </section>

      <ApproachConfidenceExperience commitments={commitments} principles={principles} />

      <ContactSection />
      <SiteFooter />
    </main>
  );
}
