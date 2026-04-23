# MaxHoangWordpress

Custom personal website built with Next.js and a headless WordPress backend.

## What is included

- custom homepage with editorial hero
- services page
- blog index and blog detail pages
- projects index and project detail pages
- tools section with interactive utilities
- WordPress REST API integration for blog posts and projects

## Stack

- Next.js App Router
- TypeScript
- WordPress REST API

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env.local
```

3. The repo already includes a local `.env.local` for development. If you want to point the frontend at a different WordPress instance later, update `WORDPRESS_API_URL`. It should look like:

```bash
WORDPRESS_API_URL=https://your-domain.com/wp-json/wp/v2
```

If you create a custom post type for projects, keep `WORDPRESS_PROJECTS_ENDPOINT=projects` or change it to your actual endpoint slug.
If your WordPress admin is on a different URL, set `WORDPRESS_ADMIN_URL=https://your-domain.com/wp-admin` so the header login button opens the correct admin panel.

4. Start the local WordPress backend:

```bash
npm run wp:dev
```

Default local WordPress login:

- username: `admin`
- password: `password`
- admin URL: `http://127.0.0.1:8881/wp-admin`

5. Start the frontend:

```bash
npm run dev
```

## WordPress setup

Use WordPress as the editorial backend.

- create standard blog posts in WordPress
- expose content through the REST API
- keep the frontend connected with `WORDPRESS_API_URL`
- optionally create a custom post type for projects and expose it through `WORDPRESS_PROJECTS_ENDPOINT`

The frontend already supports a custom projects endpoint and expects live WordPress content in production.

## Hosting

You do not need hosting right now to build or test this site locally.

- use the included local WordPress backend while developing
- buy hosting when you want the CMS and frontend available on the public internet
- when you go live, you can host WordPress on any PHP host and deploy the Next.js frontend separately

## Recommended next build steps

1. Add a WordPress custom post type for projects.
2. Add featured images and author data to the frontend.
3. Add an about page and contact route.
4. Deploy the frontend on Vercel.
5. Connect the custom domain to the Vercel project.
