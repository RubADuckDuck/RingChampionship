/* 대회 상세 --------------------------------------------------------------- */
initPage('event.html');

const params = new URLSearchParams(location.search);
const requested = params.get('id');

// id 가 없거나 잘못된 경우: 예정 대회 -> 최근 대회 순으로 대체
const fallback = upcomingEvents().find(e => !e.placeholder) || pastEvents()[0] || EVENTS[0];
const ev = findEvent(requested) || fallback;
const wrongId = requested && !findEvent(requested);

document.title = `${ev.title} | RING CHAMPIONSHIP`;

/* 이전 / 다음 대회 (날짜 순) */
const timeline = EVENTS.filter(e => e.date).sort((a, b) => b.date.localeCompare(a.date));
const idx = timeline.findIndex(e => e.id === ev.id);
const newer = idx > 0 ? timeline[idx - 1] : null;
const older = idx >= 0 && idx < timeline.length - 1 ? timeline[idx + 1] : null;

const left = daysUntil(ev.date);
const rows = [
  ['일시', ev.date ? esc(fmtDate(ev.date)) + (ev.time ? ' · ' + esc(ev.time) : '') : NO_DATA],
  ['장소', ev.venue ? esc(ev.venue) + (ev.venueEn ? ` (${esc(ev.venueEn)})` : '') : NO_DATA],
  ['중계', broadcastHtml(ev)],
  ['경기 수', boutCount(ev) ? `총 ${boutCount(ev)}경기` : NO_DATA]
];

let badge = '';
if (ev.placeholder) badge = '<span class="badge demo">예시 데이터</span>';
else if (isUpcoming(ev) && left !== null && left >= 0) badge = `<span class="badge up">D-${left}</span>`;
else if (!isUpcoming(ev)) badge = '<span class="badge">종료된 대회</span>';

/* 파이트 카드 */
const cardsHtml = (ev.cards || []).map(c => `
  <div class="card-block">
    <div class="card-block-head">
      <h2>${esc(c.name)}</h2>
      ${c.time ? `<span class="time">${esc(c.time)} 시작</span>` : ''}
    </div>
    ${c.bouts.map(boutRow).join('')}
  </div>`).join('');

const posterHtml = ev.poster
  ? `<img src="${esc(ev.poster)}" alt="${esc(ev.title)} 포스터">`
  : `<div class="poster empty" style="aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:4px">No data</div>`;

document.getElementById('event-detail').innerHTML = `
  ${wrongId ? `<div class="notice" style="margin-bottom:26px"><strong>안내</strong> · 요청하신 대회(${esc(requested)})를 찾을 수 없어 다른 대회를 표시합니다.</div>` : ''}

  <div class="event-hero">
    <div class="poster-lg">${posterHtml}</div>
    <div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${tierBadge(ev)}${badge}</div>
      <h1>${esc(ev.title)}</h1>
      ${ev.subtitle ? `<p class="subtitle">${esc(ev.subtitle)}</p>` : ''}
      <ul class="info-list">
        ${rows.map(r => `<li><span class="k">${r[0]}</span><span>${r[1]}</span></li>`).join('')}
      </ul>
      <div class="hero-actions" style="margin-top:24px">
        <a class="btn" href="events.html${isUpcoming(ev) ? '' : '?tab=past'}">전체 대회 일정</a>
      </div>
    </div>
  </div>

  ${cardsHtml || `<div class="empty-state" style="margin-top:46px">${NO_DATA}</div>`}

  ${(ev.sponsors || []).length ? `
    <div class="card-block">
      <div class="card-block-head"><h2>SPONSORS</h2></div>
      <div class="sponsors">${ev.sponsors.map(s => `<span>${esc(s)}</span>`).join('')}</div>
    </div>` : ''}

  <div class="hero-actions" style="margin-top:46px; justify-content:space-between">
    ${older ? `<a class="btn ghost" href="event.html?id=${encodeURIComponent(older.id)}">← ${esc(older.title)}</a>` : '<span></span>'}
    ${newer ? `<a class="btn ghost" href="event.html?id=${encodeURIComponent(newer.id)}">${esc(newer.title)} →</a>` : '<span></span>'}
  </div>`;
