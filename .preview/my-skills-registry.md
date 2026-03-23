# 自定义 Skills Registry

## Overview
- 仓库手写技能索引
- 安装方式：`pnpx skills add snailuu/skill --skill <name>`
- 最后更新时间：2026-03-23 06:05:08 UTC
- Manual skills：19

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
- 标题：Code Review Expert
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
- 标题：Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)
- 使用场景：Teaches the AI to design like a high-end agency. Defines the exact fonts, spacing, shadows, card structures, and animations that make a website feel expensive. Blocks all the common defaults that make AI designs look cheap or generic.
- 路径：`skills/ui-high-end-visual`
- 标签：`workflow`
- 参考资料：无

#### ui-stitch-taste
- 标题：Stitch Design Taste — Semantic Design System Skill
- 使用场景：Semantic Design System Skill for Google Stitch. Generates agent-friendly DESIGN.md files that enforce premium, anti-generic UI standards — strict typography, calibrated color, asymmetric layouts, perpetual micro-motion, and hardware-accelerated performance.
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
- 使用场景：Use when designing a new CLI, reviewing an existing CLI, or resolving uncertainty about a CLI's role, user type, interaction form, statefulness, risk profile, or human-vs-machine surfaces.
- 路径：`skills/cli-design-framework`
- 标签：无
- 参考资料：有 `references/`

#### create-cli
- 标题：CreateCLI
- 使用场景：Generate TypeScript CLIs. USE WHEN create CLI, build CLI, command-line tool. SkillSearch('createcli') for docs.
- 路径：`skills/create-cli`
- 标签：无
- 参考资料：无

#### create-readme
- 标题：创建 README 文件
- 使用场景：Create a README.md file for the project
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
- 使用场景：Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Rigid grids, extreme type scale contrast, utilitarian color, analog degradation effects. For data-heavy dashboards, portfolios, or editorial sites that need to feel like declassified blueprints.
- 路径：`skills/ui-brutalist`
- 标签：无
- 参考资料：无

#### ui-design-taste
- 标题：High-Agency Frontend Skill
- 使用场景：Senior UI/UX Engineer. Architect digital interfaces overriding default LLM biases. Enforces metric-based rules, strict component architecture, CSS hardware acceleration, and balanced design engineering.
- 路径：`skills/ui-design-taste`
- 标签：无
- 参考资料：无

#### ui-minimalist
- 标题：Protocol: Premium Utilitarian Minimalism UI Architect
- 使用场景：Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows.
- 路径：`skills/ui-minimalist`
- 标签：无
- 参考资料：无

#### ui-output-enforcement
- 标题：Full-Output Enforcement
- 使用场景：Overrides default LLM truncation behavior. Enforces complete code generation, bans placeholder patterns, and handles token-limit splits cleanly. Apply to any task requiring exhaustive, unabridged output.
- 路径：`skills/ui-output-enforcement`
- 标签：无
- 参考资料：无

#### ui-redesign
- 标题：Redesign Skill
- 使用场景：Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vanilla CSS.
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

### README missing install examples
- `cli-design-framework`
- `create-cli`
