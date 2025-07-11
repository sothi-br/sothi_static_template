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

    // Variáveis de estado para a cor do tema
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
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(sec => sectionObserver.observe(sec));

    /**
     * ===================================================================
     * 3. SCRIPT DE ANIMAÇÃO DE LOGOS E TEMA (REFINADO)
     * ===================================================================
     */
    function logoAndThemeAnimation() {
        const headerLogoContainer = document.getElementById('header-logo-container');
        const allNavLogos = document.querySelectorAll('.header-logo');

        const animationConfig = {
            introDelay: 1200,
            logoDisplayTime: 2800,
            finalFixDelay: 500
        };

        // NOVA PALETA DE CORES PARA O TEMA ESCURO
        const themeHolding = {
            heroId: 'hero-logo-holding',
            navId: 'nav-logo-holding-start',
         //   color: '#4952de', // Azul principal (mantido)
              color: '#04a05c', // Azul principal (mantido)
          hue: 231
        };

        const themeSegmento1 = {
            heroId: 'hero-logo1',
            navId: 'nav-logo1',
            color: '#2196F3', // Azul vibrante (novo) 
            hue: 207
        };

        const themeSegmento2 = {
            heroId: 'hero-logo2',
            navId: 'nav-logo2',
            color: '#6b6363', // Prata/Cinza claro para "Tecnologia" (novo)
            hue: 0
        };

        const introSequenceThemes = [
            themeHolding,
            themeSegmento1,
            themeSegmento2,
        ];

        let isInitialAnimationComplete = false;
        let currentNavId = null;
        let hoverInterval = null;

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

        function updateTheme(theme) {
            root.style.setProperty('--primary-accent-hue', theme.hue);
            root.style.setProperty('--primary-accent', theme.color);
            root.style.setProperty('--primary-accent-hover', lightenHex(theme.color, 10));
            particlePrimaryColor = theme.color;
            particleLineColor = `hsla(${theme.hue}, 100%, 57%, 0.5)`;
        }

        function setActiveNavLogo(newActiveId) {
            if (currentNavId === newActiveId) return;
            const oldLogo = document.getElementById(currentNavId);
            if (oldLogo) {
                oldLogo.classList.remove('active-logo');
                oldLogo.classList.add('exit-left');
                oldLogo.addEventListener('transitionend', function handler() {
                    oldLogo.classList.remove('exit-left');
                    oldLogo.removeEventListener('transitionend', handler);
                });
            }
            const newLogo = document.getElementById(newActiveId);
            if (newLogo) {
                newLogo.classList.remove('exit-left');
                newLogo.classList.add('active-logo');
            }
            currentNavId = newActiveId;
        }

        async function runIntroSequence() {
            await delay(animationConfig.introDelay);
            for (const theme of introSequenceThemes) {
                const heroLogoElement = document.getElementById(theme.heroId);
                updateTheme(theme);
                setActiveNavLogo(theme.navId);
                heroLogoElement.classList.add('enter');
                await delay(animationConfig.logoDisplayTime);
                heroLogoElement.classList.remove('enter');
                heroLogoElement.classList.add('exit');
                await delay(500);
            }
            await delay(animationConfig.finalFixDelay);
            updateTheme(themeHolding);
            setActiveNavLogo(themeHolding.navId);
            const holdingLogoHero = document.getElementById(themeHolding.heroId);
            holdingLogoHero.classList.add('show-fixed');
            isInitialAnimationComplete = true;
            setupHoverListeners();
        }

        function setupHoverListeners() {
            const allThemesForHover = [themeHolding, themeSegmento1, themeSegmento2];
            let hoverIndex = 0;
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
                hoverIndex = 0;
            });
        }

        function init() {
            updateTheme(themeHolding);
            setActiveNavLogo(themeHolding.navId);
            runIntroSequence();
        }

        init();
    }

    /**
     * ===================================================================
     * 4. INICIALIZAÇÃO DOS SCRIPTS
     * ===================================================================
     */
    logoAndThemeAnimation();

});