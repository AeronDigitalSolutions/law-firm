import Image from "next/image";
import Link from "next/link";
import { ContactSection } from "@/components/contact-section";
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

const clientNames = ["ESSAR", "JSW", "USV", "Fino", "FiatPe"];

export default function HomeTwo() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/home-2" className={styles.logo} aria-label="SCM Associates Homepage 2">
          <Image src="/images/logo.PNG" alt="SCM Associates" width={360} height={280} priority />
        </Link>
        <nav className={styles.nav} aria-label="Homepage 2 navigation">
          <a href="#about-two">Who we are</a>
          <a href="#services-two">Practices</a>
          <a href="#leadership-two">Our approach</a>
          <HomepageSwitcher />
        </nav>
        <a className={styles.headerCta} href="#contact-two">Request consultation</a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Advocates · Legal consultants · Corporate advisors</span>
          <h1>Resolve complexity.<br /><em>Move with clarity.</em></h1>
          <p>Strategic legal counsel for businesses and individuals navigating consequential decisions, disputes, and change.</p>
          <a href="#contact-two" className={styles.primaryCta}>Request consultation <span>→</span></a>
        </div>
        <div className={styles.heroMedia}>
          <Image src="/images/firm-consultation-portrait.jpg" alt="SCM Associates legal consultation" fill priority sizes="(max-width: 760px) 100vw, 52vw" />
          <span className={styles.mediaNote}>Counsel grounded in context</span>
        </div>
      </section>

      <section id="about-two" className={styles.statement}>
        <div className={styles.logoStrip} aria-label="Selected clients">
          <span>Trusted by industry leaders</span>
              {clientNames.map((client) => <div key={client}>{client}</div>)}
        </div>
        <div className={styles.statementBody}>
          <span className={styles.sectionNo}>01 / Our commitment</span>
          <h2>Legal counsel should make the <em>path ahead clearer.</em></h2>
          <p>SCM Associates combines <strong>courtroom experience</strong>, commercial judgment, and discreet client service across every matter.</p>
        </div>
      </section>

      <section id="services-two" className={styles.services}>
        <header className={styles.sectionHeader}>
          <div><span className={styles.sectionNo}>02 / Practices</span><h2>Counsel for consequential matters.</h2></div>
          <p>We advise across the legal spectrum where decisions have lasting consequences—strategically, discreetly, and with a clear view of the outcome.</p>
        </header>
        <div className={styles.serviceGrid}>
          {services.map(([title, copy], index) => (
            <article key={title} className={styles.serviceCard}>
              <span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
          <div className={styles.servicePhotoA}><Image src="/images/law-firm-confidence-consultation.jpg" alt="Legal documents under review" fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
          <div className={styles.servicePhotoB}><Image src="/images/firm-consultation-portrait.jpg" alt="SCM Associates consultation" fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
        </div>
      </section>

      <section className={styles.outcomes}>
        <span className={styles.sectionNo}>03 / Experience</span>
        <h2>Experience that changes the outcome.</h2>
        <div className={styles.metrics}>
          <div><strong>30+</strong><span>Years of practice</span></div>
          <div><strong>6</strong><span>Core practice areas</span></div>
          <div><strong>2</strong><span>Generations of counsel</span></div>
        </div>
        <div className={styles.outcomePanels}>
          <article><div className={styles.outcomeImage}><Image src="/images/firm-consultation-portrait.jpg" alt="Legal preparation at SCM Associates" fill sizes="(max-width: 760px) 100vw, 25vw" /></div><div><h3>Courtroom-ready. Case-focused.</h3><p>We prepare every matter with rigor, precision, and a deep command of law and procedure.</p></div></article>
          <article><div className={styles.outcomeImage}><Image src="/images/law-firm-confidence-consultation.jpg" alt="Commercial legal consultation" fill sizes="(max-width: 760px) 100vw, 25vw" /></div><div><h3>Commercially grounded.</h3><p>Our advice protects value, anticipates risk, and enables confident decisions.</p></div></article>
        </div>
      </section>

      <section id="leadership-two" className={styles.leadership}>
        <span className={styles.sectionNo}>04 / Leadership</span>
        <h2>Institutional wisdom.<br />Contemporary resolve.</h2>
        <div className={styles.leaderGrid}>
          <article><div className={styles.leaderPhoto}><Image src="/images/sanjeev-mishra-portrait.png" alt="Adv. Sanjeev C. Mishra" fill sizes="(max-width: 760px) 100vw, 28vw" /></div><span>Founder & Senior Partner</span><h3>Adv. Sanjeev C. Mishra</h3><p>More than three decades of representation, practical legal thinking, and trusted client counsel.</p></article>
          <blockquote>“The strongest strategy begins with a clear understanding of the client’s reality.”</blockquote>
          <article><div className={styles.leaderPhoto}><Image src="/images/rahul-mishra-portrait.png" alt="Adv. Rahul S. Mishra" fill sizes="(max-width: 760px) 100vw, 28vw" /></div><span>Managing Partner</span><h3>Adv. Rahul S. Mishra</h3><p>A contemporary, business-aware approach grounded in institutional legal wisdom.</p></article>
        </div>
      </section>

      <div id="contact-two" className={styles.contactWrap}><ContactSection /></div>
      <footer className={styles.footer}><strong>SCM Associates</strong><p>Strategic counsel. Commercial judgment. Trusted representation.</p><nav><Link href="/">Homepage 1</Link><Link href="/home-2">Homepage 2</Link><a href="#services-two">Practices</a><a href="#contact-two">Contact</a></nav><span>© {new Date().getFullYear()} SCM Associates</span></footer>
    </main>
  );
}
