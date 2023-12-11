import { Box, Button, Input } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Histogram from "../components/histogram";
import {
  getEqualizedHistogramData,
  getGrayscaleHistogramData,
  getInputThresholdedArray,
  getPbsThreshold,
  getStreachedHistogramData,
  getOtsuThreshold,
  getMisThreshold,
  getEntropyThreshold,
  getNiblackThresholdedArray,
  getSauvolaThresholdedArray,
  getPhansalkarThresholdedArray,
} from "../utils.ts";

const PS5 = () => {
  const [image, setImage] = useState<null | string>(null);
  const [originalImage, setOriginalImage] = useState<null | string>(null);
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [histogramData, setHistogramData] = useState<number[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getImageData = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData.data;
  };

  const updateHistogram = (data: number[], newData: number[]) => {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = newData[i];
      data[i + 1] = newData[i + 1];
      data[i + 2] = newData[i + 2];
    }

    const newHistogramData = getGrayscaleHistogramData([...data]);
    setHistogramData(newHistogramData);
  };

  const updateImage = (data: number[], newData: number[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = newData[i];
      data[i + 1] = newData[i + 1];
      data[i + 2] = newData[i + 2];
    }

    imageData.data.set(new Uint8ClampedArray([...data]));

    ctx.putImageData(imageData, 0, 0);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageUrl(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result as string);
        setOriginalImage(reader.result as string);
      };
    }
  };

  const streatchHistogram = () => {
    const data = getImageData();
    if (!data) return;

    const streatchedHistogramData = getStreachedHistogramData([...data]);

    updateHistogram([...data], streatchedHistogramData);

    updateImage([...data], streatchedHistogramData);
  };

  const otsuHistogram = () => {
    const data = getImageData();
    if (!data) return;

    const otsuThreshold = getOtsuThreshold([...data]);

    const otsuHistogramData = getInputThresholdedArray(
      [...data],
      otsuThreshold
    );

    updateHistogram([...data], otsuHistogramData);

    updateImage([...data], otsuHistogramData);
  };

  const equalizeHistogram = () => {
    const data = getImageData();
    if (!data) return;

    const equalizedHistogramData = getEqualizedHistogramData([...data]);

    updateHistogram([...data], equalizedHistogramData);

    updateImage([...data], equalizedHistogramData);
  };

  const inputThresholding = () => {
    const data = getImageData();
    if (!data) return;

    const threshold = prompt("Podaj próg binaryzacji (0-255)") || "128";

    const inputThresholdedArray = getInputThresholdedArray(
      [...data],
      parseInt(threshold)
    );

    updateHistogram([...data], Array.from(inputThresholdedArray));

    updateImage([...data], Array.from(inputThresholdedArray));
  };

  const pbsThresholding = () => {
    const data = getImageData();
    if (!data) return;

    const blackPixelPercentage =
      prompt("Podaj procent czarnych pikseli (0-100)") || "50";

    const threshold = getPbsThreshold(
      [...data],
      parseInt(blackPixelPercentage)
    );

    const pbsThresholdedArray = getInputThresholdedArray([...data], threshold);

    updateHistogram([...data], Array.from(pbsThresholdedArray));

    updateImage([...data], Array.from(pbsThresholdedArray));
  };

  const misThresholding = () => {
    const data = getImageData();
    if (!data) return;

    const misThreshold = getMisThreshold([...data]);

    const misHistogramData = getInputThresholdedArray([...data], misThreshold);

    updateHistogram([...data], misHistogramData);

    updateImage([...data], misHistogramData);
  };

  const entropyThresholding = () => {
    const data = getImageData();
    if (!data) return;

    const entropyThreshold = getEntropyThreshold([...data]);

    const misHistogramData = getInputThresholdedArray(
      [...data],
      entropyThreshold
    );

    updateHistogram([...data], misHistogramData);

    updateImage([...data], misHistogramData);
  };

  const niblackThresholding = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const windowSize = prompt("Podaj windowSize") || "5";
    const k = prompt("Podaj k") || "0.5";

    const nibclackThresholdedArray = getNiblackThresholdedArray(
      [...data],
      width,
      height,
      parseInt(windowSize),
      parseFloat(k)
    );

    updateHistogram([...data], nibclackThresholdedArray);

    updateImage([...data], nibclackThresholdedArray);
  };

  const sauvolaThresholding = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const windowSize = prompt("Podaj windowSize") || "5";
    const k = prompt("Podaj k") || "0.5";

    const sauvolaThresholdedArray = getSauvolaThresholdedArray(
      [...data],
      width,
      height,
      parseInt(windowSize),
      parseFloat(k)
    );

    updateHistogram([...data], sauvolaThresholdedArray);

    updateImage([...data], sauvolaThresholdedArray);
  };

  const phansalkarThresholding = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const windowSize = prompt("Podaj windowSize") || "5";
    const k = prompt("Podaj k") || "0.5";

    const phansalkarThresholdedArray = getPhansalkarThresholdedArray(
      [...data],
      width,
      height,
      parseInt(windowSize),
      parseFloat(k)
    );

    updateHistogram([...data], phansalkarThresholdedArray);

    updateImage([...data], phansalkarThresholdedArray);
  };

  const restoreOriginalImage = () => {
    setImage(originalImage);

    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      const newHistogramData = getGrayscaleHistogramData([...data]);

      setHistogramData(newHistogramData);
    };
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

      const histogramData = getGrayscaleHistogramData([
        ...ctx.getImageData(0, 0, canvas.width, canvas.height).data,
      ]);

      setHistogramData(histogramData);
    };
  }, [image]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
            width: "30%",
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
        </Box>
        <Histogram histogramData={histogramData} imageUrl={imageUrl || ""} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-evenly",
          marginTop: "2rem",
          gap: "1rem",
        }}
      >
        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          onClick={streatchHistogram}
        >
          Rozciągnij histogram
        </Button>
        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          onClick={equalizeHistogram}
        >
          Wyrównaj histogram
        </Button>

        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          onClick={otsuHistogram}
        >
          Binaryzacja Otsu
        </Button>

        <Button
          onClick={restoreOriginalImage}
          style={{
            borderRadius: 35,
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          color="warning"
        >
          Przywróć oryginał
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-evenly",
          marginTop: "2rem",
          gap: "1rem",
        }}
      >
        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          onClick={inputThresholding}
        >
          Binaryzacja ręczna
        </Button>
        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          onClick={pbsThresholding}
        >
          Procentowa selekcja czarnego
        </Button>

        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          onClick={misThresholding}
        >
          Selekcja iteratywna średniej
        </Button>

        <Button
          onClick={entropyThresholding}
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
        >
          Selekcja entropii
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-evenly",
          marginTop: "2rem",
          gap: "1rem",
        }}
      >
        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          onClick={niblackThresholding}
        >
          Binaryzacja Niblack
        </Button>
        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          onClick={sauvolaThresholding}
        >
          Binaryzacja Sauvola
        </Button>

        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#047562",
            padding: "4px 8px",
            fontSize: "14px",

            fontWeight: "bold",
          }}
          variant="contained"
          onClick={phansalkarThresholding}
        >
          Binaryzacja Phansalkar
        </Button>
      </Box>
    </Box>
  );
};

export default PS5;
