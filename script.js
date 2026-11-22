/**
 * Anita & Vimal — 50th Golden Anniversary (Ayodhya Dham)
 * Venue: Sawarthia Sewa Sadan, Ayodhya
 * Sacred Temple Sound & Cinematic Mobile Invitation Logic
 */

// =============================================================================
// Configuration
// =============================================================================
const EVENT_CONFIG = {
  // Sunday, December 27th, 10:00 AM IST (Celebration start at Sawarthia Sewa Sadan)
  targetDate: new Date('2026-12-27T10:00:00+05:30'),
  endDate: new Date('2026-12-27T23:30:00+05:30'),
  
  names: 'Anita & Vimal',
  title: "Anita & Vimal's 50th Golden Anniversary | Ayodhya Dham",
  venueName: 'Sawarthia Sewa Sadan',
  venue: 'Sawarthia Sewa Sadan, NH-27, Shahnewajpur Manjha, Ayodhya, Uttar Pradesh 272129',
  venueMapUrl: 'https://share.google/TCRyl7qO90pIOgZB4',
  venueWebsiteUrl: 'https://www.sawarthiasewasadan.com/Ayodhya',
  
  rsvpContacts: [
    { name: 'Kunal', phone: '+919839019029', display: '+91 98390 19029' },
    { name: 'Trisha', phone: '+919984134800', display: '+91 99841 34800' },
    { name: 'Parul', phone: '+919839073337', display: '+91 98390 73337' }
  ],
  customAudioUrl: 'assets/music.m4a',
  customAudioFallbackUrl: 'assets/music.mp3'
};

// =============================================================================
// 1. Sacred Temple Bell & Instrumental Audio (Achyutam Keshavam)
// =============================================================================
let audioCtx = null;
let isAudioPlaying = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Authentic Indian Temple Bell (Brass Ghantā) synthesis
function playTempleBell() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const baseFreq = 587.33; // D5 (Auspicious Indian Temple scale)
  const partials = [
    { ratio: 1.0,  gain: 0.25, decay: 4.5 },
    { ratio: 2.0,  gain: 0.18, decay: 3.5 },
    { ratio: 3.01, gain: 0.12, decay: 2.8 },
    { ratio: 4.18, gain: 0.08, decay: 2.0 },
    { ratio: 5.43, gain: 0.04, decay: 1.4 }
  ];

  const now = ctx.currentTime;
  partials.forEach(p => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * p.ratio, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(p.gain, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + p.decay);
  });
}

function getBgMusicElement() {
  return document.getElementById('bgMusic');
}

// Instrumental: Achyutam Keshavam
function startAmbientMusic() {
  const audio = getBgMusicElement();
  if (!audio) return;

  audio.volume = 0.85;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isAudioPlaying = true;
      updateAudioUI(true);
    }).catch(err => {
      // Browser autoplay policy prevented playback without gesture
      updateAudioUI(false);
    });
  }
}

function stopAmbientMusic() {
  const audio = getBgMusicElement();
  if (audio) {
    audio.pause();
  }
  isAudioPlaying = false;
  updateAudioUI(false);
}

function updateAudioUI(playing) {
  const btn = document.getElementById('audioToggleBtn');
  const label = document.getElementById('musicStatusText');
  const icon = document.getElementById('musicIcon');

  if (btn) {
    btn.classList.toggle('playing', playing);
  }
  if (label) {
    label.textContent = playing ? 'Music On' : 'Play Music';
  }
  if (icon) {
    icon.style.opacity = playing ? '1' : '0.6';
  }
}

