import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { manual, submodules, vendors } from '../meta.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

export interface ParsedSkillFrontmatter {
  description: string
  name: string
}

export interface ManualSkillSummary {
  category: SkillCategory
  description: string
  hasReferences: boolean
  name: string
  path: string
  tags: string[]
  title: string
}

export interface VendorSkillInfo {
  description: string
  name: string
}

export interface VendorSummary {
  fetchedSkills: VendorSkillInfo[]
  mappedSkillNames: string[]
  name: string
  official: boolean
  source: string
}

export interface SubmoduleSummary {
  name: string
  path: string
  source: string
}

export interface RegistryChecks {
  manualMissingDirs: string[]
  readmeMissingInstallExamples: string[]
  readmeMissingManualSkills: string[]
  skillDirsMissingFromManual: string[]
}

export interface RecentChanges {
  newManualSkills: string[]
  touchedMeta: boolean
  touchedReadme: boolean
  touchedSubmodules: boolean
  touchedVendors: boolean
  updatedManualSkills: string[]
}

export interface RegistryData {
  checks: RegistryChecks
  generatedAt: string
  manualSkills: ManualSkillSummary[]
  overview: {
    manualCount: number
    submoduleCount: number
    vendorCount: number
  }
  recentChanges: RecentChanges
  submodules: SubmoduleSummary[]
  vendors: VendorSummary[]
}

export interface DiffEntry {
  path: string
  status: string
}

export type SkillCategory
  = 'git'
    | 'planning'
    | 'release'
    | 'research'
    | 'review'
    | 'utility'
    | 'workflow'
    | 'writing'

interface CliOptions {
  base?: string
  head?: string
  outputMy?: string
  outputOther?: string
  summarize?: boolean
}

interface AIConfig {
  apiKey: string
  baseUrl: string
  model: string
}

function getAIConfig(): AIConfig | null {
  const apiKey = process.env.AI_API_KEY
  const baseUrl = process.env.AI_BASE_URL
  const model = process.env.AI_MODEL

  if (!apiKey || !baseUrl || !model)
    return null

  return { apiKey, baseUrl, model }
}

/**
 * 从 GitHub 仓库 URL 中提取 owner/repo
 */
function parseGitHubRepo(source: string): string | null {
  const match = source.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/)
  return match?.[1] || null
}

/**
 * 通过 gh CLI 批量抓取 vendor 仓库中的 SKILL.md frontmatter
 */
export function fetchVendorSkills(source: string): VendorSkillInfo[] {
  const repo = parseGitHubRepo(source)
  if (!repo)
    return []

  try {
    // 列出所有 SKILL.md 路径
    const treeOutput = execSync(
      `gh api 'repos/${repo}/git/trees/main?recursive=1' --jq '.tree[] | select(.path | test("skills/.*/SKILL\\\\.md$")) | .path'`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim()

    if (!treeOutput)
      return []

    const skillPaths = treeOutput.split('\n').filter(Boolean)

    // 批量读取每个 SKILL.md 的 frontmatter
    return skillPaths.map((path) => {
      try {
        const contentB64 = execSync(
          `gh api 'repos/${repo}/contents/${path}' --jq '.content'`,
          { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
        ).trim()

        const content = Buffer.from(contentB64, 'base64').toString('utf8')
        return parseSkillFrontmatter(content)
      }
      catch {
        return null
      }
    }).filter((item): item is VendorSkillInfo => item !== null)
  }
  catch {
    return []
  }
}

/**
 * 翻译单条技能描述为中文
 */
async function translateOne(
  description: string,
  config: AIConfig,
): Promise<string | null> {
  const endpoint = config.baseUrl.replace(/\/+$/, '') + '/chat/completions'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: '将以下英文技能描述翻译为简洁专业的中文，1-2 句话。保持技术术语准确。只输出翻译结果，不要其他内容。',
          },
          { role: 'user', content: description },
        ],
        max_tokens: 256,
        temperature: 0.2,
      }),
    })

    if (!response.ok)
      return null

    const data = await response.json() as {
      choices?: { message?: { content?: string } }[]
    }
    return data.choices?.[0]?.message?.content?.trim() || null
  }
  catch {
    return null
  }
}

