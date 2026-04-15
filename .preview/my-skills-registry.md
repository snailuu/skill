# 自定义 Skills Registry

## Overview
- 仓库手写技能索引
- 安装方式：`pnpx skills add snailuu/skill --skill <name>`
- 最后更新时间：2026-04-15 06:46:18 UTC
- Manual skills：20

## Manual Skills
### Git

#### git-commit-gen
- 标题：Git 提交信息生成技能
- 使用场景：根据 git status 和 git diff 自动生成符合规范的中文提交信息，支持 Conventional Commits 格式，并包含模块名称。用户说“生成 commit”“生成提交信息”“commit message”“帮我写 commit”“提交信息”“git commit”时触发；不适用于查看 git log、切换分支、合并冲突等通用 Git 操作。
- 路径：`skills/git-commit-gen`
- 标签：`git`
- 参考资料：有 `references/`

#### git-exclude
- 标题：Git 本地忽略技能
- 使用场景：将文件/文件夹添加到本地 git 忽略区(.git/info/exclude)，不修改 .gitignore 文件。当用户说"忽略文件"、"本地忽略"、"git exclude"、"不提交"、"排除文件"、"添加到忽略"时触发。不适用于：修改 .gitignore、git rm 等通用 git 操作。
- 路径：`skills/git-exclude`
- 标签：`git`
- 参考资料：有 `references/`

### Review

#### code-review-expert
- 标题：代码审查专家
- 使用场景：以资深工程师的视角进行专业代码审查。当用户提到“代码审查”、“review 代码”、“code review”、“审查变更”或“检查代码质量”时触发；不适用于编写新代码、修复 Bug、重构等开发操作。
- 路径：`skills/code-review-expert`
- 标签：`review`
- 参考资料：有 `references/`

#### pr-review
- 标题：PR/MR 评论查看与建议技能
- 使用场景：查看 PR/MR 评论并给出解决建议。当用户提到"查看 PR 评论"、"PR xxx 的评论"、"帮我看 PR"、"review PR"、"MR 评论"、"merge request 评论"等关键词时触发。支持 GitHub 和 GitLab，自动检测平台，优先使用本地 CLI 工具（gh/glab），fallback 到 API。
- 路径：`skills/pr-review`
- 标签：`git`、`github`、`gitlab`、`pr`、`review`
- 参考资料：有 `references/`

### Planning

#### plan-writer
- 标题：Plan 模式智能写入技能
- 使用场景：在 Plan 模式下，系统会智能分批写入计划文件，以避免因单次写入过大而导致失败。
- 路径：`skills/plan-writer`
- 标签：`planning`、`writing`
- 参考资料：无

#### smart-plan
- 标题：智能计划 - 智能计划生成技能
- 使用场景：智能计划生成技能，解决 plan 模式下长内容写入失败的问题。核心策略为分块写入，确保计划内容不受长度限制。
- 路径：`skills/smart-plan`
- 标签：`planning`
- 参考资料：无

### Writing

#### skill-writer
- 标题：技能编写器
- 使用场景：Claude Code 的 skill 设计与编写助手。仅可通过 /skill-writer 命令手动触发，不会自动激活；负责分析需求合理性、边界情况和降级兼容处理，最终生成规范的 SKILL.md 文件。
- 路径：`skills/skill-writer`
- 标签：`writing`
- 参考资料：无

### Workflow

#### ui-high-end-visual
- 标题：代理技能：首席 UI/UX 架构师与动态编排师（Awwwards 级别）
- 使用场景：教 AI 按高端设计机构的水准进行设计，明确规定字体、间距、阴影、卡片结构和动画等细节，让网站呈现出高级质感。它还会屏蔽那些会让 AI 设计显得廉价或普通的常见默认设置。
- 路径：`skills/ui-high-end-visual`
- 标签：`workflow`
- 参考资料：无

#### ui-stitch-taste
- 标题：Stitch 设计品味——语义化设计系统能力
- 使用场景：适用于 Google Stitch 的语义化设计系统能力。生成对智能体友好的 DESIGN.md 文件，强制执行高端、非模板化的界面标准——包括严格的排版、精确校准的色彩、非对称布局、持续的微动效，以及硬件加速性能。
- 路径：`skills/ui-stitch-taste`
- 标签：`workflow`
- 参考资料：无

### Release

