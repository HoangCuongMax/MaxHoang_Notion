import { Award, Post, Project } from "@/lib/types";

export const fallbackPosts: Post[] = [
  {
    slug: "building-a-site-that-feels-like-me",
    title: "Building a Site That Feels Like Me",
    excerpt:
      "Why a custom frontend matters when you want your writing and your work to share the same visual language.",
    publishedAt: "April 13, 2026",
    readingTime: "5 min read",
    tags: ["Design", "Frontend", "Personal brand"],
    featured: true,
    tableOfContents: [],
    gallery: [],
    contentHtml: `
      <p>A personal website should not feel like two unrelated products stitched together. The blog, the case studies, and the future experiments all need a shared surface.</p>
      <p>That is why this project uses <strong>Notion as a structured publishing system</strong> and a separate frontend as the experience layer. Content stays easy to manage while presentation stays flexible.</p>
      <h2>Why a structured backend is the right fit</h2>
      <p>Notion keeps the editorial workflow close to the planning work: drafts, publishing fields, lightweight review, and database views. A custom frontend solves the opposite problem: brand, speed, structure, and control.</p>
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
    tags: ["Portfolio", "Content strategy", "Case studies"],
    featured: true,
    tableOfContents: [],
    gallery: [],
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
    tags: ["Writing", "Publishing", "Workflow"],
    tableOfContents: [],
    gallery: [],
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
      "A Notion-backed website with a custom Next.js frontend for essays, project case studies, and future product expansion.",
    status: "In progress",
    tags: ["Next.js", "Notion API", "TypeScript"],
    featured: true,
    tableOfContents: [],
    gallery: [],
    contentHtml: `
      <p>This project creates a deliberate home for writing and project documentation. Notion handles structured content, while Next.js handles rendering, routing, and visual direction.</p>
      <h2>Scope</h2>
      <p>The first version focuses on three areas: homepage, blog, and projects. The structure leaves room for future additions such as newsletters, talks, or experiments.</p>
      <h2>Implementation notes</h2>
      <p>The data layer is built to work with Notion data sources when configured, but it also includes local fallback content so the frontend can be developed independently.</p>
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
    tableOfContents: [],
    gallery: [],
    contentHtml: `
      <p>This is a content model and presentation system rather than a single artifact. The goal is to make future projects easy to publish without flattening them into the same shape.</p>
    `
  },
  {
    slug: "writing-workflow",
    title: "Writing Workflow",
    summary:
      "An editorial pipeline for outlining, drafting, publishing, and surfacing articles from Notion into the custom site.",
    status: "Active",
    tags: ["Notion", "Editorial", "Publishing"],
    tableOfContents: [],
    gallery: [],
    contentHtml: `
      <p>The writing workflow depends on using Notion for what it is good at: planning, structured fields, and lightweight collaboration. The frontend simply consumes the content once it is ready.</p>
    `
  }
];

export const fallbackAwards: Award[] = [
  {
    slug: "rimpa-global-hackathon-winner",
    title: "RIMPA Global Hackathon Winner",
    event: "RIMPA Global Hackathon 2025",
    project: "GreenLedger AI",
    result: "$10,000 prize winner",
    summary:
      "Built GreenLedger AI, a carbon reporting and reduction platform for data and records teams, turning sustainability compliance into a practical workflow.",
    year: 2025,
    tags: ["AI", "Hackathon", "Award", "Innovation"],
    featured: true
  },
  {
    slug: "northern-territory-digital-excellence-award",
    title: "Northern Territory Digital Excellence Award",
    event: "Northern Territory Digital Excellence Awards 2025",
    project: "CDU IT Code Fair project work",
    result: "Recognised by Joshua Burgoyne MLA",
    summary:
      "Recognition for applied AI and product work in the Northern Territory digital community after a strong year of prototype and project delivery.",
    year: 2025,
    tags: ["AI", "Award", "Government", "Innovation"],
    featured: true
  },
  {
    slug: "cdu-it-code-fair-winner",
    title: "CDU IT Code Fair Winner",
    event: "CDU IT Code Fair 2025",
    project: "NT Shift Surge",
    result: "Winning team presentation",
    summary:
      "Presented NT Shift Surge, a concept designed to reduce staffing disruption during the Northern Territory wet season and improve workforce planning.",
    year: 2025,
    tags: ["Award", "Education", "Innovation"],
    featured: true
  },
  {
    slug: "govhack-nt-builder",
    title: "GovHack NT Builder",
    event: "GovHack NT 2025",
    project: "CivicMate and government-service AI ideas",
    result: "Open-data hackathon project delivery",
    summary:
      "Developed AI-assisted concepts focused on helping Australians navigate government services and public-sector information during the GovHack weekend.",
    year: 2025,
    tags: ["AI", "Hackathon", "Government", "Innovation"],
    featured: true
  }
];
