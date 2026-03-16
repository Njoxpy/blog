# Personal Blog — Astro + MDX

A minimal, fast personal blog built with Astro, MDX, and Tailwind CSS.

## Stack

| Layer      | Tool                             |
| ---------- | -------------------------------- |
| Framework  | Astro 4                          |
| Writing    | MDX                              |
| Styling    | Tailwind CSS + Typography plugin |
| Comments   | Giscus (GitHub Discussions)      |
| Newsletter | Resend                           |
| Analytics  | Umami (self-hosted)              |
| Hosting    | Vercel                           |
| DNS/CDN    | Cloudflare                       |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your keys
cp .env.example .env

# 3. Start dev server
npm run dev
```

Visit `http://localhost:4321`

## Writing a post

Create a new `.mdx` file in `src/content/posts/`:

```mdx
---
title: "Your Post Title"
description: "A short description shown in the post list."
date: 2024-01-20
tags: ["tag1", "tag2"]
draft: false
---

Your content here. Supports **Markdown** and React components.
```

Push to GitHub → Vercel auto-deploys in ~30 seconds.

## Configuration checklist

- [ ] `astro.config.mjs` → update `site` to your domain
- [ ] `src/pages/about.astro` → update bio and project links
- [ ] `src/components/Footer.astro` → update Twitter/GitHub handles
- [ ] `src/components/Comments.astro` → add Giscus repo ID from [giscus.app](https://giscus.app)
- [ ] `src/pages/api/subscribe.ts` → update `from` email address
- [ ] `.env` → add `RESEND_API_KEY` and `RESEND_AUDIENCE_ID`
- [ ] Vercel dashboard → add env variables

## Deployment

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/Njoxpy/blog.git
git push -u origin main
```
