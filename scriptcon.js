// scriptcon.js - Clean and Refactored
class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.initThreeBackground();
        this.initEventListeners();
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

        // Create simple geometric shapes
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x1e3a8a,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });

        const shapes = [];
        for (let i = 0; i < 8; i++) {
            const shape = new THREE.Mesh(geometry, material);
            shape.position.x = (Math.random() - 0.5) * 10;
            shape.position.y = (Math.random() - 0.5) * 10;
            shape.position.z = (Math.random() - 0.5) * 5;
            shape.scale.setScalar(Math.random() * 0.5 + 0.3);
            scene.add(shape);
            shapes.push(shape);
        }

        const ambientLight = new THREE.AmbientLight(0x1e3a8a, 0.3);
        scene.add(ambientLight);

        camera.position.z = 5;

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            shapes.forEach((shape, index) => {
                shape.rotation.x += 0.01;
                shape.rotation.y += 0.005;
                shape.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
            });
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initEventListeners() {
        // Mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu on link click
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Copy email functionality
        this.initCopyEmail();

        // Form submission
        this.initFormHandling();
    }

    initScrollToSection() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const contactSection = document.querySelector('.contact-main-section');
                if (contactSection) {
                    const navHeight = document.querySelector('.nav-blur').offsetHeight;
                    const targetPosition = contactSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    initCopyEmail() {
        const copyButtons = document.querySelectorAll('.copy-btn, .cta-copy-btn');
        const notification = document.getElementById('notification');

        copyButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const email = btn.getAttribute('data-text');
                
                try {
                    await navigator.clipboard.writeText(email);
                    this.showNotification('Email copied to clipboard!');
                    
                    // Visual feedback
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    btn.style.background = 'var(--success)';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                    }, 2000);
                    
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = email;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    this.showNotification('Email copied to clipboard!');
                }
            });
        });
    }

    initFormHandling() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const formObject = Object.fromEntries(formData);
                
                // Basic validation
                if (this.validateForm(formObject)) {
                    // Simulate form submission
                    this.showNotification('Message sent successfully!');
                    contactForm.reset();
                    
                    // Visual feedback
                    const submitBtn = contactForm.querySelector('.submit-btn');
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    submitBtn.style.background = 'var(--success)';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                    }, 3000);
                }
            });
        }
    }

    validateForm(formData) {
        const { name, email, subject, message } = formData;
        
        if (!name.trim()) {
            this.showNotification('Please enter your name', 'error');
            return false;
        }
        
        if (!email.trim() || !this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        if (!subject) {
            this.showNotification('Please select a subject', 'error');
            return false;
        }
        
        if (!message.trim() || message.length < 10) {
            this.showNotification('Please enter a message with at least 10 characters', 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('i');
        const text = notification.querySelector('p');
        
        text.textContent = message;
        icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
        notification.style.background = type === 'error' ? '#ef4444' : 'var(--success)';
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    setCurrentYear() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});