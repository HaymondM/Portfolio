# Retro Portfolio

https://haymondm.github.io/Portfolio/

A nostalgic, retro-themed personal portfolio website inspired by vintage computing aesthetics. Features CRT screen effects, terminal-style layouts, and a phosphor green color scheme reminiscent of classic monitors.

## Features

- 🖥️ **Retro Aesthetic**: CRT scan lines, screen glow, and text effects
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- ♿ **Accessible**: WCAG AA compliant with keyboard navigation support
- 🎨 **Customizable**: Easy to modify content and switch color themes
- ⚡ **Lightweight**: Pure HTML, CSS, and vanilla JavaScript - no frameworks required

## Quick Start

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Customize the content (see below)
4. Deploy to your favorite hosting service

No build process or dependencies required!

## Customizing Content

### About Me Section

Edit the biographical content in `index.html`:

```html
<section id="about">
  <div class="bio-text">
    <p>Your introduction here...</p>
    <p>More about you...</p>
  </div>
</section>
```

**To add a profile photo:**
1. Place your image in `assets/images/`
2. Update the image source in the HTML:
```html
<img src="assets/images/your-photo.jpg" alt="Your name" class="profile-photo">
```

### Projects Section

Add or modify projects in `index.html`:

```html
<article class="project">
  <h3 class="project-title">> YOUR_PROJECT_NAME.EXE</h3>
  <p class="project-description">Your project description here...</p>
  <div class="project-tech">
    <span class="tech-tag">Technology 1</span>
    <span class="tech-tag">Technology 2</span>
  </div>
  <div class="project-links">
    <a href="https://your-demo-url.com" class="project-link">[ LIVE DEMO ]</a>
    <a href="https://github.com/your-repo" class="project-link">[ SOURCE CODE ]</a>
  </div>
</article>
```

### Resume

1. Place your resume PDF in the `assets/` directory
2. Name it `resume.pdf` or update the link in `index.html`:
```html
<a href="assets/resume.pdf" target="_blank" class="resume-link">
  <span class="button-text">[ DOWNLOAD RESUME ]</span>
</a>
```

### Footer / Contact Links

Update contact information in `index.html`:

```html
<nav class="contact-links">
  <a href="mailto:your-email@example.com" class="footer-link">[ EMAIL ]</a>
  <a href="https://github.com/yourusername" class="footer-link">[ GITHUB ]</a>
  <a href="https://linkedin.com/in/yourprofile" class="footer-link">[ LINKEDIN ]</a>
</nav>
```

## Changing Color Themes

The portfolio includes three pre-configured retro color themes. To switch themes, update the CSS custom properties in `styles.css`:

### Classic Terminal (Default - Phosphor Green)
```css
:root {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #1a1a1a;
  --color-text-primary: #33ff33;
  --color-text-secondary: #00ff00;
  --color-accent: #00ff00;
  --color-glow: rgba(51, 255, 51, 0.5);
  --color-border: #33ff33;
}
```

### Amber Monitor Theme
```css
:root {
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2a2a2a;
  --color-text-primary: #ffb000;
  --color-text-secondary: #ffd700;
  --color-accent: #ffd700;
  --color-glow: rgba(255, 176, 0, 0.5);
  --color-border: #ffb000;
}
```

### DOS Nostalgia Theme
```css
:root {
  --color-bg-primary: #0000aa;
  --color-bg-secondary: #0000cc;
  --color-text-primary: #aaaaaa;
  --color-text-secondary: #ffffff;
  --color-accent: #ffffff;
  --color-glow: rgba(255, 255, 255, 0.5);
  --color-border: #aaaaaa;
}
```

**Note:** All color themes are designed to meet WCAG AA accessibility standards for contrast ratios.

## Project Structure

```
retro-portfolio/
├── index.html              # Main HTML file
├── styles.css              # All styling and themes
├── script.js               # Interactive features
├── assets/
│   ├── fonts/             # Custom retro fonts (optional)
│   ├── images/            # Profile photo and project images
│   │   └── profile.jpg
│   └── resume.pdf         # Your resume document
├── package.json           # Testing dependencies (optional)
├── jest.config.js         # Test configuration (optional)
└── README.md              # This file
```

## Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select your branch (usually `main`) and root folder
4. Click Save
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Netlify

1. Create a free account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder into Netlify
3. Your site is live! Netlify provides a custom URL

**Or use Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy
```

### Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Your site is deployed!

### Traditional Web Hosting

Upload all files via FTP to your web host:
- Upload `index.html`, `styles.css`, `script.js`
- Upload the entire `assets/` folder
- Ensure file permissions are set correctly
- Access via your domain

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features

- Semantic HTML5 structure
- ARIA labels for screen readers
- Keyboard navigation support
- Skip to main content link
- Sufficient color contrast (WCAG AA compliant)
- Touch targets sized appropriately for mobile (44x44px minimum)
- Respects `prefers-reduced-motion` for animations

## Performance

- No external dependencies or frameworks
- Minimal JavaScript (~50 lines)
- Fast load times
- Optimized for mobile devices

## Customization Tips

### Adjusting Spacing
Modify spacing variables in `styles.css`:
```css
:root {
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
}
```

### Changing Fonts
Update the font family in `styles.css`:
```css
:root {
  --font-primary: 'Your Font', 'Courier New', monospace;
}
```

### Disabling CRT Effects
To disable scan lines or flicker effects, comment out or remove:
- Scan lines: `body::before` in `styles.css`
- Screen glow: `body::after` in `styles.css`
- Flicker: `initCRTFlicker()` call in `script.js`

### Adding More Sections
Follow the existing section pattern:
```html
<section id="your-section" aria-labelledby="your-heading">
  <h2 id="your-heading">[ YOUR_SECTION.TXT ]</h2>
  <!-- Your content here -->
</section>
```

## Testing (Optional)

The project includes property-based tests using Jest and fast-check:

```bash
# Install dependencies
npm install

# Run tests
npm test
```

Tests verify:
- DOM structure and required elements
- Responsive layout behavior
- Touch target sizes on mobile
- Color contrast accessibility

## License

This project is open source and available for personal and commercial use.

## Credits

Created with ❤️ and nostalgia for the golden age of computing.

---

**Need help?** Open an issue or submit a pull request!
