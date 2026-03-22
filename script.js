/* ================================================================
   JETAJI CONSTRUCTION — script.js
   Simple, well-commented JavaScript for all interactions.
================================================================ */

/* ── 1. NAVBAR: Add scrolled class when page is scrolled ─────── */
const navbar = document.getElementById('navbar');

function handleScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run once on load


/* ── 2. HAMBURGER MENU: Toggle mobile nav open/close ─────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', function () {
  // Toggle active class (shows X animation)
  hamburger.classList.toggle('active');
  // Toggle open class (slides down the menu)
  mobileNav.classList.toggle('open');
});

// Close mobile menu when any link inside it is clicked
const mobileLinks = document.querySelectorAll('.mlink');
mobileLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
  });
});


/* ── 3. SMOOTH SCROLL: Intercept all anchor-links ────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });
});


/* ── 4. SCROLL REVEAL: Animate elements as they enter/leave viewport ── */
// Elements animate IN when scrolled into view.
// Elements animate OUT (disappear) when scrolled back above viewport.

const revealElements = document.querySelectorAll('.rv, .rv-left, .rv-right');

function checkReveal() {
  revealElements.forEach(function (el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Animate IN: element is visible within the viewport
    if (rect.top <= windowHeight * 0.88 && rect.bottom >= 0) {
      el.classList.add('in-view');
    }
    // Animate OUT (scroll up): element has gone above the top of viewport
    else if (rect.bottom < 0) {
      el.classList.remove('in-view');
    }
    // Animate OUT (scroll down): element has gone below the bottom of viewport
    else if (rect.top > windowHeight) {
      el.classList.remove('in-view');
    }
  });
}

window.addEventListener('scroll', checkReveal, { passive: true });
checkReveal(); // run once on page load


/* ── 5. COUNTER ANIMATION: Count up numbers in the stats bar ─── */
// Elements with data-target="350" count from 0 to 350

let countersStarted = false;

