export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string>
}

/**
 * 资料仓库：拉取后由你按需整理为 skills
 */
export const submodules: Record<string, string> = {}

/**
 * 外部技能来源：直接同步已有 skills
 */
export const vendors: Record<string, VendorSkillMeta> = {
  'antfu': {
    official: true,
    source: 'https://github.com/antfu/skills',
    skills: {},
  },
  'baoyu': {
    source: 'https://github.com/JimLiu/baoyu-skills',
    skills: {},
  },
}

/**
 * 本仓库手写技能
 */
export const manual = [
  'cli-design-framework',
  'code-review-expert',
  'create-cli',
  'create-readme',
  'diagram-gen',
  'frontend-design',
  'git-commit-gen',
  'git-exclude',
  'plan-writer',
  'pr-review',
  'skill-writer',
  'smart-plan',
  'ui-brutalist',
  'ui-design-taste',
  'ui-high-end-visual',
  'ui-minimalist',
  'ui-output-enforcement',
  'ui-redesign',
  'ui-stitch-taste',
  'writing-changelogs',
] as const
