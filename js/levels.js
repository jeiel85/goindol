/**
 * Goindol (Prehistorik) Stage Definitions
 * Includes platforms, spring mushrooms, secret smashable food rocks, enemies, food, and Boss data
 */
const LEVELS = [
  {
    id: 1,
    name: 'STAGE 1: 신석기 원시림 (Prehistoric Jungle)',
    theme: 'jungle',
    bgm: 'jungle',
    width: 2600,
    foodGoal: 100,
    startX: 90,
    startY: 360,
    exitX: 2430,
    exitY: 420,
    platforms: [
      // Ground sections
      { x: 0, y: 420, w: 920, h: 120, type: 'ground' },
      { x: 1010, y: 420, w: 740, h: 120, type: 'ground' },
      { x: 1840, y: 420, w: 800, h: 120, type: 'ground' },

      // Elevated ledges
      { x: 260, y: 310, w: 180, h: 28, type: 'ledge' },
      { x: 520, y: 230, w: 200, h: 28, type: 'ledge' },
      { x: 830, y: 300, w: 140, h: 28, type: 'ledge' },
      { x: 1150, y: 300, w: 210, h: 28, type: 'ledge' },
      { x: 1440, y: 210, w: 220, h: 28, type: 'ledge' },
      { x: 1950, y: 300, w: 230, h: 28, type: 'ledge' },

      // Bouncy Mushrooms
      { x: 455, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1380, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1880, y: 388, w: 48, h: 32, type: 'spring' }
    ],
    secretSpots: [
      { x: 320, y: 256, w: 54, h: 54, hitsLeft: 3, rewards: ['🍔', '🍖', '🍎'] },
      { x: 1220, y: 246, w: 54, h: 54, hitsLeft: 3, rewards: ['🍖', '🧀', '🍨'] },
      { x: 2040, y: 246, w: 54, h: 54, hitsLeft: 3, rewards: ['🍔', '🪓', '🍖'] }
    ],
    foods: [
      { x: 290, y: 270, emoji: '🍎', food: 12, score: 150 },
      { x: 370, y: 270, emoji: '🍌', food: 12, score: 150 },
      { x: 560, y: 185, emoji: '🍖', food: 22, score: 300 },
      { x: 640, y: 185, emoji: '🧀', food: 16, score: 200 },
      { x: 870, y: 255, emoji: '🍔', food: 25, score: 350 },
      { x: 1180, y: 375, emoji: '🍎', food: 12, score: 150 },
      { x: 1490, y: 165, emoji: '🍨', food: 28, score: 450 },
      { x: 1570, y: 165, emoji: '🪓', food: 5, score: 200, axeAmmo: 5 },
      { x: 1990, y: 255, emoji: '🍖', food: 22, score: 300 },
      { x: 2220, y: 375, emoji: '🍔', food: 25, score: 350 }
    ],
    enemies: [
      { x: 400, y: 380, type: 'dino', minX: 220, maxX: 720, speed: 1.9, hp: 2 },
      { x: 600, y: 190, type: 'dino', minX: 525, maxX: 690, speed: 1.5, hp: 1 },
      { x: 1150, y: 380, type: 'boar', minX: 1030, maxX: 1650, speed: 2.8, hp: 2 },
      { x: 1320, y: 150, type: 'ptero', minX: 1080, maxX: 1700, speed: 2.3, hp: 1 },
      { x: 2050, y: 380, type: 'dino', minX: 1880, maxX: 2320, speed: 2.2, hp: 2 },
      { x: 2200, y: 380, type: 'boar', minX: 1920, maxX: 2350, speed: 3.0, hp: 2 }
    ],
    boss: null
  },
  {
    id: 2,
    name: 'STAGE 2: 화산 동굴과 공룡 협곡 (Volcanic Cave)',
    theme: 'cave',
    bgm: 'cave',
    width: 2800,
    foodGoal: 120,
    startX: 90,
    startY: 360,
    exitX: 2620,
    exitY: 420,
    platforms: [
      { x: 0, y: 420, w: 680, h: 120, type: 'ground' },
      { x: 790, y: 420, w: 580, h: 120, type: 'ground' },
      { x: 1490, y: 420, w: 520, h: 120, type: 'ground' },
      { x: 2130, y: 420, w: 670, h: 120, type: 'ground' },

      { x: 240, y: 295, w: 190, h: 28, type: 'ledge' },
      { x: 520, y: 200, w: 190, h: 28, type: 'ledge' },
      { x: 920, y: 285, w: 220, h: 28, type: 'ledge' },
      { x: 1240, y: 195, w: 190, h: 28, type: 'ledge' },
      { x: 1620, y: 280, w: 240, h: 28, type: 'ledge' },
      { x: 1940, y: 200, w: 180, h: 28, type: 'ledge' },
      { x: 2250, y: 290, w: 200, h: 28, type: 'ledge' },

      // Bouncy Mushrooms
      { x: 460, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1160, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1870, y: 388, w: 48, h: 32, type: 'spring' }
    ],
    secretSpots: [
      { x: 580, y: 146, w: 54, h: 54, hitsLeft: 3, rewards: ['🍖', '🍔', '🍨'] },
      { x: 1690, y: 226, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '🍔', '❤️'] },
      { x: 2320, y: 236, w: 54, h: 54, hitsLeft: 3, rewards: ['🍨', '🍖', '🍔'] }
    ],
    foods: [
      { x: 280, y: 250, emoji: '🧀', food: 16, score: 200 },
      { x: 350, y: 250, emoji: '🪓', food: 5, score: 200, axeAmmo: 5 },
      { x: 960, y: 240, emoji: '🍖', food: 22, score: 300 },
      { x: 1040, y: 240, emoji: '🍔', food: 25, score: 350 },
      { x: 1280, y: 150, emoji: '🍨', food: 28, score: 450 },
      { x: 1660, y: 375, emoji: '🍎', food: 12, score: 150 },
      { x: 1990, y: 155, emoji: '🍖', food: 22, score: 300 },
      { x: 2280, y: 375, emoji: '🍔', food: 25, score: 350 },
      { x: 2450, y: 375, emoji: '🧀', food: 16, score: 200 }
    ],
    enemies: [
      { x: 380, y: 380, type: 'boar', minX: 180, maxX: 640, speed: 2.9, hp: 2 },
      { x: 890, y: 380, type: 'dino', minX: 810, maxX: 1320, speed: 2.3, hp: 2 },
      { x: 1050, y: 150, type: 'ptero', minX: 820, maxX: 1420, speed: 2.6, hp: 1 },
      { x: 1580, y: 380, type: 'boar', minX: 1510, maxX: 1980, speed: 3.1, hp: 2 },
      { x: 1750, y: 140, type: 'ptero', minX: 1500, maxX: 2080, speed: 2.7, hp: 1 },
      { x: 2250, y: 380, type: 'dino', minX: 2150, maxX: 2520, speed: 2.5, hp: 2 },
      { x: 2420, y: 380, type: 'boar', minX: 2160, maxX: 2550, speed: 3.2, hp: 2 }
    ],
    boss: null
  },
  {
    id: 3,
    name: 'STAGE 3: 대고인돌 제단 - 맘모스 대왕 보스전',
    theme: 'boss',
    bgm: 'boss',
    width: 1100,
    foodGoal: 100,
    startX: 100,
    startY: 360,
    exitX: 960,
    exitY: 420,
    platforms: [
      { x: 0, y: 420, w: 1100, h: 120, type: 'ground' },
      { x: 140, y: 280, w: 200, h: 26, type: 'ledge' },
      { x: 760, y: 280, w: 200, h: 26, type: 'ledge' },
      { x: 440, y: 200, w: 220, h: 26, type: 'ledge' },
      { x: 60, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 990, y: 388, w: 48, h: 32, type: 'spring' }
    ],
    secretSpots: [
      { x: 210, y: 226, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '❤️', '🍖'] },
      { x: 830, y: 226, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '🍔', '❤️'] }
    ],
    foods: [
      { x: 480, y: 155, emoji: '🪓', food: 10, score: 250, axeAmmo: 6 },
      { x: 560, y: 155, emoji: '🍖', food: 25, score: 300 }
    ],
    enemies: [
      { x: 520, y: 110, type: 'ptero', minX: 180, maxX: 920, speed: 2.5, hp: 1 }
    ],
    boss: {
      name: '거대 맘모스 대왕 (KING MAMMOTH)',
      x: 680,
      y: 310,
      w: 115,
      h: 110,
      hp: 18,
      maxHp: 18,
      minX: 140,
      maxX: 860
    }
  }
];

window.LEVELS = LEVELS;