/**
 * 并发翻译所有 vendor 技能描述为中文
 */
export async function translateVendorDescriptions(
  vendors: VendorSummary[],
  config: AIConfig,
): Promise<Map<string, string>> {
  const tasks: { key: string, description: string }[] = []

  for (const vendor of vendors) {
    for (const skill of vendor.fetchedSkills)
      tasks.push({ key: `${vendor.name}/${skill.name}`, description: skill.description })
  }

  if (!tasks.length)
    return new Map()

  const results = await Promise.allSettled(
    tasks.map(t => translateOne(t.description, config)),
  )

  const merged = new Map<string, string>()
  for (let i = 0; i < tasks.length; i++) {
    const result = results[i]
    if (result.status === 'fulfilled' && result.value)
      merged.set(tasks[i].key, result.value)
  }
  return merged
}

export async function generateAISummary(
  markdown: string,
  type: 'my' | 'other',
  config: AIConfig,
): Promise<string | null> {
  const systemPrompt = type === 'my'
    ? '你是一个技能仓库的文档助手。请根据以下自定义技能 registry 内容，生成一段简洁的概览摘要（3-5 句话），总结技能数量、主要分类方向和核心能力覆盖。使用中文，语气专业简洁。不要使用 markdown 标题，直接输出段落文字。'
    : '你是一个技能仓库的文档助手。请根据以下外部技能来源 registry 内容，生成一段简洁的概览摘要（2-3 句话），总结来源数量、类型和当前接入状态。使用中文，语气专业简洁。不要使用 markdown 标题，直接输出段落文字。'

  // 统一拼接 OpenAI 兼容的 chat completions 端点
  const endpoint = config.baseUrl.replace(/\/+$/, '') + '/chat/completions'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: markdown },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    })

    if (!response.ok)
      return null

    const data = await response.json() as {
      choices?: { message?: { content?: string } }[]
    }
    return data.choices?.[0]?.message?.content?.trim() || null
  }
  catch {
    return null
  }
}

function readFile(path: string): string {
  return readFileSync(path, 'utf8')
}

function formatTimestamp(iso: string): string {
  return iso.replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC')
}

function normalizeSkillText(input: { description: string, name: string, title: string }): string {
  return `${input.name} ${input.title} ${input.description}`.toLowerCase()
}

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword))
}

const categoryOrder: SkillCategory[] = [
  'git',
  'review',
  'planning',
  'writing',
  'workflow',
  'release',
  'research',
  'utility',
]

const categoryLabels: Record<SkillCategory, string> = {
  git: 'Git',
  review: 'Review',
  planning: 'Planning',
  writing: 'Writing',
  workflow: 'Workflow',
  release: 'Release',
  research: 'Research',
  utility: 'Utility',
}

export function classifySkill(input: { description: string, name: string, title: string }): SkillCategory {
  const text = normalizeSkillText(input)

  if (includesAny(text, ['changelog', 'release', '发版']))
    return 'release'
  if (includesAny(text, ['workflow', 'agent', 'dispatch', 'handoff', '编排']))
    return 'workflow'
  if (includesAny(text, ['review', '审查', 'pr', 'mr', 'merge request']))
    return 'review'
  if (includesAny(text, ['git', 'commit', 'exclude', 'branch']))
    return 'git'
  if (includesAny(text, ['plan', '规划', '计划', 'roadmap']))
    return 'planning'
  if (includesAny(text, ['writer', '写作', 'skill.md', '文案']))
    return 'writing'
  if (includesAny(text, ['research', '搜索', '调研']))
    return 'research'

  return 'utility'
}

