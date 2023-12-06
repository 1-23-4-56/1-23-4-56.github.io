let writinRCT;
let mousePath = [];

class WritingRect {
  constructor(x, y, sideLength) {
    this.x = x;
    this.y = y;
    this.sideLength = sideLength;
    this.content = createGraphics(sideLength, sideLength);
    this.content.background(255);
    this.strokeColor = color(0);
    this.strokeWeightVal = 2;
  }

  setColor(c) {
    this.strokeColor = c;
  }

  setLineWidth(w) {
    this.strokeWeightVal = w;
  }

  display() {
    push();
    let borderRadius = 15;
    let borderColor = color(8, 130, 2);

    rectMode(CENTER);
    noStroke();
    image(this.content, this.x - this.sideLength / 2, this.y - this.sideLength / 2);
    stroke(borderColor);
    strokeWeight(5);
    noFill();
    rect(this.x, this.y, this.sideLength + 5, this.sideLength + 5, borderRadius);
    pop();
  }

  writeOnMouseDrag() {
    if (
      mouseX > this.x - this.sideLength / 2 &&
      mouseX < this.x + this.sideLength / 2 &&
      mouseY > this.y - this.sideLength / 2 &&
      mouseY < this.y + this.sideLength / 2
    ) {
      this.content.stroke(this.strokeColor);
      this.content.strokeWeight(this.strokeWeightVal);
      for (let i = 0; i < mousePath.length - 1; i++) {
        let currentPos = mousePath[i];
        let nextPos = mousePath[i + 1];
        this.content.line(
          currentPos.x - (this.x - this.sideLength / 2),
          currentPos.y - (this.y - this.sideLength / 2),
          nextPos.x - (this.x - this.sideLength / 2),
          nextPos.y - (this.y - this.sideLength / 2)
        );
      }
    }
  }

  getImg() {
    return this.content.get();
  }
}

let percRects = [];

class percentRect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.curveRadius = 2;
    this.borderColor = color(8, 130, 2);
    this.borderWidth = 5;
    this.fillColor = color(60, 60, 60);
    this.percentage = 25.01;
  }

  setPercentage(p) {
    this.percentage = Math.trunc(constrain(p, 0, 100));
  }

  display(number) {
    push();

    rectMode(CENTER);

    stroke(this.borderColor);
    strokeWeight(this.borderWidth);
    fill(this.fillColor);
    rect(this.x, this.y, this.width, this.height, this.curveRadius);

    let redFillWidth = map(this.percentage, 0, 100, 0, this.width);
    noStroke();
    fill(255, 0, 0);
    rect(this.x - this.width / 2 + redFillWidth / 2, this.y, redFillWidth, this.height, 0, this.curveRadius, this.curveRadius, 0);


    stroke(this.borderColor);
    strokeWeight(this.borderWidth);
    noFill();
    rect(this.x, this.y, this.width, this.height, this.curveRadius);

    textAlign(CENTER);
    noStroke();
    fill(255);
    textSize(25);
    text(number, this.x - (this.width / 2 + 35), this.y + 8);
    text(this.percentage + "%", this.x + (this.width / 2 + 60), this.y + 8);

    pop();
  }
}

//###########################################################

let model;

let loadingImage;
let loadImgHeight;

var loaded = false;
var isModelLoaded = false;
var isTestingTheModel = false;

async function setup() {
  loadingImage = await loadImage("load.png");
  loadImgHeight = loadingImage.height;

  loadTheModel();

  createCanvas(windowWidth, windowHeight);

  writinRCT = new WritingRect(width / 4, height / 2, 400);
  writinRCT.setColor(color(0));
  writinRCT.setLineWidth(25);

  var centerX = (((3 * width / 4 + 202.5) - 2 * width / 4) / 2) + width / 2;
  var widthOfRect = (3 * width / 4 + 202.5) - 2 * width / 4;
  var rectX = (centerX - (widthOfRect / 2)) + 125;

  var restriciton = 30;
  var initialHeight = (height / 2) - ((405 - restriciton) / 2);
  var interval = ((405 - restriciton)) / 10;

  for (var i = 0; i < 10; i++) {
    percRects[i] = new percentRect(rectX, (initialHeight + i * interval) + interval / 2, 75, 25);
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  writinRCT.x = width / 4;
  writinRCT.y = height / 2;

  var centerX = (((3 * width / 4 + 202.5) - 2 * width / 4) / 2) + width / 2;
  var widthOfRect = (3 * width / 4 + 202.5) - 2 * width / 4;
  var rectX = (centerX - (widthOfRect / 2)) + 125;

  var restriciton = 30;
  var initialHeight = (height / 2) - ((405 - restriciton) / 2);
  var interval = ((405 - restriciton)) / 10;

  for (var i = 0; i < 10; i++) {
    percRects[i].x = rectX;
    percRects[i].y = (initialHeight + i * interval) + interval / 2;
  }
}

async function draw() {

  if (loaded) {
    whenLoadedLoop();
  } else {
    if (isModelLoaded && !loaded) {
      if (!isTestingTheModel) {
        testTheModel();
        isTestingTheModel = true;
      }
      whenLoading();
    } else {
      whenLoading();
    }
  }
}

//######################################

async function loadTheModel() {

  model = await tf.loadLayersModel('modelJS/model.json');
  console.log('model loaded');

  isModelLoaded = true;
}

async function testTheModel() {
  const inputImage = document.getElementById('testImage');
  const [result, probClass0, probClass1, probClass2, probClass3, probClass4, probClass5, probClass6, probClass7, probClass8, probClass9] = await runPrediction(model, inputImage);

  console.log('test result:', result == 3);

  if (result == 3) loaded = true;
  else location.reload();

}

//######################################

function drawBG() {
  background(45);

  let borderRadius = 15;
  let borderColor = color(8, 130, 2);

  let smallRectWidth = 300;
  let smallRectHeight = 80;
  let smallRectX = width - smallRectWidth - borderRadius;
  let smallRectY = height - smallRectHeight - borderRadius;

  let textInRect = "Creato da:\nLuca Lazzaroni";

  push();
  fill(45);
  stroke(borderColor);
  strokeWeight(5);
  rect(borderRadius, borderRadius, width - 2 * borderRadius, height - 2 * borderRadius, borderRadius);

  fill(60);
  strokeWeight(5);
  rect(smallRectX, smallRectY, smallRectWidth, smallRectHeight, borderRadius);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18);
  text(textInRect, smallRectX + smallRectWidth / 2, smallRectY + smallRectHeight / 2);
  pop();
}

