# Max Hoang Frontend

Custom personal website built with Next.js and Notion-backed content for blog posts, projects, and awards.

## What is included

- custom homepage with editorial hero
- services page
- blog index and blog detail pages
- projects index and project detail pages
- tools section with interactive utilities
- Notion API integration for blog posts, projects, and awards

## Stack

- Next.js App Router
- TypeScript
- Notion API data sources
- ImageKit for website media delivery

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
NOTION_AWARDS_DATA_SOURCE_ID=your_awards_data_source_id
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

Current Notion data sources:

- Blog: `bb9e4516-594b-489c-91e5-75de95deafa4`
- Projects: `53ac54ef-d1dc-47f4-aeb9-c570b40d87de`
- Awards: `40500125-f31c-4e3f-b3c8-cdd670582dd0`

You can also use `NOTION_BLOG_DATABASE_ID`, `NOTION_PROJECTS_DATABASE_ID`, and `NOTION_AWARDS_DATABASE_ID`. If database IDs are provided, the app retrieves the first data source inside each database before querying content.

4. Share each Notion database with your integration from the database menu under `Add connections`.

5. Start the frontend:

```bash
npm run dev
```

## Notion content model

Create three Notion data sources: one for blog posts, one for projects, and one for awards. The code is flexible about property names, but these fields are recommended.

### Blog posts

- `Title` or `Name`: title property
- `Slug`: rich text or formula, used for `/blog/[slug]`
- `Excerpt`: rich text
- `Published`: date or checkbox
- `Status` or `Publish Status`: select/status, where draft/private/hidden values are not shown
- `Featured`: checkbox for homepage priority
- `Cover Image`: ImageKit URL or path for the cover image
- `Gallery`: one ImageKit URL or path per line
- `Video URL`: ImageKit video URL or path
- `Media Alt Text`: accessible text for the cover image and gallery

### Projects

- `Title` or `Name`: title property
- `Slug`: rich text or formula, used for `/projects/[slug]`
- `Summary`: rich text
- `Project Status` or `Status`: select/status
- `Tags`, `Stack`, or `Technologies`: multi-select or comma-separated text
- `Published`: date or checkbox
- `Featured`: checkbox for homepage priority
- `Cover Image`: ImageKit URL or path for the cover image
- `Gallery`: one ImageKit URL or path per line
- `Video URL`: ImageKit video URL or path
- `Media Alt Text`: accessible text for the cover image and gallery

### Awards

- `Name`: title property
- `Event`: rich text
- `Project`: rich text
- `Result`: rich text
- `Summary`: rich text
- `Year`: number
- `Sort Order`: number for manual homepage ordering
- `Tags`: multi-select or comma-separated text
- `Published`: checkbox
- `Featured`: checkbox
- `Cover Image`: ImageKit URL or path
- `Media Alt Text`: accessible text for the cover image
- `Reference URL`: optional link to the source page or project reference

Page body blocks are rendered into article HTML for detail pages. Supported blocks include paragraphs, headings, lists, quotes, callouts, code blocks, dividers, images, embeds, bookmarks, and link previews.

## ImageKit media workflow

Use ImageKit as the public media storage layer and Notion as the editor.

1. Upload photos and videos in the ImageKit media library.
2. Copy either the full ImageKit URL or the path under your URL endpoint.
3. Paste the value into `Cover Image`, `Gallery`, or `Video URL` in Notion.
4. The website renders the media with ImageKit transformations and responsive loading.

If you store relative paths such as `/blog/my-cover.jpg`, set
`NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` in `.env.local` and in your deployment
environment. Full ImageKit URLs work without the endpoint, but the endpoint keeps
Notion fields shorter.

This project is configured for the ImageKit endpoint
`https://ik.imagekit.io/maxhoang`.

The route `/api/imagekit-auth` is ready for a future upload UI. It requires
`IMAGEKIT_PUBLIC_KEY` and `IMAGEKIT_PRIVATE_KEY`, and those keys should only be
stored in local or deployment secrets.

## Hosting

Deploy the frontend to Vercel or any host that supports Next.js. Add `NOTION_API_KEY` as a Vercel environment variable for Production, Preview, and Development. The database IDs are provided by the tracked `.env` file, and the Notion databases must be shared with the integration.
