export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  readingTime: string;
  featured?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  contentHtml: string;
  status: string;
  tags: string[];
  publishedAt?: string;
  featured?: boolean;
};
