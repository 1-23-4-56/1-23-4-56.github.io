function setup() {
  creditsHeight = creditsMultiplier * windowWidth * windowHeight / 1010000;

  createCanvas(windowWidth, windowHeight);

  numpred=mergeAndPredict(document.getElementById('testImage'));
}

function windowResized() {
  creditsHeight = creditsMultiplier * windowWidth * windowHeight / 1010000;
  resizeCanvas(windowWidth, windowHeight);
}

var ifCircle = false;

var creditsMultiplier = 20;
var creditsHeight = 20;

var numpred=-1;

function draw() {
  background(220);

  drawBorderRects();
  drawMouseCircle();

  writeCredits();
}

function mousePressed() {
  ifCircle = !ifCircle;

  if (mouseX > (width - 50)) {
    creditsMultiplier++;
    windowResized();
  }
  if (mouseX < 50) {
    creditsMultiplier--;
    windowResized();
  }
}

function drawMouseCircle() {
  push();

  noStroke();
  if (ifCircle) {
    fill(0, 255, 0);
    ellipse(mouseX, mouseY, 50);
  }
  else {
    rectMode(CENTER);
    fill(255, 0, 0);
    rect(mouseX, mouseY, 50, 50);
  }

  pop();
}

function drawBorderRects() {
  push();

  fill(0, 0, 255);
  stroke(255, 0, 0);
  rect(0, 0, 50, 50);

  fill(0, 255, 255);
  rect(width - 50, 0, 50, 50);

  fill(255, 0, 255);
  rect(0, height - 50, 50, 50);

  fill(0, 255, 0);
  rect(width - 50, height - 50, 50, 50);

  pop();
}

function writeCredits() {
  push();

  stroke(0);
  textSize(creditsHeight);
  textAlign(RIGHT, BOTTOM);

  text("Creato da:\nLuca Lazzaroni - 3°CT", width - 10, height - 10);
  //################
  text(Math.trunc(millis()) + "\t" + creditsMultiplier + "\t" + width + "/" + height+"previsione:"+mergeAndPredict(document.getElementById('testImage')), width / 2, height / 2);
  //################

  pop();
}