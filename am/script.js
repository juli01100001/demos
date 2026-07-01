// ============================================================
// SCROLL ANIMATIONS — direcionais, leves, com propósito
// ============================================================
(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // respeita a preferência do usuário, não anima nada

    const mm = gsap.matchMedia();
    gsap.defaults({ ease: 'power3.out' });

    // ---------- HERO (Versão Robusta Bloco Único) ----------
    const initHero = () => {
        try {
            const title = document.querySelector('.hero-title');
            const navbar = document.querySelector('.navbar');
            const supportLine = document.querySelector('.hero-support-line');
            const mediaWrapper = document.querySelector('.hero-media-wrapper');

            // Aplica o estado inicial ocultando a linha inteira de uma vez
            if (supportLine) {
                gsap.set(supportLine, { opacity: 0, y: 14 });
            }

            const tlHero = gsap.timeline({ defaults: { ease: 'power4.out' } });

            // 1. Anima o título principal se ele existir
            if (title) {
                tlHero.fromTo(title, { y: '100%' }, { y: '0%', duration: 1.5, delay: 0.15 });
            }
            
            // 2. Anima a navbar se ela existir
            if (navbar) {
                tlHero.fromTo(navbar, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 1 }, title ? '-=1.0' : 0);
            }

            // 3. Anima a linha de suporte inteira como um único bloco (Evita travamentos)
            if (supportLine) {
                tlHero.to(supportLine, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8
                }, '-=0.7');
            }

            // 4. Anima o banner/imagem de fundo
            if (mediaWrapper) {
                tlHero.fromTo(mediaWrapper, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, '-=0.6');
            }
        } catch (e) {
            console.error("Erro na animação do Hero:", e);
        }
    };

    // Garante que o Hero espere o HTML carregar perfeitamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHero);
    } else {
        initHero();
    }

    // ---------- STATS: escada esquerda → direita ----------
    try {
        mm.add('(min-width: 769px)', () => {
            gsap.set('.stats-div', { opacity: 0, y: 36 });
            gsap.to('.stats-div', {
                opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '.stats', start: 'top 80%' }
            });
        });
        mm.add('(max-width: 768px)', () => {
            gsap.set('.stats-div', { opacity: 0, y: 20 });
            gsap.to('.stats-div', {
                opacity: 1, y: 0, duration: 0.7, stagger: 0.1,
                scrollTrigger: { trigger: '.stats', start: 'top 85%' }
            });
        });
    } catch (e) {}

    // ---------- ABOUT: CORRIGIDO (Animações movidas para dentro do MatchMedia) ----------
    try {
        mm.add('(min-width: 1025px)', () => {
            gsap.set('.about .team-card', { opacity: 0, x: -60 });
            gsap.set('.about .quote-card', { opacity: 0, x: 60 });

            gsap.to('.about .team-card', {
                opacity: 1, x: 0, duration: 1.1,
                scrollTrigger: { trigger: '.about', start: 'top 75%' }
            });
            gsap.to('.about .quote-card', {
                opacity: 1, x: 0, duration: 1.1, delay: 0.15,
                scrollTrigger: { trigger: '.about', start: 'top 75%' }
            });
        });

        mm.add('(max-width: 1024px)', () => {
            gsap.set('.about .team-card', { opacity: 0, y: 40 });
            gsap.set('.about .quote-card', { opacity: 0, y: 40 });

            gsap.to('.about .team-card', {
                opacity: 1, y: 0, duration: 1.1,
                scrollTrigger: { trigger: '.about', start: 'top 75%' }
            });
            gsap.to('.about .quote-card', {
                opacity: 1, y: 0, duration: 1.1, delay: 0.15,
                scrollTrigger: { trigger: '.about', start: 'top 75%' }
            });
        });
    } catch (e) {}

    // ---------- BEFORE/AFTER: texto esquerda, imagem direita + scale ----------
    try {
        mm.add('(min-width: 1025px)', () => {
            gsap.set('.ba-left', { opacity: 0, x: -50 });
            gsap.set('.ba-right', { opacity: 0, x: 50, scale: 0.97 });

            gsap.to('.ba-left', {
                opacity: 1, x: 0, duration: 1,
                scrollTrigger: { trigger: '.before-after-section', start: 'top 75%' }
            });
            gsap.to('.ba-right', {
                opacity: 1, x: 0, scale: 1, duration: 1.1, delay: 0.1,
                scrollTrigger: { trigger: '.before-after-section', start: 'top 75%' }
            });
        });
        
        mm.add('(max-width: 1024px)', () => {
            gsap.set('.ba-left', { opacity: 0, y: 30 });
            gsap.set('.ba-right', { opacity: 0, y: 30, scale: 0.98 });

            gsap.to('.ba-left', {
                opacity: 1, y: 0, duration: 1,
                scrollTrigger: { trigger: '.before-after-section', start: 'top 75%' }
            });
            gsap.to('.ba-right', {
                opacity: 1, y: 0, scale: 1, duration: 1.1, delay: 0.1,
                scrollTrigger: { trigger: '.before-after-section', start: 'top 75%' }
            });
        });
    } catch (e) {}

    // ---------- TESTIMONIALS: header sobe, cards entram da direita em cascata ----------
    try {
        gsap.set('.testimonials-header', { opacity: 0, y: 24 });
        gsap.to('.testimonials-header', {
            opacity: 1, y: 0, duration: 0.9,
            scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%' }
        });

        mm.add('(min-width: 769px)', () => {
            gsap.set('.testimonial-card', { opacity: 0, x: 50 });
            gsap.to('.testimonial-card', {
                opacity: 1, x: 0, duration: 0.8, stagger: 0.1,
                scrollTrigger: { trigger: '.testimonials-grid', start: 'top 85%' }
            });
        });
        mm.add('(max-width: 768px)', () => {
            gsap.set('.testimonial-card', { opacity: 0, y: 24 });
            gsap.to('.testimonial-card', {
                opacity: 1, y: 0, duration: 0.7, stagger: 0.08,
                scrollTrigger: { trigger: '.testimonials-grid', start: 'top 88%' }
            });
        });
    } catch (e) {}

    // ---------- PREÇOS: header entra, lista revela item a item ----------
    try {
        gsap.set('.prices-header', { opacity: 0, x: -30 });
        gsap.to('.prices-header', {
            opacity: 1, x: 0, duration: 0.9,
            scrollTrigger: { trigger: '.clinic-prices-section', start: 'top 78%' }
        });

        gsap.set('.price-item', { opacity: 0, y: 18 });
        gsap.to('.price-item', {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.07,
            scrollTrigger: { trigger: '.prices-grid', start: 'top 85%' }
        });
    } catch (e) {}

    // ---------- CONTATO: form em cascata, imagem da direita ----------
    try {
        gsap.set('.contact-form-side h2, .contact-subtitle, .clinic-form .form-group, .clinic-form .form-checkbox-group, .btn-consultation',
            { opacity: 0, y: 20 });
        gsap.to('.contact-form-side h2, .contact-subtitle, .clinic-form .form-group, .clinic-form .form-checkbox-group, .btn-consultation', {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.08,
            scrollTrigger: { trigger: '.clinic-contact-section', start: 'top 78%' }
        });

        mm.add('(min-width: 1025px)', () => {
            gsap.set('.contact-image-side', { opacity: 0, x: 40 });
            gsap.to('.contact-image-side', {
                opacity: 1, x: 0, duration: 1,
                scrollTrigger: { trigger: '.clinic-contact-section', start: 'top 78%' }
            });
        });
        mm.add('(max-width: 1024px)', () => {
            gsap.set('.contact-image-side', { opacity: 0, y: 30 });
            gsap.to('.contact-image-side', {
                opacity: 1, y: 0, duration: 0.9,
                scrollTrigger: { trigger: '.clinic-contact-section', start: 'top 78%' }
            });
        });
    } catch (e) {}

    // ---------- FOOTER: branding sobe suave ----------
    try {
        gsap.set('.footer-branding', { opacity: 0, y: 24 });
        gsap.to('.footer-branding', {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: { trigger: '.footer-branding', start: 'top 90%' }
        });
    } catch (e) {}
})();


