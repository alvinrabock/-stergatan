export interface BannerBlock {
    style: 'info' | 'warning' | 'error' | 'success';
    content: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    };
    id?: string | null;
    blockName?: string | null;
    blockType: 'banner';
}

export interface Post {
    id: string;
    title: string;
    heroImage?: (string | null) | Media;
    content: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    };
    youtubeLink?: string | null;
    categories?: (string | Category)[] | null;
    meta?: {
        title?: string | null;
        /**
         * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
         */
        image?: (string | null) | Media;
        description?: string | null;
    };
    publishedAt?: string | null;
    authors?: (string | User)[] | null;
    populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
    }[]
    | null;
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
    _status?: ('draft' | 'published') | null;

}

export interface Category {
    id: string;
    title: string;
    slug?: string | null;
    publishedAt?: string | null;
    slugLock?: boolean | null;
    parent?: (string | null) | Category;
    breadcrumbs?:
    | {
        doc?: (string | null) | Category;
        url?: string | null;
        label?: string | null;
        id?: string | null;
    }[]
    | null;
    updatedAt: string;
    createdAt: string;
}

export interface Footer {
    id: string;
    columns?:
    | {
        title?: string | null;
        blocks?:
        | (
            | {
                links?:
                | {
                    link: {
                        type?: ('reference' | 'custom') | null;
                        newTab?: boolean | null;
                        reference?:
                        | ({
                            relationTo: 'pages';
                            value: string | Page;
                        } | null)
                        | ({
                            relationTo: 'posts';
                            value: string | Post;
                        } | null);
                        url?: string | null;
                        label: string;
                    };
                    id?: string | null;
                }[]
                | null;
                id?: string | null;
                blockName?: string | null;
                blockType: 'linkList';
            }
            | {
                image: string | Media;
                id?: string | null;
                blockName?: string | null;
                blockType: 'image';
            }
            | {
                content: {
                    root: {
                        type: string;
                        children: {
                            type: string;
                            version: number;
                            [k: string]: unknown;
                        }[];
                        direction: ('ltr' | 'rtl') | null;
                        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                        indent: number;
                        version: number;
                    };
                    [k: string]: unknown;
                };
                id?: string | null;
                blockName?: string | null;
                blockType: 'text';
            }
        )[]
        | null;
        id?: string | null;
    }[]
    | null;
    socialMedia?:
    | {
        platform?: string | null;
        url?: string | null;
        id?: string | null;
    }[]
    | null;
    updatedAt?: string | null;
    createdAt?: string | null;
}

export interface User {
    id: string;
    name?: string | null;
    updatedAt: string;
    createdAt: string;
    email: string;
    resetPasswordToken?: string | null;
    resetPasswordExpiration?: string | null;
    salt?: string | null;
    hash?: string | null;
    loginAttempts?: number | null;
    lockUntil?: string | null;
    password?: string | null;
}

export interface Partnernivaer {
    id: string;
    title: string;
    investering: string;
    kortbeskrivning?: string | null;
    /**
     * En sak per ruta
     */
    Ingaripaketet:
    | {
        text: string;
        id?: string | null;
    }[]
    | null;
    koppladepartners?: {
        docs?: (string | Partner)[];
        hasNextPage?: boolean;
        totalDocs?: number;
    };
    publishedAt?: string | null;
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
}

export interface Partner {
    id: string;
    title: string;
    namn?: string;
    /**
     * Rekommenderade fil WeBP, storlek på fil runt 200mb
     */
    logotype?: (string | null) | Media;
    logotyp?: (string | null) | Media;
    /**
     * Länk till partnerns hemsida. Länken läggs på logotypen där den syns.
     */
    link?: string | null;
    webbplats?: string | null;
    beskrivning?: string | null;
    partnerniva?: string | null;
    partnernivaer?: string | Partnernivaer;
    paket?: any[];
    visaPaHemsida?: boolean;
    ordning?: number;
    sortOrder?: number;
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
}

export interface Media {
    id: string;
    alt?: string | null;
    caption?: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    } | null;
    updatedAt: string;
    createdAt: string;
    url?: string | null;
    thumbnailURL?: string | null;
    filename?: string | null;
    mimeType?: string | null;
    filesize?: number | null;
    width?: number | null;
    height?: number | null;
    focalX?: number | null;
    focalY?: number | null;
    sizes?: {
        thumbnail?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
        square?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
        small?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
        medium?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
        large?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
        xlarge?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
        og?: {
            url?: string | null;
            width?: number | null;
            height?: number | null;
            mimeType?: string | null;
            filesize?: number | null;
            filename?: string | null;
        };
    };
}

export interface Category {
    id: string;
    title: string;
    banner?: (string | null) | Media;
    description?: string | null;
    slug?: string | null;
    slugLock?: boolean | null;
    parent?: (string | null) | Category;
    breadcrumbs?:
    | {
        doc?: (string | null) | Category;
        url?: string | null;
        label?: string | null;
        id?: string | null;
    }[]
    | null;
    updatedAt: string;
    createdAt: string;
}

export interface Document {
    id: string;
    title: string;
    fil?: (string | null) | Media;
    beskrivning?: string | null;
    documentcategories?: (string | null) | Documentcategory;
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
}

export interface SpeladeMatcherBlock {
    id?: string | null;
    blockName?: string | null;
    blockType: 'speladematcherblock';
}

export interface Documentcategory {
    id: string;
    title: string;
    koppladedokument?: {
        docs?: (string | Document)[];
        hasNextPage?: boolean;
        totalDocs?: number;
    };
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
}

export interface CallToActionBlock {
    richText?: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    } | null;
    links?:
    | {
        link: {
            type?: ('reference' | 'custom') | null;
            newTab?: boolean | null;
            reference?:
            | ({
                relationTo: 'pages';
                value: string | Page;
            } | null)
            | ({
                relationTo: 'posts';
                value: string | Post;
            } | null);
            url?: string | null;
            label: string;
            /**
             * Choose how the link should be rendered.
             */
            appearance?: ('default' | 'outline') | null;
        };
        id?: string | null;
    }[]
    | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'cta';
}