export function buildSkillTags(input: { description: string, name: string, title: string }): string[] {
  const text = normalizeSkillText(input)
  const tags = new Set<string>()

  if (includesAny(text, ['git', 'commit', 'exclude', 'branch']))
    tags.add('git')
  if (includesAny(text, ['github', 'gh']))
    tags.add('github')
  if (includesAny(text, ['gitlab', 'glab']))
    tags.add('gitlab')
  if (includesAny(text, ['pr', 'pull request']))
    tags.add('pr')
  if (includesAny(text, ['review', '审查', 'mr', 'merge request']))
    tags.add('review')
  if (includesAny(text, ['plan', '规划', '计划']))
    tags.add('planning')
  if (includesAny(text, ['workflow', 'agent', 'dispatch', 'handoff', '编排']))
    tags.add('workflow')
  if (includesAny(text, ['writer', '写作', '文案']))
    tags.add('writing')
  if (includesAny(text, ['changelog']))
    tags.add('changelog')
  if (includesAny(text, ['release', '发版']))
    tags.add('release')
  if (includesAny(text, ['research', '搜索', '调研']))
    tags.add('research')

  return [...tags].sort()
}

function extractTitle(content: string): string {
  const titleLine = content
    .split('\n')
    .find(line => line.startsWith('# '))

  return titleLine?.slice(2).trim() || '未命名技能'
}

function stripWrappingQuotes(value: string): string {
  let normalized = value
  if (
    (normalized.startsWith('"') && normalized.endsWith('"'))
    || (normalized.startsWith('\'') && normalized.endsWith('\''))
  ) {
    normalized = normalized.slice(1, -1)
  }

  return normalized
    .replace(/\\"/g, '"')
    .replace(/\\'/g, '\'')
}

export function parseSkillFrontmatter(content: string): ParsedSkillFrontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match)
    throw new Error('SKILL.md 缺少 frontmatter')

  let name = ''
  let description = ''

  const lines = match[1].split('\n')
  let multilineKey = ''
  const multilineLines: string[] = []

  function flushMultiline(): void {
    if (multilineKey === 'description')
      description = multilineLines.join(' ').trim()
    multilineKey = ''
    multilineLines.length = 0
  }

  for (const rawLine of lines) {
    // 正在收集多行值
    if (multilineKey) {
      // 缩进行属于当前多行值
      if (rawLine.startsWith('  ') || rawLine.startsWith('\t')) {
        const trimmed = rawLine.trim()
        if (trimmed)
          multilineLines.push(trimmed)
        continue
      }
      // 空行在多行块中跳过
      if (!rawLine.trim())
        continue
      // 非缩进行 → 多行结束
      flushMultiline()
    }

    const line = rawLine.trim()
    if (!line || line.startsWith('#'))
      continue

    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1)
      continue

    const key = line.slice(0, separatorIndex).trim()
    const rawValue = line.slice(separatorIndex + 1).trim()

    // YAML 多行标记（| 或 >）
    if (rawValue === '|' || rawValue === '>') {
      multilineKey = key
      continue
    }

    const value = stripWrappingQuotes(rawValue)

    if (key === 'name')
      name = value
    else if (key === 'description')
      description = value
  }

  // 文件末尾可能还在多行收集中
  if (multilineKey)
    flushMultiline()

  if (!name || !description)
    throw new Error('SKILL.md frontmatter 必须包含 name 和 description')

  return { name, description }
}

function getManualSkillSummary(name: string): ManualSkillSummary {
  const skillPath = join(root, 'skills', name)
  const skillFile = join(skillPath, 'SKILL.md')
  const content = readFile(skillFile)
  const { description } = parseSkillFrontmatter(content)
  const title = extractTitle(content)
  const input = { name, title, description }

  return {
    category: classifySkill(input),
    name,
    title,
    description,
    path: `skills/${name}`,
    hasReferences: existsSync(join(skillPath, 'references')),
    tags: buildSkillTags(input),
  }
}

function getSkillDirectoryNames(): string[] {
  const skillsDir = join(root, 'skills')
  if (!existsSync(skillsDir))
    return []

  return readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()
}

