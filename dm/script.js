document.addEventListener("DOMContentLoaded", () => {
    // Registro explícito do plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       MENU MOBILE INTERATIVO
       ========================================================================== */
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // Fecha o menu dinamicamente ao clicar em um link
        document.querySelectorAll(".nav-item").forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

  

    /* ==========================================================================
       ANIMAÇÕES GSAP: CARREGAMENTO (HERO)
       ========================================================================== */
    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTimeline.from(".menu-toggle", {
        y: -20,
        opacity: 0,
        duration: 1.2,
        delay: 0.2
    })
    .from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1.4
    }, "-=0.8")
    .from(".white-btn", {
        y: 40,
        opacity: 0,
        duration: 1.2
    }, "-=1.0");

   
    /* ==========================================================================
       ANIMAÇÕES GSAP VIA SCROLLTRIGGER (VANTAGENS / TIMELINE)
       ========================================================================== */
    // Executa as animações de linha apenas em resoluções desktop
    if (window.innerWidth > 768) {
        const timelineMaster = gsap.timeline({
            scrollTrigger: {
                trigger: ".timeline-wrapper",
                start: "top 75%",
                end: "top 30%",
                toggleActions: "play none none none"
            }
        });

        // 1. Expansão horizontal da linha
        timelineMaster.to(".timeline-progress", {
            width: "100%",
            duration: 1.5,
            ease: "power3.inOut"
        });

        // 2. Aparição coordenada (Stagger) dos nós e pílulas
        timelineMaster.to(".timeline-node", {
            scale: 1,
            duration: 0.4,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }, "-=1.0");

        timelineMaster.to(".timeline-pill", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        }, "-=0.6");
    }

    /* ==========================================================================
       ANIMAÇÕES GSAP VIA SCROLLTRIGGER (PORTFÓLIO GRID)
       ========================================================================== */
    gsap.from(".project-card", {
        scrollTrigger: {
            trigger: ".portfolio-grid",
            start: "top 80%",
            toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.25,
        ease: "power3.out"
    });
});