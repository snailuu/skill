# Git Exclude 使用指南

## 常见使用场景

### 场景 1：忽略 IDE 配置文件

```bash
echo ".vscode/" >> .git/info/exclude
git check-ignore -v .vscode/settings.json
```

### 场景 2：忽略本地测试文件

```bash
echo "*.local.*" >> .git/info/exclude
git check-ignore -v config.local.json
```

### 场景 3：忽略临时调试文件

```bash
cat >> .git/info/exclude << 'EOF'
debug.log
temp/
EOF
git check-ignore -v debug.log temp/test.txt
```

## 注意事项

### 路径格式
- 相对于仓库根目录的路径
- 文件夹路径建议以 `/` 结尾（如 `logs/`）
- 支持 gitignore 的所有模式语法

### 已跟踪文件
- 忽略规则不影响已跟踪的文件
- 需要先 `git rm --cached` 停止跟踪
- 停止跟踪会在下次提交时从仓库删除文件

### 规则优先级
- `.git/info/exclude` 优先级低于 `.gitignore`
- 如果 `.gitignore` 已忽略，无需重复添加到 exclude
- 如果 `.gitignore` 强制包含（`!pattern`），exclude 无法覆盖

### 团队协作
- 本地忽略规则不会同步给其他协作者
- 如需团队共享，应修改 `.gitignore`

### 规则管理
- `.git/info/exclude` 文件可以手动编辑
- 建议添加注释标记添加时间和原因
- 定期清理不再需要的规则

## 故障排查

### 规则不生效

```bash
# 1. 验证规则语法
git check-ignore -v file.txt

# 2. 检查文件是否已被跟踪
git ls-files file.txt

# 3. 查看 exclude 文件内容
cat .git/info/exclude
```

解决方案：
- 如果文件已跟踪，需要先 `git rm --cached`
- 检查规则语法是否正确（参考 gitignore 语法）
- 确认路径相对于仓库根目录

### .git/info/exclude 文件不存在

```bash
mkdir -p .git/info
touch .git/info/exclude
```

### 误添加了错误的规则

使用 Edit 工具编辑 `.git/info/exclude` 文件删除错误规则。

## 相关命令参考

```bash
# 查看当前所有忽略规则
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

### 基础使用

```
用户：帮我忽略 config.local.json 文件

助手：
已将 config.local.json 添加到本地忽略列表

验证结果：
  config.local.json - 已忽略

该规则仅在本地生效，不会影响其他协作者。
```

### 批量忽略

```
用户：忽略所有 .log 文件和 temp 文件夹

助手：
已将以下规则添加到本地忽略列表：

  - *.log
  - temp/

验证结果：
  debug.log - 已忽略 (匹配 *.log)
  error.log - 已忽略 (匹配 *.log)
  temp/ - 已忽略
```

### 处理已跟踪文件

```
用户：忽略 database.sqlite

助手：
警告：database.sqlite 已被 Git 跟踪

已添加忽略规则，但文件仍会继续被跟踪。
是否要停止跟踪该文件？

[用户选择：是]

已停止跟踪 database.sqlite
注意：下次提交时该文件会从仓库中删除（本地文件保留）
建议在提交前通知团队成员。
```

### 非 Git 仓库

```
用户：忽略 config.json

助手：
当前目录不是 Git 仓库，是否需要初始化？

[用户选择：是]

已初始化 Git 仓库
已将 config.json 添加到本地忽略列表
```

## 最佳实践

1. **明确用途**：仅用于个人临时需求，团队规则应使用 .gitignore
2. **添加注释**：在 exclude 文件中添加注释说明规则用途
3. **定期清理**：删除不再需要的规则，保持文件整洁
4. **谨慎处理已跟踪文件**：停止跟踪前确认不会影响团队
5. **验证规则**：添加后使用 `git check-ignore` 验证是否生效
