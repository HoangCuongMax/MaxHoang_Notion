import Link from "next/link";
import { EventsCarousel } from "@/components/events-carousel";
import { MediaCover } from "@/components/media";
import { getEvents, getPosts } from "@/lib/content";

type BlogIndexProps = {
  searchParams?: Promise<{
    tag?: string;
  }>;
  basePath?: "/" | "/blog";
};

const blogFocusAreas = [
  "SQL",
  "Power BI",
  "AI",
  "Service improvement"
];

function getTagHref(basePath: "/" | "/blog", tag?: string) {
  if (!tag) {
    return basePath;
  }

  const query = `?tag=${encodeURIComponent(tag.toLowerCase())}`;

  return basePath === "/" ? `/${query}` : `${basePath}${query}`;
}

export async function BlogIndex({
  searchParams,
  basePath = "/"
}: BlogIndexProps) {
  const [posts, events] = await Promise.all([getPosts(), getEvents()]);
  const params = (await searchParams) ?? {};
  const activeTag = params.tag?.toLowerCase();
  const tags = Array.from(
    new Set(
      posts.flatMap((post) => post.tags).map((tag) => tag.trim()).filter(Boolean)
    )
  ).sort((first, second) => first.localeCompare(second));

  const filteredPosts = activeTag
    ? posts.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase() === activeTag)
      )
    : posts;
  const [featuredPost, ...remainingPosts] = filteredPosts;

  return (
    <div className="notion-page blog-page">
      <header className="notion-page__header">
        <p className="notion-page__eyebrow">Blog</p>
        <h1>Practical data notes.</h1>
        <p className="notion-page__lede">
          Clear writing on SQL, Power BI, AI, service improvement, and
          stakeholder-ready reporting.
        </p>
        <div className="blog-focus" aria-label="Blog focus areas">
          {blogFocusAreas.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
        <p className="blog-index__count">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
          {activeTag ? " in this category" : " published"}
        </p>
        {tags.length > 0 ? (
          <div className="notion-chip-bar" aria-label="Categories">
            <Link
              href={getTagHref(basePath)}
              className={`workspace-chip${!activeTag ? " is-active" : ""}`}
            >
              All
            </Link>
            {tags.map((tag) => {
              const slug = tag.toLowerCase();

              return (
                <Link
                  key={tag}
                  href={getTagHref(basePath, slug)}
                  className={`workspace-chip${activeTag === slug ? " is-active" : ""}`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        ) : null}
      </header>

      <div className="blog-page__events">
        <EventsCarousel items={events} />
      </div>

      <section className="notion-section">
        {featuredPost ? (
          <article className="blog-feature">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="blog-feature__media"
              aria-label={`Read ${featuredPost.title}`}
            >
              <MediaCover
                asset={featuredPost.coverImage}
                title={featuredPost.title}
                label="Featured post"
                description={featuredPost.excerpt}
                compact
                sizes="(max-width: 900px) 100vw, 48vw"
                transformation={[
                  {
                    width: 1100,
                    quality: 84
                  }
                ]}
              />
            </Link>
            <div className="blog-feature__body">
              <p className="blog-feature__eyebrow">Start here</p>
              <h2>
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              <p>{featuredPost.excerpt}</p>
              <div className="blog-feature__meta">
                <span>{featuredPost.publishedAt}</span>
                <span>{featuredPost.readingTime}</span>
              </div>
              {featuredPost.tags.length > 0 ? (
                <ul className="blog-feature__tags" aria-label="Post tags">
                  {featuredPost.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ) : null}

        <div className="notion-list blog-list">
          {remainingPosts.length > 0 ? (
            remainingPosts.map((post) => (
              <article
                key={post.slug}
                className="notion-row notion-row--article blog-row"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="notion-row__media"
                  aria-label={`Read ${post.title}`}
                >
                  <MediaCover
                    asset={post.coverImage}
                    title={post.title}
                    label="Blog post"
                    description={post.excerpt}
                    compact
                    sizes="(max-width: 900px) 34vw, 180px"
                    transformation={[
                      {
                        width: 420,
                        quality: 82
                      }
                    ]}
                  />
                </Link>
                <div className="notion-row__stack">
                  {post.tags[0] ? (
                    <p className="blog-row__category">{post.tags[0]}</p>
                  ) : null}
                  <Link href={`/blog/${post.slug}`} className="notion-row__title">
                    {post.title}
                  </Link>
                  <p className="notion-row__summary">{post.excerpt}</p>
                </div>
                <div className="notion-row__meta">
                  <span>{post.publishedAt}</span>
                  <span>{post.readingTime}</span>
                </div>
              </article>
            ))
          ) : !featuredPost ? (
            <div className="notion-row notion-row--static">
              <span className="notion-row__title">No posts in this category</span>
              <span className="notion-row__summary">
                Try a different category or publish a new post in Obsidian.
              </span>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
