# RyleJS Documentation

This directory contains the static HTML documentation for RyleJS, designed for GitHub Pages deployment.

## Files Structure

-   **index.html** - Main homepage with overview, features, and quick start guide
-   **api.html** - Complete API reference documentation
-   **examples.html** - Practical examples and use cases
-   **styles.css** - Styling for all documentation pages
-   **script.js** - Interactive features and functionality

## Features

-   📱 **Responsive Design** - Works on all devices and screen sizes
-   🎨 **Modern UI** - Clean, professional design with smooth animations
-   🔍 **Easy Navigation** - Sticky navigation with smooth scrolling
-   📋 **Copy Code Blocks** - One-click copying for all code examples
-   🚀 **Fast Loading** - Optimized for performance with lazy loading
-   ♿ **Accessible** - Follows web accessibility best practices

## GitHub Pages Setup

To deploy this documentation to GitHub Pages:

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "Deploy from a branch"
4. Choose "master" branch and "/docs" folder
5. Click "Save"

Your documentation will be available at: `https://nekoniyah.github.io/RyleJS/`

## Local Development

To test the documentation locally:

1. Navigate to the docs folder
2. Start a local server:

    ```bash
    # Using Python
    python -m http.server 8000

    # Using Node.js
    npx serve .

    # Using PHP
    php -S localhost:8000
    ```

3. Open `http://localhost:8000` in your browser

## Content Sections

### Homepage (index.html)

-   Hero section with project overview
-   Features showcase
-   Installation instructions
-   Quick start guide
-   Examples preview

### API Reference (api.html)

-   Detailed API documentation
-   Method signatures and parameters
-   TypeScript type definitions
-   Usage examples for each method

### Examples (examples.html)

-   Game development examples
-   Business logic use cases
-   Form validation patterns
-   Workflow engine implementation
-   Advanced patterns and techniques

## Customization

### Colors and Branding

Primary colors can be updated in `styles.css`:

-   Primary blue: `#2563eb`
-   Background gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### Adding New Pages

1. Create new HTML file following the existing structure
2. Add navigation links in all pages
3. Update the sidebar navigation if needed
4. Include the same CSS and JS files

### Code Highlighting

Basic syntax highlighting is implemented in `script.js`. For more advanced highlighting, consider integrating Prism.js or highlight.js.

## Performance Optimizations

-   CSS is minified and optimized
-   Images use lazy loading
-   Intersection Observer API for animations
-   Throttled scroll events
-   Efficient DOM queries

## Browser Support

-   Chrome 60+
-   Firefox 55+
-   Safari 12+
-   Edge 79+

## Contributing

When contributing to the documentation:

1. Maintain consistent styling and structure
2. Test on multiple screen sizes
3. Ensure all code examples are working
4. Update navigation when adding new sections
5. Follow accessibility guidelines

## License

This documentation is part of the RyleJS project and follows the same license.
