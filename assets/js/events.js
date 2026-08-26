/* 경기 일정 목록 ---------------------------------------------------------- */
initPage('events.html');

const listEl = document.getElementById('event-list');
const tabBtns = document.querySelectorAll('.tabs button');

function showTab(tab) {
  const items = tab === 'upcoming' ? upcomingEvents() : pastEvents();
  listEl.innerHTML = items.length
    ? items.map(eventCard).join('')
    : `<div class="empty-state" style="grid-column:1/-1">${NO_DATA}</div>`;

  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  history.replaceState(null, '', '?tab=' + tab);
}

tabBtns.forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));

// ?tab=past 로 들어오면 지난 대회 탭부터 표시
const initialTab = new URLSearchParams(location.search).get('tab') === 'past' ? 'past' : 'upcoming';
showTab(initialTab);
