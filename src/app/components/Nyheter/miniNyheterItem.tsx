import Link from 'next/link';
import { Play } from 'lucide-react';
import { Post } from '@/types';

interface MiniNyhetItemProps {
  post: Post;
  closeDialog?: () => void;
  priority?: boolean; // For above-the-fold items
}

const MiniNyheterItem = ({ post, closeDialog, priority = false }: MiniNyhetItemProps) => {
  const imageResource =
    post.heroImage && typeof post.heroImage !== 'string' ? post.heroImage : null;

  const youtubeLink = post?.youtubeLink || '';
  const youtubeId = youtubeLink ? youtubeLink.split('v=')[1]?.split('&')[0] : null;
  // Use medium quality thumbnail for faster loading
  const youtubeThumbnail = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`
    : null;

  const fallbackImage = '/oster-placeholder-image.jpg';

  // Get the image URL from heroImage or YouTube thumbnail
  const finalImageUrl = imageResource?.url || youtubeThumbnail || fallbackImage;

  return (
    <Link href={`/nyhet/${post.slug}`} onClick={closeDialog} className="block group">
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="aspect-video relative w-full bg-gray-200 rounded-md overflow-hidden">
          {youtubeLink && (
            <div className="absolute top-1 left-1 z-10 bg-black/50 rounded-full p-0.5">
              <Play className="h-3 w-3 text-white" />
            </div>
          )}

          <img
            src={finalImageUrl}
            alt={imageResource?.alt || post.title}
            className="w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
          />
        </div>

        <div className="col-span-2 min-w-0">
          <span className="text-base font-semibold group-hover:underline line-clamp-2 leading-tight">
            {post.title}
          </span>
          {post.publishedAt && (
            <p className="text-sm text-gray-500 mt-1">
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MiniNyheterItem;