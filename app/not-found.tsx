import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section page-intro">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>That page does not exist.</h1>
        <p className="page-intro__lede">
          The route may be missing, unpublished, or no longer part of the site.
        </p>
        <div className="hero__actions">
          <Link href="/" className="button button--primary">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
