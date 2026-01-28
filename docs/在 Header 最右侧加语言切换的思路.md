# 在 Header 最右侧加语言切换的思路

本文包含：**当前工程进度小结**、**推荐思路（Astro i18n 实践）**、**实际设计方案（定稿）**。仅讨论思路与设计，不涉及代码修改。

---

## 工程简介（工程结构及说明）

### 工程结构

```
my-astro-blog/
├── .vscode/                 # 编辑器/调试配置
├── docs/                    # 项目文档（本文档所在目录）
├── public/                  # 静态资源，构建时原样输出
│   ├── favicon.svg
│   └── fonts/               # 站点字体（如 atkinson-bold.woff）
├── src/
│   ├── components/          # Astro/UI 组件
│   │   ├── BaseHead.astro   # 通用 <head> 与 meta
│   │   ├── Footer.astro
│   │   ├── FormattedDate.astro
│   │   ├── Header.astro     # 顶栏（Logo、nav、平台链接；语言切换拟放此处）
│   │   ├── HeaderLink.astro
│   │   └── Logo.astro
│   ├── content/             # 内容源：Markdown/MDX（legacy collections）
│   │   ├── blog/            # 中文博文（blog collection，schema 含 canonicalId）
│   │   └── blog_ja/         # 日文博文（blog_ja collection，已接入构建）
│   ├── content/config.ts    # 内容集合定义（legacy：blog、blog_ja，与 astro.config legacy.collections 配合）
│   ├── layouts/
│   │   ├── BlogPost.astro   # 单篇文章布局
│   │   └── PageLayout.astro # 全站页面布局（含 Header/Footer）
│   ├── pages/               # 路由与页面
│   │   ├── index.astro      # 首页
│   │   ├── about.astro
│   │   ├── blog/[...slug].astro  # 博客文章详情
│   │   └── rss.xml.js       # RSS 输出
│   ├── styles/
│   │   └── global.css       # 全局样式（含 Tailwind）
│   ├── utils/
│   │   └── excerpt.ts       # 摘要等工具
│   ├── consts.ts            # 全局常量（站点标题、描述、发布平台列表等）
│   └── type.ts              # 共享类型
├── tools/
│   └── publishers/          # 文章同步到外部平台的发布脚本
│       ├── qiita_publishers.ts
│       └── x_publishers.ts
├── astro.config.mjs         # Astro 与集成配置（含 Vite、MDX、Sitemap 等）
├── package.json / pnpm-lock.yaml
└── tsconfig.json
```

### 说明

- **项目名称与定位**：my-astro-blog，基于 Astro 的静态博客，Markdown 写作、通过 GitHub Actions 构建与部署，作为内容的 Single Source of Truth。
- **技术栈**：Astro（SSG）、pnpm 包管理、Tailwind 4、MDX、Sitemap；**已配置 Astro 内置 i18n**（`astro.config.mjs` 中 `locales: ['zh','ja','en']`，`defaultLocale: 'zh'`，`prefixDefaultLocale: false`）。当前使用 **legacy content collections**（`src/content/config.ts` + `astro.config.mjs` 的 `legacy.collections: true`），以规避 Windows 下非 ASCII 路径的 content 扫描问题。
- **内容规范**：博文按 AGENTS.md 约定组织——纯文短文可单文件放在 `blog/` 下；带图文章使用「文章-slug 目录 + index.md」；系列/教程可用多章节目录，每章独立 `index.md`。内容集合在 `src/content/config.ts` 中定义，当前有 `blog`（中文）、`blog_ja`（日文），二者 schema 均含 `canonicalId`，用于同文章多语言对应。
- **发布平台**：对外发布目标在 `src/consts.ts` 的 `PUBLISH_PLATFORMS` 中定义（当前含 `x`、`qiita`），对应 `tools/publishers/` 下的发布逻辑；站内 Header 右侧会展示这些平台链接。
- **界面与体验**：全站响应式、支持浏览器 dark 模式；Card 略亮于 Body，Header/Footer 与 Body 保持清晰边界（见 AGENTS.md「关于ダーク模式」）。
- **多语言目标**：AGENTS 要求站内支持中文、日文、英文。**当前进度**：i18n 路由已配置；中文沿用根路径（`/`、`/blog/xxx/`），日文已有 `src/pages/ja/`（`/ja/`、`/ja/blog/xxx/`），日文 collection `blog_ja` 已接入且与中文通过 `canonicalId` 对应；英文尚无 `/en` 页面与 `blog_en`。Header 尚未加入语言切换，PageLayout 的 `<html lang>` 仍写死。本文档后续章节在此背景下讨论「在 Header 最右侧加语言切换」的现状、思路与定稿方案。

