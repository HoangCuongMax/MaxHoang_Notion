# Max Hoang Frontend

Custom personal website built with Next.js, Obsidian/GitHub-backed writing/media, Notion fallback support, and a live GitHub repository showcase.

## What is included

- custom homepage with editorial hero
- blog index and blog detail pages
- GitHub repository showcase that updates from public repositories
- Obsidian GitHub vault integration for blog posts, awards, events, short videos, and shared photos
- Notion API fallback support for existing databases
- contact page and monthly mailing list popup

## Stack

- Next.js App Router
- TypeScript
- Obsidian Markdown records stored in GitHub
- Notion API fallback data sources
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

3. Configure the Obsidian vault content source. Defaults already point at `HoangCuongMax/my-obsidian-vault`:

```bash
OBSIDIAN_VAULT_GITHUB_OWNER=HoangCuongMax
OBSIDIAN_VAULT_GITHUB_REPO=my-obsidian-vault
OBSIDIAN_VAULT_GITHUB_BRANCH=main
OBSIDIAN_VAULT_CONTENT_PATH=09 Website Database
GITHUB_TOKEN=github_pat_your_read_only_token
```

`GITHUB_TOKEN` is required when the vault repository is private. Use a fine-grained token with read-only Contents access to `HoangCuongMax/my-obsidian-vault`.

4. Optional: add your Notion integration token if you want Notion fallback content:

```bash
NOTION_API_KEY=secret_your_notion_integration_token
NOTION_BLOG_DATA_SOURCE_ID=your_blog_data_source_id
NOTION_AWARDS_DATA_SOURCE_ID=your_awards_data_source_id
NOTION_SHORT_VIDEOS_DATA_SOURCE_ID=your_short_videos_data_source_id
NOTION_PHOTOS_DATA_SOURCE_ID=your_photos_data_source_id
NOTION_EVENTS_DATA_SOURCE_ID=your_events_data_source_id
GITHUB_USERNAME=HoangCuongMax
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
CONTACT_TO_EMAIL=hoangngoccuong1414@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_NAME=Max Hoang Website
SMTP_FROM_EMAIL=your_verified_from_email
```

Current Notion data sources:

- Blog: `bb9e4516-594b-489c-91e5-75de95deafa4`
- Awards: `40500125-f31c-4e3f-b3c8-cdd670582dd0`
- Short videos: `c9ecba7a-e135-4b02-8279-93e4049610f7`
- Photos: set `NOTION_PHOTOS_DATA_SOURCE_ID` when the database is ready
- Events: `43444516-1e7a-4289-a8bb-3a589c1acb29`

You can also use `NOTION_BLOG_DATABASE_ID`, `NOTION_AWARDS_DATABASE_ID`, `NOTION_SHORT_VIDEOS_DATABASE_ID`, `NOTION_PHOTOS_DATABASE_ID`, and `NOTION_EVENTS_DATABASE_ID`. If database IDs are provided, the app retrieves the first data source inside each database before querying content.

5. Share each Notion database with your integration from the database menu under `Add connections` if you still use Notion fallback.

6. Start the frontend:

```bash
npm run dev
```

## Obsidian content model

The website reads Markdown files from the vault folder `09 Website Database`:

- `Blog`
- `Awards`
- `Events`
- `Photos`
- `Short Videos`

Set `published: true` in frontmatter to make a record live. Set `published: false` or `status: draft` to hide it.

## Notion fallback content model

For day-to-day editing, use `CONTENT_GUIDE.md`. The code is flexible about frontmatter and Notion property names, but these fields are recommended.

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

### Events

- `Name`: title property
- `Event Date`: date property
- `End Date`: optional date property
- `Location`: rich text
- `Description`: rich text
- `Event URL`: optional URL
- `Cover Photo`: optional image URL shown under the event content
- `Media Alt Text`: accessible text for the event cover photo
- `Published`: checkbox
- `Status`: select/status, where draft/private/hidden values are not shown
- `Featured`: checkbox for homepage priority
- `Sort Order`: number for manual slider ordering

### Short videos

- `Name` or `Title`: title property
- `YouTube URL`, `Shorts URL`, `Video URL`, `URL`, or `Link`: YouTube Shorts URL
- `Display`, `Placement`, `Show On`, or `Use As`: multi-select/tags containing `About Reels`
- `About Reels`: optional checkbox to show the video under the homepage About section
- `Published`: date or checkbox
- `Status` or `Publish Status`: select/status, where draft/private/hidden values are not shown
- `Featured`: checkbox for homepage priority
- `Sort Order`: number for manual homepage ordering
- `Summary`, `Description`, or `Caption`: optional text for future display

### Photos

- `Name` or `Title`: title property
- `Photo`, `Photo URL`, `Image`, `Image URL`, `Media`, `File`, `URL`, or `Link`: public image URL or Notion file
- `Display`, `Placement`, `Show On`, or `Use As`: multi-select/tags containing `Hero` or `Logo`
- `Hero`: optional checkbox to show the photo in the homepage hero slider
- `Logo`: optional checkbox to use the photo as the site/sidebar logo
- `Sort Order`: number for manual hero slider ordering
- `Published`: checkbox
- `Status` or `Publish Status`: select/status, where draft/private/hidden values are not shown
- `Media Alt Text` or `Alt Text`: accessible text for the photo
- `Caption`: optional caption

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

## Contact and newsletter

- `/contact` posts to `/api/contact`
- the corner mailing list popup posts to `/api/subscribe`
- both routes send notifications to `CONTACT_TO_EMAIL`
- for Gmail SMTP, use an app password for `SMTP_PASSWORD`

## Hosting

Deploy the frontend to Vercel or any host that supports Next.js. Add `NOTION_API_KEY` as a Vercel environment variable for Production, Preview, and Development. The database IDs are provided by the tracked `.env` file, and the Notion databases must be shared with the integration.
