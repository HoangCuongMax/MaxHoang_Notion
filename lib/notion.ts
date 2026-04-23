import { Post, Project } from "@/lib/types";

const NOTION_API_BASE = "https://api.notion.com/v1";
const DEFAULT_NOTION_VERSION = "2026-03-11";
const DEFAULT_REVALIDATE_SECONDS = 300;

type ContentSource = "blog" | "projects";

type NotionRichText = {
  plain_text?: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
  text?: {
    content?: string;
  };
};

type NotionProperty = {
  type?: string;
  [key: string]: unknown;
};

type NotionPage = {
  id: string;
  object?: string;
  created_time?: string;
  last_edited_time?: string;
  properties?: Record<string, NotionProperty>;
};

type NotionBlock = {
  id: string;
  type?: string;
  has_children?: boolean;
  [key: string]: unknown;
};

type RenderableBlock = NotionBlock & {
  children?: RenderableBlock[];
};

type DataSourceConfig = {
  dataSourceId?: string;
  databaseId?: string;
};

type NotionQueryResponse = {
  results?: NotionPage[];
  has_more?: boolean;
  next_cursor?: string | null;
};

type NotionBlocksResponse = {
  results?: NotionBlock[];
  has_more?: boolean;
  next_cursor?: string | null;
};

type NotionDatabaseResponse = {
  data_sources?: Array<{
    id?: string;
  }>;
};

type Sortable<T> = T & {
  sortDate: string;
};

const dataSourceIdCache = new Map<ContentSource, string>();

function readEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
  }

  return undefined;
}

function getNotionToken() {
  return readEnv(["NOTION_API_KEY", "NOTION_TOKEN"]);
}

function getNotionVersion() {
  return process.env.NOTION_VERSION?.trim() || DEFAULT_NOTION_VERSION;
}

function getRevalidateSeconds() {
  const value = Number(process.env.NOTION_REVALIDATE_SECONDS);
  return Number.isFinite(value) && value > 0
    ? value
    : DEFAULT_REVALIDATE_SECONDS;
}

function getDataSourceConfig(source: ContentSource): DataSourceConfig {
  if (source === "blog") {
    return {
      dataSourceId: readEnv([
        "NOTION_BLOG_DATA_SOURCE_ID",
        "NOTION_POSTS_DATA_SOURCE_ID"
      ]),
      databaseId: readEnv([
        "NOTION_BLOG_DATABASE_ID",
        "NOTION_POSTS_DATABASE_ID"
      ])
    };
  }

  return {
    dataSourceId: readEnv([
      "NOTION_PROJECTS_DATA_SOURCE_ID",
      "NOTION_PROJECT_DATA_SOURCE_ID"
    ]),
    databaseId: readEnv([
      "NOTION_PROJECTS_DATABASE_ID",
      "NOTION_PROJECT_DATABASE_ID"
    ])
  };
}

export function hasNotionConfig(source: ContentSource) {
  const config = getDataSourceConfig(source);
  return Boolean(getNotionToken() && (config.dataSourceId || config.databaseId));
}

async function notionRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T | undefined> {
  const token = getNotionToken();

  if (!token) {
    return undefined;
  }

  try {
    const response = await fetch(`${NOTION_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": getNotionVersion(),
        ...init.headers
      },
      next: {
        revalidate: getRevalidateSeconds()
      }
    });

    if (!response.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Notion request failed: ${response.status} ${path}`);
      }

      return undefined;
    }

    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

async function getDataSourceId(source: ContentSource) {
  const cached = dataSourceIdCache.get(source);

  if (cached) {
    return cached;
  }

  const config = getDataSourceConfig(source);

  if (config.dataSourceId) {
    dataSourceIdCache.set(source, config.dataSourceId);
    return config.dataSourceId;
  }

  if (!config.databaseId) {
    return undefined;
  }

  const database = await notionRequest<NotionDatabaseResponse>(
    `/databases/${encodeURIComponent(config.databaseId)}`
  );
  const dataSourceId = database?.data_sources?.[0]?.id;

  if (dataSourceId) {
    dataSourceIdCache.set(source, dataSourceId);
  }

  return dataSourceId;
}

