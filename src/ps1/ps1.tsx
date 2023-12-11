import {
  Box,
  Button,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";

type SavedCanvas = {
  name: string;
  data: string;
};

type Rectangle = {
  type: string;
  startX: number;
  startY: number;
  width: number;
  height: number;
};

type Ellipsis = {
  type: string;
  startX: number;
  startY: number;
  width: number;
  height: number;
};

type Line = {
  type: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type Triangle = {
  type: string;
  startX: number;
  startY: number;
  width: number;
  height: number;
};

type Figure = Rectangle | Ellipsis | Line | Triangle;

type Point = {
  x: number;
  y: number;
};

type Stroke = {
  points: Point[];
};

type Text = {
  startX: number;
  startY: number;
  text: string;
};

const PS1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasName, setCanvasName] = useState<string>("");
  const [loadCanvasWindowOpen, setLoadCanvasWindowOpen] =
    useState<boolean>(false);

  const [startX, setStartX] = useState<number | undefined>(undefined);
  const [startY, setStartY] = useState<number | undefined>(undefined);
  const [currentTool, setCurrentTool] = useState<
    "pencil" | "rectangle" | "text" | "line" | "ellipsis" | "triangle"
  >("pencil");
  const [figures, setFigures] = useState<Figure[]>([]);
  const [handStrokes, setHandStrokes] = useState<Stroke[]>([]);
  const [texts, setTexts] = useState<Text[]>([]);
  const [loadedCanvas, setLoadedCanvas] = useState<SavedCanvas | undefined>(
    undefined
  );

  const startDrawing = useCallback(
    (e: MouseEvent) => {
      if (
        currentTool !== "pencil" &&
        currentTool !== "line" &&
        currentTool !== "rectangle" &&
        currentTool !== "ellipsis" &&
        currentTool !== "triangle"
      )
        return;
      setStartX(e.offsetX);
      setStartY(e.offsetY);
      if (currentTool === "pencil") {
        setHandStrokes([
          ...handStrokes,
          { points: [{ x: e.offsetX, y: e.offsetY }] },
        ]);
      } else {
        const newFigure: Figure = {
          type: currentTool,
          startX: e.offsetX,
          startY: e.offsetY,
          width: 0,
          height: 0,
        };
        setFigures([...figures, newFigure]);
      }
    },
    [currentTool, figures, handStrokes]
  );

  const draw = useCallback(
    (e: MouseEvent) => {
      if (
        currentTool !== "pencil" ||
        startX === undefined ||
        startY === undefined
      )
        return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const x = e.offsetX;
      const y = e.offsetY;

      setHandStrokes(
        handStrokes.map((stroke, index) => {
          if (index === handStrokes.length - 1) {
            return {
              points: [...stroke.points, { x, y }],
            };
          }
          return stroke;
        })
      );

      setStartX(x);
      setStartY(y);
    },
    [currentTool, handStrokes, startX, startY]
  );

  const write = useCallback(
    (e: MouseEvent) => {
      if (currentTool !== "text") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const x = e.offsetX;
      const y = e.offsetY;
      const text = prompt("Wpisz tekst");
      if (!text) return;
      setTexts([
        ...texts,
        {
          startX: x,
          startY: y,
          text,
        },
      ]);
    },
    [currentTool, texts]
  );

  const drawLine = useCallback(
    (e: MouseEvent) => {
      if (currentTool !== "line" || !startX || !startY) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const x = e.offsetX;
      const y = e.offsetY;
      ctx.stroke();
      setFigures(
        figures.map((figure, index) => {
          if (index === figures.length - 1) {
            return {
              type: currentTool,
              startX,
              startY,
              endX: x,
              endY: y,
            };
          }
          return figure;
        })
      );
    },
    [currentTool, figures, startX, startY]
  );

  const drawRectangle = useCallback(
    (e: MouseEvent) => {
      if (currentTool !== "rectangle" || !startX || !startY) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const x = e.offsetX;
      const y = e.offsetY;
      const width = x - startX;
      const height = y - startY;
      ctx.strokeRect(startX, startY, width, height);
      setFigures(
        figures.map((figure, index) => {
          if (index === figures.length - 1) {
            return {
              type: currentTool,
              startX,
              startY,
              width,
              height,
            };
          }
          return figure;
        })
      );
    },
    [currentTool, figures, startX, startY]
  );

  const drawEllipsis = useCallback(
    (e: MouseEvent) => {
      if (currentTool !== "ellipsis" || !startX || !startY) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const x = e.offsetX;
      const y = e.offsetY;
      const width = x - startX;
      const height = y - startY;
      setFigures(
        figures.map((figure, index) => {
          if (index === figures.length - 1) {
            return {
              type: currentTool,
              startX,
              startY,
              width,
              height,
            };
          }
          return figure;
        })
      );
    },
    [currentTool, figures, startX, startY]
  );

  const drawTriangle = useCallback(
    (e: MouseEvent) => {
      if (currentTool !== "triangle" || !startX || !startY) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const x = e.offsetX;
      const y = e.offsetY;
      const width = x - startX;
      const height = y - startY;
      setFigures(
        figures.map((figure, index) => {
          if (index === figures.length - 1) {
            return {
              type: currentTool,
              startX,
              startY,
              width,
              height,
            };
          }
          return figure;
        })
      );
    },
    [currentTool, figures, startX, startY]
  );

  const stopDrawing = () => {
    setStartX(undefined);
    setStartY(undefined);
  };

  const renderElements = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      handStrokes.forEach((stroke) => {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      });

      figures.forEach((figure) => {
        if (figure.type === "rectangle") {
          const rectangle = figure as Rectangle;
          ctx.strokeRect(
            rectangle.startX,
            rectangle.startY,
            rectangle.width,
            rectangle.height
          );
        } else if (figure.type === "ellipsis") {
          const ellipsis = figure as Ellipsis;
          ctx.beginPath();
          ctx.ellipse(
            ellipsis.startX,
            ellipsis.startY,
            Math.abs(ellipsis.width),
            Math.abs(ellipsis.height),
            0,
            0,
            2 * Math.PI
          );
          ctx.stroke();
        } else if (figure.type === "line") {
          const line = figure as Line;
          ctx.beginPath();
          ctx.moveTo(line.startX, line.startY);
          ctx.lineTo(line.endX, line.endY);
          ctx.stroke();
        } else if (figure.type === "triangle") {
          const triangle = figure as Triangle;
          ctx.beginPath();
          ctx.moveTo(triangle.startX, triangle.startY);
          ctx.lineTo(triangle.startX + triangle.width, triangle.startY);
          ctx.lineTo(
            triangle.startX + triangle.width / 2,
            triangle.startY - triangle.height
          );
          ctx.closePath();
          ctx.stroke();
        }
      });

      texts.forEach((text) => {
        ctx.font = "20px Arial";
        ctx.fillText(text.text, text.startX, text.startY);
      });
    },
    [figures, handStrokes, texts]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 600;

    ctx.fillStyle = "#e3e0dc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (loadedCanvas) {
      const image = new Image();
      image.src = loadedCanvas.data;
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        renderElements(ctx);
      };
    } else {
      ctx.fillStyle = "#e3e0dc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      renderElements(ctx);
    }
  }, [figures, handStrokes, loadedCanvas, renderElements, texts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousedown", write);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mousemove", drawLine);
    canvas.addEventListener("mousemove", drawRectangle);
    canvas.addEventListener("mousemove", drawEllipsis);
    canvas.addEventListener("mousemove", drawTriangle);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousedown", write);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mousemove", drawLine);
      canvas.removeEventListener("mousemove", drawRectangle);
      canvas.removeEventListener("mousemove", drawEllipsis);
      canvas.removeEventListener("mousemove", drawTriangle);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, [
    draw,
    currentTool,
    startDrawing,
    write,
    drawLine,
    drawRectangle,
    drawEllipsis,
    drawTriangle,
  ]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#e3e0dc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setFigures([]);
    setHandStrokes([]);
    setTexts([]);
    setLoadedCanvas(undefined);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${canvasName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const savedCanvases = localStorage.getItem("savedCanvases");
    let savedCanvasesArray: SavedCanvas[] = savedCanvases
      ? JSON.parse(savedCanvases)
      : [];
    const newCanvas = {
      name: canvasName,
      data: canvas.toDataURL(),
    };
    if (savedCanvasesArray.find((canvas) => canvas.name === canvasName)) {
      savedCanvasesArray = savedCanvasesArray.map((canvas) => {
        if (canvas.name === canvasName) {
          return newCanvas;
        }
        return canvas;
      });
    } else {
      savedCanvasesArray.push(newCanvas);
    }
    localStorage.setItem("savedCanvases", JSON.stringify(savedCanvasesArray));
  };

  const getSavedCanvases = () => {
    const savedCanvases = localStorage.getItem("savedCanvases");
    if (!savedCanvases) return;
    return JSON.parse(savedCanvases);
  };

  const loadCanvas = (canvasToLoad: SavedCanvas) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = new Image();
    image.src = canvasToLoad.data;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
    setCanvasName(canvasToLoad.name);
    setFigures([]);
    setHandStrokes([]);
    setTexts([]);
    setLoadedCanvas(canvasToLoad);
  };

  const handleToolChange = (
    event: React.MouseEvent<HTMLElement>,
    newTool: "pencil" | "rectangle" | "text" | "line" | "ellipsis" | "triangle"
  ) => {
    if (newTool !== null) {
      setCurrentTool(newTool);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
        }}
      >
        <TextField
          sx={{
            width: "20vw",
            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="Nazwa pliku"
          variant="filled"
          value={canvasName}
          onChange={(e) => setCanvasName(e.target.value)}
        />
        <Button onClick={saveCanvas}>Zapisz</Button>
        <Button onClick={downloadCanvas}>Pobierz</Button>
        <Button onClick={clearCanvas}>Wyczyść</Button>
        <Button onClick={() => setLoadCanvasWindowOpen(true)}>Wczytaj</Button>
      </Box>
      <canvas ref={canvasRef}></canvas>
      <ToggleButtonGroup
        sx={{
          mt: 1,
          "& .MuiToggleButton-root": {
            border: "1px solid",
          },
          "& .Mui-selected": {
            backgroundColor: "Background",
          },
        }}
        value={currentTool}
        exclusive
        onChange={handleToolChange}
        color="success"
      >
        <ToggleButton value="pencil">
          <CreateIcon color="info" />
        </ToggleButton>
        <ToggleButton value="rectangle">
          <CheckBoxOutlineBlankIcon color="info" />
        </ToggleButton>
        <ToggleButton value="text">
          <TextFieldsIcon color="info" />
        </ToggleButton>
        <ToggleButton value="line">
          <HorizontalRuleIcon color="info" />
        </ToggleButton>
        <ToggleButton value="ellipsis">
          <RadioButtonUncheckedIcon color="info" />
        </ToggleButton>
        <ToggleButton value="triangle">
          <ChangeHistoryIcon color="info" />
        </ToggleButton>
      </ToggleButtonGroup>
      <Popover
        onClose={() => setLoadCanvasWindowOpen(false)}
        open={loadCanvasWindowOpen}
        anchorEl={canvasRef.current}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: 2,
            borderRadius: 2,
          }}
        >
          {getSavedCanvases()?.map((canvas: SavedCanvas) => {
            if (canvas.name === "") return;
            return (
              <Button
                key={canvas.name}
                onClick={() => {
                  loadCanvas(canvas);
                  setLoadCanvasWindowOpen(false);
                }}
              >
                {canvas.name}
              </Button>
            );
          })}
        </Box>
      </Popover>
    </Box>
  );
};

export default PS1;
