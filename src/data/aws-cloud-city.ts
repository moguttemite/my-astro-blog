// AWS 云城市（SAA 学习版）双语数据
// 页面组件：src/components/AwsCloudCity.astro
// 路由：/aws/cloud-city/（中文）与 /ja/aws/cloud-city/（日文）
// 结构性数据（颜色、坐标、学习顺序、关联关系）中日共用，文案按语言拆分。

export type CloudCityLocale = 'zh' | 'ja';

type LText = { zh: string; ja: string };

interface StageDef {
  color: string;
  name: LText;
  weeks: LText;
  desc: LText;
  goal: LText;
}

interface DistrictDef {
  color: number;
  accent: string;
  emoji: string;
  angle: number;
  label: LText;
}

interface ServiceDef {
  id: string;
  name: string;
  district: string;
  shape: 'box' | 'cylinder' | 'sphere' | 'cone';
  face: string;
  stage: number;
  order: number;
  weight: 'core' | 'high' | 'regular' | 'aware';
  related: string[];
  label: LText;
  exam: LText;
  personify: LText;
  role: LText;
}

const STAGES_DEF: Record<number, StageDef> = {
  1: {
    color: '#ff7043',
    name: { zh: '云基石', ja: 'クラウドの基礎' },
    weeks: { zh: '第 1-2 周', ja: '第 1〜2 週' },
    desc: {
      zh: '先搞懂账号权限、网络、计算、存储这几块地基——所有 AWS 架构都建立在它们之上。这 5 个服务贯穿 SAA 全卷。',
      ja: 'まずはアカウント権限・ネットワーク・コンピューティング・ストレージという土台を固めましょう。すべての AWS アーキテクチャはこの上に成り立ち、この 5 つのサービスは SAA 試験全体を貫きます。',
    },
    goal: {
      zh: '🎯 阶段目标：能独立启动一台安全的 EC2，放进自己规划的 VPC，用 IAM 控制权限，把文件存进 S3。',
      ja: '🎯 フェーズ目標：安全な EC2 を自分で設計した VPC に配置し、IAM で権限を管理し、ファイルを S3 に保存できるようになる。',
    },
  },
  2: {
    color: '#42a5f5',
    name: { zh: '高可用架构', ja: '高可用性アーキテクチャ' },
    weeks: { zh: '第 3-4 周', ja: '第 3〜4 週' },
    desc: {
      zh: 'SAA 考试的灵魂：如何让系统扛住故障和流量。负载均衡、DNS、CDN、各类数据库的选型是最高频的出题区。',
      ja: 'SAA 試験の核心：障害やトラフィックに耐えるシステムをどう作るか。ロードバランサー、DNS、CDN、各種データベースの選定は最頻出の出題エリアです。',
    },
    goal: {
      zh: '🎯 阶段目标：能设计经典三层高可用架构，并说清 RDS Multi-AZ 与只读副本、各数据库的适用场景。',
      ja: '🎯 フェーズ目標：定番の 3 層高可用性アーキテクチャを設計でき、RDS Multi-AZ とリードレプリカの違い、各データベースの適用シーンを説明できる。',
    },
  },
  3: {
    color: '#66bb6a',
    name: { zh: '解耦与无服务器', ja: '疎結合とサーバーレス' },
    weeks: { zh: '第 5-6 周', ja: '第 5〜6 週' },
    desc: {
      zh: '现代架构的主流：事件驱动、按需付费、自动伸缩。「运维最少的方案」类考题答案几乎都在这里。',
      ja: 'モダンアーキテクチャの主流：イベント駆動・従量課金・自動スケーリング。「運用負荷が最小の構成」を問う問題の答えは、ほぼここにあります。',
    },
    goal: {
      zh: '🎯 阶段目标：能搭出 API Gateway → Lambda → DynamoDB 无服务器应用，懂 SQS/SNS 解耦和扇出模式。',
      ja: '🎯 フェーズ目標：API Gateway → Lambda → DynamoDB のサーバーレスアプリを構築でき、SQS/SNS による疎結合とファンアウトパターンを理解する。',
    },
  },
  4: {
    color: '#ab47bc',
    name: { zh: '安全运维与扩展', ja: 'セキュリティ・運用・応用' },
    weeks: { zh: '第 7-8 周', ja: '第 7〜8 週' },
    desc: {
      zh: '补齐加密、审计、监控、基础设施即代码，最后扫一遍数据分析与 AI 服务（考得少、认识即可），然后冲刺刷题。',
      ja: '暗号化・監査・モニタリング・IaC を仕上げ、最後にデータ分析と AI サービスをひと通り確認（出題は少なめ、概要理解で OK）したら、問題演習のラストスパートへ。',
    },
    goal: {
      zh: '🎯 阶段目标：能回答「数据如何加密」「谁动了我的资源」「如何自动化部署」三类问题，进入刷题冲刺。',
      ja: '🎯 フェーズ目標：「データをどう暗号化するか」「誰がリソースを操作したか」「どう自動デプロイするか」の 3 つに答えられるようになり、演習フェーズへ。',
    },
  },
};

const DISTRICTS_DEF: Record<string, DistrictDef> = {
  compute: { color: 0xff7043, accent: '#ff7043', emoji: '⚙️', angle: 0, label: { zh: '计算街区', ja: 'コンピュート街区' } },
  storage: { color: 0xffc107, accent: '#ffc107', emoji: '📦', angle: 45, label: { zh: '存储仓库区', ja: 'ストレージ倉庫街' } },
  database: { color: 0x42a5f5, accent: '#42a5f5', emoji: '📚', angle: 90, label: { zh: '数据库图书馆', ja: 'データベース図書館' } },
  network: { color: 0x26c6da, accent: '#26c6da', emoji: '🛣️', angle: 135, label: { zh: '交通枢纽区', ja: '交通ハブ地区' } },
  security: { color: 0xab47bc, accent: '#ab47bc', emoji: '🛡️', angle: 180, label: { zh: '安全护卫队', ja: 'セキュリティ護衛隊' } },
  ai: { color: 0xec407a, accent: '#ec407a', emoji: '🧠', angle: 225, label: { zh: 'AI 实验室', ja: 'AI ラボ' } },
  integration: { color: 0x66bb6a, accent: '#66bb6a', emoji: '📡', angle: 270, label: { zh: '通讯中心', ja: 'メッセージングセンター' } },
  management: { color: 0x90a4ae, accent: '#90a4ae', emoji: '📋', angle: 315, label: { zh: '运维管理部', ja: '運用管理部' } },
};

const WEIGHTS_DEF: Record<string, { color: string; label: LText }> = {
  core: { color: '#ff5252', label: { zh: '核心考点', ja: '最頻出' } },
  high: { color: '#ffb300', label: { zh: '高频考点', ja: '頻出' } },
  regular: { color: '#4ecdc4', label: { zh: '常规考点', ja: '標準' } },
  aware: { color: '#9e9e9e', label: { zh: '了解即可', ja: '概要でOK' } },
};

