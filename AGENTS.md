# AGENTS.md

This file provides structured guidance for AI coding agents working on the **my-astro-blog** repository.
Modifying the AGENTS.md file is strictly prohibited.

## Project Overview

- **Name**: my-astro-blog  
- **Framework**: Astro (Static Site Generator)  
- **Package Manager**: pnpm  
- **Purpose**: Personal blog site with Markdown-based articles and automated deployment.  
- The codebase is intended to be built and deployed via GitHub Actions.  
- This file is meant to complement README.md by providing precise build, development, test, and style instructions.  
AGENTS.md is a machine-focused project descriptor that AI agents should read before performing any work.:contentReference[oaicite:1]{index=1}

## Dev Environment Setup

### Required Tools

- **Node.js**: version ≥ 24  
- **pnpm**: latest stable  
- **GitHub CLI** / **GitHub Codespaces** for remote development  
- Local development server via `pnpm run dev`

### Environment Setup Commands

1. Install dependencies:

```bash
pnpm install
```

2. Start local development server:

```bash
pnpm dev
```

3. Build for production:

```bash
pnpm build
```

4. Preview production build (local):

```bash
pnpm preview
```

### Code Structure
Use this outline when referencing files:
```bash
my-astro-blog/
├── AGENTS.md
├── LICENSE
├── README.md
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── node_modules/ # Dependencies (ignored in git)
├── public/ # Public static assets
│ └── fonts/
├── src/
│ ├── assets/ # Static images & resources
│ ├── components/ # Reusable UI components
│ ├── content/ # Generated or Markdown content
│ │ └── blog/
│ ├── layouts/ # Layout templates
│ ├── pages/ # Route pages
│ ├── styles/ # Global CSS / styles
│ └── tools/
```

## Regarding the upload structure of articles
### 方式1：纯文本短文（无图片）
适用于：
- 无图片内容
- 短文 / 日志 / 记录类文章

- 目录结构
```txt
src/content/blog/2026-01-21-short-note.md
```

说明

- 单文件即为一篇文章
- 适合轻量、快速发布的内容
- 如后续需要加入图片，应升级为「方式2」

### 方式2：单篇文章（含配图/资源）
适用于：  
- 一篇完整文章  
- 需要携带图片资源  

目录结构
```txt
src/content/blog/文章-slug/
├── index.md
└── 图片资源.jpg
```

说明
- 一个文件夹表示一篇文章
- index.md 为该文章的唯一入口
- 图片资源与文章放在同一目录
- Markdown 中使用相对路径引用图片

### 方式3：系列文章 / 教程结构
适用于：
-教程类内容
-多章节、可独立阅读的文章集合

目录结构
```txt
src/content/blog/系列名称/
├── 01-章节一/
│   ├── index.md
│   └── cover.png
├── 02-章节二/
│   ├── index.md
│   └── step.png
├── 03-章节三/
│   ├── index.md
│   └── diagram.png
```

说明
- 每个章节目录都是一个独立文章
- 每个章节必须包含 index.md
- 章节之间在结构上彼此独立
- 首页可按时间轴展示各章节文章

## You must strictly comply with the following rules.

- The commands I provide often mix Chinese, Japanese, and English. When encountering such multilingual instructions, you must fully understand them in detail before executing.
-You must organize the code according to the folder structure, and if you need to add any new folders, you must ask me first.
- The website must support Chinese, Japanese, and English. 
- 网站采用astro框架，你的代码实现必须符合astro的最佳实践
- 网站使用pnpm来管理项目，你必须也使用pnpm来管理这个web项目
- 不允许随意生成 .md 文档
- When you receive an instruction, you must fully understand it first, then perform task planning by breaking the instruction into subtasks, and complete them step by step.
- 实现的页面必须符合响应式
- 实现的页面必须符合浏览器dark模式
- 这个平台是一个 Single Source of Truth
- 平台所发布的文章都会在部署 consts.ts 文件所定义的平台常量里面PUBLISH_PLATFORMS
