// 定义文章展示
export interface FeedItemCardModel {
  id: string;

  /** 发布时间（Publish） */
  publishedAt: string;

  /** 标题（唯一强视觉锚点） */
  title: string;

  /** 正文首段 / 核心观点 */
  excerpt: string;

  /** 正文页面 URL（永远指向你的网站） */
  url: string;
}


// 定义发布模式
export type PublishMode =
  | 'link'     // 只发链接（X）
  | 'full'     // 发全文（公众号 / CSDN）
  | 'summary'; // 摘要 + 链接

