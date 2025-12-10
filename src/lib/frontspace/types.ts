/**
 * Frontspace CMS Type Definitions
 * These types match the Frontspace post types for Östers IF
 */

// Base post interface that all posts extend
export interface FrontspacePost {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
}

// Media/Image type
export interface FrontspaceMedia {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  fileSize?: number;
}

// Rich text/content field
export interface RichTextContent {
  type: string;
  children?: any[];
  [key: string]: any;
}

/**
 * Personal (Staff/Team members)
 */
export interface Personal extends FrontspacePost {
  namn: string;
  befattning?: string;
  avdelning?: Personalavdelningar;
  bild?: FrontspaceMedia;
  telefon?: string;
  epost?: string;
  beskrivning?: RichTextContent[];
  visaPaHemsida?: boolean;
}

/**
 * Personalavdelningar (Staff departments)
 */
export interface Personalavdelningar extends FrontspacePost {
  namn: string;
  beskrivning?: string;
  ordning?: number;
}

/**
 * Lag (Teams)
 */
export interface Lag extends FrontspacePost {
  namn: string;
  argang?: string;
  kon?: 'herr' | 'dam';
  liga?: string;
  lagbild?: FrontspaceMedia;
  truppbild?: FrontspaceMedia;
  beskrivning?: RichTextContent[];
  matcher?: any[]; // Reference to matches if stored in Frontspace
  spelare?: any[]; // Players
  ledare?: Personal[];
}

/**
 * Partners
 */
export interface Partner extends FrontspacePost {
  namn: string;
  logotyp?: FrontspaceMedia;
  beskrivning?: RichTextContent[];
  webbplats?: string;
  partnerniva?: Partnerniva;
  paket?: Partnerpaket[];
  visaPaHemsida?: boolean;
  ordning?: number;
}

/**
 * Partnerpaket (Partner packages)
 */
export interface Partnerpaket extends FrontspacePost {
  namn: string;
  beskrivning?: RichTextContent[];
  pris?: number;
  kategori?: PartnerpaketKategori;
  fordeler?: string[];
  visaPaHemsida?: boolean;
}

/**
 * Partnerpaket-kategorier (Partner package categories)
 */
export interface PartnerpaketKategori extends FrontspacePost {
  namn: string;
  beskrivning?: string;
  ordning?: number;
}

/**
 * Partnernivaer (Partner levels)
 */
export interface Partnerniva extends FrontspacePost {
  namn: string;
  beskrivning?: string;
  farg?: string; // Hex color code
  ordning?: number;
  logotypStorlek?: 'liten' | 'mellan' | 'stor';
}

/**
 * Dokument (Documents)
 */
export interface Dokument extends FrontspacePost {
  namn: string;
  fil?: FrontspaceMedia;
  kategori?: Dokumentkategori;
  beskrivning?: string;
  visaPaHemsida?: boolean;
  datum?: string;
}

/**
 * Nyheter (News/Posts)
 */
export interface Nyhet extends FrontspacePost {
  rubrik: string;
  ingress?: string;
  innehall?: RichTextContent[];
  huvudbild?: FrontspaceMedia;
  galleri?: FrontspaceMedia[];
  kategorier?: Nyhetskategori[];
  forfattare?: Personal;
  publiceringsdatum?: string;
  fastPost?: boolean; // Pinned post
  visaPaHemsida?: boolean;
}

/**
 * Nyhetskategorier (News categories)
 */
export interface Nyhetskategori extends FrontspacePost {
  namn: string;
  beskrivning?: string;
  farg?: string; // Hex color code
  ordning?: number;
}

/**
 * Jobb (Job listings)
 */
export interface Jobb extends FrontspacePost {
  titel: string;
  beskrivning?: RichTextContent[];
  ansokningslank?: string;
  sistaAnsokningsDatum?: string;
  anstallningsTyp?: 'heltid' | 'deltid' | 'projekt' | 'praktik';
  plats?: string;
  avdelning?: Personalavdelningar;
  visaPaHemsida?: boolean;
}

