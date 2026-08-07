import Link from "next/link";

export function InteriorFooter() {
  return (
    <footer className="interior-footer">
      <div className="interior-footer-lead">
        <p>When the matter is consequential, clarity comes first.</p>
        <Link href="/home-2#contact-two">Request consultation <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="interior-footer-bottom">
        <strong>SCM Associates</strong>
        <nav aria-label="Footer navigation">
          <Link href="/who-we-are">Who we are</Link>
          <Link href="/practices">Practices</Link>
          <Link href="/our-approach">Our approach</Link>
          <Link href="/home-2">Home</Link>
        </nav>
        <span>© {new Date().getFullYear()} SCM Associates</span>
      </div>
    </footer>
  );
}
