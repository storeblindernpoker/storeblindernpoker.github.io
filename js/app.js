/* ============================================
   Store Blindern Poker — App JavaScript
   ============================================ */

// --- Utility ---
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    day: d.getDate(),
    month: MONTHS[d.getMonth()],
    weekday: WEEKDAYS[d.getDay()],
    full: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

function getEventStatus(dateStr) {
  const eventDate = new Date(dateStr + 'T23:59:59');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const evDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  if (evDay.getTime() === today.getTime()) return 'live';
  return eventDate >= now ? 'upcoming' : 'past';
}

// --- Mobile nav toggle ---
function initNav() {
  const toggle = $('.nav__toggle');
  const links = $('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('nav__links--open');
  });

  // Close on link click
  $$('.nav__link', links).forEach(link => {
    link.addEventListener('click', () => links.classList.remove('nav__links--open'));
  });
}

// --- Scroll reveal ---
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  $$('.reveal').forEach(el => observer.observe(el));
}

// --- Fetch JSON ---
async function fetchJSON(path) {
  try {
    const resp = await fetch(path);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.error(`Failed to load ${path}:`, err);
    return null;
  }
}

// --- Event card HTML ---
function renderEventCard(event) {
  const d = formatDate(event.date);
  const status = getEventStatus(event.date);

  const badgeMap = {
    upcoming: '<span class="event-card__badge event-card__badge--upcoming">Upcoming</span>',
    live: '<span class="event-card__badge event-card__badge--live">● Today</span>',
    past: '<span class="event-card__badge event-card__badge--past">Completed</span>',
  };

  return `
    <div class="event-card" data-event-id="${event.id}" onclick="showEventModal('${event.id}')">
      <div class="event-card__date">
        <div class="event-card__day">${d.day}</div>
        <div class="event-card__month">${d.month}</div>
        <div class="event-card__weekday">${d.weekday.slice(0, 3)}</div>
      </div>
      <div class="event-card__info">
        <div class="event-card__title">${event.title}</div>
        <div class="event-card__meta">
          <span class="event-card__meta-item">⏰ ${event.time}</span>
          <span class="event-card__meta-item">📍 ${event.location}</span>
          ${event.buyIn ? `<span class="event-card__meta-item">💰 ${event.buyIn}</span>` : ''}
        </div>
        ${(event.locationUrl || event.registrationUrl) ? `
        <div class="event-card__links">
          ${event.locationUrl ? `<a href="${event.locationUrl}" target="_blank" rel="noopener" class="event-link" onclick="event.stopPropagation()">📍 Location</a>` : ''}
          ${event.registrationUrl ? `<a href="${event.registrationUrl}" target="_blank" rel="noopener" class="event-link event-link--register" onclick="event.stopPropagation()">✏️ Register</a>` : ''}
        </div>` : ''}
      </div>
      ${badgeMap[status] || ''}
    </div>
  `;
}

// --- Event modal ---
let allEvents = [];