export interface TabellBlock {
    id?: string | null;
    blockName?: string | null;
    blockType: 'tabellblock';
}

export interface ContentBlock {
    richText?: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    } | null;
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
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'content';
}

export interface MediaBlock {
    /**
     * Rekommenderad storlek för bilder: 200–300 KB
     */
    media: string | Media;
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
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'mediaBlock';
}

export interface ArchiveBlock {
    introContent?: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    } | null;
    populateBy?: ('collection' | 'selection') | null;
    relationTo?: ('posts' | 'personal' | 'foretagspaket') | null;
    /**
     * Välj specifika kategorier att inkludera. Lämna tomt för alla kategorier.
     */
    postCategories?: (string | Category)[] | null;
    /**
     * Välj specifika avdelningar att inkludera. Lämna tomt för alla avdelningar.
     */
    personalAvdelningar?: (string | Personalavdelningar)[] | null;
    /**
     * Välj specifika kategorier att inkludera. Lämna tomt för alla kategorier.
     */
    foretagspaketkategorier?: (string | Foretagspaketkategorier)[] | null;
    /**
     * Välj kategorier att utesluta från resultatet.
     */
    excludePostCategories?: (string | Category)[] | null;
    /**
     * Välj avdelningar att utesluta från resultatet.
     */
    excludePersonalAvdelningar?: (string | Personalavdelningar)[] | null;
    /**
     * Välj kategorier att utesluta från resultatet.
     */
    excludeForetagspaketkategorier?: (string | Foretagspaketkategorier)[] | null;
    limit?: number | null;
    selectedPosts?: (string | Post)[] | null;
    selectedPersonal?: (string | Personal)[] | null;
    selectedForetagspaket?: (string | Foretagspaket)[] | null;
    /**
     * Välj hur många kolumner som innehållet ska visas i.
     */
    columns: '1' | '2' | '3' | '4' | '5' | '6';
    id?: string | null;
    blockName?: string | null;
    blockType: 'archive';
}

export interface IconListBlock {
    icons: {
        content?: {
            root: {
                type: string;
                children: {
                    type: string;
                    version: number;
                    [k: string]: unknown;
                }[];
                direction: ('ltr' | 'rtl') | null;
                format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                indent: number;
                version: number;
            };
            [k: string]: unknown;
        } | null;
        icon: string | Media;
        id?: string | null;
    }[];
    id?: string | null;
    blockName?: string | null;
    blockType: 'iconListBlock';
}

export interface FormBlock {
    form: string | Form;
    enableIntro?: boolean | null;
    introContent?: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    } | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'formBlock';
}

