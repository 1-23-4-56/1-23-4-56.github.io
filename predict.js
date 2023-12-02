async function predict(imageElement) {

    const model = await tf.loadLayersModel('model.h5');

    // Converte l'immagine in un tensore
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, 28, 28);
    const imageData = ctx.getImageData(0, 0, 28, 28);

    // Converte i dati dell'immagine in un tensore
    const inputTensor = tf.browser.fromPixels(imageData, 1)
        .toFloat()
        .expandDims(0)
        .expandDims(-1);

    // Effettua la previsione
    const prediction = model.predict(inputTensor);

    // Ottieni l'indice della classe predetta
    const predictedClass = prediction.argMax().dataSync()[0];

    return predictedClass;
}

async function mergeAndPredict(imageElement) {
    const numParts = 3;  // Numero di parti del modello
    const partSizeMb = 100;  // Dimensione massima di ogni parte in MB

    // Ricomponi le parti
    const mergedModel = new Uint8Array(partSizeMb * 1024 * 1024 * numParts);
    for (let i = 0; i < numParts; i++) {
      const response = await fetch(`part_${i}.h5`);
      const partData = new Uint8Array(await response.arrayBuffer());
      mergedModel.set(partData, i * partSizeMb * 1024 * 1024);
    }

    // Crea un Blob con i dati del modello
    const blob = new Blob([mergedModel], { type: 'application/octet-stream' });

    // Crea un URL oggetto per il Blob
    const blobUrl = URL.createObjectURL(blob);

    // Carica il modello TensorFlow.js
    const model = await tf.loadLayersModel(tf.io.browserHTTPRequest(blobUrl));

    // Converte l'immagine in un tensore
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, 28, 28);
    const imageData = ctx.getImageData(0, 0, 28, 28);

    // Converte i dati dell'immagine in un tensore
    const inputTensor = tf.browser.fromPixels(imageData, 1)
        .toFloat()
        .expandDims(0)
        .expandDims(-1);

    // Effettua la previsione
    const prediction = model.predict(inputTensor);

    // Ottieni l'indice della classe predetta
    const predictedClass = prediction.argMax().dataSync()[0];

    return predictedClass;
  }