/* 인스타그램 게시물 목록 --------------------------------------------------
   게시물이 700개가 넘어서 한 번에 그리면 페이지가 매우 무거워진다.
   (인스타 embed 는 게시물 하나가 iframe 하나다)
   그래서 한 페이지에 PER_PAGE 개씩만 그리고 페이지로 넘긴다.
   -------------------------------------------------------------------------- */
initPage('instagram.html');

const PER_PAGE = 12;                   // 한 페이지에 보여줄 게시물 수 (3열 기준 4줄. 숫자만 바꾸면 됩니다)
const grid = document.getElementById('ig-grid');
const statusEl = document.getElementById('ig-status');
const pagerEl = document.getElementById('ig-pager');

const total = INSTAGRAM_POSTS.length;
const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
let scriptReady = false;

/* 프로필 링크 */
(function setProfileLink() {
  const a = document.getElementById('ig-profile');
  if (!a) return;
  if (SITE.sns.instagram) a.href = SITE.sns.instagram;
  else { a.removeAttribute('href'); a.textContent = ''; }
})();

/* 인스타 embed 스크립트는 한 번만 불러온다 */
function loadEmbedScript() {
  return new Promise(resolve => {
    if (scriptReady) return resolve();
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.instagram.com/embed.js';
    s.onload = () => { scriptReady = true; resolve(); };
    s.onerror = () => resolve();
    document.body.appendChild(s);
  });
}

function embedBlock(url) {
  const clean = String(url).split('?')[0].replace(/\/?$/, '/');
  return `
    <blockquote class="instagram-media"
                data-instgrm-permalink="${esc(clean)}"
                data-instgrm-version="14">
      <a href="${esc(clean)}" target="_blank" rel="noopener">${esc(clean)}</a>
    </blockquote>`;
}

/* --- 페이지 그리기 -------------------------------------------------------- */
function clampPage(p) {
  p = parseInt(p, 10);
  if (!p || p < 1) p = 1;
  if (p > lastPage) p = lastPage;
  return p;
}

async function showPage(p, scroll) {
  p = clampPage(p);
  const start = (p - 1) * PER_PAGE;
  const slice = INSTAGRAM_POSTS.slice(start, start + PER_PAGE);

  grid.innerHTML = slice.map(u => `<div class="ig-cell">${embedBlock(u)}</div>`).join('');
  statusEl.textContent = total
    ? `${start + 1} – ${start + slice.length} / 전체 ${total}개`
    : '';

  renderPager(p);
  history.replaceState(null, '', '?page=' + p);
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });

  sizeCells();
  grid.querySelectorAll('.ig-cell').forEach(watchCell);

  await loadEmbedScript();
  if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
}

/* 칸 높이를 열 너비에 맞춰 잡는다.
   인스타 embed 는 [계정 헤더] + [이미지] + [하단 UI] 구조다.
   포스터가 세로 4:5 라 이미지 높이가 열 너비의 1.25배까지 커진다.
   그 높이에 헤더/하단 여유를 더해 이미지가 잘리지 않게 한다.
   (캡션·댓글 영역은 넘치면 잘리는데, 갤러리에서는 그게 오히려 깔끔하다) */
function sizeCells() {
  const cell = grid.querySelector('.ig-cell');
  if (!cell) return;
  const w = cell.getBoundingClientRect().width;
  if (!w) return;
  grid.style.setProperty('--ig-h', Math.round(w * 1.25 + 125) + 'px');
}
window.addEventListener('resize', sizeCells);

/* 칸마다 embed 가 준비되면 부드럽게 드러낸다.
   주의: iframe 이 생겼다고 바로 준비된 게 아니다. 내용이 들어오기 전에는
   높이가 0에 가까워서, 그 상태에서 자리표시를 풀면 칸이 찌그러진다.
   그래서 "실제로 높이가 잡혔을 때"만 준비된 것으로 본다. */
function watchCell(cell) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearInterval(timer);
    cell.classList.add('ready');
  };

  const grown = () => {
    const f = cell.querySelector('iframe');
    return f && f.getBoundingClientRect().height > 150;
  };

  const timer = setInterval(() => { if (grown()) finish(); }, 200);

  // 10초가 지나도 높이가 안 잡히면 (인스타 응답 지연/차단 등)
  // 로딩 표시는 걷어내되, 칸이 찌그러지지 않게 자리 높이는 유지한다
  setTimeout(() => {
    if (done) return;
    if (!grown()) cell.classList.add('stalled');
    finish();
  }, 10000);
}

/* --- 페이지 번호 (현재 앞뒤 2개 + 처음/끝) --------------------------------- */
function pageNumbers(cur) {
  const out = new Set([1, lastPage]);
  for (let i = cur - 2; i <= cur + 2; i++) if (i >= 1 && i <= lastPage) out.add(i);
  return [...out].sort((a, b) => a - b);
}

function renderPager(cur) {
  if (!total) { pagerEl.innerHTML = ''; return; }

  const nums = pageNumbers(cur);
  let html = `<button class="pg-nav" data-go="${cur - 1}" ${cur === 1 ? 'disabled' : ''}>← 이전</button>`;

  let prev = 0;
  nums.forEach(n => {
    if (prev && n - prev > 1) html += `<span class="pg-gap">…</span>`;
    html += `<button class="pg-num${n === cur ? ' active' : ''}" data-go="${n}">${n}</button>`;
    prev = n;
  });

  html += `<button class="pg-nav" data-go="${cur + 1}" ${cur === lastPage ? 'disabled' : ''}>다음 →</button>`;
  pagerEl.innerHTML = html;

  pagerEl.querySelectorAll('button[data-go]').forEach(b => {
    b.addEventListener('click', () => showPage(b.dataset.go, true));
  });
}

/* --- 시작 ----------------------------------------------------------------- */
if (!total) {
  grid.innerHTML = `<div class="empty-state">${NO_DATA}</div>`;
  pagerEl.innerHTML = '';
} else {
  showPage(new URLSearchParams(location.search).get('page') || 1, false);
}