// ============================================================
// CONTADOR: Stats (números sobem quando entram na tela)
// ============================================================
window.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    try {
        const statNumbers = document.querySelectorAll('.stats-div p');
        statNumbers.forEach(p => {
            const originalText = p.innerText.trim();
            const rawNumber = parseInt(originalText.replace(/\D/g, ''), 10);
            const hasPlus = originalText.includes('+');
            const hasPercent = originalText.includes('%');
            const hasDot = originalText.includes('.');

            const targetObj = { value: 0 };

            const anim = gsap.to(targetObj, {
                value: rawNumber,
                duration: 2,
                ease: "power1.out",
                snap: { value: 1 },
                paused: true,
                onUpdate: function () {
                    let formattedNumber = targetObj.value;
                    if (hasDot) formattedNumber = formattedNumber.toLocaleString('pt-BR');
                    let finalText = '';
                    if (hasPlus) finalText += '+';
                    finalText += formattedNumber;
                    if (hasPercent) finalText += '%';
                    p.innerText = finalText;
                }
            });

            ScrollTrigger.create({
                trigger: p,
                start: "top 85%",
                onEnter: () => { targetObj.value = 0; anim.restart(); },
                onEnterBack: () => { targetObj.value = 0; anim.restart(); },
                onLeave: () => { p.innerText = originalText; },
                onLeaveBack: () => { p.innerText = originalText; }
            });
        });
    } catch (e) {}


    // ---------- Slider: Antes e Depois (B&A) ----------
    try {
        const imgs = document.querySelectorAll('.ba-img');
        const baBtnPrev = document.querySelector('.ba-navigation .nav-btn:first-child');
        const baBtnNext = document.querySelector('.ba-navigation .nav-btn:last-child');
        let current = 0;

        if (imgs.length && baBtnPrev && baBtnNext) {
            function goTo(index) {
                imgs[current].classList.remove('active');
                current = (index + imgs.length) % imgs.length;
                imgs[current].classList.add('active');
            }
            baBtnNext.addEventListener('click', () => goTo(current + 1));
            baBtnPrev.addEventListener('click', () => goTo(current - 1));
        }
    } catch (e) {}


    // ---------- Carrossel: Testimonials autoplay infinito + pausa no hover ----------
    try {
        const grid = document.querySelector('.testimonials-grid');

        if (grid) {
            const cards = Array.from(grid.children);
            if (cards.length > 0) {
                cards.forEach(card => {
                    const clone = card.cloneNode(true);
                    grid.appendChild(clone);
                });

                let scrollAmount = 0;
                const speed = 1;
                let isPaused = false;

                const autoPlay = () => {
                    if (!isPaused) {
                        scrollAmount += speed;
                        if (scrollAmount >= grid.scrollWidth / 2) scrollAmount = 0;
                        grid.scrollLeft = scrollAmount;
                    }
                    requestAnimationFrame(autoPlay);
                };

                requestAnimationFrame(autoPlay);

                grid.addEventListener('mouseenter', () => { isPaused = true; });
                grid.addEventListener('mouseleave', () => {
                    scrollAmount = grid.scrollLeft;
                    isPaused = false;
                });
            }
        }
    } catch (e) {}

});


