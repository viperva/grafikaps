import { Box, Button, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

const PS3 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && isSupportedFile(file)) {
      setCurrentFile(file);
      readFile(file);
    } else {
      alert("Unsupported file type.");
    }
  };

  const isSupportedFile = (file: File) => {
    return ["ppm", "pgm", "pbm"].includes(
      file.name.split(".").pop()?.toLowerCase() || ""
    );
  };

  const readFile = (file: File) => {
    const reader = new FileReader();

    const readFullFile = (isBinary: boolean) => {
      const fullFileReader = new FileReader();
      fullFileReader.onload = (e) => {
        const fullContent = e.target?.result;
        if (fullContent) {
          if (isBinary) {
            parseFileContent(fullContent, true);
          } else {
            parseFileContent(fullContent);
          }
        }
      };

      if (isBinary) {
        fullFileReader.readAsArrayBuffer(file);
      } else {
        fullFileReader.readAsText(file);
      }
    };

    reader.onload = (e) => {
      const content = e.target?.result;
      if (content && typeof content === "string") {
        const magicNumber = content.split("\n")[0];
        if (magicNumber === "P6") {
          readFullFile(true);
        } else {
          readFullFile(false);
        }
      }
    };

    reader.readAsText(file.slice(0, 20));
  };

  const parseFileContent = (
    content: string | ArrayBuffer,
    isBinary = false
  ) => {
    let magicNumber, width, height, maxVal: number;

    const pixelData = [];

    if (isBinary) {
      const data = new Uint8Array(content as ArrayBuffer);

      const headerEnd =
        data.indexOf(10, data.indexOf(10, data.indexOf(10) + 1) + 1) + 1;
      const headerText = new TextDecoder("utf-8").decode(
        data.slice(0, headerEnd)
      );
      const headerParts = headerText
        .split(/\s+/)
        .filter((part) => !part.startsWith("#"));

      width = parseInt(headerParts[1], 10);
      height = parseInt(headerParts[2], 10);

      for (let i = headerEnd; i < data.length; i += 3) {
        pixelData.push({
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
        });
      }
    } else {
      console.log(content);
      const lines = (content as string)
        .split("\n")
        .map((line) => line.split("#")[0].trim())
        .join(" ")
        .split(/\s+/);
      const nextValue = () => lines.shift() || "";

      magicNumber = nextValue();
      width = parseInt(nextValue(), 10);
      height = parseInt(nextValue(), 10);
      maxVal = parseInt(nextValue(), 10);

      const scaleValue = (value: number) => Math.round((value / maxVal) * 255);

      console.log(magicNumber, width, height, maxVal);

      if (magicNumber === "P3") {
        for (let i = 0; i < width * height; i++) {
          const r = scaleValue(parseInt(nextValue(), 10));
          const g = scaleValue(parseInt(nextValue(), 10));
          const b = scaleValue(parseInt(nextValue(), 10));
          pixelData.push({ r, g, b });
        }
      } else if (magicNumber === "P2" || magicNumber === "P5") {
        for (let i = 0; i < width * height; i++) {
          const value = scaleValue(parseInt(nextValue(), 10));
          pixelData.push({ r: value, g: value, b: value });
        }
      } else if (magicNumber === "P1" || magicNumber === "P4") {
        const firstPixel = maxVal === 0 ? 255 : 1;
        pixelData.push({ r: firstPixel, g: firstPixel, b: firstPixel });
        for (let i = 0; i < width * height; i++) {
          const value = parseInt(nextValue(), 10) === 0 ? 255 : 1;
          pixelData.push({ r: value, g: value, b: value });
        }
      }
    }

    renderToCanvas(pixelData, width, height);
  };

  const renderToCanvas = (
    pixelData: {
      r: number;
      g: number;
      b: number;
    }[],
    width: number,
    height: number
  ) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imageData = ctx.createImageData(width, height);

        for (let i = 0; i < pixelData.length; i++) {
          const pixelIndex = i * 4;
          imageData.data[pixelIndex] = pixelData[i].r;
          imageData.data[pixelIndex + 1] = pixelData[i].g;
          imageData.data[pixelIndex + 2] = pixelData[i].b;
          imageData.data[pixelIndex + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
      }
    }
  };

  return (
    <Box>
      <Button sx={{ mb: 2 }} variant="contained" component="label">
        Dodaj zdjęcie
        <input
          onChange={handleFileInput}
          type="file"
          accept=".ppm,.pgm,.pbm"
          hidden
        />
      </Button>
      <Typography>
        {currentFile ? currentFile.name : "Nie wybrano pliku"}
      </Typography>
      <canvas ref={canvasRef}></canvas>
    </Box>
  );
};

export default PS3;
