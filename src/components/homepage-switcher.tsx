import Link from "next/link";

export function HomepageSwitcher({ dark = false }: { dark?: boolean }) {
  return (
    <details className={`homepage-switcher${dark ? " homepage-switcher-dark" : ""}`}>
      <summary>Homepages <span aria-hidden="true">⌄</span></summary>
      <div className="homepage-switcher-menu">
        <Link href="/">Homepage 1</Link>
        <Link href="/home-2">Homepage 2</Link>
      </div>
    </details>
  );
}
