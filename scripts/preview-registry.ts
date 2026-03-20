/**
 * 本地预览 registry issue 输出效果
 *
 * 用法：
 *   pnpm registry:preview                # 纯模板输出（无翻译）
 *   pnpm registry:preview --summarize    # 带翻译（需要 .env 配置）
 *
 * 环境变量从项目根目录 .env 文件读取
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// 手动加载 .env 文件，避免引入额外依赖
function loadEnvFile(): void {
  const envPath = join(root, '.env')
  if (!existsSync(envPath))
    return

  const content = readFileSync(envPath, 'utf8')
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#'))
      continue

    const eqIndex = line.indexOf('=')
    if (eqIndex === -1)
      continue

    const key = line.slice(0, eqIndex).trim()
    let value = line.slice(eqIndex + 1).trim()

    // 去除引号包裹
    if ((value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith('\'') && value.endsWith('\''))) {
      value = value.slice(1, -1)
    }

    // 不覆盖已有环境变量
    if (!process.env[key])
      process.env[key] = value
  }
}

async function main(): Promise<void> {
  loadEnvFile()

  const summarize = process.argv.includes('--summarize')
  const outDir = join(root, '.preview')

  if (!existsSync(outDir))
    mkdirSync(outDir, { recursive: true })

  const myFile = join(outDir, 'my-skills-registry.md')
  const otherFile = join(outDir, 'other-skills-registry.md')

  // 动态导入构建模块（在 .env 加载之后，让环境变量生效）
  const {
    collectRegistryData,
    renderMySkillsMarkdown,
    renderOtherSkillsMarkdown,
    translateVendorDescriptions,
  } = await import('./build-skill-registry.js')

  const data = collectRegistryData([])

  if (summarize) {
    const baseUrl = process.env.AI_BASE_URL
    const apiKey = process.env.AI_API_KEY
    const model = process.env.AI_MODEL

    if (!baseUrl || !apiKey || !model) {
      console.error('⚠ --summarize 需要在 .env 中配置 AI_BASE_URL、AI_API_KEY、AI_MODEL')
      console.error('  参考 .env.example 文件')
      process.exit(1)
    }

    const config = { baseUrl, apiKey, model }

    // 翻译 vendor 技能描述
    console.log(`翻译外部技能描述 (${model})...`)
    const translations = await translateVendorDescriptions(data.vendors, config)
    if (translations.size > 0) {
      for (const vendor of data.vendors) {
        for (const skill of vendor.fetchedSkills) {
          const translated = translations.get(`${vendor.name}/${skill.name}`)
          if (translated)
            skill.description = translated
        }
      }
      console.log(`  翻译完成：${translations.size} 条`)
    }
    else {
      console.warn('⚠ 翻译失败，保留英文原文')
    }
  }

  writeFileSync(myFile, renderMySkillsMarkdown(data), 'utf8')
  writeFileSync(otherFile, renderOtherSkillsMarkdown(data), 'utf8')

  console.log('')
  console.log('预览文件已生成：')
  console.log(`  自定义 Skills → ${myFile}`)
  console.log(`  外部 Skills   → ${otherFile}`)
  console.log('')
  console.log('提示：用 Markdown 预览工具打开查看 issue 渲染效果')
}

main()
