# 外部 Skills Registry

## Overview
- 外部技能来源与资料仓库索引
- 最后更新时间：2026-03-20 10:08:31 UTC
- Vendor sources：2
- 外部技能总数：35
- Submodule sources：0

### 来源概览
- **antfu**：17 个技能
- **baoyu**：18 个技能

## Vendor Sources
### antfu
- Source：https://github.com/antfu/skills
- Official：yes
- 技能数量：17

| 技能名称 | 说明 |
|---|---|
| `antfu` | Anthony Fu 针对 JavaScript/TypeScript 项目的带有明确风格倾向的工具链与约定。适用于搭建新项目、配置 ESLint/Prettier 替代方案、管理 monorepo、发布库，或当用户提到 Anthony Fu 的偏好时使用。 |
| `nuxt` | Nuxt full-stack Vue framework with SSR, auto-imports, and file-based routing. Use when working with Nuxt apps, server routes, useFetch, middleware, or hybrid rendering. |
| `pinia` | Pinia 是 Vue 官方的状态管理库，具有类型安全且可扩展的特性。适用于在 Vue 应用中定义 store、处理 state/getters/actions，或实现各种 store 模式。 |
| `pnpm` | 具有严格依赖解析机制的 Node.js 包管理器。适用于运行 pnpm 专属命令、配置工作区，或通过 catalogs、patches、overrides 管理依赖。 |
| `slidev` | 使用 Slidev 结合 Markdown、Vue 组件、代码高亮、动画和交互功能，为开发者创建并展示基于 Web 的幻灯片。适用于构建技术演示、会议演讲、代码讲解、教学材料或开发者演示文稿。 |
| `tsdown` | 使用 Rolldown 以极快的速度打包 TypeScript 和 JavaScript 库。适用于构建库、生成类型声明、打包为多种格式，或从 tsup 迁移。 |
| `turborepo` | Turborepo 单体仓库构建系统指南。适用于：turbo.json、任务流水线、dependsOn、缓存、远程缓存、“turbo” CLI、--filter、--affected、CI 优化、环境变量、内部包、单体仓库结构/最佳实践与边界；当用户配置任务/工作流/流水线、创建包、搭建单体仓库、在应用间共享代码、运行变更/受影响的包、调试缓存，或拥有 apps/packages 目录时使用。 |
| `unocss` | UnoCSS instant atomic CSS engine, superset of Tailwind CSS. Use when configuring UnoCSS, writing utility rules, shortcuts, or working with presets like Wind, Icons, Attributify. |
| `vite` | Vite 构建工具配置、插件 API、SSR，以及迁移到 Vite 8 Rolldown。适用于处理 Vite 项目、vite.config.ts、Vite 插件，或使用 Vite 构建库和 SSR 应用时。 |
| `vitepress` | 由 Vite 和 Vue 驱动的 VitePress 静态站点生成器。适用于构建文档网站、配置主题或使用 Vue 组件编写 Markdown。 |
| `vitest` | Vitest 是一个由 Vite 驱动的快速单元测试框架，并提供与 Jest 兼容的 API。可在编写测试、创建模拟、配置覆盖率，或处理测试过滤与夹具时使用。 |
| `vue` | Vue 3 组合式 API、script setup 宏、响应式系统和内置组件。适用于编写 Vue 单文件组件（SFC）、使用 defineProps/defineEmits/defineModel、侦听器，或使用 Transition/Teleport/Suspense/KeepAlive 时。 |
| `vue-best-practices` | 处理 Vue.js 任务时必须使用此方式。强烈建议以 Composition API、`<script setup>` 和 TypeScript 作为标准方案，涵盖 Vue 3、SSR、Volar 和 vue-tsc；凡是涉及 Vue、.vue 文件、Vue Router、Pinia 或基于 Vite 的 Vue 开发都应加载，并且除非项目明确要求 Options API，否则始终使用 Composition API。 |
| `vue-router-best-practices` | Vue Router 4 patterns, navigation guards, route params, and route-component lifecycle interactions. |
| `vue-testing-best-practices` | 用于 Vue.js 测试，涵盖 Vitest、Vue Test Utils、组件测试、模拟、测试模式以及用于端到端测试的 Playwright。 |
| `vueuse-functions` | Apply VueUse composables where appropriate to build concise, maintainable Vue.js / Nuxt features. |
| `web-design-guidelines` | 审查 UI 代码是否符合 Web 界面规范。适用于用户要求“审查我的 UI”“检查可访问性”“审计设计”“评审 UX”或“根据最佳实践检查我的网站”时。 |

### baoyu
- Source：https://github.com/JimLiu/baoyu-skills
- Official：no
- 技能数量：18

