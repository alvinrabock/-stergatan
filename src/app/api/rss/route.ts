import { NextResponse } from 'next/server';
import { fetchAppPosts } from '@/lib/frontspace/adapters/nyheter';
import { escapeXml } from '@/utillities/rssHelpers';
import { Post } from '@/types';

export async function GET() {
  try {
    const posts = await fetchAppPosts(50, 1);
    const rssXml = generateRSSFeed(posts);
    
    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
  }
}

// Helper function to safely join base URL with path
function joinUrl(baseUrl: string, path: string): string {
  if (path.startsWith('http')) {
    return encodeSpacesInUrl(path); // Already absolute URL, just encode spaces
  }
  
  // Remove trailing slash from base and leading slash from path, then join with single slash
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  const fullUrl = `${cleanBase}/${cleanPath}`;
  
  return encodeSpacesInUrl(fullUrl);
} 

// Helper function to encode spaces and other problematic characters in URLs
function encodeSpacesInUrl(url: string): string {
  // Split URL into base and path parts to avoid encoding the protocol
  const urlParts = url.split('://');
  if (urlParts.length !== 2) {
    // If no protocol, just encode the whole thing
    return url.replace(/\s/g, '%20');
  }
  
  const [protocol, rest] = urlParts;
  const [domain, ...pathParts] = rest.split('/');
  
  // Only encode the path parts, not the domain
  const encodedPath = pathParts.map(part => 
    // Replace spaces with %20 and handle other common problematic characters
    part.replace(/\s/g, '%20')
        .replace(/\[/g, '%5B')
        .replace(/\]/g, '%5D')
        .replace(/\{/g, '%7B')
        .replace(/\}/g, '%7D')
  ).join('/');
  
  return pathParts.length > 0 
    ? `${protocol}://${domain}/${encodedPath}`
    : `${protocol}://${domain}`;
}

// Alternative simpler approach using native encodeURI (commented out)
// function encodeSpacesInUrl(url: string): string {
//   try {
//     // This will encode spaces and other special characters while preserving URL structure
//     return encodeURI(url);
//   } catch (error) {
//     // Fallback to manual space replacement if encodeURI fails
//     return url.replace(/\s/g, '%20');
//   }
// }

function generateRSSFeed(posts: Post[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001';
  const frontspaceUrl = process.env.FRONTSPACE_ENDPOINT?.replace('/api/graphql', '') || 'http://localhost:3000';
  const currentDate = new Date().toUTCString();

  const rssItems = posts.map(post => {
    const pubDate = post.publishedAt || post.createdAt;
    const categories = post.categories?.map(cat =>
      typeof cat === 'string' ? cat : cat.title
    ).join(', ') || '';

    const imageResource = post.heroImage && typeof post.heroImage !== "string" ? post.heroImage : null;
    const youtubeLink = post?.youtubeLink || "";
    const youtubeId = youtubeLink ? youtubeLink.split("v=")[1]?.split("&")[0] : null;
    const youtubeThumbnail = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hq720.jpg` : null;

    const fallbackImage = `/oster-placeholder-image.jpg`;
    const imageUrl = imageResource?.url || youtubeThumbnail || fallbackImage;
    const imageMimeType = imageResource?.mimeType || 'image/jpeg';
    const imageFilesize = imageResource?.filesize || 0;

    // Use appropriate URL based on image source
    let finalImageUrl: string;
    if (imageUrl === youtubeThumbnail || imageUrl?.startsWith('http')) {
      // YouTube thumbnails and absolute URLs - use as is (with encoding)
      finalImageUrl = encodeSpacesInUrl(imageUrl);
    } else if (imageUrl === fallbackImage) {
      // Fallback image - use frontend URL
      finalImageUrl = joinUrl(baseUrl, imageUrl);
    } else {
      // Frontspace CMS media files - use Frontspace URL
      finalImageUrl = joinUrl(frontspaceUrl, imageUrl);
    }

    return `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${joinUrl(baseUrl, `/nyhet/${post.slug}`)}</link>
      <guid isPermaLink="true">${joinUrl(baseUrl, `/nyhet/${post.slug}`)}</guid>
      <description><![CDATA[${escapeXml(post.meta?.description || '')}]]></description>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
      ${finalImageUrl ? `<enclosure url="${finalImageUrl}" type="${imageMimeType}" length="${imageFilesize}" />` : ''}
      ${finalImageUrl ? `<media:content url="${finalImageUrl}" type="${imageMimeType}" medium="image" />` : ''}      
      ${categories ? `<category><![CDATA[${categories}]]></category>` : ''}
    </item>`.trim();
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[Your Site News]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[Latest news and updates from Your Site]]></description>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${joinUrl(baseUrl, '/api/rss')}" rel="self" type="application/rss+xml" />
    <image>
      <url>${joinUrl(baseUrl, '/favicon.ico')}</url>
      <title>Your Site News</title>
      <link>${baseUrl}</link>
    </image>
${rssItems}
  </channel>
</rss>`;
}