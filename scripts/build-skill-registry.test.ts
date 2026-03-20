/* eslint-disable test/no-import-node-test */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildSkillTags,
  classifySkill,
  detectRecentChanges,
  extractTitle,
  parseReadmeManualSkills,
  parseSkillFrontmatter,
  renderMySkillsMarkdown,
  renderOtherSkillsMarkdown,
  translateManualSkillTexts,
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

test('parseSkillFrontmatter 能解析 YAML 多行 description', () => {
  const parsed = parseSkillFrontmatter(`---
name: turborepo
description: |
  Turborepo monorepo build system guidance.
  Use when user configures tasks or pipelines.
metadata:
  author: test
---
`)

  assert.equal(parsed.name, 'turborepo')
  assert.equal(parsed.description, 'Turborepo monorepo build system guidance. Use when user configures tasks or pipelines.')
})

test('extractTitle 在没有一级标题时会回退到 frontmatter name', () => {
  const title = extractTitle(`---
name: create-readme
description: Create a README.md file for the project
---

## Role

正文
`)

  assert.equal(title, 'create-readme')
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

test('classifySkill 能为常见 skill 分配稳定分类', () => {
  assert.equal(classifySkill({
    name: 'git-commit-gen',
    title: 'Git Commit 信息生成技能',
    description: '根据 git status 和 git diff 自动生成 commit message',
  }), 'git')

  assert.equal(classifySkill({
    name: 'pr-review',
    title: 'PR/MR 评论查看与建议技能',
    description: '查看 PR/MR 评论并给出解决建议',
  }), 'review')

  assert.equal(classifySkill({
    name: 'writing-changelogs',
    title: '编写 CHANGELOG 技能',
    description: 'Use when 需要根据 git 历史生成或更新 CHANGELOG.md',
  }), 'release')
})

test('buildSkillTags 能基于 skill 信息生成标签', () => {
  assert.deepEqual(buildSkillTags({
    name: 'pr-review',
    title: 'PR/MR 评论查看与建议技能',
    description: '查看 PR/MR 评论并给出解决建议，支持 GitHub 和 GitLab',
  }), ['git', 'github', 'gitlab', 'pr', 'review'])
})

test('buildSkillTags 不会把 premium 误判成 pr 标签', () => {
  assert.deepEqual(buildSkillTags({
    name: 'ui-stitch-taste',
    title: 'Stitch Design Taste',
    description: 'Semantic Design System Skill for Google Stitch with premium, agent-friendly UI standards.',
  }), ['workflow'])
})

test('translateManualSkillTexts 会翻译 manual 技能标题与描述', async () => {
  const originalFetch = globalThis.fetch
  const responses = ['中文标题', '中文描述']
  let index = 0

  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      choices: [{ message: { content: responses[index++] } }],
    }),
  }) as Response

  const skills = [{
    category: 'workflow' as const,
    name: 'ui-stitch-taste',
    title: 'Stitch Design Taste',
    description: 'Semantic Design System Skill for Google Stitch.',
    path: 'skills/ui-stitch-taste',
    hasReferences: false,
    tags: ['workflow'],
  }]

  try {
    await translateManualSkillTexts(skills, {
      apiKey: 'test-key',
      baseUrl: 'https://example.com',
      model: 'test-model',
    })
  }
  finally {
    globalThis.fetch = originalFetch
  }

  assert.equal(skills[0].title, '中文标题')
  assert.equal(skills[0].description, '中文描述')
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

test('renderMySkillsMarkdown 会输出自定义技能相关结构', () => {
  const markdown = renderMySkillsMarkdown({
    generatedAt: '2026-03-09T12:00:00.000Z',
    overview: {
      manualCount: 1,
      vendorCount: 1,
      submoduleCount: 1,
    },
    manualSkills: [{
      category: 'release',
      name: 'writing-changelogs',
      title: '编写 CHANGELOG 技能',
      description: 'Use when 需要根据 git 历史生成或更新 CHANGELOG.md',
      path: 'skills/writing-changelogs',
      hasReferences: true,
      tags: ['release', 'changelog', 'writing'],
    }],
    vendors: [{
      name: 'antfu',
      source: 'https://github.com/antfu/skills',
      official: true,
      mappedSkillNames: [],
      fetchedSkills: [{ name: 'vue', description: 'Vue 3 framework' }],
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

  assert.match(markdown, /^# 自定义 Skills Registry/m)
  assert.match(markdown, /^## Manual Skills/m)
  assert.match(markdown, /^### Release/m)
  assert.match(markdown, /^## Recent Changes/m)
  assert.match(markdown, /^## Consistency Checks/m)
  assert.match(markdown, /writing-changelogs/)
  assert.match(markdown, /标签：`release`、`changelog`、`writing`/)
  assert.doesNotMatch(markdown, /Vendor Sources/)
  assert.doesNotMatch(markdown, /Submodule Sources/)
})

test('renderOtherSkillsMarkdown 会输出外部技能相关结构', () => {
  const markdown = renderOtherSkillsMarkdown({
    generatedAt: '2026-03-09T12:00:00.000Z',
    overview: {
      manualCount: 1,
      vendorCount: 1,
      submoduleCount: 1,
    },
    manualSkills: [{
      category: 'release',
      name: 'writing-changelogs',
      title: '编写 CHANGELOG 技能',
      description: 'Use when 需要根据 git 历史生成或更新 CHANGELOG.md',
      path: 'skills/writing-changelogs',
      hasReferences: true,
      tags: ['release', 'changelog', 'writing'],
    }],
    vendors: [{
      name: 'antfu',
      source: 'https://github.com/antfu/skills',
      official: true,
      mappedSkillNames: [],
      fetchedSkills: [{ name: 'vue', description: 'Vue 3 framework' }],
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
      newManualSkills: [],
      updatedManualSkills: [],
      touchedMeta: false,
      touchedReadme: false,
      touchedVendors: true,
      touchedSubmodules: true,
    },
  })

  assert.match(markdown, /^# 外部 Skills Registry/m)
  assert.match(markdown, /^## Vendor Sources/m)
  assert.match(markdown, /^## Submodule Sources \/ Source Repos/m)
  assert.match(markdown, /antfu/)
  assert.match(markdown, /技能名称/)
  assert.match(markdown, /`vue`/)
  assert.match(markdown, /Vue 3 framework/)
  assert.doesNotMatch(markdown, /Manual Skills/)
  assert.doesNotMatch(markdown, /Consistency Checks/)
  assert.match(markdown, /来源概览/)
})
