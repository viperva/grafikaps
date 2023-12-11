import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { Button, Typography } from "@mui/material";

const PS7 = () => {
  const [image, setImage] = useState<null | string>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [noisePixelsCount, setNoisePixelsCount] = useState<number>(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result as string);
      };
    }
  };

  const detectSaltAndPepperNoise = () => {
    setNoisePixelsCount((getNoisePixels() || []).length);
  };

  const getNoisePixels = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const noisePixels = [];

    const getGrayscale = (index: number) => {
      return (
        0.2126 * data[index] +
        0.7152 * data[index + 1] +
        0.0722 * data[index + 2]
      );
    };

    const isNoisePixel = (index: number, neighbors: number[]) => {
      const pixelValue = getGrayscale(index);
      let differentCount = 0;

      neighbors.forEach((neighborIndex) => {
        const neighborValue = getGrayscale(neighborIndex);
        if (Math.abs(neighborValue - pixelValue) > 10) {
          differentCount++;
        }
      });

      return differentCount > neighbors.length / 2;
    };

    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        const index = (y * canvas.width + x) * 4;
        const neighbors = [];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            neighbors.push(((y + dy) * canvas.width + (x + dx)) * 4);
          }
        }

        if (isNoisePixel(index, neighbors)) {
          noisePixels.push(index);
        }
      }
    }

    return noisePixels;
  };

  const applyMedianFilterToNoisePixels = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const getMedian = (neighbors: number[]) => {
      neighbors.sort((a, b) => a - b);
      return neighbors[Math.floor(neighbors.length / 2)];
    };

    const getNeighbors = (x: number, y: number) => {
      const neighbors = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const neighborX = x + dx;
          const neighborY = y + dy;
          if (
            neighborX >= 0 &&
            neighborX < canvas.width &&
            neighborY >= 0 &&
            neighborY < canvas.height
          ) {
            neighbors.push((neighborY * canvas.width + neighborX) * 4);
          }
        }
      }
      return neighbors;
    };

    const noisePixelIndices = getNoisePixels();

    noisePixelIndices?.forEach((index: number) => {
      const x = (index / 4) % canvas.width;
      const y = Math.floor(index / 4 / canvas.width);

      const neighborsR: number[] = [];
      const neighborsG: number[] = [];
      const neighborsB: number[] = [];

      getNeighbors(x, y).forEach((neighborIndex) => {
        neighborsR.push(data[neighborIndex]);
        neighborsG.push(data[neighborIndex + 1]);
        neighborsB.push(data[neighborIndex + 2]);
      });

      const medianR = getMedian(neighborsR);
      const medianG = getMedian(neighborsG);
      const medianB = getMedian(neighborsB);

      data[index] = medianR;
      data[index + 1] = medianG;
      data[index + 2] = medianB;
    });

    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [image]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "1rem",
        width: "80%",
      }}
    >
      <Input
        type="file"
        onChange={handleImageUpload}
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
          width: "65%",
        }}
      />
      {image && (
        <canvas
          style={{
            maxWidth: "100%",
            maxHeight: "40%",
            objectFit: "contain",
            backgroundColor: "transparent",
          }}
          ref={canvasRef}
        />
      )}

      <Button
        onClick={detectSaltAndPepperNoise}
        variant="contained"
        sx={{
          width: "65%",
        }}
      >
        Detect salt and pepper noise
      </Button>
      <Typography>Noise pixels count: {noisePixelsCount}</Typography>
      <Button
        onClick={applyMedianFilterToNoisePixels}
        variant="contained"
        sx={{
          width: "65%",
        }}
      >
        Fix noise pixels
      </Button>
    </Box>
  );
};

export default PS7;
