---
name: plan-writer
description: Plan 模式下智能分批写入计划文件，避免单次写入过大导致失败
version: 1.0.0
author: Claude Code Assistant
allowed-tools: Write, Edit, Read, Bash
---

# Plan 模式智能写入技能

## 重要：工具调用规则

**必须直接使用 Bash 工具执行 shell 命令，绝对不要使用 Task 工具来执行命令。**
- 所有 shell 命令通过 Bash 工具直接执行
- 不要将 Bash 作为 Task 的 subagent_type
- 不要使用 Task 工具来委托执行 shell 命令

## 触发条件

当在 Plan 模式下需要写入计划文件时自动触发，或用户明确要求：
- "写入计划"、"保存计划"、"分批写入"
- "plan 写入失败"、"计划文件太大"
- 检测到 "Error writing file" 错误

## 问题背景

Plan 模式下一次性写入大量内容会导致失败，原因：
1. Context Window 限制
2. 单次写入大小限制（建议 ≤30KB）
3. 计划文件本身过大

## 解决方案

### 策略 1：智能分段写入（推荐）

将计划按逻辑章节分批写入到同一个文件：

1. **首次写入**：创建文件并写入前几个章节
2. **追加写入**：使用 Edit 工具追加后续章节
3. **验证完整性**：确保所有内容都已写入

### 策略 2：多文件分割

如果单个文件仍然过大，分割成多个文件：

1. **按阶段分割**：`plan-phase-1.md`, `plan-phase-2.md`
2. **按模块分割**：`plan-backend.md`, `plan-frontend.md`
3. **创建索引**：`plan-index.md` 链接所有子计划

## 执行步骤

### 步骤 1：分析计划内容

```bash
# 估算内容大小（字符数）
echo "计划内容" | wc -c
```

判断策略：
- < 30KB：直接写入
- 30KB - 100KB：分段写入
- > 100KB：多文件分割

### 步骤 2：分段写入实现

#### 2.1 首次写入（前 1/3 内容）

```markdown
# 项目迁移计划

## 概述
[项目背景和目标]

## 第一阶段：准备工作
[详细步骤]

## 第二阶段：数据迁移
[详细步骤]
```

#### 2.2 追加写入（中间 1/3）

使用 Edit 工具在文件末尾追加：

```markdown
## 第三阶段：API 更新
[详细步骤]

## 第四阶段：前端集成
[详细步骤]
```

#### 2.3 最终追加（最后 1/3）

```markdown
## 第五阶段：测试验证
[详细步骤]

## 第六阶段：上线部署
[详细步骤]

## 风险评估
[风险列表]
```

### 步骤 3：多文件分割实现

如果需要分割成多个文件：

#### 3.1 创建索引文件

```markdown
# 项目迁移计划索引

## 计划概述
[总体说明]

## 计划文件

1. [第一阶段：准备工作](./plan-phase-1.md)
2. [第二阶段：数据迁移](./plan-phase-2.md)
3. [第三阶段：API 更新](./plan-phase-3.md)
4. [第四阶段：前端集成](./plan-phase-4.md)
5. [第五阶段：测试验证](./plan-phase-5.md)

## 执行顺序

按照上述阶段顺序依次执行，每个阶段完成后进行验证。
```

#### 3.2 创建各阶段文件

每个文件独立保存一个阶段的详细计划。

### 步骤 4：验证写入结果

```bash
# 检查文件是否创建成功
ls -lh .claude/plans/

# 查看文件大小
du -h .claude/plans/*.md

# 验证内容完整性（检查章节数）
grep "^## " .claude/plans/plan.md | wc -l
```

## 分段策略

### 按内容大小分段

```
总内容 < 30KB:
  └─ 直接写入

总内容 30KB - 100KB:
  ├─ 第一次写入: 0 - 30KB
  ├─ 第二次追加: 30KB - 60KB
  └─ 第三次追加: 60KB - 100KB

总内容 > 100KB:
  ├─ plan-index.md (索引)
  ├─ plan-phase-1.md (< 50KB)
  ├─ plan-phase-2.md (< 50KB)
  └─ plan-phase-3.md (< 50KB)
```

### 按逻辑章节分段

优先在以下位置分段：
1. `## ` 二级标题（主要章节）
2. `### ` 三级标题（次要章节）
3. 空行较多的位置

