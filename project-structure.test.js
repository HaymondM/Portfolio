/**
 * Property-Based Test for Project Content Structure
 * Feature: retro-portfolio, Property 1: Project sections contain required information
 * Validates: Requirements 3.2
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

// Load HTML
const html = readFileSync('./index.html', 'utf-8');

describe('Project Content Structure Property Tests', () => {
  /**
   * Property 1: Project sections contain required information
   * 
   * For any project section element in the DOM, the rendered HTML should contain 
   * both a title element and a description element with non-empty content.
   * 
   * Validates: Requirements 3.2
   */
  test('Property 1: All project sections contain title and description with non-empty content', () => {
    fc.assert(
      fc.property(
        // We'll test against the actual DOM, so we use a constant arbitrary
        // The property should hold for all projects in the DOM
        fc.constant(null),
        () => {
          const dom = new JSDOM(html);
          const { document } = dom.window;
          
          // Get all project elements
          const projects = document.querySelectorAll('.project');
          
          // There should be at least one project
          expect(projects.length).toBeGreaterThanOrEqual(1);
          
          // For each project, verify it contains required information
          projects.forEach((project, index) => {
            // Check for title element
            const titleElement = project.querySelector('.project-title') || 
                                project.querySelector('h3');
            expect(titleElement).not.toBeNull();
            
            // Check title has non-empty content
            const titleText = titleElement.textContent.trim();
            expect(titleText.length).toBeGreaterThan(0);
            
            // Check for description element
            const descriptionElement = project.querySelector('.project-description') ||
                                      project.querySelector('p');
            expect(descriptionElement).not.toBeNull();
            
            // Check description has non-empty content
            const descriptionText = descriptionElement.textContent.trim();
            expect(descriptionText.length).toBeGreaterThan(0);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
