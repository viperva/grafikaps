export const initializeCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = 1100;
  canvas.height = 700;

  ctx.fillStyle = "#e3e0dc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return { canvas, ctx };
};
