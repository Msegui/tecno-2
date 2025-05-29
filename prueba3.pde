//Mateo Seguí
//comision 5
//Link al video: https://youtu.be/bnQjgkhKiUQ
int anchoDeModulo;
int altoDeModulo;
int cantidadXDeModulos;
int cantidadYDeModulos;
int cantidad=16;
int posX = 200;
int posY = 200;
float r = 20;
float  rd;
PImage Artopt;

void setup() {
  size(800, 400);
  cantidadXDeModulos = 1;
  cantidadYDeModulos = 1;
  anchoDeModulo = width/cantidadXDeModulos;
  altoDeModulo = height/cantidadYDeModulos;
  r = altoDeModulo/cantidad;
  rd = anchoDeModulo/cantidad;
  colorMode(HSB);
  Artopt=loadImage("Circulo arcoiris.jpg");
  Artopt.resize(400, 400);
}

void draw() {
  background(255);
  image(Artopt,0,0);
  for (int i = 0; i < cantidadXDeModulos; i++) {
    for (int j = 0; j < cantidadYDeModulos; j++) {
      dibujarModulo(i, j);
    }
  }
  image(Artopt,0,0);
}
void modulo(int x, int pX, int pY) {
  push();
  if (x % 2 == 0) {
    fill(0);
  } else {
    fill(x*255/cantidad, mouseX,mouseY);
  }
  translate(pX * anchoDeModulo, pY * altoDeModulo);
  rotate(radians(frameCount));
  rect(0, 0,  rd * x, r* pY);
  fill(x*255/cantidad, mouseX,mouseY);
  pop();
  }

void dibujarModulo(int parametroX, int parametroY) {
  for (int i = cantidad; i > 0; i--) {
    modulo(i, parametroX, parametroY);
  }
}

void mouseMoved() {
  cantidadYDeModulos  = int(map(mouseY, 0, height, 1, 20));
  cantidadXDeModulos  = int(map(mouseX, 0, width, 1, 20));
  anchoDeModulo = width/cantidadXDeModulos;
  altoDeModulo = height/cantidadYDeModulos;
  r = altoDeModulo/cantidad;
  rd = anchoDeModulo/cantidad;
}
