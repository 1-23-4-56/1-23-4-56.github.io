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
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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

  let textInRect = "io sono PEPPER e distruggerò\nil mondo";

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
}

//######################################

function whenLoading() {
  drawBG();

  push();
  imageMode(CENTER);
  textAlign(CENTER);

  text("Caricamento...\nL'operazione potrebbe richiedere un minuto.", width / 2, height / 2 + (293 / 2));

  push();
  translate(width / 2, height / 2);
  rotate(millis() / 350);
  image(loadingImage, 0, 0);
  pop();

  pop();
}

function whenLoadedLoop() {
  drawBG();

  text("caricato", 100, 100);
}

async function mousePressed() {
  const inputImage = document.getElementById('testImage');
  const [result, probClass0, probClass1, probClass2, probClass3, probClass4, probClass5, probClass6, probClass7, probClass8, probClass9] = await runPrediction(model, inputImage);

  console.log('thisguyshouldbeathreee', result)
}