function startCounters() {
  if (countersStarted) return;

  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  const rect = statsBar.getBoundingClientRect();
  if (rect.top > window.innerHeight) return;

  countersStarted = true;

  const counters = document.querySelectorAll('.snum[data-target]');

  counters.forEach(function (counter) {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // ~60fps
    let current = 0;

    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

window.addEventListener('scroll', startCounters, { passive: true });
startCounters(); // check on load too


/* ── 6. SERVICE CARDS: 3D tilt effect on mouse move ─────────── */
// Each service card tilts slightly toward the mouse position

const svcCards = document.querySelectorAll('.svc-card');

svcCards.forEach(function (card) {

  card.addEventListener('mousemove', function (e) {
    const rect = card.getBoundingClientRect();
    // Mouse position relative to card center (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Tilt max ±8 degrees
    const rotateY = x * 8;
    const rotateX = -y * 6;

    card.style.transform =
      'translateY(-10px) scale(1.01) perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
  });

  card.addEventListener('mouseleave', function () {
    // Reset transform on leave
    card.style.transform = '';
  });
});


/* ── 7. PROJECT CARDS: Subtle parallax on hover ─────────────── */
const projCards = document.querySelectorAll('.proj-card');

projCards.forEach(function (card) {
  card.addEventListener('mousemove', function (e) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateY = x * 5;
    const rotateX = -y * 4;

    card.style.transform =
      'translateY(-6px) perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
  });

  card.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
});


/* ── 8. CONTACT FORM: Send message to WhatsApp ───────────────── */
// When the form is submitted, builds a WhatsApp message URL
// and opens wa.me with the formatted message.
// The user's WhatsApp app opens with the message pre-filled.

const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // stop normal form submission

    // Collect form values
    const name    = document.getElementById('fn').value.trim();
    const email   = document.getElementById('fe').value.trim();
    const phone   = document.getElementById('fp').value.trim();
    const service = document.getElementById('fs').value.trim();
    const message = document.getElementById('fm').value.trim();

    // Basic validation
    if (!name) {
      showFormError('Please enter your name.');
      return;
    }
    if (!email || !email.includes('@')) {
      showFormError('Please enter a valid email address.');
      return;
    }
    if (!message) {
      showFormError('Please enter a message.');
      return;
    }

    // Build the WhatsApp message text
    let waText = '*New Enquiry — Jetaji Construction*\n\n';
    waText += '👤 *Name:* ' + name + '\n';
    waText += '📧 *Email:* ' + email + '\n';

    if (phone) {
      waText += '📞 *Phone:* ' + phone + '\n';
    }
    if (service) {
      waText += '🏗️ *Service:* ' + service + '\n';
    }

    waText += '\n📝 *Message:*\n' + message;

    // Encode for URL
    const encodedText = encodeURIComponent(waText);

    // WhatsApp number (country code + number, no spaces or +)
    const waNumber = '917339755053';

    // Build final WhatsApp URL
    const waURL = 'https://wa.me/' + waNumber + '?text=' + encodedText;

    // Change button text to show success
    submitBtn.textContent = '✅ Opening WhatsApp...';
    submitBtn.style.background = '#25D366';
    submitBtn.disabled = true;

    // Open WhatsApp in a new tab
    window.open(waURL, '_blank', 'noopener,noreferrer');

    // Reset form after 2.5 seconds
    setTimeout(function () {
      contactForm.reset();
      submitBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Send via WhatsApp';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 2500);
  });
}

// Helper: show simple inline error message
function showFormError(msg) {
  // Remove existing error if any
  const existing = document.querySelector('.form-error-msg');
  if (existing) existing.remove();

  const err = document.createElement('p');
  err.className = 'form-error-msg';
  err.textContent = '⚠️ ' + msg;
  err.style.cssText = 'color:#ff6b6b;font-size:13px;margin-bottom:12px;padding:10px 14px;background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);';

  submitBtn.parentNode.insertBefore(err, submitBtn);

  // Auto-remove after 4 seconds
  setTimeout(function () {
    if (err.parentNode) err.remove();
  }, 4000);
}


/* ── 9. ACTIVE NAV LINK: Highlight link for current section ──── */
// Adds an 'active' visual to the nav link matching the visible section

const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let currentId = '';
  const scrollY = window.scrollY;
  const navH = navbar.offsetHeight;

  sections.forEach(function (section) {
    const top = section.offsetTop - navH - 60;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      currentId = section.id;
    }
  });

  navAnchors.forEach(function (link) {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === '#' + currentId) {
      link.classList.add('active-link');
    }
  });
}

// Add active-link style inline (keeps CSS minimal)
const activeStyle = document.createElement('style');
activeStyle.textContent = '.nav-links a.active-link { color: var(--gold); } .nav-links a.active-link::after { width: 100%; }';
document.head.appendChild(activeStyle);

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


/* ── 10. HERO SHAPES: Subtle mouse parallax ─────────────────── */
// The floating geometric shapes in the hero move slightly with mouse

const heroSection = document.querySelector('.hero');
const shapes = document.querySelectorAll('.shape');

if (heroSection && shapes.length) {
  heroSection.addEventListener('mousemove', function (e) {
    const rect = heroSection.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;  // 0 to 1
    const mouseY = (e.clientY - rect.top)  / rect.height; // 0 to 1

    shapes.forEach(function (shape, i) {
      // Different speeds for each shape (parallax depth effect)
      const speed = (i + 1) * 12;
      const moveX = (mouseX - 0.5) * speed;
      const moveY = (mouseY - 0.5) * speed;
      shape.style.transform =
        'translate(' + moveX + 'px, ' + moveY + 'px) rotate(' + (15 + i * 20) + 'deg)';
    });
  });

  heroSection.addEventListener('mouseleave', function () {
    shapes.forEach(function (shape, i) {
      shape.style.transform = 'rotate(' + (15 + i * 20) + 'deg)';
    });
  });
}


/* ── 11. PAGE LOAD: Fade in body content ────────────────────── */
// Prevents any flash of un-styled content on load

document.documentElement.style.opacity = '0';
document.documentElement.style.transition = 'opacity 0.4s ease';

window.addEventListener('load', function () {
  document.documentElement.style.opacity = '1';
  // Trigger reveal for anything already in viewport
  checkReveal();
  startCounters();
});