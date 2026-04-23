import Link from "next/link";
import { getFeaturedPosts, getFeaturedProjects } from "@/lib/content";
import { heroSliderImages } from "@/lib/hero-slider-images";

export default async function HomePage() {
  const [posts, projects] = await Promise.all([
    getFeaturedPosts(),
    getFeaturedProjects()
  ]);
  const firstRow = heroSliderImages.slice(0, 6);
  const secondRow = heroSliderImages.slice(5);

  return (
    <>
      <section className="hero">
        <div className="hero__mesh" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <div className="eyebrow">AI Enthusiast • Web Developer • Storyteller</div>
            <p className="hero__brand">Max Hoang</p>
            <h1>Hi, I&apos;m Max Hoang.</h1>
            <p className="hero__lede">
              I build AI, web, and app solutions that connect people, ideas, and
              technology — from computer vision and translation tools to
              AI-powered websites and chatbots.
            </p>
            <div className="hero__actions">
              <Link href="/blog" className="button button--primary">
                Read the blog
              </Link>
              <Link href="/projects" className="button button--ghost">
                View projects
              </Link>
            </div>
          </div>

          <div className="hero__visual" aria-label="Featured photo slider">
            <div className="hero-marquee">
              <div className="hero-marquee__track">
                {[...firstRow, ...firstRow].map((src, index) => (
                  <figure className="hero-shot" key={`row-one-${index}`}>
                    <img src={src} alt="" loading="eager" />
                  </figure>
                ))}
              </div>
            </div>
            <div className="hero-marquee hero-marquee--reverse">
              <div className="hero-marquee__track">
                {[...secondRow, ...secondRow].map((src, index) => (
                  <figure className="hero-shot hero-shot--small" key={`row-two-${index}`}>
                    <img src={src} alt="" loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--contrast">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest writing</p>
              <h2>Recent blog posts</h2>
            </div>
            <Link href="/blog" className="text-link">
              Browse all posts
            </Link>
          </div>
          <div className="grid grid--two">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.slug} className="entry-card">
                  <p className="entry-card__meta">
                    {post.publishedAt} · {post.readingTime}
                  </p>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                </article>
              ))
            ) : (
              <article className="entry-card entry-card--empty">
                <p className="entry-card__meta">Notion posts</p>
                <h3>No posts published yet.</h3>
                <p>
                  Add your first published article in Notion and it will appear here.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2>Projects with a strong point of view</h2>
            </div>
            <Link href="/projects" className="text-link">
              See all projects
            </Link>
          </div>
          <div className="grid grid--three">
            {projects.length > 0 ? (
              projects.map((project) => (
                <article key={project.slug} className="project-card">
                  <p className="project-card__status">{project.status}</p>
                  <h3>
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p>{project.summary}</p>
                  {project.tags.length > 0 ? (
                    <ul className="tag-list" aria-label={`${project.title} stack`}>
                      {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))
            ) : (
              <article className="project-card project-card--empty">
                <p className="project-card__status">Notion projects</p>
                <h3>No projects published yet.</h3>
                <p>
                  Add your first visible project in Notion and it will appear here.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
