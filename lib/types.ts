export type MediaAsset = {
  url: string;
  alt: string;
  caption?: string;
};

export type TableOfContentsItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type RelatedContentItem = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  kindLabel: string;
  meta: string;
  tags: string[];
  coverImage?: MediaAsset;
};

export type Award = {
  slug: string;
  title: string;
  event: string;
  project?: string;
  result: string;
  summary: string;
  year: number;
  tags: string[];
  coverImage?: MediaAsset;
  referenceUrl?: string;
  featured?: boolean;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  tableOfContents: TableOfContentsItem[];
  coverImage?: MediaAsset;
  gallery: MediaAsset[];
  videoUrl?: string;
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
  tableOfContents: TableOfContentsItem[];
  coverImage?: MediaAsset;
  gallery: MediaAsset[];
  videoUrl?: string;
  featured?: boolean;
};
