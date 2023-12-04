let model;

var loadedstate = false;

async function setup() {
  await loadTheModel();
  loadedstate = await testTheModel();

  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  text(loadedstate, 100, 100)
}

async function mousePressed() {
  const inputImage = document.getElementById('testImage');
  const [result, probClass0, probClass1, probClass2, probClass3, probClass4, probClass5, probClass6, probClass7, probClass8, probClass9] = await runPrediction(model, inputImage);

  console.log('thisguyshouldbeathreee', result)
}

//######################################

async function loadTheModel() {
  model = await tf.loadLayersModel('modelJS/model.json');
  console.log('model loaded');
}

async function testTheModel() {
  const inputImage = document.getElementById('testImage');
  const [result, probClass0, probClass1, probClass2, probClass3, probClass4, probClass5, probClass6, probClass7, probClass8, probClass9] = await runPrediction(model, inputImage);

  console.log('test result:', result == 3);
  return result == 3;
}