// AlphaOrbit Worldwide Ltd — site interactivity
document.addEventListener('DOMContentLoaded', () => {

    // Enable JS-powered reveal animations (CSS defaults to fully visible if JS fails)
    document.body.classList.add('js-ready');

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', open);
            const icon = menuToggle.querySelector('i');
            if (icon) icon.className = open ? 'ti ti-x' : 'ti ti-menu-2';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', false);
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'ti ti-menu-2';
            });
        });
    }

    // Scroll: active nav highlight + header shadow + back-to-top visibility
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta-btn)');
    const btt = document.getElementById('btt');
    const header = document.getElementById('mainHeader');

    const onScroll = () => {
        let current = 'home';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 140) current = sec.getAttribute('id');
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `#${current}`);
        });

        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
        if (btt) btt.classList.toggle('show', window.scrollY > 500);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (btt) {
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Scroll reveal via IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    // Contact form submission (Formspree)
    const contactForm = document.getElementById('contactForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formSubmitBtn && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = '<i class="ti ti-loader-2 spin"></i> Submitting&hellip;';
            formStatus.className = 'form-status-msg';
            formStatus.innerText = '';

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.className = 'form-status-msg success';
                    formStatus.innerHTML = '<i class="ti ti-circle-check"></i> Inquiry received! Our team will reach out within 24 hours.';
                    contactForm.reset();
                } else {
                    const err = await response.json().catch(() => null);
                    formStatus.className = 'form-status-msg error';
                    formStatus.innerHTML = '<i class="ti ti-alert-circle"></i> ' +
                        (err && err.errors ? err.errors.map(e => e.message).join(', ') : 'Submission failed. Please try again.');
                }
            } catch {
                formStatus.className = 'form-status-msg error';
                formStatus.innerHTML = '<i class="ti ti-wifi-off"></i> Network error. Please check your connection.';
            } finally {
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = '<i class="ti ti-send"></i> Send Inquiry';
            }
        });
    }
});