import Link from "next/link";
import { getProjects } from "@/lib/content";

export const metadata = {
  title: "Projects"
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const leadProject = projects[0];
  const otherProjects = projects.slice(1);

  return (
    <section className="section page-intro page-intro--projects">
      <div className="container editorial-shell">
        <p className="eyebrow">Projects</p>
        <h1>Products, experiments, and systems built with intent.</h1>
        <p className="page-intro__lede">
          This section gives your portfolio its own structure instead of mixing
          launches and case studies into the blog feed.
        </p>

        {leadProject ? (
          <>
            <article className="feature-panel feature-panel--project">
              <div className="feature-panel__meta">
                <p className="project-card__status">{leadProject.status}</p>
                <span className="feature-panel__label">Selected project</span>
              </div>
              <div className="feature-panel__body">
                <h2>
                  <Link href={`/projects/${leadProject.slug}`}>{leadProject.title}</Link>
                </h2>
                <p>{leadProject.summary}</p>
                {leadProject.tags.length > 0 ? (
                  <ul className="tag-list" aria-label={`${leadProject.title} tags`}>
                    {leadProject.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>

            <div className="projects-grid">
              {otherProjects.map((project) => (
                <article key={project.slug} className="project-card project-card--grid">
                  <p className="project-card__status">{project.status}</p>
                  <h2>
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h2>
                  <p>{project.summary}</p>
                  {project.tags.length > 0 ? (
                    <ul className="tag-list" aria-label={`${project.title} tags`}>
                      {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        ) : (
          <article className="project-row">
            <div className="project-row__header">
              <p className="project-card__status">Notion projects</p>
              <h2>No projects published yet.</h2>
            </div>
            <p>
              Create a visible project in Notion and it will appear in this section.
            </p>
          </article>
        )}
      </div>
    </section>
  );
}
