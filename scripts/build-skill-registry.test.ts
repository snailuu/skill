/* eslint-disable test/no-import-node-test */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  detectRecentChanges,
  parseReadmeManualSkills,
  parseSkillFrontmatter,
  renderRegistryMarkdown,
} from './build-skill-registry.js'

test('parseSkillFrontmatter 能解析 name 和 description', () => {
  const parsed = parseSkillFrontmatter(`---
name: writing-changelogs
description: Use when 需要根据 git 历史生成或更新 CHANGELOG.md
---

# 标题
`)

  assert.deepEqual(parsed, {
    name: 'writing-changelogs',
    description: 'Use when 需要根据 git 历史生成或更新 CHANGELOG.md',
  })
})

test('parseSkillFrontmatter 会还原双引号字符串中的转义引号', () => {
  const parsed = parseSkillFrontmatter(`---
name: quoted-skill
description: "当用户说\\\"代码审查\\\"时触发"
---
`)

  assert.equal(parsed.description, '当用户说"代码审查"时触发')
})

test('detectRecentChanges 能区分新增和更新的 manual skill', () => {
  const changes = detectRecentChanges([
    { status: 'A', path: 'skills/new-skill/SKILL.md' },
    { status: 'A', path: 'skills/new-skill/references/examples.md' },
    { status: 'M', path: 'skills/existing-skill/SKILL.md' },
    { status: 'M', path: 'meta.ts' },
    { status: 'M', path: 'README.md' },
  ])

  assert.deepEqual(changes, {
    newManualSkills: ['new-skill'],
    updatedManualSkills: ['existing-skill'],
    touchedMeta: true,
    touchedReadme: true,
    touchedVendors: false,
    touchedSubmodules: false,
  })
})

test('parseReadmeManualSkills 能解析 README 中的手写技能列表', () => {
  const skills = parseReadmeManualSkills(`
当前已包含手写技能：

- \`code-review-expert\`
- \`git-commit-gen\`
- \`writing-changelogs\`

当前已接入外部技能来源：
`)

  assert.deepEqual(skills, [
    'code-review-expert',
    'git-commit-gen',
    'writing-changelogs',
  ])
})

test('renderRegistryMarkdown 会输出固定结构', () => {
  const markdown = renderRegistryMarkdown({
    generatedAt: '2026-03-09T12:00:00.000Z',
    overview: {
      manualCount: 1,
      vendorCount: 1,
      submoduleCount: 1,
    },
    manualSkills: [{
      name: 'writing-changelogs',
      title: '编写 CHANGELOG 技能',
      description: 'Use when 需要根据 git 历史生成或更新 CHANGELOG.md',
      path: 'skills/writing-changelogs',
      hasReferences: true,
    }],
    vendors: [{
      name: 'antfu',
      source: 'https://github.com/antfu/skills',
      official: true,
      mappedSkillNames: [],
    }],
    submodules: [{
      name: 'docs',
      source: 'https://github.com/example/docs',
      path: 'sources/docs',
    }],
    checks: {
      manualMissingDirs: [],
      skillDirsMissingFromManual: [],
      readmeMissingManualSkills: [],
      readmeMissingInstallExamples: [],
    },
    recentChanges: {
      newManualSkills: ['writing-changelogs'],
      updatedManualSkills: [],
      touchedMeta: true,
      touchedReadme: true,
      touchedVendors: false,
      touchedSubmodules: false,
    },
  })

  assert.match(markdown, /^# Skills Registry/m)
  assert.match(markdown, /^## Manual Skills/m)
  assert.match(markdown, /^## Vendor Sources/m)
  assert.match(markdown, /^## Submodule Sources \/ Source Repos/m)
  assert.match(markdown, /^## Recent Changes/m)
  assert.match(markdown, /^## Consistency Checks/m)
  assert.match(markdown, /writing-changelogs/)
})
