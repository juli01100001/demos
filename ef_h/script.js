// Registrando os plugins necessários do GSAP
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    initNavbarAnimations();
    initHeroAnimations();
    initMarqueeAnimations();
    initServiceCardsStacking();
    initAboutPinnedSection();
    initThemeDynamicToggle();
});

/* ==========================================================================
   1. MENU (NAVBAR) ANIMATIONS
   ========================================================================== */
function initNavbarAnimations() {
    const logoLine = document.querySelector(".logo-line-svg line");

    if (logoLine) {
        const length = logoLine.getTotalLength();
        gsap.set(logoLine, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        gsap.to(logoLine, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power3.inOut",
            delay: 0.4
        });
    }
}

/* ==========================================================================
   2. HERO SECTION ANIMATIONS
   ========================================================================== */
function initHeroAnimations() {
    // A. Clip-path Reveal da Imagem Centralizado no Scroll
    gsap.fromTo(".hero-bg-frame",
        {
            clipPath: "inset(20% 20% 20% 20% round 12px)"
        },
        {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true,
                pin: true,
                invalidateOnRefresh: true
            }
        }
    );

    // B. Highlight de Texto Palavra por Palavra
    const paragraph = document.getElementById("reveal-text");
    if (paragraph) {
        const words = paragraph.innerText.split(" ");
        paragraph.innerHTML = words.map(word => `<span>${word} </span>`).join("");

        const spanElements = paragraph.querySelectorAll("span");
        gsap.set(spanElements, { opacity: 0.15 });

        gsap.to(spanElements, {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-bottom-grid",
                start: "top 85%",
                end: "top 45%",
                scrub: true
            }
        });
    }
}

/* ==========================================================================
   3. TEXT MARQUEE INFINITO DINÂMICO
   ========================================================================== */
function initMarqueeAnimations() {
    const marqueeInner = document.querySelector(".marquee-inner");
    if (!marqueeInner) return;

    const marqueeTween = gsap.to(marqueeInner, {
        xPercent: -50,
        ease: "none",
        duration: 25,
        repeat: -1
    });

    ScrollTrigger.create({
        onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            if (velocity > 10) {
                const speedMultiplier = 1 + velocity * 0.003;
                gsap.to(marqueeTween, {
                    timeScale: speedMultiplier,
                    duration: 0.3,
                    overwrite: "auto"
                });
            } else {
                gsap.to(marqueeTween, {
                    timeScale: 1,
                    duration: 0.8,
                    overwrite: "auto"
                });
            }
        }
    });
}

/* ==========================================================================
   4. PROCEDIMENTOS (SERVICES STACKING CARDS & PARALLAX)
   ========================================================================== */
function initServiceCardsStacking() {
    const cards = gsap.utils.toArray(".service-card");
    if (!cards.length) return;

    cards.forEach((card) => {
        const img = card.querySelector(".card-parallax-img");

        gsap.fromTo(img,
            { yPercent: -15 },
            {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    });
}

/* ==========================================================================
   5. ABOUT (FILOSOFIA PINNING EFFECT)
   ========================================================================== */
function initAboutPinnedSection() {
    const aboutLeft = document.querySelector(".about-left");
    const aboutSection = document.querySelector(".about-section");

    if (aboutLeft && aboutSection) {
        ScrollTrigger.create({
            trigger: aboutSection,
            start: "top 100px",
            end: "bottom bottom",
            pin: aboutLeft,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true
        });
    }
}



/* ==========================================================================
   6. CONTACT & FOOTER DYNAMIC THEME TOGGLE
   ========================================================================== */
function initThemeDynamicToggle() {
    ScrollTrigger.create({
        trigger: ".contact-section",
        start: "top 50%",
        end: "bottom 50%",
        toggleActions: "play reverse play reverse",
        onEnter: () => transitionTheme(true),
        onLeaveBack: () => transitionTheme(false),
        onEnterBack: () => transitionTheme(true),
        onLeave: () => transitionTheme(true)
    });

    function transitionTheme(isDark) {
        const targetBg = isDark ? "#101010" : "#F4F3F0";
        const targetText = isDark ? "#FFFFFF" : "#1A1A1A";
        const targetSecondary = isDark ? "#A0A0A0" : "#707070";
        const targetLine = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(26, 26, 26, 0.15)";
        const targetBtnBg = isDark ? "#FFFFFF" : "#1A1A1A";
        const targetBtnText = isDark ? "#101010" : "#F4F3F0";

        const root = document.documentElement;

        gsap.to(root, {
            duration: 0.8,
            ease: "power2.out",
            "--bg-color": targetBg,
            "--text-primary": targetText,
            "--text-secondary": targetSecondary,
            "--line-color": targetLine,
            "--btn-bg": targetBtnBg,
            "--btn-text": targetBtnText
        });
    }


    const footerImgs = gsap.utils.toArray(".footer-parallax-img");
    footerImgs.forEach(img => {
        gsap.to(img, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
                trigger: ".main-footer",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
}

function initResultsCarousel() {
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (!track || !prevBtn || !nextBtn) return;

    let currentTranslate = 0;
    // Define a distância de rolagem baseada na largura de um card individual + gap
    const getScrollAmount = () => {
        const card = track.querySelector(".carousel-card-item");
        return card ? card.offsetWidth + 20 : 300;
    };

    nextBtn.addEventListener("click", () => {
        const maxScroll = -(track.scrollWidth - track.parentElement.offsetWidth);
        currentTranslate -= getScrollAmount();

        if (currentTranslate < maxScroll) currentTranslate = maxScroll; // Trava no fim

        gsap.to(track, {
            x: currentTranslate,
            duration: 0.6,
            ease: "power2.out"
        });
    });

    prevBtn.addEventListener("click", () => {
        currentTranslate += getScrollAmount();

        if (currentTranslate > 0) currentTranslate = 0; // Trava no início

        gsap.to(track, {
            x: currentTranslate,
            duration: 0.6,
            ease: "power2.out"
        });
    });
}

// Inicializa o carrossel de resultados
initResultsCarousel();