---

## 一、当前工程进度小结

### 1. 技术栈与配置

| 项 | 现状 |
|---|---|
| 框架 | Astro（SSG） |
| 包管理 | pnpm |
| 样式 | Tailwind 4（Vite 插件） |
| 集成 | MDX、Sitemap |
| i18n | **已配置**：`astro.config.mjs` 中 `i18n: { locales: ['zh','ja','en'], defaultLocale: 'zh', routing: { prefixDefaultLocale: false } }`，未引入第三方 i18n 库 |
| content | **Legacy collections**：`src/content/config.ts` 定义 `blog`、`blog_ja`，`astro.config.mjs` 中 `legacy: { collections: true }`（见 config 内注释的 Windows 非 ASCII 路径说明） |

### 2. 内容与路由现状

| 维度 | 现状 |
|------|------|
| 内容集合 | `content/config.ts`（legacy）注册 `blog`、`blog_ja`，分别对应 `src/content/blog/`、`src/content/blog_ja/` |
| 中文内容 | `blog` 下两篇（MCP、日本虚拟货币 ETF），入口为 index.md，schema 含 `canonicalId`，URL 为 `/blog/{canonicalId}/` |
| 日文内容 | **已接入**：`blog_ja` 下两篇，与中文同主题通过相同 `canonicalId` 对应，URL 为 `/ja/blog/{canonicalId}/` |
| 英文 | 尚无 `blog_en` 或 `/en` 路由 |
| 路由 | 中文在根：`/`、`/about`、`/blog/xxx/`；日文在 `/ja/`、`/ja/blog/xxx/`；无 `/en` |

结论：中/日双语言路由与内容已打通；英文与 Header 语言切换尚未落地。

### 3. 布局与 UI

| 区域 | 说明 |
|------|------|
| PageLayout | `<html lang="zh-CN">` **仍写死**，未按 `Astro.currentLocale` 动态输出，中/日页面共用同一 layout |
| Header | 左：Logo（0xNotes → /）；中：空 `<nav>`；右：平台链接（X、Qiita），宽屏横向、窄屏「主平台 + 三点下拉」。**语言切换尚未加入** |
| Footer | 版权 + “Built with Astro”，无多语言文案（定稿为全站统一、不做 i18n） |
| 首页 | 根 `/` 用 `getCollection('blog')`，链接 `/blog/{canonicalId}/`；`/ja/` 用 `getCollection('blog_ja')`，链接 `/ja/blog/{canonicalId}/` |

### 4. 与需求的关系

- **AGENTS 要求**：支持中文、日文、英文，且符合 Astro 最佳实践。
- **当前缺口**：Header 语言切换 UI、PageLayout 按 locale 动态 `lang`、可选的首访语言判定与 `/en` 占位。
- **要点**：语言切换的前提是明确「当前语言」与「各语言对应 URL」；Header 右侧的 switcher 是接下来要落地的核心 UI。

---

## 二、在 Header 最右侧加语言切换的推荐思路

**目标**：在 Header 最右侧增加语言切换，与 Astro 官方方案、多语言路由保持一致。

### 1. 使用 Astro 内置 i18n

Astro 3.x 起在 `astro.config.mjs` 提供 `i18n` 配置与 `astro:i18n`，实现「路由级多语言」：

