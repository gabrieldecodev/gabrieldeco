// ==========================================
// GABRIEL DECO BELENTANI - PORTFOLIO JS
// ==========================================

// CURSOR CUSTOMIZADO
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        cursorDot.style.left = x + 'px';
        cursorDot.style.top = y + 'px';
        
        cursorOutline.style.left = x + 'px';
        cursorOutline.style.top = y + 'px';
    });

    // Aumentar cursor em elementos clicáveis
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '50px';
            cursorOutline.style.height = '50px';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '30px';
            cursorOutline.style.height = '30px';
        });
    });
}

// PARTICLES BACKGROUND
function createParticles() {
    const particles = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particles.appendChild(particle);
    }
}

createParticles();

// NAVIGATION
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// TYPING EFFECT
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);
}

// SCROLL REVEAL ANIMATION
function revealOnScroll() {
    const elements = document.querySelectorAll('.project-card, .other-project, .skill-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Preparar elementos
document.querySelectorAll('.project-card, .other-project, .skill-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// GLITCH EFFECT ON GREETING
const greeting = document.querySelector('.hero-greeting');
if (greeting) {
    setInterval(() => {
        greeting.style.textShadow = `
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(100, 255, 218, 0.3),
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 217, 255, 0.3)
        `;
        
        setTimeout(() => {
            greeting.style.textShadow = 'none';
        }, 50);
    }, 3000);
}

// PROJECT CARDS TILT EFFECT
if (window.innerWidth > 768) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// EASTER EGG - KONAMI CODE
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > 10) {
        konamiCode.shift();
    }
    
    if (konamiCode.toString() === konamiSequence.toString()) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = 'none';
        }, 5000);
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ANALYTICS (opcional)
function trackEvent(action, label) {
    console.log('Event:', action, label);
    // Aqui você pode adicionar Google Analytics ou similar
}

document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('click', 'project_link');
    });
});

document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', () => {
        trackEvent('click', 'contact_method');
    });
});

// PERFORMANCE OBSERVER
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('Performance:', entry.name, entry.duration);
        }
    });
    
    observer.observe({ entryTypes: ['navigation', 'resource'] });
}

// CONSOLE MESSAGE
console.log('%c👋 Olá, Dev!', 'font-size: 24px; font-weight: bold; color: #64ffda;');
console.log('%cVocê encontrou o console! 🎉', 'font-size: 16px; color: #8892b0;');
console.log('%cGostou do portfólio? Vamos conversar!', 'font-size: 14px; color: #00d9ff;');
console.log('%cWhatsApp: (16) 99603-7466', 'font-size: 12px; color: #ccd6f6;');

// LOADING COMPLETE
window.addEventListener('load', () => {
    console.log('✅ Portfólio carregado com sucesso!');
});

// ERROR HANDLING
window.addEventListener('error', (e) => {
    console.error('❌ Erro capturado:', e.message);
});