export function parseReadmeManualSkills(content: string): string[] {
  const marker = '当前已包含手写技能：'
  const start = content.indexOf(marker)
  if (start === -1)
    return []

  const afterMarker = content.slice(start + marker.length)
  const lines = afterMarker.split('\n')
  const result: string[] = []
  let started = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line && !started)
      continue

    if (!line)
      break

    const match = line.match(/^- `([^`]+)`$/)
    if (match) {
      started = true
      result.push(match[1])
      continue
    }

    if (started)
      break
  }

  return result
}

function parseReadmeInstallSkills(content: string): string[] {
  return Array.from(
    content.matchAll(/pnpx skills add snailuu\/skill --skill ([^\s`]+)/g),
    match => match[1],
  )
}

function buildChecks(): RegistryChecks {
  const skillDirs = getSkillDirectoryNames()
  const readmeContent = readFile(join(root, 'README.md'))
  const readmeManualSkills = new Set(parseReadmeManualSkills(readmeContent))
  const readmeInstallSkills = new Set(parseReadmeInstallSkills(readmeContent))

  return {
    manualMissingDirs: manual.filter(name => !existsSync(join(root, 'skills', name, 'SKILL.md'))),
    skillDirsMissingFromManual: skillDirs.filter(name => !manual.includes(name as typeof manual[number])),
    readmeMissingManualSkills: manual.filter(name => !readmeManualSkills.has(name)),
    readmeMissingInstallExamples: manual.filter(name => !readmeInstallSkills.has(name)),
  }
}

function parseNameStatusOutput(output: string): DiffEntry[] {
  return output
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [status, ...paths] = line.split('\t')
      return {
        status,
        path: paths[paths.length - 1] ?? '',
      }
    })
    .filter(entry => entry.path)
}

function shouldSkipBase(base?: string): boolean {
  return !base || /^0+$/.test(base)
}

function getGitDiffEntries(base?: string, head?: string): DiffEntry[] {
  if (shouldSkipBase(base) || !head)
    return []

  const output = execSync(`git diff --name-status ${base} ${head}`, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim()

  if (!output)
    return []

  return parseNameStatusOutput(output)
}

export function detectRecentChanges(entries: DiffEntry[]): RecentChanges {
  const newManualSkills = new Set<string>()
  const updatedManualSkills = new Set<string>()

  let touchedMeta = false
  let touchedReadme = false
  let touchedVendors = false
  let touchedSubmodules = false

  for (const entry of entries) {
    if (entry.path === 'meta.ts')
      touchedMeta = true
    if (entry.path === 'README.md')
      touchedReadme = true
    if (entry.path.startsWith('vendor/'))
      touchedVendors = true
    if (entry.path.startsWith('sources/') || entry.path === '.gitmodules')
      touchedSubmodules = true

    const skillMatch = entry.path.match(/^skills\/([^/]+)\//)
    if (!skillMatch)
      continue

    const skillName = skillMatch[1]
    if (entry.status.startsWith('A')) {
      newManualSkills.add(skillName)
      updatedManualSkills.delete(skillName)
      continue
    }

    if (!newManualSkills.has(skillName))
      updatedManualSkills.add(skillName)
  }

  return {
    newManualSkills: [...newManualSkills].sort(),
    updatedManualSkills: [...updatedManualSkills].sort(),
    touchedMeta,
    touchedReadme,
    touchedVendors,
    touchedSubmodules,
  }
}

export function collectRegistryData(entries: DiffEntry[]): RegistryData {
  const checks = buildChecks()

  return {
    generatedAt: new Date().toISOString(),
    overview: {
      manualCount: manual.length,
      vendorCount: Object.keys(vendors).length,
      submoduleCount: Object.keys(submodules).length,
    },
    manualSkills: manual.map(getManualSkillSummary),
    vendors: Object.entries(vendors).map(([name, config]) => ({
      name,
      source: config.source,
      official: Boolean(config.official),
      mappedSkillNames: Object.values(config.skills).sort(),
      fetchedSkills: fetchVendorSkills(config.source),
    })),
    submodules: Object.entries(submodules).map(([name, source]) => ({
      name,
      source,
      path: `sources/${name}`,
    })),
    checks,
    recentChanges: detectRecentChanges(entries),
  }
}

function renderList(items: string[], emptyText: string): string {
  if (!items.length)
    return `- ${emptyText}`

  return items.map(item => `- \`${item}\``).join('\n')
}

function renderTagLine(tags: string[]): string {
  if (!tags.length)
    return '- 标签：无'

  return `- 标签：${tags.map(tag => `\`${tag}\``).join('、')}`
}

function renderManualSkills(skills: ManualSkillSummary[]): string {
  if (!skills.length)
    return '- 暂无 manual skills。'

  const groups = new Map<SkillCategory, ManualSkillSummary[]>()

  for (const skill of skills) {
    const current = groups.get(skill.category) ?? []
    current.push(skill)
    groups.set(skill.category, current)
  }

  return categoryOrder
    .filter(category => groups.has(category))
    .map((category) => {
      const items = groups.get(category)!.map(skill => [
        `#### ${skill.name}`,
        `- 标题：${skill.title}`,
        `- 使用场景：${skill.description}`,
        `- 路径：\`${skill.path}\``,
        renderTagLine(skill.tags),
        `- 参考资料：${skill.hasReferences ? '有 `references/`' : '无'}`,
      ].join('\n')).join('\n\n')

      return [`### ${categoryLabels[category]}`, items].join('\n\n')
    })
    .join('\n\n')
}

