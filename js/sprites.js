/**
 * Goindol (Prehistorik) Custom Retro Canvas Renderer
 * Draws parallax prehistoric worlds, Dolmens, Caveman Sam, Dinosaurs, Food, and Bosses
 */
const SpriteRenderer = {
  drawBackground(ctx, cameraX, canvasW, canvasH, theme = 'jungle', time = 0) {
    // Sky Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvasH);
    if (theme === 'jungle') {
      grad.addColorStop(0, '#1e3c58');
      grad.addColorStop(0.55, '#4b7b7c');
      grad.addColorStop(1, '#d89c52');
    } else if (theme === 'cave') {
      grad.addColorStop(0, '#120b1d');
      grad.addColorStop(0.6, '#2b1736');
      grad.addColorStop(1, '#59231a');
    } else {
      // Boss volcano altar
      grad.addColorStop(0, '#1a0707');
      grad.addColorStop(0.5, '#47120e');
      grad.addColorStop(1, '#992b15');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Sun or Moon
    if (theme === 'jungle') {
      ctx.fillStyle = '#ffe07d';
      ctx.beginPath();
      ctx.arc(canvasW - 140 - (cameraX * 0.03), 90, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 224, 125, 0.2)';
      ctx.beginPath();
      ctx.arc(canvasW - 140 - (cameraX * 0.03), 90, 58, 0, Math.PI * 2);
      ctx.fill();
    } else if (theme === 'boss') {
      // Blood Moon & Erupting Volcano
      ctx.fillStyle = '#ff4d29';
      ctx.beginPath();
      ctx.arc(160, 85, 48, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant Mountains & Volcanoes (Parallax 0.15)
    ctx.fillStyle = theme === 'jungle' ? '#2c493e' : (theme === 'cave' ? '#1c1026' : '#2e0b08');
    for (let i = -1; i < 8; i++) {
      const mx = i * 320 - ((cameraX * 0.15) % 320);
      ctx.beginPath();
      ctx.moveTo(mx, canvasH);
      ctx.lineTo(mx + 160, 160 + (i % 2) * 35);
      ctx.lineTo(mx + 320, canvasH);
      ctx.fill();

      // Volcano crater glow on odd peaks
      if (theme !== 'jungle' && i % 2 === 0) {
        ctx.fillStyle = '#ff5500';
        ctx.beginPath();
        ctx.arc(mx + 160, 168 + (i % 2) * 35, 16 + Math.sin(time * 0.08) * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = theme === 'cave' ? '#1c1026' : '#2e0b08';
      }
    }

    // Midground Prehistoric Hills / Trees or Cave Pillars (Parallax 0.35)
    for (let i = -1; i < 10; i++) {
      const hx = i * 240 - ((cameraX * 0.35) % 240);
      if (theme === 'jungle') {
        // Prehistoric Giant Fern Trees
        ctx.fillStyle = '#1b3524';
        ctx.fillRect(hx + 100, canvasH - 220, 18, 160);
        ctx.fillStyle = '#265331';
        ctx.beginPath();
        ctx.arc(hx + 109, canvasH - 220, 48, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(hx + 85, canvasH - 205, 32, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(hx + 135, canvasH - 205, 32, Math.PI, 0);
        ctx.fill();
      } else {
        // Cave Stalactites
        ctx.fillStyle = '#2a1c2e';
        ctx.beginPath();
        ctx.moveTo(hx + 40, 0);
        ctx.lineTo(hx + 75, 130 + (i % 3) * 25);
        ctx.lineTo(hx + 110, 0);
        ctx.fill();
      }
    }
  },

  drawDolmen(ctx, x, y, scale = 1, label = '고인돌') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(-55, -8, 110, 12);

    // Left Support Stone
    ctx.fillStyle = '#6d655a';
    ctx.strokeStyle = '#231f1b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-42, -68, 28, 68, 6);
    ctx.fill();
    ctx.stroke();

    // Right Support Stone
    ctx.beginPath();
    ctx.roundRect(14, -68, 28, 68, 6);
    ctx.fill();
    ctx.stroke();

    // Capstone (덮개돌)
    ctx.fillStyle = '#877d70';
    ctx.beginPath();
    ctx.roundRect(-62, -104, 124, 42, 12);
    ctx.fill();
    ctx.stroke();

    // Stone highlights & moss
    ctx.fillStyle = '#477a3e';
    ctx.fillRect(-50, -104, 38, 7);
    ctx.fillRect(10, -104, 28, 6);

    if (label) {
      ctx.fillStyle = '#ffcf40';
      ctx.font = 'bold 12px "Press Start 2P", "DungGeunMo", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, -78);
    }

    ctx.restore();
  },

  drawPlatform(ctx, plat, theme = 'jungle') {
    const { x, y, w, h, type } = plat;
    ctx.save();

    if (type === 'spring') {
      // Bouncy Prehistoric Mushroom
      ctx.fillStyle = '#d9b382';
      ctx.fillRect(x + w * 0.3, y + 12, w * 0.4, h - 12);
      ctx.fillStyle = '#ff382e';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + 16, w / 2, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // White spots
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + w * 0.35, y + 8, 4, 0, Math.PI * 2);
      ctx.arc(x + w * 0.65, y + 9, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Rock / Earth Base
    ctx.fillStyle = theme === 'jungle' ? '#59412c' : (theme === 'cave' ? '#3d3347' : '#4a251d');
    ctx.strokeStyle = '#1b130c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Stone Texture blocks
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    for (let bx = x + 12; bx < x + w - 20; bx += 36) {
      ctx.fillRect(bx, y + 14, 22, 10);
    }

    // Top Turf / Crust
    ctx.fillStyle = theme === 'jungle' ? '#4ca64c' : (theme === 'cave' ? '#705d85' : '#b84221');
    ctx.beginPath();
    ctx.roundRect(x - 2, y, w + 4, 12, 4);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  },

  drawSecretSpot(ctx, spot, time) {
    if (spot.depleted) return;
    ctx.save();
    const shakeX = spot.hitTimer > 0 ? (Math.random() - 0.5) * 8 : 0;
    ctx.translate(spot.x + shakeX, spot.y);

    // Ancient Totem Rock / Mystery Bush with subtle sparkle
    ctx.fillStyle = '#7c6d58';
    ctx.strokeStyle = '#1a140e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(0, 0, spot.w, spot.h, 10);
    ctx.fill();
    ctx.stroke();

    // Carved Bone/Meat glyph
    ctx.fillStyle = spot.hitTimer > 0 ? '#fff' : '#ffae00';
    ctx.font = '18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🍖?', spot.w / 2, spot.h / 2 + 6);

    // Sparkle hint
    if (Math.floor(time / 20) % 2 === 0) {
      ctx.fillStyle = '#ffe866';
      ctx.fillRect(-4, -4, 6, 6);
      ctx.fillRect(spot.w - 2, 4, 5, 5);
    }
    ctx.restore();
  },

  drawCaveman(ctx, player, time) {
    ctx.save();
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    if (player.invulnTimer > 0 && Math.floor(player.invulnTimer / 3) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }
    ctx.scale(player.facing, 1);

    const walkSwing = player.vx !== 0 && player.onGround ? Math.sin(time * 0.35) * 6 : 0;

    // Feet
    ctx.fillStyle = '#e0a370';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-14 + walkSwing, 14, 12, 9, 4);
    ctx.roundRect(2 - walkSwing, 14, 12, 9, 4);
    ctx.fill();
    ctx.stroke();

    // Leopard Skin Tunic (호피 무늬 옷)
    ctx.fillStyle = '#e89923';
    ctx.beginPath();
    ctx.roundRect(-15, -8, 30, 24, 6);
    ctx.fill();
    ctx.stroke();

    // Leopard spots
    ctx.fillStyle = '#3b2109';
    ctx.beginPath();
    ctx.arc(-6, 0, 3, 0, Math.PI * 2);
    ctx.arc(5, 4, 3.5, 0, Math.PI * 2);
    ctx.arc(-4, 10, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Head & Big Caveman Jaw
    ctx.fillStyle = '#eab182';
    ctx.beginPath();
    ctx.roundRect(-14, -28, 29, 23, 8);
    ctx.fill();
    ctx.stroke();

    // Shaggy Caveman Hair & Unibrow
    ctx.fillStyle = '#3b2212';
    ctx.beginPath();
    ctx.moveTo(-16, -20);
    ctx.lineTo(-12, -32);
    ctx.lineTo(-4, -29);
    ctx.lineTo(2, -34);
    ctx.lineTo(10, -29);
    ctx.lineTo(15, -22);
    ctx.lineTo(-16, -20);
    ctx.fill();

    // Eyes & Expression
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(6, -18, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(7.5, -18, 2, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (shouting when attacking!)
    if (player.attackTimer > 0) {
      ctx.fillStyle = '#9e1b1b';
      ctx.beginPath();
      ctx.arc(8, -10, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(4, -10, 7, 2.5);
    }

    // Giant Wooden Club (원시 몽둥이)
    ctx.save();
    let clubAngle = -0.5;
    if (player.attackTimer > 0) {
      // Smash down arc!
      const progress = 1 - (player.attackTimer / player.attackDuration);
      clubAngle = -1.2 + Math.min(1, progress * 1.8) * 2.5;
    } else {
      clubAngle = -0.4 + Math.sin(time * 0.12) * 0.08;
    }

    ctx.translate(8, 0);
    ctx.rotate(clubAngle);

    // Club Handle & Heavy Knob
    ctx.fillStyle = '#8c5327';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(36, -12);
    ctx.quadraticCurveTo(48, -14, 48, 0);
    ctx.quadraticCurveTo(48, 14, 36, 12);
    ctx.lineTo(0, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Stone spikes on club
    ctx.fillStyle = '#d9d2c5';
    ctx.beginPath();
    ctx.moveTo(34, -11);
    ctx.lineTo(38, -18);
    ctx.lineTo(42, -10);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    ctx.restore();

    // Smash Impact Shockwave when club hits bottom of swing
    if (player.attackTimer > 2 && player.attackTimer < 9) {
      const hitX = player.facing === 1 ? player.x + player.w + 26 : player.x - 26;
      const hitY = player.y + player.h - 6;
      ctx.save();
      ctx.strokeStyle = '#ffcf40';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(hitX, hitY, 18, Math.PI, 0);
      ctx.stroke();
      ctx.restore();
    }
  },

  drawEnemy(ctx, enemy, time) {
    ctx.save();
    ctx.translate(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
    if (enemy.stunTimer > 0) {
      ctx.rotate(Math.sin(time * 0.5) * 0.15);
    }
    ctx.scale(enemy.vx >= 0 ? 1 : -1, 1);

    if (enemy.type === 'dino') {
      // Green Prehistoric Raptor
      ctx.fillStyle = '#3ca34b';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2.5;
      // Body & Tail
      ctx.beginPath();
      ctx.roundRect(-18, -8, 32, 24, 8);
      ctx.fill();
      ctx.stroke();
      // Head
      ctx.beginPath();
      ctx.roundRect(0, -24, 24, 18, 6);
      ctx.fill();
      ctx.stroke();
      // Yellow belly stripes
      ctx.fillStyle = '#d4d959';
      ctx.fillRect(-6, -2, 14, 14);
      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(14, -16, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.fillRect(14, -17, 2.5, 2.5);
    } else if (enemy.type === 'boar') {
      // Wild Prehistoric Boar (멧돼지)
      ctx.fillStyle = '#754328';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-20, -10, 40, 26, 10);
      ctx.fill();
      ctx.stroke();
      // Tusks (어금니)
      ctx.fillStyle = '#fff8e7';
      ctx.beginPath();
      ctx.moveTo(16, 6);
      ctx.lineTo(26, -4);
      ctx.lineTo(20, 10);
      ctx.fill();
      ctx.stroke();
      // Angry Eye
      ctx.fillStyle = '#ff3b30';
      ctx.beginPath();
      ctx.arc(12, -2, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (enemy.type === 'ptero') {
      // Flying Pterodactyl (익룡)
      const wingY = Math.sin(time * 0.35) * 14;
      ctx.fillStyle = '#9c4dcc';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2.5;
      // Wings
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-24, -16 + wingY);
      ctx.lineTo(10, -4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Body & Beak
      ctx.beginPath();
      ctx.roundRect(-14, -8, 28, 14, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffae00';
      ctx.beginPath();
      ctx.moveTo(14, -6);
      ctx.lineTo(32, 0);
      ctx.lineTo(14, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  },

  drawBoss(ctx, boss, time) {
    if (!boss || boss.hp <= 0) return;
    ctx.save();
    ctx.translate(boss.x + boss.w / 2, boss.y + boss.h / 2);
    if (boss.hurtTimer > 0 && Math.floor(boss.hurtTimer / 2) % 2 === 0) {
      ctx.filter = 'brightness(2.2)';
    }
    ctx.scale(boss.facing, 1);

    // Giant Prehistoric Mammoth / King T-Rex Boss
    ctx.fillStyle = boss.enraged ? '#a82315' : '#6e3b23';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;

    // Massive Body
    ctx.beginPath();
    ctx.roundRect(-55, -45, 110, 90, 22);
    ctx.fill();
    ctx.stroke();

    // Fur / Armor Plates
    ctx.fillStyle = '#3d1e10';
    ctx.beginPath();
    ctx.arc(0, -45, 38, 0, Math.PI);
    ctx.fill();

    // Head & Crown Stone
    ctx.fillStyle = boss.enraged ? '#cc2918' : '#82462a';
    ctx.beginPath();
    ctx.roundRect(15, -72, 54, 52, 14);
    ctx.fill();
    ctx.stroke();

    // Giant Curved Tusks
    ctx.fillStyle = '#fff5d6';
    ctx.beginPath();
    ctx.moveTo(55, -28);
    ctx.quadraticCurveTo(98, -25, 92, -64);
    ctx.quadraticCurveTo(80, -35, 52, -16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Boss Eye
    ctx.fillStyle = '#ffea00';
    ctx.beginPath();
    ctx.arc(48, -50, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d90000';
    ctx.beginPath();
    ctx.arc(50, -50, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Feet
    const stompOffset = Math.sin(time * 0.25) * 5;
    ctx.fillStyle = '#472515';
    ctx.fillRect(-42, 42 + stompOffset, 28, 16);
    ctx.fillRect(14, 42 - stompOffset, 28, 16);

    ctx.restore();
  },

  drawFood(ctx, item, time) {
    ctx.save();
    const bob = Math.sin(time * 0.1 + item.x) * 4;
    ctx.translate(item.x + 16, item.y + 16 + bob);

    // Glow circle behind food
    ctx.fillStyle = 'rgba(255, 196, 0, 0.22)';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '24px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.emoji, 0, 2);
    ctx.restore();
  }
};

window.SpriteRenderer = SpriteRenderer;
