# 自定义 Skills Registry

## Overview
- 仓库手写技能索引
- 安装方式：`pnpx skills add snailuu/skill --skill <name>`
- 最后更新时间：2026-03-20 15:09:16 UTC
- Manual skills：17

## Manual Skills
### Git

#### git-commit-gen
- 标题：Git Commit Message Generation Skill
- 使用场景：Automatically generate standardized Chinese commit messages based on `git status` and `git diff`, with support for the Conventional Commits format and inclusion of module names. Trigger when the user says phrases like “generate commit”, “generate commit message”, “commit message”, “help me write a commit”, “commit message”, or “git commit”. Not applicable to general Git operations such as viewing `git log`, switching branches, or resolving merge conflicts.
- 路径：`skills/git-commit-gen`
- 标签：`git`
- 参考资料：有 `references/`

#### git-exclude
- 标题：“Git 本地忽略技能” 可以翻译为： **Git local ignore tips** 如果你想更自然一点，也可以根据语境翻译为： - **Git local ignore techniques** - **Git local file ignoring tips** - **Tips for ignoring files locally in Git** 如果你愿意，我也可以根据它是“文章标题、教程标题还是功能说明”来给你选一个最合适的译法。
- 使用场景：Add files/folders to the local Git ignore list (`.git/info/exclude`) without modifying the `.gitignore` file. Trigger when the user says things like “ignore file,” “local ignore,” “git exclude,” “do not commit,” “exclude file,” or “add to ignore.” Not applicable to general Git operations such as modifying `.gitignore`, `git rm`, etc.
- 路径：`skills/git-exclude`
- 标签：`git`
- 参考资料：有 `references/`

### Review

#### code-review-expert
- 标题：代码审查专家
- 使用场景：以资深工程师视角进行专业代码审查。   当用户提到“代码审查”、“review 代码”、“code review”、“审查变更”或“检查代码质量”时触发。   不适用于：编写新代码、修复 bug、重构等开发类操作。
- 路径：`skills/code-review-expert`
- 标签：`review`
- 参考资料：有 `references/`

#### pr-review
- 标题：PR/MR 评论查看与建议技能
- 使用场景：Review PR/MR comments and provide resolution suggestions. Trigger when the user mentions keywords such as “check PR comments,” “comments on PR xxx,” “help me look at the PR,” “review PR,” “MR comments,” or “merge request comments.” Supports both GitHub and GitLab, automatically detects the platform, prioritizes using local CLI tools (`gh`/`glab`), and falls back to the API if needed.
- 路径：`skills/pr-review`
- 标签：`git`、`github`、`gitlab`、`pr`、`review`
- 参考资料：有 `references/`

### Planning

#### plan-writer
- 标题：“Plan 模式智能写入技能”可翻译为： **Smart Writing Skill in Plan Mode** 如果你希望更自然一点，也可以根据语境译为： - **Intelligent Writing Feature in Plan Mode** - **Smart Input Capability for Plan Mode** 如果你告诉我这是产品界面文案、功能名，还是说明文字，我可以帮你选最合适的译法。
- 使用场景：In Plan mode, intelligently write the plan file in batches to avoid failures caused by writing too much at once.
- 路径：`skills/plan-writer`
- 标签：`planning`、`writing`
- 参考资料：无

#### smart-plan
- 标题：Smart Plan - Intelligent Plan Generation Skill 如果你想保留更自然的产品名称风格，也可以译为： **Smart Plan - Smart Plan Generation Skill**
- 使用场景：Intelligent plan-generation capability that resolves the issue of long content failing to be written in plan mode. The core strategy is chunked writing, ensuring that plan content is not limited by length.
- 路径：`skills/smart-plan`
- 标签：`planning`
- 参考资料：无

### Writing

#### skill-writer
- 标题：“Skill Writer” 可翻译为： - **技能撰写员** - **技能文案撰写者** 如果是在不同语境下，也可能译为： - **技能编写者** - **技能说明撰写员** 如果你愿意，我也可以根据具体语境（比如游戏、简历、培训、软件功能名）给出更自然的翻译。
- 使用场景：Claude Code skill design and writing assistant. It is triggered manually only via the `/skill-writer` command and does not activate automatically. It is responsible for analyzing the reasonableness of requirements, edge cases, and fallback compatibility handling, and ultimately generating a standardized `SKILL.md` file.
- 路径：`skills/skill-writer`
- 标签：`writing`
- 参考资料：无

### Workflow

#### ui-high-end-visual
- 标题：代理技能：首席 UI/UX 架构师兼动态设计编导（Awwwards 级别）
- 使用场景：教会 AI 以高端设计机构的水准进行设计。明确规定字体、间距、阴影、卡片结构和动画等细节，让网站呈现出高级、昂贵的质感。同时避免所有那些会让 AI 设计看起来廉价或千篇一律的常见默认样式。
- 路径：`skills/ui-high-end-visual`
- 标签：`workflow`
- 参考资料：无

