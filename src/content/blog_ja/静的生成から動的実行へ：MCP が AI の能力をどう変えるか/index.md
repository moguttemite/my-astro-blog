---
title: 静的生成から動的実行へ：MCP が AI の能力をどう変えるか
publishedAt: 2026-01-22
---

## 一、MCP とは

**MCP（Model Context Protocol／モデルコンテキストプロトコル）** は、Anthropic が 2024 年に提唱したオープンなプロトコルで、**大規模言語モデル（LLM）と外部ツール・データソース・サービスとの通信を共通化する**ことを目的とする。  
解こうとしているのは、「学習カットオフ以降のリアルタイム情報に触れられない」「システム・API・ハードウェアを直接操作できない」という二つの制約。  
一言でいえば、**MCP は「人—モデル—外部世界」のあいだに置かれる標準的なミドルウェア**である。

### 従来型 LLM の二つの限界

「一问一答」だけの時代、やりとりはおおむね次のような形だった：

```
  ユーザー
   ↕ 入力 / 回答
  LLM（学習知識のみに依存）
```

これには二つの根本的な問題がある：

| 限界 | 説明 | 例 |
|------|------|-----|
| **知識が静的でカットオフがある** | 学習データ以降のできごとをモデルは知らない | 「某国大統領の最新動向」を聞いても記憶のみで答え、ニュースは参照できない |
| **能動的な操作ができない** | モデルは API 呼び出し・DB 参照・機器制御を直接行えない | 「カメラで撮影し、不審者の有無を分析する」といったことはできない |

そこで、「意図を理解したあと、標準的なやり方で外部の能力を**発見・呼び出し**し、その結果を会話に戻す」ためのプロトコルが必要になる。  
MCP はそのレイヤーであり、「能力の列挙のしかた・呼び出し方・返し方」を定めることで、AI を**静的生成**から**動的実行**へ進める。

### MCP が扱う範囲

プロトコルが対象にするのは「モデル ⇄ 外部能力」の部分だけで、具体的なプロダクト形態は定めない。論理的な関係は次のように整理できる：

```
  ユーザー
   ↕ 入力 / 最終回答
  Host（LLM を内蔵したアプリ。例：Cursor、Claude Desktop）
   ↕ 自然言語 ⇄ ツール呼び出しと結果
  MCP Client（プロトコルに従って Server と通信）
   ↕ JSON-RPC リクエスト/レスポンス
  MCP Server（ツール・リソース・プロンプトを公開）
   ↕ 実実行
  外部システム（API、DB、ファイル、デバイスなど）
```

- **Host**：LLM を動かすアプリ。ユーザー理解・どのツールをいつ呼ぶか・最終応答の組み立てを担当する。  
- **MCP Client**：通常は Host に組み込まれる。モデルが呼び出したいツールと引数を MCP の形で Server に送り、返り値をモデルに渡す役割。  
- **MCP Server**：開発者（または第三者）が実装するプロセス。実際に DB に接続し、API を叩き、ファイルを読み、**ツール / リソース / プロンプト**としてモデルに公開する。

したがって、**同一の MCP Server を、MCP 対応のどの Host からでも再利用できる**、「一度つくればどこでも使える」構成になる。

---

## 二、MCP がもたらすもの

- **共通規格**：モデルやプラットフォームごとに専用プラグインを書かず、MCP として一度実装すれば、複数の Host から利用できる。  
- **双方向でオーケストレーション可能**：RAG のような「一度きりのデータ取得」ではなく、モデルが何度もツールを選び、引数を渡し、結果に応じて次の一手を決め、一連のタスクをつなげられる。  
- **学習データに頼らない「実際の動作」**：リアルタイム状態の参照、業務 API の呼び出し、DB の更新、ローカルファイル操作などは、すべて Server が制御された範囲で実行する。

