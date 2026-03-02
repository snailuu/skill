# Skill Writer Rules

**Version 1.1.0** — Claude Code Assistant

> Load this document in full when executing the skill-writer workflow.

---

## Table of Contents

0. [Information Architecture](#0-information-architecture) — **CRITICAL**
   - 0.1 [Three-Level Structure (L1/L2/L3)](#01-three-level-structure-l1l2l3)
1. [Description Writing](#1-description-writing) — **CRITICAL**
   - 1.1 [Include Trigger Keywords](#11-include-trigger-keywords-chinese--english)
   - 1.2 [Define Trigger Boundaries](#12-define-trigger-boundaries)
2. [Frontmatter](#2-frontmatter) — **HIGH**
   - 2.1 [Use Minimal allowed-tools](#21-use-minimal-allowed-tools)
3. [Content Structure](#3-content-structure) — **HIGH**
   - 3.1 [Write for AI Execution, Not Human Reading](#31-write-for-ai-execution-not-human-reading)
   - 3.2 [Pre-flight Environment Checks](#32-pre-flight-environment-checks)
   - 3.3 [Freedom-Specification Spectrum](#33-freedom-specification-spectrum)
4. [Robustness](#4-robustness) — **HIGH**
   - 4.1 [Design Fallbacks for External Tools](#41-design-fallbacks-for-external-tool-dependencies)
   - 4.2 [Make Operations Idempotent](#42-make-operations-idempotent)
   - 4.3 [Error Messages Must Include Resolution Steps](#43-error-messages-must-include-resolution-steps)
5. [Anti-patterns](#5-anti-patterns) — **CRITICAL**
   - 5.1 [Never Use Task Tool for Shell Commands](#51-never-use-task-tool-for-shell-commands)
   - 5.2 [Never Write Vague Aspirational Guidance](#52-never-write-vague-aspirational-guidance)
   - 5.3 [Never Put Trigger Conditions in Body](#53-never-put-trigger-conditions-in-body)
- [Appendix A: Quality Checklist](#appendix-a-quality-checklist)
- [Appendix B: Scoring Dimensions](#appendix-b-scoring-dimensions)
- [Appendix C: Skill File Template](#appendix-c-skill-file-template)

---

## 0. Information Architecture

**Impact: CRITICAL**

Every token in a skill costs context window space shared with the rest of the
session. Misplacing content at the wrong level wastes tokens on every invocation.

### 0.1 Three-Level Structure (L1/L2/L3)

**Impact: CRITICAL (wrong level = wasted tokens or missing information)**

| Level | Location | Always Loaded | Token Budget | Purpose |
|-------|----------|--------------|-------------|---------|
| **L1** | `description` field | Yes — always | ~100 words | Activation filter; determines if skill triggers |
| **L2** | SKILL.md body | On trigger | < 1500 words | Workflow instructions the agent executes |
| **L3** | `scripts/`, `references/` | On demand | Unlimited | Heavy references, templates, deterministic scripts |

**L1 is the activation gate.** Description determines everything about when the
skill fires. It loads on every Claude Code session for every request — keep it
precise and keyword-rich, never verbose.

**L2 is the workflow.** SKILL.md body contains imperative step-by-step
instructions. If it exceeds ~1500 words, move the excess to L3 references.

**L3 is unlimited storage.** Scripts and reference files only load when the
agent explicitly reads them. Use L3 for:
- Detailed rule sets (e.g., `AGENTS.md`)
- File templates (loaded by agent when writing output)
- Validation scripts (executed, zero token cost)
- Large reference tables or examples

**Incorrect (L3 content stuffed into L2):**

```markdown
# Skill Body  ← L2

## Skill File Template     ← this belongs in L3
---
name: ...
description: ...
...

## Quality Checklist       ← this belongs in L3
- [ ] description has keywords
- [ ] ...
```

**Correct (L2 references L3):**

```markdown
# Skill Body  ← L2

## Phase 3 — Present Draft
Use the template from AGENTS.md § Appendix C.   ← agent reads L3 on demand
```

---

## 1. Description Writing

**Impact: CRITICAL**

The `description` field is the only mechanism Claude Code uses to decide when
to auto-activate a skill. It is the highest-leverage field in any skill.

### 1.1 Include Trigger Keywords (Chinese + English)

**Impact: CRITICAL (without keywords, Claude Code cannot auto-activate the skill)**

Always include both Chinese and English keywords covering how real users phrase
requests.

**Incorrect (no keywords, too vague):**

```yaml
description: 生成 commit 信息的工具
```

**Correct (explicit keywords, both languages):**

```yaml
description: 根据 git diff 和 git log 自动生成符合 Conventional Commits 规范的中文
  commit message。当用户说"生成 commit"、"帮我写提交信息"、"commit message"、
  "git commit"、"提交信息"时触发。
```

Rules:
- Include 4–8 representative trigger phrases
- Cover Chinese and English variants of the same intent
- Use the exact phrasing users type, not formal descriptions

### 1.2 Define Trigger Boundaries

**Impact: HIGH (prevents false positives that disrupt unrelated workflows)**

Explicitly state what situations should NOT trigger the skill.

**Incorrect (no boundary):**

```yaml
description: 帮助用户处理 git 相关的任务，生成提交信息和标签说明。
```

**Correct (boundary defined):**

```yaml
description: 根据 git diff 自动生成 commit message。当用户说"生成 commit"、
  "写提交信息"时触发。不适用于：查看 git log、切换分支、合并冲突等通用 git 操作。
```

Rules:
- Add "不适用于" clause when the skill's domain overlaps with general capabilities
- List 2–3 concrete exclusion cases

---

## 2. Frontmatter

**Impact: HIGH**

### 2.1 Use Minimal allowed-tools Declaration

**Impact: HIGH (unnecessary tool declarations cause permission prompts and bloat)**

Declare only the tools the skill actually uses during execution.

**Incorrect:**

```yaml
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, Agent
```

**Correct:**

```yaml
allowed-tools: Bash, Read
```

Tool selection guide:

| Need | Tool |
|------|------|
| Read files | `Read`, `Glob`, `Grep` |
| Write/create files | `Write`, `Edit` |
| Run shell commands | `Bash` |
| Fetch web content | `WebFetch` |
| Search the web | `WebSearch` |
| Spawn subagents | `Agent` |

Rules:
- Never declare `Agent` unless the skill explicitly spawns subagents

---

## 3. Content Structure

**Impact: HIGH**

### 3.1 Write for AI Execution, Not Human Reading

**Impact: CRITICAL (vague guidance produces inconsistent skill behavior)**

Every step must be an exact command, tool call, or decision rule.

**Incorrect:**

```markdown
分析代码变更，理解修改的意图，然后生成合适的提交信息。
```

**Correct:**

```markdown
1. 获取暂存区变更：
   ```bash
   git diff --cached --stat && git diff --cached
   ```
2. 根据变更文件路径确定 scope：
   - `src/pages/chat/` → `chat`
   - `.github/workflows/` → `ci`
   - `vite.config.*` → `config`
```

Rules:
- Replace "analyze / consider / understand" with specific commands + output parsing
- Decision points must be machine-checkable (exit codes, file existence, output patterns)

### 3.2 Pre-flight Environment Checks

**Impact: HIGH (prevents cryptic failures in unexpected environments)**

Place environment checks BEFORE any main logic.

**Correct:**

```markdown
## 前置检查

```bash
git rev-parse --is-inside-work-tree 2>/dev/null
```
失败时输出：`⚠️ 当前目录不是 git 仓库` 并终止。
```

Standard checks by skill type:

| Skill Type | Required Checks |
|-----------|-----------------|
| Git | Inside git repo? Has uncommitted changes? |
| File generation | Target dir writable? File already exists? |
| Network/API | Tool installed? Network reachable? Auth set? |

Rules:
- Use `⚠️` for blocking errors, `ℹ️` for informational skips, `✓` for success

### 3.3 Freedom-Specification Spectrum

**Impact: HIGH (wrong choice leads to brittle text rules or over-engineered scripts)**

Choose the implementation strategy based on how many valid approaches exist:

```
High freedom ──────────────────────────────── Low freedom
(many valid answers)                     (one correct answer)

     ↓                    ↓                        ↓
Text guidance          Templates              Scripts (L3)
"Generate a            Fill-in params         validate.sh
 summary that..."      for output format      format_output.py
```

- **Use text guidance** for creative decisions: tone, structure, summarization
- **Use templates** (L3 reference file) for parametric output formats
- **Use scripts** (L3 scripts/) for brittle operations: naming conventions,
  format validation, parsing rules with one correct answer

**Incorrect (text guidance for a deterministic rule):**

```markdown
检查生成的 SKILL.md 格式是否正确，确保包含必要的字段。
```

**Correct (script for a deterministic check):**

```bash
bash ~/.claude/skills/skill-writer/scripts/validate.sh ~/.claude/skills/<name>
```

---

## 4. Robustness

**Impact: HIGH**

### 4.1 Design Fallbacks for External Tool Dependencies

**Impact: HIGH (skills without fallbacks fail silently)**

**Correct (detect → use best → fallback → abort clearly):**

```markdown
```bash
gh --version 2>/dev/null && echo "gh_ok"
glab --version 2>/dev/null && echo "glab_ok"
```
- `gh_ok` → use `gh pr view <n> --json comments`
- `glab_ok` → use `glab mr note list <n>`
- Neither → output install guide, abort
```

Fallback chain for common tools:
```
gh CLI → glab CLI → curl + GITHUB_TOKEN → abort with install guide
jq    → Python one-liner → awk → raw JSON with note
curl  → wget → Python requests → abort with network message
```

Rules:
- Only treat `git` and `bash` as universally available
- Order fallbacks best-first

### 4.2 Make Operations Idempotent

**Impact: MEDIUM**

**Incorrect:**
```bash
echo "NEW_SETTING=true" >> .env
```

**Correct:**
```bash
grep -q "NEW_SETTING" .env 2>/dev/null || echo "NEW_SETTING=true" >> .env
```

| Pattern | Non-idempotent | Idempotent |
|---------|----------------|-----------|
| Create dir | `mkdir path` | `mkdir -p path` |
| Append | `echo x >> f` | Check first |
| Git tag | `git tag v1.0` | Check `git tag -l v1.0` |

### 4.3 Error Messages Must Include Resolution Steps

**Impact: MEDIUM**

**Correct template:**
```
⚠️ [问题描述]

解决方式：
  macOS:  brew install <tool>
  Linux:  <url>

替代方案（可选）：[降级路径]
```

---

## 5. Anti-patterns

**Impact: CRITICAL**

### 5.1 Never Use Task Tool for Shell Commands

**Impact: CRITICAL**

`Task` spawns an AI subagent. Shell commands must always use `Bash` directly.

**Incorrect:**
```markdown
使用 Task 工具执行 git status
```

**Correct:**
```bash
git status --short
```

Add this warning to skills prone to misuse:
```markdown
**必须直接使用 Bash 工具执行 shell 命令，绝对不要使用 Task 工具。**
```

### 5.2 Never Write Vague Aspirational Guidance

**Impact: CRITICAL**

Banned phrases → replacement:
- "分析并确定..." → specific command + decision tree
- "根据情况选择..." → explicit if/else with checkable conditions
- "确保符合规范..." → run `validate.sh` or specific grep check

### 5.3 Never Put Trigger Conditions in Body

**Impact: HIGH (body loads after activation — trigger text there is wasted tokens)**

The body is only read after the skill has already been activated. Any trigger
condition text in the body has zero effect on activation and wastes L2 budget.

**Incorrect:**

```markdown
# My Skill

## When to Use
触发条件：当用户说"生成 commit"时使用本 skill。   ← loaded too late, no effect
```

**Correct:**

```yaml
description: ...当用户说"生成 commit"时触发。    ← in L1, works correctly
```

Rule: All "when to use" and trigger keywords belong exclusively in `description`.

---

## Appendix A: Quality Checklist

Run `scripts/validate.sh` for automated checks. Also verify manually:

**L1 (description)**
- [ ] 4+ trigger keywords in Chinese and English
- [ ] Boundary clause if domain is broad
- [ ] No trigger conditions duplicated in body

**L2 (SKILL.md body)**
- [ ] < 1500 words
- [ ] Imperative mood throughout
- [ ] Pre-flight checks before main logic
- [ ] No vague guidance phrases
- [ ] Heavy content moved to L3

**L3 (scripts / references)**
- [ ] Deterministic rules extracted to scripts
- [ ] Templates in reference files, not in body

**Robustness**
- [ ] Each external tool has a fallback or install guide
- [ ] Write/append operations are idempotent
- [ ] Error messages include resolution steps

---

## Appendix B: Scoring Dimensions

Use this when presenting the completeness score to the user.

| Dimension | Weight | What to check |
|-----------|--------|--------------|
| Core function clear | 25 | What it does, what it outputs |
| Trigger conditions | 15 | Keywords / command trigger method |
| Input parameters | 20 | Supported params, default values |
| Edge case coverage | 25 | Error handling, fallback, idempotency |
| Output format | 15 | Final presentation to user |

**Score output template:**

```
完整度：XX/100

已知：
✓ [confirmed dimension]

待补充：
? [高] [missing critical info]
? [中] [missing important info]
? [低] [optional info]

跳过的问题将使用合理默认值。
```

---

## Appendix C: Skill File Template

Use this template when presenting the draft in Phase 3.

```markdown
---
name: skill-name
description: [2-4 sentences with Chinese + English trigger keywords and boundary clause]
version: 1.0.0
allowed-tools: [only tools actually used]
---

# Skill Title

## 重要：工具调用规则
**必须直接使用 Bash 工具执行 shell 命令，绝对不要使用 Task 工具。**

## 前置检查
[Check external tool availability → succeed or abort with install guide]

## 执行步骤
[Concrete commands + explicit if/else branches, no vague guidance]

## 输出格式
[Example of final output shown to user]
```
