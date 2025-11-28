// components/hero/SwiperHero.tsx
import { fetchFastPosts } from '@/lib/frontspace/adapters/nyheter'
import React from 'react'
import SwiperHeroClient from './SwiperHeroClient'

export const SwiperHero = async () => {
  const posts = await fetchFastPosts(100)

  return <SwiperHeroClient posts={posts} />
}

