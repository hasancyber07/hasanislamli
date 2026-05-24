/* ============================================================
   HASAN // CYBERSEC PORTFOLIO
   script.js — Main JavaScript
   Author: Hasan
   ============================================================ */

'use strict';

/* ============================================================
   1. CUSTOM CURSOR
============================================================ */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId  = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follows dot with lerp
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Grow cursor on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .project-card, .tool-hex');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'var(--green)';
      ring.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'var(--green)';
      ring.style.opacity = '0.5';
    });
  });
})();


/* ============================================================
   2. MATRIX RAIN CANVAS
============================================================ */
(function initMatrix() {
  const canvas  = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const chars   = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01アイウエ10ABCDEF0110';
  const fontSize = 13;
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  }

  resize();
  window.addEventListener('resize', resize);

  function drawMatrix() {
    // Semi-transparent black layer for trail effect
    ctx.fillStyle = 'rgba(5, 10, 14, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green characters
    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      // Reset drop randomly once it goes off screen
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(drawMatrix, 50);
})();


/* ============================================================
   3. NAVBAR — scroll effect + mobile toggle
============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const spans     = toggle ? toggle.querySelectorAll('span') : [];

  // Scroll class
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      // Animate hamburger to X
      if (open) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }
})();


/* ============================================================
   4. TYPING ANIMATION (hero)
============================================================ */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Cybersecurity Student',
    'Linux Operator',
    'Python Developer',
    'CTF Competitor',
    'Security Researcher',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let delay     = 110;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      // Typing forward
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        // Pause before deleting
        deleting = true;
        delay = 1800;
      } else {
        delay = 90 + Math.random() * 60;
      }
    } else {
      // Deleting
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 400;
      } else {
        delay = 45;
      }
    }

    setTimeout(type, delay);
  }

  // Start after a short boot delay
  setTimeout(type, 900);
})();


/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children within a parent if they share a reveal parent
          const el = entry.target;
          el.classList.add('visible');
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   6. SKILL BARS ANIMATION
============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const width = bar.getAttribute('data-width');
          // Small delay for visual effect
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
})();


