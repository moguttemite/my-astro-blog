---
title: 从静态生成到动态执行：MCP 如何重塑 AI 能力
publishedAt: 2026-01-22
---

## 一、MCP 是什么

**MCP（Model Context Protocol，模型上下文协议）** 是由 Anthropic 在 2024 年提出的开放协议，用于**统一大语言模型（LLM）与外部工具、数据源、服务之间的通信方式**。  
它要解决的是：模型既拿不到「训练截止日之后」的实时信息，也做不到「主动执行系统/ API / 硬件操作」。  
用一句话概括：**MCP 是在「人—模型—外部世界」之间的一层标准中间件。**

### 传统 LLM 的两大局限

在只有「一问一答」的年代，交互大致是这样：

```
  用户
   ↕ 输入 / 回答
  LLM（仅依赖训练知识）
```

这带来两个根本性问题：

| 局限 | 说明 | 举例 |
|------|------|------|
| **知识静态、有截止日** | 模型不知道训练数据之后发生的事 | 问「某国总统最新动态」，只能靠记忆，无法查新闻 |
| **无法主动执行操作** | 模型不能直接调 API、查库、控设备 | 无法「调摄像头拍一段并分析是否有陌生人」 |

因此需要一层协议，让模型在「理解意图」之后，能通过标准化方式**发现并调用**外部能力，并把结果拿回对话里。  
MCP 就是这层协议：规定「怎么列能力、怎么调、怎么返回」，从而把 AI 从**静态生成**推进到**动态执行**。

### MCP 在整体链路中的位置

协议只关心「模型 ↔ 外部能力」这一段，不规定具体产品形态。逻辑关系可以理解为：

```
  用户
   ↕ 输入 / 最终回答
  Host（含 LLM 的应用，如 Cursor、Claude Desktop）
   ↕ 自然语言 ⇄ 工具调用与结果
  MCP Client（按协议与 Server 通信）
   ↕ JSON-RPC 请求/响应
  MCP Server（暴露工具、资源、提示等）
   ↕ 真实调用
  外部系统（API、数据库、文件、设备等）
```

- **Host**：跑 LLM 的应用，负责理解用户、决定何时调哪个工具、拼最终回复。  
- **MCP Client**：一般由 Host 内置，负责按 MCP 规范把「模型想调的工具 + 参数」发到 Server，并把返回整理给模型。  
- **MCP Server**：你（或第三方）写的进程，真正连数据库、调 API、读文件，通过「工具 / 资源 / 提示」暴露给模型。

因此：**同一套 MCP Server，可以被任何支持 MCP 的 Host 复用**，实现「一次开发、多处使用」。

---

## 二、MCP 能带来什么

- **统一规范**：不用给每个模型/平台各写一套插件，按 MCP 实现一次，即可被多种 Host 使用。  
- **双向、可编排**：不是单纯「拉一次数据」的 RAG，而是模型可以多次选工具、传参、根据结果再决定下一步，形成完整任务链。  
- **脱离训练数据做「真实动作」**：查实时状态、调业务 API、改数据库、操作本地文件等，都由 Server 在受控范围内执行。