window.showEventModal = function (eventId) {
  const event = allEvents.find(e => e.id === eventId);
  if (!event) return;

  const d = formatDate(event.date);
  const overlay = $('.event-modal-overlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="event-modal">
      <button class="event-modal__close" onclick="closeEventModal()">✕</button>
      <div class="event-modal__date">${d.full}</div>
      <div class="event-modal__title">${event.title}</div>
      <div class="event-modal__details">
        <div class="event-modal__detail">⏰ ${event.time}</div>
        <div class="event-modal__detail">📍 ${event.location}</div>
        ${event.buyIn ? `<div class="event-modal__detail">💰 Buy-in: ${event.buyIn}</div>` : ''}
        ${event.maxPlayers ? `<div class="event-modal__detail">👥 Max ${event.maxPlayers} players</div>` : ''}
      </div>
      ${(event.locationUrl || event.registrationUrl) ? `
      <div class="event-modal__actions">
        ${event.locationUrl ? `<a href="${event.locationUrl}" target="_blank" rel="noopener" class="event-link">📍 Location</a>` : ''}
        ${event.registrationUrl ? `<a href="${event.registrationUrl}" target="_blank" rel="noopener" class="event-link event-link--register">✏️ Register</a>` : ''}
      </div>` : ''}
      <div class="event-modal__description">${event.description}</div>
    </div>
  `;
  overlay.classList.add('event-modal-overlay--active');
};

window.closeEventModal = function () {
  const overlay = $('.event-modal-overlay');
  if (overlay) overlay.classList.remove('event-modal-overlay--active');
};

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('event-modal-overlay--active')) {
    closeEventModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeEventModal();
});

// --- Render events page ---
async function renderEventsPage() {
  const container = $('#events-container');
  if (!container) return;

  const events = await fetchJSON('data/events.json');
  if (!events) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🃏</div><div class="empty-state__text">No events found.</div></div>';
    return;
  }

  allEvents = events;

  const upcoming = events.filter(e => getEventStatus(e.date) !== 'past');
  const past = events.filter(e => getEventStatus(e.date) === 'past');

  let html = '';

  if (upcoming.length) {
    html += `<div class="section__header"><h2 class="section__title">Upcoming</h2></div>`;
    html += `<div class="events-list">${upcoming.map(renderEventCard).join('')}</div>`;
  }

  if (past.length) {
    html += `<div class="section__header" style="margin-top:var(--space-3xl)"><h2 class="section__title">Past Events</h2></div>`;
    html += `<div class="events-list">${past.map(renderEventCard).join('')}</div>`;
  }

  container.innerHTML = html;

  // Setup filter tabs
  initEventFilters(events);
}

function initEventFilters(events) {
  const tabs = $$('.filter-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('filter-tab--active'));
      tab.classList.add('filter-tab--active');

      const filter = tab.dataset.filter;
      const container = $('#events-container');
      let filtered = events;

      if (filter === 'upcoming') {
        filtered = events.filter(e => getEventStatus(e.date) !== 'past');
      } else if (filter === 'past') {
        filtered = events.filter(e => getEventStatus(e.date) === 'past');
      }

      if (!filtered.length) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🃏</div><div class="empty-state__text">No events in this category.</div></div>';
        return;
      }

      container.innerHTML = `<div class="events-list">${filtered.map(renderEventCard).join('')}</div>`;
    });
  });
}

// --- Render events preview on home page ---
async function renderEventsPreview() {
  const container = $('#events-preview');
  if (!container) return;

  const events = await fetchJSON('data/events.json');
  if (!events) return;

  allEvents = events;

  const upcoming = events.filter(e => getEventStatus(e.date) !== 'past').slice(0, 3);
  const toShow = upcoming.length ? upcoming : events.slice(0, 3);

  container.innerHTML = `
    <div class="events-list">${toShow.map(renderEventCard).join('')}</div>
    <div class="events-preview__more">
      <a href="events.html" class="btn btn--secondary">View All Events →</a>
    </div>
  `;
}

// --- Render leaderboard ---
async function renderLeaderboard() {
  const container = $('#leaderboard-container');
  if (!container) return;

  const data = await fetchJSON('data/leaderboard.json');
  if (!data || !data.players) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🏆</div><div class="empty-state__text">No rankings yet.</div></div>';
    return;
  }

  // Stats
  const statsEl = $('#leaderboard-stats');
  if (statsEl) {
    const leader = data.players[0];
    const totalPoints = data.players.reduce((sum, p) => sum + p.points, 0);
    const avgPoints = Math.round(totalPoints / data.players.length);

    // Find biggest climber (largest positive rank change)
    let biggestClimber = null;
    let biggestClimb = 0;
    data.players.forEach(p => {
      const climb = p.previousRank - p.rank;
      if (climb > biggestClimb) { biggestClimb = climb; biggestClimber = p; }
    });

    statsEl.innerHTML = `
      <div class="stat-card">
        <div class="stat-card__value">${data.season}</div>
        <div class="stat-card__label">Season</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${data.players.length}</div>
        <div class="stat-card__label">Players</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${data.rounds}</div>
        <div class="stat-card__label">Sessions Played</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${avgPoints.toLocaleString()}</div>
        <div class="stat-card__label">Avg. Points</div>
      </div>
    `;
  }

  // Leader spotlight
  const spotlightEl = $('#leader-spotlight');
  if (spotlightEl && data.players.length) {
    const leader = data.players[0];
    const runner = data.players[1];
    const initials = leader.pseudonym.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const gap = runner ? leader.points - runner.points : 0;

    spotlightEl.innerHTML = `
      <div class="leader-card">
        <div class="leader-card__crown">👑</div>
        <div class="leader-card__avatar">${initials}</div>
        <div class="leader-card__info">
          <div class="leader-card__label">Current Leader</div>
          <div class="leader-card__name">${leader.pseudonym}</div>
          <div class="leader-card__points">${leader.points.toLocaleString()} pts</div>
        </div>
        <div class="leader-card__stats">
          ${gap > 0 ? `<div class="leader-card__stat"><span class="leader-card__stat-value">+${gap.toLocaleString()}</span><span class="leader-card__stat-label">Lead over #2</span></div>` : ''}
          ${leader.highestPoints ? `<div class="leader-card__stat"><span class="leader-card__stat-value">${leader.highestPoints.toLocaleString()}</span><span class="leader-card__stat-label">Peak Points</span></div>` : ''}
        </div>
      </div>
    `;
  }

  // Last updated
  const updatedEl = $('#last-updated');
  if (updatedEl && data.lastUpdated) {
    const d = formatDate(data.lastUpdated);
    updatedEl.textContent = `Last updated: ${d.full}`;
  }

  // Table
  const rows = data.players.map(p => {
    const change = p.previousRank - p.rank;
    const hasCustomHighlight = Boolean(p.highlight && p.highlight.enabled);
    const hasBoardFlag = Boolean(p.boardMember);
    const isHighlighted = hasCustomHighlight || hasBoardFlag;
    const highlightTypeRaw = hasCustomHighlight
      ? (p.highlight.type || 'champion')
      : (hasBoardFlag ? 'board' : '');
    const highlightType = highlightTypeRaw === 'board' ? 'board' : 'champion';
    const highlightLabel = hasCustomHighlight
      ? (p.highlight.label || '')
      : (hasBoardFlag ? 'The Board' : '');
    const rowClasses = isHighlighted
      ? ` class="highlight-player-row highlight-player-row--${highlightType}"`
      : '';
    let changeHtml = '';
    if (change > 0) {
      changeHtml = `<span class="rank-change rank-change--up">▲ ${change}</span>`;
    } else if (change < 0) {
      changeHtml = `<span class="rank-change rank-change--down">▼ ${Math.abs(change)}</span>`;
    } else {
      changeHtml = `<span class="rank-change rank-change--same">—</span>`;
    }

    const rankClass = p.rank <= 3 ? ` rank-number--${['', 'gold', 'silver', 'bronze'][p.rank]}` : '';
    const initials = p.pseudonym.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const medal = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : '';
    const highlightBadge = highlightLabel
      ? `<span class="player-highlight-badge player-highlight-badge--${highlightType}">${highlightLabel}</span>`
      : '';

    return `
      <tr${rowClasses}>
        <td>
          <div class="rank-cell">
            <span class="rank-number${rankClass}">${medal || p.rank}</span>
            ${changeHtml}
          </div>
        </td>
        <td>
          <div class="player-cell">
            <div class="player-avatar${isHighlighted ? ` player-avatar--highlight player-avatar--${highlightType}` : ''}">${initials}</div>
            <span class="player-name-wrap">
              <span class="player-name">${p.pseudonym}</span>
              ${highlightBadge}
            </span>
          </div>
        </td>
        <td class="points-cell">${p.points.toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="table-wrapper">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th style="text-align:right">Points</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

// --- Ambient floating card suits ---
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h;
  const suits = ['♠', '♣', '♥', '♦'];
  const particles = [];
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 15 : 30;
  let lastScrollY = window.pageYOffset;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticle(randomY) {
    return {
      x: Math.random() * (w || window.innerWidth),
      y: randomY ? Math.random() * (h || window.innerHeight) : (h || window.innerHeight) + Math.random() * 100,
      size: Math.random() * 22 + 8,
      suit: suits[Math.floor(Math.random() * suits.length)],
      opacity: Math.random() * 0.06 + 0.012,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -(Math.random() * 0.12 + 0.03),
      parallaxFactor: Math.random() * 0.12 + 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.002,
    };
  }

  resize();
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle(true));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const currentScrollY = window.pageYOffset;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    for (const p of particles) {
      // Parallax shift based on scroll
      p.y += scrollDelta * p.parallaxFactor;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = (p.suit === '♥' || p.suit === '♦')
        ? `rgba(160, 72, 72, ${p.opacity})`
        : `rgba(201, 168, 76, ${p.opacity * 0.7})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.suit, 0, 0);
      ctx.restore();

      // Drift
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Wrap around edges
      if (p.y < -40) { p.y = h + 40; p.x = Math.random() * w; }
      if (p.y > h + 80) { p.y = -40; p.x = Math.random() * w; }
      if (p.x < -40) p.x = w + 40;
      if (p.x > w + 40) p.x = -40;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  draw();
}

// --- Scroll-driven effects ---
function initScrollEffects() {
  const nav = document.querySelector('.nav');
  const scrollGlow = document.querySelector('.scroll-glow');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

        // Nav warm accent on scroll
        if (nav) {
          nav.classList.toggle('nav--scrolled', scrollY > 50);
        }

        // Moving warm glow that follows scroll position
        if (scrollGlow) {
          const yPos = 15 + progress * 70;
          scrollGlow.style.background = `radial-gradient(ellipse 600px 500px at 50% ${yPos}%, rgba(122, 53, 53, 0.06), transparent)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  });
}