/**
 * Dokumentkategorier (Document categories)
 */
export interface Dokumentkategori extends FrontspacePost {
  namn: string;
  beskrivning?: string;
  ordning?: number;
}

/**
 * Pages (Sidor)
 */
export interface Sida extends FrontspacePost {
  titel: string;
  hero?: {
    type: 'none' | 'fullscreenSlider' | 'highImpact' | 'mediumImpact' | 'lowImpact' | 'columnLayout' | 'default';
    richText?: RichTextContent[];
    links?: Array<{
      link: {
        type?: 'reference' | 'custom';
        newTab?: boolean;
        url?: string;
        label: string;
        appearance?: 'default' | 'outline';
      };
      id?: string;
    }>;
    media?: FrontspaceMedia;
  };
  layout?: any[]; // Content blocks
  meta?: {
    title?: string;
    description?: string;
    image?: FrontspaceMedia;
  };
}

/**
 * Block types for BlockRenderer
 */
export interface PageBlock {
  id: string;
  type: string;
  content: any;
  styles?: Record<string, any>;
  responsiveStyles?: Record<string, Record<string, any>>;
}

export interface TemplateContent {
  blocks: PageBlock[];
}

/**
 * Footer template from Frontspace CMS
 */
export interface FooterSettings {
  background?: string;
  padding?: string;
}

export interface Conditions {
  visibility?: string;
  pages?: string[];
  pageTypes?: string[];
  devices?: string[];
}

export interface Footer {
  id: string;
  name: string;
  content: TemplateContent;
  footerSettings?: FooterSettings;
  conditions?: Conditions;
}

/**
 * Header template from Frontspace CMS
 */
export interface HeaderSettings {
  // Header positioning: 'regular' | 'sticky' | 'fixed'
  position?: 'regular' | 'sticky' | 'fixed';
  // Background style: 'solid' | 'transparent' | 'blur'
  background?: 'solid' | 'transparent' | 'blur';
  // Show shadow below header
  shadow?: boolean;
  // Text color when scrolled (for sticky/fixed headers)
  colorOnScroll?: string;
  // Background color when scrolled
  backgroundColorOnScroll?: string;
  // Alternative logo URL when scrolled
  logoOnScroll?: string;
  // Logo behavior on scroll: 'none' | 'custom' | 'invert'
  logoMode?: 'none' | 'custom' | 'invert';
}

export interface Header {
  id: string;
  name: string;
  content: TemplateContent;
  headerSettings?: HeaderSettings;
  conditions?: Conditions;
}

/**
 * Font System Types
 */
export interface FontVariant {
  weight: number;
  style: 'normal' | 'italic';
  url: string;
  fileName: string;
  format: string;
}

export interface FontDefaultFor {
  headings?: { weight?: number; style?: 'normal' | 'italic' };
  body?: { weight?: number; style?: 'normal' | 'italic' };
  buttons?: { weight?: number; style?: 'normal' | 'italic' };
}

export interface Font {
  id: string;
  name: string;
  type: 'google' | 'custom';
  fontFamily: string;
  variants?: FontVariant[];
  defaultFor?: FontDefaultFor;
  isDefault?: 'headings' | 'body' | 'buttons' | boolean; // Legacy support
}

export interface ResponsiveValue {
  desktop?: string;
  tablet?: string;
  mobile?: string;
}

export interface TypographyPreset {
  id: string;
  selector: string;
  label: string;
  fontFamily?: string;
  fontWeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  fontSize?: ResponsiveValue;
  lineHeight?: ResponsiveValue;
  letterSpacing?: ResponsiveValue;
  paragraphMargin?: ResponsiveValue;
}

export interface ColorPalette {
  id: string;
  name: string;
  value: string;
}

export interface ThemeSettings {
  fonts: Font[];
  colors: ColorPalette[];
  typographyPresets?: TypographyPreset[];
}

/**
 * API Response types
 */
export interface FrontspaceListResponse<T> {
  posts: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface FrontspaceSingleResponse<T> {
  post: T;
}
