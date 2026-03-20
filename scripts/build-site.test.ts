/* eslint-disable test/no-import-node-test */

import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  buildManualSkillItem,
  parseManualSkillTranslations,
} from './build-site.js'

test('parseManualSkillTranslations 能解析 manual preview 中的中文使用场景', () => {
  const translations = parseManualSkillTranslations(`
## Manual Skills

#### ui-stitch-taste
- 标题：Stitch Design Taste
- 使用场景：用于 Google Stitch 的语义化设计系统技能。
- 路径：\`skills/ui-stitch-taste\`
- 标签：\`workflow\`
- 参考资料：无
`)

  assert.deepEqual(translations.get('ui-stitch-taste'), {
    description: '用于 Google Stitch 的语义化设计系统技能。',
    title: 'Stitch Design Taste',
  })
})

test('buildManualSkillItem 会优先使用 preview 中的翻译描述', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'build-site-'))
  const skillDir = join(rootDir, 'skills', 'ui-stitch-taste')
  mkdirSync(skillDir, { recursive: true })
  writeFileSync(join(skillDir, 'SKILL.md'), `---
name: ui-stitch-taste
description: Semantic Design System Skill for Google Stitch.
---

# Stitch Design Taste
`, 'utf8')

  const item = buildManualSkillItem({
    name: 'ui-stitch-taste',
    repoUrl: 'https://github.com/snailuu/skill',
    rootDir,
    translations: new Map([
      ['ui-stitch-taste', {
        title: 'Stitch Design Taste',
        description: '用于 Google Stitch 的语义化设计系统技能。',
      }],
    ]),
  })

  assert.equal(item.name, 'ui-stitch-taste')
  assert.equal(item.description, '用于 Google Stitch 的语义化设计系统技能。')
})
