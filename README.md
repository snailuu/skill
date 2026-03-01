# Snailuu 的个人技能仓库（TS + ESLint）

采用 `submodules / vendors / manual` 三层模型维护技能内容。

当前已包含手写技能：

- `git-exclude`

## 目录结构

```text
.
├── meta.ts                  # 核心配置（submodules/vendors/manual）
├── scripts/cli.ts           # init/sync/check/cleanup
├── eslint.config.mjs        # @antfu/eslint-config
├── tsconfig.json
├── instructions/            # 可选：项目级生成提示
├── sources/                 # 需要自行整理内容的资料仓库（子模块）
├── vendor/                  # 外部现成 skills 来源（子模块）
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

## 仓库维护命令

```bash
pnpm start:init
pnpm start:sync
pnpm start:check
pnpm start:cleanup
```

## 其他电脑安装与更新

```bash
# 全量安装
npx skills add snailuu/skill --skill '*'

# 增量安装（指定技能）
npx skills add snailuu/skill --skill git-exclude

# 检查并更新已安装技能
npx skills check
npx skills update
```

## 扩展方式

1. 在 `meta.ts` 的 `submodules` 增加你要跟踪的资料仓库。
2. 在 `meta.ts` 的 `vendors` 增加外部技能映射。
3. 执行 `pnpm start:init && pnpm start:sync` 完成拉取与同步。
