# Assets Directory

This directory contains all static assets for your retro portfolio.

## Structure

- **fonts/**: Place retro-style web fonts here (optional)
- **images/**: Place project screenshots and profile photos here
- **resume.pdf**: Your resume PDF file

## Resume

A placeholder `resume.pdf` file is included in this directory. **Replace it with your actual resume:**

1. Save your resume as `resume.pdf`
2. Replace the placeholder file in this directory
3. The portfolio will automatically link to your resume

The resume link in `index.html` points to `assets/resume.pdf`.

## Images

### Profile Photo
- Place your profile photo in the `images/` directory
- Update the image path in `index.html`:
  ```html
  <img src="assets/images/your-photo.jpg" alt="Your name" class="profile-photo">
  ```
- Recommended size: 400x400px or larger (square format works best)

### Project Screenshots
- Add project images to the `images/` directory
- Reference them in your project sections in `index.html`
- Optimize images for web (compress to reduce file size)

## Fonts (Optional)

If you want to use custom retro fonts:
1. Download web font files (.woff, .woff2, .ttf)
2. Place them in the `fonts/` directory
3. Add @font-face rules in `styles.css`:
   ```css
   @font-face {
     font-family: 'YourRetroFont';
     src: url('assets/fonts/your-font.woff2') format('woff2');
   }
   ```
4. Update the font variable in `styles.css`:
   ```css
   --font-primary: 'YourRetroFont', 'Courier New', monospace;
   ```
