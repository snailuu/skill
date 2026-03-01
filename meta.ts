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
  // 示例：
  // 'vueuse': {
  //   source: 'https://github.com/vueuse/skills',
  //   skills: {
  //     'vueuse-functions': 'vueuse-functions',
  //   },
  // },
}

/**
 * 本仓库手写技能
 */
export const manual = [
  'git-exclude',
] as const
