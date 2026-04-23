import { Post, Project } from "@/lib/types";
import { fallbackPosts, fallbackProjects } from "@/lib/mock-data";
import {
  fetchNotionPosts,
  fetchNotionProjects,
  hasNotionConfig
} from "@/lib/notion";

export async function getPosts(): Promise<Post[]> {
  const posts = await fetchNotionPosts();
  return posts.length > 0 || hasNotionConfig("blog") ? posts : fallbackPosts;
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
  return projects.length > 0 || hasNotionConfig("projects")
    ? projects
    : fallbackProjects;
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.slice(0, 3);
}
