/* ==========================================================================
   RING CHAMPIONSHIP - 사이트 데이터
   --------------------------------------------------------------------------
   ★ 대회 정보를 바꾸려면 이 파일만 수정하시면 됩니다. (다른 파일은 손대지 않아도 됩니다)

   [새 대회 추가하는 법]
   1. 아래 EVENTS 목록 맨 위에 { ... } 블록을 하나 복사해서 붙여넣습니다.
   2. id 는 영문/숫자로 겹치지 않게 지어주세요 (예: 'ring-08').
   3. date 는 'YYYY-MM-DD' 형식. 아직 날짜가 안 정해졌으면 빈칸('')으로 두세요.
      -> 화면에 "No data" 로 표시됩니다. (venue, broadcast 등 다른 항목도 동일)
   4. 포스터 이미지는 assets/img/ 폴더에 넣고 파일명을 poster / thumb 에 적습니다.
   5. status 를 비워두면 오늘 날짜 기준으로 예정/지난 대회가 자동 분류됩니다.
      강제로 지정하려면 'upcoming' 또는 'past' 라고 적으세요.
   6. tier 는 대회 등급입니다. RING CHAMPIONSHIP 본 대회는 'PRO',
      아마추어 대회는 'AMATEUR' 로 적으세요. 화면에 뱃지로 표시됩니다.
   ========================================================================== */

/* 단체 기본 정보 --------------------------------------------------------- */
const SITE = {
  name: 'RING CHAMPIONSHIP',
  nameKo: '링 챔피언십',
  slogan: 'ONE CIRCLE, ALL LEVELS',
  president: '김내철',
  presidentEn: 'NAE CHUL KIM',

  // 아래 항목은 실제 값을 아시면 채워주세요. 비어 있으면 링크 없이 이름만 표시됩니다.
  sns: {
    youtube: '',        // 예: 'https://www.youtube.com/@ringfc'
    instagram: ''       // 예: 'https://www.instagram.com/ringfc'
  },
  contact: {
    email: '',          // 예: 'contact@ringfc.kr'
    phone: '',          // 예: '02-000-0000'
    gym: 'RING FC OFFICIAL GYM'
  }
};

