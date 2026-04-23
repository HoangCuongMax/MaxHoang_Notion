import Link from "next/link";

const designTalkingPoints = [
  {
    title: "I don’t use generic themes, your site will be fully tailored to your business.",
    body:
      "Most WordPress designers rely on premade templates. I build custom solutions with modern methods so your site does not feel like another copy in the market."
  },
  {
    title: "You will be able to update everything yourself, no technical knowledge needed.",
    body:
      "The backend is structured to stay simple. You get clean content fields and a straightforward editing flow, so publishing changes feels closer to editing a document than managing a website."
  },
  {
    title: "This site will load faster, rank better, and convert more.",
    body:
      "A lean frontend avoids the bloat that often comes with heavy builders and plugin stacks. That improves performance, supports SEO, and creates a cleaner user experience."
  },
  {
    title: "I separate design from content, so your site is easier to scale.",
    body:
      "WordPress handles content while the frontend handles presentation. That means you can redesign later without rebuilding your entire content library."
  },
  {
    title: "I’ll show you how to manage your content in less than 10 minutes.",
    body:
      "The handoff is designed to be simple. You will know how to update copy, publish posts, and manage core pages without feeling locked out of your own platform."
  },
  {
    title: "Everything is built around results, not fluff.",
    body:
      "The goal is not just a pretty website. The structure is designed to support trust, speed, clarity, and real business outcomes."
  },
  {
    title: "Your website won’t rely on third-party plugins to function properly.",
    body:
      "Too many sites break because of fragile plugin dependencies. I keep the stack tighter so the end result is more stable and easier to maintain."
  },
  {
    title: "You won’t be locked in. Any developer can continue from where I left off.",
    body:
      "The system is built cleanly, with modern patterns and clear separation between CMS and frontend, so another developer can work on it later without reverse engineering a mess."
  },
  {
    title: "This setup gives you full flexibility if you ever need an app or integration down the line.",
    body:
      "A headless architecture gives you room to grow into portals, multilingual tools, automations, booking flows, or AI-powered features without rebuilding from scratch."
  }
];

const supportingServices = [
  {
    name: "Headless WordPress builds",
    summary:
      "Custom frontends connected to WordPress so content stays easy to manage while the design stays fast and distinctive."
  },
  {
    name: "AI-powered website features",
    summary:
      "Chatbots, content helpers, translation tools, and workflow automations that make your site more useful than a static brochure."
  },
  {
    name: "Portfolio and project platforms",
    summary:
      "Structured content systems for blogs, case studies, service pages, and project showcases that are easy to scale over time."
  }
];

export const metadata = {
  title: "Services"
};

export default function ServicesPage() {
  return (
    <section className="section page-intro page-intro--services">
      <div className="container editorial-shell">
        <p className="eyebrow">Services</p>
        <h1>Custom websites and digital systems built to be clear, fast, and useful.</h1>
        <p className="page-intro__lede">
          I design and build custom websites, content platforms, and AI-enabled
          experiences with WordPress as a practical backend and a custom frontend
          for performance, flexibility, and stronger presentation.
        </p>

        <div className="services-spotlight">
          <div className="services-spotlight__intro">
            <p className="services-spotlight__label">Featured service</p>
            <h2>Custom website design</h2>
            <p>
              This is for businesses and professionals who want a site that feels
              tailored to them, stays easy to manage, and does not collapse under
              the weight of generic themes and plugin clutter.
            </p>
            <div className="hero__actions">
              <a
                href="https://www.linkedin.com/in/maxhoangau/"
                className="button button--primary"
                target="_blank"
                rel="noreferrer"
              >
                Connect on LinkedIn
              </a>
              <Link href="/projects" className="button button--ghost">
                See project examples
              </Link>
            </div>
          </div>

          <div className="services-spotlight__list">
            {designTalkingPoints.map((point, index) => (
              <article key={point.title} className="service-point">
                <p className="service-point__index">{String(index + 1).padStart(2, "0")}</p>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Also available</p>
            <h2>Other ways I can help</h2>
          </div>
        </div>

        <div className="services-grid">
          {supportingServices.map((service) => (
            <article key={service.name} className="service-card">
              <h3>{service.name}</h3>
              <p>{service.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
