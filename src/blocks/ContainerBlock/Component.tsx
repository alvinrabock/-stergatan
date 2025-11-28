import React from 'react'
import clsx from 'clsx'
import { RenderBlocks } from '../RenderBlocks'
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import { Media } from '@/app/components/Media/index'
import { ArchiveBlock, CallToActionBlock, CodeBlock, ContentBlock, DownloadAssetsBlock, FaqBlock, ForetagIOsterNatverket, IconListBlock, KommandeMatcherBlock, MatchPickerBlock, MediaBlock, PartnerOsterISamhallet, PopularaProdukterBlock, SpeladeMatcherBlock, TabellBlock, VideoBlock } from '@/types'
import { Media as MediaType } from '@/types'

// Define all possible content blocks that can go inside any container
export type ContentBlockTypes =
    | CallToActionBlock
    | ContentBlock
    | MediaBlock
    | ArchiveBlock
    | CodeBlock
    | FaqBlock
    | DownloadAssetsBlock
    | KommandeMatcherBlock
    | MatchPickerBlock
    | PopularaProdukterBlock
    | SpeladeMatcherBlock
    | TabellBlock
    | IconListBlock
    | VideoBlock
    | PartnerOsterISamhallet
    | ForetagIOsterNatverket

// Define the specific string literals for all container block types
export type ContainerBlockTypeStrings =
    | 'main-container'
    | 'inner-container'
    | 'inner-inner-container'
    | 'inner-inner-inner-container'
    | 'inner-inner-inner-inner-container';

// Define the unified ContainerBlock interface
export interface UnifiedContainerBlock {
    innerBlocks?: (UnifiedContainerBlock | ContentBlockTypes)[] | null;
    blockType: ContainerBlockTypeStrings;
    backgroundColor?: string | null;
    textColor?: string | null;
    widthValue?: string | null;
    widthUnit?: ('px' | 'rem' | 'vw' | 'percent') | null;
    heightValue?: string | null;
    heightUnit?: ('px' | 'rem' | 'vw' | 'percent' | 'vh') | null;
    paddingValue?: string | null;
    paddingUnit?: ('px' | 'rem' | 'vw' | 'percent') | null;
    enablePaddingAllSides?: boolean | null;
    paddingTop?: string | null;
    paddingRight?: string | null;
    paddingBottom?: string | null;
    paddingLeft?: string | null;
    marginValue?: string | null;
    marginUnit?: ('px' | 'rem' | 'vw' | 'percent') | null;
    enableMarginAllSides?: boolean | null;
    marginTop?: string | null;
    marginRight?: string | null;
    marginBottom?: string | null;
    marginLeft?: string | null;
    borderRadiusValue?: string | null;
    borderRadiusUnit?: ('px' | 'rem' | 'vw' | 'percent') | null;
    enableBorderRadiusAllSides?: boolean | null;
    borderRadiusTopLeft?: string | null;
    borderRadiusTopRight?: string | null;
    borderRadiusBottomRight?: string | null;
    borderRadiusBottomLeft?: string | null;
    gridColumnSpan?: number | null;
    backgroundImage?: (string | null) | MediaType;
    overlay?: {
        enabled?: boolean | null;
        color?: string | null;
    };
    deviceSelector?: string | null;
    layoutType?: ('flex' | 'grid') | null;
    flexDirection_desktop?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_desktop?: ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly') | null;
    alignItems_desktop?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_desktop?: string | null;
    flexDirection_tablet?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_tablet?: ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly') | null;
    alignItems_tablet?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_tablet?: string | null;
    flexDirection_mobile?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_mobile?: ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly') | null;
    alignItems_mobile?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_mobile?: string | null;
    gridColumns_desktop?: number | null;
    gridGap_desktop?: string | null;
    gridJustifyContent_desktop?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_desktop?: ('start' | 'center' | 'end' | 'stretch') | null;
    gridColumns_tablet?: number | null;
    gridGap_tablet?: string | null;
    gridJustifyContent_tablet?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_tablet?: ('start' | 'center' | 'end' | 'stretch') | null;
    gridColumns_mobile?: number | null;
    gridGap_mobile?: string | null;
    gridJustifyContent_mobile?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_mobile?: ('start' | 'center' | 'end' | 'stretch') | null;
    id?: string | null;
    blockName?: string | null;
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number;
}

export type MainContainer = UnifiedContainerBlock;
export type InnerContainer = UnifiedContainerBlock;
export type InnerInnerContainer = UnifiedContainerBlock;
export type InnerInnerInnerContainer = UnifiedContainerBlock;
export type InnerInnerInnerInnerContainer = UnifiedContainerBlock;

export type AllBlocks = ContentBlockTypes | UnifiedContainerBlock;

