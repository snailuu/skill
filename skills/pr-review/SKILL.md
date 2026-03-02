---
name: pr-review
description: 查看 PR/MR 评论并给出解决建议。当用户提到"查看 PR 评论"、"PR xxx 的评论"、"帮我看 PR"、"review PR"、"MR 评论"、"merge request 评论"等关键词时触发。支持 GitHub 和 GitLab，自动检测平台，优先使用本地 CLI 工具（gh/glab），fallback 到 API。
version: 1.0.0
author: Claude Code Assistant
allowed-tools: Bash, WebFetch, AskUserQuestion
---

# PR/MR 评论查看与建议技能

## 重要：工具调用规则

**必须直接使用 Bash 工具执行 shell 命令，绝对不要使用 Task 工具来执行命令。**

## 触发条件

当用户输入包含以下关键词时触发：
- "查看 PR"、"PR 评论"、"帮我看 PR"、"PR 的评论"
- "review PR"、"PR review"、"PR 建议"、"PR 反馈"
- "MR 评论"、"merge request"、"查看 MR"
- "帮我处理评论"、"评论怎么回复"、"reviewer 说"

## 执行流程

### 第一步：解析 PR/MR 来源

**从用户输入中提取信息：**

1. **完整 URL**（最理想）
   - `https://github.com/owner/repo/pull/123` → 直接解析
   - `https://gitlab.com/owner/repo/-/merge_requests/123` → 直接解析
   - 自定义域名 URL → 识别平台后解析

2. **纯数字**（如 "PR 123"）
   - 需要结合当前 git 仓库信息推断 owner/repo
   - 若无 git 仓库，追问用户

3. **模糊引用**（如 "那个 PR"、"刚才的"）
   - 直接追问用户具体 PR 号或 URL

### 第二步：环境检测

按以下顺序执行检测：

```bash
# 1. 检测是否在 git 仓库中
git rev-parse --is-inside-work-tree 2>/dev/null

# 2. 获取所有 remote
git remote -v 2>/dev/null

# 3. 获取 origin URL（优先）
git remote get-url origin 2>/dev/null
```

**处理 remote 情况：**

| 情况 | 处理方式 |
|------|----------|
| 无 git 仓库 | 提示用户，追问 repo（格式：`owner/repo` 或完整 URL） |
| 1 个 remote | 直接使用 |
| 多个 remote | 列出所有 remote，让用户选择 |
| remote 非 GitHub/GitLab | 提示暂不支持，请提供完整 URL |

### 第三步：识别平台

从 remote URL 或用户提供的 URL 中识别平台：

```
github.com          → GitHub
gitlab.com          → GitLab SaaS
*.github.com        → GitHub Enterprise（询问 API endpoint）
*.gitlab.*          → GitLab Self-hosted（询问实例 URL）
其他自定义域名      → 追问用户平台类型
```

**解析 remote URL 格式：**
- SSH：`git@github.com:owner/repo.git` → 提取 `github.com`、`owner`、`repo`
- HTTPS：`https://github.com/owner/repo.git` → 提取 host、`owner`、`repo`

### 第四步：获取评论数据

#### GitHub

**优先：使用 `gh` CLI**
```bash
# 检测 gh 是否可用且已登录
gh auth status 2>/dev/null

# 获取 PR 信息 + 评论
gh pr view <number> --repo <owner/repo> --json title,body,state,isDraft,comments,reviews,reviewRequests

# 获取 inline 代码评论
gh api repos/<owner>/<repo>/pulls/<number>/comments
```

**Fallback：GitHub REST API（WebFetch）**
```
# PR 基本信息
GET https://api.github.com/repos/{owner}/{repo}/pulls/{number}

# Inline 代码评论（review comments）
GET https://api.github.com/repos/{owner}/{repo}/pulls/{number}/comments

# 整体评论（issue comments）
GET https://api.github.com/repos/{owner}/{repo}/issues/{number}/comments

# Review 意见
GET https://api.github.com/repos/{owner}/{repo}/pulls/{number}/reviews
```

若为私有仓库且无 `gh`，提示用户提供 GitHub PAT，并说明如何设置：
`Authorization: Bearer <token>` header

#### GitLab