const SERVICES_DEF: ServiceDef[] = [
  // ---------- 计算 / コンピュート ----------
  {
    id: 'ec2', name: 'EC2', district: 'compute', shape: 'box', face: '😎',
    stage: 1, order: 3, weight: 'core',
    related: ['ebs', 's3', 'vpc', 'elb', 'iam', 'cloudwatch'],
    label: { zh: '弹性计算云', ja: '仮想サーバー' },
    exam: {
      zh: '购买选项成本对比必考：按需（灵活）、预留/Savings Plans（长期稳定省钱）、Spot（可中断、最便宜）。还要掌握实例类型家族（通用/计算/内存优化）、置放群组（集群/分区/分布）、实例存储与 EBS 的区别。',
      ja: '購入オプションのコスト比較は必出：オンデマンド（柔軟）、リザーブド/Savings Plans（長期安定でお得）、スポット（中断あり・最安）。さらにインスタンスファミリー（汎用/コンピューティング最適化/メモリ最適化）、プレイスメントグループ（クラスター/パーティション/スプレッド）、インスタンスストアと EBS の違いも押さえましょう。',
    },
    personify: {
      zh: '我是万能老员工 EC2，你可以把我当成一台虚拟电脑。想要多大 CPU、多少内存、什么操作系统，你说了算。我 24 小时待命，租我一天算一天的钱。传统服务器能做的事我都能做，是 AWS 最元老级的角色。',
      ja: '私は何でもこなすベテラン社員 EC2。仮想のパソコンだと思ってください。CPU の性能もメモリの量も OS もあなたの自由。24 時間スタンバイ、借りた分だけの課金です。従来のサーバーにできることは全部できる、AWS 最古参のキャラクターです。',
    },
    role: {
      zh: '提供可伸缩的虚拟服务器，是运行应用最通用的方式。需要管理操作系统和补丁。',
      ja: 'スケーラブルな仮想サーバーを提供する、アプリを動かす最も汎用的な方法。OS やパッチの管理は自分で行う。',
    },
  },
  {
    id: 'lambda', name: 'Lambda', district: 'compute', shape: 'cone', face: '⚡',
    stage: 3, order: 15, weight: 'core',
    related: ['s3', 'dynamodb', 'apigw', 'sns', 'sqs', 'eventbridge'],
    label: { zh: '无服务器函数', ja: 'サーバーレス関数' },
    exam: {
      zh: '记住硬限制：最长 15 分钟、内存 128MB–10GB（CPU 随内存同比提升）。高频场景：S3 事件触发处理文件、配合 API Gateway 做无服务器 API、消费 SQS 消息。「运维最少/按用量付费」类题的常见答案。',
      ja: 'ハードリミットを暗記：最長 15 分、メモリ 128MB〜10GB（CPU はメモリに比例して向上）。頻出シーン：S3 イベントでのファイル処理、API Gateway と組んだサーバーレス API、SQS メッセージの消費。「運用負荷最小/従量課金」系問題の定番解です。',
    },
    personify: {
      zh: '我是闪电快递员 Lambda！平时我根本不存在，但你一有事找我，我 100 毫秒就能到位处理完，然后又消失。不用你管服务器、不用你想扩容，按调用次数付费。懒人的最爱！',
      ja: '私は稲妻配達人 Lambda！普段は存在すらしていませんが、用があれば 100 ミリ秒で駆けつけて処理を終え、また消えます。サーバー管理もスケーリングの心配も不要、呼び出した分だけの課金。面倒くさがり屋さんの最愛です！',
    },
    role: {
      zh: '事件驱动的无服务器函数。上传代码即可，AWS 自动处理运行环境和扩容。',
      ja: 'イベント駆動のサーバーレス関数。コードをアップロードするだけで、実行環境とスケーリングは AWS にお任せ。',
    },
  },
  {
    id: 'ecs', name: 'ECS', district: 'compute', shape: 'box', face: '🐳',
    stage: 3, order: 21, weight: 'regular',
    related: ['fargate', 'ec2', 'ecr', 'alb'],
    label: { zh: '弹性容器服务', ja: 'コンテナオーケストレーション' },
    exam: {
      zh: '分清两种启动类型：EC2 模式（自己管服务器、更省钱）vs Fargate 模式（免运维、按任务付费）。任务角色（Task Role）用于给容器授权访问 AWS 资源。',
      ja: '2 つの起動タイプを区別：EC2 モード（サーバー自己管理・割安）vs Fargate モード（運用レス・タスク単位課金）。タスクロール（Task Role）でコンテナに AWS リソースへのアクセス権を付与します。',
    },
    personify: {
      zh: '我是集装箱工头 ECS，专门管理 Docker 容器。你把应用打包成集装箱交给我，我负责把它们搬到合适的船上（EC2 或 Fargate），还能自动扩容。',
      ja: '私はコンテナ現場監督 ECS。Docker コンテナの管理が専門です。アプリをコンテナに詰めて渡してくれれば、ちょうどいい船（EC2 か Fargate）に積み込み、自動スケーリングまで面倒を見ます。',
    },
    role: {
      zh: 'AWS 原生的容器编排服务，管理 Docker 容器的部署、扩缩容和监控。',
      ja: 'AWS ネイティブのコンテナオーケストレーションサービス。Docker コンテナのデプロイ・スケーリング・監視を管理。',
    },
  },
  {
    id: 'fargate', name: 'Fargate', district: 'compute', shape: 'cylinder', face: '👻',
    stage: 3, order: 22, weight: 'regular',
    related: ['ecs', 'eks'],
    label: { zh: '无服务器容器', ja: 'サーバーレスコンテナ' },
    exam: {
      zh: '关键词匹配：「容器 + 不想管服务器」→ Fargate。按任务申请的 vCPU 和内存计费，适合波动负载；长期满载跑则 EC2 模式更省钱。',
      ja: 'キーワードマッチ：「コンテナ＋サーバー管理はしたくない」→ Fargate。タスクごとに要求した vCPU とメモリで課金され、変動する負荷に最適。常時フル稼働なら EC2 モードのほうが割安です。',
    },
    personify: {
      zh: '我是隐形工人 Fargate。和 ECS/EKS 搭档时，你不用再管底层服务器——容器要多少 CPU 和内存，我就变出来多少，用完就走。',
      ja: '私は透明人間の作業員 Fargate。ECS/EKS と組めば、下回りのサーバー管理はもう不要——コンテナに必要な CPU とメモリを言ってくれれば、その分だけ現れて、使い終わったら去っていきます。',
    },
    role: {
      zh: '无需管理服务器的容器运行时，按容器资源付费。',
      ja: 'サーバー管理不要のコンテナ実行環境。コンテナのリソース分だけ課金。',
    },
  },
  {
    id: 'eks', name: 'EKS', district: 'compute', shape: 'box', face: '☸️',
    stage: 3, order: 23, weight: 'aware',
    related: ['fargate', 'ec2'],
    label: { zh: '托管 Kubernetes', ja: 'マネージド Kubernetes' },
    exam: {
      zh: '关键词匹配：题目出现「Kubernetes / 多云可移植 / 已有 K8s 工作负载」→ EKS；纯 AWS 原生容器需求 → ECS 就够了。SAA 里通常只考到选型层面。',
      ja: 'キーワードマッチ：問題文に「Kubernetes / マルチクラウド移植性 / 既存の K8s ワークロード」→ EKS。AWS ネイティブなコンテナ需要だけなら ECS で十分。SAA では選定レベルの出題が中心です。',
    },
    personify: {
      zh: '我是 K8s 大管家 EKS。Kubernetes 很强但很复杂？没关系，我帮你托管控制平面，你只要管工作负载就行。对大型企业和复杂微服务很友好。',
      ja: '私は K8s の執事 EKS。Kubernetes は強力だけど複雑？ご安心を。コントロールプレーンは私がお預かりします。あなたはワークロードの管理だけ。大企業や複雑なマイクロサービスと相性抜群です。',
    },
    role: {
      zh: '托管的 Kubernetes 服务，适合复杂的容器化应用和多云策略。',
      ja: 'マネージド Kubernetes サービス。複雑なコンテナアプリやマルチクラウド戦略に適する。',
    },
  },

  // ---------- 存储 / ストレージ ----------
  {
    id: 's3', name: 'S3', district: 'storage', shape: 'cylinder', face: '🗄️',
    stage: 1, order: 5, weight: 'core',
    related: ['cloudfront', 'glacier', 'lambda', 'athena', 'kms'],
    label: { zh: '简单存储服务', ja: 'オブジェクトストレージ' },
    exam: {
      zh: '存储类别 + 生命周期策略几乎每卷必考：Standard → Standard-IA → One Zone-IA → Glacier 系列，按访问频率降级省钱。另需掌握：版本控制防误删、三种服务端加密（SSE-S3/SSE-KMS/SSE-C）、预签名 URL 临时授权、跨区域复制（CRR）。',
      ja: 'ストレージクラス＋ライフサイクルポリシーはほぼ毎回出題：Standard → Standard-IA → One Zone-IA → Glacier 系へ、アクセス頻度に応じて移行してコスト削減。さらに：バージョニングによる誤削除対策、3 種類のサーバーサイド暗号化（SSE-S3/SSE-KMS/SSE-C）、署名付き URL での一時的なアクセス許可、クロスリージョンレプリケーション（CRR）も必修です。',
    },
    personify: {
      zh: '我是无限仓库管理员 S3，接收任何格式、任何大小的文件。你扔进来一张图、一段视频、一个备份，我保证 99.999999999%（11 个 9）的持久性。图片、视频、日志、网站、数据湖——全塞给我。',
      ja: '私は無限倉庫の管理人 S3。どんな形式・サイズのファイルも受け入れます。画像でも動画でもバックアップでも、放り込めば 99.999999999%（イレブンナイン）の耐久性で保管。画像、動画、ログ、ウェブサイト、データレイク——全部お任せください。',
    },
    role: {
      zh: '对象存储服务，几乎无限容量，是 AWS 最核心的存储服务和数据湖基础。',
      ja: 'オブジェクトストレージサービス。ほぼ無限の容量を持つ、AWS の中核ストレージでありデータレイクの基盤。',
    },
  },
  {
    id: 'ebs', name: 'EBS', district: 'storage', shape: 'box', face: '💽',
    stage: 1, order: 4, weight: 'high',
    related: ['ec2', 's3'],
    label: { zh: '块存储卷', ja: 'ブロックストレージ' },
    exam: {
      zh: '卷类型选择题：gp3（通用默认）、io2（高 IOPS 数据库）、st1（大吞吐流式）、sc1（冷数据最便宜）。记住两点：EBS 只能挂载到同一可用区的 EC2；快照是增量的且存到 S3，可跨区复制。',
      ja: 'ボリュームタイプの選択問題：gp3（汎用のデフォルト）、io2（高 IOPS のデータベース向け）、st1（高スループットのストリーミング向け）、sc1（コールドデータ最安）。2 点覚える：EBS は同一 AZ の EC2 にしかアタッチできない。スナップショットは増分方式で S3 に保存され、リージョン間コピーも可能。',
    },
    personify: {
      zh: '我是 EC2 的贴身硬盘小跟班 EBS。EC2 跑到哪我跟到哪，给它当系统盘或数据盘。可以快照备份、随时扩容，就像你电脑里的那块 SSD。',
      ja: '私は EC2 の専属ハードディスク EBS。EC2 の行くところどこへでもついて行き、システムディスクやデータディスクを務めます。スナップショットでバックアップ、いつでも容量拡張。あなたの PC に入っている SSD みたいな存在です。',
    },
    role: {
      zh: '为 EC2 提供持久块存储，类似物理服务器的硬盘。',
      ja: 'EC2 に永続的なブロックストレージを提供。物理サーバーのハードディスクに相当。',
    },
  },
  {
    id: 'efs', name: 'EFS', district: 'storage', shape: 'cylinder', face: '📁',
    stage: 2, order: 13, weight: 'regular',
    related: ['ec2'],
    label: { zh: '弹性文件系统', ja: '共有ファイルシステム' },
    exam: {
      zh: '三者对比是考点：EBS（单 AZ、单实例挂载）vs EFS（多 AZ、多实例共享、仅 Linux/NFS）vs FSx（Windows 文件共享用 FSx for Windows）。题目出现「多台 EC2 共享 POSIX 文件系统」→ EFS。',
      ja: '3 者比較が出題ポイント：EBS（単一 AZ・単一インスタンス）vs EFS（マルチ AZ・複数インスタンスで共有・Linux/NFS のみ）vs FSx（Windows ファイル共有は FSx for Windows）。「複数の EC2 で POSIX ファイルシステムを共有」→ EFS。',
    },
    personify: {
      zh: '我是共享文件柜 EFS。多台 EC2 想同时读写同一份文件？我来！我是 NFS 协议的托管版，容量自动伸缩，适合内容管理、开发环境共享。',
      ja: '私は共有ファイルキャビネット EFS。複数の EC2 が同じファイルを同時に読み書きしたい？お任せください！NFS プロトコルのマネージド版で、容量は自動で伸縮。CMS や開発環境の共有にぴったりです。',
    },
    role: {
      zh: '可被多个 EC2 同时挂载的共享文件系统（NFS 协议）。',
      ja: '複数の EC2 から同時にマウントできる共有ファイルシステム（NFS プロトコル）。',
    },
  },
  {
    id: 'glacier', name: 'Glacier', district: 'storage', shape: 'cone', face: '🧊',
    stage: 2, order: 14, weight: 'high',
    related: ['s3'],
    label: { zh: '冰川归档', ja: 'アーカイブストレージ' },
    exam: {
      zh: '作为 S3 存储类别的一部分考：取回时效分加急（分钟级）/标准（小时级）/批量（更久更便宜）；Deep Archive 是全 AWS 最便宜的存储，取回要 12 小时以上。「合规要求保留 7 年、几乎不访问」→ Glacier/Deep Archive。',
      ja: 'S3 ストレージクラスの一部として出題：取り出しは迅速（数分）/標準（数時間）/バルク（さらに時間はかかるが安い）。Deep Archive は AWS 最安のストレージで、取り出しに 12 時間以上。「コンプライアンスで 7 年保存、ほぼアクセスなし」→ Glacier/Deep Archive。',
    },
    personify: {
      zh: '我是冰窖守护者 Glacier。我存东西超便宜，但你要取出来得等几分钟到几小时——因为我要先把它从冰里挖出来。合规审计日志、很少访问的老档案最适合住我这儿。',
      ja: '私は氷室の番人 Glacier。保管料は激安ですが、取り出すには数分〜数時間お待ちを——まず氷の中から掘り出さないといけないので。監査ログや滅多に開かない古い資料の住まいに最適です。',
    },
    role: {
      zh: '极低成本的归档存储，适合长期保留但极少访问的数据。',
      ja: '超低コストのアーカイブストレージ。長期保存でほとんどアクセスしないデータ向け。',
    },
  },

  // ---------- 数据库 / データベース ----------
  {
    id: 'rds', name: 'RDS', district: 'database', shape: 'cylinder', face: '📖',
    stage: 2, order: 9, weight: 'core',
    related: ['ec2', 'vpc', 'kms', 'elasticache', 'cloudwatch'],
    label: { zh: '关系数据库服务', ja: 'リレーショナルデータベース' },
    exam: {
      zh: '必考对比：Multi-AZ（同步复制、为高可用、故障自动切换、不能分担读）vs 只读副本（异步复制、为扩展读性能、可跨区）。两者目的完全不同，题目常故意混淆。另记：自动备份保留最多 35 天，手动快照永久。',
      ja: '必出の比較：Multi-AZ（同期レプリケーション・高可用性が目的・自動フェイルオーバー・読み取り分散は不可）vs リードレプリカ（非同期レプリケーション・読み取り性能の拡張が目的・クロスリージョン可）。目的がまったく違うのに、問題文はわざと混同させてきます。もう 1 点：自動バックアップの保持は最大 35 日、手動スナップショットは無期限。',
    },
    personify: {
      zh: '我是传统图书管理员 RDS，熟悉 MySQL、PostgreSQL、Oracle、SQL Server 等各种关系型数据库。我帮你处理备份、打补丁、主从复制——你只管写 SQL。',
      ja: '私は伝統ある図書館司書 RDS。MySQL、PostgreSQL、Oracle、SQL Server など各種リレーショナルデータベースに精通しています。バックアップ、パッチ適用、レプリケーションは私にお任せ——あなたは SQL を書くだけ。',
    },
    role: {
      zh: '托管的关系型数据库服务，适合结构化事务性数据。',
      ja: 'マネージドなリレーショナルデータベースサービス。構造化されたトランザクションデータに最適。',
    },
  },
  {
    id: 'dynamodb', name: 'DynamoDB', district: 'database', shape: 'box', face: '🚀',
    stage: 2, order: 12, weight: 'high',
    related: ['lambda', 'apigw', 'kms'],
    label: { zh: 'NoSQL 数据库', ja: 'NoSQL データベース' },
    exam: {
      zh: '关键词匹配：「毫秒级延迟 + 海量键值/会话/购物车 + 无服务器」→ DynamoDB。容量模式：按需（流量不可预测）vs 预置（稳定省钱）。DAX 是它专属的微秒级缓存；全局表实现多区域多活。',
      ja: 'キーワードマッチ：「ミリ秒レイテンシー＋大量のキーバリュー/セッション/カート＋サーバーレス」→ DynamoDB。キャパシティモード：オンデマンド（トラフィック予測不能）vs プロビジョンド（安定していれば割安）。DAX は専用のマイクロ秒キャッシュ。グローバルテーブルでマルチリージョンのアクティブ・アクティブ構成を実現。',
    },
    personify: {
      zh: '我是闪电查询员 DynamoDB！Key-Value 和文档数据我最擅长，单位数毫秒响应、每秒百万次请求。无服务器、自动扩容，游戏排行榜、会话、购物车都爱我。',
      ja: '私は電光石火のクエリ係 DynamoDB！Key-Value とドキュメントデータが得意分野。1 桁ミリ秒の応答、毎秒数百万リクエスト。サーバーレスで自動スケール。ゲームのランキングもセッションもショッピングカートも、みんな私に夢中です。',
    },
    role: {
      zh: '托管的 NoSQL 数据库，极低延迟，无服务器架构。',
      ja: 'マネージド NoSQL データベース。超低レイテンシーのサーバーレスアーキテクチャ。',
    },
  },
  {
    id: 'aurora', name: 'Aurora', district: 'database', shape: 'cylinder', face: '🌟',
    stage: 2, order: 10, weight: 'high',
    related: ['rds', 'vpc'],
    label: { zh: 'Aurora 数据库', ja: 'クラウドネイティブ DB' },
    exam: {
      zh: '记三个卖点：数据自动 6 副本跨 3 个可用区、兼容 MySQL/PostgreSQL 且更快、最多 15 个只读副本。Aurora Serverless 适合间歇性/不可预测负载；Global Database 做跨区域容灾（RPO 秒级）。',
      ja: '3 つのセールスポイントを暗記：データは 3 つの AZ に自動で 6 コピー、MySQL/PostgreSQL 互換でより高速、リードレプリカは最大 15 個。Aurora Serverless は断続的/予測不能な負荷向け。Global Database はクロスリージョンの災害対策（RPO 秒単位）。',
    },
    personify: {
      zh: '我是飞行图书馆 Aurora，AWS 自研的 MySQL/PostgreSQL 兼容引擎，比原版快 3-5 倍。数据自动六副本跨三可用区，故障秒级切换，企业级的心头好。',
      ja: '私は空飛ぶ図書館 Aurora。AWS が自社開発した MySQL/PostgreSQL 互換エンジンで、オリジナルの 3〜5 倍高速。データは 3 つの AZ に自動で 6 コピー、障害時は秒単位で切り替え。エンタープライズのお気に入りです。',
    },
    role: {
      zh: 'AWS 自研的云原生关系型数据库，高性能高可用。',
      ja: 'AWS 自社開発のクラウドネイティブなリレーショナルデータベース。高性能・高可用性。',
    },
  },
  {
    id: 'elasticache', name: 'ElastiCache', district: 'database', shape: 'sphere', face: '🧠',
    stage: 2, order: 11, weight: 'regular',
    related: ['rds', 'ec2', 'lambda'],
    label: { zh: '缓存服务', ja: 'インメモリキャッシュ' },
    exam: {
      zh: 'Redis vs Memcached 选择题：需要持久化、主从复制、排行榜（Sorted Set）→ Redis；只要简单多线程缓存 → Memcached。典型场景：给 RDS 减压、存会话让应用无状态化。',
      ja: 'Redis vs Memcached の選択問題：永続化・レプリケーション・ランキング（Sorted Set）が必要 → Redis。シンプルなマルチスレッドキャッシュだけでよい → Memcached。典型シーン：RDS の負荷軽減、セッション保存によるアプリのステートレス化。',
    },
    personify: {
      zh: '我是记忆大师 ElastiCache，基于 Redis 或 Memcached。把 RDS 查过的热点数据先放我这，下次访问微秒级返回。会话存储、排行榜、游戏状态——让我来缓存。',
      ja: '私は記憶の達人 ElastiCache。Redis や Memcached がベースです。RDS で引いたホットデータを私に預けておけば、次のアクセスはマイクロ秒で返答。セッション保存、ランキング、ゲームの状態——キャッシュは私にお任せ。',
    },
    role: {
      zh: '内存缓存服务，大幅降低数据库压力和响应时间。',
      ja: 'インメモリキャッシュサービス。データベースの負荷と応答時間を大幅に削減。',
    },
  },
  {
    id: 'redshift', name: 'Redshift', district: 'database', shape: 'box', face: '📊',
    stage: 4, order: 32, weight: 'regular',
    related: ['s3', 'athena'],
    label: { zh: '数据仓库', ja: 'データウェアハウス' },
    exam: {
      zh: 'OLTP vs OLAP 区分题：日常事务读写 → RDS；PB 级历史数据分析/BI 报表 → Redshift。Redshift Spectrum 可以直接查询 S3 上的数据而无需加载。顺带认识 Athena：临时性、按查询付费的 S3 SQL 查询。',
      ja: 'OLTP vs OLAP の区別問題：日常のトランザクション読み書き → RDS。PB 級の履歴データ分析/BI レポート → Redshift。Redshift Spectrum は S3 上のデータをロードせずに直接クエリ可能。ついでに Athena も：アドホックでクエリ単位課金の S3 向け SQL クエリサービス。',
    },
    personify: {
      zh: '我是数据仓库巨人 Redshift，专门做 OLAP 分析。PB 级数据我也能秒级查询，列式存储 + MPP 架构。BI 报表、商业分析的主力。',
      ja: '私はデータウェアハウスの巨人 Redshift。OLAP 分析が専門です。PB 級のデータでも秒単位でクエリ、列指向ストレージ＋MPP アーキテクチャ。BI レポートやビジネス分析の主力です。',
    },
    role: {
      zh: 'PB 级数据仓库，面向分析和商业智能场景。',
      ja: 'PB 級のデータウェアハウス。分析とビジネスインテリジェンス向け。',
    },
  },

  // ---------- 网络 / ネットワーク ----------
  {
    id: 'vpc', name: 'VPC', district: 'network', shape: 'box', face: '🏘️',
    stage: 1, order: 2, weight: 'core',
    related: ['ec2', 'rds', 'elb', 'subnet'],
    label: { zh: '虚拟私有云', ja: '仮想プライベートクラウド' },
    exam: {
      zh: '必须吃透：公有子网（有路由到 IGW）vs 私有子网；NAT 网关让私有子网出网（托管、放公有子网）；安全组（实例级、有状态、只有允许规则）vs NACL（子网级、无状态、有允许和拒绝）——这对区别几乎每卷必考。VPC Endpoint 让内网直连 S3/DynamoDB 不走公网。',
      ja: '完全理解が必須：パブリックサブネット（IGW へのルートあり）vs プライベートサブネット。NAT ゲートウェイはプライベートサブネットからの外向き通信用（マネージド・パブリックサブネットに配置）。セキュリティグループ（インスタンス単位・ステートフル・許可ルールのみ）vs NACL（サブネット単位・ステートレス・許可と拒否の両方）——この違いはほぼ毎回出題。VPC エンドポイントを使えばインターネットを経由せず S3/DynamoDB に直結できます。',
    },
    personify: {
      zh: '我是私人社区 VPC，你在 AWS 里的专属地盘。你可以设计子网、路由表、网关，决定哪些资源能互相访问、哪些能上网。EC2、RDS 都住在我里面。',
      ja: '私はプライベートタウン VPC。AWS 上のあなた専用の土地です。サブネット、ルートテーブル、ゲートウェイを設計して、どのリソース同士が通信でき、どれがインターネットに出られるかを決められます。EC2 も RDS も私の中に住んでいます。',
    },
    role: {
      zh: '隔离的虚拟网络环境，所有网络资源的基础。',
      ja: '分離された仮想ネットワーク環境。すべてのネットワークリソースの基盤。',
    },
  },
  {
    id: 'route53', name: 'Route 53', district: 'network', shape: 'cone', face: '📬',
    stage: 2, order: 7, weight: 'high',
    related: ['cloudfront', 'elb', 's3'],
    label: { zh: 'DNS 路由', ja: 'DNS ルーティング' },
    exam: {
      zh: '路由策略区分必考：简单/加权（灰度发布按比例分流）/延迟（就近最快）/故障转移（主备容灾）/地理位置（合规限制访问地区）。另记：指向 AWS 资源（如 ALB、CloudFront）用 Alias 记录而非 CNAME，根域名只能用 Alias。',
      ja: 'ルーティングポリシーの区別は必出：シンプル/加重（カナリアリリースの比率分配）/レイテンシー（最速の拠点へ）/フェイルオーバー（プライマリ・スタンバイの災害対策）/位置情報（地域によるアクセス制限）。もう 1 点：ALB や CloudFront など AWS リソースへは CNAME ではなく Alias レコードを使う。Zone Apex（ルートドメイン）は Alias のみ。',
    },
    personify: {
      zh: '我是智能邮递员 Route 53，你域名背后的快递分拣员。把 example.com 转成 IP 地址，还能按地理位置、延迟、健康状态智能分流用户到最近的机房。',
      ja: '私はスマート郵便屋 Route 53。ドメイン名の裏で働く仕分け係です。example.com を IP アドレスに変換し、位置情報・レイテンシー・ヘルス状態に応じてユーザーを最寄りのサーバーへ賢く振り分けます。',
    },
    role: {
      zh: 'DNS 服务与流量路由，是全球分发的入口。',
      ja: 'DNS サービスとトラフィックルーティング。グローバル配信の入り口。',
    },
  },
  {
    id: 'cloudfront', name: 'CloudFront', district: 'network', shape: 'cylinder', face: '🌍',
    stage: 2, order: 8, weight: 'high',
    related: ['s3', 'elb', 'route53', 'waf'],
    label: { zh: 'CDN 分发', ja: 'CDN 配信' },
    exam: {
      zh: '经典组合：S3 静态网站 + CloudFront 加速 + OAC（源访问控制）禁止用户绕过 CDN 直接访问 S3。「全球用户访问慢」类题目的标准答案。可搭配 WAF 防攻击、ACM 免费 HTTPS 证书。',
      ja: '定番の組み合わせ：S3 静的サイト＋CloudFront 高速化＋OAC（オリジンアクセスコントロール）で CDN を迂回した S3 への直接アクセスを禁止。「世界中のユーザーのアクセスが遅い」系問題の標準解。WAF での攻撃対策、ACM の無料 HTTPS 証明書とも組み合わせ可能。',
    },
    personify: {
      zh: '我是全球分发员 CloudFront，在全世界几百个节点放你的内容副本。用户从最近的节点拿数据，又快又省带宽。视频、网站、API 都能加速。',
      ja: '私はグローバル配達員 CloudFront。世界中の数百の拠点にあなたのコンテンツのコピーを配置します。ユーザーは最寄りの拠点からデータを取得できて、速いうえに帯域も節約。動画もサイトも API も高速化します。',
    },
    role: {
      zh: '全球 CDN 服务，缓存内容到边缘节点加速访问。',
      ja: 'グローバル CDN サービス。エッジロケーションにコンテンツをキャッシュしてアクセスを高速化。',
    },
  },
  {
    id: 'elb', name: 'ELB', district: 'network', shape: 'cone', face: '🚦',
    stage: 2, order: 6, weight: 'core',
    related: ['ec2', 'ecs', 'cloudfront', 'waf'],
    label: { zh: '负载均衡器', ja: 'ロードバランサー' },
    exam: {
      zh: 'ALB vs NLB 选择必考：HTTP/HTTPS、按路径/主机名路由 → ALB（七层）；TCP/UDP、超高性能、需要固定 IP → NLB（四层）。搭配 Auto Scaling Group + 健康检查 = 高可用架构的标准三件套。',
      ja: 'ALB vs NLB の選択は必出：HTTP/HTTPS、パス/ホスト名ベースのルーティング → ALB（レイヤー 7）。TCP/UDP、超高性能、固定 IP が必要 → NLB（レイヤー 4）。Auto Scaling グループ＋ヘルスチェックと組み合わせれば、高可用性アーキテクチャの定番 3 点セット。',
    },
    personify: {
      zh: '我是交通警察 ELB，站在你服务的门口，把流量均匀分给后端多台服务器。有 ALB（应用层）、NLB（网络层）、GLB（网关层）三种姿势，哪个都能扛住高并发。',
      ja: '私は交通整理の警察官 ELB。サービスの入り口に立ち、トラフィックを後ろの複数サーバーへ均等に振り分けます。ALB（アプリケーション層）、NLB（ネットワーク層）、GLB（ゲートウェイ層）の 3 つの構えで、どんな高負荷もさばきます。',
    },
    role: {
      zh: '把流量分发到多个后端实例，实现高可用和横向扩展。',
      ja: 'トラフィックを複数のバックエンドインスタンスへ分散し、高可用性と水平スケーリングを実現。',
    },
  },
  {
    id: 'apigw', name: 'API Gateway', district: 'network', shape: 'box', face: '🎫',
    stage: 3, order: 16, weight: 'high',
    related: ['lambda', 'dynamodb', 'iam'],
    label: { zh: 'API 网关', ja: 'API ゲートウェイ' },
    exam: {
      zh: '无服务器架构的门面：API Gateway + Lambda + DynamoDB 是 SAA 最经典的无服务器组合。考点：限流（Throttling）保护后端、缓存响应降低延迟、REST API（功能全）vs HTTP API（更便宜更快）。',
      ja: 'サーバーレスアーキテクチャの玄関：API Gateway + Lambda + DynamoDB は SAA で最も定番のサーバーレス構成。ポイント：スロットリングでバックエンドを保護、レスポンスキャッシュでレイテンシー削減、REST API（多機能）vs HTTP API（安くて速い）。',
    },
    personify: {
      zh: '我是门面接待员 API Gateway，所有 HTTP 请求的第一站。我验证调用者、限流、记日志，然后把请求转给 Lambda 或其他后端。RESTful 和 WebSocket 都支持。',
      ja: '私は受付係 API Gateway。すべての HTTP リクエストの最初の窓口です。呼び出し元を検証し、流量を制限し、ログを取ってから、リクエストを Lambda などのバックエンドへ渡します。RESTful も WebSocket も対応。',
    },
    role: {
      zh: 'API 管理服务，处理请求路由、鉴权、限流。',
      ja: 'API 管理サービス。ルーティング、認証、スロットリングを担当。',
    },
  },

  // ---------- 安全 / セキュリティ ----------
  {
    id: 'iam', name: 'IAM', district: 'security', shape: 'box', face: '🗝️',
    stage: 1, order: 1, weight: 'core',
    related: ['ec2', 'lambda', 's3', 'rds', 'kms'],
    label: { zh: '身份与访问管理', ja: 'ID・アクセス管理' },
    exam: {
      zh: '学 AWS 的第一课。必考：用户（人）/组（批量管人）/角色（给服务或跨账号用，临时凭据）的区别——「EC2 访问 S3 该怎么授权」的答案永远是 IAM 角色而不是把密钥写进代码。坚持最小权限原则，根账号开 MFA 并束之高阁。',
      ja: 'AWS 学習の第一歩。必出：ユーザー（人）/グループ（人の一括管理）/ロール（サービスやクロスアカウント用・一時的な認証情報）の違い——「EC2 から S3 へアクセスする権限付与」の答えは常に IAM ロールで、アクセスキーをコードに書くことではありません。最小権限の原則を守り、ルートアカウントは MFA を有効にして封印しましょう。',
    },
    personify: {
      zh: '我是身份门卫长 IAM，AWS 里每一次操作都要经过我。谁（用户/角色）能访问什么（资源）、做什么（权限），全凭我签发的令牌说了算。安全的基石就是我。',
      ja: '私は門番隊長 IAM。AWS でのあらゆる操作は私のチェックを通ります。誰（ユーザー/ロール）が何（リソース）にどんな操作（権限）をできるかは、すべて私が発行するトークン次第。セキュリティの礎は私です。',
    },
    role: {
      zh: 'AWS 安全的核心：管理身份、角色、策略和访问权限。',
      ja: 'AWS セキュリティの中核：ID、ロール、ポリシー、アクセス権限を管理。',
    },
  },
  {
    id: 'kms', name: 'KMS', district: 'security', shape: 'cylinder', face: '🔑',
    stage: 4, order: 24, weight: 'high',
    related: ['s3', 'ebs', 'rds', 'dynamodb'],
    label: { zh: '密钥管理', ja: '暗号鍵管理' },
    exam: {
      zh: '「静态数据加密」类题的核心：S3/EBS/RDS 的加密底层都靠 KMS。分清 SSE-S3（AWS 全管）vs SSE-KMS（可审计、可控制密钥、有 API 调用配额）vs SSE-C（客户自带密钥）。EBS 加密卷的快照和副本自动继承加密。',
      ja: '「保存データの暗号化」系問題の核心：S3/EBS/RDS の暗号化は裏側で KMS が支えています。SSE-S3（AWS 全管理）vs SSE-KMS（監査可能・鍵を制御可能・API クォータあり）vs SSE-C（顧客持ち込み鍵）を区別。EBS 暗号化ボリュームのスナップショットとコピーは暗号化を自動継承。',
    },
    personify: {
      zh: '我是钥匙保管员 KMS，专门保管加密用的主密钥。S3 加密、EBS 加密、RDS 加密用的都是我发的钥匙。我把钥匙关在硬件安全模块里，连 AWS 自己都拿不到。',
      ja: '私は鍵の保管人 KMS。暗号化用のマスターキーを預かる専門家です。S3 も EBS も RDS も、暗号化に使う鍵は私が発行したもの。鍵はハードウェアセキュリティモジュールに厳重保管、AWS 自身でも取り出せません。',
    },
    role: {
      zh: '托管加密密钥，为其他服务提供加密能力。',
      ja: '暗号鍵をマネージドで保管し、他のサービスに暗号化機能を提供。',
    },
  },
  {
    id: 'waf', name: 'WAF', district: 'security', shape: 'box', face: '🛡️',
    stage: 4, order: 26, weight: 'regular',
    related: ['cloudfront', 'elb', 'apigw'],
    label: { zh: 'Web 应用防火墙', ja: 'Web ファイアウォール' },
    exam: {
      zh: '关键词匹配：「SQL 注入 / XSS / 恶意爬虫 / 按 IP 或地理位置封禁」→ WAF。只能附加在 CloudFront、ALB、API Gateway 上（注意：不能直接挂在 EC2 或 NLB 上）。',
      ja: 'キーワードマッチ：「SQL インジェクション / XSS / 悪質ボット / IP や地域単位のブロック」→ WAF。アタッチできるのは CloudFront、ALB、API Gateway のみ（注意：EC2 や NLB には直接付けられない）。',
    },
    personify: {
      zh: '我是防火墙战士 WAF，挡在 CloudFront 或 ALB 前面，专门识别 SQL 注入、XSS、恶意爬虫这些坏人。我看到可疑请求就直接 403 伺候。',
      ja: '私はファイアウォール戦士 WAF。CloudFront や ALB の前に立ちはだかり、SQL インジェクション、XSS、悪質クローラーといった悪者を見抜きます。怪しいリクエストには問答無用で 403 をお見舞いします。',
    },
    role: {
      zh: 'Web 层防火墙，抵御常见应用层攻击。',
      ja: 'Web レイヤーのファイアウォール。一般的なアプリケーション層攻撃を防御。',
    },
  },
  {
    id: 'shield', name: 'Shield', district: 'security', shape: 'cone', face: '⚔️',
    stage: 4, order: 27, weight: 'regular',
    related: ['cloudfront', 'route53', 'elb'],
    label: { zh: 'DDoS 防护', ja: 'DDoS 防御' },
    exam: {
      zh: '两句话记牢：Shield Standard 免费且默认开启（防常见三四层 DDoS）；Shield Advanced 付费（约 $3000/月），提供 DDoS 响应团队和费用保护。「防 DDoS」→ Shield，「防 SQL 注入」→ WAF，别混。',
      ja: '2 行で暗記：Shield Standard は無料でデフォルト有効（L3/L4 の一般的な DDoS を防御）。Shield Advanced は有料（約 $3,000/月）で、DDoS 対応チームと費用保護つき。「DDoS 対策」→ Shield、「SQL インジェクション対策」→ WAF。混同注意。',
    },
    personify: {
      zh: '我是盾牌英雄 Shield，对付 DDoS 攻击是我的专长。基础版免费，高级版还能实时响应超大规模攻击。大流量洪水来了？我替你挡。',
      ja: '私は盾の勇者 Shield。DDoS 攻撃への対処が専門です。標準版は無料、アドバンス版なら超大規模攻撃にもリアルタイム対応。大洪水のようなトラフィックが来ても、私が受け止めます。',
    },
    role: {
      zh: 'DDoS 防护服务，保护应用免受流量攻击。',
      ja: 'DDoS 防御サービス。トラフィック攻撃からアプリケーションを守る。',
    },
  },
  {
    id: 'secrets', name: 'Secrets Mgr', district: 'security', shape: 'sphere', face: '🤫',
    stage: 4, order: 25, weight: 'high',
    related: ['rds', 'lambda', 'ec2'],
    label: { zh: '密钥管理器', ja: 'シークレット管理' },
    exam: {
      zh: '对比题常客：Secrets Manager（付费、支持自动轮换数据库密码）vs SSM Parameter Store（标准版免费、不带自动轮换）。题目强调「自动定期轮换凭据」→ Secrets Manager。',
      ja: '比較問題の常連：Secrets Manager（有料・データベースパスワードの自動ローテーション対応）vs SSM Parameter Store（標準枠は無料・自動ローテーションなし）。問題文が「認証情報を定期的に自動ローテーション」と強調 → Secrets Manager。',
    },
    personify: {
      zh: '我是秘密守护者 Secrets Manager。数据库密码、API Key、证书？别再写在代码里了！交给我保管，还能自动定期轮换，应用用的时候再安全地拿。',
      ja: '私は秘密の守り人 Secrets Manager。データベースのパスワード、API キー、証明書？もうコードに書かないで！私に預ければ定期的に自動で取り替えます。アプリは使うときに安全に取りに来れば OK。',
    },
    role: {
      zh: '保管敏感凭据并支持自动轮换。',
      ja: '機密情報を保管し、自動ローテーションに対応。',
    },
  },

  // ---------- AI/ML ----------
  {
    id: 'sagemaker', name: 'SageMaker', district: 'ai', shape: 'box', face: '🔬',
    stage: 4, order: 33, weight: 'aware',
    related: ['s3', 'lambda'],
    label: { zh: '机器学习平台', ja: '機械学習プラットフォーム' },
    exam: {
      zh: 'SAA 只考认知层面：「自己训练/部署自定义机器学习模型」→ SageMaker。不用深入内部组件，能和现成 AI API（Rekognition 等）区分开就行。',
      ja: 'SAA では認知レベルのみ：「独自の機械学習モデルを訓練/デプロイ」→ SageMaker。内部コンポーネントへの深入りは不要、既製の AI API（Rekognition など）と区別できれば OK。',
    },
    personify: {
      zh: '我是 AI 科学家 SageMaker，一站式机器学习平台。数据标注、模型训练、超参调优、部署推理——整个 ML 生命周期我全包。数据科学家和工程师的超级工作台。',
      ja: '私は AI 科学者 SageMaker。ワンストップの機械学習プラットフォームです。データのラベリング、モデル訓練、ハイパーパラメータ調整、推論のデプロイ——ML ライフサイクル全体を私が引き受けます。データサイエンティストとエンジニアのスーパーワークベンチ。',
    },
    role: {
      zh: '全托管的端到端机器学习平台。',
      ja: 'フルマネージドのエンドツーエンド機械学習プラットフォーム。',
    },
  },
  {
    id: 'bedrock', name: 'Bedrock', district: 'ai', shape: 'cylinder', face: '🔮',
    stage: 4, order: 34, weight: 'aware',
    related: ['s3', 'lambda'],
    label: { zh: '生成式 AI 基岩', ja: '生成 AI 基盤' },
    exam: {
      zh: '认知层面：「调用基础大模型构建生成式 AI 应用（无需自己训练）」→ Bedrock。记住它是托管、API 调用式、支持多家模型即可。',
      ja: '認知レベル：「基盤モデルを呼び出して生成 AI アプリを構築（自前の訓練は不要）」→ Bedrock。マネージド・API 呼び出し型・複数ベンダーのモデル対応、と覚えれば OK。',
    },
    personify: {
      zh: '我是大模型先知 Bedrock，AWS 的生成式 AI 门面。Claude、Llama、Titan 等多种基础模型我都有，调 API 就能用，还能用自己的数据做微调和 RAG。',
      ja: '私は大規模モデルの賢者 Bedrock。AWS の生成 AI の顔です。Claude、Llama、Titan など複数の基盤モデルを取り揃え、API を呼ぶだけで利用可能。自社データでのファインチューニングや RAG もできます。',
    },
    role: {
      zh: '托管的生成式 AI 服务，统一访问多家基础模型。',
      ja: 'マネージドな生成 AI サービス。複数の基盤モデルへの統一アクセスを提供。',
    },
  },
  {
    id: 'rekognition', name: 'Rekognition', district: 'ai', shape: 'sphere', face: '👁️',
    stage: 4, order: 35, weight: 'aware',
    related: ['s3', 'lambda'],
    label: { zh: '图像识别', ja: '画像認識' },
    exam: {
      zh: '认知层面：「识别图片/视频内容、人脸比对、内容审核」→ Rekognition。同类现成 AI API 还有 Transcribe（语音转文字）、Polly（文字转语音）、Translate（翻译），考试常放一起做匹配题。',
      ja: '認知レベル：「画像/動画の内容認識、顔照合、コンテンツモデレーション」→ Rekognition。同類の既製 AI API に Transcribe（音声→テキスト）、Polly（テキスト→音声）、Translate（翻訳）があり、まとめてマッチング問題で出がちです。',
    },
    personify: {
      zh: '我是眼力达人 Rekognition。图片里有什么、视频里谁出现了、人脸比对、不雅内容检测——这些视觉分析任务给我，API 调用级别就能出结果。',
      ja: '私は千里眼 Rekognition。画像に何が写っているか、動画に誰が出てきたか、顔の照合、不適切コンテンツの検出——視覚分析のタスクは、API 呼び出しひとつで結果をお届けします。',
    },
    role: {
      zh: '预训练的图像和视频分析 AI 服务。',
      ja: '事前学習済みの画像・動画分析 AI サービス。',
    },
  },

  // ---------- 应用集成 / アプリケーション統合 ----------
  {
    id: 'sqs', name: 'SQS', district: 'integration', shape: 'cylinder', face: '📮',
    stage: 3, order: 17, weight: 'core',
    related: ['lambda', 'ec2', 'sns'],
    label: { zh: '消息队列', ja: 'メッセージキュー' },
    exam: {
      zh: '解耦削峰类题的标准答案。必考：标准队列（至少一次、可能乱序）vs FIFO（严格顺序、恰好一次、吞吐较低）；可见性超时防止消息被重复消费；死信队列（DLQ）收留处理失败的消息；长轮询省钱。',
      ja: '疎結合・ピーク平準化問題の標準解。必出：標準キュー（少なくとも 1 回・順序保証なし）vs FIFO（厳密な順序・正確に 1 回・スループット低め）。可視性タイムアウトで二重処理を防止、デッドレターキュー（DLQ）で処理失敗メッセージを回収、ロングポーリングでコスト削減。',
    },
    personify: {
      zh: '我是排队邮局 SQS，消息进来按顺序排队，消费者按能力取。解耦、削峰、异步处理的绝配。订单系统、邮件发送任务都在我这排队。',
      ja: '私は行列のできる郵便局 SQS。メッセージは順番に並び、消費者は自分のペースで受け取ります。疎結合、ピーク平準化、非同期処理の名パートナー。注文処理もメール送信タスクも、うちで並んでいます。',
    },
    role: {
      zh: '托管的消息队列，实现系统间解耦和异步处理。',
      ja: 'マネージドなメッセージキュー。システム間の疎結合と非同期処理を実現。',
    },
  },
  {
    id: 'sns', name: 'SNS', district: 'integration', shape: 'cone', face: '📢',
    stage: 3, order: 18, weight: 'high',
    related: ['sqs', 'lambda', 'email'],
    label: { zh: '通知服务', ja: '通知サービス' },
    exam: {
      zh: '扇出（Fan-out）模式必考：一条消息同时推给多个 SQS 队列/Lambda，让多个系统并行处理同一事件。区分：SNS 是推（push）、SQS 是拉（pull）；「一对多广播」→ SNS，「排队缓冲」→ SQS。',
      ja: 'ファンアウトパターンは必出：1 つのメッセージを複数の SQS キュー/Lambda へ同時配信し、複数のシステムが同じイベントを並行処理。区別：SNS はプッシュ、SQS はプル。「1 対多のブロードキャスト」→ SNS、「キューでバッファ」→ SQS。',
    },
    personify: {
      zh: '我是广播员 SNS，一呼百应的发布订阅模式。一条消息发给我，我同时喊话给所有订阅者：SQS、Lambda、邮件、短信……扇出分发是我的绝活。',
      ja: '私はアナウンサー SNS。一声かければ皆に届く Pub/Sub モデルです。メッセージを 1 つもらえば、SQS、Lambda、メール、SMS……すべての購読者へ同時に呼びかけます。ファンアウト配信は私の十八番。',
    },
    role: {
      zh: '发布/订阅式消息服务，支持一对多扇出通知。',
      ja: 'Pub/Sub 型メッセージサービス。1 対多のファンアウト通知に対応。',
    },
  },
  {
    id: 'eventbridge', name: 'EventBridge', district: 'integration', shape: 'box', face: '🔀',
    stage: 3, order: 19, weight: 'regular',
    related: ['lambda', 'sqs', 'sns', 'stepfn'],
    label: { zh: '事件总线', ja: 'イベントバス' },
    exam: {
      zh: '两个关键词：定时任务（cron 表达式定时触发 Lambda，取代服务器上的 crontab）和事件规则路由（AWS 资源状态变化、SaaS 事件按规则分发）。它是 CloudWatch Events 的升级版。',
      ja: 'キーワードは 2 つ：スケジュールタスク（cron 式で Lambda を定期起動、サーバー上の crontab を代替）とイベントルールによるルーティング（AWS リソースの状態変化や SaaS イベントをルールで振り分け）。CloudWatch Events の後継です。',
    },
    personify: {
      zh: '我是事件联络员 EventBridge，AWS 原生的事件总线。资源状态变了？定时任务到点了？SaaS 事件？我都能按规则路由到 Lambda、SQS、Step Functions。',
      ja: '私はイベント連絡係 EventBridge。AWS ネイティブのイベントバスです。リソースの状態が変わった？定刻になった？SaaS のイベントが来た？すべてルールに従って Lambda、SQS、Step Functions へルーティングします。',
    },
    role: {
      zh: '无服务器事件总线，连接 AWS 服务和 SaaS 事件驱动架构。',
      ja: 'サーバーレスなイベントバス。AWS サービスと SaaS をつなぐイベント駆動アーキテクチャの中枢。',
    },
  },
  {
    id: 'stepfn', name: 'Step Functions', district: 'integration', shape: 'box', face: '🎭',
    stage: 3, order: 20, weight: 'regular',
    related: ['lambda', 'ecs', 'eventbridge'],
    label: { zh: '步骤工作流', ja: 'ワークフロー' },
    exam: {
      zh: '关键词匹配：「多步骤业务流程 + 需要重试/分支/并行/人工审批」→ Step Functions 状态机编排。Standard（长时间、精确一次）vs Express（高频短任务、至少一次）。',
      ja: 'キーワードマッチ：「複数ステップの業務フロー＋リトライ/分岐/並列/人による承認が必要」→ Step Functions のステートマシン。Standard（長時間・正確に 1 回）vs Express（高頻度の短時間タスク・少なくとも 1 回）。',
    },
    personify: {
      zh: '我是流程指挥家 Step Functions。复杂业务有几十个步骤、要判断、要重试、要并行？你画个状态机给我，我把 Lambda、ECS、SNS 编排成一出完整的戏。',
      ja: '私はフローの指揮者 Step Functions。数十ステップの複雑な業務に、判断もリトライも並列処理も必要？ステートマシンを描いて渡してくれれば、Lambda、ECS、SNS をひとつの舞台にまとめ上げます。',
    },
    role: {
      zh: '可视化工作流编排，把多个服务串成有状态的业务流程。',
      ja: 'ビジュアルなワークフローオーケストレーション。複数のサービスをステートフルな業務フローにつなげる。',
    },
  },

  // ---------- 运维管理 / 運用管理 ----------
  {
    id: 'cloudwatch', name: 'CloudWatch', district: 'management', shape: 'sphere', face: '👀',
    stage: 4, order: 28, weight: 'high',
    related: ['ec2', 'rds', 'lambda', 'sns'],
    label: { zh: '监控告警', ja: 'モニタリング' },
    exam: {
      zh: '监控三件套：指标（Metrics）、日志（Logs）、告警（Alarms，可触发 Auto Scaling 或 SNS 通知）。易错点：内存和磁盘使用率不是默认指标，需要安装 CloudWatch Agent 才能采集。',
      ja: 'モニタリング 3 点セット：メトリクス（Metrics）、ログ（Logs）、アラーム（Alarms、Auto Scaling や SNS 通知をトリガー可能）。ひっかけ注意：メモリとディスク使用率はデフォルトのメトリクスではなく、CloudWatch Agent のインストールが必要。',
    },
    personify: {
      zh: '我是全知守望者 CloudWatch。CPU、内存、请求数、错误率——所有 AWS 资源的指标和日志都流进我这里。阈值一破我就告警，把电话、邮件、Slack 全叫醒。',
      ja: '私は全知の見張り番 CloudWatch。CPU、メモリ、リクエスト数、エラー率——AWS リソースのメトリクスとログはすべて私に流れ込みます。しきい値を超えたら即アラーム、電話もメールも Slack も叩き起こします。',
    },
    role: {
      zh: 'AWS 核心监控系统：指标、日志、告警、仪表盘。',
      ja: 'AWS の中核モニタリングシステム：メトリクス、ログ、アラーム、ダッシュボード。',
    },
  },
  {
    id: 'cloudtrail', name: 'CloudTrail', district: 'management', shape: 'box', face: '🔍',
    stage: 4, order: 29, weight: 'high',
    related: ['s3', 'cloudwatch'],
    label: { zh: '审计追踪', ja: '監査証跡' },
    exam: {
      zh: '一句话区分必考：CloudWatch 看「系统跑得怎么样」（性能监控），CloudTrail 查「谁在什么时候做了什么操作」（API 审计）。题目出现「审计/合规/追查谁删了资源」→ CloudTrail。',
      ja: '一言での区別が必出：CloudWatch は「システムがどう動いているか」（性能監視）、CloudTrail は「誰がいつ何をしたか」（API 監査）。問題文に「監査/コンプライアンス/リソースを消したのは誰か」→ CloudTrail。',
    },
    personify: {
      zh: '我是追踪侦探 CloudTrail，AWS 里每一次 API 调用都逃不过我的记录：谁、什么时候、从哪里、做了什么、结果如何。合规审计、安全取证全靠我。',
      ja: '私は追跡探偵 CloudTrail。AWS でのすべての API 呼び出しは私の記録から逃れられません：誰が、いつ、どこから、何をして、結果はどうだったか。監査もセキュリティフォレンジックも私にお任せ。',
    },
    role: {
      zh: '记录所有 API 调用日志，用于审计和合规。',
      ja: 'すべての API 呼び出しログを記録。監査とコンプライアンスに活用。',
    },
  },
  {
    id: 'cloudformation', name: 'CloudFormation', district: 'management', shape: 'box', face: '🏗️',
    stage: 4, order: 30, weight: 'regular',
    related: ['ec2', 's3', 'vpc', 'iam'],
    label: { zh: '基础设施即代码', ja: 'インフラのコード化' },
    exam: {
      zh: '关键词匹配：「用代码模板重复部署整套环境 / 多账号多区域统一部署（StackSets）」→ CloudFormation。理解声明式 IaC 的价值：环境一致、可版本控制、一键回滚。',
      ja: 'キーワードマッチ：「コードテンプレートで環境一式を繰り返しデプロイ / 複数アカウント・複数リージョンへ統一デプロイ（StackSets）」→ CloudFormation。宣言的 IaC の価値を理解：環境の一貫性、バージョン管理、ワンクリックロールバック。',
    },
    personify: {
      zh: '我是建筑工程师 CloudFormation。你给我写一份蓝图（YAML/JSON），我按图纸一键创建、更新、销毁几百个资源。基础设施即代码，版本化管理的第一步。',
      ja: '私は建築エンジニア CloudFormation。設計図（YAML/JSON）を渡してくれれば、図面どおりに数百のリソースをワンクリックで作成・更新・削除します。Infrastructure as Code、バージョン管理への第一歩です。',
    },
    role: {
      zh: '基础设施即代码（IaC）服务，声明式管理 AWS 资源。',
      ja: 'Infrastructure as Code（IaC）サービス。AWS リソースを宣言的に管理。',
    },
  },
  {
    id: 'systems', name: 'Systems Mgr', district: 'management', shape: 'cylinder', face: '🧰',
    stage: 4, order: 31, weight: 'regular',
    related: ['ec2', 'cloudwatch', 'iam'],
    label: { zh: '系统管理器', ja: '運用管理ツール' },
    exam: {
      zh: '两个高频功能：Session Manager（不开 22 端口、不用 SSH 密钥就能登录 EC2，安全审计友好）和 Parameter Store（免费存配置和密钥，与 Secrets Manager 对比出题）。',
      ja: '頻出機能は 2 つ：Session Manager（ポート 22 を開けず SSH キーもなしで EC2 にログイン、監査にも優しい）と Parameter Store（設定や機密情報を無料で保管、Secrets Manager との比較で出題）。',
    },
    personify: {
      zh: '我是运维瑞士军刀 Systems Manager。打补丁、跑命令、管配置、看清单——所有 EC2 的日常运维我一手包办。还能统一管理 on-prem 和 AWS 的混合环境。',
      ja: '私は運用の十徳ナイフ Systems Manager。パッチ適用、コマンド実行、設定管理、インベントリ——EC2 の日常運用は全部私が引き受けます。オンプレと AWS のハイブリッド環境も一元管理できます。',
    },
    role: {
      zh: '运维自动化平台：补丁、命令、配置、清单、会话管理。',
      ja: '運用自動化プラットフォーム：パッチ、コマンド、設定、インベントリ、セッション管理。',
    },
  },
];

