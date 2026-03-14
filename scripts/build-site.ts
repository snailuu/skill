/**
 * 从 meta.ts + skills/ 目录生成静态展示页面（antfustyle 风格）
 *
 * 用法：pnpm site:build
 * 输出：dist/index.html
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { manual, vendors } from '../meta.js'
import { fetchVendorSkills } from './build-skill-registry.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

interface SkillItem {
  description: string
  icon: string
  link?: string
  name: string
}

interface SkillSection {
  items: SkillItem[]
  title: string
}

// 解析 SKILL.md frontmatter
function parseFrontmatter(content: string): { description: string, name: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match)
    return { name: '', description: '' }

  let name = ''
  let description = ''
  const lines = match[1].split('\n')
  let multilineKey = ''
  const multilineLines: string[] = []

  function flush(): string {
    const result = multilineLines.join(' ').trim()
    multilineLines.length = 0
    multilineKey = ''
    return result
  }

  for (const rawLine of lines) {
    if (multilineKey) {
      if (rawLine.startsWith('  ') || rawLine.startsWith('\t')) {
        const trimmed = rawLine.trim()
        if (trimmed)
          multilineLines.push(trimmed)
        continue
      }
      if (!rawLine.trim())
        continue
      if (multilineKey === 'description')
        description = flush()
      else
        flush()
    }

    const line = rawLine.trim()
    if (!line || line.startsWith('#'))
      continue
    const sep = line.indexOf(':')
    if (sep === -1)
      continue
    const key = line.slice(0, sep).trim()
    const rawValue = line.slice(sep + 1).trim()

    if (rawValue === '|' || rawValue === '>') {
      multilineKey = key
      continue
    }

    let value = rawValue
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\'')))
      value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, '\'')

    if (key === 'name')
      name = value
    else if (key === 'description')
      description = value
  }

  if (multilineKey === 'description')
    description = flush()

  return { name, description }
}

// 简短化 description
function shortenDescription(desc: string): string {
  const cut = desc.replace(/当用户.*$/, '').replace(/Use when.*$/i, '').replace(/Triggers? on:.*$/i, '').trim()
  return cut || desc
}

// 精确图标映射表（Iconify 格式: set:name）
const iconMap: Record<string, string> = {
  // 自定义技能
  'git-commit-gen': 'carbon:commit',
  'git-exclude': 'carbon:close-outline',
  'code-review-expert': 'carbon:search-locate',
  'pr-review': 'carbon:flow',
  'smart-plan': 'carbon:plan',
  'skill-writer': 'carbon:pen',
  'writing-changelogs': 'carbon:document',
  // antfu vendor
  'antfu': 'carbon:user-favorite',
  'vue': 'devicon:vuejs',
  'nuxt': 'devicon:nuxtjs',
  'pinia': 'logos:pinia',
  'vite': 'devicon:vitejs',
  'vitest': 'devicon:vitest',
  'vitepress': 'devicon:vitejs',
  'pnpm': 'devicon:pnpm',
  'turborepo': 'logos:turborepo-icon',
  'unocss': 'logos:unocss',
  'tsdown': 'carbon:package',
  'slidev': 'carbon:presentation-file',
  'vue-best-practices': 'devicon:vuejs',
  'vue-router-best-practices': 'carbon:direction-fork',
  'vue-testing-best-practices': 'carbon:chemistry',
  'vueuse-functions': 'logos:vueuse',
  'web-design-guidelines': 'carbon:accessibility-alt',
  // baoyu vendor
  'baoyu-xhs-images': 'carbon:image-copy',
  'baoyu-post-to-x': 'ri:twitter-x-fill',
  'baoyu-post-to-wechat': 'ri:wechat-fill',
  'baoyu-post-to-weibo': 'ri:weibo-fill',
  'baoyu-article-illustrator': 'carbon:image-search',
  'baoyu-cover-image': 'carbon:image-reference',
  'baoyu-slide-deck': 'carbon:presentation-file',
  'baoyu-comic': 'carbon:media-library',
  'baoyu-infographic': 'carbon:chart-treemap',
  'baoyu-image-gen': 'carbon:paint-brush',
  'baoyu-danger-gemini-web': 'ri:gemini-fill',
  'baoyu-url-to-markdown': 'carbon:link',
  'baoyu-danger-x-to-markdown': 'carbon:download',
  'baoyu-compress-image': 'carbon:zip',
  'baoyu-format-markdown': 'carbon:text-align-left',
  'baoyu-markdown-to-html': 'carbon:code',
  'baoyu-translate': 'carbon:translate',
  'release-skills': 'carbon:rocket',
}

// Iconify SVG URL（通过 currentColor 支持 dark mode）
function iconUrl(iconId: string): string {
  // iconId 格式: set:name → 转为 URL path: set/name.svg
  const [set, name] = iconId.includes(':') ? iconId.split(':') : ['carbon', iconId]
  return `https://api.iconify.design/${set}/${name}.svg?height=28`
}

// 根据名称获取图标
function getIcon(name: string): string {
  return iconMap[name] || 'carbon:skill-level'
}

// 本仓库 GitHub 地址
const repoUrl = 'https://github.com/snailuu/skill'

/**
 * 从 .preview/other-skills-registry.md 解析翻译后的描述
 * 表格格式: | `name` | description |
 */
