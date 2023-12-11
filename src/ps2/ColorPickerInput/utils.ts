import { AVAILABLE_COLORS } from "../FirstExercise/FirstExercise";
import ColorPickerInput from "./ColorPickerInput";

export const convertToRGB = ({
  color,
  type,
}:
  | {
      type: (typeof AVAILABLE_COLORS)["hsv"];
      color: Parameters<
        Extract<
          React.ComponentProps<typeof ColorPickerInput>,
          { type: "HSV" }
        >["onChange"]
      >[0];
    }
  | {
      type: (typeof AVAILABLE_COLORS)["cmyk"];
      color: Parameters<
        Extract<
          React.ComponentProps<typeof ColorPickerInput>,
          { type: "CMYK" }
        >["onChange"]
      >[0];
    }): Parameters<
  Extract<
    React.ComponentProps<typeof ColorPickerInput>,
    { type: "RGB" }
  >["onChange"]
>[0] => {
  switch (type) {
    case AVAILABLE_COLORS.hsv:
      console.log(color);
      const { h, s, v } = color;
      const c = (v / 100) * (s / 100);
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = v / 100 - c;

      let r = 0,
        g = 0,
        b = 0;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
      } else if (h >= 120 && h < 180) {
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        b = x;
      }

      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
      };
    case AVAILABLE_COLORS.cmyk:
      const cValue = color.c / 100;
      const mValue = color.m / 100;
      const yValue = color.y / 100;
      const kValue = color.k / 100;

      const rValue = 255 * (1 - cValue) * (1 - kValue);
      const gValue = 255 * (1 - mValue) * (1 - kValue);
      const bValue = 255 * (1 - yValue) * (1 - kValue);

      return {
        r: Math.round(rValue),
        g: Math.round(gValue),
        b: Math.round(bValue),
      };
  }
};

export const convertToHSV = (
  color: Parameters<
    Extract<
      React.ComponentProps<typeof ColorPickerInput>,
      { type: "RGB" }
    >["onChange"]
  >[0]
) => {
  const { r, g, b } = color;
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  const max = Math.max(normalizedR, normalizedG, normalizedB);
  const min = Math.min(normalizedR, normalizedG, normalizedB);

  const v = max;

  const s = max === 0 ? 0 : (max - min) / max;

  let h = 0;
  if (max === min) {
    h = 0;
  } else {
    const d = max - min;
    switch (max) {
      case normalizedR:
        h =
          (normalizedG - normalizedB) / d + (normalizedG < normalizedB ? 6 : 0);
        break;
      case normalizedG:
        h = (normalizedB - normalizedR) / d + 2;
        break;
      case normalizedB:
        h = (normalizedR - normalizedG) / d + 4;
        break;
    }
    h /= 6;
  }

  h *= 360;

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
};

export const convertToCMYK = (
  color: Parameters<
    Extract<
      React.ComponentProps<typeof ColorPickerInput>,
      { type: "RGB" }
    >["onChange"]
  >[0]
) => {
  const { r, g, b } = color;

  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };

  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  const c = 1 - normalizedR;
  const m = 1 - normalizedG;
  const y = 1 - normalizedB;

  const k = Math.min(c, m, y);

  const cNew = (c - k) / (1 - k);
  const mNew = (m - k) / (1 - k);
  const yNew = (y - k) / (1 - k);

  return {
    c: Math.round(cNew * 100),
    m: Math.round(mNew * 100),
    y: Math.round(yNew * 100),
    k: Math.round(k * 100),
  };
};

export const colorPickerContainer = {
  margin: "0.5rem",
  borderRadius: "50%",
  width: "120px",
  height: "100px",
  alignItems: "center",
  justifyContent: "space-between",
};
