import React, { Fragment } from 'react'
import type { Page } from '@/types'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ContentBlock } from './Content/Component'
import KommandeMatcherBlock from './KommandeMatcherBlock/Component'
import PopularaProdukterBlock from './PopularaProdukterBlock/Component'
import { ArchiveBlock } from './ArchiveBlock/Component'
import CodeBlock from './codeSnippet/Component'
import TabellBlock from './TabellBlock'
import SpeladeMatcherBlock from './SpeladeMatcherBlock/Component'
import { DownloadAssetsBlock } from './DownloadAssetBlock/Component'
import { FaqBlock } from './FaqBlock/Component'
import ContainerBlock from './ContainerBlock/Component'
import { ButtonBlock } from './ButtonBlock/Component'
import { IconListBlock } from './ListIconBlock/Component'
import { ImageGalleryBlockComponent } from './ImageGalleryBlockComponent/Component'
import { CardBlockComponent } from './CardBlock/Component'
import ForetagIOsterNatverketComponent from './ForetagIOsterNatverketComponent/Component'
import PartnerOsterISamhalletComponent from './PartnerOsterISamhalletComponent/Component'

const blockComponents = {
  cta: CallToActionBlock,
  mediaBlock: MediaBlock,
  content: ContentBlock,
  codeblock: CodeBlock,
  archive: ArchiveBlock,
  ContainerBlock: ContainerBlock,
  kommandematcherblock: KommandeMatcherBlock,
  popularaprodukterblock: PopularaProdukterBlock,
  tabellblock: TabellBlock,
  speladematcherblock: SpeladeMatcherBlock,
  downloadAssetsBlock: DownloadAssetsBlock,
  faqblock: FaqBlock,
  ButtonBlock: ButtonBlock,
  iconListBlock: IconListBlock,
  imageGalleryBlock: ImageGalleryBlockComponent,
  cardBlock: CardBlockComponent,
  foretagiosternatverket: ForetagIOsterNatverketComponent,
  partnerosterisamhallet: PartnerOsterISamhalletComponent
} as const;

type BlockKey = keyof typeof blockComponents;

export const RenderBlocks: React.FC<{
  blocks: Page['layout'];
}> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const blockType = block.blockType || '';

        // Match container blocks based on the new naming convention
        const containerTypes = new Set([
          'main-container',
          'inner-container',
          'inner-inner-container',
          'inner-inner-inner-container',
          'inner-inner-inner-inner-container',
        ]);

        const componentKey = containerTypes.has(blockType)
          ? 'ContainerBlock'
          : (blockType as BlockKey);


        const Block = blockComponents[componentKey];

        if (Block) {
          return (
            <Fragment key={index}>
              {/* @ts-expect-error: each block may have different props */}
              <Block {...block} />
            </Fragment>
          );
        }

        return null;
      })}
    </>
  );
};