export interface MainContainer {
    innerBlocks?:
    | (
        | InnerContainer
        | CallToActionBlock
        | ContentBlock
        | MediaBlock
        | ArchiveBlock
        | CodeBlock
        | DownloadAssetsBlock
        | FaqBlock
        | ButtonBlock
        | TabellBlock
        | SpeladeMatcherBlock
        | PopularaProdukterBlock
    )[]
    | null;
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
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number | null;
    /**
     * Select a background image for this container.
     */
    backgroundImage?: (string | null) | Media;
    overlay?: {
        enabled?: boolean | null;
        /**
         * CSS color value like rgba(0,0,0,0.5)
         */
        color?: string | null;
    };
    deviceSelector?: string | null;
    layoutType?: ('flex' | 'grid') | null;
    flexDirection_desktop?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_desktop?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_desktop?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_desktop?: string | null;
    flexDirection_tablet?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_tablet?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_tablet?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_tablet?: string | null;
    flexDirection_mobile?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_mobile?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_mobile?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_mobile?: string | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_desktop?: number | null;
    gridGap_desktop?: string | null;
    gridJustifyContent_desktop?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_desktop?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_tablet?: number | null;
    gridGap_tablet?: string | null;
    gridJustifyContent_tablet?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_tablet?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_mobile?: number | null;
    gridGap_mobile?: string | null;
    gridJustifyContent_mobile?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_mobile?: ('start' | 'center' | 'end' | 'stretch') | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'main-container';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "InnerContainer".
 */
export interface InnerContainer {
    innerBlocks?:
    | (
        | InnerInnerContainer
        | CallToActionBlock
        | ContentBlock
        | MediaBlock
        | ArchiveBlock
        | CodeBlock
        | DownloadAssetsBlock
        | FaqBlock
        | ButtonBlock
        | TabellBlock
        | SpeladeMatcherBlock
        | PopularaProdukterBlock
    )[]
    | null;
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
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number | null;
    /**
     * Select a background image for this container.
     */
    backgroundImage?: (string | null) | Media;
    overlay?: {
        enabled?: boolean | null;
        /**
         * CSS color value like rgba(0,0,0,0.5)
         */
        color?: string | null;
    };
    deviceSelector?: string | null;
    layoutType?: ('flex' | 'grid') | null;
    flexDirection_desktop?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_desktop?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_desktop?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_desktop?: string | null;
    flexDirection_tablet?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_tablet?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_tablet?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_tablet?: string | null;
    flexDirection_mobile?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_mobile?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_mobile?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_mobile?: string | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_desktop?: number | null;
    gridGap_desktop?: string | null;
    gridJustifyContent_desktop?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_desktop?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_tablet?: number | null;
    gridGap_tablet?: string | null;
    gridJustifyContent_tablet?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_tablet?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_mobile?: number | null;
    gridGap_mobile?: string | null;
    gridJustifyContent_mobile?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_mobile?: ('start' | 'center' | 'end' | 'stretch') | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'inner-container';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "InnerInnerContainer".
 */
export interface InnerInnerContainer {
    innerBlocks?:
    | (
        | InnerInnerInnerContainer
        | CallToActionBlock
        | ContentBlock
        | MediaBlock
        | ArchiveBlock
        | CodeBlock
        | DownloadAssetsBlock
        | FaqBlock
        | ButtonBlock
        | TabellBlock
        | SpeladeMatcherBlock
        | PopularaProdukterBlock
    )[]
    | null;
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
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number | null;
    /**
     * Select a background image for this container.
     */
    backgroundImage?: (string | null) | Media;
    overlay?: {
        enabled?: boolean | null;
        /**
         * CSS color value like rgba(0,0,0,0.5)
         */
        color?: string | null;
    };
    deviceSelector?: string | null;
    layoutType?: ('flex' | 'grid') | null;
    flexDirection_desktop?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_desktop?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_desktop?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_desktop?: string | null;
    flexDirection_tablet?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_tablet?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_tablet?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_tablet?: string | null;
    flexDirection_mobile?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_mobile?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_mobile?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_mobile?: string | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_desktop?: number | null;
    gridGap_desktop?: string | null;
    gridJustifyContent_desktop?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_desktop?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_tablet?: number | null;
    gridGap_tablet?: string | null;
    gridJustifyContent_tablet?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_tablet?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_mobile?: number | null;
    gridGap_mobile?: string | null;
    gridJustifyContent_mobile?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_mobile?: ('start' | 'center' | 'end' | 'stretch') | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'inner-inner-container';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "InnerInnerInnerContainer".
 */
export interface InnerInnerInnerContainer {
    innerBlocks?:
    | (
        | InnerInnerInnerInnerContainer
        | CallToActionBlock
        | ContentBlock
        | MediaBlock
        | ArchiveBlock
        | CodeBlock
        | DownloadAssetsBlock
        | FaqBlock
        | ButtonBlock
        | TabellBlock
        | SpeladeMatcherBlock
        | PopularaProdukterBlock
    )[]
    | null;
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
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number | null;
    /**
     * Select a background image for this container.
     */
    backgroundImage?: (string | null) | Media;
    overlay?: {
        enabled?: boolean | null;
        /**
         * CSS color value like rgba(0,0,0,0.5)
         */
        color?: string | null;
    };
    deviceSelector?: string | null;
    layoutType?: ('flex' | 'grid') | null;
    flexDirection_desktop?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_desktop?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_desktop?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_desktop?: string | null;
    flexDirection_tablet?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_tablet?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_tablet?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_tablet?: string | null;
    flexDirection_mobile?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_mobile?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_mobile?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_mobile?: string | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_desktop?: number | null;
    gridGap_desktop?: string | null;
    gridJustifyContent_desktop?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_desktop?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_tablet?: number | null;
    gridGap_tablet?: string | null;
    gridJustifyContent_tablet?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_tablet?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_mobile?: number | null;
    gridGap_mobile?: string | null;
    gridJustifyContent_mobile?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_mobile?: ('start' | 'center' | 'end' | 'stretch') | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'inner-inner-inner-container';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "InnerInnerInnerInnerContainer".
 */
export interface InnerInnerInnerInnerContainer {
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
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number | null;
    /**
     * Select a background image for this container.
     */
    backgroundImage?: (string | null) | Media;
    overlay?: {
        enabled?: boolean | null;
        /**
         * CSS color value like rgba(0,0,0,0.5)
         */
        color?: string | null;
    };
    deviceSelector?: string | null;
    layoutType?: ('flex' | 'grid') | null;
    flexDirection_desktop?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_desktop?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_desktop?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_desktop?: string | null;
    flexDirection_tablet?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_tablet?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_tablet?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_tablet?: string | null;
    flexDirection_mobile?: ('row' | 'row-reverse' | 'column' | 'column-reverse') | null;
    justifyContent_mobile?:
    | ('flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly')
    | null;
    alignItems_mobile?: ('stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline') | null;
    gap_mobile?: string | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_desktop?: number | null;
    gridGap_desktop?: string | null;
    gridJustifyContent_desktop?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_desktop?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_tablet?: number | null;
    gridGap_tablet?: string | null;
    gridJustifyContent_tablet?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_tablet?: ('start' | 'center' | 'end' | 'stretch') | null;
    /**
     * e.g. 2, 3, 4, 6
     */
    gridColumns_mobile?: number | null;
    gridGap_mobile?: string | null;
    gridJustifyContent_mobile?: ('start' | 'center' | 'end' | 'between' | 'around' | 'evenly') | null;
    gridAlignItems_mobile?: ('start' | 'center' | 'end' | 'stretch') | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'inner-inner-inner-inner-container';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "downloadAssetsBlock".
 */
export interface DownloadAssetsBlock {
    sectionTitle?: string | null;
    sectionDescription?: string | null;
    assets?:
    | {
        title: string;
        description?: string | null;
        asset: string | Media;
        id?: string | null;
    }[]
    | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'downloadAssetsBlock';
}

export interface Form {
    id: string;
    title: string;
    fields?:
    | (
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            defaultValue?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'checkbox';
        }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'country';
        }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'email';
        }
        | {
            message?: {
                root: {
                    type: string;
                    children: {
                        type: string;
                        version: number;
                        [k: string]: unknown;
                    }[];
                    direction: ('ltr' | 'rtl') | null;
                    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                    indent: number;
                    version: number;
                };
                [k: string]: unknown;
            } | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'message';
        }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'number';
        }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            placeholder?: string | null;
            options?:
            | {
                label: string;
                value: string;
                id?: string | null;
            }[]
            | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'select';
        }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'state';
        }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'text';
        }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'textarea';
        }
    )[]
    | null;
    submitButtonLabel?: string | null;
    /**
     * Choose whether to display an on-page message or redirect to a different page after they submit the form.
     */
    confirmationType?: ('message' | 'redirect') | null;
    confirmationMessage?: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    } | null;
    redirect?: {
        url: string;
    };
    /**
     * Send custom emails when the form submits. Use comma separated lists to send the same email to multiple recipients. To reference a value from this form, wrap that field's name with double curly brackets, i.e. {{firstName}}. You can use a wildcard {{*}} to output all data and {{*:table}} to format it as an HTML table in the email.
     */
    emails?:
    | {
        emailTo?: string | null;
        cc?: string | null;
        bcc?: string | null;
        replyTo?: string | null;
        emailFrom?: string | null;
        subject: string;
        /**
         * Enter the message that should be sent in this email.
         */
        message?: {
            root: {
                type: string;
                children: {
                    type: string;
                    version: number;
                    [k: string]: unknown;
                }[];
                direction: ('ltr' | 'rtl') | null;
                format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                indent: number;
                version: number;
            };
            [k: string]: unknown;
        } | null;
        id?: string | null;
    }[]
    | null;
    updatedAt: string;
    createdAt: string;
}

