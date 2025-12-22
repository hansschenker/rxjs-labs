---
title: Getting Started
---

# Getting Started

This guide walks you through setting up the RxJS Labs workspace and running the docs locally.

## Prerequisites

- Node.js 18 or newer
- npm or your preferred package manager

## Install dependencies

```bash
npm install
```

## Run the docs

From the repository root:

```bash
npm run docs:dev
```

This will start the VitePress dev server and watch for changes in the `docs` directory.

## Build for deployment

To generate static assets for hosting (for example, on GitHub Pages), run:

```bash
npm run docs:build
```

The site is emitted to `docs/.vitepress/dist` and can be uploaded to your preferred hosting provider.
