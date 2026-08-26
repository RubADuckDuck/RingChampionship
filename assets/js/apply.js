/* 아마추어 리그 참가 신청서 ------------------------------------------------
   지금은 서버 없이 브라우저 안에서만 동작하는 시안입니다.
   실제 접수로 바꾸실 때는 맨 아래 submitApplication() 함수 하나만 고치면 됩니다.
   -------------------------------------------------------------------------- */
initPage('future-league.html');

const form = document.getElementById('applyForm');
const receipt = document.getElementById('receipt');
const guardianBlock = document.getElementById('guardianBlock');
const STORE_KEY = 'ringfc_future_league_applications';

/* --- 선택 항목 채우기 -----------------------------------------------------
   data.js 의 FL_SPORTS / FL_WEIGHTS 에 값이 있으면 드롭다운으로 채우고,
   비어 있으면(=아직 확정된 목록이 없으면) 신청자가 직접 적는 입력칸으로 바꾼다. */
function fillChoice(id, values, placeholder) {
  const el = document.getElementById(id);

  if (values && values.length) {
    values.forEach(v => {
      const o = document.createElement('option');
      o.value = v; o.textContent = v;
      el.appendChild(o);
    });
    return;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.id = el.id;
  input.name = el.name;
  input.placeholder = placeholder;
  el.replaceWith(input);
}
fillChoice('sport', FL_SPORTS, '예: MMA / 킥복싱 (직접 입력)');
fillChoice('weight', FL_WEIGHTS, '예: -61kg (직접 입력)');

/* --- 나이 계산 ----------------------------------------------------------- */
function ageFrom(birth) {
  if (!birth) return null;
  const b = new Date(birth + 'T00:00:00');
  if (isNaN(b)) return null;
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
}

function isMinor() {
  const age = ageFrom(document.getElementById('birth').value);
  return age !== null && age < 18;
}

/* 생년월일을 입력하면 미성년자 여부에 따라 보호자 항목을 열고 닫는다 */
document.getElementById('birth').addEventListener('change', () => {
  guardianBlock.classList.toggle('show', isMinor());
});

/* --- 검증 --------------------------------------------------------------- */
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_PHONE = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

function fieldOf(el) { return el.closest('.field'); }
function mark(el, ok) { fieldOf(el).classList.toggle('invalid', !ok); return ok; }

function validate() {
  let ok = true;
  const v = id => document.getElementById(id).value.trim();
  const req = id => mark(document.getElementById(id), v(id) !== '');

  ok = req('name') && ok;
  ok = req('birth') && ok;
  ok = req('gym') && ok;
  ok = req('sport') && ok;
  ok = req('weight') && ok;

  // 성별 (라디오)
  const gender = form.querySelector('input[name="gender"]:checked');
  const genderField = form.querySelector('input[name="gender"]').closest('.field');
  genderField.classList.toggle('invalid', !gender);
  if (!gender) ok = false;

  // 연락처 / 이메일 형식
  ok = mark(document.getElementById('phone'), RE_PHONE.test(v('phone'))) && ok;
  ok = mark(document.getElementById('email'), RE_EMAIL.test(v('email'))) && ok;

  // 미성년자면 보호자 항목 필수
  if (isMinor()) {
    guardianBlock.classList.add('show');
    ok = mark(document.getElementById('gname'), v('gname') !== '') && ok;
    ok = mark(document.getElementById('gphone'), RE_PHONE.test(v('gphone'))) && ok;
  } else {
    mark(document.getElementById('gname'), true);
    mark(document.getElementById('gphone'), true);
  }

  // 개인정보 동의
  const agree = document.getElementById('agree');
  agree.closest('.field').classList.toggle('invalid', !agree.checked);
  if (!agree.checked) ok = false;

  return ok;
}

/* --- 접수번호 (FL-20260825-001) ------------------------------------------ */
function makeReceiptNo(saved) {
  const t = new Date();
  const p = n => String(n).padStart(2, '0');
  const day = `${t.getFullYear()}${p(t.getMonth() + 1)}${p(t.getDate())}`;
  const todayCount = saved.filter(a => (a.receiptNo || '').includes(day)).length + 1;
  return `FL-${day}-${String(todayCount).padStart(3, '0')}`;
}

/* --- 제출 --------------------------------------------------------------- */
form.addEventListener('submit', e => {
  e.preventDefault();

  if (!validate()) {
    const first = form.querySelector('.field.invalid');
    if (first) {
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = first.querySelector('input, select, textarea');
      if (input) input.focus({ preventScroll: true });
    }
    return;
  }

  const v = id => document.getElementById(id).value.trim();
  const minor = isMinor();
  const data = {
    name: v('name'),
    birth: v('birth'),
    age: ageFrom(v('birth')),
    gender: (form.querySelector('input[name="gender"]:checked') || {}).value || '',
    phone: v('phone'),
    email: v('email'),
    gym: v('gym'),
    sport: v('sport'),
    weight: v('weight'),
    record: v('record') || '없음',
    career: v('career') || '-',
    guardian: minor ? `${v('gname')} (${v('gphone')})` : '',
    memo: v('memo') || '-',
    submittedAt: new Date().toISOString()
  };

  submitApplication(data);
});

/* --- 접수 처리 (★ 실제 접수로 바꿀 때 이 함수만 수정) --------------------- */
function submitApplication(data) {
  // [지금] 브라우저 localStorage 에만 저장하는 시안 동작
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
  data.receiptNo = makeReceiptNo(saved);
  saved.push(data);
  localStorage.setItem(STORE_KEY, JSON.stringify(saved));

  // [나중에] 실제 접수로 바꾸는 방법
  //  - 구글폼 사용: 구글폼의 formResponse 주소로 fetch(POST)
  //  - Formspree 등 폼 서비스: fetch('https://formspree.io/f/xxxx', {method:'POST', body: ...})
  //  - 자체 서버 / Cloudflare Pages Functions: fetch('/api/apply', {method:'POST', ...})

  showReceipt(data);
}

/* --- 접수 완료 화면 ------------------------------------------------------- */
function showReceipt(d) {
  const rows = [
    ['이름', d.name],
    ['생년월일', `${d.birth} (만 ${d.age}세)`],
    ['성별', d.gender],
    ['연락처', d.phone],
    ['이메일', d.email],
    ['소속 체육관', d.gym],
    ['희망 종목', d.sport],
    ['희망 체급', d.weight],
    ['아마추어 전적', d.record],
    ['수련 기간', d.career]
  ];
  if (d.guardian) rows.push(['보호자', d.guardian]);
  rows.push(['전달사항', d.memo]);

  document.getElementById('receiptNo').textContent = d.receiptNo;
  document.getElementById('receiptSummary').innerHTML =
    rows.map(r => `<li><span class="k">${r[0]}</span><span>${esc(r[1])}</span></li>`).join('');

  form.style.display = 'none';
  receipt.classList.add('show');
  receipt.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* --- 다시 작성 ----------------------------------------------------------- */
document.getElementById('againBtn').addEventListener('click', () => {
  form.reset();
  form.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
  guardianBlock.classList.remove('show');
  form.style.display = '';
  receipt.classList.remove('show');
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* --- 입력 중 오류 표시 해제 ----------------------------------------------- */
form.addEventListener('input', e => {
  const f = e.target.closest('.field');
  if (f) f.classList.remove('invalid');
});
