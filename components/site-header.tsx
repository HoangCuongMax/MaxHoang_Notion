import Link from "next/link";

const links = [
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" }
];

function getWordPressAdminUrl() {
  if (process.env.WORDPRESS_ADMIN_URL) {
    return process.env.WORDPRESS_ADMIN_URL;
  }

  const apiUrl = process.env.WORDPRESS_API_URL;

  if (!apiUrl) {
    return "/wp-admin";
  }

  return apiUrl.replace(/\/wp-json\/wp\/v2\/?$/, "/wp-admin");
}

export function SiteHeader() {
  const adminUrl = getWordPressAdminUrl();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-lockup" aria-label="Max Hoang home">
          <span className="brand-lockup__avatar" aria-hidden="true">
            <img src="/max-hoang-logo.jpg" alt="" />
          </span>
          <span className="brand-lockup__content">
            <span className="brand-lockup__name">Max Hoang</span>
            <span className="brand-lockup__tag">Headless WordPress portfolio</span>
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
          <a
            href={adminUrl}
            className="button button--nav"
            target="_blank"
            rel="noreferrer"
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
