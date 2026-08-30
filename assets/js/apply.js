/* 참가 신청 페이지 ----------------------------------------------------------
   신청은 관장님이 운영하시는 실제 구글폼으로 연결됩니다.
   폼 주소는 data.js 의 APPLY_LINKS 에서 관리합니다.
   -------------------------------------------------------------------------- */
initPage('future-league.html');

/* 신청 링크 */
(function renderApplyLinks() {
  const box = document.getElementById('apply-list');
  if (!box) return;

  if (!APPLY_LINKS.length) {
    box.innerHTML = `<div class="empty-state">${NO_DATA}</div>`;
    return;
  }

  box.innerHTML = APPLY_LINKS.map(l => {
    const open = !!l.url;
    return `
      <div class="apply-card${open ? '' : ' closed'}">
        <div>
          <h3>${esc(l.title)}</h3>
          <p>${l.desc ? esc(l.desc) : NO_DATA}</p>
        </div>
        ${open
          ? `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">신청서 열기</a>`
          : `<span class="badge">접수 준비 중</span>`}
      </div>`;
  }).join('');
})();

/* 공식 채널 */
(function renderCommunity() {
  const box = document.getElementById('community-list');
  if (!box) return;

  const items = (typeof COMMUNITY_LINKS !== 'undefined' ? COMMUNITY_LINKS : [])
    .filter(l => l.url);

  if (!items.length) {
    box.innerHTML = `<div class="empty-state">${NO_DATA}</div>`;
    return;
  }

  box.innerHTML = items.map(l => `
    <a class="link-card" href="${esc(l.url)}" target="_blank" rel="noopener">
      <span>${esc(l.title)}</span>
      <span class="link-host">${esc(new URL(l.url).host.replace(/^www\./,''))}</span>
    </a>`).join('');
})();
