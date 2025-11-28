import { Page } from '@/types'
import React from 'react'
import { HighImpactHero } from './HighImpact'
import { LowImpactHero } from './LowImpact'
import { MediumImpactHero } from './MediumImpact'
import { MultiColumnHero } from './MultiColumnHero'
import { SwiperHero } from './SwiperHero'


const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  fullscreenSlider: SwiperHero,
  columnLayout: MultiColumnHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}