// =============================================================================
// 2. Temple Audio Controls
// =============================================================================
function initAudioControls() {
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audio = getBgMusicElement();

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAudioPlaying) {
        stopAmbientMusic();
      } else {
        playTempleBell();
        startAmbientMusic();
      }
    });
  }

  if (audio) {
    audio.addEventListener('play', () => {
      isAudioPlaying = true;
      updateAudioUI(true);
    });
    audio.addEventListener('pause', () => {
      isAudioPlaying = false;
      updateAudioUI(false);
    });
  }

  // Attempt autoplay immediately
  startAmbientMusic();

  // One-time unlock for mobile (iOS Safari / Android Chrome)
  // When user touches the screen, sound unlocks immediately!
  const unlockAudio = () => {
    if (!isAudioPlaying) {
      startAmbientMusic();
    }
  };

  ['touchstart', 'touchend', 'click', 'scroll', 'pointerdown'].forEach(evt => {
    document.addEventListener(evt, unlockAudio, { once: true, passive: true, capture: true });
  });

  // Optional celebratory burst when the page loads
  setTimeout(() => {
    if (typeof spawnBurst === 'function') {
      spawnBurst(window.innerWidth / 2, window.innerHeight * 0.35);
    }
  }, 500);
}

// =============================================================================
// 3. Floating River Diyas & Temple Gold Embers Canvas Engine
// =============================================================================
let particles = [];
let burstParticles = [];
let canvas = null;
let ctx = null;

function initParticleCanvas() {
  canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const count = Math.min(36, Math.floor(window.innerWidth / 14));
  particles = [];
  for (let i = 0; i < count; i++) {
    const isDiya = Math.random() < 0.25;
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: isDiya ? Math.random() * 2.8 + 2.2 : Math.random() * 1.8 + 0.6,
      speedY: isDiya ? Math.random() * 0.35 + 0.12 : Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.65 + 0.25,
      pulseSpeed: Math.random() * 0.025 + 0.015,
      isDiya
    });
  }

  function animate() {
    if (document.hidden) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

      if (p.y < -15) {
        p.y = canvas.height + 15;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -15) p.x = canvas.width + 15;
      if (p.x > canvas.width + 15) p.x = -15;

      const alphaVal = Math.max(0.12, Math.min(0.9, p.alpha));

      const isPinkWhite = document.documentElement.getAttribute('data-theme') === 'pink-white';
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      if (isPinkWhite) {
        if (p.isDiya) {
          ctx.fillStyle = `rgba(244, 160, 185, ${alphaVal})`;
          ctx.shadowColor = 'rgba(235, 130, 160, 0.6)';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = `rgba(205, 140, 90, ${alphaVal})`;
          ctx.shadowColor = 'rgba(225, 175, 140, 0.5)';
          ctx.shadowBlur = 6;
        }
      } else {
        if (p.isDiya) {
          ctx.fillStyle = `rgba(255, 152, 0, ${alphaVal})`;
          ctx.shadowColor = 'rgba(255, 111, 0, 0.85)';
          ctx.shadowBlur = 14;
        } else {
          ctx.fillStyle = `rgba(245, 158, 11, ${alphaVal})`;
          ctx.shadowColor = 'rgba(255, 235, 150, 0.6)';
          ctx.shadowBlur = 8;
        }
      }

      ctx.fill();
      ctx.restore();
    });

    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const bp = burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vy += 0.07;
      bp.life -= 0.018;

      if (bp.life <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }

      const isPinkWhite = document.documentElement.getAttribute('data-theme') === 'pink-white';
      ctx.save();
      ctx.beginPath();
      ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
      if (isPinkWhite) {
        ctx.fillStyle = `rgba(235, 130, 160, ${bp.life})`;
        ctx.shadowColor = 'rgba(215, 100, 135, 0.7)';
      } else {
        ctx.fillStyle = `rgba(255, 193, 7, ${bp.life})`;
        ctx.shadowColor = 'rgba(230, 81, 0, 0.9)';
      }
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function spawnBurst(originX, originY) {
  for (let i = 0; i < 52; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5.5 + 2;
    burstParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      radius: Math.random() * 3 + 1.2,
      life: 1.0
    });
  }
}

