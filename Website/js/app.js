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
    statsEl.innerHTML = `
      <div class="stat-card">
        <div class="stat-card__value">${data.players.length}</div>
        <div class="stat-card__label">Players</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${data.rounds}</div>
        <div class="stat-card__label">Rounds Played</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${data.players[0]?.pseudonym || '—'}</div>
        <div class="stat-card__label">Current Leader</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${data.season}</div>
        <div class="stat-card__label">Season</div>
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

    return `
      <tr>
        <td>
          <div class="rank-cell">
            <span class="rank-number${rankClass}">${medal || p.rank}</span>
            ${changeHtml}
          </div>
        </td>
        <td>
          <div class="player-cell">
            <div class="player-avatar">${initials}</div>
            <span class="player-name">${p.pseudonym}</span>
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

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  renderEventsPreview();
  renderEventsPage();
  renderLeaderboard();
});
