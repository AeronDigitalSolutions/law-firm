import Image from "next/image";
import Link from "next/link";
import { ContactSection } from "@/components/contact-section";
import { ClientLogoMarquee } from "@/components/clients-section";
import { HomeTwoMotion } from "@/components/home-two-motion";
import { HomeTwoGavelScene } from "@/components/home-two-gavel-scene";
import { HomeTwoJusticeScene } from "@/components/home-two-justice-scene";
import { HomeTwoPenScene } from "@/components/home-two-pen-scene";
import { HomepageSwitcher } from "@/components/homepage-switcher";
import styles from "./home2.module.css";

const services = [
  ["Disputes", "Prepared advocacy for civil and commercial disputes, enforcement, arbitration, and litigation."],
  ["Corporate advisory", "Strategic counsel for promoters, management teams, governance, transactions, and change."],
  ["Financial institutions", "Focused representation for recovery, compliance, security enforcement, and risk."],
  ["Regulatory forums", "Measured advocacy before tribunals, regulatory authorities, and appellate forums."],
  ["Contracts and risk", "Drafting, review, negotiation, and practical allocation of commercial risk."],
  ["Private matters", "Confidential advice for individuals and families where discretion matters most."],
];

export default function HomeTwo() {
  return (
    <main className={styles.page} data-home-two>
      <HomeTwoMotion />
      <header className={styles.header} data-motion="header">
        <Link href="/home-2" className={styles.logo} aria-label="SCM Associates Homepage 2" data-motion="header-logo">
          <Image src="/images/logo.PNG" alt="SCM Associates" width={360} height={280} priority />
        </Link>
        <nav className={styles.nav} aria-label="Homepage 2 navigation" data-motion="header-nav">
          <a href="#about-two">Who we are</a>
          <a href="#services-two">Practices</a>
          <a href="#leadership-two">Our approach</a>
          <HomepageSwitcher />
        </nav>
        <a className={styles.headerCta} href="#contact-two" data-motion="header-cta">Request consultation</a>
      </header>

      <section className={styles.showcaseHero} data-motion="showcase-hero" aria-labelledby="showcase-title">
        <div className={styles.showcaseFrame}>
          <div className={styles.showcaseCopy} data-motion="showcase-copy">
            <h1 id="showcase-title">
              <span>Solving complex</span>
              <span>legal matters</span>
              <span>with confidence</span>
            </h1>
            <p>Measured counsel for disputes, transactions, and decisive commercial moments.</p>
            <div className={styles.showcaseActions}>
              <a href="#contact-two">Request Consultation <span>→</span></a>
              <a href="#services-two">Explore Practices</a>
            </div>
          </div>

          <div className={styles.showcaseJustice} data-motion="showcase-model">
            <Image
              src="/images/lady-justice-bronze.png"
              alt="Bronze Lady Justice holding balanced scales"
              fill
              priority
              sizes="(max-width: 720px) 100vw, 58vw"
            />
          </div>

          <aside className={styles.showcaseProof} data-motion="showcase-proof">
            <strong>30+</strong>
            <div className={styles.proofFaces}>
              <Image src="/images/sanjeev-mishra-portrait.jpg" alt="Adv. Sanjeev C. Mishra" width={64} height={64} />
              <Image src="/images/rahul-mishra-portrait.jpg" alt="Adv. Rahul S. Mishra" width={64} height={64} />
              <span className={styles.proofLogo}><Image src="/images/logo.PNG" alt="SCM Associates" width={64} height={64} /></span>
              <span className={styles.proofArrow} aria-hidden="true">↗</span>
            </div>
            <p>Years of courtroom and advisory experience</p>
          </aside>

          <aside className={styles.showcaseCounsel} data-motion="showcase-detail">
            <div className={styles.counselPen}><HomeTwoPenScene /></div>
            <div><strong>Two generations.<br />One standard of counsel.</strong><a href="#leadership-two">Meet our counsel</a></div>
          </aside>

          <div className={styles.showcaseSocials} data-motion="showcase-detail" aria-label="Social links">
            <a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="X">𝕏</a>
          </div>

          <aside className={styles.showcaseChart} data-motion="showcase-detail">
            <header><strong>Matters Across Forums</strong><span>Yearly⌄</span></header>
            <div className={styles.chartBody}>
              {[28, 34, 43, 40, 34, 35, 47].map((height, index) => (
                <div key={height + index}><i style={{ height: `${height * 2.05}px` }} /><span>{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][index]}</span></div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.hero} data-motion="hero">
        <div className={styles.heroCopy} data-motion="hero-copy">
          <span className={styles.eyebrow} data-motion="hero-eyebrow">Advocates · Legal consultants · Corporate advisors</span>
          <h1><span className={styles.heroLine}><span data-motion="hero-line">Resolve complexity.</span></span><span className={styles.heroLine}><em data-motion="hero-line">Move with clarity.</em></span></h1>
          <p data-motion="hero-support">Strategic legal counsel for businesses and individuals navigating consequential decisions, disputes, and change.</p>
          <div className={styles.heroGavel} data-motion="hero-support">
            <HomeTwoGavelScene />
          </div>
        </div>
        <div className={styles.heroMedia} data-motion="hero-media" data-tilt>
          <Image src="/images/firm-consultation-portrait.jpg" alt="SCM Associates legal consultation" fill priority sizes="(max-width: 760px) 100vw, 52vw" data-motion="hero-image" />
          <span className={styles.mediaNote}>Counsel grounded in context</span>
        </div>
      </section>

      <section id="about-two" className={styles.statement} data-motion="statement">
        <div className={styles.logoStrip} aria-label="Selected clients" data-motion="clients">
          <span>Trusted by industry leaders</span>
          <ClientLogoMarquee
            className={styles.logoMarquee}
            trackClassName={styles.logoMarqueeTrack}
            itemClassName={styles.logoCard}
          />
        </div>
        <div className={styles.statementBody}>
          <div className={styles.statementCopy}>
            <span className={styles.sectionNo} data-motion="statement-copy">01 / Our commitment</span>
            <h2 data-motion="section-heading">Legal counsel should make the <em>path ahead clearer.</em></h2>
            <p data-motion="statement-copy">SCM Associates combines <strong>courtroom experience</strong>, commercial judgment, and discreet client service across every matter.</p>
          </div>
          <HomeTwoJusticeScene />
        </div>
      </section>

      <section id="services-two" className={styles.services}>
        <header className={styles.sectionHeader}>
          <div><span className={styles.sectionNo}>02 / Practices</span><h2 data-motion="section-heading">Counsel for consequential matters.</h2></div>
          <p>We advise across the legal spectrum where decisions have lasting consequences—strategically, discreetly, and with a clear view of the outcome.</p>
        </header>
        <div className={styles.serviceGrid} data-motion="service-grid">
          <ServiceCard service={services[0]} index={0} />
          <div className={styles.servicePhotoA} data-motion="service-item service-photo"><Image src="/images/law-firm-confidence-consultation.jpg" alt="Legal documents under review" fill sizes="(max-width: 760px) 100vw, 25vw" /></div>
          <ServiceCard service={services[1]} index={1} />
          <ServiceCard service={services[2]} index={2} />
          <ServiceCard service={services[3]} index={3} />
          <ServiceCard service={services[4]} index={4} />
          <div className={styles.servicePhotoB} data-motion="service-item service-photo"><Image src="/images/firm-consultation-portrait.jpg" alt="SCM Associates consultation" fill sizes="(max-width: 760px) 100vw, 25vw" /></div>
          <ServiceCard service={services[5]} index={5} />
        </div>
      </section>

      <section className={styles.outcomes}>
        <span className={styles.sectionNo}>03 / Experience</span>
        <h2 data-motion="section-heading">Experience that changes the outcome.</h2>
        <div className={styles.metrics}>
          <div><strong data-count="30" data-suffix="+">30+</strong><span>Years of practice</span></div>
          <div><strong data-count="6">6</strong><span>Core practice areas</span></div>
          <div><strong data-count="2">2</strong><span>Generations of counsel</span></div>
        </div>
        <div className={styles.outcomePanels} data-motion="outcomes-grid">
          <article data-motion="outcome-card" data-tilt><div className={styles.outcomeImage}><Image src="/images/firm-consultation-portrait.jpg" alt="Legal preparation at SCM Associates" fill sizes="(max-width: 760px) 100vw, 25vw" /></div><div><h3>Courtroom-ready. Case-focused.</h3><p>We prepare every matter with rigor, precision, and a deep command of law and procedure.</p></div></article>
          <article data-motion="outcome-card" data-tilt><div className={styles.outcomeImage}><Image src="/images/law-firm-confidence-consultation.jpg" alt="Commercial legal consultation" fill sizes="(max-width: 760px) 100vw, 25vw" /></div><div><h3>Commercially grounded.</h3><p>Our advice protects value, anticipates risk, and enables confident decisions.</p></div></article>
        </div>
      </section>

      <section id="leadership-two" className={styles.leadership} data-motion="leadership">
        <span className={styles.sectionNo}>04 / Leadership</span>
        <h2 data-motion="section-heading">Institutional wisdom.<br />Contemporary resolve.</h2>
        <div className={styles.leaderGrid} data-motion="leader-grid">
          <article data-motion="leader-card" data-tilt><div className={styles.leaderPhoto}><Image src="/images/sanjeev-mishra-portrait.png" alt="Adv. Sanjeev C. Mishra" fill sizes="(max-width: 760px) 100vw, 28vw" /></div><span>Founder & Senior Partner</span><h3>Adv. Sanjeev C. Mishra</h3><p>More than three decades of representation, practical legal thinking, and trusted client counsel.</p></article>
          <blockquote data-motion="leader-quote">“The strongest strategy begins with a clear understanding of the client’s reality.”</blockquote>
          <article data-motion="leader-card" data-tilt><div className={styles.leaderPhoto}><Image src="/images/rahul-mishra-portrait.png" alt="Adv. Rahul S. Mishra" fill sizes="(max-width: 760px) 100vw, 28vw" /></div><span>Managing Partner</span><h3>Adv. Rahul S. Mishra</h3><p>A contemporary, business-aware approach grounded in institutional legal wisdom.</p></article>
        </div>
      </section>

      <div id="contact-two" className={styles.contactWrap} data-motion="contact"><ContactSection /></div>
      <footer className={styles.footer} data-motion="footer"><strong>SCM Associates</strong><p>Strategic counsel. Commercial judgment. Trusted representation.</p><nav><Link href="/">Homepage 1</Link><Link href="/home-2">Homepage 2</Link><a href="#services-two">Practices</a><a href="#contact-two">Contact</a></nav><span>© {new Date().getFullYear()} SCM Associates</span></footer>
    </main>
  );
}

function ServiceCard({ service: [title, copy], index }: { service: string[]; index: number }) {
  return (
    <article className={styles.serviceCard} data-motion="service-item" data-tilt>
      <span>0{index + 1}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}
