---
title: 从静态生成到动态执行：MCP 如何重塑 AI 能力
publishedAt: 2026-01-22
---
### 📌 什么是 MCP（Model Context Protocol）
MCP（Model Context Protocol） 是一个 开放标准 / 协议, 由 Anthropic 在 2024 年发布，主要用于统一和标准化大语言模型（LLM）与外部工具、数据源和服务之间的通信方式。它本质上是为解决 AI 模型传统上无法动态访问外部系统或实时数据的缺陷而设计的。

要理解 MCP（Model Context Protocol）为什么会出现，必须先弄清楚传统大模型（LLM）的局限性。在 2024 年之前，用户和 LLM 的交互主要还是 一句话问答式，比如你问 ChatGPT、Gemini 这类模型一个问题，它就返回一个回答。
```bash
    人
    ↑↓
  AI LLM
```
这种交互模式至今仍然是大多数 AI 用户的主要使用方式。

然而，这种交互方式存在 两个核心问题：

1、知识是静态且截止的：
    
    大多数 LLM 的知识都停留在某个训练数据的截止时间点，它不会自动获取之后发生的新信息。例如，LLM 训练数据之后的世界变化（实时新闻、动态事件）它并不知道。MCP 出现的核心动机之一，就是解决模型对外部实时信息的访问问题。

    举个例子，假设你本地部署了一个 LLM（或者特意告诉 ChatGPT “不要查外网，只靠训练知识回答”）然后问：“委内瑞拉总统最新情况如何？”
    
    那LLM一定不会告诉 Maduro 已经被美国人从卧室里抓走了。

    这说明 LLM 无法访问实时世界状态，只能凭“记忆”回答，这在很多场景下根本不够用。

2、LLM 无法主动执行操作或调用本地/外部资源：

    LLM 本身只是一个生成模型，它不能直接控制本地资源、调用硬件设备或执行系统级操作。
    
    比如你希望 AI 能调用你家网络摄像头拍一段视频并分析是否有陌生人出现，单独以LLM自身的能力肯定也是做不到的。

正所谓没有什么问题是加一层中间件解决不了的，如果有那就再加一层。
因此为了解决上述LLM的两个局限性，Anthropic为LLM和资源之间添加了MCP协议这个中间件：
```bash
      用户
      ↑ ↓  输入/结果
      │
      ↓
     LLM
      ↑ ↓ 意图 & 请求/响应
      │
      ↓
     MCP  ←—— 协议：规范调用 & 返回
      ↑ ↓ 调用/返回数据
      │
      ↓
    资源（API / 数据库 / 硬件 等）
      ↑ ↓ 实际执行 & 数据
```
----

### 🧠 MCP 的核心价值是什么
✅ 1. 标准化 AI 与外部世界交互

在没有 MCP 之前，每个模型或平台都得自己实现一套对接机制，比较像每个厂家做自己的接口协议。
MCP 的出现就像为所有 AI 模型制定了一套统一规范，大幅降低集成成本。

✅ 2. 双向通信而不仅仅是查询信息

它不是单向拉数据（像传统 RAG），而是让 LLM 主动发起调用、执行操作、获取结果，并能根据结果判断是否要继续调用其他MCP资源。

✅ 3. 让 AI 不依赖训练数据完成“实际任务”

AI 可以根据实时情况执行实际操作，例如实时查询系统状态、调用业务 API、修改数据库等。

