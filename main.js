let writinRCT;
let mousePath = [];

class WritingRect {
  constructor(x, y, sideLength) {
    this.x = x;
    this.y = y;
    this.sideLength = sideLength;
    this.content = createGraphics(sideLength, sideLength);
    this.content.background(255);
    this.strokeColor = 0;
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

  mouseOnThere() {
    return mouseX > this.x - this.sideLength / 2 &&
      mouseX < this.x + this.sideLength / 2 &&
      mouseY > this.y - this.sideLength / 2 &&
      mouseY < this.y + this.sideLength / 2;
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
    this.percentage = constrain(p, 0, 100).toFixed(2);
  }

  display(number) {
    push();

    rectMode(CENTER);

    stroke(this.borderColor);
    strokeWeight(this.borderWidth);
    fill(this.fillColor);
    rect(this.x, this.y, this.width, this.height, this.curveRadius);

    let redFillWidth = map(this.percentage, 0, 100, 2.5, this.width - 5);
    noStroke();
    fill(255, 0, 0);
    rect((this.x - this.width / 2 + redFillWidth / 2) + 2.5, this.y, redFillWidth, this.height, 0, this.curveRadius, this.curveRadius, 0);


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

let buttons = [];

class Button {
  constructor(x, y, width, height, label, clickFunction, type) {
    this.x = x - (width / 2);
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.clickFunction = clickFunction;
    this.isClicked = false;
    this.type = type;
  }

  display() {
    if (!mouseIsPressed) this.isClicked = false;
    let bgColor = this.isClicked ? color(75) : color(45);

    if (this.type == 0) {
      if (writinRCT.strokeColor == 0) bgColor = color(75);
      else bgColor = color(45);
    } else if (this.type == 1) {
      if (writinRCT.strokeColor == 255) bgColor = color(75);
      else bgColor = color(45);
    }

    stroke(8, 130, 2);
    strokeWeight(2);
    fill(bgColor);
    rect(this.x, this.y, this.width, this.height, 2);

    image(this.label, this.x + this.width / 2, this.y + this.height / 2, this.width, this.height);
  }

  isMouseOver() {
    return mouseX > this.x && mouseX < this.x + this.width &&
      mouseY > this.y && mouseY < this.y + this.height;
  }

  handleMouseClick() {
    if (this.isMouseOver()) {
      this.isClicked = true;
      if (this.clickFunction) {
        this.clickFunction();
      }
    }
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
  writinRCT.setColor(0);
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

  buttons[0] = new Button((width / 4) - 35 - 20, ((height / 2) - 235) - 20, 35, 35, loadImage("write.png"), writeBlack, 0);
  buttons[1] = new Button(width / 4, ((height / 2) - 235) - 20, 35, 35, loadImage("cancel.png"), writeWhite, 1);
  buttons[2] = new Button((width / 4) + 35 + 20, ((height / 2) - 235) - 20, 35, 35, loadImage("reload.png"), reloadRect, 2);
}

function reloadRect() {
  writinRCT.content.background(255);
}

function writeBlack() {
  writinRCT.setColor(0);
  writinRCT.setLineWidth(25);
}

function writeWhite() {
  writinRCT.setColor(255);
  writinRCT.setLineWidth(40);
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

  buttons[0].x = ((width / 4) - 35 - 20) - buttons[0].width / 2;
  buttons[0].y = ((height / 2) - 235) - 20;
  buttons[1].x = (width / 4) - buttons[1].width / 2;
  buttons[1].y = ((height / 2) - 235) - 20;
  buttons[2].x = ((width / 4) + 35 + 20) - buttons[2].width / 2;
  buttons[2].y = ((height / 2) - 235) - 20;

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

  let smallRectWidth = 350;
  let smallRectHeight = 100;
  let smallRectX = width - smallRectWidth - borderRadius;
  let smallRectY = height - smallRectHeight - borderRadius;

  let textInRect = "Creato da:\nLuca Lazzaroni\nin collaborazione con Michele Stefini";

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
  text("Caricamento...\nL'operazione potrebbe richiedere qualche minuto.", width / 2, height / 2 + (293 / 2));

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

var num = 0;

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

  if (mouseIsPressed && writinRCT.mouseOnThere()) {
    var centerX = (((3 * width / 4 + 202.5) - 2 * width / 4) / 2) + width / 2;

    push();
    textAlign(CENTER);
    textSize(28);
    noStroke();
    fill(255);
    text("Scrivendo...", centerX, height / 2);
    pop();
  } else {
    if (isWritinWhite()) {
      var centerX = (((3 * width / 4 + 202.5) - 2 * width / 4) / 2) + width / 2;

      push();
      textAlign(CENTER);
      textSize(28);
      noStroke();
      fill(255);
      text("Nessuna scritta", centerX, height / 2);
      pop();
    }
    else {
      for (var i = 0; i < 10; i++) {
        percRects[i].display(i);
      }

      textAlign(CENTER);
      noStroke();
      fill(255);
      textSize(25);

      var centerX = (((3 * width / 4 + 202.5) - 2 * width / 4) / 2) + width / 2;
      var widthOfRect = (3 * width / 4 + 202.5) - 2 * width / 4;
      var textEnd = (centerX - (widthOfRect / 2) + 250);
      var newTextCenter = (((centerX + (widthOfRect / 2)) - textEnd) / 2) + textEnd;

      push();
      textAlign(LEFT);
      twoText("Risultato:", num, newTextCenter, height / 2, 25, 45);
      pop();
    }
  }

  rectMode(CORNER);
  imageMode(CENTER);
  for (let button of buttons) {
    button.display();
  }

  fill(60);
  stroke(borderColor);
  strokeWeight(5);
  rect(15, 15, width - 2 * 15, 80, 15);

  let centerX_ = 15 + (width - 2 * 15) / 2;
  let centerY_ = 55;

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(15);
  text("Scrivere una cifra da 0 a 9 nel riquadro bianco.\nEssendo l'intelligenza artificiale allenata solo a riconoscere cifre da 0 a 9 grandi circa quanto il riquadro,\nse si scrive in modo diverso il risultato non sarà corretto.", centerX_, centerY_);

  pop();

}

function mousePressed() {
  mousePath = [];

  for (let button of buttons) {
    button.handleMouseClick();
  }

  checkForWhite = true;
}

function mouseReleased() {
  if (canPredict) {
    canPredict = false;
    predict();
  }

  checkForWhite = true;
}

function mouseDragged() {
  writinRCT.writeOnMouseDrag();
  mousePath.push(createVector(mouseX, mouseY));
  while (mousePath.length > 2) {
    mousePath.shift();
  }
}

var canPredict = true;

async function predict() {
  findLimitsOnImage(writinRCT.getImg());

  const inputImage = findLimitsOnImage(writinRCT.getImg()).canvas;
  const [result, probClass0, probClass1, probClass2, probClass3, probClass4, probClass5, probClass6, probClass7, probClass8, probClass9] = await runPrediction(model, inputImage);

  percRects[0].setPercentage(probClass0 * 100);
  percRects[1].setPercentage(probClass1 * 100);
  percRects[2].setPercentage(probClass2 * 100);
  percRects[3].setPercentage(probClass3 * 100);
  percRects[4].setPercentage(probClass4 * 100);
  percRects[5].setPercentage(probClass5 * 100);
  percRects[6].setPercentage(probClass6 * 100);
  percRects[7].setPercentage(probClass7 * 100);
  percRects[8].setPercentage(probClass8 * 100);
  percRects[9].setPercentage(probClass9 * 100);

  num = result;

  canPredict = true;

}

var checkForWhite = true;
var oldWhiteValue = true;

function isWritinWhite() {
  if (checkForWhite) {
    const pg = writinRCT.content;
    pg.loadPixels();

    oldWhiteValue = pg.pixels.every(value => value === 255);

    checkForWhite = false;
  }

  return oldWhiteValue;
}

function findLimitsOnImage(imageToCheck_) {

  let scale = 0.25;
  const scaledImage = createImage(imageToCheck_.width * scale, imageToCheck_.height * scale);

  scaledImage.copy(imageToCheck_, 0, 0, imageToCheck_.width, imageToCheck_.height, 0, 0, scaledImage.width, scaledImage.height);

  let leftmostX = scaledImage.width / scale;
  let rightmostX = 0;
  let highestY = scaledImage.height / scale;
  let lowestY = 0;

  for (let y = 0; y < scaledImage.height; y++) {
    for (let x = 0; x < scaledImage.width; x++) {
      let pixelColor = scaledImage.get(x, y);

      if (pixelColor[0] === 0 && pixelColor[1] === 0 && pixelColor[2] === 0) {
        let originalX = Math.floor(x / scale);
        let originalY = Math.floor(y / scale);

        leftmostX = Math.min(leftmostX, originalX);
        rightmostX = Math.max(rightmostX, originalX);
        highestY = Math.min(highestY, originalY);
        lowestY = Math.max(lowestY, originalY);
      }
    }
  }

  let newImageX = leftmostX;
  let newImageY = highestY;
  let newImageWidth = rightmostX - leftmostX;
  let newImageHeight = lowestY - highestY;

  let newCenterX = newImageX + (newImageWidth / 2);
  let newCenterY = newImageY + (newImageHeight / 2);

  let maxDimension = Math.max(newImageHeight, newImageWidth);

  let border = maxDimension / 4;

  newImageX = leftmostX - border;
  newImageY = highestY - border;
  newImageWidth = (rightmostX - leftmostX) + (border * 2);
  newImageHeight = lowestY - highestY + (border * 2);

  newCenterX = newImageX + (newImageWidth / 2);
  newCenterY = newImageY + (newImageHeight / 2);

  maxDimension = Math.max(newImageHeight, newImageWidth);

  let cutImage = createImage(maxDimension, maxDimension);

  let resultImage;

  if (newImageWidth > newImageHeight) {
    let calculatedY = newCenterY - (cutImage.height / 2);

    let tempGraphics = createGraphics(newImageWidth, cutImage.height);
    tempGraphics.background(255);

    tempGraphics.copy(imageToCheck_, newImageX, calculatedY, newImageWidth, cutImage.height, 0, 0, newImageWidth, cutImage.height);

    image(tempGraphics, newImageX, calculatedY);

    resultImage = tempGraphics.get();
  } else {
    let calculatedX = newCenterX - (cutImage.width / 2);

    let tempGraphics = createGraphics(cutImage.width, newImageHeight);
    tempGraphics.background(255);

    tempGraphics.copy(imageToCheck_, calculatedX, newImageY, cutImage.width, newImageHeight, 0, 0, cutImage.width, newImageHeight);

    image(tempGraphics, calculatedX, newImageY);

    resultImage = tempGraphics.get();
  }

  cutImage = resultImage;

  return cutImage;
}