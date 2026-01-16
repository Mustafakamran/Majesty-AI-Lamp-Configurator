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

// Three.js Viewer State
let threeViewer = null;
let is3DMode = false;

// Three.js Viewer Class
class ThreeViewer {
    constructor() {
        this.container = document.getElementById('threeCanvasContainer');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(10, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.model = null;
        this.loader = new THREE.GLTFLoader();
        this.debugSettings = {
            exposure: 1,
            ambientIntensity: 0,
            mainLightIntensity: 2,
            rimLightIntensity: 2,
            metalness: 1,
            roughness: 0.1,
            envMapIntensity: 0.2,
            baseMetalness: 1,
            baseRoughness: 0.15
        };
        this.cameraAngles = {
            front: { pos: { x: 0, y: 0, z: 3 }, lookAt: { x: 0, y: 0, z: 0 } },
            left: { pos: { x: -1.8, y: 0.5, z: 3 }, lookAt: { x: 0, y: 0, z: 0 } },
            right: { pos: { x: 1.8, y: 0.5, z: 3 }, lookAt: { x: 0, y: 0, z: 0 } }
        };

        this.init();
    }

    init() {
        // Renderer setup
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Camera position
        this.camera.position.set(0, 0, 2.5);

        // Environment Map (HDRI)
        this.setupEnvironment();

        // Lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff, this.debugSettings.ambientIntensity);
        this.scene.add(this.ambientLight);

        this.mainLight = new THREE.DirectionalLight(0xffffff, this.debugSettings.mainLightIntensity);
        this.mainLight.position.set(5, 5, 5);
        this.scene.add(this.mainLight);

        this.rimLight = new THREE.PointLight(0xffffff, this.debugSettings.rimLightIntensity);
        this.rimLight.position.set(-5, 3, -5);
        this.scene.add(this.rimLight);

        // Load Model
        this.loadModel();

        // Handle Resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Animation Loop
        this.animate();
    }

    setupEnvironment() {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();

        // Using the user's local high-fidelity EXR environment map
        new THREE.EXRLoader().load('env_texture/env.exr', (texture) => {
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            this.scene.environment = envMap;
            // this.scene.background = envMap; // Uncomment if background needed

            texture.dispose();
            pmremGenerator.dispose();

            if (this.model) this.updateMaterials();
            console.log('Environment Map (EXR) loaded successfully');
        }, undefined, (error) => {
            console.error('Error loading EXR environment map:', error);
            // Fallback to simple studio JPG if EXR fails
            new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/22_3_13_4_50_48_680_1656.jpg', (texture) => {
                const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                this.scene.environment = envMap;
                if (this.model) this.updateMaterials();
            });
        });

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = this.debugSettings.exposure;
    }



    setCameraAngle(angleName) {
        const angle = this.cameraAngles[angleName];
        if (!angle) return;

        gsap.to(this.camera.position, {
            x: angle.pos.x,
            y: angle.pos.y,
            z: angle.pos.z,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(angle.lookAt.x, angle.lookAt.y, angle.lookAt.z);
            }
        });

        // Update UI
        document.querySelectorAll('.camera-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.angle === angleName);
        });
    }

    loadModel() {
        this.loader.load('https://pub-0fa84320243249fca31ce0de4238c3e8.r2.dev/MajestyGLB.glb', (gltf) => {
            this.model = gltf.scene;
            this.scene.add(this.model);

            // Collect all materials from the model for easy access
            this.allMaterials = {};
            this.collectMaterials(gltf.scene);

            // Try to get all materials from the parser
            if (gltf.parser && gltf.parser.getDependencies) {
                gltf.parser.getDependencies('material').then(materials => {
                    materials.forEach(m => {
                        this.allMaterials[m.name] = m;
                    });
                    this.updateMaterials();
                });
            }

            // Center and scale model if needed
            const box = new THREE.Box3().setFromObject(this.model);
            const center = box.getCenter(new THREE.Vector3());

            this.model.position.x += (this.model.position.x - center.x);
            this.model.position.y += (this.model.position.y - center.y);
            this.model.position.z += (this.model.position.z - center.z);

            // Initial sync
            this.updateMaterials();
            this.setCameraAngle('front');
            console.log('3D Model loaded successfully');
        }, undefined, (error) => {
            console.error('Error loading 3D model:', error);
        });
    }

    collectMaterials(object) {
        object.traverse((node) => {
            if (node.isMesh && node.material) {
                if (Array.isArray(node.material)) {
                    node.material.forEach(m => this.allMaterials[m.name] = m);
                } else {
                    this.allMaterials[node.material.name] = node.material;
                }
            }
        });
    }

    updateMaterials() {
        if (!this.model) return;

        // Material Name Mapping based on GLB file
        const rimMaterialMap = {
            'Golden Ring': 'Gold Cap',
            'Silver Ring': 'Silver Cap',
            'Copper Ring': 'Cooper Cap' // Spelling from GLB
        };

        const screenMaterialMap = {
            'Golden Ring': 'Screen Gold',
            'Silver Ring': 'Screen Silver',
            'Copper Ring': 'Screen Copper'
        };

        const patternMaterialMap = {
            'Triangle': 'Triangle',
            'Star': 'Star',
            'Arabic': 'Arabic'
        };

        // Pattern meshes (show only the selected one) - mesh names have _Pattern suffix
        const patternMeshMap = {
            'Triangle': 'Triangle_Pattern',
            'Star': 'Star_Pattern',
            'Arabic': 'Arabic_Pattern'
        };
        const patternMeshNames = ['Triangle_Pattern', 'Star_Pattern', 'Arabic_Pattern'];

        // Screen helper meshes to always hide
        const screenHelperMeshes = ['Screen_Copper', 'Screen_Silver'];

        this.model.traverse((node) => {
            if (node.isMesh) {
                // Hide screen helper meshes
                if (screenHelperMeshes.includes(node.name)) {
                    node.visible = false;
                    return;
                }

                // Pattern meshes - show only the selected one
                if (patternMeshNames.includes(node.name)) {
                    const selectedPatternMesh = patternMeshMap[config.pattern];
                    node.visible = (node.name === selectedPatternMesh);
                    return;
                }

                // Hide main Patterns mesh (using individual pattern meshes instead)
                if (node.name === 'Patterns') {
                    node.visible = false;
                    return;
                }

                // 1. Base Mesh
                if (node.name === 'Base') {
                    this.applyMaterialByName(node, config.base);
                }

                // 2. Rim/Ring Finishes
                if (['Rim', 'Ring', 'BaseRim', 'BaseRim_1', 'Logo'].includes(node.name)) {
                    const matName = rimMaterialMap[config.rim];
                    this.applyMaterialByName(node, matName);
                }

                // 3. Screen (main screen mesh)
                if (node.name === 'Screen_Main_(Gold)') {
                    const matName = screenMaterialMap[config.rim];
                    this.applyMaterialByName(node, matName);
                }
            }
        });
    }

    applyMaterialByName(mesh, matName) {
        if (this.allMaterials && this.allMaterials[matName]) {
            const material = this.allMaterials[matName];

            // Apply refined properties for metallic materials
            if (matName.includes('Cap') || matName.includes('Gold') || matName.includes('Silver') || matName.includes('Cooper')) {
                material.metalness = this.debugSettings.metalness;
                material.roughness = this.debugSettings.roughness;
                material.envMapIntensity = this.debugSettings.envMapIntensity;
            } else if (matName === 'Base' || config.base.includes('Metallic')) {
                material.metalness = this.debugSettings.baseMetalness;
                material.roughness = this.debugSettings.baseRoughness;
                material.envMapIntensity = 1.0;
            }

            mesh.material = material;
        } else {
            // Fallback logic
            if (mesh.name === 'Base') {
                this.applyBaseColorFallback(mesh);
            } else if (['Rim', 'Ring', 'BaseRim', 'BaseRim_1', 'Logo', 'Screen_Main_(Gold)'].includes(mesh.name)) {
                this.applyMetalMaterialFallback(mesh);
            }
        }
    }

    applyMetalMaterialFallback(mesh) {
        let color;
        if (config.rim === 'Golden Ring') color = 0xd4a574;
        else if (config.rim === 'Silver Ring') color = 0xcccccc;
        else if (config.rim === 'Copper Ring') color = 0xb87333;

        mesh.material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: this.debugSettings.metalness,
            roughness: this.debugSettings.roughness,
            envMapIntensity: this.debugSettings.envMapIntensity
        });
    }

    applyBaseColorFallback(mesh) {
        const colorMap = {
            'Red': 0xdc2626,
            'Red Metallic': 0x991b1b,
            'Black': 0x1a1a1a,
            'White': 0xffffff,
            'Gold': 0xd4a574,
            'Silver': 0xcccccc,
            'Copper': 0xb87333
        };
        const color = colorMap[config.base] || 0xffffff;

        if (mesh.material) {
            mesh.material.color.setHex(color);
            mesh.material.metalness = (config.base.includes('Metallic') || config.base === 'Gold' || config.base === 'Silver' || config.base === 'Copper') ? this.debugSettings.baseMetalness : 0.1;
            mesh.material.roughness = (config.base.includes('Metallic') || config.base === 'Gold' || config.base === 'Silver' || config.base === 'Copper') ? this.debugSettings.baseRoughness : 0.8;
            mesh.material.envMapIntensity = 1.0;
        }
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the application
function init() {
    setupEventListeners();
    updateProduct();
    setupCartListeners();
    setupThemeListener();
    setup3DViewToggle();
    // Start preloading after initial render to prioritize first paint
    setTimeout(preloadImages, 1000);
}

function setup3DViewToggle() {
    const toggleBtn = document.getElementById('view3DToggle');
    const image = document.getElementById('productImage');
    const container = document.getElementById('threeCanvasContainer');
    const cameraControls = document.getElementById('cameraControls');

    toggleBtn.addEventListener('click', () => {
        is3DMode = !is3DMode;

        if (is3DMode) {
            // Switch to 3D
            if (!threeViewer) {
                threeViewer = new ThreeViewer();
                setupCameraAngleListeners();
            } else {
                threeViewer.updateMaterials();
            }

            container.classList.add('active');
            image.classList.add('hidden');
            cameraControls.classList.add('active');
            toggleBtn.classList.add('active');
            toggleBtn.querySelector('span').textContent = '2D VIEW';
        } else {
            // Switch to 2D
            container.classList.remove('active');
            image.classList.remove('hidden');
            cameraControls.classList.remove('active');
            toggleBtn.classList.remove('active');
            toggleBtn.querySelector('span').textContent = '3D VIEW';

            updateProduct();
        }
    });
}

function setupCameraAngleListeners() {
    document.querySelectorAll('.camera-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const angle = btn.dataset.angle;
            if (threeViewer) threeViewer.setCameraAngle(angle);
        });
    });
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

    // Update 3D model if it exists
    if (threeViewer) {
        threeViewer.updateMaterials();
    }
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