- 在 `astro.config.mjs` 中配置 `i18n.locales`、`i18n.defaultLocale`、可选 `i18n.routing`。
- 通过 `/[locale]/` 或「根 + 各 locale 子目录」决定 URL 结构。
- 使用 `astro:i18n` 的 `getRelativeLocaleUrl()`、`getAbsoluteLocaleUrl()`、`getRelativeLocaleUrlList()` 等生成「当前页在其他语言下的 URL」。
- 需要「无翻译时回退到某语言」时，可配置 `i18n.fallback`、`routing.fallbackType`。

**意义**：语言切换 = 跳转到「同一逻辑页」在另一 locale 下的 URL，而非依赖前端状态或 cookie；SEO、分享、书签均对应带语言前缀的 URL。Header 中的语言切换本质上是一组由 `astro:i18n` 算出的链接。因此，先确定 i18n 路由方案，再做 Header switcher，更符合当前实践。

### 2. 路由形状选择（决定「切换到哪」）

- **prefixDefaultLocale: false（推荐）**
  - 默认语言（如 zh）无前缀：`/`、`/about`、`/blog/xxx/`。
  - 其他语言带前缀：`/ja/`、`/ja/about`、`/ja/blog/xxx/`，`/en/` 同理。
  - 根目录保留默认语页面，`src/pages/ja/`、`src/pages/en/` 下再各放一套（或通过 fallback 复用）。
- **prefixDefaultLocale: true**
  - 所有语言都带前缀：`/zh/`、`/ja/`、`/en/`，根路径可重定向到默认语；更对称，但会改动现有所有 URL。

当前首页、about、blog 均在根下，为少动现有链接，建议 `prefixDefaultLocale: false` + 默认语 zh。「当前语言」可来自：URL 是否包含 `/ja`、`/en`，或直接使用 `Astro.currentLocale`（配置 i18n 后可用）。

### 3. Header 最右侧放什么、怎么放

- **位置**  
  在「平台链接区」（X、Qiita）左侧增加「语言切换」，整体为：`[Logo] … [语言切换] [X] [Qiita]`；窄屏下语言可进下拉或单独一行。

- **形态（与推荐实践一致）**  
  - 使用链接跳转，而非在下拉中改 cookie/localStorage 再刷新。  
  - 每个选项指向「当前页在目标语言下的 URL」，可用 `getRelativeLocaleUrl(locale, Astro.url.pathname)` 或 `getRelativeLocaleUrlList()` 按当前 path 生成。  
  - 展示形式可为：小标签/按钮组（如 中文 | 日本語 | EN，当前语言高亮或加 `aria-current`），或带 globe 图标的紧凑下拉（利于窄屏）。

- **无障碍与语义**  
  - 使用 `<nav aria-label="Language selection">` 等包裹，内部用 `<a href="...">`。  
  - 当前语言用 `aria-current="page"` 或仅视觉高亮，避免被误认为可重复点击刷新。

- **与现有 Header 的整合**  
  语言切换与平台链接同属右侧容器，中间用间距或竖线区分。窄屏时可把「语言」与「更多平台」收进同一下拉，或拆成两个入口，延续现有「主平台 + 三点」风格。

### 4. 数据来源（当前语言与各语言 URL）

- **当前 locale**：来自 `Astro.currentLocale`（在配置 i18n 且页面位于 `/[locale]/` 或根默认语时会有值）。
- **其他语言 URL**：在 Header 中 `import { getRelativeLocaleUrl } from 'astro:i18n'`，按当前 pathname 对每个 locale 调用 `getRelativeLocaleUrl(locale, path)`。
- 若某页在某语言下不存在，可通过 `i18n.fallback` 在构建/路由层处理，或在 UI 中对该语言隐藏/禁用选项。

这样 Header 仅依赖「当前 URL + i18n 配置」，不依赖全局状态或 cookie，符合 Astro 的静态/预渲染模型。

### 5. 与「内容分语言」的关系（blog / blog_ja / 未来 blog_en）

按 locale 分路由时，通常会：

- 让 `getCollection('blog')` 只拉当前 locale 的 collection，或
- 拆成 blog（中文）、blog_ja、blog_en，在各自 locale 的页面中调用对应 collection。

