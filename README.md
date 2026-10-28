<div align="center">

# 🪨 고인돌 (GOINDOL : Prehistorik Web Arcade)

**추억의 1991/1993년 DOS 명작 원시인 액션 플랫포머 《고인돌 (Prehistorik)》 웹 아케이드 에디션**  
외부 라이브러리 없이 **HTML5 Canvas 픽셀 아트, PNG 배경과 Web Audio API 칩튠 신디사이저**로 구현한 브라우저 즉시 실행 게임 & 랜딩 페이지입니다.

[![Live Demo](https://img.shields.io/badge/🕹️_LIVE_DEMO-Play_in_Browser-ffae00?style=for-the-badge&logo=googlechrome&logoColor=black)](https://jeiel85.github.io/goindol/)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas_2D-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_Chiptune-4cd964?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-007ec6?style=for-the-badge)]()

<br />

<img src="./assets/hero_banner.png" alt="고인돌 (Goindol) 16-Bit 아케이드 키 아트" width="860" />

<br />

<img src="./assets/gameplay_preview.png" alt="고인돌 (Goindol) 인게임 플레이 화면" width="860" />

<br />

👉 **[라이브 데모 바로 플레이하기 (https://jeiel85.github.io/goindol/)](https://jeiel85.github.io/goindol/)** 👈

</div>

---

## ✨ 주요 특징 (Key Features)

- **🔨 찰진 몽둥이 타격감 & 화면 진동 (Club Smash & Screen Shake)**
  - 원시인 **샘(Sam)**의 참나무 몽둥이로 지면을 내리칠 때 발생하는 묵직한 타격음, 충격파 이펙트, 화면 흔들림(Screen Shake)을 구현했습니다.
- **🍖 수상한 바위 타격 & 비밀 식량 폭포 (Secret Food Caches)**
  - 원작 《고인돌》의 상징적인 재미 요소였던 *"특정 지형을 두드리면 숨겨진 음식들이 쏟아지는 기믹"*을 재현했습니다. 스테이지 곳곳의 **뼈 문양 토템 바위**를 몽둥이로 내려치면 고기, 원시 햄버거, 아이스크림, 돌도끼가 솟구쳐 오릅니다.
- **📊 식량 게이지 & 고인돌 관문 시스템 (Food Gauge & Dolmen Exit)**
  - 음식을 수집해 상단 **식량 게이지(Food Gauge)를 50% 이상** 채워야 스테이지 마지막의 **고인돌 관문(`★ EXIT OPEN ★`)**이 열립니다.
- **🪓 원거리 돌도끼 투척 & 통통 버섯 점프대**
  - 공중을 나는 보라 익룡이나 멀리 있는 적을 포물선 궤적의 **돌도끼(`C` / `K` 키)**로 타격할 수 있으며, **통통 버섯**을 밟아 높은 절벽으로 단숨에 도약할 수 있습니다.
- **🎵 무에셋 Web Audio API 8-Bit / AdLib 사운드트랙**
  - 외부 MP3/WAV 파일 없이 `AudioContext` 오실레이터와 노이즈 필터만으로 **원시림·화산동굴·보스전 3종의 배경음악(BGM)**과 11종의 레트로 효과음을 실시간 합성합니다.
- **📱 반응형 아케이드 캐비닛 & 모바일 터치 패드 지원**
  - 데스크톱 키보드 조작은 물론, 모바일/태블릿 환경에서는 화면 하단에 가상 D-Pad와 액션 버튼(`몽둥이`, `JUMP`, `🪓`)이 자동으로 활성화됩니다.

---

## 🎮 조작법 (Controls)

| 동작 | 키보드 (주 키) | 키보드 (보조 키) | 모바일 / 태블릿 |
| :--- | :---: | :---: | :---: |
| **좌우 이동** | `←` / `→` 방향키 | `A` / `D` | 좌측 `◀` `▶` 터치 버튼 |
| **점프** | `Space` | `Z` / `↑` / `W` | 우측 `JUMP` 버튼 |
| **몽둥이 내려치기** | `X` | `J` / `Enter` | 우측 `몽둥이` 버튼 |
| **돌도끼 던지기** | `C` | `K` | 우측 `🪓` 버튼 |
| **일시정지** | `P` | `Esc` | 상단 컨트롤 바 |

---

## 🗺️ 스테이지 구성 (Stages & Boss)

1. **🌲 STAGE 1: 신석기 원시림 (Prehistoric Jungle)**
   - 거대 고사리 나무와 고인돌 유적이 펼쳐진 입문 스테이지. 초록 공룡과 돌진 멧돼지를 제압하고 숨겨진 바위 보물을 찾아내세요.
2. **🌋 STAGE 2: 화산 동굴과 공룡 협곡 (Volcanic Cave & Bone Canyon)**
   - 용암 협곡과 종유석 동굴 지형. 통통 버섯을 활용한 고지대 점프와 보라 익룡의 공중 습격을 돌파해야 합니다.
3. **🦣 STAGE 3: 대고인돌 제단 - 거대 맘모스 대왕 보스전 (King Mammoth Boss Arena)**
   - 거대한 어금니를 지닌 **맘모스 대왕(HP 18)**과의 결전! 점프 후 착지할 때 양방향으로 퍼지는 **대지 충격파 바위**를 점프로 피하고, 체력 50% 이하에서 발동하는 **분노 모드**를 뚫고 황금 고기를 쟁취하세요!

---

## 🏗️ 프로젝트 구조 (Project Structure)

```text
goindol/
├── index.html          # 아케이드 캐비닛 라이브 데모 & 도감 랜딩 페이지
├── css/
│   └── style.css       # 레트로 아케이드 테마, CRT 스캔라인 필터, 반응형 터치 UI
├── js/
│   ├── audio.js        # Web Audio API 기반 8-bit/AdLib BGM 시퀀서 & 효과음 합성기
│   ├── pixel_assets.js # 픽셀 스프라이트·아이콘·타일 생성 및 PNG 이미지 로딩
│   ├── sprites.js      # 패럴랙스 배경과 픽셀 스프라이트 Canvas 렌더러
│   ├── levels.js       # 스테이지 1~3 지형, 비밀 바위 스팟, 식량, 몬스터 & 보스 데이터
│   └── game.js         # 60FPS 물리 엔진, 충돌 판정, 몽둥이 타격, 보스 AI, HUD 관리
└── assets/
    ├── bg_jungle.png   # 스테이지 1 원시림 배경
    ├── bg_cave.png     # 스테이지 2 동굴 배경
    ├── bg_boss.png     # 스테이지 3 보스 아레나 배경
    ├── hero_banner.png # 타이틀과 랜딩 페이지 키 아트
    └── preview.svg     # README 및 소셜 프리뷰용 벡터 아케이드 배너
```

---

## 🚀 로컬 실행 방법 (Quick Start)

별도의 빌드 도구나 패키지 설치가 필요하지 않습니다.

```bash
# 저장소 클론
git clone https://github.com/jeiel85/goindol.git
cd goindol

# 브라우저에서 index.html 바로 열기 (또는 로컬 정적 서버 실행)
npx serve .
```

---

## 📜 라이선스 (License)

This project is licensed under the **MIT License**.  
Inspired by the classic 1991/1993 DOS game *Prehistorik* by Titus Interactive.
