export const getGrayscaleHistogramData = (pixelArray: number[]) => {
  const histogramData: number[] = new Array(256).fill(0);
  for (let i = 0; i < pixelArray.length; i += 4) {
    const grayscale =
      0.2126 * pixelArray[i] +
      0.7152 * pixelArray[i + 1] +
      0.0722 * pixelArray[i + 2];
    histogramData[Math.round(grayscale)]++;
  }
  return histogramData;
};

export const getHistogramData = (pixelArray: number[]) => {
  const histogramData = new Array(256).fill(0);
  for (let i = 0; i < pixelArray.length; i += 4) {
    histogramData[pixelArray[i]]++;
    histogramData[pixelArray[i + 1]]++;
    histogramData[pixelArray[i + 2]]++;
  }
  return histogramData;
};

export const getStreachedHistogramData = (pixelArray: number[]) => {
  const grayscaleArray = getGrayscaleHistogramData(pixelArray);

  const min = grayscaleArray.findIndex((intensity) => intensity !== 0);
  const max = grayscaleArray.findLastIndex((intensity) => intensity !== 0);

  return pixelArray.map((value) => (255 * (value - min)) / (max - min));
};

export const getEqualizedHistogramData = (pixelArray: number[]) => {
  const pmf = [
    new Array(256).fill(0),
    new Array(256).fill(0),
    new Array(256).fill(0),
  ];

  for (let i = 0; i < pixelArray.length; i += 4) {
    pmf[0][pixelArray[i]]++;
    pmf[1][pixelArray[i + 1]]++;
    pmf[2][pixelArray[i + 2]]++;
  }

  for (let i = 0; i < 256; i++) {
    pmf[0][i] /= pixelArray.length / 4;
    pmf[1][i] /= pixelArray.length / 4;
    pmf[2][i] /= pixelArray.length / 4;
  }

  const cdf = [
    new Array(256).fill(0),
    new Array(256).fill(0),
    new Array(256).fill(0),
  ];

  for (let i = 0; i < 256; i++) {
    if (i === 0) {
      cdf[0][i] = pmf[0][i];
      cdf[1][i] = pmf[1][i];
      cdf[2][i] = pmf[2][i];
      continue;
    }
    cdf[0][i] = pmf[0][i] + cdf[0][i - 1];
    cdf[1][i] = pmf[1][i] + cdf[1][i - 1];
    cdf[2][i] = pmf[2][i] + cdf[2][i - 1];
  }

  console.log(cdf[0][255], cdf[1][255], cdf[2][255]);

  const equalized = new Array(pixelArray.length).fill(0);

  for (let i = 0; i < pixelArray.length; i += 4) {
    const rTransformed = Math.round(255 * cdf[0][pixelArray[i]]);
    const gTransformed = Math.round(255 * cdf[1][pixelArray[i + 1]]);
    const bTransformed = Math.round(255 * cdf[2][pixelArray[i + 2]]);

    equalized[i] = rTransformed;
    equalized[i + 1] = gTransformed;
    equalized[i + 2] = bTransformed;
    equalized[i + 3] = pixelArray[i + 3];
  }

  return equalized;
};

export const getOtsuThreshold = (pixelArray: number[]) => {
  const histogramData = getGrayscaleHistogramData(pixelArray);

  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogramData[i];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;

  let max = 0;
  let threshold = 0;

  for (let i = 0; i < 256; i++) {
    wB += histogramData[i];
    if (wB === 0) continue;

    wF = pixelArray.length / 4 - wB;
    if (wF === 0) break;

    sumB += i * histogramData[i];

    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const between = wB * wF * (mB - mF) * (mB - mF);

    if (between > max) {
      max = between;
      threshold = i;
    }
  }

  return threshold;
};

export const getInputThresholdedArray = (
  pixelArray: number[],
  threshold: number
) => {
  const newPixelArray = new Array(pixelArray.length).fill(0);
  for (let i = 0; i < pixelArray.length; i += 4) {
    const grayscale =
      0.2126 * pixelArray[i] +
      0.7152 * pixelArray[i + 1] +
      0.0722 * pixelArray[i + 2];

    const value = grayscale < threshold ? 0 : 255;

    newPixelArray[i] = value;
    newPixelArray[i + 1] = value;
    newPixelArray[i + 2] = value;
    newPixelArray[i + 3] = 255;
  }
  return newPixelArray;
};

export const getPbsThreshold = (
  pixelArray: number[],
  blackPixelPercentage: number
) => {
  const grayscaleValues = [];
  for (let i = 0; i < pixelArray.length; i += 4) {
    const grayscale =
      0.2126 * pixelArray[i] +
      0.7152 * pixelArray[i + 1] +
      0.0722 * pixelArray[i + 2];
    grayscaleValues.push(grayscale);
  }
  grayscaleValues.sort((a, b) => a - b);

  const index = Math.floor(
    (blackPixelPercentage * grayscaleValues.length) / 100
  );

  console.log(grayscaleValues[index]);
  return grayscaleValues[index];
};