RAG や一般的な Function Calling との違いについては、[Google による MCP の解説](https://cloud.google.com/discover/what-is-model-context-protocol) などを参照できる。本稿では立ち入らない。

---

## 三、アーキテクチャと基本概念

### 3.1 三つの役割（公式用語）

MCP は **Client–Server** 構成をとり、**Host** が Client を利用する：

- **MCP Host**：LLM を統合したアプリ（Cursor、Claude Desktop、VS Code など）。セッション管理・モデル呼び出し・どのツールをいつ使うかの判断を行う。
- **MCP Client**：Host が「接続する各 MCP Server」ごとにひとつ生成する。接続・リクエスト送信・レスポンス受信を担当。
- **MCP Server**：独立したプロセス。Client に「能力」を提供する。ローカル（stdio）でもリモート（HTTP）でもよい。

例：VS Code が Host。Sentry 用 MCP に繋ぐ Client と、ローカルファイルシステム用 MCP に繋ぐ Client を別々に持ち、各 Server は自分のツールとリソースだけを担当する。

### 3.2 二層構造：データ層とトランスポート層

- **データ層**：**JSON-RPC 2.0** に基づき、「どのメソッドがあるか・リクエスト/レスポンスの形」を定義する。  
  ライフサイクル（初期化・能力ネゴシエーション・切断）、**ツール / リソース / プロンプト**の発見と呼び出し、通知などが含まれる。  
- **トランスポート層**：「JSON-RPC メッセージをどう届けるか」を担う。  
  代表的な二種：
  - **stdio**：同一マシン上のプロセス間で、標準入出力で JSON 行を送受信。ネットワーク不要。
  - **Streamable HTTP**：HTTP 経由。リモートの Server に適し、SSE でストリーミング可能。

同じデータ層プロトコルを、異なるトランスポートの上で動かせる。振る舞いは揃う。

### 3.3 三種の能力（Primitives）

Server が外に提供する主な「原語」は三つ：

| 種類 | 役割 | 代表的な用途 |
|------|------|--------------|
| **Tools** | モデルから呼ばれる**アクション** | DB 検索、API 呼び出し、スクリプト実行、センサー読み取り |
| **Resources** | 読み取り可能な**データソース** | ファイル内容、API スナップショット、DB スキーマ |
| **Prompts** | 再利用可能な**プロンプトテンプレート** | システムプロンプト、Few-shot 例、タスク用テンプレート |

Client は `tools/list` や `resources/list` などでこれらを発見し、`tools/call` などで実行する。  
以下では**ツール**を中心に、「一回の呼び出し」がプロトコル上どう見えるかを説明する。

### 3.4 ツール呼び出しのプロトコルフロー（簡略）

1. **接続の確立**  
   Client が Server とトランスポート（stdio 子プロセスや HTTP 接続など）を張り、**initialize** でハンドシェイクし、プロトコルバージョンや能力（tools 対応の有無、listChanged など）をネゴシエートする。

2. **能力の発見**  
   Client が `tools/list` を送り、Server がツール一覧を返す。各ツールには  
   `name`・`description`・`inputSchema`（引数の JSON Schema）などが含まれる。

3. **呼び出しの実行**  
   Client がモデルの意図に合わせて `tools/call` を組み立て、`name` と `arguments` を付けて送る。  
   Server は実際の処理（DB 検索・API 呼び出しなど）を行い、`content` 配列でテキストや構造化結果を返す。失敗時は結果に `isError: true` を立てるか、JSON-RPC の error を返す。

4. **その後の流れ**  
   モデルは返り値に応じて別のツールを呼ぶか回答を終えるかを決め、Host が複数回のツール呼び出しとモデル応答をまとめてユーザーに提示する。

つまり、**「AI が何をできるか」は Server が公開する tools/resources で決まり**、Host とモデルは「どれを選ぶか・どんな引数か・結果をどう使うか」だけを担当する。

### 3.5 一つのシナリオで全体をつなぐ

ローカルに売上テーブルがあり、自然言語で分析したい場合を想定する：

- **従来**：SQL を書き、クエリを実行し、自分でグラフなどを用意する。
- **MCP 利用時**：Host（例：Cursor）で「ローカルの DB で昨年の売上トレンドを分析して」と指示する。

このとき裏で起きることは、おおまかに次のとおり：

1. Host がその文を LLM に渡し、LLM が「分析系のツールを呼ぶべき」と判断する。
2. Host 内の MCP Client が、接続済みの「DB 用 MCP Server」に `tools/call` を送り、パラメータに期間・指標などを含める。
3. Server が SQL や内部ロジックを実行し、集計結果を `content` で返す。
4. Client がその結果を LLM に渡し、LLM が「トレンドの説明と提案」を自然言語で返す。

同じ Server を、Cursor、Claude Desktop、自社ダッシュボードなど、MCP 対応のあらゆる Host に繋げられる。「一言で分析」を、 Host ごとに個別実装しなくてよい。

---

## 四、MCP Server を書いて動かす（Python + FastMCP）

ここでは **公式 Python SDK の FastMCP** を使って、「指定フォルダ内のファイル数を数える」Server を作り、Cursor や Claude Desktop から使う流れを示す。  
**モデルだけではできないこと（ローカルディレクトリの参照）** が、MCP で「呼び出し可能な能力」になる様子を、そのまま体験できる。

### 4.1 環境と依存関係

- Python 3.10 以上
- MCP 用 Python SDK のインストール（`uv` 推奨。`pip` でも可）：

```bash
# uv を使う場合（推奨）
uv add "mcp[cli]"

# または pip
pip install mcp
```

### 4.2 最小限の Server コード

`documents_counter.py` を作成する：

```python
import logging
from pathlib import Path

from mcp.server.fastmcp import FastMCP

# STDIO では print() 禁止。JSON-RPC が壊れるため logging で stderr に出す
logging.basicConfig(level=logging.INFO)

mcp = FastMCP("documents_counter")


@mcp.tool()
def count_files(folder: str) -> str:
    """指定ディレクトリ配下のファイル数（サブディレクトリを含む）を返す。

    Args:
        folder: 対象ディレクトリの絶対パス。例: /Users/me/Documents や C:\\Users\\me\\Documents
    """
    path = Path(folder)
    if not path.exists():
        return f"エラー：パスが存在しません —— {folder}"
    if not path.is_dir():
        return f"エラー：ディレクトリではありません —— {folder}"
    count = sum(1 for _ in path.rglob("*") if _.is_file())
    return f"ディレクトリ {folder} には合計 {count} 個のファイルがあります。"


if __name__ == "__main__":
    mcp.run(transport="stdio")
```

ポイント：

- **FastMCP** は関数シグネチャと docstring から、ツールの `name`・`description`・`inputSchema` を自動生成する。
- **logging** を使い、`print()` は使わない。stdio トランスポートでは stdout に出すと JSON-RPC の通信が崩れる。

### 4.3 ローカルで起動する

```bash
uv run documents_counter.py
# pip の場合は: python documents_counter.py
```

プロセスは stdin で JSON-RPC を読み、stdout にレスポンスを書き続ける。これが **stdio モードの MCP Server**。  
[MCP Inspector](https://github.com/modelcontextprotocol/inspector) があれば、このプロセスに対して `tools/list`・`tools/call` を送って挙動を確認できる。

### 4.4 Cursor に組み込む

Cursor の MCP 設定に、stdio 型の Server を一つ追加する。設定はプロジェクトまたはユーザー設定の MCP 一覧（例：`mcpServers`）に書く。例：

```json
{
  "mcpServers": {
    "documents_counter": {
      "command": "uv",
      "args": [
        "--directory",
        "/あなたのプロジェクトまたは作業ディレクトリの絶対パス",
        "run",
        "documents_counter.py"
      ]
    }
  }
}
```

`python` で直接動かす場合は、例えば次のようにする：

```json
"documents_counter": {
  "command": "python",
  "args": ["/絶対パス/documents_counter.py"]
}
```

保存し、Cursor を再起動して設定を有効にする。

### 4.5 会話から使う

Cursor の AI に、例えば次のように話しかける：

- 「documents_counter を呼んで、`C:\Users\あなたのユーザー名\Documents` のファイル数を教えて。」
- あるいは「MCP ツールで ~/Documents のファイル数を数えて。」

Host が意図を解釈し、`documents_counter` へ `tools/call` を送り、返ってきた結果を会話に反映する。  
これで、「静的だったモデル」と「ローカルファイルシステム」が、ごく小さな MCP Server を介して繋がり、**静的生成**から**動的実行**までの最小ループが一通り体験できる。

### 4.6 「自前で JSON-RPC ループを書く」場合との違い

一部の解説では、「stdin を読む → method を解釈 → stdout に返す」ループを自前で書き、独自のメソッド名（例：`tools/count_documents_files`）を使う例がある。  
そのようにしても動くが、**標準の MCP ではない**。`initialize` がなく、標準の `tools/list`・`tools/call` にもなっていないため、別の Host では認識されない可能性がある。  
公式 SDK（FastMCP など）を使うと：

- 標準の初期化と能力ネゴシエーションが自動で行われる；
- 規格に沿った `tools/list` レスポンスと `tools/call` 処理が自動で用意される；
- あとからツールを増やしたり、Resources・Prompts を足したり、Streamable HTTP で公開したりしやすい。

複数ツール・Resources・HTTP を含むより complete な例は、[MCP 公式ドキュメント - Build a server](https://modelcontextprotocol.io/docs/develop/build-server) と [Python SDK ドキュメント](https://modelcontextprotocol.github.io/python-sdk/) を参照できる。

単一の Tool に慣れたあと、**Resources**（例：特定種別のファイル内容を読む）や **Prompts**（例：週次レポート用テンプレート）を Server に足し、Cursor などの Host でツール・リソース・プロンプトの三つをいっしょに使うと、MCP が AI を「静的生成」から「動的実行」へどう広げるかを、より体感しやすくなる。

---

## 五、運用するうえでの注意

### 5.1 プロトコルバージョンと互換性

- MCP は**プロトコルバージョン**（例：`2025-06-18`）で互換をとる。ハンドシェイク時に Client/Server がバージョンをネゴシエートし、一致しない場合は接続を断てる。
- 仕様は [modelcontextprotocol.io](https://modelcontextprotocol.io) でコミュニティが保守しており、新機能はバージョン更新で追加される。  
  導入時は、両者が対応する同じバージョンを使い、SDK や公式ドキュメントの更新に注意しておく。

### 5.2 権限とセキュリティ

- **最小権限**：Server は業務に必要なツール・リソースだけを公開し、「何でもできる API」にしない。
- **隔離して運用**：Server は可能なら独立プロセス・コンテナなど制限された環境で動かし、誤用されてもホストの重要部分に直接触れないようにする。
- **通信と認証**：リモートの Server は HTTPS とし、必要に応じて Bearer、API Key、OAuth などで認証する。ローカル stdio の場合は、「誰がその Server を起動できるか」「どの Host から接続できるか」を制御する。
- **入力検証**：Server 内でパラメータ（パス・ID・権限など）を厳しくチェックし、インジェクションや越権を減らす。

### 5.3 ログと運用

- **STDIO の Server では stdout に書かない**：ログは必ず stderr かファイルに出し、JSON-RPC のメッセージを壊さないようにする。
- **エラーは規格どおり返す**：実行失敗時は `isError: true` や JSON-RPC の error で明確に返し、Host とユーザーが原因を把握しやすくする。
- **タイムアウトとリトライ**：Client 側で呼び出しにタイムアウトを設ける。一時障害には限定的なリトライを入れてもよいが、無限リトライで問題を増幅しないようにする。

### 5.4 クロスプラットフォームと言語

- MCP には複数言語の SDK（Python、TypeScript、Java、Go、Rust など）があり、同じプロトコルを異なるスタックで実装できる。
- stdio と HTTP の二種のトランスポートは、どの環境でも利用できる。多くの場合「ローカル・開発は stdio、本番・リモートは HTTP」という分担でよい。

---

## 六、セキュリティと権限の考え方（要約）

MCP ですべてのリスクが消えるわけではないが、「モデルが何をできるか」を**列挙・設定・監査可能なインターフェース**にしている：

- **実行の境界**：モデルは Server が公開したツールだけを呼べる。任意のコード実行はできない。「どのツールを有効にするか」で実行範囲を決められる。
- **データの境界**：センシティブなデータは Server がアクセスし、返す前にマスキング・認可・フィルタを行う。モデルが触れられるのは、許可した部分だけ。
- **監査**：ツール呼び出しをログに残し（誰が・いつ・どのツールを・どのパラメータで・結果の要約）、事後の調査やコンプライアンスに使える。
- **残るリスクと対策**：プロンプトインジェクション・悪意のあるパラメータ・ツールの濫用などは残る。Server 側の検証、Host 側での確認（とくに敏感な操作）、モニタリングとテストで補う必要がある。

MCP を「何でも許す」窓ではなく、既存の権限・監査の仕組みの一部として組み込む方が安全である。

---

## 七、参照リンク

- [MCP 公式サイトと仕様](https://modelcontextprotocol.io)  
- [MCP ドキュメント：アーキテクチャ概要](https://modelcontextprotocol.io/docs/concepts/architecture)  
- [MCP ドキュメント：Server の構築](https://modelcontextprotocol.io/docs/develop/build-server)  
- [Python SDK](https://modelcontextprotocol.github.io/python-sdk/)  
- [MCP Inspector（デバッグ用）](https://github.com/modelcontextprotocol/inspector)
