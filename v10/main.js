document.addEventListener('DOMContentLoaded', () => {

    /**
     * ===================================================================
     * 1. CONFIGURAÇÃO CENTRAL DE LOGOS E TEMAS
     * ===================================================================
     * Defina aqui os caminhos das logos e as cores exatas (HEX ou RGBA) para cada tema.
     */
    const logoData = [
        {
            name: 'Holding',
            heroLogoSrc: 'logo_sothi.png',
            navLogoInitial: 'logo_SOTHI_vertical_finish_white.png', // Logo para header transparente
            navLogoScrolled: 'logo_SOTHI_vertical_finish.png',     // Logo para header com scroll
            primaryColor: '#04A05C',
            hoverColor: '#05B969',
            themedSectionBg: '#F0FFF7',
            heroOverlayStart: 'rgba(4, 160, 92, 0.35)',
            heroOverlayEnd: 'rgba(2, 58, 33,  0.35)',
            alt: 'Logo Sothi Holding'
        },
        {
            name: 'Segmento 1',
            heroLogoSrc: 'logo_sothi_azul.png',
            navLogoInitial: 'logo_SOTHI_vertical_azul_white.png',
            primaryColor: '#2196F3',
            hoverColor: '#47a7f5',
            themedSectionBg: '#E9F5FE',
            heroOverlayStart: 'rgba(33, 150, 243, 0.55)',
            heroOverlayEnd: 'rgba(11, 79, 132, 0.55)',
            alt: 'Logo Sothi Segmento 1'
        },
        {
            name: 'Segmento 2',
            heroLogoSrc: 'logo_sothi_black.png',
            navLogoInitial: 'logo_SOTHI_vertical_black_white.png',
            primaryColor: '#6B6363',
            hoverColor: '#817979',
            themedSectionBg: '#F5F5F5',
            heroOverlayStart: 'rgba(3, 3, 3, 0.55)',
            heroOverlayEnd: 'rgba(3, 3, 3, 0.55)',
            alt: 'Logo Sothi Segmento 2'
        }
    ];

    /**
     * ===================================================================
     * 2. SELETORES E VARIÁVEIS DE ESTADO
     * ===================================================================
     */
    const root = document.documentElement;
    const header = document.getElementById('header');
    const headerLogo = document.getElementById('header-logo');
    const heroLogo = document.getElementById('hero-logo');
    const backToTopButton = document.getElementById('back-to-top');

    let currentLogoIndex = 0;
    let logoTimeout;
    const LOGO_CHANGE_INTERVAL = 4000; // 4 segundos
    let isAnimationActive = true;

    /**
     * ===================================================================
     * 3. FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO DE TEMA E LOGOS
     * ===================================================================
     */
    const updateThemeAndLogos = (index) => {
        if (index < 0 || index >= logoData.length) return;

        const theme = logoData[index];
        currentLogoIndex = index;

        headerLogo.classList.add('changing');
        if (heroLogo) heroLogo.classList.add('changing');

        setTimeout(() => {
            // Atualiza as variáveis CSS com as cores exatas
            root.style.setProperty('--primary-accent-color', theme.primaryColor);
            root.style.setProperty('--primary-accent-hover-color', theme.hoverColor);
            root.style.setProperty('--themed-section-bg', theme.themedSectionBg);
            root.style.setProperty('--hero-overlay-start', theme.heroOverlayStart);
            root.style.setProperty('--hero-overlay-end', theme.heroOverlayEnd);

            // Atualiza o SRC e o ALT das imagens
            // Usa a logo 'Initial' por padrão, a de scroll é tratada separadamente
            headerLogo.src = theme.navLogoInitial; 
            headerLogo.alt = theme.alt;
            if (heroLogo) {
                heroLogo.src = theme.heroLogoSrc;
                heroLogo.alt = theme.alt;
            }

            headerLogo.classList.remove('changing');
            if (heroLogo) heroLogo.classList.remove('changing');

        }, 300);
    };

    /**
     * ===================================================================
     * 4. LÓGICA DE ANIMAÇÃO AUTOMÁTICA (COM FIM)
     * ===================================================================
     */
    const startLogoAnimation = () => {
        clearTimeout(logoTimeout);
        if (!isAnimationActive) return;

        logoTimeout = setTimeout(() => {
            let nextIndex = currentLogoIndex + 1;
            if (nextIndex < logoData.length) {
                updateThemeAndLogos(nextIndex);
                startLogoAnimation(); 
            } else {
                updateThemeAndLogos(0); // Volta para a primeira
                isAnimationActive = false; // Para a animação
                // Garante que a logo correta seja exibida de acordo com o scroll atual
                handleScroll();
            }
        }, LOGO_CHANGE_INTERVAL);
    };

    /**
     * ===================================================================
     * 5. SCRIPTS GERAIS DA UI (MENU, SCROLL, OBSERVERS)
     * ===================================================================
     */
    
    // --- Lógica de Scroll (Com troca de logo) ---
    const handleScroll = () => {
        const isScrolled = window.scrollY > 50;
        header.classList.toggle('scrolled', isScrolled);

        if (backToTopButton) {
            backToTopButton.classList.toggle('visible', window.scrollY > 300);
        }

        // Só troca a logo da NAV se a animação inicial já tiver terminado
        if (!isAnimationActive) {
            const holdingTheme = logoData[0]; // A logo final é sempre a da holding
            headerLogo.src = isScrolled ? holdingTheme.navLogoScrolled : holdingTheme.navLogoInitial;
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Menu Mobile ---
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    if (navToggle) {
        navToggle.addEventListener('click', () => document.body.classList.add('nav-open'));
    }
    if (navClose) {
        navClose.addEventListener('click', () => document.body.classList.remove('nav-open'));
    }

    // --- Animação de entrada dos elementos ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animated-item, .reveal-up').forEach(el => animationObserver.observe(el));

    // --- Highlight do link de navegação ativo ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));

    // --- Atualizar ano no footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // --- INICIALIZAÇÃO ---
    updateThemeAndLogos(0);
    startLogoAnimation();
});