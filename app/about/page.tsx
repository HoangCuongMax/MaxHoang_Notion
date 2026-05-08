import { AwardsCarousel } from "@/components/awards-carousel";
import Link from "next/link";
import { MediaCover, MediaImage } from "@/components/media";
import {
  getAwards,
  getFeaturedPosts,
  getHeroSliderImages
} from "@/lib/content";
import { getGithubRepositories } from "@/lib/github";

export const metadata = {
  title: "About Me"
};

export default async function AboutPage() {
  const [posts, repositories, awards, heroImages] = await Promise.all([
    getFeaturedPosts(),
    getGithubRepositories(3),
    getAwards(),
    getHeroSliderImages()
  ]);
  const midpoint = Math.ceil(heroImages.length / 2);
  const firstRow = heroImages.slice(0, midpoint);
  const secondRow = heroImages.slice(midpoint);

  return (
    <>
      <section className="hero">
        <div className="hero__mesh" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <div className="eyebrow">
              AI Visionary / Data Analytics / Service Improvement
            </div>
            <p className="hero__brand">Max Hoang Journal</p>
            <h1>Ideas that turn data into better services.</h1>
            <p className="hero__lede">
              I build AI, web, and app solutions that connect people, ideas, and
              technology - from computer vision and translation tools to
              AI-powered websites and chatbots.
            </p>
            <div className="hero__actions">
              <Link href="/" className="button button--primary">
                Read the blog
              </Link>
              <Link href="/github" className="button button--ghost">
                View GitHub
              </Link>
            </div>
          </div>

          <div className="hero__visual" aria-label="Featured photo slider">
            <div className="hero-marquee">
              <div className="hero-marquee__track">
                {[...firstRow, ...firstRow].map((asset, index) => (
                  <figure className="hero-shot" key={`row-one-${index}`}>
                    <MediaImage
                      asset={asset}
                      sizes="(max-width: 900px) 180px, 240px"
                      priority={index < 2}
                    />
                  </figure>
                ))}
              </div>
            </div>
            <div className="hero-marquee hero-marquee--reverse">
              <div className="hero-marquee__track">
                {[...secondRow, ...secondRow].map((asset, index) => (
                  <figure
                    className="hero-shot hero-shot--small"
                    key={`row-two-${index}`}
                  >
                    <MediaImage
                      asset={asset}
                      sizes="(max-width: 900px) 150px, 198px"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--contrast section--about">
        <div className="container about-intro">
          <div className="about-intro__copy">
            <p className="eyebrow">About me</p>
            <h2>Building practical AI and web tools.</h2>
            <p className="about-intro__lede">
              I&apos;m Max Hoang, based in Darwin, creating AI, web, and data
              products for education, business, and community services.
            </p>
            <dl className="about-intro__facts">
              <div>
                <dt>Base</dt>
                <dd>Darwin, Northern Territory</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>AI, web, and data products</dd>
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
            <Link href="/" className="text-link">
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
                    {post.publishedAt} / {post.readingTime}
                  </p>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                </article>
              ))
            ) : (
              <article className="entry-card entry-card--empty">
                <p className="entry-card__meta">Obsidian posts</p>
                <h3>No posts published yet.</h3>
                <p>
                  Add your first published article in Obsidian and it will appear here.
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
              <p className="eyebrow">GitHub</p>
              <h2>Repository showcase</h2>
            </div>
            <Link href="/github" className="text-link">
              See all repositories
            </Link>
          </div>
          <div className="repo-grid repo-grid--compact">
            {repositories.length > 0 ? (
              repositories.map((repo) => (
                <article key={repo.id} className="repo-card">
                  <div className="repo-card__topline">
                    <p>{repo.language ?? "Repository"}</p>
                    <span>Updated {repo.updatedAt}</span>
                  </div>
                  <h3>
                    <a href={repo.url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                  </h3>
                  <p>{repo.impact}</p>
                  <div className="repo-card__footer">
                    <span>{repo.stars} stars</span>
                    <span>{repo.forks} forks</span>
                    <a href={repo.url} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <article className="repo-card repo-card--empty">
                <p className="repo-card__empty-label">GitHub</p>
                <h3>No repositories available right now.</h3>
                <p>
                  Add a public repository on GitHub and it will appear here
                  automatically.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