const UI_DEF: Record<string, LText> = {
  pageTitle: {
    zh: 'AWS 云城市 · SAA 学习路线版',
    ja: 'AWS クラウドシティ · SAA 学習ロードマップ版',
  },
  metaDescription: {
    zh: '把 AWS 服务拟人化成一座 3D 云城市：跟随 4 阶段 · 35 站的学习路线备考 SAA 认证，点击角色查看自我介绍与考试要点。',
    ja: 'AWS サービスを擬人化した 3D クラウドシティ。4 フェーズ · 35 ステップの学習ルートで SAA 認定試験に備えましょう。キャラクターをクリックすると自己紹介と試験ポイントが読めます。',
  },
  topTitle: { zh: 'AWS 云城市', ja: 'AWS クラウドシティ' },
  topTitleSuffix: { zh: '· SAA 学习路线版', ja: '· SAA 学習ロードマップ版' },
  topSubtitle: {
    zh: '头顶编号 = 建议学习顺序 · 点击角色看介绍和考点 · 虚线是协作关系',
    ja: '頭上の番号 = おすすめ学習順 · キャラクターをクリックで紹介と試験ポイント · 点線は連携関係',
  },
  roadmapBtn: { zh: '🗺️ 学习路线图', ja: '🗺️ 学習ロードマップ' },
  backLabel: { zh: '← 返回博客', ja: '← ブログに戻る' },
  progressText: { zh: '已学 {n}/{total}', ja: '学習済み {n}/{total}' },
  districtFilterHeader: { zh: '街区导览', ja: 'エリアガイド' },
  allDistricts: { zh: '全部街区', ja: 'すべてのエリア' },
  stageFilterHeader: { zh: '学习阶段', ja: '学習フェーズ' },
  stageFilterItem: { zh: '阶段{n} {name}', ja: 'フェーズ{n} {name}' },
  legendTitle: { zh: '阅读指南', ja: '見方ガイド' },
  legendLine1: { zh: '• 角色头顶的圆形编号 = 建议学习顺序', ja: '• 頭上の丸い番号 = おすすめ学習順' },
  legendLine2: { zh: '• 名牌上的绿色 ✓ = 已学会（保存在本机）', ja: '• ネームプレートの緑の ✓ = 学習済み（この端末に保存）' },
  legendLine3: {
    zh: '• <span style="color:#ffd966">金色虚线</span> = 服务之间的协作关系',
    ja: '• <span style="color:#ffd966">金色の点線</span> = サービス間の連携関係',
  },
  legendLine4: { zh: '• 详情里的红/黄徽章 = SAA 考试权重', ja: '• 詳細パネルの赤/黄バッジ = SAA 試験の出題ウェイト' },
  infoWhoAmI: { zh: '我是谁（自我介绍）', ja: '自己紹介' },
  infoRole: { zh: '我在 AWS 里的角色', ja: 'AWS での役割' },
  infoExam: { zh: '📝 SAA 考试要点', ja: '📝 SAA 試験ポイント' },
  infoPartners: { zh: '我的合作伙伴', ja: '連携するサービス' },
  learnBtnTodo: { zh: '☐ 标记为已学会', ja: '☐ 学習済みにする' },
  learnBtnDone: { zh: '✓ 已学会（点击取消标记）', ja: '✓ 学習済み（クリックで解除）' },
  btnPrev: { zh: '← 上一站', ja: '← 前のステップ' },
  btnNext: { zh: '下一站 →', ja: '次のステップ →' },
  welcomeTitle: { zh: '欢迎来到 AWS 云城市 · SAA 学习版', ja: 'AWS クラウドシティ · SAA 学習版へようこそ' },
  welcomeIntro: {
    zh: '每个 AWS 服务都是一个拟人化的小角色，住在自己的街区里。这一版为 <strong>SAA（解决方案架构师助理级）认证备考</strong> 设计了一条 4 阶段学习路线：跟着角色头顶的编号 ①→㉟ 走，你就知道先学什么、后学什么。',
    ja: 'AWS の各サービスが擬人化されたキャラクターとなり、それぞれの街区に住んでいます。このバージョンでは <strong>SAA（ソリューションアーキテクト アソシエイト）認定試験の対策</strong>用に 4 フェーズの学習ルートを設計しました。キャラクターの頭上の番号 ①→㉟ をたどれば、何をどの順番で学ぶべきかが一目で分かります。',
  },
  welcomeStep1: {
    zh: '点右上角「🗺️ 学习路线图」，纵览 4 个阶段、35 站的完整路径',
    ja: '右上の「🗺️ 学習ロードマップ」で 4 フェーズ・35 ステップの全体像をチェック',
  },
  welcomeStep2: {
    zh: '点击任意角色 → 读它的自我介绍 + SAA 考试要点',
    ja: '好きなキャラクターをクリック → 自己紹介と SAA 試験ポイントを読む',
  },
  welcomeStep3: {
    zh: '学完点「标记为已学会」，进度自动保存在本机浏览器',
    ja: '学び終えたら「学習済みにする」をクリック。進捗はこの端末のブラウザに自動保存',
  },
  welcomeStep4: {
    zh: '用「下一站 →」按顺序推进 · 左侧可按街区或阶段筛选',
    ja: '「次のステップ →」で順番に進もう · 左側でエリアやフェーズごとに絞り込みも可能',
  },
  welcomeBtnRoadmap: { zh: '🗺️ 先看学习路线图', ja: '🗺️ まずロードマップを見る' },
  welcomeBtnEnter: { zh: '直接进入城市 →', ja: 'そのまま都市へ →' },
  roadmapTitle: { zh: '🗺️ AWS SAA 学习路线图', ja: '🗺️ AWS SAA 学習ロードマップ' },
  roadmapSub: {
    zh: '共 35 站 · 4 个阶段 · 建议 8 周走完。按编号顺序学习，每一站都建立在前面的基础上。<br>点击任意服务卡片可跳转到 3D 城市中对应的角色。',
    ja: '全 35 ステップ · 4 フェーズ · 8 週間での完走がおすすめ。番号順に学べば、各ステップは前の内容の上に積み上がります。<br>サービスカードをクリックすると 3D 都市の対応キャラクターへジャンプします。',
  },
  roadmapTotal: { zh: '总进度：{n} / {total}', ja: '全体の進捗：{n} / {total}' },
  roadmapStageMeta: { zh: '· {weeks} · {done}/{total} 已学', ja: '· {weeks} · {done}/{total} 学習済み' },
  roadmapTips: {
    zh: '<strong>💡 备考建议</strong>· 每学完一个服务，去 AWS 控制台亲手操作一遍（免费套餐基本够用）<br>· 阶段 2 学完后，试着自己画出「三层高可用架构图」：Route 53 → CloudFront → ALB → 多可用区 EC2 → RDS Multi-AZ<br>· 阶段 3 学完后，画出「无服务器架构图」：API Gateway → Lambda → DynamoDB<br>· 最后 1–2 周集中刷题，重点复习标着「核心考点」红色徽章的服务<br>· SAA 大多是场景题：问「最经济」多指向 Spot/生命周期策略，问「最高可用」多指向多 AZ，问「运维最少」多指向无服务器/托管服务',
    ja: '<strong>💡 受験対策のヒント</strong>· サービスを 1 つ学ぶごとに、AWS コンソールで実際に手を動かしてみる（無料利用枠でほぼ十分）<br>· フェーズ 2 を終えたら「3 層高可用性アーキテクチャ図」を自分で描いてみる：Route 53 → CloudFront → ALB → マルチ AZ の EC2 → RDS Multi-AZ<br>· フェーズ 3 を終えたら「サーバーレスアーキテクチャ図」を描く：API Gateway → Lambda → DynamoDB<br>· 最後の 1〜2 週間は問題演習に集中し、「最頻出」の赤バッジが付くサービスを重点復習<br>· SAA はシナリオ問題が中心：「最も低コスト」は Spot/ライフサイクルポリシー、「最高の可用性」はマルチ AZ、「運用負荷最小」はサーバーレス/マネージドサービスを指すことが多い',
  },
  roadmapClose: { zh: '进入云城市开始学习 →', ja: 'クラウドシティで学習を始める →' },
  stageBadge: { zh: '第 {order} 站 · 阶段{stage} {name}', ja: 'ステップ {order} · フェーズ{stage} {name}' },
  hoverStation: { zh: '第 {n} 站', ja: 'ステップ {n}' },
  hoverLearned: { zh: ' ✓已学', ja: ' ✓学習済み' },
  hotBadge: { zh: '核心', ja: '最頻出' },
  coreTitle: { zh: 'AWS 云', ja: 'AWS クラウド' },
  coreSubtitle: { zh: 'Amazon Web Services', ja: 'Amazon Web Services' },
};

