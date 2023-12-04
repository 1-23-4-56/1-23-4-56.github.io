let model;

function setup() {
  createCanvas(windowWidth, windowHeight);

  testPredict();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}

//######################################

async function testPredict() {
  model = await tf.loadLayersModel('modelJS/model.json');
  const inputImage = document.getElementById('testImage');
  const [result, probClass0, probClass1, probClass2, probClass3, probClass4, probClass5, probClass6, probClass7, probClass8, probClass9] = await runPrediction(model, inputImage);

  console.log('ris', result);
}