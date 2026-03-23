/* eslint-disable test/no-import-node-test */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const tsxLoader = join(repoRoot, 'node_modules', 'tsx', 'dist', 'loader.mjs')

function createFixtureProject(): string {
  const projectDir = mkdtempSync(join(tmpdir(), 'skill-cli-'))
  mkdirSync(join(projectDir, 'scripts'), { recursive: true })
  mkdirSync(join(projectDir, 'skills'), { recursive: true })
  mkdirSync(join(projectDir, 'vendor'), { recursive: true })
  mkdirSync(join(projectDir, 'sources'), { recursive: true })

  cpSync(join(repoRoot, 'scripts', 'cli.ts'), join(projectDir, 'scripts', 'cli.ts'))

  writeFileSync(join(projectDir, 'meta.ts'), `export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string>
}

export const submodules: Record<string, string> = {}

export const vendors: Record<string, VendorSkillMeta> = {}

export const manual = [] as const
`, 'utf8')

  return projectDir
}

function createLocalSkill(baseDir: string, skillName: string): string {
  const skillDir = join(baseDir, skillName)
  mkdirSync(skillDir, { recursive: true })
  writeFileSync(join(skillDir, 'SKILL.md'), `---
name: ${skillName}
description: 测试技能
---

# ${skillName}
`, 'utf8')
  writeFileSync(join(skillDir, 'notes.md'), 'extra', 'utf8')
  return skillDir
}

function createVendorRepo(baseDir: string, repoName: string, skillName: string): string {
  const repoDir = join(baseDir, repoName)
  const nestedSkillDir = join(repoDir, 'skills', skillName)
  mkdirSync(nestedSkillDir, { recursive: true })
  writeFileSync(join(nestedSkillDir, 'SKILL.md'), `---
name: ${skillName}
description: vendor 技能
---
`, 'utf8')
  return repoDir
}

function createFakeGit(projectDir: string): string {
  const binDir = join(projectDir, 'bin')
  mkdirSync(binDir, { recursive: true })
  const gitPath = join(binDir, 'git')
  writeFileSync(gitPath, `#!/bin/sh
if [ "$1" = "submodule" ] && [ "$2" = "add" ]; then
  printf '%s %s %s %s\\n' "$1" "$2" "$3" "$4" > "${projectDir}/git-invocation.log"
  mkdir -p "${projectDir}/$4/skills/remote-skill"
  cat > "${projectDir}/$4/skills/remote-skill/SKILL.md" <<'EOF'
---
name: remote-skill
description: remote vendor skill
---
EOF
  exit 0
fi

echo "unexpected git call: $@" >&2
exit 1
`, 'utf8')
  chmodSync(gitPath, 0o755)
  return binDir
}

function runCli(projectDir: string, args: string[], env: NodeJS.ProcessEnv = {}) {
  return spawnSync(process.execPath, ['--import', tsxLoader, join(projectDir, 'scripts', 'cli.ts'), ...args], {
    cwd: projectDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env,
    },
  })
}

test('默认模式会把本地技能目录导入 skills 并更新 manual', () => {
  const projectDir = createFixtureProject()
  const sourceRoot = join(projectDir, 'external')
  mkdirSync(sourceRoot, { recursive: true })
  const sourceSkillDir = createLocalSkill(sourceRoot, 'demo-skill')

  const result = runCli(projectDir, ['skill', sourceSkillDir])

  assert.equal(result.status, 0)
  assert.equal(existsSync(join(projectDir, 'skills', 'demo-skill', 'SKILL.md')), true)

  const metaContent = readFileSync(join(projectDir, 'meta.ts'), 'utf8')
  assert.match(metaContent, /'demo-skill'/)
})

test('默认模式会把 SKILL.md 中的 PascalCase 名称转换为 kebab-case', () => {
  const projectDir = createFixtureProject()
  const sourceRoot = join(projectDir, 'external')
  const sourceSkillDir = join(sourceRoot, 'CreateCLI')
  mkdirSync(sourceSkillDir, { recursive: true })
  writeFileSync(join(sourceSkillDir, 'SKILL.md'), `---
name: CreateCLI
description: 测试技能
---
`, 'utf8')

  const result = runCli(projectDir, ['skill', sourceSkillDir])

  assert.equal(result.status, 0)
  assert.equal(existsSync(join(projectDir, 'skills', 'create-cli', 'SKILL.md')), true)

  const metaContent = readFileSync(join(projectDir, 'meta.ts'), 'utf8')
  assert.match(metaContent, /'create-cli'/)
})

test('默认模式会解析软链接并复制真实技能目录', () => {
  const projectDir = createFixtureProject()
  const sourceRoot = join(projectDir, 'external')
  mkdirSync(sourceRoot, { recursive: true })
  const sourceSkillDir = createLocalSkill(sourceRoot, 'linked-skill')
  const linkPath = join(projectDir, 'linked-skill')
  symlinkSync(sourceSkillDir, linkPath, 'dir')

  const result = runCli(projectDir, ['skill', linkPath])

  assert.equal(result.status, 0)
  assert.equal(existsSync(join(projectDir, 'skills', 'linked-skill', 'notes.md')), true)
})

test('--vendor 会登记来源并复制到 vendor 目录', () => {
  const projectDir = createFixtureProject()
  const sourceRoot = join(projectDir, 'external')
  mkdirSync(sourceRoot, { recursive: true })
  const vendorRepoDir = createVendorRepo(sourceRoot, 'demo-vendor', 'vendor-skill')

  const result = runCli(projectDir, ['skill', vendorRepoDir, '--vendor'])

  assert.equal(result.status, 0)
  assert.equal(existsSync(join(projectDir, 'vendor', 'demo-vendor', 'skills', 'vendor-skill', 'SKILL.md')), true)

  const metaContent = readFileSync(join(projectDir, 'meta.ts'), 'utf8')
  assert.match(metaContent, /demo-vendor/)
  assert.match(metaContent, /vendor-skill/)
})

test('远程 --vendor 会通过 git submodule add 接入 vendor 目录', () => {
  const projectDir = createFixtureProject()
  const fakeGitBin = createFakeGit(projectDir)

  const result = runCli(
    projectDir,
    ['skill', 'https://github.com/example/taste-skill.git', '--vendor'],
    { PATH: `${fakeGitBin}:${process.env.PATH || ''}` },
  )

  assert.equal(result.status, 0)
  assert.equal(existsSync(join(projectDir, 'vendor', 'taste-skill', 'skills', 'remote-skill', 'SKILL.md')), true)

  const gitInvocation = readFileSync(join(projectDir, 'git-invocation.log'), 'utf8')
  assert.match(gitInvocation, /submodule add https:\/\/github\.com\/example\/taste-skill\.git vendor\/taste-skill/)

  const metaContent = readFileSync(join(projectDir, 'meta.ts'), 'utf8')
  assert.match(metaContent, /https:\/\/github\.com\/example\/taste-skill\.git/)
  assert.match(metaContent, /remote-skill/)
})

test('--submodules 传入本地路径时直接报错', () => {
  const projectDir = createFixtureProject()
  const sourceRoot = join(projectDir, 'external')
  mkdirSync(sourceRoot, { recursive: true })
  const sourceSkillDir = createLocalSkill(sourceRoot, 'bad-submodule')

  const result = runCli(projectDir, ['skill', sourceSkillDir, '--submodules'])

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /submodules/i)
})
