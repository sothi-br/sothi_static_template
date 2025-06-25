document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: UI BÁSICA ---
    // Gerencia o menu mobile, header dinâmico, scroll-up e links de navegação.
    function setupBasicUI() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navClose = document.getElementById('nav-close');
        const header = document.getElementById('header');
        const scrollUp = document.getElementById('scroll-up');
        const navLinks = document.querySelectorAll('.nav-link');

        // Abrir/Fechar menu mobile
        if (navToggle) {
            navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
        }
        if (navClose) {
            navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
        }
        navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('show-menu')));

        // Header dinâmico (esconde ao rolar para baixo, mostra ao rolar para cima)
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 0) {
                header.classList.remove('header-hidden');
            }
            if (currentScroll > lastScroll && !header.classList.contains('header-hidden')) {
                header.classList.add('header-hidden');
            }
            if (currentScroll < lastScroll && header.classList.contains('header-hidden')) {
                header.classList.remove('header-hidden');
            }
            lastScroll = currentScroll;

            // Header shadow e botão scroll-up
            const isScrolled = window.scrollY >= 50;
            header.classList.toggle('shadow-header', isScrolled);
            if (scrollUp) scrollUp.classList.toggle('show-scroll', isScrolled);
        });

        // Atualizar ano no rodapé
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    // --- MÓDULO 2: CURSOR PERSONALIZADO ---
    function setupCustomCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        const interactiveElements = document.querySelectorAll('a, button, .nav-toggle');

        window.addEventListener('mousemove', e => {
            const { clientX, clientY } = e;
            gsap.to(cursorDot, { x: clientX, y: clientY, duration: 0.2, ease: 'power2.out' });
            gsap.to(cursorOutline, { x: clientX, y: clientY, duration: 0.6, ease: 'power2.out' });
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-interact'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-interact'));
        });
    }

    // --- MÓDULO 3: PARTÍCULAS INTERATIVAS (CANVAS) ---
    function setupParticleCanvas() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 1;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.color = 'rgba(136, 146, 176, 0.5)';
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();
    }

    // --- MÓDULO 4: ANIMAÇÕES DA PÁGINA COM GSAP ---
    function setupPageAnimations() {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        // Deixa os elementos invisíveis antes da animação
        gsap.set(".gsap-stagger-container, [data-gsap-anim], [data-gsap-split]", { autoAlpha: 0 });

        // Animação inicial do Hero
        const heroTl = gsap.timeline({ delay: 0.5 });
        const heroTitle = new SplitText('[data-gsap-split="chars"]', { type: "chars" });
        
        heroTl.from(heroTitle.chars, {
                autoAlpha: 0,
                y: 30,
                duration: 1,
                ease: 'power4.out',
                stagger: { each: 0.03, from: "random" }
            })
            .to('[data-gsap-anim="fade-up"]', {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'expo.out'
            }, "-=0.8");

        // Animações de Scroll
        gsap.utils.toArray('.gsap-stagger-container').forEach(container => {
            gsap.to(container, {
                scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' },
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                onStart: () => gsap.set(container, { y: 50 })
            });
        });

        gsap.utils.toArray('[data-gsap-anim="fade-up"]').forEach(el => {
             if(el.closest('.hero-content')) return;
             gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 90%' },
                y: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out',
                onStart: () => gsap.set(el, { y: 50 })
             });
        });
        
        gsap.to('[data-gsap-anim="fade-left"]', {
            scrollTrigger: { trigger: '[data-gsap-anim="fade-left"]', start: 'top 80%' },
            x: 0, autoAlpha: 1, duration: 1.5, ease: 'expo.out',
            onStart: () => gsap.set('[data-gsap-anim="fade-left"]', { x: -50 })
        });

        gsap.utils.toArray('[data-gsap-split="words"]').forEach(el => {
            const split = new SplitText(el, { type: "words" });
            gsap.from(split.words, {
                scrollTrigger: { trigger: el, start: 'top 85%' },
                y: 30,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: 'power3.out'
            });
        });
        
        // Ativar links de navegação com ScrollTrigger
        gsap.utils.toArray("section[id]").forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onToggle: self => {
                    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
                    if(link) link.classList.toggle("active-link", self.isActive);
                }
            });
        });
    }

    // --- MÓDULO 5: ANIMAÇÃO DE LOGO E TEMA (COM GSAP) ---
    function logoAndThemeAnimation() {
        const themes = {
            segmento1: { heroId: '#hero-logo1', navId: '#nav-logo1', color: '#00A8F3' },
            segmento2: { heroId: '#hero-logo2', navId: '#nav-logo2', color: '#F31B93' },
            holding: { heroId: '#hero-logo-holding', navId: '#nav-logo-holding-start', color: '#7DF9FF' }
        };

        const updateTheme = (color) => {
            gsap.to(':root', { 
                '--accent-color': color,
                '--accent-color-hover': gsap.utils.interpolate(color, '#FFF', 0.2),
                duration: 0.5, 
                ease: 'power2.inOut' 
            });
        };

        const sequenceTl = gsap.timeline({
            delay: 4, 
            repeat: -1,
            repeatDelay: 3
        });

        // Estado inicial
        gsap.set(themes.holding.heroId, { autoAlpha: 1, scale: 1 });
        gsap.set(themes.holding.navId, { xPercent: 0, autoAlpha: 1 });
        updateTheme(themes.holding.color);

        const sequence = [themes.segmento1, themes.segmento2, themes.holding];
        let previousTheme = themes.holding;

        sequence.forEach(theme => {
            sequenceTl.to(previousTheme.heroId, { autoAlpha: 0, scale: 0.8, duration: 0.8, ease: 'power3.in' }, `+=${2.5}`)
                      .call(updateTheme, [theme.color], "<")
                      .to(previousTheme.navId, { xPercent: -100, autoAlpha: 0, duration: 0.8, ease: 'power3.in' }, "<")
                      .fromTo(theme.heroId, { autoAlpha: 0, scale: 1.2 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, ">-0.2")
                      .fromTo(theme.navId, { xPercent: 100, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, "<");

            previousTheme = theme;
        });
    }

    // --- INICIALIZAÇÃO GERAL ---
    function init() {
        setupBasicUI();
        setupCustomCursor();
        setupParticleCanvas();
        setupPageAnimations();
        logoAndThemeAnimation();
    }
    
    // Executa tudo!
    init();
});