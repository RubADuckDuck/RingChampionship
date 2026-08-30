/* 인스타그램 게시물 목록 --------------------------------------------------
   data.js 의 INSTAGRAM_POSTS 를 화면에 보이는 만큼씩 나눠서 불러온다.

   [왜 나눠서 불러오나]
   인스타 게시물 하나가 iframe 하나라, 수백 개를 한 번에 깔면 페이지가 매우 무거워진다.
   그래서 처음에는 한 묶음만 그리고, 스크롤이 목록 끝에 닿을 때마다 다음 묶음을 그린다.
   보기에는 끝없이 이어지는 목록이지만 실제로 불러오는 건 본 만큼뿐이다.
   -------------------------------------------------------------------------- */
initPage('instagram.html');

const BATCH = 6;                       // 한 번에 불러올 게시물 수
const grid = document.getElementById('ig-grid');
const sentinel = document.getElementById('ig-sentinel');
const statusEl = document.getElementById('ig-status');

let cursor = 0;                        // 지금까지 그린 개수
let loading = false;
let scriptReady = false;

/* 프로필 링크 */
(function setProfileLink() {
  const a = document.getElementById('ig-profile');
  if (SITE.sns.instagram) {
    a.href = SITE.sns.instagram;
  } else {
    a.removeAttribute('href');
    a.textContent = '';
  }
})();

/* 인스타 embed 스크립트는 페이지당 한 번만 불러온다 */
function loadEmbedScript() {
  return new Promise(resolve => {
    if (scriptReady) return resolve();
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.instagram.com/embed.js';
    s.onload = () => { scriptReady = true; resolve(); };
    s.onerror = () => { scriptReady = false; resolve(); };   // 실패해도 진행 (아래에서 안내 표시)
    document.body.appendChild(s);
  });
}

/* 게시물 주소 -> 인스타 공식 embed 마크업 */
function embedBlock(url) {
  const clean = String(url).split('?')[0].replace(/\/?$/, '/');
  return `
    <blockquote class="instagram-media"
                data-instgrm-permalink="${esc(clean)}"
                data-instgrm-version="14">
      <a href="${esc(clean)}" target="_blank" rel="noopener">${esc(clean)}</a>
    </blockquote>`;
}

/* 다음 묶음 그리기 */
async function loadNext() {
  if (loading || cursor >= INSTAGRAM_POSTS.length) return;
  loading = true;

  const slice = INSTAGRAM_POSTS.slice(cursor, cursor + BATCH);

  // 열(column) 레이아웃이 끊기지 않도록 묶음을 따로 감싸지 않고 한 흐름에 이어 붙인다
  slice.forEach(url => {
    const cell = document.createElement('div');
    cell.className = 'ig-cell';
    cell.innerHTML = embedBlock(url);
    grid.appendChild(cell);
  });
  cursor += slice.length;

  await loadEmbedScript();

  // 새로 추가된 blockquote 들을 한 번에 렌더링한다
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
  }

  loading = false;
  updateStatus();
}

function updateStatus() {
  const total = INSTAGRAM_POSTS.length;

  if (total === 0) {
    statusEl.innerHTML = `
      <div class="empty-state">
        ${NO_DATA}
        <div class="muted" style="margin-top:14px;font-size:13px">
          assets/js/data.js 의 INSTAGRAM_POSTS 에 게시물 주소를 넣으면 여기에 표시됩니다.
        </div>
      </div>`;
    return;
  }

  if (cursor >= total) {
    statusEl.innerHTML = `<div class="ig-end">전체 ${total}개를 모두 불러왔습니다</div>`;
    return;
  }

  statusEl.innerHTML = `<div class="ig-more">${cursor} / ${total} · 스크롤하면 계속 불러옵니다</div>`;
}

/* 감지 지점이 아직 화면 안에 있는지 */
function sentinelInView() {
  const r = sentinel.getBoundingClientRect();
  return r.top <= (window.innerHeight || 0) + 400;
}

/* 감지 지점이 화면 밖으로 밀려날 때까지 계속 불러온다.
   IntersectionObserver 는 '교차 상태가 바뀔 때'만 발동하므로,
   한 묶음을 그린 뒤에도 감지 지점이 그대로 화면 안에 있으면 다시 불리지 않는다.
   (게시물이 적거나 화면이 큰 경우가 그렇다) 그래서 직접 확인해 채워준다. */
async function fill() {
  while (cursor < INSTAGRAM_POSTS.length && sentinelInView()) {
    const before = cursor;
    await loadNext();
    if (cursor === before) break;        // 더 진행되지 않으면 무한루프 방지
    await new Promise(r => setTimeout(r, 50));
  }
}

/* 목록 끝이 화면에 들어오면 다음 묶음 로드 */
const io = new IntersectionObserver(entries => {
  if (entries.some(e => e.isIntersecting)) fill();
}, { rootMargin: '400px' });

io.observe(sentinel);

updateStatus();
fill();
