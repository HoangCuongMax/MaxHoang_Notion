import { Post, Project } from "@/lib/types";
import { fetchWordPressPosts, fetchWordPressProjects } from "@/lib/wordpress";

export async function getPosts(): Promise<Post[]> {
  return fetchWordPressPosts();
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
  return fetchWordPressProjects();
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
