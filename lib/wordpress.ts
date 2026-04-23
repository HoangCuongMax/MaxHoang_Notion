import { Post, Project } from "@/lib/types";

type WordPressPost = {
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
};

type WordPressProject = {
  slug: string;
  date?: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  _embedded?: {
    "wp:term"?: Array<
      Array<{
        taxonomy: string;
        name: string;
      }>
    >;
  };
  meta?: {
    project_status?: string;
  };
};

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function getReadingTime(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

function mapWordPressPost(post: WordPressPost): Post {
  return {
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    contentHtml: post.content.rendered,
    publishedAt: formatDate(post.date),
    readingTime: getReadingTime(post.content.rendered)
  };
}

function mapWordPressProject(project: WordPressProject): Project {
  const termGroups = project._embedded?.["wp:term"] ?? [];
  const tags = termGroups
    .flat()
    .filter((term) => term.taxonomy === "post_tag")
    .map((term) => term.name);

  return {
    slug: project.slug,
    title: stripHtml(project.title.rendered),
    summary: stripHtml(project.excerpt?.rendered ?? project.content.rendered)
      .slice(0, 180)
      .trim(),
    contentHtml: project.content.rendered,
    status: project.meta?.project_status ?? "Published",
    tags,
    publishedAt: project.date ? formatDate(project.date) : undefined
  };
}

function buildEndpoint(baseUrl: string, resource: string, extraParams?: string) {
  const normalizedResource = resource.replace(/^\/+/, "");

  if (baseUrl.includes("rest_route=")) {
    const url = new URL(baseUrl);
    const currentRoute = url.searchParams.get("rest_route") ?? "/wp/v2";
    const normalizedRoute = currentRoute.replace(/\/$/, "");

    url.searchParams.set("rest_route", `${normalizedRoute}/${normalizedResource}`);

    if (extraParams) {
      const params = new URLSearchParams(extraParams);
      params.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  }

  const trimmedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${trimmedBase}/${normalizedResource}${extraParams ? `?${extraParams}` : ""}`;
}

export async function fetchWordPressPosts(): Promise<Post[]> {
  const baseUrl = process.env.WORDPRESS_API_URL;

  if (!baseUrl) {
    return [];
  }

  try {
    const response = await fetch(
      buildEndpoint(baseUrl, "posts", "per_page=10&_embed"),
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      return [];
    }

    const posts = (await response.json()) as WordPressPost[];
    return posts.map(mapWordPressPost);
  } catch {
    return [];
  }
}

export async function fetchWordPressProjects(): Promise<Project[]> {
  const baseUrl = process.env.WORDPRESS_API_URL;
  const endpoint = process.env.WORDPRESS_PROJECTS_ENDPOINT ?? "projects";

  if (!baseUrl) {
    return [];
  }

  try {
    const response = await fetch(
      buildEndpoint(baseUrl, endpoint, "per_page=12&_embed"),
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      return [];
    }

    const projects = (await response.json()) as WordPressProject[];

    if (projects.length === 0) {
      return [];
    }

    return projects.map(mapWordPressProject);
  } catch {
    return [];
  }
}