// =============================================================================
// 4. Live Countdown Timer
// =============================================================================
function initCountdown() {
  const daysEl = document.getElementById('daysVal');
  const hoursEl = document.getElementById('hoursVal');
  const minsEl = document.getElementById('minsVal');
  const secsEl = document.getElementById('secsVal');

  if (!daysEl) return;

  function update() {
    const now = new Date();
    const diff = EVENT_CONFIG.targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      const cardTitle = document.querySelector('.countdown-title');
      if (cardTitle) {
        cardTitle.innerHTML = `
          <svg class="graphic-icon diya-tiny" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c0 2-2 3.5-2 5.5a2 2 0 1 0 4 0C14 5.5 12 4 12 2z" fill="currentColor"/><path d="M4 14c0 4.4 3.6 7 8 7s8-2.6 8-7c0-2-4-2-8-2s-8 0-8 2z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
          <span>Celebrations Underway</span>
          <svg class="graphic-icon diya-tiny" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c0 2-2 3.5-2 5.5a2 2 0 1 0 4 0C14 5.5 12 4 12 2z" fill="currentColor"/><path d="M4 14c0 4.4 3.6 7 8 7s8-2.6 8-7c0-2-4-2-8-2s-8 0-8 2z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
        `;
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// =============================================================================
// 5. 3-Day Itinerary Tab Navigation
// =============================================================================
function initItineraryTabs() {
  const tabs = document.querySelectorAll('.day-tab-btn');
  const panels = document.querySelectorAll('.day-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('aria-controls');

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
          panel.hidden = false;
        } else {
          panel.classList.remove('active');
          panel.hidden = true;
        }
      });
    });
  });
}