const containerBlockTypes = new Set([
    'main-container',
    'inner-container',
    'inner-inner-container',
    'inner-inner-inner-container',
    'inner-inner-inner-inner-container',
]);

// Improved responsive value function with proper defaults
function getResponsiveValue<T>(
    desktop: T | null | undefined,
    tablet: T | null | undefined,
    mobile: T | null | undefined,
    defaultValue: T
): { desktop: T; tablet: T; mobile: T } {
    // Use mobile as base, fall back to default
    const effectiveMobile = mobile ?? defaultValue;
    // Use tablet, fall back to mobile value
    const effectiveTablet = tablet ?? effectiveMobile;
    // Use desktop, fall back to tablet value
    const effectiveDesktop = desktop ?? effectiveTablet;
    
    return { 
        desktop: effectiveDesktop, 
        tablet: effectiveTablet, 
        mobile: effectiveMobile 
    };
}

const ContainerBlock: React.FC<UnifiedContainerBlock> = (props) => {
    const {
        id,
        innerBlocks = [],
        backgroundColor,
        textColor,
        layoutType,

        flexDirection_desktop,
        justifyContent_desktop,
        alignItems_desktop,
        gap_desktop,
        flexDirection_tablet,
        justifyContent_tablet,
        alignItems_tablet,
        gap_tablet,
        flexDirection_mobile,
        justifyContent_mobile,
        alignItems_mobile,
        gap_mobile,

        gridColumns_desktop,
        gridGap_desktop,
        gridJustifyContent_desktop,
        gridAlignItems_desktop,
        gridColumns_tablet,
        gridGap_tablet,
        gridJustifyContent_tablet,
        gridAlignItems_tablet,
        gridColumns_mobile,
        gridGap_mobile,
        gridJustifyContent_mobile,
        gridAlignItems_mobile,

        gridColumnSpan,
        widthValue,
        widthUnit,
        heightValue,
        heightUnit,
        paddingValue,
        paddingUnit,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        marginValue,
        marginUnit,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        borderRadiusValue,
        borderRadiusUnit,
        backgroundImage,
        overlay,
        blockType,

        overflow,
        position,
        zIndex,
    } = props;

    // Get responsive values with proper defaults based on layout type
    // For flex: mobile=column, tablet/desktop=row (responsive design pattern)
    const flexDirection = layoutType === 'flex' ? {
        mobile: flexDirection_mobile ?? 'column',
        tablet: flexDirection_tablet ?? 'row', 
        desktop: flexDirection_desktop ?? 'row'
    } : getResponsiveValue(
        flexDirection_desktop,
        flexDirection_tablet,
        flexDirection_mobile,
        'row'
    );

    const justifyContent = getResponsiveValue(
        justifyContent_desktop,
        justifyContent_tablet,
        justifyContent_mobile,
        'flex-start'
    );

    const alignItems = getResponsiveValue(
        alignItems_desktop,
        alignItems_tablet,
        alignItems_mobile,
        'stretch'
    );

    const gap = getResponsiveValue(
        gap_desktop,
        gap_tablet,
        gap_mobile,
        '16'
    );

    const gridColumns = getResponsiveValue(
        gridColumns_desktop,
        gridColumns_tablet,
        gridColumns_mobile,
        1
    );

    const gridGapValues = getResponsiveValue(
        gridGap_desktop,
        gridGap_tablet,
        gridGap_mobile,
        '16'
    );

    const gridJustifyContent = getResponsiveValue(
        gridJustifyContent_desktop,
        gridJustifyContent_tablet,
        gridJustifyContent_mobile,
        'start'
    );

    const gridAlignItems = getResponsiveValue(
        gridAlignItems_desktop,
        gridAlignItems_tablet,
        gridAlignItems_mobile,
        'stretch'
    );

    const formatUnit = (value: string | null | undefined, unit: string | null | undefined) => {
        if (!value) return undefined;
        const effectiveUnit = unit || 'px';
        return `${value}${effectiveUnit === 'percent' ? '%' : effectiveUnit}`;
    };

    // Base styles (non-responsive)
    const boxModelStyle: React.CSSProperties = {
        ...(backgroundColor && { backgroundColor }),
        ...(textColor && { color: textColor }),

        ...(paddingValue && paddingUnit && { padding: formatUnit(paddingValue, paddingUnit) }),
        ...(paddingTop && paddingUnit && { paddingTop: formatUnit(paddingTop, paddingUnit) }),
        ...(paddingBottom && paddingUnit && { paddingBottom: formatUnit(paddingBottom, paddingUnit) }),
        ...(paddingLeft && paddingUnit && { paddingLeft: formatUnit(paddingLeft, paddingUnit) }),
        ...(paddingRight && paddingUnit && { paddingRight: formatUnit(paddingRight, paddingUnit) }),

        ...(marginValue && marginUnit && { margin: formatUnit(marginValue, marginUnit) }),
        ...(marginTop && marginUnit && { marginTop: formatUnit(marginTop, marginUnit) }),
        ...(marginBottom && marginUnit && { marginBottom: formatUnit(marginBottom, marginUnit) }),
        ...(marginLeft && marginUnit && { marginLeft: formatUnit(marginLeft, marginUnit) }),
        ...(marginRight && marginUnit && { marginRight: formatUnit(marginRight, marginUnit) }),

        ...(borderRadiusValue && borderRadiusUnit && {
            borderRadius: formatUnit(borderRadiusValue, borderRadiusUnit),
        }),

        ...(heightValue && heightUnit && { height: formatUnit(heightValue, heightUnit) }),
        ...(widthValue && widthUnit && { width: formatUnit(widthValue, widthUnit) }),

        ...(overflow && { overflow }),
        ...(position && { position }),
        ...(typeof zIndex === 'number' && { zIndex }),
        ...(gridColumnSpan && { gridColumn: `span ${gridColumnSpan}` }),
    };

    // Generate responsive CSS
    const styleId = `container-${id || Math.random().toString(36).substr(2, 9)}`;
    
    const responsiveCSS = `
        .${styleId} {
            /* Mobile styles (base) */
            ${layoutType === 'flex' ? `
                display: flex;
                flex-direction: ${flexDirection.mobile};
                justify-content: ${justifyContent.mobile};
                align-items: ${alignItems.mobile};
                gap: ${gap.mobile}px;
            ` : ''}
            
            ${layoutType === 'grid' ? `
                display: grid;
                grid-template-columns: repeat(${gridColumns.mobile}, 1fr);
                gap: ${gridGapValues.mobile}px;
                justify-content: ${gridJustifyContent.mobile};
                align-items: ${gridAlignItems.mobile};
            ` : ''}
        }
        
        /* Tablet styles */
        @media (min-width: 768px) {
            .${styleId} {
                ${layoutType === 'flex' ? `
                    flex-direction: ${flexDirection.tablet};
                    justify-content: ${justifyContent.tablet};
                    align-items: ${alignItems.tablet};
                    gap: ${gap.tablet}px;
                ` : ''}
                
                ${layoutType === 'grid' ? `
                    grid-template-columns: repeat(${gridColumns.tablet}, 1fr);
                    gap: ${gridGapValues.tablet}px;
                    justify-content: ${gridJustifyContent.tablet};
                    align-items: ${gridAlignItems.tablet};
                ` : ''}
            }
        }
        
        /* Desktop styles */
        @media (min-width: 1024px) {
            .${styleId} {
                ${layoutType === 'flex' ? `
                    flex-direction: ${flexDirection.desktop};
                    justify-content: ${justifyContent.desktop};
                    align-items: ${alignItems.desktop};
                    gap: ${gap.desktop}px;
                ` : ''}
                
                ${layoutType === 'grid' ? `
                    grid-template-columns: repeat(${gridColumns.desktop}, 1fr);
                    gap: ${gridGapValues.desktop}px;
                    justify-content: ${gridJustifyContent.desktop};
                    align-items: ${gridAlignItems.desktop};
                ` : ''}
            }
        }
    `;

    const renderInnerBlocks = () =>
        innerBlocks?.map((block, index) => {
            const key = block.id || `block-${index}`;
            
            if (containerBlockTypes.has(block.blockType as ContainerBlockTypeStrings)) {
                return <ContainerBlock key={key} {...(block as UnifiedContainerBlock)} />;
            } else {
                return <RenderBlocks key={key} blocks={[block as ContentBlockTypes]} />;
            }
        });

    const isInnerContainerWithoutWidth = blockType === 'inner-container' && !widthValue;

    const content = (
        <div
            className={clsx(
                'relative',
                layoutType && styleId, // Only apply responsive CSS if layoutType is defined
                blockType && `block-${blockType}`,
                id && `block-id-${id}`
            )}
            data-block-type={blockType}
            data-block-id={id}
            style={boxModelStyle}
        >
            {layoutType && (
                <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />
            )}
            
            {backgroundImage && typeof backgroundImage === 'object' && 'url' in backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <Media imgClassName="w-full h-full object-cover" resource={backgroundImage} fill />
                    {overlay?.enabled && (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: overlay?.color ?? 'rgba(0,0,0,0.1)',
                                zIndex: 1,
                            }}
                        />
                    )}
                </div>
            )}

            {overlay?.enabled && !backgroundImage && (
                <div
                    className="absolute inset-0 z-10"
                    style={{ backgroundColor: overlay.color || 'rgba(0,0,0,0.5)' }}
                />
            )}
            
            {renderInnerBlocks()}
        </div>
    );

    return isInnerContainerWithoutWidth ? <MaxWidthWrapper>{content}</MaxWidthWrapper> : content;
};

export default ContainerBlock;