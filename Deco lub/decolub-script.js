// ==========================================
// DECO LUB - JAVASCRIPT
// ==========================================

// LOADING SCREEN
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1000);
});

// NAVBAR
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

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    navMenu.classList.contains('active') 
        ? animateMenuOpen(spans)
        : animateMenuClose(spans);
});

function animateMenuOpen(spans) {
    spans[0].style.transform = 'rotate(45deg) translateY(8px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
}

function animateMenuClose(spans) {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// Close menu on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        animateMenuClose(navToggle.querySelectorAll('span'));
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

// HORÁRIO DE FUNCIONAMENTO - STATUS
function checkBusinessHours() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda, etc
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    const schedule = {
        0: null, // Domingo - Fechado
        1: { open: 7.75, close: 19 }, // Segunda
        2: { open: 7.75, close: 19 }, // Terça
        3: { open: 7.75, close: 19 }, // Quarta
        4: { open: 7.75, close: 18.5 }, // Quinta
        5: { open: 7.75, close: 19 }, // Sexta
        6: { open: 8, close: 14 }  // Sábado
    };

    const statusBadge = document.getElementById('statusBadge');
    const statusDot = statusBadge.querySelector('.status-dot');
    const statusText = statusBadge.querySelector('span');

    if (!schedule[day]) {
        // Fechado aos domingos
        statusBadge.className = 'status-badge closed';
        statusText.textContent = 'Fechado agora';
        return;
    }

    const todaySchedule = schedule[day];
    
    if (currentTime >= todaySchedule.open && currentTime < todaySchedule.close) {
        // Aberto
        statusBadge.className = 'status-badge open';
        statusText.textContent = 'Aberto agora';
    } else {
        // Fechado
        statusBadge.className = 'status-badge closed';
        if (currentTime < todaySchedule.open) {
            const openTime = formatTime(todaySchedule.open);
            statusText.textContent = `Abre às ${openTime}`;
        } else {
            statusText.textContent = 'Fechado agora';
        }
    }
}

function formatTime(decimalTime) {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Verificar status ao carregar e a cada minuto
checkBusinessHours();
setInterval(checkBusinessHours, 60000);

// BACK TO TOP BUTTON
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// SCROLL REVEAL ANIMATION
function revealOnScroll() {
    const elements = document.querySelectorAll('.service-card, .diff-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Preparar elementos para animação
document.querySelectorAll('.service-card, .diff-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Executar ao carregar

// ANALYTICS (opcional)
function trackWhatsAppClick() {
    // Aqui você pode adicionar Google Analytics ou similar
    console.log('WhatsApp clicked');
}

// Adicionar tracking aos botões do WhatsApp
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', trackWhatsAppClick);
});

// PERFORMANCE: Lazy load de imagens (se houver)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback para navegadores antigos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// CONSOLE MESSAGE
console.log('%c🔧 DECO LUB', 'font-size: 24px; font-weight: bold; color: #FF6B00;');
console.log('%cSite desenvolvido com ❤️', 'font-size: 14px; color: #666;');

// PRELOAD CRITICAL RESOURCES
function preloadResources() {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
}

preloadResources();

// ERROR HANDLING
window.addEventListener('error', (e) => {
    console.error('Erro capturado:', e.message);
});

// SERVICE WORKER (Progressive Web App - opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registrado'))
        //     .catch(err => console.log('Erro no Service Worker:', err));
    });
}