async function queryDataSource(source: ContentSource, limit: number) {
  const dataSourceId = await getDataSourceId(source);

  if (!dataSourceId) {
    return [];
  }

  const pages: NotionPage[] = [];
  let startCursor: string | undefined;

  do {
    const response = await notionRequest<NotionQueryResponse>(
      `/data_sources/${encodeURIComponent(dataSourceId)}/query`,
      {
        method: "POST",
        body: JSON.stringify({
          page_size: Math.min(100, limit - pages.length),
          ...(startCursor ? { start_cursor: startCursor } : {})
        })
      }
    );

    const results = response?.results ?? [];
    pages.push(...results.filter((result) => result.object !== "data_source"));

    startCursor = response?.next_cursor ?? undefined;

    if (!response?.has_more || pages.length >= limit) {
      break;
    }
  } while (startCursor);

  return pages.slice(0, limit);
}

async function fetchBlockChildren(blockId: string): Promise<RenderableBlock[]> {
  const blocks: RenderableBlock[] = [];
  let startCursor: string | undefined;

  do {
    const query = new URLSearchParams({
      page_size: "100",
      ...(startCursor ? { start_cursor: startCursor } : {})
    });
    const response = await notionRequest<NotionBlocksResponse>(
      `/blocks/${encodeURIComponent(blockId)}/children?${query.toString()}`
    );
    const results = response?.results ?? [];

    for (const block of results) {
      blocks.push({
        ...block,
        children: block.has_children
          ? await fetchBlockChildren(block.id)
          : undefined
      });
    }

    startCursor = response?.next_cursor ?? undefined;

    if (!response?.has_more) {
      break;
    }
  } while (startCursor);

  return blocks;
}

async function fetchPageContentHtml(pageId: string) {
  const blocks = await fetchBlockChildren(pageId);
  return blocksToHtml(blocks).trim();
}

function asObject(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
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

function isSafeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return value.startsWith("/");
  }
}

function richTextPlain(richText: NotionRichText[]) {
  return richText
    .map((part) => part.plain_text ?? part.text?.content ?? "")
    .join("")
    .trim();
}

function richTextToHtml(richText: NotionRichText[]) {
  return richText
    .map((part) => {
      let content = escapeHtml(part.plain_text ?? part.text?.content ?? "");
      const annotations = part.annotations;

      if (annotations?.code) content = `<code>${content}</code>`;
      if (annotations?.bold) content = `<strong>${content}</strong>`;
      if (annotations?.italic) content = `<em>${content}</em>`;
      if (annotations?.underline) content = `<u>${content}</u>`;
      if (annotations?.strikethrough) content = `<s>${content}</s>`;

      if (part.href && isSafeUrl(part.href)) {
        content = `<a href="${escapeAttribute(
          part.href
        )}" target="_blank" rel="noreferrer">${content}</a>`;
      }

      return content;
    })
    .join("");
}

function getBlockData(block: NotionBlock) {
  return block.type ? asObject(block[block.type]) : undefined;
}

function getBlockRichText(block: NotionBlock) {
  return asArray<NotionRichText>(getBlockData(block)?.rich_text);
}

function getFileUrl(value: unknown) {
  const file = asObject(value);
  const type = asString(file?.type);

  if (type === "external") {
    return asString(asObject(file?.external)?.url);
  }

  if (type === "file") {
    return asString(asObject(file?.file)?.url);
  }

  return undefined;
}

function renderListItem(block: RenderableBlock) {
  const body = richTextToHtml(getBlockRichText(block));
  const children = block.children?.length ? blocksToHtml(block.children) : "";
  return `<li>${body}${children}</li>`;
}