**不要在以下位置分段：**
- 代码块中间
- 列表中间
- 表格中间

## 输出格式

### 成功输出

```
✅ 计划写入完成

文件信息：
  📄 .claude/plans/plan.md (45.2 KB)

写入统计：
  - 第 1 批：章节 1-3 (28.5 KB)
  - 第 2 批：章节 4-6 (16.7 KB)

验证结果：
  ✓ 所有 6 个章节已写入
  ✓ 文件完整性检查通过
```

### 多文件输出

```
✅ 计划分割完成

文件列表：
  📋 .claude/plans/plan-index.md (2.3 KB)
  📄 .claude/plans/plan-phase-1.md (42.1 KB)
  📄 .claude/plans/plan-phase-2.md (38.7 KB)
  📄 .claude/plans/plan-phase-3.md (35.9 KB)

总大小：119.0 KB (分 3 个文件)

查看计划：
  cat .claude/plans/plan-index.md
```

## 错误处理

### 写入失败

如果写入仍然失败：

1. **进一步减小分段大小**：从 30KB 降到 20KB
2. **简化计划内容**：移除不必要的详细说明
3. **使用更多文件**：每个文件只包含 1-2 个主要章节

### Context 不足

如果提示 context 不足：

```bash
# 使用 compact 命令清理上下文
/compact focus on writing the plan file
```

## 最佳实践

### ✅ 推荐做法

1. **预估大小**：写入前先估算内容大小
2. **逐步写入**：先写核心内容，再补充细节
3. **及时验证**：每次写入后验证文件内容
4. **保持结构**：确保 Markdown 格式正确

### ❌ 避免做法

1. **一次性写入超大内容**：超过 30KB 必须分批
2. **在代码块中间分段**：会破坏格式
3. **忽略验证**：可能导致内容不完整
4. **过度分割**：太多小文件反而难以管理

## 示例场景

### 场景 1：中等大小计划（50KB）

```
用户：写入迁移计划

AI 执行：
1. 分析内容：约 50KB，需要分 2 批
2. 第一批：写入前 3 个章节（25KB）
3. 第二批：追加后 3 个章节（25KB）
4. 验证：检查所有章节完整
```

### 场景 2：大型计划（150KB）

```
用户：保存重构计划

AI 执行：
1. 分析内容：约 150KB，需要分 3 个文件
2. 创建索引文件：plan-index.md
3. 创建阶段文件：
   - plan-phase-1.md (准备阶段)
   - plan-phase-2.md (实施阶段)
   - plan-phase-3.md (验证阶段)
4. 验证：检查所有文件创建成功
```

## 技术细节

### 内容分割算法

```python
def split_content(content: str, chunk_size: int = 30000) -> list[str]:
    """
    按章节智能分割内容
    """
    chunks = []
    current_chunk = ""

    # 按二级标题分割
    sections = content.split("\n## ")

    for i, section in enumerate(sections):
        # 恢复标题格式
        if i > 0:
            section = "\n## " + section

        # 如果当前块 + 新章节超过限制
        if len(current_chunk) + len(section) > chunk_size:
            if current_chunk:
                chunks.append(current_chunk)
            current_chunk = section
        else:
            current_chunk += section

    # 添加最后一块
    if current_chunk:
        chunks.append(current_chunk)

    return chunks
```

### 追加写入方法

使用 Edit 工具在文件末尾追加：

```python
# 读取现有内容
existing_content = read_file("plan.md")

# 追加新内容
new_content = existing_content + "\n\n" + additional_content

# 使用 Edit 工具替换
edit_file(
    file_path="plan.md",
    old_string=existing_content,
    new_string=new_content
)
```

## 配置建议

在 `.claude/settings.json` 中添加：

```json
{
  "env": {
    "PLAN_CHUNK_SIZE": "30000",
    "PLAN_MAX_FILE_SIZE": "50000"
  }
}
```

## 总结

这个技能通过智能分批写入解决了 Plan 模式下的文件写入问题：

- **自动检测**：根据内容大小选择策略
- **分批写入**：避免单次写入过大
- **多文件支持**：处理超大计划
- **完整性验证**：确保内容正确写入

关键是**分而治之**，将大任务分解为多个小的、可管理的写入操作。
