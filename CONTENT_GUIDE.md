# Website Content Guide

Use the Obsidian GitHub vault as the main editing surface. The website reads published Markdown records from `09 Website Database` in `HoangCuongMax/my-obsidian-vault`, then falls back to Notion if a vault section has no published records.

After changing content in Obsidian, commit and push the vault. Obsidian Git is configured to do this automatically.

If the vault repo is private, the website deployment needs `GITHUB_TOKEN` with read-only Contents access to `HoangCuongMax/my-obsidian-vault`.

## Main Obsidian Database Folders

| Content | Database | What it controls |
| --- | --- | --- |
| Blog | `09 Website Database/Blog` | Blog index, blog detail pages, latest footer posts |
| GitHub | Public GitHub profile | Repository showcase page and homepage repo cards |
| Awards | `09 Website Database/Awards` | Homepage awards carousel |
| Events | `09 Website Database/Events` | Homepage event slider and latest footer events |
| Videos | `09 Website Database/Short Videos` | Homepage About reels carousel |
| Photos | `09 Website Database/Photos` | Hero slider images and site/sidebar logo |

## Publishing Rules

- Set `published: true` when content should appear.
- Use `published: false` or `status: draft` for private drafts.
- Use `featured: true` for homepage priority.
- Use `sortOrder` when you want manual ordering.
- Use clear `mediaAltText` for photos and covers.
- Use full public image URLs for website media. Vault file paths work for public vault assets, but private GitHub images cannot be shown directly in a visitor's browser.

## Obsidian Frontmatter

Each website record is a Markdown note with frontmatter:

```yaml
---
title: Example
slug: example
published: true
featured: true
sortOrder: 1
tags: [AI, Data]
---
```

The Markdown body becomes the blog article body for blog records.

## Photos

For the hero slider, add a row in **MaxHoang Photos**:

- `Name`: short label
- `Photo URL`: public ImageKit or image URL
- `Hero`: checked
- `Published`: checked
- `Sort Order`: display order

For the logo/sidebar image:

- Add or update one row
- Set `Logo` checked
- Set `Published` checked

## Videos

For the About reels slider, add a row in **MaxHoang Videos**:

- `Name`: short label
- `YouTube URL`: YouTube Shorts URL
- `About Reels`: checked
- `Published`: checked
- `Sort Order`: display order

## Events

For the homepage event slider, add a row in **MaxHoang Events**:

- `Name`: event title
- `Event Date`: start date
- `End Date`: optional
- `Location`: optional
- `Description`: optional
- `Cover Photo`: optional image URL used as card background
- `Event URL`: optional link
- `Published`: checked

Event cards are styled automatically:

- Current week: highlighted
- Upcoming: light upcoming style
- Passed: muted style

## Website Settings In Code

For labels, navigation links, and sidebar/footer text, edit:

`lib/site-config.ts`

For Notion database environment variable names, edit:

`lib/notion.ts`

For fallback content used when Notion is not configured, edit:

`lib/mock-data.ts`

GitHub repositories are pulled automatically from `lib/github.ts`. Add a new
public repository to GitHub and it will appear on the website after the next
refresh.
