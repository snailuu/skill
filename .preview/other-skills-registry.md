# 外部 Skills Registry

## Overview
- 外部技能来源与资料仓库索引
- 最后更新时间：2026-03-23 06:05:08 UTC
- Vendor sources：2
- 外部技能总数：36
- Submodule sources：0

### 来源概览
- **antfu**：17 个技能
- **baoyu**：19 个技能

## Vendor Sources
### antfu
- Source：https://github.com/antfu/skills
- Official：yes
- 技能数量：17

| 技能名称 | 说明 |
|---|---|
| `antfu` | Anthony Fu's opinionated tooling and conventions for JavaScript/TypeScript projects. Use when setting up new projects, configuring ESLint/Prettier alternatives, monorepos, library publishing, or when the user mentions Anthony Fu's preferences. |
| `nuxt` | Nuxt 是一个支持 SSR、自动导入和基于文件路由的全栈 Vue 框架。处理 Nuxt 应用、服务端路由、useFetch、中间件或混合渲染时可使用它。 |
| `pinia` | Pinia official Vue state management library, type-safe and extensible. Use when defining stores, working with state/getters/actions, or implementing store patterns in Vue apps. |
| `pnpm` | Node.js 的包管理器，具有严格的依赖解析机制。用于运行 pnpm 特定命令、配置工作区，或通过 catalogs、patches 或 overrides 管理依赖。 |
| `slidev` | 使用 Slidev，结合 Markdown、Vue 组件、代码高亮、动画和交互功能，为开发者创建并展示基于 Web 的幻灯片。适用于制作技术演示、会议演讲、代码讲解、教学材料或面向开发者的演示文稿。 |
| `tsdown` | 使用 Rolldown 以极快速度打包 TypeScript 和 JavaScript 库。适用于构建库、生成类型声明、打包多种格式，或从 tsup 迁移。 |
| `turborepo` | Turborepo monorepo build system guidance. Triggers on: turbo.json, task pipelines, dependsOn, caching, remote cache, the "turbo" CLI, --filter, --affected, CI optimization, environment variables, internal packages, monorepo structure/best practices, and boundaries. Use when user: configures tasks/workflows/pipelines, creates packages, sets up monorepo, shares code between apps, runs changed/affected packages, debugs cache, or has apps/packages directories. |
| `unocss` | UnoCSS 是一个即时原子化 CSS 引擎，也是 Tailwind CSS 的超集。可在配置 UnoCSS、编写工具类规则、快捷方式，或使用 Wind、Icons、Attributify 等预设时使用。 |
| `vite` | Vite 构建工具配置、插件 API、SSR，以及迁移到 Vite 8 Rolldown。适用于处理 Vite 项目、vite.config.ts、Vite 插件，或使用 Vite 构建库和 SSR 应用时。 |
| `vitepress` | 由 Vite 和 Vue 驱动的 VitePress 静态站点生成器。适用于构建文档网站、配置主题，或在 Markdown 中编写 Vue 组件。 |
| `vitest` | Vitest 是一个由 Vite 驱动的快速单元测试框架，并提供与 Jest 兼容的 API。适用于编写测试、创建模拟、配置覆盖率，以及使用测试过滤和夹具时。 |
| `vue` | Vue 3 组合式 API、script setup 宏、响应式系统以及内置组件。编写 Vue 单文件组件（SFC）、使用 defineProps/defineEmits/defineModel、侦听器，或使用 Transition/Teleport/Suspense/KeepAlive 时适用。 |
| `vue-best-practices` | 必须用于 Vue.js 相关任务。强烈建议将 Composition API、`<script setup>` 和 TypeScript 作为标准方案，涵盖 Vue 3、SSR、Volar、vue-tsc；凡是涉及 Vue、.vue 文件、Vue Router、Pinia 或基于 Vite 的 Vue 开发都应启用，除非项目明确要求 Options API，否则始终使用 Composition API。 |
| `vue-router-best-practices` | Vue Router 4 的模式、导航守卫、路由参数，以及路由与组件生命周期之间的交互。 |
| `vue-testing-best-practices` | Use for Vue.js testing. Covers Vitest, Vue Test Utils, component testing, mocking, testing patterns, and Playwright for E2E testing. |
| `vueuse-functions` | 在合适的场景中使用 VueUse 组合式函数来构建简洁、易维护的 Vue.js / Nuxt 功能。 |
| `web-design-guidelines` | Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices". |

### baoyu
- Source：https://github.com/JimLiu/baoyu-skills
- Official：no
- 技能数量：19