function renderVendorSkillTable(skills: VendorSkillInfo[]): string {
  if (!skills.length)
    return '> 未能获取技能列表（可能 `gh` 未登录或仓库不可达）'

  const rows = skills
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(skill => `| \`${skill.name}\` | ${skill.description} |`)

  return [
    '| 技能名称 | 说明 |',
    '|---|---|',
    ...rows,
  ].join('\n')
}

function renderVendors(items: VendorSummary[]): string {
  if (!items.length)
    return '- 暂无 vendor source。'

  return items.map((item) => {
    const header = [
      `### ${item.name}`,
      `- Source：${item.source}`,
      `- Official：${item.official ? 'yes' : 'no'}`,
      `- 技能数量：${item.fetchedSkills.length || '未知'}`,
    ]

    if (item.mappedSkillNames.length)
      header.push(`- 已映射到本仓库：${item.mappedSkillNames.map(name => `\`${name}\``).join('、')}`)

    return [
      ...header,
      '',
      renderVendorSkillTable(item.fetchedSkills),
    ].join('\n')
  }).join('\n\n')
}

function renderSubmodules(items: SubmoduleSummary[]): string {
  if (!items.length)
    return '- 暂无 submodule source。'

  return items.map(item => [
    `### ${item.name}`,
    `- Source repo：${item.source}`,
    `- Path：\`${item.path}\``,
  ].join('\n')).join('\n\n')
}

function renderRecentChanges(changes: RecentChanges): string {
  const lines: string[] = []

  if (changes.newManualSkills.length)
    lines.push(`- 新增 manual skills：${changes.newManualSkills.map(name => `\`${name}\``).join('、')}`)
  if (changes.updatedManualSkills.length)
    lines.push(`- 更新 manual skills：${changes.updatedManualSkills.map(name => `\`${name}\``).join('、')}`)
  if (changes.touchedMeta)
    lines.push('- 触发中包含 `meta.ts` 更新')
  if (changes.touchedReadme)
    lines.push('- 触发中包含 `README.md` 更新')
  if (changes.touchedVendors)
    lines.push('- 触发中包含 vendor source 变更')
  if (changes.touchedSubmodules)
    lines.push('- 触发中包含 submodule/source repo 变更')

  if (!lines.length)
    lines.push('- 本次生成未检测到可归类的 registry 变更，可能是手动触发。')

  return lines.join('\n')
}

export function renderMySkillsMarkdown(data: RegistryData, summary?: string | null): string {
  const summaryBlock = summary ? `\n> ${summary}\n` : ''

  return `# 自定义 Skills Registry
