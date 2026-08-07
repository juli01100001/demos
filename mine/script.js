/**
 * { deploy } — creative coding & interactive engine
 * Flawless GSAP + Lenis Sync + Unified Mobile & Desktop Engine
 * v3 — fix: spans .italic dentro de .section-title e .process-title
 *       agora sobrevivem à reconstrução do texto animado (word/char split)
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.error("[deploy engine] GSAP ou ScrollTrigger não foram carregados.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 0. HELPER — preserva itálico ao quebrar texto em palavras
    // ==========================================
    // Percorre os childNodes originais do elemento (antes de qualquer
    // reescrita) e devolve um array de palavras marcando quais vieram
    // de dentro de um <span class="italic">, pra poder reaplicar a
    // classe depois que o texto for reconstruído em spans de animação.
    function getTextWithItalicMap(el) {
        const result = []; // [{ text: "conectam", italic: true }, ...]

        el.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    text.split(/\s+/).forEach((w) => result.push({ text: w, italic: false }));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const isItalic = node.classList.contains("italic");
                const text = node.textContent.trim();
                if (text) {
                    text.split(/\s+/).forEach((w) => result.push({ text: w, italic: isItalic }));
                }
            }
        });

        return result;
    }

    // ==========================================
    // 1. SMOOTH SCROLL (LENIS) — UNIFICADO
    // ==========================================
    let lenis = null;
    let isMobileViewport = window.matchMedia("(max-width: 767px)").matches;

    if (!PREFERS_REDUCED_MOTION && typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: isMobileViewport ? 0.8 : 1.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: true,
            touchMultiplier: isMobileViewport ? 1.8 : 1.5
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(500, 33);
    }

    // ==========================================
    // 2. CINEMATIC GRAIN ENGINE (sem alterações)
    // ==========================================
    function initPerformanceGrain(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        let width, height, isVisible = false;

        function resizeCanvas() {
            const parent = canvas.parentElement;
            if (!parent) return;
            width = canvas.width = parent.offsetWidth;
            height = canvas.height = parent.offsetHeight;
        }

        resizeCanvas();

        const patternSize = 128;
        const patternCanvas = document.createElement("canvas");
        patternCanvas.width = patternSize;
        patternCanvas.height = patternSize;
        const patternCtx = patternCanvas.getContext("2d");
        const imgData = patternCtx.createImageData(patternSize, patternSize);
        const buffer = new Uint32Array(imgData.data.buffer);

        for (let i = 0; i < buffer.length; i++) {
            if (Math.random() < 0.08) buffer[i] = 0xffffffff;
        }
        patternCtx.putImageData(imgData, 0, 0);
        const pattern = ctx.createPattern(patternCanvas, "repeat");

        function drawGrain() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = pattern;
            ctx.save();
            ctx.translate(Math.random() * -patternSize, Math.random() * -patternSize);
            ctx.fillRect(0, 0, width + patternSize, height + patternSize);
            ctx.restore();
        }

        drawGrain();

        if (!PREFERS_REDUCED_MOTION) {
            let lastFrameTime = 0;
            const fpsInterval = 1000 / 12;

            function renderLoop(currentTime) {
                if (!isVisible) return;
                requestAnimationFrame(renderLoop);
                const elapsed = currentTime - lastFrameTime;
                if (elapsed > fpsInterval) {
                    lastFrameTime = currentTime - (elapsed % fpsInterval);
                    drawGrain();
                }
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    isVisible = entry.isIntersecting;
                    if (isVisible) requestAnimationFrame(renderLoop);
                });
            }, { threshold: 0.05 });

            observer.observe(canvas);
        }

        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                drawGrain();
            }, 200);
        }, { passive: true });
    }

    initPerformanceGrain("footer-grain");

    // ==========================================
    // 3. FORMS & NAV ANCHORS (sem alterações)
    // ==========================================
    const whatsappForm = document.getElementById('whatsappForm');
    const whatsappSubmitBtn = document.getElementById('whatsappSubmitBtn');

    function sendWhatsAppMessage(e) {
        if (e) e.preventDefault();
        if (!whatsappForm) return;

        const phone = whatsappForm.dataset.phone;
        const firstName = document.getElementById('firstName')?.value.trim();
        const lastName = document.getElementById('lastName')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const description = document.getElementById('description')?.value.trim() || '';

        if (!firstName || !lastName || !email) {
            alert("Por favor, preencha os campos obrigatórios (Nome, Sobrenome e E-mail).");
            return;
        }

        const message = encodeURIComponent(
            `Olá, meu nome é ${firstName} ${lastName}. Meu e-mail é ${email}. Estamos buscando uma solução para: ${description}`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener");
    }

    if (whatsappForm) whatsappForm.addEventListener('submit', sendWhatsAppMessage);
    if (whatsappSubmitBtn) whatsappSubmitBtn.addEventListener('click', sendWhatsAppMessage);

    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(targetElement, { offset: 0, duration: 1.2 });
                } else {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });

    // ==========================================
    // 4. GLOBAL TEXT ANIMATIONS
    //    (fix: itálico preservado via getTextWithItalicMap)
    // ==========================================
    if (!PREFERS_REDUCED_MOTION) {
        const sectionTitle = document.querySelector(".section-title");
        if (sectionTitle) {
            const wordData = getTextWithItalicMap(sectionTitle);
            const ariaText = wordData.map((w) => w.text).join(" ");
            sectionTitle.setAttribute("aria-label", ariaText);
            sectionTitle.innerHTML = "";

            const fragment = document.createDocumentFragment();

            wordData.forEach((wordObj, wordIndex) => {
                const maskSpan = document.createElement("span");
                maskSpan.style.display = "inline-block";
                maskSpan.style.overflow = "hidden";
                maskSpan.style.verticalAlign = "top";

                const wordSpan = document.createElement("span");
                wordSpan.className = "editorial-word" + (wordObj.italic ? " italic" : "");
                wordSpan.style.display = "inline-block";
                wordSpan.setAttribute("aria-hidden", "true");
                wordSpan.textContent = wordObj.text;

                maskSpan.appendChild(wordSpan);
                fragment.appendChild(maskSpan);

                if (wordIndex < wordData.length - 1) {
                    fragment.appendChild(document.createTextNode("\u00A0"));
                }
            });

            sectionTitle.appendChild(fragment);

            gsap.fromTo(
                sectionTitle.querySelectorAll(".editorial-word"),
                { y: "110%" },
                {
                    y: "0%",
                    duration: 1,
                    stagger: 0.08,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sectionTitle,
                        start: "top 85%",
                        end: "top 45%",
                        scrub: 1
                    }
                }
            );
        }

        const processTitle = document.querySelector(".process-title");
        if (processTitle) {
            const wordData = getTextWithItalicMap(processTitle);
            const ariaText = wordData.map((w) => w.text).join(" ");
            processTitle.setAttribute("aria-label", ariaText);
            processTitle.innerHTML = "";

            const fragment = document.createDocumentFragment();

            wordData.forEach((wordObj, wordIndex) => {
                const wordSpan = document.createElement("span");
                wordSpan.className = "letter-word" + (wordObj.italic ? " italic" : "");
                wordSpan.setAttribute("aria-hidden", "true");

                wordObj.text.split("").forEach((char) => {
                    const charSpan = document.createElement("span");
                    charSpan.className = "char";
                    charSpan.textContent = char;
                    wordSpan.appendChild(charSpan);
                });

                fragment.appendChild(wordSpan);
                if (wordIndex < wordData.length - 1) fragment.appendChild(document.createTextNode("\u00A0"));
            });

            processTitle.appendChild(fragment);

            gsap.fromTo(
                processTitle.querySelectorAll(".char"),
                { color: "rgba(18, 46, 226, 0.18)" },
                {
                    color: "#122ee2",
                    stagger: 0.02,
                    ease: "none",
                    scrollTrigger: { trigger: processTitle, start: "top 85%", end: "bottom 50%", scrub: true }
                }
            );
        }
    }

    // ==========================================
    // 5. GSAP MATCHMEDIA (ENGINE UNIFICADO)
    // ==========================================
    const mm = gsap.matchMedia();

    mm.add(
        {
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        },
        (context) => {
            const { isDesktop, isMobile } = context.conditions;

            if (PREFERS_REDUCED_MOTION) return;

            // --- 5.1 Hero Shrink Animation (roda em ambas as telas) ---
            const heroSection = document.querySelector(".hero-section");
            const heroWrapper = document.querySelector(".hero-video-wrapper");
            const heroOverlay = document.querySelector(".hero-overlay");

            if (heroSection && heroWrapper && heroOverlay) {
                gsap.set([heroWrapper, heroOverlay], {
                    top: 0, left: 0, right: 0, bottom: 0, borderRadius: 0
                });

                gsap.to([heroWrapper, heroOverlay], {
                    top: isMobile ? "3vw" : "1.5vw",
                    left: isMobile ? "3vw" : "1.5vw",
                    right: isMobile ? "3vw" : "1.5vw",
                    bottom: isMobile ? "3vw" : "1.5vw",
                    borderRadius: isMobile ? "6vw" : "4vw",
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroSection,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                });
            }

            // --- 5.2 Portfolio Scroll ---
            // pin + scroll horizontal só no desktop; no mobile, reveal
            // simples por card ao entrar na viewport.
            const projectsSection = document.querySelector(".projects-section");
            const cardsWrapper = document.querySelector(".cards-wrapper");

            if (isDesktop && projectsSection && cardsWrapper) {
                const getScrollAmount = () => {
                    return -(cardsWrapper.scrollWidth - window.innerWidth + (window.innerWidth * 0.05));
                };

                gsap.to(cardsWrapper, {
                    x: getScrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: projectsSection,
                        pin: true,
                        start: "top top",
                        end: () => `+=${cardsWrapper.scrollWidth}`,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true
                    }
                });
            } else if (isMobile && cardsWrapper) {
                const mobileCards = cardsWrapper.querySelectorAll(".card-item");
                mobileCards.forEach((card) => {
                    gsap.fromTo(card,
                        { y: 24, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.6,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 90%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                });
            }

            // --- 5.3 Initiative Section Pin Sync (roda em ambas as telas) ---
            const initiativeSection = document.querySelector(".initiative-section");
            const initiativeNumbers = document.querySelectorAll(".initiative-number");
            const initiativeStats = document.querySelectorAll(".initiative-stat");

            if (initiativeSection && initiativeNumbers.length > 0) {
                ScrollTrigger.create({
                    trigger: initiativeSection,
                    pin: true,
                    start: "top top",
                    end: () => "+=" + Math.round(window.innerHeight * (isMobile ? 2.2 : 3)),
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const step = 1 / initiativeNumbers.length;
                        const index = Math.min(
                            Math.floor(self.progress / step),
                            initiativeNumbers.length - 1
                        );

                        initiativeNumbers.forEach((el, i) => el.classList.toggle("active", i === index));
                        initiativeStats.forEach((el, i) => el.classList.toggle("active", i === index));
                    }
                });
            } else if (initiativeNumbers.length > 0) {
                initiativeNumbers.forEach((el, i) => el.classList.toggle("active", i === 0));
                initiativeStats.forEach((el, i) => el.classList.toggle("active", i === 0));
            }

            // --- 5.4 Service Items — hover no desktop, scroll-trigger no mobile ---
            const serviceItems = document.querySelectorAll(".service-item");

            if (isDesktop) {
                serviceItems.forEach((item) => {
                    const enter = () => gsap.to(item, { x: 20, duration: 0.3, ease: "power2.out" });
                    const leave = () => gsap.to(item, { x: 0, duration: 0.3, ease: "power2.out" });
                    item.addEventListener("mouseenter", enter);
                    item.addEventListener("mouseleave", leave);
                });
            } else {
                serviceItems.forEach((item) => {
                    gsap.fromTo(item,
                        { x: 0 },
                        {
                            x: 12,
                            duration: 0.4,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: item,
                                start: "top 80%",
                                toggleActions: "play reverse play reverse"
                            }
                        }
                    );
                });
            }

            // --- 5.5 Card entrance (mantido, coerente com desktop e mobile) ---
            const cards = document.querySelectorAll(".card-item");
            if (cards.length > 0) {
                cards.forEach((card) => {
                    gsap.fromTo(card,
                        { y: 30, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 88%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                });
            }

            // Cleanup ao trocar de breakpoint (matchMedia re-executa o contexto)
            return () => {
                if (cardsWrapper) gsap.set(cardsWrapper, { clearProps: "transform" });
                serviceItems.forEach((item) => gsap.set(item, { clearProps: "transform" }));
            };
        }
    );

    // ==========================================
    // 6. LAYOUT REFRESH SYNC & RESIZE OBSERVER
    // ==========================================
    window.addEventListener("load", () => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            ScrollTrigger.refresh();
        });
    }

    let refreshTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(refreshTimeout);
        refreshTimeout = setTimeout(() => {
            isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
            ScrollTrigger.refresh();
        }, 150);
    }, { passive: true });
});