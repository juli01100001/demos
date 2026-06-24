const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const container = document.getElementById('carouselContainer');

let currentTranslate = 0;
let maxScroll = 0;

function updateMaxScroll() {
    maxScroll = track.scrollWidth - container.clientWidth + 40;
    if (maxScroll < 0) maxScroll = 0;
}
window.addEventListener('resize', updateMaxScroll);
setTimeout(updateMaxScroll, 200);

nextBtn.addEventListener('click', () => {
    updateMaxScroll();
    currentTranslate -= 340;
    if (Math.abs(currentTranslate) > maxScroll) currentTranslate = -maxScroll;
    track.style.transform = `translateX(${currentTranslate}px)`;
});

prevBtn.addEventListener('click', () => {
    currentTranslate += 340;
    if (currentTranslate > 0) currentTranslate = 0;
    track.style.transform = `translateX(${currentTranslate}px)`;
});


let isDragging = false;
let startX = 0;
let prevTranslate = 0;

container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    prevTranslate = currentTranslate;
    track.style.transition = 'none';
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1)';
    currentTranslate = Math.max(Math.min(currentTranslate, 0), -maxScroll);
    track.style.transform = `translateX(${currentTranslate}px)`;
});

container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = x - startX;
    currentTranslate = prevTranslate + walk;
    track.style.transform = `translateX(${currentTranslate}px)`;
});


document.addEventListener("DOMContentLoaded", () => {
    const accordionItems = document.querySelectorAll(".accordion-item");

    accordionItems.forEach(item => {
        // Encontra o gatilho (+ ou -) dentro deste item
        const trigger = item.querySelector(".accordion-trigger");

        item.addEventListener("click", (e) => {
            // Evita bugs caso o clique aconteça exatamente em links internos, se houver
            if (e.target.tagName === 'A') return;

            const isActive = item.classList.contains("active");

            // 1. Fecha todos os itens e resgata o sinal para '+'
            accordionItems.forEach(i => {
                i.classList.remove("active");
                const t = i.querySelector(".accordion-trigger");
                if (t) t.textContent = "+";
            });

            // 2. Se o item clicado não estava ativo, ativa ele e muda o sinal para '-'
            if (!isActive) {
                item.classList.add("active");
                if (trigger) trigger.textContent = "-";
            }
        });
    });
});