**优先：使用 `glab` CLI**
```bash
# 检测 glab 是否可用且已登录
glab auth status 2>/dev/null

# 获取 MR 信息
glab mr view <number> --repo <owner/repo>

# 获取评论（notes）
glab api projects/<url-encoded-path>/merge_requests/<iid>/notes
```

**Fallback：GitLab REST API（WebFetch）**
```
# MR 基本信息
GET https://gitlab.com/api/v4/projects/{id}/merge_requests/{iid}

# 评论（notes，包含 inline 和普通）
GET https://gitlab.com/api/v4/projects/{id}/merge_requests/{iid}/notes

# Discussion threads
GET https://gitlab.com/api/v4/projects/{id}/merge_requests/{iid}/discussions
```

项目 ID 获取方式：
```
GET https://gitlab.com/api/v4/projects/{url-encoded-owner%2Frepo}
```

若为私有仓库且无 `glab`，提示用户提供 GitLab PAT，header：`PRIVATE-TOKEN: <token>`

**Self-hosted GitLab：** 将 `gitlab.com` 替换为实例 URL。

### 第五步：数据处理

**过滤 Bot 评论**

跳过以下类型的评论，或单独分组展示：
- 用户名包含 `bot`、`[bot]`、`ci`、`codecov`、`dependabot`、`renovate`
- 内容为自动生成格式（CI 报告、覆盖率报告等）

**处理分页**

API 默认每页 30 条，若响应包含 `Link` header 或 `x-next-page` 字段，继续获取下一页，最多获取 3 页（90 条评论），超出时提示用户。

**识别评论状态（GitLab）**

- `resolved: true` 的 discussion → 标记为已解决，可折叠展示
- `resolved: false` → 待处理，重点展示

### 第六步：分析并输出建议

#### 输出结构

```
## PR #<number>：<标题>

**状态**：Open / Closed / Merged | Draft（若是草稿）
**平台**：GitHub / GitLab

---

### 待处理评论（N 条）

#### 1. [<文件路径>:<行号>]（若有）
**Reviewer**：@username
**评论**：<评论原文>

**建议**：
- 问题类型：代码质量 / 逻辑错误 / 命名规范 / 性能 / 安全 / 其他
- 解决方向：<具体建议>
- 参考做法：<代码示例（若适用）>

---

### 已解决评论（N 条，可略过）
...

### Bot / 自动化评论（N 条，已过滤）
...
```

#### 评论分类

| 类型 | 说明 |
|------|------|
| 🐛 逻辑错误 | 可能导致 bug 的问题 |
| 🎨 代码质量 | 可读性、结构、命名 |
| ⚡ 性能 | 性能相关建议 |
| 🔒 安全 | 安全风险 |
| 📝 文档 | 注释、文档缺失 |
| ✅ 认可 | Reviewer 点赞的内容（可跳过） |
| ❓ 疑问 | Reviewer 提问，需要回复或澄清 |

#### 特殊状态提示

- **PR 无评论**：提示当前无评论，询问是否需要分析 diff 本身
- **Draft PR**：提示这是草稿 PR，评论可能不完整
- **已关闭/合并的 PR**：提示状态，仍正常分析历史评论

## 追问话术模板

**无 git 仓库时：**
> 当前目录不在 git 仓库中，请提供 PR 链接或仓库信息（格式：`owner/repo`）。

**多个 remote 时：**
> 检测到多个远程仓库，请选择要查询的仓库：
> 1. origin → `https://github.com/xxx/repo`
> 2. upstream → `https://github.com/yyy/repo`

**需要 Token 时：**
> 该仓库为私有仓库且未检测到已登录的 CLI 工具，请提供 Personal Access Token（PAT）。
> - GitHub：需要 `repo` 权限
> - GitLab：需要 `read_api` 权限

**平台未知时：**
> 检测到非标准的远程仓库地址：`<url>`，请告知这是哪个平台（GitHub Enterprise / GitLab Self-hosted / 其他）？

## 已知限制

- 暂不支持 Bitbucket、Gitea、Forgejo
- Self-hosted GitHub Enterprise 需要用户提供 API endpoint
- 评论超过 90 条时只分析前 90 条
- GitLab Self-hosted 需要用户提供实例 URL
