import Image from "next/image";
import Link from "next/link";

const navigation = [
  ["Who we are", "/who-we-are"],
  ["Practices", "/practices"],
  ["Our approach", "/our-approach"],
] as const;

export function InteriorHeader({ current }: { current?: string }) {
  return (
    <header className="interior-header">
      <Link href="/home-2" className="interior-logo" aria-label="SCM Associates home">
        <Image src="/images/logo.PNG" alt="SCM Associates" width={360} height={280} priority />
      </Link>
      <nav className="interior-nav" aria-label="Primary navigation">
        {navigation.map(([label, href]) => (
          <Link key={href} href={href} aria-current={current === href ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>
      <Link className="interior-header-cta" href="/home-2#contact-two">
        Request consultation
      </Link>
    </header>
  );
}
