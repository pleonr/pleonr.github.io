# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A VitePress-powered blog/site. Content is authored as Markdown files at the repo root (and any subdirectories added later); VitePress builds them into a static site using the config in `.vitepress/config.mjs`.

## Commands

- `npm run docs:dev` — start the local dev server with hot reload
- `npm run docs:build` — build the static site for production
- `npm run docs:preview` — preview the production build locally

There is no test suite or linter configured in this repo.

## Architecture

- `.vitepress/config.mjs` — site-wide configuration: title, description, nav bar, sidebar, and social links. Any new page added to the site must also be linked here (in `nav` and/or `sidebar`) to be reachable from the site UI, even though VitePress will still build the page's file directly.
- Root-level `*.md` files are pages, routed by filename (e.g. `markdown-examples.md` → `/markdown-examples`).
- `index.md` uses VitePress's special `layout: home` frontmatter to render the homepage hero/features section instead of normal Markdown content.

When adding a new post/page, create the `.md` file and add a corresponding entry to the `nav` or `sidebar` arrays in `.vitepress/config.mjs`.
