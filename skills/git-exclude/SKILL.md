---
name: git-exclude
description: 将文件/文件夹添加到本地 git 忽略区(.git/info/exclude)，不修改 .gitignore 文件
version: 1.0.0
author: Claude Code Assistant
allowed-tools: Bash, Read, Edit, AskUserQuestion
---

# Git 本地忽略技能

## 触发条件

当用户输入包含以下关键词时触发：
- "忽略文件"、"本地忽略"、"git exclude"
- "不提交"、"排除文件"、"exclude"
- "添加到忽略"、"忽略这个文件"
- 明确提到不想修改 .gitignore 的忽略需求

## 功能说明

本技能将文件/文件夹添加到 `.git/info/exclude` 文件中，实现本地忽略而不影响 `.gitignore`。

**与 .gitignore 的区别**：
- `.gitignore`：会被提交到仓库，所有协作者共享
- `.git/info/exclude`：仅本地生效，不会被提交，适合个人临时忽略需求

**适用场景**：
- 个人开发环境配置文件（IDE 配置、本地测试文件等）
- 临时测试文件或调试文件
- 不想影响团队其他成员的个人忽略规则

## 执行步骤

### 1. 检查 Git 仓库状态

```bash
git rev-parse --git-dir 2>/dev/null
```

**判断逻辑**：
- 如果命令成功且返回 `.git` 或绝对路径 → 是 git 仓库
- 如果命令失败 → 不是 git 仓库，执行步骤 2

### 2. 处理非 Git 仓库情况

如果当前目录不是 git 仓库，使用 `AskUserQuestion` 工具询问用户：

```
当前目录不是 Git 仓库，是否需要初始化？

选项：
1. 是，初始化 Git 仓库 (git init)
2. 否，取消操作
```

**用户选择"是"**：
```bash
git init
```

**用户选择"否"**：
提示用户操作已取消，并说明需要在 git 仓库中才能使用本地忽略功能。

### 3. 解析用户指定的忽略模式

支持的输入格式：
- 单个文件：`config.local.json`
- 多个文件：`file1.txt file2.log file3.tmp`
- 文件夹：`temp/` 或 `logs/`
- 通配符：`*.log`、`test-*.js`、`**/*.tmp`
- 相对路径：`src/debug/`、`./local-config.json`

**规范化处理**：
- 去除路径开头的 `./`
- 文件夹路径确保以 `/` 结尾
- 保留通配符原样

### 4. 检查 .git/info/exclude 文件

```bash
# 检查文件是否存在
test -f .git/info/exclude && echo "exists" || echo "not exists"

# 如果存在，读取当前内容
cat .git/info/exclude
```

**注意事项**：
- 文件通常已存在（git init 会创建）
- 如果不存在，后续添加时会自动创建

### 5. 添加忽略规则

**检查重复**：
在添加前，检查规则是否已存在：

```bash
grep -Fx "pattern" .git/info/exclude
```

- 如果已存在，提示用户该规则已在忽略列表中
- 如果不存在，继续添加

**添加规则**：

```bash
# 添加单个规则
echo "pattern" >> .git/info/exclude

# 添加多个规则（推荐方式）
cat >> .git/info/exclude << 'EOF'
pattern1
pattern2
pattern3
EOF
```

**添加注释**（可选）：
```bash
# 添加时间戳注释，便于后续管理
echo "" >> .git/info/exclude
echo "# Added by Claude Code on $(date '+%Y-%m-%d %H:%M:%S')" >> .git/info/exclude
echo "pattern" >> .git/info/exclude
```

### 6. 验证忽略规则

使用 `git check-ignore` 验证规则是否生效：

```bash
# 验证单个文件
git check-ignore -v file.txt

# 验证多个文件
git check-ignore -v file1.txt file2.log
```

**输出解释**：
- 如果文件被忽略，输出格式：`.git/info/exclude:行号:模式    文件路径`
- 如果文件未被忽略，无输出（退出码非 0）

### 7. 处理已跟踪文件

**重要提示**：如果文件已被 git 跟踪（已提交过），添加忽略规则不会自动停止跟踪。

检查文件是否已被跟踪：
```bash
git ls-files file.txt
```

如果文件已被跟踪，询问用户是否要停止跟踪：

```
文件 'file.txt' 已被 Git 跟踪，添加忽略规则后仍会继续跟踪。

是否要停止跟踪该文件？

选项：
1. 是，停止跟踪但保留本地文件 (git rm --cached)
2. 否，保持跟踪状态
```

**用户选择"是"**：
```bash
git rm --cached file.txt
```

**警告**：停止跟踪后，下次提交时该文件会从仓库中删除（但本地文件保留）。

## 输出格式

### 成功添加

```
✅ 已将以下规则添加到本地忽略列表 (.git/info/exclude)：

  • config.local.json
  • *.log
  • temp/

验证结果：
  ✓ config.local.json - 已忽略
  ✓ test.log - 已忽略 (匹配 *.log)
  ✓ temp/ - 已忽略

📝 提示：
- 这些规则仅在本地生效，不会影响其他协作者
- 如需团队共享忽略规则，请修改 .gitignore 文件
```

### 规则已存在

```
ℹ️ 以下规则已在本地忽略列表中：

  • config.local.json (已存在)
  • *.log (已存在)

无需重复添加。
```

