'use strict';

/* HELPER: Checks Whether an Element Exists
----------------------------------------------------------------------------------------------------*/
(function( $ ) {

  $.fn.extend({
    exists: function() {
      if ( this.length > 0 ) {
        return true;
      } else {
        return false;
      }
    }
  });

})( jQuery );



(function(){
  const canvas = document.getElementById('wc');
  const container = document.getElementById('wave-bg');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const NUM_LINES = 28;
  const AMPLITUDE_BASE = 0.13;
  const AMPLITUDE_SPREAD = 0.07;
  const FREQ = 0.0055;
  const SPEED = 0.012;
  let t = 0;

  function getY(x, lineIndex, time) {
    const W = canvas.width;
    const H = canvas.height;
    const mid = H * 0.5;
    const norm = (lineIndex / (NUM_LINES - 1)) - 0.5;
    
    const amp1 = H * (AMPLITUDE_BASE + AMPLITUDE_SPREAD * Math.sin(norm * Math.PI * 1.2));
    const amp2 = H * (AMPLITUDE_BASE * 0.6 + AMPLITUDE_SPREAD * 0.5 * Math.cos(norm * Math.PI));

    const phase1 = norm * 1.8;
    const phase2 = norm * 2.4;

    const y1 = amp1 * Math.sin(x * FREQ + time * 0.8 + phase1);
    const y2 = amp2 * Math.sin(x * FREQ * 1.5 - time * 1.1 + phase2 + Math.PI * 0.3);
    const y3 = H * 0.025 * Math.sin(x * FREQ * 0.5 + time * 0.3 + norm * 3);

    return mid + y1 + y2 + y3 + norm * H * 0.06;
  }

  function lerpColor(c1, c2, t) {
    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * t),
      Math.round(c1[1] + (c2[1] - c1[1]) * t),
      Math.round(c1[2] + (c2[2] - c1[2]) * t),
    ];
  }

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const colorA = [0, 210, 220];
    const colorB = [50, 130, 255];
    const colorC = [255, 255, 255];

    for (let i = 0; i < NUM_LINES; i++) {
      const frac = i / (NUM_LINES - 1);
      
      let col;
      if (frac < 0.4) col = lerpColor(colorA, colorB, frac / 0.4);
      else if (frac < 0.7) col = lerpColor(colorB, colorC, (frac - 0.4) / 0.3);
      else col = lerpColor(colorC, colorA, (frac - 0.7) / 0.3);

      const distFromEdge = Math.abs(frac - 0.5) * 2;
      const opacity = 0.12 + 0.55 * (1 - distFromEdge * distFromEdge);

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${opacity.toFixed(3)})`;
      ctx.lineWidth = 0.9;

      const STEPS = Math.ceil(W / 2);
      let started = false;
      for (let s = 0; s <= STEPS; s++) {
        const x = (s / STEPS) * W;
        const y = getY(x, i, t);
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    t += SPEED;
    requestAnimationFrame(draw);
  }

  draw();
})();