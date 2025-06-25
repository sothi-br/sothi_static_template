document.addEventListener('DOMContentLoaded', function() {

    /**
     * ===================================================================
     * 1. SELETORES E VARIÁVEIS GLOBAIS
     * ===================================================================
     */
    const root = document.documentElement;
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.getElementById('back-to-top');
    const currentYearSpan = document.getElementById('current-year');
    const canvas = document.getElementById('particle-canvas');

    // Variáveis de estado
    let particlePrimaryColor = getComputedStyle(root).getPropertyValue('--primary-accent').trim();
    let particleLineColor = `hsla(${getComputedStyle(root).getPropertyValue('--primary-accent-hue')}, 100%, 57%, 0.5)`;

    /**
     * ===================================================================
     * 2. SCRIPTS GERAIS DA UI (MENU, SCROLL, OBSERVERS)
     * ===================================================================
     */

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const openMenu = () => {
        navMenu.setAttribute('data-visible', 'true');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-open');
    };
    const closeMenu = () => {
        navMenu.setAttribute('data-visible', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    };
    if (navToggle) navToggle.addEventListener('click', openMenu);
    if (navClose) navClose.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        backToTopButton.classList.toggle('visible', window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    const animatedElements = document.querySelectorAll('.animated-item, .reveal-up');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => animationObserver.observe(el));

    const sections = document.querySelectorAll('section[id]');
   const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { // Remova a condição intersectionRatio >= 0.5
            const activeId = entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { rootMargin: '-50% 0px -50% 0px' }); // Ajuste este valor
sections.forEach(sec => sectionObserver.observe(sec));


    /**
     * ===================================================================
     * 3. SCRIPT DE PARTÍCULAS
     * ===================================================================
     */
    function particleScript() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;
        const connectionDistance = 70;

        // Adicione esta linha para aplicar o filtro de desfoque ao canvas
        // Você pode ajustar o valor '2px' para mais ou menos desfoque
        canvas.style.filter = 'blur(0.5px)';

        const setCanvasSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = Math.random() * 1 - 0.5;
                this.vy = Math.random() * 1 - 0.5;
                this.radius = Math.random() * 2 + 1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = particlePrimaryColor;
                ctx.fill();
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
        }

        const init = () => {
            setCanvasSize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = 1 - distance / connectionDistance;
                        ctx.strokeStyle = particleLineColor.replace(/,\s*\d?\.?\d*\)/, `, ${opacity})`);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animateParticles);
        };

        init();
        animateParticles();
        window.addEventListener('resize', init);
    }


    /**
     * ===================================================================
     * 4. SCRIPT DE ANIMAÇÃO DE LOGOS E TEMA (REFINADO)
     * ===================================================================
     */
    function logoAndThemeAnimation() {
        // --- Elementos da Animação ---
        const headerLogoContainer = document.getElementById('header-logo-container');
        const allNavLogos = document.querySelectorAll('.header-logo'); // Now this selection will be simpler

        // --- Objeto de Configuração da Animação ---
        const animationConfig = {
            introDelay: 1200,      // Tempo ANTES da primeira animação começar
            logoDisplayTime: 2800, // Quanto tempo CADA logo fica na tela
            finalFixDelay: 500     // Pequeno atraso antes de fixar a logo final
        };

        // --- Definição dos Temas ---
        const themeSegmento1 = { heroId: 'hero-logo1', navId: 'nav-logo1', color: '#00007e', hue: 240 };
        const themeSegmento2 = { heroId: 'hero-logo2', navId: 'nav-logo2', color: '#00000e', hue: 240 };

        // IMPORTANT: Ensure this theme references the *correct* nav holding logo ID
        const themeHolding = {
            heroId: 'hero-logo-holding',
            navId: 'nav-logo-holding-start', // This should be the ID of your main holding logo in the nav
            color: '#4952de',
            hue: 231
        };

        // ======================================================================================
        // PONTO CHAVE DA MUDANÇA: A sequência de introdução.
        // A animação agora começará com a holding, ficará por `logoDisplayTime` e depois continuará.
        const introSequenceThemes = [
            themeHolding,      // 1º Passo: Começa e permanece na Holding
            themeSegmento1,    // 2º Passo: Vai para o Segmento 1
            themeSegmento2,    // 3º Passo: Vai para o Segmento 2
        ];
        // ======================================================================================

        // --- Variáveis de Estado da Animação ---
        let isInitialAnimationComplete = false;
        let currentNavId = null;
        let hoverInterval = null;

        // --- Funções Auxiliares ---
        const delay = ms => new Promise(res => setTimeout(res, ms));
        function lightenHex(hex, percent) {
            hex = hex.replace(/^\s*#|\s*$/g, '');
            if (hex.length === 3) { hex = hex.replace(/(.)/g, '$1$1'); }
            const r = parseInt(hex.substr(0, 2), 16),
                g = parseInt(hex.substr(2, 2), 16),
                b = parseInt(hex.substr(4, 2), 16);
            const newR = Math.min(255, r + Math.floor(255 * (percent / 100)));
            const newG = Math.min(255, g + Math.floor(255 * (percent / 100)));
            const newB = Math.min(255, b + Math.floor(255 * (percent / 100)));
            return '#' + newR.toString(16).padStart(2, '0') + newG.toString(16).padStart(2, '0') + newB.toString(16).padStart(2, '0');
        }

        // --- Funções Principais da Animação ---
        function updateTheme(theme) {
            root.style.setProperty('--primary-accent-hue', theme.hue);
            root.style.setProperty('--primary-accent', theme.color);
            root.style.setProperty('--primary-accent-hover', lightenHex(theme.color, 10));
            particlePrimaryColor = theme.color;
            particleLineColor = `hsla(${theme.hue}, 100%, 57%, 0.5)`;
        }

        function setActiveNavLogo(newActiveId) {
            if (currentNavId === newActiveId) return; // Prevent unnecessary updates

            // Deactivate the currently active logo
            const oldLogo = document.getElementById(currentNavId);
            if (oldLogo) {
                oldLogo.classList.remove('active-logo');
                oldLogo.classList.add('exit-left');
                // Remove 'exit-left' after the transition to keep it clean
                oldLogo.addEventListener('transitionend', function handler() {
                    oldLogo.classList.remove('exit-left');
                    oldLogo.removeEventListener('transitionend', handler);
                });
            }

            // Activate the new logo
            const newLogo = document.getElementById(newActiveId);
            if (newLogo) {
                newLogo.classList.remove('exit-left'); // Ensure it's not starting from -100% if it was exiting
                newLogo.classList.add('active-logo');
            }
            currentNavId = newActiveId;
        }

        async function runIntroSequence() {
            // Aguarda o delay inicial antes de tudo
            await delay(animationConfig.introDelay);

            // O loop agora usa a nova sequência, que começa com a Holding
            for (const theme of introSequenceThemes) {
                const heroLogoElement = document.getElementById(theme.heroId);

                updateTheme(theme);
                setActiveNavLogo(theme.navId); // Update the nav logo

                heroLogoElement.classList.add('enter');
                await delay(animationConfig.logoDisplayTime); // Permanece na logo atual

                heroLogoElement.classList.remove('enter');
                heroLogoElement.classList.add('exit');
                await delay(500); // Aguarda a transição de saída do logo do HERO
            }

            // Animação final: restaura tema da holding e fixa a logo
            await delay(animationConfig.finalFixDelay);
            updateTheme(themeHolding);
            setActiveNavLogo(themeHolding.navId); // Sets nav-logo-holding-start as active again

            const holdingLogoHero = document.getElementById(themeHolding.heroId);
            holdingLogoHero.classList.add('show-fixed');

            isInitialAnimationComplete = true;
            setupHoverListeners();
        }

        function setupHoverListeners() {
            const allThemesForHover = [themeHolding, themeSegmento1, themeSegmento2];
            let hoverIndex = 0; // O índice sempre começará na holding

            headerLogoContainer.addEventListener('mouseenter', () => {
                if (!isInitialAnimationComplete) return;
                clearInterval(hoverInterval);
                hoverInterval = setInterval(() => {
                    hoverIndex = (hoverIndex + 1) % allThemesForHover.length;
                    const currentHoverTheme = allThemesForHover[hoverIndex];
                    updateTheme(currentHoverTheme);
                    setActiveNavLogo(currentHoverTheme.navId);
                }, 1000);
            });

            headerLogoContainer.addEventListener('mouseleave', () => {
                if (!isInitialAnimationComplete) return;
                clearInterval(hoverInterval);
                hoverInterval = null;
                updateTheme(themeHolding);
                setActiveNavLogo(themeHolding.navId);
                hoverIndex = 0; // Reseta o índice
            });
        }

        function init() {
            // Garante que o estado inicial seja o da Holding
            updateTheme(themeHolding);
            // Initially set the holding logo as active in the nav
            setActiveNavLogo(themeHolding.navId);
            // Ensure all logos start ready for animation (no 'exit-left' initially)
            // The setActiveNavLogo function now manages the removal of 'exit-left'
            // no need for this specific line here
            // allNavLogos.forEach(logo => logo.classList.remove('exit-left'));

            // Inicia a sequência
            runIntroSequence();
        }

        init();
    }
    /**
     * ===================================================================
     * 5. INICIALIZAÇÃO DOS SCRIPTS
     * ===================================================================
     */
    particleScript();
    logoAndThemeAnimation();

});