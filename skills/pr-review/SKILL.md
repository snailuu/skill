---
name: pr-review
description: 查看 PR/MR 评论并给出解决建议。当用户提到"查看 PR 评论"、"PR xxx 的评论"、"帮我看 PR"、"review PR"、"MR 评论"、"merge request 评论"等关键词时触发。支持 GitHub 和 GitLab，自动检测平台，优先使用本地 CLI 工具（gh/glab），fallback 到 API。
version: 1.0.0
author: snailuu
allowed-tools: Bash, WebFetch, AskUserQuestion
---

# PR/MR 评论查看与建议技能

## 重要：工具调用规则

**必须直接使用 Bash 工具执行 shell 命令，绝对不要使用 Task 工具来执行命令。**

## 执行流程

### 第一步：解析 PR/MR 来源

**从用户输入中提取信息：**

1. **完整 URL** → 直接解析 owner/repo/number
2. **纯数字**（如 "PR 123"） → 结合当前 git 仓库推断，若无仓库则追问
3. **模糊引用** → 追问用户具体 PR 号或 URL

### 第二步：环境检测

```bash
git rev-parse --is-inside-work-tree 2>/dev/null
git remote -v 2>/dev/null
git remote get-url origin 2>/dev/null
```

| 情况 | 处理方式 |
|------|----------|
| 无 git 仓库 | 追问 repo（格式：`owner/repo` 或完整 URL） |
| 1 个 remote | 直接使用 |
| 多个 remote | 列出让用户选择 |
| 非 GitHub/GitLab | 提示暂不支持 |

### 第三步：识别平台

- `github.com` → GitHub
- `gitlab.com` → GitLab SaaS
- `*.github.com` → GitHub Enterprise（询问 API endpoint）
- `*.gitlab.*` → GitLab Self-hosted（询问实例 URL）
- 其他 → 追问用户平台类型

### 第四步：获取评论数据

#### GitHub

**优先：`gh` CLI**
```bash
gh auth status 2>/dev/null
gh pr view <number> --repo <owner/repo> --json title,body,state,isDraft,comments,reviews,reviewRequests
gh api repos/<owner>/<repo>/pulls/<number>/comments
```

**Fallback：REST API（WebFetch）**
```
GET https://api.github.com/repos/{owner}/{repo}/pulls/{number}
GET https://api.github.com/repos/{owner}/{repo}/pulls/{number}/comments
GET https://api.github.com/repos/{owner}/{repo}/issues/{number}/comments
```

#### GitLab

**优先：`glab` CLI**
```bash
glab auth status 2>/dev/null
glab mr view <number> --repo <owner/repo>
glab api projects/<url-encoded-path>/merge_requests/<iid>/notes
```

**Fallback：REST API（WebFetch）**
```
GET https://gitlab.com/api/v4/projects/{id}/merge_requests/{iid}
GET https://gitlab.com/api/v4/projects/{id}/merge_requests/{iid}/notes
GET https://gitlab.com/api/v4/projects/{id}/merge_requests/{iid}/discussions
```

若为私有仓库且无 CLI 工具，提示用户提供 PAT。

### 第五步：数据处理

- **过滤 Bot 评论**：跳过用户名包含 `bot`、`[bot]`、`codecov`、`dependabot`、`renovate` 的评论
- **处理分页**：最多获取 3 页（90 条），超出时提示用户
- **评论状态**（GitLab）：`resolved: true` → 已解决，`resolved: false` → 待处理

### 第六步：分析并输出建议

按 PR 标题、状态、平台分组展示评论。对每条待处理评论给出问题类型和解决建议。

输出模板、评论分类和追问话术见 `references/templates.md`。

**特殊状态处理：**
- PR 无评论 → 询问是否分析 diff 本身
- Draft PR → 提示评论可能不完整
- 已关闭/合并 → 仍正常分析历史评论

## 已知限制

- 暂不支持 Bitbucket、Gitea、Forgejo
- Self-hosted GitHub Enterprise 需要用户提供 API endpoint
- 评论超过 90 条时只分析前 90 条
- GitLab Self-hosted 需要用户提供实例 URL
