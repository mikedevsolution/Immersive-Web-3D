import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

RectAreaLightUniformsLib.init();
gsap.registerPlugin(ScrollTrigger);


const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
const loadingManager = new THREE.LoadingManager();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Loader
 */
const progressBar = document.getElementById('progress-bar');
const loaderStatus = document.getElementById('loader-status');
const loaderContainer = document.getElementById('loader');

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    progressBar.style.width = `${progress}%`;
};

loadingManager.onLoad = () => {
    gsap.to(loaderContainer, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
            loaderContainer.style.display = 'none';
            initAnimations();
        }
    });
};

/**
 * Environment & Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff0000, 10, 10);
pointLight.position.set(-2, 2, 2);
scene.add(pointLight);

// Studio Lighting
const blueLight = new THREE.PointLight(0x00aaff, 15, 20);
blueLight.position.set(5, 2, -5);
scene.add(blueLight);

const purpleLight = new THREE.PointLight(0xff00ff, 10, 20);
purpleLight.position.set(-5, -2, 5);
scene.add(purpleLight);

// RectAreaLight for professional studio look
const rectLight = new THREE.RectAreaLight(0xffffff, 20, 10, 10);
rectLight.position.set(5, 5, 0);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);

/**
 * 3D Grid Floor
 */
const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
gridHelper.position.y = -1.05;
scene.add(gridHelper);

/**
 * Model
 */
let model;
let carMaterial = null;

gltfLoader.load(
    '/tesla_model_s_prior_design.glb',
    (gltf) => {
        console.log('Model loaded successfully');
        model = gltf.scene;
        
        // Let's log the actual dimensions of the car!
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        console.log('Model dimensions (X, Y, Z):', size.x, size.y, size.z);

        // Auto-scale to fit a reasonable dimension (e.g. max 10 units wide)
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 20) { // If it's in millimeters, it'll be thousands
             const targetScale = 10 / maxDim;
             model.scale.set(targetScale, targetScale, targetScale);
             console.log('Model was huge! Auto-scaled to:', targetScale);
        } else if (maxDim < 0.1) { // If it's too small
             const targetScale = 5 / maxDim;
             model.scale.set(targetScale, targetScale, targetScale);
             console.log('Model was tiny! Auto-scaled to:', targetScale);
        } else {
             model.scale.set(1.5, 1.5, 1.5);
        }

        model.position.y = -1;
        model.rotation.y = Math.PI * 0.25;
        
        // Find car body material
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Improved material detection
                if (child.name.toLowerCase().includes('body') || 
                    child.name.toLowerCase().includes('paint') || 
                    child.name.toLowerCase().includes('carpaint')) {
                   carMaterial = child.material;
                   console.log('Detected car material:', child.name);
                }
            }
        });

        scene.add(model);
    },
    (xhr) => {
        const percent = (xhr.loaded / xhr.total) * 100;
        console.log(`Loading model: ${Math.round(percent)}%`);
    },
    (error) => {
        console.error('An error happened while loading the model:', error);
        loaderStatus.innerText = 'Erreur lors du chargement des ressources 3D. Veuillez actualiser.';
    }
);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(6, 2, 8);
camera.lookAt(new THREE.Vector3(0, -1, 0));
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;

/**
 * Controls (Optional, to let you look around)
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 20;

/**
 * Interactive Features: Color Picker
 */
const colorButtons = document.querySelectorAll('.color-btn');
colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        if (carMaterial) {
            gsap.to(carMaterial.color, {
                r: new THREE.Color(color).r,
                g: new THREE.Color(color).g,
                b: new THREE.Color(color).b,
                duration: 1
            });
        }
        colorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

/**
 * Animations
 */
const initAnimations = () => {
    // Hero Text Reveal
    gsap.to('.reveal-text', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Scroll Animations
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        endTrigger: 'main',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            
            // Rotate model based on scroll
            if (model) {
                model.rotation.y = Math.PI * 0.25 + (progress * Math.PI * 2);
                
                // Camera orbit movement
                camera.position.x = 6 * Math.cos(progress * Math.PI);
                camera.position.z = 8 * Math.sin(progress * Math.PI);
                camera.lookAt(model.position);
            }
        }
    });

    // Feature Cards
    gsap.from('.feature-card.left', {
        scrollTrigger: {
            trigger: '.feature-card.left',
            start: 'top 80%',
            end: 'top 50%',
            scrub: true
        },
        x: -200,
        opacity: 0
    });

    gsap.from('.feature-card.right', {
        scrollTrigger: {
            trigger: '.feature-card.right',
            start: 'top 80%',
            end: 'top 50%',
            scrub: true
        },
        x: 200,
        opacity: 0
    });
};

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Subtle model hover effect
    if (model) {
        model.position.y = -1 + Math.sin(elapsedTime * 0.5) * 0.1;
        // Keep camera looking at model slightly
        camera.lookAt(0, model.position.y, 0);
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
