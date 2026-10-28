/**
 * Stone Age Odyssey : 고인돌 (Prehistorik) Main Game Engine
 * 60fps 16-Bit Arcade Platformer with 8 Stages, 4 Playable Heroes,
 * Moving & Crumbling Platforms, Power-Up Relics, Dash, Combo System & Boss Battles
 */
const HERO_CONFIGS = {
  sam: {
    id: 'sam',
    name: '원시인 샘',
    title: '균형형 전사',
    maxHp: 5,
    speed: 4.5,
    jumpForce: 12.6,
    attackDmg: 1,
    bossDmg: 2,
    clubReach: 74,
    projType: 'axe',
    projSpeed: 8.6,
    projGravity: 0.32,
    startAmmo: 6,
    maxJumps: 1,
    canGlide: false,
    foodBonus: 1.0,
    oneHitChest: false,
    groundShockwave: false,
    ammoRegen: false
  },
  uga: {
    id: 'uga',
    name: '사냥꾼 우가',
    title: '2단 점프 & 창술사',
    maxHp: 4,
    speed: 5.2,
    jumpForce: 12.9,
    attackDmg: 1,
    bossDmg: 2,
    clubReach: 92,
    projType: 'spear_proj',
    projSpeed: 10.6,
    projGravity: 0.16,
    startAmmo: 8,
    maxJumps: 2,
    canGlide: false,
    foodBonus: 1.0,
    oneHitChest: false,
    groundShockwave: false,
    ammoRegen: false
  },
  brok: {
    id: 'brok',
    name: '괴력의 브록',
    title: '중장갑 해머 전사',
    maxHp: 7,
    speed: 3.9,
    jumpForce: 12.2,
    attackDmg: 2,
    bossDmg: 3,
    clubReach: 80,
    projType: 'hammer_proj',
    projSpeed: 7.8,
    projGravity: 0.38,
    startAmmo: 5,
    maxJumps: 1,
    canGlide: false,
    foodBonus: 1.0,
    oneHitChest: true,
    groundShockwave: true,
    ammoRegen: false
  },
  tara: {
    id: 'tara',
    name: '주술사 타라',
    title: '공중 활공 & 화염구',
    maxHp: 4,
    speed: 4.6,
    jumpForce: 12.8,
    attackDmg: 1,
    bossDmg: 2,
    clubReach: 84,
    projType: 'fireball_proj',
    projSpeed: 9.4,
    projGravity: 0.06,
    startAmmo: 8,
    maxJumps: 1,
    canGlide: true,
    foodBonus: 1.25,
    oneHitChest: false,
    groundShockwave: false,
    ammoRegen: true
  }
};

class GoindolGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.width = 960;
    this.height = 540;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.imageSmoothingEnabled = false;

    this.state = 'TITLE'; // TITLE, PLAYING, PAUSED, STAGE_CLEAR, GAME_OVER, VICTORY
    this.currentStageIdx = 0;
    this.selectedHero = 'sam';
    this.score = 0;
    this.highScore = Number(localStorage.getItem('goindol_highscore') || 12500);
    this.time = 0;
    this.screenShake = 0;
    this.comboCount = 0;
    this.comboTimer = 0;

    this.keys = {};
    this.justPressed = {};

    this.player = null;
    this.level = null;
    this.platforms = [];
    this.secretSpots = [];
    this.foods = [];
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.boss = null;
    this.checkpointReached = false;
    this.cameraX = 0;

    this.bindInput();
    this.loadStage(0, false);
    requestAnimationFrame(() => this.loop());
  }

  getHeroConfig() {
    return HERO_CONFIGS[this.selectedHero] || HERO_CONFIGS.sam;
  }

  selectHero(heroId) {
    if (!HERO_CONFIGS[heroId]) return;
    this.selectedHero = heroId;
    const hero = this.getHeroConfig();
    if (this.player) {
      this.player.charId = hero.id;
      this.player.maxHp = hero.maxHp;
      this.player.hp = Math.min(this.player.maxHp, Math.max(this.player.hp, hero.maxHp));
      this.player.jumpsLeft = hero.maxJumps;
      this.player.axeAmmo = Math.max(this.player.axeAmmo, hero.startAmmo);
      if (this.state === 'PLAYING') {
        window.soundEngine.powerup();
        this.spawnParticles(this.player.x + 18, this.player.y + 20, '#ffcf40', 14);
        this.addFloatingText(this.player.x - 20, this.player.y - 24, `${hero.name} 출전! (${hero.title})`, '#64f5ff', 55);
      }
    }
    document.querySelectorAll('[data-hero-btn]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-hero-btn') === heroId);
    });
  }

  bindInput() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(e.code)) {
        e.preventDefault();
      }
      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true;
      }
      this.keys[e.code] = true;

      if (this.state === 'TITLE' && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyX' || e.code === 'KeyZ')) {
        this.startNewGame(0);
      } else if (this.state === 'STAGE_CLEAR' && (e.code === 'Space' || e.code === 'Enter')) {
        this.nextStage();
      } else if (this.state === 'GAME_OVER' && this.gameOverTimer <= 0 && (e.code === 'Space' || e.code === 'Enter')) {
        this.retryCurrentStage();
      } else if (this.state === 'VICTORY' && (e.code === 'Space' || e.code === 'Enter')) {
        this.startNewGame(0);
      } else if (e.code === 'Digit1') {
        this.selectHero('sam');
      } else if (e.code === 'Digit2') {
        this.selectHero('uga');
      } else if (e.code === 'Digit3') {
        this.selectHero('brok');
      } else if (e.code === 'Digit4') {
        this.selectHero('tara');
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === 'PLAYING') {
          this.state = 'PAUSED';
          window.soundEngine.stopBGM();
        } else if (this.state === 'PAUSED') {
          this.state = 'PLAYING';
          window.soundEngine.startBGM(this.level.bgm);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    this.canvas.addEventListener('click', () => {
      if (this.state === 'TITLE') {
        this.startNewGame(0);
      } else if (this.state === 'STAGE_CLEAR') {
        this.nextStage();
      } else if (this.state === 'GAME_OVER' && this.gameOverTimer <= 0) {
        this.retryCurrentStage();
      } else if (this.state === 'VICTORY') {
        this.startNewGame(0);
      }
    });

    // Touch controls binding
    const bindTouch = (id, keyCode) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const press = (e) => {
        e.preventDefault();
        if (this.state === 'TITLE') {
          this.startNewGame(0);
          return;
        }
        if (this.state === 'STAGE_CLEAR') {
          this.nextStage();
          return;
        }
        if (this.state === 'GAME_OVER') {
          if (this.gameOverTimer <= 0) this.retryCurrentStage();
          return;
        }
        if (this.state === 'VICTORY') {
          this.startNewGame(0);
          return;
        }
        if (!this.keys[keyCode]) this.justPressed[keyCode] = true;
        this.keys[keyCode] = true;
      };
      const release = (e) => {
        e.preventDefault();
        this.keys[keyCode] = false;
      };
      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    };

    bindTouch('btnLeft', 'ArrowLeft');
    bindTouch('btnRight', 'ArrowRight');
    bindTouch('btnJump', 'Space');
    bindTouch('btnClub', 'KeyX');
    bindTouch('btnAxe', 'KeyC');
    bindTouch('btnDash', 'KeyV');
  }

  startNewGame(stageIndex = 0) {
    this.score = 0;
    this.loadStage(stageIndex, true);
  }

  loadStage(stageIndex, startPlaying = true) {
    this.currentStageIdx = stageIndex;
    const raw = window.LEVELS[stageIndex] || window.LEVELS[0];
    this.level = JSON.parse(JSON.stringify(raw));

    this.platforms = this.level.platforms.map(plat => ({
      ...plat,
      dx: 0,
      dy: 0,
      crumbleTimer: 0,
      broken: false,
      respawnTimer: 0
    }));
    this.secretSpots = this.level.secretSpots.map(s => ({
      ...s,
      hitTimer: 0,
      depleted: false
    }));
    this.foods = this.level.foods.map(f => ({
      ...f,
      vy: 0,
      vx: 0,
      bouncing: false
    }));
    this.enemies = this.level.enemies.map(e => ({
      ...e,
      w: e.type === 'ptero' ? 46 : 42,
      h: e.type === 'ptero' ? 28 : 40,
      baseY: e.y,
      vx: e.speed,
      stunTimer: 0
    }));

    if (this.level.boss) {
      this.boss = {
        ...this.level.boss,
        vx: -2.3,
        vy: 0,
        facing: -1,
        hurtTimer: 0,
        stunTimer: 0,
        actionTimer: 90,
        enraged: false,
        onGround: true
      };
    } else {
      this.boss = null;
    }

    this.checkpointReached = false;
    this.gameOverTimer = 0;
    this.comboCount = 0;
    this.comboTimer = 0;

    const hero = this.getHeroConfig();
    this.player = {
      charId: hero.id,
      x: this.level.startX,
      y: this.level.startY,
      respawnX: this.level.startX,
      respawnY: 200,
      w: 36,
      h: 46,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: false,
      standingPlat: null,
      jumpsLeft: hero.maxJumps,
      hp: hero.maxHp,
      maxHp: hero.maxHp,
      food: 0,
      foodGoal: this.level.foodGoal,
      axeAmmo: hero.startAmmo,
      attackTimer: 0,
      attackDuration: 15,
      hasHitThisSwing: false,
      invulnTimer: 0,
      knockbackTimer: 0,
      dashTimer: 0,
      dashCooldown: 0,
      furyTimer: 0,
      speedTimer: 0,
      magnetTimer: 0,
      hasShield: false
    };

    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.cameraX = 0;

    if (startPlaying) {
      this.state = 'PLAYING';
      window.soundEngine.startBGM(this.level.bgm);
      this.addFloatingText(this.player.x, this.player.y - 30, this.level.name, '#ffcf40', 75);
    }

    // Highlight active stage button if present
    document.querySelectorAll('[data-stage-btn]').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === stageIndex);
    });
  }

  retryCurrentStage() {
    const hadCheckpoint = this.checkpointReached;
    const savedFood = this.player ? this.player.food : 0;
    this.loadStage(this.currentStageIdx, true);
    if (hadCheckpoint && this.level.checkpointX) {
      this.checkpointReached = true;
      this.player.x = this.level.checkpointX;
      this.player.y = (this.level.checkpointY || 420) - 80;
      this.player.respawnX = this.level.checkpointX;
      this.player.respawnY = (this.level.checkpointY || 420) - 80;
      this.player.food = Math.max(savedFood, Math.ceil(this.player.foodGoal * 0.55));
      this.player.axeAmmo = Math.max(this.player.axeAmmo, 6);
      this.addFloatingText(this.player.x - 30, this.player.y - 25, '체크포인트에서 재도전!', '#ffcb5c', 60);
    }
  }

  nextStage() {
    if (this.currentStageIdx + 1 < window.LEVELS.length) {
      this.loadStage(this.currentStageIdx + 1, true);
    } else {
      this.state = 'VICTORY';
      window.soundEngine.stopBGM();
      window.soundEngine.stageClear();
    }
  }

  addScore(pts, useCombo = false) {
    let finalPts = pts;
    if (useCombo) {
      this.comboCount++;
      this.comboTimer = 165;
      const mult = 1 + Math.min(2.0, Math.floor(this.comboCount / 3) * 0.5);
      finalPts = Math.round(pts * mult);
    }
    this.score += finalPts;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('goindol_highscore', String(this.highScore));
    }
    return finalPts;
  }

  addFloatingText(x, y, text, color = '#ffae00', life = 45) {
    this.floatingTexts.push({ x, y, text, color, life, maxLife: life });
  }

  spawnParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.8) * 7,
        size: 3 + Math.random() * 4,
        color,
        life: 20 + Math.random() * 15
      });
    }
  }

  update() {
    this.time++;
    if (this.screenShake > 0) this.screenShake--;
    if (this.gameOverTimer > 0) this.gameOverTimer--;
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer <= 0) this.comboCount = 0;
    }

    if (this.state !== 'PLAYING') {
      this.justPressed = {};
      return;
    }

    const p = this.player;
    const hero = this.getHeroConfig();

    // Active Buff & Cooldown Timers
    if (p.dashTimer > 0) p.dashTimer--;
    if (p.dashCooldown > 0) p.dashCooldown--;
    if (p.furyTimer > 0) p.furyTimer--;
    if (p.speedTimer > 0) p.speedTimer--;
    if (p.magnetTimer > 0) p.magnetTimer--;

    // Shaman Tara passive mana/fireball regeneration
    if (hero.ammoRegen && this.time % 240 === 0 && p.axeAmmo < 8) {
      p.axeAmmo++;
      this.addFloatingText(p.x, p.y - 16, '주술 충전 +1🔥', '#d946ef', 30);
    }

    // 0. Update Moving & Crumbling Platforms
    for (const plat of this.platforms) {
      plat.dx = 0;
      plat.dy = 0;
      if (plat.type === 'moving') {
        if (plat.vx) {
          const prevX = plat.x;
          plat.x += plat.vx;
          if (plat.x <= plat.minX) {
            plat.x = plat.minX;
            plat.vx = Math.abs(plat.vx);
          } else if (plat.x + plat.w >= plat.maxX) {
            plat.x = plat.maxX - plat.w;
            plat.vx = -Math.abs(plat.vx);
          }
          plat.dx = plat.x - prevX;
        }
        if (plat.vy) {
          const prevY = plat.y;
          plat.y += plat.vy;
          if (plat.y <= plat.minY) {
            plat.y = plat.minY;
            plat.vy = Math.abs(plat.vy);
          } else if (plat.y >= plat.maxY) {
            plat.y = plat.maxY;
            plat.vy = -Math.abs(plat.vy);
          }
          plat.dy = plat.y - prevY;
        }
      } else if (plat.type === 'crumble') {
        if (plat.broken) {
          plat.respawnTimer--;
          if (plat.respawnTimer <= 0) {
            plat.broken = false;
            plat.crumbleTimer = 0;
          }
        } else if (plat.crumbleTimer > 0) {
          plat.crumbleTimer--;
          if (plat.crumbleTimer <= 0) {
            plat.broken = true;
            plat.respawnTimer = 150;
            this.spawnParticles(plat.x + plat.w / 2, plat.y + 8, '#c2a378', 10);
          }
        }
      }
    }

    // Carry player if standing on a moving platform
    if (p.onGround && p.standingPlat) {
      p.x += p.standingPlat.dx || 0;
      p.y += p.standingPlat.dy || 0;
    }

    // Forward Evade Dash (Shift / V)
    const dashPressed = this.justPressed['ShiftLeft'] || this.justPressed['ShiftRight'] || this.justPressed['KeyV'];
    if (dashPressed && p.dashCooldown <= 0) {
      p.dashTimer = 10;
      p.dashCooldown = 45;
      p.invulnTimer = Math.max(p.invulnTimer, 14);
      if (p.vy > 0) p.vy = 0;
      window.soundEngine.dash();
      this.spawnParticles(p.x + p.w / 2, p.y + p.h / 2, '#64f5ff', 8);
    }

    // Horizontal Movement (preserve knockback velocity while knockbackTimer > 0)
    const moveLeft = this.keys['ArrowLeft'] || this.keys['KeyA'];
    const moveRight = this.keys['ArrowRight'] || this.keys['KeyD'];
    const speedBoost = (p.speedTimer > 0 ? 1.28 : 1.0) * (p.furyTimer > 0 ? 1.15 : 1.0);
    const speed = hero.speed * speedBoost;

    if (p.dashTimer > 0) {
      p.vx = p.facing * 10.8;
    } else if (p.knockbackTimer > 0) {
      p.knockbackTimer--;
      p.vx *= 0.92;
    } else if (moveLeft) {
      p.vx = -speed;
      p.facing = -1;
    } else if (moveRight) {
      p.vx = speed;
      p.facing = 1;
    } else {
      p.vx *= 0.72;
      if (Math.abs(p.vx) < 0.2) p.vx = 0;
    }

    // Jump & Double Jump (Uga)
    const jumpPressed = this.justPressed['Space'] || this.justPressed['KeyZ'] || this.justPressed['ArrowUp'] || this.justPressed['KeyW'];
    const jumpHeld = this.keys['Space'] || this.keys['KeyZ'] || this.keys['ArrowUp'] || this.keys['KeyW'];
    const jumpPower = hero.jumpForce * (p.speedTimer > 0 ? 1.12 : 1.0);

    if (jumpPressed) {
      if (p.onGround) {
        p.vy = -jumpPower;
        p.onGround = false;
        p.standingPlat = null;
        p.jumpsLeft = hero.maxJumps - 1;
        window.soundEngine.jump();
        this.spawnParticles(p.x + p.w / 2, p.y + p.h, '#d6c3a5', 6);
      } else if (p.jumpsLeft > 0) {
        p.vy = -jumpPower * 0.92;
        p.jumpsLeft--;
        window.soundEngine.jump();
        this.spawnParticles(p.x + p.w / 2, p.y + p.h, '#64f5ff', 8);
        this.addFloatingText(p.x - 10, p.y - 10, '2단 점프!', '#64f5ff', 28);
      }
    }

    // Melee Weapon Attack (몽둥이 / 창 / 돌망치 / 지팡이)
    const attackPressed = this.justPressed['KeyX'] || this.justPressed['KeyJ'] || this.justPressed['Enter'];
    if (attackPressed && p.attackTimer === 0) {
      p.attackTimer = p.attackDuration;
      p.hasHitThisSwing = false;
      window.soundEngine.clubSwing();
    }

    // Ranged Weapon Throw (돌도끼 / 투창 / 해머 / 화염구)
    const axePressed = this.justPressed['KeyC'] || this.justPressed['KeyK'];
    if (axePressed && p.axeAmmo > 0) {
      p.axeAmmo--;
      window.soundEngine.axeThrow();
      this.projectiles.push({
        type: hero.projType,
        x: p.x + p.w / 2,
        y: p.y + 12,
        vx: p.facing * hero.projSpeed,
        vy: hero.projGravity < 0.1 ? -1.4 : -5.4,
        gravity: hero.projGravity,
        dmg: p.furyTimer > 0 ? 2 : 1,
        rot: 0,
        fromPlayer: true
      });
    }

    // Apply Gravity & Shaman Glide (Tara)
    p.vy += 0.58;
    if (hero.canGlide && jumpHeld && p.vy > 1.9) {
      p.vy = 1.9;
      if (this.time % 5 === 0) {
        this.spawnParticles(p.x + p.w / 2, p.y + p.h, '#d946ef', 1);
      }
    }
    if (p.vy > 14) p.vy = 14;

    p.x += p.vx;
    if (p.x < 0) p.x = 0;
    if (p.x + p.w > this.level.width) p.x = this.level.width - p.w;

    const prevBottom = p.y + p.h;
    p.y += p.vy;
    p.onGround = false;
    p.standingPlat = null;

    // Platform Collisions
    for (const plat of this.platforms) {
      if (plat.type === 'crumble' && plat.broken) continue;
      if (
        p.x + p.w > plat.x + 4 &&
        p.x < plat.x + plat.w - 4 &&
        prevBottom <= plat.y + 16 &&
        p.y + p.h >= plat.y &&
        p.vy >= 0
      ) {
        if (plat.type === 'spring') {
          p.y = plat.y - p.h;
          p.vy = -16.8;
          p.jumpsLeft = hero.maxJumps;
          window.soundEngine.spring();
          this.spawnParticles(plat.x + plat.w / 2, plat.y, '#ff5e1a', 10);
          this.addFloatingText(plat.x, plat.y - 12, 'BOING!', '#4cd964', 30);
        } else {
          p.y = plat.y - p.h;
          p.vy = 0;
          p.onGround = true;
          p.standingPlat = plat;
          p.jumpsLeft = hero.maxJumps;
          if (plat.type === 'crumble' && plat.crumbleTimer === 0) {
            plat.crumbleTimer = 28;
          }
        }
      }
    }

    // Mid-Stage Checkpoint Dolmen Check
    if (this.level.checkpointX && !this.checkpointReached) {
      if (p.x + p.w >= this.level.checkpointX - 30) {
        this.checkpointReached = true;
        p.respawnX = this.level.checkpointX;
        p.respawnY = (this.level.checkpointY || 420) - 80;
        this.addScore(500);
        window.soundEngine.secretFound();
        this.spawnParticles(this.level.checkpointX, (this.level.checkpointY || 420) - 40, '#ffcb5c', 16);
        this.addFloatingText(this.level.checkpointX - 40, (this.level.checkpointY || 420) - 90, '중간 세이브 완료! +500', '#ffcb5c', 55);
      }
    }

    // Fall into pit check
    if (p.y > this.height + 80) {
      p.hp--;
      window.soundEngine.playerHurt();
      if (p.hp <= 0) {
        this.state = 'GAME_OVER';
        this.gameOverTimer = 36;
        window.soundEngine.stopBGM();
        return;
      }
      // Respawn at checkpoint or last safe spot
      p.x = this.checkpointReached ? p.respawnX : Math.max(80, p.x - 200);
      p.y = 180;
      p.vy = 0;
      p.invulnTimer = 85;
      this.addFloatingText(p.x, p.y, '앗! 낙하 주의!', '#ff3b30', 45);
    }

    if (p.invulnTimer > 0) p.invulnTimer--;

    // Club / Spear / Hammer / Staff Attack Hitbox Processing
    if (p.attackTimer > 0) {
      p.attackTimer--;
      if (p.attackTimer === 7 && p.onGround) {
        this.screenShake = hero.groundShockwave ? 10 : 6;
        window.soundEngine.groundSlam();
        const hitX = p.facing === 1 ? p.x + p.w + 22 : p.x - 22;
        this.spawnParticles(hitX, p.y + p.h, hero.groundShockwave ? '#ff881a' : '#d6b27c', hero.groundShockwave ? 14 : 8);

        // Brok's Ground Shockwave stuns nearby enemies
        if (hero.groundShockwave) {
          for (const enemy of this.enemies) {
            if (Math.abs((enemy.x + enemy.w / 2) - (p.x + p.w / 2)) < 145 && Math.abs(enemy.y - p.y) < 70) {
              enemy.stunTimer = Math.max(enemy.stunTimer, 40);
            }
          }
        }
      }

      if (!p.hasHitThisSwing && p.attackTimer <= 11 && p.attackTimer >= 3) {
        const reach = hero.clubReach;
        const clubBox = {
          x: p.facing === 1 ? p.x + p.w - 6 : p.x - reach + 6,
          y: p.y - 12,
          w: reach,
          h: p.h + 20
        };
        const meleeDmg = hero.attackDmg * (p.furyTimer > 0 ? 2 : 1);
        const bossMeleeDmg = hero.bossDmg * (p.furyTimer > 0 ? 2 : 1);

        // 1. Check Secret Smashable Spots
        for (const spot of this.secretSpots) {
          if (!spot.depleted && this.rectsOverlap(clubBox, spot)) {
            p.hasHitThisSwing = true;
            spot.hitTimer = 12;
            const hitsToPop = hero.oneHitChest ? spot.hitsLeft : 1;
            this.screenShake = 8;
            window.soundEngine.secretFound();

            for (let h = 0; h < hitsToPop; h++) {
              spot.hitsLeft--;
              const rewardEmoji = spot.rewards[spot.hitsLeft] || '🍖';
              this.foods.push({
                x: spot.x + 10 + h * 10,
                y: spot.y - 10,
                emoji: rewardEmoji,
                food: rewardEmoji === '🪓' ? 5 : rewardEmoji === '👑' ? 35 : 25,
                score: rewardEmoji === '👑' ? 1500 : 400,
                axeAmmo: rewardEmoji === '🪓' ? 5 : rewardEmoji === '👑' ? 2 : 0,
                heal: rewardEmoji === '❤️' ? 1 : 0,
                vx: (Math.random() - 0.5) * 5,
                vy: -7.5 - h * 1.2,
                bouncing: true
              });
            }

            this.addFloatingText(spot.x, spot.y - 20, hero.oneHitChest ? '괴력 분쇄! 보물 대방출!' : '숨겨진 보물 발견!', '#4cd964', 50);
            this.spawnParticles(spot.x + spot.w / 2, spot.y + spot.h / 2, '#ffae00', 14);

            if (spot.hitsLeft <= 0) {
              spot.depleted = true;
            }
          }
        }

        // 2. Check Enemies
        for (const enemy of this.enemies) {
          if (this.rectsOverlap(clubBox, enemy)) {
            p.hasHitThisSwing = true;
            this.damageEnemy(enemy, meleeDmg, p.facing);
          }
        }

        // 3. Check Boss
        if (this.boss && this.boss.hp > 0 && this.rectsOverlap(clubBox, this.boss)) {
          p.hasHitThisSwing = true;
          this.damageBoss(bossMeleeDmg, p.facing);
        }
      }
    }

    // Update Secret Spots
    for (const spot of this.secretSpots) {
      if (spot.hitTimer > 0) spot.hitTimer--;
    }

    // Update Projectiles (Stone Axes / Spears / Hammers / Fireballs & Boss Rocks)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx;
      proj.y += proj.vy;
      proj.vy += proj.gravity !== undefined ? proj.gravity : 0.32;
      proj.rot += proj.type === 'spear_proj' ? 0.04 : 0.28;

      if (proj.fromPlayer) {
        const projBox = { x: proj.x - 14, y: proj.y - 14, w: 28, h: 28 };
        let hit = false;
        const pDmg = proj.dmg || 1;
        for (const enemy of this.enemies) {
          if (this.rectsOverlap(projBox, enemy)) {
            this.damageEnemy(enemy, pDmg, Math.sign(proj.vx));
            hit = true;
            break;
          }
        }
        if (!hit && this.boss && this.boss.hp > 0 && this.rectsOverlap(projBox, this.boss)) {
          this.damageBoss(pDmg, Math.sign(proj.vx));
          hit = true;
        }
        if (hit || proj.y > this.height + 40 || proj.x < this.cameraX - 80 || proj.x > this.cameraX + this.width + 120) {
          this.projectiles.splice(i, 1);
        }
      } else {
        // Boss shockwave rock
        const projBox = { x: proj.x - 12, y: proj.y - 12, w: 24, h: 24 };
        if (this.rectsOverlap(projBox, p)) {
          this.hurtPlayer(proj.x);
          this.projectiles.splice(i, 1);
        } else if (proj.y > this.height + 40 || proj.x < 0 || proj.x > this.level.width) {
          this.projectiles.splice(i, 1);
        }
      }
    }

    // Update Foods & Power-Up Relics Pickup
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const item = this.foods[i];

      // Magnetic Totem Attraction
      if (p.magnetTimer > 0) {
        const dx = (p.x + p.w / 2) - (item.x + 16);
        const dy = (p.y + p.h / 2) - (item.y + 16);
        const dist = Math.hypot(dx, dy);
        if (dist < 250 && dist > 4) {
          item.x += (dx / dist) * 6.5;
          item.y += (dy / dist) * 6.5;
        }
      }

      if (item.bouncing) {
        item.x += item.vx;
        item.y += item.vy;
        item.vy += 0.42;
        for (const plat of this.platforms) {
          if (plat.type === 'crumble' && plat.broken) continue;
          if (
            item.x + 24 > plat.x &&
            item.x < plat.x + plat.w &&
            item.y + 32 >= plat.y &&
            item.y + 32 <= plat.y + 18 &&
            item.vy > 0
          ) {
            item.y = plat.y - 32;
            item.vy = 0;
            item.vx = 0;
            item.bouncing = false;
          }
        }
      }

      const itemBox = { x: item.x, y: item.y, w: 32, h: 32 };
      if (this.rectsOverlap(p, itemBox)) {
        const em = item.emoji;
        const foodGain = Math.round((item.food || 15) * hero.foodBonus);
        p.food = Math.min(p.foodGoal, p.food + foodGain);

        if (em === '🌶️' || em === '🌶') {
          p.furyTimer = 480;
          window.soundEngine.powerup();
          this.addFloatingText(item.x, item.y, '🌶️ 화염 광폭화! (8초간 공격력 2배)', '#ff591a', 55);
        } else if (em === '🛡️' || em === '🛡') {
          p.hasShield = true;
          window.soundEngine.powerup();
          this.addFloatingText(item.x, item.y, '🛡️ 거북 등껍질 보호막 장착!', '#64f5ff', 55);
        } else if (em === '🧲') {
          p.magnetTimer = 600;
          window.soundEngine.powerup();
          this.addFloatingText(item.x, item.y, '🧲 자석 토템 발동! (아이템 자동 흡입)', '#ff73b3', 55);
        } else if (em === '⚡') {
          p.speedTimer = 600;
          window.soundEngine.powerup();
          this.addFloatingText(item.x, item.y, '⚡ 번개 깃털! (초고속 질주 & 점프 강화)', '#ffe666', 55);
        } else if (em === '💣') {
          window.soundEngine.explosion();
          this.screenShake = 16;
          this.spawnParticles(item.x + 16, item.y + 16, '#ff591a', 26);
          this.addFloatingText(item.x - 20, item.y - 10, '💣 화산 폭탄 대폭발! 광역 데미지!', '#ff591a', 60);
          for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
            const en = this.enemies[ei];
            if (Math.abs(en.x - p.x) < 380) {
              this.damageEnemy(en, 3, Math.sign(en.x - p.x) || 1);
            }
          }
          if (this.boss && this.boss.hp > 0 && Math.abs(this.boss.x - p.x) < 460) {
            this.damageBoss(3, p.facing);
          }
        } else if (em === '👑') {
          window.soundEngine.powerup();
          p.axeAmmo += 2;
          this.addFloatingText(item.x, item.y, '👑 전설의 황금 공룡 알! +1500', '#ffd859', 60);
        } else if (item.axeAmmo) {
          window.soundEngine.foodEat();
          p.axeAmmo += item.axeAmmo;
          this.addFloatingText(item.x, item.y, `원거리 무기 +${item.axeAmmo}!`, '#ffd166');
        } else if (item.heal) {
          window.soundEngine.foodEat();
          p.hp = Math.min(p.maxHp, p.hp + item.heal);
          this.addFloatingText(item.x, item.y, '체력 회복!', '#ff4d6d');
        } else {
          window.soundEngine.foodEat();
          const pts = this.addScore(item.score || 200, true);
          this.addFloatingText(item.x, item.y, `냠냠! +${pts}`, '#ffae00');
        }
        if (em === '🌶️' || em === '🛡️' || em === '🧲' || em === '⚡' || em === '💣' || em === '👑' || item.axeAmmo || item.heal) {
          this.addScore(item.score || 400, true);
        }
        this.spawnParticles(item.x + 16, item.y + 16, '#ffcf40', 8);
        this.foods.splice(i, 1);
      }
    }

    // Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.stunTimer > 0) {
        e.stunTimer--;
        continue;
      }
      e.x += e.vx;
      if (e.x <= e.minX) {
        e.x = e.minX;
        e.vx = Math.abs(e.speed);
      } else if (e.x + e.w >= e.maxX) {
        e.x = e.maxX - e.w;
        e.vx = -Math.abs(e.speed);
      }

      if (e.type === 'ptero') {
        e.y = e.baseY + Math.sin(this.time * 0.06 + e.x * 0.01) * 28;
      }

      if (this.rectsOverlap(p, e)) {
        if (p.vy > 1 && p.y + p.h - p.vy <= e.y + 14) {
          p.vy = -10.5;
          this.damageEnemy(e, 1, p.facing);
        } else {
          this.hurtPlayer(e.x + e.w / 2);
        }
      }
    }

    // Update Boss (Stage 4 Mid-Boss & Stage 6 Final Boss)
    if (this.boss && this.boss.hp > 0) {
      const b = this.boss;
      if (b.hurtTimer > 0) b.hurtTimer--;
      if (b.stunTimer > 0) {
        b.stunTimer--;
      } else {
        b.x += b.vx;
      }

      if (b.x <= b.minX) {
        b.x = b.minX;
        b.vx = Math.abs(b.vx);
        b.facing = 1;
      } else if (b.x + b.w >= b.maxX) {
        b.x = b.maxX - b.w;
        b.vx = -Math.abs(b.vx);
        b.facing = -1;
      }

      // Boss Jump & Ground Slam Shockwave
      if (b.stunTimer <= 0) b.actionTimer--;
      if (b.actionTimer <= 0 && b.onGround && b.stunTimer <= 0) {
        b.vy = -12.5;
        b.onGround = false;
        b.actionTimer = b.enraged ? 95 : 135;
        window.soundEngine.bossRoar();
      }

      if (!b.onGround) {
        b.y += b.vy;
        b.vy += 0.52;
        if (b.y + b.h >= 420) {
          b.y = 420 - b.h;
          b.vy = 0;
          b.onGround = true;
          this.screenShake = 14;
          window.soundEngine.groundSlam();
          this.spawnParticles(b.x + b.w / 2, 420, '#ff5e1a', 20);

          // Spawn shockwave rocks left and right with high arc so melee players can react
          const rType = b.rockType || 'rock';
          this.projectiles.push(
            { type: rType, x: b.x - 10, y: 392, vx: -5.8, vy: -5.2, rot: 0, fromPlayer: false },
            { type: rType, x: b.x + b.w + 10, y: 392, vx: 5.8, vy: -5.2, rot: 0, fromPlayer: false }
          );
        }
      }

      // Forgiving inner hurtbox for boss contact + head stomp support
      const bossHurtBox = {
        x: b.x + 18,
        y: b.y + 14,
        w: Math.max(40, b.w - 36),
        h: Math.max(40, b.h - 14)
      };
      if (this.rectsOverlap(p, bossHurtBox)) {
        if (p.vy > 1 && p.y + p.h - p.vy <= b.y + 28) {
          p.vy = -11.8;
          this.damageBoss(1, p.facing);
        } else if (b.stunTimer <= 0) {
          this.hurtPlayer(b.x + b.w / 2);
        }
      }
    }

    // Check Stage Exit Dolmen (고인돌 출구)
    const exitBox = { x: this.level.exitX - 45, y: this.level.exitY - 95, w: 90, h: 95 };
    const bossDefeated = !this.boss || this.boss.hp <= 0;
    if (this.rectsOverlap(p, exitBox) && bossDefeated) {
      if (p.food >= p.foodGoal * 0.5) {
        this.addScore(1500);
        window.soundEngine.stageClear();
        if (this.currentStageIdx + 1 < window.LEVELS.length) {
          this.state = 'STAGE_CLEAR';
          window.soundEngine.stopBGM();
        } else {
          this.state = 'VICTORY';
          window.soundEngine.stopBGM();
        }
      } else if (this.time % 45 === 0) {
        this.addFloatingText(p.x, p.y - 20, '음식을 50% 이상 먹고 오세요!', '#ff3b30', 40);
      }
    }

    // Update Particles & Floating Text
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.25;
      pt.life--;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 1.1;
      ft.life--;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    // Smooth Camera Follow
    const targetCam = p.x - this.width * 0.36;
    this.cameraX += (targetCam - this.cameraX) * 0.12;
    this.cameraX = Math.max(0, Math.min(this.level.width - this.width, this.cameraX));

    this.justPressed = {};
  }

  damageEnemy(enemy, dmg, dir) {
    enemy.hp -= dmg;
    enemy.stunTimer = 22;
    enemy.x += dir * 16;
    window.soundEngine.enemyBonk();
    this.screenShake = 6;
    this.spawnParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#ffae00', 12);

    if (enemy.hp <= 0) {
      const pts = this.addScore(500, true);
      this.addFloatingText(enemy.x, enemy.y, `쿵! BONK! +${pts}`, '#4cd964', 45);
      this.foods.push({
        x: enemy.x,
        y: enemy.y - 10,
        emoji: '🍖',
        food: 20,
        score: 300,
        vx: (Math.random() - 0.5) * 4,
        vy: -6,
        bouncing: true
      });
      const idx = this.enemies.indexOf(enemy);
      if (idx !== -1) this.enemies.splice(idx, 1);
    } else {
      this.addFloatingText(enemy.x, enemy.y, '퍽! HIT!', '#ffcf40', 30);
    }
  }

  damageBoss(dmg, dir = 0) {
    const b = this.boss;
    if (!b || b.hurtTimer > 0) return;
    b.hp -= dmg;
    b.hurtTimer = 14;
    if (dmg >= 2) {
      b.stunTimer = 20;
      const pushDir = dir || (this.player && this.player.x < b.x + b.w / 2 ? 1 : -1);
      b.x = Math.max(b.minX, Math.min(b.maxX - b.w, b.x + pushDir * 24));
    }
    this.screenShake = 9;
    window.soundEngine.enemyBonk();
    this.spawnParticles(b.x + b.w / 2, b.y + b.h / 2, '#ff5e1a', 16);
    this.addScore(350);
    this.addFloatingText(b.x + 20, b.y, `CRITICAL! -${dmg}`, '#ffcf40', 35);

    if (b.hp <= b.maxHp / 2 && !b.enraged) {
      b.enraged = true;
      b.vx = Math.sign(b.vx) * 3.1;
      b.stunTimer = Math.max(b.stunTimer, 24);
      window.soundEngine.bossRoar();
      this.addFloatingText(b.x, b.y - 25, '맘모스 분노 모드 발동!', '#ff3b30', 65);
    }

    if (b.hp <= 0) {
      window.soundEngine.stageClear();
      this.addScore(5000);
      this.addFloatingText(b.x, b.y - 30, '보스 격파! 황금 고기가 쏟아집니다!', '#4cd964', 90);
      for (let i = 0; i < 6; i++) {
        this.foods.push({
          x: b.x + i * 18,
          y: b.y,
          emoji: i % 2 === 0 ? '🍖' : '🍔',
          food: 30,
          score: 600,
          vx: (i - 2.5) * 3,
          vy: -8 - Math.random() * 4,
          bouncing: true
        });
      }
    }
  }

  hurtPlayer(sourceX = null) {
    const p = this.player;
    if (p.invulnTimer > 0) return;
    if (p.hasShield) {
      p.hasShield = false;
      p.invulnTimer = 65;
      p.knockbackTimer = 10;
      p.vy = -6.0;
      const kbDir = sourceX !== null ? (p.x + p.w / 2 < sourceX ? -1 : 1) : -p.facing;
      p.vx = kbDir * 5.2;
      this.screenShake = 7;
      window.soundEngine.shieldBlock();
      this.spawnParticles(p.x + p.w / 2, p.y + p.h / 2, '#64f5ff', 16);
      this.addFloatingText(p.x - 10, p.y - 12, '🛡️ 등껍질 방패로 완전 방어!', '#64f5ff', 45);
      return;
    }
    p.hp--;
    this.comboCount = 0;
    this.comboTimer = 0;
    p.invulnTimer = 85;
    p.knockbackTimer = 14;
    p.vy = -7.2;
    const kbDir = sourceX !== null ? (p.x + p.w / 2 < sourceX ? -1 : 1) : -p.facing;
    p.vx = kbDir * 6.2;
    this.screenShake = 10;
    window.soundEngine.playerHurt();
    this.spawnParticles(p.x + p.w / 2, p.y + p.h / 2, '#ff3b30', 14);
    this.addFloatingText(p.x, p.y - 10, '아야! OUCH!', '#ff3b30', 40);

    if (p.hp <= 0) {
      this.state = 'GAME_OVER';
      this.gameOverTimer = 36;
      window.soundEngine.stopBGM();
    }
  }

  rectsOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();

    if (this.screenShake > 0) {
      const dx = (Math.random() - 0.5) * this.screenShake * 1.6;
      const dy = (Math.random() - 0.5) * this.screenShake * 1.6;
      ctx.translate(dx, dy);
    }

    // 1. Parallax Prehistoric Background
    window.SpriteRenderer.drawBackground(
      ctx,
      this.cameraX,
      this.width,
      this.height,
      this.level ? this.level.theme : 'jungle',
      this.time
    );

    // 2. World Layer
    ctx.save();
    ctx.translate(-Math.floor(this.cameraX), 0);

    // Start Marker Dolmen, Mid-Stage Checkpoint Dolmen & Exit Dolmen
    window.SpriteRenderer.drawDolmen(ctx, this.level.startX + 20, 420, 0.72, 'START');

    if (this.level.checkpointX) {
      window.SpriteRenderer.drawDolmen(
        ctx,
        this.level.checkpointX,
        this.level.checkpointY || 420,
        0.78,
        this.checkpointReached ? 'CHECKPOINT ON' : 'CHECKPOINT'
      );
    }

    const canExit = (!this.boss || this.boss.hp <= 0) && this.player.food >= this.player.foodGoal * 0.5;
    window.SpriteRenderer.drawDolmen(
      ctx,
      this.level.exitX,
      this.level.exitY,
      1.05,
      canExit ? '★ EXIT OPEN ★' : '고인돌 관문'
    );

    // Platforms
    for (const plat of this.platforms) {
      window.SpriteRenderer.drawPlatform(ctx, plat, this.level.theme);
    }

    // Secret Smashable Rocks
    for (const spot of this.secretSpots) {
      window.SpriteRenderer.drawSecretSpot(ctx, spot, this.time, this.level.theme);
    }

    // Foods
    for (const item of this.foods) {
      window.SpriteRenderer.drawFood(ctx, item, this.time);
    }

    // Enemies
    for (const enemy of this.enemies) {
      window.SpriteRenderer.drawEnemy(ctx, enemy, this.time);
    }

    // Boss
    if (this.boss && this.boss.hp > 0) {
      window.SpriteRenderer.drawBoss(ctx, this.boss, this.time);
    }

    // Projectiles (Stone Axes & Boss Rocks)
    for (const proj of this.projectiles) {
      ctx.save();
      ctx.translate(proj.x, proj.y);
      ctx.rotate(proj.rot);
      const icon = window.PixelAssets.items[proj.type] || window.PixelAssets.items.rock;
      window.PixelAssets.draw(ctx, icon, -16, -16, 32, 32);
      ctx.restore();
    }

    // Caveman Player
    if (this.player) {
      window.SpriteRenderer.drawCaveman(ctx, this.player, this.time);
    }

    // Particles
    for (const pt of this.particles) {
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    }

    // Floating Popups
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.font = 'bold 14px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#000';
      ctx.fillText(ft.text, ft.x + 2, ft.y + 2);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();

    // 3. Top Retro HUD Bar
    this.drawHUD(ctx);

    // 4. Overlay Screens (TITLE, STAGE_CLEAR, GAME_OVER, VICTORY, PAUSED)
    if (this.state !== 'PLAYING') {
      this.drawOverlay(ctx);
    }

    ctx.restore();
  }

  drawHUD(ctx) {
    const p = this.player;
    ctx.save();
    ctx.fillStyle = 'rgba(16, 11, 7, 0.84)';
    ctx.fillRect(0, 0, this.width, 54);
    ctx.strokeStyle = '#6e6252';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 54);
    ctx.lineTo(this.width, 54);
    ctx.stroke();

    ctx.font = '13px "Press Start 2P", "DungGeunMo", monospace';
    ctx.fillStyle = '#f7efe2';

    // Pixel icons and a carved stone food gauge.
    const assets = window.PixelAssets;
    const hero = this.getHeroConfig();
    ctx.fillStyle = '#f7efe2';
    ctx.fillText('HP', 16, 23);
    for (let i = 0; i < p.maxHp; i++) {
      assets.draw(ctx, assets.items[i < p.hp ? 'heart' : 'emptyHeart'], 44 + i * 22, 4, 21, 21);
    }
    const projIcon = assets.items[hero.projType] || assets.items.axe;
    assets.draw(ctx, projIcon, 16, 27, 24, 24);
    ctx.fillStyle = '#ffd166';
    ctx.fillText(`x${p.axeAmmo}`, 44, 45);
    ctx.fillStyle = '#64f5ff';
    ctx.fillText(`[${hero.name}]`, 88, 45);

    const pct = Math.min(100, Math.round((p.food / p.foodGoal) * 100));
    assets.draw(ctx, assets.items.meat, 210, 1, 25, 25);
    ctx.fillStyle = '#ffae00';
    ctx.fillText(`식량 게이지 (${pct}%)`, 239, 22);
    ctx.fillStyle = '#17120f';
    ctx.fillRect(219, 28, 232, 18);
    ctx.fillStyle = '#827663';
    ctx.fillRect(221, 30, 228, 14);
    ctx.fillStyle = '#33271d';
    ctx.fillRect(224, 32, 222, 10);
    ctx.fillStyle = pct >= 50 ? '#6ab950' : '#e58e2c';
    ctx.fillRect(224, 32, (222 * pct) / 100, 10);
    ctx.fillStyle = '#b5a58a';
    ctx.fillRect(222, 30, 3, 3);
    ctx.fillRect(445, 30, 3, 3);

    // Stage & Score
    ctx.fillStyle = '#f7efe2';
    ctx.fillText(`STAGE ${this.currentStageIdx + 1}/${window.LEVELS.length}`, 478, 23);
    ctx.fillStyle = '#b8a993';
    ctx.fillText(pct >= 50 ? '출구 개방 완료!' : '50% 이상 채우세요', 478, 44);

    // Active Combo & Buff Status Badges below HUD bar
    if (this.comboCount >= 2 && this.comboTimer > 0) {
      const mult = 1 + Math.min(2.0, Math.floor(this.comboCount / 3) * 0.5);
      ctx.fillStyle = '#ff591a';
      ctx.fillText(`🔥 ${this.comboCount} COMBO! (${mult.toFixed(1)}x)`, 655, 23);
    }
    const activeBuffs = [];
    if (p.hasShield) activeBuffs.push('🛡️방패');
    if (p.furyTimer > 0) activeBuffs.push(`🌶️광폭(${Math.ceil(p.furyTimer / 60)}s)`);
    if (p.speedTimer > 0) activeBuffs.push(`⚡신속(${Math.ceil(p.speedTimer / 60)}s)`);
    if (p.magnetTimer > 0) activeBuffs.push(`🧲자석(${Math.ceil(p.magnetTimer / 60)}s)`);
    if (activeBuffs.length > 0) {
      ctx.fillStyle = '#64f5ff';
      ctx.fillText(activeBuffs.join(' '), 655, 44);
    }

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffcf40';
    ctx.fillText(`SCORE ${String(this.score).padStart(6, '0')}`, this.width - 20, 23);
    ctx.fillStyle = '#a39581';
    ctx.fillText(`HI ${String(this.highScore).padStart(6, '0')}`, this.width - 20, 44);

    // Boss HP Bar if Stage has Boss
    if (this.boss && this.boss.hp > 0) {
      const bw = 420;
      const bx = (this.width - bw) / 2;
      const by = 68;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff3b30';
      ctx.fillText(this.boss.name, this.width / 2, by);
      ctx.fillStyle = '#220909';
      ctx.fillRect(bx, by + 6, bw, 14);
      ctx.fillStyle = '#ff3b30';
      ctx.fillRect(bx + 2, by + 8, ((bw - 4) * this.boss.hp) / this.boss.maxHp, 10);
      ctx.strokeStyle = '#ffae00';
      ctx.strokeRect(bx, by + 6, bw, 14);
    }

    ctx.restore();
  }

  drawOverlay(ctx) {
    ctx.save();
    if (this.state === 'TITLE') {
      const hero = window.PixelAssets.images.hero;
      ctx.fillStyle = '#1d1712';
      ctx.fillRect(0, 0, this.width, this.height);
      if (hero && hero.complete && hero.naturalWidth) {
        const scale = Math.max(this.width / hero.naturalWidth, this.height / hero.naturalHeight);
        const w = hero.naturalWidth * scale;
        const h = hero.naturalHeight * scale;
        ctx.drawImage(hero, (this.width - w) / 2, (this.height - h) / 2, w, h);
      }
      const shade = ctx.createLinearGradient(0, 0, 0, this.height);
      shade.addColorStop(0, 'rgba(20,14,10,0.65)');
      shade.addColorStop(0.45, 'rgba(20,14,10,0.08)');
      shade.addColorStop(0.72, 'rgba(20,14,10,0.65)');
      shade.addColorStop(1, 'rgba(20,14,10,0.94)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.textAlign = 'center';
      ctx.shadowColor = '#1a100b';
      ctx.shadowOffsetY = 4;
      ctx.shadowBlur = 0;
      ctx.font = 'bold 36px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#ffcb5c';
      ctx.fillText('STONE AGE ODYSSEY', this.width / 2, 76);
      ctx.font = '15px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#f7efe2';
      ctx.fillText('고인돌 (PREHISTORIK) · 8개 스테이지 & 4인의 영웅 원시 대모험', this.width / 2, 111);
      ctx.font = '13px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillText('이동: ← → / 점프: SPACE / 공격: X / 원거리: C / 대시: V·SHIFT / 영웅: 1~4', this.width / 2, this.height - 72);
      if (Math.floor(this.time / 25) % 2 === 0) {
        ctx.fillStyle = '#ffe090';
        ctx.font = 'bold 16px "Press Start 2P", "DungGeunMo", monospace';
        ctx.fillText('CLICK OR PRESS SPACE / ENTER TO START', this.width / 2, this.height - 35);
      }
      ctx.restore();
      return;
    }
    ctx.fillStyle = 'rgba(10, 7, 4, 0.78)';
    ctx.fillRect(0, 0, this.width, this.height);

    // Center Stone Tablet Modal
    const mw = 620;
    const mh = 340;
    const mx = (this.width - mw) / 2;
    const my = (this.height - mh) / 2;

    ctx.fillStyle = '#261d14';
    ctx.strokeStyle = '#a39581';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(mx, my, mw, mh, 14);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';

    if (this.state === 'STAGE_CLEAR') {
      ctx.font = 'bold 30px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#4cd964';
      ctx.fillText(`STAGE ${this.currentStageIdx + 1} CLEAR!`, this.width / 2, my + 95);

      ctx.font = '16px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#f7efe2';
      ctx.fillText(`든든하게 배를 채우고 고인돌 관문을 통과했습니다!`, this.width / 2, my + 155);
      ctx.fillStyle = '#ffcf40';
      ctx.fillText(`현재 점수: ${this.score} PTS`, this.width / 2, my + 195);

      ctx.fillStyle = '#ffae00';
      ctx.fillText('▶ PRESS [SPACE / ENTER] OR CLICK FOR NEXT STAGE ◀', this.width / 2, my + 265);
    } else if (this.state === 'VICTORY') {
      ctx.font = 'bold 28px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#ffae00';
      ctx.fillText('ALL 8 STAGES CLEARED!', this.width / 2, my + 85);

      ctx.font = '15px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#f7efe2';
      ctx.fillText('거대 맘모스 대왕을 물리치고 부족의 식량을 지켰습니다!', this.width / 2, my + 140);

      ctx.fillStyle = '#4cd964';
      ctx.font = 'bold 20px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillText(`FINAL SCORE: ${this.score} PTS`, this.width / 2, my + 195);

      ctx.fillStyle = '#ffd166';
      ctx.font = '15px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillText('▶ PRESS [SPACE / ENTER] OR CLICK TO PLAY AGAIN ◀', this.width / 2, my + 270);
    } else if (this.state === 'GAME_OVER') {
      ctx.font = 'bold 32px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#ff3b30';
      ctx.fillText('GAME OVER', this.width / 2, my + 100);

      ctx.font = '15px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#f7efe2';
      ctx.fillText(
        this.checkpointReached
          ? `STAGE ${this.currentStageIdx + 1} 체크포인트에서 다시 도전할 수 있습니다!`
          : `STAGE ${this.currentStageIdx + 1} 시작 지점에서 다시 도전할 수 있습니다!`,
        this.width / 2,
        my + 155
      );
      ctx.fillStyle = '#ffcf40';
      ctx.fillText(`SCORE: ${this.score} PTS`, this.width / 2, my + 195);

      ctx.fillStyle = '#4cd964';
      ctx.fillText('▶ PRESS [SPACE / ENTER] OR CLICK TO RETRY STAGE ◀', this.width / 2, my + 265);
    } else if (this.state === 'PAUSED') {
      ctx.font = 'bold 30px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#ffae00';
      ctx.fillText('PAUSED (일시정지)', this.width / 2, my + 145);
      ctx.font = '15px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#f7efe2';
      ctx.fillText('PRESS [P] OR [ESC] TO RESUME', this.width / 2, my + 205);
    }

    ctx.restore();
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new GoindolGame('gameCanvas');
  window.goindolGame = game;

  // Bind UI Topbar Controls
  const btnSound = document.getElementById('btnToggleSound');
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      btnSound.blur();
      const muted = window.soundEngine.toggleMute();
      btnSound.textContent = muted ? '사운드 OFF' : '사운드 ON';
      btnSound.classList.toggle('active', !muted);
    });
  }

  const btnCRT = document.getElementById('btnToggleCRT');
  const crtOverlay = document.getElementById('crtOverlay');
  if (btnCRT && crtOverlay) {
    btnCRT.addEventListener('click', () => {
      btnCRT.blur();
      crtOverlay.classList.toggle('hidden');
      const isOn = !crtOverlay.classList.contains('hidden');
      btnCRT.textContent = isOn ? 'CRT 필터 ON' : 'CRT 필터 OFF';
      btnCRT.classList.toggle('active', isOn);
    });
  }

  const btnRestart = document.getElementById('btnRestart');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      btnRestart.blur();
      game.retryCurrentStage();
    });
  }

  const btnFullscreen = document.getElementById('btnFullscreen');
  const screenWrapper = document.querySelector('.screen-wrapper');
  if (btnFullscreen && screenWrapper) {
    btnFullscreen.addEventListener('click', () => {
      btnFullscreen.blur();
      if (!document.fullscreenElement) {
        screenWrapper.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Stage quick jump buttons
  document.querySelectorAll('[data-stage-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.blur();
      const idx = Number(btn.getAttribute('data-stage-btn'));
      game.loadStage(idx, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Hero selector buttons
  document.querySelectorAll('[data-hero-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.blur();
      const heroId = btn.getAttribute('data-hero-btn');
      game.selectHero(heroId);
    });
  });
});
