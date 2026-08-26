/* ==========================================================================
   공통 스크립트 - 헤더/푸터 렌더링, 날짜 계산, 대회 정렬
   (이 파일은 수정하지 않으셔도 됩니다)
   ========================================================================== */

/* --- 유틸 --------------------------------------------------------------- */
const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

/* 값이 없을 때 화면에 공통으로 쓰는 표시 */
const NO_DATA = '<span class="nodata">No data</span>';

/** 값이 있으면 escape 해서, 없으면 No data 를 돌려준다 */
function orNoData(v) { return v ? esc(v) : NO_DATA; }

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** '2026-05-30' -> '2026. 05. 30 (토)' */
function fmtDate(str) {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  if (isNaN(d)) return str;
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}. ${p(d.getMonth() + 1)}. ${p(d.getDate())} (${DAY_KO[d.getDay()]})`;
}

/** 오늘부터 남은 일수 (지났으면 음수, 날짜 없으면 null) */
function daysUntil(str) {
  if (!str) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(str + 'T00:00:00');
  if (isNaN(d)) return null;
  return Math.round((d - today) / 86400000);
}

/** 예정된 대회인지 판정. data.js 의 status 값이 있으면 그 값을 우선한다 */
function isUpcoming(ev) {
  if (ev.status === 'upcoming') return true;
  if (ev.status === 'past') return false;
  if (!ev.date) return true;                 // 날짜 미정 = 예정
  const left = daysUntil(ev.date);
  return left === null || left >= 0;
}

/** 예정 대회: 가까운 순 / 지난 대회: 최신 순 */
function upcomingEvents() {
  return EVENTS.filter(isUpcoming).sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
}
function pastEvents() {
  return EVENTS.filter(e => !isUpcoming(e)).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
function findEvent(id) { return EVENTS.find(e => e.id === id) || null; }

/** 대회의 메인이벤트 한 줄 (없으면 null) */
function mainBout(ev) {
  for (const c of (ev.cards || [])) {
    for (const b of (c.bouts || [])) {
      if (b.tag === 'MAIN EVENT') return b;
    }
  }
  const first = (ev.cards || [])[0];
  return first && first.bouts && first.bouts[0] ? first.bouts[0] : null;
}

/** 대회 총 경기 수 */
function boutCount(ev) {
  return (ev.cards || []).reduce((n, c) => n + (c.bouts || []).length, 0);
}

/** 대회 등급 뱃지 (PRO = RING CHAMPIONSHIP 본 대회 / AMATEUR = 아마추어 대회) */
function tierBadge(ev) {
  if (ev.tier === 'AMATEUR') return '<span class="badge amateur">AMATEUR</span>';
  if (ev.tier === 'PRO') return '<span class="badge pro">PRO</span>';
  return '';
}

/** 체급 한글 표기 (없으면 원문 그대로) */
function weightKo(w) { return WEIGHT_KO[w] || ''; }

/* --- 헤더 / 푸터 --------------------------------------------------------- */
const NAV = [
  { href: 'index.html',         label: '홈' },
  { href: 'events.html',        label: '경기 일정' },
  { href: 'event.html',         label: '대회 상세' },
  { href: 'future-league.html', label: '아마추어 리그' }
];

function renderHeader(activeHref) {
  const links = NAV.map(n =>
    `<a href="${n.href}" class="${n.href === activeHref ? 'active' : ''}">${n.label}</a>`
  ).join('');

  const el = document.getElementById('site-header');
  if (!el) return;
  el.innerHTML = `
    <div class="wrap bar">
      <a class="brand" href="index.html">
        <img src="assets/img/logo-ring-white.png" alt="RING CHAMPIONSHIP">
      </a>
      <nav class="nav" id="nav">
        ${links}
      </nav>
      <button class="nav-toggle" id="navToggle" aria-label="메뉴 열기">☰</button>
    </div>`;

  const toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', () => {
    document.getElementById('nav').classList.toggle('open');
  });
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;

  const sns = [];
  if (SITE.sns.youtube) sns.push(`<li><a href="${esc(SITE.sns.youtube)}" target="_blank" rel="noopener">YouTube</a></li>`);
  else sns.push('<li>YouTube — RING FC</li>');
  if (SITE.sns.instagram) sns.push(`<li><a href="${esc(SITE.sns.instagram)}" target="_blank" rel="noopener">Instagram</a></li>`);
  else sns.push('<li>Instagram — RING FC</li>');

  const contact = [];
  if (SITE.contact.email) contact.push(`<li>${esc(SITE.contact.email)}</li>`);
  if (SITE.contact.phone) contact.push(`<li>${esc(SITE.contact.phone)}</li>`);
  contact.push(`<li>${esc(SITE.contact.gym)}</li>`);

  el.innerHTML = `
    <div class="wrap">
      <div class="footer-top">
        <div>
          <img class="logo" src="assets/img/logo-ring-white.png" alt="RING CHAMPIONSHIP">
          <p class="desc">${esc(SITE.slogan)}</p>
        </div>
        <div class="footer-nav">
          <div>
            <h5>바로가기</h5>
            <ul>
              <li><a href="events.html">경기 일정</a></li>
              <li><a href="event.html">대회 상세</a></li>
              <li><a href="future-league.html">아마추어 리그</a></li>
              <li><a href="future-league.html#apply">참가 신청</a></li>
            </ul>
          </div>
          <div>
            <h5>CHANNEL</h5>
            <ul>${sns.join('')}</ul>
          </div>
          <div>
            <h5>CONTACT</h5>
            <ul>${contact.join('')}</ul>
          </div>
        </div>
      </div>
      <div class="copyright">
        <span>© ${new Date().getFullYear()} ${esc(SITE.name)}. All rights reserved.</span>
        <span>본 페이지는 시안(예시) 사이트입니다.</span>
      </div>
    </div>`;
}

/* --- 대회 카드 (목록에서 공통 사용) --------------------------------------- */
function eventCard(ev) {
  const mb = mainBout(ev);
  const left = daysUntil(ev.date);
  const up = isUpcoming(ev);

  let badge = '';
  if (ev.placeholder) badge = '<span class="badge demo">예시 데이터</span>';
  else if (up && left !== null && left >= 0) badge = `<span class="badge up">D-${left}</span>`;
  else if (up) badge = '<span class="badge up">예정</span>';

  const poster = ev.thumb || ev.poster
    ? `<div class="poster"><img src="${esc(ev.thumb || ev.poster)}" alt="${esc(ev.title)} 포스터" loading="lazy"></div>`
    : `<div class="poster empty">No data</div>`;

  const n = boutCount(ev);

  return `
    <a class="event-card" href="event.html?id=${encodeURIComponent(ev.id)}">
      ${poster}
      <div class="body">
        ${ev.subtitle ? `<div class="sub">${esc(ev.subtitle)}</div>` : ''}
        <h3>${esc(ev.title)}</h3>
        <div class="meta">
          ${orNoData(fmtDate(ev.date))}${ev.time ? ' · ' + esc(ev.time) : ''}<br>
          ${orNoData(ev.venue)}
          ${ev.broadcast ? '<br>' + esc(ev.broadcast) : ''}
        </div>
        <div class="main-bout">
          ${mb ? esc(mb.red) + ' vs ' + esc(mb.blue) : NO_DATA}
          ${n ? `<span class="muted"> · 총 ${n}경기</span>` : ''}
        </div>
        <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">${tierBadge(ev)}${badge}</div>
      </div>
    </a>`;
}

/* --- 대진 한 줄 (홈 / 대회 상세 공통) ------------------------------------- */
function boutRow(b) {
  const head = (b.tag === 'MAIN EVENT' || b.title) ? ' headline' : '';
  const ko = weightKo(b.weight);
  const cls = b.weight ? esc(b.weight) + (ko ? ` <span class="muted">${ko}</span>` : '') : '';
  return `
    <div class="bout${head}">
      <div class="fighter red">${esc(b.red)}</div>
      <div class="mid">
        ${b.tag ? `<span class="tag">${esc(b.tag)}</span>` : ''}
        <div class="vs">VS</div>
        ${cls ? `<div class="cls">${cls}</div>` : ''}
        ${b.rule ? `<div class="rule">${esc(b.rule)}</div>` : ''}
      </div>
      <div class="fighter blue">${esc(b.blue)}</div>
    </div>`;
}

/* --- 부트스트랩 ---------------------------------------------------------- */
function initPage(activeHref) {
  renderHeader(activeHref);
  renderFooter();
}
