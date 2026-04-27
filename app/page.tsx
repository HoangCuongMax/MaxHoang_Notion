import { AwardsCarousel } from "@/components/awards-carousel";
import Link from "next/link";
import { MediaCover, MediaImage } from "@/components/media";
import { getAwards, getFeaturedPosts, getFeaturedProjects } from "@/lib/content";
import { heroSliderImages } from "@/lib/hero-slider-images";

export default async function HomePage() {
  const [posts, projects, awards] = await Promise.all([
    getFeaturedPosts(),
    getFeaturedProjects(),
    getAwards()
  ]);
  const midpoint = Math.ceil(heroSliderImages.length / 2);
  const firstRow = heroSliderImages.slice(0, midpoint);
  const secondRow = heroSliderImages.slice(midpoint);

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
                    <MediaImage
                      asset={{ url: src, alt: "" }}
                      sizes="(max-width: 900px) 180px, 240px"
                      priority={index < 2}
                    />
                  </figure>
                ))}
              </div>
            </div>
            <div className="hero-marquee hero-marquee--reverse">
              <div className="hero-marquee__track">
                {[...secondRow, ...secondRow].map((src, index) => (
                  <figure className="hero-shot hero-shot--small" key={`row-two-${index}`}>
                    <MediaImage
                      asset={{ url: src, alt: "" }}
                      sizes="(max-width: 900px) 150px, 198px"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--contrast">
        <div className="container about-intro">
          <div className="about-intro__copy">
            <p className="eyebrow">About me</p>
            <h2>Building AI products with a designer&apos;s eye and a storyteller&apos;s frame.</h2>
            <p className="about-intro__lede">
              I&apos;m Max Hoang, an AI enthusiast, web developer, and storyteller
              from Vietnam, now based in the Northern Territory of Australia.
            </p>
            <p>
              My work sits across AI, web, and app development, shaped by an
              earlier background in design and marketing and grounded in tools
              for education, business, and local communities.
            </p>
            <p>
              Recent projects span translation tools, AI-integrated mapping,
              digital sustainability products, and startup-ready product
              experiments built to solve practical problems.
            </p>
            <dl className="about-intro__facts">
              <div>
                <dt>Base</dt>
                <dd>Darwin, Northern Territory</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>AI, web, and app development</dd>
              </div>
              <div>
                <dt>Current track</dt>
                <dd>Master of IT (Artificial Intelligence) at CDU</dd>
              </div>
            </dl>
          </div>

          <div className="about-intro__media">
            <div className="video-frame">
              <iframe
                src="https://www.youtube-nocookie.com/embed/VTkfPKeZHYg"
                title="Max Hoang introduction video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container awards-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Awards & recognition</p>
              <h2>Hackathons, code fairs, and public-sector innovation work.</h2>
            </div>
          </div>
          <AwardsCarousel items={awards} />
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
                  <figure className="entry-card__media">
                    <MediaCover
                      asset={post.coverImage}
                      title={post.title}
                      label="Blog post"
                      description={post.excerpt}
                      compact
                      sizes="(max-width: 900px) 100vw, 50vw"
                      transformation={[
                        {
                          width: 760,
                          quality: 82
                        }
                      ]}
                    />
                  </figure>
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
                  <figure className="project-card__media">
                    <MediaCover
                      asset={project.coverImage}
                      title={project.title}
                      label="Project"
                      description={project.summary}
                      compact
                      sizes="(max-width: 900px) 100vw, 33vw"
                      transformation={[
                        {
                          width: 720,
                          quality: 82
                        }
                      ]}
                    />
                  </figure>
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
