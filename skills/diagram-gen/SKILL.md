---
name: diagram-gen
description: 根据用户描述生成各种类型的图表（时序图、流程图、类图、状态图等），使用 Mermaid 语法，支持保存为文件
version: 1.0.0
author: Claude Code Assistant
allowed-tools: Write, Read, Bash
---

# 图表生成技能

## 重要：工具调用规则

**必须直接使用 Bash 工具执行 shell 命令，绝对不要使用 Task 工具来执行命令。**
- 所有 shell 命令通过 Bash 工具直接执行
- 不要将 Bash 作为 Task 的 subagent_type
- 不要使用 Task 工具来委托执行 shell 命令

## 触发条件

当用户输入包含以下关键词时触发：
- "生成图表"、"画图"、"生成时序图"、"生成流程图"
- "diagram"、"mermaid"、"sequence diagram"、"flowchart"
- "画个流程图"、"帮我画"、"生成架构图"
- "类图"、"状态图"、"ER图"、"甘特图"

## 支持的图表类型

### 1. 时序图 (Sequence Diagram)
用于展示对象之间的交互顺序。

```mermaid
sequenceDiagram
    participant A as 用户
    participant B as 系统
    A->>B: 请求
    B-->>A: 响应
```

### 2. 流程图 (Flowchart)
用于展示流程和决策。

```mermaid
flowchart TD
    A[开始] --> B{判断}
    B -->|是| C[执行]
    B -->|否| D[结束]
    C --> D
```

### 3. 类图 (Class Diagram)
用于展示类的结构和关系。

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog
```

### 4. 状态图 (State Diagram)
用于展示状态转换。

```mermaid
stateDiagram-v2
    [*] --> 待处理
    待处理 --> 处理中
    处理中 --> 已完成
    处理中 --> 失败
    已完成 --> [*]
    失败 --> [*]
```

### 5. ER图 (Entity Relationship Diagram)
用于展示数据库实体关系。

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
```

### 6. 甘特图 (Gantt Chart)
用于展示项目进度。

```mermaid
gantt
    title 项目计划
    dateFormat YYYY-MM-DD
    section 阶段1
    任务1 :a1, 2024-01-01, 30d
    任务2 :after a1, 20d
```

### 7. Git 分支图 (Git Graph)
用于展示 Git 分支历史。

```mermaid
gitGraph
    commit
    branch develop
    checkout develop
    commit
    checkout main
    merge develop
```

## 执行步骤

### 1. 理解用户需求
- 询问用户想要生成什么类型的图表
- 了解图表的具体内容和场景
- 确认是否需要保存为文件

### 2. 生成 Mermaid 代码
根据用户描述，生成对应的 Mermaid 语法代码。

**时序图关键语法：**
- `participant A as 名称` - 定义参与者
- `A->>B: 消息` - 同步消息
- `A-->>B: 消息` - 异步响应
- `alt/else/end` - 条件分支
- `loop/end` - 循环
- `par/and/end` - 并行

**流程图关键语法：**
- `A[矩形]` - 普通节点
- `B{菱形}` - 判断节点
- `C([圆角])` - 圆角节点
- `D[(数据库)]` - 数据库节点
- `A --> B` - 箭头连接
- `A -->|文字| B` - 带文字的箭头

**类图关键语法：**
- `+` public, `-` private, `#` protected
- `<|--` 继承, `*--` 组合, `o--` 聚合
- `..>` 依赖, `..|>` 实现

### 3. 输出格式

直接输出 Mermaid 代码块：

````markdown
```mermaid
sequenceDiagram
    participant 用户
    participant 系统
    用户->>系统: 登录请求
    系统-->>用户: 返回 token
```
````

### 4. 保存文件（可选）

如果用户需要保存，询问文件名并保存为 `.md` 文件：

```bash
# 保存到当前目录
echo '```mermaid\n...\n```' > diagram.md
```

### 5. 提供使用建议

告知用户如何查看和使用生成的图表：
- VS Code + Mermaid 插件
- draw.io 导入（Arrange → Insert → Advanced → Mermaid）
- 在线工具：https://mermaid.live
- GitHub/GitLab Markdown 原生支持

## 智能生成规则

### 时序图生成规则
1. 识别参与者（用户、系统、服务、数据库等）
2. 按时间顺序排列交互
3. 区分同步调用（->>）和异步响应（-->>）
4. 添加条件分支（alt/else）和循环（loop）

### 流程图生成规则
1. 识别起点和终点
2. 识别判断节点（if/else）
3. 识别循环节点（for/while）
4. 使用合适的节点形状

### 类图生成规则
1. 识别类和接口
2. 识别属性和方法
3. 识别类之间的关系（继承、组合、依赖等）
4. 使用访问修饰符（+/-/#）

## 示例场景

### 场景1：用户登录流程时序图

用户输入：
```
生成一个用户登录的时序图，包括前端、后端API、数据库
```

生成：
````markdown
```mermaid
sequenceDiagram
    participant 前端
    participant API
    participant 数据库

    前端->>API: POST /login {username, password}
    API->>数据库: 查询用户信息
    数据库-->>API: 返回用户数据

    alt 认证成功
        API->>API: 生成 JWT token
        API-->>前端: 返回 {token, user}
        前端->>前端: 保存 token 到 localStorage
        前端-->>前端: 跳转到首页
    else 认证失败
        API-->>前端: 返回 {error: "用户名或密码错误"}
        前端-->>前端: 显示错误提示
    end
```
````

### 场景2：订单处理流程图

用户输入：
```
画一个订单处理的流程图
```

生成：
````markdown
```mermaid
flowchart TD
    A[接收订单] --> B{库存充足?}
    B -->|是| C[扣减库存]
    B -->|否| D[通知用户缺货]
    C --> E{支付成功?}
    E -->|是| F[生成发货单]
    E -->|否| G[恢复库存]
    F --> H[发货]
    H --> I[订单完成]
    D --> J[订单取消]
    G --> J
```
````

## 注意事项

- 使用中文标签时，确保编码为 UTF-8
- 复杂图表建议分步骤生成，避免过于复杂
- 时序图参与者数量建议不超过 6 个
- 流程图节点数量建议不超过 15 个
- 生成后可以根据用户反馈调整和优化

## 高级功能

### 1. 样式定制
可以添加样式定义：

```mermaid
flowchart TD
    A[开始]:::startClass --> B[处理]
    classDef startClass fill:#f9f,stroke:#333,stroke-width:4px
```

### 2. 子图
可以使用子图组织复杂流程：

```mermaid
flowchart TD
    subgraph 前端
        A[页面] --> B[组件]
    end
    subgraph 后端
        C[API] --> D[数据库]
    end
    B --> C
```

### 3. 注释
可以添加注释说明：

```mermaid
sequenceDiagram
    Note over 用户,系统: 这是一个注释
    用户->>系统: 请求
```
