const EXERCISE_VISUALS = {
  // Warmup drills
  warmup_bike: {
    turkishTitle: "Kondisyon Bisikleti (Yüksek Kadans)",
    equipment: "Dikey / Yatay Kondisyon Bisikleti · Seviye 4",
    cues: ["10-12 dk kesintisiz", "Düşük direnç (Seviye 4)", "Sinovyal sıvı aktivasyonu"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <g stroke="var(--vis-grid, rgba(225,29,72,0.12))" stroke-width="1">
        <line x1="0" y1="115" x2="320" y2="115"/>
        <line x1="160" y1="10" x2="160" y2="130" stroke-dasharray="3 3"/>
      </g>
      <!-- Bike Frame -->
      <circle cx="95" cy="95" r="22" fill="none" stroke="#52525b" stroke-width="3"/>
      <circle cx="195" cy="95" r="22" fill="none" stroke="#e11d48" stroke-width="3" stroke-dasharray="8 4"/>
      <path d="M95 95 L135 55 L185 55 L145 95 Z" fill="none" stroke="#71717a" stroke-width="3" stroke-linejoin="round"/>
      <line x1="135" y1="55" x2="128" y2="38" stroke="#a1a1aa" stroke-width="3"/>
      <line x1="120" y1="38" x2="138" y2="38" stroke="#f4f4f6" stroke-width="4" stroke-linecap="round"/>
      <line x1="185" y1="55" x2="195" y2="32" stroke="#a1a1aa" stroke-width="3"/>
      <!-- Rider & Highlighted Knee/Quad -->
      <circle cx="152" cy="22" r="8" fill="#e4e4e7"/>
      <path d="M132 38 L158 58 L145 95" fill="none" stroke="#e11d48" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="158" cy="58" r="5" fill="#fb7185"/>
      <!-- Rotation Arrow -->
      <path d="M225 78 A24 24 0 1 1 225 112" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="225,116 219,108 229,108" fill="#e11d48"/>
      <text x="235" y="52" fill="#f4f4f6" font-size="10" font-weight="700">SEVİYE 4 · 10-12 DK</text>
      <text x="235" y="68" fill="#fb7185" font-size="9" font-weight="600">Yüksek Kadans / Akıcı</text>
    </svg>`,
  },
  warmup_slr: {
    turkishTitle: "Ayak Bileği Ağırlıklı Düz Bacak Kaldırma (SLR)",
    equipment: "Minder + 3 kg Ayak Bileği Ağırlığı",
    cues: ["Diz tam kilitli (0°)", "Tepe noktada 2 sn tutuş", "2 set × 12 tekrar"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="20" y1="112" x2="300" y2="112" stroke="#3f3f46" stroke-width="3"/>
      <!-- Supine athlete -->
      <circle cx="52" cy="96" r="8" fill="#e4e4e7"/>
      <line x1="62" y1="102" x2="140" y2="104" stroke="#a1a1aa" stroke-width="7" stroke-linecap="round"/>
      <!-- Left leg bent for support -->
      <path d="M140 104 L175 72 L205 110" fill="none" stroke="#52525b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Right leg straight raised with red quad & ankle weight -->
      <line x1="140" y1="104" x2="232" y2="54" stroke="#e11d48" stroke-width="7" stroke-linecap="round"/>
      <rect x="220" y="52" width="12" height="8" rx="2" transform="rotate(-28 220 52)" fill="#fb7185"/>
      <!-- Motion arrow -->
      <path d="M248 98 Q256 72 244 50" fill="none" stroke="#e11d48" stroke-width="2.5" stroke-dasharray="4 3"/>
      <polygon points="242,46 240,56 249,53" fill="#e11d48"/>
      <text x="25" y="34" fill="#f4f4f6" font-size="10" font-weight="700">DÜZ BACAK KALDIRMA (SLR)</text>
      <text x="25" y="50" fill="#fb7185" font-size="9" font-weight="600">3 kg · Tepede 2 sn Kuadriseps Kilitle</text>
    </svg>`,
  },
  warmup_bridge: {
    turkishTitle: "Çift / Tek Bacak Kalça Köprüsü (Glute Bridge)",
    equipment: "Minder (Vücut Ağırlığı · İzometrik Tutuş)",
    cues: ["Kalça ve arka bacak sıkılı", "2 set × 15 sn tutuş", "Bel çukurlaştırılmaz"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="20" y1="112" x2="300" y2="112" stroke="#3f3f46" stroke-width="3"/>
      <circle cx="58" cy="100" r="8" fill="#e4e4e7"/>
      <!-- Bridge torso + hips -->
      <line x1="68" y1="104" x2="155" y2="68" stroke="#e11d48" stroke-width="8" stroke-linecap="round"/>
      <!-- Knees to feet -->
      <path d="M155 68 L195 52 L225 110" fill="none" stroke="#e11d48" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="155" cy="68" r="5" fill="#fb7185"/>
      <!-- Hold arrow -->
      <line x1="155" y1="98" x2="155" y2="78" stroke="#fb7185" stroke-width="2.5"/>
      <polygon points="155,73 150,81 160,81" fill="#fb7185"/>
      <text x="25" y="34" fill="#f4f4f6" font-size="10" font-weight="700">GLUTE BRIDGE (KALÇA KÖPRÜSÜ)</text>
      <text x="25" y="50" fill="#fb7185" font-size="9" font-weight="600">2 × 15 sn Tutuş · Hamstring & Kalça Ateşleme</text>
    </svg>`,
  },

  // DAY A (SALI)
  leg_press_ecc: {
    turkishTitle: "45° / Yatay Leg Press (2 Yukarı - 1 Aşağı & Sağ İzole)",
    equipment: "Leg Press Makinesi · 0°–90° Güvenli Açı",
    cues: ["İlk 2 set: 2 ayak it, sağla 3 sn indir", "Son 2 set: Sadece sağ bacak", "Diz 90°'yi geçmez, içe çökmez"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- 45 deg sled track -->
      <line x1="40" y1="118" x2="120" y2="118" stroke="#52525b" stroke-width="4"/>
      <line x1="45" y1="118" x2="25" y2="68" stroke="#71717a" stroke-width="5" stroke-linecap="round"/>
      <line x1="115" y1="118" x2="245" y2="28" stroke="#3f3f46" stroke-width="3" stroke-dasharray="5 3"/>
      <!-- Footplate & Sled -->
      <line x1="162" y1="45" x2="195" y2="92" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <rect x="182" y="42" width="38" height="24" rx="4" transform="rotate(-35 182 42)" fill="#27272a" stroke="#e11d48" stroke-width="2"/>
      <!-- Athlete in seat -->
      <circle cx="38" cy="58" r="8" fill="#e4e4e7"/>
      <line x1="42" y1="68" x2="72" y2="110" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round"/>
      <!-- Highlighted Right Quad & Knee 90 deg -->
      <path d="M72 110 L118 68 L172 72" fill="none" stroke="#e11d48" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="118" cy="68" r="4.5" fill="#fb7185"/>
      <!-- Directional arrows -->
      <path d="M135 45 L168 23" stroke="#22c55e" stroke-width="2.5"/>
      <polygon points="172,20 163,21 168,28" fill="#22c55e"/>
      <path d="M210 72 L175 96" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="171,99 180,98 175,91" fill="#e11d48"/>
      <text x="195" y="114" fill="#f4f4f6" font-size="10" font-weight="700">1 sn İtiş ↑ / 3 sn Sağ İniş ↓</text>
      <text x="195" y="128" fill="#fb7185" font-size="9" font-weight="600">Max 90° Diz Açısı · Kuadriseps</text>
    </svg>`,
  },
  step_up: {
    turkishTitle: "Kutuya Kontrollü Çıkış (Lateral / Forward Step-Up)",
    equipment: "15–25 cm Step Kutusu · Sağ Ayak Kutuda Sabit",
    cues: ["Sağ ayak kutu üstünde sabit", "2 sn çıkış, 3 sn kontrollü iniş", "Diz kapağı 2. parmak hizasında"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="20" y1="122" x2="300" y2="122" stroke="#3f3f46" stroke-width="2"/>
      <!-- Step Box -->
      <rect x="115" y="92" width="65" height="30" rx="3" fill="#1f1f26" stroke="#e11d48" stroke-width="2"/>
      <!-- Athlete stepping up on right leg -->
      <circle cx="138" cy="24" r="8" fill="#e4e4e7"/>
      <line x1="138" y1="34" x2="134" y2="66" stroke="#a1a1aa" stroke-width="7" stroke-linecap="round"/>
      <!-- Right working leg on box -->
      <path d="M134 66 L148 74 L145 92" fill="none" stroke="#e11d48" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Left trailing leg -->
      <path d="M134 66 L112 92 L100 120" fill="none" stroke="#52525b" stroke-width="5" stroke-linecap="round"/>
      <!-- Up/Down arrows -->
      <line x1="82" y1="88" x2="82" y2="42" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="82,36 77,45 87,45" fill="#e11d48"/>
      <text x="192" y="52" fill="#f4f4f6" font-size="10" font-weight="700">SAĞ AYAK KUTUDA SABİT</text>
      <text x="192" y="68" fill="#fb7185" font-size="9" font-weight="600">2 sn Çıkış ↑ · 3 sn Eksantrik İniş ↓</text>
      <text x="192" y="84" fill="#a1a1aa" font-size="9">Diz içe (valgus) çökmemeli</text>
    </svg>`,
  },
  leg_curl_21: {
    turkishTitle: "Oturarak Arka Bacak Bükme — Seated Leg Curl (2-1 Tekniği)",
    equipment: "Seated Leg Curl Makinesi · 2 Çek - 1 Sal",
    cues: ["2 bacakla 1 sn'de alta çek", "Sadece sağ bacakla 3 sn'de sal", "Hamstring otogreft koruyucu"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Seat frame -->
      <path d="M48 35 L48 92 L98 92" fill="none" stroke="#71717a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="60" y1="92" x2="50" y2="125" stroke="#52525b" stroke-width="4"/>
      <line x1="90" y1="92" x2="100" y2="125" stroke="#52525b" stroke-width="4"/>
      <!-- Athlete seated -->
      <circle cx="62" cy="28" r="8" fill="#e4e4e7"/>
      <line x1="60" y1="38" x2="60" y2="85" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round"/>
      <!-- Thigh with glowing red hamstring -->
      <line x1="60" y1="86" x2="118" y2="86" stroke="#e11d48" stroke-width="9" stroke-linecap="round"/>
      <!-- Extended leg (dashed) vs Curled leg (solid) -->
      <line x1="118" y1="86" x2="172" y2="80" stroke="#52525b" stroke-width="5" stroke-dasharray="4 3" stroke-linecap="round"/>
      <line x1="118" y1="86" x2="124" y2="124" stroke="#f4f4f6" stroke-width="6" stroke-linecap="round"/>
      <circle cx="118" cy="86" r="5" fill="#fb7185"/>
      <circle cx="128" cy="118" r="6" fill="#e11d48"/>
      <!-- Arc arrow -->
      <path d="M168 88 A42 42 0 0 1 138 124" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="134,126 143,125 139,117" fill="#e11d48"/>
      <text x="184" y="48" fill="#f4f4f6" font-size="10" font-weight="700">SEATED LEG CURL (2-1)</text>
      <text x="184" y="65" fill="#fb7185" font-size="9" font-weight="600">1 sn Çift Çek ↙ · 3 sn Sağ Aç ↗</text>
      <text x="184" y="82" fill="#a1a1aa" font-size="9">Arka bacak (Hamstring) zırhı</text>
    </svg>`,
  },
  hip_abductor: {
    turkishTitle: "Oturarak Bacak Dışa Açış (Hip Abductor Machine)",
    equipment: "Hip Abductor Makinesi (Pedler Dışta · Dışa İtiş)",
    cues: ["Dizleri dışa doğru 2 sn'de aç", "2 sn'de kontrollü kapat", "UYARI: İçe kapatma (Adductor) YASAK!"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Top-down / Front schematic of Abduction -->
      <rect x="65" y="25" width="60" height="22" rx="5" fill="#27272a" stroke="#71717a" stroke-width="2"/>
      <!-- Hip joints -->
      <circle cx="80" cy="48" r="7" fill="#e11d48"/>
      <circle cx="110" cy="48" r="7" fill="#e11d48"/>
      <!-- Legs pushing outward -->
      <line x1="80" y1="48" x2="46" y2="108" stroke="#f4f4f6" stroke-width="7" stroke-linecap="round"/>
      <line x1="110" y1="48" x2="144" y2="108" stroke="#f4f4f6" stroke-width="7" stroke-linecap="round"/>
      <!-- Outer pads -->
      <rect x="32" y="88" width="10" height="22" rx="3" transform="rotate(28 32 88)" fill="#e11d48"/>
      <rect x="148" y="88" width="10" height="22" rx="3" transform="rotate(-28 148 88)" fill="#e11d48"/>
      <!-- Outward arrows -->
      <line x1="42" y1="75" x2="18" y2="75" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="14,75 22,70 22,80" fill="#e11d48"/>
      <line x1="148" y1="75" x2="172" y2="75" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="176,75 168,70 168,80" fill="#e11d48"/>
      <text x="184" y="46" fill="#f4f4f6" font-size="10" font-weight="700">DIŞA AÇIŞ (ABDUCTOR)</text>
      <text x="184" y="63" fill="#fb7185" font-size="9" font-weight="600">Yan Kalça (Gluteus Medius)</text>
      <text x="184" y="82" fill="#f87171" font-size="9" font-weight="700">✕ Adductor (İçe Kapatma) Yasak</text>
    </svg>`,
  },
  incline_db_press: {
    turkishTitle: "Eğimli Sehpada Dambıl Göğüs İtiş (Incline Dumbbell Press)",
    equipment: "30°–45° Eğimli Sehpa + Çift Dambıl",
    cues: ["Sehpa açısı 30-45°", "Ayaklar yerde pasif (Leg drive yok)", "4 × 6-8 ağır kontrollü set (RIR 1-2)"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="20" y1="122" x2="300" y2="122" stroke="#3f3f46" stroke-width="2"/>
      <!-- Incline Bench 35 deg -->
      <line x1="45" y1="62" x2="115" y2="104" stroke="#71717a" stroke-width="5" stroke-linecap="round"/>
      <line x1="115" y1="104" x2="142" y2="96" stroke="#71717a" stroke-width="5" stroke-linecap="round"/>
      <line x1="75" y1="82" x2="65" y2="122" stroke="#52525b" stroke-width="3"/>
      <line x1="125" y1="102" x2="132" y2="122" stroke="#52525b" stroke-width="3"/>
      <!-- Athlete on incline bench -->
      <circle cx="54" cy="48" r="8" fill="#e4e4e7"/>
      <line x1="60" y1="58" x2="112" y2="96" stroke="#e11d48" stroke-width="9" stroke-linecap="round"/>
      <!-- Passive legs -->
      <path d="M112 96 L148 92 L162 120" fill="none" stroke="#52525b" stroke-width="5" stroke-linecap="round"/>
      <!-- Pressing arm & Dumbbell -->
      <line x1="78" y1="68" x2="78" y2="24" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <rect x="66" y="16" width="24" height="8" rx="2" fill="#e11d48"/>
      <!-- Vertical press arrow -->
      <line x1="102" y1="62" x2="102" y2="22" stroke="#e11d48" stroke-width="2.5" stroke-dasharray="3 2"/>
      <polygon points="102,16 97,25 107,25" fill="#e11d48"/>
      <text x="176" y="46" fill="#f4f4f6" font-size="10" font-weight="700">INCLINE DUMBBELL PRESS</text>
      <text x="176" y="63" fill="#fb7185" font-size="9" font-weight="600">Üst Göğüs · 30-45° Eğimli Sehpa</text>
      <text x="176" y="80" fill="#a1a1aa" font-size="9">Dizden güç alma (Leg drive) yok</text>
    </svg>`,
  },
  cable_cross_fly: {
    turkishTitle: "Oturarak Kablo Sıkıştırma / Kelebek (Seated Cable Cross / Pec Deck)",
    equipment: "Pec Deck Fly Makinesi veya Kablo İstasyonunda Sehpa",
    cues: ["Oturarak sırt sabit", "Göğüs ortasında 1 sn tam sıkıştır", "Son tekrarda tam tükeniş (Failure)"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Top-down / Front chest fly view -->
      <circle cx="95" cy="36" r="9" fill="#e4e4e7"/>
      <rect x="73" y="48" width="44" height="54" rx="8" fill="#1f1f26" stroke="#71717a" stroke-width="2"/>
      <!-- Glowing Chest Pecs -->
      <rect x="77" y="54" width="16" height="18" rx="4" fill="#e11d48"/>
      <rect x="97" y="54" width="16" height="18" rx="4" fill="#e11d48"/>
      <!-- Open arms (dashed) -->
      <line x1="73" y1="60" x2="32" y2="52" stroke="#52525b" stroke-width="4" stroke-dasharray="3 3" stroke-linecap="round"/>
      <line x1="117" y1="60" x2="158" y2="52" stroke="#52525b" stroke-width="4" stroke-dasharray="3 3" stroke-linecap="round"/>
      <!-- Closed arms squeezing in front -->
      <path d="M75 60 Q68 88 90 88" fill="none" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <path d="M115 60 Q122 88 100 88" fill="none" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <!-- Converging arrows -->
      <path d="M38 72 Q60 95 82 92" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="86,91 77,88 79,97" fill="#e11d48"/>
      <path d="M152 72 Q130 95 108 92" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="104,91 113,88 111,97" fill="#e11d48"/>
      <text x="176" y="46" fill="#f4f4f6" font-size="10" font-weight="700">PEC DECK / CABLE FLY</text>
      <text x="176" y="63" fill="#fb7185" font-size="9" font-weight="600">Oturarak Göğüs İzolasyon</text>
      <text x="176" y="80" fill="#a1a1aa" font-size="9">Ortada 1 sn sıkma · Failure</text>
    </svg>`,
  },
  seated_ohp: {
    turkishTitle: "Oturarak Sırt Destekli Omuz İtiş (Seated Overhead Press)",
    equipment: "90° Dik Sırt Destekli Sehpa + Dambıl veya Shoulder Press Makinesi",
    cues: ["90° sırt desteğiyle oturarak", "Omurga ve dize sıfır dikey stres", "4 × 8-10 kontrollü tekrar (RIR 1-2)"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- 90 deg seat -->
      <path d="M88 38 L88 112 L128 112" fill="none" stroke="#71717a" stroke-width="4" stroke-linecap="round"/>
      <!-- Athlete front/side -->
      <circle cx="95" cy="48" r="8" fill="#e4e4e7"/>
      <rect x="80" y="60" width="30" height="44" rx="5" fill="#27272a"/>
      <!-- Highlighted Deltoids -->
      <circle cx="76" cy="64" r="7" fill="#e11d48"/>
      <circle cx="114" cy="64" r="7" fill="#e11d48"/>
      <!-- Arms pressing overhead -->
      <path d="M76 64 L58 62 L58 26" fill="none" stroke="#f4f4f6" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M114 64 L132 62 L132 26" fill="none" stroke="#f4f4f6" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="46" y="20" width="24" height="7" rx="2" fill="#e11d48"/>
      <rect x="120" y="20" width="24" height="7" rx="2" fill="#e11d48"/>
      <text x="168" y="46" fill="#f4f4f6" font-size="10" font-weight="700">SEATED OVERHEAD PRESS</text>
      <text x="168" y="63" fill="#fb7185" font-size="9" font-weight="600">Ön & Yan Omuz Ana Kuvvet</text>
      <text x="168" y="80" fill="#a1a1aa" font-size="9">90° Sırt Destekli Oturarak</text>
    </svg>`,
  },
  seated_lat_raise: {
    turkishTitle: "Oturarak Dambıl Yana Açış (Seated Dumbbell Lateral Raise)",
    equipment: "Düz veya Dik Sehpada Oturarak + Çift Dambıl",
    cues: ["Oturarak ivme (cheat) sıfırlanır", "Dirsekler hafif kırık omuz hizasına aç", "Son sette Beyond Failure (yarım tekrar)"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <circle cx="95" cy="36" r="8" fill="#e4e4e7"/>
      <rect x="80" y="48" width="30" height="48" rx="5" fill="#27272a"/>
      <rect x="78" y="96" width="34" height="10" rx="2" fill="#52525b"/>
      <!-- Highlighted Lateral Delts -->
      <circle cx="76" cy="54" r="7.5" fill="#e11d48"/>
      <circle cx="114" cy="54" r="7.5" fill="#e11d48"/>
      <!-- Arms raised to side -->
      <line x1="76" y1="54" x2="30" y2="50" stroke="#f4f4f6" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="114" y1="54" x2="160" y2="50" stroke="#f4f4f6" stroke-width="4.5" stroke-linecap="round"/>
      <rect x="20" y="45" width="12" height="8" rx="2" fill="#e11d48"/>
      <rect x="158" y="45" width="12" height="8" rx="2" fill="#e11d48"/>
      <!-- Arc arrows -->
      <path d="M58 92 A42 42 0 0 1 32 58" fill="none" stroke="#e11d48" stroke-width="2" stroke-dasharray="3 2"/>
      <path d="M132 92 A42 42 0 0 0 158 58" fill="none" stroke="#e11d48" stroke-width="2" stroke-dasharray="3 2"/>
      <text x="180" y="46" fill="#f4f4f6" font-size="10" font-weight="700">SEATED LATERAL RAISE</text>
      <text x="180" y="63" fill="#fb7185" font-size="9" font-weight="600">Yan Omuz Genişliği (V-Taper)</text>
      <text x="180" y="80" fill="#a1a1aa" font-size="9">Beyond Failure (Yarım tekrarlarla)</text>
    </svg>`,
  },
  rope_pushdown: {
    turkishTitle: "Oturarak Halatla Arka Kol İtiş (Seated Cable Rope Pushdown)",
    equipment: "Üst Makara Halat (Rope) + İstasyon Önünde Sehpa",
    cues: ["Sehpada oturarak dize yük binmez", "Dirsekler gövde yanında kilitli", "Altta halatı iki yana açarak sıkıştır"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Cable tower -->
      <line x1="145" y1="12" x2="145" y2="125" stroke="#52525b" stroke-width="4"/>
      <circle cx="145" cy="18" r="5" fill="#71717a"/>
      <line x1="145" y1="18" x2="112" y2="68" stroke="#a1a1aa" stroke-width="2"/>
      <!-- Seated athlete -->
      <rect x="52" y="88" width="32" height="8" rx="2" fill="#71717a"/>
      <line x1="68" y1="96" x2="68" y2="124" stroke="#52525b" stroke-width="4"/>
      <circle cx="78" cy="34" r="8" fill="#e4e4e7"/>
      <line x1="76" y1="44" x2="72" y2="88" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round"/>
      <!-- Upper arm with glowing red Triceps -->
      <line x1="78" y1="48" x2="84" y2="74" stroke="#e11d48" stroke-width="7" stroke-linecap="round"/>
      <!-- Forearm pushing rope down -->
      <line x1="84" y1="74" x2="112" y2="96" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <circle cx="84" cy="74" r="4" fill="#fb7185"/>
      <!-- Downward arrow -->
      <line x1="122" y1="62" x2="122" y2="98" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="122,104 117,95 127,95" fill="#e11d48"/>
      <text x="168" y="46" fill="#f4f4f6" font-size="10" font-weight="700">ROPE TRICEPS PUSHDOWN</text>
      <text x="168" y="63" fill="#fb7185" font-size="9" font-weight="600">Arka Kol (Triceps) · Oturarak</text>
      <text x="168" y="80" fill="#a1a1aa" font-size="9">Dirsek sabit · Tam tükeniş</text>
    </svg>`,
  },

  // DAY B (PERŞEMBE)
  db_rdl: {
    turkishTitle: "Dambıl Romen Deadlift — Hip Hinge (Dumbbell RDL)",
    equipment: "Çift Dambıl · Dizler 15°–20° Sabit Kırık",
    cues: ["Diz bükerek değil, kalçayı geriye iterek in", "Dambıllar bacaklara yakın süzülür", "3 sn kontrollü iniş · Hamstring uzaması"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="20" y1="122" x2="300" y2="122" stroke="#3f3f46" stroke-width="2"/>
      <!-- Hip hinge posture -->
      <circle cx="142" cy="42" r="8" fill="#e4e4e7"/>
      <!-- Flat back torso angled forward -->
      <line x1="134" y1="46" x2="78" y2="68" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round"/>
      <!-- Highlighted Hamstrings & Glutes -->
      <line x1="78" y1="68" x2="92" y2="96" stroke="#e11d48" stroke-width="8" stroke-linecap="round"/>
      <line x1="92" y1="96" x2="96" y2="120" stroke="#f4f4f6" stroke-width="6" stroke-linecap="round"/>
      <!-- Arms hanging straight with dumbbell -->
      <line x1="122" y1="52" x2="122" y2="96" stroke="#f4f4f6" stroke-width="4.5" stroke-linecap="round"/>
      <rect x="112" y="94" width="20" height="8" rx="2" fill="#e11d48"/>
      <!-- Hip push back arrow -->
      <line x1="68" y1="68" x2="38" y2="68" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="32,68 41,63 41,73" fill="#e11d48"/>
      <text x="168" y="46" fill="#f4f4f6" font-size="10" font-weight="700">DUMBBELL RDL (HIP HINGE)</text>
      <text x="168" y="63" fill="#fb7185" font-size="9" font-weight="600">Kalçayı Geriye İt ← · Sırt Düz</text>
      <text x="168" y="80" fill="#a1a1aa" font-size="9">Dizler 15-20° sabit · 3 sn İniş</text>
    </svg>`,
  },
  uni_leg_curl: {
    turkishTitle: "Tek Bacak Arka Bacak Bükme (Unilateral Lying / Seated Leg Curl)",
    equipment: "Lying veya Seated Leg Curl Makinesi · Tek Bacak İzole",
    cues: ["Sağ ve sol bacak ayrı ayrı çalışılır", "Sağ bacağın ağırlığı/tekrarı referans alınır", "2 sn çekiş, 3 sn kontrollü iniş"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Prone bench -->
      <path d="M35 88 L105 78 L168 92" fill="none" stroke="#71717a" stroke-width="5" stroke-linecap="round"/>
      <line x1="55" y1="86" x2="55" y2="122" stroke="#52525b" stroke-width="4"/>
      <line x1="145" y1="88" x2="145" y2="122" stroke="#52525b" stroke-width="4"/>
      <!-- Athlete lying prone -->
      <circle cx="42" cy="72" r="7" fill="#e4e4e7"/>
      <line x1="52" y1="76" x2="105" y2="72" stroke="#a1a1aa" stroke-width="7" stroke-linecap="round"/>
      <!-- Highlighted Right Hamstring -->
      <line x1="105" y1="72" x2="152" y2="84" stroke="#e11d48" stroke-width="8" stroke-linecap="round"/>
      <!-- Curled single lower leg -->
      <line x1="152" y1="84" x2="132" y2="42" stroke="#f4f4f6" stroke-width="6" stroke-linecap="round"/>
      <circle cx="132" cy="42" r="5" fill="#e11d48"/>
      <!-- Curl arc -->
      <path d="M174 82 A38 38 0 0 0 142 40" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="138,38 147,39 143,46" fill="#e11d48"/>
      <text x="184" y="46" fill="#f4f4f6" font-size="10" font-weight="700">TEK BACAK LEG CURL</text>
      <text x="184" y="63" fill="#fb7185" font-size="9" font-weight="600">Sağ Bacak Kapasitesi Referans</text>
      <text x="184" y="80" fill="#a1a1aa" font-size="9">2 sn Çekiş · 3 sn Eksantrik İniş</text>
    </svg>`,
  },
  ecc_step_down: {
    turkishTitle: "Basamaktan Eksantrik İniş (Eccentric Step-Down)",
    equipment: "15–20 cm Step Tahtası · Sağ Ayak Üstte Sabit",
    cues: ["Sağ ayak basamakta, sol topuk yere hafif değer", "3 saniyede yavaşça alçal (Frenleme)", "Diz içe çökmeden dikey hat korunur"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="20" y1="122" x2="300" y2="122" stroke="#3f3f46" stroke-width="2"/>
      <!-- Step platform -->
      <rect x="55" y="96" width="60" height="26" rx="3" fill="#1f1f26" stroke="#71717a" stroke-width="2"/>
      <!-- Athlete standing on box lowering left heel to floor -->
      <circle cx="95" cy="24" r="8" fill="#e4e4e7"/>
      <line x1="95" y1="34" x2="90" y2="66" stroke="#a1a1aa" stroke-width="7" stroke-linecap="round"/>
      <!-- Right stance leg on box (eccentric quad control) -->
      <path d="M90 66 L102 78 L88 96" fill="none" stroke="#e11d48" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Left leg reaching forward/down for heel tap -->
      <line x1="90" y1="66" x2="136" y2="120" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <circle cx="136" cy="120" r="4" fill="#fb7185"/>
      <!-- 3s Down arrow -->
      <line x1="148" y1="54" x2="148" y2="108" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="148,114 143,105 153,105" fill="#e11d48"/>
      <text x="172" y="46" fill="#f4f4f6" font-size="10" font-weight="700">EKSANTRİK STEP-DOWN</text>
      <text x="172" y="63" fill="#fb7185" font-size="9" font-weight="600">3 sn Frenleme İnişi ↓ (Sağ Bacak)</text>
      <text x="172" y="80" fill="#a1a1aa" font-size="9">Sol topuk yere hafifçe dokunup kalkar</text>
    </svg>`,
  },
  single_calf_raise: {
    turkishTitle: "Destekli Tek Ayak Kalf Yükselmesi (Single-Leg Calf Raise)",
    equipment: "Basamak Kenarı veya Duvar/Makine Desteği",
    cues: ["Tek ayak parmak ucunda tam yüksel", "Tepe ve dipte 1 sn bekleme", "Koşuya dönüş kriteri: 20 nizami tekrar"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <rect x="55" y="104" width="65" height="18" rx="3" fill="#27272a" stroke="#71717a" stroke-width="2"/>
      <!-- Lower leg & glowing calf muscle -->
      <line x1="92" y1="22" x2="92" y2="88" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="85" cy="54" rx="7" ry="18" fill="#e11d48"/>
      <!-- Foot on ball of foot, heel elevated -->
      <path d="M92 88 L82 94 L106 104" fill="none" stroke="#f4f4f6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Upward arrow at heel -->
      <line x1="68" y1="100" x2="68" y2="66" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="68,60 63,69 73,69" fill="#e11d48"/>
      <text x="156" y="46" fill="#f4f4f6" font-size="10" font-weight="700">SINGLE-LEG CALF RAISE</text>
      <text x="156" y="63" fill="#fb7185" font-size="9" font-weight="600">Baldır & Aşil Tendonu · 4 × 15-20</text>
      <text x="156" y="80" fill="#a1a1aa" font-size="9">Tepe ve dipte 1 sn tam kontrol</text>
    </svg>`,
  },
  wide_lat_pulldown: {
    turkishTitle: "Geniş Tutuş Göğse Çekiş (Wide-Grip Lat Pulldown)",
    equipment: "Lat Pulldown Makinesi · Geniş Bar",
    cues: ["Barı üst göğse doğru çek (enseye değil)", "2 sn kontrollü salış, 1 sn çekiş", "Diz pedleri sağ bacağı sıkmamalı"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Cable & Wide Bar -->
      <line x1="95" y1="8" x2="95" y2="30" stroke="#a1a1aa" stroke-width="2"/>
      <path d="M45 36 L60 30 L130 30 L145 36" fill="none" stroke="#f4f4f6" stroke-width="4" stroke-linecap="round"/>
      <!-- Back view of athlete with glowing V-taper Lats -->
      <circle cx="95" cy="50" r="8" fill="#e4e4e7"/>
      <polygon points="72,62 118,62 106,106 84,106" fill="#27272a"/>
      <polygon points="70,64 84,64 86,98 76,88" fill="#e11d48"/>
      <polygon points="120,64 106,64 104,98 114,88" fill="#e11d48"/>
      <!-- Arms pulling down -->
      <path d="M72 64 L52 54 L52 34" fill="none" stroke="#f4f4f6" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M118 64 L138 54 L138 34" fill="none" stroke="#f4f4f6" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Pull arrows -->
      <line x1="40" y1="42" x2="40" y2="70" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="40,75 35,67 45,67" fill="#e11d48"/>
      <text x="168" y="46" fill="#f4f4f6" font-size="10" font-weight="700">WIDE-GRIP LAT PULLDOWN</text>
      <text x="168" y="63" fill="#fb7185" font-size="9" font-weight="600">Sırt Genişliği (Kanat / V-Taper)</text>
      <text x="168" y="80" fill="#a1a1aa" font-size="9">Üst göğse çekiş · Son set Failure</text>
    </svg>`,
  },
  supported_row: {
    turkishTitle: "Göğüs Destekli Makine Çekiş / Oturarak Kürek (Chest-Supported Row)",
    equipment: "Chest-Supported Row Makinesi veya Seated Cable Row",
    cues: ["Göğüs pede dayalı (Bel/diz yükü sıfır)", "Kürek kemiklerini geride birbirine sıkıştır", "4 × 10-12 tam tükeniş (Failure)"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Chest pad & seat -->
      <line x1="108" y1="42" x2="96" y2="92" stroke="#e11d48" stroke-width="6" stroke-linecap="round"/>
      <line x1="65" y1="98" x2="100" y2="98" stroke="#71717a" stroke-width="4"/>
      <!-- Athlete leaning against chest pad -->
      <circle cx="96" cy="30" r="8" fill="#e4e4e7"/>
      <line x1="94" y1="42" x2="82" y2="92" stroke="#e11d48" stroke-width="9" stroke-linecap="round"/>
      <!-- Arm pulling handle back -->
      <line x1="145" y1="58" x2="92" y2="58" stroke="#a1a1aa" stroke-width="2" stroke-dasharray="3 2"/>
      <path d="M92 52 L64 62 L98 62" fill="none" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Backward pull arrow -->
      <line x1="142" y1="74" x2="96" y2="74" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="90,74 99,69 99,79" fill="#e11d48"/>
      <text x="166" y="46" fill="#f4f4f6" font-size="10" font-weight="700">CHEST-SUPPORTED ROW</text>
      <text x="166" y="63" fill="#fb7185" font-size="9" font-weight="600">Orta Sırt Kalınlığı · Göğüs Destekli</text>
      <text x="166" y="80" fill="#a1a1aa" font-size="9">Kürek kemiklerini geride kilitle</text>
    </svg>`,
  },
  rope_pullover: {
    turkishTitle: "Düz Kol Kablo Kanat İndirme (Seated Rope Pullover / Straight-Arm Pulldown)",
    equipment: "Üst Makara Halat + Oturarak / Diz Üstü Pozisyon",
    cues: ["Dirsekler sabit, biceps devre dışı", "Halatı yay çizerek kalçaya doğru indir", "Kanat (Lat) kaslarında tam esneme ve sıkışma"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="148" y1="12" x2="148" y2="124" stroke="#52525b" stroke-width="4"/>
      <circle cx="148" cy="18" r="5" fill="#71717a"/>
      <!-- Athlete seated/kneeling -->
      <circle cx="72" cy="36" r="8" fill="#e4e4e7"/>
      <line x1="70" y1="46" x2="62" y2="94" stroke="#e11d48" stroke-width="9" stroke-linecap="round"/>
      <!-- Top arm position (dashed) -->
      <line x1="70" y1="50" x2="118" y2="34" stroke="#71717a" stroke-width="4" stroke-dasharray="3 3" stroke-linecap="round"/>
      <!-- Bottom swept arm position -->
      <line x1="70" y1="50" x2="82" y2="94" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <!-- Sweep arc -->
      <path d="M122 40 A52 52 0 0 1 92 94" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="88,97 97,94 92,87" fill="#e11d48"/>
      <text x="168" y="46" fill="#f4f4f6" font-size="10" font-weight="700">ROPE PULLOVER / PULLDOWN</text>
      <text x="168" y="63" fill="#fb7185" font-size="9" font-weight="600">Düz Kol Kanat (Lat) İzolasyonu</text>
      <text x="168" y="80" fill="#a1a1aa" font-size="9">Biceps bükmeden yay çizerek indir</text>
    </svg>`,
  },
  reverse_pec_deck: {
    turkishTitle: "Ters Kelebek / Oturarak Yüze Çekiş (Reverse Pec Deck / Face Pull)",
    equipment: "Reverse Pec Deck Makinesi veya Halatla Face Pull",
    cues: ["Göğüs pede dayalı, kollar geriye açılır", "Arka omuz ve üst sırt postür zırhı", "Son sette Beyond Failure (kısmi tekrar)"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <circle cx="95" cy="36" r="8" fill="#e4e4e7"/>
      <rect x="75" y="48" width="40" height="50" rx="6" fill="#27272a"/>
      <!-- Glowing Rear Delts & Upper Back -->
      <circle cx="75" cy="56" r="7" fill="#e11d48"/>
      <circle cx="115" cy="56" r="7" fill="#e11d48"/>
      <rect x="85" y="52" width="20" height="14" rx="3" fill="#e11d48"/>
      <!-- Arms sweeping wide/back -->
      <line x1="75" y1="56" x2="28" y2="56" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <line x1="115" y1="56" x2="162" y2="56" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <!-- Outward sweep arrows -->
      <path d="M68 28 Q45 30 30 46" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="27,50 36,46 29,40" fill="#e11d48"/>
      <path d="M122 28 Q145 30 160 46" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="163,50 154,46 161,40" fill="#e11d48"/>
      <text x="178" y="46" fill="#f4f4f6" font-size="10" font-weight="700">REVERSE PEC DECK / FACE PULL</text>
      <text x="178" y="63" fill="#fb7185" font-size="9" font-weight="600">Arka Omuz & Postür · Beyond Failure</text>
      <text x="178" y="80" fill="#a1a1aa" font-size="9">Dirsekleri omuz hizasında geriye aç</text>
    </svg>`,
  },
  preacher_curl: {
    turkishTitle: "Scott Sehpasında Makine Ön Kol Bükme (Machine Preacher Curl)",
    equipment: "Preacher Curl (Masada Biceps) Makinesi",
    cues: ["Üst kollar eğimli mindere tam yapışık", "2 saniyede kontrollü negatif (iniş)", "Dize ve bele sıfır yük · RIR 1 / Failure"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Preacher pad -->
      <polygon points="82,58 112,86 98,98 72,70" fill="#27272a" stroke="#71717a" stroke-width="2"/>
      <line x1="88" y1="88" x2="88" y2="124" stroke="#52525b" stroke-width="4"/>
      <!-- Athlete & glowing Biceps -->
      <circle cx="58" cy="34" r="8" fill="#e4e4e7"/>
      <line x1="58" y1="44" x2="58" y2="96" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round"/>
      <line x1="62" y1="50" x2="98" y2="76" stroke="#e11d48" stroke-width="8" stroke-linecap="round"/>
      <!-- Forearm curling up -->
      <line x1="98" y1="76" x2="142" y2="82" stroke="#52525b" stroke-width="4" stroke-dasharray="3 3" stroke-linecap="round"/>
      <line x1="98" y1="76" x2="112" y2="38" stroke="#f4f4f6" stroke-width="6" stroke-linecap="round"/>
      <circle cx="112" cy="38" r="5" fill="#e11d48"/>
      <!-- Curl arrow -->
      <path d="M138 74 A36 36 0 0 0 120 40" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="116,36 125,38 120,45" fill="#e11d48"/>
      <text x="168" y="46" fill="#f4f4f6" font-size="10" font-weight="700">MACHINE PREACHER CURL</text>
      <text x="168" y="63" fill="#fb7185" font-size="9" font-weight="600">Masada Biceps İzolasyonu</text>
      <text x="168" y="80" fill="#a1a1aa" font-size="9">Dirsekler pede kilitli · 2 sn İniş</text>
    </svg>`,
  },

  // DAY C (CUMARTESİ)
  goblet_box_squat: {
    turkishTitle: "Göğüste Dambılla Kutuya Çömelme (Goblet Box Squat 0°–90°)",
    equipment: "Göğüste Tek Dambıl + 90° Diz Açısı Yüksekliğinde Sehpa/Kutu",
    cues: ["Arkada 90° derinlik sınırını belirleyen kutu", "3 sn'de inip kutuya hafifçe dokun ve kalk", "Yükü sağ ve sol bacağa eşit dağıt"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="20" y1="122" x2="300" y2="122" stroke="#3f3f46" stroke-width="2"/>
      <!-- 90 deg target box behind athlete -->
      <rect x="46" y="84" width="36" height="38" rx="3" fill="#1f1f26" stroke="#e11d48" stroke-width="2" stroke-dasharray="4 2"/>
      <!-- Athlete in 90-deg Goblet Squat -->
      <circle cx="104" cy="28" r="8" fill="#e4e4e7"/>
      <line x1="100" y1="38" x2="78" y2="82" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round"/>
      <!-- Goblet dumbbell held at chest -->
      <rect x="110" y="42" width="12" height="18" rx="2" fill="#e11d48"/>
      <!-- 90-degree thigh & shin -->
      <path d="M78 82 L122 82 L122 120" fill="none" stroke="#e11d48" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="84" y="76" fill="#fb7185" font-size="9" font-weight="700">90°</text>
      <text x="164" y="46" fill="#f4f4f6" font-size="10" font-weight="700">GOBLET BOX SQUAT (0°-90°)</text>
      <text x="164" y="63" fill="#fb7185" font-size="9" font-weight="600">Kutuya Dokun & Kalk · Simetrik Yük</text>
      <text x="164" y="80" fill="#a1a1aa" font-size="9">3 sn İniş · Sağ ayak itişine odaklan</text>
    </svg>`,
  },
  chair_bridge: {
    turkishTitle: "Topuk Sehpada Tek Bacak Arka Bacak Köprüsü (Single-Leg Chair Bridge)",
    equipment: "Minder + Yüksekliği Sabit Sehpa / Sandalye",
    cues: ["Sağ topuk sehpa üzerinde, diz hafif bükülü", "Kalçayı kaldırıp tepede 2 sn sıkıştır", "Koşuya dönüş kriteri: 20 kesintisiz tekrar"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="20" y1="118" x2="300" y2="118" stroke="#3f3f46" stroke-width="2"/>
      <!-- Bench/Chair -->
      <rect x="188" y="68" width="44" height="50" rx="3" fill="#1f1f26" stroke="#71717a" stroke-width="2"/>
      <!-- Supine athlete bridging with heel on bench -->
      <circle cx="42" cy="104" r="8" fill="#e4e4e7"/>
      <line x1="52" y1="108" x2="122" y2="82" stroke="#e11d48" stroke-width="8" stroke-linecap="round"/>
      <!-- Working leg heel on bench -->
      <path d="M122 82 L158 62 L195 68" fill="none" stroke="#e11d48" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Free leg raised in air -->
      <line x1="122" y1="82" x2="142" y2="38" stroke="#52525b" stroke-width="5" stroke-linecap="round"/>
      <!-- Up arrow -->
      <line x1="122" y1="112" x2="122" y2="90" stroke="#fb7185" stroke-width="2.5"/>
      <polygon points="122,85 117,93 127,93" fill="#fb7185"/>
      <text x="25" y="34" fill="#f4f4f6" font-size="10" font-weight="700">SINGLE-LEG CHAIR BRIDGE</text>
      <text x="25" y="50" fill="#fb7185" font-size="9" font-weight="600">Topuk Sehpada · 2 sn Tutuşlu Hamstring</text>
    </svg>`,
  },
  iso_leg_press: {
    turkishTitle: "Yalnızca Sağ Bacak İzole Leg Press (Piston Kontrolü)",
    equipment: "Leg Press Makinesi · Sadece Sağ Ayak Plakada (15–20 kg)",
    cues: ["Sol bacak tamamen devre dışı", "Titreme olmadan akıcı piston gibi itiş", "3 × 12-15 tekrar (RIR 2)"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="40" y1="118" x2="120" y2="118" stroke="#52525b" stroke-width="4"/>
      <line x1="45" y1="118" x2="25" y2="68" stroke="#71717a" stroke-width="5" stroke-linecap="round"/>
      <line x1="162" y1="45" x2="195" y2="92" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <circle cx="38" cy="58" r="8" fill="#e4e4e7"/>
      <line x1="42" y1="68" x2="72" y2="110" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round"/>
      <!-- Isolated Right Leg pushing smoothly -->
      <path d="M72 110 L122 72 L172 72" fill="none" stroke="#e11d48" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="172" cy="72" r="6" fill="#fb7185"/>
      <text x="188" y="46" fill="#f4f4f6" font-size="10" font-weight="700">SAĞ BACAK İZOLE LEG PRESS</text>
      <text x="188" y="63" fill="#fb7185" font-size="9" font-weight="600">Tek Bacak Simetri Kapatma</text>
      <text x="188" y="80" fill="#a1a1aa" font-size="9">15-20 kg · Kesintisiz & Titremesiz</text>
    </svg>`,
  },
  balance_side_plank: {
    turkishTitle: "Sağ Ayak Tek Bacak Denge (30 sn) + Yan Plank (30 sn)",
    equipment: "Minder · Gözler Açık Denge + İzometrik Gövde",
    cues: ["1) Sağ ayak üzerinde 30 sn sarsıntısız denge", "2) Sağ ve sol taraf 30'ar sn Side Plank", "Toplam 3 tur · Dinlenme 45 sn"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="145" y1="15" x2="145" y2="125" stroke="#27272a" stroke-width="2" stroke-dasharray="4 4"/>
      <!-- Left panel: Single-leg balance -->
      <circle cx="70" cy="26" r="7" fill="#e4e4e7"/>
      <line x1="70" y1="36" x2="70" y2="76" stroke="#a1a1aa" stroke-width="7" stroke-linecap="round"/>
      <line x1="70" y1="76" x2="70" y2="120" stroke="#e11d48" stroke-width="6" stroke-linecap="round"/>
      <path d="M70 76 L94 78 L94 98" fill="none" stroke="#52525b" stroke-width="4" stroke-linecap="round"/>
      <text x="24" y="132" fill="#fb7185" font-size="9" font-weight="700">1) 30 sn Tek Ayak Denge</text>
      <!-- Right panel: Side Plank -->
      <circle cx="178" cy="58" r="7" fill="#e4e4e7"/>
      <line x1="186" y1="64" x2="288" y2="108" stroke="#e11d48" stroke-width="8" stroke-linecap="round"/>
      <line x1="186" y1="64" x2="186" y2="108" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <text x="168" y="34" fill="#f4f4f6" font-size="10" font-weight="700">DENGE + SIDE PLANK</text>
      <text x="168" y="132" fill="#fb7185" font-size="9" font-weight="700">2) 30 sn Sağ/Sol Yan Plank</text>
    </svg>`,
  },
  flat_chest_press: {
    turkishTitle: "Düz Makine Göğüs İtiş / Düz Sehpa Dambıl Pres (Flat Chest Press)",
    equipment: "Plate-Loaded Chest Press Makinesi veya Düz Sehpada Dambıl",
    cues: ["Oturarak veya düz sehpada (Ayaklar pasif)", "Göğüs orta ve alt liflerinde tam kasılma", "3 × 8-10 tekrar (RIR 1-2)"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Seated Chest Press Machine -->
      <path d="M52 30 L52 96 L88 96" fill="none" stroke="#71717a" stroke-width="5" stroke-linecap="round"/>
      <circle cx="66" cy="34" r="8" fill="#e4e4e7"/>
      <line x1="64" y1="44" x2="64" y2="92" stroke="#e11d48" stroke-width="9" stroke-linecap="round"/>
      <!-- Horizontal push arms -->
      <line x1="66" y1="56" x2="138" y2="56" stroke="#f4f4f6" stroke-width="6" stroke-linecap="round"/>
      <circle cx="138" cy="56" r="5" fill="#e11d48"/>
      <!-- Push arrow -->
      <line x1="102" y1="40" x2="148" y2="40" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="154,40 145,35 145,45" fill="#e11d48"/>
      <text x="172" y="46" fill="#f4f4f6" font-size="10" font-weight="700">FLAT CHEST PRESS</text>
      <text x="172" y="63" fill="#fb7185" font-size="9" font-weight="600">Göğüs Genel Kütle · 3 × 8-10</text>
      <text x="172" y="80" fill="#a1a1aa" font-size="9">Makine veya Düz Dambıl (RIR 1-2)</text>
    </svg>`,
  },
  close_pulldown: {
    turkishTitle: "Dar / Nötr Tutuş Göğse Çekiş (Close-Grip / V-Bar Pulldown)",
    equipment: "Lat Pulldown İstasyonu + V-Bar / Nötr Tutuş Aparatı",
    cues: ["Avuç içleri birbirine bakar (Nötr tutuş)", "Dirsekleri vücuda yakın aşağı-geriye çek", "Alt kanat (Lat) kalınlığı · Failure"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="95" y1="8" x2="95" y2="28" stroke="#a1a1aa" stroke-width="2"/>
      <!-- V-Grip handle -->
      <path d="M80 38 L95 26 L110 38" fill="none" stroke="#e11d48" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="82" cy="48" r="8" fill="#e4e4e7"/>
      <line x1="78" y1="58" x2="72" y2="104" stroke="#e11d48" stroke-width="9" stroke-linecap="round"/>
      <!-- Arms pulling V-grip to upper chest -->
      <path d="M78 62 L92 56 L92 38" fill="none" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="118" y1="34" x2="118" y2="68" stroke="#e11d48" stroke-width="2.5"/>
      <polygon points="118,74 113,65 123,65" fill="#e11d48"/>
      <text x="160" y="46" fill="#f4f4f6" font-size="10" font-weight="700">CLOSE / V-GRIP PULLDOWN</text>
      <text x="160" y="63" fill="#fb7185" font-size="9" font-weight="600">Alt Lat & Sırt Kalınlığı · 3 × 8-10</text>
      <text x="160" y="80" fill="#a1a1aa" font-size="9">Göğsün altına doğru dikey çekiş</text>
    </svg>`,
  },
  cable_lat_raise: {
    turkishTitle: "Kablo İstasyonunda Tek Kol Yana Açış (Cable Lateral Raise)",
    equipment: "Alt Makara Tekli Elcik · Kesintisiz Yan Omuz Gerilimi",
    cues: ["Boştaki elle istasyondan destek al", "Kabloyu omuz hizasına kadar akıcı kaldır", "Sabit gerilimle Beyond Failure"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <!-- Low pulley & cable crossing to lateral arm -->
      <line x1="42" y1="15" x2="42" y2="122" stroke="#52525b" stroke-width="4"/>
      <circle cx="42" cy="112" r="5" fill="#71717a"/>
      <line x1="42" y1="112" x2="148" y2="54" stroke="#e11d48" stroke-width="2" stroke-dasharray="4 2"/>
      <!-- Athlete holding tower -->
      <circle cx="96" cy="32" r="8" fill="#e4e4e7"/>
      <rect x="82" y="44" width="28" height="46" rx="5" fill="#27272a"/>
      <line x1="82" y1="50" x2="42" y2="58" stroke="#71717a" stroke-width="4" stroke-linecap="round"/>
      <!-- Active outer shoulder + arm -->
      <circle cx="112" cy="50" r="7.5" fill="#e11d48"/>
      <line x1="112" y1="50" x2="152" y2="52" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <path d="M126 94 A38 38 0 0 0 152 60" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <text x="172" y="46" fill="#f4f4f6" font-size="10" font-weight="700">CABLE LATERAL RAISE</text>
      <text x="172" y="63" fill="#fb7185" font-size="9" font-weight="600">Sabit Gerilim Yan Omuz · 3 × 12-15</text>
      <text x="172" y="80" fill="#a1a1aa" font-size="9">İstasyona tutunarak dize yük bindirme</text>
    </svg>`,
  },
  arm_superset: {
    turkishTitle: "Kol Süperseti: Incline Dumbbell Curl + Overhead Triceps Ext.",
    equipment: "Eğimli Sehpa + Dambıl / Kablo (Dinlenmeden Arka Arkaya)",
    cues: ["1) Eğimli sehpada geriye yaslanıp Biceps Curl", "2) Ara vermeden baş üstü Triceps Extension", "3 × 10-12 Süperset · Tam tükeniş (Failure)"],
    svg: `<svg viewBox="0 0 320 140" class="ex-svg" aria-hidden="true">
      <rect width="320" height="140" rx="10" fill="var(--vis-bg, #0d0d12)"/>
      <line x1="155" y1="15" x2="155" y2="125" stroke="#27272a" stroke-width="2" stroke-dasharray="4 4"/>
      <!-- Left: Incline DB Curl -->
      <line x1="35" y1="52" x2="82" y2="108" stroke="#52525b" stroke-width="4"/>
      <circle cx="48" cy="40" r="7" fill="#e4e4e7"/>
      <line x1="54" y1="52" x2="54" y2="84" stroke="#e11d48" stroke-width="7" stroke-linecap="round"/>
      <line x1="54" y1="84" x2="82" y2="62" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <circle cx="82" cy="62" r="5" fill="#e11d48"/>
      <text x="20" y="130" fill="#fb7185" font-size="9" font-weight="700">A1) Incline Biceps Curl</text>
      <!-- Right: Overhead Triceps Extension -->
      <circle cx="212" cy="54" r="7" fill="#e4e4e7"/>
      <line x1="212" y1="64" x2="212" y2="108" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round"/>
      <line x1="212" y1="62" x2="206" y2="26" stroke="#e11d48" stroke-width="7" stroke-linecap="round"/>
      <line x1="206" y1="26" x2="232" y2="18" stroke="#f4f4f6" stroke-width="5" stroke-linecap="round"/>
      <rect x="228" y="12" width="12" height="8" rx="2" fill="#e11d48"/>
      <text x="172" y="130" fill="#fb7185" font-size="9" font-weight="700">A2) Overhead Triceps Ext.</text>
    </svg>`,
  },
};

// Map legacy exercise IDs from previous block to visual keys
EXERCISE_VISUALS.chest = EXERCISE_VISUALS.flat_chest_press;
EXERCISE_VISUALS.row = EXERCISE_VISUALS.supported_row;
EXERCISE_VISUALS.lat = EXERCISE_VISUALS.wide_lat_pulldown;
EXERCISE_VISUALS.lateral = EXERCISE_VISUALS.seated_lat_raise;
EXERCISE_VISUALS.preacher = EXERCISE_VISUALS.preacher_curl;
EXERCISE_VISUALS.triceps = EXERCISE_VISUALS.rope_pushdown;
EXERCISE_VISUALS.shoulder = EXERCISE_VISUALS.seated_ohp;
EXERCISE_VISUALS.fly = EXERCISE_VISUALS.cable_cross_fly;
EXERCISE_VISUALS.reverse = EXERCISE_VISUALS.reverse_pec_deck;
EXERCISE_VISUALS.hammer = EXERCISE_VISUALS.arm_superset;

export function getExerciseVisual(id) {
  return EXERCISE_VISUALS[id] || EXERCISE_VISUALS.flat_chest_press;
}
