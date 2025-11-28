// src/lib/rss/rssHelpers.ts
import { Post } from '@/types';

export function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateAtomFeed(posts: Post[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
  const currentDate = new Date().toISOString();

  const atomEntries = posts.map(post => {
    const pubDate = post.publishedAt || post.createdAt;

    const imageResource = post.heroImage && typeof post.heroImage !== "string" ? post.heroImage : null;
    const youtubeLink = post?.youtubeLink || "";
    const youtubeId = youtubeLink ? youtubeLink.split("v=")[1]?.split("&")[0] : null;
    const youtubeThumbnail = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hq720.jpg` : null;

    const fallbackImage = `${baseUrl}/images/default-news-image.jpg`;
    const imageUrl = imageResource?.sizes?.medium?.url || imageResource?.url || youtubeThumbnail || fallbackImage;

    const authorNames = post.populatedAuthors?.map(author => author.name).filter(Boolean) ||
                       post.authors?.map(author => typeof author === 'string' ? author : author.name).filter(Boolean) ||
                       [];

    const categories = post.categories?.map(cat =>
      typeof cat === 'string' ? cat : cat.title
    ) || [];

    return `
    <entry>
      <title type="html"><![CDATA[${escapeXml(post.title)}]]></title>
      <link href="${baseUrl}/nyhet/${post.slug}" />
      <id>${baseUrl}/nyhet/${post.slug}</id>
      <published>${new Date(pubDate).toISOString()}</published>
      <updated>${new Date(post.updatedAt).toISOString()}</updated>
      <summary type="html"><![CDATA[${escapeXml(post.meta?.description || '')}]]></summary>
      ${authorNames.map(name => name ? `<author><name>${escapeXml(name)}</name></author>` : '').join('\n      ')}
      <link rel="enclosure" type="${imageResource?.mimeType || 'image/jpeg'}" href="${imageUrl}" />
      ${categories.map(cat => `<category term="${escapeXml(cat)}" />`).join('\n      ')}
    </entry>`.trim();
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Your Site News</title>
  <link href="${baseUrl}" />
  <link href="${baseUrl}/api/atom" rel="self" />
  <id>${baseUrl}/</id>
  <updated>${currentDate}</updated>
  <subtitle>Latest news and updates from Your Site</subtitle>
${atomEntries}
</feed>`;
}
