/* eslint-disable test/no-import-node-test */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const tsxBin = join(repoRoot, 'node_modules', '.bin', 'tsx')

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

function runCli(projectDir: string, args: string[]) {
  return spawnSync(tsxBin, [join(projectDir, 'scripts', 'cli.ts'), ...args], {
    cwd: projectDir,
    encoding: 'utf8',
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

test('--submodules 传入本地路径时直接报错', () => {
  const projectDir = createFixtureProject()
  const sourceRoot = join(projectDir, 'external')
  mkdirSync(sourceRoot, { recursive: true })
  const sourceSkillDir = createLocalSkill(sourceRoot, 'bad-submodule')

  const result = runCli(projectDir, ['skill', sourceSkillDir, '--submodules'])

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /submodules/i)
})
