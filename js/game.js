/**
 * Goindol (Prehistorik) Main Game Engine
 * 60fps Arcade Platformer with 6 Stages, Moving Platforms, Checkpoints,
 * Club Smash, Secret Food Spots, Stone Axe Throw & Boss Battles
 */
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
    this.score = 0;
    this.highScore = Number(localStorage.getItem('goindol_highscore') || 12500);
    this.time = 0;
    this.screenShake = 0;

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

  bindInput() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
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
      } else if ((this.state === 'GAME_OVER' || this.state === 'VICTORY') && (e.code === 'Space' || e.code === 'Enter')) {
        this.startNewGame(0);
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
      } else if (this.state === 'GAME_OVER' || this.state === 'VICTORY') {
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
        if (this.state === 'GAME_OVER' || this.state === 'VICTORY') {
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
      dy: 0
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
        actionTimer: 90,
        enraged: false,
        onGround: true
      };
    } else {
      this.boss = null;
    }

    this.checkpointReached = false;

    this.player = {
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
      hp: 5,
      maxHp: 5,
      food: 0,
      foodGoal: this.level.foodGoal,
      axeAmmo: 6,
      attackTimer: 0,
      attackDuration: 15,
      hasHitThisSwing: false,
      invulnTimer: 0
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

  nextStage() {
    if (this.currentStageIdx + 1 < window.LEVELS.length) {
      this.loadStage(this.currentStageIdx + 1, true);
    } else {
      this.state = 'VICTORY';
      window.soundEngine.stopBGM();
      window.soundEngine.stageClear();
    }
  }

  addScore(pts) {
    this.score += pts;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('goindol_highscore', String(this.highScore));
    }
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

    if (this.state !== 'PLAYING') {
      this.justPressed = {};
      return;
    }

    const p = this.player;

    // 0. Update Moving Platforms
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
      }
    }

    // Carry player if standing on a moving platform
    if (p.onGround && p.standingPlat) {
      p.x += p.standingPlat.dx || 0;
      p.y += p.standingPlat.dy || 0;
    }

    // Horizontal Movement
    const moveLeft = this.keys['ArrowLeft'] || this.keys['KeyA'];
    const moveRight = this.keys['ArrowRight'] || this.keys['KeyD'];
    const speed = 4.4;

    if (moveLeft) {
      p.vx = -speed;
      p.facing = -1;
    } else if (moveRight) {
      p.vx = speed;
      p.facing = 1;
    } else {
      p.vx *= 0.72;
      if (Math.abs(p.vx) < 0.2) p.vx = 0;
    }

    // Jump
    const jumpPressed = this.justPressed['Space'] || this.justPressed['KeyZ'] || this.justPressed['ArrowUp'] || this.justPressed['KeyW'];
    if (jumpPressed && p.onGround) {
      p.vy = -12.6;
      p.onGround = false;
      p.standingPlat = null;
      window.soundEngine.jump();
      this.spawnParticles(p.x + p.w / 2, p.y + p.h, '#d6c3a5', 6);
    }

    // Club Attack (몽둥이 내려치기)
    const attackPressed = this.justPressed['KeyX'] || this.justPressed['KeyJ'] || this.justPressed['Enter'];
    if (attackPressed && p.attackTimer === 0) {
      p.attackTimer = p.attackDuration;
      p.hasHitThisSwing = false;
      window.soundEngine.clubSwing();
    }

    // Stone Axe Throw (돌도끼 던지기)
    const axePressed = this.justPressed['KeyC'] || this.justPressed['KeyK'];
    if (axePressed && p.axeAmmo > 0) {
      p.axeAmmo--;
      window.soundEngine.axeThrow();
      this.projectiles.push({
        type: 'axe',
        x: p.x + p.w / 2,
        y: p.y + 12,
        vx: p.facing * 8.5,
        vy: -5.5,
        rot: 0,
        fromPlayer: true
      });
    }

    // Apply Gravity & Move Player
    p.vy += 0.58;
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
          window.soundEngine.spring();
          this.spawnParticles(plat.x + plat.w / 2, plat.y, '#ff5e1a', 10);
          this.addFloatingText(plat.x, plat.y - 12, 'BOING!', '#4cd964', 30);
        } else {
          p.y = plat.y - p.h;
          p.vy = 0;
          p.onGround = true;
          p.standingPlat = plat;
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
        window.soundEngine.stopBGM();
        return;
      }
      // Respawn at checkpoint or last safe spot
      p.x = this.checkpointReached ? p.respawnX : Math.max(80, p.x - 200);
      p.y = 180;
      p.vy = 0;
      p.invulnTimer = 70;
      this.addFloatingText(p.x, p.y, '앗! 낙하 주의!', '#ff3b30', 45);
    }

    if (p.invulnTimer > 0) p.invulnTimer--;

    // Club Attack Hitbox Processing
    if (p.attackTimer > 0) {
      p.attackTimer--;
      if (p.attackTimer === 7 && p.onGround) {
        this.screenShake = 6;
        window.soundEngine.groundSlam();
        const hitX = p.facing === 1 ? p.x + p.w + 22 : p.x - 22;
        this.spawnParticles(hitX, p.y + p.h, '#d6b27c', 8);
      }

      if (!p.hasHitThisSwing && p.attackTimer <= 10 && p.attackTimer >= 4) {
        const clubBox = {
          x: p.facing === 1 ? p.x + p.w - 4 : p.x - 54,
          y: p.y - 10,
          w: 58,
          h: p.h + 18
        };

        // 1. Check Secret Smashable Spots
        for (const spot of this.secretSpots) {
          if (!spot.depleted && this.rectsOverlap(clubBox, spot)) {
            p.hasHitThisSwing = true;
            spot.hitTimer = 12;
            spot.hitsLeft--;
            this.screenShake = 8;
            window.soundEngine.secretFound();

            const rewardEmoji = spot.rewards[spot.hitsLeft] || '🍖';
            this.foods.push({
              x: spot.x + 10,
              y: spot.y - 10,
              emoji: rewardEmoji,
              food: rewardEmoji === '🪓' ? 5 : 25,
              score: 400,
              axeAmmo: rewardEmoji === '🪓' ? 5 : 0,
              heal: rewardEmoji === '❤️' ? 1 : 0,
              vx: (Math.random() - 0.5) * 5,
              vy: -7.5,
              bouncing: true
            });

            this.addFloatingText(spot.x, spot.y - 20, '숨겨진 보물 발견!', '#4cd964', 50);
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
            this.damageEnemy(enemy, 1, p.facing);
          }
        }

        // 3. Check Boss
        if (this.boss && this.boss.hp > 0 && this.rectsOverlap(clubBox, this.boss)) {
          p.hasHitThisSwing = true;
          this.damageBoss(2);
        }
      }
    }

    // Update Secret Spots
    for (const spot of this.secretSpots) {
      if (spot.hitTimer > 0) spot.hitTimer--;
    }

    // Update Projectiles (Stone Axes & Boss Rocks)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx;
      proj.y += proj.vy;
      proj.vy += 0.32;
      proj.rot += 0.28;

      if (proj.fromPlayer) {
        const projBox = { x: proj.x - 12, y: proj.y - 12, w: 24, h: 24 };
        let hit = false;
        for (const enemy of this.enemies) {
          if (this.rectsOverlap(projBox, enemy)) {
            this.damageEnemy(enemy, 1, Math.sign(proj.vx));
            hit = true;
            break;
          }
        }
        if (!hit && this.boss && this.boss.hp > 0 && this.rectsOverlap(projBox, this.boss)) {
          this.damageBoss(1);
          hit = true;
        }
        if (hit || proj.y > this.height + 40) {
          this.projectiles.splice(i, 1);
        }
      } else {
        // Boss shockwave rock
        const projBox = { x: proj.x - 14, y: proj.y - 14, w: 28, h: 28 };
        if (this.rectsOverlap(projBox, p)) {
          this.hurtPlayer();
          this.projectiles.splice(i, 1);
        } else if (proj.y > this.height + 40 || proj.x < 0 || proj.x > this.level.width) {
          this.projectiles.splice(i, 1);
        }
      }
    }

    // Update Foods & Pickup
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const item = this.foods[i];
      if (item.bouncing) {
        item.x += item.vx;
        item.y += item.vy;
        item.vy += 0.42;
        for (const plat of this.platforms) {
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
        window.soundEngine.foodEat();
        p.food = Math.min(p.foodGoal, p.food + (item.food || 15));
        if (item.axeAmmo) {
          p.axeAmmo += item.axeAmmo;
          this.addFloatingText(item.x, item.y, `돌도끼 +${item.axeAmmo}!`, '#ffd166');
        } else if (item.heal) {
          p.hp = Math.min(p.maxHp, p.hp + item.heal);
          this.addFloatingText(item.x, item.y, '체력 회복!', '#ff4d6d');
        } else {
          this.addFloatingText(item.x, item.y, `냠냠! +${item.score}`, '#ffae00');
        }
        this.addScore(item.score || 200);
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
          this.hurtPlayer();
        }
      }
    }

    // Update Boss (Stage 4 Mid-Boss & Stage 6 Final Boss)
    if (this.boss && this.boss.hp > 0) {
      const b = this.boss;
      if (b.hurtTimer > 0) b.hurtTimer--;

      b.x += b.vx;
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
      b.actionTimer--;
      if (b.actionTimer <= 0 && b.onGround) {
        b.vy = -12.5;
        b.onGround = false;
        b.actionTimer = b.enraged ? 80 : 125;
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

          // Spawn shockwave rocks left and right
          this.projectiles.push(
            { type: 'rock', x: b.x, y: 400, vx: -6.5, vy: -3.5, rot: 0, fromPlayer: false },
            { type: 'rock', x: b.x + b.w, y: 400, vx: 6.5, vy: -3.5, rot: 0, fromPlayer: false }
          );
        }
      }

      if (this.rectsOverlap(p, b)) {
        this.hurtPlayer();
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
      this.addScore(500);
      this.addFloatingText(enemy.x, enemy.y, '쿵! BONK! +500', '#4cd964', 45);
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

  damageBoss(dmg) {
    const b = this.boss;
    if (!b || b.hurtTimer > 0) return;
    b.hp -= dmg;
    b.hurtTimer = 14;
    this.screenShake = 9;
    window.soundEngine.enemyBonk();
    this.spawnParticles(b.x + b.w / 2, b.y + b.h / 2, '#ff5e1a', 16);
    this.addScore(350);
    this.addFloatingText(b.x + 20, b.y, `CRITICAL! -${dmg}`, '#ffcf40', 35);

    if (b.hp <= b.maxHp / 2 && !b.enraged) {
      b.enraged = true;
      b.vx = Math.sign(b.vx) * 3.6;
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

  hurtPlayer() {
    const p = this.player;
    if (p.invulnTimer > 0) return;
    p.hp--;
    p.invulnTimer = 65;
    p.vy = -7.5;
    p.vx = -p.facing * 5;
    this.screenShake = 10;
    window.soundEngine.playerHurt();
    this.spawnParticles(p.x + p.w / 2, p.y + p.h / 2, '#ff3b30', 14);
    this.addFloatingText(p.x, p.y - 10, '아야! OUCH!', '#ff3b30', 40);

    if (p.hp <= 0) {
      this.state = 'GAME_OVER';
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
      window.SpriteRenderer.drawSecretSpot(ctx, spot, this.time);
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
      const icon = window.PixelAssets.items[proj.type === 'axe' ? 'axe' : 'rock'];
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
    ctx.fillStyle = '#f7efe2';
    ctx.fillText('HP', 18, 23);
    for (let i = 0; i < p.maxHp; i++) {
      assets.draw(ctx, assets.items[i < p.hp ? 'heart' : 'emptyHeart'], 48 + i * 25, 4, 24, 24);
    }
    assets.draw(ctx, assets.items.axe, 18, 27, 24, 24);
    ctx.fillStyle = '#ffd166';
    ctx.fillText(`x${p.axeAmmo}`, 46, 45);

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
    ctx.fillText(`STAGE ${this.currentStageIdx + 1}/${window.LEVELS.length}`, 490, 23);
    ctx.fillStyle = '#b8a993';
    ctx.fillText(pct >= 50 ? '출구 개방 완료!' : '50% 이상 채우세요', 490, 44);

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
      ctx.font = 'bold 42px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#ffcb5c';
      ctx.fillText('고인돌 : GOINDOL', this.width / 2, 78);
      ctx.font = '15px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillStyle = '#f7efe2';
      ctx.fillText('6개 스테이지 확장판 · 원시인 액션 어드벤처', this.width / 2, 111);
      ctx.font = '13px "Press Start 2P", "DungGeunMo", monospace';
      ctx.fillText('이동: ← → / 점프: SPACE / 몽둥이: X / 돌도끼: C', this.width / 2, this.height - 72);
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
      ctx.fillText('ALL 6 STAGES CLEARED!', this.width / 2, my + 85);

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
      ctx.fillText('배고픈 원시인 샘이 쓰러졌습니다...', this.width / 2, my + 155);
      ctx.fillStyle = '#ffcf40';
      ctx.fillText(`SCORE: ${this.score} PTS`, this.width / 2, my + 195);

      ctx.fillStyle = '#4cd964';
      ctx.fillText('▶ PRESS [SPACE / ENTER] OR CLICK TO RETRY ◀', this.width / 2, my + 265);
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
      const muted = window.soundEngine.toggleMute();
      btnSound.textContent = muted ? '사운드 OFF' : '사운드 ON';
      btnSound.classList.toggle('active', !muted);
    });
  }

  const btnCRT = document.getElementById('btnToggleCRT');
  const crtOverlay = document.getElementById('crtOverlay');
  if (btnCRT && crtOverlay) {
    btnCRT.addEventListener('click', () => {
      crtOverlay.classList.toggle('hidden');
      const isOn = !crtOverlay.classList.contains('hidden');
      btnCRT.textContent = isOn ? 'CRT 필터 ON' : 'CRT 필터 OFF';
      btnCRT.classList.toggle('active', isOn);
    });
  }

  const btnRestart = document.getElementById('btnRestart');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      game.loadStage(game.currentStageIdx, true);
    });
  }

  const btnFullscreen = document.getElementById('btnFullscreen');
  const screenWrapper = document.querySelector('.screen-wrapper');
  if (btnFullscreen && screenWrapper) {
    btnFullscreen.addEventListener('click', () => {
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
      const idx = Number(btn.getAttribute('data-stage-btn'));
      game.loadStage(idx, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
