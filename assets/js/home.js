/* 홈 화면 렌더링 ---------------------------------------------------------- */
initPage('index.html');

const upcoming = upcomingEvents();
const past = pastEvents();
const next = upcoming[0] || null;
const latest = past[0] || null;

/* --- 히어로 -------------------------------------------------------------- */
(function renderHero() {
  // 배경은 키비주얼이 지정된 대회 -> 최근 대회 포스터 순으로 사용
  const withKey = EVENTS.find(e => e.key);
  const bg = (withKey && withKey.key) || (latest && latest.poster) || '';

  let eyebrow = 'NEXT EVENT';
  let title = SITE.name;
  let sub = '';

  if (next) {
    title = next.title;
    sub = next.date
      ? `${fmtDate(next.date)}${next.time ? ' · ' + next.time : ''}${next.venue ? ' · ' + next.venue : ''}`
      : '';
  }

  const left = next ? daysUntil(next.date) : null;
  const dday = (left !== null && left >= 0)
    ? `<div class="dday">D-${left} <span>남았습니다</span></div>`
    : '';

  document.getElementById('hero').innerHTML = `
    <div class="hero-bg" style="background-image:url('${esc(bg)}')"></div>
    <div class="hero-inner">
      <div class="wrap">
        <span class="hero-eyebrow">${esc(eyebrow)}</span>
        <h1>${esc(title)}</h1>
        <p class="hero-sub">${orNoData(sub)}</p>
        <p class="slogan">${esc(SITE.slogan)}</p>
        ${dday}
        <div class="hero-actions" style="margin-top:26px">
          <a class="btn" href="events.html">경기 일정 보기</a>
          <a class="btn ghost" href="events.html?tab=past">지난 대회 보기</a>
        </div>
      </div>
    </div>`;
})();

/* --- 다음 대회 ----------------------------------------------------------- */
(function renderNext() {
  const box = document.getElementById('next-event');
  if (!next) {
    box.innerHTML = `<div class="empty-state">${NO_DATA}</div>`;
    return;
  }

  const rows = [
    ['일시', next.date ? esc(fmtDate(next.date)) + (next.time ? ' · ' + esc(next.time) : '') : NO_DATA],
    ['장소', orNoData(next.venue)],
    ['중계', orNoData(next.broadcast)]
  ];

  box.innerHTML = `
    <div class="event-hero">
      <div class="poster-lg">
        ${next.poster
          ? `<img src="${esc(next.poster)}" alt="${esc(next.title)} 포스터">`
          : `<div class="poster empty" style="aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:4px">No data</div>`}
      </div>
      <div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${tierBadge(next)}${next.placeholder ? '<span class="badge demo">예시 데이터</span>' : ''}</div>
        <h1>${esc(next.title)}</h1>
        ${next.subtitle ? `<p class="subtitle">${esc(next.subtitle)}</p>` : ''}
        <ul class="info-list">
          ${rows.map(r => `<li><span class="k">${r[0]}</span><span>${r[1]}</span></li>`).join('')}
        </ul>
        <div class="hero-actions" style="margin-top:24px">
          <a class="btn" href="event.html?id=${encodeURIComponent(next.id)}">대회 정보 보기</a>
        </div>
      </div>
    </div>`;
})();

/* --- 최근 대회 ----------------------------------------------------------- */
(function renderLatest() {
  const box = document.getElementById('latest-event');
  if (!latest) {
    box.innerHTML = `<div class="empty-state">${NO_DATA}</div>`;
    return;
  }

  const card = latest.cards[0];
  const preview = card ? card.bouts.slice(0, 3) : [];

  box.innerHTML = `
    <div class="event-hero">
      <div class="poster-lg">
        <img src="${esc(latest.poster)}" alt="${esc(latest.title)} 포스터" loading="lazy">
      </div>
      <div>
        <h1>${esc(latest.title)}</h1>
        ${latest.subtitle ? `<p class="subtitle">${esc(latest.subtitle)}</p>` : ''}
        <ul class="info-list">
          <li><span class="k">일시</span><span>${fmtDate(latest.date)}${latest.time ? ' · ' + esc(latest.time) : ''}</span></li>
          <li><span class="k">장소</span><span>${esc(latest.venue)}</span></li>
          <li><span class="k">경기 수</span><span>총 ${boutCount(latest)}경기</span></li>
        </ul>
        ${preview.map(boutRow).join('')}
        <div class="hero-actions" style="margin-top:20px">
          <a class="btn ghost" href="event.html?id=${encodeURIComponent(latest.id)}">전체 대진표 보기</a>
        </div>
      </div>
    </div>`;
})();

/* --- 지난 대회 목록 ------------------------------------------------------- */
document.getElementById('past-events').innerHTML =
  past.slice(0, 4).map(eventCard).join('') ||
  `<div class="empty-state">${NO_DATA}</div>`;

/* --- 스폰서 (전체 대회에서 중복 없이 모음) -------------------------------- */
(function renderSponsors() {
  const set = [];
  EVENTS.forEach(e => (e.sponsors || []).forEach(s => { if (!set.includes(s)) set.push(s); }));
  document.getElementById('sponsors').innerHTML =
    set.map(s => `<span>${esc(s)}</span>`).join('');
})();
