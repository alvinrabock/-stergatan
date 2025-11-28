import React from 'react'
import { fetchHomepageNyheter } from '@/lib/frontspace/adapters/nyheter'
import HeroSliderClient from './HeroSliderClient'

interface HeroSliderProps {
  maxPosts?: number;
}

export default async function HeroSlider({ maxPosts = 5 }: HeroSliderProps) {
  // Fetch posts server-side
  const posts = await fetchHomepageNyheter(maxPosts);

  // Don't render if no posts
  if (posts.length === 0) {
    return null;
  }

  return <HeroSliderClient posts={posts} />;
}
