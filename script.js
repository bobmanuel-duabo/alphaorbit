document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile Menu Toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when a nav link is clicked (but not the dropdown trigger)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        const isDropdownTrigger = link.closest('.nav-dropdown') && !link.closest('.nav-dropdown-menu');
        if (isDropdownTrigger && window.innerWidth <= 960) return;
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Mobile Divisions Dropdown Toggle ---------- */
  const navDropdown = document.getElementById('navDropdown');
  if (navDropdown) {
    const dropdownTrigger = navDropdown.querySelector('a');
    dropdownTrigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        navDropdown.classList.toggle('open');
      }
    });
  }

  /* ---------- Sticky Header Shrink on Scroll ---------- */
  const header = document.getElementById('mainHeader');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll();

  /* ---------- Active Nav Link on Scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ---------- Scroll Reveal Animations ---------- */
  document.body.classList.add('js-ready');
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Back To Top Button ---------- */
  const btt = document.getElementById('btt');
  if (btt) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btt.classList.add('show');
      } else {
        btt.classList.remove('show');
      }
    });
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 90;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- Contact Form Submission (Formspree) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ti ti-loader-2"></i> Sending...';
      formStatus.textContent = '';
      formStatus.className = 'form-status-msg';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.textContent = 'Thank you. Your inquiry has been received — our team will respond within 24 business hours.';
          formStatus.classList.add('success');
          contactForm.reset();
        } else {
          formStatus.textContent = 'Something went wrong sending your inquiry. Please try again or email us directly.';
          formStatus.classList.add('error');
        }
      } catch (error) {
        formStatus.textContent = 'Network error. Please check your connection and try again, or email us directly.';
        formStatus.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

  /* ---------- FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 24 + 'px';
      }
    });
  });

  /* ---------- Cookie Consent Banner ---------- */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');
  const COOKIE_KEY = 'alphaorbit_cookie_consent';

  if (cookieBanner) {
    let consent = null;
    try { consent = localStorage.getItem(COOKIE_KEY); } catch (e) { /* storage unavailable */ }

    if (!consent) {
      window.setTimeout(function () { cookieBanner.classList.add('show'); }, 600);
    }

    function setConsent(value) {
      try { localStorage.setItem(COOKIE_KEY, value); } catch (e) { /* storage unavailable */ }
      cookieBanner.classList.remove('show');
    }

    if (cookieAccept) {
      cookieAccept.addEventListener('click', function () { setConsent('accepted'); });
    }
    if (cookieDecline) {
      cookieDecline.addEventListener('click', function () { setConsent('declined'); });
    }
  }

  /* ---------- Interactive Freight Calculator Logic ---------- */
  const freightForm = document.getElementById('freightForm');
  if (freightForm) {
    freightForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Variable Base Configs
      const modeRates = { ocean: 0.45, air: 4.20, land: 1.15 };
      const regionSurcharges = { domestic: 150, international: 520 };

      // Inputs Values
      const mode = document.getElementById('transitMode').value;
      const weight = parseFloat(document.getElementById('cargoWeight').value);
      const origin = document.getElementById('origin').value;
      const destination = document.getElementById('destination').value;

      if (isNaN(weight) || weight <= 0) return;

      // Rate Computations
      let costPerKg = modeRates[mode] || 0.50;
      let baseFreightCost = weight * costPerKg;
      let baseSurcharge = regionSurcharges[destination] || 200;

      // Handle Cross-Border / High Intermodal Multipliers
      if (origin === 'international' && destination === 'international') {
        baseSurcharge *= 1.4;
      }

      const totalEstimate = baseFreightCost + baseSurcharge;

      // DOM Updates
      const resultBox = document.getElementById('calcResult');
      const priceDisplay = document.getElementById('estimatedPrice');

      if (resultBox && priceDisplay) {
        priceDisplay.textContent = '$' + totalEstimate.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + ' USD';

        resultBox.style.display = 'block';

        // Scroll adjustment to seamlessly view pricing data
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

});