${summaryBlock}
## Overview
- 仓库手写技能索引
- 安装方式：\`pnpx skills add snailuu/skill --skill <name>\`
- 最后更新时间：${formatTimestamp(data.generatedAt)}
- Manual skills：${data.overview.manualCount}

## Manual Skills
${renderManualSkills(data.manualSkills)}

## Recent Changes
${renderRecentChanges(data.recentChanges)}

## Consistency Checks
### Manual entries missing directories
${renderList(data.checks.manualMissingDirs, '全部 manual entries 都有对应目录')}

### Skill directories missing from manual
${renderList(data.checks.skillDirsMissingFromManual, 'skills/ 目录中的技能都已登记到 manual')}

### README missing manual skills
${renderList(data.checks.readmeMissingManualSkills, 'README 手写技能列表已覆盖全部 manual skills')}

### README missing install examples
${renderList(data.checks.readmeMissingInstallExamples, 'README 安装示例已覆盖全部 manual skills')}
`
}

export function renderOtherSkillsMarkdown(data: RegistryData, summary?: string | null): string {
  const summaryBlock = summary ? `\n> ${summary}\n` : ''

  const totalFetchedSkills = data.vendors.reduce((sum, v) => sum + v.fetchedSkills.length, 0)

  return `# 外部 Skills Registry
${summaryBlock}
## Overview
- 外部技能来源与资料仓库索引
- 最后更新时间：${formatTimestamp(data.generatedAt)}
- Vendor sources：${data.overview.vendorCount}
- 外部技能总数：${totalFetchedSkills || '未知'}
- Submodule sources：${data.overview.submoduleCount}

## Vendor Sources
${renderVendors(data.vendors)}

## Submodule Sources / Source Repos
${renderSubmodules(data.submodules)}
`
}

function parseCliOptions(argv: string[]): CliOptions {
  const options: CliOptions = {}

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--output-my')
      options.outputMy = argv[++index]
    else if (arg === '--output-other')
      options.outputOther = argv[++index]
    else if (arg === '--base')
      options.base = argv[++index]
    else if (arg === '--head')
      options.head = argv[++index]
    else if (arg === '--summarize')
      options.summarize = true
  }

  return options
}

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv.slice(2))
  const entries = getGitDiffEntries(options.base, options.head)
  const data = collectRegistryData(entries)

  // AI 摘要生成（需要 AI_BASE_URL + AI_API_KEY + AI_MODEL 环境变量 + --summarize 标志）
  let mySummary: string | null = null
  let otherSummary: string | null = null
  const aiConfig = options.summarize ? getAIConfig() : null

  if (aiConfig) {
    // 翻译 vendor 技能描述为中文
    const translations = await translateVendorDescriptions(data.vendors, aiConfig)
    if (translations.size > 0) {
      for (const vendor of data.vendors) {
        for (const skill of vendor.fetchedSkills) {
          const translated = translations.get(`${vendor.name}/${skill.name}`)
          if (translated)
            skill.description = translated
        }
      }
    }

    // 生成 AI 摘要
    const myDraft = renderMySkillsMarkdown(data)
    const otherDraft = renderOtherSkillsMarkdown(data)

    const results = await Promise.allSettled([
      generateAISummary(myDraft, 'my', aiConfig),
      generateAISummary(otherDraft, 'other', aiConfig),
    ])

    mySummary = results[0].status === 'fulfilled' ? results[0].value : null
    otherSummary = results[1].status === 'fulfilled' ? results[1].value : null
  }

  if (options.outputMy)
    writeFileSync(options.outputMy, renderMySkillsMarkdown(data, mySummary), 'utf8')

  if (options.outputOther)
    writeFileSync(options.outputOther, renderOtherSkillsMarkdown(data, otherSummary), 'utf8')

  if (!options.outputMy && !options.outputOther)
    console.log(renderMySkillsMarkdown(data, mySummary))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main()
