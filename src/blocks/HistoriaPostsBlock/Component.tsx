import React from 'react';
import { fetchNyheterByCategory } from '@/lib/frontspace/adapters/nyheter';
import HistoriaPostsClient from './ComponentClient';

interface HistoriaPostsBlockProps {
    maxPosts?: number;
}

export default async function HistoriaPostsBlock({ maxPosts = 3 }: HistoriaPostsBlockProps) {
    // Fetch posts from "Vår historia" category (slug: var-historia)
    const posts = await fetchNyheterByCategory('var-historia', maxPosts, 1);

    // Don't render if no posts
    if (posts.length === 0) {
        return null;
    }

    return <HistoriaPostsClient posts={posts} />;
}
