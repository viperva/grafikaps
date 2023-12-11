import React, { useEffect, useRef, useState } from "react";
import ImagePicker from "./ImagePicker/ImagePicker";
import RGBPicker from "./RGB/AddRGB";
import {
  Button,
  ButtonGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import BirghtnessPicker from "./BirghtnessPicker/BrightnessPicker";

const DEFAULT_RGB = {
  red: 0,
  green: 0,
  blue: 0,
};

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const PS4: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [rgb, setRGB] = useState(DEFAULT_RGB);
  const [kernelSize, setKernelSize] = useState(3); // [3, 5, 7, 9, 11
  const [brightness, setBrightness] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.src = image!;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };
  }, [image]);

  const handleAddRGB = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const { data } = imgData;
    for (let i = 0; i < data.length; i += 4) {
      data[i] += rgb.red;
      data[i + 1] += rgb.green;
      data[i + 2] += rgb.blue;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const handleSubtractRGB = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const { data } = imgData;
    for (let i = 0; i < data.length; i += 4) {
      data[i] -= rgb.red;
      data[i + 1] -= rgb.green;
      data[i + 2] -= rgb.blue;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const handleMultiplyRGB = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const { data } = imgData;
    for (let i = 0; i < data.length; i += 4) {
      data[i] *= rgb.red;
      data[i + 1] *= rgb.green;
      data[i + 2] *= rgb.blue;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const handleDivideRGB = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const { data } = imgData;
    for (let i = 0; i < data.length; i += 4) {
      data[i] /= rgb.red;
      data[i + 1] /= rgb.green;
      data[i + 2] /= rgb.blue;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const handleBrightnessChange = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const { data } = imgData;
    for (let i = 0; i < data.length; i += 4) {
      data[i] *= brightness;
      data[i + 1] *= brightness;
      data[i + 2] *= brightness;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const handleApplyGrayscaleAverageRGB = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const { data } = imgData;
    for (let i = 0; i < data.length; i += 4) {
      const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = average;
      data[i + 1] = average;
      data[i + 2] = average;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const applySmoothing = (kernelSize: number) => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d");
    if (context === null) return;
    const imageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const data = imageData.data;

    const smoothedData = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
      const avgR = averageNeighbor(data, i, CANVAS_WIDTH, kernelSize, 0);
      const avgG = averageNeighbor(data, i, CANVAS_WIDTH, kernelSize, 1);
      const avgB = averageNeighbor(data, i, CANVAS_WIDTH, kernelSize, 2);

      smoothedData[i] = avgR;
      smoothedData[i + 1] = avgG;
      smoothedData[i + 2] = avgB;
      smoothedData[i + 3] = data[i + 3];
    }

    context.putImageData(
      new ImageData(smoothedData, CANVAS_WIDTH, CANVAS_HEIGHT),
      0,
      0
    );
  };

  const averageNeighbor = (
    data: Uint8ClampedArray,
    index: number,
    width: number,
    kernelSize: number,
    channel: number
  ) => {
    const halfKernel = Math.floor(kernelSize / 2);
    let sum = 0;

    for (let y = -halfKernel; y <= halfKernel; y++) {
      for (let x = -halfKernel; x <= halfKernel; x++) {
        const pixelIndex = index / 4 + y * width + x;
        sum += data[pixelIndex * 4 + channel];
      }
    }

    return sum / (kernelSize * kernelSize);
  };

  const applyMedianFilter = (windowSize: number) => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d");
    if (context === null) return;

    const data = context.getImageData(0, 0, CANVAS_HEIGHT, CANVAS_WIDTH).data;

    const outputData = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
      const medianR = medianNeighbor(data, i, CANVAS_HEIGHT, windowSize, 0);
      const medianG = medianNeighbor(data, i, CANVAS_HEIGHT, windowSize, 1);
      const medianB = medianNeighbor(data, i, CANVAS_HEIGHT, windowSize, 2);

      outputData[i] = medianR;
      outputData[i + 1] = medianG;
      outputData[i + 2] = medianB;
      outputData[i + 3] = data[i + 3];
    }

    context.putImageData(
      new ImageData(outputData, CANVAS_HEIGHT, CANVAS_WIDTH),
      0,
      0
    );
  };

  const medianNeighbor = (
    data: Uint8ClampedArray,
    index: number,
    width: number,
    windowSize: number,
    channel: number
  ) => {
    const halfWindowSize = Math.floor(windowSize / 2);
    const values = [];

    for (let y = -halfWindowSize; y <= halfWindowSize; y++) {
      for (let x = -halfWindowSize; x <= halfWindowSize; x++) {
        const pixelIndex = index / 4 + y * width + x;
        values.push(data[pixelIndex * 4 + channel]);
      }
    }

    values.sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };

  const applySobelFilter = () => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d");
    if (context === null) return;

    const data = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;

    const sobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];

    const sobelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ];

    const newData = new Uint8ClampedArray(data.length);

    const getPixelValue = (x: number, y: number) => {
      const nx = Math.min(Math.max(x, 0), width - 1);
      const ny = Math.min(Math.max(y, 0), height - 1);

      const offset = (ny * width + nx) * 4;
      return data[offset];
    };

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const pixelX =
          sobelX[0][0] * getPixelValue(x - 1, y - 1) +
          sobelX[0][1] * getPixelValue(x, y - 1) +
          sobelX[0][2] * getPixelValue(x + 1, y - 1) +
          sobelX[1][0] * getPixelValue(x - 1, y) +
          sobelX[1][1] * getPixelValue(x, y) +
          sobelX[1][2] * getPixelValue(x + 1, y) +
          sobelX[2][0] * getPixelValue(x - 1, y + 1) +
          sobelX[2][1] * getPixelValue(x, y + 1) +
          sobelX[2][2] * getPixelValue(x + 1, y + 1);

        const pixelY =
          sobelY[0][0] * getPixelValue(x - 1, y - 1) +
          sobelY[0][1] * getPixelValue(x, y - 1) +
          sobelY[0][2] * getPixelValue(x + 1, y - 1) +
          sobelY[1][0] * getPixelValue(x - 1, y) +
          sobelY[1][1] * getPixelValue(x, y) +
          sobelY[1][2] * getPixelValue(x + 1, y) +
          sobelY[2][0] * getPixelValue(x - 1, y + 1) +
          sobelY[2][1] * getPixelValue(x, y + 1) +
          sobelY[2][2] * getPixelValue(x + 1, y + 1);

        const magnitude = Math.sqrt(pixelX ** 2 + pixelY ** 2);

        const offset = (y * width + x) * 4;
        newData[offset] = magnitude;
        newData[offset + 1] = magnitude;
        newData[offset + 2] = magnitude;
        newData[offset + 3] = data[offset + 3];
      }
    }

    const newImageData = new ImageData(newData, width, height);
    context.putImageData(newImageData, 0, 0);
  };

  const applyHighPassFilter = () => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d");
    if (context === null) return;

    const data = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;

    const laplaceFilter = [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0],
    ];

    const newData = new Uint8ClampedArray(data.length);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;

        for (let fy = -1; fy <= 1; fy++) {
          for (let fx = -1; fx <= 1; fx++) {
            const nx = x + fx;
            const ny = y + fy;

            const offset = (ny * width + nx) * 4;

            sum += data[offset] * laplaceFilter[fy + 1][fx + 1];
          }
        }

        const offset = (y * width + x) * 4;
        const newValue = data[offset] + sum;

        // Ensure the new value is in the valid color range [0, 255]
        newData[offset] = Math.min(Math.max(newValue, 0), 255);
        newData[offset + 1] = newData[offset];
        newData[offset + 2] = newData[offset];
        newData[offset + 3] = data[offset + 3];
      }
    }

    const newImageData = new ImageData(newData, width, height);
    context.putImageData(newImageData, 0, 0);
  };

  const applyGaussianBlur = () => {
    const filterSize = 3;
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d");
    if (context === null) return;

    const data = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;
    const halfFilterSize = Math.floor(filterSize / 2);

    const newData = new Uint8ClampedArray(data.length);

    const calculateGaussianWeight = (x: number, y: number) => {
      const sigma = filterSize / 6.0;
      const distance = (x * x + y * y) / (2.0 * sigma * sigma);
      return Math.exp(-distance) / (2.0 * Math.PI * sigma * sigma);
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let totalWeight = 0;

        for (let fy = -halfFilterSize; fy <= halfFilterSize; fy++) {
          for (let fx = -halfFilterSize; fx <= halfFilterSize; fx++) {
            const nx = Math.min(Math.max(x + fx, 0), width - 1);
            const ny = Math.min(Math.max(y + fy, 0), height - 1);

            const offset = (ny * width + nx) * 4;
            const weight = calculateGaussianWeight(fx, fy);

            sumR += data[offset] * weight;
            sumG += data[offset + 1] * weight;
            sumB += data[offset + 2] * weight;
            totalWeight += weight;
          }
        }

        const resultOffset = (y * width + x) * 4;
        newData[resultOffset] = sumR / totalWeight;
        newData[resultOffset + 1] = sumG / totalWeight;
        newData[resultOffset + 2] = sumB / totalWeight;
        newData[resultOffset + 3] = data[resultOffset + 3];
      }
    }

    const newImageData = new ImageData(newData, width, height);
    context.putImageData(newImageData, 0, 0);
  };

  const handleKernelSizeChange = (event: SelectChangeEvent<string>) =>
    setKernelSize(Number(event.target.value));

  return (
    <div>
      <ImagePicker onImageChange={setImage} />
      <Typography id="discrete-slider" gutterBottom>
        Select Kernel size for smoothing filter
      </Typography>
      <Select
        sx={{
          backgroundColor: "white",
        }}
        onChange={handleKernelSizeChange}
      >
        <MenuItem value={3}>3x3</MenuItem>
        <MenuItem value={5}>5x5</MenuItem>
        <MenuItem value={7}>7x7</MenuItem>
      </Select>
      <RGBPicker rgb={rgb} onRGBChange={setRGB} />
      <BirghtnessPicker onBrightnessChange={setBrightness} />
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button onClick={handleAddRGB}>Add RGB</Button>
        <Button onClick={handleSubtractRGB}>Substract RGB</Button>
        <Button onClick={handleMultiplyRGB}>Multiply RGB</Button>
        <Button onClick={handleDivideRGB}>Divide RGB</Button>
        <Button onClick={handleBrightnessChange}>Add Brightness</Button>
        <Button onClick={handleApplyGrayscaleAverageRGB}>
          Grayscale average
        </Button>
        <Button onClick={() => applySmoothing(kernelSize)}>
          Apply smoothing
        </Button>
        <Button onClick={() => applyMedianFilter(kernelSize)}>
          Apply median filter
        </Button>
        <Button onClick={() => applySobelFilter()}>Apply sobel filter</Button>
        <Button onClick={() => applyHighPassFilter()}>
          Apply sharpening filter
        </Button>
        <Button onClick={() => applyGaussianBlur()}>
          Apply gaussian blur filter
        </Button>
      </ButtonGroup>

      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
};

export default PS4;
