# Snailuu 的个人技能仓库（TS + ESLint）

采用 `submodules / vendors / manual` 三层模型维护技能内容。

当前已包含手写技能：

- `code-review-expert`
- `git-commit-gen`
- `git-exclude`
- `pr-review`
- `skill-writer`
- `smart-plan`
- `writing-changelogs`

当前已接入外部技能来源：

- `https://github.com/antfu/skills`

## 目录结构

```text
.
├── meta.ts                  # 核心配置（submodules/vendors/manual）
├── scripts/cli.ts           # init/sync/check/cleanup
├── eslint.config.mjs        # @antfu/eslint-config
├── tsconfig.json
├── instructions/            # 可选：项目级生成提示
├── sources/                 # 需要自行整理内容的资料仓库（子模块）
├── vendor/                  # 外部现成 skills 来源（子模块，仅做来源索引）
└── skills/                  # 分发目录
    └── <skill-name>/
        ├── SKILL.md
        ├── GENERATION.md
        └── SYNC.md
```

## 本地开发

```bash
pnpm install
pnpm lint
pnpm typecheck
```

## 仓库维护命令（默认）

```bash
pnpm start:init
pnpm start:check
pnpm start:cleanup
```

> 说明：当前不把外部仓库内容同步到本仓库 `skills/`，`vendor` 仅做来源索引。

## Skills Registry Issue

仓库内置了一个 GitHub Action，会在主分支相关文件变更后全量重写固定的 pinned issue，用于展示当前 skills registry：

- `Manual Skills`：来自 `meta.ts` 的 `manual` 与 `skills/<name>/SKILL.md`
- `Vendor Sources`：来自 `meta.ts` 的 `vendors`
- `Submodule Sources / Source Repos`：来自 `meta.ts` 的 `submodules`
- `Consistency Checks`：检查 `skills/`、`meta.ts`、`README.md` 是否同步

当前 `Manual Skills` 会基于 `name`、标题和 `description` 做规则分类与 tags 生成，并按分类分组展示。
后续如果要接入 AI，建议只用于：

- 润色每个 skill 的一句话摘要
- 在规则无法明确命中时兜底做分类判断

不要让 AI 负责事实提取或目录一致性判断。

本地预览命令：

```bash
pnpm registry:build
pnpm registry:test
```

启用该 workflow 前，请先在 GitHub 仓库变量中配置：

```text
PINNED_ISSUE_NUMBER=<固定 issue 编号>
```

对应 workflow 文件：

```text
.github/workflows/update-pinned-registry.yml
```

## 其他电脑安装与更新

```bash
# 交互式选择要安装的技能
pnpx skills add snailuu/skill

# 直接安装指定技能
pnpx skills add snailuu/skill --skill git-exclude
pnpx skills add snailuu/skill --skill code-review-expert
pnpx skills add snailuu/skill --skill git-commit-gen
pnpx skills add snailuu/skill --skill pr-review
pnpx skills add snailuu/skill --skill skill-writer
pnpx skills add snailuu/skill --skill smart-plan
pnpx skills add snailuu/skill --skill writing-changelogs

# 检查并更新已安装技能
pnpx skills check
pnpx skills update
```

## Vendored Skills（外部来源）

这里仅记录 `meta.ts` 中 `vendors` 配置的外部来源仓库，不展开列出对方仓库内部的技能清单。

| Vendor | Source |
|---|---|
| antfu | [antfu/skills](https://github.com/antfu/skills) |

## 扩展方式（可选）

1. 在 `meta.ts` 的 `submodules` 增加你要跟踪的资料仓库。
2. 在 `meta.ts` 的 `vendors` 增加外部技能映射。
3. 仅当你需要二次分发时，再执行 `tsx scripts/cli.ts sync`。