日文内容已在 blog_ja 中但未接入：需在 `content.config.ts` 中为 blog_ja 建 collection，在 `/ja` 下的首页、博客列表/详情中使用；并为「同一篇文章」建立中/日/英对应关系（如相同 slug、或 frontmatter 中的 aliases/translations），以便切换语言时跳到对应语言的那一篇。Header 的语言切换只负责跳到「当前页在目标语言下的 URL」；目标语言下是否存在该页，由路由与 content 设计决定。

### 6. 推荐步骤顺序（仍不涉及具体改代码）

1. **astro.config.mjs**
   - 增加 `i18n: { locales: ['zh','ja','en'], defaultLocale: 'zh', routing: { prefixDefaultLocale: false } }`（或你最终确定的 locale 与默认语）。
   - 若有语言缺页，可配置 fallback。

2. **页面与内容**
   - 默认语保留在根，日语放到 `src/pages/ja/`（及 blog/ja/ 等），英文同理。
   - 在 `content.config.ts` 中接入 blog_ja（及未来 blog_en），在对应 locale 的页面中拉取对应 collection。

3. **Header 最右侧**
   - 增加「语言切换」区块（链接列表或带 globe 的下拉）。
   - 用 `astro:i18n` 的 `getRelativeLocaleUrl(locale, Astro.url.pathname)` 生成链接，用 `Astro.currentLocale` 高亮当前语言。
   - 与平台链接区并排，保持响应式与 dark 模式风格。

4. **全局**
   - PageLayout 的 `<html lang="...">` 按 `Astro.currentLocale` 动态输出（如 zh→zh-CN，ja→ja，en→en）。
   - 若有共用文案（Footer、nav 等），再考虑按 locale 的词典或 frontmatter 输出。

按上述顺序即可在不动现有结构的前提下，在 Header 最右侧做出基于 URL、符合 Astro 实践的语言切换入口。

---

## 三、实际设计方案（定稿）

在保留第二节「推荐思路」的基础上，以下为最终采纳的设计要点，实施时以此为准。

### 1. 技术选型与语言范围

- 使用 **Astro 内置 i18n**（`astro.config.mjs` 的 `i18n` + `astro:i18n`），不引入第三方 i18n 库。
- 站点支持 **中文、日本語、English** 三种语言（locale：`zh`、`ja`、`en`）。

### 2. 首次进入与回退规则

- 用户首次打开时，**按设备/浏览器默认语言**进入对应语言版本。
- 若设备语言不在 中/日/英 内（如韩语、法语等），则进入 **默认语言中文**。
- 实现上需结合 Astro 的 `routing`（如 `prefixDefaultLocale: false`）及中间件或重定向，在首访时根据 `Accept-Language` 等决定跳转目标。

### 3. URL 与路由形状

- **默认语言（zh）无前缀**：保持 `/`、`/about`、`/blog/xxx/` 等根路径。
- **其他语言带前缀**：日语 `/ja/`、`/ja/about`、`/ja/blog/xxx/`；英语 `/en/`、`/en/about`、`/en/blog/xxx/`。
- 与第二节「prefixDefaultLocale: false」一致，便于在少改现有链接的前提下接入多语言。

### 4. 语言切换入口（Header 最右侧）

- **位置**：放在 **Header 最右侧**（在平台链接 X、Qiita 的左侧或与之并排，依现有布局而定）。
- **形态**：以「地球/语言」图标为触发元素；**鼠标悬停（hover）时展示下拉框**，选项中为 **中文 / 日本語 / English**，点击即跳转到当前页在目标语言下的 URL（由 `astro:i18n` 的 `getRelativeLocaleUrl` 等生成）。
- **图标参考**：使用以下 SVG 作为语言切换按钮图标（`aria-hidden="true"`、`focusable="false"`，由外层控件负责焦点与无障碍）：

```html
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="vt-locales-btn-icon">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
</svg>
```

### 5. Footer

- **版权 + “Built with Astro”** 保持现有写法，**不做多语言**，全站统一即可。

---

**实施顺序**：先按第二节「推荐步骤顺序」完成 i18n 配置与路由，再按本节定稿落实首次进入规则、Header 图标与悬停下拉、以及 Footer 不参与 i18n 等细节。

---

## 四、多语言切换（Astro i18n）实施 Checklist

