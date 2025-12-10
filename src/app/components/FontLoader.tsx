/**
 * FontLoader Component
 * Loads fonts and typography presets from Frontspace CMS theme settings
 */

import type { ThemeSettings, Font, TypographyPreset } from '@/lib/frontspace/types';

interface FontLoaderProps {
  themeSettings: ThemeSettings | null;
}

/**
 * Generate Google Fonts URL
 */
function generateGoogleFontLink(font: Font): string {
  const familyParam = font.fontFamily.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${familyParam}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`;
}

/**
 * Generate @font-face CSS for custom fonts
 */
function generateCustomFontCSS(font: Font): string {
  if (!font.variants?.length) return '';

  return font.variants
    .map(
      (variant) => `
    @font-face {
      font-family: '${font.fontFamily}';
      src: url('${variant.url}') format('${variant.format}');
      font-weight: ${variant.weight};
      font-style: ${variant.style};
      font-display: swap;
    }
  `
    )
    .join('\n');
}

/**
 * Generate CSS variables for fonts
 */
function generateFontVariables(fonts: Font[]): string {
  const variables: string[] = [];

  fonts.forEach((font, index) => {
    variables.push(`--font-${index + 1}: '${font.fontFamily}', sans-serif;`);

    // Check for defaultFor structure (new backend format)
    if (font.defaultFor?.headings) {
      variables.push(`--font-headings: '${font.fontFamily}', sans-serif;`);
    }
    if (font.defaultFor?.body) {
      variables.push(`--font-body: '${font.fontFamily}', sans-serif;`);
    }
    if (font.defaultFor?.buttons) {
      variables.push(`--font-buttons: '${font.fontFamily}', sans-serif;`);
    }

    // Legacy support for isDefault string format
    if (font.isDefault === 'headings' || font.isDefault === true) {
      variables.push(`--font-headings: '${font.fontFamily}', sans-serif;`);
    }
    if (font.isDefault === 'body') {
      variables.push(`--font-body: '${font.fontFamily}', sans-serif;`);
    }
    if (font.isDefault === 'buttons') {
      variables.push(`--font-buttons: '${font.fontFamily}', sans-serif;`);
    }
  });

  // Remove duplicates
  const uniqueVariables = [...new Set(variables)];
  return `:root {\n  ${uniqueVariables.join('\n  ')}\n}`;
}

/**
 * Generate typography preset CSS
 */
function generateTypographyCSS(presets: TypographyPreset[]): string {
  let css = '';

  presets.forEach((preset) => {
    const selector = preset.selector;

    // Desktop styles (default)
    const desktopStyles: string[] = [];

    if (preset.fontFamily) {
      desktopStyles.push(`font-family: '${preset.fontFamily}', sans-serif`);
    }
    if (preset.fontWeight) {
      desktopStyles.push(`font-weight: ${preset.fontWeight}`);
    }
    if (preset.textTransform) {
      desktopStyles.push(`text-transform: ${preset.textTransform}`);
    }
    if (preset.fontStyle) {
      desktopStyles.push(`font-style: ${preset.fontStyle}`);
    }
    if (preset.textDecoration) {
      desktopStyles.push(`text-decoration: ${preset.textDecoration}`);
    }
    if (preset.fontSize?.desktop) {
      desktopStyles.push(`font-size: ${preset.fontSize.desktop}`);
    }
    if (preset.lineHeight?.desktop) {
      desktopStyles.push(`line-height: ${preset.lineHeight.desktop}`);
    }
    if (preset.letterSpacing?.desktop) {
      desktopStyles.push(`letter-spacing: ${preset.letterSpacing.desktop}`);
    }
    if (preset.paragraphMargin?.desktop && selector === 'p') {
      desktopStyles.push(`margin-bottom: ${preset.paragraphMargin.desktop}`);
    }

    if (desktopStyles.length > 0) {
      css += `${selector} { ${desktopStyles.join('; ')}; }\n`;
    }

    // Tablet styles (768px - 1023px)
    const tabletStyles: string[] = [];
    if (preset.fontSize?.tablet) tabletStyles.push(`font-size: ${preset.fontSize.tablet}`);
    if (preset.lineHeight?.tablet) tabletStyles.push(`line-height: ${preset.lineHeight.tablet}`);
    if (preset.letterSpacing?.tablet) tabletStyles.push(`letter-spacing: ${preset.letterSpacing.tablet}`);

    if (tabletStyles.length > 0) {
      css += `@media (min-width: 768px) and (max-width: 1023px) {\n  ${selector} { ${tabletStyles.join('; ')}; }\n}\n`;
    }

    // Mobile styles (max 767px)
    const mobileStyles: string[] = [];
    if (preset.fontSize?.mobile) mobileStyles.push(`font-size: ${preset.fontSize.mobile}`);
    if (preset.lineHeight?.mobile) mobileStyles.push(`line-height: ${preset.lineHeight.mobile}`);
    if (preset.letterSpacing?.mobile) mobileStyles.push(`letter-spacing: ${preset.letterSpacing.mobile}`);

    if (mobileStyles.length > 0) {
      css += `@media (max-width: 767px) {\n  ${selector} { ${mobileStyles.join('; ')}; }\n}\n`;
    }
  });

  return css;
}

export function FontLoader({ themeSettings }: FontLoaderProps) {
  if (!themeSettings) return null;

  const { fonts = [], typographyPresets = [] } = themeSettings;

  // Google Fonts links
  const googleFonts = fonts.filter((f) => f.type === 'google');

  // Custom font @font-face CSS
  const customFontCSS = fonts
    .filter((f) => f.type === 'custom')
    .map(generateCustomFontCSS)
    .join('\n');

  // CSS variables for font references
  const fontVariablesCSS = fonts.length > 0 ? generateFontVariables(fonts) : '';

  // Typography preset CSS
  const typographyCSS = typographyPresets.length > 0 ? generateTypographyCSS(typographyPresets) : '';

  // Combine all CSS
  const combinedCSS = [customFontCSS, fontVariablesCSS, typographyCSS].filter(Boolean).join('\n\n');

  return (
    <>
      {/* Google Fonts */}
      {googleFonts.map((font) => (
        <link key={font.id} rel="stylesheet" href={generateGoogleFontLink(font)} />
      ))}

      {/* Custom fonts and typography CSS */}
      {combinedCSS && <style dangerouslySetInnerHTML={{ __html: combinedCSS }} />}
    </>
  );
}
