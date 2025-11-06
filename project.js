// project.js
class ProjectsPage {
    constructor() {
        this.init();
    }

    init() {
        this.initThreeBackground();
        this.initEventListeners();
        this.initAnimations();
        this.initScrollAnimations();
        this.initStatsCounter();
    }

    // Enhanced Three.js Background for Projects Page
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

        // Create geometric shapes instead of particles for projects page
        const createGeometricShape = (geometry, color, position, scale) => {
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.1,
                wireframe: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(position.x, position.y, position.z);
            mesh.scale.setScalar(scale);
            return mesh;
        };

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x1e3a8a, 0.3);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0x3b82f6, 0.5);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Create various geometric shapes
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(1, 16, 16),
            new THREE.ConeGeometry(1, 2, 8),
            new THREE.TorusGeometry(1, 0.4, 16, 32),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.TetrahedronGeometry(1, 0)
        ];

        const colors = [0x1e3a8a, 0x3b82f6, 0x60a5fa, 0x93c5fd];
        const shapes = [];

        // Create multiple shapes
        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const position = {
                x: (Math.random() - 0.5) * 20,
                y: (Math.random() - 0.5) * 20,
                z: (Math.random() - 0.5) * 10
            };
            const scale = Math.random() * 2 + 0.5;

            const shape = createGeometricShape(geometry, color, position, scale);
            scene.add(shape);
            shapes.push({
                mesh: shape,
                speed: {
                    x: (Math.random() - 0.5) * 0.002,
                    y: (Math.random() - 0.5) * 0.002,
                    z: (Math.random() - 0.5) * 0.002,
                    rotation: (Math.random() - 0.5) * 0.01
                }
            });
        }

        camera.position.z = 8;

        // Mouse movement effect
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
        });

        // Animation
        const clock = new THREE.Clock();
        
        const animate = () => {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Animate shapes
            shapes.forEach((shape, index) => {
                shape.mesh.rotation.x += shape.speed.x + Math.sin(elapsedTime * 0.5 + index) * 0.001;
                shape.mesh.rotation.y += shape.speed.y + Math.cos(elapsedTime * 0.5 + index) * 0.001;
                shape.mesh.rotation.z += shape.speed.rotation;
                
                // Gentle floating motion
                shape.mesh.position.y += Math.sin(elapsedTime * 0.3 + index) * 0.005;
            });

            // Camera movement based on mouse
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.01;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.01;
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
        
        // Scroll to projects when arrow is clicked
        const scrollArrow = document.querySelector('.scroll-indicator');
        
        if (scrollArrow) {
            scrollArrow.addEventListener('click', () => {
                const projectsSection = document.querySelector('.projects-section');
                if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
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

        // Project card interactions
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: -10,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: 0,
                    ease: 'power2.out'
                });
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

        // Floating shapes animation
        gsap.to('.shape', {
            y: 20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.5
        });
    }

    // Scroll Animations
    initScrollAnimations() {
        // Add fade-in class to all animatable elements
        const animatableElements = document.querySelectorAll('.project-card, .section-title, .section-subtitle, .stat-card');
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
                    
                    // Stagger animation for project cards
                    if (element.classList.contains('project-card')) {
                        gsap.to(element, {
                            duration: 0.6,
                            y: 0,
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

    // Animated Stats Counter
    initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        statNumber.textContent = Math.floor(current);
                    }, 16);
                    
                    observer.unobserve(statNumber);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsPage();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});