export interface Page {
    id: string;
    title: string;
    hero: {
        /**
         * Choose the hero section layout style
         */
        type: 'none' | 'fullscreenSlider' | 'highImpact' | 'mediumImpact' | 'lowImpact' | 'columnLayout';
        /**
         * Main content for this hero section
         */
        richText?: {
            root: {
                type: string;
                children: {
                    type: string;
                    version: number;
                    [k: string]: unknown;
                }[];
                direction: ('ltr' | 'rtl') | null;
                format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                indent: number;
                version: number;
            };
            [k: string]: unknown;
        } | null;
        links?:
        | {
            link: {
                type?: ('reference' | 'custom') | null;
                newTab?: boolean | null;
                reference?:
                | ({
                    relationTo: 'pages';
                    value: string | Page;
                } | null)
                | ({
                    relationTo: 'posts';
                    value: string | Post;
                } | null);
                url?: string | null;
                label: string;
                /**
                 * Choose how the link should be rendered.
                 */
                appearance?: ('default' | 'outline') | null;
            };
            id?: string | null;
        }[]
        | null;
        media?: (string | null) | Media;
        /**
         * Add columns to create your layout. Each column can have different content and styling.
         */
        columns?:
        | {
            /**
             * Set specific width or use auto for equal distribution
             */
            width?: ('auto' | '1/6' | '1/4' | '1/3' | '1/2' | '2/3' | '3/4' | '5/6' | 'full') | null;
            content: {
                root: {
                    type: string;
                    children: {
                        type: string;
                        version: number;
                        [k: string]: unknown;
                    }[];
                    direction: ('ltr' | 'rtl') | null;
                    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                    indent: number;
                    version: number;
                };
                [k: string]: unknown;
            };
            id?: string | null;
        }[]
        | null;
    };
    layout: (
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
        | ImageGalleryBlock
        | CardBlock
        | ForetagIOsterNatverket
        | PartnerOsterISamhallet
    )[];
    meta?: {
        title?: string | null;
        /**
         * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
         */
        image?: (string | null) | Media;
        description?: string | null;
    };
    publishedAt?: string | null;
    slug?: string | null;
    slugLock?: boolean | null;
    parent?: (string | null) | Page;
    breadcrumbs?:
    | {
        doc?: (string | null) | Page;
        url?: string | null;
        label?: string | null;
        id?: string | null;
    }[]
    | null;
    updatedAt: string;
    createdAt: string;
    _status?: ('draft' | 'published') | null;
}

export interface VideoBlock {
    iframeUrl: string;
    allowFullScreen?: boolean | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'videoBlock';
}

export interface ForetagIOsterNatverket {
    id?: string | null;
    blockName?: string | null;
    blockType: 'foretagiosternatverket';
}

export interface PartnerOsterISamhallet {
    id?: string | null;
    blockName?: string | null;
    blockType: 'partnerosterisamhallet';
}

export interface ImageGalleryBlock {
    images: {
        image: string | Media;
        bildtext?: string | null;
        id?: string | null;
    }[];
    id?: string | null;
    blockName?: string | null;
    blockType: 'imageGalleryBlock';
}

export interface Post {
    id: string;
    title: string;
    heroImage?: (string | null) | Media;
    /**
     * När en youtubelänk klistras in och ingen thumbnail är uppladdad, används thumbnailen från Youtube.
     */
    youtubeLink?: string | null;
    content: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    };
    categories?: (string | Category)[] | null;
    koppladelag?: (string | Lag)[] | null;
    meta?: {
        title?: string | null;
        /**
         * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
         */
        image?: (string | null) | Media;
        description?: string | null;
    };
    publishedAt?: string | null;
    authors?: (string | User)[] | null;
    populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
    }[]
    | null;
    slug?: string | null;
    slugLock?: boolean | null;
    isFeatured?: boolean | null;
    updatedAt: string;
    createdAt: string;
    _status?: ('draft' | 'published') | null;
}

export interface CardBlock {
    /**
     * Choose how the image and content should be displayed
     */
    layout: 'background' | 'stacked';
    /**
     * Will be used as background or top image based on layout selection
     */
    image: string | Media;
    title: string;
    description?: string | null;
    /**
     * Aspect ratio for the image
     */
    imageAspectRatio?: ('16/9' | '4/3' | '1/1' | '3/4' | 'auto') | null;
    /**
     * Link for the card - entire card clickable for background layout, button for stacked layout
     */
    link?: {
        type?: ('reference' | 'custom') | null;
        newTab?: boolean | null;
        reference?:
        | ({
            relationTo: 'pages';
            value: string | Page;
        } | null)
        | ({
            relationTo: 'posts';
            value: string | Post;
        } | null);
        url?: string | null;
        label?: string | null;
    };
    id?: string | null;
    blockName?: string | null;
    blockType: 'cardBlock';
}

