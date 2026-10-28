/** Canvas renderer backed by the pre-rendered pixel-art atlas. */
const SpriteRenderer = {
  drawBackground(ctx, cameraX, canvasW, canvasH, theme = 'jungle') {
    const image = window.PixelAssets.images[theme] || window.PixelAssets.images.jungle;
    const bgColors = {
      jungle: '#283e38',
      swamp: '#172b28',
      cave: '#21142b',
      ice: '#1b314d',
      volcano: '#2d1210',
      boss: '#35100e'
    };
    ctx.fillStyle = bgColors[theme] || '#283e38';
    ctx.fillRect(0, 0, canvasW, canvasH);
    if (!image || !image.complete || !image.naturalWidth) return;

    // Mirrored repeats meet at the same edge pixels, including while the camera moves.
    const tileW = canvasH * image.naturalWidth / image.naturalHeight;
    const offset = ((cameraX * 0.2) % (tileW * 2) + tileW * 2) % (tileW * 2);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    for (let i = -1; i * tileW - offset < canvasW; i++) {
      const x = i * tileW - offset;
      if (Math.abs(i % 2) === 1) {
        ctx.save();
        ctx.translate(x + tileW, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(image, 0, 0, tileW, canvasH);
        ctx.restore();
      } else {
        ctx.drawImage(image, x, 0, tileW, canvasH);
      }
    }
    ctx.restore();
  },

  drawDolmen(ctx, x, y, scale = 1, label = '고인돌') {
    const state = label === 'START'
      ? 'start'
      : label === 'CHECKPOINT ON'
        ? 'checkpoint'
        : label.includes('OPEN')
          ? 'open'
          : 'closed';
    const sprite = window.PixelAssets.environment.dolmen[state] || window.PixelAssets.environment.dolmen.closed;
    window.PixelAssets.draw(ctx, sprite, x - 64 * scale, y - 112 * scale, 128 * scale, 112 * scale);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `bold ${Math.max(8, Math.round(9 * scale))}px monospace`;
    ctx.fillStyle = state === 'open' ? '#baffdc' : state === 'checkpoint' ? '#ffe082' : '#f0d6a1';
    ctx.fillText(label, x, y - 78 * scale);
    ctx.restore();
  },

  drawPlatform(ctx, plat, theme = 'jungle') {
    const { x, y, w, h, type } = plat;
    const assets = window.PixelAssets;
    if (type === 'spring') {
      const mush = (assets.environment.mushroomByTheme && assets.environment.mushroomByTheme[theme]) || assets.environment.mushroom;
      assets.draw(ctx, mush, x, y, w, h);
      return;
    }
    if (type === 'moving') {
      const movSprite = (assets.environment.movingByTheme && assets.environment.movingByTheme[theme]) || assets.environment.movingByTheme.jungle;
      assets.draw(ctx, movSprite, x, y, w, h);
      return;
    }
    // Clip full tiles rather than stretching a texture at the edges.
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    const tile = assets.tiles[theme] || assets.tiles.jungle;
    ctx.imageSmoothingEnabled = false;
    for (let tx = x; tx < x + w; tx += 32) {
      assets.draw(ctx, tile, tx, y, 32, 32);
      // The upper strip is the ledge surface; repeat only the stone body below it.
      for (let ty = y + 32; ty < y + h; ty += 26) {
        ctx.drawImage(tile, 0, 6, 32, 26, tx, ty, 32, 26);
      }
    }
    ctx.restore();
  },

  drawSecretSpot(ctx, spot, time, theme = 'jungle') {
    if (spot.depleted) return;
    const shake = spot.hitTimer > 0 ? Math.sin(time * 2) * 3 : 0;
    const damage = Math.max(0, Math.min(2, 3 - spot.hitsLeft));
    const totemSet = (window.PixelAssets.environment.totemByTheme && window.PixelAssets.environment.totemByTheme[theme]) || window.PixelAssets.environment.totem;
    window.PixelAssets.draw(ctx, totemSet[damage], spot.x + shake, spot.y, spot.w, spot.h);
  },

  drawCaveman(ctx, player, time) {
    const sam = window.PixelAssets.sprites.sam;
    let frame;
    if (player.attackTimer > 0) {
      frame = player.attackTimer > player.attackDuration * 0.55 ? sam.windup : sam.attack;
    } else if (player.invulnTimer > 0) {
      frame = sam.hurt;
    } else if (!player.onGround) {
      frame = player.vy < 0 ? sam.jump : sam.fall;
    } else if (Math.abs(player.vx) > 0.2) {
      frame = sam.run[Math.floor(time / 6) % sam.run.length];
    } else {
      frame = sam.idle[Math.floor(time / 22) % sam.idle.length];
    }
    ctx.save();
    if (player.invulnTimer > 0 && Math.floor(player.invulnTimer / 3) % 2 === 0) ctx.globalAlpha = 0.5;
    ctx.translate(player.x + player.w / 2, player.y + player.h);
    ctx.scale(player.facing, 1);
    window.PixelAssets.draw(ctx, frame, -48, -94, 112, 98);
    ctx.restore();
  },

  drawEnemy(ctx, enemy, time) {
    const sprites = window.PixelAssets.sprites[enemy.type] || window.PixelAssets.sprites.dino;
    const frames = enemy.type === 'ptero' ? sprites.fly : sprites.walk;
    const frame = enemy.stunTimer > 0 && sprites.stunned ? sprites.stunned : frames[Math.floor(time / 9) % frames.length];
    ctx.save();
    ctx.translate(enemy.x + enemy.w / 2, enemy.y + enemy.h);
    ctx.scale(enemy.vx >= 0 ? 1 : -1, 1);
    window.PixelAssets.draw(ctx, frame, -32, -48, 64, 48);
    ctx.restore();
  },

  drawBoss(ctx, boss, time) {
    if (!boss || boss.hp <= 0) return;
    const spriteKey = boss.spriteType || 'boss';
    const sprites = window.PixelAssets.sprites[spriteKey] || window.PixelAssets.sprites.boss;
    const frames = boss.enraged ? sprites.enraged : sprites.walk;
    const frame = !boss.onGround ? sprites.jump : frames[Math.floor(time / 10) % frames.length];
    ctx.save();
    if (boss.hurtTimer > 0 && Math.floor(boss.hurtTimer / 2) % 2 === 0) ctx.globalAlpha = 0.55;
    ctx.translate(boss.x + boss.w / 2, boss.y + boss.h);
    ctx.scale(boss.facing, 1);
    window.PixelAssets.draw(ctx, frame, -64, -128, 128, 128);
    ctx.restore();
  },

  drawFood(ctx, item, time) {
    const icon = window.PixelAssets.items[item.emoji] || window.PixelAssets.items.meat;
    const bob = Math.round(Math.sin(time * 0.1 + item.x) * 3);
    window.PixelAssets.draw(ctx, icon, item.x, item.y + bob, 32, 32);
  }
};

window.SpriteRenderer = SpriteRenderer;
