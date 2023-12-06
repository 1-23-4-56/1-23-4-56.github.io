async function runPrediction(model, inputImage) {

    const image = tf.browser.fromPixels(inputImage, 1);

    const resizedImage = tf.image.resizeBilinear(image, [28, 28]);

    const normalizedImage = resizedImage.div(255);
    const normalizedImageInv = invertColors(normalizedImage);

    const input = normalizedImageInv.expandDims();

    const probClass01 = model.predict(input).arraySync()[0];
    const [probClass0, probClass1, probClass2, probClass3, probClass4, probClass5, probClass6, probClass7, probClass8, probClass9] = probClass01;

    tf.dispose(image);
    tf.dispose(resizedImage);
    tf.dispose(normalizedImage);
    tf.dispose(normalizedImageInv);
    tf.dispose(input);

    return [highNum(probClass01), probClass0, probClass1, probClass2, probClass3, probClass4, probClass5, probClass6, probClass7, probClass8, probClass9];
}

//#################################################

function highNum(nums) {
    var ris = 0;

    ris = Math.max(...nums);
    ris = nums.indexOf(ris);

    return ris;
}

function invertColors(image) {
    return tf.tidy(() => {
        return tf.sub(tf.scalar(1), image);
    });
}