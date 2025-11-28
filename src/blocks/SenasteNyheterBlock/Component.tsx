import React from 'react';
import { fetchAllNyheter } from '@/lib/frontspace/adapters/nyheter';
import SenasteNyheterClient from './ComponentClient';

interface SenasteNyheterBlockProps {
    maxPosts?: number;
}

export default async function SenasteNyheterBlock({ maxPosts = 3 }: SenasteNyheterBlockProps) {
    // Fetch posts server-side
    const posts = await fetchAllNyheter(maxPosts, 1);

    // Don't render if no posts
    if (posts.length === 0) {
        return null;
    }

    return <SenasteNyheterClient posts={posts} />;
}
