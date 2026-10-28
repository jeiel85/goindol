/* Pre-rendered, two-pixel-grid artwork. All frames are ordinary canvases so the
 * game and the catalogue can share the same artwork without a sprite loader. */
(function () {
  'use strict';

  const images = {};
  for (const [key, path] of Object.entries({
    jungle: 'bg_jungle.png',
    swamp: 'bg_swamp.png',
    cave: 'bg_cave.png',
    ice: 'bg_ice.png',
    desert: 'bg_desert.png',
    volcano: 'bg_volcano.png',
    sky: 'bg_sky.png',
    boss: 'bg_boss.png',
    hero: 'hero_banner.png',
    worldMap: 'world_map.png'
  })) {
    images[key] = new Image();
    images[key].src = 'assets/' + path;
  }
  images.banner = images.hero;

  const ink = '#201a21';
  function canvas(w, h, paint) {
    const small = document.createElement('canvas');
    small.width = w; small.height = h;
    const c = small.getContext('2d');
    c.imageSmoothingEnabled = false;
    paint(c);
    const pixels = c.getImageData(0, 0, w, h);
    for (let i = 3; i < pixels.data.length; i += 4) {
      pixels.data[i] = pixels.data[i] >= 128 ? 255 : 0;
    }
    c.putImageData(pixels, 0, 0);
    const result = document.createElement('canvas');
    result.width = w * 2; result.height = h * 2;
    const out = result.getContext('2d');
    out.imageSmoothingEnabled = false;
    out.drawImage(small, 0, 0, result.width, result.height);
    return result;
  }
  function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(x, y, w, h); }
  function poly(c, points, color, outline = ink) {
    c.beginPath(); c.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
    c.closePath(); c.fillStyle = color; c.fill();
    if (outline) { c.strokeStyle = outline; c.lineWidth = 1; c.lineJoin = 'miter'; c.stroke(); }
  }
  function speckle(c, points, color) { points.forEach(([x, y]) => rect(c, x, y, 1, 1, color)); }
  function star(c, x, y, color) {
    rect(c, x + 1, y, 1, 3, color); rect(c, x, y + 1, 3, 1, color);
  }

  // Sam is drawn facing right on a 48x42 pixel grid (96x84 canvas) to match the
  // muscular, wild-maned, toothy-grinned caveman from hero_banner.png.
  function sam(pose, frame = 0) {
    return canvas(48, 42, c => {
      const stride = pose === 'run' ? [-3, 2, 4, -1][frame] : 0;
      const oppStride = pose === 'run' ? [3, -2, -3, 2][frame] : 0;
      const hop = pose === 'jump' ? -3 : pose === 'fall' ? 1 : (pose === 'idle' && frame === 1) ? -1 : (pose === 'run' && frame % 2 === 1) ? -1 : 0;
      const hairWave = (frame % 2 === 1 || pose === 'run' || pose === 'jump') ? 1 : 0;

      // 1. Huge Golden Smash Burst & Motion Arc (like hero_banner.png) when attacking
      if (pose === 'attack') {
        poly(c, [[24, 3], [34, 4], [43, 11], [47, 22], [45, 31], [41, 29], [42, 20], [37, 11], [28, 6]], '#ff7b1a', null);
        poly(c, [[27, 2], [37, 5], [45, 14], [47, 25], [43, 24], [40, 14], [33, 7]], '#ffcf40', null);
        poly(c, [[34, 24], [40, 20], [46, 23], [42, 28], [47, 33], [40, 33], [38, 38], [35, 33], [29, 34]], '#ffe98a', null);
      }

      // 2. Back Flowing Wild Jet-Black Mane (sweeping left like the banner art)
      poly(c, [
        [15, 6 + hop],
        [7, 4 + hop - hairWave],
        [11, 8 + hop],
        [4, 8 + hop + hairWave],
        [10, 12 + hop],
        [3, 13 + hop - hairWave],
        [9, 16 + hop],
        [5, 19 + hop + hairWave],
        [13, 19 + hop],
        [16, 14 + hop]
      ], '#14121d');

      // 3. Muscular Bare Legs & Calves
      // Back leg
      poly(c, [
        [13, 29 + hop],
        [18, 29 + hop],
        [18 + stride, 36],
        [20 + stride, 39],
        [11 + stride, 39],
        [12 + stride, 35]
      ], '#c9784f');
      rect(c, 13 + stride, 31, 3, 5, '#e89d72');
      rect(c, 12 + stride, 37, 7, 2, '#f5b890'); // Barefoot toes

      // Front muscular leg
      poly(c, [
        [20, 29 + hop],
        [26, 29 + hop],
        [27 + oppStride, 36],
        [29 + oppStride, 39],
        [19 + oppStride, 39],
        [20 + oppStride, 35]
      ], '#e89d72');
      rect(c, 22 + oppStride, 31, 3, 5, '#ffc49b');
      rect(c, 21 + oppStride, 37, 7, 2, '#ffd2b0');

      // 4. Muscular Torso & Diagonal One-Shoulder Leopard-Skin Tunic
      // Broad muscular chest & back shoulder base
      poly(c, [
        [11, 17 + hop],
        [26, 16 + hop],
        [28, 23 + hop],
        [26, 30 + hop],
        [12, 30 + hop],
        [10, 22 + hop]
      ], '#f0a679');
      // Pectoral & shoulder muscle highlights
      rect(c, 12, 18 + hop, 5, 4, '#ffd0ab');
      rect(c, 18, 18 + hop, 6, 4, '#ffc49b');
      rect(c, 16, 21 + hop, 7, 1, '#b86842'); // Pectoral definition line

      // Jagged Leopard-Skin Pelt (draped diagonally from right shoulder to jagged hem)
      poly(c, [
        [11, 21 + hop],
        [21, 17 + hop],
        [26, 17 + hop],
        [27, 25 + hop],
        [28, 32 + hop],
        [25, 29 + hop],
        [22, 33 + hop],
        [19, 29 + hop],
        [16, 33 + hop],
        [13, 29 + hop],
        [10, 32 + hop],
        [10, 25 + hop]
      ], '#f59e1d');
      // Bright golden-yellow pelt highlights
      rect(c, 13, 22 + hop, 11, 5, '#ffc247');
      rect(c, 19, 18 + hop, 5, 4, '#ffcf63');
      // Dark leopard spots on tunic
      rect(c, 12, 24 + hop, 2, 2, '#24130c');
      rect(c, 16, 22 + hop, 2, 2, '#24130c');
      rect(c, 21, 19 + hop, 2, 2, '#24130c');
      rect(c, 20, 24 + hop, 3, 2, '#24130c');
      rect(c, 15, 27 + hop, 2, 2, '#24130c');
      rect(c, 23, 27 + hop, 2, 2, '#24130c');

      // 5. Sculpted Muscular Back Arm / Shoulder (Left side of sprite)
      poly(c, [
        [8, 17 + hop],
        [13, 17 + hop],
        [14, 24 + hop],
        [11, 26 + hop],
        [7, 23 + hop]
      ], '#e89d72');
      rect(c, 9, 18 + hop, 3, 4, '#ffd0ab');

      // 6. Head, Square Jaw & Big White Toothy Grin (matching hero_banner.png)
      poly(c, [
        [13, 6 + hop],
        [26, 6 + hop],
        [29, 10 + hop],
        [29, 17 + hop],
        [26, 20 + hop],
        [15, 20 + hop],
        [12, 16 + hop]
      ], '#f2aa7e');
      // Ear & cheek shading
      rect(c, 13, 11 + hop, 2, 4, '#c9784f');
      rect(c, 16, 8 + hop, 9, 3, '#ffd0ab');

      // Top & Front Spiky Wild Black Hair Crown
      poly(c, [
        [10, 11 + hop],
        [11, 5 + hop],
        [15, 2 + hop - hairWave],
        [18, 5 + hop],
        [22, 1 + hop],
        [24, 4 + hop],
        [29, 3 + hop - hairWave],
        [27, 7 + hop],
        [30, 8 + hop],
        [25, 9 + hop],
        [21, 8 + hop],
        [16, 9 + hop],
        [13, 12 + hop]
      ], '#14121d');
      // Hair sheen highlights (slate blue-grey like 16-bit key art)
      rect(c, 15, 4 + hop, 4, 1, '#484569');
      rect(c, 21, 3 + hop, 5, 1, '#484569');
      rect(c, 9, 9 + hop, 4, 1, '#393654');

      // Thick Expressive Black Eyebrows & Eyes
      rect(c, 19, 9 + hop, 9, 2, '#14121d'); // Bold caveman brow
      rect(c, 20, 11 + hop, 3, 3, '#ffffff');
      rect(c, 25, 11 + hop, 3, 3, '#ffffff');
      rect(c, 22, 12 + hop, 1, 2, '#14121d');
      rect(c, 27, 12 + hop, 1, 2, '#14121d');

      // Prominent Nose
      poly(c, [[25, 12 + hop], [30, 13 + hop], [29, 15 + hop], [25, 15 + hop]], '#e08e63');

      // Signature Wide White Toothy Grin (or shouting mouth on hurt)
      if (pose === 'hurt') {
        poly(c, [[20, 15 + hop], [27, 15 + hop], [27, 19 + hop], [20, 19 + hop]], '#8c1d24');
        rect(c, 21, 15 + hop, 5, 1, '#ffffff');
      } else {
        poly(c, [[18, 15 + hop], [28, 15 + hop], [27, 19 + hop], [19, 19 + hop]], '#ffffff');
        rect(c, 19, 17 + hop, 8, 1, '#2b1b17'); // Grin teeth line
        rect(c, 22, 15 + hop, 1, 4, '#2b1b17');
        rect(c, 25, 15 + hop, 1, 4, '#2b1b17');
      }

      // 7. Massive Spiked Wooden Club & Muscular Forearm
      if (pose === 'windup') {
        // Raised overhead ready to smash!
        poly(c, [[21, 18 + hop], [26, 14 + hop], [29, 16 + hop], [25, 21 + hop]], '#f2aa7e');
        poly(c, [[24, 15 + hop], [21, 2], [29, 0], [32, 3], [28, 16 + hop]], '#8c4820');
        rect(c, 23, 3, 4, 10, '#c4743d');
        rect(c, 22, 1, 7, 2, '#e8b278'); // Club end grain
        // Silver/stone spikes
        poly(c, [[21, 4], [17, 3], [21, 7]], '#e6eef7');
        poly(c, [[21, 9], [17, 9], [22, 11]], '#e6eef7');
        poly(c, [[30, 4], [34, 3], [30, 7]], '#e6eef7');
      } else if (pose === 'attack') {
        // Heavy downward smash with huge spiked barrel!
        poly(c, [[22, 19 + hop], [29, 20 + hop], [31, 24 + hop], [24, 23 + hop]], '#f2aa7e');
        poly(c, [[27, 21 + hop], [42, 22], [46, 26], [44, 34], [39, 35], [26, 24 + hop]], '#8c4820');
        poly(c, [[29, 22 + hop], [42, 24], [43, 28], [28, 24 + hop]], '#c4743d', null);
        poly(c, [[42, 23], [46, 26], [44, 33], [40, 31]], '#e3ac72'); // Wood ring face
        // Prominent metallic conical spikes
        poly(c, [[35, 22], [37, 17], [39, 23]], '#e6eef7');
        poly(c, [[40, 23], [44, 18], [43, 25]], '#e6eef7');
        poly(c, [[34, 31], [35, 37], [38, 33]], '#dce6f2');
        poly(c, [[39, 33], [42, 39], [43, 34]], '#dce6f2');
      } else {
        // Held forward at an angle, ready for action (matching banner pose)
        poly(c, [[21, 19 + hop], [28, 19 + hop], [30, 23 + hop], [22, 23 + hop]], '#f2aa7e');
        rect(c, 23, 20 + hop, 5, 2, '#ffd0ab');
        poly(c, [
          [26, 21 + hop],
          [39, 10 + hop],
          [45, 12 + hop],
          [46, 18 + hop],
          [41, 21 + hop],
          [28, 24 + hop]
        ], '#8c4820');
        poly(c, [[28, 21 + hop], [40, 12 + hop], [43, 14 + hop], [30, 22 + hop]], '#c4743d', null);
        poly(c, [[40, 11 + hop], [45, 12 + hop], [45, 18 + hop], [41, 19 + hop]], '#e3ac72'); // End grain
        // Conical silver/stone spikes on club barrel
        poly(c, [[34, 14 + hop], [34, 9 + hop], [37, 12 + hop]], '#e6eef7');
        poly(c, [[38, 11 + hop], [39, 6 + hop], [41, 10 + hop]], '#e6eef7');
        poly(c, [[36, 20 + hop], [39, 24 + hop], [40, 19 + hop]], '#dce6f2');
        poly(c, [[41, 19 + hop], [45, 22 + hop], [44, 17 + hop]], '#dce6f2');
      }
    });
  }

  // Green Raptor / Lava Armored Raptor
  function dinosaur(frame, stunned, variant = 'green') {
    return canvas(32, 24, c => {
      const step = frame ? 2 : 0;
      const dark = variant === 'lava' ? '#3d2224' : '#338650';
      const mid = variant === 'lava' ? '#7a332e' : '#55ae56';
      const crest = variant === 'lava' ? '#ff7b29' : '#b2cc5a';
      const belly = variant === 'lava' ? '#f59f42' : '#a8c66a';
      const bellyHi = variant === 'lava' ? '#ffe07d' : '#d6d47b';

      poly(c, [[4,14],[1,10],[2,16],[7,18],[17,18],[20,14],[17,9],[9,9]], dark);
      poly(c, [[8,10],[10,7],[15,7],[17,9],[22,8],[25,5],[29,6],[30,11],[28,13],[21,13],[19,18],[10,18]], mid);
      poly(c, [[8,9],[10,6],[11,8],[13,5],[14,8],[16,6],[17,9]], crest);
      rect(c, 11,13, 7, 4, belly); rect(c, 13,15, 5, 2, bellyHi);
      rect(c, 24,7, 3, 3, variant === 'lava' ? '#ffeb82' : '#f9f1cb');
      rect(c, 26,8, 1, 2, variant === 'lava' ? '#b81d13' : '#282525');
      rect(c, 27,12, 2, 1, '#f5e9c8');
      poly(c, [[10,17],[13,17],[13,21-step],[10,22-step],[8,22-step],[8,20-step]], dark);
      poly(c, [[17,17],[20,17],[20,20+step],[22,20+step],[22,22+step],[17,22+step]], dark);
      speckle(c, [[8,12],[10,11],[13,10],[16,11],[18,10],[21,9]], crest);
      if (stunned) { star(c, 5, 2, '#ffe879'); star(c, 15, 1, '#ffe879'); star(c, 23, 2, '#ffe879'); }
    });
  }

  // Stage 2 Swamp Gator (늪지 악어)
  function croc(frame, stunned) {
    return canvas(32, 24, c => {
      const step = frame ? 2 : 0;
      // Long armored tail & body
      poly(c, [[1,16],[4,13],[10,11],[22,11],[30,12],[31,16],[29,18],[19,18],[4,18]], '#266e57');
      poly(c, [[5,11],[7,8],[9,11],[11,8],[13,11],[15,8],[17,11]], '#6ee0a8');
      // Belly & Jaws
      rect(c, 9,15, 13, 3, '#b8e69c');
      rect(c, 22,14, 8, 2, '#fff5d6'); // Sharp teeth row
      rect(c, 20,9, 4, 3, '#ffea79');
      rect(c, 22,10, 1, 2, '#1c1917');
      // Feet
      rect(c, 8,18, 4, 4-step, '#1c5240');
      rect(c, 18,18, 4, 4+step, '#1c5240');
      speckle(c, [[7,13],[12,13],[16,13],[20,13]], '#4cb888');
      if (stunned) { star(c, 6, 3, '#ffe879'); star(c, 16, 2, '#ffe879'); star(c, 24, 3, '#ffe879'); }
    });
  }

  // Stage 4 Ice Age Sabertooth Tiger (빙하 검치호)
  function saber(frame, stunned) {
    return canvas(32, 24, c => {
      const step = frame ? 2 : 0;
      // Sleek muscular feline body in frost-blue & snow-white
      poly(c, [[2,11],[5,8],[9,10],[20,9],[25,6],[29,8],[30,13],[27,16],[22,17],[8,17],[4,14]], '#8cb8de');
      poly(c, [[8,10],[20,9],[24,11],[22,16],[9,16]], '#e2f1ff');
      // Ice stripes
      rect(c, 11,10, 2, 4, '#476f99');
      rect(c, 15,10, 2, 5, '#476f99');
      rect(c, 19,10, 2, 4, '#476f99');
      // Long curved ivory sabertooth fangs!
      poly(c, [[26,13],[28,13],[28,19],[26,18]], '#fff9e6');
      poly(c, [[29,13],[31,13],[30,18],[29,17]], '#fff9e6');
      // Glowing amber eye
      rect(c, 25,8, 3, 2, '#ffcf40');
      rect(c, 27,8, 1, 2, '#1b1917');
      // Paws
      rect(c, 8,16, 4, 5-step, '#6b96bd');
      rect(c, 19,16, 4, 5+step, '#6b96bd');
      if (stunned) { star(c, 6, 2, '#ffe879'); star(c, 16, 1, '#ffe879'); star(c, 24, 2, '#ffe879'); }
    });
  }

  function boar(frame, stunned) {
    return canvas(32, 24, c => {
      const step = frame ? 2 : 0;
      poly(c, [[5,11],[7,7],[10,6],[11,4],[13,6],[15,4],[17,6],[21,7],[24,10],[27,11],[29,14],[27,19],[23,20],[8,20],[5,18]], '#8d573b');
      poly(c, [[7,9],[10,7],[20,8],[23,11],[24,15],[21,18],[9,18],[7,16]], '#b9784a');
      rect(c, 9,9, 9, 1, '#d59a62');
      poly(c, [[23,12],[28,12],[30,14],[29,18],[24,18],[22,16]], '#d4966a');
      rect(c, 26,14, 1, 2, '#592e29'); rect(c, 28,14, 1, 2, '#592e29');
      rect(c, 21,10, 2, 2, '#fff1c5'); rect(c, 22,10, 1, 2, '#5d2421');
      poly(c, [[24,17],[25,20],[27,20],[29,17],[28,21],[25,22],[23,20]], '#f3e6c8');
      rect(c, 8,19, 4, 3-step, '#5c392e'); rect(c, 17,19, 4, 3+step, '#5c392e');
      speckle(c, [[9,12],[12,14],[14,11],[18,15],[20,12]], '#744931');
      if (stunned) { star(c, 7, 2, '#ffe879'); star(c, 16, 1, '#ffe879'); star(c, 24, 3, '#ffe879'); }
    });
  }

  function ptero(frame) {
    return canvas(32, 24, c => {
      if (frame) poly(c, [[13,12],[8,10],[3,5],[2,3],[1,13],[5,11],[8,17],[11,14]], '#a15bbb');
      else poly(c, [[13,12],[9,14],[5,20],[3,22],[2,13],[5,15],[8,10],[11,12]], '#a15bbb');
      poly(c, [[9,12],[13,8],[20,8],[23,10],[25,12],[22,15],[15,16],[11,15]], '#82509f');
      poly(c, [[18,9],[20,5],[23,4],[23,8],[26,9],[27,12],[22,13]], '#bd78ca');
      poly(c, [[25,10],[31,12],[26,14],[24,13]], '#e5a84f');
      rect(c, 23,9, 2, 2, '#fff2cf'); rect(c, 24,9, 1, 2, '#302236');
      rect(c, 11,12, 4, 1, '#d89bdb'); rect(c, 14,14, 4, 1, '#5b386d');
    });
  }

  function mammoth(frame, airborne, angry, variant = 'king') {
    return canvas(64, 64, c => {
      const leg = airborne ? -3 : frame ? 3 : 0;
      let dark, mid, light, tuskColor, crownGem;
      if (variant === 'frost') {
        dark = angry ? '#2b4c7e' : '#2c4766';
        mid = angry ? '#4d88c4' : '#4f7ca6';
        light = angry ? '#9be4ff' : '#8ec2eb';
        tuskColor = '#e3f8ff';
        crownGem = angry ? '#ff4d6d' : '#64f5ff';
      } else {
        dark = angry ? '#5d2726' : '#53362f';
        mid = angry ? '#a24b38' : '#966247';
        light = angry ? '#d7784a' : '#c28a5d';
        tuskColor = '#f6e8c7';
        crownGem = angry ? '#ff522a' : '#68c7ad';
      }

      poly(c, [[8,27],[11,18],[18,13],[36,14],[45,20],[48,31],[45,46],[39,51],[14,51],[8,46]], mid);
      poly(c, [[10,24],[14,18],[19,15],[34,16],[41,20],[43,26],[39,23],[37,28],[34,23],[31,29],[28,24],[25,29],[22,24],[19,29],[17,24],[13,28]], light);
      poly(c, [[12,45],[19,45],[20,55+leg],[18,58+leg],[10,58+leg],[9,55+leg]], dark);
      poly(c, [[31,45],[39,45],[40,55-leg],[38,58-leg],[30,58-leg],[29,55-leg]], dark);
      rect(c, 11,54+leg, 6, 2, mid); rect(c, 31,54-leg, 6, 2, mid);
      poly(c, [[30,22],[35,16],[43,16],[49,20],[51,28],[50,36],[47,40],[47,49],[51,51],[54,48],[55,51],[53,55],[48,56],[44,53],[42,41],[36,40]], mid);
      poly(c, [[31,24],[34,20],[39,20],[41,23],[39,33],[35,37],[31,33]], dark);
      rect(c, 33,23, 3, 8, light); rect(c, 46,38, 2, 11, light); rect(c, 48,50, 3, 1, light);
      poly(c, [[42,36],[47,38],[53,38],[57,34],[58,29],[60,27],[60,35],[57,40],[53,42],[46,42],[42,40]], tuskColor);
      rect(c, 48,39, 6, 1, '#ffffff'); rect(c, 54,37, 2, 2, '#9bb8cc');
      poly(c, [[34,20],[33,12],[36,14],[39,9],[42,14],[47,11],[48,20]], variant === 'frost' ? '#89c4f4' : '#8e9290');
      rect(c, 35,17, 12, 2, variant === 'frost' ? '#dff4ff' : '#c4c3ad');
      rect(c, 40,14, 2, 3, crownGem);
      rect(c, 43,24, 4, 4, angry ? '#ff5926' : '#f3d77d'); rect(c, 45,25, 2, 2, angry ? '#fff29b' : '#382326');
      speckle(c, [[15,31],[17,30],[20,33],[23,31],[26,34],[14,37],[16,39],[20,37],[24,39],[28,37],[18,43],[22,45],[27,43],[31,39]], light);
      speckle(c, [[16,32],[19,34],[22,32],[25,35],[15,40],[19,38],[23,40],[27,38]], dark);
    });
  }

  function icon(kind) {
    return canvas(16, 16, c => {
      if (kind === 'heart' || kind === 'emptyHeart') {
        const color = kind === 'heart' ? '#dc4a4e' : '#625a61';
        poly(c, [[2,3],[5,2],[8,4],[11,2],[14,3],[15,6],[14,9],[8,14],[2,9],[1,6]], color);
        rect(c, 3,4, 3, 2, kind === 'heart' ? '#ff9b86' : '#958c8d'); rect(c, 4,9, 2, 1, '#9d3941');
      } else if (kind === 'axe') {
        poly(c, [[3,13],[4,14],[12,4],[11,3]], '#a96c3e'); rect(c, 5,11, 2, 1, '#e2ae69');
        poly(c, [[8,2],[11,2],[12,4],[14,5],[13,9],[10,8],[8,6]], '#9ba7a4');
        rect(c, 9,3, 2, 2, '#dce2cf'); rect(c, 11,6, 2, 1, '#667274');
      } else if (kind === 'rock') {
        poly(c, [[2,5],[5,2],[11,2],[14,5],[14,11],[11,14],[4,13],[1,10]], '#6a6261');
        poly(c, [[3,5],[6,3],[10,3],[12,5],[8,7],[4,7]], '#a49a89', null);
        rect(c, 4,9, 4, 2, '#514c4d'); rect(c, 10,8, 2, 2, '#c5b19a');
      } else if (kind === 'ice_rock') {
        poly(c, [[2,5],[5,2],[11,2],[14,5],[14,11],[11,14],[4,13],[1,10]], '#4389c9');
        poly(c, [[3,5],[6,3],[10,3],[12,5],[8,7],[4,7]], '#b8ecff', null);
        rect(c, 4,9, 4, 2, '#2d5c8f'); rect(c, 10,8, 2, 2, '#ffffff');
      } else if (kind === 'meat') {
        poly(c, [[2,6],[4,3],[9,3],[12,5],[12,9],[9,12],[5,12],[2,10]], '#a84a32');
        rect(c, 4,5, 5, 2, '#ed9861'); rect(c, 3,8, 3, 2, '#d56b48');
        poly(c, [[10,9],[13,10],[14,9],[15,10],[14,12],[15,13],[14,14],[12,13],[11,14],[10,13],[11,11]], '#f5e6c2');
      } else if (kind === 'apple') {
        poly(c, [[3,5],[5,3],[8,4],[11,3],[13,5],[13,10],[11,13],[8,14],[5,13],[3,11]], '#ca3d3c');
        rect(c, 4,6, 2, 4, '#ff9270'); rect(c, 10,9, 2, 3, '#9d3034');
        rect(c, 8,2, 1, 3, '#60432c'); poly(c, [[8,3],[9,1],[12,1],[11,3]], '#78b859');
      } else if (kind === 'banana') {
        poly(c, [[2,4],[4,3],[4,7],[6,10],[10,11],[13,9],[14,7],[15,8],[14,12],[11,14],[7,14],[3,12],[1,8]], '#e1aa32');
        rect(c, 4,9, 2, 2, '#ffe985'); rect(c, 7,12, 4, 1, '#fff0a1'); rect(c, 2,3, 2, 2, '#69452d');
      } else if (kind === 'cheese') {
        poly(c, [[2,8],[11,3],[14,5],[14,12],[4,13],[2,11]], '#e6a837');
        poly(c, [[3,8],[11,4],[13,5],[6,9]], '#ffe07a', null);
        rect(c, 6,10, 2, 2, '#bd7b2d'); rect(c, 11,8, 2, 2, '#bd7b2d');
      } else if (kind === 'burger') {
        poly(c, [[2,7],[3,4],[6,2],[11,2],[14,4],[15,7]], '#d69247');
        rect(c, 3,6, 11, 2, '#f6c578'); rect(c, 2,8, 13, 2, '#528f45');
        rect(c, 2,10, 13, 2, '#70432e'); rect(c, 3,12, 11, 2, '#d69247');
        speckle(c, [[5,4],[8,3],[11,4]], '#fff0ba');
      } else if (kind === 'icecream') {
        poly(c, [[4,8],[12,8],[10,14],[6,14]], '#bd8147'); rect(c, 6,10, 4, 1, '#e7b875');
        poly(c, [[3,8],[3,5],[5,3],[7,3],[8,1],[11,2],[13,4],[13,8]], '#f0a6aa');
        rect(c, 5,4, 4, 2, '#fff0df'); rect(c, 10,5, 2, 2, '#d6778e');
      } else if (kind === 'fish') {
        poly(c, [[1,8],[5,4],[11,4],[15,2],[14,8],[15,13],[11,11],[5,12]], '#5ca4d6');
        rect(c, 5,6, 5, 3, '#bfe6ff');
        rect(c, 3,7, 1, 1, '#1c1917');
      } else if (kind === 'roast') {
        poly(c, [[2,7],[5,3],[11,3],[13,7],[11,12],[5,12]], '#c95227');
        rect(c, 5,5, 5, 3, '#ffad66');
        rect(c, 12,8, 3, 2, '#f5e6c2');
      } else if (kind === 'amber') {
        poly(c, [[8,1],[14,5],[12,13],[8,15],[4,13],[2,5]], '#ff9d1a');
        poly(c, [[8,3],[12,6],[10,11],[6,11],[4,6]], '#ffe680', null);
        rect(c, 7,5, 2, 3, '#ffffff');
      } else if (kind === 'chili') {
        poly(c, [[3,12],[6,6],[11,3],[14,5],[12,10],[7,14]], '#e62e25');
        rect(c, 6,7, 3, 2, '#ff9478');
        rect(c, 12,2, 2, 3, '#4ab547');
      } else if (kind === 'shield') {
        poly(c, [[8,1],[14,4],[13,11],[8,15],[3,11],[2,4]], '#2e9e6b');
        poly(c, [[8,3],[12,5],[11,10],[8,13],[5,10],[4,5]], '#64e3a1', null);
        rect(c, 7,5, 2, 5, '#ffe07d');
      } else if (kind === 'magnet') {
        poly(c, [[3,3],[7,3],[7,9],[9,9],[9,3],[13,3],[13,11],[10,14],[6,14],[3,11]], '#d9383a');
        rect(c, 3,3, 4, 3, '#c7d4e0'); rect(c, 9,3, 4, 3, '#c7d4e0');
      } else if (kind === 'feather') {
        poly(c, [[3,13],[7,5],[13,1],[14,5],[10,11],[5,14]], '#ffcf33');
        rect(c, 7,6, 4, 3, '#fff7b8');
      } else if (kind === 'bomb') {
        poly(c, [[4,6],[8,4],[12,6],[14,10],[12,14],[4,14],[2,10]], '#2e2b36');
        rect(c, 5,7, 3, 3, '#6e687d');
        rect(c, 8,2, 2, 3, '#d49a59');
        rect(c, 10,1, 3, 2, '#ff6a26');
      } else if (kind === 'golden_egg') {
        poly(c, [[8,1],[12,4],[14,9],[12,14],[4,14],[2,9],[4,4]], '#f5b027');
        rect(c, 5,4, 4, 5, '#ffe885');
        speckle(c, [[6,10],[10,8],[9,12]], '#d47a19');
      } else if (kind === 'spear_proj') {
        rect(c, 1,7, 10, 2, '#9e6236');
        poly(c, [[10,4],[15,8],[10,12]], '#dce8f2');
      } else if (kind === 'hammer_proj') {
        rect(c, 2,7, 8, 2, '#8c4f27');
        poly(c, [[8,2],[14,2],[15,14],[8,14]], '#8c8f99');
        rect(c, 9,4, 4, 4, '#c7ced6');
      } else if (kind === 'fireball_proj') {
        poly(c, [[2,8],[6,3],[12,3],[15,8],[12,13],[6,13]], '#ff551a');
        poly(c, [[5,8],[8,5],[13,6],[13,10],[8,11]], '#ffdf4d', null);
      }
    });
  }

  function dolmen(state) {
    return canvas(64, 56, c => {
      rect(c, 3,52, 58, 3, '#343133');
      poly(c, [[8,20],[20,20],[21,52],[7,52]], '#777b73');
      poly(c, [[44,20],[56,20],[57,52],[43,52]], '#777b73');
      rect(c, 10,23, 3, 24, '#aaa99a'); rect(c, 46,23, 3, 24, '#aaa99a');
      poly(c, [[3,8],[9,3],[52,3],[61,8],[59,22],[5,22]], '#858a7d');
      poly(c, [[7,8],[12,5],[51,5],[57,9],[55,11],[8,11]], '#b1b19d', null);
      rect(c, 12,4, 15, 2, '#74955d'); rect(c, 33,4, 13, 2, '#71905b');
      poly(c, [[21,22],[43,22],[43,52],[21,52]], state === 'open' ? '#235a55' : state === 'checkpoint' ? '#3a3219' : '#34383a');
      if (state === 'open') {
        rect(c, 24,25, 16, 24, '#398c7a'); rect(c, 27,27, 10, 20, '#67c9a2');
        star(c, 29,30, '#d9ffd6'); star(c, 34,40, '#c9ffce');
      } else if (state === 'checkpoint') {
        rect(c, 24,25, 16, 24, '#8c6222'); rect(c, 27,27, 10, 20, '#ffcb5c');
        star(c, 29,31, '#fff8d6'); star(c, 34,39, '#fff8d6');
      } else {
        rect(c, 23,25, 18, 2, '#6f716a'); rect(c, 23,37, 18, 2, '#6f716a');
        rect(c, 30,25, 2, 26, '#5e615e');
      }
      const rune = state === 'open' ? '#aaffc9' : state === 'checkpoint' ? '#ffe082' : state === 'start' ? '#efcf82' : '#c2af88';
      for (let x = 13; x < 53; x += 9) { rect(c,x,14, 1, 4,rune); rect(c,x+1,15, 2, 1,rune); rect(c,x+2,16, 1, 2,rune); }
      speckle(c, [[9,16],[16,20],[27,8],[39,19],[52,13],[13,32],[17,43],[48,28],[51,44]], '#555e58');
    });
  }

  function totem(cracks, theme = 'jungle') {
    return canvas(32, 32, c => {
      const base = theme === 'ice' ? '#5882ab' : theme === 'volcano' ? '#4a3130' : '#777970';
      const top = theme === 'ice' ? '#bce0ff' : theme === 'volcano' ? '#8c533e' : '#b1af98';
      const emblem = theme === 'ice' ? '#ffffff' : theme === 'volcano' ? '#ffae42' : '#d9caa1';
      poly(c, [[5,29],[4,9],[8,4],[23,4],[28,9],[27,29]], base);
      poly(c, [[7,9],[10,6],[22,6],[25,9],[24,12],[8,12]], top, null);
      rect(c, 7,13, 2, 13, top); rect(c, 23,13, 2, 13, '#3c403d');
      rect(c, 10,17, 12, 3, emblem); rect(c, 9,15, 3, 7, emblem); rect(c, 20,15, 3, 7, emblem);
      rect(c, 12,18, 8, 1, '#857763');
      if (cracks > 0) { rect(c, 15,5, 1, 3, ink); rect(c, 16,8, 2, 1, ink); rect(c, 18,9, 1, 4, ink); }
      if (cracks > 1) { rect(c, 18,12, 2, 1, ink); rect(c, 20,13, 1, 3, ink); rect(c, 12,22, 1, 3, ink); rect(c, 10,25, 2, 1, ink); rect(c, 9,26, 1, 3, ink); }
      speckle(c, [[6,11],[10,8],[21,9],[26,12],[7,24],[24,25],[16,27]], '#3b423e');
    });
  }

  function mushroom(theme = 'jungle') {
    return canvas(24, 16, c => {
      const capColor = theme === 'swamp' ? '#24b8a0' : theme === 'ice' ? '#4aa3df' : theme === 'volcano' ? '#e85d26' : '#bb383a';
      const spotColor = theme === 'swamp' ? '#b8fff0' : theme === 'ice' ? '#ffffff' : '#ffe4c2';
      poly(c, [[9,8],[15,8],[16,15],[8,15]], '#d9c29c'); rect(c, 10,10, 2, 4, '#fff0cb');
      poly(c, [[1,8],[3,4],[6,2],[18,2],[21,4],[23,8],[22,10],[2,10]], capColor);
      rect(c, 4,4, 4, 2, spotColor); rect(c, 14,3, 4, 2, spotColor); rect(c, 9,7, 3, 2, spotColor);
      rect(c, 3,9, 18, 1, ink);
    });
  }

  // Dedicated 16-bit Moving Platform Sprite per Biome
  function movingPlatform(theme = 'jungle') {
    return canvas(64, 14, c => {
      if (theme === 'jungle' || theme === 'swamp') {
        // Bound Prehistoric Log Raft with Vines
        poly(c, [[1,3],[62,3],[63,11],[1,11]], '#78492a');
        rect(c, 2,2, 60, 2, '#4ca65b');
        for (let x = 8; x < 58; x += 14) {
          rect(c, x, 2, 3, 10, '#3a6e3e');
          rect(c, x + 4, 5, 6, 2, '#9e663c');
        }
      } else if (theme === 'ice') {
        // Crystal Glacial Iceberg Floe with Icicles
        poly(c, [[1,2],[62,2],[60,9],[54,13],[48,9],[32,13],[22,9],[12,13],[4,9]], '#74b9eb');
        rect(c, 2,2, 60, 3, '#e8f7ff');
        rect(c, 8,5, 48, 2, '#a9d8fa');
      } else if (theme === 'desert') {
        // Ancient Sandstone & Bone Slab
        poly(c, [[1,2],[62,2],[60,12],[4,12]], '#b87d3e');
        rect(c, 2,2, 60, 3, '#f2c97d');
        for (let x = 8; x < 56; x += 14) {
          rect(c, x, 6, 8, 3, '#fff0d4');
        }
      } else if (theme === 'sky') {
        // Golden Cloud-Rune Floating Altar Slab
        poly(c, [[1,2],[62,2],[59,12],[5,12]], '#5c789e');
        rect(c, 2,2, 60, 3, '#f7d560');
        for (let x = 10; x < 56; x += 12) {
          rect(c, x, 6, 6, 3, '#64f5ff');
        }
      } else {
        // Carved Obsidian & Glowing Magma Rune Slab
        poly(c, [[1,2],[62,2],[60,12],[4,12]], '#3d2c35');
        rect(c, 2,2, 60, 2, '#8c6d58');
        for (let x = 10; x < 56; x += 12) {
          rect(c, x, 6, 6, 3, '#ff6a26');
          rect(c, x + 1, 7, 4, 1, '#ffe07d');
        }
      }
    });
  }

  // Crumbling Ancient Slab Platform Sprite per Biome
  function crumblePlatform(theme = 'jungle') {
    return canvas(64, 14, c => {
      const topCol = theme === 'ice' ? '#bce6ff' : theme === 'desert' ? '#f5cf87' : theme === 'sky' ? '#ffe680' : '#b89f7d';
      const bodyCol = theme === 'ice' ? '#4f82ad' : theme === 'desert' ? '#9e6330' : theme === 'sky' ? '#4d658c' : '#6e5a4f';
      poly(c, [[1,2],[62,2],[59,12],[54,9],[47,13],[38,9],[31,13],[22,9],[14,13],[5,11]], bodyCol);
      rect(c, 2,2, 60, 3, topCol);
      // Deep warning fault cracks across slab
      poly(c, [[18,2],[21,7],[19,12]], ink);
      poly(c, [[42,2],[39,7],[43,12]], ink);
      rect(c, 29,4, 6, 2, '#ff7b29');
    });
  }

  function tile(theme) {
    return canvas(16, 16, c => {
      const palettes = {
        jungle:  ['#563d31','#75523a','#a37a4a','#528c4c','#8fc070'],
        swamp:   ['#24332c','#394f43','#597865','#3b8f6e','#76e0b8'],
        cave:    ['#332b41','#51435c','#77647d','#725c87','#dd643f'],
        ice:     ['#2a4466','#436894','#749ec9','#b8d8f8','#ffffff'],
        desert:  ['#54331c','#875429','#ba7c3d','#deb059','#fff1bd'],
        volcano: ['#26191b','#472926','#6e3c32','#b84627','#ff9d3b'],
        sky:     ['#2a3954','#465f87','#7192bf','#d9b650','#fff3b0'],
        boss:    ['#29272c','#4d3b3b','#795149','#9a4735','#ef6a37']
      };
      const colors = palettes[theme] || palettes.jungle;
      rect(c, 0,0, 16,16, colors[0]);
      rect(c, 0,3, 15,5, colors[1]); rect(c, 1,9, 7,6, colors[1]); rect(c, 9,9, 7,6, colors[1]);
      rect(c, 0,3, 14,1, colors[2]); rect(c, 1,9, 6,1, colors[2]); rect(c, 9,9, 7,1, colors[2]);
      rect(c, 0,0, 16,3, colors[3]); rect(c, 1,0, 5,1, colors[4]); rect(c, 9,1, 5,1, colors[4]);
      if (theme === 'jungle' || theme === 'swamp' || theme === 'ice') {
        rect(c, 2,3, 3,2, colors[3]); rect(c, 10,3, 2,2, colors[3]);
      } else {
        rect(c, 5,6, 4,1, colors[4]); rect(c, 8,7, 1,2, colors[4]); rect(c, 11,12, 4,1, colors[4]);
      }
      speckle(c, [[2,6],[11,5],[4,12],[6,14],[10,11],[14,14]], colors[2]);
    });
  }

  const sprites = {
    sam: { idle: [sam('idle', 0), sam('idle', 1)], run: [0,1,2,3].map(i => sam('run', i)), jump: sam('jump'), fall: sam('fall'), windup: sam('windup'), attack: sam('attack'), hurt: sam('hurt') },
    uga: { idle: [sam('idle', 0), sam('idle', 1)], run: [0,1,2,3].map(i => sam('run', i)), jump: sam('jump'), fall: sam('fall'), windup: sam('windup'), attack: sam('attack'), hurt: sam('hurt') },
    brok: { idle: [sam('idle', 0), sam('idle', 1)], run: [0,1,2,3].map(i => sam('run', i)), jump: sam('jump'), fall: sam('fall'), windup: sam('windup'), attack: sam('attack'), hurt: sam('hurt') },
    tara: { idle: [sam('idle', 0), sam('idle', 1)], run: [0,1,2,3].map(i => sam('run', i)), jump: sam('jump'), fall: sam('fall'), windup: sam('windup'), attack: sam('attack'), hurt: sam('hurt') },
    dino: { walk: [dinosaur(0, false, 'green'), dinosaur(1, false, 'green')], stunned: dinosaur(0, true, 'green') },
    lava_dino: { walk: [dinosaur(0, false, 'lava'), dinosaur(1, false, 'lava')], stunned: dinosaur(0, true, 'lava') },
    croc: { walk: [croc(0, false), croc(1, false)], stunned: croc(0, true) },
    gator: { walk: [croc(0, false), croc(1, false)], stunned: croc(0, true) },
    saber: { walk: [saber(0, false), saber(1, false)], stunned: saber(0, true) },
    boar: { walk: [boar(0), boar(1)], stunned: boar(0, true) },
    ptero: { fly: [ptero(0), ptero(1)] },
    boss: { walk: [mammoth(0, false, false, 'king'), mammoth(1, false, false, 'king')], jump: mammoth(0, true, false, 'king'), enraged: [mammoth(0, false, true, 'king'), mammoth(1, false, true, 'king')] },
    frost_boss: { walk: [mammoth(0, false, false, 'frost'), mammoth(1, false, false, 'frost')], jump: mammoth(0, true, false, 'frost'), enraged: [mammoth(0, false, true, 'frost'), mammoth(1, false, true, 'frost')] }
  };

  const items = {};
  ['heart','emptyHeart','axe','rock','ice_rock','spear_proj','hammer_proj','fireball_proj','meat','apple','banana','cheese','burger','icecream','fish','roast','amber','chili','shield','magnet','feather','bomb','golden_egg'].forEach(key => { items[key] = icon(key); });
  Object.entries({
    '❤️':'heart', '❤':'heart', '🖤':'emptyHeart',
    '🪓':'axe', '🪨':'rock', '❄️':'ice_rock',
    '🔱':'spear_proj', '🔨':'hammer_proj', '🔥':'fireball_proj',
    '🍖':'meat', '🍎':'apple', '🍌':'banana', '🧀':'cheese', '🍔':'burger', '🍨':'icecream',
    '🐟':'fish', '🍗':'roast', '💎':'amber',
    '🌶️':'chili', '🌶':'chili', '🛡️':'shield', '🛡':'shield',
    '🧲':'magnet', '⚡':'feather', '💣':'bomb', '👑':'golden_egg'
  }).forEach(([symbol, key]) => { items[symbol] = items[key]; });

  const themes = ['jungle', 'swamp', 'cave', 'ice', 'desert', 'volcano', 'sky', 'boss'];
  const totemByTheme = {};
  const mushroomByTheme = {};
  const movingByTheme = {};
  const crumbleByTheme = {};
  const tiles = {};
  themes.forEach(t => {
    totemByTheme[t] = [totem(0, t), totem(1, t), totem(2, t)];
    mushroomByTheme[t] = mushroom(t);
    movingByTheme[t] = movingPlatform(t);
    crumbleByTheme[t] = crumblePlatform(t);
    tiles[t] = tile(t);
  });

  const environment = {
    dolmen: { start: dolmen('start'), closed: dolmen('closed'), open: dolmen('open'), checkpoint: dolmen('checkpoint') },
    totem: totemByTheme.jungle,
    totemByTheme,
    mushroom: mushroomByTheme.jungle,
    mushroomByTheme,
    movingByTheme,
    crumbleByTheme
  };

  function draw(ctx, asset, x, y, w = asset.width, h = asset.height) {
    ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(asset, Math.round(x), Math.round(y), Math.round(w), Math.round(h)); ctx.restore();
  }

  // Slice cells from pre-normalized RGBA transparent PNG sheets using pure drawImage
  // so it works seamlessly on both file:// and https:// without canvas tainting.
  function sliceGridFrames(img, expectedCount, cellW, cellH) {
    const frames = [];
    for (let i = 0; i < expectedCount; i++) {
      const out = document.createElement('canvas');
      out.width = cellW;
      out.height = cellH;
      const octx = out.getContext('2d');
      octx.imageSmoothingEnabled = false;
      octx.drawImage(img, i * cellW, 0, cellW, cellH, 0, 0, cellW, cellH);
      frames.push(out);
    }
    return frames;
  }

  function refreshBestiaryDom() {
    document.querySelectorAll('.bestiary-icon').forEach((canvasEl) => {
      const entry = sprites[canvasEl.dataset.sprite];
      const sprite = entry && (entry.walk || entry.fly || entry.idle)[0];
      if (!sprite) return;
      const context = canvasEl.getContext('2d');
      context.clearRect(0, 0, canvasEl.width, canvasEl.height);
      context.imageSmoothingEnabled = false;
      const scale = Math.min(canvasEl.width / sprite.width, canvasEl.height / sprite.height);
      const width = Math.round(sprite.width * scale);
      const height = Math.round(sprite.height * scale);
      context.drawImage(sprite, Math.round((canvasEl.width - width) / 2), Math.round((canvasEl.height - height) / 2), width, height);
    });
  }

  function refreshItemsDom() {
    document.querySelectorAll('canvas[data-item]').forEach((canvasEl) => {
      const sprite = items[canvasEl.dataset.item];
      if (!sprite) return;
      const context = canvasEl.getContext('2d');
      context.clearRect(0, 0, canvasEl.width, canvasEl.height);
      context.imageSmoothingEnabled = false;
      context.drawImage(sprite, 2, 2, canvasEl.width - 4, canvasEl.height - 4);
    });
  }

  const sheetIdleRun = new Image();
  const sheetAttack = new Image();
  let idleRunFrames = null;
  let attackFrames = null;

  function applyExtractedSamSprites() {
    if (idleRunFrames && idleRunFrames.length >= 4) {
      const [idle0, run0, run1, jump0] = idleRunFrames;
      const idle1 = document.createElement('canvas');
      idle1.width = idle0.width;
      idle1.height = idle0.height;
      idle1.getContext('2d').drawImage(idle0, 0, 2);

      sprites.sam.idle = [idle0, idle1];
      sprites.sam.run = [run0, idle0, run1, idle1];
      sprites.sam.jump = jump0;
      sprites.sam.fall = jump0;
      sprites.sam.hurt = jump0;
    }
    if (attackFrames && attackFrames.length >= 2) {
      sprites.sam.windup = attackFrames[0];
      sprites.sam.attack = attackFrames[1];
    }
    refreshBestiaryDom();
  }

  sheetIdleRun.onload = () => {
    idleRunFrames = sliceGridFrames(sheetIdleRun, 4, 128, 112);
    applyExtractedSamSprites();
  };
  sheetAttack.onload = () => {
    attackFrames = sliceGridFrames(sheetAttack, 2, 128, 112);
    applyExtractedSamSprites();
  };
  sheetIdleRun.src = 'assets/sam_idle_run.png';
  sheetAttack.src = 'assets/sam_attack.png';

  // Load 16-bit Monsters Sheet (dino, boar, ptero, gator, saber, lava_dino - 96x72 each)
  const sheetMonsters = new Image();
  sheetMonsters.onload = () => {
    const mFrames = sliceGridFrames(sheetMonsters, 6, 96, 72);
    const keys = ['dino', 'boar', 'ptero', 'gator', 'saber', 'lava_dino'];
    keys.forEach((key, idx) => {
      const f0 = mFrames[idx];
      if (!f0) return;

      // Second animation frame (stride/flap bounce)
      const f1 = document.createElement('canvas');
      f1.width = 96;
      f1.height = 72;
      const ctx1 = f1.getContext('2d');
      ctx1.imageSmoothingEnabled = false;
      if (key === 'ptero') {
        ctx1.drawImage(f0, 0, 0, 96, 72, 2, 6, 92, 62);
      } else {
        ctx1.drawImage(f0, 0, 0, 96, 72, 1, 3, 94, 69);
      }

      // Stunned frame with golden dizzy stars
      const st = document.createElement('canvas');
      st.width = 96;
      st.height = 72;
      const stCtx = st.getContext('2d');
      stCtx.imageSmoothingEnabled = false;
      stCtx.drawImage(f0, 0, 0, 96, 72, 2, 8, 92, 64);
      stCtx.fillStyle = '#ffe066';
      stCtx.fillRect(30, 4, 6, 6);
      stCtx.fillRect(48, 2, 6, 6);
      stCtx.fillRect(64, 5, 6, 6);

      if (key === 'ptero') {
        sprites[key] = { fly: [f0, f1], stunned: st };
      } else {
        sprites[key] = { walk: [f0, f1], stunned: st };
      }
    });
    refreshBestiaryDom();
  };
  sheetMonsters.src = 'assets/monsters_sheet.png';

  // Load 16-bit Bosses Sheet (frost_boss, boss - 160x140 each)
  const sheetBosses = new Image();
  sheetBosses.onload = () => {
    const bFrames = sliceGridFrames(sheetBosses, 2, 160, 140);
    const bossKeys = ['frost_boss', 'boss'];
    bossKeys.forEach((key, idx) => {
      const f0 = bFrames[idx];
      if (!f0) return;

      const f1 = document.createElement('canvas');
      f1.width = 160;
      f1.height = 140;
      const ctx1 = f1.getContext('2d');
      ctx1.imageSmoothingEnabled = false;
      ctx1.drawImage(f0, 0, 0, 160, 140, 2, 4, 156, 136);

      const makeEnraged = (src) => {
        const e = document.createElement('canvas');
        e.width = 160;
        e.height = 140;
        const ectx = e.getContext('2d');
        ectx.imageSmoothingEnabled = false;
        ectx.drawImage(src, 0, 0);
        ectx.globalCompositeOperation = 'source-atop';
        ectx.fillStyle = key === 'frost_boss' ? 'rgba(255, 70, 120, 0.28)' : 'rgba(255, 50, 0, 0.30)';
        ectx.fillRect(0, 0, 160, 140);
        return e;
      };

      const jmp = document.createElement('canvas');
      jmp.width = 160;
      jmp.height = 140;
      const jctx = jmp.getContext('2d');
      jctx.imageSmoothingEnabled = false;
      jctx.drawImage(f0, 0, -4);

      sprites[key] = {
        walk: [f0, f1],
        enraged: [makeEnraged(f0), makeEnraged(f1)],
        jump: jmp
      };
    });
    refreshBestiaryDom();
  };
  sheetBosses.src = 'assets/bosses_sheet.png';

  // Load 16-bit Items Sheet (11 items - 64x64 each)
  const sheetItems = new Image();
  sheetItems.onload = () => {
    const iFrames = sliceGridFrames(sheetItems, 11, 64, 64);
    const itemDefs = [
      { key: 'meat', emoji: '🍖' },
      { key: 'burger', emoji: '🍔' },
      { key: 'apple', emoji: '🍎' },
      { key: 'banana', emoji: '🍌' },
      { key: 'cheese', emoji: '🧀' },
      { key: 'icecream', emoji: '🍨' },
      { key: 'fish', emoji: '🐟' },
      { key: 'roast', emoji: '🍗' },
      { key: 'amber', emoji: '💎' },
      { key: 'axe', emoji: '🪓' },
      { key: 'heart', emoji: '❤️' }
    ];
    itemDefs.forEach((def, idx) => {
      const icon = iFrames[idx];
      if (!icon) return;
      items[def.key] = icon;
      items[def.emoji] = icon;
    });

    // Build dimmed emptyHeart from the 16-bit ruby heart
    if (items.heart) {
      const eh = document.createElement('canvas');
      eh.width = 64;
      eh.height = 64;
      const ectx = eh.getContext('2d');
      ectx.imageSmoothingEnabled = false;
      ectx.globalAlpha = 0.38;
      ectx.drawImage(items.heart, 0, 0);
      ectx.globalCompositeOperation = 'source-atop';
      ectx.globalAlpha = 1;
      ectx.fillStyle = 'rgba(30, 22, 18, 0.65)';
      ectx.fillRect(0, 0, 64, 64);
      items.emptyHeart = eh;
    }

    refreshItemsDom();
  };
  sheetItems.src = 'assets/items_sheet.png';

  // Load 16-bit Dolmens Sheet (start, checkpoint, closed, open - 128x112 each)
  const sheetDolmens = new Image();
  sheetDolmens.onload = () => {
    const dFrames = sliceGridFrames(sheetDolmens, 4, 128, 112);
    if (dFrames.length >= 4) {
      environment.dolmen.start = dFrames[0];
      environment.dolmen.checkpoint = dFrames[1];
      environment.dolmen.closed = dFrames[2];
      environment.dolmen.open = dFrames[3];

      // Create unlit/dimmed checkpoint shrine for before checkpoint is activated
      const cpOff = document.createElement('canvas');
      cpOff.width = 128;
      cpOff.height = 112;
      const cctx = cpOff.getContext('2d');
      cctx.imageSmoothingEnabled = false;
      cctx.drawImage(dFrames[1], 0, 0);
      cctx.globalCompositeOperation = 'source-atop';
      cctx.fillStyle = 'rgba(25, 22, 30, 0.35)';
      cctx.fillRect(0, 0, 128, 112);
      environment.dolmen.checkpointOff = cpOff;
    }
  };
  sheetDolmens.src = 'assets/dolmens_sheet.png';

  // Load 16-bit Props Sheet (mushroom, chest intact, chest cracked, chest open - 64x64 each)
  const sheetProps = new Image();
  sheetProps.onload = () => {
    const pFrames = sliceGridFrames(sheetProps, 4, 64, 64);
    if (pFrames.length >= 4) {
      const [mushBase, chest0, chest1, chest2] = pFrames;
      environment.mushroom = mushBase;
      environment.totem = [chest0, chest1, chest2];

      themes.forEach((t) => {
        environment.mushroomByTheme[t] = mushBase;
        environment.totemByTheme[t] = [chest0, chest1, chest2];
      });
    }
  };
  sheetProps.src = 'assets/props_sheet.png';

  // Load 16-bit Heroes Sheet (uga, brok, tara - 128x112 each)
  const sheetHeroes = new Image();
  const sheetHeroesAttack = new Image();
  let heroBaseFrames = null;
  let heroAttackFrames = null;

  function applyHeroesSprites() {
    if (!heroBaseFrames || heroBaseFrames.length < 3) return;
    const heroKeys = ['uga', 'brok', 'tara'];
    heroKeys.forEach((key, idx) => {
      const base = heroBaseFrames[idx];
      if (!base) return;

      const makePose = (dx, dy, scaleW, scaleH) => {
        const c = document.createElement('canvas');
        c.width = 128;
        c.height = 112;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(base, 0, 0, 128, 112, dx, dy, scaleW, scaleH);
        return c;
      };

      const idle0 = base;
      const idle1 = makePose(0, 2, 128, 110);
      const run0 = makePose(3, -3, 124, 112);
      const run1 = makePose(-2, 1, 126, 110);
      const jump0 = makePose(0, -5, 126, 112);

      // Custom high-quality 16-bit windup & attack frames from heroes_attack.png
      let windup = makePose(-4, -2, 126, 112);
      let attack = makePose(6, 1, 122, 111);
      if (heroAttackFrames && heroAttackFrames.length >= 6) {
        windup = heroAttackFrames[idx * 2];
        attack = heroAttackFrames[idx * 2 + 1];
      }

      sprites[key] = {
        idle: [idle0, idle1],
        run: [run0, idle0, run1, idle1],
        jump: jump0,
        fall: jump0,
        hurt: windup,
        windup,
        attack
      };
    });
    refreshBestiaryDom();
  }

  sheetHeroes.onload = () => {
    heroBaseFrames = sliceGridFrames(sheetHeroes, 3, 128, 112);
    applyHeroesSprites();
  };
  sheetHeroesAttack.onload = () => {
    heroAttackFrames = sliceGridFrames(sheetHeroesAttack, 6, 128, 112);
    applyHeroesSprites();
  };
  sheetHeroes.src = 'assets/heroes_sheet.png';
  sheetHeroesAttack.src = 'assets/heroes_attack.png';

  // Load 16-bit Power-Up Items Sheet (chili, shield, magnet, feather, bomb, golden_egg - 64x64 each)
  const sheetPowerups = new Image();
  sheetPowerups.onload = () => {
    const pFrames = sliceGridFrames(sheetPowerups, 6, 64, 64);
    const powerDefs = [
      { key: 'chili', emojis: ['🌶️', '🌶'] },
      { key: 'shield', emojis: ['🛡️', '🛡'] },
      { key: 'magnet', emojis: ['🧲'] },
      { key: 'feather', emojis: ['⚡'] },
      { key: 'bomb', emojis: ['💣'] },
      { key: 'golden_egg', emojis: ['👑'] }
    ];
    powerDefs.forEach((def, idx) => {
      const iconCanvas = pFrames[idx];
      if (!iconCanvas) return;
      items[def.key] = iconCanvas;
      def.emojis.forEach((em) => { items[em] = iconCanvas; });
    });
    refreshItemsDom();
  };
  sheetPowerups.src = 'assets/powerups_sheet.png';

  window.PixelAssets = { images, sprites, items, environment, tiles, draw, refreshBestiaryDom, refreshItemsDom };
})();
