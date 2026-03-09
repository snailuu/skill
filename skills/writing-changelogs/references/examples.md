# Writing Changelogs 示例参考

## 场景 1：已有发布 tag，整理 `Unreleased`

适用情况：
- 仓库已经有稳定的发布 tag
- 当前要把最近一次发布后的变更整理进 `## [Unreleased]`

推荐边界：

```bash
git tag --sort=-creatordate
git log --first-parent --format='%H%x09%s' v1.4.2..HEAD
git diff --name-status -M v1.4.2..HEAD
git diff --stat v1.4.2..HEAD
```

写法要点：
- 边界固定为 `最近发布 tag..HEAD`
- 候选项优先来自 `--first-parent`
- `docs`、`test`、`ci`、纯 `refactor` 默认不写
- 需要用 `diff` 证明条目确实影响用户

示例输出：

```md
## [Unreleased]

### Added
- 新增 `skills update` 子命令，支持批量检查并更新已安装技能。

### Changed
- 调整技能安装提示文案，减少首次安装时的交互歧义。

### Fixed
- 修复本地初始化时未正确识别自定义 skills 目录的问题。
```

---

## 场景 2：准备正式发版，但当前 tag 还没打

适用情况：
- 正在准备 `1.5.0` 或 `0.9.0` 的发布说明
- 当前版本 tag 还没创建，但上一个发布 tag 已存在

推荐边界：

```bash
git tag --sort=-creatordate
git log --first-parent --format='%H%x09%s' v1.4.2..HEAD
git diff --stat v1.4.2..HEAD
```

必须确认：
- 目标版本号
- 发布日期
- 本次是否只覆盖 `v1.4.2..HEAD`

示例输出：

```md
## [1.5.0] - 2026-03-09

### Added
- 增加技能安装后的自检命令，便于快速确认本地可用状态。

### Changed
- 优化技能来源索引结构，降低后续新增手写技能的维护成本。

### Fixed
- 修复技能检查流程中对缺失目录的错误提示不清晰的问题。
```

---

## 场景 3：仓库没有任何 tag，补第一版 `CHANGELOG.md`

适用情况：
- 仓库从未打过 tag
- 需要补第一版 changelog，或先建一个可继续维护的骨架

不要直接假设：
- 不要默认“从第一个 commit 开始”
- 不要默认版本号一定是 `1.0.0`

必须先确认：
- 起点提交
- 当前是首个正式版本，还是先建 `Unreleased`
- 版本号
- 发布日期
- 是否存在历史已发布但未打 tag 的版本

边界确认后再取数：

```bash
git log --first-parent --format='%H%x09%s' <start>..HEAD
git diff --name-status -M <start>..HEAD
git diff --stat <start>..HEAD
```

示例输出：

```md
## [0.1.0] - 2026-03-09

### Added
- 初始发布版本，提供技能清单管理与本地检查能力。
- 支持手写技能与外部技能来源并存的维护方式。

### Changed
- 统一技能仓库的目录组织方式，便于后续扩展与分发。
```

如果确认项未完成，最多输出：

```md
## [Unreleased]

### Added
- 待确认首个发布版本的边界与版本号后再补充。
```

---

## 场景 4：存在 `BREAKING CHANGE` 或显式破坏性调整

适用情况：
- commit 正文或 trailer 中存在 `BREAKING CHANGE:`
- `feat!:`、`fix!:`、移除旧接口、停止支持旧配置

推荐检查：

```bash
git log --first-parent --format='%H%n%s%n%b%n---' <range>
git diff --name-status -M <range>
git show --stat <sha>
```

写法要点：
- 不要把破坏性变更埋在普通 `Changed` 条目里
- 必须显式写出迁移影响
- 如果旧能力被删除，优先考虑 `Removed`
- 如果只是宣布未来移除，使用 `Deprecated`

示例输出：

```md
## [2.0.0] - 2026-03-09

### Changed
- 调整技能配置文件加载顺序，优先读取项目级配置再回退到全局配置。

### Removed
- 移除旧版 `skills sync` 兼容参数，现统一使用新的命令选项格式。

### Deprecated
- 标记旧版 vendor 映射写法为过时，将在后续版本中移除。
```

建议额外补一句迁移提示：

```md
- 升级前请检查自动化脚本中是否仍在使用旧版 `skills sync --legacy` 参数。
```

---

## 反例：不要这样写

```md
## [Unreleased]

- feat(cli): add update command
- docs: update readme
- refactor: cleanup meta
- 3f42a11 fix bug
```

问题：
- 直接照搬 commit title
- 混入 `docs`、纯 `refactor` 噪音
- 出现 SHA
- 完全没有 Keep a Changelog 分类
- 用户看不出哪些改动值得关注
