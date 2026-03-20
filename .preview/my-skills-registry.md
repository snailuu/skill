# 自定义 Skills Registry

## Overview
- 仓库手写技能索引
- 安装方式：`pnpx skills add snailuu/skill --skill <name>`
- 最后更新时间：2026-03-20 19:26:05 UTC
- Manual skills：17

## Manual Skills
### Git

#### git-commit-gen
- 标题：Git Commit Message Generation Skill
- 使用场景：Automatically generate standardized Chinese commit messages based on `git status` and `git diff`, with support for the Conventional Commits format and inclusion of module names. Trigger when the user says “生成 commit”, “生成提交信息”, “commit message”, “帮我写 commit”, “提交信息”, or “git commit”. Not applicable to general Git operations such as viewing `git log`, switching branches, or resolving merge conflicts.
- 路径：`skills/git-commit-gen`
- 标签：`git`
- 参考资料：有 `references/`

#### git-exclude
- 标题：“Git 本地忽略技能” 可以翻译为： **Git local ignore techniques** 如果想更自然一点，也可以根据语境翻译为： - **Git local ignore tips** - **Local ignore techniques in Git** - **Git local exclusion techniques** 如果你告诉我是标题、教程名，还是正文里的短语，我可以帮你选最合适的译法。
- 使用场景：Add files/folders to the local Git ignore list (`.git/info/exclude`) without modifying the `.gitignore` file. Trigger this when the user says things like “ignore file,” “local ignore,” “git exclude,” “do not commit,” “exclude file,” or “add to ignore.” Not applicable to general Git operations such as modifying `.gitignore`, `git rm`, etc.
- 路径：`skills/git-exclude`
- 标签：`git`
- 参考资料：有 `references/`

### Review

#### code-review-expert
- 标题：代码审查专家
- 使用场景：以高级工程师视角进行专业代码审查。当用户提到“代码审查”、“review 代码”、“code review”、“审查变更”或“检查代码质量”时触发。   不适用于：编写新代码、修复 bug、重构等开发类操作。
- 路径：`skills/code-review-expert`
- 标签：`review`
- 参考资料：有 `references/`

#### pr-review
- 标题：PR/MR 评论查看与建议技能
- 使用场景：Review PR/MR comments and provide resolution suggestions. Trigger when the user mentions keywords such as “check PR comments,” “comments on PR xxx,” “help me review a PR,” “review PR,” “MR comments,” or “merge request comments.” Support both GitHub and GitLab, automatically detect the platform, prefer using local CLI tools (`gh`/`glab`), and fall back to the API if needed.
- 路径：`skills/pr-review`
- 标签：`git`、`github`、`gitlab`、`pr`、`review`
- 参考资料：有 `references/`

### Planning

#### plan-writer
- 标题：“Plan 模式智能写入技能”可翻译为： **Intelligent Writing Skills in Plan Mode** 如果是产品界面文案，也可以更自然地表达为： **Smart Writing in Plan Mode**   或   **Plan Mode Smart Writing** 如果你愿意，我也可以根据具体语境（例如软件按钮、功能标题、说明文本）给你更合适的译法。
- 使用场景：In Plan mode, the system intelligently writes the plan file in batches to avoid failures caused by attempting to write too much at once.
- 路径：`skills/plan-writer`
- 标签：`planning`、`writing`
- 参考资料：无

#### smart-plan
- 标题：Smart Plan - Smart Planning Generation Skill 如果你想保留更自然的产品/功能命名风格，也可以译为： **Smart Plan - Intelligent Plan Generation Skill**
- 使用场景：Intelligent plan generation capability that resolves the issue of failing to write long content in plan mode. The core strategy is chunked writing, ensuring that plan content is not limited by length.
- 路径：`skills/smart-plan`
- 标签：`planning`
- 参考资料：无

### Writing

#### skill-writer
- 标题：“Skill Writer” 可翻译为： - **技能撰写者** - **技能文案编写者** - **技能作者** 如果是在游戏、AI 平台或软件功能命名语境中，也可以保留为： - **技能写作器** - **技能编辑器** 如果你愿意，我也可以根据具体语境帮你选出最自然的译法。
- 使用场景：Claude Code skill design and writing assistant. It is only triggered manually via the /skill-writer command and does not activate automatically. It is responsible for analyzing the reasonableness of requirements, edge cases, and fallback compatibility handling, and ultimately generating a standardized SKILL.md file.
- 路径：`skills/skill-writer`
- 标签：`writing`
- 参考资料：无

### Workflow

#### ui-high-end-visual
- 标题：Agent 技能：首席 UI/UX 架构师兼动态编排师（Awwwards 级别）
- 使用场景：教会 AI 像高端设计机构一样进行设计。精确定义字体、间距、阴影、卡片结构和动画等元素，让网站呈现出高级、精致的质感。避免使用那些会让 AI 设计看起来廉价或千篇一律的常见默认样式。
- 路径：`skills/ui-high-end-visual`
- 标签：`workflow`
- 参考资料：无

