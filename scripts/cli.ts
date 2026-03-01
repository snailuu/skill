import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { manual, submodules, vendors } from '../meta.js'

interface Project {
  name: string
  path: string
  type: 'source' | 'vendor'
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
  pnpm start init
  pnpm start sync
  pnpm start check
  pnpm start cleanup
`)
}

function main(): void {
  const [, , command] = process.argv

  switch (command) {
    case 'init':
      initSubmodules()
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
        console.error(`未知命令：${command}`)
        printHelp()
        process.exit(1)
      }
      else {
        printHelp()
      }
  }
}

main()