#### ui-stitch-taste
- 标题：“Stitch Design Taste — Semantic Design System Skill” 可译为： **缝合设计品味——语义化设计系统能力** 如果按不同语境，也可以译为： - **Stitch 设计品味——语义化设计系统技能** - **整合设计品味——语义化设计系统能力** - **设计品味的串联——语义化设计系统技能** 如果你愿意，我也可以根据它是**课程名、简历技能项、产品标题或品牌文案**，给你提供更自然的中文版本。
- 使用场景：用于 Google Stitch 的语义化设计系统技能。可生成对智能体友好的 DESIGN.md 文件，以强制执行高端、反模板化的 UI 标准——严格的排版、经过校准的色彩、不对称布局、持续的微动效，以及硬件加速的性能表现。
- 路径：`skills/ui-stitch-taste`
- 标签：`workflow`
- 参考资料：无

### Release

#### writing-changelogs
- 标题：“编写 CHANGELOG 技能” 可翻译为： **Writing a CHANGELOG skill** 如果你想更自然一些，也可以根据语境翻译为： - **Skill for writing a changelog** - **How to write a CHANGELOG**（如果这是标题或教程名称） - **Writing changelogs**（更简洁的标题风格） 如果你愿意，我也可以根据具体语境（比如产品文档、课程标题、功能名称）给出最合适的译法。
- 使用场景：用于需要根据 Git 历史生成或更新 `CHANGELOG.md` 的场景，尤其是在发版前整理 `Unreleased`、版本区间、标签差异（tag diff）或 **Keep a Changelog** 条目时。
- 路径：`skills/writing-changelogs`
- 标签：`changelog`、`git`、`release`
- 参考资料：有 `references/`

### Utility

#### create-readme
- 标题：“create-readme” 可翻译为： **创建 README 文件** 如果按命令或项目名保留原样，也可以译为： **创建 readme** / **生成 README** 如果你愿意，我也可以根据具体语境给你最自然的中文译法。
- 使用场景：为该项目创建一个 README.md 文件。
- 路径：`skills/create-readme`
- 标签：无
- 参考资料：无

#### diagram-gen
- 标题：图表生成技能
- 使用场景：Generate various types of charts based on user descriptions (such as sequence diagrams, flowcharts, class diagrams, state diagrams, etc.) using Mermaid syntax, with support for saving them as files.
- 路径：`skills/diagram-gen`
- 标签：无
- 参考资料：无

#### ui-brutalist
- 标题：技能：工业粗野主义与战术遥测界面 如果你希望更偏设计领域的自然表达，也可以译为： - 技能：工业粗野主义风格与战术遥测界面设计 - 技能：工业粗野主义及战术遥测 UI 其中： - Industrial Brutalism = 工业粗野主义 / 工业蛮荒风格（设计语境下通常译“粗野主义”） - Tactical Telemetry UI = 战术遥测用户界面 / 战术遥测界面
- 使用场景：原始机械感界面，将瑞士风格排版印刷与军用终端美学融合在一起。采用严格的网格系统、极端的字号对比、功能主义色彩以及模拟式做旧效果。适用于数据密集型仪表盘、作品集或编辑类网站，营造出一种仿佛“解密蓝图”般的质感。
- 路径：`skills/ui-brutalist`
- 标签：无
- 参考资料：无

#### ui-design-taste
- 标题：“高主观能动性的前端技能” 也可根据语境译为： - “高自主性的前端能力” - “强主动性的前端技能” 如果你愿意，我也可以顺便解释一下这里 **High-Agency** 在不同语境里的更自然译法。
- 使用场景：高级 UI/UX 工程师。负责构建数字界面架构，以覆盖默认的大语言模型偏差。贯彻基于指标的规则、严格的组件架构、CSS 硬件加速，以及兼顾平衡性的设计工程。
- 路径：`skills/ui-design-taste`
- 标签：无
- 参考资料：无

#### ui-minimalist
- 标题：协议：高级功利主义极简界面架构师 如果你愿意，我也可以根据语境给出更自然的几种译法。
- 使用场景：干净的编辑风格界面。温暖的单色调配色、富有对比的排版、扁平化的便当式网格布局、低饱和的粉彩色。不要使用渐变，也不要使用厚重的阴影。
- 路径：`skills/ui-minimalist`
- 标签：无
- 参考资料：无

#### ui-output-enforcement
- 标题：“Full-Output Enforcement” 可译为： **完整输出强制执行** 如果你愿意，我也可以根据具体语境提供更自然的译法，例如： - **强制完整输出** - **全量输出约束** - **完整输出控制**
- 使用场景：覆盖默认的大语言模型截断行为。强制生成完整代码，禁止使用占位符模式，并妥善处理因令牌上限导致的分段输出。可应用于任何需要详尽、未删节输出的任务。
- 路径：`skills/ui-output-enforcement`
- 标签：无
- 参考资料：无

#### ui-redesign
- 标题：“Redesign Skill” 可译为： **重新设计技能** 如果根据不同语境，也可以译为： - **再设计能力** - **改版设计技能** - **重构设计能力** 如果你愿意，我也可以根据具体上下文帮你选出最自然的译法。
- 使用场景：将现有网站和应用升级为高品质版本。审核当前设计，识别通用的 AI 风格模式，并在不破坏功能的前提下应用高端设计标准。适用于任何 CSS 框架或原生 CSS。
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