// ============================================================
// WHATSAPP: gera link a partir do formulário
// ============================================================
function gerarLinkWhatsApp(event) {
    const nome = document.getElementById('clinic-name').value.trim();
    const email = document.getElementById('clinic-phone').value.trim();
    const mensagem = document.getElementById('clinic-text').value.trim();
    const termoAceito = document.getElementById('privacy-agreement').checked;
    const erro = document.getElementById('form-error');

    if (!nome || !email || !mensagem || !termoAceito) {
        erro.textContent = "* Preencha todos os campos e aceite os termos.";
        return;
    }

    erro.textContent = "";

    const numeroTelefone = "554333543615";
    let texto = `Olá, gostaria de agendar uma consulta!\n\n`;
    texto += `*Nome:* ${nome}\n`;
    texto += `*E-mail:* ${email}\n`;
    texto += `*Mensagem:* ${mensagem}`;

    window.open(`https://wa.me/${numeroTelefone}?text=${encodeURIComponent(texto)}`, '_blank');
}


// ============================================================
// MENU MOBILE
// ============================================================
(function () {
    function initMobileMenu() {
        const toggle = document.getElementById('menuToggle');
        const drawer = document.getElementById('mobileDrawer');
        const backdrop = document.getElementById('drawerBackdrop');

        if (!toggle || !drawer || !backdrop) {
            console.warn('Menu mobile: elementos não encontrados no DOM.');
            return;
        }

        const state = { open: false };

        function setOpen(open) {
            state.open = open;
            drawer.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            drawer.setAttribute('aria-hidden', String(!open));
            document.body.style.overflow = open ? 'hidden' : '';
        }

        toggle.addEventListener('click', () => setOpen(!state.open));
        backdrop.addEventListener('click', () => setOpen(false));

        drawer.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setOpen(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.open) setOpen(false);
        });

        let lastScrollState = false;
        function onScroll() {
            const shouldFloat = window.scrollY > 80;
            if (shouldFloat !== lastScrollState) {
                lastScrollState = shouldFloat;
                toggle.classList.toggle('is-floating', shouldFloat);
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();