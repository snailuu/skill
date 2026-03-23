# 自定义 Skills Registry

## Overview
- 仓库手写技能索引
- 安装方式：`pnpx skills add snailuu/skill --skill <name>`
- 最后更新时间：2026-03-23 00:44:18 UTC
- Manual skills：18

## Manual Skills
### Git

#### git-commit-gen
- 标题：Git Commit 信息生成技能
- 使用场景：根据 git status 和 git diff 自动生成符合规范的中文 commit message，支持 Conventional Commits 格式，包含模块名称。当用户说"生成 commit"、"生成提交信息"、"commit message"、"帮我写 commit"、"提交信息"、"git commit"时触发。不适用于：查看 git log、切换分支、合并冲突等通用 git 操作。
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
- 使用场景：Expert code review with a senior engineer lens. 当用户说"代码审查"、"review 代码"、"code review"、"审查变更"、"检查代码质量"时触发。不适用于：编写新代码、修复 bug、重构等开发操作。
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
- 使用场景：Plan 模式下智能分批写入计划文件，避免单次写入过大导致失败
- 路径：`skills/plan-writer`
- 标签：`planning`、`writing`
- 参考资料：无

#### smart-plan
- 标题：Smart Plan - 智能计划生成技能
- 使用场景：智能计划生成技能，解决 plan 模式下长内容写入失败的问题。核心策略为分块写入，确保计划内容不受长度限制。
- 路径：`skills/smart-plan`
- 标签：`planning`
- 参考资料：无

### Writing

#### skill-writer
- 标题：Skill Writer
- 使用场景：Claude Code skill 设计和编写助手。仅通过 /skill-writer 命令手动触发，不自动激活。负责分析需求合理性、边界情况、降级兼容处理，最终生成规范的 SKILL.md 文件。
- 路径：`skills/skill-writer`
- 标签：`writing`
- 参考资料：无

### Workflow

#### ui-high-end-visual
- 标题：代理技能：首席 UI/UX 架构师兼动态编排师（Awwwards 级别）
- 使用场景：教会 AI 像高端设计机构一样进行设计。精确定义字体、间距、阴影、卡片结构和动画等细节，让网站呈现出高级、昂贵的质感。同时避免所有那些会让 AI 设计显得廉价或千篇一律的常见默认样式。
- 路径：`skills/ui-high-end-visual`
- 标签：`workflow`
- 参考资料：无

#### ui-stitch-taste
- 标题：Stitch Design Taste — Semantic Design System Skill
- 使用场景：用于 Google Stitch 的语义化设计系统技能。可生成适合代理使用的 DESIGN.md 文件，强制执行高端、反模板化的 UI 标准——严格的字体排印、经过校准的色彩、不对称布局、持续的微交互动效，以及硬件加速性能。
- 路径：`skills/ui-stitch-taste`
- 标签：`workflow`
- 参考资料：无

### Release

#### writing-changelogs
- 标题：编写 CHANGELOG 技能
- 使用场景：Use when 需要根据 git 历史生成或更新 CHANGELOG.md，尤其在发版前整理 Unreleased、版本区间、tag diff 或 Keep a Changelog 条目时。
- 路径：`skills/writing-changelogs`
- 标签：`changelog`、`git`、`release`
- 参考资料：有 `references/`

### Utility

#### cli-design-framework
- 标题：CLI Design Framework
- 使用场景：在设计新的 CLI、审查现有 CLI，或在 CLI 的角色、用户类型、交互形式、有状态性、风险特征以及面向人类还是机器的使用界面存在不确定性时使用。
- 路径：`skills/cli-design-framework`
- 标签：无
- 参考资料：有 `references/`

#### create-readme
- 标题：create-readme
- 使用场景：为该项目创建一个 README.md 文件。
- 路径：`skills/create-readme`
- 标签：无
- 参考资料：无

#### diagram-gen
- 标题：图表生成技能
- 使用场景：根据用户描述生成各种类型的图表（时序图、流程图、类图、状态图等），使用 Mermaid 语法，支持保存为文件
- 路径：`skills/diagram-gen`
- 标签：无
- 参考资料：无

#### ui-brutalist
- 标题：SKILL: Industrial Brutalism & Tactical Telemetry UI
- 使用场景：原始机械感界面，将瑞士风格的印刷排版与军用终端美学融为一体。采用严格的网格系统、极端的字号对比、功能主义色彩，以及模拟信号式的老化损耗效果。非常适合用于数据密集型仪表板、作品集或编辑类网站，营造出一种如同“解密蓝图”般的视觉感受。
- 路径：`skills/ui-brutalist`
- 标签：无
- 参考资料：无

#### ui-design-taste
- 标题：High-Agency Frontend Skill
- 使用场景：高级 UI/UX 工程师。负责构建能够覆盖默认大语言模型偏差的数字界面。强调基于指标的规则、严格的组件架构、CSS 硬件加速以及兼顾美学与工程实现的平衡式设计。
- 路径：`skills/ui-design-taste`
- 标签：无
- 参考资料：无

#### ui-minimalist
- 标题：Protocol: Premium Utilitarian Minimalism UI Architect
- 使用场景：干净的编辑风格界面。温暖的单色调色板、富有对比的字体排版、扁平化的 Bento 网格、柔和的粉彩色。不要渐变，不要厚重阴影。
- 路径：`skills/ui-minimalist`
- 标签：无
- 参考资料：无

#### ui-output-enforcement
- 标题：Full-Output Enforcement
- 使用场景：覆盖默认的 LLM 截断行为。强制生成完整代码，禁止使用占位符模式，并妥善处理因令牌限制导致的分段输出。适用于任何需要详尽、未删节输出的任务。
- 路径：`skills/ui-output-enforcement`
- 标签：无
- 参考资料：无

#### ui-redesign
- 标题：Redesign Skill
- 使用场景：将现有网站和应用升级为高端品质。审查当前设计，识别通用的 AI 风格模式，并在不破坏功能的前提下应用高端设计标准。兼容任何 CSS 框架或原生 CSS。
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

### README missing install examples
- `cli-design-framework`
