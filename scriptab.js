// scriptab.js
class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.initThreeBackground();
        this.initEventListeners();
        this.initAnimations();
        this.initScrollAnimations();
    }

    // Enhanced Three.js Background Animation
    initThreeBackground() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('three-bg').appendChild(renderer.domElement);

        // Create multiple particle systems for depth
        const createParticleSystem = (count, size, color, spread) => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);

            for(let i = 0; i < count * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * spread;
                positions[i + 1] = (Math.random() - 0.5) * spread;
                positions[i + 2] = (Math.random() - 0.5) * spread;
                
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: size,
                vertexColors: true,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            return new THREE.Points(geometry, material);
        };

        // Create different particle layers
        const blueColor = new THREE.Color(0.12, 0.36, 0.65); // Dark blue
        const lightBlueColor = new THREE.Color(0.42, 0.67, 0.88); // Light blue
        
        const particles1 = createParticleSystem(2000, 0.02, blueColor, 10);
        const particles2 = createParticleSystem(1500, 0.015, lightBlueColor, 8);
        const particles3 = createParticleSystem(1000, 0.01, blueColor, 6);

        scene.add(particles1);
        scene.add(particles2);
        scene.add(particles3);

        // Add some geometric shapes for visual interest
        const addGeometricShapes = () => {
            const geometry = new THREE.IcosahedronGeometry(1, 0);
            const material = new THREE.MeshBasicMaterial({
                color: 0x1e3a8a,
                wireframe: true,
                transparent: true,
                opacity: 0.1
            });

            const shapes = [];
            for (let i = 0; i < 5; i++) {
                const shape = new THREE.Mesh(geometry, material);
                shape.position.x = (Math.random() - 0.5) * 10;
                shape.position.y = (Math.random() - 0.5) * 10;
                shape.position.z = (Math.random() - 0.5) * 5;
                shape.scale.setScalar(Math.random() * 0.5 + 0.5);
                scene.add(shape);
                shapes.push(shape);
            }
            return shapes;
        };

        const shapes = addGeometricShapes();

        camera.position.z = 5;

        // Mouse movement effect
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (event) => {
            targetX = (event.clientX / window.innerWidth - 0.5) * 2;
            targetY = (event.clientY / window.innerHeight - 0.5) * 2;
        });

        // Animation
        const clock = new THREE.Clock();
        
        const animate = () => {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Smooth mouse movement
            mouseX += (targetX - mouseX) * 0.02;
            mouseY += (targetY - mouseY) * 0.02;

            // Animate particles with different speeds for depth
            particles1.rotation.x = elapsedTime * 0.05 + mouseY * 0.3;
            particles1.rotation.y = elapsedTime * 0.08 + mouseX * 0.3;

            particles2.rotation.x = elapsedTime * 0.08 + mouseY * 0.2;
            particles2.rotation.y = elapsedTime * 0.12 + mouseX * 0.2;

            particles3.rotation.x = elapsedTime * 0.12 + mouseY * 0.1;
            particles3.rotation.y = elapsedTime * 0.15 + mouseX * 0.1;

            // Animate shapes
            shapes.forEach((shape, index) => {
                shape.rotation.x = elapsedTime * 0.1 * (index + 1);
                shape.rotation.y = elapsedTime * 0.15 * (index + 1);
                shape.position.y = Math.sin(elapsedTime * 0.5 + index) * 0.5;
            });

            // Gentle camera movement
            camera.position.x = mouseX * 0.5;
            camera.position.y = -mouseY * 0.5;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Event Listeners
    initEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Scroll to content when arrow is clicked
        const scrollArrow = document.querySelector('.scroll-indicator');
        
        if (scrollArrow) {
            scrollArrow.addEventListener('click', () => {
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            });
        }
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '#hero') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navHeight = document.querySelector('.nav-blur').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // GSAP Animations
    initAnimations() {
        // Hero section animations
        gsap.from('.name-line-1', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: 'power4.out',
            delay: 0.3
        });

        gsap.from('.name-line-2', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: 'power4.out',
            delay: 0.6
        });

        gsap.from('.hero-description', {
            duration: 1.5,
            y: 50,
            opacity: 0,
            ease: 'power4.out',
            delay: 1.0
        });

        gsap.from('.scroll-indicator', {
            duration: 1,
            opacity: 0,
            ease: 'power2.out',
            delay: 1.8
        });

        // Add floating animation to some elements
        gsap.to('.passion-logo', {
            y: 10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.2
        });
    }

    // Scroll Animations
    initScrollAnimations() {
        // Add fade-in class to all animatable elements
        const animatableElements = document.querySelectorAll('.section-card, .section-title, .timeline-item, .skill-item, .passion-card');
        animatableElements.forEach(element => {
            element.classList.add('fade-in');
        });

        // Check scroll position
        const checkScroll = () => {
            const triggerBottom = window.innerHeight * 0.85;
            
            animatableElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                
                if (elementTop < triggerBottom) {
                    element.classList.add('visible');
                    
                    // Add staggered animation for items in containers
                    if (element.classList.contains('skill-item') || element.classList.contains('timeline-item')) {
                        gsap.to(element, {
                            duration: 0.6,
                            x: 0,
                            opacity: 1,
                            ease: 'power2.out'
                        });
                    }
                }
            });
        };

        // Initial check
        checkScroll();
        
        // Listen for scroll events with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    checkScroll();
                    scrollTimeout = null;
                }, 50);
            }
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});

// Handle page refresh and navigation
window.addEventListener('beforeunload', () => {
    // Clean up if needed
});
document.addEventListener('DOMContentLoaded', () => {
    // Scroll to content when clicking the discover more button
    const scrollIndicator = document.querySelector('.scroll-indicator');
    scrollIndicator.addEventListener('click', () => {
        const mainContent = document.querySelector('main');
        mainContent.scrollIntoView({ behavior: 'smooth' });
    });
});