// =========================================================
// STUDIO.CRAFT — script.js (JavaScript puro, sem dependências)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initSmoothScroll();
    initSidebar();
    initActiveLinkOnScroll();
});

/* ---------- Animação de revelação no scroll ---------- */
function initScrollReveal() {
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ---------- Rolagem suave para âncoras internas ---------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });

            // Fecha a sidebar automaticamente em telas menores que desktop
            if (window.innerWidth < 1024) {
                closeSidebar();
            }
        });
    });
}

/* ---------- Abrir / fechar a sidebar (mobile e tablet) ---------- */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');
    const backdrop = document.getElementById('sidebarBackdrop');

    if (!sidebar || !toggle || !backdrop) return;

    toggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('is-open');
        isOpen ? closeSidebar() : openSidebar();
    });

    backdrop.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeSidebar();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('is-open');
            backdrop.classList.remove('is-visible');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function openSidebar() {
    document.getElementById('sidebar').classList.add('is-open');
    document.getElementById('sidebarBackdrop').classList.add('is-visible');
    document.getElementById('sidebarToggle').setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('is-open');
    document.getElementById('sidebarBackdrop').classList.remove('is-visible');
    document.getElementById('sidebarToggle').setAttribute('aria-expanded', 'false');
}

/* ---------- Destaca o link ativo da sidebar conforme a seção visível ---------- */
function initActiveLinkOnScroll() {
    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('.sidebar__link[data-nav]');

    if (!sections.length || !links.length) return;

    const setActive = (id) => {
        links.forEach((link) => {
            const isMatch = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', isMatch);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
}