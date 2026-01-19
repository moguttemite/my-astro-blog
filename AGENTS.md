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
