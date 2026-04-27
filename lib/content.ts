import { addHeadingAnchors } from "@/lib/article";
import { Award, Post, Project, RelatedContentItem } from "@/lib/types";
import { fallbackAwards, fallbackPosts, fallbackProjects } from "@/lib/mock-data";
import {
  fetchNotionAwards,
  fetchNotionPosts,
  fetchNotionProjects,
  hasNotionConfig
} from "@/lib/notion";

function normalizeTags(tags: string[] | undefined) {
  return [...new Set((tags ?? []).map((tag) => tag.trim()).filter(Boolean))];
}

function enhancePost(post: Post): Post {
  const { contentHtml, tableOfContents } = addHeadingAnchors(post.contentHtml);

  return {
    ...post,
    contentHtml,
    tableOfContents,
    tags: normalizeTags(post.tags)
  };
}

function enhanceProject(project: Project): Project {
  const { contentHtml, tableOfContents } = addHeadingAnchors(project.contentHtml);

  return {
    ...project,
    contentHtml,
    tableOfContents,
    tags: normalizeTags(project.tags)
  };
}

function tokenize(value: string) {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .map((part) => part.trim())
      .filter((part) => part.length > 2)
  );
}

function getOverlapScore(first: Set<string>, second: Set<string>) {
  let score = 0;

  for (const item of first) {
    if (second.has(item)) {
      score += 1;
    }
  }

  return score;
}

function getRelatedScore(
  current: { title: string; tags: string[] },
  candidate: { title: string; tags: string[]; featured?: boolean }
) {
  const tagScore = getOverlapScore(
    new Set(current.tags.map((tag) => tag.toLowerCase())),
    new Set(candidate.tags.map((tag) => tag.toLowerCase()))
  );
  const titleScore = getOverlapScore(
    tokenize(current.title),
    tokenize(candidate.title)
  );

  return tagScore * 6 + titleScore * 2 + (candidate.featured ? 1 : 0);
}

function postToRelatedItem(post: Post): RelatedContentItem {
  return {
    slug: post.slug,
    href: `/blog/${post.slug}`,
    title: post.title,
    summary: post.excerpt,
    kindLabel: "Blog post",
    meta: `${post.publishedAt} · ${post.readingTime}`,
    tags: post.tags,
    coverImage: post.coverImage
  };
}

function projectToRelatedItem(project: Project): RelatedContentItem {
  return {
    slug: project.slug,
    href: `/projects/${project.slug}`,
    title: project.title,
    summary: project.summary,
    kindLabel: "Project",
    meta: project.publishedAt
      ? `${project.status} · ${project.publishedAt}`
      : project.status,
    tags: project.tags,
    coverImage: project.coverImage
  };
}

export async function getPosts(): Promise<Post[]> {
  const posts = await fetchNotionPosts();
  const source =
    posts.length > 0 || hasNotionConfig("blog") ? posts : fallbackPosts;

  return source.map(enhancePost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.featured ?? true).slice(0, 2);
}

export async function getProjects(): Promise<Project[]> {
  const projects = await fetchNotionProjects();
  const source =
    projects.length > 0 || hasNotionConfig("projects")
      ? projects
      : fallbackProjects;

  return source.map(enhanceProject);
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  const featuredProjects = projects.filter(
    (project) => project.featured ?? true
  );
  return (featuredProjects.length > 0 ? featuredProjects : projects).slice(
    0,
    3
  );
}

export async function getAwards(): Promise<Award[]> {
  const awards = await fetchNotionAwards();

  return awards.length > 0 || hasNotionConfig("awards")
    ? awards
    : fallbackAwards;
}

export async function getRelatedPosts(
  slug: string,
  limit = 4
): Promise<RelatedContentItem[]> {
  const posts = await getPosts();
  const current = posts.find((post) => post.slug === slug);

  if (!current) {
    return [];
  }

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      item: post,
      score: getRelatedScore(current, post)
    }))
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
    .map(({ item }) => postToRelatedItem(item));
}

export async function getRelatedProjects(
  slug: string,
  limit = 4
): Promise<RelatedContentItem[]> {
  const projects = await getProjects();
  const current = projects.find((project) => project.slug === slug);

  if (!current) {
    return [];
  }

  return projects
    .filter((project) => project.slug !== slug)
    .map((project) => ({
      item: project,
      score: getRelatedScore(current, project)
    }))
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
    .map(({ item }) => projectToRelatedItem(item));
}