**目标**：在不破坏现有 URL 的前提下，引入 zh / ja / en 三语言，并在 Header 右侧提供可靠的语言切换入口。

### 当前进度小结（最近更新：场景 1–6 验收通过）

- **已完成**：A 设计冻结、B1/B2 i18n 配置与 locale 可用性、C1 PageLayout 动态 `lang`、D1 中/日页面目录与路由、D2 日文真实内容、E Header 语言切换、**F 首次访问语言判定**（根路径注入脚本按 `navigator.language` 重定向到 `/ja/` 或 `/en/`，同源 referrer 不重定向）、**Logo 按当前语言回首页**（`Logo` 接收 `href`，Header 传 `getRelativeLocaleUrl(currentLocale, '')`）、G1 中/日 content 集合、G2 中/日页面使用对应 collection。**场景 1–6 已全部验证通过**（见下「验收验证记录」）。
- **未完成**：C2 全站无副作用验证（RSS/sitemap/dark 回归）、D1 的 `/en` 与 G2 的 `/en/*` 使用 `blog_en`、G1 的 `blog_en` 预留、H SEO/稳定性检查、以及最终验收中的「访问 `/en/` = 英文」。

### A. 设计冻结确认（必须先确认）

- [x] 默认语言确定为 `zh`
- [x] 支持语言集合固定为：`zh` / `ja` / `en`
- [x] URL 形状采用：默认语言无前缀，其它语言带前缀  
  - `/` → 中文  
  - `/ja/*` → 日文  
  - `/en/*` → 英文
- [x] 语言切换只通过 URL 跳转，不使用 cookie / localStorage
- [x] Header 不依赖 content collection

> ✅ 已通过现有实现确认，无需再改设计。

### B. Astro i18n 基础配置层

#### B1. astro.config.mjs

- [x] 启用 Astro 内置 i18n
- [x] 明确配置：
  - `locales: ['zh', 'ja', 'en']`
  - `defaultLocale: 'zh'`
  - `routing.prefixDefaultLocale: false`
- [x] 不引入第三方 i18n 库

#### B2. Locale 运行时可用性

- [x] 页面中可以可靠获取 `Astro.currentLocale`（已配置 i18n 时可用）
- [x] 默认语言页面（根路径）能正确识别为 `zh`
- [x] `/ja/*` 页面 `currentLocale === 'ja'`
- [ ] `/en/*` 页面 `currentLocale === 'en'`（尚未建 `/en` 路由）

### C. HTML / Layout 层适配

#### C1. PageLayout / 根布局

- [x] `<html lang="...">` 不再写死
- [x] `lang` 值根据 locale 动态输出：
  - `zh` → `zh-CN`
  - `ja` → `ja`
  - `en` → `en`（或 `en-US`，但必须统一）

#### C2. 全站无副作用检查

- [ ] 现有中文页面路径不发生变化
- [ ] RSS / sitemap 不因 i18n 报错
- [ ] dark mode / Tailwind 不受影响

### D. 页面与路由结构（最小可运行）

#### D1. 页面目录

- [x] 中文页面继续使用现有 `src/pages/*`
- [x] 新增 `src/pages/ja/`（含 `index.astro`、`blog/[...slug].astro`）
- [ ] 新增 `src/pages/en/`（尚未建，可选先做占位）

#### D2. 不追求完整内容

- [x] 日文 / 英文页面允许暂时是占位内容（日文已是真实 blog_ja 内容）
- [x] 不要求 blog 立即多语言完成
- [x] 只验证路由是否成立（/、/ja/、/ja/blog/xxx 已成立）

### E. Header 语言切换（核心 UI）

#### E1. 结构与职责

- [x] 语言切换放在 Header 最右侧
- [x] 与平台链接（X / Qiita）同一逻辑层级
- [x] Header 不读取文章数据、不判断是否存在翻译

#### E2. 数据来源

- [x] 当前语言来源：`Astro.currentLocale`
- [x] 目标语言 URL 使用 `astro:i18n` 工具函数生成
- [x] 切换语言 = 跳转到「当前 path 的目标 locale URL」

