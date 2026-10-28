/* Pre-rendered, two-pixel-grid artwork. All frames are ordinary canvases so the
 * game and the catalogue can share the same artwork without a sprite loader. */
(function () {
  'use strict';

  const images = {};
  for (const [key, path] of Object.entries({ jungle: 'bg_jungle.png', cave: 'bg_cave.png', boss: 'bg_boss.png', hero: 'hero_banner.png' })) {
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
    // Canvas paths can introduce partially transparent edge pixels even on an
    // integer grid. Snap their coverage before enlarging to keep the silhouettes
    // as hard-edged pixels on every browser.
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

  // Sam is drawn facing right. Extra transparent space accommodates his club.
  function sam(pose, frame = 0) {
    return canvas(32, 32, c => {
      const stride = pose === 'run' ? [0, 2, 0, -2][frame] : 0;
      const hop = pose === 'jump' ? -2 : pose === 'fall' ? 1 : pose === 'idle' && frame === 1 ? -1 : pose === 'run' && frame === 2 ? -1 : 0;
      if (pose === 'attack') {
        poly(c, [[20,4],[25,5],[30,10],[31,15],[29,14],[28,10],[24,7]], '#e99b40', null);
        poly(c, [[24,3],[28,5],[31,9],[31,11],[27,7],[23,5]], '#ffe08b', null);
      }
      // Feet and legs
      poly(c, [[8,24+hop],[13,24+hop],[13+stride,29],[6+stride,29],[6+stride,27]], '#ad6d4c');
      poly(c, [[15,24+hop],[20,24+hop],[21-stride,28],[19-stride,30],[14-stride,30]], '#cd8a59');
      rect(c, 7+stride, 27, 4, 1, '#f2bd82'); rect(c, 15-stride, 28, 4, 1, '#f3c38d');
      // Tunic, with spotted hide and ragged hem
      poly(c, [[9,15+hop],[18,14+hop],[21,18+hop],[21,25+hop],[18,24+hop],[16,26+hop],[13,24+hop],[10,26+hop],[7,24+hop],[8,18+hop]], '#d88232');
      rect(c, 9,17+hop, 2, 5, '#f5bb55'); rect(c, 10,22+hop, 2, 2, '#5b3526');
      rect(c, 16,17+hop, 2, 2, '#683b27'); rect(c, 17,22+hop, 2, 2, '#683b27');
      // Head and hair
      poly(c, [[8,6+hop],[18,5+hop],[21,8+hop],[21,14+hop],[19,17+hop],[11,17+hop],[8,14+hop]], '#e9a96f');
      rect(c, 9,11+hop, 2, 4, '#c88058'); rect(c, 13,14+hop, 6, 2, '#d68f60');
      poly(c, [[7,10+hop],[8,5+hop],[11,3+hop],[13,4+hop],[16,2+hop],[20,5+hop],[21,9+hop],[18,8+hop],[17,10+hop],[14,8+hop],[12,10+hop]], '#4b2d24');
      rect(c, 10,5+hop, 5, 1, '#8e5438'); rect(c, 17,5+hop, 2, 1, '#8e5438');
      rect(c, 16,10+hop, 3, 3, '#fff4d8'); rect(c, 18,11+hop, 1, 2, '#241d1b');
      rect(c, 16,9+hop, 4, 1, '#4b2d24'); rect(c, 17,15+hop, 3, 1, pose === 'hurt' ? '#8c292c' : '#5d3327');
      // Arm and club use distinct windup / smash silhouettes.
      poly(c, [[17,17+hop],[20,17+hop],[23,20+hop],[22,22+hop],[19,21+hop],[17,20+hop]], '#e6a46b');
      if (pose === 'windup') {
        poly(c, [[20,18+hop],[19,8],[17,4],[20,2],[23,4],[23,8],[22,19+hop]], '#9a572b');
        rect(c, 19,5, 2, 4, '#d89548'); rect(c, 17,4, 2, 2, '#e9dfc4');
      } else if (pose === 'attack') {
        poly(c, [[21,19+hop],[25,21],[27,24],[26,27],[23,27],[21,24],[19,21+hop]], '#9a572b');
        rect(c, 23,22, 2, 3, '#d89548'); rect(c, 27,23, 2, 2, '#e9dfc4'); rect(c, 24,27, 2, 2, '#e9dfc4');
      } else {
        poly(c, [[20,19+hop],[25,15+hop],[28,15+hop],[30,17+hop],[29,21+hop],[26,22+hop],[22,21+hop]], '#9a572b');
        rect(c, 25,16+hop, 3, 1, '#d89548'); rect(c, 27,18+hop, 2, 1, '#d89548');
        rect(c, 27,13+hop, 2, 2, '#e9dfc4'); rect(c, 30,18+hop, 1, 2, '#e9dfc4');
      }
    });
  }

  function dinosaur(frame, stunned) {
    return canvas(32, 24, c => {
      const step = frame ? 2 : 0;
      poly(c, [[4,14],[1,10],[2,16],[7,18],[17,18],[20,14],[17,9],[9,9]], '#338650');
      poly(c, [[8,10],[10,7],[15,7],[17,9],[22,8],[25,5],[29,6],[30,11],[28,13],[21,13],[19,18],[10,18]], '#55ae56');
      poly(c, [[8,9],[10,6],[11,8],[13,5],[14,8],[16,6],[17,9]], '#b2cc5a');
      rect(c, 11,13, 7, 4, '#a8c66a'); rect(c, 13,15, 5, 2, '#d6d47b');
      rect(c, 24,7, 3, 3, '#f9f1cb'); rect(c, 26,8, 1, 2, '#282525');
      rect(c, 27,12, 2, 1, '#f5e9c8');
      poly(c, [[10,17],[13,17],[13,21-step],[10,22-step],[8,22-step],[8,20-step]], '#357c48');
      poly(c, [[17,17],[20,17],[20,20+step],[22,20+step],[22,22+step],[17,22+step]], '#2a7042');
      speckle(c, [[8,12],[10,11],[13,10],[16,11],[18,10],[21,9]], '#8bc368');
      if (stunned) { star(c, 5, 2, '#ffe879'); star(c, 15, 1, '#ffe879'); star(c, 23, 2, '#ffe879'); }
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

  function mammoth(frame, airborne, angry) {
    return canvas(64, 64, c => {
      const leg = airborne ? -3 : frame ? 3 : 0;
      const dark = angry ? '#5d2726' : '#53362f';
      const mid = angry ? '#a24b38' : '#966247';
      const light = angry ? '#d7784a' : '#c28a5d';
      // Huge body and shaggy fringe.
      poly(c, [[8,27],[11,18],[18,13],[36,14],[45,20],[48,31],[45,46],[39,51],[14,51],[8,46]], mid);
      poly(c, [[10,24],[14,18],[19,15],[34,16],[41,20],[43,26],[39,23],[37,28],[34,23],[31,29],[28,24],[25,29],[22,24],[19,29],[17,24],[13,28]], light);
      poly(c, [[12,45],[19,45],[20,55+leg],[18,58+leg],[10,58+leg],[9,55+leg]], dark);
      poly(c, [[31,45],[39,45],[40,55-leg],[38,58-leg],[30,58-leg],[29,55-leg]], dark);
      rect(c, 11,54+leg, 6, 2, mid); rect(c, 31,54-leg, 6, 2, mid);
      // Ear, head and long curling trunk.
      poly(c, [[30,22],[35,16],[43,16],[49,20],[51,28],[50,36],[47,40],[47,49],[51,51],[54,48],[55,51],[53,55],[48,56],[44,53],[42,41],[36,40]], mid);
      poly(c, [[31,24],[34,20],[39,20],[41,23],[39,33],[35,37],[31,33]], dark);
      rect(c, 33,23, 3, 8, light); rect(c, 46,38, 2, 11, light); rect(c, 48,50, 3, 1, light);
      // Ivory tusks, deliberately curved as stepped pixel silhouettes.
      poly(c, [[42,36],[47,38],[53,38],[57,34],[58,29],[60,27],[60,35],[57,40],[53,42],[46,42],[42,40]], '#f6e8c7');
      rect(c, 48,39, 6, 1, '#fff9df'); rect(c, 54,37, 2, 2, '#c8b898');
      // Crown, stones and rivets.
      poly(c, [[34,20],[33,12],[36,14],[39,9],[42,14],[47,11],[48,20]], '#8e9290');
      rect(c, 35,17, 12, 2, '#c4c3ad'); rect(c, 40,14, 2, 3, angry ? '#ff522a' : '#68c7ad');
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
      poly(c, [[21,22],[43,22],[43,52],[21,52]], state === 'open' ? '#235a55' : '#34383a');
      if (state === 'open') {
        rect(c, 24,25, 16, 24, '#398c7a'); rect(c, 27,27, 10, 20, '#67c9a2');
        star(c, 29,30, '#d9ffd6'); star(c, 34,40, '#c9ffce');
      } else {
        rect(c, 23,25, 18, 2, '#6f716a'); rect(c, 23,37, 18, 2, '#6f716a');
        rect(c, 30,25, 2, 26, '#5e615e');
      }
      const rune = state === 'open' ? '#aaffc9' : state === 'start' ? '#efcf82' : '#c2af88';
      for (let x = 13; x < 53; x += 9) { rect(c,x,14, 1, 4,rune); rect(c,x+1,15, 2, 1,rune); rect(c,x+2,16, 1, 2,rune); }
      speckle(c, [[9,16],[16,20],[27,8],[39,19],[52,13],[13,32],[17,43],[48,28],[51,44]], '#555e58');
    });
  }
  function totem(cracks) {
    return canvas(32, 32, c => {
      poly(c, [[5,29],[4,9],[8,4],[23,4],[28,9],[27,29]], '#777970');
      poly(c, [[7,9],[10,6],[22,6],[25,9],[24,12],[8,12]], '#b1af98', null);
      rect(c, 7,13, 2, 13, '#999b8a'); rect(c, 23,13, 2, 13, '#555d58');
      // carved bone, not a font glyph
      rect(c, 10,17, 12, 3, '#d9caa1'); rect(c, 9,15, 3, 7, '#d9caa1'); rect(c, 20,15, 3, 7, '#d9caa1');
      rect(c, 12,18, 8, 1, '#9a927c');
      if (cracks > 0) { rect(c, 15,5, 1, 3, ink); rect(c, 16,8, 2, 1, ink); rect(c, 18,9, 1, 4, ink); }
      if (cracks > 1) { rect(c, 18,12, 2, 1, ink); rect(c, 20,13, 1, 3, ink); rect(c, 12,22, 1, 3, ink); rect(c, 10,25, 2, 1, ink); rect(c, 9,26, 1, 3, ink); }
      speckle(c, [[6,11],[10,8],[21,9],[26,12],[7,24],[24,25],[16,27]], '#5a635e');
    });
  }
  function mushroom() {
    return canvas(24, 16, c => {
      poly(c, [[9,8],[15,8],[16,15],[8,15]], '#d9c29c'); rect(c, 10,10, 2, 4, '#fff0cb');
      poly(c, [[1,8],[3,4],[6,2],[18,2],[21,4],[23,8],[22,10],[2,10]], '#bb383a');
      rect(c, 4,4, 4, 2, '#ffe4c2'); rect(c, 14,3, 4, 2, '#ffe4c2'); rect(c, 9,7, 3, 2, '#f5c5ad');
      rect(c, 3,9, 18, 1, '#792b30');
    });
  }
  function tile(theme) {
    return canvas(16, 16, c => {
      const colors = theme === 'jungle' ? ['#563d31','#75523a','#a37a4a','#528c4c','#8fc070'] : theme === 'cave' ? ['#332b41','#51435c','#77647d','#725c87','#dd643f'] : ['#29272c','#4d3b3b','#795149','#9a4735','#ef6a37'];
      rect(c, 0,0, 16,16, colors[0]);
      rect(c, 0,3, 15,5, colors[1]); rect(c, 1,9, 7,6, colors[1]); rect(c, 9,9, 7,6, colors[1]);
      rect(c, 0,3, 14,1, colors[2]); rect(c, 1,9, 6,1, colors[2]); rect(c, 9,9, 7,1, colors[2]);
      rect(c, 0,0, 16,3, colors[3]); rect(c, 1,0, 5,1, colors[4]); rect(c, 9,1, 5,1, colors[4]);
      if (theme === 'jungle') { rect(c, 2,3, 3,2, colors[3]); rect(c, 10,3, 2,2, colors[3]); }
      else { rect(c, 5,6, 4,1, colors[4]); rect(c, 8,7, 1,2, colors[4]); rect(c, 11,12, 4,1, colors[4]); }
      speckle(c, [[2,6],[11,5],[4,12],[6,14],[10,11],[14,14]], colors[2]);
    });
  }

  const sprites = {
    sam: { idle: [sam('idle', 0), sam('idle', 1)], run: [0,1,2,3].map(i => sam('run', i)), jump: sam('jump'), fall: sam('fall'), windup: sam('windup'), attack: sam('attack'), hurt: sam('hurt') },
    dino: { walk: [dinosaur(0), dinosaur(1)], stunned: dinosaur(0, true) },
    boar: { walk: [boar(0), boar(1)], stunned: boar(0, true) },
    ptero: { fly: [ptero(0), ptero(1)] },
    boss: { walk: [mammoth(0, false, false), mammoth(1, false, false)], jump: mammoth(0, true, false), enraged: [mammoth(0, false, true), mammoth(1, false, true)] }
  };
  const items = {};
  ['heart','emptyHeart','axe','rock','meat','apple','banana','cheese','burger','icecream'].forEach(key => { items[key] = icon(key); });
  Object.entries({ '❤️':'heart', '❤':'heart', '🖤':'emptyHeart', '🪓':'axe', '🪨':'rock', '🍖':'meat', '🍎':'apple', '🍌':'banana', '🧀':'cheese', '🍔':'burger', '🍨':'icecream' }).forEach(([symbol, key]) => { items[symbol] = items[key]; });
  const environment = { dolmen: { start: dolmen('start'), closed: dolmen('closed'), open: dolmen('open') }, totem: [totem(0), totem(1), totem(2)], mushroom: mushroom() };
  const tiles = { jungle: tile('jungle'), cave: tile('cave'), boss: tile('boss') };
  function draw(ctx, asset, x, y, w = asset.width, h = asset.height) {
    ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(asset, Math.round(x), Math.round(y), Math.round(w), Math.round(h)); ctx.restore();
  }
  window.PixelAssets = { images, sprites, items, environment, tiles, draw };
})();
