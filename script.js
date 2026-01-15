// Configuration state
const config = {
    base: 'Red',
    rim: 'Golden Ring',
    pattern: 'Triangle'
};

// Configuration names mapping
const configNames = {
    'Red': 'Red',
    'Red Metallic': 'Red Metallic',
    'Black': 'Black',
    'White': 'White',
    'Gold': 'Gold',
    'Silver': 'Silver',
    'Copper': 'Copper',
    'Golden Ring': 'Golden Ring',
    'Silver Ring': 'Silver Ring',
    'Copper Ring': 'Copper Ring',
    'Triangle': 'Triangle',
    'Star': 'Star',
    'Arabic': 'Arabic'
};

// Configuration options for preloading
const bases = ['Red', 'Red Metallic', 'Black', 'White', 'Gold', 'Silver', 'Copper'];
const rims = ['Golden Ring', 'Silver Ring', 'Copper Ring'];
const patterns = ['Triangle', 'Star', 'Arabic'];

// Cart state
let cart = [];

// Initialize the application
function init() {
    setupEventListeners();
    updateProduct();
    setupCartListeners();
    setupThemeListener();
    // Start preloading after initial render to prioritize first paint
    setTimeout(preloadImages, 1000);
}

// Preload all possible image combinations
function preloadImages() {
    console.log('Starting image preload...');
    let loadedCount = 0;
    const totalImages = bases.length * rims.length * patterns.length;

    rims.forEach(rim => {
        bases.forEach(base => {
            patterns.forEach(pattern => {
                let imagePath;
                if (rim === 'Golden Ring') {
                    if (base === 'Copper') return; // Copper only for Copper Ring
                    imagePath = `renders/Golden Ring/${base} - Golden Ring/${pattern} - ${base}.webp`;
                } else if (rim === 'Silver Ring') {
                    if (base === 'Copper') return; // Copper only for Copper Ring
                    imagePath = `renders/Silver Ring/${base} - Silver Ring/Silver Ring - ${pattern} - ${base}.webp`;
                } else if (rim === 'Copper Ring') {
                    imagePath = `renders/Copper Ring/${base} - Copper Ring/Copper Ring - ${pattern} - ${base}.webp`;
                }

                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        console.log('All images preloaded successfully');
                    }
                };
                img.src = imagePath;
            });
        });
    });
}

// Setup event listeners for all control buttons
function setupEventListeners() {
    // ... (existing code for control buttons) ...
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

            // Handle Copper Base Conditional Visibility
            if (type === 'rim') {
                const copperBaseBtn = document.getElementById('copper-base-btn');
                if (value === 'Copper Ring') {
                    copperBaseBtn.style.display = 'flex';
                } else {
                    copperBaseBtn.style.display = 'none';
                    if (config.base === 'Copper') {
                        config.base = 'Red';
                        // Update UI Active State for Base
                        const baseButtons = document.querySelectorAll('[data-type="base"]');
                        baseButtons.forEach(btn => btn.classList.remove('active'));
                        document.querySelector('[data-type="base"][data-value="Red"]').classList.add('active');
                    }
                }
            }

            updateProduct();
        });
    });
}

// Cart & Theme Logic

function setupCartListeners() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const summaryBtn = document.getElementById('summaryBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartModal = document.getElementById('cartModal');
    const checkoutBtn = document.getElementById('checkoutBtn');



    // New Summary Elements
    const summaryModal = document.getElementById('summaryModal');
    const closeSummaryBtn = document.getElementById('closeSummaryBtn');

    addToCartBtn.addEventListener('click', () => {
        addToCart();
        openCart();
    });

    summaryBtn.addEventListener('click', () => {
        // Changed: Opens Summary Modal instead of Cart
        openSummary();
    });

    closeCartBtn.addEventListener('click', () => {
        closeCart();
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCart();
        }
    });

    // Summary Modal Event Listeners
    closeSummaryBtn.addEventListener('click', () => {
        closeSummary();
    });

    summaryModal.addEventListener('click', (e) => {
        if (e.target === summaryModal) {
            closeSummary();
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        // Trigger Confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#d4a574', '#ffffff'] // Gold theme colors
        });

        // Show Success Modal
        openSuccess();

        // Clear Cart
        cart = [];
        renderCart();
    });

    // Success Modal Close
    document.getElementById('closeSuccessBtn').addEventListener('click', () => {
        closeSuccess();
    });
}

function openSuccess() {
    document.getElementById('checkoutSuccessModal').classList.add('open');
}

function closeSuccess() {
    document.getElementById('checkoutSuccessModal').classList.remove('open');
}


function addToCart() {
    const item = {
        id: Date.now(),
        config: { ...config },
        names: {
            base: configNames[config.base],
            rim: configNames[config.rim],
            pattern: configNames[config.pattern]
        },
        image: getCurrentImagePath()
    };

    cart.push(item);
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="Lamp Config" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">Majesty Lamp - ${item.names.base}</div>
                <div class="cart-item-specs">${item.names.rim} • ${item.names.pattern}</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                Remove
            </button>
        </div>
    `).join('');

    // Re-attach event listeners for remove buttons (since inline onclick is not ideal but easiest here)
    // Actually, let's delegate or leave as is if global scope issues arise. 
    // To be safe in module/strict contexts, we should delegate or attach via JS.
    // For simplicity here, I'll attach via JS after render.
    const removeButtons = container.querySelectorAll('.remove-item-btn');
    removeButtons.forEach((btn, index) => {
        btn.onclick = () => removeFromCart(cart[index].id);
    });
}

function openSummary() {
    document.getElementById('summaryModal').classList.add('open');
}

function closeSummary() {
    document.getElementById('summaryModal').classList.remove('open');
}

function openCart() {
    document.getElementById('cartModal').classList.add('open');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('open');
}

function getCurrentImagePath() {
    if (config.rim === 'Golden Ring') {
        return `renders/Golden Ring/${config.base} - Golden Ring/${config.pattern} - ${config.base}.webp`;
    } else if (config.rim === 'Silver Ring') {
        return `renders/Silver Ring/${config.base} - Silver Ring/Silver Ring - ${config.pattern} - ${config.base}.webp`;
    } else if (config.rim === 'Copper Ring') {
        return `renders/Copper Ring/${config.base} - Copper Ring/Copper Ring - ${config.pattern} - ${config.base}.webp`;
    }
}

function setupThemeListener() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const sunIcon = themeBtn.querySelector('.sun-icon');
    const moonIcon = themeBtn.querySelector('.moon-icon');

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');

        if (isLight) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    });
}

// ... (Rest of existing functions) ...

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
    } else if (config.rim === 'Silver Ring') {
        // Silver Ring path: renders/Silver Ring/[Base] - Silver Ring/Silver Ring - [Pattern] - [Base].webp
        imagePath = `renders/Silver Ring/${config.base} - Silver Ring/Silver Ring - ${config.pattern} - ${config.base}.webp`;
    } else if (config.rim === 'Copper Ring') {
        // Copper Ring path: renders/Copper Ring/[Base] - Copper Ring/Copper Ring - [Pattern] - [Base].webp
        imagePath = `renders/Copper Ring/${config.base} - Copper Ring/Copper Ring - ${config.pattern} - ${config.base}.webp`;
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
