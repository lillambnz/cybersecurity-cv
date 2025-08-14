// DOM Elements
const nav = document.querySelector('.nav-container');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const typedText = document.getElementById('typed-text');
const cursor = document.querySelector('.cursor');
const heroStats = document.querySelectorAll('.stat-number');
const skillCategories = document.querySelectorAll('.skill-category');
const skillSets = document.querySelectorAll('.skill-set');
const skillBars = document.querySelectorAll('.skill-progress');

// Typing Animation
const commands = [
    'whoami',
    'cat credentials.txt',
    'sudo access security_profile',
    'initialize threat_assessment',
    'deploy protection_protocols'
];

let currentCommand = 0;
let currentChar = 0;
let isDeleting = false;

function typeCommand() {
    const command = commands[currentCommand];
    
    if (!isDeleting) {
        typedText.textContent = command.substring(0, currentChar + 1);
        currentChar++;
        
        if (currentChar === command.length) {
            isDeleting = true;
            setTimeout(typeCommand, 2000);
            return;
        }
    } else {
        typedText.textContent = command.substring(0, currentChar - 1);
        currentChar--;
        
        if (currentChar === 0) {
            isDeleting = false;
            currentCommand = (currentCommand + 1) % commands.length;
            setTimeout(typeCommand, 500);
            return;
        }
    }
    
    setTimeout(typeCommand, isDeleting ? 50 : 100);
}

// Navigation Scroll Effect
function handleNavScroll() {
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(10, 10, 10, 0.98)';
        nav.style.backdropFilter = 'blur(15px)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    }
}

// Mobile Navigation Toggle
function toggleMobileNav() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Counter Animation
function animateCounters() {
    heroStats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                setTimeout(updateCounter, 30);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Skills Category Switching
function initSkillsSwitch() {
    skillCategories.forEach(category => {
        category.addEventListener('click', () => {
            const targetCategory = category.getAttribute('data-category');
            
            // Update active category
            skillCategories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');
            
            // Update active skill set
            skillSets.forEach(set => {
                set.classList.remove('active');
                if (set.id === targetCategory) {
                    set.classList.add('active');
                    animateSkillBars(set);
                }
            });
        });
    });
}

// Skill Bar Animation
function animateSkillBars(container) {
    const bars = container.querySelectorAll('.skill-progress');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        }, index * 200);
    });
}

// Scroll Animation Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Trigger specific animations
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
                
                if (entry.target.id === 'skills') {
                    const activeSkillSet = document.querySelector('.skill-set.active');
                    if (activeSkillSet) {
                        animateSkillBars(activeSkillSet);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.timeline-item, .cert-card, .hero-stats, #skills');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Matrix Rain Effect
function createMatrixRain() {
    const matrixContainer = document.querySelector('.matrix-bg');
    const characters = '01';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.left = i * 20 + 'px';
        column.style.color = '#00ff41';
        column.style.fontSize = '14px';
        column.style.fontFamily = 'monospace';
        column.style.opacity = '0.1';
        column.style.animation = `matrix-fall ${Math.random() * 5 + 10}s linear infinite`;
        column.style.animationDelay = Math.random() * 5 + 's';
        
        let columnText = '';
        for (let j = 0; j < 20; j++) {
            columnText += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        column.textContent = columnText;
        
        matrixContainer.appendChild(column);
    }
}

// Particle System for Hero Section
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }
    
    init() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 65, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(0, 255, 65, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Security Dashboard Animation
function animateSecurityDashboard() {
    const dashboards = document.querySelectorAll('.security-dashboard');
    
    dashboards.forEach(dashboard => {
        const metrics = dashboard.querySelectorAll('.metric-value');
        metrics.forEach((metric, index) => {
            setTimeout(() => {
                metric.style.animation = 'glow 2s ease-in-out infinite alternate';
            }, index * 500);
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Encrypting...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent Securely';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 2000);
    });
}

// CV Download Function
function downloadCV() {
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual CV file path
    link.download = 'Sheheryar_Abid_Senior_Cybersecurity_Engineer_CV.pdf';
    
    // Simulate download (in real implementation, link to actual file)
    alert('CV download initiated. In production, this would download your PDF CV.');
}

// Terminal Command Execution Simulation
function executeTerminalCommand(command) {
    const output = document.getElementById('terminal-output');
    const newLine = document.createElement('div');
    newLine.className = 'output-line';
    
    switch(command.toLowerCase()) {
        case 'help':
            newLine.innerHTML = `
                <div>Available commands:</div>
                <div>• whoami - Display user information</div>
                <div>• skills - Show technical expertise</div>
                <div>• experience - Display work history</div>
                <div>• certifications - List security credentials</div>
                <div>• contact - Show contact information</div>
            `;
            break;
        case 'whoami':
            newLine.innerHTML = 'User: Sheheryar Abid<br>Role: Senior Cyber Security Engineer<br>Clearance: Level 5<br>Status: Available for hire';
            break;
        case 'skills':
            newLine.innerHTML = 'Loading skill matrix...<br>✓ Identity & Access Management: Expert<br>✓ Cloud Security: Advanced<br>✓ Vulnerability Management: Expert<br>✓ Compliance Frameworks: Advanced';
            break;
        default:
            newLine.textContent = `Command '${command}' not recognized. Type 'help' for available commands.`;
    }
    
    output.appendChild(newLine);
    output.scrollTop = output.scrollHeight;
}

// Glitch Effect for Hero Title
function initGlitchEffect() {
    const glitchElement = document.querySelector('.glitch');
    
    setInterval(() => {
        glitchElement.style.animation = 'none';
        setTimeout(() => {
            glitchElement.style.animation = '';
        }, 100);
    }, 5000);
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Add performance metric to dashboard if needed
        if (loadTime < 1000) {
            console.log('✓ Optimal performance achieved');
        }
    });
}

// Easter Eggs and Interactive Elements
function initEasterEggs() {
    // Konami Code easter egg
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Activate special mode
                document.body.style.filter = 'hue-rotate(180deg)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 3000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    // Click counter for certain elements
    let securityBadgeClicks = 0;
    const securityBadge = document.querySelector('.security-badge');
    
    if (securityBadge) {
        securityBadge.addEventListener('click', () => {
            securityBadgeClicks++;
            if (securityBadgeClicks === 5) {
                securityBadge.innerHTML = '<i class="fas fa-user-secret"></i><span>CLASSIFIED: LEVEL 10 CLEARANCE</span>';
                securityBadge.style.background = 'rgba(255, 0, 128, 0.3)';
            }
        });
    }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    typeCommand();
    initSkillsSwitch();
    initScrollAnimations();
    createMatrixRain();
    initContactForm();
    initGlitchEffect();
    initPerformanceMonitoring();
    initEasterEggs();
    
    // Initialize particle system for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleSystem(heroSection);
    }
    
    // Animate security dashboard
    setTimeout(() => {
        animateSecurityDashboard();
    }, 1000);
    
    // Event listeners
    window.addEventListener('scroll', handleNavScroll);
    navToggle.addEventListener('click', toggleMobileNav);
    
    // Navigation link handlers
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Add CSS animations for matrix fall
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrix-fall {
            0% { transform: translateY(-100vh); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes glow {
            0% { text-shadow: 0 0 5px currentColor; }
            100% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }
    `;
    document.head.appendChild(style);
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for potential external use
window.CyberSecurityCV = {
    scrollToSection,
    downloadCV,
    executeTerminalCommand
};