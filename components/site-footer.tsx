import Link from "next/link";
import { pageLinks } from "@/lib/site-config";
import type { EventItem, Post } from "@/lib/types";

export function SiteFooter({
  latestPosts,
  latestEvents
}: {
  latestPosts: Post[];
  latestEvents: EventItem[];
}) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link className="site-footer__brand-name" href="/">
            Max Hoang Journal
          </Link>
          <p>
            Practical notes on AI, service improvement, data-powered products,
            and public-sector innovation.
          </p>
          <div className="site-footer__actions">
            <Link href="/contact" className="site-footer__button">
              Sign up / Contact
            </Link>
            <a
              href="https://www.linkedin.com/in/maxhoangau/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <nav
          className="site-footer__group site-footer__group--nav"
          aria-label="Footer sitemap"
        >
          <h2>Explore</h2>
          <ul>
            {pageLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section
          className="site-footer__group site-footer__group--posts"
          aria-label="Latest posts"
        >
          <h2>Latest writing</h2>
          <ul>
            {latestPosts.slice(0, 1).map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
            {latestPosts.length === 0 ? <li>No posts yet</li> : null}
          </ul>
        </section>

        <section
          className="site-footer__group site-footer__group--events"
          aria-label="Latest events"
        >
          <h2>Events</h2>
          <ul>
            {latestEvents.slice(0, 1).map((event) => (
              <li key={event.slug}>
                {event.eventUrl ? (
                  <a href={event.eventUrl} target="_blank" rel="noreferrer">
                    {event.title}
                  </a>
                ) : (
                  <span>{event.title}</span>
                )}
                <small>{event.displayDate}</small>
              </li>
            ))}
            {latestEvents.length === 0 ? <li>No events yet</li> : null}
          </ul>
        </section>

        <div className="site-footer__bottom">
          <span>Copyright {new Date().getFullYear()} Max Hoang.</span>
          <span>Built with Obsidian-backed content.</span>
        </div>
      </div>
    </footer>
  );
}
