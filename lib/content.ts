import { addHeadingAnchors } from "@/lib/article";
import {
  Award,
  EventItem,
  MediaAsset,
  Post,
  RelatedContentItem,
  ShortVideo
} from "@/lib/types";
import {
  fetchVaultAwards,
  fetchVaultEvents,
  fetchVaultPosts,
  fetchVaultShortVideos,
  fetchVaultSitePhotos
} from "@/lib/vault";

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
    meta: `${post.publishedAt} / ${post.readingTime}`,
    tags: post.tags,
    coverImage: post.coverImage
  };
}

export async function getPosts(): Promise<Post[]> {
  const vaultPosts = await fetchVaultPosts();

  return vaultPosts.map(enhancePost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.featured ?? true).slice(0, 2);
}

export async function getAwards(): Promise<Award[]> {
  return fetchVaultAwards();
}

export async function getShortVideos(): Promise<ShortVideo[]> {
  const vaultVideos = await fetchVaultShortVideos();

  return vaultVideos.filter((video) =>
    video.displayLocations.includes("aboutReels")
  );
}

export async function getSitePhotos() {
  return fetchVaultSitePhotos();
}

export async function getHeroSliderImages(): Promise<MediaAsset[]> {
  const photos = await getSitePhotos();
  const heroPhotos = photos
    .filter((photo) => photo.displayLocations.includes("hero"))
    .map(({ url, alt, caption }) => ({
      url,
      alt,
      ...(caption ? { caption } : {})
    }));

  return heroPhotos;
}

export async function getSiteLogo(): Promise<MediaAsset | undefined> {
  const photos = await getSitePhotos();
  const logo = photos
    .filter((photo) => photo.displayLocations.includes("logo"))
    .sort((first, second) => first.sortOrder - second.sortOrder)[0];

  return logo
    ? {
        url: logo.url,
        alt: logo.alt,
        ...(logo.caption ? { caption: logo.caption } : {})
      }
    : undefined;
}

export async function getEvents(): Promise<EventItem[]> {
  return fetchVaultEvents();
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