#### E3. 行为要求

- [x] 点击语言选项立即跳转（无刷新 hack）
- [x] 当前语言有明确高亮或 `aria-current`
- [x] 当前语言不可点击或点击无副作用

#### E4. 交互与可用性

- [x] 桌面端可 hover 展开
- [x] 移动端可 click 展开
- [x] 键盘可 focus / enter 操作
- [x] 使用 `<nav aria-label="Language selection">`

### F. 首次访问语言判定（可选但推荐）

> ⚠️ **这是最容易出 bug 的部分。**

- [x] 仅在访问根路径 `/` 时生效（由首页通过 `injectRedirectScript` 在 `<head>` 中注入脚本，静态站用客户端重定向）
- [x] **仅疑似首访时重定向**：若 `document.referrer` 与 `location.origin` 同源，视为站内导航（如从文章点 Logo 回首页、或从 /ja/ 点「中文」回 /），**不重定向**，避免覆盖用户选择；仅当 referrer 为空或外站时才按浏览器语言跳 `/ja/` 或 `/en/`
- [x] 根据浏览器语言判断是否跳转 `/ja/` 或 `/en/`（`navigator.language` / `navigator.userLanguage`，以 ja / en 开头则跳）
- [x] 不匹配 → 留在默认中文
- [x] 用户从站内主动切语言或点 Logo 回首页时不被改写（依赖上述 referrer 判断）

### G. 内容层准备（非强制，但要规划）

#### G1. content 集合

- [x] 中文：已有 `blog`（`src/content/config.ts`）
- [x] 日文：已有 `blog_ja`
- [ ] 英文：预留 `blog_en`（可等有英文内容时再加）

#### G2. 页面调用原则

- [x] `/` 使用 `blog`
- [x] `/ja/*` 使用 `blog_ja`
- [ ] `/en/*` 使用 `blog_en`（待建 en 路由后）
- [x] Header 不感知这些差异

### H. SEO / 稳定性检查

- [ ] 中文页面 canonical 不变
- [ ] 不同语言 URL 不互相覆盖
- [ ] 分享 `/ja/...` 不会跳回 `/`
- [ ] 构建过程无 i18n 警告或 fallback 报错

### I. 明确不在本轮做的事（防止 scope creep）

- [ ] 不做自动翻译
- [ ] 不做语言 cookie 记忆
- [ ] Footer 不做多语言
- [ ] 不做文章级语言智能匹配
- [ ] 不做 hreflang 深度优化（可后续）

### 最终验收标准（硬条件）

- [x] 访问 `/` = 中文
- [x] 访问 `/ja/` = 日文
- [ ] 访问 `/en/` = 英文
- [x] Header 切换语言后 URL 改变且页面正确
- [x] 刷新页面语言不反跳（当前实现仅用 URL，无首访重定向，刷新保持当前地址）
- [x] 现有中文链接全部有效

---

### 接下来从这里开始

- **当前进度**：i18n 配置、中/日路由与内容、C1 动态 `lang`、E Header 语言切换、**F 首次访问语言判定**（根路径按 `navigator.language` 客户端重定向，同源 referrer 不跳）、**Logo 按当前语言回首页**（Header 传 `homeHref={getRelativeLocaleUrl(currentLocale, '')}` 给 Logo）均已落地；**场景 1–6 验收已全部通过**。最终验收仅剩「访问 `/en/` = 英文」依赖尚未存在的 `/en` 路由。

- **下一步建议（按需排期）**  
  1. **D1 `/en` 占位**：新增 `src/pages/en/index.astro`（可先做占位页），满足「访问 `/en/` = 英文」的验收。若需英文列表，再补 `blog_en`（G1）与 `/en/*` 使用逻辑（G2）。  
  2. **C2 全站无副作用验证**：确认 RSS、sitemap、dark 模式在 i18n 与语言切换上线后无回归。  
  3. **H SEO/稳定性**：在有多语言正式内容后，做 canonical、分享与构建告警等检查。

- **暂不实施**：I 中列出的自动翻译、语言 cookie、Footer 多语言、文章级智能匹配、hreflang 深度优化，保持不做。