// =============================================================================
// 6. Add Event to Calendar (.ics) with Exact Venue & Address
// =============================================================================
function initAddToCalendar() {
  const calBtn = document.getElementById('addToCalBtn');
  if (!calBtn) return;

  calBtn.addEventListener('click', () => {
    const start = EVENT_CONFIG.targetDate;
    const end = EVENT_CONFIG.endDate;

    function formatDate(d) {
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Anita & Vimal//50th Golden Anniversary Ayodhya//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:${EVENT_CONFIG.title}`,
      `DESCRIPTION:Join us in Ayodhya Dham for Anita & Vimal's 50th Golden Anniversary celebration at Sawarthia Sewa Sadan on Sunday, December 27, 2026! Sacred Hawan (Attire: Shades of Orange), Lunch, Wedding Ceremony & Gala Dinner (Attire: Men in Black, Women in Any Colour with Shades of Golden).`,
      `LOCATION:${EVENT_CONFIG.venue}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Anita-Vimal-50th-Anniversary-Ayodhya.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// =============================================================================
// 8. WhatsApp RSVP with Exact Venue Details
// =============================================================================
function initWhatsAppRsvp() {
  const link = document.getElementById('whatsappRsvpLink');
  if (!link) return;

  const phone = EVENT_CONFIG.whatsappNumber ? EVENT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '') : '';
  const message = encodeURIComponent(`Hi! We are delighted to RSVP for Anita & Vimal's 50th Golden Anniversary celebration at Sawarthia Sewa Sadan, Ayodhya on Sunday, Dec 27, 2026!\n\nGuest Names: `);
  
  link.href = phone ? `https://wa.me/${phone}?text=${message}` : `https://wa.me/?text=${message}`;
}

// =============================================================================
// 9. In-Page RSVP Form (Direct to WhatsApp)
// =============================================================================
function initRsvpForm() {
  const form = document.getElementById('rsvpForm');
  const successMsg = document.getElementById('rsvpSuccessMsg');
  const manualLink = document.getElementById('waManualLink');
  const nameInput = document.getElementById('guestName');
  const nameError = document.getElementById('nameError');
  const attendanceSelect = document.getElementById('guestAttendance');
  const countInput = document.getElementById('guestCount');
  const recipientSelect = document.getElementById('rsvpRecipient');
  const noteInput = document.getElementById('guestNote');
  const submitBtn = document.getElementById('submitRsvpBtn');

  if (!form) return;

  // Toggle guest count visibility when user declines
  if (attendanceSelect && countInput) {
    attendanceSelect.addEventListener('change', () => {
      const countGroup = countInput.closest('.form-group');
      if (countGroup) {
        countGroup.style.display = attendanceSelect.value === 'regretfully-decline' ? 'none' : 'block';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    if (!name) {
      if (nameError) nameError.textContent = 'Please enter your name.';
      nameInput.focus();
      return;
    }
    if (nameError) nameError.textContent = '';

    const attendance = attendanceSelect ? attendanceSelect.value : '';
    if (!attendance) {
      attendanceSelect.focus();
      return;
    }

    const count = countInput ? countInput.value : '2';
    const note = noteInput ? noteInput.value.trim() : '';
    const recipientPhone = recipientSelect ? recipientSelect.value : '919839019029';

    const attendanceLabels = {
      'joyfully-attend': 'Joyfully Attending (Sunday, Dec 27)',
      'regretfully-decline': 'Regretfully Decline'
    };
    const attendanceText = attendanceLabels[attendance] || attendance;

    // Compose royal WhatsApp message
    let message = `*RSVP: Anita & Vimal's 50th Golden Anniversary*\n`;
    message += `*Venue:* Sawarthia Sewa Sadan, Ayodhya Dham (Sunday, Dec 27, 2026)\n\n`;
    message += `• *Guest Name:* ${name}\n`;
    message += `• *Response:* ${attendanceText}\n`;
    if (attendance !== 'regretfully-decline') {
      message += `• *Number of Guests:* ${count}\n`;
    }
    if (note) {
      message += `• *Message / Wishes:* ${note}\n`;
    }
    message += `\nLooking forward to celebrating together!`;

    const waUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(message)}`;

    // Store in localStorage as backup
    const rsvpData = {
      name,
      attendance,
      count,
      note,
      recipient: recipientPhone,
      submittedAt: new Date().toISOString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem('ayodhya_anniversary_rsvps') || '[]');
      existing.push(rsvpData);
      localStorage.setItem('ayodhya_anniversary_rsvps', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage unavailable', err);
    }

    playTempleBell();

    if (manualLink) {
      manualLink.href = waUrl;
    }

    if (successMsg) {
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (submitBtn) {
      submitBtn.innerHTML = `
        <svg class="btn-svg" viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        <span>RSVP Sent via WhatsApp</span>
      `;
    }

    // Open WhatsApp
    window.open(waUrl, '_blank');
  });
}

// =============================================================================
// 10. Theme Switcher (Option 2: Romantic Blush Pink & White vs Dark Velvet Gold)
// =============================================================================
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const label = document.getElementById('themeStatusText');

  // Check saved preference or default to 'pink-white' (user choice)
  const savedTheme = localStorage.getItem('anniversary_theme') || 'pink-white';
  setTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'pink-white' ? 'dark-gold' : 'pink-white';
      setTheme(nextTheme);
    });
  }

  function setTheme(theme) {
    if (theme === 'pink-white') {
      document.documentElement.setAttribute('data-theme', 'pink-white');
      if (label) label.textContent = 'Pink & White';
      localStorage.setItem('anniversary_theme', 'pink-white');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (label) label.textContent = 'Velvet Gold';
      localStorage.setItem('anniversary_theme', 'dark-gold');
    }
  }
}

// =============================================================================
// 11. Scroll Fallback
// =============================================================================
function initScrollFallback() {
  const supportsNativeScrollTimeline = CSS.supports && CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  const allowsMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  if (!supportsNativeScrollTimeline && allowsMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.15
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
}

// =============================================================================
// Initialize
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initParticleCanvas();
  initAudioControls();
  initAddToCalendar();
  initWhatsAppRsvp();
  initRsvpForm();
  initScrollFallback();
});