function loadTranslatedDescriptions(): Map<string, string> {
  const filePath = join(root, '.preview', 'other-skills-registry.md')
  const map = new Map<string, string>()

  if (!existsSync(filePath))
    return map

  const content = readFileSync(filePath, 'utf8')
  for (const line of content.split('\n')) {
    const match = line.match(/^\| `([^`]+)` \| (.+) \|$/)
    if (match)
      map.set(match[1], match[2].trim())
  }

  return map
}

// 翻译描述缓存
const translatedDescs = loadTranslatedDescriptions()

// 收集本仓库手写技能
function collectManualSkills(): SkillItem[] {
  return manual.map((name) => {
    const skillFile = join(root, 'skills', name, 'SKILL.md')
    if (!existsSync(skillFile))
      return { name, description: '', icon: getIcon(name), link: `${repoUrl}/tree/main/skills/${name}` }

    const content = readFileSync(skillFile, 'utf8')
    const parsed = parseFrontmatter(content)
    return {
      name: parsed.name || name,
      description: shortenDescription(parsed.description),
      icon: getIcon(name),
      link: `${repoUrl}/tree/main/skills/${name}`,
    }
  })
}

// 收集 vendor 技能（通过 gh api 远程获取，优先使用 .preview/ 中的翻译描述）
function collectVendorSkills(source: string): SkillItem[] {
  return fetchVendorSkills(source).map(skill => ({
    name: skill.name,
    description: translatedDescs.get(skill.name) || shortenDescription(skill.description),
    icon: getIcon(skill.name),
    link: `${source}/tree/main/skills/${skill.name}`,
  }))
}

// 构建分区数据
function buildSections(): SkillSection[] {
  const sections: SkillSection[] = []

  const manualSkills = collectManualSkills()
  if (manualSkills.length) {
    sections.push({
      title: 'Snailuu Skills',
      items: manualSkills,
    })
  }

  for (const [name, config] of Object.entries(vendors)) {
    const skills = collectVendorSkills(config.source)
    if (skills.length) {
      // 首字母大写
      const label = name.charAt(0).toUpperCase() + name.slice(1)
      sections.push({
        title: `${label} Skills`,
        items: skills,
      })
    }
  }

  return sections
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// antfustyle 风格卡片：左图标 + 右文字，hover 微灰
function renderCard(item: SkillItem, index: number): string {
  const style = `--enter-stage: ${index};`
  const imgSrc = iconUrl(item.icon)
  const inner = `<div class="item-icon"><img src="${imgSrc}" alt="" width="28" height="28" loading="lazy"></div>
    <div class="item-text">
      <div class="item-name">${escapeHtml(item.name)}</div>
      <div class="item-desc">${escapeHtml(item.description)}</div>
    </div>`

  if (item.link) {
    return `<a class="item slide-enter" style="${style}" href="${escapeHtml(item.link)}" target="_blank" rel="noopener">${inner}</a>`
  }
  return `<div class="item slide-enter" style="${style}">${inner}</div>`
}

function renderSection(section: SkillSection): string {
  const cards = section.items.map((item, i) => renderCard(item, i)).join('\n')

  return `<section>
  <div class="section-header">
    <span class="section-watermark">${escapeHtml(section.title)}</span>
  </div>
  <div class="group-grid">${cards}</div>
</section>`
}

function buildHtml(sections: SkillSection[]): string {
  const totalSkills = sections.reduce((sum, s) => sum + s.items.length, 0)
  const sectionsHtml = sections.map(renderSection).join('\n')
  const now = new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Skills Registry | Snailuu</title>
<meta name="description" content="Claude Code 技能注册表，包含 ${totalSkills} 个技能。">
<meta name="color-scheme" content="light dark">
<style>
/* 基础重置 */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* antfustyle 配色 */
:root{
  --c-bg:#fff;
  --c-text:#555;
  --c-text-heading:#111;
  --c-hover:#88888811;
  --c-border:#8882;
  --c-dot:#e5e5e5;
}
@media(prefers-color-scheme:dark){
  :root{
    --c-bg:#050505;
    --c-text:#bbb;
    --c-text-heading:#fff;
    --c-hover:#88888822;
    --c-border:#8883;
    --c-dot:#222;
  }
  .item-icon img{filter:invert(1)}
  .item:hover .item-icon img{filter:invert(1)}
  .section-watermark{opacity:.2}
}

html{
  background:var(--c-bg);
  color:var(--c-text);
  font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
  scroll-behavior:smooth;
}

::selection{background:#8884}

/* dot 背景 */
body{
  min-height:100vh;
  background-image:radial-gradient(var(--c-dot) 1px,transparent 1px);
  background-size:24px 24px;
}

/* 容器 */
.container{
  max-width:1050px;
  margin:0 auto;
  padding:60px 24px 40px;
}

/* slide enter 动画 */
@keyframes slide-enter{
  0%{transform:translateY(10px);opacity:0}
  to{transform:translateY(0);opacity:1}
}
@media(prefers-reduced-motion:no-preference){
  .slide-enter{
    --enter-stage:0;
    animation:slide-enter 1s both 1;
    animation-delay:calc(60ms * var(--enter-stage));
  }
}

/* 头部 */
header{text-align:center;margin-bottom:48px}
header h1{
  font-size:2.5rem;
  font-weight:700;
  letter-spacing:-.02em;
  color:var(--c-text-heading);
  margin-bottom:8px;
}
header .subtitle{
  font-size:1rem;
  opacity:.6;
}
header .stats{
  margin-top:16px;
  font-size:.875rem;
  opacity:.5;
}
header .stats strong{opacity:1;font-weight:600;color:var(--c-text-heading)}
.quick-links{
  display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:20px;
}
.quick-links a{
  border:1px solid var(--c-border);
  border-radius:9999px;
  padding:6px 16px;
  font-size:.8rem;
  color:var(--c-text);
  text-decoration:none;
  transition:all .2s;
}
.quick-links a:hover{
  border-color:var(--c-text);
  color:var(--c-text-heading);
}

/* 分区标题 - 描边透明水印 */
section{position:relative;margin-bottom:0;padding-top:40px}
.section-header{position:relative;height:50px;margin-bottom:16px;margin-left:-4px}
.section-watermark{
  font-size:clamp(3.6rem,6vw,5rem);
  font-weight:700;
  color:transparent;
  -webkit-text-stroke:1.5px #aaa;
  opacity:.35;
  white-space:nowrap;
  user-select:none;
  pointer-events:none;
  line-height:1em;
}

/* 卡片网格 - antfustyle */
.group-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:0;
  padding:16px 0 24px;
  max-width:1050px;
  margin:0 auto;
}
@media(max-width:768px){
  .group-grid{grid-template-columns:1fr;max-width:350px!important}
}

/* 单项 - 左图标右文字 */
.item{
  display:flex;
  align-items:flex-start;
  padding:10px 14px 14px;
  border-radius:6px;
  background:transparent;
  text-decoration:none;
  color:inherit;
  transition:background .3s;
}
.item:hover{
  background:var(--c-hover);
}
.item-icon{
  padding-top:2px;
  padding-right:16px;
  flex-shrink:0;
  line-height:1;
  opacity:.5;
  filter:grayscale(1);
  transition:all .3s;
}
.item-icon img{display:block}
.item:hover .item-icon{
  opacity:.9;
  filter:grayscale(0);
}
.item-text{
  flex:1;
  min-width:0;
}
.item-name{
  font-size:1rem;
  font-weight:500;
  color:var(--c-text-heading);
  line-height:1.4;
}
.item-desc{
  font-size:.8rem;
  opacity:.55;
  line-height:1.5;
  margin-top:2px;
}

/* 页脚 */
footer{
  text-align:center;
  padding:24px 0 40px;
  font-size:.75rem;
  opacity:.35;
}
</style>
</head>
<body>

<div class="container">
  <header class="slide-enter" style="--enter-stage:0">
    <h1>Skills</h1>
    <div class="subtitle">Claude Code 技能注册表</div>
    <div class="quick-links">
      <a href="https://github.com/snailuu/skill" target="_blank" rel="noopener">GitHub</a>
      <a href="https://github.com/snailuu/skill#readme" target="_blank" rel="noopener">安装说明</a>
    </div>
    <div class="stats">
      <strong>${totalSkills}</strong> 个技能 · <strong>${sections.length}</strong> 个来源 · 更新于 ${now}
    </div>
  </header>

  ${sectionsHtml}
</div>

<footer>© 2026 Snailuu · Built from registry data</footer>

</body>
</html>`
}

function main(): void {
  const sections = buildSections()
  const html = buildHtml(sections)
  const outDir = join(root, 'dist')

  if (!existsSync(outDir))
    mkdirSync(outDir, { recursive: true })

  writeFileSync(join(outDir, 'index.html'), html, 'utf8')
  console.log(`站点已生成：dist/index.html（${sections.reduce((s, sec) => s + sec.items.length, 0)} 个技能）`)
}

main()