### 已跟踪文件警告

```
⚠️ 警告：以下文件已被 Git 跟踪

  • config.local.json (已提交)

已添加忽略规则，但文件仍会继续被跟踪。
如需停止跟踪，请运行：

  git rm --cached config.local.json

注意：停止跟踪后，下次提交时该文件会从仓库中删除（本地文件保留）。
```

## 常见使用场景

### 场景 1：忽略 IDE 配置文件

```
用户：忽略 .vscode 文件夹
```

执行：
```bash
echo ".vscode/" >> .git/info/exclude
git check-ignore -v .vscode/settings.json
```

### 场景 2：忽略本地测试文件

```
用户：忽略所有 .local.* 文件
```

执行：
```bash
echo "*.local.*" >> .git/info/exclude
git check-ignore -v config.local.json
```

### 场景 3：忽略临时调试文件

```
用户：忽略 debug.log 和 temp 文件夹
```

执行：
```bash
cat >> .git/info/exclude << 'EOF'
debug.log
temp/
EOF
git check-ignore -v debug.log temp/test.txt
```

## 注意事项

### 1. 路径格式
- 相对于仓库根目录的路径
- 文件夹路径建议以 `/` 结尾（如 `logs/`）
- 支持 gitignore 的所有模式语法

### 2. 已跟踪文件
- 忽略规则不影响已跟踪的文件
- 需要先 `git rm --cached` 停止跟踪
- 停止跟踪会在下次提交时从仓库删除文件

### 3. 规则优先级
- `.git/info/exclude` 优先级低于 `.gitignore`
- 如果 `.gitignore` 已忽略，无需重复添加到 exclude
- 如果 `.gitignore` 强制包含（`!pattern`），exclude 无法覆盖

### 4. 团队协作
- 本地忽略规则不会同步给其他协作者
- 如需团队共享，应修改 `.gitignore`
- 适合个人临时需求，不适合项目级规则

### 5. 规则管理
- `.git/info/exclude` 文件可以手动编辑
- 建议添加注释标记添加时间和原因
- 定期清理不再需要的规则

## 故障排查

### 问题 1：规则不生效

**检查步骤**：
```bash
# 1. 验证规则语法
git check-ignore -v file.txt

# 2. 检查文件是否已被跟踪
git ls-files file.txt

# 3. 查看 exclude 文件内容
cat .git/info/exclude
```

**解决方案**：
- 如果文件已跟踪，需要先 `git rm --cached`
- 检查规则语法是否正确（参考 gitignore 语法）
- 确认路径相对于仓库根目录

### 问题 2：.git/info/exclude 文件不存在

**解决方案**：
```bash
# 手动创建文件
mkdir -p .git/info
touch .git/info/exclude
```

### 问题 3：误添加了错误的规则

**解决方案**：
```bash
# 手动编辑文件删除错误规则
vim .git/info/exclude

# 或使用 sed 删除特定行
sed -i '/pattern/d' .git/info/exclude
```

## 相关命令参考

```bash
# 查看当前所有忽略规则（包括 .gitignore 和 exclude）
git status --ignored

# 查看文件被哪个规则忽略
git check-ignore -v file.txt

# 查看所有被忽略的文件
git ls-files --others --ignored --exclude-standard

# 停止跟踪文件但保留本地文件
git rm --cached file.txt

# 停止跟踪文件夹
git rm -r --cached folder/

# 查看已跟踪的文件列表
git ls-files
```

## 示例对话

### 示例 1：基础使用

```
用户：帮我忽略 config.local.json 文件

助手：
✅ 已将 config.local.json 添加到本地忽略列表

验证结果：
  ✓ config.local.json - 已忽略

📝 该规则仅在本地生效，不会影响其他协作者。
```

### 示例 2：批量忽略

```
用户：忽略所有 .log 文件和 temp 文件夹

助手：
✅ 已将以下规则添加到本地忽略列表：

  • *.log
  • temp/

验证结果：
  ✓ debug.log - 已忽略 (匹配 *.log)
  ✓ error.log - 已忽略 (匹配 *.log)
  ✓ temp/ - 已忽略
```

### 示例 3：处理已跟踪文件

```
用户：忽略 database.sqlite

助手：
⚠️ 警告：database.sqlite 已被 Git 跟踪

已添加忽略规则，但文件仍会继续被跟踪。
是否要停止跟踪该文件？

[用户选择：是]

✅ 已停止跟踪 database.sqlite

⚠️ 注意：下次提交时该文件会从仓库中删除（本地文件保留）
建议在提交前通知团队成员。
```

### 示例 4：非 Git 仓库

```
用户：忽略 config.json

助手：
❌ 当前目录不是 Git 仓库

是否需要初始化 Git 仓库？

[用户选择：是]

✅ 已初始化 Git 仓库
✅ 已将 config.json 添加到本地忽略列表
```

## 最佳实践

1. **明确用途**：仅用于个人临时需求，团队规则应使用 .gitignore
2. **添加注释**：在 exclude 文件中添加注释说明规则用途
3. **定期清理**：删除不再需要的规则，保持文件整洁
4. **谨慎处理已跟踪文件**：停止跟踪前确认不会影响团队
5. **验证规则**：添加后使用 `git check-ignore` 验证是否生效
