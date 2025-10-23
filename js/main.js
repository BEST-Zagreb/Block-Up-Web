// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCountdown();
    initAnimations();
    initFloatingCubes();
});

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth fade on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled > 50) {
            navbar.style.background = 'rgba(1, 8, 19, 0.95)';
        } else {
            navbar.style.background = 'linear-gradient(180deg, rgba(1, 8, 19, 0.9) 0%, rgba(1, 8, 19, 0) 100%)';
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Countdown Timer
function initCountdown() {
    const countdownDate = new Date('December 16, 2025 16:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        // const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        // const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        // document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        // document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        // document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animation to elements
    const animatedElements = document.querySelectorAll('.stat-item, .gallery-thumb, .timeline-item, .partner-card, .team-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Floating Glowing Cubes
function initFloatingCubes() {
    const container = document.getElementById('floating-cubes');
    if (!container) return;

    const cubeCount = 8;

    for (let i = 0; i < cubeCount; i++) {
        // Create wrapper for each cube
        const wrapper = document.createElement('div');
        wrapper.className = 'cube-wrapper';

        // Random horizontal position
        wrapper.style.left = Math.random() * 100 + '%';

        // Start at different points in animation to appear mid-screen
        wrapper.style.animationDelay = '-' + (Math.random() * 10 + 5) + 's';

        // Vary animation duration for more natural movement
        wrapper.style.animationDuration = (15 + Math.random() * 10) + 's';

        // Create the cube container
        const cube = document.createElement('div');
        cube.className = 'cube';

        // Random initial rotation angles
        const rotateX = Math.random() * 30; // 0 to 30 degrees tilt
        const startRotateY = Math.random() * 360;
        const rotateZ = Math.random() * 20 - 10; // -10 to 10 degrees

        // Random rotation speed
        const rotationDuration = 15 + Math.random() * 15; // 15-30 seconds

        // Create unique animation for this cube
        const animationName = `rotate-cube-${i}`;
        const keyframes = `
            @keyframes ${animationName} {
                0% {
                    transform: rotateX(${rotateX}deg) rotateY(${startRotateY}deg) rotateZ(${rotateZ}deg);
                }
                100% {
                    transform: rotateX(${rotateX}deg) rotateY(${startRotateY + 360}deg) rotateZ(${rotateZ}deg);
                }
            }
        `;

        // Add the keyframes to the document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        // Apply the animation
        cube.style.animation = `${animationName} ${rotationDuration}s linear infinite`;

        // Create 6 faces
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        faces.forEach(face => {
            const faceElement = document.createElement('div');
            faceElement.className = `cube-face face-${face}`;
            cube.appendChild(faceElement);
        });

        wrapper.appendChild(cube);
        container.appendChild(wrapper);
    }

    // Add glowing orbs for ambiance
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.style.position = 'absolute';
        orb.style.width = '150px';
        orb.style.height = '150px';
        orb.style.borderRadius = '50%';
        orb.style.background = 'radial-gradient(circle, rgba(0, 167, 248, 0.15) 0%, transparent 70%)';
        orb.style.left = Math.random() * 100 + '%';
        orb.style.top = Math.random() * 100 + '%';
        orb.style.filter = 'blur(50px)';
        orb.style.pointerEvents = 'none';

        container.appendChild(orb);
    }
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.2); }
    }
`;
document.head.appendChild(style);