#### writing-changelogs
- 标题：编写更新日志（CHANGELOG）技能
- 使用场景：在需要根据 Git 历史生成或更新 CHANGELOG.md 时使用，尤其适用于发版前整理 Unreleased、版本区间、标签差异或 Keep a Changelog 条目。
- 路径：`skills/writing-changelogs`
- 标签：`changelog`、`git`、`release`
- 参考资料：有 `references/`

### Utility

#### cli-design-framework
- 标题：命令行界面设计框架
- 使用场景：在设计新的 CLI、审查现有 CLI，或对其角色、用户类型、交互形式、有状态性、风险特征以及面向人还是面向机器的接口存在不确定性时使用。
- 路径：`skills/cli-design-framework`
- 标签：无
- 参考资料：有 `references/`

#### create-cli
- 标题：创建 CLI
- 使用场景：生成 TypeScript 命令行工具。适用于创建 CLI、构建 CLI、命令行工具时；文档请使用 SkillSearch('createcli')。
- 路径：`skills/create-cli`
- 标签：无
- 参考资料：无

#### create-readme
- 标题：创建 README 文件
- 使用场景：为该项目创建一个 README.md 文件。
- 路径：`skills/create-readme`
- 标签：无
- 参考资料：无

#### diagram-gen
- 标题：图表 generation skill
- 使用场景：根据用户描述，使用 Mermaid 语法生成多种类型的图表（如时序图、流程图、类图、状态图等），并支持保存为文件。
- 路径：`skills/diagram-gen`
- 标签：无
- 参考资料：无

#### frontend-design
- 标题：前端设计
- 使用场景：创建具有鲜明特色、达到生产级质量且设计水准很高的前端界面。当用户要求构建网页组件、页面、作品、海报或应用（如网站、落地页、仪表盘、React 组件、HTML/CSS 布局，或对任何网页界面进行样式设计与美化）时，应使用此技能；它能生成富有创意、打磨精致的代码和界面设计，避免千篇一律的 AI 风格。
- 路径：`skills/frontend-design`
- 标签：无
- 参考资料：无

#### ui-brutalist
- 标题：技能：工业粗野主义与战术遥测界面
- 使用场景：融合瑞士排版印刷与军用终端美学的原始机械界面。采用严格网格、极端字号对比、功能性色彩和模拟劣化效果，适用于数据密集型仪表盘、作品集或需要呈现“解密蓝图”质感的编辑类网站。
- 路径：`skills/ui-brutalist`
- 标签：无
- 参考资料：无

#### ui-design-taste
- 标题：高主动性的前端技能
- 使用场景：高级 UI/UX 工程师。负责构建数字界面，纠正默认 LLM 偏差，并执行基于指标的规则、严格的组件架构、CSS 硬件加速与均衡的设计工程实践。
- 路径：`skills/ui-design-taste`
- 标签：无
- 参考资料：无

#### ui-minimalist
- 标题：协议：高级实用极简主义 UI 架构师
- 使用场景：干净的编辑风界面。采用温暖的单色调、鲜明的字体对比、扁平化的便当式网格和柔和的粉彩色；不要渐变，也不要厚重阴影。
- 路径：`skills/ui-minimalist`
- 标签：无
- 参考资料：无

#### ui-output-enforcement
- 标题：全输出强制执行
- 使用场景：覆盖默认的 LLM 截断行为，强制生成完整代码，禁止占位符模式，并妥善处理令牌限制导致的拆分。适用于任何需要完整、未删减输出的任务。
- 路径：`skills/ui-output-enforcement`
- 标签：无
- 参考资料：无

#### ui-redesign
- 标题：技能重设计
- 使用场景：将现有网站和应用升级为高端品质。审核当前设计，识别常见 AI 模板痕迹，并在不影响功能的前提下应用高水准设计标准，兼容任何 CSS 框架或原生 CSS。
- 路径：`skills/ui-redesign`
- 标签：无
- 参考资料：无

## Recent Changes
- 本次生成未检测到可归类的 registry 变更，可能是手动触发。

## Consistency Checks
### Manual entries missing directories
- 全部 manual entries 都有对应目录

### Skill directories missing from manual
- skills/ 目录中的技能都已登记到 manual

### README missing manual skills
- `cli-design-framework`
- `create-cli`
- `frontend-design`

### README missing install examples
- `cli-design-framework`
- `create-cli`
- `frontend-design`
