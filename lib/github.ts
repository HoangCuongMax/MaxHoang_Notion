export type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  pushed_at: string;
  archived: boolean;
  fork: boolean;
};

export type RepositoryCard = {
  id: number;
  name: string;
  description: string;
  impact: string;
  category: string;
  url: string;
  homepage?: string;
  language?: string;
  stars: number;
  forks: number;
  topics: string[];
  skills: string[];
  signals: string[];
  updatedAt: string;
  updatedAtTimestamp: number;
  showcaseRank: number;
};

const githubUsername =
  process.env.GITHUB_USERNAME ||
  process.env.NEXT_PUBLIC_GITHUB_USERNAME ||
  "HoangCuongMax";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

const repoShowcaseDetails: Record<
  string,
  Partial<
    Pick<
      RepositoryCard,
      "category" | "description" | "impact" | "skills" | "signals" | "showcaseRank"
    >
  >
> = {
  maxhoang_notion: {
    category: "AI portfolio platform",
    impact:
      "Connects Obsidian content, GitHub work, media, events, and writing into one employer-facing portfolio.",
    skills: ["Next.js", "TypeScript", "Obsidian", "GitHub API", "Vercel"],
    signals: ["Portfolio system", "Content automation", "API integration"],
    showcaseRank: 1
  },
  "rdb-alpha": {
    category: "Data systems",
    impact:
      "Shows database thinking, structured information design, and data modelling practice.",
    skills: ["Database design", "Data modelling", "SQL thinking"],
    signals: ["Data architecture", "Learning lab"],
    showcaseRank: 2
  },
  nthackers: {
    category: "Open data / community",
    impact:
      "Highlights public-interest technology work and collaboration around civic innovation.",
    skills: ["Open data", "Community tech", "Rapid prototyping"],
    signals: ["Civic tech", "Hackathon work"],
    showcaseRank: 3
  }
};

const skillKeywords = [
  { pattern: /python|pandas|numpy|notebook|jupyter/i, skill: "Python" },
  { pattern: /sql|database|db|relational|rdb/i, skill: "SQL / Databases" },
  { pattern: /ai|ml|machine|vision|nlp|openai|chatbot/i, skill: "AI / ML" },
  { pattern: /data|analytics|dashboard|powerbi|report/i, skill: "Data Analytics" },
  { pattern: /next|react|typescript|frontend|website|web/i, skill: "Web App" },
  { pattern: /api|automation|workflow|obsidian|github/i, skill: "Automation" }
];

function slugifyRepoName(value: string) {
  return value.toLowerCase();
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function inferSkills(repo: GitHubRepository) {
  const searchText = [
    repo.name,
    repo.description ?? "",
    repo.language ?? "",
    ...(repo.topics ?? [])
  ].join(" ");
  const inferred = skillKeywords
    .filter(({ pattern }) => pattern.test(searchText))
    .map(({ skill }) => skill);

  return uniqueValues([
    ...(repo.language ? [repo.language] : []),
    ...inferred,
    ...(repo.topics ?? []).slice(0, 3)
  ]).slice(0, 6);
}

function inferCategory(repo: GitHubRepository) {
  const searchText = `${repo.name} ${repo.description ?? ""} ${
    repo.language ?? ""
  } ${(repo.topics ?? []).join(" ")}`;

  if (/ai|ml|machine|vision|nlp|openai|chatbot/i.test(searchText)) {
    return "AI prototype";
  }

  if (/data|analytics|dashboard|sql|database|report/i.test(searchText)) {
    return "Data analytics";
  }

  if (/automation|workflow|api|obsidian|github/i.test(searchText)) {
    return "Automation";
  }

  return "Technical project";
}

function inferImpact(repo: GitHubRepository) {
  const description = repo.description?.trim();

  if (description) {
    return description;
  }

  if (/data|sql|database|analytics/i.test(repo.name)) {
    return "Demonstrates structured data thinking, analysis workflow, and technical problem solving.";
  }

  if (/ai|ml|vision|chat/i.test(repo.name)) {
    return "Explores applied AI patterns and product ideas through a working technical prototype.";
  }

  return "Shows practical software delivery, repository hygiene, and ongoing technical learning.";
}

function inferSignals(repo: GitHubRepository, category: string) {
  const signals = [category];

  if (repo.homepage) {
    signals.push("Live demo");
  }

  if (repo.pushed_at) {
    signals.push("Recently maintained");
  }

  if ((repo.topics ?? []).length > 0) {
    signals.push("Tagged stack");
  }

  return uniqueValues(signals).slice(0, 4);
}

function toRepositoryCard(repo: GitHubRepository): RepositoryCard {
  const details = repoShowcaseDetails[slugifyRepoName(repo.name)] ?? {};
  const category = details.category ?? inferCategory(repo);
  const skills = uniqueValues([
    ...(details.skills ?? []),
    ...inferSkills(repo)
  ]).slice(0, 6);
  const signals = uniqueValues([
    ...(details.signals ?? []),
    ...inferSignals(repo, category)
  ]).slice(0, 4);

  return {
    id: repo.id,
    name: repo.name,
    description:
      details.description ??
      repo.description ??
      "Repository details are available on GitHub.",
    impact: details.impact ?? inferImpact(repo),
    category,
    url: repo.html_url,
    ...(repo.homepage ? { homepage: repo.homepage } : {}),
    ...(repo.language ? { language: repo.language } : {}),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics ?? [],
    skills,
    signals,
    updatedAt: formatDate(repo.pushed_at),
    updatedAtTimestamp: new Date(repo.pushed_at).getTime(),
    showcaseRank: details.showcaseRank ?? 50
  };
}

export async function getGithubRepositories(limit?: number) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated&type=owner`,
    {
      headers,
      next: {
        revalidate: 1800
      }
    }
  );

  if (!response.ok) {
    return [];
  }

  const repositories = (await response.json()) as GitHubRepository[];
  const visibleRepositories = repositories
    .filter((repo) => !repo.archived && !repo.fork)
    .sort(
      (first, second) =>
        new Date(second.pushed_at).getTime() -
        new Date(first.pushed_at).getTime()
    )
    .map(toRepositoryCard)
    .sort(
      (first, second) =>
        first.showcaseRank - second.showcaseRank ||
        second.updatedAtTimestamp - first.updatedAtTimestamp
    );

  return typeof limit === "number"
    ? visibleRepositories.slice(0, limit)
    : visibleRepositories;
}

export function getGithubProfileUrl() {
  return `https://github.com/${githubUsername}`;
}