#### ui-stitch-taste
- 标题：“Stitch Design Taste — Semantic Design System Skill” 可翻译为： **Stitch 设计品味——语义化设计系统能力** 如果想更自然一些，也可以根据语境译为： - **Stitch 的设计品味——构建语义化设计系统的能力** - **Stitch 设计审美——语义化设计系统技能** - **Stitch 设计风格——语义设计系统能力** 如果你愿意，我也可以根据它的具体使用场景（如产品标题、简历技能项、课程名称、品牌文案）给你选一个最合适的译法。
- 使用场景：用于 Google Stitch 的语义化设计系统技能。可生成对智能体友好的 DESIGN.md 文件，以强制执行高端、避免千篇一律的 UI 标准——严格的字体排印、经过校准的色彩、不对称布局、持续的微动效，以及硬件加速性能。
- 路径：`skills/ui-stitch-taste`
- 标签：`workflow`
- 参考资料：无

### Release

#### writing-changelogs
- 标题：“Write the CHANGELOG skill” 或 “Create the CHANGELOG skill”。 如果是在软件/文档语境里，更自然的译法也可以是： - “Write a skill for creating a CHANGELOG” - “Create a skill to write CHANGELOGs” 如果你愿意，我也可以根据具体上下文把它翻译得更自然。
- 使用场景：用于需要根据 Git 历史生成或更新 `CHANGELOG.md` 的场景，尤其是在发布前整理 **Unreleased**、版本区间、标签差异（tag diff）或 **Keep a Changelog** 条目时。
- 路径：`skills/writing-changelogs`
- 标签：`changelog`、`git`、`release`
- 参考资料：有 `references/`

### Utility

#### create-readme
- 标题：创建 README 如果你想要更自然一点的中文，也可以根据语境翻译为： - 创建说明文档 - 生成 README 文件
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
- 标题：技能：工业野兽主义与战术遥测用户界面 如果你希望更偏设计领域、自然一些的译法，也可以译为： 工业野兽主义风格与战术遥测界面设计 说明： - Industrial Brutalism：通常指“工业野兽主义”风格 - Tactical Telemetry UI：可译为“战术遥测用户界面”或“战术遥测界面”
- 使用场景：原始机械感界面，将瑞士风格印刷排版与军事终端美学融合。采用严格的网格系统、极端的字号对比、功能主义色彩，以及模拟信号式的做旧退化效果。适用于数据密集型仪表盘、作品集或编辑类网站，营造出一种仿佛“解密蓝图”般的气质。
- 路径：`skills/ui-brutalist`
- 标签：无
- 参考资料：无

#### ui-design-taste
- 标题：“高主动性前端技能” 如果想更自然一些，也可以译为： - “高主导力的前端能力” - “前端高主动性能力” 其中： - **High-Agency** 强调主动推进、独立判断、自己拿结果的能力 - **Frontend Skill** 指前端方面的技能或能力 如果你愿意，我也可以根据具体语境把这个短语翻译得更贴近招聘、课程标题或能力模型。
- 使用场景：高级 UI/UX 工程师。负责构建数字界面架构，以覆盖默认的大语言模型偏差。贯彻基于指标的规则、严格的组件架构、CSS 硬件加速，以及兼顾美学与工程实现的平衡式设计。
- 路径：`skills/ui-design-taste`
- 标签：无
- 参考资料：无

#### ui-minimalist
- 标题：协议：高级功利主义极简 UI 架构师
- 使用场景：简洁的编辑风格界面。温暖的单色调配色、富有对比的字体排印、扁平化的 Bento 网格布局、低饱和的粉彩色。不要渐变，不要厚重阴影。
- 路径：`skills/ui-minimalist`
- 标签：无
- 参考资料：无

#### ui-output-enforcement
- 标题：“Full-Output Enforcement” 可翻译为： **全输出强制执行** 根据具体语境，也可以译为： - **完整输出强制要求** - **强制完整输出** - **全量输出约束** 如果你愿意，我也可以根据它所在的句子或领域（技术、法律、产品文档等）给出更自然的译法。
- 使用场景：覆盖默认的 LLM 截断行为。强制生成完整代码，禁止使用占位符模式，并妥善处理因令牌上限导致的内容拆分。适用于任何需要详尽、未删节输出的任务。
- 路径：`skills/ui-output-enforcement`
- 标签：无
- 参考资料：无

#### ui-redesign
- 标题：“Redesign Skill” 可以翻译为： **重新设计技能** 如果是作标题、按钮或产品功能名，也可以根据语境翻译为： - **改版技能** - **重设计能力** - **重新设计能力** 其中最自然、最常见的是：**重新设计技能**。
- 使用场景：将现有网站和应用升级为高端品质。审查当前设计，识别通用的 AI 设计模式，并在不破坏功能的前提下应用高水准的设计标准。适用于任何 CSS 框架或原生 CSS。
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
