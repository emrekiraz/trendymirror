import theme from '@/app/styles/theme';

/**
 * Get a color value from the theme
 * @param path - Path to the color (e.g., 'blue.primary', 'gray.900')
 * @returns The color value or undefined if not found
 */
export function getColor(path: string): string | undefined {
  const parts = path.split('.');
  let result: any = theme.colors;
  
  for (const part of parts) {
    if (result && result[part] !== undefined) {
      result = result[part];
    } else {
      return undefined;
    }
  }
  
  return typeof result === 'string' ? result : undefined;
}

/**
 * Get a font family from the theme
 * @param key - Key of the font family (e.g., 'primary', 'logo')
 * @returns The font family or undefined if not found
 */
export function getFontFamily(key: string): string | undefined {
  return theme.typography.fontFamily[key as keyof typeof theme.typography.fontFamily];
}

/**
 * Get a spacing value from the theme
 * @param key - Key of the spacing value (e.g., '4', '8')
 * @returns The spacing value or undefined if not found
 */
export function getSpacing(key: string | number): string | undefined {
  return theme.spacing[key as keyof typeof theme.spacing];
}

/**
 * Get a shadow value from the theme
 * @param key - Key of the shadow value (e.g., 'level1', 'level2')
 * @returns The shadow value or undefined if not found
 */
export function getShadow(key: string): string | undefined {
  return theme.shadows[key as keyof typeof theme.shadows];
}

/**
 * Get a border radius value from the theme
 * @param key - Key of the border radius value (e.g., 'sm', 'md')
 * @returns The border radius value or undefined if not found
 */
export function getBorderRadius(key: string): string | undefined {
  return theme.borders.radius[key as keyof typeof theme.borders.radius];
}

/**
 * Get a button style from the theme
 * @param variant - Button variant (e.g., 'primary', 'secondary')
 * @returns The button style object or undefined if not found
 */
export function getButtonStyle(variant: string): any {
  return theme.buttons[variant as keyof typeof theme.buttons];
}

/**
 * Get a badge style from the theme
 * @param variant - Badge variant (e.g., 'default', 'primary')
 * @returns The badge style object or undefined if not found
 */
export function getBadgeStyle(variant: string): any {
  return theme.badges[variant as keyof typeof theme.badges];
}

/**
 * Get a card style from the theme
 * @param variant - Card variant (e.g., 'default', 'feature')
 * @returns The card style object or undefined if not found
 */
export function getCardStyle(variant: string): any {
  return theme.cards[variant as keyof typeof theme.cards];
}

/**
 * Get a breakpoint value from the theme
 * @param key - Key of the breakpoint value (e.g., 'sm', 'md')
 * @returns The breakpoint value or undefined if not found
 */
export function getBreakpoint(key: string): string | undefined {
  return theme.breakpoints[key as keyof typeof theme.breakpoints];
}

/**
 * Get a transition value from the theme
 * @param key - Key of the transition value (e.g., 'fast', 'normal')
 * @returns The transition value or undefined if not found
 */
export function getTransition(key: string): string | undefined {
  return theme.transitions[key as keyof typeof theme.transitions];
}

/**
 * Get a z-index value from the theme
 * @param key - Key of the z-index value (e.g., 'dropdown', 'modal')
 * @returns The z-index value or undefined if not found
 */
export function getZIndex(key: string): number | undefined {
  return theme.zIndex[key as keyof typeof theme.zIndex];
}

/**
 * Get a heading style from the theme
 * @param level - Heading level (e.g., 'h1', 'h2')
 * @returns The heading style object or undefined if not found
 */
export function getHeadingStyle(level: string): any {
  return theme.typography.headings[level as keyof typeof theme.typography.headings];
}

/**
 * Get a font weight from the theme
 * @param key - Key of the font weight (e.g., 'regular', 'bold')
 * @returns The font weight or undefined if not found
 */
export function getFontWeight(key: string): number | undefined {
  return theme.typography.fontWeight[key as keyof typeof theme.typography.fontWeight];
}

/**
 * Get a font size from the theme
 * @param key - Key of the font size (e.g., 'sm', 'lg')
 * @returns The font size or undefined if not found
 */
export function getFontSize(key: string): string | undefined {
  return theme.typography.fontSize[key as keyof typeof theme.typography.fontSize];
}

/**
 * Get a line height from the theme
 * @param key - Key of the line height (e.g., 'tight', 'normal')
 * @returns The line height or undefined if not found
 */
export function getLineHeight(key: string): string | undefined {
  return theme.typography.lineHeight[key as keyof typeof theme.typography.lineHeight];
}

/**
 * Get the logo style from the theme
 * @returns The logo style object
 */
export function getLogoStyle(): any {
  return theme.logo.text;
}

export default {
  getColor,
  getFontFamily,
  getSpacing,
  getShadow,
  getBorderRadius,
  getButtonStyle,
  getBadgeStyle,
  getCardStyle,
  getBreakpoint,
  getTransition,
  getZIndex,
  getHeadingStyle,
  getFontWeight,
  getFontSize,
  getLineHeight,
  getLogoStyle,
}; 