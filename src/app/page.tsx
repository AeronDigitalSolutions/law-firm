import { AboutExperience } from "@/components/about-experience";
import { HeroExperience } from "@/components/hero-experience";
import { Reveal } from "@/components/reveal";

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

      <AboutExperience principles={principles.slice(0, 3)} />

      <section id="practice" className="section practice-section" aria-labelledby="practice-title">
        <Reveal className="practice-hero">
          <div>
            <p className="section-index">02 / Capabilities</p>
            <h2 id="practice-title">
              Counsel calibrated for the matter in front of you.
            </h2>
            <p>
              Integrated expertise and practical insight for matters that shape your
              business and private interests.
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

      <section id="approach" className="section approach-section" aria-labelledby="approach-title">
        <Reveal className="approach-quote" delay={40}>
          <p className="section-index">03 / Our approach</p>
          <h2 id="approach-title">
            “Practical, result-oriented legal solutions aligned with each
            client&apos;s commercial reality.”
          </h2>
          <span className="quote-tail" aria-hidden="true">—</span>
        </Reveal>

        <Reveal className="approach-architecture" delay={110}>
          <ColumnStage />
        </Reveal>

        <div className="commitment-list">
          {commitments.map((commitment, index) => (
            <Reveal className="commitment" delay={100 + index * 80} key={commitment.value}>
              <span>0{index + 1}</span>
              <strong>{commitment.value}</strong>
              <p>{commitment.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="reputation-section" aria-labelledby="reputation-title">
        <div className="reputation-card">
          <Reveal className="reputation-copy" delay={40}>
            <p className="section-index">04 / Client confidence</p>
            <h2 id="reputation-title">
              Long-term relationships built on trust, professionalism, and results.
            </h2>
            <a href="#contact" className="text-link">
              Our commitment to you <span aria-hidden="true">→</span>
            </a>
          </Reveal>
          <Reveal className="confidence-architecture" delay={100}>
            <ColumnStage />
          </Reveal>
          <Reveal className="reputation-note" delay={140}>
            <p>
              SCM Associates continues to advise corporate houses, business groups,
              entrepreneurs, financial institutions, and individual stakeholders who
              value measured legal judgment.
            </p>
            <span>Continuity matters.</span>
          </Reveal>
        </div>
        <Reveal className="principle-bar" delay={160}>
          {principles.map((principle, index) => (
            <span key={principle}>
              <b>0{index + 1}</b>
              {principle}
            </span>
          ))}
        </Reveal>
      </section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <Reveal className="contact-title" delay={40}>
          <p className="section-index">05 / Contact</p>
          <h2 id="contact-title">A confidential conversation starts here.</h2>
          <a href="mailto:scmassociates6778@gmail.com" className="button-primary">
            <span>Request consultation</span>
            <b aria-hidden="true">↗</b>
          </a>
        </Reveal>

        <Reveal className="contact-details" delay={120}>
          <div>
            <span>Office</span>
            <p>
              Office No. 308, Maatr Skye,<br />
              Kalyan (West), Maharashtra - 421301
            </p>
          </div>
          <div>
            <span>Write</span>
            <a href="mailto:scmassociates6778@gmail.com">scmassociates6778@gmail.com</a>
            <a href="mailto:scm.rahulm@gmail.com">scm.rahulm@gmail.com</a>
          </div>
          <div>
            <span>Call</span>
            <a href="tel:+919167830006">+91 91678 30006</a>
            <a href="tel:+919819550005">+91 98195 50005</a>
            <a href="tel:+919820220138">+91 98202 20138</a>
          </div>
        </Reveal>
      </section>

      <footer className="footer-bar">
        <span>SCM Associates</span>
        <span>Committed to justice. Dedicated to excellence.</span>
      </footer>
    </main>
  );
}

function ColumnStage({ className = "" }: { className?: string }) {
  return (
    <div className={`column-stage ${className}`.trim()} aria-hidden="true">
      <span className="stone-column stone-column-back" />
      <span className="stone-column stone-column-main" />
      <span className="stone-column stone-column-front" />
      <span className="stone-steps" />
      <span className="stone-light" />
    </div>
  );
}