// --- 3D tilt on info cards ---
function initCardTilt() {
  // Skip on touch devices
  if ('ontouchstart' in window) return;

  $$('.info-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// --- Countdown to next event ---
async function initCountdown() {
  const section = $('#countdown-section');
  if (!section) return;

  const events = await fetchJSON('data/events.json');
  if (!events) return;

  // Find next upcoming event
  const now = new Date();
  const upcoming = events
    .filter(e => {
      const [h, m] = (e.time || '23:59').split(':').map(Number);
      const eventEnd = new Date(e.date + 'T23:59:59');
      return eventEnd >= now;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!upcoming.length) return;

  const event = upcoming[0];
  const [hours, mins] = (event.time || '18:00').split(':').map(Number);
  const target = new Date(event.date + 'T00:00:00');
  target.setHours(hours, mins, 0, 0);

  // Populate info
  const d = formatDate(event.date);
  $('#countdown-name').textContent = event.title;
  $('#countdown-date').textContent = `${d.weekday}, ${d.day} ${d.month} · ${event.time}`;
  $('#countdown-location').textContent = event.location;

  const daysEl = $('#cd-days');
  const hoursEl = $('#cd-hours');
  const minsEl = $('#cd-mins');
  const secsEl = $('#cd-secs');
  const countdown = section.querySelector('.countdown');

  function tick() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      // Event is now or past — show "LIVE" state
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      countdown.classList.add('countdown--live');
      section.querySelector('.countdown__label').textContent = '♠ Live Now';
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hrs = Math.floor((totalSecs % 86400) / 3600);
    const min = Math.floor((totalSecs % 3600) / 60);
    const sec = totalSecs % 60;

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hrs).padStart(2, '0');
    minsEl.textContent = String(min).padStart(2, '0');
    secsEl.textContent = String(sec).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
  section.style.display = '';
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initAmbientCanvas();
  initScrollEffects();
  initCardTilt();
  initCountdown();
  renderEventsPreview();
  renderEventsPage();
  renderLeaderboard();
});