有关 MCP 的优势或者与其他相似技术的对比不在本文过度叙述，感兴趣的朋友可以移步google的MCP相关文章：
[what-is-model-context-protocol](https://cloud.google.com/discover/what-is-model-context-protocol)

----

### 🔍 MCP的架构、原理和实现方法
#### 一、 MCP的整体架构
MCP 的架构是 一个标准化的客户端-主机-服务器（Client-Host-Server）设计，整体的架构如下：
```bash
+---------------------+
|     Host（宿主）     |   ← LLM 运行环境/应用界面
|   (App + LLM)       |
+---------------------+
           │
           ↓ ↑
+---------------------+
|   MCP Client       |   ← 负责管理和与 MCP Server 通信
|(请求/格式化/解析)   |
+---------------------+
           │
           ↓ ↑
+---------------------+
|    MCP Server       |   ← 实际对接外部资源与工具
|(执行行动 & 返回数据) |
+---------------------+
           │
           ↓ ↑ 
+------------------------------------------------+
| 外部资源（API、数据库、硬件设备、文件系统等） |
+------------------------------------------------+
```

我们以一个具体的场景来介绍，比如说我是一名BI，我的本地有一个数据库服务器，里面存储着去年的销售数据。在传统的工作方式中，我们需要写SQL文来抽取分析数据库中的数据。并形成结果。

但是在 LLM+MCP 的工作架构中我们可以直接在应用中输入自然语言描述的指令来执行任务，比如：

用户在应用程序上输入自然语言指令：
“调用本地数据库帮我分析 2025 年销售趋势”

```bash
用户发起查询
Host（Web 后端/桌面应用）接收请求
Host 调用 LLM（本地或远端 API）进行自然语言理解
Host 调用 MCP Client
+---------------------+
|     个人/工作PC      |  
|   (CodeX + GPT5.2)  |
+---------------------+
           │
           ↓ 
把LLM的“动作意图”提取出来
按MCP协议规范，把这段信息封装成标准请求
+---------------------+
|    MCP Client      |   
|(请求/格式化/解析)   | 
+---------------------+
           │
           ↓ 
执行真实操作（例如 SQL 查询）
+---------------------+
|    MCP Server       |  
|(执行行动 & 返回数据) |   ←→ 本地数据库
+---------------------+
           │
           ↓
解析MCP Server所返回的结果
+---------------------+
|    MCP Client      |   
|(请求/格式化/解析)   | 
+---------------------+
           │
           ↓
返回的数据整理成可读结果
显示给用户
+---------------------+
|     个人/工作PC      |  
|   (CodeX + GPT5.2)  |
+---------------------+
```
通过上述流程我们可以很轻松的理解MCP的 Client-Host-Server 架构。可以看到在扩展了MCP之后，LLM的使用从原来的只在Host端和AI对话，

```bash
          人
          ↑↓
+---------------------+
|     个人/工作PC      |    
|   (CodeX + GPT5.2)  |
+---------------------+
```
拓展成了可以利用AI去操控外部的资源做更加丰富的事情。我想这对于某些行业会带来颠覆性的影响，比如：
- 店长可以一句话通过AI拉取店内的各种资料并以非常棒的可视化效果展示。以调整运营决策
- 营业人员可以每天上班利用AI拉取邮箱信息分析有无重要邮件需要回复
- 工厂可以让AI实时检查生产线状态、设备运行指标和库存水平，自动识别瓶颈或预警质量问题，并提出整改建议。
- 监控比特币的价格，当价格符合某一特征的时候执行买入比特币动作，而买入的特征交给AI来进行判断。
- ... ...


#### 二、 MCP的原理（协议）
那么MCP的原理是什么呢？它是如何调用外部资源和获取外部实时讯息的呢？

从上文的MCP架构图也可以看出来，MCP能够实现于外部链接的核心就是MCP Server组件。这个组件有两个核心功能
- 和AI内部通讯
- 调用外部资源

我们先从简单容易理解的说起，

<b>1、操作外部资源/获取外部信息</b>

这个非常好理解，所谓的Server无非就是一个程序，当我们期待这个程序能提供操作外部资源/获取外部信息的能立的时候只需要编写对应程序即可，比如上文中的“ 调用本地数据库分析 2025 年销售趋势 ”

只需要提前编辑好 分析xx年销售趋势的功能/函数 即可。

<b>2、与AI内部通讯</b>

这一部分才是整个MCP的关键，也就是说我该如何公开我的 功能/函数 给AI。

Anthropic选择采用 JSON-RPC2.0 规范来衔接AI和外部功能。具体的JSON-RPC2.0规范不在此文详细介绍。只需要明确它是基于 JSON 的远程过程调用标准即可。

而沟通流程如下
```bash
建立连接：MCP Client（通常嵌入在 Host 中）与 MCP Server建立连接
↓
能力发现：Client询问Server，有哪些工具、资源或功能可用
↓
构造调用：Client根据 LLM 的意图，将动作（如 SQL 查询、API 调用等）封装成结构化的 MCP 调用请求。
↓
执行与返回：Server执行真正的外部操作，并把结果封装成响应返回给Client。
↓
后续交互：LLM可以根据返回的结果进一步发起新的MCP调用，形成完整的逻辑链。
```




#### 三、如何自己实现一个MCP
最后我们来自己尝试实现一个MCP Server，然后让它能够在Host上被调用（推荐大家使用的是OpenCode、CodeX、Cursor）。

> 目标：Cursor->AI->MCP->统计PC下document文件夹内的文件数量

1. 创建mcp_documents_counter工程（python）
    ```python
    #!/usr/bin/env python3
    # mcp_documents_server.py
    import json
    import sys
    import os

    def count_documents_files(params):
        # 获取参数中的目录
        folder = params.get("folder", "")
        if not os.path.isdir(folder):
            return {"error": f"Folder not found: {folder}"}
        count = 0
        for root, dirs, files in os.walk(folder):
            count += len(files)
        return {"count": count}

    while True:
        raw = sys.stdin.readline()
        if not raw:
            break
        try:
            req = json.loads(raw)
            method = req.get("method")
            if method == "tools/count_documents_files":
                result = count_documents_files(req.get("params", {}))
            else:
                result = {"error": f"Unknown method {method}"}

            response = {
                "jsonrpc": "2.0",
                "id": req.get("id"),
                "result": result
            }
            sys.stdout.write(json.dumps(response) + "\n")
            sys.stdout.flush()
        except Exception as e:
            err = {
                "jsonrpc": "2.0",
                "id": None,
                "error": {"message": str(e)}
            }
            sys.stdout.write(json.dumps(err) + "\n")
            sys.stdout.flush()
    ```

    这是一个最简 MCP Server，监听 stdin/stdout JSON-RPC,这个 Server 会响应方法：
    ```bash
    tools/count_documents_files
    ```
    并返回 folder 下文件数。

2. 启动 MCP Server（默认已经有了python环境）
    ```bash
    $ cd mcp_documents_counter
    $ python mcp_documents_server.py
    ```
    这时这个进程就变成了一个 MCP Server（STDIO 模式）。

3. 在 Cursor 中注册这个 MCP
    Cursor（或类似支持 MCP 的 AI 环境）需要添加你的 Server 作为 MCP 工具。

    注意：不同平台的 MCP 注册命令语法可能不一样，下例是典型的 stdio 注册方式。
    ```bash
    cursor mcp add documents_counter -- stdio python3 mcp_documents_server.py
    ```

    解释：

    * documents_counter：给这个服务起一个名字

    * -- stdio python3 mcp_documents_server.py：用 stdio 启动你的 MCP Server

    完成后，Cursor 侧应该识别到这个 MCP Server 并把它作为一个可调用工具。

4. 在cursor中向AI发出prompt
    ```md
    调用 MCP 工具 documents_counter，
    方法 count_documents_files，
    参数 folder = "你的/Documents/路径"
    帮我统计 Documents 文件夹里的文件数量。
    ```

5. 获取AI的返回结果，完成MCP Server的调用

我们通过一个最简单的 MCP Server 示例，做了一个能够统计电脑 Documents 文件夹中文件数量的工具，将原本AI不可能做到的事情转换成了AI能够做的事情。

这正是 MCP 协议将 AI 从“静态生成”转向“动态执行”的一个典型落地案例。

----
