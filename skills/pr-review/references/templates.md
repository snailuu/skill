# PR Review 输出模板与话术

## 输出结构

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

## 评论分类

| 类型 | 说明 |
|------|------|
| 逻辑错误 | 可能导致 bug 的问题 |
| 代码质量 | 可读性、结构、命名 |
| 性能 | 性能相关建议 |
| 安全 | 安全风险 |
| 文档 | 注释、文档缺失 |
| 认可 | Reviewer 点赞的内容（可跳过） |
| 疑问 | Reviewer 提问，需要回复或澄清 |

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