export interface Lag {
    id: string;
    slug?: string | null;
    slugLock?: boolean | null;
    publishedAt?: string | null;
    aLag?: boolean | null;
    title: string;
    /**
     * Rekommenderad storlek för bilder: 200–300 KB
     */
    banner?: (string | null) | Media;
    Sportadminlink?: string | null;
    /**
     * Det betyder att när personen klickar på laget kommer den hänvisas direkt till sportadmin
     */
    linkDirectToSportadmin?: boolean | null;
    traningstider?:
    | {
        dag: string;
        startTid: string;
        slutTid: string;
        plats?: string | null;
        noteringar?: string | null;
        id?: string | null;
    }[]
    | null;
    fetchFromSEFAPI?: boolean | null;
    smcTeamId?: string | null;
    fogisTeamId?: string | null;
    fogisTeamSlug?: string | null;
    seasons?:
    | {
        seasonYear: string;
        tournaments?:
        | {
            LeagueName: string;
            leagueId?: string | null;
            id?: string | null;
        }[]
        | null;
        id?: string | null;
    }[]
    | null;
    selectedMatches?:
    | {
        [k: string]: unknown;
    }
    | unknown[]
    | string
    | number
    | boolean
    | null;
    layout?:
    | (
        | CallToActionBlock
        | ContentBlock
        | MediaBlock
        | ArchiveBlock
        | FormBlock
        | KommandeMatcherBlock
        | PopularaProdukterBlock
        | CodeBlock
    )[]
    | null;
    players?:
    | {
        title: string;
        /**
         * Rekommenderad storlek för bilder: 200–300 KB
         */
        image?: (string | null) | Media;
        number?: number | null;
        position?: string | null;
        land?: string | null;
        utlanad?: boolean | null;
        kommentar?: string | null;
        id?: string | null;
    }[]
    | null;
    staff?:
    | {
        name: string;
        /**
         * Rekommenderad storlek för bilder: 200–300 KB
         */
        image?: (string | null) | Media;
        role?: string | null;
        id?: string | null;
    }[]
    | null;
    updatedAt: string;
    createdAt: string;
}

export interface DownloadAssetsBlock {
    sectionTitle?: string | null;
    sectionDescription?: string | null;
    assets?:
    | {
        title: string;
        description?: string | null;
        asset: string | Media;
        id?: string | null;
    }[]
    | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'downloadAssetsBlock';
}

export interface FaqBlock {
    faqs: {
        question: string;
        answer: {
            root: {
                type: string;
                children: {
                    type: string;
                    version: number;
                    [k: string]: unknown;
                }[];
                direction: ('ltr' | 'rtl') | null;
                format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                indent: number;
                version: number;
            };
            [k: string]: unknown;
        };
        id?: string | null;
    }[];
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
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'faqblock';
}

export interface Jobb {
    id: string;
    title: string;
    content: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    };
    /**
     * Ange när ansökan går ut
     */
    enddate?: string | null;
    photo?: (string | null) | Media;
    meta?: {
        title?: string | null;
        /**
         * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
         */
        image?: (string | null) | Media;
        description?: string | null;
    };
    publishedAt?: string | null;
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
    _status?: ('draft' | 'published') | null;
}

export interface CodeBlock {
    language?: ('typescript' | 'javascript' | 'css' | 'html') | null;
    code: string;
    id?: string | null;
    blockName?: string | null;
    blockType: 'codeblock';
}

export interface KommandeMatcherBlock {
    id?: string | null;
    blockName?: string | null;
    blockType: 'kommandematcherblock';
}

export interface PopularaProdukterBlock {
    id?: string | null;
    blockName?: string | null;
    blockType: 'popularaprodukterblock';
}


export interface Foretagspaket {
    id: string;
    title: string;
    heroImage?: (string | null) | Media;
    content?: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    } | null;
    price?: string | null;
    shortDescription?: string | null;
    foretagspaketkategorier?: (string | null) | Foretagspaketkategorier;
    /**
     * En sak per ruta
     */
    Ingaripaketet?:
    | {
        text: string;
        id?: string | null;
    }[]
    | null;
    enableLink?: boolean | null;
    link?: {
        internal?: (string | null) | Page;
        custom?: string | null;
    };
    publishedAt?: string | null;
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
    _status?: ('draft' | 'published') | null;
}

export interface Foretagspaketkategorier {
    id: string;
    title: string;
    koppladepaket?: {
        docs?: (string | Foretagspaket)[];
        hasNextPage?: boolean;
        totalDocs?: number;
    };
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
}


export interface Personal {
    id: string;
    title: string;
    namn?: string;
    email?: string;
    epost?: string;
    jobTitle?: string;
    befattning?: string;
    phoneNumber?: string | null;
    telefon?: string | null;
    photo?: (string | null) | Media;
    bild?: (string | null) | Media;
    avdelning?: string | Personalavdelningar;
    beskrivning?: string | null;
    visaPaHemsida?: boolean;
    sortOrder?: number;
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
}

export interface Personalavdelningar {
    id: string;
    title: string;
    koppladpersonal?: {
        docs?: (string | Personal)[];
        hasNextPage?: boolean;
        totalDocs?: number;
    };
    slug?: string | null;
    slugLock?: boolean | null;
    updatedAt: string;
    createdAt: string;
}

export interface Header {
    id: string;
    navItems?:
    | {
        /**
         * Choose the visual prominence of this menu item
         */
        layout?: ('small' | 'standard') | null;
        link: {
            type?: ('reference' | 'custom') | null;
            newTab?: boolean | null;
            reference?:
            | ({
                relationTo: 'pages';
                value: string | Page;
            } | null)
            | ({
                relationTo: 'posts';
                value: string | Post;
            } | null);
            url?: string | null;
            label: string;
        };
        subMenu?:
        | {
            link: {
                type?: ('reference' | 'custom') | null;
                newTab?: boolean | null;
                reference?:
                | ({
                    relationTo: 'pages';
                    value: string | Page;
                } | null)
                | ({
                    relationTo: 'posts';
                    value: string | Post;
                } | null);
                url?: string | null;
                label: string;
            };
            image?: (string | null) | Media;
            subMenu?:
            | {
                link: {
                    type?: ('reference' | 'custom') | null;
                    newTab?: boolean | null;
                    reference?:
                    | ({
                        relationTo: 'pages';
                        value: string | Page;
                    } | null)
                    | ({
                        relationTo: 'posts';
                        value: string | Post;
                    } | null);
                    url?: string | null;
                    label: string;
                };
                id?: string | null;
            }[]
            | null;
            id?: string | null;
        }[]
        | null;
        id?: string | null;
    }[]
    | null;
    socialMedia?:
    | {
        platform?: string | null;
        url?: string | null;
        id?: string | null;
    }[]
    | null;
    updatedAt?: string | null;
    createdAt?: string | null;
}

