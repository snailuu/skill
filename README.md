# Snailuu 的个人技能仓库（TS + ESLint）

采用 `submodules / vendors / manual` 三层模型维护技能内容。

当前已包含手写技能：

- `code-review-expert`
- `git-commit-gen`
- `git-exclude`

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

## 其他电脑安装与更新

```bash
# 安装本仓库技能
npx skills add snailuu/skill --skill git-exclude
npx skills add snailuu/skill --skill code-review-expert
npx skills add snailuu/skill --skill git-commit-gen

# 检查并更新已安装技能
npx skills check
npx skills update
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