/** 取出指定语言的完整数据，形状与页面运行时脚本约定一致（可直接 JSON 序列化注入）。 */
export function getCloudCityData(locale: CloudCityLocale) {
  const stages: Record<number, { name: string; weeks: string; color: string; desc: string; goal: string }> = {};
  for (const [k, s] of Object.entries(STAGES_DEF)) {
    stages[Number(k)] = { color: s.color, name: s.name[locale], weeks: s.weeks[locale], desc: s.desc[locale], goal: s.goal[locale] };
  }

  const districts: Record<string, { label: string; color: number; accent: string; emoji: string; angle: number }> = {};
  for (const [k, d] of Object.entries(DISTRICTS_DEF)) {
    districts[k] = { color: d.color, accent: d.accent, emoji: d.emoji, angle: d.angle, label: d.label[locale] };
  }

  const weights: Record<string, { label: string; color: string }> = {};
  for (const [k, w] of Object.entries(WEIGHTS_DEF)) {
    weights[k] = { color: w.color, label: w.label[locale] };
  }

  const services = SERVICES_DEF.map((s) => ({
    id: s.id, name: s.name, district: s.district, shape: s.shape, face: s.face,
    stage: s.stage, order: s.order, weight: s.weight, related: s.related,
    label: s.label[locale], exam: s.exam[locale], personify: s.personify[locale], role: s.role[locale],
  }));

  const ui: Record<string, string> = {};
  for (const [k, v] of Object.entries(UI_DEF)) ui[k] = v[locale];

  return { stages, districts, weights, services, ui };
}