export const getMisThreshold = (pixelArray: number[]) => {
  let threshold = 128;
  let oldThreshold = 0;

  while (Math.abs(threshold - oldThreshold) > 1) {
    oldThreshold = threshold;
    let sumBk = 0,
      sumFg = 0,
      countBk = 0,
      countFg = 0;

    for (let i = 0; i < pixelArray.length; i += 4) {
      const grayscale =
        0.2126 * pixelArray[i] +
        0.7152 * pixelArray[i + 1] +
        0.0722 * pixelArray[i + 2];

      if (grayscale < threshold) {
        sumBk += grayscale;
        countBk++;
      } else {
        sumFg += grayscale;
        countFg++;
      }
    }

    const meanBk = countBk > 0 ? sumBk / countBk : 0;
    const meanFg = countFg > 0 ? sumFg / countFg : 0;

    threshold = (meanBk + meanFg) / 2;
  }

  console.log(threshold);

  return Math.round(threshold);
};

export const getEntropyThreshold = (pixelArray: number[]) => {
  const histogram = getGrayscaleHistogramData(pixelArray);

  let bestThreshold = 0;
  let maxEntropy = 0;

  for (let t = 0; t < 256; t++) {
    let sumBk = 0,
      sumFg = 0,
      entropyBk = 0,
      entropyFg = 0;

    for (let i = 0; i <= t; i++) {
      sumBk += histogram[i];
    }
    for (let i = t + 1; i < 256; i++) {
      sumFg += histogram[i];
    }

    for (let i = 0; i <= t; i++) {
      if (histogram[i] === 0 || sumBk === 0) continue;
      const probability = histogram[i] / sumBk;
      entropyBk -= probability * Math.log2(probability);
    }

    for (let i = t + 1; i < 256; i++) {
      if (histogram[i] === 0 || sumFg === 0) continue;
      const probability = histogram[i] / sumFg;
      entropyFg -= probability * Math.log2(probability);
    }

    const totalEntropy = entropyBk + entropyFg;
    if (totalEntropy > maxEntropy) {
      maxEntropy = totalEntropy;
      bestThreshold = t;
    }
  }

  console.log(bestThreshold);

  return bestThreshold;
};

const calculateLocalStats = (
  pixelArray: number[],
  x: number,
  y: number,
  width: number,
  height: number,
  windowSize: number
) => {
  let mean = 0;
  let sumOfSquares = 0;
  const halfWindowSize = Math.floor(windowSize / 2);
  let count = 0;

  for (let i = -halfWindowSize; i <= halfWindowSize; i++) {
    for (let j = -halfWindowSize; j <= halfWindowSize; j++) {
      const posX = x + j;
      const posY = y + i;
      if (posX < 0 || posY < 0 || posX >= width || posY >= height) continue;

      const index = (posY * width + posX) * 4;
      const grayscale =
        0.2126 * pixelArray[index] +
        0.7152 * pixelArray[index + 1] +
        0.0722 * pixelArray[index + 2];

      mean += grayscale;
      sumOfSquares += grayscale * grayscale;
      count++;
    }
  }

  mean /= count;
  const variance = sumOfSquares / count - mean * mean;
  const stdDev = Math.sqrt(variance);

  return { mean, stdDev };
};

export const getNiblackThresholdedArray = (
  pixelArray: number[],
  width: number,
  height: number,
  windowSize: number,
  k: number
) => {
  const newPixelArray = new Array(pixelArray.length).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const { mean, stdDev } = calculateLocalStats(
        pixelArray,
        x,
        y,
        width,
        height,
        windowSize
      );
      const threshold = mean + k * stdDev;

      const index = (y * width + x) * 4;
      const grayscale =
        0.2126 * pixelArray[index] +
        0.7152 * pixelArray[index + 1] +
        0.0722 * pixelArray[index + 2];

      const value = grayscale < threshold ? 0 : 255;
      newPixelArray[index] =
        newPixelArray[index + 1] =
        newPixelArray[index + 2] =
          value;
      newPixelArray[index + 3] = 255;
    }
  }

  return newPixelArray;
};

export const getSauvolaThresholdedArray = (
  pixelArray: number[],
  width: number,
  height: number,
  windowSize: number,
  k: number
) => {
  const R = 128;
  const newPixelArray = new Array(pixelArray.length).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const { mean, stdDev } = calculateLocalStats(
        pixelArray,
        x,
        y,
        width,
        height,
        windowSize
      );

      const threshold = mean * (1 + k * (stdDev / R - 1));

      const index = (y * width + x) * 4;
      const grayscale =
        0.2126 * pixelArray[index] +
        0.7152 * pixelArray[index + 1] +
        0.0722 * pixelArray[index + 2];

      const value = grayscale < threshold ? 0 : 255;
      newPixelArray[index] =
        newPixelArray[index + 1] =
        newPixelArray[index + 2] =
          value;
      newPixelArray[index + 3] = 255;
    }
  }

  return newPixelArray;
};

export const getPhansalkarThresholdedArray = (
  pixelArray: number[],
  width: number,
  height: number,
  windowSize: number,
  k: number
) => {
  const R = 0.5;
  const p = 3;
  const q = 10;

  const newPixelArray = new Array(pixelArray.length).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const { mean, stdDev } = calculateLocalStats(
        pixelArray,
        x,
        y,
        width,
        height,
        windowSize
      );

      const threshold =
        mean * (1 + p * Math.exp(-q * mean) + k * (stdDev / R - 1));

      const index = (y * width + x) * 4;
      const grayscale =
        0.2126 * pixelArray[index] +
        0.7152 * pixelArray[index + 1] +
        0.0722 * pixelArray[index + 2];

      const value = grayscale < threshold ? 0 : 255;
      newPixelArray[index] =
        newPixelArray[index + 1] =
        newPixelArray[index + 2] =
          value;
      newPixelArray[index + 3] = 255;
    }
  }

  return newPixelArray;
};
