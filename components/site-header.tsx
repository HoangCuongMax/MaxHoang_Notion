import Link from "next/link";

const links = [
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" }
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-lockup" aria-label="Max Hoang home">
          <span className="brand-lockup__avatar" aria-hidden="true">
            MH
          </span>
          <span className="brand-lockup__content">
            <span className="brand-lockup__name">Max Hoang</span>
            <span className="brand-lockup__tag">Notion-powered portfolio</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/in/maxhoangau/"
            className="button button--nav button--nav-accent"
            target="_blank"
            rel="noreferrer"
          >
            <span className="button__badge">in</span>
            <span>Connect on LinkedIn</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
