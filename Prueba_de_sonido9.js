let walkersTop = [];
let walkersBottom = [];
let colors = [];

let posTop;
let posBottom;
let speed = 3;
let spacing = 30;
let walkerWidth = 30;
let walkerHeight = 30;

let rotating = false;
let rotating2 = false;
let rotationAngleTop = 0;
let rotationAngleBottom = 0;
let startRotationAngleTop = 0;
let startRotationAngleBottom = 0;

let mic, amp;
let audioReady = false;
let flashAlpha = 0; // 🆕 Controla el brillo del flash

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  colors = [
    color(200, 0, 0,70)
    color(255, 127, 0,70)
    color(240, 240, 0,70)
    color(0, 200, 0,70)
    color(0, 0, 255,70)
    color(75, 0, 130,70)
    color(139, 0, 255,70)
  ];

  let boton = createButton("Activar Audio");
  boton.position(10, 10);
  boton.mousePressed(iniciarAudio);

  posTop = createVector(-walkerWidth, height * 0.25);
  posBottom = createVector(-walkerWidth, height * 0.75);

  for (let i = 0; i < colors.length; i++) {
    walkersTop.push({
      yOffset: (i - (colors.length - 1) / 2) * spacing,
      col: colors[i],
    });

    walkersBottom.push({
      yOffset: (i - (colors.length - 1) / 2) * spacing,
      col: colors[colors.length - 1 - i],
    });
  }
}

function iniciarAudio() {
  userStartAudio().then(() => {
    getAudioContext().resume();
    mic = new p5.AudioIn();
    mic.start(() => {
      amp = new p5.Amplitude();
      amp.setInput(mic);
      setTimeout(() => {
        audioReady = true;
      }, 200);
    });
  });
}

function draw() {
  //background(255);

  if (!audioReady || !amp || typeof amp.getLevel !== 'function') return;

  let vol = amp.getLevel();
  let highThreshold = 0.15;
  let lowThreshold = 0.05;

  if (!rotating && !rotating2) {
    if (vol > highThreshold) {
      rotating = true;
      startRotationAngleTop = rotationAngleTop;
      startRotationAngleBottom = rotationAngleBottom;
    } else if (vol > lowThreshold) {
      rotating2 = true;
      startRotationAngleTop = rotationAngleTop;
      startRotationAngleBottom = rotationAngleBottom;
    }
  }

  let rotationStep = 0.03;
  let maxDelta = HALF_PI;

  if (rotating) {
    rotationAngleTop += rotationStep;
    rotationAngleBottom -= rotationStep;
    if (rotationAngleTop - startRotationAngleTop >= maxDelta) {
      rotationAngleTop = startRotationAngleTop + maxDelta;
      rotationAngleBottom = startRotationAngleBottom - maxDelta;
      rotating = false;
    }
  }

  if (rotating2) {
    rotationAngleTop -= rotationStep;
    rotationAngleBottom += rotationStep;
    if (startRotationAngleTop - rotationAngleTop >= maxDelta) {
      rotationAngleTop = startRotationAngleTop - maxDelta;
      rotationAngleBottom = startRotationAngleBottom + maxDelta;
      rotating2 = false;
    }
  }

  let dxTop = speed * cos(rotationAngleTop);
  let dyTop = speed * sin(rotationAngleTop);
  posTop.x += dxTop;
  posTop.y += dyTop;

  let dxBottom = speed * cos(rotationAngleBottom);
  let dyBottom = speed * sin(rotationAngleBottom);
  posBottom.x += dxBottom;
  posBottom.y += dyBottom;

  //  Envolver posiciones
  wrapPosition(posTop);
  wrapPosition(posBottom);

  // Dibujar caminantes superiores
  push();
  translate(posTop.x, posTop.y);
  rotate(rotationAngleTop);
  for (let i = 0; i < walkersTop.length; i++) {
    fill(walkersTop[i].col);
    ellipse(0, walkersTop[i].yOffset, walkerWidth, walkerHeight);
  }
  pop();

  // Dibujar caminantes inferiores
  push();
  translate(posBottom.x, posBottom.y);
  rotate(rotationAngleBottom);
  for (let i = 0; i < walkersBottom.length; i++) {
    fill(walkersBottom[i].col);
    ellipse(0, walkersBottom[i].yOffset, walkerWidth, walkerHeight);
  }
  pop();
// Intento de reinicio
if (flashAlpha > 0) {
  fill(255, flashAlpha);
  rect(0, 0, width, height);
  flashAlpha -= 10; // Disminuir suavemente
}
  fill(0);
  textSize(14);
  text("Habla fuerte para rotar en una dirección. Voz suave para rotar en la opuesta.", 10, height - 20);
  text("Amplitud: " + nf(vol, 1, 3), 10, height - 40);
}

// Función para limitar la pantalla
function wrapPosition(p) {
  if (
    p.x > width + walkerWidth ||
    p.x < -walkerWidth ||
    p.y > height + walkerHeight ||
    p.y < -walkerHeight
  ) {
    resetSketch();
  }
}
function resetSketch() {
  posTop = createVector(-walkerWidth, height * 0.25);
  posBottom = createVector(-walkerWidth, height * 0.75);
  rotationAngleTop = 0;
  rotationAngleBottom = 0;
  startRotationAngleTop = 0;
  startRotationAngleBottom = 0;
  rotating = false;
  rotating2 = false;

  walkersTop = [];
  walkersBottom = [];

  for (let i = 0; i < colors.length; i++) {
    walkersTop.push({
      yOffset: (i - (colors.length - 1) / 2) * spacing,
      col: colors[i],
    });

    walkersBottom.push({
      yOffset: (i - (colors.length - 1) / 2) * spacing,
      col: colors[colors.length - 1 - i],
    });
  }

  background(255); // Limpia pantalla al reiniciar
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
