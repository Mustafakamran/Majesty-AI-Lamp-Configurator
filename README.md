# Majesty - Luxury AI Lamp Configurator

A premium, interactive product configurator website for the Majesty luxury AI lamp. Features a stunning dark theme with glassmorphism effects, smooth animations, and an intuitive customization interface.

## Features

- **Interactive Product Configurator**: Real-time preview of different color and pattern combinations
- **Premium Design**: Dark theme with gradients, glassmorphism, and smooth animations
- **Responsive Layout**: Fully responsive design that works on all devices
- **Smooth Transitions**: Elegant fade and scale animations when switching configurations
- **Keyboard Navigation**: Arrow keys support for quick navigation through options

## Customization Options

### Base Colors (4 options)
- Rose Red
- Midnight Blue
- Emerald Green
- Royal Purple

### Rim Colors (3 options)
- Golden
- Silver
- Bronze

### Patterns (3 options)
- Triangle
- Hexagon
- Wave

## File Structure

```
majesty-lamp/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with design tokens
├── script.js           # Interactive functionality
├── README.md           # This file
└── renders/            # Product render images
    ├── default.png     # Placeholder/default image
    └── [base]_[rim]_[pattern].png  # Variant images
```

## Setting Up Product Renders

### Image Naming Convention

All product render images should be placed in the `renders/` folder and follow this naming pattern:

```
[base-color]_[rim-color]_[pattern].png
```

### Examples:
- `rose-red_golden_triangle.png`
- `midnight-blue_silver_hexagon.png`
- `emerald-green_bronze_wave.png`
- `royal-purple_golden_triangle.png`

### Complete List of Required Images

You'll need to create **36 total images** (4 base colors × 3 rim colors × 3 patterns):

#### Rose Red Base:
1. `rose-red_golden_triangle.png`
2. `rose-red_golden_hexagon.png`
3. `rose-red_golden_wave.png`
4. `rose-red_silver_triangle.png`
5. `rose-red_silver_hexagon.png`
6. `rose-red_silver_wave.png`
7. `rose-red_bronze_triangle.png`
8. `rose-red_bronze_hexagon.png`
9. `rose-red_bronze_wave.png`

#### Midnight Blue Base:
10. `midnight-blue_golden_triangle.png`
11. `midnight-blue_golden_hexagon.png`
12. `midnight-blue_golden_wave.png`
13. `midnight-blue_silver_triangle.png`
14. `midnight-blue_silver_hexagon.png`
15. `midnight-blue_silver_wave.png`
16. `midnight-blue_bronze_triangle.png`
17. `midnight-blue_bronze_hexagon.png`
18. `midnight-blue_bronze_wave.png`

#### Emerald Green Base:
19. `emerald-green_golden_triangle.png`
20. `emerald-green_golden_hexagon.png`
21. `emerald-green_golden_wave.png`
22. `emerald-green_silver_triangle.png`
23. `emerald-green_silver_hexagon.png`
24. `emerald-green_silver_wave.png`
25. `emerald-green_bronze_triangle.png`
26. `emerald-green_bronze_hexagon.png`
27. `emerald-green_bronze_wave.png`

#### Royal Purple Base:
28. `royal-purple_golden_triangle.png`
29. `royal-purple_golden_hexagon.png`
30. `royal-purple_golden_wave.png`
31. `royal-purple_silver_triangle.png`
32. `royal-purple_silver_hexagon.png`
33. `royal-purple_silver_wave.png`
34. `royal-purple_bronze_triangle.png`
35. `royal-purple_bronze_hexagon.png`
36. `royal-purple_bronze_wave.png`

### Image Specifications

- **Format**: PNG (recommended for transparency)
- **Dimensions**: 1000x1000px or higher (square aspect ratio)
- **Background**: Transparent or matching the website's dark theme
- **Quality**: High resolution for crisp display
- **Lighting**: Consistent lighting across all variants for professional look

### Default/Placeholder Image

Create a `default.png` file that will be shown:
- When a specific variant image is not found
- During initial page load
- As a fallback for any missing images

## Running the Website

### Option 1: Local Development Server (Recommended)

Using Python:
```bash
cd majesty-lamp
python -m http.server 8000
```

Using Node.js:
```bash
npx http-server majesty-lamp -p 8000
```

Then open `http://localhost:8000` in your browser.

### Option 2: Direct File Opening

Simply open `index.html` in your web browser. Note: Some features may not work properly due to CORS restrictions.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --color-primary: #c41e3a;
    --color-accent: #fbbf24;
    /* ... more variables */
}
```

### Adding More Options

1. **Add HTML button** in `index.html` within the appropriate section
2. **Update JavaScript** in `script.js`:
   - Add to `configNames` object
   - Add to `configTitles` object (for base-rim combinations)
3. **Create corresponding render images** following the naming convention

### Modifying Animations

Adjust animation timings in `styles.css`:

```css
:root {
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

## Tips for Best Results

1. **Consistent Renders**: Ensure all product renders have the same camera angle, lighting, and scale
2. **High Quality**: Use high-resolution images for crisp display on retina screens
3. **Optimization**: Compress images to reduce load times while maintaining quality
4. **Testing**: Test all 36 combinations to ensure smooth transitions
5. **Fallback**: Always include the `default.png` as a fallback

## Future Enhancements

Potential features to add:
- Save/share configuration functionality
- 360° product viewer
- AR preview capability
- Shopping cart integration
- Price display based on configuration
- Email configuration to customer

## License

© 2026 Majesty. All rights reserved.
