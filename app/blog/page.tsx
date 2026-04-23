import Link from "next/link";
import { getPosts } from "@/lib/content";

export const metadata = {
  title: "Blog"
};

export default async function BlogIndexPage() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const archivePosts = posts.slice(1);

  return (
    <section className="section page-intro page-intro--blog">
      <div className="container editorial-shell">
        <p className="eyebrow">Blog</p>
        <h1>Writing on product, systems, and the work behind the work.</h1>
        <p className="page-intro__lede">
          Posts are intended to be published from WordPress and rendered here in
          a custom reading experience.
        </p>

        {featuredPost ? (
          <>
            <article className="feature-panel">
              <div className="feature-panel__meta">
                <p className="archive-item__meta">
                  {featuredPost.publishedAt} · {featuredPost.readingTime}
                </p>
                <span className="feature-panel__label">Latest essay</span>
              </div>
              <div className="feature-panel__body">
                <h2>
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                <p>{featuredPost.excerpt}</p>
                <Link href={`/blog/${featuredPost.slug}`} className="text-link">
                  Read article
                </Link>
              </div>
            </article>

            <div className="archive-list archive-list--cards">
              {archivePosts.map((post) => (
                <article key={post.slug} className="archive-card">
                  <p className="archive-item__meta">
                    {post.publishedAt} · {post.readingTime}
                  </p>
                  <h2>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <article className="archive-item">
            <div>
              <p className="archive-item__meta">WordPress posts</p>
              <h2>No posts published yet.</h2>
              <p>
                Create a post in WordPress admin and it will appear in this archive.
              </p>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
