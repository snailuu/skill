#!/usr/bin/env bash
# validate.sh — Check a Claude Code skill for quality issues
# Usage: bash validate.sh <path-to-skill-directory>

SKILL_DIR="${1:-}"
if [[ -z "$SKILL_DIR" ]]; then
  echo "Usage: $0 <skill-directory>"
  exit 1
fi

SKILL_FILE="$SKILL_DIR/SKILL.md"
if [[ ! -f "$SKILL_FILE" ]]; then
  echo "❌ SKILL.md not found: $SKILL_FILE"
  exit 1
fi

PASS=0; FAIL=0; WARN=0
pass() { echo "  ✓ $1"; ((PASS++)) || true; }
fail() { echo "  ✗ $1"; ((FAIL++)) || true; }
warn() { echo "  ⚠ $1"; ((WARN++)) || true; }

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Validating: $(basename "$SKILL_DIR")"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Frontmatter ────────────────────────────────────────────────────────
echo ""
echo "[ Frontmatter ]"

grep -q "^name:" "$SKILL_FILE"        && pass "name present"        || fail "missing 'name:'"
grep -q "^description:" "$SKILL_FILE" && pass "description present" || fail "missing 'description:'"
grep -q "^allowed-tools:" "$SKILL_FILE" \
  && pass "allowed-tools present" \
  || warn "no allowed-tools (ok if skill uses no tools)"

# Description length
DESC=$(grep "^description:" "$SKILL_FILE" | head -1 | sed 's/^description: *//; s/^"//; s/"$//')
DESC_LEN=${#DESC}
if [[ $DESC_LEN -lt 30 ]]; then
  fail "description too short (${DESC_LEN} chars) — add trigger keywords"
elif [[ $DESC_LEN -gt 600 ]]; then
  warn "description very long (${DESC_LEN} chars) — consider trimming"
else
  pass "description length OK (${DESC_LEN} chars)"
fi

# ── Body ───────────────────────────────────────────────────────────────
echo ""
echo "[ Body (L2) ]"

# Extract body after closing ---
BODY=$(awk '/^---$/{c++; if(c==2){f=1;next}} f{print}' "$SKILL_FILE")
BODY_WORDS=$(echo "$BODY" | wc -w | tr -d ' ')

if [[ $BODY_WORDS -lt 20 ]]; then
  fail "body too short (${BODY_WORDS} words) — add workflow instructions"
elif [[ $BODY_WORDS -gt 1500 ]]; then
  warn "body long (${BODY_WORDS} words) — move heavy content to L3 references"
else
  pass "body length OK (${BODY_WORDS} words)"
fi

echo "$BODY" | grep -q '```'   && pass "contains code blocks" || warn "no code blocks — skills should have concrete commands"
echo "$BODY" | grep -q '^## '  && pass "has section headers"  || warn "no section headers"

# ── Trigger conditions not duplicated in body ──────────────────────────
echo ""
echo "[ Architecture ]"

if echo "$BODY" | grep -qE '触发条件|触发时机|当用户说|when.*triggers?|trigger.*when|关键词.*触发'; then
  fail "trigger conditions in body — move to description field only (L1 rule)"
else
  pass "trigger conditions not duplicated in body"
fi

# ── Anti-patterns ──────────────────────────────────────────────────────
echo ""
echo "[ Anti-patterns ]"

# Task tool misuse (exclude negation patterns like "不要使用 Task")
TASK_LINES=$(grep -nE 'subagent_type.*[Bb]ash|Task.*shell|shell.*Task' "$SKILL_FILE" || true)
if [[ -n "$TASK_LINES" ]]; then
  # Filter out lines that are negation/warning patterns
  REAL_MISUSE=$(echo "$TASK_LINES" | grep -vE '不要使用|绝对不要|不要.*Task|never.*Task|Never.*Task|do not.*Task|Do not.*Task' || true)
  if [[ -n "$REAL_MISUSE" ]]; then
    fail "Task tool used for shell — use Bash tool directly"
  else
    pass "no Task tool shell misuse (negation pattern detected)"
  fi
else
  pass "no Task tool shell misuse"
fi

# Vague guidance phrases
VAGUE_FOUND=()
for p in "你应该" "请考虑" "确保符合" "分析并确定" "根据情况" "理解用户" \
         "合理地" "适当地" "you should" "consider using" "make sure to" "ensure that"; do
  grep -qi "$p" "$SKILL_FILE" && VAGUE_FOUND+=("$p")
done
if [[ ${#VAGUE_FOUND[@]} -gt 0 ]]; then
  fail "vague guidance: ${VAGUE_FOUND[*]} — replace with concrete commands"
else
  pass "no vague guidance phrases"
fi

# Freedom-Specification: scripts preferred for deterministic/brittle operations
if echo "$BODY" | grep -qE '命名规范|格式校验|validate|naming convention|format check'; then
  if [[ ! -d "$SKILL_DIR/scripts" ]]; then
    warn "deterministic rules detected — consider extracting to scripts/ (L3)"
  fi
fi

# ── Summary ────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ $PASS passed   ✗ $FAIL failed   ⚠ $WARN warnings"

if [[ $FAIL -gt 0 ]]; then
  echo "  Status: FAIL — fix errors before using this skill"
  exit 1
elif [[ $WARN -gt 2 ]]; then
  echo "  Status: WARN — skill works but has quality issues"
  exit 0
else
  echo "  Status: PASS"
  exit 0
fi
