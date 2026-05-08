import {
  Award,
  EventItem,
  MediaAsset,
  PhotoDisplayLocation,
  Post,
  ShortVideo,
  SitePhoto,
  VideoDisplayLocation
} from "@/lib/types";

type VaultSource =
  | "blog"
  | "awards"
  | "shortVideos"
  | "photos"
  | "events";

type VaultFile = {
  path: string;
  content: string;
};

type GithubTreeItem = {
  path?: string;
  type?: string;
  sha?: string;
};

type MarkdownRecord = {
  path: string;
  frontmatter: Record<string, string | string[] | number | boolean>;
  body: string;
};

type Sortable<T> = T & {
  sortDate: string;
  sortOrder: number;
  featuredRank: number;
};

const DEFAULT_OWNER = "HoangCuongMax";
const DEFAULT_REPO = "my-obsidian-vault";
const DEFAULT_BRANCH = "main";
const DEFAULT_BASE_PATH = "09 Website Database";
const DEFAULT_REVALIDATE_SECONDS = 300;

const SOURCE_PATHS: Record<VaultSource, string> = {
  blog: "Blog",
  awards: "Awards",
  shortVideos: "Short Videos",
  photos: "Photos",
  events: "Events"
};

function getVaultOwner() {
  return process.env.OBSIDIAN_VAULT_GITHUB_OWNER?.trim() || DEFAULT_OWNER;
}

function getVaultRepo() {
  return process.env.OBSIDIAN_VAULT_GITHUB_REPO?.trim() || DEFAULT_REPO;
}

function getVaultBranch() {
  return process.env.OBSIDIAN_VAULT_GITHUB_BRANCH?.trim() || DEFAULT_BRANCH;
}

function getVaultBasePath() {
  return (
    process.env.OBSIDIAN_VAULT_CONTENT_PATH?.trim() || DEFAULT_BASE_PATH
  ).replace(/^\/+|\/+$/g, "");
}

function getRevalidateSeconds() {
  const value = Number(process.env.OBSIDIAN_VAULT_REVALIDATE_SECONDS);
  return Number.isFinite(value) && value > 0
    ? value
    : DEFAULT_REVALIDATE_SECONDS;
}

function getGithubHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {})
  };
}

function isSafeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return value.startsWith("/");
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

function formatEventDate(start: string, end?: string) {
  const formatter = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const startLabel = formatter.format(new Date(start));

  if (!end || end === start) {
    return startLabel;
  }

  return `${startLabel} - ${formatter.format(new Date(end))}`;
}