export interface MatchPickerBlock {
    selectedSingleMatchId?: string | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'matchPickerBlock';
}

export type Product = {
    ID: string;
    title: string;
    description: string;
    price: number;
    normalPrice: number;
    discountPrice: number | null;
    discounted: boolean;
    url: string;
    thumb: string;
    image: string;
};

export interface MatchCardData {
    matchId: number;
    kickoff: string;
    modifiedDate: string;
    status: string;
    arenaName: string;
    leagueId: string | number; // Support both ULID strings (SMC API 2.0) and numbers (Fogis)
    homeTeam: string;
    awayTeam: string;
    roundNumber: number;
    goalsHome: number;
    goalsAway: number;
    event?: MatchEventData;
    ticketURL: string;
    soldTickets?: number;        
    customButtonText?: string;   
    customButtonLink?: string;   
    maxTickets?: number;
    // ✅ New optional nested field from third API
    liveStats?: {
        "home-team-score": number;
        "away-team-score": number;
        "match-phase": string;
        "game-clock-in-min": number;
        "actual-start-of-first-half": string;
        "actual-end-of-first-half": string;
        "actual-start-of-second-half": string;
        "actual-end-of-second-half": string;
    };
}

export interface MatchEventData {
    start_time: string;
    tickets_url: string;
    release_date: string | null;

}

export interface Match {
    matchId: string | number; // Support both ULID strings (SMC API 2.0) and numbers (Fogis)
    extMatchId: string;
    kickoff: string;
    modifiedDate: string;
    matchTotalTime: number;
    statusId: number;
    status: string;
    seasonId: number;
    season: string;
    arenaId: number;
    arenaName: string;
    leagueId: string | number; // Support both ULID strings (SMC API 2.0) and numbers (Fogis)
    leagueName: string;
    homeTeam: string;
    homeTeamId: string;
    extHomeTeamId: string;
    awayTeam: string;
    awayTeamId: string;
    extAwayTeamId: string;
    roundNumber: number;
    homeEngagingTeam: string;
    awayEngagingTeam: string;
    attendees: number | null;
    goalsHome: number;
    goalsAway: number;
    homeLineup: {
        formation: string;
        players: Player[];
    };
    awayLineup: {
        formation: string;
        players: Player[];
    };
    referees: Referee[];
    event?: MatchEventData;
    liveStats?: LiveStats;

    ticketURL: string;
  soldTickets?: number;       
  customButtonText?: string;   
  customButtonLink?: string;   
  maxTickets?: number;  
}

export interface Player {
    "player-id": number;
    "ext-player-id": number;
    "player-name": string;
    "given-name": string;
    surname: string;
    position: string;
    "position-index-from-back-right": string;
    "shirt-number": number;
    "team-id"?: number;
}


export interface Referee {
    refereeId: number;
    extRefereeId: string;
    name: string;
    role: string;
    mainReferee: boolean;
}

export interface TeamStanding {
    position: number;
    teamId: string;
    "team-name": string;
    points: number;
    "points-home": number;
    "points-away": number;
    wins: number;
    "wins-home": number;
    "wins-away": number;
    draws: number;
    "draws-home": number;
    "draws-away": number;
    losses: number;
    "losses-home": number;
    "losses-away": number;
    "games-played": number;
    "games-played-home": number;
    "games-played-away": number;
    "goal-differential": number;
    "goal-differential-home": number;
    "goal-differential-away": number;
    "goals-scored": number;
    "goals-scored-home": number;
    "goals-scored-away": number;
    "goals-conceded": number;
    "goals-conceded-home": number;
    "goals-conceded-away": number;
    "league-id": string;
}

// LiveEvent

export interface Event {
    "event-id": number;
    description?: string;
    status: 'live' | 'tentative' | 'official';
    "match-phase": '1st half' | '2nd half' | '1st overtime' | '2nd overtime' | 'penalties';
    "game-clock-in-min": string;
    "game-clock-in-sec": string;
    "event-timestamp": string;
    "home-team-score": number;
    "away-team-score": number;
    "event-name": string;
    index: number;
    goal: GoalEvent;
}

export interface RedCardEvent {
    "general-event-data": {
        "external-event-id": string | null;
        description: string | null;
        "event-timestamp": string | null;
        "publish-timestamp": string | null;
        "match-phase": 'not started' | '1st half' | '2nd half' | '1st overtime' | '2nd overtime' | 'penalties' | 'finished';
        status: 'live' | 'tentative' | 'official';
        "game-clock-in-min": number | null;
        "game-clock-in-sec": number | null;
        "last-modified-timestamp": string;
        "event-score": string; // "1:2"
    };
    "player-id": number | null;
    "player-team-id": number;
    "card-reason": 'violent conduct' | 'second yellow' | 'denying goal chance';
}

export interface GoalEvent extends Event {
    "player-id": number | null;
    "player-name"?: string;  // Player name may be included directly in goal events from SMC API
    "ext-player-id"?: number;  // External player ID (Fogis ID) for matching with lineup
    "player-team-id": number;
    "player-id-assist": number | null;
    "goal-type": 'standard' | 'header' | 'own goal' | 'penalty' | 'free kick' | 'corner' | null;  // This is nullable, as per the schema.
    "shot-position": string | null;  // This is nullable, as per the schema.
    "goal-position": string | null;  // This is nullable, as per the schema.
    "after-set-piece": 'corner' | 'free kick' | 'penalty' | 'throw-in' | null;  // This is nullable, as per the schema.
    "general-event-data"?: {  // You can optionally include the general event data, as it is not required in your interface.
        "description": string | null;
        "event-timestamp": string | null;
        "publish-timestamp": string | null;
        "match-phase": string;
        "status": string;
        "game-clock-in-min": number | null;
        "game-clock-in-sec": number | null;
        "last-modified-timestamp": string | null;
        "event-score": string;
    };
}

