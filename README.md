<div align="center">

# 🪨 STONE AGE ODYSSEY : 고인돌 (Prehistorik 16-Bit Web Arcade)

**추억의 1991/1993년 DOS 명작 원시인 액션 플랫포머 《고인돌 (Prehistorik)》 웹 아케이드 8대 스테이지 & 4인 영웅 확장판**  
외부 라이브러리 없이 **HTML5 Canvas 16비트 픽셀 아트, 4명의 플레이어블 캐릭터, 8종 테마 배경과 Web Audio API 칩튠 신디사이저**로 구현한 브라우저 즉시 실행 게임 & 랜딩 페이지입니다.

[![Live Demo](https://img.shields.io/badge/🕹️_LIVE_DEMO-Play_in_Browser-ffae00?style=for-the-badge&logo=googlechrome&logoColor=black)](https://jeiel85.github.io/stone-age-odyssey/)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas_2D-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_Chiptune-4cd964?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Stages](https://img.shields.io/badge/Campaign-8_Stages_%2B_4_Heroes-ff5e1a?style=for-the-badge)]()

<br />

<img src="./assets/hero_banner.png" alt="Stone Age Odyssey (고인돌) 16-Bit 아케이드 키 아트" width="860" />

<br />

<img src="./assets/gameplay_preview.png" alt="Stone Age Odyssey (고인돌) 인게임 플레이 화면" width="860" />

<br />

👉 **[라이브 데모 바로 플레이하기 (https://jeiel85.github.io/stone-age-odyssey/)](https://jeiel85.github.io/stone-age-odyssey/)** 👈

</div>

---

## ✨ 주요 특징 (Key Features)

- **🦸‍♂️ 4인의 개성 넘치는 플레이어블 원시 영웅 (4 Playable Heroes)**
  - **원시인 샘 (`Sam`, 숫자키 `1`)**: 균형 잡힌 능력치(HP 5)와 철침 참나무 몽둥이·돌도끼를 사용하는 올라운더 전사.
  - **사냥꾼 우가 (`Uga`, 숫자키 `2`)**: 공중에서 한 번 더 도약하는 **2단 점프(Double Jump)**와 긴 사거리의 부싯돌 창·고속 투창을 구사하는 기동형 헌터.
  - **괴력의 브록 (`Brok`, 숫자키 `3`)**: **최대 체력 7 HP**와 2배의 근접 공격력, 주변 적을 기절시키는 지면 충격파, 그리고 **보물상자 1타 즉시 파괴** 능력을 지닌 중장갑 전사.
  - **주술사 타라 (`Tara`, 숫자키 `4`)**: 점프 키 홀드 시 천천히 하강하는 **공중 활공(Glide)**, 직선으로 날아가는 화염구 자동 충전, 식량 회복량 +25% 보너스를 지닌 부족 주술사.
- **🗺️ 대폭 확장된 8대 원시 월드 캠페인 (8 Full Prehistoric Worlds)**
  - 원시림·거대 늪지대·화산 동굴·빙하기 설원·**메마른 공룡 사막**·용암 화구 성채·**천공의 부유 거석 유적**·대고인돌 제단까지 총 **8개의 개성 넘치는 바이옴과 전용 16비트 픽셀아트 배경/타일셋**을 수록했습니다.
- **🌶️ 6종 신규 파워업 유물 & 액션 시스템 (Power-Up Relics, Dash & Combo)**
  - **화염 고추(`🌶️`)**: 8초간 불꽃 광폭화 버프 (공격력 2배 + 이동속도 상승).
  - **거북 등껍질 방패(`🛡️`)**: 적이나 보스의 공격을 1회 완전 방어하는 보호막 생성.
  - **자석 토템(`🧲`)**: 10초간 주변의 모든 식량과 보석을 캐릭터에게 자동 흡입.
  - **번개 깃털(`⚡`)**: 10초간 초고속 질주 및 점프력 강화 버프.
  - **원시 화산 폭탄(`💣`)**: 습득 즉시 화면 내 적들과 보스에게 강력한 광역 폭발 데미지!
  - **황금 공룡 알(`👑`)**: +1,500점 & 식량 대폭 충전 + 원거리 탄약 보너스.
  - **전방 회피 대시(`V` / `Shift`)**, **연속 처치·수집 콤보 배율(`COMBO x3.0`)**, 밟으면 흔들리다 무너지는 **고대 균열 석판(`crumble` 발판)** 기믹이 추가되었습니다.
- **🎵 무에셋 Web Audio API 8종 테마 사운드트랙**
  - 외부 MP3/WAV 파일 없이 `AudioContext` 오실레이터와 노이즈 필터만으로 **8개 스테이지 전용 배경음악(BGM)**과 15종의 레트로 효과음을 실시간 합성합니다.

---

## 🎮 조작법 (Controls)

| 동작 | 키보드 (주 키) | 키보드 (보조 키) | 모바일 / 태블릿 |
| :--- | :---: | :---: | :---: |
| **좌우 이동** | `←` / `→` 방향키 | `A` / `D` | 좌측 `◀` `▶` 터치 버튼 |
| **점프 / 2단점프 / 활공** | `Space` | `Z` / `↑` / `W` | 우측 `JUMP` 버튼 |
| **근접 무기 타격** | `X` | `J` / `Enter` | 우측 `타격` 버튼 |
| **원거리 무기 발사** | `C` | `K` | 우측 `SHOT` 버튼 |
| **전방 회피 대시** | `V` | `Shift` | 우측 `DASH` 버튼 |
| **플레이어블 영웅 교체** | `1` / `2` / `3` / `4` | 상단 영웅 카드 클릭 | 상단 영웅 카드 터치 |
| **일시정지** | `P` | `Esc` | 상단 컨트롤 바 |

---

## 🗺️ 8대 스테이지 구성 (8-Stage Campaign & Bosses)

<div align="center">
  <img src="./assets/world_map.png" alt="고인돌 원시 대륙 월드맵" width="860" />
</div>

<br />

1. **🌲 STAGE 1: 신석기 원시림 (Prehistoric Jungle)**
   - 거대 고사리 나무와 고인돌 유적이 펼쳐진 입문 스테이지. 통통 버섯과 통나무 뗏목 다리를 건너며 숨겨진 보물상자를 찾아내세요.
2. **🍄 STAGE 2: 거대 고목 늪지대 (Ancient Swamp & Marsh)**
   - 발광 버섯과 수몰된 고인돌이 빛나는 신비로운 늪지대. **늪지 악어(Swamp Gator)**와 보라 익룡 편대를 돌파하고 **등껍질 방패·자석 토템**을 획득하세요.
3. **🌋 STAGE 3: 화산 동굴과 공룡 협곡 (Volcanic Cave & Bone Canyon)**
   - 지하 종유석과 용암 균열이 흐르는 동굴 지형. 밟으면 무너지는 **고대 균열 석판**과 수직 흑요석 승강기 발판을 타고 상층부 보물상자를 공략하세요.
4. **❄️ STAGE 4: 빙하기 설원 협곡 (Ice Age Glacial Gorge - 중간 보스전)**
   - 오로라가 빛나는 설원 협곡! **빙하 검치호(Sabertooth)**를 돌파하면 중간 보스 **빙하 설원 수호자(Frost Mammoth, HP 14)**가 얼음 바위 충격파로 관문을 지킵니다.
5. **🏜️ STAGE 5: 메마른 공룡 사막 (Bone Desert Ruins - 신규)**
   - 거대한 공룡 화석 갈비뼈와 피라미드가 솟아오른 열사의 사막! 무너지는 사암 다리와 모래 협곡을 대시와 이동 발판으로 돌파하고 **황금 공룡 알**을 손에 넣으세요.
6. **🔥 STAGE 6: 용암 화구 성채 (Magma Caldera Fortress)**
   - 끓어오르는 화산 칼데라 성채! 용암 강 위의 마그마 부유석과 체력이 강화된 **용암 갑옷 공룡(Magma Rex, HP 3)**들을 뚫고 정상으로 진격하세요.
7. **☁️ STAGE 7: 천공의 부유 거석 유적 (Sky Megalith Ruins - 신규)**
   - 황금빛 구름 바다 위에 떠 있는 고대 천공 유적! 부유 제단 사이를 오가는 승강기와 균열 석판을 건너며 익룡 군단을 격추하세요.
8. **🦣 STAGE 8: 대고인돌 제단 - 거대 맘모스 대왕 최종 결전 (Final Boss Arena)**
   - 붉은 블러드문 아래 펼쳐지는 최종 결전! 상공의 이동 발판과 버섯 점프대를 활용해 **거대 맘모스 대왕(HP 24)**의 대지 충격파와 분노 모드를 물리치고 황금 고기를 쟁취하세요!

---

## 🏗️ 프로젝트 구조 (Project Structure)

```text
stone-age-odyssey/
├── index.html             # 아케이드 캐비닛 라이브 데모 & 6대 월드맵/도감 랜딩 페이지
├── css/
│   └── style.css          # 레트로 아케이드 테마, 6종 스테이지 카드, CRT 필터, 반응형 터치 UI
├── js/
│   ├── audio.js           # Web Audio API 기반 6종 스테이지 전용 BGM 시퀀서 & 효과음 합성기
│   ├── pixel_assets.js    # 16비트 픽셀 스프라이트·아이콘·6종 바이옴 타일 생성 및 배경 로딩
│   ├── sprites.js         # 패럴랙스 배경과 픽셀 스프라이트 Canvas 렌더러
│   ├── levels.js          # 스테이지 1~6 지형, 이동 발판, 체크포인트, 비밀 토템, 보스 데이터
│   └── game.js            # 60FPS 물리 엔진, 이동 발판 동기화, 체크포인트 부활, 보스 AI, HUD
└── assets/
    ├── bg_jungle.png      # 스테이지 1 신석기 원시림 배경
    ├── bg_swamp.png       # 스테이지 2 거대 고목 늪지대 배경
    ├── bg_cave.png        # 스테이지 3 화산 동굴 협곡 배경
    ├── bg_ice.png         # 스테이지 4 빙하기 설원 협곡 배경
    ├── bg_desert.png      # 스테이지 5 메마른 공룡 사막 배경
    ├── bg_volcano.png     # 스테이지 6 용암 화구 성채 배경
    ├── bg_sky.png         # 스테이지 7 천공의 부유 거석 유적 배경
    ├── bg_boss.png        # 스테이지 8 대고인돌 제단 보스 아레나 배경
    ├── sam_idle_run.png   # 주인공 원시인 샘(Sam) 대기/질주/점프 16비트 스프라이트 시트
    ├── sam_attack.png     # 주인공 원시인 샘(Sam) 몽둥이 차징/강타 16비트 스프라이트 시트
    ├── heroes_sheet.png   # 신규 플레이어블 영웅 3인(우가/브록/타라) 16비트 스프라이트 시트
    ├── monsters_sheet.png # 6종 원시 몬스터(랩터/멧돼지/익룡/악어/검치호/용암렉스) 16비트 시트
    ├── bosses_sheet.png   # 2종 거대 보스(빙하 설원 수호자 / 거대 맘모스 대왕) 16비트 시트
    ├── items_sheet.png    # 11종 식량·보물·돌도끼·생명 하트 16비트 아이콘 시트
    ├── powerups_sheet.png # 6종 특수 파워업 유물(고추/방패/자석/깃털/폭탄/황금알) 16비트 시트
    ├── dolmens_sheet.png  # 4종 고인돌 관문(시작문/체크포인트 성소/닫힌 출구/열린 차원문) 16비트 시트
    ├── props_sheet.png    # 점프 버섯 & 3단계 타격 원시 보물상자 16비트 오브젝트 시트
    ├── world_map.png      # 6대 스테이지 선사시대 대륙 파노라마 월드맵
    ├── hero_banner.png    # 타이틀 & 랜딩 페이지 아케이드 키 아트
    └── gameplay_preview.png # 인게임 플레이 프리뷰 스크린샷
```

---

## 🚀 로컬 실행 방법 (Quick Start)

별도의 빌드 도구나 패키지 설치가 필요하지 않습니다.

```bash
# 저장소 클론
git clone https://github.com/jeiel85/stone-age-odyssey.git
cd stone-age-odyssey

# 브라우저에서 index.html 바로 열기 (또는 로컬 정적 서버 실행)
npx serve .
```

---

## 📜 라이선스 (License)

This project is licensed under the **MIT License**.  
Inspired by the classic 1991/1993 DOS game *Prehistorik* by Titus Interactive.
