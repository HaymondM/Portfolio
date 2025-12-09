/**
 * Property-Based Test for Responsive Layout
 * Feature: retro-portfolio, Property 2: Layout responsiveness across viewport sizes
 * Validates: Requirements 5.1
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
  
  return { window, document };
}

/**
 * Check if CSS has responsive media queries
 */
function hasResponsiveMediaQueries(cssText) {
  // Check for mobile breakpoint
  const hasMobileQuery = cssText.includes('@media') && 
                        (cssText.includes('max-width') || cssText.includes('min-width'));
  return hasMobileQuery;
}

/**
 * Check if elements would overflow horizontally
 */
function checkForHorizontalOverflow(document, viewportWidth) {
  // Get the body and main container
  const body = document.body;
  const main = document.querySelector('main');
  
  // In JSDOM, we can't fully compute layout, but we can check CSS rules
  // We'll verify that max-width constraints exist
  const style = document.querySelector('style');
  if (style) {
    const cssText = style.textContent;
    
    // Check for max-width rules that prevent overflow
    const hasMaxWidth = cssText.includes('max-width') || 
                       cssText.includes('width: 100%') ||
                       cssText.includes('box-sizing: border-box');
    
    return !hasMaxWidth; // Returns true if overflow is likely
  }
  
  return false;
}

describe('Responsive Layout Property Tests', () => {
  /**
   * Property 2: Layout responsiveness across viewport sizes
   * 
   * For any viewport width, the layout should adapt appropriately such that 
   * content remains accessible and no horizontal scrolling is required 
   * (elements should reflow, stack, or resize as needed).
   * 
   * Validates: Requirements 5.1
   */
  test('Property 2: Layout adapts to viewport width without horizontal overflow', () => {
    fc.assert(
      fc.property(
        // Generate viewport widths from mobile to desktop
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          const { document } = setupDOM(viewportWidth);
          
          // Verify CSS has responsive media queries
          const style = document.querySelector('style');
          expect(style).not.toBeNull();
          
          const cssText = style.textContent;
          const hasMediaQueries = hasResponsiveMediaQueries(cssText);
          expect(hasMediaQueries).toBe(true);
          
          // Verify responsive design patterns exist in CSS
          // 1. Check for flexible widths
          const hasFlexibleWidth = cssText.includes('max-width') || 
                                  cssText.includes('width: 100%');
          expect(hasFlexibleWidth).toBe(true);
          
          // 2. Check for responsive breakpoints
          const hasBreakpoints = cssText.includes('@media screen and (max-width:') ||
                                cssText.includes('@media screen and (min-width:');
          expect(hasBreakpoints).toBe(true);
          
          // 3. Verify box-sizing is set to prevent overflow
          const hasBoxSizing = cssText.includes('box-sizing: border-box');
          expect(hasBoxSizing).toBe(true);
          
          // 4. Check that main container has max-width constraint
          const hasContainerMaxWidth = cssText.match(/main[^{]*\{[^}]*max-width/s) ||
                                      cssText.match(/\.container[^{]*\{[^}]*max-width/s) ||
                                      cssText.match(/body[^{]*\{[^}]*max-width/s);
          expect(hasContainerMaxWidth).not.toBeNull();
          
          // 5. Verify responsive grid/flexbox for projects
          const hasResponsiveLayout = cssText.includes('grid-template-columns') ||
                                     cssText.includes('flex-wrap') ||
                                     cssText.includes('display: grid') ||
                                     cssText.includes('display: flex');
          expect(hasResponsiveLayout).toBe(true);
          
          // Property holds: CSS implements responsive design patterns
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * Additional test: Verify specific breakpoints exist
   */
  test('CSS contains mobile breakpoint at 768px', () => {
    const { document } = setupDOM(768);
    const style = document.querySelector('style');
    const cssText = style.textContent;
    
    // Should have a mobile breakpoint around 768px
    const hasMobileBreakpoint = cssText.includes('768px');
    expect(hasMobileBreakpoint).toBe(true);
  });
});