function getReadingTime(html: string) {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function parseScalar(value: string): string | number | boolean {
  const trimmed = value.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  const unquoted = trimmed.replace(/^["']|["']$/g, "");
  const numeric = Number(unquoted);

  return unquoted !== "" && Number.isFinite(numeric) ? numeric : unquoted;
}

function parseInlineArray(value: string) {
  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function parseFrontmatter(markdown: string) {
  if (!markdown.startsWith("---")) {
    return {
      frontmatter: {},
      body: markdown
    };
  }

  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return {
      frontmatter: {},
      body: markdown
    };
  }

  const frontmatter: Record<string, string | string[] | number | boolean> = {};
  const lines = match[1].split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const scalarMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!scalarMatch) {
      continue;
    }

    const [, key, rawValue] = scalarMatch;

    if (rawValue.trim() === "") {
      const values: string[] = [];

      while (lines[index + 1]?.match(/^\s*-\s+/)) {
        index += 1;
        values.push(lines[index].replace(/^\s*-\s+/, "").trim());
      }

      frontmatter[key] = values;
      continue;
    }

    frontmatter[key] = rawValue.trim().startsWith("[")
      ? parseInlineArray(rawValue)
      : parseScalar(rawValue);
  }

  return {
    frontmatter,
    body: match[2]
  };
}

function getString(
  frontmatter: MarkdownRecord["frontmatter"],
  names: string[]
) {
  for (const name of names) {
    const value = frontmatter[name];

    if (typeof value === "string") {
      return value.trim();
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
  }

  return undefined;
}

function getNumber(
  frontmatter: MarkdownRecord["frontmatter"],
  names: string[]
) {
  const value = getString(frontmatter, names);
  const number = value ? Number(value) : Number.NaN;

  return Number.isFinite(number) ? number : undefined;
}

function getBoolean(
  frontmatter: MarkdownRecord["frontmatter"],
  names: string[]
) {
  for (const name of names) {
    const value = frontmatter[name];

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.toLowerCase().trim();

      if (["true", "yes", "published", "public"].includes(normalized)) {
        return true;
      }

      if (["false", "no", "draft", "private", "hidden"].includes(normalized)) {
        return false;
      }
    }
  }

  return undefined;
}

function getTags(
  frontmatter: MarkdownRecord["frontmatter"],
  names: string[]
) {
  for (const name of names) {
    const value = frontmatter[name];

    if (Array.isArray(value)) {
      return value.map((tag) => tag.trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function isPublished(record: MarkdownRecord) {
  const published = getBoolean(record.frontmatter, [
    "published",
    "public",
    "visible"
  ]);

  if (published !== true) {
    return false;
  }

  const status = getString(record.frontmatter, ["status", "state"])?.toLowerCase();

  return !["archived", "draft", "hidden", "private", "unpublished"].includes(
    status ?? ""
  );
}

function titleFromPath(path: string) {
  const fileName = path.split("/").pop() ?? "Untitled";
  return fileName.replace(/\.md$/i, "").replace(/[-_]+/g, " ");
}

function getTitle(record: MarkdownRecord) {
  return getString(record.frontmatter, ["title", "name"]) ?? titleFromPath(record.path);
}

function getSlug(record: MarkdownRecord, title: string) {
  return (
    getString(record.frontmatter, ["slug", "path"]) ??
    slugify(title) ??
    slugify(titleFromPath(record.path))
  );
}

function vaultRawUrl(path: string) {
  const encodedPath = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `https://raw.githubusercontent.com/${getVaultOwner()}/${getVaultRepo()}/${getVaultBranch()}/${encodedPath}`;
}

async function fetchGithubBlobText(sha: string) {
  const owner = getVaultOwner();
  const repo = getVaultRepo();

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/blobs/${encodeURIComponent(
      sha
    )}`,
    {
      headers: getGithubHeaders(),
      next: {
        revalidate: getRevalidateSeconds(),
        tags: ["obsidian-vault"]
      }
    }
  );

  if (!response.ok) {
    return undefined;
  }

  const blob = (await response.json()) as {
    content?: string;
    encoding?: string;
  };

  if (!blob.content || blob.encoding !== "base64") {
    return undefined;
  }

  return Buffer.from(blob.content.replace(/\s/g, ""), "base64").toString("utf8");
}

function normalizeMediaUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (isSafeUrl(trimmed)) {
    return trimmed;
  }

  return vaultRawUrl(trimmed.replace(/^\/+/, ""));
}

function mediaAsset(
  url: string | undefined,
  alt: string,
  caption?: string
) {
  const mediaUrl = normalizeMediaUrl(url);

  if (!mediaUrl) {
    return undefined;
  }

  return {
    url: mediaUrl,
    alt,
    ...(caption ? { caption } : {})
  };
}

function parseMarkdownInline(value: string) {
  let output = escapeHtml(value);

  output = output.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_match, alt: string, src: string) => {
      const url = normalizeMediaUrl(src);
      return url
        ? `<img src="${escapeAttribute(url)}" alt="${escapeAttribute(alt)}" />`
        : "";
    }
  );
  output = output.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label: string, href: string) =>
      isSafeUrl(href)
        ? `<a href="${escapeAttribute(
            href
          )}" target="_blank" rel="noreferrer">${label}</a>`
        : label
  );
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");

  return output;
}

function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let orderedList = false;
  let code: string[] = [];
  let codeLanguage = "";

  function flushParagraph() {
    if (paragraph.length === 0) return;
    html.push(`<p>${parseMarkdownInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (list.length === 0) return;
    html.push(`<${orderedList ? "ol" : "ul"}>${list.join("")}</${orderedList ? "ol" : "ul"}>`);
    list = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (code.length > 0 || codeLanguage) {
        html.push(
          `<pre${
            codeLanguage ? ` data-language="${escapeAttribute(codeLanguage)}"` : ""
          }><code>${escapeHtml(code.join("\n"))}</code></pre>`
        );
        code = [];
        codeLanguage = "";
      } else {
        flushParagraph();
        flushList();
        codeLanguage = trimmed.replace(/^```/, "").trim();
      }
      continue;
    }

    if (codeLanguage) {
      code.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);

    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(3, heading[1].length);
      html.push(`<h${level}>${parseMarkdownInline(heading[2])}</h${level}>`);
      continue;
    }

    if (trimmed === "---") {
      flushParagraph();
      flushList();
      html.push("<hr />");
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${parseMarkdownInline(trimmed.slice(2))}</blockquote>`);
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);

    if (unordered || ordered) {
      flushParagraph();
      const nextOrdered = Boolean(ordered);

      if (list.length > 0 && orderedList !== nextOrdered) {
        flushList();
      }

      orderedList = nextOrdered;
      list.push(`<li>${parseMarkdownInline((unordered ?? ordered)?.[1] ?? "")}</li>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return html.join("\n");
}

