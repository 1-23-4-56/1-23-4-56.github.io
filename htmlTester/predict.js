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