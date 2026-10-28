/**
 * Goindol (Prehistorik) Expanded 6-Stage Campaign Definitions
 * Includes multi-tier platforms, moving bridges/elevators, spring mushrooms,
 * mid-stage checkpoint dolmens, secret smashable food totems, enemies, food, and Bosses
 */
const LEVELS = [
  // =========================================================================
  // STAGE 1: 신석기 원시림 (Prehistoric Jungle)
  // =========================================================================
  {
    id: 1,
    name: 'STAGE 1: 신석기 원시림 (Prehistoric Jungle)',
    theme: 'jungle',
    bgm: 'jungle',
    width: 3400,
    foodGoal: 120,
    startX: 90,
    startY: 360,
    checkpointX: 1680,
    checkpointY: 420,
    exitX: 3220,
    exitY: 420,
    platforms: [
      // Ground sections
      { x: 0, y: 420, w: 920, h: 120, type: 'ground' },
      { x: 1020, y: 420, w: 820, h: 120, type: 'ground' },
      { x: 2140, y: 420, w: 540, h: 120, type: 'ground' },
      { x: 2780, y: 420, w: 620, h: 120, type: 'ground' },

      // Moving Stone Bridge over wide chasm (1840..2140)
      { x: 1880, y: 390, w: 130, h: 26, type: 'moving', vx: 2.0, minX: 1850, maxX: 2120 },

      // Elevated ledges (Multi-tier exploration)
      { x: 250, y: 310, w: 190, h: 28, type: 'ledge' },
      { x: 510, y: 225, w: 220, h: 28, type: 'ledge' },
      { x: 820, y: 300, w: 160, h: 28, type: 'ledge' },
      { x: 1140, y: 300, w: 220, h: 28, type: 'ledge' },
      { x: 1430, y: 205, w: 240, h: 28, type: 'ledge' },
      { x: 2220, y: 295, w: 220, h: 28, type: 'ledge' },
      { x: 2520, y: 200, w: 220, h: 28, type: 'ledge' },
      { x: 2850, y: 295, w: 230, h: 28, type: 'ledge' },

      // Bouncy Mushrooms
      { x: 450, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1370, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 2455, y: 388, w: 48, h: 32, type: 'spring' }
    ],
    secretSpots: [
      { x: 315, y: 256, w: 54, h: 54, hitsLeft: 3, rewards: ['🍔', '🍖', '🍎'] },
      { x: 1210, y: 246, w: 54, h: 54, hitsLeft: 3, rewards: ['🍖', '🧀', '🍨'] },
      { x: 2300, y: 241, w: 54, h: 54, hitsLeft: 3, rewards: ['🍔', '🪓', '🍖'] },
      { x: 2930, y: 241, w: 54, h: 54, hitsLeft: 3, rewards: ['🍨', '❤️', '🍔'] }
    ],
    foods: [
      { x: 280, y: 270, emoji: '🍎', food: 12, score: 150 },
      { x: 365, y: 270, emoji: '🍌', food: 12, score: 150 },
      { x: 555, y: 185, emoji: '🍖', food: 22, score: 300 },
      { x: 640, y: 185, emoji: '🧀', food: 16, score: 200 },
      { x: 865, y: 255, emoji: '🍔', food: 25, score: 350 },
      { x: 1180, y: 375, emoji: '🍎', food: 12, score: 150 },
      { x: 1480, y: 165, emoji: '🍨', food: 28, score: 450 },
      { x: 1565, y: 165, emoji: '🪓', food: 5, score: 200, axeAmmo: 5 },
      { x: 1960, y: 335, emoji: '🍖', food: 22, score: 300 },
      { x: 2560, y: 155, emoji: '🍔', food: 25, score: 350 },
      { x: 2635, y: 155, emoji: '🧀', food: 16, score: 200 },
      { x: 2990, y: 375, emoji: '🍖', food: 22, score: 300 }
    ],
    enemies: [
      { x: 400, y: 380, type: 'dino', minX: 220, maxX: 740, speed: 1.9, hp: 2 },
      { x: 600, y: 185, type: 'dino', minX: 520, maxX: 700, speed: 1.5, hp: 1 },
      { x: 1160, y: 380, type: 'boar', minX: 1040, maxX: 1620, speed: 2.7, hp: 2 },
      { x: 1350, y: 145, type: 'ptero', minX: 1080, maxX: 1750, speed: 2.3, hp: 1 },
      { x: 2250, y: 380, type: 'dino', minX: 2160, maxX: 2640, speed: 2.2, hp: 2 },
      { x: 2580, y: 140, type: 'ptero', minX: 2200, maxX: 2740, speed: 2.5, hp: 1 },
      { x: 2920, y: 380, type: 'boar', minX: 2800, maxX: 3150, speed: 3.0, hp: 2 }
    ],
    boss: null
  },

  // =========================================================================
  // STAGE 2: 거대 고목 늪지대 (Ancient Swamp & Marsh)
  // =========================================================================
  {
    id: 2,
    name: 'STAGE 2: 거대 고목 늪지대 (Ancient Swamp)',
    theme: 'swamp',
    bgm: 'swamp',
    width: 3500,
    foodGoal: 130,
    startX: 90,
    startY: 360,
    checkpointX: 1760,
    checkpointY: 420,
    exitX: 3320,
    exitY: 420,
    platforms: [
      // Ground sections separated by deep swamp water gaps
      { x: 0, y: 420, w: 740, h: 120, type: 'ground' },
      { x: 1060, y: 420, w: 840, h: 120, type: 'ground' },
      { x: 2220, y: 420, w: 520, h: 120, type: 'ground' },
      { x: 2860, y: 420, w: 640, h: 120, type: 'ground' },

      // Moving Swamp Logs / Bridges
      { x: 780, y: 385, w: 130, h: 26, type: 'moving', vx: 2.2, minX: 755, maxX: 1045 },
      { x: 1940, y: 365, w: 130, h: 26, type: 'moving', vx: 2.4, minX: 1915, maxX: 2205 },

      // High Treetop Canopy Ledges
      { x: 240, y: 300, w: 200, h: 28, type: 'ledge' },
      { x: 500, y: 205, w: 210, h: 28, type: 'ledge' },
      { x: 1160, y: 290, w: 220, h: 28, type: 'ledge' },
      { x: 1460, y: 190, w: 230, h: 28, type: 'ledge' },
      { x: 2300, y: 285, w: 220, h: 28, type: 'ledge' },
      { x: 2600, y: 195, w: 220, h: 28, type: 'ledge' },
      { x: 2940, y: 285, w: 230, h: 28, type: 'ledge' },

      // Bouncy Glowing Mushrooms
      { x: 440, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1400, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 2535, y: 388, w: 48, h: 32, type: 'spring' }
    ],
    secretSpots: [
      { x: 560, y: 151, w: 54, h: 54, hitsLeft: 3, rewards: ['🍖', '🍔', '🪓'] },
      { x: 1230, y: 236, w: 54, h: 54, hitsLeft: 3, rewards: ['🍨', '🧀', '🍖'] },
      { x: 2380, y: 231, w: 54, h: 54, hitsLeft: 3, rewards: ['🍔', '❤️', '🪓'] },
      { x: 3020, y: 231, w: 54, h: 54, hitsLeft: 3, rewards: ['🍖', '🍨', '🍔'] }
    ],
    foods: [
      { x: 280, y: 255, emoji: '🍌', food: 14, score: 180 },
      { x: 360, y: 255, emoji: '🍎', food: 14, score: 180 },
      { x: 880, y: 310, emoji: '🍖', food: 22, score: 300 },
      { x: 1500, y: 145, emoji: '🍔', food: 25, score: 350 },
      { x: 1580, y: 145, emoji: '🪓', food: 5, score: 220, axeAmmo: 5 },
      { x: 2040, y: 295, emoji: '🍨', food: 28, score: 450 },
      { x: 2640, y: 150, emoji: '🍖', food: 22, score: 300 },
      { x: 2720, y: 150, emoji: '🧀', food: 18, score: 240 },
      { x: 3120, y: 375, emoji: '🍔', food: 25, score: 350 }
    ],
    enemies: [
      { x: 340, y: 380, type: 'dino', minX: 180, maxX: 690, speed: 2.1, hp: 2 },
      { x: 860, y: 180, type: 'ptero', minX: 680, maxX: 1180, speed: 2.5, hp: 1 },
      { x: 1250, y: 380, type: 'boar', minX: 1080, maxX: 1700, speed: 2.9, hp: 2 },
      { x: 1550, y: 380, type: 'dino', minX: 1120, maxX: 1840, speed: 2.3, hp: 2 },
      { x: 2020, y: 165, type: 'ptero', minX: 1850, maxX: 2380, speed: 2.7, hp: 1 },
      { x: 2360, y: 380, type: 'boar', minX: 2240, maxX: 2700, speed: 3.1, hp: 2 },
      { x: 2960, y: 380, type: 'dino', minX: 2880, maxX: 3240, speed: 2.4, hp: 2 },
      { x: 3100, y: 150, type: 'ptero', minX: 2850, maxX: 3300, speed: 2.8, hp: 1 }
    ],
    boss: null
  },

  // =========================================================================
  // STAGE 3: 화산 동굴과 공룡 협곡 (Volcanic Cave & Bone Canyon)
  // =========================================================================
  {
    id: 3,
    name: 'STAGE 3: 화산 동굴과 공룡 협곡 (Volcanic Cave)',
    theme: 'cave',
    bgm: 'cave',
    width: 3600,
    foodGoal: 140,
    startX: 90,
    startY: 360,
    checkpointX: 1850,
    checkpointY: 420,
    exitX: 3420,
    exitY: 420,
    platforms: [
      { x: 0, y: 420, w: 680, h: 120, type: 'ground' },
      { x: 790, y: 420, w: 620, h: 120, type: 'ground' },
      { x: 1730, y: 420, w: 640, h: 120, type: 'ground' },
      { x: 2490, y: 420, w: 460, h: 120, type: 'ground' },
      { x: 3060, y: 420, w: 540, h: 120, type: 'ground' },

      // Moving Cave Platforms
      { x: 1450, y: 370, w: 130, h: 26, type: 'moving', vx: 2.4, minX: 1425, maxX: 1715 },
      { x: 2760, y: 250, w: 130, h: 26, type: 'moving', vy: 1.8, minY: 180, maxY: 360 },

      // Cavern Ledges
      { x: 240, y: 295, w: 190, h: 28, type: 'ledge' },
      { x: 510, y: 200, w: 190, h: 28, type: 'ledge' },
      { x: 910, y: 285, w: 220, h: 28, type: 'ledge' },
      { x: 1180, y: 190, w: 200, h: 28, type: 'ledge' },
      { x: 1920, y: 280, w: 240, h: 28, type: 'ledge' },
      { x: 2210, y: 190, w: 190, h: 28, type: 'ledge' },
      { x: 3100, y: 285, w: 210, h: 28, type: 'ledge' },

      // Bouncy Mushrooms
      { x: 450, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1120, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 2150, y: 388, w: 48, h: 32, type: 'spring' }
    ],
    secretSpots: [
      { x: 570, y: 146, w: 54, h: 54, hitsLeft: 3, rewards: ['🍖', '🍔', '🍨'] },
      { x: 1250, y: 136, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '🍔', '❤️'] },
      { x: 1990, y: 226, w: 54, h: 54, hitsLeft: 3, rewards: ['🍨', '🍖', '🍔'] },
      { x: 3170, y: 231, w: 54, h: 54, hitsLeft: 3, rewards: ['🍖', '❤️', '🍔'] }
    ],
    foods: [
      { x: 280, y: 250, emoji: '🧀', food: 16, score: 200 },
      { x: 350, y: 250, emoji: '🪓', food: 5, score: 200, axeAmmo: 5 },
      { x: 950, y: 240, emoji: '🍖', food: 22, score: 300 },
      { x: 1030, y: 240, emoji: '🍔', food: 25, score: 350 },
      { x: 1550, y: 300, emoji: '🍨', food: 28, score: 450 },
      { x: 2250, y: 145, emoji: '🍖', food: 22, score: 300 },
      { x: 2580, y: 375, emoji: '🍔', food: 25, score: 350 },
      { x: 2800, y: 140, emoji: '🍨', food: 28, score: 450 },
      { x: 3250, y: 375, emoji: '🧀', food: 16, score: 200 }
    ],
    enemies: [
      { x: 380, y: 380, type: 'boar', minX: 180, maxX: 640, speed: 2.9, hp: 2 },
      { x: 890, y: 380, type: 'dino', minX: 810, maxX: 1360, speed: 2.4, hp: 2 },
      { x: 1050, y: 150, type: 'ptero', minX: 820, maxX: 1420, speed: 2.6, hp: 1 },
      { x: 1960, y: 380, type: 'boar', minX: 1760, maxX: 2320, speed: 3.1, hp: 2 },
      { x: 2100, y: 140, type: 'ptero', minX: 1750, maxX: 2400, speed: 2.8, hp: 1 },
      { x: 2620, y: 380, type: 'dino', minX: 2510, maxX: 2910, speed: 2.6, hp: 2 },
      { x: 3150, y: 380, type: 'boar', minX: 3080, maxX: 3360, speed: 3.2, hp: 2 }
    ],
    boss: null
  },

  // =========================================================================
  // STAGE 4: 빙하기 설원 협곡 (Ice Age Glacial Gorge - Mid-Boss Stage)
  // =========================================================================
  {
    id: 4,
    name: 'STAGE 4: 빙하기 설원 협곡 (Glacial Gorge)',
    theme: 'ice',
    bgm: 'ice',
    width: 3600,
    foodGoal: 140,
    startX: 90,
    startY: 360,
    checkpointX: 1820,
    checkpointY: 420,
    exitX: 3420,
    exitY: 420,
    platforms: [
      { x: 0, y: 420, w: 820, h: 120, type: 'ground' },
      { x: 1140, y: 420, w: 860, h: 120, type: 'ground' },
      { x: 2320, y: 420, w: 1280, h: 120, type: 'ground' },

      // Moving Ice Floes across freezing canyons
      { x: 860, y: 380, w: 135, h: 26, type: 'moving', vx: 2.5, minX: 835, maxX: 1125 },
      { x: 2040, y: 365, w: 135, h: 26, type: 'moving', vx: 2.6, minX: 2015, maxX: 2305 },

      // Glacial Ledges
      { x: 260, y: 295, w: 200, h: 28, type: 'ledge' },
      { x: 540, y: 195, w: 210, h: 28, type: 'ledge' },
      { x: 1240, y: 285, w: 220, h: 28, type: 'ledge' },
      { x: 1540, y: 185, w: 220, h: 28, type: 'ledge' },
      { x: 2520, y: 275, w: 200, h: 28, type: 'ledge' },
      { x: 3040, y: 275, w: 200, h: 28, type: 'ledge' },

      // Bouncy Mushrooms
      { x: 480, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1475, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 2440, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 3270, y: 388, w: 48, h: 32, type: 'spring' }
    ],
    secretSpots: [
      { x: 600, y: 141, w: 54, h: 54, hitsLeft: 3, rewards: ['🍨', '🍖', '🪓'] },
      { x: 1610, y: 131, w: 54, h: 54, hitsLeft: 3, rewards: ['🍔', '❤️', '🍨'] },
      { x: 2590, y: 221, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '🍖', '❤️'] },
      { x: 3110, y: 221, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '🍔', '🍖'] }
    ],
    foods: [
      { x: 310, y: 250, emoji: '🍨', food: 25, score: 400 },
      { x: 960, y: 310, emoji: '🍖', food: 22, score: 300 },
      { x: 1300, y: 240, emoji: '🍔', food: 25, score: 350 },
      { x: 1380, y: 240, emoji: '🪓', food: 5, score: 250, axeAmmo: 6 },
      { x: 2140, y: 295, emoji: '🍨', food: 28, score: 450 },
      { x: 2800, y: 375, emoji: '🍖', food: 22, score: 300 }
    ],
    enemies: [
      { x: 420, y: 380, type: 'boar', minX: 180, maxX: 780, speed: 3.0, hp: 2 },
      { x: 980, y: 160, type: 'ptero', minX: 780, maxX: 1320, speed: 2.7, hp: 1 },
      { x: 1350, y: 380, type: 'dino', minX: 1160, maxX: 1760, speed: 2.6, hp: 2 },
      { x: 1650, y: 380, type: 'boar', minX: 1200, maxX: 1950, speed: 3.2, hp: 2 },
      { x: 2150, y: 150, type: 'ptero', minX: 1950, maxX: 2500, speed: 2.8, hp: 1 }
    ],
    boss: {
      name: '빙하 설원 수호자 (FROST MAMMOTH)',
      x: 2950,
      y: 310,
      w: 115,
      h: 110,
      hp: 14,
      maxHp: 14,
      minX: 2480,
      maxX: 3260
    }
  },

  // =========================================================================
  // STAGE 5: 용암 화구 성채 (Magma Caldera Fortress)
  // =========================================================================
  {
    id: 5,
    name: 'STAGE 5: 용암 화구 성채 (Magma Fortress)',
    theme: 'volcano',
    bgm: 'volcano',
    width: 3800,
    foodGoal: 150,
    startX: 90,
    startY: 360,
    checkpointX: 1920,
    checkpointY: 420,
    exitX: 3620,
    exitY: 420,
    platforms: [
      { x: 0, y: 420, w: 720, h: 120, type: 'ground' },
      { x: 1060, y: 420, w: 680, h: 120, type: 'ground' },
      { x: 1860, y: 420, w: 660, h: 120, type: 'ground' },
      { x: 2860, y: 420, w: 940, h: 120, type: 'ground' },

      // Moving Obsidian Platforms over Lava Rivers
      { x: 760, y: 375, w: 130, h: 26, type: 'moving', vx: 2.6, minX: 735, maxX: 1045 },
      { x: 2560, y: 360, w: 130, h: 26, type: 'moving', vx: 2.8, minX: 2535, maxX: 2845 },
      { x: 1755, y: 270, w: 95, h: 26, type: 'moving', vy: 2.0, minY: 185, maxY: 375 },

      // Multi-tiered Volcano Fortress Ledges
      { x: 250, y: 290, w: 200, h: 28, type: 'ledge' },
      { x: 510, y: 190, w: 190, h: 28, type: 'ledge' },
      { x: 1160, y: 285, w: 220, h: 28, type: 'ledge' },
      { x: 1450, y: 185, w: 220, h: 28, type: 'ledge' },
      { x: 2020, y: 285, w: 220, h: 28, type: 'ledge' },
      { x: 2280, y: 185, w: 210, h: 28, type: 'ledge' },
      { x: 2980, y: 285, w: 230, h: 28, type: 'ledge' },
      { x: 3280, y: 190, w: 210, h: 28, type: 'ledge' },

      // Bouncy Mushrooms
      { x: 450, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1390, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 2220, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 3220, y: 388, w: 48, h: 32, type: 'spring' }
    ],
    secretSpots: [
      { x: 570, y: 136, w: 54, h: 54, hitsLeft: 3, rewards: ['🍖', '🍔', '🪓'] },
      { x: 1520, y: 131, w: 54, h: 54, hitsLeft: 3, rewards: ['🍨', '❤️', '🍔'] },
      { x: 2340, y: 131, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '🍖', '🍔'] },
      { x: 3060, y: 231, w: 54, h: 54, hitsLeft: 3, rewards: ['❤️', '🍨', '🍖'] },
      { x: 3350, y: 136, w: 54, h: 54, hitsLeft: 3, rewards: ['🍔', '🪓', '🍖'] }
    ],
    foods: [
      { x: 290, y: 245, emoji: '🍖', food: 22, score: 300 },
      { x: 880, y: 305, emoji: '🍔', food: 25, score: 350 },
      { x: 1220, y: 240, emoji: '🧀', food: 18, score: 250 },
      { x: 1300, y: 240, emoji: '🪓', food: 5, score: 250, axeAmmo: 6 },
      { x: 2080, y: 240, emoji: '🍖', food: 22, score: 300 },
      { x: 2680, y: 290, emoji: '🍨', food: 28, score: 450 },
      { x: 3150, y: 375, emoji: '🍔', food: 25, score: 350 },
      { x: 3450, y: 375, emoji: '🍖', food: 22, score: 300 }
    ],
    enemies: [
      { x: 360, y: 380, type: 'boar', minX: 180, maxX: 680, speed: 3.1, hp: 3 },
      { x: 890, y: 160, type: 'ptero', minX: 700, maxX: 1250, speed: 2.9, hp: 1 },
      { x: 1250, y: 380, type: 'dino', minX: 1080, maxX: 1700, speed: 2.7, hp: 3 },
      { x: 1550, y: 380, type: 'boar', minX: 1100, maxX: 1710, speed: 3.3, hp: 2 },
      { x: 2050, y: 380, type: 'dino', minX: 1880, maxX: 2480, speed: 2.8, hp: 3 },
      { x: 2350, y: 135, type: 'ptero', minX: 1950, maxX: 2700, speed: 3.0, hp: 1 },
      { x: 3020, y: 380, type: 'boar', minX: 2880, maxX: 3540, speed: 3.4, hp: 3 },
      { x: 3320, y: 380, type: 'dino', minX: 2900, maxX: 3560, speed: 2.9, hp: 3 }
    ],
    boss: null
  },

  // =========================================================================
  // STAGE 6: 대고인돌 제단 - 거대 맘모스 대왕 최종 결전 (Final Boss Arena)
  // =========================================================================
  {
    id: 6,
    name: 'STAGE 6: 대고인돌 제단 - 맘모스 대왕 최종 결전',
    theme: 'boss',
    bgm: 'boss',
    width: 1500,
    foodGoal: 120,
    startX: 100,
    startY: 360,
    exitX: 1340,
    exitY: 420,
    platforms: [
      { x: 0, y: 420, w: 1500, h: 120, type: 'ground' },
      { x: 150, y: 285, w: 220, h: 26, type: 'ledge' },
      { x: 640, y: 255, w: 220, h: 26, type: 'ledge' },
      { x: 1130, y: 285, w: 220, h: 26, type: 'ledge' },
      { x: 420, y: 170, w: 160, h: 24, type: 'moving', vx: 2.1, minX: 360, maxX: 960 },
      { x: 60, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 725, y: 388, w: 48, h: 32, type: 'spring' },
      { x: 1390, y: 388, w: 48, h: 32, type: 'spring' }
    ],
    secretSpots: [
      { x: 230, y: 231, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '❤️', '🍖'] },
      { x: 720, y: 201, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '🍔', '❤️'] },
      { x: 1210, y: 231, w: 54, h: 54, hitsLeft: 3, rewards: ['🪓', '🍨', '🍖'] }
    ],
    foods: [
      { x: 460, y: 125, emoji: '🪓', food: 10, score: 250, axeAmmo: 6 },
      { x: 520, y: 125, emoji: '🍖', food: 25, score: 300 },
      { x: 735, y: 125, emoji: '🍔', food: 25, score: 350 }
    ],
    enemies: [
      { x: 520, y: 110, type: 'ptero', minX: 180, maxX: 1320, speed: 2.7, hp: 1 },
      { x: 980, y: 135, type: 'ptero', minX: 240, maxX: 1340, speed: 2.9, hp: 1 }
    ],
    boss: {
      name: '대고인돌 지배자 : 거대 맘모스 대왕 (KING MAMMOTH)',
      x: 920,
      y: 310,
      w: 115,
      h: 110,
      hp: 24,
      maxHp: 24,
      minX: 160,
      maxX: 1240
    }
  }
];

window.LEVELS = LEVELS;
