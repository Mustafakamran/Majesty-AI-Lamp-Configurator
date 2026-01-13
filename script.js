// Configuration state
const config = {
    base: 'Red',
    rim: 'Golden Ring',
    pattern: 'Triangle'
};

// Configuration names mapping
const configNames = {
    'Red': 'Red',
    'Red Matellic': 'Red Metallic',
    'Black': 'Black',
    'White': 'White',
    'Gold': 'Gold',
    'Silver': 'Silver',
    'Golden Ring': 'Golden Ring',
    'Silver Ring': 'Silver Ring',
    'Triangle': 'Triangle',
    'Star': 'Star',
    'Arabic': 'Arabic'
};

// Initialize the application
function init() {
    setupEventListeners();
    updateProduct();
}

// Setup event listeners for all control buttons
function setupEventListeners() {
    const controlButtons = document.querySelectorAll('.control-btn');

    controlButtons.forEach(button => {
        button.addEventListener('click', function () {
            const type = this.dataset.type;
            const value = this.dataset.value;

            // Update active state
            const siblings = this.parentElement.querySelectorAll('.control-btn');
            siblings.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Update configuration
            config[type] = value;
            updateProduct();
        });
    });
}

// Update product display based on current configuration
function updateProduct() {
    updateProductImage();
    updateConfigurationName();
}

// Update the product image based on current configuration
function updateProductImage() {
    const productImage = document.getElementById('productImage');

    // Build the path based on your folder structure:
    // renders/[Rim Finish]/[Base Color] - [Rim Finish]/[Pattern] - [Base Color].png
    // OR for Silver Ring: renders/Silver Ring/[Base Color] - Silver Ring/Silver Ring - [Pattern] - [Base Color].png

    let imagePath;

    if (config.rim === 'Golden Ring') {
        // Golden Ring path: renders/Golden Ring/[Base] - Golden Ring/[Pattern] - [Base].webp
        imagePath = `renders/Golden Ring/${config.base} - Golden Ring/${config.pattern} - ${config.base}.webp`;
    } else {
        // Silver Ring path: renders/Silver Ring/[Base] - Silver Ring/Silver Ring - [Pattern] - [Base].webp
        imagePath = `renders/Silver Ring/${config.base} - Silver Ring/Silver Ring - ${config.pattern} - ${config.base}.webp`;
    }

    console.log('Loading image:', imagePath);

    // Instant change - no transitions
    productImage.src = imagePath;

    // Handle image load error - fallback to placeholder
    productImage.onerror = function () {
        console.error(`Image not found: ${imagePath}`);
        // Try to show a helpful error message
        this.alt = `Image not found: ${config.pattern} - ${config.base} with ${config.rim}`;
    };
}

// Update the configuration name/title
function updateConfigurationName() {
    const engineSpec = document.getElementById('engineSpec');
    const baseColorName = configNames[config.base].toUpperCase();

    // Instant update
    if (engineSpec) {
        engineSpec.textContent = baseColorName;
    }
}

// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', function () {
    // Add smooth transitions to all elements
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Initialize the app
    init();
});

// Export configuration for potential future use (e.g., saving, sharing)
function getCurrentConfiguration() {
    return {
        base: config.base,
        rim: config.rim,
        pattern: config.pattern,
        baseColorName: configNames[config.base],
        rimFinishName: configNames[config.rim],
        patternName: configNames[config.pattern]
    };
}

// Optional: Add keyboard navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeSection = document.querySelector('.control-section:hover');
        if (activeSection) {
            const buttons = activeSection.querySelectorAll('.control-btn');
            const activeButton = activeSection.querySelector('.control-btn.active');
            const currentIndex = Array.from(buttons).indexOf(activeButton);

            let newIndex;
            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % buttons.length;
            } else {
                newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            }

            buttons[newIndex].click();
        }
    }
});
