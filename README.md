# Majesty - Luxury AI Lamp Configurator

A premium, interactive product configurator website for the Majesty luxury AI lamp. Features a stunning dark theme with glassmorphism effects, smooth animations, and an intuitive customization interface.

## Features

- **Interactive Product Configurator**: Real-time preview of different color and pattern combinations.
- **Premium Dark Design**: Sophisticated dark theme (`#010101`) with glassmorphism overlays and gold accents.
- **Smart Preloading**: Instant configuration switching with background image preloading.
- **Optimized Assets**: High-quality WebP images for fast loading without quality loss.
- **Responsive Layout**: Seamless mobile adaptation with bottom-sheet controls and optimized image placement.
- **Smooth Transitions**: Elegant fade and scale animations.

## Customization Options

### Base Colors (6 options)
- Red
- Red Metallic
- Black
- White
- Gold
- Silver

### Rim Colors (2 options)
- Golden Ring
- Silver Ring

### Patterns (3 options)
- Triangle
- Star
- Arabic

## File Structure

```
majesty-lamp/
├── index.html          # Main HTML structure
├── styles.css          # Styling, dark theme, and responsiveness
├── script.js           # Logic, state management, and preloading
├── README.md           # Documentation
└── renders/            # Product render images (WebP format)
    ├── Golden Ring/    # Render subdirectories
    └── Silver Ring/
```

## Setup & Running

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/majesty-lamp.git
    cd majesty-lamp
    ```

2.  **Run a local server**:
    Because the site uses dynamic imports and image loading, it requires a local server.

    **Using Python**:
    ```bash
    python -m http.server 3000
    ```

    **Using Node.js**:
    ```bash
    npx http-server . -p 3000
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:3000`.

## Asset Management

All product images are in **WebP** format for performance.
Naming convention matches the code logic:
`[Base] - [Rim]/[Pattern] - [Base].webp`

## License

© 2026 Majesty. All rights reserved.
