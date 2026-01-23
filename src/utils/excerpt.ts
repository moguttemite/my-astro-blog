export function extractExcerpt(
  markdown: string,
  options?: {
    maxLength?: number;
    minLength?: number;
  }
) {
  const maxLength = options?.maxLength ?? 240;
  const minLength = options?.minLength ?? 60;

  if (!markdown) return '';

  // 1. 去掉 Markdown 语法
  let text = markdown
    // 标题、列表、代码块
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    // 链接、图片
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 强调
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // 多余符号
    .replace(/[#>*\-+_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  let clipped = text.slice(0, maxLength);

  // 防止太短导致“空卡片”
  if (clipped.length < minLength) {
    clipped = text.slice(0, minLength);
  }

  return clipped + '…';
}
