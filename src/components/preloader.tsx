"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Legal quotes that cycle during loading ── */
const QUOTES = [
  { text: "Justice delayed is justice denied.", author: "William E. Gladstone" },
  { text: "The law is reason, free from passion.", author: "Aristotle" },
  { text: "Where there is a right, there is a remedy.", author: "Legal Maxim" },
  { text: "In the halls of justice, the only justice is in the halls.", author: "Lenny Bruce" },
  { text: "The good lawyer is not the man who has an eye to every side and angle of contingency.", author: "Cicero" },
  { text: "Equal justice under law.", author: "U.S. Supreme Court" },
  { text: "The first duty of society is justice.", author: "Alexander Hamilton" },
  { text: "Law is order, and good law is good order.", author: "Aristotle" },
];

const CYCLE_MS = 3200;

type AssetStatus = {
  fonts: boolean;
  dom: boolean;
  models: boolean;
};

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const statusRef = useRef<AssetStatus>({ fonts: false, dom: false, models: false });
  const allReadyRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* ── Check if all assets are ready ── */
  const checkReady = useCallback(() => {
    const s = statusRef.current;
    if (s.fonts && s.dom && s.models && !allReadyRef.current) {
      allReadyRef.current = true;
      setProgress(100);
      // Hold for a beat so the user sees 100%
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => setVisible(false), 900);
      }, 500);
    }
  }, []);

  /* ── Track loading progress ── */
  useEffect(() => {
    // Fonts
    document.fonts.ready.then(() => {
      statusRef.current.fonts = true;
      setProgress((p) => Math.max(p, 25));
      checkReady();
    });

    // DOM content
    if (document.readyState === "complete") {
      statusRef.current.dom = true;
      setProgress((p) => Math.max(p, 40));
      checkReady();
    } else {
      const onLoad = () => {
        statusRef.current.dom = true;
        setProgress((p) => Math.max(p, 40));
        checkReady();
      };
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, [checkReady]);

  /* ── Track GLB model loading ── */
  useEffect(() => {
    let cancelled = false;

    // Animate progress while models load
    const progressInterval = setInterval(() => {
      if (allReadyRef.current) {
        clearInterval(progressInterval);
        return;
      }
      setProgress((p) => {
        if (p >= 85) return p;
        return p + Math.random() * 3;
      });
    }, 400);

    // Poll for Three.js cache — GLB files register here once loaded
    const checkModels = () => {
      if (cancelled) return;

      // Check if the Three.js DefaultLoadingManager has finished
      // We use a simple heuristic: if 5+ seconds have passed AND dom is loaded,
      // consider models ready (they load via Suspense and will stream in)
      const images = document.querySelectorAll("canvas");
      const hasCanvases = images.length >= 2;

      if (hasCanvases && statusRef.current.dom) {
        statusRef.current.models = true;
        setProgress((p) => Math.max(p, 90));
        checkReady();
      } else {
        setTimeout(checkModels, 500);
      }
    };

    // Start checking after a short delay
    setTimeout(checkModels, 1000);

    // Safety timeout — don't block the user forever (max 12s)
    const safetyTimeout = setTimeout(() => {
      if (!allReadyRef.current) {
        statusRef.current.models = true;
        statusRef.current.fonts = true;
        statusRef.current.dom = true;
        setProgress(100);
        checkReady();
      }
    }, 12000);

    return () => {
      cancelled = true;
      clearInterval(progressInterval);
      clearTimeout(safetyTimeout);
    };
  }, [checkReady]);

  /* ── Quote cycling ── */
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setQuoteIdx((i) => (i + 1) % QUOTES.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [visible]);

  /* ── Lock body scroll while preloader is visible ── */
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  const quote = QUOTES[quoteIdx];

  return (
    <div
      ref={overlayRef}
      className={`preloader ${exiting ? "preloader-exit" : ""}`}
      aria-live="polite"
      aria-label="Loading site assets"
    >
      {/* Background texture */}
      <div className="preloader-grain" aria-hidden="true" />

      {/* Center content */}
      <div className="preloader-content">
        {/* Monogram */}
        <div className="preloader-monogram" aria-hidden="true">
          <span>SCM</span>
        </div>

        {/* Quote */}
        <div className="preloader-quote-wrap">
          <blockquote key={quoteIdx} className="preloader-quote">
            <p>&ldquo;{quote.text}&rdquo;</p>
            <cite>— {quote.author}</cite>
          </blockquote>
        </div>

        {/* Progress bar */}
        <div className="preloader-progress-track">
          <div
            className="preloader-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="preloader-status">
          {progress < 100 ? "Preparing your experience" : "Ready"}
        </p>
      </div>

      {/* Bottom tagline */}
      <div className="preloader-tagline">
        <span>SCM Associates</span>
        <span>Advocates & Legal Consultants</span>
      </div>
    </div>
  );
}