/* ============================================================
   7. TERMINAL SIMULATION
============================================================ */
(function initTerminal() {
  const output = document.getElementById('terminalOutput');
  if (!output) return;

  // Script: array of [delay_ms, class, text]
  const script = [
    [300,  'term-cmd',  '> sudo ./boot_sequence.sh'],
    [600,  'term-info', '[INFO]  Loading kernel modules...'],
    [900,  'term-ok',   '[OK]    Module crypto_aes loaded'],
    [1100, 'term-ok',   '[OK]    Module net_filter loaded'],
    [1350, 'term-info', '[INFO]  Initializing firewall rules...'],
    [1700, 'term-ok',   '[OK]    iptables rules applied (22 rules)'],
    [2000, 'term-cmd',  '> nmap -sV --open 192.168.1.0/24'],
    [2300, 'term-info', '[SCAN]  Starting Nmap 7.94 ( https://nmap.org )'],
    [2600, 'term-info', '[SCAN]  Scanning 256 hosts ...'],
    [3200, 'term-blue', '[FOUND] 192.168.1.1 — Router (80, 443)'],
    [3600, 'term-blue', '[FOUND] 192.168.1.10 — Device  (22, 8080)'],
    [4100, 'term-blue', '[FOUND] 192.168.1.42 — Server  (22, 80, 3306)'],
    [4500, 'term-warn', '[WARN]  Port 3306 open to network — risk: HIGH'],
    [4900, 'term-cmd',  '> python3 password_gen.py --length 32 --symbols'],
    [5200, 'term-info', '[GEN]   Entropy: 210 bits'],
    [5400, 'term-ok',   '[OUT]   K#9@mX!2qL$vRn7&eP3*wZ6tYj^cD0s'],
    [5800, 'term-cmd',  '> ./check_vulns.py --target 192.168.1.42'],
    [6100, 'term-info', '[CVE]   Checking NVD database...'],
    [6600, 'term-warn', '[WARN]  CVE-2023-0464 — OpenSSL — MEDIUM'],
    [7000, 'term-ok',   '[OK]    No critical CVEs detected'],
    [7300, 'term-cmd',  '> whoami'],
    [7500, 'term-ok',   'hasan — security_analyst'],
    [7800, 'term-ok',   '[SYS]   Access granted. Welcome back, Hasan.'],
  ];

  let started = false;

  function runScript() {
    script.forEach(([delay, cls, text]) => {
      setTimeout(() => {
        const line = document.createElement('span');
        line.className = `term-line ${cls}`;
        line.textContent = text;
        output.appendChild(line);

        // Auto-scroll terminal
        const body = document.getElementById('terminalBody');
        if (body) body.scrollTop = body.scrollHeight;
      }, delay);
    });
  }

  // Trigger when terminal section enters view
  const section = document.getElementById('terminal');
  if (!section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          runScript();
          observer.unobserve(section);
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
})();


/* ============================================================
   8. CONTACT FORM HANDLER
============================================================ */
function handleFormSubmit() {
  const name     = document.getElementById('contactName');
  const email    = document.getElementById('contactEmail');
  const msg      = document.getElementById('contactMsg');
  const feedback = document.getElementById('formFeedback');
  const btn      = document.getElementById('submitBtn');

  if (!name || !email || !msg || !feedback) return;

  // Basic validation
  if (!name.value.trim()) {
    showFeedback('// ERROR: Name field is required.', 'var(--red-dim)');
    name.focus();
    return;
  }

  if (!isValidEmail(email.value.trim())) {
    showFeedback('// ERROR: Invalid email address.', 'var(--red-dim)');
    email.focus();
    return;
  }

  if (!msg.value.trim()) {
    showFeedback('// ERROR: Message cannot be empty.', 'var(--red-dim)');
    msg.focus();
    return;
  }

  // Simulate sending
  btn.disabled = true;
  showFeedback('// Transmitting...', 'var(--blue)');

  setTimeout(() => {
    showFeedback('// [OK] Message transmitted successfully. Will respond ASAP.', 'var(--green)');
    name.value  = '';
    email.value = '';
    msg.value   = '';
    btn.disabled = false;
  }, 1600);

  function showFeedback(text, color) {
    feedback.textContent = text;
    feedback.style.color = color;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ============================================================
   9. SMOOTH SCROLL for internal links
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH   = 64;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   10. ACTIVE NAV LINK on scroll
============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.style.color = 'var(--green)';
            }
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ============================================================
   11. HERO BOOT SEQUENCE (initial status badge)
============================================================ */
(function initBootSequence() {
  // Stagger hero reveals with custom delays
  const revealEls = document.querySelectorAll('.hero .reveal');
  revealEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300 + i * 150);
  });
})();


/* ============================================================
   12. GLITCH EFFECT on hero name (occasional)
============================================================ */
(function initGlitch() {
  const nameEl = document.querySelector('.hero-name');
  if (!nameEl) return;

  function triggerGlitch() {
    nameEl.style.textShadow = '2px 0 var(--blue), -2px 0 var(--red-dim)';
    nameEl.style.letterSpacing = '0.06em';
    setTimeout(() => {
      nameEl.style.textShadow = '';
      nameEl.style.letterSpacing = '';
    }, 120);
  }

  // Random glitch every 5-12 seconds
  function scheduleGlitch() {
    const next = 5000 + Math.random() * 7000;
    setTimeout(() => {
      triggerGlitch();
      scheduleGlitch();
    }, next);
  }

  scheduleGlitch();
})();


/* ============================================================
   13. PROJECT CARD mouse-tilt effect
============================================================ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -5;   // degrees
      const tiltY  = dx *  5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
