import React from "react";
import Link from "next/link";
import { Post } from "@/types";
import { Play } from "lucide-react";

interface NyheterItemProps {
  post: Post;
  priority?: boolean; // For above-the-fold images
}

const NyheterItem: React.FC<NyheterItemProps> = ({ post, priority = false }) => {
  const imageResource =
    post.heroImage && typeof post.heroImage !== "string" ? post.heroImage : null;

  // Get image URL from heroImage object
  const imageUrl = imageResource?.url;

  const youtubeLink = post?.youtubeLink || "";
  const youtubeId = youtubeLink ? youtubeLink.split("v=")[1]?.split("&")[0] : null;
  // Use medium quality thumbnail for faster loading
  const youtubeThumbnail = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`
    : null;

  const fallbackImage = "/oster-placeholder-image.jpg";

  const hasYoutube = !!youtubeLink;

  return (
    <Link href={`/nyhet/${post.slug}`} className="block group">
      <div className="relative w-full aspect-[16/9] mb-4 bg-gray-200 rounded-md overflow-hidden">
        {hasYoutube ? (
          <div className="relative w-full h-full">
            <img
              src={imageUrl || youtubeThumbnail || fallbackImage}
              alt={imageResource?.alt || "YouTube Thumbnail"}
              className="w-full h-full object-cover rounded-md"
              loading={priority ? "eager" : "lazy"}
            />
            <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
              <Play className="h-4 w-4 text-white" />
            </div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={imageResource?.alt || post.title}
            className="w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <img
            src={fallbackImage}
            alt="Fallback Thumbnail"
            className="w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
          />
        )}
      </div>

      {post.publishedAt && !isNaN(new Date(post.publishedAt).getTime()) && (
        <p className="text-sm text-gray-500 mb-2">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      )}

      <h2 className="text-lg font-bold group-hover:underline mb-4">
        {post.title}
      </h2>
    </Link>
  );
};

export default NyheterItem;