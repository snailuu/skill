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

export interface VendorSummary {
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
  output?: string
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

  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#'))
      continue

    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1)
      continue

    const key = line.slice(0, separatorIndex).trim()
    const value = stripWrappingQuotes(line.slice(separatorIndex + 1).trim())

    if (key === 'name')
      name = value
    else if (key === 'description')
      description = value
  }

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

function collectRegistryData(entries: DiffEntry[]): RegistryData {
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

function renderVendors(items: VendorSummary[]): string {
  if (!items.length)
    return '- 暂无 vendor source。'

  return items.map(item => [
    `### ${item.name}`,
    `- Source：${item.source}`,
    `- Official：${item.official ? 'yes' : 'no'}`,
    `- Skill mappings：${item.mappedSkillNames.length}`,
    `- Output skills：${item.mappedSkillNames.length ? item.mappedSkillNames.map(name => `\`${name}\``).join('、') : '未配置'}`,
  ].join('\n')).join('\n\n')
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

export function renderRegistryMarkdown(data: RegistryData): string {
  return `# Skills Registry

## Overview
- 仓库用途：维护、分发和索引本地手写技能与外部技能来源
- 安装方式：\`pnpx skills add snailuu/skill\`
- 最后更新时间：${formatTimestamp(data.generatedAt)}
- Manual skills：${data.overview.manualCount}
- Vendor sources：${data.overview.vendorCount}
- Submodule sources：${data.overview.submoduleCount}

## Manual Skills
${renderManualSkills(data.manualSkills)}

## Vendor Sources
${renderVendors(data.vendors)}

## Submodule Sources / Source Repos
${renderSubmodules(data.submodules)}

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

function parseCliOptions(argv: string[]): CliOptions {
  const options: CliOptions = {}

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--output')
      options.output = argv[++index]
    else if (arg === '--base')
      options.base = argv[++index]
    else if (arg === '--head')
      options.head = argv[++index]
  }

  return options
}

function main(): void {
  const options = parseCliOptions(process.argv.slice(2))
  const entries = getGitDiffEntries(options.base, options.head)
  const markdown = renderRegistryMarkdown(collectRegistryData(entries))

  if (options.output) {
    writeFileSync(options.output, markdown, 'utf8')
    return
  }

  console.log(markdown)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main()
