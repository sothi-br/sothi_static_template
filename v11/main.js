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
     * 3. SCRIPT DE ANIMAÇÃO DE LOGOS E TEMA (LÓGICA SIMPLIFICADA)
     * ===================================================================
     */
    function logoAndThemeAnimation() {
        const headerLogoContainer = document.getElementById('header-logo-container');

        const animationConfig = {
            introDelay: 1200,
            logoDisplayTime: 2800,
        };

        const themeHolding = {
            heroId: 'hero-logo-holding',
            navId: 'nav-logo-holding-start',
            color: '#04a05c', hue: 151
        };
        const themeSegmento1 = {
            heroId: 'hero-logo1',
            navId: 'nav-logo1',
            color: '#2196F3', hue: 207
        };
        const themeSegmento2 = {
            heroId: 'hero-logo2',
            navId: 'nav-logo2',
            color: '#333333', hue: 0, saturation: 0
        };

        const introSequenceThemes = [ themeHolding, themeSegmento1, themeSegmento2 ];
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
            if (theme.saturation !== undefined) {
                root.style.setProperty('--primary-accent', `hsl(${theme.hue}, ${theme.saturation}%, 40%)`);
                root.style.setProperty('--primary-accent-hover', `hsl(${theme.hue}, ${theme.saturation}%, 50%)`);
            } else {
                root.style.setProperty('--primary-accent', theme.color);
                root.style.setProperty('--primary-accent-hover', lightenHex(theme.color, 10));
            }
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
            
            // Roda a sequência de entrada e saída para todas as logos
            for (const theme of introSequenceThemes) {
                const heroLogoElement = document.getElementById(theme.heroId);
                updateTheme(theme);
                setActiveNavLogo(theme.navId);
                heroLogoElement.classList.remove('exit'); // Garante que não está saindo
                heroLogoElement.classList.add('enter');
                await delay(animationConfig.logoDisplayTime);
                heroLogoElement.classList.remove('enter');
                heroLogoElement.classList.add('exit');
                await delay(500); // Espera a animação de saída começar
            }
            
            // ============================================================
            // NOVA LÓGICA FINAL - REUTILIZA A ANIMAÇÃO DE ENTRADA
            // ============================================================
            // Em vez de fixar com uma classe nova, fazemos a logo da holding
            // entrar uma última vez e a deixamos na tela.

            const holdingLogoHero = document.getElementById(themeHolding.heroId);
            
            updateTheme(themeHolding);
            setActiveNavLogo(themeHolding.navId);
            
            // Remove a classe de saída para a transição de entrada funcionar
            holdingLogoHero.classList.remove('exit');
            
            // Pequeno delay para o navegador processar a remoção da classe
            await delay(50); 
            
            // Re-adiciona a classe 'enter' para a posição final, que agora será idêntica à inicial
            holdingLogoHero.classList.add('enter');
            
            // Aplica a animação 'float' após a transição de entrada terminar (1s)
            setTimeout(() => {
                if (holdingLogoHero.classList.contains('enter')) { // Checa se a logo ainda está na tela
                     holdingLogoHero.style.animation = 'float 6s ease-in-out infinite';
                }
            }, 1000);

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
    
    logoAndThemeAnimation();
});