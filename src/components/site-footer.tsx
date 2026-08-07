"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="dark-site-footer">
      <div className="dark-footer-container">
        <div className="dark-footer-grid">
          {/* Brand & Mission Column */}
          <div className="dark-footer-brand">
            <h2 className="dark-footer-logo">SCM Associates</h2>
            <p className="dark-footer-desc">
              Committed to justice. Dedicated to excellence. Providing specialized legal representation for individuals and corporate entities since three decades.
            </p>
          </div>

          {/* NAVIGATE Column */}
          <div className="dark-footer-col">
            <span className="dark-footer-title">NAVIGATE</span>
            <ul className="dark-footer-links">
              <li><Link href="/who-we-are">The Firm</Link></li>
              <li><Link href="/practices">Capabilities</Link></li>
              <li><Link href="/our-approach">Our Approach</Link></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* LEGAL Column */}
          <div className="dark-footer-col">
            <span className="dark-footer-title">LEGAL</span>
            <ul className="dark-footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#insights">Insights</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Icons */}
        <div className="dark-footer-bottom">
          <p className="dark-footer-copy">
            © {new Date().getFullYear()} SCM Associates. All rights reserved. Professional legal counsel.
          </p>

          <div className="dark-footer-icons" aria-label="Footer action links">
            {/* Share Icon */}
            <button className="dark-footer-icon-btn" aria-label="Share page" onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "SCM Associates Advocates", url: window.location.href });
              }
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>

            {/* Globe Icon */}
            <button className="dark-footer-icon-btn" aria-label="Website region">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