//######################################

function whenLoading() {
  drawBG();

  push();
  imageMode(CENTER);
  textAlign(CENTER);

  noStroke();
  fill(255);
  textSize(20);
  text("Caricamento...\nL'operazione potrebbe richiedere un minuto.", width / 2, height / 2 + (293 / 2));

  push();
  translate(width / 2, height / 2);
  rotate(millis() / 350);
  image(loadingImage, 0, 0);
  pop();

  pop();
}

function twoText(text1, text2, x, y, height1, height2) {
  textSize(height1);
  let text1Width = textWidth(text1);

  textSize(height2);
  let text2Width = textWidth(text2);

  let maxWidth = max(text1Width, text2Width);

  let spacing = max(height1, height2) * 0.2;

  let y1 = y - height1 / 2;
  let y2 = y + height2 / 2 + spacing;

  let blockWidth = maxWidth;

  let blockX = x - blockWidth / 2;

  textSize(height1);
  text(text1, blockX + (blockWidth - text1Width) / 2, y1);

  textSize(height2);
  text(text2, blockX + (blockWidth - text2Width) / 2, y2);
}

function whenLoadedLoop() {
  drawBG();

  push();
  writinRCT.display();

  let borderRadius = 15;
  let borderColor = color(8, 130, 2);

  rectMode(CENTER);
  stroke(borderColor);
  strokeWeight(5);
  fill(60);
  rect((((3 * width / 4 + 202.5) - 2 * width / 4) / 2) + width / 2, height / 2, (3 * width / 4 + 202.5) - 2 * width / 4, 405, borderRadius);

  for (var i = 0; i < 10; i++) {
    percRects[i].display(i);
  }

  textAlign(CENTER);
  noStroke();
  fill(255);
  textSize(25);

  var num = 2;

  var centerX = (((3 * width / 4 + 202.5) - 2 * width / 4) / 2) + width / 2;
  var widthOfRect = (3 * width / 4 + 202.5) - 2 * width / 4;
  var textEnd = (centerX - (widthOfRect / 2) + 250);
  var newTextCenter = (((centerX + (widthOfRect / 2)) - textEnd) / 2) + textEnd;

  push();
  textAlign(LEFT);
  twoText("Numero scritto:", num, newTextCenter, height / 2, 25, 45);
  pop();

  pop();
}

function mousePressed() {
  mousePath = [];

  if (mouseX > width - 100) {
    predict();
  }
}

function mouseDragged() {
  writinRCT.writeOnMouseDrag();
  mousePath.push(createVector(mouseX, mouseY));
}

async function predict() {
  save(writinRCT.getImg(), "ugo.png");

  const inputImage = writinRCT.getImg().canvas;
  const [result, probClass0, probClass1, probClass2, probClass3, probClass4, probClass5, probClass6, probClass7, probClass8, probClass9] = await runPrediction(model, inputImage);

  percRects[0].setPercentage(probClass0);
  percRects[1].setPercentage(probClass0);
  percRects[2].setPercentage(probClass0);
  percRects[3].setPercentage(probClass0);
  percRects[4].setPercentage(probClass0);
  percRects[5].setPercentage(probClass0);
  percRects[6].setPercentage(probClass0);
  percRects[7].setPercentage(probClass0);
  percRects[8].setPercentage(probClass0);
  percRects[9].setPercentage(probClass0);

  console.log("risultato:", result);

}