| 技能名称 | 说明 |
|---|---|
| `baoyu-article-illustrator` | Analyzes article structure, identifies positions requiring visual aids, generates illustrations with Type × Style two-dimension approach. Use when user asks to "illustrate article", "add images", "generate images for article", or "为文章配图". |
| `baoyu-comic` | 支持多种艺术风格和语气的知识漫画创作工具。可创建原创教育漫画，提供详细分镜布局和连续图像生成；当用户要求制作“知识漫画”“教育漫画”“传记漫画”“教程漫画”或“Logicomix 风格漫画”时使用。 |
| `baoyu-compress-image` | 将图片压缩为 WebP（默认）或 PNG，并自动选择合适的工具。适用于用户要求“压缩图片”“优化图片”“转换为 WebP”或减小图片文件大小的场景。 |
| `baoyu-cover-image` | Generates article cover images with 5 dimensions (type, palette, rendering, text, mood) combining 10 color palettes and 7 rendering styles. Supports cinematic (2.35:1), widescreen (16:9), and square (1:1) aspects. Use when user asks to "generate cover image", "create article cover", or "make cover". |
| `baoyu-danger-gemini-web` | Generates images and text via reverse-engineered Gemini Web API. Supports text generation, image generation from prompts, reference images for vision input, and multi-turn conversations. Use when other skills need image generation backend, or when user requests "generate image with Gemini", "Gemini text generation", or needs vision-capable AI generation. |
| `baoyu-danger-x-to-markdown` | Converts X (Twitter) tweets and articles to markdown with YAML front matter. Uses reverse-engineered API requiring user consent. Use when user mentions "X to markdown", "tweet to markdown", "save tweet", or provides x.com/twitter.com URLs for conversion. |
| `baoyu-format-markdown` | Formats plain text or markdown files with frontmatter, titles, summaries, headings, bold, lists, and code blocks. Use when user asks to "format markdown", "beautify article", "add formatting", or improve article layout. Outputs to {filename}-formatted.md. |
| `baoyu-image-gen` | 使用 OpenAI、Google、OpenRouter、DashScope、即梦、Seedream 和 Replicate API 进行 AI 图像生成。支持文生图、参考图、宽高比，以及从已保存提示词文件批量生成；默认顺序生成，若用户已有多个提示词或需要稳定的多图吞吐量，则使用批量并行生成，适用于用户请求生成、创建或绘制图像时。 |
| `baoyu-infographic` | 生成具有 21 种版式和 20 种视觉风格的专业信息图。可分析内容、推荐版式与风格组合，并生成可直接发布的信息图；当用户要求创建“infographic”“信息图”“visual summary”“可视化”或“高密度信息大图”时使用。 |
| `baoyu-markdown-to-html` | Converts Markdown to styled HTML with WeChat-compatible themes. Supports code highlighting, math, PlantUML, footnotes, alerts, infographics, and optional bottom citations for external links. Use when user asks for "markdown to html", "convert md to html", "md转html", "微信外链转底部引用", or needs styled HTML output from markdown. |
| `baoyu-post-to-wechat` | Posts content to WeChat Official Account (微信公众号) via API or Chrome CDP. Supports article posting (文章) with HTML, markdown, or plain text input, and image-text posting (贴图, formerly 图文) with multiple images. Markdown article workflows default to converting ordinary external links into bottom citations for WeChat-friendly output. Use when user mentions "发布公众号", "post to wechat", "微信公众号", or "贴图/图文/文章". |
| `baoyu-post-to-weibo` | Posts content to Weibo (微博). Supports regular posts with text, images, and videos, and headline articles (头条文章) with Markdown input via Chrome CDP. Use when user asks to "post to Weibo", "发微博", "发布微博", "publish to Weibo", "share on Weibo", "写微博", or "微博头条文章". |
| `baoyu-post-to-x` | Posts content and articles to X (Twitter). Supports regular posts with images/videos and X Articles (long-form Markdown). Uses real Chrome with CDP to bypass anti-automation. Use when user asks to "post to X", "tweet", "publish to Twitter", or "share on X". |
| `baoyu-slide-deck` | 根据内容生成专业幻灯片图像。它会先创建带有样式说明的大纲，再逐页生成幻灯片图像；当用户要求“创建幻灯片”“制作演示文稿”“生成幻灯片集”“slide deck”或“PPT”时使用。 |
| `baoyu-translate` | 可在语言之间翻译文章和文档，提供三种模式：快速（直接翻译）、普通（先分析再翻译）和精修（分析、翻译、审校、润色）。支持通过 EXTEND.md 自定义术语表并保持术语一致性，适用于用户提出“translate”“翻译”“精翻”“translate article”“翻译成中文/英文”“改成中文/英文”“convert to Chinese”“localize”“本地化”等文档翻译需求，以及“refined translation”“精细翻译”“proofread translation”“快速翻译”“快翻”“这篇文章翻译一下”或在提供 URL/文件并表达翻译意图时触发。 |
| `baoyu-url-to-markdown` | Fetch any URL and convert to markdown using Chrome CDP. Saves the rendered HTML snapshot alongside the markdown, uses an upgraded Defuddle pipeline with better web-component handling and YouTube transcript extraction, and automatically falls back to the pre-Defuddle HTML-to-Markdown pipeline when needed. If local browser capture fails entirely, it can fall back to the hosted defuddle.md API. Supports two modes - auto-capture on page load, or wait for user signal (for pages requiring login). Use when user wants to save a webpage as markdown. |
| `baoyu-xhs-images` | Generates Xiaohongshu (Little Red Book) infographic series with 11 visual styles and 8 layouts. Breaks content into 1-10 cartoon-style images optimized for XHS engagement. Use when user mentions "小红书图片", "XHS images", "RedNote infographics", "小红书种草", or wants social media infographics for Chinese platforms. |
| `release-skills` | 通用发布工作流。可自动检测版本文件和更新日志，支持 Node.js、Python、Rust、Claude 插件及通用项目；当用户提到“release”“发布”“new version”“bump version”“push”“推送”时使用。 |

## Submodule Sources / Source Repos
- 暂无 submodule source。