function renderBlock(block: RenderableBlock) {
  const data = getBlockData(block);
  const richText = getBlockRichText(block);
  const html = richTextToHtml(richText);
  const children = block.children?.length ? blocksToHtml(block.children) : "";

  switch (block.type) {
    case "paragraph":
      return html || children ? `<p>${html}</p>${children}` : "";
    case "heading_1":
    case "heading_2":
      return `<h2>${html}</h2>${children}`;
    case "heading_3":
      return `<h3>${html}</h3>${children}`;
    case "quote":
    case "callout":
      return `<blockquote>${html}${children}</blockquote>`;
    case "to_do": {
      const checked = Boolean(data?.checked);
      return `<p>${checked ? "[x]" : "[ ]"} ${html}</p>${children}`;
    }
    case "code": {
      const plain = richTextPlain(richText);
      const language = asString(data?.language);
      return `<pre${
        language ? ` data-language="${escapeAttribute(language)}"` : ""
      }><code>${escapeHtml(plain)}</code></pre>`;
    }
    case "divider":
      return "<hr />";
    case "image": {
      const src = getFileUrl(data);
      const caption = richTextToHtml(
        asArray<NotionRichText>(data?.caption)
      );

      if (!src || !isSafeUrl(src)) {
        return "";
      }

      return `<figure><img src="${escapeAttribute(src)}" alt="${escapeAttribute(
        richTextPlain(asArray<NotionRichText>(data?.caption))
      )}" />${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
    }
    case "bookmark":
    case "embed":
    case "link_preview": {
      const url = asString(data?.url);
      return url && isSafeUrl(url)
        ? `<p><a href="${escapeAttribute(
            url
          )}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a></p>`
        : "";
    }
    default:
      return children;
  }
}

function blocksToHtml(blocks: RenderableBlock[]) {
  let html = "";

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === "bulleted_list_item") {
      const items: string[] = [];

      while (blocks[index]?.type === "bulleted_list_item") {
        items.push(renderListItem(blocks[index]));
        index += 1;
      }

      index -= 1;
      html += `<ul>${items.join("")}</ul>`;
      continue;
    }

    if (block.type === "numbered_list_item") {
      const items: string[] = [];

      while (blocks[index]?.type === "numbered_list_item") {
        items.push(renderListItem(blocks[index]));
        index += 1;
      }

      index -= 1;
      html += `<ol>${items.join("")}</ol>`;
      continue;
    }

    html += renderBlock(block);
  }

  return html;
}

function getPropertyByName(
  properties: Record<string, NotionProperty> | undefined,
  names: string[]
) {
  if (!properties) {
    return undefined;
  }

  const normalizedNames = names.map((name) => name.toLowerCase());
  const match = Object.entries(properties).find(([name]) =>
    normalizedNames.includes(name.toLowerCase())
  );

  return match?.[1];
}

function getPropertyByType(
  properties: Record<string, NotionProperty> | undefined,
  type: string
) {
  return Object.values(properties ?? {}).find((property) => property.type === type);
}

function propertyText(property: NotionProperty | undefined) {
  if (!property?.type) {
    return undefined;
  }

  if (property.type === "title" || property.type === "rich_text") {
    return richTextPlain(asArray<NotionRichText>(property[property.type]));
  }

  if (property.type === "select" || property.type === "status") {
    return asString(asObject(property[property.type])?.name);
  }

  if (["url", "email", "phone_number"].includes(property.type)) {
    return asString(property[property.type]);
  }

  if (property.type === "number") {
    const value = property.number;
    return typeof value === "number" ? String(value) : undefined;
  }

  if (property.type === "formula") {
    const formula = asObject(property.formula);
    const formulaType = asString(formula?.type);

    if (formulaType === "string") return asString(formula?.string);
    if (formulaType === "number" && typeof formula?.number === "number") {
      return String(formula.number);
    }
    if (formulaType === "boolean" && typeof formula?.boolean === "boolean") {
      return String(formula.boolean);
    }
  }

  return undefined;
}

function propertyDate(property: NotionProperty | undefined) {
  if (!property?.type) {
    return undefined;
  }

  if (property.type === "date") {
    return asString(asObject(property.date)?.start);
  }

  if (property.type === "formula") {
    const formula = asObject(property.formula);
    const formulaDate = asObject(formula?.date);
    return asString(formulaDate?.start);
  }

  return undefined;
}

function propertyCheckbox(property: NotionProperty | undefined) {
  return property?.type === "checkbox" && typeof property.checkbox === "boolean"
    ? property.checkbox
    : undefined;
}

function propertyTags(property: NotionProperty | undefined) {
  if (!property?.type) {
    return [];
  }

  if (property.type === "multi_select") {
    return asArray<Record<string, unknown>>(property.multi_select)
      .map((tag) => asString(tag.name))
      .filter((tag): tag is string => Boolean(tag));
  }

  const text = propertyText(property);
  return text
    ? text
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
}

function getTitle(page: NotionPage) {
  return (
    propertyText(getPropertyByName(page.properties, ["Title", "Name"])) ??
    propertyText(getPropertyByType(page.properties, "title")) ??
    "Untitled"
  );
}

function getSlug(page: NotionPage, title: string) {
  const slug =
    propertyText(
      getPropertyByName(page.properties, ["Slug", "URL Slug", "Path"])
    ) ?? slugify(title);

  return slug || page.id;
}

function getExcerpt(page: NotionPage, contentHtml: string) {
  return (
    propertyText(
      getPropertyByName(page.properties, [
        "Excerpt",
        "Summary",
        "Description",
        "Subtitle"
      ])
    ) ?? stripHtml(contentHtml).slice(0, 180).trim()
  );
}

function getDateValue(page: NotionPage) {
  return (
    propertyDate(
      getPropertyByName(page.properties, [
        "Published",
        "Published At",
        "Publish Date",
        "Date"
      ])
    ) ??
    page.created_time ??
    page.last_edited_time ??
    new Date().toISOString()
  );
}

function isVisiblePage(page: NotionPage) {
  const publishedFlag = propertyCheckbox(
    getPropertyByName(page.properties, ["Published", "Public", "Visible"])
  );

  if (typeof publishedFlag === "boolean") {
    return publishedFlag;
  }

  const status = propertyText(
    getPropertyByName(page.properties, ["Publish Status", "Status", "State"])
  )?.toLowerCase();

  if (!status) {
    return true;
  }

  return !["archived", "draft", "hidden", "private", "unpublished"].includes(
    status
  );
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function mapPost(page: NotionPage): Promise<Sortable<Post>> {
  const contentHtml = await fetchPageContentHtml(page.id);
  const title = getTitle(page);
  const sortDate = getDateValue(page);

  return {
    slug: getSlug(page, title),
    title,
    excerpt: getExcerpt(page, contentHtml),
    contentHtml,
    publishedAt: formatDate(sortDate),
    readingTime: getReadingTime(contentHtml),
    featured: propertyCheckbox(
      getPropertyByName(page.properties, ["Featured", "Homepage", "Pinned"])
    ),
    sortDate
  };
}

async function mapProject(page: NotionPage): Promise<Sortable<Project>> {
  const contentHtml = await fetchPageContentHtml(page.id);
  const title = getTitle(page);
  const sortDate = getDateValue(page);

  return {
    slug: getSlug(page, title),
    title,
    summary: getExcerpt(page, contentHtml),
    contentHtml,
    status:
      propertyText(
        getPropertyByName(page.properties, [
          "Project Status",
          "Status",
          "Stage"
        ])
      ) ?? "Published",
    tags: propertyTags(
      getPropertyByName(page.properties, [
        "Tags",
        "Stack",
        "Tech",
        "Technologies"
      ])
    ),
    publishedAt: formatDate(sortDate),
    featured: propertyCheckbox(
      getPropertyByName(page.properties, ["Featured", "Homepage", "Pinned"])
    ),
    sortDate
  };
}

function sortByNewest<T extends { sortDate: string }>(items: T[]) {
  return [...items].sort(
    (first, second) =>
      new Date(second.sortDate).getTime() - new Date(first.sortDate).getTime()
  );
}

function stripSortDate<T extends { sortDate: string }>(
  item: T
): Omit<T, "sortDate"> {
  const { sortDate, ...rest } = item;
  void sortDate;
  return rest;
}

export async function fetchNotionPosts(): Promise<Post[]> {
  const pages = await queryDataSource("blog", 50);
  const posts = await Promise.all(pages.filter(isVisiblePage).map(mapPost));
  return sortByNewest(posts).map(stripSortDate);
}

export async function fetchNotionProjects(): Promise<Project[]> {
  const pages = await queryDataSource("projects", 50);
  const projects = await Promise.all(pages.filter(isVisiblePage).map(mapProject));
  return sortByNewest(projects).map(stripSortDate);
}
