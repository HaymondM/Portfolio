# Design Document: Retro-Themed Portfolio

## Overview

The retro-themed portfolio will be a single-page web application built with HTML, CSS, and vanilla JavaScript. The design embraces a nostalgic aesthetic inspired by 1980s-90s computing interfaces, featuring elements like CRT screen effects, pixel fonts, terminal-style layouts, and a color palette reminiscent of vintage monitors (amber, green phosphor, or classic DOS colors).

The portfolio will be structured as a static website that can be easily deployed to any web hosting service. Content will be embedded directly in the HTML with styling handled through CSS, making it lightweight and fast-loading.

## Architecture

### Technology Stack
- **HTML5**: Semantic markup for content structure
- **CSS3**: Styling with custom properties for theming, flexbox/grid for layout, and animations for retro effects
- **Vanilla JavaScript**: Minimal scripting for interactive elements (smooth scrolling, optional CRT flicker effects)
- **No build tools required**: Direct browser-compatible code for simplicity

### File Structure
```
/
├── index.html          # Main portfolio page
├── styles.css          # Retro theme styling
├── script.js           # Interactive behaviors
├── assets/
│   ├── fonts/          # Retro-style web fonts
│   ├── images/         # Project screenshots, profile photo
│   └── resume.pdf      # Resume document
└── README.md           # Project documentation
```

## Components and Interfaces

### 1. Header Component
- **Purpose**: Display site title/name with retro branding
- **Elements**: 
  - Site title with pixel/monospace font
  - Optional tagline or subtitle
  - Retro decorative elements (ASCII art borders, scan lines)

### 2. About Me Section
- **Purpose**: Present biographical information
- **Elements**:
  - Section heading
  - Profile photo (optional, with retro filter/border)
  - Biographical text in terminal-style container
  - Retro-styled text box with border effects

### 3. Resume Link Component
- **Purpose**: Provide access to resume document
- **Elements**:
  - Prominent button or link styled as retro UI element
  - Hover effects (glow, color shift)
  - Opens PDF in new tab or triggers download
- **Behavior**: `<a href="assets/resume.pdf" target="_blank">` with retro button styling

### 4. Projects Section
- **Purpose**: Showcase portfolio projects
- **Elements**:
  - Section heading
  - Project cards/containers in grid or list layout
  - Each project includes:
    - Project title
    - Description text
    - Technologies used (optional tags)
    - Links to live demo/repository (optional)
    - Screenshot or thumbnail (optional)
- **Layout**: CSS Grid for responsive project card arrangement

### 5. Certifications Section
- **Purpose**: Display professional certifications with verification links
- **Elements**:
  - Section heading
  - Certification boxes in grid or list layout
  - Each certification includes:
    - Certification name
    - Issuing organization
    - Clickable box that opens verification URL
  - Retro-styled boxes with hover effects
- **Behavior**: `<a href="[verification-url]" target="_blank" rel="noopener noreferrer">` wrapped around certification box content
- **Layout**: CSS Grid for responsive certification card arrangement

### 6. Footer Component (Optional)
- **Purpose**: Display contact links or copyright
- **Elements**:
  - Social media links with retro icons
  - Copyright notice
  - "Made with ❤️ in [year]" style message

## Data Models

### Project Data Structure
Projects will be hardcoded in HTML but follow a consistent structure:

```javascript
// Conceptual structure (embedded in HTML)
{
  title: string,           // Project name
  description: string,     // Brief description
  technologies: string[],  // Tech stack used
  liveUrl: string,        // Optional demo link
  repoUrl: string,        // Optional repository link
  imageUrl: string        // Optional screenshot
}
```

### Certification Data Structure
Certifications will be hardcoded in HTML but follow a consistent structure:

```javascript
// Conceptual structure (embedded in HTML)
{
  name: string,            // Certification name
  issuer: string,          // Issuing organization
  verificationUrl: string  // URL to verification page
}
```

### Content Configuration
All content will be directly editable in HTML:
- About Me text: `<section id="about">` content
- Projects: Repeated `<article class="project">` elements
- Certifications: Repeated `<a class="certification">` elements with verification URLs
- Resume path: `href` attribute in resume link


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property 1: Project sections contain required information**
*For any* project section element in the DOM, the rendered HTML should contain both a title element and a description element with non-empty content.
**Validates: Requirements 3.2**

**Property 2: Layout responsiveness across viewport sizes**
*For any* viewport width, the layout should adapt appropriately such that content remains accessible and no horizontal scrolling is required (elements should reflow, stack, or resize as needed).
**Validates: Requirements 5.1**

**Property 3: Touch target minimum size on mobile**
*For any* interactive element (button, link) when rendered at mobile viewport widths (≤768px), the element should have minimum dimensions of 44x44 pixels to ensure usability.
**Validates: Requirements 5.3**

**Property 4: Color contrast accessibility**
*For any* text element and its background color combination, the contrast ratio should meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text ≥18pt).
**Validates: Requirements 5.4**

**Property 5: Certification boxes contain required information**
*For any* certification box element in the DOM, the rendered HTML should contain both a certification name element and an issuer element with non-empty content.
**Validates: Requirements 6.2**

