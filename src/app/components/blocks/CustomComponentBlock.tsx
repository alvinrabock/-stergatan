/**
 * Custom Component Block
 *
 * Renders custom components from Frontspace CMS
 * Add new custom components to the switch statement below
 */

import React from 'react';

export interface Block {
  id: string;
  type: string;
  content: any;
  styles?: Record<string, any>;
  responsiveStyles?: Record<string, Record<string, any>>;
}

interface CustomComponentBlockProps {
  block: Block;
  blockId: string;
}

export default async function CustomComponentBlock({
  block,
  blockId
}: CustomComponentBlockProps) {
  const content = block.content || {};
  const componentName = content.componentName;
  const props = content.props || {};

  // Handle different component types
  switch (componentName) {
    case 'SenastSpeladeMatcher': {

      // Dynamically import the component (client component)
      const { default: SenastSpeladeMatcher } = await import('@/app/components/SenastSpeladeMatcher');

      return (
        <div
          className={`custom-component-block senast-spelade-matcher block-${blockId}`}
          data-block-id={blockId}
        >
          <SenastSpeladeMatcher />
        </div>
      );
    }

    case 'TabellBlock': {
      // Dynamically import the component (client component)
      const { default: TabellBlock } = await import('@/blocks/TabellBlock');

      return (
        <div
          className={`custom-component-block tabell-block block-${blockId}`}
          data-block-id={blockId}
        >
          <TabellBlock />
        </div>
      );
    }

    case 'SenasteNyheter':
    case 'LatestNewsBlock': {
      // Dynamically import the component (server component)
      const { default: SenasteNyheterBlock } = await import('@/blocks/SenasteNyheterBlock/Component');

      return <SenasteNyheterBlock maxPosts={props.maxPosts || 3} />;
    }

    case 'HistoriaPostsComponent': {
      // Dynamically import the component (server component)
      const { default: HistoriaPostsBlock } = await import('@/blocks/HistoriaPostsBlock/Component');

      return <HistoriaPostsBlock maxPosts={props.maxPosts || 3} />;
    }

    case 'KommandeMatcher':
    case 'UpcomingMatchesBlock': {
      // Dynamically import the component (client component)
      const { default: KommandeMatcher } = await import('@/app/components/KommandeMatcher');

      return (
        <div
          className={`custom-component-block kommande-matcher block-${blockId}`}
          data-block-id={blockId}
        >
          <KommandeMatcher maxMatches={props.maxMatches || 3} />
        </div>
      );
    }

    case 'HeroSlider': {
      // Dynamically import the component (client component)
      const { default: HeroSlider } = await import('@/app/components/HeroSlider');

      // HeroSlider needs full width, no wrapper constraints
      return <HeroSlider maxPosts={props.maxPosts || 5} />;
    }

    case 'KontaktSection': {
      // Dynamically import the component (server component)
      const { default: KontaktSection } = await import('@/app/components/KontaktSection');

      return (
        <div
          className={`custom-component-block kontakt-section block-${blockId}`}
          data-block-id={blockId}
        >
          <KontaktSection columns={props.columns || 3} />
        </div>
      );
    }

    case 'StyrelseSection': {
      // Dynamically import the component (server component)
      const { default: StyrelseSection } = await import('@/app/components/StyrelseSection');

      return (
        <div
          className={`custom-component-block styrelse-section block-${blockId}`}
          data-block-id={blockId}
        >
          <StyrelseSection columns={props.columns || 3} />
        </div>
      );
    }

    case 'PartnerSection': {
      // Dynamically import the component (server component)
      const { default: PartnerSection } = await import('@/app/components/PartnerSection');

      return (
        <div
          className={`custom-component-block partner-section block-${blockId}`}
          data-block-id={blockId}
        >
          <PartnerSection />
        </div>
      );
    }

    case 'PartnersIAffarsnatverket': {
      // Dynamically import the component (server component)
      const { default: PartnersIAffarsnatverket } = await import('@/app/components/PartnersIAffarsnatverket');

      return (
        <div
          className={`custom-component-block partners-affarsnatverket block-${blockId}`}
          data-block-id={blockId}
        >
          <PartnersIAffarsnatverket />
        </div>
      );
    }

    case 'Partnerpaket': {
      // Dynamically import the component (server component)
      const { default: Partnerpaket } = await import('@/app/components/Partnerpaket');

      return (
        <div
          className={`custom-component-block partnerpaket block-${blockId}`}
          data-block-id={blockId}
        >
          <Partnerpaket />
        </div>
      );
    }

    case 'PartnernivaerComponent': {
      // Dynamically import the component (server component)
      const { default: PartnernivaerComponent } = await import('@/app/components/PartnernivaerComponent');

      return (
        <div
          className={`custom-component-block partnernivaer block-${blockId}`}
          data-block-id={blockId}
        >
          <PartnernivaerComponent />
        </div>
      );
    }

    case 'PartnerpaketAffarsnatverk': {
      // Dynamically import the component (server component)
      const { default: PartnerpaketAffarsnatverk } = await import('@/app/components/PartnerpaketAffarsnatverk');

      return (
        <div
          className={`custom-component-block partnerpaket-affarsnatverk block-${blockId}`}
          data-block-id={blockId}
        >
          <PartnerpaketAffarsnatverk />
        </div>
      );
    }

    case 'PartnerpaketPrivatloge': {
      // Dynamically import the component (server component)
      const { default: PartnerpaketPrivatloge } = await import('@/app/components/PartnerpaketPrivatloge');

      return (
        <div
          className={`custom-component-block partnerpaket-privatloge block-${blockId}`}
          data-block-id={blockId}
        >
          <PartnerpaketPrivatloge />
        </div>
      );
    }

    case 'PartnerpaketStigsvensson': {
      // Dynamically import the component (server component)
      const { default: PartnerpaketStigsvensson } = await import('@/app/components/PartnerpaketStigsvensson');

      return (
        <div
          className={`custom-component-block partnerpaket-stigsvensson block-${blockId}`}
          data-block-id={blockId}
        >
          <PartnerpaketStigsvensson />
        </div>
      );
    }

    case 'PartnerpaketOsterisamhallet': {
      // Dynamically import the component (server component)
      const { default: PartnerpaketOsterisamhallet } = await import('@/app/components/PartnerpaketOsterisamhallet');

      return (
        <div
          className={`custom-component-block partnerpaket-osterisamhallet block-${blockId}`}
          data-block-id={blockId}
        >
          <PartnerpaketOsterisamhallet />
        </div>
      );
    }

    case 'HuvudpartnerComponentFooter': {
      // Dynamically import the component (server component)
      const { default: HuvudpartnerComponentFooter } = await import('@/app/components/HuvudpartnerComponentFooter');

      return (
        <div
          className={`custom-component-block huvudpartner-footer block-${blockId}`}
          data-block-id={blockId}
        >
          <HuvudpartnerComponentFooter />
        </div>
      );
    }

    default:
      console.warn(`⚠️ Unknown custom component: ${componentName}`);
      console.warn('Available components: SenastSpeladeMatcher, TabellBlock, SenasteNyheter, LatestNewsBlock, HistoriaPostsComponent, KommandeMatcher, UpcomingMatchesBlock, HeroSlider, KontaktSection, StyrelseSection, PartnerSection, PartnersIAffarsnatverket, Partnerpaket, PartnernivaerComponent, PartnerpaketAffarsnatverk, PartnerpaketPrivatloge, PartnerpaketStigsvensson, PartnerpaketOsterisamhallet, HuvudpartnerComponentFooter');
      return (
        <div
          className={`custom-component-block block-${blockId}`}
          data-block-id={blockId}
        >
          <p>Custom component not configured: {componentName}</p>
        </div>
      );
  }
}