export interface MatchPhaseEvent {
    "general-event-data": {
        "external-event-id": string | null;
        description: string | null;
        "event-timestamp": string | null;
        "publish-timestamp": string | null;
        "match-phase": 'not started' | '1st half' | '2nd half' | '1st overtime' | '2nd overtime' | 'penalties' | 'finished';
        status: 'live' | 'tentative' | 'official';
        "game-clock-in-min": number | null;
        "game-clock-in-sec": number | null;
        "last-modified-timestamp": string;
        "event-score": string;
    };
    "event-type": 'start-phase' | 'end-phase';
    "team-id": number;
}

export interface MedicalTreatmentEvent extends RedCardEvent {
    "player-id": number;
    "player-team-id": number;
}

export interface SubstitutionEvent extends RedCardEvent {
    "player-id": number | null;
    "player-team-id": number;
}

export interface SubstitutionEvent extends RedCardEvent {
    "player-id": number | null;
    "player-team-id": number;
}

export interface TeamStats {
    "home-team": number;
    "visiting-team": number;
}

export interface PossessionStats {
    "1st-half"?: number;
    "2nd-half"?: number;
    "1st-overtime"?: number;
    "2nd-overtime"?: number;
    "game-total"?: number;
    "game-total-percentage"?: number;
    "last-interval"?: number;
    "last-interval-game-clock"?: string;
    "measurement-unit": string;
    interval?: number;
}

export interface MatchStatistics {
    corners: TeamStats;
    "fouls-committed": TeamStats;
    goals: TeamStats;
    offsides: TeamStats;
    "red-cards": TeamStats;
    "yellow-cards": TeamStats;
    "shots-on-target": TeamStats;
    "total-shots": TeamStats;
    "home-team-possession": PossessionStats;
    "visiting-team-possession": PossessionStats;
}


export interface LiveStats {
    "home-team-score": number | null;
    "away-team-score": number | null;
    "match-phase": string | null;
    "game-clock-in-min": number | null;
    "game-clock-in-sec": number | null;
    "actual-start-of-first-half": string | null;
    "actual-end-of-first-half": string | null;
    "actual-start-of-second-half": string | null;
    "actual-end-of-second-half": string | null;
    attendees: number | null;
    statistics?: MatchStatistics;
    "livetrack-statistics"?: {
        "home-team-passes": PossessionStats;
        "home-team-successfull-passes": PossessionStats;
        "away-team-passes": PossessionStats;
        "away-team-successfull-passes": PossessionStats;
        "home-team-packing-rate": PossessionStats;
        "away-team-packing-rate": PossessionStats;
        "home-team-sprints": PossessionStats;
        "away-team-sprints": PossessionStats;
        "home-team-distance": PossessionStats;
        "away-team-distance": PossessionStats;
        "home-team-possession": PossessionStats;
        "away-team-possession": PossessionStats;
    };
}


export interface PlayerStats {
    "match-id": string;
    "player-id": number;
    passes: number | null;
    "failed-passes": number | null;
    "ball-wins": number | null;
    "ball-losses": number | null;
    "ball-time": number | null;
    "max-speed": number | null;
    distance: number | null;
    sprints: number | null;
    "sprint-distance": number | null;
    "high-intensity-runs": number | null;
    "high-intensity-run-distance": number | null;
    "mid-intensity-runs": number | null;
    "mid-intensity-run-distance": number | null;
    "low-intensity-runs": number | null;
    "low-intensity-run-distance": number | null;
}

// LiveData

export interface GeneralEventData {
    "external-event-id"?: string | null;
    description?: string | null;
    "event-timestamp"?: string | null;
    "publish-timestamp"?: string | null;
    "match-phase": string;
    status: "live" | "tentative" | "official";
    "game-clock-in-min"?: number | null;
    "game-clock-in-sec"?: number | null;
    "last-modified-timestamp"?: string | null;
    "event-score"?: string | null;
}

export interface Event {
    "event-id": number;
    description?: string;
    status: "live" | "tentative" | "official";
    "match-phase": "1st half" | "2nd half" | "1st overtime" | "2nd overtime" | "penalties";
    "game-clock-in-min": string;
    "game-clock-in-sec": string;
    "event-timestamp": string;
    "home-team-score": number;
    "away-team-score": number;
    "event-name": string;
    index: number;
}

export interface RedCard {
    "general-event-data": GeneralEventData;
    "player-id"?: number | null;
    "player-team-id": number;
    "card-reason": "violent conduct" | "second yellow" | "denying goal chance";
}

export interface YellowCardEvent {
    "general-event-data": GeneralEventData;
    "player-id"?: number | null;
    "player-team-id": number;
}



export interface MatchPhase {
    "general-event-data": GeneralEventData;
    "event-type": "start-phase" | "end-phase";
    "team-id": number;
}

export interface MedicalTreatment {
    "general-event-data": GeneralEventData;
    "player-id": number;
    "player-team-id": number;
}

export interface Substitution {
    "general-event-data": GeneralEventData;
    "player-id": number | null;
    "player-id-in": number | null;
    "player-team-id": number | null;
}

export interface Corner {
    "general-event-data": GeneralEventData;
    "team-id-awarded": number;
}

export interface FreeKick {
    "general-event-data": GeneralEventData;
    "player-id": number;
    "player-team-id": number;
    "player-id-offending": number;
    "player-team-id-offending": number;
}

export interface ButtonBlock {
    link: {
        type?: ('reference' | 'custom') | null;
        newTab?: boolean | null;
        reference?: {
            relationTo: 'pages';
            value: string | Page;
        } | null;
        url?: string | null;
        label: string;
        /**
         * Choose how the link should be rendered.
         */
        appearance?: ('default' | 'outline') | null;
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
    };
    icon?: (string | null) | Media;
    newTab?: boolean | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'ButtonBlock';
}

export interface FaqBlock {
    faqs: {
        question: string;
        answer: {
            root: {
                type: string;
                children: {
                    type: string;
                    version: number;
                    [k: string]: unknown;
                }[];
                direction: ('ltr' | 'rtl') | null;
                format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                indent: number;
                version: number;
            };
            [k: string]: unknown;
        };
        id?: string | null;
    }[];
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
    position?: ('relative' | 'absolute' | 'fixed' | 'sticky' | 'static') | null;
    overflow?: ('visible' | 'hidden' | 'auto' | 'scroll') | null;
    zIndex?: number | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'faqblock';
}