**Property 6: Certification links open in new tab**
*For any* certification box link element, the anchor tag should have both target="_blank" and rel="noopener noreferrer" attributes to ensure secure external navigation.
**Validates: Requirements 6.3**

## Error Handling

### Missing Content
- If resume file is not found, the link should still render but may show a 404 when clicked
- Missing project images should gracefully degrade (show placeholder or no image)
- Empty project descriptions should still render the project card structure

### Browser Compatibility
- Fallback fonts if custom retro fonts fail to load
- CSS Grid fallback to Flexbox for older browsers
- Graceful degradation of CSS effects (animations, filters) in unsupported browsers

### Responsive Breakpoints
- Handle edge cases at exact breakpoint widths
- Ensure no layout breaks between defined breakpoints
- Test at common device widths (320px, 375px, 768px, 1024px, 1440px)

## Testing Strategy

### Unit Testing
We will use a minimal unit testing approach focused on critical functionality:

1. **DOM Structure Tests**: Verify that required sections exist (About Me, Projects, Resume link)
2. **Content Validation Tests**: Check that project cards contain required elements
3. **Link Functionality Tests**: Verify resume link has correct href and target attributes

### Property-Based Testing
We will use a property-based testing library to validate universal properties across many inputs:

**Testing Framework**: We'll use **fast-check** (for JavaScript/TypeScript) to implement property-based tests.

**Configuration**: Each property-based test will run a minimum of 100 iterations to ensure thorough coverage.

**Property Test Implementations**:

1. **Property 1 Test**: Generate random project data structures and verify that when rendered, the resulting HTML contains title and description elements
   - **Feature: retro-portfolio, Property 1: Project sections contain required information**

2. **Property 2 Test**: Generate random viewport widths and verify that at each width, no horizontal overflow occurs and content remains accessible
   - **Feature: retro-portfolio, Property 2: Layout responsiveness across viewport sizes**

3. **Property 3 Test**: Generate random interactive elements and verify that at mobile viewport widths, all have minimum 44x44px dimensions
   - **Feature: retro-portfolio, Property 3: Touch target minimum size on mobile**

4. **Property 4 Test**: Generate random color combinations used in the design and verify that all text/background pairs meet WCAG AA contrast ratios
   - **Feature: retro-portfolio, Property 4: Color contrast accessibility**

### Manual Testing
- Visual inspection of retro theme consistency
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Device testing on actual mobile devices
- Accessibility testing with screen readers

### Testing Approach
- Write implementation code first
- Follow with unit tests for specific examples
- Implement property-based tests for universal properties
- Both test types complement each other: unit tests catch concrete bugs, property tests verify general correctness

## Retro Theme Design Specifications

### Color Palette Options
1. **Classic Terminal**: 
   - Background: `#0a0a0a` (near black)
   - Primary text: `#33ff33` (phosphor green)
   - Accent: `#00ff00` (bright green)

2. **Amber Monitor**:
   - Background: `#1a1a1a`
   - Primary text: `#ffb000` (amber)
   - Accent: `#ffd700` (gold)

3. **DOS Nostalgia**:
   - Background: `#0000aa` (DOS blue)
   - Primary text: `#aaaaaa` (light gray)
   - Accent: `#ffffff` (white)

### Typography
- **Primary Font**: Monospace fonts like "VT323", "Press Start 2P", "Courier New", or "Consolas"
- **Font Size**: Base 16px with appropriate scaling for headings
- **Line Height**: 1.5 for readability

### Visual Effects
- **CRT Scan Lines**: Subtle repeating horizontal lines overlay
- **Screen Glow**: Box-shadow with theme color for glowing effect
- **Pixel Borders**: Chunky borders on containers (3-5px solid)
- **Text Shadow**: Subtle glow effect on text
- **Animations**: Blinking cursor, subtle flicker effects (optional, performance-conscious)

### Layout Principles
- **Centered Content**: Max-width container (800-1000px) centered on page
- **Generous Spacing**: Padding and margins for breathing room
- **Clear Hierarchy**: Distinct visual separation between sections
- **Terminal-Style Boxes**: Content wrapped in bordered containers resembling terminal windows

## Implementation Notes

### Performance Considerations
- Optimize images (compress, use appropriate formats)
- Minimize JavaScript for fast load times
- Use CSS transforms for animations (GPU-accelerated)
- Lazy load project images if many projects

### Accessibility
- Semantic HTML5 elements (`<header>`, `<section>`, `<article>`, `<nav>`)
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators on interactive elements
- Alt text for all images

### Deployment
- Static site, can be hosted on:
  - GitHub Pages
  - Netlify
  - Vercel
  - Any static hosting service
- No server-side processing required
- No build step necessary (optional: can add minification)

## Future Enhancements (Out of Scope)
- Dark/light mode toggle
- Multiple retro theme options (terminal, DOS, Windows 95, etc.)
- Animated background effects (matrix rain, starfield)
- Contact form with retro styling
- Blog section
- Project filtering/search functionality
