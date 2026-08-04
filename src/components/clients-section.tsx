"use client";

export const clientLogos = [
  {
    name: "ESSAR",
    svg: (
      <svg viewBox="0 0 200 60" width="140" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="5" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="34" fill="#111111" letterSpacing="1">
          ESSAR
        </text>
        <path d="M165 24L180 12L174 27L189 33L172 36L176 51L163 39L154 50L158 34L143 31L159 24L152 9L165 24Z" fill="#ff5500" />
        <path d="M165 24L174 27L172 36L163 39L158 34L159 24Z" fill="#e60000" />
      </svg>
    ),
  },
  {
    name: "JSW",
    svg: (
      <svg viewBox="0 0 180 60" width="130" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 12C70 8 110 8 140 18C110 14 70 14 40 12Z" fill="#e60000" />
        <path d="M25 15C55 10 95 10 125 20C100 16 60 16 25 15Z" fill="#e60000" />
        <text x="10" y="48" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontStyle="italic" fontSize="38" fill="#003399" letterSpacing="0">
          JSW
        </text>
      </svg>
    ),
  },
  {
    name: "USV",
    svg: (
      <svg viewBox="0 0 160 60" width="125" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 10L130 10L150 30L130 50L30 50L10 30Z" fill="#0099de" stroke="#0080c5" strokeWidth="2" />
        <path d="M34 14L126 14L144 30L126 46L34 46L16 30Z" stroke="#ffffff" strokeWidth="2" fill="none" />
        <text x="36" y="41" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontStyle="italic" fontSize="26" fill="#ffffff" letterSpacing="2">
          USV
        </text>
      </svg>
    ),
  },
  {
    name: "GVP",
    svg: (
      <svg viewBox="0 0 170 60" width="130" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 30L24 16L36 30L24 44Z" fill="#cc0000" />
        <path d="M24 16L36 30L24 24Z" fill="#111111" />
        <path d="M12 30L24 44L24 36Z" fill="#111111" />
        <text x="44" y="44" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="36" fill="#cc0000" letterSpacing="1">
          GVP
        </text>
      </svg>
    ),
  },
  {
    name: "Fino Payments Bank",
    svg: (
      <svg viewBox="0 0 220 60" width="165" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 14L26 24L36 24L28 30L31 40L22 34L13 40L16 30L8 24L18 24Z" fill="#e60000" stroke="#e60000" strokeWidth="1" />
        <text x="42" y="38" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="30" fill="#660099">
          Fino
        </text>
        <line x1="108" y1="18" x2="108" y2="42" stroke="#660099" strokeWidth="1.5" />
        <text x="114" y="28" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="10" fill="#660099">
          Payments Bank
        </text>
        <text x="114" y="39" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="9" fill="#660099">
          फिनो पेमेंट्स बैंक
        </text>
      </svg>
    ),
  },
  {
    name: "1 PAY",
    svg: (
      <svg viewBox="0 0 160 60" width="125" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="60" rx="6" fill="#0099ff" />
        <path d="M72 14L88 14L88 46L76 46L76 26L68 30L68 20Z" fill="#ffffff" />
        <text x="64" y="54" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="9" fill="#ffffff" letterSpacing="1">
          PAY
        </text>
      </svg>
    ),
  },
  {
    name: "PayG",
    svg: (
      <svg viewBox="0 0 190 60" width="145" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="40" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="34" fill="#0055ff">
          PAY
        </text>
        <text x="90" y="40" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="34" fill="#0055ff">
          जी
        </text>
        <circle cx="140" cy="18" r="3" fill="#e60000" />
        <text x="12" y="52" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="7" fill="#0055ff" letterSpacing="1">
          PAYG.IN PAY AS YOU GO
        </text>
      </svg>
    ),
  },
  {
    name: "FiatPe",
    svg: (
      <svg viewBox="0 0 190 60" width="145" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="14" width="32" height="32" rx="4" fill="#ffcc00" />
        <path d="M18 22L30 22M18 28L28 28M18 22L18 38" stroke="#e60000" strokeWidth="4" strokeLinecap="round" />
        <text x="46" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="32" fill="#e60000">
          FiatPe
        </text>
      </svg>
    ),
  },
];

export function ClientLogo({ name }: { name: string }) {
  const client = clientLogos.find((item) => item.name === name);

  if (!client) return null;

  return <>{client.svg}</>;
}

export function ClientLogoMarquee({
  className,
  trackClassName,
  itemClassName,
}: {
  className?: string;
  trackClassName?: string;
  itemClassName?: string;
}) {
  const marqueeItems = [...clientLogos, ...clientLogos, ...clientLogos];

  return (
    <div className={className} aria-label="SCM Associates clients">
      <div className={trackClassName}>
        {marqueeItems.map((client, index) => (
          <div key={`${client.name}-${index}`} className={itemClassName} data-motion="client">
            {client.svg}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientsSection() {
  // Multiply the track array so the infinite marquee train is 100% gapless & seamless
  const marqueeItems = [...clientLogos, ...clientLogos, ...clientLogos];

  return (
    <section className="clients-section" aria-labelledby="clients-heading">
      <div className="clients-container">
        {/* Header Block */}
        <div className="clients-header">
          <div className="clients-badge">
            <span>OUR CLIENTS</span>
          </div>
          <h2 id="clients-heading" className="clients-title">
            Trusted by Industry Leaders
          </h2>
          <p className="clients-subtitle">
            SCM Associates has been privileged to represent and advise numerous corporate houses,
            financial institutions, business groups, entrepreneurs, and individual clients across multiple sectors.
          </p>
          <p className="clients-desc">
            Our continued association with leading corporate clients reflects the confidence they place in our
            legal expertise, professionalism, and commitment to delivering exceptional legal services.
          </p>
        </div>

        {/* Infinitely Looping Logo Train (Right to Left) */}
        <div className="clients-marquee-wrapper" aria-hidden="true">
          <div className="clients-marquee-track">
            {marqueeItems.map((client, index) => (
              <div key={`${client.name}-${index}`} className="client-logo-card">
                {client.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
