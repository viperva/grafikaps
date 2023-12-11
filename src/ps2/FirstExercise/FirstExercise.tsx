import { Box } from "@mui/material";
import { useState } from "react";
import { RgbColor } from "react-colorful";
import ColorPicker from "../ColorPicker/ColorPicker";
import ColorPickerInput from "../ColorPickerInput/ColorPickerInput";
import {
  convertToHSV,
  convertToCMYK,
  convertToRGB,
  colorPickerContainer,
} from "../ColorPickerInput/utils";

const DEFAULT_RGB_COLOR: RgbColor = {
  r: 0,
  g: 0,
  b: 0,
};

export const AVAILABLE_COLORS = {
  hsv: "HSV",
  rgb: "RGB",
  cmyk: "CMYK",
} as const;

const FirstExercise = () => {
  const [rgb, setRgb] = useState<RgbColor>(DEFAULT_RGB_COLOR);
  const [hsv, setHsv] = useState<{ h: number; s: number; v: number }>(
    convertToHSV(DEFAULT_RGB_COLOR)
  );
  const [cmyk, setCmyk] = useState<{
    c: number;
    m: number;
    y: number;
    k: number;
  }>(convertToCMYK(DEFAULT_RGB_COLOR));

  const handleRBGChange = (color: RgbColor) => {
    setRgb(color);
    setHsv(convertToHSV(color));
    setCmyk(convertToCMYK(color));
  };

  const handleCmykChange = (color: {
    c: number;
    m: number;
    y: number;
    k: number;
  }) => {
    setRgb(convertToRGB({ type: AVAILABLE_COLORS.cmyk, color }));
    setCmyk(color);
    setHsv(convertToHSV(convertToRGB({ type: AVAILABLE_COLORS.cmyk, color })));
  };

  const handleHsvChange = (color: { h: number; s: number; v: number }) => {
    setRgb(convertToRGB({ type: AVAILABLE_COLORS.hsv, color }));
    setHsv(color);
    setCmyk(convertToCMYK(convertToRGB({ type: AVAILABLE_COLORS.hsv, color })));
  };

  return (
    <Box
      //@ts-expect-error mui error
      sx={{
        display: "flex",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: "300px",
        padding: "20px",
        width: "700px",
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          margin: "0 20px",
          height: "100%",
        }}
      >
        <ColorPicker color={rgb} onChange={handleRBGChange} />
      </Box>
      <Box sx={colorPickerContainer}>
        <ColorPickerInput
          type={AVAILABLE_COLORS.rgb}
          color={rgb}
          onChange={handleRBGChange}
        />
      </Box>

      <Box sx={colorPickerContainer}>
        <ColorPickerInput
          type={AVAILABLE_COLORS.hsv}
          color={hsv}
          onChange={handleHsvChange}
        />
      </Box>
      <Box sx={colorPickerContainer}>
        <ColorPickerInput
          type={AVAILABLE_COLORS.cmyk}
          color={cmyk}
          onChange={handleCmykChange}
        />
      </Box>
    </Box>
  );
};

export default FirstExercise;
