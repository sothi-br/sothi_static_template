document.addEventListener('DOMContentLoaded', function() {
    
    // --- OBSERVER PARA ANIMAÇÕES DE SCROLL ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Inicia o contador se o elemento for um contador
                    if (entry.target.classList.contains('counter')) {
                        startCounter(entry.target);
                    }
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    // --- LÓGICA DO HEADER, MENU MOBILE E NAVEGAÇÃO ATIVA ---
    const header = document.getElementById('main-header');
    const navMenu = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section[id]');

    // Efeito do header ao rolar
    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        backToTopButton.classList.toggle('visible', window.scrollY > 400);

        // Lógica para link de navegação ativo
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (header.offsetHeight + 50)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);

    // Abrir menu mobile
    navToggle.addEventListener('click', () => {
        navMenu.dataset.visible = 'true';
        document.body.classList.add('nav-open');
    });

    // Fechar menu mobile
    const closeMenu = () => {
        navMenu.dataset.visible = 'false';
        document.body.classList.remove('nav-open');
    };
    
    navClose.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));


    // --- EFEITO DE DIGITAÇÃO ---
    if (document.getElementById('typing-headline')) {
        new TypeIt("#typing-headline", {
            strings: "Transformando Desafios em Oportunidades.",
            speed: 75,
            waitUntilVisible: true, 
            cursorChar: '▋',
            cursorSpeed: 1200,
            lifeLike: true,
        }).go();
    }
    
    // --- ANIMAÇÃO DO CONTADOR NUMÉRICO ---
    function startCounter(element) {
        const target = +element.dataset.target;
        let count = 0;
        const duration = 2000; // 2 segundos
        const stepTime = Math.abs(Math.floor(duration / target));

        const timer = setInterval(() => {
            count++;
            element.textContent = count;
            if (count === target) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    
    // --- SCRIPT DO FUNDO NEURAL (PARTÍCULAS) ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth > 768 ? 100 : 40;
        const maxDistance = 120;
        const particleColor = 'rgba(255, 255, 255, 0.7)';
        const lineColor = 'rgba(255, 255, 255, 0.15)';

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 1,
                });
            }
        };

        const draw = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });

            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        };
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setCanvasSize();
                createParticles();
            }, 250);
        });
        
        setCanvasSize();
        createParticles();
        draw();
    }
});