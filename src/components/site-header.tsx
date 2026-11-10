import Link from "next/link";

const links = [
  { href: "#garden", label: "The Garden" },
  { href: "#story", label: "Our Story" },
  { href: "#ocean", label: "The Ocean" },
  { href: "#secret", label: "The Secret" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Link className="wordmark" href="#intro" aria-label="Project 29.12 home">
        <span className="wordmark-mark" aria-hidden="true">✳</span>
        <span>PROJECT <strong>29.12</strong></span>
      </Link>

      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <a href={link.href} key={link.href}>{link.label}</a>
        ))}
      </nav>

      <a className="header-index" href="#final">
        <span className="status-dot" aria-hidden="true" />
        A LITTLE WORLD
      </a>
    </header>
  );
}
