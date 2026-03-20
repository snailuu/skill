# 自定义 Skills Registry

## Overview
- 仓库手写技能索引
- 安装方式：`pnpx skills add snailuu/skill --skill <name>`
- 最后更新时间：2026-03-20 20:00:27 UTC
- Manual skills：17

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
- 标题：智能体技能：首席 UI/UX 架构师兼动态效果编排师（Awwwards 级别）
- 使用场景：教 AI 像高端设计公司一样进行设计。明确规定字体、间距、阴影、卡片结构和动画等细节，从而让网站呈现出高级、昂贵的质感。同时避免那些常见的默认设置，因为这些设置往往会让 AI 的设计看起来廉价或缺乏特色。
- 路径：`skills/ui-high-end-visual`
- 标签：`workflow`
- 参考资料：无

#### ui-stitch-taste
- 标题：Stitch Design Taste — Semantic Design System Skill
- 使用场景：用于 Google Stitch 的语义化设计系统技能。可生成对智能体友好的 DESIGN.md 文件，以强制执行高端、避免千篇一律的 UI 标准——严格的排版、精心校准的色彩、不对称布局、持续的微动效，以及硬件加速的性能表现。
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
- 使用场景：原始机械式界面，将瑞士版式印刷风格与军用终端美学融合。采用严格的网格系统、极端的字号对比、实用主义配色，以及模拟信号衰减般的做旧效果。适用于数据密集型仪表盘、作品集或编辑类网站，营造出一种“机密蓝图解密后”的视觉氛围。
- 路径：`skills/ui-brutalist`
- 标签：无
- 参考资料：无

#### ui-design-taste
- 标题：High-Agency Frontend Skill
- 使用场景：高级 UI/UX 工程师。负责设计数字界面架构，以覆盖默认的大语言模型偏差。贯彻基于指标的规则、严格的组件架构、CSS 硬件加速，以及兼顾美学与工程实现的平衡式设计。
- 路径：`skills/ui-design-taste`
- 标签：无
- 参考资料：无

#### ui-minimalist
- 标题：Protocol: Premium Utilitarian Minimalism UI Architect
- 使用场景：简洁的编辑风格界面。温暖的单色调配色、富有对比的排版、扁平化的便当式网格布局、柔和的粉彩色。不要使用渐变，也不要使用厚重的阴影。
- 路径：`skills/ui-minimalist`
- 标签：无
- 参考资料：无

#### ui-output-enforcement
- 标题：Full-Output Enforcement
- 使用场景：覆盖默认的 LLM 截断行为。强制生成完整代码，禁止使用占位符模式，并妥善处理因令牌限制导致的内容拆分。适用于任何需要详尽、未经删节输出的任务。
- 路径：`skills/ui-output-enforcement`
- 标签：无
- 参考资料：无

#### ui-redesign
- 标题：Redesign Skill
- 使用场景：将现有网站和应用升级为高品质版本。审查当前设计，识别通用的 AI 设计模式，并在不影响功能的前提下应用高端设计标准。兼容任何 CSS 框架或原生 CSS。
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
- README 手写技能列表已覆盖全部 manual skills

### README missing install examples
- README 安装示例已覆盖全部 manual skills
