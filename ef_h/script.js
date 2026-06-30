document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. STICKY HEADER & DYNAMIC BACKGROUND
       ========================================================================== */
    const header = document.querySelector('.main-header');
    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Execução inicial preventiva

    /* ==========================================================================
       2. MOBILE MENU ENGINE
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('open');
        // Acessibilidade basica
        const isOpen = navMenu.classList.contains('active');
        mobileToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha o menu ao clicar em qualquer link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('open');
        });
    });

    /* ==========================================================================
       3. INTERPOLATED SMOOTH SCROLL (SCROLL SUAVE PRECISO)
       ========================================================================== */
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       4. HIGH-PERFORMANCE NATIVE INTERSECTION OBSERVER (FADE-IN SURGIMENTO)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Ativa um pouco antes de entrar totalmente na tela
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Para de observar uma vez animado
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       5. ACTIVE LINK TRACKING ON SCROLL
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const scrollTracker = () => {
        const scrollPosition = window.scrollY + header.offsetHeight + 100;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            const matchingLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (matchingLink) {
                if (scrollPosition > sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    matchingLink.classList.add('active');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollTracker);
});