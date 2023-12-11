import { TextField } from "@mui/material";
import { RgbColor } from "react-colorful";

type HSVColor = {
  h: number;
  s: number;
  v: number;
};

type CMYKColor = {
  c: number;
  m: number;
  y: number;
  k: number;
};

type Props =
  | {
      type: "RGB";
      onChange: (color: RgbColor) => void;
      color: RgbColor;
    }
  | {
      type: "CMYK";
      onChange: (color: CMYKColor) => void;
      color: CMYKColor;
    }
  | {
      type: "HSV";
      onChange: (color: HSVColor) => void;
      color: HSVColor;
    };

const isGreaterThan255 = (value: number) => value > 255;

const MAX_RGB_VALUE = 255;

const ColorPickerInput: React.FC<Props> = (Props) => {
  const { onChange, type, color } = Props;

  const handleChange = () => {
    if (type === "RGB") {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        onChange({
          ...color,
          [name.toLowerCase()]: isGreaterThan255(Number(value))
            ? MAX_RGB_VALUE
            : Number(value),
        });
      };
    }
    if (type === "CMYK") {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        onChange({
          ...color,
          [name.toLowerCase()]: Number(value),
        });
      };
    }

    if (type === "HSV") {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        onChange({
          ...color,
          [name.toLowerCase()]: Number(value),
        });
      };
    }
  };

  if (type === "RGB") {
    return (
      <>
        <TextField
          variant="filled"
          sx={{
            width: "100px",
            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="R"
          type="number"
          name="R"
          value={color.r}
          onChange={handleChange()}
        />
        <TextField
          variant="filled"
          type="number"
          sx={{
            width: "100px",

            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="G"
          name="G"
          value={color.g}
          onChange={handleChange()}
        />
        <TextField
          variant="filled"
          type="number"
          sx={{
            width: "100px",

            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="B"
          name="B"
          value={color.b}
          onChange={handleChange()}
        />
      </>
    );
  }

  if (type === "CMYK") {
    return (
      <>
        <TextField
          variant="filled"
          sx={{
            width: "100px",
            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="C"
          name="C"
          value={color.c}
          onChange={handleChange()}
        />{" "}
        <TextField
          variant="filled"
          sx={{
            width: "100px",
            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="M"
          name="M"
          value={color.m}
          onChange={handleChange()}
        />{" "}
        <TextField
          variant="filled"
          sx={{
            width: "100px",
            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="Y"
          name="Y"
          value={color.y}
          onChange={handleChange()}
        />{" "}
        <TextField
          variant="filled"
          sx={{
            width: "100px",
            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="K"
          name="K"
          value={color.k}
          onChange={handleChange()}
        />
      </>
    );
  }
  if (type === "HSV") {
    return (
      <>
        <TextField
          variant="filled"
          sx={{
            width: "100px",
            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="H"
          name="H"
          value={color.h}
          onChange={handleChange()}
        />
        <TextField
          variant="filled"
          sx={{
            width: "100px",
            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="S"
          name="S"
          value={color.s}
          onChange={handleChange()}
        />
        <TextField
          variant="filled"
          sx={{
            width: "100px",
            float: "left",
            mb: 2,
            backgroundColor: "#d6d4d4",
          }}
          label="V"
          name="V"
          value={color.v}
          onChange={handleChange()}
        />
      </>
    );
  }
};

export default ColorPickerInput;
