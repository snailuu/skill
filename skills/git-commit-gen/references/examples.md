# Git Commit 示例与执行指南

## 示例输出

```
检测到以下变更：

修改的文件：
  M src/pages/chat/components/message-content.tsx
  M src/providers/rag-chat-provider.ts
  M src/hooks/use-chat.ts

变更统计：
  3 files changed, 45 insertions(+), 23 deletions(-)

---

推荐的 Commit Message：

1. fix(聊天对话): 修复消息引用在流式响应时无法点击
   理由：主要修改集中在消息组件和聊天 provider，核心问题是修复交互 bug

2. refactor(聊天对话): 优化消息引用组件渲染机制
   理由：从实现角度看更像是重构了渲染逻辑

3. fix(消息组件): 解决流式渲染时的引用源闭包问题
   理由：更技术化的描述，突出了具体的技术问题

---

详细描述（可选）：

fix(聊天对话): 修复消息引用在流式响应时无法点击

- 使用 key 属性强制 SourcesComponent 重新渲染
- 解决 React 闭包导致的 sources 状态不同步问题
- 清理所有调试用的 console.log 语句

---

是否需要我帮你执行提交？(可以选择上面任意一个 commit message)
```

## 执行提交

如果用户确认要执行提交，按以下步骤操作：

### 1. 暂存文件

```bash
# 优先使用具体文件名，避免使用 git add -A 或 git add .
git add <file1> <file2> <file3>
```

### 2. 执行提交

使用 HEREDOC 格式传递 commit message：

```bash
git commit -m "$(cat <<'EOF'
fix(聊天对话): 修复消息引用在流式响应时无法点击

- 使用 key 属性强制 SourcesComponent 重新渲染
- 解决 React 闭包导致的 sources 状态不同步问题
- 清理所有调试用的 console.log 语句
EOF
)"
```

### 3. 验证提交

```bash
git log -1 --oneline
git status
```

## 安全规则

- **禁止使用 `--no-verify`** 跳过 hooks，除非用户明确要求
- **禁止使用 `git add -A` 或 `git add .`**，优先指定具体文件
- **不要提交敏感文件**（.env、credentials.json 等）
- 如果 pre-commit hook 失败，修复问题后创建**新的 commit**，不要使用 `--amend`
