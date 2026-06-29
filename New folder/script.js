/**
 * AlphaOrbit Worldwide Ltd - Core Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inform CSS that JavaScript executed successfully to unlock scrolls safely
    document.body.classList.add('js-ready');

    // Mobile Navigation Drawer Toggle Handler
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', open);
            menuToggle.querySelector('i').className = open ? 'ti ti-x' : 'ti ti-menu-2';
        });

        // Close on navigation click (mobile UX optimization)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', false);
                menuToggle.querySelector('i').className = 'ti ti-menu-2';
            });
        });
    }

    // Active Link Indicators & Floating Headers Tracking Logic
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta-btn)');
    const btt = document.getElementById('btt');
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        let current = 'home';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 140) {
                current = sec.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === '#' + current);
        });

        // Dynamic Style Changes on Active Header Scroll
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
        if (btt) btt.classList.toggle('show', window.scrollY > 500);
    });

    // Topward Scroll Trigger Handler
    if (btt) {
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // DOM Intersection Observers (Fluid Scroll Transitions)
    const observerOptions = { threshold: 0.05, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Asynchronous Form Processing (Formspree Integration Engine)
    const contactForm = document.getElementById('contactForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async e => {
            e.preventDefault();

            // Locking triggers to prevent double form submission bugs
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = '<i class="ti ti-loader-2 spin"></i> Submitting&hellip;';
            formStatus.className = 'form-status-msg';
            formStatus.innerText = '';

            try {
                const res = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    formStatus.className = 'form-status-msg success';
                    formStatus.innerHTML = '<i class="ti ti-circle-check"></i> Inquiry received! Our team will reach out within 24 hours.';
                    contactForm.reset();
                } else {
                    const err = await res.json();
                    formStatus.className = 'form-status-msg error';
                    formStatus.innerHTML = '<i class="ti ti-alert-circle"></i> ' +
                        (err.errors ? err.errors.map(e => e.message).join(', ') : 'Submission failed. Please try again.');
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