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
    const openMenu = () => { navMenu.setAttribute('data-visible', 'true'); document.body.classList.add('nav-open'); };
    const closeMenu = () => { navMenu.setAttribute('data-visible', 'false'); document.body.classList.remove('nav-open'); };
    if (navToggle) navToggle.addEventListener('click', openMenu);
    if (navClose) navClose.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        backToTopButton.classList.toggle('visible', window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    // Observer para animações de fade-in de outras seções
    const animatedElements = document.querySelectorAll('.animated-item');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => animationObserver.observe(el));

    /**
     * ===================================================================
     * 3. LÓGICA DE TEMAS E ANIMAÇÕES
     * ===================================================================
     */

    // --- Definições de Tema ---
    const themeHolding = { name: "Sothi", heroId: 'hero-logo-holding', navId: 'nav-logo-holding-start', color: '#04a05c', hue: 151 };
    const themeSegmento1 = { name: "TI", heroId: 'hero-logo1', navId: 'nav-logo1', color: '#2196F3', hue: 207 };
    const themeSegmento2 = { name: "Educação", heroId: 'hero-logo2', navId: 'nav-logo2', color: '#333333', hue: 0, saturation: 0 };
    const allThemes = [ themeHolding, themeSegmento1, themeSegmento2 ];

    // --- Funções Auxiliares ---
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    function lightenHex(hex, percent) {
        hex = hex.replace(/^\s*#|\s*$/g, '');
        if (hex.length === 3) { hex = hex.replace(/(.)/g, '$1$1'); }
        const r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
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

    // --- Orquestrador Principal da Animação ---
    async function heroIntroAnimation() {
        const logoContainer = document.getElementById('logo-container-hero');
        const logoText = document.getElementById('hero-logo-text');
        const heroContentElements = document.querySelectorAll('.hero-content .reveal-up');
        
        if (!logoContainer || !logoText || !heroContentElements) return;

        let currentHeroLogo = null;
        const showHeroLogo = (theme) => {
            if (currentHeroLogo) currentHeroLogo.classList.remove('visible');
            const newLogo = document.getElementById(theme.heroId);
            if (newLogo) {
                newLogo.classList.add('visible');
                currentHeroLogo = newLogo;
            }
            updateTheme(theme);
        };
        
        const typeText = async (text, erase = true) => {
            const typeSpeed = 120;
            const eraseSpeed = 60;
            const pauseBeforeErase = 1200;

            const typeDuration = text.length * typeSpeed;
            logoText.textContent = text;
            logoText.style.animation = `typing ${typeDuration / 1000}s steps(${text.length}, end) forwards, blink-caret .75s step-end infinite`;
            logoText.classList.add('is-typing');
            await delay(typeDuration);
            logoText.classList.remove('is-typing');
            logoText.classList.add('is-finished');
            
            if (!erase) return;

            await delay(pauseBeforeErase);

            const eraseDuration = text.length * eraseSpeed;
            logoText.style.animation = `erasing ${eraseDuration / 1000}s steps(${text.length}, end) forwards`;
            logoText.classList.add('is-erasing');
            await delay(eraseDuration);
            
            logoText.classList.remove('is-erasing', 'is-finished');
            logoText.textContent = '';
            logoText.style.animation = '';
        };
        
        // --- SEQUÊNCIA DA ANIMAÇÃO ---
        
        // 1. ANIMAÇÃO INICIAL DA LOGO
        logoContainer.classList.add('intro-start');
        showHeroLogo(themeHolding);
        await delay(1300);
        heroContentElements.forEach(el => el.classList.add('is-visible'));

        // 2. LOGO RECUA E REDUZ
        logoContainer.classList.remove('intro-start');
        
        // 3. CICLO DE DIGITAÇÃO SINCRONIZADO
        await typeText(themeHolding.name);
        showHeroLogo(themeSegmento1);
        await typeText(themeSegmento1.name);
        showHeroLogo(themeSegmento2);
        await typeText(themeSegmento2.name);
        
        // 4. DIGITAÇÃO FINAL E PERMANENTE
        showHeroLogo(themeHolding);
        await typeText(themeHolding.name, false);

        // 5. MOSTRA O CONTEÚDO DO HERO APÓS A ANIMAÇÃO DA LOGO
    }
    
    // --- Controle da Logo do Header ---
    function initializeHeader() {
        const headerLogoContainer = document.getElementById('header-logo-container');
        if (!headerLogoContainer) return;

        let currentNavId = null;
        let hoverInterval = null;

        const setActiveNavLogo = (theme) => {
            const newActiveId = theme.navId;
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
        };

        const updateNav = (theme) => {
            setActiveNavLogo(theme);
            updateTheme(theme);
        };
        
        updateNav(themeHolding);

        let hoverIndex = 0;
        headerLogoContainer.addEventListener('mouseenter', () => {
            clearInterval(hoverInterval);
            hoverInterval = setInterval(() => {
                hoverIndex = (hoverIndex + 1) % allThemes.length;
                updateNav(allThemes[hoverIndex]);
            }, 1000);
        });

        headerLogoContainer.addEventListener('mouseleave', () => {
            clearInterval(hoverInterval);
            hoverInterval = null;
            updateNav(themeHolding);
            hoverIndex = 0;
        });
    }

    // --- INICIALIZAÇÃO ---
    initializeHeader();

    // FIX: Observador para iniciar a animação do Hero somente quando a seção estiver visível
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const heroAnimationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Inicia a animação principal apenas uma vez
                    heroIntroAnimation();
                    // Para de observar após a primeira vez para não repetir a animação
                    observer.unobserve(heroSection);
                }
            });
        }, { threshold: 0.2 }); // Inicia quando 20% da seção estiver visível

        heroAnimationObserver.observe(heroSection);
    }
});