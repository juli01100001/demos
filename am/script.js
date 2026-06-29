window.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Animação: Hero Section
    try {
        const tlHero = gsap.timeline({ defaults: { ease: "power4.out" } });
        tlHero.fromTo(".hero-title", { y: "100%" }, { y: "0%", duration: 1.6, delay: 0.2 });
        tlHero.fromTo(".navbar", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1.2 }, "-=1.0");
        tlHero.fromTo(".hero-support-line", { opacity: 0 }, { opacity: 1, duration: 1.0 }, "-=0.8");
        tlHero.fromTo(".hero-media-wrapper", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.8, ease: "power3.out" }, "-=1.2");
    } catch (e) { }

    // Animação: Manifesto Brand
    try {
        const tlManifesto = gsap.timeline({
            scrollTrigger: {
                trigger: '.brand-manifesto-carousel',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        tlManifesto.fromTo('.manifesto-text', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
        tlManifesto.fromTo('.description-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8');
        tlManifesto.fromTo('.carousel-title span', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15 }, '-=0.6');
        tlManifesto.fromTo(['.live-video-tag', '.nav-btn', '.professional-card'], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.08 }, '-=0.6');
    } catch (e) { }

    // Carrossel: Profissionais (GSAP)
    try {
        const track = document.querySelector('.carousel-track');
        const container = document.querySelector('.carousel-container');
        const btnNext = document.querySelector('.btn-next');
        const btnPrev = document.querySelector('.btn-prev');

        if (track && container && btnNext && btnPrev) {
            let currentTranslate = 0;
            const getScrollAmount = () => {
                const card = document.querySelector('.professional-card');
                if (!card) return 300;
                const style = window.getComputedStyle(track);
                const gap = parseInt(style.gap) || 24;
                return card.offsetWidth + gap;
            };
            const maxScroll = () => {
                return -(track.offsetWidth - container.offsetWidth + (window.innerWidth * 0.04));
            };
            const moveCarousel = (direction) => {
                const amount = getScrollAmount();
                const max = maxScroll();
                if (direction === 'next') {
                    currentTranslate -= amount;
                    if (currentTranslate < max) currentTranslate = max;
                } else {
                    currentTranslate += amount;
                    if (currentTranslate > 0) currentTranslate = 0;
                }
                gsap.to(track, { x: currentTranslate, duration: 0.6, ease: 'power2.out' });
            };
            btnNext.addEventListener('click', () => moveCarousel('next'));
            btnPrev.addEventListener('click', () => moveCarousel('prev'));
            window.addEventListener('resize', () => {
                const max = maxScroll();
                if (currentTranslate < max && max < 0) {
                    currentTranslate = max;
                    gsap.set(track, { x: currentTranslate });
                } else if (max >= 0) {
                    currentTranslate = 0;
                    gsap.set(track, { x: 0 });
                }
            });
        }
    } catch (e) { }

    // Animação: Conversão Clínica
    try {
        const tlConversion = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.4 } });
        tlConversion.fromTo('.clinic-conversion__image-wrapper', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.6 });
        tlConversion.fromTo([
            '.clinic-conversion__title',
            '.clinic-conversion__subtitle',
            '.clinic-conversion__input-group',
            '.clinic-conversion__checkbox-group',
            '.clinic-conversion__actions'
        ], { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15 }, '-=1.2');
    } catch (e) { }

    // Slider: Antes e Depois (B&A)
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
    } catch (e) { }

    // Animação: Números / Contadores (Stats)
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
                paused: true, // Começa pausado para controlarmos manualmente
                onUpdate: function () {
                    let formattedNumber = targetObj.value;
                    if (hasDot) {
                        formattedNumber = formattedNumber.toLocaleString('pt-BR');
                    }
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
                onEnter: () => {
                    targetObj.value = 0;
                    anim.restart();
                },
                onEnterBack: () => {
                    targetObj.value = 0;
                    anim.restart();
                },
                onLeave: () => {
                    p.innerText = originalText; // Garante que volta ao texto cheio caso o scroll seja muito rápido
                },
                onLeaveBack: () => {
                    p.innerText = originalText;
                }
            });
        });
    } catch (e) { }


    // Carrossel: Testimonials Autoplay Infinito com Pausa no Hover
    try {
        const grid = document.querySelector('.testimonials-grid');

        if (grid) {
            const cards = Array.from(grid.children);
            if (cards.length > 0) {
                // Clona os cards para criar o efeito de loop infinito
                cards.forEach(card => {
                    const clone = card.cloneNode(true);
                    grid.appendChild(clone);
                });

                let scrollAmount = 0;
                const speed = 1; // Velocidade da rolagem
                let isPaused = false; // Controle de pausa

                const autoPlay = () => {
                    // Só avança o scroll se NÃO estiver pausado
                    if (!isPaused) {
                        scrollAmount += speed;

                        if (scrollAmount >= grid.scrollWidth / 2) {
                            scrollAmount = 0;
                        }

                        grid.scrollLeft = scrollAmount;
                    }
                    requestAnimationFrame(autoPlay);
                };

                // Inicia o carrossel automático
                requestAnimationFrame(autoPlay);

                // Pausa quando o mouse entra no carrossel
                grid.addEventListener('mouseenter', () => {
                    isPaused = true;
                });

                // Retoma quando o mouse sai do carrossel
                grid.addEventListener('mouseleave', () => {
                    // Sincroniza o scrollAmount atual antes de retomar
                    scrollAmount = grid.scrollLeft;
                    isPaused = false;
                });
            }
        }
    } catch (e) { }



});function gerarLinkWhatsApp(event) {
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

// Seleciona uma vez só
const menuBtn  = document.querySelector('.btn-menu-dot');
const drawer   = document.getElementById('mobileDrawer');
const backdrop = document.getElementById('drawerBackdrop');

// Drawer
function openDrawer()  { drawer.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
function closeDrawer() { drawer.classList.remove('is-open'); document.body.style.overflow = ''; }

menuBtn?.addEventListener('click', openDrawer);
backdrop?.addEventListener('click', closeDrawer);

drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

// Floating button on scroll
window.addEventListener('scroll', () => {
    menuBtn?.classList.toggle('is-floating', window.scrollY > 80);
});