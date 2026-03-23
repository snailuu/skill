import type { VendorSkillMeta } from '../meta.js'
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { manual, submodules, vendors } from '../meta.js'

interface Project {
  name: string
  path: string
  type: 'source' | 'vendor'
  url: string
}

type SkillImportMode = 'manual' | 'submodules' | 'vendor'

interface SkillImportArgs {
  mode: SkillImportMode
  source: string
}

interface GitHubRepo {
  owner: string
  repo: string
  url: string
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

function exec(cmd: string, cwd = root): string {
  return execSync(cmd, {
    cwd,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim()
}

function execSafe(cmd: string, cwd = root): string | null {
  try {
    return exec(cmd, cwd)
  }
  catch {
    return null
  }
}

function ensureDir(path: string): void {
  if (!existsSync(path))
    mkdirSync(path, { recursive: true })
}

function parseSkillCommandArgs(args: string[]): SkillImportArgs {
  let mode: SkillImportMode = 'manual'
  let source = ''

  for (const arg of args) {
    if (arg === '--vendor') {
      if (mode !== 'manual')
        throw new Error('`--vendor` 不能与其他模式同时使用。')
      mode = 'vendor'
      continue
    }

    if (arg === '--submodules') {
      if (mode !== 'manual')
        throw new Error('`--submodules` 不能与其他模式同时使用。')
      mode = 'submodules'
      continue
    }

    if (arg.startsWith('--'))
      throw new Error(`未知选项：${arg}`)

    if (source)
      throw new Error('`skill` 命令只接受一个来源参数。')

    source = arg
  }

  if (!source)
    throw new Error('缺少 skill 来源参数。')

  return { mode, source }
}

function parseGitHubRepo(source: string): GitHubRepo | null {
  const normalized = source.trim().replace(/\/+$/, '')
  const httpsMatch = normalized.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/)
  if (httpsMatch) {
    return {
      owner: httpsMatch[1],
      repo: httpsMatch[2],
      url: `https://github.com/${httpsMatch[1]}/${httpsMatch[2]}.git`,
    }
  }

  const sshMatch = normalized.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/)
  if (sshMatch) {
    return {
      owner: sshMatch[1],
      repo: sshMatch[2],
      url: `git@github.com:${sshMatch[1]}/${sshMatch[2]}.git`,
    }
  }

  return null
}

function resolveLocalDirectory(input: string): string {
  const resolvedPath = resolve(process.cwd(), input)
  if (!existsSync(resolvedPath))
    throw new Error(`来源不存在：${input}`)

  const realPath = realpathSync(resolvedPath)
  const stats = statSync(realPath)
  if (!stats.isDirectory())
    throw new Error(`来源不是目录：${input}`)

  return realPath
}

function hasSkillFile(path: string): boolean {
  return existsSync(join(path, 'SKILL.md'))
}

function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function getSkillNameFromDirectory(path: string): string {
  const skillPath = join(path, 'SKILL.md')
  const content = readFileSync(skillPath, 'utf8')
  const nameLine = content
    .split('\n')
    .find(line => line.trimStart().startsWith('name:'))

  const rawName = nameLine
    ? nameLine
        .slice(nameLine.indexOf(':') + 1)
        .trim()
        .replace(/^['"]/, '')
        .replace(/['"]$/, '')
    : basename(path)

  return toKebabCase(rawName)
}

function scanVendorSkills(path: string): Record<string, string> {
  const skillsRoot = join(path, 'skills')
  if (!existsSync(skillsRoot))
    return {}

  const skillEntries = readdirSync(skillsRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && hasSkillFile(join(skillsRoot, entry.name)))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b))

  return Object.fromEntries(skillEntries.map(name => [name, name]))
}

function copyDirectory(source: string, destination: string): void {
  cpSync(source, destination, {
    recursive: true,
    filter: current => !current.split(/[/\\]/).includes('.git'),
  })
}

function cloneGitHubRepo(url: string): string {
  const tmpPath = mkdtempSync(join(tmpdir(), 'skill-import-'))
  exec(`git clone --depth 1 ${shellQuote(url)} ${shellQuote(tmpPath)}`)
  return tmpPath
}

function formatTsString(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
}

function formatStringRecord(
  record: Record<string, string>,
  indent = '  ',
  closingIndent = '',
): string {
  const entries = Object.entries(record).sort(([left], [right]) => left.localeCompare(right))
  if (!entries.length)
    return '{}'

  return `{\n${entries.map(([key, value]) => `${indent}${formatTsString(key)}: ${formatTsString(value)},`).join('\n')}\n${closingIndent}}`
}

function formatVendorRecord(record: Record<string, VendorSkillMeta>): string {
  const entries = Object.entries(record).sort(([left], [right]) => left.localeCompare(right))
  if (!entries.length)
    return '{}'

  return `{\n${entries.map(([name, config]) => {
    const lines = [
      `  ${formatTsString(name)}: {`,
    ]

    if (config.official)
      lines.push('    official: true,')

    lines.push(`    source: ${formatTsString(config.source)},`)
    lines.push(`    skills: ${formatStringRecord(config.skills, '      ', '    ')},`)
    lines.push('  },')
    return lines.join('\n')
  }).join('\n')}\n}`
}

function writeMetaFile(
  nextSubmodules: Record<string, string>,
  nextVendors: Record<string, VendorSkillMeta>,
  nextManual: string[],
): void {
  const content = `export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string>
}

/**
 * 资料仓库：拉取后由你按需整理为 skills
 */
export const submodules: Record<string, string> = ${formatStringRecord(nextSubmodules)}

/**
 * 外部技能来源：直接同步已有 skills
 */
export const vendors: Record<string, VendorSkillMeta> = ${formatVendorRecord(nextVendors)}

/**
 * 本仓库手写技能
 */
export const manual = [
${nextManual
  .slice()
  .sort((left, right) => left.localeCompare(right))
  .map(name => `  ${formatTsString(name)},`)
  .join('\n')}
] as const
`

  writeFileSync(join(root, 'meta.ts'), content, 'utf8')
}

function assertAvailableName(name: string, mode: SkillImportMode): void {
  const manualNames = new Set<string>(manual)
  const vendorNames = new Set(Object.keys(vendors))
  const submoduleNames = new Set(Object.keys(submodules))

  if (manualNames.has(name) || vendorNames.has(name) || submoduleNames.has(name))
    throw new Error(`名称冲突：${name} 已存在于 meta.ts`)

  if (mode === 'manual' && existsSync(join(root, 'skills', name)))
    throw new Error(`名称冲突：skills/${name} 已存在。`)

  if (mode === 'vendor' && existsSync(join(root, 'vendor', name)))
    throw new Error(`名称冲突：vendor/${name} 已存在。`)

  if (mode === 'submodules' && existsSync(join(root, 'sources', name)))
    throw new Error(`名称冲突：sources/${name} 已存在。`)
}

function importSingleManualSkill(localPath: string): void {
  const skillName = getSkillNameFromDirectory(localPath)
  assertAvailableName(skillName, 'manual')

  ensureDir(join(root, 'skills'))
  copyDirectory(localPath, join(root, 'skills', skillName))

  writeMetaFile(
    { ...submodules },
    Object.fromEntries(Object.entries(vendors).map(([name, config]) => [name, { ...config, skills: { ...config.skills } }])),
    [...manual, skillName],
  )

  console.log(`已导入技能：${skillName} -> skills/${skillName}`)
}

function importManualSkill(source: string): void {
  const githubRepo = parseGitHubRepo(source)
  let cleanupPath = ''
  let sourcePath = source

  try {
    if (githubRepo) {
      cleanupPath = cloneGitHubRepo(githubRepo.url)
      sourcePath = cleanupPath
    }

    const localPath = githubRepo ? sourcePath : resolveLocalDirectory(sourcePath)

    // 目录本身包含 SKILL.md，直接导入单个技能
    if (hasSkillFile(localPath)) {
      importSingleManualSkill(localPath)
      return
    }

    // 扫描子目录中的技能
    const subDirs = readdirSync(localPath, { withFileTypes: true })
      .filter(d => d.isDirectory() && hasSkillFile(join(localPath, d.name)))
      .map(d => join(localPath, d.name))

    if (subDirs.length === 0)
      throw new Error('目录中未找到包含 SKILL.md 的技能目录。')

    for (const dir of subDirs)
      importSingleManualSkill(dir)

    console.log(`共导入 ${subDirs.length} 个技能。`)
  }
  finally {
    if (cleanupPath)
      rmSync(cleanupPath, { recursive: true, force: true })
  }
}

function importVendorSource(source: string): void {
  const githubRepo = parseGitHubRepo(source)
  let localPath = ''
  let sourceLabel = source
  let vendorName = ''

  if (githubRepo) {
    sourceLabel = githubRepo.url
    vendorName = githubRepo.repo
  }
  else {
    localPath = resolveLocalDirectory(source)
    sourceLabel = localPath
    vendorName = basename(localPath)
  }

  assertAvailableName(vendorName, 'vendor')

  const destination = join(root, 'vendor', vendorName)
  ensureDir(join(root, 'vendor'))

  if (githubRepo) {
    exec(`git submodule add ${shellQuote(githubRepo.url)} ${shellQuote(`vendor/${vendorName}`)}`)
  }
  else if (hasSkillFile(localPath)) {
    const skillName = getSkillNameFromDirectory(localPath)
    ensureDir(join(destination, 'skills'))
    copyDirectory(localPath, join(destination, 'skills', skillName))
  }
  else {
    copyDirectory(localPath, destination)
  }

  const nextVendors = Object.fromEntries(
    Object.entries(vendors).map(([name, config]) => [name, { ...config, skills: { ...config.skills } }]),
  )
  nextVendors[vendorName] = {
    source: sourceLabel,
    skills: scanVendorSkills(destination),
  }

  writeMetaFile(
    { ...submodules },
    nextVendors,
    [...manual],
  )

  console.log(`已登记 vendor：${vendorName} -> vendor/${vendorName}`)
}

function importSubmoduleSource(source: string): void {
  const githubRepo = parseGitHubRepo(source)
  if (!githubRepo)
    throw new Error('`--submodules` 仅支持 GitHub 仓库地址。')

  assertAvailableName(githubRepo.repo, 'submodules')
  ensureDir(join(root, 'sources'))
  exec(`git submodule add ${shellQuote(githubRepo.url)} ${shellQuote(`sources/${githubRepo.repo}`)}`)

  writeMetaFile(
    {
      ...submodules,
      [githubRepo.repo]: githubRepo.url,
    },
    Object.fromEntries(Object.entries(vendors).map(([name, config]) => [name, { ...config, skills: { ...config.skills } }])),
    [...manual],
  )

  console.log(`已添加资料子模块：sources/${githubRepo.repo}`)
}

function importSkill(args: string[]): void {
  const parsed = parseSkillCommandArgs(args)
  switch (parsed.mode) {
    case 'manual':
      importManualSkill(parsed.source)
      break
    case 'vendor':
      importVendorSource(parsed.source)
      break
    case 'submodules':
      importSubmoduleSource(parsed.source)
      break
  }
}

function getAllProjects(): Project[] {
  const sourceEntries = Object.entries(submodules)
  const vendorEntries = Object.entries(vendors)

  const sourceProjects: Project[] = sourceEntries.map(([name, url]) => ({
    name,
    url,
    type: 'source',
    path: `sources/${name}`,
  }))
  const vendorProjects: Project[] = vendorEntries.map(([name, config]) => ({
    name,
    url: config.source,
    type: 'vendor',
    path: `vendor/${name}`,
  }))
  return [...sourceProjects, ...vendorProjects]
}

function getGitSha(dir: string): string {
  return execSafe('git rev-parse HEAD', dir) ?? 'unknown'
}

function getExistingSubmodulePaths(): string[] {
  const gitmodulesPath = join(root, '.gitmodules')
  if (!existsSync(gitmodulesPath))
    return []

  const content = readFileSync(gitmodulesPath, 'utf8')
  return Array.from(content.matchAll(/path\s*=\s*(.+)/g), match => match[1].trim())
}

function getExpectedSkillNames(): Set<string> {
  const expected = new Set<string>()

  for (const name of Object.keys(submodules))
    expected.add(name)

  for (const config of Object.values(vendors)) {
    for (const outputName of Object.values(config.skills))
      expected.add(outputName)
  }

  for (const name of manual)
    expected.add(name)

  return expected
}

function getExistingSkillNames(): string[] {
  const skillsDir = join(root, 'skills')
  if (!existsSync(skillsDir))
    return []

  return readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
}

function removeSubmodule(submodulePath: string): void {
  if (execSafe(`git submodule deinit -f ${shellQuote(submodulePath)}`) === null)
    console.warn(`警告：git submodule deinit 失败：${submodulePath}`)
  if (execSafe(`git rm -f ${shellQuote(submodulePath)}`) === null)
    console.warn(`警告：git rm 失败：${submodulePath}`)
  rmSync(join(root, '.git', 'modules', submodulePath), { recursive: true, force: true })
  rmSync(join(root, submodulePath), { recursive: true, force: true })
}

function initSubmodules(): void {
  const projects = getAllProjects()
  if (!projects.length) {
    console.log('没有配置任何 submodule/vendor，跳过 init。')
    return
  }

  const existingPaths = new Set(getExistingSubmodulePaths())
  for (const project of projects) {
    if (existingPaths.has(project.path)) {
      console.log(`已存在，跳过：${project.path}`)
      continue
    }

    if (existsSync(join(root, project.path))) {
      console.log(`目录已存在，跳过子模块初始化：${project.path}`)
      continue
    }

    ensureDir(join(root, dirname(project.path)))
    console.log(`添加子模块：${project.path}`)
    exec(`git submodule add ${shellQuote(project.url)} ${shellQuote(project.path)}`)
  }
}

function syncSubmodules(): void {
  console.log('更新子模块...')
  if (execSafe('git submodule update --remote --merge') === null)
    console.warn('警告：子模块更新失败，将使用本地现有版本。')

  for (const [vendorName, config] of Object.entries(vendors)) {
    const vendorRoot = join(root, 'vendor', vendorName)
    const vendorSkillsRoot = join(vendorRoot, 'skills')

    if (!existsSync(vendorSkillsRoot)) {
      console.warn(`跳过 vendor/${vendorName}：未发现 skills 目录。`)
      continue
    }

    for (const [sourceSkillName, outputSkillName] of Object.entries(config.skills)) {
      const sourceSkillPath = join(vendorSkillsRoot, sourceSkillName)
      const outputPath = join(root, 'skills', outputSkillName)

      if (!existsSync(sourceSkillPath)) {
        console.warn(`跳过 ${vendorName}/${sourceSkillName}：源技能不存在。`)
        continue
      }

      rmSync(outputPath, { recursive: true, force: true })
      ensureDir(join(root, 'skills'))
      cpSync(sourceSkillPath, outputPath, { recursive: true })

      const syncInfo = `# Sync Info

- **Source:** \`vendor/${vendorName}/skills/${sourceSkillName}\`
- **Git SHA:** \`${getGitSha(vendorRoot)}\`
- **Synced:** ${new Date().toISOString().slice(0, 10)}
`
      writeFileSync(join(outputPath, 'SYNC.md'), syncInfo, 'utf8')
      console.log(`已同步：${sourceSkillName} -> ${outputSkillName}`)
    }
  }
}

function checkUpdates(): void {
  if (execSafe('git submodule foreach git fetch') === null)
    console.warn('警告：fetch 失败，检查结果可能不准确。')

  const updates: Array<{ name: string, behind: number, type: string }> = []

  for (const [name] of Object.entries(submodules)) {
    const repoPath = join(root, 'sources', name)
    if (!existsSync(repoPath))
      continue

    const behind = execSafe('git rev-list HEAD..@{u} --count', repoPath)
    const count = behind ? Number.parseInt(behind, 10) : 0
    if (count > 0)
      updates.push({ name, behind: count, type: 'source' })
  }

  for (const [name] of Object.entries(vendors)) {
    const repoPath = join(root, 'vendor', name)
    if (!existsSync(repoPath))
      continue

    const behind = execSafe('git rev-list HEAD..@{u} --count', repoPath)
    const count = behind ? Number.parseInt(behind, 10) : 0
    if (count > 0)
      updates.push({ name, behind: count, type: 'vendor' })
  }

  if (!updates.length) {
    console.log('所有子模块都已是最新。')
    return
  }

  console.log('发现可更新项目：')
  for (const item of updates)
    console.log(`- ${item.name} (${item.type}) 落后 ${item.behind} 个提交`)
}

function cleanup(): void {
  const expectedSubmodulePaths = new Set(getAllProjects().map(item => item.path))
  const existingSubmodulePaths = getExistingSubmodulePaths()
  const extraSubmodules = existingSubmodulePaths.filter(path => !expectedSubmodulePaths.has(path))

  for (const path of extraSubmodules) {
    console.log(`移除多余子模块：${path}`)
    removeSubmodule(path)
  }

  const expectedSkills = getExpectedSkillNames()
  const existingSkills = getExistingSkillNames()
  const extraSkills = existingSkills.filter(name => !expectedSkills.has(name))

  for (const skill of extraSkills) {
    console.log(`移除多余技能：skills/${skill}`)
    rmSync(join(root, 'skills', skill), { recursive: true, force: true })
  }

  if (!extraSubmodules.length && !extraSkills.length)
    console.log('无多余内容，仓库已清理。')
}

function printHelp(): void {
  console.log(`Skills Manager

用法：
  pnpm start:init
  pnpm skill <source> [--vendor | --submodules]
  tsx scripts/cli.ts sync
  pnpm start:check
  pnpm start:cleanup
`)
}

function main(): void {
  const [, , command, ...args] = process.argv

  try {
    switch (command) {
      case 'init':
        initSubmodules()
        break
      case 'skill':
        importSkill(args)
        break
      case 'sync':
        syncSubmodules()
        break
      case 'check':
        checkUpdates()
        break
      case 'cleanup':
        cleanup()
        break
      default:
        if (command) {
          throw new Error(`未知命令：${command}`)
        }
        else {
          printHelp()
        }
    }
  }
  catch (error) {
    if (error instanceof Error)
      console.error(error.message)
    else
      console.error(String(error))

    if (command === 'skill')
      printHelp()

    process.exit(1)
  }
}

main()
