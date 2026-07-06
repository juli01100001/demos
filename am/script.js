// ============================================================
// SCROLL ANIMATIONS — direcionais, leves, com propósito
// ============================================================
(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // MELHOR PRÁTICA MOBILE: Impede que a barra do navegador recalculando a altura da tela faça a animação "dançar"
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // respeita a preferência do usuário, não anima nada

    const mm = gsap.matchMedia();
    gsap.defaults({ ease: 'power3.out' });

    // ---------- HERO ----------
    const initHero = () => {
        try {
            const title = document.querySelector('.hero-title');
            const navbar = document.querySelector('.navbar');
            const supportLine = document.querySelector('.hero-support-line');
            const mediaWrapper = document.querySelector('.hero-media-wrapper');

            if (supportLine) {
                gsap.set(supportLine, { opacity: 0, y: 14 });
            }

            const tlHero = gsap.timeline({ defaults: { ease: 'power4.out' } });

            if (title) {
                tlHero.fromTo(title, { y: '100%' }, { y: '0%', duration: 1.5, delay: 0.15 });
            }
            if (navbar) {
                tlHero.fromTo(navbar, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 1 }, title ? '-=1.0' : 0);
            }
            if (supportLine) {
                tlHero.to(supportLine, { opacity: 1, y: 0, duration: 0.8 }, '-=0.7');
            }
            if (mediaWrapper) {
                tlHero.fromTo(mediaWrapper, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, '-=0.6');
            }
        } catch (e) {
            console.error("Erro na animação do Hero:", e);
        }
    };

    if (document.readyState === 'complete') {
        initHero();
    } else {
        window.addEventListener('load', initHero);
    }

    // ---------- STATS: escada esquerda → direita ----------
    try {
        mm.add('(min-width: 769px)', () => {
            gsap.set('.stats-div', { opacity: 0, y: 36 });
            gsap.to('.stats-div', {
                opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '.stats', start: 'top 80%', toggleActions: 'play reverse play reverse' }
            });
        });
        mm.add('(max-width: 768px)', () => {
            gsap.set('.stats-div', { opacity: 0, y: 20 });
            gsap.to('.stats-div', {
                opacity: 1, y: 0, duration: 0.7, stagger: 0.1,
                scrollTrigger: { trigger: '.stats', start: 'top 85%', toggleActions: 'play reverse play reverse' }
            });
        });
    } catch (e) {}

    // ---------- ABOUT ----------
    try {
        mm.add('(min-width: 1025px)', () => {
            gsap.set('.about .team-card', { opacity: 0, x: -60 });
            gsap.set('.about .quote-card', { opacity: 0, x: 60 });

            gsap.to('.about .team-card', {
                opacity: 1, x: 0, duration: 1.1,
                scrollTrigger: { trigger: '.about', start: 'top 75%', toggleActions: 'play reverse play reverse' }
            });
            gsap.to('.about .quote-card', {
                opacity: 1, x: 0, duration: 1.1, delay: 0.15,
                scrollTrigger: { trigger: '.about', start: 'top 75%', toggleActions: 'play reverse play reverse' }
            });
        });

        mm.add('(max-width: 1024px)', () => {
            gsap.set('.about .team-card', { opacity: 0, y: 40 });
            gsap.set('.about .quote-card', { opacity: 0, y: 40 });

            gsap.to('.about .team-card', {
                opacity: 1, y: 0, duration: 1.1,
                scrollTrigger: { trigger: '.about', start: 'top 75%', toggleActions: 'play reverse play reverse' }
            });
            gsap.to('.about .quote-card', {
                opacity: 1, y: 0, duration: 1.1, delay: 0.15,
                scrollTrigger: { trigger: '.about', start: 'top 75%', toggleActions: 'play reverse play reverse' }
            });
        });
    } catch (e) {}

    // ---------- BEFORE/AFTER ----------
    try {
        mm.add('(min-width: 1025px)', () => {
            gsap.set('.ba-left', { opacity: 0, x: -50 });
            gsap.set('.ba-right', { opacity: 0, x: 50, scale: 0.97 });

            gsap.to('.ba-left', {
                opacity: 1, x: 0, duration: 1,
                scrollTrigger: { trigger: '.before-after-section', start: 'top 75%', toggleActions: 'play reverse play reverse' }
            });
            gsap.to('.ba-right', {
                opacity: 1, x: 0, scale: 1, duration: 1.1, delay: 0.1,
                scrollTrigger: { trigger: '.before-after-section', start: 'top 75%', toggleActions: 'play reverse play reverse' }
            });
        });
        
        mm.add('(max-width: 1024px)', () => {
            gsap.set('.ba-left', { opacity: 0, y: 30 });
            gsap.set('.ba-right', { opacity: 0, y: 30, scale: 0.98 });

            gsap.to('.ba-left', {
                opacity: 1, y: 0, duration: 1,
                scrollTrigger: { trigger: '.before-after-section', start: 'top 75%', toggleActions: 'play reverse play reverse' }
            });
            gsap.to('.ba-right', {
                opacity: 1, y: 0, scale: 1, duration: 1.1, delay: 0.1,
                scrollTrigger: { trigger: '.before-after-section', start: 'top 75%', toggleActions: 'play reverse play reverse' }
            });
        });
    } catch (e) {}

    // ---------- TESTIMONIALS (ESTABILIZADO PARA AMBOS E SINALIZANDO OS BOTÕES) ----------
    try {
        gsap.set('.testimonials-header', { opacity: 0, y: 24 });
        gsap.to('.testimonials-header', {
            opacity: 1, y: 0, duration: 0.9,
            scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%', toggleActions: 'play reverse play reverse' }
        });

        gsap.set('.testimonials-grid', { opacity: 0, y: 15 });
        gsap.to('.testimonials-grid', {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { 
                trigger: '.testimonials-section', 
                start: 'top 75%', 
                toggleActions: 'play reverse play reverse',
                // Sempre que reativar o elemento na tela, avisa o slider para recalcular as dimensões e ligar os botões
                onEnter: () => window.dispatchEvent(new Event('resize')),
                onEnterBack: () => window.dispatchEvent(new Event('resize'))
            }
        });
    } catch (e) {}

    // ---------- PREÇOS ----------
    try {
        gsap.set('.prices-header', { opacity: 0, x: -30 });
        gsap.to('.prices-header', {
            opacity: 1, x: 0, duration: 0.9,
            scrollTrigger: { trigger: '.clinic-prices-section', start: 'top 78%', toggleActions: 'play reverse play reverse' }
        });

        gsap.set('.price-item', { opacity: 0, y: 18 });
        gsap.to('.price-item', {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.07,
            scrollTrigger: { trigger: '.prices-grid', start: 'top 85%', toggleActions: 'play reverse play reverse' }
        });
    } catch (e) {}

    // ---------- CONTATO ----------
    try {
        gsap.set('.contact-form-side h2, .contact-subtitle, .clinic-form .form-group, .clinic-form .form-checkbox-group, .btn-consultation',
            { opacity: 0, y: 20 });
        gsap.to('.contact-form-side h2, .contact-subtitle, .clinic-form .form-group, .clinic-form .form-checkbox-group, .btn-consultation', {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.08,
            scrollTrigger: { trigger: '.clinic-contact-section', start: 'top 78%', toggleActions: 'play reverse play reverse' }
        });

        mm.add('(min-width: 1025px)', () => {
            gsap.set('.contact-image-side', { opacity: 0, x: 40 });
            gsap.to('.contact-image-side', {
                opacity: 1, x: 0, duration: 1,
                scrollTrigger: { trigger: '.clinic-contact-section', start: 'top 78%', toggleActions: 'play reverse play reverse' }
            });
        });
        mm.add('(max-width: 1024px)', () => {
            gsap.set('.contact-image-side', { opacity: 0, y: 30 });
            gsap.to('.contact-image-side', {
                opacity: 1, y: 0, duration: 0.9,
                scrollTrigger: { trigger: '.clinic-contact-section', start: 'top 78%', toggleActions: 'play reverse play reverse' }
            });
        });
    } catch (e) {}

    // ---------- FOOTER ----------
    try {
        gsap.set('.footer-branding', { opacity: 0, y: 24 });
        gsap.to('.footer-branding', {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: { trigger: '.footer-branding', start: 'top 90%', toggleActions: 'play reverse play reverse' }
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

    // ---------- Testimonials: scroll horizontal pinado ----------
    (() => {
        try {
            const grid = document.querySelector('.testimonials-grid');
            const cards = Array.from(document.querySelectorAll('.testimonial-card'));
            const section = document.querySelector('.testimonials-section');
            const nav = document.querySelector('.testimonials-nav');
            if (!grid || !cards.length || !section || !nav) return;

            const prevBtn = nav.querySelector('.nav-btn[aria-label="Anterior"]');
            const nextBtn = nav.querySelector('.nav-btn[aria-label="Próximo"]');
            if (!prevBtn || !nextBtn) return;

            const setActiveCard = () => {
                const gridRect = grid.getBoundingClientRect();
                const center = gridRect.left + gridRect.width / 2;
                let closest = null;
                let closestDist = Infinity;

                cards.forEach(card => {
                    const r = card.getBoundingClientRect();
                    const cardCenter = r.left + r.width / 2;
                    const dist = Math.abs(cardCenter - center);
                    if (dist < closestDist) { closestDist = dist; closest = card; }
                    card.classList.toggle('is-active', dist < r.width / 2);
                });

                return closest;
            };

            const scrollToCard = (index) => {
                const card = cards[index];
                if (!card) return;
                const gridRect = grid.getBoundingClientRect();
                const cardRect = card.getBoundingClientRect();
                const offset = (cardRect.left + cardRect.width / 2) - (gridRect.left + gridRect.width / 2);
                grid.scrollBy({ left: offset, behavior: 'smooth' });
            };

            const updateUI = () => {
                const active = setActiveCard();
                const activeIndex = cards.indexOf(active);
                prevBtn.disabled = activeIndex <= 0;
                nextBtn.disabled = activeIndex >= cards.length - 1;
            };

            prevBtn.addEventListener('click', () => {
                const active = cards.find(c => c.classList.contains('is-active'));
                const i = Math.max(0, cards.indexOf(active) - 1);
                scrollToCard(i);
            });

            nextBtn.addEventListener('click', () => {
                const active = cards.find(c => c.classList.contains('is-active'));
                const i = Math.min(cards.length - 1, cards.indexOf(active) + 1);
                scrollToCard(i);
            });

            let scrollTimeout;
            grid.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(updateUI, 50);
            }, { passive: true });

            let isDown = false, startX = 0, scrollStart = 0;
            grid.addEventListener('mousedown', (e) => {
                isDown = true;
                grid.classList.add('is-dragging');
                startX = e.pageX;
                scrollStart = grid.scrollLeft;
            });
            window.addEventListener('mouseup', () => {
                isDown = false;
                grid.classList.remove('is-dragging');
            });
            window.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                grid.scrollLeft = scrollStart - (e.pageX - startX);
            });

            window.addEventListener('resize', updateUI);
            updateUI();
        } catch (e) {}
    })();
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