/* 대회 목록 -------------------------------------------------------------- */
const EVENTS = [
  {
    id: 'ring-08',
    tier: 'PRO',
    number: '08',
    title: 'RING CHAMPIONSHIP 08',
    subtitle: '',
    date: '',                       // 날짜가 정해지면 'YYYY-MM-DD' 로 입력
    time: '',
    venue: '',
    broadcast: '',
    poster: '',                     // 포스터가 나오면 파일명 입력
    thumb: '',
    status: 'upcoming',
    placeholder: true,              // 예시용 카드 표시. 대회가 확정되면 false 로 바꾸세요
    cards: [],
    sponsors: []
  },

  {
    id: 'ring-07',
    tier: 'PRO',
    number: '07',
    title: 'RING CHAMPIONSHIP 07',
    subtitle: '',
    date: '2026-05-30',
    time: '15:00',
    venue: '경기대학교 광교 씨름장',
    venueEn: 'SSIREUM ARENA, GWANGGYO, KYONGGI UNIVERSITY',
    broadcast: 'YouTube 멤버십 생중계',
    poster: 'assets/img/ring-07.jpg',
    thumb: 'assets/img/ring-07-thumb.jpg',
    status: '',
    cards: [
      {
        name: 'PART 2 · MAIN CARD',
        time: '18:00',
        bouts: [
          { tag: 'MAIN EVENT', rule: 'OPEN FINGER MUAY THAI', weight: '',
            red: 'SHIN DONG HYUN',  blue: 'ZHANG JINGTAO' },
          { rule: 'KICKBOXING', weight: 'FLYWEIGHT',
            red: 'JANG SEUNG WOO',  blue: 'JUNG HYUN WOO' },
          { rule: 'MMA', weight: 'BANTAMWEIGHT',
            red: 'LEE HWI JAE',     blue: 'MOON GUK HWAN' },
          { rule: 'MMA', weight: 'FLYWEIGHT',
            red: 'CHOI SANG HYEON', blue: 'HAILAI BUSHA' },
          { rule: 'KICKBOXING', weight: '-65KG CATCHWEIGHT',
            red: 'PARK JONG JUN',   blue: 'JUNG GI HAN' },
          { rule: 'MMA', weight: 'FLYWEIGHT',
            red: 'SONG MIN SEO',    blue: 'NISHIDA SHO' },
          { rule: 'MMA', weight: 'LIGHTWEIGHT',
            red: 'GO PIL SEUNG',    blue: 'GU GYO HYEON' }
        ]
      },
      {
        name: 'PART 1 · UNDER CARD',
        time: '15:00',
        bouts: [
          { rule: 'KICKBOXING', weight: '-67KG CATCHWEIGHT',
            red: 'SHIM YEON SOO',   blue: 'LEE HYUN SEOK' },
          { rule: 'KICKBOXING', weight: '-65KG CATCHWEIGHT',
            red: 'JEON HYEOK JIN',  blue: 'KIM DONG SU' },
          { rule: 'MMA', weight: 'BANTAMWEIGHT',
            red: 'PARK GUN WOO',    blue: 'KOMIYAMA SHUN' },
          { rule: 'MMA', weight: 'FLYWEIGHT',
            red: 'MOON SEOK HYUN',  blue: 'JUNG SUNG WON' },
          { rule: 'MMA', weight: 'LIGHTWEIGHT',
            red: 'KIM MIN SEUNG',   blue: 'YANG YUN SIK' }
        ]
      }
    ],
    sponsors: ['뉴와이메디컬', 'ADIVIDE', 'FAIRTEX', 'CS한방병원', 'FUTURE LEAGUE', 'SCKA']
  },

  {
    id: 'ring-06',
    tier: 'PRO',
    number: '06',
    title: 'RING CHAMPIONSHIP 06',
    subtitle: 'THE PRIVATE',
    date: '2025-08-01',
    time: '19:00',
    venue: 'JBK 컨벤션홀, 서울',
    venueEn: 'JBK CONVENTION HALL, SEOUL',
    broadcast: '',
    poster: 'assets/img/ring-06.jpg',
    thumb: 'assets/img/ring-06-thumb.jpg',
    key: 'assets/img/hero-bg.jpg',        // 홈 화면 히어로 배경으로 쓰는 이미지
    status: '',
    cards: [
      {
        name: 'MAIN CARD',
        time: '19:00',
        bouts: [
          { tag: 'MAIN EVENT', title: true, rule: 'MMA', weight: 'BANTAMWEIGHT CHAMPIONSHIP',
            red: 'EUN SUNG KIM',    blue: 'YOU MIN SHIN' },
          { rule: 'MMA', weight: 'BANTAMWEIGHT',
            red: 'GEUN HO SON',     blue: 'JONG PIL KIM' },
          { rule: 'MMA', weight: 'WELTERWEIGHT',
            red: 'YOUNG HO SEOL',   blue: 'JUN HO PARK' },
          { rule: 'MMA', weight: 'BANTAMWEIGHT',
            red: 'HAM GI WAN',      blue: 'SOICHIRO HIRAI' },
          { rule: 'MMA', weight: 'FLYWEIGHT',
            red: 'MIN SEO SONG',    blue: 'PHOENIX' },
          { rule: 'MMA', weight: 'BANTAMWEIGHT',
            red: 'JIN GON KIM',     blue: 'ASADBEK' },
          { rule: 'MMA', weight: 'FEATHERWEIGHT',
            red: 'KYEONG MIN SONG', blue: 'SEONG GUK BAE' }
        ]
      }
    ],
    sponsors: ['FAIRTEX FIGHT', 'CS한방병원', 'FAIRTEX', 'YUTH SPORT GEAR', 'COREUK',
               '옥천 돈까스', 'JBK 컨벤션홀', 'HOTEL IN 9', 'KONA', 'SUN THE BUD', 'ADIVIDE']
  },

  {
    id: 'fairtex-2024',
    tier: 'PRO',
    number: '',
    title: 'FAIRTEX FIGHT × RING CHAMPIONSHIP',
    subtitle: '',
    date: '2024-09-14',
    time: '',
    venue: '룸피니 스타디움, 방콕, 태국',
    venueEn: 'LUMPINEE STADIUM, BANGKOK, THAILAND',
    broadcast: 'CHANNEL 7 HD (태국)',
    poster: 'assets/img/fairtex-2024.jpg',
    thumb: 'assets/img/fairtex-2024-thumb.jpg',
    status: '',
    cards: [],
    sponsors: ['FAIRTEX', 'TERO DIGITAL', 'CHANNEL 7 HD', 'LUMPINEE BOXING STADIUM',
               'YUTH SPORT GEAR', 'KPMO', 'JRCC', 'EDEN', 'CRESPE', 'CS한방병원', 'YAWARA', 'ILMIEODAM']
  },

  {
    id: 'ring-02',
    tier: 'PRO',
    number: '02',
    title: 'RING CHAMPIONSHIP 02',
    subtitle: '',
    date: '2023-06-17',
    time: '15:00',
    venue: 'RING FC OFFICIAL GYM',
    venueEn: 'RING FC OFFICIAL GYM',
    broadcast: '',
    poster: 'assets/img/ring-02.jpg',
    thumb: 'assets/img/ring-02-thumb.jpg',
    status: '',
    cards: [
      {
        name: 'MAIN CARD',
        time: '15:00',
        bouts: [
          { tag: 'MAIN EVENT', rule: 'MMA', weight: 'FEATHERWEIGHT',
            red: 'KIM MIN WOO',    blue: 'SHIMIZU SHUNICHI' },
          { tag: 'BOUT 6', rule: 'MMA', weight: 'MIDDLEWEIGHT',
            red: 'JO KYUNG MIN',   blue: 'LEE JONG HWAN' },
          { tag: 'BOUT 5', rule: 'MMA', weight: 'BANTAMWEIGHT',
            red: 'KIM EUN SUNG',   blue: 'BAE SEONG YEOL' },
          { tag: 'BOUT 4', rule: 'MMA', weight: 'LIGHT HEAVYWEIGHT',
            red: 'MUHAMMAD SUFI',  blue: 'SIM WOO RAM' },
          { tag: 'BOUT 3', rule: 'MMA', weight: 'FEATHERWEIGHT',
            red: 'PARK JOO HYUN',  blue: 'KIM HYEON JUNG' },
          { tag: 'BOUT 2', rule: 'MMA', weight: '-63KG CATCHWEIGHT',
            red: 'HAN YUN SOO',    blue: 'JANIBEK XALID' },
          { tag: 'BOUT 1', rule: 'MMA', weight: '-90KG CATCHWEIGHT',
            red: 'KIM JEONG KYUN', blue: 'BAE DONG HEOK' }
        ]
      }
    ],
    sponsors: ['FAIRTEX', 'FAIRTEX FIGHT', 'YUTH SPORT GEAR']
  }
];

/* 체급 한글 표기 (화면 표시용) -------------------------------------------- */
const WEIGHT_KO = {
  'FLYWEIGHT': '플라이급',
  'BANTAMWEIGHT': '밴텀급',
  'BANTAMWEIGHT CHAMPIONSHIP': '밴텀급 타이틀전',
  'FEATHERWEIGHT': '페더급',
  'LIGHTWEIGHT': '라이트급',
  'WELTERWEIGHT': '웰터급',
  'MIDDLEWEIGHT': '미들급',
  'LIGHT HEAVYWEIGHT': '라이트헤비급'
};

/* 아마추어 리그 신청 선택지 -------------------------------------------------
   확인된 정보가 없어 비워두었습니다. 실제 운영하시는 종목과 체급을 적어주시면
   신청서의 드롭다운이 자동으로 채워집니다. 비어 있는 동안에는 신청자가
   직접 입력하는 칸으로 표시됩니다.

   예) const FL_SPORTS = ['MMA', '킥복싱'];
       const FL_WEIGHTS = ['밴텀급 (-61kg)', '페더급 (-66kg)'];
   -------------------------------------------------------------------------- */
const FL_SPORTS = [];
const FL_WEIGHTS = [];
