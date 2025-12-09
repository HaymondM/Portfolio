/**
 * Unit Tests for DOM Structure
 * Feature: retro-portfolio
 * Requirements: 1.1, 2.1, 3.1
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

// Load HTML
const html = readFileSync('./index.html', 'utf-8');

describe('DOM Structure Unit Tests', () => {
  let document;

  beforeEach(() => {
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  /**
   * Test that About Me section exists
   * Validates: Requirements 1.1
   */
  test('About Me section exists with correct id', () => {
    const aboutSection = document.querySelector('#about');
    expect(aboutSection).not.toBeNull();
    expect(aboutSection.tagName.toLowerCase()).toBe('section');
  });

  test('About Me section contains heading', () => {
    const aboutSection = document.querySelector('#about');
    const heading = aboutSection.querySelector('h2');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toContain('ABOUT_ME');
  });

  test('About Me section contains biographical content', () => {
    const aboutSection = document.querySelector('#about');
    const bioText = aboutSection.querySelector('.bio-text');
    expect(bioText).not.toBeNull();
    expect(bioText.textContent.length).toBeGreaterThan(0);
  });

  /**
   * Test that resume link exists with correct attributes
   * Validates: Requirements 2.1
   */
  test('Resume link exists with correct href', () => {
    const resumeLink = document.querySelector('.resume-link');
    expect(resumeLink).not.toBeNull();
    expect(resumeLink.tagName.toLowerCase()).toBe('a');
    expect(resumeLink.getAttribute('href')).toBe('assets/resume.pdf');
  });

  test('Resume link opens in new tab', () => {
    const resumeLink = document.querySelector('.resume-link');
    expect(resumeLink.getAttribute('target')).toBe('_blank');
    expect(resumeLink.getAttribute('rel')).toContain('noopener');
  });

  test('Resume link has accessible label', () => {
    const resumeLink = document.querySelector('.resume-link');
    const ariaLabel = resumeLink.getAttribute('aria-label');
    expect(ariaLabel).not.toBeNull();
    expect(ariaLabel.length).toBeGreaterThan(0);
  });

  /**
   * Test that at least one project section exists
   * Validates: Requirements 3.1
   */
  test('Projects section exists', () => {
    const projectsSection = document.querySelector('#projects');
    expect(projectsSection).not.toBeNull();
    expect(projectsSection.tagName.toLowerCase()).toBe('section');
  });

  test('At least one project exists', () => {
    const projects = document.querySelectorAll('.project');
    expect(projects.length).toBeGreaterThanOrEqual(1);
  });

  test('Each project is an article element', () => {
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
      expect(project.tagName.toLowerCase()).toBe('article');
    });
  });
});
