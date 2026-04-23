# Max Hoang Frontend

Custom personal website built with Next.js and Notion-backed content for blog posts and projects.

## What is included

- custom homepage with editorial hero
- services page
- blog index and blog detail pages
- projects index and project detail pages
- tools section with interactive utilities
- Notion API integration for blog posts and projects

## Stack

- Next.js App Router
- TypeScript
- Notion API data sources

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env.local
```

3. Add your Notion integration token. The site-specific data source IDs are already committed in `.env`:

```bash
NOTION_API_KEY=secret_your_notion_integration_token
NOTION_BLOG_DATA_SOURCE_ID=your_blog_data_source_id
NOTION_PROJECTS_DATA_SOURCE_ID=your_projects_data_source_id
```

Current Notion data sources:

- Blog: `bb9e4516-594b-489c-91e5-75de95deafa4`
- Projects: `53ac54ef-d1dc-47f4-aeb9-c570b40d87de`

You can also use `NOTION_BLOG_DATABASE_ID` and `NOTION_PROJECTS_DATABASE_ID`. If database IDs are provided, the app retrieves the first data source inside each database before querying content.

4. Share each Notion database with your integration from the database menu under `Add connections`.

5. Start the frontend:

```bash
npm run dev
```

## Notion content model

Create two Notion data sources: one for blog posts and one for projects. The code is flexible about property names, but these fields are recommended.

### Blog posts

- `Title` or `Name`: title property
- `Slug`: rich text or formula, used for `/blog/[slug]`
- `Excerpt`: rich text
- `Published`: date or checkbox
- `Status` or `Publish Status`: select/status, where draft/private/hidden values are not shown
- `Featured`: checkbox for homepage priority

### Projects

- `Title` or `Name`: title property
- `Slug`: rich text or formula, used for `/projects/[slug]`
- `Summary`: rich text
- `Project Status` or `Status`: select/status
- `Tags`, `Stack`, or `Technologies`: multi-select or comma-separated text
- `Published`: date or checkbox
- `Featured`: checkbox for homepage priority

Page body blocks are rendered into article HTML for detail pages. Supported blocks include paragraphs, headings, lists, quotes, callouts, code blocks, dividers, images, embeds, bookmarks, and link previews.

## Hosting

Deploy the frontend to Vercel or any host that supports Next.js. Add `NOTION_API_KEY` as a Vercel environment variable for Production, Preview, and Development. The database IDs are provided by the tracked `.env` file, and the Notion databases must be shared with the integration.
