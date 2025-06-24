document.addEventListener('DOMContentLoaded', function() {

    /**
     * ===================================================================
     * 1. SCRIPTS GERAIS DA UI (MENU, SCROLL, OBSERVERS)
     * ===================================================================
     */
    const navMenu = document.getElementById('nav-menu'),
          navToggle = document.getElementById('nav-toggle'),
          navClose = document.getElementById('nav-close');

    if(navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
            document.body.classList.add('nav-open');
        });
    }
    if(navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            document.body.classList.remove('nav-open');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    const linkAction = () => {
        navMenu.classList.remove('show-menu');
        document.body.classList.remove('nav-open');
    }
    navLinks.forEach(n => n.addEventListener('click', linkAction));

    const header = document.getElementById('header');
    const scrollUp = document.getElementById('scroll-up');
    const scrollAction = () => {
        const isScrolled = window.scrollY >= 50;
        header.classList.toggle('shadow-header', isScrolled);
        if(scrollUp) scrollUp.classList.toggle('show-scroll', isScrolled);
    }
    window.addEventListener('scroll', scrollAction);

    const sections = document.querySelectorAll('section[id]');
    const scrollActive = () => {
        const scrollDown = window.scrollY;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 58;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
            
            if(link) {
                if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
                    link.classList.add('active-link');
                } else {
                    link.classList.remove('active-link');
                }
            }                                           
        });
    }
    window.addEventListener('scroll', scrollActive);
    
    const sr = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                sr.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => sr.observe(el));

    const currentYearSpan = document.getElementById('current-year');
    if(currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    /**
     * ===================================================================
     * 2. SCRIPT DE ANIMAÇÃO DE LOGOS E TEMA
     * ===================================================================
     */
    function logoAndThemeAnimation() {
        const root = document.documentElement;
        
        const animationConfig = {
            introDelay: 1200,
            logoDisplayTime: 2800,
            finalFixDelay: 500
        };

        // Definição dos temas (ajuste cores e IDs conforme seus arquivos)
        const themeSegmento1 = { heroId: 'hero-logo1', navId: 'nav-logo1', color: '#00007e' };
        const themeSegmento2 = { heroId: 'hero-logo2', navId: 'nav-logo2', color: '#00000e' };
        const themeHolding = { heroId: 'hero-logo-holding', navId: 'nav-logo-holding-start', color: '#4952de' };

        const introSequenceThemes = [ themeHolding, themeSegmento1, themeSegmento2 ];
        
        let currentNavId = null;

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
            // Mapeia para as variáveis CSS do novo layout
            root.style.setProperty('--accent-color', theme.color);
            root.style.setProperty('--accent-color-hover', lightenHex(theme.color, 10));
        }

        function setActiveNavLogo(newActiveId) {
            if (currentNavId === newActiveId) return;
            
            const oldLogo = document.getElementById(currentNavId);
            if (oldLogo) {
                oldLogo.classList.remove('active-logo');
                oldLogo.classList.add('exit-left');
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
                
                if(heroLogoElement) {
                    heroLogoElement.classList.add('enter');
                    await delay(animationConfig.logoDisplayTime);
                    heroLogoElement.classList.remove('enter');
                    heroLogoElement.classList.add('exit');
                    await delay(500);
                }
            }

            await delay(animationConfig.finalFixDelay);
            updateTheme(themeHolding);
            setActiveNavLogo(themeHolding.navId);
            
            const holdingLogoHero = document.getElementById(themeHolding.heroId);
            if(holdingLogoHero) holdingLogoHero.classList.add('show-fixed');
        }
        
        function init() {
            updateTheme(themeHolding);
            setActiveNavLogo(themeHolding.navId);
            runIntroSequence();
        }

        init();
    }

    // Inicia a nova animação
    logoAndThemeAnimation();
});