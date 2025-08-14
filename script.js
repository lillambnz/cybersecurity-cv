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
    const topBar = document.querySelector('.top-bar');
    const nav = document.querySelector('.nav-container');
    
    if (window.scrollY > 150) {
        nav.style.background = 'rgba(5, 5, 5, 0.98)';
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.borderBottom = '1px solid var(--primary-color)';
        nav.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.3)';
        topBar.style.transform = 'translateY(-100%)';
        nav.style.top = '0';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.borderBottom = '1px solid var(--border-color)';
        nav.style.boxShadow = 'none';
        topBar.style.transform = 'translateY(0)';
        nav.style.top = '70px';
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
        const offsetTop = section.offsetTop - 160; // Account for neon top bar + nav spacing
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
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Download...';
    button.disabled = true;
    
    // Simulate preparation time
    setTimeout(() => {
        // In production, replace this with actual CV file URL
        // For now, create a professional message
        // Create comprehensive CV content
        const cvContent = `
═══════════════════════════════════════════════════════════════
                        SHEHERYAR ABID
              SENIOR CYBER SECURITY ENGINEER
═══════════════════════════════════════════════════════════════

CONTACT INFORMATION:
📧 Email: sher@outlook.co.nz
🌐 Portfolio: https://sheheryara.bid
📰 Cyber News: https://todaycybernews.sheheryara.bid
🤖 AI News: https://todayainews.sheheryara.bid
📍 Location: Perth, Western Australia

═══════════════════════════════════════════════════════════════
PROFESSIONAL SUMMARY
═══════════════════════════════════════════════════════════════

Seasoned cybersecurity professional with 11+ years of progressive 
experience in enterprise security architecture, critical infrastructure 
protection, and identity management. Proven track record of protecting 
5000+ users and thousands of servers including mainframes across 
banking, telecommunications, and enterprise sectors.

SPECIALIZES IN:
• Critical Infrastructure Protection & Risk Assessment
• Post-Quantum Cryptography Implementation
• Identity & Access Management (IAM) Architecture
• Cloud Security (Azure, AWS) & Zero Trust Models
• Compliance Frameworks (NIST, ISO27001, ASD Essential 8)
• Vulnerability Management & Incident Response
• Security Operations Center (SOC) Management
• Technical Team Leadership & Cybersecurity Strategy

═══════════════════════════════════════════════════════════════
PROFESSIONAL EXPERIENCE
═══════════════════════════════════════════════════════════════

INFORMATION SECURITY ENGINEER
Wilson Group | Perth, Australia | Sep 2024 - Present

🔹 Lead cybersecurity initiatives for critical infrastructure protection 
   across hybrid cloud environments serving enterprise clients
🔹 Conduct comprehensive security architecture reviews for new projects 
   ensuring compliance with NIST Cybersecurity Framework
🔹 Design and implement advanced IAM solutions using Okta Identity Cloud 
   managing user provisioning for 1000+ users
🔹 Develop Python-based security automation tools for vulnerability 
   assessment, log analysis, and incident response workflows
🔹 Apply PMBOK methodologies to cybersecurity project delivery, 
   coordinating cross-functional teams and stakeholder communications
🔹 Perform comprehensive risk assessments for IT and OT systems, 
   developing mitigation strategies and business continuity plans

Key Technologies: Python, Okta Identity Cloud, Linux, NIST Framework, 
ISO27001, Architecture Reviews, Critical Infrastructure Protection

───────────────────────────────────────────────────────────────

CYBER SECURITY OPERATIONS MANAGER
CyberWatch | Remote - New Zealand | Jan 2022 - Sep 2024

🔹 Managed end-to-end cybersecurity operations for multiple enterprise 
   clients with 24/7 SOC activities and threat hunting operations
🔹 Led cybersecurity technical teams of 8+ security professionals, 
   providing mentorship and performance management
🔹 Designed and implemented WAF configurations and conducted comprehensive 
   web application security assessments
🔹 Architected and deployed CyberArk PAM solutions managing privileged 
   accounts for high-risk systems with zero-trust access controls
🔹 Implemented comprehensive identity governance programs managing digital 
   identity lifecycle and access certification processes
🔹 Conducted security assessments including penetration testing, 
   vulnerability assessments, and security control evaluations
🔹 Led technical recruiting initiatives, conducting interviews and 
   building high-performing security teams
🔹 Managed machine identity security controls for automated systems 
   and IoT devices with certificate lifecycle management

Key Achievements:
• Reduced security incident response time by 60%
• Implemented zero-trust architecture for 5 enterprise clients
• Built and managed SOC team serving 15+ enterprise customers
• Achieved 99.9% SOC uptime across all client engagements

Key Technologies: CyberArk PAM, Web Application Firewalls, SIEM/SOAR, 
Digital Identity Governance, Penetration Testing, Machine Identity

───────────────────────────────────────────────────────────────

CYBER SECURITY ENGINEER
Westpac New Zealand | Auckland, New Zealand | Nov 2020 - Sep 2024

🔹 Protected critical banking infrastructure serving 5000+ users and 
   thousands of servers including mainframes and core banking systems
🔹 Led implementation of post-quantum cryptography solutions, preparing 
   banking systems for quantum-resistant security threats
🔹 Managed comprehensive vulnerability assessment programs across 
   enterprise banking infrastructure with 5000+ endpoints
🔹 Administered CyberArk PAM platform for critical banking systems 
   including mainframes, databases, and core banking applications
🔹 Implemented SailPoint IdentityIQ for identity lifecycle management, 
   access certification, and role-based access controls
🔹 Managed Proofpoint email security platform with advanced threat 
   protection and data loss prevention for banking operations
🔹 Administered DigiCert SSL/TLS certificate infrastructure managing 
   PKI operations for secure banking communications
🔹 Conducted security architecture reviews ensuring RBNZ compliance 
   and industry security standards adherence
🔹 Implemented security controls for payment systems, core banking 
   platforms, and customer-facing applications

Key Achievements:
• Successfully implemented post-quantum cryptography across 
  critical banking systems ahead of industry timeline
• Maintained 100% uptime for core banking security systems
• Reduced privileged access security incidents by 85%
• Achieved full RBNZ regulatory compliance across all projects

Key Technologies: Post-Quantum Cryptography, CyberArk PAM, 
SailPoint IdentityIQ, Proofpoint, DigiCert PKI, Mainframe Security, 
RBNZ Compliance, Banking Infrastructure

───────────────────────────────────────────────────────────────

SOE ENGINEER (STANDARD OPERATING ENVIRONMENT)
Fujitsu | Hybrid | Sep 2018 - Oct 2020

🔹 Designed and managed enterprise-grade standard operating environments 
   for multiple enterprise clients ensuring consistency and security
🔹 Implemented comprehensive security hardening procedures for Windows 
   and Linux systems applying CIS benchmarks and industry standards
🔹 Optimized system performance through configuration management and 
   automated deployment processes across client environments
🔹 Managed enterprise Linux environments including RHEL, CentOS, and 
   Ubuntu implementing security controls and maintenance procedures
🔹 Developed automated deployment scripts and procedures for consistent 
   SOE rollouts across multiple client environments
🔹 Implemented configuration management solutions ensuring system 
   compliance and security posture maintenance
🔹 Managed infrastructure components including virtualization platforms, 
   storage systems, and network security appliances
🔹 Provided technical consulting and SOE services ensuring SLA 
   compliance and customer satisfaction

Key Achievements:
• Standardized SOE deployment reducing setup time by 70%
• Implemented security hardening across 500+ enterprise systems
• Achieved 98% client satisfaction rating for SOE services
• Reduced security configuration drift by 90% through automation

Key Technologies: Linux Administration, Windows Server, Security 
Hardening, CIS Benchmarks, Configuration Management, Virtualization, 
Enterprise Infrastructure

───────────────────────────────────────────────────────────────

SENIOR DESKTOP SUPPORT ENGINEER
Avis Budget Group | On-site | Jun 2015 - Mar 2018

🔹 Led enterprise desktop support operations managing 2000+ endpoints 
   across multiple global locations for car rental operations
🔹 Provided senior technical leadership mentoring junior staff and 
   managing escalated technical issues
🔹 Administered enterprise Active Directory environment including user 
   account management and group policy configuration
🔹 Performed advanced Windows system administration including server 
   management and network troubleshooting
🔹 Led technical projects including system migrations, hardware refreshes, 
   and software deployments across global operations
🔹 Implemented desktop security controls including endpoint protection 
   and security policy enforcement
🔹 Managed critical incident response ensuring minimal downtime for 
   business-critical reservation systems
🔹 Created comprehensive technical documentation and knowledge base 
   articles improving support team efficiency

Key Achievements:
• Reduced average ticket resolution time by 45%
• Led successful Windows 10 migration for 2000+ endpoints
• Implemented endpoint security reducing malware incidents by 80%
• Achieved 99.5% system uptime for business-critical applications

Key Technologies: Windows Server, Active Directory, Group Policy, 
Endpoint Security, Network Troubleshooting, System Migration

───────────────────────────────────────────────────────────────

DESKTOP SUPPORT ANALYST
Avis Budget Group | On-site | Jan 2013 - Apr 2015

🔹 Delivered comprehensive desktop support for 1500+ users across 
   multiple business units maintaining high customer satisfaction
🔹 Performed regular system maintenance including security patching 
   and system optimization ensuring optimal performance
🔹 Managed user accounts and access controls within Active Directory 
   environment following proper security protocols
🔹 Coordinated hardware lifecycle management for desktop and mobile 
   computing devices across the organization
🔹 Provided support for business-critical applications including 
   reservation systems and point-of-sale systems
🔹 Implemented security best practices contributing to enterprise 
   security posture and compliance requirements
🔹 Contributed to knowledge base development improving team efficiency 
   and service delivery standards
🔹 Managed technical escalations ensuring timely resolution of 
   complex technical issues

Key Achievements:
• Maintained 95%+ customer satisfaction rating
• Resolved 98% of tickets within SLA timeframes
• Contributed to 30% reduction in repeat incidents through 
  improved documentation
• Successfully supported business growth from 1200 to 1500 users

Key Technologies: Windows Desktop Support, Active Directory, 
Application Support, Hardware Management, Security Best Practices

═══════════════════════════════════════════════════════════════
CERTIFICATIONS & PROFESSIONAL DEVELOPMENT
═══════════════════════════════════════════════════════════════

CURRENT CERTIFICATIONS:
🏆 ISC2 Candidate (Dec 2024 - Dec 2025)
   International Information System Security Certification Consortium

🏆 IBM Cybersecurity Architecture (Jun 2024)
   Advanced cybersecurity architecture and design principles
   Credential ID: d430df15deda6371a68fbc41311adc6c

🏆 Security for Artificial Intelligence Software and Services (Apr 2024)
   Board Infinity - Credential ID: AN6D35X2TXHG

🏆 Cortex™ XSOAR - Automation and Orchestration (Mar 2023)
   Red Education - Credential ID: o7EFk1mWoqWJVQFNncQwLA

🏆 Zscaler Internet Access (ZIA) Certified Administrator (Mar 2023)
   Expires: Mar 2026 - Credential ID: nh85g8ibxiu7

AWS CERTIFICATIONS (2021):
• AWS Associate Solutions Architect 2020: Developer Options
• AWS Associate Solutions Architect 2020: Stack Deployment & Caching
• AWS Associate Solutions Architect 2020: Database Solutions
• AWS Associate Solutions Architect 2020: Storage Solutions

CISA TRAINING CERTIFICATIONS (2021):
• Data Privacy & Risk Management
• Identity & Access Management and Data Classification
• IT Management Frameworks
• Information System Auditing
• PKI & Data Protection
• Performance & Management
• Core Security Fundamentals

═══════════════════════════════════════════════════════════════
TECHNICAL EXPERTISE
═══════════════════════════════════════════════════════════════

SECURITY FRAMEWORKS & COMPLIANCE:
• NIST Cybersecurity Framework (Expert Level)
• ISO27001 Information Security Management
• ASD Essential 8 Security Controls
• CIS Critical Security Controls
• RBNZ Banking Compliance Requirements
• SABSA Security Architecture Framework

IDENTITY & ACCESS MANAGEMENT:
• Okta Identity Cloud (Advanced)
• CyberArk Privileged Access Management (Expert)
• SailPoint IdentityIQ (Advanced)
• Microsoft Active Directory (Expert)
• Zero Trust Architecture Implementation
• Digital Identity Lifecycle Management

CLOUD SECURITY:
• Microsoft Azure Security (Advanced)
• Amazon Web Services Security (Intermediate)
• Cloud Security Posture Management (CSPM)
• Container Security (Docker, Kubernetes)
• Cloud Access Security Broker (CASB)
• Infrastructure as Code Security

SECURITY TOOLS & TECHNOLOGIES:
• Vulnerability Management Platforms
• SIEM/SOAR Solutions (Splunk, QRadar)
• Web Application Firewalls (WAF)
• Endpoint Detection and Response (EDR)
• Network Security Monitoring
• Penetration Testing Tools
• Security Orchestration Platforms

CRYPTOGRAPHY & PKI:
• Post-Quantum Cryptography Implementation
• DigiCert SSL/TLS Certificate Management
• Public Key Infrastructure (PKI) Design
• Encryption Key Management
• Digital Certificate Lifecycle Management
• Hardware Security Modules (HSM)

PROGRAMMING & AUTOMATION:
• Python Security Scripting (Advanced)
• PowerShell Automation (Advanced)
• Bash/Shell Scripting (Intermediate)
• Infrastructure as Code (Terraform, CloudFormation)
• Security Automation Frameworks
• API Security and Integration

OPERATING SYSTEMS:
• Linux (RHEL, CentOS, Ubuntu) - Expert
• Windows Server (2012-2022) - Expert
• VMware vSphere Virtualization - Advanced
• Docker Containerization - Intermediate
• Kubernetes Orchestration - Intermediate

═══════════════════════════════════════════════════════════════
KEY ACHIEVEMENTS & METRICS
═══════════════════════════════════════════════════════════════

🎯 SECURITY IMPACT:
• Protected 5000+ users and thousands of servers including mainframes
• Implemented post-quantum cryptography ahead of industry timeline
• Reduced security incidents by 85% through PAM implementation
• Achieved 99.9% security system uptime across banking operations
• Built and managed SOC serving 15+ enterprise clients

🎯 OPERATIONAL EXCELLENCE:
• Reduced incident response time by 60% through process optimization
• Achieved 98% client satisfaction rating for security services
• Maintained 100% regulatory compliance across all projects
• Led successful migration of 2000+ endpoints with zero security incidents
• Standardized SOE deployment reducing setup time by 70%

🎯 TEAM LEADERSHIP:
• Managed cybersecurity teams of 8+ professionals
• Mentored junior security analysts and engineers
• Led technical recruiting for cybersecurity positions
• Conducted security awareness training for enterprise staff
• Developed security policies and procedures adopted organization-wide

═══════════════════════════════════════════════════════════════
PROFESSIONAL PROJECTS
═══════════════════════════════════════════════════════════════

📰 TODAY CYBER NEWS (https://todaycybernews.sheheryara.bid)
Cybersecurity news platform providing daily updates on:
• Latest cybersecurity threats and vulnerabilities
• Industry trends and regulatory compliance updates
• Security technology reviews and analysis
• Incident response case studies

🤖 TODAY AI NEWS (https://todayainews.sheheryara.bid)
Artificial Intelligence news platform covering:
• AI security implications and considerations
• Machine learning in cybersecurity applications
• AI governance and risk management
• Emerging AI technologies and trends

═══════════════════════════════════════════════════════════════
REFERENCES
═══════════════════════════════════════════════════════════════

Professional references available upon request.

For detailed portfolio and additional information:
🌐 Visit: https://sheheryara.bid
📧 Contact: sher@outlook.co.nz

═══════════════════════════════════════════════════════════════
This CV represents 11+ years of dedicated cybersecurity expertise
focused on protecting critical infrastructure and enterprise assets.
═══════════════════════════════════════════════════════════════
        `;
        
        // Generate PDF with proper HTML structure
        generatePDF(cvContent);
        
        function generatePDF(content) {
            // Create properly formatted HTML for PDF
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        * {
                            background-color: white !important;
                            color: black !important;
                        }
                        body {
                            font-family: 'Times New Roman', serif !important;
                            line-height: 1.5 !important;
                            color: black !important;
                            background: white !important;
                            background-color: white !important;
                            margin: 0 !important;
                            padding: 30px !important;
                            font-size: 11px !important;
                        }
                        html {
                            background: white !important;
                            background-color: white !important;
                        }
                        .header {
                            text-align: center !important;
                            border-bottom: 2px solid black !important;
                            margin-bottom: 25px !important;
                            padding-bottom: 15px !important;
                            background: white !important;
                        }
                        .header h1 {
                            margin: 0 !important;
                            font-size: 22px !important;
                            color: black !important;
                            font-weight: bold !important;
                            text-transform: uppercase !important;
                            background: white !important;
                        }
                        .header h2 {
                            margin: 8px 0 0 0 !important;
                            font-size: 14px !important;
                            color: black !important;
                            font-weight: normal !important;
                            background: white !important;
                        }
                        .section {
                            margin-bottom: 25px;
                        }
                        .section-title {
                            font-size: 14px;
                            font-weight: bold;
                            color: #000000;
                            text-transform: uppercase;
                            border-bottom: 1px solid #000000;
                            margin-bottom: 12px;
                            padding-bottom: 3px;
                        }
                        .job-title {
                            font-weight: bold;
                            color: #000000;
                            font-size: 12px;
                            margin-top: 10px;
                        }
                        .company {
                            color: #000000;
                            font-style: italic;
                            font-size: 11px;
                            margin-bottom: 5px;
                        }
                        .date {
                            color: #000000;
                            font-size: 10px;
                        }
                        .bullet-point {
                            margin-left: 18px;
                            margin-bottom: 4px;
                            color: #000000;
                        }
                        .contact-info {
                            text-align: center;
                            margin-bottom: 25px;
                            color: #000000;
                        }
                        .skills-grid {
                            display: block;
                        }
                        .skills-column {
                            margin-bottom: 15px;
                        }
                        .cert-item {
                            margin-bottom: 6px;
                            color: #000000;
                        }
                        strong {
                            color: #000000 !important;
                        }
                        p {
                            color: black !important;
                            background: white !important;
                        }
                        div {
                            background: white !important;
                        }
                        @media print {
                            * {
                                background: white !important;
                                background-color: white !important;
                                color: black !important;
                                -webkit-print-color-adjust: exact !important;
                                color-adjust: exact !important;
                            }
                            body {
                                background: white !important;
                                background-color: white !important;
                            }
                            html {
                                background: white !important;
                                background-color: white !important;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>SHEHERYAR ABID</h1>
                        <h2>Senior Cyber Security Engineer</h2>
                    </div>
                    
                    <div class="contact-info">
                        <strong>Email: sher@outlook.co.nz | Website: sheheryara.bid | Location: Perth, Australia</strong><br>
                        <strong>Portfolio: todaycybernews.sheheryara.bid | todayainews.sheheryara.bid</strong>
                    </div>

                    <div class="section">
                        <div class="section-title">PROFESSIONAL SUMMARY</div>
                        <p>Seasoned cybersecurity professional with <strong>11+ years</strong> of progressive experience in enterprise security architecture, critical infrastructure protection, and identity management. Proven track record of protecting <strong>5000+ users and thousands of servers</strong> including mainframes across banking, telecommunications, and enterprise sectors.</p>
                        
                        <p><strong>Core Specializations:</strong> Critical Infrastructure Protection, Post-Quantum Cryptography, Identity & Access Management, Cloud Security (Azure, AWS), Zero Trust Architecture, NIST/ISO27001 Compliance, SOC Management, Technical Leadership</p>
                    </div>

                    <div class="section">
                        <div class="section-title">PROFESSIONAL EXPERIENCE</div>
                        
                        <div class="job-title">Information Security Engineer</div>
                        <div class="company">Wilson Group | Perth, Australia | Sep 2024 - Present</div>
                        <div class="bullet-point">• Lead cybersecurity initiatives for critical infrastructure protection across hybrid environments</div>
                        <div class="bullet-point">• Conduct comprehensive security architecture reviews ensuring NIST framework compliance</div>
                        <div class="bullet-point">• Design and implement advanced IAM solutions using Okta Identity Cloud for 1000+ users</div>
                        <div class="bullet-point">• Develop Python-based security automation tools for vulnerability assessment and incident response</div>
                        <div class="bullet-point">• Apply PMBOK methodologies to cybersecurity project delivery and risk assessment</div>
                        <br>

                        <div class="job-title">Cyber Security Operations Manager</div>
                        <div class="company">CyberWatch | Remote - New Zealand | Jan 2022 - Sep 2024</div>
                        <div class="bullet-point">• Managed end-to-end cybersecurity operations for multiple enterprise clients with 24/7 SOC</div>
                        <div class="bullet-point">• Led cybersecurity teams of 8+ professionals, providing mentorship and performance management</div>
                        <div class="bullet-point">• Architected CyberArk PAM solutions with zero-trust access controls for high-risk systems</div>
                        <div class="bullet-point">• Implemented comprehensive identity governance and access certification processes</div>
                        <div class="bullet-point">• Reduced security incident response time by 60% through process optimization</div>
                        <div class="bullet-point">• Built and managed SOC serving 15+ enterprise customers with 99.9% uptime</div>
                        <br>

                        <div class="job-title">Cyber Security Engineer</div>
                        <div class="company">Westpac New Zealand | Auckland | Nov 2020 - Sep 2024</div>
                        <div class="bullet-point">• Protected critical banking infrastructure serving 5000+ users and thousands of servers/mainframes</div>
                        <div class="bullet-point">• Led implementation of post-quantum cryptography solutions for future-proof banking security</div>
                        <div class="bullet-point">• Managed comprehensive vulnerability assessment programs across banking infrastructure</div>
                        <div class="bullet-point">• Administered CyberArk PAM for mainframes, databases, and core banking applications</div>
                        <div class="bullet-point">• Implemented SailPoint IdentityIQ for identity lifecycle management and access controls</div>
                        <div class="bullet-point">• Maintained 100% uptime for core banking security systems</div>
                        <div class="bullet-point">• Achieved full RBNZ regulatory compliance across all security projects</div>
                        <br>

                        <div class="job-title">SOE Engineer (Standard Operating Environment)</div>
                        <div class="company">Fujitsu | Hybrid | Sep 2018 - Oct 2020</div>
                        <div class="bullet-point">• Designed enterprise-grade standard operating environments for multiple clients</div>
                        <div class="bullet-point">• Implemented comprehensive security hardening using CIS benchmarks</div>
                        <div class="bullet-point">• Managed enterprise Linux (RHEL, CentOS, Ubuntu) and Windows Server environments</div>
                        <div class="bullet-point">• Developed automated deployment scripts reducing setup time by 70%</div>
                        <div class="bullet-point">• Achieved 98% client satisfaction rating for SOE services</div>
                        <br>

                        <div class="job-title">Senior Desktop Support Engineer</div>
                        <div class="company">Avis Budget Group | On-site | Jun 2015 - Mar 2018</div>
                        <div class="bullet-point">• Led enterprise desktop support operations for 2000+ endpoints globally</div>
                        <div class="bullet-point">• Administered Active Directory environment and managed technical teams</div>
                        <div class="bullet-point">• Led Windows 10 migration project with zero security incidents</div>
                        <div class="bullet-point">• Implemented endpoint security reducing malware incidents by 80%</div>
                        <br>

                        <div class="job-title">Desktop Support Analyst</div>
                        <div class="company">Avis Budget Group | On-site | Jan 2013 - Apr 2015</div>
                        <div class="bullet-point">• Provided comprehensive desktop support for 1500+ users across business units</div>
                        <div class="bullet-point">• Maintained 95%+ customer satisfaction rating and 98% SLA compliance</div>
                        <div class="bullet-point">• Implemented security best practices contributing to enterprise security posture</div>
                    </div>

                    <div class="section">
                        <div class="section-title">CERTIFICATIONS & CREDENTIALS</div>
                        <div class="cert-item"><strong>ISC2 Candidate</strong> (Dec 2024 - Dec 2025) - International Information System Security Certification</div>
                        <div class="cert-item"><strong>IBM Cybersecurity Architecture</strong> (Jun 2024) - Advanced architecture and design principles</div>
                        <div class="cert-item"><strong>AI Security Specialist</strong> (Apr 2024) - Security for AI Software and Services</div>
                        <div class="cert-item"><strong>Cortex XSOAR Certified</strong> (Mar 2023) - Automation and Orchestration</div>
                        <div class="cert-item"><strong>Zscaler ZIA Administrator</strong> (Mar 2023 - Mar 2026) - Internet Access Security</div>
                        <div class="cert-item"><strong>AWS Solutions Architect</strong> (2021) - Multiple AWS Associate certifications</div>
                        <div class="cert-item"><strong>CISA Training</strong> (2021) - Data Privacy, IAM, IT Frameworks, PKI & Data Protection</div>
                    </div>

                    <div class="section">
                        <div class="section-title">TECHNICAL EXPERTISE</div>
                        
                        <div class="skills-column">
                            <strong>Security Frameworks:</strong> NIST Cybersecurity Framework, ISO27001, ASD Essential 8, CIS Critical Security Controls, RBNZ Banking Compliance
                        </div>
                        
                        <div class="skills-column">
                            <strong>Identity & Access Management:</strong> Okta Identity Cloud, CyberArk PAM, SailPoint IdentityIQ, Microsoft Active Directory, Zero Trust Architecture
                        </div>
                        
                        <div class="skills-column">
                            <strong>Cloud Security:</strong> Microsoft Azure Security, AWS Security & Compliance, Container Security (Docker/Kubernetes), CSPM, Infrastructure as Code
                        </div>
                        
                        <div class="skills-column">
                            <strong>Security Technologies:</strong> Post-Quantum Cryptography, SIEM/SOAR Platforms, Vulnerability Management, Web Application Firewalls, Penetration Testing
                        </div>
                        
                        <div class="skills-column">
                            <strong>Programming & Automation:</strong> Python Security Scripting, PowerShell Automation, Bash Scripting, Linux/Windows Administration, Security Orchestration
                        </div>
                        
                        <div class="skills-column">
                            <strong>Cryptography & PKI:</strong> DigiCert SSL/TLS Management, Digital Certificate Lifecycle, Hardware Security Modules, Encryption Key Management
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">KEY ACHIEVEMENTS</div>
                        <div class="bullet-point">Protected 5000+ users and thousands of servers including mainframes across banking infrastructure</div>
                        <div class="bullet-point">Implemented post-quantum cryptography solutions ahead of industry timeline</div>
                        <div class="bullet-point">Reduced security incidents by 85% through privileged access management implementation</div>
                        <div class="bullet-point">Built and managed Security Operations Center serving 15+ enterprise clients</div>
                        <div class="bullet-point">Achieved 99.9% security system uptime across critical banking operations</div>
                        <div class="bullet-point">Led cybersecurity teams of 8+ professionals with mentorship and performance management</div>
                        <div class="bullet-point">Maintained 100% regulatory compliance across all security projects and audits</div>
                        <div class="bullet-point">Developed cybersecurity news platforms demonstrating thought leadership in the field</div>
                    </div>

                    <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #000000;">
                        <strong>Professional references available upon request</strong><br>
                        For detailed portfolio: sheheryara.bid | Contact: sher@outlook.co.nz
                    </div>
                </body>
                </html>
            `;

            // Create a new window for PDF generation
            const printWindow = window.open('', '_blank');
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            
            // Wait for content to load then generate PDF
            setTimeout(() => {
                if (typeof html2pdf !== 'undefined') {
                    const opt = {
                        margin: [10, 10, 10, 10],
                        filename: 'Sheheryar_Abid_Senior_Cybersecurity_Engineer_CV.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { 
                            scale: 1.5, 
                            useCORS: true,
                            backgroundColor: '#ffffff',
                            allowTaint: true,
                            logging: false
                        },
                        jsPDF: { 
                            unit: 'mm', 
                            format: 'a4', 
                            orientation: 'portrait',
                            putOnlyUsedFonts: true,
                            floatPrecision: 16
                        }
                    };
                    
                    html2pdf().set(opt).from(printWindow.document.body).save().then(() => {
                        printWindow.close();
                    }).catch(() => {
                        // Fallback to print dialog
                        printWindow.print();
                        setTimeout(() => printWindow.close(), 1000);
                    });
                } else {
                    // Fallback to browser print dialog
                    printWindow.print();
                    setTimeout(() => printWindow.close(), 1000);
                }
            }, 500);
        }
        
        // Success state
        button.innerHTML = '<i class="fas fa-check"></i> CV Downloaded Successfully';
        
        // Reset button after delay
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 3000);
        
    }, 2000);
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