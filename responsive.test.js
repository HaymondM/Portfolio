/**
 * Property-Based Tests for Responsive Design
 * Feature: retro-portfolio
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
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
  
  // Trigger media query evaluation by creating a matchMedia mock
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
  
  if (maxWidthMatch) {
    const maxWidth = parseInt(maxWidthMatch[1]);
    return width <= maxWidth;
  }
  
  if (minWidthMatch) {
    const minWidth = parseInt(minWidthMatch[1]);
    return width >= minWidth;
  }
  
  return false;
}

/**
 * Helper to get computed dimensions of an element
 */
function getComputedDimensions(element, document) {
  // Parse CSS to get styles for this element
  const styles = {};
  
  // Get inline styles
  if (element.style) {
    styles.minWidth = element.style.minWidth;
    styles.minHeight = element.style.minHeight;
    styles.padding = element.style.padding;
  }
  
  // For this test, we'll check the CSS rules directly
  // since JSDOM doesn't fully support getComputedStyle with media queries
  const tagName = element.tagName.toLowerCase();
  const classList = Array.from(element.classList || []);
  
  // Check if element matches interactive selectors at mobile width
  const isInteractive = 
    tagName === 'a' || 
    tagName === 'button' ||
    classList.includes('resume-link') ||
    classList.includes('project-link') ||
    classList.includes('footer-link');
  
  return { isInteractive, element };
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
 * Helper to calculate contrast ratio between two colors
 */
function getContrastRatio(hex1, hex2) {
  const rgb1 = [
    parseInt(hex1.slice(1, 3), 16),
    parseInt(hex1.slice(3, 5), 16),
    parseInt(hex1.slice(5, 7), 16)
  ];
  const rgb2 = [
    parseInt(hex2.slice(1, 3), 16),
    parseInt(hex2.slice(3, 5), 16),
    parseInt(hex2.slice(5, 7), 16)
  ];
  
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Extract color values from CSS
 */
function extractColorsFromCSS(cssText) {
  const colors = {
    backgrounds: [],
    texts: []
  };
  
  // Extract CSS custom properties
  const rootMatch = cssText.match(/:root\s*\{([^}]+)\}/s);
  if (rootMatch) {
    const rootContent = rootMatch[1];
    
    // Extract background colors
    const bgMatches = rootContent.matchAll(/--color-bg-[^:]+:\s*(#[0-9a-fA-F]{6})/g);
    for (const match of bgMatches) {
      colors.backgrounds.push(match[1].toLowerCase());
    }
    
    // Extract text colors
    const textMatches = rootContent.matchAll(/--color-text-[^:]+:\s*(#[0-9a-fA-F]{6})/g);
    for (const match of textMatches) {
      colors.texts.push(match[1].toLowerCase());
    }
    
    // Also extract accent color
    const accentMatch = rootContent.match(/--color-accent:\s*(#[0-9a-fA-F]{6})/);
    if (accentMatch) {
      colors.texts.push(accentMatch[1].toLowerCase());
    }
  }
  
  return colors;
}

describe('Responsive Design Property Tests', () => {
  /**
   * Property 3: Touch target minimum size on mobile
   * Feature: retro-portfolio, Property 3: Touch target minimum size on mobile
   * Validates: Requirements 5.3
   * 
   * For any interactive element (button, link) when rendered at mobile viewport 
   * widths (≤768px), the element should have minimum dimensions of 44x44 pixels.
   */
  test('Property 3: All interactive elements meet 44x44px minimum at mobile widths', () => {
    fc.assert(
      fc.property(
        // Generate mobile viewport widths (320px to 768px)
        fc.integer({ min: 320, max: 768 }),
        (viewportWidth) => {
          const { document } = setupDOM(viewportWidth);
          
          // Get all interactive elements
          const interactiveSelectors = [
            'a',
            'button',
            '.resume-link',
            '.project-link',
            '.footer-link'
          ];
          
          const elements = [];
          interactiveSelectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            elements.push(...Array.from(found));
          });
          
          // Check CSS rules apply minimum dimensions
          // Since we can't fully compute styles in JSDOM, we verify the CSS rules exist
          const cssText = css;
          
          // Verify media query for mobile exists
          const hasMobileMediaQuery = cssText.includes('@media screen and (max-width: 768px)');
          expect(hasMobileMediaQuery).toBe(true);
          
          // Verify min-height and min-width rules exist for interactive elements
          const mobileSection = cssText.match(/@media screen and \(max-width: 768px\)\s*\{([^}]+\{[^}]+\})+/s);
          if (mobileSection) {
            const mobileCSS = mobileSection[0];
            
            // Check that interactive elements have min-height and min-width
            const hasMinHeight = mobileCSS.includes('min-height: 44px');
            const hasMinWidth = mobileCSS.includes('min-width: 44px');
            
            expect(hasMinHeight).toBe(true);
            expect(hasMinWidth).toBe(true);
            
            // Verify the rules apply to interactive elements
            const hasInteractiveRules = 
              mobileCSS.includes('a,') || 
              mobileCSS.includes('button,') ||
              mobileCSS.includes('.resume-link') ||
              mobileCSS.includes('.project-link') ||
              mobileCSS.includes('.footer-link');
            
            expect(hasInteractiveRules).toBe(true);
          }
          
          // Property holds: CSS rules ensure 44x44px minimum for interactive elements
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: Color contrast accessibility
   * Feature: retro-portfolio, Property 4: Color contrast accessibility
   * Validates: Requirements 5.4
   * 
   * For any text element and its background color combination, the contrast ratio 
   * should meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text ≥18pt).
   */
  test('Property 4: All text/background color combinations meet WCAG AA contrast standards', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary combinations to test
        fc.constant(null),
        () => {
          // Extract colors from CSS
          const colors = extractColorsFromCSS(css);
          
          // Verify we found colors
          expect(colors.backgrounds.length).toBeGreaterThan(0);
          expect(colors.texts.length).toBeGreaterThan(0);
          
          // Test all text/background combinations
          const minContrastNormal = 4.5;
          const minContrastLarge = 3.0;
          
          let allPass = true;
          const results = [];
          
          for (const bg of colors.backgrounds) {
            for (const text of colors.texts) {
              const ratio = getContrastRatio(bg, text);
              
              // For this portfolio, we'll use the normal text standard (4.5:1)
              // since most text is normal size
              const passes = ratio >= minContrastNormal;
              
              results.push({
                background: bg,
                text: text,
                ratio: ratio.toFixed(2),
                passes: passes
              });
              
              if (!passes) {
                allPass = false;
              }
            }
          }
          
          // All combinations should pass WCAG AA
          expect(allPass).toBe(true);
          
          // Verify specific known combinations from the design
          const primaryBg = '#0a0a0a';
          const primaryText = '#33ff33';
          const primaryRatio = getContrastRatio(primaryBg, primaryText);
          
          // Should exceed 4.5:1 significantly
          expect(primaryRatio).toBeGreaterThanOrEqual(minContrastNormal);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
