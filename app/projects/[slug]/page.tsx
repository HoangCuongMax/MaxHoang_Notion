import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  return {
    title: project.title,
    description: project.summary
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="article article--editorial">
      <div className="container">
        <Link href="/projects" className="text-link">
          Back to projects
        </Link>

        <div className="article-hero">
          <div className="article__inner">
            <p className="eyebrow">Project</p>
            <h1>{project.title}</h1>
            <p className="article__excerpt">{project.summary}</p>
          </div>

          <aside className="article-aside article-aside--project">
            <p className="project-card__status">{project.status}</p>
            {project.publishedAt ? (
              <p className="archive-item__meta">{project.publishedAt}</p>
            ) : null}
            {project.tags.length > 0 ? (
              <ul className="tag-list tag-list--spaced">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </aside>
        </div>

        <article
          className="article__inner prose"
          dangerouslySetInnerHTML={{ __html: project.contentHtml }}
        />
      </div>
    </section>
  );
}