export type lineupPlayer = {
    id: number;
    displayName: string;
    givenName: string;
    surName: string;
    shirtNumber: number;
    hasBeenSubstituted: boolean;
    hasScored: boolean;
    hasWarning: boolean;
    hasRedCard: boolean;
    image: string;
    position: string;
    positionIndexFromBackRight: string;
    nationality: string;
    birthDay: string;
    passes: number | null;
    failedPasses: number | null;
    ballWins: number | null;
    ballLoses: number | null;
    ballTime: number | null;
    maxSpeed: number | null;
    distance: number | null;
    sprints: number | null;
    sprintDistance: number | null;
    highIntensityRuns: number | null;
    highIntensityRunDistance: number | null;
    midIntensityRuns: number | null;
    midIntensityRunDistance: number | null;
    lowIntensityRuns: number | null;
    lowIntensityRunDistance: number | null;
    shots: number;
    shotsOnTarget: number;
    goals: number;
};

export type TeamFormation = {
    formation: string;
    formationId: number;
    starting: lineupPlayer[];
    substitutes: lineupPlayer[];
};

export type MatchLineup = {
    homeTeamLineup: TeamFormation;
    visitingTeamLineup: TeamFormation;
};


export type TruppPlayers = {
    agent: string | null;
    smcId: number;
    surName: string;
    gender: "Man" | "Woman" | string;
    esId: number;
    displayName: string;
    clId: string;
    youthClub: string | null;
    forzasysId: number | null;
    foot: "Right" | "Left" | "Both" | null;
    height: number | null;
    fogisId: number;
    birthDay: string; // ISO string format: "YYYY-MM-DD"
    nickName: string;
    givenName: string;
    weight: number | null;
    fullName: string;
    socialMedia: {
        twitter: string | null;
        facebook: string | null;
        instagram: string | null;
    };
    efId: number;
    nationality: string;
    healthStatus: {
        injured: boolean;
    };
    position: {
        other: string[];
        primary: string;
    };
    optaId: number | null;
    currentClub: {
        shirtNumber: number;
        joined: string | null;
        contractType: string | null;
        name: string;
        active: boolean;
        contractUntil: string | null;
        id: string;
        status: string;
    }[];
    images: {
        fogisImage: string | null;
        sefImagePng: string | null;
    };
    meta: {
        updatedAt: number; // timestamp
    };
    currentSeasonStats: {
        goals: number;
        assists: number;
        matchesPlayed: number;
        redCards: number;
        yellowCards: number;
        matchesStarted: number;
        highestSpeed: number;

    };
    stats: {
        fogisIdPlayer: number;
        assists: number;
        goals: number;
        cleanSheet: number;
        gamesPlayed: number;
        matchesStarted: number;
        minutesPlayed: number;
        goalsConceded: number;
        id: string;
        leagueName: string;
        redCards: number;
        yellowCards: number;
        seasonStartYear: number;
        seasonEndYear: number;
        subins: number;
        subout: number;
        teamName: string;
        source: string;
        configLeagueName: string;
        configSeasonStartYear: number;
        goalsInfo: {
            corner: number;
            freeKick: number;
            header: number;
            normal: number;
            penalty: number;
            penalty10m: number;
        };
    }[];
};

export type MatchForm = {
    matchResult: 'W' | 'D' | 'L';
    homeTeamAbbrv: string;
    visitingTeamAbbrv: string;
    homeTeamScore: number;
    visitingTeamScore: number;
    startDate: string;
    round: number;
    configLeagueName: string;
    configSeasonStartYear: number;
    homeTeamName: string;
    visitingTeamName: string;
    homeTeamDisplayName: string;
    visitingTeamDisplayName: string;
};

export type StandingsTeamStats = {
    borderType: 'noborder';
    id: string;
    teamId: number;
    name: string;
    abbrv: string;
    position: number;
    stats: {
        name: string;
        value: number;
    }[];
    logoImageUrl: string;
    displayName: string;
    form: MatchForm[];
};

export type StandingsTypes = StandingsTeamStats[];

export type SMCMatchPhaseTypes = {
    'general-event-data': {
        'external-event-id': string | null;
        description: string | null;
        'event-timestamp': string | null;
        'publish-timestamp': string | null;
        'match-phase': 'not started' | '1st half' | '2nd half' | '1st overtime' | '2nd overtime' | 'penalties' | 'finished';
        status: 'live' | 'tentative' | 'official';
        'game-clock-in-min': number | null;
        'game-clock-in-sec': number | null;
        'last-modified-timestamp': string;
        'event-score': string;
    };
    'event-type': 'start-phase' | 'end-phase';
    'team-id': number;
};

export type SuperAdminTeamStats = {
    name: string;
    displayName: string;
    smcId: number;
    abbrv: string;
    fogisId: number;
    goals: number;
    shots: number;
    shotsOnTarget: number;
    shotsPostOrBar: number;
    penaltyGoals: number;
    subinGoals: number;
    headerGoals: number;
    cornerHeaderGoals: number;
    freekickGoals: number;
    allCornerGoals: number;
    setPieceGoals: number;
    concededCornerGoals: number;
    yellowCards: number;
    redCards: number;
    corners: number;
    distanceAsHomeTeam: number;
    distanceAsVisitingTeam: number;
    totalDistance: number;
    matchesPlayedAsHomeTeam: number;
    matchesPlayedAsVisitingTeam: number;
    matchesPlayed: number;
    concededGoalsSetPiece: number;
    homeTeamFirstPeriodAveragePossesion: number;
    homeTeamSecondPeriodAveragePossesion: number;
    visitingTeamFirstPeriodAveragePossesion: number;
    visitingTeamSecondPeriodAveragePossesion: number;
    averagePossesion: number;
    logoImage: string;
    averageAttendees: number;
    totalAttendees: number;
};