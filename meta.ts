export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string>
}

/**
 * 资料仓库：拉取后由你按需整理为 skills
 */
export const submodules: Record<string, string> = {
  // 示例：
  // vue: 'https://github.com/vuejs/docs',
}

/**
 * 外部技能来源：直接同步已有 skills
 */
export const vendors: Record<string, VendorSkillMeta> = {
  antfu: {
    official: true,
    source: 'https://github.com/antfu/skills',
    // 当前仅作为外部技能来源索引，不同步到本仓库 skills/
    // 如需二次分发，可按 sourceSkillName -> outputSkillName 增加映射后执行 start:sync
    skills: {},
  },
}

/**
 * 本仓库手写技能
 */
export const manual = [
  'code-review-expert',
  'git-commit-gen',
  'git-exclude',
  'pr-review',
  'skill-writer',
  'smart-plan',
  'writing-changelogs',
] as const
