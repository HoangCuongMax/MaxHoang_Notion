import { Post, Project } from "@/lib/types";

export const fallbackPosts: Post[] = [
  {
    slug: "building-a-site-that-feels-like-me",
    title: "Building a Site That Feels Like Me",
    excerpt:
      "Why a custom frontend matters when you want your writing and your work to share the same visual language.",
    publishedAt: "April 13, 2026",
    readingTime: "5 min read",
    featured: true,
    contentHtml: `
      <p>A personal website should not feel like two unrelated products stitched together. The blog, the case studies, and the future experiments all need a shared surface.</p>
      <p>That is why this project uses <strong>WordPress as a publishing system</strong> and a separate frontend as the experience layer. Content stays easy to manage while presentation stays flexible.</p>
      <h2>Why headless is the right fit</h2>
      <p>WordPress already solves the editorial workflow: drafts, publishing, media, revisions, and a familiar admin. A custom frontend solves the opposite problem: brand, speed, structure, and control.</p>
      <blockquote>The CMS should be comfortable. The frontend should be unmistakable.</blockquote>
      <p>That split becomes even more useful when the site needs to carry both essays and product work.</p>
    `
  },
  {
    slug: "what-i-want-from-a-project-archive",
    title: "What I Want From a Project Archive",
    excerpt:
      "A portfolio should show outcomes, constraints, and decisions instead of acting like a gallery of thumbnails.",
    publishedAt: "April 6, 2026",
    readingTime: "4 min read",
    featured: true,
    contentHtml: `
      <p>Projects deserve their own information architecture. They are not blog posts with different cover images.</p>
      <p>A useful project archive explains the problem, the solution, the stack, and the tradeoffs. It leaves space for narrative without pretending every build is a launch announcement.</p>
    `
  },
  {
    slug: "notes-on-building-in-public",
    title: "Notes on Building in Public",
    excerpt:
      "Small, consistent publishing habits compound better than occasional polished announcements.",
    publishedAt: "March 28, 2026",
    readingTime: "3 min read",
    contentHtml: `
      <p>Publishing in public does not need to mean publishing everything. It means making your work legible often enough that people can follow the arc.</p>
    `
  }
];

export const fallbackProjects: Project[] = [
  {
    slug: "max-hoang-personal-platform",
    title: "Max Hoang Personal Platform",
    summary:
      "A headless WordPress website with a custom Next.js frontend for essays, project case studies, and future product expansion.",
    status: "In progress",
    tags: ["Next.js", "WordPress API", "TypeScript"],
    featured: true,
    contentHtml: `
      <p>This project creates a deliberate home for writing and project documentation. WordPress handles editorial content, while Next.js handles rendering, routing, and visual direction.</p>
      <h2>Scope</h2>
      <p>The first version focuses on three areas: homepage, blog, and projects. The structure leaves room for future additions such as newsletters, talks, or experiments.</p>
      <h2>Implementation notes</h2>
      <p>The data layer is built to work with WordPress when configured, but it also includes local fallback content so the frontend can be developed independently.</p>
    `
  },
  {
    slug: "project-showcase-system",
    title: "Project Showcase System",
    summary:
      "A repeatable template for presenting projects with context, stack tags, and clear narrative instead of generic portfolio cards.",
    status: "Planned",
    tags: ["Design system", "Content modeling", "Portfolio"],
    featured: true,
    contentHtml: `
      <p>This is a content model and presentation system rather than a single artifact. The goal is to make future projects easy to publish without flattening them into the same shape.</p>
    `
  },
  {
    slug: "writing-workflow",
    title: "Writing Workflow",
    summary:
      "An editorial pipeline for outlining, drafting, publishing, and surfacing articles from WordPress into the custom site.",
    status: "Active",
    tags: ["WordPress", "Editorial", "Publishing"],
    contentHtml: `
      <p>The writing workflow depends on using WordPress for what it is good at: authorship, review, and scheduling. The frontend simply consumes the content once it is ready.</p>
    `
  }
];