若想与其他技术（如 RAG、普通 Function Calling）对比，可参考 [Google 对 MCP 的说明](https://cloud.google.com/discover/what-is-model-context-protocol) 等资料，此处不展开。

---

## 三、架构与基本概念

### 3.1 三类角色（官方术语）

MCP 采用 **Client–Server** 架构，并由 **Host** 使用 Client：

- **MCP Host**：集成 LLM 的应用（如 Cursor、Claude Desktop、VS Code 等），负责会话、调用模型、决定何时用哪个工具。
- **MCP Client**：由 Host 为「每个要连的 MCP Server」创建一个；负责连接、发请求、收响应。
- **MCP Server**：独立进程，提供「能力」给 Client；可本地（如 stdio）或远程（如 HTTP）。

例如：VS Code 是 Host；连 Sentry MCP 时有一个 Client，连本机文件系统 MCP 时再有一个 Client；每个 Server 只管自己的工具与资源。

### 3.2 两层结构：数据层 + 传输层

- **数据层**：基于 **JSON-RPC 2.0**，定义「有哪些方法、请求/响应长什么样」。  
  包括：生命周期（初始化、能力协商、断开）、**工具 / 资源 / 提示** 的发现与调用、通知等。
- **传输层**：负责「怎么把 JSON-RPC 消息传过去」。  
  常见两种：
  - **stdio**：本机进程间，用标准输入/输出传 JSON 行，无网络。
  - **Streamable HTTP**：走 HTTP，适合远程 Server，可配合 SSE 做流式。

同一套数据层协议可跑在不同传输上，行为一致。

### 3.3 三种能力（Primitives）

Server 主要向外提供三类「原语」：

| 类型 | 作用 | 典型用法 |
|------|------|----------|
| **Tools** | 可被模型触发的**动作** | 查数据库、调 API、跑脚本、读传感器 |
| **Resources** | 可被读取的**数据源** | 文件内容、API 快照、数据库 schema |
| **Prompts** | 可复用的**提示模板** | 系统提示、少样本示例、任务模板 |

Client 通过 `tools/list`、`resources/list` 等发现这些能力，通过 `tools/call` 等执行。  
下面以**工具**为主说明「一次调用」在协议里长什么样。

### 3.4 一次工具调用的协议流程（简化）

1. **建立连接**  
   Client 与 Server 建立传输（例如 stdio 子进程或 HTTP 连接），并做 **initialize** 握手，协商协议版本与能力（如是否支持 tools、listChanged 等）。

2. **能力发现**  
   Client 发 `tools/list`，Server 返回工具列表，每个工具包含：  
   `name`、`description`、`inputSchema`（参数 JSON Schema）等。

3. **执行调用**  
   Client 根据模型意图构造 `tools/call` 请求，带上 `name` 和 `arguments`。  
   Server 执行实际逻辑（查库、调 API 等），用 `content` 数组返回文本/结构化结果；若执行失败，可在结果里标 `isError: true` 或走 JSON-RPC error。

4. **后续步骤**  
   模型根据返回内容决定是否再调别的工具或结束回答；Host 把多轮工具调用和模型回复一起呈现给用户。

因此，**「AI 能做什么」由 Server 暴露的 tools/resources 决定**， Host 和模型只负责「选哪个、传什么参数、怎么用结果」。

### 3.5 用一个场景串起整条链

假设你有一张本地销售表，希望用自然语言做分析：

- **传统方式**：手写 SQL、跑查询、自己画图。
- **MCP 方式**：在 Host（如 Cursor）里说：「用本地数据库分析去年销售趋势」。

背后发生的事可以概括为：

1. Host 把这句话交给 LLM，LLM 判断需要「调用某个分析类的工具」。
2. Host 内的 MCP Client 向已连接的「数据库 MCP Server」发 `tools/call`，参数里带时间范围、指标等。
3. Server 执行 SQL 或内部逻辑，把汇总结果通过 `content` 返回。
4. Client 把结果交给 LLM，LLM 生成「趋势说明 + 建议」的自然语言回复。

同样的 Server，可以接到 Cursor、Claude Desktop、自研看板等任何支持 MCP 的 Host，实现「一句话分析」而不必每处都写死对接逻辑。

---

## 四、动手写一个 MCP Server（Python + FastMCP）

下面用 **官方 Python SDK 的 FastMCP** 写一个「统计本地某文件夹下文件个数」的 Server，并在 Cursor / Claude Desktop 里使用。  
这样你可以直观看到：**模型原先做不到的事（读你本机目录）**，如何通过 MCP 变成可调用的能力。

### 4.1 环境与依赖

- Python 3.10+
- 安装 MCP 的 Python SDK（建议使用 `uv`，也可用 `pip`）：

```bash
# 使用 uv（推荐）
uv add "mcp[cli]"

# 或 pip
pip install mcp
```

### 4.2 最小 Server 代码

创建文件 `documents_counter.py`：

```python
import logging
from pathlib import Path

from mcp.server.fastmcp import FastMCP

# STDIO 模式下不要用 print()，会破坏 JSON-RPC；用 logging 写 stderr
logging.basicConfig(level=logging.INFO)

mcp = FastMCP("documents_counter")


@mcp.tool()
def count_files(folder: str) -> str:
    """统计指定目录下所有文件的数量（含子目录）。

    Args:
        folder: 要统计的目录绝对路径，例如 /Users/me/Documents 或 C:\\Users\\me\\Documents
    """
    path = Path(folder)
    if not path.exists():
        return f"错误：路径不存在 —— {folder}"
    if not path.is_dir():
        return f"错误：不是目录 —— {folder}"
    count = sum(1 for _ in path.rglob("*") if _.is_file())
    return f"目录 {folder} 下共有 {count} 个文件。"


if __name__ == "__main__":
    mcp.run(transport="stdio")
```

要点：

- **FastMCP** 会根据函数签名和 docstring 自动生成工具的 `name`、`description`、`inputSchema`。
- 使用 **logging** 而不是 `print()`，避免在 stdio 传输下把日志写进 JSON-RPC 通道导致断连。

### 4.3 本地跑起来

```bash
uv run documents_counter.py
# 若用 pip： python documents_counter.py
```

进程会挂起，从 stdin 读 JSON-RPC、往 stdout 写响应，这就是 **stdio 模式的 MCP Server**。  
若有 [MCP Inspector](https://github.com/modelcontextprotocol/inspector)，可直接连到该进程做 `tools/list`、`tools/call` 的调试。

### 4.4 在 Cursor 里接上

在 Cursor 的 MCP 配置里增加一个 stdio 型 Server。配置通常位于项目或用户设置中的 MCP 列表（如 `mcpServers`），示例：

```json
{
  "mcpServers": {
    "documents_counter": {
      "command": "uv",
      "args": [
        "--directory",
        "/你的项目或工作目录绝对路径",
        "run",
        "documents_counter.py"
      ]
    }
  }
}
```

若用 `python` 直接跑，可改成：

```json
"documents_counter": {
  "command": "python",
  "args": ["/绝对路径/documents_counter.py"]
}
```

保存并重启 Cursor，让配置生效。

### 4.5 在对话里用

在 Cursor 里对 AI 说，例如：

- 「调用 documents_counter，统计 `C:\Users\你的用户名\Documents` 下有多少个文件。」
- 或「用 MCP 工具数一下我 ~/Documents 里的文件数。」

Host 会解析意图 → 发 `tools/call` 给 `documents_counter` → 把返回贴回对话。  
这样就把「静态的模型」和「你本机文件系统」通过一个极简的 MCP Server 接在一起，完成从**静态生成**到**动态执行**的一次最小闭环。

### 4.6 和「自己手写 JSON-RPC 循环」的对比

网上有些教程会手写「读 stdin → 解析 method → 回 stdout」的循环，并自造方法名（如 `tools/count_documents_files`）。  
那样虽然能跑，但**不是标准 MCP**：没有 `initialize`、没有标准 `tools/list` / `tools/call`，换一个 Host 就可能不认。  
使用官方 SDK（如 FastMCP）可以：

- 自动走标准的初始化与能力协商；
- 自动生成符合规范的 `tools/list` 响应和 `tools/call` 处理；
- 方便以后加更多工具、加 Resources/Prompts，或换成 Streamable HTTP 部署。

更完整的示例（含多工具、Resources、HTTP）可看 [MCP 官方文档 - Build a server](https://modelcontextprotocol.io/docs/develop/build-server) 和 [Python SDK 文档](https://modelcontextprotocol.github.io/python-sdk/)。

在掌握单一 Tool 之后，可进一步为 Server 增加 **Resources**（如按类型读取文件内容）和 **Prompts**（如周报生成模板），在 Cursor 等 Host 中同时使用三类能力，即可更完整地体会 MCP 如何把 AI 从静态生成延伸到动态执行。

---

## 五、部署与使用时的注意点

### 5.1 协议版本与兼容

- MCP 用**协议版本**（如 `2025-06-18`）做兼容；握手时 Client/Server 会协商版本，不一致可拒绝连接。
- 规范已由社区在 [modelcontextprotocol.io](https://modelcontextprotocol.io) 维护，新能力会通过版本迭代加入。  
  部署时尽量使用双方都支持的同一版本，并留意 SDK 与官方文档的更新说明。

### 5.2 权限与安全

- **最小权限**：Server 只暴露业务需要的工具与资源，避免「万能 API」。
- **隔离运行**：Server 建议在受限环境（如独立进程、容器）中跑，即使被误用也不会直接动到宿主关键系统。
- **传输与认证**：远程 Server 应走 HTTPS，并按需做认证（Bearer、API Key、OAuth 等）；本地 stdio 时，要控制「谁能启动该 Server、能连到哪些 Host」。
- **输入校验**：在 Server 内严格校验参数（路径、ID、权限等），减少注入或越权。

### 5.3 日志与运维

- **STDIO Server 禁止写 stdout**：所有日志应打到 stderr 或文件，否则会破坏 JSON-RPC 报文。
- **错误返回要规范**：执行失败时通过 `isError: true` 或 JSON-RPC error 明确返回，便于 Host 和用户理解。
- **超时与重试**：Client 侧应对调用设超时；对临时故障可实现有限重试，但要避免无限重试放大问题。

### 5.4 跨平台与多语言

- MCP 提供多语言 SDK（Python、TypeScript、Java、Go、Rust 等），同一协议可在不同栈里实现。
- stdio 与 HTTP 两种传输在不同系统上均可使用，部署时按「本地调试用 stdio、生产/远程用 HTTP」的常见做法即可。

---

## 六、安全与权限思路（简要）

MCP 没有消除所有风险，但把「模型能做什么」变成了**可枚举、可配置、可审计**的接口：

- **执行边界**：模型只能调用 Server 暴露出来的工具，不能随意执行任意代码；你通过「开什么工具、不开什么」控制执行范围。
- **数据边界**：敏感数据由 Server 访问，在返回前做脱敏、鉴权、过滤；模型只看到你允许的那部分结果。
- **可审计**：工具调用可日志化（谁、何时、调了哪个工具、参数与结果概要），便于事后排查与合规。
- **风险与应对**：提示注入、恶意参数、工具滥用等仍然存在，需要在 Server 侧做校验、在 Host 侧做确认（尤其是敏感操作），并配合监控与测试。

把 MCP 纳入现有权限与审计体系，而不是当作「放开一切」的通道，是更稳妥的做法。

---

## 七、延伸阅读与资源

- [MCP 官方网站与规范](https://modelcontextprotocol.io)  
- [MCP 文档：架构概览](https://modelcontextprotocol.io/docs/concepts/architecture)  
- [MCP 文档：构建 Server](https://modelcontextprotocol.io/docs/develop/build-server)  
- [Python SDK](https://modelcontextprotocol.github.io/python-sdk/)  
- [MCP Inspector（调试用）](https://github.com/modelcontextprotocol/inspector)


