/* ======================================================
   { deploy } — MAIN SCRIPT
   Organizado em blocos:
   1. GSAP setup & Hero reveal
   2. Scroll reveal genérico (.reveal-el)
   3. Animação Gráfico de Barras (Stats) via GSAP
   4. Film grain engine
   5. FAQ accordion
   6. Formulário de contato → WhatsApp
   ====================================================== */

// 1. REGISTRO DO GSAP
gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------
   1. HERO REVEAL (PAGELOAD)
------------------------------------------------------ */
window.addEventListener('DOMContentLoaded', () => {
    const tlHero = gsap.timeline();

    tlHero
        .from(".navbar", {
            y: -30,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        })
        .from(".hero-tagline", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.8")
        .from(".hero-title", {
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        }, "-=0.6")
        .from(".hero-text p", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.8");
});

/* ------------------------------------------------------
   2. SCROLL REVEAL GENÉRICO
------------------------------------------------------ */
document.querySelectorAll(".reveal-el").forEach((el) => {
    gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

/* ------------------------------------------------------
   3. ANIMAÇÃO GRÁFICO DE BARRAS (STATS - GSAP)
------------------------------------------------------ */
window.addEventListener('DOMContentLoaded', () => {
    const statBars = document.querySelectorAll('.stat-bar');

    if (statBars.length > 0) {
        statBars.forEach((bar) => {
            const targetHeight = bar.getAttribute('data-height');

            gsap.fromTo(bar, 
                { height: "0%" },
                {
                    height: targetHeight,
                    duration: 1.4,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: "#statsSection",
                        start: "top 75%", // Animando assim que a seção entra no campo de visão
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }
});

/* ------------------------------------------------------
   4. FILM GRAIN ENGINE
------------------------------------------------------ */
function createGrainEngine({ canvasEl, sizeSource, frameCount = 8, tileSize = 300, targetFps = 20 }) {
    if (!canvasEl || !sizeSource) {
        console.warn('createGrainEngine: elemento não encontrado, engine não iniciada.');
        return;
    }

    const ctx = canvasEl.getContext('2d');

    function resize() {
        const isBody = sizeSource === document.body;
        canvasEl.width = isBody ? window.innerWidth : sizeSource.clientWidth;
        canvasEl.height = isBody ? window.innerHeight : sizeSource.clientHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const tiles = [];
    for (let f = 0; f < frameCount; f++) {
        const off = document.createElement('canvas');
        off.width = tileSize;
        off.height = tileSize;
        const octx = off.getContext('2d');
        const imgData = octx.createImageData(tileSize, tileSize);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const v = (Math.random() * 255) | 0;
            const a = 90 + ((Math.random() * 120) | 0);
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = a;
        }
        octx.putImageData(imgData, 0, 0);
        tiles.push(off);
    }

    let frame = 0;
    let lastFrameTime = 0;
    const frameInterval = 1000 / targetFps;
    let isIntersecting = true;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isIntersecting = entry.isIntersecting;
            });
        });
        observer.observe(canvasEl);
    }

    function draw(timestamp) {
        requestAnimationFrame(draw);

        if (document.hidden || !isIntersecting) return;
        if (timestamp - lastFrameTime < frameInterval) return;
        lastFrameTime = timestamp;

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        const pattern = ctx.createPattern(tiles[frame % frameCount], 'repeat');
        const dx = (Math.random() * tileSize) | 0;
        const dy = (Math.random() * tileSize) | 0;
        const m = new DOMMatrix().translate(dx, dy);
        pattern.setTransform(m);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
        frame++;
    }

    requestAnimationFrame(draw);
}

// Inicializa os grains após a página carregar
window.addEventListener('DOMContentLoaded', () => {
    createGrainEngine({
        canvasEl: document.getElementById('light-grain'),
        sizeSource: document.body,
        targetFps: 20
    });

    createGrainEngine({
        canvasEl: document.getElementById('portfolio-grain'),
        sizeSource: document.querySelector('.portfolio-section'),
        targetFps: 20
    });

    createGrainEngine({
        canvasEl: document.getElementById('process-grain'),
        sizeSource: document.querySelector('.process-section'),
        targetFps: 20
    });

    createGrainEngine({
        canvasEl: document.getElementById('footer-grain'),
        sizeSource: document.querySelector('.footer-content'),
        targetFps: 20
    });
});

/* ------------------------------------------------------
   5. FAQ ACCORDION
------------------------------------------------------ */
document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const item = trigger.parentElement;
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        if (!isActive) {
            item.classList.add('active');
        }
    });
});

/* ------------------------------------------------------
   6. FORMULÁRIO DE CONTATO → WHATSAPP
------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    const whatsappForm = document.getElementById('whatsappForm');
    const whatsappSubmitBtn = document.getElementById('whatsappSubmitBtn');

    if (!whatsappForm || !whatsappSubmitBtn) return;

    // Dispara a validação e o envio ao clicar na tag <a>
    whatsappSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (whatsappForm.checkValidity()) {
            whatsappForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        } else {
            whatsappForm.reportValidity();
        }
    });

    // Processa os dados e redireciona para o WhatsApp
    whatsappForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const phone = this.getAttribute('data-phone');

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const description = document.getElementById('description').value.trim();

        let message = `*Novo Contato via Site*\n\n`;
        message += `*Nome:* ${firstName} ${lastName}\n`;
        message += `*E-mail:* ${email}\n`;

        if (description) {
            message += `*Descrição do Projeto:* ${description}\n`;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    });
});