function getExcerpt(record: MarkdownRecord, contentHtml: string) {
  return (
    getString(record.frontmatter, ["excerpt", "summary", "description"]) ??
    contentHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180)
  );
}

function getDateValue(record: MarkdownRecord) {
  return (
    getString(record.frontmatter, [
      "publishedAt",
      "date",
      "eventDate",
      "startsAt"
    ]) ?? new Date().toISOString()
  );
}

async function fetchVaultFiles(source: VaultSource): Promise<VaultFile[]> {
  const owner = getVaultOwner();
  const repo = getVaultRepo();
  const branch = getVaultBranch();
  const sourcePath = `${getVaultBasePath()}/${SOURCE_PATHS[source]}`;

  try {
    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(
        branch
      )}?recursive=1`,
      {
        headers: getGithubHeaders(),
        next: {
          revalidate: getRevalidateSeconds(),
          tags: ["obsidian-vault"]
        }
      }
    );

    if (!treeResponse.ok) {
      return [];
    }

    const treeData = (await treeResponse.json()) as {
      tree?: GithubTreeItem[];
    };
    const markdownItems = (treeData.tree ?? [])
      .filter(
        (item) =>
          item.type === "blob" &&
          item.sha &&
          item.path?.startsWith(`${sourcePath}/`) &&
          item.path.toLowerCase().endsWith(".md")
      );

    const files = await Promise.all(
      markdownItems.map(async (item) => {
        const path = item.path;
        const sha = item.sha;

        if (!path || !sha) {
          return undefined;
        }

        const content = await fetchGithubBlobText(sha);

        if (!content) {
          return undefined;
        }

        return {
          path,
          content
        };
      })
    );

    return files.filter((file): file is VaultFile => Boolean(file));
  } catch {
    return [];
  }
}

async function fetchMarkdownRecords(source: VaultSource) {
  const files = await fetchVaultFiles(source);

  return files
    .map((file) => {
      const parsed = parseFrontmatter(file.content);

      return {
        path: file.path,
        frontmatter: parsed.frontmatter,
        body: parsed.body.trim()
      };
    })
    .filter(isPublished);
}

function mapPost(record: MarkdownRecord): Sortable<Post> {
  const title = getTitle(record);
  const contentHtml = markdownToHtml(record.body);
  const sortDate = getDateValue(record);

  return {
    slug: getSlug(record, title),
    title,
    excerpt: getExcerpt(record, contentHtml),
    contentHtml,
    publishedAt: formatDate(sortDate),
    readingTime: getReadingTime(contentHtml),
    tags: getTags(record.frontmatter, ["tags", "categories", "topics"]),
    tableOfContents: [],
    coverImage: mediaAsset(
      getString(record.frontmatter, ["coverImage", "cover", "image"]),
      getString(record.frontmatter, ["mediaAltText", "alt"]) ?? `${title} media`
    ),
    gallery: getTags(record.frontmatter, ["gallery", "images"]).map(
      (url, index) =>
        mediaAsset(
          url,
          `${getString(record.frontmatter, ["mediaAltText", "alt"]) ?? title} ${
            index + 1
          }`
        )
    ).filter((asset): asset is MediaAsset => Boolean(asset)),
    videoUrl: normalizeMediaUrl(getString(record.frontmatter, ["videoUrl", "video"])),
    featured: getBoolean(record.frontmatter, ["featured", "homepage", "pinned"]),
    sortDate,
    sortOrder: getNumber(record.frontmatter, ["sortOrder", "order", "rank"]) ?? 999,
    featuredRank:
      getBoolean(record.frontmatter, ["featured", "homepage", "pinned"]) === false
        ? 1
        : 0
  };
}

function mapAward(record: MarkdownRecord): Sortable<Award> {
  const title = getTitle(record);
  const sortDate = getDateValue(record);
  const featured = getBoolean(record.frontmatter, ["featured", "homepage", "pinned"]);

  return {
    slug: getSlug(record, title),
    title,
    event: getString(record.frontmatter, ["event", "program"]) ?? "",
    project: getString(record.frontmatter, ["project", "work"]),
    result:
      getString(record.frontmatter, ["result", "award", "recognition", "prize"]) ??
      "",
    summary: getString(record.frontmatter, ["summary", "description", "excerpt"]) ?? "",
    year:
      getNumber(record.frontmatter, ["year"]) ?? new Date(sortDate).getFullYear(),
    tags: getTags(record.frontmatter, ["tags", "categories"]),
    coverImage: mediaAsset(
      getString(record.frontmatter, ["coverImage", "cover", "image"]),
      getString(record.frontmatter, ["mediaAltText", "alt"]) ?? `${title} media`
    ),
    referenceUrl: getString(record.frontmatter, ["referenceUrl", "url", "link"]),
    featured,
    sortDate,
    sortOrder: getNumber(record.frontmatter, ["sortOrder", "order", "rank"]) ?? 999,
    featuredRank: featured ? 0 : 1
  };
}

function getYouTubeId(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0];
    }

    if (url.searchParams.has("v")) {
      return url.searchParams.get("v") ?? undefined;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const marker = parts.findIndex((part) =>
      ["shorts", "embed", "live"].includes(part)
    );

    if (marker >= 0) {
      return parts[marker + 1];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function mapShortVideo(record: MarkdownRecord): Sortable<ShortVideo> | undefined {
  const title = getTitle(record);
  const url = getString(record.frontmatter, [
    "youtubeUrl",
    "shortsUrl",
    "videoUrl",
    "url",
    "link"
  ]);
  const youtubeId = getYouTubeId(url);

  if (!url || !youtubeId) {
    return undefined;
  }

  const displayLocations = getTags(record.frontmatter, [
    "display",
    "placement",
    "showOn",
    "useAs"
  ]).map((value) => value.toLowerCase());
  const showAboutReels =
    displayLocations.includes("about reels") ||
    displayLocations.includes("aboutreels") ||
    getBoolean(record.frontmatter, ["aboutReels", "reels", "shorts"]);

  if (!showAboutReels) {
    return undefined;
  }

  const sortDate = getDateValue(record);
  const featured = getBoolean(record.frontmatter, ["featured", "homepage", "pinned"]);

  return {
    slug: getSlug(record, title),
    title,
    url,
    youtubeId,
    displayLocations: ["aboutReels"] satisfies VideoDisplayLocation[],
    summary: getString(record.frontmatter, ["summary", "description", "caption"]),
    publishedAt: formatDate(sortDate),
    featured,
    sortDate,
    sortOrder: getNumber(record.frontmatter, ["sortOrder", "order", "rank"]) ?? 999,
    featuredRank: featured === false ? 1 : 0
  };
}

function mapSitePhoto(record: MarkdownRecord): Sortable<SitePhoto> | undefined {
  const title = getTitle(record);
  const displayValues = getTags(record.frontmatter, [
    "display",
    "placement",
    "showOn",
    "useAs"
  ]).map((value) => value.toLowerCase());
  const locations = new Set<PhotoDisplayLocation>();

  if (
    displayValues.some((value) =>
      ["hero", "hero slider", "home hero", "homepage hero", "slider"].includes(
        value
      )
    ) ||
    getBoolean(record.frontmatter, ["hero", "heroSlider"])
  ) {
    locations.add("hero");
  }

  if (
    displayValues.some((value) =>
      ["logo", "site logo", "avatar", "profile", "brand"].includes(value)
    ) ||
    getBoolean(record.frontmatter, ["logo", "siteLogo"])
  ) {
    locations.add("logo");
  }

  const asset = mediaAsset(
    getString(record.frontmatter, ["photoUrl", "imageUrl", "photo", "image", "url"]),
    getString(record.frontmatter, ["mediaAltText", "alt"]) ?? `${title} media`,
    getString(record.frontmatter, ["caption", "description", "summary"])
  );

  if (!asset || locations.size === 0) {
    return undefined;
  }

  const sortDate = getDateValue(record);

  return {
    ...asset,
    slug: getSlug(record, title),
    title,
    displayLocations: [...locations],
    sortOrder: getNumber(record.frontmatter, ["sortOrder", "order", "rank"]) ?? 999,
    featured: getBoolean(record.frontmatter, ["featured", "homepage", "pinned"]),
    sortDate,
    featuredRank: 0
  };
}

function mapEvent(record: MarkdownRecord): Sortable<EventItem> {
  const title = getTitle(record);
  const startsAt = getDateValue(record);
  const endsAt = getString(record.frontmatter, ["endsAt", "endDate", "end"]);
  const featured = getBoolean(record.frontmatter, ["featured", "homepage", "pinned"]);

  return {
    slug: getSlug(record, title),
    title,
    startsAt,
    ...(endsAt ? { endsAt } : {}),
    displayDate: formatEventDate(startsAt, endsAt),
    location: getString(record.frontmatter, ["location", "venue", "place"]),
    description: getString(record.frontmatter, [
      "description",
      "summary",
      "excerpt",
      "caption"
    ]),
    eventUrl: getString(record.frontmatter, ["eventUrl", "referenceUrl", "url", "link"]),
    coverImage: mediaAsset(
      getString(record.frontmatter, ["coverImage", "coverPhoto", "image"]),
      getString(record.frontmatter, ["mediaAltText", "alt"]) ?? `${title} media`
    ),
    featured,
    sortDate: startsAt,
    sortOrder: getNumber(record.frontmatter, ["sortOrder", "order", "rank"]) ?? 999,
    featuredRank: featured ? 0 : 1
  };
}

function stripSortFields<T>(item: Sortable<T>): T {
  const { sortDate, sortOrder, featuredRank, ...rest } = item;
  void sortDate;
  void sortOrder;
  void featuredRank;
  return rest as T;
}

export async function fetchVaultPosts(): Promise<Post[]> {
  const records = await fetchMarkdownRecords("blog");
  return records
    .map(mapPost)
    .sort(
      (first, second) =>
        first.featuredRank - second.featuredRank ||
        new Date(second.sortDate).getTime() - new Date(first.sortDate).getTime()
    )
    .map(stripSortFields);
}

export async function fetchVaultAwards(): Promise<Award[]> {
  const records = await fetchMarkdownRecords("awards");
  return records
    .map(mapAward)
    .sort(
      (first, second) =>
        first.featuredRank - second.featuredRank ||
        first.sortOrder - second.sortOrder ||
        second.year - first.year ||
        first.title.localeCompare(second.title)
    )
    .map(stripSortFields);
}

export async function fetchVaultShortVideos(): Promise<ShortVideo[]> {
  const records = await fetchMarkdownRecords("shortVideos");
  return records
    .map(mapShortVideo)
    .filter((video): video is Sortable<ShortVideo> => Boolean(video))
    .sort(
      (first, second) =>
        first.featuredRank - second.featuredRank ||
        first.sortOrder - second.sortOrder ||
        new Date(second.sortDate).getTime() - new Date(first.sortDate).getTime()
    )
    .map(stripSortFields);
}

export async function fetchVaultSitePhotos(): Promise<SitePhoto[]> {
  const records = await fetchMarkdownRecords("photos");
  return records
    .map(mapSitePhoto)
    .filter((photo): photo is Sortable<SitePhoto> => Boolean(photo))
    .sort(
      (first, second) =>
        first.sortOrder - second.sortOrder ||
        new Date(second.sortDate).getTime() - new Date(first.sortDate).getTime()
    )
    .map(stripSortFields);
}

export async function fetchVaultEvents(): Promise<EventItem[]> {
  const records = await fetchMarkdownRecords("events");
  return records
    .map(mapEvent)
    .sort(
      (first, second) =>
        first.featuredRank - second.featuredRank ||
        first.sortOrder - second.sortOrder ||
        new Date(first.sortDate).getTime() - new Date(second.sortDate).getTime()
    )
    .map(stripSortFields);
}
