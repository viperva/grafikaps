import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { initializeCanvas } from "../utils";

const PS1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasInfo = initializeCanvas(canvasRef);
    if (!canvasInfo) return;
    const { canvas, ctx } = canvasInfo;

    let drawing = false;
    let startX: number | undefined;
    let startY: number | undefined;

    const startDrawing = (e: MouseEvent) => {
      drawing = true;
      startX = e.offsetX;
      startY = e.offsetY;
    };

    const draw = (e: MouseEvent) => {
      if (!drawing || startX === undefined || startY === undefined) return;
      const x = e.offsetX;
      const y = e.offsetY;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();

      startX = x;
      startY = y;
    };

    const stopDrawing = () => {
      drawing = false;
      startX = undefined;
      startY = undefined;
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, []);

  return (
    <Box>
      <canvas ref={canvasRef}></canvas>
    </Box>
  );
};

export default PS1;
