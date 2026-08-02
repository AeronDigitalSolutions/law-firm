"use client";

import { useState } from "react";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    matterType: "Litigation",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ fullName: "", email: "", matterType: "Litigation", message: "" });
    }, 4000);
  };

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-container">
        {/* Top Centered Capsule Badge */}
        <div className="contact-badge-wrap">
          <span className="contact-badge">05 / CONTACT</span>
        </div>

        <div className="contact-grid">
          {/* Left Column: Heading & Contact Info */}
          <div className="contact-left">
            <h2 id="contact-title" className="contact-headline">
              A confidential conversation starts here.
            </h2>

            <div className="contact-info-list">
              {/* OFFICE */}
              <div className="contact-info-item">
                <div className="contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 21s-6-5.33-6-10a6 6 0 1112 0c0 4.67-6 10-6 10z" />
                    <circle cx="12" cy="11" r="2" />
                  </svg>
                </div>
                <div className="contact-info-body">
                  <span className="contact-info-label">OFFICE</span>
                  <p className="contact-info-text">
                    Office No. 308, Maatr Skye,<br />
                    Kalyan (West), Maharashtra – 421301
                  </p>
                  <a
                    href="https://maps.google.com/?q=Maatr+Skye+Kalyan+West+Maharashtra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-directions-link"
                  >
                    GET DIRECTIONS
                  </a>
                </div>
              </div>

              {/* WRITE */}
              <div className="contact-info-item">
                <div className="contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="contact-info-body">
                  <span className="contact-info-label">WRITE</span>
                  <a href="mailto:scmassociates6778@gmail.com" className="contact-link">
                    scmassociates6778@gmail.com
                  </a>
                  <a href="mailto:scm.rahulm@gmail.com" className="contact-link">
                    scm.rahulm@gmail.com
                  </a>
                </div>
              </div>

              {/* CALL */}
              <div className="contact-info-item">
                <div className="contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div className="contact-info-body">
                  <span className="contact-info-label">CALL</span>
                  <a href="tel:+919167830006" className="contact-link">
                    +91 91678 30006
                  </a>
                  <a href="tel:+919819550005" className="contact-link">
                    +91 98195 50005
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form Card */}
          <div className="contact-right">
            <div className="contact-card">
              <h3 className="contact-card-title">Request a confidential consultation</h3>

              {submitted ? (
                <div className="contact-success-msg">
                  <h4>Enquiry Sent Successfully</h4>
                  <p>Thank you. Our senior counsel will review your inquiry and reach out discreetly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-field">
                    <label htmlFor="fullName" className="field-label">
                      FULL NAME
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="field-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email" className="field-label">
                      EMAIL ADDRESS
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="field-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="matterType" className="field-label">
                      MATTER TYPE
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="matterType"
                        value={formData.matterType}
                        onChange={(e) => setFormData({ ...formData, matterType: e.target.value })}
                        className="field-select"
                      >
                        <option value="Litigation">Litigation</option>
                        <option value="Corporate advisory">Corporate advisory</option>
                        <option value="Financial institutions">Financial institutions</option>
                        <option value="Regulatory forums">Regulatory forums</option>
                        <option value="Contracts and risk">Contracts and risk</option>
                        <option value="Private matters">Private matters</option>
                      </select>
                      <svg className="select-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="message" className="field-label">
                      MESSAGE
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      required
                      placeholder="Briefly describe your requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="field-textarea"
                    />
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    SEND ENQUIRY
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="contact-footer-bar">
        <span>© {new Date().getFullYear()} SCM Associates</span>
        <span>Committed to justice. Dedicated to excellence.</span>
      </div>
    </section>
  );
}
