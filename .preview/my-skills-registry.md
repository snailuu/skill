# 自定义 Skills Registry

> 已收到你的自定义 Skills Registry。

当前可用手写技能共 7 个，主要包括：

- Git
  - `git-commit-gen`
  - `git-exclude`
- Review
  - `code-review-expert`
  - `pr-review`
- Planning
  - `smart-plan`
- Writing
  - `skill-writer`
- Release
  - `writing-changelogs`

我会在后续对话中按你的技能定义来理解请求。比如：

- 你说“生成 commit / 帮我写提交信息” → 我会按 `git-commit-gen` 的场景处理
- 你说“本地忽略某个文件，不改 .gitignore” → 我会按 `git-exclude`
- 你说“帮我 review 代码 / 审查变更” → 我会按 `code-review-expert`
- 你说“看一下 PR 评论” → 我会按 `pr-review`
- 你说“生成计划” → 可按 `smart-plan`
- 你说“写 CHANGELOG” → 我会按 `writing-changelogs`

一致性检查结果也正常：

- manual entries 都有对应目录
- `skills/` 中的技能都已登记
- README 已覆盖手写技能和安装示例

你接下来可以直接告诉我你想用哪个技能，或者直接描述任务，例如：

- “根据当前改动生成 commit message”
- “把 `local.config.json` 加到本地忽略”
- “帮我 review 这段代码”
- “查看 PR 123 的评论并给建议”
- “根据 git 历史更新 CHANGELOG”

## Overview
- 仓库手写技能索引
- 安装方式：`pnpx skills add snailuu/skill --skill <name>`
- 最后更新时间：2026-03-14 07:43:28 UTC
- Manual skills：7

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

### Release

#### writing-changelogs
- 标题：编写 CHANGELOG 技能
- 使用场景：Use when 需要根据 git 历史生成或更新 CHANGELOG.md，尤其在发版前整理 Unreleased、版本区间、tag diff 或 Keep a Changelog 条目时。
- 路径：`skills/writing-changelogs`
- 标签：`changelog`、`git`、`release`
- 参考资料：有 `references/`

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
