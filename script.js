// script.js - Modern Index Page
class IndexPage {
    constructor() {
        this.init();
    }

    init() {
        this.initThreeBackground();
        this.initEventListeners();
        this.initAnimations();
        this.initScrollToSection();
        this.setCurrentYear();
    }

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

        // Create floating geometric shapes
        const createShape = (geometry, color, position, scale) => {
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
            new THREE.TorusGeometry(1, 0.4, 16, 32)
        ];

        const colors = [0x1e3a8a, 0x3b82f6, 0x60a5fa, 0x93c5fd];
        const shapes = [];

        // Create multiple shapes
        for (let i = 0; i < 10; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const position = {
                x: (Math.random() - 0.5) * 15,
                y: (Math.random() - 0.5) * 15,
                z: (Math.random() - 0.5) * 10
            };
            const scale = Math.random() * 1.5 + 0.5;

            const shape = createShape(geometry, color, position, scale);
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

    initScrollToSection() {
        // Scroll to projects when button is clicked
        const projectsBtn = document.querySelector('a[href="#projects"]');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (projectsBtn) {
            projectsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    const navHeight = document.querySelector('.nav-blur').offsetHeight;
                    const targetPosition = projectsSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }

        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    const navHeight = document.querySelector('.nav-blur').offsetHeight;
                    const targetPosition = aboutSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

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

        gsap.from('.hero-subtitle', {
            duration: 1.5,
            y: 50,
            opacity: 0,
            ease: 'power4.out',
            delay: 0.9
        });

        gsap.from('.hero-description', {
            duration: 1.5,
            y: 50,
            opacity: 0,
            ease: 'power4.out',
            delay: 1.2
        });

        gsap.from('.hero-buttons', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power2.out',
            delay: 1.5
        });

        gsap.from('.scroll-indicator', {
            duration: 1,
            opacity: 0,
            ease: 'power2.out',
            delay: 1.8
        });

        gsap.from('.profile-image', {
            duration: 1.5,
            scale: 0.8,
            opacity: 0,
            ease: 'power2.out',
            delay: 0.8
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

        // Skills tags animation on scroll
        const skillTags = document.querySelectorAll('.skill-tag');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, {
                        duration: 0.6,
                        y: 0,
                        opacity: 1,
                        ease: 'power2.out',
                        delay: index * 0.1
                    });
                }
            });
        }, { threshold: 0.1 });

        skillTags.forEach(tag => {
            gsap.set(tag, { y: 20, opacity: 0 });
            observer.observe(tag);
        });
    }

    setCurrentYear() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new IndexPage();
});