| 技能名称 | 说明 |
|---|---|
| `baoyu-article-illustrator` | 分析文章结构，识别需要视觉辅助的位置，并采用“类型 × 风格”的二维方法生成插图。适用于用户要求“为文章配图”“添加图片”或“为文章生成图片”等场景。 |
| `baoyu-comic` | Knowledge comic creator supporting multiple art styles and tones. Creates original educational comics with detailed panel layouts and sequential image generation. Use when user asks to create "知识漫画", "教育漫画", "biography comic", "tutorial comic", or "Logicomix-style comic". |
| `baoyu-compress-image` | Compresses images to WebP (default) or PNG with automatic tool selection. Use when user asks to "compress image", "optimize image", "convert to webp", or reduce image file size. |
| `baoyu-cover-image` | Generates article cover images with 5 dimensions (type, palette, rendering, text, mood) combining 10 color palettes and 7 rendering styles. Supports cinematic (2.35:1), widescreen (16:9), and square (1:1) aspects. Use when user asks to "generate cover image", "create article cover", or "make cover". |
| `baoyu-danger-gemini-web` | 通过逆向工程的 Gemini Web API 生成图像和文本。支持文本生成、根据提示词生成图像、使用参考图像进行视觉输入以及多轮对话；当其他功能需要图像生成后端，或用户请求“用 Gemini 生成图像”“Gemini 文本生成”或需要具备视觉能力的 AI 生成时可使用。 |
| `baoyu-danger-x-to-markdown` | Converts X (Twitter) tweets and articles to markdown with YAML front matter. Uses reverse-engineered API requiring user consent. Use when user mentions "X to markdown", "tweet to markdown", "save tweet", or provides x.com/twitter.com URLs for conversion. |
| `baoyu-format-markdown` | 将纯文本或 Markdown 文件整理为带有 frontmatter、标题、摘要、小节标题、加粗、列表和代码块的格式。适用于用户要求“格式化 Markdown”“美化文章”“添加排版”或优化文章布局时，输出为 {filename}-formatted.md。 |
| `baoyu-image-gen` | 使用 OpenAI、Google、OpenRouter、DashScope、即梦、Seedream 和 Replicate 的 API 进行 AI 图像生成。支持文生图、参考图、宽高比以及从已保存的提示词文件批量生成；默认顺序生成，当用户已有多个提示词或需要稳定的多图吞吐时使用并行批量生成，适用于用户要求生成、创建或绘制图像的场景。 |
| `baoyu-infographic` | Generates professional infographics with 21 layout types and 20 visual styles. Analyzes content, recommends layout×style combinations, and generates publication-ready infographics. Use when user asks to create "infographic", "信息图", "visual summary", "可视化", or "高密度信息大图". |
| `baoyu-markdown-to-html` | Converts Markdown to styled HTML with WeChat-compatible themes. Supports code highlighting, math, PlantUML, footnotes, alerts, infographics, and optional bottom citations for external links. Use when user asks for "markdown to html", "convert md to html", "md 转 html", "微信外链转底部引用", or needs styled HTML output from markdown. |
| `baoyu-post-to-wechat` | Posts content to WeChat Official Account (微信公众号) via API or Chrome CDP. Supports article posting (文章) with HTML, markdown, or plain text input, and image-text posting (贴图, formerly 图文) with multiple images. Markdown article workflows default to converting ordinary external links into bottom citations for WeChat-friendly output. Use when user mentions "发布公众号", "post to wechat", "微信公众号", or "贴图/图文/文章". |
| `baoyu-post-to-weibo` | 将内容发布到微博。支持发布包含文本、图片和视频的普通微博，以及通过 Chrome CDP 以 Markdown 输入发布微博头条文章；当用户提出“post to Weibo”“发微博”“发布微博”“publish to Weibo”“share on Weibo”“写微博”或“微博头条文章”等需求时使用。 |
| `baoyu-post-to-x` | Posts content and articles to X (Twitter). Supports regular posts with images/videos and X Articles (long-form Markdown). Uses real Chrome with CDP to bypass anti-automation. Use when user asks to "post to X", "tweet", "publish to Twitter", or "share on X". |
| `baoyu-slide-deck` | 根据内容生成专业的幻灯片演示图片。它会先创建带有样式说明的大纲，再生成单独的幻灯片图片；当用户要求“创建幻灯片”“制作演示文稿”“生成幻灯片集”“slide deck”或“PPT”时可使用。 |
| `baoyu-translate` | Translates articles and documents between languages with three modes - quick (direct), normal (analyze then translate), and refined (analyze, translate, review, polish). Supports custom glossaries and terminology consistency via EXTEND.md. Use when user asks to "translate", "翻译", "精翻", "translate article", "translate to Chinese/English", "改成中文", "改成英文", "convert to Chinese", "localize", "本地化", or needs any document translation. Also triggers for "refined translation", "精细翻译", "proofread translation", "快速翻译", "快翻", "这篇文章翻译一下", or when a URL or file is provided with translation intent. |
| `baoyu-url-to-markdown` | 使用 Chrome CDP 抓取任意 URL 并转换为 Markdown，同时保存渲染后的 HTML 快照；采用升级版 Defuddle 流水线，改进了 Web 组件处理和 YouTube 字幕提取，并在需要时自动回退到 Defuddle 之前的 HTML 转 Markdown 流水线。若本地浏览器捕获完全失败，还可回退到托管的 defuddle.md API；支持页面加载时自动捕获或等待用户信号（适用于需要登录的页面）两种模式，适合在用户想将网页保存为 Markdown 时使用。 |
| `baoyu-xhs-images` | 生成适用于小红书（Little Red Book）的信息图系列，提供 11 种视觉风格和 8 种版式。可将内容拆分为 1-10 张适合小红书互动传播的卡通风格图片，适用于用户提到“小红书图片”“XHS images”“RedNote infographics”“小红书种草”或需要面向中国平台的社交媒体信息图时。 |
| `baoyu-youtube-transcript` | Downloads YouTube video transcripts/subtitles and cover images by URL or video ID. Supports multiple languages, translation, chapters, and speaker identification. Caches raw data for fast re-formatting. Use when user asks to "get YouTube transcript", "download subtitles", "get captions", "YouTube字幕", "YouTube封面", "视频封面", "video thumbnail", "video cover image", or provides a YouTube URL and wants the transcript/subtitle text or cover image extracted. |
| `release-skills` | 通用发布工作流。可自动检测版本文件和更新日志，支持 Node.js、Python、Rust、Claude 插件及通用项目。 |

## Submodule Sources / Source Repos
- 暂无 submodule source。
