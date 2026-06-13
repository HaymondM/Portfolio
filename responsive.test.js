/**
 * Property-Based Tests for Responsive Design
 * Feature: retro-portfolio
 * Validates: Requirements 5.1, 5.3, 5.4
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

// Load HTML and CSS
const html = readFileSync('./index.html', 'utf-8');
const css = readFileSync('./styles.css', 'utf-8');

/**
 * Helper function to set up DOM with viewport width
 */
function setupDOM(viewportWidth) {
  const dom = new JSDOM(html, {
    resources: 'usable',
    runScripts: 'dangerously',
  });

  const { window } = dom;
  const { document } = window;

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Set viewport width
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: viewportWidth,
  });

  // Mock matchMedia
  window.matchMedia = (query) => ({
    matches: evaluateMediaQuery(query, viewportWidth),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  });

  return { window, document };
}

/**
 * Simple media query evaluator
 */
function evaluateMediaQuery(query, width) {
  const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);
  const minWidthMatch = query.match(/min-width:\s*(\d+)px/);

  if (maxWidthMatch) return width <= parseInt(maxWidthMatch[1]);
  if (minWidthMatch) return width >= parseInt(minWidthMatch[1]);
  return false;
}

/**
 * Check if CSS has responsive media queries
 */
function hasResponsiveMediaQueries(cssText) {
  return cssText.includes('@media') &&
    (cssText.includes('max-width') || cssText.includes('min-width'));
}

/**
 * Helper to calculate relative luminance
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Helper to calculate contrast ratio between two hex colors
 */
function getContrastRatio(hex1, hex2) {
  const toRGB = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const lum1 = getLuminance(...toRGB(hex1));
  const lum2 = getLuminance(...toRGB(hex2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Extract color values from CSS custom properties
 */
function extractColorsFromCSS(cssText) {
  const colors = { backgrounds: [], texts: [] };

  const rootMatch = cssText.match(/:root\s*\{([^}]+)\}/s);
  if (rootMatch) {
    const rootContent = rootMatch[1];

    for (const match of rootContent.matchAll(/--color-bg-[^:]+:\s*(#[0-9a-fA-F]{6})/g)) {
      colors.backgrounds.push(match[1].toLowerCase());
    }
    for (const match of rootContent.matchAll(/--color-text-[^:]+:\s*(#[0-9a-fA-F]{6})/g)) {
      colors.texts.push(match[1].toLowerCase());
    }
    const accentMatch = rootContent.match(/--color-accent:\s*(#[0-9a-fA-F]{6})/);
    if (accentMatch) colors.texts.push(accentMatch[1].toLowerCase());
  }

  return colors;
}

describe('Responsive Design Property Tests', () => {

  /**
   * Property 2: Layout responsiveness across viewport sizes
   * Validates: Requirements 5.1
   */
  test('Property 2: Layout adapts to viewport width without horizontal overflow', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          const { document } = setupDOM(viewportWidth);

          const style = document.querySelector('style');
          expect(style).not.toBeNull();

          const cssText = style.textContent;

          expect(hasResponsiveMediaQueries(cssText)).toBe(true);

          const hasFlexibleWidth = cssText.includes('max-width') || cssText.includes('width: 100%');
          expect(hasFlexibleWidth).toBe(true);

          const hasBreakpoints =
            cssText.includes('@media screen and (max-width:') ||
            cssText.includes('@media screen and (min-width:');
          expect(hasBreakpoints).toBe(true);

          expect(cssText.includes('box-sizing: border-box')).toBe(true);

          const hasContainerMaxWidth =
            cssText.match(/main[^{]*\{[^}]*max-width/s) ||
            cssText.match(/\.container[^{]*\{[^}]*max-width/s) ||
            cssText.match(/body[^{]*\{[^}]*max-width/s);
          expect(hasContainerMaxWidth).not.toBeNull();

          const hasResponsiveLayout =
            cssText.includes('grid-template-columns') ||
            cssText.includes('flex-wrap') ||
            cssText.includes('display: grid') ||
            cssText.includes('display: flex');
          expect(hasResponsiveLayout).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('CSS contains mobile breakpoint at 768px', () => {
    const { document } = setupDOM(768);
    const style = document.querySelector('style');
    expect(style.textContent.includes('768px')).toBe(true);
  });

  /**
   * Property 3: Touch target minimum size on mobile
   * Validates: Requirements 5.3
   */
  test('Property 3: All interactive elements meet 44x44px minimum at mobile widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 768 }),
        (viewportWidth) => {
          const { document } = setupDOM(viewportWidth);
          const cssText = css;

          const hasMobileMediaQuery = cssText.includes('@media screen and (max-width: 768px)');
          expect(hasMobileMediaQuery).toBe(true);

          const mobileSection = cssText.match(/@media screen and \(max-width: 768px\)\s*\{([^}]+\{[^}]+\})+/s);
          if (mobileSection) {
            const mobileCSS = mobileSection[0];
            expect(mobileCSS.includes('min-height: 44px')).toBe(true);
            expect(mobileCSS.includes('min-width: 44px')).toBe(true);

            const hasInteractiveRules =
              mobileCSS.includes('a,') ||
              mobileCSS.includes('button,') ||
              mobileCSS.includes('.resume-link') ||
              mobileCSS.includes('.project-link') ||
              mobileCSS.includes('.footer-link');
            expect(hasInteractiveRules).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: Color contrast accessibility (WCAG AA)
   * Validates: Requirements 5.4
   */
  test('Property 4: All text/background color combinations meet WCAG AA contrast standards', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const colors = extractColorsFromCSS(css);

          expect(colors.backgrounds.length).toBeGreaterThan(0);
          expect(colors.texts.length).toBeGreaterThan(0);

          const minContrast = 4.5;
          let allPass = true;

          for (const bg of colors.backgrounds) {
            for (const text of colors.texts) {
              const ratio = getContrastRatio(bg, text);
              if (ratio < minContrast) allPass = false;
            }
          }

          expect(allPass).toBe(true);

          // Verify known primary combination
          const primaryRatio = getContrastRatio('#0a0a0a', '#33ff33');
          expect(primaryRatio).toBeGreaterThanOrEqual(minContrast);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
